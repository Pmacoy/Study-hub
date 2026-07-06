import type { Domain } from './platform';

export interface Flashcard {
  id: string;
  domain: Domain;
  category: string;   // e.g. "Linux", "Identity", "OSI"
  front: string;      // term / question
  back: string;       // definition / answer
}

export interface FlashRoundResult {
  cardsSeen: number;
  knewCount: number;
  bestStreak: number;
  durationSec: number;
}
