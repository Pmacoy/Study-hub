import { useCallback, useMemo } from 'react';
import { usePersistedState } from './usePersistedState';
import { PROJECT_PROGRESS_STORAGE_KEY } from '../data/storageKeys';
import type { ProjectStatus } from '../types/project';

export interface ProjectProgressEntry {
  status: ProjectStatus;
  repoUrl?: string;
  updatedAt: string;
}

type ProgressMap = Record<string, ProjectProgressEntry>;

function isProgressMap(v: unknown): v is ProgressMap {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  // Validar que é um objeto com valores ProjectProgressEntry
  const m = v as Record<string, unknown>;
  return Object.values(m).every((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const e = entry as Record<string, unknown>;
    return (
      (e.status === 'done' || e.status === 'in-progress' || e.status === 'not-started') &&
      (e.repoUrl === undefined || typeof e.repoUrl === 'string') &&
      typeof e.updatedAt === 'string'
    );
  });
}

export function useProjectProgress() {
  const [progress, setProgress] = usePersistedState(
    PROJECT_PROGRESS_STORAGE_KEY,
    {},
    isProgressMap
  );

  const setStatus = useCallback(
    (projectId: string, status: ProjectStatus) => {
      setProgress((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          status,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    [setProgress]
  );

  const setRepoUrl = useCallback(
    (projectId: string, repoUrl: string) => {
      setProgress((prev) => ({
        ...prev,
        [projectId]: {
          status: prev[projectId]?.status ?? 'in-progress',
          repoUrl,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    [setProgress]
  );

  const getEntry = useCallback(
    (projectId: string): ProjectProgressEntry | null => {
      return progress[projectId] ?? null;
    },
    [progress]
  );

  // ✨ BUG FIX #15: usar useMemo para stats, não useCallback
  const stats = useMemo(() => {
    const entries = Object.values(progress);
    const done = entries.filter((e) => e.status === 'done').length;
    const inProgress = entries.filter((e) => e.status === 'in-progress').length;
    return { done, inProgress };
  }, [progress]);

  return { progress, setStatus, setRepoUrl, getEntry, stats };
}
