'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** stagger, in ms */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'article' | 'li';
}

/**
 * Fades content up the first time it scrolls into view.
 *
 * Robustness rules, in priority order:
 *  1. Content is visible by default (server HTML, no-JS, reduced-motion).
 *  2. The fade is only "armed" on the client, and only for elements that are
 *     below the fold at mount, so nothing above the fold ever flickers and
 *     nothing about the server markup changes (no hydration mismatch).
 *  3. IntersectionObserver reveals it; a passive scroll listener is a second
 *     trigger in case the observer is throttled; a last-resort timer
 *     guarantees nothing stays hidden.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    };

    if (inView() || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    el.classList.add('reveal-armed');
    let done = false;
    let io: IntersectionObserver | null = null;
    let timer = 0;

    const show = () => {
      if (done) return;
      done = true;
      el.classList.add('is-visible');
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(timer);
    };
    const onScroll = () => {
      if (inView()) show();
    };

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show();
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    timer = window.setTimeout(show, 8000);

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
