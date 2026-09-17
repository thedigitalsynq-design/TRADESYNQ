import React from "react";
import { MarketIntelligenceFeed, MacroIndicator, MarketOverview } from "../types";
import { 
  Sparkles, 
  Layers, 
  Globe, 
  Calendar, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Radio, 
  ExternalLink,
  Zap,
  ShieldCheck
} from "lucide-react";

interface IntelligencePanelProps {
  feed: MarketIntelligenceFeed[];
  macros: MacroIndicator[];
  market: MarketOverview;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  feed,
  macros,
  market,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-sky-950/25 border border-sky-500/30 rounded-xl p-4 sm:p-5">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 uppercase tracking-widest flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>MACRO & SECTOR ROTATION INTELLIGENCE</span>
          </span>
          <span className="text-zinc-400 text-xs font-mono">• SYNTHESIZED DECISION CONTEXT</span>
        </div>
        <h2 className="text-xl font-extrabold text-white mt-1.5">
          Macro Drivers, Institutional Flows & Earnings Catalyst Feed
        </h2>
        <p className="text-xs text-zinc-300 mt-1 max-w-3xl leading-relaxed font-sans">
          Technical setups do not exist in a vacuum. TradeSynq continuously monitors macro variables (Crude, US yields, Dollar Index, RBI policy) and institutional cash positions to validate market regime alignment.
        </p>
      </div>

      {/* Global Macro Variables Ticker */}
      <div>
        <div className="flex items-center space-x-2 mb-2.5">
          <Globe className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Key Global & Domestic Macro Variables
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {macros.map((m) => {
            const isGreen = m.impact === "POSITIVE";
            const isRed = m.impact === "NEGATIVE";
            return (
              <div
                key={m.name}
                className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b212f] font-mono text-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-zinc-400 truncate block">{m.name}</span>
                  <div className="text-base font-bold text-white mt-0.5">{m.value}</div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-[#161c28] flex items-center justify-between text-[10px]">
                  <span className={isGreen ? "text-emerald-400 font-semibold" : isRed ? "text-rose-400 font-semibold" : "text-zinc-400"}>
                    {m.change}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded ${
                    isGreen
                      ? "bg-emerald-500/15 text-emerald-400"
                      : isRed
                      ? "bg-rose-500/15 text-rose-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {m.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Sector Rotation Heatmap & Live Catalysts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Sector Rotation Matrix & Institutional Sentiment */}
        <div className="lg:col-span-6 space-y-4">
          {/* Institutional Sentiment Box */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b212f] space-y-3">
            <div className="flex items-center justify-between border-b border-[#18202d] pb-2 font-mono text-xs">
              <span className="font-bold text-zinc-200 uppercase flex items-center space-x-1.5">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Options Market Sentiment & PCR</span>
              </span>
              <span className="text-emerald-400 font-bold">BULLISH SKEW</span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
              <div className="bg-[#111622] p-2.5 rounded border border-[#1d2638]">
                <span className="text-[10px] text-zinc-500 block">NIFTY PCR (OI)</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">1.28</span>
                <span className="text-[9px] text-zinc-400">Put writing dominant</span>
              </div>

              <div className="bg-[#111622] p-2.5 rounded border border-[#1d2638]">
                <span className="text-[10px] text-zinc-500 block">BANK NIFTY PCR</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">1.19</span>
                <span className="text-[9px] text-zinc-400">Support holding</span>
              </div>

              <div className="bg-[#111622] p-2.5 rounded border border-[#1d2638]">
                <span className="text-[10px] text-zinc-500 block">MAX PAIN LEVEL</span>
                <span className="text-base font-bold text-white mt-0.5 block">24,800</span>
                <span className="text-[9px] text-zinc-400">Expiry Magnet</span>
              </div>
            </div>

            <div className="text-xs text-zinc-300 bg-[#101520] p-2.5 rounded border border-[#1b2434] leading-relaxed">
              <span className="text-emerald-400 font-bold font-mono text-[11px] block mb-0.5">SYNTHESIS:</span>
              Options data indicates heavy Put writing at 24,700 and 24,800 strikes, creating a firm structural demand floor. Calls at 25,000 are unwinding as momentum expands upward.
            </div>
          </div>

          {/* Sector Participation Matrix */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b212f]">
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="font-bold text-zinc-200 uppercase flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Sector Relative Strength & Rotation</span>
              </span>
              <span className="text-zinc-500 text-[11px]">Today vs 20D Moving Avg</span>
            </div>

            <div className="space-y-2">
              {market.sectors.map((sec) => {
                const isGreen = sec.changePercent >= 0;
                return (
                  <div
                    key={sec.name}
                    className="flex items-center justify-between p-2 rounded bg-[#101520] border border-[#1a2333] text-xs font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-zinc-200">{sec.name}</span>
                      <span className="text-[10px] text-zinc-500">RVOL {sec.volumeMultiplier}x</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-zinc-400 font-sans">
                        {sec.participatingStocks} / {sec.totalStocks} Stocks Aligned
                      </span>
                      <span className={`font-bold ${isGreen ? "text-emerald-400" : "text-rose-400"}`}>
                        {isGreen ? "+" : ""}{sec.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed of Catalysts, Earnings & Central Bank Policy */}
        <div className="lg:col-span-6">
          <div className="bg-[#0b0e14] rounded-xl border border-[#1b212f] overflow-hidden">
            <div className="p-3.5 border-b border-[#18202d] bg-[#0d121b] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-bold text-zinc-200 uppercase">Live Intelligence & Catalyst Feed</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Real-time Sentiment Filtered</span>
            </div>

            <div className="divide-y divide-[#151c27]">
              {feed.map((item) => (
                <div key={item.id} className="p-3.5 hover:bg-[#10141e] transition-colors font-mono">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        item.sentiment === "BULLISH"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : item.sentiment === "BEARISH"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}>
                        {item.sentiment}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase">{item.category}</span>
                      <span className="text-[10px] text-zinc-600">• {item.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {item.relatedSymbols.map((sym) => (
                        <span key={sym} className="text-[10px] bg-zinc-800 text-zinc-300 px-1 rounded">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5 font-sans leading-snug">
                    {item.headline}
                  </h4>

                  <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-2 text-[11px] text-sky-400 bg-sky-950/20 border border-sky-500/20 p-2 rounded">
                    <span className="font-bold uppercase text-[10px] block">Trading Setup Impact:</span>
                    {item.tradingImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
