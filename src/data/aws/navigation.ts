import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Box,
  Building2,
  Cpu,
  Database,
  GraduationCap,
  Network,
  ShieldCheck,
} from 'lucide-react';
import type { AwsTab } from '../../types/aws';

export interface MenuItem {
  id: AwsTab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const awsMenuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso SAA-C03', icon: BarChart3 },
      { id: 'exam', label: 'Simulado', sublabel: 'Teste SAA-C03', icon: GraduationCap },
    ],
  },
  {
    title: 'Segurança',
    items: [
      { id: 'iam', label: 'IAM & Segurança', sublabel: 'Users · Roles · Policies', icon: ShieldCheck },
    ],
  },
  {
    title: 'Infraestrutura',
    items: [
      { id: 'vpc',     label: 'VPC & Networking', sublabel: 'Subnets · NAT · SG', icon: Network },
      { id: 'compute', label: 'Compute',          sublabel: 'EC2 · ELB · Lambda', icon: Cpu },
      { id: 'storage', label: 'Storage',          sublabel: 'S3 · EFS · Glacier', icon: Box },
    ],
  },
  {
    title: 'Dados & Arquitectura',
    items: [
      { id: 'databases', label: 'Databases',       sublabel: 'RDS · DynamoDB · Aurora', icon: Database },
      { id: 'wellarch',  label: 'Well-Architected', sublabel: '6 pilares de arquitectura', icon: Building2 },
    ],
  },
];
