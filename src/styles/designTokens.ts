/**
 * @deprecated Este ficheiro não tinha NENHUM consumidor em todo o `src/`
 * (confirmado por auditoria em 2026-09-11) e estava desalinhado com a
 * realidade do projecto:
 *   - `radius.lg` documentava "12px" / `radius.xl` "16px", mas
 *     `tailwind.config.ts` redefine esses valores para 3-4px.
 *   - `typography` usa `text-3xl`, `text-xl`, `text-base`... classes que
 *     não existem na escala custom definida em `tailwind.config.ts`
 *     (que só redefine de `2xs` a `lg`, 10-15px).
 *   - `buildButtonClass()` gera `bg-[${accentColor}]` interpolando uma
 *     variável de runtime — o Tailwind JIT precisa da classe completa e
 *     estática no código-fonte para a compilar, por isso esta função nunca
 *     produziu CSS válido.
 *
 * Fontes de verdade actuais:
 *   - Cor/tom → `src/design/colorTokens.ts`
 *   - Tamanhos de fonte, espaçamento, radius → `tailwind.config.ts`
 *
 * Podes apagar este ficheiro assim que confirmares
 * (`grep -r "styles/designTokens" src`) que nada o importa.
 */
export {};
