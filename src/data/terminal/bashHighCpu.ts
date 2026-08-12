import type { TerminalSession } from '../../types/terminal';

export const bashHighCpuSession: TerminalSession = {
  id: 'bash-high-cpu',
  domain: 'devops',
  title: 'bash · CPU a 100%, load alto',
  hook: 'O load average disparou. As respostas da aplicação estão lentas. Precisas de saber se é um processo desbocado, I/O wait, ou tráfego legítimo — e agir sem matar o serviço errado.',
  shell: 'bash',
  prompt: 'user@web-prod-04:~$ ',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['linux', 'bash', 'cpu', 'performance', 'troubleshooting'],

  briefing: `Servidor: web-prod-04 (8 vCPU) · Alerta: "load average alto, respostas lentas".
Load tem de ser lido contra o nº de CPUs: load 8 num host de 8 CPU = 100%.
Ferramentas: uptime, nproc, top, vmstat, ps. Não mates nada antes de confirmar a causa.
Escreve 'hint' para uma dica ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-load', label: 'Ver o load average e o nº de CPUs (contexto)', hint: 'uptime  e  nproc', goalTag: 'load-context' },
    { id: 'obj-vmstat', label: 'Separar CPU de utilizador, sistema e I/O wait', hint: 'vmstat 1 5', goalTag: 'vmstat-run' },
    { id: 'obj-ps', label: 'Encontrar o processo que consome mais CPU', hint: 'ps aux --sort=-%cpu | head', goalTag: 'ps-cpu' },
  ],

  handlers: [
    {
      id: 'load-context',
      tokens: [['uptime'], ['nproc']],
      flags: [],
      goalTag: 'load-context',
      teachingNote: 'Load average só faz sentido dividido pelo nº de CPUs. Um load de 16 num host de 8 CPU = 200% (sobrecarga). O mesmo load num host de 32 CPU = 50% (folgado).',
      output: (ctx) => {
        if (ctx.raw.trim() === 'nproc') {
          return `8`;
        }
        return `15:10:21 up 42 days,  3:18,  2 users,  load average: 16.42, 14.90, 12.30

# ⚠️ Load 16.4 num host de 8 CPU (corre 'nproc') → ~205% de sobrecarga.
# Os 3 números são médias de 1, 5 e 15 min: está a subir e a manter-se alto.`;
      },
    },
    {
      id: 'vmstat-run',
      tokens: [['vmstat']],
      flags: [],
      goalTag: 'vmstat-run',
      teachingNote: 'Colunas-chave do vmstat: r (processos à espera de CPU), us (user CPU), sy (system CPU), wa (I/O wait), si/so (swap). us alto = CPU de aplicação; wa alto = disco; sy alto = kernel/syscalls.',
      output: () => `procs -----------memory---------- ---swap-- -----io---- --system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
14  0      0 2048000  91040 4288000    0    0     4    18  980 1420 94  4  2  0  0
15  0      0 2041200  91040 4288000    0    0     0     8 1005 1490 95  3  2  0  0
13  0      0 2039800  91040 4288000    0    0     0     0  990 1450 93  5  2  0  0

# r=14-15 (muitos processos à espera de CPU num host de 8)
# us=93-95% → CPU dominado por aplicação (user space), NÃO I/O (wa=0)
# Isto é CPU-bound: um processo de utilizador está a queimar CPU.`,
    },
    {
      id: 'ps-cpu',
      tokens: [['ps']],
      flags: [
        { names: ['aux'] },
        { names: ['--sort'], valueRequired: true },
        { names: ['-e'] },
        { names: ['-o'], valueRequired: true },
      ],
      goalTag: 'ps-cpu',
      teachingNote: 'ps aux --sort=-%cpu ordena por CPU descendente. O "-" inverte para maior primeiro. Confirma se é um processo esperado (tráfego real) ou um runaway.',
      output: (ctx) => {
        if (ctx.raw.toLowerCase().includes('cpu')) {
          return `USER     PID %CPU %MEM COMMAND
app    22190 780.0  3.2 python worker.py --job=report-export
app     8821  12.0  6.4 node api-gateway.js
www     3310   8.0  1.1 nginx: worker process

# ⚠️ python worker.py a 780% de CPU (quase 8 cores inteiros!).
# Um único worker desbocado — provável loop infinito ou job mal comportado.`;
        }
        return `# tenta: ps aux --sort=-%cpu | head`;
      },
    },
    {
      id: 'top',
      tokens: [['top'], ['htop']],
      flags: [{ names: ['-b'] }, { names: ['-n'], valueRequired: true }],
      teachingNote: 'Em top interactivo: "P" ordena por CPU, "1" mostra CPU por core. Um core a 100% e os outros idle = processo single-thread; todos a 100% = multi-thread ou muitos processos.',
      output: () => `top - 15:11:02 up 42 days,  load average: 16.42, 14.90, 12.30
Tasks: 210 total,  9 running
%Cpu(s): 94.0 us,  4.0 sy,  0.0 ni,  2.0 id,  0.0 wa

  PID USER    %CPU %MEM     TIME+ COMMAND
22190 app    780.0  3.2  48:12.55 python
 8821 app     12.0  6.4   3:41.20 node`,
    },
    {
      id: 'strace',
      tokens: [['strace']],
      flags: [{ names: ['-p'], valueRequired: true }, { names: ['-c'] }, { names: ['-f'] }],
      teachingNote: 'strace -p <PID> mostra as syscalls de um processo em tempo real. Útil para ver se está preso num loop (mesma syscall repetida) ou bloqueado.',
      output: (ctx) => {
        const pid = ctx.flagValues['-p'];
        if (pid === '22190') {
          return `strace: Process 22190 attached
read(8, "", 0)                = 0
read(8, "", 0)                = 0
read(8, "", 0)                = 0
read(8, "", 0)                = 0
... (a repetir sem parar)

# Loop apertado: read() a devolver 0 (EOF) mas o código não sai do ciclo.
# Bug clássico de "busy loop" — lê EOF e volta a tentar imediatamente.`;
        }
        return `strace: attach: ptrace(PTRACE_ATTACH, ...): No such process`;
      },
    },
  ],

  stuckHints: [
    'Lê o load com contexto: `uptime` dá o load, `nproc` dá o nº de CPUs. Load 16 num host de 8 CPU é sobrecarga de ~200%.',
    'Separa os tipos de CPU com `vmstat 1 5`. us alto = aplicação; wa alto = disco/I/O; sy alto = kernel. Aqui us domina.',
    'Como é CPU de aplicação, encontra o culpado: `ps aux --sort=-%cpu | head` ou `top` (tecla P).',
    'Se um processo está a 780% e não devia, investiga o que faz: `strace -p <PID>` mostra se está num loop.',
    'Correcção: se for runaway/loop, mata ou reinicia esse processo específico (nunca às cegas). Se for tráfego legítimo, escala horizontalmente.',
  ],

  debrief: {
    lesson: 'Load average alto tem de ser lido contra o nº de CPUs (nproc): 16 num host de 8 = 200% de sobrecarga. vmstat separa a natureza do problema: us (user) alto = CPU de aplicação, wa (I/O wait) alto = disco, sy (system) alto = kernel. Aqui us=94% com wa=0 aponta claramente para um processo de utilizador CPU-bound. ps/top identificam o culpado (python worker a 780%, quase 8 cores), e strace revela a causa (busy loop a ler EOF). A regra de ouro: confirma a causa antes de matar nada — matar o processo errado pode piorar tudo. Se for runaway, reinicia esse processo; se for tráfego legítimo, escala.',
    keyCommands: [
      'uptime + nproc  (load com contexto de CPUs)',
      'vmstat 1 5  (us/sy/wa — natureza do problema)',
      'ps aux --sort=-%cpu | head  (top consumidores)',
      'top  (tecla P ordena por CPU, 1 mostra por core)',
      'strace -p <PID>  (ver se está num loop)',
    ],
  },
};
