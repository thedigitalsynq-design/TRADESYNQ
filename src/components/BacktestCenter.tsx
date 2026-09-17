import React, { useState, useEffect } from "react";
import { BacktestParams, BacktestResults } from "../types";
import { 
  BarChart3, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Layers, 
  Sliders,
  CheckCircle2,
  Calendar,
  Clock,
  Loader2
} from "lucide-react";

export const BacktestCenter: React.FC = () => {
  const [params, setParams] = useState<BacktestParams>({
    strategy: "Momentum Breakout",
    stockUniverse: "NIFTY 50",
    dateRange: "Last 6 Months",
    timeframe: "15m",
    stopLossPercent: 1.2,
    targetRatio: 2.5,
    trailingStop: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacktestResults | null>(null);

  const runBacktest = async (currentParams: BacktestParams) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/backtest/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentParams),
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runBacktest(params);
  }, []);

  return (
    <div className="space-y-5">
      {/* Top Banner with Strict Distinction */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-widest flex items-center space-x-1">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>HISTORICAL QUANTITATIVE BACKTEST CENTER</span>
              </span>
              <span className="text-zinc-500 text-xs font-mono">• WALK-FORWARD VALIDATION</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1.5">
              Empirical Confirmation System Testing
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-3xl font-sans">
              Rigorous historical simulation across tick data with realistic slippage, liquidity hurdles, and fee friction.
            </p>
          </div>

          {/* Mode Distinction Tag */}
          <div className="flex items-center space-x-2 font-mono text-xs shrink-0">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              BACKTEST MODE
            </span>
            <span className="text-zinc-600">≠</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">
              PAPER TRADE
            </span>
            <span className="text-zinc-600">≠</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">
              LIVE MARKET
            </span>
          </div>
        </div>
      </div>

      {/* Configuration & Controls */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b212f] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#18202d] pb-2">
          <span className="text-zinc-300 font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Strategy Parameters</span>
          </span>
          <button
            onClick={() => runBacktest(params)}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLoading ? "Simulating..." : "Run Backtest"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Strategy */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Strategy</label>
            <select
              value={params.strategy}
              onChange={(e) => setParams({ ...params, strategy: e.target.value })}
              className="w-full bg-[#111622] border border-[#1d2536] text-zinc-200 rounded px-2 py-1.5"
            >
              <option value="Momentum Breakout">Momentum Breakout</option>
              <option value="Opening Range Breakout">ORB 15-Minute</option>
              <option value="VWAP Reclaim">VWAP Momentum Reclaim</option>
              <option value="Pullback Continuation">Pullback Continuation</option>
              <option value="Mean Reversion">Mean Reversion</option>
            </select>
          </div>

          {/* Universe */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Universe</label>
            <select
              value={params.stockUniverse}
              onChange={(e) => setParams({ ...params, stockUniverse: e.target.value })}
              className="w-full bg-[#111622] border border-[#1d2536] text-zinc-200 rounded px-2 py-1.5"
            >
              <option value="NIFTY 50">NIFTY 50</option>
              <option value="BANK NIFTY">BANK NIFTY</option>
              <option value="Large Cap">NSE Large Cap 100</option>
              <option value="High Beta">High Beta Momentum</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Date Range</label>
            <select
              value={params.dateRange}
              onChange={(e) => setParams({ ...params, dateRange: e.target.value })}
              className="w-full bg-[#111622] border border-[#1d2536] text-zinc-200 rounded px-2 py-1.5"
            >
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 1 Year">Last 1 Year</option>
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Timeframe</label>
            <select
              value={params.timeframe}
              onChange={(e) => setParams({ ...params, timeframe: e.target.value })}
              className="w-full bg-[#111622] border border-[#1d2536] text-zinc-200 rounded px-2 py-1.5"
            >
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1H">1 Hour</option>
              <option value="1D">Daily</option>
            </select>
          </div>

          {/* Stop Loss % */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Stop Loss (%)</label>
            <input
              type="number"
              step="0.1"
              value={params.stopLossPercent}
              onChange={(e) => setParams({ ...params, stopLossPercent: Number(e.target.value) })}
              className="w-full bg-[#111622] border border-[#1d2536] text-zinc-200 rounded px-2 py-1.5"
            />
          </div>

          {/* Target R:R */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Target Ratio (1:R)</label>
            <input
              type="number"
              step="0.2"
              value={params.targetRatio}
              onChange={(e) => setParams({ ...params, targetRatio: Number(e.target.value) })}
              className="w-full bg-[#111622] border border-[#1d2536] text-zinc-200 rounded px-2 py-1.5"
            />
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      {results && (
        <div className="space-y-4">
          {/* Key Metric Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b212f]">
              <span className="text-[10px] text-zinc-500 uppercase block">Total Trades</span>
              <span className="text-lg font-bold text-white mt-1 block">{results.totalTrades}</span>
              <span className="text-[10px] text-zinc-400">Sample Depth</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase block">Win Rate</span>
              <span className="text-lg font-bold text-emerald-400 mt-1 block">{results.winRate}%</span>
              <span className="text-[10px] text-zinc-400">Consistently Validated</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b212f]">
              <span className="text-[10px] text-zinc-500 uppercase block">Profit Factor</span>
              <span className="text-lg font-bold text-sky-400 mt-1 block">{results.profitFactor}</span>
              <span className="text-[10px] text-zinc-400">Gross Win / Gross Loss</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b212f]">
              <span className="text-[10px] text-zinc-500 uppercase block">Max Drawdown</span>
              <span className="text-lg font-bold text-rose-400 mt-1 block">-{results.maxDrawdownPercent}%</span>
              <span className="text-[10px] text-zinc-400">Peak to Trough</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b212f]">
              <span className="text-[10px] text-zinc-500 uppercase block">Expectancy (R)</span>
              <span className="text-lg font-bold text-emerald-400 mt-1 block">+{results.expectancyR}R</span>
              <span className="text-[10px] text-zinc-400">Per Trade Return</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b212f]">
              <span className="text-[10px] text-zinc-500 uppercase block">Total Return</span>
              <span className="text-lg font-bold text-emerald-300 mt-1 block">+{results.totalReturnPercent}%</span>
              <span className="text-[10px] text-zinc-400">Sharpe: {results.sharpeRatio}</span>
            </div>
          </div>

          {/* Equity Curve Visual Graph */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b212f]">
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="text-zinc-300 font-bold uppercase">Simulated Cumulative Equity Curve</span>
              <span className="text-emerald-400 font-semibold">Starting: ₹5,00,000 → Ending: ₹{results.equityCurve[results.equityCurve.length - 1]?.equity.toLocaleString("en-IN")}</span>
            </div>

            {/* Custom SVG Equity Curve */}
            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#18202d" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="90" x2="800" y2="90" stroke="#18202d" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="140" x2="800" y2="140" stroke="#18202d" strokeWidth="1" strokeDasharray="3,3" />

                {/* Path calculation */}
                {(() => {
                  const points = results.equityCurve;
                  if (!points.length) return null;
                  const minE = Math.min(...points.map((p) => p.equity)) * 0.98;
                  const maxE = Math.max(...points.map((p) => p.equity)) * 1.02;
                  const range = maxE - minE || 1;

                  const coords = points.map((p, i) => {
                    const x = (i / (points.length - 1)) * 800;
                    const y = 170 - ((p.equity - minE) / range) * 150;
                    return `${x},${y}`;
                  });

                  const pathD = `M ${coords.join(" L ")}`;
                  const fillD = `M 0,170 L ${coords.join(" L ")} L 800,170 Z`;

                  return (
                    <>
                      <path d={fillD} fill="url(#equityGrad)" />
                      <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Trade Sample Journal */}
          <div className="bg-[#0b0e14] rounded-xl border border-[#1b212f] overflow-hidden">
            <div className="p-3 border-b border-[#18202d] bg-[#0d121b] flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-zinc-200 uppercase">Recent Strategy Backtest Trades</span>
              <span className="text-zinc-500">Consecutive Wins: {results.consecutiveWins} | Losses: {results.consecutiveLosses}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#18202d] bg-[#090d13] text-[11px] uppercase text-zinc-400">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Entry</th>
                    <th className="py-2.5 px-3">Exit</th>
                    <th className="py-2.5 px-3">P&L %</th>
                    <th className="py-2.5 px-3">R Outcome</th>
                    <th className="py-2.5 px-3">Exit Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141a24]">
                  {results.recentTrades.slice(0, 10).map((tr) => {
                    const isWin = tr.pnlPercent > 0;
                    return (
                      <tr key={tr.id} className="hover:bg-[#111722] transition-colors">
                        <td className="py-2.5 px-3 text-zinc-400">{tr.date}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{tr.symbol}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{tr.type}</td>
                        <td className="py-2.5 px-3 text-zinc-300">₹{tr.entry}</td>
                        <td className="py-2.5 px-3 text-zinc-300">₹{tr.exit}</td>
                        <td className={`py-2.5 px-3 font-bold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                          {isWin ? "+" : ""}{tr.pnlPercent}%
                        </td>
                        <td className="py-2.5 px-3 text-zinc-200 font-semibold">{tr.rResult}</td>
                        <td className="py-2.5 px-3 text-zinc-400 text-[11px]">{tr.exitReason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
