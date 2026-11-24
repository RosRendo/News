"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface LiveReleaseCountdownProps {
  timeStr: string;
  dayOfWeek?: string;
  actual: string | null;
}

export default function LiveReleaseCountdown({
  timeStr,
  dayOfWeek,
  actual,
}: LiveReleaseCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isImminent, setIsImminent] = useState<boolean>(false);

  useEffect(() => {
    if (actual !== null) {
      return;
    }

    function calculateTimeRemaining() {
      const now = new Date();
      // Calculate target time based on dayOfWeek or default to upcoming Friday 13:30 GMT
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

      const targetDay = dayOfWeek && dayMap[dayOfWeek] !== undefined ? dayMap[dayOfWeek] : 5;
      let dayDiff = (targetDay - now.getDay() + 7) % 7;
      if (dayDiff === 0 && now.getHours() >= 13) {
        dayDiff = 7;
      }
      
      target.setDate(now.getDate() + dayDiff);
      target.setUTCHours(13, 30, 0, 0);

      const diffMs = target.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft("Releasing Now");
        setIsImminent(true);
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      if (hours < 1) {
        setIsImminent(true);
        setTimeLeft(`${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`);
      } else if (hours < 24) {
        setIsImminent(false);
        setTimeLeft(`${hours}h ${String(mins).padStart(2, "0")}m`);
      } else {
        const days = Math.floor(hours / 24);
        const remHours = hours % 24;
        setIsImminent(false);
        setTimeLeft(`${days}d ${remHours}h`);
      }
    }

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [timeStr, dayOfWeek, actual]);

  if (actual !== null) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Released
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight border shadow-xs ${
        isImminent
          ? "bg-red-50 text-red-700 border-red-300 animate-pulse"
          : "bg-blue-50 text-blue-700 border-blue-200"
      }`}
    >
      <Clock className={`w-3 h-3 ${isImminent ? "text-red-600 animate-spin" : "text-blue-600"}`} />
      <span>T-Minus: {timeLeft || "Upcoming"}</span>
    </span>
  );
}
