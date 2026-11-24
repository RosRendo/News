"use client";

import { useEffect, useState } from "react";
import { Sentiment } from "@/lib/types";
import BiasMeter from "@/components/BiasMeter";
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";

interface DynamicGoldImpactProps {
  bias: Sentiment;
  eventCurrency?: string;
  confidencePct?: number;
  mode?: "compact" | "detailed";
}

export default function DynamicGoldImpact({
  bias,
  eventCurrency = "USD",
  confidencePct = 80,
  mode = "compact",
}: DynamicGoldImpactProps) {
  const [goldQuote, setGoldQuote] = useState({
    price: "$3,634.70",
    change: "+0.42%",
    isUp: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveGold() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.quotes && data.quotes.XAUUSD && isMounted) {
          const q = data.quotes.XAUUSD;
          setGoldQuote({
            price: q.price,
            change: q.change,
            isUp: q.isUp,
          });
        }
      } catch {
        // Keep baseline
      }
    }

    fetchLiveGold();
    const interval = setInterval(fetchLiveGold, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Generate dynamic macro transmission explanation for Gold
  const getTransmissionNote = () => {
    if (bias === "BULLISH") {
      if (eventCurrency === "USD") {
        return "Cooling inflation or softer labor prints compress U.S. 10Y real yields and weaken the Dollar, providing direct momentum for Gold breakout.";
      }
      return "Global monetary easing and central bank rate reductions lower the opportunity cost of holding non-yielding bullion reserves.";
    }

    if (bias === "BEARISH") {
      if (eventCurrency === "USD") {
        return "Hot economic prints push U.S. 10Y Treasury yields higher and boost DXY, creating strong institutional resistance for Spot Gold.";
      }
      return "Hawkish policy divergence and firm sovereign bond yields divert interbank liquidity away from precious metals.";
    }

    return "Data matches consensus expectations; Spot Gold trades within existing session liquidity bands pending the next catalyst.";
  };

  if (mode === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Gold Impact:</span>
        </div>
        <BiasMeter bias={bias} confidencePct={confidencePct} />
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
          <span className="text-slate-400">Live XAU:</span>
          <strong className="text-slate-900">{goldQuote.price}</strong>
          <span className={goldQuote.isUp ? "text-emerald-700 font-bold" : "text-red-700 font-bold"}>
            {goldQuote.change}
          </span>
        </div>
      </div>
    );
  }

  // Detailed mode for Hero & Article decoders
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900">Spot Gold (XAU/USD)</span>
          <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Primary Target
          </span>
        </div>
        <BiasMeter bias={bias} confidencePct={confidencePct} />
      </div>

      {/* Dynamic Live Quote Bar */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono">
        <span className="text-slate-500 text-[11px] flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          Live Price:
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{goldQuote.price}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${goldQuote.isUp
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {goldQuote.change}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-normal">
        {getTransmissionNote()}
      </p>
    </div>
  );
}
