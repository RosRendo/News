import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TickerTape from "@/components/TickerTape";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MacroPulse — Global Forex & Macroeconomic News Intelligence",
  description:
    "Real-time Forex news, economic calendar deviation analysis, and daily macro bias. Pure verified financial facts and plain-English market breakdowns.",
  keywords: [
    "Forex news",
    "macroeconomic news",
    "economic calendar",
    "CPI inflation analysis",
    "Non farm payrolls forecast",
    "XAUUSD gold news",
    "central bank interest rates",
  ],
  other: {
    "google-adsense-account": "ca-pub-4146607505401554",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4146607505401554" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4146607505401554"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600/10 selection:text-blue-900">
        <Navbar />
        <TickerTape />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-extrabold text-slate-900 text-sm tracking-tight">MacroPulse Wire</div>
                <p className="text-slate-500 text-[11px]">Independent financial journalism & macroeconomic intelligence.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium text-xs">
                <Link href="/" className="hover:text-slate-900 transition-colors">Live Wire</Link>
                <Link href="/calendar" className="hover:text-slate-900 transition-colors">Economic Calendar</Link>
                <Link href="/bias/xauusd" className="hover:text-slate-900 transition-colors">Gold & Currencies</Link>
                <Link href="/bias/eurusd" className="hover:text-slate-900 transition-colors">Currency Biases</Link>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <p>© {new Date().getFullYear()} MacroPulse Media. All financial facts sourced from official government agencies and central banks.</p>
              <p>For educational & macroeconomic research purposes only. Not financial advice.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
