import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, LucideIcon } from 'lucide-react';

type CardTone = 'amber' | 'sky' | 'emerald' | 'violet' | 'rose' | 'fuchsia' | 'teal' | 'slate';

const toneStyles: Record<CardTone, { border: string; bg: string; text: string }> = {
  amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-200' },
  sky: { border: 'border-sky-500/20', bg: 'bg-sky-500/10', text: 'text-sky-200' },
  emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-200' },
  violet: { border: 'border-violet-500/20', bg: 'bg-violet-500/10', text: 'text-violet-200' },
  rose: { border: 'border-rose-500/20', bg: 'bg-rose-500/10', text: 'text-rose-200' },
  fuchsia: { border: 'border-fuchsia-500/20', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-200' },
  teal: { border: 'border-teal-500/20', bg: 'bg-teal-500/10', text: 'text-teal-200' },
  slate: { border: 'border-slate-700', bg: 'bg-slate-900', text: 'text-slate-200' },
};

export function StatusCard({
  title,
  description,
  tone = 'sky',
  icon: IconComponent,
}: {
  title: string;
  description: string;
  tone?: CardTone;
  icon?: LucideIcon;
}) {
  const styles = toneStyles[tone];
  const Icon = IconComponent || AlertTriangle;

  return (
    <div className={`rounded-2xl border p-4 ${styles.border} ${styles.bg}`}>
      <div className="flex items-start gap-3">
        <Icon size={16} className={`mt-0.5 ${styles.text}`} />
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${styles.text}`}>
            {title}
          </p>
          <p className="mt-1 text-base text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RuleCard({
  icon: IconComponent,
  title,
  description,
  tone = 'fuchsia',
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: CardTone;
}) {
  const styles = toneStyles[tone];

  return (
    <div className={`rounded-2xl border p-4 ${styles.border} ${styles.bg}`}>
      <div className="flex items-start gap-3">
        <IconComponent size={18} className={`mt-0.5 shrink-0 ${styles.text}`} />
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${styles.text}`}>{title}</p>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function SelectButton({
  active,
  onClick,
  icon: IconComponent,
  title,
  description,
  tone = 'sky',
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: CardTone;
}) {
  const styles = toneStyles[tone];

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active ? `${styles.border} ${styles.bg}` : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#181926] text-slate-300">
          <IconComponent size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-md font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </button>
  );
}
