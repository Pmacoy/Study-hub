import type { Domain } from './platform';

export type ScenarioDifficulty = 'junior' | 'mid' | 'senior';
export type ScenarioFormat = 'guided' | 'challenge';

/** A progressive hint the user can reveal one-by-one while solving a challenge */
export interface ChallengeHint {
  id: string;
  level: 1 | 2 | 3;                // 1 = nudge, 2 = pointer, 3 = near-answer
  label: string;                    // short title like "Dica 1"
  text: string;                     // the actual hint content
}

/** A single artifact the user can inspect while investigating (logs, config, output, screenshot) */
export interface ScenarioArtifact {
  id: string;
  label: string;         // "kubectl describe pod api-7d8f", "app.log", "terraform plan"
  language?: string;      // 'bash', 'yaml', 'log', 'text', 'json', ...
  content: string;
}

/** A stage in the investigation — a question or decision point with feedback */
export interface ScenarioStep {
  id: string;
  prompt: string;                             // "What do you check first?" — the question to the user
  options: ScenarioOption[];
  /** Which artifacts unlock/are relevant at this step (by id). Empty = all shown before still visible. */
  revealArtifacts?: string[];
  /** Optional short teaching note shown after any answer, before proceeding */
  teachingNote?: string;
}

export interface ScenarioOption {
  id: string;
  label: string;                              // the choice text
  correct: boolean;
  feedback: string;                           // why it's right or wrong
  /** If defined and correct === true, reveals extra artifacts before the next step */
  revealArtifacts?: string[];
}

export interface Scenario {
  id: string;
  domain: Domain;
  format: ScenarioFormat;
  title: string;
  hook: string;                                // the "you're paged at 3am" storytelling opener
  difficulty: ScenarioDifficulty;
  timeEstimateMin: number;
  tags: string[];                              // ["kubernetes", "pods", "resource limits"]
  /** Static artifacts always visible from the start (context, environment) */
  contextArtifacts: ScenarioArtifact[];
  /** Progressive artifacts revealed by steps */
  progressiveArtifacts: ScenarioArtifact[];
  steps: ScenarioStep[];
  /** Post-mortem / lessons learned shown at the end */
  resolution: {
    rootCause: string;
    fix: string;
    preventions: string[];                     // "Add resource limits", "Add liveness probe", ...
  };
}

/** A challenge-format scenario — same artifacts as guided, but user solves it open-ended */
export interface ChallengeScenario {
  id: string;
  domain: Domain;
  title: string;
  hook: string;
  difficulty: ScenarioDifficulty;
  timeEstimateMin: number;
  tags: string[];
  /** All artifacts shown upfront — the user inspects whatever they want */
  artifacts: ScenarioArtifact[];
  /** The diagnosis question */
  diagnosisQuestion: string;
  /** Multiple-choice options for the root cause */
  diagnosisOptions: { id: string; label: string; correct: boolean; feedback: string }[];
  /** The fix question */
  fixQuestion: string;
  /** Multiple-choice options for the fix */
  fixOptions: { id: string; label: string; correct: boolean; feedback: string }[];
  /** Progressive hints (reveal one at a time) */
  hints: ChallengeHint[];
  resolution: {
    rootCause: string;
    fix: string;
    preventions: string[];
  };
}

/** Result of a completed scenario attempt */
export interface ScenarioAttempt {
  scenarioId: string;
  completedAt: string;
  correctFirstTry: number;
  totalSteps: number;
  durationSec: number;
}

/** Result of a completed challenge attempt */
export interface ChallengeAttempt {
  scenarioId: string;
  completedAt: string;
  diagnosisCorrect: boolean;
  fixCorrect: boolean;
  hintsUsed: number;
  durationSec: number;
}

