import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Box,
  Cpu,
  GraduationCap,
  Network,
  ShieldCheck,
  Database,
  Server,
} from 'lucide-react';
import type { OciTab } from '../../types/oci';

export interface MenuItem {
  id: OciTab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const ociMenuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso OCI', icon: BarChart3 },
      { id: 'exam', label: 'Simulado', sublabel: 'Teste de Conhecimentos', icon: GraduationCap },
    ],
  },
  {
    title: 'OCI Foundations',
    items: [
      { id: 'iam', label: 'IAM', sublabel: 'Compartments e Policies', icon: ShieldCheck },
      { id: 'compute', label: 'Compute', sublabel: 'Bare Metal · OKE', icon: Cpu },
      { id: 'storage', label: 'Storage', sublabel: 'Block · Object', icon: Box },
    ],
  },
  {
    title: 'OCI Architect',
    items: [
      { id: 'networking', label: 'Networking', sublabel: 'VCNs · Gateways', icon: Network },
      { id: 'database', label: 'Database', sublabel: 'Autonomous DB', icon: Database },
      { id: 'architecture', label: 'Architecture', sublabel: 'HA · DR', icon: Server },
    ],
  },
];

export const getOciMenuForCert = (certId: string | null): MenuGroup[] => {
  if (certId === 'oci-foundations-2026') {
    return [ociMenuGroups[0], ociMenuGroups[1]];
  }
  if (certId === 'oci-architect-2026') {
    return [
      ociMenuGroups[0],
      ociMenuGroups[1],
      ociMenuGroups[2],
    ];
  }
  // Default to showing everything if no cert selected
  return ociMenuGroups;
};
