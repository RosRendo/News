"use client";

import { useState } from "react";
import { Calculator, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function MacroRiskCalculator() {
  const [balance, setBalance] = useState<number>(50000);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [stopLossPips, setStopLossPips] = useState<number>(35);
  const [pair, setPair] = useState<"XAUUSD" | "EURUSD" | "GBPUSD">("XAUUSD");

  const riskAmount = (balance * riskPct) / 100;
  
  // Calculate recommended lot size
  const pipValuePerLot = 10;
  const calculatedLots = stopLossPips > 0 ? (riskAmount / (stopLossPips * pipValuePerLot)) : 0;
  const safeNewsLots = calculatedLots * 0.6; // 40% discount for news volatility slippage buffer

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Calculator className="w-3.5 h-3.5" />
            Prop-Firm News Guard Tool
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            News Volatility Lot Size Calculator
          </h3>
          <p className="text-xs text-slate-500">
            Calculate your exact lot size with built-in slippage buffer so sudden high-impact wicks never violate your max daily drawdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["XAUUSD", "EURUSD", "GBPUSD"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPair(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                pair === p
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Controls */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Account Size */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold">Account Size ($)</label>
              <select
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              >
                <option value={10000}>$10,000 (Funded Starter)</option>
                <option value={25000}>$25,000 (Standard)</option>
                <option value={50000}>$50,000 (Pro Trader)</option>
                <option value={100000}>$100,000 (Master Account)</option>
                <option value={200000}>$200,000 (Institutional)</option>
              </select>
            </div>

            {/* Risk % */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold">Risk per Trade (%)</label>
              <select
                value={riskPct}
                onChange={(e) => setRiskPct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              >
                <option value={0.5}>0.5% (Conservative)</option>
                <option value={1.0}>1.0% (Standard Prop Rule)</option>
                <option value={1.5}>1.5% (Moderate Aggression)</option>
                <option value={2.0}>2.0% (High Volatility Max)</option>
              </select>
            </div>

            {/* Stop Loss Pips */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold">Stop Loss (Pips / Points)</label>
              <input
                type="number"
                min={5}
                max={200}
                value={stopLossPips}
                onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-amber-950">High-Impact News Rule:</strong> During NFP and CPI, broker spreads widen by 2–5x. We automatically compute a 40% safety buffer to prevent trailing stop slippage.
            </p>
          </div>
        </div>

        {/* Output Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="space-y-1">
            <div className="text-[11px] uppercase font-mono text-slate-500 font-bold">Max Capital at Risk</div>
            <div className="text-2xl font-black text-slate-900 font-mono">${riskAmount.toFixed(2)}</div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1">
            <div className="text-[11px] uppercase font-mono text-slate-500 font-bold">Standard Safe Size</div>
            <div className="text-xl font-bold text-slate-700 font-mono">{calculatedLots.toFixed(2)} Lots</div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1 bg-teal-50/80 p-3 rounded-xl border border-teal-200">
            <div className="text-[10px] uppercase font-mono text-teal-800 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Recommended News Sizing
            </div>
            <div className="text-2xl font-black text-teal-700 font-mono">{safeNewsLots.toFixed(2)} Lots</div>
          </div>

          <a
            href="https://journex-khaki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm"
          >
            Execute on MT5 via Journex
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
