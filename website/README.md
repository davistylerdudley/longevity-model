# How Long Would You Live? — the website

An interactive, sourced model of human lifespan under solved aging, plus a scrollytelling scenario of how it could happen.
Live at **https://website-three-theta-67.vercel.app**.

## The idea in one paragraph

"Solving aging" removes one cause of death (senescence) and leaves every other one in place. If your yearly chance of dying from
those remaining causes is a flat number *p*, your lifespan is exponentially distributed with mean 1/*p*. At today's US non-aging
background rate (*p*₀ ≈ 0.0009/yr) that is ~1,100 years mean, ~770 median. If background mortality itself keeps falling at rate
*r* (as it has for a century), the survival curve gains a floor of exp(−*p*₀/*r*): a fraction of people never die of anything.
The floor crosses 50% ("longevity escape velocity") at *r* = *p*₀/ln 2 ≈ 0.13%/yr. The site walks a reader through that
argument, lets them put their own life into it, and ends with a story.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The interactive model: eight sections from the framing question to a personalized flash-fiction ending. |
| `/escape-velocity` | **Escape Velocity**, an AI-2027-style future history (2025–2048) of how aging gets solved, with recurring characters and a live dashboard that keeps score as you scroll. |

## Sections of the main page

1. **Start with a simpler question** — the framing, the exponential math, a tight cited case for plausibility, and a hand-off to the scenario.
2. **Meet the curve** — the population survival curve in the "frozen world" (no further progress), with your own line drawn in. Aging-scenario, held-age, background-rate and risk-profile controls all move the curve.
3. **Now let the world keep improving** — four rates of progress; the survival floor; escape velocity.
4. **Who gets it, and when** — access delay by income group; the gap measured in centuries, not years.
5. **The average hides the story** — the distribution of ages at death; slow risks that accumulate over centuries.
6. **Which number are we most wrong about?** — tornado sensitivity on the three inputs that move the floor; four honest unknowns.
7. **So what would actually change?** — nine implications, each tagged by how firmly it follows from the math.
8. **One version of your long life** — a vignette chosen from your inputs, plus nine illustrative lives in specific places.

**Content refresh, September 2026.** Sections 1, 4 and 7, plus the whole Escape Velocity opening beat, were rebased on verified
developments through summer 2026: first-in-human partial reprogramming (Life Biosciences ER-100, 9 June 2026 — the site previously
mis-dated this to 2025), rentosertib to Phase 3, the METR task-horizon trend, the AI Futures Project's December 2025 timeline
revision (the scenario is now paced to those medians: Agent-1 in 2029, escape velocity in 2039, with a bridging 2027–2028 chapter), Olshansky 2024 as the demographic counterweight, and the Ten
Americas / Case & Deaton / GLP-1-generics evidence on access.

## Personalization

The form in the hero collects name, country, age, the year aging is first solved, income percentile, and everyday exposure to
accidents/violence. `computePersonalScenario` (in `src/lib/actuarialMath.ts`) runs two phases:

1. **Pre-treatment** — you age normally under a Gompertz–Makeham hazard calibrated to US life tables until the therapy reaches you
   (launch year + an access delay driven half by your country's health-system rank, half by your income). Your age and the launch
   year therefore matter as much as anything.
2. **Post-treatment** — aging halts; only country- and exposure-adjusted background mortality remains, with optional improvement *r*.

Nothing entered leaves the browser. Country multipliers and access ranks are illustrative proxies, not measured estimates.

## Architecture

```
src/
  app/                 layout (fonts/metadata), page (main), escape-velocity/page, globals.css (design tokens)
  lib/
    actuarialMath.ts   all survival math: static / time-varying survival, floor, LEV, closed-form percentiles,
                       aging-scenario background, pre-treatment aging, personal scenario, sensitivity
    constants.ts       sourced defaults, mortality decomposition, risk profiles, countries, chart config
    scenario.ts        Escape Velocity: cast, yearly metric series, chart data, branch endings, beats
    stories.ts         closing vignettes + persona browse
    types.ts
    __tests__/         vitest suites (math, stories, scenario, constants)
  components/
    sections/          S1–S8 of the main page
    scenario/          ScenarioExperience (scrollytelling) + ScenarioChart (dashboard)
    charts/            Recharts wrappers (survival, stratification, distribution, tornado, decomposition)
    ui/                SectionWrapper, Reveal (scroll fade-up), SiteNav (scrollspy + progress), OnboardingCard, …
  hooks/useModelState  React context: model params + user profile
```

**Design system** (`globals.css`): Instrument Serif for headlines, Inter for body, JetBrains Mono for numbers. One blue accent
for the population model, rose for "you", emerald for the good outcome, amber for open questions. `.card`, `.card-muted`,
`.card-dark` surfaces; `.reveal` scroll fade-up; all motion respects `prefers-reduced-motion`.

## Develop, test, deploy

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # vitest: math invariants, story selection, scenario integrity
npm run build        # static export to out/ (next.config: output: 'export')
npx vercel --prod    # deploy
```

The tests pin the numbers the prose relies on (770-year median, 50% floor at the LEV year, the 109%-style ordering of
scenarios) so a change to the model that silently breaks the story fails CI.

## Sources

Every assumption is cited and confidence-rated in `../research/longevity-assumptions.md` (75 references: CDC NVSS, GBD 2019,
López-Otín 2013/2023, Macip 2024, Lu 2020, Chetty 2016, Peltzman 1975, Williams 1973, Amodei 2024, Olshansky 2024, METR 2026,
and more).
