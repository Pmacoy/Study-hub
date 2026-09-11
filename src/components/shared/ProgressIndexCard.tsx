import { ProgressBreakdown } from '../../types/progress';
import BlockProgress from './BlockProgress';

export default function ProgressIndexCard({ breakdown }: { breakdown: ProgressBreakdown }) {
  return (
    <section className="border card-glass card-glass-hover card-glass-violet p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 via-cyan-400/40 to-transparent" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl" />

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400 font-mono mb-5 relative">
        Progresso global
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        {/* Composite score */}
        <div className="md:col-span-1">
          <div className="text-4xl font-black text-white font-mono">{breakdown.composite}%</div>
          <div className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">Score geral</div>
          <BlockProgress
            value={breakdown.composite}
            max={100}
            tone="violet"
            showPct={false}
          />
        </div>

        {/* Coverage */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-slate-500 font-mono">Cobertura</span>
          </div>
          <div className="text-2xl font-black text-violet-300 font-mono">{breakdown.coverage}%</div>
          <div className="text-2xs text-slate-600 font-mono mt-0.5">módulos estudados</div>
        </div>

        {/* Consistency */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-slate-500 font-mono">Consistência</span>
          </div>
          <div className="text-2xl font-black text-sky-300 font-mono">{breakdown.consistency}%</div>
          <div className="text-2xs text-slate-600 font-mono mt-0.5">baseado no streak</div>
        </div>

        {/* Engagement */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-slate-500 font-mono">Engajamento</span>
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">{breakdown.engagement}%</div>
          <div className="text-2xs text-slate-600 font-mono mt-0.5">taxa de acerto</div>
        </div>
      </div>
    </section>
  );
}
