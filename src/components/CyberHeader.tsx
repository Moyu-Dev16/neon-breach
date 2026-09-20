import React from 'react';
import { soundFx } from '../lib/audio';

interface CyberHeaderProps {
  balanceFormatted: string;
  symbol: string;
  isStandalone: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  fastMode: boolean;
  setFastMode: (val: boolean) => void;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  balanceFormatted,
  symbol,
  isStandalone,
  soundEnabled,
  setSoundEnabled,
  fastMode,
  setFastMode,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-[#0b0e14]/90 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Game Title and Tagline */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="font-orbitron font-extrabold text-cyan-400 text-lg">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                NEON BREACH
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-400 border border-cyan-500/40">
                CYBER-VAULT
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-500/70 tracking-tight">
              ON-CHAIN ICE INTRUSION CASINO • 96.50% VERIFIED RTP
            </p>
          </div>
        </div>

        {/* Center / Right: Status Badge & Controls */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          {/* Mode Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
              isStandalone
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <span
              className={`size-2 rounded-full animate-pulse ${
                isStandalone ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span>{isStandalone ? 'DEMO SANDBOX' : 'HOST BRIDGE CONNECTED'}</span>
          </div>

          {/* Balance Pill */}
          <div className="flex items-center gap-2 bg-[#121824] border border-cyan-500/30 px-3 py-1 rounded-lg">
            <span className="text-xs text-white/50 font-mono">VAULT CREDITS:</span>
            <span className="font-mono font-bold text-sm text-cyan-300">
              {balanceFormatted} <span className="text-xs text-cyan-500">{symbol}</span>
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFx.enabled = next;
              if (next) soundFx.playBlip(900);
            }}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-[#121824] text-xs font-mono text-white/70 hover:text-cyan-300 transition-colors"
          >
            {soundEnabled ? '🔊 SFX' : '🔇 MUTED'}
          </button>

          {/* Fast Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setFastMode(!fastMode);
              soundFx.playBlip(700);
            }}
            title="Fast Mode (Instant Settlement)"
            className={`px-2 py-1 rounded-lg border text-xs font-mono transition-colors ${
              fastMode
                ? 'border-cyan-500/60 bg-cyan-950/60 text-cyan-300'
                : 'border-white/10 bg-[#121824] text-white/60 hover:text-white'
            }`}
          >
            ⚡ {fastMode ? 'FAST: ON' : 'FAST: OFF'}
          </button>
        </div>
      </div>
    </header>
  );
};
