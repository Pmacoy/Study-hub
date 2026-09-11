import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Blocks,
  BrainCircuit,
  Box,
  Boxes,
  Container,
  GaugeCircle,
  GitBranch,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Package,
  Route,
  Shield,
  Terminal,
  Network,
  RotateCw,
  AlertTriangle,
} from 'lucide-react';
import type { DevOpsTab } from '../types/devops';

export interface MenuItem {
  id: DevOpsTab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso e atalhos', icon: BarChart3 },
      { id: 'exam', label: 'Simulado', sublabel: 'Modo exame', icon: GraduationCap },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'devops-intro', label: 'DevOps & DevSecOps', sublabel: 'Cultura e ciclo de vida', icon: LayoutDashboard },
      { id: 'linux', label: 'Linux & Shell', sublabel: 'Comandos e scripting', icon: Terminal },
      { id: 'git', label: 'Git & Versionamento', sublabel: 'Branches e workflows', icon: GitBranch },
    ],
  },
  {
    title: 'Containers',
    items: [
      { id: 'docker', label: 'Docker', sublabel: 'Imagens e Dockerfile', icon: Box },
      { id: 'kubernetes', label: 'Kubernetes', sublabel: 'Pods, Services e RBAC', icon: Container },
      { id: 'helm', label: 'Helm', sublabel: 'Charts e releases', icon: Package },
    ],
  },
  {
    title: 'Automação',
    items: [
      { id: 'cicd', label: 'CI/CD Pipelines', sublabel: 'Jenkins · GH Actions', icon: Layers },
      { id: 'terraform', label: 'Terraform / IaC', sublabel: 'Módulos e multi-cloud', icon: GitBranch },
      { id: 'cloudformation', label: 'CloudFormation', sublabel: 'Templates e stacks AWS', icon: Boxes },
    ],
  },
  {
    title: 'Operações',
    items: [
      { id: 'monitoring', label: 'Monitoring', sublabel: 'Prometheus · Grafana · ELK', icon: Activity },
      { id: 'security', label: 'DevSecOps', sublabel: 'SonarQube · Trivy · OPA', icon: Shield },
    ],
  },
  {
    title: 'Platform Engineering',
    items: [
      { id: 'idp-backstage', label: 'IDP & Backstage', sublabel: 'Developer portal · Catalog', icon: Blocks },
      { id: 'golden-paths', label: 'Golden Paths', sublabel: 'Paved-road templates', icon: Route },
      { id: 'dora-devex', label: 'DORA & DevEx', sublabel: 'Métricas · Cognitive load', icon: GaugeCircle },
      { id: 'mlops', label: 'MLOps & AI', sublabel: 'MLflow · drift · agentic AI', icon: BrainCircuit },
      { id: 'service-mesh', label: 'Service Mesh', sublabel: 'Istio · mTLS · Traffic', icon: Network },
      { id: 'gitops', label: 'GitOps', sublabel: 'Argo CD · Flux · Declarative', icon: RotateCw },
      { id: 'sre', label: 'SRE & Fiabilidade', sublabel: 'SLO · Error Budget · Incidents', icon: AlertTriangle },
    ],
  },
];
