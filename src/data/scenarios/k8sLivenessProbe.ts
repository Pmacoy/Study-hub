import type { Scenario } from '../../types/scenario';

export const k8sLivenessProbeScenario: Scenario = {
  id: 'k8s-liveness-probe-loop',
  domain: 'devops',
  format: 'guided',
  title: 'Pod reinicia em loop por causa da liveness probe',
  hook: 'Um serviço que arranca lentamente (carrega um modelo grande em memória) está a reiniciar sem parar. Não é OOM — os logs mostram que a app estava mesmo a arrancar quando foi morta. O RESTARTS não pára de subir.',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['kubernetes', 'probes', 'liveness', 'health-checks'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Cluster:      eks-prod
Namespace:    ml
Deployment:   recommender (carrega modelo ~40s no arranque)
Sintoma:      RESTARTS a subir, mas NÃO é OOMKilled
Nota:         a app é saudável se a deixarem arrancar`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'get-pods',
      label: '$ kubectl get pods -n ml',
      language: 'bash',
      content: `NAME                           READY   STATUS    RESTARTS      AGE
recommender-7f8c9d5b4-mk2n8    0/1     Running   7 (30s ago)   6m`,
    },
    {
      id: 'describe',
      label: '$ kubectl describe pod recommender-7f8c9d5b4-mk2n8',
      language: 'bash',
      content: `Containers:
  recommender:
    State:          Running
    Last State:     Terminated
      Reason:       Error
      Exit Code:    137
    Restart Count:  7
    Liveness:       http-get http://:8080/healthz delay=5s timeout=1s period=10s #failure=3

Events:
  Type     Reason     From     Message
  ----     ------     ----     -------
  Warning  Unhealthy  kubelet  Liveness probe failed: Get "http://10.2.1.5:8080/healthz":
                                dial tcp 10.2.1.5:8080: connect: connection refused
  Normal   Killing    kubelet  Container recommender failed liveness probe, will be restarted`,
    },
    {
      id: 'logs',
      label: '$ kubectl logs recommender-7f8c9d5b4-mk2n8 --previous',
      language: 'log',
      content: `2026-07-06T14:30:00Z INFO  Starting recommender service
2026-07-06T14:30:00Z INFO  Loading model from s3://models/recommender-v3.pkl
2026-07-06T14:30:12Z INFO  Model download complete (1.2GB)
2026-07-06T14:30:12Z INFO  Deserializing model into memory...
[processo morto aqui — a app ainda estava a carregar o modelo]
# A app nunca chegou a abrir a porta 8080 antes de ser morta`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Exit code 137 e RESTARTS a subir. Mas o hook diz que não é OOM. Como confirmas o que está a matar o pod?',
      revealArtifacts: ['get-pods'],
      options: [
        { id: 'a', label: 'kubectl describe pod — ver os Events e a razão do Killing', correct: true,
          feedback: 'Correcto. Os Events distinguem OOMKilled de "failed liveness probe". Exit 137 = SIGKILL, mas a origem pode ser OOM OU a probe.',
          revealArtifacts: ['describe'] },
        { id: 'b', label: 'Assumir que é OOM e aumentar a memória', correct: false,
          feedback: 'O hook já disse que não é OOM. Aumentar memória às cegas não resolve e desperdiça recursos. Confirma a causa primeiro.' },
        { id: 'c', label: 'kubectl top pod para ver uso de memória', correct: false,
          feedback: 'Útil para OOM, mas o hook já descartou OOM. O top não te mostra a razão do Killing — o describe sim.' },
      ],
      teachingNote: 'Exit code 137 = 128 + SIGKILL(9). Pode vir de OOMKilled OU de uma probe falhada que faz o kubelet matar o container. Só os Events do describe distinguem os dois.',
    },
    {
      id: 'step-2',
      prompt: 'Os Events mostram "Liveness probe failed: connection refused" e a probe tem delay=5s. Os logs mostram que a app demora ~40s a carregar. Qual é o problema?',
      revealArtifacts: ['describe', 'logs'],
      options: [
        { id: 'a', label: 'A liveness probe começa aos 5s, mas a app só abre a porta ~40s depois. A probe mata-a antes de arrancar', correct: true,
          feedback: 'Exacto. initialDelaySeconds=5 mas a app precisa de ~40s. A probe falha 3 vezes (connection refused, porque a porta ainda não está aberta), o kubelet mata o pod, e o ciclo repete-se para sempre.',
          revealArtifacts: [] },
        { id: 'b', label: 'A app tem um bug no endpoint /healthz', correct: false,
          feedback: 'O endpoint não responde porque a app ainda não arrancou — "connection refused" significa que a porta nem sequer está aberta ainda, não que /healthz devolve erro.' },
        { id: 'c', label: 'O timeout=1s é demasiado curto', correct: false,
          feedback: 'O timeout não é o problema principal — a porta está fechada (connection refused), não lenta. O problema é a probe começar cedo demais.' },
      ],
      teachingNote: '"connection refused" numa liveness probe significa que nada está a escutar na porta — a app ainda não arrancou. Se a app arranca lentamente, a liveness probe tem de esperar por ela.',
    },
    {
      id: 'step-3',
      prompt: 'Como resolves o loop de reinícios de uma app com arranque lento?',
      revealArtifacts: [],
      options: [
        { id: 'a', label: 'Adicionar uma startupProbe (ou aumentar initialDelaySeconds) para dar tempo ao arranque', correct: true,
          feedback: 'Correcto. A startupProbe é a solução moderna: protege o arranque lento, e só depois de passar é que as liveness/readiness probes entram em acção. Alternativa: aumentar initialDelaySeconds/failureThreshold da liveness.',
          revealArtifacts: [] },
        { id: 'b', label: 'Remover a liveness probe completamente', correct: false,
          feedback: 'Sem liveness probe, um pod que fique verdadeiramente pendurado nunca é reiniciado. A probe é boa — só precisa de estar configurada para o tempo de arranque real.' },
        { id: 'c', label: 'Aumentar a memória do pod', correct: false,
          feedback: 'O problema não é memória — é timing da probe. Mais memória não faz a app arrancar mais depressa nem impede a probe de a matar cedo.' },
      ],
      teachingNote: 'A startupProbe (K8s 1.16+) é ideal para arranques lentos: `startupProbe: {httpGet: /healthz, failureThreshold: 30, periodSeconds: 2}` dá 60s. Enquanto a startupProbe não passar, a liveness fica suspensa. Assim que passa, a liveness assume o controlo normal.',
    },
  ],

  resolution: {
    rootCause: 'A liveness probe estava configurada com initialDelaySeconds=5, mas a aplicação demora ~40s a arrancar (download e desserialização de um modelo ML de 1.2GB). A probe começava a testar a porta 8080 aos 5s, recebia "connection refused" (a app ainda não tinha aberto a porta), falhava 3 vezes e o kubelet matava o container — repetindo o ciclo indefinidamente. Não era OOM: a app era saudável, só arrancava devagar.',
    fix: 'Adicionar uma startupProbe que dá tempo suficiente ao arranque (ex: failureThreshold=30, periodSeconds=2 = 60s de margem). Enquanto a startupProbe não passa, a liveness probe fica suspensa. Em alternativa, aumentar initialDelaySeconds e failureThreshold da liveness probe.',
    preventions: [
      'Usar startupProbe para qualquer app com arranque lento (carregamento de modelos, warm-up de cache, migrations)',
      'Medir o tempo real de arranque em staging antes de definir os valores das probes',
      'Distinguir readiness (pronto para tráfego) de liveness (está vivo) — cada uma tem propósito diferente',
      'Alertar sobre RESTARTS crescentes com Reason != OOMKilled para apanhar loops de probe',
    ],
  },
};
