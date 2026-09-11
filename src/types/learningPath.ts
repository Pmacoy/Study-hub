import type { ReactNode } from 'react';
import type { Domain } from './platform';

export type PathNodeStatus = 'done' | 'in-progress' | 'todo';

/** A single step in a learning path — usually maps to a study module */
export interface PathNode {
  id: string;                // matches the tab id in the domain (e.g. 'iam', 'linux')
  label: string;
  subtitle: string;
  icon: ReactNode;
  estimatedMin: number;
  /** goalTag to match against completed scenarios/terminal sessions */
  scenarioIds?: string[];
  terminalSessionIds?: string[];
}

/** A learning path — a sequence of nodes with a goal */
export interface LearningPath {
  id: string;                 // "az-104", "aws-saa-c03", "networking-fundamentals"
  domain: Domain;
  title: string;
  subtitle: string;
  goal: string;               // "Passar o exame AZ-104"
  icon: ReactNode;
  colorAccent: string;         // "sky", "orange", "emerald", "amber", "violet"
  totalHours: number;
  nodes: PathNode[];
}

/** Live computed status for each node (based on visited tabs, attempts, etc) */
export interface PathProgress {
  totalNodes: number;
  doneNodes: number;
  inProgressNodes: number;
  todoNodes: number;
  percentage: number;
  nextRecommendedNode: PathNode | null;
}
