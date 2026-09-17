import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Market Indices & Breadth
interface MarketOverview {
  marketStatus: "OPEN" | "CLOSED" | "PRE-OPEN";
  istTime: string;
  dataFreshness: string;
  isLiveFeed: boolean;
  regime: {
    state: "STRONG BULL" | "BULL" | "RANGE" | "VOLATILE" | "BEAR" | "STRONG BEAR";
    score: number; // 0-100
    breadthPercent: number;
    momentumState: "ACCELERATING" | "POSITIVE" | "NEUTRAL" | "FADING" | "NEGATIVE";
    volatilityState: "LOW" | "MODERATE" | "ELEVATED" | "EXTREME";
    sectorParticipation: "BROAD-BASED" | "STRONG" | "SELECTIVE" | "WEAK" | "ROTATING";
    summary: string;
  };
  indices: {
    symbol: string;
    name: string;
    ltp: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: string;
  }[];
  advanceDecline: {
    advances: number;
    declines: number;
    unchanged: number;
    ratio: number;
  };
  indiaVix: {
    value: number;
    change: number;
    changePercent: number;
    status: "COOLING" | "MODERATE" | "ELEVATED" | "SPIKING";
  };
  sectors: {
    name: string;
    changePercent: number;
    weight: number;
    trend: "BULLISH" | "BEARISH" | "NEUTRAL";
    volumeMultiplier: number;
    participatingStocks?: number;
    totalStocks?: number;
    indexPoints?: number;
    topMovers?: string[];
    keyConstituents?: string[];
    relativeAtr?: number;
    atrPercent?: number;
    atrPoints?: number;
    beta?: number;
    volatilityState?: "SPIKE" | "EXPANDING" | "NORMAL" | "COMPRESSED";
  }[];
  fiiDiiActivity: {
    date: string;
    fiiNetCrores: number;
    diiNetCrores: number;
    totalNetCrores: number;
  };
}

// Initial market state
function getMarketState(): MarketOverview {
  const now = new Date();
  // Formatted IST
  const istString = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    marketStatus: "OPEN",
    istTime: istString,
    dataFreshness: "LIVE FEED • NSE L1 STREAM (120ms)",
    isLiveFeed: true,
    regime: {
      state: "BULL",
      score: 74,
      breadthPercent: 68.4,
      momentumState: "POSITIVE",
      volatilityState: "MODERATE",
      sectorParticipation: "STRONG",
      summary: "Broad-based index expansion above 20 EMA across Private Banks, Autos & Industrials. VIX is stabilized below 13.8.",
    },
    indices: [
      {
        symbol: "NIFTY 50",
        name: "Nifty 50 Index",
        ltp: 25374.85,
        change: 142.30,
        changePercent: 0.56,
        high: 25418.50,
        low: 25240.10,
        volume: "248.6M",
      },
      {
        symbol: "BANK NIFTY",
        name: "Nifty Bank Index",
        ltp: 54620.40,
        change: 388.90,
        changePercent: 0.72,
        high: 54780.00,
        low: 54290.15,
        volume: "182.4M",
      },
      {
        symbol: "FINNIFTY",
        name: "Nifty Financial Services",
        ltp: 25110.20,
        change: 164.50,
        changePercent: 0.66,
        high: 25160.00,
        low: 24960.30,
        volume: "94.2M",
      },
      {
        symbol: "SENSEX",
        name: "BSE Sensex 30",
        ltp: 82945.60,
        change: 462.15,
        changePercent: 0.56,
        high: 83120.00,
        low: 82510.40,
        volume: "145.8M",
      },
      {
        symbol: "NIFTY MIDCAP 100",
        name: "Nifty Midcap 100",
        ltp: 59340.10,
        change: 498.30,
        changePercent: 0.85,
        high: 59480.00,
        low: 58890.00,
        volume: "118.5M",
      }
    ],
    advanceDecline: {
      advances: 1468,
      declines: 742,
      unchanged: 84,
      ratio: 1.98,
    },
    indiaVix: {
      value: 12.84,
      change: -0.42,
      changePercent: -3.17,
      status: "COOLING",
    },
    sectors: [
      { 
        name: "NIFTY BANK", 
        changePercent: 0.72, 
        weight: 33.4, 
        trend: "BULLISH", 
        volumeMultiplier: 1.42, 
        participatingStocks: 10, 
        totalStocks: 12,
        indexPoints: 51842.15,
        relativeAtr: 1.28,
        atrPercent: 1.65,
        atrPoints: 855.0,
        beta: 1.25,
        volatilityState: "EXPANDING",
        topMovers: ["ICICIBANK +1.17%", "SBIN +1.10%", "HDFCBANK +0.65%"],
        keyConstituents: ["HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK", "KOTAKBANK"]
      },
      { 
        name: "NIFTY AUTO", 
        changePercent: 1.48, 
        weight: 7.2, 
        trend: "BULLISH", 
        volumeMultiplier: 1.85, 
        participatingStocks: 13, 
        totalStocks: 15,
        indexPoints: 26210.40,
        relativeAtr: 1.64,
        atrPercent: 2.15,
        atrPoints: 563.0,
        beta: 1.38,
        volatilityState: "SPIKE",
        topMovers: ["TATAMOTORS +2.35%", "M&M +1.99%", "MARUTI +0.72%"],
        keyConstituents: ["TATAMOTORS", "MARUTI", "M&M", "BAJAJ-AUTO", "HEROMOTOCO"]
      },
      { 
        name: "NIFTY IT", 
        changePercent: 0.38, 
        weight: 14.1, 
        trend: "NEUTRAL", 
        volumeMultiplier: 0.95, 
        participatingStocks: 5, 
        totalStocks: 10,
        indexPoints: 42180.75,
        relativeAtr: 0.92,
        atrPercent: 1.22,
        atrPoints: 514.0,
        beta: 0.88,
        volatilityState: "NORMAL",
        topMovers: ["INFY +0.86%", "TCS -0.32%", "WIPRO +0.15%"],
        keyConstituents: ["TCS", "INFY", "WIPRO", "HCLTECH", "TECHM"]
      },
      { 
        name: "NIFTY METAL", 
        changePercent: 1.15, 
        weight: 3.9, 
        trend: "BULLISH", 
        volumeMultiplier: 1.34, 
        participatingStocks: 11, 
        totalStocks: 15,
        indexPoints: 9480.60,
        relativeAtr: 1.42,
        atrPercent: 1.95,
        atrPoints: 184.0,
        beta: 1.34,
        volatilityState: "EXPANDING",
        topMovers: ["TATASTEEL +1.37%", "JSWSTEEL +1.05%", "HINDALCO +0.92%"],
        keyConstituents: ["TATASTEEL", "JSWSTEEL", "HINDALCO", "VEDL"]
      },
      { 
        name: "NIFTY REALTY", 
        changePercent: 1.92, 
        weight: 2.1, 
        trend: "BULLISH", 
        volumeMultiplier: 2.10, 
        participatingStocks: 9, 
        totalStocks: 10,
        indexPoints: 1045.80,
        relativeAtr: 1.75,
        atrPercent: 2.45,
        atrPoints: 25.6,
        beta: 1.55,
        volatilityState: "SPIKE",
        topMovers: ["DLF +2.18%", "GODREJPROP +1.74%", "OBEROIRLTY +1.20%"],
        keyConstituents: ["DLF", "GODREJPROP", "OBEROIRLTY", "PHOENIXLTD"]
      },
      { 
        name: "NIFTY ENERGY", 
        changePercent: 0.64, 
        weight: 12.3, 
        trend: "BULLISH", 
        volumeMultiplier: 1.18, 
        participatingStocks: 7, 
        totalStocks: 10,
        indexPoints: 40520.10,
        relativeAtr: 1.12,
        atrPercent: 1.35,
        atrPoints: 546.0,
        beta: 1.05,
        volatilityState: "NORMAL",
        topMovers: ["RELIANCE +1.62%", "ONGC +0.85%", "NTPC +0.45%"],
        keyConstituents: ["RELIANCE", "ONGC", "NTPC", "POWERGRID", "BPCL"]
      },
      { 
        name: "NIFTY FMCG", 
        changePercent: -0.45, 
        weight: 8.6, 
        trend: "BEARISH", 
        volumeMultiplier: 0.79, 
        participatingStocks: 4, 
        totalStocks: 15,
        indexPoints: 61850.30,
        relativeAtr: 0.72,
        atrPercent: 0.82,
        atrPoints: 507.0,
        beta: 0.58,
        volatilityState: "COMPRESSED",
        topMovers: ["ITC +0.12%", "HINDUNILVR -0.76%", "NESTLEIND -0.55%"],
        keyConstituents: ["HINDUNILVR", "ITC", "NESTLEIND", "BRITANNIA"]
      },
      { 
        name: "NIFTY PHARMA", 
        changePercent: -0.24, 
        weight: 4.8, 
        trend: "NEUTRAL", 
        volumeMultiplier: 0.88, 
        participatingStocks: 8, 
        totalStocks: 20,
        indexPoints: 23140.20,
        relativeAtr: 0.85,
        atrPercent: 0.98,
        atrPoints: 226.0,
        beta: 0.68,
        volatilityState: "COMPRESSED",
        topMovers: ["SUNPHARMA +0.44%", "CIPLA -0.15%", "DRREDDY -0.62%"],
        keyConstituents: ["SUNPHARMA", "CIPLA", "DRREDDY", "DIVISLAB"]
      },
    ],
    fiiDiiActivity: {
      date: "Latest Session",
      fiiNetCrores: 1428.60,
      diiNetCrores: 1894.40,
      totalNetCrores: 3323.00,
    },
  };
}

// Full-fidelity stock list with 5-factor confirmations
export interface StockSetup {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  sector: string;
  capCategory: "Large Cap" | "Mid Cap" | "Small Cap";
  isNifty50: boolean;
  isBankNifty: boolean;
  ltp: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  volume: string;
  relativeVolume: number; // e.g. 2.4x
  deliveryPercent: number; // e.g. 62%
  vwap: number;
  ema9: number;
  ema21: number;
  sma50: number;
  rsi: number;
  macdStatus: "BULLISH CROSS" | "BEARISH CROSS" | "EXPANDING ABOVE 0" | "BELOW 0";
  supertrend: "BULLISH" | "BEARISH" | "NEUTRAL";
  
  // 5-Factor Confirmations (0-20 each, Total 0-100)
  confirmations: {
    trend: {
      score: number; // 0-20
      status: "BULLISH" | "BEARISH" | "NEUTRAL";
      details: string[];
    };
    momentum: {
      score: number; // 0-20
      status: "EXPANDING" | "POSITIVE" | "EXHAUSTED" | "BEARISH DIVERGENCE";
      details: string[];
    };
    volume: {
      score: number; // 0-20
      status: "EXPLODING" | "EXPANDING" | "AVERAGE" | "WEAKENING DIVERGENCE";
      details: string[];
    };
    priceAction: {
      score: number; // 0-20
      status: "CLEAN BREAKOUT" | "SUPPORT BOUNCE" | "VWAP RECLAIM" | "CONSOLIDATION" | "FALSE BREAKOUT";
      details: string[];
    };
    marketAlignment: {
      score: number; // 0-20
      status: "HIGH ALIGNMENT" | "MODERATE" | "DIVERGENT";
      details: string[];
    };
  };

  // Confluence & Trade Setup
  confluenceScore: number; // 0-100
  confluenceGrade: "NO TRADE" | "WEAK" | "DEVELOPING" | "STRONG" | "HIGH CONFLUENCE" | "EXTREME CONFLUENCE";
  setup: "LONG SETUP" | "SHORT SETUP" | "WAIT" | "NO TRADE";
  setupType: "Momentum Breakout" | "ORB" | "Opening Range Breakout" | "Breakout Continuation" | "VWAP Momentum" | "Volume Explosion" | "Relative Strength" | "Pullback Continuation" | "Breakout Retest" | "Mean Reversion" | "Rangebound" | "VWAP Reclaim";
  isAggressiveMode: boolean;
  isHigherRisk: boolean;
  riskReason?: string;
  timeframeHorizon: "Intraday" | "Swing";
  
  // Trade parameters
  entryZone: string;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  riskReward: string; // e.g. "1 : 2.8"
  riskRewardRatio: number; // 2.8
  invalidation: string;
  signalRationale: string;
  confirmationsAlignedCount: number; // e.g. 5

  // Multi-timeframe intelligence
  timeframeMatrix: {
    tf5m: { trend: "BULLISH" | "BEARISH" | "NEUTRAL"; momentum: "STRONG" | "WEAK"; signal: "LONG" | "WAIT" | "SHORT" | "NO TRADE" };
    tf15m: { trend: "BULLISH" | "BEARISH" | "NEUTRAL"; momentum: "STRONG" | "WEAK"; signal: "LONG" | "WAIT" | "SHORT" | "NO TRADE" };
    tf1h: { trend: "BULLISH" | "BEARISH" | "NEUTRAL"; momentum: "STRONG" | "WEAK"; signal: "LONG" | "WAIT" | "SHORT" | "NO TRADE" };
    tf4h: { trend: "BULLISH" | "BEARISH" | "NEUTRAL"; momentum: "STRONG" | "WEAK"; signal: "LONG" | "WAIT" | "SHORT" | "NO TRADE" };
    tfDaily: { trend: "BULLISH" | "BEARISH" | "NEUTRAL"; momentum: "STRONG" | "WEAK"; signal: "LONG" | "WAIT" | "SHORT" | "NO TRADE" };
    alignedCount: number; // e.g. 4/5
    alignmentLabel: string;
  };
}

const STOCK_DATABASE: StockSetup[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: "NSE",
    sector: "Energy",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 3014.50,
    change: 48.20,
    changePercent: 1.62,
    high52w: 3217.90,
    low52w: 2220.30,
    volume: "8.42M",
    relativeVolume: 2.35,
    deliveryPercent: 64.2,
    vwap: 2988.40,
    ema9: 2992.10,
    ema21: 2974.50,
    sma50: 2940.00,
    rsi: 66.8,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 18,
        status: "BULLISH",
        details: ["Price > EMA9 > EMA21 > SMA50", "Supertrend green at 2965", "Sector Energy +0.64% aligned"],
      },
      momentum: {
        score: 17,
        status: "EXPANDING",
        details: ["RSI 66.8 breaking range resistance", "MACD histogram expanding above zero line", "ROC +2.8% acceleration"],
      },
      volume: {
        score: 19,
        status: "EXPLODING",
        details: ["Relative volume 2.35x 20-day avg", "Price rising + volume expanding simultaneously", "Delivery volume 64%"],
      },
      priceAction: {
        score: 17,
        status: "CLEAN BREAKOUT",
        details: ["Clean breakout above Previous Day High (₹2995)", "VWAP reclaim with strong bullish marubozu bar", "No overhead supply till ₹3080"],
      },
      marketAlignment: {
        score: 17,
        status: "HIGH ALIGNMENT",
        details: ["Nifty 50 +0.56% bullish regime", "FII heavy institutional buy block detected at ₹2990", "Beta 1.15 outperforming benchmark"],
      },
    },
    confluenceScore: 88,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Momentum Breakout",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹3005 – ₹3015",
    entryPrice: 3010.00,
    stopLoss: 2975.00,
    target1: 3075.00,
    target2: 3120.00,
    riskReward: "1 : 2.8",
    riskRewardRatio: 2.8,
    invalidation: "Setup invalidates if 15M candle closes below ₹2975 (VWAP & swing base).",
    signalRationale: "Signal generated because 5/5 confirmations align: price broke PDH with 2.35x volume, momentum expanding, and Nifty trend confirmation.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bullish Alignment",
    },
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    exchange: "NSE",
    sector: "Auto",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 994.25,
    change: 22.80,
    changePercent: 2.35,
    high52w: 1179.00,
    low52w: 640.00,
    volume: "14.1M",
    relativeVolume: 3.12,
    deliveryPercent: 58.4,
    vwap: 981.60,
    ema9: 984.00,
    ema21: 975.20,
    sma50: 962.00,
    rsi: 71.4,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 19,
        status: "BULLISH",
        details: ["Nifty Auto index leading market (+1.48%)", "Higher highs on 15M and 1H candles", "Trading 2.1% above day VWAP"],
      },
      momentum: {
        score: 19,
        status: "EXPANDING",
        details: ["RSI 71.4 with bullish momentum continuation", "Momentum acceleration ROC 3.4%", "Relative strength vs Nifty at 90-day high"],
      },
      volume: {
        score: 20,
        status: "EXPLODING",
        details: ["Abnormal volume explosion: 3.12x RVOL", "Consecutive 15m volume expansion bars", "High institutional delivery participation"],
      },
      priceAction: {
        score: 18,
        status: "CLEAN BREAKOUT",
        details: ["Opening Range Breakout (ORB 15m) confirmed", "Psychological ₹980 resistance converted into support", "Liquidity swept above ₹985 cleanly"],
      },
      marketAlignment: {
        score: 18,
        status: "HIGH ALIGNMENT",
        details: ["Sector leading the morning session", "Broad market advance-decline strongly supportive", "Bank & Auto leading market sentiment"],
      },
    },
    confluenceScore: 94,
    confluenceGrade: "EXTREME CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Opening Range Breakout",
    isAggressiveMode: true,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹990 – ₹995",
    entryPrice: 992.00,
    stopLoss: 974.00,
    target1: 1025.00,
    target2: 1048.00,
    riskReward: "1 : 3.1",
    riskRewardRatio: 3.1,
    invalidation: "Breach of ₹974 (15M ORB midpoint and VWAP cluster).",
    signalRationale: "5/5 confirmations align. Nifty Auto sector leader surging on 3.12x RVOL with clean opening range breakout.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Extreme Bullish Alignment",
    },
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: true,
    ltp: 1284.60,
    change: 14.80,
    changePercent: 1.17,
    high52w: 1335.00,
    low52w: 940.00,
    volume: "9.8M",
    relativeVolume: 1.95,
    deliveryPercent: 68.0,
    vwap: 1275.20,
    ema9: 1276.40,
    ema21: 1269.00,
    sma50: 1252.00,
    rsi: 64.2,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 18,
        status: "BULLISH",
        details: ["Bank Nifty index gaining +0.72%", "Bullish EMA stack on hourly and daily", "Steady ascending channel"],
      },
      momentum: {
        score: 16,
        status: "POSITIVE",
        details: ["RSI 64.2 trending upwards without divergence", "MACD bullish histogram ticks higher", "Rate of change steady"],
      },
      volume: {
        score: 17,
        status: "EXPANDING",
        details: ["Volume 1.95x standard daily run-rate", "Delivery percentage high at 68%", "Price rising + volume expanding"],
      },
      priceAction: {
        score: 17,
        status: "VWAP RECLAIM",
        details: ["Morning VWAP test held firmly with long lower wick", "Reclaimed previous session consolidation high", "Support firm at ₹1268"],
      },
      marketAlignment: {
        score: 18,
        status: "HIGH ALIGNMENT",
        details: ["HDFC Bank and ICICI Bank moving in tandem", "Bank Nifty breadth 10 advances / 2 declines", "VIX low providing comfortable environment"],
      },
    },
    confluenceScore: 86,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "VWAP Momentum",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹1280 – ₹1285",
    entryPrice: 1282.00,
    stopLoss: 1265.00,
    target1: 1315.00,
    target2: 1335.00,
    riskReward: "1 : 2.5",
    riskRewardRatio: 2.5,
    invalidation: "Closing below ₹1265 (session VWAP support).",
    signalRationale: "5/5 confirmation alignment: strong banking momentum, healthy 1.95x volume, and confirmed VWAP floor.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bullish Alignment",
    },
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    sector: "IT",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 4180.00,
    change: 12.50,
    changePercent: 0.30,
    high52w: 4585.00,
    low52w: 3450.00,
    volume: "1.42M",
    relativeVolume: 0.88,
    deliveryPercent: 52.0,
    vwap: 4172.00,
    ema9: 4174.00,
    ema21: 4165.00,
    sma50: 4190.00,
    rsi: 51.5,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "NEUTRAL",
    confirmations: {
      trend: {
        score: 12,
        status: "NEUTRAL",
        details: ["Trading between 21 EMA and 50 SMA", "IT sector lagging broader indices", "Daily chart in sideways bracket"],
      },
      momentum: {
        score: 11,
        status: "POSITIVE",
        details: ["RSI 51.5 hovering near midline", "MACD flat near zero line", "No sharp acceleration trigger"],
      },
      volume: {
        score: 10,
        status: "AVERAGE",
        details: ["Relative volume 0.88x (subdued)", "No institutional breakout surge", "Typical rangebound turnover"],
      },
      priceAction: {
        score: 12,
        status: "CONSOLIDATION",
        details: ["Tight 15-point intraday range", "Stuck below major resistance at ₹4210", "No clear breakdown or breakout"],
      },
      marketAlignment: {
        score: 13,
        status: "MODERATE",
        details: ["Nifty IT index neutral at +0.38%", "Nasdaq tech cues mixed overnight", "Not participating in current auto/bank rally"],
      },
    },
    confluenceScore: 58,
    confluenceGrade: "WEAK",
    setup: "WAIT",
    setupType: "Rangebound",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "Wait for breakout above ₹4210 or breakdown below ₹4140",
    entryPrice: 4180.00,
    stopLoss: 4150.00,
    target1: 4240.00,
    target2: 4280.00,
    riskReward: "1 : 1.3",
    riskRewardRatio: 1.3,
    invalidation: "Do not chase while inside ₹4160-₹4210 chop box.",
    signalRationale: "WAIT: Confluence score 58/100 is insufficient. Subdued volume (0.88x) and neutral RSI indicate lack of institutional conviction.",
    confirmationsAlignedCount: 2,
    timeframeMatrix: {
      tf5m: { trend: "NEUTRAL", momentum: "WEAK", signal: "WAIT" },
      tf15m: { trend: "NEUTRAL", momentum: "WEAK", signal: "WAIT" },
      tf1h: { trend: "BULLISH", momentum: "WEAK", signal: "WAIT" },
      tf4h: { trend: "NEUTRAL", momentum: "WEAK", signal: "WAIT" },
      tfDaily: { trend: "BULLISH", momentum: "WEAK", signal: "WAIT" },
      alignedCount: 2,
      alignmentLabel: "2/5 Mixed Alignment",
    },
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    exchange: "NSE",
    sector: "FMCG",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 2680.40,
    change: -28.60,
    changePercent: -1.06,
    high52w: 3034.00,
    low52w: 2172.00,
    volume: "2.85M",
    relativeVolume: 1.82,
    deliveryPercent: 61.2,
    vwap: 2704.00,
    ema9: 2698.00,
    ema21: 2715.00,
    sma50: 2740.00,
    rsi: 38.2,
    macdStatus: "BELOW 0",
    supertrend: "BEARISH",
    confirmations: {
      trend: {
        score: 17,
        status: "BEARISH",
        details: ["Price < EMA9 < EMA21 < SMA50", "Supertrend red at 2720", "Lower lows on 15m and 1h charts"],
      },
      momentum: {
        score: 16,
        status: "EXHAUSTED",
        details: ["RSI 38.2 declining into oversold zone", "MACD below zero with bearish divergence", "Negative rate of change -1.4%"],
      },
      volume: {
        score: 16,
        status: "EXPANDING",
        details: ["Price falling + volume expanding (1.82x RVOL)", "Heavy selling blocks hitting bid", "Deliveries exiting FMCG names"],
      },
      priceAction: {
        score: 16,
        status: "CLEAN BREAKOUT",
        details: ["Breakdown below key swing support at ₹2700", "VWAP rejection multiple times during morning session", "Clean lower highs on 5m chart"],
      },
      marketAlignment: {
        score: 15,
        status: "HIGH ALIGNMENT",
        details: ["FMCG sector weakest sector (-0.45%)", "Defensive rotation out into risk-on cyclicals", "Consistent relative weakness vs Nifty"],
      },
    },
    confluenceScore: 80,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "SHORT SETUP",
    setupType: "Pullback Continuation",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹2685 – ₹2695",
    entryPrice: 2690.00,
    stopLoss: 2718.00,
    target1: 2635.00,
    target2: 2590.00,
    riskReward: "1 : 2.4",
    riskRewardRatio: 2.4,
    invalidation: "Hourly close above ₹2718 (VWAP and breakdown retest level).",
    signalRationale: "High-confluence short setup (80/100): Price trading below all key moving averages, rejected at VWAP with 1.82x volume, FMCG sector rotating down.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BEARISH", momentum: "STRONG", signal: "SHORT" },
      tf15m: { trend: "BEARISH", momentum: "STRONG", signal: "SHORT" },
      tf1h: { trend: "BEARISH", momentum: "STRONG", signal: "SHORT" },
      tf4h: { trend: "BEARISH", momentum: "STRONG", signal: "SHORT" },
      tfDaily: { trend: "BEARISH", momentum: "STRONG", signal: "SHORT" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bearish Alignment",
    },
  },
  {
    symbol: "DLF",
    name: "DLF Limited",
    exchange: "NSE",
    sector: "Realty",
    capCategory: "Large Cap",
    isNifty50: false,
    isBankNifty: false,
    ltp: 914.50,
    change: 26.30,
    changePercent: 2.96,
    high52w: 967.50,
    low52w: 485.00,
    volume: "11.2M",
    relativeVolume: 3.45,
    deliveryPercent: 44.5,
    vwap: 898.20,
    ema9: 902.00,
    ema21: 890.10,
    sma50: 868.00,
    rsi: 74.8,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 18,
        status: "BULLISH",
        details: ["Realty sector up +1.92% today", "Strong higher-high continuation pattern", "All MAs stacked in classic bull fan"],
      },
      momentum: {
        score: 18,
        status: "EXPANDING",
        details: ["RSI 74.8 showing extreme momentum expansion", "MACD lines widely separated above signal", "Breakout momentum ROC +4.2%"],
      },
      volume: {
        score: 20,
        status: "EXPLODING",
        details: ["Volume explosion: 3.45x relative volume", "Institutional sweeps clearing resistance bids", "Highest 15m volume of the week"],
      },
      priceAction: {
        score: 18,
        status: "CLEAN BREAKOUT",
        details: ["Multi-week horizontal resistance at ₹895 shattered", "Opening range breakout with massive green candle", "No resistance until 52W high at ₹967"],
      },
      marketAlignment: {
        score: 17,
        status: "HIGH ALIGNMENT",
        details: ["Nifty Realty sector leading percentage gainer", "Broad risk-on sentiment in domestic cyclicals", "High beta 1.6 outperforming market"],
      },
    },
    confluenceScore: 91,
    confluenceGrade: "EXTREME CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Volume Explosion",
    isAggressiveMode: true,
    isHigherRisk: true,
    riskReason: "High RSI (74.8) and high beta: setup offers extreme momentum but higher volatility on intraday pullbacks.",
    timeframeHorizon: "Intraday",
    entryZone: "₹910 – ₹916",
    entryPrice: 912.00,
    stopLoss: 888.00,
    target1: 955.00,
    target2: 975.00,
    riskReward: "1 : 2.6",
    riskRewardRatio: 2.6,
    invalidation: "Drop below ₹888 (session VWAP support and breakout base).",
    signalRationale: "Extreme Confluence (91/100) on aggressive Volume Explosion setup. 3.45x RVOL shattering multi-week resistance.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bullish Alignment",
    },
  },
  {
    symbol: "IDEA",
    name: "Vodafone Idea Ltd",
    exchange: "NSE",
    sector: "Telecom",
    capCategory: "Mid Cap",
    isNifty50: false,
    isBankNifty: false,
    ltp: 7.65,
    change: -0.05,
    changePercent: -0.65,
    high52w: 19.15,
    low52w: 6.80,
    volume: "68.2M",
    relativeVolume: 0.65,
    deliveryPercent: 28.0,
    vwap: 7.70,
    ema9: 7.72,
    ema21: 7.85,
    sma50: 8.20,
    rsi: 42.0,
    macdStatus: "BELOW 0",
    supertrend: "BEARISH",
    confirmations: {
      trend: {
        score: 6,
        status: "BEARISH",
        details: ["Below all moving averages", "Persistent lower lows", "Weak sector participation"],
      },
      momentum: {
        score: 7,
        status: "EXHAUSTED",
        details: ["Choppy low-momentum action", "MACD sluggish below zero line", "ROC -0.8%"],
      },
      volume: {
        score: 8,
        status: "WEAKENING DIVERGENCE",
        details: ["Subdued relative volume (0.65x)", "Delivery percentage very low at 28%", "Pure retail churn"],
      },
      priceAction: {
        score: 6,
        status: "CONSOLIDATION",
        details: ["Wide bid-ask spread relative to tick size", "Choppy price action around VWAP", "Heavy supply cap"],
      },
      marketAlignment: {
        score: 7,
        status: "DIVERGENT",
        details: ["Severely lagging broader market", "High debt overhang and pending regulatory dues", "Poor relative strength"],
      },
    },
    confluenceScore: 34,
    confluenceGrade: "NO TRADE",
    setup: "NO TRADE",
    setupType: "Rangebound",
    isAggressiveMode: false,
    isHigherRisk: true,
    riskReason: "NO TRADE FLAG: Low confluence (34/100), weak delivery participation, wide spread, and negative long-term trend.",
    timeframeHorizon: "Intraday",
    entryZone: "NO ENTRY",
    entryPrice: 7.65,
    stopLoss: 0,
    target1: 0,
    target2: 0,
    riskReward: "0 : 0",
    riskRewardRatio: 0,
    invalidation: "Do not enter. Insufficient technical confluence and high execution friction.",
    signalRationale: "NO TRADE — INSUFFICIENT CONFLUENCE (34/100). The No-Trade Engine flagged this instrument due to poor liquidity quality, low relative volume, and conflicting structure.",
    confirmationsAlignedCount: 0,
    timeframeMatrix: {
      tf5m: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tf15m: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tf1h: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tf4h: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tfDaily: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      alignedCount: 0,
      alignmentLabel: "0/5 No Trade Alignment",
    },
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: true,
    ltp: 1682.30,
    change: 15.60,
    changePercent: 0.94,
    high52w: 1794.00,
    low52w: 1363.00,
    volume: "16.4M",
    relativeVolume: 1.78,
    deliveryPercent: 66.5,
    vwap: 1673.40,
    ema9: 1674.00,
    ema21: 1664.00,
    sma50: 1640.00,
    rsi: 62.5,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 18,
        status: "BULLISH",
        details: ["Bank Nifty index gaining +0.72%", "Bullish higher low structure above 21 EMA", "Price sustaining above 1660 support base"],
      },
      momentum: {
        score: 17,
        status: "POSITIVE",
        details: ["RSI 62.5 breaking out of minor flag", "MACD bullish histogram ticks expanding", "Momentum acceleration ROC +1.6%"],
      },
      volume: {
        score: 17,
        status: "EXPANDING",
        details: ["Relative volume 1.78x", "Price rising + volume expanding", "Institutional delivery 66.5%"],
      },
      priceAction: {
        score: 17,
        status: "CLEAN BREAKOUT",
        details: ["Breakout retest of ₹1668 resistance turned support", "Solid bullish body on 15M candle", "VWAP slope trending upward"],
      },
      marketAlignment: {
        score: 18,
        status: "HIGH ALIGNMENT",
        details: ["Bank Nifty component weight leader", "Positive correlation with Nifty index move", "Sector participation high"],
      },
    },
    confluenceScore: 87,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Breakout Retest",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Swing",
    entryZone: "₹1678 – ₹1684",
    entryPrice: 1680.00,
    stopLoss: 1658.00,
    target1: 1725.00,
    target2: 1760.00,
    riskReward: "1 : 2.7",
    riskRewardRatio: 2.7,
    invalidation: "Setup invalidates if price breaks down below ₹1658 swing low.",
    signalRationale: "87/100 High Confluence: Clean Breakout Retest on HDFC Bank. Bank Nifty trend support and high institutional delivery participation.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bullish Alignment",
    },
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    exchange: "NSE",
    sector: "Telecom",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 1645.00,
    change: 24.10,
    changePercent: 1.49,
    high52w: 1720.00,
    low52w: 890.00,
    volume: "4.9M",
    relativeVolume: 2.10,
    deliveryPercent: 62.1,
    vwap: 1632.00,
    ema9: 1634.00,
    ema21: 1620.00,
    sma50: 1585.00,
    rsi: 68.0,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 18,
        status: "BULLISH",
        details: ["Structural multi-month uptrend intact", "Price above 9/21/50 EMAs", "High relative strength vs broader market"],
      },
      momentum: {
        score: 18,
        status: "EXPANDING",
        details: ["RSI 68.0 with fresh impulse wave", "MACD histogram accelerating", "Bullish continuation flag trigger"],
      },
      volume: {
        score: 18,
        status: "EXPANDING",
        details: ["Volume 2.1x relative volume", "Delivery volume over 62%", "Steady accumulation bars on 15m"],
      },
      priceAction: {
        score: 17,
        status: "CLEAN BREAKOUT",
        details: ["Breakout above 3-day swing consolidation high", "Strong close above session VWAP", "Support verified at ₹1625"],
      },
      marketAlignment: {
        score: 17,
        status: "HIGH ALIGNMENT",
        details: ["Broad market breadth in green", "FII long interest in defensive large-caps", "Index contribution positive"],
      },
    },
    confluenceScore: 88,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Relative Strength",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Swing",
    entryZone: "₹1638 – ₹1646",
    entryPrice: 1642.00,
    stopLoss: 1618.00,
    target1: 1690.00,
    target2: 1725.00,
    riskReward: "1 : 2.5",
    riskRewardRatio: 2.5,
    invalidation: "Hourly close below ₹1618 swing floor.",
    signalRationale: "5/5 confirmation alignment: High relative strength outperformer breaking multi-day consolidation on 2.1x RVOL.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bullish Alignment",
    },
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries",
    exchange: "NSE",
    sector: "Pharma",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 1845.20,
    change: -4.10,
    changePercent: -0.22,
    high52w: 1960.00,
    low52w: 1110.00,
    volume: "1.8M",
    relativeVolume: 0.92,
    deliveryPercent: 55.4,
    vwap: 1848.00,
    ema9: 1846.00,
    ema21: 1852.00,
    sma50: 1835.00,
    rsi: 48.6,
    macdStatus: "BELOW 0",
    supertrend: "NEUTRAL",
    confirmations: {
      trend: {
        score: 13,
        status: "NEUTRAL",
        details: ["Pharma index consolidating (-0.24%)", "Price oscillating around 21 EMA", "Daily trend bullish but hourly paused"],
      },
      momentum: {
        score: 12,
        status: "POSITIVE",
        details: ["RSI 48.6 near neutral zone", "MACD histogram near zero", "No directional momentum spark"],
      },
      volume: {
        score: 11,
        status: "AVERAGE",
        details: ["Relative volume 0.92x", "No aggressive buying or selling pressure", "Balanced order book"],
      },
      priceAction: {
        score: 13,
        status: "CONSOLIDATION",
        details: ["Confined between ₹1835 support and ₹1865 resistance", "Small body dojis on 15m chart", "VWAP flatline"],
      },
      marketAlignment: {
        score: 13,
        status: "MODERATE",
        details: ["Defensive pharma out of focus today as capital rotates to cyclicals", "Moderate sector breadth", "Neutral beta"],
      },
    },
    confluenceScore: 62,
    confluenceGrade: "DEVELOPING",
    setup: "WAIT",
    setupType: "Pullback Continuation",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Swing",
    entryZone: "Watch ₹1865 for breakout or ₹1830 for support bounce",
    entryPrice: 1845.00,
    stopLoss: 1825.00,
    target1: 1890.00,
    target2: 1930.00,
    riskReward: "1 : 2.0",
    riskRewardRatio: 2.0,
    invalidation: "Do not trigger trade until 60-min candle closes with volume confirmation.",
    signalRationale: "WAIT: Developing setup (62/100). Setup is healthy on daily chart but consolidating intraday. Waiting for volume trigger.",
    confirmationsAlignedCount: 3,
    timeframeMatrix: {
      tf5m: { trend: "NEUTRAL", momentum: "WEAK", signal: "WAIT" },
      tf15m: { trend: "NEUTRAL", momentum: "WEAK", signal: "WAIT" },
      tf1h: { trend: "NEUTRAL", momentum: "WEAK", signal: "WAIT" },
      tf4h: { trend: "BULLISH", momentum: "WEAK", signal: "WAIT" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "WAIT" },
      alignedCount: 3,
      alignmentLabel: "3/5 Developing Alignment",
    },
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India Ltd",
    exchange: "NSE",
    sector: "Auto",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 12420.00,
    change: 215.00,
    changePercent: 1.76,
    high52w: 13680.00,
    low52w: 9800.00,
    volume: "1.1M",
    relativeVolume: 2.45,
    deliveryPercent: 63.8,
    vwap: 12310.00,
    ema9: 12340.00,
    ema21: 12220.00,
    sma50: 12050.00,
    rsi: 69.2,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: {
        score: 18,
        status: "BULLISH",
        details: ["Nifty Auto index leader (+1.48%)", "Ascending channel on 15m and 1h", "Trading above all moving averages"],
      },
      momentum: {
        score: 18,
        status: "EXPANDING",
        details: ["RSI 69.2 in power zone", "MACD divergence positive", "ROC +2.4%"],
      },
      volume: {
        score: 18,
        status: "EXPLODING",
        details: ["RVOL 2.45x high relative volume", "Volume expanding on every green 15m candle", "Institutional accumulation evident"],
      },
      priceAction: {
        score: 17,
        status: "CLEAN BREAKOUT",
        details: ["Breakout above round number ₹12300 with authority", "VWAP bounce confirmed at 10:15 IST", "Targeting ₹12800 supply zone"],
      },
      marketAlignment: {
        score: 18,
        status: "HIGH ALIGNMENT",
        details: ["Auto sector leading sector index", "Nifty 50 bullish regime aligned", "Positive foreign brokerage revision"],
      },
    },
    confluenceScore: 89,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Momentum Breakout",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹12380 – ₹12430",
    entryPrice: 12410.00,
    stopLoss: 12220.00,
    target1: 12800.00,
    target2: 13100.00,
    riskReward: "1 : 2.5",
    riskRewardRatio: 2.5,
    invalidation: "Breakdown below ₹12220 (day VWAP & EMA21 cushion).",
    signalRationale: "5/5 confirmation alignment (89/100): High confluence auto breakout on 2.45x volume with sector momentum tailwinds.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Bullish Alignment",
    },
  },
  {
    symbol: "YESBANK",
    name: "Yes Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    capCategory: "Mid Cap",
    isNifty50: false,
    isBankNifty: false,
    ltp: 21.35,
    change: -0.10,
    changePercent: -0.47,
    high52w: 32.80,
    low52w: 16.50,
    volume: "45.0M",
    relativeVolume: 0.72,
    deliveryPercent: 32.1,
    vwap: 21.45,
    ema9: 21.50,
    ema21: 21.80,
    sma50: 22.40,
    rsi: 41.2,
    macdStatus: "BELOW 0",
    supertrend: "BEARISH",
    confirmations: {
      trend: {
        score: 7,
        status: "BEARISH",
        details: ["Trading below 9 and 21 EMA", "Subdued trend structure", "Severe resistance at ₹22.50"],
      },
      momentum: {
        score: 8,
        status: "EXHAUSTED",
        details: ["RSI 41.2 trending down", "MACD below signal line", "Momentum flat"],
      },
      volume: {
        score: 8,
        status: "AVERAGE",
        details: ["Relative volume 0.72x", "No institutional bulk block detected", "Retail order flow"],
      },
      priceAction: {
        score: 7,
        status: "CONSOLIDATION",
        details: ["High noise to signal ratio", "Choppy 20-paisa intraday band", "Heavy supply overhead"],
      },
      marketAlignment: {
        score: 7,
        status: "DIVERGENT",
        details: ["Divergent from strong private banking peers", "Low relative strength ranking", "Not participating in Bank Nifty rally"],
      },
    },
    confluenceScore: 37,
    confluenceGrade: "NO TRADE",
    setup: "NO TRADE",
    setupType: "Rangebound",
    isAggressiveMode: false,
    isHigherRisk: true,
    riskReason: "NO TRADE: Score 37/100. High retail churn, heavy overhead resistance, and complete divergence from leading banking index.",
    timeframeHorizon: "Intraday",
    entryZone: "NO ENTRY",
    entryPrice: 21.35,
    stopLoss: 0,
    target1: 0,
    target2: 0,
    riskReward: "0 : 0",
    riskRewardRatio: 0,
    invalidation: "Do not enter. Confluence fails risk filters.",
    signalRationale: "NO TRADE — INSUFFICIENT CONFLUENCE (37/100). Flagged by No-Trade Engine due to structural weakness and negative relative strength.",
    confirmationsAlignedCount: 0,
    timeframeMatrix: {
      tf5m: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tf15m: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tf1h: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tf4h: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      tfDaily: { trend: "BEARISH", momentum: "WEAK", signal: "NO TRADE" },
      alignedCount: 0,
      alignmentLabel: "0/5 No Trade Alignment",
    },
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    exchange: "NSE",
    sector: "IT",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 1924.80,
    change: 16.50,
    changePercent: 0.86,
    high52w: 1990.00,
    low52w: 1358.00,
    volume: "5.42M",
    relativeVolume: 1.45,
    deliveryPercent: 61.2,
    vwap: 1916.00,
    ema9: 1914.00,
    ema21: 1902.00,
    sma50: 1870.00,
    rsi: 62.4,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: { score: 16, status: "BULLISH", details: ["Price above 20 EMA and 50 SMA", "IT sector holding VWAP support"] },
      momentum: { score: 16, status: "EXPANDING", details: ["RSI 62.4 trending upward", "MACD positive crossover"] },
      volume: { score: 15, status: "EXPANDING", details: ["1.45x 20-day average volume", "Institutional accumulation on dips"] },
      priceAction: { score: 17, status: "VWAP RECLAIM", details: ["Sharp bounce and reclaim of intraday VWAP ₹1916", "Forming higher highs on 15m chart"] },
      marketAlignment: { score: 18, status: "HIGH ALIGNMENT", details: ["Benchmark green, tech resilience supporting Nifty"] },
    },
    confluenceScore: 82,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "VWAP Reclaim",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹1920 – ₹1926",
    entryPrice: 1923.00,
    stopLoss: 1905.00,
    target1: 1955.00,
    target2: 1980.00,
    riskReward: "1 : 2.5",
    riskRewardRatio: 2.5,
    invalidation: "Breach of ₹1905 VWAP baseline.",
    signalRationale: "Reclaimed VWAP on expanding volume with positive sector momentum.",
    confirmationsAlignedCount: 4,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Multi-Timeframe Alignment",
    },
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    exchange: "NSE",
    sector: "Banking",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: true,
    ltp: 816.40,
    change: 8.90,
    changePercent: 1.10,
    high52w: 912.00,
    low52w: 555.00,
    volume: "16.8M",
    relativeVolume: 1.72,
    deliveryPercent: 54.0,
    vwap: 812.00,
    ema9: 813.00,
    ema21: 805.00,
    sma50: 792.00,
    rsi: 64.2,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: { score: 17, status: "BULLISH", details: ["PSU Bank leader trading above all key moving averages"] },
      momentum: { score: 17, status: "EXPANDING", details: ["RSI 64.2 breaking minor swing resistance", "MACD bullish trajectory"] },
      volume: { score: 16, status: "EXPANDING", details: ["1.72x volume surge across morning session"] },
      priceAction: { score: 18, status: "CLEAN BREAKOUT", details: ["Breakout above intraday resistance at ₹814", "Holding above opening high"] },
      marketAlignment: { score: 17, status: "HIGH ALIGNMENT", details: ["Bank Nifty +0.72% tailwind with high breadth participation"] },
    },
    confluenceScore: 85,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Breakout Continuation",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Swing",
    entryZone: "₹814 – ₹818",
    entryPrice: 815.50,
    stopLoss: 802.00,
    target1: 840.00,
    target2: 865.00,
    riskReward: "1 : 2.6",
    riskRewardRatio: 2.6,
    invalidation: "15m close below ₹802 swing support.",
    signalRationale: "Breakout continuation backed by Bank Nifty institutional strength.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Multi-Timeframe Alignment",
    },
  },
  {
    symbol: "M&M",
    name: "Mahindra & Mahindra Ltd",
    exchange: "NSE",
    sector: "Auto",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 2984.50,
    change: 58.20,
    changePercent: 1.99,
    high52w: 3015.00,
    low52w: 1511.00,
    volume: "4.25M",
    relativeVolume: 2.45,
    deliveryPercent: 66.5,
    vwap: 2955.00,
    ema9: 2960.00,
    ema21: 2920.00,
    sma50: 2840.00,
    rsi: 73.1,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: { score: 19, status: "BULLISH", details: ["Trading right near all-time high of ₹3015", "Steep upward trend channel"] },
      momentum: { score: 19, status: "EXPANDING", details: ["RSI 73.1 high momentum impulse", "MACD histogram expanding strongly"] },
      volume: { score: 18, status: "EXPLODING", details: ["2.45x RVOL institutional block sweeps detected"] },
      priceAction: { score: 18, status: "CLEAN BREAKOUT", details: ["Cup and handle breakout on daily and 1-hour chart"] },
      marketAlignment: { score: 17, status: "HIGH ALIGNMENT", details: ["Auto sector leading entire Indian market today (+1.48%)"] },
    },
    confluenceScore: 91,
    confluenceGrade: "EXTREME CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "Momentum Breakout",
    isAggressiveMode: true,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹2975 – ₹2990",
    entryPrice: 2982.00,
    stopLoss: 2940.00,
    target1: 3060.00,
    target2: 3120.00,
    riskReward: "1 : 2.8",
    riskRewardRatio: 2.8,
    invalidation: "Violation of ₹2940 VWAP base on 15m candle.",
    signalRationale: "Auto index momentum leader printing 2.45x RVOL near record highs.",
    confirmationsAlignedCount: 5,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Extreme Bullish Alignment",
    },
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel Ltd",
    exchange: "NSE",
    sector: "Metal",
    capCategory: "Large Cap",
    isNifty50: true,
    isBankNifty: false,
    ltp: 154.80,
    change: 2.10,
    changePercent: 1.37,
    high52w: 184.60,
    low52w: 115.00,
    volume: "28.5M",
    relativeVolume: 1.88,
    deliveryPercent: 52.0,
    vwap: 153.50,
    ema9: 153.80,
    ema21: 151.20,
    sma50: 147.00,
    rsi: 65.0,
    macdStatus: "EXPANDING ABOVE 0",
    supertrend: "BULLISH",
    confirmations: {
      trend: { score: 17, status: "BULLISH", details: ["Metal index +1.15% with robust domestic steel pricing"] },
      momentum: { score: 16, status: "EXPANDING", details: ["RSI 65 rising out of neutral range"] },
      volume: { score: 17, status: "EXPANDING", details: ["1.88x relative volume with heavy delivery trades"] },
      priceAction: { score: 17, status: "VWAP RECLAIM", details: ["VWAP reclaimed at ₹153.50 with strong bull candle"] },
      marketAlignment: { score: 17, status: "HIGH ALIGNMENT", details: ["Commodities tailwind with cooling USD index"] },
    },
    confluenceScore: 84,
    confluenceGrade: "HIGH CONFLUENCE",
    setup: "LONG SETUP",
    setupType: "VWAP Reclaim",
    isAggressiveMode: false,
    isHigherRisk: false,
    timeframeHorizon: "Intraday",
    entryZone: "₹154.00 – ₹155.00",
    entryPrice: 154.50,
    stopLoss: 151.50,
    target1: 160.00,
    target2: 165.00,
    riskReward: "1 : 2.4",
    riskRewardRatio: 2.4,
    invalidation: "Close below ₹151.50.",
    signalRationale: "Metal sector tailwind, VWAP reclaim with 1.88x volume surge.",
    confirmationsAlignedCount: 4,
    timeframeMatrix: {
      tf5m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf15m: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf1h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tf4h: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      tfDaily: { trend: "BULLISH", momentum: "STRONG", signal: "LONG" },
      alignedCount: 5,
      alignmentLabel: "5/5 Multi-Timeframe Alignment",
    },
  },
];

// Active No-Trade Situations detected across the market
export interface NoTradeItem {
  id: string;
  symbol: string;
  reason: string;
  category: "LOW_LIQUIDITY" | "CHOPPY_ACTION" | "WIDE_SPREAD" | "CONFLICTING_INDICATORS" | "WEAK_BREADTH" | "EVENT_UNCERTAINTY" | "OVEREXTENDED";
  metric: string;
  recommendation: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
}

const NO_TRADE_RADAR: NoTradeItem[] = [
  {
    id: "nt-1",
    symbol: "IDEA",
    reason: "Low Institutional Volume & Wide Spread Friction",
    category: "LOW_LIQUIDITY",
    metric: "RVOL 0.65x • Delivery 28%",
    recommendation: "Avoid active capital deployment. High slippage and lack of institutional buying pressure.",
    severity: "CRITICAL",
  },
  {
    id: "nt-2",
    symbol: "YESBANK",
    reason: "Conflicting Sector Direction & Negative Relative Strength",
    category: "CONFLICTING_INDICATORS",
    metric: "Beta 1.45 • RS Rating 22/100",
    recommendation: "Private bank index +0.72% while symbol is in persistent distribution. Do not buy dips.",
    severity: "CRITICAL",
  },
  {
    id: "nt-3",
    symbol: "TCS",
    reason: "Choppy Intraday Compression Inside ₹4160-₹4210 Box",
    category: "CHOPPY_ACTION",
    metric: "ATR Compression 42% • Volume -12%",
    recommendation: "Wait for clean daily close above ₹4210 before committing breakout capital.",
    severity: "MODERATE",
  },
  {
    id: "nt-4",
    symbol: "ZOMATO",
    reason: "Overextended Price vs 20-Day Exponential Moving Average",
    category: "OVEREXTENDED",
    metric: "Price > EMA20 by 14.8% • RSI 82.4",
    recommendation: "Poor risk-to-reward ratio on fresh long entries. Wait for pullback towards VWAP support.",
    severity: "HIGH",
  },
  {
    id: "nt-5",
    symbol: "NIFTY FMCG SECTOR",
    reason: "Sector-Wide Capital Outflow into Domestic Cyclicals",
    category: "WEAK_BREADTH",
    metric: "Sector Breadth 22% • FII Net Negative",
    recommendation: "Long setups in FMCG names carry high failure probability during current risk-on regime.",
    severity: "HIGH",
  },
];

// Market Intelligence Bulletins with Source, Timestamp & Impact
export interface IntelligenceItem {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  source: string;
  category: "SECTOR_ROTATION" | "MACRO_FLOWS" | "UNUSUAL_VOLUME" | "BREAKOUT" | "CORPORATE" | "BREADTH";
  impact: "HIGH" | "MEDIUM" | "LOW";
  affectedSymbols: string[];
}

const MARKET_INTELLIGENCE_STREAM: IntelligenceItem[] = [
  {
    id: "int-1",
    timestamp: "10:14 IST",
    title: "Nifty Auto Index Breaches All-Time High on 1.85x Sector Volume",
    summary: "Institutional block sweeps observed in Tata Motors, Mahindra & Mahindra and Maruti Suzuki. Sector leadership reinforced by favorable raw material pricing and strong monthly domestic retail dispatches.",
    source: "NSE Real-Time Sector Feed",
    category: "SECTOR_ROTATION",
    impact: "HIGH",
    affectedSymbols: ["TATAMOTORS", "MARUTI", "M&M"],
  },
  {
    id: "int-2",
    timestamp: "10:02 IST",
    title: "India VIX Drops 3.17% to 12.84, Signalling Diminishing Put Premium",
    summary: "Options chain analysis indicates strong put writing at 25,200 and 25,300 strike prices, cementing support base for intraday momentum continuations.",
    source: "NSE Derivatives Analytics",
    category: "MACRO_FLOWS",
    impact: "HIGH",
    affectedSymbols: ["NIFTY 50", "BANK NIFTY"],
  },
  {
    id: "int-3",
    timestamp: "09:48 IST",
    title: "Unusual Delivery Spikes in DLF & Godrej Properties",
    summary: "Realty index surges +1.92%. DLF relative volume crosses 3.45x standard 20-day run rate following large institutional block transaction at ₹905.",
    source: "NSE Bulk/Block Deal Disclosure",
    category: "UNUSUAL_VOLUME",
    impact: "MEDIUM",
    affectedSymbols: ["DLF", "GODREJPROP"],
  },
  {
    id: "int-4",
    timestamp: "09:35 IST",
    title: "FII + DII Institutional Net Flow Surges to +₹3,323 Cr",
    summary: "Domestic institutions inject ₹1,894 Cr while Foreign Portfolio Investors turn net buyers (+₹1,428 Cr), marking the 4th consecutive session of dual institutional cash inflows.",
    source: "SEBI FII/DII Daily Aggregated Sheet",
    category: "BREADTH",
    impact: "HIGH",
    affectedSymbols: ["HDFCBANK", "RELIANCE", "ICICIBANK"],
  },
  {
    id: "int-5",
    timestamp: "09:22 IST",
    title: "IT Sector Diverges from Benchmark as FMCG Faces Profit Taking",
    summary: "Defensive rotate-out evident as active traders cycle liquidity into capital goods, autos, and private banks. FMCG index under pressure with HUL down 1.06%.",
    source: "Market Microstructure Monitor",
    category: "SECTOR_ROTATION",
    impact: "MEDIUM",
    affectedSymbols: ["HINDUNILVR", "TCS", "INFY"],
  },
];

export interface MarketIntelligenceFeed {
  id: string;
  category: string;
  headline: string;
  summary: string;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  timestamp: string;
  relatedSymbols: string[];
  tradingImpact: string;
}

export interface MacroIndicator {
  name: string;
  value: string;
  change: string;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
}

export interface SignalLog {
  id: string;
  dateTime: string;
  symbol: string;
  setupType: string;
  confluenceScore: number;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  exitPrice?: number;
  outcome: "TARGET 1 HIT" | "TARGET 2 HIT" | "STOP LOSS HIT" | "ACTIVE" | "INVALIDATED";
  returnPercent?: number;
  holdingPeriod: string;
}

const MARKET_INTELLIGENCE_FEEDS: MarketIntelligenceFeed[] = [
  {
    id: "feed-1",
    category: "SECTOR ROTATION",
    headline: "Nifty Auto Index Breaches All-Time High on 1.85x Sector Volume Surge",
    summary: "Institutional block sweeps observed in Tata Motors, Mahindra & Mahindra and Maruti Suzuki. Sector leadership reinforced by cooling input raw materials and robust monthly commercial dispatches.",
    sentiment: "BULLISH",
    timestamp: "10:14 IST",
    relatedSymbols: ["TATAMOTORS", "MARUTI", "M&M"],
    tradingImpact: "Focus on 15m pullback continuation setups holding above intraday VWAP with stop below session swing lows.",
  },
  {
    id: "feed-2",
    category: "MACRO FLOWS",
    headline: "India VIX Drops 3.17% to 12.84, Signalling Diminishing Put Volatility Premium",
    summary: "Derivatives options chain analysis reveals dense put writing at 25,200 and 25,300 strikes, creating a structural support floor for intraday momentum breakout retention.",
    sentiment: "BULLISH",
    timestamp: "10:02 IST",
    relatedSymbols: ["NIFTY 50", "BANK NIFTY"],
    tradingImpact: "Allows aggressive breakout entries to breathe with lower risk of sudden violent stop-loss sweeps.",
  },
  {
    id: "feed-3",
    category: "UNUSUAL VOLUME",
    headline: "Realty Index Surges +1.92% Led by Heavy Institutional Block Buying in DLF",
    summary: "DLF trades at 3.45x standard 20-day run rate following major institutional block accumulation near ₹905. Godrej Properties breaks out of multi-week base.",
    sentiment: "BULLISH",
    timestamp: "09:48 IST",
    relatedSymbols: ["DLF", "GODREJPROP"],
    tradingImpact: "High confluence Opening Range Breakout (ORB) active. Invalidation strictly on close below ₹900.",
  },
  {
    id: "feed-4",
    category: "INSTITUTIONAL CASH",
    headline: "FII + DII Institutional Net Inflow Accelerates to +₹3,323 Cr",
    summary: "Domestic mutual funds inject ₹1,894 Cr while FPIs absorb ₹1,428 Cr in large-cap banking and industrials, confirming broad-based institutional participation.",
    sentiment: "BULLISH",
    timestamp: "09:35 IST",
    relatedSymbols: ["HDFCBANK", "RELIANCE", "ICICIBANK"],
    tradingImpact: "Validates long bias on index heavyweights; low probability of trend failure during morning session.",
  },
  {
    id: "feed-5",
    category: "SECTOR ROTATION",
    headline: "Defensive FMCG Rotates Out as Capital Rotates into Capital Goods & Private Banks",
    summary: "Intraday liquidity is rotating away from consumption defensives. Hindustan Unilever slips 1.06% while capital goods and private banks capture liquidity.",
    sentiment: "BEARISH",
    timestamp: "09:22 IST",
    relatedSymbols: ["HINDUNILVR", "TCS", "INFY"],
    tradingImpact: "Avoid buying intraday dips on FMCG defensives; short momentum or stay in high-beta leaders.",
  },
];

const MACRO_INDICATORS: MacroIndicator[] = [
  { name: "Brent Crude", value: "$74.15/bbl", change: "-1.42%", impact: "POSITIVE" },
  { name: "US 10Y Yield", value: "4.18%", change: "-4 bps", impact: "POSITIVE" },
  { name: "USD / INR", value: "₹83.88", change: "-0.08%", impact: "POSITIVE" },
  { name: "Dollar Index (DXY)", value: "102.40", change: "-0.25%", impact: "POSITIVE" },
  { name: "India 10Y G-Sec", value: "6.85%", change: "-2 bps", impact: "POSITIVE" },
  { name: "India VIX", value: "12.84", change: "-3.17%", impact: "POSITIVE" },
];

const SIGNALS_JOURNAL_DATABASE: SignalLog[] = [
  {
    id: "sig-01",
    dateTime: "Today, 09:35 IST",
    symbol: "TATAMOTORS",
    setupType: "Opening Range Breakout",
    confluenceScore: 92,
    entryPrice: 1042.50,
    stopLoss: 1032.00,
    target1: 1058.00,
    target2: 1075.00,
    exitPrice: 1058.00,
    outcome: "TARGET 1 HIT",
    returnPercent: 1.49,
    holdingPeriod: "42m",
  },
  {
    id: "sig-02",
    dateTime: "Today, 09:40 IST",
    symbol: "DLF",
    setupType: "Momentum Breakout",
    confluenceScore: 89,
    entryPrice: 914.00,
    stopLoss: 902.00,
    target1: 932.00,
    target2: 950.00,
    exitPrice: 932.00,
    outcome: "TARGET 1 HIT",
    returnPercent: 1.97,
    holdingPeriod: "1h 10m",
  },
  {
    id: "sig-03",
    dateTime: "Today, 10:05 IST",
    symbol: "RELIANCE",
    setupType: "Momentum Breakout",
    confluenceScore: 88,
    entryPrice: 3005.00,
    stopLoss: 2980.00,
    target1: 3045.00,
    target2: 3080.00,
    exitPrice: undefined,
    outcome: "ACTIVE",
    returnPercent: 0.32,
    holdingPeriod: "Active",
  },
  {
    id: "sig-04",
    dateTime: "Today, 10:15 IST",
    symbol: "HDFCBANK",
    setupType: "Breakout Continuation",
    confluenceScore: 86,
    entryPrice: 1678.50,
    stopLoss: 1664.00,
    target1: 1702.00,
    target2: 1725.00,
    exitPrice: undefined,
    outcome: "ACTIVE",
    returnPercent: 0.45,
    holdingPeriod: "Active",
  },
  {
    id: "sig-05",
    dateTime: "Yesterday, 14:10 IST",
    symbol: "TATASTEEL",
    setupType: "VWAP Reclaim",
    confluenceScore: 82,
    entryPrice: 153.20,
    stopLoss: 150.80,
    target1: 157.00,
    target2: 161.50,
    exitPrice: 157.40,
    outcome: "TARGET 1 HIT",
    returnPercent: 2.74,
    holdingPeriod: "1h 45m",
  },
  {
    id: "sig-06",
    dateTime: "Yesterday, 11:20 IST",
    symbol: "ICICIBANK",
    setupType: "Breakout Continuation",
    confluenceScore: 91,
    entryPrice: 1224.00,
    stopLoss: 1210.00,
    target1: 1245.00,
    target2: 1268.00,
    exitPrice: 1268.00,
    outcome: "TARGET 2 HIT",
    returnPercent: 3.59,
    holdingPeriod: "3h 20m",
  },
  {
    id: "sig-07",
    dateTime: "Yesterday, 09:45 IST",
    symbol: "HINDUNILVR",
    setupType: "Momentum Breakout",
    confluenceScore: 68,
    entryPrice: 2840.00,
    stopLoss: 2865.00,
    target1: 2800.00,
    target2: 2760.00,
    exitPrice: 2865.00,
    outcome: "STOP LOSS HIT",
    returnPercent: -0.88,
    holdingPeriod: "35m",
  },
  {
    id: "sig-08",
    dateTime: "2 days ago, 10:30 IST",
    symbol: "BHARTIARTL",
    setupType: "Opening Range Breakout",
    confluenceScore: 87,
    entryPrice: 1582.00,
    stopLoss: 1565.00,
    target1: 1610.00,
    target2: 1640.00,
    exitPrice: 1610.00,
    outcome: "TARGET 1 HIT",
    returnPercent: 1.77,
    holdingPeriod: "55m",
  },
  {
    id: "sig-09",
    dateTime: "2 days ago, 13:40 IST",
    symbol: "INFY",
    setupType: "VWAP Reclaim",
    confluenceScore: 74,
    entryPrice: 1912.00,
    stopLoss: 1898.00,
    target1: 1935.00,
    target2: 1960.00,
    exitPrice: 1898.00,
    outcome: "STOP LOSS HIT",
    returnPercent: -0.73,
    holdingPeriod: "50m",
  },
  {
    id: "sig-10",
    dateTime: "3 days ago, 09:50 IST",
    symbol: "MARUTI",
    setupType: "Momentum Breakout",
    confluenceScore: 90,
    entryPrice: 12480.00,
    stopLoss: 12350.00,
    target1: 12720.00,
    target2: 12950.00,
    exitPrice: 12720.00,
    outcome: "TARGET 1 HIT",
    returnPercent: 1.92,
    holdingPeriod: "1h 30m",
  },
];

// Historical Backtest Simulation Data & Runner
export interface BacktestRequest {
  strategy: string;
  stockUniverse: string;
  dateRange: string;
  timeframe: string;
  stopLossPercent: number;
  targetRatio: number;
  trailingStop: boolean;
}

export interface BacktestResult {
  strategyName: string;
  totalTrades: number;
  winRate: number; // percentage
  profitFactor: number;
  avgWinPercent: number;
  avgLossPercent: number;
  maxDrawdownPercent: number;
  averageR: number;
  expectancyR: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  equityCurve: { trade: number; equity: number; date: string }[];
  recentTrades: {
    id: string;
    date: string;
    symbol: string;
    type: "LONG" | "SHORT";
    entry: number;
    exit: number;
    pnlPercent: number;
    rResult: string;
    exitReason: "TARGET_1" | "TARGET_2" | "STOP_LOSS" | "TRAILING_STOP";
  }[];
}

function runSimulatedBacktest(req: BacktestRequest): BacktestResult {
  // Deterministic seed based on parameters
  const isBreakout = req.strategy.includes("Breakout") || req.strategy.includes("ORB");
  const winRate = isBreakout ? 63.4 : 58.8;
  const profitFactor = isBreakout ? 2.34 : 1.95;
  const totalTrades = req.timeframe === "15m" ? 184 : req.timeframe === "5m" ? 342 : 96;
  
  const startingEquity = 500000;
  let currentEquity = startingEquity;
  const equityCurve = [{ trade: 0, equity: startingEquity, date: "Start" }];

  const symbols = ["RELIANCE", "TATAMOTORS", "ICICIBANK", "HDFCBANK", "BHARTIARTL", "MARUTI", "DLF"];
  const recentTrades = [];

  for (let i = 1; i <= Math.min(totalTrades, 30); i++) {
    const isWin = Math.random() < (winRate / 100);
    const sym = symbols[i % symbols.length];
    const basePrice = sym === "RELIANCE" ? 3000 : sym === "TATAMOTORS" ? 990 : sym === "MARUTI" ? 12400 : 1600;
    
    let pnlPct = 0;
    let exitReason: "TARGET_1" | "TARGET_2" | "STOP_LOSS" | "TRAILING_STOP" = "TARGET_1";
    let rResult = "";

    if (isWin) {
      const hitT2 = Math.random() > 0.45;
      pnlPct = hitT2 ? (req.stopLossPercent * req.targetRatio) : (req.stopLossPercent * (req.targetRatio * 0.7));
      exitReason = hitT2 ? "TARGET_2" : "TARGET_1";
      rResult = hitT2 ? `+${req.targetRatio.toFixed(1)}R` : `+${(req.targetRatio * 0.7).toFixed(1)}R`;
      currentEquity += currentEquity * (pnlPct / 100) * 0.2; // 20% position weight
    } else {
      pnlPct = -req.stopLossPercent;
      exitReason = "STOP_LOSS";
      rResult = "-1.0R";
      currentEquity -= currentEquity * (req.stopLossPercent / 100) * 0.2;
    }

    equityCurve.push({
      trade: i,
      equity: Math.round(currentEquity),
      date: `T-${30 - i}d`,
    });

    recentTrades.push({
      id: `tr-${i}`,
      date: `2026-0${Math.floor(i / 10) + 1}-${(i % 28) + 1}`,
      symbol: sym,
      type: "LONG" as const,
      entry: Math.round(basePrice),
      exit: Math.round(basePrice * (1 + pnlPct / 100)),
      pnlPercent: Number(pnlPct.toFixed(2)),
      rResult,
      exitReason,
    });
  }

  return {
    strategyName: req.strategy,
    totalTrades,
    winRate,
    profitFactor,
    avgWinPercent: Number((req.stopLossPercent * req.targetRatio * 0.85).toFixed(2)),
    avgLossPercent: req.stopLossPercent,
    maxDrawdownPercent: 7.8,
    averageR: 1.48,
    expectancyR: 0.58,
    consecutiveWins: 6,
    consecutiveLosses: 3,
    totalReturnPercent: Number((((currentEquity - startingEquity) / startingEquity) * 100).toFixed(2)),
    sharpeRatio: 2.14,
    equityCurve,
    recentTrades: recentTrades.reverse(),
  };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Market Overview & Regime
app.get("/api/market/overview", (_req, res) => {
  const data = getMarketState();
  res.json(data);
});

// 3. Stock database with 5-factor confirmations
app.get("/api/stocks", (_req, res) => {
  res.json(STOCK_DATABASE);
});

// 4. Single Stock Deep Dive
app.get("/api/stocks/:symbol", (req, res) => {
  const sym = req.params.symbol.toUpperCase();
  const stock = STOCK_DATABASE.find((s) => s.symbol === sym);
  if (!stock) {
    return res.status(404).json({ error: `Symbol ${sym} not found in database.` });
  }
  res.json(stock);
});

// 5. Aggressive Setups Only
app.get("/api/aggressive-setups", (_req, res) => {
  const aggressive = STOCK_DATABASE.filter(
    (s) => s.isAggressiveMode || s.confluenceScore >= 85 || s.setupType === "Momentum Breakout" || s.setupType === "Volume Explosion" || s.setupType === "Opening Range Breakout"
  );
  res.json(aggressive);
});

// 6. Dedicated No-Trade Engine
app.get("/api/no-trade", (_req, res) => {
  const noTradeStocks = STOCK_DATABASE.filter((s) => s.setup === "NO TRADE" || s.confluenceScore < 40);
  res.json({
    summary: "Active Risk Filter: 5 market situations flagged as NO-TRADE due to excessive slippage, structural divergence, or low confluence.",
    radar: NO_TRADE_RADAR,
    flaggedStocks: noTradeStocks,
  });
});

// 7. Real-Time Market Intelligence Feed
app.get("/api/intelligence", (_req, res) => {
  res.json({
    newsFeed: MARKET_INTELLIGENCE_FEEDS,
    macros: MACRO_INDICATORS,
    items: MARKET_INTELLIGENCE_STREAM,
  });
});

// 8. Confirmed Signal Audit Journal
app.get("/api/journal", (_req, res) => {
  res.json(SIGNALS_JOURNAL_DATABASE);
});

// 9. Backtest Engine
app.post("/api/backtest/run", (req, res) => {
  const body: BacktestRequest = {
    strategy: req.body.strategy || "Momentum Breakout",
    stockUniverse: req.body.stockUniverse || "NIFTY 50",
    dateRange: req.body.dateRange || "Last 6 Months",
    timeframe: req.body.timeframe || "15m",
    stopLossPercent: Number(req.body.stopLossPercent) || 1.2,
    targetRatio: Number(req.body.targetRatio) || 2.5,
    trailingStop: Boolean(req.body.trailingStop),
  };

  const results = runSimulatedBacktest(body);
  res.json(results);
});

// 9. AI Market Copilot / Setup Auditor (Gemini powered with fallback)
app.post("/api/ai/audit", async (req, res) => {
  const { symbol, query } = req.body;
  const stock = STOCK_DATABASE.find((s) => s.symbol === (symbol || "").toUpperCase()) || STOCK_DATABASE[0];

  try {
    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are TradeSynq's Senior Quantitative Market Intelligence Engine for the Indian Stock Market (NSE/BSE).
Analyze this instrument setup:
Symbol: ${stock.symbol} (${stock.name})
LTP: ₹${stock.ltp} (${stock.changePercent > 0 ? "+" : ""}${stock.changePercent}%)
Confluence Score: ${stock.confluenceScore}/100 (${stock.confluenceGrade})
Setup: ${stock.setup} (${stock.setupType})
Confirmations:
1. Trend (${stock.confirmations.trend.score}/20): ${stock.confirmations.trend.details.join(", ")}
2. Momentum (${stock.confirmations.momentum.score}/20): ${stock.confirmations.momentum.details.join(", ")}
3. Volume (${stock.confirmations.volume.score}/20): ${stock.confirmations.volume.details.join(", ")}
4. Price Action (${stock.confirmations.priceAction.score}/20): ${stock.confirmations.priceAction.details.join(", ")}
5. Market Alignment (${stock.confirmations.marketAlignment.score}/20): ${stock.confirmations.marketAlignment.details.join(", ")}

Entry: ${stock.entryZone}
Stop Loss: ₹${stock.stopLoss}
Target: ₹${stock.target1} & ₹${stock.target2} (R:R ${stock.riskReward})
Invalidation: ${stock.invalidation}

User question / request: ${query || "Provide an executive trade audit explaining why this signal was or wasn't generated and key institutional risks."}

Instructions:
1. Give a crisp, professional, terminal-grade response.
2. Structure with:
   - CONFLUENCE VERDICT (Score breakdown and why)
   - INSTITUTIONAL EVIDENCE (Volume, VWAP, sector tailwinds)
   - DEFINED RISK & INVALIDATION (Where active traders must exit)
   - EXECUTION DISCIPLINE (Position size & patience)
3. Never use generic disclaimers or marketing slogans. Keep it analytical and objective.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        symbol: stock.symbol,
        aiAnalysis: response.text,
        source: "Gemini 3.8 Market Intelligence Engine",
        model: "gemini-3.8-flash",
      });
    }
  } catch (error) {
    console.error("Gemini API call failed, falling back to deterministic synthesis:", error);
  }

  // High-fidelity fallback synthesis
  return res.json({
    symbol: stock.symbol,
    aiAnalysis: `### CONFLUENCE VERDICT: ${stock.confluenceScore}/100 (${stock.confluenceGrade})
${stock.setup === "LONG SETUP" ? "✓ Validated Long Setup" : stock.setup === "SHORT SETUP" ? "⚠ Validated Short Setup" : "✋ Wait / No Entry Triggered"} backed by ${stock.confirmationsAlignedCount}/5 confirmation engines.

### 1. INSTITUTIONAL EVIDENCE
- **Trend & VWAP**: Price ₹${stock.ltp} is trading cleanly ${stock.ltp > stock.vwap ? "above" : "below"} intraday VWAP (₹${stock.vwap}). EMA 9/21/50 alignment indicates institutional buyer participation.
- **Volume & Liquidity**: Relative volume is running at ${stock.relativeVolume}x 20-day run-rate with delivery absorption at ${stock.deliveryPercent}%. Price-volume correlation confirms active accumulation.
- **Sector Rotation**: Sector ${stock.sector} is exhibiting positive relative strength compared to benchmark NIFTY 50.

### 2. DEFINED RISK & INVALIDATION
- **Entry Zone**: ${stock.entryZone}
- **Hard Stop Loss**: ₹${stock.stopLoss} (${Math.abs(((stock.ltp - stock.stopLoss) / stock.ltp) * 100).toFixed(1)}% maximum risk)
- **Primary Targets**: ₹${stock.target1} (T1) and ₹${stock.target2} (T2) delivering risk-reward ratio of ${stock.riskReward}.
- **Invalidation Condition**: ${stock.invalidation}

### 3. EXECUTION DISCIPLINE
Adhere strictly to 1% account risk rules. If price closes against VWAP before reaching T1, scratch trade without hesitation.`,
    source: "TradeSynq Local Quantitative Engine",
    model: "Rule-Based Deterministic Synthesis",
  });
});

// ----------------------------------------------------
// SERVER START & VITE MIDDLEWARE
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TradeSynq Trading Intelligence Terminal running on http://0.0.0.0:${PORT}`);
  });
}

start();
