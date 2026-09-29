'use client';

import { useMemo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { StratificationChart } from '../charts/StratificationChart';
import { Slider } from '../ui/Slider';
import { Reveal } from '../ui/Reveal';
import { useModel } from '../../hooks/useModelState';
import { computeStratification, computePersonalScenario } from '../../lib/actuarialMath';
import { QUINTILE_COLORS } from '../../lib/constants';

export function S4_Stratification() {
  const { params, dispatch, profile, hasProfile } = useModel();
  const stratResults = useMemo(() => computeStratification(params), [params]);
  const personal = useMemo(
    () => (hasProfile ? computePersonalScenario(profile, params.advancementScenario) : null),
    [hasProfile, profile, params.advancementScenario],
  );
  const personalName = profile.name.trim() || 'You';

  const q5 = stratResults.find((r) => r.quintile === 5);
  const q1 = stratResults.find((r) => r.quintile === 1);
  const medianGap =
    q5 && q1 && isFinite(q5.medianLifespan) && isFinite(q1.medianLifespan)
      ? Math.round(q5.medianLifespan - q1.medianLifespan)
      : null;
  const floorGap = q5 && q1 ? Math.round((q5.asymptote - q1.asymptote) * 100) : null;

  return (
    <SectionWrapper
      id="stratification"
      number="04"
      title="Who gets it, and when"
      tone="muted"
      subtitle="No treatment arrives everywhere at once. The gap between first in line and last is where this stops being a math problem and becomes a human one."
    >
      <div className="space-y-10">
        <Reveal>
          <div className="card-muted bg-white p-7 max-w-2xl">
            <p className="text-[15px] text-zinc-800 leading-relaxed">
              Two people, same age, same year the therapy is invented. One affords it on day one. The other
              waits fifty years for the price to fall. Under normal aging, a fifty-year wait costs fifty
              years near the end, when the body is already failing. Under solved aging, that same wait is
              fifty years spent <strong>at your physical peak, still exposed to the old risks</strong>. Same
              delay, completely different price.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10">
          <Reveal className="space-y-4 text-[15px] text-zinc-700 leading-relaxed">
            <p>
              Every big medical advance has spread the same way: wealthy early adopters first, then a slow
              trickle down over years or decades. CAR-T cancer therapy, approved in 2017, still costs
              $350,000 to $500,000. MRI took 10 to 15 years to reach the general public.
            </p>
            <p>
              The live example is GLP-1. The WHO added semaglutide to its Essential Medicines List in
              September 2025 and generics launched in India in March 2026 at roughly $14 a month, while US
              and EU patents run into the 2030s. That is a 5-to-8-year rich-to-poor lag on a drug everyone
              already wants, and it is the delay this model assumes. Access can also run backwards: the 2025
              PEPFAR funding freeze interrupted HIV treatment for millions.
            </p>
            <p>
              The model treats access as a delay: how many years after launch each income group gets in.
              Slide it and watch the gap open. It does not open by years. It opens by centuries.
            </p>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
              <p className="text-xs text-amber-700 font-medium mb-1">At this setting</p>
              {medianGap !== null ? (
                <>
                  <p className="font-mono text-3xl text-amber-950 tnum">{medianGap.toLocaleString()} years</p>
                  <p className="text-xs text-amber-800 mt-1">Median-lifespan gap, top vs bottom income group. Today it is about 12 years by income (Chetty et al., JAMA 2016), 20.4 years across the ten major US population groups (Lancet 2024), and 8.5 years between adults with and without a BA (Case &amp; Deaton 2025).</p>
                </>
              ) : (
                <>
                  <p className="font-mono text-3xl text-amber-950 tnum">{floorGap} points</p>
                  <p className="text-xs text-amber-800 mt-1">
                    Gap in the chance of never dying: top group {q5 ? (q5.asymptote * 100).toFixed(0) : '–'}% vs bottom{' '}
                    {q1 ? (q1.asymptote * 100).toFixed(0) : '–'}%. With progress on, the top group&apos;s median is unbounded, so the gap is not in years but in whether you die at all.
                  </p>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={80} className="space-y-6">
            <Slider
              label="Max access delay (bottom group)"
              value={params.maxAccessDelayYears}
              min={5}
              max={80}
              step={5}
              unit="y"
              onChange={(v) => dispatch({ type: 'SET_MAX_ACCESS_DELAY', value: v })}
            />
            <div className="card overflow-hidden">
              <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-200/70 text-[11px] tracking-wider uppercase text-zinc-500">
                Chance of never dying, by income group
              </div>
              {stratResults.map((r, i) => {
                const isYou = personal && personal.wealthQuintile === r.quintile;
                return (
                  <div key={r.quintile} className={`flex items-center gap-3 px-5 py-2.5 text-sm border-b border-zinc-100 last:border-0 ${isYou ? 'bg-you-soft/50' : ''}`}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: QUINTILE_COLORS[4 - i] }} />
                    <span className="flex-1 text-zinc-700">
                      {r.label}
                      {isYou && <span className="ml-2 text-xs font-semibold text-you">← {personalName}</span>}
                    </span>
                    <span className="font-mono text-zinc-900 tnum">{(r.asymptote * 100).toFixed(1)}%</span>
                    <span className="text-xs text-zinc-500 w-20 text-right tnum">{r.accessDelayYears === 0 ? 'day one' : `+${Math.round(r.accessDelayYears)}y`}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Confidence: low. Delays are anchored to CAR-T and gene-therapy precedents. Real timelines would hinge on
              politics as much as price. <span className="italic">Sources: Bach PB, NEJM 2009; Chetty R et al. JAMA 2016; Dwyer-Lindgren L et al., Lancet 2024; Case A &amp; Deaton A, Am J Epidemiol 2025; WHO Essential Medicines List 2025.</span>
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="card p-4 sm:p-5">
            <StratificationChart results={[...stratResults].reverse()} tMax={200} />
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
