import type { CybersecurityStudyTab } from '../../types/cybersecurity';

export const CYBERSECURITY_TAB_META: Record<CybersecurityStudyTab, { label: string; subtitle: string }> = {
  'soc-triage': { label: 'SOC Triage & Incident Response', subtitle: 'SIEM, Logs, Mitre ATT&CK' },
  'devsecops': { label: 'DevSecOps & Cloud Security', subtitle: 'SAST, DAST, IaC Security, Compliance' },
  'threat-hunting': { label: 'Threat Hunting & Blue Team', subtitle: 'Malware Analysis, EDR, Network Sec' },
};
