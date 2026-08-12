import type { AwsQuestion } from '../../../types/awsExam';

// Questões em estilo de cenário — como aparecem no exame SAA-C03 real.
// Cada uma descreve uma situação de negócio e pede a solução arquitectural.
// Baseadas nos casos de uso do "Guia Completo de Serviços AWS SAA-C03".

export const scenarioQuestions: AwsQuestion[] = [
  // ── Desacoplamento e integração ─────────────────────────────────
  {
    id: 7001,
    topic: 'compute',
    topicLabel: 'Cenário · Integração',
    question: 'Um e-commerce recebe 10.000 pedidos por minuto durante a Black Friday, mas o sistema de processamento só suporta 1.000 por minuto. Durante o pico, pedidos estão a ser perdidos e o sistema fica indisponível. Qual solução garante que nenhum pedido se perde, com o menor overhead operacional?',
    options: [
      'Escalar o sistema de processamento para suportar 10.000/min com Auto Scaling agressivo',
      'Colocar uma fila SQS Standard entre a recepção e o processamento, com Dead Letter Queue para falhas',
      'Usar Kinesis Data Streams com 10 shards e replay de dados',
      'Aumentar o timeout do Application Load Balancer para 5 minutos',
    ],
    correctIndex: 1,
    explanation: 'SQS funciona como buffer: os pedidos entram na fila e o processador consome ao seu ritmo. Nada se perde porque as mensagens ficam na fila até 14 dias. A DLQ captura pedidos que falharam N vezes (maxReceiveCount) para análise manual. Escalar o processamento é mais caro e não protege contra picos súbitos. Kinesis serve para múltiplos consumidores com replay — aqui só há um consumidor.',
    difficulty: 'medium',
  },
  {
    id: 7002,
    topic: 'compute',
    topicLabel: 'Cenário · Integração',
    question: 'Uma plataforma captura clickstream de 1 milhão de utilizadores em simultâneo. Três equipas diferentes precisam de processar os MESMOS eventos: detecção de fraude em tempo real, cálculo de métricas de conversão, e entrega para o data lake em S3. Qual serviço escolher?',
    options: [
      'SQS Standard com três filas separadas',
      'Kinesis Data Streams — múltiplos consumidores lêem o mesmo stream independentemente',
      'SNS com três subscrições HTTP',
      'EventBridge com três regras',
    ],
    correctIndex: 1,
    explanation: 'A diferença crítica SQS vs Kinesis: em SQS, uma mensagem é consumida por UM consumidor e apagada. Em Kinesis, o stream é lido por múltiplos consumidores independentes, cada um com o seu checkpoint, e permite replay. Aqui as três equipas precisam dos mesmos eventos — é o caso de uso canónico do Kinesis Data Streams.',
    difficulty: 'hard',
  },
  {
    id: 7003,
    topic: 'compute',
    topicLabel: 'Cenário · Integração',
    question: 'Um workflow de processamento de pedidos tem 6 passos com lógica condicional, execução paralela e tratamento de erros. Actualmente está implementado como uma cadeia de Lambdas que se invocam mutuamente, e é impossível saber onde falhou. Qual é a melhoria arquitectural?',
    options: [
      'Adicionar CloudWatch Logs Insights para correlacionar os logs',
      'AWS Step Functions — state machine visual com retry, catch e paralelismo nativos',
      'Migrar tudo para uma única Lambda com 15 minutos de timeout',
      'Usar SQS entre cada Lambda',
    ],
    correctIndex: 1,
    explanation: 'Step Functions foi desenhado exactamente para isto: orquestração visual de workflows com states (Task, Choice, Parallel, Map, Wait), retry com backoff e catch para fallback. Vês graficamente onde falhou. Lambdas que se invocam em cadeia são um anti-padrão — sem visibilidade e sem tratamento de erro centralizado.',
    difficulty: 'medium',
  },

  // ── Migração ────────────────────────────────────────────────────
  {
    id: 7004,
    topic: 'storage',
    topicLabel: 'Cenário · Migração',
    question: 'Uma empresa de petróleo precisa de migrar 500 TB de dados sísmicos do datacenter para S3. A ligação à internet é de 1 Gbps e é partilhada com operações críticas. Qual é a abordagem mais rápida?',
    options: [
      'Transferir via internet com S3 Transfer Acceleration',
      'Usar AWS DataSync com throttling durante a noite',
      'Encomendar 5 dispositivos Snowball Edge (80 TB cada) e carregar em paralelo',
      'Estabelecer Direct Connect de 10 Gbps',
    ],
    correctIndex: 2,
    explanation: 'Regra prática: se a migração via rede demora mais de uma semana, considera Snow Family. A 1 Gbps (partilhado), 500 TB levariam ~60 dias. Com 5 Snowball Edge em paralelo: 5 dias a carregar, envio, e 2 dias para a AWS importar — cerca de 1 semana no total. Direct Connect demora semanas a provisionar e é caro para uma migração pontual.',
    difficulty: 'medium',
  },
  {
    id: 7005,
    topic: 'databases',
    topicLabel: 'Cenário · Migração',
    question: 'Uma empresa quer migrar de Oracle on-premises para Aurora PostgreSQL, com o mínimo de downtime possível. A base de dados tem stored procedures PL/SQL complexas. Que combinação de ferramentas usar?',
    options: [
      'Apenas DMS com replicação contínua',
      'SCT para converter o schema e as stored procedures, depois DMS com CDC para os dados',
      'Export/import manual durante uma janela de manutenção',
      'Apenas SCT — converte schema e dados',
    ],
    correctIndex: 1,
    explanation: 'Migração heterogénea (engines diferentes) exige SCT + DMS. O SCT converte schema, stored procedures, functions e triggers, e gera um relatório do que precisa de ajuste manual. O DMS migra os dados com CDC (Change Data Capture), mantendo a origem sincronizada até ao cutover — daí o downtime mínimo. DMS sozinho não converte objectos de código.',
    difficulty: 'hard',
  },
  {
    id: 7006,
    topic: 'compute',
    topicLabel: 'Cenário · Migração',
    question: 'Uma empresa vai migrar 50 servidores VMware on-premises para EC2, em lift-and-shift. O requisito é downtime inferior a 15 minutos por servidor e possibilidade de testar antes do cutover real. Qual serviço?',
    options: [
      'AWS DataSync para copiar os discos',
      'AWS Application Migration Service (MGN) com replicação contínua e test cutover',
      'Criar AMIs manualmente a partir de snapshots',
      'AWS Migration Hub',
    ],
    correctIndex: 1,
    explanation: 'O MGN instala um agente que replica ao nível de bloco continuamente. Permite fazer test cutover (lança instâncias de teste sem afectar a origem) e, no cutover real, lança as EC2 com os dados já sincronizados — downtime de minutos. O Migration Hub é apenas o dashboard que agrega o progresso; não faz a migração.',
    difficulty: 'medium',
  },

  // ── Storage híbrido ─────────────────────────────────────────────
  {
    id: 7007,
    topic: 'storage',
    topicLabel: 'Cenário · Storage',
    question: 'Uma empresa quer fazer backup de 50 TB de file shares on-premises para S3, sem alterar o workflow dos utilizadores (que acedem via SMB) e mantendo acesso rápido aos ficheiros recentes. Qual solução?',
    options: [
      'Migrar todos os utilizadores para trabalhar directamente no S3 via console',
      'AWS Storage Gateway em modo File Gateway, com cache local',
      'AWS DataSync com sincronização diária',
      'FSx for Windows File Server',
    ],
    correctIndex: 1,
    explanation: 'File Gateway expõe NFS/SMB no datacenter com backend em S3. Os utilizadores continuam a aceder normalmente, e os dados sincronizam para S3 automaticamente. O cache local mantém os ficheiros recentes com baixa latência. DataSync é para transferência pontual ou agendada, não para acesso contínuo transparente.',
    difficulty: 'medium',
  },
  {
    id: 7008,
    topic: 'storage',
    topicLabel: 'Cenário · Storage',
    question: 'Uma empresa migra de NetApp on-premises e precisa que servidores Linux (NFS), Windows (SMB) e VMware (iSCSI) acedam ao MESMO file system em simultâneo, com deduplicação. Qual serviço?',
    options: [
      'Amazon EFS',
      'FSx for Windows File Server',
      'FSx for NetApp ONTAP',
      'FSx for Lustre',
    ],
    correctIndex: 2,
    explanation: 'FSx for NetApp ONTAP é o único que suporta multi-protocolo (NFS + SMB + iSCSI) no mesmo file system, além de deduplicação e compressão. EFS é só NFS (Linux). FSx for Windows é só SMB. FSx for Lustre é para HPC.',
    difficulty: 'hard',
  },

  // ── Governança e multi-conta ────────────────────────────────────
  {
    id: 7009,
    topic: 'iam',
    topicLabel: 'Cenário · Governança',
    question: 'Uma empresa tem 18 contas AWS organizadas em OUs (Produção, Desenvolvimento, Sandbox). Precisa de garantir que ninguém — nem os administradores — consegue lançar instâncias maiores que t3.micro nas contas de Sandbox. Qual mecanismo?',
    options: [
      'IAM policy anexada a todos os utilizadores das contas Sandbox',
      'Service Control Policy (SCP) na OU Sandbox restringindo ec2:InstanceType',
      'AWS Config rule que termina instâncias grandes',
      'Budget alert que notifica quando o custo sobe',
    ],
    correctIndex: 1,
    explanation: 'SCPs aplicam-se a TODAS as identidades da conta, incluindo o root — funcionam como um tecto que nem um administrador ultrapassa. IAM policies podem ser alteradas por quem tem permissões de IAM. Config rules são detectivas (agem depois do facto); a SCP é preventiva.',
    difficulty: 'medium',
  },
  {
    id: 7010,
    topic: 'iam',
    topicLabel: 'Cenário · Governança',
    question: 'Uma equipa de CI/CD numa conta de desenvolvimento precisa de fazer deploy na conta de produção. Qual é a arquitectura mais segura?',
    options: [
      'Criar um IAM User na conta de produção e guardar as access keys no sistema de CI',
      'Uma IAM Role na conta de produção com trust policy que permite à role de CI da conta dev assumi-la via STS',
      'Partilhar as credenciais do root da conta de produção',
      'Tornar as duas contas numa só',
    ],
    correctIndex: 1,
    explanation: 'Cross-account role assumption é o padrão. A role em produção tem uma trust policy que nomeia o principal da conta dev; a role de CI tem permissão sts:AssumeRole. As credenciais são temporárias (1-12h), não há access keys permanentes, e cada assunção fica registada em CloudTrail.',
    difficulty: 'hard',
  },

  // ── Observabilidade e troubleshooting ───────────────────────────
  {
    id: 7011,
    topic: 'wellarch',
    topicLabel: 'Cenário · Observabilidade',
    question: 'Uma API serverless (API Gateway → Lambda → DynamoDB) tem p99 de 2 segundos e a equipa não sabe onde está o gargalo. Que serviço identifica em que hop se perde o tempo?',
    options: [
      'CloudWatch Logs Insights',
      'AWS X-Ray — distributed tracing com service map e segments por serviço',
      'CloudWatch Metrics com dashboards',
      'AWS Config',
    ],
    correctIndex: 1,
    explanation: 'X-Ray traça o request através de todos os serviços e mostra a latência de cada hop. Num caso real: API Gateway 5ms, Lambda 50ms, DynamoDB 1800ms — o gargalo fica óbvio. A análise do segment revela a causa (ex: scan em tabela sem index). CloudWatch dá métricas agregadas por serviço, mas não correlaciona um request individual entre serviços.',
    difficulty: 'medium',
  },
  {
    id: 7012,
    topic: 'databases',
    topicLabel: 'Cenário · Performance',
    question: 'O X-Ray revelou que uma query DynamoDB demora 1800 ms. A tabela tem 50 milhões de itens e a aplicação filtra por um atributo que não é a partition key. Qual é a correcção?',
    options: [
      'Aumentar a capacidade provisionada (RCU) da tabela',
      'Criar um Global Secondary Index (GSI) com esse atributo como partition key',
      'Migrar para RDS PostgreSQL',
      'Adicionar DAX como cache',
    ],
    correctIndex: 1,
    explanation: 'Filtrar por um atributo que não é chave obriga a um Scan — percorre a tabela inteira, O(N). Um GSI com esse atributo como partition key transforma o Scan numa Query, O(1) para a partição. Aumentar RCU torna o Scan mais rápido mas continua a ser caro e não escala. DAX cacharia o resultado mas não resolve a query ineficiente.',
    difficulty: 'hard',
  },

  // ── Custos ──────────────────────────────────────────────────────
  {
    id: 7013,
    topic: 'wellarch',
    topicLabel: 'Cenário · Custos',
    question: 'Uma empresa tem 100 instâncias EC2. A análise mostra que 30 instâncias m5.xlarge correm com CPU média de 5%. Qual é a primeira acção, e que serviço a suporta?',
    options: [
      'Comprar Reserved Instances para as 100 instâncias',
      'Right-sizing com base nas recomendações do AWS Compute Optimizer',
      'Migrar tudo para Spot',
      'Mudar para uma região mais barata',
    ],
    correctIndex: 1,
    explanation: 'Right-sizing primeiro, compromisso depois. O Compute Optimizer usa ML sobre métricas do CloudWatch (mínimo 30h de dados) para recomendar o tipo certo — neste caso, m5.xlarge a 5% de CPU sugere t3.medium, com ~70% de poupança. Comprar RIs de instâncias sobre-dimensionadas amplifica o desperdício e prende-te a ele por 1-3 anos.',
    difficulty: 'medium',
  },
  {
    id: 7014,
    topic: 'vpc',
    topicLabel: 'Cenário · Custos',
    question: 'Uma aplicação em subnets privadas faz milhões de GET ao S3 por dia. A factura de NAT Gateway está a crescer. Qual é a correcção com melhor retorno?',
    options: [
      'Substituir o NAT Gateway por NAT Instances mais baratas',
      'Criar um Gateway VPC Endpoint para S3 — grátis e o tráfego deixa de passar pelo NAT',
      'Mover a aplicação para subnets públicas',
      'Activar S3 Transfer Acceleration',
    ],
    correctIndex: 1,
    explanation: 'Gateway Endpoints (S3 e DynamoDB) são gratuitos e funcionam via route table. O tráfego para S3 deixa de atravessar o NAT Gateway, eliminando tanto as horas como os GB processados. É uma das optimizações de maior retorno e menor esforço em AWS.',
    difficulty: 'easy',
  },

  // ── Alta disponibilidade e DR ───────────────────────────────────
  {
    id: 7015,
    topic: 'databases',
    topicLabel: 'Cenário · Alta disponibilidade',
    question: 'Uma aplicação financeira exige que, se a AZ do primary da base de dados falhar, o serviço recupere automaticamente em menos de 2 minutos sem perda de dados. Que configuração RDS satisfaz o requisito?',
    options: [
      'Read Replica noutra AZ, promovida manualmente em caso de falha',
      'Multi-AZ com standby síncrono e failover automático',
      'Snapshots automáticos de hora a hora',
      'Read Replica cross-region',
    ],
    correctIndex: 1,
    explanation: 'Multi-AZ mantém um standby síncrono noutra AZ — RPO zero (sem perda de dados) e failover automático em 60-120 segundos, com o endpoint DNS a apontar para o novo primary. Read Replicas são assíncronas (podem perder transacções) e a promoção é manual.',
    difficulty: 'medium',
  },
  {
    id: 7016,
    topic: 'wellarch',
    topicLabel: 'Cenário · Disaster Recovery',
    question: 'Uma empresa define RTO de 4 horas e RPO de 15 minutos para o seu sistema principal. Quer minimizar o custo da estratégia de DR. Qual abordagem escolher?',
    options: [
      'Multi-Site Active-Active nas duas regiões',
      'Pilot Light — réplica assíncrona da BD na região DR, AMIs prontas, EC2 desligadas',
      'Backup and Restore a partir de snapshots em S3',
      'Warm Standby com capacidade reduzida sempre a correr',
    ],
    correctIndex: 1,
    explanation: 'RTO de 4h e RPO de 15min mapeiam para Pilot Light: a réplica assíncrona da BD dá RPO curto, e ligar as EC2 a partir de AMIs prontas cabe folgadamente em 4h. Backup and Restore seria mais barato mas o RTO ultrapassa 4h. Warm Standby e Active-Active satisfazem o requisito mas custam muito mais do que o necessário.',
    difficulty: 'hard',
  },

  // ── Segurança ───────────────────────────────────────────────────
  {
    id: 7017,
    topic: 'iam',
    topicLabel: 'Cenário · Segurança',
    question: 'Um auditor externo exige prova de que os registos de transacções financeiras nunca foram alterados. Qual serviço AWS foi desenhado para este requisito?',
    options: [
      'DynamoDB com Point-in-Time Recovery',
      'Amazon QLDB — journal append-only com verificação criptográfica SHA-256',
      'S3 com versioning activado',
      'Amazon Managed Blockchain',
    ],
    correctIndex: 1,
    explanation: 'QLDB mantém um journal imutável append-only, verificável criptograficamente. O auditor pode provar matematicamente que nenhum registo foi alterado. Difere de blockchain por ser centralizado (confias na AWS como autoridade), o que o torna mais rápido e simples quando não precisas de descentralização.',
    difficulty: 'medium',
  },
  {
    id: 7018,
    topic: 'storage',
    topicLabel: 'Cenário · Compliance',
    question: 'Regulação obriga a reter registos por 7 anos sem que ninguém — incluindo o root da conta — os possa apagar antes do prazo. Que configuração S3 garante isto?',
    options: [
      'Bucket policy com Deny em s3:DeleteObject',
      'S3 Object Lock em modo Compliance com retenção de 7 anos',
      'Versioning com MFA Delete',
      'Lifecycle policy que transiciona para Glacier Deep Archive',
    ],
    correctIndex: 1,
    explanation: 'Object Lock em modo Compliance é verdadeiramente imutável (WORM): nem o root pode apagar ou reduzir o período de retenção. O modo Governance permite override com permissões especiais — insuficiente para este requisito. Bucket policies podem ser alteradas por quem tem permissões.',
    difficulty: 'hard',
  },

  // ── Rede e entrega de conteúdo ──────────────────────────────────
  {
    id: 7019,
    topic: 'vpc',
    topicLabel: 'Cenário · Rede',
    question: 'Uma organização tem 22 VPCs em 4 contas AWS e precisa de conectividade entre todas. A equipa de rede quer evitar gerir centenas de ligações. Qual é a arquitectura correcta?',
    options: [
      'VPC Peering full-mesh entre todas as VPCs',
      'AWS Transit Gateway como hub central, partilhado entre contas via RAM',
      'Site-to-Site VPN entre cada par de VPCs',
      'Uma VPC partilhada única com VPC Sharing',
    ],
    correctIndex: 1,
    explanation: 'Peering full-mesh com 22 VPCs exigiria 231 ligações e não é transitivo. O Transit Gateway é hub-and-spoke: cada VPC faz um attachment e o TGW trata do routing. É transitivo, escala para centenas de VPCs, e partilha-se entre contas com o Resource Access Manager.',
    difficulty: 'medium',
  },
  {
    id: 7020,
    topic: 'compute',
    topicLabel: 'Cenário · Deploy',
    question: 'Uma equipa quer fazer deploy de uma nova versão em ECS enviando primeiro 10% do tráfego, monitorizar 10 minutos, e reverter automaticamente se a taxa de erro passar de 5%. Que serviço e estratégia?',
    options: [
      'Substituir as tasks directamente com rolling update do ECS',
      'CodeDeploy com blue/green e traffic shifting canary, rollback automático via CloudWatch Alarms',
      'Criar um segundo cluster e mudar o DNS manualmente',
      'Lambda com aliases e versões',
    ],
    correctIndex: 1,
    explanation: 'O CodeDeploy suporta blue/green em ECS com traffic shifting (canary, linear ou all-at-once). Cria um novo task set, encaminha a percentagem definida, monitoriza, e faz rollback automático se um CloudWatch Alarm disparar — normalmente em menos de um minuto. O rolling update do ECS não permite controlo percentual nem rollback automático baseado em métricas.',
    difficulty: 'hard',
  },
];
