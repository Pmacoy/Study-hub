import { useCallback, useEffect, useState } from 'react';
import { usePersistedState } from './usePersistedState';
import { isDailyState } from '../types/validators';
import { DAILY_STORAGE_KEY } from '../data/storageKeys';
import type { DailyState, DailyStepId } from '../types/daily';
import { EMPTY_DAILY_STATE, reconcileDailyState, completeStep, todayIso } from '../types/daily';

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

  const markStepComplete = useCallback(
    (step: DailyStepId) => {
      setState((prev) => completeStep(prev, step));
    },
    [setState]
  );

  const isStepDoneToday = useCallback(
    (step: DailyStepId) => {
      return state.sessionDate === todayIso() && state.completedSteps.includes(step);
    },
    [state.sessionDate, state.completedSteps]
  );

  return { daily: state, markStepComplete, isStepDoneToday, loaded };
}
