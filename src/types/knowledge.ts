export type KnowledgePriority = 'alta' | 'média';
export type KnowledgeDifficulty = 'fácil' | 'média' | 'alta';

export type KnowledgeIcon =
  | 'fingerprint'
  | 'lock'
  | 'scale'
  | 'database'
  | 'cpu'
  | 'network'
  | 'activity'
  | 'book-open'
  | 'shield-check';

export interface KnowledgeItem {
  icon: KnowledgeIcon;
  title: string;
  desc: string;
  tip: string;
  trap: string;
  keywords: string[];
  priority: KnowledgePriority;
  difficulty: KnowledgeDifficulty;
  docLink: string;
}

export interface DomainPack {
  title: string;
  subtitle: string;
  examFocus: string;
  items: KnowledgeItem[];
}
// Alias for backward compat
export type Difficulty = KnowledgeDifficulty;
