import { SectionWrapper } from '../ui/SectionWrapper';
import { Reveal } from '../ui/Reveal';

type EvidenceLevel = 'grounded' | 'extrapolation' | 'speculative';

const BADGE: Record<EvidenceLevel, { text: string; className: string }> = {
  grounded: { text: 'Follows from the math', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  extrapolation: { text: 'Reasonable guess', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  speculative: { text: 'Speculative', className: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
};

interface Implication {
  title: string;
  evidence: EvidenceLevel;
  body: string;
}

const IMPLICATIONS: Implication[] = [
  {
    title: 'Surviving early pays off later',
    evidence: 'grounded',
    body: 'The people who make it through the risky early years gain the most, because the world keeps getting safer around them. Someone alive in 2040 who reaches 2200 collects 160 years of better medicine and safer tools. Getting to the future is the hard part. Staying there gets cheaper every decade.',
  },
  {
    title: 'Real mastery becomes possible',
    evidence: 'extrapolation',
    body: 'The best people in any field peak in their forties and get two or three good decades. Remove the decline and you could spend fifty years on medicine, fifty on physics, a century on philosophy, and still have more time left than all of recorded history. The generalist gives way to the serial expert.',
  },
  {
    title: 'Risk gets repriced',
    evidence: 'extrapolation',
    body: 'When a life stretches into centuries, life insurance stops making sense in its current form, and hazard pay would have to cover the loss of centuries, not decades. Many dangerous jobs become too expensive to staff with people, which speeds up automating them.',
  },
  {
    title: 'Old policy assumptions dissolve',
    evidence: 'extrapolation',
    body: 'Social Security and Medicare were built for retirement at 65 followed by a decade or two of decline. The three-act shape of school, career, retirement stops fitting. Whole debates, from pensions to Medicare cost curves, rest on a population pyramid that would no longer exist.',
  },
  {
    title: 'Democracy assumes people leave',
    evidence: 'extrapolation',
    body: 'Democratic systems quietly assume turnover. A senator elected in 2100 could still hold the seat in 2300 with two hundred years of accumulated power. And the old puzzle of who speaks for the unborn sharpens when today’s voters may personally live through choices made 500 years out.',
  },
  {
    title: 'Population math gets strange',
    evidence: 'extrapolation',
    body: 'Almost nobody dying means the living pile up faster than they leave. A stable population would need births to fall close to zero. The question of who is allowed to have children, or whether that gets rationed, is one of the darker corners here, and it deserves a direct look.',
  },
  {
    title: 'A new kind of inequality',
    evidence: 'grounded',
    body: 'Today the rich-poor gap in US life expectancy is 10 to 14 years (Chetty et al., 2016). It is wider on other cuts, and widening: 20.4 years across the ten major US population groups in 2021, up from 12.6 in 2000 (Dwyer-Lindgren et al., 2024), and 8.5 years between adults with and without a degree, up from 2.6 in 1992 (Case & Deaton, 2025). Hand out solved aging unevenly and those years become centuries: the top group might have a 90% chance of never dying, the bottom 20 to 30%. That is not the old inequality made bigger. It is a different thing.',
  },
  {
    title: 'Suicide becomes a leading cause of death',
    evidence: 'grounded',
    body: 'Hold the US suicide rate flat and run it for a thousand years and the cumulative chance climbs to roughly 13%. Nothing about the yearly rate changes; the horizon does the work. Mental health care moves to the center of public health in a way it is not today.',
  },
  {
    title: 'Does a very long life still mean something?',
    evidence: 'speculative',
    body: 'Bernard Williams argued in 1973 that an endless life would go hollow, because the projects that shape a life need a finish line. Parfit and others push back: what we want can keep changing. Underneath sits a harder question: is a person who lives 500 years still the same person, and does meaning require that they be?',
  },
];

export function S7_Implications() {
  return (
    <SectionWrapper
      id="implications"
      number="07"
      title="So what would actually change?"
      subtitle="Take the model at its word for a moment and follow it out into the world. What opens up, what shifts, and what gets harder."
    >
      <div className="grid md:grid-cols-2 gap-5">
        {IMPLICATIONS.map((impl, i) => {
          const badge = BADGE[impl.evidence];
          return (
            <Reveal key={impl.title} delay={(i % 2) * 70}>
              <article className="card p-6 h-full flex flex-col gap-3">
                <span className={`self-start text-[10px] px-2 py-0.5 rounded-full border font-medium tracking-wider ${badge.className}`}>{badge.text}</span>
                <h3 className="font-display text-2xl text-zinc-900 leading-snug">{impl.title}</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">{impl.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed mt-10 max-w-2xl">
        Sources: Williams B. <em>Problems of the Self</em>, 1973. Chetty R et al. JAMA 2016. Dwyer-Lindgren L et al.,{' '}
        <em>Ten Americas</em>, <em>The Lancet</em> 2024. Case A, Deaton A. <em>Am J Epidemiol</em> 2025. Parfit D.{' '}
        <em>Reasons and Persons</em>, 1984. WHO, <em>Suicide worldwide in 2019</em>, 2021.
      </p>
    </SectionWrapper>
  );
}
