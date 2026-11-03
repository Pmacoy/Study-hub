import type { ChallengeScenario } from '../../types/scenario';

export const systemDesignReplicationLag: ChallengeScenario = {
  id: 'system-design-replication-lag',
  domain: 'system-design',
  title: 'Comentário Desaparece (Replication Lag)',
  hook: 'Utilizadores de uma nova rede social reportam um bug estranho: quando submetem um comentário num post e são redirecionados de volta para a página, o comentário desaparece. Mas, se fizerem refresh da página 2 segundos depois, o comentário já aparece.',
  difficulty: 'mid',
  timeEstimateMin: 5,
  tags: ['system-design', 'databases', 'replication', 'consistency', 'architecture'],

  artifacts: [
    {
      id: 'db-architecture',
      label: 'Arquitetura de Base de Dados',
      language: 'yaml',
      content: `Cluster: MySQL
Configuração: Async Replication
Nós:
  - Primário (Escrita): db-master.prod.local
  - Réplica 1 (Leitura): db-replica-1.prod.local
  - Réplica 2 (Leitura): db-replica-2.prod.local`,
    },
    {
      id: 'app-code',
      label: 'Controller do Comentário',
      language: 'javascript',
      content: `// 1. Recebe POST e grava
async function postComment(req, res) {
  const { userId, postId, text } = req.body;
  // dbMaster é a conexão write
  await dbMaster.query('INSERT INTO comments (user_id, post_id, text) VALUES (?, ?, ?)', [userId, postId, text]);
  
  // 2. Redireciona para o post para o utilizador ver o que escreveu
  return res.redirect(\`/post/\${postId}\`);
}

// 3. Renderiza a página (GET)
async function getPost(req, res) {
  const { postId } = req.params;
  // dbReplica faz load-balancing para as read replicas
  const comments = await dbReplica.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC', [postId]);
  return res.render('post', { comments });
}`,
    }
  ],

  diagnosisQuestion: 'Qual é o fenómeno arquitetural que está a causar o "desaparecimento" temporário dos comentários?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'Replication Lag (Consistência Eventual): O comentário é gravado no Master, o redirect é feito imediatamente, mas a réplica de leitura de onde a página faz o SELECT ainda não recebeu os dados através da replicação assíncrona.',
      correct: true,
      feedback: 'Correto! Num sistema de réplicas assíncronas, a replicação leva alguns milissegundos ou segundos. Quando o redirect ocorre de forma tão rápida, o servidor de leitura consulta uma base de dados que ainda está "atrasada", falhando ao satisfazer o paradigma Read-after-Write Consistency.'
    },
    {
      id: 'b',
      label: 'O utilizador está a perder a sessão e a página de leitura assume que ele não é o autor.',
      correct: false,
      feedback: 'O código mostra um \`SELECT * FROM comments\` que busca todos os comentários. Se fosse problema de sessão, o comentário não reapareceria 2 segundos depois num refresh.'
    },
    {
      id: 'c',
      label: 'Database Locking: A escrita no primário causa um Deadlock que impede as réplicas de lerem a tabela inteira.',
      correct: false,
      feedback: 'Se houvesse um deadlock ou lock exclusivo mantido, a leitura ficaria pendurada e faria timeout, não retornaria silenciosamente uma lista vazia ou desatualizada.'
    },
    {
      id: 'd',
      label: 'Cache Invalidation Bug: A cache HTTP do browser está a servir uma versão antiga da página.',
      correct: false,
      feedback: 'Embora possível, numa arquitetura descrita com Master e Read Replicas (onde os GETs vão expressamente para a Replica), a causa raiz padrão é o Replication Lag. Além disso, se fosse HTTP Cache forte, refreshes (F5) num browser muitas vezes ignoram-na. Mas o artifact de código explicita as queries Master vs Replica.'
    }
  ],

  fixQuestion: 'Como podemos garantir Read-After-Write Consistency sem sacrificar a performance de ter réplicas de leitura para todo o sistema?',
  fixOptions: [
    {
      id: 'a',
      label: 'Mandar o request de leitura subsequente (logo após a escrita) forçadamente para o Node Primário, ou passar os novos dados na sessão/estado temporário sem fazer query à BD.',
      correct: true,
      feedback: 'Perfeito! Abordagens comuns: 1) Pinning (o utilizador lê sempre do Primário durante N segundos após fazer uma escrita). 2) Passar o novo objeto no payload do Redirect e injetar na UI localmente.'
    },
    {
      id: 'b',
      label: 'Mudar a Replicação para modo Síncrono (Synchronous Replication) para todo o cluster.',
      correct: false,
      feedback: 'Replicação síncrona em todas as réplicas reduz drasticamente a disponibilidade e a velocidade das escritas. Se uma réplica estiver lenta, a escrita fica pendurada (latência massiva).'
    },
    {
      id: 'c',
      label: 'Fazer polling com setTimeout no backend: esperar 3 segundos antes de responder ao POST.',
      correct: false,
      feedback: 'Isto introduz latência terrível para o utilizador, estragando a experiência de utilização. A UI deve ser imediata.'
    },
    {
      id: 'd',
      label: 'Adicionar índices na tabela de comments.',
      correct: false,
      feedback: 'Índices ajudam com a performance de leitura/escrita, mas não removem a janela da replicação pela rede e o binlog apply delay nas réplicas assíncronas.'
    }
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O POST escreve no Master (`dbMaster`), e o GET lê da Réplica (`dbReplica`).'
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'A replicação de dados entre os nós não acontece à velocidade da luz. Existe um delta de tempo.'
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Este é o clássico problema de não ter "Read-after-Write Consistency". O utilizador tem de conseguir ler as suas próprias alterações instantaneamente.'
    }
  ],

  resolution: {
    rootCause: 'Replication Lag induzindo quebra de Read-After-Write Consistency. A escrita foi feita no nó principal, o utilizador foi redirecionado rapidamente, e a consulta GET (feita à réplica de leitura) foi executada antes do log de replicação MySQL ter atingido a réplica.',
    fix: 'Modificar a lógica de routing da DB: Se o utilizador X fez uma escrita recentemente (tracking via JWT/Cookies), encaminhar todas as leituras do utilizador X para o nó principal durante 5-10 segundos.',
    preventions: [
      'Padrão "Read-your-writes" (ler das primárias temporariamente pós-escrita)',
      'Optimistic UI Updates (adicionar o comentário ao DOM imediatamente via JavaScript, sem depender do load inicial do backend)',
      'Usar um datastore que forneça consistência forte (se trade-offs aceitáveis)',
    ]
  }
};
