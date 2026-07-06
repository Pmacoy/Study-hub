import { ArrowRight, BookOpen, GraduationCap, Target } from 'lucide-react';
import type { Domain, DomainMeta } from '../../types/platform';
import type { DailyState, DailyStepId } from '../../types/daily';
import type { ActivityType, ProgressBreakdown } from '../../types/progress';
import DailySessionCard from '../shared/DailySessionCard';
import ProgressIndexCard from '../shared/ProgressIndexCard';

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

export default function PlatformLanding({ domains, progressByDomain, onSelectDomain, daily, isStepDoneToday, onMarkStep, onLogActivity, progressBreakdown, onOpenScenarios }: Props) {
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

      {/* Scenarios highlight card */}
      <button
        onClick={onOpenScenarios}
        className="w-full mt-6 mb-2 rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-6 text-left transition-all hover:border-violet-500/50 hover:from-violet-500/15 group"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15">
            <Target size={20} className="text-violet-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Aprender resolvendo</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-slate-400 uppercase">Cenários + terminal</span>
            </div>
            <h3 className="text-[15px] font-bold text-white">Cenários guiados & terminal simulado</h3>
            <p className="mt-1.5 text-[12px] text-slate-400 leading-relaxed max-w-2xl">
              Aprende debugando problemas reais. Nos cenários escolhes o próximo passo. No terminal escreves os comandos — parser flexível aceita variações, dá pistas se te desviares.
            </p>
          </div>
          <ArrowRight size={16} className="text-violet-400 shrink-0 mt-2 transition-transform group-hover:translate-x-1" />
        </div>
      </button>

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
                {d.label}
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
