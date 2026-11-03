import { useState } from 'react';
import {
  Sparkles,
  Search,
  Layers,
  Cpu,
  Database,
  Sliders,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Box,
  BrainCircuit,
  MessageSquare,
  Bot,
  Filter,
  ArrowRight,
  HardDrive
} from 'lucide-react';

type SubTab = 'rag-pipeline' | 'kv-cache-calc' | 'finetuning-lora' | 'react-agent' | 'rag-code';

interface RagStep {
  id: string;
  stepNum: number;
  title: string;
  category: string;
  description: string;
  keyConcepts: string[];
  tradeoffs: string;
}

const RAG_STEPS: RagStep[] = [
  {
    id: 'chunking',
    stepNum: 1,
    title: '1. Document Ingestion & Chunking',
    category: 'Ingestion',
    description: 'Divisão de documentos brutos em pedaços (chunks) preservando contexto semântico. Estratégias como Recursive Character Splitting ou Semantic Chunking com chunk_overlap evitam quebra de conceitos.',
    keyConcepts: ['Chunk Size (ex: 512 tokens)', 'Chunk Overlap (ex: 50-100 tokens)', 'Metadata Enrichment (page_no, author, source_url)'],
    tradeoffs: 'Chunks pequenos = busca precisa mas perda de contexto global. Chunks grandes = muito contexto mas diluição de similaridade vetorial.'
  },
  {
    id: 'embeddings',
    stepNum: 2,
    title: '2. Embedding Generation (Dense Bi-Encoder)',
    category: 'Vectorization',
    description: 'Conversão dos chunks de texto em vetores numéricos de alta dimensão (ex: 768d, 1536d, 3072d) através de modelos de embedding especializados (text-embedding-3, BGE-Large, E5).',
    keyConcepts: ['Cosine Similarity', 'Dot Product', 'L2 Euclidean Distance', 'Dimensionality (1536d)'],
    tradeoffs: 'Modelos maiores capturam nuances sutis mas aumentam latência de inferência e custo de armazenamento vetorial.'
  },
  {
    id: 'indexing',
    stepNum: 3,
    title: '3. Vector Database Indexing (HNSW / IVF)',
    category: 'Storage & Index',
    description: 'Indexação em bancos vetoriais dedicados (Pinecone, Qdrant, Milvus, pgvector). O algoritmo HNSW (Hierarchical Navigable Small World) permite busca de vizinhos mais próximos aproximados (ANN) em O(log N).',
    keyConcepts: ['HNSW (M=16, efConstruction=64)', 'IVF-Flat (Inverted File)', 'Vector Quantization (PQ/SQ)'],
    tradeoffs: 'HNSW consome mais RAM mas entrega < 5ms de latência com alto Recall (>95%). IVF economiza memória com menor recall sob carga.'
  },
  {
    id: 'hybrid-retrieval',
    stepNum: 4,
    title: '4. Hybrid Search (Dense + BM25 Sparse & RRF)',
    category: 'Retrieval',
    description: 'Combinação da busca vetorial densa (semântica) com busca textual esparsa (BM25 / TF-IDF para termos exatos como siglas, números e códigos de erro) unificadas via Reciprocal Rank Fusion (RRF).',
    keyConcepts: ['Dense Semantic Search', 'Sparse BM25 Lexical', 'Reciprocal Rank Fusion: RRF = Σ 1/(k + rank)'],
    tradeoffs: 'Elimina falhas clássicas de RAG puro vetorial que ignora termos técnicos exatos e números de protocolo.'
  },
  {
    id: 'reranking',
    stepNum: 5,
    title: '5. Cross-Encoder Re-ranking',
    category: 'Refinement',
    description: 'Passagem dos Top-K documentos preliminares (ex: Top 25) por um Cross-Encoder (Cohere Rerank, BGE-Reranker-v2) que avalia a relevância profunda par a par (query, chunk), selecionando os Top-3 mais precisos.',
    keyConcepts: ['Cross-Encoder vs Bi-Encoder', 'Lost in the Middle Mitigation', 'Context Window Compression'],
    tradeoffs: 'Adiciona ~20-50ms de latência mas eleva a precisão do contexto em mais de 35%, reduzindo alucinações drasticamente.'
  },
  {
    id: 'generation',
    stepNum: 6,
    title: '6. Prompt Assembly & LLM Generation',
    category: 'Synthesis',
    description: 'Construção do prompt instrucional com os chunks re-ranqueados protegidos por delimitadores estritos XML (`<context>...</context>`) e geração de resposta com citações de fonte auditáveis.',
    keyConcepts: ['System Prompt Anchoring', 'Source Citation Tracking', 'Streaming Token Response'],
    tradeoffs: 'Gera respostas fundamentadas (Grounded) sem necessidade de fine-tuning constante de pesos do modelo.'
  }
];

export default function GenAiSimulator() {
  const [activeTab, setActiveTab] = useState<SubTab>('rag-pipeline');
  const [selectedStep, setSelectedStep] = useState<RagStep>(RAG_STEPS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // KV Cache & Memory Calculator State
  const [modelParamsB, setModelParamsB] = useState<number>(7); // 7B, 13B, 70B
  const [precisionBits, setPrecisionBits] = useState<number>(16); // 16 (FP16), 8 (INT8), 4 (INT4)
  const [contextTokens, setContextTokens] = useState<number>(4096);
  const [concurrencyRPS, setConcurrencyRPS] = useState<number>(4);

  // ReAct Agent Interactive Simulator State
  const [reactQuery, setReactQuery] = useState<string>('Qual o status do servidor SRV-DB01 e a última anomalia detectada?');
  const [reactRunning, setReactRunning] = useState<boolean>(false);
  const [reactStepIndex, setReactStepIndex] = useState<number>(0);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // KV Cache & VRAM Math
  // Model weights (GB) = Params (B) * (bits / 8) * 1.15 (overhead)
  const modelWeightsGB = (modelParamsB * (precisionBits / 8) * 1.12).toFixed(1);
  // KV Cache per token per request = 2 * n_layers * n_kv_heads * head_dim * (precision_bytes)
  // Approx rule of thumb: ~0.5MB to 1MB per 1k context for 7B in FP16, scaling with model layers
  const bytesPerToken = (modelParamsB >= 70 ? 2.5 : modelParamsB >= 13 ? 1.2 : 0.6) * (precisionBits / 16);
  const kvCachePerReqMB = ((contextTokens / 1000) * bytesPerToken * 128).toFixed(0);
  const totalKvCacheGB = ((parseFloat(kvCachePerReqMB) * concurrencyRPS) / 1024).toFixed(2);
  const totalVramNeededGB = (parseFloat(modelWeightsGB) + parseFloat(totalKvCacheGB) + 1.5).toFixed(1);

  // Recommended GPU hardware
  const getRecommendedGpu = (vramGB: number) => {
    if (vramGB <= 15) return '1x NVIDIA RTX 4090 (24GB) ou 1x L4 (24GB)';
    if (vramGB <= 22) return '1x NVIDIA A10G (24GB) ou 1x A5000 (24GB)';
    if (vramGB <= 40) return '1x NVIDIA A100 (40GB) ou 1x L40S (48GB)';
    if (vramGB <= 80) return '1x NVIDIA A100 / H100 (80GB)';
    return '2x a 4x NVIDIA H100 (80GB) com Tensor Parallelism (TP=2 ou TP=4)';
  };

  // ReAct Agent Execution Steps
  const REACT_TRACE = [
    {
      type: 'thought',
      label: 'Thought 1',
      content: 'O usuário quer verificar o status operacional da máquina "SRV-DB01" e checar se há anomalias registradas no monitoramento.'
    },
    {
      type: 'action',
      label: 'Action: Tool Call',
      content: 'server_health_api(server_id="SRV-DB01", include_metrics=True)',
      json: '{\n  "name": "server_health_api",\n  "arguments": {\n    "server_id": "SRV-DB01",\n    "include_metrics": true\n  }\n}'
    },
    {
      type: 'observation',
      label: 'Observation 1',
      content: 'STATUS: OK | CPU: 78% | Memory: 84% | Disk: 62% | Uptime: 48d 12h | Alert: Warning High Disk I/O spike às 03:14 UTC.'
    },
    {
      type: 'thought',
      label: 'Thought 2',
      content: 'O servidor está ONLINE, porém houve um pico de I/O em disco às 03:14 UTC. Devo consultar os logs de incidentes desse horário específico para identificar a causa raiz.'
    },
    {
      type: 'action',
      label: 'Action: Tool Call',
      content: 'query_audit_logs(filter="SRV-DB01", timestamp_start="2026-09-28T03:00:00Z", timestamp_end="2026-09-28T03:30:00Z")',
      json: '{\n  "name": "query_audit_logs",\n  "arguments": {\n    "filter": "SRV-DB01",\n    "time_range": "2026-09-28T03:00:00Z/03:30:00Z"\n  }\n}'
    },
    {
      type: 'observation',
      label: 'Observation 2',
      content: 'LOGS: [03:14:22] Backup CronJob executou pg_dump full snapshot (142GB gravados em /mnt/backup). Nenhuma falha de segurança detectada.'
    },
    {
      type: 'final_answer',
      label: 'Final Answer',
      content: 'O servidor **SRV-DB01** está operacional (UPTIME de 48 dias, CPU em 78% e Memória em 84%). A única anomalia registrada foi um alerta de **High Disk I/O às 03:14 UTC**, causado pela rotina legítima de backup automático (`pg_dump` de 142 GB). Todos os serviços de banco estão saudáveis.'
    }
  ];

  const startReactSimulation = () => {
    setReactRunning(true);
    setReactStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setReactStepIndex(current);
      if (current >= REACT_TRACE.length - 1) {
        clearInterval(interval);
        setReactRunning(false);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BrainCircuit size={18} />
            </div>
            <span className="text-2xs uppercase tracking-wider font-mono font-bold text-indigo-400">
              Generative AI & LLM Systems Engineering
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Advanced RAG, Vector Search, LoRA & ReAct Agents
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Arquitetura de Recuperação Híbrida (Dense + BM25 + Cross-Encoder), dimensionamento de VRAM / KV Cache,
            otimização de parâmetros com LoRA/QLoRA e orquestração de agentes autônomos.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
          <div className="live-dot live-dot-indigo" />
          <span className="text-2xs font-mono text-slate-300">
            Engine: <strong className="text-indigo-400">HYBRID RAG + REACT</strong>
          </span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800/80 pb-px overflow-x-auto">
        {[
          { id: 'rag-pipeline', label: '1. Advanced RAG Architecture (E2E)', icon: Layers },
          { id: 'kv-cache-calc', label: '2. Calculadora de VRAM & KV Cache', icon: HardDrive },
          { id: 'finetuning-lora', label: '3. Fine-Tuning, LoRA & QLoRA', icon: Sliders },
          { id: 'react-agent', label: '4. ReAct Agent Loop Simulator', icon: Bot },
          { id: 'rag-code', label: '5. Python RAG Blueprint (LlamaIndex/vLLM)', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all rounded-t-md whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ADVANCED RAG ARCHITECTURE */}
      {activeTab === 'rag-pipeline' && (
        <div className="space-y-6">
          {/* Step Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {RAG_STEPS.map((step) => {
              const isSelected = selectedStep.id === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-2xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      ETAPA {step.stepNum}
                    </span>
                    <span className="text-2xs text-slate-500 font-mono">{step.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                    {step.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Deep Dive Card */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedStep.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Fase #{selectedStep.stepNum} de 6</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedStep.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedStep.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Key Concepts */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
                  <Zap size={14} />
                  <span>Conceitos Chave & Parâmetros</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedStep.keyConcepts.map((kc, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-indigo-400 shrink-0">▹</span>
                      <span>{kc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trade-offs & Engineering Considerations */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Sliders size={14} />
                  <span>Trade-offs de Engenharia & Performance</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedStep.tradeoffs}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VRAM & KV CACHE CALCULATOR */}
      {activeTab === 'kv-cache-calc' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive size={18} className="text-indigo-400" />
                Calculadora de VRAM para LLMs & Dimensionamento de KV Cache
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Calcule a memória de GPU necessária para carregar os pesos do modelo e suportar o KV Cache sob concorrência simultânea.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Model Size */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <label className="text-xs font-mono text-slate-400 block">Tamanho do Modelo (Parâmetros):</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[7, 13, 70].map((size) => (
                    <button
                      key={size}
                      onClick={() => setModelParamsB(size)}
                      className={`py-2 text-xs font-mono rounded font-bold transition-all border ${
                        modelParamsB === size
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {size}B
                    </button>
                  ))}
                </div>
              </div>

              {/* Precision / Quantization */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <label className="text-xs font-mono text-slate-400 block">Precisão / Quantização:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { bits: 16, label: 'FP16' },
                    { bits: 8, label: 'INT8' },
                    { bits: 4, label: 'INT4' },
                  ].map((p) => (
                    <button
                      key={p.bits}
                      onClick={() => setPrecisionBits(p.bits)}
                      className={`py-2 text-xs font-mono rounded font-bold transition-all border ${
                        precisionBits === p.bits
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Length */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Contexto (Tokens):</span>
                  <span className="font-bold text-white">{contextTokens}</span>
                </div>
                <input
                  type="range"
                  min="1024"
                  max="32768"
                  step="1024"
                  value={contextTokens}
                  onChange={(e) => setContextTokens(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-3xs text-slate-500 font-mono block text-right">1k a 32k tokens</span>
              </div>

              {/* Concurrency / Batch Size */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Requisições Concorrentes:</span>
                  <span className="font-bold text-white">{concurrencyRPS}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  step="1"
                  value={concurrencyRPS}
                  onChange={(e) => setConcurrencyRPS(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-3xs text-slate-500 font-mono block text-right">1 a 32 slots paralelos</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-2xs text-slate-400">VRAM para Pesos do Modelo:</span>
                <div className="text-2xl font-bold text-white">{modelWeightsGB} GB</div>
                <span className="text-3xs text-slate-500">Parâmetros carregados na memória</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-2xs text-slate-400">VRAM para KV Cache ({concurrencyRPS} slots):</span>
                <div className="text-2xl font-bold text-indigo-400">{totalKvCacheGB} GB</div>
                <span className="text-3xs text-slate-500">~{kvCachePerReqMB} MB por requisição ativa</span>
              </div>

              <div className="bg-slate-950/80 border border-indigo-500/40 p-4 rounded-xl space-y-1 shadow-lg shadow-indigo-950/40">
                <span className="text-2xs text-indigo-300 font-bold">VRAM Total Recomendada (com Margem):</span>
                <div className="text-2xl font-bold text-emerald-400">{totalVramNeededGB} GB</div>
                <span className="text-3xs text-slate-400">+1.5GB overhead CUDA / PyTorch</span>
              </div>
            </div>

            {/* Recommended Hardware Card */}
            <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-2xs font-mono text-indigo-300 block font-bold">RECOMENDAÇÃO DE HARDWARE GPU:</span>
                <span className="text-sm font-mono font-bold text-white mt-0.5 block">
                  {getRecommendedGpu(parseFloat(totalVramNeededGB))}
                </span>
              </div>
              <div className="text-right text-2xs font-mono text-slate-400">
                <span>Inference Engine: <strong>vLLM (PagedAttention)</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINETUNING & LORA */}
      {activeTab === 'finetuning-lora' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders size={18} className="text-indigo-400" />
                Matriz Comparativa: Full Fine-Tuning vs LoRA vs QLoRA vs DPO
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Técnicas de adaptação de parâmetros e alinhamento de LLMs para tarefas especializadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Full Fine-Tuning */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">Full Fine-Tuning (FFT)</span>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40">100% Pesos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Atualização de todos os pesos da rede neural ($W$). Exige memória gigantesca para armazenar pesos, gradientes e estados de otimizador (Adam = 8 bytes extras por parâmetro).
                </p>
                <div className="space-y-1 text-2xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <div>VRAM: <strong className="text-white">~16-20x o tamanho dos pesos</strong></div>
                  <div>Risco: <strong className="text-rose-400">Catastrophic Forgetting</strong></div>
                  <div>Custo: <strong className="text-rose-400">Altíssimo (Cluster de GPUs)</strong></div>
                </div>
              </div>

              {/* LoRA */}
              <div className="bg-slate-950/70 border border-indigo-500/40 rounded-xl p-5 space-y-3 shadow-lg shadow-indigo-950/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400">LoRA (Low-Rank Adaptation)</span>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/40">&lt; 1% Pesos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Congela os pesos originais W₀ e injeta matrizes de baixo rank decompostas B × A (r ∈ [8, 64]). O modelo final opera como W = W₀ + (α/r)(B × A).
                </p>
                <div className="space-y-1 text-2xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <div>VRAM: <strong className="text-emerald-400">~3-4x menor que FFT</strong></div>
                  <div>Adapters: <strong className="text-indigo-300">Pequenos (~20-100MB por tarefa)</strong></div>
                  <div>Serviço: <strong className="text-indigo-300">Multi-LoRA Serving em 1 GPU</strong></div>
                </div>
              </div>

              {/* QLoRA */}
              <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">QLoRA (Quantized LoRA)</span>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">4-bit NormalFloat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Quantiza o modelo base congelado para 4-bit (NF4) com Double Quantization e Paged Optimizers, permitindo treinar um modelo de 70B em uma única GPU de 48GB.
                </p>
                <div className="space-y-1 text-2xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <div>VRAM: <strong className="text-emerald-400">Extremamente econômica</strong></div>
                  <div>Inovação: <strong className="text-emerald-300">NF4 Data Type + Paged Optimizers</strong></div>
                  <div>Acessibilidade: <strong className="text-emerald-300">Viável em 1x RTX 4090 / A10G</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REACT AGENT LOOP */}
      {activeTab === 'react-agent' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bot size={18} className="text-indigo-400" />
                  Simulador de Agente Autônomo com Padrão ReAct (Reason + Act)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Observe a execução cíclica: <strong>Thought (Raciocínio) → Action (Chamada de Ferramenta) → Observation (Retorno do Ambiente) → Final Answer</strong>.
                </p>
              </div>

              <button
                onClick={startReactSimulation}
                disabled={reactRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-bold transition-all shadow-md shadow-indigo-950"
              >
                <Play size={14} className={reactRunning ? 'animate-pulse' : ''} />
                {reactRunning ? 'Agente Executando Loop...' : 'Executar Ciclo ReAct'}
              </button>
            </div>

            {/* Prompt Input Box */}
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg flex items-center gap-3">
              <span className="text-2xs font-mono text-slate-400 font-bold shrink-0">User Input:</span>
              <span className="text-xs font-mono text-slate-200">{reactQuery}</span>
            </div>

            {/* Execution Trace Stream */}
            <div className="space-y-3">
              {REACT_TRACE.slice(0, reactRunning ? reactStepIndex + 1 : reactStepIndex === 0 ? 1 : REACT_TRACE.length).map((trace, idx) => {
                let badgeColor = 'bg-slate-800 text-slate-300';
                let borderColor = 'border-slate-800';

                if (trace.type === 'thought') {
                  badgeColor = 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
                  borderColor = 'border-sky-800/40 bg-sky-950/20';
                } else if (trace.type === 'action') {
                  badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                  borderColor = 'border-amber-800/40 bg-amber-950/20';
                } else if (trace.type === 'observation') {
                  badgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
                  borderColor = 'border-emerald-800/40 bg-emerald-950/20';
                } else if (trace.type === 'final_answer') {
                  badgeColor = 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
                  borderColor = 'border-indigo-500/50 bg-indigo-950/30 shadow-lg shadow-indigo-950/30';
                }

                return (
                  <div key={idx} className={`p-4 rounded-xl border ${borderColor} transition-all space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xs font-mono px-2 py-0.5 rounded font-bold ${badgeColor}`}>
                        {trace.label}
                      </span>
                      <span className="text-3xs font-mono text-slate-500">Step {idx + 1}</span>
                    </div>

                    <p className="text-xs text-slate-200 font-mono leading-relaxed">
                      {trace.content}
                    </p>

                    {trace.json && (
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-2xs text-amber-300 overflow-x-auto">
                        {trace.json}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RAG CODE */}
      {activeTab === 'rag-code' && (
        <div className="space-y-6">
          <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-5 md:p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal size={18} className="text-indigo-400" />
                Pipeline Híbrido Completo em Python (LlamaIndex & vLLM)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Implementação de busca densa + BM25 com Reciprocal Rank Fusion e Cross-Encoder Re-ranking.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">hybrid_rag_pipeline.py</span>
                <button
                  onClick={() => copyToClipboard(RAG_CODE, 'rag')}
                  className="flex items-center gap-1.5 text-2xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded border border-slate-700"
                >
                  {copiedCode === 'rag' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCode === 'rag' ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                {RAG_CODE}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const RAG_CODE = `from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.core.retrievers import QueryFusionRetriever
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.llms.vllm import Vllm
import qdrant_client

# 1. Conexão com Qdrant Vector Store
client = qdrant_client.QdrantClient(host="localhost", port=6333)
vector_store = QdrantVectorStore(client=client, collection_name="knowledge_base")
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# 2. Inicialização do Vector Index & BM25 Retriever
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
dense_retriever = index.as_retriever(similarity_top_k=20)
bm25_retriever = BM25Retriever.from_defaults(nodes=index.docstore.docs.values(), similarity_top_k=20)

# 3. Query Fusion com Reciprocal Rank Fusion (RRF)
hybrid_retriever = QueryFusionRetriever(
    [dense_retriever, bm25_retriever],
    similarity_top_k=20,
    num_queries=1,
    mode="reciprocal_rerank"
)

# 4. Cross-Encoder Re-ranker (Cohere ou BGE-Reranker-v2)
reranker = SentenceTransformerRerank(
    model="BAAI/bge-reranker-large",
    top_n=3
)

# 5. Query Engine com LLM local acelerado por vLLM
llm = Vllm(model="meta-llama/Meta-Llama-3-8B-Instruct", tensor_parallel_size=1)

query = "Qual a latência SLA do serviço de autenticação?"
retrieved_nodes = hybrid_retriever.retrieve(query)
reranked_nodes = reranker.postprocess_nodes(retrieved_nodes, query_str=query)

print(f"Top Chunks selecionados após Cross-Encoder: {len(reranked_nodes)}")`;
