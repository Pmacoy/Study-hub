/**
 * src/components/shared/BlockProgress.tsx
 *
 * A monospace block-based progress indicator: ▓▓▓▓▓░░░░
 * Replaces standard rounded progress bars with terminal-style blocks.
 */
export type BlockProgressTone = 'violet' | 'sky' | 'emerald' | 'amber' | 'orange' | 'rose';

export default function BlockProgress({
  value,
  max = 10,
  tone = 'violet',
  showPct = true,
}: {
  value: number;
  max?: number;
  tone?: BlockProgressTone;
  showPct?: boolean;
}) {
  const filled = Math.round((value / max) * 10);
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  const blockColor: Record<string, string> = {
    violet:  'text-violet-400',
    sky:     'text-sky-400',
    emerald: 'text-emerald-400',
    amber:   'text-amber-400',
    orange:  'text-orange-400',
    rose:    'text-rose-400',
  };

  const emptyColor = 'text-slate-700';
  const blocks = [];
  for (let i = 0; i < 10; i++) {
    blocks.push(
      <span key={i} className={`${i < filled ? blockColor[tone] : emptyColor} font-mono text-[10px] leading-none`}>
        {i < filled ? '▓' : '░'}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-px font-mono">{blocks}</div>
      {showPct && (
        <span className={`text-[10px] font-mono font-semibold ${blockColor[tone]}`}>{pct}%</span>
      )}
    </div>
  );
}
