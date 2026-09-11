export type DailyStepId = 'quiz' | 'flash' | 'study';

export interface DailyStepDef {
  id: DailyStepId;
  label: string;
  sublabel: string;
  estimateMin: number;
}

export const DAILY_STEPS: DailyStepDef[] = [
  { id: 'quiz', label: 'Questões do Dia', sublabel: 'Set novo todos os dias às 00:00', estimateMin: 8 },
  { id: 'flash', label: 'Cartões Relâmpago', sublabel: 'Revisão rápida com cronómetro', estimateMin: 4 },
  { id: 'study', label: 'Estudo Livre', sublabel: 'Abre qualquer módulo ainda não estudado hoje', estimateMin: 10 },
];

export interface DailyState {
  /** ISO date (YYYY-MM-DD) of the last day the user had activity */
  lastActiveDate: string | null;
  /** Current consecutive-day streak */
  streak: number;
  /** Longest streak ever achieved */
  bestStreak: number;
  /** ISO date this set of steps belongs to */
  sessionDate: string | null;
  /** Steps completed for `sessionDate` */
  completedSteps: DailyStepId[];
  /** Total points accumulated (1 per completed daily session across all domains) */
  totalPoints: number;
}

export const EMPTY_DAILY_STATE: DailyState = {
  lastActiveDate: null,
  streak: 0,
  bestStreak: 0,
  sessionDate: null,
  completedSteps: [],
  totalPoints: 0,
};

/**
 * Devolve a data de hoje em YYYY-MM-DD na **hora local** do utilizador.
 * Resolve o bug #3: datas UTC causavam dia errado em timezones a oeste de UTC.
 * Exemplo: Em Portugal (UTC+1), se forem 00:30 locais, toISOString() devolvia 23:29 de ontem.
 */
export function todayIso(): string {
  const d = new Date();
  // Ajusta para hora local: UTC - offsetMinutos
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * Calcula dias entre duas datas em YYYY-MM-DD.
 * Resolve o bug #6: devolvia NaN quando a data era inválida, congelando o streak.
 */
function daysBetween(a: string, b: string): number {
  // Validar formato YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a) || !/^\d{4}-\d{2}-\d{2}$/.test(b)) {
    console.warn(`[daysBetween] Data inválida: "${a}" ou "${b}". Devolvendo INFINITY.`);
    return Number.POSITIVE_INFINITY; // Força reset de streak (gap > 1)
  }

  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();

  if (!Number.isFinite(da) || !Number.isFinite(db)) {
    console.warn(`[daysBetween] Data parseada deu NaN. Devolvendo INFINITY.`);
    return Number.POSITIVE_INFINITY;
  }

  return Math.round((db - da) / 86_400_000);
}

/**
 * Call whenever the app loads or a step is completed.
 * Handles day-rollover: resets completedSteps for a new day,
 * and recalculates the streak based on gap since lastActiveDate.
 *
 * Resolve bugs #5 & #6:
 * - gap <= 0: relógio andou para trás (DST, fuso, UTC/local mismatch)
 * - NaN: data inválida, mantém-se no estado anterior
 */
export function reconcileDailyState(state: DailyState): DailyState {
  const today = todayIso();

  if (state.sessionDate === today) {
    // Same day — nothing to reconcile.
    return state;
  }

  // New day (or first ever visit)
  let nextStreak = state.streak;
  if (state.lastActiveDate) {
    const gap = daysBetween(state.lastActiveDate, today);
    if (gap === 1) {
      // consecutive day — streak continues, but only increments once a step is completed today
      nextStreak = state.streak;
    } else if (gap > 1) {
      // missed a day — streak resets
      nextStreak = 0;
    } else if (gap <= 0) {
      // ✨ BUG FIX #5: gap < 0 significa que o relógio andou para trás
      // (DST fall-back, ajuste manual, ou mismatch UTC/local)
      // Mantém o dia anterior, não reinicia os passos — evita duplicação de streak
      console.warn(`[reconcileDailyState] Clock went backwards (gap=${gap}). Mantendo sessionDate anterior.`);
      return {
        ...state,
        sessionDate: state.lastActiveDate || today,
      };
    }
  }

  return {
    ...state,
    sessionDate: today,
    completedSteps: [],
    streak: nextStreak,
  };
}

/**
 * Marks a step complete for today. Updates streak/points if this is
 * the first completed step of the day (i.e. the day "counts").
 *
 * Resolve bug #7: totalPoints nunca incrementava (ternário no-op).
 */
export function completeStep(state: DailyState, step: DailyStepId): DailyState {
  const today = todayIso();
  const reconciled = reconcileDailyState(state);

  if (reconciled.completedSteps.includes(step)) {
    return reconciled; // already done today
  }

  const wasFirstStepToday = reconciled.completedSteps.length === 0;
  const newCompleted = [...reconciled.completedSteps, step];
  const allDone = allStepsComplete({ ...reconciled, completedSteps: newCompleted });

  let newStreak = reconciled.streak;
  if (wasFirstStepToday) {
    // First activity of the day → streak grows (or starts at 1)
    newStreak = reconciled.lastActiveDate === null
      ? 1
      : reconciled.streak + 1;
  }

  return {
    ...reconciled,
    completedSteps: newCompleted,
    lastActiveDate: today,
    streak: newStreak,
    bestStreak: Math.max(reconciled.bestStreak, newStreak),
    // ✨ BUG FIX #7: incrementa totalPoints quando todos os passos diários são completos
    totalPoints: allDone ? reconciled.totalPoints + 1 : reconciled.totalPoints,
  };
}

export function allStepsComplete(state: DailyState): boolean {
  return DAILY_STEPS.every(s => state.completedSteps.includes(s.id));
}
