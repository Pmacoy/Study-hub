import type { Domain } from './platform';

export type ScenarioDifficulty = 'junior' | 'mid' | 'senior';
export type ScenarioFormat = 'guided'; // future: 'terminal' | 'architecture' | 'postmortem'

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

/** Result of a completed scenario attempt */
export interface ScenarioAttempt {
  scenarioId: string;
  completedAt: string;
  correctFirstTry: number;                     // steps where user picked the right option first
  totalSteps: number;
  durationSec: number;
}
