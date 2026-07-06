import { Clock, Play, Star, Tag, Terminal } from 'lucide-react';
import type { Domain, DomainMeta } from '../../types/platform';
import type { ScenarioAttempt } from '../../types/scenario';
import type { TerminalAttempt } from '../../types/terminal';
import { ALL_SCENARIOS } from '../../data/scenarios';
import { ALL_TERMINAL_SESSIONS } from '../../data/terminal';

interface Props {
  onOpenScenario: (id: string) => void;
  onOpenTerminal: (id: string) => void;
  onExit?: () => void;
  domains: DomainMeta[];
  bestScenarioAttemptFor: (scenarioId: string) => ScenarioAttempt | null;
  bestTerminalAttemptFor: (sessionId: string) => TerminalAttempt | null;
}

const DIFFICULTY_STYLES = {
  junior: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  mid:    'bg-amber-500/15 border-amber-500/30 text-amber-300',
  senior: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
};

const DOMAIN_ACCENT: Record<Domain, string> = {
  devops: 'violet',
  azure: 'sky',
  aws: 'orange',
  gcp: 'rose',
  networking: 'emerald',
  python: 'amber',
};

const ACCENT_TEXT: Record<string, string> = {
  violet: 'text-violet-400',
  sky: 'text-sky-400',
  orange: 'text-orange-400',
  rose: 'text-rose-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

export default function ScenariosHub({ onOpenScenario, onOpenTerminal, domains, bestScenarioAttemptFor, bestTerminalAttemptFor }: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
        <div className="text-3xl mb-2">🎯</div>
        <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Aprender resolvendo</div>
        <h1 className="text-2xl font-bold text-white mb-2">Cenários guiados & terminal simulado</h1>
        <p className="text-[13px] text-slate-400 max-w-2xl leading-relaxed">
          Duas formas de aprender resolvendo problemas reais. <span className="text-violet-300 font-bold">Guiados</span>: recebes o contexto e escolhes o próximo passo. <span className="text-violet-300 font-bold">Terminal</span>: escreves os comandos, o parser flexível aceita variações e dá pistas.
        </p>
      </section>

      {/* Terminal sessions */}
      <section className="space-y-3">
        <div className="flex items-baseline gap-3">
          <Terminal size={18} className="text-emerald-400" />
          <h2 className="text-[13px] font-black uppercase tracking-widest text-emerald-400">Terminal simulado</h2>
          <span className="text-[11px] text-slate-500">{ALL_TERMINAL_SESSIONS.length} sessõe{ALL_TERMINAL_SESSIONS.length > 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_TERMINAL_SESSIONS.map(s => {
            const best = bestTerminalAttemptFor(s.id);
            const bestRatio = best ? best.objectivesHit / best.totalObjectives : 0;
            return (
              <button
                key={s.id}
                onClick={() => onOpenTerminal(s.id)}
                className="text-left rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-emerald-500/40 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${DIFFICULTY_STYLES[s.difficulty]}`}>
                    {s.shell}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock size={10} />
                    <span>{s.timeEstimateMin} min</span>
                  </div>
                </div>
                <h3 className="text-[14px] font-bold text-white leading-tight mb-2">{s.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{s.hook}</p>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {s.tags.slice(0, 3).map(t => (
                    <span key={t} className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Tag size={9} />{t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {best ? (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Star size={11} className={bestRatio >= 0.8 ? 'text-amber-400' : 'text-slate-500'} fill={bestRatio >= 0.8 ? 'currentColor' : 'none'} />
                      <span className="text-slate-400">Melhor: {best.objectivesHit}/{best.totalObjectives}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600">Ainda não tentaste</span>
                  )}
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                    <Play size={11} />
                    Abrir shell
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Guided scenarios */}
      <div className="pt-2">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-lg">📋</span>
          <h2 className="text-[13px] font-black uppercase tracking-widest text-violet-400">Cenários guiados</h2>
          <span className="text-[11px] text-slate-500">{ALL_SCENARIOS.length} cenário{ALL_SCENARIOS.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {domains.map(d => {
        const scenarios = ALL_SCENARIOS.filter(s => s.domain === d.id);
        if (scenarios.length === 0) return null;
        const accentColor = DOMAIN_ACCENT[d.id];
        return (
          <section key={d.id} className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl">{d.icon}</span>
              <h3 className={`text-[12px] font-black uppercase tracking-widest ${ACCENT_TEXT[accentColor]}`}>{d.label}</h3>
              <span className="text-[11px] text-slate-500">{scenarios.length} cenário{scenarios.length > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map(s => {
                const best = bestScenarioAttemptFor(s.id);
                const bestRatio = best ? best.correctFirstTry / best.totalSteps : 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => onOpenScenario(s.id)}
                    className="text-left rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${DIFFICULTY_STYLES[s.difficulty]}`}>
                        {s.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock size={10} />
                        <span>{s.timeEstimateMin} min</span>
                      </div>
                    </div>
                    <h3 className="text-[14px] font-bold text-white leading-tight mb-2">{s.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{s.hook}</p>

                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      {s.tags.slice(0, 3).map(t => (
                        <span key={t} className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      {best ? (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Star size={11} className={bestRatio >= 0.8 ? 'text-amber-400' : 'text-slate-500'} fill={bestRatio >= 0.8 ? 'currentColor' : 'none'} />
                          <span className="text-slate-400">
                            Melhor: {best.correctFirstTry}/{best.totalSteps}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600">Ainda não tentaste</span>
                      )}
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-300">
                        <Play size={11} />
                        Começar
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
