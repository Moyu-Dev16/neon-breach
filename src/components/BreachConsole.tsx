import React, { useEffect, useState } from 'react';
import { INTRUSION_MODES, type IntrusionMode, type BreachOutcome, MODULO_BASE } from '../lib/math';

interface BreachConsoleProps {
  mode: IntrusionMode;
  status: 'idle' | 'breaching' | 'settled';
  outcome: BreachOutcome | null;
  payoutAmount: string;
  symbol: string;
}

export const BreachConsole: React.FC<BreachConsoleProps> = ({
  mode,
  status,
  outcome,
  payoutAmount,
  symbol,
}) => {
  const config = INTRUSION_MODES[mode];
  const [displayRoll, setDisplayRoll] = useState<number>(0);

  // Animated number scrambler during breaching status
  useEffect(() => {
    if (status !== 'breaching') {
      if (outcome) {
        setDisplayRoll(outcome.roll);
      }
      return;
    }

    const interval = setInterval(() => {
      setDisplayRoll(Math.floor(Math.random() * MODULO_BASE));
    }, 45);

    return () => clearInterval(interval);
  }, [status, outcome]);

  const won = outcome?.won === true;

  return (
    <div className="relative w-full rounded-2xl border border-cyan-500/30 bg-[#0a0e17] overflow-hidden p-4 sm:p-6 shadow-[inset_0_0_40px_rgba(6,182,212,0.06)]">
      {/* Background Matrix Grid Scanline */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6, 182, 212, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Console Bar */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/70">
            ICE FIREWALL TERMINAL • [TARGET_NODE: 0x9F_VAULT]
          </span>
        </div>
        <div className="font-mono text-xs text-white/40">
          ALGORITHM: <span className="text-cyan-400 font-bold">VRF-BLAKE32-EC</span>
        </div>
      </div>

      {/* Main Breach Stage */}
      <div className="relative z-10 min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center text-center">
        {status === 'idle' && (
          <div className="flex flex-col items-center gap-3">
            <div className="size-20 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center animate-spin-slow">
              <span className="text-2xl font-orbitron text-cyan-400">🛡️</span>
            </div>
            <div className="font-orbitron font-bold text-lg text-white/90">
              TARGET ICE LOCKED
            </div>
            <p className="font-mono text-xs text-white/50 max-w-md">
              Vector armed: <strong style={{ color: config.accentColor }}>{config.name}</strong>.
              Requires VRF roll &lt; <strong className="text-cyan-300">{config.winThreshold}</strong> / {MODULO_BASE}.
              Initiate breach to exploit firewall.
            </p>
          </div>
        )}

        {status === 'breaching' && (
          <div className="flex flex-col items-center gap-4">
            {/* Pulsing Quantum Core */}
            <div className="relative size-24 rounded-full border-4 border-cyan-400/40 flex items-center justify-center animate-pulse">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: config.accentColor }}
              />
              <span className="font-orbitron font-black text-2xl text-cyan-300">
                {displayRoll}
              </span>
            </div>
            <div className="space-y-1">
              <div className="font-orbitron font-extrabold text-lg text-cyan-300 animate-bounce tracking-wider">
                DECRYPTING ICE SIGNALS...
              </div>
              <p className="font-mono text-xs text-white/60">
                Awaiting On-Chain VRF randomness entropy fulfillment
              </p>
            </div>
          </div>
        )}

        {status === 'settled' && outcome && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            {won ? (
              <>
                <div
                  className="size-24 rounded-full border-4 border-emerald-400 bg-emerald-950/40 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)]"
                >
                  <span className="text-4xl">🔓</span>
                </div>
                <div>
                  <div className="font-orbitron font-black text-2xl sm:text-3xl text-emerald-400 tracking-wider">
                    ICE BREACH SUCCESSFUL!
                  </div>
                  <div className="font-orbitron font-extrabold text-xl text-white mt-1">
                    +{payoutAmount} <span className="text-emerald-400">{symbol}</span>{' '}
                    <span className="text-xs font-mono text-emerald-300 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                      {config.multiplier.toFixed(2)}x PAYOUT
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/50 mt-1">
                    VRF Roll: <strong className="text-emerald-300">{outcome.roll}</strong> (Target: &lt; {outcome.threshold})
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="size-24 rounded-full border-4 border-rose-500/80 bg-rose-950/40 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.4)]">
                  <span className="text-4xl">🚨</span>
                </div>
                <div>
                  <div className="font-orbitron font-black text-2xl text-rose-500 tracking-wider">
                    FIREWALL LOCKDOWN!
                  </div>
                  <p className="font-mono text-xs text-rose-300/80 mt-1">
                    ICE detected intrusion packet. Counter-measures triggered.
                  </p>
                  <p className="font-mono text-xs text-white/50 mt-1">
                    VRF Roll: <strong className="text-rose-400">{outcome.roll}</strong> (Threshold was &lt; {outcome.threshold})
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Meter / Threshold Bar */}
      <div className="relative z-10 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-1.5">
          <span>0 (ZERO DETECT)</span>
          <span className="text-cyan-400 font-bold">
            THRESHOLD: {config.winThreshold} ({config.winProbabilityPercent.toFixed(2)}%)
          </span>
          <span>{MODULO_BASE} (MAX ICE)</span>
        </div>
        <div className="relative h-2.5 w-full rounded-full bg-[#151c28] overflow-hidden border border-white/10">
          {/* Win Zone */}
          <div
            className="absolute top-0 bottom-0 left-0 transition-all duration-300"
            style={{
              width: `${(config.winThreshold / MODULO_BASE) * 100}%`,
              backgroundColor: config.accentColor,
            }}
          />
          {/* Current / Result Marker */}
          {outcome && (
            <div
              className={`absolute top-0 bottom-0 w-1.5 shadow-[0_0_10px_#fff] ${
                won ? 'bg-white' : 'bg-rose-500'
              }`}
              style={{
                left: `${Math.min(100, Math.max(0, (outcome.roll / MODULO_BASE) * 100))}%`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
