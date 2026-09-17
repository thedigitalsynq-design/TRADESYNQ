import { CandleData } from "../types";

// Generates high-fidelity candlestick data for any stock and timeframe
export function generateCandleSeries(
  basePrice: number,
  timeframe: string = "15m",
  trendBias: "BULLISH" | "BEARISH" | "NEUTRAL" = "BULLISH",
  count: number = 60
): CandleData[] {
  const candles: CandleData[] = [];
  let currentPrice = basePrice * (trendBias === "BULLISH" ? 0.95 : trendBias === "BEARISH" ? 1.05 : 0.98);
  
  // Interval step in minutes
  let intervalMinutes = 15;
  if (timeframe === "1m") intervalMinutes = 1;
  else if (timeframe === "3m") intervalMinutes = 3;
  else if (timeframe === "5m") intervalMinutes = 5;
  else if (timeframe === "30m") intervalMinutes = 30;
  else if (timeframe === "1H") intervalMinutes = 60;
  else if (timeframe === "4H") intervalMinutes = 240;
  else if (timeframe === "1D") intervalMinutes = 1440;
  else if (timeframe === "1W") intervalMinutes = 7200;

  const now = new Date();
  let cumulativeVolume = 0;
  let cumulativeTypicalPriceVolume = 0;

  const prices: number[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const candleTime = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const timeStr = intervalMinutes >= 1440
      ? candleTime.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
      : candleTime.toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" });

    // Volatility based on base price
    const volatility = basePrice * 0.004;
    const drift = trendBias === "BULLISH" ? volatility * 0.35 : trendBias === "BEARISH" ? -volatility * 0.35 : 0;
    const randomChange = (Math.random() - 0.48) * volatility * 2 + drift;

    const open = currentPrice;
    const close = Math.max(1, Number((open + randomChange).toFixed(2)));
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    const volume = Math.round(50000 + Math.random() * 250000 * (Math.abs(close - open) / volatility));

    currentPrice = close;
    prices.push(close);

    // VWAP calculation
    const typicalPrice = (high + low + close) / 3;
    cumulativeTypicalPriceVolume += typicalPrice * volume;
    cumulativeVolume += volume;
    const vwap = Number((cumulativeTypicalPriceVolume / cumulativeVolume).toFixed(2));

    // EMA9 and EMA21 approximations
    let ema9 = close;
    let ema21 = close;
    if (candles.length > 0) {
      const prevEma9 = candles[candles.length - 1].ema9 || close;
      const prevEma21 = candles[candles.length - 1].ema21 || close;
      const k9 = 2 / (9 + 1);
      const k21 = 2 / (21 + 1);
      ema9 = Number((close * k9 + prevEma9 * (1 - k9)).toFixed(2));
      ema21 = Number((close * k21 + prevEma21 * (1 - k21)).toFixed(2));
    }

    // Supertrend mock line
    const supertrend = trendBias === "BULLISH" ? Number((low - volatility * 1.5).toFixed(2)) : Number((high + volatility * 1.5).toFixed(2));

    // RSI calculation (14 period)
    let rsi = 55;
    if (prices.length >= 14) {
      let gains = 0;
      let losses = 0;
      for (let j = prices.length - 14; j < prices.length; j++) {
        const diff = prices[j] - prices[j - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / 14;
      const avgLoss = losses / 14;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi = Number((100 - (100 / (1 + rs))).toFixed(1));
    }

    candles.push({
      time: timeStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      vwap,
      ema9,
      ema21,
      supertrend,
      rsi,
    });
  }

  return candles;
}
