import React from 'react';
import { INTRUSION_MODES, type IntrusionMode } from '../lib/math';
import { soundFx } from '../lib/audio';

interface VectorPickerProps {
  selectedMode: IntrusionMode;
  onSelectMode: (mode: IntrusionMode) => void;
  disabled: boolean;
}

export const VectorPicker: React.FC<VectorPickerProps> = ({
  selectedMode,
  onSelectMode,
  disabled,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-wider text-cyan-400/90 font-semibold flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
          SELECT INTRUSION VECTOR
        </span>
        <span className="font-mono text-[11px] text-white/50">
          ALL MODES UNIFORM RTP: <strong className="text-emerald-400">96.50%</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {(Object.values(INTRUSION_MODES) as typeof INTRUSION_MODES[IntrusionMode][]).map((v) => {
          const isSelected = selectedMode === v.id;
          return (
            <button
              key={v.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelectMode(v.id);
                soundFx.playBlip(750 + v.id * 150);
              }}
              className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
                isSelected
                  ? `bg-[#131b2c] ${v.glowClass} border-opacity-100 scale-[1.02]`
                  : 'bg-[#0f141f]/80 border-white/10 hover:border-white/20 hover:bg-[#131926]'
              }`}
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-3 right-3 h-[2px] rounded-full transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundColor: v.accentColor }}
              />

              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-white/50">{v.code}</span>
                <span
                  className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                  style={{
                    color: v.accentColor,
                    backgroundColor: `${v.accentColor}18`,
                    border: `1px solid ${v.accentColor}40`,
                  }}
                >
                  {v.riskTier}
                </span>
              </div>

              <div className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide mb-1">
                {v.name}
              </div>

              <p className="text-[11px] text-white/50 font-mono mb-3 line-clamp-1">
                {v.subtitle}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-white/40 block font-mono">PAYOUT</span>
                  <span
                    className="font-orbitron font-extrabold text-lg sm:text-xl"
                    style={{ color: v.accentColor }}
                  >
                    {v.multiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/40 block font-mono">WIN CHANCE</span>
                  <span className="font-mono font-bold text-xs text-white/80">
                    {v.winProbabilityPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
