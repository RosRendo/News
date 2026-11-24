"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { EconomicEvent } from "@/lib/types";
import VolatilityBadge from "@/components/VolatilityBadge";
import { Clock, Filter, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";

interface LiveWireFeedProps {
  initialEvents: EconomicEvent[];
}

const CATEGORIES = [
  "All Stories",
  "Central Banks",
  "US Inflation",
  "Labor Market",
  "Macro Activity",
  "Commodities & Metals",
];

export default function LiveWireFeed({ initialEvents }: LiveWireFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [displayCount, setDisplayCount] = useState(8);

  const filtered = useMemo(() => {
    if (selectedCategory === "All Stories") return initialEvents;
    return initialEvents.filter(
      (e) => e.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [initialEvents, selectedCategory]);

  const visibleStories = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  return (
    <section className="space-y-6">
      {/* Section Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Macroeconomic Briefings & Market Reaction
            </h2>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0">
              {filtered.length} Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verified institutional facts, central bank releases, and cross-asset reactions. Click any story to read.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-semibold scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setDisplayCount(8);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clickable News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleStories.map((story) => (
          <Link
            key={story.id}
            href={`/news/${story.slug}`}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-400 hover:shadow-lg transition-all group block cursor-pointer"
          >
            {/* Card Image */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <Image
                src={story.imageUrl || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80"}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-xs">
                  {story.category || "Macro"}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 backdrop-blur-md text-white border border-slate-800">
                  {story.currency}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{story.time}</span>
                  <span>•</span>
                  <span>{story.readTime || "3 min read"}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {story.summaryWhatHappened}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                  <span>Frc: <strong className="text-slate-800">{story.forecast}</strong></span>
                </div>
                <VolatilityBadge level={story.volatilityRisk} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => setDisplayCount((prev) => prev + 4)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span>Load More Macro Briefings ({filtered.length - displayCount} Remaining)</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      )}
    </section>
  );
}
