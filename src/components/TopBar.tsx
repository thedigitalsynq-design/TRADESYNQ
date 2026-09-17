import React, { useState, useEffect } from "react";
import { MarketOverview } from "../types";
import { 
  Activity, 
  Radio, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Bell, 
  Calculator, 
  Briefcase, 
  Layers,
  Sparkles,
  Zap
} from "lucide-react";

interface TopBarProps {
  market: MarketOverview;
  isSimulatedLive: boolean;
  onToggleSimulatedFeed: () => void;
  onOpenRiskCalc: () => void;
  onOpenAlerts: () => void;
  onOpenPaperTrading: () => void;
  onOpenBrokerConnect: () => void;
  onOpenBacktest: () => void;
  onOpenIntelligence: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  market,
  isSimulatedLive,
  onToggleSimulatedFeed,
  onOpenRiskCalc,
  onOpenAlerts,
  onOpenPaperTrading,
  onOpenBrokerConnect,
  onOpenBacktest,
  onOpenIntelligence,
  currentTab,
  onSelectTab,
}) => {
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const str = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setIstTime(str);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#090b0e]/95 backdrop-blur-md border-b border-[#1b212f]">
      {/* Topmost Exchange & Feed Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-1.5 border-b border-[#141923] text-[11px] font-mono">
        <div className="flex items-center space-x-3">
          {/* Logo & Terminal Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              TS
            </div>
            <span className="font-bold text-white tracking-wider text-xs">TRADE<span className="text-emerald-400">SYNQ</span></span>
            <span className="text-zinc-500 text-[10px] hidden sm:inline">| MARKET INTELLIGENCE</span>
          </div>

          <div className="h-3 w-px bg-zinc-800"></div>

          {/* NSE / BSE Status */}
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-300 font-semibold">NSE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-semibold">BSE</span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/20 font-sans">
              MARKET {market.marketStatus}
            </span>
          </div>

          <div className="h-3 w-px bg-zinc-800 hidden md:block"></div>

          {/* IST Time */}
          <div className="hidden md:flex items-center space-x-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>IST: <span className="text-zinc-200 font-semibold">{istTime || market.istTime}</span></span>
          </div>
        </div>

        {/* Right side: Data Freshness, Demo/Live mode toggle & compliance warning */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Feed Latency / Freshness */}
          <button
            onClick={onToggleSimulatedFeed}
            title="Click to toggle simulation feed vs real-time connection mode"
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border text-[10px] transition-colors ${
              isSimulatedLive
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40"
                : "bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-900/40"
            }`}
          >
            <Radio className="w-3 h-3" />
            <span className="font-semibold">
              {isSimulatedLive ? "LIVE STREAM (120ms)" : "DEMO FEED (MOCK)"}
            </span>
          </button>

          {/* Quick Terminal Utility Modals */}
          <button
            onClick={onOpenRiskCalc}
            className="flex items-center space-x-1 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded text-zinc-300 hover:text-white transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Risk Calc</span>
          </button>

          <button
            onClick={onOpenPaperTrading}
            className="flex items-center space-x-1 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded text-zinc-300 hover:text-white transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Paper Trade</span>
          </button>

          <button
            onClick={onOpenAlerts}
            className="flex items-center space-x-1 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded text-zinc-300 hover:text-white transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Alerts</span>
          </button>

          <button
            onClick={onOpenBrokerConnect}
            className="flex items-center space-x-1 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded text-zinc-300 hover:text-white transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Broker API</span>
          </button>
        </div>
      </div>

      {/* Main Indices Ticker Strip */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 overflow-x-auto no-scrollbar space-x-4 bg-[#0c0f16]">
        {/* Indices Tickers */}
        <div className="flex items-center space-x-4 shrink-0 font-mono text-xs">
          {market.indices.map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div key={idx.symbol} className="flex items-center space-x-1.5 border-r border-[#1a202c] pr-4">
                <span className="text-zinc-400 font-semibold">{idx.symbol}</span>
                <span className="text-white font-bold">{idx.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                <span className={`flex items-center font-semibold text-[11px] ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPos ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                  {isPos ? "+" : ""}{idx.changePercent.toFixed(2)}%
                </span>
              </div>
            );
          })}

          {/* India VIX */}
          <div className="flex items-center space-x-1.5 border-r border-[#1a202c] pr-4">
            <span className="text-zinc-400 font-semibold">INDIA VIX</span>
            <span className="text-zinc-100 font-bold">{market.indiaVix.value.toFixed(2)}</span>
            <span className={`text-[11px] font-semibold ${market.indiaVix.change <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {market.indiaVix.change > 0 ? "+" : ""}{market.indiaVix.changePercent.toFixed(2)}%
            </span>
          </div>

          {/* Advance / Decline */}
          <div className="flex items-center space-x-1.5 border-r border-[#1a202c] pr-4">
            <span className="text-zinc-400 font-semibold">A / D:</span>
            <span className="text-emerald-400 font-bold">{market.advanceDecline.advances}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-rose-400 font-bold">{market.advanceDecline.declines}</span>
            <span className="text-zinc-400 text-[11px]">({market.advanceDecline.ratio.toFixed(2)})</span>
          </div>

          {/* Market Breadth */}
          <div className="flex items-center space-x-1.5">
            <span className="text-zinc-400 font-semibold">BREADTH:</span>
            <span className="text-emerald-400 font-bold">{market.regime.breadthPercent}%</span>
            <span className="text-zinc-500 text-[10px]">&gt;20 EMA</span>
          </div>
        </div>

        {/* Overall Regime Pill */}
        <div className="hidden lg:flex items-center space-x-2 shrink-0">
          <span className="text-zinc-400 text-xs">REGIME:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs tracking-wide uppercase">
            {market.regime.state} ({market.regime.score}/100)
          </span>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 border-t border-[#151b27] bg-[#0a0d13] text-xs">
        <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectTab("dashboard")}
            className={`px-3 py-1 rounded font-medium transition-all ${
              currentTab === "dashboard"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            Main Terminal
          </button>

          <button
            onClick={() => onSelectTab("aggressive")}
            className={`flex items-center space-x-1 px-3 py-1 rounded font-medium transition-all ${
              currentTab === "aggressive"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold"
                : "text-amber-400/80 hover:text-amber-300 hover:bg-zinc-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Aggressive Setups</span>
          </button>

          <button
            onClick={() => onSelectTab("no-trade")}
            className={`flex items-center space-x-1 px-3 py-1 rounded font-medium transition-all ${
              currentTab === "no-trade"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"
                : "text-rose-400/80 hover:text-rose-300 hover:bg-zinc-900"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>No-Trade Engine</span>
          </button>

          <button
            onClick={() => onSelectTab("intelligence")}
            className={`flex items-center space-x-1 px-3 py-1 rounded font-medium transition-all ${
              currentTab === "intelligence"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Market Intelligence</span>
          </button>

          <button
            onClick={() => onSelectTab("backtest")}
            className={`px-3 py-1 rounded font-medium transition-all ${
              currentTab === "backtest"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            Backtest Center
          </button>

          <button
            onClick={() => onSelectTab("journal")}
            className={`px-3 py-1 rounded font-medium transition-all ${
              currentTab === "journal"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            Signal Journal
          </button>
        </nav>

        {/* Philosophy micro-tag */}
        <div className="hidden md:flex items-center text-[11px] text-zinc-500 italic">
          “Find setups. Validate evidence. Manage risk.”
        </div>
      </div>
    </header>
  );
};
