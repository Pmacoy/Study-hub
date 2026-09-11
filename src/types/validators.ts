/**
 * Type-guards para validar dados do localStorage.
 * Previne crashes quando o localStorage tem dados corrompidos ou no formato errado.
 */

import type { DailyState } from './daily';
import type { ActivityEntry } from './progress';
import type { ChallengeAttempt, ScenarioAttempt } from './scenario';
import type { TerminalAttempt } from './terminal';

// ── DailyState ───────────────────────────────────────────────────────────────

/**
 * Valida se um valor desconhecido é um DailyState válido.
 */
export function isDailyState(v: unknown): v is DailyState {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    Array.isArray(s.completedSteps) &&
    s.completedSteps.every((x) => typeof x === 'string') &&
    typeof s.streak === 'number' &&
    Number.isFinite(s.streak) &&
    s.streak >= 0 &&
    typeof s.bestStreak === 'number' &&
    Number.isFinite(s.bestStreak) &&
    s.bestStreak >= 0 &&
    (s.lastActiveDate === null ||
      (typeof s.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.lastActiveDate))) &&
    (s.sessionDate === null ||
      (typeof s.sessionDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.sessionDate))) &&
    typeof s.totalPoints === 'number' &&
    Number.isFinite(s.totalPoints) &&
    s.totalPoints >= 0
  );
}

// ── ActivityEntry ────────────────────────────────────────────────────────────

/**
 * Valida um array de ActivityEntry.
 */
export function isActivityEntries(v: unknown): v is ActivityEntry[] {
  return Array.isArray(v) && v.every(isActivityEntry);
}

function isActivityEntry(v: unknown): v is ActivityEntry {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(a.date as string) &&
    (a.type === 'quiz' || a.type === 'flash') &&
    typeof a.ratio === 'number' &&
    Number.isFinite(a.ratio) &&
    a.ratio >= 0 &&
    a.ratio <= 1
  );
}

// ── ScenarioAttempt ──────────────────────────────────────────────────────────

/**
 * Valida um array de ScenarioAttempt.
 */
export function isScenarioAttempts(v: unknown): v is ScenarioAttempt[] {
  return Array.isArray(v) && v.every(isScenarioAttempt);
}

function isScenarioAttempt(v: unknown): v is ScenarioAttempt {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.scenarioId === 'string' &&
    typeof a.completedAt === 'string' &&
    typeof a.correctFirstTry === 'number' &&
    Number.isFinite(a.correctFirstTry) &&
    a.correctFirstTry >= 0 &&
    typeof a.totalSteps === 'number' &&
    Number.isFinite(a.totalSteps) &&
    a.totalSteps > 0 &&
    typeof a.durationSec === 'number' &&
    Number.isFinite(a.durationSec) &&
    a.durationSec >= 0
  );
}

// ── TerminalAttempt ──────────────────────────────────────────────────────────

/**
 * Valida um array de TerminalAttempt.
 */
export function isTerminalAttempts(v: unknown): v is TerminalAttempt[] {
  return Array.isArray(v) && v.every(isTerminalAttempt);
}

function isTerminalAttempt(v: unknown): v is TerminalAttempt {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.sessionId === 'string' &&
    typeof a.completedAt === 'string' &&
    typeof a.totalCommands === 'number' &&
    Number.isFinite(a.totalCommands) &&
    a.totalCommands >= 0 &&
    typeof a.objectivesHit === 'number' &&
    Number.isFinite(a.objectivesHit) &&
    a.objectivesHit >= 0 &&
    typeof a.totalObjectives === 'number' &&
    Number.isFinite(a.totalObjectives) &&
    a.totalObjectives > 0 &&
    typeof a.durationSec === 'number' &&
    Number.isFinite(a.durationSec) &&
    a.durationSec >= 0
  );
}

// ── VisitedTabs (Set serializado como array) ────────────────────────────────

/**
 * Valida um array que pode ser usado como visited-tabs.
 * Cada item deve ser uma string não-vazia.
 */
function isChallengeAttempt(v: unknown): v is ChallengeAttempt {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.scenarioId === 'string' &&
    typeof a.completedAt === 'string' &&
    typeof a.diagnosisCorrect === 'boolean' &&
    typeof a.fixCorrect === 'boolean' &&
    typeof a.hintsUsed === 'number' &&
    Number.isFinite(a.hintsUsed) &&
    a.hintsUsed >= 0 &&
    typeof a.durationSec === 'number' &&
    Number.isFinite(a.durationSec) &&
    a.durationSec >= 0
  );
}

export function isChallengeAttempts(v: unknown): v is ChallengeAttempt[] {
  return Array.isArray(v) && v.every(isChallengeAttempt);
}

export function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string' && x.length > 0);
}
