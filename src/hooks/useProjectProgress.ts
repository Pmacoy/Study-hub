import { useCallback, useEffect, useState } from 'react';
import { PROJECT_PROGRESS_STORAGE_KEY } from '../data/storageKeys';
import type { ProjectStatus } from '../types/project';

export interface ProjectProgressEntry {
  status: ProjectStatus;
  repoUrl?: string;
  updatedAt: string;
}

type ProgressMap = Record<string, ProjectProgressEntry>;

export function useProjectProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROJECT_PROGRESS_STORAGE_KEY);
      setProgress(raw ? JSON.parse(raw) : {});
    } catch {
      setProgress({});
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(PROJECT_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch { /* ignore */ }
  }, [progress, loaded]);

  const setStatus = useCallback((projectId: string, status: ProjectStatus) => {
    setProgress(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        status,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const setRepoUrl = useCallback((projectId: string, repoUrl: string) => {
    setProgress(prev => ({
      ...prev,
      [projectId]: {
        status: prev[projectId]?.status ?? 'in-progress',
        repoUrl,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const getEntry = useCallback((projectId: string): ProjectProgressEntry | null => {
    return progress[projectId] ?? null;
  }, [progress]);

  const stats = useCallback(() => {
    const entries = Object.values(progress);
    const done = entries.filter(e => e.status === 'done').length;
    const inProgress = entries.filter(e => e.status === 'in-progress').length;
    return { done, inProgress };
  }, [progress]);

  return { progress, setStatus, setRepoUrl, getEntry, stats, loaded };
}
