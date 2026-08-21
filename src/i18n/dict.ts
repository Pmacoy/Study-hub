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


  // ── Diagnóstico ──────────────────────────────────────────────
  'diag.eyebrow':        { pt: 'Diagnóstico',               en: 'Diagnostic' },
  'diag.title':          { pt: 'Onde estão as tuas lacunas reais?', en: 'Where are your real gaps?' },
  'diag.intro':          { pt: 'perguntas de auto-avaliação sobre as competências que sustentam um perfil de Platform Engineer. No fim vês um mapa do teu perfil e por onde começar.',
                           en: 'self-assessment questions on the competencies behind a Platform Engineer. At the end you get a map of your profile and where to start.' },
  'diag.howTo':          { pt: 'Como responder',            en: 'How to answer' },
  'diag.honest':         { pt: 'Sê honesto — o diagnóstico só é útil se for verdadeiro. Ninguém vê isto além de ti, e sobrestimar leva-te a saltar exactamente o que precisavas de praticar.',
                           en: 'Be honest — this is only useful if it is true. Nobody sees it but you, and overestimating makes you skip exactly what you needed to practise.' },
  'diag.start':          { pt: 'Começar diagnóstico',       en: 'Start diagnostic' },
  'diag.seeLast':        { pt: 'Ver o último resultado',    en: 'See last result' },
  'diag.exit':           { pt: '← Sair',                    en: '← Exit' },
  'diag.answered':       { pt: 'respondidas',               en: 'answered' },
  'diag.prevQuestion':   { pt: '← Pergunta anterior',       en: '← Previous question' },
  'diag.yourProfile':    { pt: 'O teu perfil',              en: 'Your profile' },
  'diag.average':        { pt: 'Média',                     en: 'Average' },
  'diag.skillMap':       { pt: 'Mapa de competências',      en: 'Skill map' },
  'diag.strengths':      { pt: 'Onde já estás bem',         en: 'Where you are already strong' },
  'diag.whereToStart':   { pt: 'Por onde começar',          en: 'Where to start' },
  'diag.priorityFirst':  { pt: '· prioridade mais alta primeiro', en: '· highest priority first' },
  'diag.whyMatters':     { pt: 'Porque importa',            en: 'Why it matters' },
  'diag.whatPractise':   { pt: 'O que praticar',            en: 'What to practise' },
  'diag.masterySignal':  { pt: 'Sinal de domínio',          en: 'Mastery signal' },
  'diag.openInHub':      { pt: 'Abrir no hub',              en: 'Open in hub' },
  'diag.noGaps':         { pt: 'Sem lacunas críticas',      en: 'No critical gaps' },
  'diag.noGapsDesc':     { pt: 'Nenhuma área abaixo de "uso no dia-a-dia". Foca-te em profundidade — cenários sénior e arquitectura.',
                           en: 'No area below "I use it daily". Focus on depth — senior scenarios and architecture.' },
  'diag.redo':           { pt: 'Refazer',                   en: 'Redo' },
  'diag.backToHub':      { pt: 'Voltar ao hub',             en: 'Back to hub' },
  'diag.level.0':        { pt: 'Nunca usei',                en: 'Never used it' },
  'diag.level.1':        { pt: 'Sei o básico',              en: 'I know the basics' },
  'diag.level.2':        { pt: 'Uso no dia-a-dia',          en: 'I use it daily' },
  'diag.level.3':        { pt: 'Consigo ensinar',           en: 'I could teach it' },
  'diag.level.0.short':  { pt: 'Nunca',                     en: 'Never' },
  'diag.level.1.short':  { pt: 'Básico',                    en: 'Basic' },
  'diag.level.2.short':  { pt: 'Uso',                       en: 'Daily' },
  'diag.level.3.short':  { pt: 'Ensino',                    en: 'Teach' },
  'diag.profile.senior': { pt: 'Perfil sénior',             en: 'Senior profile' },
  'diag.profile.senior.desc': { pt: 'Base sólida em quase tudo. Foca-te em profundidade e nas áreas de arquitectura.',
                           en: 'Solid across the board. Focus on depth and architecture-level work.' },
  'diag.profile.mid':    { pt: 'Perfil intermédio',         en: 'Mid-level profile' },
  'diag.profile.mid.desc': { pt: 'Já operas com autonomia. As lacunas abaixo são o que te separa de sénior.',
                           en: 'You already work autonomously. The gaps below are what separate you from senior.' },
  'diag.profile.building': { pt: 'Perfil em construção',    en: 'Profile in progress' },
  'diag.profile.building.desc': { pt: 'Tens os fundamentos. Agora é praticar até conseguires resolver sem receita.',
                           en: 'You have the fundamentals. Now practise until you can solve without a recipe.' },
  'diag.profile.starting': { pt: 'A começar',               en: 'Just starting' },
  'diag.profile.starting.desc': { pt: 'Começa pelos fundamentos — Linux e redes sustentam tudo o resto.',
                           en: 'Start with fundamentals — Linux and networking hold up everything else.' },

  // ── Projectos ────────────────────────────────────────────────
  'proj.eyebrow':        { pt: 'Trilha de Projectos',       en: 'Project Track' },
  'proj.title':          { pt: '50 projectos para o teu portfolio', en: '50 projects for your portfolio' },
  'proj.intro':          { pt: '"Don\'t just watch. Build projects. Break things and fix them." Projectos reais, production-grade, organizados dos fundamentos ao DevSecOps com AI. Marca o teu progresso e guarda o link do repo.',
                           en: '"Don\'t just watch. Build projects. Break things and fix them." Real, production-grade projects from fundamentals to DevSecOps with AI. Track progress and store your repo link.' },
  'proj.completed':      { pt: 'Concluídos',                en: 'Completed' },
  'proj.portfolio':      { pt: 'Portfolio',                 en: 'Portfolio' },
  'proj.filterSection':  { pt: 'Filtrar por secção',        en: 'Filter by section' },
  'proj.afterThese':     { pt: 'Depois destes projectos:',  en: 'After these projects:' },
  'proj.whatYouBuild':   { pt: 'O que constróis',           en: 'What you build' },
  'proj.concepts':       { pt: 'Conceitos cobertos',        en: 'Concepts covered' },
  'proj.stack':          { pt: 'Stack',                     en: 'Stack' },
  'proj.whyMatters':     { pt: 'Porque importa',            en: 'Why it matters' },
  'proj.status':         { pt: 'Estado',                    en: 'Status' },
  'proj.repoLink':       { pt: 'Link do repositório',       en: 'Repository link' },
  'proj.save':           { pt: 'Guardar',                   en: 'Save' },
  'proj.openRepo':       { pt: 'Abrir repositório',         en: 'Open repository' },
  'proj.allDone':        { pt: '50 projectos concluídos!',  en: '50 projects completed!' },
  'proj.allDoneDesc':    { pt: 'Já não estás a aprender DevOps — estás a praticá-lo.',
                           en: 'You are no longer learning DevOps — you are practising it.' },
  'proj.difficulty.foundations': { pt: 'Fundamentos',       en: 'Foundations' },
  'proj.difficulty.intermediate': { pt: 'Intermédio',       en: 'Intermediate' },
  'proj.difficulty.advanced': { pt: 'Avançado',             en: 'Advanced' },
  'proj.difficulty.expert': { pt: 'Expert',                 en: 'Expert' },

  // ── Learning Path ────────────────────────────────────────────
  'path.eyebrow':        { pt: 'Learning Path',             en: 'Learning Path' },
  'path.title':          { pt: 'O teu percurso de aprendizagem', en: 'Your learning journey' },
  'path.intro':          { pt: 'Escolhe um path para veres onde estás, o que já dominas, e qual é o próximo passo recomendado.',
                           en: 'Pick a path to see where you stand, what you already master, and the recommended next step.' },
  'path.modulesDone':    { pt: 'Módulos concluídos',        en: 'Modules completed' },
  'path.overall':        { pt: 'Total geral',               en: 'Overall' },
  'path.streakDays':     { pt: 'Dias de streak',            en: 'Day streak' },
  'path.pickPath':       { pt: 'Escolhe um percurso',       en: 'Pick a path' },
  'path.ofModules':      { pt: 'de',                        en: 'of' },
  'path.modules':        { pt: 'módulos',                   en: 'modules' },
  'path.doneLabel':      { pt: 'feito',                     en: 'done' },
  'path.inProgressLabel':{ pt: 'em curso',                  en: 'in progress' },
  'path.todoLabel':      { pt: 'por fazer',                 en: 'to do' },
  'path.nextStep':       { pt: 'Próximo passo',             en: 'Next step' },
  'path.fullPath':       { pt: 'Percurso completo',         en: 'Full path' },
  'path.step':           { pt: 'Passo',                     en: 'Step' },
  'path.next':           { pt: 'Próximo',                   en: 'Next' },
  'path.completed':      { pt: '✓ Concluído',               en: '✓ Completed' },
  'path.inProgress':     { pt: '◐ Em curso',                en: '◐ In progress' },
  'path.scenario':       { pt: 'cenário',                   en: 'scenario' },
  'path.terminal':       { pt: 'terminal',                  en: 'terminal' },

  // ── Biblioteca ───────────────────────────────────────────────
  'lib.eyebrow':         { pt: 'Biblioteca',                en: 'Library' },
  'lib.title':           { pt: 'repositórios que valem o teu tempo', en: 'repositories worth your time' },
  'lib.intro':           { pt: 'DevOps não se aprende só com teoria — aprende-se a ler pipelines reais, manifests reais e scripts escritos por quem opera produção. Estes são os repositórios que consistentemente ajudam a fazer essa passagem.',
                           en: 'DevOps is not learned from theory alone — you learn it reading real pipelines, real manifests and scripts written by people who run production. These are the repositories that consistently help make that jump.' },
  'lib.searchPlaceholder': { pt: 'Procurar por nome ou tema (ex: kubernetes, interview, terraform)...',
                           en: 'Search by name or topic (e.g. kubernetes, interview, terraform)...' },
  'lib.noResults':       { pt: 'Nenhum repositório corresponde a',  en: 'No repository matches' },
  'lib.whyMatters':      { pt: 'Porque importa',            en: 'Why it matters' },
  'lib.bestFor':         { pt: 'Ideal para',                en: 'Best for' },
  'lib.howToUse':        { pt: 'Como usar isto',            en: 'How to use this' },
  'lib.howToUseDesc':    { pt: 'Trata isto como currículo, não como lista de favoritos. Escolhe uma categoria, clona os repositórios relevantes, e constrói até teres confiança. Ler código real de produção ensina padrões que nenhum tutorial ensina.',
                           en: 'Treat this as a curriculum, not a bookmark list. Pick a category, clone the relevant repos, and build until you are confident. Reading real production code teaches patterns no tutorial does.' },
  'lib.basedOn':         { pt: 'Baseado em',                en: 'Based on' },

  // ── Entrevista ───────────────────────────────────────────────
  'int.eyebrow':         { pt: 'Preparação para entrevista', en: 'Interview preparation' },
  'int.questionsOf':     { pt: 'perguntas de DevOps',       en: 'DevOps questions' },
  'int.quickDesc':       { pt: 'Revisão rápida — respostas de uma ou duas linhas, para aquecer antes de uma entrevista.',
                           en: 'Quick revision — one or two line answers, to warm up before an interview.' },
  'int.deepDesc':        { pt: 'Preparação a sério — respostas em profundidade, no tom de quem responde numa entrevista real.',
                           en: 'Serious preparation — in-depth answers, in the voice of someone answering a real interview.' },
  'int.bankTab':         { pt: 'Banco de perguntas',        en: 'Question bank' },
  'int.techniqueTab':    { pt: '🎙️ Como responder',         en: '🎙️ How to answer' },
  'int.quickLevel':      { pt: 'Revisão rápida',            en: 'Quick revision' },
  'int.deepLevel':       { pt: 'Preparação a sério',        en: 'Serious preparation' },
  'int.sections':        { pt: 'secções',                   en: 'sections' },
  'int.modules':         { pt: 'módulos',                   en: 'modules' },
  'int.drill':           { pt: 'Sessão de treino',          en: 'Drill session' },
  'int.showAnswers':     { pt: 'Ver respostas',             en: 'Show answers' },
  'int.hideAnswers':     { pt: 'Fechar todas',              en: 'Collapse all' },
  'int.searchPlaceholder': { pt: 'Procurar por palavra-chave (ex: probe, state, RBAC)...',
                           en: 'Search by keyword (e.g. probe, state, RBAC)...' },
  'int.noMatch':         { pt: 'Nenhuma pergunta corresponde a', en: 'No question matches' },
  'int.exitDrill':       { pt: '← Sair da sessão',          en: '← Exit session' },
  'int.reveal':          { pt: 'Revelar resposta',          en: 'Reveal answer' },
  'int.knew':            { pt: 'Sabia',                     en: 'Knew it' },
  'int.review':          { pt: 'Rever',                     en: 'Review' },
  'int.sessionDone':     { pt: 'Sessão terminada',          en: 'Session complete' },
  'int.mastery':         { pt: 'Domínio',                   en: 'Mastery' },
  'int.newSession':      { pt: 'Nova sessão',               en: 'New session' },
  'int.studyMode':       { pt: 'Modo estudo',               en: 'Study mode' },
  'int.answer':          { pt: 'Resposta',                  en: 'Answer' },
  'int.answerFirst':     { pt: 'Responde mentalmente antes de revelar. É assim que se treina para uma entrevista.',
                           en: 'Answer in your head before revealing. That is how you train for an interview.' },

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
