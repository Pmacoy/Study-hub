import { useState } from 'react';
import { Copy, Check, Blocks, Users, Package, FileText, GitBranch, Search } from 'lucide-react';

function Code({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-[11px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : /^(apiVersion|kind|metadata|spec|type|owner|lifecycle):/.test(line.trim()) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function IdpBackstageModule() {
  const [section, setSection] = useState<'what' | 'components' | 'backstage' | 'catalog'>('what');
  const [openBenefit, setOpenBenefit] = useState<string | null>(null);

  const views = [
    { id: 'what' as const, label: '🎯 O que é um IDP?' },
    { id: 'components' as const, label: '🧩 Componentes' },
    { id: 'backstage' as const, label: '🏛️ Backstage' },
    { id: 'catalog' as const, label: '📋 Service Catalog' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setSection(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${section === v.id ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {section === 'what' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Blocks size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[15px] font-bold text-violet-300">Internal Developer Platform (IDP)</div>
                <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                  Uma camada de abstracção construída pela equipa Platform que dá aos developers <span className="text-white font-bold">self-service on-demand</span> ao que precisam para entregar software: infra, ambientes, secrets, monitoring, deploys — sem abrir tickets nem ler 20 tutoriais de Kubernetes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Sem IDP', color: 'rose', items: [
                'Dev abre ticket para provisionar RDS',
                'Espera 3 dias por resposta',
                'Copia YAML de outro projecto',
                '"Como é que faço deploy em staging?"',
                'Cada team tem os seus scripts',
                'Kubernetes é a interface',
              ] },
              { title: 'Com IDP', color: 'emerald', items: [
                '$ platform db create --type postgres',
                'RDS pronto em 90 segundos',
                'Template validado + golden path',
                'Backstage: 1 clique para promover',
                'Configuração standardizada em toda a org',
                'Kubernetes fica escondido',
              ] },
            ].map(g => (
              <div key={g.title} className={`p-4 rounded-2xl border ${g.color === 'rose' ? 'border-rose-500/20 bg-rose-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                <div className={`text-[11px] font-black uppercase tracking-widest mb-2 ${g.color === 'rose' ? 'text-rose-400' : 'text-emerald-400'}`}>{g.title}</div>
                {g.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400 py-1">
                    <span className={g.color === 'rose' ? 'text-rose-400 shrink-0' : 'text-emerald-400 shrink-0'}>·</span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-[11px] font-black text-violet-400 uppercase tracking-widest mb-3">Benefícios (State of Platform Engineering 2026)</div>
            <div className="space-y-2">
              {[
                { k: '45% menos burnout', v: 'em equipas com plataforma madura vs equipas sem plataforma' },
                { k: '50% menos cognitive load', v: 'developers focam no produto, não em infra' },
                { k: '3-5× mais rápido', v: 'time-to-first-deploy de um novo dev cai de dias para minutos' },
                { k: '26% maior salário', v: 'Platform Engineers vs DevOps Engineers na América do Norte' },
              ].map(b => (
                <button key={b.k} onClick={() => setOpenBenefit(openBenefit === b.k ? null : b.k)}
                  className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900/50 transition-colors text-left">
                  <span className="text-violet-400 text-[13px] font-black">→</span>
                  <div>
                    <div className="text-[12px] font-bold text-violet-300">{b.k}</div>
                    <div className="text-[10px] text-slate-500">{b.v}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'components' && (
        <div className="space-y-3">
          {[
            { icon: <FileText size={16} />, title: 'Developer Portal', desc: 'Interface única onde o dev vê o que existe, o que é dele, o que pode fazer. Backstage é o standard.' },
            { icon: <Package size={16} />, title: 'Service Catalog', desc: 'Registo de todos os serviços, bibliotecas, APIs e recursos da organização — com dono, docs e SLOs.' },
            { icon: <Blocks size={16} />, title: 'Golden Paths', desc: 'Templates paved-road que criam repos, pipelines e infra pré-configurados. "Novo microserviço" em 1 clique.' },
            { icon: <GitBranch size={16} />, title: 'GitOps Layer', desc: 'ArgoCD ou Flux — o estado desejado vive em Git, o cluster reconcilia automaticamente.' },
            { icon: <Search size={16} />, title: 'Observability', desc: 'Dashboards pré-construídos, alertas standard, logs agregados — o dev não precisa de configurar Prometheus.' },
            { icon: <Users size={16} />, title: 'Identity & Access', desc: 'RBAC uniforme, SSO em tudo, self-service de secrets via Vault ou similares.' },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
                {c.icon}
              </div>
              <div>
                <div className="text-[13px] font-bold text-white">{c.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'backstage' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400 leading-relaxed">
            <span className="text-violet-300 font-bold">Backstage</span> é a plataforma open-source criada pelo Spotify e doada à CNCF. É a "cara" do IDP: dá ao dev um portal com service catalog, TechDocs, templates e plugins.
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Software Catalog', desc: 'Lista todos os serviços, APIs, componentes, com metadata: dono, tier, tech stack' },
              { name: 'TechDocs', desc: 'Docs em Markdown vivem no repo do serviço, Backstage renderiza tudo agregado' },
              { name: 'Software Templates', desc: 'Scaffolder — "Criar novo serviço" gera repo + pipeline + infra em minutos' },
              { name: 'Plugins', desc: '150+ plugins: Kubernetes, ArgoCD, Grafana, PagerDuty, SonarQube, GitHub, Jira...' },
            ].map(f => (
              <div key={f.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[12px] font-bold text-violet-300">{f.name}</div>
                <div className="text-[10px] text-slate-500 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Setup mínimo (Backstage app)</div>
            <Code lang="bash" code={`# Criar novo app Backstage
npx @backstage/create-app@latest --path my-idp

cd my-idp
yarn install
yarn dev

# Backstage arranca em http://localhost:3000
# Frontend + backend + PostgreSQL local

# Adicionar catálogo do teu Git provider
yarn add @backstage/plugin-catalog-backend-module-github`} />
          </div>
        </div>
      )}

      {section === 'catalog' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400 leading-relaxed">
            O <span className="text-violet-300 font-bold">Service Catalog</span> é o coração do IDP. Cada componente é declarado num ficheiro <code className="text-amber-300">catalog-info.yaml</code> dentro do repo — Backstage descobre automaticamente.
          </div>

          <Code code={`# catalog-info.yaml — cheat sheet standard
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: payment-service
  description: Processa pagamentos com Stripe
  annotations:
    github.com/project-slug: acme/payment-service
    backstage.io/techdocs-ref: dir:.
    argocd/app-name: payment-service-prod
    grafana/dashboard-selector: "service=payment-service"
    pagerduty.com/integration-key: KEY_HERE
  tags:
    - typescript
    - payments
    - critical-path
spec:
  type: service           # service | website | library | tool
  lifecycle: production    # experimental | production | deprecated
  owner: team-payments
  system: billing
  providesApis:
    - payment-api-v2
  dependsOn:
    - resource:postgres-payments
    - component:notification-service`} />

          <div className="grid grid-cols-3 gap-3">
            {[
              { k: 'Component', v: 'Um serviço, site ou biblioteca — a unidade básica' },
              { k: 'API', v: 'Contrato (OpenAPI, gRPC, GraphQL) que um Component expõe' },
              { k: 'System', v: 'Agrupa Components que resolvem um problema de negócio' },
              { k: 'Domain', v: 'Área de negócio (Billing, Identity, Fulfillment)' },
              { k: 'Resource', v: 'DB, S3 bucket, message queue — infra usada por Components' },
              { k: 'Group / User', v: 'Team + membros — coluna "owner" de tudo o resto' },
            ].map(e => (
              <div key={e.k} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-bold text-violet-300">{e.k}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{e.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
