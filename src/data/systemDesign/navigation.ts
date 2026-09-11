import type { SystemDesignTab } from '../../types/systemDesign';
import {
  BarChart3,
  Database,
  Cpu,
  Network,
  Hash,
  MessageSquare,
  Calculator,
  GraduationCap,
} from 'lucide-react';

export interface MenuItem {
  id: SystemDesignTab;
  label: string;
  sublabel: string;
  icon: typeof BarChart3;
}
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const systemDesignMenuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso', icon: BarChart3 },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'cap-theorem', label: 'Teorema CAP', sublabel: 'CAP · Consistência eventual', icon: Database },
      { id: 'caching', label: 'Estratégias de Cache', sublabel: 'Cache-aside · TTL · Coalescing', icon: Cpu },
      { id: 'load-balancer', label: 'Load Balancing', sublabel: 'L4 · L7 · Algoritmos', icon: Network },
    ],
  },
  {
    title: 'Escalabilidade',
    items: [
      { id: 'sharding', label: 'Sharding', sublabel: 'Hash · Range · Consistent', icon: Hash },
      { id: 'messaging', label: 'Message Queues', sublabel: 'Kafka · RabbitMQ · Patterns', icon: MessageSquare },
      { id: 'back-of-envelope', label: 'Back-of-Envelope', sublabel: 'Cálculos de capacidade', icon: Calculator },
    ],
  },
];
