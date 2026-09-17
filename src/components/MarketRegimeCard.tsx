import React from "react";
import { MarketOverview } from "../types";
import { TrendingUp, Activity, PieChart, ShieldCheck, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";

interface MarketRegimeCardProps {
  market: MarketOverview;
}

export const MarketRegimeCard: React.FC<MarketRegimeCardProps> = ({ market }) => {
  const { regime, sectors, fiiDiiActivity } = market;

  const getRegimeColor = (state: string) => {
    switch (state) {
      case "STRONG BULL":
        return {
          bg: "bg-emerald-950/30",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      case "BULL":
        return {
          bg: "bg-emerald-950/20",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
        };
      case "VOLATILE":
        return {
          bg: "bg-amber-950/20",
          border: "border-amber-500/30",
          text: "text-amber-400",
          badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
        };
      case "RANGE":
        return {
          bg: "bg-sky-950/20",
          border: "border-sky-500/30",
          text: "text-sky-400",
          badge: "bg-sky-500/15 text-sky-300 border-sky-500/25",
        };
      case "BEAR":
      case "STRONG BEAR":
        return {
          bg: "bg-rose-950/20",
          border: "border-rose-500/30",
          text: "text-rose-400",
          badge: "bg-rose-500/15 text-rose-300 border-rose-500/25",
        };
      default:
        return {
          bg: "bg-zinc-900",
          border: "border-zinc-800",
          text: "text-zinc-300",
          badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
        };
    }
  };

  const style = getRegimeColor(regime.state);

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-4 sm:p-5 relative overflow-hidden backdrop-blur-sm`}>
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* Left Column: Primary State & Score Gauge */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4 pr-0 lg:pr-4 lg:border-r border-[#1a2130]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h2 className="text-xs uppercase tracking-wider font-mono font-semibold text-zinc-400">
                Current Market Regime
              </h2>
            </div>
            <div className="mt-2 flex items-baseline space-x-3">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.text}`}>
                {regime.state}
              </span>
              <span className="font-mono text-sm text-zinc-400">
                Score: <span className="font-bold text-white">{regime.score}</span>/100
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed font-sans">
              {regime.summary}
            </p>
          </div>

          {/* Key Regime Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2130]/80">
            <div className="bg-[#0b0e14]/60 p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Market Breadth</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{regime.breadthPercent}%</span>
              <span className="text-[10px] text-zinc-500 block">&gt;20 EMA</span>
            </div>

            <div className="bg-[#0b0e14]/60 p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Momentum State</span>
              <span className="font-mono font-bold text-white text-sm">{regime.momentumState}</span>
              <span className="text-[10px] text-zinc-500 block">Index Thrust</span>
            </div>

            <div className="bg-[#0b0e14]/60 p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">India VIX Volatility</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{regime.volatilityState}</span>
              <span className="text-[10px] text-zinc-500 block">{market.indiaVix.value} (Cooling)</span>
            </div>

            <div className="bg-[#0b0e14]/60 p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Sector Alignment</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{regime.sectorParticipation}</span>
              <span className="text-[10px] text-zinc-500 block">Broad-based</span>
            </div>
          </div>
        </div>

        {/* Center Column: Sector Heatmap & Participation */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-300 font-semibold">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECTOR PARTICIPATION & ROTATION</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Auto & Realty Leading</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sectors.map((sec) => {
              const isGreen = sec.changePercent >= 0;
              return (
                <div
                  key={sec.name}
                  className={`p-2 rounded border transition-colors ${
                    isGreen
                      ? "bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40"
                      : "bg-rose-950/20 border-rose-500/20 hover:border-rose-500/40"
                  }`}
                >
                  <div className="text-[10px] font-mono text-zinc-400 truncate">{sec.name.replace("NIFTY ", "")}</div>
                  <div className={`font-mono font-bold text-xs mt-0.5 flex items-center ${isGreen ? "text-emerald-400" : "text-rose-400"}`}>
                    {isGreen ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {isGreen ? "+" : ""}{sec.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 mt-0.5">
                    Vol {sec.volumeMultiplier}x
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Institutional FII / DII Flows & Trading Directive */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-3 pl-0 lg:pl-4 lg:border-l border-[#1a2130]">
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
              FII / DII Institutional Flow
            </span>
            <div className="mt-2 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-400">FII Net Cash:</span>
                <span className="text-emerald-400 font-bold">+₹{fiiDiiActivity.fiiNetCrores.toLocaleString("en-IN")} Cr</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-400">DII Net Cash:</span>
                <span className="text-emerald-400 font-bold">+₹{fiiDiiActivity.diiNetCrores.toLocaleString("en-IN")} Cr</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-[#1a2130] pt-1">
                <span className="text-zinc-300 font-semibold">Combined Flow:</span>
                <span className="text-emerald-300 font-bold">+₹{fiiDiiActivity.totalNetCrores.toLocaleString("en-IN")} Cr</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b0e14] p-2.5 rounded border border-[#1a2130] text-[11px]">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TERMINAL DIRECTIVE</span>
            </div>
            <p className="mt-1 text-zinc-300 text-[11px] leading-tight">
              Regime favors high-confluence long breakouts in high-RVOL leaders. Avoid counter-trend shorts in leading sectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
