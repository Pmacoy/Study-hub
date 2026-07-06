import { useEffect, useState, useCallback } from 'react';
import { DAILY_STORAGE_KEY } from '../data/storageKeys';
import type { DailyState, DailyStepId } from '../types/daily';
import { EMPTY_DAILY_STATE, reconcileDailyState, completeStep, todayIso } from '../types/daily';

export function useDailyState() {
  const [state, setState] = useState<DailyState>(EMPTY_DAILY_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load + reconcile on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DAILY_STORAGE_KEY);
      const parsed: DailyState = raw ? JSON.parse(raw) : EMPTY_DAILY_STATE;
      const reconciled = reconcileDailyState(parsed);
      setState(reconciled);
    } catch {
      setState(reconcileDailyState(EMPTY_DAILY_STATE));
    } finally {
      setLoaded(true);
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state, loaded]);

  const markStepComplete = useCallback((step: DailyStepId) => {
    setState(prev => completeStep(prev, step));
  }, []);

  const isStepDoneToday = useCallback((step: DailyStepId) => {
    return state.sessionDate === todayIso() && state.completedSteps.includes(step);
  }, [state]);

  return { daily: state, markStepComplete, isStepDoneToday, loaded };
}
