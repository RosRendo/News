interface VolatilityBadgeProps {
  level: "EXTREME" | "ELEVATED" | "NORMAL";
}

export default function VolatilityBadge({ level }: VolatilityBadgeProps) {
  if (level === "EXTREME") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-red-50 text-red-700 border border-red-200 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        High Impact
      </span>
    );
  }

  if (level === "ELEVATED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Medium Impact
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Low Impact
    </span>
  );
}
