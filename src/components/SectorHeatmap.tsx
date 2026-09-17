import React, { useState, useMemo } from "react";
import { SectorItem, StockSetup } from "../types";
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  BarChart3, 
  SlidersHorizontal, 
  LayoutGrid, 
  ChevronRight, 
  Building2, 
  Cpu, 
  Car, 
  Flame, 
  Hammer, 
  Building, 
  ShoppingBag, 
  Pill, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Zap,
  Gauge,
  HelpCircle
} from "lucide-react";

interface SectorHeatmapProps {
  sectors: SectorItem[];
  stocks: StockSetup[];
  onSelectStock: (stock: StockSetup) => void;
  selectedSectorFilter?: string;
  onSelectSectorFilter?: (sectorName: string | null) => void;
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({
  sectors,
  stocks,
  onSelectStock,
  selectedSectorFilter,
  onSelectSectorFilter,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "treemap">("grid");
  const [overlayMode, setOverlayMode] = useState<"performance" | "volatility">("performance");
  const [sortBy, setSortBy] = useState<"performance" | "rvol" | "weight" | "atr" | "beta" | "name">("performance");
  const [filterCategory, setFilterCategory] = useState<"ALL" | "LEADERS" | "LAGGARDS" | "HIGH_RVOL" | "HIGH_BETA" | "ATR_SPIKE" | "VOL_SQUEEZE">("ALL");
  const [inspectSector, setInspectSector] = useState<SectorItem | null>(null);
  const [showAtrInfo, setShowAtrInfo] = useState<boolean>(false);

  // Sector Icon Mapping
  const getSectorIcon = (sectorName: string) => {
    const s = sectorName.toUpperCase();
    if (s.includes("BANK")) return <Building2 className="w-4 h-4 text-emerald-400" />;
    if (s.includes("IT") || s.includes("TECH")) return <Cpu className="w-4 h-4 text-sky-400" />;
    if (s.includes("AUTO")) return <Car className="w-4 h-4 text-amber-400" />;
    if (s.includes("ENERGY") || s.includes("OIL")) return <Flame className="w-4 h-4 text-orange-400" />;
    if (s.includes("METAL") || s.includes("STEEL")) return <Hammer className="w-4 h-4 text-cyan-400" />;
    if (s.includes("REALTY") || s.includes("INFRA")) return <Building className="w-4 h-4 text-purple-400" />;
    if (s.includes("FMCG") || s.includes("CONSUM")) return <ShoppingBag className="w-4 h-4 text-pink-400" />;
    if (s.includes("PHARMA") || s.includes("HEALTH")) return <Pill className="w-4 h-4 text-teal-400" />;
    return <Layers className="w-4 h-4 text-zinc-400" />;
  };

  // Map Sector Name to StockSetup Sector
  const mapSectorNameToStockCategory = (secName: string): string => {
    const s = secName.toUpperCase();
    if (s.includes("BANK")) return "Banking";
    if (s.includes("IT")) return "IT";
    if (s.includes("AUTO")) return "Auto";
    if (s.includes("ENERGY")) return "Energy";
    if (s.includes("METAL")) return "Metal";
    if (s.includes("REALTY")) return "Realty";
    if (s.includes("FMCG")) return "FMCG";
    if (s.includes("PHARMA")) return "Pharma";
    return secName.replace("NIFTY ", "");
  };

  // Performance Color Gradients & Glows
  const getPerformanceStyling = (pct: number) => {
    if (pct >= 1.5) {
      return {
        bg: "bg-emerald-950/40 hover:bg-emerald-950/60",
        border: "border-emerald-500/40 hover:border-emerald-400/80",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        text: "text-emerald-400",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.12)]",
        gradientBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
        label: "STRONG BULLISH",
      };
    }
    if (pct >= 0.5) {
      return {
        bg: "bg-emerald-950/25 hover:bg-emerald-950/40",
        border: "border-emerald-500/25 hover:border-emerald-400/60",
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        text: "text-emerald-400",
        glow: "",
        gradientBar: "bg-emerald-500",
        label: "BULLISH",
      };
    }
    if (pct >= 0) {
      return {
        bg: "bg-[#0b1414] hover:bg-[#0f1d1d]",
        border: "border-emerald-500/20 hover:border-emerald-400/50",
        badge: "bg-emerald-500/10 text-emerald-400/90 border-emerald-500/20",
        text: "text-emerald-400",
        glow: "",
        gradientBar: "bg-emerald-600",
        label: "MILD GAIN",
      };
    }
    if (pct >= -0.5) {
      return {
        bg: "bg-[#140e11] hover:bg-[#1f141a]",
        border: "border-rose-500/20 hover:border-rose-400/50",
        badge: "bg-rose-500/10 text-rose-400/90 border-rose-500/20",
        text: "text-rose-400",
        glow: "",
        gradientBar: "bg-rose-600",
        label: "MILD DIP",
      };
    }
    return {
      bg: "bg-rose-950/35 hover:bg-rose-950/50",
      border: "border-rose-500/35 hover:border-rose-400/70",
      badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      text: "text-rose-400",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.12)]",
      gradientBar: "bg-gradient-to-r from-rose-500 to-red-500",
      label: "BEARISH",
    };
  };

  // Volatility / ATR Overlay Color Gradients & Glows
  const getVolatilityStyling = (sector: SectorItem) => {
    const relAtr = sector.relativeAtr ?? 1.0;
    const beta = sector.beta ?? 1.0;

    // High Beta & Spike (> 1.45x ATR relative to 20D average or beta >= 1.35)
    if (relAtr >= 1.45 || sector.volatilityState === "SPIKE") {
      return {
        bg: "bg-amber-950/40 hover:bg-amber-950/60",
        border: "border-amber-500/50 hover:border-amber-400/80",
        badge: "bg-amber-500/25 text-amber-300 border-amber-500/50",
        text: "text-amber-400",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.22)]",
        gradientBar: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500",
        label: "⚡ HIGH-BETA SURGE",
      };
    }

    // Elevated Volatility (1.20x - 1.45x ATR or beta >= 1.15)
    if (relAtr >= 1.20 || sector.volatilityState === "EXPANDING") {
      return {
        bg: "bg-amber-950/20 hover:bg-amber-950/35",
        border: "border-amber-500/30 hover:border-amber-400/60",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        text: "text-amber-300",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.10)]",
        gradientBar: "bg-gradient-to-r from-amber-400 to-amber-600",
        label: "ELEVATED ATR",
      };
    }

    // Normal / Baseline Volatility (0.90x - 1.20x ATR)
    if (relAtr >= 0.90 || sector.volatilityState === "NORMAL") {
      return {
        bg: "bg-[#0c141d] hover:bg-[#101b27]",
        border: "border-cyan-500/25 hover:border-cyan-400/50",
        badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        text: "text-cyan-400",
        glow: "",
        gradientBar: "bg-cyan-500",
        label: "BASELINE VOL",
      };
    }

    // Compressed Volatility / Squeeze (< 0.90x ATR or Low Beta Defensive)
    return {
      bg: "bg-purple-950/25 hover:bg-purple-950/40",
      border: "border-purple-500/30 hover:border-purple-400/60",
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      text: "text-purple-300",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      gradientBar: "bg-gradient-to-r from-purple-500 to-indigo-500",
      label: "VOL SQUEEZE",
    };
  };

  // Get active styling based on current overlay mode
  const getStyling = (sector: SectorItem) => {
    if (overlayMode === "volatility") {
      return getVolatilityStyling(sector);
    }
    return getPerformanceStyling(sector.changePercent);
  };

  // Filtered & Sorted Sectors
  const processedSectors = useMemo(() => {
    return [...sectors]
      .filter((s) => {
        if (filterCategory === "LEADERS") return s.changePercent > 0;
        if (filterCategory === "LAGGARDS") return s.changePercent < 0;
        if (filterCategory === "HIGH_RVOL") return s.volumeMultiplier >= 1.4;
        if (filterCategory === "HIGH_BETA") return (s.beta ?? 1.0) >= 1.2;
        if (filterCategory === "ATR_SPIKE") return (s.relativeAtr ?? 1.0) >= 1.4;
        if (filterCategory === "VOL_SQUEEZE") return (s.relativeAtr ?? 1.0) < 0.9;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "performance") return b.changePercent - a.changePercent;
        if (sortBy === "rvol") return b.volumeMultiplier - a.volumeMultiplier;
        if (sortBy === "weight") return b.weight - a.weight;
        if (sortBy === "atr") return (b.relativeAtr ?? 1.0) - (a.relativeAtr ?? 1.0);
        if (sortBy === "beta") return (b.beta ?? 1.0) - (a.beta ?? 1.0);
        return a.name.localeCompare(b.name);
      });
  }, [sectors, filterCategory, sortBy]);

  // Aggregate Market Stats
  const topGainer = useMemo(() => {
    return [...sectors].sort((a, b) => b.changePercent - a.changePercent)[0];
  }, [sectors]);

  const topRvol = useMemo(() => {
    return [...sectors].sort((a, b) => b.volumeMultiplier - a.volumeMultiplier)[0];
  }, [sectors]);

  const highestAtrSector = useMemo(() => {
    return [...sectors].sort((a, b) => (b.relativeAtr ?? 1.0) - (a.relativeAtr ?? 1.0))[0];
  }, [sectors]);

  const highestBetaSector = useMemo(() => {
    return [...sectors].sort((a, b) => (b.beta ?? 1.0) - (a.beta ?? 1.0))[0];
  }, [sectors]);

  const advanceCount = sectors.filter((s) => s.changePercent >= 0).length;
  const declineCount = sectors.filter((s) => s.changePercent < 0).length;

  return (
    <section id="sector-heatmap-section" className="bg-[#0b0e14] rounded-xl border border-[#1a2130] p-4 sm:p-5 space-y-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#1a2130]">
        <div>
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded border transition-colors ${
              overlayMode === "volatility" 
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
              {overlayMode === "volatility" ? <Zap className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </div>
            <h2 className="text-sm font-bold font-mono text-white tracking-wide uppercase flex items-center gap-2">
              {overlayMode === "volatility" ? "Sector Volatility & High-Beta Radar" : "Sector Performance Heatmap"}
              <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full border ${
                overlayMode === "volatility"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
              }`}>
                {overlayMode === "volatility" ? "ATR Relative Overlay Active" : "NSE Live Radar"}
              </span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {overlayMode === "volatility" 
              ? "Grid cells graded by ATR relative to 20-day baseline • Pinpoints high-beta momentum leaders and volatility squeezes"
              : `Real-time capital flows & relative strength across major Nifty sectoral indices (${advanceCount} Advancing / ${declineCount} Declining)`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Filter Clear Tag */}
          {selectedSectorFilter && (
            <button
              onClick={() => onSelectSectorFilter && onSelectSectorFilter(null)}
              className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1 hover:bg-emerald-500/30 transition-colors"
            >
              <span>Filtered: {selectedSectorFilter}</span>
              <span className="text-zinc-400 hover:text-white font-bold ml-1">✕</span>
            </button>
          )}

          {/* OVERLAY MODE TOGGLE (Performance vs Volatility ATR) */}
          <div className="flex items-center bg-[#070a0e] p-0.5 rounded-lg border border-[#1a2130] text-xs font-mono">
            <button
              onClick={() => {
                setOverlayMode("performance");
                if (sortBy === "atr" || sortBy === "beta") setSortBy("performance");
              }}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                overlayMode === "performance"
                  ? "bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>% Return</span>
            </button>
            <button
              onClick={() => {
                setOverlayMode("volatility");
                setSortBy("atr");
              }}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                overlayMode === "volatility"
                  ? "bg-amber-950/70 text-amber-300 border border-amber-500/40 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "text-zinc-400 hover:text-amber-400"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Volatility Overlay (ATR)</span>
            </button>
          </div>

          {/* Info Button for ATR Mode */}
          <button
            onClick={() => setShowAtrInfo(!showAtrInfo)}
            title="What is ATR Relative Volatility?"
            className={`p-1.5 rounded-lg border transition-colors ${
              showAtrInfo ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-[#070a0e] border-[#1a2130] text-zinc-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Filter Chips */}
          <div className="flex items-center bg-[#070a0e] p-0.5 rounded-lg border border-[#1a2130] text-[11px] font-mono">
            <button
              onClick={() => setFilterCategory("ALL")}
              className={`px-2 py-1 rounded transition-colors ${filterCategory === "ALL" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              All ({sectors.length})
            </button>

            {overlayMode === "performance" ? (
              <>
                <button
                  onClick={() => setFilterCategory("LEADERS")}
                  className={`px-2 py-1 rounded transition-colors ${filterCategory === "LEADERS" ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold" : "text-zinc-400 hover:text-emerald-400"}`}
                >
                  Leaders ({advanceCount})
                </button>
                <button
                  onClick={() => setFilterCategory("LAGGARDS")}
                  className={`px-2 py-1 rounded transition-colors ${filterCategory === "LAGGARDS" ? "bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold" : "text-zinc-400 hover:text-rose-400"}`}
                >
                  Laggards ({declineCount})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setFilterCategory("ATR_SPIKE")}
                  className={`px-2 py-1 rounded transition-colors ${filterCategory === "ATR_SPIKE" ? "bg-amber-950/60 text-amber-300 border border-amber-500/40 font-semibold" : "text-zinc-400 hover:text-amber-400"}`}
                >
                  ATR Spike (&gt;1.4x)
                </button>
                <button
                  onClick={() => setFilterCategory("HIGH_BETA")}
                  className={`px-2 py-1 rounded transition-colors ${filterCategory === "HIGH_BETA" ? "bg-orange-950/60 text-orange-300 border border-orange-500/40 font-semibold" : "text-zinc-400 hover:text-orange-400"}`}
                >
                  High Beta (&gt;1.2)
                </button>
                <button
                  onClick={() => setFilterCategory("VOL_SQUEEZE")}
                  className={`px-2 py-1 rounded transition-colors ${filterCategory === "VOL_SQUEEZE" ? "bg-purple-950/60 text-purple-300 border border-purple-500/30 font-semibold" : "text-zinc-400 hover:text-purple-400"}`}
                >
                  Squeeze (&lt;0.9x)
                </button>
              </>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1 bg-[#070a0e] px-2 py-1 rounded-lg border border-[#1a2130] text-xs font-mono text-zinc-300">
            <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[11px] font-mono text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="performance" className="bg-zinc-900 text-white">Sort: Performance %</option>
              <option value="atr" className="bg-zinc-900 text-white">Sort: ATR Expansion Multiplier</option>
              <option value="beta" className="bg-zinc-900 text-white">Sort: High Beta to Low Beta</option>
              <option value="rvol" className="bg-zinc-900 text-white">Sort: Volume RVOL</option>
              <option value="weight" className="bg-zinc-900 text-white">Sort: Index Weight</option>
              <option value="name" className="bg-zinc-900 text-white">Sort: Alphabetical</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#070a0e] p-0.5 rounded-lg border border-[#1a2130]">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid Card View"
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("treemap")}
              title="Proportional Treemap View"
              className={`p-1.5 rounded transition-colors ${viewMode === "treemap" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Educational Banner for ATR Volatility Overlay */}
      {showAtrInfo && (
        <div className="bg-[#0f1420] border border-amber-500/30 rounded-lg p-3 text-xs font-mono text-zinc-300 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Understanding ATR Relative Volatility &amp; High-Beta Filtering
            </span>
            <button onClick={() => setShowAtrInfo(false)} className="text-zinc-400 hover:text-white">✕</button>
          </div>
          <p className="font-sans text-[11px] text-zinc-300 leading-relaxed">
            <strong>Average True Range (ATR)</strong> measures market volatility by decomposing the entire range of an asset for that period. In the <strong>Volatility Overlay Mode</strong>, grid cells are color-graded based on current ATR relative to each sector’s 20-day historical average:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
            <div className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300">
              <div className="font-bold flex items-center gap-1">🟠 &gt; 1.45x ATR (Surge)</div>
              <p className="mt-0.5 text-zinc-400">High-beta sectors (e.g., Auto, Realty) with wide ranges. Demands wider ATR-based stop losses.</p>
            </div>
            <div className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-amber-200">
              <div className="font-bold flex items-center gap-1">🟡 1.20x - 1.45x ATR</div>
              <p className="mt-0.5 text-zinc-400">Elevated volatility. Momentum breakout continuation setups perform best here.</p>
            </div>
            <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-300">
              <div className="font-bold flex items-center gap-1">🔵 0.90x - 1.20x ATR</div>
              <p className="mt-0.5 text-zinc-400">Standard baseline trading range with steady order flow and predictable liquidity.</p>
            </div>
            <div className="p-2 rounded bg-purple-950/30 border border-purple-500/30 text-purple-300">
              <div className="font-bold flex items-center gap-1">🟣 &lt; 0.90x ATR (Squeeze)</div>
              <p className="mt-0.5 text-zinc-400">Low-beta or coiled defensive sectors (e.g., FMCG, Pharma). High potential for explosive volatility breakout.</p>
            </div>
          </div>
        </div>
      )}

      {/* Mini Breadth Strip / Volatility Radar Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-[#070a0e] px-3.5 py-2 rounded-lg border border-[#141b25]">
        <div className="flex flex-wrap items-center gap-4">
          {overlayMode === "volatility" ? (
            <>
              <div className="flex items-center space-x-1.5">
                <span className="text-zinc-500 text-[11px] uppercase">Peak Volatility (ATR):</span>
                {highestAtrSector && (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {highestAtrSector.name.replace("NIFTY ", "")} ({highestAtrSector.relativeAtr}x Avg • {highestAtrSector.atrPercent}%)
                  </span>
                )}
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 border-l border-[#1a2130] pl-4">
                <span className="text-zinc-500 text-[11px] uppercase">Highest Beta:</span>
                {highestBetaSector && (
                  <span className="text-orange-400 font-bold">
                    {highestBetaSector.name.replace("NIFTY ", "")} (Beta {highestBetaSector.beta})
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1.5">
                <span className="text-zinc-500 text-[11px] uppercase">Top Sector:</span>
                {topGainer && (
                  <span className="text-emerald-400 font-bold flex items-center">
                    {topGainer.name.replace("NIFTY ", "")} (+{topGainer.changePercent.toFixed(2)}%)
                  </span>
                )}
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 border-l border-[#1a2130] pl-4">
                <span className="text-zinc-500 text-[11px] uppercase">Volume Leader:</span>
                {topRvol && (
                  <span className="text-sky-400 font-bold">
                    {topRvol.name.replace("NIFTY ", "")} ({topRvol.volumeMultiplier}x RVOL)
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Dynamic Visual Indicator */}
        {overlayMode === "volatility" ? (
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-purple-400">Coiled</span>
            <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="bg-purple-500 w-1/4 h-full" />
              <div className="bg-cyan-500 w-1/4 h-full" />
              <div className="bg-amber-400 w-1/4 h-full" />
              <div className="bg-orange-500 w-1/4 h-full" />
            </div>
            <span className="text-amber-400 font-bold">Surging</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-[11px] text-emerald-400 font-semibold">{advanceCount} Adv</span>
            <div className="flex-1 sm:w-32 h-1.5 bg-rose-500/40 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${(advanceCount / (sectors.length || 1)) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">{declineCount} Dec</span>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {processedSectors.map((sector) => {
            const isGreen = sector.changePercent >= 0;
            const style = getStyling(sector);
            const stockCategory = mapSectorNameToStockCategory(sector.name);
            const isSelectedFilter = selectedSectorFilter === stockCategory || selectedSectorFilter === sector.name;
            const relAtr = sector.relativeAtr ?? 1.0;
            const beta = sector.beta ?? 1.0;

            // Find matching stocks from database
            const sectorStocks = stocks.filter(
              (s) => s.sector.toLowerCase() === stockCategory.toLowerCase() || 
                    (sector.name.includes("BANK") && s.isBankNifty)
            );

            return (
              <div
                key={sector.name}
                id={`sector-card-${sector.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`rounded-xl border p-3.5 transition-all duration-200 relative group flex flex-col justify-between ${style.bg} ${style.border} ${style.glow} ${
                  isSelectedFilter ? "ring-2 ring-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : ""
                }`}
              >
                {/* Card Top Row: Icon, Name & Nifty Weight */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                        {getSectorIcon(sector.name)}
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-xs text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                          {sector.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 mt-0.5">
                          {sector.indexPoints && (
                            <span className="text-zinc-300">{sector.indexPoints.toLocaleString("en-IN")} pts</span>
                          )}
                          <span>•</span>
                          <span>Wt: {sector.weight}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Tag / Status Badge */}
                    {overlayMode === "volatility" ? (
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${style.badge}`}>
                        {style.label}
                      </span>
                    ) : (
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                        sector.trend === "BULLISH" 
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                          : sector.trend === "BEARISH"
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}>
                        {sector.trend}
                      </span>
                    )}
                  </div>

                  {/* Primary Metric: Changes according to Overlay Mode */}
                  {overlayMode === "volatility" ? (
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Relative ATR vs 20D Avg</span>
                          <div className="flex items-baseline space-x-1.5">
                            <span className={`text-2xl font-mono font-extrabold tracking-tight ${style.text}`}>
                              {relAtr.toFixed(2)}x
                            </span>
                            <span className="text-xs font-mono text-zinc-300">
                              ({sector.atrPercent ?? 1.5}% ATR)
                            </span>
                          </div>
                        </div>

                        {/* Beta Indicator */}
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-zinc-400 block">Beta vs N50</span>
                          <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                            beta >= 1.3 
                              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" 
                              : beta >= 1.0 
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}>
                            {beta.toFixed(2)} {beta >= 1.2 ? "High Beta" : beta < 0.8 ? "Defensive" : "Normal"}
                          </span>
                        </div>
                      </div>

                      {/* Volatility Expansion Gauge */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>Vol Expansion: {Math.round((relAtr - 1) * 100) > 0 ? `+${Math.round((relAtr - 1) * 100)}%` : `${Math.round((relAtr - 1) * 100)}%`}</span>
                          <span>LTP Change: {isGreen ? "+" : ""}{sector.changePercent.toFixed(2)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
                          {/* 1.0x Baseline Marker */}
                          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 z-10" title="1.0x Baseline Average" />
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${style.gradientBar}`}
                            style={{
                              width: `${Math.min(100, Math.max(15, (relAtr / 2.0) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Performance Mode View */
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline space-x-1.5">
                          <span className={`text-2xl font-mono font-extrabold tracking-tight ${style.text}`}>
                            {isGreen ? "+" : ""}{sector.changePercent.toFixed(2)}%
                          </span>
                          {isGreen ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-400 inline" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-rose-400 inline" />
                          )}
                        </div>

                        {/* RVOL Multiplier */}
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-zinc-400 block">RVOL</span>
                          <span className={`text-xs font-mono font-bold ${sector.volumeMultiplier >= 1.5 ? "text-cyan-400" : "text-zinc-300"}`}>
                            {sector.volumeMultiplier}x
                          </span>
                        </div>
                      </div>

                      {/* Participating Stocks Breadth Bar */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>Breadth: {sector.participatingStocks || 8} / {sector.totalStocks || 12} Pos</span>
                          <span>
                            {Math.round(((sector.participatingStocks || 8) / (sector.totalStocks || 12)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${style.gradientBar}`}
                            style={{
                              width: `${Math.min(100, Math.max(10, ((sector.participatingStocks || 8) / (sector.totalStocks || 12)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Movers / Constituents Preview */}
                  {sector.topMovers && sector.topMovers.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono uppercase text-zinc-400 block">Key Constituents:</span>
                        {overlayMode === "volatility" && (
                          <span className="text-[9px] font-mono text-zinc-500">ATR: {sector.atrPoints ?? "—"} pts</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sector.topMovers.map((mover, idx) => {
                          const parts = mover.split(" ");
                          const symbol = parts[0];
                          const change = parts[1] || "";
                          const matchedStock = stocks.find((s) => s.symbol === symbol);

                          return (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (matchedStock) {
                                  onSelectStock(matchedStock);
                                }
                              }}
                              title={matchedStock ? `Click to inspect ${symbol} setup and volatility parameters` : symbol}
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-all flex items-center gap-1 ${
                                change.includes("+")
                                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/20 hover:border-emerald-400/60 hover:bg-emerald-900/40"
                                  : "bg-rose-950/40 text-rose-300 border-rose-500/20 hover:border-rose-400/60 hover:bg-rose-900/40"
                              }`}
                            >
                              <span className="font-semibold">{symbol}</span>
                              <span className="opacity-80">{change}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Quick Action Links */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectSectorFilter) {
                        onSelectSectorFilter(isSelectedFilter ? null : stockCategory);
                      }
                    }}
                    className={`text-[10px] font-mono flex items-center gap-1 transition-colors ${
                      isSelectedFilter ? "text-emerald-300 font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{isSelectedFilter ? "✓ Filter Active" : "Filter Watchlist"}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setInspectSector(sector)}
                    className="text-[10px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Analysis</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: PROPORTIONAL TREEMAP */}
      {viewMode === "treemap" && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex justify-between items-center px-1">
            <span>
              {overlayMode === "volatility"
                ? "Tile Area Proportional to Index Weight • Color Graded by ATR Relative Volatility Expansion"
                : "Tile Area Proportional to Index Weight • Color Graded by Real-Time % Change"}
            </span>
            <span className="text-[10px] text-zinc-400">Click any sector tile to inspect constituents</span>
          </div>

          <div className="grid grid-cols-12 gap-2 min-h-[300px] w-full">
            {processedSectors.map((sector) => {
              const isGreen = sector.changePercent >= 0;
              const style = getStyling(sector);
              const stockCategory = mapSectorNameToStockCategory(sector.name);
              const isSelectedFilter = selectedSectorFilter === stockCategory;
              const relAtr = sector.relativeAtr ?? 1.0;

              // Compute column span based on sector weight
              let colSpanClass = "col-span-12 sm:col-span-6 md:col-span-3";
              if (sector.weight >= 25) colSpanClass = "col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-4";
              else if (sector.weight >= 12) colSpanClass = "col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3";
              else if (sector.weight >= 6) colSpanClass = "col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2";
              else colSpanClass = "col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2";

              return (
                <div
                  key={sector.name}
                  onClick={() => setInspectSector(sector)}
                  className={`${colSpanClass} rounded-xl border p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between ${style.bg} ${style.border} ${style.glow} hover:scale-[1.01] ${
                    isSelectedFilter ? "ring-2 ring-emerald-400" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        {getSectorIcon(sector.name)}
                        <span className="font-mono font-bold text-xs text-white truncate max-w-[140px]">
                          {sector.name.replace("NIFTY ", "")}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                        Weight: {sector.weight}% • Beta {sector.beta ?? 1.0}
                      </span>
                    </div>

                    <div className="text-right">
                      {overlayMode === "volatility" ? (
                        <div>
                          <span className={`text-base font-mono font-extrabold ${style.text}`}>
                            {relAtr.toFixed(2)}x ATR
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 block">
                            {isGreen ? "+" : ""}{sector.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <span className={`text-base font-mono font-extrabold ${style.text}`}>
                          {isGreen ? "+" : ""}{sector.changePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-zinc-400">RVOL {sector.volumeMultiplier}x</span>
                    <span className={overlayMode === "volatility" ? style.text : sector.trend === "BULLISH" ? "text-emerald-400" : "text-rose-400"}>
                      {overlayMode === "volatility" ? (style as any).label : sector.trend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: SECTOR CONSTITUENTS & VOLATILITY DEEP DIVE */}
      {inspectSector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0b0e14] border border-[#1a2130] rounded-xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1a2130]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  {getSectorIcon(inspectSector.name)}
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                    {inspectSector.name}
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      inspectSector.changePercent >= 0 
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}>
                      {inspectSector.changePercent >= 0 ? "+" : ""}{inspectSector.changePercent.toFixed(2)}%
                    </span>
                  </h3>
                  <div className="text-xs font-mono text-zinc-400 mt-0.5">
                    Weight: {inspectSector.weight}% • RVOL: {inspectSector.volumeMultiplier}x • Trend: {inspectSector.trend}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectSector(null)}
                className="p-1 rounded-lg bg-[#141b25] text-zinc-400 hover:text-white transition-colors text-sm font-mono px-2.5"
              >
                ✕ Close
              </button>
            </div>

            {/* Volatility & Beta Parameters Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="bg-[#070a0e] p-2.5 rounded-lg border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">Relative ATR</span>
                <span className="text-base font-bold text-amber-400 block mt-0.5">
                  {inspectSector.relativeAtr ?? 1.0}x
                </span>
                <span className="text-[10px] text-zinc-400">vs 20D Avg Vol</span>
              </div>

              <div className="bg-[#070a0e] p-2.5 rounded-lg border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">ATR Points Range</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {inspectSector.atrPoints ? `${inspectSector.atrPoints} pts` : "—"}
                </span>
                <span className="text-[10px] text-zinc-400">{inspectSector.atrPercent ?? "—"}% daily span</span>
              </div>

              <div className="bg-[#070a0e] p-2.5 rounded-lg border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">Beta vs Nifty 50</span>
                <span className={`text-base font-bold block mt-0.5 ${
                  (inspectSector.beta ?? 1.0) >= 1.2 ? "text-orange-400" : "text-cyan-400"
                }`}>
                  {inspectSector.beta ?? 1.0}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {(inspectSector.beta ?? 1.0) >= 1.2 ? "High Beta Leader" : "Defensive Beta"}
                </span>
              </div>

              <div className="bg-[#070a0e] p-2.5 rounded-lg border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">Volatility State</span>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  {inspectSector.volatilityState ?? "NORMAL"}
                </span>
                <span className="text-[10px] text-zinc-400">Trailing Stop: 1.5x ATR</span>
              </div>
            </div>

            {/* Sector Volatility Summary Insight */}
            <div className="bg-[#070a0e] p-3 rounded-lg border border-[#1a2130] text-xs font-sans text-zinc-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                {inspectSector.name} is registering an ATR expansion factor of <strong className="text-white">{inspectSector.relativeAtr ?? 1.0}x</strong> relative to its 20-day baseline with a Beta of <strong className="text-white">{inspectSector.beta ?? 1.0}</strong>. During market turbulence, {(inspectSector.beta ?? 1.0) >= 1.2 ? "expect amplified price swings suitable for high-momentum ORB and breakout setups with wider stop-loss buffers." : "this defensive sector tends to exhibit range-containment and lower drawdown vulnerability."}
              </p>
            </div>

            {/* Constituents Table */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">
                  Tracked Equities in {inspectSector.name}
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">
                  Click any stock to inspect trade setup
                </span>
              </div>

              {(() => {
                const category = mapSectorNameToStockCategory(inspectSector.name);
                const matchingStocks = stocks.filter(
                  (s) => s.sector.toLowerCase() === category.toLowerCase() || 
                        (inspectSector.name.includes("BANK") && s.isBankNifty)
                );

                if (matchingStocks.length === 0) {
                  return (
                    <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-center text-xs font-mono text-zinc-400">
                      Additional constituents being indexed by the quantitative streaming engine.
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-[#141b25] border border-[#141b25] rounded-lg overflow-hidden font-mono text-xs">
                    {matchingStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          onSelectStock(stock);
                          setInspectSector(null);
                        }}
                        className="p-3 bg-[#070a0e] hover:bg-[#0d121a] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm">{stock.symbol}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                stock.setup === "LONG SETUP" 
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : stock.setup === "SHORT SETUP"
                                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
                              }`}>
                                {stock.setup}
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-400">{stock.name} • ATR ₹{stock.atr.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-right">
                          <div>
                            <div className="font-bold text-white">₹{stock.ltp.toFixed(2)}</div>
                            <div className={`text-[11px] ${stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                            </div>
                          </div>

                          <div className="hidden sm:block">
                            <div className="text-[10px] text-zinc-500">Confluence</div>
                            <div className="font-bold text-emerald-400">{stock.confluenceScore}/100</div>
                          </div>

                          <button className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  if (onSelectSectorFilter) {
                    onSelectSectorFilter(mapSectorNameToStockCategory(inspectSector.name));
                  }
                  setInspectSector(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Filter Dashboard Table for {inspectSector.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setInspectSector(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
