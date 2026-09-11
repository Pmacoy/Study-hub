import type { Scenario } from '../../types/scenario';

/**
 * AZ-305 — Identity, Governance & Monitoring
 * Case study focado em: Entra ID, Conditional Access, RBAC, Azure Policy, Monitor, Log Analytics
 * Domínios cobertos: governança multi-cloud, compliance, observabilidade
 */
export const az305IdentityMonitoringFocusScenario: Scenario = {
  id: 'az305-identity-monitoring-focus',
  domain: 'azure',
  format: 'guided',
  title: 'Auditoria SAS na TeleSaud — NBFC Industries Group, governança multi-cloud',
  hook: 'A TeleSaud é um grupo de 5 empresas de saúde em PT (clinicas, laboratório, farmácia online, telemedicina, logística de medicamentos). Cada empresa tem o seu tenant Entra ID e a sua subscription Azure. O CEO quer unificar tudo num tenant único com RBAC granular e monitorização centralizada — porque a auditoria SAS pediu evidência de controlo de acessos e não há logs suficientes. A DPO adicionou: "preciso de saber em tempo real quem acedeu a dados de pacientes, de que subscription, e se o acesso era legítimo".',
  difficulty: 'senior',
  timeEstimateMin: 14,
  tags: ['azure', 'az-305', 'identity', 'governance', 'monitoring', 'entra-id', 'rbac'],

  contextArtifacts: [
    {
      id: 'estado-actual',
      label: 'Estado actual — 5 tenants, 5 subscriptions',
      language: 'text',
      content: `TENANT                   SUBSCRIPTIONS     UTILIZADORES  GRUPOS
─────────────────────────────────────────────────────────────────────
ClinicasSaud (original)  Prod + Dev          180           4
LabDiagnostica           Prod                45            2
FarmOnline                Prod               30            1
TeleMed                  Prod + Staging      25            3
LogiMed                  Prod                20            1

PROBLEMAS DOCUMENTADOS PELA AUDITORIA:
  ✗ Não existe política de MFA consistente — 3 de 5 tenants têm MFA desactivado
  ✗ Utilizadores com Access Reviews nunca revistos (última revisão: há 14 meses)
  ✗ 12 contas de service principal com credenciais expiradas e permissões elevadas
  ✗ 7 contas de ex-funcionários ainda activas (offboarding manual, sem automação)
  ✗ Logs de auditoria apenas retidos 30 dias — retenção SAS exige 2 anos
  ✗ Nenhum alerta configurado para acessos anómalos`,
    },
    {
      id: 'requisitos-auditoria',
      label: 'Requisitos da auditoria SAS (extracto)',
      language: 'text',
      content: `CONTROLO DE ACESSOS
  a) MFA obrigatório para todos os acessos a dados de pacientes
  b) Access Reviews trimestrais para contas com acesso a dados sensíveis
  c) Offboarding automático: desactivação em < 24h após saída
  d) Service principals: rotação de credenciais a cada 90 dias

LOGS E MONITORIZAÇÃO
  e) Retenção mínima de logs de auditoria: 2 anos
  f) Alertas para: login fora de horário, access pattern anómalo, elevation de permissões
  g) Dashboard de compliance acessível à DPO em tempo real
  h) Correlação entre auditoria Entra ID e auditoria Azure Resource`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'custo-consolidacao',
      label: 'Estimativa de custo — consolidação para tenant único',
      language: 'text',
      content: `Componente                               Mensal (€)
────────────────────────────────────────  ──────────
Entra ID P2 (300 utilizadores × €9/user)  ~€2 700
  · Conditional Access (MFA, risk-based)
  · Access Reviews (trimestral)
  · PIM (Privileged Identity Management)
Log Analytics Workspace                    ~€200
  · 50 GB/dia estimado (logs Entra + Azure)
  · Retenção 730 dias (2 anos)
Azure Monitor (alerts + action groups)     ~€50
Microsoft Sentinel (SIEM)                  ~€3 000
  · 10k events/segundo (5 tenants → 1)
  · Retenção 2 anos
  · Workbooks de compliance
────────────────────────────────────────  ──────────
TOTAL                                    ≈ €6 000/mês

Nota: o Sentinel é caro mas é o único serviço que resolve (e)+(f)+(g)+(h)
de uma só vez. Sem ele, precisarias de Azure Monitor + Logic Apps +
Power Automate para atingir o mesmo — e ficaria mais caro e mais frágil.`,
    },
    {
      id: 'pim-diagrama',
      label: 'Privileged Identity Management — ciclo de vida',
      language: 'text',
      content: `PIM é "just-in-time admin access" — ninguém tem permissões elevadas permanentemente.

CICLO DE VIDA:
  1. Admin precisa de acesso elevado
  2. Abre PIM → pede role assignment (ex: "Contributor" na sub Prod)
  3. Aprovação automática ou manual (depende da role)
  4. Acesso activo por duração limitada (ex: 4 horas)
  5. Acesso expira automaticamente
  6. Log completo: quem pediu, quem aprovou, quando, por quanto tempo

ROLES CRÍTICAS (requerem aprovação manual):
  · Owner (subscription)
  · Contributor (subscription)
  · User Access Administrator
  · SQL Security Admin

ROLES DE EMERGÊNCIA (com requireMFAOnActivation):
  · Global Reader (só leitura, mas visível em todos os tenants)
  · Security Reader

DIFERENÇA vs RBAC permanente:
  RBAC: "João é Contributor EM TEMPO INTEIRO" → riesgo 24/7
  PIM:  "João pode pedir Contributor por 4h quando precisar" → riesgo controlado`,
    },
    {
      id: 'conditional-access-matrix',
      label: 'Matriz Conditional Access — cenários da TeleSaud',
      language: 'text',
      content: `POLÍTICA                          QUANDO                           RESULTADO
─────────────────────────────────────────────────────────────────────────────────
MFA obrigatório                   Login a dados de pacientes        Bloquear se sem MFA
                                  (app: Portal de Gestão)
Geofencing                        Login fora da UE (IP externo)     Bloquear imediatamente
Risk-based (Entra ID Protection)  Login de dispositivo comprometido Bloquear + investigar
Session control                    Acesso de dispositivo não-gerido  App-only (sem download)
Block legacy auth                  Protocolos IMAP/POP/SMTP         Bloquear sempre
Compliant device                   Acesso a dados financiários       Exigir device compliance
                                                          (Intune)

NOTA: 1 política Conditional Access pode aplicar-se a múltiplos tenants
via "Security Defaults" ou "Entra ID Security Defaults". Mas para
Conditional Access granular, PRECISAS de Entra ID P2 (€9/user/month).

Para 300 utilizadores, o P2 é ~€2.700/mês. Para 30 utilizadores,
€270/mês. O custo escala linearmente — mas a compliance não é opcional.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O CEO quer consolidar 5 tenants num só. Que serviço Entra ID usas para manter separação lógica entre as 5 empresas?',
      options: [
        {
          id: 'a',
          label: 'Entra ID tenant único + Management Groups hierárquicos',
          correct: true,
          feedback: 'Correcto. Management Groups criam hierarquia de governança: um root group, um por empresa, e subscriptions dentro de cada empresa. RBAC herda de cima para baixo. Podes ter políticas "pai" (MFA obrigatório) que herdadas, e políticas "filho" específicas (política de naming). Tenant único = 1 identity per pessoa = sem confusão de que tenant usar.',
          revealArtifacts: ['pim-diagrama'],
        },
        {
          id: 'b',
          label: 'Manter 5 tenants separados e usar Azure Lighthouse para unificar gestão',
          correct: false,
          feedback: 'Lighthouse é para MSPs gerirem múltiplos clientes. Para um grupo de empresas da mesma organização, dá overhead desnecessário: 5x política de password, 5x MFA, 5x access reviews, 5x logs separados. A DPO quer correlação de logs numa só workspace — impossível com tenants separados.',
        },
        {
          id: 'c',
          label: 'Tenant único + ACL (Access Control Lists) por resource group',
          correct: false,
          feedback: 'ACL não existe como serviço Azure. Estás a confundir com NTFS ACLs (Windows). Em Azure, o controlo de acessos é via RBAC + Entra ID + Conditional Access. A resposta precisa de cobrir identity (quem), não só authorization (o que pode fazer).',
        },
      ],
      teachingNote: 'Management Groups é o "nível acima de subscriptions" no Azure. A hierarquia padrão: Root → Management Group (por empresa) → Subscription (por ambiente) → Resource Group → Resource. Políticas e RBAC herdam para baixo.',
    },
    {
      id: 'step-2',
      prompt: 'MFA obrigatório para acessos a dados de pacientes. Como implementas sem perturbar 300 utilizadores que nunca usaram MFA?',
      options: [
        {
          id: 'a',
          label: 'Conditional Access com fases: 1) push notification 2) phonenumber 3) app compelto',
          correct: true,
          feedback: 'Correcto. O rollout é gradual e reduz fricção: push notification é o mais fácil (1 toque no telemóvel), phone number é fallback para quem não quer app, e Microsoft Authenticator app é o mais seguro. Cada fase valida que a anterior funciona antes de avançar. Eliminar 12 contas de ex-funcionários pode acontecer em paralelo — baixo risco.',
          revealArtifacts: ['conditional-access-matrix'],
        },
        {
          id: 'b',
          label: 'Activar Security Defaults em todos os tenants — é grátis e obriga MFA',
          correct: false,
          feedback: 'Security Defaults é o MFA "tudo ou nada": ou activas para todos, ou não activas. Não podes excluir utilizadores ou grupos. Para 300 pessoas que nunca usaram MFA, activar tudo de uma vez vai gerar apoio ao utilizador caótico e possíveis lockouts. Conditional Access dá granularidade que Security Defaults não tem.',
        },
        {
          id: 'c',
          label: 'Exigir MFA apenas para contas admin — os restantes não precisam',
          correct: false,
          feedback: 'Entra ID Protection estima que 99.9% dos ataques de credential stuffing são bloqueados por MFA — independentemente do nível da conta. Contas de utilizador normal com acesso a dados de pacientes são alvo exacto. "Apenas para admins" não cumpre o requisito SAS nem protege contra ataques.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'Service principals com credenciais expiradas e permissões elevadas. Como evitas que isto volte a acontecer?',
      options: [
        {
          id: 'a',
          label: 'Rotação de credenciais automática via Key Vault + Azure Functions + alertas',
          correct: true,
          feedback: 'Key Vault armazena as credenciais actuais. Azure Functions rota a cada 90 dias (gera nova credencial, actualiza no service principal, actualiza no Key Vault). Alertas disparam se a rotação falhar ou se uma credencial tiver mais de 120 dias. Podes usar Managed Identity em vez de client secrets para eliminars o problema por completo — o Azure gere as credenciais automaticamente.',
          revealArtifacts: ['pim-diagrama'],
        },
        {
          id: 'b',
          label: 'Usar Managed Identity em vez de client secrets — eliminar credenciais manualmente',
          correct: false,
          feedback: 'A resposta está certa para o caso ideal (Managed Identity elimina client secrets), mas MUITO agressiva para esta fase: requer refactoring de todas as aplicações que usam os service principals atuais. Para 12 service principals com aplicações legadas, manter a rotação automática e migrar gradualmente para Managed Identity é mais realista. "Do it right" não significa "do it all now".',
        },
        {
          id: 'c',
          label: 'Adicionar excepção ao Security Defaults para ignorar credenciais expiradas',
          correct: false,
          feedback: 'Isso enfraquece o controlo em vez de o fortalecer. Credenciais expiradas são um vector de ataque (alguns ataques usam credenciais "parcialmente válidas" para bypass). Nunca adicionar excepções por conveniência — era exactamente o padrão que a auditoria identificou como problema.',
        },
      ],
      teachingNote: 'Managed Identity é sempre a primeira pergunta: "este serviço pode usar Managed Identity?". Se sim, client secrets são desnecessários. Se não (serviço externo), Key Vault + rotação automática é o padrão.',
    },
    {
      id: 'step-4',
      prompt: 'Logs de auditoria precisam de 2 anos de retenção e a DPO quer um dashboard de compliance em tempo real. Como desenhas a observabilidade?',
      options: [
        {
          id: 'a',
          label: 'Log Analytics (730 dias retenção) + Microsoft Sentinel + Workbook de compliance',
          correct: true,
          feedback: 'Excelente combinação. Log Analytics faz a retenção (730 dias = 2 anos), Sentinel faz correlação e alertas, e Workbooks dá à DPO um dashboard em tempo real (sem código). Cada componente faz uma coisa bem: retenção ≠ análise ≠ visualização. O Sentinel Workbooks inclui templates prontos para compliance — não precisas de construir nada do zero.',
          revealArtifacts: ['custo-consolidacao'],
        },
        {
          id: 'b',
          label: 'Exportar logs para Storage Account com lifecycle policy — mais barato',
          correct: false,
          feedback: 'Storage Account com lifecycle policy dá retenção barata, mas perdes query capability. A DPO quer "quem acedeu a dados de pacientes, de que subscription, e quando" — isso requer KQL queries que não são possíveis em blobs brutos. Retenção barata sem query é inútil para compliance.',
        },
        {
          id: 'c',
          label: 'Azure Monitor apenas — mais simples e integrado',
          correct: false,
          feedback: 'Azure Monitor faz métricas e alertas, mas não faz correlação cross-service (Entra ID + Azure Activity Log + Resource Logs). Para o requisito da DPO, precisas de correlação — e o único serviço que faz isso nativamente é o Log Analytics + Sentinel. Azure Monitor é o sensor, Log Analytics é a base de dados, Sentinel é o cérebro.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: '7 contas de ex-funcionários ainda activas e offboarding manual. Como automatas?',
      options: [
        {
          id: 'a',
          label: 'SCIM provisioning do HRIS + automação de offboarding via Entra ID + Logic Apps',
          correct: true,
          feedback: 'Correcto. SCIM (System for Cross-domain Identity Management) sincroniza o HRIS (SAP SuccessFactors, Workday, etc.) com Entra ID: quando o HRIS marca alguém como "desligado", Entra ID desactiva a conta automaticamente. Logic Apps adiciona a lógica: desactivar conta → remover de todos os grupos → revogar tokens → remover access assignments → notificar a DPO. O tudo-em-< 24h.',
          revealArtifacts: ['conditional-access-matrix'],
        },
        {
          id: 'b',
          label: 'Access Reviews trimestrais — detecta contas inactivas e remove',
          correct: false,
          feedback: 'Access Reviews são para validar acessos periodicamente, não para automação de offboarding. É um safety net, não o mecanismo primário. O requisito é < 24h após saída — Access Reviews correm trimestralmente, deixando 90 dias de janela.',
        },
        {
          id: 'c',
          label: 'Desactivar contas manualmente quando o HR avisa — mais controle humano',
          correct: false,
          feedback: 'O offboarding manual é exactamente o problema que a auditoria identificou. "Quando o HR avisa" = depende de humores, agendas e processos. 7 contas activas de ex-funcionários são a consequência directa de offboarding manual. Automação não é opcional — é o que a auditoria exige.',
        },
      ],
      teachingNote: 'A sequência de offboarding automatizado: SCIM detecta saída → desactivar conta → revogar tokens → remover roles → notificar gestor + DPO. Cada passo é um passo no Logic App. O todo leva < 10 minutos vs dias/horas no processo manual.',
    },
  ],

  resolution: {
    rootCause: 'A auditoria SAS expôs 5 problemas concretos: (1) sem MFA consistente (3 de 5 tenants não tinham), (2) service principals com credenciais expiradas e permissões elevadas, (3) 7 contas de ex-funcionários activas por offboarding manual, (4) logs retidos apenas 30 dias contra exigência de 2 anos, (5) zero alertas para acessos anómalos. Todos são problemas de GOVERNANÇA — não de tecnologia. O CEO queria "unificar tenants" mas o problema real era controlo de acessos, observabilidade e automação.',
    fix: 'Tenant único Entra ID com Management Groups hierárquicos (Root → Empresas → Subscriptions). Conditional Access com MFA obrigatório (rollout gradual por fases) + geofencing UE + risk-based. PIM para contas admin (just-in-time). SCIM do HRIS para offboarding automático em < 24h. Rotação automática de credenciais via Key Vault. Log Analytics com retenção 730 dias + Microsoft Sentinel para correlação e alertas. Workbook de compliance para a DPO em tempo real. Custo: ~€6.000/mês para 300 utilizadores.',
    preventions: [
      'Política Entra ID que negue criação de service principals sem credencial gerida pelo Azure (Managed Identity)',
      'Azure Policy: "Desactivar utilizadores inactivos > 30 dias" — camada de segurança adicional além do SCIM',
      'Access Reviews mensais (não trimestrais) durante os primeiros 6 meses, depois trimestrais',
      'Dashboard de compliance no Sentinel atualizado semanalmente — incluir contas de service principals com credenciais > 90 dias',
      'Treinar os gestores de cada empresa no PIM — se pedem acesso elevado sem justificação, o pedido é rejeitado automaticamente',
      'Testar o offboarding completo de um utilizador "fantoche" antes do go-live — validação end-to-end do fluxo SCIM',
    ],
  },
};
