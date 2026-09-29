'use client';

import Link from 'next/link';
import { ModelContext, useModelState } from '../hooks/useModelState';
import { SiteNav } from '../components/ui/SiteNav';
import { S1_TheQuestion } from '../components/sections/S1_TheQuestion';
import { S2_BaseModel } from '../components/sections/S2_BaseModel';
import { S3_ConcurrentAdvancement } from '../components/sections/S3_ConcurrentAdvancement';
import { S4_Stratification } from '../components/sections/S4_Stratification';
import { S5_Distribution } from '../components/sections/S5_Distribution';
import { S6_Sensitivity } from '../components/sections/S6_Sensitivity';
import { S7_Implications } from '../components/sections/S7_Implications';
import { S8_YourStory } from '../components/sections/S8_YourStory';

function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-500 border-t border-zinc-800 py-14 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 text-xs leading-relaxed">
        <div className="space-y-3">
          <p className="font-display text-xl text-zinc-200">How long would you live?</p>
          <p>
            An exponential survival model with time-varying background mortality. Every assumption is sourced
            from peer-reviewed literature or government data and carries a confidence rating. A bounding
            analysis and scenario tool, not a prediction.
          </p>
          <p>
            Personalized projections are illustrative: country multipliers and access timelines are rough proxies.
            Nothing you enter leaves your browser.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-zinc-400 font-medium">Key sources</p>
          <p>
            CDC NVSS 2024 · GBD 2019 · López-Otín et al., <em>Cell</em> 2023 · Macip et al., <em>Cellular Reprogramming</em> 2024 ·
            de Grey, <em>Ending Aging</em> 2007 · Chetty et al., <em>JAMA</em> 2016 · Peltzman, <em>JPE</em> 1975 · Williams,{' '}
            <em>Problems of the Self</em> 1973 · Amodei, <em>Machines of Loving Grace</em> 2024.
          </p>
          <p>
            <Link href="/escape-velocity" className="text-emerald-400 hover:text-emerald-300 transition-colors">Read the scenario: Escape Velocity →</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const model = useModelState();
  return (
    <ModelContext.Provider value={model}>
      <SiteNav />
      <main>
        <S1_TheQuestion />
        <S2_BaseModel />
        <S3_ConcurrentAdvancement />
        <S4_Stratification />
        <S5_Distribution />
        <S6_Sensitivity />
        <S7_Implications />
        <S8_YourStory />
      </main>
      <Footer />
    </ModelContext.Provider>
  );
}
