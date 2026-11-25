"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SAMPLE_EVENTS, getEventAssetImpacts } from "@/lib/newsData";
import { EconomicEvent } from "@/lib/types";
import VolatilityBadge from "@/components/VolatilityBadge";
import BiasMeter from "@/components/BiasMeter";
import DynamicGoldImpact from "@/components/DynamicGoldImpact";
import NewsletterBanner from "@/components/NewsletterBanner";
import NextRiskHeroCountdown from "@/components/NextRiskHeroCountdown";
import LiveReleaseCountdown from "@/components/LiveReleaseCountdown";
import {
  Calendar as CalendarIcon,
  Info,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const CURRENCIES = ["ALL", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"] as const;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export default function CalendarPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ALL");
  const [highImpactOnly, setHighImpactOnly] = useState<boolean>(false);
  const [events, setEvents] = useState<EconomicEvent[]>(SAMPLE_EVENTS);
  const [weekRange, setWeekRange] = useState<string>("Current Trading Week");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadLiveCalendar() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/calendar");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.events)) {
            setEvents(data.events);
            if (data.weekRange) setWeekRange(data.weekRange);
          }
        }
      } catch {
        // Fallback to SAMPLE_EVENTS
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveCalendar();
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchCurr =
        selectedCurrency === "ALL" || e.currency === selectedCurrency;
      const matchImpact = !highImpactOnly || e.impact === "HIGH";
      return matchCurr && matchImpact;
    });
  }, [events, selectedCurrency, highImpactOnly]);

  // Group events by day of week
  const eventsByDay = useMemo(() => {
    const map: Record<string, EconomicEvent[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    for (const e of filteredEvents) {
      const day = e.dayOfWeek || "Wednesday";
      if (!map[day]) map[day] = [];
      map[day].push(e);
    }

    return map;
  }, [filteredEvents]);

  return (
    <div className="space-y-10">
      {/* ── HEADER & SCHEDULE CONTROLS ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Macro Schedule • {weekRange}</span>
            {isLoading && <RefreshCw className="w-3 h-3 text-slate-400 animate-spin ml-1" />}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Institutional Economic Calendar
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Raw numbers leave traders guessing. We explain what each release means for Gold, EUR, GBP, and JPY before and after data drops. Click any release for the full analysis.
          </p>
        </div>

        {/* Legend */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4 text-xs font-mono font-medium shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-slate-700">High Impact</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-700">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Normal</span>
          </div>
        </div>
      </div>

      {/* ── NEXT HIGH-IMPACT VOLATILITY CATALYST COUNTDOWN HERO ── */}
      <NextRiskHeroCountdown events={events} />

      {/* ── INTERACTIVE FILTER BAR ── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Currency Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs font-bold font-mono">
          <span className="text-slate-400 mr-1 font-sans font-semibold text-xs flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            Currency:
          </span>
          {CURRENCIES.map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedCurrency === curr
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* Impact Filter Switch */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            onClick={() => setHighImpactOnly(!highImpactOnly)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${highImpactOnly
              ? "bg-red-50 text-red-700 border-red-200 font-bold font-mono"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${highImpactOnly ? "bg-red-600 animate-pulse" : "bg-slate-400"
                }`}
            />
            High Impact Releases Only
          </button>
          <span className="text-slate-400 font-mono text-[11px]">
            {filteredEvents.length} Events Listed
          </span>
        </div>
      </div>

      {/* ── CALENDAR BY DAY OF WEEK ── */}
      <div className="space-y-10">
        {DAYS.map((day) => {
          const dayEvents = eventsByDay[day] || [];
          if (dayEvents.length === 0) return null;

          return (
            <section key={day} className="space-y-4">
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-slate-900 text-white font-extrabold text-xs tracking-wider uppercase font-mono">
                    {day}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {dayEvents[0]?.date || "This Week"} • {dayEvents.length} Releases
                  </span>
                </div>
              </div>

              {/* Event Cards */}
              <div className="space-y-4">
                {dayEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/news/${event.slug}`}
                    className="rounded-2xl bg-white border border-slate-200 hover:border-slate-400 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row group block cursor-pointer"
                  >
                    {/* Thumbnail Image (Left) */}
                    <div className="relative w-full md:w-64 h-44 md:h-auto shrink-0 overflow-hidden bg-slate-900">
                      <Image
                        src={
                          event.imageUrl ||
                          "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 font-mono shadow-xs">
                          {event.currency} • {event.country}
                        </span>
                        {event.session && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono bg-slate-900/80 text-white backdrop-blur-md">
                            {event.session}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Details (Right) */}
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500 font-mono font-medium">
                              {event.time}
                            </span>
                            <VolatilityBadge level={event.volatilityRisk} />
                            <LiveReleaseCountdown
                              timeStr={event.time}
                              dayOfWeek={event.dayOfWeek}
                              actual={event.actual}
                            />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                        </div>

                        {/* Hard Numbers Box */}
                        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono shrink-0">
                          <div>
                            <span className="text-slate-400 mr-1.5">Act:</span>
                            <span
                              className={
                                event.actual
                                  ? "text-red-600 font-bold"
                                  : "text-slate-400 font-medium"
                              }
                            >
                              {event.actual || "Pending"}
                            </span>
                          </div>
                          <span className="text-slate-300">|</span>
                          <div>
                            <span className="text-slate-400 mr-1.5">Frc:</span>
                            <span className="text-slate-800 font-bold">
                              {event.forecast}
                            </span>
                          </div>
                          <span className="text-slate-300">|</span>
                          <div>
                            <span className="text-slate-400 mr-1.5">Prv:</span>
                            <span className="text-slate-600">
                              {event.previous}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Context Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            Plain-English Summary:
                          </span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {event.summaryWhatHappened}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Market Reaction Driver:
                          </span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {event.whyMarketMoved}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Gold Impact & Read More Action */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-slate-500 font-semibold flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            Asset Impact:
                          </span>
                          <div className="flex flex-wrap items-center gap-3">
                            {getEventAssetImpacts(event).map((impact, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="text-slate-700 font-mono font-bold text-[11px]">
                                  {impact.asset}
                                </span>
                                <BiasMeter
                                  bias={impact.bias}
                                  confidencePct={0}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                          Read Full Intelligence Breakdown
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <NewsletterBanner contextMessage="Get every economic release preview sent directly to your inbox before the data drops." />
    </div>
  );
}
