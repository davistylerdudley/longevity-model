---
name: project-longevity-model
description: Human Longevity Projection Model — Next.js site + Escape Velocity scenario at ~/longevity-model; live on Vercel; architecture, key modeling decisions, how to test/deploy/QA.
metadata:
  type: project
---

**What:** "If aging were solved, how long would you live?" — an interactive, sourced actuarial model (main page) plus *Escape Velocity*, an AI-2027-style scrollytelling scenario (2025–2045) with recurring characters and a live dashboard. Built Aug–Sep 2026; major Fable redesign shipped 2026-09-02.

**Where:** `~/longevity-model/` → `website/` (Next 16, static export), `research/longevity-assumptions.md` (v1.1 Sept 2026, 75 refs, confidence-rated, §11 changelog), `excel/`. Live: https://website-three-theta-67.vercel.app (scenario at `/escape-velocity`). Deploy: `cd website && npx vercel --prod --yes </dev/null` (stdin redirect avoids a hang). Tests: `npm test` (vitest, 52 tests: math invariants, story selection, scenario integrity, constants).

**Key modeling decisions (don't re-litigate):**
- p₀ = 0.0009 (90/100k) is the headline since the Sept 2026 refresh (rebased from CDC NVSS 2021 → 2024 final: overdose −26%, homicide 8.2→5.9, LE 79.0); components 45.0/13.7/5.9/15.0/7.5/1.0/1.9 sum to exactly 90 (a test enforces it). Headline numbers: mean ~1,100y, median ~770y; LEV at r = p₀/ln2 ≈ 0.13%/yr; scenario SERIES untouched, floor still first crosses 50% in 2036. 2025 provisional data point to ~85/100k, so 0.0009 is conservative-high.
- Scenario is paced to the AI Futures Project's Dec 2025 medians (superhuman coder ~2032, Kokotajlo ~2030): on 2026-09-06 Davis had it re-timed +3 years (Agent-1 2029, Agent-2 2030, LEV 2036→2039, END_YEAR 2048, 18 beats incl. a bridging 2027–28 'slow' chapter). de Grey's 2036 is now cited as 'three years early'. Tests pin LEV_YEAR/END_YEAR, period↔year, and character ages. Davis's stance: shift timing, keep content. Observed opening beat now covers 2025–mid-2026; ER-100 first human dosing was 9 June 2026 (an earlier draft wrongly said 2025 — a test now guards it).
- Refresh procedure that worked (Sept 2026): 5 parallel scouts (repo claim inventory + mortality/biology/AI/demography web sweeps), verify load-bearing numbers against primary CDC/NHTSA/FBI pages myself, then one build for the number cascade and one for content, then review.
- Section 02 is pinned to the static "frozen world" (so it matches Section 01); progress turns on in 03.
- Personal model = Gompertz–Makeham pre-treatment aging (age + launch year matter) then halted aging; the "risk" slider means everyday exposure (job/driving/neighborhood), not thrill-seeking.
- Aging-scenario controls genuinely move the curve via `agingBackground()` (slowed adds residual hazard; held age adds frailty).

**Design system:** Instrument Serif display + Inter + JetBrains Mono; `.card/.card-muted/.card-dark`; `Reveal` scroll fade (visible by default, armed client-side, scroll+timer fallbacks — never mutate `<html>` class, it caused a hydration mismatch). `SiteNav` has scrollspy + progress bar.

**QA gotcha:** the desktop app's Browser pane is often hidden → screenshots/scroll time out and IntersectionObserver won't fire. Use gstack headless `~/.claude/skills/gstack/browse/dist/browse` (`viewport`, `goto`, `js`, `screenshot --viewport`) for real visuals. See [[feedback-longevity-site-writing]].
