import type { Domain } from './platform';

export type CertStatus = 'active' | 'coming-soon';

export interface CertificationMeta {
  id: string;                   // e.g. "az-104", "az-305", "aws-saa-c03", "gcp-ace"
  domain: Domain;               // parent cloud domain
  code: string;                  // "AZ-104"
  label: string;                 // "Azure Administrator"
  subtitle: string;              // short pitch
  totalQuestions: number;        // total questions in the bank (0 if not yet built)
  moduleCount: number;           // number of study modules
  status: CertStatus;
}

// ── AZURE certifications ────────────────────────────────────────────────
export const AZURE_CERTS: CertificationMeta[] = [
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
];

// ── AWS certifications ──────────────────────────────────────────────────
export const AWS_CERTS: CertificationMeta[] = [
  {
    id: 'aws-saa-c03',
    domain: 'aws',
    code: 'SAA-C03',
    label: 'AWS Solutions Architect Associate',
    subtitle: 'EC2 · VPC · S3 · RDS · IAM · Well-Architected',
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
    subtitle: 'GCE · GKE · IAM · Cloud Storage · gcloud CLI · Deployment Manager',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
  {
    id: 'gcp-pca',
    domain: 'gcp',
    code: 'PCA',
    label: 'Professional Cloud Architect',
    subtitle: 'Design de sistemas · Migração · Compliance · Operações',
    totalQuestions: 0,
    moduleCount: 0,
    status: 'coming-soon',
  },
];

export const CERTS_BY_DOMAIN: Partial<Record<Domain, CertificationMeta[]>> = {
  azure: AZURE_CERTS,
  aws: AWS_CERTS,
  gcp: GCP_CERTS,
};

export function getCertsFor(domain: Domain): CertificationMeta[] {
  return CERTS_BY_DOMAIN[domain] ?? [];
}

export function findCert(certId: string): CertificationMeta | undefined {
  return [...AZURE_CERTS, ...AWS_CERTS, ...GCP_CERTS].find(c => c.id === certId);
}
