export type PythonStudyTab =
  | 'basics'
  | 'control-flow'
  | 'data-structures'
  | 'oop'
  | 'advanced'
  | 'devops-py';

export type PythonTab = 'dashboard' | 'exam' | PythonStudyTab;

export const PYTHON_STUDY_TABS: PythonStudyTab[] = [
  'basics',
  'control-flow',
  'data-structures',
  'oop',
  'advanced',
  'devops-py',
];

export function isPythonTab(value: string): value is PythonTab {
  return (
    value === 'dashboard' ||
    value === 'exam' ||
    (PYTHON_STUDY_TABS as string[]).includes(value)
  );
}
