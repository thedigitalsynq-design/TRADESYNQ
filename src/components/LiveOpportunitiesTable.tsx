import React, { useState, useMemo, useEffect } from "react";
import { StockSetup } from "../types";
import { 
  ArrowUpDown, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Filter, 
  Eye, 
  Calculator,
  ChevronRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal
} from "lucide-react";

interface LiveOpportunitiesTableProps {
  stocks: StockSetup[];
  onSelectStock: (stock: StockSetup) => void;
  onOpenRiskCalcForStock: (stock: StockSetup) => void;
  activeSectorFilter?: string | null;
  onClearSectorFilter?: () => void;
}

export const LiveOpportunitiesTable: React.FC<LiveOpportunitiesTableProps> = ({
  stocks,
  onSelectStock,
  onOpenRiskCalcForStock,
  activeSectorFilter,
  onClearSectorFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCap, setSelectedCap] = useState<string>("ALL");
  const [selectedSector, setSelectedSector] = useState<string>(activeSectorFilter || "ALL");
  const [selectedHorizon, setSelectedHorizon] = useState<string>("ALL");
  const [selectedSetupType, setSelectedSetupType] = useState<string>("ALL");
  const [onlyHighConfluence, setOnlyHighConfluence] = useState(false);

  useEffect(() => {
    if (activeSectorFilter) {
      setSelectedSector(activeSectorFilter);
    }
  }, [activeSectorFilter]);
  
  // Sort State
  const [sortBy, setSortBy] = useState<"confluence" | "riskReward" | "volume" | "momentum">("confluence");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filtered & Sorted Stocks
  const filteredStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        // Search
        if (
          searchQuery &&
          !s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !s.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Cap Category
        if (selectedCap === "NIFTY50" && !s.isNifty50) return false;
        if (selectedCap === "BANKNIFTY" && !s.isBankNifty) return false;
        if (selectedCap !== "ALL" && selectedCap !== "NIFTY50" && selectedCap !== "BANKNIFTY" && s.capCategory !== selectedCap) {
          return false;
        }

        // Sector
        if (selectedSector !== "ALL" && s.sector !== selectedSector) {
          return false;
        }

        // Horizon
        if (selectedHorizon !== "ALL" && s.timeframeHorizon !== selectedHorizon) {
          return false;
        }

        // Setup Type
        if (selectedSetupType !== "ALL") {
          if (selectedSetupType === "BREAKOUT" && !s.setupType.includes("Breakout") && s.setupType !== "ORB") return false;
          if (selectedSetupType === "MOMENTUM" && !s.setupType.includes("Momentum") && s.setupType !== "Volume Explosion") return false;
          if (selectedSetupType === "REVERSAL" && s.setupType !== "Mean Reversion" && s.setupType !== "Pullback Continuation") return false;
        }

        // High Confluence
        if (onlyHighConfluence && s.confluenceScore < 70) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === "confluence") diff = a.confluenceScore - b.confluenceScore;
        else if (sortBy === "riskReward") diff = a.riskRewardRatio - b.riskRewardRatio;
        else if (sortBy === "volume") diff = a.relativeVolume - b.relativeVolume;
        else if (sortBy === "momentum") diff = a.rsi - b.rsi;
        return sortOrder === "desc" ? -diff : diff;
      });
  }, [stocks, searchQuery, selectedCap, selectedSector, selectedHorizon, selectedSetupType, onlyHighConfluence, sortBy, sortOrder]);

  const toggleSort = (column: "confluence" | "riskReward" | "volume" | "momentum") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getConfluenceBadge = (score: number, grade: string) => {
    if (score >= 90) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          {score} • EXTREME
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {score} • HIGH
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
          {score} • STRONG
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
          {score} • DEVELOPING
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {score} • WEAK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        {score} • NO TRADE
      </span>
    );
  };

  const getSetupBadge = (setup: string) => {
    if (setup === "LONG SETUP") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <TrendingUp className="w-3 h-3" />
          <span>LONG</span>
        </span>
      );
    }
    if (setup === "SHORT SETUP") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <TrendingDown className="w-3 h-3" />
          <span>SHORT</span>
        </span>
      );
    }
    if (setup === "WAIT") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertCircle className="w-3 h-3" />
          <span>WAIT</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
        <XCircle className="w-3 h-3" />
        <span>NO TRADE</span>
      </span>
    );
  };

  // Get unique sectors from stocks
  const availableSectors = useMemo(() => {
    const set = new Set<string>();
    stocks.forEach((s) => set.add(s.sector));
    return Array.from(set);
  }, [stocks]);

  return (
    <div className="bg-[#0b0e14] rounded-xl border border-[#1b212f] overflow-hidden flex flex-col">
      {/* Table Header & Controls Bar */}
      <div className="p-3 sm:p-4 border-b border-[#18202d] bg-[#0c1017] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-100">
                Live Market Opportunities Radar
              </h2>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded">
                {filteredStocks.length} SETUPS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Continuously analyzed across 5 independent technical confirmation systems.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111622] border border-[#1e2637] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 font-mono"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Market Cap / Index */}
          <div className="flex items-center space-x-1 bg-[#10141e] p-0.5 rounded-lg border border-[#1d2536]">
            {["ALL", "NIFTY50", "BANKNIFTY", "Large Cap", "Mid Cap"].map((cap) => (
              <button
                key={cap}
                onClick={() => setSelectedCap(cap)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  selectedCap === cap
                    ? "bg-zinc-700 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cap}
              </button>
            ))}
          </div>

          {/* Sector Filter */}
          <div className="flex items-center space-x-1">
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                if (e.target.value === "ALL" && onClearSectorFilter) {
                  onClearSectorFilter();
                }
              }}
              className="bg-[#10141e] border border-[#1d2536] text-zinc-300 text-[11px] font-mono rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500/60"
            >
              <option value="ALL">All Sectors</option>
              {availableSectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            {selectedSector !== "ALL" && (
              <button
                onClick={() => {
                  setSelectedSector("ALL");
                  if (onClearSectorFilter) onClearSectorFilter();
                }}
                className="px-1.5 py-1 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white"
                title="Clear sector filter"
              >
                ✕
              </button>
            )}
          </div>

          {/* Strategy Type Filter */}
          <select
            value={selectedSetupType}
            onChange={(e) => setSelectedSetupType(e.target.value)}
            className="bg-[#10141e] border border-[#1d2536] text-zinc-300 text-[11px] font-mono rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500/60"
          >
            <option value="ALL">All Strategies</option>
            <option value="BREAKOUT">Breakout / ORB</option>
            <option value="MOMENTUM">Momentum / VWAP</option>
            <option value="REVERSAL">Pullback / Mean Reversion</option>
          </select>

          {/* High Confluence Toggle */}
          <button
            onClick={() => setOnlyHighConfluence(!onlyHighConfluence)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
              onlyHighConfluence
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold"
                : "bg-[#10141e] text-zinc-400 border-[#1d2536] hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>High Confluence Only (70+)</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#18202d] bg-[#090d13] text-[11px] font-mono uppercase text-zinc-400">
              <th className="py-2.5 px-3 font-semibold">Symbol</th>
              <th className="py-2.5 px-3 font-semibold">Setup</th>
              <th
                onClick={() => toggleSort("confluence")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-zinc-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Confluence</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">LTP (₹)</th>
              <th className="py-2.5 px-3 font-semibold">Entry Zone</th>
              <th className="py-2.5 px-3 font-semibold">Stop Loss</th>
              <th className="py-2.5 px-3 font-semibold">Target 1 / 2</th>
              <th
                onClick={() => toggleSort("riskReward")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-zinc-200"
              >
                <div className="flex items-center space-x-1">
                  <span>R : R</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("volume")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-zinc-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Volume / RVOL</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">5-Factor Check</th>
              <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141a24] text-xs font-mono">
            {filteredStocks.map((stock) => {
              const isGreen = stock.change >= 0;
              const isNoTrade = stock.setup === "NO TRADE";

              return (
                <tr
                  key={stock.symbol}
                  className={`hover:bg-[#121722] transition-colors cursor-pointer ${
                    isNoTrade ? "opacity-60 bg-rose-950/5" : ""
                  }`}
                  onClick={() => onSelectStock(stock)}
                >
                  {/* Symbol & Name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white tracking-wide text-xs">{stock.symbol}</span>
                          <span className="text-[10px] text-zinc-500 bg-zinc-800/80 px-1 py-0.2 rounded font-sans">
                            {stock.sector}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-sans truncate max-w-[130px]">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Setup Type */}
                  <td className="py-3 px-3">
                    <div>
                      {getSetupBadge(stock.setup)}
                      <span className="block text-[10px] text-zinc-400 font-sans mt-0.5 truncate max-w-[110px]">
                        {stock.setupType}
                      </span>
                    </div>
                  </td>

                  {/* Confluence Score */}
                  <td className="py-3 px-3">
                    {getConfluenceBadge(stock.confluenceScore, stock.confluenceGrade)}
                  </td>

                  {/* LTP */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-zinc-100">
                      ₹{stock.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[11px] font-semibold ${isGreen ? "text-emerald-400" : "text-rose-400"}`}>
                      {isGreen ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </div>
                  </td>

                  {/* Entry Zone */}
                  <td className="py-3 px-3 text-zinc-300 font-medium">
                    {isNoTrade ? <span className="text-zinc-500 italic">No Entry</span> : stock.entryZone}
                  </td>

                  {/* Stop Loss */}
                  <td className="py-3 px-3 text-rose-400 font-semibold">
                    {isNoTrade ? "-" : `₹${stock.stopLoss.toLocaleString("en-IN")}`}
                  </td>

                  {/* Target 1 / Target 2 */}
                  <td className="py-3 px-3">
                    {isNoTrade ? (
                      <span className="text-zinc-500">-</span>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-emerald-400 font-semibold block">
                          T1: ₹{stock.target1.toLocaleString("en-IN")}
                        </span>
                        <span className="text-emerald-500/80 text-[10px] block">
                          T2: ₹{stock.target2.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Risk / Reward */}
                  <td className="py-3 px-3">
                    {isNoTrade ? (
                      <span className="text-zinc-500">-</span>
                    ) : (
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {stock.riskReward}
                      </span>
                    )}
                  </td>

                  {/* Volume / RVOL */}
                  <td className="py-3 px-3">
                    <div className="text-zinc-200">{stock.volume}</div>
                    <div className={`text-[10px] ${stock.relativeVolume >= 2.0 ? "text-emerald-400 font-bold" : "text-zinc-400"}`}>
                      RVOL: {stock.relativeVolume}x
                    </div>
                  </td>

                  {/* 5-Factor Confirmations Indicator */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1" title={`${stock.confirmationsAlignedCount}/5 Confirmations Aligned`}>
                      {[
                        { key: "T", label: "Trend", score: stock.confirmations.trend.score },
                        { key: "M", label: "Momentum", score: stock.confirmations.momentum.score },
                        { key: "V", label: "Volume", score: stock.confirmations.volume.score },
                        { key: "P", label: "Price Action", score: stock.confirmations.priceAction.score },
                        { key: "A", label: "Market Align", score: stock.confirmations.marketAlignment.score },
                      ].map((item) => {
                        const isGood = item.score >= 15;
                        const isMid = item.score >= 11;
                        return (
                          <span
                            key={item.key}
                            title={`${item.label}: ${item.score}/20`}
                            className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${
                              isGood
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : isMid
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            }`}
                          >
                            {item.key}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      {!isNoTrade && (
                        <button
                          onClick={() => onOpenRiskCalcForStock(stock)}
                          title="Calculate exact risk & position size"
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        >
                          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectStock(stock)}
                        title="View Full Stock Deep-Dive & Terminal Analysis"
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 border-t border-[#18202d] bg-[#0c1017] flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400">
        <div>
          Showing {filteredStocks.length} of {stocks.length} scanned instruments.
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>T: Trend</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>M: Momentum</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>V: Volume</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>P: Price Action</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>A: Alignment</span>
          </span>
        </div>
      </div>
    </div>
  );
};
