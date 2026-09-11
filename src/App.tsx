import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Brain, Cloud, GraduationCap, RotateCcw, Server, Sparkles, Terminal, ChevronLeft, Globe, Map as MapIcon, Rocket, Target } from 'lucide-react';
import type { SidebarMenuGroup } from './types/navigation';

// Platform types
import type { Domain } from './types/platform';
import { DOMAINS } from './types/platform';

// DevOps types & data
import type { DevOpsTab, StudyTab as DevOpsStudyTab } from './types/devops';
import { STUDY_TABS as DEVOPS_STUDY_TABS, isDevOpsTab } from './types/devops';
import { TAB_META as DEVOPS_TAB_META } from './data/tabMeta';
import { STORAGE_KEYS, AZURE_STORAGE_KEYS, NETWORKING_STORAGE_KEYS, AWS_STORAGE_KEYS, PLATFORM_STORAGE_KEYS, SYSTEM_DESIGN_STORAGE_KEYS, DISTRIBUTED_SYSTEMS_STORAGE_KEYS, ALGORITHMS_STORAGE_KEYS } from './data/storageKeys';
import { menuGroups as devopsMenuGroups } from './data/navigation';
import { systemDesignMenuGroups } from './data/systemDesign/navigation';
import { SYSTEM_DESIGN_TAB_META } from './data/systemDesign/tabMeta';
import { SYSTEM_DESIGN_STUDY_TABS, isSystemDesignTab } from './types/systemDesign';
import { distributedSystemsMenuGroups } from './data/distributedSystems/navigation';
import { DISTRIBUTED_SYSTEMS_TAB_META } from './data/distributedSystems/tabMeta';
import { DISTRIBUTED_SYSTEMS_STUDY_TABS, isDistributedSystemsTab } from './types/distributedSystems';
import { algorithmsMenuGroups } from './data/algorithms/navigation';
import { ALGORITHMS_TAB_META } from './data/algorithms/tabMeta';
import { ALGORITHMS_STUDY_TABS, isAlgorithmsTab } from './types/algorithms';

// Azure types & data
import type { AzureTab, StudyTab as AzureStudyTab } from './types/azure';
import { STUDY_TABS as AZURE_STUDY_TABS, isAzureTab } from './types/azure';
import { TAB_META as AZURE_TAB_META } from './data/azure/tabMeta';
import { menuGroups as azureMenuGroups } from './data/azure/navigation';
import { knowledgeData as AZURE_KNOWLEDGE_DATA } from './data/azure/knowledgeBase';

// Networking types
import type { NetworkingTab, NetworkingStudyTab } from './types/networking';
import { NETWORKING_STUDY_TABS, isNetworkingTab } from './types/networking';

// Python types & data
import type { PythonTab, PythonStudyTab } from './types/python';
import { PYTHON_STUDY_TABS, isPythonTab } from './types/python';
import { PYTHON_STORAGE_KEYS } from './data/storageKeys';

// Certifications (per-cloud domain)
import { getCertsFor } from './types/certification';
import CertHub from './components/shared/CertHub';
import ComingSoonCert from './components/shared/ComingSoonCert';

// DevOps components
import DevOpsIntroSimulator from './components/devops/DevOpsIntroSimulator';
import LinuxSimulator from './components/devops/LinuxSimulator';
import GitSimulator from './components/devops/GitSimulator';
import DockerSimulator from './components/devops/DockerSimulator';
import KubernetesSimulator from './components/devops/KubernetesSimulator';
import HelmSimulator from './components/devops/HelmSimulator';
import CiCdSimulator from './components/devops/CiCdSimulator';
import TerraformSimulator from './components/devops/TerraformSimulator';
import CloudFormationSimulator from './components/devops/CloudFormationSimulator';
import MonitoringSimulator from './components/devops/MonitoringSimulator';
import SecuritySimulator from './components/devops/SecuritySimulator';
import IdpBackstageSimulator from './components/devops/IdpBackstageSimulator';
import GoldenPathsSimulator from './components/devops/GoldenPathsSimulator';
import DoraDevexSimulator from './components/devops/DoraDevexSimulator';
import MlopsSimulator from './components/devops/MlopsSimulator';
import ServiceMeshSimulator from './components/devops/ServiceMeshSimulator';
import GitOpsSimulator from './components/devops/GitOpsSimulator';
import SreSimulator from './components/devops/SreSimulator';
import ExamSimulator from './components/devops/ExamSimulator';
import TerraformAssociateExamSimulator from './components/devops/TerraformAssociateExamSimulator';
import CkaExamSimulator from './components/devops/CkaExamSimulator';
import SystemDesignSimulator from './components/systemDesign/SystemDesignSimulator';
import DistributedSystemsSimulator from './components/distributedSystems/DistributedSystemsSimulator';
import AlgorithmsSimulator from './components/algorithms/AlgorithmsSimulator';

// Azure components
import AzureIdentitySimulator from './components/azure/AzureIdentitySimulator';
import AzureGovernanceSimulator from './components/azure/AzureGovernanceSimulator';
import AzureRbacSimulator from './components/azure/AzureRbacSimulator';
import AzureNetworkingSimulator from './components/azure/AzureNetworkingSimulator';
import AzureStorageSimulator from './components/azure/AzureStorageSimulator';
import AzureComputeSimulator from './components/azure/AzureComputeSimulator';
import AzureMonitorSimulator from './components/azure/AzureMonitorSimulator';
import AzureContainersSimulator from './components/azure/AzureContainersSimulator';
import AzureExamSimulator from './components/azure/AzureExamSimulator';
import AzureDevOpsExamSimulator from './components/azure/AzureDevOpsExamSimulator';
// Networking components
import NetworkingSimulator from './components/networking/NetworkingSimulator';
import NetworkingExamSimulator from './components/networking/NetworkingExamSimulator';

// Python components
import PythonSimulator from './components/python/PythonSimulator';
import PythonExamSimulator from './components/python/PythonExamSimulator';

// Layout components
import Sidebar from './components/layout/Sidebar';
import TerminalTitleBar from './components/layout/TerminalTitleBar';
import DashboardHome from './components/layout/DashboardHome';
import DomainDashboard from './components/shared/DomainDashboard';
import PlatformLanding from './components/layout/PlatformLanding';
import QuickStat from './components/shared/QuickStat';
import ResetProgressModal from './components/layout/ResetProgressModal';
import StatusLine from './components/shared/StatusLine';
import KnowledgeBase from './components/shared/KnowledgeBase';

// Daily streak / gamification
import { useDailyState } from './hooks/useDailyState';

import { useActivityLog } from './hooks/useActivityLog';
import { computeProgress } from './types/progress';

// Scenarios
import { useScenarioAttempts } from './hooks/useScenarioAttempts';
import { useChallengeAttempts } from './hooks/useChallengeAttempts';
import { findScenario, findChallenge } from './data/scenarios';
import ScenariosHub from './components/scenarios/ScenariosHub';
import GuidedScenarioPlayer from './components/scenarios/GuidedScenarioPlayer';
import ChallengeScenarioPlayer from './components/scenarios/ChallengeScenarioPlayer';

// Terminal
import { useTerminalAttempts } from './hooks/useTerminalAttempts';
import { findTerminalSession } from './data/terminal';
import TerminalPlayer from './components/terminal/TerminalPlayer';

// AWS SAA-C03
import type { AwsTab, AwsStudyTab } from './types/aws';
import { ALL_AWS_TABS, AWS_STUDY_TABS, isAwsTab } from './types/aws';
import { AWS_TAB_META } from './data/aws/tabMeta';
import { awsMenuGroups } from './data/aws/navigation';
import AwsExamSimulator from './components/aws/AwsExamSimulator';
import { knowledgeData as AWS_KNOWLEDGE_DATA } from './data/aws/knowledgeBase';

// Learning Path
import LearningPathView from './components/learning/LearningPathView';
import type { LearningPath, PathNode } from './types/learningPath';

// Projects track
import ProjectsView from './components/projects/ProjectsView';

// ── DevOps + Platform Engineering content map ────────────────────────────
const DEVOPS_CONTENT: Record<DevOpsStudyTab, ReactNode> = {
  'devops-intro': <DevOpsIntroSimulator />,
  linux: <LinuxSimulator />,
  git: <GitSimulator />,
  docker: <DockerSimulator />,
  kubernetes: <KubernetesSimulator />,
  helm: <HelmSimulator />,
  cicd: <CiCdSimulator />,
  terraform: <TerraformSimulator />,
  cloudformation: <CloudFormationSimulator />,
  monitoring: <MonitoringSimulator />,
  security: <SecuritySimulator />,
  'idp-backstage': <IdpBackstageSimulator />,
  'golden-paths': <GoldenPathsSimulator />,
  'dora-devex': <DoraDevexSimulator />,
  mlops: <MlopsSimulator />,
  'service-mesh': <ServiceMeshSimulator />,
  gitops: <GitOpsSimulator />,
  sre: <SreSimulator />,
};

// ── System Design content map ─────────────────────────────────────────
const SYSTEM_DESIGN_CONTENT: Record<import('./types/systemDesign').SystemDesignStudyTab, ReactNode> = {
  'cap-theorem': <SystemDesignSimulator tab="cap-theorem" />,
  'caching': <SystemDesignSimulator tab="caching" />,
  'load-balancer': <SystemDesignSimulator tab="load-balancer" />,
  'sharding': <SystemDesignSimulator tab="sharding" />,
  'messaging': <SystemDesignSimulator tab="messaging" />,
  'back-of-envelope': <SystemDesignSimulator tab="back-of-envelope" />,
};

// ── Distributed Systems content map ───────────────────────────────
const DISTRIBUTED_SYSTEMS_CONTENT: Record<import('./types/distributedSystems').DistributedSystemsStudyTab, ReactNode> = {
  'consensus': <DistributedSystemsSimulator tab="consensus" />,
  'fault-tolerance': <DistributedSystemsSimulator tab="fault-tolerance" />,
  'synchronization': <DistributedSystemsSimulator tab="synchronization" />,
  'consistency-models': <DistributedSystemsSimulator tab="consistency-models" />,
  'distributed-transactions': <DistributedSystemsSimulator tab="distributed-transactions" />,
  'coordination': <DistributedSystemsSimulator tab="coordination" />,
};

// ── Azure content map ────────────────────────────────────────────────────
const AZURE_CONTENT: Record<AzureStudyTab, ReactNode> = {
  identity: <AzureIdentitySimulator />,
  governance: <AzureGovernanceSimulator />,
  rbac: <AzureRbacSimulator />,
  vnet: <AzureNetworkingSimulator />,
  storage: <AzureStorageSimulator />,
  compute: <AzureComputeSimulator />,
  monitor: <AzureMonitorSimulator />,
  containers: <AzureContainersSimulator />,
};

// ── Color accents per domain ─────────────────────────────────────────────
const DOMAIN_ACCENT: Record<Domain, string> = {
  devops: 'violet',
  azure: 'sky',
  aws: 'orange',
  networking: 'emerald',
  python: 'amber',
  'system-design': 'rose',
  'distributed-systems': 'teal',
  'algorithms': 'cyan',
};

const ACCENT_CLASSES: Record<string, { active: string; bar: string; label: string }> = {
  violet:  { active: 'border-violet-500/20 bg-violet-500/15 text-violet-300',   bar: 'from-violet-500 to-fuchsia-500',  label: 'text-violet-400' },
  sky:     { active: 'border-sky-500/20 bg-sky-500/15 text-sky-300',             bar: 'from-sky-500 to-blue-500',         label: 'text-sky-400' },
  emerald: { active: 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300', bar: 'from-emerald-500 to-teal-500',     label: 'text-emerald-400' },
  amber:   { active: 'border-amber-500/20 bg-amber-500/15 text-amber-300',       bar: 'from-amber-500 to-orange-500',     label: 'text-amber-400' },
  orange:  { active: 'border-orange-500/20 bg-orange-500/15 text-orange-300',    bar: 'from-orange-500 to-red-500',       label: 'text-orange-400' },
  rose:    { active: 'border-rose-500/20 bg-rose-500/15 text-rose-300',           bar: 'from-rose-500 to-pink-500',        label: 'text-rose-400' },
  teal:    { active: 'border-teal-500/20 bg-teal-500/15 text-teal-300',           bar: 'from-teal-500 to-cyan-500',        label: 'text-teal-400' },
  cyan:    { active: 'border-cyan-500/20 bg-cyan-500/15 text-cyan-300',           bar: 'from-cyan-500 to-blue-500',        label: 'text-cyan-400' },
};

// ── Networking tab meta ──────────────────────────────────────────────────
const NETWORKING_TAB_META: Record<NetworkingStudyTab, { label: string; subtitle: string }> = {
  'ip-calc':       { label: 'Calculadora IP & Sub-redes', subtitle: 'CIDR, broadcast, hosts e árvore de subnets' },
  'transport':     { label: 'Anatomia do Pacote & TCP', subtitle: 'Campos TCP/UDP + 3-Way Handshake' },
  'ip-addressing': { label: 'Endereçamento IP', subtitle: 'Classes, IPs privados, NAT e IPv6' },
  'application':   { label: 'Camada Aplicação', subtitle: 'DNS lookup + verbos e status HTTP/REST' },
  'routing':       { label: 'Roteamento L3', subtitle: 'Longest Prefix Match e tabela de rotas' },
  'security-net':  { label: 'Segurança & Diagnóstico', subtitle: 'ARP, TLS Handshake e Traceroute' },
};

// ── Networking navigation ────────────────────────────────────────────────
import { Activity, BarChart3, Globe2, GraduationCap as Grad, Shield, Network, Wifi } from 'lucide-react';

const NETWORKING_MENU_GROUPS = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard' as NetworkingTab, label: 'Dashboard', sublabel: 'Progresso', icon: BarChart3 },
      { id: 'exam' as NetworkingTab, label: 'Simulado', sublabel: 'Teste de redes', icon: Grad },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'ip-calc' as NetworkingTab,       label: 'Calculadora IP',    sublabel: 'CIDR · Subnets · Hosts', icon: Server },
      { id: 'transport' as NetworkingTab,     label: 'Pacotes & TCP',     sublabel: 'Anatomia · Handshake',   icon: Network },
      { id: 'ip-addressing' as NetworkingTab, label: 'Endereçamento IP',  sublabel: 'Classes · NAT · IPv6',   icon: Globe2 },
    ],
  },
  {
    title: 'Avançado',
    items: [
      { id: 'application' as NetworkingTab,  label: 'Camada Aplicação', sublabel: 'DNS · HTTP · REST',        icon: Wifi },
      { id: 'routing' as NetworkingTab,      label: 'Roteamento L3',    sublabel: 'Longest Prefix Match',     icon: Activity },
      { id: 'security-net' as NetworkingTab, label: 'Segurança & Diag', sublabel: 'ARP · TLS · Traceroute',  icon: Shield },
    ],
  },
];

// ── Python tab meta & navigation ─────────────────────────────────────────
const PYTHON_TAB_META: Record<PythonStudyTab, { label: string; subtitle: string }> = {
  'basics':          { label: 'Fundamentos',        subtitle: 'Tipos, strings, operadores e variáveis' },
  'control-flow':    { label: 'Control Flow',       subtitle: 'if/for/while, funções, lambdas e decoradores' },
  'data-structures': { label: 'Data Structures',    subtitle: 'list, tuple, set, dict e comprehensions' },
  'oop':             { label: 'OOP & File I/O',     subtitle: 'Classes, herança, ficheiros, JSON e excepções' },
  'advanced':        { label: 'Python Avançado',    subtitle: 'Generators, async/await e type hints' },
  'devops-py':       { label: 'Python para DevOps', subtitle: 'pytest, requests, argparse e Cloud SDKs' },
};

import { Code2, BookOpen as BookOpenIcon, Cpu as CpuIcon, FileCode, FlaskConical, Layers as LayersIcon } from 'lucide-react';

const PYTHON_MENU_GROUPS = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard' as PythonTab, label: 'Dashboard', sublabel: 'Progresso Python', icon: BarChart3 },
      { id: 'exam' as PythonTab, label: 'Simulado', sublabel: 'Teste Python', icon: Grad },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'basics' as PythonTab,          label: 'Fundamentos',      sublabel: 'Tipos · Strings',        icon: BookOpenIcon },
      { id: 'control-flow' as PythonTab,    label: 'Control Flow',     sublabel: 'if · loops · funções',   icon: Code2 },
      { id: 'data-structures' as PythonTab, label: 'Data Structures',  sublabel: 'list · dict · set',      icon: LayersIcon },
    ],
  },
  {
    title: 'Avançado',
    items: [
      { id: 'oop' as PythonTab,      label: 'OOP & File I/O',    sublabel: 'Classes · JSON',          icon: CpuIcon },
      { id: 'advanced' as PythonTab, label: 'Python Avançado',   sublabel: 'Generators · async',      icon: FlaskConical },
      { id: 'devops-py' as PythonTab, label: 'Python DevOps',    sublabel: 'pytest · boto3 · Azure',  icon: FileCode },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── Platform state ───────────────────────────────────────────────────
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);

  // ── Daily streak / gamification ──────────────────────────────────────
  const { daily, markStepComplete } = useDailyState();
  const { entries: activityEntries, logActivity } = useActivityLog();
  const { record: recordScenarioAttempt, bestAttemptFor: bestScenarioAttemptFor, attempts: allScenarioAttempts } = useScenarioAttempts();
  const { record: recordChallengeAttempt, bestAttemptFor: bestChallengeAttemptFor } = useChallengeAttempts();
  const { record: recordTerminalAttempt, bestAttemptFor: bestTerminalAttemptFor, attempts: allTerminalAttempts } = useTerminalAttempts();

  // ── Scenarios & terminal state ─────────────────────────────────
  const [scenariosView, setScenariosView] = useState<
    | null
    | 'hub'
    | { type: 'scenario'; activeId: string }
    | { type: 'challenge'; activeId: string }
    | { type: 'terminal'; activeId: string }
  >(null);

  // ── Learning Path view ───────────────────────────────────────
  const [showLearningPath, setShowLearningPath] = useState(false);

  // ── Projects track view ──────────────────────────────────────
  const [showProjects, setShowProjects] = useState(false);

  // ── Per-domain tab state ─────────────────────────────────────────────
  const [devopsTab, setDevopsTab] = useState<DevOpsTab>('dashboard');
  const [azureTab, setAzureTab] = useState<AzureTab>('dashboard');
  const [networkingTab, setNetworkingTab] = useState<NetworkingTab>('dashboard');
  const [pythonTab, setPythonTab] = useState<PythonTab>('dashboard');
  const [systemDesignTab, setSystemDesignTab] = useState<import('./types/systemDesign').SystemDesignTab>('dashboard');
  const [distributedSystemsTab, setDistributedSystemsTab] = useState<import('./types/distributedSystems').DistributedSystemsTab>('dashboard');
  const [algorithmsTab, setAlgorithmsTab] = useState<import('./types/algorithms').AlgorithmsTab>('dashboard');

  // ── Per-domain visited tabs ──────────────────────────────────────────
  const [devopsVisited, setDevopsVisited] = useState<Set<DevOpsTab>>(new Set());
  const [azureVisited, setAzureVisited] = useState<Set<AzureTab>>(new Set());
  const [networkingVisited, setNetworkingVisited] = useState<Set<NetworkingTab>>(new Set());
  const [pythonVisited, setPythonVisited] = useState<Set<PythonTab>>(new Set());
  const [systemDesignVisited, setSystemDesignVisited] = useState<Set<import('./types/systemDesign').SystemDesignTab>>(new Set());
  const [distributedSystemsVisited, setDistributedSystemsVisited] = useState<Set<import('./types/distributedSystems').DistributedSystemsTab>>(new Set());
  const [algorithmsVisited, setAlgorithmsVisited] = useState<Set<import('./types/algorithms').AlgorithmsTab>>(new Set());

  // ── AWS SAA-C03 tabs ────────────────────────────────────────────────
  const [awsTab, setAwsTab] = useState<AwsTab>('dashboard');
  const [awsVisited, setAwsVisited] = useState<Set<AwsTab>>(new Set());

  // ── Active certification per cloud domain (Azure, AWS) ─────────────────
  // Default: null = show cert hub; else = show cert study modules
  const [activeCertId, setActiveCertId] = useState<string | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);

  // ── Persist & restore ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const d = localStorage.getItem(PLATFORM_STORAGE_KEYS.activeDomain) as Domain | null;
      if (d && ['devops', 'azure', 'aws', 'networking', 'python', 'system-design', 'distributed-systems', 'algorithms'].includes(d)) setActiveDomain(d);

      const dt = localStorage.getItem(STORAGE_KEYS.activeTab);
      if (dt && isDevOpsTab(dt)) setDevopsTab(dt);
      const dv = localStorage.getItem(STORAGE_KEYS.visitedTabs);
      if (dv) {
        const parsed = JSON.parse(dv);
        if (Array.isArray(parsed)) setDevopsVisited(new Set(parsed.filter(isDevOpsTab)));
      }

      const at = localStorage.getItem(AZURE_STORAGE_KEYS.activeTab);
      if (at && isAzureTab(at)) setAzureTab(at);
      const av = localStorage.getItem(AZURE_STORAGE_KEYS.visitedTabs);
      if (av) {
        const parsed = JSON.parse(av);
        if (Array.isArray(parsed)) setAzureVisited(new Set(parsed.filter(isAzureTab)));
      }

      const pt = localStorage.getItem(PYTHON_STORAGE_KEYS.activeTab);
      if (pt && isPythonTab(pt)) setPythonTab(pt);
      const pv = localStorage.getItem(PYTHON_STORAGE_KEYS.visitedTabs);
      if (pv) {
        const parsed = JSON.parse(pv);
        if (Array.isArray(parsed)) setPythonVisited(new Set(parsed.filter(isPythonTab)));
      }

      // Networking
      const nt = localStorage.getItem(NETWORKING_STORAGE_KEYS.activeTab);
      if (nt && isNetworkingTab(nt)) setNetworkingTab(nt);
      const nv = localStorage.getItem(NETWORKING_STORAGE_KEYS.visitedTabs);
      if (nv) {
        const parsed = JSON.parse(nv);
        if (Array.isArray(parsed)) setNetworkingVisited(new Set(parsed.filter(isNetworkingTab)));
      }

      // AWS
      const awt = localStorage.getItem(AWS_STORAGE_KEYS.activeTab);
      if (awt && isAwsTab(awt)) setAwsTab(awt);
      const av2 = localStorage.getItem(AWS_STORAGE_KEYS.visitedTabs);
      if (av2) {
        const parsed = JSON.parse(av2);
        if (Array.isArray(parsed)) setAwsVisited(new Set(parsed.filter(isAwsTab)));
      }

      // System Design
      const sdt = localStorage.getItem(SYSTEM_DESIGN_STORAGE_KEYS.activeTab);
      if (sdt && isSystemDesignTab(sdt)) setSystemDesignTab(sdt);
      const sdv = localStorage.getItem(SYSTEM_DESIGN_STORAGE_KEYS.visitedTabs);
      if (sdv) {
        const parsed = JSON.parse(sdv);
        if (Array.isArray(parsed)) setSystemDesignVisited(new Set(parsed.filter(isSystemDesignTab)));
      }

      // Distributed Systems
      const ddt = localStorage.getItem(DISTRIBUTED_SYSTEMS_STORAGE_KEYS.activeTab);
      if (ddt && isDistributedSystemsTab(ddt)) setDistributedSystemsTab(ddt);
      const ddv = localStorage.getItem(DISTRIBUTED_SYSTEMS_STORAGE_KEYS.visitedTabs);
      if (ddv) {
        const parsed = JSON.parse(ddv);
        if (Array.isArray(parsed)) setDistributedSystemsVisited(new Set(parsed.filter(isDistributedSystemsTab)));
      }

      // Algorithms
      const alt = localStorage.getItem(ALGORITHMS_STORAGE_KEYS.activeTab);
      if (alt && isAlgorithmsTab(alt)) setAlgorithmsTab(alt);
      const alv = localStorage.getItem(ALGORITHMS_STORAGE_KEYS.visitedTabs);
      if (alv) {
        const parsed = JSON.parse(alv);
        if (Array.isArray(parsed)) setAlgorithmsVisited(new Set(parsed.filter(isAlgorithmsTab)));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      if (activeDomain) localStorage.setItem(PLATFORM_STORAGE_KEYS.activeDomain, activeDomain);
      localStorage.setItem(STORAGE_KEYS.activeTab, devopsTab);
      localStorage.setItem(STORAGE_KEYS.visitedTabs, JSON.stringify([...devopsVisited]));
      localStorage.setItem(AZURE_STORAGE_KEYS.activeTab, azureTab);
      localStorage.setItem(AZURE_STORAGE_KEYS.visitedTabs, JSON.stringify([...azureVisited]));
      localStorage.setItem(PYTHON_STORAGE_KEYS.activeTab, pythonTab);
      localStorage.setItem(PYTHON_STORAGE_KEYS.visitedTabs, JSON.stringify([...pythonVisited]));
      localStorage.setItem(NETWORKING_STORAGE_KEYS.activeTab, networkingTab);
      localStorage.setItem(NETWORKING_STORAGE_KEYS.visitedTabs, JSON.stringify([...networkingVisited]));
      localStorage.setItem(AWS_STORAGE_KEYS.activeTab, awsTab);
      localStorage.setItem(AWS_STORAGE_KEYS.visitedTabs, JSON.stringify([...awsVisited]));
      localStorage.setItem(SYSTEM_DESIGN_STORAGE_KEYS.activeTab, systemDesignTab);
      localStorage.setItem(SYSTEM_DESIGN_STORAGE_KEYS.visitedTabs, JSON.stringify([...systemDesignVisited]));
      localStorage.setItem(DISTRIBUTED_SYSTEMS_STORAGE_KEYS.activeTab, distributedSystemsTab);
      localStorage.setItem(DISTRIBUTED_SYSTEMS_STORAGE_KEYS.visitedTabs, JSON.stringify([...distributedSystemsVisited]));
      localStorage.setItem(ALGORITHMS_STORAGE_KEYS.activeTab, algorithmsTab);
      localStorage.setItem(ALGORITHMS_STORAGE_KEYS.visitedTabs, JSON.stringify([...algorithmsVisited]));
    } catch { /* ignore */ }
  }, [activeDomain, devopsTab, devopsVisited, azureTab, azureVisited, pythonTab, pythonVisited, networkingTab, networkingVisited, awsTab, awsVisited, systemDesignTab, systemDesignVisited, distributedSystemsTab, distributedSystemsVisited, algorithmsTab, algorithmsVisited]);

  // ── Tab change handlers ──────────────────────────────────────────────
  const handleDevopsTab = (tab: DevOpsTab) => {
    setDevopsTab(tab);
    if (DEVOPS_STUDY_TABS.includes(tab as DevOpsStudyTab))
      setDevopsVisited(p => new Set([...p, tab]));
  };

  const handleAzureTab = (tab: AzureTab) => {
    setAzureTab(tab);
    if (AZURE_STUDY_TABS.includes(tab as AzureStudyTab))
      setAzureVisited(p => new Set([...p, tab]));
  };

  const handleNetworkingTab = (tab: NetworkingTab) => {
    setNetworkingTab(tab);
    if (NETWORKING_STUDY_TABS.includes(tab as NetworkingStudyTab))
      setNetworkingVisited(p => new Set([...p, tab]));
  };

  const handlePythonTab = (tab: PythonTab) => {
    setPythonTab(tab);
    if (PYTHON_STUDY_TABS.includes(tab as PythonStudyTab))
      setPythonVisited(p => new Set([...p, tab]));
  };

  const handleAwsTab = (tab: AwsTab) => {
    setAwsTab(tab);
    if (AWS_STUDY_TABS.includes(tab as AwsStudyTab))
      setAwsVisited(p => new Set([...p, tab]));
  };

  const handleSystemDesignTab = (tab: import('./types/systemDesign').SystemDesignTab) => {
    setSystemDesignTab(tab);
    if (SYSTEM_DESIGN_STUDY_TABS.includes(tab as import('./types/systemDesign').SystemDesignStudyTab))
      setSystemDesignVisited(p => new Set([...p, tab]));
  };

  const handleDistributedSystemsTab = (tab: import('./types/distributedSystems').DistributedSystemsTab) => {
    setDistributedSystemsTab(tab);
    if (DISTRIBUTED_SYSTEMS_STUDY_TABS.includes(tab as import('./types/distributedSystems').DistributedSystemsStudyTab))
      setDistributedSystemsVisited(p => new Set([...p, tab]));
  };

  const handleAlgorithmsTab = (tab: import('./types/algorithms').AlgorithmsTab) => {
    setAlgorithmsTab(tab);
    if (ALGORITHMS_STUDY_TABS.includes(tab as import('./types/algorithms').AlgorithmsStudyTab))
      setAlgorithmsVisited(p => new Set([...p, tab]));
  };

  // ── Reset ────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (activeDomain === 'devops') { setDevopsVisited(new Set()); setDevopsTab('dashboard'); }
    if (activeDomain === 'azure') { setAzureVisited(new Set()); setAzureTab('dashboard'); }
    if (activeDomain === 'networking') { setNetworkingVisited(new Set()); setNetworkingTab('dashboard'); }
    if (activeDomain === 'python') { setPythonVisited(new Set()); setPythonTab('dashboard'); }
    if (activeDomain === 'aws') { setAwsVisited(new Set()); setAwsTab('dashboard'); }
    if (activeDomain === 'system-design') { setSystemDesignVisited(new Set()); setSystemDesignTab('dashboard'); }
    if (activeDomain === 'distributed-systems') { setDistributedSystemsVisited(new Set()); setDistributedSystemsTab('dashboard'); }
    if (activeDomain === 'algorithms') { setAlgorithmsVisited(new Set()); setAlgorithmsTab('dashboard'); }
    setShowResetModal(false);
  };

  // ── Progress per domain ──────────────────────────────────────────────
  const devopsStudied = DEVOPS_STUDY_TABS.filter(t => devopsVisited.has(t)).length;
  const azureStudied = AZURE_STUDY_TABS.filter(t => azureVisited.has(t)).length;
  const networkingStudied = NETWORKING_STUDY_TABS.filter(t => networkingVisited.has(t)).length;
  const pythonStudied = PYTHON_STUDY_TABS.filter(t => pythonVisited.has(t)).length;
  const awsStudied = AWS_STUDY_TABS.filter(t => awsVisited.has(t)).length;
  const systemDesignStudied = SYSTEM_DESIGN_STUDY_TABS.filter(t => systemDesignVisited.has(t)).length;
  const distributedSystemsStudied = DISTRIBUTED_SYSTEMS_STUDY_TABS.filter(t => distributedSystemsVisited.has(t)).length;
  const algorithmsStudied = ALGORITHMS_STUDY_TABS.filter(t => algorithmsVisited.has(t)).length;

  const progressByDomain = {
    devops: { studied: devopsStudied, total: DEVOPS_STUDY_TABS.length },
    azure: { studied: azureStudied, total: AZURE_STUDY_TABS.length },
    aws: { studied: awsStudied, total: AWS_STUDY_TABS.length },
    networking: { studied: networkingStudied, total: NETWORKING_STUDY_TABS.length },
    python: { studied: pythonStudied, total: PYTHON_STUDY_TABS.length },
    'system-design': { studied: systemDesignStudied, total: SYSTEM_DESIGN_STUDY_TABS.length },
    'distributed-systems': { studied: distributedSystemsStudied, total: DISTRIBUTED_SYSTEMS_STUDY_TABS.length },
    'algorithms': { studied: algorithmsStudied, total: ALGORITHMS_STUDY_TABS.length },
  };

  // ── Platform-wide composite progress (coverage + consistency + engagement) ──
  const totalStudiedAll = devopsStudied + azureStudied + networkingStudied + pythonStudied + awsStudied + systemDesignStudied + distributedSystemsStudied + algorithmsStudied;
  const totalModulesAll = DEVOPS_STUDY_TABS.length + AZURE_STUDY_TABS.length + NETWORKING_STUDY_TABS.length + PYTHON_STUDY_TABS.length + AWS_STUDY_TABS.length + SYSTEM_DESIGN_STUDY_TABS.length + DISTRIBUTED_SYSTEMS_STUDY_TABS.length + ALGORITHMS_STUDY_TABS.length;
  const progressBreakdown = computeProgress(totalStudiedAll, totalModulesAll, daily.streak, activityEntries);

  // ── Active domain helpers ────────────────────────────────────────────
  const accent = ACCENT_CLASSES[activeDomain ? DOMAIN_ACCENT[activeDomain] : 'violet'] ?? ACCENT_CLASSES['violet'];

  function getActiveLabel(): string {
    if (!activeDomain) return '';
    if (activeDomain === 'devops') return devopsTab === 'dashboard' ? 'Dashboard' : devopsTab === 'exam' ? 'Simulado DevOps' : devopsTab === 'terraform-exam' ? 'Simulado Terraform Associate' : devopsTab === 'cka-exam' ? 'Simulado CKA' : DEVOPS_TAB_META[devopsTab as DevOpsStudyTab]?.label ?? '';
    if (activeDomain === 'azure') {
      if (activeCertId === 'az-400') return azureTab === 'dashboard' ? 'Dashboard' : azureTab === 'exam' ? 'Simulado AZ-400' : 'Azure DevOps';
      return azureTab === 'dashboard' ? 'Dashboard' : azureTab === 'exam' ? 'Simulado AZ-104' : AZURE_TAB_META[azureTab as AzureStudyTab]?.label ?? '';
    }
    if (activeDomain === 'networking') return networkingTab === 'dashboard' ? 'Dashboard' : networkingTab === 'exam' ? 'Simulado Redes' : NETWORKING_TAB_META[networkingTab as NetworkingStudyTab]?.label ?? '';
    if (activeDomain === 'python') return pythonTab === 'dashboard' ? 'Dashboard' : pythonTab === 'exam' ? 'Simulado Python' : PYTHON_TAB_META[pythonTab as PythonStudyTab]?.label ?? '';
    if (activeDomain === 'system-design') return systemDesignTab === 'dashboard' ? 'Dashboard' : SYSTEM_DESIGN_TAB_META[systemDesignTab as import('./types/systemDesign').SystemDesignStudyTab]?.label ?? '';
    if (activeDomain === 'distributed-systems') return distributedSystemsTab === 'dashboard' ? 'Dashboard' : DISTRIBUTED_SYSTEMS_TAB_META[distributedSystemsTab as import('./types/distributedSystems').DistributedSystemsStudyTab]?.label ?? '';
    if (activeDomain === 'algorithms') return algorithmsTab === 'dashboard' ? 'Dashboard' : ALGORITHMS_TAB_META[algorithmsTab as import('./types/algorithms').AlgorithmsStudyTab]?.label ?? '';
    if (activeDomain === 'aws' && activeCertId === 'aws-saa-c03') return awsTab === 'dashboard' ? 'Dashboard' : awsTab === 'exam' ? 'Simulado SAA-C03' : AWS_TAB_META[awsTab as AwsStudyTab]?.label ?? '';
    if (activeDomain === 'aws') return 'Amazon Web Services';
    return '';
  }

  function getActiveSubtitle(): string {
    if (!activeDomain) return '';
    if (activeDomain === 'devops') return devopsTab === 'exam' ? '20 questões DevOps' : devopsTab === 'terraform-exam' ? '25 questões · HashiCorp (003)' : devopsTab === 'cka-exam' ? '30 questões · CNCF' :DEVOPS_TAB_META[devopsTab as DevOpsStudyTab]?.subtitle ?? '';
    if (activeDomain === 'azure') {
      if (activeCertId === 'az-400') return azureTab === 'exam' ? 'Simulado AZ-400' : '';
      return azureTab === 'exam' ? 'Simulado AZ-104' : AZURE_TAB_META[azureTab as AzureStudyTab]?.subtitle ?? '';
    }
    if (activeDomain === 'networking') return NETWORKING_TAB_META[networkingTab as NetworkingStudyTab]?.subtitle ?? '';
    if (activeDomain === 'python') return PYTHON_TAB_META[pythonTab as PythonStudyTab]?.subtitle ?? '';
    if (activeDomain === 'system-design') return SYSTEM_DESIGN_TAB_META[systemDesignTab as import('./types/systemDesign').SystemDesignStudyTab]?.subtitle ?? '';
    if (activeDomain === 'distributed-systems') return DISTRIBUTED_SYSTEMS_TAB_META[distributedSystemsTab as import('./types/distributedSystems').DistributedSystemsStudyTab]?.subtitle ?? '';
    if (activeDomain === 'algorithms') return ALGORITHMS_TAB_META[algorithmsTab as import('./types/algorithms').AlgorithmsStudyTab]?.subtitle ?? '';
    if (activeDomain === 'aws' && activeCertId === 'aws-saa-c03') return awsTab === 'exam' ? 'Simulado SAA-C03' : AWS_TAB_META[awsTab as AwsStudyTab]?.subtitle ?? '';
    if (activeDomain === 'aws') return 'Certificações AWS';
    return '';
  }

  function getCurrentStudied() {
    if (activeDomain === 'devops') return { studied: devopsStudied, total: DEVOPS_STUDY_TABS.length };
    if (activeDomain === 'azure') return { studied: azureStudied, total: AZURE_STUDY_TABS.length };
    if (activeDomain === 'python') return { studied: pythonStudied, total: PYTHON_STUDY_TABS.length };
    if (activeDomain === 'aws') return { studied: awsStudied, total: AWS_STUDY_TABS.length };
    if (activeDomain === 'system-design') return { studied: systemDesignStudied, total: SYSTEM_DESIGN_STUDY_TABS.length };
    if (activeDomain === 'distributed-systems') return { studied: distributedSystemsStudied, total: DISTRIBUTED_SYSTEMS_STUDY_TABS.length };
    if (activeDomain === 'algorithms') return { studied: algorithmsStudied, total: ALGORITHMS_STUDY_TABS.length };
    return { studied: networkingStudied, total: NETWORKING_STUDY_TABS.length };
  }

  function getCurrentMenuGroups(): SidebarMenuGroup[] {
    if (activeDomain === 'devops') return devopsMenuGroups as SidebarMenuGroup[];
    if (activeDomain === 'azure') return azureMenuGroups as SidebarMenuGroup[];
    if (activeDomain === 'python') return PYTHON_MENU_GROUPS as SidebarMenuGroup[];
    if (activeDomain === 'aws' && activeCertId === 'aws-saa-c03') return awsMenuGroups as SidebarMenuGroup[];
    if (activeDomain === 'aws') {
      return [{ title: 'Certificações', items: [] }];
    }
    if (activeDomain === 'system-design') return systemDesignMenuGroups as SidebarMenuGroup[];
    if (activeDomain === 'distributed-systems') return distributedSystemsMenuGroups as SidebarMenuGroup[];
    if (activeDomain === 'algorithms') return algorithmsMenuGroups as SidebarMenuGroup[];
    return NETWORKING_MENU_GROUPS as SidebarMenuGroup[];
  }

  function getCurrentActiveTab(): string {
    if (activeDomain === 'devops') return devopsTab;
    if (activeDomain === 'azure') return azureTab;
    if (activeDomain === 'python') return pythonTab;
    if (activeDomain === 'aws' && activeCertId === 'aws-saa-c03') return awsTab;
    if (activeDomain === 'aws') return activeCertId ?? 'certs';
    if (activeDomain === 'system-design') return systemDesignTab;
    if (activeDomain === 'distributed-systems') return distributedSystemsTab;
    if (activeDomain === 'algorithms') return algorithmsTab;
    return networkingTab;
  }

  function getCurrentVisited(): Set<string> {
    if (activeDomain === 'devops') return devopsVisited as Set<string>;
    if (activeDomain === 'azure') return azureVisited as Set<string>;
    if (activeDomain === 'python') return pythonVisited as Set<string>;
    if (activeDomain === 'aws' && activeCertId === 'aws-saa-c03') return awsVisited as Set<string>;
    if (activeDomain === 'aws') return new Set();
    if (activeDomain === 'system-design') return systemDesignVisited as Set<string>;
    if (activeDomain === 'distributed-systems') return distributedSystemsVisited as Set<string>;
    if (activeDomain === 'algorithms') return algorithmsVisited as Set<string>;
    return networkingVisited as Set<string>;
  }

  function handleTabChange(tab: string) {
    if (activeDomain === 'devops') handleDevopsTab(tab as DevOpsTab);
    else if (activeDomain === 'azure') handleAzureTab(tab as AzureTab);
    else if (activeDomain === 'python') handlePythonTab(tab as PythonTab);
    else if (activeDomain === 'aws' && activeCertId === 'aws-saa-c03') handleAwsTab(tab as AwsTab);
    else if (activeDomain === 'aws') { /* no-op — cert-based */ }
    else if (activeDomain === 'system-design') handleSystemDesignTab(tab as import('./types/systemDesign').SystemDesignTab);
    else if (activeDomain === 'distributed-systems') handleDistributedSystemsTab(tab as import('./types/distributedSystems').DistributedSystemsTab);
    else if (activeDomain === 'algorithms') handleAlgorithmsTab(tab as import('./types/algorithms').AlgorithmsTab);
    else handleNetworkingTab(tab as NetworkingTab);
    if (tab !== 'dashboard' && tab !== 'exam') markStepComplete('study');
  }

  // ── Content renderer ─────────────────────────────────────────────────
  function renderContent() {
    if (!activeDomain) return null;

    // ── DevOps ──────────────────────────────────────────────────────
    if (activeDomain === 'devops') {
      if (devopsTab === 'dashboard') {
        return (
          <DashboardHome
            progressPct={Math.round((devopsStudied / DEVOPS_STUDY_TABS.length) * 100)}
            studiedCount={devopsStudied}
            completedTabs={DEVOPS_STUDY_TABS.filter(t => devopsVisited.has(t))}
            nextRecommendedTab={DEVOPS_STUDY_TABS.find(t => !devopsVisited.has(t)) ?? 'exam'}
            onOpenTab={handleDevopsTab}
          />
        );
      }
      if (devopsTab === 'exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><ExamSimulator /></div>;
      if (devopsTab === 'terraform-exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><TerraformAssociateExamSimulator /></div>;
      if (devopsTab === 'cka-exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><CkaExamSimulator /></div>;
      return <div className="border card-glass card-glass-hover p-5 md:p-6">{DEVOPS_CONTENT[devopsTab as DevOpsStudyTab]}</div>;
    }

    // ── Azure ────────────────────────────────────────────────────────
    if (activeDomain === 'azure') {
      // No cert selected → show cert hub
      if (activeCertId === null) {
        return (
          <CertHub
            domainLabel="Microsoft Azure"
            domainIcon={<Cloud size={28} className="text-sky-400" />}
            certs={getCertsFor('azure')}
            activeCertId={null}
            onSelectCert={(id) => setActiveCertId(id)}
          />
        );
      }

      // AZ-104 uses the existing full module set (identity/rbac/storage/...)
      if (activeCertId === 'az-104') {
        if (azureTab === 'dashboard') {
          const nextAzureTab = AZURE_STUDY_TABS.find(t => !azureVisited.has(t));
          return (
            <DomainDashboard
              eyebrow="Dashboard AZ-104"
              title="Azure Administrator Associate"
              description={`Identidade, governança, storage, compute, redes e monitorização no Azure. ${AZURE_STUDY_TABS.length} módulos alinhados com o exame AZ-104.`}
              accent="sky"
              progressPct={Math.round((azureStudied / AZURE_STUDY_TABS.length) * 100)}
              studiedCount={azureStudied}
              totalCount={AZURE_STUDY_TABS.length}
              menuGroups={azureMenuGroups as SidebarMenuGroup[]}
              visited={azureVisited as Set<string>}
              onOpenTab={(id) => handleAzureTab(id as AzureTab)}
              nextTabId={nextAzureTab ?? 'exam'}
              nextTabLabel={nextAzureTab ? AZURE_TAB_META[nextAzureTab]?.label : undefined}
              examTabId="exam"
              examLabel="Simulado AZ-104"
              onBack={() => setActiveCertId(null)}
            />
          );
        }
        if (azureTab === 'exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><AzureExamSimulator /></div>;

        const isStudyTab = AZURE_STUDY_TABS.includes(azureTab as AzureStudyTab);
        return (
          <div className="space-y-6">
            <div className="border card-glass card-glass-hover p-5 md:p-6">
              {AZURE_CONTENT[azureTab as AzureStudyTab]}
            </div>
            {isStudyTab && (
              <KnowledgeBase
                activeTab={azureTab}
                data={AZURE_KNOWLEDGE_DATA}
                accent="sky"
                eyebrow="Dashboard AZ-104"
              />
            )}
          </div>
        );
      }

      // AZ-400 (Azure DevOps Engineer Expert)
      if (activeCertId === 'az-400') {
        if (azureTab === 'dashboard') {
          return (
            <DomainDashboard
              eyebrow="Dashboard AZ-400"
              title="Azure DevOps Engineer Expert"
              description="35 questões · 6 tópicos · Pipelines, Repositórios, Boards, Segurança, Artefatos, Ambientes."
              accent="amber"
              progressPct={0}
              studiedCount={0}
              totalCount={0}
              menuGroups={[]}
              visited={new Set()}
              onOpenTab={(id) => handleAzureTab(id as AzureTab)}
              examTabId="exam"
              examLabel="Simulado AZ-400"
              onBack={() => setActiveCertId(null)}
            />
          );
        }
        if (azureTab === 'exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><AzureDevOpsExamSimulator /></div>;
        return (
          <div className="space-y-6">
            <div className="border card-glass card-glass-hover p-5 md:p-6">
              <p className="text-slate-300 text-sm">Tópico AZ-400: {azureTab}</p>
            </div>
          </div>
        );
      }

      // Other Azure certs (AZ-305 etc) - stub for now
      return (
        <ComingSoonCert
          certId={activeCertId}
          domainLabel="Microsoft Azure"
          domainIcon={<Cloud size={28} className="text-sky-400" />}
          onBack={() => setActiveCertId(null)}
        />
      );
    }

    // ── AWS ─────────────────────────────────────────────────────────
    if (activeDomain === 'aws') {
      if (activeCertId === null) {
        return (
          <CertHub
            domainLabel="Amazon Web Services"
            domainIcon={<Server size={28} className="text-orange-400" />}
            certs={getCertsFor('aws')}
            activeCertId={null}
            onSelectCert={(id) => setActiveCertId(id)}
          />
        );
      }

      // AWS SAA-C03 has real content
      if (activeCertId === 'aws-saa-c03') {
        if (awsTab === 'dashboard') {
          const nextAwsTab = AWS_STUDY_TABS.find(t => !awsVisited.has(t));
          return (
            <DomainDashboard
              eyebrow="Dashboard SAA-C03"
              title="AWS Solutions Architect Associate"
              description={`Compute, storage, redes, bases de dados e bem arquitetado na AWS. ${AWS_STUDY_TABS.length} módulos · 98 questões disponíveis.`}
              accent="orange"
              progressPct={Math.round((awsStudied / AWS_STUDY_TABS.length) * 100)}
              studiedCount={awsStudied}
              totalCount={AWS_STUDY_TABS.length}
              menuGroups={awsMenuGroups as SidebarMenuGroup[]}
              visited={awsVisited as Set<string>}
              onOpenTab={(id) => handleAwsTab(id as AwsTab)}
              nextTabId={nextAwsTab ?? 'exam'}
              nextTabLabel={nextAwsTab ? AWS_TAB_META[nextAwsTab]?.label : undefined}
              examTabId="exam"
              examLabel="Simulado SAA-C03"
              onBack={() => setActiveCertId(null)}
            />
          );
        }
        if (awsTab === 'exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><AwsExamSimulator /></div>;

        // Study module: show knowledge base
        return (
          <div className="space-y-6">
            <div className="border card-glass card-glass-hover p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{AWS_TAB_META[awsTab as AwsStudyTab]?.icon}</span>
                <div>
                  <h2 className="text-[18px] font-bold text-white">{AWS_TAB_META[awsTab as AwsStudyTab]?.label}</h2>
                  <p className="text-[12px] text-slate-400">{AWS_TAB_META[awsTab as AwsStudyTab]?.subtitle}</p>
                </div>
              </div>
              <KnowledgeBase
                activeTab={awsTab}
                data={AWS_KNOWLEDGE_DATA}
                accent="orange"
                eyebrow="Dashboard SAA-C03"
              />
            </div>
          </div>
        );
      }

      // Other AWS certs (not yet built)
      return (
        <ComingSoonCert
          certId={activeCertId}
          domainLabel="Amazon Web Services"
          domainIcon={<Server size={28} className="text-orange-400" />}
          onBack={() => setActiveCertId(null)}
        />
      );
    }

    // ── Networking ───────────────────────────────────────────────────
    if (activeDomain === 'networking') {
      if (networkingTab === 'dashboard') {
        const nextNetworkingTab = NETWORKING_STUDY_TABS.find(t => !networkingVisited.has(t));
        return (
          <DomainDashboard
            eyebrow="Dashboard · Redes"
            title="Redes & Cloud Networking"
            description={`Endereçamento IP, TCP/UDP, roteamento e segurança de rede. ${NETWORKING_STUDY_TABS.length} módulos práticos.`}
            accent="emerald"
            progressPct={Math.round((networkingStudied / NETWORKING_STUDY_TABS.length) * 100)}
            studiedCount={networkingStudied}
            totalCount={NETWORKING_STUDY_TABS.length}
            menuGroups={NETWORKING_MENU_GROUPS as SidebarMenuGroup[]}
            visited={networkingVisited as Set<string>}
            onOpenTab={(id) => handleNetworkingTab(id as NetworkingTab)}
            nextTabId={nextNetworkingTab ?? 'exam'}
            nextTabLabel={nextNetworkingTab ? NETWORKING_TAB_META[nextNetworkingTab]?.label : undefined}
            examTabId="exam"
            examLabel="Simulado Redes"
          />
        );
      }
      if (networkingTab === 'exam') {
        return <NetworkingExamSimulator />;
      }
      return (
        <div className="border card-glass card-glass-hover p-5 md:p-6">
          <NetworkingSimulator tab={networkingTab as NetworkingStudyTab} />
        </div>
      );
    }

    // ── Python ───────────────────────────────────────────────────────
    if (activeDomain === 'python') {
      if (pythonTab === 'dashboard') {
        const nextPythonTab = PYTHON_STUDY_TABS.find(t => !pythonVisited.has(t));
        return (
          <DomainDashboard
            eyebrow="Dashboard · Python"
            title="Python para DevOps"
            description={`Fundamentos, estruturas de dados, OOP e automação com Python. ${PYTHON_STUDY_TABS.length} módulos práticos.`}
            accent="amber"
            progressPct={Math.round((pythonStudied / PYTHON_STUDY_TABS.length) * 100)}
            studiedCount={pythonStudied}
            totalCount={PYTHON_STUDY_TABS.length}
            menuGroups={PYTHON_MENU_GROUPS as SidebarMenuGroup[]}
            visited={pythonVisited as Set<string>}
            onOpenTab={(id) => handlePythonTab(id as PythonTab)}
            nextTabId={nextPythonTab ?? 'exam'}
            nextTabLabel={nextPythonTab ? PYTHON_TAB_META[nextPythonTab]?.label : undefined}
            examTabId="exam"
            examLabel="Simulado Python"
          />
        );
      }
      if (pythonTab === 'exam') return <div className="border card-glass card-glass-hover p-5 md:p-6"><PythonExamSimulator /></div>;
      return (
        <div className="border card-glass card-glass-hover p-5 md:p-6">
          <PythonSimulator tab={pythonTab as PythonStudyTab} />
        </div>
      );
    }

    // ── System Design ──────────────────────────────────────────────
    if (activeDomain === 'system-design') {
      if (systemDesignTab === 'dashboard') {
        const nextSystemDesignTab = SYSTEM_DESIGN_STUDY_TABS.find(t => !systemDesignVisited.has(t));
        return (
          <DomainDashboard
            eyebrow="Dashboard · System Design"
            title="System Design"
            description={`Caching, sharding, mensageria, CAP theorem e estimativas de capacidade. ${SYSTEM_DESIGN_STUDY_TABS.length} módulos práticos.`}
            accent="rose"
            progressPct={Math.round((systemDesignStudied / SYSTEM_DESIGN_STUDY_TABS.length) * 100)}
            studiedCount={systemDesignStudied}
            totalCount={SYSTEM_DESIGN_STUDY_TABS.length}
            menuGroups={systemDesignMenuGroups as SidebarMenuGroup[]}
            visited={systemDesignVisited as Set<string>}
            onOpenTab={(id) => handleSystemDesignTab(id as import('./types/systemDesign').SystemDesignTab)}
            nextTabId={nextSystemDesignTab}
            nextTabLabel={nextSystemDesignTab ? SYSTEM_DESIGN_TAB_META[nextSystemDesignTab]?.label : undefined}
          />
        );
      }
      return (
        <div className="border card-glass card-glass-hover p-5 md:p-6">
          <SystemDesignSimulator tab={systemDesignTab as import('./types/systemDesign').SystemDesignStudyTab} />
        </div>
      );
    }

    // ── Distributed Systems ──────────────────────────────────────
    if (activeDomain === 'distributed-systems') {
      if (distributedSystemsTab === 'dashboard') {
        const nextDistributedSystemsTab = DISTRIBUTED_SYSTEMS_STUDY_TABS.find(t => !distributedSystemsVisited.has(t));
        return (
          <DomainDashboard
            eyebrow="Dashboard · Sistemas Distribuídos"
            title="Sistemas Distribuídos"
            description={`Consenso, tolerância a falhas, consistência e transações distribuídas. ${DISTRIBUTED_SYSTEMS_STUDY_TABS.length} módulos práticos.`}
            accent="teal"
            progressPct={Math.round((distributedSystemsStudied / DISTRIBUTED_SYSTEMS_STUDY_TABS.length) * 100)}
            studiedCount={distributedSystemsStudied}
            totalCount={DISTRIBUTED_SYSTEMS_STUDY_TABS.length}
            menuGroups={distributedSystemsMenuGroups as SidebarMenuGroup[]}
            visited={distributedSystemsVisited as Set<string>}
            onOpenTab={(id) => handleDistributedSystemsTab(id as import('./types/distributedSystems').DistributedSystemsTab)}
            nextTabId={nextDistributedSystemsTab}
            nextTabLabel={nextDistributedSystemsTab ? DISTRIBUTED_SYSTEMS_TAB_META[nextDistributedSystemsTab]?.label : undefined}
          />
        );
      }
      return (
        <div className="border card-glass card-glass-hover p-5 md:p-6">
          <DistributedSystemsSimulator tab={distributedSystemsTab as import('./types/distributedSystems').DistributedSystemsStudyTab} />
        </div>
      );
    }

    // ── Algorithms ──────────────────────────────────────────────
    if (activeDomain === 'algorithms') {
      if (algorithmsTab === 'dashboard') {
        const nextAlgorithmsTab = ALGORITHMS_STUDY_TABS.find(t => !algorithmsVisited.has(t));
        return (
          <DomainDashboard
            eyebrow="Dashboard · Algoritmos"
            title="Algoritmos & Paradigmas"
            description={`Complexidade, recursão, grafos, programação dinâmica e busca. ${ALGORITHMS_STUDY_TABS.length} módulos práticos.`}
            accent="cyan"
            progressPct={Math.round((algorithmsStudied / ALGORITHMS_STUDY_TABS.length) * 100)}
            studiedCount={algorithmsStudied}
            totalCount={ALGORITHMS_STUDY_TABS.length}
            menuGroups={algorithmsMenuGroups as SidebarMenuGroup[]}
            visited={algorithmsVisited as Set<string>}
            onOpenTab={(id) => handleAlgorithmsTab(id as import('./types/algorithms').AlgorithmsTab)}
            nextTabId={nextAlgorithmsTab}
            nextTabLabel={nextAlgorithmsTab ? ALGORITHMS_TAB_META[nextAlgorithmsTab]?.label : undefined}
          />
        );
      }
      return (
        <div className="border card-glass card-glass-hover p-5 md:p-6">
          <AlgorithmsSimulator tab={algorithmsTab as import('./types/algorithms').AlgorithmsStudyTab} />
        </div>
      );
    }

    return null;
  }

  // Scroll reveal for content area — re-observe whenever the domain changes
  // (the DOM node is replaced on navigation, so the old observer is stale)
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Force visible immediately (bypass CSS reveal for reliability)
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.classList.add('revealed');

    // Also set up IntersectionObserver as backup for scroll-triggered reveals
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('revealed');
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [activeDomain, devopsTab, azureTab, awsTab, pythonTab, networkingTab,
      systemDesignTab, distributedSystemsTab, algorithmsTab]);

  // ── Landing page ─────────────────────────────────────────────────────
  if (!activeDomain) {
    // Handler that opens a specific module from a learning path
    const openPathNode = (path: LearningPath, node: PathNode) => {
      setShowLearningPath(false);
      setActiveDomain(path.domain);
      if (path.domain === 'aws') {
        setActiveCertId('aws-saa-c03');
        setAwsTab(node.id as AwsTab);
        setAwsVisited(p => new Set([...p, node.id as AwsTab]));
      } else if (path.domain === 'azure') {
        setActiveCertId('az-104');
        setAzureTab(node.id as AzureTab);
        setAzureVisited(p => new Set([...p, node.id as AzureTab]));
      } else if (path.domain === 'devops') {
        setDevopsTab(node.id as DevOpsTab);
        setDevopsVisited(p => new Set([...p, node.id as DevOpsTab]));
      } else if (path.domain === 'networking') {
        setNetworkingTab(node.id as NetworkingTab);
        setNetworkingVisited(p => new Set([...p, node.id as NetworkingTab]));
      } else if (path.domain === 'python') {
        setPythonTab(node.id as PythonTab);
        setPythonVisited(p => new Set([...p, node.id as PythonTab]));
      } else if (path.domain === 'system-design') {
        setSystemDesignTab(node.id as import('./types/systemDesign').SystemDesignTab);
        setSystemDesignVisited(p => new Set([...p, node.id as import('./types/systemDesign').SystemDesignTab]));
      } else if (path.domain === 'distributed-systems') {
        setDistributedSystemsTab(node.id as import('./types/distributedSystems').DistributedSystemsTab);
        setDistributedSystemsVisited(p => new Set([...p, node.id as import('./types/distributedSystems').DistributedSystemsTab]));
      } else if (path.domain === 'algorithms') {
        setAlgorithmsTab(node.id as import('./types/algorithms').AlgorithmsTab);
        setAlgorithmsVisited(p => new Set([...p, node.id as import('./types/algorithms').AlgorithmsTab]));
      }
    };

    const visitedByDomain = {
      devops: devopsVisited as Set<string>,
      azure: azureVisited as Set<string>,
      aws: awsVisited as Set<string>,
      networking: networkingVisited as Set<string>,
      python: pythonVisited as Set<string>,
      'system-design': systemDesignVisited as Set<string>,
      'distributed-systems': distributedSystemsVisited as Set<string>,
      'algorithms': algorithmsVisited as Set<string>,
    };

    return (
      <main className="min-h-screen bg-[#1a1b26] text-slate-200">
        <TerminalTitleBar domain={null} />
        <header className="border-b border-slate-800/60 bg-[#181926]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
            <button
              onClick={() => { setScenariosView(null); setShowLearningPath(false); }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center bg-violet-500/20 border border-violet-500/30">
                <Terminal size={15} className="text-violet-400" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-black text-white font-display">Study Hub</div>
                <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 font-mono">Plataforma de Estudos</div>
              </div>
            </button>
            <div className="ml-auto flex items-center gap-3">
              {scenariosView === null && !showLearningPath && !showProjects && (
                <>
                  <button
                    onClick={() => setShowLearningPath(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-violet-500/30 bg-violet-500/10 text-violet-200 text-[11px] font-semibold hover:bg-violet-500/20 font-mono"
                  >
                    <MapIcon size={11} />
                    Learning Path
                  </button>
                  <button
                    onClick={() => setShowProjects(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-violet-500/30 bg-violet-500/10 text-violet-200 text-[11px] font-semibold hover:bg-violet-500/20 font-mono"
                  >
                    <Rocket size={11} />
                    Projectos
                  </button>
                  <button
                    onClick={() => setScenariosView('hub')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-violet-500/30 bg-violet-500/10 text-violet-200 text-[11px] font-semibold hover:bg-violet-500/20 font-mono"
                  >
                    <Target size={11} />
                    Cenários guiados
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          {/* Projects track view */}
          {showProjects && (
            <ProjectsView onExit={() => setShowProjects(false)} />
          )}

          {/* Learning Path view */}
          {!showProjects && showLearningPath && (
            <LearningPathView
              visitedByDomain={visitedByDomain}
              scenarioAttempts={allScenarioAttempts}
              terminalAttempts={allTerminalAttempts}
              streak={daily.streak}
              onOpenNode={openPathNode}
              onExit={() => setShowLearningPath(false)}
            />
          )}

          {/* Scenario player takes over */}
          {!showProjects && !showLearningPath && scenariosView !== null && typeof scenariosView === 'object' && scenariosView.type === 'scenario' && (() => {
            const s = findScenario(scenariosView.activeId);
            if (!s) { setScenariosView('hub'); return null; }
            return (
              <GuidedScenarioPlayer
                scenario={s}
                onExit={() => setScenariosView('hub')}
                onComplete={(attempt) => { recordScenarioAttempt(attempt); markStepComplete('study'); }}
              />
            );
          })()}

          {/* Challenge player takes over */}
          {!showProjects && !showLearningPath && scenariosView !== null && typeof scenariosView === 'object' && scenariosView.type === 'challenge' && (() => {
            const c = findChallenge(scenariosView.activeId);
            if (!c) { setScenariosView('hub'); return null; }
            return (
              <ChallengeScenarioPlayer
                scenario={c}
                onExit={() => setScenariosView('hub')}
                onComplete={(attempt) => { recordChallengeAttempt(attempt); markStepComplete('study'); }}
              />
            );
          })()}

          {/* Terminal player takes over */}
          {!showProjects && !showLearningPath && scenariosView !== null && typeof scenariosView === 'object' && scenariosView.type === 'terminal' && (() => {
            const s = findTerminalSession(scenariosView.activeId);
            if (!s) { setScenariosView('hub'); return null; }
            return (
              <TerminalPlayer
                session={s}
                onExit={() => setScenariosView('hub')}
                onComplete={(attempt) => { recordTerminalAttempt(attempt); markStepComplete('study'); }}
              />
            );
          })()}

          {/* Scenarios hub */}
          {!showProjects && !showLearningPath && scenariosView === 'hub' && (
            <ScenariosHub
              onOpenScenario={(id) => setScenariosView({ type: 'scenario', activeId: id })}
              onOpenChallenge={(id) => setScenariosView({ type: 'challenge', activeId: id })}
              onOpenTerminal={(id) => setScenariosView({ type: 'terminal', activeId: id })}
              domains={DOMAINS}
              bestScenarioAttemptFor={bestScenarioAttemptFor}
              bestChallengeAttemptFor={bestChallengeAttemptFor}
              bestTerminalAttemptFor={bestTerminalAttemptFor}
            />
          )}
        </div>

        {/* Default: landing */}
        {!showProjects && !showLearningPath && scenariosView === null && (
          <PlatformLanding
            progressBreakdown={progressBreakdown}
            onSelectDomain={(d) => { setActiveDomain(d as Domain); setActiveCertId(null); }}
          />
        )}
      </main>
    );
  }

  // ── Domain view ──────────────────────────────────────────────────────
  const { studied, total } = getCurrentStudied();
  const progressPct = Math.round((studied / total) * 100);
  const activeTab = getCurrentActiveTab();
  const showHeader = activeTab !== 'dashboard';

  return (
    <main className="noise-texture min-h-screen bg-[#1a1b26] text-slate-200">
      <div><TerminalTitleBar domain={activeDomain} /></div>
      {/* Header — Status line */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-[#181926]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
          {/* Back + Status line */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => { setActiveDomain(null); setActiveCertId(null); }}
              aria-label="Voltar ao painel principal"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-300 transition-colors shrink-0">
              <ChevronLeft size={14} />
              <Terminal size={14} />
            </button>

            <div className="min-w-0 flex-1 hidden sm:block">
              <StatusLine
                domain={activeDomain === 'azure' ? 'Azure' : activeDomain === 'aws' ? 'AWS' : activeDomain === 'networking' ? 'Redes' : activeDomain === 'python' ? 'Python' : activeDomain ? 'DevOps' : undefined}
                cert={activeCertId ? activeCertId.toUpperCase() : undefined}
                progress={studied}
                total={total}
                streak={daily.streak}
                nextItem={activeTab !== 'dashboard' ? getActiveLabel()?.split(' ')[0] : undefined}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button onClick={() => handleTabChange('exam')}
              className={`flex items-center gap-2 px-3 py-2 text-2xs font-semibold transition-all ${activeTab === 'exam' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'}`}>
              <GraduationCap size={13} />
              <span className="hidden sm:inline">Simulado</span>
            </button>
            <button onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-2xs font-semibold text-rose-200 hover:bg-rose-500/15 transition-all">
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        {/* Animated gradient mesh blobs — Stripe-inspired */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-[120px]" style={{ animation: 'mesh-drift-1 25s ease-in-out infinite' }} />
          <div className="absolute top-[50%] right-[0%] w-[500px] h-[500px] bg-cyan-500/7 rounded-full blur-[100px]" style={{ animation: 'mesh-drift-2 30s ease-in-out infinite' }} />
          <div className="absolute bottom-[5%] left-[25%] w-[400px] h-[400px] bg-emerald-500/6 rounded-full blur-[80px]" style={{ animation: 'mesh-drift-3 20s ease-in-out infinite' }} />
          <div className="absolute top-[25%] right-[20%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[70px]" style={{ animation: 'mesh-drift-4 28s ease-in-out infinite' }} />
        </div>
        {/* Floating ambient orbs */}
        <div className="absolute top-[15%] left-[8%] w-[200px] h-[200px] orb-violet rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[20%] right-[5%] w-[160px] h-[160px] orb-cyan rounded-full blur-3xl pointer-events-none" style={{ animation: 'float-reverse 12s ease-in-out infinite' }} />
        <div className="absolute top-[60%] left-[20%] w-[120px] h-[120px] orb-emerald rounded-full blur-2xl pointer-events-none" style={{ animation: 'float-slow 16s ease-in-out infinite' }} />
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar — generic, domain-aware */}
          <Sidebar
            activeTab={activeTab}
            visitedTabs={getCurrentVisited()}
            progressPct={progressPct}
            studiedCount={studied}
            totalTabs={total}
            menuGroups={getCurrentMenuGroups()}
            accentColor={DOMAIN_ACCENT[activeDomain]}
            onOpenTab={handleTabChange}
          />

          <div className="min-w-0 space-y-6">
            {/* Tab header */}
            {showHeader && (
              <section className="border card-glass card-glass-hover card-glass-violet p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 via-cyan-400/40 to-transparent" />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${accent.label}`}>Módulo atual</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">{getActiveLabel()}</h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{getActiveSubtitle()}</p>
                  </div>
                  <div className="grid min-w-[240px] grid-cols-2 gap-3">
                    <QuickStat icon={<Brain size={14} />} label="Feitos" value={`${studied}/${total}`} tone="sky" />
                    <QuickStat icon={<Sparkles size={14} />} label="Progresso" value={`${progressPct}%`} tone="emerald" />
                  </div>
                </div>
              </section>
            )}

            <div ref={contentRef} className="reveal reveal-delay-1">{renderContent()}</div>
          </div>
        </section>
      </div>

      <ResetProgressModal open={showResetModal} onClose={() => setShowResetModal(false)} onConfirm={handleReset} />
    </main>
  );
}
