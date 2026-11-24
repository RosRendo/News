"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface NewsletterBannerProps {
  pair?: string;
  contextMessage?: string;
}

export default function NewsletterBanner({
  pair,
  contextMessage = "Get institutional economic release previews, surprise probability models, and cross-asset pivots delivered every morning.",
}: NewsletterBannerProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section id="newsletter" className="w-full relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-10 my-8">
      {/* Subtle decorative background pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/40 via-slate-50 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Column: Editorial Value Proposition */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              The MacroPulse Daily Wire
            </span>
            <span className="text-xs text-slate-400 font-mono">06:00 London • 08:00 NY</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {pair ? `Never miss a high-impact catalyst on ${pair}` : "Actionable macroeconomic intelligence before the opening bell"}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {contextMessage} Join 45,000+ institutional analysts and currency traders reading verified data without algorithmic clickbait.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Official Data Sources Only
            </span>
            <span>•</span>
            <span>Unsubscribe anytime in 1-click</span>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full lg:w-auto shrink-0 min-w-[320px]">
          {subscribed ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900 font-medium text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">You are subscribed!</p>
                <p className="text-xs text-emerald-700">Check your inbox for tomorrow morning's London Briefing.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@pro-trader.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all w-full placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  Subscribe Free
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center sm:text-left">
                No ads. No trading bot promotions. Only verified economic facts.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
