import { useState } from 'react';
import { Copy, Check, Shield, AlertTriangle, Gauge, TrendingDown, Clock, Activity } from 'lucide-react';

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
            : /^(name|window|error_budget|threshold|action):/.test(line.trim()) ? 'text-violet-400'
            : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function SreSimulator() {
  const [section, setSection] = useState<'slo' | 'budget' | 'incident' | 'blameless'>('slo');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [budgetUsed, setBudgetUsed] = useState(62);
  const [windowPct, setWindowPct] = useState(99.7);

  const views = [
    { id: 'slo' as const, label: 'SLO / SLI', icon: Gauge },
    { id: 'budget' as const, label: 'Error Budget', icon: TrendingDown },
    { id: 'incident' as const, label: 'Incident Mgmt', icon: AlertTriangle },
    { id: 'blameless' as const, label: 'Blameless', icon: Shield },
  ];

  const quizQuestions = [
    { q: 'O que é um SLI?', a: ['A meta de disponibilidade anual', 'Uma métrica quantitativa de desempenho do serviço (ex: taxa de sucesso)', 'O orçamento de erros permitido', 'Um processo de post-mortem'], correct: 1 },
    { q: 'O que acontece quando o error budget se esgota?', a: ['O serviço é desligado automaticamente', 'Equipa para feature work e foca em fiabilidade', 'O SLO é aumentado para 99.99%', 'Nada — é só um número'], correct: 1 },
    { q: 'O que é um post-mortem blameless?', a: ['Um relatório que identifica quem errou', 'Uma análise focada no processo, não nas pessoas', 'Uma reunião para culpar o on-call', 'Um processo de demissão'], correct: 1 },
  ];

  const q = quizQuestions[section === 'slo' ? 0 : section === 'budget' ? 1 : section === 'incident' ? 2 : 2];

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

      {/* ── SLO / SLI ── */}
      {section === 'slo' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Gauge size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">SLI → SLO → SLA</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  A hierarquia de métricas de fiabilidade: <span className="text-white font-bold">SLI</span> é o que medes, <span className="text-white font-bold">SLO</span> é a meta, <span className="text-white font-bold">SLA</span> é o compromisso externo (com penalidades).
                </p>
              </div>
            </div>
          </div>

          {/* Hierarchy */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'SLI', full: 'Service Level Indicator', desc: 'Métrica real. Ex: 99.87% requests suceeded last 28d', color: 'violet' },
              { name: 'SLO', full: 'Service Level Objective', desc: 'Meta interna. Ex: 99.9% requests suceeded', color: 'amber' },
              { name: 'SLA', full: 'Service Level Agreement', desc: 'Contrato externo. Ex: 99.9% → refund se falhar', color: 'emerald' },
            ].map(item => (
              <div key={item.name} className={`p-4 rounded-2xl border border-${item.color}-500/20 bg-${item.color}-500/5`}>
                <div className={`text-2xl font-black text-${item.color}-400`}>{item.name}</div>
                <div className="text-2xs text-slate-400 mt-1 font-semibold">{item.full}</div>
                <div className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* SLO example */}
          <Code code={`# SLO: API de pagamento
# Medimos latência do 99º percentil (p99)
# Meta: 99.5% das requests < 500ms em 28 dias

name: api-payment-latency
window: 28d
threshold: 500ms
slo_target: 99.5
error_budget: 0.5   # 0.5% de tolerância`} />

          {/* Interactive SLO gauge */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">SLO Simulator — Latência p99</div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-2xs text-slate-400 mb-1">
                  <span>99.0%</span>
                  <span className="font-bold text-white">Meta: 99.5%</span>
                  <span>100%</span>
                </div>
                <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${windowPct}%`,
                      backgroundColor: windowPct >= 99.5 ? '#10b981' : windowPct >= 99.0 ? '#f59e0b' : '#f43f5e',
                    }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-lg font-bold font-mono ${windowPct >= 99.5 ? 'text-emerald-400' : windowPct >= 99.0 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {windowPct.toFixed(2)}%
                  </span>
                  <span className="text-2xs text-slate-500 ml-2">p99 success rate</span>
                </div>
              </div>
              <input
                type="range" min={980} max={1000} value={Math.round(windowPct * 100)}
                onChange={e => setWindowPct(Number(e.target.value) / 100)}
                className="w-24 accent-violet-500"
              />
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

      {/* ── Error Budget ── */}
      {section === 'budget' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <TrendingDown size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Error Budget — O Orçamento de Erros</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  O <span className="text-white font-bold">error budget</span> é a tolerância permitida: 100% − SLO. Se o SLO é 99.9%, o budget é <span className="text-violet-300 font-bold">0.1% de downtime</span>. Quando gasta, para-se feature work.
                </p>
              </div>
            </div>
          </div>

          {/* Budget calculator */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Budget Calculator</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xs text-slate-500 mb-1">SLO atual</div>
                <div className="text-3xl font-black text-white font-mono">{windowPct}%</div>
                <div className="text-2xs text-slate-400 mt-1">Disponibilidade mensal</div>
              </div>
              <div>
                <div className="text-2xs text-slate-500 mb-1">Error Budget</div>
                <div className={`text-3xl font-black font-mono ${budgetUsed > 80 ? 'text-rose-400' : budgetUsed > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {(100 - windowPct * 100 / 100).toFixed(2)}%
                </div>
                <div className="text-2xs text-slate-400 mt-1">Margem de erro permitida</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-2xs text-slate-500 mb-1">
                <span>Budget usado este mês</span>
                <span>{budgetUsed}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${budgetUsed}%`,
                    backgroundColor: budgetUsed > 80 ? '#f43f5e' : budgetUsed > 50 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>
              <div className={`mt-2 text-2xs font-semibold ${budgetUsed > 80 ? 'text-rose-400' : budgetUsed > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {budgetUsed > 80 ? '⚠ Orçamento crítico — parar feature work' : budgetUsed > 50 ? 'Orçamento em uso — monitorizar' : 'Orçamento saudável — continuar normal'}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setBudgetUsed(Math.min(100, budgetUsed + 10))} className="px-3 py-1 text-2xs border border-slate-700 text-slate-400 hover:text-white rounded-lg">Simular incidente (+10%)</button>
              <button onClick={() => setBudgetUsed(Math.max(0, budgetUsed - 5))} className="px-3 py-1 text-2xs border border-slate-700 text-slate-400 hover:text-white rounded-lg">Simular recuperação (-5%)</button>
            </div>
          </div>

          <Code code={`# SLO com error budget
name: api-latency-p99
slo_target: 99.9
window: 30d
error_budget: 0.1
action_on_exhaustion:
  - freeze_feature_deployments
  - oncall_escalation
  - weekly_blameless_postmortem`} />

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

      {/* ── Incident Mgmt ── */}
      {section === 'incident' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <AlertTriangle size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Gestão de Incidentes</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Quando o SLO quebra, o foco muda de feature para <span className="text-white font-bold">fiabilidade</span>. O processo de incidentes é estruturado: detetar, responder, resolver, aprender.
                </p>
              </div>
            </div>
          </div>

          {/* Incident lifecycle */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Ciclo de Vida de um Incidente</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { phase: 'Detect', desc: 'Alerta dispara (SLO breach)', color: 'rose' },
                { phase: 'Respond', desc: 'On-call assume, war room', color: 'amber' },
                { phase: 'Resolve', desc: 'Mitigar → fix → validar', color: 'emerald' },
                { phase: 'Learn', desc: 'Post-mortem → ações', color: 'violet' },
              ].map(p => (
                <div key={p.phase} className={`p-3 rounded-xl border border-${p.color}-500/20 bg-${p.color}-500/5 text-center`}>
                  <div className={`text-sm font-bold text-${p.color}-300`}>{p.phase}</div>
                  <div className="text-2xs text-slate-400 mt-1">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'Incident Commander', desc: 'Toma decisões, comunica, mantém o foco', icon: Activity },
              { role: 'Scribe', desc: 'Documenta timeline e ações em tempo real', icon: Clock },
              { role: 'Ops Lead', desc: 'Lidera a resposta técnica', icon: AlertTriangle },
              { role: 'Comms Lead', desc: 'Comunica stakeholders e updates', icon: Shield },
            ].map(r => (
              <div key={r.role} className="p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                <r.icon size={16} className="text-violet-400 mb-2" />
                <div className="text-sm font-bold text-white">{r.role}</div>
                <div className="text-2xs text-slate-400 mt-1">{r.desc}</div>
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

      {/* ── Blameless Post-Mortem ── */}
      {section === 'blameless' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Shield size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Post-Mortem Blameless</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  O post-mortem <span className="text-white font-bold">blameless</span> foca no <span className="text-violet-300 font-bold">processo</span>, não nas pessoas. A pergunta não é "quem fez isto?", mas "porquê o sistema permitiu isto?".
                </p>
              </div>
            </div>
          </div>

          {/* 5 Whys */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Técnica: 5 Whys</div>
            <div className="space-y-2 text-xs font-mono">
              {[
                { why: 'Porquê?', answer: 'O serviço de pagamento caiu.', color: 'rose' },
                { why: 'Porquê?', answer: 'O deploy recente introduziu um bug.', color: 'rose' },
                { why: 'Porquê?', answer: 'O pipeline CI não tinha testes de integração.', color: 'amber' },
                { why: 'Porquê?', answer: 'Os testes de integração foram desligados por lentidão.', color: 'amber' },
                { why: 'Porquê?', answer: 'Não havia budget para otimizar o pipeline.', color: 'violet' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-${step.color}-400 font-bold shrink-0 w-16`}>{step.why}</span>
                  <span className="text-slate-300">{step.answer}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <span className="font-bold">Causa raiz:</span> falta de investimento em CI — não "o dev X errou"
            </div>
          </div>

          {/* Action items template */}
          <Code code={`# Post-Mortem Template
## Incident
- Data: 2026-03-15 03:42 UTC
- Duração: 23 min
- Severidade: SEV-2 (impacto parcial)

## Timeline
- 03:42 — Alerta SLO breach (p99 > 500ms)
- 03:45 — On-call assume, war room
- 03:52 — Rollback do deploy #4821
- 04:05 — Serviço estabilizado

## Causa Raiz
- Deploy #4821 introduziu query N+1 no service A

## Actions (blameless)
- [ ] Adicionar testes de carga ao CI (owner: @sre-team)
- [ ] Adicionar alertas de latência p99 (owner: @backend-lead)
- [ ] Revisar threshold do SLO com stakeholders (owner: @product)

## Learning
- O pipeline CI não detectou regressão de performance
- Falta de testes de carga = gap sistémico, não humano`} />

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">Qual é o objetivo principal de um post-mortem blameless?</p>
            <div className="space-y-2">
              {[
                'Identificar e punir quem causou o incidente',
                'Documentar o processo para melhorar o sistema e prevenir recorrência',
                'Cumprir requisitos de compliance',
                'Atribuir horas extras à equipa de on-call',
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
