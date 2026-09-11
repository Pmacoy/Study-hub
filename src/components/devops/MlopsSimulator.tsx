import { useState } from 'react';
import { Copy, Check, BrainCircuit } from 'lucide-react';

type View = 'basics' | 'pipeline' | 'tools' | 'ai-devops';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-2xs font-mono text-slate-400">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-2xs text-slate-400 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto bg-[#181926]">
        {code.split('\n').map((line, i) => (
          <div key={i} className={
            line.trim().startsWith('#') ? 'text-slate-600'
            : line.startsWith('$') ? 'text-emerald-300'
            : line.match(/^(import|from|def|class|with|return)\b/) ? 'text-violet-400'
            : line.match(/^\s*(apiVersion|kind|metadata|spec|name):/) ? 'text-sky-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const MLFLOW_TRACKING = `# MLflow — experiment tracking
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier

mlflow.set_tracking_uri("http://mlflow.acme.internal:5000")
mlflow.set_experiment("fraud-detection")

with mlflow.start_run(run_name="rf-baseline"):
    # 1. Registar os hiperparâmetros
    n_estimators, max_depth = 100, 12
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_depth", max_depth)

    # 2. Treinar
    model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    model.fit(X_train, y_train)

    # 3. Registar as métricas
    mlflow.log_metric("accuracy", model.score(X_test, y_test))
    mlflow.log_metric("precision", precision)
    mlflow.log_metric("recall", recall)

    # 4. Guardar o modelo como artefacto versionado
    mlflow.sklearn.log_model(model, "model",
        registered_model_name="fraud-detector")

# Cada run fica registado: params + métricas + modelo + código.
# Reproduzir uma experiência deixa de depender de memória.`;

const MLFLOW_REGISTRY = `# Model Registry — promoção entre estágios
$ mlflow models list

# Estágios: None → Staging → Production → Archived
# A promoção é o equivalente ML de um deploy

from mlflow.tracking import MlflowClient
client = MlflowClient()

# Promover a versão 3 para Staging
client.transition_model_version_stage(
    name="fraud-detector",
    version=3,
    stage="Staging"
)

# Depois dos testes passarem, promover para Production
client.transition_model_version_stage(
    name="fraud-detector",
    version=3,
    stage="Production",
    archive_existing_versions=True   # arquiva a anterior
)

# Servir o modelo que está em Production
$ mlflow models serve -m "models:/fraud-detector/Production" -p 5001`;

const DVC_EXAMPLE = `# DVC — Git para dados e modelos
# O Git não aguenta datasets de 50GB. O DVC resolve isso.

$ dvc init
$ dvc remote add -d storage s3://acme-ml-data/dvc

# Versionar um dataset (o ficheiro real vai para o S3,
# o Git guarda só um ponteiro .dvc)
$ dvc add data/transactions.parquet
$ git add data/transactions.parquet.dvc .gitignore
$ git commit -m "dataset v1: transacções Q1 2026"

# Definir um pipeline reproduzível
$ dvc stage add -n prepare \\
    -d src/prepare.py -d data/raw \\
    -o data/prepared \\
    python src/prepare.py

$ dvc stage add -n train \\
    -d src/train.py -d data/prepared \\
    -o models/model.pkl -M metrics.json \\
    python src/train.py

# Correr o pipeline (só re-executa o que mudou)
$ dvc repro

# Comparar métricas entre commits
$ dvc metrics diff main`;

const KUBEFLOW_PIPELINE = `# Kubeflow — pipelines ML no Kubernetes
from kfp import dsl

@dsl.component(base_image="python:3.11")
def preprocess(input_path: str, output_path: str):
    import pandas as pd
    df = pd.read_parquet(input_path)
    df = df.dropna().drop_duplicates()
    df.to_parquet(output_path)

@dsl.component(base_image="acme/ml-train:1.2.0")
def train(data_path: str, model_path: str, epochs: int):
    # treino aqui
    ...

@dsl.pipeline(name="fraud-detection-pipeline")
def fraud_pipeline(raw_data: str = "s3://acme-ml-data/raw"):
    prep = preprocess(input_path=raw_data, output_path="/tmp/prep")
    tr = train(data_path=prep.output, model_path="/tmp/model", epochs=50)

    # Recursos como qualquer workload Kubernetes
    tr.set_cpu_limit("4").set_memory_limit("16Gi")
    tr.set_accelerator_type("nvidia.com/gpu").set_accelerator_limit(1)

# Cada step é um pod. O Kubeflow orquestra, faz retry,
# guarda artefactos e mostra o DAG na UI.`;

const DRIFT_MONITORING = `# Model monitoring — detectar drift em produção
# Um modelo não "parte" como uma app. Degrada-se em silêncio.

# 1. DATA DRIFT — a distribuição dos inputs mudou
#    Ex: a idade média dos clientes passou de 34 para 48
from scipy.stats import ks_2samp

def detect_data_drift(reference, current, threshold=0.05):
    """Kolmogorov-Smirnov: as duas amostras vêm da mesma distribuição?"""
    stat, p_value = ks_2samp(reference, current)
    return {"drift": p_value < threshold, "p_value": p_value}

# 2. CONCEPT DRIFT — a relação input→output mudou
#    Ex: o padrão de fraude mudou; as features continuam iguais
#    mas já não predizem o mesmo

# 3. PREDICTION DRIFT — a distribuição das previsões mudou
#    Ex: o modelo passou a classificar 40% como fraude (era 2%)

# Métricas Prometheus para o modelo em produção
model_prediction_latency_seconds
model_predictions_total{class="fraud"}
model_feature_drift_score{feature="transaction_amount"}
model_accuracy_rolling_7d

# Alerta típico:
# - drift_score > 0.3 durante 1h → notificar equipa de ML
# - accuracy_rolling_7d < baseline - 5% → considerar retraining`;

const CICD_ML = `# CI/CD para modelos ML — o que muda vs software normal
name: ml-pipeline
on:
  push:
    paths: ['src/**', 'data/**.dvc']

jobs:
  train-and-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 1. Puxar os dados versionados (não estão no Git)
      - name: Pull data
        run: dvc pull

      # 2. Validar o schema dos dados ANTES de treinar
      - name: Validate data
        run: python src/validate_schema.py

      # 3. Treinar
      - name: Train
        run: dvc repro

      # 4. Gate de qualidade — não promove se piorar
      - name: Evaluate
        run: |
          python src/evaluate.py --min-accuracy 0.92 \\
                                 --max-latency-ms 50

      # 5. Registar no model registry (só se passar)
      - name: Register model
        run: python src/register.py --stage Staging

# Diferenças-chave vs CI/CD normal:
#   · Os dados também são um input versionado
#   · O gate é estatístico (accuracy), não binário (testes passam)
#   · O artefacto é um modelo, não um container
#   · "Funciona" é relativo à distribuição dos dados de treino`;

export default function MlopsSimulator() {
  const [view, setView] = useState<View>('basics');

  const tabs: { id: View; label: string }[] = [
    { id: 'basics',     label: 'ML para DevOps' },
    { id: 'pipeline',   label: 'Pipeline MLOps' },
    { id: 'tools',      label: 'Ferramentas' },
    { id: 'ai-devops',  label: 'AI no DevOps' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-5">
        <div className="flex items-center gap-3">
          <BrainCircuit size={22} className="text-violet-400" />
          <div>
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest">Foco 2026</div>
            <h2 className="text-lg font-bold text-white">MLOps & AI para DevOps</h2>
          </div>
        </div>
        <p className="mt-3 text-base text-slate-400 leading-relaxed">
          Sistemas de ML precisam de disciplina DevOps — mas o modelo mental é diferente.
          Aqui o artefacto não é um container, é um <strong className="text-slate-300">modelo treinado</strong> cujo
          comportamento depende de dados que mudam. Este módulo cobre o que um engenheiro de plataforma
          precisa de saber para operar ML em produção.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-sm font-semibold transition-all ${
              view === t.id
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ML para DevOps ──────────────────────────────────── */}
      {view === 'basics' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Os conceitos que mudam tudo</h3>
            <div className="space-y-2">
              {[
                ['Training vs Inference', 'Treino: correr uma vez (ou periodicamente), pesado, GPU, batch. Inferência: correr milhões de vezes, latência crítica, CPU costuma chegar. São workloads com perfis de recursos opostos.'],
                ['Model vs Code', 'O código é determinístico — mesmo input, mesmo output. O modelo é estatístico — o output depende dos dados com que foi treinado. Não se testa com assertEquals.'],
                ['Data vs Dataset', 'Dados brutos são o que chega. O dataset é uma fotografia processada e versionada, usada para treinar uma versão específica do modelo. Reproduzir um treino exige o dataset exacto.'],
                ['Offline vs Online inference', 'Offline (batch): pontuar 10M de clientes de madrugada, escreve para uma tabela. Online (real-time): responder em <50ms a um request. Arquitecturas completamente diferentes.'],
              ].map(([term, desc]) => (
                <div key={term} className="p-3 rounded-xl bg-slate-900">
                  <div className="text-sm font-bold text-violet-300">{term}</div>
                  <div className="text-sm text-slate-400 mt-1 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Porque é que MLOps não é só DevOps</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
                <div className="text-2xs font-black text-sky-400 uppercase tracking-widest mb-2">DevOps clássico</div>
                <ul className="space-y-1.5 text-sm text-slate-400">
                  <li>· Input versionado: <strong className="text-slate-300">código</strong></li>
                  <li>· Testes: passam ou falham</li>
                  <li>· Artefacto: container / binário</li>
                  <li>· Degradação: crash, erro, timeout</li>
                  <li>· Rollback: versão anterior da imagem</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-2">MLOps</div>
                <ul className="space-y-1.5 text-sm text-slate-400">
                  <li>· Input versionado: <strong className="text-slate-300">código + dados + hiperparâmetros</strong></li>
                  <li>· Testes: métricas estatísticas com threshold</li>
                  <li>· Artefacto: modelo treinado + metadados</li>
                  <li>· Degradação: <strong className="text-slate-300">silenciosa</strong> (drift)</li>
                  <li>· Rollback: versão anterior do modelo no registry</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-2xs font-black text-amber-400 uppercase tracking-widest mb-1">A diferença mais importante</div>
            <p className="text-sm text-amber-100 leading-relaxed">
              Uma aplicação partida grita — 500s, alertas, pods em CrashLoop. Um modelo degradado
              continua a responder 200 OK com previsões cada vez piores. É por isso que{' '}
              <strong>monitorizar drift</strong> não é opcional: é a única forma de saber que algo correu mal.
            </p>
          </div>
        </div>
      )}

      {/* ── Pipeline MLOps ──────────────────────────────────── */}
      {view === 'pipeline' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">As etapas do ciclo</h3>
            <div className="space-y-2">
              {[
                ['1. Data ingestion', 'Recolha batch ou streaming. Os dados chegam de bases de dados, eventos, ficheiros.'],
                ['2. Data validation', 'Validar schema e qualidade ANTES de treinar. Dados maus → modelo mau, sem aviso.'],
                ['3. Data versioning', 'Cada treino corresponde a um dataset específico. Sem isto, não há reprodutibilidade.'],
                ['4. Feature pipelines', 'Transformar dados brutos em features. A mesma transformação tem de correr no treino e na inferência.'],
                ['5. Training pipeline', 'Treino automatizado, com hiperparâmetros e métricas registados.'],
                ['6. Model registry', 'Versionar o modelo e promovê-lo entre estágios (Staging → Production).'],
                ['7. Deployment', 'Servir o modelo — endpoint real-time ou job batch.'],
                ['8. Monitoring & drift', 'Vigiar latência, distribuição de inputs e qualidade das previsões.'],
              ].map(([step, desc]) => (
                <div key={step} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-sm font-bold text-violet-300 w-40">{step}</span>
                  <span className="text-sm text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-2">Feature Store — o conceito que evita o bug mais caro</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              O <strong className="text-slate-300">training-serving skew</strong> acontece quando a feature é calculada
              de forma diferente no treino e na inferência. Ex: no treino usas a média dos últimos 30 dias
              calculada em SQL; em produção calculas em Python com uma janela ligeiramente diferente.
              O modelo passa nos testes e falha em produção.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Um feature store centraliza a definição das features. A mesma lógica alimenta o treino (offline)
              e a inferência (online). Elimina esta classe inteira de bugs.
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">Monitorização e drift</h3>
            <Code code={DRIFT_MONITORING} lang="python + promql" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">CI/CD para modelos</h3>
            <Code code={CICD_ML} lang="yaml" />
          </section>
        </div>
      )}

      {/* ── Ferramentas ─────────────────────────────────────── */}
      {view === 'tools' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Quem faz o quê</h3>
            <div className="space-y-2">
              {[
                ['MLflow', 'Experiment tracking + model registry. Regista params, métricas e artefactos de cada treino. É o "git log" das experiências.'],
                ['Kubeflow', 'Orquestração de pipelines ML em Kubernetes. Cada step é um pod. Bom quando já tens K8s e queres escalar treino.'],
                ['DVC', 'Versionamento de dados e pipelines. O Git guarda ponteiros; os dados reais ficam em S3/GCS. Torna treinos reproduzíveis.'],
                ['Feast / Tecton', 'Feature stores. Centralizam a definição de features para treino e inferência.'],
                ['SageMaker / Vertex AI', 'Plataformas geridas (AWS / GCP). Menos controlo, muito menos operação. Boa escolha para equipas pequenas.'],
              ].map(([tool, desc]) => (
                <div key={tool} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-sm font-bold text-violet-300 w-32">{tool}</span>
                  <span className="text-sm text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">MLflow — experiment tracking</h3>
            <Code code={MLFLOW_TRACKING} lang="python" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">MLflow — model registry e promoção</h3>
            <Code code={MLFLOW_REGISTRY} lang="python" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">DVC — versionar dados e pipelines</h3>
            <Code code={DVC_EXAMPLE} lang="bash" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">Kubeflow — pipelines em Kubernetes</h3>
            <Code code={KUBEFLOW_PIPELINE} lang="python" />
          </section>
        </div>
      )}

      {/* ── AI no DevOps ────────────────────────────────────── */}
      {view === 'ai-devops' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">AI aplicada às operações</h3>
            <div className="space-y-2">
              {[
                ['CI/CD assistido por AI', 'Optimização de pipelines (que testes correr para esta mudança), análise automática de falhas (agrupar erros semelhantes, sugerir causa).'],
                ['Análise de logs e traces', 'Detecção de anomalias e reconhecimento de padrões em volumes que nenhum humano lê. Reduz o tempo de "onde é que isto começou?".'],
                ['Autoscaling preditivo', 'Modelos de previsão de carga que escalam antes do pico, em vez de reagir depois. Elimina o cold-start no momento errado.'],
                ['Optimização de custos', 'Análise de padrões de utilização para recomendar right-sizing, reservas e desligamento de recursos idle.'],
              ].map(([topic, desc]) => (
                <div key={topic} className="p-3 rounded-xl bg-slate-900">
                  <div className="text-sm font-bold text-violet-300">{topic}</div>
                  <div className="text-sm text-slate-400 mt-1 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Agentic AI em operações</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Agentes autónomos que executam tarefas com um objectivo, em vez de responderem a um prompt.
              Em DevOps aparecem como agentes de resposta a incidentes, auto-remediação e triggers de pipeline.
            </p>
            <div className="space-y-2">
              {[
                ['Agentes de incidente', 'Detectam, correlacionam e orquestram a resposta inicial. Reúnem contexto antes de acordar o on-call.'],
                ['Auto-remediação', 'Sistemas self-healing: reiniciar um serviço preso, escalar sob pressão, rodar um secret comprometido.'],
                ['Human-in-the-loop', 'Workflows de aprovação. O agente propõe e prepara; a pessoa aprova. Essencial para acções destrutivas.'],
              ].map(([topic, desc]) => (
                <div key={topic} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-sm font-bold text-violet-300 w-36">{topic}</span>
                  <span className="text-sm text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-2">MCP — Model Context Protocol</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Um protocolo aberto que dá a modelos de AI acesso <strong className="text-slate-300">controlado</strong> a
              sistemas externos. Em vez de dar credenciais totais a um agente, defines servidores MCP que expõem
              apenas as operações permitidas, com permissões explícitas.
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                ['Kubernetes via MCP', 'Consultar estado do cluster, ler logs — sem dar kubectl admin ao agente.'],
                ['Git & CI/CD via MCP', 'Abrir PRs, disparar pipelines, com escopo limitado a repositórios específicos.'],
                ['Cloud APIs via MCP', 'Consultar custos, listar recursos, sem permissões de escrita.'],
                ['Fronteiras explícitas', 'Cada servidor MCP define o que expõe. O agente não pode ultrapassar.'],
              ].map(([topic, desc]) => (
                <div key={topic} className="p-3 rounded-xl bg-slate-900">
                  <div className="text-xs font-bold text-slate-200">{topic}</div>
                  <div className="text-xs text-slate-400 mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-1">O papel que emerge</div>
            <p className="text-sm text-violet-100 leading-relaxed">
              À medida que a AI entra nas operações, o engenheiro de plataforma passa a ser
              <strong> dono da plataforma de AI</strong>: define guardrails, garante auditabilidade das acções
              automáticas, e aplica compliance. A questão deixa de ser "a AI substitui-me?" e passa a ser
              "quem opera, governa e audita os sistemas de AI?".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
