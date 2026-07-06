import type { StudyTab } from '../../types/azure';

export type TabMeta = {
  label: string;
  subtitle: string;
  group: string;
};

export const TAB_META: Record<StudyTab, TabMeta> = {
  identity: {
    label: 'Entra ID',
    subtitle: 'Utilizadores, grupos e SSPR',
    group: 'Identidade',
  },
  governance: {
    label: 'Policy & Locks',
    subtitle: 'Governança e proteção',
    group: 'Governança',
  },
  rbac: {
    label: 'RBAC',
    subtitle: 'Permissões e escopos',
    group: 'Governança',
  },
  storage: {
    label: 'Storage Accounts',
    subtitle: 'LRS, ZRS, GRS, GZRS',
    group: 'Armazenamento',
  },
  compute: {
    label: 'Máquinas Virtuais',
    subtitle: 'HA, VMSS e PaaS',
    group: 'Computação',
  },
  containers: {
    label: 'Containers & PaaS',
    subtitle: 'ACI, AKS, App Service',
    group: 'Computação',
  },
  vnet: {
    label: 'Redes & Segurança',
    subtitle: 'NSG, Bastion e conectividade',
    group: 'Networking',
  },
  monitor: {
    label: 'Monitor & Backup',
    subtitle: 'KQL, alerts, backup e ASR',
    group: 'Operações',
  },
};