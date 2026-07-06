import type { ReactNode } from 'react';

type QuickStatTone = 'sky' | 'emerald' | 'amber' | 'rose';

const toneStyles: Record<QuickStatTone, string> = {
  sky: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  rose: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
};

export default function QuickStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: QuickStatTone;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${toneStyles[tone]}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-[15px] font-semibold text-white">
        {value}
      </p>
    </div>
  );
}