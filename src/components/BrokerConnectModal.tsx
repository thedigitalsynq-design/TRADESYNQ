import React, { useState } from "react";
import { Zap, X, ShieldCheck, CheckCircle2, Lock, ExternalLink, AlertTriangle } from "lucide-react";

interface BrokerConnectModalProps {
  onClose: () => void;
}

export const BrokerConnectModal: React.FC<BrokerConnectModalProps> = ({ onClose }) => {
  const [selectedBroker, setSelectedBroker] = useState<string>("zerodha");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [executionMode, setExecutionMode] = useState<"MANUAL_CONFIRM" | "ONE_CLICK">("MANUAL_CONFIRM");

  const brokers = [
    { id: "zerodha", name: "Zerodha Kite Connect", logo: "🪁", desc: "India's leading retail broker API" },
    { id: "upstox", name: "Upstox Interactive API", logo: "📈", desc: "Low-latency REST order routing" },
    { id: "angelone", name: "Angel One SmartAPI", logo: "👼", desc: "Full feature equity and F&O execution" },
    { id: "groww", name: "Groww Trade API", logo: "🌱", desc: "Modern order gateway" },
    { id: "dhan", name: "Dhan HQ API", logo: "🎯", desc: "Built for super traders & algos" },
  ];

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnected(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b0e14] border border-[#1e2536] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#18202d] bg-[#0d121b]">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Broker Connect & Order Execution Gateway
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Regulatory & Decision Support Disclaimer */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-zinc-300">
            <div className="flex items-center space-x-1.5 text-purple-300 font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DECISION SUPPORT COMPLIANCE NOTICE</span>
            </div>
            TradeSynq is a mathematical market intelligence and decision-support terminal. 
            All orders sent through broker APIs require explicit user validation and are subject to your individual risk limits.
          </div>

          {/* Broker Selector */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-2">
              Select Indian Brokerage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {brokers.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBroker(b.id);
                    setIsConnected(false);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedBroker === b.id
                      ? "bg-purple-950/30 border-purple-500/50 text-white"
                      : "bg-[#101520] border-[#1b2333] text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="text-base mb-1">{b.logo}</div>
                  <div className="font-bold text-zinc-200">{b.name}</div>
                  <div className="text-[10px] text-zinc-500 font-sans mt-0.5">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Credentials / Status */}
          {isConnected ? (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SESSION ACTIVE: {brokers.find((b) => b.id === selectedBroker)?.name}</span>
                </div>
                <button
                  onClick={() => setIsConnected(false)}
                  className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-white text-[10px]"
                >
                  Disconnect
                </button>
              </div>

              <div className="text-zinc-300 text-[11px] space-y-1">
                <div>Client ID: <span className="text-white font-bold">NSE_TRADER_7849</span></div>
                <div>Available Margin: <span className="text-emerald-400 font-bold">₹8,42,150.00</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">Ready for 1-Click Order Confirmation</span></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-3 bg-[#101520] p-3.5 rounded-xl border border-[#1b2333]">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">API Key / App Key</label>
                <input
                  type="text"
                  placeholder="Enter API Key from Developer Console"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#141b27] border border-[#202a3d] rounded px-3 py-1.5 text-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">API Secret / Access Token</label>
                <input
                  type="password"
                  placeholder="Enter API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full bg-[#141b27] border border-[#202a3d] rounded px-3 py-1.5 text-zinc-200"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition-colors"
              >
                Authenticate & Connect Broker
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
