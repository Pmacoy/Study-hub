import type { Domain } from '../../types/platform';
import type { Scenario } from '../../types/scenario';
import { k8sCrashloopScenario } from './k8sCrashloop';
import { k8sImagePullScenario } from './k8sImagePull';
import { k8sPvcPendingScenario } from './k8sPvcPending';
import { k8sIngress502Scenario } from './k8sIngress502';
import { k8sRbacForbiddenScenario } from './k8sRbacForbidden';
import { k8sLivenessProbeScenario } from './k8sLivenessProbe';
import { k8sNodeDiskPressureScenario } from './k8sNodeDiskPressure';
import { k8sIncidentAuthDownScenario } from './k8sIncidentAuthDown';
import { azureVpnBgpScenario } from './azureVpnBgp';
import { networkingDnsScenario } from './networkingDns';
import { pythonSubprocessScenario } from './pythonSubprocess';

export const ALL_SCENARIOS: Scenario[] = [
  // Kubernetes (do "100 K8s Errors" — treino directo para CKA)
  k8sCrashloopScenario,
  k8sImagePullScenario,
  k8sPvcPendingScenario,
  k8sIngress502Scenario,
  k8sRbacForbiddenScenario,
  k8sLivenessProbeScenario,
  k8sNodeDiskPressureScenario,
  k8sIncidentAuthDownScenario,
  // Outros domínios
  azureVpnBgpScenario,
  networkingDnsScenario,
  pythonSubprocessScenario,
];

export function scenariosByDomain(domain: Domain): Scenario[] {
  return ALL_SCENARIOS.filter(s => s.domain === domain);
}

export function findScenario(id: string): Scenario | undefined {
  return ALL_SCENARIOS.find(s => s.id === id);
}
