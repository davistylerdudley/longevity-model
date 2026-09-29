'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MORTALITY_COMPONENTS } from '../../lib/constants';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

const CONFIDENCE_OPACITY: Record<string, number> = {
  high: 1,
  medium: 0.8,
  low: 0.55,
  speculative: 0.4,
};

export function MortalityDecompositionChart() {
  const data = MORTALITY_COMPONENTS.map((c) => ({
    name: c.label,
    rate: parseFloat(c.rate.toFixed(1)),
    confidence: c.confidence,
    pct: `${((c.rate / MORTALITY_COMPONENTS.reduce((s, x) => s + x.rate, 0)) * 100).toFixed(0)}%`,
  }));

  const total = MORTALITY_COMPONENTS.reduce((s, c) => s + c.rate, 0);

  return (
    <div>
      <p className="text-xs text-zinc-500 mb-4">
        Total background mortality: <span className="font-mono text-zinc-900">{total.toFixed(1)}</span> deaths per 100,000/year ≈{' '}
        <span className="font-mono text-zinc-900">{(total / 100000 * 100).toFixed(3)}%/year</span>
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 60, bottom: 28, left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
          <XAxis
            type="number"
            height={48}
            tickMargin={8}
            tick={{ fontSize: 11, fill: '#71717a' }}
            label={{ value: 'Deaths per 100,000 people per year', position: 'insideBottom', offset: 0, fontSize: 12, fill: '#52525b' }}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={95}
            tick={{ fontSize: 12, fill: '#3f3f46' }}
          />
          <Tooltip
            formatter={(value, _name, entry) => [
              `${typeof value === 'number' ? value : 0}/100k/yr (${entry.payload.pct})`,
              entry.payload.confidence.toUpperCase() + ' confidence',
            ]}
            contentStyle={{ fontSize: 12, borderColor: '#e4e4e7', borderRadius: 6 }}
          />
          <Bar dataKey="rate" radius={[0, 3, 3, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={CONFIDENCE_OPACITY[entry.confidence]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-400 mt-2">
        Bar opacity reflects confidence level: solid = HIGH, 80% = MEDIUM, 55% = LOW.
      </p>
    </div>
  );
}
