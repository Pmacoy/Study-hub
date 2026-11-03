import { useState } from 'react';
import {
  Copy,
  Check,
  Route,
  Zap,
  ShieldOff,
  Rocket,
  FileText,
  LogOut,
  Play,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  HelpCircle,
  Gauge,
  TrendingDown,
  Shield,
  GitBranch,
  Terminal,
} from 'lucide-react';

function CodeBlock({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-400 text-[11px]">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span className="text-[11px]">{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-[#181926] text-slate-300 text-[11px]">
        {code.split('\n').map((line, i) => (
          <div
            key={i}
            className={
              line.trim().startsWith('#')
                ? 'text-slate-600'
                : /^(apiVersion|kind|metadata|spec|parameters|steps):/.test(line.trim())
                ? 'text-violet-400 font-semibold'
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

// Scaffolder simulation step data
interface ScaffolderStep {
  id: string;
  label: string;
  detail: string;
  duration: number; // ms to simulate
  icon: typeof GitBranch;
}

const SCAFFOLDER_STEPS: ScaffolderStep[] = [
  { id: 'fetch', label: 'Fetch Skeleton Template', detail: 'A carregar o template base do repositório de templates da plataforma...', duration: 1200, icon: FileText },
  { id: 'publish', label: 'Publish to GitHub', detail: 'A criar repo github.com/acme/{name} com branch protection, CODEOWNERS e .github/workflows...', duration: 2000, icon: GitBranch },
  { id: 'register', label: 'Register in Backstage Catalog', detail: 'A registar o catalog-info.yaml no Software Catalog com metadata e anotações de plugins...', duration: 800, icon: Shield },
  { id: 'provision-infra', label: 'Terraform Apply (Infra)', detail: 'A provisionar namespace Kubernetes, NetworkPolicy, ResourceQuotas e RBAC via Terraform...', duration: 2500, icon: Terminal },
  { id: 'provision-db', label: 'Provision PostgreSQL (RDS)', detail: 'A criar instância Aurora PostgreSQL Multi-AZ, KMS encryption, credenciais injetadas via Vault...', duration: 3000, icon: Terminal },
  { id: 'monitoring', label: 'Setup Grafana + PagerDuty', detail: 'A criar dashboard de Golden Signals (Rate, Errors, Duration, Saturation) e alertas de SLO...', duration: 1500, icon: Gauge },
];

function InteractiveScaffolder() {
  const [name, setName] = useState('order-service');
  const [tier, setTier] = useState<'gold' | 'silver' | 'bronze'>('gold');
  const [lang, setLang] = useState<'typescript' | 'python' | 'go'>('typescript');
  const [db, setDb] = useState(true);

  // Execution simulation
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [executionDone, setExecutionDone] = useState(false);

  const tierConfig = {
    gold: { sli: '99.99%', slo: '99.9%', budget: '43min/mês', pipeline: 'canary + auto-rollback', color: 'amber' },
    silver: { sli: '99.9%', slo: '99.5%', budget: '3.6h/mês', pipeline: 'blue-green', color: 'slate' },
    bronze: { sli: '99.5%', slo: '99%', budget: '7.2h/mês', pipeline: 'rolling update', color: 'amber' },
  };

  const activeSteps = SCAFFOLDER_STEPS.filter((s) => {
    if (s.id === 'provision-db' && !db) return false;
    return true;
  });

  const runScaffolder = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setExecutionDone(false);

    for (let i = 0; i < activeSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, activeSteps[i].duration));
      setCompletedSteps((prev) => [...prev, activeSteps[i].id]);
    }

    setCurrentStep(-1);
    setIsRunning(false);
    setExecutionDone(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/20 bg-[#181926]/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-violet-400 uppercase tracking-widest font-mono">
            🎬 Scaffolder Interactivo — Cria um Serviço
          </div>
          {!isRunning && (
            <button
              onClick={runScaffolder}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50"
            >
              <Play size={14} fill="currentColor" />
              {executionDone ? 'Re-executar Pipeline' : 'Executar Scaffolder'}
            </button>
          )}
          {isRunning && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-xs text-violet-300 font-bold">
              <Loader2 size={14} className="animate-spin" />
              A provisionar...
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold">Nome do serviço</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isRunning}
              className="mt-1 w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:border-violet-500/40 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold">Tier de reliability</label>
            <div className="mt-1 flex gap-1">
              {(['gold', 'silver', 'bronze'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  disabled={isRunning}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    tier === t
                      ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  } disabled:opacity-50`}
                >
                  {t === 'gold' ? '🥇' : t === 'silver' ? '🥈' : '🥉'} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold">Linguagem</label>
            <div className="mt-1 flex gap-1">
              {(['typescript', 'python', 'go'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  disabled={isRunning}
                  className={`flex-1 py-1.5 rounded-xl text-2xs font-bold transition-all ${
                    lang === l
                      ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  } disabled:opacity-50`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold">Base de dados?</label>
            <div className="mt-1">
              <button
                onClick={() => setDb(!db)}
                disabled={isRunning}
                className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                  db
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {db ? '✓ PostgreSQL provisionado' : '✗ Sem base de dados'}
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-step execution visualization */}
        {(isRunning || executionDone) && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-2xs font-black text-emerald-400 uppercase tracking-widest mb-2 font-mono">
              Pipeline de Provisioning — Execução em Tempo Real
            </div>
            {activeSteps.map((step, i) => {
              const StepIcon = step.icon;
              const isComplete = completedSteps.includes(step.id);
              const isCurrent = currentStep === i;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isComplete
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : isCurrent
                      ? 'border-violet-500/40 bg-violet-500/10 shadow-sm shadow-violet-500/10'
                      : 'border-slate-800 bg-slate-950/40 opacity-60'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isComplete ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 size={16} className="text-violet-400 animate-spin" />
                    ) : (
                      <Clock size={16} className="text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${isComplete ? 'text-emerald-300' : isCurrent ? 'text-violet-200' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                      <span className="text-3xs font-mono text-slate-500">{step.id}</span>
                    </div>
                    {isCurrent && (
                      <p className="text-2xs text-slate-400 mt-1 animate-pulse">
                        {step.detail.replace('{name}', name)}
                      </p>
                    )}
                    {isComplete && (
                      <p className="text-2xs text-emerald-400/70 mt-0.5 font-mono">
                        ✓ Concluído com sucesso ({(step.duration / 1000).toFixed(1)}s simulados)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Provesion result summary */}
        {executionDone && (
          <div className="pt-3 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 font-mono">Scaffolder concluído com sucesso!</span>
              </div>
              <div className="space-y-1 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Repo github.com/acme/{name} (protecções de branch, CODEOWNERS)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Pipeline CI/CD ({tierConfig[tier].pipeline}) + secret scanning
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Docker + Helm chart pré-configurado ({lang})
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Namespace K8s + NetworkPolicy + RBAC
                </div>
                {db && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> RDS PostgreSQL com credenciais em Vault
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Dashboard Grafana com Golden Signals
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Alertas PagerDuty (SLO: {tierConfig[tier].slo}, error budget {tierConfig[tier].budget})
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Backstage catalog entry + TechDocs
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Error Budget Calculator
function ErrorBudgetCalculator() {
  const [slo, setSlo] = useState(99.9);
  const [windowDays, setWindowDays] = useState(30);
  const [consumedPct, setConsumedPct] = useState(35);

  const totalMinutes = windowDays * 24 * 60;
  const errorBudgetMinutes = totalMinutes * ((100 - slo) / 100);
  const consumedMinutes = errorBudgetMinutes * (consumedPct / 100);
  const remainingMinutes = errorBudgetMinutes - consumedMinutes;
  const remainingPct = 100 - consumedPct;

  const burnRate = consumedPct / (windowDays > 0 ? windowDays : 1);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)} min`;
    if (minutes < 1440) return `${(minutes / 60).toFixed(1)} h`;
    return `${(minutes / 1440).toFixed(1)} dias`;
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Gauge size={18} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white font-display">Calculadora de Error Budget (SLO/SLI)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold block mb-1.5">SLO Target (%)</label>
            <input
              type="number"
              step={0.01}
              min={90}
              max={99.999}
              value={slo}
              onChange={(e) => setSlo(parseFloat(e.target.value) || 99.9)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
            />
            <input
              type="range"
              min={90}
              max={99.99}
              step={0.01}
              value={slo}
              onChange={(e) => setSlo(parseFloat(e.target.value))}
              className="w-full mt-1 accent-violet-500"
            />
          </div>
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold block mb-1.5">Janela (dias)</label>
            <div className="flex gap-1 mt-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setWindowDays(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    windowDays === d
                      ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-2xs text-slate-400 uppercase font-bold block mb-1.5">Budget Consumido (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={consumedPct}
              onChange={(e) => setConsumedPct(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
            />
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={consumedPct}
              onChange={(e) => setConsumedPct(parseFloat(e.target.value))}
              className="w-full mt-1 accent-violet-500"
            />
          </div>
        </div>

        {/* Budget Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-2xs text-slate-400 font-mono">
            <span>Budget Consumido: {formatTime(consumedMinutes)} ({consumedPct.toFixed(0)}%)</span>
            <span>Restante: {formatTime(remainingMinutes)} ({remainingPct.toFixed(0)}%)</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                consumedPct > 90
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                  : consumedPct > 70
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}
              style={{ width: `${Math.min(consumedPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-3xs font-mono text-slate-500 uppercase block">Error Budget Total</span>
            <span className="text-sm font-bold text-white block mt-0.5">{formatTime(errorBudgetMinutes)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-3xs font-mono text-slate-500 uppercase block">Budget Restante</span>
            <span
              className={`text-sm font-bold block mt-0.5 ${
                remainingPct > 50 ? 'text-emerald-400' : remainingPct > 20 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {formatTime(remainingMinutes)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-3xs font-mono text-slate-500 uppercase block">Burn Rate</span>
            <span className="text-sm font-bold text-violet-300 block mt-0.5">{burnRate.toFixed(1)}%/dia</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-3xs font-mono text-slate-500 uppercase block">Dias até 100%</span>
            <span
              className={`text-sm font-bold block mt-0.5 ${
                burnRate > 0 ? (remainingPct / burnRate < 5 ? 'text-rose-400' : 'text-sky-300') : 'text-slate-400'
              }`}
            >
              {burnRate > 0 ? `~${(remainingPct / burnRate).toFixed(0)} dias` : '∞'}
            </span>
          </div>
        </div>

        {/* Policy Recommendation */}
        <div
          className={`p-3 rounded-xl border text-xs ${
            consumedPct >= 90
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : consumedPct >= 70
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {consumedPct >= 90 ? (
              <AlertTriangle size={14} className="text-rose-400" />
            ) : consumedPct >= 70 ? (
              <TrendingDown size={14} className="text-amber-400" />
            ) : (
              <CheckCircle2 size={14} className="text-emerald-400" />
            )}
            <strong>
              {consumedPct >= 90
                ? 'POLICY: Congelar deploys — Error Budget esgotado!'
                : consumedPct >= 70
                ? 'POLICY: Apenas deploys com canary — Budget em risco'
                : 'POLICY: Deploys normais permitidos — Budget saudável'}
            </strong>
          </div>
          <p className="text-2xs opacity-80">
            {consumedPct >= 90
              ? 'Quando o error budget se esgota, a equipa deve parar de lançar features novas e focar-se 100% em reliability (reduzir incidentes, melhorar testes, reforçar alertas).'
              : consumedPct >= 70
              ? 'Acima de 70% do budget consumido, só devem fazer deploys com canary progressivo (1% → 5% → 25% → 100%) e rollback automático.'
              : 'Com budget saudável, a equipa tem liberdade para experimentar e mover rápido. Deploys frequentes e feature flags encorajados.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Quiz Questions
const QUIZ_QUESTIONS = [
  {
    q: 'Uma equipa consumiu 95% do error budget nos primeiros 10 dias de um window de 30 dias. O que deve acontecer segundo a política SRE?',
    options: [
      'Nada — continuar deploys normamente, porque 5% restante é suficiente.',
      'Congelar deploys de features novas até o fim da janela e focar em reliability.',
      'Eliminar o SLO porque é demasiado apertado para a equipa.',
      'Duplicar o número de engenheiros na equipa imediatamente.',
    ],
    correct: 1,
    explanation:
      'Quando o error budget se esgota, a política SRE impõe foco em reliability: reduzir incidentes, melhorar testes automatizados, reforçar alertas e canary deploys. Features ficam bloqueadas até o budget renovar.',
  },
  {
    q: 'Qual é a vantagem principal dos Golden Paths sobre uma abordagem "use o que quiser"?',
    options: [
      'Golden Paths obrigam todos os engenheiros a usar exatamente a mesma linguagem de programação.',
      'Golden Paths eliminam completamente a necessidade de documentação técnica.',
      'Golden Paths reduzem carga cognitiva ao oferecer um caminho optimizado, mas permitem desvios (escape hatches) com trade-offs explícitos.',
      'Golden Paths garantem que nunca haverá incidentes em produção.',
    ],
    correct: 2,
    explanation:
      'Golden Paths são opinionados mas não obrigatórios. A chave é que seguir o "paved road" é mais fácil e rápido que divergir. Escape hatches existem para necessidades genuinamente atípicas, mas com custos explícitos (o team assume ops, compliance e rollback).',
  },
  {
    q: 'Um microserviço "Gold Tier" (99.9% SLO) tem um error budget mensal de aproximadamente:',
    options: [
      '43 minutos (≈ 0.1% de ~30 dias)',
      '7.2 horas (≈ 1% de ~30 dias)',
      '3.6 horas (≈ 0.5% de ~30 dias)',
      '4.3 horas (≈ 0.3% de ~30 dias)',
    ],
    correct: 0,
    explanation:
      'SLO 99.9% → Error Budget = 0.1% × 30 dias × 24h × 60min = 43.2 minutos por mês. Qualquer downtime (deploys falhados, incidentes, manutenção) consome este budget.',
  },
];

export default function GoldenPathsModule() {
  const [section, setSection] = useState<'what' | 'paved' | 'template' | 'budget' | 'escape' | 'quiz'>('what');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const views = [
    { id: 'what' as const, label: 'O que são Golden Paths?', icon: Route },
    { id: 'paved' as const, label: 'Scaffolder (demo)', icon: Rocket },
    { id: 'template' as const, label: 'Template YAML', icon: FileText },
    { id: 'budget' as const, label: 'Error Budget Calc', icon: Gauge },
    { id: 'escape' as const, label: 'Escape Hatches', icon: LogOut },
    { id: 'quiz' as const, label: 'Knowledge Check', icon: HelpCircle },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-900 p-5 rounded-2xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shrink-0">
            <Route size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white font-display">Golden Paths & Paved Roads</h2>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Platform Eng · Fase 4
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Templates opinionados e caminhos optimizados que permitem criar, deployar e operar serviços em produção
              em menos de 2 minutos — com SLO, observabilidade e compliance integrados desde a origem.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = section === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setSection(v.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 shadow-sm shadow-emerald-500/20'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SECTION: WHAT ────────────────────────────────────── */}
      {section === 'what' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3">
              <Route size={22} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-emerald-300 font-display">Golden Path (Paved Road)</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  A rota <span className="text-white font-bold">bem-tratada e opinionada</span> para fazer alguma coisa
                  comum na organização. Não é a única maneira de fazer — é a maneira{' '}
                  <span className="text-emerald-300 font-bold">mais rápida e segura</span> se seguires as suposições da
                  plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 italic">
            "The paved road is the path of least resistance, where doing the right thing is easier than doing the
            wrong thing." — Netflix Engineering Blog
          </div>

          {/* Tier Comparison */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 font-mono">
              Tiers de Reliability — Matriz Comparativa
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 font-mono text-2xs uppercase">
                    <th className="text-left pb-2 pr-3">Dimensão</th>
                    <th className="text-center pb-2 px-3">🥇 Gold</th>
                    <th className="text-center pb-2 px-3">🥈 Silver</th>
                    <th className="text-center pb-2 px-3">🥉 Bronze</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    { dim: 'SLO', gold: '99.9%', silver: '99.5%', bronze: '99.0%' },
                    { dim: 'Error Budget / mês', gold: '43 min', silver: '3.6 horas', bronze: '7.2 horas' },
                    { dim: 'Deploy Strategy', gold: 'Canary + Rollback Auto', silver: 'Blue-Green', bronze: 'Rolling Update' },
                    { dim: 'Monitoring', gold: 'RED + SLO Burn Rate', silver: 'RED + Alertas', bronze: 'Métricas Básicas' },
                    { dim: 'Incident Response', gold: 'PagerDuty + Runbook Auto', silver: 'PagerDuty + Manual', bronze: 'Slack + Email' },
                    { dim: 'DB Replication', gold: 'Multi-AZ + Read Replicas', silver: 'Multi-AZ', bronze: 'Single AZ' },
                  ].map((row) => (
                    <tr key={row.dim} className="border-t border-slate-800/60">
                      <td className="py-2 pr-3 font-bold text-slate-200 text-2xs">{row.dim}</td>
                      <td className="py-2 px-3 text-center text-emerald-300 text-2xs">{row.gold}</td>
                      <td className="py-2 px-3 text-center text-sky-300 text-2xs">{row.silver}</td>
                      <td className="py-2 px-3 text-center text-amber-300 text-2xs">{row.bronze}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">
              Golden Paths Típicos
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { i: <Rocket size={14} />, k: 'Criar novo microserviço', v: 'Repo + CI/CD + Helm + observability em 90 segundos' },
                { i: <Zap size={14} />, k: 'Adicionar uma feature flag', v: 'PR pré-preenchido com o SDK certo e testes de exemplo' },
                { i: <Rocket size={14} />, k: 'Provisionar base de dados', v: 'Terraform module, backup, secrets em Vault, alertas' },
                { i: <Zap size={14} />, k: 'Onboard num novo team', v: 'Grupos IdP + acessos + docs + canal Slack criado' },
                { i: <Rocket size={14} />, k: 'Migrar para nova versão K8s', v: 'Playbook + testes automáticos + rollback' },
              ].map((g) => (
                <div key={g.k} className="flex items-start gap-3 p-3 rounded-xl bg-[#181926] border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    {g.i}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{g.k}</div>
                    <div className="text-2xs text-slate-400 mt-0.5">{g.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: PAVED ROAD (SCAFFOLDER) ─────────────────── */}
      {section === 'paved' && <InteractiveScaffolder />}

      {/* ── SECTION: TEMPLATE YAML ───────────────────────────── */}
      {section === 'template' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            Um <strong className="text-white">Backstage Software Template</strong> define{' '}
            <span className="text-violet-300">parâmetros</span> (o que o dev preenche) e{' '}
            <span className="text-emerald-300">steps</span> (o que a plataforma executa automaticamente). Este é o template
            real para um microserviço "gold tier":
          </div>
          <CodeBlock
            code={`# template.yaml — Backstage Software Template
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
        slo: 99.9`}
          />
        </div>
      )}

      {/* ── SECTION: ERROR BUDGET CALCULATOR ──────────────────── */}
      {section === 'budget' && <ErrorBudgetCalculator />}

      {/* ── SECTION: ESCAPE HATCHES ──────────────────────────── */}
      {section === 'escape' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <ShieldOff size={22} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-amber-300 font-display">Escape Hatch (Saída Controlada)</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  O golden path é <span className="text-white font-bold">opcional</span>. Equipas sofisticadas devem
                  poder sair da plataforma quando têm necessidades atípicas — mas com{' '}
                  <span className="text-amber-300 font-bold">custos e responsabilidades explícitas</span> documentados e
                  aceites pela equipa.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-xs font-black uppercase tracking-widest mb-3 text-emerald-400 font-mono">
                ✓ Dentro do Golden Path
              </div>
              {[
                'Suporte 24/7 do platform team',
                'Upgrades automáticos da infra (K8s, OS patches)',
                'Compliance auditado pela plataforma (SOC2, GDPR)',
                'Rollback automático em falha de canary',
                'Observability pré-configurada com alertas SLO',
                'Error budget gerido centralmente',
              ].map((item, i) => (
                <div key={i} className="text-xs text-emerald-300/80 py-1 flex gap-1.5">
                  <span className="text-emerald-500">✓</span> {item}
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <div className="text-xs font-black uppercase tracking-widest mb-3 text-amber-400 font-mono">
                ⚠ Fora do Path (Escape Hatch)
              </div>
              {[
                'Team assume 100% do on-call próprio',
                'Sem SLOs garantidos pela plataforma',
                'Compliance responsabilidade da equipa',
                'Sem rollback automático (manual)',
                'A equipa gere os seus dashboards e alertas',
                'Sem error budget centralizado',
              ].map((item, i) => (
                <div key={i} className="text-xs text-amber-300/80 py-1 flex gap-1.5">
                  <span className="text-amber-500">⚠</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-slate-300 leading-relaxed">
            <span className="text-rose-400 font-bold">Anti-pattern:</span> Tornar a plataforma{' '}
            <em>obrigatória</em>. Se a única forma de fazer deploy é via o portal, os teams sofisticados vão
            detestar a plataforma. O paved road ganha por ser <em>melhor</em>, não por ser o único caminho.
          </div>
        </div>
      )}

      {/* ── SECTION: KNOWLEDGE CHECK QUIZ ────────────────────── */}
      {section === 'quiz' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Testa os teus Conhecimentos — Golden Paths & SRE
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                3 perguntas sobre error budgets, SLOs e estratégia de plataforma.
              </p>
            </div>
            {Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length && !showQuizResults && (
              <button
                onClick={() => setShowQuizResults(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                Ver Pontuação
              </button>
            )}
          </div>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOption = quizAnswers[qIndex];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = isAnswered && selectedOption === q.correct;

              return (
                <div key={qIndex} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-2xs font-bold text-emerald-300">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-relaxed">{q.q}</h4>
                  </div>

                  <div className="space-y-2 pl-7">
                    {q.options.map((opt, optIndex) => {
                      let btnStyle =
                        'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-300';
                      if (selectedOption === optIndex) {
                        if (showQuizResults) {
                          btnStyle =
                            optIndex === q.correct
                              ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold'
                              : 'border-rose-500/60 bg-rose-500/15 text-rose-300 font-semibold';
                        } else {
                          btnStyle = 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-semibold';
                        }
                      } else if (showQuizResults && optIndex === q.correct) {
                        btnStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${btnStyle}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-3xs opacity-60">[{String.fromCharCode(65 + optIndex)}]</span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div
                      className={`ml-7 p-3 rounded-xl text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <strong className="block mb-1">{isCorrect ? '✓ Resposta Correta!' : '✗ Incorreto'}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showQuizResults && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Pontuação:{' '}
                <strong className="text-emerald-400">
                  {Object.entries(quizAnswers).filter(([idx, ans]) => ans === QUIZ_QUESTIONS[Number(idx)].correct).length}
                </strong>{' '}
                / {QUIZ_QUESTIONS.length} corretas
              </div>
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setShowQuizResults(false);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-mono"
              >
                Reiniciar Questionário
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
