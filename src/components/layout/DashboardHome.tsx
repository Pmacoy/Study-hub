import { useEffect, useRef } from 'react';
import { BookOpen, GraduationCap, Rocket, Zap, Terminal, Shield, BarChart3, Cpu, ArrowRight, Award, ShieldCheck, Database, LayoutGrid, Cloud, Code, Network, DollarSign, Activity } from 'lucide-react';
import type { DevOpsTab, StudyTab } from '../../types/devops';
import { STUDY_TABS } from '../../types/devops';
import { TAB_META } from '../../data/tabMeta';
import QuickStat from '../shared/QuickStat';
import BlockProgress from '../shared/BlockProgress';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function DashboardHome({
  progressPct, studiedCount, completedTabs, nextRecommendedTab, onOpenTab,
}: {
  progressPct: number;
  studiedCount: number;
  completedTabs: StudyTab[];
  nextRecommendedTab: DevOpsTab;
  onOpenTab: (tab: DevOpsTab) => void;
}) {
  const nextLabel =
    nextRecommendedTab === 'exam'
      ? 'Simulado'
      : TAB_META[nextRecommendedTab as StudyTab]?.label ?? 'Módulo';

  const modules = [
    { id: 'devops-intro' as StudyTab, color: 'sky',    icon: Terminal },
    { id: 'linux' as StudyTab,         color: 'emerald', icon: Cpu },
    { id: 'shell-scripting' as StudyTab, color: 'amber', icon: Code },
    { id: 'git' as StudyTab,          color: 'rose',   icon: BarChart3 },
    { id: 'docker' as StudyTab,       color: 'sky',     icon: LayoutGrid },
    { id: 'kubernetes' as StudyTab,   color: 'violet',  icon: Shield },
    { id: 'helm' as StudyTab,         color: 'emerald', icon: Database },
    { id: 'cicd' as StudyTab,         color: 'rose',    icon: Rocket },
    { id: 'terraform' as StudyTab,    color: 'violet',  icon: Terminal },
    { id: 'cloudformation' as StudyTab, color: 'orange', icon: Cloud },
    { id: 'gitops' as StudyTab,       color: 'violet',  icon: Code },
    { id: 'service-mesh' as StudyTab, color: 'teal',    icon: Network },
    { id: 'monitoring' as StudyTab,   color: 'amber',   icon: Activity },
    { id: 'security' as StudyTab,     color: 'rose',    icon: ShieldCheck },
    { id: 'idp-backstage' as StudyTab, color: 'violet',  icon: LayoutGrid },
    { id: 'golden-paths' as StudyTab, color: 'amber',   icon: Rocket },
    { id: 'dora-devex' as StudyTab,   color: 'emerald', icon: BarChart3 },
    { id: 'finops' as StudyTab,       color: 'amber',   icon: DollarSign },
    { id: 'sre' as StudyTab,          color: 'rose',    icon: Activity },
    { id: 'mlops' as StudyTab,        color: 'sky',     icon: Zap },
  ];

  const heroRef = useReveal();
  const modulesRef = useReveal();
  const moduleGridRef = useReveal();
  const actionsRef = useReveal();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section ref={heroRef} className="reveal reveal-delay-1 border card-glass card-glass-hover card-glass-violet p-6 md:p-8 relative overflow-hidden border-l-4 border-l-violet-500/50">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 via-cyan-400/40 to-transparent" />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] relative">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400 font-mono">
              Platform &amp; DevOps Engineering
            </p>
            <h3 className="mt-2 text-2xl font-bold leading-tight text-white tracking-tight font-display">
              Da execução (DevOps) à plataforma como produto.
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
              {STUDY_TABS.length} módulos abrangendo Fundamentos DevOps, Cloud, Platform Engineering, SRE e mais.
              Simuladores interactivos alinhados com o mercado 2026, incluindo trilhos de certificação Terraform Associate e CKA.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenTab(nextRecommendedTab)}
                className="border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition-all hover:bg-violet-500/20 btn-glow-violet"
              >
                Continuar estudo → {nextLabel}
              </button>
              <button
                onClick={() => onOpenTab('exam')}
                className="border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition-all hover:bg-amber-500/20 btn-glow-amber"
              >
                <GraduationCap size={13} className="inline mr-1.5" />Simulado
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <QuickStat
              icon={<Zap size={14} className="text-amber-400" />}
              label="Progresso"
              value={`${progressPct}%`}
              tone="violet"
            />
            <QuickStat
              icon={<BookOpen size={14} className="text-violet-400" />}
              label="Módulos"
              value={`${studiedCount}/${STUDY_TABS.length}`}
              tone="emerald"
            />
            <QuickStat
              icon={<Rocket size={14} className="text-rose-400" />}
              label="Simuladores"
              value="12"
              tone="sky"
            />
          </div>
        </div>
      </section>

      <section ref={modulesRef} className="reveal reveal-delay-2 p-2 mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400 font-mono">Roadmap</p>
            <h3 className="mt-1 text-2xl font-bold text-white font-display">A tua jornada</h3>
          </div>
          <BlockProgress value={studiedCount} max={STUDY_TABS.length} tone="violet" showPct={true} />
        </div>

        <div ref={moduleGridRef} className="relative max-w-3xl mx-auto pl-6 sm:pl-0">
          {/* Main vertical line for timeline */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-px bg-slate-800 -translate-x-1/2" />
          
          <div className="flex flex-col gap-6 sm:gap-4 stagger-children">
            {modules.map((m, idx) => {
              const done = completedTabs.includes(m.id);
              const Icon = m.icon;
              const isEven = idx % 2 === 0;
              
              // Determine if this module is the start of a new phase
              let phaseTitle = null;
              let phaseDesc = null;
              if (m.id === 'devops-intro') {
                phaseTitle = 'Fase 1: Fundamentos';
                phaseDesc = 'A base da operação';
              } else if (m.id === 'kubernetes') {
                phaseTitle = 'Fase 2: Infraestrutura & Cloud Native';
                phaseDesc = 'O Core DevOps';
              } else if (m.id === 'monitoring') {
                phaseTitle = 'Fase 3: Observabilidade & Segurança';
                phaseDesc = 'O Escudo e os Olhos';
              } else if (m.id === 'idp-backstage') {
                phaseTitle = 'Fase 4: Platform Engineering';
                phaseDesc = 'Plataforma como Produto e DevEx';
              } else if (m.id === 'finops') {
                phaseTitle = 'Fase 5: SRE & Automação Autónoma';
                phaseDesc = 'O Topo da Carreira';
              }

              const colorMap: Record<string, string> = {
                sky:     done ? 'bg-sky-500/20 text-sky-300 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
                emerald: done ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
                amber:   done ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
                violet:  done ? 'bg-violet-500/20 text-violet-300 border-violet-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
                rose:    done ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
                teal:    done ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
                orange:  done ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-slate-900 text-slate-500 border-slate-800',
              };
              const nodeClass = colorMap[m.color] ?? colorMap['violet'];
              const titleColor = done ? 'text-white' : 'text-slate-400';

              return (
                <div key={m.id}>
                  {/* Phase Marker */}
                  {phaseTitle && (
                    <div className="relative z-10 flex flex-col items-start sm:items-center py-6 sm:py-8 mt-4 sm:mt-6 first:mt-0">
                      <div className="bg-slate-950 px-4 py-2 border border-slate-800 rounded-2xl flex flex-col items-start sm:items-center ml-12 sm:ml-0 shadow-lg shadow-black/50">
                        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 font-mono mb-1">{phaseTitle}</span>
                        <span className="text-sm font-medium text-slate-300">{phaseDesc}</span>
                      </div>
                    </div>
                  )}

                  <div className={`relative flex items-center gap-4 sm:gap-8 ${isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                  {/* The content card */}
                  <div className={`flex-1 ${isEven ? 'sm:text-right' : 'sm:text-left'} pt-1`}>
                    <button
                      onClick={() => onOpenTab(m.id)}
                      className={`inline-flex items-center gap-3 group transition-transform hover:scale-105 ${isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
                    >
                      <span className={`text-sm font-semibold tracking-wide transition-colors group-hover:text-white ${titleColor}`}>
                        {TAB_META[m.id]?.label ?? m.id}
                      </span>
                      {!done && (
                        <ArrowRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </div>
                  
                  {/* The timeline node */}
                  <div className="relative shrink-0 flex items-center justify-center w-12 h-12">
                    <div className={`absolute inset-0 m-auto w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center z-10 ${nodeClass}`}>
                      <Icon size={16} />
                    </div>
                  </div>
                  
                  {/* Empty space for the other side of the timeline on desktop */}
                  <div className="hidden sm:block flex-1" />
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section ref={actionsRef} className="reveal reveal-delay-3 grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
        <button
          onClick={() => onOpenTab(nextRecommendedTab)}
          className="border card-glass card-glass-hover card-glass-violet p-5 text-left transition-all group border-violet-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-violet-500/30 bg-violet-500/10">
              <Zap size={16} className="text-violet-400" />
            </div>
            <div>
              <div className="text-2xs font-black text-slate-500 uppercase tracking-widest font-mono">Próximo passo</div>
              <div className="text-sm font-bold text-white font-display">{nextLabel}</div>
            </div>
            <ArrowRight size={14} className="ml-auto text-violet-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </div>
        </button>

        <button
          onClick={() => onOpenTab('exam')}
          className="border card-glass card-glass-hover card-glass-amber p-5 text-left transition-all group border-amber-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-amber-500/30 bg-amber-500/10">
              <GraduationCap size={16} className="text-amber-400" />
            </div>
            <div>
              <div className="text-2xs font-black text-slate-500 uppercase tracking-widest font-mono">Simulado</div>
              <div className="text-sm font-bold text-white font-display">Pronto para testar?</div>
            </div>
            <ArrowRight size={14} className="ml-auto text-amber-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </div>
        </button>

        <button
          onClick={() => onOpenTab('terraform-exam')}
          className="border card-glass card-glass-hover card-glass-violet p-5 text-left transition-all group border-violet-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-violet-500/30 bg-violet-500/10">
              <Award size={16} className="text-violet-400" />
            </div>
            <div>
              <div className="text-2xs font-black text-slate-500 uppercase tracking-widest font-mono">Certificação</div>
              <div className="text-sm font-bold text-white font-display">Terraform Associate</div>
            </div>
            <ArrowRight size={14} className="ml-auto text-violet-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </div>
        </button>

        <button
          onClick={() => onOpenTab('cka-exam')}
          className="border card-glass card-glass-hover card-glass-violet p-5 text-left transition-all group border-violet-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-violet-500/30 bg-violet-500/10">
              <ShieldCheck size={16} className="text-violet-400" />
            </div>
            <div>
              <div className="text-2xs font-black text-slate-500 uppercase tracking-widest font-mono">Certificação</div>
              <div className="text-sm font-bold text-white font-display">CKA (Kubernetes)</div>
            </div>
            <ArrowRight size={14} className="ml-auto text-violet-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </div>
        </button>
      </section>
    </div>
  );
}
