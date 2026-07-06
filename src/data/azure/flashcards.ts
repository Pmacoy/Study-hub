import { knowledgeData } from './knowledgeBase';
import type { Flashcard } from '../../types/flashcard';

export const azureFlashcards: Flashcard[] = Object.entries(knowledgeData).flatMap(
  ([tabId, pack]) =>
    pack.items.map((item, i) => ({
      id: `azure-${tabId}-${i}`,
      domain: 'azure' as const,
      category: pack.title,
      front: item.title,
      back: `${item.desc} 💡 ${item.tip}`,
    }))
);
