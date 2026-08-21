export type NetworkingStudyTab =
  | 'ip-calc'
  | 'transport'
  | 'ip-addressing'
  | 'application'
  | 'routing'
  | 'security-net'
  | 'net-reference';

export type NetworkingTab = 'dashboard' | 'exam' | NetworkingStudyTab;

export const NETWORKING_STUDY_TABS: NetworkingStudyTab[] = [
  'ip-calc',
  'transport',
  'ip-addressing',
  'application',
  'routing',
  'security-net',
  'net-reference',
];

export function isNetworkingTab(value: string): value is NetworkingTab {
  return (
    value === 'dashboard' ||
    value === 'exam' ||
    (NETWORKING_STUDY_TABS as string[]).includes(value)
  );
}
