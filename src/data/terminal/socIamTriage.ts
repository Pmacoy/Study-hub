import type { TerminalSession } from '../../types/terminal';

export const socIamTriageSession: TerminalSession = {
  id: 'soc-iam-triage',
  domain: 'devops', // Can remain devops or cybersecurity depending on routing
  title: 'SOC L2 · Cloud IAM Privilege Escalation',
  hook: 'O SIEM disparou um alerta: Ação `AssumeRole` suspeita seguida da criação de um utilizador administrativo na AWS (CloudTrail). És o analista L2 em serviço. Triage o incidente.',
  shell: 'bash',
  prompt: 'l2-analyst@soc-terminal:~/investigation$ ',
  difficulty: 'senior',
  timeEstimateMin: 15,
  tags: ['soc', 'aws', 'iam', 'triage'],

  briefing: `O teu objetivo é analisar um ficheiro de logs JSON exportado do AWS CloudTrail e determinar o IP e a ação maliciosa.
Comandos disponíveis: 'cat cloudtrail.json', 'grep', 'jq' (simulado).
A tua missão:
1. Analisar os logs.
2. Identificar a API de elevação de privilégios chamada.
3. Bloquear o IP atacante escrevendo a resposta num ficheiro: echo "BLOCK <IP>" > remediation.txt`,

  objectives: [
    { id: 'obj-cat', label: 'Ler os logs de CloudTrail', hint: 'cat cloudtrail.json', goalTag: 'cat-logs' },
    { id: 'obj-grep', label: 'Encontrar a ação suspeita no IAM', hint: 'grep "eventName" cloudtrail.json', goalTag: 'grep-action' },
    { id: 'obj-block', label: 'Criar ficheiro de remediação', hint: 'echo "BLOCK 198.51.100.42" > remediation.txt', goalTag: 'block-ip' },
  ],

  handlers: [
    {
      id: 'cat-logs',
      tokens: [['cat', 'cloudtrail.json']],
      goalTag: 'cat-logs',
      output: `{
  "Records": [
    {
      "eventVersion": "1.08",
      "userIdentity": {
        "type": "AssumedRole",
        "principalId": "AROA123456789:DevSession",
        "arn": "arn:aws:sts::123456789012:assumed-role/DeveloperRole/DevSession"
      },
      "eventTime": "2026-09-22T02:14:00Z",
      "eventSource": "iam.amazonaws.com",
      "eventName": "CreateUser",
      "awsRegion": "us-east-1",
      "sourceIPAddress": "198.51.100.42",
      "requestParameters": {
        "userName": "backdoor-admin"
      }
    }
  ]
}`,
    },
    {
      id: 'grep-logs',
      tokens: [['grep', '"eventName"', 'cloudtrail.json'], ['grep', 'eventName', 'cloudtrail.json']],
      goalTag: 'grep-action',
      teachingNote: 'Em investigações reais, ferramentas como `jq` ou SPL (Splunk) são essenciais para parsear JSON massivo.',
      output: `      "eventName": "CreateUser",`,
    },
    {
      id: 'block-ip',
      tokens: [['echo']],
      goalTag: 'block-ip',
      output: (ctx) => {
        if (ctx.raw.includes('remediation.txt')) {
          if (ctx.raw.includes('198.51.100.42') && ctx.raw.includes('BLOCK')) {
            return `Ação de contenção registada com sucesso! O IP 198.51.100.42 foi adicionado à blocklist do WAF.`;
          }
          return `Formato inválido ou IP incorreto. Usa: echo "BLOCK <IP_EXATO>" > remediation.txt`;
        }
        return ctx.positionalArgs.join(' ');
      }
    },
    {
      id: 'ls',
      tokens: [['ls']],
      output: `cloudtrail.json  playbook-09.md`
    }
  ],

  stuckHints: [
    'Usa `cat cloudtrail.json` para ver o conteúdo completo do log.',
    'Repara no campo "sourceIPAddress" no evento "CreateUser".',
    'Bloqueia o IP com `echo "BLOCK 198.51.100.42" > remediation.txt`'
  ],

  debrief: {
    lesson: 'Um ataque comum contra Cloud IAM (Playbook 9) envolve comprometer uma sessão (ex: DeveloperRole) através de SSRF ou roubo de tokens, e usar essa sessão para criar um utilizador persistente (`CreateUser` ou `CreateAccessKey`). O SOC L2 deve identificar o IP anómalo (`198.51.100.42`) e bloqueá-lo imediatamente, seguindo-se da revogação das credenciais comprometidas.',
    keyCommands: [
      'cat cloudtrail.json | jq ".Records[] | .sourceIPAddress"',
      'aws iam delete-user --user-name backdoor-admin',
      'aws iam put-user-policy --user-name DevSession --policy-name RevokeAll ...',
    ],
  },
};
