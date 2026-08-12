import type { TerminalSession } from '../../types/terminal';

export const bashOomMemorySession: TerminalSession = {
  id: 'bash-oom-memory',
  domain: 'devops',
  title: 'bash · processo morto por OOM',
  hook: 'Um serviço em produção foi morto de repente. Os utilizadores reportam erros 502. Suspeitas de falta de memória. Estás dentro do servidor — confirma o OOM e encontra o culpado.',
  shell: 'bash',
  prompt: 'user@app-prod-02:~$ ',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['linux', 'bash', 'memory', 'oom', 'troubleshooting'],

  briefing: `Servidor: app-prod-02 (Ubuntu 22.04) · Alerta: "processo terminado inesperadamente".
Suspeita: OOM Killer. Ferramentas: free, ps, journalctl, dmesg.
Lembra-te: no Linux, memória livre baixa nem sempre é problema (cache conta).
Escreve 'hint' para uma dica ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-free', label: 'Ver o estado da memória e swap', hint: 'free -h', goalTag: 'free-h' },
    { id: 'obj-ps', label: 'Encontrar os processos que mais memória consomem', hint: 'ps aux --sort=-%mem | head', goalTag: 'ps-mem' },
    { id: 'obj-oom', label: 'Confirmar o OOM nos logs do kernel', hint: 'journalctl -k | grep -i oom  OU  dmesg -T | grep -i oom', goalTag: 'oom-log' },
  ],

  handlers: [
    {
      id: 'free-h',
      tokens: [['free']],
      flags: [{ names: ['-h', '--human'] }, { names: ['-m'] }, { names: ['-g'] }],
      goalTag: 'free-h',
      teachingNote: 'Foca-te na coluna "available", não em "free". O Linux usa RAM livre para cache — available mostra o que está realmente disponível para apps.',
      output: (ctx) => {
        const human = '-h' in ctx.flagValues || '--human' in ctx.flagValues;
        if (human) {
          return `               total        used        free      shared  buff/cache   available
Mem:            15Gi        14Gi       210Mi        12Mi       1.1Gi       380Mi
Swap:          2.0Gi       2.0Gi          0B

# ⚠️ available só 380Mi, swap 100% cheio — sinal claro de pressão de memória`;
        }
        return `               total        used        free      shared  buff/cache   available
Mem:        16384000    14680064      215040       12288     1489896      389120
Swap:        2097152     2097152           0

# usa -h para ler mais fácil`;
      },
    },
    {
      id: 'ps-mem',
      tokens: [['ps']],
      flags: [
        { names: ['aux'] },
        { names: ['--sort'], valueRequired: true },
        { names: ['-e'] },
        { names: ['-o'], valueRequired: true },
      ],
      goalTag: 'ps-mem',
      teachingNote: 'ps aux --sort=-%mem ordena por memória descendente. O sinal "-" antes de %mem inverte a ordem (maior primeiro).',
      output: (ctx) => {
        const raw = ctx.raw.toLowerCase();
        if (raw.includes('mem')) {
          return `USER       PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
app      12048 45.2 78.3 9840112 6420880 ?   Sl   09:14  22:10 java -Xmx6g -jar recommender.jar
app       8821  2.1  6.4  982400  524288 ?   Sl   08:02   3:41 node api-gateway.js
postgres  3310  1.8  4.2  721920  344064 ?   Ss  Jul05  12:20 postgres: main writer
redis     2201  0.9  1.1  210944   90112 ?   Ssl Jul05   5:02 redis-server *:6379

# O java (recommender) usa 78% da RAM — heap -Xmx6g num host de 16GB sob pressão`;
        }
        return `# tenta: ps aux --sort=-%mem | head`;
      },
    },
    {
      id: 'oom-log',
      tokens: [['journalctl'], ['dmesg']],
      flags: [
        { names: ['-k', '--dmesg'] },
        { names: ['-T'] },
        { names: ['--no-pager'] },
        { names: ['-p'], valueRequired: true },
      ],
      goalTag: 'oom-log',
      teachingNote: 'O OOM Killer regista sempre no kernel log. Procura "Out of memory" ou "Killed process" para ver qual PID foi sacrificado e porquê.',
      output: () => {
        return `[Jul06 14:32:07] Out of memory: Killed process 12048 (java) total-vm:9840112kB,
                 anon-rss:6420880kB, file-rss:0kB, shmem-rss:0kB, UID:1001
[Jul06 14:32:07] oom_reaper: reaped process 12048 (java), now anon-rss:0kB

# Confirmado: o kernel matou o java (PID 12048) por falta de memória.
# O processo consumiu ~6.4GB de RSS num host já sob swap pressure.`;
      },
    },
    {
      id: 'meminfo',
      tokens: [['cat']],
      flags: [],
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        if (path === '/proc/meminfo') {
          return `MemTotal:       16384000 kB
MemFree:          215040 kB
MemAvailable:     389120 kB
Buffers:           45056 kB
Cached:          1444840 kB
SwapTotal:       2097152 kB
SwapFree:              0 kB`;
        }
        return `cat: ${path}: No such file or directory`;
      },
    },
    {
      id: 'top',
      tokens: [['top'], ['htop']],
      flags: [],
      teachingNote: 'top é interactivo: dentro dele, "M" ordena por memória, "P" por CPU. Aqui mostramos um snapshot.',
      output: () => `top - 14:35:02 up 42 days,  load average: 3.20, 2.85, 2.40
MiB Mem :  16000.0 total,    210.0 free,  14336.0 used,   1454.0 buff/cache
MiB Swap:   2048.0 total,      0.0 free,   2048.0 used.    380.0 avail Mem

  PID USER      %CPU  %MEM     TIME+ COMMAND
12048 app       45.2  78.3   22:10  java
 8821 app        2.1   6.4    3:41  node`,
    },
  ],

  stuckHints: [
    'Começa por confirmar a pressão de memória: `free -h`. Olha para "available" e para o swap.',
    'Se o swap está a 100% e available está muito baixo, há pressão real. Encontra o culpado com `ps aux --sort=-%mem | head`.',
    'Para confirmar que foi o OOM Killer (e não outra coisa), procura nos logs do kernel: `journalctl -k | grep -i oom` ou `dmesg -T | grep -i "killed process"`.',
    'A correcção depende da causa: heap da JVM mal dimensionado (-Xmx alto demais), memory leak, ou simplesmente host pequeno para o workload.',
  ],

  debrief: {
    lesson: 'Um processo morto de repente + swap a 100% + available baixo = OOM Killer. O kernel sacrifica o processo com maior "oom_score" (geralmente o que mais memória consome) para salvar o sistema. Aqui o java tinha -Xmx6g num host de 16GB já sob pressão. A correcção passa por dimensionar o heap da JVM correctamente, investigar memory leaks, ou dar mais RAM ao host. Nunca confies só em "free" — a coluna "available" é a que importa, porque o Linux usa RAM livre para cache que pode ser libertada.',
    keyCommands: [
      'free -h  (foca em "available" e swap, não em "free")',
      'ps aux --sort=-%mem | head  (top consumidores de memória)',
      'journalctl -k | grep -i oom  (confirmar o OOM Killer)',
      'dmesg -T | grep -i "killed process"  (qual PID foi morto)',
      'cat /proc/meminfo  (detalhe da memória)',
    ],
  },
};
