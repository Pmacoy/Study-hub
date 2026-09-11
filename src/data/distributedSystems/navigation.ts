import type { DistributedSystemsTab } from '../../types/distributedSystems';
import {
  BarChart3,
  Shuffle,
  ShieldCheck,
  Clock,
  Scale,
  GitMerge,
  Lock,
  GraduationCap,
} from 'lucide-react';

export interface MenuItem {
  id: DistributedSystemsTab;
  label: string;
  sublabel: string;
  icon: typeof BarChart3;
}
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const distributedSystemsMenuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso', icon: BarChart3 },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'consensus', label: 'Consenso', sublabel: 'Paxos · Raft · PBFT', icon: Shuffle },
      { id: 'fault-tolerance', label: 'Tolerância a Falhas', sublabel: 'Replicação · Checkpoints', icon: ShieldCheck },
      { id: 'synchronization', label: 'Sincronização', sublabel: 'Lamport · Vector clocks', icon: Clock },
    ],
  },
  {
    title: 'Padrões Avançados',
    items: [
      { id: 'consistency-models', label: 'Consistência', sublabel: 'Strong · Eventual · Causal', icon: Scale },
      { id: 'distributed-transactions', label: 'Transações', sublabel: '2PC · Saga · TCC', icon: GitMerge },
      { id: 'coordination', label: 'Coordenação', sublabel: 'Distributed locks · Barriers', icon: Lock },
    ],
  },
];
