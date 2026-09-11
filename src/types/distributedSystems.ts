export type DistributedSystemsStudyTab =
  | 'consensus'
  | 'fault-tolerance'
  | 'synchronization'
  | 'consistency-models'
  | 'distributed-transactions'
  | 'coordination';

export type DistributedSystemsTab = 'dashboard' | DistributedSystemsStudyTab;

export const DISTRIBUTED_SYSTEMS_STUDY_TABS: DistributedSystemsStudyTab[] = [
  'consensus',
  'fault-tolerance',
  'synchronization',
  'consistency-models',
  'distributed-transactions',
  'coordination',
];

export function isDistributedSystemsTab(value: string): value is DistributedSystemsTab {
  return (
    value === 'dashboard' ||
    (DISTRIBUTED_SYSTEMS_STUDY_TABS as string[]).includes(value)
  );
}
