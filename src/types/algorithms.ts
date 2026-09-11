export type AlgorithmsStudyTab =
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'dynamic-programming'
  | 'recursion'
  | 'complexity';

export type AlgorithmsTab = 'dashboard' | AlgorithmsStudyTab;

export const ALGORITHMS_STUDY_TABS: AlgorithmsStudyTab[] = [
  'sorting',
  'searching',
  'graph',
  'dynamic-programming',
  'recursion',
  'complexity',
];

export function isAlgorithmsTab(value: string): value is AlgorithmsTab {
  return (
    value === 'dashboard' ||
    (ALGORITHMS_STUDY_TABS as string[]).includes(value)
  );
}
