import type { Flashcard } from '../../types/flashcard';
import type { Domain } from '../../types/platform';
import { devopsFlashcards } from './devopsFlashcards';
import { networkingFlashcards } from './networkingFlashcards';
import { azureFlashcards } from '../azure/flashcards';
import { azureFlashcards as azureStaticFlashcards } from './azureFlashcards';
import { pythonFlashcards } from './pythonFlashcards';
import { awsFlashcards } from './awsFlashcards';
import { socFlashcards } from './socFlashcards';

export const ALL_FLASHCARDS: Flashcard[] = [
  ...devopsFlashcards,
  ...azureFlashcards,
  ...azureStaticFlashcards,
  ...networkingFlashcards,
  ...pythonFlashcards,
  ...awsFlashcards,
  ...socFlashcards,
];

export const DOMAIN_FLASHCARDS: Record<Domain, Flashcard[]> = {
  devops: devopsFlashcards,
  azure: [...azureFlashcards, ...azureStaticFlashcards],
  networking: networkingFlashcards,
  python: pythonFlashcards,
  aws: awsFlashcards,
  gcp: [],
  oci: [],
  'system-design': [],
  'distributed-systems': [],
  'algorithms': [],
  'cybersecurity': socFlashcards,
  'data-engineering': [],
  'ai-ml': [],
  'citrix': [],
};
