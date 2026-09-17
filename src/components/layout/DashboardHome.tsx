import { useEffect, useRef } from 'react';
import { BookOpen, GraduationCap, Rocket, Zap, Terminal, Shield, BarChart3, Cpu, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import type { DevOpsTab, StudyTab } from '../../types/devops';
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
    { id: 'git' as StudyTab,          color: 'amber',   icon: BarChart3 },
    { id: 'docker' as StudyTab,       color: 'sky',     icon: Terminal },
    { id: 'kubernetes' as StudyTab,   color: 'violet',  icon: Shield },
    { id: 'cicd' as StudyTab,         color: 'rose',    icon: Rocket },
    { id: 'terraform' as StudyTab,    color: 'violet',  icon: Terminal },
    { id: 'monitoring' as StudyTab,   color: 'amber',   icon: BarChart3 },
    { id: 'security' as StudyTab,     color: 'rose',    icon: Shield },
    { id: 'idp-backstage' as StudyTab, color: 'violet',  icon: Terminal },
    { id: 'golden-paths' as StudyTab, color: 'amber',   icon: Rocket },
    { id: 'dora-devex' as StudyTab,   color: 'emerald', icon: BarChart3 },
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
              12 módulos · 9 de fundamentos DevOps + 3 de Platform Engineering (IDP · Golden Paths · DORA &amp; DevEx). Simuladores interactivos alinhados com o mercado 2026, incluindo trilhos de certificação Terraform Associate e CKA.
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
              value={`${studiedCount}/12`}
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

      {/* Modules grid */}
      <section ref={modulesRef} className="reveal reveal-delay-2 border card-glass card-glass-hover card-glass-violet p-6 relative overflow-hidden border-l-4 border-l-violet-500/50">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 via-cyan-400/40 to-transparent" />

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400 font-mono">Módulos</p>
            <h3 className="mt-1 text-lg font-bold text-white font-display">Todos os módulos</h3>
          </div>
          <BlockProgress value={studiedCount} max={12} tone="violet" showPct={true} />
        </div>

        <div ref={moduleGridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 stagger-children">
          {modules.map(m => {
            const done = completedTabs.includes(m.id);
            const Icon = m.icon;
            const colorMap: Record<string, string> = {
              sky:     'border-sky-500/25 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/40',
              emerald: 'border-emerald-500/25 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40',
              amber:   'border-amber-500/25 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40',
              violet:  'border-violet-500/25 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40',
              rose:    'border-rose-500/25 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40',
            };
            const cls = colorMap[m.color] ?? colorMap['violet'];
            return (
              <button
                key={m.id}
                onClick={() => onOpenTab(m.id)}
                className={`flex flex-col items-center gap-2 p-3 border transition-all ${cls} group`}
              >
                <div className="relative">
                  <Icon size={18} />
                  {done && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 live-dot" />
                  )}
                </div>
                <span className="text-2xs font-medium text-center leading-tight line-clamp-2 group-hover:text-white transition-colors">
                  {TAB_META[m.id]?.label ?? m.id}
                </span>
              </button>
            );
          })}
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
