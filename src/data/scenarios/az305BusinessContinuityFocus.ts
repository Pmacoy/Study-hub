import type { Scenario } from '../../types/scenario';

/**
 * AZ-305 — Business Continuity & Infrastructure
 * Case study focado em: Recovery Services Vault, Site Recovery, Backup, Traffic Manager, Front Door
 * Domínios cobertos: DR strategy, backup strategy, HA patterns, geo-redundancy
 */
export const az305BusinessContinuityFocusScenario: Scenario = {
  id: 'az305-bc-dr-infra-focus',
  domain: 'azure',
  format: 'guided',
  title: 'Arquitectura DR e failover para o banco digital FastPay — RTO 30 minutos, zero perda de transações',
  hook: 'O FastPay é um banco digital português com 500k clientes e licença do Banco de Portugal. Transações em tempo real 24/7, média de 2.000 transações/minuto. O regulador exige plano de Business Continuity com RTO de 30 minutos e RPO zero (nenhuma transação perdida). A infraestrutura actual está toda em West Europe e não tem DR. Na segunda-feira há auditoria do regulador. O CTO está em pânico e perguntou: "preciso de um plano que eu consiga explicar ao supervisor em 5 minutos".',
  difficulty: 'senior',
  timeEstimateMin: 15,
  tags: ['azure', 'az-305', 'business-continuity', 'disaster-recovery', 'backup', 'ha', 'banking'],

  contextArtifacts: [
    {
      id: 'infra-actual',
      label: 'Infraestrutura actual — West Europe apenas',
      language: 'text',
      content: `VMs:
  app-api-1/2       D8s_v5 × 2     API REST de transações (stateless)
  app-web-1/2       D4s_v5 × 2     Frontend React
  worker-batch      E4s_v5 × 1     Processamento batch nocturno
  sql-primary       E16s_v5 × 1    SQL Server 2022 Enterprise (Always On AG)
  redis-primary     Standard C4    Cache de sessões

Base de Dados:
  SQL Server 2022 Enterprise
  · Always On AG: síncrono (sync commit) dentro de West Europe
  · 128 GB RAM, 4 TB data, 500 GB log
  · 340 stored procedures, job de reconciliação a cada 15 minutos
  · RPO actual: 0 (síncrono) | RTO actual: não testado (unstructured)

Storage:
  Transações: 8 TB em Blob Hot (retidos 30 dias)
  Documentos KYC: 2 TB em Blob Cool (retidos 7 anos — obrigação legal)
  Backups: Azure Backup para SQL (diário full, a cada 15min log)

Tráfego:
  Normal: 2.000 transações/minuto
  Pico (fim-de-mês): 8.000 transações/minuto
  Latência aceitável: < 200ms p99 para transações`,
    },
    {
      id: 'requisitos-regulador',
      label: 'Requisitos do Banco de Portugal + RGPD',
      language: 'text',
      content: `BANCO DE PORTUGAL — Regulamento de Continuidade Operacional:
  RTO: 30 minutos (máx.)
  RPO: ZERO — nenhuma transação de pagamento pode ser perdida
  Teste de failover: mínimo 1x/ano, com evidência documentada
  RPO de 0 implica: replicação síncrona entre regiões para o SQL Server

RGPD (dados de clientes):
  Dados pessoais: NUNCA fora da UE
  Retenção KYC: 7 anos mínimo (regulamentar)
  Retenção transações: 30 dias Hot, depois Archive
  Direito ao esquecimento: motion to purgar em < 30 dias

NOTA DO CTO: "Qualquer solução que não seja zero-RPO e < 30min RTO
não passa na auditoria. Não é opcional — é licença para operar."`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'bcrp-diagrama',
      label: 'Business Continuity Planning — árvore de decisão',
      language: 'text',
      content: `COMO CHEGAR AO RTO/RTO CERTO:

Nível 0: Disponibilidade
  99,99% SLA → redundancy em zona (Availability Zones)
  Mas: falha de região inteira = downtime total

Nível 1: Failover Regional (Active-Passive)
  Réplica em 2ª região, failover manual ou semi-automático
  RPO: depende da replicação (síncrona = 0, asíncrona = lag)
  RTO: 1-4 horas (depende de escalonamento e DNS)
  CUSTO: ~30-50% do primário (só backup)

Nível 2: Failover Regional (Active-Active)
  Trafilhe em AMBAS as regiões, load balancing global
  RPO: 0 (replicação síncrona)
  RTO: < 5 minutos (failover automático via Front Door)
  CUSTO: ~100% do primário (duplica tudo)

Nível 3: Multi-Region Active-Active com données síncronos
  Tudo em 3 regiões, quorum de 2
  RPO: 0, RTO: < 1 minuto
  CUSTO: ~200% do primário (overkill para 99,9% dos casos)

O FastPay precisa de NÍVEL 2: Active-Active, RPO 0, RTO < 30min.
Nível 1 não chega porque o RTO de 1-4h excede 30 min.`,
    },
    {
      id: 'custo-dr-estimado',
      label: 'Estimativa de custo mensal — Active-Active em 2 regiões',
      language: 'text',
      content: `Componente                       Primária    Secundária   Mensal total
──────────────────────────────  ──────────   ──────────   ─────────────
VMs App API (D8s_v5 × 2)          €520        €520         €1 040
VMs Web (D4s_v5 × 2)             €260        €260          €520
Worker batch (E4s_v5 × 1)        €310         —            €310
SQL Enterprise (E16s_v5 × 1)    €2 480      €2 480       €4 960
  + License SQL (~€200/vCore)    €1 600      €1 600       €3 200
Redis Standard C4                 €340         —           €340
Front Door Standard + WAF                          €280       €280
Storage Hot 8 TB                  €160        €160          €320
Storage Cool 2 TB                   €20         €20           €40
Backup (SQL + VMs)                €120        €120          €240
DNS + Networking                    €10         €10           €20
──────────────────────────────  ──────────   ──────────   ─────────────
TOTAL                           ≈ €6 000                    ≈ €11 270/mês

Nota: o custo da secundária é ~85% do primário (Active-Active = duplica quase tudo).
Mas se o regulador exigir, não é opcional.`,
    },
    {
      id: 'sql-ag-sincrono',
      label: 'SQL Server Always On AG — replicação síncrona cross-region',
      language: 'text',
      content: `O RPO zero exige replicação síncrona — cada transação é confirmada em AMBAS as regiões antes de ser commit.

CONFIGURAÇÃO:
  West Europe:   SQL Primary (async commit → secundária)
  North Europe:  SQL Secondary (sync commit ← primária)

FLUXO DE UMA TRANSAÇÃO:
  1. App escreve transação no Primary (West Europe)
  2. Primary grava no log (WAL)
  3. Log shipa para Secondary (North Europe) via replicação síncrona
  4. Secondary confirma: "gravação OK"
  5. Primary faz COMMIT na app
  6. Resposta ao cliente: "transação OK"

IMPACTO NA PERFORMANCE:
  · Latência adicional: +1-3ms (round-trip West↔North Europe)
  · Para 2.000 tx/min = ~33 tx/s, overhead aceitável
  · Para 8.000 tx/min (pico): ~133 tx/s, overhead pode ser significativo
  · SOLUÇÃO: medir latência cross-region ANTES de activar sync commit

SECONARY REDIRECT:
  Application Mode: Read-Intent Secondary
  · Transações de LEITURA (consultas, dashboards) vão para o secundário
  · Transações de ESCRITA ficam no primário
  · Reduz carga no primário em ~40%`,
    },
    {
      id: 'failover-orchestration',
      label: 'Orquestração de failover — passos para o CTO apresentar ao regulador',
      language: 'text',
      content: `PLANO DE FAILOVER — EXPLICÁVEL EM 5 MINUTOS
═══════════════════════════════════════════════════════════════════════

TRIGGER: Monitor detecta primária offline (Health Probe falha 3x)

PASSO 1 (0-2 min): DETECÇÃO
  · Azure Monitor alert → Action Group → PagerDuty
  · Tempo: automático

PASSO 2 (2-5 min): CONFIRMAÇÃO
  · Operador confirma: "é falha real, não falso positivo"
  · Verifica: secondary está healthy, latency < 5ms
  · Tempo: manual, < 3 min

PASSO 3 (5-15 min): FAILOVER SQL
  · Failover do Always On AG: secondary → primary
  · PowerShell: Invoke-SqlCmd -Query "ALTER AVAILABILITY GROUP ... FORCE_FAILOVER_ALLOW_DATA_LOSS"
  · Tempo: < 5 min (síncrono = zero data loss)
  · APP MUDA: connection string aponta para North Europe

PASSO 4 (15-20 min): FAILOVER APP
  · Front Door: desviar tráfego para North Europe
  · DNS: TTL 60s, propagação < 5 min
  · App Service: escalar 2ª região para capacidade plena
  · Tempo: automático via Front Door, < 5 min

PASSO 5 (20-25 min): VALIDAÇÃO
  · Health check: transações de teste em North Europe
  · Dashboard: métricas de latência, throughput, erros
  · Tempo: < 5 min

PASSO 6 (25-30 min): COMUNICAÇÃO
  · Notificação ao regulador (se necessário)
  · Status page actualizado
  · Tempo: < 5 min

═══════════════════════════════════════════════════════════════════════
TOTAL: < 30 minutos. REGULADOR SATISFEITO.
═══════════════════════════════════════════════════════════════════════

FAILOVER AUTOMÁTICO vs SEMI-AUTOMÁTICO:
  · Auto: Front Door + SQL AG failover automático (tempo: ~5 min)
  · Semi: confirmação humana entre passos 2-3 (tempo: ~20 min)
  · RECOMENDAÇÃO: semi-automático para banca (evita failover por falso positivo)
  · O custo do downtime desnecessário (failover por engano) supera o benefício da velocidade`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O regulador exige RPO zero. Que tipo de replicação SQL Server usas entre West Europe e North Europe?',
      options: [
        {
          id: 'a',
          label: 'Always On AG com réplica síncrona cross-region (sync commit)',
          correct: true,
          feedback: 'Exacto. Replicação síncrona confirma cada transação em AMBAS as regiões antes do commit — RPO = 0 garantido. O overhead de latência cross-region (~1-3ms) é aceitável para 2.000 tx/min. É o único mecanismo que dá RPO zero no SQL Server sem compromissos.',
          revealArtifacts: ['sql-ag-sincrono', 'failover-orchestration'],
        },
        {
          id: 'b',
          label: 'Azure SQL Database Geo-Replication síncrona',
          correct: false,
          feedback: 'O workload usa SQL Server Enterprise (não Azure SQL Database). Não podes migrar de SQL Server on-prem/VM para SQL Database sem reescrever stored procedures, jobs e cross-database queries — o custo de migração e o risco não justificam. O AG cross-region dá o mesmo RPO zero no mesmo motor.',
        },
        {
          id: 'c',
          label: 'Backup log shipping a cada 5 minutos',
          correct: false,
          feedback: 'Log shipping é replicação asíncrona com lag — o RPO é sempre > 0 (até 5 minutos de transações potencialmente perdidas). O regulador exige RPO ZERO, não RPO 5 minutos. Backup é para recuperação de corrupção lógica, não para failover DR.',
        },
      ],
      teachingNote: 'RPO zero = replicação síncrona. Não existe outra forma no SQL Server. Se o workload for assíncrono (OLAP, analytics), RPO > 0 é aceitável e log shipping ou async AG são suficientes.',
    },
    {
      id: 'step-2',
      prompt: 'Front Door com failover automático para 2ª região. Como evitas o failover por falso positivo?',
      options: [
        {
          id: 'a',
          prompt: 'Health probes com threshold 3 + confirmação manual antes do failover SQL',
          correct: true,
          feedback: 'Correcto. Health probes com threshold alto (3 falhas consecutivas) reduzem falsos positivos. Mas o failover SQL é a acção mais destrutiva — se correr sem confirmação humana, um bug de rede pode causar failover desnecessário. Semi-automático é o padrão para workloads financeiros: rápido o suficiente para < 30min, seguro o suficiente para não haver failovers por engano.',
          revealArtifacts: ['failover-orchestration'],
        },
        {
          id: 'b',
          label: 'Failover totalmente automático — sem intervenção humana',
          correct: false,
          feedback: 'Failover automático é ideal para e-commerce, mas para banca o risco de falso positivo é maior que o benefício da velocidade. Um failover por engano pode causar 10-20 minutos de instabilidade enquanto o sistema estabiliza — tempo que o regulador vai questionar. Semi-automático dá o mesmo RTO com mais controlo.',
        },
        {
          id: 'c',
          label: 'Desactivar health probes — só failover manual',
          correct: false,
          feedback: 'Sem health probes não sabes quando a primária caiu. O operador só descobre quando clientes reclamam. Isso adiciona 15-30 minutos de detecção ao RTO, violando o requisito de 30 minutos.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'Azure Backup para SQL: full diário, log a cada 15min. Como optimizas o custo mantendo compliance?',
      options: [
        {
          id: 'a',
          label: 'Retention: 30 dias (local) + 12 meses (GRS) + 7 anos (Vault)',
          correct: true,
          feedback: 'Correcto. Retenção em cascata: 30 dias para restore rápido (ponto no tempo), 12 meses GRS para compliance anual, 7 anos em Vault para KYC obrigatório. Cada tier é mais barato. A retenção de 7 anos é lei para documentos KYC — não é opcional.',
        },
        {
          id: 'b',
          label: 'Manter tudo em Hot por 7 anos — simplify',
          correct: false,
          feedback: '4 TB de SQL backups retenidos em Hot durante 7 anos = ~€150k em custo de storage. Tiering para Cool/Archive reduz isso para ~€15k. "Simplificar" não significa "gastar mais" — lifecycle policy é simples E barata.',
        },
        {
          id: 'c',
          label: 'Backup apenas em West Europe — não precisa de redundância geográfica',
          correct: false,
          feedback: 'Se West Europe cair (região), perdes o backup E a base de dados primária ao mesmo tempo. O backup em GRS (North Europe) é a rede de segurança contra falha regional — exactamente o cenário que o plano de DR está a cobrir.',
        },
      ],
      teachingNote: 'Azure Backup tem 3 tiers de retenção:Retention (local, curto prazo), Retention com GRS (médio prazo, cross-region), e Vault (longo prazo, imutável). Usar os 3 dá compliance sem inflacionar custos.',
    },
    {
      id: 'step-4',
      prompt: 'Pico de fim-de-mês: 8.000 tx/minuto (4x o normal). Como dimensionas a secundária para suportar failover durante pico?',
      options: [
        {
          id: 'a',
          label: 'VM Scale Set com autoscale baseado em CPU para a secundária, quente (pre-warmed)',
          correct: true,
          feedback: 'A secundária precisa de estar warm (pelo menos 1 instância ativa) para failover imediato. Autoscale com pre-warming garante que não arrancas de frio durante pico. Em failover, o tráfego desvia para a secundária com 4x o normal — se a secundária tiver só 1 instância, satura. Autoscale dynamics adapter no secundário para escalar de 1 para 4+ instâncias em < 5 minutos.',
        },
        {
          id: 'b',
          label: 'Secundária sempre à mesma escala da primária (idêntica)',
          correct: false,
          feedback: 'Duplias o custo anual para cobrir ~10% do tempo (pico de fim-de-mês). Para os outros 90%, pagas instâncias ociosas. Autoscale é o padrão: warm base com capacidade para escalar durante failover. O custo de 2-3 horas de capacidade elevada em secundária é irrelevante vs 30 dias/mês de overprovisioning.',
        },
        {
          id: 'c',
          label: 'Dimensionar a secundária para tráfego normal — o pico não vai cair na secundária',
          correct: false,
          feedback: 'Se o failover acontece durante pico (fim-de-mês), a secundária SUCESSA precisar de suportar 4x. Dimensionar para "normal" significa que se cair durante pico, perdes exactamente o tráfego que o regulador mais monitoriza. O DR tem de funcionar para TODOS os cenários, não só para o cenário confortável.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: 'O CTO precisa de explicar o plano ao regulador em 5 minutos. Qual é o pitch?',
      options: [
        {
          id: 'a',
          label: 'Mostrar diagrama com 2 regiões, explicar: "dados sempre em 2 sítios, failover em < 30 minutos, zero perda"',
          correct: true,
          feedback: 'Exacto. O regulador não quer ver PowerShell scripts — quer ver: (1) onde estão os dados (2 regiões, sempre), (2) quanto tempo leva o failover (< 30min), (3) se perde dados (zero, replicação síncrona), (4) se testam (1x/ano). O diagrama basta. Tudo o resto é detalhe técnico que o supervisor vai perguntar SE quiser.',
          revealArtifacts: ['failover-orchestration'],
        },
        {
          id: 'b',
          label: 'Levar a documentação completa: scripts, runbooks, métricas de latency',
          correct: false,
          feedback: 'Overload de informação. O supervisor não é engenheiro — é regulador. Precisa de 4 números (regiões, RTO, RPO, frequência de testes) e 1 diagrama. A documentação completa fica disponível SE o supervisor pedir follow-up. Começar pela complexidade é perder a audiência.',
        },
        {
          id: 'c',
          label: 'Focar no custo — mostrar que está a optimizar orçamento',
          correct: false,
          feedback: 'A prioridade do regulador é segurança e continuidade, não custo. Em auditoria, falar de custo antes de falar de resilience sinaliza que a organização está a poner preço à segurança. Deixa o custo para o CFO — tu falas de arquitectura.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'O banco tem toda a infraestrutura numa só região (West Europe) sem failover cross-region. O SQL Server tem Always On AG síncrono, mas apenas dentro da mesma região — se a região cair, perde dados e violate o RPO zero do regulador. O RTO não é garantido porque não há sequer uma segunda região provisionada para failover.',
    fix: 'Arquitectura final: Active-Active em West Europe + North Europe com Azure Front Door a distribuir tráfego e health probes sem threshold 3. SQL Server Always On AG síncrono cross-region (RPO = 0). Réplica secundária com autoscale e pre-warming para suportar 4x tráfego em failover. Azure Backup com retenção em cascata (30d local, 12m GRS, 7a Vault). Failover semi-automático: detecção automática + confirmação humana antes do failover SQL (< 30 min total). Plano documentado e testável: execução anual com evidência para o regulador.',
    preventions: [
      'Teste de failover completo 1x/ano com registo para o regulador — o plano não testado é teoria',
      'Métricas cross-region em dashboard dedicado (latência síncrona, throughput, lag de replicação)',
      'Chaos engineering controlado: simular falha de região 1x/trimestre em janela de manutenção',
      'Runbook passo-a-passo impresso (não só digital) — se o Azure estiver down, não consegues ler o runbook de lá',
      'Treinar os operadores no failover manual: PowerShell scripts testados e validados',
      'Auditoria do custo de DR: revisão trimestral de capacidade da secundária vs tráfego real de failover',
    ],
  },
};
