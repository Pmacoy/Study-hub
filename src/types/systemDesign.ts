export type SystemDesignStudyTab =
  | 'cap-theorem'
  | 'caching'
  | 'load-balancer'
  | 'sharding'
  | 'messaging'
  | 'back-of-envelope';

export type SystemDesignTab = 'dashboard' | SystemDesignStudyTab;

export const SYSTEM_DESIGN_STUDY_TABS: SystemDesignStudyTab[] = [
  'cap-theorem',
  'caching',
  'load-balancer',
  'sharding',
  'messaging',
  'back-of-envelope',
];

export function isSystemDesignTab(value: string): value is SystemDesignTab {
  return (
    value === 'dashboard' ||
    (SYSTEM_DESIGN_STUDY_TABS as string[]).includes(value)
  );
}
