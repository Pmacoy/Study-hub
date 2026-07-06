import { BookOpen, GraduationCap, Rocket, Zap } from 'lucide-react';
import type { DevOpsTab, StudyTab } from '../../types/devops';
import { TAB_META } from '../../data/tabMeta';
import QuickStat from '../shared/QuickStat';

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
    { id: 'devops-intro' as StudyTab, color: 'sky', emoji: '🚀' },
    { id: 'linux' as StudyTab, color: 'emerald', emoji: '🐧' },
    { id: 'git' as StudyTab, color: 'amber', emoji: '🌿' },
    { id: 'docker' as StudyTab, color: 'sky', emoji: '🐳' },
    { id: 'kubernetes' as StudyTab, color: 'violet', emoji: '☸️' },
    { id: 'cicd' as StudyTab, color: 'rose', emoji: '⚙️' },
    { id: 'terraform' as StudyTab, color: 'violet', emoji: '🏗️' },
    { id: 'monitoring' as StudyTab, color: 'amber', emoji: '📊' },
    { id: 'security' as StudyTab, color: 'rose', emoji: '🔐' },
    { id: 'idp-backstage' as StudyTab, color: 'violet', emoji: '🧱' },
    { id: 'golden-paths' as StudyTab, color: 'amber', emoji: '🛤️' },
    { id: 'dora-devex' as StudyTab, color: 'emerald', emoji: '📈' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-6 md:p-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-400">
              Platform &amp; DevOps Engineering
            </p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight text-white">
              Da execução (DevOps) à plataforma como produto.
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">
              12 módulos · 9 de fundamentos DevOps + 3 de Platform Engineering (IDP · Golden Paths · DORA &amp; DevEx). Simuladores interactivos alinhados com o mercado 2026.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenTab(nextRecommendedTab)}
                className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-[13px] font-semibold text-violet-200 transition-all hover:bg-violet-500/15"
              >
                Continuar estudo → {nextLabel}
              </button>
              <button
                onClick={() => onOpenTab('exam')}
                className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[13px] font-semibold text-amber-200 transition-all hover:bg-amber-500/15"
              >
                <GraduationCap size={14} className="inline mr-1" />
                Ir para simulado
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <QuickStat icon={<BookOpen size={15} />} label="Módulos feitos" value={`${studiedCount}/12`} tone="sky" />
            <QuickStat icon={<Zap size={15} />} label="Progresso" value={`${progressPct}%`} tone="emerald" />
            <QuickStat icon={<Rocket size={15} />} label="Próximo" value={nextLabel} tone="rose" />
            <QuickStat icon={<GraduationCap size={15} />} label="Simulado" value="Praticar" tone="amber" />
          </div>
        </div>
      </section>

      {/* Module grid */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-widest text-slate-400">
          Todos os módulos
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const meta = TAB_META[m.id];
            const done = completedTabs.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => onOpenTab(m.id)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all hover:bg-slate-900 ${
                  done ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-800'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-200">{meta.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{meta.subtitle}</p>
                  {done && <span className="mt-1 inline-block text-[10px] font-bold text-emerald-400">✓ Concluído</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
