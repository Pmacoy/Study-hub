import { useCallback, useEffect, useState } from 'react';
import { usePersistedState } from './usePersistedState';
import { isDailyState } from '../types/validators';
import { DAILY_STORAGE_KEY } from '../data/storageKeys';
import type { DailyState, DailyStepId } from '../types/daily';
import { EMPTY_DAILY_STATE, reconcileDailyState, completeStep, todayIso, allStepsComplete } from '../types/daily';
import { useGamification, XP_DAILY_COMPLETION } from './useGamification';

export function useDailyState() {
  const [state, setState, loaded] = usePersistedState(
    DAILY_STORAGE_KEY,
    EMPTY_DAILY_STATE,
    isDailyState
  );

  // Reconciliar ao carregar ou quando o dia muda
  const [lastReconciled, setLastReconciled] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) return;

    const today = todayIso();
    // Só reconcilia se a data mudou desde a última reconciliação
    if (lastReconciled !== today) {
      const reconciled = reconcileDailyState(state);
      if (reconciled !== state) {
        setState(reconciled);
      }
      setLastReconciled(today);
    }
  }, [loaded, state, lastReconciled, setState]);

  const { addXp, awardBadge } = useGamification();

  const markStepComplete = useCallback(
    (step: DailyStepId) => {
      setState((prev) => {
        const nextState = completeStep(prev, step);
        // Only if it wasn't complete before but is complete now
        const wasAllComplete = allStepsComplete(prev);
        const isAllComplete = allStepsComplete(nextState);
        
        if (!wasAllComplete && isAllComplete) {
          addXp(XP_DAILY_COMPLETION);
        }
        
        if (nextState.streak >= 3) {
          awardBadge('streak_3');
        }

        return nextState;
      });
    },
    [setState, addXp, awardBadge]
  );

  const isStepDoneToday = useCallback(
    (step: DailyStepId) => {
      return state.sessionDate === todayIso() && state.completedSteps.includes(step);
    },
    [state.sessionDate, state.completedSteps]
  );

  return { daily: state, markStepComplete, isStepDoneToday, loaded };
}
