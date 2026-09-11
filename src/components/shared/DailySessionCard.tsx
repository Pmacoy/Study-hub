import { useState } from 'react';
import { Flame, CheckCircle2, Circle } from 'lucide-react';
import type { DailyState, DailyStepId } from '../../types/daily';
import { DAILY_STEPS, todayIso } from '../../types/daily';
import DailyQuizWidget from './DailyQuizWidget';
import FlashRoundWidget from './FlashRoundWidget';

function getWeekDots(streak: number, lastActiveDate: string | null) {
  const days: { label: string; lit: boolean; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
    const iso = local.toISOString().slice(0, 10);
    const diffFromLast = lastActiveDate
      ? Math.round((new Date(lastActiveDate + 'T00:00:00Z').getTime() - new Date(iso + 'T00:00:00Z').getTime()) / 86_400_000)
      : Infinity;
    const lit = lastActiveDate !== null && diffFromLast >= 0 && diffFromLast < streak;
    days.push({
      label: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d.getDay()],
      lit,
      isToday: iso === todayIso(),
    });
  }
  return days;
}

export default function DailySessionCard({
  daily,
  isStepDoneToday,
  onMarkStep,
  onOpenFreeStudy,
  onLogActivity,
}: {
  daily: DailyState;
  isStepDoneToday: (step: DailyStepId) => boolean;
  onMarkStep: (step: DailyStepId) => void;
  onOpenFreeStudy: () => void;
  onLogActivity: (type: 'quiz' | 'flash', ratio: number) => void;
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const weekDots = getWeekDots(daily.streak, daily.lastActiveDate);
  const doneCount = DAILY_STEPS.filter(s => isStepDoneToday(s.id)).length;
  const allDone = doneCount === DAILY_STEPS.length;

  const handleStepClick = (id: DailyStepId) => {
    if (isStepDoneToday(id)) return;
    if (id === 'quiz') setShowQuiz(true);
    else if (id === 'flash') setShowFlash(true);
    else if (id === 'study') onOpenFreeStudy();
  };

  return (
    <>
      <section className="border card-glass card-glass-hover card-glass-amber p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 via-orange-400/40 to-transparent" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 relative">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-400 font-mono">Sessão Diária</p>
            <h2 className="mt-1 text-lg font-bold text-white font-display">
              {allDone ? 'Tudo feito! ✦' : doneCount === 0 ? 'Pronto para estudar hoje?' : 'Continua a sessão de hoje'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/30 bg-amber-500/10">
              <Flame size={16} className={daily.streak > 0 ? 'text-amber-400' : 'text-slate-600'} fill={daily.streak > 0 ? 'currentColor' : 'none'} />
              <span className="text-lg font-black text-amber-300 font-mono">{daily.streak}</span>
              <span className="text-2xs text-amber-500/70 uppercase font-bold font-mono">dias</span>
            </div>
            {daily.bestStreak > daily.streak && (
              <span className="text-2xs text-slate-500 font-mono">Recorde: {daily.bestStreak}</span>
            )}
          </div>
        </div>

        {/* Week tracker */}
        <div className="flex items-center gap-2 mb-5 relative">
          {weekDots.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 flex items-center justify-center text-2xs font-bold border transition-all ${
                d.lit ? 'bg-amber-500/25 border-amber-500/50 text-amber-300'
                : d.isToday ? 'border border-slate-600 text-slate-400'
                : 'border border-slate-800 text-slate-700'
              }`}>
                {d.lit ? <Flame size={11} fill="currentColor" /> : d.label}
              </div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
          {DAILY_STEPS.map((step, i) => {
            const done = isStepDoneToday(step.id);
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`relative text-left p-4 border transition-all ${
                  done ? 'border-emerald-500/30 bg-emerald-500/8'
                  : 'border-slate-800 bg-[#181926]/60 hover:border-amber-500/30 hover:bg-[#181926]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xs font-black uppercase tracking-widest text-slate-400 font-mono">Passo {i + 1}</span>
                  {done ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-700" />}
                </div>
                <div className="text-sm font-bold text-slate-200">{step.label}</div>
                <div className="text-2xs text-slate-500 mt-0.5 font-mono">{step.sublabel}</div>
                <div className="text-2xs text-slate-600 mt-1.5 font-mono">~{step.estimateMin} min</div>
              </button>
            );
          })}
        </div>

        {allDone && (
          <div className="mt-4 p-3 border border-emerald-500/20 bg-emerald-500/10 text-center">
            <span className="text-sm font-semibold text-emerald-300 font-mono">+1 ponto · streak mantido · volta amanhã para continuar ↻</span>
          </div>
        )}
      </section>

      {showQuiz && (
        <DailyQuizWidget
          onClose={() => setShowQuiz(false)}
          onComplete={(ratio) => { onMarkStep('quiz'); onLogActivity('quiz', ratio); }}
        />
      )}

      {showFlash && (
        <FlashRoundWidget
          onClose={() => setShowFlash(false)}
          onComplete={(result) => {
            onMarkStep('flash');
            onLogActivity('flash', result.cardsSeen > 0 ? result.knewCount / result.cardsSeen : 0);
          }}
        />
      )}
    </>
  );
}
