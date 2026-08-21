import { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, Circle, Clock, Play, Target, Zap } from 'lucide-react';
import type { LearningPath, PathNode } from '../../types/learningPath';
import type { ScenarioAttempt } from '../../types/scenario';
import type { TerminalAttempt } from '../../types/terminal';
import { ALL_LEARNING_PATHS } from '../../data/learningPaths';
import { computeNodeStatus, computePathProgress } from '../../utils/pathProgress';
import { useLang } from '../../i18n/LangContext';

interface Props {
  visitedByDomain: Record<string, Set<string>>;   // { 'devops': Set(['linux', 'docker']), ... }
  scenarioAttempts: ScenarioAttempt[];
  terminalAttempts: TerminalAttempt[];
  streak: number;
  onOpenNode: (path: LearningPath, node: PathNode) => void;
  onExit: () => void;
}

const ACCENT_MAP: Record<string, { text: string; border: string; bg: string; strong: string }> = {
  violet:  { text: 'text-violet-300',  border: 'border-violet-500/30',  bg: 'bg-violet-500/10',  strong: 'bg-violet-500/25' },
  sky:     { text: 'text-sky-300',     border: 'border-sky-500/30',     bg: 'bg-sky-500/10',     strong: 'bg-sky-500/25' },
  orange:  { text: 'text-orange-300',  border: 'border-orange-500/30',  bg: 'bg-orange-500/10',  strong: 'bg-orange-500/25' },
  emerald: { text: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', strong: 'bg-emerald-500/25' },
  amber:   { text: 'text-amber-300',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   strong: 'bg-amber-500/25' },
};

export default function LearningPathView({
  visitedByDomain, scenarioAttempts, terminalAttempts, streak, onOpenNode, onExit,
}: Props) {
  const { t } = useLang();
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

  // Overview stats across ALL paths
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
        className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Hero + global stats */}
      <section className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('path.eyebrow')}</div>
            <h1 className="text-2xl font-bold text-white">{t('path.title')}</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              {t('path.intro')}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-black text-white">{globalStats.doneNodes}/{globalStats.totalNodes}</div>
            <div className="text-[9px] text-slate-500 uppercase mt-1">{t('path.modulesDone')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-black text-white">{globalStats.pct}%</div>
            <div className="text-[9px] text-slate-500 uppercase mt-1">{t('path.overall')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-black text-white flex items-center gap-1">
              🔥 {streak}
            </div>
            <div className="text-[9px] text-slate-500 uppercase mt-1">{t('path.streakDays')}</div>
          </div>
        </div>
      </section>

      {/* Path selector */}
      <section>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{t('path.pickPath')}</div>
        <div className="flex flex-wrap gap-2">
          {ALL_LEARNING_PATHS.map(p => {
            const a = ACCENT_MAP[p.colorAccent] ?? ACCENT_MAP['violet'];
            const c = { visitedTabs: visitedByDomain[p.domain] ?? new Set<string>(), scenarioAttempts, terminalAttempts };
            const pathProgress = computePathProgress(p, c);
            const isSel = p.id === selectedPathId;
            return (
              <button key={p.id} onClick={() => setSelectedPathId(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[12px] font-semibold transition-all ${
                  isSel ? `${a.border} ${a.bg} ${a.text}` : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}>
                <span>{p.icon}</span>
                <span>{p.title.split('·')[0].trim()}</span>
                <span className="text-[10px] text-slate-500">· {pathProgress.percentage}%</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected path detail */}
      <section className={`rounded-3xl border ${accent.border} ${accent.bg} p-6`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{selectedPath.icon}</div>
            <div>
              <h2 className={`text-lg font-bold ${accent.text}`}>{selectedPath.title}</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">{selectedPath.subtitle}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <Target size={11} /> {selectedPath.goal} · <Clock size={11} /> ~{selectedPath.totalHours}h
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className={`font-semibold ${accent.text}`}>{progress.doneNodes} {t('path.ofModules')} {progress.totalNodes} {t('path.modules')}</span>
            <span className="text-slate-400">{progress.percentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
            <div className={`h-full ${accent.strong} transition-all duration-500`} style={{ width: `${progress.percentage}%` }} />
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>✓ {progress.doneNodes} {t('path.doneLabel')}</span>
            <span>◐ {progress.inProgressNodes} {t('path.inProgressLabel')}</span>
            <span>○ {progress.todoNodes} {t('path.todoLabel')}</span>
          </div>
        </div>

        {/* Next recommended */}
        {progress.nextRecommendedNode && (
          <button
            onClick={() => onOpenNode(selectedPath, progress.nextRecommendedNode!)}
            className={`mt-4 w-full flex items-center gap-3 p-4 rounded-2xl border ${accent.border} bg-slate-950/50 hover:bg-slate-900 transition-all group`}
          >
            <Zap size={18} className={accent.text} />
            <div className="flex-1 text-left">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('path.nextStep')}</div>
              <div className="text-[13px] font-semibold text-white mt-0.5">
                {progress.nextRecommendedNode.emoji} {progress.nextRecommendedNode.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {progress.nextRecommendedNode.subtitle} · ~{Math.round(progress.nextRecommendedNode.estimatedMin / 60)}h
              </div>
            </div>
            <ArrowRight size={16} className={`${accent.text} group-hover:translate-x-1 transition-transform`} />
          </button>
        )}
      </section>

      {/* Timeline of nodes */}
      <section>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{t('path.fullPath')}</div>
        <div className="space-y-2">
          {selectedPath.nodes.map((node, i) => {
            const status = computeNodeStatus(node, ctx);
            const isFirst = i === 0;
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
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                    isNext ? `${accent.border} ${accent.bg}` :
                    status === 'done' ? 'border-emerald-500/25 bg-emerald-500/5' :
                    status === 'in-progress' ? 'border-amber-500/25 bg-amber-500/5' :
                    'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  {/* Status circle */}
                  <div className={`shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl relative z-10 ${
                    status === 'done' ? 'border-emerald-500/50 bg-emerald-500/15' :
                    status === 'in-progress' ? 'border-amber-500/50 bg-amber-500/15' :
                    'border-slate-800 bg-slate-900'
                  }`}>
                    {status === 'done' ? <CheckCircle2 size={24} className="text-emerald-400" /> :
                     status === 'in-progress' ? <Play size={22} className="text-amber-400" fill="currentColor" /> :
                     <span className="text-2xl">{node.emoji}</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-slate-500 uppercase">{t('path.step')} {i+1}</span>
                      {isNext && <span className={`text-[9px] font-black ${accent.text} uppercase px-1.5 py-0.5 rounded ${accent.bg}`}>{t('path.next')}</span>}
                      {status === 'done' && <span className="text-[9px] font-black text-emerald-300 uppercase">{t('path.completed')}</span>}
                      {status === 'in-progress' && <span className="text-[9px] font-black text-amber-300 uppercase">{t('path.inProgress')}</span>}
                    </div>
                    <h3 className="text-[14px] font-bold text-white mt-1">{node.emoji} {node.label}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{node.subtitle}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={10} /> ~{Math.round(node.estimatedMin / 60)}h</span>
                      {node.scenarioIds && node.scenarioIds.length > 0 && (
                        <span>🎯 {node.scenarioIds.length} {t('path.scenario')}</span>
                      )}
                      {node.terminalSessionIds && node.terminalSessionIds.length > 0 && (
                        <span>🖥️ {node.terminalSessionIds.length} {t('path.terminal')}</span>
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
