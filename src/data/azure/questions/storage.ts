import type { Question } from '../../../types/exam';

/**
 * AZ-104 — Implementar e gerir armazenamento (15-20% do exame).
 *
 * IDs 131-160, a seguir aos de compute.ts (101-130).
 */
export const storageQuestions: Question[] = [
  // ---------------------------------------------------------- redundância
  {
    id: 131,
    topic: 'storage',
    topicLabel: 'Redundância',
    question:
      'Uma conta de armazenamento tem de sobreviver à perda total de um datacenter, mas os dados não podem sair da região por motivos de soberania. Que opção de redundância escolhe?',
    options: ['LRS', 'ZRS', 'GRS', 'RA-GRS'],
    correctIndex: 1,
    explanation:
      'O ZRS replica de forma síncrona por três zonas de disponibilidade dentro da mesma região — sobrevive à perda de um datacenter sem que os dados saiam da região. O GRS e o RA-GRS replicam para uma segunda região, o que viola o requisito de soberania. O LRS mantém as três cópias no mesmo datacenter.',
    difficulty: 'medium',
  },
  {
    id: 132,
    topic: 'storage',
    topicLabel: 'Redundância',
    question:
      'Qual a diferença prática entre GRS e RA-GRS?',
    options: [
      'O RA-GRS replica para duas regiões secundárias em vez de uma',
      'O RA-GRS permite ler a partir da região secundária a qualquer momento; no GRS a réplica só é acessível após failover',
      'O GRS é síncrono e o RA-GRS assíncrono',
      'O RA-GRS só está disponível para Azure Files',
    ],
    correctIndex: 1,
    explanation:
      'Ambos mantêm cópia numa região secundária, de forma assíncrona. A diferença é o acesso: com RA-GRS existe um endpoint de leitura secundário (`-secondary`) sempre disponível, útil para distribuir carga de leitura ou para ler durante uma indisponibilidade da região primária. No GRS simples, esse endpoint não existe.',
    difficulty: 'medium',
  },
  {
    id: 133,
    topic: 'storage',
    topicLabel: 'Redundância',
    question:
      'O que o GZRS combina?',
    options: [
      'ZRS na região primária e LRS na região secundária',
      'LRS na primária e ZRS na secundária',
      'ZRS nas duas regiões',
      'Três cópias LRS em três regiões diferentes',
    ],
    correctIndex: 0,
    explanation:
      'O GZRS dá o melhor dos dois: resistência à perda de uma zona na região primária (via ZRS) e resistência à perda da região inteira (via réplica LRS na região secundária). É a opção mais robusta e a mais cara.',
    difficulty: 'hard',
  },

  // ------------------------------------------------------------- camadas
  {
    id: 134,
    topic: 'storage',
    topicLabel: 'Camadas de Acesso',
    question:
      'Qual é o período mínimo de permanência antes de a eliminação de um blob na camada Archive gerar cobrança de remoção antecipada?',
    options: ['30 dias', '90 dias', '180 dias', 'Não existe período mínimo'],
    correctIndex: 2,
    explanation:
      'Archive exige 180 dias. A camada Cool exige 30 e a Cold exige 90. Eliminar ou mover um blob antes disso é permitido, mas cobra a diferença como penalização de remoção antecipada — detalhe que o exame gosta de testar em cenários de otimização de custo.',
    difficulty: 'medium',
  },
  {
    id: 135,
    topic: 'storage',
    topicLabel: 'Camadas de Acesso',
    question:
      'Um blob está na camada Archive e é preciso lê-lo com urgência. O que acontece?',
    options: [
      'A leitura é imediata, apenas com custo mais elevado',
      'É preciso reidratar (rehydrate) o blob para Hot ou Cool primeiro, o que demora até 15 horas na prioridade Standard',
      'O blob é perdido, pois o Archive é só escrita',
      'É preciso mudar a redundância da conta antes de ler',
    ],
    correctIndex: 1,
    explanation:
      'Dados em Archive estão offline e não são legíveis diretamente. A reidratação para Hot ou Cool demora até 15 horas na prioridade Standard, ou tipicamente menos de uma hora na prioridade High para blobs abaixo de 10 GB. Planear isto faz parte de decidir se o Archive serve para determinado dado.',
    difficulty: 'medium',
  },
  {
    id: 136,
    topic: 'storage',
    topicLabel: 'Ciclo de Vida',
    question:
      'Pretende mover automaticamente blobs para Cool após 30 dias sem modificação e eliminá-los após um ano. Qual o mecanismo?',
    options: [
      'Uma Azure Policy aplicada à conta de armazenamento',
      'Uma regra de Lifecycle Management na conta de armazenamento',
      'Um Azure Function com temporizador a percorrer os blobs',
      'Object Replication entre contas',
    ],
    correctIndex: 1,
    explanation:
      'O Lifecycle Management permite regras declarativas baseadas na idade ou no último acesso do blob, com ações de mudança de camada e eliminação. É nativo, sem custo de computação, e aplica-se por prefixo ou por blob index tag. A Azure Policy governa a configuração dos recursos, não o conteúdo deles.',
    difficulty: 'easy',
  },

  // ------------------------------------------------------------------ SAS
  {
    id: 137,
    topic: 'storage',
    topicLabel: 'SAS',
    question:
      'Qual tipo de SAS é assinado com credenciais do Microsoft Entra ID em vez da chave da conta?',
    options: ['Account SAS', 'Service SAS', 'User Delegation SAS', 'Ad-hoc SAS'],
    correctIndex: 2,
    explanation:
      'A User Delegation SAS é assinada com uma chave obtida por uma identidade do Entra ID, e por isso pode ser usada mesmo com a chave partilhada da conta desativada. Tem validade máxima de sete dias e é auditável por identidade — é a forma recomendada hoje.',
    difficulty: 'hard',
  },
  {
    id: 138,
    topic: 'storage',
    topicLabel: 'SAS',
    question:
      'Distribuiu uma Service SAS com validade de um ano e precisa de a revogar imediatamente, sem rodar a chave da conta. Como?',
    options: [
      'Não é possível; a única saída é rodar a chave da conta',
      'Se a SAS estiver associada a uma Stored Access Policy, basta alterar ou eliminar essa política',
      'Alterando a camada de acesso do container',
      'Ativando o soft delete no container',
    ],
    correctIndex: 1,
    explanation:
      'Uma SAS ad-hoc não pode ser revogada individualmente — só rodando a chave que a assinou, o que invalida todas as outras. Associá-la a uma Stored Access Policy ao nível do container dá um ponto de controlo: alterar a política revoga todas as SAS que dependem dela. Este é o motivo de existirem stored access policies.',
    difficulty: 'hard',
  },

  // ------------------------------------------------------------ identidade
  {
    id: 139,
    topic: 'storage',
    topicLabel: 'Acesso por Entra ID',
    question:
      'Definiu `shared_access_key_enabled = false` numa conta de armazenamento. Que consequência imediata isto tem?',
    options: [
      'Nenhuma; a definição é apenas informativa',
      'Qualquer acesso ao plano de dados passa a exigir identidade do Entra ID com role de dados atribuída; ferramentas configuradas com chave ou connection string deixam de funcionar',
      'A conta passa a ser pública',
      'Os blobs existentes são eliminados',
    ],
    correctIndex: 1,
    explanation:
      'Desativar a chave partilhada elimina a autenticação por chave e por connection string. Tudo o que toca o plano de dados — incluindo o próprio Terraform ao criar um container — passa a precisar de uma identidade do Entra ID com a role de dados adequada. É uma melhoria de segurança real, mas parte coisas que dependiam da chave.',
    difficulty: 'hard',
  },
  {
    id: 140,
    topic: 'storage',
    topicLabel: 'Acesso por Entra ID',
    question:
      'Uma identidade tem a role "Storage Blob Data Contributor" e recebe HTTP 403 ao tentar ler as propriedades do serviço de Queue da mesma conta. Porquê?',
    options: [
      'A role demora 24 horas a propagar',
      'As roles de dados do Storage são separadas por serviço; Blob não concede qualquer acesso a Queue, que exige uma role própria como "Storage Queue Data Reader"',
      'É necessário reiniciar a conta de armazenamento',
      'Queues não suportam autenticação por Entra ID',
    ],
    correctIndex: 1,
    explanation:
      'Blob, Queue, Table e File têm roles de dados distintas. Conceder acesso a blobs não concede acesso a filas. O caso é mais comum do que parece porque algumas ferramentas leem propriedades de vários serviços ao inspecionar uma conta, mesmo que a aplicação só use um deles.',
    difficulty: 'hard',
  },
  {
    id: 141,
    topic: 'storage',
    topicLabel: 'Acesso por Entra ID',
    question:
      'Um utilizador é Owner da subscrição mas recebe "AuthorizationPermissionMismatch" ao listar blobs pelo portal. Qual a causa provável?',
    options: [
      'O Owner é uma role do plano de CONTROLO; ler conteúdo de blobs exige uma role de DADOS, como Storage Blob Data Reader',
      'O portal não suporta contas de armazenamento',
      'A conta está na camada Archive',
      'Falta ativar o soft delete',
    ],
    correctIndex: 0,
    explanation:
      'Owner e Contributor permitem gerir o recurso — criar, configurar, eliminar a conta, e até ler as chaves. Não concedem acesso ao conteúdo através do Entra ID. Ler ou escrever blobs por identidade exige uma role de dados. É a distinção plano de controlo contra plano de dados, tema recorrente no exame.',
    difficulty: 'medium',
  },

  // ---------------------------------------------------------------- rede
  {
    id: 142,
    topic: 'storage',
    topicLabel: 'Rede',
    question:
      'Qual a diferença entre um Service Endpoint e um Private Endpoint para uma conta de armazenamento?',
    options: [
      'São o mesmo mecanismo com nomes diferentes',
      'O Service Endpoint mantém o acesso pelo endereço público, mas identifica a sub-rede de origem; o Private Endpoint atribui à conta um IP privado dentro da VNet',
      'O Private Endpoint é gratuito e o Service Endpoint é pago',
      'O Service Endpoint só funciona com Azure Files',
    ],
    correctIndex: 1,
    explanation:
      'Com Service Endpoint o tráfego continua a resolver para o endpoint público da conta, mas sai pela espinha dorsal da Azure com a identidade da sub-rede, permitindo que a firewall confie na sub-rede. Com Private Endpoint a conta ganha um IP dentro da VNet, o DNS passa a resolver para esse IP, e o acesso público pode ser desativado por completo.',
    difficulty: 'hard',
  },
  {
    id: 143,
    topic: 'storage',
    topicLabel: 'Rede',
    question:
      'Ativou a firewall da conta com `default_action = Deny` e agora a sua máquina local não consegue carregar ficheiros. Qual a correção adequada?',
    options: [
      'Desativar a firewall por completo',
      'Adicionar o endereço IP público de origem às regras de rede da conta, ou aceder a partir de uma sub-rede permitida',
      'Mudar a conta para LRS',
      'Criar uma SAS, que ignora a firewall',
    ],
    correctIndex: 1,
    explanation:
      'A firewall atua antes da autenticação: uma SAS válida não a contorna. É preciso autorizar a origem, seja por IP, por sub-rede com service endpoint, ou por private endpoint. Note que o "bypass" para serviços Azure de confiança cobre alguns serviços da plataforma, mas não a sua máquina.',
    difficulty: 'medium',
  },

  // ------------------------------------------------- proteção de dados
  {
    id: 144,
    topic: 'storage',
    topicLabel: 'Proteção de Dados',
    question:
      'Que combinação de funcionalidades é necessária para ativar o Point-in-Time Restore de blobs em bloco?',
    options: [
      'Apenas soft delete de blobs',
      'Versionamento de blobs, change feed e soft delete de blobs',
      'Apenas snapshots manuais',
      'Object replication entre duas contas',
    ],
    correctIndex: 1,
    explanation:
      'O Point-in-Time Restore reconstrói o estado de um container num instante passado e depende das três: o versionamento guarda as versões, o change feed regista a ordem das alterações, e o soft delete garante que os blobs eliminados ainda existem. Faltando uma, a funcionalidade não pode ser ativada.',
    difficulty: 'hard',
  },
  {
    id: 145,
    topic: 'storage',
    topicLabel: 'Proteção de Dados',
    question:
      'Qual a diferença entre o soft delete de blobs e o soft delete de containers?',
    options: [
      'São a mesma definição com dois nomes',
      'O soft delete de blobs recupera blobs eliminados individualmente; o de containers recupera um container inteiro eliminado, e não substitui o primeiro',
      'O soft delete de containers recupera também os blobs eliminados dentro dele antes da eliminação do container',
      'Só um deles pode estar ativo de cada vez',
    ],
    correctIndex: 1,
    explanation:
      'São definições independentes e complementares, cada uma com o seu período de retenção. Eliminar um container com o soft delete de blobs ativo mas o de containers desativado resulta em perda: o soft delete de blobs não protege contra a eliminação do container que os contém.',
    difficulty: 'hard',
  },
  {
    id: 146,
    topic: 'storage',
    topicLabel: 'Imutabilidade',
    question:
      'Requisitos regulatórios exigem que registos não possam ser alterados nem eliminados durante sete anos, nem por um administrador. Que funcionalidade responde?',
    options: [
      'Soft delete com retenção de 2555 dias',
      'Immutable storage com política de retenção baseada em tempo (WORM), bloqueada',
      'Blob versioning',
      'Um Resource Lock do tipo CanNotDelete na conta',
    ],
    correctIndex: 1,
    explanation:
      'O immutable storage implementa WORM (write once, read many). Uma política de retenção baseada em tempo, depois de bloqueada, não pode ser encurtada nem removida por ninguém, incluindo o Owner da subscrição — que é exatamente o que a conformidade exige. Soft delete e resource locks são reversíveis por quem tem permissões.',
    difficulty: 'medium',
  },

  // ------------------------------------------------------------- Files
  {
    id: 147,
    topic: 'storage',
    topicLabel: 'Azure Files',
    question:
      'Que protocolo é necessário para montar uma partilha do Azure Files a partir de clientes Linux com semântica POSIX completa?',
    options: ['SMB 3.0', 'NFS 4.1, disponível apenas no escalão Premium', 'FTP', 'iSCSI'],
    correctIndex: 1,
    explanation:
      'O Azure Files suporta SMB em todos os escalões e NFS 4.1 apenas em contas FileStorage Premium. O NFS dá semântica POSIX, mas não suporta autenticação por identidade nem encriptação em trânsito, pelo que exige acesso restrito por rede.',
    difficulty: 'medium',
  },
  {
    id: 148,
    topic: 'storage',
    topicLabel: 'Azure File Sync',
    question:
      'O que o cloud tiering do Azure File Sync faz num servidor de ficheiros no local?',
    options: [
      'Replica todos os ficheiros para a nuvem e apaga o servidor local',
      'Mantém localmente os ficheiros acedidos com frequência e substitui os restantes por ponteiros, libertando espaço em disco',
      'Converte o servidor de ficheiros numa VM do Azure',
      'Aumenta automaticamente o disco do servidor local',
    ],
    correctIndex: 1,
    explanation:
      'Com cloud tiering, o servidor local funciona como cache: os ficheiros frios são substituídos por ponteiros e o conteúdo fica apenas no Azure, sendo trazido de volta ao ser aberto. Permite um servidor com disco pequeno servir uma partilha muito maior do que ele.',
    difficulty: 'medium',
  },

  // ----------------------------------------------------- ferramentas
  {
    id: 149,
    topic: 'storage',
    topicLabel: 'Ferramentas',
    question:
      'Precisa de copiar 40 TB de dados para o Azure, mas a ligação de rede disponível demoraria meses. Qual a solução?',
    options: ['AzCopy com paralelismo elevado', 'Azure Import/Export ou Azure Data Box', 'Storage Explorer', 'Object Replication'],
    correctIndex: 1,
    explanation:
      'Acima de certos volumes, a transferência física é mais rápida que a rede. O Data Box é um dispositivo enviado pela Microsoft, preenchido no local e devolvido; o Import/Export usa discos fornecidos pelo cliente. O AzCopy é a ferramenta certa quando a rede chega, mas não resolve o limite de largura de banda.',
    difficulty: 'easy',
  },
  {
    id: 150,
    topic: 'storage',
    topicLabel: 'Ferramentas',
    question:
      'Qual comando do AzCopy é indicado para sincronizar uma pasta local com um container, transferindo apenas as diferenças?',
    options: ['azcopy copy', 'azcopy sync', 'azcopy make', 'azcopy bench'],
    correctIndex: 1,
    explanation:
      '`azcopy sync` compara origem e destino e transfere apenas o que mudou, podendo também eliminar no destino o que já não existe na origem. `azcopy copy` transfere sempre tudo o que for indicado, sem comparar.',
    difficulty: 'easy',
  },

  // ------------------------------------------------------------- conta
  {
    id: 151,
    topic: 'storage',
    topicLabel: 'Conta de Armazenamento',
    question:
      'Quais são as regras de nomenclatura de uma conta de armazenamento?',
    options: [
      'Entre 3 e 24 caracteres, apenas letras minúsculas e números, única globalmente em todo o Azure',
      'Entre 5 e 50 caracteres, aceita hífens, única dentro da subscrição',
      'Qualquer nome, desde que único dentro do resource group',
      'Entre 3 e 63 caracteres, aceita maiúsculas e pontos',
    ],
    correctIndex: 0,
    explanation:
      'O nome faz parte do FQDN público (`nome.blob.core.windows.net`), daí a unicidade global e a restrição a minúsculas e números. É a razão pela qual scripts de infraestrutura costumam acrescentar um sufixo aleatório ao nome.',
    difficulty: 'easy',
  },
  {
    id: 152,
    topic: 'storage',
    topicLabel: 'Conta de Armazenamento',
    question:
      'O que o Hierarchical Namespace acrescenta a uma conta de armazenamento?',
    options: [
      'Replicação automática para outra região',
      'Diretórios reais com operações atómicas de renomear e eliminar, transformando a conta em Azure Data Lake Storage Gen2',
      'Suporte a SMB',
      'Redução do custo por GB',
    ],
    correctIndex: 1,
    explanation:
      'Sem namespace hierárquico, "pastas" no Blob Storage são apenas prefixos no nome do blob, e renomear uma "pasta" implica reescrever todos os blobs. Com HNS, os diretórios existem de verdade e as operações sobre eles são atómicas — essencial para cargas analíticas. Tem de ser ativado na criação da conta.',
    difficulty: 'hard',
  },
  {
    id: 153,
    topic: 'storage',
    topicLabel: 'Tipos de Blob',
    question:
      'Que tipo de blob sustenta os discos geridos das máquinas virtuais?',
    options: ['Block blob', 'Append blob', 'Page blob', 'Table entity'],
    correctIndex: 2,
    explanation:
      'Os page blobs são otimizados para leitura e escrita aleatórias em intervalos de 512 bytes, que é o padrão de acesso de um disco. Os block blobs servem ficheiros e objetos; os append blobs são otimizados para acrescentar ao fim, típico de logs.',
    difficulty: 'medium',
  },
  {
    id: 154,
    topic: 'storage',
    topicLabel: 'Encriptação',
    question:
      'Qual afirmação sobre encriptação em repouso numa conta de armazenamento é correta?',
    options: [
      'Tem de ser ativada manualmente por conta',
      'Está sempre ativa e não pode ser desativada; a escolha disponível é entre chaves geridas pela Microsoft e chaves geridas pelo cliente num Key Vault',
      'Só se aplica a blobs, não a filas nem a ficheiros',
      'Exige o escalão Premium',
    ],
    correctIndex: 1,
    explanation:
      'O Storage Service Encryption é obrigatório e transparente, em todos os serviços da conta. O que o cliente controla é quem detém a chave: chaves geridas pela Microsoft por omissão, ou chaves próprias num Key Vault quando a conformidade exige controlo sobre a rotação e a revogação.',
    difficulty: 'medium',
  },
  {
    id: 155,
    topic: 'storage',
    topicLabel: 'Replicação',
    question:
      'Qual é o pré-requisito para configurar Object Replication entre duas contas de armazenamento?',
    options: [
      'As duas contas têm de estar na mesma região',
      'Versionamento de blobs ativo em ambas e change feed ativo na conta de origem',
      'As duas contas têm de usar GRS',
      'Um private endpoint em cada conta',
    ],
    correctIndex: 1,
    explanation:
      'A Object Replication copia block blobs de forma assíncrona entre contas, possivelmente em regiões diferentes. Depende do change feed na origem para saber o que mudou e do versionamento em ambas para manter consistência. Serve para aproximar dados dos consumidores ou separar leitura de escrita.',
    difficulty: 'hard',
  },
  {
    id: 156,
    topic: 'storage',
    topicLabel: 'Website Estático',
    question:
      'Ao ativar o alojamento de website estático numa conta de armazenamento, onde devem ser colocados os ficheiros?',
    options: [
      'Num container chamado `$web`, criado automaticamente',
      'Na raiz da conta de armazenamento',
      'Num container chamado `public`',
      'Em qualquer container com acesso anónimo ativado',
    ],
    correctIndex: 0,
    explanation:
      'Ativar a funcionalidade cria o container especial `$web` e expõe um endpoint próprio (`nome.z##.web.core.windows.net`). O conteúdo desse container passa a ser servido publicamente, com documento de índice e página de erro configuráveis — sem servidor nem plano de App Service.',
    difficulty: 'easy',
  },
  {
    id: 157,
    topic: 'storage',
    topicLabel: 'Metadados',
    question:
      'Qual a vantagem dos blob index tags sobre os metadados de blob?',
    options: [
      'Os index tags permitem pesquisar blobs por valor em toda a conta, sem percorrer a listagem',
      'Os index tags são gratuitos e os metadados são pagos',
      'Os metadados não suportam valores em texto',
      'Os index tags substituem as camadas de acesso',
    ],
    correctIndex: 0,
    explanation:
      'Metadados são pares chave-valor guardados com o blob, mas só legíveis blob a blob. Os index tags são indexados pelo serviço, permitindo consultas do tipo "todos os blobs com projeto = alfa" sem enumerar o container. Também podem servir de filtro em regras de lifecycle.',
    difficulty: 'hard',
  },
  {
    id: 158,
    topic: 'storage',
    topicLabel: 'Desempenho',
    question:
      'Uma aplicação exige latência de milissegundos de um dígito e faz muitas transações pequenas em blobs. Que configuração de conta serve?',
    options: [
      'StorageV2 Standard com camada Hot',
      'Conta Premium de block blobs (BlockBlobStorage)',
      'StorageV2 Standard com ZRS',
      'Conta Premium de page blobs',
    ],
    correctIndex: 1,
    explanation:
      'As contas Premium de block blobs usam SSD e destinam-se a cargas com transações pequenas e frequentes, onde a latência importa mais que o custo por GB. A camada Hot numa conta Standard reduz o custo por transação, mas não muda o meio físico nem a latência de base.',
    difficulty: 'medium',
  },
  {
    id: 159,
    topic: 'storage',
    topicLabel: 'Migração',
    question:
      'É possível alterar a redundância de uma conta de LRS para GRS depois de criada?',
    options: [
      'Não; a redundância é imutável',
      'Sim, LRS para GRS é uma conversão suportada no portal; já mudanças que envolvam ZRS podem exigir migração manual ou pedido de suporte',
      'Sim, qualquer combinação pode ser alterada instantaneamente',
      'Apenas em contas Premium',
    ],
    correctIndex: 1,
    explanation:
      'Conversões entre LRS, GRS e RA-GRS são feitas diretamente. Passar de ou para ZRS e GZRS é mais restrito: em alguns casos há conversão suportada, noutros é preciso migração manual copiando os dados para uma conta nova. Vale confirmar a matriz de conversões antes de escolher a redundância inicial.',
    difficulty: 'hard',
  },
  {
    id: 160,
    topic: 'storage',
    topicLabel: 'Acesso Anónimo',
    question:
      'Um container está definido com nível de acesso público "Blob", mas o acesso anónimo continua a ser recusado. Qual a causa mais provável?',
    options: [
      'O container precisa de ser recriado para a definição fazer efeito',
      'A conta de armazenamento tem `allowBlobPublicAccess` desativado, o que anula qualquer definição de acesso público ao nível do container',
      'O nível "Blob" só permite escrita, não leitura',
      'Falta atribuir a role Storage Blob Data Reader ao utilizador anónimo',
    ],
    correctIndex: 1,
    explanation:
      'Existem dois interruptores em série. Ao nível da conta, `allowBlobPublicAccess` decide se o acesso anónimo é sequer possível; ao nível do container, escolhe-se entre privado, "Blob" (leitura de blobs individuais por URL conhecido) e "Container" (que acrescenta listagem). Com o interruptor da conta desligado, nenhuma configuração de container consegue expor conteúdo — e é assim que deve ficar por omissão.',
    difficulty: 'hard',
  },
];
