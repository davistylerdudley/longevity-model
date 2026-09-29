'use client';

import { useMemo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { TornadoChart } from '../charts/TornadoChart';
import { Reveal } from '../ui/Reveal';
import { useModel } from '../../hooks/useModelState';
import { computeSensitivity } from '../../lib/actuarialMath';

const OPEN_QUESTIONS = [
  {
    title: 'What happens to a mind over centuries?',
    confidence: 'speculative' as const,
    body: 'Psychology has no data on a 500-year life. People adapt to almost anything (Brickman et al., 1978), which is reassuring. But nobody knows how loss, boredom, and memory stack up across that much time.',
    source: 'Brickman P, et al. J Pers Soc Psychol, 1978.',
  },
  {
    title: 'Does violence keep falling, or turn?',
    confidence: 'low' as const,
    body: 'AI cuts both ways: it can catch threats in real time, and it can design new ones. Unlike accidents or disease, violence has an opponent who adapts, so its downward trend is the least safe to extrapolate.',
    source: 'Pinker S. Better Angels of Our Nature, 2011 (contested in the AI context).',
  },
  {
    title: 'Do people get more careful, or less?',
    confidence: 'low' as const,
    body: 'When a life is worth centuries, caution is rational. But people spend safety gains on extra risk (the Peltzman effect). Whether long lives make people timid or reckless is an open question.',
    source: 'Peltzman S. J Polit Econ, 1975.',
  },
  {
    title: 'Where does suicide settle over the long run?',
    confidence: 'speculative' as const,
    body: 'Even a flat yearly rate accumulates over centuries. Whether it holds, climbs, or drops with better treatment and the end of age-related despair is the single most consequential unknown in the model.',
    source: 'WHO. Suicide worldwide in 2019, 2021.',
  },
];

const BADGE: Record<string, string> = {
  speculative: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  low: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function S6_Sensitivity() {
  const { params } = useModel();
  const entries = useMemo(() => computeSensitivity(params), [params]);

  return (
    <SectionWrapper
      id="sensitivity"
      number="06"
      title="Which number are we most wrong about?"
      tone="muted"
      subtitle="A model is only as good as its shakiest input. If one assumption is off, which one moves the answer most, and where is the evidence thinnest?"
    >
      <div className="space-y-10">
        <Reveal>
          <div className="card-muted bg-white p-7 max-w-2xl">
            <p className="text-[15px] text-zinc-800 leading-relaxed">
              Nudge each input up and down by half and see how far the answer moves. The bars below do that
              for the chance of surviving indefinitely. <strong>The longest bar is the input that matters most.</strong>
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="card p-4 sm:p-5">
            <TornadoChart entries={entries} />
          </div>
        </Reveal>

        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-5">Four things the model will not pretend to know</p>
          <div className="grid md:grid-cols-2 gap-5">
            {OPEN_QUESTIONS.map((q, i) => (
              <div key={q.title} className="card p-6 space-y-3" style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display text-xl text-zinc-900 leading-snug">{q.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 tracking-wider ${BADGE[q.confidence]}`}>{q.confidence.toUpperCase()}</span>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">{q.body}</p>
                <p className="text-xs text-zinc-500 italic">{q.source}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="card-muted bg-white p-6">
            <p className="text-sm font-semibold text-zinc-900 mb-2">What this model cannot tell you</p>
            <ul className="text-sm text-zinc-700 space-y-1.5 leading-relaxed list-disc list-inside">
              <li>Whether, or when, aging will actually be solved.</li>
              <li>How society, behavior, and governance adapt to centuries-long lives.</li>
              <li>Whether a mind at century scale follows any pattern in today&apos;s data.</li>
            </ul>
            <p className="text-xs text-zinc-500 mt-3">A bounding analysis, not a prediction: it shows the range of outcomes and which inputs drive it.</p>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
