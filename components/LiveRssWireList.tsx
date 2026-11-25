"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, ExternalLink, ArrowRight } from "lucide-react";

interface WireItem {
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

export default function LiveRssWireList() {
  const [items, setItems] = useState<WireItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadWire() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.items && active) {
          setItems(data.items.slice(0, 8));
          setLoading(false);
        }
      } catch {
        // fallback
      }
    }

    loadWire();
    const timer = setInterval(loadWire, 60000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-blue-600" />
            Breaking News Wire
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400">
          Live Stream
        </span>
      </div>

      {/* Wire List */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const Content = (
            <div className="py-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors group cursor-pointer space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {item.category}
                </span>
                <span className="text-slate-400">{item.time}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>{item.source}</span>
                {item.isExternal ? (
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            </div>
          );

          if (item.isExternal && item.url) {
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {Content}
              </a>
            );
          }

          return (
            <Link key={item.id} href={`/news/${item.slug}`} className="block">
              {Content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
