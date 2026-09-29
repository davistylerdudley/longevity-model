'use client';

import { useMemo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { SurvivalCurveChart } from '../charts/SurvivalCurveChart';
import { Reveal } from '../ui/Reveal';
import { useModel } from '../../hooks/useModelState';
import { generateSurvivalCurve, survivalAsymptote, levThresholdR, agingBackground } from '../../lib/actuarialMath';
import { ADVANCEMENT_COLORS, ADVANCEMENT_LABELS, ADVANCEMENT_R_VALUES } from '../../lib/constants';

export function S3_ConcurrentAdvancement() {
  const { params, dispatch } = useModel();
  const effectiveP0 = agingBackground(params);
  const rLev = levThresholdR(effectiveP0);
  const selected = params.advancementScenario;

  const curves = useMemo(
    () =>
      (['static', 'moderate', 'aggressive', 'lev'] as const).map((scenario) => {
        const r = scenario === 'lev' ? rLev : ADVANCEMENT_R_VALUES[scenario];
        const isSelected = scenario === selected;
        return {
          data: generateSurvivalCurve(effectiveP0, r),
          color: ADVANCEMENT_COLORS[scenario],
          label: ADVANCEMENT_LABELS[scenario],
          asymptote: survivalAsymptote(effectiveP0, r),
          dashed: scenario === 'lev',
          opacity: isSelected ? 1 : 0.28,
          strokeWidth: isSelected ? 3.5 : 1.5,
        };
      }),
    [effectiveP0, rLev, selected],
  );
  const levAsymptote = survivalAsymptote(effectiveP0, rLev);

  return (
    <SectionWrapper
      id="concurrent-advancement"
      number="03"
      title="Now let the world keep improving"
      subtitle="Section 02 froze today’s risks in place. That is the pessimistic case. Here is what happens when they keep falling, the way they actually have."
    >
      <div className="space-y-10">
        <Reveal>
          <div className="card-muted p-7 max-w-2xl">
            <p className="text-[15px] text-zinc-800 leading-relaxed">
              Cars in the 1950s killed people at several times today&apos;s rate per mile. Then seatbelts,
              airbags, better roads, and soon cars that brake on their own. The same trip got safer every
              decade. Imagine that steady improvement across every cause of death at once. Something
              surprising happens to the curve: <strong>it stops falling to zero.</strong>
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10">
          <Reveal className="space-y-4 text-[15px] text-zinc-700 leading-relaxed">
            <p>
              This is not wishful thinking. US deaths from infectious disease fell <strong>98%</strong> between
              1900 and 2019. Road deaths per mile fell 97% since the 1920s. Workplace deaths fell 91% since 1970.
            </p>
            <p>
              When background risk keeps shrinking at some yearly rate{' '}
              <code className="font-mono text-[13px] bg-zinc-100 px-1.5 py-0.5 rounded">r</code>, the survival
              line levels off at a floor above zero. Everyone above that floor never dies of anything: the risks
              run out before their luck does. Pick a scenario and watch which curve lifts.
            </p>
            <div className="rounded-2xl bg-zinc-950 text-zinc-100 p-5 font-mono text-xs leading-relaxed">
              <div className="text-zinc-500 uppercase tracking-wider text-[10px] mb-2">time-varying survival</div>
              <div>p(t) = p₀ · e<sup>−r·t</sup></div>
              <div>S(t) = exp(−p₀/r · (1 − e<sup>−r·t</sup>))</div>
              <div className="mt-3 text-zinc-500 uppercase tracking-wider text-[10px]">the floor</div>
              <div>S(∞) = exp(−p₀/r)</div>
            </div>
          </Reveal>

          <Reveal delay={80} className="space-y-3">
            <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500">Four rates of progress</h4>
            {(['static', 'moderate', 'aggressive', 'lev'] as const).map((scenario) => {
              const r = scenario === 'lev' ? rLev : ADVANCEMENT_R_VALUES[scenario];
              const asymptote = survivalAsymptote(effectiveP0, r);
              const isSelected = scenario === selected;
              return (
                <button
                  key={scenario}
                  onClick={() => dispatch({ type: 'SET_ADVANCEMENT_SCENARIO', value: scenario })}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    isSelected ? 'border-accent bg-accent-soft/50 shadow-sm' : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-medium" style={{ color: ADVANCEMENT_COLORS[scenario] }}>{ADVANCEMENT_LABELS[scenario]}</span>
                    <span className="font-mono text-xs text-zinc-600 tnum">{(asymptote * 100).toFixed(0)}% never die</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {scenario === 'static' && 'The frozen world. No further improvement.'}
                    {scenario === 'moderate' && 'r = 0.5%/yr, about the pace of car-safety gains.'}
                    {scenario === 'aggressive' && 'r = 2%/yr, the pace of 20th-century disease control.'}
                    {scenario === 'lev' && `r = ${(rLev * 100).toFixed(3)}%/yr, just enough for half to make it.`}
                  </p>
                </button>
              );
            })}
          </Reveal>
        </div>

        <Reveal>
          <div className="card p-4 sm:p-5">
            <SurvivalCurveChart curves={curves} showAsymptote tMax={300} />
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-7">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-emerald-700 mb-2">The tipping point has a name</p>
            <p className="font-display text-2xl text-emerald-950 mb-3">Longevity escape velocity</p>
            <p className="text-[15px] text-emerald-900 leading-relaxed max-w-2xl">
              Aubrey de Grey&apos;s term for the moment life expectancy grows faster than time passes. In this
              model it is simply the improvement rate at which the floor crosses 50%, so more than half of
              people never die of any cause. For a US resident that is only about{' '}
              <strong className="font-mono tnum">{(rLev * 100).toFixed(2)}%</strong> a year, slower than the
              car-safety gains of the last century.
            </p>
            <div className="mt-5 grid sm:grid-cols-3 gap-5 text-sm">
              <div><p className="text-xs text-emerald-700 mb-1">Rate needed</p><p className="font-mono text-emerald-950 font-semibold tnum">{(rLev * 100).toFixed(3)}%/yr</p></div>
              <div><p className="text-xs text-emerald-700 mb-1">Share who make it</p><p className="font-mono text-emerald-950 font-semibold tnum">{(levAsymptote * 100).toFixed(1)}%</p></div>
              <div><p className="text-xs text-emerald-700 mb-1">For comparison</p><p className="text-emerald-900 text-xs leading-snug">Vehicle safety improved ~1–1.5%/yr historically.</p></div>
            </div>
          </div>
        </Reveal>

        <p className="text-xs text-zinc-500 leading-relaxed">
          Sources: National Safety Council, <em>Injury Facts 2023</em>; Bureau of Labor Statistics (workplace fatalities);
          de Grey ADNJ, Rae M. <em>Ending Aging.</em> 2007.
        </p>
      </div>
    </SectionWrapper>
  );
}
