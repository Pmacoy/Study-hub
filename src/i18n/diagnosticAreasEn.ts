/**
 * Traduções em inglês das áreas de diagnóstico.
 * Mantidas em ficheiro separado para não inchar os dados originais.
 * Chave = id da área em diagnosticAreas.ts
 */

export interface AreaTranslation {
  label: string;
  prompt: string;
  whyItMatters: string;
  whatToPractise: string;
  masterySignal: string;
}

export const DIAGNOSTIC_AREAS_EN: Record<string, AreaTranslation> = {
  linux: {
    label: 'Linux and shell',
    prompt: 'Diagnosing a slow server or one that has run out of disk, from the command line.',
    whyItMatters: 'Almost everything in production runs on Linux. When Kubernetes fails, you end up in a shell. It is the layer underneath all the others.',
    whatToPractise: 'Investigating real incidents without a recipe: disk full, memory exhausted, runaway process, closed port, broken DNS.',
    masterySignal: 'You can reach the cause of an incident without looking up the commands — and you can read the output, not just run it.',
  },
  networking: {
    label: 'Networking',
    prompt: 'Explaining why a service is not responding: is it DNS, routing, firewall or the application?',
    whyItMatters: 'Most "mysterious" incidents are network. Without understanding TCP, DNS and routing, you depend on others to diagnose.',
    whatToPractise: 'Telling connection refused from timeout, following a DNS resolution end to end, reading firewall rules.',
    masterySignal: 'From the error alone, you can say which layer the problem is in before opening any tool.',
  },
  git: {
    label: 'Git and version control',
    prompt: 'Resolving a merge conflict, reverting something in production, working with branches in a team.',
    whyItMatters: 'It is the source of truth for everything — code, infrastructure, pipelines. In GitOps, Git is literally the desired state of the cluster.',
    whatToPractise: 'Merge vs rebase, revert vs reset, cherry-picking hotfixes, and recovering from mistakes without panicking.',
    masterySignal: 'You can undo anything without losing work, and explain the difference between revert and reset to someone else.',
  },
  docker: {
    label: 'Containers',
    prompt: 'Writing a production Dockerfile and understanding why an image is 1.2 GB.',
    whyItMatters: 'The container is the modern unit of deployment. If you do not understand layers and build context, you inherit slow, insecure images.',
    whatToPractise: 'Multi-stage builds, small base images, .dockerignore, and why instruction order affects caching.',
    masterySignal: 'You can cut an image by 80% and explain every decision you made.',
  },
  kubernetes: {
    label: 'Kubernetes',
    prompt: 'Debugging a pod that will not start, and understanding the difference between readiness and liveness.',
    whyItMatters: 'It is where most platforms run today. The difference between knowing how to deploy and knowing how to operate lies entirely in debugging.',
    whatToPractise: 'CrashLoopBackOff, ImagePullBackOff, PVC Pending, Ingress 502, RBAC Forbidden — each has its own signature.',
    masterySignal: 'Facing a broken pod, you know what the first command is and why — and it is not restarting it.',
  },
  cicd: {
    label: 'CI/CD',
    prompt: 'Building a pipeline that builds, tests, security-scans and deploys — with rollback.',
    whyItMatters: 'It is what turns code into delivered value. A slow or unreliable pipeline holds back the whole team.',
    whatToPractise: 'Pipeline as code, quality gates, secret management, deployment strategies (blue/green, canary) and tested rollback.',
    masterySignal: 'Your pipeline fails for good reasons and passes quickly — and you can roll back without hesitating.',
  },
  iac: {
    label: 'Infrastructure as Code',
    prompt: 'Provisioning infrastructure with Terraform or CloudFormation, across multiple environments.',
    whyItMatters: 'Console clicks are neither reproducible nor reviewable. IaC is what separates a platform from a pile of resources.',
    whatToPractise: 'Remote state with locking, reusable modules, environment separation, and reading a plan before applying.',
    masterySignal: 'You can recreate an entire environment from scratch out of the repository, without touching the console.',
  },
  cloud: {
    label: 'Cloud (AWS / Azure / GCP)',
    prompt: 'Designing an architecture with VPC, subnets, load balancer and a highly available database.',
    whyItMatters: 'Picking the right service for the right problem is half of an architect\'s job — the other half is knowing what it costs.',
    whatToPractise: 'Networking (public vs private subnets, NAT, endpoints), compute options, and HA and DR strategies.',
    masterySignal: 'Given a business requirement, you pick the services and justify the cost and resilience trade-offs.',
  },
  observability: {
    label: 'Observability',
    prompt: 'Instrumenting a service and knowing, before the customer calls, that something is wrong.',
    whyItMatters: 'Without observability, automation is blind. It is the difference between finding a problem yourself and being told by a user.',
    whatToPractise: 'Metrics, logs and traces; the four golden signals; actionable alerts with an attached runbook.',
    masterySignal: 'Your alerts fire before impact and each one has a clear action attached.',
  },
  security: {
    label: 'Security / DevSecOps',
    prompt: 'Managing secrets, applying least privilege and scanning for vulnerabilities in the pipeline.',
    whyItMatters: 'Security left until the end is always expensive. Integrated into the pipeline, it is almost free.',
    whatToPractise: 'Secrets in a dedicated manager, least-privilege RBAC, SAST/DAST/SCA in CI, and image scanning.',
    masterySignal: 'There are no credentials in code in your repository — and you can prove it with a tool.',
  },
  incident: {
    label: 'Incident response',
    prompt: 'Running an incident at 2 AM: stabilise, communicate, investigate, document.',
    whyItMatters: 'It is the skill that most distinguishes a senior profile. Debugging is technical; running an incident is technical and human at once.',
    whatToPractise: 'Gathering context before acting, always asking "what changed?", the minimal reversible fix, and blameless post-mortems.',
    masterySignal: 'Under pressure you follow a method instead of guessing — and you communicate status without being asked.',
  },
  automation: {
    label: 'Automation and scripting',
    prompt: 'Automating a repetitive task with Python or Bash, robustly.',
    whyItMatters: 'Anything you do twice by hand should be code. It is what frees time for the work only you can do.',
    whatToPractise: 'Idempotent scripts, error handling, cloud SDKs (boto3, azure-sdk), and knowing when NOT to automate.',
    masterySignal: 'Your scripts can run twice without breaking anything, and they fail with useful messages.',
  },
};

import type { DiagnosticArea } from '../types/diagnostic';
import type { Lang } from './dict';

/** Devolve a área na língua pedida, caindo para o original se não houver tradução */
export function localizeArea(area: DiagnosticArea, lang: Lang): DiagnosticArea {
  if (lang === 'pt') return area;
  const tr = DIAGNOSTIC_AREAS_EN[area.id];
  if (!tr) return area;
  return { ...area, ...tr };
}
