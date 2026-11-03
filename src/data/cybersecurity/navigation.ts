import { Shield, ShieldAlert, Lock, LayoutDashboard, GraduationCap } from 'lucide-react';
import type { CybersecurityTab } from '../../types/cybersecurity';
import type { SidebarMenuGroup } from '../../types/navigation';

export const cybersecurityMenuGroups: SidebarMenuGroup[] = [
  {
    title: 'Visão Geral',
    items: [
      { id: 'dashboard' as CybersecurityTab, label: 'Dashboard', sublabel: 'Progresso', icon: LayoutDashboard },
      { id: 'exam' as CybersecurityTab, label: 'Simulado', sublabel: 'Teste de Cyber', icon: GraduationCap },
    ],
  },
  {
    title: 'Defesa & Operações',
    items: [
      { id: 'soc-triage' as CybersecurityTab, label: 'SOC Triage', sublabel: 'Resposta a Incidentes', icon: ShieldAlert },
      { id: 'threat-hunting' as CybersecurityTab, label: 'Threat Hunting', sublabel: 'Blue Team', icon: Shield },
    ],
  },
  {
    title: 'Segurança Contínua',
    items: [
      { id: 'devsecops' as CybersecurityTab, label: 'DevSecOps', sublabel: 'Cloud & App Sec', icon: Lock },
    ],
  },
];
