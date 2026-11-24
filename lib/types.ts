export type ImpactLevel = "HIGH" | "MEDIUM" | "LOW";
export type Sentiment = "BULLISH" | "BEARISH" | "NEUTRAL";
export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "NZD";

export interface AssetImpact {
  asset: string;
  bias: Sentiment;
  confidencePct?: number;
}

export interface EconomicEvent {
  id: string;
  slug: string;
  title: string;
  country: string;
  currency: Currency;
  time: string;
  dayOfWeek?: string;
  date?: string;
  session?: "ASIAN" | "LONDON" | "NEW_YORK";
  impact: ImpactLevel;
  actual: string | null;
  forecast: string;
  previous: string;
  surpriseDeviation?: number;
  imageUrl?: string;
  category?: string;
  readTime?: string;
  author?: string;
  sourceAttribution?: string;
  fullArticle?: string[];
  
  // Plain-English Trader Breakdown
  summaryWhatHappened: string;
  whyMarketMoved: string;
  
  // Event-specific tailored primary asset impacts
  primaryImpacts?: AssetImpact[];
  assetReactions?: {
    usd: Sentiment;
    gold: Sentiment;
    equities: Sentiment;
  };
  keyLevels: {
    pair: string;
    bias: Sentiment;
    keyPivot: string;
    tradeScenario: string;
  }[];
  volatilityRisk: "EXTREME" | "ELEVATED" | "NORMAL";
}

export interface PairBias {
  pair: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  bias: Sentiment;
  confidencePct: number;
  catalyst: string;
  imageUrl?: string;
  keyLevels: {
    resistance: number;
    support: number;
    pivot: number;
  };
  traderAdvice: string;
  updatedAt: string;
}
