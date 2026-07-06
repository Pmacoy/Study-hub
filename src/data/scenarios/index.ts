import type { Domain } from '../../types/platform';
import type { Scenario } from '../../types/scenario';
import { k8sCrashloopScenario } from './k8sCrashloop';
import { azureVpnBgpScenario } from './azureVpnBgp';
import { networkingDnsScenario } from './networkingDns';
import { pythonSubprocessScenario } from './pythonSubprocess';

export const ALL_SCENARIOS: Scenario[] = [
  k8sCrashloopScenario,
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
