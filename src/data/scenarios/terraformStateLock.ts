import type { Scenario } from '../../types/scenario';

export const terraformStateLockScenario: Scenario = {
  id: 'terraform-state-lock',
  domain: 'devops',
  format: 'guided',
  title: 'Estado Terraform bloqueado — state lock',
  hook: 'São 14h. O pipeline de deploy está bloqueado há 30 minutos. Dois engineers correram "terraform apply" ao mesmo tempo. O estadoLock não é libertado.',
  difficulty: 'senior',
  timeEstimateMin: 10,
  tags: ['terraform', 'state', 'locking', 'ci-cd'],

  contextArtifacts: [
    {
      id: 'terraform-apply-error',
      label: '$ terraform apply — erro no pipeline',
      language: 'log',
      content: `terraform apply -auto-approve
  module.vpc.aws_internet_gateway.gw: Creating...
  module.vpc.aws_route_table_public.id: Creating...
  module.vpc.aws_internet_gateway.gw: Creation complete after 3s
  module.vpc.aws_route_table_public.id: Creation complete after 2s
  module.eks.aws_eks_cluster.main: Creating...
  module.eks.aws_eks_cluster.main: Still creating... [10s elapsed]
  module.eks.aws_eks_cluster.main: Still creating... [20s elapsed]

Error acquiring the state lock
  Error message: Failed to acquire lock for state lock ID
    lock_id: "a1b2c3d4-5678-90ab-cdef-123456789abc"
    Lock info: Reason: terraform apply
              Created: 2026-09-02 13:41:03.000000000 +0000 UTC
              Info: workspace: default; operation: OperationTypeApply
              Who: ci-pipeline-runner@build-agent-03
              Version: 1.9.8
              Path: production/terraform/.terraform.lock.hcl
              Operation: Operation{
                Operation: 0x7f, Version: 1.9.8, Info: workspace: default,
                Who: ci-pipeline-runner@build-agent-03,
                Created: 2026-09-02T13:41:03.127845Z,
                Path: production/terraform/
              }
            File: /terraform/state/production/terraform.tfstate.lock

  This means Terraform saw a lock file that it could not acquire.
  Another process may still be running, or the lock was not released cleanly.

  If the previous operation was interrupted, you can use "terraform force-unlock"
  to manually release the lock.`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'terraform-state-list',
      label: '$ terraform state list (na workspace local)',
      language: 'bash',
      content: `module.vpc.aws_internet_gateway.gw
module.vpc.aws_nat_gateway.nat
module.vpc.aws_route_table_association.private[0]
module.vpc.aws_route_table_association.private[1]
module.vpc.aws_route_table_association.public
module.vpc.aws_route_table_private
module.vpc.aws_route_table_public
module.vpc.aws_subnet.private[0]
module.vpc.aws_subnet.private[1]
module.vpc.aws_subnet.public[0]
module.vpc.aws_subnet.public[1]
module.vpc.aws_vpc.main
module.eks.aws_eks_cluster.main
module.eks.aws_eks_node_group.workers
module.eks.aws_iam_role.node
module.eks.aws_iam_role.cloudwatch
module.eks.aws_iam_role_policy_attachment.cloudwatch
module.eks.aws_iam_role_policy_attachment.workers
module.eks.kubernetes_config_map.aws_auth
module.eks.kubernetes_namespace.istio-system
module.eks.kubernetes_namespace.monitoring`,
    },
    {
      id: 'force-unlock-attempt',
      label: '$ terraform force-unlock --attempt 2',
      language: 'bash',
      content: `$ terraform force-unlock a1b2c3d4-5678-90ab-cdef-123456789abc
Error: Failed unlocking the state lock

  Error message: AccessDenied
  Details: User: ci-pipeline-runner is not authorized to perform
           dynamodb:DeleteItem on table terraform-state-locks

  The lock exists but the credentials currently in use do not have
  permission to delete the lock item from the DynamoDB table.
  You need an IAM role with dynamodb:DeleteItem on the lock table,
  or a human with admin rights to run the command.

  Current working directory: production/terraform/
  Backend: S3 (bucket: tf-state-prod)
  Lock table: terraform-state-locks (region: eu-west-1)`,
    },
    {
      id: 'terraform-lock-info',
      label: '$ cat .terraform/terraform.tfstate.lock  (local lock file)',
      language: 'json',
      content: `{
  "LockID": "a1b2c3d4-5678-90ab-cdef-123456789abc",
  "Reason": "terraform apply",
  "Version": "1.9.8",
  "Created": "2026-09-02T13:41:03.127845Z",
  "Path": "production/terraform/",
  "Operation": "OperationTypeApply",
  "Who": "ci-pipeline-runner@build-agent-03",
  "Info": "workspace: default",
  "Metadata": {
    "build_id": "74829",
    "branch": "main",
    "commit": "3f8a2b1",
    "runner_ip": "10.0.4.17"
  }
}`,
    },
    {
      id: 'ci-cd-pipeline',
      label: '.gitlab-ci.yml — deploy pipeline',
      language: 'yaml',
      content: `stages:
  - build
  - plan
  - apply

variables:
  TF_WORKSPACE: default
  TF_BACKEND_BUCKET: tf-state-prod
  TF_LOCK_TABLE: terraform-state-locks

plan:
  stage: plan
  script:
    - terraform init -backend-config="bucket=$TF_BACKEND_BUCKET"
    - terraform plan -out=tfplan
  artifacts:
    paths: [tfplan]

apply:
  stage: apply
  script:
    - terraform init -backend-config="bucket=$TF_BACKEND_BUCKET"
    - terraform apply -auto-approve tfplan
  when: manual
  needs: [plan]

# Triggered by webhook on push to main
deploy-main:
  stage: apply
  script:
    - terraform init -backend-config="bucket=$TF_BACKEND_BUCKET"
    - terraform apply -auto-approve -target=module.eks
  when: on_success
  needs: [plan]
  only:
    - main`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O pipeline está bloqueado com o erro "Error acquiring the state lock". Qual é a CAUSA raiz deste problema?',
      revealArtifacts: [],
      options: [
        {
          id: 'a',
          label: 'Dois processos de terraform apply correram ao mesmo tempo na mesma state; o primeiro adquiriu o lock e o segundo falhou ao tentar.',
          correct: true,
          feedback:
            'Exacto. O lock existe desde 13:41 e o erro apareceu agora. O hook já dizia que dois engineers correram apply simultaneamente.',
          revealArtifacts: ['terraform-lock-info'],
        },
        {
          id: 'b',
          label: 'O ficheiro de estado (.tfstate) corrompeu-se e o Terraform não o consegue ler.',
          correct: false,
          feedback:
            'Não — se o estado estivesse corrompido veríamos erro de parse/JSON, não erro de lock. O lock é uma entidade separada no DynamoDB.',
        },
        {
          id: 'c',
          label: 'A tabela DynamoDB atingiu o limite de taxa (RCU/WCU) e recusou a operação.',
          correct: false,
          feedback:
            'Um erro de throttle daria um código 400 ThrottlingException, não "Failed to acquire lock". O lock existe e é consultável — o problema é a permissão para o libertar.',
        },
      ],
      teachingNote:
        'Terraform locks a state usando o backend remoto (S3+DynamoDB). O lock garante que apenas um apply corre por workspace. Dois applies concorrentes = lock conflict.',
    },
    {
      id: 'step-2',
      prompt:
        'Tens o LockID (a1b2c3d4...). Queres correr "terraform force-unlock", mas o resultado mostra "AccessDenied" — o CI runner não tem permissão para o DynamoDB. Como procedes?',
      options: [
        {
          id: 'a',
          label: 'Correr force-unlock manualmente com credenciais de admin (role com dynamodb:DeleteItem na tabela de locks)',
          correct: true,
          feedback:
            'Correto. A permissão para eliminar o lock está separada da permissão para ler o estado. Um engineer com acesso admin ao bucket S3 e à tabela DynamoDB pode correr o comando localmente ou via AWS CLI direto.',
          revealArtifacts: ['force-unlock-attempt'],
        },
        {
          id: 'b',
          label: 'Apagar diretamente o ficheiro .terraform/terraform.tfstate.lock local',
          correct: false,
          feedback:
            'Isso não resolve nada — o lock real está na tabela DynamoDB, não num ficheiro local. O ficheiro local é apenas um cache/spinner do runner.',
        },
        {
          id: 'c',
          label: 'Esperar até ao TTL do lock (30 min) e deixar o Terraform libertar automaticamente',
          correct: false,
          feedback:
            'Terraform não usa TTL para locks DynamoDB — o lock fica até ser explicitamente libertado. Além disso, isso apenas atrasa o problema.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt:
        'Lock resolvido. O apply termina com sucesso. No post-mortem, qual é a CAUSA RAIZ que permitiu que dois applies corridos ao mesmo tempo?',
      revealArtifacts: ['ci-cd-pipeline'],
      options: [
        {
          id: 'a',
          label:
            'O pipeline tinha duas jobs de apply que podiam disparar simultaneamente (um manual + um automático ao main), sem nenhuma guarda de concorrência.',
          correct: true,
          feedback:
            'Exato. O ".gitlab-ci.yml" mostra duas jobs stage:apply — uma manual e outra triggered by on_success no push a main. Sem concurrency group, ambas correm ao mesmo tempo.',
          revealArtifacts: [],
        },
        {
          id: 'b',
          label:
            'O Terraform não está a usar backend remoto (S3) — está a guardar o estado localmente e por isso o lock falha.',
          correct: false,
          feedback:
            'O error message mostra claramente que o backend é S3 com lock table DynamoDB. O problema não é a ausência de backend remoto.',
        },
        {
          id: 'c',
          label: 'O DynamoDB está configurado com auto-scaling desligado, causando throttling.',
          correct: false,
          feedback:
            'Throttling daria erro diferente (provisioned throughput exceeded). O erro atual é de permissão, não de capacidade.',
        },
      ],
    },
    {
      id: 'step-4',
      prompt:
        'Como prevens que isto volte a acontecer — QUAL é a MELHOR prática a implementar?',
      options: [
        {
          id: 'a',
          label: 'Adicionar um concurrency group na pipeline CI (ex: group: terraform-prod, max-parallel: 1) e restringir quem pode trigger o apply',
          correct: true,
          feedback:
            'Concurrency groups são a forma canónica de impedir execução simultânea. Juntamente com permissões de deploy (só pessoas autorizadas, não todos os pushes), elimina a causa raiz.',
        },
        {
          id: 'b',
          label: 'Aumentar a tabela DynamoDB para on-demand capacity mode',
          correct: false,
          feedback:
            'Capacity mode protege contra throttling, não contra locks concorrentes. O problema continua mesmo com capacidade ilimitada.',
        },
        {
          id: 'c',
          label: 'Remover o lock do backend S3 e passar a usar estado local para evitar este problema',
          correct: false,
          feedback:
            'Estado local SEM lock é o OPNSITO desta situação. Sem backend remoto, cada engineer vê o seu próprio estado e não há forma de detectar conflitos.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt:
        'O apply foi desbloqueado e passou. No entanto, os recursos criados podem não estar 100% consistentes (o apply foi interrompido no meio). O que deves fazer depois de desbloquear?',
      options: [
        {
          id: 'a',
          label: 'Correr um novo "terraform plan" para verificar drift, depois "terraform apply" limpo — nunca confiar que o estado está intacto após um apply interrompido',
          correct: true,
          feedback:
            'Apply interrompido = estado inconsistente entre o real e o tfstate. Plan mostra o drift; apply limpo corrige. É a prática segura.',
        },
        {
          id: 'b',
          label: 'Correr "terraform import" em todos os recursos criados para resetar o estado',
          correct: false,
          feedback:
            'Import é para trazer recursos externos para dentro do estado — não para corrigir estado corrompido por apply interrompido. Seria manual e subjecto a erro.',
        },
        {
          id: 'c',
          label: 'Fazer "terraform state pull" e guardar num ficheiro de backup, depois ignorar — o próximo deploy normal resolve tudo',
          correct: false,
          feedback:
            'Backup do estado corrompido não resolve o problema. O próximo apply vai tentar aplicar as mudanças pendentes e pode criar recursos duplicados ou falhar silenciosamente.',
        },
      ],
      teachingNote:
        'Após force-unlock de um apply em progresso, SEMPRE rodar plan antes de qualquer nova ação. O estado pode ter metade dos recursos criados e o outro metade não — drift é real.',
    },
  ],

  resolution: {
    rootCause:
      'O pipeline tinha duas jobs de deploy (uma manual e uma automática por push ao main) que podiam disparar simultaneamente, sem qualquer mecanismo de exclusão mútua. Ambas corres terraform apply na mesma workspace, gerando um lock conflict. O runner do segundo apply não tinha permissões IAM para DynamoDB DeleteItem, impedindo force-unlock via CI.',
    fix:
      'Correr force-unlock manualmente com credenciais admin AWS; depois plan + apply limpos. O lock foi eliminado da tabela DynamoDB terraform-state-locks com sucesso.',
    preventions: [
      'Adicionar concurrency group na pipeline CI: group=terraform-prod, max-parallel=1 — impede dois applies simultâneos',
      'Restringir quem pode disparar o job apply: apenas líderes de equipa ou automação com permissão explícita',
      'Separar pipelines de dev/staging (sem lock) e produção (com lock obrigatório) para evitar applies manuais em paralelo',
      'Adicionar um pipeline stage "pre-deploy check" que valida se há apply em progresso antes de iniciar',
      'Configurar alertas CloudWatch para events de lock (terraform_lock_acquired/lock_released) e notificar quando um lock dura > 15 minutos',
      'Garantir que a role do CI runner tem permissão dynamodb:DeleteItem na lock table para force-unlock de emergência',
      'Documentar o procedimento de force-unlock no Runbook de SRE com os comandos exatos e quem está autorizado a executar',
    ],
  },
};
