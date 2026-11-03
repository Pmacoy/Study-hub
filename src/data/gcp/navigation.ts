import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Box,
  Cpu,
  GraduationCap,
  Network,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import type { GcpTab } from '../../types/gcp';

export interface MenuItem {
  id: GcpTab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const gcpMenuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso ACE', icon: BarChart3 },
      { id: 'exam', label: 'Simulado', sublabel: 'Teste ACE', icon: GraduationCap },
    ],
  },
  {
    title: 'Infraestrutura',
    items: [
      { id: 'compute',    label: 'Compute',          sublabel: 'GCE · GKE · Cloud Run', icon: Cpu },
      { id: 'storage',    label: 'Storage & DB',     sublabel: 'GCS · Cloud SQL · Spanner', icon: Box },
      { id: 'networking', label: 'Networking',       sublabel: 'VPC · Load Balancing', icon: Network },
    ],
  },
  {
    title: 'Architecture & Scaling',
    items: [
      { id: 'architecture', label: 'Cloud Architecture', sublabel: 'Design & Migração', icon: Box },
      { id: 'adv-networking', label: 'Advanced Network', sublabel: 'Peering & Interconnect', icon: Network },
      { id: 'scaling', label: 'Scaling & MIGs', sublabel: 'HPA, VPA & Serverless', icon: Activity },
    ],
  },
  {
    title: 'Segurança',
    items: [
      { id: 'iam', label: 'IAM & Segurança', sublabel: 'Identity · Roles · Policies', icon: ShieldCheck },
    ],
  },
];
