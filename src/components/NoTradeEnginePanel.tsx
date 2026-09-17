import React from "react";
import { NoTradeItem, StockSetup } from "../types";
import { ShieldAlert, AlertOctagon, XCircle, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

interface NoTradeEnginePanelProps {
  noTradeRadar: NoTradeItem[];
  stocks: StockSetup[];
  onSelectStock: (stock: StockSetup) => void;
}

export const NoTradeEnginePanel: React.FC<NoTradeEnginePanelProps> = ({
  noTradeRadar,
  stocks,
  onSelectStock,
}) => {
  const noTradeStocks = stocks.filter((s) => s.setup === "NO TRADE" || s.confluenceScore < 45);

  return (
    <div className="space-y-5">
      {/* Top Banner: Capital Preservation Philosophy */}
      <div className="rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-rose-950/20 to-transparent p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-widest flex items-center space-x-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>ACTIVE NO-TRADE ENGINE</span>
              </span>
              <span className="text-zinc-400 text-xs font-mono">• CAPITAL PRESERVATION PROTOCOL</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1.5 tracking-tight">
              Protecting Traders From Low-Probability Setups
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-3xl leading-relaxed">
              Active trading success is defined as much by the setups you reject as those you take. 
              TradeSynq actively filters out instruments exhibiting conflicting indicators, wide slippage, liquidity traps, choppy compressions, and poor risk-to-reward ratios.
            </p>
          </div>

          <div className="bg-[#0b0e14] p-3 rounded-lg border border-rose-500/30 text-right shrink-0">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Filtered Out Today</span>
            <span className="text-2xl font-bold font-mono text-rose-400">{noTradeRadar.length + noTradeStocks.length} Traps</span>
            <span className="text-[10px] text-zinc-500 block">Execution Blocked</span>
          </div>
        </div>
      </div>

      {/* Flagged Market Radar Situations */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold font-mono uppercase text-zinc-200">
            Active Market Invalidation & Liquidity Warnings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {noTradeRadar.map((item) => (
            <div
              key={item.id}
              className="bg-[#0b0e14] rounded-xl border border-[#231b26] hover:border-rose-500/50 p-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-white text-sm">{item.symbol}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    item.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    {item.severity}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  {item.category.replace("_", " ")}
                </span>
              </div>

              <div className="mt-2 text-xs font-semibold text-rose-300">
                {item.reason}
              </div>

              <div className="mt-2 bg-[#120f16] p-2 rounded border border-[#231726] text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500 text-[10px] uppercase block">Triggering Metric:</span>
                <span className="text-zinc-200 font-bold">{item.metric}</span>
              </div>

              <div className="mt-2 text-[11px] text-zinc-300 leading-snug font-sans">
                <span className="text-amber-400 font-mono font-semibold text-[10px] uppercase block">Why avoid:</span>
                {item.recommendation}
              </div>

              <div className="mt-3 pt-2 border-t border-[#1e1724] flex items-center justify-between text-[11px] font-mono text-rose-400">
                <span className="flex items-center space-x-1">
                  <XCircle className="w-3 h-3" />
                  <span>NO TRADE RECOMMENDED</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Stocks with Insufficient Confluence */}
      <div className="mt-6">
        <div className="flex items-center space-x-2 mb-3">
          <XCircle className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold font-mono uppercase text-zinc-200">
            Instruments With Low Confluence Scores (&lt;40)
          </h3>
        </div>

        <div className="bg-[#0b0e14] rounded-xl border border-[#1e2330] overflow-hidden">
          <div className="divide-y divide-[#161c28]">
            {noTradeStocks.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className="p-3 sm:p-4 hover:bg-[#10141e] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white text-sm">{stock.symbol}</span>
                    <span className="text-xs text-zinc-400 font-sans">({stock.name})</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      SCORE: {stock.confluenceScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {stock.signalRationale}
                  </p>
                </div>

                <div className="flex items-center space-x-4 shrink-0 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">RVOL</span>
                    <span className="text-zinc-300 font-bold">{stock.relativeVolume}x</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">DELIVERY</span>
                    <span className="text-zinc-300 font-bold">{stock.deliveryPercent}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold uppercase block text-[10px]">STATUS</span>
                    <span className="text-zinc-400 font-bold">REJECTED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
