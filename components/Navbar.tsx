import Link from "next/link";
import { Activity, Calendar, Compass, Radio } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Official Custom Logo Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 shadow-xs group-hover:border-blue-500 transition-all">
            <svg
              viewBox="0 0 256 256"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Pillar */}
              <path
                d="M 52 64 L 52 192"
                stroke="#FFFFFF"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Right Pillar */}
              <path
                d="M 204 64 L 204 192"
                stroke="#FFFFFF"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Center Dynamic Macro Pulse (Letter M Chevron) */}
              <path
                d="M 52 110 L 94 172 L 128 52 L 162 172 L 204 110"
                stroke="#2563EB"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-lg tracking-tight font-sans">
                Macro<span className="text-blue-600">Pulse</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-widest bg-slate-900 text-white">
                WIRE
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-tight">
              Global Forex &amp; Macro Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link
            href="/"
            className="text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-1"
          >
            <Activity className="w-4 h-4 text-blue-600" />
            Live Wire
          </Link>
          <Link
            href="/calendar"
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            Economic Calendar
          </Link>
          <Link
            href="/bias/xauusd"
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            Market Radar
          </Link>
        </nav>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">LIVE FEED ACTIVE</span>
            <span className="sm:hidden">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
