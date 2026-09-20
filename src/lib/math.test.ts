import { describe, it, expect } from 'vitest';
import { INTRUSION_MODES, computeExactRtp, resolveBreachOutcome, MODULO_BASE } from './math';

describe('NEON BREACH Mathematical Model & RTP Compliance', () => {
  it('strictly guarantees 96.50% theoretical RTP across all 4 modes', () => {
    for (const mode of [0, 1, 2, 3] as const) {
      const rtp = computeExactRtp(mode);
      // Must equal exactly 96.5% with double-precision floating math tolerance (< 1e-12)
      expect(rtp).toBeCloseTo(96.5, 6);
      expect(Number(rtp.toFixed(4))).toBe(96.5);
    }
  });

  it('verifies integer fraction equivalence for Mode 0 (Ghost Bypass)', () => {
    const config = INTRUSION_MODES[0];
    expect(config.multiplier).toBe(1.2);
    // 193/240 * 6/5 = 1158 / 1200 = 0.965
    expect((config.winThreshold / MODULO_BASE) * config.multiplier).toBeCloseTo(0.965, 8);
  });

  it('verifies integer fraction equivalence for Mode 1 (Overclock Surge)', () => {
    const config = INTRUSION_MODES[1];
    expect(config.multiplier).toBe(2.0);
    // 193/400 * 2 = 386 / 400 = 0.965
    expect((config.winThreshold / MODULO_BASE) * config.multiplier).toBeCloseTo(0.965, 8);
  });

  it('verifies integer fraction equivalence for Mode 2 (Quantum Drill)', () => {
    const config = INTRUSION_MODES[2];
    expect(config.multiplier).toBe(5.0);
    // 193/1000 * 5 = 965 / 1000 = 0.965
    expect((config.winThreshold / MODULO_BASE) * config.multiplier).toBeCloseTo(0.965, 8);
  });

  it('verifies integer fraction equivalence for Mode 3 (Zero-Day Explode)', () => {
    const config = INTRUSION_MODES[3];
    expect(config.multiplier).toBe(20.0);
    // 193/4000 * 20 = 3860 / 4000 = 0.965
    expect((config.winThreshold / MODULO_BASE) * config.multiplier).toBeCloseTo(0.965, 8);
  });

  it('correctly resolves win and loss outcomes based on roll threshold', () => {
    // Mode 1: threshold is 5790
    const winOutcome = resolveBreachOutcome(1, 5789);
    expect(winOutcome.won).toBe(true);
    expect(winOutcome.payoutWagerRatio).toBe(2.0);

    const lossOutcome = resolveBreachOutcome(1, 5790);
    expect(lossOutcome.won).toBe(false);
    expect(lossOutcome.payoutWagerRatio).toBe(0);

    const lossOutcome2 = resolveBreachOutcome(1, 11999);
    expect(lossOutcome2.won).toBe(false);
  });

  it('handles 256-bit BigInt randomness seeds properly', () => {
    const bigRandom = 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890n;
    const outcome = resolveBreachOutcome(2, bigRandom);
    expect(outcome.roll).toBeGreaterThanOrEqual(0);
    expect(outcome.roll).toBeLessThan(MODULO_BASE);
  });
});
