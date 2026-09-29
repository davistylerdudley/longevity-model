'use client';

import { useModel } from '../../hooks/useModelState';
import { COUNTRIES } from '../../lib/constants';

function Field({ label, hint, children, value }: { label: string; hint?: string; children: React.ReactNode; value?: string }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-[13px] font-medium text-zinc-200">{label}</label>
        {value && <span className="font-mono text-sm text-white tnum">{value}</span>}
      </div>
      {children}
      {hint && <p className="text-[11px] text-zinc-500 mt-1.5 leading-snug">{hint}</p>}
    </div>
  );
}

function Range({ low, high, ...props }: { low: string; high: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <input type="range" className="w-full cursor-pointer" {...props} />
      <div className="flex justify-between text-[11px] text-zinc-500 mt-1"><span>{low}</span><span>{high}</span></div>
    </>
  );
}

export function OnboardingCard() {
  const { profile, setProfile, setHasProfile } = useModel();
  const set = <K extends keyof typeof profile>(k: K, v: (typeof profile)[K]) => setProfile((p) => ({ ...p, [k]: v }));

  const submit = () => {
    setHasProfile(true);
    document.getElementById('base-model')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="dark-controls card-dark p-6 sm:p-7">
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-blue-400 mb-2">Put yourself in it</p>
      <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
        The model will draw <span className="text-white font-medium">your</span> line through every chart and end with a story about how your life might run.
      </p>

      <div className="space-y-5">
        <Field label="What should we call you?">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Your name"
            className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </Field>

        <Field label="Where do you live?" hint="Sets your baseline risk and how soon the therapy likely reaches you.">
          <select
            value={profile.countryCode}
            onChange={(e) => set('countryCode', e.target.value)}
            className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Your age" value={`${profile.currentAge}`}>
            <Range low="18" high="85" min={18} max={85} value={profile.currentAge} onChange={(e) => set('currentAge', +e.target.value)} />
          </Field>
          <Field label="Aging solved by" value={`${profile.treatmentYear}`}>
            <Range low="2028" high="2100" min={2028} max={2100} value={profile.treatmentYear} onChange={(e) => set('treatmentYear', +e.target.value)} />
          </Field>
        </div>
        <p className="-mt-2 text-[11px] text-zinc-500 leading-snug">
          You still have to survive ordinary aging until it reaches you, so these two matter as much as anything.
        </p>

        <Field label="Your income, relative to your country">
          <Range low="Lower income" high="Top earners" min={0} max={100} value={profile.incomePercentile} onChange={(e) => set('incomePercentile', +e.target.value)} />
        </Field>

        <Field
          label="How exposed is your daily life to accidents and violence?"
          hint="Job safety, how much you drive, your neighborhood, drinking or substance use. Once aging is solved, these everyday risks are what remain."
        >
          <Range low="Very safe" high="High exposure" min={0} max={100} value={profile.riskAppetite} onChange={(e) => set('riskAppetite', +e.target.value)} />
        </Field>
      </div>

      <button
        onClick={submit}
        className="mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
      >
        Build my projection
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </button>
      <p className="text-[11px] text-zinc-600 mt-3">Nothing you enter leaves your browser.</p>
    </div>
  );
}
