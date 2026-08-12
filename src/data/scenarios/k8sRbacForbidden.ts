import type { Scenario } from '../../types/scenario';

export const k8sRbacForbiddenScenario: Scenario = {
  id: 'k8s-rbac-forbidden',
  domain: 'devops',
  format: 'guided',
  title: 'Aplicação recebe "Forbidden" ao chamar a API do K8s',
  hook: 'Uma aplicação que lista pods para fazer service discovery começou a falhar depois de a moveres para um novo namespace. Os logs mostram: `pods is forbidden: User "system:serviceaccount:apps:discovery" cannot list resource "pods"`. A app está em produção.',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['kubernetes', 'rbac', 'security', 'serviceaccount'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Cluster:        gke-prod
Namespace:      apps
ServiceAccount: discovery
App:            service-discovery (lista pods via API)
Erro:           pods is forbidden ... cannot list resource "pods"
Mudança:        movida do namespace "default" para "apps" ontem`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'logs',
      label: '$ kubectl logs discovery-xxx -n apps',
      language: 'bash',
      content: `2026-07-06T14:22:01Z INFO  Starting service discovery
2026-07-06T14:22:01Z ERROR Failed to list pods:
  pods is forbidden: User "system:serviceaccount:apps:discovery"
  cannot list resource "pods" in API group "" in the namespace "apps"`,
    },
    {
      id: 'can-i',
      label: '$ kubectl auth can-i list pods --as=system:serviceaccount:apps:discovery -n apps',
      language: 'bash',
      content: `no

# O ServiceAccount discovery NÃO tem permissão para listar pods`,
    },
    {
      id: 'rolebindings',
      label: '$ kubectl get rolebindings,clusterrolebindings -A | grep discovery',
      language: 'bash',
      content: `NAMESPACE   NAME                    ROLE                AGE
default     discovery-can-list      Role/pod-reader     90d

# O RoleBinding existe... mas no namespace "default", não em "apps".
# A app moveu-se para "apps" mas o binding ficou para trás.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O erro diz "cannot list resource pods". Como confirmas exactamente o que o ServiceAccount pode ou não fazer?',
      revealArtifacts: ['logs'],
      options: [
        { id: 'a', label: 'kubectl auth can-i list pods --as=system:serviceaccount:apps:discovery -n apps', correct: true,
          feedback: 'Correcto. `kubectl auth can-i --as=...` é a forma exacta de testar as permissões de um ServiceAccount. Responde yes/no.',
          revealArtifacts: ['can-i'] },
        { id: 'b', label: 'kubectl describe pod discovery-xxx', correct: false,
          feedback: 'O describe do pod não te diz nada sobre permissões RBAC. O erro é de autorização, não de estado do pod.' },
        { id: 'c', label: 'Reiniciar o pod', correct: false,
          feedback: 'O erro é de permissões, não de estado transitório. Reiniciar não concede permissões.' },
      ],
      teachingNote: '`kubectl auth can-i <verb> <resource> --as=<user> -n <namespace>` é a ferramenta essencial para debugar RBAC. Simula exactamente o que aquela identidade pode fazer.',
    },
    {
      id: 'step-2',
      prompt: 'Confirmaste "no". Onde procuras a razão pela qual falta a permissão?',
      revealArtifacts: ['can-i'],
      options: [
        { id: 'a', label: 'Verificar Roles/RoleBindings — a permissão vem de um binding entre o SA e uma Role', correct: true,
          feedback: 'Correcto. A permissão para listar pods tem de vir de uma Role (ou ClusterRole) ligada ao ServiceAccount via (Cluster)RoleBinding.',
          revealArtifacts: ['rolebindings'] },
        { id: 'b', label: 'Verificar Network Policies', correct: false,
          feedback: 'Network Policies controlam tráfego de rede, não permissões de API. Um "forbidden" é sempre RBAC.' },
        { id: 'c', label: 'Verificar Pod Security Standards', correct: false,
          feedback: 'PSS controlam o que um pod pode fazer no node (privileges, volumes), não o acesso à API do Kubernetes.' },
      ],
      teachingNote: 'RBAC tem 4 objectos: Role e ClusterRole (definem permissões), RoleBinding e ClusterRoleBinding (ligam a permissão a um sujeito). Se falta permissão, ou não há Role, ou não há Binding a ligar a Role ao ServiceAccount.',
    },
    {
      id: 'step-3',
      prompt: 'O RoleBinding "discovery-can-list" existe, mas no namespace "default". A app está agora em "apps". Porquê e como resolves?',
      revealArtifacts: ['rolebindings'],
      options: [
        { id: 'a', label: 'RoleBindings são namespaced. O binding ficou em "default"; preciso de o criar em "apps"', correct: true,
          feedback: 'Correcto. Um RoleBinding só concede permissões dentro do seu próprio namespace. Ao mover a app para "apps", o binding não veio junto. Criar o Role + RoleBinding em "apps" resolve.',
          revealArtifacts: [] },
        { id: 'b', label: 'Dar cluster-admin ao ServiceAccount', correct: false,
          feedback: 'NUNCA. cluster-admin viola o princípio do menor privilégio de forma grave. A app só precisa de listar pods num namespace — dá exactamente isso.' },
        { id: 'c', label: 'Mover a app de volta para "default"', correct: false,
          feedback: 'Isso mascara o problema. A app devia poder correr em qualquer namespace — a solução é criar o RBAC correcto em "apps".' },
      ],
      teachingNote: 'Role e RoleBinding são namespaced — só valem no namespace onde existem. ClusterRole e ClusterRoleBinding são globais. Ao mover workloads entre namespaces, o RBAC namespaced tem de ser recriado no destino.',
    },
  ],

  resolution: {
    rootCause: 'A aplicação de service discovery usa o ServiceAccount "discovery" para listar pods via API do Kubernetes. O RoleBinding que concedia essa permissão (discovery-can-list → Role pod-reader) existia apenas no namespace "default". Quando a app foi movida para o namespace "apps", o RoleBinding namespaced não a acompanhou, deixando o ServiceAccount sem permissões nesse novo namespace.',
    fix: 'Criar a Role (pod-reader com verbs: get, list, watch em pods) e o RoleBinding (ligando o ServiceAccount discovery à Role) no namespace "apps". Confirmar com `kubectl auth can-i list pods --as=system:serviceaccount:apps:discovery -n apps` → deve retornar "yes".',
    preventions: [
      'Gerir RBAC como código (Helm/Kustomize) junto com o deployment, para que o binding acompanhe a app',
      'Usar o princípio do menor privilégio: Role específica (list pods) em vez de ClusterRole ampla',
      'Se a app precisa de ver pods em vários namespaces, usar ClusterRole + RoleBinding por namespace (não ClusterRoleBinding global)',
      'Testar permissões em CI com kubectl auth can-i antes de promover para produção',
    ],
  },
};
