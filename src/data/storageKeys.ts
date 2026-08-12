export const STORAGE_KEYS = {
  activeTab: 'devops_hub_active_tab',
  visitedTabs: 'devops_hub_visited_tabs',
  lastStudyDate: 'devops_hub_last_study_date',
} as const;

export const AZURE_STORAGE_KEYS = {
  activeTab: 'az104_active_tab',
  visitedTabs: 'az104_visited_tabs',
  lastStudyDate: 'az104_last_study_date',
} as const;

export const PLATFORM_STORAGE_KEYS = {
  activeDomain: 'platform_active_domain',
} as const;

export const DAILY_STORAGE_KEY = 'platform_daily_state';

export const ACTIVITY_LOG_STORAGE_KEY = 'platform_activity_log';

export const PYTHON_STORAGE_KEYS = {
  activeTab: 'python_active_tab',
  visitedTabs: 'python_visited_tabs',
} as const;

export const AWS_STORAGE_KEYS = {
  activeTab: 'aws_saa_active_tab',
  visitedTabs: 'aws_saa_visited_tabs',
} as const;

export const PROJECT_PROGRESS_STORAGE_KEY = 'project_progress_v1';

export const DIAGNOSTIC_STORAGE_KEY = 'diagnostic_results_v1';

export const SCENARIO_ATTEMPTS_STORAGE_KEY = 'platform_scenario_attempts';

export const TERMINAL_ATTEMPTS_STORAGE_KEY = 'platform_terminal_attempts';
