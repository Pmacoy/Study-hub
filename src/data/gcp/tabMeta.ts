import type { ReactNode } from 'react';
import type { GcpStudyTab } from '../../types/gcp';

export interface GcpTabMeta {
  label: string;
  subtitle: string;
  emoji: string;
  icon?: ReactNode;
}

export const GCP_TAB_META: Record<GcpStudyTab, GcpTabMeta> = {
  compute:    { label: 'Compute',                  subtitle: 'Compute Engine · GKE · Cloud Run · App Engine', emoji: '💻' },
  storage:    { label: 'Storage & Databases',      subtitle: 'Cloud Storage · Cloud SQL · Spanner · BigQuery', emoji: '📦' },
  networking: { label: 'VPC & Networking',         subtitle: 'VPC · Cloud DNS · Load Balancing · CDN',        emoji: '🌐' },
  iam:        { label: 'IAM & Security',           subtitle: 'Roles · Service Accounts · Resource Hierarchy', emoji: '🔐' },
  architecture: { label: 'Cloud Architecture',       subtitle: 'Design · Hybrid (Anthos) · Migração · DR/HA', emoji: '🏛️' },
  'adv-networking': { label: 'Advanced Networking',  subtitle: 'VPC Peering · Shared VPC · BGP · Interconnect', emoji: '🔌' },
  scaling:    { label: 'Scaling Infrastructure',   subtitle: 'MIGs · GKE Autoscaler · Cloud Run', emoji: '📈' },
};
