import React, { useRef, useEffect, useState, useMemo } from "react";
import { CandleData } from "../types";

interface CandlestickChartProps {
  candles: CandleData[];
  symbol: string;
  timeframe: string;
  showEma: boolean;
  showVwap: boolean;
  showSupertrend: boolean;
  showVolume: boolean;
  showRsi: boolean;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  candles,
  symbol,
  timeframe,
  showEma,
  showVwap,
  showSupertrend,
  showVolume,
  showRsi,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Measure container dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width: Math.max(width, 320),
        height: 420,
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute scale boundaries
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (!candles.length) return { minPrice: 0, maxPrice: 100, maxVolume: 1000 };
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      maxVolume: maxVol || 1,
    };
  }, [candles]);

  // Main Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.scale(dpr, dpr);

    // Dark terminal canvas background
    ctx.fillStyle = "#0c1017";
    ctx.fillRect(0, 0, w, h);

    const pricePanelHeight = showRsi ? h * 0.72 : h * 0.88;
    const rsiPanelTop = pricePanelHeight + 10;
    const rsiPanelHeight = h - rsiPanelTop - 20;

    const candleCount = candles.length;
    const candleWidth = (w - 75) / candleCount;
    const bodyWidth = Math.max(1, candleWidth * 0.7);

    const getY = (price: number) => {
      const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
      return pricePanelHeight - ratio * pricePanelHeight + 10;
    };

    // Draw Price Grid Lines
    ctx.strokeStyle = "#161d2b";
    ctx.lineWidth = 1;
    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const priceVal = minPrice + (i / priceSteps) * (maxPrice - minPrice);
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w - 70, y);
      ctx.stroke();

      // Price Label
      ctx.fillStyle = "#64748b";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(priceVal.toFixed(2), w - 65, y + 3);
    }

    // Draw Volume Bars
    if (showVolume) {
      const volumeMaxHeight = pricePanelHeight * 0.22;
      candles.forEach((c, idx) => {
        const x = idx * candleWidth + candleWidth / 2;
        const volHeight = (c.volume / maxVolume) * volumeMaxHeight;
        const y = pricePanelHeight - volHeight;
        const isBull = c.close >= c.open;

        ctx.fillStyle = isBull ? "rgba(16, 185, 129, 0.18)" : "rgba(239, 68, 68, 0.18)";
        ctx.fillRect(x - bodyWidth / 2, y, bodyWidth, volHeight);
      });
    }

    // Draw Indicator Lines (EMA 9, EMA 21, VWAP, Supertrend)
    const drawLine = (color: string, accessor: (c: CandleData) => number | undefined, lineWidth = 1.5) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      let started = false;

      candles.forEach((c, idx) => {
        const val = accessor(c);
        if (val === undefined || isNaN(val)) return;
        const x = idx * candleWidth + candleWidth / 2;
        const y = getY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    };

    if (showVwap) drawLine("#38bdf8", (c) => c.vwap, 1.6); // Cyan VWAP
    if (showEma) {
      drawLine("#f59e0b", (c) => c.ema9, 1.2); // Amber EMA9
      drawLine("#a855f7", (c) => c.ema21, 1.2); // Purple EMA21
    }
    if (showSupertrend) {
      drawLine("#10b981", (c) => c.supertrend, 1.5);
    }

    // Draw Candlesticks (Wick & Body)
    candles.forEach((c, idx) => {
      const x = idx * candleWidth + candleWidth / 2;
      const openY = getY(c.open);
      const closeY = getY(c.close);
      const highY = getY(c.high);
      const lowY = getY(c.low);

      const isBull = c.close >= c.open;
      const color = isBull ? "#10b981" : "#ef4444";

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const top = Math.min(openY, closeY);
      const height = Math.max(1.5, Math.abs(closeY - openY));
      ctx.fillStyle = color;
      ctx.fillRect(x - bodyWidth / 2, top, bodyWidth, height);
    });

    // Draw RSI Subpanel if enabled
    if (showRsi) {
      // Subpanel separator
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, rsiPanelTop - 5);
      ctx.lineTo(w, rsiPanelTop - 5);
      ctx.stroke();

      // RSI 70 / 30 zones
      const getRsiY = (rsiVal: number) => {
        return rsiPanelTop + rsiPanelHeight - (rsiVal / 100) * rsiPanelHeight;
      };

      ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, getRsiY(70));
      ctx.lineTo(w - 70, getRsiY(70));
      ctx.stroke();

      ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      ctx.beginPath();
      ctx.moveTo(0, getRsiY(30));
      ctx.lineTo(w - 70, getRsiY(30));
      ctx.stroke();
      ctx.setLineDash([]);

      // RSI Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("RSI (14)", 10, rsiPanelTop + 12);
      ctx.fillStyle = "#ef4444";
      ctx.fillText("70", w - 65, getRsiY(70) + 3);
      ctx.fillStyle = "#10b981";
      ctx.fillText("30", w - 65, getRsiY(30) + 3);

      // RSI Line
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let rsiStarted = false;
      candles.forEach((c, idx) => {
        if (c.rsi === undefined) return;
        const x = idx * candleWidth + candleWidth / 2;
        const y = getRsiY(c.rsi);
        if (!rsiStarted) {
          ctx.moveTo(x, y);
          rsiStarted = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // Crosshair & Tooltip if hovering
    if (hoverIndex !== null && candles[hoverIndex]) {
      const activeCandle = candles[hoverIndex];
      const crossX = hoverIndex * candleWidth + candleWidth / 2;
      const crossY = getY(activeCandle.close);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crossX, 0);
      ctx.lineTo(crossX, h);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crossY);
      ctx.lineTo(w - 70, crossY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Current price badge on axis
      ctx.fillStyle = activeCandle.close >= activeCandle.open ? "#10b981" : "#ef4444";
      ctx.fillRect(w - 68, crossY - 9, 65, 18);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText(activeCandle.close.toFixed(2), w - 63, crossY + 4);

      // Time tag at bottom
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(crossX - 25, pricePanelHeight + 2, 50, 14);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(activeCandle.time, crossX, pricePanelHeight + 12);
      ctx.textAlign = "left";
    }
  }, [candles, dimensions, hoverIndex, showEma, showVwap, showSupertrend, showVolume, showRsi, minPrice, maxPrice, maxVolume]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const candleWidth = (dimensions.width - 75) / candles.length;
    const idx = Math.floor(x / candleWidth);
    if (idx >= 0 && idx < candles.length) {
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const currentHoverCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div ref={containerRef} className="w-full relative flex flex-col bg-[#0b0e14] rounded-lg border border-[#1e2433] overflow-hidden">
      {/* Top Chart Header & Legend */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#1a2130] bg-[#0e131d]/70 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-mono font-bold text-white text-sm tracking-wide">{symbol}</span>
          <span className="font-mono text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded text-[11px]">{timeframe}</span>
          {currentHoverCandle && (
            <div className="hidden sm:flex items-center space-x-2 font-mono text-[11px] text-zinc-400">
              <span>O: <span className="text-zinc-200">{currentHoverCandle.open.toFixed(2)}</span></span>
              <span>H: <span className="text-zinc-200">{currentHoverCandle.high.toFixed(2)}</span></span>
              <span>L: <span className="text-zinc-200">{currentHoverCandle.low.toFixed(2)}</span></span>
              <span>C: <span className={currentHoverCandle.close >= currentHoverCandle.open ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>{currentHoverCandle.close.toFixed(2)}</span></span>
              <span>Vol: <span className="text-zinc-300">{(currentHoverCandle.volume / 1000).toFixed(1)}k</span></span>
            </div>
          )}
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          {showVwap && (
            <span className="flex items-center space-x-1 text-sky-400">
              <span className="w-2 h-0.5 bg-sky-400 rounded-full inline-block"></span>
              <span>VWAP: {currentHoverCandle?.vwap || "-"}</span>
            </span>
          )}
          {showEma && (
            <>
              <span className="flex items-center space-x-1 text-amber-400">
                <span className="w-2 h-0.5 bg-amber-400 rounded-full inline-block"></span>
                <span>EMA9: {currentHoverCandle?.ema9 || "-"}</span>
              </span>
              <span className="flex items-center space-x-1 text-purple-400">
                <span className="w-2 h-0.5 bg-purple-400 rounded-full inline-block"></span>
                <span>EMA21: {currentHoverCandle?.ema21 || "-"}</span>
              </span>
            </>
          )}
          {showSupertrend && (
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2 h-0.5 bg-emerald-400 rounded-full inline-block"></span>
              <span>ST: {currentHoverCandle?.supertrend || "-"}</span>
            </span>
          )}
          {showRsi && (
            <span className="flex items-center space-x-1 text-indigo-400">
              <span>RSI: {currentHoverCandle?.rsi || "-"}</span>
            </span>
          )}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full cursor-crosshair block"
      />
    </div>
  );
};
