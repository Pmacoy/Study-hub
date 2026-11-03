import { useState } from 'react';
import {
  Cpu,
  GitBranch,
  Layers,
  Activity,
  Database,
  BarChart3,
  Sliders,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  Server,
  Zap,
  RefreshCw,
  Box,
  Workflow,
  Sparkles,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  LineChart
} from 'lucide-react';

type SubTab = 'lifecycle' | 'drift-lab' | 'metrics-lab' | 'mlops-stack' | 'code-blueprints';

interface PipelineStep {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  tools: string[];
  bestPractices: string[];
  failureModes: string[];
  metricFocus: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'ingestion',
    number: 1,
    title: '1. Ingestão & Data Validation',
    category: 'Data Engineering',
    description: 'Coleta de fluxos batch e streaming com validação rigorosa de schema, verificação de nulls, outliers e distribuição estatística antes de entrar no data lakehouse.',
    tools: ['Great Expectations', 'Apache Spark', 'Kafka', 'dbt', 'Pandas Profiling'],
    bestPractices: [
      'Garantir imutabilidade de datasets brutos em raw buckets (S3/GCS)',
      'Definir testes de expectativa estritos (ex: column_values_to_not_be_null)',
      'Criar particionamento temporal por ano/mês/dia para time-travel queries'
    ],
    failureModes: ['Silent schema corruption', 'Valores nulos não tratados que quebram pipelines a jusante', 'Duplicação de registros'],
    metricFocus: 'Schema Consistency % · Data Completeness · Ingestion Latency'
  },
  {
    id: 'feature-store',
    number: 2,
    title: '2. Feature Engineering & Store',
    category: 'Feature Platform',
    description: 'Transformação padronizada de variáveis com persistência centralizada. Separação explícita entre Offline Store (BigQuery/Snowflake) para treino sem data leakage e Online Store (Redis/DynamoDB) para inferência ultra-rápida.',
    tools: ['Feast', 'Tecton', 'Hopsworks', 'Redis', 'BigQuery'],
    bestPractices: [
      'Usar Point-in-time Joins para evitar Training-Serving Skew (vazamento de dados do futuro)',
      'Definir Entity IDs claros (ex: user_id, device_id, merchant_id)',
      'Versionar definições de features como código (YAML/Python GitOps)'
    ],
    failureModes: ['Training-Serving Skew', 'Lookahead bias no cálculo de agregações móveis', 'Online/Offline data drift'],
    metricFocus: 'Online Lookup Latency (< 10ms) · Feature Freshness (TTL) · Cache Hit Rate'
  },
  {
    id: 'training',
    number: 3,
    title: '3. Treinamento & Hyperparameter Tuning',
    category: 'Model Computation',
    description: 'Treinamento distribuído com rastreamento completo de experimentos, artefatos, sementes aleatórias e busca bayesiana de hiperparâmetros (Optuna/Ray Tune) em instâncias GPU escaláveis.',
    tools: ['PyTorch', 'XGBoost', 'LightGBM', 'Optuna', 'Ray Train', 'Kubeflow'],
    bestPractices: [
      'Fixar random seeds para garantir reprodutibilidade matemática',
      'Registrar métricas por época/step em tempo real via MLflow Tracking',
      'Implementar early stopping baseado em validação cruzada estratificada'
    ],
    failureModes: ['Overfitting severo', 'Gradientes explodindo/desvanecendo', 'Desperdício de recursos de GPU ociosa'],
    metricFocus: 'Train/Validation Loss · ROC-AUC · GPU Compute Utilization %'
  },
  {
    id: 'eval-registry',
    number: 4,
    title: '4. Avaliação & Model Registry',
    category: 'Model Governance',
    description: 'Auditoria de viés, testes em fatias de dados (data slicing), geração da matriz de confusão e registro versionado no Model Registry com assinatura formal (input/output schema) e aprovação de release.',
    tools: ['MLflow Model Registry', 'Weights & Biases', 'Fairlearn', 'Evidently AI'],
    bestPractices: [
      'Comparar novo modelo com o baseline de produção atual antes de promover para "Staging"',
      'Exigir Model Signature estrita com tipos de tensores e validação de schema',
      'Realizar testes de invariância e testes direcionais (CheckList for NLP/ML)'
    ],
    failureModes: ['Substituição acidental de modelo em produção', 'Viés algorítmico em subgrupos vulneráveis', 'Falta de linhegem (lineage)'],
    metricFocus: 'F1-Score · PR-AUC · Fairness Parity Metrics · Baseline Δ'
  },
  {
    id: 'deployment',
    number: 5,
    title: '5. Deploy & Serving Strategies',
    category: 'Serving Infrastructure',
    description: 'Empacotamento do modelo em microserviço com compilação otimizada (ONNX Runtime, Triton) e estratégias de implantação seguras: Shadow (Dark traffic), Canary ou A/B testing com rollback automático.',
    tools: ['Triton Inference Server', 'vLLM', 'Seldon Core', 'KServe', 'FastAPI', 'TorchServe'],
    bestPractices: [
      'Iniciar sempre com Shadow Deployment para validar latência e memória sem impacto',
      'Configurar Dynamic Batching para maximizar throughput em GPUs',
      'Habilitar Liveness/Readiness probes específicos de ML (aquecimento do modelo)'
    ],
    failureModes: ['OOM na GPU por batch size descalibrado', 'Cold start elevado', 'Falha de rollback sob carga'],
    metricFocus: 'P95/P99 Latency (ms) · RPS Throughput · GPU Memory Footprint'
  },
  {
    id: 'monitoring',
    number: 6,
    title: '6. Monitoramento de Drift & Retreinamento',
    category: 'Continuous Operations',
    description: 'Vigilância contínua de telemetria em produção detectando Data Drift (teste Kolmogorov-Smirnov, PSI), Concept Drift e degradação de performance, disparando pipelines de re-treinamento autônomo.',
    tools: ['Evidently AI', 'Prometheus', 'Grafana', 'WhyLabs', 'Argo Workflows'],
    bestPractices: [
      'Definir limiares de alerta para PSI > 0.2 ou p-value KS < 0.05',
      'Armazenar predições e rótulos retardados (delayed ground truth) para recalcular F1 real',
      'Automatizar o disparo de re-treino com validação de guardrails'
    ],
    failureModes: ['Silêncio operacional diante de degradação do modelo', 'Re-treinamento infinito em loop fechado', 'Alert fatigue'],
    metricFocus: 'PSI (Population Stability Index) · KS p-value · Realized F1-Score'
  }
];

export default function MlPipelinesSimulator() {
  const [activeTab, setActiveTab] = useState<SubTab>('lifecycle');
  const [selectedStep, setSelectedStep] = useState<PipelineStep>(PIPELINE_STEPS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Drift Simulation State
  const [driftIntensity, setDriftIntensity] = useState<number>(0);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainCount, setRetrainCount] = useState<number>(0);

  // Metrics Lab State
  const [threshold, setThreshold] = useState<number>(0.5);
  const totalSamples = 1000;
  const actualPositives = 150;
  const actualNegatives = 850;

  // Real-time calculation based on threshold
  const calculateMetrics = (th: number) => {
    // When threshold is low (e.g. 0.1), we predict more positives -> high TP, high FP, high recall, low precision
    // When threshold is high (e.g. 0.9), we predict fewer positives -> low TP, low FP, low recall, high precision
    const tp = Math.round(actualPositives * Math.pow(1 - th, 0.6));
    const fn = actualPositives - tp;
    const fp = Math.round(actualNegatives * Math.pow(1 - th, 2.8));
    const tn = actualNegatives - fp;

    const precision = tp + fp > 0 ? (tp / (tp + fp)) : 0;
    const recall = tp + fn > 0 ? (tp / (tp + fn)) : 0;
    const f1 = precision + recall > 0 ? (2 * (precision * recall) / (precision + recall)) : 0;
    const accuracy = (tp + tn) / totalSamples;
    const specificity = tn + fp > 0 ? (tn / (tn + fp)) : 0;

    return { tp, fn, fp, tn, precision, recall, f1, accuracy, specificity };
  };

  const metrics = calculateMetrics(threshold);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Drift Metrics calculations
  const baselineMean = 50.0;
  const currentMean = 50.0 + (driftIntensity * 24.5);
  const ksStatistic = (driftIntensity * 0.42).toFixed(3);
  const ksPValue = Math.max(0.0001, (1 - driftIntensity * 0.98)).toFixed(4);
  const psiValue = (driftIntensity * 0.38).toFixed(3);
  const isDriftDetected = driftIntensity >= 0.45;

  const triggerRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setDriftIntensity(0);
      setIsRetraining(false);
      setRetrainCount(c => c + 1);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
              <Workflow size={18} />
            </div>
            <span className="text-2xs uppercase tracking-wider font-mono font-bold text-fuchsia-400">
              MLOps & Continuous Delivery for ML
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Machine Learning Pipelines & Production Lifecycle
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Arquitetura de pipelines de dados, Feature Stores (Feast), rastreamento de experimentos (MLflow),
            estratégias de deploy (Shadow/Canary) e detecção estatística de Data Drift (KS-Test, PSI).
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
          <div className="live-dot live-dot-fuchsia" />
          <span className="text-2xs font-mono text-slate-300">
            Pipeline Health: <strong className="text-emerald-400">OPERATIONAL</strong>
          </span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800/80 pb-px overflow-x-auto">
        {[
          { id: 'lifecycle', label: '1. Pipeline Lifecycle (E2E)', icon: Layers },
          { id: 'drift-lab', label: '2. Laboratório de Data Drift & PSI', icon: Activity },
          { id: 'metrics-lab', label: '3. Simulador de Métricas & Threshold', icon: Sliders },
          { id: 'mlops-stack', label: '4. MLOps Stack Architecture', icon: Box },
          { id: 'code-blueprints', label: '5. Python Production Blueprints', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all rounded-t-md whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-fuchsia-500 bg-fuchsia-500/10 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-fuchsia-400' : 'text-slate-500'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIFECYCLE E2E */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-6">
          {/* Visual Step Pipeline Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PIPELINE_STEPS.map((step) => {
              const isSelected = selectedStep.id === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-fuchsia-950/40 border-fuchsia-500/60 shadow-lg shadow-fuchsia-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-2xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      ETAPA {step.number}
                    </span>
                    <span className="text-2xs text-slate-500 font-mono">{step.category.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                    {step.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Step Deep Dive Card */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    {selectedStep.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Fase #{selectedStep.number} de 6</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedStep.title}
                </h3>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg">
                <span className="text-2xs text-slate-400 font-mono block">Métrica Chave / SLA</span>
                <span className="text-xs font-mono font-bold text-fuchsia-400">{selectedStep.metricFocus}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedStep.description}
            </p>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Tools & Frameworks */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
                  <Box size={14} />
                  <span>Ferramentas & Tecnologias</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedStep.tools.map((t) => (
                    <span key={t} className="text-2xs font-mono px-2 py-1 rounded bg-sky-950/40 text-sky-300 border border-sky-800/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <ShieldCheck size={14} />
                  <span>Boas Práticas de Engenharia</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedStep.bestPractices.map((bp, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Failure Modes & Anti-Patterns */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
                  <AlertTriangle size={14} />
                  <span>Falhas Comuns & Riscos</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedStep.failureModes.map((fm, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-rose-400 shrink-0">✗</span>
                      <span>{fm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA DRIFT LAB */}
      {activeTab === 'drift-lab' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-fuchsia-400" />
                  Simulador Estatístico de Data Drift & PSI (Population Stability Index)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Arraste o controle para injetar desvio na distribuição de features em tempo real e observe os testes de Kolmogorov-Smirnov (KS) e PSI.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerRetrain}
                  disabled={isRetraining}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-white text-xs font-mono font-bold transition-all shadow-md shadow-fuchsia-950"
                >
                  <RefreshCw size={13} className={isRetraining ? 'animate-spin' : ''} />
                  {isRetraining ? 'Retreinando Modelo no Kubeflow...' : 'Disparar Re-treinamento CI/CD'}
                </button>
              </div>
            </div>

            {/* Slider Control */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Intensidade de Desvio Injetado (Feature Distribution Shift):</span>
                <span className="font-bold text-fuchsia-400">{(driftIntensity * 100).toFixed(0)}% de Distorção</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={driftIntensity}
                onChange={(e) => setDriftIntensity(parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-2xs text-slate-500 font-mono">
                <span>0% (Produção Idêntica ao Treino)</span>
                <span>45% (Limiar de Alerta KS/PSI)</span>
                <span>100% (Drift Severo / Quebra de Modelo)</span>
              </div>
            </div>

            {/* Distribution Graph Visualization Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Baseline vs Current Distribution */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <LineChart size={14} className="text-sky-400" />
                  Distribuição da Feature: <code className="text-sky-300 text-2xs">transaction_amount_norm</code>
                </span>

                <div className="h-44 flex items-end gap-1.5 pt-4 pb-2 px-2 border-b border-slate-800 bg-slate-900/40 rounded-lg">
                  {/* Baseline curve bars */}
                  {[10, 25, 55, 85, 95, 85, 55, 25, 10, 4].map((h, i) => (
                    <div key={`base-${i}`} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full bg-sky-500/40 border border-sky-400/60 rounded-t transition-all"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-3xs font-mono text-slate-600 group-hover:text-slate-300">b{i}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
                  <span className="text-sky-400">■ Baseline (Dataset de Treino - Referência)</span>
                  <span>Média: <strong>{baselineMean.toFixed(1)}</strong> | Desvio: <strong>12.4</strong></span>
                </div>

                <div className="h-44 flex items-end gap-1.5 pt-4 pb-2 px-2 border-b border-slate-800 bg-slate-900/40 rounded-lg">
                  {/* Production shifted bars */}
                  {[10, 25, 55, 85, 95, 85, 55, 25, 10, 4].map((h, i) => {
                    // Shift values rightwards based on drift
                    const shiftOffset = Math.round(driftIntensity * 4);
                    const shiftedIndex = i - shiftOffset;
                    const shiftedHeight = (shiftedIndex >= 0 && shiftedIndex < 10)
                      ? [10, 25, 55, 85, 95, 85, 55, 25, 10, 4][shiftedIndex]
                      : (driftIntensity > 0.6 && i > 6 ? 60 : 4);

                    return (
                      <div key={`prod-${i}`} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div
                          className={`w-full rounded-t transition-all ${
                            isDriftDetected
                              ? 'bg-rose-500/50 border border-rose-400'
                              : 'bg-emerald-500/40 border border-emerald-400/60'
                          }`}
                          style={{ height: `${shiftedHeight}%` }}
                        />
                        <span className="text-3xs font-mono text-slate-600 group-hover:text-slate-300">p{i}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
                  <span className={isDriftDetected ? 'text-rose-400' : 'text-emerald-400'}>
                    ■ Produção Atual (Janela Deslizante 7 Dias)
                  </span>
                  <span>Média: <strong>{currentMean.toFixed(1)}</strong> | Δ Média: <strong className={isDriftDetected ? 'text-rose-400' : 'text-emerald-400'}>+{(driftIntensity * 24.5).toFixed(1)}</strong></span>
                </div>
              </div>

              {/* Statistical Tests Output Card */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" />
                    Diagnóstico Estatístico de Produção (Evidently AI / KS-Test)
                  </span>

                  {/* KS-Test Status Box */}
                  <div className={`p-3.5 rounded-lg border ${
                    isDriftDetected
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold">Kolmogorov-Smirnov (KS-Test):</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isDriftDetected ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isDriftDetected ? 'DRIFT DETECTADO (p < 0.05)' : 'NORMAL / NO DRIFT'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-2xs font-mono text-slate-300">
                      <div>KS-Statistic: <strong className="text-white">{ksStatistic}</strong></div>
                      <div>p-value: <strong className={isDriftDetected ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{ksPValue}</strong></div>
                    </div>
                  </div>

                  {/* PSI Status Box */}
                  <div className={`p-3.5 rounded-lg border ${
                    parseFloat(psiValue) > 0.2
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                      : parseFloat(psiValue) > 0.1
                      ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold">Population Stability Index (PSI):</span>
                      <span className="font-bold font-mono text-white">{psiValue}</span>
                    </div>
                    <p className="text-2xs text-slate-400 mt-1.5 leading-snug font-mono">
                      {parseFloat(psiValue) < 0.1 && 'PSI < 0.1: Mudança insignificante. Modelo seguro em produção.'}
                      {parseFloat(psiValue) >= 0.1 && parseFloat(psiValue) <= 0.2 && '0.1 ≤ PSI ≤ 0.2: Mudança moderada. Monitorar com frequência elevada.'}
                      {parseFloat(psiValue) > 0.2 && 'PSI > 0.2: Mudança significativa de população! Re-treinamento obrigatório.'}
                    </p>
                  </div>
                </div>

                {/* Retrain Stats footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-2xs font-mono text-slate-400">
                  <span>Re-treinos automáticos executados: <strong className="text-fuchsia-400">{retrainCount}</strong></span>
                  <span className="text-slate-500">Pipeline: Argo Workflows / Kubeflow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: METRICS & THRESHOLD LAB */}
      {activeTab === 'metrics-lab' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders size={18} className="text-fuchsia-400" />
                Simulador de Threshold de Decisão, Matriz de Confusão & Trade-off Precision/Recall
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ajuste o limiar de classificação (Decision Threshold) e veja em tempo real o impacto em Falsos Positivos, Falsos Negativos, F1-Score e Acurácia em um problema de detecção de anomalias (1.000 amostras).
              </p>
            </div>

            {/* Threshold Slider */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Limiar de Classificação (Threshold τ):</span>
                <span className="font-bold text-fuchsia-400 text-sm">τ = {threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-2xs text-slate-500 font-mono">
                <span>0.05 (Alta Sensibilidade / Alto Recall / Muitos Falsos Positivos)</span>
                <span>0.50 (Padrão)</span>
                <span>0.95 (Alta Especificidade / Alta Precisão / Muitos Falsos Negativos)</span>
              </div>
            </div>

            {/* Matrix and Metrics Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Confusion Matrix Visual */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">Matriz de Confusão 2x2 (N = 1.000)</span>
                  <span className="text-2xs font-mono text-slate-500">150 Positivos · 850 Negativos</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-center font-mono">
                  {/* True Positive */}
                  <div className="bg-emerald-950/40 border border-emerald-500/50 p-3.5 rounded-lg space-y-1">
                    <span className="text-2xs text-emerald-400 font-bold block">True Positive (TP)</span>
                    <span className="text-xl font-bold text-white">{metrics.tp}</span>
                    <span className="text-3xs text-slate-400 block">Fraudes detectadas com sucesso</span>
                  </div>

                  {/* False Positive */}
                  <div className="bg-amber-950/40 border border-amber-500/50 p-3.5 rounded-lg space-y-1">
                    <span className="text-2xs text-amber-400 font-bold block">False Positive (FP) - Tipo I</span>
                    <span className="text-xl font-bold text-white">{metrics.fp}</span>
                    <span className="text-3xs text-slate-400 block">Clientes normais bloqueados (Falso Alarme)</span>
                  </div>

                  {/* False Negative */}
                  <div className="bg-rose-950/40 border border-rose-500/50 p-3.5 rounded-lg space-y-1">
                    <span className="text-2xs text-rose-400 font-bold block">False Negative (FN) - Tipo II</span>
                    <span className="text-xl font-bold text-white">{metrics.fn}</span>
                    <span className="text-3xs text-slate-400 block">Fraudes que escaparam do modelo (Crítico!)</span>
                  </div>

                  {/* True Negative */}
                  <div className="bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
                    <span className="text-2xs text-sky-400 font-bold block">True Negative (TN)</span>
                    <span className="text-xl font-bold text-white">{metrics.tn}</span>
                    <span className="text-3xs text-slate-400 block">Clientes normais aprovados corretamente</span>
                  </div>
                </div>
              </div>

              {/* Calculated Metrics Dashboard */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-4">
                <span className="text-xs font-mono font-bold text-slate-200">Métricas Derivadas de Performance</span>

                <div className="space-y-3 font-mono">
                  {/* Precision */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Precision (Precisão: TP / (TP + FP)):</span>
                      <strong className="text-sky-400">{(metrics.precision * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${metrics.precision * 100}%` }} />
                    </div>
                  </div>

                  {/* Recall */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Recall / Sensibilidade (TP / (TP + FN)):</span>
                      <strong className="text-emerald-400">{(metrics.recall * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${metrics.recall * 100}%` }} />
                    </div>
                  </div>

                  {/* F1 Score */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">F1-Score (Média Harmônica):</span>
                      <strong className="text-fuchsia-400">{(metrics.f1 * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-fuchsia-500 transition-all duration-300" style={{ width: `${metrics.f1 * 100}%` }} />
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Acurácia Global:</span>
                      <strong className="text-amber-400">{(metrics.accuracy * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${metrics.accuracy * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-2xs text-slate-400 leading-relaxed font-mono">
                  💡 <strong>Insight Operacional:</strong> Em cenários de cibersegurança e fraudes, perder um ataque (Falso Negativo) custa muito mais caro que investigar um alarme falso (Falso Positivo). Por isso, costuma-se calibrar o threshold para baixo (ex: τ = 0.20-0.35) visando maximizar o Recall.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MLOPS STACK */}
      {activeTab === 'mlops-stack' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Box size={18} className="text-fuchsia-400" />
                Matriz de Arquitetura da Stack MLOps Corporativa
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparativo de papéis e responsabilidades das ferramentas que compõem o ecossistema de produção.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'MLflow',
                  role: 'Tracking, Artifacts & Registry',
                  layer: 'Experimentos & Governança',
                  color: 'sky',
                  highlights: ['Registro de hiperparâmetros & métricas', 'Model Signatures tipadas', 'Transição Staging → Production']
                },
                {
                  title: 'Feast / Tecton',
                  role: 'Feature Store Platform',
                  layer: 'Dados & Ingestão',
                  color: 'emerald',
                  highlights: ['Point-in-time correctness', 'Online Store (Redis) < 5ms', 'Elimina Training-Serving Skew']
                },
                {
                  title: 'Kubeflow / Argo',
                  role: 'Pipeline Orchestration on K8s',
                  layer: 'Computação & Automação',
                  color: 'fuchsia',
                  highlights: ['Steps isolados em containers Docker', 'Alocação dinâmica de GPUs', 'DAGs reprodutíveis']
                },
                {
                  title: 'Triton / vLLM',
                  role: 'High-Performance Model Serving',
                  layer: 'Inferência & Produção',
                  color: 'orange',
                  highlights: ['Dynamic Batching para GPUs', 'Suporte a TensorRT & ONNX', 'PagedAttention para LLMs']
                },
                {
                  title: 'Evidently AI / WhyLabs',
                  role: 'Drift Detection & Data Quality',
                  layer: 'Observabilidade & Alertas',
                  color: 'rose',
                  highlights: ['Testes KS e PSI contínuos', 'Monitoramento de Data & Concept Drift', 'Geração de relatórios HTML']
                },
                {
                  title: 'Seldon Core / KServe',
                  role: 'Cloud-Native Inference & Routing',
                  layer: 'Deployment & Tráfego',
                  color: 'amber',
                  highlights: ['Canary & Shadow Traffic Mirroring', 'Explaining (SHAP/LIME integrados)', 'Auto-scaling com KEDA (RPS/GPU)']
                }
              ].map((tool) => (
                <div key={tool.title} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{tool.title}</span>
                    <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tool.layer}
                    </span>
                  </div>
                  <p className="text-xs text-fuchsia-300 font-mono">{tool.role}</p>
                  <ul className="space-y-1 text-2xs text-slate-400 font-mono">
                    {tool.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-fuchsia-400">▹</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CODE BLUEPRINTS */}
      {activeTab === 'code-blueprints' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal size={18} className="text-fuchsia-400" />
                Blueprints Python de Produção (MLflow, Evidently & FastAPI Serving)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Códigos de referência prontos para implementar rastreamento, cálculo de drift e microserviços de inferência.
              </p>
            </div>

            {/* Snippet 1: MLflow Tracking */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">1. MLflow Tracking, Model Signature & Logging</span>
                <button
                  onClick={() => copyToClipboard(MLFLOW_CODE, 'mlflow')}
                  className="flex items-center gap-1.5 text-2xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded border border-slate-700"
                >
                  {copiedCode === 'mlflow' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCode === 'mlflow' ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                {MLFLOW_CODE}
              </pre>
            </div>

            {/* Snippet 2: Evidently Drift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">2. Evidently AI Data Drift & PSI Detection Pipeline</span>
                <button
                  onClick={() => copyToClipboard(EVIDENTLY_CODE, 'evidently')}
                  className="flex items-center gap-1.5 text-2xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded border border-slate-700"
                >
                  {copiedCode === 'evidently' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCode === 'evidently' ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                {EVIDENTLY_CODE}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MLFLOW_CODE = `import mlflow
import mlflow.sklearn
from mlflow.models.signature import infer_signature
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, roc_auc_score

mlflow.set_tracking_uri("http://mlflow-server.mlops.svc.cluster.local:5000")
mlflow.set_experiment("fraud-detection-production")

with mlflow.start_run(run_name="rf-tuned-v2.1") as run:
    params = {"n_estimators": 200, "max_depth": 12, "random_state": 42}
    mlflow.log_params(params)

    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    preds = model.predict(X_val)
    probs = model.predict_proba(X_val)[:, 1]

    f1 = f1_score(y_val, preds)
    auc = roc_auc_score(y_val, probs)
    mlflow.log_metrics({"val_f1": f1, "val_roc_auc": auc})

    # Model Signature garante validação estrita no deploy
    signature = infer_signature(X_train, preds)

    mlflow.sklearn.log_model(
        sk_model=model,
        artifact_path="model",
        signature=signature,
        registered_model_name="FraudDetectionModel"
    )
    print(f"Run ID: {run.info.run_id} - Model registered successfully!")`;

const EVIDENTLY_CODE = `from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, TargetDriftPreset
import pandas as pd

def check_production_drift(reference_df: pd.DataFrame, current_df: pd.DataFrame) -> bool:
    """Executa testes Kolmogorov-Smirnov e PSI em todas as features."""
    report = Report(metrics=[DataDriftPreset()])
    report.run(reference_data=reference_df, current_data=current_df)

    results = report.as_dict()
    dataset_drift = results["metrics"][0]["result"]["dataset_drift"]
    drift_share = results["metrics"][0]["result"]["drift_share"]

    print(f"Data Drift Detectado: {dataset_drift} (Share de features alteradas: {drift_share:.2%})")

    if dataset_drift:
        # Dispara webhook para iniciar re-treinamento no Argo Workflows
        trigger_argo_retrain_pipeline(reason="Statistical Data Drift Exceeded Threshold")
        return True
    return False`;
