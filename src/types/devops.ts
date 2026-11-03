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
  | 'gitops'
  | 'service-mesh'
  | 'monitoring'
  | 'security'
  | 'idp-backstage'
  | 'golden-paths'
  | 'dora-devex'
  | 'finops'
  | 'sre'
  | 'mlops';

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
  'gitops',
  'service-mesh',
  'monitoring',
  'security',
  'idp-backstage',
  'golden-paths',
  'dora-devex',
  'finops',
  'sre',
  'mlops',
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
