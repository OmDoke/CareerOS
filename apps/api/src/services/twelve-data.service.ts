/**
 * Twelve Data Service — Live NSE Candle Data
 * ============================================
 * Free plan: 800 API credits/day, 8 requests/minute
 * Delay: ~1 minute (vs Yahoo Finance's ~15 minutes)
 * No KYC needed — just email signup at https://twelvedata.com
 *
 * Used as the PRIMARY source for OHLCV candles.
 * Yahoo Finance is the FALLBACK if this is unavailable.
 *
 * Free plan credit usage per /optionsignal scan:
 *   - 4 timeframes × 2 indices = 8 credits
 *   - Daily budget: 800 credits → ~100 full scans/day
 */

import { logger } from "../utils/logger";
import { env } from "../config/env";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OHLCV {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ─── Symbol & Interval Mappings ───────────────────────────────────────────────

/**
 * Yahoo Finance symbol → Twelve Data symbol + exchange
 * Yahoo uses "^NSEI" / "^NSEBANK", Twelve Data uses "NIFTY:NSE" / "BANKNIFTY:NSE"
 */
const SYMBOL_MAP: Record<string, { symbol: string; exchange: string }> = {
  "^NSEI":    { symbol: "NIFTY",     exchange: "NSE" },
  "^NSEBANK": { symbol: "BANKNIFTY", exchange: "NSE" },
};

/**
 * Yahoo Finance interval → Twelve Data interval
 * Yahoo: "5m", "15m", "30m", "1h"
 * Twelve Data: "5min", "15min", "30min", "1h"
 */
const INTERVAL_MAP: Record<string, string> = {
  "5m":  "5min",
  "15m": "15min",
  "30m": "30min",
  "1h":  "1h",
};

/**
 * How many output bars to request per timeframe.
 * We need enough bars for RSI (14), trend MA (20), and pattern detection (5).
 * 100 bars is plenty for any timeframe.
 */
const OUTPUT_SIZE = 100;

// ─── Rate Limiter (8 req/min on free plan) ────────────────────────────────────

class RateLimiter {
  private queue: Array<() => void> = [];
  private tokens: number;
  private readonly maxTokens: number;
  private readonly refillIntervalMs: number;

  constructor(maxPerMinute: number) {
    this.maxTokens = maxPerMinute;
    this.tokens = maxPerMinute;
    this.refillIntervalMs = 60_000 / maxPerMinute; // ms between tokens

    // Refill one token at a time at a steady rate
    setInterval(() => {
      if (this.tokens < this.maxTokens) {
        this.tokens++;
        this.processQueue();
      }
    }, this.refillIntervalMs);
  }

  private processQueue() {
    if (this.queue.length > 0 && this.tokens > 0) {
      this.tokens--;
      const next = this.queue.shift()!;
      next();
    }
  }

  /** Returns a promise that resolves when a rate-limit token is available */
  acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.tokens > 0) {
        this.tokens--;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }
}

// 8 requests/minute for free plan
const rateLimiter = new RateLimiter(8);

// ─── Twelve Data API Client ───────────────────────────────────────────────────

const BASE_URL = "https://api.twelvedata.com";

/**
 * Fetch OHLCV candles from Twelve Data for a given Yahoo-style symbol.
 *
 * @param yahooSymbol  e.g. "^NSEI" or "^NSEBANK"
 * @param interval     Yahoo-style interval: "5m", "15m", "30m", "1h"
 * @returns            Array of OHLCV candles, oldest first
 * @throws             Error if API key missing, rate limited, or API error
 */
export async function fetchTwelveDataOHLC(
  yahooSymbol: string,
  interval: string
): Promise<OHLCV[]> {
  const apiKey = env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    throw new Error("TWELVE_DATA_API_KEY not set in env");
  }

  const mapping = SYMBOL_MAP[yahooSymbol];
  if (!mapping) {
    throw new Error(`No Twelve Data mapping for symbol: ${yahooSymbol}`);
  }

  const tdInterval = INTERVAL_MAP[interval];
  if (!tdInterval) {
    throw new Error(`No Twelve Data interval mapping for: ${interval}`);
  }

  // Wait for rate limit token before making request
  await rateLimiter.acquire();

  const url = new URL(`${BASE_URL}/time_series`);
  url.searchParams.set("symbol", mapping.symbol);
  url.searchParams.set("exchange", mapping.exchange);
  url.searchParams.set("interval", tdInterval);
  url.searchParams.set("outputsize", String(OUTPUT_SIZE));
  url.searchParams.set("timezone", "Asia/Kolkata");
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "CareerOS-Scanner/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Twelve Data HTTP ${res.status} for ${mapping.symbol}/${tdInterval}`);
  }

  const json = (await res.json()) as any;

  // Check for API-level errors (e.g. invalid key, rate limit exceeded)
  if (json.status === "error") {
    throw new Error(`Twelve Data API error: ${json.message ?? JSON.stringify(json)}`);
  }

  const values: any[] = json.values ?? [];
  if (values.length === 0) {
    throw new Error(`Twelve Data returned 0 bars for ${mapping.symbol}/${tdInterval}`);
  }

  // Twelve Data returns newest first — reverse so oldest is at index 0
  const candles: OHLCV[] = values
    .reverse()
    .map((v: any) => ({
      date: new Date(v.datetime + "+05:30"), // IST datetime string → Date
      open:   parseFloat(v.open),
      high:   parseFloat(v.high),
      low:    parseFloat(v.low),
      close:  parseFloat(v.close),
      volume: parseFloat(v.volume ?? "0"),
    }));

  logger.info(
    "[TwelveData] %s %s → %d candles, latest: %s @ %s",
    mapping.symbol,
    tdInterval,
    candles.length,
    candles[candles.length - 1].close,
    candles[candles.length - 1].date.toISOString()
  );

  return candles;
}

/** Returns true if a Twelve Data API key is configured */
export function isTwelveDataEnabled(): boolean {
  return !!env.TWELVE_DATA_API_KEY;
}
