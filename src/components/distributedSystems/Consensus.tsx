import { useState } from 'react';
import { Shuffle, ShieldCheck, Activity, CheckCircle2, XCircle } from 'lucide-react';

const ALGORITHMS = [
  {
    id: 'paxos',
    name: 'Paxos',
    icon: Shuffle,
    complexity: 'Alta',
    faultTolerance: 'Falha crash (f < n/2)',
    useCase: 'Google Chubby, ZooKeeper (base)',
    description: 'Algoritmo clássico de consenso proposto por Lamport. Funciona em 3 fases: Propose → Accept → Learn.',
    phases: [
      'Phase 1a (Prepare): Proposer envia prepare com nonce incrementado',
      'Phase 1b (Accepted): Acceptors respondem com max proposal vista',
      'Phase 2a (Propose): Proposer envia value com acceptor maioritário',
      'Phase 2b (Accepted): Acceptors confirmam o value',
      'Phase 3 (Learn): Decisão é learn quando majority aceita',
    ],
    pros: ['Teoricamente mínimo de rounds', 'Funciona com mensagens assíncronas', 'Base para muitos sistemas reais'],
    cons: ['Extremamente difícil de implementar corretamente', 'Múltiplas variantes (Multi-Paxos)', 'Leader election separada'],
  },
  {
    id: 'raft',
    name: 'Raft',
    icon: Activity,
    complexity: 'Média',
    faultTolerance: 'Falha crash (f < n/2)',
    useCase: 'etcd, Consul, CockroachDB, TiKV',
    description: 'Design focado em compreensibilidade. Dividido em sub-problemas: leader election, log replication, safety.',
    phases: [
      'Leader Election: Nodes começam como Follower → Candidate → Leader com timeouts',
      'Log Replication: Leader recebe append_entries, Followers replicam',
      'Safety: Leader só commita entradas de termos anteriores',
      'Commit: Quando replicado em majority, entrada é committed',
      'Server Rules: Candidate precisa de majority, Leader precisa replicar no termo atual',
    ],
    pros: ['Fácil de entender e implementar', 'Leader election integrado', '强 guarantees de safety'],
    cons: ['Não tolera nós byzantinos', 'Election timeout pode causar flapping', 'Mais rounds que Paxos em teoria'],
  },
  {
    id: 'pbft',
    name: 'PBFT',
    icon: ShieldCheck,
    complexity: 'Muito Alta',
    faultTolerance: 'Byzantine (f < n/3)',
    useCase: 'Blockchain, sistemas com confiança zero',
    description: 'Byzantine Fault Tolerant — funciona mesmo com nós maliciosos. Requer 3f+1 nós para tolerar f falhas.',
    phases: [
      'Pre-Prepare: Client envia request, Primary seleciona sequência',
      'Prepare: Primary broadcast prepare, replicas validam e preparam',
      'Commit: Quando 2f+1 prepares, replica emite commit',
      'Reply: Quando 2f+1 commits, resposta enviada ao client',
      'View Change: Se primary é byzantine, novos nós elegem novo primary',
    ],
    pros: ['Tolera nós maliciosos (byzantine)', 'Não requer trusted hardware', 'Fundamental para blockchains'],
    cons: ['O(n²) mensagens — impraticável para muitos nós', 'Latência 3x maior que Raft', 'Complexidade extrema'],
  },
];

export default function Consensus() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const algo = ALGORITHMS[active];
  const AlgoIcon = algo.icon;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <Shuffle size={18} className="text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Algoritmos de Consenso</h2>
            <p className="text-xs text-slate-400">Como nós distribuídos chegam a um acordo</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Consenso é o problema fundamental de sistemas distribuídos: <strong className="text-teal-300">como garantir que múltiplos nós concordem com um valor</strong>, mesmo quando alguns falham ou comunicam-se de forma não-confiável?
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: 'Crash Faults', desc: 'Nós param de responder', color: 'sky' },
            { label: 'Byzantine', desc: 'Nós agem maliciosamente', color: 'rose' },
            { label: 'Quorum n/2+1', desc: 'Majoria decide', color: 'emerald' },
          ].map((item, i) => (
            <div key={i} className={`rounded-lg bg-${item.color}-500/5 border border-${item.color}-500/20 p-3 text-center`}>
              <div className={`text-xs font-bold text-${item.color}-300`}>{item.label}</div>
              <div className="text-2xs text-slate-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {ALGORITHMS.map((a, i) => {
            const AIcon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => setActive(i)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  active === i
                    ? 'border-teal-500/50 bg-teal-500/10'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AIcon size={16} className={active === i ? 'text-teal-400' : 'text-slate-600'} />
                  <span className={`text-sm font-bold ${active === i ? 'text-white' : 'text-slate-500'}`}>{a.name}</span>
                </div>
                <div className="text-2xs text-slate-500 space-y-0.5">
                  <div>Complexidade: <span className="text-slate-400">{a.complexity}</span></div>
                  <div>Falhas: <span className="text-slate-400">{a.faultTolerance}</span></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active algorithm detail */}
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlgoIcon size={16} className="text-teal-400" />
            <h3 className="text-sm font-bold text-teal-300">{algo.name}</h3>
            <span className="ml-auto text-2xs text-slate-500 font-mono">{algo.useCase}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{algo.description}</p>

          <div className="mb-4">
            <span className="text-2xs font-black uppercase tracking-widest text-teal-400 font-mono">Fases do Algoritmo</span>
            <ol className="mt-2 space-y-1.5">
              {algo.phases.map((phase, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-2xs font-bold text-teal-300">{i + 1}</span>
                  <span>{phase}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-emerald-400 font-mono">Vantagens</span>
              <ul className="mt-2 space-y-1">
                {algo.pros.map((p, i) => (
                  <li key={i} className="text-xs text-emerald-200/70">✓ {p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-rose-400 font-mono">Desvantagens</span>
              <ul className="mt-2 space-y-1">
                {algo.cons.map((c, i) => (
                  <li key={i} className="text-xs text-rose-200/70">✗ {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Comparação</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 font-mono text-2xs uppercase">
                <th className="text-left pb-2">Algoritmo</th>
                <th className="text-left pb-2">Tipos de Falha</th>
                <th className="text-left pb-2">Complexidade</th>
                <th className="text-left pb-2">Mensagens</th>
                <th className="text-left pb-2">Uso Principal</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {ALGORITHMS.map((a, i) => (
                <tr key={a.id} className="border-t border-slate-800">
                  <td className="py-2.5 font-semibold text-teal-300">{a.name}</td>
                  <td className="py-2.5">{a.faultTolerance.split('(')[0].trim()}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-2xs font-bold ${
                      a.complexity === 'Baixa' ? 'bg-emerald-500/20 text-emerald-300' :
                      a.complexity === 'Média' ? 'bg-amber-500/20 text-amber-300' :
                      a.complexity === 'Alta' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>{a.complexity}</span>
                  </td>
                  <td className="py-2.5 font-mono text-slate-400">
                    {a.id === 'pbft' ? 'O(n²)' : a.id === 'paxos' ? 'O(n)' : 'O(n)'}
                  </td>
                  <td className="py-2.5 text-slate-400">{a.useCase}</td>
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
              q: 'Quantos nós são necessários no mínimo para o PBFT tolerar 2 falhas byzantinas?',
              choices: ['3 nós', '5 nós', '6 nós', '7 nós'],
              correct: 3,
              explanation: 'PBFT requer n ≥ 3f+1 nós. Para f=2: 3×2+1 = 7 nós.',
            },
            {
              q: 'Qual é a principal vantagem do Raft sobre o Paxos?',
              choices: [
                'Tolera mais falhas',
                'Não precisa de majoria',
                'É muito mais fácil de entender e implementar corretamente',
                'Funciona com nós byzantinos',
              ],
              correct: 2,
              explanation: 'Raft foi projetado para ser compreensível, dividindo o problema em leader election, log replication e safety separadamente. Paxos é teoricamente eficiente mas extremamente difícil de implementar.',
            },
            {
              q: 'No Paxos, o que acontece se dois proposers competirem simultaneamente?',
              choices: [
                'O sistema entra em deadlock',
                'Um é eleito leader usando nonce/posição maior',
                'Ambos falham e o sistema trava',
                'A decisão é randomizada',
              ],
              correct: 1,
              explanation: 'O proposta com nonce/posição maior vence. Acceptors sempre aceitam o prepare com maior nonce, forçando o proposer perdedor a desistir e tentar novamente.',
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
