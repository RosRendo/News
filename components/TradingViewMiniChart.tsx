"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewMiniChartProps {
  symbol?: string;
  height?: number;
}

const SYMBOL_MAP: Record<string, string> = {
  XAUUSD: "OANDA:XAUUSD",
  EURUSD: "FX:EURUSD",
  GBPUSD: "FX:GBPUSD",
  USDJPY: "FX:USDJPY",
  AUDUSD: "FX:AUDUSD",
  USDCAD: "FX:USDCAD",
  USDCHF: "FX:USDCHF",
  US100: "CAPITALCOM:US100",
  US500: "CAPITALCOM:US500",
  NVDA: "NASDAQ:NVDA",
  DXY: "CAPITALCOM:DXY",
  BTCUSD: "BINANCE:BTCUSDT",
};

function TradingViewMiniChart({ symbol = "XAUUSD", height = 220 }: TradingViewMiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = SYMBOL_MAP[symbol.toUpperCase()] || `FX:${symbol.toUpperCase()}`;

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetWrapper = document.createElement("div");
    widgetWrapper.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetWrapper);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: tvSymbol,
      width: "100%",
      height: String(height),
      locale: "en",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
      chartOnly: false,
      noTimeScale: false,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [tvSymbol, height]);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-2 shadow-xs">
      <div className="tradingview-widget-container" ref={containerRef} />
    </div>
  );
}

export default memo(TradingViewMiniChart);
