import React from 'react';
import { INTRUSION_MODES, type IntrusionMode } from '../lib/math';
import { soundFx } from '../lib/audio';

interface VectorPickerProps {
  selectedMode: IntrusionMode;
  onSelectMode: (mode: IntrusionMode) => void;
  disabled: boolean;
}

const VECTOR_ICONS: Record<IntrusionMode, string> = {
  0: '👻',
  1: '⚡',
  2: '💎',
  3: '☢️',
};

export const VectorPicker: React.FC<VectorPickerProps> = ({
  selectedMode,
  onSelectMode,
  disabled,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
          INTRUSION VECTOR BAY
        </span>
        <span className="font-mono text-[11px] text-white/50">
          PROVABLE FAIRNESS: <strong className="text-emerald-400">96.5000% EXACT RTP</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {(Object.values(INTRUSION_MODES) as (typeof INTRUSION_MODES)[IntrusionMode][]).map((v) => {
          const isSelected = selectedMode === v.id;
          const icon = VECTOR_ICONS[v.id];

          return (
            <button
              key={v.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelectMode(v.id);
                soundFx.playClick(600 + v.id * 180);
              }}
              className={`relative text-left p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed group overflow-hidden ${
                isSelected
                  ? 'bg-[#11192b] border-opacity-100 scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                  : 'bg-[#0a0f1a]/80 border-white/10 hover:border-white/25 hover:bg-[#0e1524]'
              }`}
              style={{
                borderColor: isSelected ? v.accentColor : undefined,
                boxShadow: isSelected ? `0 0 20px ${v.accentColor}35` : undefined,
              }}
            >
              {/* Top Highlight Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                }`}
                style={{ backgroundColor: v.accentColor }}
              />

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{icon}</span>
                  <span className="font-mono text-xs font-bold text-white/70">{v.code}</span>
                </div>
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

              <div className="font-orbitron font-extrabold text-sm sm:text-base text-white tracking-wide mb-1">
                {v.name}
              </div>

              <p className="text-[11px] text-white/50 font-mono mb-2 line-clamp-1">
                {v.subtitle}
              </p>

              {/* Mini Probability Gauge */}
              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (v.winProbabilityPercent / 80.42) * 100)}%`,
                    backgroundColor: v.accentColor,
                  }}
                />
              </div>

              <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-white/40 block font-mono">MULTIPLIER</span>
                  <span
                    className="font-orbitron font-black text-xl sm:text-2xl tracking-tight"
                    style={{ color: v.accentColor }}
                  >
                    {v.multiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/40 block font-mono">CHANCE</span>
                  <span className="font-mono font-bold text-xs text-white/90">
                    {v.winProbabilityPercent.toFixed(1)}%
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
