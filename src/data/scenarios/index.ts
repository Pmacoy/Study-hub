import type { Domain } from '../../types/platform';
import type { ChallengeScenario, Scenario } from '../../types/scenario';
import { k8sCrashloopScenario } from './k8sCrashloop';
import { k8sImagePullScenario } from './k8sImagePull';
import { k8sPvcPendingScenario } from './k8sPvcPending';
import { k8sIngress502Scenario } from './k8sIngress502';
import { k8sRbacForbiddenScenario } from './k8sRbacForbidden';
import { k8sLivenessProbeScenario } from './k8sLivenessProbe';
import { k8sNodeDiskPressureScenario } from './k8sNodeDiskPressure';
import { azureVpnBgpScenario } from './azureVpnBgp';
import { az305MigracaoMultiregiaoScenario } from './az305MigracaoMultiregiao';
import { az305DataStorageFocusScenario } from './az305DataStorageFocus';
import { az305IdentityMonitoringFocusScenario } from './az305IdentityMonitoringFocus';
import { az305BusinessContinuityFocusScenario } from './az305BusinessContinuityFocus';
import { networkingDnsScenario } from './networkingDns';
import { pythonSubprocessScenario } from './pythonSubprocess';
import { linuxOomKillScenario } from './linuxOomKill';
import { linuxDnsResolutionScenario } from './linuxDnsResolution';
import { s3BucketPublicScenario } from './s3BucketPublic';
import { iamCrossAccountScenario } from './iamCrossAccount';
import { rdsFailoverScenario } from './rdsFailover';
import { terraformStateLockScenario } from './terraformStateLock';
import { k8sNetworkPolicyBlocked, awsS3PublicBucket, linuxOomKill, terraformStateLock as tfStateLock, networkingDnsChallenge, pythonSubprocessChallenge } from './challenges';

export const ALL_SCENARIOS: Scenario[] = [
  // Kubernetes (do "100 K8s Errors" — treino directo para CKA)
  k8sCrashloopScenario,
  k8sImagePullScenario,
  k8sPvcPendingScenario,
  k8sIngress502Scenario,
  k8sRbacForbiddenScenario,
  k8sLivenessProbeScenario,
  k8sNodeDiskPressureScenario,
  // Outros domínios / AZ-305
  azureVpnBgpScenario,
  az305MigracaoMultiregiaoScenario,
  az305DataStorageFocusScenario,
  az305IdentityMonitoringFocusScenario,
  az305BusinessContinuityFocusScenario,
  networkingDnsScenario,
  pythonSubprocessScenario,
  // AWS
  s3BucketPublicScenario,
  iamCrossAccountScenario,
  rdsFailoverScenario,
  terraformStateLockScenario,
  // Linux troubleshooting
  linuxOomKillScenario,
  linuxDnsResolutionScenario,
];

export const ALL_CHALLENGES: ChallengeScenario[] = [
  k8sNetworkPolicyBlocked,
  awsS3PublicBucket,
  linuxOomKill,
  tfStateLock,
  networkingDnsChallenge,
  pythonSubprocessChallenge,
];

export function scenariosByDomain(domain: Domain): Scenario[] {
  return ALL_SCENARIOS.filter(s => s.domain === domain);
}

export function challengesByDomain(domain: Domain): ChallengeScenario[] {
  return ALL_CHALLENGES.filter(s => s.domain === domain);
}

export function findScenario(id: string): Scenario | undefined {
  return ALL_SCENARIOS.find(s => s.id === id);
}

export function findChallenge(id: string): ChallengeScenario | undefined {
  return ALL_CHALLENGES.find(s => s.id === id);
}