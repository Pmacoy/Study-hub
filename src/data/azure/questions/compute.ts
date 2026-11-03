import type { Question } from '../../../types/exam';

/**
 * AZ-104 — Implementar e gerir recursos de computação (20-25% do exame).
 *
 * IDs a partir de 101 para não colidirem com os de examQuestions.ts (1-30),
 * deixando a faixa 31-100 livre para esse ficheiro crescer.
 */
export const computeQuestions: Question[] = [
  // ---------------------------------------------------------------- discos
  {
    id: 101,
    topic: 'compute',
    topicLabel: 'Discos Geridos',
    question:
      'Uma VM de produção precisa de latência inferior a um milissegundo e IOPS ajustáveis de forma independente do tamanho do disco. Que tipo de disco gerido deve escolher?',
    options: ['Standard HDD', 'Standard SSD', 'Premium SSD v2', 'Premium SSD (v1)'],
    correctIndex: 2,
    explanation:
      'O Premium SSD v2 permite configurar IOPS e débito independentemente da capacidade, ao contrário do Premium SSD v1, em que o desempenho está preso ao escalão de tamanho (P10, P20, etc.). O Ultra Disk também permitiria, mas é mais caro e tem mais restrições de região e de tamanho de VM.',
    difficulty: 'medium',
  },
  {
    id: 102,
    topic: 'compute',
    topicLabel: 'Discos Geridos',
    question:
      'Precisa de aumentar um disco de dados de 128 GB para 256 GB numa VM em produção. O que é necessário?',
    options: [
      'Nada — o redimensionamento é imediato e a quente',
      'Parar (desalocar) a VM, aumentar o disco e voltar a iniciar; depois expandir a partição dentro do SO',
      'Criar um disco novo e copiar os dados manualmente, pois discos não são redimensionáveis',
      'Converter primeiro o disco para Ultra Disk',
    ],
    correctIndex: 1,
    explanation:
      'Aumentar um disco gerido exige normalmente desalocar a VM. O Azure só altera o tamanho do disco; expandir o sistema de ficheiros para ocupar o espaço novo é um passo separado, feito dentro do sistema operativo. Reduzir um disco gerido não é possível de todo.',
    difficulty: 'medium',
  },
  {
    id: 103,
    topic: 'compute',
    topicLabel: 'Discos Geridos',
    question:
      'Que característica do disco de SO efémero (ephemeral OS disk) o torna inadequado para uma VM cujo estado deve sobreviver a uma paragem?',
    options: [
      'É mais lento que um disco gerido tradicional',
      'Não suporta encriptação',
      'Vive no armazenamento local do anfitrião e o conteúdo perde-se ao desalocar ou realocar a VM',
      'Só funciona com Windows Server',
    ],
    correctIndex: 2,
    explanation:
      'O disco efémero é gravado na cache do anfitrião físico, o que o torna rápido e sem custo de armazenamento — mas qualquer operação que mova a VM para outro anfitrião (desalocar, redimensionar, recuperação de falha) destrói o conteúdo. Serve para cargas sem estado, recriadas a partir de imagem.',
    difficulty: 'hard',
  },

  // ------------------------------------------------------- disponibilidade
  {
    id: 104,
    topic: 'compute',
    topicLabel: 'Alta Disponibilidade',
    question:
      'Qual é a diferença essencial entre um Availability Set e as Availability Zones?',
    options: [
      'O Availability Set distribui VMs por domínios de falha e atualização dentro de um datacenter; as Zones distribuem por datacenters fisicamente separados na mesma região',
      'São sinónimos; "Zones" é apenas o nome mais recente',
      'O Availability Set distribui por regiões diferentes; as Zones ficam sempre na mesma região',
      'As Zones só se aplicam a VMs Windows',
    ],
    correctIndex: 0,
    explanation:
      'O Availability Set protege contra falhas de rack e de manutenção planeada dentro de um único datacenter (domínios de falha e de atualização). As Availability Zones protegem contra a perda de um datacenter inteiro, distribuindo por instalações separadas com energia, arrefecimento e rede independentes.',
    difficulty: 'medium',
  },
  {
    id: 105,
    topic: 'compute',
    topicLabel: 'Alta Disponibilidade',
    question:
      'Que SLA de disponibilidade o Azure oferece para duas ou mais VMs distribuídas por Availability Zones diferentes?',
    options: ['99,9%', '99,95%', '99,99%', '100%'],
    correctIndex: 2,
    explanation:
      '99,99% para VMs em duas ou mais zonas. Um Availability Set com duas ou mais VMs dá 99,95%. Uma VM única com todos os discos em Premium SSD ou superior dá 99,9%. Saber estes três números de cor é típico de pergunta de exame.',
    difficulty: 'medium',
  },
  {
    id: 106,
    topic: 'compute',
    topicLabel: 'Alta Disponibilidade',
    question:
      'Tem uma VM já criada fora de qualquer Availability Set e precisa de a colocar num. O que tem de fazer?',
    options: [
      'Alterar a definição no portal, com a VM em funcionamento',
      'Parar a VM e mover através do menu "Configuration"',
      'Eliminar a VM mantendo os discos, e recriá-la já dentro do Availability Set',
      'Basta adicionar uma tag com o nome do Availability Set',
    ],
    correctIndex: 2,
    explanation:
      'A associação a um Availability Set só se define no momento da criação da VM. Para mover uma VM existente é necessário eliminá-la preservando os discos geridos, e criar uma VM nova a partir desses discos já dentro do conjunto. Este é um dos motivos para planear a disponibilidade antes de provisionar.',
    difficulty: 'hard',
  },

  // ------------------------------------------------------------ dimensões
  {
    id: 107,
    topic: 'compute',
    topicLabel: 'Tamanhos de VM',
    question:
      'O que caracteriza a série B (burstable) de máquinas virtuais do Azure?',
    options: [
      'Têm GPU dedicada para cargas de inferência',
      'Acumulam créditos de CPU quando funcionam abaixo da linha de base e gastam esses créditos em picos',
      'São garantidamente as VMs mais rápidas de cada região',
      'Só podem ser usadas em ambientes de produção com SLA reforçado',
    ],
    correctIndex: 1,
    explanation:
      'As VMs da série B destinam-se a cargas com utilização média baixa e picos ocasionais. Acumulam créditos enquanto estão abaixo da linha de base de CPU e consomem-nos durante os picos. Esgotados os créditos, o desempenho fica limitado à linha de base — o que as torna inadequadas para carga sustentada.',
    difficulty: 'medium',
  },
  {
    id: 108,
    topic: 'compute',
    topicLabel: 'Tamanhos de VM',
    question:
      'Ao tentar redimensionar uma VM, um determinado tamanho não aparece na lista disponível. Qual a explicação mais provável?',
    options: [
      'O tamanho pretendido não existe no cluster de hardware onde a VM está alojada; é preciso desalocar a VM primeiro',
      'A subscrição não tem permissões de escrita',
      'O tamanho só está disponível para VMs Linux',
      'É necessário abrir um pedido de suporte para qualquer redimensionamento',
    ],
    correctIndex: 0,
    explanation:
      'Com a VM em funcionamento, só são oferecidos tamanhos suportados pelo cluster físico atual. Desalocar a VM liberta-a desse cluster e alarga a lista de tamanhos possíveis. Se ainda assim faltar, é limitação de disponibilidade na região ou de quota da subscrição.',
    difficulty: 'medium',
  },
  {
    id: 109,
    topic: 'compute',
    topicLabel: 'Custos de Computação',
    question:
      'Uma carga de processamento em lote tolera ser interrompida e reiniciada mais tarde. Que opção reduz mais o custo?',
    options: [
      'Reserved Instances de 3 anos',
      'Azure Hybrid Benefit',
      'Spot Virtual Machines',
      'Dedicated Host',
    ],
    correctIndex: 2,
    explanation:
      'As Spot VMs usam capacidade não utilizada do Azure com descontos que podem chegar a 90%, mas podem ser despejadas (evicted) com pouco aviso quando o Azure precisa da capacidade. São adequadas exatamente para trabalho interrompível: lotes, testes, renderização. As Reserved Instances poupam, mas exigem compromisso de utilização contínua.',
    difficulty: 'easy',
  },
  {
    id: 110,
    topic: 'compute',
    topicLabel: 'Custos de Computação',
    question:
      'Requisitos de conformidade obrigam a que as VMs de uma aplicação corram em hardware físico não partilhado com outros clientes. Que recurso satisfaz este requisito?',
    options: [
      'Proximity Placement Group',
      'Azure Dedicated Host',
      'Availability Zone',
      'Isolated App Service Plan',
    ],
    correctIndex: 1,
    explanation:
      'O Azure Dedicated Host aloca um servidor físico inteiro à subscrição, sem partilha com outros inquilinos. O Proximity Placement Group serve para reduzir latência entre recursos, agrupando-os fisicamente — não garante isolamento. O App Service Plan Isolated resolve o mesmo problema, mas para App Services, não para VMs.',
    difficulty: 'medium',
  },

  // ---------------------------------------------------------------- escala
  {
    id: 111,
    topic: 'compute',
    topicLabel: 'Scale Sets',
    question:
      'Qual a diferença entre os modos de orquestração Uniform e Flexible num Virtual Machine Scale Set?',
    options: [
      'O Uniform trata as instâncias como idênticas a partir de um modelo; o Flexible permite VMs heterogéneas e adicionar VMs já existentes ao conjunto',
      'O Flexible é apenas para Linux e o Uniform apenas para Windows',
      'O Uniform suporta escala automática e o Flexible não',
      'Não há diferença funcional; Flexible é apenas o nome mais recente',
    ],
    correctIndex: 0,
    explanation:
      'O modo Uniform, mais antigo, gere instâncias idênticas geradas a partir de um modelo, e as instâncias não são objetos VM completos. O modo Flexible trata cada instância como uma VM normal do Azure, permite misturar tamanhos e até VMs Spot com VMs normais, e é o modo recomendado para cargas novas.',
    difficulty: 'hard',
  },
  {
    id: 112,
    topic: 'compute',
    topicLabel: 'Scale Sets',
    question:
      'Numa regra de escala automática de um Scale Set, para que serve o período de arrefecimento (cool-down)?',
    options: [
      'Reduz a frequência de relógio do processador para poupar energia',
      'Impede que novas ações de escala ocorram durante um intervalo definido, dando tempo às métricas para estabilizarem',
      'Define quanto tempo uma instância fica ligada antes de ser faturada',
      'Determina o tempo máximo que o Scale Set pode ficar acima do número máximo de instâncias',
    ],
    correctIndex: 1,
    explanation:
      'Sem cool-down, o Scale Set pode entrar em oscilação (flapping): adiciona instâncias, as métricas ainda não refletem o efeito, adiciona mais, e depois remove tudo de uma vez. O período de arrefecimento dá tempo para o efeito da ação anterior aparecer nas métricas antes de decidir a seguinte.',
    difficulty: 'medium',
  },

  // --------------------------------------------------------------- imagens
  {
    id: 113,
    topic: 'compute',
    topicLabel: 'Imagens',
    question:
      'Vai criar uma imagem personalizada a partir de uma VM Linux para servir de base a dezenas de VMs novas. Que passo precede a captura da imagem?',
    options: [
      'Executar `waagent -deprovision+user` para generalizar a VM',
      'Converter todos os discos para Standard HDD',
      'Ativar o Azure Backup na VM',
      'Mover a VM para outra região',
    ],
    correctIndex: 0,
    explanation:
      'Uma imagem para reutilização tem de ser generalizada: remover identificadores da máquina, chaves de anfitrião SSH e contas de utilizador específicas. Em Linux faz-se com `waagent -deprovision+user`; em Windows com o Sysprep. Uma imagem especializada (não generalizada) só serve para recriar aquela máquina concreta.',
    difficulty: 'medium',
  },
  {
    id: 114,
    topic: 'compute',
    topicLabel: 'Imagens',
    question:
      'Que vantagem o Azure Compute Gallery oferece sobre guardar uma imagem gerida solta?',
    options: [
      'Reduz o custo de armazenamento da imagem para zero',
      'Permite versionamento de imagens, replicação para várias regiões e partilha controlada por RBAC',
      'Converte automaticamente imagens Windows em imagens Linux',
      'Dispensa a generalização da VM de origem',
    ],
    correctIndex: 1,
    explanation:
      'O Compute Gallery (antes chamado Shared Image Gallery) acrescenta estrutura: definições de imagem, versões, replicação para as regiões onde as VMs vão nascer, e controlo de acesso por RBAC. Uma imagem gerida solta existe numa região só e não tem noção de versão.',
    difficulty: 'medium',
  },
  {
    id: 115,
    topic: 'compute',
    topicLabel: 'Extensões de VM',
    question:
      'Precisa de executar um script de configuração dentro de dezenas de VMs logo após o provisionamento, sem aceder a cada uma por SSH ou RDP. Qual é o mecanismo indicado?',
    options: [
      'Azure Automation Runbook com credenciais guardadas',
      'Custom Script Extension',
      'Azure Policy com efeito DeployIfNotExists',
      'Ligação manual via Azure Bastion',
    ],
    correctIndex: 1,
    explanation:
      'A Custom Script Extension descarrega e executa um script dentro da VM através do agente do Azure, sem exigir ligação de rede de entrada nem credenciais interativas. É o mecanismo padrão para configuração pós-provisionamento e integra-se com modelos ARM e Terraform.',
    difficulty: 'easy',
  },

  // ---------------------------------------------------------- App Service
  {
    id: 116,
    topic: 'compute',
    topicLabel: 'App Service',
    question:
      'A partir de que escalão de App Service Plan ficam disponíveis os slots de implementação (deployment slots)?',
    options: ['Free', 'Shared', 'Basic', 'Standard'],
    correctIndex: 3,
    explanation:
      'Os slots exigem o escalão Standard ou superior (Standard, Premium, Isolated). Os escalões Free e Shared não suportam nem slots nem escala automática, e o Basic permite escala manual mas não slots.',
    difficulty: 'medium',
  },
  {
    id: 117,
    topic: 'compute',
    topicLabel: 'App Service',
    question:
      'Qual a principal vantagem operacional de fazer um "swap" entre o slot de staging e o de produção, em vez de publicar diretamente em produção?',
    options: [
      'O swap é mais barato porque não consome instâncias',
      'A aplicação é aquecida no slot de staging antes de receber tráfego, e a reversão é imediata trocando de novo',
      'O swap aplica automaticamente as migrações de base de dados',
      'Só o swap permite usar domínios personalizados',
    ],
    correctIndex: 1,
    explanation:
      'No swap, as instâncias do slot de staging já estão iniciadas e aquecidas quando passam a receber tráfego de produção, eliminando o arranque a frio. E como o conteúdo antigo passa para o slot de staging, reverter é apenas repetir o swap — o que torna o rollback uma operação de segundos.',
    difficulty: 'medium',
  },
  {
    id: 118,
    topic: 'compute',
    topicLabel: 'App Service',
    question:
      'Várias Web Apps partilham o mesmo App Service Plan. O que acontece quando uma delas consome muita CPU?',
    options: [
      'Nada; cada Web App tem recursos isolados',
      'As restantes aplicações do mesmo plano competem pelos mesmos recursos de computação e podem degradar',
      'O Azure move automaticamente a aplicação para outro plano',
      'A aplicação com mais consumo é encerrada automaticamente',
    ],
    correctIndex: 1,
    explanation:
      'O App Service Plan é o conjunto de máquinas onde as aplicações correm. Todas as Web Apps do mesmo plano partilham CPU, memória e instâncias. Isolar uma aplicação crítica significa colocá-la num plano próprio — decisão que pesa diretamente no custo.',
    difficulty: 'easy',
  },

  // ---------------------------------------------------------- contentores
  {
    id: 119,
    topic: 'containers',
    topicLabel: 'Container Instances',
    question:
      'Qual cenário justifica o Azure Container Instances (ACI) em vez do Azure Kubernetes Service (AKS)?',
    options: [
      'Uma aplicação com dezenas de microserviços que precisam de descoberta de serviço e escala automática',
      'Uma tarefa pontual e de curta duração que precisa de arrancar depressa e ser faturada ao segundo',
      'Qualquer carga em produção, por ser mais fiável',
      'Aplicações que exigem malha de serviço (service mesh)',
    ],
    correctIndex: 1,
    explanation:
      'O ACI executa contentores sem qualquer orquestrador e sem infraestrutura para gerir, com faturação ao segundo. É adequado a tarefas isoladas, trabalhos em lote e picos. Assim que houver necessidade de orquestração, escala, descoberta de serviço ou atualizações graduais, o AKS é a escolha.',
    difficulty: 'easy',
  },
  {
    id: 120,
    topic: 'containers',
    topicLabel: 'Container Registry',
    question:
      'Qual a forma recomendada de permitir que um cluster AKS descarregue imagens de um Azure Container Registry, sem guardar credenciais?',
    options: [
      'Ativar o utilizador administrador do ACR e colocar a palavra-passe num imagePullSecret',
      'Atribuir a role AcrPull à identidade gerida do kubelet do cluster',
      'Tornar o registry público',
      'Copiar as imagens para o disco de cada nó',
    ],
    correctIndex: 1,
    explanation:
      'A atribuição da role AcrPull à identidade gerida do kubelet elimina qualquer segredo. O utilizador administrador do ACR gera uma palavra-passe de longa duração que teria de ser guardada num Secret do Kubernetes — exatamente o tipo de credencial estática que se pretende evitar.',
    difficulty: 'medium',
  },
  {
    id: 121,
    topic: 'containers',
    topicLabel: 'AKS',
    question:
      'Num cluster AKS, que consequência tem alterar o tamanho da VM (vm_size) do node pool de sistema?',
    options: [
      'A alteração é aplicada a quente, sem impacto',
      'Exige recriação do node pool; sem um mecanismo de rotação, pode implicar recriar o cluster',
      'Só é possível aumentando o número de nós ao mesmo tempo',
      'O Azure recusa a operação em qualquer circunstância',
    ],
    correctIndex: 1,
    explanation:
      'O tamanho da VM de um node pool é imutável. Alterá-lo obriga a substituir o pool: cria-se um pool temporário, migram-se as cargas, recria-se o pool no tamanho novo e remove-se o temporário. Ferramentas de IaC dão mecanismos para isso (no Terraform, `temporary_name_for_rotation`); sem eles, a alteração pode destruir o cluster.',
    difficulty: 'hard',
  },

  // ------------------------------------------------------------- ARM/Bicep
  {
    id: 122,
    topic: 'compute',
    topicLabel: 'Modelos ARM',
    question:
      'Qual a diferença entre os modos de implementação Incremental e Complete num modelo ARM?',
    options: [
      'O Incremental valida o modelo sem aplicar; o Complete aplica',
      'O Incremental deixa intactos os recursos do resource group que não constam do modelo; o Complete elimina-os',
      'O Complete é mais rápido porque não verifica o estado atual',
      'O Incremental só funciona com Bicep',
    ],
    correctIndex: 1,
    explanation:
      'No modo Incremental (o predefinido) os recursos existentes que não aparecem no modelo são preservados. No modo Complete, tudo o que está no resource group e não está no modelo é eliminado. Escolher Complete sem perceber isto é uma causa clássica de perda acidental de recursos.',
    difficulty: 'hard',
  },
  {
    id: 123,
    topic: 'compute',
    topicLabel: 'Bicep',
    question:
      'Que afirmação descreve corretamente a relação entre Bicep e modelos ARM?',
    options: [
      'Bicep é uma linguagem independente que comunica diretamente com a API do Azure, ignorando o ARM',
      'Bicep é uma linguagem declarativa que é transpilada para JSON de ARM antes da implementação',
      'Bicep substitui o Terraform e gere estado remoto de forma nativa',
      'Bicep só funciona para recursos de computação',
    ],
    correctIndex: 1,
    explanation:
      'O Bicep é uma camada de sintaxe sobre os modelos ARM: o código é transpilado para JSON de ARM e entregue ao mesmo motor de implementação. Não gere ficheiro de estado — ao contrário do Terraform, o estado desejado é comparado diretamente com o que existe no Azure.',
    difficulty: 'medium',
  },
  {
    id: 124,
    topic: 'compute',
    topicLabel: 'Modelos ARM',
    question:
      'Que operação permite ver que alterações um modelo ARM ou Bicep provocaria, antes de as aplicar?',
    options: [
      'az deployment group validate',
      'az deployment group what-if',
      'az deployment group export',
      'az deployment group cancel',
    ],
    correctIndex: 1,
    explanation:
      'A operação what-if apresenta as diferenças previstas entre o estado atual e o que o modelo descreve — o equivalente conceptual ao `terraform plan`. O `validate` apenas verifica se o modelo é sintaticamente válido e se os parâmetros estão corretos, sem comparar com a realidade.',
    difficulty: 'medium',
  },

  // -------------------------------------------------- segurança e operação
  {
    id: 125,
    topic: 'compute',
    topicLabel: 'Acesso a VMs',
    question:
      'Pretende permitir acesso RDP e SSH a VMs de uma VNet sem atribuir endereços IP públicos a essas máquinas. Que serviço resolve?',
    options: ['Azure Firewall', 'Azure Bastion', 'NAT Gateway', 'Application Gateway'],
    correctIndex: 1,
    explanation:
      'O Azure Bastion fornece acesso RDP e SSH através do portal, por TLS, a partir de uma sub-rede dedicada chamada obrigatoriamente AzureBastionSubnet. As VMs mantêm-se sem IP público e sem portas 3389 ou 22 expostas à internet.',
    difficulty: 'easy',
  },
  {
    id: 126,
    topic: 'compute',
    topicLabel: 'Encriptação',
    question:
      'Que afirmação distingue corretamente o Azure Disk Encryption (ADE) do Server-Side Encryption (SSE) para discos geridos?',
    options: [
      'O SSE encripta ao nível da plataforma de armazenamento e está ativo por omissão; o ADE encripta dentro do SO convidado com BitLocker ou dm-crypt',
      'São o mesmo mecanismo com nomes diferentes',
      'O ADE está ativo por omissão e o SSE tem de ser ativado manualmente',
      'O SSE só funciona com discos Standard HDD',
    ],
    correctIndex: 0,
    explanation:
      'O SSE é aplicado automaticamente pela plataforma a todos os discos geridos, com chaves geridas pela Microsoft ou pelo cliente. O ADE atua dentro da máquina virtual, usando BitLocker no Windows e dm-crypt no Linux, e exige um Key Vault para guardar as chaves. Podem coexistir.',
    difficulty: 'hard',
  },
  {
    id: 127,
    topic: 'compute',
    topicLabel: 'Operação de VMs',
    question:
      'Qual a diferença de faturação entre uma VM no estado "Stopped" e no estado "Stopped (deallocated)"?',
    options: [
      'Não há diferença; ambos param a faturação',
      'Em "Stopped" a VM continua a reservar o hardware e a ser faturada; em "Stopped (deallocated)" os recursos de computação são libertados e deixam de ser faturados',
      'Em "Stopped (deallocated)" o disco é eliminado',
      'Em "Stopped" a VM mantém o IP público dinâmico; em "deallocated" também',
    ],
    correctIndex: 1,
    explanation:
      'Parar a VM pelo sistema operativo deixa-a "Stopped", ainda a ocupar recursos alocados e ainda faturada. Só a desalocação, feita pelo portal, CLI ou PowerShell, liberta a computação e para a faturação — mantendo-se os custos de armazenamento dos discos. Um IP público dinâmico também se perde ao desalocar.',
    difficulty: 'medium',
  },
  {
    id: 128,
    topic: 'compute',
    topicLabel: 'Mobilidade',
    question:
      'Precisa de mover uma VM de produção da região West Europe para North Europe. Qual a abordagem suportada?',
    options: [
      'Alterar o campo "Location" nas propriedades da VM',
      'Usar o Azure Resource Mover ou o Azure Site Recovery para replicar e cortar para a região de destino',
      'Arrastar o recurso entre regiões no portal',
      'Não é possível; é obrigatório recriar tudo manualmente',
    ],
    correctIndex: 1,
    explanation:
      'A região de um recurso é imutável depois de criado. Mover uma VM entre regiões implica replicar os discos e recriar o recurso no destino — trabalho feito pelo Azure Resource Mover ou pelo Site Recovery, que tratam também das dependências (rede, IPs, discos).',
    difficulty: 'medium',
  },
  {
    id: 129,
    topic: 'compute',
    topicLabel: 'Operação de VMs',
    question:
      'O que é necessário para que uma VM possa ser gerida pelo Azure Update Manager e por extensões?',
    options: [
      'Ter um endereço IP público atribuído',
      'Ter o agente do Azure (Azure VM Agent / waagent) instalado e em execução',
      'Estar num Availability Set',
      'Usar exclusivamente discos Premium SSD',
    ],
    correctIndex: 1,
    explanation:
      'O agente do Azure é o canal pelo qual a plataforma comunica com o interior da VM: instala extensões, aplica configurações, reporta estado. Sem ele a VM funciona, mas fica opaca à gestão pela plataforma. Vem pré-instalado nas imagens do marketplace; em imagens personalizadas tem de ser garantido.',
    difficulty: 'medium',
  },
  {
    id: 130,
    topic: 'compute',
    topicLabel: 'Quotas',
    question:
      'Ao tentar criar a décima VM de uma família numa região, recebe um erro de quota excedida. Qual a resolução correta?',
    options: [
      'Mudar a subscrição para outro tenant',
      'Abrir um pedido de aumento de quota para aquela família de VM naquela região específica',
      'Eliminar VMs de outras regiões para libertar espaço',
      'Converter as VMs existentes para Spot',
    ],
    correctIndex: 1,
    explanation:
      'As quotas de vCPU são definidas por subscrição, por região e por família de VM. Exceder o limite de uma família numa região não é resolvido apagando recursos noutra região — é preciso pedir aumento de quota através do portal, no separador "Usage + quotas" da subscrição.',
    difficulty: 'easy',
  },
];
