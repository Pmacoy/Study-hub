import type { TerminalSession } from '../../types/terminal';

const RUNNING_POD = 'api-checkout-7d8f9c4-hp7wt';
const CRASHED_POD = 'api-checkout-7d8f9c4-2xk9m';

export const kubectlCrashloopSession: TerminalSession = {
  id: 'kubectl-crashloop',
  domain: 'devops',
  title: 'kubectl · investigar pod em CrashLoopBackOff',
  hook: 'Um pod do serviço checkout está a reiniciar. Usa o kubectl para descobrir porquê. Explora à vontade.',
  shell: 'kubectl',
  prompt: 'user@aks-prod:~$ ',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['kubernetes', 'debug', 'oomkilled'],

  briefing: `Cluster: aks-prod-westeu · Namespace: checkout · Deployment: api-checkout (3 réplicas)
Alerta activo: HighPodRestartRate.

Vais precisar de: kubectl get, describe, logs, top. Todas as flags standard (-n, --namespace, -o yaml, --previous).
Escreve 'hint' se quiseres uma dica sem custo, ou 'help' para ver comandos comuns.`,

  objectives: [
    { id: 'obj-list', label: 'Ver os pods do namespace checkout', hint: 'kubectl get pods -n <namespace>', goalTag: 'list-pods' },
    { id: 'obj-describe', label: 'Investigar o pod que está a crashar', hint: 'kubectl describe pod <nome>', goalTag: 'describe-pod' },
    { id: 'obj-logs', label: 'Ver os logs do container morto anteriormente', hint: 'kubectl logs <pod> --previous', goalTag: 'logs-previous' },
    { id: 'obj-mem', label: 'Confirmar consumo de memória dos pods vivos', hint: 'kubectl top pods -n <namespace>', goalTag: 'top-pods' },
  ],

  handlers: [
    // kubectl get pods
    {
      id: 'get-pods',
      tokens: [['kubectl'], ['get'], ['pods', 'po', 'pod']],
      flags: [{ names: ['-n', '--namespace'], valueRequired: true }],
      goalTag: 'list-pods',
      teachingNote: 'Padrão: get → describe → logs. Sempre nesta ordem, do geral para o específico.',
      output: (ctx) => {
        const ns = ctx.flagValues['-n'] ?? ctx.flagValues['--namespace'];
        if (ns === 'checkout') {
          return `NAME                            READY   STATUS             RESTARTS   AGE
${CRASHED_POD}       0/1     CrashLoopBackOff   12         14m
${RUNNING_POD}       1/1     Running            0          14m
api-checkout-7d8f9c4-mkr2n       1/1     Running            0          14m`;
        }
        if (!ns) {
          return `NAME                       READY   STATUS    RESTARTS   AGE
default-http-backend       1/1     Running   0          5d

# (namespace default)`;
        }
        return `No resources found in ${ns} namespace.`;
      },
    },
    // kubectl get pods -o wide
    {
      id: 'get-pods-wide',
      tokens: [['kubectl'], ['get'], ['pods', 'po', 'pod']],
      flags: [
        { names: ['-n', '--namespace'], valueRequired: true },
        { names: ['-o', '--output'], valueRequired: true, valueEnum: ['wide', 'yaml', 'json'] },
      ],
      output: (ctx) => {
        const ns = ctx.flagValues['-n'] ?? ctx.flagValues['--namespace'];
        const out = ctx.flagValues['-o'] ?? ctx.flagValues['--output'];
        if (ns === 'checkout' && out === 'wide') {
          return `NAME                            READY   STATUS             RESTARTS   AGE   IP           NODE
${CRASHED_POD}       0/1     CrashLoopBackOff   12         14m   10.244.1.7   aks-node-1
${RUNNING_POD}       1/1     Running            0          14m   10.244.2.9   aks-node-2
api-checkout-7d8f9c4-mkr2n       1/1     Running            0          14m   10.244.3.4   aks-node-3`;
        }
        return `# use -o yaml or -o json to see full spec, -o wide for extra columns`;
      },
    },
    // kubectl describe pod
    {
      id: 'describe-pod',
      tokens: [['kubectl'], ['describe'], ['pod', 'pods', 'po']],
      flags: [{ names: ['-n', '--namespace'], valueRequired: true }],
      goalTag: 'describe-pod',
      teachingNote: 'Exit code 137 = 128 + SIGKILL(9). O kernel matou o processo. "OOMKilled" = excedeu o memory limit.',
      output: (ctx) => {
        const podName = ctx.positionalArgs[0] ?? '';
        if (podName.includes('2xk9m') || podName === CRASHED_POD) {
          return `Name:         ${CRASHED_POD}
Namespace:    checkout
Node:         aks-node-1/10.240.0.5
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
  Warning  BackOff  kubelet  Back-off restarting failed container`;
        }
        if (podName.includes('hp7wt') || podName === RUNNING_POD) {
          return `Name:         ${RUNNING_POD}
Namespace:    checkout
Status:       Running

Containers:
  api:
    State:         Running
    Ready:         True
    Restart Count: 0
    Limits:
      memory:  256Mi
    Requests:
      memory:  128Mi

# Este pod está saudável — investiga o outro (2xk9m).`;
        }
        if (!podName) return `error: required resource name(s) missing.\nUse: kubectl describe pod <name>`;
        return `Error from server (NotFound): pods "${podName}" not found`;
      },
    },
    // kubectl logs
    {
      id: 'logs',
      tokens: [['kubectl'], ['logs']],
      flags: [
        { names: ['-n', '--namespace'], valueRequired: true },
        { names: ['-p', '--previous'] },
        { names: ['-f', '--follow'] },
        { names: ['--tail'], valueRequired: true },
      ],
      goalTag: 'logs-previous',
      output: (ctx) => {
        const podName = ctx.positionalArgs[0] ?? '';
        const previous = '-p' in ctx.flagValues || '--previous' in ctx.flagValues;
        if (!podName) return `error: expected 'logs <pod>'.`;

        if ((podName.includes('2xk9m') || podName === CRASHED_POD) && previous) {
          return `2026-07-05T15:27:52.104Z INFO  Starting api-checkout v2.14.0
2026-07-05T15:27:52.891Z INFO  Connected to postgres://checkout-db:5432/checkout
2026-07-05T15:27:53.201Z INFO  Loading product catalog into memory cache...
2026-07-05T15:28:11.882Z INFO  Cache loaded: 1.2M SKUs (198MB)
2026-07-05T15:28:15.334Z INFO  HTTP server listening on :8080
2026-07-05T15:28:45.012Z INFO  Request POST /checkout/session — 47MB payload
2026-07-05T15:28:47.223Z ERROR runtime.MemoryError: failed to allocate

(container terminated: OOMKilled)`;
        }
        if (podName.includes('2xk9m') || podName === CRASHED_POD) {
          return `Error from server (BadRequest): container "api" in pod "${podName}" is waiting to start: CrashLoopBackOff

# Dica: o container actual não arrancou. Adiciona --previous para ver o log do container anterior.`;
        }
        if (podName.includes('hp7wt') || podName === RUNNING_POD) {
          return `2026-07-05T15:15:12.100Z INFO  Starting api-checkout v2.14.0
2026-07-05T15:15:14.220Z INFO  HTTP server listening on :8080
2026-07-05T15:16:03.882Z INFO  Handled 12 requests in last 60s`;
        }
        return `Error from server (NotFound): pods "${podName}" not found`;
      },
    },
    // kubectl top pods
    {
      id: 'top-pods',
      tokens: [['kubectl'], ['top'], ['pods', 'po']],
      flags: [{ names: ['-n', '--namespace'], valueRequired: true }],
      goalTag: 'top-pods',
      teachingNote: 'Os outros pods já estão a 210 MB (limite: 256 MB). Iam crashar em breve — reforça a hipótese de limit apertado.',
      output: (ctx) => {
        const ns = ctx.flagValues['-n'] ?? ctx.flagValues['--namespace'];
        if (ns === 'checkout') {
          return `NAME                            CPU(cores)   MEMORY(bytes)
${RUNNING_POD}       84m          210Mi
api-checkout-7d8f9c4-mkr2n       76m          208Mi
# CrashLoopBackOff pod não aparece (sem métricas)`;
        }
        return `error: metrics not available`;
      },
    },
    // kubectl get events
    {
      id: 'events',
      tokens: [['kubectl'], ['get'], ['events']],
      flags: [{ names: ['-n', '--namespace'], valueRequired: true }],
      output: (ctx) => {
        const ns = ctx.flagValues['-n'] ?? ctx.flagValues['--namespace'];
        if (ns === 'checkout') {
          return `LAST SEEN   TYPE      REASON      OBJECT                                                    MESSAGE
1m          Warning   BackOff     pod/${CRASHED_POD}   Back-off restarting failed container
3m          Warning   Unhealthy   pod/${CRASHED_POD}   Liveness probe failed`;
        }
        return `No events in namespace ${ns}.`;
      },
    },
    // kubectl explain
    {
      id: 'explain',
      tokens: [['kubectl'], ['explain']],
      output: (ctx) => {
        const arg = ctx.positionalArgs[0] ?? '';
        if (arg.includes('limits')) {
          return `KIND:     Pod
FIELD:    limits

DESCRIPTION:
  Limits describes the maximum amount of compute resources allowed.
  Memory limit exceeded → container is OOMKilled.`;
        }
        return `# Use: kubectl explain <resource>.<field>`;
      },
    },
    // kubectl version (curiosity)
    {
      id: 'version',
      tokens: [['kubectl'], ['version']],
      output: `Client Version: v1.29.2
Server Version: v1.28.5 (aks-prod-westeu)`,
    },
    // kubectl config current-context
    {
      id: 'ctx',
      tokens: [['kubectl'], ['config'], ['current-context']],
      output: `aks-prod-westeu`,
    },
    // Delete pod - warn
    {
      id: 'delete-pod',
      tokens: [['kubectl'], ['delete'], ['pod', 'pods', 'po']],
      flags: [{ names: ['-n', '--namespace'], valueRequired: true }],
      output: (ctx) => {
        const podName = ctx.positionalArgs[0] ?? '';
        return `pod "${podName}" deleted

# Aviso: apagar um pod perde a evidência. O Deployment vai recriá-lo — o problema persiste.
# Em produção, faz "kubectl cordon <node>" ou rollback antes de deletar às cegas.`;
      },
    },
  ],

  stuckHints: [
    'Começa pelo mais básico: consegues listar os pods do namespace "checkout"?',
    'kubectl get pods -n checkout — depois vais ver o pod que está mal.',
    'Depois do get, o próximo é kubectl describe pod <nome> -n checkout — repara em "Last State" e "Reason".',
    'Para logs do container que já morreu: kubectl logs <pod> -n checkout --previous',
    'E para memória em tempo real dos que vivem: kubectl top pods -n checkout',
  ],

  debrief: {
    lesson: 'O padrão de debug em Kubernetes é sempre "get → describe → logs". O `describe` diz o que aconteceu (OOMKilled, exit 137), os logs mostram o antes (cache de 198MB), e `top` confirma que os outros pods também estão apertados no limit. A correcção real é aumentar `resources.limits.memory` — não reiniciar às cegas.',
    keyCommands: [
      'kubectl get pods -n <ns>              # visão geral',
      'kubectl describe pod <name> -n <ns>    # estado + eventos',
      'kubectl logs <name> -n <ns> --previous # logs do container morto',
      'kubectl top pods -n <ns>              # consumo em tempo real',
      'kubectl get events -n <ns>            # eventos do cluster',
    ],
  },
};
