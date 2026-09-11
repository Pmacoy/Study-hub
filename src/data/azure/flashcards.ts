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

/**
 * Padronização: todos os flashcards seguem o formato:
 * - front: pergunta/conceito a memorizar
 * - back: explicação + dica de exame (💡)
 * - category: agrupamento pelo módulo do conhecimentoBase
 * - domain: 'azure' para filtragem no flashcard viewer
 *
 * A knowledgeBase estrutura os dados em abas (identity, governance, rbac, etc.)
 * e cada item contém title, desc, e tip — mapeados directamente para flashcard.
 */
