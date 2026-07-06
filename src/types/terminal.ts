import type { Domain } from './platform';

export type TerminalDifficulty = 'junior' | 'mid' | 'senior';

/** A command pattern the terminal knows how to respond to. */
export interface CommandHandler {
  id: string;
  /**
   * Tokens after normalisation. Aliases allow flexibility.
   * Example: [['kubectl'], ['get'], ['pods', 'po', 'pod']]
   * A user typing "kubectl get po" matches this.
   */
  tokens: string[][];
  /**
   * Optional flag matchers. Order-independent.
   * Example: [{ names: ['-n', '--namespace'], valueRequired: true }]
   */
  flags?: FlagSpec[];
  /**
   * Static output OR function that receives matched flags for dynamic output.
   */
  output: string | ((ctx: MatchContext) => string);
  /** Optional: tag as a "goal" step — advances the objective progress */
  goalTag?: string;
  /** Note shown once when this command is first successfully run */
  teachingNote?: string;
}

export interface FlagSpec {
  names: string[];
  valueRequired?: boolean;
  /** if provided, only accept these values */
  valueEnum?: string[];
}

export interface MatchContext {
  /** Raw command as typed */
  raw: string;
  /** Values collected from flags: { '-n' or '--namespace' → 'checkout' } */
  flagValues: Record<string, string | true>;
  /** Positional args after the matched tokens */
  positionalArgs: string[];
}

export interface Objective {
  id: string;
  label: string;              // "Descobrir por que o pod está a crashar"
  hint: string;               // "Começa por listar os pods no namespace 'checkout'"
  /** goalTag from a CommandHandler that completes this objective */
  goalTag: string;
}

export interface TerminalSession {
  id: string;
  domain: Domain;
  title: string;
  hook: string;                // storytelling opener
  shell: string;                // "kubectl", "bash", "az"
  prompt: string;                // "$ ", "user@runner:~$ "
  difficulty: TerminalDifficulty;
  timeEstimateMin: number;
  tags: string[];

  /** The scenario setup — shown at the start */
  briefing: string;
  /** Ordered objectives — the "path" through the session */
  objectives: Objective[];
  /** Commands the session knows how to respond to */
  handlers: CommandHandler[];
  /** Free-form hints if the user is stuck (typed "hint" or "?") */
  stuckHints: string[];
  /** Wrap-up shown when all objectives complete */
  debrief: {
    lesson: string;
    keyCommands: string[];
  };
}

export interface TerminalHistoryEntry {
  cmd: string;
  output: string;
  isError?: boolean;
  isSystem?: boolean;         // teaching notes, hints, welcome
}

export interface TerminalAttempt {
  sessionId: string;
  completedAt: string;
  totalCommands: number;
  objectivesHit: number;
  totalObjectives: number;
  durationSec: number;
}
