import React, { useEffect, useState } from 'react';
import { INTRUSION_MODES, type IntrusionMode, type BreachOutcome, MODULO_BASE } from '../lib/math';
import { soundFx } from '../lib/audio';

interface BreachConsoleProps {
  mode: IntrusionMode;
  status: 'idle' | 'breaching' | 'settled';
  outcome: BreachOutcome | null;
  payoutAmount: string;
  symbol: string;
  heatLevel: number;
}

export const BreachConsole: React.FC<BreachConsoleProps> = ({
  mode,
  status,
  outcome,
  payoutAmount,
  symbol,
  heatLevel,
}) => {
  const config = INTRUSION_MODES[mode];
  const [displayRoll, setDisplayRoll] = useState<number>(0);
  const [hexSnippet, setHexSnippet] = useState<string>('0x00000000');

  // Animated scrambler during breaching status
  useEffect(() => {
    if (status !== 'breaching') {
      if (outcome) {
        setDisplayRoll(outcome.roll);
        setHexSnippet(`0x${outcome.roll.toString(16).toUpperCase().padStart(8, '0')}`);
      }
      return;
    }

    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * MODULO_BASE);
      setDisplayRoll(rand);
      setHexSnippet(`0x${Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, '0')}`);
      soundFx.playDecryptTick();
    }, 45);

    return () => clearInterval(interval);
  }, [status, outcome]);

  const won = outcome?.won === true;
  const isBreaching = status === 'breaching';
  const isSettled = status === 'settled';

  // Screen shake on lockdown
  const isAlarm = isSettled && !won;

  return (
    <div
      className={`relative w-full rounded-2xl border-2 bg-[#060911] overflow-hidden p-4 sm:p-6 crt-screen transition-all ${
        isAlarm
          ? 'border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.3)] shake-active'
          : isSettled && won
            ? 'border-emerald-400/60 shadow-[0_0_60px_rgba(16,185,129,0.35)]'
            : 'border-cyan-500/30 shadow-[inset_0_0_50px_rgba(6,182,212,0.08)]'
      }`}
    >
      {/* Industrial Bezel & Rivets */}
      <div className="pointer-events-none absolute top-2 left-2 size-2 rounded-full bg-white/30 shadow-inner" />
      <div className="pointer-events-none absolute top-2 right-2 size-2 rounded-full bg-white/30 shadow-inner" />
      <div className="pointer-events-none absolute bottom-2 left-2 size-2 rounded-full bg-white/30 shadow-inner" />
      <div className="pointer-events-none absolute bottom-2 right-2 size-2 rounded-full bg-white/30 shadow-inner" />

      {/* Top Console Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between pb-3 border-b border-white/10 gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`size-2.5 rounded-full ${
              isAlarm
                ? 'bg-red-500 animate-ping'
                : isBreaching
                  ? 'bg-amber-400 animate-ping'
                  : won && isSettled
                    ? 'bg-emerald-400'
                    : 'bg-cyan-400 animate-pulse'
            }`}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-white/80 font-bold flex items-center gap-2">
            ARCADE DECK // {config.code}
            <span
              className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold"
              style={{
                backgroundColor: `${config.accentColor}20`,
                color: config.accentColor,
                border: `1px solid ${config.accentColor}60`,
              }}
            >
              {config.name}
            </span>
          </span>
        </div>

        {/* Heat Level Visual Gauge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-white/40 text-[11px]">HEAT LVL:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={`h-2.5 w-4 rounded-xs transition-all ${
                  lvl <= heatLevel
                    ? lvl === 4
                      ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]'
                      : lvl === 3
                        ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                        : lvl === 2
                          ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]'
                          : 'bg-emerald-400'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Center Decryption Arena */}
      <div className="relative z-10 min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center text-center p-2">
        {/* Dynamic Concentric Cipher Rings */}
        <div className="relative size-44 sm:size-56 flex items-center justify-center mb-3">
          {/* Outer Ring */}
          <svg
            className={`absolute inset-0 size-full ${
              isBreaching ? 'animate-spin-fast' : 'animate-spin-slow'
            }`}
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke={config.accentColor}
              strokeWidth="2"
              strokeDasharray="8 6 24 6 12 12"
              opacity={isAlarm ? 0.3 : 0.65}
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </svg>

          {/* Middle Ring (Reverse Rotation) */}
          <svg
            className={`absolute inset-3 size-[calc(100%-24px)] ${
              isBreaching ? 'animate-spin-fast' : 'animate-spin-reverse-slow'
            }`}
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="76"
              fill="none"
              stroke={isAlarm ? '#ef4444' : '#06b6d4'}
              strokeWidth="3"
              strokeDasharray="4 8 16 8"
              opacity="0.8"
            />
          </svg>

          {/* Inner Quantum Core Display */}
          <div
            className={`relative size-28 sm:size-36 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
              isAlarm
                ? 'border-red-500 bg-red-950/40'
                : isSettled && won
                  ? 'border-emerald-400 bg-emerald-950/50 glow-gold'
                  : isBreaching
                    ? 'border-cyan-300 bg-cyan-950/60 animate-pulse glow-cyan'
                    : 'border-white/20 bg-[#0d1424]/80'
            }`}
          >
            {/* Core Label */}
            <span className="text-[10px] font-mono tracking-widest text-white/50 mb-0.5">
              {isBreaching ? 'SCANNING' : isSettled ? (won ? 'CRACKED' : 'BLOCKED') : 'ENTROPY'}
            </span>

            {/* Core Number Roll */}
            <span
              className={`font-orbitron font-black text-2xl sm:text-3xl tracking-wider ${
                isAlarm
                  ? 'text-red-400'
                  : isSettled && won
                    ? 'text-emerald-300'
                    : isBreaching
                      ? 'text-cyan-300'
                      : 'text-white/80'
              }`}
            >
              {displayRoll}
            </span>

            {/* Threshold condition */}
            <span className="text-[10px] font-mono text-white/40 mt-0.5">
              REQ &lt; {config.winThreshold}
            </span>
          </div>
        </div>

        {/* Live Status Text Area */}
        <div className="space-y-1 max-w-md">
          {status === 'idle' && (
            <>
              <div className="font-orbitron font-bold text-base text-white/90">
                ICE DEFENSE STATUS: ARMED
              </div>
              <p className="font-mono text-xs text-white/50">
                Infiltration vector <strong style={{ color: config.accentColor }}>{config.name}</strong> ready.
                Theoretical win rate: <strong className="text-cyan-300">{(config.winThreshold / MODULO_BASE * 100).toFixed(2)}%</strong> (96.50% RTP).
              </p>
            </>
          )}

          {status === 'breaching' && (
            <>
              <div className="font-orbitron font-extrabold text-base text-cyan-300 tracking-wider flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                DECRYPTING CIPHER MATRIX...
              </div>
              <div className="font-mono text-xs text-cyan-400/80 bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/30">
                ENTROPY HASH: {hexSnippet}
              </div>
            </>
          )}

          {isSettled && won && outcome && (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="font-orbitron font-black text-xl text-emerald-400 flex items-center justify-center gap-2 tracking-wide">
                <span>💥</span> BREACH CONFIRMED (+{payoutAmount} {symbol})
              </div>
              <div className="font-mono text-xs text-emerald-300/90 bg-emerald-950/70 py-1 px-3 rounded border border-emerald-500/40 inline-block">
                ROLL {outcome.roll} &lt; THRESHOLD {outcome.threshold} • PAYOUT {outcome.multiplier.toFixed(2)}x
              </div>
            </div>
          )}

          {isSettled && !won && outcome && (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="font-orbitron font-black text-xl text-red-400 flex items-center justify-center gap-2 tracking-wide">
                <span>🚨</span> ICE LOCKDOWN TRIGGERED
              </div>
              <div className="font-mono text-xs text-red-300/90 bg-red-950/70 py-1 px-3 rounded border border-red-500/40 inline-block">
                ROLL {outcome.roll} &ge; THRESHOLD {outcome.threshold} • INTRUSION NEUTRALIZED
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between pt-3 border-t border-white/10 mt-4 text-[11px] font-mono text-white/40 gap-2">
        <div>
          MODULO SPACE: <span className="text-white/70">12,000 (EXACT)</span>
        </div>
        <div>
          VERIFIED RTP: <span className="text-emerald-400 font-bold">96.5000%</span>
        </div>
        <div>
          ENTROPY: <span className="text-cyan-400 font-bold">EVM VRF-BLAKE32</span>
        </div>
      </div>
    </div>
  );
};
