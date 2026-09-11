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
  ShieldCheck,
} from 'lucide-react';
import type { AzureTab } from '../../types/azure';

export interface MenuItem {
  id: AzureTab;
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
      {
        id: 'dashboard',
        label: 'Dashboard',
        sublabel: 'Progresso e atalhos',
        icon: BarChart3,
      },
      {
        id: 'exam',
        label: 'Simulado',
        sublabel: 'Modo exame AZ-104',
        icon: GraduationCap,
      },
    ],
  },
  {
    title: 'Identidade e governança',
    items: [
      {
        id: 'identity',
        label: 'Entra ID',
        sublabel: 'Utilizadores & grupos',
        icon: Fingerprint,
      },
      {
        id: 'governance',
        label: 'Policy & Locks',
        sublabel: 'Governança e controlo',
        icon: ShieldCheck,
      },
      {
        id: 'rbac',
        label: 'RBAC',
        sublabel: 'Desafios de acesso',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Plataforma',
    items: [
      {
        id: 'storage',
        label: 'Storage Accounts',
        sublabel: 'Redundância e segurança',
        icon: Database,
      },
      {
        id: 'compute',
        label: 'Máquinas Virtuais',
        sublabel: 'HA, VMSS e escala',
        icon: Cpu,
      },
      {
        id: 'containers',
        label: 'Containers & PaaS',
        sublabel: 'ACI, AKS, App Service',
        icon: Box,
      },
      {
        id: 'vnet',
        label: 'Redes & Segurança',
        sublabel: 'NSG, Bastion, LB',
        icon: Network,
      },
      {
        id: 'monitor',
        label: 'Monitor & Backup',
        sublabel: 'Logs, ASR e Vault',
        icon: Activity,
      },
    ],
  },
];