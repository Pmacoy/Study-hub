import type { Flashcard } from '../../types/flashcard';
import type { Domain } from '../../types/platform';
import { devopsFlashcards } from './devopsFlashcards';
import { networkingFlashcards } from './networkingFlashcards';
import { azureFlashcards } from '../azure/flashcards';
import { azureFlashcards as azureStaticFlashcards } from './azureFlashcards';
import { pythonFlashcards } from './pythonFlashcards';

export const ALL_FLASHCARDS: Flashcard[] = [
  ...devopsFlashcards,
  ...azureFlashcards,
  ...azureStaticFlashcards,
  ...networkingFlashcards,
  ...pythonFlashcards,
];

export const DOMAIN_FLASHCARDS: Record<Domain, Flashcard[]> = {
  devops: devopsFlashcards,
  azure: [...azureFlashcards, ...azureStaticFlashcards],
  networking: networkingFlashcards,
  python: pythonFlashcards,
  aws: [],
  gcp: [],
  'system-design': [],
  'distributed-systems': [],
  'algorithms': [],
};
