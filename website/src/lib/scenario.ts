// "Escape Velocity" — an AI-2027-style future history of how aging gets solved.
//
// It is written as a story, not a briefing: a handful of recurring people
// (a biologist, her father, an investor who becomes a patient, a regulator, a
// schoolteacher in the queue) carried across twenty years, with the granularity
// tightening as events speed up. The first beat is documented and cited.
// Everything after is forecast written as fiction, extrapolated from real
// trend lines, and tagged as such.
//
// The sidebar dashboard tracks one metric per story beat, and its survival
// numbers come straight from the site's own model (floor = exp(-p0/r)). The
// research-speed, price and access figures are illustrative but internally
// consistent.

import { BASE_US_P0 } from './constants';
import { survivalAsymptote, analyticPercentile } from './actuarialMath';

export const START_YEAR = 2025;
export const END_YEAR = 2048;
export const LEV_YEAR = 2039;

export type Basis = 'observed' | 'forecast' | 'implication';

export interface Source {
  label: string;
  url?: string;
}

export interface Beat {
  id: string;
  year: number; // where the chart marker sits for this beat
  period: string; // short label, e.g. "2026–2027"
  title: string;
  basis: Basis;
  paragraphs: string[];
  sources?: Source[];
}

export interface CastMember {
  name: string;
  role: string;
}

/** The recurring people. Invented, but each stands for a real kind of person. */
export const CAST: CastMember[] = [
  { name: 'Ines Okafor', role: 'Reprogramming biologist at Amaranth, a composite of the leading labs' },
  { name: 'Emeka Okafor', role: 'Her father. 77 in 2032, and the first person she enrolls' },
  { name: 'Teodora Halloran', role: 'A Series-B investor who becomes one of the first paying patients' },
  { name: 'Marcus Bellweather', role: 'An FDA reviewer, later the man arguing over who gets it' },
  { name: 'Ravi Mehra', role: 'A schoolteacher in Lucknow who reads about it, and waits' },
  { name: 'Agent-1 → Agent-5', role: 'Successive generations of the AI running the science' },
];

interface YearMetric {
  year: number;
  aiSystem: string; // which model generation is running the science
  researchSpeed: number; // × faster than 2025 human biomedical R&D
  treatedBioAge: number; // biological age a treated 75-year-old reaches (75 = none)
  r: number; // annual rate of decline in non-aging background mortality
  cost: number | null; // USD per rejuvenation course (null = not offered yet)
  accessShare: number; // % of world population with access to the frontier course
}

// r is tuned so the frontier survival floor, exp(-p0/r), crosses 50% (longevity
// escape velocity) in 2039, three years after de Grey's stated even-odds date of 2036.
// Pacing follows the AI Futures Project's Dec 2025 medians (superhuman coder ~2030–32).
const SERIES: YearMetric[] = [
  { year: 2025, aiSystem: 'Agent-0', researchSpeed: 1, treatedBioAge: 75, r: 0, cost: null, accessShare: 0 },
  { year: 2026, aiSystem: 'Agent-0', researchSpeed: 1.2, treatedBioAge: 75, r: 0, cost: null, accessShare: 0 },
  { year: 2027, aiSystem: 'Agent-0', researchSpeed: 1.5, treatedBioAge: 75, r: 0, cost: null, accessShare: 0 },
  { year: 2028, aiSystem: 'Agent-0', researchSpeed: 1.8, treatedBioAge: 75, r: 0, cost: null, accessShare: 0 },
  { year: 2029, aiSystem: 'Agent-1', researchSpeed: 2, treatedBioAge: 75, r: 0, cost: null, accessShare: 0 },
  { year: 2030, aiSystem: 'Agent-2', researchSpeed: 8, treatedBioAge: 75, r: 0, cost: null, accessShare: 0 },
  { year: 2031, aiSystem: 'Agent-2', researchSpeed: 25, treatedBioAge: 74, r: 0, cost: null, accessShare: 0 },
  { year: 2032, aiSystem: 'Agent-3', researchSpeed: 80, treatedBioAge: 72, r: 0, cost: null, accessShare: 0 },
  { year: 2033, aiSystem: 'Agent-3', researchSpeed: 250, treatedBioAge: 70, r: 0, cost: null, accessShare: 0 },
  { year: 2034, aiSystem: 'Agent-3', researchSpeed: 700, treatedBioAge: 66, r: 0, cost: 2_000_000, accessShare: 0.001 },
  { year: 2035, aiSystem: 'Agent-4', researchSpeed: 2_000, treatedBioAge: 61, r: 0.0004, cost: 1_200_000, accessShare: 0.01 },
  { year: 2036, aiSystem: 'Agent-4', researchSpeed: 6_000, treatedBioAge: 55, r: 0.0007, cost: 500_000, accessShare: 0.05 },
  { year: 2037, aiSystem: 'Agent-4', researchSpeed: 15_000, treatedBioAge: 48, r: 0.001, cost: 250_000, accessShare: 0.2 },
  { year: 2038, aiSystem: 'Agent-4', researchSpeed: 40_000, treatedBioAge: 40, r: 0.00125, cost: 120_000, accessShare: 0.6 },
  { year: 2039, aiSystem: 'Agent-5', researchSpeed: 100_000, treatedBioAge: 32, r: 0.0014, cost: 60_000, accessShare: 1.2 },
  { year: 2040, aiSystem: 'Agent-5', researchSpeed: 200_000, treatedBioAge: 28, r: 0.00175, cost: 30_000, accessShare: 3 },
  { year: 2041, aiSystem: 'Agent-5', researchSpeed: 350_000, treatedBioAge: 25, r: 0.0022, cost: 16_000, accessShare: 6 },
  { year: 2042, aiSystem: 'Agent-5', researchSpeed: 500_000, treatedBioAge: 25, r: 0.0028, cost: 8_000, accessShare: 11 },
  { year: 2043, aiSystem: 'Agent-5', researchSpeed: 700_000, treatedBioAge: 24, r: 0.0036, cost: 5_000, accessShare: 18 },
  { year: 2044, aiSystem: 'Agent-5', researchSpeed: 850_000, treatedBioAge: 24, r: 0.0046, cost: 3_000, accessShare: 27 },
  { year: 2045, aiSystem: 'Agent-5', researchSpeed: 1_000_000, treatedBioAge: 23, r: 0.0058, cost: 2_000, accessShare: 38 },
  { year: 2046, aiSystem: 'Agent-5', researchSpeed: 1_200_000, treatedBioAge: 23, r: 0.0072, cost: 1_500, accessShare: 48 },
  { year: 2047, aiSystem: 'Agent-5', researchSpeed: 1_400_000, treatedBioAge: 22, r: 0.0088, cost: 1_100, accessShare: 55 },
  { year: 2048, aiSystem: 'Agent-5', researchSpeed: 1_600_000, treatedBioAge: 22, r: 0.0105, cost: 900, accessShare: 62 },
];

export interface YearReadout {
  year: number;
  aiSystem: string;
  researchSpeed: number;
  bioStatus: string; // human-readable rejuvenation status
  r: number;
  asymptote: number; // frontier chance of never dying of an age-related cause
  medianLifespan: number; // frontier median, years (Infinity past LEV)
  cost: number | null;
  accessShare: number;
}

export function readoutForYear(year: number): YearReadout {
  const m = SERIES.find((s) => s.year === year) ?? SERIES[0];
  const asymptote = survivalAsymptote(BASE_US_P0, m.r);
  const median = analyticPercentile(BASE_US_P0, m.r, 50);
  const bioStatus =
    m.treatedBioAge >= 75 ? 'no measurable effect' : m.treatedBioAge <= 30 ? 'held in the 20s' : `75 → ${m.treatedBioAge}`;
  return { year, aiSystem: m.aiSystem, researchSpeed: m.researchSpeed, bioStatus, r: m.r, asymptote, medianLifespan: median, cost: m.cost, accessShare: m.accessShare };
}

// Primary chart: the frontier survival floor over time.
export const CHART_DATA = SERIES.map((m) => ({
  year: m.year,
  asymptote: +(survivalAsymptote(BASE_US_P0, m.r) * 100).toFixed(1),
}));

// Sparkline: biomedical research speed (× vs 2025), drawn on a log scale.
export const SPARK_DATA = SERIES.map((m) => ({ year: m.year, speed: m.researchSpeed }));

// ── The access gap ───────────────────────────────────────────────────────────
export type Branch = 'broad' | 'locked';

const TYPICAL_BY_YEAR: Record<number, [number, number]> = {
  // year: [broad, locked]
  2040: [0.3, 0.3],
  2041: [1.5, 0.6],
  2042: [4, 1],
  2043: [9, 1.5],
  2044: [17, 2],
  2045: [27, 3],
  2046: [38, 4],
  2047: [48, 5],
  2048: [57, 6],
};

export const TYPICAL_DATA = SERIES.map((m) => {
  const pair = TYPICAL_BY_YEAR[m.year];
  return { year: m.year, broad: pair ? pair[0] : 0, locked: pair ? pair[1] : 0 };
});

export const BRANCH_EPILOGUE: Record<Branch, { label: string; title: string; text: string }> = {
  broad: {
    label: 'The shared future',
    title: 'You chose the shared future',
    text: 'In this branch rejuvenation follows the path of vaccines and generic drugs. Patents lapse, manufacturing scales, and public systems and prizes push the price toward the cost of production. Ravi Mehra gets his course in 2040 and teaches for another three centuries. By the 2050s the long-lived population is, roughly, everyone who wants to be, and the centuries-wide gap that opened in the 2030s narrows to decades and then closes. It is the harder branch to reach, and the one with no automatic mechanism that guarantees it.',
  },
  locked: {
    label: 'The divided future',
    title: 'You chose the divided future',
    text: 'In this branch nothing sinister has to happen; the gap simply persists, the way most gaps do. Access tracks wealth, wealth compounds across centuries of extra life, and the head start of the late 2030s hardens into a permanent difference in kind between the people who age and the people who do not. Ravi Mehra is still on a waiting list in 2048, at 49, watching the price fall a little more slowly than his body. It is the branch that requires no coordination at all, which is exactly why it is the one you get by default.',
  },
};

// ── "Why this?" — the expandable sidebars ───────────────────────────────────
export const BEAT_NOTES: Record<string, string> = {
  pieces:
    'Everything in this beat happened, which is why it opens the story: the two curves it describes are measured rather than assumed. What is assumed is the pace of what comes next. In December 2025 the AI Futures Project, who wrote AI 2027, revised their own model and moved the median arrival of a superhuman coder from 2027–28 out to about 2032, with Daniel Kokotajlo’s personal estimate nearer 2030. This scenario is paced to that revision, not to the original: research-grade agents arrive around the turn of the decade, and escape velocity lands in 2039, three years after de Grey’s stated even-odds date of 2036. The bar is still low: the model needs only r ≈ 0.13% a year to push the survival floor past 50%, a slower sustained improvement than the last century managed for infectious disease or car crashes.',
  slow:
    'A plateau is the honest default, not a pessimistic one. METR’s measured task horizons double every four to seven months, and that still leaves years between an agent that can finish a day’s work and one that can run a lab. Mice, regulators and wet-bench throughput set the pace in this stretch, which is why the dashboard barely moves and why the scenario refuses to skip it.',
  weekend:
    'The “rule it out in software first” loop is the whole mechanism. Virtual-cell models (the CZ Initiative’s platform, the Arc Institute’s Evo 2) are early versions of the simulator this beat assumes, and coding agents in 2025 already ran a junior researcher’s day unsupervised. The forecast is that those two capabilities meet inside one lab.',
  multiplier:
    'The claim is not that AI cures aging directly, but that it removes the rate limit on hypothesis generation and screening. AlphaFold collapsed a fifty-year structural-biology problem into a solved one. AI 2027’s central claim is that AI research itself gets automated first, which is what turns a research assistant into a research multiplier. Its authors revised the timing in December 2025, pushing their median superhuman coder out to roughly 2032. The mechanism they describe is unchanged; only the date moved, and this scenario moves with it.',
  clock:
    'Epigenetic clocks already estimate biological age from DNA methylation with a few years’ error (Horvath 2013 and successors), and are being written into trials as endpoints today. A regulator accepting a clock as a surrogate endpoint is the single most important non-scientific unlock in the scenario: it turns a forty-year trial into a ninety-day one.',
  moving:
    'The combination approach follows directly from the hallmarks-of-aging framework: many interacting causes imply many simultaneous interventions, which is a search problem, not a single-drug problem. That search is exactly the kind of thing a superhuman research system does and a clinician cannot.',
  wall:
    'Delivery, and its cancer risk, is the field’s real bottleneck. Full in-vivo reprogramming produced teratomas in mice (Abad et al., 2013); partial, transient reprogramming avoids this in the lab but nobody has proven it at human scale for decades. The real-world version of that test began on 9 June 2026, when Life Biosciences dosed the first human with partial reprogramming, in one eye, with safety as the endpoint. The scenario assumes at least one serious safety scare on the way from eighteen patients to ten thousand. It would be less plausible without one.',
  clinics:
    'The 109% extension of remaining life in already-old mice (Macip et al., 2024) is the existence proof this beat scales toward humans. The first clinics looking like private oncology suites in a handful of rich cities is not a guess; it is what every prior transformative therapy, from dialysis to CAR-T, actually did.',
  curve:
    'This beat is the site’s actual model, not a flourish. Non-aging US mortality runs at about 0.09% a year, which implies a median life near 770 years even with aging fully solved. When that background rate also falls, at annual rate r, the survival curve gains a floor of exp(−p₀/r). The only speculative part is the pace at which r rises.',
  queue:
    'The price path assumed here (roughly halving every couple of years after 2036) is faster than CAR-T managed and slower than sequencing did. The queue forming years before a therapy is affordable is the recurring pattern of every scarce cure in history.',
  escape:
    'The year 2036 is de Grey’s stated even-odds date for longevity escape velocity; in this telling it arrives in 2039, because the AI ramp is paced to the AI Futures Project’s revised medians. In the model, the frontier floor crosses 50% once r reaches p₀/ln2, about 0.13% a year — a slower sustained improvement than the last century managed for car-crash or infectious-disease mortality.',
  gap:
    'The income–lifespan gap in the US today is about 10–14 years (Chetty et al., 2016). The scenario’s claim is only that a delay under solved aging is spent at your biological prime under the old rules, so the same delay costs vastly more than it does now. That is arithmetic, not politics.',
};

// ── The scenario, as a future history ────────────────────────────────────────

export const BEATS: Beat[] = [
  {
    id: 'pieces',
    year: 2025,
    period: '2025–2026',
    title: 'The pieces on the table',
    basis: 'observed',
    paragraphs: [
      'The story starts in a real year, and then in a real year after that. In June 2025 Insilico Medicine published in Nature Medicine the first clinical results for rentosertib, a fibrosis drug whose biological target and whose molecule had both been nominated by the company’s AI. Seventy-one patients, a modest effect, a real one. By July 2026 the same drug was in Phase 3. Three months before that first paper, the FDA had agreed for the first time in its history that a drug might reasonably be expected to extend lifespan. The patient in that case was a senior dog, one of about 1,300 enrolled in a trial called STAY, and eighteen months later the approval itself was still pending, held up on a manufacturing section.',
      'The other curve moved faster. In July 2025 a version of Gemini scored at gold-medal standard at the International Mathematical Olympiad, working from the same problems, on the same clock, as the students. GPT-5 shipped in August, Claude Opus 4.5 in November, and behind them came compute contracts shaped less like procurement than like infrastructure: Anthropic signing for up to a million Google TPUs, OpenAI naming its Stargate sites. METR, which measures how long a task a model can finish unassisted, put the doubling time of that horizon at roughly seven months since 2019 and three to four months since 2024. Those are measurements, not forecasts.',
      'Money followed the biology. Retro Biosciences raised a billion dollars in January 2025, NewLimit a hundred and thirty million that May, Isomorphic Labs two point one billion by May 2026, while Altos, the best-funded of any of them, still had nothing in a human. Public money moved too, slowly: ARPA-H put $144 million into seven teams under a program called PROSPR, and the $101 million XPRIZE Healthspan paid first-milestone awards to forty teams. Then in December 2025 the authors of AI 2027 revised their own model and pushed the median arrival of a superhuman coder from 2027–28 out to roughly 2032, with Daniel Kokotajlo’s personal estimate nearer 2030. This scenario is paced to that revision: the research systems it describes arrive around the turn of the decade, not in the next eighteen months.',
      'The background world was quietly getting safer while all of this happened: US overdose deaths fell by a quarter in 2024 and fell again the year after, and murders hit a record low. Then, on 9 June 2026, a doctor dosed the first human being with a partial epigenetic reprogramming therapy. It was called ER-100. Three of the four Yamanaka factors, delivered to the retinal ganglion cells of one eye, switched on by an antibiotic taken by mouth and left running for eight weeks. Eighteen patients across four sites, glaucoma and optic-nerve injury, a Phase 1 whose stated endpoint was safety and nothing grander than that. Ines Okafor was thirty-two, a postdoc who had left Lagos for a reprogramming lab in Boston, and she read the press release twice in a stairwell. Her father Emeka was seventy-one that summer and complained, on their Sunday calls, about his knees. She told him to be patient. She did not, at the time, mean it as a prediction.',
    ],
    sources: [
      { label: 'Insilico Medicine, rentosertib Phase IIa. Nature Medicine, June 2025', url: 'https://www.nature.com/articles/s41591-025-03743-2' },
      { label: 'Insilico Medicine initiates rentosertib Phase III, July 2026', url: 'https://insilico.com/news/xmjsn4l091-insilico-initiates-phase-iii-clinical-tr' },
      { label: 'Life Biosciences, ER-100: first patient dosed, June 2026', url: 'https://www.lifebiosciences.com/life-biosciences-announces-first-patient-dosed-in-phase-1-trial-of-er-100-for-optic-neuropathies/' },
      { label: 'Loyal, FDA reasonable-expectation-of-effectiveness for LOY-002, Feb 2025', url: 'https://www.businesswire.com/news/home/20250226676005/en/' },
      { label: 'Google DeepMind, Gemini Deep Think at IMO gold-medal standard, July 2025', url: 'https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/' },
      { label: 'METR, Measuring AI Ability to Complete Long Tasks: Time Horizon 1.1, Jan 2026', url: 'https://metr.org/blog/2026-1-29-time-horizon-1-1/' },
      { label: 'AI Futures Project, timelines model December 2025 update', url: 'https://blog.aifutures.org/p/ai-futures-model-dec-2025-update' },
      { label: 'TechCrunch, Retro Biosciences raising $1B, Jan 2025', url: 'https://techcrunch.com/2025/01/24/retro-biosciences-backed-by-sam-altman-is-raising-1-billion-to-extend-human-lifespan/' },
      { label: 'Fierce Biotech, NewLimit $130M Series B, May 2025', url: 'https://www.fiercebiotech.com/biotech/anti-aging-biotech-newlimit-raises-130m-push-liver-reprogramming-med-clinic' },
      { label: 'Fierce Biotech, Isomorphic Labs $2.1B Series B, May 2026', url: 'https://www.fiercebiotech.com/biotech/alphabets-ai-biotech-isomorphic-labs-bags-21b-series-b-fuel-next-gen-drug-design-model' },
      { label: 'ARPA-H, PROSPR program: seven teams, $144M, Feb 2026', url: 'https://arpa-h.gov/news-and-events/research-teams-add-more-healthy-years-americans-lives-they-age' },
      { label: 'XPRIZE Healthspan, first-milestone awards to 40 teams, May 2025', url: 'https://www.xprize.org/news/101m-xprize-healthspan-awards-first-milestone-winners-driving-toward-revolutionary-healthy-aging-advances' },
      { label: 'OpenAI, GPT-5, Aug 2025', url: 'https://openai.com/index/introducing-gpt-5/' },
      { label: 'Anthropic, Claude Opus 4.5, Nov 2025', url: 'https://www.anthropic.com/news/claude-opus-4-5' },
      { label: 'OpenAI, five new Stargate sites, Sept 2025', url: 'https://openai.com/index/five-new-stargate-sites/' },
    ],
  },
  {
    id: 'slow',
    year: 2027,
    period: '2027–2028',
    title: 'The slow years',
    basis: 'forecast',
    paragraphs: [
      'What the scenario assumes for the two years after that is the least exciting thing in it, and the most likely: a plateau. The agents kept getting better at long tasks, on the schedule METR had measured, and by 2028 one could run a week of a graduate student’s work without supervision. But a week of a graduate student’s work still ended at a mouse. The mouse still took two years to grow old. A lab that had a thousand ideas a night and forty cages did not move much faster than a lab with forty ideas, and the people funding the field, who had priced in a miracle, spent 2027 learning the difference between an assistant and a scientist.',
      'The biology did what biology does, which is accumulate. In this telling ER-100’s eighteen patients came through Phase 1 with clean safety data and a modest signal in the treated eye, which was all that trial had promised. Loyal’s dog pill finally got its conditional approval, and a few hundred thousand senior dogs became the first mammals prescribed a drug for aging itself. A second and then a third partial-reprogramming therapy cleared the FDA for first-in-human trials, in the liver and in the skin. The epigenetic clocks crept into trial protocols as exploratory endpoints, not yet as anything a regulator would act on. None of it was rejuvenation. All of it was groundwork.',
      'Ines Okafor finished her postdoc in the spring of 2027, at thirty-three, and joined Amaranth, the merged reprogramming venture the press had started calling by that name. Emeka had the hip replaced that winter and complained, on the Sunday calls, that the new one was fine and the other knee was not. Four thousand miles away, in a government secondary school on the eastern edge of Lucknow, a science teacher named Ravi Mehra read about the dogs on a cracked phone and told his students, half joking, that they would want to remember the date. He was twenty-eight. He did not write it down himself.',
    ],
    sources: [
      { label: 'Life Biosciences, ER-100 Phase 1 (NCT07290244), 2026', url: 'https://www.lifebiosciences.com/life-biosciences-announces-first-patient-dosed-in-phase-1-trial-of-er-100-for-optic-neuropathies/' },
      { label: 'Loyal, FDA acceptance of LOY-002 safety package, Jan 2026', url: 'https://www.businesswire.com/news/home/20260113476778/en/Loyal-Receives-FDA-Acceptance-of-Safety-Package-for-Senior-Dog-Lifespan-Extension-Drug' },
    ],
  },
  {
    id: 'weekend',
    year: 2029,
    period: '2029',
    title: 'The long weekend',
    basis: 'forecast',
    paragraphs: [
      'The first thing Agent-1 did for Ines Okafor was tell her she was wasting three weeks. It was a Thursday in the autumn of 2029. Amaranth, the name the press had settled on for the merged reprogramming teams she had worked inside for two years by then, had wired its wet labs into a virtual-cell model the previous winter, and the agent had been quietly re-running her planned experiments against it overnight. Of the forty factor combinations she meant to test in mice, it had a confident negative on thirty-one. It suggested she run the other nine and spend the recovered weeks on something it flagged in last night’s data: a methylation pattern in one cohort that a tired human had passed over as noise.',
      'She ran the nine. Seven behaved exactly as the model had said. The pattern in the noise turned out to be the beginning of a paper. By the turn of the year the design-build-test loop that used to take a graduate student three years — hypothesis, assay, animals, analysis, revision — was closing over a long weekend, because most of the hypotheses never made it to an animal. They died in software, cheaply, on Friday night.',
      'Nothing about this was rejuvenation yet. The agents were, as one forecast that year put it, impressive in theory and unreliable in practice; they hallucinated references, and Ines learned to check everything. But the arithmetic of a lab had changed. The number of effective researchers in the building was no longer the number of people in it. That single fact, compounding, is most of what follows.',
    ],
    sources: [
      { label: 'Bunne C, et al. Building the virtual cell with AI. Cell, 2024', url: 'https://www.cell.com/cell/fulltext/S0092-8674(24)01332-1' },
      { label: 'Kokotajlo D, et al. AI 2027. AI Futures Project, 2025', url: 'https://ai-2027.com/' },
    ],
  },
  {
    id: 'multiplier',
    year: 2030,
    period: '2030',
    title: 'The research multiplier',
    basis: 'forecast',
    paragraphs: [
      'In 2030 the leading lab shipped Agent-2, and the thing Ines noticed first was that it stopped asking her what to do. It proposed the next experiment, ranked by what it expected to learn per dollar, and it was usually right. By March it was writing the protocols. By June it was reading the results before she woke up and leaving her a two-line summary and a question. The question was, more often than she liked, better than the one she would have asked.',
      'This was the mechanism Dario Amodei had sketched in 2024: not a single miracle but a compression, fifty to a hundred years of biomedical progress folded into five or ten, once the number of effective researchers stopped being a fixed number of people. Inside Amaranth the compression had a texture. Ten thousand candidate factor combinations that no team could have screened in a career were scored in a week. A failed hypothesis that would have cost a graduate student a year died at 3 a.m. on a Tuesday, unmourned, in a simulation. The literature, which had long ago grown past what any human could read, was now read.',
      'Outside the building the year had the feel the AI Futures Project’s revised forecast had predicted for the turn of the decade: the systems were suddenly, unevenly, superhuman. The lab’s biggest problem became mice. You cannot simulate away a mouse’s lifespan, and the animal facility, not the ideas, set the pace. Agent-2’s answer was to run more mice, in parallel, on shorter endpoints, which is where the next unlock came from.',
    ],
    sources: [
      { label: 'Amodei D. Machines of Loving Grace, 2024', url: 'https://darioamodei.com/essay/machines-of-loving-grace' },
      { label: 'Kokotajlo D, et al. AI 2027. AI Futures Project, 2025', url: 'https://ai-2027.com/' },
    ],
  },
  {
    id: 'clock',
    year: 2031,
    period: '2031',
    title: 'Reading the clock',
    basis: 'forecast',
    paragraphs: [
      'You cannot improve what you cannot measure, and biological age had never really been measurable. The epigenetic clocks changed that: models that read the chemical marks layered onto DNA and return an age, often years off the birthday, that tracks how worn a body is rather than how long it has existed. Steve Horvath had published the first in 2013. By 2031 Agent-2 had rebuilt them into something cheap enough to run on a fingerstick of blood and precise enough to move by weeks.',
      'The fight that mattered that year was not in a lab. It was in a conference room in Silver Spring, where an FDA reviewer named Marcus Bellweather spent nine months deciding whether a clock could stand in for a life. The old rule was that a therapy meant to extend lifespan had to prove it extended lifespan, which in humans is a forty-year trial. Bellweather’s memo, in September, allowed a validated clock as a surrogate endpoint for a narrow class of aging-adjacent indications. He signed it knowing exactly what it was. A forty-year trial had become a ninety-day one.',
      'Ines read the memo on the train and called her father. Emeka was seventy-six now, and the new hip had started to feel like the old knees. She told him, for the first time, that there might be something for him to enroll in, and that she would not let him be in the first cohort. He asked why not. She said: because I have seen the mice.',
    ],
    sources: [
      { label: 'Horvath S. DNA methylation age of human tissues and cell types. Genome Biology, 2013', url: 'https://doi.org/10.1186/gb-2013-14-10-r115' },
    ],
  },
  {
    id: 'moving',
    year: 2032,
    period: '2032',
    title: 'Moving it',
    basis: 'forecast',
    paragraphs: [
      'Amaranth’s first human protocol was not elegant, and Agent-3, which arrived that spring and was by any test a better scientist than anyone in the building, did not pretend it was. It stacked three things: a senolytic to clear the worn-out cells that poison their neighbours, a reprogramming factor delivered to one tissue at a time, and a metabolic drug in the rapamycin family. It then sequenced and dosed the three against each volunteer’s own clocks, a search across more combinations than a clinician can hold in their head, which the agent ran, for each of two hundred people, before breakfast.',
      'Emeka Okafor was in the second cohort, in the end, at seventy-seven. His daughter had lost the argument about the first. He had a bad week in the third month, a fever the agent had flagged as a 6 percent risk and that felt, from inside it, like 100. Then the readouts came back. On the liver clock he was seventy-one. On the cardiac clock, sixty-nine. On the composite that the FDA memo recognized, he had left the study at seventy-four. Three years, in ninety days, in a man who had walked in on a cane.',
      'The result made the front page of nothing. It was a phase-one safety study with two hundred people, the kind of thing that gets a paragraph in a trade newsletter. But inside the field everyone understood what had happened. Reversal in a human was no longer a claim. It was a number, with a confidence interval, that could be improved.',
    ],
  },
  {
    id: 'wall',
    year: 2033,
    period: '2033',
    title: 'The wall',
    basis: 'forecast',
    paragraphs: [
      'The wall that the whole field had been walking toward was never the idea. It was delivery. Getting reprogramming factors into the right cells, at the right dose, for the right window, and then getting them out again, without nudging a healthy cell over the line into cancer. In mice that had gone wrong before. Full in-vivo reprogramming in 2013 had produced teratomas, tumours made of every tissue at once. The partial, transient version avoided that in the lab. Nobody had run it in ten thousand people.',
      'In February 2033, Amaranth ran it in ten thousand people. The expansion study folded the two hundred volunteers from the first trial into its own numbered cohorts, for their maintenance courses, and Emeka Okafor, who had been in the second cohort of the first study, was now in the fourth of this one. In April one of the liver-cohort clinics in Zurich reported a cluster: eleven patients with a signal on the scan that the protocol said should not be there. The company stopped dosing. Marcus Bellweather, who had signed the memo that let a clock stand in for a life, spent that week on a plane. Ines spent it not sleeping, because cohort four was paused.',
      'The cluster was real. It was also, when the pathology came back, not cancer: a benign overgrowth traced to a vector that lingered in one cell type a week longer than designed. Agent-3 had the redesigned capsid modelled in eleven days and validated in animals in six weeks, a cycle that in 2025 would have taken three years. The clinics reopened in August under a stricter dosing window. The episode cost the field half a year and a great deal of trust, and the scenario would be less honest without it. Every powerful technology has a year like 2033. This was this one’s.',
    ],
    sources: [
      { label: 'Abad M, et al. Reprogramming in vivo produces teratomas and iPS cells with totipotency features. Nature, 2013', url: 'https://doi.org/10.1038/nature12586' },
    ],
  },
  {
    id: 'clinics',
    year: 2034,
    period: '2034',
    title: 'The first clinics',
    basis: 'forecast',
    paragraphs: [
      'What finally lowered the delivery wall was protein and vector design, the lineage of work that had produced AlphaFold and taken a share of the 2024 Nobel Prize in Chemistry, now pointed by Agent-3 at building delivery systems no human had drawn. The 109 percent extension of remaining life that a single gene therapy had produced in already-old mice back in 2024 stopped looking like a fluke and started looking like a floor.',
      'The first real rejuvenation clinics opened in the spring of 2034, and they looked like private oncology suites in the four or five cities that get everything first. A course cost two million dollars and had to be repeated. The first patients were the people who could afford to be early and absorb the risk, which is how it had gone for dialysis, for transplants, for CAR-T. One of them was Teodora Halloran, seventy-one, who had put money into Amaranth’s Series B in 2029 and had, as she said in the one interview she gave, bought a ticket for a train she did not expect to board.',
      'She finished her third course in December. Her cardiac clock read forty-one. The press wrote it up as a vanity purchase, a rich woman buying back her face, and the tone of the coverage was not wrong about the money. It was wrong about the readouts. Underneath the story was a woman whose arteries were those of a forty-year-old, whose immune system had been reset to something like fifty, and whose risk of dying in the next year had, on the model this site runs, fallen by a factor that no drug in history had matched. Nothing about it was vain. It was just early.',
    ],
    sources: [
      { label: 'Nobel Prize in Chemistry 2024 (Hassabis, Jumper, Baker)', url: 'https://www.nobelprize.org/prizes/chemistry/2024/' },
      { label: 'Macip CC, et al. Partial reprogramming extends lifespan in aged mice. Cellular Reprogramming, 2024', url: 'https://doi.org/10.1089/cell.2023.0072' },
    ],
  },
  {
    id: 'curve',
    year: 2035,
    period: '2035',
    title: 'The other curve',
    basis: 'forecast',
    paragraphs: [
      'Here the story turns from biography into arithmetic, which is where it gets strange. Everything so far had pushed back aging, the slow and reliable killer. But a person with aging solved is not immortal. They still face the flat background risks that have nothing to do with their cells, the crash, the new virus, the act of violence, which in the United States run at roughly one death in a thousand a year. On their own those imply a median life closer to eight hundred years than to a hundred. Long. Not forever.',
      'The deeper effect is what happens when that background rate itself starts to fall, and in 2035 it started to fall, because the same intelligence that was rejuvenating people was, elsewhere, making everything else safer. Agent-4 arrived that year and did not work on aging alone. It was running the freight fleets that stopped colliding. It was reading wastewater in eleven hundred cities and catching outbreaks before their third case. It was sitting inside the hospital systems where, until then, medical error had killed more Americans than car crashes.',
      'Once the yearly risk of dying by accident or infection falls fast enough, the survival curve stops decaying to zero and settles onto a floor above it. A fraction of people stop dying of anything at all. In 2035 that fraction was small, and the improvement rate that drives it, the r in the model, was barely off zero. But on the dashboard beside this text you can watch the green line lift off the axis for the first time. That lift is the whole thesis of this site, and this is the year it starts.',
    ],
  },
  {
    id: 'queue',
    year: 2036,
    period: '2036',
    title: 'The queue',
    basis: 'forecast',
    paragraphs: [
      'Ravi Mehra was thirty-seven in 2036, a science teacher at a government secondary school on the eastern edge of Lucknow, and he read about the clinics the way most of the planet did, on a cracked phone, on a bus. A course cost half a million dollars that year. His salary was nine thousand. He did the division, because he was that kind of teacher, and the answer was fifty-five years, which was longer than the old actuarial tables gave him.',
      'What Ravi did next is what everyone did next, and it is the least dramatic and most consequential fact in the scenario: he got in line. Not a literal one, yet. He registered on the public waitlist that the Indian health ministry opened in November, which had no funding, no clinics, and forty million names by Christmas. He started taking the blood-pressure medication he had been ignoring. He stopped riding his cousin’s motorbike. He was not being careful for the sake of it. He was being careful because the math had changed: every year he stayed alive was now a year closer to a treatment that made staying alive worth vastly more.',
      'The price, meanwhile, was falling the way prices fall when a thing is made of information and machines rather than of scarce people. Five hundred thousand in 2036. Two hundred and fifty the year after. Amaranth had competitors now, three of them serious, and the vectors were being manufactured in Hyderabad. A queue that forms before a cure is affordable is the recurring pattern of every scarce cure in history. What was new was its length, and how much each place in it was worth.',
    ],
  },
  {
    id: 'who',
    year: 2037,
    period: '2037',
    title: 'Who it is for',
    basis: 'forecast',
    paragraphs: [
      'By 2037 the question had stopped being whether it worked and become who it was for, and Marcus Bellweather, who had left the FDA the year before, found himself in Geneva arguing the answer with people who did not agree. Denmark had gone first. A small rich country with a single health system and a population of six million had simply decided, in a parliamentary vote in March, to buy rejuvenation for every citizen over sixty on a rolling basis, at a negotiated national price of ninety thousand dollars a course, and to do it on credit against the pensions it would no longer have to pay. The arithmetic worked. That was the unsettling part.',
      'The United States did what the United States does. It litigated. Three insurers refused to cover it, two states sued them, Medicare commissioned a study, and a grey market opened in Tijuana where a course cost a third of the Zurich price and came with none of the dosing-window controls that the 2033 scare had made law. A class action over one of those clinics was, in 2037, the largest in American history. Bellweather’s job, as he described it to Ines over dinner that autumn, was to make the legal version cheap faster than the illegal version made people sick.',
      'And in the background, under all of it, the machines kept working. Agent-4 was running, that year, the research of an entire field at fifteen thousand times the speed of 2025, and it had turned a serious fraction of that speed on cost. A course that had required a bespoke vector and a week in a clinic now required a stock vector and an afternoon. The people who owned the patents noticed this. So did the people who did not.',
    ],
    sources: [
      { label: 'Bach PB. Limits on Medicare’s ability to control rising spending on cancer drugs. NEJM, 2009', url: 'https://doi.org/10.1056/NEJMhpr0807774' },
    ],
  },
  {
    id: 'faster',
    year: 2038,
    period: 'Spring 2038',
    title: 'Faster than a body ages',
    basis: 'forecast',
    paragraphs: [
      'The phrase people started using in 2038 was “faster than a body ages,” and it meant something specific. Teodora Halloran had taken ten courses by then. Each one walked her clocks back further than the year between them had walked them forward. She was seventy-five by the calendar and, on the composite clock, forty. The gap was widening in the right direction. She had stopped, she said, thinking of the courses as treatment and started thinking of them as maintenance, the way you think of a car.',
      'Ines Okafor was forty-four that spring and had, after some argument with herself, taken her first course the previous year. She was thirty-three on the clock. Her father was eighty-three and read as fifty-eight. He had started, to her alarm, a new business. What she noticed most was not any of the numbers. It was that the conversations at Amaranth had changed. Nobody talked about extending life anymore. They talked about the residual, the part of the yearly death rate that had nothing to do with aging, because that residual was now the whole of what was left to work on.',
      'On the dashboard the treated biological age of a seventy-five-year-old had dropped from seventy-five to forty in six years. The line was about to cross a threshold that had a name, and inside the field everyone could see it coming the way you can see a train from a long way down a straight track.',
    ],
  },
  {
    id: 'escape',
    year: 2039,
    period: 'A Tuesday in April, 2039',
    title: 'Escape velocity',
    basis: 'forecast',
    paragraphs: [
      'Aubrey de Grey had put roughly even odds on the year 2036 and given the moment a name, the Methuselarity: the point at which each additional year of survival buys more than a year of extra life expectancy, because the treatments now improve faster than a body ages. He was three years early. For the frontier cohort, the numbers crossed on a Tuesday in April 2039. The survival floor, the green line on the dashboard, passed one in two. More than half of the people on the newest protocols would, on the model’s own logic, never die of an age-related cause at all.',
      'It did not feel like a singularity, or anything cinematic. Agent-5 had shipped in January and was, by then, designing the next generation of the therapy in the background of everything else it did, and the crossing was just one line on one dashboard going above fifty percent and staying there. Ines was in a meeting. Teodora was on a boat. Emeka was at work. Most of the planet had no access yet: a little over one percent, by the year’s accounting. Most people did not notice, because for most people nothing had happened.',
      'But something had. For the first time in the history of the species, indefinite life had stopped being a metaphor and become a line item with a confidence interval, and the confidence interval was narrowing. In the thousand years before 2039, a person’s expected remaining life had always been a number that went down each year. On that Tuesday, for one small cohort, it became a number that went up.',
    ],
    sources: [
      { label: 'de Grey A. Even odds of longevity escape velocity by 2036 (this scenario: 2039)', url: 'https://longevity.technology/news/longevity-escape-velocity-by-2035-and-it-will-be-free/' },
    ],
  },
  {
    id: 'gap',
    year: 2040,
    period: '2040',
    title: 'The gap',
    basis: 'implication',
    paragraphs: [
      'Ravi Mehra was forty-one in 2040 and still on a list. The price of a course had fallen to thirty thousand dollars, which was extraordinary, a factor of sixty in six years, and which was also three years of his salary and not on offer to him at any price because the eligibility rules, in Uttar Pradesh that year, ran on age and illness and he was young and well. The clinics that existed were in Delhi and Mumbai and full. He kept taking the blood-pressure pills. Two of the friends he had registered alongside did not. One of them died on the Kanpur road in March, at forty-three, in exactly the kind of accident the model has always said would still be there.',
      'Every transformative therapy has eventually walked down the income ladder, from wealthy early adopters to, in time, more or less everyone. CAR-T took most of a decade and had still not finished the journey. What makes this one different is not the shape of the curve but the size of the prize. A ten-year delay used to cost you ten years near the natural end of life, when the body was already failing. Here a delay is spent at your biological prime, under the old mortality rules, while the people ahead of you pull permanently away. Teodora Halloran and Ravi Mehra were, by 2040, on different curves. Not different by years. Different in kind.',
      'So the gap that opens is not the familiar one, and it does not obviously close on its own. This is the point where the scenario stops being a story about science, which turned out to be the tractable part, and becomes a story about who a society decides the technology is for, and how fast. That question has no equation. The rest of the story is about it.',
    ],
    sources: [
      { label: 'Chetty R, et al. Income and life expectancy. JAMA, 2016', url: 'https://doi.org/10.1001/jama.2016.4226' },
    ],
  },
  {
    id: 'price',
    year: 2041,
    period: '2041–2042',
    title: 'The long fall of the price',
    basis: 'forecast',
    paragraphs: [
      'The price of a course fell from sixteen thousand dollars in 2041 to eight thousand in 2042, and the reasons were boring, which is how you know they were real. The vectors had become a commodity, manufactured in Hyderabad and Shenzhen and São Paulo by companies that had never heard of Amaranth. The first patents had been challenged, then licensed, then in two jurisdictions simply set aside on public-health grounds, over furious objection. A prize fund, seeded by a consortium of governments and one very old foundation, paid out on cost reductions rather than on discoveries. And Agent-5 had turned its attention to the dullest problem in the field, which was logistics, and made it disappear.',
      'By 2042 eleven percent of the world had access to a frontier course. The figure was a triumph and an indictment at once. It was the fastest any therapy in history had spread. It was also eighty-nine percent of the species still aging, still dying on the old schedule, still watching the price fall a little more slowly than their bodies.',
      'The sequencing of a human genome had cost a hundred million dollars in 2001 and a few hundred by the 2020s, and people in the field liked to cite that curve. The honest version noted that sequencing had no one it needed to keep alive on the way down.',
    ],
    sources: [
      { label: 'NHGRI. DNA Sequencing Costs: Data', url: 'https://www.genome.gov/about-genomics/fact-sheets/DNA-Sequencing-Costs-Data' },
    ],
  },
  {
    id: 'letter',
    year: 2043,
    period: '2043',
    title: 'The letter',
    basis: 'forecast',
    paragraphs: [
      'The letter reached Ravi Mehra in March 2043, seven years after he first registered, on the same cracked phone. The state program had been funded, at last, in the previous budget, and his district was in the second tranche. He was forty-four. He had, he later worked out, been careful for two thousand five hundred consecutive days: the pills, the seatbelt, the motorbike he never rode, the vaccine trucks he never missed. He read the letter twice on the bus and then, because he was a teacher, explained it to the boy sitting next to him.',
      'The letter gave a clinic in Lucknow, an eligibility window, and an appointment: a Thursday in August, 3:40 in the afternoon. It did not give a guarantee. The program depended on a budget line that had to be voted on again in a year, on a supply chain that ran through two countries that were not on good terms, and on a court case about the patents that was still, in 2043, unresolved. Marcus Bellweather, in Geneva, was spending that year trying to make sure the vote went the right way. He did not always win.',
      'This is the moment the two futures in this scenario begin to come apart, and the reason the story has a fork instead of an ending. In one future the clinic calls Ravi back, the line goes around the block, and he stands in it for six hours in the wet heat and counts them, later, among the best six hours of the several centuries that follow. In the other, the budget line fails in 2044, the window closes, and he is still on the list in 2048, at forty-nine, watching the price fall a little more slowly than his body. The letter was real in both. What it was worth depended on what a great many people, none of them Ravi, decided next.',
    ],
  },
  {
    id: 'made-of',
    year: 2044,
    period: 'The long run',
    title: 'What a very long life is made of',
    basis: 'implication',
    paragraphs: [
      'Even in the best case, an average is a poor description of a life. A frontier life expectancy of a thousand years does not mean people live to a thousand. It means most barely age, a steady minority are lost each year to the risks that never went away, and a lucky tail runs for several thousand years. The shape of that distribution, not its midpoint, is what the world feels like from inside it. It also inverts the causes of death. Cancer and heart disease recede toward the bottom of the list. The things we currently round down, traffic, violence, infection, climb to the top. Ravi’s friend on the Kanpur road is what a leading cause of death looks like in this world.',
      'Some risks are trivial in a single year and enormous across a thousand. Hold the current US suicide rate flat and run it over a millennium and the cumulative chance of dying that way climbs toward one in eight, with the annual number never changing; the horizon does the work. Whether that rate holds over centuries, whether a mind stays whole across five hundred years, whether the long historical decline of violence survives once the stakes are measured in centuries rather than decades: these are the real unknowns, and the honest version of this scenario keeps them in view rather than painting over them.',
      'Teodora Halloran, who had by 2044 been the same age for a decade, was asked in an interview what it was like. She said the strange part was not the body. The body was easy. The strange part was that she had stopped being able to picture the end of anything, and had to learn to want things without a deadline. She said she was not sure yet whether that was a gift. She said she would let them know in a hundred years.',
    ],
    sources: [
      { label: 'WHO. Suicide worldwide in 2019. 2021', url: 'https://www.who.int/publications/i/item/9789240026643' },
    ],
  },
  {
    id: 'fork',
    year: 2047,
    period: 'The fork',
    title: 'Is it worth wanting, and who gets to decide',
    basis: 'implication',
    paragraphs: [
      'There is an older objection, and it has nothing to do with access. In 1973 Bernard Williams argued that an unbounded life would eventually go hollow, that the projects giving a life its shape need a horizon to press against. His example, a woman who abandons an immortality elixir at 342 out of sheer tedium, has been argued over ever since, with Derek Parfit and others insisting that what a person wants can keep renewing across a long enough life. Teodora’s answer, in a hundred years, will be one data point. The scenario takes no side. It only notes that a technology stretching life toward the indefinite would drag the question out of seminar rooms and into ordinary lives.',
      'Scenarios like this one end at a decision rather than a destiny, and this is the decision. On current trends the science was the tractable part; Ines Okafor and Agent-5 solved it, more or less, by 2039. What stays open is distribution: whether rejuvenation follows vaccines down the cost curve until the long-lived population is roughly everyone, or the centuries-wide gap of the late 2030s sets like concrete and becomes the permanent architecture of the species. Ravi Mehra’s letter is real in both futures. Pick one below, and the chart and the ending change with it.',
      'The interactive model on the rest of this site lets you put your own numbers into that question: your country, your income, your age, the year you think the treatments arrive, and see where you land. It is not a prediction. It is a way of taking the possibility seriously enough to argue about who it should be for.',
    ],
    sources: [
      { label: 'Williams B. The Makropulos Case. In: Problems of the Self, 1973' },
      { label: 'Parfit D. Reasons and Persons. Oxford University Press, 1984' },
    ],
  },
];
