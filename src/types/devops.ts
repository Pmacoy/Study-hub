export type StudyTab =
  | 'devops-intro'
  | 'linux'
  | 'shell-scripting'
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
  | 'finops'
  | 'sre';

export type CertExamTab = 'terraform-exam' | 'cka-exam';

export type DevOpsTab = 'dashboard' | 'exam' | CertExamTab | StudyTab;

export const STUDY_TABS: StudyTab[] = [
  'devops-intro',
  'linux',
  'shell-scripting',
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
  'finops',
  'sre',
];

export function isDevOpsTab(value: string): value is DevOpsTab {
  return (
    value === 'dashboard' ||
    value === 'exam' ||
    value === 'terraform-exam' ||
    value === 'cka-exam' ||
    (STUDY_TABS as string[]).includes(value)
  );
}
