export type Domain = 'devops' | 'azure' | 'aws' | 'gcp' | 'networking' | 'python';

export interface DomainMeta {
  id: Domain;
  label: string;
  subtitle: string;
  color: string;          // tailwind accent
  icon: string;           // emoji
  moduleCount: number;
  status: 'active' | 'coming-soon';
}

export const DOMAINS: DomainMeta[] = [
  {
    id: 'devops',
    label: 'Platform & DevOps Engineering',
    subtitle: '12 módulos · IDP · Backstage · K8s · CI/CD · DORA',
    color: 'violet',
    icon: '⚙️',
    moduleCount: 12,
    status: 'active',
  },
  {
    id: 'azure',
    label: 'Microsoft Azure',
    subtitle: 'AZ-104 · AZ-305 · Identidade · Redes · Compute',
    color: 'sky',
    icon: '☁️',
    moduleCount: 8,
    status: 'active',
  },
  {
    id: 'aws',
    label: 'Amazon Web Services',
    subtitle: 'SAA-C03 · EC2 · VPC · S3 · IAM · Well-Architected',
    color: 'orange',
    icon: '🟧',
    moduleCount: 0,
    status: 'active',
  },
  {
    id: 'gcp',
    label: 'Google Cloud',
    subtitle: 'ACE · PCA · GCE · GKE · IAM · Cloud Storage',
    color: 'rose',
    icon: '🟥',
    moduleCount: 0,
    status: 'active',
  },
  {
    id: 'networking',
    label: 'Redes & Cloud Networking',
    subtitle: 'OSI · TCP/IP · DNS · VPN · BGP · SDN',
    color: 'emerald',
    icon: '🌐',
    moduleCount: 6,
    status: 'active',
  },
  {
    id: 'python',
    label: 'Python para DevOps',
    subtitle: 'Fundamentos · OOP · Generators · requests · pytest',
    color: 'amber',
    icon: '🐍',
    moduleCount: 6,
    status: 'active',
  },
];
