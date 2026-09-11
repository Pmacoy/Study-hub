import { useState } from 'react';
import { GitMerge, AlertTriangle, CheckCircle2, RotateCw, ArrowRight } from 'lucide-react';

const PATTERNS = [
  {
    id: '2pc',
    name: '2PC (Two-Phase Commit)',
    icon: RotateCw,
    color: 'sky',
    phases: [
      { name: 'Prepare', desc: 'Coordinator pergunta a todos os participantes se podem commitar', action: 'C → P: PREPARE' },
      { name: 'Vote', desc: 'Cada participante faz prepare transaction e vota YES/NO', action: 'P → C: YES/NO' },
      { name: 'Commit Decision', desc: 'Se todos YES, coordinator decide COMMIT; senão ABORT', action: 'C decide' },
      { name: 'Commit/Ack', desc: 'Coordinator envia decisão, participantes confirmam', action: 'C → P: COMMIT/ABORT' },
    ],
    pros: ['Simples conceitualmente', 'Strong consistency', 'Amplamente implementado'],
    cons: ['Blocking — se coordinator cair, participantes bloqueiam', '2 rounds de latência', 'Single point of failure no coordinator'],
    latency: '2 rounds de rede',
    faultTolerance: 'Coordinator falha = bloqueio dos participantes',
  },
  {
    id: '3pc',
    name: '3PC (Three-Phase Commit)',
    icon: RotateCw,
    color: 'violet',
    phases: [
      { name: 'CanCommit', desc: 'Coordinator pergunta se todos podem participar', action: 'C → P: CAN_COMMIT?' },
      { name: 'PreCommit', desc: 'Se todos YES, coordinator envia pre-commit', action: 'C → P: PRE_COMMIT' },
      { name: 'DoCommit', desc: 'Participantes confirmam, coordinator decide commit', action: 'P → C: ACK → C → P: COMMIT' },
    ],
    pros: ['Não blocking — participantes podem decidir sem coordinator', 'Timeout permite progress'],
    cons: ['3 rounds de latência', 'Mais complexo', 'Pode falhar se rede particionar durante pre-commit'],
    latency: '3 rounds de rede',
    faultTolerance: 'Participantes não bloqueiam, mas podem abortar erroneamente',
  },
  {
    id: 'saga',
    name: 'Saga Pattern',
    icon: GitMerge,
    color: 'emerald',
    phases: [
      { name: 'Execute', desc: 'Cada serviço executa sua transação local', action: 'S1: transação local' },
      { name: 'Compensate', desc: 'Se falhar, execute compensações na ordem inversa', action: 'S2: compensação de S1' },
    ],
    pros: ['Sem coordinator central', 'Alta disponibilidade', 'Tolerante a partições'],
    cons: ['Compensação pode falhar (needs idempotency)', 'Não é ACID', 'Complexidade operacional'],
    latency: 'N rounds (sequencial)',
    faultTolerance: 'Tolera falhas individuais de serviço',
  },
  {
    id: 'tcc',
    name: 'TCC (Try-Confirm-Cancel)',
    icon: CheckCircle2,
    color: 'amber',
    phases: [
      { name: 'Try', desc: 'Reservar recursos nos serviços participantes', action: 'S1: reservar recursos' },
      { name: 'Confirm', desc: 'Confirmar a operação (release real)', action: 'S2: confirmar' },
      { name: 'Cancel', desc: 'Se falhar, cancela reservas', action: 'S3: liberar recursos' },
    ],
    pros: ['Sem locks bloqueantes', 'Alto throughput', 'Sem coordinator forte'],
    cons: ['Cada serviço precisa implementar 3 métodos', 'Conflict handling complexo', 'Não atomicity forte'],
    latency: '2 rounds (Try → Confirm/Cancel)',
    faultTolerance: 'Try pode ser retryado com idempotência',
  },
];

export default function DistributedTransactions() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const pattern = PATTERNS[active];
  const PatternIcon = pattern.icon;

  return (
    <div className="space-y-6">
      {/* Pattern selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <GitMerge size={18} className="text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Transações Distribuídas</h2>
            <p className="text-xs text-slate-400">ACID através de múltiplos serviços/nós</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {PATTERNS.map((p, i) => {
            const PIcon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  active === i
                    ? `border-${p.color}-500/50 bg-${p.color}-500/10`
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <PIcon size={16} className={active === i ? `text-${p.color}-400` : 'text-slate-600'} />
                <span className={`text-xs font-semibold text-center ${active === i ? 'text-white' : 'text-slate-500'}`}>{p.name.split('(')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active pattern */}
        <div className={`rounded-xl border border-${pattern.color}-500/20 bg-${pattern.color}-500/5 p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <PatternIcon size={16} className={`text-${pattern.color}-400`} />
            <h3 className={`text-sm font-bold text-${pattern.color}-300`}>{pattern.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 font-mono">{pattern.latency} · {pattern.faultTolerance}</p>

          {/* Flow */}
          <div className="mb-4 space-y-2">
            <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Fluxo</span>
            {pattern.phases.map((phase, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-2xs font-bold text-slate-400">{i + 1}</div>
                <span className="text-xs text-white font-medium">{phase.name}</span>
                <ArrowRight size={12} className="text-slate-600 shrink-0" />
                <span className="text-2xs font-mono text-slate-400">{phase.action}</span>
                <span className="text-xs text-slate-500">{phase.desc}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-emerald-400 font-mono">Vantagens</span>
              <ul className="mt-2 space-y-1">
                {pattern.pros.map((p, i) => (
                  <li key={i} className="text-xs text-emerald-200/70">✓ {p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-rose-400 font-mono">Desvantagens</span>
              <ul className="mt-2 space-y-1">
                {pattern.cons.map((c, i) => (
                  <li key={i} className="text-xs text-rose-200/70">✗ {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Comparação</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 font-mono text-2xs uppercase">
                <th className="text-left pb-2">Padrão</th>
                <th className="text-left pb-2">Latência</th>
                <th className="text-left pb-2">Coordenação</th>
                <th className="text-left pb-2">Atomicidade</th>
                <th className="text-left pb-2">Melhor para</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[
                { name: '2PC', latency: '2 rounds', coord: 'Centralizado (coordinator)', atomic: 'Forte', best: 'DBs tradicionais, XA' },
                { name: '3PC', latency: '3 rounds', coord: 'Centralizado (timeout)', atomic: 'Forte (não-blocking)', best: 'Sistemas críticos com tolerância a falhas' },
                { name: 'Saga', latency: 'N rounds', coord: 'Orquestração ou Coreografia', atomic: 'Eventual (compensação)', best: 'Microserviços, alta disponibilidade' },
                { name: 'TCC', latency: '2 rounds', coord: 'Distribuído (sem coordinator)', atomic: 'Fraca (confirm/cancel)', best: 'Alto throughput, reservas temporárias' },
              ].map((row, i) => (
                <tr key={i} className="border-t border-slate-800">
                  <td className="py-2.5 font-semibold text-teal-300">{row.name}</td>
                  <td className="py-2.5 font-mono text-slate-400">{row.latency}</td>
                  <td className="py-2.5 text-slate-400">{row.coord}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-2xs font-bold ${
                      row.atomic.includes('Forte') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>{row.atomic}</span>
                  </td>
                  <td className="py-2.5 text-slate-400">{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Qual é o principal problema do 2PC?',
              choices: [
                'É muito lento',
                'Blocking — participantes podem ficar bloqueados se coordinator falhar',
                'Não garante atomicidade',
                'Requer 4 rounds de comunicação',
              ],
              correct: 1,
              explanation: 'Se o coordinator falhar após enviar PREPARE mas antes de enviar COMMIT/ABORT, os participantes ficam em estado incerto — bloqueados até o coordinator recovery ou timeout.',
            },
            {
              q: 'No padrão Saga, o que acontece se um serviço falhar durante a execução?',
              choices: [
                'O sistema entra em deadlock',
                'Todas as transações anteriores são roll backed atomicamente',
                'Executam-se compensações (compensating transactions) na ordem inversa',
                'O coordinator retrya infinitamente',
              ],
              correct: 2,
              explanation: 'Saga usa compensações: se o serviço 3 falhar, executa-se compensate(S2) e compensate(S1). Isto não é rollback atômico — compensações podem também falhar, exigindo retrabalho manual.',
            },
            {
              q: 'Quando escolher TCC sobre Saga?',
              choices: [
                'Sempre — TCC é sempre melhor',
                'Quando os serviços já suportam Try/Confirm/Cancel e precisas de alta disponibilidade',
                'Nunca — Saga substitui TCC completamente',
                'Quando não há rede disponível',
              ],
              correct: 1,
              explanation: 'TCC é ideal quando cada serviço pode implementar 3 operações (try/reservar, confirm/confirmar, cancel/liberar). Evita locks bloqueantes e é mais rápido que Saga em throughput, mas exige mudança na interface dos serviços.',
            },
          ].map((item, qi) => (
            <div key={qi} className="space-y-2">
              <p className="text-sm text-white font-medium">{qi + 1}. {item.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.choices.map((choice, ci) => {
                  let cls = 'border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700';
                  if (quizAnswer === qi) {
                    if (ci === item.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else cls = 'border-slate-800 bg-slate-900/30 text-slate-600';
                  }
                  return (
                    <button
                      key={ci}
                      onClick={() => setQuizAnswer(quizAnswer === qi ? null : qi)}
                      className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${cls}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {quizAnswer === qi && (
                <div className="rounded-lg bg-sky-500/10 border border-sky-500/30 p-3 text-xs text-sky-200/80">
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
          {quizAnswer !== null && (
            <button onClick={() => setQuizAnswer(null)} className="text-xs text-slate-500 hover:text-slate-300 underline">
              Reiniciar quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
