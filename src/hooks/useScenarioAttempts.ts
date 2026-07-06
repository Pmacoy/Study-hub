import { useCallback, useEffect, useState } from 'react';
import { SCENARIO_ATTEMPTS_STORAGE_KEY } from '../data/storageKeys';
import type { ScenarioAttempt } from '../types/scenario';

export function useScenarioAttempts() {
  const [attempts, setAttempts] = useState<ScenarioAttempt[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SCENARIO_ATTEMPTS_STORAGE_KEY);
      setAttempts(raw ? JSON.parse(raw) : []);
    } catch {
      setAttempts([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SCENARIO_ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    } catch { /* ignore */ }
  }, [attempts, loaded]);

  const record = useCallback((attempt: ScenarioAttempt) => {
    setAttempts(prev => [...prev, attempt].slice(-100));
  }, []);

  const bestAttemptFor = useCallback((scenarioId: string): ScenarioAttempt | null => {
    const forThisScenario = attempts.filter(a => a.scenarioId === scenarioId);
    if (forThisScenario.length === 0) return null;
    return forThisScenario.reduce((best, cur) =>
      cur.correctFirstTry / cur.totalSteps > best.correctFirstTry / best.totalSteps ? cur : best
    );
  }, [attempts]);

  return { attempts, record, bestAttemptFor };
}
