/**
 * LIVE INTRADAY OPTIONS SCANNER - Node.js/TypeScript Port
 * =========================================================
 * Price data:
 *   - Historical candles (patterns/RSI/trend): Twelve Data (~1 min) OR Yahoo Finance (~15 min fallback)
 *   - Current spot price: NSE Live via cookie session (~30 sec delay)
 *   - Open Interest (PCR/MaxPain/walls): NSE Live via cookie session
 */

import { logger } from "../utils/logger";
import { nseSession } from "./nse-session.service";

// ─── Constants ───────────────────────────────────────────────────────────────

const INDEX_NAMES: Record<string, string> = {
  "^NSEI": "NIFTY",
  "^NSEBANK": "BANKNIFTY",
};

const STRIKE_GAPS: Record<string, number> = {
  "^NSEI": 50,
  "^NSEBANK": 100,
};

const TIMEFRAMES = [
  { interval: "5m",  period: "5d",  label: "5 min",  weight: 1 },
  { interval: "15m", period: "1mo", label: "15 min", weight: 2 },
  { interval: "30m", period: "1mo", label: "30 min", weight: 2 },
  { interval: "1h",  period: "1mo", label: "1 hour", weight: 3 },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

interface OHLCV {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Pattern {
  pattern: string;
  bias: "bullish" | "bearish";
  date: Date;
  index: number;
}

interface TimeframeResult {
  pattern: string;
  bias: "bullish" | "bearish";
  date: Date;
  score: number;
  note: string;
  currentPrice: number;
  currentRsi: number | null;
  currentTrend: string | null;
  candleSource: "yahoo-finance";
}

interface TimeframeDetail {
  tf: string;
  label: string;
  bias: "bullish" | "bearish" | "none";
  pattern: string;
  score: number;
  note?: string;
  rsi?: number | null;
  trend?: string | null;
}

interface OIData {
  pcr: number;
  maxPainStrike: number;
  topCEOIStrike: number;
  topPEOIStrike: number;
  oiBias: "bullish" | "bearish" | "neutral";
  oiBiasNote: string;
}

export interface ConfluenceResult {
  indexName: string;
  symbol: string;
  currentPrice: number;
  atmStrike: number;
  action: "BUY CE" | "BUY PE" | "NO TRADE";
  strength: "STRONG" | "MODERATE" | "WEAK" | "AVOID";
  optionType: "CE" | "PE" | null;
  suggestedStrike: number | null;
  otmStrike: number | null;
  confidence: number;
  agreeingTfs: number;
  totalTfs: number;
  overallBias: "bullish" | "bearish" | "neutral" | "conflicting";
  reason: string;
  details: TimeframeDetail[];
  sl: number | null;
  target: number | null;
  oi?: OIData | null;
  /** Where the current spot price came from */
  priceSource: "nse-live" | "yahoo-fallback";
  /** Where the OHLCV candle data came from */
  candleSource: "yahoo-finance";
}

// ─── OHLCV Fetcher: Yahoo Finance ───────────────────────────────────────────

/**
 * Fetches OHLCV candles from Yahoo Finance (~15 min delay)
 *
 * Returns: { data: OHLCV[], source: "yahoo-finance" }
 */
async function fetchOHLC(
  symbol: string,
  period: string,
  interval: string
): Promise<{ data: OHLCV[]; source: "yahoo-finance" }> {
  const data = await fetchOHLCYahoo(symbol, period, interval);
  return { data, source: "yahoo-finance" };
}

/** Yahoo Finance OHLCV fetcher (fallback) */
async function fetchOHLCYahoo(symbol: string, period: string, interval: string): Promise<OHLCV[]> {
  const rangeMap: Record<string, string> = {
    "5d": "5d", "1mo": "1mo", "3mo": "3mo",
  };
  const range = rangeMap[period] || period;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&includePrePost=false`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; CareerOS-Scanner/1.0)" },
  });

  if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status} for ${symbol}`);

  const json = (await res.json()) as any;
  const chart = json?.chart?.result?.[0];
  if (!chart) throw new Error(`No data returned for ${symbol}`);

  const timestamps: number[] = chart.timestamp || [];
  const quote = chart.indicators?.quote?.[0] || {};
  const opens: number[] = quote.open || [];
  const highs: number[] = quote.high || [];
  const lows: number[] = quote.low || [];
  const closes: number[] = quote.close || [];
  const volumes: number[] = quote.volume || [];

  const rows: OHLCV[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    if (closes[i] == null) continue;
    rows.push({
      date: new Date(timestamps[i] * 1000),
      open: opens[i] ?? closes[i],
      high: highs[i] ?? closes[i],
      low: lows[i] ?? closes[i],
      close: closes[i],
      volume: volumes[i] ?? 0,
    });
  }
  return rows;
}

// ─── Technical Indicators ────────────────────────────────────────────────────

function computeRSI(data: OHLCV[], period = 14): number[] {
  if (data.length < period + 1) return [];
  const closes = data.map((d) => d.close);
  const rsi: number[] = new Array(period).fill(NaN);

  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses += -diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  rsi.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    rsi.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }
  return rsi;
}

function computeVolRatio(data: OHLCV[], period = 20): number {
  if (data.length < period + 1) return 1;
  const vols = data.map((d) => d.volume);
  const last = vols[vols.length - 1];
  const avg = vols.slice(-period - 1, -1).reduce((a, b) => a + b, 0) / period;
  return avg === 0 ? 1 : last / avg;
}

function computeTrend(data: OHLCV[], period = 20): string {
  if (data.length < period) return "neutral";
  const closes = data.map((d) => d.close);
  const ma = closes.slice(-period).reduce((a, b) => a + b, 0) / period;
  const last = closes[closes.length - 1];
  if (last > ma * 1.005) return "uptrend";
  if (last < ma * 0.995) return "downtrend";
  return "sideways";
}

function getAtmStrike(price: number, gap: number): number {
  return Math.round(price / gap) * gap;
}

// ─── Pattern Detection ───────────────────────────────────────────────────────

function scanPatterns(data: OHLCV[]): Pattern[] {
  const patterns: Pattern[] = [];
  if (data.length < 5) return patterns;

  for (let i = 2; i < data.length; i++) {
    const c = data[i];
    const p1 = data[i - 1];
    const p2 = data[i - 2];

    const bodySize = Math.abs(c.close - c.open);
    const totalRange = c.high - c.low;
    const upperWick = c.high - Math.max(c.open, c.close);
    const lowerWick = Math.min(c.open, c.close) - c.low;

    // ── Bullish ──────────────────────────────────────────────────
    if (lowerWick > bodySize * 2 && upperWick < bodySize * 0.5 && totalRange > 0)
      patterns.push({ pattern: "Hammer", bias: "bullish", date: c.date, index: i });

    if (p1.close < p1.open && c.close > c.open && c.open < p1.close && c.close > p1.open)
      patterns.push({ pattern: "Bullish Engulfing", bias: "bullish", date: c.date, index: i });

    if (i >= 2) {
      const star = data[i - 1], first = data[i - 2];
      if (
        first.close < first.open &&
        Math.abs(star.close - star.open) < (star.high - star.low) * 0.3 &&
        c.close > c.open && c.close > (first.open + first.close) / 2
      ) patterns.push({ pattern: "Morning Star", bias: "bullish", date: c.date, index: i });
    }

    if (
      p1.close < p1.open && c.close > c.open &&
      c.open < p1.low && c.close > (p1.open + p1.close) / 2 && c.close < p1.open
    ) patterns.push({ pattern: "Piercing Line", bias: "bullish", date: c.date, index: i });

    if (i >= 2) {
      const c1 = data[i - 2], c2 = data[i - 1], c3 = data[i];
      if (
        c1.close > c1.open && c2.close > c2.open && c3.close > c3.open &&
        c2.open > c1.open && c2.close > c1.close && c3.open > c2.open && c3.close > c2.close
      ) patterns.push({ pattern: "Three White Soldiers", bias: "bullish", date: c.date, index: i });
    }

    // ── Bearish ──────────────────────────────────────────────────
    if (upperWick > bodySize * 2 && lowerWick < bodySize * 0.5 && totalRange > 0)
      patterns.push({ pattern: "Shooting Star", bias: "bearish", date: c.date, index: i });

    if (p1.close > p1.open && c.close < c.open && c.open > p1.close && c.close < p1.open)
      patterns.push({ pattern: "Bearish Engulfing", bias: "bearish", date: c.date, index: i });

    if (i >= 2) {
      const star = data[i - 1], first = data[i - 2];
      if (
        first.close > first.open &&
        Math.abs(star.close - star.open) < (star.high - star.low) * 0.3 &&
        c.close < c.open && c.close < (first.open + first.close) / 2
      ) patterns.push({ pattern: "Evening Star", bias: "bearish", date: c.date, index: i });
    }

    if (
      p1.close > p1.open && c.close < c.open &&
      c.open > p1.high && c.close < (p1.open + p1.close) / 2 && c.close > p1.open
    ) patterns.push({ pattern: "Dark Cloud Cover", bias: "bearish", date: c.date, index: i });

    if (i >= 2) {
      const c1 = data[i - 2], c2 = data[i - 1], c3 = data[i];
      if (
        c1.close < c1.open && c2.close < c2.open && c3.close < c3.open &&
        c2.open < c1.open && c2.close < c1.close && c3.open < c2.open && c3.close < c2.close
      ) patterns.push({ pattern: "Three Black Crows", bias: "bearish", date: c.date, index: i });
    }

    // suppress unused variable warning
    void p2;
  }

  return patterns;
}

function scorePattern(
  _data: OHLCV[],
  pattern: Pattern,
  rsiValues: number[],
  volRatio: number,
  trend: string
): { score: number; note: string } {
  let score = 0;
  const notes: string[] = [];
  const lastRsi = rsiValues[rsiValues.length - 1];

  if (pattern.bias === "bullish") {
    if (!isNaN(lastRsi) && lastRsi < 50) { score++; notes.push("RSI<50"); }
    if (volRatio > 1.2) { score++; notes.push("HighVol"); }
    if (trend === "uptrend") { score++; notes.push("Uptrend"); }
  } else {
    if (!isNaN(lastRsi) && lastRsi > 50) { score++; notes.push("RSI>50"); }
    if (volRatio > 1.2) { score++; notes.push("HighVol"); }
    if (trend === "downtrend") { score++; notes.push("Downtrend"); }
  }

  return { score, note: notes.join(", ") || "—" };
}

// ─── NSE OI Data (via cookie session — more reliable) ────────────────────────

async function fetchNSEOIData(indexName: "NIFTY" | "BANKNIFTY"): Promise<OIData | null> {
  try {
    // Use the session-managed fetch (handles cookie refresh automatically)
    const data = await nseSession.getOptionChain(indexName);
    if (!data) return null;

    const records = data?.records?.data;
    if (!Array.isArray(records) || records.length === 0) return null;

    const atm: number = data?.records?.underlyingValue ?? 0;
    const strikeGap = indexName === "NIFTY" ? 50 : 100;
    const atmStrike = getAtmStrike(atm, strikeGap);

    const strikeMap: Record<number, { ceOI: number; peOI: number }> = {};
    let totalCEOI = 0, totalPEOI = 0;

    for (const rec of records) {
      const strike: number = rec.strikePrice;
      if (!strikeMap[strike]) strikeMap[strike] = { ceOI: 0, peOI: 0 };
      if (rec.CE?.openInterest) { strikeMap[strike].ceOI += rec.CE.openInterest; totalCEOI += rec.CE.openInterest; }
      if (rec.PE?.openInterest) { strikeMap[strike].peOI += rec.PE.openInterest; totalPEOI += rec.PE.openInterest; }
    }

    const pcr = totalCEOI > 0 ? +(totalPEOI / totalCEOI).toFixed(2) : 1;

    let topCEOIStrike = atmStrike, maxCEOI = 0;
    let topPEOIStrike = atmStrike, maxPEOI = 0;
    for (const [strike, { ceOI, peOI }] of Object.entries(strikeMap)) {
      const s = Number(strike);
      if (Math.abs(s - atmStrike) <= strikeGap * 10) {
        if (ceOI > maxCEOI) { maxCEOI = ceOI; topCEOIStrike = s; }
        if (peOI > maxPEOI) { maxPEOI = peOI; topPEOIStrike = s; }
      }
    }

    // Max Pain calculation
    let minPain = Infinity, maxPainStrike = atmStrike;
    const strikes = Object.keys(strikeMap)
      .map(Number)
      .filter((s) => Math.abs(s - atmStrike) <= strikeGap * 15)
      .sort((a, b) => a - b);

    for (const expiry of strikes) {
      let pain = 0;
      for (const [s, { ceOI, peOI }] of Object.entries(strikeMap)) {
        const strike = Number(s);
        if (expiry > strike) pain += (expiry - strike) * ceOI;
        if (expiry < strike) pain += (strike - expiry) * peOI;
      }
      if (pain < minPain) { minPain = pain; maxPainStrike = expiry; }
    }

    let oiBias: "bullish" | "bearish" | "neutral";
    let oiBiasNote: string;

    if (pcr > 1.2 && maxPainStrike > atm) {
      oiBias = "bullish";
      oiBiasNote = `PCR ${pcr} (put-heavy, contrarian bullish) + Max Pain ${maxPainStrike} > price`;
    } else if (pcr < 0.7 && maxPainStrike < atm) {
      oiBias = "bearish";
      oiBiasNote = `PCR ${pcr} (call-heavy, contrarian bearish) + Max Pain ${maxPainStrike} < price`;
    } else if (maxPainStrike > atm * 1.005) {
      oiBias = "bullish";
      oiBiasNote = `Max Pain ${maxPainStrike} > current ${atm.toFixed(0)} — upside pull`;
    } else if (maxPainStrike < atm * 0.995) {
      oiBias = "bearish";
      oiBiasNote = `Max Pain ${maxPainStrike} < current ${atm.toFixed(0)} — downside pull`;
    } else {
      oiBias = "neutral";
      oiBiasNote = `PCR ${pcr} | Max Pain ${maxPainStrike}`;
    }

    return { pcr, maxPainStrike, topCEOIStrike, topPEOIStrike, oiBias, oiBiasNote };
  } catch (err) {
    logger.warn({ err }, "NSE OI fetch failed");
    return null;
  }
}

// ─── Per-Timeframe Scan ───────────────────────────────────────────────────────

async function scanTimeframe(
  symbol: string,
  interval: string,
  period: string
): Promise<TimeframeResult | null> {
  try {
    const { data, source } = await fetchOHLC(symbol, period, interval);
    if (data.length < 10) return null;

    const patterns = scanPatterns(data);
    if (patterns.length === 0) return null;

    const best = patterns.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    const rsiValues = computeRSI(data);
    const volRatio = computeVolRatio(data);
    const trend = computeTrend(data);
    const { score, note } = scorePattern(data, best, rsiValues, volRatio, trend);

    const currentPrice = data[data.length - 1].close;
    const lastRsi = rsiValues[rsiValues.length - 1];

    return {
      pattern: best.pattern,
      bias: best.bias,
      date: best.date,
      score,
      note,
      currentPrice,
      currentRsi: isNaN(lastRsi) ? null : lastRsi,
      currentTrend: trend,
      candleSource: source,
    };
  } catch (err: any) {
    logger.warn("  %s %s scan failed: %s", symbol, interval, err.message);
    return null;
  }
}

// ─── Multi-Timeframe Confluence ───────────────────────────────────────────────

async function computeConfluence(
  results: Record<string, TimeframeResult | null>,
  symbol: string,
  oiData: OIData | null
): Promise<ConfluenceResult | null> {
  let bullishWeight = 0;
  let bearishWeight = 0;
  let currentPrice: number | null = null;
  let candleSource: "yahoo-finance" = "yahoo-finance";
  const details: TimeframeDetail[] = [];

  for (const tf of TIMEFRAMES) {
    const result = results[tf.interval];
    if (result !== null && result !== undefined) {
      currentPrice = result.currentPrice;
      candleSource = result.candleSource;
    }

    if (!result) {
      details.push({ tf: tf.interval, label: tf.label, bias: "none", pattern: "—", score: 0 });
      continue;
    }

    if (result.bias === "bullish") bullishWeight += tf.weight * (1 + result.score * 0.5);
    else bearishWeight += tf.weight * (1 + result.score * 0.5);

    details.push({
      tf: tf.interval, label: tf.label, bias: result.bias,
      pattern: result.pattern, score: result.score, note: result.note,
      rsi: result.currentRsi, trend: result.currentTrend,
    });
  }

  if (currentPrice === null) return null;

  // OI adjustment
  const OI_WEIGHT = 2;
  if (oiData) {
    if (oiData.oiBias === "bullish") bullishWeight += OI_WEIGHT;
    else if (oiData.oiBias === "bearish") bearishWeight += OI_WEIGHT;
  }

  const totalSignal = bullishWeight + bearishWeight;
  let overallBias: "bullish" | "bearish" | "neutral" | "conflicting";
  let confidence: number;

  if (totalSignal === 0) { overallBias = "neutral"; confidence = 0; }
  else if (bullishWeight > bearishWeight) { overallBias = "bullish"; confidence = bullishWeight / totalSignal; }
  else if (bearishWeight > bullishWeight) { overallBias = "bearish"; confidence = bearishWeight / totalSignal; }
  else { overallBias = "conflicting"; confidence = 0; }

  const agreeingTfs = details.filter((d) => d.bias === overallBias).length;
  const totalTfs = details.filter((d) => d.bias !== "none").length;

  const strikeGap = STRIKE_GAPS[symbol] ?? 50;
  const atmStrike = getAtmStrike(currentPrice, strikeGap);
  const indexName = INDEX_NAMES[symbol] ?? symbol;

  let action: "BUY CE" | "BUY PE" | "NO TRADE";
  let strength: "STRONG" | "MODERATE" | "WEAK" | "AVOID";
  let optionType: "CE" | "PE" | null = null;
  let suggestedStrike: number | null = null;
  let otmStrike: number | null = null;
  let sl: number | null = null;
  let target: number | null = null;
  let reason: string;

  if (overallBias === "neutral" || overallBias === "conflicting" || confidence < 0.55) {
    action = "NO TRADE"; strength = "AVOID";
    reason = "Timeframes conflicting or neutral. No clear direction. Stay out.";
    if (oiData) reason += ` OI: ${oiData.oiBiasNote}.`;
  } else if (overallBias === "bullish") {
    action = "BUY CE"; optionType = "CE";
    const riskPts = currentPrice * 0.004;
    sl = +(currentPrice - riskPts).toFixed(2);
    target = +(currentPrice + riskPts * 2).toFixed(2);

    if (confidence > 0.75 && agreeingTfs >= 3) {
      suggestedStrike = atmStrike; otmStrike = atmStrike + strikeGap; strength = "STRONG";
    } else if (confidence > 0.6 && agreeingTfs >= 2) {
      suggestedStrike = atmStrike + strikeGap; otmStrike = atmStrike + 2 * strikeGap; strength = "MODERATE";
    } else {
      suggestedStrike = atmStrike + 2 * strikeGap; otmStrike = atmStrike + 3 * strikeGap; strength = "WEAK";
    }

    reason = `${strength} bullish (${agreeingTfs}/${totalTfs} TFs agree). Buy ${indexName} ${suggestedStrike} CE. SL: ${sl}, Target: ${target}.`;
    if (oiData) {
      reason += ` OI: ${oiData.oiBiasNote}.`;
      if (oiData.topCEOIStrike) reason += ` CE wall at ${oiData.topCEOIStrike} (resistance).`;
    }
  } else {
    action = "BUY PE"; optionType = "PE";
    const riskPts = currentPrice * 0.004;
    sl = +(currentPrice + riskPts).toFixed(2);
    target = +(currentPrice - riskPts * 2).toFixed(2);

    if (confidence > 0.75 && agreeingTfs >= 3) {
      suggestedStrike = atmStrike; otmStrike = atmStrike - strikeGap; strength = "STRONG";
    } else if (confidence > 0.6 && agreeingTfs >= 2) {
      suggestedStrike = atmStrike - strikeGap; otmStrike = atmStrike - 2 * strikeGap; strength = "MODERATE";
    } else {
      suggestedStrike = atmStrike - 2 * strikeGap; otmStrike = atmStrike - 3 * strikeGap; strength = "WEAK";
    }

    reason = `${strength} bearish (${agreeingTfs}/${totalTfs} TFs agree). Buy ${indexName} ${suggestedStrike} PE. SL: ${sl}, Target: ${target}.`;
    if (oiData) {
      reason += ` OI: ${oiData.oiBiasNote}.`;
      if (oiData.topPEOIStrike) reason += ` PE support at ${oiData.topPEOIStrike}.`;
    }
  }

  return {
    indexName, symbol, currentPrice, atmStrike, action, strength,
    optionType, suggestedStrike, otmStrike, confidence,
    agreeingTfs, totalTfs, overallBias, reason, details, sl, target, oi: oiData,
    priceSource: "yahoo-fallback",  // default; overridden below if NSE live works
    candleSource,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type IndexKey = "NIFTY" | "BANKNIFTY";

const INDICES: Record<IndexKey, string> = {
  NIFTY: "^NSEI",
  BANKNIFTY: "^NSEBANK",
};

export async function scanIndex(name: IndexKey): Promise<ConfluenceResult | null> {
  const symbol = INDICES[name];
  logger.info("Scanning %s across %d timeframes + live NSE price + OI...", name, TIMEFRAMES.length);

  // Run all three in parallel: candle patterns, live price, OI data
  const [results, liveQuote, oiData] = await Promise.all([
    // 1. Yahoo Finance historical candles for pattern detection
    Promise.all(
      TIMEFRAMES.map(async (tf) => {
        const r = await scanTimeframe(symbol, tf.interval, tf.period);
        return { interval: tf.interval, result: r };
      })
    ).then((arr) =>
      arr.reduce((acc, { interval, result }) => ({ ...acc, [interval]: result }), {} as Record<string, TimeframeResult | null>)
    ),
    // 2. NSE live price (~30 sec delay via cookie session)
    nseSession.getLiveQuote(name).catch(() => null),
    // 3. NSE OI data (PCR, Max Pain, walls) via cookie session
    fetchNSEOIData(name).catch(() => null),
  ]);

  const confluence = await computeConfluence(results, symbol, oiData);
  if (!confluence) return null;

  // Override the Yahoo Finance price with the live NSE price if available
  if (liveQuote && liveQuote.last > 0) {
    const live = liveQuote.last;
    const strikeGap = STRIKE_GAPS[symbol] ?? 50;
    confluence.currentPrice = live;
    confluence.atmStrike = getAtmStrike(live, strikeGap);
    confluence.priceSource = "nse-live"; // ← mark as live
    // Recalculate SL and Target using the live price
    if (confluence.action !== "NO TRADE") {
      const riskPts = live * 0.004;
      if (confluence.action === "BUY CE") {
        confluence.sl = +(live - riskPts).toFixed(2);
        confluence.target = +(live + riskPts * 2).toFixed(2);
      } else {
        confluence.sl = +(live + riskPts).toFixed(2);
        confluence.target = +(live - riskPts * 2).toFixed(2);
      }
    }
    logger.info("[%s] Live NSE price override: %s (was Yahoo: ~15min old)", name, live);
  } else {
    // NSE live failed — log it so we know
    logger.warn("[%s] NSE live price unavailable — using Yahoo Finance (~15 min delayed) price", name);
  }

  return confluence;
}

export async function scanAll(): Promise<Record<IndexKey, ConfluenceResult | null>> {
  const [nifty, banknifty] = await Promise.all([scanIndex("NIFTY"), scanIndex("BANKNIFTY")]);
  return { NIFTY: nifty, BANKNIFTY: banknifty };
}

/** Format result as Telegram Markdown message */
export function formatSignalMessage(result: ConfluenceResult): string {
  const {
    indexName, currentPrice, atmStrike, action, strength,
    confidence, agreeingTfs, totalTfs, suggestedStrike,
    otmStrike, optionType, sl, target, details, oi,
  } = result;

  const actionEmoji = action === "BUY CE" ? "🟢" : action === "BUY PE" ? "🔴" : "⚪";
  const strengthEmoji =
    strength === "STRONG" ? "💪" : strength === "MODERATE" ? "👍" : strength === "WEAK" ? "⚠️" : "🚫";

  let msg = `${actionEmoji} *${indexName} Options Signal*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *Level:* \`${currentPrice.toFixed(2)}\` | *ATM:* \`${atmStrike}\`\n\n`;

  msg += `*Timeframe Breakdown:*\n`;
  for (const d of details) {
    const biasEmoji = d.bias === "bullish" ? "🟢" : d.bias === "bearish" ? "🔴" : "⚫";
    const stars = d.score > 0 ? "★".repeat(d.score) + "☆".repeat(3 - d.score) : "—";
    const rsiStr = d.rsi != null ? ` RSI:${(d.rsi as number).toFixed(0)}` : "";
    msg += `${biasEmoji} \`${d.label.padEnd(7)}\` ${d.pattern.padEnd(22)} ${stars}${rsiStr}\n`;
  }

  if (oi) {
    msg += `\n*📈 Open Interest (NSE):*\n`;
    msg += `• PCR: \`${oi.pcr}\` | Max Pain: \`${oi.maxPainStrike}\`\n`;
    msg += `• CE Wall: \`${oi.topCEOIStrike}\` | PE Support: \`${oi.topPEOIStrike}\`\n`;
    const oiEmoji = oi.oiBias === "bullish" ? "🟢" : oi.oiBias === "bearish" ? "🔴" : "⚪";
    msg += `${oiEmoji} _${oi.oiBiasNote}_\n`;
  }

  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  if (action === "NO TRADE") {
    msg += `${strengthEmoji} *RECOMMENDATION: NO TRADE*\n`;
    msg += `Stay out. Wait for clearer direction.\n`;
  } else {
    msg += `${actionEmoji} *RECOMMENDATION: ${action}*\n`;
    msg += `${strengthEmoji} *Strength:* ${strength}  _${agreeingTfs}/${totalTfs} timeframes agree_\n`;
    msg += `🎯 *Confidence:* ${(confidence * 100).toFixed(0)}%\n\n`;
    msg += `🎫 *Primary:*       \`${indexName} ${suggestedStrike} ${optionType}\`\n`;
    msg += `💸 *OTM (Cheaper):* \`${indexName} ${otmStrike} ${optionType}\`\n\n`;
    msg += `🛑 *Index SL:*     \`${sl}\`\n`;
    msg += `✅ *Index Target:* \`${target}\`\n`;
  }

  msg += `\n📝 _${result.reason}_\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  // Show the real data source so user always knows what price was used
  const pSource = result.priceSource === "nse-live" ? "NSE Live (~30s)" : "Yahoo Finance (~15 min delay)";

  msg += `_📡 Price: ${pSource} | Patterns: Yahoo Finance (~15 min) | OI: NSE Live_\n`;
  msg += `_⚠️ Educational only — not financial advice_`;

  return msg;
}

/** Check if current time is within Indian market hours (9:15 AM – 3:30 PM IST, Mon–Fri) */
export function isMarketOpen(): boolean {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const h = ist.getUTCHours();
  const m = ist.getUTCMinutes();
  const day = ist.getUTCDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false;
  const totalMin = h * 60 + m;
  return totalMin >= 9 * 60 + 15 && totalMin <= 15 * 60 + 30;
}
