import { useState } from 'react';
import { GitBranch, Copy, Check } from 'lucide-react';

type View = 'concepts' | 'argocd' | 'flux' | 'patterns';

function Code({ code, lang = 'yaml' }: { code: string; lang?: string }) {
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
            : line.match(/^(apiVersion|kind|metadata|spec|source|destination|syncPolicy):/) ? 'text-sky-300'
            : 'text-slate-300'
          }>{line || '\u00A0'}</div>
        ))}
      </pre>
    </div>
  );
}

const PRINCIPLES = [
  {
    n: 1,
    title: 'Declarativo',
    body: 'O sistema inteiro é descrito de forma declarativa. Não há scripts imperativos a dizer "faz isto, depois aquilo" — há uma descrição do estado desejado.',
  },
  {
    n: 2,
    title: 'Versionado e imutável',
    body: 'O estado desejado vive em Git, com histórico completo. Cada mudança é um commit: quem, quando, porquê, e revertível com um comando.',
  },
  {
    n: 3,
    title: 'Aplicado automaticamente',
    body: 'Um agente no cluster puxa as mudanças aprovadas. Ninguém corre kubectl apply à mão em produção.',
  },
  {
    n: 4,
    title: 'Reconciliado continuamente',
    body: 'O agente compara o estado real com o desejado sem parar, e corrige a divergência. Uma alteração manual é revertida sozinha.',
  },
];

const PUSH_VS_PULL = `# CI/CD tradicional — modelo PUSH

  Pipeline  ──credenciais do cluster──>  Kubernetes
     │
     └─ o pipeline precisa de acesso de escrita ao cluster
     └─ as credenciais vivem no sistema de CI
     └─ o cluster não sabe qual devia ser o seu estado


# GitOps — modelo PULL

  Repositório Git  <──vigia──  Agente (dentro do cluster)
                                    │
                                    └─> aplica no cluster

     └─ o cluster puxa; nada de fora tem credenciais de escrita
     └─ o agente corre dentro do cluster, com RBAC restrito
     └─ o Git é a fonte de verdade, sempre comparável`;

const REPO_STRUCTURE = `# Separar o repositório da aplicação do repositório de config

app-repo/                    # código da aplicação
├── src/
├── Dockerfile
└── .github/workflows/
    └── build.yml            # constrói e publica a imagem
                             # e actualiza a tag no config-repo

config-repo/                 # estado desejado do cluster
├── apps/
│   ├── checkout/
│   │   ├── base/            # manifests comuns
│   │   │   ├── deployment.yaml
│   │   │   └── service.yaml
│   │   └── overlays/
│   │       ├── staging/     # diferenças de staging
│   │       └── production/  # diferenças de produção
│   └── payments/
└── infrastructure/
    ├── ingress-nginx/
    └── cert-manager/

# Porquê separar: um commit de código não deve, por si só,
# alterar produção. A promoção é um commit deliberado no config-repo.`;

const ARGO_APP = `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: checkout-production
  namespace: argocd
spec:
  project: default

  source:
    repoURL: https://github.com/acme/config-repo
    targetRevision: main
    path: apps/checkout/overlays/production

  destination:
    server: https://kubernetes.default.svc
    namespace: production

  syncPolicy:
    automated:
      prune: true       # apaga recursos removidos do Git
      selfHeal: true    # reverte alterações manuais no cluster
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        maxDuration: 3m`;

const ARGO_COMMANDS = `# Instalar
$ kubectl create namespace argocd
$ kubectl apply -n argocd -f \\
    https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Password inicial do admin
$ kubectl -n argocd get secret argocd-initial-admin-secret \\
    -o jsonpath="{.data.password}" | base64 -d

# Aceder à UI
$ kubectl port-forward svc/argocd-server -n argocd 8080:443

# CLI
$ argocd login localhost:8080
$ argocd app list
$ argocd app get checkout-production
$ argocd app sync checkout-production      # sincronizar já
$ argocd app diff checkout-production      # ver a divergência
$ argocd app history checkout-production   # histórico de sincronizações
$ argocd app rollback checkout-production 3`;

const ARGO_STATES = [
  ['Synced', 'O cluster corresponde ao estado no Git', 'emerald'],
  ['OutOfSync', 'Há divergência entre o Git e o cluster', 'amber'],
  ['Healthy', 'Os recursos estão a funcionar como esperado', 'emerald'],
  ['Progressing', 'A mudança está a ser aplicada', 'sky'],
  ['Degraded', 'Os recursos existem mas estão com problemas', 'rose'],
  ['Missing', 'O recurso está no Git mas não existe no cluster', 'rose'],
];

const APP_OF_APPS = `# Padrão App of Apps — uma Application que gere as outras

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/acme/config-repo
    path: argocd-apps          # pasta com as Applications filhas
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

# A pasta argocd-apps/ contém um ficheiro Application por serviço.
# Acrescentar uma aplicação nova = um commit. O ArgoCD trata do resto.
# Um único ponto de entrada gere dezenas de aplicações.`;

const FLUX_BOOTSTRAP = `# Flux — bootstrap directo a partir do Git
$ flux bootstrap github \\
    --owner=acme \\
    --repository=config-repo \\
    --branch=main \\
    --path=clusters/production \\
    --personal

# O bootstrap instala o Flux E commita a sua própria configuração
# no repositório — o Flux passa a gerir-se a si próprio via GitOps.

# Verificar
$ flux check
$ flux get sources git
$ flux get kustomizations
$ flux get helmreleases

# Forçar reconciliação
$ flux reconcile kustomization apps --with-source`;

const FLUX_MANIFESTS = `# GitRepository — de onde vem o estado desejado
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: config-repo
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/acme/config-repo
  ref:
    branch: main

---
# Kustomization — o que aplicar e onde
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: apps
  namespace: flux-system
spec:
  interval: 10m
  path: ./apps/production
  prune: true
  sourceRef:
    kind: GitRepository
    name: config-repo
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: checkout
      namespace: production`;

const ARGO_VS_FLUX = [
  ['Interface', 'UI web completa e madura', 'Sem UI própria (existe uma de terceiros)'],
  ['Modelo mental', 'Application como objecto central', 'Source + Kustomization/HelmRelease'],
  ['Multi-tenancy', 'Projects e RBAC integrados', 'Por namespace, mais leve'],
  ['Instalação', 'kubectl apply do manifest', 'flux bootstrap — auto-gerido via Git'],
  ['Pegada', 'Maior — vários componentes', 'Menor, mais modular'],
  ['Melhor para', 'Equipas que valorizam visibilidade visual', 'Equipas que preferem tudo declarativo'],
];

const IMAGE_UPDATE = `# Como a tag da imagem chega ao config-repo

# 1. O pipeline de CI constrói e publica
$ docker build -t registry.acme.io/checkout:$GIT_SHA .
$ docker push registry.acme.io/checkout:$GIT_SHA

# 2. E actualiza o config-repo (padrão comum em GitHub Actions)
- name: Update image tag
  run: |
    cd config-repo
    yq -i '.images[0].newTag = "'$GIT_SHA'"' \\
      apps/checkout/overlays/staging/kustomization.yaml
    git commit -am "checkout: staging -> $GIT_SHA"
    git push

# 3. O agente GitOps detecta o commit e aplica

# Alternativa: ArgoCD Image Updater ou Flux Image Automation
# vigiam o registry directamente e commitam sozinhos.
# Conveniente para staging; discutível para produção,
# onde a promoção deliberada costuma ser preferível.`;

const PROMOTION = `# Promoção entre ambientes — um commit, não um pipeline

config-repo/apps/checkout/overlays/
├── staging/
│   └── kustomization.yaml     images: [{newTag: abc1234}]
└── production/
    └── kustomization.yaml     images: [{newTag: def5678}]

# Promover staging → produção é copiar a tag:
$ yq -i '.images[0].newTag = "abc1234"' \\
    apps/checkout/overlays/production/kustomization.yaml
$ git commit -am "promote checkout abc1234 to production"
$ git push

# Vantagens deste modelo:
#   · a promoção fica registada num commit com autor e data
#   · o pull request é o gate de aprovação
#   · o rollback é git revert
#   · o histórico do Git é o histórico de deployments`;

const SECRETS = `# Segredos em GitOps — o problema e as soluções

# O problema: o Git é a fonte de verdade, mas não se commitam
# segredos em texto simples. Três abordagens comuns:

# 1. Sealed Secrets — cifra que só o cluster consegue abrir
$ kubeseal --format yaml < secret.yaml > sealed-secret.yaml
#    O sealed-secret.yaml pode ir para o Git em segurança.

# 2. External Secrets Operator — referência, não o valor
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
spec:
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: db-credentials
  data:
    - secretKey: password
      remoteRef:
        key: production/db
        property: password

# 3. SOPS — cifra ficheiros com KMS, suportado nativamente pelo Flux

# Em todos os casos o princípio é o mesmo: o Git guarda
# uma referência ou um valor cifrado, nunca o segredo em claro.`;

const BENEFITS = [
  ['Auditoria completa', 'Cada mudança é um commit com autor, data e revisão. O histórico do Git é o registo de auditoria.'],
  ['Rollback trivial', 'git revert e o agente reconcilia. Sem procurar qual era a versão anterior.'],
  ['Recuperação de desastre', 'Cluster novo apontado ao mesmo repositório reconstrói o estado inteiro.'],
  ['Sem credenciais de cluster no CI', 'O pipeline nunca precisa de acesso de escrita ao Kubernetes.'],
  ['Drift detectado e corrigido', 'Alterações manuais são revertidas automaticamente com selfHeal.'],
];

export default function GitOpsModule() {
  const [view, setView] = useState<View>('concepts');

  const tabs: { id: View; label: string }[] = [
    { id: 'concepts', label: 'Princípios' },
    { id: 'argocd',   label: 'ArgoCD' },
    { id: 'flux',     label: 'Flux' },
    { id: 'patterns', label: 'Padrões' },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-3">
          <GitBranch size={22} className="text-emerald-400" />
          <div>
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Entrega contínua</div>
            <h2 className="text-lg font-bold text-white">GitOps</h2>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
          Usar o Git como fonte única de verdade para o estado desejado da infraestrutura,
          com um agente dentro do cluster a reconciliar continuamente a realidade com essa descrição.
          Muda quem tem credenciais, como se faz rollback, e o que acontece quando alguém mexe no cluster à mão.
        </p>
      </section>

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

      {/* ── Princípios ──────────────────────────────────────── */}
      {view === 'concepts' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Os quatro princípios</h3>
            <div className="space-y-2">
              {PRINCIPLES.map(p => (
                <div key={p.n} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black text-emerald-300">
                    {p.n}
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-white">{p.title}</div>
                    <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Push vs Pull — a diferença que importa</h3>
            <Code code={PUSH_VS_PULL} lang="texto" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">O que se ganha</h3>
            <div className="space-y-1.5">
              {BENEFITS.map(([title, body]) => (
                <div key={title} className="p-3 rounded-xl bg-slate-900">
                  <div className="text-[12px] font-semibold text-emerald-300">{title}</div>
                  <p className="text-[11px] text-slate-400 mt-1">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Estrutura de repositórios</h3>
            <Code code={REPO_STRUCTURE} lang="texto" />
          </section>
        </div>
      )}

      {/* ── ArgoCD ──────────────────────────────────────────── */}
      {view === 'argocd' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">A Application — o objecto central</h3>
            <Code code={ARGO_APP} />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">prune e selfHeal</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              <code className="text-amber-300">prune: true</code> apaga do cluster o que for removido do Git —
              poderoso e perigoso, porque um commit errado apaga recursos.
              <code className="text-amber-300"> selfHeal: true</code> reverte alterações manuais, o que é
              exactamente o que queres em produção e frustrante durante uma investigação de incidente.
              Vale a pena saber desligar temporariamente.
            </p>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Estados que vais ver na UI</h3>
            <div className="space-y-1.5">
              {ARGO_STATES.map(([state, meaning, color]) => (
                <div key={state} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <span className={`shrink-0 text-[12px] font-bold text-${color}-300 w-28`}>{state}</span>
                  <span className="text-[11px] text-slate-400">{meaning}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Instalação e CLI</h3>
            <Code code={ARGO_COMMANDS} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-1">Padrão App of Apps</h3>
            <p className="text-[12px] text-slate-500 mb-2">
              Como gerir dezenas de aplicações sem criar cada uma à mão.
            </p>
            <Code code={APP_OF_APPS} />
          </section>
        </div>
      )}

      {/* ── Flux ────────────────────────────────────────────── */}
      {view === 'flux' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Bootstrap</h3>
            <Code code={FLUX_BOOTSTRAP} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Os dois objectos fundamentais</h3>
            <Code code={FLUX_MANIFESTS} />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">ArgoCD vs Flux</h3>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <span>Dimensão</span><span>ArgoCD</span><span>Flux</span>
              </div>
              {ARGO_VS_FLUX.map(([dim, argo, flux]) => (
                <div key={dim} className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 text-[11px]">
                  <span className="text-slate-300 font-medium">{dim}</span>
                  <span className="text-sky-300">{argo}</span>
                  <span className="text-emerald-300">{flux}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              Ambos são projectos graduados da CNCF e ambos funcionam bem. A escolha costuma ser
              cultural: equipas que valorizam uma UI para visibilidade tendem para ArgoCD;
              equipas que querem tudo declarativo e uma pegada menor tendem para Flux.
            </p>
          </section>
        </div>
      )}

      {/* ── Padrões ─────────────────────────────────────────── */}
      {view === 'patterns' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Como a imagem nova chega ao Git</h3>
            <Code code={IMAGE_UPDATE} lang="bash + yaml" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Promoção entre ambientes</h3>
            <Code code={PROMOTION} lang="texto" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Segredos</h3>
            <Code code={SECRETS} />
          </section>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Numa entrevista</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              A pergunta que separa quem leu de quem praticou é: <em>&ldquo;como geres segredos em GitOps,
              se o Git é a fonte de verdade?&rdquo;</em> Responder Sealed Secrets, External Secrets ou SOPS —
              e explicar que o Git guarda uma referência ou um valor cifrado, nunca o segredo em claro —
              mostra que percebeste a tensão real do modelo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
