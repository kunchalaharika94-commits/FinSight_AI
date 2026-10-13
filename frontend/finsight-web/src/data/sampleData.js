// src/data/sampleData.js
// Static demo data shown on the Landing page before login.
// Never fetched, never changes.

export const SAMPLE_TICKER = "AAPL";
export const SAMPLE_COMPANY = "Apple Inc.";
export const SAMPLE_SECTOR = "Technology";
export const SAMPLE_PRICE = 227.16;
export const SAMPLE_CHANGE = 2.84;

export const SAMPLE_KPIS = [
    { label: "Market Cap", value: "$3.52T" },
    { label: "P/E Ratio", value: "34.2" },
    { label: "EPS", value: "6.64" },
    { label: "Profit Margin", value: "24.3%" },
    { label: "Beta", value: "1.24" },
    { label: "Dividend Yield", value: "0.44%" },
];

export const SAMPLE_RISK = {
    score: 32,
    level: "Low",
    volatility: "18%",
    anomaly_rate: "2%",
};

export const SAMPLE_SENTIMENT = {
    positive: "68%",
    negative: "14%",
    neutral: "18%",
    overall: "Positive",
};

export const SAMPLE_FORECAST = {
    trend: "Bullish",
    next_30_days: "+4.2%",
    confidence: "72%",
};

export const SAMPLE_FINANCIALS = [
    { label: "Revenue", value: "$391.0B" },
    { label: "Net Income", value: "$97.0B" },
    { label: "Operating Margin", value: "30.7%" },
    { label: "Total Assets", value: "$352.6B" },
    { label: "Total Liabilities", value: "$290.4B" },
    { label: "Current Ratio", value: "0.99" },
];

export const SAMPLE_NEWS = [
    { headline: "Apple unveils new AI features across product lineup", sentiment: "Positive" },
    { headline: "iPhone sales beat analyst expectations in Q4", sentiment: "Positive" },
    { headline: "Regulatory scrutiny intensifies in EU market", sentiment: "Negative" },
    { headline: "Services revenue hits all-time high", sentiment: "Positive" },
];

export const SAMPLE_AI_INSIGHT = `
Apple Inc. continues to demonstrate strong fundamentals with a P/E of 34.2
and a healthy profit margin of 24.3%. The company's low risk profile (score 32)
and positive market sentiment (68% positive news) suggest stable near-term
performance. Forecast models indicate a bullish 30-day trend with 72% confidence.
Watch for regulatory developments in the EU as a potential headwind.
`.trim();

export const SAMPLE_CHART_DATA = [
  { day: "Mon", price: 218.4 },
  { day: "Tue", price: 221.1 },
  { day: "Wed", price: 219.7 },
  { day: "Thu", price: 223.5 },
  { day: "Fri", price: 225.2 },
  { day: "Sat", price: 224.8 },
  { day: "Sun", price: 227.16 },
];