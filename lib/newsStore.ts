import fs from "fs";
import path from "path";
import { EconomicEvent, PairBias } from "./types";
import { SAMPLE_EVENTS, PAIR_BIASES } from "./newsData";

const DATA_DIR = path.join(process.cwd(), "data");
const SEED_DAILY_NEWS_FILE = path.join(DATA_DIR, "daily-news.json");

function getRuntimeStoragePath(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "daily-news.json");
  }
  return SEED_DAILY_NEWS_FILE;
}

export function getDynamicDailyEvents(): EconomicEvent[] {
  try {
    const runtimePath = getRuntimeStoragePath();
    // 1. Check runtime writable path first (e.g. /tmp if cron has run)
    if (fs.existsSync(runtimePath)) {
      const raw = fs.readFileSync(runtimePath, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // 2. Fall back to bundled committed seed file
    if (fs.existsSync(SEED_DAILY_NEWS_FILE)) {
      const raw = fs.readFileSync(SEED_DAILY_NEWS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveDynamicDailyEvents(newEvents: EconomicEvent[]): void {
  try {
    const existing = getDynamicDailyEvents();
    const newSlugs = new Set(newEvents.map((e) => e.slug));
    
    // Put newest/updated events first, keeping remaining historical briefings
    const combined = [...newEvents, ...existing.filter((e) => !newSlugs.has(e.slug))];
    const targetPath = getRuntimeStoragePath();
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(combined.slice(0, 50), null, 2), "utf8");
  } catch (err) {
    console.error("Non-fatal note: could not persist to disk, continuing in memory:", err);
  }
}

export function getAllEvents(): EconomicEvent[] {
  const dynamicEvents = getDynamicDailyEvents();
  const seenSlugs = new Set<string>();
  const combined: EconomicEvent[] = [];

  // Dynamic daily events first (newest)
  for (const event of dynamicEvents) {
    if (!seenSlugs.has(event.slug)) {
      seenSlugs.add(event.slug);
      combined.push(event);
    }
  }

  // Baseline events
  for (const event of SAMPLE_EVENTS) {
    if (!seenSlugs.has(event.slug)) {
      seenSlugs.add(event.slug);
      combined.push(event);
    }
  }

  return combined;
}

export function getEventBySlug(slug: string): EconomicEvent | undefined {
  const all = getAllEvents();
  return all.find((e) => e.slug === slug);
}

export function getPairBiases(): PairBias[] {
  return PAIR_BIASES;
}
