'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { generateDensityCurve, survivalPercentile, generateSurvivalCurve } from '../../lib/actuarialMath';

interface Props {
  p0: number;
  r: number;
  color?: string;
  tMax?: number;
  markerT?: number;        // optional "you" marker (personal median), in years
  markerLabel?: string;
  markerColor?: string;
}

export function DistributionChart({
  p0,
  r,
  color = '#2563EB',
  tMax = 300,
  markerT,
  markerLabel,
  markerColor = '#E11D48',
}: Props) {
  const density = generateDensityCurve(p0, r, tMax, 1);
  const curve = generateSurvivalCurve(p0, r, tMax, 1);

  const p50 = survivalPercentile(curve, 50);
  const p10 = survivalPercentile(curve, 10);
  const p90 = survivalPercentile(curve, 90);

  const isFinite50 = isFinite(p50);
  const maxDensity = Math.max(...density.map((d) => d.density));

  const step = tMax <= 120 ? 20 : tMax <= 320 ? 50 : 100;
  const xTicks: number[] = [];
  for (let t = 0; t <= tMax; t += step) xTicks.push(t);

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={density} margin={{ top: 8, right: 24, bottom: 28, left: 28 }}>
          <defs>
            <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => `${v}`}
            label={{ value: 'Years lived', position: 'insideBottom', offset: 0, fontSize: 12, fill: '#52525b' }}
          />
          <YAxis
            width={72}
            tick={{ fontSize: 10, fill: '#71717a' }}
            tickFormatter={(v) => `${(v * 100).toFixed(2)}%`}
            label={{ value: 'Chance of dying that year', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11, fill: '#52525b' } }}
          />
          <Tooltip
            formatter={(value) => {
              const v = typeof value === 'number' ? value : 0;
              return [`${(v * 100).toFixed(4)}%`, 'Chance of dying that year'];
            }}
            labelFormatter={(t) => `Year ${t}`}
            contentStyle={{ fontSize: 12, borderColor: '#e4e4e7', borderRadius: 6 }}
          />
          <Area
            type="monotone"
            dataKey="density"
            stroke={color}
            strokeWidth={2}
            fill="url(#densityGrad)"
            dot={false}
            isAnimationActive={false}
          />
          {isFinite50 && p50 <= tMax && (
            <ReferenceLine
              x={Math.round(p50)}
              stroke="#71717a"
              strokeDasharray="4 2"
              label={{ value: `Median: ${Math.round(p50)}y`, position: 'insideTopRight', fontSize: 11, fill: '#71717a' }}
            />
          )}
          {isFinite(p10) && p10 <= tMax && (
            <ReferenceLine
              x={Math.round(p10)}
              stroke="#d1d5db"
              strokeDasharray="3 3"
              label={{ value: `10th pct`, position: 'insideTopLeft', fontSize: 10, fill: '#9ca3af' }}
            />
          )}
          {isFinite(p90) && p90 <= tMax && (
            <ReferenceLine
              x={Math.round(p90)}
              stroke="#d1d5db"
              strokeDasharray="3 3"
              label={{ value: `90th pct`, position: 'insideTopRight', fontSize: 10, fill: '#9ca3af' }}
            />
          )}
          {markerT !== undefined && isFinite(markerT) && markerT <= tMax && (
            <ReferenceLine
              x={Math.round(markerT)}
              stroke={markerColor}
              strokeWidth={2}
              label={{
                value: markerLabel ?? 'You',
                position: 'top',
                fontSize: 11,
                fill: markerColor,
                fontWeight: 600,
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      {maxDensity < 0.0001 && (
        <p className="text-xs text-amber-600 mt-2 text-center">
          Density is very low across this time range — a large fraction of the population survives beyond {tMax} years.
        </p>
      )}
    </div>
  );
}
