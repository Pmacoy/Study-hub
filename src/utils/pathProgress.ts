import type { LearningPath, PathNode, PathNodeStatus, PathProgress } from '../types/learningPath';
import type { ScenarioAttempt } from '../types/scenario';
import type { TerminalAttempt } from '../types/terminal';

interface Ctx {
  visitedTabs: Set<string>;
  scenarioAttempts: ScenarioAttempt[];
  terminalAttempts: TerminalAttempt[];
}

/** Compute status of a single node based on tabs visited + scenarios/terminals attempted */
export function computeNodeStatus(node: PathNode, ctx: Ctx): PathNodeStatus {
  const tabVisited = ctx.visitedTabs.has(node.id);
  const scenariosDone = (node.scenarioIds ?? []).every(id =>
    ctx.scenarioAttempts.some(a => a.scenarioId === id && a.correctFirstTry / a.totalSteps >= 0.6)
  );
  const terminalsDone = (node.terminalSessionIds ?? []).every(id =>
    ctx.terminalAttempts.some(a => a.sessionId === id && a.objectivesHit / a.totalObjectives >= 0.75)
  );

  const hasScenariosOrTerminals =
    (node.scenarioIds && node.scenarioIds.length > 0) ||
    (node.terminalSessionIds && node.terminalSessionIds.length > 0);

  if (tabVisited && scenariosDone && terminalsDone) return 'done';
  if (tabVisited || (hasScenariosOrTerminals && (scenariosDone || terminalsDone))) return 'in-progress';
  return 'todo';
}

/** Compute total progress for a whole path */
export function computePathProgress(path: LearningPath, ctx: Ctx): PathProgress {
  let done = 0, inProgress = 0, todo = 0;
  let nextRecommended: PathNode | null = null;

  for (const node of path.nodes) {
    const status = computeNodeStatus(node, ctx);
    if (status === 'done') done++;
    else if (status === 'in-progress') {
      inProgress++;
      if (!nextRecommended) nextRecommended = node;
    } else {
      todo++;
      if (!nextRecommended) nextRecommended = node;
    }
  }

  const total = path.nodes.length;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    totalNodes: total,
    doneNodes: done,
    inProgressNodes: inProgress,
    todoNodes: todo,
    percentage,
    nextRecommendedNode: nextRecommended,
  };
}
