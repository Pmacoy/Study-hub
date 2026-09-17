export interface OfficialResource {
  id: string;
  provider: 'AWS' | 'Azure' | 'OCI' | 'GCP';
  title: string;
  url: string;
  level: 'Foundational' | 'Associate' | 'Professional';
  description: string;
}

export const OFFICIAL_CLOUD_RESOURCES: OfficialResource[] = [
  // AWS
  {
    id: 'aws-clf-c02',
    provider: 'AWS',
    title: 'AWS Cloud Practitioner (CLF-C02)',
    url: 'https://github.com/Thiago-code-lab/aws-certified-cloud-practitioner-brasil',
    level: 'Foundational',
    description: 'Guia completo e repositório de estudo em português para a certificação AWS Cloud Practitioner.'
  },
  {
    id: 'aws-saa-c03',
    provider: 'AWS',
    title: 'AWS Solutions Architect Associate (SAA-C03)',
    url: 'https://github.com/Thiago-code-lab/aws-certified-solutions-architect-associate-brasil',
    level: 'Associate',
    description: 'Repositório completo de estudos para Solutions Architect Associate em português.'
  },
  {
    id: 'aws-sap-c02',
    provider: 'AWS',
    title: 'AWS Solutions Architect Professional (SAP-C02)',
    url: 'https://github.com/Thiago-code-lab/aws-certified-solutions-architect-professional-brasil',
    level: 'Professional',
    description: 'Material aprofundado para o nível profissional de arquitetura na AWS.'
  },
  {
    id: 'aws-aif-c01',
    provider: 'AWS',
    title: 'AWS AI Practitioner (AIF-C01)',
    url: 'https://github.com/Thiago-code-lab/aws-certified-ai-practitioner-brasil',
    level: 'Foundational',
    description: 'Guia de estudo para a nova certificação da AWS em IA e Generative AI em PT-BR.'
  },
  {
    id: 'aws-dva-c02',
    provider: 'AWS',
    title: 'AWS Developer Associate (DVA-C02)',
    url: 'https://github.com/ACloudGuru-Resources/course-aws-certified-developer-associate',
    level: 'Associate',
    description: 'Repositório oficial de código e laboratórios do A Cloud Guru para Developer Associate.'
  },

  // Azure
  {
    id: 'azure-concepts',
    provider: 'Azure',
    title: 'Microsoft Azure: Describe Cloud Concepts',
    url: 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/?ns-enrollment-type=Collection&ns-enrollment-id=n6ga8m0jkgrwk',
    level: 'Foundational',
    description: 'Trilha oficial do Microsoft Learn cobrindo conceitos fundamentais de nuvem (AZ-900).'
  },
  {
    id: 'azure-architecture',
    provider: 'Azure',
    title: 'Azure Architecture & Services',
    url: 'https://learn.microsoft.com/pt-br/training/paths/azure-fundamentals-describe-azure-architecture-services/',
    level: 'Associate',
    description: 'Trilha oficial do Microsoft Learn sobre computação, rede e armazenamento no Azure em PT-BR.'
  },
  {
    id: 'azure-governance',
    provider: 'Azure',
    title: 'Azure Management & Governance',
    url: 'https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/?ns-enrollment-type=Collection&ns-enrollment-id=n6ga8m0jkgrwk',
    level: 'Associate',
    description: 'Trilha oficial do Microsoft Learn para gestão de custos, governança e conformidade no Azure.'
  },

  // OCI (Oracle)
  {
    id: 'oci-foundations-2026',
    provider: 'OCI',
    title: 'OCI Foundations Associate (2026)',
    url: 'https://mylearn.oracle.com/ou/learning-path/become-an-oci-foundations-associate-2026/163541',
    level: 'Foundational',
    description: 'Learning path oficial gratuito na Oracle MyLearn para a certificação OCI Foundations 2026.'
  },
  {
    id: 'oci-architect-2026',
    provider: 'OCI',
    title: 'OCI Architect Associate (2026)',
    url: 'https://mylearn.oracle.com/ou/learning-path/become-an-oci-architect-associate-2026/162234',
    level: 'Associate',
    description: 'Learning path oficial na Oracle MyLearn para se tornar OCI Architect Associate 2026.'
  },

  // GCP (Google Cloud)
  {
    id: 'gcp-architecture',
    provider: 'GCP',
    title: 'GCP Cloud Architecture: Design, Implement & Manage',
    url: 'https://www.skills.google/course_templates/640',
    level: 'Professional',
    description: 'Curso oficial no Google Cloud Skills Boost para design e gestão de arquitetura GCP.'
  },
  {
    id: 'gcp-networking',
    provider: 'GCP',
    title: 'Networking in Google Cloud: Network Architecture',
    url: 'https://www.skills.google/course_templates/1144',
    level: 'Associate',
    description: 'Curso oficial no Google Cloud Skills Boost focado na série de arquitetura de redes VPC.'
  },
  {
    id: 'gcp-scaling',
    provider: 'GCP',
    title: 'Scaling Your Infrastructure in Google Cloud',
    url: 'https://www.skills.google/course_templates/734',
    level: 'Professional',
    description: 'Curso oficial no Google Cloud Skills Boost para escalar infraestruturas de grande porte.'
  }
];
