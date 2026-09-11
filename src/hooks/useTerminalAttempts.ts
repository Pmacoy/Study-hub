import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';
import { isTerminalAttempts } from '../types/validators';
import { TERMINAL_ATTEMPTS_STORAGE_KEY } from '../data/storageKeys';
import type { TerminalAttempt } from '../types/terminal';

export function useTerminalAttempts() {
  const [attempts, setAttempts] = usePersistedState(
    TERMINAL_ATTEMPTS_STORAGE_KEY,
    [],
    isTerminalAttempts
  );

  const record = useCallback((attempt: TerminalAttempt) => {
    setAttempts((prev) => [...prev, attempt].slice(-100));
  }, [setAttempts]);

  const bestAttemptFor = useCallback(
    (sessionId: string): TerminalAttempt | null => {
      const forSession = attempts.filter((a) => a.sessionId === sessionId);
      if (forSession.length === 0) return null;

      // ✨ BUG FIX #13: evitar divisão por zero
      return forSession.reduce((best, cur) => {
        const curRatio = cur.totalObjectives > 0 ? cur.objectivesHit / cur.totalObjectives : 0;
        const bestRatio = best.totalObjectives > 0 ? best.objectivesHit / best.totalObjectives : 0;
        return curRatio > bestRatio ? cur : best;
      });
    },
    [attempts]
  );

  return { attempts, record, bestAttemptFor };
}
