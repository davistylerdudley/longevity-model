'use client';

import { useState, useRef, useEffect } from 'react';
import type { ConfidenceLevel, Citation } from '../../lib/types';
import { ConfidenceBadge } from './ConfidenceBadge';

interface Props {
  children: React.ReactNode;
  confidence: ConfidenceLevel;
  rationale: string;
  citations: Citation[];
}

export function CitationTooltip({ children, confidence, rationale, citations }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <span
        className="underline decoration-dotted decoration-zinc-400 cursor-help"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        {children}
      </span>
      {open && (
        <span className="absolute z-50 left-0 top-full mt-2 w-80 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg text-sm text-zinc-700 not-italic">
          <span className="flex items-center gap-2 mb-2">
            <ConfidenceBadge level={confidence} />
            <span className="text-xs text-zinc-400 uppercase tracking-wider">confidence</span>
          </span>
          <p className="text-zinc-700 mb-3 leading-relaxed">{rationale}</p>
          {citations.length > 0 && (
            <div className="border-t border-zinc-100 pt-3 space-y-1">
              {citations.map((c, i) => (
                <span key={i} className="block text-xs text-zinc-500 leading-snug">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {c.source}
                    </a>
                  ) : (
                    c.source
                  )}
                  {c.notes && <span className="block text-zinc-400 mt-0.5">{c.notes}</span>}
                </span>
              ))}
            </div>
          )}
        </span>
      )}
    </span>
  );
}
