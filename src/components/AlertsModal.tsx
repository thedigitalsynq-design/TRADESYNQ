import React, { useState } from "react";
import { Bell, X, Check, Volume2, Smartphone, ShieldCheck, Zap } from "lucide-react";

interface AlertsModalProps {
  onClose: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [minConfluence, setMinConfluence] = useState(80);
  const [alertOnInvalidation, setAlertOnInvalidation] = useState(true);
  const [alertOnRegimeShift, setAlertOnRegimeShift] = useState(true);
  const [alertOnVolumeExplosion, setAlertOnVolumeExplosion] = useState(true);

  const mockLiveAlerts = [
    { id: "1", time: "11:42:15 IST", text: "HIGH CONFLUENCE (88): RELIANCE Breakout Continuation confirmed above ₹2,940 with 2.8x RVOL", type: "ENTRY" },
    { id: "2", time: "11:35:04 IST", text: "REGIME CONFIRMED: Market breadth expanded to 72% > 20 EMA (Bullish continuation)", type: "REGIME" },
    { id: "3", time: "11:20:18 IST", text: "VOLUME SPIKE: TATACHEM relative volume exploded to 3.4x on 15m candle", type: "VOLUME" },
    { id: "4", time: "10:55:00 IST", text: "SETUP INVALIDATED: HDFCBANK slipped below VWAP ₹1,668. Long setup cancelled.", type: "INVALIDATION" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b0e14] border border-[#1e2536] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#18202d] bg-[#0d121b]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Real-Time Alert Dispatcher
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration */}
        <div className="p-5 space-y-4">
          <div className="space-y-3 bg-[#111622] p-3.5 rounded-xl border border-[#1d2536]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">Audio Notifications</span>
                <span className="text-[10px] text-zinc-400">Terminal chime on confirmed 80+ setup</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${soundEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-5" : "translate-x-1"}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#18202d]">
              <div>
                <span className="text-white font-bold block">Minimum Confluence Filter</span>
                <span className="text-[10px] text-zinc-400">Only alert when score is &gt;= {minConfluence}</span>
              </div>
              <select
                value={minConfluence}
                onChange={(e) => setMinConfluence(Number(e.target.value))}
                className="bg-[#0d111a] border border-zinc-700 text-white rounded px-2 py-1"
              >
                <option value={70}>70 (Strong)</option>
                <option value={80}>80 (High)</option>
                <option value={90}>90 (Extreme Confluence)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#18202d]">
              <span className="text-zinc-300">Invalidation Alerts</span>
              <input
                type="checkbox"
                checked={alertOnInvalidation}
                onChange={(e) => setAlertOnInvalidation(e.target.checked)}
                className="rounded accent-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#18202d]">
              <span className="text-zinc-300">Regime Shift Alerts</span>
              <input
                type="checkbox"
                checked={alertOnRegimeShift}
                onChange={(e) => setAlertOnRegimeShift(e.target.checked)}
                className="rounded accent-emerald-500"
              />
            </div>
          </div>

          {/* Recent Live Alert Stream */}
          <div>
            <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block mb-2">
              Recent Live Dispatches
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {mockLiveAlerts.map((al) => (
                <div key={al.id} className="p-2 rounded bg-[#0f141f] border border-[#1c2434] text-[11px]">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="text-amber-400 font-bold">{al.type}</span>
                    <span>{al.time}</span>
                  </div>
                  <p className="mt-1 text-zinc-200 font-sans">{al.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
