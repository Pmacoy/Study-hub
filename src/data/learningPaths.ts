import type { LearningPath } from '../types/learningPath';

export const AZ104_PATH: LearningPath = {
  id: 'az-104',
  domain: 'azure',
  title: 'AZ-104 · Azure Administrator',
  subtitle: 'Identity · Governance · Compute · Storage · Networking · Monitor',
  goal: 'Passar o exame AZ-104 e trabalhar como Azure Admin',
  icon: '☁️',
  colorAccent: 'sky',
  totalHours: 40,
  nodes: [
    { id: 'identity',   label: 'Identity & Entra ID',      subtitle: 'Users, groups, tenants',     emoji: '🔐', estimatedMin: 240 },
    { id: 'governance', label: 'Governance',                subtitle: 'Subscriptions, policies',    emoji: '🏛️', estimatedMin: 180 },
    { id: 'rbac',       label: 'RBAC',                      subtitle: 'Roles e delegation',         emoji: '🎫', estimatedMin: 180 },
    { id: 'storage',    label: 'Storage',                    subtitle: 'Blobs, Files, Disks',        emoji: '📦', estimatedMin: 240 },
    { id: 'compute',    label: 'Compute',                    subtitle: 'VMs, ARM, scale sets',       emoji: '💻', estimatedMin: 300 },
    { id: 'containers', label: 'Containers',                 subtitle: 'AKS, ACI, ACR',              emoji: '🐳', estimatedMin: 240 },
    { id: 'vnet',       label: 'VNet & Networking',         subtitle: 'NSGs, VPN, Peering',         emoji: '🌐', estimatedMin: 300 },
    { id: 'monitor',    label: 'Monitor',                    subtitle: 'Metrics, alerts, logs',      emoji: '📊', estimatedMin: 180 },
    { id: 'architecture', label: 'Arquitectura',             subtitle: 'Como os serviços se ligam',  emoji: '🏛️', estimatedMin: 180 },
  ],
};

export const AWS_SAA_PATH: LearningPath = {
  id: 'aws-saa-c03',
  domain: 'aws',
  title: 'SAA-C03 · Solutions Architect Associate',
  subtitle: 'IAM · VPC · Compute · Storage · Databases · Well-Architected',
  goal: 'Passar o exame AWS SAA-C03',
  icon: '🟧',
  colorAccent: 'orange',
  totalHours: 45,
  nodes: [
    { id: 'iam',       label: 'IAM & Segurança',      subtitle: 'Users, roles, policies',      emoji: '🔐', estimatedMin: 300 },
    { id: 'vpc',       label: 'VPC & Networking',     subtitle: 'Subnets, NAT, SG, NACL',      emoji: '🌐', estimatedMin: 360 },
    { id: 'compute',   label: 'Compute',              subtitle: 'EC2, ELB, ASG, Lambda',       emoji: '💻', estimatedMin: 360 },
    { id: 'storage',   label: 'Storage',              subtitle: 'S3, EBS, EFS, Glacier',       emoji: '📦', estimatedMin: 300 },
    { id: 'databases', label: 'Databases',            subtitle: 'RDS, Aurora, DynamoDB',       emoji: '🗄️', estimatedMin: 300 },
    { id: 'wellarch',  label: 'Well-Architected',      subtitle: '6 pilares de arquitectura',  emoji: '🏛️', estimatedMin: 240 },
  ],
};

export const DEVOPS_PATH: LearningPath = {
  id: 'platform-devops',
  domain: 'devops',
  title: 'Platform & DevOps Engineering',
  subtitle: 'Da execução (DevOps) à plataforma como produto',
  goal: 'Ganhar competências de Senior Platform Engineer',
  icon: '⚙️',
  colorAccent: 'violet',
  totalHours: 60,
  nodes: [
    { id: 'devops-intro',    label: 'DevOps & DevSecOps',    subtitle: 'Cultura e ciclo de vida',   emoji: '🚀', estimatedMin: 180 },
    { id: 'linux',           label: 'Linux & Shell',         subtitle: 'Comandos e scripting',      emoji: '🐧', estimatedMin: 300, terminalSessionIds: ['bash-disk-full', 'bash-oom-memory', 'bash-disk-io', 'bash-port-not-listening', 'bash-dns-fail', 'bash-high-cpu'] },
    { id: 'shell-scripting', label: 'Shell Scripting',       subtitle: 'Bash de produção',          emoji: '📜', estimatedMin: 240 },
    { id: 'git',             label: 'Git & Versionamento',   subtitle: 'Branches e workflows',      emoji: '🌿', estimatedMin: 180 },
    { id: 'docker',          label: 'Docker',                 subtitle: 'Imagens e Dockerfile',      emoji: '🐳', estimatedMin: 240 },
    { id: 'kubernetes',      label: 'Kubernetes',             subtitle: 'Pods, Services, RBAC',      emoji: '☸️', estimatedMin: 360, scenarioIds: ['k8s-crashloop-oom', 'k8s-imagepull-secret', 'k8s-pvc-pending-storageclass', 'k8s-ingress-502', 'k8s-rbac-forbidden', 'k8s-liveness-probe-loop', 'k8s-node-disk-pressure', 'k8s-incident-auth-down'], terminalSessionIds: ['kubectl-crashloop'] },
    { id: 'helm',            label: 'Helm',                   subtitle: 'Charts, releases, rollback',  emoji: '⎈', estimatedMin: 240 },
    { id: 'cicd',            label: 'CI/CD Pipelines',        subtitle: 'Jenkins, GH Actions',        emoji: '⚙️', estimatedMin: 240 },
    { id: 'gitops',          label: 'GitOps',                 subtitle: 'ArgoCD, Flux, reconciliação', emoji: '🔄', estimatedMin: 240 },
    { id: 'terraform',       label: 'Terraform / IaC',       subtitle: 'Módulos e multi-cloud',     emoji: '🏗️', estimatedMin: 300 },
    { id: 'cloudformation',  label: 'CloudFormation',        subtitle: 'IaC nativo AWS',            emoji: '📦', estimatedMin: 240 },
    { id: 'monitoring',      label: 'Monitoring',             subtitle: 'Prometheus, Grafana, ELK', emoji: '📊', estimatedMin: 240 },
    { id: 'finops',          label: 'FinOps · Custos K8s',   subtitle: 'Spot, Karpenter, KEDA',    emoji: '💰', estimatedMin: 240 },
    { id: 'security',        label: 'DevSecOps',              subtitle: 'SonarQube, Trivy, OPA',     emoji: '🔐', estimatedMin: 240 },
    { id: 'idp-backstage',   label: 'IDP & Backstage',        subtitle: 'Developer portal',           emoji: '🧱', estimatedMin: 240 },
    { id: 'golden-paths',    label: 'Golden Paths',           subtitle: 'Paved-road templates',       emoji: '🛤️', estimatedMin: 180 },
    { id: 'dora-devex',      label: 'DORA & DevEx',           subtitle: 'Métricas, cognitive load',  emoji: '📈', estimatedMin: 180 },
    { id: 'mlops',           label: 'MLOps & AI',             subtitle: 'MLflow, drift, agentic AI', emoji: '🧠', estimatedMin: 300 },
  ],
};

export const NETWORKING_PATH: LearningPath = {
  id: 'networking',
  domain: 'networking',
  title: 'Redes & Cloud Networking',
  subtitle: 'OSI, TCP/IP, DNS, VPN, BGP',
  goal: 'Dominar networking fundamentals para cloud',
  icon: '🌐',
  colorAccent: 'emerald',
  totalHours: 25,
  nodes: [
    { id: 'osi-model',    label: 'Modelo OSI',            subtitle: '7 camadas',                emoji: '📚', estimatedMin: 180 },
    { id: 'ip-subnet',    label: 'IP & Subnetting',        subtitle: 'CIDR, VLSM, masks',        emoji: '🔢', estimatedMin: 240 },
    { id: 'tcp-udp',      label: 'TCP & UDP',              subtitle: 'Handshake, flags',          emoji: '📡', estimatedMin: 180 },
    { id: 'dns',          label: 'DNS',                    subtitle: 'Records, resolution',       emoji: '🌍', estimatedMin: 180, scenarioIds: ['networking-dns-private-resolver'] },
    { id: 'routing',      label: 'Routing',                subtitle: 'BGP, OSPF, static',         emoji: '🛣️', estimatedMin: 240 },
    { id: 'vpn-security', label: 'VPN & Security',         subtitle: 'IPSec, TLS, firewalls',      emoji: '🔒', estimatedMin: 240 },
  ],
};

export const PYTHON_PATH: LearningPath = {
  id: 'python',
  domain: 'python',
  title: 'Python para DevOps',
  subtitle: 'Fundamentos → automação de cloud',
  goal: 'Escrever automação DevOps profissional em Python',
  icon: '🐍',
  colorAccent: 'amber',
  totalHours: 30,
  nodes: [
    { id: 'fundamentals', label: 'Fundamentos',           subtitle: 'Tipos, if, loops',          emoji: '📖', estimatedMin: 240 },
    { id: 'structures',   label: 'Estruturas de dados',    subtitle: 'Lists, dicts, sets',        emoji: '📋', estimatedMin: 180 },
    { id: 'functions',    label: 'Funções & Módulos',     subtitle: 'def, imports, packages',    emoji: '🔧', estimatedMin: 180 },
    { id: 'oop',          label: 'OOP',                    subtitle: 'Classes, herança',          emoji: '🧩', estimatedMin: 240 },
    { id: 'advanced',     label: 'Avançado',               subtitle: 'Generators, decorators',     emoji: '⚡', estimatedMin: 240, scenarioIds: ['python-subprocess-hang'] },
    { id: 'devops',       label: 'Python para DevOps',    subtitle: 'requests, boto3, azure',    emoji: '🚀', estimatedMin: 300 },
  ],
};

export const ALL_LEARNING_PATHS: LearningPath[] = [
  AWS_SAA_PATH,
  AZ104_PATH,
  DEVOPS_PATH,
  NETWORKING_PATH,
  PYTHON_PATH,
];

export function findLearningPath(id: string): LearningPath | undefined {
  return ALL_LEARNING_PATHS.find(p => p.id === id);
}
