# Longevity Projection Model — Assumptions and Evidence Base

**Version:** 1.1  
**Date:** September 2026  
**Status:** Working document — assumptions subject to revision as evidence evolves

---

## Table of Contents

1. [Model Architecture Overview](#1-model-architecture-overview)
2. [Background Mortality Rate (p₀)](#2-background-mortality-rate-p₀)
3. [Background Mortality by Cause](#3-background-mortality-by-cause)
4. [Technological Improvement Rate (r)](#4-technological-improvement-rate-r)
5. [Aging Scenarios](#5-aging-scenarios)
6. [Access and Democratization](#6-access-and-democratization)
7. [Risk Profile Archetypes](#7-risk-profile-archetypes)
8. [Behavioral and Psychological Effects](#8-behavioral-and-psychological-effects)
9. [Known Unknowns and Open Questions](#9-known-unknowns-and-open-questions)
10. [Bibliography](#10-bibliography)
11. [Changelog](#11-changelog)

---

## 1. Model Architecture Overview

### 1.1 Conceptual Framing

"Solving aging" is not a claim about immortality. It is a claim about eliminating one cause of death — biological senescence — while leaving all other causes intact. This distinction is analytically critical. Even in a world where aging is perfectly eliminated, people continue to die from accidents, violence, suicide, infectious disease, and other non-aging causes. The resulting lifespan is not infinite; it is finite in expectation, but dramatically extended relative to current lifespans, and governed by the distribution of non-aging risks.

The correct actuarial framing: if annual non-aging background mortality rate = p (the probability of dying from a non-aging cause in any given year), then lifespan follows an exponential distribution with parameter p. Expected lifespan = 1/p. Median lifespan = ln(2)/p.

### 1.2 Baseline Model (Exponential Survival)

With aging solved and background mortality fixed at rate p:

**Survival function:** S(t) = e^(−p·t)

**Probability density:** f(t) = p · e^(−p·t)

**Expected lifespan:** E[T] = 1/p

**Median lifespan:** Median = ln(2)/p ≈ 0.693/p

At p = 0.001 (0.1%/year, consistent with developed-country non-aging mortality):
- Expected lifespan: 1,000 years
- Median lifespan: 693 years
- Probability of dying before age 100: 1 − e^(−0.001·100) ≈ 9.5%
- Probability of dying before age 500: 1 − e^(−0.001·500) ≈ 39.3%

At the model's actual central estimate, p₀ = 0.0009 (Section 2), the same arithmetic gives an expected lifespan of ~1,111 years and a median of ~770 years — the numbers used throughout the rest of this document and the site.

### 1.3 Time-Varying Mortality (Concurrent Technological Advancement)

The naive model holds background mortality constant. A more realistic model allows background mortality to decline over time as technology improves — autonomous vehicles reduce accident deaths, AI-accelerated medicine compresses pandemic response, better trauma care improves survival rates.

If background mortality declines at annual rate r:

**Time-varying mortality:** p(t) = p₀ · e^(−r·t)

**Survival function:** S(t) = exp(−p₀/r · (1 − e^(−r·t)))

**Asymptotic survival probability:** S(∞) = exp(−p₀/r)

The asymptote is a profound result: for any positive r, a nonzero fraction of the population survives indefinitely in expectation. The magnitude depends on p₀/r:

| p₀ | r | p₀/r | S(∞) |
|---|---|---|---|
| 0.001 | 0.005 | 0.20 | 81.9% |
| 0.001 | 0.010 | 0.10 | 90.5% |
| 0.001 | 0.020 | 0.05 | 95.1% |
| 0.001 | 0.050 | 0.02 | 98.0% |

### 1.4 Longevity Escape Velocity (LEV)

Aubrey de Grey's concept of "longevity escape velocity" (LEV) describes the point at which life expectancy extensions outpace the passage of time — informally, when for every year you live, more than one year is added to your expected remaining lifespan.

In the time-varying model, the LEV threshold is defined as the minimum r at which the asymptote S(∞) exceeds 50% — meaning more than half the population can survive indefinitely:

**LEV threshold:** r_lev = p₀ / ln(2) ≈ 1.443 · p₀

At p₀ = 0.001: r_lev ≈ 0.00144 (0.144%/year improvement in background mortality)

This is a surprisingly achievable threshold. A 0.144%/year annual improvement in background mortality — barely faster than historical safety technology diffusion — is sufficient for a majority of people to have a nonzero probability of surviving indefinitely in the model.

**Important caveat:** This model assumes exponential decline in background mortality and does not account for floors, reversals, or adversarial risks that could prevent indefinite improvement. It should be treated as a bounding analysis.

---

## 2. Background Mortality Rate (p₀)

### 2.1 Central Estimate

**Central estimate: p₀ = 0.0009 (~0.09%/year)**  
**Confidence: HIGH** for the order of magnitude; MEDIUM for the precise figure due to definitional questions about what counts as "non-aging" mortality.

This estimate is derived from CDC NVSS 2024 final mortality data for causes that are clearly non-aging: accidents, intentional self-harm, assault, infectious disease, and other external causes. Age-specific deaths from cardiovascular disease, cancer, and neurodegeneration are excluded as largely aging-attributable. The residual represents mortality attributable to causes that would persist even with aging fully solved.

**Source:** Xu J, Murphy SL, Kochanek KD, Arias E. *Mortality in the United States, 2024.* NCHS Data Brief No. 548. CDC/NCHS, January 2026. Available at: https://www.cdc.gov/nchs/products/databriefs/db548.htm

**Source:** Xu J, et al. *Drug Overdose Deaths in the United States, 2023–2024.* NCHS Data Brief No. 549. CDC/NCHS, January 2026. Available at: https://www.cdc.gov/nchs/products/databriefs/db549.htm

**The 2021 → 2024 shift.** The model's previous version (1.0) was calibrated to CDC NVSS 2021 data, which sat near the fentanyl-era overdose peak and the tail of the COVID-19 pandemic and so overstated the non-aging baseline. Final 2024 data show a materially safer picture: drug overdose deaths fell 26.2% from 2023 to 2024 (105,007 → 79,384; age-adjusted rate 31.3 → 23.1 per 100,000), homicide fell from 8.2/100,000 in 2021 to 5.9/100,000 in 2024 (7.1 in 2023), and US life expectancy rose from 76.4 years (2021) to 79.0 years (2024). Provisional 2025 data point further in the same direction: CDC's May 2026 release estimated 69,973 overdose deaths in 2025 versus 81,313 in 2024 (a further ~14% decline), and the FBI's August 2026 report put the 2025 murder rate at 4.1/100,000, down 18.1% from 2024 and tied with 1955–56 for the lowest ever recorded. Applying that trajectory would put total non-aging background mortality closer to ~85/100,000 rather than 90/100,000 — meaning the p₀ = 0.0009 used here, itself already a reduction from 0.00095, is if anything conservative-high relative to where the trend is headed.

### 2.2 Geographic Variation

Background mortality varies substantially across developed countries. The US has elevated rates due to high accident and homicide rates. Lower-risk developed countries (Japan, Iceland, Switzerland, Singapore) have non-aging background mortality in the range p₀ ≈ 0.0004–0.0007.

| Country profile | Estimated p₀ | Implied expected lifespan (aging solved) |
|---|---|---|
| High-safety developed country (Japan, Iceland) | 0.0005 | ~2,000 years |
| Mid-range developed country (UK, Germany) | 0.0007 | ~1,430 years |
| US average | 0.0009 | ~1,100 years |
| US elevated risk (urban, male, age 20-40) | 0.002 | ~500 years |
| Low/middle income country | 0.003–0.010 | 100–330 years |

**Source:** World Health Organization. *Global Health Observatory: Cause-Specific Mortality.* WHO, 2024. Available at: https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates

**Source:** Ritchie H, Roser M. *Causes of Death.* Our World in Data, 2023. Available at: https://ourworldindata.org/causes-of-death

### 2.3 Model Range

| Scenario | p₀ | Source/Rationale |
|---|---|---|
| Low (best-case developed country) | 0.0004 | Japan/Iceland non-aging mortality |
| Central (US average) | 0.0009 | CDC NVSS 2024 final |
| High (elevated risk, US) | 0.002 | Urban male, age-standardized for working-age adults |
| Very high (low-income country) | 0.005 | WHO GHO, sub-Saharan Africa |

---

## 3. Background Mortality by Cause

All rates below are for the US population unless otherwise noted, expressed as deaths per 100,000 per year. The total non-aging mortality rate of ~90/100,000/year ≈ 0.09%/year is the basis for p₀. The per-cause rates below are set within their sourced ranges so that they sum to exactly 90/100,000 (the same figures used in the website's `constants.ts`), rebased onto CDC NVSS 2024 final data now that the fentanyl-era overdose peak and the COVID-19 pandemic have both receded substantially.

### 3.1 Accidents (Unintentional Injuries)

**Rate: 45.0 per 100,000/year (0.045%)**  
**Confidence: HIGH**  
**Share of p₀: ~50%**

This is the single largest non-aging cause of death in the US, and the component with the largest year-over-year change since the 2021 baseline. It decomposes as: drug overdose 23.1/100k (79,384 deaths, age-adjusted), motor vehicle ~11.6/100k (39,254 deaths, NHTSA 2024), the non-aging-attributable share of falls ~6/100k, and ~4.3/100k of drowning, fires and other unintentional causes.

Note on drug overdoses: the fentanyl-era surge peaked in 2022–2023; 2024 final data (NCHS Data Brief 549) recorded 79,384 overdose deaths (23.1/100k age-adjusted), down 26.2% from 105,007 deaths (31.3/100k) in 2023 — the largest one-year decline in recorded US overdose mortality. Provisional 2025 data (CDC, May 2026) show the decline continuing: an estimated 69,973 overdose deaths versus 81,313 in 2024, a further ~14% drop, with opioid deaths specifically falling from 55,296 to 44,564. Whether this decline persists over decades is uncertain, but the trend direction has reversed from the previous model version.

**Source:** Xu J, Murphy SL, Kochanek KD, Arias E. *Mortality in the United States, 2024.* NCHS Data Brief No. 548. CDC/NCHS, January 2026.

**Source:** Xu J, et al. *Drug Overdose Deaths in the United States, 2023–2024.* NCHS Data Brief No. 549. CDC/NCHS, January 2026.

**Source:** National Highway Traffic Safety Administration. *NHTSA Estimates 39,345 Traffic Fatalities in 2024.* NHTSA, 2026. Available at: https://www.nhtsa.gov/press-releases/nhtsa-estimates-39345-traffic-fatalities-2024

**Source:** CDC. *WISQARS (Web-based Injury Statistics Query and Reporting System).* Centers for Disease Control and Prevention, National Center for Injury Prevention and Control. Available at: https://wisqars.cdc.gov/

**Historical trend:** Accident death rates outside of overdoses have declined ~1–2%/year over the past 50 years, driven by vehicle safety improvements, workplace regulation, and building codes; NHTSA's 2025 early estimate of 36,640 traffic deaths (1.10 per 100 million vehicle miles traveled) would be the second-lowest fatality rate on record. Drug overdose deaths surged dramatically post-2013 (fentanyl era), peaked in 2022–2023, and have since posted the largest recorded declines (−26.2% in 2024, a further ~−14% in provisional 2025 data) — reversing, rather than continuing, the trend this model previously assumed.

### 3.2 Suicide (Intentional Self-Harm)

**Rate: 13.7 per 100,000/year (0.0137%)**  
**Confidence: HIGH**  
**Share of p₀: ~15%**

The US suicide rate has fluctuated between 10–15/100k over the past several decades. 2024 final data record 48,824 suicide deaths (13.7/100k age-adjusted), the first year-over-year decline since 2020. In contrast, many other developed countries (UK, Japan, Australia) have achieved sustained reductions through means restriction policies and improved mental health treatment access.

**Critical modeling note:** Suicide is the most analytically difficult cause in the context of very long lifespans. Its annual rate appears modest — 13.7/100k — but over a 770-year median lifespan (at p₀ = 0.0009), cumulative probability accumulates. If the suicide rate stays constant at 13.7/100k, the probability of dying by suicide over 1,000 years is 1 − e^(−0.000137·1000) ≈ 12.8%. This is material and non-trivial. Whether risk-of-suicide increases, decreases, or stabilizes over very long lifespans is a genuinely open question (see Section 9).

**Source:** Xu J, Murphy SL, Kochanek KD, Arias E. *Mortality in the United States, 2024.* NCHS Data Brief No. 548. CDC/NCHS, January 2026.

**Source:** Ritchie H, Roser M. *Suicide.* Our World in Data, 2023. Available at: https://ourworldindata.org/suicide

**Historical trend:** US rates were essentially flat for decades and have now posted a first decline. Some peer nations have achieved 30–50% reductions since the 1990s through targeted interventions. High uncertainty in both directions for multi-century projections.

### 3.3 Homicide and Violence

**Rate: 5.9 per 100,000/year (0.0059%)**  
**Confidence: HIGH** (current rate); **LOW** (long-run trajectory)  
**Share of p₀: ~7%**

US homicide rate is elevated relative to peer nations (UK: ~1.2/100k; Germany: ~0.8/100k; Japan: ~0.3/100k), but it has fallen sharply and steadily since the model's original 2021 baseline. CDC FastStats (NVSS via CDC WONDER) [48] recorded 20,162 homicides in 2024 (5.9/100k), including 15,364 firearm homicides (4.5/100k) — down from an age-adjusted 8.2/100k in 2021 and 7.1/100k in 2023 (NCHS Data Brief 526). The decline continued into 2025: the FBI's August 2026 report on 2025 reported crime put the national murder rate at 4.1/100,000, down 18.1% from 2024 and tied with 1955–56 for the lowest rate ever recorded.

**Source:** CDC FastStats: Homicide (NVSS via CDC WONDER), 2024. Available at: https://www.cdc.gov/nchs/fastats/homicide.htm

**Source:** FBI. *2025 Reported Crimes in the Nation.* Federal Bureau of Investigation, August 2026. Available at: https://www.fbi.gov/news/press-releases/fbi-releases-2025-reported-crimes-in-the-nation-statistics

**Source:** United Nations Office on Drugs and Crime (UNODC). *Global Study on Homicide 2023.* UNODC, Vienna, 2023. Available at: https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html

**Long-run trend (contested):** Steven Pinker's *Better Angels of Our Nature* (2011) documents a multi-century decline in violence per capita in Europe and North America. The 2021–2025 US data corroborate that direction in the near term, but the adversarial nature of violence means AI and technology advancement could go in either direction — they may improve both defensive capacity and offensive capability simultaneously. The model explicitly does not assume violence decreases with advancement, unlike accidents or infectious disease.

**Source:** Pinker S. *The Better Angels of Our Nature: Why Violence Has Declined.* Viking Books, 2011. ISBN: 978-0670022953.

**Source:** Roser M. *Homicides.* Our World in Data, 2023. Available at: https://ourworldindata.org/homicides

### 3.4 Infectious Disease

**Rate: 15 per 100,000/year (0.015%) central; sourced range 15–25**  
**Confidence: MEDIUM** (high variance by year and epidemic conditions)  
**Share of p₀: ~17% in non-pandemic years**

Pre-COVID, US infectious disease mortality was approximately 15–20/100k/year. COVID-19 spiked this to 200–300/100k in 2020–2021. By 2024, COVID-19 had fallen to the 15th leading cause of death in the US, with 31,426 deaths (roughly 9/100k and still declining) — close enough to a pre-pandemic endemic level that this component's rate reverts to its long-run central estimate. This category includes influenza/pneumonia, septicemia, HIV/AIDS, and other infections.

**Source:** Xu J, Murphy SL, Kochanek KD, Arias E. *Mortality in the United States, 2024.* NCHS Data Brief No. 548. CDC/NCHS, January 2026.

**Source:** Woolf SH, et al. *Excess Deaths from COVID-19 and Other Causes in the US, March 2020–January 2021.* JAMA, 2021;325(17):1786–1789. DOI: 10.1001/jama.2021.5199

**Source:** GBD 2019 Diseases and Injuries Collaborators. *Global burden of 369 diseases and injuries in 204 countries and territories, 1990–2019.* The Lancet, 2020;396(10258):1204–1222. DOI: 10.1016/S0140-6736(20)30925-9

**Historical trend:** Long-run infectious disease mortality has declined dramatically since the early 20th century — from ~800/100k in 1900 to ~15–20/100k today. This 98% reduction over 120 years represents an average improvement of approximately 3.3%/year, providing a strong historical precedent for the "moderate concurrent advancement" scenario (r = 0.5–1%/year for all-cause background mortality going forward).

**Pandemic tail risk:** Single pandemic events can cause massive mortality spikes. The 1918 influenza pandemic killed an estimated 50–100 million people globally, roughly 3–5% of world population. COVID-19's case fatality rate was compressed by rapid vaccine development (mRNA vaccines available within ~11 months of sequence publication). Future pandemic tail risk is non-zero; AI-accelerated biology will reduce response times but may also create new risks.

**Source:** Taubenberger JK, Morens DM. *1918 Influenza: the Mother of All Pandemics.* Emerging Infectious Diseases, 2006;12(1):15–22. DOI: 10.3201/eid1201.050979

### 3.5 Medical Error

**Rate: 7.5 per 100,000/year (0.0075%), aging-adjusted central; unadjusted range 10–20**  
**Confidence: LOW** (highly contested methodology)  
**Share of p₀: ~8% (aging-adjusted)**

The widely-cited estimate that medical error is the "third leading cause of death" in the US (Martin Makary, 2016) suggested 250,000 deaths/year (~75/100k). This figure has been substantially contested. More conservative analyses using death certificate data suggest 50,000–100,000 deaths/year (15–30/100k), still material. The true number depends heavily on definitional questions about what constitutes "preventable" error vs. expected complication.

**Source:** Makary MA, Daniel M. *Medical error — the third leading cause of death in the US.* BMJ, 2016;353:i2139. DOI: 10.1136/bmj.i2139

**Source:** Shojania KG, Dixon-Woods M. *Estimating deaths due to medical error: the ongoing controversy and why it matters.* BMJ Quality & Safety, 2017;26(5):423–428. DOI: 10.1136/bmjqs-2016-006144

This model uses a conservative, aging-adjusted central estimate of 7.5/100k, recognizing that: (a) medical error is intrinsically tied to aging-related care (people receiving medical care for age-related conditions), so with aging solved, the relevant medical error rate is lower; (b) AI-assisted diagnosis and robotics will reduce this rate substantially over time.

### 3.6 Armed Conflict and War

**Rate: 0.5–2 per 100,000/year globally (0.0005–0.002%)**  
**Confidence: MEDIUM** (highly variable by country and period)  
**Share of p₀: ~0.5–2% for developed countries in peacetime**

For developed countries in peacetime, armed conflict mortality is de minimis (~0.1–0.5/100k). Globally, including active conflict zones, the rate is 1–10/100k during periods of elevated conflict. The 20th century's major wars caused temporary mortality spikes of enormous magnitude (World War II: ~10,000/100k in some countries).

**Source:** Roser M, Nagdy M, Ritchie H. *War and Peace.* Our World in Data, 2023. Available at: https://ourworldindata.org/war-and-peace

**Source:** UNODC. *Global Study on Homicide 2023.* UNODC, Vienna, 2023.

Conflict is explicitly modeled as not having a predictable downward trend — unlike accidents, which respond to safety technology, or infectious disease, which responds to medical advancement, conflict depends on geopolitical dynamics and adversarial human choices. AI could reduce conflict (better deterrence, conflict prediction) or increase it (autonomous weapons, information warfare). The model uses a constant rate for developed countries in baseline scenarios.

### 3.7 Other / Residual

**Rate: 1.9 per 100,000/year (0.0019%)**  
**Confidence: LOW**  
**Share of p₀: ~2%**

Residual category covering causes not clearly attributable to aging and not captured above: environmental exposures, occupational hazards, lightning strikes, natural disasters, acts of god. This is a modeling residual and the confidence in the precise figure is low.

---

## 4. Technological Improvement Rate (r)

### 4.1 What r Represents

r is the annual fractional improvement in background mortality from all non-aging causes combined, compounding over time. It represents the net effect of all concurrent technological advancement: safer vehicles, AI-accelerated drug development, improved trauma care, better infectious disease response, and safer workplaces.

r = 0 (static): Background mortality stays at current levels indefinitely.  
r = 0.005 (0.5%/yr): Background mortality halves every ~139 years.  
r = 0.01 (1%/yr): Background mortality halves every ~69 years.  
r = 0.02 (2%/yr): Background mortality halves every ~35 years.  
r = 0.05 (5%/yr): Background mortality halves every ~14 years.

### 4.2 Historical Calibration

**Infectious disease mortality reduction:** US infectious disease deaths fell from ~800/100k in 1900 to ~17/100k in 2019 — a 98% reduction over 119 years, or approximately 3.3%/year compounding. This is the strongest historical analog for aggressive concurrent advancement.

**Motor vehicle accident reduction:** US vehicle deaths per mile traveled fell ~97% from the 1920s to 2020, driven by seatbelts, airbags, road engineering, and drunk driving enforcement. Per capita death rates fell from ~24/100k in the 1960s to ~12/100k by the late 2010s — about 1–1.5%/year compounding over 50 years.

**Source:** National Safety Council. *Injury Facts: Historical Fatality Trends.* NSC, 2023. Available at: https://injuryfacts.nsc.org/motor-vehicle/historical-fatality-trends/

**Source:** National Highway Traffic Safety Administration (NHTSA). *Traffic Safety Facts: Overview of Motor Vehicle Crashes in 2021.* DOT HS 813 435, 2023. Available at: https://crashstats.nhtsa.dot.gov/

**Workplace safety:** Bureau of Labor Statistics data shows US fatal occupational injury rates declined from ~38/100k workers in 1970 to ~3.5/100k in 2021 — a 91% reduction over 51 years, or approximately 4.6%/year.

**Source:** Bureau of Labor Statistics. *National Census of Fatal Occupational Injuries in 2022.* BLS News Release, December 2023. Available at: https://www.bls.gov/iif/oshcfoi1.htm

**Recent US declines (2022–2025) as a short-run test of r.** The most recent US data supply an unusually clean demonstration that a multi-year r of several percent is achievable for specific causes when attention and money arrive together. Drug-overdose deaths fell 26.2% in 2024 and a further ~14% in 2025 [47][50]. The homicide rate fell roughly 18% in 2025, to about 4.1 per 100,000, the lowest recorded [51]. Traffic fatalities fell 6.7% in 2025 [49]. Compounded, those are annual improvement rates well above the century-long infectious-disease trend of ~3.3%/year, achieved inside four years.

Two cautions apply, and they matter for how much weight the aggressive scenario can carry. First, these are cause-specific declines from a 2020–2021 peak, so some fraction is reversion rather than progress; the same causes rose steeply between 2015 and 2021. Second, nothing in the mechanism prevents them from rising again — overdose mortality in particular has been driven by supply-side shifts in the illicit drug market that no safety technology controls. The model therefore reads these declines as an *existence proof* that r ≈ 0.02–0.05 is attainable for individual causes over a stretch of years, not as evidence that an aggregate r of that size is sustainable across decades.

### 4.3 Scenario Definitions

| Scenario | r | Rationale | Confidence |
|---|---|---|---|
| Static | 0.000 | Null hypothesis; no technological progress | N/A (anchor) |
| Moderate | 0.005 | Conservative: matches historical vehicle safety improvement rate | MEDIUM |
| Aggressive | 0.020 | AI-accelerated: matches 20th-century infectious disease reduction rate | LOW |
| LEV threshold | p₀/ln(2) ≈ 0.0013 | Minimum r for >50% survival asymptote | Computed |

### 4.4 AI-Accelerated Medicine

The COVID-19 mRNA vaccine compressed vaccine development from typical 10–15 year timelines to approximately 11 months from sequence publication to emergency use authorization (Moderna mRNA-1273 EUA: December 18, 2020; SARS-CoV-2 sequenced: January 10, 2020). This represents a roughly 10–15× acceleration for that specific technology.

Whether this acceleration generalizes to broad medical advancement is uncertain. AI-assisted drug discovery (AlphaFold for protein structure, generative models for molecular design) is showing substantial promise. DeepMind's AlphaFold 2 (2020) solved the protein folding problem that had resisted 50 years of effort; AlphaFold 3 (2024) extends this to RNA and DNA interactions. The significance of this line of work was recognized by the 2024 Nobel Prize in Chemistry, awarded to Demis Hassabis and John Jumper (AlphaFold) and David Baker (computational protein design).

**The superintelligence-enablement thesis.** The most aggressive version of the acceleration argument holds that sufficiently capable AI would not merely assist researchers but substitute for large amounts of the cognitive labor of biology itself. Anthropic CEO Dario Amodei, in *Machines of Loving Grace* (October 2024), argues that powerful AI could compress the biomedical progress of the next 50–100 years into 5–10 years — a "compressed 21st century" — and explicitly includes large lifespan extension among the plausible outcomes. This is the key mechanism by which the model's more optimistic improvement-rate (`r`) scenarios could be realized on a timescale that matters to people alive today.

**Capability trend as of September 2026.** The clearest quantitative measure of the underlying trend comes from METR, which benchmarks the length of task a frontier model can complete unassisted at a 50% success rate. Its January 2026 update finds that horizon has doubled roughly every seven months since 2019, and roughly every three to four months since 2024 [62]. Qualitative markers track it: in July 2025 an advanced version of Gemini with Deep Think reached gold-medal standard at the International Mathematical Olympiad, scoring 35 of 42 under competition conditions [63].

**The trend applied to biology.** Several 2025–2026 results move the acceleration argument from analogy to instance. Insilico Medicine's rentosertib is the first drug with both an AI-nominated target and an AI-generated molecule to publish positive Phase 2a results in a peer-reviewed journal (71 patients, *Nature Medicine*, June 2025) [60]; it entered Phase 3 in July 2026 [61]. Google DeepMind released an "AI co-scientist" multi-agent system for hypothesis generation in February 2025 [65] and AlphaGenome, a sequence-to-function model of regulatory genomics, in June 2025 [66]. FutureHouse's Robin, a multi-agent system running an end-to-end discovery loop, nominated ripasudil as a candidate for dry age-related macular degeneration [67]. Most directly relevant to Section 5.4, OpenAI and Retro Biosciences reported in January 2025 that a purpose-built model (GPT-4b micro) designed Yamanaka-factor variants producing more than 50-fold higher expression of reprogramming markers in vitro [68]. These results are early, mostly small, and largely unreplicated. They are nonetheless the specific mechanism by which the acceleration thesis would become true rather than remain rhetorical, and they did not exist when this document was first drafted.

**A timeline correction worth recording.** The forecasters most associated with rapid AI progress have themselves slowed down. In December 2025 the AI Futures Project — authors of *AI 2027* — updated their model and moved the median arrival of a "superhuman coder" from 2027–28 to approximately 2032; Daniel Kokotajlo's personal all-things-considered median is roughly 2030 for an automated coder and 2031 for a superhuman AI researcher [64]. This bears directly on the project's *Escape Velocity* scenario. As first written it ran on the earlier schedule; in September 2026 it was re-timed by three years to sit on the revised medians (research-grade agents in 2029–30, longevity escape velocity in 2039 rather than de Grey's even-odds 2036), with a bridging 2027–2028 chapter that describes the plateau the revision implies. The reason it is still worth working through is that the threshold it has to clear is low — longevity escape velocity in this model requires only r ≈ 0.13%/year (Section 1.4) — so a slower AI ramp moves the dates to the right without moving the conclusion.

**Caveat and confidence.** This thesis is contested and should be treated as **SPECULATIVE**. Critics note the "mechanistic fallacy" (understanding a biological mechanism does not reliably predict clinical outcomes) and that many rate-limiting steps in biology are physical rather than computational — cell culture, animal aging, and clinical trials run on wall-clock time that intelligence alone does not compress. The model does not assume this thesis is correct. It is included because even a fraction of the claimed acceleration would materially bend the background-mortality trajectory (`r`) that Section 4.3 parameterizes, and because it is the most-cited articulation of *why* the faster-improvement scenarios are worth modeling at all.

**Source:** Baden LR, et al. *Efficacy and Safety of the mRNA-1273 SARS-CoV-2 Vaccine.* New England Journal of Medicine, 2021;384:403–416. DOI: 10.1056/NEJMoa2035389

**Source:** Jumper J, et al. *Highly accurate protein structure prediction with AlphaFold.* Nature, 2021;596:583–589. DOI: 10.1038/s41586-021-03819-2

**Source:** Abramson J, et al. *Accurate structure prediction of biomolecular interactions with AlphaFold 3.* Nature, 2024;630:493–500. DOI: 10.1038/s41586-024-07487-w

**Source:** The Royal Swedish Academy of Sciences. *The Nobel Prize in Chemistry 2024.* NobelPrize.org, 2024. https://www.nobelprize.org/prizes/chemistry/2024/

**Source:** Amodei D. *Machines of Loving Grace: How AI Could Transform the World for the Better.* darioamodei.com, October 2024. https://darioamodei.com/essay/machines-of-loving-grace

**Source:** METR. *Measuring AI Ability to Complete Long Tasks: Time Horizon 1.1.* METR, January 29, 2026. https://metr.org/blog/2026-1-29-time-horizon-1-1/

**Source:** Google DeepMind. *Advanced version of Gemini with Deep Think officially achieves gold-medal standard at the International Mathematical Olympiad.* July 2025. https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/

**Source:** AI Futures Project. *AI Futures Model: December 2025 Update.* December 2025. https://blog.aifutures.org/p/ai-futures-model-dec-2025-update

**Source:** Insilico Medicine / Nature Medicine. *Rentosertib Phase IIa results.* Nature Medicine, June 3, 2025. https://www.nature.com/articles/s41591-025-03743-2

**Source:** Insilico Medicine. *Insilico Initiates Phase III Clinical Trial of Rentosertib.* July 2026. https://insilico.com/news/xmjsn4l091-insilico-initiates-phase-iii-clinical-tr

**Source:** Google DeepMind. *Accelerating scientific breakthroughs with an AI co-scientist.* February 2025. https://deepmind.google/blog/co-scientist-a-multi-agent-ai-partner-to-accelerate-research/

**Source:** Google DeepMind. *AlphaGenome: AI for better understanding the genome.* June 2025. https://deepmind.google/blog/alphagenome-ai-for-better-understanding-the-genome/

**Source:** FutureHouse. *Demonstrating end-to-end scientific discovery with Robin, a multi-agent system.* 2025. https://www.futurehouse.org/research-announcements/demonstrating-end-to-end-scientific-discovery-with-robin-a-multi-agent-system

**Source:** OpenAI. *Accelerating life sciences research with Retro Biosciences.* January 2025. https://openai.com/index/accelerating-life-sciences-research-with-retro-biosciences/

### 4.5 Autonomous Vehicle Impact

US autonomous vehicle (AV) adoption projections vary widely. The RAND Corporation's 2016 analysis suggested AV technology could save tens of thousands of lives annually once widely deployed. With ~13/100k motor vehicle deaths in the US, full AV adoption could theoretically reduce this to near-zero — a 13/100k reduction in p₀ (roughly 14% of total background mortality).

AV deployment timeline: major uncertainty. Full Level 5 autonomy in mixed traffic remains unsolved as of 2026. Optimistic projections suggest 30–50% of vehicle miles traveled will be autonomous by 2040.

**Source:** Kalra N, Paddock SM. *Driving to Safety: How Many Miles of Driving Would It Take to Demonstrate Autonomous Vehicle Reliability?* RAND Corporation, 2016. DOI: 10.7249/RR1478

---

## 5. Aging Scenarios

### 5.1 What "Solving Aging" Means

Biological aging refers to the progressive loss of physiological integrity across all organ systems over time, driven by molecular and cellular damage accumulation. It is the dominant cause of death in developed countries — approximately 90% of deaths in people over 65 are attributable primarily to aging-related processes.

Current aging theories:

**Hallmarks of Aging (López-Otín et al.):** The most widely-cited mechanistic framework identifies 9 (2013) / 12 (2023 revision) hallmarks of cellular aging, including genomic instability, telomere attrition, epigenetic alterations, loss of proteostasis, deregulated nutrient sensing, mitochondrial dysfunction, cellular senescence, stem cell exhaustion, altered intercellular communication, disabled macroautophagy, chronic inflammation, and dysbiosis.

**Source:** López-Otín C, et al. *The Hallmarks of Aging.* Cell, 2013;153(6):1194–1217. DOI: 10.1016/j.cell.2013.05.039

**Source:** López-Otín C, et al. *Hallmarks of aging: An expanding universe.* Cell, 2023;186(2):243–278. DOI: 10.1016/j.cell.2022.11.001

**Information Theory of Aging (Sinclair):** David Sinclair proposes that aging is primarily an information loss problem — specifically, loss of epigenetic information encoding cell identity. This implies reversibility via epigenetic reprogramming.

**Source:** Sinclair DA, LaPlante MD. *Lifespan: Why We Age — and Why We Don't Have To.* Atria Books, 2019. ISBN: 978-1501191978

**SENS Framework (de Grey):** Aubrey de Grey's Strategies for Engineered Negligible Senescence framework identifies 7 categories of aging damage (intracellular junk, extracellular junk, cell loss, intracellular mutations, mitochondrial mutations, cell excess, and extracellular crosslinks) and argues each can be periodically repaired, effectively halting net aging.

**Source:** de Grey ADNJ, Rae M. *Ending Aging: The Rejuvenation Breakthroughs That Could Reverse Human Aging in Our Lifetime.* St. Martin's Griffin, 2007. ISBN: 978-0312367077

### 5.2 Slowed Aging

**Definition:** Biological aging rate reduced by X% but not eliminated. Aging continues but more slowly, extending health-span and lifespan proportionally.

**Current interventions with evidence:**
- **Rapamycin/mTOR inhibition:** Consistent lifespan extension in mice (10–25% in multiple studies); first drug approved for human use showing anti-aging effects in a trial context (RTB101 + everolimus improved immune function in elderly). Human trials ongoing.
- **Metformin:** Observational evidence of reduced all-cause mortality in diabetics relative to controls. TAME (Targeting Aging with Metformin) trial ongoing.
- **Senolytics (dasatinib + quercetin):** Clear efficacy in clearing senescent cells in animals; human trials early-stage with mixed results.
- **NAD+ precursors (NMN, NR):** Modest human evidence for NAD+ level restoration; lifespan effects in humans unproven.
- **Caloric restriction:** Most robust lifespan extension intervention across species, including primates. Caloric restriction mimetics (resveratrol, rapamycin) have partial effects.

**Confidence: LOW–MEDIUM** (efficacy and magnitude uncertain; timeline to effective human therapies uncertain)

**Source:** Harrison DE, et al. *Rapamycin fed late in life extends lifespan in genetically heterogeneous mice.* Nature, 2009;460:392–395. DOI: 10.1038/nature08221

**Source:** Barzilai N, et al. *Metformin as a Tool to Target Aging.* Cell Metabolism, 2016;23(6):1060–1065. DOI: 10.1016/j.cmet.2016.05.011

**Source:** Justice JN, et al. *Senolytics in idiopathic pulmonary fibrosis: Results from a first-in-human, open-label, pilot study.* EBioMedicine, 2019;40:554–563. DOI: 10.1016/j.ebiom.2018.12.052

### 5.3 Halted Aging

**Definition:** Biological aging fully stops at a given biological age. The individual's cellular and physiological state is maintained indefinitely at that age, with periodic interventions as needed.

**Theoretical basis:** If all hallmarks of aging can be addressed — senescent cells cleared, epigenetic marks restored, telomeres maintained, proteostasis preserved — then net aging could theoretically be halted. This requires comprehensive, periodic therapeutic interventions and assumes no compensating mechanism reinitiate aging.

**Biological age for halting:** The model parameterizes this as a user-adjustable slider from biological age 20 to 60. Halting at age 25–30 preserves peak physiological function; halting at 50–60 preserves experience and (potentially) cognitive maturity but with some accumulated physiological decline.

**Confidence: SPECULATIVE** (no animal model has achieved true aging halting; the closest is caloric restriction with modest lifespan effects in primates).

### 5.4 Reversed Aging

**Definition:** Biological age is reset to a target and maintained there, reversing existing aging damage. In the context of this model, this is equivalent to halted aging once the reversal is complete, but with additional assumptions about the feasibility of reversing existing damage.

**Current evidence:** Epigenetic reprogramming using Yamanaka factors (Oct4, Sox2, Klf4, c-Myc — "OSKM") can reset the epigenetic clock in cells in vitro and, with partial expression, in animal tissues without inducing pluripotency (losing cell identity). The evidence has strengthened materially since the original 2016 demonstration:

- **Functional rejuvenation of tissue (2020):** Partial reprogramming with OSK (omitting the oncogene c-Myc) restored youthful DNA-methylation patterns and *reversed vision loss* in aged mice and in a glaucoma model — the first demonstration of functional, not just cosmetic, rejuvenation of a mammalian organ (Lu et al., *Nature* 2020).
- **Lifespan extension in already-aged mice (2024):** Systemic AAV-delivered inducible OSK given to 124-week-old mice (≈77 human years) increased *median remaining lifespan by 109%* versus controls, with age-reversal signatures in heart and liver by methylation clocks (Macip et al., *Cellular Reprogramming* 2024, from Rejuvenate Bio).

- **First human dosing (2026):** On 9 June 2026 Life Biosciences dosed the first human patient with a partial epigenetic reprogramming therapy. ER-100 delivers OSK to retinal ganglion cells in a single eye, expression controlled by oral doxycycline over an eight-week window; the Phase 1 (NCT07290244) enrolls up to 18 patients across four US sites — 12 with open-angle glaucoma and 6 with non-arteritic anterior ischemic optic neuropathy — with safety as the primary endpoint [52]. This is the first administration of partial reprogramming to a human being. Its significance should be stated carefully: it is a single-organ, single-eye, safety-first study with no efficacy claim and no systemic exposure, and it is not evidence of whole-body rejuvenation. What it establishes is that the regulatory, manufacturing and delivery path from mouse to person now exists at all, which as of 2024 it did not.

Several well-capitalized companies pursue this as a primary focus. Altos Labs launched in 2022 with roughly **$3 billion** in initial funding and, as of September 2026, has disclosed no clinical program. Retro Biosciences raised a **$1 billion** round in January 2025 [55]; NewLimit raised a **$130 million** Series B in May 2025 to push a liver-reprogramming medicine toward the clinic [56]. Calico (Alphabet-backed) continues. Adjacent AI-first drug discovery has drawn comparable capital: Isomorphic Labs raised $600 million in March 2025 and a $2.1 billion Series B in May 2026, with no candidate confirmed in human trials as of September 2026. Public money has also arrived, at a smaller scale: ARPA-H's PROSPR program committed $144 million over five years to seven teams in February 2026 [57], and the $101 million XPRIZE Healthspan awarded first-milestone prizes to 40 teams in May 2025 [58]. This scale of investment is a (weak) signal that serious actors judge the reversibility thesis worth large bets; it is not evidence that the thesis is correct.

**Regulatory precedent, from an unexpected direction.** In February 2025 the FDA's Center for Veterinary Medicine accepted the "reasonable expectation of effectiveness" section for Loyal's LOY-002, a daily pill intended to extend healthy lifespan in senior dogs — the first time a US regulator has accepted that a drug may reasonably be expected to extend lifespan [53]. The Target Animal Safety section was accepted in January 2026 [54]; expanded conditional approval remained pending on the chemistry, manufacturing and controls section as of September 2026, and the pivotal STAY study enrolled roughly 1,300 dogs. Dogs are not people and the veterinary pathway is not the human one. The precedent that matters is narrower and still real: lifespan extension has been accepted as a regulatory *claim*, which is the procedural obstacle Section 5.5 identifies as separable from the biology.

**Source:** Ocampo A, et al. *In Vivo Amelioration of Age-Associated Hallmarks by Partial Reprogramming.* Cell, 2016;167(7):1719–1733.e12. DOI: 10.1016/j.cell.2016.12.019

**Source:** Takahashi K, Yamanaka S. *Induction of Pluripotent Stem Cells from Mouse Embryonic and Adult Fibroblast Cultures by Defined Factors.* Cell, 2006;126(4):663–676. DOI: 10.1016/j.cell.2006.07.024

**Source:** Lu Y, et al. *Reprogramming to recover youthful epigenetic information and restore vision.* Nature, 2020;588:124–129. DOI: 10.1038/s41586-020-2975-4

**Source:** Macip CC, et al. *Gene Therapy-Mediated Partial Reprogramming Extends Lifespan and Reverses Age-Related Changes in Aged Mice.* Cellular Reprogramming, 2024;26(1):24–32. DOI: 10.1089/cell.2023.0072

**Source:** Life Biosciences. *Life Biosciences Announces First Patient Dosed in Phase 1 Trial of ER-100 for Optic Neuropathies.* June 2026. https://www.lifebiosciences.com/life-biosciences-announces-first-patient-dosed-in-phase-1-trial-of-er-100-for-optic-neuropathies/

**Source:** Loyal. *Loyal Receives Historic FDA Acceptance for Senior Dog Lifespan Extension Drug.* BusinessWire, February 26, 2025. https://www.businesswire.com/news/home/20250226676005/en/

**Source:** Loyal. *Loyal Receives FDA Acceptance of Safety Package for Senior Dog Lifespan Extension Drug.* BusinessWire, January 13, 2026. https://www.businesswire.com/news/home/20260113476778/en/Loyal-Receives-FDA-Acceptance-of-Safety-Package-for-Senior-Dog-Lifespan-Extension-Drug

**Confidence: SPECULATIVE** for full reversal in humans. The science is early-stage; human translation requires solving substantial safety (cancer risk from reprogramming factors) and delivery challenges.

### 5.5 Timeline Uncertainty

Any projection of when aging will be "solved" is speculative. A range of expert views:

- **Optimistic (de Grey):** First complete rejuvenation therapies within 15–25 years of adequate funding.
- **Moderate:** Meaningful aging deceleration for wealthy individuals within 10–20 years; broader access within 40–60 years; halted aging remains distant.
- **Pessimistic:** The biological complexity of aging may resist full therapeutic intervention indefinitely; incremental extensions in health-span but no categorical discontinuity.

**The demographic counter-argument.** The most substantive published rebuttal is Olshansky et al., *Implausibility of radical life extension in humans in the twenty-first century* (Nature Aging, October 2024) [59]. Examining the longest-lived national populations plus Hong Kong and the United States, the authors find that life-expectancy improvement has decelerated since 1990: the large gains of the twentieth century came from reducing early- and mid-life mortality, that source is largely exhausted, and continuing to subtract individual causes of death yields progressively less. Their conclusion is that radical life extension this century would require directly slowing biological aging, and that they consider this improbable within the century.

**How the model treats it.** The model does not contradict this finding; it is built on the same premise from the other side. Olshansky et al. describe what happens *without* an intervention on aging itself, which is precisely this model's null case — and their claim that only slowing biological aging would change the trajectory is this model's antecedent restated. The model therefore takes no position on the timeline. It computes the *counterfactual* of solved aging and derives the resulting lifespan distributions, leaving the "if" explicit rather than argued away. A reader who accepts Olshansky et al. in full should read every output in this document as a conditional. Section 5.6 is the only place where the plausibility of the antecedent is argued at all, and it argues only that the antecedent is live enough to be worth the arithmetic — not that it is likely.

**Source:** Olshansky SJ, Willcox BJ, Demetrius L, Beltrán-Sánchez H. *Implausibility of radical life extension in humans in the twenty-first century.* Nature Aging, 2024. https://www.nature.com/articles/s43587-024-00702-3

### 5.6 Feasibility Synthesis: Why "If" Is Worth the Arithmetic

This subsection consolidates the case (made in scattered form across Sections 4.4, 5.1, and 5.4) that "solving aging" is a plausible-enough premise to be worth modeling, rather than pure fantasy. It mirrors the public-facing summary on the project website. Two independent strands support it:

1. **Aging is increasingly an engineering target, not a fixed fact.** The hallmarks framework (López-Otín et al., 2013/2023) recast aging as ~12 specific, measurable, and in principle addressable mechanisms. Several are already reversible in animals: partial epigenetic reprogramming has restored a functional organ (vision) in aged mice (Lu et al., 2020) and extended the median remaining lifespan of already-old mice by ~109% (Macip et al., 2024); senolytics extend healthspan in mice and are in early human trials. Roughly $3B+ has flowed to companies pursuing reversal (Altos, Calico, Retro, NewLimit).

2. **AI may compress the timeline.** Structural biology problems that resisted decades of effort are now partly automated (AlphaFold; 2024 Nobel Prize in Chemistry), and the strongest form of the argument (Amodei, 2024) holds that powerful AI could compress 50–100 years of biomedical progress into 5–10.

**Status as of September 2026.** Both strands moved since this document's first draft, and not uniformly in the same direction. Strand 1 acquired its first human data point: on 9 June 2026 a person was dosed with a partial reprogramming therapy for the first time [52], and a US regulator accepted lifespan extension as a claim for the first time, in dogs [53][54]. Strand 2 acquired a measured trend line — frontier task horizons doubling every three to four months since 2024 [62] — and its first AI-designed drug in Phase 3 [61], but also a public deceleration, with the AI Futures Project moving its own median for automated AI research out to roughly 2032 [64]. Against both, Olshansky et al. (2024) is the strongest published argument that none of this will produce large twenty-first-century life-expectancy gains [59]. The net effect on this synthesis is small, and worth stating plainly: the antecedent is more *concrete* than it was in 2024 and no more *probable* on any timeline this document would defend. The case for computing the arithmetic is unchanged. The case for expecting the outcome is not stronger.

**Epistemic status.** Strand 1 is grounded animal evidence with genuine but unproven human translation (**SPECULATIVE** for full human application; safety and delivery remain unsolved). Strand 2 is a contested forecast (**SPECULATIVE**), vulnerable to the mechanistic fallacy and to biophysical bottlenecks that do not yield to intelligence alone. Crucially, the model does **not** assume either strand succeeds. It treats "aging solved" as a counterfactual and asks what follows. The purpose of this synthesis is only to establish that the counterfactual is worth the arithmetic — that "if" is a live enough possibility to justify computing its consequences — not to predict that it will occur.

---

## 6. Access and Democratization

### 6.1 Historical Technology Diffusion Patterns

Major medical interventions have consistently followed a pattern of elite access followed by gradual democratization over years to decades. The relevant question is how quickly a transformative anti-aging therapy would diffuse across wealth quintiles.

**Historical precedents:**

| Technology | Initial cost / availability | Broad access timeline | Notes |
|---|---|---|---|
| Open-heart surgery | Wealthy hospitals, 1950s | 20–30 years | Now standard in any major hospital |
| MRI imaging | $2M+ machines, 1980s | 10–15 years | Now ubiquitous in developed countries |
| Statins (lovastatin) | $3/pill at launch (1987) | 5–10 years to generic | Generic lovastatin now < $0.10/pill |
| CAR-T cell therapy | $350,000–$500,000 (2017–2023) | Still limited; 5–10 years to broader access expected | Kymriah, Yescarta; manufacturing scale challenge |
| mRNA vaccines | Emergency use, high-income countries (2020–2021) | Low-income countries: 1–2 years delayed | Supply constraints, not just price |

**Source:** Bach PB. *Limits on Medicare's Ability to Control Rising Spending on Cancer Drugs.* New England Journal of Medicine, 2009;360(6):626–633. DOI: 10.1056/NEJMhpr0807774

**Source:** Tisagenlecleucel (Kymriah) FDA approval: FDA News Release, August 30, 2017. Available at: https://www.fda.gov/news-events/press-announcements/fda-approval-brings-first-gene-therapy-united-states

**A live case: GLP-1 receptor agonists.** The clearest contemporary test of the diffusion assumption is the GLP-1 class, because it is happening now and the dates are unambiguous. The WHO added semaglutide and tirzepatide to its Essential Medicines List on 5 September 2025 [71]. Generic semaglutide launched in India in March 2026 at roughly $14 per month, followed by Canada in April 2026 and Brazil in May 2026, while US and EU patents run into the 2030s [72]. The interval between first high-income launch (2017–2021, depending on indication) and low-cost generic availability in middle-income markets is therefore on the order of 5–8 years. That sits inside the range this model's access-delay parameters assume for the faster quintiles, and it is considerably faster than the CAR-T precedent — but it also shows the mechanism plainly: the lag is set by patent geography, not by manufacturing capacity or by need.

**Access is not monotone.** The delay parameters in Section 6.2 implicitly assume that access, once gained, is kept. That assumption has a recent counterexample. The January 2025 freeze of PEPFAR funding disrupted HIV treatment and prevention for millions of people who were already receiving it [73]. Diffusion in this document is modelled as a one-way curve; in practice funding decisions, patent litigation and politics can each push access backwards, and the model carries no parameter for reversal. This is a known limitation, and it biases the access-gap estimates in Section 6.3 optimistically.

**Source:** International Diabetes Federation. *WHO adds GLP-1 therapies and rapid-acting insulins to Essential Medicines List.* September 5, 2025. https://idf.org/news/who-adds-glp-1-therapies-and-rapid-acting-insulins-to-essential-medicines-list/

**Source:** Chemistry World. *India's generic GLP-1 drugs are mostly booming.* 2026. https://www.chemistryworld.com/news/indias-generic-glp-1-drugs-are-mostly-booming/4023975.article

**Source:** International AIDS Society. *Data revealing impact of PEPFAR disruptions and advances in long-acting HIV prevention and treatment ahead of AIDS 2026.* IAS, 2026. https://www.iasociety.org/news-release/data-revealing-impact-pepfar-disruptions-and-advances-long-acting-hiv-prevention-and-treatment-ahead-of-aids-2026

### 6.2 Access Delay Model

The model parameterizes access stratification as a time delay: how many years after a therapy's first availability does each wealth quintile gain access?

**Default assumptions:**

| Quintile | Description | Access delay |
|---|---|---|
| Q5 (top 20%) | Wealthy; can access emerging therapies directly | 0 years (immediate) |
| Q4 | Upper-middle; insurance or savings to access | 5–10 years |
| Q3 | Middle; depends on insurance coverage mandates | 15–20 years |
| Q2 | Lower-middle; public healthcare or charity programs | 25–35 years |
| Q1 (bottom 20%) | Reliant on full government provision | 40–60 years |

**Confidence: LOW–SPECULATIVE.** These delays are calibrated to CAR-T and gene therapy precedents, but a truly transformative anti-aging therapy would likely face unprecedented political pressure for universal access — and unprecedented political resistance based on cost.

### 6.3 Implications of the Access Gap

At a 60-year maximum access delay (Q1 vs. Q5), with p₀ = 0.001 and r = 0.01:

- Q5 (immediate access): S(∞) ≈ 90.5% survive indefinitely
- Q1 (60-year delay): Effective p₀ during the delay period remains at current aging-inclusive rates (~1.2%/year); survival through the delay period is S(60) ≈ e^(−0.012·60) ≈ 48.7%; only those who survive the delay then benefit from the solved-aging regime

This is a qualitatively different form of inequality from current income-health gaps. Current life expectancy gaps between the richest and poorest quintiles in the US are approximately 10–14 years (Chetty et al., 2016).

Two more recent measurements make the pre-existing baseline larger than the Chetty figure alone suggests, and both are widening rather than narrowing. Dwyer-Lindgren et al.'s "Ten Americas" analysis (*The Lancet*, November 2024) finds the life-expectancy gap between the highest- and lowest-ranked of ten US population groups grew from 12.6 years in 2000 to 20.4 years in 2021 [69]. Case and Deaton (*American Journal of Epidemiology*, 2025) find the gap in adult life expectancy at age 25 between those with and without a bachelor's degree grew from 2.6 years in 1992 to 8.5 years in 2021 [70]. The relevant point for this model is not the size of any one figure but the direction: the gaps a rejuvenation therapy would arrive into are opening on their own, before any new technology is distributed unevenly on top of them.

Under solved aging with unequal access, those years become centuries.

**Source:** Chetty R, et al. *The Association Between Income and Life Expectancy in the United States, 2001–2014.* JAMA, 2016;315(16):1750–1766. DOI: 10.1001/jama.2016.4226

**Source:** Dwyer-Lindgren L, et al. *Ten Americas: a systematic analysis of life expectancy disparities in the USA.* The Lancet, November 2024. https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)01495-8/fulltext

**Source:** Case A, Deaton A. *Life expectancy by education in the United States.* American Journal of Epidemiology, 2025;194(8):2281. https://academic.oup.com/aje/article/194/8/2281/7848226

---

## 7. Risk Profile Archetypes

Five archetypes are defined by mortality multipliers applied to the baseline p₀. Multipliers are calibrated to empirical data on occupation, geography, and lifestyle risk.

| Archetype | Mortality multiplier | Effective p₀ (at baseline 0.0009) | Description |
|---|---|---|---|
| Ultra-low risk | 0.3× | 0.00027 | Wealthy, sedentary, safe country (Japan/Iceland), excellent healthcare. Implied expected lifespan ~3,700 years. |
| Low risk | 0.6× | 0.00054 | Professional class, developed country (UK/Germany), standard safety practices. |
| Moderate risk | 1.0× | 0.0009 | US average resident. |
| Elevated risk | 2.5× | 0.00225 | Manual/dangerous occupation (construction, mining, agriculture), moderate-risk geography, limited healthcare access. |
| Extreme risk | 8.0× | 0.0072 | Active combat, extreme sports (BASE jumping, motorcycle racing), high-crime area, conflict zone. Implied expected lifespan ~140 years. |

**Sources for multiplier calibration:**

**Occupational hazards:** The US fatal occupational injury rate for the most dangerous industries (logging: ~85/100k/yr; fishing: ~76/100k/yr; roofing: ~52/100k/yr) is 20–25× the national average of ~3.5/100k/yr for all workers. Combining with non-occupational risks, the overall mortality multiplier for high-risk occupations is approximately 2–4×.

**Source:** Bureau of Labor Statistics. *National Census of Fatal Occupational Injuries in 2022.* BLS, December 2023.

**Extreme sports:** BASE jumping estimated fatality rate: approximately 1 death per 500–2,300 jumps. For active participants making 100+ jumps/year, annual mortality rates of 0.04–0.2% are plausible — a 40–200× multiplier on the non-sports population rate for that specific activity. In the extreme archetype, the multiplier of 8× reflects a composite of dangerous activities plus high-risk geography.

**Source:** Monasterio E, Mulder R, Frampton C, Mei-Dan O. *Personality characteristics of BASE jumpers.* Journal of Applied Sport Psychology, 2012;24(4):391–400. DOI: 10.1080/10413200.2012.665589

---

## 8. Behavioral and Psychological Effects

### 8.1 Risk Compensation (Peltzman Effect)

Risk compensation refers to the empirical observation that people adjust their behavior in response to perceived changes in risk — taking greater risks when they feel safer, and lesser risks when they feel more exposed. Named after economist Sam Peltzman's 1975 analysis of seatbelt mandates.

**Evidence:** Peltzman (1975) found that mandatory seatbelt laws did not reduce highway fatalities as much as engineers predicted, because drivers compensated by driving faster and more recklessly. Bicycle helmet studies have found mixed results, with some showing increased risk-taking by helmeted cyclists.

**Source:** Peltzman S. *The Effects of Automobile Safety Regulation.* Journal of Political Economy, 1975;83(4):677–725.

**Source:** Adams J. *Risk.* University College London Press, 1995. ISBN: 978-1857280487

**Relevance to this model:** If aging is solved, does the value of life change in ways that affect risk tolerance? Arguments in both directions:

- *More risk-averse:* Higher value of future life increases the stakes of any risky action; insurance and incentive structures reprice risk upward.
- *Less risk-averse:* Long life may create boredom, risk-seeking as novelty, or psychological distance from mortality; extreme sports may become more popular.

The model explicitly does not assume a direction. The risk profile scenarios allow users to explore both possibilities.

### 8.2 Suicide at Long Timescales

Suicide is behaviorally distinct from accidental mortality in a critical way: it is an internally motivated act. Any model of very long lifespans must grapple honestly with the question of whether individuals sustain a will to live across centuries.

**Current evidence:** 
- Global suicide rate: ~10/100k (WHO 2023). US rate: ~14/100k.
- Suicide rates are highest in adults aged 45–64 and 75+, suggesting complex relationships with life stage and health.
- Rates vary dramatically across countries — from ~3/100k (Syria, Caribbean nations) to ~35+/100k (Lithuania, Russia, South Korea in peak years).
- Rates have been declining in many high-income countries since the 1990s, attributable to SSRIs and means restriction.

**Source:** World Health Organization. *Suicide worldwide in 2019: Global Health Estimates.* WHO, Geneva, 2021. Available at: https://www.who.int/publications/i/item/9789240026643

**Relevant philosophical literature:** Bernard Williams's essay "The Makropulos Case: Reflections on the Tedium of Immortality" (in *Problems of the Self*, 1973) argues that indefinitely extended life would eventually become meaningless — that categorical desires that give life its structure require a finite horizon. Williams argues that a person who lived 300 years would either have experienced so much change as to be a fundamentally different person, or would have become rigidly attached to early commitments in a way that makes continued existence merely repetitive.

**Source:** Williams B. *The Makropulos Case: Reflections on the Tedium of Immortality.* In: *Problems of the Self.* Cambridge University Press, 1973. ISBN: 978-0521290609

This model does not attempt to project whether suicide rates increase or decrease at multi-century timescales. It treats the current empirical rate as the central estimate and explicitly flags this as the highest-uncertainty behavioral variable.

---

## 9. Known Unknowns and Open Questions

The following are the most consequential areas of genuine uncertainty in this model. Unlike the parameters above, these are not estimated with confidence intervals — they represent genuinely open questions where the analytical framework breaks down or where evidence is too thin to support a directional claim.

### 9.1 Mental Health Trajectory Over Centuries

How does psychological wellbeing evolve over lifespans of 200–1,000 years? Current psychology has no data on this. Candidate hypotheses:

- Psychological adaptation: humans are remarkably adaptable; hedonic baseline returns after major life events (Brickman, Coates, and Janoff-Bulman, 1978 on the hedonic treadmill)
- Cognitive/emotional exhaustion: the accumulation of losses, traumas, and regrets over centuries may compound in ways that create structural psychological suffering
- Meaning restructuring: humans may develop novel frameworks for meaning-making that don't exist yet, as they have historically adapted to major existential challenges

**Source:** Brickman P, Coates D, Janoff-Bulman R. *Lottery Winners and Accident Victims: Is Happiness Relative?* Journal of Personality and Social Psychology, 1978;36(8):917–927.

### 9.2 Violence at AI Timescales

AI systems create both defensive and offensive capabilities for violence at scale. Offensive capabilities (autonomous weapons, AI-designed pathogens, precision cyberattacks on infrastructure) could dramatically increase mass casualty potential. Defensive capabilities (real-time threat detection, de-escalation AI, autonomous defense systems) may or may not keep pace. The net effect on per-capita violence rates is deeply uncertain.

### 9.3 Risk Behavior Under Solved Aging

Do people become more or less risk-averse when aging is solved? Economic theory predicts greater risk aversion as the value of remaining life increases. Behavioral evidence suggests risk-taking is strongly influenced by peer norms and social context rather than pure expected-value calculations. No empirical data exists for this scenario.

### 9.4 Population and Resource Dynamics

Even if birth rates continue declining (current trends in all developed countries), near-zero death rates create population growth from accumulated living generations. The societal implications — resource consumption, housing, political representation, generational wealth concentration — are outside the scope of this actuarial model but directly relevant to policy analysis of a post-aging world.

**The demographic backdrop the 2030s inherit.** Two US figures set the starting conditions for any scenario in which rejuvenation arrives in the next decade. The total fertility rate was 1.60 births per woman in 2024, well below the ~2.1 replacement level and near a record low [75]. The Social Security Administration's 2026 Trustees Report projects that Old-Age and Survivors Insurance trust fund reserves will be depleted in the fourth quarter of 2032, after which continuing income would cover roughly three-quarters of scheduled benefits [74]. Both trends are conventionally read as a problem of too few workers supporting too many retirees. Solved aging cuts across that framing in a way the usual projections do not model: a population that stops aging also stops retiring, which relieves the dependency arithmetic while making the accumulated-population problem sharper. The model computes neither, and this is flagged as a known unknown rather than resolved.

### 9.5 The Compounding Advantage of Long Survival

An underappreciated asymmetry: those who survive long enough benefit from all technological advancement accumulated over their lifetimes. A person alive in 2026 who survives to 2200 has benefited from 174 years of medical, safety, and cognitive technology advancement — making each subsequent year incrementally safer. This creates a compounding advantage for early survivors: the people who navigate the highest-risk early period disproportionately benefit from later improvements.

---

## 10. Bibliography

Listed in order of appearance. All URLs verified as of May 2026; entries [46]–[75] added and verified September 2026.

[1] Centers for Disease Control and Prevention, National Center for Health Statistics. *National Vital Statistics Reports, Deaths: Final Data for 2021.* Vol. 72, No. 7, November 2023. https://www.cdc.gov/nchs/data/nvsr/nvsr72/nvsr72-07.pdf

[2] Heron M. *Deaths: Leading Causes for 2021.* NVSR Vol. 72, No. 5. CDC/NCHS, October 2023. https://www.cdc.gov/nchs/data/nvsr/nvsr72/nvsr72-05.pdf

[3] World Health Organization. *Global Health Observatory: Cause-Specific Mortality.* WHO, 2024. https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates

[4] Ritchie H, Roser M. *Causes of Death.* Our World in Data, 2023. https://ourworldindata.org/causes-of-death

[5] Kochanek KD, et al. *Mortality in the United States, 2022.* NCHS Data Brief No. 492. CDC/NCHS, December 2023.

[6] CDC. *WISQARS Web-based Injury Statistics Query and Reporting System.* https://wisqars.cdc.gov/

[7] Ritchie H, Roser M. *Suicide.* Our World in Data, 2023. https://ourworldindata.org/suicide

[8] FBI. *Crime in the United States: Uniform Crime Reports 2022.* Federal Bureau of Investigation, 2023.

[9] United Nations Office on Drugs and Crime. *Global Study on Homicide 2023.* UNODC, Vienna, 2023. https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html

[10] Pinker S. *The Better Angels of Our Nature: Why Violence Has Declined.* Viking Books, 2011.

[11] Roser M. *Homicides.* Our World in Data, 2023. https://ourworldindata.org/homicides

[12] Woolf SH, et al. *Excess Deaths from COVID-19 and Other Causes in the US, March 2020–January 2021.* JAMA, 2021;325(17):1786–1789. DOI: 10.1001/jama.2021.5199

[13] GBD 2019 Diseases and Injuries Collaborators. *Global burden of 369 diseases and injuries in 204 countries and territories, 1990–2019.* The Lancet, 2020;396(10258):1204–1222. DOI: 10.1016/S0140-6736(20)30925-9

[14] Taubenberger JK, Morens DM. *1918 Influenza: the Mother of All Pandemics.* Emerging Infectious Diseases, 2006;12(1):15–22. DOI: 10.3201/eid1201.050979

[15] Makary MA, Daniel M. *Medical error — the third leading cause of death in the US.* BMJ, 2016;353:i2139. DOI: 10.1136/bmj.i2139

[16] Shojania KG, Dixon-Woods M. *Estimating deaths due to medical error: the ongoing controversy and why it matters.* BMJ Quality & Safety, 2017;26(5):423–428. DOI: 10.1136/bmjqs-2016-006144

[17] Roser M, Nagdy M, Ritchie H. *War and Peace.* Our World in Data, 2023. https://ourworldindata.org/war-and-peace

[18] National Safety Council. *Injury Facts: Historical Fatality Trends.* NSC, 2023. https://injuryfacts.nsc.org/motor-vehicle/historical-fatality-trends/

[19] National Highway Traffic Safety Administration. *Traffic Safety Facts: Overview of Motor Vehicle Crashes in 2021.* DOT HS 813 435, 2023. https://crashstats.nhtsa.dot.gov/

[20] Bureau of Labor Statistics. *National Census of Fatal Occupational Injuries in 2022.* BLS, December 2023. https://www.bls.gov/iif/oshcfoi1.htm

[21] Kalra N, Paddock SM. *Driving to Safety: How Many Miles of Driving Would It Take to Demonstrate Autonomous Vehicle Reliability?* RAND Corporation, 2016. DOI: 10.7249/RR1478

[22] López-Otín C, et al. *The Hallmarks of Aging.* Cell, 2013;153(6):1194–1217. DOI: 10.1016/j.cell.2013.05.039

[23] López-Otín C, et al. *Hallmarks of aging: An expanding universe.* Cell, 2023;186(2):243–278. DOI: 10.1016/j.cell.2022.11.001

[24] Sinclair DA, LaPlante MD. *Lifespan: Why We Age — and Why We Don't Have To.* Atria Books, 2019.

[25] de Grey ADNJ, Rae M. *Ending Aging.* St. Martin's Griffin, 2007.

[26] Harrison DE, et al. *Rapamycin fed late in life extends lifespan in genetically heterogeneous mice.* Nature, 2009;460:392–395. DOI: 10.1038/nature08221

[27] Barzilai N, et al. *Metformin as a Tool to Target Aging.* Cell Metabolism, 2016;23(6):1060–1065. DOI: 10.1016/j.cmet.2016.05.011

[28] Justice JN, et al. *Senolytics in idiopathic pulmonary fibrosis: Results from a first-in-human, open-label, pilot study.* EBioMedicine, 2019;40:554–563. DOI: 10.1016/j.ebiom.2018.12.052

[29] Ocampo A, et al. *In Vivo Amelioration of Age-Associated Hallmarks by Partial Reprogramming.* Cell, 2016;167(7):1719–1733.e12. DOI: 10.1016/j.cell.2016.12.019

[30] Takahashi K, Yamanaka S. *Induction of Pluripotent Stem Cells from Mouse Embryonic and Adult Fibroblast Cultures by Defined Factors.* Cell, 2006;126(4):663–676. DOI: 10.1016/j.cell.2006.07.024

[31] Baden LR, et al. *Efficacy and Safety of the mRNA-1273 SARS-CoV-2 Vaccine.* New England Journal of Medicine, 2021;384:403–416. DOI: 10.1056/NEJMoa2035389

[32] Jumper J, et al. *Highly accurate protein structure prediction with AlphaFold.* Nature, 2021;596:583–589. DOI: 10.1038/s41586-021-03819-2

[33] Abramson J, et al. *Accurate structure prediction of biomolecular interactions with AlphaFold 3.* Nature, 2024;630:493–500. DOI: 10.1038/s41586-024-07487-w

[34] Bach PB. *Limits on Medicare's Ability to Control Rising Spending on Cancer Drugs.* New England Journal of Medicine, 2009;360(6):626–633. DOI: 10.1056/NEJMhpr0807774

[35] Chetty R, et al. *The Association Between Income and Life Expectancy in the United States, 2001–2014.* JAMA, 2016;315(16):1750–1766. DOI: 10.1001/jama.2016.4226

[36] Peltzman S. *The Effects of Automobile Safety Regulation.* Journal of Political Economy, 1975;83(4):677–725.

[37] Adams J. *Risk.* University College London Press, 1995.

[38] World Health Organization. *Suicide worldwide in 2019: Global Health Estimates.* WHO, Geneva, 2021. https://www.who.int/publications/i/item/9789240026643

[39] Williams B. *The Makropulos Case: Reflections on the Tedium of Immortality.* In: *Problems of the Self.* Cambridge University Press, 1973.

[40] Brickman P, Coates D, Janoff-Bulman R. *Lottery Winners and Accident Victims: Is Happiness Relative?* Journal of Personality and Social Psychology, 1978;36(8):917–927.

[41] Monasterio E, et al. *Personality characteristics of BASE jumpers.* Journal of Applied Sport Psychology, 2012;24(4):391–400. DOI: 10.1080/10413200.2012.665589

[42] Lu Y, et al. *Reprogramming to recover youthful epigenetic information and restore vision.* Nature, 2020;588:124–129. DOI: 10.1038/s41586-020-2975-4

[43] Macip CC, et al. *Gene Therapy-Mediated Partial Reprogramming Extends Lifespan and Reverses Age-Related Changes in Aged Mice.* Cellular Reprogramming, 2024;26(1):24–32. DOI: 10.1089/cell.2023.0072

[44] The Royal Swedish Academy of Sciences. *The Nobel Prize in Chemistry 2024 (Hassabis, Jumper, Baker).* NobelPrize.org, 2024. https://www.nobelprize.org/prizes/chemistry/2024/

[45] Amodei D. *Machines of Loving Grace: How AI Could Transform the World for the Better.* darioamodei.com, October 2024. https://darioamodei.com/essay/machines-of-loving-grace

[46] Xu J, Murphy SL, Kochanek KD, Arias E. *Mortality in the United States, 2024.* NCHS Data Brief No. 548. CDC/NCHS, January 2026. https://www.cdc.gov/nchs/products/databriefs/db548.htm

[47] Xu J, et al. *Drug Overdose Deaths in the United States, 2023–2024.* NCHS Data Brief No. 549. CDC/NCHS, January 2026. https://www.cdc.gov/nchs/products/databriefs/db549.htm

[48] Centers for Disease Control and Prevention, National Center for Health Statistics. *FastStats: Homicide* (NVSS via CDC WONDER, 2024 data). https://www.cdc.gov/nchs/fastats/homicide.htm

[49] National Highway Traffic Safety Administration. *NHTSA Estimates 39,345 Traffic Fatalities in 2024* and *Traffic Deaths for 2025: Early Estimates for the 2024 Annual Report.* NHTSA, 2026. https://www.nhtsa.gov/press-releases/nhtsa-estimates-39345-traffic-fatalities-2024 ; https://www.nhtsa.gov/press-releases/traffic-deaths-2025-early-estimates-2024-annual

[50] Centers for Disease Control and Prevention, National Center for Health Statistics. *Provisional Drug Overdose Death Counts, 2025.* CDC/NCHS Press Release, May 13, 2026. https://www.cdc.gov/nchs/pressroom/releases/20260513.html

[51] Federal Bureau of Investigation. *FBI Releases 2025 Reported Crimes in the Nation Statistics.* FBI, August 2026. https://www.fbi.gov/news/press-releases/fbi-releases-2025-reported-crimes-in-the-nation-statistics
[52] Life Biosciences. *Life Biosciences Announces First Patient Dosed in Phase 1 Trial of ER-100 for Optic Neuropathies.* Company news release, June 2026. (Phase 1, NCT07290244.) https://www.lifebiosciences.com/life-biosciences-announces-first-patient-dosed-in-phase-1-trial-of-er-100-for-optic-neuropathies/

[53] Loyal (Cellular Longevity, Inc.). *Loyal Receives Historic FDA Acceptance for Senior Dog Lifespan Extension Drug (LOY-002 reasonable expectation of effectiveness).* BusinessWire, February 26, 2025. https://www.businesswire.com/news/home/20250226676005/en/

[54] Loyal (Cellular Longevity, Inc.). *Loyal Receives FDA Acceptance of Safety Package for Senior Dog Lifespan Extension Drug.* BusinessWire, January 13, 2026. https://www.businesswire.com/news/home/20260113476778/en/Loyal-Receives-FDA-Acceptance-of-Safety-Package-for-Senior-Dog-Lifespan-Extension-Drug

[55] Wiggers K. *Retro Biosciences, backed by Sam Altman, is raising $1 billion to extend human lifespan.* TechCrunch, January 24, 2025. https://techcrunch.com/2025/01/24/retro-biosciences-backed-by-sam-altman-is-raising-1-billion-to-extend-human-lifespan/

[56] Fierce Biotech. *Anti-aging biotech NewLimit raises $130M to push liver reprogramming med to clinic.* May 2025. https://www.fiercebiotech.com/biotech/anti-aging-biotech-newlimit-raises-130m-push-liver-reprogramming-med-clinic

[57] Advanced Research Projects Agency for Health (ARPA-H). *Research teams to add more healthy years to Americans' lives as they age (PROSPR: seven teams, $144M over five years).* ARPA-H, February 2026. https://arpa-h.gov/news-and-events/research-teams-add-more-healthy-years-americans-lives-they-age

[58] XPRIZE Foundation. *$101M XPRIZE Healthspan awards first milestone winners, driving toward revolutionary healthy aging advances.* XPRIZE, May 2025. https://www.xprize.org/news/101m-xprize-healthspan-awards-first-milestone-winners-driving-toward-revolutionary-healthy-aging-advances

[59] Olshansky SJ, Willcox BJ, Demetrius L, Beltrán-Sánchez H. *Implausibility of radical life extension in humans in the twenty-first century.* Nature Aging, October 2024. https://www.nature.com/articles/s43587-024-00702-3

[60] Insilico Medicine. *Rentosertib Phase IIa trial in idiopathic pulmonary fibrosis (71 patients).* Nature Medicine, June 3, 2025. https://www.nature.com/articles/s41591-025-03743-2

[61] Insilico Medicine. *Insilico Initiates Phase III Clinical Trial of Rentosertib.* Company news release, July 2026. https://insilico.com/news/xmjsn4l091-insilico-initiates-phase-iii-clinical-tr

[62] METR. *Measuring AI Ability to Complete Long Tasks: Time Horizon 1.1.* METR, January 29, 2026. https://metr.org/blog/2026-1-29-time-horizon-1-1/

[63] Google DeepMind. *Advanced version of Gemini with Deep Think officially achieves gold-medal standard at the International Mathematical Olympiad.* July 2025. https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/

[64] AI Futures Project (Kokotajlo D, et al.). *AI Futures Model: December 2025 Update.* December 2025. https://blog.aifutures.org/p/ai-futures-model-dec-2025-update

[65] Google DeepMind. *Accelerating scientific breakthroughs with an AI co-scientist.* February 2025. https://deepmind.google/blog/co-scientist-a-multi-agent-ai-partner-to-accelerate-research/

[66] Google DeepMind. *AlphaGenome: AI for better understanding the genome.* June 2025. https://deepmind.google/blog/alphagenome-ai-for-better-understanding-the-genome/

[67] FutureHouse. *Demonstrating end-to-end scientific discovery with Robin, a multi-agent system.* FutureHouse research announcement, 2025. https://www.futurehouse.org/research-announcements/demonstrating-end-to-end-scientific-discovery-with-robin-a-multi-agent-system

[68] OpenAI. *Accelerating life sciences research with Retro Biosciences (GPT-4b micro; engineered Yamanaka-factor variants with >50-fold higher reprogramming-marker expression in vitro).* January 2025. https://openai.com/index/accelerating-life-sciences-research-with-retro-biosciences/

[69] Dwyer-Lindgren L, et al. *Ten Americas: a systematic analysis of life expectancy disparities in the USA.* The Lancet, November 2024. https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)01495-8/fulltext

[70] Case A, Deaton A. *Life expectancy by education in the United States.* American Journal of Epidemiology, 2025;194(8):2281. https://academic.oup.com/aje/article/194/8/2281/7848226

[71] International Diabetes Federation. *WHO adds GLP-1 therapies and rapid-acting insulins to Essential Medicines List.* September 5, 2025. https://idf.org/news/who-adds-glp-1-therapies-and-rapid-acting-insulins-to-essential-medicines-list/

[72] Chemistry World. *India's generic GLP-1 drugs are mostly booming.* Royal Society of Chemistry, 2026. https://www.chemistryworld.com/news/indias-generic-glp-1-drugs-are-mostly-booming/4023975.article

[73] International AIDS Society. *Data revealing impact of PEPFAR disruptions and advances in long-acting HIV prevention and treatment ahead of AIDS 2026.* IAS, 2026. https://www.iasociety.org/news-release/data-revealing-impact-pepfar-disruptions-and-advances-long-acting-hiv-prevention-and-treatment-ahead-of-aids-2026

[74] Social Security Administration, Board of Trustees. *2026 Annual Report of the Board of Trustees of the OASI and DI Trust Funds — Highlights (OASI reserve depletion projected Q4 2032).* SSA, 2026. https://www.ssa.gov/oact/TR/2026/II_A_highlights.html

[75] Centers for Disease Control and Prevention, National Center for Health Statistics. *Births: Provisional/Final Data — US total fertility rate 1.60 in 2024.* NCHS Data Brief No. 535. https://www.cdc.gov/nchs/products/databriefs/db535.htm

---

## 11. Changelog

### September 2026 update (v1.1)

- **Mortality baseline rebased from CDC NVSS 2021 to CDC NVSS 2024 final data.** p₀ moved from 0.00095 to 0.0009 (Section 2.1), and every derived figure was recomputed: mean lifespan ~1,050 → ~1,100 years, median ~729 → ~770 years, LEV threshold r ≈ 0.00137 → ≈0.0013 (0.13%/yr).
- **Mortality-by-cause decomposition (Section 3) rebuilt on 2024 final data**, now summing to exactly 90/100,000: Accidents 47.5 → 45.0 (overdose 23.1 + motor vehicle ~11.6 + non-aging falls ~6 + other ~4.3), Suicide 14.1 → 13.7, Homicide 7.8 → 5.9, Infectious Disease unchanged at 15.0 (COVID-19 now ~9/100k and falling), Medical Error unchanged at 7.5, Armed Conflict unchanged at 1.0, Other/Residual 2.1 → 1.9.
- **Added a 2021 → 2024 shift narrative** (Section 2.1) documenting the drivers: a 26.2% one-year drop in overdose deaths, homicide falling from 8.2 to 5.9 per 100,000, and US life expectancy rising from 76.4 to 79.0 years — plus a note that provisional 2025 data (overdose ~70k, traffic ~36.6k, murder rate 4.1/100k) point toward a still-lower baseline (~85/100,000), meaning p₀ = 0.0009 is conservative-high if anything.
- **Six new bibliography entries** ([46]–[51]) for NCHS Data Brief 548 (Mortality in the United States, 2024), NCHS Data Brief 549 (Drug Overdose Deaths, 2023–2024), CDC FastStats Homicide (2024), NHTSA's 2024 final and 2025 early-estimate traffic-fatality releases, CDC's May 2026 provisional overdose release, and the FBI's August 2026 2025 crime report.
- **Escape Velocity's opening beat rebased from a 2025 snapshot to an observed 2025–2026 record.** It now covers rentosertib's *Nature Medicine* Phase 2a (June 2025) and Phase 3 initiation (July 2026), Loyal's two FDA acceptances, Gemini's IMO gold medal, the METR task-horizon trend, the 2025–26 frontier model releases and compute deals, and the Retro/NewLimit/Isomorphic funding round. The second beat moved to "Late 2026" so it reads as near-future forecast rather than as the present (superseded by the re-timing below: it now sits in 2029).
- **Corrected a factual error: ER-100's first human dosing was 9 June 2026, not 2025.** The scenario previously placed it in 2025. The correct account — OSK in retinal ganglion cells of one eye, doxycycline-controlled over eight weeks, Phase 1 NCT07290244, up to 18 patients across four US sites — now appears in Section 5.4, in the scenario's opening beat, and in the main page's feasibility block, with a regression test that fails if any beat re-dates it to 2025.
- **AI-timeline framing rewritten against the AI Futures Project's December 2025 revision** (median superhuman coder moved from 2027–28 to ~2032; Kokotajlo's personal median ~2030). Section 4.4 records the revision and what it implies for the site's scenario, which was subsequently re-timed to sit on those medians (see the next bullet). Section 4.4 also adds the METR task-horizon trend, IMO 2025, the AI co-scientist, AlphaGenome, FutureHouse's Robin, and the GPT-4b micro reprogramming result.
- **Access and inequality evidence broadened beyond Chetty 2016.** Section 6.3 adds the Lancet "Ten Americas" gap (12.6 years in 2000 to 20.4 in 2021) and Case & Deaton's education gap (2.6 to 8.5 years); Section 6.1 adds the GLP-1 essential-medicines and generics timeline as a live 5–8 year rich-to-poor diffusion case, and the January 2025 PEPFAR freeze as evidence that access can reverse — a direction the model has no parameter for. Both are reflected on the site in Sections 04 and 07.
- **Scenario re-timed +3 years to the AI Futures Project's December 2025 medians.** Agent-1 now arrives in 2029 and Agent-2 in 2030; every later chapter, the dashboard series, the price and access paths and every character age move with it. A bridging 2027–2028 chapter ("The slow years") was added for the plateau the revision implies. The longevity-escape-velocity year moves from 2036 (de Grey's even-odds date, now noted as three years early in this telling) to 2039, and the story's end year from 2045 to 2048.
- **Counter-evidence given standing.** Section 5.5 now states the Olshansky et al. (Nature Aging 2024) demographic argument against radical twenty-first-century life extension and explains how the model treats it: as the null case, with the "if" left explicit. Section 5.6 carries a September 2026 status paragraph reaching the same conclusion — the antecedent is more concrete than in 2024 and no more probable.
- **Historical calibration extended to the 2022–2025 US declines** (overdose −26.2% in 2024 and ~−14% in 2025, homicide −18% in 2025 to ~4.1/100k, traffic −6.7% in 2025) in Section 4.2, as an existence proof that cause-specific multi-year r of several percent is attainable, with reversion risk noted explicitly.
- **Twenty-four new bibliography entries ([52]–[75])**, bringing the total to 75: Life Biosciences ER-100, Loyal (2025 and 2026 acceptances), Retro, NewLimit, ARPA-H PROSPR, XPRIZE Healthspan, Olshansky 2024, Insilico (Phase 2a and Phase 3), METR, DeepMind (IMO, co-scientist, AlphaGenome), FutureHouse Robin, OpenAI/Retro GPT-4b micro, AI Futures December 2025, Dwyer-Lindgren 2024, Case & Deaton 2025, WHO EML and GLP-1 generics, PEPFAR, the SSA 2026 Trustees Report, and NCHS fertility.
