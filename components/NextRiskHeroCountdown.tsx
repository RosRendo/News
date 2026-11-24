"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EconomicEvent } from "@/lib/types";
import { AlertCircle, ArrowRight, ShieldAlert, Timer } from "lucide-react";

interface NextRiskHeroCountdownProps {
  events: EconomicEvent[];
}

export default function NextRiskHeroCountdown({ events }: NextRiskHeroCountdownProps) {
  // Find the first upcoming event (where actual === null and impact === HIGH)
  const nextEvent =
    events.find((e) => e.actual === null && e.impact === "HIGH") ||
    events.find((e) => e.actual === null) ||
    events[0];

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function tick() {
      const now = new Date();
      const target = new Date();

      const dayMap: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const targetDay =
        nextEvent?.dayOfWeek && dayMap[nextEvent.dayOfWeek] !== undefined
          ? dayMap[nextEvent.dayOfWeek]
          : 5;

      let dayDiff = (targetDay - now.getDay() + 7) % 7;
      if (dayDiff === 0 && now.getHours() >= 13) {
        dayDiff = 7;
      }

      target.setDate(now.getDate() + dayDiff);
      target.setUTCHours(13, 30, 0, 0);

      const diff = Math.max(0, target.getTime() - now.getTime());
      const totalSec = Math.floor(diff / 1000);

      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  if (!nextEvent) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column: Event Metadata */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Next Volatility Catalyst
            </span>
            <span className="text-xs font-mono text-slate-400">
              {nextEvent.country} • {nextEvent.currency} • {nextEvent.time}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
            {nextEvent.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {nextEvent.summaryWhatHappened}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Frc: <strong className="text-white">{nextEvent.forecast}</strong></span>
              <span className="text-slate-600">|</span>
              <span>Prv: <strong className="text-slate-400">{nextEvent.previous}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span>Risk: <strong>{nextEvent.volatilityRisk}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Tech T-Minus Digital Blocks */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              <Timer className="w-3.5 h-3.5 text-blue-400" />
              Interbank T-Minus Countdown
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 min-w-[56px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-white">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Days</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 min-w-[56px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Hours</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 min-w-[56px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Mins</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-blue-950/80 border border-blue-500/40 min-w-[56px] sm:min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-blue-400 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-blue-300">Secs</span>
              </div>
            </div>
          </div>

          <Link
            href={`/news/${nextEvent.slug}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-blue-600/30 group shrink-0"
          >
            <span>Trade Strategy</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
