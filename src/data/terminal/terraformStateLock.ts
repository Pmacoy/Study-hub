import type { TerminalSession } from '../../types/terminal';

export const terraformStateLockSession: TerminalSession = {
  id: 'terraform-state-lock',
  domain: 'devops',
  title: 'Terraform · State Lock Error',
  hook: 'O pipeline de CI falhou a meio de um "terraform apply". Agora tentas correr terraform na tua máquina e recebes "Error acquiring the state lock". Resolve o bloqueio.',
  shell: 'bash',
  prompt: 'user@dev-machine:~/infrastructure$ ',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['terraform', 'iac', 'troubleshooting'],

  briefing: `O Terraform usa um mecanismo de bloqueio (State Lock) no S3/DynamoDB para prevenir corrupção quando várias pessoas (ou pipelines) tentam alterar a infraestrutura em simultâneo.
O teu objetivo é forçar o desbloqueio do state usando o ID do lock.
Dica: Executa 'terraform apply' para ver o erro detalhado.`,

  objectives: [
    { id: 'obj-apply', label: 'Tentar aplicar e encontrar o Lock ID', hint: 'terraform apply', goalTag: 'tf-apply-error' },
    { id: 'obj-force-unlock', label: 'Forçar o desbloqueio do state', hint: 'terraform force-unlock <LOCK_ID>', goalTag: 'tf-force-unlock' },
  ],

  handlers: [
    {
      id: 'tf-apply',
      tokens: [['terraform', 'apply'], ['terraform', 'plan']],
      goalTag: 'tf-apply-error',
      teachingNote: 'O Terraform bloqueia o estado no backend remoto para garantir consistência. Nunca forces um unlock se alguém estiver ativamente a aplicar código.',
      output: `Acquiring state lock. This may take a few moments...

Error: Error acquiring the state lock

Error message: ConditionalCheckFailedException: The conditional request failed
Lock Info:
  ID:        d8e3b5-4b1a-8c9f-3e2c-1f5a6b7c8d9e
  Path:      my-terraform-state-bucket/env/prod/terraform.tfstate
  Operation: OperationTypeApply
  Who:       ci-runner@github-actions
  Version:   1.5.7
  Created:   2026-09-22 10:15:32.123 +0000 UTC
  Info:      

Terraform acquires a state lock to protect the state from being written
by multiple users at the same time. Please resolve the issue above and try
again. For most commands, you can disable locking with the "-lock=false"
flag, but this is not recommended.`,
    },
    {
      id: 'tf-force-unlock',
      tokens: [['terraform', 'force-unlock']],
      goalTag: 'tf-force-unlock',
      teachingNote: 'O force-unlock liberta a flag de bloqueio na base de dados remota (ex: DynamoDB).',
      output: (ctx) => {
        const lockId = ctx.positionalArgs[0] ?? '';
        if (lockId === 'd8e3b5-4b1a-8c9f-3e2c-1f5a6b7c8d9e') {
          return `Do you really want to force-unlock?
Terraform will remove the lock on the remote state.
(Simulated answer: yes)

Terraform state has been successfully unlocked!
O lock anterior foi removido. Agora já podes correr 'terraform apply' em segurança.`;
        }
        if (!lockId) {
          return `Usage: terraform force-unlock LOCK_ID\n\nError: Missing LOCK_ID argument.`;
        }
        return `Error: Failed to unlock state: Lock ID "${lockId}" does not match the current lock.`;
      },
    },
    {
      id: 'ls',
      tokens: [['ls']],
      output: `main.tf  variables.tf  outputs.tf  .terraform/  .terraform.lock.hcl`
    }
  ],

  stuckHints: [
    'Executa `terraform apply` primeiro para leres o erro. Lá estará a informação do Lock.',
    'Procura na mensagem de erro pela linha que diz `ID: ...`. Esse é o Lock ID.',
    'Com o ID na mão, usa `terraform force-unlock <ESSE_ID>`.'
  ],

  debrief: {
    lesson: 'Quando um processo Terraform é morto abruptamente (ex: pipeline cancelada ou OOM kill), o Lock no Remote State (DynamoDB na AWS, Azure Blob Storage lease) não é removido. O comando `terraform force-unlock <ID>` é o teu "get out of jail free card", MAS deve ser usado com extremo cuidado: certifica-te sempre de que ninguém está mesmo a modificar a infraestrutura antes de o fazeres.',
    keyCommands: [
      'terraform plan                    # Vê as alterações (também pede lock)',
      'terraform force-unlock <ID>       # Desbloqueia manualmente o state',
      'terraform apply -lock=false       # IGNORA o lock (muito perigoso!)',
    ],
  },
};
