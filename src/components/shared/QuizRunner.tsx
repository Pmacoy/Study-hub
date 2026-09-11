import { CheckCircle2, XCircle, ChevronRight, BookOpen } from 'lucide-react';
import type { Question, QuizState } from '../../hooks/useQuizEngine';

interface QuizRunnerProps {
  state: QuizState;
  question: Question;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  score: number;
  total: number;
  percentage: number;
  accentColor?: 'violet' | 'sky' | 'orange' | 'amber';
}

/**
 * Componente genérico que renderiza uma pergunta de quiz.
 * FASE 4: Design system com animations, accessibility, responsive typography.
 *
 * Melhorias:
 * - Tipografia responsiva (text-xs md:text-sm para labels, text-base md:text-lg para questão)
 * - Monospace para números (font-mono)
 * - Explicação com accentColor dinâmico (não hardcoded violet)
 * - Animações: fade-in + slide-in para explicação
 * - Aria labels + role="progressbar" para acessibilidade
 * - Progress bar com gradiente accentColor
 * - Hover/active states com scale transforms
 * - Focus states keyboard-compliant
 */
export default function QuizRunner({
  state,
  question,
  onAnswer,
  onNext,
  score,
  total,
  percentage,
  accentColor = 'violet',
}: QuizRunnerProps) {
  const answered = state.answers[state.current] !== null;
  const answeredIndex = state.answers[state.current];
  const isCorrect = answeredIndex === question.a;

  // Mapa de cores por domínio — inclui accent para explicação
  const accentMap: Record<string, {
    progress: string;
    button: string;
    correct: string;
    wrong: string;
    explanation: { border: string; bg: string; text: string; label: string };
  }> = {
    violet: {
      progress: 'from-violet-500 to-fuchsia-500',
      button: 'border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/15 focus:ring-violet-500/30',
      correct: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      wrong: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      explanation: {
        border: 'border-violet-500/30',
        bg: 'bg-violet-500/10',
        text: 'text-violet-300',
        label: 'text-violet-400',
      },
    },
    sky: {
      progress: 'from-sky-500 to-blue-500',
      button: 'border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/15 focus:ring-sky-500/30',
      correct: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      wrong: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      explanation: {
        border: 'border-sky-500/30',
        bg: 'bg-sky-500/10',
        text: 'text-sky-300',
        label: 'text-sky-400',
      },
    },
    orange: {
      progress: 'from-orange-500 to-red-500',
      button: 'border-orange-500/30 bg-orange-500/10 text-orange-200 hover:bg-orange-500/15 focus:ring-orange-500/30',
      correct: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      wrong: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      explanation: {
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/10',
        text: 'text-orange-300',
        label: 'text-orange-400',
      },
    },
    amber: {
      progress: 'from-amber-500 to-orange-500',
      button: 'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15 focus:ring-amber-500/30',
      correct: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      wrong: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      explanation: {
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        text: 'text-amber-300',
        label: 'text-amber-400',
      },
    },
  };

  const accent = accentMap[accentColor] || accentMap['violet'];
  const progressPercent = ((state.current + 1) / total) * 100;

  return (
    <div className="space-y-6">
      {/* Progresso com Gradient Progress Trail */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <span className="text-xs md:text-sm font-semibold text-slate-400 tabular-nums font-mono">
          Q {state.current + 1}/{total}
        </span>
        <div
          className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={state.current + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Progresso do quiz: questão ${state.current + 1} de ${total}`}
        >
          <div
            className={`h-full bg-gradient-to-r ${accent.progress} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs md:text-sm font-semibold text-slate-400 tabular-nums font-mono whitespace-nowrap">
          {score}/{total}
        </span>
      </div>

      {/* Pergunta com tipografia responsiva */}
      <div
        className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-6 transition-all duration-300"
        role="region"
        aria-label="Pergunta do quiz"
      >
        <div className="flex items-start gap-3">
          <p className="flex-1 text-base md:text-lg font-semibold text-white leading-relaxed">
            {question.q}
          </p>
          {question.diff && (
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-2xs font-bold border ${
                question.diff === 'hard'
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  : question.diff === 'medium'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              }`}
            >
              {question.diff === 'hard' ? 'Difícil' : question.diff === 'medium' ? 'Médio' : 'Fácil'}
            </span>
          )}
        </div>
      </div>

      {/* Opções de resposta com hover/active effects */}
      <div className="space-y-2" role="group" aria-label="Opções de resposta">
        {question.opts.map((option, idx) => {
          let buttonClass = 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800';

          if (answered) {
            if (idx === question.a) {
              buttonClass = accent.correct;
            } else if (idx === answeredIndex && !isCorrect) {
              buttonClass = accent.wrong;
            } else {
              buttonClass = 'border-slate-800 bg-slate-900/30 text-slate-600';
            }
          }

          const isSelected = idx === answeredIndex;
          const showFeedback = answered && (idx === question.a || (idx === answeredIndex && !isCorrect));

          return (
            <button
              key={idx}
              onClick={() => !answered && onAnswer(idx)}
              disabled={answered}
              aria-label={`Opção ${idx + 1}: ${option}${answered ? (isSelected ? ' (sua resposta)' : '') : ''}`}
              aria-pressed={answered && isSelected}
              className={`
                w-full rounded-xl border p-3 md:p-4 text-left text-sm md:text-base font-medium
                transition-all duration-200 ease-out
                cursor-${answered ? 'not-allowed' : 'pointer'}
                hover:scale-${answered ? '100' : '102'}
                active:scale-98
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${accent.button}
                ${buttonClass}
              `.trim()}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex-1">{option}</span>
                {showFeedback && (
                  <>
                    {idx === question.a && (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {idx === answeredIndex && !isCorrect && (
                      <XCircle
                        size={18}
                        className="text-rose-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explicação com animação e accentColor dinâmico */}
      {state.showExplanation && (
        <div
          className={`
            rounded-2xl border p-4 md:p-5
            animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out
            ${accent.explanation.border} ${accent.explanation.bg}
          `}
          role="region"
          aria-label="Explicação da resposta"
        >
          <p
            className={`text-xs font-semibold ${accent.explanation.label} mb-2 md:mb-3 uppercase tracking-widest`}
          >
            Explicação
          </p>
          <p className="text-sm md:text-base leading-relaxed text-slate-300">{question.exp}</p>
          {question.mod && (
            <p className="text-xs text-slate-400 mt-3 md:mt-4">
              <BookOpen size={14} className="inline mr-1 text-amber-400" /> <strong>Módulo:</strong> {question.mod}
            </p>
          )}
        </div>
      )}

      {/* Botão Next com animação e acessibilidade */}
      {answered && (
        <button
          onClick={onNext}
          aria-label={state.current === total - 1 ? 'Ver resultados do quiz' : 'Ir para próxima questão'}
          className={`
            w-full rounded-2xl border px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold
            transition-all duration-200 ease-out
            flex items-center justify-center gap-2
            hover:scale-102 active:scale-98
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${accent.button}
            ${accent.button}
          `}
        >
          {state.current === total - 1 ? 'Ver Resultado' : 'Próxima Questão'}
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
