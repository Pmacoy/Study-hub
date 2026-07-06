import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Brain, GraduationCap, RotateCcw, Sparkles, Terminal, ChevronLeft, Globe } from 'lucide-react';

// Platform types
import type { Domain } from './types/platform';
import { DOMAINS } from './types/platform';

// DevOps types & data
import type { DevOpsTab, StudyTab as DevOpsStudyTab } from './types/devops';
import { STUDY_TABS as DEVOPS_STUDY_TABS, isDevOpsTab } from './types/devops';
import { TAB_META as DEVOPS_TAB_META } from './data/tabMeta';
import { STORAGE_KEYS, AZURE_STORAGE_KEYS, PLATFORM_STORAGE_KEYS } from './data/storageKeys';
import { menuGroups as devopsMenuGroups } from './data/navigation';

// Azure types & data
import type { AzureTab, StudyTab as AzureStudyTab } from './types/azure';
import { STUDY_TABS as AZURE_STUDY_TABS, isAzureTab } from './types/azure';
import { TAB_META as AZURE_TAB_META } from './data/azure/tabMeta';
import { menuGroups as azureMenuGroups } from './data/azure/navigation';

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
import CiCdSimulator from './components/devops/CiCdSimulator';
import TerraformSimulator from './components/devops/TerraformSimulator';
import MonitoringSimulator from './components/devops/MonitoringSimulator';
import SecuritySimulator from './components/devops/SecuritySimulator';
import IdpBackstageSimulator from './components/devops/IdpBackstageSimulator';
import GoldenPathsSimulator from './components/devops/GoldenPathsSimulator';
import DoraDevexSimulator from './components/devops/DoraDevexSimulator';
import ExamSimulator from './components/devops/ExamSimulator';

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
import AzureKnowledgeBase from './components/azure/AzureKnowledgeBase';

// Networking components
import NetworkingSimulator from './components/networking/NetworkingSimulator';

// Python components
import PythonSimulator from './components/python/PythonSimulator';
import PythonExamSimulator from './components/python/PythonExamSimulator';

// Layout components
import Sidebar from './components/layout/Sidebar';
import DashboardHome from './components/layout/DashboardHome';
import PlatformLanding from './components/layout/PlatformLanding';
import QuickStat from './components/shared/QuickStat';
import ResetProgressModal from './components/layout/ResetProgressModal';
import StreakBadge from './components/shared/StreakBadge';

// Daily streak / gamification
import { useDailyState } from './hooks/useDailyState';
import type { DailyStepId } from './types/daily';
import { useActivityLog } from './hooks/useActivityLog';
import { computeProgress } from './types/progress';

// Scenarios
import { useScenarioAttempts } from './hooks/useScenarioAttempts';
import { findScenario } from './data/scenarios';
import ScenariosHub from './components/scenarios/ScenariosHub';
import GuidedScenarioPlayer from './components/scenarios/GuidedScenarioPlayer';

// Terminal
import { useTerminalAttempts } from './hooks/useTerminalAttempts';
import { findTerminalSession } from './data/terminal';
import TerminalPlayer from './components/terminal/TerminalPlayer';

// ── DevOps + Platform Engineering content map ────────────────────────────
const DEVOPS_CONTENT: Record<DevOpsStudyTab, ReactNode> = {
  'devops-intro': <DevOpsIntroSimulator />,
  linux: <LinuxSimulator />,
  git: <GitSimulator />,
  docker: <DockerSimulator />,
  kubernetes: <KubernetesSimulator />,
  cicd: <CiCdSimulator />,
  terraform: <TerraformSimulator />,
  monitoring: <MonitoringSimulator />,
  security: <SecuritySimulator />,
  'idp-backstage': <IdpBackstageSimulator />,
  'golden-paths': <GoldenPathsSimulator />,
  'dora-devex': <DoraDevexSimulator />,
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
  gcp: 'rose',
  networking: 'emerald',
  python: 'amber',
};

const ACCENT_CLASSES: Record<string, { active: string; bar: string; label: string }> = {
  violet:  { active: 'border-violet-500/20 bg-violet-500/15 text-violet-300',   bar: 'from-violet-500 to-fuchsia-500',  label: 'text-violet-400' },
  sky:     { active: 'border-sky-500/20 bg-sky-500/15 text-sky-300',             bar: 'from-sky-500 to-blue-500',         label: 'text-sky-400' },
  emerald: { active: 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300', bar: 'from-emerald-500 to-teal-500',     label: 'text-emerald-400' },
  amber:   { active: 'border-amber-500/20 bg-amber-500/15 text-amber-300',       bar: 'from-amber-500 to-orange-500',     label: 'text-amber-400' },
  orange:  { active: 'border-orange-500/20 bg-orange-500/15 text-orange-300',    bar: 'from-orange-500 to-red-500',       label: 'text-orange-400' },
  rose:    { active: 'border-rose-500/20 bg-rose-500/15 text-rose-300',           bar: 'from-rose-500 to-pink-500',        label: 'text-rose-400' },
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
import { Activity, BarChart3, Globe2, GraduationCap as Grad, Shield, Network, Server, Wifi } from 'lucide-react';

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
  const { daily, markStepComplete, isStepDoneToday } = useDailyState();
  const { entries: activityEntries, logActivity } = useActivityLog();
  const { record: recordScenarioAttempt, bestAttemptFor: bestScenarioAttemptFor } = useScenarioAttempts();
  const { record: recordTerminalAttempt, bestAttemptFor: bestTerminalAttemptFor } = useTerminalAttempts();

  // ── Scenarios & terminal state ─────────────────────────────────
  const [scenariosView, setScenariosView] = useState<
    | null
    | 'hub'
    | { type: 'scenario'; activeId: string }
    | { type: 'terminal'; activeId: string }
  >(null);

  // ── Per-domain tab state ─────────────────────────────────────────────
  const [devopsTab, setDevopsTab] = useState<DevOpsTab>('dashboard');
  const [azureTab, setAzureTab] = useState<AzureTab>('dashboard');
  const [networkingTab, setNetworkingTab] = useState<NetworkingTab>('dashboard');
  const [pythonTab, setPythonTab] = useState<PythonTab>('dashboard');

  // ── Per-domain visited tabs ──────────────────────────────────────────
  const [devopsVisited, setDevopsVisited] = useState<Set<DevOpsTab>>(new Set());
  const [azureVisited, setAzureVisited] = useState<Set<AzureTab>>(new Set());
  const [networkingVisited, setNetworkingVisited] = useState<Set<NetworkingTab>>(new Set());
  const [pythonVisited, setPythonVisited] = useState<Set<PythonTab>>(new Set());

  // ── Active certification per cloud domain (Azure, AWS, GCP) ──────────
  // Default: null = show cert hub; else = show cert study modules
  const [activeCertId, setActiveCertId] = useState<string | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);

  // ── Persist & restore ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const d = localStorage.getItem(PLATFORM_STORAGE_KEYS.activeDomain) as Domain | null;
      if (d && ['devops', 'azure', 'aws', 'gcp', 'networking', 'python'].includes(d)) setActiveDomain(d);

      const dt = localStorage.getItem(STORAGE_KEYS.activeTab);
      if (dt && isDevOpsTab(dt)) setDevopsTab(dt);
      const dv = localStorage.getItem(STORAGE_KEYS.visitedTabs);
      if (dv) setDevopsVisited(new Set(JSON.parse(dv).filter(isDevOpsTab)));

      const at = localStorage.getItem(AZURE_STORAGE_KEYS.activeTab);
      if (at && isAzureTab(at)) setAzureTab(at);
      const av = localStorage.getItem(AZURE_STORAGE_KEYS.visitedTabs);
      if (av) setAzureVisited(new Set(JSON.parse(av).filter(isAzureTab)));

      const pt = localStorage.getItem(PYTHON_STORAGE_KEYS.activeTab);
      if (pt && isPythonTab(pt)) setPythonTab(pt);
      const pv = localStorage.getItem(PYTHON_STORAGE_KEYS.visitedTabs);
      if (pv) setPythonVisited(new Set(JSON.parse(pv).filter(isPythonTab)));
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
    } catch { /* ignore */ }
  }, [activeDomain, devopsTab, devopsVisited, azureTab, azureVisited, pythonTab, pythonVisited]);

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

  // ── Reset ────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (activeDomain === 'devops') { setDevopsVisited(new Set()); setDevopsTab('dashboard'); }
    if (activeDomain === 'azure') { setAzureVisited(new Set()); setAzureTab('dashboard'); }
    if (activeDomain === 'networking') { setNetworkingVisited(new Set()); setNetworkingTab('dashboard'); }
    if (activeDomain === 'python') { setPythonVisited(new Set()); setPythonTab('dashboard'); }
    setShowResetModal(false);
  };

  // ── Progress per domain ──────────────────────────────────────────────
  const devopsStudied = DEVOPS_STUDY_TABS.filter(t => devopsVisited.has(t)).length;
  const azureStudied = AZURE_STUDY_TABS.filter(t => azureVisited.has(t)).length;
  const networkingStudied = NETWORKING_STUDY_TABS.filter(t => networkingVisited.has(t)).length;
  const pythonStudied = PYTHON_STUDY_TABS.filter(t => pythonVisited.has(t)).length;

  const progressByDomain = {
    devops: { studied: devopsStudied, total: DEVOPS_STUDY_TABS.length },
    azure: { studied: azureStudied, total: AZURE_STUDY_TABS.length },
    aws: { studied: 0, total: 0 },
    gcp: { studied: 0, total: 0 },
    networking: { studied: networkingStudied, total: NETWORKING_STUDY_TABS.length },
    python: { studied: pythonStudied, total: PYTHON_STUDY_TABS.length },
  };

  // ── Platform-wide composite progress (coverage + consistency + engagement) ──
  const totalStudiedAll = devopsStudied + azureStudied + networkingStudied + pythonStudied;
  const totalModulesAll = DEVOPS_STUDY_TABS.length + AZURE_STUDY_TABS.length + NETWORKING_STUDY_TABS.length + PYTHON_STUDY_TABS.length;
  const progressBreakdown = computeProgress(totalStudiedAll, totalModulesAll, daily.streak, activityEntries);

  // ── Active domain helpers ────────────────────────────────────────────
  const accent = ACCENT_CLASSES[activeDomain ? DOMAIN_ACCENT[activeDomain] : 'violet'] ?? ACCENT_CLASSES['violet'];

  function getActiveLabel(): string {
    if (!activeDomain) return '';
    if (activeDomain === 'devops') return devopsTab === 'dashboard' ? 'Dashboard' : devopsTab === 'exam' ? 'Simulado DevOps' : DEVOPS_TAB_META[devopsTab as DevOpsStudyTab]?.label ?? '';
    if (activeDomain === 'azure') return azureTab === 'dashboard' ? 'Dashboard' : azureTab === 'exam' ? 'Simulado AZ-104' : AZURE_TAB_META[azureTab as AzureStudyTab]?.label ?? '';
    if (activeDomain === 'networking') return networkingTab === 'dashboard' ? 'Dashboard' : networkingTab === 'exam' ? 'Simulado Redes' : NETWORKING_TAB_META[networkingTab as NetworkingStudyTab]?.label ?? '';
    if (activeDomain === 'python') return pythonTab === 'dashboard' ? 'Dashboard' : pythonTab === 'exam' ? 'Simulado Python' : PYTHON_TAB_META[pythonTab as PythonStudyTab]?.label ?? '';
    if (activeDomain === 'aws') return 'Amazon Web Services';
    if (activeDomain === 'gcp') return 'Google Cloud';
    return '';
  }

  function getActiveSubtitle(): string {
    if (!activeDomain) return '';
    if (activeDomain === 'devops') return devopsTab === 'exam' ? '20 questões DevOps' : DEVOPS_TAB_META[devopsTab as DevOpsStudyTab]?.subtitle ?? '';
    if (activeDomain === 'azure') return azureTab === 'exam' ? 'Simulado AZ-104' : AZURE_TAB_META[azureTab as AzureStudyTab]?.subtitle ?? '';
    if (activeDomain === 'networking') return NETWORKING_TAB_META[networkingTab as NetworkingStudyTab]?.subtitle ?? '';
    if (activeDomain === 'python') return PYTHON_TAB_META[pythonTab as PythonStudyTab]?.subtitle ?? '';
    if (activeDomain === 'aws') return 'Certificações AWS';
    if (activeDomain === 'gcp') return 'Certificações Google Cloud';
    return '';
  }

  function getCurrentStudied() {
    if (activeDomain === 'devops') return { studied: devopsStudied, total: DEVOPS_STUDY_TABS.length };
    if (activeDomain === 'azure') return { studied: azureStudied, total: AZURE_STUDY_TABS.length };
    if (activeDomain === 'python') return { studied: pythonStudied, total: PYTHON_STUDY_TABS.length };
    if (activeDomain === 'aws' || activeDomain === 'gcp') return { studied: 0, total: 1 };
    return { studied: networkingStudied, total: NETWORKING_STUDY_TABS.length };
  }

  function getCurrentMenuGroups() {
    if (activeDomain === 'devops') return devopsMenuGroups;
    if (activeDomain === 'azure') return azureMenuGroups;
    if (activeDomain === 'python') return PYTHON_MENU_GROUPS;
    if (activeDomain === 'aws' || activeDomain === 'gcp') {
      return [{ title: 'Certificações', items: [] as { id: string; label: string; sublabel: string; icon: any }[] }];
    }
    return NETWORKING_MENU_GROUPS;
  }

  function getCurrentActiveTab(): string {
    if (activeDomain === 'devops') return devopsTab;
    if (activeDomain === 'azure') return azureTab;
    if (activeDomain === 'python') return pythonTab;
    if (activeDomain === 'aws' || activeDomain === 'gcp') return activeCertId ?? 'certs';
    return networkingTab;
  }

  function getCurrentVisited(): Set<string> {
    if (activeDomain === 'devops') return devopsVisited as Set<string>;
    if (activeDomain === 'azure') return azureVisited as Set<string>;
    if (activeDomain === 'python') return pythonVisited as Set<string>;
    if (activeDomain === 'aws' || activeDomain === 'gcp') return new Set();
    return networkingVisited as Set<string>;
  }

  function handleTabChange(tab: string) {
    if (activeDomain === 'devops') handleDevopsTab(tab as DevOpsTab);
    else if (activeDomain === 'azure') handleAzureTab(tab as AzureTab);
    else if (activeDomain === 'python') handlePythonTab(tab as PythonTab);
    else if (activeDomain === 'aws' || activeDomain === 'gcp') { /* no-op — cert-based */ }
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
      if (devopsTab === 'exam') return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6"><ExamSimulator /></div>;
      return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">{DEVOPS_CONTENT[devopsTab as DevOpsStudyTab]}</div>;
    }

    // ── Azure ────────────────────────────────────────────────────────
    if (activeDomain === 'azure') {
      // No cert selected → show cert hub
      if (activeCertId === null) {
        return (
          <CertHub
            domainLabel="Microsoft Azure"
            domainIcon="☁️"
            certs={getCertsFor('azure')}
            activeCertId={null}
            onSelectCert={(id) => setActiveCertId(id)}
          />
        );
      }

      // AZ-104 uses the existing full module set (identity/rbac/storage/...)
      if (activeCertId === 'az-104') {
        if (azureTab === 'dashboard') {
          return (
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-400">Dashboard AZ-104</p>
                    <h3 className="mt-1 text-2xl font-bold text-white">Azure Administrator Associate</h3>
                  </div>
                  <button onClick={() => setActiveCertId(null)}
                    className="text-[11px] text-slate-500 hover:text-slate-300 underline">
                    ← Escolher outra certificação
                  </button>
                </div>
                <p className="mt-2 text-slate-400 text-[14px]">{azureStudied}/{AZURE_STUDY_TABS.length} módulos concluídos · {Math.round((azureStudied / AZURE_STUDY_TABS.length) * 100)}% progresso</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {AZURE_STUDY_TABS.map(t => (
                    <button key={t} onClick={() => handleAzureTab(t)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${azureVisited.has(t) ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}>
                      {azureVisited.has(t) ? '✓ ' : ''}{AZURE_TAB_META[t]?.label}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => { const next = AZURE_STUDY_TABS.find(t => !azureVisited.has(t)); if (next) handleAzureTab(next); }}
                    className="px-4 py-2.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-200 text-[13px] font-semibold hover:bg-sky-500/15 transition-all">
                    Continuar estudo
                  </button>
                  <button onClick={() => handleAzureTab('exam')}
                    className="px-4 py-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-[13px] font-semibold hover:bg-amber-500/15 transition-all">
                    <GraduationCap size={13} className="inline mr-1" />Simulado AZ-104
                  </button>
                </div>
              </section>
            </div>
          );
        }
        if (azureTab === 'exam') return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6"><AzureExamSimulator /></div>;

        const isStudyTab = AZURE_STUDY_TABS.includes(azureTab as AzureStudyTab);
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
              {AZURE_CONTENT[azureTab as AzureStudyTab]}
            </div>
            {isStudyTab && <AzureKnowledgeBase activeTab={azureTab} />}
          </div>
        );
      }

      // Other Azure certs (AZ-305 etc) - stub for now
      return (
        <ComingSoonCert
          certId={activeCertId}
          domainLabel="Microsoft Azure"
          domainIcon="☁️"
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
            domainIcon="🟧"
            certs={getCertsFor('aws')}
            activeCertId={null}
            onSelectCert={(id) => setActiveCertId(id)}
          />
        );
      }
      return (
        <ComingSoonCert
          certId={activeCertId}
          domainLabel="Amazon Web Services"
          domainIcon="🟧"
          onBack={() => setActiveCertId(null)}
        />
      );
    }

    // ── GCP ─────────────────────────────────────────────────────────
    if (activeDomain === 'gcp') {
      if (activeCertId === null) {
        return (
          <CertHub
            domainLabel="Google Cloud"
            domainIcon="🟥"
            certs={getCertsFor('gcp')}
            activeCertId={null}
            onSelectCert={(id) => setActiveCertId(id)}
          />
        );
      }
      return (
        <ComingSoonCert
          certId={activeCertId}
          domainLabel="Google Cloud"
          domainIcon="🟥"
          onBack={() => setActiveCertId(null)}
        />
      );
    }

    // ── Networking ───────────────────────────────────────────────────
    if (activeDomain === 'networking') {
      if (networkingTab === 'dashboard') {
        return (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Dashboard · Redes</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Redes & Cloud Networking</h3>
            <p className="mt-2 text-slate-400 text-[14px]">{networkingStudied}/{NETWORKING_STUDY_TABS.length} módulos concluídos</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {NETWORKING_STUDY_TABS.map(t => (
                <button key={t} onClick={() => handleNetworkingTab(t)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${networkingVisited.has(t) ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}>
                  {networkingVisited.has(t) ? '✓ ' : ''}{NETWORKING_TAB_META[t]?.label}
                </button>
              ))}
            </div>
          </section>
        );
      }
      if (networkingTab === 'exam') {
        return (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-center">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-bold text-white mb-2">Simulado de Redes</h3>
            <p className="text-slate-400 text-[13px]">Em construção — estuda os módulos e volta aqui.</p>
          </div>
        );
      }
      return (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <NetworkingSimulator tab={networkingTab as NetworkingStudyTab} />
        </div>
      );
    }

    // ── Python ───────────────────────────────────────────────────────
    if (activeDomain === 'python') {
      if (pythonTab === 'dashboard') {
        return (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">Dashboard · Python</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Python para DevOps</h3>
            <p className="mt-2 text-slate-400 text-[14px]">{pythonStudied}/{PYTHON_STUDY_TABS.length} módulos concluídos</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PYTHON_STUDY_TABS.map(t => (
                <button key={t} onClick={() => handlePythonTab(t)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${pythonVisited.has(t) ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}>
                  {pythonVisited.has(t) ? '✓ ' : ''}{PYTHON_TAB_META[t]?.label}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => { const next = PYTHON_STUDY_TABS.find(t => !pythonVisited.has(t)); if (next) handlePythonTab(next); }}
                className="px-4 py-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-[13px] font-semibold hover:bg-amber-500/15 transition-all">
                Continuar estudo
              </button>
              <button onClick={() => handlePythonTab('exam')}
                className="px-4 py-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-200 text-[13px] font-semibold hover:bg-violet-500/15 transition-all">
                <GraduationCap size={13} className="inline mr-1" />Simulado Python
              </button>
            </div>
          </section>
        );
      }
      if (pythonTab === 'exam') return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6"><PythonExamSimulator /></div>;
      return (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <PythonSimulator tab={pythonTab as PythonStudyTab} />
        </div>
      );
    }

    return null;
  }

  // ── Landing page ─────────────────────────────────────────────────────
  if (!activeDomain) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200">
        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
            <button
              onClick={() => setScenariosView(null)}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
                <Terminal size={15} className="text-violet-400" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-black text-white">Study Hub</div>
                <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">Plataforma de Estudos</div>
              </div>
            </button>
            <div className="ml-auto flex items-center gap-3">
              {scenariosView === null && (
                <button
                  onClick={() => setScenariosView('hub')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200 text-[11px] font-semibold hover:bg-violet-500/20"
                >
                  🎯 Cenários guiados
                </button>
              )}
              <StreakBadge streak={daily.streak} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          {/* Scenario player takes over */}
          {scenariosView !== null && typeof scenariosView === 'object' && scenariosView.type === 'scenario' && (() => {
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

          {/* Terminal player takes over */}
          {scenariosView !== null && typeof scenariosView === 'object' && scenariosView.type === 'terminal' && (() => {
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
          {scenariosView === 'hub' && (
            <ScenariosHub
              onOpenScenario={(id) => setScenariosView({ type: 'scenario', activeId: id })}
              onOpenTerminal={(id) => setScenariosView({ type: 'terminal', activeId: id })}
              domains={DOMAINS}
              bestScenarioAttemptFor={bestScenarioAttemptFor}
              bestTerminalAttemptFor={bestTerminalAttemptFor}
            />
          )}
        </div>

        {/* Default: landing */}
        {scenariosView === null && (
          <PlatformLanding
            domains={DOMAINS}
            progressByDomain={progressByDomain}
            onSelectDomain={(d) => { setActiveDomain(d); setActiveCertId(null); }}
            daily={daily}
            isStepDoneToday={isStepDoneToday}
            onMarkStep={(step: DailyStepId) => markStepComplete(step)}
            onLogActivity={logActivity}
            progressBreakdown={progressBreakdown}
            onOpenScenarios={() => setScenariosView('hub')}
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
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
          {/* Back + Logo */}
          <button onClick={() => { setActiveDomain(null); setActiveCertId(null); }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors shrink-0">
            <ChevronLeft size={14} />
            <Terminal size={14} />
          </button>

          {/* Domain badge */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shrink-0 ${accent.active}`}>
            {activeDomain === 'devops' ? '⚙️' : activeDomain === 'azure' ? '☁️' : activeDomain === 'python' ? '🐍' : activeDomain === 'aws' ? '🟧' : activeDomain === 'gcp' ? '🟥' : '🌐'}
            <span>{activeDomain === 'azure' ? 'Azure' : activeDomain === 'aws' ? 'AWS' : activeDomain === 'gcp' ? 'GCP' : activeDomain === 'networking' ? 'Redes' : activeDomain === 'python' ? 'Python' : 'DevOps'}</span>
          </div>

          {/* Progress bar */}
          <div className="hidden max-w-md flex-1 items-center gap-3 lg:flex">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div className={`h-full rounded-full bg-gradient-to-r ${accent.bar} transition-all duration-700`}
                style={{ width: `${progressPct}%` }} />
            </div>
            <span className="whitespace-nowrap text-[11px] font-semibold text-slate-400">{studied}/{total} módulos</span>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <StreakBadge streak={daily.streak} />
            <button onClick={() => handleTabChange('exam')}
              className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold transition-all ${activeTab === 'exam' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'}`}>
              <GraduationCap size={13} />
              <span className="hidden sm:inline">Simulado</span>
            </button>
            <button onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[12px] font-semibold text-rose-200 hover:bg-rose-500/15 transition-all">
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
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
              <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
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

            {renderContent()}
          </div>
        </section>
      </div>

      <ResetProgressModal open={showResetModal} onClose={() => setShowResetModal(false)} onConfirm={handleReset} />
    </main>
  );
}
