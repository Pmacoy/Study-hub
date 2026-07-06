import type { TerminalSession } from '../../types/terminal';
import { kubectlCrashloopSession } from './kubectlCrashloop';
import { bashDiskFullSession } from './bashDiskFull';
import { azCliRbacSession } from './azCliRbac';

export const ALL_TERMINAL_SESSIONS: TerminalSession[] = [
  kubectlCrashloopSession,
  bashDiskFullSession,
  azCliRbacSession,
];

export function findTerminalSession(id: string): TerminalSession | undefined {
  return ALL_TERMINAL_SESSIONS.find(s => s.id === id);
}
