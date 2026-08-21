import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Play, Github, ExternalLink, Trophy, Filter, X } from 'lucide-react';
import type { ProjectItem, ProjectStatus } from '../../types/project';
import { ALL_PROJECTS, projectsBySection } from '../../data/projects';
import { PROJECT_SECTIONS } from '../../data/projectSections';
import { useProjectProgress } from '../../hooks/useProjectProgress';
import { useLang } from '../../i18n/LangContext';

interface Props {
  onExit: () => void;
}

const DIFF_META: Record<string, { label: string; cls: string }> = {
  foundations:  { label: 'Foundations',  cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25' },
  intermediate: { label: 'Intermédio',   cls: 'text-sky-300 bg-sky-500/10 border-sky-500/25' },
  advanced:     { label: 'Avançado',     cls: 'text-amber-300 bg-amber-500/10 border-amber-500/25' },
  expert:       { label: 'Expert',       cls: 'text-rose-300 bg-rose-500/10 border-rose-500/25' },
};

export default function ProjectsView({ onExit }: Props) {
  const { t } = useLang();
  const { setStatus, setRepoUrl, getEntry, stats } = useProjectProgress();
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [repoInput, setRepoInput] = useState('');

  const s = stats();

  const visibleProjects = useMemo(() => {
    if (activeSectionId === 'all') return ALL_PROJECTS;
    return projectsBySection(activeSectionId);
  }, [activeSectionId]);

  const openProject = (p: ProjectItem) => {
    setSelectedProject(p);
    setRepoInput(getEntry(p.id)?.repoUrl ?? '');
  };

  const cycleStatus = (id: string, current: ProjectStatus | undefined) => {
    const next: ProjectStatus =
      current === undefined || current === 'not-started' ? 'in-progress' :
      current === 'in-progress' ? 'done' : 'not-started';
    setStatus(id, next);
  };

  return (
    <div className="space-y-6">
      <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 to-slate-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚀</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{t('proj.eyebrow')}</div>
            <h1 className="text-2xl font-bold text-white">{t('proj.title')}</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              "Don't just watch. Build projects. Break things and fix them." Projectos reais, production-grade,
              organizados dos fundamentos ao DevSecOps com AI. Marca o teu progresso e guarda o link do repo.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-black text-white">{s.done}/50</div>
            <div className="text-[9px] text-slate-500 uppercase mt-1">{t('proj.completed')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-black text-white">{s.inProgress}</div>
            <div className="text-[9px] text-slate-500 uppercase mt-1">{t('common.inProgress')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-black text-white">{Math.round((s.done / 50) * 100)}%</div>
            <div className="text-[9px] text-slate-500 uppercase mt-1">{t('proj.portfolio')}</div>
          </div>
        </div>
      </section>

      {/* Section filter */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} className="text-slate-500" />
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('proj.filterSection')}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveSectionId('all')}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${activeSectionId === 'all' ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
            {t('common.all')} (50)
          </button>
          {PROJECT_SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActiveSectionId(sec.id)}
              className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${activeSectionId === sec.id ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
              {sec.emoji} {sec.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </section>

      {/* Section outcome banner (when a specific section is selected) */}
      {activeSectionId !== 'all' && (() => {
        const sec = PROJECT_SECTIONS.find(x => x.id === activeSectionId);
        if (!sec) return null;
        return (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-[13px] font-bold text-white mb-1">{sec.emoji} {sec.title}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="text-slate-500 font-semibold">{t('proj.afterThese')} </span>{sec.outcome}
            </p>
          </div>
        );
      })()}

      {/* Project grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleProjects.map(p => {
          const entry = getEntry(p.id);
          const status = entry?.status ?? 'not-started';
          const diff = DIFF_META[p.difficulty];
          return (
            <div key={p.id}
              className={`rounded-2xl border p-4 transition-all ${
                status === 'done' ? 'border-emerald-500/25 bg-emerald-500/5' :
                status === 'in-progress' ? 'border-amber-500/25 bg-amber-500/5' :
                'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}>
              <div className="flex items-start gap-3">
                <button onClick={() => cycleStatus(p.id, status)}
                  className="shrink-0 mt-0.5" title="Clica para mudar o estado">
                  {status === 'done' ? <CheckCircle2 size={20} className="text-emerald-400" /> :
                   status === 'in-progress' ? <Play size={18} className="text-amber-400" fill="currentColor" /> :
                   <Circle size={20} className="text-slate-600" />}
                </button>
                <div className="flex-1 min-w-0">
                  <button onClick={() => openProject(p)} className="text-left w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-slate-500">#{p.number}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${diff.cls}`}>{t(`proj.difficulty.${p.difficulty}` as any)}</span>
                    </div>
                    <h3 className="text-[13px] font-bold text-white mt-1 leading-snug">{p.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.whatYouBuild}</p>
                  </button>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.stack.slice(0, 4).map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{t}</span>
                    ))}
                  </div>
                  {entry?.repoUrl && (
                    <a href={entry.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] text-orange-300 hover:text-orange-200">
                      <Github size={11} /> repo <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Project detail modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}>
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-500">Projecto #{selectedProject.number}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${DIFF_META[selectedProject.difficulty].cls}`}>
                    {t(`proj.difficulty.${selectedProject.difficulty}` as any)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedProject.title}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-500 hover:text-slate-300">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{t('proj.whatYouBuild')}</div>
                <p className="text-[13px] text-slate-300 leading-relaxed">{selectedProject.whatYouBuild}</p>
              </div>

              <div>
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">{t('proj.concepts')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.concepts.map(c => (
                    <span key={c} className="text-[11px] px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200">{c}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('proj.stack')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.stack.map(t => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">{t}</span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-violet-500/5 border border-violet-500/20">
                <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('proj.whyMatters')}</div>
                <p className="text-[12px] text-violet-100 leading-relaxed italic">{selectedProject.whyItMatters}</p>
              </div>

              {/* Status control */}
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('proj.status')}</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['not-started', 'in-progress', 'done'] as ProjectStatus[]).map(st => {
                    const cur = getEntry(selectedProject.id)?.status ?? 'not-started';
                    const labels = { 'not-started': 'Por fazer', 'in-progress': 'Em curso', 'done': 'Concluído' };
                    return (
                      <button key={st} onClick={() => setStatus(selectedProject.id, st)}
                        className={`py-2 rounded-xl border text-[11px] font-semibold transition-all ${
                          cur === st
                            ? st === 'done' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                              : st === 'in-progress' ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                              : 'border-slate-600 bg-slate-800 text-slate-300'
                            : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700'
                        }`}>
                        {labels[st]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Repo URL */}
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('proj.repoLink')}</div>
                <div className="flex gap-2">
                  <input
                    value={repoInput}
                    onChange={e => setRepoInput(e.target.value)}
                    placeholder="https://github.com/user/projecto"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-200 placeholder-slate-600 focus:border-orange-500/40 focus:outline-none"
                  />
                  <button onClick={() => { setRepoUrl(selectedProject.id, repoInput); }}
                    className="px-3 py-2 rounded-xl border border-orange-500/40 bg-orange-500/10 text-orange-300 text-[12px] font-semibold hover:bg-orange-500/20">
                    Guardar
                  </button>
                </div>
                {getEntry(selectedProject.id)?.repoUrl && (
                  <a href={getEntry(selectedProject.id)!.repoUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-orange-300 hover:text-orange-200">
                    <Github size={12} /> {t('proj.openRepo')} <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion celebration */}
      {s.done === 50 && (
        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
          <Trophy size={32} className="text-emerald-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-emerald-300">{t('proj.allDone')}</h3>
          <p className="text-[12px] text-slate-400 mt-1">{t('proj.allDoneDesc')}</p>
        </div>
      )}
    </div>
  );
}
