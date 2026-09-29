'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SurvivalPoint } from '../../lib/types';

interface CurveSpec {
  data: SurvivalPoint[];
  color: string;
  label: string;
  dashed?: boolean;
  asymptote?: number;
  opacity?: number;      // 0–1; used to fade non-selected curves
  strokeWidth?: number;  // override default width to emphasize a curve
}

interface Props {
  curves: CurveSpec[];
  showAsymptote?: boolean;
  height?: number;
  xLabel?: string;
  tMax?: number;
}

function pct(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

// Clean, evenly-spaced round ticks so the x-axis reads 0, 50, 100 … rather than
// whatever fractional data values happen to fall in the series.
function axisTicks(max: number): number[] {
  const step = max <= 120 ? 20 : max <= 320 ? 50 : max <= 700 ? 100 : 200;
  const out: number[] = [];
  for (let t = 0; t <= max; t += step) out.push(t);
  return out;
}

// Merge curves into a single dataset indexed by t
function mergeCurves(curves: CurveSpec[]): Record<number, Record<string, number>> {
  const map: Record<number, Record<string, number>> = {};
  curves.forEach((c) => {
    c.data.forEach((pt) => {
      if (!map[pt.t]) map[pt.t] = { t: pt.t };
      map[pt.t][c.label] = pt.S;
    });
  });
  return map;
}

export function SurvivalCurveChart({ curves, showAsymptote = true, height = 320, xLabel = 'Years from now', tMax }: Props) {
  const merged = Object.values(mergeCurves(curves))
    .filter((d) => !tMax || d.t <= tMax)
    .sort((a, b) => a.t - b.t);

  const xMax = tMax ?? Math.max(...merged.map((d) => d.t as number), 0);
  const xTicks = axisTicks(xMax);

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={merged} margin={{ top: 8, right: 28, bottom: 28, left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis
            dataKey="t"
            type="number"
            domain={[0, xMax]}
            ticks={xTicks}
            interval={0}
            allowDecimals={false}
            height={48}
            tickMargin={8}
            label={{ value: xLabel, position: 'insideBottom', offset: 0, fontSize: 12, fill: '#52525b' }}
            tick={{ fontSize: 11, fill: '#71717a' }}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            domain={[0, 1]}
            width={64}
            tickFormatter={pct}
            tick={{ fontSize: 11, fill: '#71717a' }}
            label={{ value: 'Share still alive', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: '#52525b' } }}
          />
          <Tooltip
            formatter={(value, name) => [`${(typeof value === 'number' ? value * 100 : 0).toFixed(1)}%`, String(name)]}
            labelFormatter={(t) => `Year ${t}`}
            contentStyle={{ fontSize: 12, borderColor: '#e4e4e7', borderRadius: 6 }}
          />
          {curves.length > 1 && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
          {curves.map((c) => (
            <Line
              key={c.label}
              type="monotone"
              dataKey={c.label}
              stroke={c.color}
              strokeWidth={c.strokeWidth ?? 2}
              strokeOpacity={c.opacity ?? 1}
              strokeDasharray={c.dashed ? '6 3' : undefined}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          {showAsymptote &&
            curves
              .filter((c) => c.asymptote !== undefined && c.asymptote > 0.001)
              .map((c) => (
                <ReferenceLine
                  key={`asymptote-${c.label}`}
                  y={c.asymptote}
                  stroke={c.color}
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                  label={{
                    value: `${(c.asymptote! * 100).toFixed(0)}%`,
                    position: 'insideRight',
                    fontSize: 10,
                    fontWeight: 600,
                    fill: c.color,
                  }}
                />
              ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
