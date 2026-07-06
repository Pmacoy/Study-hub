import { useEffect, useState, useCallback } from 'react';
import { ACTIVITY_LOG_STORAGE_KEY } from '../data/storageKeys';
import type { ActivityEntry, ActivityType } from '../types/progress';
import { appendActivity } from '../types/progress';
import { todayIso } from '../types/daily';

export function useActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACTIVITY_LOG_STORAGE_KEY);
      setEntries(raw ? JSON.parse(raw) : []);
    } catch {
      setEntries([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(ACTIVITY_LOG_STORAGE_KEY, JSON.stringify(entries));
    } catch { /* ignore */ }
  }, [entries, loaded]);

  const logActivity = useCallback((type: ActivityType, ratio: number) => {
    setEntries(prev => appendActivity(prev, { date: todayIso(), type, ratio }));
  }, []);

  return { entries, logActivity };
}
