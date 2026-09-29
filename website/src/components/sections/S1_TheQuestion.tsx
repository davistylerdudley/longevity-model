import Link from 'next/link';
import { SectionWrapper } from '../ui/SectionWrapper';
import { OnboardingCard } from '../ui/OnboardingCard';
import { HeroBackground } from '../ui/HeroBackground';
import { Reveal } from '../ui/Reveal';

export function S1_TheQuestion() {
  return (
    <>
      {/* Hero */}
      <div id="top" className="relative overflow-hidden bg-zinc-950 text-white pt-24 pb-28 px-6">
        <HeroBackground />
        <div className="relative z-10 max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-x-16 gap-y-12 items-start">
          <div>
            <p className="animate-fade-up font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase mb-7" style={{ animationDelay: '0.05s' }}>
              A longevity projection model
            </p>
            <h1 className="animate-fade-up font-display text-6xl sm:text-7xl leading-[0.98] mb-7" style={{ animationDelay: '0.15s' }}>
              If aging were solved,<br />
              <span className="italic text-zinc-300">how long would you live?</span>
            </h1>
            <p className="animate-fade-up text-lg sm:text-xl text-zinc-400 max-w-md leading-relaxed" style={{ animationDelay: '0.3s' }}>
              Most people guess an extra few decades. The math, run on real mortality data, gives a
              stranger answer: centuries, a real chance at forever, and a gap between people measured
              in lifetimes.
            </p>
            <div className="animate-fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.42s' }}>
              <a href="#the-question" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors">
                Start with the math
              </a>
              <Link href="/escape-velocity" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-200 text-sm hover:border-zinc-500 hover:text-white transition-colors">
                Read the scenario
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <OnboardingCard />
          </div>
        </div>
      </div>

      {/* 01 */}
      <SectionWrapper
        id="the-question"
        number="01"
        title="Start with a simpler question"
        subtitle="Not “can we live forever?” but “if old age stopped killing people, what would, and how long would that take?”"
      >
        <div className="space-y-12">
          <Reveal>
            <div className="card-muted p-7 max-w-2xl">
              <p className="text-base text-zinc-800 leading-relaxed">
                Picture a healthy 30-year-old whose body never gets older. A car, a new virus, a fire
                can still kill them. So the question is not <em>whether</em> they die. It is how long a
                person lasts once the slow, reliable killer is gone and only the sudden ones remain.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="space-y-4 text-[15px] text-zinc-700 leading-relaxed">
                <p>
                  That question has a clean answer. If your yearly chance of dying from those sudden
                  causes is a flat number{' '}
                  <code className="font-mono text-[13px] bg-zinc-100 px-1.5 py-0.5 rounded">p</code>, your
                  lifespan follows an <strong>exponential curve</strong>, and the average comes out to{' '}
                  <code className="font-mono text-[13px] bg-zinc-100 px-1.5 py-0.5 rounded">1/p</code>.
                </p>
                <p>
                  Plug in today&apos;s US rate for accidents, violence, and disease, and the answer is not
                  90, or 150. It is more than a thousand years.
                </p>
              </div>
              <div>
                <div className="rounded-2xl bg-zinc-950 text-zinc-100 p-5 font-mono text-sm shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]">
                  <div className="text-zinc-500 text-[11px] tracking-wider uppercase mb-3">US non-aging background mortality</div>
                  <div className="tnum">p ≈ 0.0009 per year</div>
                  <div className="mt-2 tnum">
                    average = 1/p ≈ <span className="text-blue-300 font-semibold">1,100 years</span>
                  </div>
                  <div className="tnum">
                    median = ln(2)/p ≈ <span className="text-blue-300 font-semibold">770 years</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
                  Not a forecast. Just what today&apos;s data implies once you remove the part that comes
                  from getting old.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Could this happen? — tight, cited, then hand off to the scenario */}
          <Reveal>
            <div className="grid md:grid-cols-[1fr_20rem] gap-8 items-stretch">
              <div className="border-l-2 border-accent pl-6 space-y-4">
                <h3 className="font-display text-2xl text-zinc-900">Could this actually happen?</h3>
                <p className="text-[15px] text-zinc-700 leading-relaxed">
                  Aging has stopped looking like a fact of life and started looking like an engineering
                  problem. The &ldquo;hallmarks of aging&rdquo; framework breaks it into about a dozen
                  measurable, targetable mechanisms (López-Otín et al., <em>Cell</em> 2013/2023). Some are
                  already reversible in animals: partial reprogramming extended the remaining life of
                  already-old mice by ~109% (Macip et al., 2024). In June 2026 the first human was dosed with
                  a partial reprogramming therapy, in one eye, safety as the endpoint (Life Biosciences,
                  ER-100). Money has followed: $1B into Retro, $130M into NewLimit, $2.1B into Isomorphic.
                  Demographers push back, and fairly: Olshansky et al. find life-expectancy gains slowing in
                  the longest-lived countries, which is exactly why only slowing aging itself would matter.
                </p>
                <p className="text-[15px] text-zinc-700 leading-relaxed">
                  The second ingredient is speed. AlphaFold solved a fifty-year protein problem and earned
                  the 2024 Nobel Prize in Chemistry. Since 2024 the length of task a model can finish
                  unassisted has been doubling every three to four months (METR 2026); Gemini hit gold-medal
                  standard at the 2025 Mathematical Olympiad; and rentosertib, whose target and molecule were
                  both AI-nominated, reached Phase 3 in July 2026. Amodei argues powerful AI could compress
                  fifty to a hundred years of biomedical progress into five to ten. That is contested, and
                  the AI Futures Project pushed its own median for automated AI research out to the early
                  2030s in December 2025. Even that slower pace bends the curves below.
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Sources: López-Otín C et al., <em>Cell</em>{' '}2013 &amp; 2023. Macip CC et al.,{' '}
                  <em>Cellular Reprogramming</em> 2024. Jumper J et al., <em>Nature</em> 2021; Nobel Prize in
                  Chemistry 2024. Amodei D,{' '}
                  <a href="https://darioamodei.com/essay/machines-of-loving-grace" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">
                    Machines of Loving Grace
                  </a>{' '}
                  (2024). Olshansky SJ et al.,{' '}
                  <a href="https://www.nature.com/articles/s43587-024-00702-3" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">
                    <em>Nature Aging</em> 2024
                  </a>. Life Biosciences,{' '}
                  <a href="https://www.lifebiosciences.com/life-biosciences-announces-first-patient-dosed-in-phase-1-trial-of-er-100-for-optic-neuropathies/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">
                    ER-100 first patient dosed
                  </a>{' '}
                  (2026).{' '}
                  <a href="https://metr.org/blog/2026-1-29-time-horizon-1-1/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">
                    METR, Time Horizon 1.1
                  </a>{' '}
                  (2026).{' '}
                  <a href="https://blog.aifutures.org/p/ai-futures-model-dec-2025-update" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">
                    AI Futures Project, Dec 2025 model update
                  </a>.
                </p>
              </div>

              <Link
                href="/escape-velocity"
                className="group relative overflow-hidden rounded-2xl bg-zinc-950 text-white p-6 flex flex-col justify-between shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5"
              >
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl group-hover:bg-emerald-400/30 transition-colors" />
                <div className="relative">
                  <p className="font-mono text-[11px] tracking-[0.22em] text-emerald-400 uppercase">The scenario · 2025–2048</p>
                  <p className="font-display text-3xl mt-3 leading-tight">Escape Velocity</p>
                  <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                    How it could actually happen, year by year, told as a story with a live scoreboard.
                    Documented where it can be. Forecast where it must be.
                  </p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
                  Read it <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal>
            <div className="pt-8 border-t border-zinc-200/70">
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-6">Three things to watch for</p>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { n: '01', title: 'The average lies', body: 'A thousand-year average means an unlucky slice still dies within a century and a lucky slice runs for thousands of years. The spread is the story.' },
                  { n: '02', title: 'The ground keeps moving', body: 'Accidents and epidemics have been getting rarer for a century. Keep that up and “very long life” turns into a real chance of not dying at all.' },
                  { n: '03', title: 'Some of this is guesswork', body: 'Today’s death rates are measured well. How people behave over centuries, and who gets treated first, are not. The model keeps the two apart.' },
                ].map(({ n, title, body }) => (
                  <div key={n}>
                    <p className="font-mono text-xs text-accent tnum">{n}</p>
                    <p className="font-display text-xl text-zinc-900 mt-2">{title}</p>
                    <p className="text-sm text-zinc-600 leading-relaxed mt-2">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>
    </>
  );
}
