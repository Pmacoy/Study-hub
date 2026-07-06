import type { ProgressBreakdown } from '../../types/progress';

const RING_SIZE = 96;
const RING_STROKE = 8;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function toneFor(value: number): { text: string; bar: string; ring: string } {
  if (value >= 70) return { text: 'text-emerald-400', bar: 'bg-emerald-500', ring: '#34d399' };
  if (value >= 40) return { text: 'text-amber-400', bar: 'bg-amber-500', ring: '#fbbf24' };
  return { text: 'text-rose-400', bar: 'bg-rose-500', ring: '#fb7185' };
}

function MetricBar({ label, value, hint }: { label: string; value: number; hint: string }) {
  const tone = toneFor(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-slate-400">{label}</span>
        <span className={`text-[11px] font-bold ${tone.text}`}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full ${tone.bar} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <p className="text-[9px] text-slate-600 mt-1">{hint}</p>
    </div>
  );
}

export default function ProgressIndexCard({ breakdown }: { breakdown: ProgressBreakdown }) {
  const tone = toneFor(breakdown.composite);
  const dashOffset = CIRCUMFERENCE * (1 - breakdown.composite / 100);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-4">Índice de Progresso</p>

      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none" stroke="#1e293b" strokeWidth={RING_STROKE} />
            <circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none"
              stroke={tone.ring} strokeWidth={RING_STROKE} strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.7s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${tone.text}`}>{breakdown.composite}</span>
            <span className="text-[8px] text-slate-600 uppercase font-bold">/ 100</span>
          </div>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-3">
          <MetricBar label="Cobertura" value={breakdown.coverage} hint="Módulos estudados em todos os domínios" />
          <MetricBar label="Consistência" value={breakdown.consistency} hint="Baseado na streak actual (máx. 14 dias)" />
          <MetricBar label="Desempenho" value={breakdown.engagement} hint="Acerto médio nas últimas sessões" />
        </div>
      </div>
    </section>
  );
}
