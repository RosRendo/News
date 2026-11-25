"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PairBias } from "@/lib/types";
import { computeDynamicPairBias } from "@/lib/pivotCalculator";
import BiasMeter from "@/components/BiasMeter";
import NewsletterBanner from "@/components/NewsletterBanner";
import TradingViewMiniChart from "@/components/TradingViewMiniChart";
import {
  ArrowLeft,
  Compass,
  Layers,
  Target,
  Clock,
  Activity,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface PairBiasDetailClientProps {
  initialBias: PairBias;
}

export default function PairBiasDetailClient({ initialBias }: PairBiasDetailClientProps) {
  const [biasData, setBiasData] = useState<PairBias>(initialBias);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function syncLivePrice() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();

        if (data.success && data.quotes && isMounted) {
          const liveQuote = data.quotes[initialBias.pair.toUpperCase()];
          if (liveQuote) {
            setBiasData((prev) => computeDynamicPairBias(prev, liveQuote));
            setIsLive(true);
          }
        }
      } catch {
        // keep fallback
      }
    }

    syncLivePrice();
    const interval = setInterval(syncLivePrice, 30000); // sync every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [initialBias]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Live Wire
        </Link>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover Image Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-900">
          <Image
            src={biasData.imageUrl || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80"}
            alt={biasData.name}
            fill
            priority
            className="object-cover opacity-90"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Header Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 border border-white/40 flex items-center gap-1.5 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              {biasData.pair} Market Intelligence
            </span>
            <span className="text-xs font-mono text-slate-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
              {isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time Feed</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span>{biasData.updatedAt}</span>
                </>
              )}
            </span>
          </div>

          {/* Title & Live Quote on Bottom of Image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  {biasData.pair}
                </h1>
                <span className="text-lg font-mono font-bold text-white/90">
                  {biasData.price}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    biasData.isUp ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {biasData.change}
                </span>
              </div>
              <p className="text-sm text-slate-200 font-medium">{biasData.name}</p>
            </div>
            <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-white/40 flex items-center gap-2 shadow-md">
              <span className="text-xs text-slate-600 font-bold">Session Bias:</span>
              <BiasMeter bias={biasData.bias} confidencePct={biasData.confidencePct} />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Catalyst Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Fundamental Macro Catalyst
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
              {biasData.catalyst}
            </p>
          </div>

          {/* Live Real-Time Market Chart */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Live Real-Time Market Price ({biasData.pair})
            </h3>
            <TradingViewMiniChart symbol={biasData.pair} height={240} />
          </div>

          {/* Key Pivot Levels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                Institutional Price Pivot Matrix
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Calibrated to live market tick
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-xl bg-red-50/80 border border-red-200">
                <div className="text-[10px] text-red-700 uppercase font-mono font-bold">Resistance Ceiling</div>
                <div className="text-xl font-black text-red-950 font-mono mt-1">{biasData.keyLevels.resistance}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                <div className="text-[10px] text-slate-700 uppercase font-mono font-bold">Session Pivot</div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1">{biasData.keyLevels.pivot}</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-[10px] text-emerald-800 uppercase font-mono font-bold">Demand Support</div>
                <div className="text-xl font-black text-emerald-950 font-mono mt-1">{biasData.keyLevels.support}</div>
              </div>
            </div>
          </div>

          {/* Market Context & Position Flow */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Market Context & Position Flow
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {biasData.traderAdvice}
            </p>
          </div>

          {/* Newsletter Subscription */}
          <NewsletterBanner pair={biasData.pair} />
        </div>
      </div>
    </div>
  );
}
