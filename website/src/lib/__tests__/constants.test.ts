import { describe, it, expect } from 'vitest';
import { riskAppetiteToMultiplier, incomeToQuintile, COUNTRIES, DEFAULT_COUNTRY_CODE, MORTALITY_COMPONENTS, BASE_US_P0, DEFAULT_PARAMS } from '../constants';
import { levThresholdR } from '../actuarialMath';

describe('riskAppetiteToMultiplier', () => {
  it('is neutral at the midpoint and spans 0.5× to 4×', () => {
    expect(riskAppetiteToMultiplier(0)).toBeCloseTo(0.5, 10);
    expect(riskAppetiteToMultiplier(50)).toBeCloseTo(1.0, 10);
    expect(riskAppetiteToMultiplier(100)).toBeCloseTo(4.0, 10);
  });
  it('is monotone increasing', () => {
    for (let a = 1; a <= 100; a++) expect(riskAppetiteToMultiplier(a)).toBeGreaterThan(riskAppetiteToMultiplier(a - 1));
  });
});

describe('incomeToQuintile', () => {
  it('maps percentiles onto the five income groups at the right boundaries', () => {
    expect(incomeToQuintile(0)).toBe(1);
    expect(incomeToQuintile(19)).toBe(1);
    expect(incomeToQuintile(20)).toBe(2);
    expect(incomeToQuintile(40)).toBe(3);
    expect(incomeToQuintile(60)).toBe(4);
    expect(incomeToQuintile(80)).toBe(5);
    expect(incomeToQuintile(100)).toBe(5);
  });
});

describe('COUNTRIES', () => {
  it('includes the default and keeps every multiplier and access rank in range', () => {
    expect(COUNTRIES.some((c) => c.code === DEFAULT_COUNTRY_CODE)).toBe(true);
    expect(new Set(COUNTRIES.map((c) => c.code)).size).toBe(COUNTRIES.length);
    COUNTRIES.forEach((c) => {
      expect(c.mortalityMultiplier).toBeGreaterThan(0);
      expect(c.accessRank).toBeGreaterThanOrEqual(0);
      expect(c.accessRank).toBeLessThanOrEqual(1);
    });
  });
});

describe('mortality decomposition', () => {
  it('the by-cause rates sum to the headline background rate (per 100k → fraction)', () => {
    const total = MORTALITY_COMPONENTS.reduce((s, c) => s + c.rate, 0) / 100_000;
    expect(total).toBeCloseTo(90 / 100_000, 9);
    expect(total).toBeCloseTo(DEFAULT_PARAMS.p0, 9);
  });

  it('BASE_US_P0 matches the default model parameter', () => {
    expect(BASE_US_P0).toBe(DEFAULT_PARAMS.p0);
  });

  it('the LEV threshold (p0/ln2) is about 0.13%/yr', () => {
    expect(levThresholdR(DEFAULT_PARAMS.p0)).toBeCloseTo(0.0013, 4);
  });
});
