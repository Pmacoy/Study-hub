import type { TerminalSession } from '../../types/terminal';

export const bashDiskFullSession: TerminalSession = {
  id: 'bash-disk-full',
  domain: 'networking',
  title: 'bash · servidor com disco a 98%',
  hook: 'O runner de CI parou. Todos os jobs falham com "no space left on device". Estás dentro do servidor. Descobre o que ocupa e limpa.',
  shell: 'bash',
  prompt: 'user@ci-runner-01:~$ ',
  difficulty: 'junior',
  timeEstimateMin: 6,
  tags: ['linux', 'bash', 'troubleshooting'],

  briefing: `Servidor: ci-runner-01 (Ubuntu 22.04) · Alerta: "disk usage > 95%".
Precisas de: df, du, find, ls, journalctl. Todas as flags básicas.
Escreve 'hint' para uma dica ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-df', label: 'Ver que filesystem está cheio', hint: 'df -h', goalTag: 'df-h' },
    { id: 'obj-du', label: 'Descobrir que directório ocupa mais em / ou /var', hint: 'du -sh /var/* ou du -h --max-depth=1', goalTag: 'du-var' },
    { id: 'obj-find', label: 'Identificar ficheiros grandes específicos', hint: 'find /var/log -size +100M', goalTag: 'find-large' },
    { id: 'obj-clean', label: 'Ver o que journalctl está a manter em disco', hint: 'journalctl --disk-usage', goalTag: 'journal-usage' },
  ],

  handlers: [
    {
      id: 'df-h',
      tokens: [['df']],
      flags: [{ names: ['-h', '--human-readable'] }],
      goalTag: 'df-h',
      teachingNote: 'df sem -h dá blocos de 1K — quase ilegível. Sempre com -h em investigação manual.',
      output: (ctx) => {
        const human = '-h' in ctx.flagValues || '--human-readable' in ctx.flagValues;
        if (human) {
          return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   49G  1.0G  98% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/sda2       100G   45G   55G  46% /home
tmpfs           793M  1.1M  792M   1% /run`;
        }
        return `Filesystem     1K-blocks     Used  Available Use% Mounted on
/dev/sda1       52428800 51380224    1048576  98% /
tmpfs            4104192        0    4104192   0% /dev/shm
/dev/sda2      104857600 47185920   57671680  46% /home`;
      },
    },
    {
      id: 'du-var',
      tokens: [['du']],
      flags: [
        { names: ['-s', '--summarize'] },
        { names: ['-h', '--human-readable'] },
        { names: ['--max-depth'], valueRequired: true },
        { names: ['-d'], valueRequired: true },
      ],
      goalTag: 'du-var',
      teachingNote: 'du percorre o disco de forma recursiva — pode demorar. --max-depth=1 pára ao primeiro nível.',
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        const human = '-h' in ctx.flagValues;
        // du -sh /var/*
        if (path.startsWith('/var/*') || (path === '/var/*')) {
          return human ? `4.0K    /var/backups
127M    /var/cache
1.2G    /var/lib
32G     /var/log
14G     /var/tmp
2.4G    /var/spool` : `# usa -h para ler mais fácil`;
        }
        if (path === '/var/log' || path === '/var/log/') {
          return `32G     /var/log`;
        }
        if (!path || path === '/') {
          return `49G    /`;
        }
        return `# tenta: du -sh /var/* ou du -h --max-depth=1 /var`;
      },
    },
    {
      id: 'find-large',
      tokens: [['find']],
      flags: [
        { names: ['-size'], valueRequired: true },
        { names: ['-type'], valueRequired: true },
        { names: ['-name'], valueRequired: true },
        { names: ['-mtime'], valueRequired: true },
      ],
      goalTag: 'find-large',
      teachingNote: 'find + -size +100M é o segredo para caçar ficheiros grandes rapidamente sem varrer o disco todo com du.',
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        const size = ctx.flagValues['-size'];
        if (path.startsWith('/var/log') && typeof size === 'string' && size.includes('+')) {
          return `/var/log/nginx/access.log
/var/log/nginx/access.log.1
/var/log/nginx/access.log.2.gz
/var/log/apt/history.log
/var/log/journal/e6b7e/system@0000629d4d5f-000000000012a2be.journal
/var/log/journal/e6b7e/system@0000629d4d5f-000000000012c001.journal

# 6 ficheiros com mais de 100M — a maioria em journald.`;
        }
        return `# nada encontrado (ou path inválido). Exemplo: find /var/log -size +100M`;
      },
    },
    {
      id: 'journal-usage',
      tokens: [['journalctl']],
      flags: [
        { names: ['--disk-usage'] },
        { names: ['--vacuum-size'], valueRequired: true },
        { names: ['--vacuum-time'], valueRequired: true },
      ],
      goalTag: 'journal-usage',
      teachingNote: 'Regra em runners de CI: --vacuum-time=3d como cron job. Não deixes journald crescer sem limite.',
      output: (ctx) => {
        if ('--disk-usage' in ctx.flagValues) {
          return `Archived and active journals take up 28.4G in the file system.`;
        }
        if ('--vacuum-time' in ctx.flagValues) {
          const val = ctx.flagValues['--vacuum-time'];
          return `Vacuuming done, freed 24.1G of archived journals.
Kept ${val} of logs.`;
        }
        if ('--vacuum-size' in ctx.flagValues) {
          const val = ctx.flagValues['--vacuum-size'];
          return `Vacuuming done, freed 22.8G of archived journals.
Kept ${val} of logs.`;
        }
        return `# use --disk-usage, --vacuum-time=3d, ou --vacuum-size=500M`;
      },
    },
    {
      id: 'ls-al',
      tokens: [['ls']],
      flags: [
        { names: ['-l'] }, { names: ['-a'] }, { names: ['-h'] }, { names: ['-la'] }, { names: ['-lah'] },
      ],
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '.';
        if (path === '/var/log' || path === '/var/log/') {
          return `drwxrwxr-x  8 root root  4.0K Jul  5 10:14 .
drwxr-xr-x 14 root root  4.0K Jul  1 09:00 ..
drwxr-xr-x  2 root root  4.0K Jul  5 10:14 apt
-rw-r-----  1 syslog adm    1.2K Jul  5 10:14 auth.log
drwxr-xr-x  3 root root  4.0K Jul  5 09:00 journal
drwxr-x---  2 root adm   4.0K Jul  5 10:14 nginx
-rw-r--r--  1 root root   234M Jul  5 10:00 syslog`;
        }
        return `# path: ${path}\n# usa "ls -lah /var/log" por exemplo`;
      },
    },
    {
      id: 'cat',
      tokens: [['cat']],
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        if (path === '/etc/systemd/journald.conf') {
          return `[Journal]
#Storage=auto
#SystemMaxUse=
#SystemKeepFree=
#SystemMaxFiles=
#MaxRetentionSec=

# Todas comentadas → journald usa defaults (10% do disco).
# Descomenta SystemMaxUse=500M para forçar limite.`;
        }
        if (!path) return `cat: missing operand`;
        return `cat: ${path}: No such file or directory`;
      },
    },
    {
      id: 'free',
      tokens: [['free']],
      flags: [{ names: ['-h'] }, { names: ['-m'] }],
      output: `              total        used        free      shared  buff/cache   available
Mem:          7.7Gi       2.1Gi       3.9Gi       0.0Ki       1.7Gi       5.4Gi
Swap:         2.0Gi          0B       2.0Gi`,
    },
    {
      id: 'uptime',
      tokens: [['uptime']],
      output: `10:14:32 up 47 days,  3:22,  2 users,  load average: 0.42, 0.51, 0.55`,
    },
    {
      id: 'whoami',
      tokens: [['whoami']],
      output: `user`,
    },
    {
      id: 'rm-rf',
      tokens: [['rm']],
      flags: [{ names: ['-r'] }, { names: ['-f'] }, { names: ['-rf'] }],
      output: (ctx) => {
        const target = ctx.positionalArgs[0] ?? '';
        if (target === '/' || target === '/*') {
          return `# ✋ Não vais fazer rm -rf / hoje. Tenta journalctl --vacuum-time=3d — corta o problema pela raíz, sem apagar dados de auditoria à toa.`;
        }
        if (target.includes('/var/log')) {
          return `# Cuidado: apagar /var/log/* manualmente pode confundir o systemd-journald (ainda tem os FDs abertos).
# Prefere: journalctl --vacuum-time=3d ou truncate -s 0 /var/log/big.log`;
        }
        return `# removed`;
      },
    },
  ],

  stuckHints: [
    'Começa por ver qual filesystem está cheio: df -h',
    'É /dev/sda1 (a raíz). Vai a "/var" e vê que subdirectório domina: du -sh /var/*',
    '/var/log tem 32G. Verifica se são os journals do systemd: journalctl --disk-usage',
    'Confirmado 28G em journals. A limpeza é: sudo journalctl --vacuum-time=3d',
  ],

  debrief: {
    lesson: 'Padrão de disco cheio: df → du → find/journalctl. Nunca começar pelo `rm -rf` — o journald mantém file descriptors abertos e apagar ficheiros do /var/log não devolve espaço até reiniciar. Usa sempre `journalctl --vacuum-*` ou `truncate -s 0` para logs geridos pelo sistema.',
    keyCommands: [
      'df -h                             # filesystems',
      'du -sh /var/*                     # top-level em /var',
      'du -h --max-depth=1 /path         # 1 nível abaixo',
      'find /var/log -size +100M         # ficheiros grandes',
      'journalctl --disk-usage           # espaço do journald',
      'journalctl --vacuum-time=3d       # limpar (mantém 3 dias)',
    ],
  },
};
