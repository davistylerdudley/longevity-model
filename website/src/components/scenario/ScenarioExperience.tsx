'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BEATS,
  CAST,
  readoutForYear,
  BEAT_NOTES,
  BRANCH_EPILOGUE,
  START_YEAR,
  END_YEAR,
  type Basis,
  type Branch,
} from '../../lib/scenario';
import { ScenarioChart } from './ScenarioChart';

const BASIS_TAG: Record<Basis, { text: string; className: string }> = {
  observed: { text: 'Documented', className: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
  forecast: { text: 'Forecast', className: 'text-blue-300 border-blue-500/40 bg-blue-500/10' },
  implication: { text: 'Open question', className: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
};

function jumpToBeat(i: number) {
  document.querySelector(`section[data-index="${i}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function ScenarioExperience() {
  const [active, setActive] = useState(0);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [mobileChartOpen, setMobileChartOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let lastY = -1;
    let lastH = -1;
    const compute = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const doc = document.documentElement;
      const max = doc.scrollHeight - h;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      if (y === lastY && h === lastH) return;
      lastY = y;
      lastH = h;
      const mid = h / 2;
      const els = document.querySelectorAll<HTMLElement>('section[data-index]');
      let best = 0;
      let bestDist = Infinity;
      els.forEach((el) => {
        const idx = Number(el.dataset.index);
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    const interval = window.setInterval(compute, 120);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
      window.clearInterval(interval);
    };
  }, []);

  const activeYear = BEATS[active].year;
  const r = readoutForYear(activeYear);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar + reading progress */}
      <div className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="absolute left-0 top-0 h-[2px] bg-emerald-400 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="font-display text-lg text-white tracking-tight">Escape Velocity</span>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Open the interactive model →
          </Link>
        </div>
        {/* Mobile readout (tap to expand the chart) */}
        <div className="lg:hidden border-t border-zinc-800/80">
          <button
            onClick={() => setMobileChartOpen((o) => !o)}
            className="w-full px-6 py-2 flex items-center justify-between text-xs"
            aria-expanded={mobileChartOpen}
          >
            <span className="font-mono text-white tnum">{activeYear}</span>
            <span className="text-zinc-400 truncate px-2">{r.aiSystem} · {r.bioStatus}</span>
            <span className="flex items-center gap-1.5">
              <span className={`font-mono tnum ${r.asymptote >= 0.5 ? 'text-emerald-300' : 'text-zinc-300'}`}>
                {(r.asymptote * 100).toFixed(0)}% escape aging
              </span>
              <svg className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${mobileChartOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </button>
          {mobileChartOpen && (
            <div className="px-4 pb-3">
              <TimelineRail active={active} />
              <ScenarioChart year={activeYear} branch={branch} compact />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <header className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 max-w-3xl">
          <div className="pointer-events-none absolute -left-40 -top-24 w-[36rem] h-[24rem] rounded-full bg-emerald-500/10 blur-3xl" aria-hidden />
          <p className="relative font-mono text-xs tracking-[0.25em] text-emerald-400 uppercase mb-6">
            A grounded scenario · 2025–2048
          </p>
          <h1 className="relative font-display text-6xl sm:text-7xl leading-[0.98] mb-7">
            Escape <span className="italic text-zinc-300">Velocity</span>
          </h1>
          <p className="relative text-lg sm:text-xl text-zinc-400 leading-relaxed">
            One plausible way the end of aging actually happens: not a single miracle but a chain of
            unlocks, each handed to us by a more capable generation of AI, until the curve that has
            governed every human life quietly bends. Told as a story, with people you follow for twenty
            years, and a chart that keeps score as you read.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <LegendDot className="bg-emerald-400" label="Documented — real, cited events" />
            <LegendDot className="bg-blue-400" label="Forecast — extrapolated from current trends" />
            <LegendDot className="bg-amber-400" label="Open question — where the model stops" />
          </div>
        </header>

        {/* Cast */}
        <section className="mb-16 sm:mb-20 max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-4">The people</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {CAST.map((c) => (
              <div key={c.name} className="border-l border-zinc-800 pl-4">
                <p className="text-sm text-white font-medium">{c.name}</p>
                <p className="text-xs text-zinc-500 leading-snug">{c.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-4 leading-relaxed">
            Invented, each standing for a real kind of person. The events through mid-2026 are real. Everything after is forecast written as fiction.
          </p>
        </section>

        {/* Body: narrative + sticky chart */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-x-12 pb-32">
          <aside className="hidden lg:block lg:order-2">
            <div className="lg:sticky lg:top-20">
              <TimelineRail active={active} />
              <ScenarioChart year={activeYear} branch={branch} />
              <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
                Both lines are one person&rsquo;s odds of never dying of an age-related cause. Green assumes
                you&rsquo;re first in line. Amber is a typical person and folds in whether access ever reaches
                you, the fork you pick near the end. Neither means immortal: accidents, violence and disease
                still apply. Survival figures use the model&rsquo;s own math, floor <span className="font-mono">exp(−p₀/r)</span>.
              </p>
            </div>
          </aside>

          <div className="lg:order-1 space-y-24 sm:space-y-32 max-w-2xl">
            {BEATS.map((b, i) => {
              const tag = BASIS_TAG[b.basis];
              const note = BEAT_NOTES[b.id];
              const isActive = i === active;
              return (
                <section key={b.id} data-index={i} className={`scroll-mt-28 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-zinc-500 tnum">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-mono text-xs text-emerald-400/90">{b.period}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium tracking-wider ${tag.className}`}>{tag.text}</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl leading-[1.02] mb-6 text-white">{b.title}</h2>
                  <div className="space-y-5 text-[15.5px] leading-[1.75] text-zinc-300">
                    {b.paragraphs.map((p, j) => (
                      <p key={j} className={j === 0 ? 'drop-cap' : ''}>{p}</p>
                    ))}
                  </div>

                  {note && (
                    <details className="mt-6 group">
                      <summary className="cursor-pointer text-xs font-medium text-blue-300 hover:text-blue-200 list-none inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        Why this forecast?
                      </summary>
                      <p className="mt-3 text-[13px] text-zinc-400 leading-relaxed border-l border-blue-500/30 pl-4">{note}</p>
                    </details>
                  )}

                  {b.sources && b.sources.length > 0 && (
                    <div className="mt-5 space-y-1.5 border-l border-zinc-800 pl-4">
                      {b.sources.map((s, j) => (
                        <p key={j} className="text-xs text-zinc-500 leading-snug">
                          {s.url ? (
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 underline decoration-zinc-700 underline-offset-2">{s.label}</a>
                          ) : s.label}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* The fork: let the reader choose a branch */}
                  {b.id === 'fork' && (
                    <div className="mt-8">
                      <p className="text-sm text-zinc-400 mb-3">Pick a branch. It changes the second line on the chart, and the ending.</p>
                      <div className="flex flex-wrap gap-3">
                        {(['broad', 'locked'] as Branch[]).map((bk) => (
                          <button
                            key={bk}
                            onClick={() => setBranch(bk)}
                            className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${
                              branch === bk ? 'border-amber-500 bg-amber-500/10 text-white shadow-[0_0_0_3px_rgba(245,158,11,0.15)]' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                            }`}
                          >
                            {BRANCH_EPILOGUE[bk].label}
                          </button>
                        ))}
                      </div>
                      {branch && (
                        <div key={branch} className="number-in mt-6 border-l-2 border-amber-500 pl-5">
                          <h3 className="font-display text-2xl text-white mb-2">{BRANCH_EPILOGUE[branch].title}</h3>
                          <p className="text-[15px] leading-relaxed text-zinc-300">{BRANCH_EPILOGUE[branch].text}</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}

            {/* Closing CTA */}
            <section className="border-t border-zinc-800 pt-12">
              <h2 className="font-display text-3xl sm:text-4xl mb-4 text-white">Now put yourself in it</h2>
              <p className="text-[15px] leading-relaxed text-zinc-300 mb-6">
                This was one thread. The interactive model runs your own: your country, income, age, and the year
                you think the treatments arrive, then shows where you land on the distribution.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors">
                Open the interactive model
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </section>

            <footer className="border-t border-zinc-800 pt-10 mt-4 space-y-3 text-xs text-zinc-500 leading-relaxed">
              <p>
                <strong className="text-zinc-400">About this scenario.</strong> The events through mid-2026 are real and cited.
                Everything after is a forecast written as fiction: one plausible path, not a prediction. &ldquo;Agent-1&rdquo;
                through &ldquo;Agent-5&rdquo; borrow the naming convention of the AI 2027 forecast; &ldquo;Amaranth&rdquo; and the
                people are invented. Survival numbers come from this project&rsquo;s own model. Research-speed, price and
                access figures past 2026 are illustrative and internally consistent, not measured.
              </p>
              <p>
                <strong className="text-zinc-400">On the speed of the AI ramp.</strong> This scenario is paced to what the people
                who invented the genre now expect. In{' '}
                <a href="https://blog.aifutures.org/p/ai-futures-model-dec-2025-update" target="_blank" rel="noopener noreferrer" className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300">
                  a December 2025 update
                </a>{' '}
                the AI Futures Project moved its own median for a superhuman coder from 2027&ndash;28 out to roughly 2032, with
                Daniel Kokotajlo&rsquo;s personal estimate nearer 2030. Agent-1 arrives here in 2029 and Agent-2, the first system
                that runs a lab rather than assists one, in 2030. On the original AI 2027 schedule everything after the observed
                chapters would sit about three years earlier, and escape velocity would land on Aubrey de Grey&rsquo;s even-odds
                year of 2036 rather than in 2039. The threshold itself does not move: longevity escape velocity in this model needs
                background mortality to improve by only about 0.13% a year. A slower AI ramp shifts the dates, not the arithmetic.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineRail({ active }: { active: number }) {
  const span = END_YEAR - START_YEAR;
  return (
    <div className="relative h-7 mb-2 px-1">
      <div className="absolute left-1 right-1 top-1/2 h-px bg-zinc-800" />
      {BEATS.map((b, i) => {
        const x = ((b.year - START_YEAR) / span) * 100;
        const isActive = i === active;
        return (
          <button key={b.id} onClick={() => jumpToBeat(i)} title={`${b.period} — ${b.title}`} style={{ left: `${x}%` }} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-1">
            <span className={`block rounded-full transition-all ${isActive ? 'w-3 h-3 bg-emerald-400' : 'w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400'}`} />
          </button>
        );
      })}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-zinc-500">
      <span className={`inline-block w-2 h-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}
