import { Flame } from 'lucide-react';

export default function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/25 bg-amber-500/10">
      <Flame size={12} className={streak > 0 ? 'text-amber-400' : 'text-slate-600'} fill={streak > 0 ? 'currentColor' : 'none'} />
      <span className="text-[11px] font-bold text-amber-300">{streak}</span>
    </div>
  );
}
