"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import { LiveSentimentItem } from "@/app/api/sentiment/route";

const INITIAL_FALLBACK_DATA: LiveSentimentItem[] = [
  // Commodities
  {
    pair: "XAU/USD",
    name: "Spot Gold",
    category: "COMMODITY",
    price: "3,654.70",
    change: "+3.96%",
    isUp: true,
    retailLongPct: 84,
    retailShortPct: 16,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "84% Crowded Long / Bull Trap Warning",
    rationale: "84% of retail order flow is long above $3,650. Institutional market makers have built short inventory to sweep clustered stop-losses below $3,630 support.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "us-core-cpi-inflation",
  },
  {
    pair: "XAG/USD",
    name: "Spot Silver",
    category: "COMMODITY",
    price: "39.42",
    change: "+1.85%",
    isUp: true,
    retailLongPct: 81,
    retailShortPct: 19,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "81% Crowded Long / High-Beta Flush",
    rationale: "Retail chasing silver's industrial momentum leaving stop clusters vulnerable to a sharp liquidity sweep towards $38.50.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "us-core-cpi-inflation",
  },
  {
    pair: "WTI Crude",
    name: "Crude Oil",
    category: "COMMODITY",
    price: "71.24",
    change: "-1.15%",
    isUp: false,
    retailLongPct: 76,
    retailShortPct: 24,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "76% Crowded Long / Inventory Dump",
    rationale: "Retail dip-buyers anticipating supply disruption while rising non-OPEC output and sluggish global manufacturing keep physical crude capped.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  // Forex Majors
  {
    pair: "EUR/USD",
    name: "Euro / U.S. Dollar",
    category: "FOREX",
    price: "1.0942",
    change: "-0.23%",
    isUp: false,
    retailLongPct: 71,
    retailShortPct: 29,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "71% Crowded Long / Falling Knife Trap",
    rationale: "Retail dip-buyers continue defending 1.0900. Widening transatlantic bond yield spreads give institutional funds fundamental bias to dump the Euro towards 1.0850.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "GBP/USD",
    name: "British Pound / USD",
    category: "FOREX",
    price: "1.3023",
    change: "-0.45%",
    isUp: false,
    retailLongPct: 67,
    retailShortPct: 33,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "Rate Cut Front-Run Trap",
    rationale: "Retail traders are defending 1.3000 psychological support ahead of the Bank of England decision. An 88% priced rate cut creates downside cascade risk.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "boe-interest-rate-decision",
  },
  {
    pair: "USD/JPY",
    name: "U.S. Dollar / Japanese Yen",
    category: "FOREX",
    price: "159.18",
    change: "+0.42%",
    isUp: true,
    retailLongPct: 22,
    retailShortPct: 78,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "78% Crowded Short / Intervention Squeeze",
    rationale: "78% of retail accounts are shorting USD/JPY betting on Tokyo MoF currency intervention. Large macro funds continue riding sovereign yield carry trade towards 160.00.",
    contrarianSignal: "FADE_CROWD_BUY",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "AUD/USD",
    name: "Aussie / U.S. Dollar",
    category: "FOREX",
    price: "0.6542",
    change: "+0.28%",
    isUp: true,
    retailLongPct: 65,
    retailShortPct: 35,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "Commodity Disconnect Trap",
    rationale: "Retail longs front-running China fiscal stimulus while U.S. dollar resilience caps Aussie rallies below 0.6550.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "USD/CAD",
    name: "U.S. Dollar / CAD",
    category: "FOREX",
    price: "1.3850",
    change: "-0.15%",
    isUp: false,
    retailLongPct: 28,
    retailShortPct: 72,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "72% Crowded Short / Rate Cut Divergence",
    rationale: "Retail shorting USD/CAD at resistance while Bank of Canada aggressive easing cycle expands monetary policy divergence.",
    contrarianSignal: "FADE_CROWD_BUY",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "USD/CHF",
    name: "U.S. Dollar / Swiss Franc",
    category: "FOREX",
    price: "0.8920",
    change: "+0.18%",
    isUp: true,
    retailLongPct: 31,
    retailShortPct: 69,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "69% Crowded Short / Franc Squeeze",
    rationale: "Retail piling into safe-haven Swiss Franc shorts while SNB negative interest rate rhetoric provides continuous Dollar bid.",
    contrarianSignal: "FADE_CROWD_BUY",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  // Crosses
  {
    pair: "GBP/JPY",
    name: "Pound / Yen (Dragon)",
    category: "FOREX",
    price: "207.31",
    change: "+0.35%",
    isUp: true,
    retailLongPct: 31,
    retailShortPct: 69,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "69% Crowded Short / Carry Trade Squeeze",
    rationale: "Retail sellers attempting to top-pick 205.00 resistance are continually squeezed by persistent sterling-yen rate differentials.",
    contrarianSignal: "FADE_CROWD_BUY",
    targetSlug: "boe-interest-rate-decision",
  },
  {
    pair: "EUR/JPY",
    name: "Euro / Japanese Yen",
    category: "FOREX",
    price: "174.12",
    change: "+0.19%",
    isUp: true,
    retailLongPct: 35,
    retailShortPct: 65,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "65% Crowded Short / Carry Squeeze",
    rationale: "Persistent yen funding trade pushes cross towards multi-decade highs despite ECB rate cuts.",
    contrarianSignal: "FADE_CROWD_BUY",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  // Tech & Equities
  {
    pair: "NVDA",
    name: "Nvidia Corp",
    category: "EQUITY",
    price: "142.80",
    change: "+30.40%",
    isUp: true,
    retailLongPct: 34,
    retailShortPct: 66,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "Violent Short Squeeze / Bear Trap",
    rationale: "Retail bears heavily shorted the initial CEO resignation. The unexpected reinstatement of Jensen Huang is forcing violent short-covering as institutional desks bid $140+.",
    contrarianSignal: "RIDE_INSTITUTIONS",
    targetSlug: "jensen-huang-reinstated-nvidia-ceo-rally",
  },
  {
    pair: "US100",
    name: "Nasdaq 100 Index",
    category: "EQUITY",
    price: "26,787.12",
    change: "+7.02%",
    isUp: true,
    retailLongPct: 44,
    retailShortPct: 56,
    smartMoneyBias: "BULLISH",
    trapType: "BALANCED",
    trapHeadline: "Institutional Accumulation",
    rationale: "Hyperscaler AI capex and semiconductor breadth maintain institutional bid above 26,800 despite retail yield anxiety.",
    contrarianSignal: "RIDE_INSTITUTIONS",
    targetSlug: "nasdaq-rate-sensitivity-earnings",
  },
  {
    pair: "US500",
    name: "S&P 500 Index",
    category: "EQUITY",
    price: "6,012.40",
    change: "+0.54%",
    isUp: true,
    retailLongPct: 58,
    retailShortPct: 42,
    smartMoneyBias: "NEUTRAL",
    trapType: "BALANCED",
    trapHeadline: "Order Book Balanced",
    rationale: "Broad market balance between mega-cap tech strength and defensive healthcare rotation; institutional order book range-bound.",
    contrarianSignal: "RIDE_INSTITUTIONS",
    targetSlug: "nasdaq-rate-sensitivity-earnings",
  },
  // Crypto
  {
    pair: "BTC/USD",
    name: "Bitcoin",
    category: "CRYPTO",
    price: "96,420.00",
    change: "+2.14%",
    isUp: true,
    retailLongPct: 76,
    retailShortPct: 24,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "76% Crowded Long / Six-Figure Trap",
    rationale: "Retail FOMO buying into six-figure resistance ($98K-$100K) while institutional order flow unloads spot into leveraged long liquidations.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "ETH/USD",
    name: "Ethereum",
    category: "CRYPTO",
    price: "3,480.50",
    change: "+1.65%",
    isUp: true,
    retailLongPct: 73,
    retailShortPct: 27,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "73% Crowded Long / Resistance Rejection",
    rationale: "Retail accumulation facing institutional rotation into higher-beta layer-1 alternatives and spot Bitcoin dominance.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
];

export default function SentimentTrapRadar() {
  const [items, setItems] = useState<LiveSentimentItem[]>(INITIAL_FALLBACK_DATA);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "FOREX" | "COMMODITY" | "EQUITY" | "CRYPTO">("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Live");

  useEffect(() => {
    async function fetchLiveSentiment() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/sentiment");
        if (res.ok) {
          const data: LiveSentimentItem[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
            setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
          }
        }
      } catch {
        // Keep initial fallback
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveSentiment();
    const interval = setInterval(fetchLiveSentiment, 60000); // Re-fetch every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = items.filter(
    (item) => selectedFilter === "ALL" || item.category === selectedFilter
  );

  return (
    <section className="space-y-6">
      {/* ── HEADER & TOOLTIP ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Live Order Flow &amp; Sentiment Radar
            </span>
            <span className="text-xs font-mono text-slate-400">• Updated {lastUpdated}</span>
            {isLoading && (
              <RefreshCw className="w-3 h-3 text-slate-400 animate-spin" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Retail Crowd vs. Smart Money Trap Detector
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            When retail crowd positioning reaches extreme levels (&gt;68%), institutional market makers frequently sweep opposite liquidity. Trade the contrarian edge before retail stops get hit.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-mono font-bold shrink-0">
          {(["ALL", "FOREX", "COMMODITY", "EQUITY", "CRYPTO"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedFilter === filter
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {filter === "COMMODITY"
                ? "COMMODITIES"
                : filter === "EQUITY"
                ? "TECH & EQUITIES"
                : filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── SENTIMENT CARDS GRID (16 ASSETS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => {
          const isCrowdExtremeLong = asset.retailLongPct >= 68;
          const isCrowdExtremeShort = asset.retailShortPct >= 65;

          return (
            <div
              key={asset.pair}
              className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              {/* Asset Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black font-mono text-slate-900">
                      {asset.pair}
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${asset.isUp ? "text-emerald-600" : "text-red-600"}`}>
                      {asset.change}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-sans">
                    <span>{asset.name}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-700 font-semibold">{asset.price}</span>
                  </div>
                </div>

                {/* Smart Money Bias Badge */}
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border shrink-0 ${
                    asset.smartMoneyBias === "BULLISH"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : asset.smartMoneyBias === "BEARISH"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  Inst: {asset.smartMoneyBias}
                </span>
              </div>

              {/* Retail Crowd Positioning Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-700 flex items-center gap-1 text-[11px]">
                    <Users className="w-3 h-3" />
                    Long: {asset.retailLongPct}%
                  </span>
                  <span className="text-red-600 text-[11px]">
                    Short: {asset.retailShortPct}%
                  </span>
                </div>

                {/* Two-Tone Visual Ratio Bar */}
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex border border-slate-200">
                  <div
                    style={{ width: `${asset.retailLongPct}%` }}
                    className={`h-full transition-all duration-700 ${
                      isCrowdExtremeLong ? "bg-emerald-500 animate-pulse" : "bg-emerald-400"
                    }`}
                  />
                  <div
                    style={{ width: `${asset.retailShortPct}%` }}
                    className={`h-full transition-all duration-700 ${
                      isCrowdExtremeShort ? "bg-red-600 animate-pulse" : "bg-red-500"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Crowd Tilt</span>
                  <span className="font-semibold text-slate-600">
                    {isCrowdExtremeLong
                      ? "Crowded Long"
                      : isCrowdExtremeShort
                      ? "Crowded Short"
                      : "Balanced"}
                  </span>
                </div>
              </div>

              {/* Trap Detector Box */}
              <div
                className={`p-3 rounded-xl border space-y-1 text-xs ${
                  asset.trapType === "BULL_TRAP_RISK"
                    ? "bg-amber-50/70 border-amber-200 text-amber-950"
                    : asset.trapType === "BEAR_TRAP_RISK"
                    ? "bg-blue-50/70 border-blue-200 text-blue-950"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-[10px] font-mono uppercase tracking-wider">
                  <AlertTriangle
                    className={`w-3 h-3 ${
                      asset.trapType === "BULL_TRAP_RISK"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                  <span className="truncate">{asset.trapHeadline}</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium line-clamp-2">
                  {asset.rationale}
                </p>
              </div>

              {/* Contrarian Trade Verdict CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono font-semibold text-slate-400 block">
                    Action
                  </span>
                  <span
                    className={`text-[11px] font-black font-mono tracking-tight ${
                      asset.contrarianSignal === "FADE_CROWD_SHORT"
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {asset.contrarianSignal === "FADE_CROWD_SHORT"
                      ? "⚡ FADE TRAP"
                      : "🚀 RIDE FLOW"}
                  </span>
                </div>

                <Link
                  href={`/news/${asset.targetSlug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                >
                  <span>Trade Intel</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
