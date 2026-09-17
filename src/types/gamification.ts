export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  badges: string[];
}

export const EMPTY_GAMIFICATION_STATE: GamificationState = {
  xp: 0,
  level: 1,
  badges: [],
};

// Level formula: Level N requires N * 100 XP to reach from N-1.
// Level 1: 0 XP
// Level 2: 100 XP
// Level 3: 300 XP (100 + 200)
// Level 4: 600 XP (300 + 300)
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += (i - 1) * 100;
  }
  return total;
}

export function getLevelForXp(xp: number): number {
  let level = 1;
  while (xp >= getXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'first_blood', name: 'Primeiro Sangue', description: 'Completou seu primeiro quiz.', icon: '🎯' },
  { id: 'streak_3', name: 'Ofensiva de 3 Dias', description: 'Manteve uma ofensiva de 3 dias seguidos.', icon: '🔥' },
  { id: 'night_owl', name: 'Coruja', description: 'Estudou depois da meia-noite.', icon: '🦉' },
  { id: 'perfect_score', name: 'Perfeição', description: 'Acertou 100% em um quiz.', icon: '🏆' },
];
