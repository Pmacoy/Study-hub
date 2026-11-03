import type { ChallengeScenario } from '../../types/scenario';

export const systemDesignCacheStampede: ChallengeScenario = {
  id: 'system-design-cache-stampede',
  domain: 'system-design',
  title: 'Database Crash por Cache Stampede',
  hook: 'Numa campanha de Black Friday, o tráfego do e-commerce disparou. De repente, a base de dados PostgreSQL primária atingiu 100% de CPU e o site foi abaixo. A monitorização mostra que a cache Redis tem um hit rate de 99%, mas houve um pico anómalo de ligações à BD exatamente quando a chave de cache da "HomePage" expirou.',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['system-design', 'caching', 'redis', 'database', 'scalability'],

  artifacts: [
    {
      id: 'redis-metrics',
      label: 'Redis Cache Metrics',
      language: 'json',
      content: `{
  "cache_hits": 99450,
  "cache_misses": 550,
  "evicted_keys": 12,
  "expired_keys": 1
}
// 1 chave expirou no minuto do incidente: a HomePage.`,
    },
    {
      id: 'postgres-metrics',
      label: 'PostgreSQL Active Connections',
      language: 'bash',
      content: `09:00:00 - 15 connections
09:00:01 - 18 connections
09:00:02 - 520 connections (MAX_CONNECTIONS EXCEEDED)
09:00:03 - FATAL: sorry, too many clients already`,
    },
    {
      id: 'app-code',
      label: 'HomePage Controller (Node.js)',
      language: 'javascript',
      content: `async function getHomePageData(req, res) {
  const cacheKey = 'home_page_data';
  let data = await redis.get(cacheKey);
  
  if (!data) {
    // Cache miss - fetching from DB
    data = await db.query(COMPLEX_HOME_PAGE_QUERY);
    await redis.set(cacheKey, data, 'EX', 3600); // 1 hour TTL
  }
  
  return res.json(data);
}`,
    }
  ],

  diagnosisQuestion: 'O que causou o pico repentino de conexões que derrubou a base de dados?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'Cache Stampede (Thundering Herd): Quando a chave da HomePage expirou, milhares de requests simultâneos viram a cache vazia (miss) e tentaram consultar a base de dados pesada ao mesmo tempo.',
      correct: true,
      feedback: 'Correto! Num site de alto tráfego, quando uma chave muito acedida expira, todos os pedidos desse milissegundo resultam em cache miss. Como a query é pesada e demora algum tempo, milhares de pedidos abrem ligações à base de dados para recalcular o mesmo valor antes que a cache seja repovoada, esgotando o pool de conexões.'
    },
    {
      id: 'b',
      label: 'Connection Leak: A aplicação Node.js tem uma fuga de ligações à BD (não fecha as conexões após usar).',
      correct: false,
      feedback: 'Se fosse connection leak, veríamos um aumento gradual ao longo do tempo. O pico ocorreu subitamente num único segundo (de 18 para 520) exatamente quando a chave expirou, apontando para o Thundering Herd problem.'
    },
    {
      id: 'c',
      label: 'O Redis foi abaixo (OOM) e redirecionou todo o tráfego para o PostgreSQL.',
      correct: false,
      feedback: 'As métricas mostram um cache_hit elevado (99450) e apenas 1 chave expirada, provando que o Redis esteve sempre a funcionar. O problema ocorreu na lógica da aplicação durante um cache miss concorrente.'
    },
    {
      id: 'd',
      label: 'DDoS Attack à Base de Dados.',
      correct: false,
      feedback: 'O aumento de ligações foi devido ao tráfego legítimo da Black Friday mal gerido. A correlação entre a chave expirada da homepage e o pico na BD é o indicador claro de um Cache Stampede.'
    }
  ],

  fixQuestion: 'Qual a melhor forma arquitetural de prevenir este problema no futuro?',
  fixOptions: [
    {
      id: 'a',
      label: 'Implementar "Cache Locking" (Mutex) ou um "Background Refresh" com TTL aleatório (Jitter).',
      correct: true,
      feedback: 'Excelente! Usar um lock (ex: Redis setnx) garante que, no caso de cache miss, apenas 1 thread recalcula o valor na DB, enquanto os outros esperam ou recebem valor obsoleto. Alternativamente, regenerar em background (Cron) impede que pedidos dos utilizadores sofram misses.'
    },
    {
      id: 'b',
      label: 'Aumentar o max_connections do PostgreSQL para 10000.',
      correct: false,
      feedback: 'Aumentar o limite não resolve o facto de 500+ threads estarem a correr uma query pesada. Apenas iria consumir todos os recursos (CPU/RAM) do PostgreSQL de forma ainda mais severa. A DB continuaria a crashar.'
    },
    {
      id: 'c',
      label: 'Aumentar o TTL da cache para 1 ano e invalidá-la manualmente.',
      correct: false,
      feedback: 'Isto não resolve a concorrência na primeira geração (cold start) nem quando ocorrer a invalidação manual, que geraria o mesmo stampede.'
    },
    {
      id: 'd',
      label: 'Adicionar mais réplicas ao cluster Redis.',
      correct: false,
      feedback: 'A cache já está saudável. O problema é a forma como a aplicação reage a um cache miss (concorrência), não a capacidade ou performance do Redis.'
    }
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'Analise o comportamento do código em caso de cache miss. O que acontece se 500 requests entrarem ao mesmo tempo no bloco `if (!data)`?'
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'Sem um mecanismo de "espera" ou bloqueio, todos os 500 requests vão fazer `await db.query(...)`.'
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Solução ideal passa por coordenar estes requests para que apenas um sofra o hit na BD e povoe a cache, ou garantir que a cache nunca expira bloqueando a leitura.'
    }
  ],

  resolution: {
    rootCause: 'Cache Stampede (Thundering Herd). Num sistema com muita carga, a expiração de uma chave de cache frequentemente acedida causa um pico maciço de falhas de cache num curto intervalo de tempo. Vários processos da aplicação tentaram recalcular os mesmos dados a partir da base de dados simultaneamente, esgotando os recursos da DB.',
    fix: 'Implementar um padrão de Mutex (Distributed Lock) na obtenção dos dados. Quando ocorre o cache miss, apenas a thread que conseguir o lock fará o cálculo, enquanto as outras recebem stale data ou esperam; ou usar Jitter (expiração aleatória gradual).',
    preventions: [
      'Implementar Probabilistic Early Expiration (XFetch)',
      'Adicionar "Jitter" aleatório ao TTL para evitar que múltiplas chaves expirem juntas',
      'Reforçar padrão de Single-flight (ou request coalescing) ao nível da API Gateway ou App',
      'Manter workers em background responsáveis por repovoar a cache (Cache Warming / Cron)'
    ]
  }
};
