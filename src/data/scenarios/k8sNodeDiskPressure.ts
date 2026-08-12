import type { Scenario } from '../../types/scenario';

export const k8sNodeDiskPressureScenario: Scenario = {
  id: 'k8s-node-disk-pressure',
  domain: 'devops',
  format: 'guided',
  title: 'Pods a serem despejados por Disk Pressure no node',
  hook: 'Às 2h da manhã, pods de vários namespaces começam a ser despejados (Evicted) sem padrão óbvio. Não houve deploy. À medida que os pods se movem, outros nodes também começam a despejar. É um efeito dominó. Estás de piquete.',
  difficulty: 'senior',
  timeEstimateMin: 9,
  tags: ['kubernetes', 'nodes', 'disk-pressure', 'eviction'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Cluster:      eks-prod (6 nodes)
Hora:         02:14 (sem deploys recentes)
Sintoma:      Pods Evicted em cascata, vários namespaces
Padrão:       começou num node, a espalhar-se
Piquete:      tu`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'get-pods-evicted',
      label: '$ kubectl get pods -A | grep Evicted',
      language: 'bash',
      content: `logging      fluentd-8x2n9              0/1     Evicted   0    3m
api          api-checkout-5d4-kp9m     0/1     Evicted   0    2m
api          api-orders-7f8-mn3x       0/1     Evicted   0    2m
monitoring   prometheus-0              0/1     Evicted   0    1m
# ... e a crescer`,
    },
    {
      id: 'describe-node',
      label: '$ kubectl describe node ip-10-2-3-4',
      language: 'bash',
      content: `Conditions:
  Type             Status  Reason                Message
  ----             ------  ------                -------
  DiskPressure     True    KubeletHasDiskPressure  kubelet has disk pressure
  MemoryPressure   False   KubeletHasSufficientMemory
  Ready            True    KubeletReady

Events:
  Type     Reason              Message
  ----     ------              -------
  Warning  EvictionThresholdMet  Attempting to reclaim ephemeral-storage
  Warning  ImageGCFailed         failed to garbage collect required amount of images`,
    },
    {
      id: 'node-df',
      label: '$ (via node debug) df -h /var/lib/docker',
      language: 'bash',
      content: `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  100G   97G  3.0G  97% /var/lib/docker

# 97% cheio. O culpado principal:
$ du -sh /var/lib/docker/containers/*/*-json.log | sort -h | tail -3
18G  /var/lib/docker/containers/abc.../abc-json.log
22G  /var/lib/docker/containers/def.../def-json.log
31G  /var/lib/docker/containers/ghi.../ghi-json.log
# Logs de containers sem rotação a encher o disco`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Pods a serem despejados em cascata sem deploy. Qual é o primeiro passo para perceber a causa?',
      revealArtifacts: ['get-pods-evicted'],
      options: [
        { id: 'a', label: 'kubectl describe node num dos nodes afectados — ver as Conditions', correct: true,
          feedback: 'Correcto. As Conditions do node (DiskPressure, MemoryPressure, PIDPressure) dizem-te porque o kubelet está a despejar pods.',
          revealArtifacts: ['describe-node'] },
        { id: 'b', label: 'Recriar os pods despejados', correct: false,
          feedback: 'Vão ser despejados de novo — a causa (pressão no node) continua lá. Pior: podes acelerar o efeito dominó ao empurrar pods para nodes já sob pressão.' },
        { id: 'c', label: 'Escalar o deployment para mais réplicas', correct: false,
          feedback: 'Mais réplicas em nodes sob disk pressure só piora — mais pods a competir por disco que já está cheio.' },
      ],
      teachingNote: 'Eviction em cascata sem deploy = node-level pressure. As node Conditions (DiskPressure/MemoryPressure/PIDPressure) são o primeiro sítio a olhar. O kubelet despeja pods para se auto-proteger.',
    },
    {
      id: 'step-2',
      prompt: 'O node tem DiskPressure=True e "ImageGCFailed". Porque é que isto causa um efeito dominó?',
      revealArtifacts: ['describe-node'],
      options: [
        { id: 'a', label: 'Ao despejar pods, o scheduler move-os para outros nodes, que também enchem e começam a despejar', correct: true,
          feedback: 'Exacto. Os pods despejados são reagendados para outros nodes. Se a causa raiz (ex: logs sem rotação) existe em todos os nodes, cada node atinge o threshold e o problema propaga-se.',
          revealArtifacts: ['node-df'] },
        { id: 'b', label: 'Os pods estão a atacar-se uns aos outros', correct: false,
          feedback: 'Não há "ataque" — é o comportamento normal do scheduler a mover pods despejados, combinado com uma causa raiz partilhada por todos os nodes.' },
        { id: 'c', label: 'É um bug do Kubernetes', correct: false,
          feedback: 'O comportamento de eviction é intencional (proteger o node). O problema é a causa raiz do disco cheio, não o Kubernetes.' },
      ],
      teachingNote: 'Efeito dominó de eviction: node A enche → despeja pods → scheduler move para node B → node B também tem a causa raiz → enche → despeja. Sem resolver a causa raiz partilhada, apagar sintomas espalha o fogo.',
    },
    {
      id: 'step-3',
      prompt: 'A investigação no node mostra logs de containers de 30GB+ sem rotação a encher /var/lib/docker. Qual é a resposta correcta (curto + longo prazo)?',
      revealArtifacts: ['node-df'],
      options: [
        { id: 'a', label: 'Curto prazo: limpar imagens/logs órfãos e rodar logs. Longo prazo: configurar log rotation e alertas de disco', correct: true,
          feedback: 'Correcto. Estanca o fogo (docker system prune, truncar/rodar logs gigantes) e depois corrige a causa raiz: log rotation no runtime (max-size/max-file) e alertas de disco antes do threshold.',
          revealArtifacts: [] },
        { id: 'b', label: 'Só reiniciar os nodes', correct: false,
          feedback: 'Reiniciar não apaga os logs (persistem em disco) e a causa raiz (sem rotação) mantém-se. Os logs voltam a crescer.' },
        { id: 'c', label: 'Adicionar mais nodes ao cluster', correct: false,
          feedback: 'Mais nodes só adia o problema — cada node novo também encherá sem log rotation. Não resolve a causa raiz.' },
      ],
      teachingNote: 'Curto prazo: `docker system prune -af`, truncar os *-json.log gigantes, ou cordon+drain o node para o esvaziar. Longo prazo: configurar log rotation no container runtime (`max-size: 10m, max-file: 3`), enviar logs para fora do node (Fluentd→backend), e alertar sobre disco a >80% antes do kubelet chegar ao threshold.',
    },
  ],

  resolution: {
    rootCause: 'Logs de containers em formato json-file cresceram sem rotação (alguns >30GB), enchendo o disco /var/lib/docker de vários nodes até 97%. Ao atingir o threshold de ephemeral-storage, o kubelet marcou os nodes com DiskPressure=True e começou a despejar pods para recuperar espaço. Como todos os nodes partilhavam a mesma causa raiz (falta de log rotation), os pods despejados eram reagendados para nodes que também encheram — criando um efeito dominó de evictions pelo cluster.',
    fix: 'Curto prazo: libertar espaço nos nodes (docker system prune -af, truncar os ficheiros *-json.log grandes, ou cordon+drain para esvaziar o node de forma controlada). Longo prazo: configurar log rotation no container runtime (max-size/max-file), garantir que o log shipper (Fluentd) não faz backlog, e adicionar alertas de disco a >80%.',
    preventions: [
      'Configurar log rotation no runtime: {"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}',
      'Enviar logs para fora do node (Fluentd/Fluent Bit → Loki/Elasticsearch) e não os acumular localmente',
      'Alertar sobre disk usage do node a >80%, antes de chegar ao eviction threshold do kubelet',
      'Definir ephemeral-storage requests/limits nos pods para o scheduler considerar disco',
      'Monitorizar node Conditions (DiskPressure) e ter runbook para evictions em cascata',
    ],
  },
};
