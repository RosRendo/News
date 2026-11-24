import { Sentiment } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BiasMeterProps {
  bias: Sentiment;
  confidencePct?: number;
}

export default function BiasMeter({ bias, confidencePct = 75 }: BiasMeterProps) {
  const isBull = bias === "BULLISH";
  const isBear = bias === "BEARISH";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
          isBull
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : isBear
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-slate-100 text-slate-700 border border-slate-200"
        }`}
      >
        {isBull && <TrendingUp className="w-3 h-3 text-emerald-600" />}
        {isBear && <TrendingDown className="w-3 h-3 text-red-600" />}
        {!isBull && !isBear && <Minus className="w-3 h-3 text-slate-400" />}
        {bias}
      </div>
      {confidencePct > 0 && (
        <span className="text-[11px] text-slate-400 font-mono">
          {confidencePct}%
        </span>
      )}
    </div>
  );
}
