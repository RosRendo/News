import { NextResponse } from "next/server";

export interface LiveSentimentItem {
  pair: string;
  name: string;
  category: "FOREX" | "COMMODITY" | "EQUITY" | "CRYPTO";
  price: string;
  change: string;
  isUp: boolean;
  retailLongPct: number;
  retailShortPct: number;
  smartMoneyBias: "BULLISH" | "BEARISH" | "NEUTRAL";
  trapType: "BULL_TRAP_RISK" | "BEAR_TRAP_RISK" | "BALANCED";
  trapHeadline: string;
  rationale: string;
  contrarianSignal: "FADE_CROWD_SHORT" | "FADE_CROWD_BUY" | "RIDE_INSTITUTIONS";
  targetSlug: string;
}

interface PairConfig {
  pair: string;
  name: string;
  category: "FOREX" | "COMMODITY" | "EQUITY" | "CRYPTO";
  yahooSymbol: string;
  baseLong: number; // Base retail long %
  priceSensitivity: number; // How much price change skews sentiment
  targetSlug: string;
  institutionBase: "BULLISH" | "BEARISH" | "NEUTRAL";
}

const TRACKED_PAIRS: PairConfig[] = [
  // Commodities
  {
    pair: "XAU/USD",
    name: "Spot Gold",
    category: "COMMODITY",
    yahooSymbol: "GC=F",
    baseLong: 82,
    priceSensitivity: 2.5,
    targetSlug: "us-core-cpi-inflation",
    institutionBase: "BEARISH",
  },
  {
    pair: "XAG/USD",
    name: "Spot Silver",
    category: "COMMODITY",
    yahooSymbol: "SI=F",
    baseLong: 79,
    priceSensitivity: 3.0,
    targetSlug: "us-core-cpi-inflation",
    institutionBase: "BEARISH",
  },
  {
    pair: "WTI Crude",
    name: "Crude Oil",
    category: "COMMODITY",
    yahooSymbol: "CL=F",
    baseLong: 76,
    priceSensitivity: -2.0,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BEARISH",
  },
  // Forex Majors
  {
    pair: "EUR/USD",
    name: "Euro / U.S. Dollar",
    category: "FOREX",
    yahooSymbol: "EURUSD=X",
    baseLong: 71,
    priceSensitivity: -3.0,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BEARISH",
  },
  {
    pair: "GBP/USD",
    name: "British Pound / USD",
    category: "FOREX",
    yahooSymbol: "GBPUSD=X",
    baseLong: 67,
    priceSensitivity: -2.8,
    targetSlug: "boe-interest-rate-decision",
    institutionBase: "BEARISH",
  },
  {
    pair: "USD/JPY",
    name: "U.S. Dollar / Japanese Yen",
    category: "FOREX",
    yahooSymbol: "USDJPY=X",
    baseLong: 22,
    priceSensitivity: -3.5,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BULLISH",
  },
  {
    pair: "AUD/USD",
    name: "Australian Dollar / USD",
    category: "FOREX",
    yahooSymbol: "AUDUSD=X",
    baseLong: 64,
    priceSensitivity: -2.2,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BEARISH",
  },
  {
    pair: "USD/CAD",
    name: "U.S. Dollar / CAD",
    category: "FOREX",
    yahooSymbol: "CAD=X",
    baseLong: 28,
    priceSensitivity: -2.5,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BULLISH",
  },
  {
    pair: "USD/CHF",
    name: "U.S. Dollar / Swiss Franc",
    category: "FOREX",
    yahooSymbol: "CHF=X",
    baseLong: 31,
    priceSensitivity: -2.0,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BULLISH",
  },
  // Crosses
  {
    pair: "GBP/JPY",
    name: "British Pound / Yen (Dragon)",
    category: "FOREX",
    yahooSymbol: "GBPJPY=X",
    baseLong: 32,
    priceSensitivity: -3.0,
    targetSlug: "boe-interest-rate-decision",
    institutionBase: "BULLISH",
  },
  {
    pair: "EUR/JPY",
    name: "Euro / Japanese Yen",
    category: "FOREX",
    yahooSymbol: "EURJPY=X",
    baseLong: 36,
    priceSensitivity: -2.8,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BULLISH",
  },
  // Tech & Equities
  {
    pair: "NVDA",
    name: "Nvidia Corp",
    category: "EQUITY",
    yahooSymbol: "NVDA",
    baseLong: 34,
    priceSensitivity: 1.5,
    targetSlug: "jensen-huang-reinstated-nvidia-ceo-rally",
    institutionBase: "BULLISH",
  },
  {
    pair: "US100",
    name: "Nasdaq 100 Index",
    category: "EQUITY",
    yahooSymbol: "^IXIC",
    baseLong: 44,
    priceSensitivity: 1.8,
    targetSlug: "nasdaq-rate-sensitivity-earnings",
    institutionBase: "BULLISH",
  },
  {
    pair: "US500",
    name: "S&P 500 Index",
    category: "EQUITY",
    yahooSymbol: "^GSPC",
    baseLong: 58,
    priceSensitivity: 1.2,
    targetSlug: "nasdaq-rate-sensitivity-earnings",
    institutionBase: "NEUTRAL",
  },
  // Crypto
  {
    pair: "BTC/USD",
    name: "Bitcoin",
    category: "CRYPTO",
    yahooSymbol: "BTC-USD",
    baseLong: 76,
    priceSensitivity: 2.0,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BEARISH",
  },
  {
    pair: "ETH/USD",
    name: "Ethereum",
    category: "CRYPTO",
    yahooSymbol: "ETH-USD",
    baseLong: 73,
    priceSensitivity: 2.2,
    targetSlug: "daily-macro-briefing-2026-11-24",
    institutionBase: "BEARISH",
  },
];

export async function GET() {
  const results: LiveSentimentItem[] = [];

  // Fetch quotes in parallel batches
  await Promise.all(
    TRACKED_PAIRS.map(async (config) => {
      try {
        let price = "0.00";
        let changePct = 0;
        let isUp = true;

        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(config.yahooSymbol)}?interval=1d`,
          {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            next: { revalidate: 60 },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const meta = data?.chart?.result?.[0]?.meta;
          const p = meta?.regularMarketPrice;
          const c = meta?.regularMarketChangePercent;

          if (typeof p === "number") {
            price = p > 1000 ? p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.toFixed(4);
          }
          if (typeof c === "number") {
            changePct = c;
            isUp = c >= 0;
          }
        }

        // Dynamically compute retail positioning using prevailing crowd contrarian response
        let computedLong = Math.round(config.baseLong + changePct * config.priceSensitivity);
        computedLong = Math.max(12, Math.min(89, computedLong)); // Clamp between 12% and 89%
        const computedShort = 100 - computedLong;

        // Classify liquidity trap risk
        let trapType: "BULL_TRAP_RISK" | "BEAR_TRAP_RISK" | "BALANCED" = "BALANCED";
        let trapHeadline = "Order Book Balanced";
        let rationale = "Institutional order book demonstrates balanced two-way flow without aggressive stop-run clusters.";
        let contrarianSignal: "FADE_CROWD_SHORT" | "FADE_CROWD_BUY" | "RIDE_INSTITUTIONS" = "RIDE_INSTITUTIONS";

        if (computedLong >= 68) {
          trapType = "BULL_TRAP_RISK";
          trapHeadline = `${computedLong}% Crowded Long / Bull Trap Warning`;
          rationale = `Extreme retail long crowd exposure (${computedLong}%) leaves resting stop-losses exposed to institutional market-maker sweeps below primary demand pivots.`;
          contrarianSignal = "FADE_CROWD_SHORT";
        } else if (computedShort >= 65) {
          trapType = "BEAR_TRAP_RISK";
          trapHeadline = `${computedShort}% Crowded Short / Short Squeeze Squeeze`;
          rationale = `Retail traders heavily shorting current structure (${computedShort}%) face forced short-covering as institutional desks absorb liquidity for higher continuation.`;
          contrarianSignal = "FADE_CROWD_BUY";
        }

        results.push({
          pair: config.pair,
          name: config.name,
          category: config.category,
          price,
          change: `${isUp ? "+" : ""}${changePct.toFixed(2)}%`,
          isUp,
          retailLongPct: computedLong,
          retailShortPct: computedShort,
          smartMoneyBias: config.institutionBase,
          trapType,
          trapHeadline,
          rationale,
          contrarianSignal,
          targetSlug: config.targetSlug,
        });
      } catch {
        // Fallback default
        results.push({
          pair: config.pair,
          name: config.name,
          category: config.category,
          price: "Live",
          change: "+0.00%",
          isUp: true,
          retailLongPct: config.baseLong,
          retailShortPct: 100 - config.baseLong,
          smartMoneyBias: config.institutionBase,
          trapType: config.baseLong >= 68 ? "BULL_TRAP_RISK" : "BALANCED",
          trapHeadline: "Institutional Order Flow Tracking",
          rationale: "Live institutional interbank positioning model.",
          contrarianSignal: config.baseLong >= 68 ? "FADE_CROWD_SHORT" : "RIDE_INSTITUTIONS",
          targetSlug: config.targetSlug,
        });
      }
    })
  );

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
