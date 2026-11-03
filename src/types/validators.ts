import type { DailyState } from './daily';
import type { ActivityEntry } from './progress';
import type { GamificationState } from './gamification';
import type { ChallengeAttempt, ScenarioAttempt } from './scenario';
import type { TerminalAttempt } from './terminal';

export function isDailyState(v: unknown): v is DailyState {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    Array.isArray(s.completedSteps) &&
    s.completedSteps.every((x) => typeof x === 'string') &&
    typeof s.streak === 'number' &&
    Number.isFinite(s.streak) &&
    typeof s.bestStreak === 'number' &&
    (s.lastActiveDate === null || typeof s.lastActiveDate === 'string') &&
    typeof s.totalPoints === 'number'
  );
}

export function isActivityEntries(v: unknown): v is ActivityEntry[] {
  if (!Array.isArray(v)) return false;
  return v.every(e => 
    e && typeof e === 'object' && 
    typeof (e as any).id === 'string' &&
    typeof (e as any).timestamp === 'string'
  );
}

export function isGamificationState(v: unknown): v is GamificationState {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return typeof s.totalXp === 'number' && typeof s.level === 'number';
}

export function isChallengeAttempts(v: unknown): v is ChallengeAttempt[] {
  if (!Array.isArray(v)) return false;
  return v.every(e => 
    e && typeof e === 'object' && 
    typeof (e as any).scenarioId === 'string'
  );
}

export function isScenarioAttempts(v: unknown): v is ScenarioAttempt[] {
  if (!Array.isArray(v)) return false;
  return v.every(e => 
    e && typeof e === 'object' && 
    typeof (e as any).scenarioId === 'string'
  );
}

export function isTerminalAttempts(v: unknown): v is TerminalAttempt[] {
  if (!Array.isArray(v)) return false;
  return v.every(e => 
    e && typeof e === 'object' && 
    typeof (e as any).sessionId === 'string'
  );
}
