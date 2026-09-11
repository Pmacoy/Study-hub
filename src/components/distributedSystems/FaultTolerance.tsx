import { useState } from 'react';
import { ShieldCheck, Server, Database, AlertTriangle, RefreshCw, Users } from 'lucide-react';

const STRATEGIES = [
  {
    id: 'primary-backup',
    name: 'Primary-Backup',
    icon: Server,
    description: 'Um nó primário processa todas as escritas e replica para réplicas. Simples mas single point of failure no primário.',
    pros: ['Simples de implementar', 'Ordem de escritas garantida', 'Consistência forte'],
    cons: ['Primário é bottleneck', 'Failover lento', 'Single point of failure'],
    examples: ['PostgreSQL streaming replication', 'MySQL master-slave'],
  },
  {
    id: 'multi-primary',
    name: 'Multi-Primary',
    icon: Users,
    description: 'Todos os nós aceitam escritas. Mais complexo mas sem bottleneck central.',
    pros: ['Sem single point of failure', 'Mais throughput', 'Disponibilidade em failover'],
    cons: ['Conflitos de escrita', 'Necessita conflict resolution', 'Complexidade elevada'],
    examples: ['CockroachDB', 'Cassandra (all nodes writable)'],
  },
  {
    id: 'quorum',
    name: 'Quorum (Read/Write)',
    icon: Database,
    description: 'Escrita requer Nw acks, leitura Nr acks. Nw + Nr > N garante consistência.',
    pros: ['Balanceia latência e consistência', 'Tolerante a falhas parciais', 'Sem nó central'],
    cons: ['Latência depende de quorum', 'Configuração Nw/Nr crítica', 'Anel hash complexo'],
    examples: ['DynamoDB', 'Cassandra', 'Amazon S3 (original)'],
  },
];

const FAILURE_MODELS = [
  { name: 'Crash-Stop', desc: 'Nó para de responder. O mais simples.', tolerance: 'f < n/2' },
  { name: 'Crash-Resume', desc: 'Nó para e depois volta (com state perdido).', tolerance: 'f < n/2' },
  { name: 'Omission', desc: 'Nó omite enviar/receber mensagens pontualmente.', tolerance: 'f < n/2' },
  { name: 'Timing', desc: 'Nó responde fora de tempo (slow/unpredictable).', tolerance: 'Timing bounds necessários' },
  { name: 'Byzantine', desc: 'Nó age arbitrariamente (malicioso, dados errados).', tolerance: 'f < n/3 (PBFT)' },
];

const REDUNDANCY = [
  { type: 'N+1', desc: 'N nós + 1 de backup. Tola 1 falha.', example: '3 DBs + 1 standby' },
  { type: '2N', desc: '2 cópias de cada dado. Tola 1 falha por partição.', example: 'GFS, HDFS replication=2' },
  { type: '2N+1', desc: '2 cópias + quorum. Tola falhas com consistência.', example: 'Raft com 3 nós' },
];

export default function FaultTolerance() {
  const [activeStrategy, setActiveStrategy] = useState(0);
  const [simNodes, setSimNodes] = useState(3);
  const [failedNodes, setFailedNodes] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const strategy = STRATEGIES[activeStrategy];
  const StrategyIcon = strategy.icon;
  const works = simNodes - failedNodes >= Math.ceil(simNodes / 2) + 1;

  return (
    <div className="space-y-6">
      {/* Strategy selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <ShieldCheck size={18} className="text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Estratégias de Replicação</h2>
            <p className="text-xs text-slate-400">Como manter dados disponíveis durante falhas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
          {STRATEGIES.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStrategy(i)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  activeStrategy === i
                    ? 'border-teal-500/50 bg-teal-500/10'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <SIcon size={14} className={`shrink-0 ${activeStrategy === i ? 'text-teal-400' : 'text-slate-600'}`} />
                <span className={`text-xs font-semibold ${activeStrategy === i ? 'text-white' : 'text-slate-500'}`}>{s.name.split('(')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active strategy */}
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StrategyIcon size={16} className="text-teal-400" />
            <h3 className="text-sm font-bold text-teal-300">{strategy.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{strategy.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-emerald-400 font-mono">Vantagens</span>
              <ul className="mt-2 space-y-1">
                {strategy.pros.map((p, i) => (
                  <li key={i} className="text-xs text-emerald-200/70">✓ {p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-rose-400 font-mono">Desvantagens</span>
              <ul className="mt-2 space-y-1">
                {strategy.cons.map((c, i) => (
                  <li key={i} className="text-xs text-rose-200/70">✗ {c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-teal-400 font-semibold">Exemplos:</span>
            <span className="text-slate-300 font-mono">{strategy.examples.join(' · ')}</span>
          </div>
        </div>
      </div>

      {/* Failure simulator */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Simulador de Falhas</h3>
        <div className="flex items-center gap-4 mb-5">
          <div>
            <label className="text-xs text-slate-400">Total de nós: {simNodes}</label>
            <input type="range" min={3} max={7} value={simNodes} onChange={e => setSimNodes(Number(e.target.value))} className="w-32 ml-2" />
          </div>
          <div>
            <label className="text-xs text-slate-400">Nós falhados: {failedNodes}</label>
            <input type="range" min={0} max={simNodes - 1} value={failedNodes} onChange={e => setFailedNodes(Number(e.target.value))} className="w-32 ml-2" />
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${works ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
            {works ? '✓ Sistema opera' : '✗ Quorum perdido'}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {Array.from({ length: simNodes }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono ${
                i < failedNodes ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {i < failedNodes ? <AlertTriangle size={12} /> : <Server size={12} />}
              Node {i + 1}
            </div>
          ))}
        </div>
        <p className="text-2xs text-slate-500">
          Com {simNodes} nós, o quorum é {Math.ceil(simNodes / 2) + 1}.
          {failedNodes > 0 ? ` Com ${failedNodes} falhas, restam ${simNodes - failedNodes} nós operacionais.` : ''}
        </p>
      </div>

      {/* Failure models */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Modelos de Falha</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FAILURE_MODELS.map((m, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold ${
                  m.name === 'Byzantine' ? 'text-rose-400' :
                  m.name === 'Timing' ? 'text-amber-400' : 'text-teal-400'
                }`}>{m.name}</span>
              </div>
              <p className="text-2xs text-slate-500">{m.desc}</p>
              <div className="mt-2 text-2xs font-mono text-slate-600">Tolerância: {m.tolerance}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Num sistema com 5 nós usando quorum, quantos nós precisam responder para uma leitura consistente?',
              choices: ['2 nós', '3 nós', '4 nós', '5 nós'],
              correct: 1,
              explanation: 'Quorum = majoria = ⌈n/2⌉+1 = 3 nós. Com Nw=3 e Nr=3, Nw+Nr=6 > 5, garantindo sobreposição.',
            },
            {
              q: 'Qual modelo de falha exige o maior número de nós para tolerância?',
              choices: ['Crash-Stop', 'Crash-Resume', 'Timing', 'Byzantine'],
              correct: 3,
              explanation: 'Byzantine requer n ≥ 3f+1, enquanto crash-stop precisa apenas f < n/2. Para tolerar 2 falhas: Byzantine = 7 nós vs crash = 5 nós.',
            },
            {
              q: 'O que é state machine replication?',
              choices: [
                'Replicar o estado em memória',
                'Todos os nós executam as mesmas operações na mesma ordem, produzindo o mesmo estado',
                'Backup periódico do disco',
                'Checkpointing de transações',
              ],
              correct: 1,
              explanation: 'SMR garante que todos os nós, partindo do mesmo estado inicial e aplicando as mesmas operações na mesma ordem, chegam ao mesmo estado final. O consenso garante a ordem.',
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
