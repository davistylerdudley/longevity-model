'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { StratificationResult } from '../../lib/types';
import { QUINTILE_COLORS } from '../../lib/constants';

interface Props {
  results: StratificationResult[];
  tMax?: number;
}

function mergeStratification(results: StratificationResult[], tMax: number) {
  const byT: Record<number, Record<string, number>> = {};
  results.forEach((r) => {
    r.survivalCurve
      .filter((pt) => pt.t <= tMax)
      .forEach((pt) => {
        const t = Math.round(pt.t);
        if (!byT[t]) byT[t] = { t };
        byT[t][r.label] = pt.S;
      });
  });
  return Object.values(byT).sort((a, b) => a.t - b.t);
}

function axisTicks(max: number): number[] {
  const step = max <= 120 ? 20 : max <= 320 ? 50 : 100;
  const out: number[] = [];
  for (let t = 0; t <= max; t += step) out.push(t);
  return out;
}

export function StratificationChart({ results, tMax = 200 }: Props) {
  const data = mergeStratification(results, tMax);
  const xTicks = axisTicks(tMax);

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 28, bottom: 28, left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis
            dataKey="t"
            type="number"
            domain={[0, tMax]}
            ticks={xTicks}
            interval={0}
            allowDecimals={false}
            height={48}
            tickMargin={8}
            tick={{ fontSize: 11, fill: '#71717a' }}
            label={{ value: 'Years from now', position: 'insideBottom', offset: 0, fontSize: 12, fill: '#52525b' }}
          />
          <YAxis
            domain={[0, 1]}
            width={64}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 11, fill: '#71717a' }}
            label={{ value: 'Share still alive', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: '#52525b' } }}
          />
          <Tooltip
            formatter={(value, name) => [`${(typeof value === 'number' ? value * 100 : 0).toFixed(1)}%`, String(name)]}
            labelFormatter={(t) => `Year ${t}`}
            contentStyle={{ fontSize: 12, borderColor: '#e4e4e7', borderRadius: 6 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {results.map((r, i) => (
            <Line
              key={r.quintile}
              type="monotone"
              dataKey={r.label}
              stroke={QUINTILE_COLORS[i % QUINTILE_COLORS.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-5 grid grid-cols-5 gap-2 text-center text-xs">
        {results.map((r, i) => (
          <div key={r.quintile} className="space-y-1">
            <div
              className="h-1 rounded-full mx-auto"
              style={{ backgroundColor: QUINTILE_COLORS[i], width: '50%' }}
            />
            <div className="text-zinc-700 font-medium">{r.label.split(' ')[0]}</div>
            <div className="text-zinc-500">
              {r.accessDelayYears === 0
                ? 'gets it first'
                : `waits ${Math.round(r.accessDelayYears)}y`}
            </div>
            <div className="text-zinc-800 font-mono">
              {isFinite(r.asymptote) ? `${(r.asymptote * 100).toFixed(0)}% forever` : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
