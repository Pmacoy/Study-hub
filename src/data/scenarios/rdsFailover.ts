import type { Scenario } from '../../types/scenario';

export const rdsFailoverScenario: Scenario = {
  id: 'rds-failover-multi-az',
  domain: 'aws',
  format: 'guided',
  title: 'Failover RDS Multi-AZ — application timeouts',
  hook: 'Sábado, 2:17 da manhã. Alerta no PagerDuty: "API response time > 5s" e "Database connection errors spike". O painel mostra que a instância RDS Primary em us-east-1a caiu. A aplicação está a dar timeouts. O que aconteceu e o que deves fazer?',
  difficulty: 'mid',
  timeEstimateMin: 9,
  tags: ['aws', 'rds', 'failover', 'multi-az'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Instância RDS:      db-ecommerce-prod
Engine:             MySQL 8.0
Class:              db.r6g.xlarge
Multi-AZ:           Sim (activated em Março 2025)
Primary AZ:         us-east-1a
Replica AZ:         us-east-1b
Endpoint:           db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com
Aplicação:          API Node.js (10 instâncias EC2 em us-east-1a e 1b)
Último failover:     Nunca registado (Multi-AZ activo há 6 meses)`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'cloudwatch-metrics',
      label: '📊 CloudWatch — RDS Metrics last 30 min (02:00 - 02:30)',
      language: 'text',
      content: `02:00  CPUUtilization:  12% | DBConnections: 45 | FreeableMemory: 4.2GB
02:05  CPUUtilization:  14% | DBConnections: 47 | FreeableMemory: 4.1GB
02:10  CPUUtilization:  89% | DBConnections: 23 | FreeableMemory: 1.8GB  ← Anomalia
02:11  CPUUtilization:  98% | DBConnections:  8 | FreeableMemory: 0.4GB
02:12  CPUUtilization:   0% | DBConnections:  0 | FreeableMemory: 0.0GB   ← INSTANCE UNREACHABLE
02:13  [FAILING OVER to us-east-1b]
02:14  CPUUtilization:   0% | DBConnections:  0 | FreeableMemory: 0.0GB
02:17  CPUUtilization:  45% | DBConnections: 12 | FreeableMemory: 3.1GB   ← NEW PRIMARY
02:18  CPUUtilization:  52% | DBConnections: 34 | FreeableMemory: 2.9GB
02:20  CPUUtilization:  48% | DBConnections: 67 | FreeableMemory: 2.7GB`,
    },
    {
      id: 'rds-events',
      label: '$ aws rds describe-events --source-identifier db-ecommerce-prod --start-time 2026-09-01T02:00:00Z',
      language: 'bash',
      content: `[
  {
    "SourceIdentifier": "db-ecommerce-prod",
    "SourceType": "db-instance",
    "EventDate": "2026-09-01T02:10:45.000Z",
    "Severity": "medium",
    "Message": "Auto-scaling detected high CPU on primary; evaluating failover readiness"
  },
  {
    "SourceIdentifier": "db-ecommerce-prod",
    "SourceType": "db-instance",
    "EventDate": "2026-09-01T02:12:03.000Z",
    "Severity": "high",
    "Message": "Source instance unhealthy. Initiating failover to replica in us-east-1b."
  },
  {
    "SourceIdentifier": "db-ecommerce-prod",
    "SourceType": "db-instance",
    "EventDate": "2026-09-01T02:12:04.000Z",
    "Severity": "high",
    "Message": "Failover starting. Promoting read replica in us-east-1b to primary."
  },
  {
    "SourceIdentifier": "db-ecommerce-prod",
    "SourceType": "db-instance",
    "EventDate": "2026-09-01T02:17:22.000Z",
    "Severity": "info",
    "Message": "Failover complete. New primary is in us-east-1b."
  },
  {
    "SourceIdentifier": "db-ecommerce-prod",
    "SourceType": "db-instance",
    "EventDate": "2026-09-01T02:17:23.000Z",
    "Severity": "info",
    "Message": "Endpoint remains the same: db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com"
  }
]`,
    },
    {
      id: 'app-logs',
      label: 'Application Logs — connection errors (02:10 - 02:20)',
      language: 'log',
      content: `2026-09-01T02:10:47.221Z WARN  [db-connector] Connection pool exhausted (max=50, active=50, waiting=23)
2026-09-01T02:10:48.103Z ERROR [db-connector] Connection to db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com:3306 failed: ETIMEDOUT
2026-09-01T02:10:48.891Z ERROR [db-connector] Connection to db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com:3306 failed: ECONNREFUSED
2026-09-01T02:11:02.445Z ERROR [db-connector] Connection to db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com:3306 failed: ETIMEDOUT
2026-09-01T02:12:05.001Z ERROR [db-connector] All 50 connections lost during failover
2026-09-01T02:12:05.002Z ERROR [db-connector] Failover in progress — connections will be re-established automatically
2026-09-01T02:13:15.334Z WARN  [db-connector] Reconnecting to db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com:3306...
2026-09-01T02:13:18.892Z INFO  [db-connector] Connection re-established (new primary: us-east-1b)
2026-09-01T02:17:22.110Z INFO  [db-connector] Failover complete — endpoint unchanged, new AZ: us-east-1b`,
    },
    {
      id: 'endpoint-dns',
      label: '$ nslookup db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com',
      language: 'bash',
      content: `Server:  10.0.0.2
Address: 10.0.0.2#53

Non-authoritative answer:
Name:    db-ecommerce-prod.xxx.us-east-1.rds.amazonaws.com
Address: 10.0.1.50   ← IP mudou de 10.0.2.80 (antigo primary em 1a) para 10.0.1.50 (novo primary em 1b)
** Service temporarily unavailable

# O endpoint CNAME permanece o mesmo, mas o IP resolvido mudou
# TTL do DNS: 60 segundos
# As EC2 instances podem ter cached DNS até 60s após o failover`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Recebeste o alerta de timeouts. Olhando para as métricas CloudWatch, o que aconteceu por volta das 02:10-02:12?',
      revealArtifacts: ['cloudwatch-metrics'],
      options: [
        {
          id: 'a',
          label: 'A instância primary em us-east-1a ficou unhealthy — CPU saltou para 98% e as conexões caíram a zero, desencadeando failover automático',
          correct: true,
          feedback: 'Correto. O pattern é claro: CPU a 98%, conexões a cair para zero, e depois a mensagem "Failover starting". O Multi-AZ detectou a instabilidade e promoveu o replica em 1b.',
          revealArtifacts: ['rds-events'],
        },
        {
          id: 'b',
          label: 'Alguém fez reboot manual da instância',
          correct: false,
          feedback: 'Um reboot manual teria um evento "db-instance modified" com Source: user. Os eventos mostram "Source instance unhealthy" — foi automático, não manual.',
        },
        {
          id: 'c',
          label: 'A aplicação consumiu toda a memória e o RDS crashou',
          correct: false,
          feedback: 'A memória freeable caiu mas o gatilho foi CPU a 98% + instância unhealthy. O RDS não "crasha" por memória da aplicação — ele é um serviço gerido. O failover foi automático por unhealthy detection.',
        },
      ],
      teachingNote: 'RDS Multi-AZ failover é AUTOMÁTICO quando o AWS deteta que a primary está unhealthy. O processo: (1) detection de unhealthy, (2) promotion do replica, (3) re点指向o do endpoint CNAME. O endpoint NÃO muda — é uma das vantagens do Multi-AZ.',
    },
    {
      id: 'step-2',
      prompt: 'O failover começou às 02:12 e completou às 02:17. Porquê 5 minutos de downtime? O que aconteceu nesse intervalo?',
      revealArtifacts: ['rds-events'],
      options: [
        {
          id: 'a',
          label: 'O tempo de failover inclui: stop da old primary, promotion do replica, DNS repoint do endpoint, e reconexão das aplicações — tudo automático mas leva tempo',
          correct: true,
          feedback: 'Exacto. O failover Multi-AZ não é instantâneo: (1) replica é promovido a primary (~30-60s), (2) DNS CNAME é actualizado, (3) conexões existentes são quebradas, (4) aplicações precisam de reconectar. 2-10 minutos é normal.',
          revealArtifacts: ['app-logs'],
        },
        {
          id: 'b',
          label: 'Houve um erro no failover que o AWS está a tentar recuperar',
          correct: false,
          feedback: 'O evento de 02:17 diz "Failover complete" — foi bem-sucedido. Os 5 minutos foram tempo normal de failover, não erro.',
        },
        {
          id: 'c',
          label: 'O CloudFront estava em cache e demorou a invalidar',
          correct: false,
          feedback: 'Isto é RDS/MySQL, não tem relação com CloudFront. O downtime foi de connections lost na base de dados, não de cache invalidation.',
        },
      ],
      teachingNote: 'Failover Multi-AZ típico: 2-10 minutos. O tempo varia conforme o tamanho da base de dados (WAL replication lag) e a carga de conexões. O endpoint permanece o mesmo, mas as conexões activas são terminadas e as novas vão para o novo primary.',
    },
    {
      id: 'step-3',
      prompt: 'As aplicações estão de volta mas os timeouts continuam intermitentes. Olhando para o DNS, qual é a causa mais provável?',
      revealArtifacts: ['endpoint-dns'],
      options: [
        {
          id: 'a',
          label: 'Algumas instâncias EC2 ainda têm DNS cached do IP antigo (TTL 60s) — esperas o TTL expirar ou fazes flush local',
          correct: true,
          feedback: 'Correto. O TTL do endpoint RDS é 60s. Após o failover, instâncias que resolveram o DNS antes das 02:17 podem ainda tentar conectar ao IP antigo (10.0.2.80) que já não existe. Após ~60s, o DNS cache expira e tudo estabiliza.',
          revealArtifacts: [],
        },
        {
          id: 'b',
          label: 'A tabela de dados está corrompida após o failover',
          correct: false,
          feedback: 'RDS Multi-AZ usa synchronous replication — o replica tem os mesmos dados. Não há corrupção. O problema é de conectividade, não de dados.',
        },
        {
          id: 'c',
          label: 'O Security Group do RDS bloqueou o novo IP após o failover',
          correct: false,
          feedback: 'Security Groups são associados ao ENI, não ao IP. O novo primary em 1b tem o mesmo SG. Não há bloqueio.',
        },
      ],
      teachingNote: 'Após failover Multi-AZ, o TTL do DNS endpoint é o factor crítico. Aplicacao com connection pooling e DNS caching (ex: glibc nscd, ou connection pool com re-resolve lento) pode ter timeouts até o TTL expirar. Mitigação: reduzir o DNS TTL do endpoint RDS (não é controlável pelo utilizador — AWS define 60s), e usar connection retry com backoff na aplicação.',
    },
    {
      id: 'step-4',
      prompt: 'Tudo estabilizou. Estás a escrever o post-mortem. Qual combinação de acções previne impacto futuro deste tipo de evento?',
      options: [
        {
          id: 'a',
          label: 'Activar Multi-AZ (já activo), garantir connection retry com exponential backoff na app, e configurar alarme CloudWatch RDSFailover para notificação imediata',
          correct: true,
          feedback: 'Esta é a resposta completa: Multi-AZ já protege a disponibilidade, retry na app lida com o período de transição, e alertas dão visibilidade rápida para intervenção humana se necessário.',
        },
        {
          id: 'b',
          label: 'Migrar para Aurora Global Database',
          correct: false,
          feedback: 'Aurora Global é overkill para este cenário. O Multi-AZ já fornece failover automático. Aurora Global é para DR cross-region, não para failover intra-region.',
        },
        {
          id: 'c',
          label: 'Desactivar Multi-AZ e usar backup/restore manual para ter controlo total',
          correct: false,
          feedback: 'Desactivar Multi-AZ elimina a protecção de failover automático. Em caso de falha, o RDP seria horas, não minutos. Esta é uma regression de segurança.',
        },
      ],
      teachingNote: 'Bons practices para RDS Multi-AZ: (1) Manter Multi-AZ SEMPRE activo em production; (2) Aplicação deve ter connection retry com backoff exponencial (cobre o período de failover); (3) CloudWatch alarme RDSFailover para alertar o on-call; (4) Testar failover periodicamente com aws rds failover-db-instance — não esperes pelo failover real.',
    },
  ],

  resolution: {
    rootCause: 'A instância RDS primary em us-east-1a tornou-se unhealthy por volta das 02:10 (CPU a 98%, conexões a cair). O mecanismo automático de Multi-AZ detectou a falha e iniciou failover para o replica em us-east-1b. O failover completou às 02:17 (~5 minutos). Durante e imediatamente após o failover, algumas instâncias EC2 ainda resolviam o DNS para o IP antigo (TTL 60s), causando timeouts intermitentes até todas as caches DNS expirarem.',
    fix: 'O failover foi automático e bem-sucedido. O endpoint permanece o mesmo. Os timeouts intermitentes resolvidos sozinhos após expiração do TTL DNS (~60s). Nada precisa de intervenção manual — o Multi-AZ cumpriu o seu papel.',
    preventions: [
      'Manter Multi-AZ activo em TODAS as instâncias RDS de production (já estava activo neste caso)',
      'Adicionar connection retry com exponential backoff (ex: 3 tentativas, 1s/2s/4s) em todos os clientes de base de dados',
      'CloudWatch alarme RDSFailover → SNS → PagerDuty para notificação imediata de failovers',
      'Runbook documentado para failover RDS: verificar events, confirmar new primary, monitorar conexões',
      'Teste periódico de failover (aws rds failover-db-instance) em window de manutenção para validar o comportamento',
      'Considerar AWS RDS Proxy para gerir connection pooling e reduzir impacto de reconexões durante failover',
    ],
  },
};
