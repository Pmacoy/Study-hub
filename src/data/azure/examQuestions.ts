import type { Question } from '../../types/exam';

export const ALL_QUESTIONS: Question[] = [
  // IDENTIDADE
  {
    id: 1,
    topic: 'identity',
    topicLabel: 'Entra ID',
    question:
      'Um utilizador precisa repor a sua própria palavra-passe sem contactar o suporte de TI. Qual funcionalidade do Azure Entra ID deve ser ativada?',
    options: [
      'Azure MFA',
      'Self-Service Password Reset (SSPR)',
      'Privileged Identity Management',
      'Conditional Access Policy',
    ],
    correctIndex: 1,
    explanation:
      'O SSPR permite que os utilizadores redefinam as suas palavras-passe de forma autónoma. Requer licença Premium P1 ou P2.',
    difficulty: 'easy',
  },
  {
    id: 2,
    topic: 'identity',
    topicLabel: 'Entra ID',
    question:
      'Qual é a diferença entre grupos "Assigned" e "Dynamic" no Azure Entra ID?',
    options: [
      'Não há diferença funcional entre eles',
      '"Assigned" requer licença Premium P2; "Dynamic" não requer licença',
      '"Assigned" é gerido manualmente; "Dynamic" adiciona/remove membros automaticamente por regras de atributos',
      '"Dynamic" só funciona com utilizadores externos (Guest)',
    ],
    correctIndex: 2,
    explanation:
      'Grupos "Dynamic" usam regras baseadas em atributos (ex: departamento, cargo) para gerir a membros automaticamente, eliminando trabalho manual. Requerem licença P1.',
    difficulty: 'medium',
  },
  {
    id: 3,
    topic: 'identity',
    topicLabel: 'Entra ID',
    question:
      'Qual licença do Azure Entra ID é necessária para usar Conditional Access Policies?',
    options: ['Free', 'Microsoft 365 E3', 'Premium P1 ou P2', 'Premium P2 apenas'],
    correctIndex: 2,
    explanation:
      'As Conditional Access Policies requerem no mínimo licença Azure Entra ID Premium P1. P2 adiciona funcionalidades como Identity Protection.',
    difficulty: 'medium',
  },

  // GOVERNANCE & RBAC
  {
    id: 4,
    topic: 'governance',
    topicLabel: 'Governança',
    question:
      'Uma Azure Policy com efeito "Deny" é aplicada a uma Subscription. Um utilizador com a role "Owner" tenta criar um recurso que viola a policy. O que acontece?',
    options: [
      'O Owner consegue criar o recurso pois tem permissões máximas',
      'A policy bloqueia o recurso mesmo que o utilizador seja Owner',
      'O sistema pede confirmação adicional, mas permite a criação',
      'A policy só bloqueia utilizadores com role Reader ou Contributor',
    ],
    correctIndex: 1,
    explanation:
      'Azure Policy é CUMULATIVA e aplica-se a TODOS, incluindo Owners. RBAC define QUEM pode fazer; Policy define O QUÊ pode ser feito. São camadas independentes.',
    difficulty: 'hard',
  },
  {
    id: 5,
    topic: 'governance',
    topicLabel: 'Governança',
    question:
      'Um Resource Lock "ReadOnly" é aplicado a um Resource Group. Qual das seguintes ações será PERMITIDA?',
    options: [
      'Eliminar uma VM dentro do Resource Group',
      'Adicionar uma nova Storage Account ao Resource Group',
      'Ler as propriedades e métricas de uma VM existente',
      'Reiniciar uma VM existente',
    ],
    correctIndex: 2,
    explanation:
      'O lock "ReadOnly" só permite operações de leitura (GET). Ações de escrita, criação ou eliminação são bloqueadas. Até o Restart de VM (que modifica estado) é bloqueado.',
    difficulty: 'medium',
  },
  {
    id: 6,
    topic: 'rbac',
    topicLabel: 'RBAC',
    question:
      'Qual é a diferença fundamental entre as roles "Owner" e "Contributor" no Azure RBAC?',
    options: [
      'Owner pode criar mais tipos de recursos que Contributor',
      'Owner tem acesso a mais regiões que Contributor',
      'Contributor pode gerir todos os recursos MAS não pode gerir atribuições de acesso (IAM)',
      'Contributor não pode apagar recursos, apenas criar e modificar',
    ],
    correctIndex: 2,
    explanation:
      'A diferença crítica: Owner tem "Microsoft.Authorization/*/Write", permitindo gerir quem tem acesso. Contributor pode fazer tudo com recursos mas NÃO pode alterar permissões RBAC.',
    difficulty: 'medium',
  },
  {
    id: 7,
    topic: 'rbac',
    topicLabel: 'RBAC',
    question:
      'Um utilizador tem a role "Reader" na Subscription e "Contributor" num Resource Group específico. Qual é o nível de acesso efetivo no Resource Group?',
    options: [
      'Reader, pois a permissão mais restritiva prevalece',
      'Contributor, pois as permissões são cumulativas e a mais permissiva aplica-se',
      'Nenhuma permissão, pois as roles conflituam e se anulam',
      'Depende de como a Azure Policy está configurada',
    ],
    correctIndex: 1,
    explanation:
      'No Azure RBAC, as permissões são ADITIVAS. O utilizador terá as permissões de Reader (herdadas da Subscription) MAIS as de Contributor no Resource Group. O resultado efetivo é Contributor no RG.',
    difficulty: 'hard',
  },

  // STORAGE
  {
    id: 8,
    topic: 'storage',
    topicLabel: 'Armazenamento',
    question:
      'Uma empresa precisa de garantir que os seus dados permanecem disponíveis para leitura MESMO que a região primária do Azure fique completamente indisponível. Qual opção de redundância deve escolher?',
    options: [
      'LRS (Locally-Redundant Storage)',
      'ZRS (Zone-Redundant Storage)',
      'GRS (Geo-Redundant Storage)',
      'RA-GRS (Read-Access Geo-Redundant Storage)',
    ],
    correctIndex: 3,
    explanation:
      'O RA-GRS replica os dados para uma região secundária (como GRS) E disponibiliza um endpoint de leitura permanentemente activo na região secundária. Com GRS normal, a leitura na região secundária só é possível após failover.',
    difficulty: 'medium',
  },
  {
    id: 9,
    topic: 'storage',
    topicLabel: 'Armazenamento',
    question:
      'Qual nível de redundância de Storage oferece a MAIOR proteção, combinando proteção por zonas na região primária com replicação geográfica?',
    options: ['GRS', 'ZRS', 'GZRS', 'RA-GRS'],
    correctIndex: 2,
    explanation:
      'GZRS (Geo-Zone-Redundant Storage) combina ZRS na região primária (3 zonas) com replicação assíncrona para uma região secundária, oferecendo o mais alto nível de durabilidade e disponibilidade.',
    difficulty: 'medium',
  },
  {
    id: 10,
    topic: 'storage',
    topicLabel: 'Armazenamento',
    question:
      'Um developer precisa de dar acesso temporário (2 horas) a um blob específico a um utilizador externo, sem partilhar a chave da conta. Qual é a melhor abordagem?',
    options: [
      'Criar um novo utilizador no Entra ID com acesso ao Storage',
      'Tornar o blob público temporariamente',
      'Gerar um Shared Access Signature (SAS) com tempo de expiração',
      'Usar Azure AD B2C para autenticação externa',
    ],
    correctIndex: 2,
    explanation:
      'SAS (Shared Access Signature) é a solução ideal: permite delegar acesso granular (a um blob, container, etc.) com tempo de expiração, sem expor a chave da conta.',
    difficulty: 'easy',
  },

  // COMPUTE
  {
    id: 11,
    topic: 'compute',
    topicLabel: 'Computação',
    question:
      'Qual SLA de uptime garante o Azure para VMs distribuídas em Availability Zones?',
    options: ['99.9%', '99.95%', '99.99%', '100%'],
    correctIndex: 2,
    explanation:
      'VMs em Availability Zones distintas garantem SLA de 99.99%. Availability Sets (mesmo datacenter, racks diferentes) garantem 99.95%. Uma única VM com Premium SSD garante 99.9%.',
    difficulty: 'easy',
  },
  {
    id: 12,
    topic: 'compute',
    topicLabel: 'Computação',
    question:
      'Qual é a diferença entre "Scale Out" e "Scale Up" no contexto de VM Scale Sets?',
    options: [
      '"Scale Out" aumenta o tamanho das VMs; "Scale Up" adiciona mais VMs',
      '"Scale Out" adiciona mais instâncias de VM (horizontal); "Scale Up" aumenta os recursos de uma VM (vertical)',
      'São termos equivalentes no contexto do Azure',
      '"Scale Out" é automático; "Scale Up" é sempre manual',
    ],
    correctIndex: 1,
    explanation:
      'Scale Out = horizontal (mais instâncias). Scale Up = vertical (VM maior). VMSS foca em Scale Out automático baseado em métricas como CPU. Scale Up tipicamente requer downtime para resize.',
    difficulty: 'easy',
  },
  {
    id: 13,
    topic: 'compute',
    topicLabel: 'Computação',
    question:
      'Um Availability Set é configurado com 3 Fault Domains e 5 Update Domains. Quantas VMs podem ser afetadas simultaneamente durante uma atualização planeada pela Microsoft?',
    options: [
      'Até 3 VMs (um Fault Domain inteiro)',
      'Apenas 1 VM por Update Domain',
      'Todas as VMs no mesmo Update Domain',
      'Não há impacto durante atualizações com Availability Sets',
    ],
    correctIndex: 2,
    explanation:
      'Durante manutenção planeada, o Azure reinicia as VMs por Update Domain. Todas as VMs no mesmo Update Domain são afetadas em simultâneo, mas nunca dois Update Domains ao mesmo tempo.',
    difficulty: 'hard',
  },

  // CONTAINERS
  {
    id: 14,
    topic: 'containers',
    topicLabel: 'Containers & PaaS',
    question:
      'Qual serviço Azure deve ser usado para executar um único container de forma rápida e simples, sem gerir infraestrutura de orquestração?',
    options: [
      'Azure Kubernetes Service (AKS)',
      'Azure Container Instances (ACI)',
      'Azure App Service',
      'Azure Container Registry',
    ],
    correctIndex: 1,
    explanation:
      'ACI é a forma mais rápida de executar containers no Azure sem gerir servidores ou clusters. Ideal para tasks isoladas, CI/CD, e workloads de curta duração. AKS é para orquestração complexa com múltiplos containers.',
    difficulty: 'easy',
  },
  {
    id: 15,
    topic: 'containers',
    topicLabel: 'Containers & PaaS',
    question:
      'O custo de uma aplicação web no Azure App Service está associado a qual componente?',
    options: [
      'Ao número de pedidos HTTP recebidos por mês',
      'Ao App Service Plan (que define CPU e RAM), não ao número de Apps',
      'A cada Web App individualmente, independentemente do plano',
      'Ao número de utilizadores ativos na aplicação',
    ],
    correctIndex: 1,
    explanation:
      'O App Service Plan define os recursos computacionais e é o que é cobrado. Múltiplas Web Apps podem correr no mesmo plano sem custo adicional, partilhando os recursos. A granulação de custo é o plano, não a app.',
    difficulty: 'medium',
  },

  // NETWORKING
  {
    id: 16,
    topic: 'vnet',
    topicLabel: 'Redes',
    question:
      'A VNet-A tem peering com VNet-B, e VNet-B tem peering com VNet-C. Sem configuração adicional, a VNet-A consegue comunicar com VNet-C?',
    options: [
      'Sim, o peering é transitivo por padrão',
      'Não, o VNet Peering NÃO é transitivo — é necessário peering direto entre A e C',
      'Sim, mas apenas em tráfego de saída (egress)',
      'Depende do tipo de peering (Global vs Local)',
    ],
    correctIndex: 1,
    explanation:
      'VNet Peering NÃO é transitivo. Esta é uma das perguntas favoritas da prova AZ-104. Para que A comunique com C, é necessário criar um peering direto A<->C, ou usar Azure VPN Gateway com "Allow Gateway Transit".',
    difficulty: 'medium',
  },
  {
    id: 17,
    topic: 'vnet',
    topicLabel: 'Redes',
    question:
      'Duas regras NSG existem: Prioridade 100 (Allow TCP 80) e Prioridade 200 (Deny TCP 80). Qual é o resultado para tráfego na porta 80?',
    options: [
      'O tráfego é negado, pois regras Deny sempre prevalecem',
      'O tráfego é permitido, pois a regra com menor número (100) é processada primeiro',
      'As regras conflituam e o tráfego é bloqueado por padrão',
      'Depende se a regra é aplicada à Subnet ou à NIC',
    ],
    correctIndex: 1,
    explanation:
      'Em NSGs, números menores = maior prioridade. A regra 100 (Allow) é processada antes da 200 (Deny). O tráfego na porta 80 será PERMITIDO. É crucial lembrar que as regras são avaliadas em ordem crescente de prioridade.',
    difficulty: 'medium',
  },
  {
    id: 18,
    topic: 'vnet',
    topicLabel: 'Redes',
    question:
      'Uma empresa quer dar acesso RDP e SSH às VMs de produção sem expor IPs públicos a essas VMs. Qual serviço Azure resolve este problema?',
    options: [
      'Azure VPN Gateway com conexão Point-to-Site',
      'Network Security Group com regra Allow na porta 3389',
      'Azure Bastion — acesso RDP/SSH via browser sem IP público na VM',
      'Azure Load Balancer com regra de NAT Inbound',
    ],
    correctIndex: 2,
    explanation:
      'Azure Bastion permite acesso RDP/SSH seguro através do portal Azure (HTML5/TLS), sem necessidade de IP público nas VMs. Requer uma subnet dedicada chamada "AzureBastionSubnet".',
    difficulty: 'easy',
  },
  {
    id: 19,
    topic: 'vnet',
    topicLabel: 'Redes',
    question:
      'Qual a diferença entre Azure Load Balancer (Layer 4) e Azure Application Gateway (Layer 7)?',
    options: [
      'Load Balancer é mais caro; Application Gateway é a opção gratuita',
      'Load Balancer distribui tráfego TCP/UDP; Application Gateway entende HTTP/HTTPS e pode rotear por URL/path',
      'Application Gateway só funciona com backends no Azure; Load Balancer funciona com qualquer backend',
      'Não há diferença funcional, apenas diferença de escala',
    ],
    correctIndex: 1,
    explanation:
      'Load Balancer opera na camada 4 (TCP/UDP) — rápido mas "cego" ao conteúdo HTTP. Application Gateway opera na camada 7 — entende URLs, pode fazer path-based routing e inclui WAF (Web Application Firewall).',
    difficulty: 'medium',
  },

  // MONITOR
  {
    id: 20,
    topic: 'monitor',
    topicLabel: 'Monitor & Backup',
    question:
      'Qual ferramenta do Azure Monitor deve ser usada para verificar se uma regra de NSG está a bloquear o tráfego de rede?',
    options: [
      'Azure Monitor Metrics',
      'Log Analytics Workspace',
      'Network Watcher - IP Flow Verify',
      'Azure Advisor',
    ],
    correctIndex: 2,
    explanation:
      'O "IP Flow Verify" do Azure Network Watcher testa se o tráfego de/para uma VM é permitido ou negado pelas regras NSG, mostrando qual regra específica está a tomar a decisão.',
    difficulty: 'medium',
  },
  {
    id: 21,
    topic: 'monitor',
    topicLabel: 'Monitor & Backup',
    question:
      'Um administrador configura uma Alert Rule no Azure Monitor para disparar quando a CPU > 90%. Qual componente define O QUE FAZER quando o alerta dispara (enviar email, executar runbook)?',
    options: [
      'Azure Policy',
      'Log Analytics Workspace',
      'Action Group',
      'Azure Advisor Recommendation',
    ],
    correctIndex: 2,
    explanation:
      'A Alert Rule define a CONDIÇÃO (CPU > 90%). O Action Group define as AÇÕES (enviar email, SMS, chamar webhook, executar Azure Function ou Runbook). São componentes separados e reutilizáveis.',
    difficulty: 'easy',
  },
  {
    id: 22,
    topic: 'monitor',
    topicLabel: 'Monitor & Backup',
    question:
      'Qual é a diferença entre Azure Backup e Azure Site Recovery (ASR)?',
    options: [
      'Azure Backup é para servidores físicos; ASR é para VMs',
      'Backup é para retenção/restauro de dados a longo prazo; ASR é para replicação contínua e failover rápido de VMs',
      'São serviços equivalentes armazenados no mesmo vault',
      'ASR requer um agente instalado; Backup não requer agente',
    ],
    correctIndex: 1,
    explanation:
      'Azure Backup: protege contra perda de dados (ficheiros apagados, corrupção), retenção longa. Azure Site Recovery: continuidade de negócio — replica VMs para outra região em tempo real e permite failover em minutos se um datacenter cair.',
    difficulty: 'medium',
  },
  {
    id: 23,
    topic: 'monitor',
    topicLabel: 'Monitor & Backup',
    question:
      'O que é "Soft Delete" no contexto do Azure Recovery Services Vault?',
    options: [
      'Um método de encriptação dos backups em repouso',
      'Uma funcionalidade que retém dados de backup por 14 dias após eliminação, protegendo contra exclusão acidental ou ransomware',
      'Uma forma de backup incremental que ocupa menos espaço',
      'Um método de comprimir dados antigos automaticamente',
    ],
    correctIndex: 1,
    explanation:
      'Soft Delete mantém os dados de backup por 14 dias gratuitos mesmo após serem "eliminados", permitindo recuperação. É uma proteção crítica contra ransomware que tente eliminar os backups. Está ativo por padrão nos novos vaults.',
    difficulty: 'medium',
  },

  // EXTRA QUESTIONS
  {
    id: 24,
    topic: 'governance',
    topicLabel: 'Governança',
    question:
      'Qual é a hierarquia correta de escopos no Azure, do mais abrangente para o mais específico?',
    options: [
      'Subscription > Management Group > Resource Group > Resource',
      'Management Group > Subscription > Resource Group > Resource',
      'Resource Group > Subscription > Management Group > Resource',
      'Management Group > Resource Group > Subscription > Resource',
    ],
    correctIndex: 1,
    explanation:
      'A hierarquia é: Management Group > Subscription > Resource Group > Resource. Policies e RBAC definidos num nível superior são herdados pelos níveis inferiores.',
    difficulty: 'easy',
  },
  {
    id: 25,
    topic: 'identity',
    topicLabel: 'Entra ID',
    question:
      'O que são "Guest Users" (Utilizadores Convidados) no Azure Entra ID?',
    options: [
      'Utilizadores sem MFA configurado',
      'Utilizadores com acesso temporário de 24 horas ao tenant',
      'Utilizadores externos (de outros tenants ou com contas pessoais) convidados através do Azure AD B2B',
      'Utilizadores com role "Reader" atribuída a nível de Subscription',
    ],
    correctIndex: 2,
    explanation:
      'Guest Users são convidados via Azure AD B2B (Business-to-Business). Têm o User Type "Guest" e podem ser de outros tenants Azure AD ou usar contas pessoais (Gmail, etc.). Permitem colaboração segura com externos.',
    difficulty: 'medium',
  },
  {
    id: 26,
    topic: 'storage',
    topicLabel: 'Armazenamento',
    question:
      'Uma empresa tem dados de logs que raramente são acedidos após 30 dias mas devem ser mantidos por 7 anos por razões legais. Qual camada (tier) de storage é mais económica para esses dados?',
    options: ['Hot', 'Cool', 'Archive', 'Premium'],
    correctIndex: 2,
    explanation:
      'A camada Archive tem o menor custo de armazenamento, mas maior latência de acesso (horas para rehidratar os dados). Ideal para dados que raramente são acedidos mas precisam de ser retidos por longos períodos (compliance, auditorias).',
    difficulty: 'medium',
  },
  {
    id: 27,
    topic: 'vnet',
    topicLabel: 'Redes',
    question:
      'Qual é a diferença entre VPN Gateway (Site-to-Site) e Azure ExpressRoute?',
    options: [
      'VPN Gateway é mais rápido; ExpressRoute é mais barato',
      'VPN Gateway trafega pela internet pública (encriptado); ExpressRoute usa uma ligação privada dedicada ao datacenter da Microsoft',
      'ExpressRoute só está disponível nos EUA; VPN Gateway é global',
      'Não há diferença técnica, apenas no preço e SLA',
    ],
    correctIndex: 1,
    explanation:
      'VPN Gateway: ligação encriptada pela internet pública — adequada para a maioria dos cenários. ExpressRoute: ligação privada dedicada (fibra óptica) diretamente ao Azure, sem passar pela internet. Oferece maior bandwidth, menor latência e SLA mais elevado.',
    difficulty: 'medium',
  },
  {
    id: 28,
    topic: 'compute',
    topicLabel: 'Computação',
    question: 'O que é um Azure Resource Manager (ARM) Template?',
    options: [
      'Uma interface gráfica para criar recursos no Azure Portal',
      'Um ficheiro JSON que define a infraestrutura Azure de forma declarativa (Infrastructure as Code)',
      'Uma ferramenta de monitorização de recursos ARM',
      'Um relatório de custos gerado automaticamente pelo Azure',
    ],
    correctIndex: 1,
    explanation:
      'ARM Templates são ficheiros JSON que definem a infraestrutura como código (IaC). Permitem deployments repetíveis, versionáveis e automatizados. São a base de deployment no Azure (Bicep é a evolução mais moderna).',
    difficulty: 'easy',
  },
  {
    id: 29,
    topic: 'monitor',
    topicLabel: 'Monitor & Backup',
    question:
      'Qual linguagem de query é usada no Log Analytics Workspace para pesquisar e analisar logs?',
    options: [
      'SQL (Structured Query Language)',
      'KQL (Kusto Query Language)',
      'PowerShell Script',
      'JSONPath',
    ],
    correctIndex: 1,
    explanation:
      'KQL (Kusto Query Language) é usada no Log Analytics e Azure Data Explorer. Sintaxe baseada em pipes: Tabela | where condição | summarize agregação. É fundamental para a prova AZ-104.',
    difficulty: 'easy',
  },
  {
    id: 30,
    topic: 'rbac',
    topicLabel: 'RBAC',
    question:
      'Qual é o escopo mínimo recomendado para atribuir roles RBAC, seguindo o princípio do menor privilégio?',
    options: [
      'Sempre a nível de Management Group para facilitar gestão',
      'A nível de Subscription para cobrir todos os Resource Groups',
      'O escopo mais específico possível (ex: Resource Group ou Resource individual) que satisfaça o requisito',
      'Não importa o escopo, pois o RBAC é controlado pelas policies',
    ],
    correctIndex: 2,
    explanation:
      'O Princípio do Menor Privilégio (Principle of Least Privilege) determina que se deve conceder apenas as permissões necessárias, no escopo mais restrito possível. Atribuir roles no escopo mais alto aumenta o risco.',
    difficulty: 'medium',
  },
];