'use client';

import { useMemo, useState } from 'react';
import { useModel } from '../../hooks/useModelState';
import { Reveal } from '../ui/Reveal';
import { computePersonalScenario, lookupCountry } from '../../lib/actuarialMath';
import { selectStory, illustrativeStories } from '../../lib/stories';

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-dark px-4 py-3">
      <p className="text-[11px] tracking-wider uppercase text-zinc-500">{label}</p>
      <p key={value} className="number-in font-mono text-lg text-white tnum mt-1">{value}</p>
    </div>
  );
}

export function S8_YourStory() {
  const { profile, hasProfile, params } = useModel();
  const personal = useMemo(
    () => (hasProfile ? computePersonalScenario(profile, params.advancementScenario) : null),
    [hasProfile, profile, params.advancementScenario],
  );
  const story = useMemo(() => (personal ? selectStory(profile, personal) : null), [profile, personal]);
  const others = useMemo(() => illustrativeStories(), []);
  const [selectedId, setSelectedId] = useState(others[0].id);
  const selected = others.find((o) => o.id === selectedId) ?? others[0];
  const name = profile.name.trim() || 'You';
  const country = lookupCountry(profile.countryCode).name;

  return (
    <section id="your-story" className="scroll-mt-14 relative overflow-hidden bg-zinc-950 text-white py-28 px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-blue-900/25 blur-3xl" />
      </div>
      <div className="relative max-w-5xl mx-auto">
        <Reveal as="header" className="max-w-3xl mb-12">
          <p className="font-mono text-xs tracking-[0.22em] text-blue-400 uppercase mb-4">08</p>
          <h2 className="font-display text-5xl sm:text-6xl leading-[1.02]">One version of <span className="italic text-zinc-300">your</span> long life</h2>
          <p className="mt-5 text-lg text-zinc-400 leading-relaxed max-w-2xl">
            The charts give you a distribution. A distribution is not a life. So here is a single story drawn
            from it: one plausible thread out of the thousands your numbers allow.
          </p>
        </Reveal>

        {!personal || !story ? (
          <Reveal>
            <div className="card-dark p-8 text-center max-w-3xl">
              <p className="text-zinc-300 mb-6">Fill in the short form at the top for a story written from your own numbers. Or browse how it plays out for others below.</p>
              <a href="#top" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors">Go to the form</a>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="grid lg:grid-cols-[1fr_16rem] gap-8 items-start max-w-5xl">
              <article className="card-dark p-8 sm:p-10">
                <p className="font-mono text-[11px] tracking-[0.22em] text-blue-400 uppercase mb-5">{story.title}</p>
                <div className="space-y-5 text-zinc-200 leading-[1.75] text-[15.5px]">
                  {story.paragraphs.map((p, i) => (
                    <p key={i} className={i === 0 ? 'drop-cap' : ''}>{p}</p>
                  ))}
                </div>
              </article>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <StatChip label="Home" value={country} />
                <StatChip label="Reaches you" value={`~${Math.round(personal.accessCalendarYear)}`} />
                <StatChip label="Your age then" value={`${Math.round(personal.ageAtAccess)}`} />
                <StatChip label="Median life" value={isFinite(personal.medianLifespan) ? `${Math.round(personal.medianLifespan).toLocaleString()}y` : 'no limit'} />
                <p className="col-span-2 lg:col-span-1 text-[11px] text-zinc-500 leading-relaxed mt-1">
                  Chosen from your inputs: where you live, how soon it reaches you, your exposure, and your survival floor. Fiction built on the numbers, not a forecast about {name}.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Browse other outcomes */}
        <Reveal className="mt-20 pt-12 border-t border-zinc-800">
          <h3 className="font-display text-3xl sm:text-4xl">How it plays out for others</h3>
          <p className="text-zinc-400 max-w-2xl leading-relaxed mt-3 mb-7">
            The same technology lands very differently depending on who and where you are. Pick a life.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {others.map((o) => {
              const isActive = o.id === selectedId;
              const isYours = story?.id === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    isActive ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_0_3px_rgba(59,130,246,0.15)]' : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <span className="font-medium">{o.personaName}</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">
                    {o.personaTag}{isYours && <span className="text-blue-400"> · closest to you</span>}
                  </span>
                </button>
              );
            })}
          </div>
          <article key={selected.id} className="card-dark p-8 sm:p-10 max-w-3xl number-in">
            <div className="flex items-baseline justify-between gap-4 mb-5 flex-wrap">
              <p className="font-mono text-[11px] tracking-[0.22em] text-blue-400 uppercase">{selected.title}</p>
              <p className="text-xs text-zinc-500">{selected.personaName} · {selected.personaTag}</p>
            </div>
            <div className="space-y-5 text-zinc-200 leading-[1.75] text-[15.5px]">
              {selected.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'drop-cap' : ''}>{p}</p>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
