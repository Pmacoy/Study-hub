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
  gcp: 'rose',
  networking: 'emerald',
  python: 'amber',
  'system-design': 'rose',
  'distributed-systems': 'teal',
  'algorithms': 'cyan',
  'oci': 'red',
  'cybersecurity': 'rose',
  'data-engineering': 'sky',
  'ai-ml': 'violet',
  'citrix': 'violet',
};

const COLOR_SLOT_MAP: Record<string, {
  surface: string;
  border: string;
  text: string;
  strong: string;
  bar: string;
  button: string;
  active: string;
  label: string;
}> = {
  violet: {
    surface: 'bg-violet-500/5',
    border: 'border-violet-500/20',
    text: 'text-violet-400',
    strong: 'text-violet-300',
    bar: 'bg-violet-500',
    button: 'border-violet-500/30 bg-violet-500/15 text-violet-300 hover:bg-violet-500/25',
    active: 'border-violet-500/20 bg-violet-500/15 text-white',
    label: 'text-violet-400',
  },
  sky: {
    surface: 'bg-sky-500/5',
    border: 'border-sky-500/20',
    text: 'text-sky-400',
    strong: 'text-sky-300',
    bar: 'bg-sky-500',
    button: 'border-sky-500/30 bg-sky-500/15 text-sky-300 hover:bg-sky-500/25',
    active: 'border-sky-500/20 bg-sky-500/15 text-white',
    label: 'text-sky-400',
  },
  amber: {
    surface: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    strong: 'text-amber-300',
    bar: 'bg-amber-500',
    button: 'border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25',
    active: 'border-amber-500/20 bg-amber-500/15 text-white',
    label: 'text-amber-400',
  },
  orange: {
    surface: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    strong: 'text-orange-300',
    bar: 'bg-orange-500',
    button: 'border-orange-500/30 bg-orange-500/15 text-orange-300 hover:bg-orange-500/25',
    active: 'border-orange-500/20 bg-orange-500/15 text-white',
    label: 'text-orange-400',
  },
  emerald: {
    surface: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    strong: 'text-emerald-300',
    bar: 'bg-emerald-500',
    button: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25',
    active: 'border-emerald-500/20 bg-emerald-500/15 text-white',
    label: 'text-emerald-400',
  },
  rose: {
    surface: 'bg-rose-500/5',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    strong: 'text-rose-300',
    bar: 'bg-rose-500',
    button: 'border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25',
    active: 'border-rose-500/20 bg-rose-500/15 text-white',
    label: 'text-rose-400',
  },
  red: {
    surface: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-red-400',
    strong: 'text-red-300',
    bar: 'bg-red-500',
    button: 'border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25',
    active: 'border-red-500/20 bg-red-500/15 text-white',
    label: 'text-red-400',
  },
  cyan: {
    surface: 'bg-cyan-500/5',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    strong: 'text-cyan-300',
    bar: 'bg-cyan-500',
    button: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25',
    active: 'border-cyan-500/20 bg-cyan-500/15 text-white',
    label: 'text-cyan-400',
  },
  teal: {
    surface: 'bg-teal-500/5',
    border: 'border-teal-500/20',
    text: 'text-teal-400',
    strong: 'text-teal-300',
    bar: 'bg-teal-500',
    button: 'border-teal-500/30 bg-teal-500/15 text-teal-300 hover:bg-teal-500/25',
    active: 'border-teal-500/20 bg-teal-500/15 text-white',
    label: 'text-teal-400',
  },
  fuchsia: {
    surface: 'bg-fuchsia-500/5',
    border: 'border-fuchsia-500/20',
    text: 'text-fuchsia-400',
    strong: 'text-fuchsia-300',
    bar: 'bg-fuchsia-500',
    button: 'border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-300 hover:bg-fuchsia-500/25',
    active: 'border-fuchsia-500/20 bg-fuchsia-500/15 text-white',
    label: 'text-fuchsia-400',
  },
  indigo: {
    surface: 'bg-indigo-500/5',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    strong: 'text-indigo-300',
    bar: 'bg-indigo-500',
    button: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25',
    active: 'border-indigo-500/20 bg-indigo-500/15 text-white',
    label: 'text-indigo-400',
  },
  slate: {
    surface: 'bg-slate-800/40',
    border: 'border-slate-700',
    text: 'text-slate-400',
    strong: 'text-slate-300',
    bar: 'bg-slate-600',
    button: 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700',
    active: 'border-slate-600 bg-slate-800 text-white',
    label: 'text-slate-400',
  },
};

/**
 * Esquema de cores por domínio: mapeamento estático seguro de classes Tailwind.
 * Retorna um mapa com slots: surface, border, text, strong, bar, button, active, label.
 */
export function colorSlots(tone: string) {
  return COLOR_SLOT_MAP[tone] ?? COLOR_SLOT_MAP.slate;
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
