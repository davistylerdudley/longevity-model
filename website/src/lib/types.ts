export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'speculative';

export type AgingScenario = 'slowed' | 'halted' | 'reversed';

export type AdvancementScenario = 'static' | 'moderate' | 'aggressive' | 'lev';

export type RiskProfileId = 'ultra_low' | 'low' | 'moderate' | 'elevated' | 'extreme';

export interface Citation {
  source: string;
  url?: string;
  notes?: string;
}

export interface Assumption<T = number> {
  value: T;
  confidence: ConfidenceLevel;
  citations: Citation[];
  rationale: string;
}

export interface MortalityComponent {
  label: string;
  rate: number; // annual deaths per 100k
  confidence: ConfidenceLevel;
  citations: Citation[];
  trend: 'declining' | 'flat' | 'rising' | 'volatile';
  trendNotes: string;
}

export interface RiskProfile {
  id: RiskProfileId;
  label: string;
  description: string;
  mortalityMultiplier: number;
}

export interface ModelParameters {
  p0: number;                    // baseline annual background mortality rate (fraction, e.g. 0.0009)
  agingScenario: AgingScenario;
  biologicalAge: number;         // age at which aging is halted (slider 20–60)
  agingSlowFactor: number;       // for 'slowed' scenario: fraction of aging rate remaining (0–1)
  advancementScenario: AdvancementScenario;
  riskProfileId: RiskProfileId;
  wealthQuintile: 1 | 2 | 3 | 4 | 5;
  maxAccessDelayYears: number;   // years before bottom quintile gets access
}

export interface SurvivalPoint {
  t: number;   // years from treatment/halting
  S: number;   // survival probability [0, 1]
}

export interface ScenarioResult {
  scenarioLabel: string;
  agingScenario: AgingScenario;
  advancementScenario: AdvancementScenario;
  survivalCurve: SurvivalPoint[];
  asymptote: number;              // S(∞): probability of surviving indefinitely
  expectedLifespan: number;       // E[T] in years; Infinity if asymptote > 0
  medianLifespan: number;         // years; Infinity if asymptote > 0.5
  percentiles: {
    p10: number; p25: number; p50: number; p75: number; p90: number;
  };
  probDeadBefore: {
    y100: number; y500: number; y1000: number; y2000: number;
  };
}

export interface StratificationResult {
  quintile: 1 | 2 | 3 | 4 | 5;
  label: string;
  accessDelayYears: number;
  survivalCurve: SurvivalPoint[];
  asymptote: number;
  medianLifespan: number;
}

export interface SensitivityEntry {
  parameter: string;
  baseValue: number;
  lowValue: number;
  highValue: number;
  baseAsymptote: number;
  lowAsymptote: number;
  highAsymptote: number;
  lowDelta: number;    // lowAsymptote - baseAsymptote
  highDelta: number;   // highAsymptote - baseAsymptote
}

// ─── User profile (the "you" personalization layer) ──────────────────────────

export interface Country {
  code: string;
  name: string;
  mortalityMultiplier: number; // non-aging background mortality relative to US (1.0)
  accessRank: number;          // 0 (latest access) → 1 (earliest access)
}

export interface UserProfile {
  name: string;
  countryCode: string;
  currentAge: number;          // your age today
  incomePercentile: number;    // 0–100: where you sit in your country's income distribution
  riskAppetite: number;        // 0 (very cautious) → 100 (thrill-seeker)
  treatmentYear: number;       // calendar year the therapy first becomes available anywhere
}

export interface PersonalScenario {
  effectiveP0: number;         // your background mortality after country + risk adjustment
  accessDelayYears: number;    // years after first availability before it reaches your group
  accessCalendarYear: number;  // calendar year the therapy actually reaches you
  waitYears: number;           // years from now until it reaches you
  ageAtAccess: number;         // how old you are when it reaches you
  survivesToTreatment: number; // probability you live long enough to receive it
  survivalCurve: SurvivalPoint[];
  asymptote: number;           // your probability of surviving indefinitely
  medianLifespan: number;
  probDeadBefore: { y100: number; y500: number; y1000: number };
  wealthQuintile: 1 | 2 | 3 | 4 | 5;
}

export interface StoryScenario {
  id: string;
  title: string;
  paragraphs: string[];        // may contain {name}, {country} tokens
}
