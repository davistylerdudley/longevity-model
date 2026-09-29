# Chat context — the conversation that produced this project

Reconstructed from the working sessions (Aug–Sept 2026) between Davis Tyler-Dudley and Claude (Fable 5.1) in Claude Code. Quotes are the user's own instructions; the rest summarises what was done and why. Intended so another model can reproduce both the artifact and the decision process.

## Session 1 — the ask
Build a **Human Longevity Projection Model**: a research document with sourced, confidence-rated assumptions; an Excel workbook; and a Next.js website that lets a reader put their own life into the model and ends with a story. Core question: "If aging were solved, how long would you live?" Core math: exponential lifespan at the non-aging background rate; time-varying rate gives a survival floor; longevity escape velocity when the floor crosses 50%. Deployed to Vercel.

## Session 2 — QA and structural fixes (user messages in order)
1. "run a quality check and UI/UX check across everything real quick and then bring back flags of things to change for me – let me review them and decide if we want to fix them before rolling out those changes tho"
   → A numbered list of flags was returned.
2. "fix all except 11. but also before that we need to structure some of this based on like the person's age when they input it and the year the treatment first becomes available as those are important variables we're not really considering in the current calculations"
   → Added age and treatment-year inputs; built the two-phase personal model (Gompertz–Makeham aging until the therapy reaches you, then halted aging).
3. "a bunch of the axes don't have clearly marked labels on them, especially the Y-axis for some of these graphs. Can we make sure that they're all clear? Also, some of the formatting is kinda fucky for some of the x-axis state labeling. Let's fix that."
4. "next up we also want to add a paragraph at the start in the intro section that's providing well-cited evidence for how the scenarios we're discussing could realistically happen, especially when we consider enablement via superintelligence" → "yeah do it" (fold sources into the research doc).
5. "minor nit – for the upfront 'how much risk does your life involve' slider isnt it actually more important how their health and city safety and job safety and such are than 'thrill seekingness'…" → slider reframed as everyday exposure.
6. "-sounds good on last changes / -02 graphs dont work right / -lets make the vignettes at the end longer and have more speculative info… a little menu thing… representative names swapped in (…NYC… Uttar Pradesh…) / -lets make it a little more visually interesting… add in some simple but cool animations and a minimalist background graphic to the upfront section"
7. "this is good but the vignettes are too vague, make them more illustrative and imaginative and concrete"

## Session 3 — the redesign
"Redo this with Fable make it more beautiful and creative from a front-end standpoint. do a QA check once done. Also rewrite content to cut down on wordiness (except for the AI 2027 inspired portion – for that, it needs to actually have the amount of info and the narrative aspect increased (remember this is a narrative! not just a listing of facts and considerations! it must be compelling and written as a narrative – go check out ai 2027 for direct inspiration), increase intelligibility / comprehensibility throughout. think thoughtfully the mission… The marginal cost of completeness is near zero with AI. Do the whole thing. Do it right. Do it with tests. Do it with documentation… Never offer to 'table this for later'… Never present a workaround when the real fix exists… Boil the ocean."

→ New design system; copy cut; Escape Velocity expanded from 9 beats to 17 chapters with a recurring cast; vitest suite; docs. A safeguard interruption mid-write truncated a file ("yo what the fuck why did this trigger fable 5.1 safeguards" → "lets try again"); the file was salvaged and completed. Vercel token expired → device login ("wait sorry try this again" → fresh code → "Okay, approved."). Deployed and verified.

## Session 4 — the September 2026 update (5–6 Sept)
"Do a September 2025 update check to go through and see if there's additional research or information or things that change, and adjust how we should lay this out. Then cascade factual changes as needed across all content, primarily looking at the longevity-related stuff, but also, of course, looking at the AI portion of the equation."

Interpreted as "bring everything current as of now." Method: five parallel research scouts (repo claim inventory; US mortality; longevity biology; AI progress/timelines; demography/inequality/diffusion); every load-bearing number re-verified against primary sources; one build for the number cascade, one for content; a review pass; deploy.

Result reported to the user: mortality rebased to CDC 2024 (p₀ 0.00095 → 0.0009; headline 1,050/729 → ~1,100/~770 years); a false 2025 ER-100 dosing claim corrected to 9 June 2026; the observed opening chapter rebuilt; feasibility paragraph and access evidence refreshed; research doc to v1.1 with 75 references. Three things flagged: (1) the scenario was not re-dated to the slower AI median, only labelled a fast branch; (2) a pre-existing cohort wobble was patched with a phrase; (3) unverifiable claims were left out.

User reply: "1) for the scenario dates, shift it accordingly (most of the actual content shouldnt change right? just the timing for the most part?) 2) see prev 3) sounds good"

→ Scenario shifted +3 years (Agent-1 2029, LEV 2039, end 2048), a bridging 2027–2028 chapter added, the cohort continuity fixed properly, framing changed to "paced to the Dec 2025 medians". 52 tests, deployed, verified live.

## Session 5 (12 Sept) — this bundle
"make me a zip file with all of our stuff from this: all the contents of what we've been working on, as well as all the context of this chat. That way, I can take this over, put it in a GPT-6 Astra session, and have it create that, the same exact thing. I don't need all the code necessarily, just all of the content… a description of how everything is laid out, how it all works, all of that, all the changes we've made. I want to just test how it creates it and what the comparative is."

## Standing preferences learned
- Cut wordiness; raise comprehensibility; no AI tells.
- Real, verified citations only.
- Narrative sections must read as fiction with continuity and concrete specifics.
- Optimistic but grounded tone.
- Finish completely: tests, docs, QA, deploy; report outcomes faithfully.
- Present findings and flags first when asked for a check; act when told.
