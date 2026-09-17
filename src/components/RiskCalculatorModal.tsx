import React, { useState, useEffect } from "react";
import { StockSetup } from "../types";
import { Calculator, X, AlertTriangle, ShieldCheck, Check, ArrowRight } from "lucide-react";

interface RiskCalculatorModalProps {
  stock: StockSetup | null;
  onClose: () => void;
  onApplyToPaperTrade: (trade: {
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    entryPrice: number;
    stopLoss: number;
    target: number;
    setupType: string;
  }) => void;
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({
  stock,
  onClose,
  onApplyToPaperTrade,
}) => {
  const [capital, setCapital] = useState<number>(500000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [entryPrice, setEntryPrice] = useState<number>(stock ? stock.entryPrice : 1000);
  const [stopLoss, setStopLoss] = useState<number>(stock ? stock.stopLoss : 980);
  const [targetPrice, setTargetPrice] = useState<number>(stock ? stock.target1 : 1050);

  useEffect(() => {
    if (stock) {
      setEntryPrice(stock.entryPrice);
      setStopLoss(stock.stopLoss);
      setTargetPrice(stock.target1);
    }
  }, [stock]);

  // Calculations
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const rewardPerShare = Math.abs(targetPrice - entryPrice);
  const maxRiskAmount = (capital * riskPercent) / 100;
  
  const quantity = riskPerShare > 0 ? Math.floor(maxRiskAmount / riskPerShare) : 0;
  const positionSize = quantity * entryPrice;
  const potentialLoss = quantity * riskPerShare;
  const potentialProfit = quantity * rewardPerShare;
  const riskRewardRatio = riskPerShare > 0 ? (rewardPerShare / riskPerShare).toFixed(2) : "0.00";
  const capitalExposurePercent = capital > 0 ? ((positionSize / capital) * 100).toFixed(1) : "0";

  const isExcessiveRisk = riskPercent > 2.0;
  const isPoorRR = Number(riskRewardRatio) < 1.5;

  const handleSendToPaper = () => {
    if (!stock || quantity <= 0) return;
    onApplyToPaperTrade({
      symbol: stock.symbol,
      side: stock.setup === "SHORT SETUP" ? "SELL" : "BUY",
      quantity,
      entryPrice,
      stopLoss,
      target: targetPrice,
      setupType: stock.setupType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b0e14] border border-[#1e2536] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#18202d] bg-[#0d121b]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Risk Management & Position Calculator
              </h2>
              {stock && (
                <span className="text-xs text-zinc-400 font-mono">
                  Target Instrument: <span className="text-emerald-400 font-bold">{stock.symbol}</span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-5 space-y-4 font-mono text-xs">
          {/* Capital & Risk % Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Total Trading Capital (₹)</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full bg-[#111622] border border-[#1c2637] rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Risk Per Trade (%)</label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="0.25"
                  max="5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-[#111622] border border-[#1c2637] rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500/60"
                />
                <span className="text-zinc-500">%</span>
              </div>
            </div>
          </div>

          {/* Warning if excessive risk */}
          {isExcessiveRisk && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start space-x-2 text-[11px] text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                DISCIPLINE WARNING: Risking &gt;2% per trade dramatically increases drawdown risk. Professional institutional standard is 0.5% - 1.5%.
              </span>
            </div>
          )}

          {/* Trade Levels: Entry, SL, Target */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#18202d]">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Entry Price (₹)</label>
              <input
                type="number"
                step="0.05"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-[#111622] border border-[#1c2637] rounded-lg px-2.5 py-1.5 text-zinc-200 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-rose-400 block mb-1">Stop Loss (₹)</label>
              <input
                type="number"
                step="0.05"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full bg-[#111622] border border-rose-500/30 rounded-lg px-2.5 py-1.5 text-rose-400 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-emerald-400 block mb-1">Target Price (₹)</label>
              <input
                type="number"
                step="0.05"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full bg-[#111622] border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Calculated Output Matrix */}
          <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1b2538] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Maximum Allowed Risk:</span>
              <span className="text-rose-400 font-bold">₹{maxRiskAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Risk Per Share:</span>
              <span className="text-zinc-200 font-bold">₹{riskPerShare.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-[#182133] pt-2">
              <span className="text-emerald-400 font-bold uppercase">Discipline Quantity:</span>
              <span className="text-emerald-300 font-extrabold text-base bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/40">
                {quantity.toLocaleString("en-IN")} Shares
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Total Position Capital:</span>
              <span className="text-zinc-200 font-bold">
                ₹{positionSize.toLocaleString("en-IN")} ({capitalExposurePercent}% of capital)
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Potential Profit:</span>
              <span className="text-emerald-400 font-bold">₹{potentialProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Risk-to-Reward Ratio:</span>
              <span className={`font-bold ${isPoorRR ? "text-amber-400" : "text-emerald-400"}`}>
                1 : {riskRewardRatio} {isPoorRR && "(Poor R:R)"}
              </span>
            </div>
          </div>

          {/* Action to Paper Trade */}
          {stock && (
            <button
              onClick={handleSendToPaper}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Execute as Paper Trade ({quantity} Shares)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
