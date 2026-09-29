# Human Longevity Projection Model

**If biological aging were solved, how long would people actually live?**

Not forever. The honest answer, worked out from real mortality data, is stranger and more specific: centuries for most, a real
chance of never dying for some, and a gap between people measured in lifetimes rather than years. This repository is the
research, the spreadsheet, and the public website that make that case.

Live site: **https://website-three-theta-67.vercel.app** · Scenario: **/escape-velocity**

## What is here

| Directory | Contents |
| --- | --- |
| `research/` | `longevity-assumptions.md` — every assumption in the model with sources and confidence ratings (51 references). |
| `excel/` | `generate_workbook.py` → `longevity_model.xlsx`, an 8-sheet workbook with live formulas and charts mirroring the site's math. |
| `website/` | The Next.js site: interactive model, personalization, closing vignettes, and the *Escape Velocity* scenario. See `website/README.md`. |

## The model in three lines

```
S(t)  = exp(−p₀·t)                       frozen world: mean 1/p₀ ≈ 1,100 y, median ln2/p₀ ≈ 770 y
S(t)  = exp(−p₀/r · (1 − e^(−r·t)))      background mortality falling at rate r
S(∞)  = exp(−p₀/r)                       the floor: share who never die of anything; 50% at r = p₀/ln 2
```

## Epistemic stance

The model is a bounding analysis and a scenario tool, not a prediction. Measured inputs (today's death rates) are kept clearly
apart from extrapolations (future improvement rates, access timelines) and from speculation (behaviour over centuries). The
scenario page is a forecast written as fiction: its 2025 beat is documented and cited; everything after is tagged as forecast or
open question.
