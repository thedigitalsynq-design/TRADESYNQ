import React, { useState } from "react";
import { StockSetup } from "../types";
import { 
  Zap, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Eye,
  Sliders
} from "lucide-react";

interface AggressiveModePanelProps {
  stocks: StockSetup[];
  onSelectStock: (stock: StockSetup) => void;
  onOpenRiskCalcForStock: (stock: StockSetup) => void;
}

export const AggressiveModePanel: React.FC<AggressiveModePanelProps> = ({
  stocks,
  onSelectStock,
  onOpenRiskCalcForStock,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("ALL");

  const aggressiveStrategies = [
    { id: "ALL", name: "All Aggressive Setups" },
    { id: "Momentum Breakout", name: "Momentum Breakout" },
    { id: "Opening Range Breakout", name: "Opening Range Breakout (ORB)" },
    { id: "VWAP Momentum", name: "VWAP Momentum" },
    { id: "Volume Explosion", name: "Volume Explosion" },
    { id: "Relative Strength", name: "Relative Strength" },
    { id: "Pullback Continuation", name: "Pullback Continuation" },
    { id: "Breakout Retest", name: "Breakout Retest" },
    { id: "Mean Reversion", name: "Mean Reversion" },
  ];

  const aggressiveStocks = stocks.filter((s) => {
    if (s.setup === "NO TRADE") return false;
    if (selectedStrategy === "ALL") return true;
    return s.setupType === selectedStrategy;
  });

  return (
    <div className="space-y-4">
      {/* Aggressive Mode Warning & Strategy Directive Banner */}
      <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-950/20 to-transparent p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest flex items-center space-x-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>AGGRESSIVE STRATEGY RADAR</span>
              </span>
              <span className="text-zinc-400 text-xs font-mono">• ACTIVE TRADER SPECIALIZATION</span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-1">
              High-Velocity & Volatility Breakout Setups
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Engineered specifically for momentum expansion, volume explosion, and intraday opening range breakouts. 
              Always enforces hard stops, defined invalidation levels, and disciplined position sizing.
            </p>
          </div>

          <div className="bg-[#0b0e14] p-3 rounded-lg border border-amber-500/30 text-right shrink-0">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Active Strategy Count</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{aggressiveStocks.length} Setups</span>
            <span className="text-[10px] text-zinc-500 block">Strict Risk Enforced</span>
          </div>
        </div>

        {/* Strategy Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4 mt-3 border-t border-amber-500/20">
          {aggressiveStrategies.map((strat) => (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedStrategy === strat.id
                  ? "bg-amber-500/25 text-amber-200 border border-amber-500/50 font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {strat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Setups Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aggressiveStocks.map((stock) => {
          return (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className="bg-[#0b0e14] rounded-xl border border-[#1e2536] hover:border-amber-500/40 p-4 transition-all hover:bg-[#0e131d] cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Higher Risk Warning Ribbon if applicable */}
              {stock.isHigherRisk && (
                <div className="mb-2 flex items-center space-x-1.5 px-2 py-1 rounded bg-rose-950/40 border border-rose-500/30 text-[10px] font-mono text-rose-300">
                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="font-bold">HIGHER RISK:</span>
                  <span className="truncate">{stock.riskReason || "Increased volatility setup"}</span>
                </div>
              )}

              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {stock.sector}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 truncate max-w-[180px] font-sans mt-0.5">
                      {stock.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {stock.confluenceScore}/100
                    </span>
                    <span className="block text-[10px] font-mono text-zinc-500 mt-1">
                      {stock.setupType}
                    </span>
                  </div>
                </div>

                {/* Price & Change */}
                <div className="mt-3 flex items-baseline justify-between border-y border-[#18202d] py-2 font-mono">
                  <div>
                    <span className="text-xs text-zinc-500 block">LTP</span>
                    <span className="text-base font-bold text-white">
                      ₹{stock.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block">DAY CHANGE</span>
                    <span className={`text-sm font-bold ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Key Trade Parameters: Entry, Stop, Target, R:R */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#111622] p-2 rounded border border-[#1a2333]">
                    <span className="text-[10px] text-zinc-400 uppercase block">Entry Zone</span>
                    <span className="text-zinc-200 font-semibold">{stock.entryZone}</span>
                  </div>

                  <div className="bg-[#111622] p-2 rounded border border-[#1a2333]">
                    <span className="text-[10px] text-rose-400 uppercase block">Stop Loss</span>
                    <span className="text-rose-400 font-bold">₹{stock.stopLoss.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="bg-[#111622] p-2 rounded border border-[#1a2333]">
                    <span className="text-[10px] text-emerald-400 uppercase block">Target 1 & 2</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{stock.target1.toLocaleString("en-IN")} / ₹{stock.target2.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bg-[#111622] p-2 rounded border border-[#1a2333]">
                    <span className="text-[10px] text-amber-400 uppercase block">Risk : Reward</span>
                    <span className="text-amber-400 font-bold">{stock.riskReward}</span>
                  </div>
                </div>

                {/* Invalidation Rule */}
                <div className="mt-3 p-2 rounded bg-[#0e131d] border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span className="text-rose-400 font-bold block uppercase text-[10px]">Invalidation Condition:</span>
                  <p className="mt-0.5 text-zinc-400 leading-snug">{stock.invalidation}</p>
                </div>

                {/* Confirmations List */}
                <div className="mt-3 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Confirmed Drivers ({stock.confirmationsAlignedCount}/5 Aligned)
                  </span>
                  <div className="space-y-1 font-sans text-[11px] text-zinc-300">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{stock.confirmations.trend.details[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{stock.confirmations.volume.details[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#18202d] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onOpenRiskCalcForStock(stock)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
                >
                  <Calculator className="w-3 h-3 text-emerald-400" />
                  <span>Position Size</span>
                </button>

                <button
                  onClick={() => onSelectStock(stock)}
                  className="flex items-center space-x-1 text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <span>Terminal Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
