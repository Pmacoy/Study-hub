import type { Question } from '../hooks/useQuizEngine';
import { ALL_QUESTIONS } from './azure/examQuestions';
import { ALL_AWS_QUESTIONS } from './aws/examQuestions';
import { QUESTIONS as DEVOPS_QUESTIONS } from '../components/devops/ExamSimulator';
import { QUESTIONS as PYTHON_QUESTIONS } from '../components/python/PythonExamSimulator';

/**
 * Pool unificada de questões de todos os domínios para o Daily Quiz.
 */
export const ALL_DAILY_QUESTIONS: Question<string>[] = [
  ...ALL_QUESTIONS.map(q => ({ q: q.question, opts: q.options, a: q.correctIndex, exp: q.explanation, mod: 'Azure' })),
  ...ALL_AWS_QUESTIONS.map(q => ({ q: q.question, opts: q.options, a: q.correctIndex, exp: q.explanation, mod: q.topicLabel })),
  ...DEVOPS_QUESTIONS,
  ...PYTHON_QUESTIONS,
];

/**
 * Embaralha de forma determinística com seed baseada na data.
 */
function deterministicShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickDailyQuestions(count: number, seed: string): Question<string>[] {
  return deterministicShuffle(ALL_DAILY_QUESTIONS, seed).slice(0, count);
}
