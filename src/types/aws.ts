export const ALL_AWS_TABS = [
  'dashboard',
  'iam',
  'vpc',
  'compute',
  'storage',
  'databases',
  'wellarch',
  'exam',
] as const;

export type AwsTab = (typeof ALL_AWS_TABS)[number];

export const AWS_STUDY_TABS = [
  'iam',
  'vpc',
  'compute',
  'storage',
  'databases',
  'wellarch',
] as const;

export type AwsStudyTab = (typeof AWS_STUDY_TABS)[number];

export function isAwsTab(value: string): value is AwsTab {
  return (ALL_AWS_TABS as readonly string[]).includes(value);
}
