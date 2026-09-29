'use client';

import { useMemo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { SurvivalCurveChart } from '../charts/SurvivalCurveChart';
import { MortalityDecompositionChart } from '../charts/MortalityDecompositionChart';
import { Slider } from '../ui/Slider';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { Reveal } from '../ui/Reveal';
import { useModel } from '../../hooks/useModelState';
import { computeScenario, computePersonalScenario } from '../../lib/actuarialMath';
import { RISK_PROFILES, DEFAULT_PARAMS } from '../../lib/constants';

const PERSONAL_COLOR = '#E11D48';

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] tracking-wider uppercase text-zinc-500">{label}</p>
      <p key={value} className="number-in font-mono text-2xl sm:text-[1.7rem] text-zinc-900 tnum mt-2">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}

function fmt(n: number, unit = 'y') {
  if (!isFinite(n)) return 'no limit';
  if (n >= 10000) return `>${(n / 1000).toFixed(0)}k${unit}`;
  return `${Math.round(n).toLocaleString()}${unit}`;
}
function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function S2_BaseModel() {
  const { params, dispatch, profile, hasProfile } = useModel();

  // The "frozen world": evaluated with no further technological improvement,
  // so this section matches 01's ~1,100 / 770-year figures. 03 turns progress on.
  const result = useMemo(() => computeScenario({ ...params, advancementScenario: 'static' }), [params]);
  const personal = useMemo(
    () => (hasProfile ? computePersonalScenario(profile, 'static') : null),
    [hasProfile, profile],
  );
  const personalName = profile.name.trim() || 'You';

  const isDefaultModel =
    Math.abs(params.p0 - DEFAULT_PARAMS.p0) < 1e-9 && params.riskProfileId === 'moderate';
  const modelLabel = isDefaultModel ? 'US average' : 'Adjusted model';

  const curves = [
    { data: result.survivalCurve, color: '#2563EB', label: modelLabel, asymptote: result.asymptote },
    ...(personal
      ? [{ data: personal.survivalCurve, color: PERSONAL_COLOR, label: personalName, asymptote: personal.asymptote }]
      : []),
  ];

  return (
    <SectionWrapper
      id="base-model"
      number="02"
      title="Meet the curve"
      tone="muted"
      subtitle="One line, falling from 100% toward zero: of everyone alive today, what share is still here after this many years? For now, assume the world stops improving. Section 03 turns progress back on."
    >
      <Reveal>
        <div className="card-muted bg-white p-6 max-w-2xl mb-10">
          <p className="text-[15px] text-zinc-800 leading-relaxed">
            {personal ? (
              <>
                Blue is the population. The{' '}
                <span style={{ color: PERSONAL_COLOR }} className="font-semibold">{personalName}</span>{' '}
                line is you, from the form up top. Where it sits depends on your age, where you live, how
                soon the therapy reaches you, and how exposed your daily life is.
              </>
            ) : (
              <>
                Read it like this: pick year 200 on the bottom axis. The line&apos;s height there is the
                share of people still alive. Under normal aging that line is near zero by 120. With aging
                solved it is still high centuries later. Fill in the form above to add your own line.
              </>
            )}
          </p>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Controls */}
        <Reveal className="md:col-span-1 space-y-7">
          <div className="border-l-2 border-accent pl-3">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">Population model</p>
            <p className="text-xs text-zinc-500 mt-1">Shapes the blue line. Your red line comes from the form above.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Aging scenario</h3>
            <div className="flex flex-col gap-2">
              {(['slowed', 'halted', 'reversed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => dispatch({ type: 'SET_AGING_SCENARIO', value: s })}
                  className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    params.agingScenario === s
                      ? 'border-accent bg-accent-soft/60 text-blue-900 font-medium shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <span className="capitalize">{s} aging</span>
                  <span className="block text-xs font-normal text-zinc-500 mt-0.5">
                    {s === 'slowed' && 'Slows, never fully stops'}
                    {s === 'halted' && 'Stops at a held age'}
                    {s === 'reversed' && 'Reset to a youthful baseline'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {params.agingScenario !== 'reversed' && (
            <Slider
              label={params.agingScenario === 'slowed' ? 'Biological age it slows from' : 'Biological age it holds at'}
              value={params.biologicalAge}
              min={20}
              max={60}
              step={1}
              unit="y"
              onChange={(v) => dispatch({ type: 'SET_BIOLOGICAL_AGE', value: v })}
            />
          )}

          <Slider
            label="Background mortality (p₀)"
            value={params.p0}
            min={0.0002}
            max={0.005}
            step={0.0001}
            format={(v) => `${(v * 100).toFixed(3)}`}
            unit="%/yr"
            onChange={(v) => dispatch({ type: 'SET_P0', value: v })}
          />

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">Risk profile</h3>
            <select
              value={params.riskProfileId}
              onChange={(e) => dispatch({ type: 'SET_RISK_PROFILE', value: e.target.value as typeof params.riskProfileId })}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {RISK_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>{p.label} ({p.mortalityMultiplier}×)</option>
              ))}
            </select>
            <p className="text-xs text-zinc-500 mt-2">{RISK_PROFILES.find((p) => p.id === params.riskProfileId)?.description}</p>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5"><ConfidenceBadge level="high" /> Accidents, suicide, homicide: CDC NVSS 2024</div>
            <div className="flex items-center gap-1.5"><ConfidenceBadge level="medium" /> Infectious disease: GBD 2019; CDC 2024</div>
            <div className="flex items-center gap-1.5"><ConfidenceBadge level="low" /> Medical error: BMJ 2016 (contested)</div>
          </div>
        </Reveal>

        {/* Chart + stats */}
        <Reveal delay={80} className="md:col-span-2 space-y-6">
          <div className="card p-4 sm:p-5">
            <SurvivalCurveChart curves={curves} tMax={300} />
          </div>

          {personal ? (
            <>
              <div className="card overflow-hidden">
                <div className="grid grid-cols-3 bg-zinc-50 border-b border-zinc-200/70 text-[11px] tracking-wider uppercase text-zinc-500 px-5 py-2.5">
                  <span>Measure</span>
                  <span className="text-right" style={{ color: PERSONAL_COLOR }}>{personalName}</span>
                  <span className="text-right">{modelLabel}</span>
                </div>
                {[
                  { label: 'Median life', you: fmt(personal.medianLifespan), avg: fmt(result.medianLifespan) },
                  { label: 'Survive indefinitely', you: fmtPct(personal.asymptote), avg: fmtPct(result.asymptote) },
                  { label: 'Die before year 100', you: fmtPct(personal.probDeadBefore.y100), avg: fmtPct(result.probDeadBefore.y100) },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-3 px-5 py-3 text-sm border-b border-zinc-100 last:border-0">
                    <span className="text-zinc-600">{row.label}</span>
                    <span key={`you-${row.you}`} className="number-in text-right font-mono font-semibold tnum" style={{ color: PERSONAL_COLOR }}>{row.you}</span>
                    <span key={`avg-${row.avg}`} className="number-in text-right font-mono text-zinc-700 tnum">{row.avg}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-you-soft/60 border border-rose-200 p-5 text-sm text-rose-950 leading-relaxed">
                The therapy reaches {personalName.toLowerCase() === 'you' ? 'you' : personalName} around{' '}
                <strong className="font-mono tnum">{Math.round(personal.accessCalendarYear)}</strong>, at age{' '}
                <strong className="font-mono tnum">{Math.round(personal.ageAtAccess)}</strong>. First you must survive ordinary
                aging until then. The model puts that chance at{' '}
                <strong className="font-mono tnum">{fmtPct(personal.survivesToTreatment)}</strong>.
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox label="Expected life" value={fmt(result.expectedLifespan)} sub={modelLabel} />
              <StatBox label="Median life" value={fmt(result.medianLifespan)} sub="half outlive this" />
              <StatBox label="Survive forever" value={fmtPct(result.asymptote)} sub="frozen world: none" />
              <StatBox label="Die before 100" value={fmtPct(result.probDeadBefore.y100)} sub="the unlucky slice" />
            </div>
          )}

          <details className="group">
            <summary className="text-sm text-zinc-600 cursor-pointer hover:text-zinc-900 transition-colors list-none inline-flex items-center gap-2">
              <svg className="w-4 h-4 group-open:rotate-90 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              What makes up that background rate?
            </summary>
            <div className="mt-4 card p-4 sm:p-5"><MortalityDecompositionChart /></div>
          </details>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
