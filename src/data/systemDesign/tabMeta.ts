import type { SystemDesignStudyTab } from '../../types/systemDesign';

export const SYSTEM_DESIGN_TAB_META: Record<SystemDesignStudyTab, { label: string; subtitle: string }> = {
  'cap-theorem': {
    label: 'Teorema CAP',
    subtitle: 'Consistência · Disponibilidade · Tolerância a particionamento',
  },
  'caching': {
    label: 'Estratégias de Cache',
    subtitle: 'Cache-aside · Write-through · TTL · Invalidção',
  },
  'load-balancer': {
    label: 'Load Balancing',
    subtitle: 'Layer 4 · Layer 7 · Round-robin · Least-connections',
  },
  'sharding': {
    label: 'Sharding de Base de Dados',
    subtitle: 'Hash · Range · Consistent hashing · Rebalanceamento',
  },
  'messaging': {
    label: 'Message Queues',
    subtitle: 'Pub/Sub · Kafka · RabbitMQ · At-least-once · Exactly-once',
  },
  'back-of-envelope': {
    label: 'Back-of-Envelope',
    subtitle: 'Cálculos rápidos de capacidade · Storage · Throughput',
  },
};
