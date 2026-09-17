import React, { useState, useEffect, useCallback } from "react";
import { 
  MarketOverview, 
  StockSetup, 
  NoTradeItem, 
  MarketIntelligenceFeed, 
  MacroIndicator, 
  SignalLog, 
  PaperPortfolio 
} from "./types";
import { TopBar } from "./components/TopBar";
import { MarketRegimeCard } from "./components/MarketRegimeCard";
import { LiveOpportunitiesTable } from "./components/LiveOpportunitiesTable";
import { AggressiveModePanel } from "./components/AggressiveModePanel";
import { NoTradeEnginePanel } from "./components/NoTradeEnginePanel";
import { StockDeepDiveModal } from "./components/StockDeepDiveModal";
import { RiskCalculatorModal } from "./components/RiskCalculatorModal";
import { PaperTradingPanel } from "./components/PaperTradingPanel";
import { BacktestCenter } from "./components/BacktestCenter";
import { IntelligencePanel } from "./components/IntelligencePanel";
import { SignalJournal } from "./components/SignalJournal";
import { SectorHeatmap } from "./components/SectorHeatmap";
import { AlertsModal } from "./components/AlertsModal";
import { BrokerConnectModal } from "./components/BrokerConnectModal";
import { 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  Briefcase, 
  Layers, 
  Sparkles, 
  AlertCircle,
  Clock,
  ArrowRight,
  Calculator,
  RefreshCw
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isSimulatedLive, setIsSimulatedLive] = useState<boolean>(true);

  // Core Data State
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [stocks, setStocks] = useState<StockSetup[]>([]);
  const [noTradeRadar, setNoTradeRadar] = useState<NoTradeItem[]>([]);
  const [intelligenceFeed, setIntelligenceFeed] = useState<MarketIntelligenceFeed[]>([]);
  const [macroIndicators, setMacroIndicators] = useState<MacroIndicator[]>([]);
  const [signalsLog, setSignalsLog] = useState<SignalLog[]>([]);

  // Paper Portfolio State
  const [paperPortfolio, setPaperPortfolio] = useState<PaperPortfolio>({
    initialCapital: 1000000,
    totalEquity: 1000000,
    availableCash: 1000000,
    realizedPnl: 14250,
    unrealizedPnl: 0,
    winCount: 6,
    lossCount: 2,
    positions: [
      {
        id: "pos_1",
        symbol: "RELIANCE",
        side: "BUY",
        quantity: 50,
        entryPrice: 2935.0,
        currentPrice: 2948.5,
        stopLoss: 2895.0,
        target: 3040.0,
        unrealizedPnl: 675,
        unrealizedPnlPercent: 0.46,
        entryTime: "10:15 IST",
        setupType: "Momentum Breakout",
      },
      {
        id: "pos_2",
        symbol: "TATAMOTORS",
        side: "BUY",
        quantity: 120,
        entryPrice: 975.0,
        currentPrice: 988.4,
        stopLoss: 955.0,
        target: 1030.0,
        unrealizedPnl: 1608,
        unrealizedPnlPercent: 1.37,
        entryTime: "09:45 IST",
        setupType: "ORB Breakout",
      },
    ],
  });

  // Modal Dialogs State
  const [selectedStockForModal, setSelectedStockForModal] = useState<StockSetup | null>(null);
  const [riskCalcStock, setRiskCalcStock] = useState<StockSetup | null>(null);
  const [isRiskCalcOpen, setIsRiskCalcOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState<boolean>(false);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial Data Fetch
  const fetchData = useCallback(async () => {
    const parseJson = async (res: Response, fallback: any) => {
      try {
        if (!res.ok) return fallback;
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return fallback;
        return await res.json();
      } catch {
        return fallback;
      }
    };

    try {
      const [mRes, sRes, nRes, iRes, jRes] = await Promise.all([
        fetch("/api/market/overview"),
        fetch("/api/stocks"),
        fetch("/api/no-trade"),
        fetch("/api/intelligence"),
        fetch("/api/journal"),
      ]);

      const [mData, sData, nData, iData, jData] = await Promise.all([
        parseJson(mRes, null),
        parseJson(sRes, []),
        parseJson(nRes, { radar: [] }),
        parseJson(iRes, { newsFeed: [], macros: [] }),
        parseJson(jRes, []),
      ]);

      if (mData) {
        setMarketOverview(mData);
      }
      if (Array.isArray(sData) && sData.length > 0) {
        setStocks(sData);
      }
      if (nData) {
        setNoTradeRadar(Array.isArray(nData) ? nData : (nData.radar || []));
      }
      if (iData) {
        setIntelligenceFeed(Array.isArray(iData.newsFeed) ? iData.newsFeed : (Array.isArray(iData) ? iData : []));
        setMacroIndicators(Array.isArray(iData.macros) ? iData.macros : []);
      }
      if (Array.isArray(jData)) {
        setSignalsLog(jData);
      }
    } catch (e) {
      console.error("Failed to fetch initial market intelligence", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Live Simulated Price Movement Ticker (1.5s interval)
  useEffect(() => {
    if (!isSimulatedLive) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Subtle micro-tick random walk (0.05% jitter)
          const randomFactor = (Math.random() - 0.49) * 0.001;
          const newPrice = Number((stock.ltp * (1 + randomFactor)).toFixed(2));
          const prevClose = stock.ltp - stock.change;
          const newChange = Number((newPrice - prevClose).toFixed(2));
          const newChangePercent = prevClose > 0 ? Number(((newChange / prevClose) * 100).toFixed(2)) : stock.changePercent;

          return {
            ...stock,
            ltp: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );

      // Also update paper positions marked-to-market
      setPaperPortfolio((prev) => {
        const updatedPositions = prev.positions.map((pos) => {
          const matchingStock = stocks.find((s) => s.symbol === pos.symbol);
          const currentPrice = matchingStock ? matchingStock.ltp : pos.currentPrice;
          const priceDiff = pos.side === "BUY" ? currentPrice - pos.entryPrice : pos.entryPrice - currentPrice;
          const unrealizedPnl = priceDiff * pos.quantity;
          const unrealizedPnlPercent = ((priceDiff / pos.entryPrice) * 100);

          return {
            ...pos,
            currentPrice,
            unrealizedPnl,
            unrealizedPnlPercent,
          };
        });

        const totalUnrealized = updatedPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
        return {
          ...prev,
          positions: updatedPositions,
          unrealizedPnl: totalUnrealized,
          totalEquity: prev.availableCash + totalUnrealized,
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulatedLive, stocks]);

  // Handler: Open Risk Calc for Stock
  const handleOpenRiskCalcForStock = (stock: StockSetup) => {
    setRiskCalcStock(stock);
    setIsRiskCalcOpen(true);
  };

  // Handler: Place Paper Order
  const handlePlacePaperOrder = (
    stock: StockSetup,
    side: "BUY" | "SELL",
    quantity: number = 25
  ) => {
    const newPos = {
      id: `pos_${Date.now()}`,
      symbol: stock.symbol,
      side,
      quantity,
      entryPrice: stock.ltp,
      currentPrice: stock.ltp,
      stopLoss: stock.stopLoss,
      target: stock.target1,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      entryTime: new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" }) + " IST",
      setupType: stock.setupType,
    };

    setPaperPortfolio((prev) => ({
      ...prev,
      positions: [newPos, ...prev.positions],
    }));

    showToast(`Executed simulated ${side} order on ${stock.symbol} (${quantity} shares @ ₹${stock.ltp})`);
    if (selectedStockForModal) setSelectedStockForModal(null);
  };

  // Handler: Apply from Risk Calculator
  const handleApplyFromRiskCalc = (trade: {
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    entryPrice: number;
    stopLoss: number;
    target: number;
    setupType: string;
  }) => {
    const newPos = {
      id: `pos_${Date.now()}`,
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.quantity,
      entryPrice: trade.entryPrice,
      currentPrice: trade.entryPrice,
      stopLoss: trade.stopLoss,
      target: trade.target,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      entryTime: new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" }) + " IST",
      setupType: trade.setupType,
    };

    setPaperPortfolio((prev) => ({
      ...prev,
      positions: [newPos, ...prev.positions],
    }));

    showToast(`Executed calibrated risk order: ${trade.quantity} ${trade.symbol} @ ₹${trade.entryPrice}`);
  };

  // Handler: Close Position in Paper Trading
  const handleClosePaperPosition = (positionId: string) => {
    const pos = paperPortfolio.positions.find((p) => p.id === positionId);
    if (!pos) return;

    const pnl = pos.unrealizedPnl;
    const isWin = pnl >= 0;

    setPaperPortfolio((prev) => ({
      ...prev,
      positions: prev.positions.filter((p) => p.id !== positionId),
      realizedPnl: prev.realizedPnl + pnl,
      availableCash: prev.availableCash + (pos.quantity * pos.currentPrice),
      winCount: isWin ? prev.winCount + 1 : prev.winCount,
      lossCount: isWin ? prev.lossCount : prev.lossCount + 1,
    }));

    showToast(`Closed ${pos.symbol} position with ${pnl >= 0 ? "+" : ""}₹${pnl.toFixed(0)} P&L`);
  };

  const handleResetPaperPortfolio = () => {
    setPaperPortfolio({
      initialCapital: 1000000,
      totalEquity: 1000000,
      availableCash: 1000000,
      realizedPnl: 0,
      unrealizedPnl: 0,
      winCount: 0,
      lossCount: 0,
      positions: [],
    });
    showToast("Reset simulation paper capital to ₹10,00,000");
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111724] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar with Live Indices, Regimes, Ticker, and Quick Actions */}
      {marketOverview ? (
        <TopBar
          market={marketOverview}
          isSimulatedLive={isSimulatedLive}
          onToggleSimulatedFeed={() => setIsSimulatedLive(!isSimulatedLive)}
          onOpenRiskCalc={() => {
            setRiskCalcStock(stocks[0] || null);
            setIsRiskCalcOpen(true);
          }}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onOpenPaperTrading={() => setCurrentTab("paper")}
          onOpenBrokerConnect={() => setIsBrokerModalOpen(true)}
          onOpenBacktest={() => setCurrentTab("backtest")}
          onOpenIntelligence={() => setCurrentTab("intelligence")}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />
      ) : (
        <div className="p-4 bg-[#090b0e] border-b border-[#1b212f] text-xs font-mono text-zinc-400 flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>INITIALIZING TRADESYNQ QUANTITATIVE ENGINE...</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 space-y-5">
        {/* TAB 1: MAIN TERMINAL */}
        {currentTab === "dashboard" && marketOverview && (
          <div className="space-y-5">
            {/* Market Regime Card */}
            <MarketRegimeCard market={marketOverview} />

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">High-Confluence Setups</span>
                <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                  {stocks.filter((s) => s.confluenceScore >= 70).length} Setups
                </span>
                <span className="text-[10px] text-zinc-400">&gt;= 70 Confluence Score</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">Breakout Accelerations</span>
                <span className="text-xl font-bold text-white mt-0.5 block">
                  {stocks.filter((s) => s.setupType.includes("Breakout") || s.setupType === "ORB").length} Active
                </span>
                <span className="text-[10px] text-zinc-400">RVOL &gt; 2.0x Confirmed</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-rose-500/30">
                <span className="text-[10px] text-rose-400 uppercase block font-semibold">No-Trade Exclusions</span>
                <span className="text-xl font-bold text-rose-400 mt-0.5 block">
                  {noTradeRadar.length + stocks.filter((s) => s.setup === "NO TRADE").length} Instruments
                </span>
                <span className="text-[10px] text-zinc-400">Choppy / Illiquid Traps</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-zinc-500 uppercase block">Paper Trading P&L</span>
                <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                  +₹{(paperPortfolio.realizedPnl + paperPortfolio.unrealizedPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-zinc-400">{paperPortfolio.positions.length} Open Simulation Positions</span>
              </div>
            </div>

            {/* Sector-Based Heatmap Component */}
            <SectorHeatmap
              sectors={marketOverview.sectors}
              stocks={stocks}
              onSelectStock={(stock) => setSelectedStockForModal(stock)}
              selectedSectorFilter={selectedSectorFilter || undefined}
              onSelectSectorFilter={(sec) => setSelectedSectorFilter(sec)}
            />

            {/* Live Opportunities Table */}
            <LiveOpportunitiesTable
              stocks={stocks}
              onSelectStock={(stock) => setSelectedStockForModal(stock)}
              onOpenRiskCalcForStock={handleOpenRiskCalcForStock}
              activeSectorFilter={selectedSectorFilter}
              onClearSectorFilter={() => setSelectedSectorFilter(null)}
            />
          </div>
        )}

        {/* TAB 2: AGGRESSIVE MODE */}
        {currentTab === "aggressive" && (
          <AggressiveModePanel
            stocks={stocks}
            onSelectStock={(stock) => setSelectedStockForModal(stock)}
            onOpenRiskCalcForStock={handleOpenRiskCalcForStock}
          />
        )}

        {/* TAB 3: NO-TRADE ENGINE */}
        {currentTab === "no-trade" && (
          <NoTradeEnginePanel
            noTradeRadar={noTradeRadar}
            stocks={stocks}
            onSelectStock={(stock) => setSelectedStockForModal(stock)}
          />
        )}

        {/* TAB 4: AI MARKET INTELLIGENCE */}
        {currentTab === "intelligence" && marketOverview && (
          <IntelligencePanel
            feed={intelligenceFeed}
            macros={macroIndicators}
            market={marketOverview}
          />
        )}

        {/* TAB 5: BACKTEST CENTER */}
        {currentTab === "backtest" && <BacktestCenter />}

        {/* TAB 6: SIGNAL JOURNAL */}
        {currentTab === "journal" && <SignalJournal signals={signalsLog} />}

        {/* TAB 7: PAPER TRADING */}
        {currentTab === "paper" && (
          <PaperTradingPanel
            portfolio={paperPortfolio}
            onClosePosition={handleClosePaperPosition}
            onResetPortfolio={handleResetPaperPortfolio}
          />
        )}
      </main>

      {/* Terminal Compliance & Operational Footer */}
      <footer className="border-t border-[#151c27] bg-[#080b0f] px-4 py-3 text-[11px] font-mono text-zinc-500">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-400">TRADESYNQ</span>
            <span>• INDIAN EQUITY INTELLIGENCE TERMINAL</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400">DECISION SUPPORT ENGINE</span>
          </div>

          <div className="text-center md:text-right text-[10px] text-zinc-500 max-w-xl">
            NOTICE: TradeSynq does not provide guaranteed investment returns or registered SEBI advisory. 
            All setups represent algorithmic confluence metrics for disciplined execution. Always enforce stop-losses.
          </div>
        </div>
      </footer>

      {/* MODAL 1: Stock Deep Dive */}
      {selectedStockForModal && (
        <StockDeepDiveModal
          stock={selectedStockForModal}
          onClose={() => setSelectedStockForModal(null)}
          onOpenRiskCalc={handleOpenRiskCalcForStock}
          onPlacePaperOrder={handlePlacePaperOrder}
        />
      )}

      {/* MODAL 2: Risk Management Calculator */}
      {isRiskCalcOpen && (
        <RiskCalculatorModal
          stock={riskCalcStock}
          onClose={() => setIsRiskCalcOpen(false)}
          onApplyToPaperTrade={handleApplyFromRiskCalc}
        />
      )}

      {/* MODAL 3: Real-Time Alerts Modal */}
      {isAlertsOpen && (
        <AlertsModal onClose={() => setIsAlertsOpen(false)} />
      )}

      {/* MODAL 4: Broker Connect Modal */}
      {isBrokerModalOpen && (
        <BrokerConnectModal onClose={() => setIsBrokerModalOpen(false)} />
      )}
    </div>
  );
}
