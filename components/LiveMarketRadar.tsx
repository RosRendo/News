"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PairBias } from "@/lib/types";
import { Activity, ArrowRight, Radio } from "lucide-react";

interface LiveMarketRadarProps {
  initialBiases: PairBias[];
}

const RADAR_TABS = ["All", "FX Majors", "Metals & Tech"] as const;
type RadarTab = (typeof RADAR_TABS)[number];

export default function LiveMarketRadar({ initialBiases }: LiveMarketRadarProps) {
  const [biases, setBiases] = useState<PairBias[]>(initialBiases);
  const [activeTab, setActiveTab] = useState<RadarTab>("All");
  const [isLive, setIsLive] = useState(false);

  const filteredBiases = biases.filter((b) => {
    if (activeTab === "FX Majors") {
      return ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF"].includes(b.pair);
    }
    if (activeTab === "Metals & Tech") {
      return ["XAUUSD", "US100"].includes(b.pair);
    }
    return true;
  });

  const displayedBiases = activeTab === "All" ? filteredBiases.slice(0, 4) : filteredBiases.slice(0, 4);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveQuotes() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.quotes && isMounted) {
          setBiases((prev) =>
            prev.map((item) => {
              const liveQuote = data.quotes[item.pair.toUpperCase()];
              if (liveQuote) {
                return {
                  ...item,
                  price: liveQuote.price,
                  change: liveQuote.change,
                  isUp: liveQuote.isUp,
                  updatedAt: "Live Real-Time",
                };
              }
              return item;
            })
          );
          setIsLive(true);
        }
      } catch {
        // Keep initial values on network hiccup
      }
    }

    fetchLiveQuotes();
    // Poll every 45 seconds for live interbank updates
    const interval = setInterval(fetchLiveQuotes, 45000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Global Market Radar
            </h3>
            {isLive ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE FEED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-slate-100 text-slate-600">
                <Radio className="w-2.5 h-2.5 text-slate-400" />
                CONNECTING
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Live quotes & macro session drivers</p>
        </div>
        <Link
          href="/bias/xauusd"
          className="text-xs text-slate-900 hover:text-blue-600 hover:underline font-bold"
        >
          All Markets →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
        {RADAR_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded-md transition-all text-center cursor-pointer ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {displayedBiases.map((b) => (
          <Link
            key={b.pair}
            href={`/bias/${b.pair.toLowerCase()}`}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-slate-300 transition-all flex flex-col gap-2 group block cursor-pointer shadow-2xs hover:shadow-xs"
          >
            {/* Top: Pair & Live Price */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <span>{b.pair}</span>
                  <span className="text-[11px] text-slate-400 font-normal font-sans">• {b.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <span className="text-slate-900">{b.price}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    b.isUp
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {b.change}
                </span>
              </div>
            </div>

            {/* Middle: Macro Catalyst Snippet */}
            <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
              {b.catalyst}
            </p>

            {/* Bottom: Pivot & Bias Flow */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] font-mono">
              <span className="text-slate-500">
                Pivot: <strong className="text-slate-800">{b.keyLevels.pivot}</strong>
              </span>
              <div className="flex items-center gap-1 font-bold">
                <span
                  className={
                    b.bias === "BULLISH"
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }
                >
                  {b.bias} FLOW
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
