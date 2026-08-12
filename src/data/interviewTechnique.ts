export interface MistakeItem {
  title: string;
  signs: string[];
  fix: string;
}

export interface MistakeSection {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  items: MistakeItem[];
}

/**
 * Adaptado do apêndice "Common Mistakes to Avoid During DevOps Interviews"
 * de «DevOps Interview Mastery» (Arvind Verma, 2026), traduzido para pt-PT.
 */
export const MISTAKE_SECTIONS: MistakeSection[] = [
  {
    id: 'technical',
    title: 'Conhecimento técnico',
    emoji: '🔧',
    intro: 'Os erros que aparecem quando o entrevistador faz a segunda pergunta de seguimento.',
    items: [
      {
        title: 'Alegar perícia numa ferramenta que só leste',
        signs: [
          'Dizer "sei Terraform" mas não conseguir explicar o que acontece quando há drift no state',
          'Entrevistadores sondam em profundidade — a superfície descobre-se em duas perguntas',
        ],
        fix: 'Para cada ferramenta no teu currículo, prepara quatro coisas: que problema resolve, porque a escolheste, um exemplo real de uso, e quais são as suas limitações.',
      },
      {
        title: 'Responder ao "o quê" sem responder ao "porquê"',
        signs: [
          'Dizer "usaria EKS" sem explicar porquê EKS em vez de ECS, Fargate ou VMs',
          'Descrever o que a ferramenta faz, mas não porque a tua equipa a escolheu naquele contexto',
          'Não ligar decisões técnicas a resultados de negócio (custo, fiabilidade, velocidade)',
          'Dar definições de manual em vez de uso real e trade-offs',
        ],
        fix: 'Segue sempre o padrão: "Usámos X porque [problema], o que resultou em [resultado — com números]".',
      },
      {
        title: 'Conhecimento fraco de CI/CD',
        signs: [
          'Alegar experiência mas não conseguir desenhar um pipeline completo do commit à produção',
          'Não saber lidar com falhas de pipeline, estratégias de rollback ou versionamento de artefactos',
          'Não distinguir Continuous Integration, Delivery e Deployment',
          'Não saber explicar como se injectam secrets sem os pôr em código',
        ],
        fix: 'Constrói 2-3 pipelines reais de raiz (um com Jenkins, um com GitHub Actions). Consegue desenhar o fluxo inteiro num quadro.',
      },
      {
        title: 'Kubernetes à superfície',
        signs: [
          'Decorar termos sem perceber os mecanismos por baixo',
          'Confundir Pods, Deployments, ReplicaSets e StatefulSets — e quando usar cada um',
          'Não saber explicar como um Service encaminha tráfego (label selectors, endpoints)',
          'Não conseguir debugar Pending, ImagePullBackOff ou OOMKilled',
          'Não perceber a diferença entre requests e limits — e porque ambos importam',
        ],
        fix: 'Corre um cluster real (minikube, kind ou EKS). Parte coisas de propósito e arranja-as. Debugar ao vivo é o que distingue candidatos fortes.',
      },
      {
        title: 'Ignorar segurança',
        signs: [
          'Guardar secrets em variáveis de ambiente, código ou imagens Docker',
          'Não saber o que são SAST, DAST ou SCA, nem como integrá-los',
          'Não mencionar scan de imagens nem menor privilégio',
        ],
        fix: 'Integra pelo menos um scanner (Trivy) e um gestor de secrets (Vault) num projecto teu. Segurança é responsabilidade de todos, não de uma equipa separada.',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Comunicação e comportamento',
    emoji: '💬',
    intro: 'DevOps é colaborativo por natureza. A forma como falas do teu trabalho conta tanto como o trabalho.',
    items: [
      {
        title: 'Respostas vagas e teóricas',
        signs: [
          'Responder a "como lidas com uma falha em produção?" com passos genéricos em vez de uma história real',
          'Dizer "estava lento" em vez de "a latência P99 saltou de 80ms para 4 segundos"',
          'Descrever projectos sem separar o teu contributo do da equipa',
          'Dizer "melhorámos a performance" em vez de "reduzimos o build de 18 para 4 minutos com layer caching"',
        ],
        fix: 'Para cada área técnica, prepara pelo menos uma história STAR (Situação, Tarefa, Acção, Resultado) com números reais, ferramentas usadas, e o que tu fizeste.',
      },
      {
        title: 'A armadilha do "eu"',
        signs: [
          'Apresentar-te como herói solitário — é sinal de alerta num papel colaborativo',
          'Nunca mencionar como trabalhaste com developers, QA, segurança ou negócio',
          'Não explicar como comunicaste mudanças de infraestrutura ou janelas de indisponibilidade',
          'Sem exemplos de partilha de conhecimento, runbooks ou mentoria',
        ],
        fix: 'Usa "eu liderei" e "nós implementámos" com precisão. Mostra onde foste dono da decisão e onde colaboraste.',
      },
    ],
  },
  {
    id: 'preparation',
    title: 'Preparação',
    emoji: '📋',
    intro: 'A maioria prepara-se para as perguntas erradas, ou para o nível errado de profundidade.',
    items: [
      {
        title: 'Preparar só o "o quê", não o "como" e o "porquê"',
        signs: [
          'Decorar definições sem saber aplicação real',
          'Não preparar seguimentos — cada resposta abre três perguntas novas',
          'Estudar documentação sem nunca construir nada',
          'Congelar em variações pouco comuns das perguntas habituais',
        ],
        fix: 'Para cada tópico, prepara três níveis: (1) o que é, (2) como funciona por dentro, (3) quando usar, quando não usar, e o que pode correr mal.',
      },
      {
        title: 'Não investigar a empresa',
        signs: [
          'Não saber que cloud a empresa usa',
          'Não ler bem a descrição da vaga — preparaste Jenkins e eles usam GitLab CI',
          'Não saber se correm Kubernetes, ECS ou bare-metal, o que torna os exemplos irrelevantes',
          'Não perceber o produto, e ficar sem perguntas inteligentes no fim',
        ],
        fix: 'Investiga a stack pelo blog de engenharia, LinkedIn, GitHub e outras vagas publicadas. Adapta os exemplos ao contexto deles.',
      },
    ],
  },
  {
    id: 'mindset',
    title: 'Mentalidade',
    emoji: '🧠',
    intro: 'O que revela se percebes DevOps ou só as ferramentas.',
    items: [
      {
        title: 'Tratar DevOps como uma colecção de ferramentas',
        signs: [
          'Dizer "DevOps é Docker + Kubernetes + Jenkins" — sinal de alerta grave para entrevistadores séniores',
          'Não perceber que se trata de quebrar silos, propriedade partilhada e ciclos de feedback curtos',
          'Não conseguir enunciar as quatro métricas DORA',
        ],
        fix: 'Consegue dizer: "DevOps é encurtar o ciclo entre escrever código e entregar valor, com responsabilidade partilhada pela fiabilidade e qualidade." Depois demonstra com exemplos.',
      },
      {
        title: 'Não mostrar curiosidade',
        signs: [
          'Não mencionar nada que tenhas aprendido recentemente',
          'Não saber o que mudou no último ano (ex: Karpenter a substituir o Cluster Autoscaler)',
          'Não ter opinião sobre debates actuais da área',
        ],
        fix: 'Tem sempre pronta uma coisa que aprendeste no último mês e porque te interessou. Séniores contratam para os próximos cinco anos, não para os de ontem.',
      },
    ],
  },
  {
    id: 'execution',
    title: 'Execução no dia',
    emoji: '🎬',
    intro: 'Erros que não têm nada a ver com o que sabes.',
    items: [
      {
        title: 'Responder depressa demais',
        signs: [
          'Saltar para a resposta antes de perceber a pergunta toda',
          'Não fazer perguntas de clarificação quando o cenário é ambíguo',
          'Dar a resposta errada com confiança por não teres parado para pensar',
        ],
        fix: 'É perfeitamente aceitável — e respeitado — dizer: "Boa pergunta. Dá-me 30 segundos para pensar nisto direito." Entrevistadores preferem uma resposta ponderada a uma rápida e errada.',
      },
      {
        title: 'Não estruturar a resposta',
        signs: [
          'Divagar cinco minutos sem princípio, meio e fim',
          'Misturar vários temas numa resposta',
          'Aprofundar um detalhe e saltar a resposta principal',
        ],
        fix: 'Começa com uma frase de resumo, depois expande. "A minha abordagem seria X. Porquê: [detalhes]. Na prática fiz isto em [empresa] quando [história]."',
      },
      {
        title: 'Esquecer monitorização, rollback e segurança',
        signs: [
          'Desenhar uma solução sem dizer como se observa se está a funcionar',
          'Não mencionar como se reverte quando corre mal',
          'Deixar segurança de fora do desenho',
        ],
        fix: 'Fecha toda a proposta de solução com estes três. Em produção não são opcionais — mencioná-los mostra maturidade operacional.',
      },
    ],
  },
  {
    id: 'by-level',
    title: 'Por nível de experiência',
    emoji: '📈',
    intro: 'O que se espera muda conforme a senioridade — e é aqui que muitos se posicionam mal.',
    items: [
      {
        title: 'Junior / entrada',
        signs: [
          'Alegar experiência sénior com 1-2 anos de aprendizagem',
          'Não ter portfolio — sem repositórios, sem projectos pessoais',
          'Esperar ser avaliado só por conhecimento teórico',
          'Não demonstrar vontade de aprender — juniores são contratados pelo potencial',
        ],
        fix: 'Constrói um portfolio no GitHub: um projecto Terraform que provisiona uma aplicação de três camadas, um pipeline, e um deployment Kubernetes com Helm. Isto fala mais alto do que certificações.',
      },
      {
        title: 'Intermédio (3-5 anos)',
        signs: [
          'Não demonstrar propriedade — usaste as ferramentas, mas desenhaste sistemas com elas?',
          'Não conseguir explicar decisões: "o arquitecto escolheu, eu só implementei"',
          'Histórias fracas de resposta a incidentes — nunca foste o primeiro respondente',
          'Sem exemplos de melhorar sistemas existentes (custo, performance, fiabilidade)',
        ],
        fix: 'Prepara pelo menos uma história em que tomaste a decisão de arquitectura, e uma em que foste tu a conduzir um incidente do início ao fim.',
      },
    ],
  },
];

export interface PhrasePair {
  bad: string;
  good: string;
}

export const PHRASE_PAIRS: PhrasePair[] = [
  { bad: '"Não sei." (e silêncio)', good: '"Não fiz isso especificamente, mas eis como raciocinaria..."' },
  { bad: '"Usámos Jenkins."', good: '"Escolhemos Jenkins porque a equipa precisava de X flexibilidade — deu-nos Y resultado."' },
  { bad: '"Sou especialista em tudo."', good: '"Sou mais forte em AWS e Terraform — tenho conhecimento funcional de GCP."' },
  { bad: '"Isso foi trabalho da minha equipa."', good: '"Eu liderei o desenho; os colegas implementaram a integração."' },
  { bad: '"Depende." (sem seguimento)', good: '"Depende de X e Y — se X, escolho A; se Y, escolho B."' },
  { bad: '"Nunca tive um incidente em produção."', good: '"Tive sorte, mas participei em revisões de incidente e eis o que aprendi..."' },
  { bad: '"Só segui a documentação."', good: '"Comecei pela documentação e adaptei às nossas restrições — eis o que mudei e porquê."' },
  { bad: '"Kubernetes é melhor que Docker Swarm."', good: '"Para a nossa escala e experiência da equipa, o EKS deu-nos melhor autoscaling e ecossistema."' },
  { bad: '"Fiz tudo sozinho."', good: '"Conduzi a iniciativa e colaborei com a equipa de segurança e os developers."' },
  { bad: '"Aprendo depressa." (sem prova)', good: '"Aprendi Terraform em 3 semanas e pus infraestrutura em produção — eis o repositório."' },
];

export const GOLDEN_RULES: string[] = [
  'Nunca finjas profundidade — a superfície descobre-se em duas perguntas de seguimento.',
  'Liga sempre ao impacto de negócio — cada ferramenta existe para resolver um problema real.',
  'Mostra o raciocínio, não só a resposta — contrata-se por julgamento.',
  'Admite lacunas com honestidade — e emparelha com "eis como as fecharia".',
  'Prepara histórias de falha — revelam carácter e capacidade de aprender.',
  'Usa números sempre — "mais rápido" não diz nada; "de 18 para 4 minutos" fica na memória.',
  'Investiga bem a empresa — adapta cada resposta à stack e à escala deles.',
  'DevOps é cultura primeiro, ferramentas depois — ancora o técnico na colaboração e na entrega.',
  'Pensa em sistemas, não em componentes — mostra como as peças se ligam, falham e recuperam.',
  'Fecha toda a solução com monitorização, rollback e segurança — não são negociáveis em produção.',
];

export interface ChecklistPhase {
  when: string;
  emoji: string;
  items: string[];
}

export const PRE_INTERVIEW_CHECKLIST: ChecklistPhase[] = [
  {
    when: 'Uma semana antes',
    emoji: '📅',
    items: [
      'Revê cada ferramenta do teu currículo — prepara-te para 10 minutos de perguntas profundas sobre cada',
      'Prepara 6 histórias STAR: sucesso, falha, conflito, liderança, aprendizagem e impacto de negócio',
      'Investiga a stack da empresa, o blog de engenharia e as vagas recentes',
      'Pratica desenhar de memória uma arquitectura de 3 camadas com HA e segurança',
      'Pratica explicar 5 conceitos a alguém não-técnico (CI/CD, containers, IaC, monitorização, GitOps)',
    ],
  },
  {
    when: 'Um dia antes',
    emoji: '🌙',
    items: [
      'Revê fundamentos de Linux, redes e comandos de debugging de Kubernetes',
      'Prepara 3-4 perguntas com substância para fazeres ao entrevistador',
      'Testa a partilha de ecrã e deixa o terminal pronto',
      'Dorme bem — o desempenho cognitivo cai cerca de 20% com privação de sono',
    ],
  },
  {
    when: 'No dia',
    emoji: '🎯',
    items: [
      'Entra 5-10 minutos antes',
      'Tem um bloco de notas para apontar detalhes dos cenários',
      'Para cada pergunta: pausa → clarifica se preciso → estrutura → responde',
    ],
  },
];

export const UNDER_PREPARED_TOPICS: { topic: string; note: string }[] = [
  { topic: 'Fundamentos de rede', note: 'subnets, CIDR, routing de VPC, security groups vs NACLs' },
  { topic: 'Gestão de state do Terraform', note: 'locking, backends remotos, drift, recuperação de corrupção' },
  { topic: 'Recursos em Kubernetes', note: 'requests vs limits, classes QoS, comportamento de eviction' },
  { topic: 'Segurança em pipelines', note: 'injecção de secrets, scan de imagens, integração SAST/DAST' },
];
