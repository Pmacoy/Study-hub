import { Database, Filter, GitMerge, LayoutDashboard, GraduationCap } from 'lucide-react';
import type { DataEngineeringTab } from '../../types/dataEngineering';
import type { SidebarMenuGroup } from '../../types/navigation';

export const dataEngineeringMenuGroups: SidebarMenuGroup[] = [
  {
    title: 'Visão Geral',
    items: [
      { id: 'dashboard' as DataEngineeringTab, label: 'Dashboard', sublabel: 'Progresso', icon: LayoutDashboard },
      { id: 'exam' as DataEngineeringTab, label: 'Simulado', sublabel: 'Teste de Data', icon: GraduationCap },
    ],
  },
  {
    title: 'Arquitetura de Dados',
    items: [
      { id: 'data-lakes' as DataEngineeringTab, label: 'Lakes & Warehouses', sublabel: 'S3 · BigQuery · Snowflake', icon: Database },
    ],
  },
  {
    title: 'Processamento',
    items: [
      { id: 'pipelines' as DataEngineeringTab, label: 'Pipelines & Streams', sublabel: 'Kafka · Spark', icon: GitMerge },
      { id: 'etl' as DataEngineeringTab, label: 'ETL & ELT', sublabel: 'dbt · Airflow', icon: Filter },
    ],
  },
];
