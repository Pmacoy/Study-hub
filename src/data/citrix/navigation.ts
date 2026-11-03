import { BarChart3, GraduationCap, Server, Zap, UserCheck, Package, Cpu, Rocket } from 'lucide-react';
import type { SidebarMenuGroup } from '../../types/navigation';
import type { CitrixTab } from '../../types/citrix';

export const citrixMenuGroups: SidebarMenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard' as CitrixTab, label: 'Dashboard', sublabel: 'Progresso Citrix', icon: BarChart3 },
      { id: 'exam' as CitrixTab, label: 'Simulado', sublabel: 'Teste Citrix VDI', icon: GraduationCap },
    ],
  },
  {
    title: 'Módulos Práticos',
    items: [
      { id: 'daas-mcs' as CitrixTab, label: 'Citrix DaaS & MCS', sublabel: 'Catálogos & Update', icon: Server },
      { id: 'wem' as CitrixTab, label: 'Citrix WEM', sublabel: 'Logon & Cache', icon: Zap },
      { id: 'profile-management' as CitrixTab, label: 'Profile Management', sublabel: 'UPM & Container', icon: UserCheck },
      { id: 'fslogix' as CitrixTab, label: 'FSLogix Container', sublabel: 'VHDX & ODFC', icon: Package },
      { id: 'packer-gold-image' as CitrixTab, label: 'Packer Gold Image', sublabel: 'AMI VDA Automatizado', icon: Cpu },
      { id: 'terraform-citrix' as CitrixTab, label: 'Terraform Citrix', sublabel: 'Site como Código', icon: Server },
      { id: 'pipeline-gitlab' as CitrixTab, label: 'GitLab CI/CD', sublabel: 'Pipeline DevOps', icon: Rocket },
    ],
  },
];
