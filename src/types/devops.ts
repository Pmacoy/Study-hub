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
  | 'security'
  | 'idp-backstage'
  | 'golden-paths'
  | 'dora-devex'
  | 'mlops'
  | 'service-mesh'
  | 'gitops'
  | 'sre';

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
  'security',
  'idp-backstage',
  'golden-paths',
  'dora-devex',
  'mlops',
  'service-mesh',
  'gitops',
  'sre',
];

export function isDevOpsTab(value: string): value is DevOpsTab {
  return (
    value === 'dashboard' ||
    value === 'exam' ||
    (STUDY_TABS as string[]).includes(value)
  );
}
