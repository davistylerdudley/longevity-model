// Minimalist animated backdrop for the hero: a fan of survival curves, each
// decaying at a different rate (the visual heart of the whole model), drawn in
// on load and drifting slowly. Purely decorative and non-interactive.

const W = 1200;
const H = 600;

function survivalPath(k: number, yTop: number, yBottom: number, steps = 64): string {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = yTop + (yBottom - yTop) * (1 - Math.exp((-k * x) / W));
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

// Fan of curves: shared origin near top-left, fanning out with rising decay.
const CURVES = [
  { k: 1.1, color: '#60a5fa', opacity: 0.22, width: 1.6, delay: 0.1 },
  { k: 1.8, color: '#3b82f6', opacity: 0.18, width: 1.4, delay: 0.35 },
  { k: 2.8, color: '#3b82f6', opacity: 0.15, width: 1.3, delay: 0.6 },
  { k: 4.4, color: '#2563eb', opacity: 0.13, width: 1.2, delay: 0.85 },
  { k: 7.0, color: '#1d4ed8', opacity: 0.11, width: 1.1, delay: 1.1 },
];

const DOTS = Array.from({ length: 46 }, (_, i) => ({
  cx: 60 + ((i * 137) % (W - 120)),
  cy: 40 + ((i * 89) % (H - 80)),
  r: (i % 3 === 0 ? 1.6 : 1.1),
  delay: (i % 9) * 0.7,
}));

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="heroGlow" cx="18%" cy="12%" r="85%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#0b1220" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#heroGlow)" />

        {/* faint drifting dot grid */}
        <g className="hero-drift">
          {DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill="#93c5fd"
              className="hero-dot"
              style={{ opacity: 0.14, animationDelay: `${d.delay}s` }}
            />
          ))}
        </g>

        {/* fanning survival curves */}
        <g className="hero-drift" style={{ animationDirection: 'reverse' }}>
          {CURVES.map((c, i) => (
            <path
              key={i}
              d={survivalPath(c.k, 70, 560)}
              fill="none"
              stroke={c.color}
              strokeWidth={c.width}
              strokeOpacity={c.opacity}
              pathLength={1}
              className="hero-curve"
              style={{ animationDelay: `${c.delay}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
