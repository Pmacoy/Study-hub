import { useCallback, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';
import { isGamificationState } from '../types/validators';
import { GAMIFICATION_STORAGE_KEY } from '../data/storageKeys';
import { EMPTY_GAMIFICATION_STATE, getLevelForXp } from '../types/gamification';

// Constants for XP
export const XP_PER_QUIZ_CORRECT_ANSWER = 10;
export const XP_DAILY_COMPLETION = 100;

export function useGamification() {
  const [state, setState, loaded] = usePersistedState(
    GAMIFICATION_STORAGE_KEY,
    EMPTY_GAMIFICATION_STATE,
    isGamificationState
  );

  // Migration logic from old points system could be added here if needed

  const addXp = useCallback(
    (amount: number) => {
      setState((prev) => {
        const newXp = prev.xp + amount;
        const newLevel = getLevelForXp(newXp);
        
        // Return updated state
        return {
          ...prev,
          xp: newXp,
          level: newLevel > prev.level ? newLevel : prev.level,
        };
      });
    },
    [setState]
  );

  const awardBadge = useCallback(
    (badgeId: string) => {
      setState((prev) => {
        if (prev.badges.includes(badgeId)) {
          return prev; // Already has badge
        }
        return {
          ...prev,
          badges: [...prev.badges, badgeId],
        };
      });
    },
    [setState]
  );

  return { gamification: state, addXp, awardBadge, loaded };
}
