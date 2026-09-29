import type {
  ModelParameters,
  MortalityComponent,
  RiskProfile,
  Assumption,
  Country,
} from './types';

// ─── Default model parameters ────────────────────────────────────────────────
// Derived from research/longevity-assumptions.md

export const DEFAULT_PARAMS: ModelParameters = {
  p0: 0.0009,              // US average non-aging background mortality (CDC NVSS 2024 final)
  agingScenario: 'halted',
  biologicalAge: 30,
  agingSlowFactor: 0.5,    // for 'slowed': aging proceeds at 50% of normal rate
  advancementScenario: 'moderate', // Section 02 forces the frozen baseline itself; the rest of the site assumes progress continues
  riskProfileId: 'moderate',
  wealthQuintile: 3,
  maxAccessDelayYears: 50,
};

// ─── Advancement scenario → r value mapping ──────────────────────────────────

export const ADVANCEMENT_R_VALUES: Record<string, number> = {
  static: 0,
  moderate: 0.005,   // ~historical vehicle safety improvement rate
  aggressive: 0.02,  // ~20th-century infectious disease reduction rate
  // 'lev' is computed dynamically as p0/ln(2)
};

// ─── Mortality components (US, deaths per 100k per year) ─────────────────────

export const MORTALITY_COMPONENTS: MortalityComponent[] = [
  {
    label: 'Accidents',
    rate: 45.0,
    confidence: 'high',
    citations: [
      { source: 'Xu J, Murphy SL, Kochanek KD, Arias E. Mortality in the United States, 2024. NCHS Data Brief No. 548. CDC/NCHS, Jan 2026.', url: 'https://www.cdc.gov/nchs/products/databriefs/db548.htm' },
      { source: 'Drug Overdose Deaths in the United States, 2023–2024. NCHS Data Brief No. 549. CDC/NCHS, Jan 2026.', url: 'https://www.cdc.gov/nchs/products/databriefs/db549.htm' },
      { source: 'NHTSA. 2024 traffic fatalities.', url: 'https://www.nhtsa.gov/press-releases/nhtsa-estimates-39345-traffic-fatalities-2024' },
    ],
    trend: 'declining',
    trendNotes: '45.0/100k = overdose 23.1 + motor vehicle ~11.6 + non-aging share of falls ~6 + drowning/fire/other ~4.3. Overdose deaths fell 26.2% from 2023 to 2024 and a further ~14% in 2025 provisional data; motor vehicle deaths keep declining toward the lowest rate on record.',
  },
  {
    label: 'Suicide',
    rate: 13.7,
    confidence: 'high',
    citations: [
      { source: 'Xu J, Murphy SL, Kochanek KD, Arias E. Mortality in the United States, 2024. NCHS Data Brief No. 548. CDC/NCHS, Jan 2026.', url: 'https://www.cdc.gov/nchs/products/databriefs/db548.htm' },
      { source: 'Ritchie H, Roser M. Suicide. Our World in Data, 2023.', url: 'https://ourworldindata.org/suicide' },
    ],
    trend: 'declining',
    trendNotes: '13.7/100k in 2024 (48,824 deaths), the first decline since 2020. Some peer nations have achieved 30–50% reductions via means restriction and improved care.',
  },
  {
    label: 'Homicide',
    rate: 5.9,
    confidence: 'high',
    citations: [
      { source: 'CDC FastStats: Homicide (NVSS via CDC WONDER), 2024.', url: 'https://www.cdc.gov/nchs/fastats/homicide.htm' },
      { source: 'FBI. 2025 Reported Crimes in the Nation. Federal Bureau of Investigation, Aug 2026.', url: 'https://www.fbi.gov/news/press-releases/fbi-releases-2025-reported-crimes-in-the-nation-statistics' },
    ],
    trend: 'declining',
    trendNotes: '5.9/100k in 2024 (20,162 homicides), down from 8.2 in 2021 and 7.1 in 2023. FBI provisional 2025 data puts the murder rate at 4.1/100k, down 18.1% from 2024 and tied with 1955–56 for the lowest ever recorded.',
  },
  {
    label: 'Infectious Disease',
    rate: 15.0,
    confidence: 'medium',
    citations: [
      { source: 'GBD 2019 Diseases and Injuries Collaborators. The Lancet, 2020;396:1204–1222.', url: 'https://doi.org/10.1016/S0140-6736(20)30925-9' },
      { source: 'Xu J, Murphy SL, Kochanek KD, Arias E. Mortality in the United States, 2024. NCHS Data Brief No. 548. CDC/NCHS, Jan 2026.', url: 'https://www.cdc.gov/nchs/products/databriefs/db548.htm' },
    ],
    trend: 'declining',
    trendNotes: 'Long-run decline of ~3.3%/yr since 1900 (98% total reduction). COVID-19, which drove the temporary spike in this component, fell to the 15th leading cause of death in 2024 (31,426 deaths, ~9/100k and still falling). AI-accelerated vaccine development may compress future pandemic timelines.',
  },
  {
    label: 'Medical Error',
    rate: 7.5,
    confidence: 'low',
    citations: [
      { source: 'Makary MA, Daniel M. Medical error — the third leading cause of death in the US. BMJ, 2016;353:i2139.', url: 'https://doi.org/10.1136/bmj.i2139' },
      { source: 'Shojania KG, Dixon-Woods M. BMJ Quality & Safety, 2017;26:423–428.', url: 'https://doi.org/10.1136/bmjqs-2016-006144', notes: 'Substantively contests the 250,000/yr figure; true rate likely 50,000–100,000/yr.' },
    ],
    trend: 'declining',
    trendNotes: 'Highly contested methodology. Conservative central estimate used. AI-assisted diagnosis expected to reduce this rate significantly.',
  },
  {
    label: 'Armed Conflict',
    rate: 1.0,
    confidence: 'medium',
    citations: [
      { source: 'Roser M, Nagdy M, Ritchie H. War and Peace. Our World in Data, 2023.', url: 'https://ourworldindata.org/war-and-peace' },
      { source: 'UNODC Global Study on Homicide 2023.', url: 'https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html' },
    ],
    trend: 'volatile',
    trendNotes: 'Near-zero for developed countries in peacetime. Explicitly not assumed to decline with AI advancement — adversarial dynamics could go either direction.',
  },
  {
    label: 'Other',
    rate: 1.9,
    confidence: 'low',
    citations: [
      { source: 'CDC NVSS 2024 residual calculation.' },
    ],
    trend: 'declining',
    trendNotes: 'Residual category: environmental exposures, occupational hazards, natural disasters, other external causes.',
  },
];

// ─── Risk profiles ────────────────────────────────────────────────────────────

export const RISK_PROFILES: RiskProfile[] = [
  {
    id: 'ultra_low',
    label: 'Ultra-Low Risk',
    description: 'Wealthy, sedentary, safe country (Japan/Iceland), excellent healthcare access.',
    mortalityMultiplier: 0.3,
  },
  {
    id: 'low',
    label: 'Low Risk',
    description: 'Professional class, developed country (UK/Germany), standard safety practices.',
    mortalityMultiplier: 0.6,
  },
  {
    id: 'moderate',
    label: 'Moderate Risk',
    description: 'US average resident.',
    mortalityMultiplier: 1.0,
  },
  {
    id: 'elevated',
    label: 'Elevated Risk',
    description: 'Dangerous occupation (construction, logging, fishing), limited healthcare, moderate-risk geography.',
    mortalityMultiplier: 2.5,
  },
  {
    id: 'extreme',
    label: 'Extreme Risk',
    description: 'Active combat, extreme sports (BASE jumping, motorcycle racing), high-crime area, conflict zone.',
    mortalityMultiplier: 8.0,
  },
];

// ─── Wealth quintile access delay ────────────────────────────────────────────

export const QUINTILE_LABELS: Record<number, string> = {
  1: 'Bottom 20% (Q1)',
  2: 'Lower-Middle (Q2)',
  3: 'Middle (Q3)',
  4: 'Upper-Middle (Q4)',
  5: 'Top 20% (Q5)',
};

export const QUINTILE_DELAY_FRACTIONS: Record<number, number> = {
  5: 0,      // immediate
  4: 0.15,
  3: 0.40,
  2: 0.70,
  1: 1.0,    // full maxAccessDelayYears
};

// ─── Chart configuration ──────────────────────────────────────────────────────

export const CHART_TMAX = 300;    // years to compute survival curves out to
export const CHART_STEP = 1;      // year increments

export const CONFIDENCE_COLORS: Record<string, string> = {
  high: '#2563EB',
  medium: '#3B82F6',
  low: '#F59E0B',
  speculative: '#9CA3AF',
};

export const QUINTILE_COLORS: string[] = [
  '#DC2626', // Q1 red
  '#F97316', // Q2 orange
  '#EAB308', // Q3 yellow
  '#22C55E', // Q4 green
  '#2563EB', // Q5 blue
];

export const ADVANCEMENT_COLORS: Record<string, string> = {
  static: '#6B7280',
  moderate: '#3B82F6',
  aggressive: '#8B5CF6',
  lev: '#10B981',
};

export const ADVANCEMENT_LABELS: Record<string, string> = {
  static: 'Static (no improvement)',
  moderate: 'Moderate (0.5%/yr)',
  aggressive: 'Aggressive (2%/yr)',
  lev: 'LEV Threshold',
};

// ─── Suicide accumulation note thresholds ────────────────────────────────────
// At p_suicide = 0.000137/yr, cumulative probability at given years:
// 500 yr: ~6.6%, 1000 yr: ~12.8%, 2000 yr: ~24.0%
export const SUICIDE_RATE_PER_YEAR = 0.000137; // 13.7/100k = 0.0137% (CDC NVSS 2024 final)

// ─── US baseline background mortality (reference point for country scaling) ──
export const BASE_US_P0 = 0.0009; // CDC NVSS 2024 final

// Present calendar year, used to convert a treatment-availability year and an
// access delay into "years from now" for the personal projection.
export const CURRENT_YEAR = 2026;

// Gompertz–Makeham aging hazard, used for the pre-treatment phase (how likely
// you are to survive normal aging until the therapy reaches you).
// h(age) = GOMPERTZ_A · exp(GOMPERTZ_B · age) · countryMult + nonAgingBackground
// Calibrated to US period life-table all-cause mortality: ~0.0015 at 30,
// ~0.016 at 65, ~0.058 at 80.
export const GOMPERTZ_A = 0.00005;
export const GOMPERTZ_B = 0.088;

// ─── Countries (personalization layer) ──────────────────────────────────────
// mortalityMultiplier: non-aging background mortality relative to US average.
// Driven mostly by homicide, road-accident, and infectious-disease rates.
// accessRank: rough proxy (0 = latest access, 1 = earliest) based on
// health-system capacity and income. Both are illustrative, not precise.
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', mortalityMultiplier: 1.0, accessRank: 0.9 },
  { code: 'JP', name: 'Japan', mortalityMultiplier: 0.35, accessRank: 0.92 },
  { code: 'GB', name: 'United Kingdom', mortalityMultiplier: 0.5, accessRank: 0.85 },
  { code: 'DE', name: 'Germany', mortalityMultiplier: 0.5, accessRank: 0.86 },
  { code: 'FR', name: 'France', mortalityMultiplier: 0.55, accessRank: 0.83 },
  { code: 'SE', name: 'Sweden', mortalityMultiplier: 0.45, accessRank: 0.88 },
  { code: 'CH', name: 'Switzerland', mortalityMultiplier: 0.4, accessRank: 0.95 },
  { code: 'CA', name: 'Canada', mortalityMultiplier: 0.55, accessRank: 0.82 },
  { code: 'AU', name: 'Australia', mortalityMultiplier: 0.5, accessRank: 0.83 },
  { code: 'KR', name: 'South Korea', mortalityMultiplier: 0.5, accessRank: 0.85 },
  { code: 'SG', name: 'Singapore', mortalityMultiplier: 0.4, accessRank: 0.93 },
  { code: 'IT', name: 'Italy', mortalityMultiplier: 0.5, accessRank: 0.78 },
  { code: 'ES', name: 'Spain', mortalityMultiplier: 0.5, accessRank: 0.78 },
  { code: 'CN', name: 'China', mortalityMultiplier: 0.9, accessRank: 0.62 },
  { code: 'BR', name: 'Brazil', mortalityMultiplier: 1.9, accessRank: 0.42 },
  { code: 'MX', name: 'Mexico', mortalityMultiplier: 2.0, accessRank: 0.42 },
  { code: 'IN', name: 'India', mortalityMultiplier: 1.4, accessRank: 0.35 },
  { code: 'RU', name: 'Russia', mortalityMultiplier: 2.2, accessRank: 0.45 },
  { code: 'ZA', name: 'South Africa', mortalityMultiplier: 2.9, accessRank: 0.3 },
  { code: 'NG', name: 'Nigeria', mortalityMultiplier: 2.6, accessRank: 0.18 },
  { code: 'ID', name: 'Indonesia', mortalityMultiplier: 1.6, accessRank: 0.32 },
  { code: 'EG', name: 'Egypt', mortalityMultiplier: 1.7, accessRank: 0.3 },
  { code: 'AE', name: 'United Arab Emirates', mortalityMultiplier: 0.8, accessRank: 0.8 },
  { code: 'OTHER', name: 'Somewhere else', mortalityMultiplier: 1.0, accessRank: 0.5 },
];

export const DEFAULT_COUNTRY_CODE = 'US';

// Risk-appetite slider (0–100) → mortality multiplier applied on top of country.
// Piecewise geometric so the midpoint is genuinely neutral:
// 0 = very cautious (0.5×), 50 = average (1.0×), 100 = thrill-seeker (4×).
export function riskAppetiteToMultiplier(appetite: number): number {
  if (appetite <= 50) {
    // 0.5× → 1.0× over the lower half
    return 0.5 * Math.pow(2, appetite / 50);
  }
  // 1.0× → 4.0× over the upper half
  return Math.pow(4, (appetite - 50) / 50);
}

// Income percentile (0–100) → wealth quintile 1–5.
export function incomeToQuintile(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 80) return 5;
  if (pct >= 60) return 4;
  if (pct >= 40) return 3;
  if (pct >= 20) return 2;
  return 1;
}
