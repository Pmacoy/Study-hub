import type { Domain } from './platform';

/** Nível de auto-avaliação para uma área */
export type SkillLevel = 0 | 1 | 2 | 3;

export const SKILL_LEVELS: { value: SkillLevel; label: string; short: string }[] = [
  { value: 0, label: 'Nunca usei',          short: 'Nunca' },
  { value: 1, label: 'Sei o básico',        short: 'Básico' },
  { value: 2, label: 'Uso no dia-a-dia',    short: 'Uso' },
  { value: 3, label: 'Consigo ensinar',     short: 'Ensino' },
];

export interface DiagnosticArea {
  id: string;
  label: string;
  emoji: string;
  /** A pergunta de auto-avaliação */
  prompt: string;
  /** Porque esta área importa */
  whyItMatters: string;
  /** O que praticar para subir de nível */
  whatToPractise: string;
  /** O sinal concreto de que dominas */
  masterySignal: string;
  /** Para onde o hub te leva */
  target: {
    domain: Domain;
    tab?: string;
    scenarioIds?: string[];
    terminalSessionIds?: string[];
  };
}

export interface DiagnosticResult {
  areaId: string;
  level: SkillLevel;
}
