
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { ALL_QUESTIONS } from '../../data/azure/examQuestions';

type QuizMode = 'menu' | 'quiz' | 'result';

const TOPICS = [
  { key: 'all', label: 'Todos os tópicos' },
  { key: 'identity', label: 'Entra ID' },
  { key: 'governance', label: 'Governança' },
  { key: 'rbac', label: 'RBAC' },
  { key: 'storage', label: 'Armazenamento' },
  { key: 'compute', label: 'Computação' },
  { key: 'containers', label: 'Containers' },
  { key: 'vnet', label: 'Redes' },
  { key: 'monitor', label: 'Monitor & Backup' },
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
    .slice(0, isExamMode ? 25 : Math.min(10, filtered.length));
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

  return 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900';
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

export default function AzureExamSimulator() {
  const [mode, setMode] = useState<QuizMode>('menu');
  const [topicFilter, setTopicFilter] = useState<ExamTopicFilter>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [examMode, setExamMode] = useState(false);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      setMode('result');
    }
  }, [timerActive, timeLeft]);

  const startQuiz = useCallback(
    (isExamMode: boolean) => {
      const sessionQuestions = buildSessionQuestions(topicFilter, isExamMode);

      setQuestions(sessionQuestions);
      setAnswers(new Array(sessionQuestions.length).fill(null));
      setCurrentIdx(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setExamMode(isExamMode);
      setTimeLeft(isExamMode ? sessionQuestions.length * 90 : 0);
      setTimerActive(isExamMode);
      setMode('quiz');
    },
    [topicFilter]
  );

  const handleAnswer = useCallback(
    (idx: number) => {
      if (selectedAnswer !== null) return;

      setSelectedAnswer(idx);
      setShowExplanation(true);

      setAnswers((prev) => {
        const next = [...prev];
        next[currentIdx] = idx;
        return next;
      });
    },
    [currentIdx, selectedAnswer]
  );

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      return;
    }

    setTimerActive(false);
    setMode('result');
  }, [currentIdx, questions.length]);

  const resetToMenu = useCallback(() => {
    setTimerActive(false);
    setMode('menu');
    setQuestions([]);
    setAnswers([]);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(0);
    setExamMode(false);
  }, []);

  const currentQ = questions[currentIdx];

  const score = useMemo(() => {
    return answers.filter(
      (answer, i) => answer === questions[i]?.correctIndex
    ).length;
  }, [answers, questions]);

  const pct = useMemo(() => {
    return questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0;
  }, [questions.length, score]);

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

    return Object.entries(byTopic).map(([topic, value]) => {
      const stat = value!;
      return {
        topic: topic as QuestionTopic,
        label: stat.label,
        total: stat.total,
        correct: stat.correct,
        pct: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
      };
    }).sort((a, b) => a.pct - b.pct);
  }, [answers, questions]);

  const difficultyBadge = useMemo(() => {
    return currentQ
      ? getDifficultyBadgeClass(currentQ.difficulty)
      : 'bg-slate-800 text-slate-300 border-slate-700';
  }, [currentQ]);

  const progressPct = useMemo(() => {
    return questions.length
      ? Math.round(((currentIdx + 1) / questions.length) * 100)
      : 0;
  }, [currentIdx, questions.length]);

  if (mode === 'menu') {
    return (
      <div className="w-full space-y-6 animate-in fade-in duration-500">
        <section className="overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-slate-950/90 to-slate-950 shadow-2xl shadow-black/10">
          <div className="border-b border-slate-800/80 px-6 py-6 md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <GraduationCap size={24} />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  Simulação oficial de estudo
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Simulador de exame AZ-104
                </h2>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-400">
                  Treina com questões de múltipla escolha, feedback imediato em modo estudo e pressão realista em modo exame.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-3 md:px-8">
            <MiniStat
              icon={<Brain size={16} />}
              label="Banco atual"
              value={`${ALL_QUESTIONS.length} questões`}
              hint="Distribuídas por vários domínios"
              tone="amber"
            />
            <MiniStat
              icon={<Sparkles size={16} />}
              label="Modo estudo"
              value="Feedback imediato"
              hint="Explicação após cada resposta"
              tone="sky"
            />
            <MiniStat
              icon={<Clock size={16} />}
              label="Modo exame"
              value="Timer ativo"
              hint="90 segundos por questão"
              tone="rose"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 md:p-7">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={15} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-white">
              Escolhe o foco do simulado
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.key}
                onClick={() => setTopicFilter(topic.key)}
                className={`rounded-xl px-3 py-2 text-[12px] font-medium transition-all ${
                  topicFilter === topic.key
                    ? 'border border-amber-500/30 bg-amber-500/10 text-amber-200'
                    : 'border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-[13px] text-slate-500">
            {topicQuestionCount} questões disponíveis para o filtro atual.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <button
            onClick={() => startQuiz(false)}
            className="group rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6 text-left transition-all hover:border-sky-500/40 hover:bg-sky-500/10"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
              <BookOpen size={22} />
            </div>

            <h3 className="text-xl font-semibold text-white">Modo estudo</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-400">
              Faz até 10 perguntas por sessão, sem tempo limite, com explicação detalhada logo após responder.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[13px] font-medium text-sky-300">
              Iniciar treino guiado
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            onClick={() => startQuiz(true)}
            className="group rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 text-left transition-all hover:border-amber-500/40 hover:bg-amber-500/10"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Target size={22} />
            </div>

            <h3 className="text-xl font-semibold text-white">Modo exame</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-400">
              Simula pressão real com 25 perguntas, cronómetro ativo e fluxo contínuo de resolução.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[13px] font-medium text-amber-300">
              Iniciar sessão cronometrada
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </section>
      </div>
    );
  }

  if (mode === 'result') {
    const passed = pct >= 70;

    return (
      <div className="w-full space-y-6 animate-in fade-in duration-500">
        <section
          className={`rounded-3xl border p-6 md:p-8 ${
            passed
              ? 'border-emerald-500/20 bg-emerald-500/5'
              : 'border-rose-500/20 bg-rose-500/5'
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  passed ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                Resultado final
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {pct}% de acerto
              </h2>
              <p className="mt-2 text-[15px] text-slate-300">
                {score} corretas em {questions.length} questões.
              </p>
              <p className="mt-1 text-[14px] text-slate-400">
                {passed
                  ? 'Bom trabalho — já estás em zona de aprovação.'
                  : 'Ainda há espaço claro para revisão antes da prova.'}
              </p>
            </div>

            <div className="grid min-w-[260px] grid-cols-2 gap-3">
              <ResultMetric label="Meta AZ-104" value="70%" tone="amber" />
              <ResultMetric
                label="Teu resultado"
                value={`${pct}%`}
                tone={passed ? 'emerald' : 'rose'}
              />
              <ResultMetric
                label="Modo"
                value={examMode ? 'Exame' : 'Estudo'}
                tone="sky"
              />
              <ResultMetric
                label="Questões"
                value={`${questions.length}`}
                tone="slate"
              />
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                passed ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>

        {weakestTopics.length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-white">
                Desempenho por domínio
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {weakestTopics.map((item) => (
                <div
                  key={item.topic}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-medium text-white">
                      {item.label}
                    </span>
                    <span className="text-[12px] text-slate-400">
                      {item.correct}/{item.total}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        item.pct >= 70
                          ? 'bg-emerald-500'
                          : item.pct >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[12px] text-slate-500">
                    {item.pct}% de acerto
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-white">
              Revisão das perguntas
            </h3>
          </div>

          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <article
                key={q.id}
                className={`rounded-2xl border p-4 ${
                  isCorrect
                    ? 'border-emerald-500/15 bg-emerald-500/5'
                    : 'border-rose-500/15 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <XCircle size={18} className="text-rose-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400">
                        {q.topicLabel}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Questão {i + 1}
                      </span>
                    </div>

                    <p className="text-[14px] font-medium leading-relaxed text-white">
                      {q.question}
                    </p>

                    <div className="mt-3 space-y-1.5 text-[13px]">
                      <p className="text-slate-400">
                        A tua resposta:{' '}
                        <span className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                          {userAnswer !== null ? q.options[userAnswer] : 'Sem resposta'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-300">
                          Resposta correta: {q.options[q.correctIndex]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <button
          onClick={resetToMenu}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-[14px] font-medium text-slate-200 transition-all hover:border-slate-700 hover:bg-slate-800"
        >
          <RotateCcw size={16} />
          Voltar ao menu
        </button>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
        <div className="border-b border-slate-800 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  {examMode ? 'Modo exame' : 'Modo estudo'}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${difficultyBadge}`}
                >
                  {currentQ.difficulty}
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400">
                  {currentQ.topicLabel}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                Questão {currentIdx + 1} de {questions.length}
              </h2>
              <p className="mt-2 text-[14px] text-slate-400">
                Responde com atenção e usa a explicação para consolidar o raciocínio.
              </p>
            </div>

            {examMode && (
              <div
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 font-mono text-[15px] font-bold ${
                  timeLeft < 60
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                    : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                }`}
              >
                <Clock size={16} />
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-5 md:px-8">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-[12px] text-slate-500">
              <span>Progresso</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 md:p-6">
            <p className="text-[17px] font-medium leading-relaxed text-white">
              {currentQ.question}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const isAnswered = selectedAnswer !== null;

              const optionClass = getOptionClass({
                isAnswered,
                isCorrect,
                isSelected,
              });

              const optionLetterClass = getOptionLetterClass({
                isAnswered,
                isCorrect,
                isSelected,
              });

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${optionClass}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[13px] font-semibold ${optionLetterClass}`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <div className="flex-1">
                      <p className="text-[14px] leading-relaxed">{option}</p>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                    )}

                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={18} className="shrink-0 text-rose-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-5 rounded-3xl border border-sky-500/15 bg-sky-500/5 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-sky-300">
                  <AlertCircle size={18} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300">
                    Explicação
                  </p>
                  <p className="text-[14px] leading-relaxed text-slate-200">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={resetToMenu}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-[14px] font-medium text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800"
            >
              <RotateCcw size={15} />
              Sair do simulado
            </button>

            <button
              onClick={handleNext}
              disabled={!showExplanation}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-semibold transition-all ${
                showExplanation
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'cursor-not-allowed bg-slate-800 text-slate-500'
              }`}
            >
              {currentIdx === questions.length - 1 ? 'Ver resultado' : 'Próxima questão'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: 'amber' | 'sky' | 'rose';
}) {
  const tones = {
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    sky: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
    rose: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${tones[tone]}`}
      >
        {icon}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-[18px] font-semibold text-white">{value}</p>
      <p className="mt-1 text-[13px] text-slate-500">{hint}</p>
    </div>
  );
}

function ResultMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'emerald' | 'rose' | 'amber' | 'sky' | 'slate';
}) {
  const styles = {
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    rose: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    sky: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
    slate: 'border-slate-800 bg-slate-900 text-slate-200',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] opacity-75">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}