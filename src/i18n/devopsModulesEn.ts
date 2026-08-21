import type { StudyTab } from '../types/devops';
import type { Lang } from './dict';

export interface ModuleMetaEn {
  label: string;
  subtitle: string;
  group: string;
}

/** Grupos da navegação */
export const NAV_GROUPS_EN: Record<string, string> = {
  'Visão geral': 'Overview',
  'Fundamentos': 'Fundamentals',
  'Containers': 'Containers',
  'Automação': 'Automation',
  'Operações': 'Operations',
  'Platform Engineering': 'Platform Engineering',
};

/** Metadados dos módulos de estudo em inglês */
export const MODULE_META_EN: Partial<Record<StudyTab, ModuleMetaEn>> = {
  'devops-intro': {
    label: 'DevOps & DevSecOps',
    subtitle: 'Culture, lifecycle and deployment strategies',
    group: 'Fundamentals',
  },
  linux: {
    label: 'Linux & Shell',
    subtitle: 'Essential commands, permissions and scripting',
    group: 'Fundamentals',
  },
  'shell-scripting': {
    label: 'Shell Scripting',
    subtitle: 'Production Bash · strict mode, trap, getopts, ShellCheck',
    group: 'Fundamentals',
  },
  git: {
    label: 'Git & Version Control',
    subtitle: 'Branches, merge, rebase and workflows',
    group: 'Fundamentals',
  },
  docker: {
    label: 'Docker',
    subtitle: 'Images, containers, Dockerfile and Compose',
    group: 'Containers',
  },
  kubernetes: {
    label: 'Kubernetes',
    subtitle: 'Pods, Deployments, Services, RBAC and networking',
    group: 'Containers',
  },
  helm: {
    label: 'Helm',
    subtitle: 'Charts, templating, releases and rollback',
    group: 'Containers',
  },
  cicd: {
    label: 'CI/CD Pipelines',
    subtitle: 'Jenkins, GitHub Actions and deployment strategies',
    group: 'Automation',
  },
  gitops: {
    label: 'GitOps',
    subtitle: 'ArgoCD · Flux · continuous reconciliation from Git',
    group: 'Automation',
  },
  terraform: {
    label: 'Terraform / IaC',
    subtitle: 'Modules, state, providers and multi-cloud',
    group: 'Automation',
  },
  cloudformation: {
    label: 'CloudFormation',
    subtitle: 'Templates, stacks, change sets and drift · native AWS IaC',
    group: 'Automation',
  },
  monitoring: {
    label: 'Monitoring & Observability',
    subtitle: 'Prometheus, Grafana, ELK and alerting',
    group: 'Operations',
  },
  finops: {
    label: 'FinOps · K8s cost',
    subtitle: 'Spot · Karpenter · KEDA · right-sizing · Savings Plans',
    group: 'Operations',
  },
  security: {
    label: 'DevSecOps',
    subtitle: 'SonarQube, Trivy, OPA and secret management',
    group: 'Operations',
  },
  'idp-backstage': {
    label: 'IDP & Backstage',
    subtitle: 'Internal developer portal and service catalogue',
    group: 'Platform Engineering',
  },
  'golden-paths': {
    label: 'Golden Paths',
    subtitle: 'Paved-road templates and self-service',
    group: 'Platform Engineering',
  },
  'dora-devex': {
    label: 'DORA & DevEx',
    subtitle: 'DORA 4 · cognitive load · SPACE · Team Topologies',
    group: 'Platform Engineering',
  },
  mlops: {
    label: 'MLOps & AI',
    subtitle: 'MLflow · Kubeflow · DVC · drift · agentic AI · MCP',
    group: 'Platform Engineering',
  },
};

/** Sublabels curtos usados na barra lateral */
export const NAV_SUBLABEL_EN: Record<string, string> = {
  'Progresso e atalhos': 'Progress and shortcuts',
  'Modo exame': 'Exam mode',
  'Cultura e ciclo de vida': 'Culture and lifecycle',
  'Comandos e scripting': 'Commands and scripting',
  'Bash de produção': 'Production Bash',
  'Branches e workflows': 'Branches and workflows',
  'Imagens e Dockerfile': 'Images and Dockerfile',
  'Pods, Services e RBAC': 'Pods, Services and RBAC',
  'Charts e releases': 'Charts and releases',
  'Jenkins · GH Actions': 'Jenkins · GH Actions',
  'Módulos e multi-cloud': 'Modules and multi-cloud',
  'Templates e stacks AWS': 'AWS templates and stacks',
  'Prometheus · Grafana · ELK': 'Prometheus · Grafana · ELK',
  'Spot · Karpenter · KEDA': 'Spot · Karpenter · KEDA',
  'Scan, secrets e policy': 'Scanning, secrets and policy',
  'Portal e catálogo': 'Portal and catalogue',
  'Templates e self-service': 'Templates and self-service',
  'Métricas · Cognitive load': 'Metrics · Cognitive load',
  'MLflow · drift · agentic AI': 'MLflow · drift · agentic AI',
};

export function localizeModuleMeta(
  tab: StudyTab,
  original: { label: string; subtitle: string; group: string },
  lang: Lang
) {
  if (lang === 'pt') return original;
  return MODULE_META_EN[tab] ?? original;
}

export function localizeNavGroup(title: string, lang: Lang): string {
  if (lang === 'pt') return title;
  return NAV_GROUPS_EN[title] ?? title;
}

export function localizeNavSublabel(sub: string, lang: Lang): string {
  if (lang === 'pt') return sub;
  return NAV_SUBLABEL_EN[sub] ?? sub;
}
