import { useCallback, useEffect, useState } from 'react';
import { DIAGNOSTIC_STORAGE_KEY } from '../data/storageKeys';
import type { SkillLevel } from '../types/diagnostic';

interface StoredDiagnostic {
  levels: Record<string, SkillLevel>;
  completedAt: string | null;
}

export function useDiagnostic() {
  const [levels, setLevels] = useState<Record<string, SkillLevel>>({});
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
      if (raw) {
        const parsed: StoredDiagnostic = JSON.parse(raw);
        setLevels(parsed.levels ?? {});
        setCompletedAt(parsed.completedAt ?? null);
      }
    } catch {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        DIAGNOSTIC_STORAGE_KEY,
        JSON.stringify({ levels, completedAt } satisfies StoredDiagnostic)
      );
    } catch {
      /* ignore */
    }
  }, [levels, completedAt, loaded]);

  const setLevel = useCallback((areaId: string, level: SkillLevel) => {
    setLevels(prev => ({ ...prev, [areaId]: level }));
  }, []);

  const markCompleted = useCallback(() => {
    setCompletedAt(new Date().toISOString());
  }, []);

  const reset = useCallback(() => {
    setLevels({});
    setCompletedAt(null);
  }, []);

  return { levels, completedAt, setLevel, markCompleted, reset, loaded };
}
