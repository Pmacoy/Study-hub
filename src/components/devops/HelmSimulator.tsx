import { useState } from 'react';
import { Copy, Check, Package } from 'lucide-react';

type View = 'overview' | 'commands' | 'chart' | 'production';

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
            : line.match(/^\s*\{\{/) ? 'text-violet-400'
            : line.match(/^(apiVersion|kind|metadata|spec|name|version|type):/) ? 'text-sky-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const BASIC_COMMANDS = `# Verificar instalação
$ helm version
$ helm help

# Repositórios — onde vivem os charts
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm repo update                    # actualizar lista de charts
$ helm repo list                       # ver repos configurados
$ helm search repo nginx               # procurar um chart

# Instalar uma aplicação
$ helm install my-nginx bitnami/nginx
#      ^install  ^release-name  ^chart

# Ver o que está instalado
$ helm list                            # releases no namespace actual
$ helm list -A                         # todos os namespaces
$ kubectl get pods                     # confirmar que os pods arrancaram`;

const LIFECYCLE_COMMANDS = `# Estado e configuração de um release
$ helm status my-nginx                 # estado actual
$ helm get values my-nginx             # valores usados na instalação
$ helm get manifest my-nginx           # YAML final gerado
$ helm history my-nginx                # histórico de revisões

# Actualizar uma aplicação instalada
$ helm upgrade my-nginx bitnami/nginx --set service.type=LoadBalancer

# Upgrade que instala se ainda não existir (idempotente — bom para CI/CD)
$ helm upgrade --install my-nginx bitnami/nginx -f values-prod.yaml

# Rollback para uma revisão anterior
$ helm history my-nginx                # ver revisões disponíveis
$ helm rollback my-nginx 2             # voltar à revisão 2

# Remover
$ helm uninstall my-nginx
$ helm uninstall my-nginx --keep-history   # manter histórico`;

const DEBUG_COMMANDS = `# Validar antes de instalar — SEMPRE
$ helm lint ./my-chart                 # verificar erros no chart

# Simular a instalação sem tocar no cluster
$ helm install --debug --dry-run my-test ./my-chart

# Ver o YAML que seria gerado (sem instalar)
$ helm template my-release ./my-chart

# Ver YAML com valores específicos
$ helm template my-release ./my-chart -f values-prod.yaml

# Diff entre o que está instalado e o que vai ser aplicado
# (precisa do plugin helm-diff)
$ helm plugin install https://github.com/databus23/helm-diff
$ helm diff upgrade my-nginx bitnami/nginx -f values-prod.yaml`;

const CHART_STRUCTURE = `my-chart/
├── Chart.yaml           # metadados: nome, versão, descrição
├── values.yaml          # valores por omissão (configuração)
├── charts/              # dependências (subcharts)
├── templates/           # os manifests com templating
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl     # funções reutilizáveis
│   └── NOTES.txt        # mensagem mostrada após install
└── .helmignore          # ficheiros a ignorar no package

# Criar um chart novo com esta estrutura
$ helm create my-chart`;

const CHART_YAML = `# Chart.yaml — metadados do chart
apiVersion: v2
name: my-app
description: A aplicação de checkout da equipa
type: application

# version: versão do CHART (muda quando mudas templates)
version: 1.2.0

# appVersion: versão da APLICAÇÃO que o chart instala
appVersion: "2.14.0"

dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled`;

const VALUES_YAML = `# values.yaml — configuração por omissão
replicaCount: 2

image:
  repository: registry.acme.internal/my-app
  tag: ""              # vazio → usa .Chart.AppVersion
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"

ingress:
  enabled: false
  host: my-app.acme.com

postgresql:
  enabled: true`;

const TEMPLATE_EXAMPLE = `# templates/deployment.yaml — templating em acção
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "my-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.port }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}

# Objectos built-in disponíveis nos templates:
#   .Values   → o que está em values.yaml
#   .Chart    → metadados do Chart.yaml
#   .Release  → nome, namespace, revisão do release
#   .Capabilities → versão do K8s, APIs disponíveis`;

const MULTI_ENV = `# Um chart, vários ambientes — o padrão que as equipas usam

# values.yaml          → defaults comuns
# values-dev.yaml      → overrides de dev
# values-staging.yaml  → overrides de staging
# values-prod.yaml     → overrides de produção

# values-prod.yaml
replicaCount: 6
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
ingress:
  enabled: true
  host: checkout.acme.com

# Deploy por ambiente
$ helm upgrade --install my-app ./my-chart -f values-dev.yaml     -n dev
$ helm upgrade --install my-app ./my-chart -f values-prod.yaml    -n prod

# Ficheiros somam-se: valores de values-prod sobrepõem-se aos de values.yaml
$ helm upgrade --install my-app ./my-chart -f values.yaml -f values-prod.yaml`;

const PROD_PATTERNS = `# Padrões de produção

# 1. Atomic — se falhar, faz rollback automático
$ helm upgrade --install my-app ./chart --atomic --timeout 5m

# 2. Esperar que os pods fiquem prontos antes de dar OK
$ helm upgrade --install my-app ./chart --wait --timeout 10m

# 3. Fixar a versão do chart (nunca "latest" em produção)
$ helm upgrade --install my-app bitnami/nginx --version 15.4.2

# 4. Empacotar e publicar o teu chart
$ helm package ./my-chart              # gera my-chart-1.2.0.tgz
$ helm push my-chart-1.2.0.tgz oci://registry.acme.internal/charts

# 5. Instalar a partir de um registry OCI
$ helm install my-app oci://registry.acme.internal/charts/my-chart --version 1.2.0

# 6. Em CI/CD (idempotente, seguro)
$ helm upgrade --install my-app ./chart \\
    -f values-prod.yaml \\
    --namespace prod --create-namespace \\
    --atomic --timeout 5m \\
    --set image.tag=$GIT_SHA`;

const HOOKS = `# Hooks — executar coisas em momentos do ciclo de vida
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "my-app.fullname" . }}-migration
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migration
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          command: ["./migrate.sh"]

# Hooks disponíveis:
#   pre-install / post-install
#   pre-upgrade / post-upgrade
#   pre-delete  / post-delete
#   pre-rollback / post-rollback
#   test  (corre com: helm test <release>)

# Caso de uso clássico: migrations de base de dados antes do deploy`;

export default function HelmSimulator() {
  const [view, setView] = useState<View>('overview');

  const tabs: { id: View; label: string }[] = [
    { id: 'overview',   label: 'Fundamentos' },
    { id: 'commands',   label: 'Comandos' },
    { id: 'chart',      label: 'Criar um chart' },
    { id: 'production', label: 'Produção' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-5">
        <div className="flex items-center gap-3">
          <Package size={22} className="text-violet-400" />
          <div>
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest">Kubernetes</div>
            <h2 className="text-lg font-bold text-white">Helm — o gestor de pacotes do Kubernetes</h2>
          </div>
        </div>
        <p className="mt-3 text-base text-slate-400 leading-relaxed">
          O Helm está para o Kubernetes como o <code className="text-violet-300">apt</code> está para o Ubuntu.
          Empacota manifests em <strong className="text-slate-300">charts</strong> parametrizáveis, versionados e reutilizáveis —
          é assim que equipas reais escalam deployments sem copiar YAML entre ambientes.
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

      {/* ── Fundamentos ─────────────────────────────────────── */}
      {view === 'overview' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">O problema que o Helm resolve</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
                <div className="text-2xs font-black text-rose-400 uppercase tracking-widest mb-2">Sem Helm</div>
                <ul className="space-y-1.5 text-sm text-slate-400">
                  <li>· 3 pastas de YAML (dev, staging, prod) quase iguais</li>
                  <li>· Mudar a imagem = editar 3 ficheiros</li>
                  <li>· Rollback = <code className="text-slate-400">git revert</code> + reaplicar à mão</li>
                  <li>· Nenhum conceito de "versão da aplicação instalada"</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="text-2xs font-black text-emerald-400 uppercase tracking-widest mb-2">Com Helm</div>
                <ul className="space-y-1.5 text-sm text-slate-400">
                  <li>· 1 chart + 3 ficheiros de values</li>
                  <li>· Mudar a imagem = <code className="text-emerald-300">--set image.tag=x</code></li>
                  <li>· Rollback = <code className="text-emerald-300">helm rollback app 2</code></li>
                  <li>· Cada install é um <strong className="text-slate-300">release</strong> versionado</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Vocabulário essencial</h3>
            <div className="space-y-2">
              {[
                ['Chart', 'O pacote. Uma pasta com templates + values que descreve uma aplicação Kubernetes.'],
                ['Release', 'Uma instalação de um chart num cluster. O mesmo chart pode ter vários releases (my-app-dev, my-app-prod).'],
                ['Repository', 'Onde os charts vivem. Ex: bitnami, ou um registry OCI privado.'],
                ['Values', 'A configuração. O que parametriza os templates (réplicas, imagem, recursos...).'],
                ['Revision', 'Cada upgrade cria uma revisão nova. É o que permite rollback.'],
              ].map(([term, desc]) => (
                <div key={term} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-sm font-bold text-violet-300 w-24">{term}</span>
                  <span className="text-sm text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Anatomia de um chart</h3>
            <Code code={CHART_STRUCTURE} lang="estrutura" />
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-2xs font-black text-sky-400 uppercase tracking-widest mb-1">Nota de entrevista</div>
            <p className="text-sm text-sky-100 leading-relaxed">
              Uma pergunta frequente: <em>"qual a diferença entre <code>version</code> e <code>appVersion</code> no Chart.yaml?"</em>{' '}
              <code className="text-sky-300">version</code> é a versão do <strong>chart</strong> (muda quando alteras templates);{' '}
              <code className="text-sky-300">appVersion</code> é a versão da <strong>aplicação</strong> que o chart instala.
              São independentes.
            </p>
          </div>
        </div>
      )}

      {/* ── Comandos ────────────────────────────────────────── */}
      {view === 'commands' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-md font-bold text-white mb-2">Instalar e listar</h3>
            <Code code={BASIC_COMMANDS} lang="bash" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">Ciclo de vida: upgrade, rollback, uninstall</h3>
            <Code code={LIFECYCLE_COMMANDS} lang="bash" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">Debugging — validar antes de aplicar</h3>
            <Code code={DEBUG_COMMANDS} lang="bash" />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-2xs font-black text-amber-400 uppercase tracking-widest mb-1">Armadilha comum</div>
            <p className="text-sm text-amber-100 leading-relaxed">
              <code className="text-amber-300">helm upgrade</code> falha se o release não existir.
              Em CI/CD usa sempre <code className="text-amber-300">helm upgrade --install</code> — funciona tanto na primeira
              instalação como nas seguintes, sem lógica condicional no pipeline.
            </p>
          </div>
        </div>
      )}

      {/* ── Criar um chart ──────────────────────────────────── */}
      {view === 'chart' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-md font-bold text-white mb-2">Chart.yaml — os metadados</h3>
            <Code code={CHART_YAML} lang="yaml" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">values.yaml — a configuração</h3>
            <Code code={VALUES_YAML} lang="yaml" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">templates/ — onde acontece a magia</h3>
            <Code code={TEMPLATE_EXAMPLE} lang="yaml + go-template" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">Um chart, vários ambientes</h3>
            <Code code={MULTI_ENV} lang="bash" />
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-2xs font-black text-sky-400 uppercase tracking-widest mb-1">Sobre indentação</div>
            <p className="text-sm text-sky-100 leading-relaxed">
              <code className="text-sky-300">nindent</code> adiciona uma nova linha e indenta;{' '}
              <code className="text-sky-300">indent</code> só indenta. O <code className="text-sky-300">{'{{-'}</code> remove
              espaço em branco antes. Erros de indentação são a causa nº1 de charts que não renderizam —
              por isso <code className="text-sky-300">helm template</code> antes de instalar.
            </p>
          </div>
        </div>
      )}

      {/* ── Produção ────────────────────────────────────────── */}
      {view === 'production' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-md font-bold text-white mb-2">Padrões de produção</h3>
            <Code code={PROD_PATTERNS} lang="bash" />
          </section>

          <section>
            <h3 className="text-md font-bold text-white mb-2">Hooks — migrations e tarefas do ciclo de vida</h3>
            <Code code={HOOKS} lang="yaml" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#181926]/60 p-5">
            <h3 className="text-md font-bold text-white mb-3">Checklist antes de ir para produção</h3>
            <div className="space-y-2">
              {[
                ['Versão do chart fixada', 'Nunca instales sem --version em produção. "latest" muda debaixo dos teus pés.'],
                ['--atomic activado', 'Se o upgrade falhar a meio, faz rollback automático em vez de deixar o release partido.'],
                ['helm lint em CI', 'Apanha erros de sintaxe antes do merge.'],
                ['helm template revisto', 'Vê o YAML final. É o que vai mesmo para o cluster.'],
                ['Values por ambiente', 'Nada de editar o chart para mudar de ambiente — só os values.'],
                ['Secrets fora dos values', 'Usa Vault, Sealed Secrets ou External Secrets. Nunca commits de passwords em values.yaml.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-1">Helm + GitOps</div>
            <p className="text-sm text-violet-100 leading-relaxed">
              Em GitOps (ArgoCD/Flux) não corres <code className="text-violet-300">helm install</code> à mão.
              Declaras o chart e os values num repositório Git, e o ArgoCD faz o rendering e aplica.
              O Helm passa a ser o motor de templating; o Git é a fonte de verdade.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
