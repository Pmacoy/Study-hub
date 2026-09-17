import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useGamification, XP_PER_QUIZ_CORRECT_ANSWER } from './useGamification';

/**
 * Tipo genérico para uma questão de exame.
 * Suporta Azure, AWS, DevOps, Python, etc.
 */
export interface Question<T extends string = string> {
  q: string; // Pergunta
  opts: string[]; // Opções de resposta
  a: number; // Índice da resposta correcta
  exp: string; // Explicação da resposta
  mod: T; // Módulo/tópico (pode ser customizado por domínio)
  diff?: 'easy' | 'medium' | 'hard'; // Dificuldade (opcional para retrocompatibilidade)
}

/**
 * Estado do quiz durante a sessão.
 */
export interface QuizState {
  mode: 'menu' | 'quiz' | 'finished';
  current: number; // Índice da questão actual
  answers: (number | null)[]; // Respostas do utilizador (null = não respondida)
  showExplanation: boolean; // Mostrar explicação da resposta actual
  timeRemaining?: number; // Segundos restantes (se timed mode)
  timerActive?: boolean; // Se o timer está a correr
}

export interface WeakPoint {
  module: string;
  wrongCount: number;
  totalAttempted: number;
}

interface UseQuizEngineProps {
  questions: Question[];
  autoShuffle?: boolean; // Embaralhar questões (default: true)
  maxTime?: number; // Tempo máximo em segundos (undefined = sem limite)
  onWeakPointsChange?: (weakPoints: WeakPoint[]) => void;
}

/** Fisher-Yates — devolve uma cópia embaralhada. */
function shuffleArray<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Hook que centraliza toda a lógica de quiz.
 * Resolve a duplicação de 5 exam simulators (DevOps, Python, Azure, AWS, Daily).
 *
 * Dois modos de arranque:
 * - `handleStart()` — usa o conjunto passado em `questions` (fixo).
 * - `handleStartWith(qs, seconds?)` — define o conjunto no arranque, para
 *   simuladores com filtro por tópico / nº de questões configurável (AWS, Azure).
 *
 * O timer é gerido internamente: basta passar `maxTime` ou o 2º argumento de
 * `handleStartWith`, e o quiz termina sozinho quando chega a zero.
 */
export function useQuizEngine({
  questions,
  autoShuffle = true,
  maxTime,
  onWeakPointsChange,
}: UseQuizEngineProps) {
  // Conjunto escolhido no arranque (null = usar o conjunto default das props)
  const [activeQuestions, setActiveQuestions] = useState<Question[] | null>(null);

  const [state, setState] = useState<QuizState>({
    mode: 'menu',
    current: 0,
    answers: new Array(questions.length).fill(null),
    showExplanation: false,
    timeRemaining: maxTime,
    timerActive: false,
  });

  // Conjunto default: embaralhado uma vez (Fisher-Yates)
  const defaultSet = useMemo(
    () => (autoShuffle ? shuffleArray(questions) : questions),
    [questions, autoShuffle]
  );

  // O conjunto em uso: o do arranque dinâmico, ou o default
  const shuffled = activeQuestions ?? defaultSet;

  // Questão actual
  const currentQuestion = shuffled[state.current];

  // Score: contar respostas correctas
  const score = useMemo(
    () =>
      state.answers.reduce<number>((sum, answer, idx) => {
        return sum + (answer !== null && answer === shuffled[idx]?.a ? 1 : 0);
      }, 0),
    [state.answers, shuffled]
  );

  // Percentagem
  const percentage = useMemo(
    () => (shuffled.length > 0 ? Math.round((score / shuffled.length) * 100) : 0),
    [score, shuffled.length]
  );

  /**
   * Timer embutido: decrementa 1s e termina o quiz quando chega a zero.
   * Evita que cada simulador reimplemente o seu próprio setInterval.
   */
  useEffect(() => {
    if (state.mode !== 'quiz' || !state.timerActive) return;

    const id = setInterval(() => {
      setState((prev) => {
        if (prev.mode !== 'quiz' || !prev.timerActive) return prev;

        const next = (prev.timeRemaining ?? 0) - 1;
        if (next <= 0) {
          return { ...prev, mode: 'finished', timeRemaining: 0, timerActive: false };
        }
        return { ...prev, timeRemaining: next };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [state.mode, state.timerActive]);

  /**
   * Responder à questão actual.
   * Bloqueia múltiplas respostas à mesma questão.
   */
  // Tracking de weak points
  const weakPointsRef = useRef<Map<string, { wrong: number; total: number }>>(new Map());

  const handleAnswer = useCallback((optionIndex: number) => {
    setState((prev) => {
      // Se já respondeu, ignore
      if (prev.answers[prev.current] !== null) {
        return prev;
      }

      const newAnswers = [...prev.answers];
      newAnswers[prev.current] = optionIndex;

      // Track weak points
      const q = shuffled[prev.current];
      if (q) {
        const mod = q.mod;
        const entry = weakPointsRef.current.get(mod) ?? { wrong: 0, total: 0 };
        entry.total++;
        if (optionIndex !== q.a) entry.wrong++;
        weakPointsRef.current.set(mod, entry);

        // Compute and notify weak points
        const wp: WeakPoint[] = [];
        for (const [m, e] of weakPointsRef.current.entries()) {
          if (e.wrong > 0) wp.push({ module: m, wrongCount: e.wrong, totalAttempted: e.total });
        }
        onWeakPointsChange?.(wp);
      }

      return {
        ...prev,
        answers: newAnswers,
        showExplanation: true,
      };
    });
  }, [shuffled, onWeakPointsChange]);

  /**
   * Ir para a próxima questão, ou terminar se for a última.
   */
  const handleNext = useCallback(() => {
    setState((prev) => {
      if (prev.current >= shuffled.length - 1) {
        // Última questão → terminar
        return {
          ...prev,
          mode: 'finished',
          timerActive: false,
        };
      }

      // Próxima questão
      return {
        ...prev,
        current: prev.current + 1,
        showExplanation: false,
      };
    });
  }, [shuffled.length]);

  /**
   * Começar o quiz com o conjunto default (ir do 'menu' para 'quiz').
   */
  const handleStart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mode: 'quiz',
      timerActive: maxTime !== undefined,
    }));
  }, [maxTime]);

  /**
   * Começar o quiz com um conjunto escolhido no arranque.
   * Usado por simuladores com filtro de tópico / nº de questões (AWS, Azure).
   *
   * @param qs      Questões a usar nesta sessão (já filtradas/limitadas).
   * @param seconds Tempo total em segundos; omitir para modo sem timer.
   */
  const handleStartWith = useCallback((qs: Question[], seconds?: number) => {
    setActiveQuestions(qs);
    setState({
      mode: 'quiz',
      current: 0,
      answers: new Array(qs.length).fill(null),
      showExplanation: false,
      timeRemaining: seconds,
      timerActive: seconds !== undefined,
    });
  }, []);

  /**
   * Resetar o quiz (voltar para 'menu').
   */
  const handleReset = useCallback(() => {
    setActiveQuestions(null);
    setState({
      mode: 'menu',
      current: 0,
      answers: new Array(questions.length).fill(null),
      showExplanation: false,
      timeRemaining: maxTime,
      timerActive: false,
    });
  }, [questions.length, maxTime]);

  return {
    state,
    currentQuestion,
    score,
    percentage,
    shuffled,
    handleStart,
    handleStartWith,
    handleAnswer,
    handleNext,
    handleReset,
    weakPoints: Array.from(weakPointsRef.current.entries())
      .filter(([, e]) => e.wrong > 0)
      .map(([module, e]) => ({ module, wrongCount: e.wrong, totalAttempted: e.total })),
  };
}
