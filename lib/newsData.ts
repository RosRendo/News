import { EconomicEvent, PairBias, AssetImpact } from "./types";

export function formatAssetName(raw: string): string {
  if (!raw) return raw;
  const clean = raw.trim();
  if (/^NVDA|Nvidia/i.test(clean)) return "Nvidia (NVDA)";
  if (/^XAUUSD/i.test(clean)) return "Gold (XAU)";
  if (/^EURUSD/i.test(clean)) return "EUR/USD";
  if (/^GBPUSD/i.test(clean)) return "GBP/USD";
  if (/^USDJPY/i.test(clean)) return "USD/JPY";
  if (/^AUDUSD/i.test(clean)) return "AUD/USD";
  if (/^EURGBP/i.test(clean)) return "EUR/GBP";
  if (/^USDCAD/i.test(clean)) return "USD/CAD";
  if (/^USDCHF/i.test(clean)) return "USD/CHF";
  if (/US100|Nasdaq/i.test(clean)) return "Nasdaq (US100)";
  if (/US500|S&P/i.test(clean)) return "S&P 500 (US500)";
  if (/DXY|Dollar/i.test(clean)) return "U.S. Dollar (DXY)";
  return clean.replace(/\s*\(.*?\)/, "");
}

export function getEventAssetImpacts(event: EconomicEvent): AssetImpact[] {
  // 1. If explicit primaryImpacts defined, use them
  if (event.primaryImpacts && event.primaryImpacts.length > 0) {
    return event.primaryImpacts;
  }

  // 2. Derive dynamically from keyLevels (which are tailored to each specific release)
  if (event.keyLevels && event.keyLevels.length >= 2) {
    return event.keyLevels.slice(0, 2).map((lvl) => ({
      asset: formatAssetName(lvl.pair),
      bias: lvl.bias,
      confidencePct: 80,
    }));
  }

  if (event.keyLevels && event.keyLevels.length === 1) {
    const primary: AssetImpact = {
      asset: formatAssetName(event.keyLevels[0].pair),
      bias: event.keyLevels[0].bias,
      confidencePct: 85,
    };
    // Complementary asset based on currency or asset type
    let secondary: AssetImpact;
    if (event.currency === "EUR") {
      secondary = { asset: "DAX 40", bias: event.keyLevels[0].bias === "BEARISH" ? "BULLISH" : "BEARISH", confidencePct: 70 };
    } else if (event.currency === "JPY") {
      secondary = { asset: "Nikkei 225", bias: "NEUTRAL", confidencePct: 65 };
    } else if (event.currency === "GBP") {
      secondary = { asset: "EUR/GBP", bias: event.keyLevels[0].bias === "BEARISH" ? "BULLISH" : "BEARISH", confidencePct: 70 };
    } else if (event.currency === "AUD") {
      secondary = { asset: "AUD/NZD", bias: event.keyLevels[0].bias, confidencePct: 65 };
    } else if (event.currency === "CAD") {
      secondary = { asset: "WTI Crude Oil", bias: "BULLISH", confidencePct: 70 };
    } else if (event.category?.toLowerCase().includes("equit") || event.title.toLowerCase().includes("tech")) {
      secondary = { asset: "US 10Y Yield", bias: "BULLISH", confidencePct: 75 };
    } else {
      secondary = { asset: "U.S. Dollar (DXY)", bias: event.assetReactions?.usd || "BULLISH", confidencePct: 80 };
    }
    return [primary, secondary];
  }

  // 3. Event-specific fallback based on currency & topic
  if (event.currency === "GBP") {
    return [
      { asset: "GBP/USD", bias: "BEARISH", confidencePct: 75 },
      { asset: "EUR/GBP", bias: "BULLISH", confidencePct: 70 },
    ];
  }
  if (event.currency === "EUR") {
    return [
      { asset: "EUR/USD", bias: "BEARISH", confidencePct: 80 },
      { asset: "DAX 40", bias: "BULLISH", confidencePct: 65 },
    ];
  }
  if (event.currency === "JPY") {
    return [
      { asset: "USD/JPY", bias: "BULLISH", confidencePct: 80 },
      { asset: "Nikkei 225", bias: "NEUTRAL", confidencePct: 60 },
    ];
  }
  if (event.currency === "AUD") {
    return [
      { asset: "AUD/USD", bias: "BULLISH", confidencePct: 75 },
      { asset: "AUD/NZD", bias: "BULLISH", confidencePct: 65 },
    ];
  }
  if (event.currency === "CAD") {
    return [
      { asset: "USD/CAD", bias: "BEARISH", confidencePct: 75 },
      { asset: "WTI Crude Oil", bias: "BULLISH", confidencePct: 70 },
    ];
  }

  if (
    event.category?.toLowerCase().includes("equit") ||
    event.category?.toLowerCase().includes("tech") ||
    event.title.toLowerCase().includes("tech")
  ) {
    return [
      { asset: "Nasdaq (US100)", bias: event.assetReactions?.equities || "BEARISH", confidencePct: 80 },
      { asset: "US 10Y Yield", bias: "BULLISH", confidencePct: 75 },
    ];
  }

  return [
    { asset: "U.S. Dollar (DXY)", bias: event.assetReactions?.usd || "BULLISH", confidencePct: 85 },
    { asset: "Gold (XAU)", bias: event.assetReactions?.gold || "BEARISH", confidencePct: 80 },
  ];
}

export function getEventChartSymbol(event: EconomicEvent): string {
  // 1. Nvidia specific
  if (
    event.slug.includes("nvda") ||
    event.slug.includes("nvidia") ||
    event.title.toLowerCase().includes("nvidia") ||
    event.title.toLowerCase().includes("jensen")
  ) {
    return "NVDA";
  }

  // 2. Tech & equities
  if (
    event.category?.toLowerCase().includes("tech") ||
    event.category?.toLowerCase().includes("equit") ||
    event.title.toLowerCase().includes("tech") ||
    event.title.toLowerCase().includes("nasdaq")
  ) {
    return "US100";
  }

  // 2. Explicit currency matches
  if (event.currency === "GBP") return "GBPUSD";
  if (event.currency === "EUR") return "EURUSD";
  if (event.currency === "JPY") return "USDJPY";
  if (event.currency === "AUD") return "AUDUSD";
  if (event.currency === "CAD") return "USDCAD";

  // 3. Gold / commodities
  if (
    event.title.toLowerCase().includes("gold") ||
    event.title.toLowerCase().includes("bullion") ||
    event.slug.includes("gold")
  ) {
    return "XAUUSD";
  }

  // 4. Check first keyLevel if present
  if (event.keyLevels && event.keyLevels.length > 0) {
    const pair = event.keyLevels[0].pair.toUpperCase();
    if (pair.includes("US100") || pair.includes("NASDAQ")) return "US100";
    if (pair.includes("US500") || pair.includes("S&P")) return "US500";
    if (pair.includes("EURUSD")) return "EURUSD";
    if (pair.includes("GBPUSD")) return "GBPUSD";
    if (pair.includes("USDJPY")) return "USDJPY";
    if (pair.includes("AUDUSD")) return "AUDUSD";
    if (pair.includes("XAUUSD") || pair.includes("GOLD")) return "XAUUSD";
  }

  return "XAUUSD";
}

export const TICKER_ITEMS = [
  { symbol: "DXY", name: "US Dollar Index", price: "104.48", change: "+0.65%", isUp: true },
  { symbol: "XAUUSD", name: "Spot Gold", price: "$3,654.70", change: "+3.96%", isUp: true },
  { symbol: "EURUSD", name: "Euro / USD", price: "1.0892", change: "-0.76%", isUp: false },
  { symbol: "US10Y", name: "US 10-Yr Yield", price: "4.942%", change: "+0.61%", isUp: true },
  { symbol: "GBPUSD", name: "Pound / USD", price: "1.3023", change: "-0.45%", isUp: false },
  { symbol: "US100", name: "Nasdaq 100", price: "26,787.12", change: "+7.02%", isUp: true },
  { symbol: "NVDA", name: "Nvidia Corp", price: "$142.80", change: "+30.40%", isUp: true },
  { symbol: "USDJPY", name: "USD / Yen", price: "159.18", change: "+0.42%", isUp: true },
  { symbol: "AUDUSD", name: "Aussie / USD", price: "0.6542", change: "+0.28%", isUp: true },
  { symbol: "USDCAD", name: "USD / CAD", price: "1.3850", change: "-0.15%", isUp: false },
  { symbol: "USDCHF", name: "USD / Swiss", price: "0.8920", change: "+0.18%", isUp: true },
  { symbol: "BTCUSD", name: "Bitcoin", price: "$61,460.39", change: "+0.49%", isUp: true },
];

export const SAMPLE_EVENTS: EconomicEvent[] = [
  {
    id: "evt-cpi-001",
    slug: "us-core-cpi-inflation",
    title: "U.S. Core CPI Accelerates to 0.3%: Higher-For-Longer Fed Rates Cap Gold Upside",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Wednesday",
    date: "Nov 25",
    session: "NEW_YORK",
    time: "14 mins ago · 13:30 GMT",
    impact: "HIGH",
    category: "US Inflation",
    readTime: "3 min read",
    author: "Macro Intelligence Desk · Washington & New York",
    sourceAttribution: "Official Release: U.S. Bureau of Labor Statistics (BLS)",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1400&q=80",
    actual: "0.3%",
    forecast: "0.2%",
    previous: "0.2%",
    surpriseDeviation: 0.1,
    summaryWhatHappened: "U.S. Core Consumer Prices rose 0.3% month-over-month, beating Wall Street consensus of 0.2%. Sticky rent, shelter, and medical care services prevented inflation from cooling towards the Fed's 2% objective.",
    whyMarketMoved: "A hotter print forces institutional bond desks to slash expectations of an aggressive rate-cutting cycle. Benchmark 10-Year Treasury yields climbed towards 4.94%, providing fundamental fuel for the U.S. Dollar.",
    fullArticle: [
      "The U.S. Bureau of Labor Statistics reported this morning that the Consumer Price Index for All Urban Consumers (CPI-U) increased 0.3 percent in October on a seasonally adjusted basis, after rising 0.2 percent in September. Over the last 12 months, the all items index increased 2.6 percent before seasonal adjustment.",
      "The index for shelter rose 0.4 percent in October, accounting for over half of the monthly all items increase. The food index also increased over the month, rising 0.2 percent as the food at home index increased 0.1 percent and the food away from home index rose 0.2 percent. The energy index was unchanged over the month, after declining 1.9 percent in September.",
      "Excluding food and energy, the core CPI rose 0.3 percent in October, matching the monthly increases in August and September. Major contributors to the core increase included shelter, used cars and trucks, airline fares, medical care, and recreation.",
      "For financial markets, the persistent strength in core services proves that the final mile of the Federal Reserve's disinflation process remains bumpy. Interest rate futures immediately repriced the terminal Fed Funds rate higher, reducing the probability of an immediate aggressive rate cut.",
      "In foreign exchange and commodities, the U.S. Dollar Index (DXY) advanced to 104.48, while Spot Gold (XAUUSD) faced immediate liquidity consolidation, fluctuating around its key $3,660 pivot near $3,654 per ounce."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "BEARISH",
      equities: "BEARISH",
    },
    volatilityRisk: "EXTREME",
    keyLevels: [
      {
        pair: "XAUUSD (Gold)",
        bias: "BEARISH",
        keyPivot: "$3,660",
        tradeScenario: "Sellers defending $3,660 pivot; targeting liquidity pool at $3,630. Bullish structure invalidated above $3,685.",
      },
      {
        pair: "EURUSD",
        bias: "BEARISH",
        keyPivot: "1.0920",
        tradeScenario: "Heavy transatlantic rate divergence; targeting breakdown through 1.0880 towards multi-month support at 1.0850.",
      },
      {
        pair: "USDJPY",
        bias: "BULLISH",
        keyPivot: "158.80",
        tradeScenario: "Yield spread widening pushes pair towards 160.00. Watch for verbal intervention from Tokyo Ministry of Finance.",
      },
    ],
  },
  {
    id: "evt-nfp-002",
    slug: "us-non-farm-payrolls",
    title: "Non-Farm Payrolls Preview: How 175K Target Dictates Next Week's Gold Breakout",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Friday",
    date: "Nov 27",
    session: "NEW_YORK",
    time: "Friday · 13:30 GMT",
    impact: "HIGH",
    category: "Labor Market",
    readTime: "4 min read",
    author: "Global Employment Trends Desk",
    sourceAttribution: "Official Source: U.S. Department of Labor (DOL)",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    actual: null,
    forecast: "175K",
    previous: "142K",
    summaryWhatHappened: "The marquee jobs report determining whether the U.S. economy is landing soft or re-accelerating. Critical indicator for the Fed's dual mandate.",
    whyMarketMoved: "A print exceeding 200K will trigger aggressive Dollar buying and Gold capitulation. A print under 130K will spark an instant Gold short squeeze back toward $3,690.",
    fullArticle: [
      "Global currency markets are turning their full attention to the upcoming U.S. Non-Farm Payrolls (NFP) report scheduled for Friday at 13:30 GMT. Consensus expectations look for 175,000 net new payrolls added, compared to the previous reading of 142,000.",
      "The Federal Reserve has repeatedly emphasized that labor market resilience is now equally weighted alongside inflation in their monetary policy reaction function. With unemployment steady near 4.1%, any significant crack in hiring could accelerate calls for consecutive rate cuts.",
      "Conversely, average hourly earnings will be scrutinized for second-round wage-push pressures. Economists anticipate monthly wage growth of 0.3%, which would maintain annual earnings at 3.8%.",
      "Scenario 1 (Hot Labor Market > 200K): Would crush market expectations of Fed easing, sending benchmark Treasury yields higher and pushing EUR/USD down toward 1.0850 support zones.",
      "Scenario 2 (Cooling Labor Market < 130K): Would ignite a powerful risk-on impulse, weakening the Dollar and triggering a surge in Spot Gold toward $3,690."
    ],
    assetReactions: {
      usd: "NEUTRAL",
      gold: "NEUTRAL",
      equities: "NEUTRAL",
    },
    volatilityRisk: "EXTREME",
    keyLevels: [
      {
        pair: "XAUUSD (Gold)",
        bias: "NEUTRAL",
        keyPivot: "$3,670",
        tradeScenario: "Market orders carry high slippage risk during the 13:30 opening candle. Wait for 15-minute swing high/low break confirmation.",
      },
      {
        pair: "GBPUSD",
        bias: "NEUTRAL",
        keyPivot: "1.3050",
        tradeScenario: "Key inflection between 1.2980 support and 1.3100 resistance ahead of the release.",
      },
    ],
  },
  {
    id: "evt-gold-004",
    slug: "gold-bullion-demand-central-banks",
    title: "Central Bank Gold Accumulation Hits Record Pace Near $3,650 Spot Plateau",
    country: "Global",
    currency: "USD",
    dayOfWeek: "Tuesday",
    date: "Nov 24",
    session: "LONDON",
    time: "2 hours ago",
    impact: "MEDIUM",
    category: "Commodities & Metals",
    readTime: "3 min read",
    author: "Metals & Sovereign Reserves Analysis Desk",
    sourceAttribution: "Official Data: World Gold Council (WGC)",
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
    actual: "1,040t",
    forecast: "950t",
    previous: "890t",
    surpriseDeviation: 90,
    summaryWhatHappened: "Sovereign reserves and Eastern central banks purchased over 1,000 tonnes of physical gold bullion year-to-date, providing a structural long-term floor beneath prices.",
    whyMarketMoved: "Even while short-term interest rate yields create temporary dips in gold, persistent physical buying creates aggressive buy-the-dip demand zones between $3,600 - $3,630.",
    fullArticle: [
      "According to the latest quarterly data from the World Gold Council, central banks around the globe have purchased an unprecedented 1,040 metric tonnes of physical gold in the year to date.",
      "This robust institutional appetite has defied traditional correlation models. Historically, a surging U.S. Dollar and elevated real bond yields create severe downward pressure on non-yielding assets like precious metals.",
      "However, structural reserve diversification away from U.S. Treasury paper—spearheaded by central banks across emerging economies, China, and Eastern Europe—has absorbed Western paper sell-offs with ease.",
      "Institutional commodity desks note that while speculative futures contracts on COMEX may experience short-term liquidations on hawkish Fed commentary, physical bullion vaults are absorbing supply around the $3,600–$3,630 price band.",
      "Analysts view any corrective pullback towards $3,600 as high-probability sovereign accumulation territory rather than the start of a secular bear trend."
    ],
    assetReactions: {
      usd: "NEUTRAL",
      gold: "BULLISH",
      equities: "NEUTRAL",
    },
    volatilityRisk: "NORMAL",
    keyLevels: [
      {
        pair: "XAUUSD",
        bias: "BULLISH",
        keyPivot: "$3,640",
        tradeScenario: "Institutional order block between $3,600–$3,630 acts as high-probability swing accumulation territory.",
      },
    ],
  },
  {
    id: "evt-boe-003",
    slug: "boe-interest-rate-decision",
    title: "Bank of England Eyes 25 Bps Cut: Sterling Tests Fragile 1.3000 Demand Floor",
    country: "United Kingdom",
    currency: "GBP",
    dayOfWeek: "Thursday",
    date: "Nov 26",
    session: "LONDON",
    time: "Thursday · 12:00 GMT",
    impact: "HIGH",
    category: "Central Banks",
    readTime: "3 min read",
    author: "European Monetary Policy Bureau",
    sourceAttribution: "Official Announcement: Bank of England MPC",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    actual: null,
    forecast: "4.75%",
    previous: "5.00%",
    summaryWhatHappened: "Bank of England Monetary Policy Committee meeting. Markets heavily price in a 25 basis point reduction as UK headline inflation decelerated.",
    whyMarketMoved: "Currency reaction will hinge on the voting split. If 8 or more members vote for rate cuts, expect a sharp cascade through the 1.3000 handle.",
    fullArticle: [
      "The Bank of England's Monetary Policy Committee (MPC) gathers this week facing a delicate balancing act between slowing domestic economic momentum and persistent service-sector wage pressures.",
      "Interest rate swaps currently price an 88% probability that Governor Andrew Bailey and his colleagues will lower the Bank Rate by 25 basis points from 5.00% to 4.75%.",
      "Recent data showed UK headline inflation dropped to 1.7% in September, falling below the central bank's 2.0% statutory target for the first time in over three years. This sharp decline provides dovish members with justification to ease borrowing costs.",
      "Key Market Focus: The internal committee vote split will serve as the primary catalyst for British Pound volatility. A decisive 8-1 or 9-0 vote for a rate reduction would signal a faster loosening cycle, likely breaking Sterling below 1.2980.",
      "Conversely, a tight 5-4 split would indicate lingering inflation anxiety among policymakers, offering GBP/USD bulls a window for a relief rally back towards 1.3100."
    ],
    assetReactions: {
      usd: "NEUTRAL",
      gold: "NEUTRAL",
      equities: "BULLISH",
    },
    volatilityRisk: "ELEVATED",
    keyLevels: [
      {
        pair: "GBPUSD",
        bias: "BEARISH",
        keyPivot: "1.3050",
        tradeScenario: "Dovish guidance triggers test of 1.2980 swing support. Invalidation above 1.3100.",
      },
      {
        pair: "EURGBP",
        bias: "BULLISH",
        keyPivot: "0.8350",
        tradeScenario: "Sterling underperformance on rate cuts creates upward momentum toward 0.8400.",
      },
    ],
  },
  {
    id: "evt-fed-fomc-006",
    slug: "fed-fomc-interest-rate-projection",
    title: "Federal Reserve FOMC Policy Decision: Powell Resists Aggressive Easing Path",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Wednesday",
    date: "Nov 25",
    session: "NEW_YORK",
    time: "Wednesday · 18:00 GMT",
    impact: "HIGH",
    category: "Central Banks",
    readTime: "4 min read",
    author: "Federal Reserve Bureau · Washington D.C.",
    sourceAttribution: "Official Statement: Federal Reserve Board of Governors",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    actual: "4.75%",
    forecast: "4.75%",
    previous: "5.00%",
    surpriseDeviation: 0.0,
    summaryWhatHappened: "The Federal Open Market Committee lowered the benchmark federal funds rate by 25 basis points to a target range of 4.50% to 4.75%, matching market consensus.",
    whyMarketMoved: "Fed Chair Jerome Powell reiterated in his press conference that the central bank is in no hurry to slash rates toward neutral, maintaining a data-dependent, meeting-by-meeting stance.",
    fullArticle: [
      "In a widely anticipated decision, the Federal Open Market Committee voted unanimously to lower the federal funds rate by 25 basis points, following September's outsized 50-basis-point reduction.",
      "The accompanying policy statement noted that economic activity continues to expand at a solid pace, though labor market conditions have generally eased compared to earlier in the year.",
      "Powell emphasized that while progress on inflation continues, underlying core pressures warrant careful policy calibration rather than pre-committed easing.",
      "Markets interpreted the press conference as slightly hawkish relative to dovish Wall Street positioning. Benchmark 2-Year Treasury yields firmed, capping gains across equity indexes."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "NEUTRAL",
      equities: "BEARISH",
    },
    volatilityRisk: "EXTREME",
    keyLevels: [
      {
        pair: "EURUSD",
        bias: "BEARISH",
        keyPivot: "1.0920",
        tradeScenario: "Bears defend 1.0920 pivot; targeting liquidity sweep through 1.0850.",
      },
      {
        pair: "USDJPY",
        bias: "BULLISH",
        keyPivot: "158.80",
        tradeScenario: "Yield spread support pushes price toward 160.00.",
      },
    ],
  },
  {
    id: "evt-ecb-007",
    slug: "ecb-monetary-policy-rate-cuts",
    title: "ECB Lowers Deposit Rate to 3.25% as Eurozone Economic Stagnation Deepens",
    country: "Eurozone",
    currency: "EUR",
    dayOfWeek: "Thursday",
    date: "Nov 26",
    session: "LONDON",
    time: "Thursday · 13:15 GMT",
    impact: "HIGH",
    category: "Central Banks",
    readTime: "3 min read",
    author: "Frankfurt Monetary Desk",
    sourceAttribution: "Official Release: European Central Bank (ECB)",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    actual: "3.25%",
    forecast: "3.25%",
    previous: "3.50%",
    surpriseDeviation: 0.0,
    summaryWhatHappened: "The ECB Governing Council enacted a 25 basis point reduction in its key deposit facility rate, citing deteriorating private sector activity across Germany and France.",
    whyMarketMoved: "President Christine Lagarde noted downside risks to growth have increased, opening the door for consecutive cuts at upcoming winter meetings and weakening the Euro.",
    fullArticle: [
      "The European Central Bank announced a 25-basis-point cut to its three key interest rates, marking the third rate reduction of this monetary cycle.",
      "The incoming information on inflation shows that the disinflationary process is well on track. The inflation outlook is also affected by recent downside surprises in indicators of economic activity.",
      "With German manufacturing mired in contraction and regional credit demand sluggish, policymakers expressed concern that restrictive rates could cause a prolonged stagnation.",
      "EUR/USD faced immediate selling pressure, breaking below 1.0900 as investors price in a wider interest rate divergence between Frankfurt and Washington."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "NEUTRAL",
      equities: "BULLISH",
    },
    volatilityRisk: "HIGH" as any,
    keyLevels: [
      {
        pair: "EURUSD",
        bias: "BEARISH",
        keyPivot: "1.0920",
        tradeScenario: "Sub-1.0900 close confirms continuation towards multi-month base at 1.0850.",
      },
    ],
  },
  {
    id: "evt-retail-008",
    slug: "us-retail-sales-consumer-resilience",
    title: "U.S. Retail Sales Top Forecasts at 0.4%: Household Spending Defies Slowdown Fears",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Tuesday",
    date: "Nov 24",
    session: "NEW_YORK",
    time: "Tuesday · 13:30 GMT",
    impact: "HIGH",
    category: "US Inflation",
    readTime: "3 min read",
    author: "U.S. Macro Consumer Desk",
    sourceAttribution: "Official Release: U.S. Census Bureau",
    imageUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80",
    actual: "0.4%",
    forecast: "0.3%",
    previous: "0.1%",
    surpriseDeviation: 0.1,
    summaryWhatHappened: "American consumer spending remained robust, climbing 0.4% in September, led by strong online shopping, dining, and grocery purchases.",
    whyMarketMoved: "Consumer resilience provides fundamental proof that the U.S. economy continues to expand above trend, supporting Treasury yields and the Dollar.",
    fullArticle: [
      "Advance estimates of U.S. retail and food services sales for September 2024 were $714.4 billion, an increase of 0.4 percent from the previous month and 1.7 percent above September 2023.",
      "Core retail sales, which strip out volatile categories like automobiles, gasoline, and building materials, advanced 0.7%, indicating that household discretionary spending remains firmly positive.",
      "The robust spending backdrop reinforces the narrative that the Federal Reserve faces no imminent recession risk, allowing policymakers to maintain a cautious pace of policy easing.",
      "Following the release, currency desks bought U.S. Dollars against both the Euro and Japanese Yen, while benchmark 10-Year Treasury yields ticked higher."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "BEARISH",
      equities: "BULLISH",
    },
    volatilityRisk: "ELEVATED",
    keyLevels: [
      {
        pair: "USDJPY",
        bias: "BULLISH",
        keyPivot: "158.80",
        tradeScenario: "Bullish momentum targets 159.50 with invalidation below 158.20.",
      },
    ],
  },
  {
    id: "evt-boj-010",
    slug: "boj-yield-curve-control-intervention",
    title: "Bank of Japan Holds Policy Rate at 0.25%: Ueda Signals December Hike on Table",
    country: "Japan",
    currency: "JPY",
    dayOfWeek: "Wednesday",
    date: "Nov 25",
    session: "ASIAN",
    time: "Wednesday · 03:00 GMT",
    impact: "HIGH",
    category: "Central Banks",
    readTime: "3 min read",
    author: "Tokyo Asia-Pacific Bureau",
    sourceAttribution: "Official Release: Bank of Japan (BOJ)",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    actual: "0.25%",
    forecast: "0.25%",
    previous: "0.25%",
    surpriseDeviation: 0.0,
    summaryWhatHappened: "The Bank of Japan kept its uncollateralized overnight call rate steady at 0.25% in a unanimous vote, as widely expected by financial institutions.",
    whyMarketMoved: "Governor Kazuo Ueda struck a cautious tone regarding U.S. economic uncertainty, but reiterated that if economic activity and prices develop in line with outlooks, the bank will continue to raise rates.",
    fullArticle: [
      "The Bank of Japan maintained its policy settings at its monetary policy meeting, voting 9-0 to keep its benchmark short-term interest rate target unchanged at 0.25 percent.",
      "In its quarterly outlook report, the BoJ projected core consumer inflation to hover around its 2% target through fiscal 2026, driven by sustained wage increases.",
      "Governor Ueda noted that while risks surrounding overseas economies are elevated, domestic consumption is recovering moderately and corporate profit margins are holding up.",
      "Currency traders witnessed sharp two-way volatility on USD/JPY, testing 158.50 before rebounding towards 159.20 as the market weighed the timing of the next BoJ hike."
    ],
    assetReactions: {
      usd: "NEUTRAL",
      gold: "NEUTRAL",
      equities: "NEUTRAL",
    },
    volatilityRisk: "EXTREME",
    keyLevels: [
      {
        pair: "USDJPY",
        bias: "BULLISH",
        keyPivot: "158.80",
        tradeScenario: "Uptrend intact towards 160.00. Watch for Ministry of Finance warning statements.",
      },
    ],
  },
  {
    id: "evt-ism-mfg-016",
    slug: "ism-manufacturing-pmi-contraction",
    title: "U.S. ISM Manufacturing PMI Contracts to 46.5: New Orders and Hiring Soften",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Monday",
    date: "Nov 23",
    session: "NEW_YORK",
    time: "Monday · 15:00 GMT",
    impact: "HIGH",
    category: "Macro Activity",
    readTime: "3 min read",
    author: "Industrial Activity Bureau",
    sourceAttribution: "Official Report: Institute for Supply Management (ISM)",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    actual: "46.5",
    forecast: "47.6",
    previous: "47.2",
    surpriseDeviation: -1.1,
    summaryWhatHappened: "The U.S. manufacturing sector contracted for the eighth consecutive month in October, dropping to 46.5 as companies held back on capital investment.",
    whyMarketMoved: "A softer manufacturing print dragged Treasury yields lower temporarily, providing brief support for bullion before broad dollar buying resumed.",
    fullArticle: [
      "Economic activity in the manufacturing sector contracted in October for the eighth consecutive month and the 23rd time in the last 24 months, according to the nation's supply executives in the latest Manufacturing ISM Report On Business.",
      "The Manufacturing PMI registered 46.5 percent, 0.7 percentage point lower than the 47.2 percent recorded in September. The New Orders Index remained in contraction at 47.1 percent.",
      "Respondents cited demand softness across automotive, heavy machinery, and fabricated metals, alongside election-related uncertainty and elevated financing costs.",
      "Despite the manufacturing malaise, the broader economy remains buoyed by the much larger service sector, limiting sustained downside in dollar valuations."
    ],
    assetReactions: {
      usd: "BEARISH",
      gold: "BULLISH",
      equities: "NEUTRAL",
    },
    volatilityRisk: "ELEVATED",
    keyLevels: [
      {
        pair: "XAUUSD",
        bias: "BULLISH",
        keyPivot: "$3,650",
        tradeScenario: "Temporary safe haven bid targets $3,675. Resistance solid at $3,685.",
      },
    ],
  },
  {
    id: "evt-ism-srv-017",
    slug: "ism-services-pmi-expansion",
    title: "U.S. Services PMI Surges to 56.0: Dominant Sector Accelerates at Fastest Pace in Two Years",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Wednesday",
    date: "Nov 25",
    session: "NEW_YORK",
    time: "Wednesday · 15:00 GMT",
    impact: "HIGH",
    category: "Macro Activity",
    readTime: "3 min read",
    author: "Services Sector Analysis Desk",
    sourceAttribution: "Official Report: Institute for Supply Management (ISM)",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    actual: "56.0",
    forecast: "53.8",
    previous: "54.9",
    surpriseDeviation: 2.2,
    summaryWhatHappened: "The Institute for Supply Management's services index jumped to 56.0 in October, well above consensus and representing the highest reading since mid-2022.",
    whyMarketMoved: "Because the services sector accounts for over two-thirds of the American economy, this blowout expansion reinforces the higher-for-longer Fed interest rate outlook.",
    fullArticle: [
      "Economic activity in the services sector expanded in October for the fourth consecutive month and the 50th time in the last 53 months, according to the Services ISM Report On Business.",
      "The Services PMI registered 56.0 percent, 1.1 percentage points higher than the September reading of 54.9 percent. The Employment Index swung back into expansion territory at 53.0 percent.",
      "Fourteen services industries reported growth in October, led by information, retail trade, transportation, and health care.",
      "The powerful report sparked immediate institutional bond selling, pushing the 10-Year Treasury yield toward 4.94% and driving the Dollar Index higher."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "BEARISH",
      equities: "BULLISH",
    },
    volatilityRisk: "ELEVATED",
    keyLevels: [
      {
        pair: "EURUSD",
        bias: "BEARISH",
        keyPivot: "1.0920",
        tradeScenario: "Heavy selling pressure pushes pair towards 1.0850 support floor.",
      },
    ],
  },
  {
    id: "evt-rba-013",
    slug: "rba-interest-rate-australian-dollar",
    title: "RBA Maintains Cash Rate at 4.35%: Governor Bullock Warns Inflation Remains Sticky",
    country: "Australia",
    currency: "AUD",
    dayOfWeek: "Tuesday",
    date: "Nov 24",
    session: "ASIAN",
    time: "Tuesday · 03:30 GMT",
    impact: "HIGH",
    category: "Central Banks",
    readTime: "3 min read",
    author: "Sydney Asia-Pacific Bureau",
    sourceAttribution: "Official Statement: Reserve Bank of Australia (RBA)",
    imageUrl: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80",
    actual: "4.35%",
    forecast: "4.35%",
    previous: "4.35%",
    surpriseDeviation: 0.0,
    summaryWhatHappened: "The Reserve Bank of Australia kept its cash rate target unchanged at 4.35%, maintaining its status as one of the most hawkish major central banks.",
    whyMarketMoved: "Governor Michele Bullock affirmed that underlying inflation is still too high and that the board is not ruling anything in or out, giving the Aussie Dollar relative strength.",
    fullArticle: [
      "The Reserve Bank of Australia decided to leave the cash rate target unchanged at 4.35 percent and the interest rate paid on Exchange Settlement balances unchanged at 4.25 percent.",
      "While headline inflation has declined substantially due to state electricity rebates, underlying inflation—as captured by the trimmed mean—remains at 3.5%, well above the midpoint of the 2-3% target range.",
      "The board noted that aggregate demand remains above the economy's supply capacity, with labor market conditions remaining tight and private service sector inflation sticky.",
      "AUD/USD held firm near 0.6580, outperforming other high-beta currencies on expectations that the RBA will delay rate cuts until mid-2025."
    ],
    assetReactions: {
      usd: "NEUTRAL",
      gold: "BULLISH",
      equities: "NEUTRAL",
    },
    volatilityRisk: "ELEVATED",
    keyLevels: [
      {
        pair: "AUDUSD",
        bias: "BULLISH",
        keyPivot: "0.6580",
        tradeScenario: "Hawkish hold supports bounce toward 0.6650 resistance.",
      },
    ],
  },
  {
    id: "evt-jobless-019",
    slug: "us-initial-jobless-claims-labor-slack",
    title: "U.S. Weekly Jobless Claims Drop to 216K: No Broad Cracks in Labor Market",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Thursday",
    date: "Nov 26",
    session: "NEW_YORK",
    time: "Thursday · 13:30 GMT",
    impact: "MEDIUM",
    category: "Labor Market",
    readTime: "2 min read",
    author: "Labor Trends Desk",
    sourceAttribution: "Official Data: U.S. Department of Labor (DOL)",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    actual: "216K",
    forecast: "230K",
    previous: "228K",
    surpriseDeviation: -14,
    summaryWhatHappened: "First-time applications for U.S. unemployment benefits fell to 216,000, undershooting forecasts and hitting the lowest level since May.",
    whyMarketMoved: "Fewer layoffs demonstrate that businesses are hoarding labor despite elevated interest rates, limiting the urgency for aggressive monetary easing.",
    fullArticle: [
      "In the week ending November 16, the advance figure for seasonally adjusted initial claims was 216,000, a decrease of 12,000 from the previous week's revised level.",
      "The 4-week moving average was 222,000, a decrease of 4,000 from the previous week's revised average.",
      "Continuing claims, which measure the number of people receiving unemployment benefits after an initial week of aid, held steady near 1.86 million.",
      "The steady claims data keeps downward pressure on the probability of a supersized Fed rate cut, sustaining the Dollar's broad advance."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "BEARISH",
      equities: "BULLISH",
    },
    volatilityRisk: "NORMAL",
    keyLevels: [
      {
        pair: "EURUSD",
        bias: "BEARISH",
        keyPivot: "1.0920",
        tradeScenario: "Steady dollar bids keep EUR/USD capped below 1.0900.",
      },
    ],
  },
  {
    id: "evt-tech-005",
    slug: "nasdaq-rate-sensitivity-earnings",
    title: "Tech Heavyweights Stumble as Treasury Yields Reclaim 4.94% Threshold",
    country: "United States",
    currency: "USD",
    dayOfWeek: "Monday",
    date: "Nov 23",
    session: "NEW_YORK",
    time: "3 hours ago",
    impact: "MEDIUM",
    category: "Equities & Yields",
    readTime: "3 min read",
    author: "Global Equity Derivatives Desk",
    sourceAttribution: "Official Data: U.S. Department of the Treasury",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    actual: "-0.62%",
    forecast: "+0.10%",
    previous: "+0.45%",
    surpriseDeviation: -0.72,
    summaryWhatHappened: "High-multiple semiconductor and growth stocks experienced institutional de-risking as higher discount rates compress valuation multiples.",
    whyMarketMoved: "Discounted Cash Flow models penalize long-duration tech earnings whenever the 10-Year yield surges higher.",
    fullArticle: [
      "Wall Street's tech-heavy Nasdaq 100 retreated 0.62% during midday trade, led lower by mega-cap semiconductor fabricators and cloud computing software providers.",
      "The pullback coincided directly with benchmark 10-Year U.S. Treasury yields marching back up to 4.94%, their highest levels in months.",
      "Because mega-cap technology equities derive a significant portion of their intrinsic enterprise valuation from projected cash flows far into the future, higher benchmark discount rates directly compress their current fair market multiples.",
      "Traders noted rotation out of high-beta growth stocks into defensive consumer staples and financial sector names that benefit from widened net interest margins.",
      "Technical support for the Nasdaq 100 sits at 26,500. A failure to hold this zone could open the door for a deeper consolidation toward the 50-day exponential moving average."
    ],
    assetReactions: {
      usd: "BULLISH",
      gold: "BEARISH",
      equities: "BEARISH",
    },
    volatilityRisk: "ELEVATED",
    keyLevels: [
      {
        pair: "US100 (Nasdaq)",
        bias: "BEARISH",
        keyPivot: "26,800",
        tradeScenario: "Short continuation on retests of 26,800 with downside target at 26,500.",
      },
      {
        pair: "US500 (S&P 500)",
        bias: "BEARISH",
        keyPivot: "6,050",
        tradeScenario: "Defensive positioning favors sideways consolidation between 5,980 and 6,050.",
      },
    ],
  },
];

export const PAIR_BIASES: PairBias[] = [
  {
    pair: "XAUUSD",
    name: "Spot Gold",
    price: "$3,654.70",
    change: "+3.96%",
    isUp: true,
    bias: "BEARISH",
    confidencePct: 78,
    catalyst: "Elevated U.S. 10-Year real yields near 4.94% cap short-term upside as gold consolidates near the $3,660 pivot.",
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 3685.0,
      support: 3630.0,
      pivot: 3660.0,
    },
    traderAdvice: "Gold tests overhead resistance near $3,685. Key session pivot at $3,660 dictates whether pullback extends to $3,630.",
    updatedAt: "Updated Live",
  },
  {
    pair: "EURUSD",
    name: "Euro / US Dollar",
    price: "1.0892",
    change: "-0.76%",
    isUp: false,
    bias: "BEARISH",
    confidencePct: 82,
    catalyst: "ECB rate cut expectations and firm U.S. Treasury yields maintain downward pressure towards the 1.0850 base.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 1.096,
      support: 1.085,
      pivot: 1.092,
    },
    traderAdvice: "Downward trajectory intact below 1.0920 pivot. Heavy bids expected near 1.0850 support zone.",
    updatedAt: "Updated Live",
  },
  {
    pair: "GBPUSD",
    name: "British Pound / USD",
    price: "1.3023",
    change: "-0.45%",
    isUp: false,
    bias: "BEARISH",
    confidencePct: 65,
    catalyst: "Bank of England policy easing signals keep sterling consolidating around the 1.3000 psychological threshold.",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 1.31,
      support: 1.296,
      pivot: 1.305,
    },
    traderAdvice: "Sterling tests the 1.3000 threshold. Sustained trade below 1.3020 exposes 1.2960 swing support.",
    updatedAt: "Updated Live",
  },
  {
    pair: "USDJPY",
    name: "US Dollar / Japanese Yen",
    price: "159.18",
    change: "+0.42%",
    isUp: true,
    bias: "BULLISH",
    confidencePct: 74,
    catalyst: "Wide US-Japan sovereign yield gap powers dollar demand towards the 160.00 critical resistance ceiling.",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 160.5,
      support: 158.0,
      pivot: 158.8,
    },
    traderAdvice: "Strong upside momentum above 158.80. Traders on watch for Bank of Japan verbal intervention near 160.00.",
    updatedAt: "Updated Live",
  },
  {
    pair: "AUDUSD",
    name: "Australian Dollar / USD",
    price: "0.6542",
    change: "+0.28%",
    isUp: true,
    bias: "BULLISH",
    confidencePct: 75,
    catalyst: "RBA's hawkish posture and sticky services inflation provide fundamental support above the 0.6500 handle.",
    imageUrl: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 0.662,
      support: 0.648,
      pivot: 0.654,
    },
    traderAdvice: "Constructive bias above 0.6540 pivot. Sustained buying targets resistance at 0.6620.",
    updatedAt: "Updated Live",
  },
  {
    pair: "USDCAD",
    name: "US Dollar / Canadian Dollar",
    price: "1.3850",
    change: "-0.15%",
    isUp: false,
    bias: "BEARISH",
    confidencePct: 70,
    catalyst: "Bank of Canada easing trajectory balances against resilient energy export revenues.",
    imageUrl: "https://images.unsplash.com/photo-1517935703635-2719054540a2?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 1.392,
      support: 1.378,
      pivot: 1.385,
    },
    traderAdvice: "Rangebound near 1.3850. Sellers emerge on retests of 1.3900 with support firm at 1.3780.",
    updatedAt: "Updated Live",
  },
  {
    pair: "USDCHF",
    name: "US Dollar / Swiss Franc",
    price: "0.8920",
    change: "+0.18%",
    isUp: true,
    bias: "BULLISH",
    confidencePct: 72,
    catalyst: "Swiss National Bank rate cuts widen carry trade differential in favor of the Dollar.",
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 0.898,
      support: 0.885,
      pivot: 0.891,
    },
    traderAdvice: "Bullish posture holds above 0.8910 pivot, targeting overhead liquidity near 0.8980.",
    updatedAt: "Updated Live",
  },
  {
    pair: "US100",
    name: "Nasdaq 100 Index",
    price: "26,787.12",
    change: "+7.02%",
    isUp: true,
    bias: "BEARISH",
    confidencePct: 80,
    catalyst: "Surging 10-Year Treasury yields compress long-duration valuation multiples across mega-cap tech.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    keyLevels: {
      resistance: 27200.0,
      support: 26400.0,
      pivot: 26800.0,
    },
    traderAdvice: "Vulnerable to pullbacks while 10Y yields remain elevated. Key pivot at 26,800 dictates session direction.",
    updatedAt: "Updated Live",
  },
];
