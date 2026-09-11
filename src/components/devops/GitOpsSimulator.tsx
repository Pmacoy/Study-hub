import { useState } from 'react';
import { Copy, Check, GitBranch, RotateCw, Shield, Clock, AlertCircle, CheckCircle2, Play, Pause } from 'lucide-react';

function Code({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-400">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-300">
          {c ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-[#181926]">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600'
            : /^(apiVersion|kind|metadata|spec|name|namespace|sourceSpec|syncPolicy):/.test(line.trim()) ? 'text-violet-400'
            : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function GitOpsSimulator() {
  const [section, setSection] = useState<'what' | 'argocd' | 'flux' | 'patterns'>('what');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [syncState, setSyncState] = useState<'synced' | 'OutOfSync' | 'Progressing'>('synced');

  const views = [
    { id: 'what' as const, label: 'O que é GitOps?', icon: GitBranch },
    { id: 'argocd' as const, label: 'Argo CD', icon: Play },
    { id: 'flux' as const, label: 'Flux', icon: RotateCw },
    { id: 'patterns' as const, label: 'Patterns', icon: Shield },
  ];

  const quizQuestions = [
    { q: 'Qual é o princípio fundamental do GitOps?', a: ['O estado do cluster é definido manualmente por um operador', 'O Git é a única source of truth para o estado pretendido', 'Os deploys são feitos diretamente via kubectl apply', 'O pipeline CI/CD faz push direto ao cluster'], correct: 1 },
    { q: 'O que faz o Argo CD "ops watcher"?', a: ['Vigia o Git para mudanças e reposiciona o cluster', 'Monitorea a CPU dos nodes', 'Envia alertas para o Slack', 'Faz backup automático dos etcd'], correct: 0 },
    { q: 'Qual a principal diferença entre Argo CD e Flux?', a: ['Argo CD é only GitLab; Flux é only GitHub', 'Argo CD é push-based; Flux é pull-based', 'Argo CD usa operador Kubernetes (declarativo); Flux é event-driven (Git webhook)', 'Não há diferença — são idênticos'], correct: 2 },
  ];

  const q = quizQuestions[section === 'what' ? 0 : section === 'argocd' ? 1 : section === 'flux' ? 2 : 2];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setSection(v.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${section === v.id ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'border border-slate-800 text-slate-400 hover:text-slate-300'}`}>
            <v.icon size={14} />
            {v.label}
          </button>
        ))}
      </div>

      {/* ── O que é GitOps ── */}
      {section === 'what' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <GitBranch size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">GitOps: O Git é o Source of Truth</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  GitOps inverte o modelo tradicional: em vez de um pipeline fazer push ao cluster, um <span className="text-white font-bold">operador dentro do cluster</span> faz poll ao Git e aplica qualquer diferença. O resultado é <span className="text-violet-300 font-bold">auditable, reversível e consistente</span>.
                </p>
              </div>
            </div>
          </div>

          {/* GitOps vs CI/CD tradicional */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'CI/CD Tradicional', color: 'rose', items: ['Pipeline faz push ao cluster', 'Estado do cluster diverge do Git', 'Diff difícil de ver', 'Operador pode fazer kubectl direto'] },
              { title: 'GitOps', color: 'emerald', items: ['Operador no cluster faz poll ao Git', 'Estado refletido 1:1 no Git', 'PR = histórico de mudanças', 'kubectl direto = anti-pattern'] },
            ].map(g => (
              <div key={g.title} className={`p-4 rounded-2xl border ${g.color === 'rose' ? 'border-rose-500/20 bg-rose-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                <div className={`text-xs font-black uppercase tracking-widest mb-3 ${g.color === 'rose' ? 'text-rose-400' : 'text-emerald-400'}`}>{g.title}</div>
                <ul className="space-y-1.5">
                  {g.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* GitOps flow */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Fluxo GitOps</div>
            <div className="flex items-center justify-between text-xs font-mono">
              {[
                { label: 'Dev push', sub: 'PR → main', color: 'violet' },
                { label: 'Operator', sub: 'Poll Git', color: 'amber' },
                { label: 'Git diff', sub: 'Detecta drift', color: 'emerald' },
                { label: 'Apply', sub: 'kubectl diff', color: 'cyan' },
                { label: 'Report', sub: 'Synced ✓', color: 'violet' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="text-center">
                    <div className={`px-2 py-1 rounded-lg bg-${step.color}-500/10 border border-${step.color}-500/20`}>
                      <div className={`text-${step.color}-300 font-bold`}>{step.label}</div>
                      <div className="text-slate-500">{step.sub}</div>
                    </div>
                  </div>
                  {i < 4 && <span className="text-slate-600">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
            <div className="space-y-2">
              {q.a.map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === q.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === q.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === q.correct ? '✓ Correto!' : `✗ Incorreto — resposta: ${q.a[q.correct]}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Argo CD ── */}
      {section === 'argocd' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Play size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Argo CD — Declarative GitOps</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  O <span className="text-white font-bold">Argo CD</span> é o padrão da indústria. Opera num ciclo de reconciliação: lê o Git, compara com o cluster, e aplica mudanças automaticamente (ou sob confirmação manual).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive sync status */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Estado de Sync — simulação</div>
            <div className="space-y-2">
              {[
                { app: 'myapp-frontend', namespace: 'production', status: 'Synced' as const, health: 'Healthy' as const, recent: '2 min atrás' },
                { app: 'myapp-backend', namespace: 'production', status: syncState as any, health: syncState === 'OutOfSync' ? 'Degraded' : 'Healthy' as const, recent: syncState === 'OutOfSync' ? 'agora' : '5 min atrás' },
                { app: 'myapp-db', namespace: 'data', status: 'Synced' as const, health: 'Healthy' as const, recent: '1h atrás' },
              ].map(app => (
                <div key={app.app} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${app.status === 'synced' ? 'bg-emerald-400' : app.status === 'OutOfSync' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">{app.app}</div>
                      <div className="text-2xs text-slate-500">{app.namespace}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-2xs">
                    <span className={app.status === 'synced' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{app.status}</span>
                    <span className="text-slate-500">{app.recent}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSyncState(syncState === 'synced' ? 'OutOfSync' : 'synced')}
              className="mt-3 text-2xs text-violet-400 hover:text-violet-300 font-mono">
              {syncState === 'synced' ? 'Simular drift (kubectl edit)' : '↩ Simular auto-sync'}
            </button>
          </div>

          <Code code={`apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp-production
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/acme/myapp-helm
    targetRevision: main
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true            # remove recursos removidos do Git
      selfHeal: true         # corrige drift automaticamente
    syncOptions:
    - CreateNamespace=true`} />

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
            <div className="space-y-2">
              {q.a.map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === q.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === q.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === q.correct ? '✓ Correto!' : `✗ Incorreto — resposta: ${q.a[q.correct]}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Flux ── */}
      {section === 'flux' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <RotateCw size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Flux CD — Event-Driven GitOps</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Criado pela <span className="text-white font-bold">Weaveworks</span> e mantido pela CNCF. Diferente do Argo CD, o Flux é <span className="text-violet-300 font-bold">event-driven</span> — reage a webhooks do Git, não a polling. Mais leve, mais integrado com o ecossistema CNCF.
                </p>
              </div>
            </div>
          </div>

          <Code code={`# Flux: ClusterConfig — define qual repo monitorizar
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: GitRepository
metadata:
  name: myapp
  namespace: flux-system
spec:
  interval: 1m0s
  ref:
    branch: main
  url: https://github.com/acme/myapp-helm
---
# Flux: aplica os manifests do repo ao cluster
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: production
  namespace: flux-system
spec:
  interval: 5m0s
  path: ./overlays/production
  prune: true
  sourceRef:
    kind: GitRepository
    name: myapp`} />

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Argo CD', points: ['UI rica e intuitiva', 'Ciclo de reconciliação (poll)', 'Helm + Kustomize', 'Mais pesado'] },
              { title: 'Flux', points: ['Event-driven (webhooks)', 'CNCF-native, mais leve', 'GitOps + multi-tenancy', 'Mais "YAML-only"'] },
            ].map(g => (
              <div key={g.title} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="text-sm font-bold text-white mb-2">{g.title}</div>
                <ul className="space-y-1.5">
                  {g.points.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="mt-1 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
            <div className="space-y-2">
              {q.a.map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === q.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === q.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === q.correct ? '✓ Correto!' : `✗ Incorreto — resposta: ${q.a[q.correct]}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Patterns ── */}
      {section === 'patterns' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Shield size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">GitOps Patterns Avançados</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Padrões que resolvem problemas reais: multi-cluster, multi-tenancy, secrets, e promotion entre ambientes.
                </p>
              </div>
            </div>
          </div>

          {/* Pattern cards */}
          <div className="space-y-3">
            {[
              {
                title: 'Nested Applications (Flux)',
                desc: 'Um app Flux controla outros apps Flux — hierarquia natural por team/namespace.',
                example: 'cluster-app → infra-app → app-foo, app-bar',
              },
              {
                title: 'Image Automation',
                desc: 'Atualiza automaticamente a tag da imagem quando uma nova version é push ao registry.',
                example: 'ImageUpdater → detecta :latest → atualiza Git → triggers deploy',
              },
              {
                title: 'Sealed Secrets / SOPS',
                desc: 'Secrets encriptados no Git. O cluster descriptografa com uma key local.',
                example: 'kubectl -sops decrypt → apply ao namespace',
              },
              {
                title: 'Promotion (Canary → Prod)',
                desc: 'Mesmo Git repo, overlays diferentes. PR para promover de staging para production.',
                example: 'overlays/staging → PR → overlays/production',
              },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="text-sm font-bold text-white">{p.title}</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                <div className="mt-2 text-2xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded inline-block">{p.example}</div>
              </div>
            ))}
          </div>

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">Qual padrão permite promover mudanças de staging para production de forma segura?</p>
            <div className="space-y-2">
              {[
                'Self-heal automático',
                'Promotion via overlays no mesmo Git repo (staging → production)',
                'Delete e recriar o namespace',
                'Fork do repositório',
              ].map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === 1 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === 1 ? '✓ Correto!' : '✗ Incorreto — resposta: B'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
