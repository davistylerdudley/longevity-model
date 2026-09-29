import { Reveal } from './Reveal';

interface Props {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** 'white' | 'muted' — alternating rhythm down the page */
  tone?: 'white' | 'muted';
}

/**
 * Editorial section shell: small mono numeral, serif headline, a measured
 * subtitle, then content. Headers reveal on scroll.
 */
export function SectionWrapper({
  id,
  number,
  title,
  subtitle,
  children,
  className = '',
  tone = 'white',
}: Props) {
  const bg = tone === 'muted' ? 'bg-zinc-50/70' : 'bg-white';
  return (
    <section id={id} className={`scroll-mt-14 py-24 sm:py-28 ${bg} ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal as="header" className="mb-12 sm:mb-16">
          <div className="grid md:grid-cols-[3.5rem_1fr] gap-x-8 items-start">
            <span className="font-mono text-xs tracking-[0.22em] text-accent tnum pt-3">{number}</span>
            <div>
              <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-zinc-900">{title}</h2>
              {subtitle && (
                <p className="mt-5 text-lg sm:text-xl text-zinc-600 max-w-2xl leading-relaxed">{subtitle}</p>
              )}
            </div>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
