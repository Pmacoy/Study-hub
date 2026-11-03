export const ALL_GCP_TABS = [
  'dashboard',
  'compute',
  'storage',
  'networking',
  'iam',
  'architecture',
  'adv-networking',
  'scaling',
  'exam',
] as const;

export type GcpTab = (typeof ALL_GCP_TABS)[number];

export const GCP_STUDY_TABS = [
  'compute',
  'storage',
  'networking',
  'iam',
  'architecture',
  'adv-networking',
  'scaling',
] as const;

export type GcpStudyTab = (typeof GCP_STUDY_TABS)[number];

export function isGcpTab(value: string): value is GcpTab {
  return (ALL_GCP_TABS as readonly string[]).includes(value);
}
