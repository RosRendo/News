import { NextResponse } from "next/server";
import { getAllEvents } from "@/lib/newsStore";
import { EconomicEvent } from "@/lib/types";

// Helper to format date cleanly as "Nov 25" or "Dec 02"
function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET() {
  try {
    const rawEvents = getAllEvents();
    const now = new Date();

    // Determine current week's Monday through Friday dates
    const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ...
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() + mondayOffset);

    const weekDates: Record<string, { date: Date; dateStr: string; isPast: boolean; isToday: boolean }> = {};
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    dayNames.forEach((name, idx) => {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + idx);
      
      const isPast = d.getDate() < now.getDate() && d.getMonth() <= now.getMonth();
      const isToday = d.toDateString() === now.toDateString();

      weekDates[name] = {
        date: d,
        dateStr: formatShortDate(d),
        isPast,
        isToday,
      };
    });

    // Dynamically adjust events to current active trading week
    const liveCalendarEvents: EconomicEvent[] = rawEvents.map((evt) => {
      const day = evt.dayOfWeek || "Wednesday";
      const weekInfo = weekDates[day];

      if (!weekInfo) return evt;

      // If the event is in the past, ensure actual has a value
      let actual = evt.actual;
      if (weekInfo.isPast && !actual) {
        actual = evt.forecast || "Completed";
      }

      // If the event is in the future (e.g. Thursday or Friday of current week), actual must be null for pending
      if (!weekInfo.isPast && !weekInfo.isToday && (evt.id.includes("nfp") || evt.id.includes("boe"))) {
        actual = null;
      }

      return {
        ...evt,
        date: weekInfo.dateStr,
        actual: actual,
      };
    });

    // Sort: High impact first, then chronologically by day of week
    const dayOrder: Record<string, number> = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
    };

    liveCalendarEvents.sort((a, b) => {
      const dayA = dayOrder[a.dayOfWeek || "Monday"] || 3;
      const dayB = dayOrder[b.dayOfWeek || "Monday"] || 3;
      if (dayA !== dayB) return dayA - dayB;
      if (a.impact === "HIGH" && b.impact !== "HIGH") return -1;
      if (b.impact === "HIGH" && a.impact !== "HIGH") return 1;
      return 0;
    });

    return NextResponse.json(
      {
        success: true,
        events: liveCalendarEvents,
        weekRange: `${weekDates.Monday.dateStr} – ${weekDates.Friday.dateStr}, ${now.getFullYear()}`,
        currentDay: dayNames[Math.min(4, Math.max(0, currentDayOfWeek - 1))],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
