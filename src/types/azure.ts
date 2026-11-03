export const ALL_AZURE_TABS = [
  'dashboard',
  'concepts',
  'architecture',
  'management',
  'identity',
  'governance',
  'rbac',
  'storage',
  'compute',
  'containers',
  'vnet',
  'monitor',
  'design-infra',
  'design-data',
  'design-bcdr',
  'cicd',
  'source-control',
  'devsecops',
  'exam',
] as const;

export type AzureTab = (typeof ALL_AZURE_TABS)[number];

export const STUDY_TABS = [
  'concepts',
  'architecture',
  'management',
  'identity',
  'governance',
  'rbac',
  'storage',
  'compute',
  'containers',
  'vnet',
  'monitor',
  'design-infra',
  'design-data',
  'design-bcdr',
  'cicd',
  'source-control',
  'devsecops',
] as const;

export type StudyTab = (typeof STUDY_TABS)[number];

export function isAzureTab(value: string): value is AzureTab {
  return (ALL_AZURE_TABS as readonly string[]).includes(value);
}

export function isStudyTab(value: string): value is StudyTab {
  return (STUDY_TABS as readonly string[]).includes(value);
}