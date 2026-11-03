import type { DecisionTree } from './types';

export const systemDesignDbTree: DecisionTree = {
  id: 'system-design-db',
  title: 'Database Selection (System Design)',
  description: 'Descubra que tipo de base de dados usar para o seu microserviço respondendo a estas perguntas arquiteturais chave.',
  startNodeId: 'q-structure',
  nodes: {
    'q-structure': {
      type: 'question',
      id: 'q-structure',
      question: 'Os dados têm uma estrutura altamente relacional e necessitam de transações ACID fortes (ex: Financeiro, Encomendas)?',
      description: 'Precisas de usar JOINs complexos regularmente e não podes perder consistência num dado momento?',
      answers: [
        { label: 'Sim', nextId: 'res-rdbms' },
        { label: 'Não (Os dados são desnormalizáveis / esquema flexível)', nextId: 'q-data-type' }
      ]
    },
    'q-data-type': {
      type: 'question',
      id: 'q-data-type',
      question: 'Qual é o padrão principal de acesso/armazenamento?',
      answers: [
        { label: 'Documentos JSON semi-estruturados', nextId: 'res-document' },
        { label: 'Relações em forma de Rede/Grafo (ex: Redes Sociais)', nextId: 'res-graph' },
        { label: 'Séries Temporais (Métricas, Logs)', nextId: 'res-timeseries' },
        { label: 'Chave-Valor (Muito Rápido, Estrutura Simples)', nextId: 'q-kv-use' },
        { label: 'Análise de grandes volumes (OLAP / Data Warehouse)', nextId: 'res-columnar' }
      ]
    },
    'q-kv-use': {
      type: 'question',
      id: 'q-kv-use',
      question: 'Este repositório Chave-Valor é para persistência permanente ou apenas caching temporário de alta velocidade?',
      answers: [
        { label: 'Caching / Sessões (Em Memória)', nextId: 'res-redis' },
        { label: 'Persistência Massiva Permanente', nextId: 'res-widecolumn' }
      ]
    },
    'res-rdbms': {
      type: 'result',
      id: 'res-rdbms',
      title: 'Relational Database (RDBMS)',
      service: 'PostgreSQL, MySQL, SQL Server',
      description: 'O padrão de ouro para dados estruturados. Suporta transações ACID (Atomicidade, Consistência, Isolamento, Durabilidade). Ideal para ERPs, sistemas financeiros ou dados estritamente dependentes através de Foreign Keys.',
      icon: 'Database'
    },
    'res-document': {
      type: 'result',
      id: 'res-document',
      title: 'Document Store (NoSQL)',
      service: 'MongoDB, Couchbase, Firestore',
      description: 'Ideal para catálogos de produtos, perfis de utilizador, CMS e aplicações onde o schema muda frequentemente. Os dados são agrupados por documento (JSON/BSON) favorecendo a leitura.',
      icon: 'FileJson'
    },
    'res-graph': {
      type: 'result',
      id: 'res-graph',
      title: 'Graph Database',
      service: 'Neo4j, Amazon Neptune',
      description: 'Perfeito para quando a "relação" entre os dados é mais importante que os dados em si. Recomendação de amigos (Redes Sociais), deteção de fraudes, rotas logísticas.',
      icon: 'Network'
    },
    'res-timeseries': {
      type: 'result',
      id: 'res-timeseries',
      title: 'Time-Series Database',
      service: 'InfluxDB, Prometheus, TimescaleDB',
      description: 'Otimizada para dados indexados por tempo com writes incrivelmente rápidos. Ideal para métricas de IoT, monitorização de servidores ou dados do mercado de ações.',
      icon: 'LineChart'
    },
    'res-redis': {
      type: 'result',
      id: 'res-redis',
      title: 'In-Memory Cache (Key-Value)',
      service: 'Redis, Memcached',
      description: 'Usado primariamente em frente a outra base de dados para cache de leituras pesadas, rate limiting, leaderboards (Redis ZSets) e sessões HTTP.',
      icon: 'Zap'
    },
    'res-widecolumn': {
      type: 'result',
      id: 'res-widecolumn',
      title: 'Wide-Column Store (Key-Value Avançado)',
      service: 'Cassandra, DynamoDB, ScyllaDB',
      description: 'Altamente escalável para tráfego intenso de leituras/escritas (High throughput). Distribui-se maravilhosamente por vários servidores. Ideal para carrinhos de compras em grande escala, IoT tracking logs permanentes.',
      icon: 'Columns'
    },
    'res-columnar': {
      type: 'result',
      id: 'res-columnar',
      title: 'Columnar Data Warehouse',
      service: 'BigQuery, Snowflake, Redshift',
      description: 'Bases de dados OLAP otimizadas para processamento analítico (queries de agregação sobre biliões de linhas). Ao invés de gravar dados linha-a-linha, grava coluna-a-coluna.',
      icon: 'BarChart'
    }
  }
};
