'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { SensitivityEntry } from '../../lib/types';

interface Props {
  entries: SensitivityEntry[];
}

export function TornadoChart({ entries }: Props) {
  // Each parameter has one endpoint that raises the asymptote and one that
  // lowers it. Which endpoint does which varies (lower p₀ helps; lower r hurts),
  // so take the full downward and upward swing rather than assuming a direction.
  const data = entries.map((e) => {
    const down = Math.min(e.lowDelta, e.highDelta, 0);
    const up = Math.max(e.lowDelta, e.highDelta, 0);
    return {
      parameter: e.parameter,
      low: down,
      high: up,
      lowAbs: (down * 100).toFixed(1),
      highAbs: (up * 100).toFixed(1),
      baseAsymptote: (e.baseAsymptote * 100).toFixed(1),
    };
  });

  const maxAbs = Math.max(
    ...entries.map((e) => Math.max(Math.abs(e.lowDelta), Math.abs(e.highDelta)))
  );
  const domain = [-maxAbs * 1.2, maxAbs * 1.2];

  return (
    <div>
      <p className="text-xs text-zinc-500 mb-4">
        Each parameter is nudged ±50% from its base value. The bar shows how far that moves the chance of surviving indefinitely: red is the downside swing, blue the upside. A wider total bar means the model leans harder on that input.
      </p>
      <ResponsiveContainer width="100%" height={Math.max(200, entries.length * 52 + 40)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 60, bottom: 32, left: 180 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
          <XAxis
            type="number"
            domain={domain}
            height={52}
            tickMargin={8}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}pp`}
            tick={{ fontSize: 11, fill: '#71717a' }}
            label={{ value: 'Change in chance of surviving indefinitely (percentage points)', position: 'insideBottom', offset: 0, fontSize: 12, fill: '#52525b' }}
          />
          <YAxis
            dataKey="parameter"
            type="category"
            width={175}
            tick={{ fontSize: 12, fill: '#3f3f46' }}
          />
          <Tooltip
            formatter={(_value, name, entry) => {
              const isLow = name === 'low';
              const delta = isLow ? parseFloat(entry.payload.lowAbs) : parseFloat(entry.payload.highAbs);
              const sign = delta >= 0 ? '+' : '';
              return [`${sign}${delta}pp vs. base (${entry.payload.baseAsymptote}%)`, isLow ? 'Downside swing' : 'Upside swing'];
            }}
            contentStyle={{ fontSize: 12, borderColor: '#e4e4e7', borderRadius: 6 }}
          />
          <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1.5} />
          <Bar dataKey="low" stackId="a" fill="#EF4444" fillOpacity={0.75} radius={[3, 0, 0, 3]} isAnimationActive={false} />
          <Bar dataKey="high" stackId="a" fill="#2563EB" fillOpacity={0.75} radius={[0, 3, 3, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 text-xs text-zinc-500 justify-center">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2 rounded-sm bg-red-400" /> Downside swing (lowers survival)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2 rounded-sm bg-blue-600" /> Upside swing (raises survival)
        </span>
      </div>
    </div>
  );
}
