import type { DistributedSystemsStudyTab } from '../../types/distributedSystems';

export const DISTRIBUTED_SYSTEMS_TAB_META: Record<DistributedSystemsStudyTab, { label: string; subtitle: string }> = {
  'consensus': {
    label: 'Algoritmos de Consenso',
    subtitle: 'Paxos · Raft · PBFT · Lead election',
  },
  'fault-tolerance': {
    label: 'Tolerância a Falhas',
    subtitle: 'Replicação · State machines · Checkpoints',
  },
  'synchronization': {
    label: 'Sincronização',
    subtitle: 'Relógios lógico · Lamport · Vector clocks',
  },
  'consistency-models': {
    label: 'Modelos de Consistência',
    subtitle: 'Strong · Eventual · Causal · Session',
  },
  'distributed-transactions': {
    label: 'Transações Distribuídas',
    subtitle: '2PC · 3PC · Saga · TCC',
  },
  'coordination': {
    label: 'Coordenação Distribuída',
    subtitle: 'Distributed locks · Leader election · Barriers',
  },
};
