export const AIML_STUDY_TABS = [
  'ml-pipelines',
  'gen-ai',
  'prompt-engineering',
] as const;

export type AiMlStudyTab = typeof AIML_STUDY_TABS[number];
export type AiMlTab = 'dashboard' | 'exam' | AiMlStudyTab;

export function isAiMlTab(tab: string): tab is AiMlTab {
  return ['dashboard', 'exam', ...AIML_STUDY_TABS].includes(tab as any);
}
