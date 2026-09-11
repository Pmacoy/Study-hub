import React, { useState, useCallback, useMemo } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Target,
  AlertCircle,
  Filter,
  Brain,
  Sparkles,
  BarChart3,
} from 'lucide-react';

import type {
  Question,
  ExamTopicFilter,
  QuestionTopic,
} from '../../types/exam';
import { ALL_QUESTIONS } from '../../data/azure/devopsQuestions';
import { useQuizEngine, type Question as EngineQuestion } from '../../hooks/useQuizEngine';

type QuizMode = 'menu' | 'quiz' | 'finished';

/** Converte uma Question de DevOps para o formato genérico do motor. */
function toEngineQuestion(q: Question): EngineQuestion {
  return {
    q: q.question,
    opts: q.options,
    a: q.correctIndex,
    exp: q.explanation,
    mod: q.topicLabel,
  };
}

const TOPICS = [
  { key: 'all', label: 'Todos os tópicos' },
  { key: 'pipelines', label: 'Pipelines' },
  { key: 'repositories', label: 'Repositórios' },
  { key: 'boards', label: 'Boards' },
  { key: 'security', label: 'Segurança' },
  { key: 'artifacts', label: 'Artefatos' },
  { key: 'environments', label: 'Ambientes' },
] satisfies { key: ExamTopicFilter; label: string }[];

function getFilteredQuestions(topicFilter: ExamTopicFilter): Question[] {
  return topicFilter === 'all'
    ? ALL_QUESTIONS
    : ALL_QUESTIONS.filter((q) => q.topic === topicFilter);
}

function buildSessionQuestions(
  topicFilter: ExamTopicFilter,
  isExamMode: boolean
): Question[] {
  const filtered = getFilteredQuestions(topicFilter);

  return [...filtered]
    .sort(() => Math.random() - 0.5)
    .slice(0, isExamMode ? 20 : Math.min(10, filtered.length));
}

function getDifficultyBadgeClass(difficulty: Question['difficulty']) {
  if (difficulty === 'hard') {
    return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
  }

  if (difficulty === 'medium') {
    return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
  }

  return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
}

function getOptionClass({
  isAnswered,
  isCorrect,
  isSelected,
}: {
  isAnswered: boolean;
  isCorrect: boolean;
  isSelected: boolean;
}) {
  if (isAnswered && isCorrect) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';
  }

  if (isAnswered && isSelected && !isCorrect) {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-100';
  }

  if (isSelected) {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-100';
  }

  return 'border-slate-800 bg-[#181926]/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900';
}

function getOptionLetterClass({
  isAnswered,
  isCorrect,
  isSelected,
}: {
  isAnswered: boolean;
  isCorrect: boolean;
  isSelected: boolean;
}) {
  if (isAnswered && isCorrect) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
  }

  if (isAnswered && isSelected && !isCorrect) {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-200';
  }

  return 'border-slate-700 bg-slate-900 text-slate-400';
}

type WeakTopicStat = {
  topic: QuestionTopic;
  label: string;
  total: number;
  correct: number;
  pct: number;
};

export default function AzureDevOpsExamSimulator() {
  const [topicFilter, setTopicFilter] = useState<ExamTopicFilter>('all');
  const [examMode, setExamMode] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('menu');
  const [wrongReview, setWrongReview] = useState(false);

  // Questões cruas da sessão — o motor guarda a versão genérica, mas o render
  // precisa dos campos específicos do DevOps (topic, topicLabel, difficulty).
  const [questions, setQuestions] = useState<Question[]>([]);

  const { state, score, percentage, handleStartWith, handleAnswer, handleNext, handleReset } =
    useQuizEngine({ questions: [], autoShuffle: false });

  const startQuiz = useCallback(
    (isExamMode: boolean) => {
      const sessionQuestions = buildSessionQuestions(topicFilter, isExamMode);

      setQuestions(sessionQuestions);
      setExamMode(isExamMode);
      setQuizMode('quiz');
      // 90s por questão em modo exame; sem timer em modo estudo
      handleStartWith(
        sessionQuestions.map(toEngineQuestion),
        isExamMode ? sessionQuestions.length * 90 : undefined
      );
    },
    [topicFilter, handleStartWith]
  );

  const resetToMenu = useCallback(() => {
    setQuestions([]);
    setExamMode(false);
    setQuizMode('menu');
    setWrongReview(false);
    handleReset();
  }, [handleReset]);

  // Aliases sobre o estado do motor — mantêm o JSX abaixo inalterado
  const currentIdx = state.current;
  const answers = state.answers;
  const showExplanation = state.showExplanation;
  const selectedAnswer = state.answers[state.current] ?? null;
  const timeLeft = state.timeRemaining ?? 0;
  const pct = percentage;

  const currentQ = questions[currentIdx];

  const mins = useMemo(() => Math.floor(timeLeft / 60), [timeLeft]);
  const secs = useMemo(() => timeLeft % 60, [timeLeft]);

  const topicQuestionCount = useMemo(() => {
    return getFilteredQuestions(topicFilter).length;
  }, [topicFilter]);

  const weakestTopics = useMemo<WeakTopicStat[]>(() => {
    const byTopic = questions.reduce<
      Partial<Record<QuestionTopic, { total: number; correct: number; label: string }>>
    >((acc, q, i) => {
      if (!acc[q.topic]) {
        acc[q.topic] = {
          total: 0,
          correct: 0,
          label: q.topicLabel,
        };
      }

      acc[q.topic]!.total += 1;

      if (answers[i] === q.correctIndex) {
        acc[q.topic]!.correct += 1;
      }

      return acc;
    }, {});

    return Object.entries(byTopic)
      .map(([topic, data]) => ({
        topic: topic as QuestionTopic,
        label: data!.label,
        total: data!.total,
        correct: data!.correct,
        pct: data!.total === 0 ? 0 : Math.round((data!.correct / data!.total) * 100),
      }))
      .sort((a, b) => a.pct - b.pct);
  }, [questions, answers]);

  // Wrong answer review
  const wrongIndices = useMemo(() => {
    return questions
      .map((q, i) => ({ q, i }))
      .filter(({ q, i }) => answers[i] !== q.correctIndex);
  }, [questions, answers]);

  const startWrongReview = useCallback(() => {
    if (wrongIndices.length === 0) return;
    setQuestions(wrongIndices.map(({ q }) => q));
    setExamMode(false);
    setQuizMode('quiz');
    setWrongReview(true);
    handleStartWith(wrongIndices.map(({ q }) => toEngineQuestion(q)));
  }, [wrongIndices, handleStartWith]);

  const filteredTopics = useMemo(() => {
    const allTopics = ALL_QUESTIONS.map(q => ({
      key: q.topic,
      label: q.topicLabel,
      count: ALL_QUESTIONS.filter(q2 => q2.topic === q.topic).length,
    }));
    const seen = new Set<string>();
    return allTopics.filter(t => {
      if (seen.has(t.key)) return false;
      seen.add(t.key);
      return true;
    });
  }, []);

  // ── MENU ──────────────────────────────────────────────────────────────
  if (quizMode === 'menu') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
              Simulado AZ-400
            </p>
            <h2 className="mt-1 text-xl font-bold text-white font-display">
              Azure DevOps Engineer Expert
            </h2>
          </div>
          <button
            onClick={resetToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 text-slate-400 text-xs font-medium hover:border-slate-600 hover:text-slate-300 transition-all"
          >
            <RotateCcw size={13} />
            Reiniciar
          </button>
        </div>

        {/* Topic Filter */}
        <div className="border card-glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Filtro por Tópico
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTopicFilter(t.key)}
                className={`px-3 py-1.5 text-xs font-medium transition-all border ${
                  topicFilter === t.key
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-200'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {t.label}
                {t.key === 'all' ? ` (${ALL_QUESTIONS.length})` : ` (${ALL_QUESTIONS.filter(q => q.topic === t.key).length})`}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {topicQuestionCount} questões disponíveis
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practice Mode */}
          <div className="border card-glass card-glass-hover p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <BookOpen size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Modo Estudo</h3>
                <p className="text-xs text-slate-400">Aprenda no seu ritmo</p>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                {Math.min(10, topicQuestionCount)} questões por sessão
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Explicação após cada resposta
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Sem limite de tempo
              </li>
            </ul>
            <button
              onClick={() => startQuiz(false)}
              className="w-full py-2.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm font-semibold hover:bg-emerald-500/15 transition-all rounded-xl"
            >
              Iniciar Estudo
            </button>
          </div>

          {/* Exam Mode */}
          <div className="border card-glass card-glass-hover p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Modo Exame</h3>
                <p className="text-xs text-slate-400">Simule a prova real</p>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-amber-400" />
                20 questões randomizadas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-amber-400" />
                90s por questão (timer)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-amber-400" />
                Resultado final com análise
              </li>
            </ul>
            <button
              onClick={() => startQuiz(true)}
              className="w-full py-2.5 border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm font-semibold hover:bg-amber-500/15 transition-all rounded-xl"
            >
              Iniciar Exame
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="border card-glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Banco de Questões
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {filteredTopics.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTopicFilter(t.key as ExamTopicFilter);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  topicFilter === t.key
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-semibold text-white">{t.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.count} questões</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────
  if (quizMode === 'quiz' && currentQ) {
    const answered = answers[currentIdx] !== null;
    const isCorrect = answers[currentIdx] === currentQ.correctIndex;

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={resetToMenu}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            <ChevronRight size={14} className="rotate-180" />
            Voltar ao menu
          </button>
          <div className="flex items-center gap-3">
            {examMode && timeLeft > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                timeLeft < 30
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  : 'border-slate-700 bg-slate-900/50 text-slate-300'
              }`}>
                <Clock size={13} />
                <span className="text-xs font-mono font-bold tabular-nums">
                  {mins}:{secs.toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <span className="text-xs font-semibold text-slate-400 tabular-nums">
              {score}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 font-mono">
            Q {currentIdx + 1}/{questions.length}
          </span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 tabular-nums">
            {Math.round(percentage)}%
          </span>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-start gap-3">
            <p className="flex-1 text-base font-semibold text-white leading-relaxed">
              {currentQ.question}
            </p>
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-2xs font-bold border ${getDifficultyBadgeClass(currentQ.difficulty)}`}>
              {currentQ.difficulty === 'hard' ? 'Difícil' : currentQ.difficulty === 'medium' ? 'Médio' : 'Fácil'}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = idx === selectedAnswer;
            const showFeedback = answered && (idx === currentQ.correctIndex || (idx === selectedAnswer && !isCorrect));

            return (
              <button
                key={idx}
                onClick={() => !answered && handleAnswer(idx)}
                disabled={answered}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${getOptionClass({
                  isAnswered: answered,
                  isCorrect: idx === currentQ.correctIndex,
                  isSelected,
                })}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 ${getOptionLetterClass({
                    isAnswered: answered,
                    isCorrect: idx === currentQ.correctIndex,
                    isSelected,
                  })}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-sm font-medium">{option}</span>
                  {showFeedback && (
                    <>
                      {idx === currentQ.correctIndex && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      )}
                      {idx === selectedAnswer && !isCorrect && (
                        <XCircle size={16} className="text-rose-400 shrink-0" />
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && showExplanation && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              Explicação
            </p>
            <p className="text-sm leading-relaxed text-slate-300">{currentQ.explanation}</p>
            <p className="text-xs text-slate-400 mt-3">
              <BookOpen size={12} className="inline mr-1 text-amber-400" />
              <strong>Tópico:</strong> {currentQ.topicLabel}
            </p>
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-3 border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm font-semibold hover:bg-amber-500/15 transition-all rounded-xl flex items-center justify-center gap-2"
          >
            {currentIdx === questions.length - 1 ? 'Ver Resultado' : 'Próxima Questão'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    );
  }

  // ── WRONG ANSWER REVIEW ───────────────────────────────────────────────
  if (wrongReview && wrongIndices.length > 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-400">
              Revisão de Erros
            </p>
            <h2 className="mt-1 text-lg font-bold text-white font-display">
              {wrongIndices.length} questões erradas
            </h2>
          </div>
          <button
            onClick={resetToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 text-slate-400 text-xs font-medium hover:border-slate-600 hover:text-slate-300 transition-all"
          >
            <RotateCcw size={13} />
            Voltar
          </button>
        </div>

        <div className="border card-glass p-4">
          <p className="text-sm text-slate-300">
            Revendo as questões que você errou. Focus nos pontos fracos!
          </p>
        </div>

        {(() => {
          const q = wrongIndices[currentIdx]?.q;
          if (!q) return null;
          const answered = answers[currentIdx] !== null;
          const isCorrect = answers[currentIdx] === q.correctIndex;

          return (
            <>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-base font-semibold text-white leading-relaxed">
                    {q.question}
                  </p>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-2xs font-bold border ${getDifficultyBadgeClass(q.difficulty)}`}>
                    {q.difficulty === 'hard' ? 'Difícil' : q.difficulty === 'medium' ? 'Médio' : 'Fácil'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {q.options.map((option, idx) => {
                  const isSelected = idx === selectedAnswer;
                  const showFeedback = answered && (idx === q.correctIndex || (idx === selectedAnswer && !isCorrect));

                  return (
                    <button
                      key={idx}
                      onClick={() => !answered && handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${getOptionClass({
                        isAnswered: answered,
                        isCorrect: idx === q.correctIndex,
                        isSelected,
                      })}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 ${getOptionLetterClass({
                          isAnswered: answered,
                          isCorrect: idx === q.correctIndex,
                          isSelected,
                        })}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 text-sm font-medium">{option}</span>
                        {showFeedback && (
                          <>
                            {idx === q.correctIndex && (
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                            )}
                            {idx === selectedAnswer && !isCorrect && (
                              <XCircle size={16} className="text-rose-400 shrink-0" />
                            )}
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {answered && showExplanation && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="text-xs font-semibold text-rose-400 mb-2 uppercase tracking-wider">
                    Explicação
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">{q.explanation}</p>
                </div>
              )}

              {answered && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 border border-rose-500/30 bg-rose-500/10 text-rose-200 text-sm font-semibold hover:bg-rose-500/15 transition-all rounded-xl flex items-center justify-center gap-2"
                >
                  {currentIdx === wrongIndices.length - 1 ? 'Ver Resultado' : 'Próxima'}
                  <ChevronRight size={16} />
                </button>
              )}
            </>
          );
        })()}
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="border card-glass card-glass-hover p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <GraduationCap size={32} className="text-amber-400" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
            Resultado
          </p>
          <p className="mt-2 text-5xl font-black text-white font-mono">
            {Math.round(percentage)}%
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {score} acertos de {questions.length} questões
          </p>
          {examMode && (
            <p className="mt-2 text-xs text-slate-500">
              Modo Exame · {questions.length * 90}s limite
            </p>
          )}
        </div>
      </div>

      {/* Performance Message */}
      <div className="border card-glass p-4">
        <div className="flex items-center gap-3">
          {percentage >= 80 ? (
            <Sparkles size={20} className="text-emerald-400 shrink-0" />
          ) : percentage >= 60 ? (
            <Target size={20} className="text-amber-400 shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-rose-400 shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {percentage >= 80
                ? 'Excelente desempenho! 🎉'
                : percentage >= 60
                ? 'Bom trabalho, continue praticando!'
                : 'Precisa revisar alguns conceitos.'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {percentage >= 70 ? 'Você está no caminho certo para a certificação!' : 'Revise os tópicos com menor desempenho.'}
            </p>
          </div>
        </div>
      </div>

      {/* Weak Topics */}
      {weakestTopics.length > 0 && (
        <div className="border card-glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-rose-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pontos Fracos
            </span>
          </div>
          <div className="space-y-2">
            {weakestTopics.slice(0, 4).map((t) => (
              <div key={t.topic} className="flex items-center gap-3">
                <span className="text-xs text-slate-300 w-24 shrink-0">{t.label}</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      t.pct >= 70
                        ? 'bg-emerald-500'
                        : t.pct >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 w-10 text-right">
                  {t.correct}/{t.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => startQuiz(examMode)}
          className="w-full py-3 border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm font-semibold hover:bg-amber-500/15 transition-all rounded-xl flex items-center justify-center gap-2"
        >
          <RotateCcw size={15} />
          Refazer Sessão
        </button>

        {wrongIndices.length > 0 && (
          <button
            onClick={startWrongReview}
            className="w-full py-3 border border-rose-500/30 bg-rose-500/10 text-rose-200 text-sm font-semibold hover:bg-rose-500/15 transition-all rounded-xl flex items-center justify-center gap-2"
          >
            <Brain size={15} />
            Revisar {wrongIndices.length} Erros
          </button>
        )}

        <button
          onClick={resetToMenu}
          className="w-full py-3 border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 hover:text-slate-300 transition-all rounded-xl"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
