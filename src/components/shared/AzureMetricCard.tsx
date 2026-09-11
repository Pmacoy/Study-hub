import React from 'react';
import { CheckCircle2, AlertTriangle, LucideIcon } from 'lucide-react';

type MetricTone = 'amber' | 'sky' | 'emerald' | 'violet' | 'slate';

const toneStyles: Record<MetricTone, string> = {
  amber: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
  sky: 'border-sky-500/20 bg-sky-500/5 text-sky-200',
  emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
  violet: 'border-violet-500/20 bg-violet-500/5 text-violet-200',
  slate: 'border-slate-700 bg-slate-900 text-slate-200',
};

export function TopMetric({
  label,
  value,
  hint,
  tone = 'sky',
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: MetricTone;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${toneStyles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <p className="mt-2 text-xl font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-sm opacity-70">{hint}</p>
    </div>
  );
}

export function InfoCard({
  label,
  text,
  highlight = false,
  tone = 'slate',
}: {
  label: string;
  text: string;
  highlight?: boolean;
  tone?: MetricTone;
}) {
  const baseStyle = highlight ? 'border-amber-500/20 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50';
  return (
    <div className={`rounded-2xl border p-4 ${baseStyle}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-base text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}

export function CapabilityCard({
  title,
  active,
  icon,
}: {
  title: string;
  active: boolean;
  icon?: LucideIcon;
}) {
  const Icon = active ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`rounded-2xl border p-4 ${active ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} className={active ? 'text-emerald-300' : 'text-slate-600'} />
        <div>
          <p className={`text-md font-medium ${active ? 'text-emerald-100' : 'text-slate-300'}`}>
            {title}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {active ? 'Disponível neste modelo' : 'Não disponível neste modelo'}
          </p>
        </div>
      </div>
    </div>
  );
}
