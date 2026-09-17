export type MarketStatus = "OPEN" | "CLOSED" | "PRE-OPEN";

export type MarketRegimeState = "STRONG BULL" | "BULL" | "RANGE" | "VOLATILE" | "BEAR" | "STRONG BEAR";

export interface MarketIndex {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
}

export interface SectorItem {
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
}

export interface MarketOverview {
  marketStatus: MarketStatus;
  istTime: string;
  dataFreshness: string;
  isLiveFeed: boolean;
  regime: {
    state: MarketRegimeState;
    score: number;
    breadthPercent: number;
    momentumState: "ACCELERATING" | "POSITIVE" | "NEUTRAL" | "FADING" | "NEGATIVE";
    volatilityState: "LOW" | "MODERATE" | "ELEVATED" | "EXTREME";
    sectorParticipation: "BROAD-BASED" | "STRONG" | "SELECTIVE" | "WEAK" | "ROTATING";
    summary: string;
  };
  indices: MarketIndex[];
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
  sectors: SectorItem[];
  fiiDiiActivity: {
    date: string;
    fiiNetCrores: number;
    diiNetCrores: number;
    totalNetCrores: number;
  };
}

export interface FactorConfirmation {
  score: number; // 0-20
  status: string;
  details: string[];
}

export interface TimeframeData {
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  momentum: "STRONG" | "WEAK";
  signal: "LONG" | "WAIT" | "SHORT" | "NO TRADE";
}

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
  relativeVolume: number;
  deliveryPercent: number;
  vwap: number;
  ema9: number;
  ema21: number;
  sma50: number;
  rsi: number;
  macdStatus: string;
  supertrend: "BULLISH" | "BEARISH" | "NEUTRAL";

  confirmations: {
    trend: FactorConfirmation;
    momentum: FactorConfirmation;
    volume: FactorConfirmation;
    priceAction: FactorConfirmation;
    marketAlignment: FactorConfirmation;
  };

  confluenceScore: number; // 0-100
  confluenceGrade: "NO TRADE" | "WEAK" | "DEVELOPING" | "STRONG" | "HIGH CONFLUENCE" | "EXTREME CONFLUENCE";
  setup: "LONG SETUP" | "SHORT SETUP" | "WAIT" | "NO TRADE";
  setupType: "Momentum Breakout" | "ORB" | "Opening Range Breakout" | "Breakout Continuation" | "VWAP Momentum" | "Volume Explosion" | "Relative Strength" | "Pullback Continuation" | "Breakout Retest" | "Mean Reversion" | "Rangebound" | string;
  isAggressiveMode: boolean;
  isHigherRisk: boolean;
  riskReason?: string;
  timeframeHorizon: "Intraday" | "Swing";

  entryZone: string;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  riskReward: string;
  riskRewardRatio: number;
  invalidation: string;
  signalRationale: string;
  confirmationsAlignedCount: number;

  timeframeMatrix: {
    tf5m: TimeframeData;
    tf15m: TimeframeData;
    tf1h: TimeframeData;
    tf4h: TimeframeData;
    tfDaily: TimeframeData;
    alignedCount: number;
    alignmentLabel: string;
  };
}

export interface NoTradeItem {
  id: string;
  symbol: string;
  reason: string;
  category: "LOW_LIQUIDITY" | "CHOPPY_ACTION" | "WIDE_SPREAD" | "CONFLICTING_INDICATORS" | "WEAK_BREADTH" | "EVENT_UNCERTAINTY" | "OVEREXTENDED";
  metric: string;
  recommendation: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
}

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

export interface SignalJournalEntry {
  id: string;
  timestamp: string;
  symbol: string;
  setup: "LONG SETUP" | "SHORT SETUP";
  score: number;
  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;
  result: "Target 1 Reached" | "Target 2 Reached" | "Stopped Out" | "Active In Play" | "Invalidated";
  pnlR: string;
  notes: string;
}

export interface AlertRule {
  id: string;
  type: "HIGH_CONFLUENCE" | "BREAKOUT" | "BREAKDOWN" | "VOLUME_SPIKE" | "VWAP_CROSS" | "RSI_DIVERGENCE" | "NEW_52W_HIGH" | "NEW_52W_LOW" | "SECTOR_ROTATION" | "REGIME_CHANGE";
  symbol?: string;
  threshold?: string;
  channel: "Browser" | "Telegram" | "Email" | "Push";
  active: boolean;
  createdAt: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  target: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  timestamp: string;
  setupType: string;
}

export interface PaperPortfolio {
  initialCapital: number;
  availableCash: number;
  totalEquity: number;
  realizedPnl: number;
  winCount: number;
  lossCount: number;
  positions: PaperPosition[];
}

export interface BacktestParams {
  strategy: string;
  stockUniverse: string;
  dateRange: string;
  timeframe: string;
  stopLossPercent: number;
  targetRatio: number;
  trailingStop: boolean;
}

export interface BacktestTrade {
  id: string;
  date: string;
  symbol: string;
  type: "LONG" | "SHORT";
  entry: number;
  exit: number;
  pnlPercent: number;
  rResult: string;
  exitReason: "TARGET_1" | "TARGET_2" | "STOP_LOSS" | "TRAILING_STOP";
}

export interface BacktestResults {
  strategyName: string;
  totalTrades: number;
  winRate: number;
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
  recentTrades: BacktestTrade[];
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
  ema9?: number;
  ema21?: number;
  supertrend?: number;
  rsi?: number;
}
