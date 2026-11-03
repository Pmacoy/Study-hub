export type CitrixStudyTab =
  | 'daas-mcs'
  | 'wem'
  | 'profile-management'
  | 'fslogix'
  | 'packer-gold-image'
  | 'terraform-citrix'
  | 'pipeline-gitlab';

export type CitrixTab = 'dashboard' | CitrixStudyTab | 'exam';

export const CITRIX_STUDY_TABS: CitrixStudyTab[] = [
  'daas-mcs',
  'wem',
  'profile-management',
  'fslogix',
  'packer-gold-image',
  'terraform-citrix',
  'pipeline-gitlab',
];

export function isCitrixTab(tab: string): tab is CitrixTab {
  return tab === 'dashboard' || tab === 'exam' || CITRIX_STUDY_TABS.includes(tab as CitrixStudyTab);
}
