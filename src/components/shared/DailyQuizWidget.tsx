import { useMemo, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { ALL_QUESTIONS } from '../../data/azure/examQuestions';
import type { Question } from '../../types/exam';

function pickDailyQuestions(count: number): Question[] {
  // Deterministic-ish shuffle seeded by today's date so the set is stable for the whole day
  const seed = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const arr = [...ALL_QUESTIONS];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export default function DailyQuizWidget({ onClose, onComplete }: { onClose: () => void; onComplete: (ratio: number) => void }) {
  const questions = useMemo(() => pickDailyQuestions(5), []);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);

  const q = questions[idx];
  const answered = answers[idx] !== null;
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  const handleAnswer = (i: number) => {
    if (answered) return;
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
  };

  const handleNext = () => {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else {
      setFinished(true);
      onComplete(score / questions.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="text-[13px] font-bold text-white">Questões do Dia</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
        </div>

        {!finished ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-500">{idx + 1} / {questions.length}</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-bold">{q.topicLabel}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-5">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
            </div>

            <p className="text-[14px] font-semibold text-white leading-relaxed mb-4">{q.question}</p>

            <div className="space-y-2">
              {q.options.map((opt, i) => {
                let style = 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700';
                if (answered) {
                  if (i === q.correctIndex) style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                  else if (i === answers[idx]) style = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                  else style = 'border-slate-800 bg-slate-900/30 text-slate-600';
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all text-[12px] ${style}`}>
                    <span className="shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                      {answered && i === q.correctIndex ? '✓' : answered && i === answers[idx] ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-4 space-y-3">
                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">{q.explanation}</p>
                <button onClick={handleNext} className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-[12px] hover:bg-amber-500/30 transition-all">
                  {idx < questions.length - 1 ? 'Próxima →' : 'Concluir →'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            {score >= 4 ? <CheckCircle2 size={36} className="text-emerald-400 mx-auto" /> : <XCircle size={36} className="text-amber-400 mx-auto" />}
            <div className="text-2xl font-black text-white">{score}/{questions.length}</div>
            <p className="text-[12px] text-slate-400">Sessão de hoje concluída — streak actualizado!</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[12px] font-semibold hover:border-slate-600">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
