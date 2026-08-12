import type { Scenario } from '../../types/scenario';

export const k8sIncidentAuthDownScenario: Scenario = {
  id: 'k8s-incident-auth-down',
  domain: 'devops',
  format: 'guided',
  title: '2:13 AM · o PagerDuty toca, ninguém consegue fazer login',
  hook: 'São 2:13 da manhã. O PagerDuty acorda-te. Os clientes não conseguem autenticar-se — o login está completamente em baixo. Fazes SSH e olhas para o cluster. Isto não é um exercício de debugging: é um incidente com clientes afectados, e cada minuto conta.',
  difficulty: 'senior',
  timeEstimateMin: 10,
  tags: ['kubernetes', 'incident-response', 'sre', 'on-call', 'probes'],

  contextArtifacts: [
    {
      id: 'alert',
      label: '🚨 PagerDuty · 02:13',
      language: 'text',
      content: `SEV-1 · Authentication failures
Service:    auth-service
Namespace:  production
Impact:     Utilizadores não conseguem fazer login
Error rate: 100% em /api/auth/login
Duração:    8 minutos e a contar
On-call:    tu`,
    },
    {
      id: 'get-pods',
      label: '$ kubectl get pods -n production',
      language: 'bash',
      content: `NAME           READY   STATUS             RESTARTS   AGE
frontend       1/1     Running            0          2d5h
payments       1/1     Running            0          2d5h
auth-service   0/1     CrashLoopBackOff   6          2d1h
redis          1/1     Running            0          2d5h
postgres       1/1     Running            0          2d5h`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'describe',
      label: '$ kubectl describe pod auth-service -n production',
      language: 'bash',
      content: `Containers:
  auth-service:
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
    Restart Count:  6
    Readiness:      http-get http://:8080/healthz delay=10s timeout=1s period=10s #failure=3

Events:
  Type      Reason      Age     From      Message
  ----      ------      ----    ----      -------
  Warning   BackOff     2m30s   kubelet   Back-off restarting failed container
  Warning   Unhealthy   1m20s   kubelet   Readiness probe failed: HTTP probe failed
                                            with statuscode: 500
  Normal    Pulling     3m10s   kubelet   Pulling image "auth-service:1.2.0"

# A readiness probe falha com 500 — a app responde, mas com erro interno.`,
    },
    {
      id: 'logs-previous',
      label: '$ kubectl logs auth-service -n production --previous',
      language: 'log',
      content: `2026-08-03T02:05:11Z INFO  Starting auth-service v1.2.0
2026-08-03T02:05:11Z INFO  Loading config from /etc/auth/config.yaml
2026-08-03T02:05:12Z INFO  Connecting to postgres at postgres.production:5432
2026-08-03T02:05:12Z INFO  Database connection established
2026-08-03T02:05:12Z INFO  Connecting to redis at redis.production:6379
2026-08-03T02:05:13Z ERROR Redis connection failed: NOAUTH Authentication required
2026-08-03T02:05:13Z ERROR /healthz returning 500: dependency check failed (redis)
2026-08-03T02:05:23Z FATAL Readiness probe failed 3 times, shutting down`,
    },
    {
      id: 'recent-changes',
      label: '$ kubectl get events -n production --sort-by=.lastTimestamp | tail',
      language: 'bash',
      content: `LAST SEEN   TYPE      REASON              OBJECT                 MESSAGE
14m         Normal    SecretUpdated       secret/redis-creds     Secret was updated
13m         Normal    Killing             pod/redis              Stopping container
13m         Normal    Started             pod/redis              Started container
9m          Warning   Unhealthy           pod/auth-service       Readiness probe failed
2m30s       Warning   BackOff             pod/auth-service       Back-off restarting

# Há 14 minutos alguém actualizou o secret redis-creds.
# O redis reiniciou e passou a exigir password. O auth-service não sabe disso.`,
    },
    {
      id: 'redis-check',
      label: '$ kubectl exec -it redis -n production -- redis-cli ping',
      language: 'bash',
      content: `(error) NOAUTH Authentication required.

# Confirmado: o Redis agora exige autenticação.
# O auth-service usa o secret antigo (sem password) e não consegue ligar-se.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'São 2:13 AM, clientes afectados, o pod está em CrashLoopBackOff. Qual é o teu PRIMEIRO comando?',
      revealArtifacts: ['get-pods'],
      options: [
        { id: 'a', label: 'kubectl rollout restart deployment/auth-service — reiniciar e ver se resolve', correct: false,
          feedback: 'Tentador às 2 da manhã, mas é adivinhar. Se a causa persistir, volta a falhar e perdeste minutos. Pior: perdes o estado que te permitiria diagnosticar. Nunca reinicies às cegas num incidente.' },
        { id: 'b', label: 'kubectl describe pod auth-service — recolher contexto completo', correct: true,
          feedback: 'Correcto. Os Events do describe mostram imediatamente a razão real da falha: probe, imagem, config, permissões. Em CrashLoopBackOff os logs podem estar vazios ou truncados — o describe nunca está.',
          revealArtifacts: ['describe'] },
        { id: 'c', label: 'kubectl logs auth-service — ver os logs da aplicação', correct: false,
          feedback: 'Não é errado, mas não é o primeiro. Num pod que reinicia em ciclo, `kubectl logs` mostra o container actual (que pode ainda não ter escrito nada). Precisarias de `--previous`. O describe dá-te o quadro completo de uma vez.' },
        { id: 'd', label: 'kubectl get events — ver o que aconteceu no cluster', correct: false,
          feedback: 'Útil, e vais lá chegar. Mas começa pelo objecto que está a falhar. O describe já inclui os events desse pod, filtrados e relevantes.' },
      ],
      teachingNote: 'A regra do on-call: recolhe contexto completo antes de agires. `describe` é sempre o primeiro comando num pod que falha — dá estado, última terminação, configuração das probes e events, tudo numa vista.',
    },
    {
      id: 'step-2',
      prompt: 'O describe mostra: "Readiness probe failed: HTTP probe failed with statuscode: 500". O que é que isto te diz?',
      revealArtifacts: ['describe'],
      options: [
        { id: 'a', label: 'A aplicação não arrancou — a porta não está aberta', correct: false,
          feedback: 'Se a porta estivesse fechada, o erro seria "connection refused". Um código 500 significa que a app está a responder — mas com erro interno. É uma distinção crítica.' },
        { id: 'b', label: 'A app está viva e a responder, mas o próprio /healthz reporta que algo está mal', correct: true,
          feedback: 'Exacto. HTTP 500 no healthz significa que a aplicação arrancou, abriu a porta, e está a dizer activamente "não estou saudável". A causa está dentro da app ou numa dependência dela.',
          revealArtifacts: [] },
        { id: 'c', label: 'A probe está mal configurada — o path /healthz não existe', correct: false,
          feedback: 'Um path inexistente daria 404, não 500. O endpoint existe e está a executar lógica — essa lógica é que está a falhar.' },
        { id: 'd', label: 'O timeout de 1s é curto demais', correct: false,
          feedback: 'Um timeout curto daria "context deadline exceeded" ou "timeout", não um statuscode 500. A app respondeu dentro do tempo — respondeu com erro.' },
      ],
      teachingNote: 'Aprende a ler os erros das probes literalmente. "connection refused" = nada a escutar. "timeout" = lento demais. "404" = path errado. "500" = a app está viva e a dizer-te que algo está mal. Cada um leva a uma investigação diferente.',
    },
    {
      id: 'step-3',
      prompt: 'Sabes que a app responde 500 no healthz. Como descobres porquê?',
      revealArtifacts: ['describe'],
      options: [
        { id: 'a', label: 'kubectl logs auth-service --previous — ler os logs do container que morreu', correct: true,
          feedback: 'Correcto. A flag --previous é essencial: o container actual acabou de arrancar e pode não ter escrito nada ainda. O que morreu tem a história completa até ao momento da falha.',
          revealArtifacts: ['logs-previous'] },
        { id: 'b', label: 'Aumentar o failureThreshold da probe para dar mais margem', correct: false,
          feedback: 'Isto mascara o sintoma. A app está genuinamente doente — dar-lhe mais tentativas não a cura, só atrasa a detecção. E os clientes continuam sem login.' },
        { id: 'c', label: 'Fazer port-forward e testar o /healthz manualmente', correct: false,
          feedback: 'Boa ideia em geral, mas o pod está em CrashLoopBackOff — está morto na maior parte do tempo. Apanhar a janela em que está vivo é frustrante às 2 da manhã. Os logs são mais fiáveis.' },
        { id: 'd', label: 'Escalar o deployment para 3 réplicas', correct: false,
          feedback: 'Três réplicas com o mesmo problema dão três pods em CrashLoopBackOff. Escalar não resolve um problema de dependência.' },
      ],
      teachingNote: '`kubectl logs --previous` é o comando mais subutilizado em incidentes de CrashLoopBackOff. Sem ele, estás a ler os logs de um container que ainda não fez nada.',
    },
    {
      id: 'step-4',
      prompt: 'Os logs revelam: "Redis connection failed: NOAUTH Authentication required". A app está bem — a dependência mudou. Qual é o próximo passo?',
      revealArtifacts: ['logs-previous'],
      options: [
        { id: 'a', label: 'Reescrever o healthz para não verificar o Redis', correct: false,
          feedback: 'Estás a mudar código em produção às 2 da manhã para esconder um problema real. O auth-service precisa mesmo do Redis (sessões). Sem ele, mesmo que o pod fique Ready, o login continua partido.' },
        { id: 'b', label: 'Ver o que mudou recentemente no cluster — `kubectl get events` ordenado por tempo', correct: true,
          feedback: 'Correcto. "NOAUTH" significa que o Redis passou a exigir password. Isso é uma mudança. A pergunta certa num incidente é sempre: o que mudou?',
          revealArtifacts: ['recent-changes', 'redis-check'] },
        { id: 'c', label: 'Reiniciar o Redis', correct: false,
          feedback: 'O Redis está Running e saudável — não é ele que está partido. Reiniciá-lo pode até piorar (perda de sessões em memória) sem resolver a autenticação.' },
        { id: 'd', label: 'Fazer rollback do auth-service para a versão anterior', correct: false,
          feedback: 'O auth-service não mudou — está na mesma versão há 2 dias (repara no AGE: 2d1h). Fazer rollback de algo que não mudou não resolve nada e adiciona ruído.' },
      ],
      teachingNote: 'A primeira pergunta de qualquer incidente: **o que mudou?** Deployment, config, secret, certificado, DNS, firewall, padrão de tráfego. Sistemas estáveis não partem sozinhos — quase sempre há uma mudança recente.',
    },
    {
      id: 'step-5',
      prompt: 'Confirmado: há 14 minutos alguém actualizou o secret `redis-creds` e o Redis passou a exigir password. O auth-service usa as credenciais antigas. São 2:20 AM. O que fazes AGORA?',
      revealArtifacts: ['recent-changes', 'redis-check'],
      options: [
        { id: 'a', label: 'Actualizar o secret que o auth-service monta com a nova password e reiniciar o deployment', correct: true,
          feedback: 'Correcto. Esta é a correcção mínima que restaura o serviço: alinhar as credenciais que o auth-service usa com as que o Redis agora exige. É reversível, tem escopo pequeno, e ataca a causa real.',
          revealArtifacts: [] },
        { id: 'b', label: 'Reverter o secret do Redis para não exigir password', correct: false,
          feedback: 'Restauraria o serviço, mas desfaz uma mudança de segurança que alguém fez deliberadamente. Podes estar a reabrir uma vulnerabilidade. Se for a única opção viável, comunica-o explicitamente e cria follow-up — não o faças em silêncio.' },
        { id: 'c', label: 'Escrever um post-mortem completo antes de mexer em nada', correct: false,
          feedback: 'O post-mortem é essencial — mas depois. Com clientes afectados, a prioridade é restaurar o serviço. Documenta enquanto ages (guarda os comandos e outputs), escreve o post-mortem quando o serviço estiver estável.' },
        { id: 'd', label: 'Acordar a pessoa que mudou o secret para perceber o contexto', correct: false,
          feedback: 'Vale a pena notificá-la em paralelo, mas não bloqueies a mitigação à espera. Já tens informação suficiente para agir. Comunica e age ao mesmo tempo.' },
      ],
      teachingNote: 'Ordem de prioridades num incidente: (1) estabilizar o serviço, (2) comunicar o estado, (3) só depois investigar a fundo e documentar. A correcção certa é a mais pequena e reversível que restaura o serviço.',
    },
    {
      id: 'step-6',
      prompt: 'Aplicaste a correcção e o pod está Running 1/1. São 2:24 AM. Consideras o incidente fechado?',
      revealArtifacts: [],
      options: [
        { id: 'a', label: 'Sim — o pod está Ready, problema resolvido', correct: false,
          feedback: 'Pod Ready não é o mesmo que serviço funcional. A readiness probe só verifica o healthz — precisas de confirmar que os utilizadores conseguem mesmo autenticar-se, que a taxa de erro caiu, e que se mantém estável.' },
        { id: 'b', label: 'Verificar o fluxo real de login, confirmar métricas estáveis, observar alguns minutos, e comunicar a resolução', correct: true,
          feedback: 'Correcto. Uma correcção só está completa quando o sintoma desapareceu do ponto de vista do utilizador, os logs estão limpos, as métricas estabilizaram, e não regressa após observação. Depois disso, comunicas.',
          revealArtifacts: [] },
        { id: 'c', label: 'Fechar o alerta e voltar a dormir', correct: false,
          feedback: 'Silenciar o alerta sem verificar é como desligar o alarme de incêndio sem ver se o fogo apagou. Se voltar a falhar, ninguém é notificado.' },
        { id: 'd', label: 'Reiniciar os outros serviços por precaução', correct: false,
          feedback: 'Mexer em serviços saudáveis durante um incidente é como se pede um segundo incidente. Uma mudança de cada vez — e só nas que são necessárias.' },
      ],
      teachingNote: 'Verificação após a correcção: o sintoma original desapareceu? Os logs estão limpos? As métricas estão estáveis? Aguenta alguns minutos de observação? Só então comunicas resolução e escreves o post-mortem.',
    },
  ],

  resolution: {
    rootCause: 'Há 14 minutos, uma alteração de segurança activou autenticação no Redis (secret `redis-creds` actualizado, Redis reiniciado a exigir password). O `auth-service` continuou a usar as credenciais antigas, sem password. Como o seu endpoint `/healthz` verifica as dependências, passou a devolver HTTP 500 ao não conseguir ligar-se ao Redis. A readiness probe falhou 3 vezes, o kubelet matou o container, e o Deployment entrou em CrashLoopBackOff — deixando o login completamente indisponível.',
    fix: 'Actualizar o secret montado pelo `auth-service` com a nova password do Redis e reiniciar o deployment (`kubectl rollout restart deployment/auth-service -n production`). Confirmar depois com o fluxo real de login, não apenas com o estado do pod.',
    preventions: [
      'Alterações a credenciais de serviços partilhados devem identificar e actualizar todos os consumidores na mesma janela de mudança',
      'Usar External Secrets Operator ou Vault Agent para que a rotação propague automaticamente a todos os consumidores',
      'Distinguir readiness de liveness: uma dependência em baixo devia marcar o pod NotReady (tira do load balancer) sem o matar em ciclo — o CrashLoop transformou uma degradação numa indisponibilidade total',
      'Alertar sobre falhas de dependência (Redis auth errors) antes de elas escalarem para CrashLoopBackOff',
      'Runbook de on-call com a sequência describe → logs --previous → get events, para não se perder tempo às 2 da manhã',
      'Registar todas as alterações a secrets num canal de mudanças visível para quem está de piquete',
    ],
  },
};
