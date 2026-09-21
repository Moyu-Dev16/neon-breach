import React from 'react';
import { INTRUSION_MODES, type IntrusionMode } from '../lib/math';
import { soundFx } from '../lib/audio';

interface BetControlsProps {
  wager: number;
  setWager: (val: number) => void;
  maxWager: number;
  balance: number;
  mode: IntrusionMode;
  disabled: boolean;
  onBreach: () => void;
  symbol: string;
}

const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];

export const BetControls: React.FC<BetControlsProps> = ({
  wager,
  setWager,
  maxWager,
  balance,
  mode,
  disabled,
  onBreach,
  symbol,
}) => {
  const config = INTRUSION_MODES[mode];
  const potentialWin = (wager * config.multiplier).toFixed(2);
  const insufficientBalance = wager > balance || balance <= 0;

  const handleAdjust = (val: number) => {
    soundFx.playClick(750);
    const clamped = Math.max(0.1, Math.min(balance, Number(val.toFixed(2))));
    setWager(clamped);
  };

  return (
    <div className="w-full rounded-2xl border-2 border-white/15 bg-[#090d16] p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Left: Industrial Stake Configuration Panel */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/70 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-cyan-400" />
              STAKE CONFIGURATION ({symbol})
            </span>
            <span className="text-white/40">
              MIN: 0.10 • MAX: {maxWager.toFixed(2)} {symbol}
            </span>
          </div>

          {/* Amount Input with Tactile Stepper Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.5"
                min="0.1"
                max={maxWager}
                disabled={disabled}
                value={wager}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setWager(val);
                }}
                className="w-full bg-[#111726] border-2 border-cyan-500/30 rounded-xl px-4 py-2.5 font-mono text-xl font-bold text-white focus:outline-none focus:border-cyan-400 shadow-inner"
              />
              <span className="absolute right-3 top-3 text-xs font-mono text-cyan-400/80 font-bold">
                {symbol}
              </span>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAdjust(wager / 2)}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#141b2d] hover:bg-[#1a233a] active:translate-y-0.5 text-xs font-mono font-bold text-white/90 cursor-pointer disabled:opacity-40 transition-all shadow-sm"
            >
              ½x
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAdjust(wager * 2)}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#141b2d] hover:bg-[#1a233a] active:translate-y-0.5 text-xs font-mono font-bold text-white/90 cursor-pointer disabled:opacity-40 transition-all shadow-sm"
            >
              2x
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAdjust(balance)}
              className="px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 active:translate-y-0.5 text-xs font-mono font-bold text-cyan-300 cursor-pointer disabled:opacity-40 transition-all shadow-sm"
            >
              MAX
            </button>
          </div>

          {/* Quick Presets Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-white/40 mr-1">PRESETS:</span>
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                disabled={disabled}
                onClick={() => handleAdjust(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer disabled:opacity-40 ${
                  wager === amt
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'bg-[#121828] border border-white/10 hover:border-cyan-500/40 text-white/70'
                }`}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Tactile Physical Breach Execution Trigger */}
        <div className="w-full lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-5 gap-3">
          {/* Potential Yield Readout */}
          <div className="flex items-center justify-between font-mono bg-[#111726] p-2.5 rounded-xl border border-white/10">
            <span className="text-xs text-white/60">PROJECTED RETURN:</span>
            <span
              className="text-base font-orbitron font-extrabold"
              style={{ color: config.accentColor }}
            >
              +{potentialWin} {symbol}
            </span>
          </div>

          {/* Big Physical Industrial Push Button */}
          <button
            type="button"
            disabled={disabled || insufficientBalance}
            onClick={() => {
              soundFx.playClick(950);
              onBreach();
            }}
            className={`w-full py-4 px-6 rounded-xl font-orbitron font-black text-lg uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer select-none ${
              insufficientBalance
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                : disabled
                  ? 'bg-cyan-900/60 text-cyan-300/60 border border-cyan-500/40 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 text-black border-2 border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] active:translate-y-1 active:shadow-none hover:brightness-105'
            }`}
          >
            {disabled ? (
              <>
                <div className="size-5 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
                <span>INTRUDING...</span>
              </>
            ) : insufficientBalance ? (
              <span>CREDITS EXHAUSTED</span>
            ) : (
              <>
                <span>⚡</span>
                <span>EXECUTE BREACH</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
