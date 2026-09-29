# Human Longevity Projection Model — Handoff Brief

**Purpose of this bundle.** Everything needed to rebuild this project from scratch in another AI session: what it is, how it is laid out, how the math and content work, the design language, every change made across the sessions, and the standards the work was held to. The live reference build is at **https://website-three-theta-67.vercel.app** (scenario at `/escape-velocity`). Code is included for reference but the brief is meant to be sufficient on its own.

**As of:** 12 September 2026. Content is current to summer 2026.

---

## 1. What it is

A one-page interactive research site plus a companion scrollytelling scenario that answers:

> *If aging were solved, how long would you live?*

The honest answer is not "forever" and not "a few extra decades." Removing aging removes one cause of death and leaves every other cause in place (accidents, violence, infection, suicide). If the yearly chance of dying from those is a flat number *p*, lifespan is exponentially distributed with mean 1/*p*. At the US non-aging background rate (*p*₀ ≈ 0.0009/yr, CDC 2024) that is **~1,100 years mean, ~770 years median**. If background mortality itself keeps falling at rate *r* per year (as it has for a century), the survival curve stops decaying to zero and gains a floor of exp(−*p*₀/*r*): some fraction of people never die of anything. The floor crosses 50% ("longevity escape velocity") at *r* = *p*₀/ln 2 ≈ 0.13%/yr.

Three deliverables:
1. **Website** (Next.js, static export): the argument, interactive charts, a personalized projection, a fiction ending.
2. **Escape Velocity**: an AI-2027-style future history (2025–2048) of how aging gets solved, with a recurring cast and a live dashboard.
3. **Research document** (`longevity-assumptions.md`, v1.1, 75 references, confidence-rated) and an **Excel workbook** that mirrors the model.

Framing to preserve: bounding analysis and scenario tool, not a prediction. Optimistic but grounded. The "if" is explicit throughout.

---

## 2. Layout of the main page (`/`)

A sticky nav with scrollspy pills and a reading-progress bar. Eight numbered sections, alternating white and muted backgrounds, each with a mono accent numeral ("01"), a serif headline, and a scroll-reveal.

**Hero (top of 01).** Two columns. Left: eyebrow "A LONGEVITY PROJECTION MODEL", serif headline "If aging were solved, how long would you live?", a two-sentence dek, two CTAs ("Start with the math", "Read the scenario"). Behind it an SVG fan of five survival curves that draw themselves on load, with scattered dots. Right: a dark onboarding card "PUT YOURSELF IN IT" with six inputs: name, country (24 options + "Somewhere else"), age (18–85, default 35), "Aging solved by" year (2028–2100, default 2045), income percentile slider, and an everyday-exposure slider ("Very safe" → "High exposure"; hint: job safety, driving, neighborhood, substance use). Button "Build my projection". Footnote "Nothing you enter leaves your browser."

**01 · Start with a simpler question.** Reframes "can we live forever?" as "if old age stopped killing people, what would?" Shows the exponential math in a dark mono card: p ≈ 0.0009/yr, average 1/p ≈ 1,100 years, median ln2/p ≈ 770 years. Then a bordered block **"Could this actually happen?"** with two short cited paragraphs (biology: hallmarks of aging, 109% remaining-life extension in old mice, first human partial-reprogramming dosing June 2026, Retro/NewLimit/Isomorphic money, Olshansky 2024 as counterweight; speed: METR task-horizon doubling, IMO gold, rentosertib to Phase 3, AI Futures Dec 2025 revision) and a sources line. Beside it a dark CTA card to the scenario ("The scenario · 2025–2048"). Then "three things to watch for" as the reader scrolls.

**02 · Meet the curve.** The population survival curve in the **frozen world** (no further progress), pinned to `advancementScenario: 'static'` so it matches 01's numbers. Left rail: controls for aging scenario (slowed / halted / reversed), held biological age, background rate, risk profile (Ultra-low 0.3× → Extreme 8×), plus confidence badges for the sources. Right: `SurvivalCurveChart` (X: years from now, Y: "Share still alive", compact asymptote labels), a stats row (mean, median, P(dead by 100/500/1000)), a mortality-decomposition bar (seven causes summing to 90/100k), and, if the user has a profile, a comparison table "you vs the average" with a rose note about access delay.

**03 · Now let the world keep improving.** Four advancement scenarios (static 0, moderate 0.5%/yr, aggressive 2%/yr, LEV = p₀/ln2) on one chart, with the selected curve emphasised, floor labels, and a callout explaining escape velocity. Historical evidence strip: infectious-disease mortality −98% since 1900, road deaths per mile −97%, workplace deaths −91%. Uses `agingBackground()` so the aging controls from 02 still move these curves.

**04 · Who gets it, and when.** `StratificationChart`: survival by income quintile with access delays (Q5 0%, Q4 15%, Q3 40%, Q2 70%, Q1 100% of a max-delay parameter, default 50 years). Copy explains the delay is spent at biological prime under the old rules, so a 10-year gap costs centuries, not years. Amber box with inequality evidence (Chetty 2016 14.6-year top-1% vs bottom-1% gap; Lancet "Ten Americas" 12.6 → 20.4 years 2000–2021; Case & Deaton education gap 2.6 → 8.5 years) and a diffusion paragraph (WHO added GLP-1s to the Essential Medicines List Sept 2025; generic semaglutide in India March 2026 at ~$14/month while US/EU patents run into the 2030s; PEPFAR 2025 freeze as proof access can reverse). A "← [name]" marker shows the user's quintile. Falls back to floor-gap language when medians are infinite.

**05 · The average hides the story.** `DistributionChart` (X "Years lived", Y "Chance of dying that year") with a marker for the user's median. Two-column "dual rows" comparing static vs improving worlds. A panel on slow risks: suicide at 13.7/100k held flat gives ~1.4% by year 100, ~6.6% by 500, ~12.8% by 1,000.

**06 · Which number are we most wrong about?** `TornadoChart` with three inputs (p₀, r, exposure) swung low/high around the floor; direction-robust. Four "open questions" cards: mental health over centuries, violence at AI timescales, risk compensation, population and resources.

**07 · So what would actually change?** Nine implication cards, each badged "Follows from the math" / "Reasonable guess" / "Speculative": causes of death invert; slow risks dominate; the access gap is measured in lifetimes; risk behaviour changes (Peltzman); institutions built on 80-year lives; the Williams tedium objection vs Parfit; inequality compounds; the cost of waiting; the "if" stays open. Sources footer.

**08 · One version of your long life.** Dark section. If a profile exists: a vignette chosen by `selectStory` from the user's inputs (weights: missed-it, high-exposure, wealthy-early, waiting, etc.), with drop cap and four stat chips (Home, Reaches you ~year, Your age then, Median life). Below: "How it plays out for others" — a persona browse menu of nine illustrative lives in specific places (NYC, Uttar Pradesh, Lagos, Osaka, Zurich…), each a concrete sci-fi vignette with named tech, objects, dates; the one closest to the user is tagged "closest to you".

**Footer.** One-paragraph description, key sources, link to the scenario.

---

## 3. Escape Velocity (`/escape-velocity`)

An AI-2027-style **narrative** (not a fact list). Sticky top bar with emerald progress. Serif hero "Escape *Velocity*", subtitle "A grounded scenario · 2025–2048". A cast grid, then 18 numbered chapters with drop caps; the active chapter is full-opacity, others dimmed. A sticky right-hand **dashboard** (`ScenarioChart`) keeps score as you scroll: frontier survival floor (green line lifting off the axis), typical-person line, research-speed sparkline, and stats (AI system in charge, research speed ×, treated biological age, cost per course, share of world with access, frontier median lifespan → "no limit" past LEV). The observed years are shaded. Each chapter has a "Why this forecast?" expandable sidebar and cited sources. The story ends at a **fork** with two buttons (broad access / locked in) that change the chart and the epilogue.

**Cast:** Ines Okafor (reprogramming biologist at "Amaranth", a composite lab); Emeka Okafor (her father, 77 in 2032, the first person she enrols); Teodora Halloran (Series-B investor who becomes one of the first paying patients); Marcus Bellweather (FDA reviewer, later the man arguing over who gets it); Ravi Mehra (schoolteacher in Lucknow who reads about it, and waits); Agent-1 → Agent-5 (successive AI generations running the science).

**Chapters (year · title · basis):**
1. 2025–2026 · The pieces on the table · *observed* (everything cited: rentosertib Nat Med June 2025 → Phase 3 July 2026; Loyal's FDA "reasonable expectation of effectiveness" Feb 2025, approval still pending; Gemini IMO gold July 2025; GPT-5, Opus 4.5, TPU and Stargate deals; METR doubling; Retro $1B, NewLimit $130M, Isomorphic $2.1B; ARPA-H PROSPR, XPRIZE Healthspan; AI Futures Dec 2025 revision; overdose and murder falling; closes on ER-100's first human dosing 9 June 2026 with Ines, 32, reading it in a stairwell).
2. 2027–2028 · The slow years · forecast (plateau: agents improve on METR's schedule but mice and regulators set the pace; ER-100 reads out clean; Loyal gets its approval; clocks creep into protocols; Ines joins Amaranth; Emeka's hip; Ravi introduced).
3. 2029 · The long weekend · forecast (Agent-1 kills 31 of 40 planned mouse experiments in a virtual cell; the design-build-test loop closes over a weekend).
4. 2030 · The research multiplier (Agent-2 stops asking what to do; Amodei's compression made concrete; the bottleneck becomes mice).
5. 2031 · Reading the clock (epigenetic clocks on a fingerstick; Bellweather's FDA memo accepts a clock as surrogate endpoint; a 40-year trial becomes 90 days; Emeka is 76).
6. 2032 · Moving it (Agent-3; first human protocol stacks senolytic + tissue-by-tissue reprogramming + rapamycin-family drug; Emeka, 77, in the second cohort, reads 74 on the composite clock after 90 days).
7. 2033 · The wall (10,000-person expansion study rolls first-trial volunteers into numbered cohorts; Emeka is in cohort four; a Zurich cluster; benign overgrowth from a lingering vector; capsid redesigned in 11 days; clinics reopen in August. "Every powerful technology has a year like 2033.")
8. 2034 · The first clinics ($2M a course, four or five cities; Teodora, 71, finishes her third course, cardiac clock 41).
9. 2035 · The other curve (the site's own model: background risk ~1 in 1,000/yr → median closer to 800 years than 100; Agent-4 makes everything else safer; the floor lifts off the axis).
10. 2036 · The queue (Ravi, 37, does the division: 55 years of salary; registers on a ministry waitlist with 40 million names; stops riding the motorbike; price $500k → $250k).
11. 2037 · Who it is for (Denmark buys it for everyone over 60 on credit against pensions; the US litigates; Tijuana grey market; Bellweather in Geneva).
12. Spring 2038 · Faster than a body ages (Teodora 75 by calendar, 40 on the clock; Ines 44; Emeka 83 reads 58; "maintenance, the way you think of a car").
13. A Tuesday in April, 2039 · Escape velocity (de Grey's even-odds year was 2036; he was three years early; the floor passes one in two; ~1% of the world has access; "a number that went up").
14. 2040 · The gap · *implication* (Ravi, 41, still on a list; price $30k; a friend dies on the Kanpur road at 43; Teodora and Ravi on different curves "in kind").
15. 2041–2042 · The long fall of the price ($16k → $8k; vectors a commodity in Hyderabad, Shenzhen, São Paulo; patents set aside; 11% of the world with access).
16. 2043 · The letter (Ravi, 44, gets a clinic appointment in Lucknow, a Thursday in August, 3:40 pm; the fork is set up).
17. The long run · What a very long life is made of · implication (distribution not average; causes of death invert; suicide over a millennium ~1 in 8; Teodora "would let them know in a hundred years").
18. The fork · Is it worth wanting, and who gets to decide · implication (Williams 1973 vs Parfit; two buttons).

**Branch epilogues.** *Broad:* the clinic calls Ravi back, the line goes round the block, he stands in it six hours. *Locked:* the budget line fails in 2044; Ravi is still on a waiting list in 2048, at 49, "watching the price fall a little more slowly than his body"; "the branch that requires no coordination at all, which is exactly why it is the one you get by default."

**Dashboard series (year → AI system, research speed ×, treated bio-age of a 75-year-old, r, cost, access %):** 2025–2028 Agent-0, speed 1→1.8, no effect, r 0, not for sale, 0%. 2029 Agent-1 speed 2. 2030 Agent-2 speed 8. 2031 Agent-2 25, bio-age 74. 2032 Agent-3 80, 72. 2033 Agent-3 250, 70. 2034 Agent-3 700, 66, $2.0M, 0.001%. 2035 Agent-4 2,000, 61, r 0.0004, $1.2M, 0.01%. 2036 Agent-4 6,000, 55, r 0.0007, $500k, 0.05%. 2037 Agent-4 15,000, 48, r 0.001, $250k, 0.2%. 2038 Agent-4 40,000, 40, r 0.00125, $120k, 0.6%. **2039 Agent-5 100,000, 32, r 0.0014, $60k, 1.2% (floor crosses 50%).** 2040 200,000, 28, r 0.00175, $30k, 3%. 2041 350,000, 25, r 0.0022, $16k, 6%. 2042 500,000, 25, r 0.0028, $8k, 11%. 2043 700,000, 24, r 0.0036, $5k, 18%. 2044 850,000, 24, r 0.0046, $3k, 27%. 2045 1.0M, 23, r 0.0058, $2k, 38%. 2046 1.2M, 23, r 0.0072, $1.5k, 48%. 2047 1.4M, 22, r 0.0088, $1.1k, 55%. 2048 1.6M, 22, r 0.0105, $900, 62%. Typical-person access (broad vs locked) starts 2040: 0.3/0.3, 1.5/0.6, 4/1, 9/1.5, 17/2, 27/3, 38/4, 48/5, 57/6 (%).

**Pacing rationale (stated on the page):** the ramp follows the AI Futures Project's December 2025 revised medians (superhuman coder ~2032; Kokotajlo ~2030). On the original AI 2027 schedule everything after the observed chapters would sit ~3 years earlier and LEV would land on de Grey's 2036. The threshold does not move: LEV needs background mortality to improve by only ~0.13%/yr.

Full text of every chapter is in `02_content_source/scenario.ts` and rendered in `03_site_copy_rendered/escape_velocity_text.txt`.

---

## 4. How the model works

### 4.1 Core math (`actuarialMath.ts`)
- Static: S(t) = exp(−p·t); mean 1/p; median ln2/p.
- Time-varying: p(t) = p₀·e^(−rt); S(t) = exp(−(p₀/r)(1 − e^(−rt))); floor S(∞) = exp(−p₀/r).
- LEV threshold: r_LEV = p₀/ln 2 (floor = 50%).
- `analyticPercentile(p0, r, pct)`: closed form; returns Infinity when the target survival is below the floor. (Reading percentiles off a 300-year chart curve was an early bug that showed "no limit" in the frozen world.)
- `agingBackground(params)`: aging-scenario adjustments. *Halted* at held age a: frailty factor 1 + max(0, a − 30)·0.02. *Slowed* (factor f, default 0.5): adds residual Gompertz hazard f·A·e^(B·age).
- Pre-treatment aging: Gompertz–Makeham, A = 0.00005, B = 0.088, calibrated to US period life tables.
- `computePersonalScenario(profile, advancement)`: two phases. Wait years = treatmentYear + accessDelay − 2026, with access delay driven half by the country's access rank and half by income quintile; survive that wait under aging; then halted aging with country- and exposure-adjusted p₀ and optional r. Returns effective p₀, access calendar year, age at access, P(survives to treatment), survival curve, floor, median, P(dead by 100/500/1000), quintile.
- `computeSensitivity`: swings p₀, r, exposure.
- Long percentile curves: `PCT_TMAX = 20000`, `PCT_STEP = 20`.

### 4.2 Constants (`constants.ts`), September 2026 values
- `p0 = 0.0009` (CDC NVSS 2024 final; NCHS Data Briefs 548/549, FastStats Homicide 2024, NHTSA 2024/2025, FBI 2025). Mortality components (per 100k/yr, sum **exactly 90.0**, test-enforced): Accidents 45.0 (overdose 23.1 + motor vehicle ~11.6 + non-aging falls ~6 + other ~4.3); Suicide 13.7; Homicide 5.9; Infectious disease 15.0; Medical error 7.5 (contested, aging-adjusted); Armed conflict 1.0; Other 1.9. 2025 provisional data point to ~85/100k, so 0.0009 is conservative-high.
- Advancement r: static 0; moderate 0.005; aggressive 0.02; LEV computed.
- Risk profiles: ultra_low 0.3×, low 0.6×, moderate 1.0×, elevated 2.5×, extreme 8×.
- Exposure slider → multiplier, piecewise: 0 → 0.5×, 50 → 1.0×, 100 → 4×.
- Income percentile → quintile; quintile delay fractions Q5 0, Q4 0.15, Q3 0.40, Q2 0.70, Q1 1.0 × max delay (50y default).
- 24 countries with `mortalityMultiplier` and `accessRank` (illustrative proxies).
- `CURRENT_YEAR = 2026`; `SUICIDE_RATE_PER_YEAR = 0.000137`.
- Section 02 forces `advancementScenario: 'static'`; the global default is `'moderate'`.

### 4.3 State
`useModelState` React context: model params + user profile `{name, countryCode, currentAge, incomePercentile, riskAppetite, treatmentYear}` + `hasProfile`.

### 4.4 Tests (vitest, 52 passing)
Math invariants (770-year median, LEV threshold ≈ 0.0013, percentile Infinity past floor, aging monotonicity); constants (components sum to p₀ within 1e-9, BASE_US_P0 === DEFAULT_PARAMS.p0, risk midpoint, quintile boundaries); story selection; scenario integrity (LEV crossing exactly at 2039, monotone floor/speed/access, cost falls once on sale, broad ≥ locked, a row for every year 2025–2048, beats in order, period label ↔ year, `slow` beat exists, cast present, no beat re-dates ER-100 to 2025, character ages at four checkpoints).

---

## 5. Design system

- Fonts: **Instrument Serif** (headlines, 400 normal + italic), **Inter** (body), **JetBrains Mono** (numbers, eyebrows). Tailwind v4 with `@theme inline` tokens.
- Colours: warm-neutral zinc; one blue accent `#2563eb` for the population model; rose `#e11d48` for "you"; emerald `#10b981` for the good outcome; amber `#f59e0b` for open questions. Dark sections use zinc-950.
- Surfaces: `.card`, `.card-muted`, `.card-dark` (1.25rem radius, soft layered shadow). `.tnum` tabular numerals. Drop caps on story paragraphs. Range/select restyled; `.dark-controls` for the onboarding card.
- Motion: `Reveal` scroll fade-up (visible by default, armed client-side only, IntersectionObserver + scroll listener + 8s timer fallback; never touch the `<html>` class, it caused a hydration mismatch); hero curves draw via `pathLength=1`; `number-in` pop on stat changes; `scenario-pop`. All respect `prefers-reduced-motion`.
- Nav: `max-w-6xl` rail, pill links, brand, emerald "Read the scenario →" CTA; scrollspy via IO; progress bar.
- Charts: Recharts 3; numeric X axes with explicit tick arrays; Y-axis titles on every chart; compact asymptote % labels; styled tooltips.

---

## 6. Writing standards (the user's, enforced across sessions)
- Concise, human, comprehensible. Simple explanation first, technical detail after. No AI tells: avoid em-dash overuse and words like "genuinely", "fundamentally", "qualitatively different".
- Real citations only; verify DOIs/URLs before writing them. Credibility is the point.
- The scenario must be **narrative**: recurring people, dated chapters, reversals, concrete specifics (named tech, scenes, objects, dates, specific places like NYC and Uttar Pradesh). Not a listing of facts and considerations.
- Tone: optimistic but grounded. Never open with "most people imagine immortality; they're wrong."
- Completeness: ship the finished thing with tests, docs, and a QA pass. Never table work or offer a workaround when the real fix is reachable.
- Hedge every unverified claim; anything after Sept 2026 is written as the scenario's forecast, never as fact.

---

## 7. Change history (chronological)

**Session 1 (Aug 2026): initial build.** Research doc v1.0 (45 refs), Excel workbook, Next.js site with eight sections, personalization form, nine vignettes, first deploy to Vercel.

**Session 2: QA flags → fixes; age and treatment-year variables.** User asked for a QA/UX sweep, then "fix all except 11." Added `currentAge` and `treatmentYear` to the profile; built the two-phase Gompertz-then-halted personal model. Fixed axis labels (Y titles missing; x-tick formatting). Added a cited "Could this actually happen?" paragraph including superintelligence enablement (Amodei). Reframed the risk slider from thrill-seeking to everyday exposure. Fixed Section 02 charts (pinned to static; closed-form percentiles). Made vignettes longer, more sci-fi, with a persona browse menu and specific locales. Added hero background graphic and animations. Then "vignettes too vague" → rewritten concrete and illustrative.

**Session 3: Fable redesign ("boil the ocean").** New editorial design system (Instrument Serif, cards, reveals, scrollspy). Main-page copy cut for wordiness. Escape Velocity expanded from 9 beats to 17 chapters (~5,300 words) as a true narrative with a recurring cast, a 2030 safety scare, an access fight, and a fork. Vitest suite (45 tests), real READMEs. Tests caught a real inconsistency: by-cause mortality summed to 115/100k vs headline 95 → reconciled. Fixed React key collisions, a hydration mismatch, reveals stuck at opacity 0 in a hidden browser pane, nav clipping at 1280px. Deployed after a Vercel device-login.

**Session 4 (5–6 Sept 2026): "September update check."** Five parallel research sweeps (repo claim inventory; US mortality; longevity biology; AI progress/timelines; demography/inequality/diffusion), with load-bearing numbers re-verified against primary CDC/NHTSA/FBI/company pages. Changes:
- **Mortality rebased** CDC 2021 → CDC 2024 final: overdose −26% in 2024 and ~−14% in 2025; homicide 8.2 → 5.9/100k (FBI 2025: 4.1, tied record low); life expectancy 79.0. p₀ 0.00095 → **0.0009**; headline 1,050/729 → **~1,100/~770**; LEV 0.14% → 0.13%. Components 47.5/14.1/7.8/15/7.5/1/2.1 → 45.0/13.7/5.9/15.0/7.5/1.0/1.9 (sum 90). Cascaded through constants, sections, tests, READMEs, research doc, and the Excel generator (which was still on an old 115/100k decomposition).
- **Factual error fixed:** the scenario had Life Biosciences dosing the first human with partial reprogramming in 2025; it was 9 June 2026. A test now fails on any re-dating.
- **Observed opening chapter** rebuilt to cover 2025 → mid-2026 (list in §3 above).
- **Feasibility paragraph** rewritten; **access/inequality evidence** added (Ten Americas, Case & Deaton, GLP-1 generics, PEPFAR); Olshansky 2024 given standing as the counterweight.
- Research doc → v1.1, 75 references, §11 changelog.
- Review pass found and fixed: a stale "14.1/100k" label, a footer over-claiming "events of 2025 and 2026 are real" (→ "through mid-2026"), missing sources on the observed beat, a cohort-continuity wobble, an uncited bibliography entry, a stale comment.
- **Scenario re-timed +3 years** at the user's request ("shift it accordingly; content shouldn't change, just timing"): Agent-1 2029, Agent-2 2030, LEV 2036 → **2039**, end year 2045 → **2048**; bridging chapter "The slow years" (2027–2028) added; de Grey's 2036 kept and called "three years early"; dashboard series rebuilt with plateau rows; every date and character age moved; framing text changed from "explicit fast branch" to "paced to the Dec 2025 medians". 52 tests. Deployed and verified live.

**Left deliberately unchanged:** the personal-model "Aging solved by" slider default stays 2045 (it is the reader's assumption, not the scenario's).

---

## 8. Known gotchas for a rebuild
- Recharts: give numeric X axes explicit ticks; label every Y axis.
- Percentiles must be closed-form, not read off a truncated curve.
- Never mutate `<html>` className client-side (hydration mismatch).
- Scroll-reveal must be visible by default and arm only client-side; add scroll + timer fallbacks.
- JSX whitespace: citations like `<em>Cell</em>{' '}2013` need the explicit space or they render "Cell2013".
- Keep by-cause components summing exactly to p₀ and test it.
- "in United States" → use a `naturalPlace()` helper ("the United States", "your corner of the world").

---

## 9. What is in this bundle
- `01_brief/` this file + root README.
- `02_content_source/` the four content-bearing source files (scenario, stories, constants, types).
- `03_site_copy_rendered/` the live pages' full text and two screenshots.
- `04_code/` the full `src/` tree, package.json, vitest config, website README (reference only).
- `05_research/` the research document (v1.1, 75 refs).
- `06_memory_and_chat/` the assistant's persistent project notes, writing-standards notes, and `CHAT_CONTEXT.md` (the conversation history in order).
- `07_excel/` the workbook and its generator.
