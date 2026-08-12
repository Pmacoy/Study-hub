import type { TerminalSession } from '../../types/terminal';

export const bashDiskIoSession: TerminalSession = {
  id: 'bash-disk-io',
  domain: 'devops',
  title: 'bash · disco lento, I/O wait alto',
  hook: 'A base de dados está lenta. Não há disco cheio, há espaço de sobra. Mas as queries demoram e as threads bloqueiam em I/O. O problema é throughput, não capacidade. Encontra o que está a saturar o disco.',
  shell: 'bash',
  prompt: 'user@db-prod-01:~$ ',
  difficulty: 'senior',
  timeEstimateMin: 8,
  tags: ['linux', 'bash', 'disk-io', 'performance', 'troubleshooting'],

  briefing: `Servidor: db-prod-01 (Ubuntu 22.04) · Alerta: "high I/O wait, DB latency".
IMPORTANTE: disk usage (capacidade) é diferente de disk I/O (throughput/latência).
Há espaço livre — o problema é o disco estar saturado. Ferramentas: iostat, pidstat, iotop.
Escreve 'hint' para uma dica ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-iostat', label: 'Ver a latência e utilização do disco', hint: 'iostat -x 1 3', goalTag: 'iostat-x' },
    { id: 'obj-pidstat', label: 'Encontrar o processo que mais I/O gera', hint: 'pidstat -d 1 5', goalTag: 'pidstat-d' },
    { id: 'obj-dirty', label: 'Ver páginas sujas / writeback pendente', hint: 'cat /proc/meminfo | grep -i dirty', goalTag: 'dirty-pages' },
  ],

  handlers: [
    {
      id: 'iostat-x',
      tokens: [['iostat']],
      flags: [{ names: ['-x'] }, { names: ['-d'] }, { names: ['-m'] }],
      goalTag: 'iostat-x',
      teachingNote: 'As colunas-chave do iostat -x: %util (quão ocupado está o disco) e await (latência média em ms). %util perto de 100% + await alto = disco saturado.',
      output: () => `Linux 5.15.0  (db-prod-01)   07/06/2026   _x86_64_   (8 CPU)

Device   r/s     w/s     rMB/s   wMB/s  await  aqu-sz  %util
nvme0n1  120.0   3400.0  4.8     680.0  240.5   45.2    99.8

# ⚠️ %util 99.8% → disco praticamente saturado
# ⚠️ await 240ms → latência enorme (bom seria <10ms)
# ⚠️ w/s 3400 → muitíssimas escritas por segundo`,
    },
    {
      id: 'pidstat-d',
      tokens: [['pidstat']],
      flags: [{ names: ['-d'] }, { names: ['-p'], valueRequired: true }],
      goalTag: 'pidstat-d',
      teachingNote: 'pidstat -d mostra I/O por processo: kB_rd/s (leitura) e kB_wr/s (escrita). É a forma de atribuir a saturação a um processo concreto.',
      output: () => `Linux 5.15.0 (db-prod-01)   07/06/2026   _x86_64_   (8 CPU)

     UID       PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
    1001      4820      12.0  620480.0       0.0  postgres: checkpointer
    1001      4821    4800.0    1024.0       0.0  postgres: writer
       0      9910       0.0  180224.0       0.0  fluent-bit

# O checkpointer do postgres domina: ~620 MB/s de escrita.
# Um checkpoint agressivo está a saturar o disco.`,
    },
    {
      id: 'dirty-pages',
      tokens: [['cat']],
      flags: [],
      goalTag: 'dirty-pages',
      teachingNote: 'Dirty pages são dados em memória à espera de serem escritos no disco. Writeback alto e persistente indica que o disco não consegue acompanhar o ritmo de escrita.',
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        const raw = ctx.raw.toLowerCase();
        if (path === '/proc/meminfo' || raw.includes('meminfo')) {
          return `Dirty:            892160 kB
Writeback:        124928 kB

# ~870MB de páginas sujas à espera de flush, 122MB em writeback activo.
# O disco está a ser martelado e não consegue drenar.`;
        }
        return `cat: ${path}: No such file or directory`;
      },
    },
    {
      id: 'iotop',
      tokens: [['iotop']],
      flags: [{ names: ['-o'] }, { names: ['-P'] }, { names: ['-a'] }],
      teachingNote: 'iotop é como o top mas para I/O. -o mostra só processos que estão realmente a fazer I/O agora.',
      output: () => `Total DISK READ:   4.90 M/s | Total DISK WRITE: 680.00 M/s
  PID  USER   DISK READ  DISK WRITE  COMMAND
 4820  postgres  12.0 K/s  620.0 M/s  postgres: checkpointer
 9910  root       0.0 B/s  180.0 M/s  fluent-bit`,
    },
    {
      id: 'df-h',
      tokens: [['df']],
      flags: [{ names: ['-h'] }],
      teachingNote: 'Repara: o df mostra espaço de sobra. Isto confirma que o problema NÃO é capacidade — é I/O (throughput/latência). São coisas diferentes.',
      output: () => `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  500G  180G  320G  36% /

# 36% usado — há espaço de sobra. O problema é I/O, não capacidade.`,
    },
    {
      id: 'lsblk',
      tokens: [['lsblk']],
      flags: [{ names: ['-o'], valueRequired: true }],
      output: () => `NAME        SIZE TYPE MOUNTPOINT FSTYPE
nvme0n1     500G disk
└─nvme0n1p1 500G part /          ext4`,
    },
  ],

  stuckHints: [
    'Primeiro distingue capacidade de throughput. `df -h` mostra que há espaço — logo o problema é I/O, não disco cheio.',
    'Mede a saturação do disco com `iostat -x 1 3`. Olha para %util (perto de 100% = saturado) e await (latência em ms).',
    'Atribui o I/O a um processo com `pidstat -d 1 5` ou `iotop -o`. Vais ver quem está a escrever mais.',
    'Confirma a pressão de escrita com `cat /proc/meminfo | grep -i dirty`. Dirty/Writeback altos = disco não acompanha.',
    'A correcção: throttle/reagendar o processo culpado (backups, checkpoints, log shippers), mover escritas pesadas para disco mais rápido, ou afinar a config (ex: checkpoint do postgres menos agressivo).',
  ],

  debrief: {
    lesson: 'Disco lento com espaço livre = problema de I/O (throughput/latência), não de capacidade. iostat -x revela %util e await: %util perto de 100% e await de 240ms confirmam saturação. pidstat -d / iotop atribuem o I/O ao processo — aqui o checkpointer do postgres a escrever 620 MB/s. Dirty pages altas confirmam que o disco não drena ao ritmo das escritas. A correcção passa por afinar o processo (checkpoints menos agressivos), reagendar jobs pesados (backups, compactação), ou usar armazenamento mais rápido. Em cloud, verifica também os limites de IOPS do volume (EBS/managed disk podem estar a throttle).',
    keyCommands: [
      'iostat -x 1 3  (%util e await — saturação e latência)',
      'pidstat -d 1 5  (I/O por processo)',
      'iotop -o  (vista interactiva de I/O activo)',
      'cat /proc/meminfo | grep -i dirty  (páginas por escrever)',
      'df -h  (confirmar que NÃO é capacidade)',
    ],
  },
};
