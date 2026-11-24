"use client";

import React, { useEffect, useRef, memo } from "react";

function TickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset container to avoid duplicate widgets in React Strict Mode / HMR
    containerRef.current.innerHTML = "";

    const widgetWrapper = document.createElement("div");
    widgetWrapper.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetWrapper);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "TVC:DXY", title: "US Dollar Index" },
        { proName: "OANDA:XAUUSD", title: "Spot Gold (XAUUSD)" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "TVC:US10Y", title: "US 10-Yr Yield" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "FX:USDJPY", title: "USD/JPY" },
        { proName: "CAPITALCOM:US100", title: "Nasdaq 100" },
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "light",
      locale: "en",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full bg-white border-b border-slate-200 overflow-hidden py-1 min-h-[46px]">
      <div className="tradingview-widget-container" ref={containerRef} />
    </div>
  );
}

export default memo(TickerTape);
