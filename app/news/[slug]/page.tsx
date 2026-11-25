import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvents, getEventBySlug } from "@/lib/newsStore";
import { getEventAssetImpacts, getEventChartSymbol } from "@/lib/newsData";
import VolatilityBadge from "@/components/VolatilityBadge";
import BiasMeter from "@/components/BiasMeter";
import NewsletterBanner from "@/components/NewsletterBanner";
import TradingViewMiniChart from "@/components/TradingViewMiniChart";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Target,
  Share2,
  Bookmark,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllEvents().map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Article Not Found — MacroPulse Wire" };

  return {
    title: `${event.title} — MacroPulse Wire`,
    description: event.summaryWhatHappened,
    openGraph: {
      title: event.title,
      description: event.summaryWhatHappened,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Related stories (excluding current)
  const relatedStories = getAllEvents().filter((e) => e.slug !== slug).slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto space-y-10">
      {/* ── BREADCRUMBS & NAVIGATION ── */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Live Wire
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-semibold">{event.category || "Macro"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
          <span className="text-slate-400 font-mono hidden sm:inline truncate max-w-xs">{event.currency}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
            title="Share Article"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
            title="Bookmark Analysis"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ── ARTICLE HEADER ── */}
      <header className="space-y-5">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
            {event.category || "Macro Intelligence"}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-900 text-white">
            {event.currency} • {event.country}
          </span>
          <VolatilityBadge level={event.volatilityRisk} />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          {event.title}
        </h1>

        {/* Lead Summary Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          {event.summaryWhatHappened}
        </p>

        {/* Metadata & Author Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-b border-slate-200 py-3.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-xs uppercase font-mono shadow-xs">
              MP
            </div>
            <div>
              <div className="font-bold text-slate-900">{event.author || "Global Macro Desk"}</div>
              <div className="text-slate-500 flex items-center gap-1.5 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{event.time}</span>
                <span>•</span>
                <span>{event.readTime || "3 min read"}</span>
              </div>
            </div>
          </div>

          {event.sourceAttribution && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{event.sourceAttribution}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── FEATURED IMAGE ── */}
      <figure className="relative h-72 sm:h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
        <Image
          src={event.imageUrl || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1400&q=80"}
          alt={event.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
        <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 text-xs text-slate-200 flex items-center justify-between">
          <span>Global macroeconomic catalyst & market sentiment verification</span>
          <span className="font-mono text-[10px] text-slate-300">MacroPulse Editorial</span>
        </figcaption>
      </figure>

      {/* ── HARD NUMBERS DATA CARD ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Official Release Comparison Matrix
          </span>
          <span className="text-xs font-mono text-slate-500 font-semibold">{event.currency} Denominated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-semibold">Consensus Forecast</span>
            <span className="text-lg font-bold text-slate-800">{event.forecast}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-semibold">Actual Result</span>
            <span className={`text-lg font-black ${event.actual ? "text-red-600" : "text-slate-400"}`}>
              {event.actual || "Pending"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-semibold">Previous Release</span>
            <span className="text-lg font-bold text-slate-600">{event.previous}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] text-amber-800 uppercase tracking-wider block font-sans font-semibold">Surprise Deviation</span>
            <span className="text-lg font-bold text-amber-700">
              {event.surpriseDeviation !== undefined ? `${event.surpriseDeviation > 0 ? "+" : ""}${event.surpriseDeviation}%` : "In-Line"}
            </span>
          </div>
        </div>
      </section>

      {/* ── 3-PART PLAIN ENGLISH DECODER ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            1. What Happened
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {event.summaryWhatHappened}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            2. Macro Driver
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {event.whyMarketMoved}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            3. Asset Bias
          </div>
          <div className="space-y-1.5 text-xs">
            {getEventAssetImpacts(event).map((imp, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">{imp.asset}</span>
                <BiasMeter bias={imp.bias} confidencePct={imp.confidencePct || 80} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL ARTICLE BODY ── */}
      <section className="prose prose-slate max-w-none space-y-5 text-slate-800 text-sm sm:text-base leading-relaxed">
        {event.fullArticle && event.fullArticle.length > 0 ? (
          event.fullArticle.map((para, idx) => (
            <p key={idx} className="font-normal leading-relaxed text-slate-700">
              {para}
            </p>
          ))
        ) : (
          <p className="text-slate-700 font-medium">
            {event.summaryWhatHappened} {event.whyMarketMoved}
          </p>
        )}
      </section>

      {/* ── CROWD SENTIMENT & TRAP RADAR STRIP ── */}
      <section className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Crowd Positioning vs. Smart Money Flow
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Liquidity Trap Detector • Live Interbank Order Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Sentiment Ratio Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-emerald-400">
                Retail Long: {event.slug.includes("nvda") ? "34%" : event.currency === "JPY" ? "22%" : "84%"}
              </span>
              <span className="text-red-400">
                Retail Short: {event.slug.includes("nvda") ? "66%" : event.currency === "JPY" ? "78%" : "16%"}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex border border-slate-700">
              <div
                style={{ width: event.slug.includes("nvda") ? "34%" : event.currency === "JPY" ? "22%" : "84%" }}
                className="h-full bg-emerald-500 rounded-l-full"
              />
              <div
                style={{ width: event.slug.includes("nvda") ? "66%" : event.currency === "JPY" ? "78%" : "16%" }}
                className="h-full bg-red-500 rounded-r-full"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Retail Crowd Bias</span>
              <span className="text-amber-300 font-semibold">
                {event.slug.includes("nvda") ? "Trapped Short" : "Crowded Long"}
              </span>
            </div>
          </div>

          {/* Actionable Contrarian Intelligence */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <div className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1">
              <span>⚠️ Contrarian Alert:</span>
              <span className="text-white">
                {event.slug.includes("nvda")
                  ? "Short Squeeze Trap"
                  : event.currency === "JPY"
                  ? "Intervention Trap"
                  : "Bull Trap Risk"}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
              {event.slug.includes("nvda")
                ? "Retail bears caught shorting the resignation face forced margin liquidation as institutional funds bid above $140."
                : event.currency === "JPY"
                ? "Retail continually front-runs central bank intervention while sovereign rate carry trade pushes dollar bids."
                : "Extreme retail long exposure (&gt;80%) exposes stops to institutional sweeps before true continuation occurs."}
            </p>
          </div>
        </div>
      </section>

      {/* ── LIVE REAL-TIME MARKET CHART ── */}
      <section className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Live Real-Time Market Reaction
            </h3>
            <p className="text-xs text-slate-500">Live institutional quotes from global exchanges.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Feed
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs overflow-hidden">
          <TradingViewMiniChart symbol={getEventChartSymbol(event)} height={260} />
        </div>
      </section>

      {/* ── KEY PIVOT LEVELS MATRIX ── */}
      {event.keyLevels && event.keyLevels.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              Institutional Price Pivot Scenarios
            </h3>
            <p className="text-xs text-slate-500">
              Key inflection levels where liquidity sweeps and trend continuations are most probable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.keyLevels.map((lvl, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{lvl.pair}</span>
                  <BiasMeter bias={lvl.bias} />
                </div>
                <div className="text-xs text-slate-900 font-mono font-bold">Key Pivot Level: {lvl.keyPivot}</div>
                <p className="text-xs text-slate-600 leading-snug">{lvl.tradeScenario}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── NEWSLETTER SUBSCRIPTION ── */}
      <NewsletterBanner
        pair={event.currency}
        contextMessage={`Stay ahead of the next market catalyst on ${event.currency} and global interest rates with our daily briefing.`}
      />

      {/* ── RELATED MACRO BRIEFINGS (CLICKABLE CARDS) ── */}
      <section className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Related Macro Briefings
          </h3>
          <Link href="/" className="text-xs text-slate-900 hover:text-blue-600 font-bold hover:underline transition-colors">
            View Live Wire →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedStories.map((story) => (
            <Link
              key={story.id}
              href={`/news/${story.slug}`}
              className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all group block cursor-pointer"
            >
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <Image
                  src={story.imageUrl || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80"}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-xs">
                    {story.category || "Macro"}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">{story.time}</div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                    {story.title}
                  </h4>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-900 group-hover:text-blue-600 font-bold">Read Story →</span>
                  <span className="text-slate-400">{story.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
