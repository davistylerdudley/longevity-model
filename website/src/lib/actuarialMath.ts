import {
  ModelParameters,
  ScenarioResult,
  SurvivalPoint,
  StratificationResult,
  SensitivityEntry,
  UserProfile,
  PersonalScenario,
  AdvancementScenario,
} from './types';
import {
  RISK_PROFILES,
  ADVANCEMENT_R_VALUES,
  QUINTILE_DELAY_FRACTIONS,
  QUINTILE_LABELS,
  CHART_TMAX,
  CHART_STEP,
  COUNTRIES,
  BASE_US_P0,
  DEFAULT_COUNTRY_CODE,
  CURRENT_YEAR,
  GOMPERTZ_A,
  GOMPERTZ_B,
  riskAppetiteToMultiplier,
  incomeToQuintile,
} from './constants';

// ─── Core survival functions ──────────────────────────────────────────────────

/**
 * Static exponential survival: S(t) = exp(-p·t)
 * Baseline model with fixed annual background mortality rate p.
 */
export function survivalStatic(t: number, p: number): number {
  return Math.exp(-p * t);
}

/**
 * Time-varying survival with improving background mortality.
 * p(t) = p₀·exp(-r·t) → S(t) = exp(-p₀/r · (1 - exp(-r·t)))
 * Falls back to survivalStatic when r ≈ 0.
 */
export function survivalWithImprovement(t: number, p0: number, r: number): number {
  if (r < 1e-10) return survivalStatic(t, p0);
  const integral = (p0 / r) * (1 - Math.exp(-r * t));
  return Math.exp(-integral);
}

/**
 * Asymptotic survival probability S(∞) = exp(-p₀/r).
 * Represents the fraction of the population that survives indefinitely.
 * Returns 0 when r ≈ 0 (no technological improvement).
 */
export function survivalAsymptote(p0: number, r: number): number {
  if (r < 1e-10) return 0;
  return Math.exp(-p0 / r);
}

/**
 * Longevity Escape Velocity threshold.
 * The minimum r such that S(∞) = 50%: r_lev = p₀ / ln(2)
 */
export function levThresholdR(p0: number): number {
  return p0 / Math.LN2;
}

/**
 * Resolve the r value for a given advancement scenario.
 * 'lev' computes the threshold dynamically from the current p0.
 */
export function advancementToR(scenario: ModelParameters['advancementScenario'], p0: number): number {
  if (scenario === 'lev') return levThresholdR(p0);
  return ADVANCEMENT_R_VALUES[scenario] ?? 0;
}

/**
 * Apply risk profile multiplier to effective background mortality.
 */
export function applyRiskProfile(p0: number, profileId: ModelParameters['riskProfileId']): number {
  const profile = RISK_PROFILES.find((p) => p.id === profileId);
  return p0 * (profile?.mortalityMultiplier ?? 1);
}

/**
 * A body permanently held at an older biological age carries a modestly higher
 * baseline vulnerability (slower recovery, weaker immunity) than one held young.
 * Normalized so that holding at age 30 leaves the background rate unchanged.
 */
function frailtyMultiplier(biologicalAge: number): number {
  return 1 + Math.max(0, biologicalAge - 30) * 0.02;
}

/**
 * Effective non-aging background mortality after risk profile AND aging scenario.
 * This is what makes the aging-scenario / biological-age controls actually move
 * the curve:
 *  - reversed: body reset to a youthful baseline; no frailty penalty.
 *  - halted:   background × frailty(held age).
 *  - slowed:   halted, plus a residual aging hazard (aging never fully stops), so
 *              the curve keeps falling and has no survive-forever floor.
 */
export function agingBackground(params: ModelParameters): number {
  const risked = applyRiskProfile(params.p0, params.riskProfileId);
  if (params.agingScenario === 'reversed') return risked;
  const frailty = frailtyMultiplier(params.biologicalAge);
  if (params.agingScenario === 'halted') return risked * frailty;
  // slowed: aging continues at a reduced rate; add a residual Gompertz hazard.
  const residual = params.agingSlowFactor * GOMPERTZ_A * Math.exp(GOMPERTZ_B * params.biologicalAge);
  return risked * frailty + residual;
}

// ─── Curve generation ─────────────────────────────────────────────────────────

/**
 * Generate an array of SurvivalPoints from t=0 to tMax.
 */
export function generateSurvivalCurve(
  p0: number,
  r: number,
  tMax: number = CHART_TMAX,
  step: number = CHART_STEP,
): SurvivalPoint[] {
  const points: SurvivalPoint[] = [];
  for (let t = 0; t <= tMax; t += step) {
    points.push({ t, S: survivalWithImprovement(t, p0, r) });
  }
  return points;
}

/**
 * Find the time at which survival falls to (1 - p), i.e. the p-th percentile of the
 * lifespan distribution, by linear interpolation over the curve.
 * Returns Infinity if the curve never reaches the target (asymptote > target).
 */
export function survivalPercentile(curve: SurvivalPoint[], percentile: number): number {
  const target = 1 - percentile / 100;
  // If the final survival probability is above target, curve doesn't cross
  if (curve.length > 0 && curve[curve.length - 1].S > target) return Infinity;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].S <= target) {
      // Linear interpolation between i-1 and i
      const t0 = curve[i - 1].t, S0 = curve[i - 1].S;
      const t1 = curve[i].t, S1 = curve[i].S;
      const frac = (target - S0) / (S1 - S0);
      return t0 + frac * (t1 - t0);
    }
  }
  return Infinity;
}

export function computePercentiles(curve: SurvivalPoint[]) {
  return {
    p10: survivalPercentile(curve, 10),
    p25: survivalPercentile(curve, 25),
    p50: survivalPercentile(curve, 50),
    p75: survivalPercentile(curve, 75),
    p90: survivalPercentile(curve, 90),
  };
}

/**
 * Closed-form percentile of the lifespan distribution for the background model,
 * so we aren't limited by the length of the plotted curve (medians can run to
 * hundreds or thousands of years). Returns Infinity when the target survival
 * level is never reached (i.e. it sits at or below the asymptote).
 */
export function analyticPercentile(p0: number, r: number, percentile: number): number {
  const L = 1 - percentile / 100; // target survival fraction
  const a = survivalAsymptote(p0, r);
  if (L <= a) return Infinity;
  if (r < 1e-10) return -Math.log(L) / p0; // static exponential
  const inner = 1 + (r * Math.log(L)) / p0;
  if (inner <= 0) return Infinity;
  return -Math.log(inner) / r;
}

export function analyticPercentiles(p0: number, r: number) {
  return {
    p10: analyticPercentile(p0, r, 10),
    p25: analyticPercentile(p0, r, 25),
    p50: analyticPercentile(p0, r, 50),
    p75: analyticPercentile(p0, r, 75),
    p90: analyticPercentile(p0, r, 90),
  };
}

/**
 * Expected lifespan from numerical integration of S(t).
 * E[T] = ∫₀^∞ S(t) dt
 * For static model (r=0): E[T] = 1/p₀ (closed form).
 * For time-varying model with r > 0: diverges (Infinity) because S(∞) > 0.
 */
export function expectedLifespan(p0: number, r: number): number {
  if (r < 1e-10) return 1 / p0;
  return Infinity; // Non-zero asymptote implies infinite expected lifespan
}

/**
 * Survival probability at an arbitrary time, interpolated by t-value.
 * Works on curves whose points are not indexed at integer t (e.g. the
 * personal combined curve, which is shifted by a fractional access delay).
 */
export function survivalAtTime(curve: SurvivalPoint[], years: number): number {
  if (curve.length === 0) return 0;
  if (years <= curve[0].t) return curve[0].S;
  if (years >= curve[curve.length - 1].t) return curve[curve.length - 1].S;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].t >= years) {
      const t0 = curve[i - 1].t, S0 = curve[i - 1].S;
      const t1 = curve[i].t, S1 = curve[i].S;
      const frac = t1 === t0 ? 0 : (years - t0) / (t1 - t0);
      return S0 + frac * (S1 - S0);
    }
  }
  return curve[curve.length - 1].S;
}

/**
 * Probability of dying before a given time t (unconditional).
 * = 1 - S(t)
 */
export function probDeadBefore(curve: SurvivalPoint[], years: number): number {
  return 1 - survivalAtTime(curve, years);
}

// ─── Full scenario computation ────────────────────────────────────────────────

export function computeScenario(params: ModelParameters): ScenarioResult {
  const effectiveP0 = agingBackground(params);
  const r = advancementToR(params.advancementScenario, effectiveP0);

  const curve = generateSurvivalCurve(effectiveP0, r, CHART_TMAX, CHART_STEP);
  const asymptote = survivalAsymptote(effectiveP0, r);
  // Percentiles and long-horizon death probabilities are computed in closed
  // form, not read off the 300-year chart curve, so a 770-year median isn't
  // truncated to "never reached".
  const percentiles = analyticPercentiles(effectiveP0, r);

  const agingLabel: Record<string, string> = {
    slowed: 'Slowed Aging',
    halted: 'Halted Aging',
    reversed: 'Reversed Aging',
  };
  const advLabel: Record<string, string> = {
    static: 'No Improvement',
    moderate: 'Moderate (0.5%/yr)',
    aggressive: 'Aggressive (2%/yr)',
    lev: 'LEV Threshold',
  };

  return {
    scenarioLabel: `${agingLabel[params.agingScenario]} + ${advLabel[params.advancementScenario]}`,
    agingScenario: params.agingScenario,
    advancementScenario: params.advancementScenario,
    survivalCurve: curve,
    asymptote,
    expectedLifespan: expectedLifespan(effectiveP0, r),
    medianLifespan: percentiles.p50,
    percentiles,
    probDeadBefore: {
      y100: 1 - survivalWithImprovement(100, effectiveP0, r),
      y500: 1 - survivalWithImprovement(500, effectiveP0, r),
      y1000: 1 - survivalWithImprovement(1000, effectiveP0, r),
      y2000: 1 - survivalWithImprovement(2000, effectiveP0, r),
    },
  };
}

// ─── Combined pre/post trajectories ───────────────────────────────────────────

// Long horizon used for untruncated medians and long-run death probabilities.
const PCT_TMAX = 20000;
const PCT_STEP = 20;

/**
 * Append a post-treatment background-mortality tail (halted aging) onto a
 * pre-treatment phase, scaled by the probability of reaching treatment and
 * shifted to start at the access time.
 */
function extendCombined(
  preArr: SurvivalPoint[],
  effectiveP0: number,
  r: number,
  shift: number,
  preSurvival: number,
  tMax: number,
  step: number,
): SurvivalPoint[] {
  const post = generateSurvivalCurve(effectiveP0, r, tMax, step)
    .filter((pt) => pt.t > 0)
    .map((pt) => ({ t: pt.t + shift, S: preSurvival * pt.S }));
  return [...preArr, ...post];
}

// ─── Stratification ───────────────────────────────────────────────────────────

export function computeStratification(
  params: ModelParameters,
): StratificationResult[] {
  const effectiveP0 = agingBackground(params);
  const r = advancementToR(params.advancementScenario, effectiveP0);
  const maxDelay = params.maxAccessDelayYears;

  return ([5, 4, 3, 2, 1] as const).map((quintile) => {
    const delayFraction = QUINTILE_DELAY_FRACTIONS[quintile];
    const accessDelay = maxDelay * delayFraction;

    // Before access: aging-inclusive mortality (roughly 10× higher than background)
    const agingMortality = params.p0 * 10; // current aging-inclusive mortality rate
    const preSurvival = survivalStatic(accessDelay, agingMortality);

    // Pre-access phase: aging mortality applies
    const preArr: SurvivalPoint[] = Array.from({ length: Math.round(accessDelay) }, (_, i) => ({
      t: i,
      S: survivalStatic(i, agingMortality),
    }));

    // Chart curve (300y) and a long curve for an untruncated median.
    const combinedCurve = extendCombined(preArr, effectiveP0, r, accessDelay, preSurvival, CHART_TMAX, CHART_STEP);
    const longCombined = extendCombined(preArr, effectiveP0, r, accessDelay, preSurvival, PCT_TMAX, PCT_STEP);

    const asymptote = preSurvival * survivalAsymptote(effectiveP0, r);
    const median = survivalPercentile(longCombined, 50);

    return {
      quintile,
      label: QUINTILE_LABELS[quintile],
      accessDelayYears: accessDelay,
      survivalCurve: combinedCurve,
      asymptote,
      medianLifespan: median,
    };
  });
}

// ─── Sensitivity analysis ─────────────────────────────────────────────────────
//
// The survival asymptote S(∞) = exp(-p₀/r) depends only on the effective
// background mortality (p₀ × risk multiplier) and the improvement rate r.
// Biological age and access delay don't enter it, so we vary the three
// parameters that actually move the answer.

export function computeSensitivity(
  baseParams: ModelParameters,
  variationFraction = 0.5,
): SensitivityEntry[] {
  const baseP0 = applyRiskProfile(baseParams.p0, baseParams.riskProfileId);
  // Use a representative improvement rate; if the current scenario is static,
  // anchor sensitivity around the moderate rate so the r bar is meaningful.
  const baseR =
    advancementToR(baseParams.advancementScenario, baseP0) ||
    ADVANCEMENT_R_VALUES['moderate'];
  const baseAsymptote = survivalAsymptote(baseP0, baseR);

  const entries: SensitivityEntry[] = [];

  const push = (
    parameter: string,
    baseValue: number,
    lowValue: number,
    highValue: number,
    lowAsymptote: number,
    highAsymptote: number,
  ) => {
    entries.push({
      parameter,
      baseValue,
      lowValue,
      highValue,
      baseAsymptote,
      lowAsymptote,
      highAsymptote,
      lowDelta: lowAsymptote - baseAsymptote,
      highDelta: highAsymptote - baseAsymptote,
    });
  };

  // 1. Background mortality p₀
  const p0Low = baseP0 * (1 - variationFraction);
  const p0High = baseP0 * (1 + variationFraction);
  push(
    'Background mortality (p₀)',
    baseP0,
    p0Low,
    p0High,
    // lower mortality → higher survival, so low p₀ = high asymptote
    survivalAsymptote(p0Low, baseR),
    survivalAsymptote(p0High, baseR),
  );

  // 2. Technological improvement rate r
  const rLow = baseR * (1 - variationFraction);
  const rHigh = baseR * (1 + variationFraction);
  push(
    'Improvement rate (r)',
    baseR,
    rLow,
    rHigh,
    survivalAsymptote(baseP0, rLow),
    survivalAsymptote(baseP0, rHigh),
  );

  // 3. Personal risk multiplier (scales p₀)
  const riskLow = baseP0 * (1 - variationFraction);
  const riskHigh = baseP0 * (1 + variationFraction);
  push(
    'Personal risk exposure',
    1,
    1 - variationFraction,
    1 + variationFraction,
    survivalAsymptote(riskLow, baseR),
    survivalAsymptote(riskHigh, baseR),
  );

  // Sort by absolute impact (descending)
  return entries.sort(
    (a, b) =>
      Math.max(Math.abs(b.lowDelta), Math.abs(b.highDelta)) -
      Math.max(Math.abs(a.lowDelta), Math.abs(a.highDelta)),
  );
}

// ─── Personal ("you") scenario ────────────────────────────────────────────────

const PRE_ACCESS_MAX_DELAY = 60;     // worst-case years of access delay after launch

export function lookupCountry(code: string) {
  return (
    COUNTRIES.find((c) => c.code === code) ??
    COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY_CODE)!
  );
}

/**
 * Age-dependent all-cause hazard before treatment (Gompertz–Makeham).
 * The Gompertz term (aging) and the non-aging background both scale with the
 * country's mortality multiplier; the non-aging term already carries the
 * person's risk appetite via effectiveP0.
 */
export function agingHazard(age: number, countryMult: number, nonAgingP0: number): number {
  return GOMPERTZ_A * Math.exp(GOMPERTZ_B * age) * countryMult + nonAgingP0;
}

/**
 * Probability of surviving `years` of ordinary aging starting from `startAge`,
 * integrating the age-dependent hazard year by year.
 */
export function survivalUnderAging(
  startAge: number,
  years: number,
  countryMult: number,
  nonAgingP0: number,
): number {
  if (years <= 0) return 1;
  let S = 1;
  const whole = Math.floor(years);
  for (let i = 0; i < whole; i++) {
    S *= Math.exp(-agingHazard(startAge + i, countryMult, nonAgingP0));
  }
  const frac = years - whole;
  if (frac > 0) {
    S *= Math.exp(-agingHazard(startAge + whole, countryMult, nonAgingP0) * frac);
  }
  return S;
}

/**
 * Build the personalized survival trajectory for a specific user, given the
 * currently-selected advancement scenario.
 *
 * Two phases, measured in years from today:
 *  1. Pre-treatment: you age normally until the therapy reaches you. How likely
 *     you are to get there depends heavily on your age now and how long the wait
 *     is (which itself depends on the launch year, your country, and income).
 *  2. Post-treatment: aging is halted; only non-aging background mortality
 *     remains, adjusted for country and personal risk, with optional ongoing
 *     technological improvement.
 */
export function computePersonalScenario(
  profile: UserProfile,
  advancementScenario: AdvancementScenario,
): PersonalScenario {
  const country = lookupCountry(profile.countryCode);
  const countryMult = country.mortalityMultiplier;

  const effectiveP0 = BASE_US_P0 * countryMult * riskAppetiteToMultiplier(profile.riskAppetite);
  const r = advancementToR(advancementScenario, effectiveP0);

  // Access delay after first availability: half from the country getting it at
  // all, half from where you sit in your country's income queue.
  const countryComponent = 1 - country.accessRank;
  const incomeComponent = 1 - profile.incomePercentile / 100;
  const accessDelayYears =
    PRE_ACCESS_MAX_DELAY * (0.5 * countryComponent + 0.5 * incomeComponent);

  const accessCalendarYear = profile.treatmentYear + accessDelayYears;
  const waitYears = Math.max(0, accessCalendarYear - CURRENT_YEAR);
  const ageAtAccess = profile.currentAge + waitYears;

  // Phase 1: survive ordinary aging until access.
  const preSurvival = survivalUnderAging(profile.currentAge, waitYears, countryMult, effectiveP0);

  // Phase 2: aging halted at ageAtAccess; background mortality only.
  const preLen = Math.max(1, Math.round(waitYears));
  const preArr: SurvivalPoint[] = Array.from({ length: preLen }, (_, i) => ({
    t: i,
    S: survivalUnderAging(profile.currentAge, i, countryMult, effectiveP0),
  }));

  // Chart curve (300y) plus a long curve so a multi-thousand-year median isn't
  // truncated to "no limit".
  const combinedCurve = extendCombined(preArr, effectiveP0, r, waitYears, preSurvival, CHART_TMAX, CHART_STEP);
  const longCombined = extendCombined(preArr, effectiveP0, r, waitYears, preSurvival, PCT_TMAX, PCT_STEP);

  const asymptote = preSurvival * survivalAsymptote(effectiveP0, r);

  return {
    effectiveP0,
    accessDelayYears,
    accessCalendarYear,
    waitYears,
    ageAtAccess,
    survivesToTreatment: preSurvival,
    survivalCurve: combinedCurve,
    asymptote,
    medianLifespan: survivalPercentile(longCombined, 50),
    probDeadBefore: {
      y100: probDeadBefore(longCombined, 100),
      y500: probDeadBefore(longCombined, 500),
      y1000: probDeadBefore(longCombined, 1000),
    },
    wealthQuintile: incomeToQuintile(profile.incomePercentile),
  };
}

// ─── Density function ─────────────────────────────────────────────────────────

/**
 * Probability density at time t: f(t) = p(t) · S(t)
 * where p(t) = p₀·exp(-r·t) is the instantaneous hazard rate.
 */
export function densityAt(t: number, p0: number, r: number): number {
  const pt = r < 1e-10 ? p0 : p0 * Math.exp(-r * t);
  return pt * survivalWithImprovement(t, p0, r);
}

export function generateDensityCurve(
  p0: number,
  r: number,
  tMax: number = CHART_TMAX,
  step: number = CHART_STEP,
): { t: number; density: number }[] {
  const points = [];
  for (let t = 0; t <= tMax; t += step) {
    points.push({ t, density: densityAt(t, p0, r) });
  }
  return points;
}
