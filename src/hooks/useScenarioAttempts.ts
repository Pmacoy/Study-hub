import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';
import { isScenarioAttempts } from '../types/validators';
import { SCENARIO_ATTEMPTS_STORAGE_KEY } from '../data/storageKeys';
import type { ScenarioAttempt } from '../types/scenario';

export function useScenarioAttempts() {
  const [attempts, setAttempts] = usePersistedState(
    SCENARIO_ATTEMPTS_STORAGE_KEY,
    [],
    isScenarioAttempts
  );

  const record = useCallback((attempt: ScenarioAttempt) => {
    setAttempts((prev) => [...prev, attempt].slice(-100));
  }, [setAttempts]);

  const bestAttemptFor = useCallback(
    (scenarioId: string): ScenarioAttempt | null => {
      const forThisScenario = attempts.filter((a) => a.scenarioId === scenarioId);
      if (forThisScenario.length === 0) return null;

      // ✨ BUG FIX #13: evitar divisão por zero
      return forThisScenario.reduce((best, cur) => {
        const curRatio = cur.totalSteps > 0 ? cur.correctFirstTry / cur.totalSteps : 0;
        const bestRatio = best.totalSteps > 0 ? best.correctFirstTry / best.totalSteps : 0;
        return curRatio > bestRatio ? cur : best;
      });
    },
    [attempts]
  );

  return { attempts, record, bestAttemptFor };
}
