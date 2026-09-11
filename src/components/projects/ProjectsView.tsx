import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Play, Github, ExternalLink, Trophy, Filter, X, Rocket } from 'lucide-react';
import type { ProjectItem, ProjectStatus } from '../../types/project';
import { ALL_PROJECTS, projectsBySection } from '../../data/projects';
import { PROJECT_SECTIONS } from '../../data/projectSections';
import { useProjectProgress } from '../../hooks/useProjectProgress';

interface Props {
  onExit: () => void;
}

const DIFF_META: Record<string, { label: string; cls: string }> = {
  foundations:  { label: 'Fundamentos',  cls: 'text-emerald-300 border-emerald-500/25' },
  intermediate: { label: 'Intermédio',   cls: 'text-sky-300 border-sky-500/25' },
  advanced:     { label: 'Avançado',     cls: 'text-amber-300 border-amber-500/25' },
  expert:       { label: 'Expert',       cls: 'text-rose-300 border-rose-500/25' },
};

export default function ProjectsView({ onExit }: Props) {
  const { setStatus, setRepoUrl, getEntry, stats } = useProjectProgress();
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [repoInput, setRepoInput] = useState('');

  const s = stats;

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
      <button onClick={onExit} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 font-mono">
        ← Voltar
      </button>

      {/* Hero */}
      <section className="border card-glass card-glass-hover card-glass-orange p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 via-amber-400/40 to-transparent" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite' }} />
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/8 rounded-full blur-2xl" style={{ animation: 'float-reverse 12s ease-in-out infinite' }} />
        <div className="flex items-start gap-4">
          <div><Rocket size={40} className="text-orange-400" /></div>
          <div className="flex-1">
            <div className="text-2xs font-black text-orange-400 uppercase tracking-widest mb-1 font-mono">Trilha de Projectos</div>
            <h1 className="text-xl font-bold text-white font-display">50 projectos para o teu portfolio</h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl">
              "Don't just watch. Build projects. Break things and fix them." Projectos reais, production-grade,
              organizados dos fundamentos ao DevSecOps com AI. Marca o teu progresso e guarda o link do repo.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="p-3 border card-glass card-glass-hover bg-slate-900/60 border-slate-800">
            <div className="text-2xl font-black text-white font-mono">{s.done}/50</div>
            <div className="text-2xs text-slate-400 uppercase mt-1 font-mono">Concluídos</div>
          </div>
          <div className="p-3 border card-glass card-glass-hover bg-slate-900/60 border-slate-800">
            <div className="text-2xl font-black text-white font-mono">{s.inProgress}</div>
            <div className="text-2xs text-slate-400 uppercase mt-1 font-mono">Em curso</div>
          </div>
          <div className="p-3 border card-glass card-glass-hover bg-slate-900/60 border-slate-800">
            <div className="text-2xl font-black text-white font-mono">{Math.round((s.done / 50) * 100)}%</div>
            <div className="text-2xs text-slate-400 uppercase mt-1 font-mono">Portfolio</div>
          </div>
        </div>
      </section>

      {/* Section filter */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} className="text-slate-500" />
          <div className="text-2xs font-black text-slate-500 uppercase tracking-widest font-mono">Filtrar por secção</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveSectionId('all')}
            className={`px-3 py-1.5 border text-sm font-semibold transition-all ${activeSectionId === 'all' ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
            Todos (50)
          </button>
          {PROJECT_SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActiveSectionId(sec.id)}
              className={`px-3 py-1.5 border text-sm font-semibold transition-all ${activeSectionId === sec.id ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
              {sec.icon} {sec.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </section>

      {/* Section outcome banner */}
      {activeSectionId !== 'all' && (() => {
        const sec = PROJECT_SECTIONS.find(x => x.id === activeSectionId);
        if (!sec) return null;
        return (
          <div className="border border-slate-800 bg-[#181926]/50 p-4">
            <div className="text-sm font-bold text-white font-display">{sec.icon} {sec.title}</div>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              <span className="text-slate-500 font-semibold font-mono">DEPOIS DESTE PASSEI: </span>{sec.outcome}
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
              className={`border p-4 transition-all ${
                status === 'done' ? 'border-emerald-500/25 bg-emerald-500/5' :
                status === 'in-progress' ? 'border-amber-500/25 bg-amber-500/5' :
                'border-slate-800 bg-[#181926]/50 hover:border-slate-700'
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
                      <span className="text-2xs font-black text-slate-400 font-mono">#{p.number}</span>
                      <span className={`text-2xs font-bold px-1.5 py-0.5 border ${diff.cls}`}>{diff.label}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 leading-snug font-display">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.whatYouBuild}</p>
                  </button>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.stack.slice(0, 4).map(t => (
                      <span key={t} className="text-2xs px-1.5 py-0.5 bg-slate-800 text-slate-400 font-mono">{t}</span>
                    ))}
                  </div>
                  {entry?.repoUrl && (
                    <a href={entry.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-2xs text-orange-300 hover:text-orange-200 font-mono">
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
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-700 bg-[#181926] p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-400 font-mono">Projecto #{selectedProject.number}</span>
                  <span className={`text-2xs font-bold px-1.5 py-0.5 border ${DIFF_META[selectedProject.difficulty].cls}`}>
                    {DIFF_META[selectedProject.difficulty].label}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1 font-display">{selectedProject.title}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-300">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-2xs font-black text-orange-400 uppercase tracking-widest mb-1 font-mono">O que constróis</div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedProject.whatYouBuild}</p>
              </div>

              <div>
                <div className="text-2xs font-black text-sky-400 uppercase tracking-widest mb-2 font-mono">Conceitos cobertos</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.concepts.map(c => (
                    <span key={c} className="text-xs px-2 py-1 border border-sky-500/20 text-sky-200 font-mono">{c}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-2xs font-black text-slate-400 uppercase tracking-widest mb-2 font-mono">Stack</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.stack.map(t => (
                    <span key={t} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 font-mono">{t}</span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-violet-500/5 border border-violet-500/20">
                <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-1 font-mono">Porque importa</div>
                <p className="text-sm text-violet-100 leading-relaxed italic">{selectedProject.whyItMatters}</p>
              </div>

              {/* Status control */}
              <div>
                <div className="text-2xs font-black text-slate-400 uppercase tracking-widest mb-2 font-mono">Estado</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['not-started', 'in-progress', 'done'] as ProjectStatus[]).map(st => {
                    const cur = getEntry(selectedProject.id)?.status ?? 'not-started';
                    const labels = { 'not-started': 'Por fazer', 'in-progress': 'Em curso', 'done': 'Concluído' };
                    return (
                      <button key={st} onClick={() => setStatus(selectedProject.id, st)}
                        className={`py-2 border text-xs font-semibold transition-all ${
                          cur === st
                            ? st === 'done' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                              : st === 'in-progress' ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                              : 'border-slate-600 bg-slate-800 text-slate-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                        }`}>
                        {labels[st]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Repo URL */}
              <div>
                <div className="text-2xs font-black text-slate-400 uppercase tracking-widest mb-2 font-mono">Link do repositório</div>
                <div className="flex gap-2">
                  <input
                    value={repoInput}
                    onChange={e => setRepoInput(e.target.value)}
                    placeholder="https://github.com/user/projecto"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:border-orange-500/40 focus:outline-none font-mono"
                  />
                  <button onClick={() => { setRepoUrl(selectedProject.id, repoInput); }}
                    className="px-3 py-2 border border-orange-500/40 bg-orange-500/10 text-orange-300 text-sm font-semibold hover:bg-orange-500/20 font-mono">
                    Guardar
                  </button>
                </div>
                {getEntry(selectedProject.id)?.repoUrl && (
                  <a href={getEntry(selectedProject.id)!.repoUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-orange-300 hover:text-orange-200 font-mono">
                    <Github size={12} /> Abrir repositório <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion celebration */}
      {s.done === 50 && (
        <div className="border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
          <Trophy size={32} className="text-emerald-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-emerald-300 font-display">50 projectos concluídos!</h3>
          <p className="text-sm text-slate-400 mt-1">Já não estás a aprender DevOps — estás a praticá-lo.</p>
        </div>
      )}
    </div>
  );
}
