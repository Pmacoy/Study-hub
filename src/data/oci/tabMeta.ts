import type { OciTab } from '../../types/oci';

export const OCI_TAB_META: Record<OciTab, { title: string; subtitle: string; icon: string }> = {
  dashboard: {
    title: 'Visão Geral',
    subtitle: 'Progresso OCI Foundations & Architect Associate',
    icon: '📊',
  },
  compute: {
    title: 'Compute',
    subtitle: 'Bare Metal, VMs, Dedicated Hosts e OKE',
    icon: '🖥️',
  },
  storage: {
    title: 'Storage',
    subtitle: 'Block, Object, File e Archive Storage',
    icon: '💾',
  },
  networking: {
    title: 'Networking',
    subtitle: 'VCNs, Subnets, Gateways e Load Balancing',
    icon: '🌐',
  },
  iam: {
    title: 'IAM & Segurança',
    subtitle: 'Compartments, Policies, Users e Groups',
    icon: '🔐',
  },
  database: {
    title: 'Databases',
    subtitle: 'Autonomous Database, Exadata, Base DB',
    icon: '🗄️',
  },
  architecture: {
    title: 'High Availability',
    subtitle: 'Cross-Region, Fault Domains, DR',
    icon: '🏗️',
  },
  exam: {
    title: 'Simulador 1Z0-1085 / 1Z0-1072',
    subtitle: 'Testa os teus conhecimentos na OCI',
    icon: '🎓',
  },
};
