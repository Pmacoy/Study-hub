import type { CybersecurityStudyTab } from '../../types/cybersecurity';
import SocTriageSimulator from './SocTriageSimulator';
import ThreatHuntingSimulator from './ThreatHuntingSimulator';
import DevSecOpsSimulator from './DevSecOpsSimulator';

interface Props {
  tab: CybersecurityStudyTab;
}

export default function CybersecuritySimulator({ tab }: Props) {
  switch (tab) {
    case 'soc-triage':
      return <SocTriageSimulator />;
    case 'threat-hunting':
      return <ThreatHuntingSimulator />;
    case 'devsecops':
      return <DevSecOpsSimulator />;
    default:
      return <SocTriageSimulator />;
  }
}
