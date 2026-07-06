import type { Flashcard } from '../../types/flashcard';
import type { Domain } from '../../types/platform';
import { devopsFlashcards } from './devopsFlashcards';
import { networkingFlashcards } from './networkingFlashcards';
import { azureFlashcards } from '../azure/flashcards';
import { pythonFlashcards } from './pythonFlashcards';

export const ALL_FLASHCARDS: Flashcard[] = [
  ...devopsFlashcards,
  ...azureFlashcards,
  ...networkingFlashcards,
  ...pythonFlashcards,
];

export const FLASHCARDS_BY_DOMAIN: Record<Domain, Flashcard[]> = {
  devops: devopsFlashcards,
  azure: azureFlashcards,
  networking: networkingFlashcards,
  python: pythonFlashcards,
  aws: [],
  gcp: [],
};
