export const ALL_AZURE_TABS = [
  'dashboard',
  'identity',
  'governance',
  'rbac',
  'storage',
  'compute',
  'containers',
  'vnet',
  'monitor',
  'exam',
] as const;

export type AzureTab = (typeof ALL_AZURE_TABS)[number];

export const STUDY_TABS = [
  'identity',
  'governance',
  'rbac',
  'storage',
  'compute',
  'containers',
  'vnet',
  'monitor',
] as const;

export type StudyTab = (typeof STUDY_TABS)[number];

export function isAzureTab(value: string): value is AzureTab {
  return (ALL_AZURE_TABS as readonly string[]).includes(value);
}

export function isStudyTab(value: string): value is StudyTab {
  return (STUDY_TABS as readonly string[]).includes(value);
}