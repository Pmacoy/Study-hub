import { useState } from 'react';
import { Clock, Play, Star, Tag, Terminal, Target, Zap } from 'lucide-react';
import type { Domain, DomainMeta } from '../../types/platform';
import type { ScenarioAttempt } from '../../types/scenario';
import type { ChallengeAttempt } from '../../types/scenario';
import type { TerminalAttempt } from '../../types/terminal';
import { ALL_SCENARIOS, ALL_CHALLENGES } from '../../data/scenarios';
import { ALL_TERMINAL_SESSIONS } from '../../data/terminal';

interface Props {
  onOpenScenario: (id: string) => void;
  onOpenChallenge: (id: string) => void;
  onOpenTerminal: (id: string) => void;
  onExit?: () => void;
  domains: DomainMeta[];
  bestScenarioAttemptFor: (scenarioId: string) => ScenarioAttempt | null;
  bestChallengeAttemptFor: (scenarioId: string) => ChallengeAttempt | null;
  bestTerminalAttemptFor: (sessionId: string) => TerminalAttempt | null;
}

type Mode = 'guided' | 'challenge';

const DIFFICULTY_STYLES = {
  junior: 'border-emerald-500/30 text-emerald-300',
  mid:    'border-amber-500/30 text-amber-300',
  senior: 'border-rose-500/30 text-rose-300',
};

const DOMAIN_ACCENT: Record<Domain, string> = {
  devops: 'violet',
  azure: 'sky',
  aws: 'orange',
  networking: 'emerald',
  python: 'amber',
  'system-design': 'rose',
  'distributed-systems': 'teal',
  'algorithms': 'cyan',
};

const ACCENT_TEXT: Record<string, string> = {
  violet:  'text-violet-400',
  sky:     'text-sky-400',
  orange:  'text-orange-400',
  rose:    'text-rose-400',
  emerald: 'text-emerald-400',
  amber:   'text-amber-400',
};

export default function ScenariosHub({
  onOpenScenario,
  onOpenChallenge,
  onOpenTerminal,
  domains,
  bestScenarioAttemptFor,
  bestChallengeAttemptFor,
  bestTerminalAttemptFor,
}: Props) {
  const [mode, setMode] = useState<Mode>('guided');

  return (
    <div className="space-y-6">
      {/* Mode switcher + header */}
      <section className="border border-violet-500/20 bg-violet-500/5 p-6">
        <div className="mb-2"><Target size={32} className="text-violet-400" /></div>
        <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-1 font-mono">Aprender resolvendo</div>
        <h1 className="text-xl font-bold text-white font-display mb-2">
          {mode === 'guided' ? 'Cenários guiados & terminal simulado' : 'Challenge — pensa, diagnostica, resolve'}
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed mb-4">
          {mode === 'guided'
            ? 'Duas formas de aprender resolvendo problemas reais. <span className="text-violet-300 font-bold">Guiados</span>: recebes o contexto e escolhes o próximo passo. <span className="text-violet-300 font-bold">Terminal</span>: escreves os comandos, o parser flexível aceita variações e dá pistas.'
            : 'Todos os artifacts aparecem de uma vez. Diagnstica a causa raiz e propõe a correção. Dicas progressivas ajudão — mas só se precisares.'}
        </p>

        {/* Mode toggle */}
        <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/80 p-1">
          <button
            onClick={() => setMode('guided')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'guided'
                ? 'bg-violet-500/20 border border-violet-500/40 text-violet-200'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Play size={12} />
            Guiado
          </button>
          <button
            onClick={() => setMode('challenge')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'challenge'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Zap size={12} />
            Challenge
          </button>
        </div>
      </section>

      {/* Terminal sessions (always visible) */}
      <section className="space-y-3">
        <div className="flex items-baseline gap-3">
          <Terminal size={18} className="text-emerald-400" />
          <h2 className="text-sm font-black uppercase tracking-widest text-emerald-400 font-mono">Terminal simulado</h2>
          <span className="text-xs text-slate-400 font-mono">{ALL_TERMINAL_SESSIONS.length} sessõe{ALL_TERMINAL_SESSIONS.length > 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_TERMINAL_SESSIONS.map(s => {
            const best = bestTerminalAttemptFor(s.id);
            const bestRatio = best ? best.objectivesHit / best.totalObjectives : 0;
            return (
              <button
                key={s.id}
                onClick={() => onOpenTerminal(s.id)}
                className="text-left border border-slate-800 bg-[#181926]/80 p-5 transition-all hover:border-emerald-500/40 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`px-2 py-0.5 text-2xs font-black uppercase border ${DIFFICULTY_STYLES[s.difficulty]}`}>
                    {s.shell}
                  </div>
                  <div className="flex items-center gap-1 text-2xs text-slate-400 font-mono">
                    <Clock size={10} />
                    <span>{s.timeEstimateMin} min</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white font-display leading-tight mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.hook}</p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {s.tags.slice(0, 3).map(t => (
                    <span key={t} className="flex items-center gap-1 text-2xs text-slate-400 font-mono">
                      <Tag size={9} />{t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {best ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Star size={11} className={bestRatio >= 0.8 ? 'text-amber-400' : 'text-slate-400'} fill={bestRatio >= 0.8 ? 'currentColor' : 'none'} />
                      <span className="text-slate-400">Melhor: {best.objectivesHit}/{best.totalObjectives}</span>
                    </div>
                  ) : (
                    <span className="text-2xs text-slate-600 font-mono">Ainda não tentaste</span>
                  )}
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-300 font-mono">
                    <Play size={11} />
                    Abrir shell
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mode-specific list */}
      {mode === 'guided'
        ? <GuidedMode domains={domains} onOpenScenario={onOpenScenario} bestAttemptFor={bestScenarioAttemptFor} />
        : <ChallengeMode domains={domains} onOpenChallenge={onOpenChallenge} bestAttemptFor={bestChallengeAttemptFor} />
      }
    </div>
  );
}

// ── Guided mode ──────────────────────────────────────────────────────────────
function GuidedMode({
  domains,
  onOpenScenario,
  bestAttemptFor,
}: {
  domains: DomainMeta[];
  onOpenScenario: (id: string) => void;
  bestAttemptFor: (id: string) => ScenarioAttempt | null;
}) {
  return (
    <>
      {domains.map(d => {
        const scenarios = ALL_SCENARIOS.filter(s => s.domain === d.id);
        if (scenarios.length === 0) return null;
        const accentColor = DOMAIN_ACCENT[d.id];
        return (
          <section key={d.id} className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl">{d.icon}</span>
              <h3 className={`text-sm font-black uppercase tracking-widest ${ACCENT_TEXT[accentColor]} font-mono`}>{d.label}</h3>
              <span className="text-xs text-slate-400 font-mono">{scenarios.length} cenário{scenarios.length > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map(s => {
                const best = bestAttemptFor(s.id);
                const bestRatio = best ? best.correctFirstTry / best.totalSteps : 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => onOpenScenario(s.id)}
                    className="text-left border border-slate-800 bg-[#181926]/80 p-5 transition-all hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`px-2 py-0.5 text-2xs font-black uppercase border ${DIFFICULTY_STYLES[s.difficulty]}`}>
                        {s.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-2xs text-slate-400 font-mono">
                        <Clock size={10} />
                        <span>{s.timeEstimateMin} min</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white font-display leading-tight mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.hook}</p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {s.tags.slice(0, 3).map(t => (
                        <span key={t} className="flex items-center gap-1 text-2xs text-slate-400 font-mono">
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      {best ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <Star size={11} className={bestRatio >= 0.8 ? 'text-amber-400' : 'text-slate-400'} fill={bestRatio >= 0.8 ? 'currentColor' : 'none'} />
                          <span className="text-slate-400">Melhor: {best.correctFirstTry}/{best.totalSteps}</span>
                        </div>
                      ) : (
                        <span className="text-2xs text-slate-600 font-mono">Ainda não tentaste</span>
                      )}
                      <div className="flex items-center gap-1 text-xs font-semibold text-violet-300 font-mono">
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
    </>
  );
}

// ── Challenge mode ───────────────────────────────────────────────────────────
function ChallengeMode({
  domains,
  onOpenChallenge,
  bestAttemptFor,
}: {
  domains: DomainMeta[];
  onOpenChallenge: (id: string) => void;
  bestAttemptFor: (id: string) => ChallengeAttempt | null;
}) {
  return (
    <>
      {domains.map(d => {
        const challenges = ALL_CHALLENGES.filter(s => s.domain === d.id);
        if (challenges.length === 0) return null;
        const accentColor = DOMAIN_ACCENT[d.id];
        return (
          <section key={d.id} className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl">{d.icon}</span>
              <h3 className={`text-sm font-black uppercase tracking-widest ${ACCENT_TEXT[accentColor]} font-mono`}>{d.label}</h3>
              <span className="text-xs text-slate-400 font-mono">{challenges.length} challenge{challenges.length > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challenges.map(s => {
                const best = bestAttemptFor(s.id);
                const bothCorrect = best ? (best.diagnosisCorrect && best.fixCorrect) : false;
                return (
                  <button
                    key={s.id}
                    onClick={() => onOpenChallenge(s.id)}
                    className="text-left border border-slate-800 bg-[#181926]/80 p-5 transition-all hover:border-amber-500/40 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`px-2 py-0.5 text-2xs font-black uppercase border ${DIFFICULTY_STYLES[s.difficulty]}`}>
                        {s.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-2xs text-slate-400 font-mono">
                        <Clock size={10} />
                        <span>{s.timeEstimateMin} min</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white font-display leading-tight mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.hook}</p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {s.tags.slice(0, 3).map(t => (
                        <span key={t} className="flex items-center gap-1 text-2xs text-slate-400 font-mono">
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      {best ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <Star size={11} className={bothCorrect ? 'text-amber-400' : 'text-slate-400'} fill={bothCorrect ? 'currentColor' : 'none'} />
                          <span className="text-slate-400">
                            {best.diagnosisCorrect ? '✓ Diag' : '✗ Diag'}
                            {' · '}
                            {best.fixCorrect ? '✓ Fix' : '✗ Fix'}
                            {' · '}
                            {best.hintsUsed}🔓
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xs text-slate-600 font-mono">Ainda não tentaste</span>
                      )}
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-300 font-mono">
                        <Zap size={11} />
                        Desafio
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
