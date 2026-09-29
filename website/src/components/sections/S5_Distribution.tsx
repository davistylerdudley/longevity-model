'use client';

import { useMemo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { DistributionChart } from '../charts/DistributionChart';
import { Reveal } from '../ui/Reveal';
import { useModel } from '../../hooks/useModelState';
import { SUICIDE_RATE_PER_YEAR } from '../../lib/constants';
import { computeScenario, agingBackground, advancementToR, computePersonalScenario } from '../../lib/actuarialMath';

function Row({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
      <span className="text-sm text-zinc-600">{label}</span>
      <span className={`font-mono text-sm tnum ${accent ? 'text-you font-semibold' : 'text-zinc-900'}`}>{(value * 100).toFixed(1)}%</span>
    </div>
  );
}
function DualRow({ label, avg, you }: { label: string; avg: number; you: number }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
      <span className="text-sm text-zinc-600">{label}</span>
      <span className="flex gap-6 font-mono text-sm tnum">
        <span className="text-zinc-500 w-14 text-right">{(avg * 100).toFixed(1)}%</span>
        <span className="text-you font-semibold w-14 text-right">{(you * 100).toFixed(1)}%</span>
      </span>
    </div>
  );
}

export function S5_Distribution() {
  const { params, profile, hasProfile } = useModel();
  const result = useMemo(() => computeScenario(params), [params]);
  const personal = useMemo(
    () => (hasProfile ? computePersonalScenario(profile, params.advancementScenario) : null),
    [hasProfile, profile, params.advancementScenario],
  );
  const personalName = profile.name.trim() || 'You';
  const effectiveP0 = agingBackground(params);
  const r = advancementToR(params.advancementScenario, effectiveP0);

  const suicideRate = SUICIDE_RATE_PER_YEAR; // 13.7 per 100k per year (CDC NVSS 2024 final)
  const suicideBy = (years: number) => 1 - Math.exp(-suicideRate * years);

  return (
    <SectionWrapper
      id="distribution"
      number="05"
      title="The average hides the story"
      subtitle="A thousand-year average sounds clean. Almost nobody lives an average life. Who dies when is where it gets interesting, and uncomfortable."
    >
      <div className="space-y-10">
        <Reveal>
          <div className="card-muted p-7 max-w-2xl">
            <p className="text-[15px] text-zinc-800 leading-relaxed">
              A thousand people step into this world together, all 30, aging switched off. A century later
              about a hundred are gone, lost to the same accidents and illnesses that take people today.
              The other nine hundred have barely aged. A few thousand years on, a handful are still walking
              around, having outlived empires. That whole spread hides behind the word &ldquo;average.&rdquo;
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10">
          <Reveal className="space-y-4 text-[15px] text-zinc-700 leading-relaxed">
            <p>
              The chart below shows the chance of dying at each age. The area under any stretch is the odds
              of dying in that window. Note the long tail to the right: a small slice runs for thousands of years.
            </p>
            {result.asymptote > 0.01 && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
                <p className="text-xs text-blue-700 font-medium mb-1">At the current settings</p>
                <p className="font-mono text-3xl text-blue-950 tnum">{(result.asymptote * 100).toFixed(1)}%</p>
                <p className="text-sm text-blue-900 mt-1">of people never die of any cause. Their line never reaches zero.</p>
              </div>
            )}
          </Reveal>

          <Reveal delay={80} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-zinc-900">Chance of dying before…</h4>
              {personal && <span className="text-xs font-semibold text-you">{personalName}</span>}
            </div>
            {personal ? (
              <>
                <div className="flex items-center justify-between py-1.5 text-[11px] tracking-wider uppercase text-zinc-500 border-b border-zinc-100">
                  <span>Horizon</span>
                  <span className="flex gap-6"><span className="w-14 text-right">Avg</span><span className="w-14 text-right text-you">{personalName}</span></span>
                </div>
                <DualRow label="Year 100" avg={result.probDeadBefore.y100} you={personal.probDeadBefore.y100} />
                <DualRow label="Year 500" avg={result.probDeadBefore.y500} you={personal.probDeadBefore.y500} />
                <DualRow label="Year 1,000" avg={result.probDeadBefore.y1000} you={personal.probDeadBefore.y1000} />
              </>
            ) : (
              <>
                <Row label="Year 100" value={result.probDeadBefore.y100} />
                <Row label="Year 500" value={result.probDeadBefore.y500} />
                <Row label="Year 1,000" value={result.probDeadBefore.y1000} />
                <Row label="Year 2,000" value={result.probDeadBefore.y2000} />
              </>
            )}

            <div className="mt-6 pt-5 border-t border-zinc-100">
              <h4 className="text-sm font-semibold text-zinc-900">
                Slow risks add up <span className="ml-1 text-xs font-normal text-zinc-500">suicide, US rate 13.7/100k/yr</span>
              </h4>
              <p className="text-xs text-zinc-500 mt-1 mb-2 leading-relaxed">
                A risk that is tiny in one year is large across a thousand. That is arithmetic, not a claim about anyone&apos;s mind.
              </p>
              <Row label="By year 100" value={suicideBy(100)} />
              <Row label="By year 500" value={suicideBy(500)} />
              <Row label="By year 1,000" value={suicideBy(1000)} />
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Whether that rate holds over such spans is unknown; Section 06 treats it as open.{' '}
                <span className="italic">CDC NVSS 2024; WHO 2021.</span>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="card p-4 sm:p-5">
            <DistributionChart
              p0={effectiveP0}
              r={r}
              tMax={300}
              markerT={personal ? personal.medianLifespan : undefined}
              markerLabel={personal ? `${personalName}: median` : undefined}
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {Object.entries(result.percentiles).map(([k, v]) => (
              <div key={k} className="card-muted p-3">
                <p className="text-zinc-500">{k.replace('p', '')}th pct</p>
                <p className="font-mono text-zinc-900 mt-1 text-sm font-semibold tnum">{isFinite(v) ? `${Math.round(v).toLocaleString()}y` : '∞'}</p>
                <p className="text-zinc-500 mt-0.5">{isFinite(v) ? `${100 - parseInt(k.replace('p', ''))}% outlive` : 'never dies'}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
