import type { Scenario } from '../../types/scenario';

export const k8sPvcPendingScenario: Scenario = {
  id: 'k8s-pvc-pending-storageclass',
  domain: 'devops',
  format: 'guided',
  title: 'PVC preso em Pending, pod não arranca',
  hook: 'Migraste uma base de dados para o cluster. O StatefulSet não arranca — o pod fica em Pending. Investigas e vês que o PersistentVolumeClaim também está Pending há 10 minutos. A migração está bloqueada.',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['kubernetes', 'storage', 'pvc', 'storageclass'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Cluster:      eks-prod (recém-criado)
Namespace:    databases
Workload:     postgres (StatefulSet, 1 replica)
PVC:          postgres-data-postgres-0 (20Gi)
Situação:     PVC em Pending, pod não schedula`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'get-pvc',
      label: '$ kubectl get pvc -n databases',
      language: 'bash',
      content: `NAME                        STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-data-postgres-0    Pending                                        fast-ssd       10m`,
    },
    {
      id: 'describe-pvc',
      label: '$ kubectl describe pvc postgres-data-postgres-0 -n databases',
      language: 'bash',
      content: `Name:          postgres-data-postgres-0
Namespace:     databases
StorageClass:  fast-ssd
Status:        Pending
Events:
  Type     Reason              From                         Message
  ----     ------              ----                         -------
  Warning  ProvisioningFailed  persistentvolume-controller  storageclass.storage.k8s.io
                                                             "fast-ssd" not found`,
    },
    {
      id: 'get-sc',
      label: '$ kubectl get storageclass',
      language: 'bash',
      content: `NAME            PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      AGE
gp2 (default)   kubernetes.io/aws-ebs   Delete          WaitForFirstConsumer   40d
gp3             ebs.csi.aws.com         Delete          WaitForFirstConsumer   40d

# Não existe nenhuma storageclass chamada "fast-ssd"`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O pod está Pending porque o PVC está Pending. Qual é o comando para perceber porque o PVC não vincula?',
      revealArtifacts: ['get-pvc'],
      options: [
        { id: 'a', label: 'kubectl describe pvc postgres-data-postgres-0 -n databases', correct: true,
          feedback: 'Correcto. Os Events do PVC dizem exactamente porque a provisão falhou.',
          revealArtifacts: ['describe-pvc'] },
        { id: 'b', label: 'kubectl logs postgres-0 -n databases', correct: false,
          feedback: 'O pod nunca arrancou (está Pending à espera do volume), portanto não há logs.' },
        { id: 'c', label: 'Aumentar a capacidade do PVC', correct: false,
          feedback: 'O problema não é capacidade — é que o volume não está a ser provisionado. Mudar o tamanho não ajuda.' },
      ],
      teachingNote: 'PVC Pending → sempre `kubectl describe pvc`. Os Events revelam se é falta de StorageClass, falta de capacity no provisioner, ou zona errada.',
    },
    {
      id: 'step-2',
      prompt: 'Os Events dizem: storageclass "fast-ssd" not found. O que fazes a seguir?',
      revealArtifacts: ['describe-pvc'],
      options: [
        { id: 'a', label: 'kubectl get storageclass — ver quais existem no cluster', correct: true,
          feedback: 'Correcto. Precisas de saber que StorageClasses existem para perceber o mismatch.',
          revealArtifacts: ['get-sc'] },
        { id: 'b', label: 'Recriar o PVC igual', correct: false,
          feedback: 'Vai falhar da mesma forma — a StorageClass "fast-ssd" continua a não existir.' },
        { id: 'c', label: 'Reiniciar o controller de volumes', correct: false,
          feedback: 'O controller está a funcionar bem — ele reportou correctamente que a StorageClass não existe. Reiniciar não cria a classe.' },
      ],
      teachingNote: 'O nome da StorageClass no PVC tem de bater exactamente com uma que existe no cluster. Clusters diferentes (EKS, GKE, AKS, on-prem) têm nomes de StorageClass diferentes.',
    },
    {
      id: 'step-3',
      prompt: 'O cluster tem gp2 e gp3, mas o PVC pede fast-ssd (que veio de outro cluster). Qual é a melhor correcção?',
      revealArtifacts: ['get-sc'],
      options: [
        { id: 'a', label: 'Editar o StatefulSet para usar gp3 (uma StorageClass que existe)', correct: true,
          feedback: 'Correcto. gp3 é SSD, mais barato que gp2, e existe no cluster. Ajustar o manifest ao ambiente real é a solução limpa.',
          revealArtifacts: [] },
        { id: 'b', label: 'Criar uma StorageClass chamada fast-ssd que aponta para o provisioner errado', correct: false,
          feedback: 'Podias criar uma StorageClass fast-ssd, mas tens de a mapear ao provisioner e parâmetros correctos (ebs.csi.aws.com, tipo gp3). Fazê-lo à pressa com valores errados causa outros problemas. Reutilizar gp3 é mais seguro.' },
        { id: 'c', label: 'Remover a StorageClass do PVC para usar a default', correct: false,
          feedback: 'A default (gp2) funcionaria, mas para uma DB queres SSD moderno (gp3). Deixar cair para a default é aceitável mas não ideal para performance.' },
      ],
      teachingNote: 'PVCs de StatefulSets são imutáveis no campo storageClassName depois de criados. Podes ter de apagar o PVC (cuidado com dados!) e recriar o StatefulSet com a StorageClass correcta, ou criar a StorageClass em falta.',
    },
  ],

  resolution: {
    rootCause: 'O manifest do StatefulSet foi copiado de outro cluster onde existia uma StorageClass chamada "fast-ssd". No cluster EKS de destino, as StorageClasses disponíveis são gp2 (default) e gp3 — "fast-ssd" não existe. Sem StorageClass válida, o dynamic provisioner não consegue criar o volume, o PVC fica Pending e o pod nunca schedula.',
    fix: 'Alterar o volumeClaimTemplate do StatefulSet para usar uma StorageClass que existe no cluster (gp3). Se o StatefulSet já existe, pode ser preciso apagá-lo (mantendo os PVCs se houver dados) e recriar, ou criar uma StorageClass "fast-ssd" mapeada ao provisioner correcto (ebs.csi.aws.com, type: gp3).',
    preventions: [
      'Parametrizar o storageClassName via Helm values ou Kustomize overlays por ambiente, em vez de hardcode',
      'Documentar as StorageClasses disponíveis em cada cluster no runbook da equipa',
      'Validar manifests contra o cluster de destino em CI (kubeconform, kubectl --dry-run=server)',
      'Usar VOLUMEBINDINGMODE WaitForFirstConsumer para evitar volumes provisionados na zona errada',
    ],
  },
};
