export const MODULO_BASE = 12000;
export const TARGET_RTP_PERCENT = 96.5;

export type IntrusionMode = 0 | 1 | 2 | 3;

export interface ModeConfig {
  id: IntrusionMode;
  code: string;
  name: string;
  subtitle: string;
  multiplier: number;
  multiplierBps: number;
  winThreshold: number;
  winProbabilityPercent: number;
  riskTier: 'STEALTH' | 'BALANCED' | 'HIGH' | 'CRITICAL';
  accentColor: string;
  glowClass: string;
  icon: string;
}

export const INTRUSION_MODES: Record<IntrusionMode, ModeConfig> = {
  0: {
    id: 0,
    code: 'VEC-00',
    name: 'GHOST BYPASS',
    subtitle: 'Low-profile proxy tunneling',
    multiplier: 1.2,
    multiplierBps: 12000,
    winThreshold: 9650,
    winProbabilityPercent: (9650 / 12000) * 100, // 80.416666...%
    riskTier: 'STEALTH',
    accentColor: '#10b981', // emerald
    glowClass: 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    icon: 'ShieldCheck',
  },
  1: {
    id: 1,
    code: 'VEC-01',
    name: 'OVERCLOCK SURGE',
    subtitle: 'Overclocked optical relay burst',
    multiplier: 2.0,
    multiplierBps: 20000,
    winThreshold: 5790,
    winProbabilityPercent: (5790 / 12000) * 100, // 48.25%
    riskTier: 'BALANCED',
    accentColor: '#06b6d4', // cyan
    glowClass: 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    icon: 'Cpu',
  },
  2: {
    id: 2,
    code: 'VEC-02',
    name: 'QUANTUM DRILL',
    subtitle: 'Sub-atomic ICE penetration',
    multiplier: 5.0,
    multiplierBps: 50000,
    winThreshold: 2316,
    winProbabilityPercent: (2316 / 12000) * 100, // 19.30%
    riskTier: 'HIGH',
    accentColor: '#a855f7', // purple
    glowClass: 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    icon: 'Zap',
  },
  3: {
    id: 3,
    code: 'VEC-03',
    name: 'ZERO-DAY EXPLODE',
    subtitle: 'Unpatched kernel zero-day exploit',
    multiplier: 20.0,
    multiplierBps: 200000,
    winThreshold: 579,
    winProbabilityPercent: (579 / 12000) * 100, // 4.825%
    riskTier: 'CRITICAL',
    accentColor: '#f43f5e', // rose
    glowClass: 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.25)]',
    icon: 'Flame',
  },
};

export interface BreachOutcome {
  won: boolean;
  mode: IntrusionMode;
  roll: number;
  threshold: number;
  multiplier: number;
  payoutWagerRatio: number;
  netMultiplier: number;
}

/**
 * Calculates outcome from a VRF random seed or integer roll.
 */
export function resolveBreachOutcome(mode: IntrusionMode, randomWord: bigint | number): BreachOutcome {
  const config = INTRUSION_MODES[mode];
  const num = typeof randomWord === 'bigint' ? Number(randomWord % BigInt(MODULO_BASE)) : randomWord % MODULO_BASE;
  const roll = Math.abs(num);
  const won = roll < config.winThreshold;

  return {
    won,
    mode,
    roll,
    threshold: config.winThreshold,
    multiplier: config.multiplier,
    payoutWagerRatio: won ? config.multiplier : 0,
    netMultiplier: won ? config.multiplier - 1.0 : -1.0,
  };
}

/**
 * Validates the theoretical RTP for a given mode.
 * Returns exact floating point RTP percent (e.g. 96.50000...).
 */
export function computeExactRtp(mode: IntrusionMode): number {
  const config = INTRUSION_MODES[mode];
  const prob = config.winThreshold / MODULO_BASE;
  return prob * config.multiplier * 100;
}
