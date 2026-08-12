import { useState } from 'react';
import { Copy, Check, PiggyBank } from 'lucide-react';

type View = 'causes' | 'spot' | 'karpenter' | 'scale-zero' | 'network' | 'checklist';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={
            line.trim().startsWith('#') ? 'text-slate-600'
            : line.startsWith('$') ? 'text-emerald-300'
            : line.match(/^(apiVersion|kind|metadata|spec|triggers|requirements):/) ? 'text-emerald-300 font-semibold'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

function SavingsBadge({ range }: { range: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black">
      {range}
    </span>
  );
}

const NODEPOOL = `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: app-nodepool
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]     # prefere spot, cai para on-demand
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64", "arm64"]        # Graviton quando possível
        - key: karpenter.k8s.aws/instance-family
          operator: In
          values: ["m5", "m5a", "m6i", "m6a", "c5", "c6i"]
      nodeClassRef:
        name: default

  disruption:
    consolidationPolicy: WhenUnderutilized   # a definição mais agressiva
    consolidateAfter: 30s
    expireAfter: 720h                        # recicla nodes a cada 30 dias

  limits:
    cpu: "1000"                              # tecto de segurança do NodePool

# WhenUnderutilized  → substitui nodes subutilizados por menores
# WhenEmpty          → só remove nodes vazios (mais seguro, poupa menos`;

const PDB = `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: checkout-api-pdb
  namespace: production
spec:
  minAvailable: 2          # com 3 réplicas → 70% de disponibilidade mínima
  # ou em alternativa:
  # maxUnavailable: 1
  selector:
    matchLabels:
      app: checkout-api

# REGRA: todo o Deployment em Spot precisa de PDB.
# Sem PDB, uma interrupção Spot pode derrubar todas as réplicas ao mesmo tempo.
# Alvo: mínimo 70% de disponibilidade. Abaixo de 50% o PDB perde o propósito.`;

const KEDA_SQS = `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: sqs-consumer-scaler
  namespace: production
spec:
  scaleTargetRef:
    name: order-processor
  minReplicaCount: 0          # scale-to-zero verdadeiro (HPA não consegue)
  maxReplicaCount: 50
  cooldownPeriod: 300         # espera 5 min antes de descer a zero
  triggers:
    - type: aws-sqs-queue
      authenticationRef:
        name: keda-aws-credentials
      metadata:
        queueURL: https://sqs.eu-west-1.amazonaws.com/123456/orders
        queueLength: "5"      # 5 mensagens por réplica
        awsRegion: eu-west-1`;

const KEDA_CRON = `# Cron scaler — zero garantido fora de horas
# O padrão KEDA mais seguro: não depende de sinais externos.
triggers:
  - type: cron
    metadata:
      timezone: Europe/Lisbon
      start: 30 8 * * 1-5      # sobe às 08:30 nos dias úteis
      end: 0 20 * * 1-5        # desce a zero às 20:00
      desiredReplicas: "10"

# Combinação recomendada para workloads sensíveis a SLO:
#   · Cron scaler mantém minReplicaCount: 1 em horário laboral
#   · scale-to-zero só durante a noite`;

const VPA = `apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: checkout-api-vpa
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  updatePolicy:
    updateMode: "Off"        # começa em Off — só recomenda, não aplica
  resourcePolicy:
    containerPolicies:
      - containerName: checkout-api
        minAllowed:
          cpu: 50m
          memory: 64Mi
        maxAllowed:
          cpu: 2
          memory: 2Gi

# Modos do VPA:
#   Off      → só calcula recomendações. Melhor ponto de partida.
#   Initial  → aplica só quando o pod é criado. Sem disrupção.
#   Auto     → aplica continuamente (reinicia pods). Cuidado em produção.`;

const GOLDILOCKS = `# Goldilocks — dashboard de right-sizing (Fairwinds, open-source)
# Corre VPA em modo recomendação em todos os namespaces
# e mostra "pedido actual vs recomendado" num dashboard.

$ helm install goldilocks fairwinds-stable/goldilocks \\
    --namespace goldilocks --create-namespace

# Activar num namespace
$ kubectl label namespace production goldilocks.fairwinds.com/enabled=true

# Aceder ao dashboard
$ kubectl port-forward svc/goldilocks-dashboard -n goldilocks 8080:80

# É a forma mais rápida de encontrar workloads sobre-dimensionados
# sem alterar nada. Mede durante 7 dias antes de agir.`;

const TOPOLOGY = `# Reduzir tráfego cross-AZ — 3 a 10% da factura

# 1. Topology-aware routing (K8s 1.27+)
apiVersion: v1
kind: Service
metadata:
  name: checkout-api
  annotations:
    service.kubernetes.io/topology-mode: Auto   # prefere endpoints na mesma AZ
spec:
  selector:
    app: checkout-api

# 2. Espalhar pods pelas AZs de forma equilibrada
spec:
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: topology.kubernetes.io/zone
      whenUnsatisfiable: ScheduleAnyway
      labelSelector:
        matchLabels:
          app: checkout-api

# Cross-AZ custa ~$0.01/GB em CADA sentido.
# Numa app chatty entre serviços, isto acumula depressa.`;

const VPC_ENDPOINTS = `# VPC Endpoints — cortar custos de NAT Gateway

# Gateway Endpoints (GRÁTIS) — S3 e DynamoDB
$ aws ec2 create-vpc-endpoint \\
    --vpc-id vpc-123 \\
    --service-name com.amazonaws.eu-west-1.s3 \\
    --route-table-ids rtb-abc

# Interface Endpoints (pagos, mas mais baratos que NAT para volume)
#   com.amazonaws.<region>.ecr.api
#   com.amazonaws.<region>.ecr.dkr        ← pull de imagens
#   com.amazonaws.<region>.ssm
#   com.amazonaws.<region>.logs
#   com.amazonaws.<region>.sts

# Num cluster EKS, o pull de imagens do ECR passa pelo NAT Gateway
# por omissão. Um endpoint de ECR elimina esse custo por completo.`;

const KUBECOST = `# Visibilidade de custos por namespace

$ helm install kubecost cost-analyzer \\
    --repo https://kubecost.github.io/cost-analyzer/ \\
    --namespace kubecost --create-namespace

$ kubectl port-forward -n kubecost svc/kubecost-cost-analyzer 9090

# Alternativa 100% open-source: OpenCost (projecto CNCF)

# Tagging — sem isto não há atribuição possível
#   Team / Environment / Project / CostCenter
# Impõe com AWS Config + tag policies ANTES do primeiro workload.`;

const CAUSES = [
  { cause: 'Pods sobre-dimensionados', waste: '20–40% do compute', fix: 'VPA + Goldilocks para right-sizing' },
  { cause: 'On-Demand em vez de Spot', waste: '30–90% por node', fix: 'Spot instances + Karpenter' },
  { cause: 'Sem scale-to-zero em workloads idle', waste: '10–70% por serviço', fix: 'KEDA event-driven autoscaling' },
  { cause: 'Baseline On-Demand sem compromisso', waste: '30–60% do baseline', fix: 'Compute Savings Plans' },
  { cause: 'Data transfer e networking escondidos', waste: '5–25% da factura total', fix: 'VPC Endpoints + topology awareness' },
];

const CHECKLIST = [
  ['1', 'Mover workloads Spot-safe para Spot', '30–90%', 'Médio'],
  ['2', 'Instalar Karpenter + consolidação WhenUnderutilized', '20–40%', 'Médio'],
  ['3', 'Right-sizing com VPA + Goldilocks (medir 7 dias)', '15–30%', 'Baixo'],
  ['4', 'KEDA para queue consumers e batch (scale to 0)', '40–70%', 'Médio'],
  ['5', 'Compute Savings Plan para o baseline On-Demand', '30–66%', 'Baixo'],
  ['6', 'VPC Gateway Endpoint para S3 (grátis, imediato)', '5–15%', 'Baixo'],
  ['7', 'Interface Endpoints para ECR, SSM, CloudWatch, STS', '5–15%', 'Baixo'],
  ['8', 'Consolidar serviços atrás de um único ALB Ingress', '5–15%', 'Médio'],
  ['9', 'Topology-aware routing para reduzir cross-AZ', '3–10%', 'Baixo'],
  ['10', 'Enviar logs para S3 via Fluent Bit em vez de CloudWatch', '10–20%', 'Médio'],
  ['11', 'Auto-shutdown do cluster de dev (kube-downscaler)', '60–80%', 'Baixo'],
  ['12', 'Tags em todos os node groups', 'Visibilidade', 'Baixo'],
  ['13', 'Kubecost ou OpenCost para atribuição por namespace', 'Visibilidade', 'Baixo'],
  ['14', 'Ritual mensal de revisão de custos (30 min)', 'Contínuo', 'Baixo'],
];

const MISTAKES = [
  ['Spot para workloads stateful sem PVCs que sobrevivam à perda do node', 'Perda de dados, outages', 'Move stateful para node groups On-Demand; usa EBS Multi-Attach ou EFS'],
  ['Memory limits demasiado baixos', 'OOMKills constantes, SLOs degradados', 'Define limits a P99 + 20% de margem'],
  ['Over-commit de Savings Plans com base no gasto actual (pré-optimização)', 'Pagas capacidade que não usas', 'Compromete-te a 70–80% do baseline mínimo pós-optimização'],
  ['Activar consolidação do Karpenter sem PodDisruptionBudgets', 'Evicções inesperadas em produção', 'Adiciona PDBs a todos os Deployments antes de activar'],
  ['CloudWatch Log retention em "Never Expire"', 'Custo de storage a acumular sem fim', 'Define 30–90 dias; arquiva o resto em S3'],
  ['Ignorar tráfego cross-AZ até a factura chegar', 'Sobretaxa escondida de 10–20%', 'Activa topology hints e topologySpreadConstraints proactivamente'],
  ['Não etiquetar recursos desde o dia zero', 'Impossível atribuir custos', 'Impõe tags via AWS Config antes do primeiro workload'],
];

export default function FinOpsSimulator() {
  const [view, setView] = useState<View>('causes');

  const tabs: { id: View; label: string }[] = [
    { id: 'causes',     label: 'As 5 causas' },
    { id: 'spot',       label: 'Spot' },
    { id: 'karpenter',  label: 'Karpenter' },
    { id: 'scale-zero', label: 'KEDA & right-sizing' },
    { id: 'network',    label: 'Rede & visibilidade' },
    { id: 'checklist',  label: 'Checklist' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-3">
          <PiggyBank size={22} className="text-emerald-400" />
          <div>
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">FinOps · Kubernetes</div>
            <h2 className="text-lg font-bold text-white">Optimização de custos em EKS</h2>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
          Equipas com EKS em produção pagam rotineiramente <strong className="text-slate-300">40–60% a mais</strong> do
          que precisavam. As causas são quase sempre as mesmas cinco. Este módulo cobre cada alavanca de custo —
          com a configuração real, os números e o raciocínio por trás de cada recomendação.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── As 5 causas ─────────────────────────────────────── */}
      {view === 'causes' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">As cinco causas de gasto excessivo</h3>
            <div className="space-y-2">
              {CAUSES.map(c => (
                <div key={c.cause} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <span className="text-[12px] font-semibold text-slate-200">{c.cause}</span>
                    <span className="text-[11px] font-bold text-rose-300">{c.waste}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 mt-1.5">→ {c.fix}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Por onde começar</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Começa por <strong className="text-emerald-300">Spot instances e Karpenter</strong>. Só essas duas mudanças
              cortam a factura da maioria dos clusters para metade numa semana. Depois acrescenta KEDA para workloads
              idle, right-sizing para eficiência, e Savings Plans para o baseline comprometido.
            </p>
            <p className="text-[12px] text-slate-400 leading-relaxed mt-3">
              As estratégias compõem-se: right-sizing dos pods permite ao Karpenter encaixar mais em menos nodes,
              o que reduz o baseline a cobrir com Savings Plans, o que reduz a exposição a On-Demand,
              o que torna Spot a escolha lógica para o resto.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Erros comuns</h3>
            <div className="space-y-2">
              {MISTAKES.map(([mistake, impact, fix]) => (
                <div key={mistake} className="p-3 rounded-xl bg-slate-900">
                  <div className="text-[12px] font-semibold text-rose-300">{mistake}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Impacto: {impact}</div>
                  <div className="text-[11px] text-emerald-300 mt-1">Correcção: {fix}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Spot ────────────────────────────────────────────── */}
      {view === 'spot' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-white">Spot Instances</h3>
            <SavingsBadge range="30–90%" />
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Capacidade EC2 sobrante a até 90% de desconto. A AWS pode reclamá-la com 2 minutos de aviso —
            o que exige desenhar os workloads para tolerar interrupção. Um m5.xlarge On-Demand custa ~$140/mês;
            em Spot fica tipicamente entre $14 e $40.
          </p>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[13px] font-bold text-white mb-3">Classificar os workloads — honestamente</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Spot-safe</div>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  <li>· CI/CD runners e build agents</li>
                  <li>· Batch, pipelines de dados, ETL</li>
                  <li>· Microserviços stateless (com PDBs)</li>
                  <li>· Treino e inferência ML (com retry)</li>
                  <li>· Dev, staging, QA (100% Spot)</li>
                  <li>· Queue consumers reiniciáveis</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
                <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Só On-Demand</div>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  <li>· Bases de dados em EC2 (usa RDS)</li>
                  <li>· Kafka brokers, ZooKeeper</li>
                  <li>· Serviços críticos de réplica única</li>
                  <li>· StatefulSets com PVs que exigem node estável</li>
                  <li>· kube-system daemonsets e add-ons</li>
                  <li>· Failover sub-segundo</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Regra da diversificação</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              O erro Spot mais comum é usar uma só família de instâncias. A AWS reclama capacidade pool a pool —
              todos os teus m5.xlarge podem desaparecer ao mesmo tempo. Usa <strong>pelo menos 3 famílias</strong> por
              node group Spot (m5, m5a, m6i, m6a, m4), e 5+ nos críticos. Mais pools = menos interrupções.
            </p>
          </div>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">PodDisruptionBudget — não negociável</h3>
            <Code code={PDB} lang="yaml" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[13px] font-bold text-white mb-3">Arquitectura de node groups em 4 camadas</h3>
            <div className="space-y-2">
              {[
                ['system-ng', 'm5.large · On-Demand', 'kube-system, CoreDNS, CNI, CSI'],
                ['app-spot-ng', 'm5/m5a/m6i.xl · Spot', 'Microserviços stateless com PDBs'],
                ['batch-spot-ng', 'c5/c5a/c6i.2xl · Spot', 'CI/CD, processamento de dados, ML'],
                ['critical-ng', 'm5.2xlarge · On-Demand', 'Kafka, Redis, APIs críticas'],
              ].map(([name, type, workloads]) => (
                <div key={name} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <code className="text-[12px] font-bold text-emerald-300">{name}</code>
                    <span className="text-[11px] text-slate-500">{type}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{workloads}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Karpenter ───────────────────────────────────────── */}
      {view === 'karpenter' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-white">Karpenter</h3>
            <SavingsBadge range="20–40%" />
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Autoscaler open-source da AWS que substitui o Cluster Autoscaler + Managed Node Groups.
            Em vez de escalar node groups pré-configurados, observa os pods pendentes e provisiona
            exactamente a instância EC2 certa para cada workload — normalmente em ~30 segundos.
          </p>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[13px] font-bold text-white mb-3">Karpenter vs Cluster Autoscaler</h3>
            <div className="space-y-1.5">
              {[
                ['Velocidade de provisionamento', '2–5 minutos', '~30 segundos'],
                ['Selecção de instância', 'Node group fixo', 'Qualquer tipo EC2'],
                ['Diversificação Spot', 'Config manual por ASG', 'Automática entre pools'],
                ['Bin-packing', 'Básico', 'Agressivo, em tempo real'],
                ['Consolidação de nodes', 'Limitada', 'Contínua e automática'],
                ['Ligação a AZ', 'Sim (por ASG)', 'Não — escolhe a AZ óptima'],
                ['GPU / ARM', 'Node group manual', 'Automático por pedido do pod'],
              ].map(([feature, ca, kar]) => (
                <div key={feature} className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 text-[11px]">
                  <span className="text-slate-300 font-medium">{feature}</span>
                  <span className="text-slate-500">{ca}</span>
                  <span className="text-emerald-300">{kar}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">NodePool — a política de provisionamento</h3>
            <Code code={NODEPOOL} lang="yaml" />
          </section>

          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Ganho imediato</div>
            <p className="text-[12px] text-emerald-100 leading-relaxed">
              Define <code className="text-emerald-300">consolidationPolicy: WhenUnderutilized</code> e{' '}
              <code className="text-emerald-300">consolidateAfter: 30s</code> em todos os node pools não-críticos.
              Só isto reduz a contagem de nodes em 15–25% nas primeiras 24 horas, à medida que a variação
              natural de carga cria oportunidades de consolidação.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Antes de activar</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              Adiciona PodDisruptionBudgets a todos os Deployments de produção <strong>antes</strong> de activar a
              consolidação. Sem PDBs, o Karpenter pode despejar pods de forma inesperada ao consolidar nodes.
            </p>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-[13px] font-bold text-white mb-2">Interrupções Spot</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              O Karpenter trata as interrupções Spot nativamente através das notificações EC2 Instance Action.
              Quando a AWS sinaliza uma interrupção, o Karpenter começa imediatamente a fazer cordon e drain
              do node, garantindo o reagendamento antes de expirar a janela de 2 minutos.
              Não precisas do node-termination-handler.
            </p>
          </section>
        </div>
      )}

      {/* ── KEDA & right-sizing ─────────────────────────────── */}
      {view === 'scale-zero' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-white">KEDA — scale to zero</h3>
            <SavingsBadge range="40–70%" />
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            O HPA nativo tem um mínimo rígido de 1 réplica por desenho. Isso significa que um serviço
            completamente idle continua a ocupar um slot de node 24/7. O KEDA levanta essa restrição:
            integra-se com fontes de eventos e permite <code className="text-emerald-300">minReplicaCount: 0</code>.
          </p>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[13px] font-bold text-white mb-3">HPA vs KEDA</h3>
            <div className="space-y-1.5">
              {[
                ['Réplicas mínimas', '1 (chão rígido)', '0 (scale-to-zero real)'],
                ['Fontes de trigger', 'Só CPU / memória', 'SQS, Kafka, HTTP, Cron, Prometheus, 60+'],
                ['Escala por profundidade de fila', 'Não', 'Sim — scalers nativos SQS/Kafka'],
                ['Agendamento cron', 'Não', 'Sim — Cron scaler integrado'],
              ].map(([feature, hpa, keda]) => (
                <div key={feature} className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 text-[11px]">
                  <span className="text-slate-300 font-medium">{feature}</span>
                  <span className="text-slate-500">{hpa}</span>
                  <span className="text-emerald-300">{keda}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Scaler SQS — o padrão mais comum</h3>
            <Code code={KEDA_SQS} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Cron scaler — zero garantido fora de horas</h3>
            <Code code={KEDA_CRON} lang="yaml" />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Orçamento de cold-start</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              KEDA + Karpenter de 0 a servir tráfego demora tipicamente <strong>45–90 segundos</strong>:
              ~30s para o Karpenter provisionar o node, 15–30s para o pod arrancar e ficar ready.
              Para workloads sensíveis a SLO, mantém <code className="text-amber-300">minReplicaCount: 1</code> em
              horário laboral com um Cron scaler, e permite scale-to-zero só durante a noite.
            </p>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-[13px] font-bold text-white mb-2">A sequência completa KEDA + Karpenter</h3>
            <ol className="space-y-1.5 text-[12px] text-slate-400">
              <li>1. Fila esvazia → KEDA detecta zero mensagens → escala o deployment a 0</li>
              <li>2. Pods terminam → os nodes ficam vazios</li>
              <li>3. Karpenter detecta nodes vazios → termina-os após o <code className="text-slate-500">consolidateAfter</code></li>
              <li>4. Instâncias EC2 devolvidas à AWS → a facturação pára em minutos</li>
              <li>5. Nova mensagem chega → KEDA escala → Karpenter provisiona em ~30s</li>
            </ol>
          </section>

          <div className="flex items-center gap-2 pt-2">
            <h3 className="text-[14px] font-bold text-white">Right-sizing</h3>
            <SavingsBadge range="15–30%" />
          </div>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">VPA — Vertical Pod Autoscaler</h3>
            <Code code={VPA} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Goldilocks — o dashboard que mostra o desperdício</h3>
            <Code code={GOLDILOCKS} lang="bash" />
          </section>
        </div>
      )}

      {/* ── Rede & visibilidade ─────────────────────────────── */}
      {view === 'network' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-white">Custos de rede escondidos</h3>
            <SavingsBadge range="5–25%" />
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            A parte da factura que ninguém vê até chegar. Data transfer cross-AZ, NAT Gateway para pull
            de imagens do ECR, e CloudWatch Logs sem retenção definida acumulam sem fazer barulho.
          </p>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">VPC Endpoints — cortar o NAT Gateway</h3>
            <Code code={VPC_ENDPOINTS} lang="bash" />
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Reduzir tráfego cross-AZ</h3>
            <Code code={TOPOLOGY} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-white mb-2">Visibilidade — Kubecost / OpenCost</h3>
            <Code code={KUBECOST} lang="bash" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[13px] font-bold text-white mb-3">Ritual mensal de revisão (30 min)</h3>
            <ol className="space-y-1.5 text-[12px] text-slate-400">
              <li>1. Abre o Kubecost — ordena namespaces por custo mensal. Identifica os 5 maiores.</li>
              <li>2. Para cada um: compara CPU/memória pedidos vs reais. Marca tudo com &gt;50% de desperdício.</li>
              <li>3. Revê as métricas de consolidação do Karpenter — quantos nodes foram consolidados?</li>
              <li>4. Revê a taxa de interrupção Spot — se &gt;5%, diversifica mais famílias de instância.</li>
              <li>5. Verifica a utilização do Savings Plan — cobertura acima de 70%?</li>
              <li>6. Cria um ticket de right-sizing por cada driver de custo. Acompanha semana a semana.</li>
            </ol>
          </section>
        </div>
      )}

      {/* ── Checklist ───────────────────────────────────────── */}
      {view === 'checklist' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-2">Checklist de acção</h3>
            <p className="text-[12px] text-slate-400 mb-4">
              Por ordem de retorno sobre esforço. Os primeiros itens dão mais poupança por menos trabalho.
            </p>
            <div className="space-y-1.5">
              {CHECKLIST.map(([num, action, savings, effort]) => (
                <div key={num} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                    {num}
                  </span>
                  <span className="flex-1 text-[12px] text-slate-300">{action}</span>
                  <span className="shrink-0 text-[11px] font-bold text-emerald-300">{savings}</span>
                  <span className="shrink-0 text-[10px] text-slate-500 w-12 text-right">{effort}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Savings Plans — escolher e dimensionar</h3>
            <div className="space-y-1.5 mb-4">
              {[
                ['Compute Savings Plan (1 ano)', '~66%', 'Qualquer EC2, Fargate, Lambda, qualquer região'],
                ['EC2 Instance Savings Plan (1 ano)', '~72%', 'Família + região fixas, qualquer tamanho/OS'],
                ['Reserved Instance (1 ano)', '~40%', 'Tipo, AZ e OS fixos'],
                ['Reserved Instance (3 anos)', '~60%', 'Baseline de longo prazo'],
              ].map(([plan, discount, flex]) => (
                <div key={plan} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="text-[12px] font-semibold text-slate-200">{plan}</span>
                    <span className="text-[11px] font-bold text-emerald-300">{discount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{flex}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
              <p className="text-[12px] text-amber-100 leading-relaxed">
                <strong>Não te comprometas em excesso.</strong> Vê os últimos 3 meses no Cost Explorer,
                encontra o gasto mínimo mensal, e compromete-te a <strong>70–80% desse mínimo</strong>.
                Se optimizares depois (Spot, KEDA), o compromisso mantém-se e pagas capacidade que já não usas.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
