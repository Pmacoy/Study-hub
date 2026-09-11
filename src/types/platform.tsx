import type { ReactNode } from 'react';
import { Terminal, Cloud, Cpu, Globe, Brain, LayoutGrid, Network, Binary } from 'lucide-react';
export type Domain = 'devops' | 'azure' | 'aws' | 'networking' | 'python' | 'system-design' | 'distributed-systems' | 'algorithms';

export interface DomainMeta {
  id: Domain;
  label: string;
  subtitle: string;
  color: string;          // tailwind accent
  icon: ReactNode;
  moduleCount: number;
  status: 'active' | 'coming-soon';
}

export const DOMAINS: DomainMeta[] = [
  {
    id: 'devops',
    label: 'Platform & DevOps Engineering',
    subtitle: '18 módulos · IDP · Service Mesh · GitOps · SRE · K8s · CI/CD',
    color: 'violet',
    icon: <Terminal size={32} className="text-violet-400" />,
    moduleCount: 18,
    status: 'active',
  },
  {
    id: 'azure',
    label: 'Microsoft Azure',
    subtitle: 'AZ-104 · AZ-305 · Identidade · Redes · Compute',
    color: 'sky',
    icon: <Cloud size={32} className="text-sky-400" />,
    moduleCount: 8,
    status: 'active',
  },
  {
    id: 'aws',
    label: 'Amazon Web Services',
    subtitle: 'SAA-C03 · EC2 · VPC · S3 · IAM · Well-Architected',
    color: 'orange',
    icon: <Cpu size={32} className="text-orange-400" />,
    moduleCount: 0,
    status: 'active',
  },
  {
    id: 'networking',
    label: 'Redes & Cloud Networking',
    subtitle: 'OSI · TCP/IP · DNS · VPN · BGP · SDN',
    color: 'emerald',
    icon: <Globe size={32} className="text-emerald-400" />,
    moduleCount: 6,
    status: 'active',
  },
  {
    id: 'python',
    label: 'Python para DevOps',
    subtitle: 'Fundamentos · OOP · Generators · requests · pytest',
    color: 'amber',
    icon: <Brain size={32} className="text-amber-400" />,
    moduleCount: 6,
    status: 'active',
  },
  {
    id: 'system-design',
    label: 'System Design',
    subtitle: 'CAP · Cache · Load Balancing · Sharding · Messaging · Back-of-Envelope',
    color: 'rose',
    icon: <LayoutGrid size={32} className="text-rose-400" />,
    moduleCount: 6,
    status: 'active',
  },
  {
    id: 'distributed-systems',
    label: 'Sistemas Distribuídos',
    subtitle: 'Consenso · Tolerância a Falhas · Consistência · Transações · Coordenação',
    color: 'teal',
    icon: <Network size={32} className="text-teal-400" />,
    moduleCount: 6,
    status: 'active',
  },
  {
    id: 'algorithms',
    label: 'Algoritmos & Paradigmas',
    subtitle: 'Ordenação · Pesquisa · Grafos · PD · Recursão · Complexidade',
    color: 'cyan',
    icon: <Binary size={32} className="text-cyan-400" />,
    moduleCount: 6,
    status: 'active',
  },
];
