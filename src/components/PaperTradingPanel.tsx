import React from "react";
import { PaperPortfolio, PaperPosition } from "../types";
import { Briefcase, X, ArrowUpRight, ArrowDownRight, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";

interface PaperTradingPanelProps {
  portfolio: PaperPortfolio;
  onClosePosition: (positionId: string) => void;
  onResetPortfolio: () => void;
}

export const PaperTradingPanel: React.FC<PaperTradingPanelProps> = ({
  portfolio,
  onClosePosition,
  onResetPortfolio,
}) => {
  const totalUnrealized = portfolio.positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalPnl = portfolio.realizedPnl + totalUnrealized;
  const isPnlPositive = totalPnl >= 0;

  const totalTradesCount = portfolio.winCount + portfolio.lossCount;
  const winRate = totalTradesCount > 0 ? ((portfolio.winCount / totalTradesCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      {/* Disclaimer Banner */}
      <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>PAPER TRADING ENVIRONMENT (SIMULATION)</span>
          </div>
          <p className="text-zinc-300 font-sans text-xs mt-1">
            Simulate high-confluence strategies with virtual Indian Rupee balance. Zero brokerage connection, zero financial risk.
          </p>
        </div>
        <button
          onClick={onResetPortfolio}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-700 font-mono text-xs self-start sm:self-auto shrink-0 transition-colors"
        >
          Reset Simulation Capital (₹10L)
        </button>
      </div>

      {/* Portfolio Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b212f]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Virtual Net Equity</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block">
            ₹{(portfolio.totalEquity + totalUnrealized).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">Cash: ₹{portfolio.availableCash.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
        </div>

        <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b212f]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Net P&L</span>
          <span className={`text-lg font-bold font-mono mt-1 block ${isPnlPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {isPnlPositive ? "+" : ""}₹{totalPnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            Realized: {portfolio.realizedPnl >= 0 ? "+" : ""}₹{portfolio.realizedPnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b212f]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Win Rate</span>
          <span className="text-lg font-bold font-mono text-sky-400 mt-1 block">
            {winRate}%
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {portfolio.winCount}W / {portfolio.lossCount}L ({totalTradesCount} closed)
          </span>
        </div>

        <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b212f]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Active Positions</span>
          <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
            {portfolio.positions.length} Open
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            Unrealized: {totalUnrealized >= 0 ? "+" : ""}₹{totalUnrealized.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="bg-[#0b0e14] rounded-xl border border-[#1b212f] overflow-hidden">
        <div className="p-3 border-b border-[#18202d] bg-[#0d121b] flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
            Open Paper Positions ({portfolio.positions.length})
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">Live Tick Marked-to-Market</span>
        </div>

        {portfolio.positions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">
            No active simulated positions. Click on any setup in the Radar or Stock Deep Dive to execute a paper trade.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[#18202d] bg-[#090d13] text-[11px] uppercase text-zinc-400">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Side</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Avg Entry</th>
                  <th className="py-2.5 px-3">LTP</th>
                  <th className="py-2.5 px-3">Stop Loss</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">P&L (₹)</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141a24]">
                {portfolio.positions.map((pos) => {
                  const isPosPnl = pos.unrealizedPnl >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-[#111722] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white">{pos.symbol}</span>
                        <span className="block text-[10px] text-zinc-500 font-sans">{pos.setupType}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pos.side === "BUY"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}>
                          {pos.side}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-zinc-200">{pos.quantity}</td>

                      <td className="py-3 px-3 text-zinc-300">₹{pos.entryPrice.toFixed(2)}</td>

                      <td className="py-3 px-3 text-white font-bold">₹{pos.currentPrice.toFixed(2)}</td>

                      <td className="py-3 px-3 text-rose-400">₹{pos.stopLoss.toFixed(2)}</td>

                      <td className="py-3 px-3 text-emerald-400">₹{pos.target.toFixed(2)}</td>

                      <td className="py-3 px-3">
                        <span className={`font-bold ${isPosPnl ? "text-emerald-400" : "text-rose-400"}`}>
                          {isPosPnl ? "+" : ""}₹{pos.unrealizedPnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </span>
                        <span className={`block text-[10px] ${isPosPnl ? "text-emerald-500/80" : "text-rose-500/80"}`}>
                          ({isPosPnl ? "+" : ""}{pos.unrealizedPnlPercent.toFixed(2)}%)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onClosePosition(pos.id)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-rose-900/60 hover:text-rose-300 text-zinc-300 text-xs transition-colors border border-zinc-700"
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
