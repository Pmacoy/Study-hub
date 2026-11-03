export const CYBERSECURITY_STUDY_TABS = [
  'soc-triage',
  'devsecops',
  'threat-hunting',
] as const;

export type CybersecurityStudyTab = typeof CYBERSECURITY_STUDY_TABS[number];
export type CybersecurityTab = 'dashboard' | 'exam' | CybersecurityStudyTab;

export function isCybersecurityTab(tab: string): tab is CybersecurityTab {
  return ['dashboard', 'exam', ...CYBERSECURITY_STUDY_TABS].includes(tab as any);
}
