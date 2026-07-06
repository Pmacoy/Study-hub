import type { Scenario } from '../../types/scenario';

export const k8sCrashloopScenario: Scenario = {
  id: 'k8s-crashloop-oom',
  domain: 'devops',
  format: 'guided',
  title: 'Pod em CrashLoopBackOff',
  hook: 'São 15h30. O Slack #alerts explode: o pod `api-checkout` reiniciou 12 vezes nos últimos 10 minutos. O tráfego de checkouts está a cair. O que fazes?',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['kubernetes', 'pods', 'oom', 'resource-limits'],

  contextArtifacts: [
    {
      id: 'context-cluster',
      label: 'Contexto do cluster',
      language: 'text',
      content: `Cluster:      aks-prod-westeu
Namespace:    checkout
Deployment:   api-checkout (3 replicas)
Última mudança: ontem às 22:00 (deploy de v2.14.0)
Alertas activos: HighPodRestartRate`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'kubectl-get-pods',
      label: '$ kubectl get pods -n checkout',
      language: 'bash',
      content: `NAME                            READY   STATUS             RESTARTS   AGE
api-checkout-7d8f9c4-2xk9m       0/1     CrashLoopBackOff   12         14m
api-checkout-7d8f9c4-hp7wt       1/1     Running            0          14m
api-checkout-7d8f9c4-mkr2n       1/1     Running            0          14m`,
    },
    {
      id: 'kubectl-describe',
      label: '$ kubectl describe pod api-checkout-7d8f9c4-2xk9m',
      language: 'bash',
      content: `Name:         api-checkout-7d8f9c4-2xk9m
Namespace:    checkout
Status:       Running

Containers:
  api:
    Image:         registry.example.com/api-checkout:v2.14.0
    State:         Waiting
      Reason:      CrashLoopBackOff
    Last State:    Terminated
      Reason:      OOMKilled
      Exit Code:   137
      Started:     15:28:04
      Finished:    15:28:47
    Ready:         False
    Restart Count: 12
    Limits:
      cpu:     500m
      memory:  256Mi
    Requests:
      cpu:     100m
      memory:  128Mi

Events:
  Type     Reason   From     Message
  ----     ------   ----     -------
  Warning  BackOff  kubelet  Back-off restarting failed container`,
    },
    {
      id: 'kubectl-logs',
      label: '$ kubectl logs api-checkout-7d8f9c4-2xk9m --previous',
      language: 'log',
      content: `2026-07-05T15:27:52.104Z INFO  Starting api-checkout v2.14.0
2026-07-05T15:27:52.891Z INFO  Connected to postgres://checkout-db:5432/checkout
2026-07-05T15:27:53.201Z INFO  Loading product catalog into memory cache...
2026-07-05T15:28:11.882Z INFO  Cache loaded: 1.2M SKUs (198MB)
2026-07-05T15:28:15.334Z INFO  HTTP server listening on :8080
2026-07-05T15:28:45.012Z INFO  Request POST /checkout/session — 47MB payload
2026-07-05T15:28:47.223Z ERROR  runtime.MemoryError: failed to allocate

(container terminated: OOMKilled)`,
    },
    {
      id: 'grafana-memory',
      label: '📊 Grafana · memory usage last 1h',
      language: 'text',
      content: `Pod: api-checkout-7d8f9c4-2xk9m
15:15  →  32 MB
15:20  →  48 MB
15:25  →  135 MB   (loading cache)
15:27  →  198 MB
15:28  →  256 MB   ← LIMIT HIT
15:28  →  OOMKilled

Pod: api-checkout-7d8f9c4-hp7wt (healthy)
Actual usage: 210 MB (bem perto do limite de 256 MB)`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Recebeste o alerta. Qual é o primeiro comando que corres para diagnosticar?',
      revealArtifacts: [],
      options: [
        {
          id: 'a',
          label: 'kubectl get pods -n checkout',
          correct: true,
          feedback: 'Correcto — vês logo o estado dos pods e o número de restarts. É o "ls" do Kubernetes.',
          revealArtifacts: ['kubectl-get-pods'],
        },
        {
          id: 'b',
          label: 'kubectl delete pod -l app=api-checkout',
          correct: false,
          feedback: 'Isso apagaria os pods e o Deployment recria-os. Perdes toda a informação de diagnóstico e o problema volta a acontecer.',
        },
        {
          id: 'c',
          label: 'kubectl rollout restart deployment/api-checkout',
          correct: false,
          feedback: 'Restart cego sem diagnóstico. Se a causa persistir (spoiler: persiste), acabas de perder mais tempo.',
        },
      ],
    },
    {
      id: 'step-2',
      prompt: 'Confirmaste que um pod está em CrashLoopBackOff com 12 restarts. Qual o próximo passo?',
      options: [
        {
          id: 'a',
          label: 'kubectl describe pod <nome>',
          correct: true,
          feedback: 'Sim — o `describe` mostra os Events, Last State, exit code e razão da terminação. É onde vamos ver "OOMKilled".',
          revealArtifacts: ['kubectl-describe'],
        },
        {
          id: 'b',
          label: 'kubectl edit deployment api-checkout — aumentar replicas',
          correct: false,
          feedback: 'Adicionar réplicas não corrige um pod que crasha. Vais só ter mais pods a crashar.',
        },
        {
          id: 'c',
          label: 'kubectl top pods',
          correct: false,
          feedback: 'Ver métricas em tempo real é útil, mas o pod está em CrashLoopBackOff — o container nem está a correr. `describe` dá-te causa e histórico.',
        },
      ],
      teachingNote: 'Padrão de troubleshoot K8s: get → describe → logs. Sempre nesta ordem — do geral ao específico.',
    },
    {
      id: 'step-3',
      prompt: 'O `describe` mostra "Last State: Terminated, Reason: OOMKilled, Exit Code: 137". O que isto te diz?',
      options: [
        {
          id: 'a',
          label: 'O container foi morto pelo OOM Killer do Linux por exceder o limite de memória',
          correct: true,
          feedback: 'Exacto. Exit code 137 = 128 + SIGKILL(9). O kernel matou o processo porque tentou usar mais de 256 Mi (o limite).',
        },
        {
          id: 'b',
          label: 'O container fez `exit 137` no código da aplicação',
          correct: false,
          feedback: 'Não. Exit code ≥ 128 significa que foi terminado por um sinal. 137 = 128 + 9 (SIGKILL) — vem do kernel, não da app.',
        },
        {
          id: 'c',
          label: 'O node está sem memória e evictou o pod',
          correct: false,
          feedback: 'Se fosse eviction do node verias "Reason: Evicted" no status do pod. OOMKilled = o container excedeu o SEU limite.',
        },
      ],
    },
    {
      id: 'step-4',
      prompt: 'Olhas para os logs e a última linha antes do crash é "Cache loaded: 1.2M SKUs (198MB)". Combinado com o Grafana, o que fazes AGORA para restaurar o serviço?',
      revealArtifacts: ['kubectl-logs', 'grafana-memory'],
      options: [
        {
          id: 'a',
          label: 'Aumentar o memory limit para 512Mi via kubectl edit deployment',
          correct: true,
          feedback: 'Correcto para mitigação imediata. A cache legitimamente precisa de ~200MB + overhead da app. 256Mi era demasiado apertado.',
        },
        {
          id: 'b',
          label: 'Fazer rollback para v2.13.0',
          correct: false,
          feedback: 'Também é válido como mitigação, mas os outros 2 pods estão a 210MB e podem crashar a qualquer momento. Rollback compra tempo mas o problema é do limite, não da versão.',
        },
        {
          id: 'c',
          label: 'Aumentar réplicas para 6 para distribuir a carga',
          correct: false,
          feedback: 'Cada pod carrega a mesma cache — vão todos crashar do mesmo jeito. Escalar horizontal não resolve um problema de memória por pod.',
        },
      ],
      teachingNote: 'Regra da vida real: primeiro estabiliza (mitigação), depois corrige a raíz num PR pensado.',
    },
    {
      id: 'step-5',
      prompt: 'Serviço estabilizado. Estás a escrever o post-mortem. Qual acção de prevenção é MAIS importante para evitar isto voltar?',
      options: [
        {
          id: 'a',
          label: 'Definir memory request e limit baseados em observação real + alerta a 80% do limit',
          correct: true,
          feedback: 'Esta é a resposta madura. Requests baseados em uso real (VPA ajuda), limits com folga, e alerta ANTES do OOM (não depois).',
        },
        {
          id: 'b',
          label: 'Remover memory limits completamente',
          correct: false,
          feedback: 'Anti-pattern. Sem limits, um pod com memory leak pode matar o node inteiro. Limits protegem os vizinhos.',
        },
        {
          id: 'c',
          label: 'Adicionar mais nodes ao cluster',
          correct: false,
          feedback: 'Isso resolve pressão de node, não OOM por container. Adicionar hardware para tapar um bug de configuração é caro e não escala.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'A v2.14.0 introduziu uma cache in-memory de 1.2M SKUs (~198MB). Combinado com o overhead da JVM/runtime, o pod passou os 256Mi de limite no primeiro request grande, e o OOM Killer terminou o processo. Como o Deployment reinicia sempre, entrou em CrashLoopBackOff.',
    fix: 'Aumentar `resources.limits.memory` para `512Mi` no Deployment e re-fazer deploy. Serviço restaurado em ~2 minutos.',
    preventions: [
      'Definir memory requests baseados em observação real (usar VPA em recommendation-only mode)',
      'Adicionar alerta Prometheus: memory usage > 80% do limit por > 5min',
      'Load test antes do release com dataset produção-like para apanhar picos de memória',
      'Considerar carregar a cache lazy (à medida que os SKUs são pedidos) em vez de eager loading no startup',
      'Adicionar liveness probe com initialDelaySeconds suficiente para o warmup da cache',
    ],
  },
};
