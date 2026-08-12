export type StudyTab =
  | 'devops-intro'
  | 'linux'
  | 'git'
  | 'docker'
  | 'kubernetes'
  | 'helm'
  | 'cicd'
  | 'terraform'
  | 'cloudformation'
  | 'monitoring'
  | 'finops'
  | 'security'
  | 'idp-backstage'
  | 'golden-paths'
  | 'dora-devex'
  | 'mlops';

export type DevOpsTab = 'dashboard' | 'exam' | StudyTab;

export const STUDY_TABS: StudyTab[] = [
  'devops-intro',
  'linux',
  'git',
  'docker',
  'kubernetes',
  'helm',
  'cicd',
  'terraform',
  'cloudformation',
  'monitoring',
  'finops',
  'security',
  'idp-backstage',
  'golden-paths',
  'dora-devex',
  'mlops',
];

export function isDevOpsTab(value: string): value is DevOpsTab {
  return (
    value === 'dashboard' ||
    value === 'exam' ||
    (STUDY_TABS as string[]).includes(value)
  );
}
