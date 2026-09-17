import { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, Circle, Clock, Play, Target, Zap, Flame, Monitor } from 'lucide-react';
import type { LearningPath, PathNode } from '../../types/learningPath';
import type { ScenarioAttempt } from '../../types/scenario';
import type { TerminalAttempt } from '../../types/terminal';
import { ALL_LEARNING_PATHS } from '../../data/learningPaths';
import { computeNodeStatus, computePathProgress } from '../../utils/pathProgress';

interface Props {
  visitedByDomain: Record<string, Set<string>>;
  scenarioAttempts: ScenarioAttempt[];
  terminalAttempts: TerminalAttempt[];
  streak: number;
  onOpenNode: (path: LearningPath, node: PathNode) => void;
  onExit: () => void;
}

const ACCENT_MAP: Record<string, { text: string; border: string; bg: string; strong: string }> = {
  violet:  { text: 'text-violet-300',  border: 'border-violet-500/30',  bg: 'bg-violet-500/5',   strong: 'bg-violet-500/25' },
  sky:     { text: 'text-sky-300',     border: 'border-sky-500/30',     bg: 'bg-sky-500/5',      strong: 'bg-sky-500/25' },
  orange:  { text: 'text-orange-300',  border: 'border-orange-500/30',  bg: 'bg-orange-500/5',   strong: 'bg-orange-500/25' },
  emerald: { text: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5',  strong: 'bg-emerald-500/25' },
  amber:   { text: 'text-amber-300',   border: 'border-amber-500/30',   bg: 'bg-amber-500/5',    strong: 'bg-amber-500/25' },
  rose:    { text: 'text-rose-300',    border: 'border-rose-500/30',    bg: 'bg-rose-500/5',     strong: 'bg-rose-500/25' },
  teal:    { text: 'text-teal-300',    border: 'border-teal-500/30',    bg: 'bg-teal-500/5',     strong: 'bg-teal-500/25' },
  cyan:    { text: 'text-cyan-300',    border: 'border-cyan-500/30',    bg: 'bg-cyan-500/5',     strong: 'bg-cyan-500/25' },
};

export default function LearningPathView({
  visitedByDomain, scenarioAttempts, terminalAttempts, streak, onOpenNode, onExit,
}: Props) {
  const [selectedPathId, setSelectedPathId] = useState<string>(ALL_LEARNING_PATHS[0].id);

  const selectedPath = useMemo(
    () => ALL_LEARNING_PATHS.find(p => p.id === selectedPathId) ?? ALL_LEARNING_PATHS[0],
    [selectedPathId]
  );

  const ctx = useMemo(() => ({
    visitedTabs: visitedByDomain[selectedPath.domain] ?? new Set<string>(),
    scenarioAttempts,
    terminalAttempts,
  }), [visitedByDomain, selectedPath.domain, scenarioAttempts, terminalAttempts]);

  const progress = useMemo(
    () => computePathProgress(selectedPath, ctx),
    [selectedPath, ctx]
  );

  const accent = ACCENT_MAP[selectedPath.colorAccent] ?? ACCENT_MAP['violet'];

  const globalStats = useMemo(() => {
    let totalNodes = 0, doneNodes = 0;
    for (const path of ALL_LEARNING_PATHS) {
      const c = { visitedTabs: visitedByDomain[path.domain] ?? new Set<string>(), scenarioAttempts, terminalAttempts };
      const p = computePathProgress(path, c);
      totalNodes += p.totalNodes;
      doneNodes += p.doneNodes;
    }
    return { totalNodes, doneNodes, pct: totalNodes > 0 ? Math.round((doneNodes / totalNodes) * 100) : 0 };
  }, [visitedByDomain, scenarioAttempts, terminalAttempts]);

  return (
    <div className="space-y-6">
      <button onClick={onExit}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 font-mono">
        ← Voltar
      </button>

      {/* Hero + global stats */}
      <section className="border card-glass card-glass-hover card-glass-violet p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 via-cyan-400/40 to-transparent" />
        <div className="flex items-start gap-4">
          <div><Target size={40} className="text-violet-400" /></div>
          <div className="flex-1">
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-1 font-mono">Learning Path</div>
            <h1 className="text-xl font-bold text-white font-display">O teu percurso de aprendizagem</h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl">
              Escolhe um path para veres onde estás, o que já dominas, e qual é o próximo passo recomendado.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-white font-mono">{globalStats.doneNodes}/{globalStats.totalNodes}</div>
            <div className="text-2xs text-slate-400 uppercase mt-1 font-mono">Módulos concluídos</div>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-white font-mono">{globalStats.pct}%</div>
            <div className="text-2xs text-slate-400 uppercase mt-1 font-mono">Total geral</div>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-black text-white font-mono flex items-center gap-1">
              <Flame size={14} className="inline text-amber-400" /> {streak}
            </div>
            <div className="text-2xs text-slate-400 uppercase mt-1 font-mono">Dias de streak</div>
          </div>
        </div>
      </section>

      {/* Path selector */}
      <section>
        <div className="text-2xs font-black text-slate-500 uppercase tracking-widest mb-3 font-mono">Escolhe um percurso</div>
        <div className="flex flex-wrap gap-2">
          {ALL_LEARNING_PATHS.map(p => {
            const a = ACCENT_MAP[p.colorAccent] ?? ACCENT_MAP['violet'];
            const c = { visitedTabs: visitedByDomain[p.domain] ?? new Set<string>(), scenarioAttempts, terminalAttempts };
            const pathProgress = computePathProgress(p, c);
            const isSel = p.id === selectedPathId;
            return (
              <button key={p.id} onClick={() => setSelectedPathId(p.id)}
                className={`flex items-center gap-2 px-4 py-2 border text-sm font-semibold transition-all ${
                  isSel ? `${a.border} ${a.bg} ${a.text}` : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}>
                <span>{p.icon}</span>
                <span>{p.title.split('·')[0].trim()}</span>
                <span className="text-2xs text-slate-500 font-mono">· {pathProgress.percentage}%</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected path detail */}
      <section className={`border ${accent.border} ${accent.bg} p-6`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{selectedPath.icon}</div>
            <div>
              <h2 className={`text-base font-bold ${accent.text} font-display`}>{selectedPath.title}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{selectedPath.subtitle}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Target size={11} /> {selectedPath.goal} · <Clock size={11} /> ~{selectedPath.totalHours}h
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold ${accent.text} font-mono`}>{progress.doneNodes} de {progress.totalNodes} módulos</span>
            <span className="text-slate-400 font-mono">{progress.percentage}%</span>
          </div>
          <div className="h-2 bg-slate-900 overflow-hidden">
            <div className={`h-full ${accent.strong} transition-all duration-500`} style={{ width: `${progress.percentage}%` }} />
          </div>
          <div className="flex items-center gap-3 text-2xs text-slate-500 font-mono">
            <span>✓ {progress.doneNodes} feito</span>
            <span>◐ {progress.inProgressNodes} em curso</span>
            <span>○ {progress.todoNodes} por fazer</span>
          </div>
        </div>

        {/* Next recommended */}
        {progress.nextRecommendedNode && (
          <button
            onClick={() => onOpenNode(selectedPath, progress.nextRecommendedNode!)}
            className={`mt-4 w-full flex items-center gap-3 p-4 border ${accent.border} bg-[#181926]/50 hover:bg-slate-900 transition-all group`}
          >
            <Zap size={18} className={accent.text} />
            <div className="flex-1 text-left">
              <div className="text-2xs font-black text-slate-400 uppercase tracking-widest font-mono">Próximo passo</div>
              <div className="text-sm font-semibold text-white mt-0.5 font-display">
                {progress.nextRecommendedNode.icon} {progress.nextRecommendedNode.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                {progress.nextRecommendedNode.subtitle} · ~{Math.round(progress.nextRecommendedNode.estimatedMin / 60)}h
              </div>
            </div>
            <ArrowRight size={16} className={`${accent.text} group-hover:translate-x-1 transition-transform`} />
          </button>
        )}
      </section>

      {/* Timeline of nodes */}
      <section>
        <div className="text-2xs font-black text-slate-500 uppercase tracking-widest mb-3 font-mono">Percurso completo</div>
        <div className="space-y-2">
          {selectedPath.nodes.map((node, i) => {
            const status = computeNodeStatus(node, ctx);
            const isLast = i === selectedPath.nodes.length - 1;
            const isNext = progress.nextRecommendedNode?.id === node.id;

            return (
              <div key={node.id} className="relative">
                {/* Line connector */}
                {!isLast && (
                  <div className={`absolute left-[27px] top-14 w-[2px] h-full ${status === 'done' ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />
                )}

                <button
                  onClick={() => onOpenNode(selectedPath, node)}
                  className={`w-full flex items-start gap-4 p-4 border transition-all text-left ${
                    isNext ? `${accent.border} ${accent.bg}` :
                    status === 'done' ? 'border-emerald-500/25 bg-emerald-500/5' :
                    status === 'in-progress' ? 'border-amber-500/25 bg-amber-500/5' :
                    'border-slate-800 bg-[#181926]/50 hover:border-slate-700'
                  }`}
                >
                  {/* Status indicator */}
                  <div className={`shrink-0 w-14 h-14 border-2 flex items-center justify-center text-xl relative z-10 ${
                    status === 'done' ? 'border-emerald-500/50 bg-emerald-500/15' :
                    status === 'in-progress' ? 'border-amber-500/50 bg-amber-500/15' :
                    'border-slate-800 bg-slate-900'
                  }`}>
                    {status === 'done' ? <CheckCircle2 size={24} className="text-emerald-400" /> :
                     status === 'in-progress' ? <Play size={22} className="text-amber-400" fill="currentColor" /> :
                     <span className="text-2xl">{node.icon}</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs font-black text-slate-500 uppercase font-mono">Passo {i+1}</span>
                      {isNext && <span className={`text-2xs font-black ${accent.text} uppercase px-1.5 py-0.5 ${accent.bg} font-mono`}>Próximo</span>}
                      {status === 'done' && <span className="text-2xs font-black text-emerald-300 uppercase font-mono">✓ Concluído</span>}
                      {status === 'in-progress' && <span className="text-2xs font-black text-amber-300 uppercase font-mono">◐ Em curso</span>}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 font-display">{node.icon} {node.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
                    <div className="mt-2 flex items-center gap-3 text-2xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1"><Clock size={10} /> ~{Math.round(node.estimatedMin / 60)}h</span>
                      {node.scenarioIds && node.scenarioIds.length > 0 && (
                        <span><Target size={10} className="inline mr-0.5" /> {node.scenarioIds.length} cenário</span>
                      )}
                      {node.terminalSessionIds && node.terminalSessionIds.length > 0 && (
                        <span><Monitor size={10} className="inline mr-0.5" /> {node.terminalSessionIds.length} terminal</span>
                      )}
                    </div>
                  </div>

                  {status !== 'done' && (
                    <ArrowRight size={14} className="shrink-0 text-slate-500 mt-2" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
