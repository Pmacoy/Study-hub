import type { CitrixStudyTab } from '../../types/citrix';

export const CITRIX_TAB_META: Record<CitrixStudyTab, { label: string; subtitle: string; icon: string }> = {
  'daas-mcs': {
    label: 'Citrix DaaS & MCS',
    subtitle: 'Arquitetura DaaS, machine catalogs, delivery groups e update de imagem',
    icon: '🖥️',
  },
  'wem': {
    label: 'Citrix WEM',
    subtitle: 'Workspace Environment Management, ações, otimização de sistema e cache',
    icon: '⚡',
  },
  'profile-management': {
    label: 'Profile Management (UPM)',
    subtitle: 'File-based vs container, sessões concorrentes e logs de diagnóstico',
    icon: '👤',
  },
  'fslogix': {
    label: 'FSLogix Container',
    subtitle: 'Profile vs ODFC container, bloqueios de VHDX e coexistência',
    icon: '📦',
  },
  'packer-gold-image': {
    label: 'Gold Image com Packer',
    subtitle: 'Imagens VDA reproduzíveis em AWS com automação e WinRM',
    icon: '🏗️',
  },
  'terraform-citrix': {
    label: 'Terraform Provider Citrix',
    subtitle: 'Zonas, hypervisor AWS, catálogos MCS e site gerido como código',
    icon: '📐',
  },
  'pipeline-gitlab': {
    label: 'Pipeline GitLab CI',
    subtitle: 'Validação, plan e apply automatizados para infraestrutura e imagem',
    icon: '🚀',
  },
};
