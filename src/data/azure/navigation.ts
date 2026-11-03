import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Box,
  Cpu,
  Database,
  Fingerprint,
  GraduationCap,
  LayoutDashboard,
  Network,
  Scale,
  Server,
  Shield,
  ShieldCheck,
  GitMerge,
  RefreshCw,
  PlayCircle,
} from 'lucide-react';
import type { AzureTab } from '../../types/azure';

export type MenuGroup = {
  title: string;
  items: {
    id: string;
    label: string;
    sublabel: string;
    icon: LucideIcon;
  }[];
};

export const menuGroups: MenuGroup[] = [
  {
    title: 'Visão Geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso e atalhos', icon: LayoutDashboard },
      { id: 'exam', label: 'Simulado', sublabel: 'Modo exame AZ-900', icon: GraduationCap },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'concepts', label: 'Conceitos', sublabel: 'Modelos de cloud', icon: BarChart3 },
      { id: 'architecture', label: 'Arquitetura', sublabel: 'Regiões e recursos', icon: Server },
      { id: 'management', label: 'Gestão', sublabel: 'Portal e CLI', icon: Cpu },
    ],
  },
  {
    title: 'Identidade & Governance',
    items: [
      { id: 'identity', label: 'Identidade', sublabel: 'Entra ID e proteção', icon: Fingerprint },
      { id: 'governance', label: 'Governance', sublabel: 'Policy, Locks e Cost', icon: Scale },
      { id: 'rbac', label: 'RBAC', sublabel: 'Role-based access', icon: Shield },
    ],
  },
  {
    title: 'Core Services',
    items: [
      { id: 'storage', label: 'Storage Accounts', sublabel: 'LRS, ZRS, GRS, GZRS', icon: Database },
      { id: 'compute', label: 'Máquinas Virtuais', sublabel: 'HA, VMSS e PaaS', icon: Server },
      { id: 'containers', label: 'Containers & PaaS', sublabel: 'ACI, AKS, App Service', icon: Box },
      { id: 'vnet', label: 'Redes & Segurança', sublabel: 'NSG, Bastion, LB', icon: Network },
      { id: 'monitor', label: 'Monitor & Backup', sublabel: 'Logs, ASR e Vault', icon: Activity },
    ],
  },
];

export const getAzureMenuForCert = (certId: string | null): MenuGroup[] => {
  if (certId === 'az-900') {
    return [menuGroups[0], menuGroups[1]];
  }
  if (certId === 'az-104') {
    return [
      { ...menuGroups[0], items: [{...menuGroups[0].items[0]}, {...menuGroups[0].items[1], sublabel: 'Modo exame AZ-104'}] },
      menuGroups[2],
      menuGroups[3],
    ];
  }
  if (certId === 'az-305') {
    return [
      { ...menuGroups[0], items: [{...menuGroups[0].items[0]}, {...menuGroups[0].items[1], sublabel: 'Modo exame AZ-305'}] },
      { 
        title: 'Arquitetura de Soluções', 
        items: [
          { id: 'design-infra', label: 'Design de Infra', sublabel: 'Soluções de compute e redes.', icon: Server },
          { id: 'design-data', label: 'Data Storage', sublabel: 'Design de SQL, CosmosDB e Storage Accounts.', icon: Database },
          { id: 'design-bcdr', label: 'BCDR Design', sublabel: 'Continuidade de negócio e disaster recovery.', icon: RefreshCw }
        ] 
      }
    ];
  }
  if (certId === 'az-400') {
    return [
      { ...menuGroups[0], items: [{...menuGroups[0].items[0]}, {...menuGroups[0].items[1], sublabel: 'Modo exame AZ-400'}] },
      { 
        title: 'DevOps & CI/CD', 
        items: [
          { id: 'cicd', label: 'CI/CD Pipelines', sublabel: 'Pipelines no Azure DevOps e GitHub Actions.', icon: PlayCircle },
          { id: 'source-control', label: 'Source Control', sublabel: 'Repositórios e branching strategy.', icon: GitMerge },
          { id: 'devsecops', label: 'DevSecOps', sublabel: 'Segurança contínua e secret scanning.', icon: ShieldCheck }
        ] 
      }
    ];
  }
  return menuGroups;
};