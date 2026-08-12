export type Lang = 'pt' | 'en';

export const LANGS: { id: Lang; label: string; flag: string }[] = [
  { id: 'pt', label: 'Português', flag: '🇵🇹' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
];

/**
 * Dicionário de tradução.
 *
 * Fase 1: moldura do produto — cabeçalho, landing, domínios, navegação,
 * cartões de funcionalidade e sessão diária. É o que um visitante vê primeiro.
 *
 * O conteúdo profundo (módulos de estudo, bancos de perguntas, cenários)
 * permanece em português por agora — está assinalado na UI.
 */
export const DICT = {
  // ── Cabeçalho e navegação ────────────────────────────────────
  'app.name':            { pt: 'Study Hub',                 en: 'Study Hub' },
  'app.tagline':         { pt: 'Plataforma de Estudos',     en: 'Learning Platform' },
  'nav.back':            { pt: '← Voltar',                  en: '← Back' },
  'nav.learningPath':    { pt: '🗺️ Learning Path',          en: '🗺️ Learning Path' },
  'nav.projects':        { pt: '🚀 Projectos',              en: '🚀 Projects' },
  'nav.interview':       { pt: '💬 Entrevista',             en: '💬 Interview' },
  'nav.scenarios':       { pt: '🎯 Cenários guiados',       en: '🎯 Guided scenarios' },

  // ── Landing: diagnóstico ─────────────────────────────────────
  'diag.banner.eyebrow': { pt: 'Começa por aqui',           en: 'Start here' },
  'diag.banner.title':   { pt: 'Descobre as tuas lacunas reais', en: 'Find your real skill gaps' },
  'diag.banner.desc':    { pt: '12 perguntas de auto-avaliação · mapa de competências · por onde começar',
                           en: '12 self-assessment questions · skill map · where to start' },

  // ── Landing: cartões ─────────────────────────────────────────
  'card.path.eyebrow':   { pt: 'Learning Path',             en: 'Learning Path' },
  'card.path.title':     { pt: 'Percurso de aprendizagem',  en: 'Your learning journey' },
  'card.path.desc':      { pt: 'Vê onde estás em cada certificação. Progresso real e próximo passo.',
                           en: 'See where you stand in each certification. Real progress and next step.' },

  'card.projects.eyebrow': { pt: 'Portfolio',               en: 'Portfolio' },
  'card.projects.title': { pt: '50 projectos DevOps',       en: '50 DevOps projects' },
  'card.projects.desc':  { pt: 'Constrói portfolio real. Dos fundamentos ao DevSecOps com AI.',
                           en: 'Build a real portfolio. From fundamentals to DevSecOps with AI.' },

  'card.scenarios.eyebrow': { pt: 'Aprender resolvendo',    en: 'Learn by solving' },
  'card.scenarios.title':{ pt: 'Cenários & terminal',       en: 'Scenarios & terminal' },
  'card.scenarios.desc': { pt: 'Debug em produção. Escreves comandos, aprendes com feedback.',
                           en: 'Debug production issues. Type real commands, learn from feedback.' },

  'card.interview.eyebrow': { pt: 'Entrevista',             en: 'Interview' },
  'card.interview.title':{ pt: '100 perguntas DevOps',      en: '400+ DevOps questions' },
  'card.interview.desc': { pt: 'Modo estudo e sessão de treino com flashcards.',
                           en: 'Study mode and flashcard drill sessions.' },

  'card.career.eyebrow': { pt: 'Carreira',                  en: 'Career' },
  'card.career.title':   { pt: 'Como se constrói um especialista', en: 'How specialists are built' },
  'card.career.desc':    { pt: 'Competências, erros comuns, plano de 90 dias e certificações.',
                           en: 'Skills, common mistakes, a 90-day plan and certifications.' },

  'card.resources.eyebrow': { pt: 'Biblioteca',             en: 'Library' },
  'card.resources.title':{ pt: 'Repositórios curados',      en: 'Curated repositories' },
  'card.resources.desc': { pt: '33 repos GitHub que valem o teu tempo, por categoria.',
                           en: '33 GitHub repos worth your time, by category.' },

  // ── Domínios ─────────────────────────────────────────────────
  'domain.devops.label': { pt: 'Platform & DevOps Engineering', en: 'Platform & DevOps Engineering' },
  'domain.azure.label':  { pt: 'Microsoft Azure',           en: 'Microsoft Azure' },
  'domain.aws.label':    { pt: 'Amazon Web Services',       en: 'Amazon Web Services' },
  'domain.gcp.label':    { pt: 'Google Cloud',              en: 'Google Cloud' },
  'domain.networking.label': { pt: 'Redes & Cloud Networking', en: 'Networking & Cloud' },
  'domain.python.label': { pt: 'Python para DevOps',        en: 'Python for DevOps' },

  'domain.pick':         { pt: 'Escolhe um domínio',        en: 'Pick a domain' },
  'domain.modules':      { pt: 'módulos',                   en: 'modules' },
  'domain.progress':     { pt: 'progresso',                 en: 'progress' },

  // ── Sessão diária ────────────────────────────────────────────
  'daily.title':         { pt: 'Sessão Diária',             en: 'Daily Session' },
  'daily.streak':        { pt: 'dias seguidos',             en: 'day streak' },
  'daily.step.questions':{ pt: 'Questões do Dia',           en: 'Questions of the Day' },
  'daily.step.flashcards': { pt: 'Cartões Relâmpago',       en: 'Flashcards' },
  'daily.step.study':    { pt: 'Estudo Livre',              en: 'Free Study' },
  'daily.done':          { pt: 'Concluído',                 en: 'Done' },

  // ── Índice de progresso ──────────────────────────────────────
  'progress.title':      { pt: 'Índice de Progresso',       en: 'Progress Index' },
  'progress.coverage':   { pt: 'Cobertura',                 en: 'Coverage' },
  'progress.consistency':{ pt: 'Consistência',              en: 'Consistency' },
  'progress.engagement': { pt: 'Desempenho',                en: 'Engagement' },

  // ── Genéricos ────────────────────────────────────────────────
  'common.search':       { pt: 'Procurar...',               en: 'Search...' },
  'common.all':          { pt: 'Todos',                     en: 'All' },
  'common.close':        { pt: 'Fechar',                    en: 'Close' },
  'common.retry':        { pt: 'Repetir',                   en: 'Retry' },
  'common.next':         { pt: 'Próximo',                   en: 'Next' },
  'common.questions':    { pt: 'perguntas',                 en: 'questions' },
  'common.done':         { pt: 'Concluído',                 en: 'Done' },
  'common.inProgress':   { pt: 'Em curso',                  en: 'In progress' },
  'common.todo':         { pt: 'Por fazer',                 en: 'To do' },

  // ── Aviso de conteúdo ────────────────────────────────────────
  'notice.ptContent':    { pt: '',
                           en: 'Study modules and question banks are currently in Portuguese.' },
} as const;

export type TransKey = keyof typeof DICT;

export function translate(key: TransKey, lang: Lang): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[lang] ?? entry.pt;
}
