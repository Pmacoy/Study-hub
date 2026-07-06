import { useState } from 'react';
import { Copy, Check, Route, Zap, ShieldOff, Rocket } from 'lucide-react';

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
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : /^(apiVersion|kind|metadata|spec|parameters|steps):/.test(line.trim()) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

// Interactive scaffolder — user picks options, we generate a preview of the outcome
function InteractiveScaffolder() {
  const [name, setName] = useState('order-service');
  const [tier, setTier] = useState<'gold' | 'silver' | 'bronze'>('gold');
  const [lang, setLang] = useState<'typescript' | 'python' | 'go'>('typescript');
  const [db, setDb] = useState(true);

  const tierConfig = {
    gold: { sli: '99.99%', slo: '99.9%', budget: '43min/mês', pipeline: 'canary + auto-rollback' },
    silver: { sli: '99.9%', slo: '99.5%', budget: '3.6h/mês', pipeline: 'blue-green' },
    bronze: { sli: '99.5%', slo: '99%', budget: '7.2h/mês', pipeline: 'rolling update' },
  };

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-slate-950/50 p-4 space-y-4">
      <div className="text-[11px] font-black text-violet-400 uppercase tracking-widest">🎬 Scaffolder — cria um serviço</div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Nome do serviço</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="mt-1 w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-white font-mono focus:border-violet-500/40 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Tier de reliability</label>
          <div className="mt-1 flex gap-1">
            {(['gold', 'silver', 'bronze'] as const).map(t => (
              <button key={t} onClick={() => setTier(t)}
                className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all ${tier === t ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'}`}>
                {t === 'gold' ? '🥇' : t === 'silver' ? '🥈' : '🥉'} {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Linguagem</label>
          <div className="mt-1 flex gap-1">
            {(['typescript', 'python', 'go'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all ${lang === l ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Base de dados?</label>
          <div className="mt-1">
            <button onClick={() => setDb(!db)}
              className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all ${db ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>
              {db ? '✓ PostgreSQL provisionado' : '✗ Sem base de dados'}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800">
        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">O que o platform team cria por ti (em ~90s)</div>
        <div className="space-y-1 font-mono text-[11px] text-slate-400">
          <div>✓ Repo github/acme/{name} (protecções de branch, code owners)</div>
          <div>✓ Pipeline CI/CD ({tierConfig[tier].pipeline}) + secret scanning</div>
          <div>✓ Docker + Helm chart pré-configurado ({lang})</div>
          <div>✓ Namespace K8s + NetworkPolicy + RBAC</div>
          {db && <div>✓ RDS PostgreSQL com credenciais em Vault</div>}
          <div>✓ Dashboard Grafana com Golden Signals</div>
          <div>✓ Alertas PagerDuty (SLO: {tierConfig[tier].slo}, error budget {tierConfig[tier].budget})</div>
          <div>✓ Backstage catalog entry + TechDocs</div>
        </div>
      </div>
    </div>
  );
}

export default function GoldenPathsModule() {
  const [section, setSection] = useState<'what' | 'paved' | 'template' | 'escape'>('what');

  const views = [
    { id: 'what' as const, label: '🛣️ O que são Golden Paths?' },
    { id: 'paved' as const, label: '🎬 Paved Road (demo)' },
    { id: 'template' as const, label: '📄 Template real' },
    { id: 'escape' as const, label: '🚪 Escape hatches' },
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
              <Route size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[15px] font-bold text-violet-300">Golden Path</div>
                <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                  A rota <span className="text-white font-bold">bem-tratada e opinionada</span> para fazer alguma coisa comum na organização. Não é a única maneira de fazer — é a maneira <span className="text-emerald-300 font-bold">mais rápida</span> se seguires as suposições da plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400 italic">
            "The paved road is the path of least resistance, where doing the right thing is easier than doing the wrong thing." — Netflix Engineering blog
          </div>

          <div>
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Golden Paths típicos</div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { i: <Rocket size={14} />, k: 'Criar novo microserviço', v: 'Repo + CI/CD + Helm + observability em 90 segundos' },
                { i: <Zap size={14} />, k: 'Adicionar uma feature flag', v: 'PR pré-preenchido com o SDK certo e testes de exemplo' },
                { i: <Rocket size={14} />, k: 'Provisionar base de dados', v: 'Terraform module, backup, secrets em Vault, alertas' },
                { i: <Zap size={14} />, k: 'Onboard num novo team', v: 'Grupos IdP + acessos + docs + canal Slack criado' },
                { i: <Rocket size={14} />, k: 'Migrar para nova versão K8s', v: 'Playbook + testes automáticos + rollback' },
              ].map(g => (
                <div key={g.k} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0">
                    {g.i}
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-white">{g.k}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{g.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'paved' && <InteractiveScaffolder />}

      {section === 'template' && (
        <div className="space-y-3">
          <div className="text-[11px] text-slate-400">
            Um Backstage Software Template define parâmetros (o que o dev preenche) e steps (o que a plataforma executa). Este é o template real para um microserviço "gold tier":
          </div>
          <Code code={`# template.yaml — Backstage Software Template
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: microservice-gold
  title: Microserviço Gold (99.9% SLO)
  description: Cria microserviço com canary deploy + full observability
  tags: ['recommended', 'nodejs', 'gold-tier']
spec:
  owner: team-platform
  type: service

  parameters:
    - title: Sobre o serviço
      required: [name, description, owner]
      properties:
        name:
          type: string
          pattern: '^[a-z][a-z0-9-]{2,30}$'
          title: Nome (kebab-case)
        owner:
          type: string
          ui:field: OwnerPicker
          ui:options: { allowedKinds: [Group] }
        needsDatabase:
          type: boolean
          title: Usa PostgreSQL?
          default: false

  steps:
    - id: fetch
      name: Fetch skeleton
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: \${{ parameters.name }}
          owner: \${{ parameters.owner }}

    - id: publish
      name: Publish to GitHub
      action: publish:github
      input:
        repoUrl: github.com?owner=acme&repo=\${{ parameters.name }}
        defaultBranch: main
        protectDefaultBranch: true

    - id: register
      name: Register in Backstage
      action: catalog:register
      input:
        repoContentsUrl: \${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml

    - id: provision-db
      name: Provision Database
      if: \${{ parameters.needsDatabase }}
      action: terraform:apply
      input:
        workspace: db-\${{ parameters.name }}

    - id: setup-monitoring
      name: Provision Grafana + PagerDuty
      action: monitoring:create
      input:
        tier: gold
        slo: 99.9`} />
        </div>
      )}

      {section === 'escape' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <ShieldOff size={22} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[15px] font-bold text-amber-300">Escape Hatch</div>
                <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                  O golden path é <span className="text-white font-bold">opcional</span>. Times sofisticados devem poder sair da plataforma quando têm necessidades atípicas — mas com <span className="text-amber-300 font-bold">custos explícitos</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Dentro do golden path', color: 'emerald', items: ['Suporte 24/7 do platform team', 'Upgrades automáticos da infra', 'Compliance auditado', 'Rollback automático'] },
              { title: 'Fora (escape hatch)', color: 'amber', items: ['Team torna-se o próprio ops', 'Sem SLOs garantidos', 'Compliance da própria equipa', 'Sem rollback automático'] },
            ].map(g => (
              <div key={g.title} className={`p-4 rounded-2xl border ${g.color === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                <div className={`text-[11px] font-black uppercase tracking-widest mb-2 ${g.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`}>{g.title}</div>
                {g.items.map((i, idx) => (
                  <div key={idx} className={`text-[11px] py-1 ${g.color === 'emerald' ? 'text-emerald-300/70' : 'text-amber-300/70'}`}>
                    · {i}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400 leading-relaxed">
            <span className="text-violet-300 font-bold">Anti-pattern:</span> tornar a plataforma <em>obrigatória</em>. Se a única forma de fazer deploy é via o portal, os teams sofisticados vão detestar a plataforma. O paved road ganha por ser <em>melhor</em>, não por ser o único caminho.
          </div>
        </div>
      )}
    </div>
  );
}
