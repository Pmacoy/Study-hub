import { useEffect, useState } from 'react';
import type { BlockProgressTone } from './BlockProgress';

const CIRCUMFERENCE = 2 * Math.PI * 36; // r=36

function AnimatedRing({ percent, tone }: { percent: number; tone: BlockProgressTone }) {
  const [offset, setOffset] = useState(CIRCUMFERENCE);
  const colorMap: Record<string, string> = {
    violet:  '#a78bfa',
    sky:     '#22d3ee',
    emerald: '#34d399',
    amber:   '#fbbf24',
    orange:  '#fb923c',
    rose:    '#fb7185',
  };
  const stroke = colorMap[tone] ?? colorMap.violet;

  useEffect(() => {
    const target = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setOffset(CIRCUMFERENCE - eased * (CIRCUMFERENCE - target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [percent]);

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
      <circle
        cx="44" cy="44" r="36"
        fill="none"
        stroke="rgba(69,71,90,0.5)"
        strokeWidth="5"
      />
      <circle
        className="progress-ring-circle"
        cx="44" cy="44" r="36"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ filter: `drop-shadow(0 0 6px ${stroke}55)` }}
      />
      <text
        x="44" y="42"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="18"
        fontWeight="900"
        fontFamily="'JetBrains Mono', monospace"
      >
        {percent}%
      </text>
      <text
        x="44" y="58"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#6c7086"
        fontSize="8"
        fontWeight="600"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.08em"
      >
        DONE
      </text>
    </svg>
  );
}

export default function CircularProgressRing({
  percent,
  tone = 'violet',
  label,
  sublabel,
}: {
  percent: number;
  tone?: BlockProgressTone;
  label?: string;
  sublabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatedRing percent={percent} tone={tone} />
      {label && (
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-300 font-mono">{label}</div>
          {sublabel && <div className="text-2xs text-slate-600 font-mono">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
