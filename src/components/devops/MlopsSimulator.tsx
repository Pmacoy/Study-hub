import { useState } from 'react';
import {
  Copy,
  Check,
  BrainCircuit,
  Bot,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  Database,
  Terminal,
  Share2
} from 'lucide-react';

type View = 'basics' | 'pipeline' | 'agentic-devops' | 'drift-lab' | 'llmops' | 'tools';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-2xs font-mono text-slate-400">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setC(true);
            setTimeout(() => setC(false), 1400);
          }}
          className="flex items-center gap-1 text-2xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          {c ? <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={12} /><span>Copiar</span></>}
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
                : line.match(/^(import|from|def|class|with|return|async|await)\b/)
                ? 'text-violet-400 font-semibold'
                : line.match(/^\s*(apiVersion|kind|metadata|spec|name|steps|jobs):/)
                ? 'text-sky-300 font-semibold'
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

// ── Multi-Agent Simulation Pipeline ──
interface AgentAction {
  id: string;
  agent: 'Planner' | 'BuildTest' | 'Security' | 'Deploy' | 'SreOps';
  color: string;
  tool: string;
  input: string;
  output: string;
  status: 'pending' | 'running' | 'done';
}

const AGENT_PIPELINE_STEPS: AgentAction[] = [
  {
    id: 'step-1',
    agent: 'Planner',
    color: 'sky',
    tool: 'mcp://github/get_issue + vector_rag://architecture_docs',
    input: 'Analisar Issue #842: "Adicionar endpoint de exportação assíncrona para S3 com rate-limiting".',
    output: 'DAG de execução gerado: 1. Scaffold FastAPI endpoint 2. SQS worker 3. Redis token-bucket 4. Helm values update.',
    status: 'pending',
  },
  {
    id: 'step-2',
    agent: 'BuildTest',
    color: 'violet',
    tool: 'mcp://docker/build + pytest --cov=src',
    input: 'Executar compilação do container multi-stage e rodar suite de testes unitários com mock do AWS SQS.',
    output: '✓ 48 testes unitários passaram em 3.2s. Cobertura de código: 94.2%. Imagem gerada: acme/reports:sha-8f92a1.',
    status: 'pending',
  },
  {
    id: 'step-3',
    agent: 'Security',
    color: 'rose',
    tool: 'trivy fs /app + semgrep --config=p/owasp-top-ten',
    input: 'Scan estático de SAST e vulnerabilidades em pacotes npm/pip.',
    output: '✓ 0 CVEs Críticas/Altas encontradas. 0 secrets vazados. Política de segurança em conformidade com PCI-DSS.',
    status: 'pending',
  },
  {
    id: 'step-4',
    agent: 'Deploy',
    color: 'amber',
    tool: 'mcp://argocd/sync_app + kubectl diff',
    input: 'Aplicar Canary Deployment (10% tráfego) via Argo Rollouts no namespace production.',
    output: 'Rollout iniciado: 1 réplica v2 (10%), 9 réplicas v1 (90%). Ingress Envoy configurado com header routing.',
    status: 'pending',
  },
  {
    id: 'step-5',
    agent: 'SreOps',
    color: 'emerald',
    tool: 'prometheus://query_range + vector_db://error_embeddings',
    input: 'Monitorar SLI de latência p99 e taxa de erro 5xx por 5 minutos no Canary.',
    output: 'SLI estável: p99 = 42ms (Target < 200ms), 5xx = 0.00%. Promovendo 100% do tráfego para v2 automaticamente.',
    status: 'pending',
  },
];

export default function MlopsSimulator() {
  const [view, setView] = useState<View>('agentic-devops');

  // Agentic DevOps State
  const [agentStep, setAgentStep] = useState<number>(0);
  const [isRunningAgent, setIsRunningAgent] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [humanApproval, setHumanApproval] = useState<boolean>(false);

  // Drift Simulator State
  const [meanShift, setMeanShift] = useState<number>(0.2); // Desvio da média
  const [varianceShift, setVarianceShift] = useState<number>(1.0); // Mudança de dispersão

  // Cálculo simplificado de KS-Test (Kolmogorov-Smirnov)
  const ksStatistic = Math.min(0.99, Math.abs(meanShift * 0.45) + Math.abs((varianceShift - 1.0) * 0.25));
  const ksPValue = Math.max(0.001, Math.exp(-2 * ksStatistic * ksStatistic * 20));
  const hasDrift = ksPValue < 0.05;

  const runAgentPipeline = () => {
    setIsRunningAgent(true);
    setCompletedSteps([]);
    setAgentStep(0);

    const executeStep = (idx: number) => {
      if (idx >= AGENT_PIPELINE_STEPS.length) {
        setIsRunningAgent(false);
        return;
      }
      setAgentStep(idx);
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, AGENT_PIPELINE_STEPS[idx].id]);
        if (idx === 2 && !humanApproval) {
          // Gate de aprovação humana antes do deploy em prod
          setIsRunningAgent(false);
        } else {
          executeStep(idx + 1);
        }
      }, 1400);
    };

    executeStep(0);
  };

  const resumeAfterHumanApproval = () => {
    setHumanApproval(true);
    setIsRunningAgent(true);
    const executeStep = (idx: number) => {
      if (idx >= AGENT_PIPELINE_STEPS.length) {
        setIsRunningAgent(false);
        return;
      }
      setAgentStep(idx);
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, AGENT_PIPELINE_STEPS[idx].id]);
        executeStep(idx + 1);
      }, 1400);
    };
    executeStep(3);
  };

  const tabs: { id: View; label: string; icon: any }[] = [
    { id: 'agentic-devops', label: 'Agentic AI DevOps Copilot', icon: Bot },
    { id: 'drift-lab', label: 'Data & Model Drift Lab', icon: Zap },
    { id: 'llmops', label: 'LLMOps & RAG Platform', icon: Database },
    { id: 'basics', label: 'Fundamentos MLOps', icon: BrainCircuit },
    { id: 'pipeline', label: 'Pipeline Tradicional', icon: Layers },
    { id: 'tools', label: 'Stack de Ferramentas', icon: Terminal },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-violet-400">
              <BrainCircuit size={24} />
            </div>
            <div>
              <div className="text-2xs font-black text-violet-400 uppercase tracking-widest">Fase 5 · AI Engineering</div>
              <h2 className="text-xl font-bold text-white">MLOps, LLMOps & Autonomous AI Agents</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Agentic CI/CD Blueprint 2026
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-4xl">
          A união entre Inteligência Artificial e Engenharia de Plataforma. Abarca a governança do ciclo de vida de modelos preditivos (MLOps), infraestrutura para LLMs e RAG em escala empresarial (LLMOps) e orquestração de Agentes Autónomos Multi-Especialistas em pipelines de CI/CD.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              view === t.id
                ? 'border border-violet-500/40 bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 1. Agentic AI DevOps Copilot ─────────────────────── */}
      {view === 'agentic-devops' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Bot size={22} className="text-violet-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Arquitetura de Agentes Autónomos para DevOps</h3>
                  <p className="text-xs text-slate-400">Blueprint multi-agente: Planeador, Testes, Segurança, Deploy e Operações SRE coordenados via MCP.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={runAgentPipeline}
                  disabled={isRunningAgent}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isRunningAgent
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'
                  }`}
                >
                  <Play size={14} fill="currentColor" />
                  {isRunningAgent ? 'Executando Orquestração...' : 'Disparar Pipeline Autónomo'}
                </button>
              </div>
            </div>

            {/* Visual Multi-Agent Architecture Diagram */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
              {[
                { name: '1. Planner Agent', role: 'Decomposição DAG & RAG', color: 'sky' },
                { name: '2. Build & Test', role: 'Docker & Auto-Healing Tests', color: 'violet' },
                { name: '3. Security Guard', role: 'SAST, Secrets & SBOM', color: 'rose' },
                { name: '4. Deploy Agent', role: 'ArgoCD & Canary Rollout', color: 'amber' },
                { name: '5. SRE Ops Agent', role: 'SLO Monitor & Auto-Promote', color: 'emerald' },
              ].map((ag, i) => (
                <div
                  key={ag.name}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    agentStep === i && isRunningAgent
                      ? 'border-violet-500 bg-violet-500/20 ring-2 ring-violet-500/50 scale-105'
                      : completedSteps.includes(AGENT_PIPELINE_STEPS[i].id)
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{ag.name}</div>
                  <div className="text-2xs text-slate-400 mt-1">{ag.role}</div>
                </div>
              ))}
            </div>

            {/* Execution Trace Cards */}
            <div className="space-y-3">
              {AGENT_PIPELINE_STEPS.map((step, idx) => {
                const isDone = completedSteps.includes(step.id);
                const isCurrent = agentStep === idx && isRunningAgent;

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-violet-500/60 bg-violet-500/10'
                        : isDone
                        ? 'border-emerald-500/30 bg-slate-950'
                        : 'border-slate-800/60 bg-slate-950/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-violet-500 animate-ping" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-800" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">Agente {step.agent}</span>
                        <span className="text-2xs font-mono text-violet-300 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                          {step.tool}
                        </span>
                      </div>
                      <span className="text-2xs font-mono text-slate-400">
                        {isDone ? 'Concluído' : isCurrent ? 'Executando...' : 'Pendente'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 mb-1">
                      <strong className="text-slate-400 font-mono">Input:</strong> {step.input}
                    </div>

                    {isDone && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-2xs text-emerald-300 leading-relaxed mt-2">
                        {step.output}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Human in the Loop Gate */}
            {completedSteps.length === 3 && !humanApproval && (
              <div className="mt-4 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-amber-300">Human-in-the-Loop Gate Obrigatório</div>
                    <div className="text-2xs text-slate-300">
                      Os testes e scans de segurança foram aprovados. Autorizar início do Canary Rollout em Produção?
                    </div>
                  </div>
                </div>
                <button
                  onClick={resumeAfterHumanApproval}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Aprovar & Prosseguir para Canary Rollout
                </button>
              </div>
            )}
          </div>

          <Code
            lang="json (MCP Protocol Server Definition - Kubernetes & SRE Agent)"
            code={`{
  "mcpServers": {
    "kubernetes-operator": {
      "command": "k8s-mcp-server",
      "args": ["--kubeconfig", "/etc/kubernetes/agent-sa.kubeconfig"],
      "env": {
        "ALLOWED_NAMESPACES": "production,staging",
        "PERMITTED_ACTIONS": "get,list,watch,rollout_restart,scale"
      },
      "capabilities": {
        "tools": [
          {
            "name": "get_pod_events",
            "description": "Obtém eventos e logs do pod com CrashLoopBackOff"
          },
          {
            "name": "trigger_canary_rollback",
            "description": "Executa abort imediato do rollout se o SLO for violado"
          }
        ]
      }
    }
  }
}`}
          />
        </div>
      )}

      {/* ── 2. Data & Model Drift Lab ─────────────────────────── */}
      {view === 'drift-lab' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <Zap size={22} className="text-amber-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-white">Laboratório Interativo de Drift (Teste Kolmogorov-Smirnov)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Modelos de ML não lançam exceções quando falham — eles sofrem <strong>Data Drift</strong> (mudança na distribuição dos dados de entrada) ou <strong>Concept Drift</strong> (mudança na relação entrada/saída).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Deslocamento da Média dos Inputs (Mean Shift):</span>
                    <span className="text-amber-400 font-bold">+{meanShift.toFixed(2)} σ</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2.5}
                    step={0.05}
                    value={meanShift}
                    onChange={e => setMeanShift(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Variação de Dispersão / Desvio Padrão:</span>
                    <span className="text-amber-400 font-bold">{varianceShift.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    value={varianceShift}
                    onChange={e => setVarianceShift(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Statistical Metrics Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-2xs text-slate-500 font-mono uppercase">Estatística KS (D-Stat)</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">{ksStatistic.toFixed(3)}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-2xs text-slate-500 font-mono uppercase">p-Value</div>
                  <div className={`text-lg font-mono font-bold mt-1 ${ksPValue < 0.05 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {ksPValue.toFixed(4)}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-2xs text-slate-500 font-mono uppercase">Status de Drift</div>
                  <div className={`text-xs font-bold mt-1.5 ${hasDrift ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {hasDrift ? 'DRIFT DETECTADO (p < 0.05)' : 'Distribuição Estável ✓'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-2xs text-slate-500 font-mono uppercase">Ação Automatizada</div>
                  <div className="text-2xs font-semibold text-slate-300 mt-1.5">
                    {hasDrift ? 'Trigger: Kubeflow Retraining Job' : 'Manter Modelo em Produção'}
                  </div>
                </div>
              </div>
            </div>

            <Code
              lang="python (Evidently AI / Scipy Data Drift Detection Service)"
              code={`from scipy.stats import ks_2samp
import numpy as np

def evaluate_production_feature_drift(baseline_distribution, current_traffic_sample):
    """
    Executa o teste de Kolmogorov-Smirnov bicaudal para validar se
    a amostra de produção atual diverge significativamente do dataset de treino.
    """
    stat, p_value = ks_2samp(baseline_distribution, current_traffic_sample)

    drift_detected = p_value < 0.05

    if drift_detected:
        print(f"[ALERTA SRE] Data Drift Crítico detectado! D-Stat={stat:.4f}, p-value={p_value:.4f}")
        # Dispara webhook para orquestrador de MLOps (Airflow/Kubeflow)
        trigger_retraining_pipeline(dataset_snapshot="s3://acme-ml/drift-samples/latest.parquet")

    return {"drift": drift_detected, "p_value": p_value, "d_stat": stat}`}
            />
          </div>
        </div>
      )}

      {/* ── 3. LLMOps & RAG Platform Engineering ────────────── */}
      {view === 'llmops' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <Database size={22} className="text-sky-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-white">Arquitetura de Plataforma para LLMs e RAG</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Operar Modelos de Linguagem em escala requer orquestração de bancos vetoriais, cache semântico, rate limiting de tokens e guardrails de segurança.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5">
                <div className="text-xs font-bold text-sky-400 mb-1">1. Semantic Caching (Redis)</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Evita chamadas redundantes a APIs de LLMs pagas, reduzindo custos em até 70% para queries com similaridade de cosseno &gt; 0.92.
                </p>
                <div className="font-mono text-2xs text-sky-300 bg-slate-950 p-2 rounded">
                  redis-stack: HNSW Index (1536 dim)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
                <div className="text-xs font-bold text-violet-400 mb-1">2. LLM Gateway & Routing</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Roteamento inteligente entre modelos leves (Haiku 4.5) e pesados (Opus 5.5 / Sonnet 5), failover de provedores e token rate-limiting.
                </p>
                <div className="font-mono text-2xs text-violet-300 bg-slate-950 p-2 rounded">
                  LiteLLM / Portkey / Envoy Gateway
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
                <div className="text-xs font-bold text-rose-400 mb-1">3. Guardrails & PII Sanitization</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Sanitização em tempo real contra Prompt Injection, Jailbreaking e vazamento de dados confidenciais (CPF, Cartões, Senhas).
                </p>
                <div className="font-mono text-2xs text-rose-300 bg-slate-950 p-2 rounded">
                  NeMo Guardrails / Llama Guard 3
                </div>
              </div>
            </div>

            <Code
              lang="python (FastAPI RAG Pipeline com Qdrant & Semantic Cache)"
              code={`from fastapi import FastAPI, HTTPException
from qdrant_client import QdrantClient
import redis
import numpy as np

app = FastAPI(title="Enterprise RAG Gateway")
qdrant = QdrantClient(host="qdrant.internal", port=6333)
cache = redis.Redis(host="redis-cache.internal", port=6379)

@app.post("/api/v1/rag/query")
async def process_rag_query(query: str, user_id: str):
    # 1. Obter embedding vetorial da query
    query_vector = generate_embeddings(query)

    # 2. Consultar Cache Semântico no Redis (Similaridade de Cosseno > 0.92)
    cached_response = check_semantic_cache(cache, query_vector, threshold=0.92)
    if cached_response:
        return {"answer": cached_response, "source": "semantic-cache", "cost_saved_usd": 0.015}

    # 3. Busca Vetorial no Qdrant com Filtro de Tenant (Row-Level Security)
    search_results = qdrant.search(
        collection_name="enterprise_docs",
        query_vector=query_vector,
        query_filter={"must": [{"key": "tenant_id", "match": {"value": user_id}}]},
        limit=4
    )

    # 4. Injeção de Contexto & Chamada ao Modelo com Guardrails
    context = "\\n".join([hit.payload["text"] for hit in search_results])
    response = call_claude_with_guardrails(query=query, context=context)

    # 5. Salvar no Cache Semântico
    save_to_semantic_cache(cache, query_vector, response)

    return {"answer": response, "source": "llm-inference"}`}
            />
          </div>
        </div>
      )}

      {/* ── 4. Fundamentos MLOps ──────────────────────────────── */}
      {view === 'basics' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Diferenças Estruturais: DevOps Clássico vs MLOps</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
                <div className="text-2xs font-black text-sky-400 uppercase tracking-widest mb-2">DevOps Tradicional</div>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li>· Input: <strong className="text-slate-300">Código-fonte</strong> (Git)</li>
                  <li>· Validação: Testes unitários/integração determinísticos</li>
                  <li>· Artefato final: Container OCI / Binário compilado</li>
                  <li>· Falhas: Explícitas (500s, Crashes, OOMKilled)</li>
                  <li>· Rollback: Deploy da tag anterior da imagem</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-2">MLOps & AI Ops</div>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li>· Input: <strong className="text-slate-300">Código + Dados + Hiperparâmetros</strong></li>
                  <li>· Validação: Métricas estatísticas (Precision, Recall, ROC-AUC)</li>
                  <li>· Artefato final: Modelo serializado (.onnx, .safetensors) + Model Registry</li>
                  <li>· Falhas: Silenciosas (Data & Concept Drift)</li>
                  <li>· Rollback: Promoção de versão anterior no Model Registry</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── 5. Pipeline Tradicional ──────────────────────────── */}
      {view === 'pipeline' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Feature Stores: Eliminando o Training-Serving Skew</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              O bug mais caro em Machine Learning é o <strong>Training-Serving Skew</strong>: quando a transformação de features é calculada de forma diferente no ambiente de treino (ex: SQL batch em data lake) e no ambiente de inferência (ex: Python/Go real-time na API).
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-emerald-400">Feast / Tecton:</span> Uma única fonte da verdade para features históricas (Offline Store / S3 / BigQuery) e features em tempo real (Online Store / Redis / DynamoDB).
            </div>
          </section>
        </div>
      )}

      {/* ── 6. Ferramentas ───────────────────────────────────── */}
      {view === 'tools' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-sm font-bold text-white mb-2">MLflow — Experiment Tracking & Model Registry</h3>
            <Code
              lang="python"
              code={`import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier

mlflow.set_tracking_uri("http://mlflow.internal:5000")
mlflow.set_experiment("fraud-detection")

with mlflow.start_run(run_name="rf-v2-hyperopt"):
    n_estimators, max_depth = 150, 14
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_depth", max_depth)

    model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    model.fit(X_train, y_train)

    mlflow.log_metric("roc_auc", 0.942)
    mlflow.log_metric("latency_ms", 12.4)

    mlflow.sklearn.log_model(model, "model", registered_model_name="fraud-classifier")`}
            />
          </section>

          <section>
            <h3 className="text-sm font-bold text-white mb-2">DVC — Data Version Control</h3>
            <Code
              lang="bash"
              code={`# Rastreamento de datasets volumosos sem poluir o repositório Git
$ dvc init
$ dvc remote add -d storage s3://acme-mlops-datasets/fraud-v2

# Versionar o dataset
$ dvc add data/transactions.parquet
$ git add data/transactions.parquet.dvc .gitignore
$ git commit -m "feat(data): dataset Q1 2026 com 12M linhas"`}
            />
          </section>
        </div>
      )}
    </div>
  );
}
