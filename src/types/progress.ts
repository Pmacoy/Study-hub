export type ActivityType = 'quiz' | 'flash';

export interface ActivityEntry {
  date: string;       // ISO date
  type: ActivityType;
  ratio: number;       // 0..1 — % correct / % "knew it"
}

export interface ProgressBreakdown {
  coverage: number;     // 0..100 — modules studied across all domains
  consistency: number;  // 0..100 — derived from current streak
  engagement: number;   // 0..100 — avg correctness of recent quiz/flash activity
  composite: number;    // 0..100 — weighted total
}

const WEIGHTS = { coverage: 0.4, consistency: 0.3, engagement: 0.3 };
const CONSISTENCY_CAP_DAYS = 14;
const MAX_LOGGED_ENTRIES = 30;
const ENGAGEMENT_WINDOW = 10; // consider only the most recent N entries

export function computeConsistency(streak: number): number {
  return Math.min(100, Math.round((streak / CONSISTENCY_CAP_DAYS) * 100));
}

export function computeEngagement(entries: ActivityEntry[]): number {
  if (entries.length === 0) return 0;
  const recent = entries.slice(-ENGAGEMENT_WINDOW);
  const avg = recent.reduce((sum, e) => sum + e.ratio, 0) / recent.length;
  return Math.round(avg * 100);
}

export function computeProgress(
  studiedCount: number,
  totalCount: number,
  streak: number,
  entries: ActivityEntry[]
): ProgressBreakdown {
  const coverage = totalCount > 0 ? Math.round((studiedCount / totalCount) * 100) : 0;
  const consistency = computeConsistency(streak);
  const engagement = computeEngagement(entries);
  const composite = Math.round(
    coverage * WEIGHTS.coverage +
    consistency * WEIGHTS.consistency +
    engagement * WEIGHTS.engagement
  );
  return { coverage, consistency, engagement, composite };
}

export function appendActivity(entries: ActivityEntry[], entry: ActivityEntry): ActivityEntry[] {
  const next = [...entries, entry];
  return next.length > MAX_LOGGED_ENTRIES ? next.slice(-MAX_LOGGED_ENTRIES) : next;
}
