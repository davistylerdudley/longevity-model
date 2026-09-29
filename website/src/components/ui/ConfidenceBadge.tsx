import type { ConfidenceLevel } from '../../lib/types';

interface Props {
  level: ConfidenceLevel;
  showLabel?: boolean;
}

const CONFIG: Record<ConfidenceLevel, { dot: string; label: string; text: string }> = {
  high: { dot: 'bg-blue-600', label: 'HIGH', text: 'text-blue-700' },
  medium: { dot: 'bg-blue-400', label: 'MEDIUM', text: 'text-blue-500' },
  low: { dot: 'bg-amber-400', label: 'LOW', text: 'text-amber-600' },
  speculative: { dot: 'bg-zinc-400', label: 'SPECULATIVE', text: 'text-zinc-500' },
};

export function ConfidenceBadge({ level, showLabel = true }: Props) {
  const { dot, label, text } = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium tracking-wide ${text}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dot}`} />
      {showLabel && label}
    </span>
  );
}
