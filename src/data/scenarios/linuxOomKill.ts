import type { Scenario } from '../../types/scenario';

export const linuxOomKillScenario: Scenario = {
  id: 'linux-oom-kill',
  domain: 'devops',
  format: 'guided',
  title: 'Processo morto pelo OOM Killer',
  hook: 'O serviço payment-worker morre a cada 15 minutos. Os logs mostram "Out of memory: Killed process". Precisas de diagnosticar e corrigir.',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['linux', 'memory', 'oom', 'systemd'],

  contextArtifacts: [
    {
      id: 'context-service',
      label: 'Contexto do serviço',
      language: 'text',
      content: `Serviço:    payment-worker@prod-03
Tipo:       Worker assíncrono (Node.js, processa filas SQS)
Systemd:    payment-worker.service
Último crash: há 12 minutos
Alerta:     HighRestartRate (systemd-monitor)
Memória total do host: 16 GiB`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'dmesg-oom',
      label: '$ sudo dmesg | grep -i "out of memory"',
      language: 'log',
      content: `[14523.482910] payment-worker invoked oom-killer: gfp_mask=0x6200ca(GFP_HIGHUSER_MOVABLE), order=0, oom_score_adj=0
[14523.482945] CPU: 2 PID: 8842 Comm: payment-worker Not tainted 5.15.0-91-generic #101-Ubuntu
[14523.482946] Hardware name: Dell Inc. PowerEdge R640/0H28H8, BIOS 2.18.2 04/12/2023
[14523.483001] Call Trace:
[14523.483003]  dump_stack_lvl+0x48/0x70
[14523.483004]  dump_header+0x53/0x206
[14523.483005]  oom_kill_process+0x100/0x150
[14523.483006]  out_of_memory+0x10a/0x590
[14523.483007] Mem-Info:
[14523.483010] active_anon:3891024 inactive_anon:102452 isolated_anon:0
[14523.483011]  active_file:12400 inactive_file:8200 isolated_file:0
[14523.483012]  unevictable:0 dirty:0 writeback:0
[14523.483013]  slab_reclaimable:18200 slab_unreclaimable:24100
[14523.483014]  mapped:4200 shmem:8100 pagetables:9200
[14523.483015]  free:1840 free_pcp:120 free_cma:0
[14523.483020] Node 0 active_anon:15564096kB inactive_anon:409808kB active_file:49600kB
[14523.483021] Node 0 free:7360kB
[14523.483100] oom-kill:constraint=CONSTRAINT_NONE,nodemask=(null),cpuset=/,mems_allowed=0,global_oom,task_memcg=/system.slice/payment-worker.service,task=payment-worker,pid=8842,uid=1001
[14523.483150] Out of memory: Killed process 8842 (payment-worker) total-vm:4521088kB, anon-rss:3245012kB, file-rss:1024kB, shmem-rss:0kB, UID:1001 pgtables:63512kB oom_score_adj:0`,
    },
    {
      id: 'systemctl-status',
      label: '$ systemctl status payment-worker.service',
      language: 'bash',
      content: `● payment-worker.service - Payment Worker Service
     Loaded: loaded (/etc/systemd/system/payment-worker.service; enabled; vendor preset: enabled)
     Active: failed (Result: signal) since Mon 2026-09-01 09:14:32 UTC; 12min ago
    Process: 8800 ExecStart=/usr/bin/node /app/payment-worker/dist/index.js (code=killed, signal=KILL)
   Main PID: 8800 (code=killed, signal=KILL)

Sep 01 09:00:01 prod-03 systemd[1]: Started Payment Worker Service.
Sep 01 09:00:02 prod-03 node[8800]: [INFO] Payment worker started, PID 8800
Sep 01 09:00:02 prod-03 node[8800]: [INFO] Connected to Redis at 10.0.1.50:6379
Sep 01 09:00:02 prod-03 node[8800]: [INFO] Subscribed to queue: payments.high-priority
Sep 01 09:14:28 prod-03 node[8800]: [WARN] Memory usage: 310MB (threshold: 300MB)
Sep 01 09:14:30 prod-03 node[8800]: [ERROR] heap out of memory
Sep 01 09:14:32 prod-03 systemd[1]: payment-worker.service: Main process exited, code=killed, status=9/KILL
Sep 01 09:14:32 prod-03 systemd[1]: payment-worker.service: Failed with result 'signal'.`,
    },
    {
      id: 'systemd-unit',
      label: '$ cat /etc/systemd/system/payment-worker.service',
      language: 'ini',
      content: `[Unit]
Description=Payment Worker Service
After=network.target redis.service

[Service]
Type=simple
User=payment
WorkingDirectory=/app/payment-worker
ExecStart=/usr/bin/node /app/payment-worker/dist/index.js
Restart=always
RestartSec=5s
StandardOutput=journal
StandardError=journal

# Current memory limit — too tight!
MemoryLimit=320M
MemoryMax=350M

# No CPU limit set
Nice=10
IOSchedulingClass=idle

[Install]
WantedBy=multi-user.target`,
    },
    {
      id: 'free-memory',
      label: '$ free -h && echo "---" && cat /proc/meminfo | head -20',
      language: 'bash',
      content: `              total        used        free      shared  buff/cache   available
Mem:           15Gi       8.2Gi       1.1Gi       340Mi       6.1Gi       6.4Gi
Swap:         2.0Gi       1.2Gi       892Mi

MemTotal:       16384000 kB
MemFree:        1146880 kB
MemAvailable:   6705408 kB
Buffers:          184320 kB
Cached:         4892160 kB
SwapCached:       245760 kB
Active:        13561856 kB
Inactive:       1024512 kB
Dirty:               128 kB
Writeback:             0 kB
AnonPages:     12230144 kB
Mapped:          184320 kB
Shmem:            32768 kB
KReclaimable:    122880 kB
Slab:            344064 kB
SReclaimable:    122880 kB
SUnreclaim:      221184 kB`,
    },
    {
      id: 'cgroup-memory',
      label: '$ cat /sys/fs/cgroup/system.slice/payment-worker.service/memory.max',
      language: 'bash',
      content: `367001600
$ cat /sys/fs/cgroup/system.slice/payment-worker.service/memory.current
338421248
$ cat /sys/fs/cgroup/system.slice/payment-worker.service/memory.stat | head -10
anon 3245012992
file 1048576
inactive_anon 41943040
active_anon 3203069952
file_mapped 2097152
pgfault 1843200
pgmajfault 12
pginuse 2048
pgactivate 184320
swap 0`,
    },
    {
      id: 'node-memory',
      label: '$ node --inspect-brk (attached via PID) — heap snapshot summary',
      language: 'text',
      content: `Heap Statistics:
  Total heap size:              384 MB
  Used heap size:               312 MB
  Heap utilisation:             81.3%
  RSS:                          324 MB
  External memory:              18 MB

Top allocations:
  1. Array of payment event objects    142 MB
  2. Redis subscriber buffers           68 MB
  3. Request queue (in-flight)          54 MB
  4. TLS/session state                  22 MB
  5. V8 internal structures             26 MB

Note: Under high load, queue depth grows unbounded — no backpressure applied.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Recebeste o alerta de que o payment-worker morre repetidamente. Qual é o primeiro passo de diagnóstico?',
      options: [
        {
          id: 'a',
          label: 'Verificar os logs do sistema (dmesg/journalctl) para ver a causa da morte',
          correct: true,
          feedback: 'Correto — dmesg mostra explicitamente "Out of memory: Killed process", confirmando que o OOM Killer do kernel interveneu.',
          revealArtifacts: ['dmesg-oom'],
        },
        {
          id: 'b',
          label: 'Reiniciar o serviço imediatamente com systemctl restart',
          correct: false,
          feedback: 'Reiniciar sem diagnóstico é atirar no escuro. O serviço vai voltar a morrer quando o problema de memória persistir.',
        },
        {
          id: 'c',
          label: 'Aumentar a memória do servidor para 32 GiB',
          correct: false,
          feedback: 'Adicionar hardware não resolve um problema de configuração. O limite de cgroup de 350 Mi continua apertado mesmo com mais RAM disponível.',
        },
      ],
    },
    {
      id: 'step-2',
      prompt: 'O dmesg confirma OOM Killer. Vês "task=payment-worker,pid=8842,total-vm:4521088kB, anon-rss:3245012kB". O que é que isto te diz sobre o processo?',
      options: [
        {
          id: 'a',
          label: 'O processo tinha 4.5 GB de memória virtual mas 3.2 GB de RSS real — excedeu o limite do cgroup',
          correct: true,
          feedback: 'Exato. total-vm é o endereçamento virtual (muito alto por causa de mallocs não commitados). anon-rss é a memória física real usada (~3.1 GB). O limite do cgroup era 350 Mi (367001600 bytes), muito abaixo do uso real.',
        },
        {
          id: 'b',
          label: 'O processo fugiu ao límite de 350MB porque o Node.js ignora cgroups',
          correct: false,
          feedback: 'O Node.js não ignora cgroups — ele respeita os limites do kernel. O problema é que o limite estava demasiado baixo para o uso legítimo da aplicação.',
        },
        {
          id: 'c',
          label: 'OOOM Killer escolheu o processo aleatoriamente porque o sistema estava cheio',
          correct: false,
          feedback: 'O OOM Killer usa heurísticas (oom_score) baseadas no uso de memória e tempo de vida. payment-worker tinha o score mais alto porque usava 3.2 GB de RSS — não foi aleatório.',
        },
      ],
      teachingNote: 'Diferença crucial: total-vm (virtual, engano) vs anon-rss (física real). O OOM Killer olha para RSS, não para virtual.',
    },
    {
      id: 'step-3',
      prompt: 'Vês no unit file que MemoryMax=350M. O systemctl status mostra que o processo usava 324 MB antes de morrer. Qual é o problema?',
      options: [
        {
          id: 'a',
          label: 'O limite de 350 MB é demasiado baixo para o uso real do worker (~324 MB RSS + overhead do Node.js e V8)',
          correct: true,
          feedback: 'Correto. O Node.js precisa de overhead para o garbage collector, JIT compilation e buffers internos. Com apenas 26 MB de folga sobre 324 MB de RSS, qualquer pico causa OOM.',
          revealArtifacts: ['systemd-unit', 'node-memory'],
        },
        {
          id: 'b',
          label: 'O limite está correcto mas há um memory leak no código',
          correct: false,
          feedback: 'O heap snapshot mostra 312 MB usados de forma legítima (arrays de eventos, buffers Redis). Não é um leak — é um limite demasiado apertado para a carga de trabalho.',
        },
        {
          id: 'c',
          label: 'O systemd está a calcular mal o uso de memória do cgroup',
          correct: false,
          feedback: 'O cgroup reporta correctamente 338 MB em memory.current. O problema é o valor do limite, não o mecanismo de medição.',
        },
      ],
    },
    {
      id: 'step-4',
      prompt: 'O heap snapshot mostra "Array of payment event objects: 142 MB" como maior alocação. Qual é a melhor abordagem a longo prazo?',
      options: [
        {
          id: 'a',
          label: 'Aumentar o MemoryMax para ~1 GiB E implementar backpressure na fila de eventos',
          correct: true,
          feedback: 'Esta é a resposta correcta em duas frentes: mitigação imediata (aumentar limite) e correção da raíz (backpressure evita crescimento descontrolado da queue).',
          revealArtifacts: ['free-memory', 'cgroup-memory'],
        },
        {
          id: 'b',
          label: 'Aumentar apenas o MemoryMax para 8 GiB para ter margem',
          correct: false,
          feedback: 'Aumentar o limite cegamente é uma solução frágil. Sem backpressure, a fila continua a crescer e um dia volta a estourar — possivelmente com impacto maior.',
        },
        {
          id: 'c',
          label: 'Desactivar o OOM Killer com oom_kill_disable=1 no kernel',
          correct: false,
          feedback: 'Desactivar o OOM Killer é perigoso: num cenário real de pressão de memória, o kernel não conseguiria proteger o sistema e poderia travar completamente.',
        },
      ],
      teachingNote: 'Bom troubleshooting de memória em Linux: sempre combinar ajuste de limite COM correção de código. Limite alto sem backpressure = adiar o problema.',
    },
    {
      id: 'step-5',
      prompt: 'Estás a escrever o post-mortem. Quais são as acções de prevenção que deviam constar?',
      options: [
        {
          id: 'a',
          label: 'MemoryMax=1G, backpressure na fila, alerta de memória a 75% do limite, e testar com carga simulada em CI',
          correct: true,
          feedback: 'Combinar limite adequado, proteção de código (backpressure), monitorização proactiva (alerta a 75%) e prevenção via testes de carga. É uma abordagem em camadas.',
        },
        {
          id: 'b',
          label: 'Remover todos os limites de memória para evitar OOM',
          correct: false,
          feedback: 'Sem limites de memória, um processo com memory leak ou pico de carga pode afectar todos os outros serviços no mesmo host. Limits são essenciais para multi-tenancy.',
        },
        {
          id: 'c',
          label: 'Configurar swap maior e o kernel vai lidar com o resto',
          correct: false,
          feedback: 'Swap é uma última medida — swapping intenso degrada drasticamente a performance. Além disso, o payment-worker é sensível a latência; swap causaria timeouts em vez de stabilizar.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'O serviço payment-worker tinha MemoryMax=350M no unit file do systemd, mas sob carga normal processava ~324 MB de RSS (arrays de eventos, buffers Redis, filas em curso). Com apenas ~26 MB de folga, qualquer pico de memória excedia o limite e o OOM Killer do kernel terminava o processo. A cada reinício automático (Restart=always), o ciclo repetia-se a cada ~15 minutos.',
    fix: 'Aumentar MemoryMax para 1G e MemoryLimit para 900M no unit file do systemd, e implementar backpressure na fila de eventos para limitar o crescimento da memória quando a taxa de processamento é inferior à taxa de produção.',
    preventions: [
      'Definir MemoryMax com pelo menos 3x o uso médio observado (headroom para picos e overhead do V8)',
      'Implementar backpressure: limitar o tamanho da fila de eventos em memória e desacelerar o consumidor quando a queue atinge um threshold',
      'Adicionar métrica de memória do processo exposta via Prometheus node_exporter com alerta a 75% do limite',
      'Incluir teste de carga no pipeline CI que simule pico de 2x a carga normal',
      'Documentar no runbook: como interpretar dmesg OOM entries e ajustar limites de cgroup',
    ],
  },
};
