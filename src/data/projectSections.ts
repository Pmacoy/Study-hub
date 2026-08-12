import type { ProjectSection } from '../types/project';

export const PROJECT_SECTIONS: ProjectSection[] = [
  {
    id: 'foundations',
    number: 1,
    title: 'Fundamentos & Monitorização',
    subtitle: 'Projectos 1–10 · a base de tudo',
    emoji: '🏗️',
    outcome: 'Monitorização desde os primeiros princípios, comportamento de aplicações, arquitectura multi-tier, visibilidade em runtime e fundamentos de deployment.',
  },
  {
    id: 'intermediate',
    number: 2,
    title: 'CI/CD & Segurança',
    subtitle: 'Projectos 11–20 · pipelines seguros',
    emoji: '🔒',
    outcome: 'Pipelines CI/CD seguros, controlo de acesso e governança, workflows de produção em Kubernetes, estratégias de release (Helm & GitOps) e gestão de secrets à escala.',
  },
  {
    id: 'advanced',
    number: 3,
    title: 'Kubernetes & Cloud-Native Avançado',
    subtitle: 'Projectos 21–30 · sistemas de produção',
    emoji: '☸️',
    outcome: 'Arquitecturas Kubernetes avançadas, serviços cloud-managed vs in-cluster, estratégias de deployment de produção, alta disponibilidade e resiliência, operar sistemas distribuídos.',
  },
  {
    id: 'expert',
    number: 4,
    title: 'CI/CD Enterprise & IaC',
    subtitle: 'Projectos 31–40 · escala corporativa',
    emoji: '🏢',
    outcome: 'Plataformas CI/CD enterprise, Azure DevOps (Classic & YAML), workflows de release multi-ambiente, PaaS vs Kubernetes, observabilidade como cidadã de primeira classe.',
  },
  {
    id: 'security-ai',
    number: 5,
    title: 'Segurança, Observabilidade & AI',
    subtitle: 'Projectos 41–50 · DevOps 2026+',
    emoji: '🤖',
    outcome: 'Pensamento security-first, observabilidade profunda, controlo de tráfego moderno e a próxima evolução do DevOps com AI (MLOps, agentic AI, MCP).',
  },
];
