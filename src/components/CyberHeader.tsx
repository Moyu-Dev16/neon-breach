import React from 'react';
import { soundFx } from '../lib/audio';

interface CyberHeaderProps {
  balanceFormatted: string;
  symbol: string;
  isStandalone: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  ambientEnabled: boolean;
  setAmbientEnabled: (val: boolean) => void;
  fastMode: boolean;
  setFastMode: (val: boolean) => void;
  onOpenCodex: () => void;
  unlockedLootCount: number;
  totalLootCount: number;
  streak: number;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  balanceFormatted,
  symbol,
  isStandalone,
  soundEnabled,
  setSoundEnabled,
  ambientEnabled,
  setAmbientEnabled,
  fastMode,
  setFastMode,
  onOpenCodex,
  unlockedLootCount,
  totalLootCount,
  streak,
}) => {
  return (
    <header className="border-b-2 border-cyan-500/25 bg-[#080b13]/95 backdrop-blur-lg px-4 py-3 sm:px-6 sticky top-0 z-30 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity & Sub-header */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="font-orbitron font-extrabold text-cyan-300 text-xl">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-black text-xl sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                NEON BREACH
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm">
                CYBER-VAULT 2.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70 tracking-tight flex items-center gap-1.5">
              <span>BASE L2 CASINO PROTOCOL</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">96.50% VRF RTP</span>
            </p>
          </div>
        </div>

        {/* Right: Controls, Loot Codex, Streak, & Balance */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Standalone vs Host Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              isStandalone
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                isStandalone ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span>{isStandalone ? 'SANDBOX' : 'HOST SYNC'}</span>
          </div>

          {/* Win Streak Indicator */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold animate-pulse">
              <span>🔥</span>
              <span>STREAK: {streak}</span>
            </div>
          )}

          {/* Loot Codex Button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(800);
              onOpenCodex();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 text-xs font-mono font-bold text-cyan-300 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]"
          >
            <span>💾</span>
            <span>CODEX</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500 text-black font-extrabold">
              {unlockedLootCount}/{totalLootCount}
            </span>
          </button>

          {/* Vault Credits Display */}
          <div className="flex items-center gap-2 bg-[#0e1422] border-2 border-cyan-500/40 px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-[11px] text-white/50 font-mono">VAULT:</span>
            <span className="font-mono font-black text-base text-cyan-300 tracking-wide">
              {balanceFormatted} <span className="text-xs text-cyan-500 font-bold">{symbol}</span>
            </span>
          </div>

          {/* Audio Controls (SFX & Ambient) */}
          <div className="flex items-center gap-1 bg-[#0e1422] border border-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                soundFx.enabled = next;
                if (next) soundFx.playClick(900);
              }}
              title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                soundEnabled ? 'text-cyan-300 bg-cyan-950/60' : 'text-white/40 hover:text-white'
              }`}
            >
              {soundEnabled ? '🔊 SFX' : '🔇 SFX'}
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !ambientEnabled;
                setAmbientEnabled(next);
                soundFx.toggleAmbient(next);
              }}
              title={ambientEnabled ? 'Stop Ambient Music' : 'Play Cyber Ambient Drone'}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                ambientEnabled
                  ? 'text-emerald-300 bg-emerald-950/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {ambientEnabled ? '🎧 BGM ON' : '🎧 BGM OFF'}
            </button>
          </div>

          {/* Fast Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setFastMode(!fastMode);
              soundFx.playClick(700);
            }}
            title="Fast Mode (Immediate Resolution)"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
              fastMode
                ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'border-white/10 bg-[#0e1422] text-white/50 hover:text-white'
            }`}
          >
            {fastMode ? '⚡ FAST: ON' : '⏱️ NORMAL'}
          </button>
        </div>
      </div>
    </header>
  );
};
