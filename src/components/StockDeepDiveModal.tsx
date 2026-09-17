import React, { useState, useEffect } from "react";
import { StockSetup, CandleData } from "../types";
import { CandlestickChart } from "./CandlestickChart";
import { generateCandleSeries } from "../utils/technicalAnalysis";
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Volume2, 
  ShieldAlert, 
  Calculator, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Clock, 
  Send,
  Loader2,
  ChevronRight
} from "lucide-react";

interface StockDeepDiveModalProps {
  stock: StockSetup | null;
  onClose: () => void;
  onOpenRiskCalc: (stock: StockSetup) => void;
  onPlacePaperOrder: (stock: StockSetup, side: "BUY" | "SELL") => void;
}

export const StockDeepDiveModal: React.FC<StockDeepDiveModalProps> = ({
  stock,
  onClose,
  onOpenRiskCalc,
  onPlacePaperOrder,
}) => {
  if (!stock) return null;

  const [activeTimeframe, setActiveTimeframe] = useState<string>("15m");
  const [candles, setCandles] = useState<CandleData[]>([]);

  // Chart Overlay Toggles
  const [showEma, setShowEma] = useState(true);
  const [showVwap, setShowVwap] = useState(true);
  const [showSupertrend, setShowSupertrend] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRsi, setShowRsi] = useState(true);

  // AI Audit State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiSource, setAiSource] = useState("");

  // Update Candles when stock or timeframe changes
  useEffect(() => {
    const trend = stock.confirmations.trend.status;
    const series = generateCandleSeries(stock.ltp, activeTimeframe, trend, 60);
    setCandles(series);
  }, [stock, activeTimeframe]);

  // Trigger AI Audit
  const handleRunAiAudit = async (queryText?: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: stock.symbol,
          query: queryText || customPrompt,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.aiAnalysis);
      setAiSource(data.source);
    } catch (e) {
      console.error(e);
      setAiAnalysis("Audit synthesis temporarily unavailable. Please retry.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const isGreen = stock.change >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b0e14] border border-[#1e2536] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#18202d] bg-[#0d121b]">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-mono font-extrabold text-white tracking-wide">
                  {stock.symbol}
                </h1>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  {stock.exchange} • {stock.sector}
                </span>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  {stock.capCategory}
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-sans mt-0.5">
                {stock.name}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right font-mono">
              <div className="text-lg font-bold text-white">
                ₹{stock.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-semibold ${isGreen ? "text-emerald-400" : "text-rose-400"}`}>
                {isGreen ? "+" : ""}{stock.change.toFixed(2)} ({isGreen ? "+" : ""}{stock.changePercent.toFixed(2)}%)
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-[#0e131d] p-3 rounded-xl border border-[#182130] text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">VWAP</span>
              <span className="font-bold text-sky-400">₹{stock.vwap}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">RVOL</span>
              <span className={`font-bold ${stock.relativeVolume >= 2 ? "text-emerald-400" : "text-zinc-300"}`}>
                {stock.relativeVolume}x
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Volume</span>
              <span className="font-bold text-zinc-200">{stock.volume}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Delivery %</span>
              <span className="font-bold text-zinc-200">{stock.deliveryPercent}%</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">RSI (14)</span>
              <span className="font-bold text-zinc-200">{stock.rsi}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">52W High</span>
              <span className="font-bold text-zinc-300">₹{stock.high52w}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">52W Low</span>
              <span className="font-bold text-zinc-300">₹{stock.low52w}</span>
            </div>
          </div>

          {/* Candlestick Chart with Controls */}
          <div className="space-y-2">
            {/* Chart Toolbar: Timeframes & Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0e131d] p-2 rounded-lg border border-[#182130] text-xs font-mono">
              {/* Timeframes */}
              <div className="flex items-center space-x-1">
                {["1m", "3m", "5m", "15m", "30m", "1H", "4H", "1D", "1W"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-2 py-1 rounded transition-colors ${
                      activeTimeframe === tf
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Indicator Toggles */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setShowVwap(!showVwap)}
                  className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                    showVwap
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                      : "text-zinc-500 border-zinc-800"
                  }`}
                >
                  VWAP
                </button>
                <button
                  onClick={() => setShowEma(!showEma)}
                  className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                    showEma
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "text-zinc-500 border-zinc-800"
                  }`}
                >
                  EMA 9/21
                </button>
                <button
                  onClick={() => setShowSupertrend(!showSupertrend)}
                  className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                    showSupertrend
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "text-zinc-500 border-zinc-800"
                  }`}
                >
                  Supertrend
                </button>
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                    showVolume
                      ? "bg-zinc-700 text-zinc-200 border-zinc-600"
                      : "text-zinc-500 border-zinc-800"
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setShowRsi(!showRsi)}
                  className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
                    showRsi
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      : "text-zinc-500 border-zinc-800"
                  }`}
                >
                  RSI (14)
                </button>
              </div>
            </div>

            {/* Canvas Candlestick Chart */}
            <CandlestickChart
              candles={candles}
              symbol={stock.symbol}
              timeframe={activeTimeframe}
              showEma={showEma}
              showVwap={showVwap}
              showSupertrend={showSupertrend}
              showVolume={showVolume}
              showRsi={showRsi}
            />
          </div>

          {/* Signal Explanation & Risk Parameters Card (Never "BUY RELIANCE" without deep evidence) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Signal Explanation Card */}
            <div className="lg:col-span-7 bg-[#0e131d] rounded-xl border border-[#1b2333] p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-[#18202d] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Confluence Signal Engine
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-base font-extrabold text-white font-mono">
                      {stock.setup === "LONG SETUP" ? "LONG SETUP DETECTED" : stock.setup === "SHORT SETUP" ? "SHORT SETUP DETECTED" : stock.setup}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Confluence: {stock.confluenceScore}/100
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Strategy</span>
                  <span className="text-xs font-mono font-semibold text-zinc-300">{stock.setupType}</span>
                </div>
              </div>

              {/* Why was this signal generated? Evidence */}
              <div>
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wide block mb-2">
                  Signal Evidence & Confirmations ({stock.confirmationsAlignedCount}/5 Alignments)
                </span>
                <div className="space-y-2 text-xs font-sans text-zinc-300">
                  <div className="flex items-start space-x-2 bg-[#121824] p-2 rounded border border-[#1c2536]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white font-mono">Trend Confirmation ({stock.confirmations.trend.score}/20): </span>
                      {stock.confirmations.trend.details.join(" • ")}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 bg-[#121824] p-2 rounded border border-[#1c2536]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white font-mono">Momentum Confirmation ({stock.confirmations.momentum.score}/20): </span>
                      {stock.confirmations.momentum.details.join(" • ")}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 bg-[#121824] p-2 rounded border border-[#1c2536]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white font-mono">Volume Confirmation ({stock.confirmations.volume.score}/20): </span>
                      {stock.confirmations.volume.details.join(" • ")}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 bg-[#121824] p-2 rounded border border-[#1c2536]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white font-mono">Price Action ({stock.confirmations.priceAction.score}/20): </span>
                      {stock.confirmations.priceAction.details.join(" • ")}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 bg-[#121824] p-2 rounded border border-[#1c2536]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white font-mono">Market Alignment ({stock.confirmations.marketAlignment.score}/20): </span>
                      {stock.confirmations.marketAlignment.details.join(" • ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invalidation Clause */}
              <div className="p-3 rounded-lg bg-rose-950/25 border border-rose-500/30 text-xs font-mono">
                <span className="text-rose-400 font-bold uppercase tracking-wider block text-[11px]">
                  Setup Invalidation Rule:
                </span>
                <p className="mt-1 text-zinc-300 leading-relaxed font-sans">
                  {stock.invalidation}
                </p>
              </div>
            </div>

            {/* Right: Trade Execution Parameters & Sizing */}
            <div className="lg:col-span-5 bg-[#0e131d] rounded-xl border border-[#1b2333] p-4 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wide block mb-3">
                  Defined Risk & Reward Architecture
                </span>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center bg-[#111622] p-2.5 rounded border border-[#1a2333]">
                    <span className="text-zinc-400">Entry Zone:</span>
                    <span className="text-zinc-100 font-bold">{stock.entryZone}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#111622] p-2.5 rounded border border-rose-500/30">
                    <span className="text-rose-400 font-semibold">Hard Stop Loss:</span>
                    <span className="text-rose-400 font-bold text-sm">₹{stock.stopLoss.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#111622] p-2.5 rounded border border-emerald-500/30">
                    <span className="text-emerald-400 font-semibold">Target 1 (Base):</span>
                    <span className="text-emerald-400 font-bold text-sm">₹{stock.target1.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#111622] p-2.5 rounded border border-emerald-500/30">
                    <span className="text-emerald-400 font-semibold">Target 2 (Runner):</span>
                    <span className="text-emerald-400 font-bold text-sm">₹{stock.target2.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#111622] p-2.5 rounded border border-amber-500/30">
                    <span className="text-amber-400 font-semibold">Risk : Reward Ratio:</span>
                    <span className="text-amber-300 font-extrabold text-sm">{stock.riskReward}</span>
                  </div>
                </div>
              </div>

              {/* Multi-Timeframe Matrix Snapshot */}
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                  Multi-Timeframe Alignment ({stock.timeframeMatrix.alignmentLabel})
                </span>
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                  {[
                    { tf: "5M", data: stock.timeframeMatrix.tf5m },
                    { tf: "15M", data: stock.timeframeMatrix.tf15m },
                    { tf: "1H", data: stock.timeframeMatrix.tf1h },
                    { tf: "4H", data: stock.timeframeMatrix.tf4h },
                    { tf: "1D", data: stock.timeframeMatrix.tfDaily },
                  ].map((m) => {
                    const isBull = m.data.trend === "BULLISH";
                    return (
                      <div
                        key={m.tf}
                        className={`p-1.5 rounded border ${
                          isBull
                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <div className="font-bold text-zinc-200">{m.tf}</div>
                        <div className="mt-0.5">{m.data.trend}</div>
                        <div className="text-[9px] text-zinc-500">{m.data.signal}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Position Sizing & Paper Order */}
              <div className="pt-2 border-t border-[#1a2333] grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenRiskCalc(stock)}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-semibold transition-colors border border-zinc-700"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Calculate Risk</span>
                </button>

                <button
                  onClick={() => onPlacePaperOrder(stock, stock.setup === "SHORT SETUP" ? "SELL" : "BUY")}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Paper Trade Setup</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Setup Auditor / Gemini Intelligence Copilot */}
          <div className="bg-[#0e131d] rounded-xl border border-sky-500/30 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">
                  AI Setup Auditor & Execution Copilot
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Powered by Gemini Quantitative Analysis
              </span>
            </div>

            {/* Custom question input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about this setup: e.g. What are the key risk factors or options positioning?"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRunAiAudit()}
                className="flex-1 bg-[#121824] border border-[#1c2637] rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500/60 font-mono"
              />
              <button
                onClick={() => handleRunAiAudit()}
                disabled={isAiLoading}
                className="flex items-center space-x-1 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 rounded-lg text-xs font-mono font-semibold text-white transition-colors"
              >
                {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isAiLoading ? "Auditing..." : "Run Audit"}</span>
              </button>
            </div>

            {/* AI Output Box */}
            {aiAnalysis ? (
              <div className="bg-[#111724] border border-[#1e2a3d] p-3.5 rounded-lg text-xs font-sans text-zinc-200 whitespace-pre-line leading-relaxed">
                {aiAnalysis}
                {aiSource && (
                  <div className="mt-2 text-[10px] font-mono text-zinc-500 border-t border-[#1c2738] pt-1">
                    Audited by {aiSource}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-zinc-400 italic bg-[#111724]/40 p-3 rounded border border-zinc-800/60 flex items-center justify-between">
                <span>Click "Run Audit" to generate an executive trade audit explaining why this signal was generated and key risk parameters.</span>
                <button
                  onClick={() => handleRunAiAudit()}
                  className="text-sky-400 hover:underline font-mono text-xs shrink-0 ml-2"
                >
                  Generate Now →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
