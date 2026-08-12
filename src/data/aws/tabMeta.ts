import type { AwsStudyTab } from '../../types/aws';

export interface AwsTabMeta {
  label: string;
  subtitle: string;
  emoji: string;
}

export const AWS_TAB_META: Record<AwsStudyTab, AwsTabMeta> = {
  iam:        { label: 'IAM & Segurança',          subtitle: 'Users · Roles · Policies · MFA · Organizations', emoji: '🔐' },
  vpc:        { label: 'VPC & Networking',         subtitle: 'Subnets · IGW · NAT · SG · NACL · Route53',      emoji: '🌐' },
  compute:    { label: 'Compute',                  subtitle: 'EC2 · EBS · Auto Scaling · ELB · Lambda',        emoji: '💻' },
  storage:    { label: 'Storage',                  subtitle: 'S3 · Storage classes · EFS · Glacier',           emoji: '📦' },
  databases:  { label: 'Databases',                subtitle: 'RDS · DynamoDB · Aurora · ElastiCache',          emoji: '🗄️' },
  wellarch:   { label: 'Well-Architected',         subtitle: '6 pilares · Resiliência · Cost optimization',    emoji: '🏛️' },
};
