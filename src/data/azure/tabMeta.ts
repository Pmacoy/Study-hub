import type { StudyTab } from '../../types/azure';

export type TabMeta = {
  label: string;
  subtitle: string;
  group: string;
};

export const TAB_META: Record<StudyTab, TabMeta> = {
  concepts: {
    label: 'Cloud Concepts',
    subtitle: 'IaaS, PaaS, SaaS e CapEx vs OpEx',
    group: 'Fundamentals (AZ-900)',
  },
  architecture: {
    label: 'Architecture & Services',
    subtitle: 'Regions, AZs e Azure Resource Manager',
    group: 'Fundamentals (AZ-900)',
  },
  management: {
    label: 'Management & Governance',
    subtitle: 'Azure Policy, Cost e Blueprints',
    group: 'Fundamentals (AZ-900)',
  },
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
  'design-infra': {
    label: 'Design de Infra',
    subtitle: 'Soluções de compute e redes.',
    group: 'AZ-305',
  },
  'design-data': {
    label: 'Data Storage',
    subtitle: 'Design de SQL, CosmosDB e Storage Accounts.',
    group: 'AZ-305',
  },
  'design-bcdr': {
    label: 'BCDR Design',
    subtitle: 'Continuidade de negócio e disaster recovery.',
    group: 'AZ-305',
  },
  cicd: {
    label: 'CI/CD Pipelines',
    subtitle: 'Pipelines no Azure DevOps e GitHub Actions.',
    group: 'AZ-400',
  },
  'source-control': {
    label: 'Source Control',
    subtitle: 'Repositórios e branching strategy.',
    group: 'AZ-400',
  },
  devsecops: {
    label: 'DevSecOps',
    subtitle: 'Segurança contínua e secret scanning.',
    group: 'AZ-400',
  },
};