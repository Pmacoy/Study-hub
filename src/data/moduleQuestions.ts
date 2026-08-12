import { ADVANCED_MODULES } from './advancedInterview';
import type { AdvancedQuestion } from './advancedInterview';

/**
 * Liga cada módulo de estudo do hub aos módulos de perguntas de entrevista
 * que cobrem o mesmo tema. Chave: `${domain}:${tab}`.
 */
const MODULE_QUESTION_MAP: Record<string, string[]> = {
  // Platform & DevOps
  'devops:linux':          ['linux'],
  'devops:git':            ['git'],
  'devops:docker':         ['containers'],
  'devops:kubernetes':     ['kubernetes', 'k8s-architecture', 'ingress'],
  'devops:helm':           ['kubernetes'],
  'devops:cicd':           ['cicd', 'jenkins', 'github-actions', 'gitlab'],
  'devops:terraform':      ['iac'],
  'devops:cloudformation': ['iac'],
  'devops:monitoring':     ['monitoring'],
  'devops:security':       ['security', 'sonarqube', 'trivy'],
  'devops:devops-intro':   ['devops-fundamentals'],
  'devops:finops':         ['aws'],
  'devops:mlops':          ['python'],

  // Redes
  'networking:osi-model':    ['networking'],
  'networking:ip-subnet':    ['subnetting'],
  'networking:tcp-udp':      ['networking'],
  'networking:dns':          ['networking'],
  'networking:routing':      ['networking'],
  'networking:vpn-security': ['networking'],

  // AWS
  'aws:vpc':       ['aws-networking'],
  'aws:iam':       ['aws'],
  'aws:compute':   ['aws'],
  'aws:storage':   ['aws'],
  'aws:databases': ['aws'],
  'aws:wellarch':  ['aws'],

  // Azure
  'azure:vnet':       ['azure-networking'],
  'azure:identity':   ['azure-devops'],
  'azure:governance': ['azure-devops'],
  'azure:rbac':       ['azure-devops'],
  'azure:compute':    ['azure-devops'],
  'azure:storage':    ['azure-devops'],
  'azure:containers': ['azure-devops'],
  'azure:monitor':    ['azure-devops'],

  // Python
  'python:devops': ['python'],
};

export interface RelatedQuestionSet {
  moduleId: string;
  title: string;
  emoji: string;
  questions: AdvancedQuestion[];
}

/** Devolve os conjuntos de perguntas relacionados com um módulo do hub */
export function relatedQuestionsFor(domain: string, tab: string): RelatedQuestionSet[] {
  const ids = MODULE_QUESTION_MAP[`${domain}:${tab}`];
  if (!ids) return [];
  return ids
    .map(id => ADVANCED_MODULES.find(m => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map(m => ({ moduleId: m.id, title: m.title, emoji: m.emoji, questions: m.questions }));
}

/** Número total de perguntas relacionadas com um módulo */
export function relatedQuestionCount(domain: string, tab: string): number {
  return relatedQuestionsFor(domain, tab).reduce((s, m) => s + m.questions.length, 0);
}
