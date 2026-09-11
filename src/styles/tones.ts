/**
 * @deprecated Consolidado em `src/design/colorTokens.ts` (2026-09-11).
 *
 * Este ficheiro deixou de ser a fonte de verdade. Uma auditoria a todo o
 * `src/` confirmou que o único import que existia (AzureStorageSimulator.tsx)
 * importava `getToneClasses`/`getToneAccent`/`AzureTone` sem os usar — ou
 * seja, este módulo estava efectivamente morto. Mantido como stub de
 * compatibilidade só por segurança; podes apagar este ficheiro assim que
 * confirmares (`grep -r "styles/tones" src`) que nada o importa.
 *
 * Usa `src/design/colorTokens.ts` para tudo o que precisares daqui em diante.
 */
export {
  type Tone as AzureTone,
  toneColorMap,
  getToneClasses,
  getToneText,
  getToneAccent,
  getConditionalToneClasses,
  highlightTone,
  inactiveTone,
  eyebrowStyle,
  conceptToneMap,
  getToneForConcept,
} from '../design/colorTokens';
