import type { Domain } from './platform';

export type CertStatus = 'active' | 'coming-soon' | 'achieved';

export interface CertificationMeta {
  id: string;                   // e.g. "az-104", "az-305", "aws-saa-c03"
  domain: Domain;               // parent cloud domain
  code: string;                  // "AZ-104"
  label: string;                 // "Azure Administrator"
  subtitle: string;              // short pitch
  totalQuestions: number;        // total questions in the bank (0 if not yet built)
  moduleCount: number;           // number of study modules
  status: CertStatus;
  achievedDate?: string;         // e.g. "Jan 2026" — only for status 'achieved'
  validUntil?: string;           // e.g. "Jan 2029"
}

// ── OCI certifications ──────────────────────────────────────────────────
export const OCI_CERTS: CertificationMeta[] = [
  {
    id: '1z0-1085',
    domain: 'oci',
    code: '1Z0-1085',
    label: 'OCI Foundations Associate',
    subtitle: 'Conceitos básicos de Cloud, OCI Core Services e Pricing',
    totalQuestions: 20,
    moduleCount: 5,
    status: 'active',
  },
  {
    id: '1z0-1072',
    domain: 'oci',
    code: '1Z0-1072',
    label: 'OCI Architect Associate',
    subtitle: 'Compute, VCN, Object Storage, IAM e Load Balancers na Oracle Cloud',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
];

// ── GCP certifications ──────────────────────────────────────────────────
export const GCP_CERTS: CertificationMeta[] = [
  {
    id: 'gcp-ace',
    domain: 'gcp',
    code: 'ACE',
    label: 'Associate Cloud Engineer',
    subtitle: 'IAM, Compute, Storage e Redes básicas no Google Cloud',
    totalQuestions: 50,
    moduleCount: 4,
    status: 'active',
  },
  {
    id: 'gcp-pca',
    domain: 'gcp',
    code: 'PCA',
    label: 'Professional Cloud Architect',
    subtitle: 'Design de infraestrutura corporativa, segurança e scale no GCP',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
];

// ── AZURE certifications ────────────────────────────────────────────────
export const AZURE_CERTS: CertificationMeta[] = [
  {
    id: 'az-900',
    domain: 'azure',
    code: 'AZ-900',
    label: 'Azure Fundamentals',
    subtitle: 'Conceitos de cloud, arquitetura básica e governança no Azure',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
  {
    id: 'az-104',
    domain: 'azure',
    code: 'AZ-104',
    label: 'Azure Administrator',
    subtitle: 'Identity · Governance · Compute · Storage · Networking · Monitor',
    totalQuestions: 507,
    moduleCount: 8,
    status: 'active',
  },
  {
    id: 'az-305',
    domain: 'azure',
    code: 'AZ-305',
    label: 'Azure Solutions Architect Expert',
    subtitle: 'Design de soluções para infra, dados, apps e segurança em escala',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
  {
    id: 'az-400',
    domain: 'azure',
    code: 'AZ-400',
    label: 'Azure DevOps Engineer Expert',
    subtitle: 'Pipelines · Repositórios · Boards · Segurança · Artefatos · Ambientes',
    totalQuestions: 35,
    moduleCount: 6,
    status: 'active',
  },
];

// ── AWS certifications ──────────────────────────────────────────────────
export const AWS_CERTS: CertificationMeta[] = [
  {
    id: 'aws-clf-c02',
    domain: 'aws',
    code: 'CLF-C02',
    label: 'AWS Cloud Practitioner',
    subtitle: 'Fundamentos da AWS, faturação e serviços core',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
  {
    id: 'aws-saa-c03',
    domain: 'aws',
    code: 'SAA-C03',
    label: 'AWS Solutions Architect Associate',
    subtitle: 'EC2 · VPC · S3 · RDS · IAM · Well-Architected',
    totalQuestions: 98,
    moduleCount: 6,
    status: 'active',
  },
  {
    id: 'aws-dva-c02',
    domain: 'aws',
    code: 'DVA-C02',
    label: 'AWS Developer Associate',
    subtitle: 'Desenvolvimento, deployment e debugging na AWS',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
  {
    id: 'aws-sap-c02',
    domain: 'aws',
    code: 'SAP-C02',
    label: 'AWS Solutions Architect Professional',
    subtitle: 'Arquiteturas complexas, migrações e otimização à escala',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
  {
    id: 'aws-aif-c01',
    domain: 'aws',
    code: 'AIF-C01',
    label: 'AWS AI Practitioner',
    subtitle: 'Casos de uso de IA, Machine Learning e serviços cognitivos',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
];

export const CERTS_BY_DOMAIN: Partial<Record<Domain, CertificationMeta[]>> = {
  azure: AZURE_CERTS,
  aws: AWS_CERTS,
  gcp: GCP_CERTS,
  oci: OCI_CERTS,
};

export function getCertsFor(domain: Domain): CertificationMeta[] {
  return CERTS_BY_DOMAIN[domain] ?? [];
}

export function findCert(certId: string): CertificationMeta | undefined {
  return [...AZURE_CERTS, ...AWS_CERTS, ...GCP_CERTS, ...OCI_CERTS].find(c => c.id === certId);
}
