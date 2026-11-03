export const ALL_OCI_TABS = [
  'dashboard',
  'iam',
  'compute',
  'networking',
  'storage',
  'database',
  'architecture',
  'exam',
] as const;

export type OciTab = (typeof ALL_OCI_TABS)[number];

export const OCI_STUDY_TABS = [
  'iam',
  'compute',
  'networking',
  'storage',
  'database',
  'architecture',
] as const;

export type OciStudyTab = (typeof OCI_STUDY_TABS)[number];

export function isOciTab(value: string): value is OciTab {
  return (ALL_OCI_TABS as readonly string[]).includes(value);
}
