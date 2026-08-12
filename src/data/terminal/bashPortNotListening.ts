import type { TerminalSession } from '../../types/terminal';

export const bashPortNotListeningSession: TerminalSession = {
  id: 'bash-port-not-listening',
  domain: 'devops',
  title: 'bash · aplicação não responde na porta',
  hook: 'O load balancer marca o backend como unhealthy. Fazes curl à porta 8080 do serviço e recebes "connection refused". O processo parece estar a correr. Descobre porque a porta não está a aceitar ligações.',
  shell: 'bash',
  prompt: 'user@api-node-03:~$ ',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['linux', 'bash', 'networking', 'ports', 'troubleshooting'],

  briefing: `Servidor: api-node-03 (Ubuntu 22.04) · Alerta: "backend unhealthy, connection refused :8080".
O serviço deveria escutar na porta 8080. Ferramentas: ss, curl, systemctl, journalctl.
"connection refused" = nada a escutar na porta (diferente de "timeout" = firewall/rede).
Escreve 'hint' para uma dica ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-ss', label: 'Ver que portas estão à escuta', hint: 'ss -tlnp  (ou netstat -tlnp)', goalTag: 'ss-listen' },
    { id: 'obj-status', label: 'Verificar o estado do serviço', hint: 'systemctl status api', goalTag: 'svc-status' },
    { id: 'obj-logs', label: 'Ver os logs do serviço para perceber porque não abriu a porta', hint: 'journalctl -u api -n 30', goalTag: 'svc-logs' },
  ],

  handlers: [
    {
      id: 'ss-listen',
      tokens: [['ss'], ['netstat']],
      flags: [
        { names: ['-t'] }, { names: ['-l'] }, { names: ['-n'] },
        { names: ['-p'] }, { names: ['-tlnp'] }, { names: ['-tulpn'] }, { names: ['-a'] },
      ],
      goalTag: 'ss-listen',
      teachingNote: 'ss -tlnp: t=TCP, l=listening, n=numérico (sem resolver DNS), p=processo. É o comando moderno (netstat é legado mas funciona igual).',
      output: () => `State    Recv-Q  Send-Q  Local Address:Port   Peer Address:Port  Process
LISTEN   0       128     127.0.0.1:5432       0.0.0.0:*          postgres
LISTEN   0       128     0.0.0.0:22           0.0.0.0:*          sshd
LISTEN   0       128     0.0.0.0:9090         0.0.0.0:*          node-exporter

# ⚠️ A porta 8080 NÃO aparece — nada está à escuta nela.
# Confirma o "connection refused": não há processo a aceitar ligações em :8080.`,
    },
    {
      id: 'svc-status',
      tokens: [['systemctl']],
      flags: [{ names: ['--no-pager'] }, { names: ['-l'] }],
      goalTag: 'svc-status',
      teachingNote: 'systemctl status mostra se o serviço está active (running), failed, ou noutro estado. Um serviço "activating" ou em restart loop não chega a abrir a porta.',
      output: (ctx) => {
        const sub = ctx.positionalArgs[0] ?? '';
        const svc = ctx.positionalArgs[1] ?? '';
        if (sub === 'status' && (svc === 'api' || svc === 'api.service')) {
          return `● api.service - API backend service
     Loaded: loaded (/etc/systemd/system/api.service; enabled)
     Active: activating (auto-restart) (Result: exit-code) since 14:40:12
   Main PID: 18402 (code=exited, status=1/FAILURE)

Jul 06 14:40:12 api-node-03 systemd[1]: api.service: Main process exited, code=exited, status=1
Jul 06 14:40:12 api-node-03 systemd[1]: api.service: Failed with result 'exit-code'.
Jul 06 14:40:12 api-node-03 systemd[1]: api.service: Scheduled restart (restart counter is at 7)

# ⚠️ "activating (auto-restart)" + restart counter 7 → o serviço está num loop de reinícios.
# Nunca fica up tempo suficiente para abrir a porta 8080.`;
        }
        if (sub === 'status') {
          return `Unit ${svc} could not be found.`;
        }
        return `# tenta: systemctl status api`;
      },
    },
    {
      id: 'svc-logs',
      tokens: [['journalctl']],
      flags: [
        { names: ['-u'], valueRequired: true },
        { names: ['-n'], valueRequired: true },
        { names: ['-f'] }, { names: ['--no-pager'] }, { names: ['-e'] },
      ],
      goalTag: 'svc-logs',
      teachingNote: 'journalctl -u <serviço> mostra os logs desse serviço específico. É onde vais ver o erro real que impede o arranque.',
      output: () => `Jul 06 14:40:11 api-node-03 api[18402]: Starting API backend...
Jul 06 14:40:11 api-node-03 api[18402]: Connecting to database at db-prod-01:5432
Jul 06 14:40:12 api-node-03 api[18402]: FATAL: could not connect to database:
                                        password authentication failed for user "api_svc"
Jul 06 14:40:12 api-node-03 api[18402]: Exiting with code 1

# A app crasha no arranque: password errada da base de dados.
# Como crasha antes de chegar ao listen(), a porta 8080 nunca abre.`,
    },
    {
      id: 'curl',
      tokens: [['curl']],
      flags: [{ names: ['-I'] }, { names: ['-v'] }, { names: ['-s'] }],
      teachingNote: '"connection refused" = a máquina respondeu activamente que nada escuta ali. Diferente de "timeout" (que seria firewall ou host inacessível).',
      output: (ctx) => {
        const target = ctx.positionalArgs[0] ?? '';
        if (target.includes('8080')) {
          return `curl: (7) Failed to connect to localhost port 8080: Connection refused`;
        }
        return `# tenta curl a localhost:8080`;
      },
    },
    {
      id: 'ps-api',
      tokens: [['ps']],
      flags: [{ names: ['aux'] }, { names: ['-ef'] }],
      output: () => `USER   PID %CPU %MEM COMMAND
# Sem processo "api" estável — está a arrancar e a morrer em loop.`,
    },
  ],

  stuckHints: [
    'Primeiro confirma que nada escuta na porta: `ss -tlnp`. Se a porta 8080 não aparece, o "connection refused" está explicado.',
    'Se a porta não está aberta, o processo pode não estar a correr (ou a arrancar e morrer). Verifica: `systemctl status api`.',
    'Um serviço em "activating (auto-restart)" está num loop. Vê porquê nos logs: `journalctl -u api -n 30`.',
    'A causa costuma ser um erro no arranque (config errada, dependência em falta, password de DB errada) que faz a app morrer antes de abrir a porta.',
  ],

  debrief: {
    lesson: '"Connection refused" significa que nada está a escutar na porta — diferente de "timeout", que aponta para firewall ou rede. A investigação é uma cadeia: `ss -tlnp` confirma que a porta não está aberta → `systemctl status` revela que o serviço está num loop de reinícios → `journalctl -u` mostra a causa real (aqui, password de DB errada que faz a app crashar antes do listen()). A lição-chave: um processo que crasha no arranque nunca chega a abrir a porta, por isso a porta ausente é um sintoma, não a causa. Segue sempre a cadeia porta → serviço → logs até ao erro real.',
    keyCommands: [
      'ss -tlnp  (portas à escuta + processo)',
      'systemctl status <svc>  (estado do serviço)',
      'journalctl -u <svc> -n 30  (logs do serviço)',
      'curl -I localhost:8080  (refused vs timeout)',
    ],
  },
};
