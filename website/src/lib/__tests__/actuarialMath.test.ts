import { describe, it, expect } from 'vitest';
import {
  survivalStatic,
  survivalWithImprovement,
  survivalAsymptote,
  levThresholdR,
  analyticPercentile,
  computeScenario,
  computeSensitivity,
  computePersonalScenario,
  agingBackground,
  survivalUnderAging,
  survivalAtTime,
} from '../actuarialMath';
import { DEFAULT_PARAMS, CURRENT_YEAR } from '../constants';
import type { UserProfile } from '../types';

const base = (): UserProfile => ({
  name: 'Test',
  countryCode: 'US',
  currentAge: 30,
  incomePercentile: 50,
  riskAppetite: 50,
  treatmentYear: 2040,
});

describe('core survival functions', () => {
  it('static survival starts at 1 and decays as exp(-p t)', () => {
    expect(survivalStatic(0, 0.01)).toBe(1);
    expect(survivalStatic(100, 0.01)).toBeCloseTo(Math.exp(-1), 6);
  });

  it('time-varying survival reduces to static when r = 0', () => {
    expect(survivalWithImprovement(50, 0.001, 0)).toBeCloseTo(survivalStatic(50, 0.001), 10);
  });

  it('asymptote is exp(-p0/r), and zero with no improvement', () => {
    expect(survivalAsymptote(0.001, 0.01)).toBeCloseTo(0.905, 3);
    expect(survivalAsymptote(0.001, 0)).toBe(0);
  });

  it('LEV threshold is p0 / ln 2 and yields a 50% floor', () => {
    const r = levThresholdR(0.001);
    expect(r).toBeCloseTo(0.001443, 5);
    expect(survivalAsymptote(0.001, r)).toBeCloseTo(0.5, 6);
  });
});

describe('analyticPercentile', () => {
  it('static median is ln2 / p0 (the 770-year headline)', () => {
    expect(analyticPercentile(0.0009, 0, 50)).toBeCloseTo(Math.LN2 / 0.0009, 4);
    expect(analyticPercentile(0.0009, 0, 50)).toBeCloseTo(770.2, 0);
  });

  it('returns Infinity when the target survival sits at or below the floor', () => {
    // moderate improvement: floor ≈ 0.835, so the median (0.5) is never reached
    expect(analyticPercentile(0.0009, 0.005, 50)).toBe(Infinity);
    // but the 10th percentile (S = 0.9 > floor) is finite
    expect(analyticPercentile(0.0009, 0.005, 10)).toBeGreaterThan(0);
    expect(analyticPercentile(0.0009, 0.005, 10)).toBeLessThan(Infinity);
  });

  it('is not limited by the 300-year chart horizon', () => {
    // Very safe person: median far beyond 300 years but still finite.
    const m = analyticPercentile(0.00025, 0, 50);
    expect(m).toBeGreaterThan(300);
    expect(Number.isFinite(m)).toBe(true);
  });
});

describe('computeScenario', () => {
  it('frozen-world defaults reproduce the Section 01 headline numbers', () => {
    const r = computeScenario({ ...DEFAULT_PARAMS, advancementScenario: 'static' });
    expect(r.expectedLifespan).toBeCloseTo(1 / 0.0009, 3);
    expect(r.medianLifespan).toBeCloseTo(770.2, 0);
    expect(r.asymptote).toBe(0);
  });

  it('long-horizon death probabilities are exact, not truncated at the chart edge', () => {
    const r = computeScenario({ ...DEFAULT_PARAMS, advancementScenario: 'static' });
    expect(r.probDeadBefore.y1000).toBeCloseTo(1 - Math.exp(-0.0009 * 1000), 6);
    expect(r.probDeadBefore.y2000).toBeGreaterThan(r.probDeadBefore.y1000);
  });

  it('turning progress on lifts the floor above zero', () => {
    const r = computeScenario({ ...DEFAULT_PARAMS, advancementScenario: 'moderate' });
    expect(r.asymptote).toBeGreaterThan(0.5);
    expect(r.medianLifespan).toBe(Infinity);
  });
});

describe('agingBackground — the aging-scenario controls must move the answer', () => {
  it('halted at the reference age equals the plain risk-adjusted rate', () => {
    const halted30 = agingBackground({ ...DEFAULT_PARAMS, agingScenario: 'halted', biologicalAge: 30 });
    expect(halted30).toBeCloseTo(DEFAULT_PARAMS.p0, 10);
  });

  it('holding at an older age is worse; reversed ignores the held age', () => {
    const h30 = agingBackground({ ...DEFAULT_PARAMS, agingScenario: 'halted', biologicalAge: 30 });
    const h55 = agingBackground({ ...DEFAULT_PARAMS, agingScenario: 'halted', biologicalAge: 55 });
    const rev55 = agingBackground({ ...DEFAULT_PARAMS, agingScenario: 'reversed', biologicalAge: 55 });
    expect(h55).toBeGreaterThan(h30);
    expect(rev55).toBeCloseTo(h30, 10);
  });

  it('slowed aging is strictly worse than halted', () => {
    const halted = agingBackground({ ...DEFAULT_PARAMS, agingScenario: 'halted' });
    const slowed = agingBackground({ ...DEFAULT_PARAMS, agingScenario: 'slowed' });
    expect(slowed).toBeGreaterThan(halted);
  });
});

describe('pre-treatment aging (Gompertz–Makeham)', () => {
  it('survival is monotone decreasing in duration and worse for older starters', () => {
    expect(survivalUnderAging(30, 0, 1, 0.0009)).toBe(1);
    expect(survivalUnderAging(30, 10, 1, 0.0009)).toBeGreaterThan(survivalUnderAging(30, 20, 1, 0.0009));
    expect(survivalUnderAging(25, 10, 1, 0.0009)).toBeGreaterThan(survivalUnderAging(75, 10, 1, 0.0009));
  });

  it('calibration: roughly 1.5% all-cause hazard at 30 and ~5-6% at 80', () => {
    // one-year survival ≈ 1 - hazard
    const s30 = 1 - survivalUnderAging(30, 1, 1, 0.0009);
    const s80 = 1 - survivalUnderAging(80, 1, 1, 0.0009);
    expect(s30).toBeGreaterThan(0.001);
    expect(s30).toBeLessThan(0.003);
    expect(s80).toBeGreaterThan(0.04);
    expect(s80).toBeLessThan(0.08);
  });
});

describe('computePersonalScenario — age and launch year drive the outcome', () => {
  it('waitYears = max(0, launch + access delay - now)', () => {
    const p = computePersonalScenario({ ...base(), treatmentYear: 2040 }, 'static');
    expect(p.waitYears).toBeCloseTo(Math.max(0, 2040 + p.accessDelayYears - CURRENT_YEAR), 6);
    expect(p.ageAtAccess).toBeCloseTo(30 + p.waitYears, 6);
  });

  it('a young person with an early launch almost certainly reaches treatment', () => {
    const p = computePersonalScenario({ ...base(), currentAge: 25, treatmentYear: 2030, incomePercentile: 90 }, 'moderate');
    expect(p.survivesToTreatment).toBeGreaterThan(0.9);
  });

  it('an old person facing a late launch almost certainly does not', () => {
    const p = computePersonalScenario({ ...base(), currentAge: 78, treatmentYear: 2065 }, 'moderate');
    expect(p.survivesToTreatment).toBeLessThan(0.05);
    expect(p.asymptote).toBeLessThan(0.05);
  });

  it('probabilities stay in range and the asymptote never exceeds reaching treatment', () => {
    const p = computePersonalScenario(base(), 'moderate');
    expect(p.asymptote).toBeGreaterThanOrEqual(0);
    expect(p.asymptote).toBeLessThanOrEqual(p.survivesToTreatment + 1e-9);
    expect(p.probDeadBefore.y100).toBeGreaterThanOrEqual(0);
    expect(p.probDeadBefore.y1000).toBeGreaterThanOrEqual(p.probDeadBefore.y100);
  });

  it('higher everyday exposure lowers survival; a safer country raises it', () => {
    const safe = computePersonalScenario({ ...base(), riskAppetite: 10 }, 'moderate');
    const risky = computePersonalScenario({ ...base(), riskAppetite: 90 }, 'moderate');
    expect(risky.effectiveP0).toBeGreaterThan(safe.effectiveP0);
    const jp = computePersonalScenario({ ...base(), countryCode: 'JP' }, 'moderate');
    expect(jp.effectiveP0).toBeLessThan(computePersonalScenario(base(), 'moderate').effectiveP0);
  });

  it('survivalAtTime interpolates on a shifted (fractional-t) curve', () => {
    const p = computePersonalScenario({ ...base(), incomePercentile: 37 }, 'static');
    const s = survivalAtTime(p.survivalCurve, 150.5);
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThan(1);
  });
});

describe('computeSensitivity', () => {
  it('varies the three inputs that actually move the floor, sorted by impact', () => {
    const entries = computeSensitivity(DEFAULT_PARAMS);
    expect(entries).toHaveLength(3);
    const impact = (e: (typeof entries)[number]) => Math.max(Math.abs(e.lowDelta), Math.abs(e.highDelta));
    for (let i = 1; i < entries.length; i++) expect(impact(entries[i - 1])).toBeGreaterThanOrEqual(impact(entries[i]));
    entries.forEach((e) => expect(impact(e)).toBeGreaterThan(0));
  });
});
