import { ArrowRight, BookOpen, GraduationCap, Target } from 'lucide-react';
import type { Domain, DomainMeta } from '../../types/platform';
import type { DailyState, DailyStepId } from '../../types/daily';
import type { ActivityType, ProgressBreakdown } from '../../types/progress';
import DailySessionCard from '../shared/DailySessionCard';
import ProgressIndexCard from '../shared/ProgressIndexCard';
import { useLang } from '../../i18n/LangContext';

interface Props {
  domains: DomainMeta[];
  progressByDomain: Record<Domain, { studied: number; total: number }>;
  onSelectDomain: (d: Domain) => void;
  daily: DailyState;
  isStepDoneToday: (step: DailyStepId) => boolean;
  onMarkStep: (step: DailyStepId) => void;
  onLogActivity: (type: ActivityType, ratio: number) => void;
  progressBreakdown: ProgressBreakdown;
  onOpenScenarios: () => void;
  onOpenLearningPath: () => void;
  onOpenProjects: () => void;
  onOpenInterview: () => void;
  onOpenDiagnostic: () => void;
  onOpenCareer: () => void;
  onOpenResources: () => void;
}

const colorMap: Record<string, { bg: string; border: string; text: string; bar: string; btn: string }> = {
  violet: {
    bg: 'bg-violet-500/5',
    border: 'border-violet-500/20',
    text: 'text-violet-400',
    bar: 'from-violet-500 to-fuchsia-500',
    btn: 'bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25',
  },
  sky: {
    bg: 'bg-sky-500/5',
    border: 'border-sky-500/20',
    text: 'text-sky-400',
    bar: 'from-sky-500 to-blue-500',
    btn: 'bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500/25',
  },
  emerald: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    bar: 'from-emerald-500 to-teal-500',
    btn: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25',
  },
  amber: {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    bar: 'from-amber-500 to-orange-500',
    btn: 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25',
  },
};

export default function PlatformLanding({ domains, progressByDomain, onSelectDomain, daily, isStepDoneToday, onMarkStep, onLogActivity, progressBreakdown, onOpenScenarios, onOpenLearningPath, onOpenProjects, onOpenInterview, onOpenDiagnostic, onOpenCareer, onOpenResources }: Props) {
  const { t, lang } = useLang();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-3 text-4xl">🧠</div>
        <h1 className="text-3xl font-black text-white md:text-4xl">
          Plataforma de Estudos
        </h1>
        <p className="mt-3 text-[15px] text-slate-400 max-w-xl mx-auto">
          Simuladores interactivos, progresso persistente e simulados por domínio.
          Selecciona um domínio para continuar.
        </p>
      </div>

      <ProgressIndexCard breakdown={progressBreakdown} />

      <div className="mt-8">
        <DailySessionCard
          daily={daily}
          isStepDoneToday={isStepDoneToday}
          onMarkStep={onMarkStep}
          onLogActivity={onLogActivity}
          onOpenFreeStudy={() => {
            // Open the next recommended domain (first one not fully studied)
            const next = domains.find(d => {
              const p = progressByDomain[d.id];
              return p.studied < p.total;
            }) ?? domains[0];
            onSelectDomain(next.id);
            onMarkStep('study');
          }}
        />
      </div>

      {/* Feature highlight cards — Learning Path + Scenarios */}
      {lang === 'en' && (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-2.5">
          <p className="text-[11px] text-slate-500">
            🇵🇹 {t('notice.ptContent')}
          </p>
        </div>
      )}

      {/* Diagnóstico — ponto de entrada */}
      <button
        onClick={onOpenDiagnostic}
        className="w-full mt-6 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-500/15 via-violet-500/10 to-transparent p-5 text-left transition-all hover:border-violet-500/50 group"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15">
            <span className="text-xl">🎯</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-0.5">{t('diag.banner.eyebrow')}</div>
            <h3 className="text-[15px] font-bold text-white">{t('diag.banner.title')}</h3>
            <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
              {t('diag.banner.desc')}
            </p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-violet-400 transition-transform group-hover:translate-x-1" />
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 mb-2">
        <button
          onClick={onOpenLearningPath}
          className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-5 text-left transition-all hover:border-violet-500/50 hover:from-violet-500/15 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15">
              <span className="text-lg">🗺️</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('card.path.eyebrow')}</div>
              <h3 className="text-[14px] font-bold text-white">{t('card.path.title')}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {t('card.path.desc')}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onOpenProjects}
          className="rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 to-slate-950/30 p-5 text-left transition-all hover:border-orange-500/50 hover:from-orange-500/15 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/15">
              <span className="text-lg">🚀</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{t('card.projects.eyebrow')}</div>
              <h3 className="text-[14px] font-bold text-white">{t('card.projects.title')}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {t('card.projects.desc')}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onOpenScenarios}
          className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-5 text-left transition-all hover:border-violet-500/50 hover:from-violet-500/15 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15">
              <Target size={18} className="text-violet-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('card.scenarios.eyebrow')}</div>
              <h3 className="text-[14px] font-bold text-white">{t('card.scenarios.title')}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {t('card.scenarios.desc')}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onOpenInterview}
          className="rounded-3xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-slate-950/30 p-5 text-left transition-all hover:border-sky-500/50 hover:from-sky-500/15 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/15">
              <span className="text-lg">💬</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">{t('card.interview.eyebrow')}</div>
              <h3 className="text-[14px] font-bold text-white">{t('card.interview.title')}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {t('card.interview.desc')}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onOpenCareer}
          className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-slate-950/30 p-5 text-left transition-all hover:border-amber-500/50 hover:from-amber-500/15 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15">
              <span className="text-lg">🧭</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{t('card.career.eyebrow')}</div>
              <h3 className="text-[14px] font-bold text-white">{t('card.career.title')}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {t('card.career.desc')}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onOpenResources}
          className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-slate-950/30 p-5 text-left transition-all hover:border-emerald-500/50 hover:from-emerald-500/15 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15">
              <span className="text-lg">📚</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('card.resources.eyebrow')}</div>
              <h3 className="text-[14px] font-bold text-white">{t('card.resources.title')}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {t('card.resources.desc')}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Domain cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {domains.map((d) => {
          const c = colorMap[d.color] ?? colorMap['violet'];
          const prog = progressByDomain[d.id] ?? { studied: 0, total: d.moduleCount };
          const pct = prog.total > 0 ? Math.round((prog.studied / prog.total) * 100) : 0;

          return (
            <div
              key={d.id}
              className={`rounded-3xl border p-6 transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group ${c.bg} ${c.border}`}
              onClick={() => onSelectDomain(d.id)}
            >
              <div className="text-3xl mb-4">{d.icon}</div>
              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${c.text}`}>
                {d.id === 'azure' ? 'AZ-104' : d.id === 'networking' ? 'Redes' : 'DevOps'}
              </div>
              <h2 className="text-[18px] font-bold text-white leading-tight mb-2">
                {t(`domain.${d.id}.label` as any)}
              </h2>
              <p className="text-[12px] text-slate-500 mb-5 leading-relaxed">
                {d.subtitle}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <BookOpen size={11} />
                    <span>{prog.studied}/{prog.total} módulos</span>
                  </div>
                  <span className={`text-[11px] font-bold ${c.text}`}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-[12px] font-semibold transition-all ${c.btn}`}>
                {pct === 0 ? 'Começar' : pct === 100 ? 'Rever' : 'Continuar'}
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        {[
          { label: 'Domínios activos', value: domains.filter(d => d.status === 'active').length.toString() },
          { label: 'Total de módulos', value: domains.reduce((a, d) => a + d.moduleCount, 0).toString() },
          { label: 'Módulos feitos', value: Object.values(progressByDomain).reduce((a, p) => a + p.studied, 0).toString() },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center">
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
