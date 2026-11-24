import Image from "next/image";
import Link from "next/link";
import { getAllEvents } from "@/lib/newsStore";
import { PAIR_BIASES, getEventAssetImpacts } from "@/lib/newsData";
import VolatilityBadge from "@/components/VolatilityBadge";
import BiasMeter from "@/components/BiasMeter";
import NewsletterBanner from "@/components/NewsletterBanner";
import LiveMarketRadar from "@/components/LiveMarketRadar";
import LiveWireFeed from "@/components/LiveWireFeed";
import LiveRssWireList from "@/components/LiveRssWireList";
import {
  Flame,
  Clock,
  ArrowRight,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const allEvents = getAllEvents();
  const featured = allEvents[0] || {
    id: "lead-fallback",
    slug: "us-core-cpi-inflation",
    title: "Global Macro Briefing",
    summaryWhatHappened: "Daily macro market analysis.",
    forecast: "Consolidation",
    actual: "Active",
    surpriseDeviation: 0.1,
    time: "Live",
    category: "Macro",
    readTime: "3 min read",
    volatilityRisk: "ELEVATED" as const,
    whyMarketMoved: "Global yields shifting.",
    assetReactions: { usd: "BULLISH" as const, gold: "BEARISH" as const, equities: "NEUTRAL" as const },
  };
  const editorialStories = allEvents.slice(1);

  return (
    <div className="space-y-12">
      {/* ── 1. HERO BENTO GRID: BREAKING STORY + MACRO MARKET RADAR ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Lead Story (Left - 8 Cols) - FULLY CLICKABLE */}
        <Link
          href={`/news/${featured.slug}`}
          className="lg:col-span-8 relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col group hover:border-slate-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          {/* Cover Image Background with Gradient Overlay - Expands naturally with flex-1 */}
          <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full overflow-hidden bg-slate-900">
            <Image
              src={featured.imageUrl || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1400&q=80"}
              alt={featured.title}
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

            {/* Badges on Top of Image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Breaking Intel
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 shadow-xs">
                  {featured.category}
                </span>
              </div>
              <VolatilityBadge level={featured.volatilityRisk} />
            </div>

            {/* Title & Metadata positioned over gradient bottom */}
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1 text-slate-200 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.time}
                </span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors drop-shadow-sm">
                {featured.title}
              </h1>
            </div>
          </div>

          {/* Structured Intelligence & 3-Second Breakdown */}
          <div className="p-6 sm:p-8 space-y-6 bg-white shrink-0 border-t border-slate-100">
            {/* The Hard Numbers Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-semibold">Consensus Forecast</span>
                <span className="text-base font-bold text-slate-700">{featured.forecast}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-semibold">Actual Release</span>
                <span className="text-base font-bold text-red-600">{featured.actual}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-semibold">Surprise Deviation</span>
                <span className="text-base font-bold text-amber-600">+{featured.surpriseDeviation}% (Hot)</span>
              </div>
            </div>

            {/* 3-Part Plain English Decoder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  1. What Happened
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {featured.summaryWhatHappened}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                  2. Why It Moved
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {featured.whyMarketMoved}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  3. Asset Verdict
                </div>
                <div className="space-y-1.5 text-xs">
                  {getEventAssetImpacts(featured).map((imp, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-slate-600 font-semibold">{imp.asset}</span>
                      <BiasMeter bias={imp.bias} confidencePct={imp.confidencePct || 80} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Read Full Article Button Indicator */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                Read Full In-Depth Intelligence Report & Price Levels
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="font-mono text-slate-400 text-[11px]">Click to open article →</span>
            </div>
          </div>
        </Link>

        {/* Right Rail: Volatility Meter, Live Quotes Radar & Breaking News Stream (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Volatility Status Box */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-600" />
                Live Volatility Meter
              </span>
              <span className="text-[10px] font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-200 uppercase tracking-wider">HIGH IMPACT</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
              <div className="bg-emerald-500 w-1/4 h-full" />
              <div className="bg-amber-400 w-1/4 h-full" />
              <div className="bg-orange-500 w-1/4 h-full" />
              <div className="bg-red-500 w-1/4 h-full animate-pulse" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              CPI surprise triggered immediate spread spikes across interbank desks. Bond yields surging across the 2-Year and 10-Year curves.
            </p>
          </div>

          {/* Dynamic Real-Time Market Radar */}
          <LiveMarketRadar initialBiases={PAIR_BIASES} />

          {/* Live Breaking News Wire (RSS & Official Sources) */}
          <LiveRssWireList />
        </div>
      </section>

      {/* ── 2. VISUAL EDITORIAL CARDS WITH FILTERS & PAGINATION ── */}
      <LiveWireFeed initialEvents={editorialStories} />

      {/* ── 3. NEWSLETTER WIRE SUBSCRIPTION ── */}
      <NewsletterBanner />
    </div>
  );
}
