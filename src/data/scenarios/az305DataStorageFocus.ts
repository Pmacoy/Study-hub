import type { Scenario } from '../../types/scenario';

/**
 * AZ-305 — Data Storage Solutions
 * Case study focado em: SQL, Cosmos DB, Data Lake, Redis Cache
 * Domínios cobertos: storage redundancy, tiering, data platform patterns
 */
export const az305DataStorageFocusScenario: Scenario = {
  id: 'az305-data-storage-focus',
  domain: 'azure',
  format: 'guided',
  title: 'Plataforma de dados para a HealthLogix — analytics em tempo real e compliance healthcare',
  hook: 'A HealthLogix é uma rede de clínicas em Portugal com 120 pontos de venda. Está a construir uma plataforma de dados para dashboards de gestão (KPIs de facturação, stock de medicamentos, satisfação de pacientes). Os dados vêm de 3 fontes: SQL Server de cada clínica (OLTP), IoT dos equipamentos médicos (10k sensores), e CRM em Salesforce. A arquitecta anterior saiu e deixou 3 opções de arquitectura numa wiki. O CEO quer saber qual escolher na sexta-feira. A restrição mais dura: dados de saúde são SAS (Healthcare) e qualquer acesso a dados de pacientes requer log de auditoria imutável.',
  difficulty: 'senior',
  timeEstimateMin: 12,
  tags: ['azure', 'az-305', 'data-storage', 'sql', 'cosmos', 'datalake', 'healthcare'],

  contextArtifacts: [
    {
      id: 'requisitos-plataforma',
      label: 'Requisitos da plataforma de dados',
      language: 'text',
      content: `REQUISITOS — Projecto "DataPulse"
────────────────────────────────────
Fontes de dados:
  1. SQL Server 2019 (120 clínicas) — OLTP, 2-5 GB/clinica, ~400 GB total
  2. IoT sensores (10.000 dispositivos) — 1 mensagem/5s = 2k msg/s = 172M msg/dia
  3. Salesforce CRM — API, ~500k registos, sync diário

Consumidores:
  • Dashboard web (React) — leitura, latência < 500ms p99
  • Relatórios mensais (Power BI) — batch, processamento em < 30min
  • Alertas em tempo real ( equipa médica ) — latência < 2s

Compliance:
  • SAS (Servicios de Saúde): dados de pacientes com PII
  • Log de auditoria imutável obrigatório para acessos a dados de pacientes
  • Retenção: 10 anos para registos clínicos, 2 anos para telemetria IoT
  • Cross-region replication: permitido dentro da UE, proibido fora
`,
    },
    {
      id: 'opcoes-arquitectura',
      label: 'As 3 opções da wiki (arquitecta anterior)',
      language: 'text',
      content: `OPÇÃO A — "Modern Data Warehouse" (Microsoft recommended)
  SQL DB (DTU) como OLTP + Data Lake Gen2 como staging + Synapse Serverless como query layer
  Cosmos DB para IoT (time-series pattern)
  Azure Cache for Redis para dashboards

OPÇÃO B — "Kappa Architecture" (simplificada)
  Event Hubs (ingest) → Stream Analytics (process) → Cosmos DB (store)
  Tudo stream, sem batch separado. Power BI lê directo do Cosmos DB.

OPÇÃO C — "Lambda Architecture" (dual-path)
  Event Hubs → Batch (Spark em Databricks) → Delta Lake no ADLS
  Event Hubs → Stream (Stream Analytics) → Cosmos DB
  Power BI lê do Delta Lake via Synapse`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'custo-comparativo',
      label: 'Estimativa de custo mensal por opção',
      language: 'text',
      content: `Componente                    Opção A     Opção B     Opção C
───────────────────────────  ──────────  ──────────  ──────────
Ingestão (Event Hubs/streams)    €180        €180        €180
Armazenamento OLTP              €320          —         €320
Armazenamento IoT              €850        €850        €850
  Cosmos DB (RU/segundo)
Data Lake Gen2 / ADLS           €90           —        €200
Synapse / Databricks            €400          —        €1 800
Redis Cache                     €120          —          —
Stream Analytics                €200        €200        €200
Log Analytics (auditoria)       €100        €100        €100
───────────────────────────  ──────────  ──────────  ──────────
TOTAL                         ≈ €2 260    ≈ €1 330    ≈ €3 650
`,
    },
    {
      id: 'cosmos-capacity',
      label: 'Capacidade estimada — Cosmos DB para 10k sensores',
      language: 'text',
      content: `10.000 sensores × 1 mensagem/5s = 2.000 mensagens/segundo
  · Leitura point: 1 RU
  · Escrita: 5-10 RU (depende do tamanho do documento)
  · Query agregada (dashboard): 50-200 RU

Opção B (Cosmos como store primário):
  • Escrita: 2.000 × 7 RU médio = 14.000 RU/s mínimo
  • Dashboard: 50 queries/s × 100 RU = 5.000 RU/s
  • Total: ~19.000 RU/s → ≈ €850/mês (autoscale)

Limitação: Cosmos DB não faz joins nativos entre coleções.
Relatórios Power BI precisam de extração para Data Lake.
  → Opção B não funciona para o batch, sem sinistro.`,
    },
    {
      id: 'immutavel-audit',
      label: 'Opções de imutabilidade — log de auditoria SAS',
      language: 'text',
      content: `REQUISITO: "Log de auditoria imutável obrigatório para acessos a dados de pacientes"

Azure Opções:
┌─────────────────────────┬──────────────┬──────────────────────────────────┐
│ Opção                   │ Custo extra  │ Notas                            │
├─────────────────────────┼──────────────┼──────────────────────────────────┤
│ Blob immutability policy│ ≈€0          │ Hard delete bloqueado, WORM     │
│ (time-based retention)  │              │ retention policy, muito usado    │
│                         │              │ em healthcare (HIPAA/SAS)        │
├─────────────────────────┼──────────────┼──────────────────────────────────┤
│ Azure Immutable Ledger  │ ~€0.25/1k    │ Append-only, hash chain para     │
│ (Cosmos DB)             │ writes       │ verificação de integridade       │
├─────────────────────────┼──────────────┼──────────────────────────────────┤
│ Storage Firewall +      │ €0           │ Controlo de acesso, mas NÃO      │
│ Private Endpoints       │              │ imutabilidade                     │
├─────────────────────────┼──────────────┼──────────────────────────────────┤
│ Azure Purview (now      │ ~€0.12/1k    │ Classificação de dados, lineage, │
│ Microsoft Purview)      │ assets       │ não é imutabilidade              │
└─────────────────────────┴──────────────┴──────────────────────────────────┘

A melhor combinação: Blob immutability (logs) + Cosmos Immutable Ledger
(dados clínicos) + Private Endpoints (acesso restrito).`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Tens 3 opções de arquitectura. Qual escolhes como base, e porquê?',
      options: [
        {
          id: 'a',
          label: 'Opção A — Modern Data Warehouse (SQL DB + Data Lake + Synapse + Cosmos)',
          correct: true,
          feedback: 'Exacto. É a única que cobre ambos os padrões (OLTP e analytics) sem compromissos. SQL DB para o OLTP existente (compatibilidade), Data Lake como staging para dados brutos (retenção 10 anos, formato aberto), Synapse para queries analíticas (Power BI), e Cosmos para IoT (time-series pattern). O preço é razoável e alinha com o repositório oficial da Microsoft para este tipo de workload.',
          revealArtifacts: ['custo-comparativo', 'cosmos-capacity'],
        },
        {
          id: 'b',
          label: 'Opção B — Kappa (simplificada, tudo streaming)',
          correct: false,
          feedback: 'Mas a Opção B apela à simplicidade. Mas Cosmos DB não suporta joins nativos entre coleções e não optimiza para queries analíticas (Power BI). Precisarias de exportar dados para Data Lake para os relatórios — e aí já estás a construir uma Opção A escondida, só mais cara e sem a optimização de Synapse.',
          revealArtifacts: ['cosmos-capacity'],
        },
        {
          id: 'c',
          label: 'Opção C — Lambda (batch + stream em paralelo)',
          correct: false,
          feedback: 'Lambda dá-te o melhor dos dois mundos... e o dobro da complexidade. Com 4 engenheiros, manter dois caminhos de processamento é arriscado. Databricks + Delta Lake é overkill para 400 GB de SQL e 172M msgs/dia — Synapse serverless resolve por uma fração do custo e complexidade.',
          revealArtifacts: ['custo-comparativo'],
        },
      ],
      teachingNote: 'A heurística para escolher entre Lambda/Kappa/Modern DW: se não precisas de dual-path (batch + stream redundantes), não construas dois. Modern DW é o padrão canónico da Microsoft para analytics + OLTP.',
    },
    {
      id: 'step-2',
      prompt: 'A HealthLogix precisa de log de auditoria imutável para dados de pacientes. Que combinação de serviços usas?',
      options: [
        {
          id: 'a',
          label: 'Blob immutability policy nos logs + Cosmos Immutable Ledger para dados clínicos',
          correct: true,
          feedback: 'A combinação certa. Blob immutability (WORM) para logs de auditoria — barato, sem overhead, cumprimento directo de SAS/HIPAA. Cosmos Immutable Ledger para dados clínicos — append-only com hash chain para verificação de integridade. Ambos são nativos Azure, sem custos escondidos.',
          revealArtifacts: ['immutavel-audit'],
        },
        {
          id: 'b',
          label: 'Azure Purview para classificar e auditar os dados',
          correct: false,
          feedback: 'Purview (agora Microsoft Purview) faz classificação de dados e governance, mas não garante imutabilidade. É uma camada de observabilidade, não de protecção. Podes ter auditoria SEM imutabilidade — e para SAS/healthcare isso não chega.',
        },
        {
          id: 'c',
          label: 'Storage Firewall + Private Endpoints — restringir quem acessa',
          correct: false,
          feedback: 'Firewall e Private Endpoints protegem o acesso (quem entra), mas não protegem contra alterações pelos utilizadores autorizados. Se um admin corromper logs, não há evidência. Imutabilidade é uma propriedade dos dados, não da rede.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'O CEO quer o dashboard web (React) com latência < 500ms p99. Os dados vêm do Cosmos DB (IoT) e do SQL DB (OLTP). Como optimizas?',
      options: [
        {
          id: 'a',
          label: 'Azure Cache for Redis como camada de leitura para o dashboard',
          correct: true,
          feedback: 'Redis cache dá latência sub-5ms para queries pré-computadas. O dashboard não precisa de ir ao Cosmos ou SQL em cada request — cacheia os KPIs agregados com TTL curto (30-60s). Para dashboards de gestão que leem os mesmos dados dezenas de vezes por minuto, é a optimização de custo vs performance mais efectiva.',
          revealArtifacts: ['custo-comparativo'],
        },
        {
          id: 'b',
          label: 'Subir os RU do Cosmos DB para 50.000',
          correct: false,
          feedback: 'Mesmo com 50k RU, o Cosmos DB dá ~10ms por query point, mas o dashboard faz queries agregadas (50-200 RU cada). Mais RU melhora throughput, não latência de rede nem round-trips. O bottleneck não é o Cosmos — é o caminho da rede e processamento no frontend.',
        },
        {
          id: 'c',
          label: 'CDN no frontend — servir o React estático de edge locations',
          correct: false,
          feedback: 'CDN optimiza o carregamento do JavaScript do React, não a latência dos dados da API. A pergunta é sobre latência dos dados (500ms p99), não do bundle da app.',
        },
      ],
    },
    {
      id: 'step-4',
      prompt: 'Relatórios Power BI precisam de processar 400 GB de dados em < 30 minutos. Como dimensionas o Synapse?',
      options: [
        {
          id: 'a',
          label: 'Synapse Serverless com Data Lake Gen2 — carregar parquet + query on-demand',
          correct: true,
          feedback: 'Synapse Serverless lê directamente do Data Lake em formato Parquet — sem copiar dados. Para 400 GB de Parquet com coluna optimizada, queries típicas de Power BI demoram 2-5 minutos. Custo: ~€0.12/TB escaneado, portanto ~€0.05 por query de 400 GB. Serverless escala automaticamente sem dimensionar nada.',
        },
        {
          id: 'b',
          label: 'Synapse Dedicated Pool — sempre disponível e com cache',
          correct: false,
          feedback: 'Dedicated Pool dá performance constante mas custa ~€400/mês (DW200c) mesmo sem queries. Para relatórios que correm 1-2x/dia, Serverless é 10x mais barato. Dedicated só se justifica se o data warehouse fosse acessado continuamente por múltiplos consumidores.',
        },
        {
          id: 'c',
          label: 'Databricks com Delta Lake — mais flexível e moderno',
          correct: false,
          feedback: 'Databricks é excelente para ETL complexo, mas para este caso é overkill. Tens dados já em Parquet no Data Lake, Power BI lê via Synapse sem transformação. Databricks adiciona um cluster Spark a gerir, clusters a arrancar/desligar, e complexidade de notebooks — tudo para um problema que Synapse Serverless resolve em 2 linhas de SQL.',
        },
      ],
      teachingNote: 'Synapse Serverless é o caso de uso mais under-used no Azure. Sempre que tens dados no Data Lake (Parquet, CSV, JSON) e precisas de query sem provisioning, é a resposta mais barata.',
    },
    {
      id: 'step-5',
      prompt: 'IoT dos sensores: 10.000 dispositivos, 1 mensagem/5s, dados de saúde com retenção 2 anos. Como dimensionas a retenção?',
      options: [
        {
          id: 'a',
          label: 'Lifecycle policy no Cosmos DB: 30 dias Hot → mover para Data Lake em Parquet (retention 2 anos)',
          correct: true,
          feedback: 'Cosmos DB como store de curto prazo (30 dias) para queries de dashboard em tempo real. Depois, exportar para Data Lake Gen2 em formato Parquet (10x mais barato por GB que Cosmos). Data Lake com lifecycle policy: Cool tier 2-5 anos, Archive tier 5-10 anos. Total: ~€850/mês em Cosmos + ~€20/mês em Data Lake.',
          revealArtifacts: ['custo-comparativo'],
        },
        {
          id: 'b',
          label: 'Cosmos DB com TTL de 2 anos — manter tudo no Cosmos',
          correct: false,
          feedback: '172M msgs/dia × 2 anos = ~125 bilhões de documentos. Mesmo com autoscale, o custo de Cosmos para retenção longa é proibitivo (~€15.000/mês). Cosmos é optimizado para acesso recente, não para arquivar.',
        },
        {
          id: 'c',
          label: 'Stream Analytics → Blob sem formato optimizado, indexar depois',
          correct: false,
          feedback: 'Blob sem formato optimizado (JSON line-per-message) torna as queries analíticas caras — cada query escaneia tudo. Parquet columnar é 100x mais eficiente para aggregation queries. Formats matter.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'O CEO não tem um problema a corriger — precisa de uma decisão fundamentada entre 3 opções de arquitectura. A opção correcta depende de balancear: (1) compatibilidade com o OLTP existente (SQL Server → SQL DB ou migração), (2) throughput de IoT (Cosmos DB como store de curto prazo), (3) analytic queries (Synapse Serverless no Data Lake), (4) compliance SAS (imutabilidade + retenção + auditoria).',
    fix: 'Arquitectura final: Modern Data Warehouse (Opção A). SQL Database como destino do OLTP das clínicas (compatibilidade com stored procedures existentes), Cosmos DB como store de curto prazo para IoT (30 dias, autoscale), Data Lake Gen2 como camada de retenção (Parquet, 10 anos), Synapse Serverless para queries analíticas e Power BI, Redis Cache para dashboards de gestão (< 500ms p99), Blob immutability + Cosmos Immutable Ledger para compliance SAS. Lifecycle policy: Cosmos Hot 30 dias → Data Lake Cool 2-5 anos → Archive 5-10 anos.',
    preventions: [
      'Validar a taxa de retenção com a DPO antes do go-live — 10 anos é o mínimo legal, pode ser mais consoante a especialidade médica',
      'Testar o restore de dados do Data Lake Archive tier — Archive tem latência de 15 horas para acesso, garantir que não é necessário para queries frequentes',
      'Monitorar RU consumption do Cosmos DB com autoscale — se a taxa de crescimento IoT superar 10% mês, dimensionar o partion key (device_id) antes de o custo escalar',
      'Configurar alertas no Azure Monitor para violation de imutabilidade — tentativas de delete em blob com retention policy activa devem gerar alerta imediato',
      'Documentar o fluxo de dados completo no Microsoft Purview (data lineage) para auditoria futura — onde está cada dado, quem acessou, quando, e porquê',
    ],
  },
};
