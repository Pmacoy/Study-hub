import { useCallback, useEffect, useState } from 'react';
import { TERMINAL_ATTEMPTS_STORAGE_KEY } from '../data/storageKeys';
import type { TerminalAttempt } from '../types/terminal';

export function useTerminalAttempts() {
  const [attempts, setAttempts] = useState<TerminalAttempt[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TERMINAL_ATTEMPTS_STORAGE_KEY);
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
      localStorage.setItem(TERMINAL_ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    } catch { /* ignore */ }
  }, [attempts, loaded]);

  const record = useCallback((attempt: TerminalAttempt) => {
    setAttempts(prev => [...prev, attempt].slice(-100));
  }, []);

  const bestAttemptFor = useCallback((sessionId: string): TerminalAttempt | null => {
    const forSession = attempts.filter(a => a.sessionId === sessionId);
    if (forSession.length === 0) return null;
    return forSession.reduce((best, cur) =>
      cur.objectivesHit / cur.totalObjectives > best.objectivesHit / best.totalObjectives ? cur : best
    );
  }, [attempts]);

  return { attempts, record, bestAttemptFor };
}
