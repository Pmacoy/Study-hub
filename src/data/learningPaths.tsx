import type { LearningPath } from '../types/learningPath';
import {
  Cloud, Lock, Cpu, Database, Warehouse, Building2, Rocket, Terminal,
  GitBranch, Container, Boxes, Zap, Shield, Brain, BookOpen, Globe,
  Beaker, Hash, Network, RotateCw, AlertTriangle, Binary, GitCommit,
  Layers, FileText, RefreshCw, Activity, Scale, Lock as LockIcon,
  GitMerge, TriangleAlert, Timer,
} from 'lucide-react';

export const AZ104_PATH: LearningPath = {
  id: 'az-104',
  domain: 'azure',
  title: 'AZ-104 · Azure Administrator',
  subtitle: 'Identity · Governance · Compute · Storage · Networking · Monitor',
  goal: 'Passar o exame AZ-104 e trabalhar como Azure Admin',
  icon: <Cloud size={24} className="text-sky-400" />,
  colorAccent: 'sky',
  totalHours: 40,
  nodes: [
    { id: 'identity',   label: 'Identity & Entra ID',      subtitle: 'Users, groups, tenants',     icon: <Lock size={16} className="text-sky-400" />, estimatedMin: 240 },
    { id: 'governance', label: 'Governance',                subtitle: 'Subscriptions, policies',    icon: <Building2 size={16} className="text-sky-400" />, estimatedMin: 180 },
    { id: 'rbac',       label: 'RBAC',                      subtitle: 'Roles e delegation',         icon: <Shield size={16} className="text-sky-400" />, estimatedMin: 180 },
    { id: 'storage',    label: 'Storage',                    subtitle: 'Blobs, Files, Disks',        icon: <Warehouse size={16} className="text-sky-400" />, estimatedMin: 240 },
    { id: 'compute',    label: 'Compute',                    subtitle: 'VMs, ARM, scale sets',       icon: <Cpu size={16} className="text-sky-400" />, estimatedMin: 300 },
    { id: 'containers', label: 'Containers',                 subtitle: 'AKS, ACI, ACR',              icon: <Container size={16} className="text-sky-400" />, estimatedMin: 240 },
    { id: 'vnet',       label: 'VNet & Networking',         subtitle: 'NSGs, VPN, Peering',         icon: <Globe size={16} className="text-sky-400" />, estimatedMin: 300 },
    { id: 'monitor',    label: 'Monitor',                    subtitle: 'Metrics, alerts, logs',      icon: <Beaker size={16} className="text-sky-400" />, estimatedMin: 180 },
  ],
};

export const AWS_SAA_PATH: LearningPath = {
  id: 'aws-saa-c03',
  domain: 'aws',
  title: 'SAA-C03 · Solutions Architect Associate',
  subtitle: 'IAM · VPC · Compute · Storage · Databases · Well-Architected',
  goal: 'Passar o exame AWS SAA-C03',
  icon: <Cpu size={24} className="text-orange-400" />,
  colorAccent: 'orange',
  totalHours: 45,
  nodes: [
    { id: 'iam',       label: 'IAM & Segurança',      subtitle: 'Users, roles, policies',      icon: <Lock size={16} className="text-orange-400" />, estimatedMin: 300 },
    { id: 'vpc',       label: 'VPC & Networking',     subtitle: 'Subnets, NAT, SG, NACL',      icon: <Globe size={16} className="text-orange-400" />, estimatedMin: 360 },
    { id: 'compute',   label: 'Compute',              subtitle: 'EC2, ELB, ASG, Lambda',       icon: <Cpu size={16} className="text-orange-400" />, estimatedMin: 360 },
    { id: 'storage',   label: 'Storage',              subtitle: 'S3, EBS, EFS, Glacier',       icon: <Warehouse size={16} className="text-orange-400" />, estimatedMin: 300 },
    { id: 'databases', label: 'Databases',            subtitle: 'RDS, Aurora, DynamoDB',       icon: <Database size={16} className="text-orange-400" />, estimatedMin: 300 },
    { id: 'wellarch',  label: 'Well-Architected',     subtitle: '6 pilares de arquitectura',   icon: <Building2 size={16} className="text-orange-400" />, estimatedMin: 240 },
  ],
};

export const DEVOPS_PATH: LearningPath = {
  id: 'platform-devops',
  domain: 'devops',
  title: 'Platform & DevOps Engineering',
  subtitle: 'Da execução (DevOps) à plataforma como produto',
  goal: 'Ganhar competências de Senior Platform Engineer',
  icon: <Terminal size={24} className="text-violet-400" />,
  colorAccent: 'violet',
  totalHours: 90,
  nodes: [
    { id: 'devops-intro',    label: 'DevOps & DevSecOps',    subtitle: 'Cultura e ciclo de vida',   icon: <Rocket size={16} className="text-violet-400" />, estimatedMin: 180 },
    { id: 'linux',           label: 'Linux & Shell',         subtitle: 'Comandos e scripting',      icon: <Terminal size={16} className="text-violet-400" />, estimatedMin: 300, terminalSessionIds: ['bash-disk-full', 'bash-oom-memory', 'bash-disk-io', 'bash-port-not-listening', 'bash-dns-fail', 'bash-high-cpu'] },
    { id: 'git',             label: 'Git & Versionamento',   subtitle: 'Branches e workflows',      icon: <GitBranch size={16} className="text-violet-400" />, estimatedMin: 180 },
    { id: 'docker',          label: 'Docker',                 subtitle: 'Imagens e Dockerfile',      icon: <Container size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'kubernetes',      label: 'Kubernetes',             subtitle: 'Pods, Services, RBAC',      icon: <Boxes size={16} className="text-violet-400" />, estimatedMin: 360, scenarioIds: ['k8s-crashloop-oom', 'k8s-imagepull-secret', 'k8s-pvc-pending-storageclass', 'k8s-ingress-502', 'k8s-rbac-forbidden', 'k8s-liveness-probe-loop', 'k8s-node-disk-pressure'], terminalSessionIds: ['kubectl-crashloop'] },
    { id: 'helm',            label: 'Helm',                   subtitle: 'Charts, releases, rollback', icon: <Cpu size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'cicd',            label: 'CI/CD Pipelines',        subtitle: 'Jenkins, GH Actions',        icon: <Zap size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'terraform',       label: 'Terraform / IaC',       subtitle: 'Módulos e multi-cloud',    icon: <Building2 size={16} className="text-violet-400" />, estimatedMin: 300 },
    { id: 'cloudformation',  label: 'CloudFormation',        subtitle: 'IaC nativo AWS',           icon: <Warehouse size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'monitoring',      label: 'Monitoring',             subtitle: 'Prometheus, Grafana, ELK',  icon: <Beaker size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'security',        label: 'DevSecOps',              subtitle: 'SonarQube, Trivy, OPA',     icon: <Shield size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'idp-backstage',   label: 'IDP & Backstage',        subtitle: 'Developer portal',          icon: <Terminal size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'golden-paths',    label: 'Golden Paths',           subtitle: 'Paved-road templates',       icon: <Rocket size={16} className="text-violet-400" />, estimatedMin: 180 },
    { id: 'dora-devex',      label: 'DORA & DevEx',           subtitle: 'Métricas, cognitive load',  icon: <Beaker size={16} className="text-violet-400" />, estimatedMin: 180 },
    { id: 'mlops',           label: 'MLOps & AI',             subtitle: 'MLflow, drift, agentic AI', icon: <Brain size={16} className="text-violet-400" />, estimatedMin: 300 },
    { id: 'service-mesh',    label: 'Service Mesh',           subtitle: 'Istio, mTLS, Traffic Mgmt', icon: <Network size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'gitops',          label: 'GitOps',                 subtitle: 'Argo CD, Flux, Declarative',  icon: <RotateCw size={16} className="text-violet-400" />, estimatedMin: 240 },
    { id: 'sre',             label: 'SRE & Fiabilidade',      subtitle: 'SLO, Error Budget, Incidents', icon: <AlertTriangle size={16} className="text-violet-400" />, estimatedMin: 240 },
  ],
};

export const NETWORKING_PATH: LearningPath = {
  id: 'networking',
  domain: 'networking',
  title: 'Redes & Cloud Networking',
  subtitle: 'OSI, TCP/IP, DNS, VPN, BGP',
  goal: 'Dominar networking fundamentals para cloud',
  icon: <Globe size={24} className="text-emerald-400" />,
  colorAccent: 'emerald',
  totalHours: 25,
  nodes: [
    { id: 'ip-calc',    label: 'Modelo OSI',            subtitle: '7 camadas',                icon: <BookOpen size={16} className="text-emerald-400" />, estimatedMin: 180 },
    { id: 'transport',    label: 'IP & Subnetting',        subtitle: 'CIDR, VLSM, masks',        icon: <Hash size={16} className="text-emerald-400" />, estimatedMin: 240 },
    { id: 'ip-addressing',      label: 'TCP & UDP',              subtitle: 'Handshake, flags',          icon: <Globe size={16} className="text-emerald-400" />, estimatedMin: 180 },
    { id: 'application',          label: 'DNS',                    subtitle: 'Records, resolution',       icon: <Globe size={16} className="text-emerald-400" />, estimatedMin: 180, scenarioIds: ['networking-dns-private-resolver'] },
    { id: 'routing',      label: 'Routing',                subtitle: 'BGP, OSPF, static',         icon: <GitBranch size={16} className="text-emerald-400" />, estimatedMin: 240 },
    { id: 'security-net', label: 'VPN & Security',         subtitle: 'IPSec, TLS, firewalls',     icon: <Shield size={16} className="text-emerald-400" />, estimatedMin: 240 },
  ],
};

export const PYTHON_PATH: LearningPath = {
  id: 'python',
  domain: 'python',
  title: 'Python para DevOps',
  subtitle: 'Fundamentos → automação de cloud',
  goal: 'Escrever automação DevOps profissional em Python',
  icon: <Terminal size={24} className="text-amber-400" />,
  colorAccent: 'amber',
  totalHours: 30,
  nodes: [
    { id: 'basics', label: 'Fundamentos',           subtitle: 'Tipos, if, loops',          icon: <BookOpen size={16} className="text-amber-400" />, estimatedMin: 240 },
    { id: 'data-structures',   label: 'Estruturas de dados',    subtitle: 'Lists, dicts, sets',        icon: <Boxes size={16} className="text-amber-400" />, estimatedMin: 180 },
    { id: 'control-flow',    label: 'Funções & Módulos',     subtitle: 'def, imports, packages',    icon: <GitBranch size={16} className="text-amber-400" />, estimatedMin: 180 },
    { id: 'oop',          label: 'OOP',                    subtitle: 'Classes, herança',          icon: <Cpu size={16} className="text-amber-400" />, estimatedMin: 240 },
    { id: 'advanced',     label: 'Avançado',               subtitle: 'Generators, decorators',     icon: <Zap size={16} className="text-amber-400" />, estimatedMin: 240, scenarioIds: ['python-subprocess-hang'] },
    { id: 'devops-py',       label: 'Python para DevOps',    subtitle: 'requests, boto3, azure',    icon: <Rocket size={16} className="text-amber-400" />, estimatedMin: 300 },
  ],
};

export const DISTRIBUTED_SYSTEMS_PATH: LearningPath = {
  id: 'distributed-systems',
  domain: 'distributed-systems',
  title: 'Sistemas Distribuídos',
  subtitle: 'Consenso · Tolerância a Falhas · Consistência · Coordenação',
  goal: 'Dominar os fundamentos teóricos e práticos dos sistemas distribuídos',
  icon: <Network size={24} className="text-teal-400" />,
  colorAccent: 'teal',
  totalHours: 30,
  nodes: [
    { id: 'consensus',          label: 'Consenso',              subtitle: 'Paxos, Raft, líder-election',       icon: <Scale size={16} className="text-teal-400" />, estimatedMin: 300 },
    { id: 'fault-tolerance',    label: 'Tolerância a Falhas',   subtitle: 'Replicação, checkpointing',       icon: <Shield size={16} className="text-teal-400" />, estimatedMin: 300 },
    { id: 'synchronization',    label: 'Sincronização',         subtitle: 'Relógios vetoriais, Lamport',       icon: <Timer size={16} className="text-teal-400" />, estimatedMin: 240 },
    { id: 'consistency-models', label: 'Modelos de Consistência', subtitle: 'Strong, eventual, causal',    icon: <LockIcon size={16} className="text-teal-400" />, estimatedMin: 300 },
    { id: 'distributed-transactions', label: 'Transações Dist.', subtitle: '2PC, 3PC, Saga',            icon: <GitMerge size={16} className="text-teal-400" />, estimatedMin: 300 },
    { id: 'coordination',       label: 'Coordenação',           subtitle: 'ZooKeeper, Etcd, leader',       icon: <Layers size={16} className="text-teal-400" />, estimatedMin: 240 },
  ],
};

export const ALGORITHMS_PATH: LearningPath = {
  id: 'algorithms',
  domain: 'algorithms',
  title: 'Algoritmos & Paradigmas',
  subtitle: 'Ordenação · Pesquisa · Grafos · PD · Recursão · Complexidade',
  goal: 'Domínio de algoritmos para entrevistas técnicas e sistema',
  icon: <Binary size={24} className="text-cyan-400" />,
  colorAccent: 'cyan',
  totalHours: 30,
  nodes: [
    { id: 'sorting',            label: 'Ordenação',          subtitle: 'Quick, Merge, Heap, Radix',        icon: <GitCommit size={16} className="text-cyan-400" />, estimatedMin: 300 },
    { id: 'searching',          label: 'Pesquisa',           subtitle: 'BS, hash, trie, bloom filter',      icon: <FileText size={16} className="text-cyan-400" />, estimatedMin: 240 },
    { id: 'graph',              label: 'Grafos',             subtitle: 'BFS, DFS, Dijkstra, topological',  icon: <Network size={16} className="text-cyan-400" />, estimatedMin: 300 },
    { id: 'dynamic-programming', label: 'Programação Dinâmica', subtitle: 'Memos, tabulação, knapsack',    icon: <Layers size={16} className="text-cyan-400" />, estimatedMin: 360 },
    { id: 'recursion',          label: 'Recursão',           subtitle: 'Backtracking, memo, tail recursion', icon: <RotateCw size={16} className="text-cyan-400" />, estimatedMin: 240 },
    { id: 'complexity',         label: 'Complexidade',       subtitle: 'Big-O, análise assintótica',         icon: <Activity size={16} className="text-cyan-400" />, estimatedMin: 180 },
  ],
};

export const ALL_LEARNING_PATHS: LearningPath[] = [
  AWS_SAA_PATH,
  AZ104_PATH,
  DEVOPS_PATH,
  NETWORKING_PATH,
  PYTHON_PATH,
  DISTRIBUTED_SYSTEMS_PATH,
  ALGORITHMS_PATH,
];

export function findLearningPath(id: string): LearningPath | undefined {
  return ALL_LEARNING_PATHS.find(p => p.id === id);
}
