import type { DataEngineeringStudyTab } from '../../types/dataEngineering';

export const DATA_ENGINEERING_TAB_META: Record<DataEngineeringStudyTab, { label: string; subtitle: string }> = {
  'data-lakes': { label: 'Data Lakes & Warehouses', subtitle: 'Hadoop, S3, Redshift, BigQuery, Snowflake' },
  'pipelines': { label: 'Big Data Pipelines', subtitle: 'Kafka, Spark, Flink, Event Streaming' },
  'etl': { label: 'ETL & ELT', subtitle: 'dbt, Airflow, Data Modeling' },
};
