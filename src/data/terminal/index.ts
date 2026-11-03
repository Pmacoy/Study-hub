import type { TerminalSession } from '../../types/terminal';
import { kubectlCrashloopSession } from './kubectlCrashloop';
import { bashDiskFullSession } from './bashDiskFull';
import { bashOomMemorySession } from './bashOomMemory';
import { bashDiskIoSession } from './bashDiskIo';
import { bashPortNotListeningSession } from './bashPortNotListening';
import { bashDnsFailSession } from './bashDnsFail';
import { bashHighCpuSession } from './bashHighCpu';
import { azCliRbacSession } from './azCliRbac';
import { dockerBuildFailSession } from './dockerBuildFail';
import { terraformStateLockSession } from './terraformStateLock';
import { socIamTriageSession } from './socIamTriage';

export const ALL_TERMINAL_SESSIONS: TerminalSession[] = [
  kubectlCrashloopSession,
  dockerBuildFailSession,
  terraformStateLockSession,
  socIamTriageSession,
  // Linux troubleshooting (do runbook DevOps.pdf — treino de incidentes reais)
  bashDiskFullSession,
  bashOomMemorySession,
  bashDiskIoSession,
  bashPortNotListeningSession,
  bashDnsFailSession,
  bashHighCpuSession,
  azCliRbacSession,
];

export function findTerminalSession(id: string): TerminalSession | undefined {
  return ALL_TERMINAL_SESSIONS.find(s => s.id === id);
}
