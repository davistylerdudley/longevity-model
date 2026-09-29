'use client';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  unit?: string;
}

export function Slider({ label, value, min, max, step, format, onChange, unit }: Props) {
  const display = format ? format(value) : value.toString();
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-zinc-700">{label}</label>
        <span className="text-sm font-mono text-zinc-900">
          {display}
          {unit && <span className="text-zinc-400 ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{format ? format(min) : min}{unit}</span>
        <span>{format ? format(max) : max}{unit}</span>
      </div>
    </div>
  );
}
