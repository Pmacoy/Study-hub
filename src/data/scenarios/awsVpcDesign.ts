import type { Scenario } from '../../types/scenario';

export const awsVpcDesignScenario: Scenario = {
  id: 'aws-vpc-three-tier-design',
  domain: 'aws',
  format: 'guided',
  title: 'Desenhar a VPC de raiz para uma aplicação de três camadas',
  hook: 'A empresa vai lançar uma aplicação nova em AWS: web, aplicação e base de dados. Requisitos: alta disponibilidade, a base de dados nunca acessível da internet, e ligação futura ao datacenter on-premises que usa 192.168.0.0/16. Pediram-te o desenho da rede. Tens uma folha em branco.',
  difficulty: 'mid',
  timeEstimateMin: 9,
  tags: ['aws', 'vpc', 'networking', 'arquitectura'],

  contextArtifacts: [
    {
      id: 'reqs',
      label: 'Requisitos',
      language: 'text',
      content: `Aplicação:     web + app + base de dados (3 camadas)
Disponibilidade: tem de sobreviver à falha de uma AZ
Segurança:     a BD nunca acessível a partir da internet
Futuro:        ligação ao datacenter (192.168.0.0/16)
Crescimento:   prever espaço para novos serviços
Região:        eu-west-1`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'cidr-choice',
      label: 'CIDR escolhido',
      language: 'text',
      content: `VPC CIDR: 10.0.0.0/16

Total de IPs:  65.536
Úteis:         65.531 (a AWS reserva 5 por subnet)

Não colide com 192.168.0.0/16 do datacenter,
portanto o peering e a VPN futuros são possíveis.`,
    },
    {
      id: 'subnets',
      label: 'Desenho de subnets',
      language: 'text',
      content: `AZ eu-west-1a                    AZ eu-west-1b
─────────────────────────────    ─────────────────────────────
Pública    10.0.0.0/20           Pública    10.0.16.0/20
  ALB, bastion, NAT GW             ALB, bastion, NAT GW

Web priv.  10.0.32.0/20          Web priv.  10.0.48.0/20
  servidores web                   servidores web

App priv.  10.0.64.0/20          App priv.  10.0.80.0/20
  servidores de aplicação          servidores de aplicação

DB priv.   10.0.96.0/20          DB priv.   10.0.112.0/20
  RDS primary                      RDS standby

Cada /20 = 4.096 IPs. Sobra espaço no /16 para crescer.`,
    },
    {
      id: 'routes',
      label: 'Route tables',
      language: 'text',
      content: `Route table PÚBLICA
  10.0.0.0/16  →  local
  0.0.0.0/0    →  Internet Gateway

Route table WEB e APP (privadas)
  10.0.0.0/16  →  local
  0.0.0.0/0    →  NAT Gateway   (saída apenas)

Route table DB (privada)
  10.0.0.0/16  →  local
  (sem rota para 0.0.0.0/0 — sem internet de todo)`,
    },
    {
      id: 'security',
      label: 'Camadas de segurança',
      language: 'text',
      content: `Security Groups (stateful, ao nível da instância)
  SG-ALB   : entrada 443 de 0.0.0.0/0
  SG-Web   : entrada 80 apenas de SG-ALB
  SG-App   : entrada 8080 apenas de SG-Web
  SG-DB    : entrada 5432 apenas de SG-App

NACLs (stateless, ao nível da subnet)
  Camada adicional — usar para bloquear IPs específicos

VPC Endpoints
  S3 e DynamoDB por Gateway Endpoint (grátis)
  → o tráfego não passa pelo NAT Gateway`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Primeira decisão: que bloco CIDR escolhes para a VPC?',
      revealArtifacts: [],
      options: [
        { id: 'a', label: '192.168.0.0/16 — é o bloco privado mais comum', correct: false,
          feedback: 'Colide exactamente com o datacenter on-premises. Com CIDRs sobrepostos não consegues fazer VPN nem Direct Connect — o routing não saberia distinguir os dois lados.' },
        { id: 'b', label: '10.0.0.0/16 — não colide com o on-premises e dá 65.536 IPs', correct: true,
          feedback: 'Correcto. Evita a colisão com 192.168.0.0/16 e o /16 dá espaço largo para as subnets de hoje e para crescer.',
          revealArtifacts: ['cidr-choice'] },
        { id: 'c', label: '10.0.0.0/24 — começar pequeno e aumentar quando precisar', correct: false,
          feedback: 'Duas falhas: 256 IPs não chegam para três camadas em duas AZs, e o CIDR da VPC é imutável depois de criada. Aumentar depois obriga a recriar tudo.' },
        { id: 'd', label: '172.31.0.0/16 — é o default da AWS', correct: false,
          feedback: 'É o CIDR da VPC default, e usá-lo torna difícil fazer peering com outras contas (que muitas vezes têm o mesmo). Escolhe deliberadamente em vez de aceitar o default.' },
      ],
      teachingNote: 'O CIDR da VPC não pode ser alterado após a criação. As duas perguntas a fazer antes de decidir: colide com alguma rede que eu possa vir a ligar? e tenho espaço para crescer?',
    },
    {
      id: 'step-2',
      prompt: 'Quantas subnets crias, e porquê?',
      revealArtifacts: ['cidr-choice'],
      options: [
        { id: 'a', label: 'Duas — uma pública e uma privada', correct: false,
          feedback: 'Não sobrevive à falha de uma AZ (subnets vivem numa AZ só), e mistura web, app e BD na mesma subnet privada, o que impede isolamento por camada.' },
        { id: 'b', label: 'Oito — quatro camadas (pública, web, app, BD) × duas AZs', correct: true,
          feedback: 'Correcto. Duas AZs dão alta disponibilidade; quatro camadas dão isolamento e route tables distintas por tier.',
          revealArtifacts: ['subnets'] },
        { id: 'c', label: 'Quatro — uma por camada, todas na mesma AZ', correct: false,
          feedback: 'Tem o isolamento por camada, mas falha o requisito de HA. Se a AZ cair, a aplicação inteira cai com ela.' },
        { id: 'd', label: 'Dezasseis — quatro camadas × quatro AZs, para máxima resiliência', correct: false,
          feedback: 'Não está errado tecnicamente, mas duas AZs já satisfazem o requisito. Quatro multiplicam o custo de NAT Gateways e o tráfego cross-AZ sem ganho proporcional.' },
      ],
      teachingNote: 'Uma subnet nunca cruza AZs. A regra prática: pelo menos duas subnets por camada, em AZs diferentes. O número de camadas vem do isolamento que queres, não de uma fórmula fixa.',
    },
    {
      id: 'step-3',
      prompt: 'Como configuras as route tables para que a base de dados nunca fique acessível da internet?',
      revealArtifacts: ['subnets'],
      options: [
        { id: 'a', label: 'Uma route table para todas as subnets, com Security Groups a bloquear a BD', correct: false,
          feedback: 'Os SGs ajudam, mas dar rota de internet à BD é confiar apenas numa camada. Se um SG for mal configurado, a BD fica exposta. Defesa em profundidade quer dizer remover a rota também.' },
        { id: 'b', label: 'Route tables separadas: pública → IGW, web e app → NAT, BD sem rota externa', correct: true,
          feedback: 'Correcto. Sem rota 0.0.0.0/0, os pacotes da BD nem sequer têm caminho para sair. É uma garantia estrutural, não uma regra que se possa configurar mal.',
          revealArtifacts: ['routes'] },
        { id: 'c', label: 'Todas as subnets com rota para o NAT Gateway', correct: false,
          feedback: 'A BD passaria a ter saída para a internet, que não precisa. Cada rota desnecessária é superfície de ataque adicional.' },
        { id: 'd', label: 'Colocar a BD fora da VPC, num serviço gerido', correct: false,
          feedback: 'O RDS corre dentro de subnets da tua VPC — não é "fora". A questão de routing mantém-se exactamente igual.' },
      ],
      teachingNote: 'Público vs privado não é uma flag: é a route table. Uma subnet é pública se tem rota para o IGW. Remover a rota é mais forte do que bloquear com regras, porque não depende de configuração correcta.',
    },
    {
      id: 'step-4',
      prompt: 'Como desenhas os Security Groups entre as camadas?',
      revealArtifacts: ['routes'],
      options: [
        { id: 'a', label: 'Um SG partilhado que permite tráfego dentro de 10.0.0.0/16', correct: false,
          feedback: 'Qualquer instância comprometida ganha acesso a tudo, incluindo a BD. É o oposto de menor privilégio.' },
        { id: 'b', label: 'Um SG por camada, cada um a referenciar o SG da camada anterior como origem', correct: true,
          feedback: 'Correcto. Referenciar SGs em vez de CIDRs é o padrão da AWS: as regras mantêm-se válidas mesmo quando os IPs mudam, e o encadeamento força o tráfego a seguir o caminho previsto.',
          revealArtifacts: ['security'] },
        { id: 'c', label: 'SGs por CIDR de subnet, permitindo os ranges respectivos', correct: false,
          feedback: 'Funciona, mas é frágil: se acrescentares subnets ou mudares o desenho, tens de rever todas as regras. Referenciar SGs é auto-actualizável.' },
        { id: 'd', label: 'NACLs em vez de SGs, por serem ao nível da subnet', correct: false,
          feedback: 'NACLs são stateless e obrigam a regras nos dois sentidos, o que é propenso a erro. A prática recomendada é SGs para o controlo principal e NACLs como camada adicional para casos específicos.' },
      ],
      teachingNote: 'Referenciar SGs (origem = sg-web) em vez de CIDRs cria uma cadeia explícita: ALB → Web → App → BD. Cada camada só aceita da anterior, e as regras continuam correctas quando a infraestrutura muda.',
    },
    {
      id: 'step-5',
      prompt: 'A aplicação vai fazer milhões de leituras do S3. Como evitas que isso passe pelo NAT Gateway?',
      revealArtifacts: ['security'],
      options: [
        { id: 'a', label: 'Mover os servidores de aplicação para subnets públicas', correct: false,
          feedback: 'Resolveria o custo de NAT expondo os servidores à internet — troca terrível. A superfície de ataque aumenta muito para poupar em transferência.' },
        { id: 'b', label: 'Criar um Gateway VPC Endpoint para S3', correct: true,
          feedback: 'Correcto. Gateway Endpoints para S3 e DynamoDB são gratuitos e funcionam por route table: o tráfego deixa de atravessar o NAT, poupando horas e GB processados.',
          revealArtifacts: [] },
        { id: 'c', label: 'Aumentar a capacidade do NAT Gateway', correct: false,
          feedback: 'O NAT Gateway escala sozinho — o problema não é capacidade, é custo. Cada GB processado é facturado desnecessariamente.' },
        { id: 'd', label: 'Usar S3 Transfer Acceleration', correct: false,
          feedback: 'Serve para acelerar uploads de utilizadores distantes através de edge locations. Não tem relação com tráfego interno da VPC nem com o NAT.' },
      ],
      teachingNote: 'Gateway Endpoints (S3 e DynamoDB) são gratuitos. Interface Endpoints (os restantes serviços) cobram por hora e por GB, mas continuam a compensar face ao NAT em volumes altos.',
    },
  ],

  resolution: {
    rootCause: 'Não é um incidente — é uma decisão de arquitectura. O desenho de rede é a fundação sobre a qual tudo o resto assenta, e várias das suas escolhas são difíceis ou impossíveis de reverter depois (o CIDR da VPC é imutável).',
    fix: 'VPC 10.0.0.0/16 evitando colisão com o on-premises; oito subnets em quatro camadas × duas AZs; route tables por camada com a BD sem rota externa; Security Groups encadeados por referência; e Gateway Endpoints para S3 e DynamoDB.',
    preventions: [
      'Planear o espaço de endereçamento a nível de organização antes de criar a primeira VPC — sobreposições de CIDR bloqueiam peering, VPN e Direct Connect',
      'Um NAT Gateway por AZ: partilhar um só cria dependência cross-AZ e um ponto de falha',
      'Gateway Endpoints para S3 e DynamoDB desde o início — são gratuitos e o retorno é imediato',
      'Definir a rede como código (Terraform ou CloudFormation) para o desenho ser reproduzível e revisível',
      'Activar VPC Flow Logs para ter visibilidade de tráfego aceite e rejeitado quando algo correr mal',
    ],
  },
};
