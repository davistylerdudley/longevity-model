'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_DATA,
  SPARK_DATA,
  TYPICAL_DATA,
  readoutForYear,
  START_YEAR,
  END_YEAR,
  LEV_YEAR,
  BRANCH_EPILOGUE,
  type Branch,
} from '../../lib/scenario';

function fmtCost(cost: number | null): string {
  if (cost === null) return 'not offered yet';
  if (cost >= 1_000_000) return `$${(cost / 1_000_000).toFixed(1)}M`;
  if (cost >= 1_000) return `$${Math.round(cost / 1000)}k`;
  return `$${cost}`;
}

function fmtYears(n: number): string {
  if (!isFinite(n)) return 'no fixed limit';
  return `~${Math.round(n).toLocaleString()} yrs`;
}

function fmtSpeed(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M×`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k×`;
  return `${n}×`;
}

function fmtAccess(pct: number): string {
  if (pct === 0) return 'none';
  if (pct < 1) return `${pct}%`;
  return `${Math.round(pct)}%`;
}

// Each stat re-mounts on value change (key), replaying the spring-pop.
function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div key={value} className={`scenario-pop font-mono text-sm ${accent ? 'text-emerald-300' : 'text-zinc-100'}`}>
        {value}
      </div>
    </div>
  );
}

// Hand-drawn log sparkline for research speed.
function ResearchSparkline({ year }: { year: number }) {
  const maxLog = Math.log10(SPARK_DATA[SPARK_DATA.length - 1].speed);
  const n = SPARK_DATA.length;
  const pts = SPARK_DATA.map((d, i) => {
    const x = (i / (n - 1)) * 100;
    const ly = Math.log10(Math.max(1, d.speed));
    const y = 34 - (ly / maxLog) * 30;
    return [x, y] as const;
  });
  const poly = pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  const idx = SPARK_DATA.findIndex((d) => d.year === year);
  const markerX = idx >= 0 ? pts[idx][0] : 0;
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="w-full h-9">
      <line x1={markerX} y1={0} x2={markerX} y2={36} stroke="#e11d48" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <polyline points={poly} fill="none" stroke="#60a5fa" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ScenarioChart({
  year,
  compact = false,
  branch = null,
}: {
  year: number;
  compact?: boolean;
  branch?: Branch | null;
}) {
  const r = readoutForYear(year);
  const height = compact ? 140 : 190;

  // Reveal the frontier line only up to the current year; a faint "ghost" hints
  // the rest. The typical-person line shows the access gap building; before the
  // fork it defaults to the unequal (locked) path, faintly.
  const activeIdx = CHART_DATA.findIndex((d) => d.year === year);
  const displayBranch: Branch = branch ?? 'locked';
  const data = CHART_DATA.map((d, i) => ({
    year: d.year,
    ghost: d.asymptote,
    revealed: i <= activeIdx ? d.asymptote : null,
    typical: i <= activeIdx ? TYPICAL_DATA[i][displayBranch] : null,
  }));
  const leadY = activeIdx >= 0 ? CHART_DATA[activeIdx].asymptote : 0;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur p-4">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">State of play</span>
        <span key={year} className="scenario-pop font-mono text-lg text-white tabular-nums">{year}</span>
      </div>

      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
        One person&rsquo;s chance of never dying of aging
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 6, right: 10, bottom: 2, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <ReferenceArea x1={START_YEAR} x2={2026.5} fill="#3f3f46" fillOpacity={0.25} />
          <XAxis
            dataKey="year"
            type="number"
            domain={[START_YEAR, END_YEAR]}
            ticks={[2025, 2030, 2035, 2040, 2045]}
            tick={{ fontSize: 10, fill: '#a1a1aa' }}
            tickFormatter={(v) => `'${String(v).slice(2)}`}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tick={{ fontSize: 10, fill: '#a1a1aa' }}
            tickFormatter={(v) => `${v}%`}
          />
          <ReferenceLine
            y={50}
            stroke="#10b981"
            strokeDasharray="4 3"
            strokeOpacity={0.7}
            label={{ value: 'escape velocity', position: 'insideBottomRight', fontSize: 9, fill: '#34d399' }}
          />
          {/* Annotation: where the survival floor first lifts off zero */}
          <ReferenceLine
            x={LEV_YEAR - 4}
            stroke="#52525b"
            strokeDasharray="2 3"
            label={{ value: 'floor lifts', position: 'insideTopLeft', fontSize: 8, fill: '#71717a' }}
          />
          {/* faint full future path */}
          <Line type="monotone" dataKey="ghost" stroke="#34d399" strokeWidth={1.5} strokeOpacity={0.16} dot={false} isAnimationActive={false} />
          {/* typical-person access-gap line */}
          <Line
            type="monotone"
            dataKey="typical"
            stroke="#f59e0b"
            strokeWidth={branch ? 2 : 1.5}
            strokeOpacity={branch ? 0.9 : 0.32}
            strokeDasharray="5 3"
            dot={false}
            connectNulls={false}
            isAnimationActive
            animationDuration={650}
            animationEasing="ease-out"
          />
          {/* revealed frontier line */}
          <Line
            type="monotone"
            dataKey="revealed"
            stroke="#34d399"
            strokeWidth={2.5}
            dot={false}
            connectNulls={false}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
          <ReferenceLine x={year} stroke="#e11d48" strokeWidth={1.5} />
          <ReferenceDot x={year} y={leadY} r={3.5} fill="#34d399" stroke="#0a0a0a" strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-1 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-emerald-400" /> if you&rsquo;re first in line</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-amber-500" />
          if you&rsquo;re typical · {branch ? BRANCH_EPILOGUE[branch].label.toLowerCase() : 'choose a future at the fork'}
        </span>
      </div>

      {!compact && (
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Biomedical R&amp;D speed vs 2025</span>
            <span key={r.researchSpeed} className="scenario-pop font-mono text-xs text-blue-300">{fmtSpeed(r.researchSpeed)}</span>
          </div>
          <ResearchSparkline year={year} />
        </div>
      )}

      <div className="border-t border-zinc-800 mt-3 pt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        <Stat label="AI in the loop" value={`${r.aiSystem} · ${fmtSpeed(r.researchSpeed)}`} />
        <Stat label="Best rejuvenation" value={r.bioStatus} />
        <Stat label="Median life · first in line" value={fmtYears(r.medianLifespan)} />
        <Stat label="Escape aging · first in line" value={`${(r.asymptote * 100).toFixed(0)}%`} accent={r.asymptote >= 0.5} />
        <Stat label="Course price" value={fmtCost(r.cost)} />
        <Stat label="Reached this share of the world" value={fmtAccess(r.accessShare)} />
      </div>
    </div>
  );
}
