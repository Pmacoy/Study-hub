import { useState } from 'react';
import {
  Copy,
  Check,
  Gauge,
  Brain,
  Users,
  TrendingUp,
  Rocket,
  Clock,
  Zap,
  ArrowRight,
  BarChart3,
  Activity,
  Wrench,
  HelpCircle,
  Radar,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  Minus,
  Plus,
} from 'lucide-react';

function Code({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-400">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-300"
        >
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-[#181926]">
        {code.split('\n').map((line, i) => (
          <div
            key={i}
            className={
              line.trim().startsWith('#') || line.trim().startsWith('//')
                ? 'text-slate-600'
                : /^\s*(metric|name|query|target|source):/.test(line)
                ? 'text-violet-400'
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

const DORA_METRICS = [
  {
    name: 'Deployment Frequency',
    icon: <Rocket size={16} className="text-emerald-400" />,
    def: 'Com que frequência a equipa faz deploy para produção',
    elite: 'On demand (várias vezes/dia)',
    high: '1x/dia até 1x/semana',
    medium: '1x/semana até 1x/mês',
    low: '1x/mês até 1x/6 meses',
    how: 'Contar deploys em produção — via CI/CD API ou webhook',
  },
  {
    name: 'Lead Time for Changes',
    icon: <Clock size={16} className="text-sky-400" />,
    def: 'Tempo entre commit e código em produção',
    elite: '< 1 hora',
    high: '1 dia até 1 semana',
    medium: '1 semana até 1 mês',
    low: '1 mês até 6 meses',
    how: 'Timestamp: 1º commit no PR → deploy em prod',
  },
  {
    name: 'Change Failure Rate',
    icon: <Zap size={16} className="text-rose-400" />,
    def: '% de deploys que causam falha em produção (rollback, hotfix)',
    elite: '0 - 15%',
    high: '16 - 30%',
    medium: '31 - 45%',
    low: '46 - 60%',
    how: 'Deploys que geraram incidente / total deploys × 100',
  },
  {
    name: 'MTTR (Mean Time to Restore)',
    icon: <Wrench size={16} className="text-amber-400" />,
    def: 'Tempo médio para recuperar de um incidente em produção',
    elite: '< 1 hora',
    high: '< 1 dia',
    medium: '1 dia até 1 semana',
    low: '1 semana até 1 mês',
    how: 'Timestamp: incident open → resolved (via PagerDuty / Opsgenie)',
  },
];

// DORA Tier Calculator / Radar Chart
function DoraTierCalculator() {
  const [deployFreq, setDeployFreq] = useState<'elite' | 'high' | 'medium' | 'low'>('high');
  const [leadTime, setLeadTime] = useState<'elite' | 'high' | 'medium' | 'low'>('high');
  const [changeFailureRate, setChangeFailureRate] = useState<'elite' | 'high' | 'medium' | 'low'>('medium');
  const [mttr, setMttr] = useState<'elite' | 'high' | 'medium' | 'low'>('high');

  const metrics = [
    { id: 'deployFreq', label: 'Deployment Frequency', value: deployFreq, setValue: setDeployFreq },
    { id: 'leadTime', label: 'Lead Time for Changes', value: leadTime, setValue: setLeadTime },
    { id: 'changeFailure', label: 'Change Failure Rate', value: changeFailureRate, setValue: setChangeFailureRate },
    { id: 'mttr', label: 'MTTR', value: mttr, setValue: setMttr },
  ];

  // Calculate overall tier
  const tierCounts = {
    elite: [deployFreq, leadTime, changeFailureRate, mttr].filter((v) => v === 'elite').length,
    high: [deployFreq, leadTime, changeFailureRate, mttr].filter((v) => v === 'high').length,
    medium: [deployFreq, leadTime, changeFailureRate, mttr].filter((v) => v === 'medium').length,
    low: [deployFreq, leadTime, changeFailureRate, mttr].filter((v) => v === 'low').length,
  };

  let overallTier = 'low';
  if (tierCounts.elite >= 3) overallTier = 'elite';
  else if (tierCounts.elite >= 1 && tierCounts.high >= 2) overallTier = 'high';
  else if (tierCounts.medium >= 2) overallTier = 'medium';
  else overallTier = 'low';

  const tierConfig = {
    elite: {
      label: 'Elite',
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-300',
      description: 'Equipa de alto desempenho — move rápido e de forma segura.',
      recommendations: [
        '✓ Feature flags para rollback instantâneo',
        '✓ Canary deploys com monitorização automática',
        '✓ SRE practices: error budgets, blameless post-mortems',
        '✓ Investir em automação e observabilidade',
      ],
    },
    high: {
      label: 'High',
      color: 'sky',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      textColor: 'text-sky-300',
      description: 'Equipa competente — deploys regulares mas com pontos de melhoria.',
      recommendations: [
        '→ Aumentar deployment frequency (CI/CD improvements)',
        '→ Reduzir change failure rate (melhor testing, code review)',
        '→ Streamline incident response process',
        '→ Documentar runbooks para incidentes comuns',
      ],
    },
    medium: {
      label: 'Medium',
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-300',
      description: 'Equipa em transição — mudança cultural e tooling necessários.',
      recommendations: [
        '⚠ Começar com golden paths + IDP',
        '⚠ Implementar CI/CD básico (automatizar deploys)',
        '⚠ Setup monitoring + alertas SLO',
        '⚠ Training em SRE practices e blameless culture',
      ],
    },
    low: {
      label: 'Low',
      color: 'rose',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-300',
      description: 'Equipa em dificuldade — transformação estratégica necessária.',
      recommendations: [
        '🔴 Priorizar IDP + automação de infraestrutura',
        '🔴 Setup CI/CD completo (sem deploys manuais)',
        '🔴 Implementar incident response framework',
        '🔴 Executive sponsorship para mudança de cultura',
      ],
    },
  };

  const config = tierConfig[overallTier as keyof typeof tierConfig];

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Radar size={18} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white font-display">DORA Tier Calculator</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Move cada métrica para a posição que melhor descreve a tua equipa. O sistema calcula automaticamente o tier
          geral.
        </p>

        <div className="space-y-3">
          {metrics.map((m) => (
            <div key={m.id} className="p-3 rounded-xl bg-[#181926] border border-slate-800">
              <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                <span>{m.label}</span>
                <span className="font-mono text-2xs text-slate-500">
                  {m.value === 'elite' ? '🥇' : m.value === 'high' ? '⭐' : m.value === 'medium' ? '•' : '○'} {m.value}
                </span>
              </div>
              <div className="flex gap-1">
                {(['elite', 'high', 'medium', 'low'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => m.setValue(tier)}
                    className={`flex-1 py-2 rounded-lg text-2xs font-bold transition-all border ${
                      m.value === tier
                        ? 'border-violet-500/60 bg-violet-500/20 text-violet-300'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {tier === 'elite' ? '🥇' : tier === 'high' ? '⭐' : tier === 'medium' ? '•' : '○'}
                    <span className="block uppercase text-3xs mt-0.5">{tier}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Overall Tier Card */}
        <div className={`mt-5 p-4 rounded-2xl border ${config.borderColor} ${config.bgColor}`}>
          <div className="flex items-start gap-3">
            <div className={`text-3xl font-black ${config.textColor}`}>
              {overallTier === 'elite' ? '🚀' : overallTier === 'high' ? '⭐' : overallTier === 'medium' ? '📈' : '⚠'}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-bold ${config.textColor}`}>Tier Geral: {config.label}</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{config.description}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className={`text-xs font-bold ${config.textColor} uppercase tracking-widest mb-2 font-mono`}>
              Próximos Passos
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              {config.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="shrink-0">{rec.substring(0, 1)}</span>
                  <span className="flex-1">{rec.substring(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Cognitive Load Assessment Tool
function CognitiveLoadAssessment() {
  const [responses, setResponses] = useState<Record<number, number>>({});

  const questions = [
    { q: 'Sei exatamente quais serviços a minha equipa é responsável por operar?', detail: 'Ownership claro = menos context switching' },
    { q: 'Consigo fazer um deploy para produção sozinho, sem pedir ajuda?', detail: 'Self-service deployment reduz dependências' },
    { q: 'Entendo completamente como o nosso CI/CD pipeline funciona?', detail: 'Transparência do tooling reduz frustração' },
    { q: 'Sei a quem pedir ajuda quando tenho problemas técnicos?', detail: 'Escalation paths claros = feedback faster' },
    { q: 'Documentação que preciso está onde eu espero encontrar?', detail: 'Good docs = menos cognitive load' },
  ];

  const totalScore = Object.values(responses).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 5;
  const scorePercent = Object.keys(responses).length === questions.length ? (totalScore / maxScore) * 100 : 0;

  let healthStatus = '⏳ Incompleto';
  let healthColor = 'slate';
  if (scorePercent === 0) {
    healthStatus = 'Não respondido';
    healthColor = 'slate';
  } else if (scorePercent >= 80) {
    healthStatus = '✓ Saudável (Low Cognitive Load)';
    healthColor = 'emerald';
  } else if (scorePercent >= 60) {
    healthStatus = '→ Moderado (Melhorias Necessárias)';
    healthColor = 'amber';
  } else {
    healthStatus = '⚠ Crítico (Carga Cognitiva Alta)';
    healthColor = 'rose';
  }

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white font-display">Team Cognitive Load Assessment</h3>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Avalia o nível de carga cognitiva na tua equipa respondendo a 5 perguntas (escala 1-5). Score {'>'}80 significa
          low load (bom!). {'<'}60 é sinal de alerta.
        </p>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#181926] border border-slate-800 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-2xs font-bold text-violet-300 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{q.q}</p>
                  <p className="text-2xs text-slate-500 italic mt-0.5">{q.detail}</p>
                </div>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => setResponses((prev) => ({ ...prev, [i]: score }))}
                    className={`flex-1 py-2 rounded-lg text-2xs font-bold transition-all border ${
                      responses[i] === score
                        ? 'border-violet-500/60 bg-violet-500/20 text-violet-300'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score Summary */}
        {Object.keys(responses).length === questions.length && (
          <div className={`mt-5 p-4 rounded-2xl border space-y-3`}>
            <div className={`flex items-center justify-between`}>
              <div>
                <div
                  className={`text-sm font-bold ${
                    healthColor === 'emerald'
                      ? 'text-emerald-300'
                      : healthColor === 'amber'
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {healthStatus}
                </div>
                <div className="text-3xl font-black mt-1">
                  {((totalScore / maxScore) * 100).toFixed(0)}
                  <span className="text-lg font-semibold text-slate-500">/100</span>
                </div>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      healthColor === 'emerald'
                        ? '#10b981'
                        : healthColor === 'amber'
                        ? '#f59e0b'
                        : '#ef4444'
                    }
                    strokeWidth="8"
                    strokeDasharray={`${(totalScore / maxScore) * 282.7} 282.7`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>

            <div className={`pt-3 border-t border-slate-700 text-xs text-slate-300`}>
              <strong className="block mb-2">Interpretação:</strong>
              {healthColor === 'emerald' && (
                <p>
                  A tua equipa tem <strong>low cognitive load</strong>. Continuam assim: mantenha a documentação, o
                  tooling intuitivo e ownership claro.
                </p>
              )}
              {healthColor === 'amber' && (
                <p>
                  A carga cognitiva está <strong>moderada</strong>. Identifiquem os "pain points" e investem em IDP,
                  documentação e automação.
                </p>
              )}
              {healthColor === 'rose' && (
                <p>
                  <strong>Atenção!</strong> Carga cognitiva crítica. Equipa sobrecarregada = menos produtividade, mais
                  incidentes, higher turnover. Intervir urgentemente.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// SPACE Framework Interactive Matrix
function SpaceFrameworkMatrix() {
  const [scores, setScores] = useState<Record<string, number>>({
    satisfaction: 3,
    performance: 3,
    activity: 3,
    communication: 3,
    efficiency: 3,
  });

  const dimensions = [
    {
      key: 'satisfaction',
      letter: 'S',
      name: 'Satisfaction',
      icon: '😊',
      color: 'amber',
      metrics: ['eNPS', 'Retention rate', 'Dev happiness survey'],
    },
    {
      key: 'performance',
      letter: 'P',
      name: 'Performance',
      icon: '📊',
      color: 'emerald',
      metrics: ['Customer satisfaction', 'Feature adoption', 'Business impact'],
    },
    {
      key: 'activity',
      letter: 'A',
      name: 'Activity',
      icon: '⚡',
      color: 'sky',
      metrics: ['PRs merged', 'Commits', 'Deployment count'],
    },
    {
      key: 'communication',
      letter: 'C',
      name: 'Communication',
      icon: '💬',
      color: 'violet',
      metrics: ['PR review latency', 'Docs quality', 'Cross-team collab'],
    },
    {
      key: 'efficiency',
      letter: 'E',
      name: 'Efficiency',
      icon: '🎯',
      color: 'rose',
      metrics: ['Flow state time', 'Meeting hours', 'Context switches'],
    },
  ];

  const avgScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length;

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white font-display">SPACE Framework Assessment</h3>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          SPACE complementa DORA ao medir a <strong>experiência do developer</strong>. Rate cada dimensão 1-5 para ver
          um quadro completo de saúde da equipa.
        </p>

        <div className="space-y-4">
          {dimensions.map((d) => (
            <div key={d.key} className={`p-4 rounded-2xl border border-slate-800 bg-[#181926] space-y-2`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <div className="text-xs font-black text-slate-200 uppercase tracking-wider">
                        {d.letter} — {d.name}
                      </div>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        {d.metrics.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black">{scores[d.key]}</div>
                  <div className="text-2xs text-slate-500">/5</div>
                </div>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => setScores((prev) => ({ ...prev, [d.key]: score }))}
                    className={`flex-1 py-2 rounded-lg text-2xs font-bold transition-all border ${
                      scores[d.key] === score
                        ? `bg-${d.color}-500/20 text-${d.color}-300 border-${d.color}-500/60`
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Overall SPACE Score */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-slate-900 to-slate-900 border border-violet-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-violet-400 uppercase tracking-widest">SPACE Score Médio</div>
              <div className="text-3xl font-black text-white mt-1">
                {avgScore.toFixed(1)}
                <span className="text-lg font-semibold text-slate-500">/5</span>
              </div>
            </div>
            <div className="text-4xl">
              {avgScore >= 4.5
                ? '🚀'
                : avgScore >= 3.5
                ? '⭐'
                : avgScore >= 2.5
                ? '→'
                : '⚠'}
            </div>
          </div>

          <div className="pt-2 border-t border-violet-500/20 text-xs text-slate-300">
            <strong className="text-violet-300 block mb-1">Nota importante:</strong>
            SPACE foi desenhado por Microsoft Research + GitHub para evitar a armadilha de "Activity bias" (contar lines
            of code, commits, etc). A melhor equipa não é a que mais trabalha — é a que entrega mais valor com menos
            stress.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoraDevexSimulator() {
  const [view, setView] = useState<'dora' | 'devex' | 'topologies' | 'space'>('dora');
  const [selectedMetric, setSelectedMetric] = useState<number>(0);

  const views = [
    { id: 'dora' as const, label: 'DORA 4 & Calc', icon: Gauge },
    { id: 'devex' as const, label: 'Cognitive Load', icon: Brain },
    { id: 'space' as const, label: 'SPACE Matrix', icon: TrendingUp },
    { id: 'topologies' as const, label: 'Team Topologies', icon: Users },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-slate-900 p-5 rounded-2xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 shrink-0">
            <Gauge size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white font-display">DORA & Developer Experience (DevEx)</h2>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                Platform Eng · Fase 4
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Métricas e frameworks para medir a saúde de uma organização Platform Engineering: DORA 4 (velocity +
              stability), Cognitive Load (IDP impact), SPACE Framework (dev experience), e Team Topologies
              (organização).
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = view === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'border-violet-500/60 bg-violet-500/20 text-violet-200 shadow-sm shadow-violet-500/20'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-violet-400' : 'text-slate-500'} />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── DORA 4 ────────────────────────────────────────────── */}
      {view === 'dora' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-2">
              DORA 4 · o padrão da indústria
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              As 4 métricas do <span className="text-violet-300 font-bold">DevOps Research and Assessment</span> (Google
              Cloud) medem a performance de entrega de software. Depois de 6 anos de estudo e 32.000 respondentes, dividem
              equipas em 4 níveis: <span className="text-emerald-300 font-bold">Elite</span>,{' '}
              <span className="text-sky-300 font-bold">High</span>, <span className="text-amber-300 font-bold">Medium</span>
              , <span className="text-rose-300 font-bold">Low</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DORA_METRICS.map((m, i) => (
              <button
                key={m.name}
                onClick={() => setSelectedMetric(i)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedMetric === i ? 'border-violet-500/40 bg-violet-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl">{m.icon}</div>
                <div className="text-xs font-bold text-slate-200 mt-1">{m.name}</div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">{DORA_METRICS[selectedMetric].icon}</div>
              <div>
                <div className="text-base font-bold text-white">{DORA_METRICS[selectedMetric].name}</div>
                <div className="text-xs text-slate-400 mt-1">{DORA_METRICS[selectedMetric].def}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { level: 'Elite', color: 'emerald', value: DORA_METRICS[selectedMetric].elite },
                { level: 'High', color: 'sky', value: DORA_METRICS[selectedMetric].high },
                { level: 'Medium', color: 'amber', value: DORA_METRICS[selectedMetric].medium },
                { level: 'Low', color: 'rose', value: DORA_METRICS[selectedMetric].low },
              ].map((l) => (
                <div
                  key={l.level}
                  className={`p-2.5 rounded-xl border ${
                    l.color === 'emerald'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : l.color === 'sky'
                      ? 'border-sky-500/30 bg-sky-500/5'
                      : l.color === 'amber'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div
                    className={`text-2xs font-black uppercase ${
                      l.color === 'emerald'
                        ? 'text-emerald-400'
                        : l.color === 'sky'
                        ? 'text-sky-400'
                        : l.color === 'amber'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {l.level}
                  </div>
                  <div className="text-2xs text-slate-300 mt-1">{l.value}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#181926] border border-slate-800">
              <div className="text-2xs font-black text-amber-400 uppercase mb-1">Como medir</div>
              <div className="text-xs text-slate-300">{DORA_METRICS[selectedMetric].how}</div>
            </div>
          </div>

          <Code
            lang="promql"
            code={`# Deployment Frequency - Prometheus
sum(increase(deployment_total{env="prod"}[7d]))

# Lead Time - via GitHub Actions API
# timestamp: PR opened → deploy job completed
lead_time_seconds = deploy_end_ts - pr_first_commit_ts

# Change Failure Rate
sum(increase(deployment_failed_total{env="prod"}[30d]))
/ sum(increase(deployment_total{env="prod"}[30d])) * 100

# MTTR - via PagerDuty API
avg(incident_resolved_ts - incident_created_ts)`}
          />

          <DoraTierCalculator />
        </div>
      )}

      {/* ── COGNITIVE LOAD ────────────────────────────────────── */}
      {view === 'devex' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <div className="text-2xs font-black text-violet-400 uppercase tracking-widest mb-2">
              Cognitive Load · o inimigo escondido
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="text-violet-300 font-bold">Cognitive Load</span> é o "peso mental" que um developer carrega
              para fazer o seu trabalho. Se um dev precisa de conhecer 15 ferramentas para fazer deploy, o Platform
              Engineering falhou. O IDP existe para reduzir isto.
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
            ].map((c) => (
              <div
                key={c.type}
                className={`p-4 rounded-2xl border ${
                  c.color === 'sky'
                    ? 'border-sky-500/30 bg-sky-500/5'
                    : c.color === 'rose'
                    ? 'border-rose-500/30 bg-rose-500/5'
                    : 'border-emerald-500/30 bg-emerald-500/5'
                }`}
              >
                <div
                  className={`text-xs font-black uppercase mb-2 ${
                    c.color === 'sky'
                      ? 'text-sky-400'
                      : c.color === 'rose'
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {c.type}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">{c.desc}</div>
                <div className="mt-3 pt-3 border-t border-slate-800 text-2xs text-slate-400 italic">{c.action}</div>
              </div>
            ))}
          </div>

          <CognitiveLoadAssessment />
        </div>
      )}

      {/* ── SPACE FRAMEWORK ──────────────────────────────────── */}
      {view === 'space' && <SpaceFrameworkMatrix />}

      {/* ── TEAM TOPOLOGIES ──────────────────────────────────── */}
      {view === 'topologies' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="text-violet-300 font-bold">Team Topologies</span> (Skelton & Pais) define 4 tipos de equipa
              e 3 modos de interacção. Essencial para desenhar uma organização Platform Engineering saudável.
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
            ].map((t) => (
              <div
                key={t.type}
                className={`p-4 rounded-2xl border ${
                  t.color === 'sky'
                    ? 'border-sky-500/30 bg-sky-500/5'
                    : t.color === 'violet'
                    ? 'border-violet-500/30 bg-violet-500/5'
                    : t.color === 'emerald'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-amber-500/30 bg-amber-500/5'
                }`}
              >
                <div
                  className={`text-xs font-black uppercase mb-2 ${
                    t.color === 'sky'
                      ? 'text-sky-400'
                      : t.color === 'violet'
                      ? 'text-violet-400'
                      : t.color === 'emerald'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {t.type}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">{t.desc}</div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-2xs text-slate-400 italic">{t.ex}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-bold text-violet-300 mb-3">3 Modos de Interacção</div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold w-32 shrink-0">X-as-a-Service</span>
                <span className="text-slate-400">
                  Uma equipa consome o serviço da outra self-service (ex: stream-aligned usa a Platform).
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-sky-400 font-bold w-32 shrink-0">Collaboration</span>
                <span className="text-slate-400">
                  Duas equipas trabalham juntas em algo novo (temporário — máximo 3 meses).
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-400 font-bold w-32 shrink-0">Facilitating</span>
                <span className="text-slate-400">
                  Enabling team ajuda outra a superar um obstáculo, sem "fazer por eles".
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
