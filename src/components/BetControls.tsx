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
  const insufficientBalance = wager > balance;

  const handleAdjust = (val: number) => {
    soundFx.playBlip(650);
    const clamped = Math.max(0.1, Math.min(balance, Number(val.toFixed(2))));
    setWager(clamped);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0d121c] p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Left: Stake Configuration */}
        <div className="w-full lg:w-3/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/60 uppercase">INTRUSION STAKE ({symbol})</span>
            <span className="text-white/40">
              MIN: 0.10 • MAX: {maxWager.toFixed(2)} {symbol}
            </span>
          </div>

          {/* Amount Input with Half / Double Buttons */}
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
                className="w-full bg-[#151c2a] border border-cyan-500/30 rounded-xl px-4 py-2.5 font-mono text-lg font-bold text-white focus:outline-none focus:border-cyan-400"
              />
              <span className="absolute right-3 top-3 text-xs font-mono text-cyan-400/80">
                {symbol}
              </span>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAdjust(wager / 2)}
              className="px-3 py-2.5 rounded-xl border border-white/10 bg-[#151c2a] text-xs font-mono hover:border-cyan-500/40 text-white/80 cursor-pointer disabled:opacity-50"
            >
              ½x
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAdjust(wager * 2)}
              className="px-3 py-2.5 rounded-xl border border-white/10 bg-[#151c2a] text-xs font-mono hover:border-cyan-500/40 text-white/80 cursor-pointer disabled:opacity-50"
            >
              2x
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAdjust(balance)}
              className="px-3 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900/50 cursor-pointer disabled:opacity-50"
            >
              MAX
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                disabled={disabled}
                onClick={() => handleAdjust(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-pointer transition-colors ${
                  wager === amt
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                    : 'border-white/5 bg-[#121722] text-white/60 hover:text-white'
                }`}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Potential Win & Action Button */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between gap-3 pt-3 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/50">POTENTIAL WIN:</span>
            <span
              className="font-orbitron font-extrabold text-base"
              style={{ color: config.accentColor }}
            >
              +{potentialWin} {symbol} ({config.multiplier.toFixed(2)}x)
            </span>
          </div>

          <button
            type="button"
            disabled={disabled || insufficientBalance || wager <= 0}
            onClick={onBreach}
            style={{
              boxShadow: disabled
                ? 'none'
                : `0 0 25px ${config.accentColor}60, inset 0 0 15px ${config.accentColor}40`,
            }}
            className={`w-full py-3.5 rounded-xl font-orbitron font-black text-sm sm:text-base tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
              disabled
                ? 'bg-white/10 text-white/40 border border-white/10'
                : insufficientBalance
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                  : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-black hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            {disabled
              ? 'DECRYPTING ICE...'
              : insufficientBalance
                ? 'INSUFFICIENT BALANCE'
                : `BREACH VAULT • ${wager.toFixed(2)} ${symbol}`}
          </button>
        </div>
      </div>
    </div>
  );
};
