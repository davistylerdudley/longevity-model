'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'the-question', label: 'The question' },
  { id: 'base-model', label: 'The curve' },
  { id: 'concurrent-advancement', label: 'Progress' },
  { id: 'stratification', label: 'Who gets it' },
  { id: 'distribution', label: 'The spread' },
  { id: 'sensitivity', label: 'Uncertainty' },
  { id: 'implications', label: 'What changes' },
  { id: 'your-story', label: 'Your story' },
];

/**
 * Sticky nav with a reading-progress bar and scrollspy highlighting.
 */
export function SiteNav() {
  const [active, setActive] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top third of the viewport.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200/70">
      <div className="absolute left-0 top-0 h-[2px] bg-accent transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      <div className="relative max-w-6xl mx-auto">
        <div className="px-6 h-12 flex items-center gap-6 overflow-x-auto scrollbar-none">
          <a href="#top" className="font-display text-base sm:text-lg text-zinc-900 whitespace-nowrap tracking-tight">
            How long would you live?
          </a>
          <div className="flex items-center gap-1 ml-auto">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`text-xs px-2 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                    isActive ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {s.label}
                </a>
              );
            })}
            <Link
              href="/escape-velocity"
              className="ml-1 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              Read the scenario →
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden" />
      </div>
    </nav>
  );
}
