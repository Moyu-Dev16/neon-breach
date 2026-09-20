import React from 'react';
import { INTRUSION_MODES, type IntrusionMode } from '../lib/math';

interface WinModalProps {
  visible: boolean;
  payoutAmount: string;
  multiplierText: string;
  mode: IntrusionMode;
  symbol: string;
  onDismiss: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  visible,
  payoutAmount,
  multiplierText,
  mode,
  symbol,
  onDismiss,
}) => {
  if (!visible) return null;
  const config = INTRUSION_MODES[mode];

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-sm w-full rounded-2xl border-2 border-emerald-400 bg-[#0c121e] p-6 text-center shadow-[0_0_60px_rgba(16,185,129,0.4)] animate-in zoom-in-95 duration-200"
      >
        {/* Glow Orb */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 size-20 rounded-full border-2 border-emerald-400 bg-emerald-950/90 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.8)]"
        >
          💎
        </div>

        <div className="pt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block mb-1">
            VAULT CORE UNLOCKED
          </span>
          <h3 className="font-orbitron font-black text-3xl text-white tracking-wider">
            +{payoutAmount} <span className="text-emerald-400">{symbol}</span>
          </h3>

          <div className="mt-3 inline-block font-mono text-xs px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300">
            VECTOR {config.code} • {multiplierText} WIN
          </div>

          <p className="font-mono text-xs text-white/50 mt-3">
            Exploit payload delivered successfully. Funds transferred to Smart Vault.
          </p>

          <button
            type="button"
            onClick={onDismiss}
            className="mt-6 w-full py-2.5 rounded-xl font-orbitron font-bold text-sm bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            COLLECT CREDITS
          </button>
        </div>
      </div>
    </div>
  );
};
