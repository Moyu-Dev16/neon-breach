import React from 'react';
import { soundFx } from '../lib/audio';

export interface LootItem {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  condition: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export const INITIAL_LOOT_ITEMS: LootItem[] = [
  {
    id: 'loot-1',
    name: 'Ghost Rootkit v1.2',
    rarity: 'Common',
    description: 'A discreet micro-daemon that bypasses perimeter ping filters.',
    condition: 'Score a successful breach on Ghost Bypass vector.',
    icon: '👻',
    color: '#06b6d4',
    unlocked: false,
  },
  {
    id: 'loot-2',
    name: 'Cryo-Frequency Injector',
    rarity: 'Common',
    description: 'Liquid nitrogen coolant pump designed for 2.00x clock surges.',
    condition: 'Score a successful breach on Overclock Surge vector.',
    icon: '⚡',
    color: '#10b981',
    unlocked: false,
  },
  {
    id: 'loot-3',
    name: 'Quantum Phase Drill',
    rarity: 'Rare',
    description: 'Sub-atomic laser chisel capable of puncturing 5-layer cryptographic locks.',
    condition: 'Extract loot on Quantum Drill (5.00x).',
    icon: '💎',
    color: '#a855f7',
    unlocked: false,
  },
  {
    id: 'loot-4',
    name: 'Zero-Day Kernel 0xFE',
    rarity: 'Legendary',
    description: 'Unpatched root-level exploit payload causing catastrophic 20x vault rupture.',
    condition: 'Hit the 20.00x jackpot on Zero-Day Explode!',
    icon: '☢️',
    color: '#eab308',
    unlocked: false,
  },
  {
    id: 'loot-5',
    name: 'Triple-Threat Cipher Key',
    rarity: 'Rare',
    description: 'Synchronized cryptographic key that verifies 3 consecutive penetrations.',
    condition: 'Reach a 3-win intrusion streak.',
    icon: '🗝️',
    color: '#38bdf8',
    unlocked: false,
  },
  {
    id: 'loot-6',
    name: 'Neuro-Link Datapad',
    rarity: 'Epic',
    description: 'Military-grade direct neural interface recording classified memory nodes.',
    condition: 'Reach a 5-win intrusion streak.',
    icon: '🧠',
    color: '#ec4899',
    unlocked: false,
  },
  {
    id: 'loot-7',
    name: 'DEFCON-1 Override Dongle',
    rarity: 'Epic',
    description: 'Physical bypass bridge that overrides automated lockdown protocols.',
    condition: 'Max out Intrusion Heat to Level 4 (DEFCON-1).',
    icon: '🚨',
    color: '#f97316',
    unlocked: false,
  },
  {
    id: 'loot-8',
    name: 'Genesis Vault Token',
    rarity: 'Legendary',
    description: 'The fabled cryptographic genesis token commemorating high-roller plunder.',
    condition: 'Accumulate over 500.00 credits in single-session vault plunder.',
    icon: '🪙',
    color: '#facc15',
    unlocked: false,
  },
];

interface LootCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export const LootCodexModal: React.FC<LootCodexModalProps> = ({
  isOpen,
  onClose,
  unlockedIds,
}) => {
  if (!isOpen) return null;

  const unlockedCount = unlockedIds.length;
  const totalCount = INITIAL_LOOT_ITEMS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-cyan-500/40 bg-[#070b13] p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] crt-screen max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-lg">
              💾
            </div>
            <div>
              <h3 className="font-orbitron font-extrabold text-lg text-white flex items-center gap-2">
                DARKNET LOOT CODEX
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {unlockedCount}/{totalCount} UNLOCKED
                </span>
              </h3>
              <p className="text-xs font-mono text-white/50">
                Classified cyber relics recovered from security intrusions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(600);
              onClose();
            }}
            className="size-8 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center font-mono text-white/70 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Loot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 py-1 flex-1">
          {INITIAL_LOOT_ITEMS.map((item) => {
            const isUnlocked = unlockedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`relative rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'border-white/20 bg-[#0d1422] shadow-sm'
                    : 'border-white/5 bg-[#0a0d14]/60 opacity-50 grayscale'
                }`}
                style={{
                  borderColor: isUnlocked ? `${item.color}40` : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4
                          className="font-orbitron font-bold text-sm"
                          style={{ color: isUnlocked ? item.color : '#94a3b8' }}
                        >
                          {item.name}
                        </h4>
                        <span
                          className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border"
                          style={{
                            borderColor: `${item.color}60`,
                            color: item.color,
                            backgroundColor: `${item.color}15`,
                          }}
                        >
                          {item.rarity}
                        </span>
                      </div>
                    </div>
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        OWNED
                      </span>
                    ) : (
                      <span className="text-white/40 font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded">
                        LOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-white/60 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span className="truncate max-w-[210px]">
                    REQ: {item.condition}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
          <span>Relics stored persistently in client local vault storage.</span>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(700);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-orbitron text-xs cursor-pointer"
          >
            RETURN TO DECK
          </button>
        </div>
      </div>
    </div>
  );
};
