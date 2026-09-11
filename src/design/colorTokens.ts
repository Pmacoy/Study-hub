import type { Domain } from '../types/platform';

/**
 * Fonte única de verdade para cor/tom em toda a app.
 *
 * Antes deste ficheiro existiam TRÊS sistemas paralelos que não se
 * referenciavam entre si (design/colorTokens.ts, styles/designTokens.ts,
 * styles/tones.ts). Uma auditoria a todo o `src/` mostrou que nenhum tinha
 * consumidores reais — o único import existente (AzureStorageSimulator.tsx
 * → styles/tones.ts) importava `getToneClasses`/`getToneAccent`/`AzureTone`
 * sem nunca os usar no corpo do ficheiro. Este ficheiro absorve o conteúdo
 * útil dos três; os outros dois (`styles/tones.ts` e `styles/designTokens.ts`)
 * ficam como stubs de compatibilidade que reexportam daqui — podem ser
 * apagados quando confirmares que nada mais os referencia.
 */

/**
 * Mapeamento de domínios para cores de marca (usadas com parcimónia).
 * Cada domínio tem uma cor, mas esta NÃO é usada em fundos ou barras — só em filetes e rótulos.
 */
export const DOMAIN_COLORS: Record<Domain, string> = {
  devops: 'violet',
  azure: 'sky',
  aws: 'orange',
  networking: 'emerald',
  python: 'amber',
  'system-design': 'rose',
  'distributed-systems': 'teal',
  'algorithms': 'cyan',
};

/**
 * Esquema de cores por domínio: gera as classes Tailwind para um tom.
 * Retorna um mapa com slots: surface, border, text, strong, bar, button, active, label.
 */
export function colorSlots(tone: string) {
  return {
    surface: `bg-${tone}-500/5`,
    border: `border-${tone}-500/20`,
    text: `text-${tone}-400`,
    strong: `text-${tone}-300`,
    bar: `bg-${tone}-500`,           // mudança: remover gradiente, usar preenchimento liso
    button: `border-${tone}-500/30 bg-${tone}-500/15 text-${tone}-300 hover:bg-${tone}-500/25`,
    active: `border-${tone}-500/20 bg-${tone}-500/15 text-white`,
    label: `text-${tone}-400`,
  };
}

/**
 * Estado semântico — cores que representam significado, não marca.
 * Usadas em barras de progresso, badges, indicadores de estado.
 * Valores extraídos de ProgressIndexCard.tsx:8-11 e generalizados.
 */
export const STATE_COLORS = {
  idle: '#64748b',    // não começado (slate-500)
  active: '#f59e0b',  // em curso (amber-500)
  pass: '#10b981',    // concluído / correcto (emerald-500)
  fail: '#f43f5e',    // errado / a falhar (rose-500)
} as const;

/**
 * Helper: dado um valor 0-100, devolve a cor de estado apropriada.
 * Mantém a lógica de ProgressIndexCard.tsx:8-11.
 */
export function stateForValue(value: number): keyof typeof STATE_COLORS {
  if (value >= 70) return 'pass';
  if (value >= 40) return 'active';
  return 'fail';
}

/**
 * Helper: dado um valor 0-100, devolve o hex da cor de estado.
 */
export function stateColorForValue(value: number): string {
  return STATE_COLORS[stateForValue(value)];
}

// ────────────────────────────────────────────────────────────────────────
// Tons "conceito → cor" (absorvido de styles/tones.ts, antigo "single
// source of truth" para componentes Azure). Mantido porque cobre um caso
// distinto de colorSlots(): mapear um CONCEITO de domínio (storage,
// networking, identity...) a um tom recomendado, não o domínio inteiro.
// ────────────────────────────────────────────────────────────────────────

export type Tone = 'amber' | 'sky' | 'emerald' | 'violet' | 'rose' | 'fuchsia' | 'teal' | 'slate';

export const toneColorMap: Record<Tone, Record<'border' | 'bg' | 'text' | 'accent', string>> = {
  amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-200', accent: 'text-amber-300' },
  sky: { border: 'border-sky-500/20', bg: 'bg-sky-500/10', text: 'text-sky-200', accent: 'text-sky-300' },
  emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-200', accent: 'text-emerald-300' },
  violet: { border: 'border-violet-500/20', bg: 'bg-violet-500/10', text: 'text-violet-200', accent: 'text-violet-300' },
  rose: { border: 'border-rose-500/20', bg: 'bg-rose-500/10', text: 'text-rose-200', accent: 'text-rose-300' },
  fuchsia: { border: 'border-fuchsia-500/20', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-200', accent: 'text-fuchsia-300' },
  teal: { border: 'border-teal-500/20', bg: 'bg-teal-500/10', text: 'text-teal-200', accent: 'text-teal-300' },
  slate: { border: 'border-slate-700', bg: 'bg-slate-900', text: 'text-slate-200', accent: 'text-slate-400' },
};

/** Classes combinadas (border + bg) para um tom. */
export function getToneClasses(tone: Tone): string {
  const c = toneColorMap[tone];
  return `${c.border} ${c.bg}`;
}

/** Cor de texto do tom. */
export function getToneText(tone: Tone): string {
  return toneColorMap[tone].text;
}

/** Cor de destaque (tom mais forte) do tom. */
export function getToneAccent(tone: Tone): string {
  return toneColorMap[tone].accent;
}

/** Estilo condicional (activo vs inactivo). */
export function getConditionalToneClasses(active: boolean, tone: Tone): string {
  return active ? getToneClasses(tone) : 'border-slate-800 bg-slate-900/50';
}

export const highlightTone = getToneClasses('amber');
export const inactiveTone = 'border-slate-800 bg-slate-900/50';
export const eyebrowStyle = 'text-xs font-semibold uppercase tracking-[0.14em]';

/** Mapeamento de conceitos Azure a tons recomendados. */
export const conceptToneMap: Record<string, Tone> = {
  storage: 'amber',
  compute: 'sky',
  networking: 'sky',
  identity: 'violet',
  monitoring: 'emerald',
  governance: 'fuchsia',
  containers: 'teal',
  database: 'rose',
  hybrid: 'amber',
  security: 'emerald',
  performance: 'sky',
  availability: 'emerald',
};

export function getToneForConcept(concept: keyof typeof conceptToneMap): Tone {
  return conceptToneMap[concept] || 'slate';
}

// Alias mantido por compatibilidade com o nome antigo usado em styles/tones.ts
export type AzureTone = Tone;
