import type { ReactNode } from 'react';
import type { AwsStudyTab } from '../../types/aws';
import { Shield, Globe, Cpu, Warehouse, Database, Building2 } from 'lucide-react';

export interface AwsTabMeta {
  label: string;
  subtitle: string;
  icon: ReactNode;
}

export const AWS_TAB_META: Record<AwsStudyTab, AwsTabMeta> = {
  iam:        { label: 'IAM & Segurança',          subtitle: 'Users · Roles · Policies · MFA · Organizations', icon: <Shield size={16} className="text-orange-400" /> },
  vpc:        { label: 'VPC & Networking',         subtitle: 'Subnets · IGW · NAT · SG · NACL · Route53',      icon: <Globe size={16} className="text-orange-400" /> },
  compute:    { label: 'Compute',                  subtitle: 'EC2 · EBS · Auto Scaling · ELB · Lambda',        icon: <Cpu size={16} className="text-orange-400" /> },
  storage:    { label: 'Storage',                  subtitle: 'S3 · Storage classes · EFS · Glacier',           icon: <Warehouse size={16} className="text-orange-400" /> },
  databases:  { label: 'Databases',                subtitle: 'RDS · DynamoDB · Aurora · ElastiCache',          icon: <Database size={16} className="text-orange-400" /> },
  wellarch:   { label: 'Well-Architected',         subtitle: '6 pilares · Resiliência · Cost optimization',    icon: <Building2 size={16} className="text-orange-400" /> },
};
