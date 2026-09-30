/**
 * NSE Cookie Session Manager
 * ===========================
 * How it works:
 *   1. Visits nseindia.com homepage (like a browser) → gets session cookie
 *   2. Uses that cookie to call NSE's live data APIs
 *   3. Auto-refreshes the cookie every 4 minutes before it expires
 *
 * This gives us:
 *   - Live NIFTY / BANKNIFTY spot price (~30 sec delay — NSE updates every 30s)
 *   - Live Option Chain OI data (PCR, Max Pain, CE/PE walls)
 *   - No account, no KYC, no API key needed
 */

import { logger } from "../utils/logger";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LiveIndexQuote {
  name: string;          // e.g. "NIFTY 50"
  last: number;          // current price (live)
  change: number;        // points change
  pctChange: number;     // % change
  high: number;          // today's high
  low: number;           // today's low
  open: number;          // today's open
  prevClose: number;     // previous close
  timestamp: string;     // last update time from NSE
}

export interface NSEOptionChainData {
  underlyingValue: number;
  records: any;
}

// ─── Base Headers (mimics Chrome browser) ────────────────────────────────────

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
};

const API_HEADERS_EXTRA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  Referer: "https://www.nseindia.com/",
  "X-Requested-With": "XMLHttpRequest",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
};

// ─── NSE Session Class ────────────────────────────────────────────────────────

class NSESession {
  private cookies: string = "";
  private lastCookieFetch: number = 0;
  private isRefreshing: boolean = false;

  /** Cookie is refreshed every 4 min (NSE sessions last ~5 min) */
  private readonly COOKIE_TTL_MS = 4 * 60 * 1000;

  /**
   * Step 1: Visit the NSE homepage like a browser.
   * NSE sends back Set-Cookie headers with a session token.
   * We extract and store those cookies.
   */
  async refreshCookies(): Promise<void> {
    if (this.isRefreshing) return; // avoid parallel refreshes
    this.isRefreshing = true;

    try {
      logger.info("[NSESession] Refreshing session cookies...");

      const res = await fetch("https://www.nseindia.com", {
        headers: BROWSER_HEADERS,
      });

      // Node 18+ fetch: headers.getSetCookie() returns string[]
      // Each element is like: "nsit=abc123; Path=/; HttpOnly"
      const rawCookies: string[] = (res.headers as any).getSetCookie?.() ?? [];

      if (rawCookies.length > 0) {
        // Extract only "name=value" from each cookie (strip attributes like Path, HttpOnly)
        this.cookies = rawCookies
          .map((c: string) => c.split(";")[0].trim())
          .join("; ");
        logger.info("[NSESession] Cookies refreshed: %s", this.cookies.slice(0, 60) + "...");
      } else {
        // Fallback: try reading from Set-Cookie header (older Node)
        const singleCookie = res.headers.get("set-cookie") ?? "";
        if (singleCookie) {
          this.cookies = singleCookie.split(";")[0].trim();
        }
        logger.warn("[NSESession] getSetCookie() empty, using single header");
      }

      this.lastCookieFetch = Date.now();
    } catch (err) {
      logger.error({ err }, "[NSESession] Cookie refresh failed");
    } finally {
      this.isRefreshing = false;
    }
  }

  /** Ensure cookies are fresh before making any API call */
  private async ensureFresh(): Promise<void> {
    const expired = Date.now() - this.lastCookieFetch > this.COOKIE_TTL_MS;
    if (!this.cookies || expired) {
      await this.refreshCookies();
    }
  }

  /**
   * Step 2: Call any NSE API endpoint with the session cookie.
   * If we get 401/403 (cookie expired), refresh once and retry.
   */
  async fetchJSON<T = any>(url: string): Promise<T> {
    await this.ensureFresh();

    const makeRequest = () =>
      fetch(url, {
        headers: {
          ...API_HEADERS_EXTRA,
          Cookie: this.cookies,
        },
      });

    let res = await makeRequest();

    // Cookie expired mid-session → refresh and retry once
    if (res.status === 401 || res.status === 403) {
      logger.warn("[NSESession] Got %d on %s, refreshing cookies...", res.status, url);
      await this.refreshCookies();
      res = await makeRequest();
    }

    if (!res.ok) {
      throw new Error(`[NSESession] NSE API returned HTTP ${res.status} for ${url}`);
    }

    return res.json() as Promise<T>;
  }

  // ─── Live Index Quotes ──────────────────────────────────────────────────────

  /**
   * Returns live prices for all NSE indices.
   * NSE updates this every ~30 seconds during market hours.
   *
   * Returns a map: { "NIFTY": 24350.25, "BANKNIFTY": 51200.50 }
   */
  async getLiveIndexPrices(): Promise<Record<string, number>> {
    try {
      const data = await this.fetchJSON<{ data: any[] }>(
        "https://www.nseindia.com/api/allIndices"
      );

      const result: Record<string, number> = {};

      for (const item of data.data ?? []) {
        if (item.index === "NIFTY 50")   result["NIFTY"] = parseFloat(item.last);
        if (item.index === "NIFTY BANK") result["BANKNIFTY"] = parseFloat(item.last);
      }

      logger.info(
        "[NSESession] Live prices → NIFTY: %s, BANKNIFTY: %s",
        result["NIFTY"] ?? "N/A",
        result["BANKNIFTY"] ?? "N/A"
      );

      return result;
    } catch (err) {
      logger.warn({ err }, "[NSESession] getLiveIndexPrices failed");
      return {};
    }
  }

  /**
   * Returns full live quote for a specific index.
   * Includes: last price, high, low, open, prevClose, change, pctChange
   */
  async getLiveQuote(indexName: "NIFTY" | "BANKNIFTY"): Promise<LiveIndexQuote | null> {
    try {
      const data = await this.fetchJSON<{ data: any[] }>(
        "https://www.nseindia.com/api/allIndices"
      );

      const nseKey = indexName === "NIFTY" ? "NIFTY 50" : "NIFTY BANK";
      const item = data.data?.find((d: any) => d.index === nseKey);
      if (!item) return null;

      return {
        name: item.index,
        last: parseFloat(item.last),
        change: parseFloat(item.variation ?? item.change ?? 0),
        pctChange: parseFloat(item.percentChange ?? 0),
        high: parseFloat(item.high ?? 0),
        low: parseFloat(item.low ?? 0),
        open: parseFloat(item.open ?? 0),
        prevClose: parseFloat(item.previousClose ?? item.prevClose ?? 0),
        timestamp: item.lastUpdateTime ?? new Date().toISOString(),
      };
    } catch (err) {
      logger.warn({ err }, "[NSESession] getLiveQuote failed for %s", indexName);
      return null;
    }
  }

  // ─── Option Chain (OI Data) ─────────────────────────────────────────────────

  /**
   * Returns the full option chain for NIFTY or BANKNIFTY.
   * Includes: underlying price, all CE/PE strikes with OI data.
   * This is the same data we already use, but now with proper cookies → more reliable.
   */
  async getOptionChain(indexName: "NIFTY" | "BANKNIFTY"): Promise<any | null> {
    try {
      return await this.fetchJSON(
        `https://www.nseindia.com/api/option-chain-indices?symbol=${indexName}`
      );
    } catch (err) {
      logger.warn({ err }, "[NSESession] getOptionChain failed for %s", indexName);
      return null;
    }
  }

  /** Pre-warm the session on startup so the first scan is instant */
  async warmup(): Promise<void> {
    logger.info("[NSESession] Warming up session...");
    await this.refreshCookies();

    // Small delay then test the cookie works
    await new Promise((r) => setTimeout(r, 1000));
    const prices = await this.getLiveIndexPrices();

    if (prices["NIFTY"]) {
      logger.info("[NSESession] Warmup success. NIFTY live: %s", prices["NIFTY"]);
    } else {
      logger.warn("[NSESession] Warmup: could not fetch live prices (market may be closed or NSE blocking)");
    }
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────
export const nseSession = new NSESession();
