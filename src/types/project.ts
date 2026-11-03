import type { ReactNode } from 'react';

export type ProjectDifficulty = 'foundations' | 'intermediate' | 'advanced' | 'expert';

export type ProjectStatus = 'not-started' | 'in-progress' | 'done';

export interface ProjectItem {
  id: string;              // "p01", "p02"...
  number: number;          // 1-50
  title: string;
  whatYouBuild: string;    // "O que constróis"
  concepts: string[];      // core concepts covered
  stack: string[];         // tools/tech used (for tags/filtering)
  whyItMatters: string;    // "Porque importa"
  difficulty: ProjectDifficulty;
  sectionId: string;
  
  // Detalhe Profundo do Projeto (Opcionais enquanto migramos)
  scenario?: string;               // Cenário real corporativo
  architectureSteps?: string[];    // Passos de implementação
  acceptanceCriteria?: string[];   // Definition of Done / Checklist
  bonusChallenge?: string;         // Desafio extra para advanced
}

export interface ProjectSection {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  emoji?: string;
  icon?: ReactNode;
  outcome: string;         // "Depois destes projectos vais entender..."
}
