import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, X, XCircle, Pencil } from 'lucide-react';
import { todayIso } from '../../types/daily';
import { useQuizEngine, type Question, type WeakPoint } from '../../hooks/useQuizEngine';
import { pickDailyQuestions } from '../../data/questionPools';
import { WEAK_POINTS_STORAGE_KEY } from '../../data/storageKeys';

type DailyModule = 'Daily Quiz';

function pickDailyQuestionsLocal(count: number): Question<DailyModule>[] {
  const seed = todayIso();
  return pickDailyQuestions(count, seed).map(q => ({ ...q, mod: 'Daily Quiz' as DailyModule }));
}

export default function DailyQuizWidget({ onClose, onComplete }: { onClose: () => void; onComplete: (ratio: number) => void }) {
  const questions = useMemo(() => pickDailyQuestionsLocal(5), []);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const { state, currentQuestion, score, handleStart, handleAnswer, handleNext } =
    useQuizEngine({ questions, autoShuffle: false, onWeakPointsChange: setWeakPoints });

  // Persist weak points
  useEffect(() => {
    if (weakPoints.length > 0) {
      localStorage.setItem(WEAK_POINTS_STORAGE_KEY, JSON.stringify(weakPoints));
    }
  }, [weakPoints]);

  const started = useRef(false);
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      handleStart();
    }
  }, [handleStart]);

  const reported = useRef(false);
  useEffect(() => {
    if (state.mode === 'finished' && !reported.current) {
      reported.current = true;
      onComplete(score / questions.length);
    }
  }, [state.mode, score, questions.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#181926] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pencil size={16} className="text-amber-400" />
            <span className="text-base font-bold text-white">Questões do Dia</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300"><X size={16} /></button>
        </div>

        {state.mode === 'finished' ? (
          <div className="text-center py-4 space-y-4">
            {score >= 4 ? <CheckCircle2 size={36} className="text-emerald-400 mx-auto" /> : <XCircle size={36} className="text-amber-400 mx-auto" />}
            <div className="text-2xl font-black text-white">{score}/{questions.length}</div>
            <p className="text-sm text-slate-400">Sessão de hoje concluída — streak actualizado!</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm font-semibold hover:border-slate-600"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">{state.current + 1} / {questions.length}</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-2xs font-bold">{currentQuestion.mod}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-5">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((state.current + 1) / questions.length) * 100}%` }} />
            </div>

            <p className="text-md font-semibold text-white leading-relaxed mb-4">{currentQuestion.q}</p>

            <div className="space-y-2">
              {currentQuestion.opts.map((opt, i) => {
                const answered = state.answers[state.current] !== null;
                const isCorrect = i === currentQuestion.a;
                const isSelected = i === state.answers[state.current];

                let style = 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700';
                if (answered) {
                  if (isCorrect) style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                  else if (isSelected) style = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                  else style = 'border-slate-800 bg-slate-900/30 text-slate-600';
                }

                return (
                  <button
                    key={i}
                    onClick={() => !answered && handleAnswer(i)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all text-sm ${style}`}
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-2xs font-bold">
                      {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {state.showExplanation && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">{currentQuestion.exp}</p>
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-sm hover:bg-amber-500/30 transition-all"
                >
                  {state.current < questions.length - 1 ? 'Próxima →' : 'Concluir →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
