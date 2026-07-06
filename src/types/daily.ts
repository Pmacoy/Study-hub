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

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86_400_000);
}

/**
 * Call whenever the app loads or a step is completed.
 * Handles day-rollover: resets completedSteps for a new day,
 * and recalculates the streak based on gap since lastActiveDate.
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
    }
    // gap === 0 shouldn't happen since sessionDate !== today check above, but guard anyway
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
 */
export function completeStep(state: DailyState, step: DailyStepId): DailyState {
  const today = todayIso();
  const reconciled = reconcileDailyState(state);

  if (reconciled.completedSteps.includes(step)) {
    return reconciled; // already done today
  }

  const wasFirstStepToday = reconciled.completedSteps.length === 0;
  const newCompleted = [...reconciled.completedSteps, step];

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
    totalPoints: wasFirstStepToday ? reconciled.totalPoints : reconciled.totalPoints,
  };
}

export function allStepsComplete(state: DailyState): boolean {
  return DAILY_STEPS.every(s => state.completedSteps.includes(s.id));
}
