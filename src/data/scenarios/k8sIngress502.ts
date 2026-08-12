import type { Scenario } from '../../types/scenario';

export const k8sIngress502Scenario: Scenario = {
  id: 'k8s-ingress-502',
  domain: 'devops',
  format: 'guided',
  title: 'Ingress devolve 502 Bad Gateway',
  hook: 'Acabaste de expor uma nova API através do Ingress. O DNS resolve, o TLS está OK, mas cada request devolve `502 Bad Gateway`. A app funciona quando fazes port-forward directo ao pod. Porque falha através do Ingress?',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['kubernetes', 'ingress', 'services', 'networking'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Cluster:      aks-prod
Namespace:    api
Ingress:      api-ingress → api.acme.com
Service:      api-svc
Deployment:   api (2 pods, ambos Running)
Sintoma:      502 via Ingress, mas port-forward ao pod funciona`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'get-all',
      label: '$ kubectl get pods,svc,ingress -n api',
      language: 'bash',
      content: `NAME                       READY   STATUS    RESTARTS   AGE
pod/api-5d4f8c9b6-2xk9m     1/1     Running   0          20m
pod/api-5d4f8c9b6-hp7wt     1/1     Running   0          20m

NAME             TYPE        CLUSTER-IP     PORT(S)    AGE
service/api-svc  ClusterIP   10.0.140.22    80/TCP     20m

NAME                        CLASS   HOSTS          ADDRESS        PORTS
ingress/api-ingress         nginx   api.acme.com   20.51.x.x      80,443`,
    },
    {
      id: 'describe-svc',
      label: '$ kubectl describe svc api-svc -n api',
      language: 'bash',
      content: `Name:              api-svc
Namespace:         api
Selector:          app=api
Type:              ClusterIP
Port:              http  80/TCP
TargetPort:        8080/TCP
Endpoints:         <none>

# ⚠️ Endpoints: <none> — o Service não tem pods por trás!`,
    },
    {
      id: 'pod-labels',
      label: '$ kubectl get pods -n api --show-labels',
      language: 'bash',
      content: `NAME                    READY   STATUS    LABELS
api-5d4f8c9b6-2xk9m     1/1     Running   app=api-checkout,pod-template-hash=5d4f8c9b6
api-5d4f8c9b6-hp7wt     1/1     Running   app=api-checkout,pod-template-hash=5d4f8c9b6

# Os pods têm label app=api-checkout
# Mas o Service selecciona app=api  →  MISMATCH`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O Ingress dá 502. O port-forward directo ao pod funciona. Onde está a falha mais provável?',
      revealArtifacts: ['get-all'],
      options: [
        { id: 'a', label: 'No pod — a aplicação está partida', correct: false,
          feedback: 'Se o port-forward directo ao pod funciona, a app está saudável. O problema está entre o Ingress e o pod.' },
        { id: 'b', label: 'Na cadeia Ingress → Service → Pod. Verificar o Service e os seus Endpoints', correct: true,
          feedback: 'Correcto. 502 do Ingress-nginx geralmente significa "não consegui chegar a um backend saudável". O Service é o próximo suspeito.',
          revealArtifacts: ['describe-svc'] },
        { id: 'c', label: 'No certificado TLS', correct: false,
          feedback: 'O enunciado diz que o TLS está OK. Além disso, um problema de TLS daria erro de handshake, não 502.' },
      ],
      teachingNote: 'Ingress → Service → Endpoints → Pod. Um 502 quase sempre quer dizer que o Ingress controller não encontrou um backend saudável. Segue a cadeia de trás para a frente.',
    },
    {
      id: 'step-2',
      prompt: 'O describe do Service mostra "Endpoints: <none>". O que significa isto?',
      revealArtifacts: ['describe-svc'],
      options: [
        { id: 'a', label: 'O Service não está a encontrar nenhum pod que corresponda ao seu selector', correct: true,
          feedback: 'Exacto. Endpoints vazios = o selector do Service não bate com nenhum pod. Sem endpoints, o Ingress não tem para onde encaminhar → 502.',
          revealArtifacts: ['pod-labels'] },
        { id: 'b', label: 'Os pods estão todos down', correct: false,
          feedback: 'Os pods estão Running (viste no get pods). O problema não é os pods estarem down — é o Service não os "ver".' },
        { id: 'c', label: 'O TargetPort está errado', correct: false,
          feedback: 'O TargetPort (8080) pode até estar certo. Mas Endpoints <none> aponta para um problema de selector, não de porta — se fosse porta, haveria endpoints mas as ligações falhavam.' },
      ],
      teachingNote: 'Endpoints <none> é um dos sintomas mais comuns e mal-diagnosticados. O Service usa um label selector; se nenhum pod tem esses labels exactos, os Endpoints ficam vazios e o tráfego não chega a lado nenhum.',
    },
    {
      id: 'step-3',
      prompt: 'O Service selecciona app=api mas os pods têm app=api-checkout. Qual é a correcção correcta?',
      revealArtifacts: ['pod-labels'],
      options: [
        { id: 'a', label: 'Alinhar o selector do Service com os labels reais dos pods (app=api-checkout)', correct: true,
          feedback: 'Correcto. O selector do Service tem de bater com os labels dos pods. Corriges o selector (ou os labels dos pods — mas mudar o Service é menos disruptivo).',
          revealArtifacts: [] },
        { id: 'b', label: 'Reiniciar o Ingress controller', correct: false,
          feedback: 'O Ingress controller está a fazer o seu trabalho — não há backend porque o Service não tem endpoints. Reiniciar não cria o match de labels.' },
        { id: 'c', label: 'Recriar os pods', correct: false,
          feedback: 'Os pods vão voltar com os mesmos labels (vêm do deployment template). O mismatch mantém-se.' },
      ],
      teachingNote: 'Corriges o selector do Service para app=api-checkout, OU mudas os labels do deployment para app=api. O importante é o alinhamento. Depois, `kubectl get endpoints api-svc` deve mostrar os IPs dos pods.',
    },
  ],

  resolution: {
    rootCause: 'O Service `api-svc` tinha um label selector `app=api`, mas os pods do deployment tinham o label `app=api-checkout`. Como nenhum pod correspondia ao selector, os Endpoints do Service ficaram vazios. O Ingress-nginx, ao não encontrar nenhum backend saudável, devolveu 502 Bad Gateway. O port-forward directo funcionava porque contorna o Service e fala directamente com o pod.',
    fix: 'Alinhar o selector do Service com os labels reais dos pods (mudar o selector para `app=api-checkout`), ou ajustar os labels do deployment. Verificar depois com `kubectl get endpoints api-svc -n api` — deve listar os IPs dos 2 pods.',
    preventions: [
      'Usar labels consistentes definidos por Helm/Kustomize para Service e Deployment ao mesmo tempo',
      'Adicionar um teste smoke pós-deploy que faz curl ao Ingress e valida 200',
      'Monitorizar Endpoints vazios (kube-state-metrics: kube_endpoint_address_available)',
      'Ao debugar Ingress 502: sempre verificar `kubectl get endpoints <svc>` antes de tudo',
    ],
  },
};
