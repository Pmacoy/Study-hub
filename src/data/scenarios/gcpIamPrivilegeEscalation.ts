import type { ChallengeScenario } from '../../types/scenario';

export const gcpIamPrivilegeEscalation: ChallengeScenario = {
  id: 'gcp-iam-privilege-escalation',
  domain: 'gcp',
  title: 'Privilege Escalation via Compute Engine',
  hook: 'A equipa de segurança detetou que um programador estagiário que tinha apenas acesso ao serviço de Google Compute Engine (GCE) conseguiu de alguma forma aceder a dados confidenciais do Cloud Storage (GCS) onde estavam dados de clientes que ele não tinha acesso.',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['gcp', 'iam', 'security', 'privilege-escalation', 'compute-engine'],

  artifacts: [
    {
      id: 'user-roles',
      label: 'Roles do Utilizador "estagiario@empresa.com"',
      language: 'bash',
      content: `roles/compute.instanceAdmin.v1
roles/iam.serviceAccountUser`,
    },
    {
      id: 'gcs-bucket-iam',
      label: 'IAM do Bucket Sensível',
      language: 'json',
      content: `{
  "bindings": [
    {
      "role": "roles/storage.objectViewer",
      "members": [
        "serviceAccount:app-backend-sa@project.iam.gserviceaccount.com"
      ]
    }
  ]
}`,
    },
    {
      id: 'audit-log',
      label: 'Cloud Audit Logs Recentes',
      language: 'json',
      content: `[
  {
    "methodName": "v1.compute.instances.insert",
    "principalEmail": "estagiario@empresa.com",
    "request": {
      "serviceAccounts": [{
        "email": "app-backend-sa@project.iam.gserviceaccount.com",
        "scopes": ["https://www.googleapis.com/auth/cloud-platform"]
      }]
    }
  },
  {
    "methodName": "storage.objects.get",
    "principalEmail": "app-backend-sa@project.iam.gserviceaccount.com",
    "resourceName": "projects/_/buckets/dados-confidenciais/objects/clientes.csv"
  }
]`,
    }
  ],

  diagnosisQuestion: 'Como é que o estagiário conseguiu ler o ficheiro `clientes.csv` se o seu utilizador pessoal não tinha a role de `roles/storage.objectViewer`?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'Ao ter as roles de "Compute Instance Admin" e "Service Account User", ele conseguiu criar uma nova VM associada à Service Account "app-backend-sa" que tem permissões de leitura do bucket. Depois conectou-se à VM e roubou os dados (Pass-role Privilege Escalation).',
      correct: true,
      feedback: 'Correto! Este é um vetor clássico de escalada de privilégios em GCP. O `iam.serviceAccountUser` permite ao utilizador "passar" ou "assumir indiretamente" os privilégios dessa SA ao atachá-la num recurso compute que ele controla (InstanceAdmin). Depois, dentro da VM, o default credential auth usa essa SA poderosa.'
    },
    {
      id: 'b',
      label: 'Havia um erro no Bucket IAM que considerava todos os Compute Admins como Storage Viewers implícitos.',
      correct: false,
      feedback: 'GCP não faz herança transversal entre compute e storage implicitamente. O IAM do bucket só autoriza explicitamente a SA.'
    },
    {
      id: 'c',
      label: 'Ele encontrou a password da service account guardada num disco.',
      correct: false,
      feedback: 'O audit log mostra a criação de uma VM (instances.insert) especificando essa service account. Ele não precisou de senhas, simplesmente usou o seu direito (iam.serviceAccountUser) para imbuir a máquina virtual dos poderes da SA.'
    },
    {
      id: 'd',
      label: 'Ele ativou um scope "cloud-platform" super-poderoso que sobrescreveu as regras do IAM global.',
      correct: false,
      feedback: 'Os scopes determinam os tetos do que a VM pode pedir via API, mas não sobrepõem as verificações de IAM reais da Service Account. O problema base foi ter conseguido atachar uma SA com alto nível de acesso.'
    }
  ],

  fixQuestion: 'Como mitigar este vetor de Privilege Escalation mantendo o princípio de Least Privilege (Privilégio Mínimo)?',
  fixOptions: [
    {
      id: 'a',
      label: 'Remover o `iam.serviceAccountUser` ao nível do projeto, e atachá-lo apenas para Service Accounts específicas e restritas nas quais o estagiário deve operar.',
      correct: true,
      feedback: 'Exato! A role `iam.serviceAccountUser` não deve ser dada ao nível do "Project" se existirem SAs poderosas no mesmo projeto. Deve ser dada de forma granular (no resource da SA específica que é inofensiva) ou os projetos devem ser separados.'
    },
    {
      id: 'b',
      label: 'Remover a permissão `roles/compute.instanceAdmin.v1` e colocar `roles/compute.admin`.',
      correct: false,
      feedback: 'compute.admin tem ainda MAIS privilégios que instanceAdmin. A falha está na união do poder computacional com o direito irrestrito de atachar Service Accounts.'
    },
    {
      id: 'c',
      label: 'Forçar os Buckets a serem Private retirando o "allUsers" do ACL.',
      correct: false,
      feedback: 'O bucket não estava exposto a allUsers, estava restrito à SA de backend. A mitigação é impedir a delegação não intencional dessa SA.'
    },
    {
      id: 'd',
      label: 'Instalar firewalls na VPC (Cloud Armor) para impedir a leitura do GCS a partir de instâncias.',
      correct: false,
      feedback: 'Isso quebraria o backend legítimo que usa aquela SA. O acesso legítimo não deve ser bloqueado; deve-se bloquear quem tem autoridade para usar as credenciais desse serviço.'
    }
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O Audit log tem dois eventos chave. O estagiário (ele próprio) cria uma VM. Na criação (instances.insert), ele anexa uma serviceAccount específica (app-backend-sa).'
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'Uma vez criada a VM, qualquer código rodado lá vai herdar o Identity da `app-backend-sa`. Logo a seguir, vemos o acesso aos dados sensíveis por parte da `app-backend-sa`.'
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Para conseguires atribuir uma Service Account a uma máquina no GCP, precisas da permissão IAM de agir como "User" dessa Service Account (iam.serviceAccountUser).'
    }
  ],

  resolution: {
    rootCause: 'Privilege Escalation clássico por Pass-Role. O estagiário tinha as permissões necessárias para criar uma instância Compute, aliadas à permissão (a nível de todo o projeto) de usar QUALQUER Service Account. Ao criar uma VM e anexar a Service Account do Backend, obteve acesso indireto a todos os recursos que a SA tinha, saltando a barreira de segurança.',
    fix: 'Retirar a role "Service Account User" no nível do Projeto. Aplicar IAM bindings diretamente nas Service Accounts de desenvolvimento e atribuí-las aos estagiários ali. Adicionalmente, separar as contas de desenvolvimento e as Service Accounts de Produção/Sensíveis em Projetos GCP distintos.',
    preventions: [
      'Garantir separação de ambientes usando Múltiplos Projetos GCP (Isolamento Forte)',
      'Nunca atribuir `roles/iam.serviceAccountUser` globalmente no projeto',
      'Configurar alertas de Security Command Center (SCC) para comportamentos de criação de VMs não-padrão',
    ]
  }
};
