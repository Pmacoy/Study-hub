import type { Scenario } from '../../types/scenario';

/**
 * AZ-305 — Designing Microsoft Azure Infrastructure Solutions
 * Case study que cruza os 4 domínios do exame:
 *  · Infrastructure solutions (compute + rede global)
 *  · Data storage solutions (SQL + blob + redundância)
 *  · Business continuity (RPO/RTO, failover groups)
 *  · Identity/governance/monitoring (residência de dados, observabilidade)
 */
export const az305MigracaoMultiregiaoScenario: Scenario = {
  id: 'az305-migracao-multiregiao',
  domain: 'azure',
  format: 'guided',
  title: 'Desenhar a migração do e-commerce para Azure com SLA de 99,99%',
  hook: 'És o arquitecto convidado para a NorteShop, retalhista português com 400k clientes. O datacenter em Matosinhos tem o contrato a expirar em 7 meses e a administração já decidiu: vai tudo para Azure. Na sexta-feira apresentas o desenho ao board. O CFO quer o número do custo, o CTO quer o SLA por escrito e a DPO quer garantias de residência de dados. Não há segunda apresentação.',
  difficulty: 'senior',
  timeEstimateMin: 14,
  tags: ['azure', 'az-305', 'architecture', 'bcdr', 'multi-region', 'sql', 'design'],

  contextArtifacts: [
    {
      id: 'requisitos-negocio',
      label: 'Requisitos de negócio (assinados pelo board)',
      language: 'text',
      content: `REQUISITOS NÃO-FUNCIONAIS — Projecto "Atlas"
────────────────────────────────────────────────
Disponibilidade    SLA 99,99% contratual (máx. ~52 min/ano de downtime)
RPO                15 minutos  (perda máxima de dados aceitável)
RTO                1 hora      (tempo máximo para restaurar serviço)
Residência         Dados pessoais NUNCA saem da UE (RGPD, art. 44.º)
Pico sazonal       Black Friday = 8x o tráfego normal, durante ~72h
Equipa             4 engenheiros. Zero experiência com Kubernetes.
Orçamento          Optimizar custo. Sem "cheque em branco".

NOTA DA DPO: auditoria RGPD marcada para Q3. Qualquer réplica de
dados fora da UE é finding crítico e bloqueia o go-live.`,
    },
    {
      id: 'inventario-onprem',
      label: 'Inventário do datacenter actual (Matosinhos)',
      language: 'text',
      content: `APLICAÇÃO
  loja-web        ASP.NET Core 8, stateless, 6 instâncias atrás de F5
  loja-api        ASP.NET Core 8, REST, 4 instâncias
  job-runner      Serviço Windows — processa encomendas em batch nocturno

BASE DE DADOS
  SQL Server 2019 Enterprise — 520 GB
  · 47 stored procedures (lógica de negócio crítica)
  · SQL Agent Jobs: 12 (reconciliação nocturna, relatórios)
  · Cross-database queries para a BD "Faturacao" (legado, 80 GB)
  · CLR assemblies: 2 (cálculo de portes)

FICHEIROS
  NAS 4,2 TB — imagens de produto, faturas PDF, catálogos
  Crescimento: ~180 GB/ano

CARGA
  Normal: 1 200 utilizadores concorrentes | 70% leituras
  Pico:   9 600 utilizadores concorrentes (Black Friday)`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'sla-composto',
      label: 'Cálculo de SLA composto (feito no guardanapo)',
      language: 'text',
      content: `SLA de serviços EM SÉRIE multiplica-se — nunca soma.

Hipótese A — tudo numa só região:
  Front Door      99,99%
  App Service     99,95%   (single region)
  Azure SQL       99,99%
  ────────────────────────
  0,9999 × 0,9995 × 0,9999 = 99,93%   ✗ FALHA o alvo de 99,99%

  99,93% = ~6,1 horas de downtime/ano. Contrato violado.

Hipótese B — camada de app redundante em 2 regiões:
  App Service em paralelo:  1 − (0,0005)² ≈ 99,999975%
  Front Door      99,99%
  Azure SQL (FG)  99,99%
  ────────────────────────
  ≈ 99,98%   ← muito melhor, mas ATENÇÃO ao arredondamento

LIÇÃO: empilhar serviços bons dá um resultado PIOR que o componente
mais fraco. Só redundância EM PARALELO sobe o número.`,
    },
    {
      id: 'opcoes-db',
      label: 'Matriz de decisão — serviço de base de dados',
      language: 'text',
      content: `                        SQL DB      SQL MI       SQL em VM    Cosmos DB
                        (PaaS)      (Managed)    (IaaS)       (NoSQL)
─────────────────────── ─────────── ──────────── ──────────── ──────────
Stored procedures       ✓           ✓            ✓            ✗
SQL Agent Jobs          ✗ (usar EG) ✓            ✓            ✗
Cross-database query    ✗           ✓            ✓            ✗
CLR assemblies          ✗           ✓            ✓            ✗
Gestão de SO/patching   Nenhuma     Nenhuma      TODA tua     Nenhuma
Auto-failover group     ✓           ✓            Manual/AG    ✓ (multi-write)
RPO / RTO (FG)          5s / 1h     5s / 1h      Depende      <15min

O legado da NorteShop usa Agent Jobs + cross-DB + CLR.
Isso elimina candidatos.`,
    },
    {
      id: 'redundancia-storage',
      label: 'Opções de redundância — Azure Storage',
      language: 'text',
      content: `SKU        Cópias  Onde                          Durabilidade  Leitura 2ª região
─────────  ──────  ────────────────────────────  ────────────  ─────────────────
LRS        3       1 datacenter                  11 noves      ✗
ZRS        3       3 zonas / mesma região        12 noves      ✗
GRS        6       2 regiões (par geográfico)    16 noves      ✗
RA-GRS     6       2 regiões                     16 noves      ✓
GZRS       6       3 zonas + região secundária   16 noves      ✗
RA-GZRS    6       3 zonas + região secundária   16 noves      ✓

PARES GEOGRÁFICOS relevantes:
  North Europe (Dublin)  ⇄  West Europe (Amesterdão)   ← ambos UE ✓
  West Europe            ⇄  North Europe
  UK South               ⇄  UK West    (pós-Brexit: fora do RGPD-UE!)

Nota: o par geográfico é FIXO e definido pela Microsoft. Não escolhes.`,
    },
    {
      id: 'custo-estimado',
      label: 'Estimativa de custo mensal (ordem de grandeza)',
      language: 'text',
      content: `Componente                              Mensal (€)   Nota
──────────────────────────────────────  ───────────  ──────────────────────
App Service P1v3 × 3 (North Europe)          ~420     região primária
App Service P1v3 × 1 (West Europe)           ~140     warm standby
Azure SQL MI Business Critical 8 vCore     ~2 900     inclui HA em zona
  + Failover Group (réplica West Europe)   ~2 900     custo DUPLICA
Front Door Standard + WAF                    ~300
Blob RA-GZRS 4,2 TB                          ~180
Azure Monitor + Log Analytics                ~150
──────────────────────────────────────  ───────────
TOTAL aproximado                           ~6 990/mês

⚠ A réplica geo da SQL MI é metade da factura. É aqui que o CFO
  vai perguntar "é mesmo preciso?". Tem a resposta pronta:
  sem ela, o RTO de 1 hora é impossível de garantir.`,
    },
    {
      id: 'autoscale-blackfriday',
      label: 'Perfil de autoscale para o pico sazonal',
      language: 'yaml',
      content: `# Regra de autoscale — App Service Plan (North Europe)
profiles:
  - name: "Base"
    capacity: { minimum: 3, default: 3, maximum: 10 }
    rules:
      - metric: CpuPercentage
        operator: GreaterThan
        threshold: 70
        timeGrain: PT1M
        timeWindow: PT5M          # janela de observação
        direction: Increase
        value: 2                  # +2 instâncias de cada vez
        cooldown: PT5M
      - metric: CpuPercentage
        operator: LessThan
        threshold: 30
        direction: Decrease
        value: 1                  # descer devagar (1 de cada vez)
        cooldown: PT10M           # cooldown maior a descer

  - name: "Black Friday"
    capacity: { minimum: 8, default: 10, maximum: 30 }
    fixedDate:
      timeZone: "GMT Standard Time"
      start: "2026-11-27T00:00:00Z"
      end:   "2026-11-30T23:59:00Z"

# Padrão: subir depressa, descer devagar.
# Descer agressivamente causa "flapping" e degrada a experiência.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Começas pela camada de compute. A equipa tem 4 pessoas e zero experiência com Kubernetes. As apps são ASP.NET Core stateless. Que serviço propões?',
      options: [
        {
          id: 'a',
          label: 'Azure App Service (Premium v3) — PaaS, com deployment slots',
          correct: true,
          feedback: 'Certo. Apps stateless em .NET são o caso de uso canónico do App Service. Sem gestão de nós, deployment slots para blue-green, autoscale nativo. Com 4 pessoas e zero know-how de K8s, escolher AKS seria comprar dívida operacional que a equipa não consegue pagar.',
          revealArtifacts: ['sla-composto'],
        },
        {
          id: 'b',
          label: 'Azure Kubernetes Service (AKS) — mais moderno e portável',
          correct: false,
          feedback: 'Tecnicamente funciona, mas ignora a restrição mais dura do problema: a equipa. AKS exige gerir upgrades de nós, networking CNI, ingress, RBAC do cluster. No AZ-305 a resposta certa é quase sempre a que respeita as capacidades da organização — não a tecnologicamente mais rica.',
        },
        {
          id: 'c',
          label: 'Máquinas virtuais em VM Scale Sets — lift-and-shift directo',
          correct: false,
          feedback: 'Migras o problema em vez de o resolver. Continuas responsável por patching de SO, hardening e imagens. Para apps stateless que já correm em .NET Core, IaaS é o degrau errado — só se justifica quando há dependência de SO que o PaaS não suporta.',
        },
      ],
      teachingNote: 'Heurística AZ-305: escolhe sempre o serviço mais gerido (PaaS > IaaS) que satisfaça os requisitos técnicos. Só desce para IaaS quando existir um bloqueio concreto.',
    },
    {
      id: 'step-2',
      prompt: 'Fizeste as contas do SLA composto e uma só região dá 99,93% — abaixo do contratado. Como corriges o desenho?',
      options: [
        {
          id: 'a',
          label: 'Segunda região com App Service e Azure Front Door a distribuir tráfego',
          correct: true,
          feedback: 'Exacto. Serviços em série multiplicam SLAs (sempre para baixo); redundância em paralelo é a única forma de subir. Front Door dá routing global L7, health probes, failover automático e WAF na borda. Duas regiões UE mantêm a DPO satisfeita.',
          revealArtifacts: ['redundancia-storage'],
        },
        {
          id: 'b',
          label: 'Subir o App Service para Isolated (ASE) — tier mais alto tem melhor SLA',
          correct: false,
          feedback: 'O SLA do App Service é 99,95% em Premium e em Isolated — o tier sobe o isolamento e o preço, não o número do SLA. Estarias a pagar muito mais para continuar a falhar o contrato.',
        },
        {
          id: 'c',
          label: 'Assumir o risco e negociar 99,9% com o board',
          correct: false,
          feedback: 'O requisito veio assinado pelo board. Redesenhar os requisitos em vez da arquitectura é o que te tira a segunda apresentação. Se o número fosse negociável, seria dito antes.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'Agora a base de dados. O legado tem 47 stored procedures, 12 SQL Agent Jobs, cross-database queries e 2 CLR assemblies. Qual serviço?',
      revealArtifacts: ['opcoes-db'],
      options: [
        {
          id: 'a',
          label: 'Azure SQL Managed Instance — compatibilidade quase total com SQL Server',
          correct: true,
          feedback: 'Correcto. SQL Agent Jobs, cross-database queries e CLR são exactamente as funcionalidades que a SQL Database (single) NÃO suporta e que a Managed Instance suporta. É o destino natural de um lift-and-shift de SQL Server com legado, sem herdares a gestão do SO.',
        },
        {
          id: 'b',
          label: 'Azure SQL Database (single database) no tier Business Critical',
          correct: false,
          feedback: 'Falha em três requisitos concretos: não tem SQL Agent (terias de reescrever 12 jobs em Elastic Jobs/Logic Apps), não faz cross-database queries nativas, e não suporta CLR. Reescrever 47 SPs e 2 CLRs não cabe em 7 meses.',
        },
        {
          id: 'c',
          label: 'SQL Server numa VM — compatibilidade total, garantido',
          correct: false,
          feedback: 'Compatibilidade máxima, mas volta a pôr patching, backups e Always On Availability Groups nas mãos de 4 pessoas. A Managed Instance dá-te a mesma compatibilidade sem o fardo operacional — só escolhes VM se precisares de acesso ao SO ou de funcionalidades que nem a MI tem.',
        },
      ],
      teachingNote: 'No AZ-305, requisitos de compatibilidade (Agent Jobs, CLR, cross-DB, Service Broker) são o sinal clássico que aponta para Managed Instance em vez de SQL Database.',
    },
    {
      id: 'step-4',
      prompt: 'RPO de 15 minutos e RTO de 1 hora, com dados sempre na UE. Como desenhas a continuidade da base de dados?',
      options: [
        {
          id: 'a',
          label: 'Auto-failover group entre North Europe e West Europe (RPO 5s, RTO 1h)',
          correct: true,
          feedback: 'Certo, e repara que o requisito passa com folga: RPO de 5 segundos contra os 15 minutos exigidos, e RTO dentro da hora. O failover group dá um listener endpoint que redirecciona automaticamente — a app não muda connection string. E ambas as regiões são UE, portanto a DPO assina.',
          revealArtifacts: ['custo-estimado'],
        },
        {
          id: 'b',
          label: 'Backups geo-redundantes com restore point-in-time',
          correct: false,
          feedback: 'Restaurar 520 GB a partir de backup demora várias horas — rebentas o RTO de 1 hora com folga. Backups são a tua rede de segurança contra corrupção lógica e ransomware, não um mecanismo de failover.',
        },
        {
          id: 'c',
          label: 'Failover group entre North Europe e East US, para máxima separação geográfica',
          correct: false,
          feedback: 'Tecnicamente resiliente e legalmente inaceitável. Replicar dados pessoais para os EUA é uma transferência internacional (RGPD art. 44.º) e a DPO avisou que é finding crítico. A separação geográfica dentro da UE já é suficiente.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: 'Faltam os 4,2 TB de imagens e faturas do NAS. Que SKU de storage escolhes?',
      options: [
        {
          id: 'a',
          label: 'Blob Storage RA-GZRS, com lifecycle policy para mover faturas antigas para Cool/Archive',
          correct: true,
          feedback: 'Excelente. GZRS protege contra falha de zona E de região, e o "RA" permite servir leituras da região secundária durante um incidente. A lifecycle policy trata do custo: imagens de produto ficam Hot, faturas com mais de 90 dias descem para Cool e depois Archive. O par North Europe ⇄ West Europe mantém tudo na UE.',
        },
        {
          id: 'b',
          label: 'Azure Files Premium montado como share, igual ao NAS actual',
          correct: false,
          feedback: 'É o lift-and-shift confortável, mas caro e desajustado: são ficheiros servidos por HTTP a clientes web, não um share SMB para servidores. Blob + CDN serve isto por uma fracção do preço e com muito melhor performance global.',
        },
        {
          id: 'c',
          label: 'Blob Storage LRS — mais barato, e já temos backup dos ficheiros',
          correct: false,
          feedback: 'LRS só protege contra falha de disco dentro de um datacenter. Se a região cai, o site fica sem imagens nem faturas justamente durante o incidente em que precisas de continuidade. Poupas ~120€/mês e comprometes o SLA que acabaste de vender ao board.',
        },
      ],
      teachingNote: 'Regra prática de redundância: ZRS protege contra falha de zona, GRS/GZRS contra falha de região. Só acrescenta "RA-" quando precisas mesmo de LER da secundária — caso contrário estás a pagar por uma capacidade que não usas.',
    },
    {
      id: 'step-6',
      prompt: 'Último ponto: a Black Friday traz 8x o tráfego durante 72 horas. Como o resolves sem inflacionar a factura o ano inteiro?',
      revealArtifacts: ['autoscale-blackfriday'],
      options: [
        {
          id: 'a',
          label: 'Autoscale por métrica + perfil agendado para a janela da Black Friday',
          correct: true,
          feedback: 'É a combinação certa. O perfil agendado eleva o mínimo antes do pico (evitas o atraso do arranque a frio quando a campanha abre), e as regras por CPU tratam da variação dentro da janela. Fora dessas 72 horas voltas à capacidade base e não pagas pelo pico.',
        },
        {
          id: 'b',
          label: 'Dimensionar permanentemente para o pico — simples e sem risco',
          correct: false,
          feedback: 'Pagas 8x a capacidade durante 365 dias para cobrir 3. Com o CFO na sala a pedir optimização de custo, esta é a proposta que mata a apresentação — e o overprovisioning permanente é o anti-padrão clássico de quem traz mentalidade de datacenter para a cloud.',
        },
        {
          id: 'c',
          label: 'Autoscale reactivo por CPU apenas, sem agendamento',
          correct: false,
          feedback: 'Quase certo, e falha no momento pior. O autoscale reage depois de a métrica disparar e cada instância demora a arrancar; nos primeiros minutos da campanha — precisamente quando toda a gente entra ao mesmo tempo — o site degrada. O perfil agendado existe para cobrir picos que já sabes que vêm.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'Não há aqui uma avaria a corrigir: o exercício do AZ-305 é derivar uma arquitectura a partir de restrições em conflito. As três que comandaram todas as decisões foram (1) o SLA de 99,99%, que obriga a redundância multi-região porque serviços em série só descem o número composto; (2) o legado SQL Server com Agent Jobs, cross-database queries e CLR, que elimina a SQL Database e aponta para Managed Instance; e (3) a residência de dados na UE, que restringe o par de regiões a North Europe ⇄ West Europe.',
    fix: 'Desenho final: Azure Front Door (WAF na borda) a distribuir tráfego entre App Service Premium v3 em North Europe e West Europe; Azure SQL Managed Instance Business Critical com auto-failover group entre as duas regiões (RPO 5s, RTO 1h — ambos dentro do exigido); Blob Storage RA-GZRS com lifecycle policy Hot→Cool→Archive para os 4,2 TB de ficheiros; autoscale por CPU com perfil agendado para a janela da Black Friday. Custo estimado ~7 000 €/mês, com a réplica geo da base de dados a representar cerca de metade — justificada por ser a única forma de cumprir o RTO contratado.',
    preventions: [
      'Apresentar o cálculo do SLA composto ao board por escrito — é o argumento que sustenta o custo da segunda região',
      'Testar o failover a sério: agendar um teste de failover group por trimestre, em janela controlada. DR nunca testado é DR que não existe',
      'Azure Policy que negue a criação de recursos fora de regiões UE, para que a conformidade não dependa de disciplina humana',
      'Alertas em Azure Monitor sobre o lag de replicação do failover group — se o lag crescer, o RPO deixa de ser cumprido em silêncio',
      'Rever a lifecycle policy do blob ao fim de 6 meses com dados reais de acesso, em vez de assumir os 90 dias iniciais',
      'Documentar as decisões num ADR (Architecture Decision Record), incluindo as alternativas rejeitadas e porquê — é o que salva o próximo arquitecto',
    ],
  },
};
