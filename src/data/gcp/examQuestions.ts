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

export const GCP_ACE_QUESTIONS: RawQuestion[] = [
  {
    id: 1,
    topicId: 'iam',
    topicLabel: 'Identity & Access Management',
    question: 'Qual é o princípio recomendado pelo Google Cloud para atribuição de permissões IAM?',
    options: [
      'Atribuir as permissões diretamente a contas de utilizador para melhor rastreabilidade.',
      'Atribuir papéis (roles) a grupos do Google Workspace ou Cloud Identity e adicionar os utilizadores aos grupos.',
      'Partilhar uma única Service Account entre várias equipas de desenvolvimento.',
      'Dar a permissão Owner a todos os developers em ambientes de produção.'
    ],
    correctIndex: 1,
    explanation: 'A melhor prática no Google Cloud é evitar atribuir papéis diretamente a utilizadores individuais. Deves criar grupos (ex: dev-team@tua-empresa.com), atribuir os papéis IAM ao grupo e gerir a adesão dos utilizadores ao grupo.',
    difficulty: 'easy'
  },
  {
    id: 2,
    topicId: 'compute',
    topicLabel: 'Compute Engine',
    question: 'Precisas de correr um batch job tolerante a falhas que demora cerca de 3 horas. Queres minimizar os custos. Qual o tipo de VM ideal?',
    options: [
      'Spot VM (Preemptible VM)',
      'E2 Standard VM com Committed Use Discount',
      'Shielded VM',
      'C2 Compute-Optimized VM'
    ],
    correctIndex: 0,
    explanation: 'As Spot VMs (anteriormente Preemptible VMs) são instâncias do Compute Engine muito mais baratas (até 91% de desconto) mas que podem ser terminadas pelo Google a qualquer momento. Como o job é tolerante a falhas, é o caso de uso ideal.',
    difficulty: 'easy'
  },
  {
    id: 3,
    topicId: 'storage',
    topicLabel: 'Cloud Storage',
    question: 'Qual o Storage Class do Google Cloud Storage mais adequado para backups que só serão acedidos uma vez por ano e requerem baixo custo de armazenamento mensal?',
    options: [
      'Standard Storage',
      'Nearline Storage',
      'Coldline Storage',
      'Archive Storage'
    ],
    correctIndex: 3,
    explanation: 'Archive Storage é a classe mais económica para armazenamento a longo prazo de dados que são acedidos menos de uma vez por ano, como arquivos de backup ou dados regulatórios.',
    difficulty: 'medium'
  },
  {
    id: 4,
    topicId: 'networking',
    topicLabel: 'Redes (VPC)',
    question: 'Por defeito, como é que as sub-redes (subnets) numa Custom Mode VPC se comportam?',
    options: [
      'São criadas automaticamente em todas as regiões do mundo.',
      'Não são criadas subnets automáticas; tens de criar as tuas subnets e especificar as regiões e ranges IP.',
      'A VPC não pode comunicar com a internet até criares um Cloud NAT.',
      'Todas as VMs na VPC recebem obrigatoriamente IPs externos.'
    ],
    correctIndex: 1,
    explanation: 'Numa Custom Mode VPC, não são criadas sub-redes automaticamente. O administrador tem controlo total sobre que subnets criar, em que regiões e com quais intervalos CIDR.',
    difficulty: 'medium'
  },
  {
    id: 5,
    topicId: 'billing',
    topicLabel: 'Faturamento',
    question: 'Queres receber um alerta automático se os teus gastos mensais do Google Cloud ultrapassarem os 500 dólares. Qual serviço deves configurar?',
    options: [
      'Cloud Monitoring',
      'Cloud Logging',
      'Billing Alerts / Budgets',
      'Quotas API'
    ],
    correctIndex: 2,
    explanation: 'Os Budgets and Alerts permitem-te definir um orçamento (ex: $500) e receber notificações (por email ou Pub/Sub) quando os custos atingem uma certa percentagem do valor.',
    difficulty: 'easy'
  },
  {
    id: 6,
    topicId: 'compute',
    topicLabel: 'Compute Engine',
    question: 'Qual o comando da CLI do Google Cloud (gcloud) usado para fazer SSH para uma instância de Compute Engine chamada "web-server-1" na zona "europe-west1-b"?',
    options: [
      'gcloud compute ssh web-server-1 --zone=europe-west1-b',
      'gcloud connect ssh web-server-1 --zone=europe-west1-b',
      'gcloud instances connect web-server-1 --zone europe-west1-b',
      'gcloud ssh compute web-server-1 --zone=europe-west1-b'
    ],
    correctIndex: 0,
    explanation: 'O comando correto para aceder a uma VM via SSH no GCP é "gcloud compute ssh [NOME_DA_INSTANCIA] --zone=[ZONA]".',
    difficulty: 'medium'
  },
  {
    id: 7,
    topicId: 'iam',
    topicLabel: 'Identity & Access Management',
    question: 'Tens um projeto no GCP. Atribuiste o papel de "Viewer" ao nível do Projeto a um utilizador. Depois, atribuiste o papel de "Editor" ao mesmo utilizador num bucket específico do Cloud Storage. O que consegue o utilizador fazer nesse bucket?',
    options: [
      'O utilizador pode apenas ler os dados, porque as permissões a nível de projeto têm prioridade (Viewer).',
      'O utilizador pode criar, ler, atualizar e apagar objetos no bucket (Editor).',
      'Há um conflito de permissões e o utilizador não tem acesso nenhum.',
      'O GCP avisa que a herança foi quebrada e pede confirmação.'
    ],
    correctIndex: 1,
    explanation: 'No IAM do GCP, as políticas são a união das permissões concedidas em cada nível. A permissão menos restritiva (ALLOW) tem sempre prioridade. O acesso herdado do projeto é Viewer, mas a permissão explícita no bucket é Editor, logo o utilizador tem permissões de Editor no bucket.',
    difficulty: 'hard'
  },
  {
    id: 8,
    topicId: 'storage',
    topicLabel: 'Cloud Storage',
    question: 'Precisas que os utilizadores possam fazer upload temporário de ficheiros (ex: imagens de perfil) diretamente para o Cloud Storage a partir do browser, sem os ficheiros passarem pelo teu servidor backend. Como podes garantir que apenas utilizadores com permissão podem fazer o upload de forma segura?',
    options: [
      'Criar um bucket público e depois esconder o nome.',
      'Dar permissões de Service Account a todos os clientes.',
      'Gerar Signed URLs (URLs assinados) no backend e enviá-los ao frontend.',
      'Usar a API de Cloud CDN para fazer cache dos ficheiros na Cloud Edge.'
    ],
    correctIndex: 2,
    explanation: 'Signed URLs permitem dar acesso limitado em tempo a um recurso do Cloud Storage (como fazer upload ou download de um ficheiro) sem exigir que os utilizadores tenham conta no Google ou permissões IAM.',
    difficulty: 'medium'
  },
  {
    id: 9,
    topicId: 'compute',
    topicLabel: 'Compute Engine',
    question: 'Estás a usar um Managed Instance Group (MIG). Qual dos seguintes NÃO é suportado de forma nativa por um MIG?',
    options: [
      'Autohealing (reparação automática de VMs falhadas)',
      'Autoscaling (escalabilidade baseada em métricas de CPU/Load)',
      'Atualizações em modo rolling (Rolling updates)',
      'Execução de instâncias em múltiplas Regiões (Multi-Regional)'
    ],
    correctIndex: 3,
    explanation: 'Um MIG pode ser Zonal (numa só zona) ou Regional (distribuído através das zonas da mesma região). Não existem MIGs Multi-Regionais no Google Cloud (apenas balanceadores de carga podem rotear tráfego entre diferentes regiões).',
    difficulty: 'hard'
  },
  {
    id: 10,
    topicId: 'networking',
    topicLabel: 'Redes (VPC)',
    question: 'Na tua VPC, tens uma VM de base de dados que não tem (nem pode ter) IP externo público. No entanto, precisas de instalar patches do SO transferindo-os de um repositório público na internet. Como podes permitir que a VM aceda à internet de forma segura?',
    options: [
      'Configurar um Cloud Router com Cloud NAT para fornecer NAT outbound (saída).',
      'Configurar um Cloud Load Balancer Externo para encaminhar tráfego de saída.',
      'Criar uma firewall rule com source 0.0.0.0/0.',
      'Ativar o Google Private Access na sub-rede da VM.'
    ],
    correctIndex: 0,
    explanation: 'Cloud NAT permite que VMs numa sub-rede privada (sem IP externo) acedam à internet para atualizações ou integrações, sem permitir conexões inbound não solicitadas.',
    difficulty: 'medium'
  },
  {
    id: 11,
    topicId: 'compute',
    topicLabel: 'Compute Engine',
    question: 'No Google Kubernetes Engine (GKE), qual é a diferença entre um cluster Standard e um cluster Autopilot?',
    options: [
      'O Standard é grátis e o Autopilot é pago por mês.',
      'No Standard tu geres os nós (Nodes); no Autopilot a Google gere a infraestrutura de nós e tu pagas pelos recursos solicitados pelos Pods.',
      'Autopilot só suporta contentores Windows, enquanto Standard suporta apenas Linux.',
      'O Autopilot não permite escalar Pods automaticamente.'
    ],
    correctIndex: 1,
    explanation: 'GKE Autopilot remove a necessidade de gerir a infraestrutura dos nós. Paga-se apenas pelos recursos (CPU, Memória) alocados por cada Pod, enquanto no Standard pagas pelas instâncias Compute Engine (nós) quer estejam ocupadas ou não.',
    difficulty: 'easy'
  },
  {
    id: 12,
    topicId: 'iam',
    topicLabel: 'Identity & Access Management',
    question: 'O que é uma "Service Account" no Google Cloud?',
    options: [
      'Uma conta especial para as equipas de suporte do Google acederem ao teu projeto.',
      'Uma identidade usada por aplicações e instâncias de computação para acederem a outros serviços do GCP.',
      'Um endereço de email temporário para developers estagiários.',
      'Uma ferramenta de monitorização de tempo de atividade (uptime).'
    ],
    correctIndex: 1,
    explanation: 'Uma Service Account é um tipo especial de conta não humana, usada pelas aplicações e VMs no GCP para autenticarem e interagirem com APIs, sem depender das credenciais de um utilizador real.',
    difficulty: 'easy'
  },
  {
    id: 13,
    topicId: 'storage',
    topicLabel: 'Cloud Storage',
    question: 'Precisas de usar um base de dados relacional (SQL) que tenha consistência forte e seja globalmente escalável a um nível continental. Qual serviço do Google Cloud escolhes?',
    options: [
      'Cloud SQL',
      'Cloud Spanner',
      'Bigtable',
      'Firestore'
    ],
    correctIndex: 1,
    explanation: 'Cloud Spanner é uma base de dados SQL relacional distribuída globalmente, desenvolvida para escalabilidade massiva com forte consistência, características únicas em relação ao Cloud SQL (que não é globalmente escalável).',
    difficulty: 'hard'
  },
  {
    id: 14,
    topicId: 'billing',
    topicLabel: 'Faturamento',
    question: 'Queres exportar todos os dados de custos e faturação do teu Cloud Billing para efetuar análises profundas usando queries SQL com visualização em dashboards. Qual é o melhor destino de exportação?',
    options: [
      'Cloud Storage num formato CSV.',
      'Google Sheets.',
      'BigQuery.',
      'Cloud SQL.'
    ],
    correctIndex: 2,
    explanation: 'A exportação nativa de Faturação para o BigQuery é a prática padrão no GCP. Permite fazer análise avançada com SQL e integrar nativamente com ferramentas como o Looker Studio para visualização.',
    difficulty: 'medium'
  },
  {
    id: 15,
    topicId: 'compute',
    topicLabel: 'Compute Engine',
    question: 'Estás a usar Cloud Run para alojar a tua aplicação. Qual das seguintes opções descreve melhor o Cloud Run?',
    options: [
      'Uma VM que corre na nuvem sem sistema operativo.',
      'Um cluster Kubernetes onde tens de gerir os nós.',
      'Uma plataforma Serverless para correr contentores (containers) que escala automaticamente a partir do zero.',
      'Um serviço para alojar unicamente websites estáticos baseados em HTML.'
    ],
    correctIndex: 2,
    explanation: 'O Cloud Run é um serviço de computação gerida (Serverless) que permite executar contentores web stateless de forma automática, permitindo escalar a zeros instâncias quando não há pedidos, reduzindo custos.',
    difficulty: 'easy'
  },
  {
    id: 16,
    topicId: 'iam',
    topicLabel: 'Identity & Access Management',
    question: 'Qual é o papel (Role) Primitive no IAM que tem controlo absoluto e permite gerir as permissões e convidar novos utilizadores num Projeto?',
    options: [
      'roles/viewer',
      'roles/editor',
      'roles/owner',
      'roles/admin'
    ],
    correctIndex: 2,
    explanation: 'O papel Primitive roles/owner (Proprietário) permite controlo total no projeto, incluindo a gestão de IAM (Identity and Access Management) e a faturação.',
    difficulty: 'easy'
  },
  {
    id: 17,
    topicId: 'networking',
    topicLabel: 'Redes (VPC)',
    question: 'Precisas de ligar a tua rede On-Premises (local) ao teu projeto Google Cloud usando a internet pública, através de uma ligação encriptada usando IPSec. O que deves configurar?',
    options: [
      'Cloud VPN',
      'Dedicated Interconnect',
      'Partner Interconnect',
      'Cloud CDN'
    ],
    correctIndex: 0,
    explanation: 'O Cloud VPN permite a ligação segura através da internet pública utilizando túneis IPsec. Dedicated ou Partner Interconnect também ligam redes locais, mas usando linhas físicas dedicadas, sem passarem pela internet pública.',
    difficulty: 'medium'
  },
  {
    id: 18,
    topicId: 'storage',
    topicLabel: 'Cloud Storage',
    question: 'Qual a ferramenta de linha de comandos usada nativamente para transferir e gerir ficheiros no Google Cloud Storage?',
    options: [
      'cURL',
      'gsutil (ou gcloud storage)',
      'bq',
      'gcloud compute'
    ],
    correctIndex: 1,
    explanation: 'O utilitário clássico para Cloud Storage é o "gsutil", embora a recomendação atual e mais moderna seja usar "gcloud storage" (que substitui o gsutil e tem melhor performance).',
    difficulty: 'easy'
  },
  {
    id: 19,
    topicId: 'compute',
    topicLabel: 'Compute Engine',
    question: 'Quais destas opções permitem implementar "Infrastructure as Code" (IaC) nativamente recomendada para o ecossistema GCP?',
    options: [
      'AWS CloudFormation',
      'Ansible e Chef',
      'Terraform (com provider google)',
      'Google Cloud Deployment Manager'
    ],
    correctIndex: 2,
    explanation: 'Embora o Google Cloud Deployment Manager seja nativo, a recomendação moderna do Google e da indústria é utilizar Terraform, existindo forte suporte oficial do Google para o provider Terraform.',
    difficulty: 'medium'
  },
  {
    id: 20,
    topicId: 'networking',
    topicLabel: 'Redes (VPC)',
    question: 'Como se define uma regra de firewall no Google Cloud que afete apenas determinadas máquinas virtuais específicas?',
    options: [
      'Adicionando a regra de firewall dentro do ficheiro de configuração do SO da VM.',
      'Definindo a regra a nível global do projeto, sem poder restringir a VMs.',
      'Utilizando "Network tags" (etiquetas de rede) ou "Service Accounts" associadas às VMs como Target da regra.',
      'Criando múltiplas VPCs com regras diferentes.'
    ],
    correctIndex: 2,
    explanation: 'No Google Cloud, podes restringir os "Targets" de uma Firewall rule usando Network Tags ou, de preferência, as Service Accounts usadas pelas instâncias (mais seguro e escalável).',
    difficulty: 'medium'
  }
];
