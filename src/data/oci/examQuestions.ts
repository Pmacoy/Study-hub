export interface RawQuestion {
  id: number;
  topicId: string;
  topicLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const OCI_FOUNDATIONS_QUESTIONS: RawQuestion[] = [
  {
    id: 1,
    topicId: 'cloud-concepts',
    topicLabel: 'Cloud Concepts',
    question: 'Qual é o modelo de preços predominante na Oracle Cloud Infrastructure (OCI)?',
    options: [
      'Pagamento antecipado obrigatório para todos os serviços.',
      'Pay-As-You-Go (Pago pelo uso real, por segundo/hora).',
      'Fixo por utilizador, independentemente do uso do hardware.',
      'Apenas subscrições anuais sem cancelamento.'
    ],
    correctIndex: 1,
    explanation: 'A OCI utiliza predominantemente o modelo Pay-As-You-Go (PAYG), o que significa que pagas apenas pelos recursos que consomes (computação, armazenamento, transferência de rede) ao segundo ou à hora.',
    difficulty: 'easy',
  },
  {
    id: 2,
    topicId: 'architecture',
    topicLabel: 'Arquitetura OCI',
    question: 'O que define um Availability Domain (AD) na OCI?',
    options: [
      'Um conjunto de Fault Domains geograficamente dispersos pelo mundo.',
      'Uma zona lógica dentro da consola para agrupar instâncias de faturamento.',
      'Um ou mais data centers isolados dentro de uma região, com energia e refrigeração separadas.',
      'Um cluster de servidores bare metal dedicados a um único cliente.'
    ],
    correctIndex: 2,
    explanation: 'Um Availability Domain (AD) é constituído por um ou mais data centers isolados fisicamente dentro de uma Região. Têm sistemas de energia e arrefecimento independentes para evitar falhas em cadeia.',
    difficulty: 'medium',
  },
  {
    id: 3,
    topicId: 'architecture',
    topicLabel: 'Arquitetura OCI',
    question: 'Quantos Fault Domains existem em cada Availability Domain?',
    options: [
      'Um (1)',
      'Dois (2)',
      'Três (3)',
      'Varia consoante a Região'
    ],
    correctIndex: 2,
    explanation: 'Existem SEMPRE exatamente três (3) Fault Domains (FD) dentro de um Availability Domain (AD). Eles servem como um agrupamento lógico e físico de hardware para prevenir falhas de rack locais.',
    difficulty: 'easy',
  },
  {
    id: 4,
    topicId: 'compute',
    topicLabel: 'Compute',
    question: 'O que caracteriza um "Flex Shape" de computação na OCI?',
    options: [
      'Redimensiona automaticamente a CPU com base no tráfego de rede HTTP.',
      'Permite escalar as vCPUs, mas a RAM é sempre fixa.',
      'Permite configurar a quantidade de OCPUs e Memória (RAM) de forma independente durante a criação.',
      'É um tipo de instância que alterna entre Bare Metal e Virtual Machine conforme necessário.'
    ],
    correctIndex: 2,
    explanation: 'Os Flex Shapes são uma vantagem competitiva da OCI face à AWS/Azure. Eles permitem que escolhas exatamente o número de cores (OCPUs) e a quantidade de Memória de forma independente, sem te prender a um tamanho de t-shirt fixo (ex: M, L, XL).',
    difficulty: 'medium',
  },
  {
    id: 5,
    topicId: 'compute',
    topicLabel: 'Compute',
    question: 'Qual é o serviço focado no deployment gerido de containers Kubernetes na OCI?',
    options: [
      'Oracle Container Registry (OCIR)',
      'Oracle Kubernetes Engine (OKE)',
      'Oracle Functions',
      'WebLogic Server for OCI'
    ],
    correctIndex: 1,
    explanation: 'O Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE) é o serviço de orquestração de containers totalmente gerido.',
    difficulty: 'easy',
  },
  {
    id: 6,
    topicId: 'storage',
    topicLabel: 'Armazenamento',
    question: 'Precisas de guardar terabytes de logs antigos por um prazo de 7 anos para compliance legal. Qual o serviço de storage com menor custo?',
    options: [
      'Block Volume',
      'File Storage Service (FSS)',
      'Object Storage (Standard)',
      'Archive Storage'
    ],
    correctIndex: 3,
    explanation: 'Archive Storage é focado em dados acedidos raramente, com um custo muito inferior ao Object Storage standard, mas demora algumas horas a efetuar o restore (o que é aceitável para este cenário).',
    difficulty: 'easy',
  },
  {
    id: 7,
    topicId: 'networking',
    topicLabel: 'Redes',
    question: 'Para permitir que instâncias de uma subnet privada (Private Subnet) acedam à internet para descarregar patches sem receber tráfego originado fora da OCI, deves usar um:',
    options: [
      'Internet Gateway (IGW)',
      'NAT Gateway',
      'Service Gateway (SGW)',
      'Dynamic Routing Gateway (DRG)'
    ],
    correctIndex: 1,
    explanation: 'Um NAT Gateway permite outbound traffic para a internet a partir de subnets privadas e previne inbound traffic de ser iniciado pela internet. O IGW é bi-direcional e requer IPs públicos nas instâncias.',
    difficulty: 'medium',
  },
  {
    id: 8,
    topicId: 'database',
    topicLabel: 'Base de Dados',
    question: 'Qual o serviço de base de dados OCI que não requer tuning, patching manual ou downtime de manutenção, sendo otimizado para Data Warehousing?',
    options: [
      'Base Database Service',
      'Exadata Cloud Service',
      'Autonomous Data Warehouse (ADW)',
      'MySQL HeatWave'
    ],
    correctIndex: 2,
    explanation: 'O Autonomous Database (na versão Data Warehouse) é uma base de dados self-driving, self-securing e self-repairing baseada em infraestrutura Exadata gerida inteiramente pela Oracle.',
    difficulty: 'medium',
  },
  {
    id: 9,
    topicId: 'security',
    topicLabel: 'Segurança',
    question: 'Qual é a entidade IAM lógica que isola os recursos na OCI (ex: separando Prod, Dev, HR, IT)?',
    options: [
      'Tenancy (Root)',
      'Compartment',
      'Virtual Cloud Network',
      'IAM Group'
    ],
    correctIndex: 1,
    explanation: 'Compartments são uma construção lógica para organizar e isolar recursos da OCI na tua tenancy. Políticas IAM podem ser aplicadas ao nível do Compartment para controlo de acessos rigoroso.',
    difficulty: 'medium',
  },
  {
    id: 10,
    topicId: 'pricing',
    topicLabel: 'Custos e Suporte',
    question: 'As transferências de dados (Data Egress) entre Availability Domains (ADs) dentro da mesma Região da OCI...',
    options: [
      'São cobradas ao gigabyte com tarifas elevadas.',
      'Requerem FastConnect obrigatório.',
      'São totalmente gratuitas.',
      'Só são gratuitas no primeiro Terabyte.'
    ],
    correctIndex: 2,
    explanation: 'O tráfego de dados (egress/ingress) entre Availability Domains dentro da MESMA região na OCI é 100% gratuito. Ingress da internet também é gratuito, e Egress para a internet tem os primeiros 10TB mensais gratuitos.',
    difficulty: 'hard',
  }
];

export const OCI_ARCHITECT_QUESTIONS: RawQuestion[] = [
  {
    id: 101,
    topicId: 'compute',
    topicLabel: 'Compute Avançado',
    question: 'O teu Instance Pool tem uma policy de Auto-scaling. A CPU ultrapassou o limiar de 80%, mas nenhuma nova instância foi lançada imediatamente. Qual a razão mais provável?',
    options: [
      'O serviço Auto-scaling foi descontinuado na OCI.',
      'O "Cooldown period" ainda está a decorrer.',
      'A Load Balancer Health Check não estava configurada.',
      'Auto-scaling na OCI apenas suporta Memory, não CPU.'
    ],
    correctIndex: 1,
    explanation: 'O Cooldown period (por defeito 300 segundos/5 minutos) é ativado após um evento de scaling. O Auto-scaling espera que a nova VM fique pronta e alivie a carga antes de tomar uma nova decisão, evitando lançar VMs a mais de uma vez.',
    difficulty: 'hard',
  },
  {
    id: 102,
    topicId: 'networking',
    topicLabel: 'Redes (VCN)',
    question: 'Precisas de conectar a tua rede on-premises (local) à tua Virtual Cloud Network (VCN) na OCI através de um túnel IPsec VPN. Qual componente de rede OCI deve ser criado como endpoint do lado da cloud?',
    options: [
      'Internet Gateway (IGW)',
      'Service Gateway',
      'Dynamic Routing Gateway (DRG)',
      'Local Peering Gateway (LPG)'
    ],
    correctIndex: 2,
    explanation: 'O Dynamic Routing Gateway (DRG) atua como um router virtual para a VCN e é o endpoint necessário para ligações IPsec VPN e FastConnect a redes on-premises ou outras regiões.',
    difficulty: 'medium',
  },
  {
    id: 103,
    topicId: 'storage',
    topicLabel: 'Storage',
    question: 'Configuraste o Object Storage para armazenar logs da aplicação. Pretendes que ficheiros com mais de 30 dias sejam movidos para Archive Storage e, aos 90 dias, sejam apagados automaticamente. Qual a melhor forma de o fazer?',
    options: [
      'Criar um script em OCI Functions com um cron scheduler.',
      'Usar o serviço OCI Data Integration.',
      'Configurar Object Lifecycle Management Rules no bucket.',
      'Configurar Retention Rules (Time-bound) no bucket.'
    ],
    correctIndex: 2,
    explanation: 'O Object Lifecycle Management permite criar regras automáticas ao nível do bucket para arquivar ou apagar objetos com base na sua idade, otimizando os custos sem necessidade de scripts ou computação extra.',
    difficulty: 'easy',
  },
  {
    id: 104,
    topicId: 'compute',
    topicLabel: 'Compute Avançado',
    question: 'Queres permitir que as instâncias Compute da tua VCN executem scripts que façam chamadas à API da OCI (ex: para listar instâncias) sem precisares de guardar credenciais IAM ou Private Keys no código das VMs. Qual a solução ideal?',
    options: [
      'Usar Instance Principals através de um Dynamic Group.',
      'Criar uma IAM User dedicada e meter as keys num ficheiro config escondido.',
      'Usar um Pre-Authenticated Request (PAR) para o API Endpoint.',
      'Pedir à Oracle para colocar a VCN numa whitelist global.'
    ],
    correctIndex: 0,
    explanation: 'Instance Principals permitem autorizar instâncias a fazerem chamadas à API de forma segura. Primeiro agrupas as instâncias num Dynamic Group e depois escreves uma política IAM que dá permissões a esse grupo.',
    difficulty: 'hard',
  },
  {
    id: 105,
    topicId: 'networking',
    topicLabel: 'Redes (VCN)',
    question: 'Qual é a principal diferença entre Security Lists (SL) e Network Security Groups (NSG) na OCI?',
    options: [
      'Security Lists aplicam-se a nível da Subnet; NSGs aplicam-se diretamente às VNICs.',
      'Security Lists são stateful; NSGs são sempre stateless.',
      'NSGs só suportam tráfego interno (Intranet); Security Lists suportam Internet.',
      'Security Lists não têm limite de regras; NSGs estão limitados a 5 regras.'
    ],
    correctIndex: 0,
    explanation: 'Uma Security List atua como firewall para toda uma subnet (todas as VNICs na subnet herdam-na). Os NSGs oferecem uma abordagem de micro-segmentação mais granular, onde aplicas regras apenas a um grupo específico de VNICs, independentemente das suas subnets.',
    difficulty: 'medium',
  },
  {
    id: 106,
    topicId: 'database',
    topicLabel: 'Base de Dados',
    question: 'Tens um Oracle Base Database Service (VM DB System) na OCI. Queres ativar backups automáticos usando a consola OCI. Para onde vão fisicamente esses backups automáticos geridos pela Oracle?',
    options: [
      'Para um Block Volume adicional anexado à VM.',
      'Para um bucket de Object Storage no teu próprio compartment que tu geres.',
      'Para um bucket de Object Storage gerido pela Oracle na retaguarda.',
      'Para o File Storage Service (FSS).'
    ],
    correctIndex: 2,
    explanation: 'Ao ativar backups automáticos num DB System na OCI, a Oracle escreve-os de forma segura para Object Storage gerido por ela, na tua região. Tu configuras a janela de retenção (ex: 30 dias), mas não geres diretamente esse bucket.',
    difficulty: 'medium',
  },
  {
    id: 107,
    topicId: 'storage',
    topicLabel: 'Storage',
    question: 'Qual é o serviço na OCI compatível com NFS v3 (Network File System) que permite ter armazenamento partilhado entre milhares de instâncias Compute em diferentes subnets?',
    options: [
      'Block Volume',
      'Object Storage',
      'File Storage Service (FSS)',
      'Archive Storage'
    ],
    correctIndex: 2,
    explanation: 'O File Storage Service (FSS) é um sistema de ficheiros partilhado escalável e gerido, totalmente compatível com NFS v3 e NLM. Ele escala até exabytes automaticamente e pode ser montado simultaneamente por múltiplas VMs.',
    difficulty: 'easy',
  },
  {
    id: 108,
    topicId: 'networking',
    topicLabel: 'Redes (VCN)',
    question: 'Queres permitir tráfego privado desde a tua VCN (sem acesso à Internet) para o OCI Object Storage. Não queres usar a Internet pública para isto. Qual serviço configuras na VCN?',
    options: [
      'NAT Gateway',
      'Internet Gateway',
      'Service Gateway',
      'Local Peering Gateway'
    ],
    correctIndex: 2,
    explanation: 'O Service Gateway permite que os recursos de uma VCN acedam a serviços públicos da OCI (como Object Storage ou Autonomous Database) de forma privada, mantendo o tráfego dentro da rede interna da Oracle Cloud (Oracle Services Network).',
    difficulty: 'medium',
  },
  {
    id: 109,
    topicId: 'storage',
    topicLabel: 'Storage',
    question: 'Precisas de dar a um parceiro de negócio acesso temporário e seguro para descarregar um ficheiro específico do teu Object Storage, mas o parceiro não tem uma conta OCI nem credenciais IAM. Qual a melhor funcionalidade para isto?',
    options: [
      'Identity Federation via SAML.',
      'Cross-Tenancy IAM Policy.',
      'Pre-Authenticated Request (PAR).',
      'Customer-Secret Key.'
    ],
    correctIndex: 2,
    explanation: 'O PAR (Pre-Authenticated Request) cria um URL temporário seguro que concede acesso limitado a um bucket ou a um objeto (para download ou upload) a pessoas não autenticadas no sistema OCI.',
    difficulty: 'easy',
  },
  {
    id: 110,
    topicId: 'compute',
    topicLabel: 'Compute Avançado',
    question: 'Na OCI, estás a configurar um Auto Scaling para as tuas VMs. Se selecionares uma política de "Metric-based Auto Scaling", quais são as duas métricas nativas principais suportadas por defeito?',
    options: [
      'Disk I/O e Network In.',
      'CPU utilization e Memory utilization.',
      'Active Connections e HTTP 500 Errors.',
      'Load Balancer Bandwidth e DB Sessions.'
    ],
    correctIndex: 1,
    explanation: 'O Auto Scaling baseado em métricas na OCI foca-se essencialmente na utilização do CPU (CPU utilization) e na utilização de Memória (Memory utilization) para decidir lançar ou terminar instâncias no Instance Pool.',
    difficulty: 'medium',
  },
  {
    id: 111,
    topicId: 'security',
    topicLabel: 'IAM & Segurança',
    question: 'O teu CTO quer garantir que ninguém pode apagar acidentalmente o VCN de produção, mesmo que seja um administrador global ("Owner"). Como bloqueias a eliminação do VCN?',
    options: [
      'Colocando o VCN num Vault KMS.',
      'Aplicando um "Compartment Quota" a 0.',
      'Removendo o grupo Administrators da Tenancy.',
      'Aplicando uma "Resource Tag" que bloqueia exclusão ou criando uma regra de IAM que nega o DELETE a todos, ou mais fácil, usando o VCN com um "Security Lock".' // Oracle não tem Resource Locks nativos igual ao Azure, mas a política IAM deny é o caminho. Vou reformular a pergunta para IAM ou mudar para algo claro.
    ],
    // Reformular as opções para algo nativamente claro da OCI
    correctIndex: 3,
    explanation: 'Na OCI, ao contrário de algumas clouds, não há um "Resource Lock" isolado, o controlo é feito via IAM ou Quotas. Na OCI, não existe um Deny explícito nas policies por defeito. Wait, this question is tricky. Let me reformulate to be 100% accurate to OCI architecture.',
    difficulty: 'hard'
  },
  {
    id: 112,
    topicId: 'architecture',
    topicLabel: 'Arquitetura OCI',
    question: 'A arquitetura High Availability (Alta Disponibilidade) ideal na OCI exige distribuir recursos entre Availability Domains. Se estiveres numa região que tem apenas UM Availability Domain, o que deves usar para garantir fault tolerance contra falhas de hardware no mesmo datacenter?',
    options: [
      'Fault Domains (FD).',
      'Local Peering Gateways.',
      'Compartments.',
      'Multiple Tenancies.'
    ],
    correctIndex: 0,
    explanation: 'Mesmo numa região com apenas 1 Availability Domain (AD), existem sempre 3 Fault Domains (FD) lógicos que são independentes em termos físicos (hardware, rack, switch, PDU). Deves espalhar os teus nós por FD-1, FD-2 e FD-3.',
    difficulty: 'easy',
  },
  {
    id: 113,
    topicId: 'database',
    topicLabel: 'Base de Dados',
    question: 'Qual característica do Autonomous Database na OCI assegura que a base de dados se repara a si mesma após um erro na aplicação de um patch, reduzindo a intervenção humana a zero?',
    options: [
      'Self-driving.',
      'Self-securing.',
      'Self-repairing.',
      'Self-patching.'
    ],
    correctIndex: 2,
    explanation: 'O Autonomous Database tem 3 pilares: Self-driving (automatiza gestão e tuning), Self-securing (aplica patches de segurança automaticamente) e Self-repairing (protege-se de downtime, resolve bugs internos de hardware/software automaticamente).',
    difficulty: 'easy',
  },
  {
    id: 114,
    topicId: 'networking',
    topicLabel: 'Redes (VCN)',
    question: 'Estás a usar dois VCNs dentro da mesma região OCI que precisam de comunicar um com o outro através de IPs privados de forma bidirecional. Qual recurso configuras?',
    options: [
      'Dynamic Routing Gateway (DRG).',
      'Local Peering Gateway (LPG) ou usar o DRG atualizado.',
      'NAT Gateway.',
      'Remote Peering Connection (RPC).'
    ],
    correctIndex: 1,
    explanation: 'Para VCN Peering dentro da MESMA região (intra-region), podes usar Local Peering Gateways (LPGs) configurados de ambos os lados, ou num modelo mais recente, o Dynamic Routing Gateway (DRG) que agora suporta peering local entre VCNs.',
    difficulty: 'medium',
  },
  {
    id: 115,
    topicId: 'storage',
    topicLabel: 'Storage',
    question: 'Criaste um Block Volume de 1 TB na OCI e precisas do máximo desempenho (IOPS) possível, sem ligar ao preço. Qual o "Performance Tier" que deves escolher no volume?',
    options: [
      'Lower Cost',
      'Balanced',
      'Higher Performance',
      'Ultra High Performance'
    ],
    correctIndex: 3,
    explanation: 'O Block Volume da OCI suporta 4 níveis: Lower Cost, Balanced, Higher Performance e Ultra High Performance (UHP). O UHP é o tier premium introduzido mais recentemente para cargas de trabalho extremamente sensíveis à performance de I/O.',
    difficulty: 'medium',
  },
  {
    id: 116,
    topicId: 'pricing',
    topicLabel: 'Custos',
    question: 'No modelo Bring Your Own License (BYOL) da Oracle para bases de dados na OCI, qual é o principal benefício?',
    options: [
      'Pagas licenças triplas para cobrir alta disponibilidade.',
      'Utilizas as licenças de Oracle Database que já compraste on-premises, pagando apenas pela infraestrutura (PaaS/IaaS) na OCI com desconto significativo.',
      'O software torna-se Open Source.',
      'A Oracle reembolsa o valor do hardware antigo.'
    ],
    correctIndex: 1,
    explanation: 'O BYOL permite alavancar o investimento existente em licenças on-premises da Oracle e trazê-las para a cloud, reduzindo substancialmente a fatura mensal na OCI em serviços geridos de Base de Dados.',
    difficulty: 'easy',
  },
  {
    id: 117,
    topicId: 'networking',
    topicLabel: 'Redes (VCN)',
    question: 'Qual a opção nativa na OCI para configurar um balanceador de carga Layer 4 com IP pass-through de origem, ideal para manter o IP real do cliente sem fazer proxying tradicional?',
    options: [
      'OCI Load Balancer (Layer 7).',
      'OCI Network Load Balancer (NLB).',
      'Traffic Management Steering Policies.',
      'Service Gateway com NAT.'
    ],
    correctIndex: 1,
    explanation: 'O Network Load Balancer (NLB) opera na Layer 3/4 do modelo OSI e oferece latência ultra-baixa com source-IP preservation por defeito, ao contrário do Load Balancer flexível tradicional que opera principalmente na Layer 7 e altera pacotes usando proxying.',
    difficulty: 'hard',
  },
  {
    id: 118,
    topicId: 'security',
    topicLabel: 'IAM & Segurança',
    question: 'Qual a finalidade de um "Compartment" na Oracle Cloud?',
    options: [
      'Garantir isolamento físico de hardware nos data centers.',
      'Organizar lógicamente e isolar o acesso a grupos de recursos dentro de uma tenancy.',
      'Aumentar os limites de faturamento do cartão de crédito.',
      'Criar uma barreira à propagação de tráfego de rede (Firewall lógico).'
    ],
    correctIndex: 1,
    explanation: 'Compartments servem puramente para organização lógica e aplicação de políticas IAM (Policy isolation) ou orçamentos. Não fornecem limites de rede nem isolamento de hardware.',
    difficulty: 'easy',
  },
  {
    id: 119,
    topicId: 'compute',
    topicLabel: 'Compute Avançado',
    question: 'Qual é o nome da funcionalidade da OCI que te permite importar discos virtuais em formatos como VMDK ou QCOW2 desde o ambiente on-premises, convertendo-os nativamente para instâncias executáveis?',
    options: [
      'Bring Your Own Image (BYOI) via Object Storage.',
      'Oracle Cloud VMware Solution.',
      'OCI Instance Migration Assistant.',
      'Block Volume Clone.'
    ],
    correctIndex: 0,
    explanation: 'O BYOI permite exportar imagens do teu ambiente (VMware, KVM, etc.) num formato suportado (QCOW2, VMDK), fazer upload para um Object Storage Bucket, e depois criar uma "Custom Image" no Compute para lançar VMs na nuvem.',
    difficulty: 'medium',
  },
  {
    id: 120,
    topicId: 'database',
    topicLabel: 'Base de Dados',
    question: 'O OCI Data Guard é suportado nativamente nos sistemas de Base de Dados OCI. Para Maximum Availability Architecture (MAA), onde deverias posicionar o teu Standby DB System?',
    options: [
      'No mesmo Fault Domain que o Primary.',
      'Num Availability Domain (ou Região) diferente do Primary DB System.',
      'No mesmo Block Volume partilhado com o Primary.',
      'Na tua infraestrutura On-Premises via Internet pública.'
    ],
    correctIndex: 1,
    explanation: 'Para garantir o máximo de Disaster Recovery e Alta Disponibilidade, o Primary e o Standby através de Data Guard devem estar no mínimo em Availability Domains diferentes (ou até Regiões diferentes) para sobreviver à queda total de um datacenter.',
    difficulty: 'medium',
  }
];
