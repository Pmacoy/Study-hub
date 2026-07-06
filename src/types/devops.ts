export type StudyTab =
  | 'devops-intro'
  | 'linux'
  | 'git'
  | 'docker'
  | 'kubernetes'
  | 'cicd'
  | 'terraform'
  | 'monitoring'
  | 'security'
  | 'idp-backstage'
  | 'golden-paths'
  | 'dora-devex';

export type DevOpsTab = 'dashboard' | 'exam' | StudyTab;

export const STUDY_TABS: StudyTab[] = [
  'devops-intro',
  'linux',
  'git',
  'docker',
  'kubernetes',
  'cicd',
  'terraform',
  'monitoring',
  'security',
  'idp-backstage',
  'golden-paths',
  'dora-devex',
];

export function isDevOpsTab(value: string): value is DevOpsTab {
  return (
    value === 'dashboard' ||
    value === 'exam' ||
    (STUDY_TABS as string[]).includes(value)
  );
}
