import type { StudyTab } from '../types/devops';

export type TabMeta = { label: string; subtitle: string; group: string };

export const TAB_META: Record<StudyTab, TabMeta> = {
  'devops-intro': {
    label: 'DevOps & DevSecOps',
    subtitle: 'Cultura, ciclo de vida e estratégias de deploy',
    group: 'Fundamentos',
  },
  linux: {
    label: 'Linux & Shell',
    subtitle: 'Comandos essenciais, permissões e scripting',
    group: 'Fundamentos',
  },
  git: {
    label: 'Git & Versionamento',
    subtitle: 'Branches, merge, rebase e workflows',
    group: 'Fundamentos',
  },
  docker: {
    label: 'Docker',
    subtitle: 'Imagens, containers, Dockerfile e Compose',
    group: 'Containers',
  },
  kubernetes: {
    label: 'Kubernetes',
    subtitle: 'Pods, Deployments, Services, RBAC e Networking',
    group: 'Containers',
  },
  cicd: {
    label: 'CI/CD Pipelines',
    subtitle: 'Jenkins, GitHub Actions e GitLab CI',
    group: 'Automação',
  },
  terraform: {
    label: 'Terraform / IaC',
    subtitle: 'Módulos, state, providers e multi-cloud',
    group: 'Automação',
  },
  monitoring: {
    label: 'Monitoring & Observability',
    subtitle: 'Prometheus, Grafana, ELK e alertas',
    group: 'Operações',
  },
  security: {
    label: 'DevSecOps & Security',
    subtitle: 'SonarQube, Trivy, SAST/DAST e OPA',
    group: 'Operações',
  },
  'idp-backstage': {
    label: 'IDP & Backstage',
    subtitle: 'Internal Developer Platforms · Service catalog · TechDocs',
    group: 'Platform Engineering',
  },
  'golden-paths': {
    label: 'Golden Paths',
    subtitle: 'Paved-road templates · Self-service · Escape hatches',
    group: 'Platform Engineering',
  },
  'dora-devex': {
    label: 'DORA & DevEx',
    subtitle: 'DORA 4 · Cognitive load · SPACE · Team Topologies',
    group: 'Platform Engineering',
  },
};
