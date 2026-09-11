import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';
import { isActivityEntries } from '../types/validators';
import { ACTIVITY_LOG_STORAGE_KEY } from '../data/storageKeys';
import type { ActivityEntry, ActivityType } from '../types/progress';
import { appendActivity } from '../types/progress';
import { todayIso } from '../types/daily';

export function useActivityLog() {
  const [entries, setEntries] = usePersistedState(
    ACTIVITY_LOG_STORAGE_KEY,
    [],
    isActivityEntries
  );

  const logActivity = useCallback(
    (type: ActivityType, ratio: number) => {
      setEntries((prev) => appendActivity(prev, { date: todayIso(), type, ratio }));
    },
    [setEntries]
  );

  return { entries, logActivity };
}
