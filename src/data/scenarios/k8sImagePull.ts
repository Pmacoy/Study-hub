import type { Scenario } from '../../types/scenario';

export const k8sImagePullScenario: Scenario = {
  id: 'k8s-imagepull-secret',
  domain: 'devops',
  format: 'guided',
  title: 'Pod preso em ImagePullBackOff',
  hook: 'Fizeste deploy de um serviço novo que usa uma imagem do registry privado da empresa. O pod nunca arranca — fica preso em `ImagePullBackOff`. O PM pergunta porque é que a feature ainda não está no ar.',
  difficulty: 'junior',
  timeEstimateMin: 6,
  tags: ['kubernetes', 'images', 'registry', 'secrets'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Cluster:      gke-prod
Namespace:    payments
Deployment:   fraud-detector (novo serviço)
Registry:     registry.acme.internal (privado)
Imagem:       registry.acme.internal/fraud-detector:1.0.0`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'get-pods',
      label: '$ kubectl get pods -n payments',
      language: 'bash',
      content: `NAME                              READY   STATUS             RESTARTS   AGE
fraud-detector-6b9c7d8f4-xk2mn    0/1     ImagePullBackOff   0          3m`,
    },
    {
      id: 'describe',
      label: '$ kubectl describe pod fraud-detector-6b9c7d8f4-xk2mn',
      language: 'bash',
      content: `Events:
  Type     Reason     From     Message
  ----     ------     ----     -------
  Normal   Scheduled  default  Successfully assigned payments/fraud-detector...
  Normal   Pulling    kubelet  Pulling image "registry.acme.internal/fraud-detector:1.0.0"
  Warning  Failed     kubelet  Failed to pull image: rpc error: code = Unknown
                                 desc = failed to authorize: authentication required
  Warning  Failed     kubelet  Error: ErrImagePull
  Normal   BackOff    kubelet  Back-off pulling image
  Warning  Failed     kubelet  Error: ImagePullBackOff`,
    },
    {
      id: 'secrets',
      label: '$ kubectl get secrets -n payments',
      language: 'bash',
      content: `NAME                  TYPE                             DATA   AGE
default-token-abc12   kubernetes.io/service-account    3      40d

# Não há nenhum secret do tipo kubernetes.io/dockerconfigjson`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O pod está em ImagePullBackOff. Qual é o primeiro comando para perceberes porquê?',
      revealArtifacts: ['get-pods'],
      options: [
        { id: 'a', label: 'kubectl logs fraud-detector-6b9c7d8f4-xk2mn', correct: false,
          feedback: 'Não há logs — o container nunca chegou a arrancar porque a imagem não foi puxada. Logs só existem depois do container correr.' },
        { id: 'b', label: 'kubectl describe pod fraud-detector-6b9c7d8f4-xk2mn', correct: true,
          feedback: 'Correcto. Os Events do describe mostram exactamente porque falhou o pull da imagem.',
          revealArtifacts: ['describe'] },
        { id: 'c', label: 'kubectl delete pod e deixar recriar', correct: false,
          feedback: 'Recriar não resolve nada — vai falhar da mesma forma. Precisas de perceber a causa primeiro.' },
      ],
      teachingNote: 'ImagePullBackOff = o kubelet não conseguiu puxar a imagem. Como o container não arrancou, `kubectl logs` não tem nada. O describe (Events) é sempre o primeiro sítio a olhar.',
    },
    {
      id: 'step-2',
      prompt: 'Os Events dizem "authentication required". O que está a acontecer?',
      revealArtifacts: ['describe'],
      options: [
        { id: 'a', label: 'A imagem não existe no registry', correct: false,
          feedback: 'Se a imagem não existisse, o erro seria "not found" ou "manifest unknown". O erro aqui é de autenticação.' },
        { id: 'b', label: 'O cluster não tem credenciais para o registry privado', correct: true,
          feedback: 'Exacto. "authentication required" significa que o kubelet tentou puxar sem credenciais válidas para o registry privado.',
          revealArtifacts: ['secrets'] },
        { id: 'c', label: 'O node não tem acesso à internet', correct: false,
          feedback: 'Se fosse rede, verias timeout ou "no route to host", não um erro de autenticação (que implica que chegou ao registry).' },
      ],
      teachingNote: 'Lê a mensagem de erro literalmente: "authentication required" = falta autenticação. Registry privado sem credenciais no cluster = pull negado.',
    },
    {
      id: 'step-3',
      prompt: 'Confirmaste que não há imagePullSecret. Qual é a correcção?',
      revealArtifacts: ['secrets'],
      options: [
        { id: 'a', label: 'Tornar o registry público', correct: false,
          feedback: 'Nunca. Um registry privado é privado por uma razão de segurança. A solução é dar credenciais ao cluster, não abrir o registry.' },
        { id: 'b', label: 'Criar um docker-registry secret e referenciá-lo em imagePullSecrets', correct: true,
          feedback: 'Correcto. `kubectl create secret docker-registry` cria as credenciais, e adiciona-se ao deployment em imagePullSecrets.',
          revealArtifacts: [] },
        { id: 'c', label: 'Copiar a imagem para o Docker Hub público', correct: false,
          feedback: 'Expor código proprietário num registry público é um risco de segurança grave. Não é a solução.' },
      ],
      teachingNote: 'A sequência é: `kubectl create secret docker-registry regcred --docker-server=registry.acme.internal --docker-username=USER --docker-password=PASS`, depois adicionar `imagePullSecrets: [{name: regcred}]` ao spec do pod/deployment.',
    },
  ],

  resolution: {
    rootCause: 'O deployment referenciava uma imagem de um registry privado (registry.acme.internal), mas o namespace payments não tinha nenhum imagePullSecret configurado. O kubelet tentou puxar a imagem sem credenciais e o registry recusou com "authentication required".',
    fix: 'Criar um secret do tipo docker-registry com as credenciais e referenciá-lo no deployment:\n`kubectl create secret docker-registry regcred --docker-server=registry.acme.internal --docker-username=$USER --docker-password=$PASS -n payments`\ne adicionar `imagePullSecrets: [{ name: regcred }]` ao pod spec.',
    preventions: [
      'Incluir o imagePullSecret nos templates/Helm charts base de cada namespace',
      'Usar um ServiceAccount com o imagePullSecret já anexado (imagePullSecrets no SA) para não repetir em cada deployment',
      'Em GKE/EKS/AKS, considerar Workload Identity / IAM roles para autenticar ao registry cloud sem secrets estáticos',
      'Validar em CI que a imagem é puxável antes de fazer merge do manifest',
    ],
  },
};
