import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';
import { isChallengeAttempts } from '../types/validators';
import { CHALLENGE_ATTEMPTS_STORAGE_KEY } from '../data/storageKeys';
import type { ChallengeAttempt } from '../types/scenario';

export function useChallengeAttempts() {
  const [attempts, setAttempts] = usePersistedState(
    CHALLENGE_ATTEMPTS_STORAGE_KEY,
    [],
    isChallengeAttempts
  );

  const record = useCallback((attempt: ChallengeAttempt) => {
    setAttempts((prev) => [...prev, attempt].slice(-100));
  }, [setAttempts]);

  const bestAttemptFor = useCallback(
    (scenarioId: string): ChallengeAttempt | null => {
      const forThisScenario = attempts.filter((a) => a.scenarioId === scenarioId);
      if (forThisScenario.length === 0) return null;

      return forThisScenario.reduce((best, cur) => {
        // Score: both correct, fewer hints used, faster
        const curScore =
          (cur.diagnosisCorrect ? 1 : 0) +
          (cur.fixCorrect ? 1 : 0) -
          cur.hintsUsed * 0.1 -
          cur.durationSec / 3600;
        const bestScore =
          (best.diagnosisCorrect ? 1 : 0) +
          (best.fixCorrect ? 1 : 0) -
          best.hintsUsed * 0.1 -
          best.durationSec / 3600;
        return curScore > bestScore ? cur : best;
      });
    },
    [attempts]
  );

  return { attempts, record, bestAttemptFor };
}
