"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, ShieldAlert, ArrowRight, TrendingUp, TrendingDown, HelpCircle, AlertTriangle, Sparkles } from "lucide-react";

export interface SentimentAsset {
  pair: string;
  name: string;
  category: "COMMODITY" | "FOREX" | "EQUITY";
  retailLongPct: number;
  retailShortPct: number;
  smartMoneyBias: "BULLISH" | "BEARISH" | "NEUTRAL";
  trapType: "BULL_TRAP_RISK" | "BEAR_TRAP_RISK" | "BALANCED";
  trapHeadline: string;
  rationale: string;
  contrarianSignal: "FADE_CROWD_SHORT" | "FADE_CROWD_BUY" | "RIDE_INSTITUTIONS";
  targetSlug: string;
}

const SENTIMENT_DATA: SentimentAsset[] = [
  {
    pair: "XAU/USD",
    name: "Spot Gold",
    category: "COMMODITY",
    retailLongPct: 84,
    retailShortPct: 16,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "Severe Long Squeeze / Bull Trap Warning",
    rationale: "84% of retail order flow is long above $3,650. Institutional market makers have built short inventory to sweep clustered stop-losses below $3,630 support.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "us-core-cpi-inflation",
  },
  {
    pair: "NVDA",
    name: "Nvidia Corp",
    category: "EQUITY",
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
    pair: "EUR/USD",
    name: "Euro / U.S. Dollar",
    category: "FOREX",
    retailLongPct: 73,
    retailShortPct: 27,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "Falling Knife / Retail Long Trap",
    rationale: "Retail dip-buyers continue trying to catch the bottom at 1.0900. Widening transatlantic bond yield spreads give institutional funds fundamental bias to dump the Euro towards 1.0850.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "USD/JPY",
    name: "U.S. Dollar / Japanese Yen",
    category: "FOREX",
    retailLongPct: 22,
    retailShortPct: 78,
    smartMoneyBias: "BULLISH",
    trapType: "BEAR_TRAP_RISK",
    trapHeadline: "Intervention Front-Run / Bear Squeeze",
    rationale: "78% of retail accounts are shorting USD/JPY betting on Tokyo MoF currency intervention. Large macro funds continue riding sovereign yield carry trade towards 160.00.",
    contrarianSignal: "RIDE_INSTITUTIONS",
    targetSlug: "daily-macro-briefing-2026-11-24",
  },
  {
    pair: "GBP/USD",
    name: "British Pound / USD",
    category: "FOREX",
    retailLongPct: 68,
    retailShortPct: 32,
    smartMoneyBias: "BEARISH",
    trapType: "BULL_TRAP_RISK",
    trapHeadline: "Rate Cut Front-Run Trap",
    rationale: "Retail traders are defending 1.3000 psychological support ahead of the Bank of England decision. An 88% priced rate cut creates downside cascade risk.",
    contrarianSignal: "FADE_CROWD_SHORT",
    targetSlug: "boe-interest-rate-decision",
  },
];

export default function SentimentTrapRadar() {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "FOREX" | "COMMODITY" | "EQUITY">("ALL");

  const filteredAssets = SENTIMENT_DATA.filter(
    (item) => selectedFilter === "ALL" || item.category === selectedFilter
  );

  return (
    <section className="space-y-6">
      {/* ── HEADER & TOOLTIP ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Institutional Order Flow Radar
            </span>
            <span className="text-xs font-mono text-slate-400">• Interbank Liquidity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Retail Crowd vs. Smart Money Trap Detector
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            When retail crowd positioning reaches extreme levels (&gt;70%), institutional market makers frequently sweep opposite liquidity. Trade the contrarian edge before retail stops get hit.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold shrink-0">
          {(["ALL", "FOREX", "COMMODITY", "EQUITY"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedFilter === filter
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {filter === "COMMODITY" ? "COMMODITIES" : filter === "EQUITY" ? "TECH / EQUITIES" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── SENTIMENT CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const isCrowdExtremeLong = asset.retailLongPct >= 70;
          const isCrowdExtremeShort = asset.retailShortPct >= 65;

          return (
            <div
              key={asset.pair}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Asset Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-slate-900">
                      {asset.pair}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 font-sans">
                      {asset.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Category: {asset.category}
                  </span>
                </div>

                {/* Smart Money Bias Badge */}
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border ${
                    asset.smartMoneyBias === "BULLISH"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : asset.smartMoneyBias === "BEARISH"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  Institutions: {asset.smartMoneyBias}
                </span>
              </div>

              {/* Retail Crowd Positioning Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Long: {asset.retailLongPct}%
                  </span>
                  <span className="text-red-600">
                    Short: {asset.retailShortPct}%
                  </span>
                </div>

                {/* Two-Tone Visual Ratio Bar */}
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex border border-slate-200 p-0.5">
                  <div
                    style={{ width: `${asset.retailLongPct}%` }}
                    className={`h-full rounded-l-full transition-all duration-700 ${
                      isCrowdExtremeLong ? "bg-emerald-500 animate-pulse" : "bg-emerald-400"
                    }`}
                  />
                  <div
                    style={{ width: `${asset.retailShortPct}%` }}
                    className={`h-full rounded-r-full transition-all duration-700 ${
                      isCrowdExtremeShort ? "bg-red-600 animate-pulse" : "bg-red-500"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Retail Crowd</span>
                  <span>{isCrowdExtremeLong ? "Extremely Crowded Long" : isCrowdExtremeShort ? "Extremely Crowded Short" : "Moderately Positioned"}</span>
                </div>
              </div>

              {/* Trap Detector Box */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                  asset.trapType === "BULL_TRAP_RISK"
                    ? "bg-amber-50/70 border-amber-200 text-amber-950"
                    : asset.trapType === "BEAR_TRAP_RISK"
                    ? "bg-blue-50/70 border-blue-200 text-blue-950"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] font-mono uppercase tracking-wider">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 ${
                      asset.trapType === "BULL_TRAP_RISK"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                  <span>{asset.trapHeadline}</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  {asset.rationale}
                </p>
              </div>

              {/* Contrarian Trade Verdict CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                    Contrarian Action
                  </span>
                  <span
                    className={`text-xs font-black font-mono tracking-tight ${
                      asset.contrarianSignal === "FADE_CROWD_SHORT"
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {asset.contrarianSignal === "FADE_CROWD_SHORT"
                      ? "⚡ FADE HERD (SELL TRAP)"
                      : "🚀 RIDE SQUEEZE (BUY)"}
                  </span>
                </div>

                <Link
                  href={`/news/${asset.targetSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                >
                  <span>Trade Strategy</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
