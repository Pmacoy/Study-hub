import { useEffect, useRef, useState, ReactNode } from 'react';

const TONE_COLORS: Record<string, string> = {
  sky:     'border-sky-500/20 text-sky-300',
  emerald: 'border-emerald-500/20 text-emerald-300',
  violet:  'border-violet-500/20 text-violet-300',
  amber:   'border-amber-500/20 text-amber-300',
  orange:  'border-orange-500/20 text-orange-300',
  rose:    'border-rose-500/20 text-rose-300',
};

const TONE_GLOW: Record<string, string> = {
  sky:     'hover:shadow-[0_0_16px_rgba(116,199,236,0.15)]',
  emerald: 'hover:shadow-[0_0_16px_rgba(166,227,161,0.15)]',
  violet:  'hover:shadow-[0_0_16px_rgba(203,166,247,0.15)]',
  amber:   'hover:shadow-[0_0_16px_rgba(249,226,175,0.15)]',
  orange:  'hover:shadow-[0_0_16px_rgba(250,179,135,0.15)]',
  rose:    'hover:shadow-[0_0_16px_rgba(235,160,172,0.15)]',
};

function AnimatedValue({ value, suffix = '' }: { value: string; suffix?: string }) {
  const numMatch = value.match(/(\d+)/);
  const target = numMatch ? parseInt(numMatch[1], 10) : 0;
  const matchStr = numMatch?.[1] ?? '';
  const prefix = value.slice(0, value.indexOf(matchStr));
  const nonNumSuffix = value.slice(value.indexOf(matchStr) + matchStr.length);
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target]);

  return <span>{prefix}{display}{nonNumSuffix}{suffix}</span>;
}

export default function QuickStat({
  icon, label, value, tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: keyof typeof TONE_COLORS;
}) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS['violet'];
  const glow = TONE_GLOW[tone] ?? TONE_GLOW['violet'];
  const hasNumber = /\d/.test(value);
  return (
    <div
      className={`border card-glass card-glass-hover p-4 transition-all ${colors} ${glow}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-2xs font-semibold uppercase tracking-widest text-slate-500 font-mono">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black text-white font-mono">
        {hasNumber ? <AnimatedValue value={value} /> : value}
      </div>
    </div>
  );
}
