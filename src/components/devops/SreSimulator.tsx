import { useState } from 'react';
import {
  Copy,
  Check,
  Shield,
  AlertTriangle,
  Gauge,
  TrendingDown,
  Clock,
  Activity,
  Terminal,
  Play,
  RotateCcw,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  FileText,
  Radio,
  Server,
  Download
} from 'lucide-react';

type Section = 'slo' | 'burnrate' | 'troubleshooter' | 'chaos' | 'blameless';

function Code({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-400 text-2xs">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors"
        >
          {copied ? <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400 text-2xs">Copiado</span></> : <><Copy size={12} /><span className="text-2xs">Copiar</span></>}
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-[#181926]">
        {code.split('\n').map((line, i) => (
          <div
            key={i}
            className={
              line.trim().startsWith('#')
                ? 'text-slate-600'
                : line.startsWith('$')
                ? 'text-emerald-300'
                : /^(name|window|error_budget|threshold|action|expr|for|labels|annotations|apiVersion|kind):/.test(line.trim())
                ? 'text-violet-400 font-semibold'
                : 'text-slate-300'
            }
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}

// ── Real-world Troubleshooting Scenarios (from interview & incident guide) ──
interface ScenarioStep {
  id: string;
  command: string;
  output: string;
  explanation: string;
  actionRequired?: string;
  isSolution?: boolean;
}

interface IncidentScenario {
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  symptom: string;
  environment: string;
  steps: ScenarioStep[];
  rootCause: string;
  prevention: string;
}

const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'high-cpu-ec2',
    title: '1. Spike Crítico de CPU (100%) em Instância EC2 / VM',
    severity: 'SEV-1',
    symptom: 'AlertManager dispara alerta de CPU > 95% por 10min. Requisições HTTP estão sofrendo timeout 504 Gateway Timeout.',
    environment: 'AWS EC2 / Auto Scaling Group / Ubuntu 22.04',
    steps: [
      {
        id: 'step-1',
        command: 'top -b -n 1 | head -n 15',
        output: `top - 14:22:10 up 45 days, 3 users,  load average: 18.42, 14.10, 8.35
Tasks: 182 total,   2 running, 180 sleeping,   0 stopped,   0 zombie
%Cpu(s): 94.8 us,  4.2 sy,  0.0 ni,  0.2 id,  0.8 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  15920.4 total,    812.1 free,  14210.0 used,    898.3 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 4812 app-user  20   0 12.4g  10.2g  24120 R 392.4  64.1 142:12.44 node /app/dist/server.js
 1290 root      20   0  18204   4120   3100 S   1.2   0.0   2:14.20 node_exporter`,
        explanation: 'O processo Node.js (PID 4812) está consumindo quase 400% de CPU (4 vCPUs saturadas) com 10.2GB de memória ocupada.',
      },
      {
        id: 'step-2',
        command: 'ps aux --sort=-%cpu | head -n 5',
        output: `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
app-user  4812  392 64.1 12984120 10695680 ?  Sl   11:00 142:12 node /app/dist/server.js --cluster-worker
app-user  4815  1.2  0.5 120400  84000 ?        S    11:00   0:15 /usr/bin/redis-server 127.0.0.1:6379`,
        explanation: 'Confirmado: o thread de cluster worker do Node.js está preso em um loop síncrono ou processamento de payload JSON não sanitizado.',
      },
      {
        id: 'step-3',
        command: 'journalctl -u app.service --since "15 minutes ago" | tail -n 20',
        output: `Mar 28 14:15:02 ec2-srv app[4812]: [WARN] Heavy regex matching on payload /api/v1/export-report
Mar 28 14:15:03 ec2-srv app[4812]: [ERROR] Catastrophic backtracking detected in regex validator: /([a-zA-Z0-9]+)*$/
Mar 28 14:15:05 ec2-srv app[4812]: [WARN] Event loop delay exceeds 12400ms! Blocking requests.`,
        explanation: 'Causa Raiz Identificada: Vulnerabilidade de ReDoS (Regular Expression Denial of Service) no endpoint de exportação travou a Event Loop do Node.js.',
      },
      {
        id: 'step-4',
        command: 'systemctl restart app.service && sudo sed -i "s/([a-zA-Z0-9]+)*$/[a-zA-Z0-9]+/g" /app/dist/server.js',
        output: `[✓] app.service restarted successfully.
[✓] Event loop latency normalized to 1.8ms. CPU dropped to 8.4%.`,
        explanation: 'Mitigação aplicada: Restart do serviço limpou a fila travada e correção do regex impediu novo ReDoS.',
        isSolution: true,
      },
    ],
    rootCause: 'ReDoS (Regular Expression Denial of Service) com Catastrophic Backtracking no endpoint `/api/v1/export-report`.',
    prevention: 'Substituir expressões regulares aninhadas por analisadores lineares (ex: validator.js com timeouts), e isolar endpoints pesados em workers assíncronos via BullMQ/SQS.',
  },
  {
    id: 'app-not-accessible',
    title: '2. Serviço em Execução mas Inacessível (502 / Connection Refused)',
    severity: 'SEV-1',
    symptom: 'Aplicação web retorna 502 Bad Gateway no ALB da AWS. A equipe de desenvolvimento afirma que o processo está "Up" na máquina.',
    environment: 'AWS ALB + Target Group + EC2 Security Groups',
    steps: [
      {
        id: 'step-1',
        command: 'curl -Iv http://localhost:8080/healthz',
        output: `* Trying 127.0.0.1:8080...
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /healthz HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.81.0
< HTTP/1.1 200 OK
< Content-Type: application/json
< Content-Length: 15
{"status":"ok"}`,
        explanation: 'Localmente dentro da VM o serviço responde 200 OK na porta 8080. O problema está na camada de rede, firewall ou balanceamento.',
      },
      {
        id: 'step-2',
        command: 'ss -tulpn | grep 8080',
        output: `tcp   LISTEN 0      511        127.0.0.1:8080       0.0.0.0:*    users:(("node",pid=2104,fd=18))`,
        explanation: 'ATENÇÃO CRÍTICA: O processo está fazendo bind apenas em `127.0.0.1:8080` (loopback) em vez de `0.0.0.0:8080` (todas as interfaces). O ALB externo não consegue conectar!',
      },
      {
        id: 'step-3',
        command: 'aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...:targetgroup/web-tg/...',
        output: `{
  "TargetHealthDescriptions": [
    {
      "Target": { "Id": "i-0a81729b10f", "Port": 8080 },
      "TargetHealth": {
        "State": "unhealthy",
        "Reason": "Target.FailedConnect",
        "Description": "Connection timed out"
      }
    }
  ]
}`,
        explanation: 'O ALB marca a instância como `unhealthy` por `Target.FailedConnect` pois o bind local impede conexões de IPs da VPC.',
      },
      {
        id: 'step-4',
        command: 'sed -i "s/127.0.0.1/0.0.0.0/g" /app/config.env && systemctl restart app.service',
        output: `[✓] Service restarted on 0.0.0.0:8080
[✓] ALB Target Group status changed to 'healthy' after 2 consecutive 200 OK checks.`,
        explanation: 'Problema solucionado: alterado bind de loopback para `0.0.0.0` e validada regra de ingress do Security Group permitindo porta 8080 originada do ALB SG.',
        isSolution: true,
      },
    ],
    rootCause: 'Aplicação vinculada a `127.0.0.1` (localhost) em vez de `0.0.0.0`, impossibilitando recepção de pacotes roteados pelo Application Load Balancer.',
    prevention: 'Definir `HOST=0.0.0.0` explicitamente no template do Golden Path de containers e adicionar testes de validação de conectividade externa no CI.',
  },
  {
    id: 'k8s-crashloop',
    title: '3. Pod Kubernetes em CrashLoopBackOff & OOMKilled (Exit Code 137)',
    severity: 'SEV-2',
    symptom: 'Deploy de nova release causa restart contínuo de 8 de 10 pods no namespace production.',
    environment: 'Kubernetes 1.29 / EKS / Prometheus Alert: KubePodCrashLooping',
    steps: [
      {
        id: 'step-1',
        command: 'kubectl get pods -n production -l app=payment-service',
        output: `NAME                               READY   STATUS             RESTARTS      AGE
payment-service-59bc7f4949-8k2j1   0/1     CrashLoopBackOff   6 (90s ago)   8m
payment-service-59bc7f4949-9p4d2   0/1     OOMKilled          7 (30s ago)   9m
payment-service-59bc7f4949-lm10s   1/1     Running            0             42m`,
        explanation: 'Múltiplos pods exibem `OOMKilled` e `CrashLoopBackOff`. O Pod remanescente é da versão anterior antes do rollout.',
      },
      {
        id: 'step-2',
        command: 'kubectl describe pod payment-service-59bc7f4949-8k2j1 -n production',
        output: `State:          Waiting
  Reason:       CrashLoopBackOff
Last State:     Terminated
  Reason:       OOMKilled
  Exit Code:    137
  Started:      Mon, 28 Mar 2026 14:10:00 +0000
  Finished:     Mon, 28 Mar 2026 14:11:15 +0000
Limits:
  cpu:     500m
  memory:  256Mi
Requests:
  cpu:     200m
  memory:  128Mi`,
        explanation: 'Exit Code 137 confirma que o Linux OOM Killer do Kernel enviou `SIGKILL` (128 + 9 = 137) porque o pod ultrapassou o memory limit de 256Mi.',
      },
      {
        id: 'step-3',
        command: 'kubectl logs payment-service-59bc7f4949-8k2j1 -n production --previous | tail -n 15',
        output: `[INFO] Initializing in-memory cache...
[INFO] Loading historical transactions (batch size: 100,000)...
[FATAL] java.lang.OutOfMemoryError: Java heap space
Heap usage: 255.4MiB / 256.0MiB limit.`,
        explanation: 'O microsserviço Java tentou pré-carregar um cache de 100.000 transações em memória durante a inicialização sem paginação.',
      },
      {
        id: 'step-4',
        command: 'kubectl set resources deployment payment-service -n production --limits=memory=1Gi,cpu=1000m --requests=memory=512Mi,cpu=500m && kubectl rollout restart deployment/payment-service -n production',
        output: `deployment.apps/payment-service resource requirements updated
deployment.apps/payment-service restarted
[✓] 10/10 pods Running and Ready in 45s. Heap stabilized at 340MiB.`,
        explanation: 'Resolução imediata: Aumento dos limites de memória e solicitação de fix no backend para streaming de dados com Redis.',
        isSolution: true,
      },
    ],
    rootCause: 'Limite de memória de 256Mi insuficiente para o bootstrap da aplicação que carrega cache síncrono sem paginação.',
    prevention: 'Ativar Vertical Pod Autoscaler (VPA) no modo Recommendation para sizing preditivo e utilizar Redis para caches volumosos.',
  },
  {
    id: 'jenkins-pipeline-fail',
    title: '4. Falha em Massa nos Pipelines de CI/CD (Disk Exhaustion & Socket)',
    severity: 'SEV-2',
    symptom: 'Todos os builds de CI falham com erro `No space left on device` e `Cannot connect to the Docker daemon`.',
    environment: 'Self-hosted CI Runner / Docker-in-Docker / Jenkins & GitHub Actions',
    steps: [
      {
        id: 'step-1',
        command: 'df -h',
        output: `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   50G   50G     0 100% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
/dev/nvme1n1    200G  194G  6.0G  97% /var/lib/docker`,
        explanation: 'A partição raiz `/` e o diretório `/var/lib/docker` atingiram 100% de utilização. O Docker daemon não consegue alocar novos containers.',
      },
      {
        id: 'step-2',
        command: 'docker system df',
        output: `TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          342       12        142.4GB   134.8GB (94%)
Containers      89        0         18.2GB    18.2GB (100%)
Local Volumes   54        4         28.1GB    24.2GB (86%)
Build Cache     1200      0         42.0GB    42.0GB (100%)`,
        explanation: 'Existem 342 imagens antigas não tagueadas (<none>) e 42GB de build cache acumulados de pipelines de múltiplos repositórios.',
      },
      {
        id: 'step-3',
        command: 'docker system prune -af --volumes && journalctl --vacuum-time=3d',
        output: `Deleted Images: 330
Deleted Containers: 89
Deleted Volumes: 50
Total reclaimed space: 184.2GB
[✓] Vacuumed 8.4GB of systemd journal logs.`,
        explanation: 'Limpeza de containers mortos, volumes órfãos e imagens sem tag liberou 184.2GB.',
      },
      {
        id: 'step-4',
        command: 'cat << "EOF" > /etc/cron.daily/docker-prune\n#!/bin/bash\ndocker system prune -af --filter "until=72h" --volumes\nEOF\nchmod +x /etc/cron.daily/docker-prune',
        output: `[✓] Automated daily garbage collection cron created successfully.
[✓] CI Pipelines resumed processing queued builds.`,
        explanation: 'Solução permanente: Cron job diário de limpeza de artefactos de containers com retenção de 72h.',
        isSolution: true,
      },
    ],
    rootCause: 'Falta de garbage collection automatizado de imagens de build cache e volumes temporários em runners de CI compartilhados.',
    prevention: 'Configurar Ephemeral Runners com auto-scaling (ex: GitHub Actions Actions-Runner-Controller - ARC no Kubernetes) que destroem o pod após cada job.',
  },
];

export default function SreSimulator() {
  const [section, setSection] = useState<Section>('slo');
  const [windowPct, setWindowPct] = useState(99.7);
  const [budgetUsed, setBudgetUsed] = useState(62);
  const [burnRateMultiplier, setBurnRateMultiplier] = useState(6.0);

  // Incident Troubleshooter State
  const [activeScenarioId, setActiveScenarioId] = useState<string>('high-cpu-ec2');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([0]);

  // Chaos Lab State
  const [chaosType, setChaosType] = useState<'latency' | 'pod-kill' | 'cpu-stress' | 'dns-drop'>('latency');
  const [chaosRunning, setChaosRunning] = useState(false);
  const [chaosLogs, setChaosLogs] = useState<string[]>([]);
  const [chaosImpact, setChaosImpact] = useState<{ p99: number; errorRate: number; status: string }>({
    p99: 45,
    errorRate: 0.02,
    status: 'Steady State Normal',
  });

  // Post-Mortem Interactive State
  const [pmIncidentName, setPmIncidentName] = useState('Incidente Pagamentos Outage (Black Friday)');
  const [pmSeverity, setPmSeverity] = useState('SEV-1');
  const [pmDuration, setPmDuration] = useState('42 minutos');
  const [pmFiveWhys, setPmFiveWhys] = useState([
    'O serviço de checkout rejeitou 34% das transações.',
    'O pool de conexões com o PostgreSQL esgotou (max 200).',
    'Uma query analítica pesada bloqueou locks de tabela durante o pico de vendas.',
    'A query foi disparada diretamente na réplica primária em vez da Read-Replica.',
    'A aplicação não separava connection strings de leitura e escrita no ORM.',
  ]);

  const activeScenario = INCIDENT_SCENARIOS.find(s => s.id === activeScenarioId) || INCIDENT_SCENARIOS[0];

  const handleNextStep = () => {
    if (currentStepIdx < activeScenario.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (!revealedSteps.includes(nextIdx)) {
        setRevealedSteps([...revealedSteps, nextIdx]);
      }
    }
  };

  const handleResetScenario = (id: string) => {
    setActiveScenarioId(id);
    setCurrentStepIdx(0);
    setRevealedSteps([0]);
  };

  const runChaosExperiment = () => {
    setChaosRunning(true);
    setChaosLogs([`[${new Date().toISOString().substring(11, 19)}] Iniciando experimento Chaos: ${chaosType}...`]);

    setTimeout(() => {
      setChaosLogs(prev => [
        ...prev,
        `[${new Date().toISOString().substring(11, 19)}] Injetando falha no namespace production...`,
      ]);
      if (chaosType === 'latency') {
        setChaosImpact({ p99: 680, errorRate: 2.8, status: 'Degradação Severa (SLO Ameaçado)' });
      } else if (chaosType === 'pod-kill') {
        setChaosImpact({ p99: 140, errorRate: 5.4, status: 'Spike de 500s durante reinício de réplica' });
      } else if (chaosType === 'cpu-stress') {
        setChaosImpact({ p99: 920, errorRate: 8.2, status: 'Throttling de CPU em 4 pods' });
      } else {
        setChaosImpact({ p99: 1500, errorRate: 24.0, status: 'DNS Timeout no CoreDNS' });
      }
    }, 1200);

    setTimeout(() => {
      setChaosLogs(prev => [
        ...prev,
        `[${new Date().toISOString().substring(11, 19)}] Circuito de Proteção / Circuit Breaker atuou com sucesso!`,
        `[${new Date().toISOString().substring(11, 19)}] HPA / Karpenter escalou nós adicionais.`,
        `[${new Date().toISOString().substring(11, 19)}] Experimento concluído. Recuperação de steady-state.`,
      ]);
      setChaosImpact({ p99: 52, errorRate: 0.05, status: 'Steady State Recuperado ✓' });
      setChaosRunning(false);
    }, 3500);
  };

  const views = [
    { id: 'slo' as const, label: 'SLI, SLO & SLA', icon: Gauge },
    { id: 'burnrate' as const, label: 'Burn Rate Alerts (SRE)', icon: TrendingDown },
    { id: 'troubleshooter' as const, label: 'War Room Troubleshooter', icon: AlertTriangle },
    { id: 'chaos' as const, label: 'Chaos Lab & Resilience', icon: Flame },
    { id: 'blameless' as const, label: 'Blameless Post-Mortem', icon: Shield },
  ];

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-violet-400">
              <Activity size={24} />
            </div>
            <div>
              <div className="text-2xs font-black text-violet-400 uppercase tracking-widest">Fase 5 · SRE & Reliability</div>
              <h2 className="text-xl font-bold text-white">SRE, Chaos Engineering & Incident Operations</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Google SRE Standard
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-4xl">
          Site Reliability Engineering trata a confiabilidade como o recurso mais valioso de um produto de software.
          Explore métricas quantitativas (SLI/SLO), alertas multi-window multi-burn-rate, resolução interativa de incidentes reais de produção, testes de caos e post-mortems blameless.
        </p>
      </section>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setSection(v.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              section === v.id
                ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300 shadow-lg shadow-violet-500/10'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <v.icon size={15} />
            {v.label}
          </button>
        ))}
      </div>

      {/* ── 1. SLO / SLI / SLA ─────────────────────────────────── */}
      {section === 'slo' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <Gauge size={22} className="text-violet-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-white">A Tríade da Confiabilidade: SLI → SLO → SLA</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Não confunda métricas internas com contratos contratuais com penalidades financeiras.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-black text-violet-400">SLI</span>
                  <span className="text-2xs font-mono text-violet-300/80 px-2 py-0.5 rounded bg-violet-500/20">Indicador</span>
                </div>
                <div className="text-xs font-bold text-white mb-2">Service Level Indicator</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  A medição em tempo real de uma característica do serviço.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-2xs text-violet-300">
                  SLI = (Reqs &lt; 200ms com status 2xx) / Total Reqs
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-black text-amber-400">SLO</span>
                  <span className="text-2xs font-mono text-amber-300/80 px-2 py-0.5 rounded bg-amber-500/20">Meta Interna</span>
                </div>
                <div className="text-xs font-bold text-white mb-2">Service Level Objective</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  A meta quantitativa que o time de engenharia se compromete a atingir.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-2xs text-amber-300">
                  SLO Target = 99.9% em janela móvel de 30 dias
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-black text-emerald-400">SLA</span>
                  <span className="text-2xs font-mono text-emerald-300/80 px-2 py-0.5 rounded bg-emerald-500/20">Contrato Legal</span>
                </div>
                <div className="text-xs font-bold text-white mb-2">Service Level Agreement</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Compromisso formal com o cliente. Se violado, gera multas ou créditos financeiros.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-2xs text-emerald-300">
                  SLA = 99.5% (Geralmente mais frouxo que o SLO)
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SLO Simulator */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white">Simulador Interativo de SLI & Disponibilidade</h4>
                <p className="text-xs text-slate-400">Ajuste o SLI do mês para avaliar a saúde do SLO e o impacto no Error Budget</p>
              </div>
              <span className={`text-sm font-mono font-black px-3 py-1 rounded-xl ${
                windowPct >= 99.9 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                windowPct >= 99.5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                SLI: {windowPct.toFixed(3)}%
              </span>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min={9800}
                max={10000}
                value={Math.round(windowPct * 100)}
                onChange={e => setWindowPct(Number(e.target.value) / 100)}
                className="w-full accent-violet-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xs text-slate-500 uppercase font-mono">Downtime Permitido / Mês (99.9%)</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">43.2 min</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xs text-slate-500 uppercase font-mono">Downtime Real Consumido</div>
                  <div className={`text-lg font-bold font-mono mt-1 ${windowPct < 99.9 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {((100 - windowPct) * 432).toFixed(1)} min
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xs text-slate-500 uppercase font-mono">Status do Error Budget</div>
                  <div className={`text-lg font-bold font-mono mt-1 ${windowPct < 99.9 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {windowPct >= 99.9 ? 'Conforme ✓' : 'Esgotado ✗'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xs text-slate-500 uppercase font-mono">Ação Recomendada</div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">
                    {windowPct < 99.9 ? 'Freeze em Features' : 'Release Normal'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Code
            lang="yaml (OpenSLO Standard Spec)"
            code={`apiVersion: openslo/v1
kind: SLO
metadata:
  name: checkout-payment-availability
  displayName: Checkout Service Success Rate
spec:
  service: checkout-service
  description: 99.9% das chamadas HTTP retornam status != 5xx em < 400ms
  budgetingMethod: Occurrences
  objectives:
    - target: 0.999
      timeSliceTarget: 0.99
      timeSliceWindow: 5m
  timeWindow:
    - duration: 30d
      isRolling: true
  indicator:
    metadata:
      name: payment-latency-sli
    spec:
      ratioMetric:
        good:
          source: prometheus
          query: sum(rate(http_requests_total{service="checkout",status!~"5..",le="0.4"}[5m]))
        total:
          source: prometheus
          query: sum(rate(http_requests_total{service="checkout"}[5m]))`}
          />
        </div>
      )}

      {/* ── 2. Burn Rate Alerts ───────────────────────────────── */}
      {section === 'burnrate' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <TrendingDown size={22} className="text-amber-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-white">Multi-Window Multi-Burn-Rate Alerting (Google SRE)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Alertas tradicionais baseados em threshold fixo (ex: taxa de erro &gt; 1%) disparam muitos falsos positivos. O padrão SRE calcula a <strong>velocidade de queima do orçamento de erro</strong> (Burn Rate).
                </p>
              </div>
            </div>

            {/* Burn Rate Calculator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">Velocidade de Queima Atual (Burn Rate Multiplier):</span>
                <span className="text-base font-mono font-black text-amber-400">{burnRateMultiplier}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={burnRateMultiplier}
                onChange={e => setBurnRateMultiplier(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl border ${burnRateMultiplier >= 14.4 ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <div className="text-xs font-black uppercase font-mono">14.4x Burn Rate (1 Hora)</div>
                  <div className="text-2xs mt-1">Consome 2% do orçamento mensal em 1 hora.</div>
                  <div className="text-xs font-bold mt-2 font-mono">Ação: PagerDuty / On-call Noturno (SEV-1)</div>
                </div>

                <div className={`p-3 rounded-xl border ${burnRateMultiplier >= 6.0 && burnRateMultiplier < 14.4 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <div className="text-xs font-black uppercase font-mono">6x Burn Rate (6 Horas)</div>
                  <div className="text-2xs mt-1">Consome 5% do orçamento mensal em 6 horas.</div>
                  <div className="text-xs font-bold mt-2 font-mono">Ação: Pager On-call Horário Comercial (SEV-2)</div>
                </div>

                <div className={`p-3 rounded-xl border ${burnRateMultiplier < 6.0 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <div className="text-xs font-black uppercase font-mono">1x a 2x Burn Rate (3 Dias)</div>
                  <div className="text-2xs mt-1">Consome 10% do orçamento mensal em 3 dias.</div>
                  <div className="text-xs font-bold mt-2 font-mono">Ação: Criação automática de Ticket Jira (SEV-3)</div>
                </div>
              </div>
            </div>

            <Code
              lang="yaml (Prometheus AlertRule - Multi-Window 14.4x & 6x)"
              code={`# Prometheus Rule: Alerta de Queima Rápida (14.4x - 2% do budget em 1h)
- alert: PaymentApiErrorBudgetBurnRateFast
  expr: (
      sum(rate(http_requests_total{status=~"5..",service="payment"}[1h]))
      / sum(rate(http_requests_total{service="payment"}[1h]))
    ) > (14.4 * (1 - 0.999))
    and
    (
      sum(rate(http_requests_total{status=~"5..",service="payment"}[5m]))
      / sum(rate(http_requests_total{service="payment"}[5m]))
    ) > (14.4 * (1 - 0.999))
  for: 2m
  labels:
    severity: page
    tier: sev-1
  annotations:
    summary: "API de Pagamento consumindo 2% do Error Budget em 1 hora!"
    runbook_url: "https://wiki.acme.corp/runbooks/payment-5xx-burnrate"`}
            />
          </div>
        </div>
      )}

      {/* ── 3. Real-World Troubleshooter ──────────────────────── */}
      {section === 'troubleshooter' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Terminal size={22} className="text-violet-400" />
                <div>
                  <h3 className="text-base font-bold text-white">War Room: Simulador Interativo de Incidentes</h3>
                  <p className="text-xs text-slate-400">Baseado em cenários reais de engenharia de confiabilidade e entrevistas SRE.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResetScenario(activeScenarioId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  <RotateCcw size={14} />
                  Reiniciar Cenário
                </button>
              </div>
            </div>

            {/* Scenario Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {INCIDENT_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => handleResetScenario(sc.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeScenarioId === sc.id
                      ? 'border-violet-500/50 bg-violet-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-2xs font-mono font-bold px-1.5 py-0.5 rounded ${sc.severity === 'SEV-1' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {sc.severity}
                    </span>
                  </div>
                  <div className="text-xs font-bold line-clamp-1">{sc.title}</div>
                </button>
              ))}
            </div>

            {/* Active Scenario Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="text-sm font-bold text-violet-300">{activeScenario.title}</h4>
                <span className="text-2xs font-mono text-slate-400">{activeScenario.environment}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-rose-400">Sintoma:</strong> {activeScenario.symptom}</p>
            </div>

            {/* Interactive Step-by-Step Terminal */}
            <div className="space-y-4">
              {revealedSteps.map((sIdx) => {
                const step = activeScenario.steps[sIdx];
                return (
                  <div key={step.id} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-2xs font-bold">
                          {sIdx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">$ {step.command}</span>
                      </div>
                    </div>
                    <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed bg-[#10121d]">
                      {step.output}
                    </pre>
                    <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" />
                      <span>{step.explanation}</span>
                    </div>
                  </div>
                );
              })}

              {currentStepIdx < activeScenario.steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-violet-600/20"
                >
                  <Play size={14} fill="currentColor" />
                  Investigar Próximo Passo & Executar Diagnóstico
                </button>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    Incidente Mitigado com Sucesso!
                  </div>
                  <p className="text-slate-300"><strong className="text-emerald-300">Causa Raiz:</strong> {activeScenario.rootCause}</p>
                  <p className="text-slate-300"><strong className="text-emerald-300">Prevenção / Paved Road:</strong> {activeScenario.prevention}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Chaos Engineering Lab ──────────────────────────── */}
      {section === 'chaos' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <Flame size={22} className="text-rose-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-white">Laboratório de Chaos Engineering & Resiliência</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Injete falhas controladas em ambiente de staging/produção para validar Circuit Breakers, HPA, failover multi-região e alarmes de SLO.
                </p>
              </div>
            </div>

            {/* Experiment selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { id: 'latency', label: 'Network Latency (200ms)', icon: Zap },
                { id: 'pod-kill', label: 'Pod Chaos (Kill Replica)', icon: AlertTriangle },
                { id: 'cpu-stress', label: 'CPU Stress Spike (100%)', icon: Activity },
                { id: 'dns-drop', label: 'DNS Outage (CoreDNS)', icon: Server },
              ].map(exp => (
                <button
                  key={exp.id}
                  onClick={() => setChaosType(exp.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    chaosType === exp.id
                      ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <exp.icon size={16} className="mb-2 text-rose-400" />
                  <div className="text-xs font-bold">{exp.label}</div>
                </button>
              ))}
            </div>

            {/* Experiment Runner Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Experimento Ativo: {chaosType}</div>
                  <div className="text-2xs text-slate-400">Hipótese: O Circuit Breaker do Envoy/Istio deve abrir em &lt; 2s sem estourar o Error Budget.</div>
                </div>
                <button
                  onClick={runChaosExperiment}
                  disabled={chaosRunning}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    chaosRunning
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                  }`}
                >
                  <Flame size={14} />
                  {chaosRunning ? 'Injetando Falha...' : 'Executar Experimento de Caos'}
                </button>
              </div>

              {/* Real-time Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-2xs text-slate-500 font-mono">Latência p99</div>
                  <div className={`text-lg font-mono font-bold mt-1 ${chaosImpact.p99 > 200 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {chaosImpact.p99} ms
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-2xs text-slate-500 font-mono">Taxa de Erro 5xx</div>
                  <div className={`text-lg font-mono font-bold mt-1 ${chaosImpact.errorRate > 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {chaosImpact.errorRate}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-2xs text-slate-500 font-mono">Status do Sistema</div>
                  <div className="text-xs font-bold mt-1 text-slate-200">
                    {chaosImpact.status}
                  </div>
                </div>
              </div>

              {/* Console Logs */}
              {chaosLogs.length > 0 && (
                <div className="p-3 rounded-lg bg-black/80 font-mono text-2xs space-y-1 text-slate-300">
                  {chaosLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">{log}</div>
                  ))}
                </div>
              )}
            </div>

            <Code
              lang="yaml (Chaos Mesh NetworkChaos Spec)"
              code={`apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: payment-delay-experiment
  namespace: production
spec:
  action: delay
  mode: fixed
  value: '2'          # afeta 2 réplicas aleatórias
  selector:
    namespaces:
      - production
    labelSelectors:
      app: payment-api
  delay:
    latency: '200ms'
    jitter: '20ms'
    correlation: '50'
  duration: '5m'
  scheduler:
    cron: '@every 2h'`}
            />
          </div>
        </div>
      )}

      {/* ── 5. Blameless Post-Mortem ──────────────────────────── */}
      {section === 'blameless' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <Shield size={22} className="text-emerald-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-white">Post-Mortem Blameless & 5 Whys Studio</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Post-mortems sem culpa não buscam culpados individuais (&ldquo;quem errou&rdquo;), mas sim falhas no sistema, processos e ferramentas (&ldquo;porque o sistema permitiu a falha&rdquo;).
                </p>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-2xs font-mono text-slate-400 block mb-1">Título do Incidente</label>
                <input
                  type="text"
                  value={pmIncidentName}
                  onChange={e => setPmIncidentName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-2xs font-mono text-slate-400 block mb-1">Severidade</label>
                <select
                  value={pmSeverity}
                  onChange={e => setPmSeverity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="SEV-1">SEV-1 (Paralisação Total)</option>
                  <option value="SEV-2">SEV-2 (Degradação Severa)</option>
                  <option value="SEV-3">SEV-3 (Impacto Parcial)</option>
                </select>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-2xs font-mono text-slate-400 block mb-1">Duração do Incidente</label>
                <input
                  type="text"
                  value={pmDuration}
                  onChange={e => setPmDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* 5 Whys Interactive Tree */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-5">
              <div className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Radio size={16} className="text-violet-400" />
                Árvore de Causa Raiz: Técnica dos 5 Porquês (5 Whys)
              </div>
              <div className="space-y-2">
                {pmFiveWhys.map((why, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-16 shrink-0 text-2xs font-mono font-bold text-violet-400 pt-1.5">
                      Porquê {i + 1}:
                    </span>
                    <input
                      type="text"
                      value={why}
                      onChange={e => {
                        const newWhys = [...pmFiveWhys];
                        newWhys[i] = e.target.value;
                        setPmFiveWhys(newWhys);
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Mortem Markdown Output */}
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-2xs font-mono text-slate-400">Post-Mortem Gerado (Markdown)</span>
                <button
                  onClick={() => {
                    const md = `# Blameless Post-Mortem: ${pmIncidentName}\n\n**Severidade:** ${pmSeverity}\n**Duração:** ${pmDuration}\n\n## 5 Whys - Análise de Causa Raiz\n${pmFiveWhys.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\n## Action Items Preventivos\n- [ ] Isolar conexões de leitura em Read-Replica com ProxySQL/PgBouncer (@db-lead)\n- [ ] Adicionar Canary Analysis com Flagger no Spinnaker/ArgoCD (@devops-team)\n- [ ] Configurar Alerta Multi-Window Burn Rate no AlertManager (@sre-team)`;
                    navigator.clipboard.writeText(md);
                  }}
                  className="flex items-center gap-1 text-2xs text-slate-400 hover:text-slate-300"
                >
                  <Download size={12} />
                  Copiar Markdown
                </button>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 bg-[#181926] leading-relaxed overflow-x-auto">
{`# Blameless Post-Mortem: ${pmIncidentName}
**Severidade:** ${pmSeverity} | **Duração:** ${pmDuration}

## Análise de Causa Raiz (5 Whys)
${pmFiveWhys.map((w, i) => `${i + 1}. ${w}`).join('\n')}

## Ações Corretivas & Preventivas (Paved Road)
- [ ] [Preventiva] Implementar separação estrita de Read/Write replicas no pool (@backend)
- [ ] [Detectiva] Adicionar alertas de Burn Rate com trigger em 14.4x (@sre)
- [ ] [Mitigativa] Limitar timeout de queries analíticas para 5000ms max (@dba)`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
