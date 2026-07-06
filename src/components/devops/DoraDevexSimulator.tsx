import { useState } from 'react';
import { Copy, Check, Gauge, Brain, Users, TrendingUp } from 'lucide-react';

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
          <div key={i} className={line.trim().startsWith('#') || line.trim().startsWith('//') ? 'text-slate-600' : /^\s*(metric|name|query|target|source):/.test(line) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const DORA_METRICS = [
  {
    name: 'Deployment Frequency',
    icon: '🚀',
    def: 'Com que frequência a equipa faz deploy para produção',
    elite: 'On demand (várias vezes/dia)',
    high: '1x/dia até 1x/semana',
    medium: '1x/semana até 1x/mês',
    low: '1x/mês até 1x/6 meses',
    how: 'Contar deploys em produção — via CI/CD API ou webhook',
  },
  {
    name: 'Lead Time for Changes',
    icon: '⏱️',
    def: 'Tempo entre commit e código em produção',
    elite: '< 1 hora',
    high: '1 dia até 1 semana',
    medium: '1 semana até 1 mês',
    low: '1 mês até 6 meses',
    how: 'Timestamp: 1º commit no PR → deploy em prod',
  },
  {
    name: 'Change Failure Rate',
    icon: '💥',
    def: '% de deploys que causam falha em produção (rollback, hotfix)',
    elite: '0 - 15%',
    high: '16 - 30%',
    medium: '16 - 30%',
    low: '46 - 60%',
    how: 'Deploys que geraram incidente / total deploys × 100',
  },
  {
    name: 'MTTR (Mean Time to Restore)',
    icon: '🔧',
    def: 'Tempo médio para recuperar de um incidente em produção',
    elite: '< 1 hora',
    high: '< 1 dia',
    medium: '1 dia até 1 semana',
    low: '1 semana até 1 mês',
    how: 'Timestamp: incident open → resolved (via PagerDuty / Opsgenie)',
  },
];

export default function DoraDevexSimulator() {
  const [view, setView] = useState<'dora' | 'devex' | 'topologies' | 'space'>('dora');
  const [selectedMetric, setSelectedMetric] = useState<number>(0);

  const views = [
    { id: 'dora' as const, label: 'DORA 4', icon: Gauge },
    { id: 'devex' as const, label: 'Cognitive Load', icon: Brain },
    { id: 'space' as const, label: 'SPACE Framework', icon: TrendingUp },
    { id: 'topologies' as const, label: 'Team Topologies', icon: Users },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[11px] font-semibold transition-all border ${view === v.id ? 'border-violet-500/40 bg-violet-500/15 text-violet-300' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            <v.icon size={12} />{v.label}
          </button>
        ))}
      </div>

      {view === 'dora' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">DORA 4 · o padrão da indústria</div>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              As 4 métricas do <span className="text-violet-300 font-bold">DevOps Research and Assessment</span> (Google Cloud) medem a performance de entrega de software. Depois de 6 anos de estudo e 32.000 respondentes, dividem equipas em 4 níveis: <span className="text-emerald-300 font-bold">Elite</span>, <span className="text-sky-300 font-bold">High</span>, <span className="text-amber-300 font-bold">Medium</span>, <span className="text-rose-300 font-bold">Low</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DORA_METRICS.map((m, i) => (
              <button key={m.name} onClick={() => setSelectedMetric(i)}
                className={`p-3 rounded-2xl border text-left transition-all ${selectedMetric === i ? 'border-violet-500/40 bg-violet-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                <div className="text-2xl">{m.icon}</div>
                <div className="text-[11px] font-bold text-slate-200 mt-1">{m.name}</div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">{DORA_METRICS[selectedMetric].icon}</div>
              <div>
                <div className="text-[13px] font-bold text-white">{DORA_METRICS[selectedMetric].name}</div>
                <div className="text-[11px] text-slate-400 mt-1">{DORA_METRICS[selectedMetric].def}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { level: 'Elite', color: 'emerald', value: DORA_METRICS[selectedMetric].elite },
                { level: 'High', color: 'sky', value: DORA_METRICS[selectedMetric].high },
                { level: 'Medium', color: 'amber', value: DORA_METRICS[selectedMetric].medium },
                { level: 'Low', color: 'rose', value: DORA_METRICS[selectedMetric].low },
              ].map(l => (
                <div key={l.level} className={`p-2.5 rounded-xl border ${
                  l.color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/5' :
                  l.color === 'sky' ? 'border-sky-500/30 bg-sky-500/5' :
                  l.color === 'amber' ? 'border-amber-500/30 bg-amber-500/5' :
                  'border-rose-500/30 bg-rose-500/5'
                }`}>
                  <div className={`text-[10px] font-black uppercase ${
                    l.color === 'emerald' ? 'text-emerald-400' :
                    l.color === 'sky' ? 'text-sky-400' :
                    l.color === 'amber' ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>{l.level}</div>
                  <div className="text-[10px] text-slate-300 mt-1">{l.value}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-black text-amber-400 uppercase mb-1">Como medir</div>
              <div className="text-[11px] text-slate-300">{DORA_METRICS[selectedMetric].how}</div>
            </div>
          </div>

          <Code lang="promql" code={`# Deployment Frequency - Prometheus
sum(increase(deployment_total{env="prod"}[7d]))

# Lead Time - via GitHub Actions API
# timestamp: PR opened → deploy job completed
lead_time_seconds = deploy_end_ts - pr_first_commit_ts

# Change Failure Rate
sum(increase(deployment_failed_total{env="prod"}[30d]))
/ sum(increase(deployment_total{env="prod"}[30d])) * 100

# MTTR - via PagerDuty API
avg(incident_resolved_ts - incident_created_ts)`} />
        </div>
      )}

      {view === 'devex' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Cognitive Load · o inimigo escondido</div>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              <span className="text-violet-300 font-bold">Cognitive Load</span> é o "peso mental" que um developer carrega para fazer o seu trabalho. Se um dev precisa de conhecer 15 ferramentas para fazer deploy, o Platform Engineering falhou. O IDP existe para reduzir isto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                type: 'Intrinsic',
                color: 'sky',
                desc: 'Complexidade natural do problema — algoritmos, domínio de negócio',
                action: 'Não podemos reduzir. É o que o dev deve resolver.',
              },
              {
                type: 'Extraneous',
                color: 'rose',
                desc: 'Complexidade acidental — tooling, YAML, ambientes, CI/CD, permissões',
                action: 'REDUZIR AGRESSIVAMENTE via IDP e golden paths.',
              },
              {
                type: 'Germane',
                color: 'emerald',
                desc: 'Aprendizagem produtiva — patterns, arquitectura, novos frameworks',
                action: 'Investir. Docs, workshops, tempo de exploração.',
              },
            ].map(c => (
              <div key={c.type} className={`p-4 rounded-2xl border ${
                c.color === 'sky' ? 'border-sky-500/30 bg-sky-500/5' :
                c.color === 'rose' ? 'border-rose-500/30 bg-rose-500/5' :
                'border-emerald-500/30 bg-emerald-500/5'
              }`}>
                <div className={`text-[11px] font-black uppercase mb-2 ${
                  c.color === 'sky' ? 'text-sky-400' :
                  c.color === 'rose' ? 'text-rose-400' :
                  'text-emerald-400'
                }`}>{c.type}</div>
                <div className="text-[11px] text-slate-300 leading-relaxed">{c.desc}</div>
                <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-400 italic">{c.action}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold text-amber-400 mb-3">📋 Team Cognitive Load Assessment · Team Topologies</div>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div>Pergunta a cada dev, escala 1-5:</div>
              <ul className="space-y-1 pl-4 text-[11px] text-slate-400">
                <li>1. "Sei quais serviços a minha equipa é dona?"</li>
                <li>2. "Consigo fazer deploy sem pedir ajuda?"</li>
                <li>3. "Percebo como funciona o CI/CD que uso?"</li>
                <li>4. "Sei a quem pedir ajuda para X problema?"</li>
                <li>5. "O tooling está documentado onde eu procuro?"</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-emerald-400 font-bold">Score {'>'}20:</span> <span className="text-slate-400">saudável</span> · <span className="text-amber-400 font-bold">15-20:</span> <span className="text-slate-400">sinal de alerta</span> · <span className="text-rose-400 font-bold">{'<'}15:</span> <span className="text-slate-400">platform team precisa de intervir</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'space' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <p className="text-[13px] text-slate-300 leading-relaxed">
              <span className="text-violet-300 font-bold">SPACE</span> (Microsoft Research + GitHub) é o complemento ao DORA. Enquanto DORA mede o output do sistema, SPACE mede a <span className="text-violet-300 font-bold">experiência do developer</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {[
              { letter: 'S', name: 'Satisfaction', desc: 'Satisfação do dev com ferramentas e processos', ex: 'eNPS interno · Retention rate' },
              { letter: 'P', name: 'Performance', desc: 'Impacto do trabalho no negócio', ex: 'Customer satisfaction · Feature adoption' },
              { letter: 'A', name: 'Activity', desc: 'Volume de acções (com cuidado — não é produtividade)', ex: 'PRs por sprint · Commits (contexto!)' },
              { letter: 'C', name: 'Communication', desc: 'Qualidade da colaboração entre equipas', ex: 'PR review time · Docs quality score' },
              { letter: 'E', name: 'Efficiency', desc: 'Flow state — quanto tempo em trabalho profundo', ex: 'Interrupções por dia · Meeting hours' },
            ].map(s => (
              <div key={s.letter} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-2xl font-black text-violet-400">{s.letter}</div>
                <div className="text-[11px] font-bold text-slate-200 mt-1">{s.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{s.desc}</div>
                <div className="text-[10px] text-emerald-400 mt-2 italic">{s.ex}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="text-[10px] font-black text-amber-400 uppercase mb-2">Anti-pattern crítico</div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              <span className="text-rose-300 font-bold">Nunca medir só Activity.</span> "Commits por dia" ou "linhas de código" são métricas de vaidade que penalizam refactoring e code review. SPACE existe para forçar as equipas a olhar para as 5 dimensões em conjunto.
            </p>
          </div>
        </div>
      )}

      {view === 'topologies' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <p className="text-[13px] text-slate-300 leading-relaxed">
              <span className="text-violet-300 font-bold">Team Topologies</span> (Skelton & Pais) define 4 tipos de equipa e 3 modos de interacção. Essencial para desenhar uma organização Platform Engineering saudável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                type: 'Stream-aligned',
                color: 'sky',
                desc: 'Alinhada a um fluxo de valor (produto, feature area). São 60-70% das equipas.',
                ex: 'Team Payments, Team Checkout, Team Search',
              },
              {
                type: 'Platform',
                color: 'violet',
                desc: 'Fornece um IDP às stream-aligned. Trata devs como clientes.',
                ex: 'Platform teams: fornecem IDP às stream-aligned. Reduzem cognitive load.',
              },
              {
                type: 'Enabling',
                color: 'emerald',
                desc: 'Ajuda outras equipas a adquirir capacidades novas. Missões temporárias (3-6 meses).',
                ex: 'SRE embed em equipa nova · Consultoria interna de segurança',
              },
              {
                type: 'Complicated Subsystem',
                color: 'amber',
                desc: 'Cuida de subsistemas que requerem especialistas (ML, algoritmos, video codecs).',
                ex: 'Team ML Recommendation · Team Fraud Detection',
              },
            ].map(t => (
              <div key={t.type} className={`p-4 rounded-2xl border ${
                t.color === 'sky' ? 'border-sky-500/30 bg-sky-500/5' :
                t.color === 'violet' ? 'border-violet-500/30 bg-violet-500/5' :
                t.color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/5' :
                'border-amber-500/30 bg-amber-500/5'
              }`}>
                <div className={`text-[11px] font-black uppercase mb-2 ${
                  t.color === 'sky' ? 'text-sky-400' :
                  t.color === 'violet' ? 'text-violet-400' :
                  t.color === 'emerald' ? 'text-emerald-400' :
                  'text-amber-400'
                }`}>{t.type}</div>
                <div className="text-[11px] text-slate-300 leading-relaxed">{t.desc}</div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">{t.ex}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold text-violet-300 mb-3">3 Modos de Interacção</div>
            <div className="space-y-3 text-[11px] text-slate-300">
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold w-32 shrink-0">X-as-a-Service</span>
                <span className="text-slate-400">Uma equipa consome o serviço da outra self-service (ex: stream-aligned usa a Platform).</span>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-400 font-bold w-32 shrink-0">Collaboration</span>
                <span className="text-slate-400">Duas equipas trabalham juntas em algo novo (temporário — máximo 3 meses).</span>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-400 font-bold w-32 shrink-0">Facilitating</span>
                <span className="text-slate-400">Enabling team ajuda outra a superar um obstáculo, sem "fazer por eles".</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
