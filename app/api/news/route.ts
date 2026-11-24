import { NextResponse } from "next/server";
import { SAMPLE_EVENTS } from "@/lib/newsData";

interface LiveWireItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  currency: string;
  time: string;
  source: string;
  url?: string;
  isExternal?: boolean;
}

let cachedWire: LiveWireItem[] = [];
let lastFetch = 0;
const CACHE_MS = 90 * 1000; // 90 seconds cache

function parseRssItems(xml: string, sourceName: string, defaultCategory: string, defaultCurrency: string): LiveWireItem[] {
  const items: LiveWireItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
    const itemBlock = match[1];
    const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemBlock);
    const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemBlock);
    const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemBlock);
    const dateMatch = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i.exec(itemBlock);

    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
      const rawDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      const link = linkMatch ? linkMatch[1].trim() : "";
      
      let timeStr = "Just now";
      if (dateMatch && dateMatch[1]) {
        try {
          const d = new Date(dateMatch[1]);
          const diffMins = Math.floor((Date.now() - d.getTime()) / 60000);
          if (diffMins < 60) timeStr = `${Math.max(1, diffMins)}m ago`;
          else if (diffMins < 1440) timeStr = `${Math.floor(diffMins / 60)}h ago`;
          else timeStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
          timeStr = "Today";
        }
      }

      // Generate clean slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .slice(0, 50);

      items.push({
        id: `rss-${slug}-${items.length}`,
        slug: slug,
        title,
        summary: rawDesc.slice(0, 180) + (rawDesc.length > 180 ? "..." : ""),
        category: defaultCategory,
        currency: defaultCurrency,
        time: timeStr,
        source: sourceName,
        url: link,
        isExternal: true,
      });
    }
  }

  return items;
}

export async function GET() {
  const now = Date.now();
  if (now - lastFetch < CACHE_MS && cachedWire.length > 0) {
    return NextResponse.json({ success: true, items: cachedWire, count: cachedWire.length, cached: true });
  }

  // 1. Transform internal comprehensive SAMPLE_EVENTS into wire items
  const internalWire: LiveWireItem[] = SAMPLE_EVENTS.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    summary: e.summaryWhatHappened,
    category: e.category || "Macro",
    currency: e.currency,
    time: e.time,
    source: e.sourceAttribution ? e.sourceAttribution.replace("Official Release: ", "").replace("Official Source: ", "") : "MacroPulse Editorial",
    isExternal: false,
  }));

  // 2. Fetch live external RSS feeds (Yahoo Forex & CNBC Economy)
  try {
    const [yahooRes, cnbcRes] = await Promise.all([
      fetch("https://feeds.finance.yahoo.com/rss/2.0/headline?s=EURUSD=X,GBPUSD=X,GC=F,DX-Y.NYB&region=US&lang=en-US", {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 90 },
      }).catch(() => null),
      fetch("https://www.cnbc.com/id/10000664/device/rss/rss.html", {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 90 },
      }).catch(() => null),
    ]);

    let externalItems: LiveWireItem[] = [];

    if (yahooRes && yahooRes.ok) {
      const yahooXml = await yahooRes.text();
      externalItems = externalItems.concat(parseRssItems(yahooXml, "Yahoo Finance Wire", "FX & Currencies", "USD"));
    }

    if (cnbcRes && cnbcRes.ok) {
      const cnbcXml = await cnbcRes.text();
      externalItems = externalItems.concat(parseRssItems(cnbcXml, "CNBC Macro Desk", "Global Economy", "USD"));
    }

    // Interleave internal deep-dives with live breaking wire
    const combined: LiveWireItem[] = [];
    const maxLen = Math.max(internalWire.length, externalItems.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < internalWire.length) combined.push(internalWire[i]);
      if (i < externalItems.length) combined.push(externalItems[i]);
    }

    cachedWire = combined;
    lastFetch = now;

    return NextResponse.json({
      success: true,
      items: cachedWire,
      count: cachedWire.length,
      cached: false,
    });
  } catch {
    cachedWire = internalWire;
    return NextResponse.json({
      success: true,
      items: internalWire,
      count: internalWire.length,
      fallback: true,
    });
  }
}
