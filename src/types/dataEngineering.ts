export const DATA_ENGINEERING_STUDY_TABS = [
  'data-lakes',
  'pipelines',
  'etl',
] as const;

export type DataEngineeringStudyTab = typeof DATA_ENGINEERING_STUDY_TABS[number];
export type DataEngineeringTab = 'dashboard' | 'exam' | DataEngineeringStudyTab;

export function isDataEngineeringTab(tab: string): tab is DataEngineeringTab {
  return ['dashboard', 'exam', ...DATA_ENGINEERING_STUDY_TABS].includes(tab as any);
}
