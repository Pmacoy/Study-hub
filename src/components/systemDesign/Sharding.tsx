import { useState } from 'react';
import { Hash, ArrowRightLeft, Database, AlertTriangle } from 'lucide-react';

const SHARDING_STRATEGIES = [
  {
    id: 'range',
    name: 'Range Sharding',
    description: 'Cada shard guarda um range de valores (ex: IDs 1-1M, 1M-2M).',
    pros: ['Range queries eficientes', 'Ordenação natural preservada', 'Facilita scaling horizontal'],
    cons: ['Hotspots em ranges populares', 'Rebalanceamento complexo', 'Boundary leaks'],
    example: 'Users A-M → Shard 1, N-Z → Shard 2\nOrders por date range → shard weekly',
    bestFor: 'Queries por range (datas, IDs sequenciais)',
  },
  {
    id: 'hash',
    name: 'Hash Sharding',
    description: 'Hash do key determina o shard: shard = hash(key) % N.',
    pros: ['Distribuição uniforme', 'Sem hotspots', 'Simple de implementar'],
    cons: ['Range queries obrigam a scatter-gather', 'Rebalanceamento requer re-hash'],
    example: 'shard_id = hash(user_id) % 8\n# user_id 12345 → shard 3\n# user_id 67890 → shard 1',
    bestFor: 'Lookup por key (user_id, order_id)',
  },
  {
    id: 'consistent-hash',
    name: 'Consistent Hashing',
    description: 'Hash ring: shards posicionados num circle. Minimiza reshuffle ao adicionar/remover shards.',
    pros: ['Mínimo data movement ao scale', 'Virtual nodes均衡am load', 'Sem central coordinator'],
    cons: ['Complexidade adicional', 'Virtual nodes extra memory', 'Heatmaps de load não-triviais'],
    example: 'Ring: [S1:100] ... [S2:500] ... [S3:900]\nKey 350 → vai para S2 (next clockwise)\nRemove S2 → keys redistribuem só para S1+S3',
    bestFor: 'Sistemas que scalen frequentemente (CDNs, distributed caches)',
  },
  {
    id: 'directory',
    name: 'Directory-Based',
    description: 'Tabela de lookup central mapeia key → shard. Desacoplado dos dados.',
    pros: ['Flexibilidade total', 'Rebalance = update lookup', 'Sem re-sharding de dados'],
    cons: ['Lookup table é single point of failure', 'Latência extra de lookup', 'Needs high availability'],
    example: 'lookup.get(user_id) → "shard-7"\nshard-7.query("SELECT * FROM users WHERE id=123")',
    bestFor: 'Sistemas com frequência de rebalance alto',
  },
];

export default function Sharding() {
  const [activeShard, setActiveShard] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const strategy = SHARDING_STRATEGIES[activeShard];
  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <Database size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Sharding de Base de Dados</h2>
            <p className="text-xs text-slate-400">Divide dados em múltiplos shards paraescala horizontal</p>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-5">
          <p className="text-sm text-emerald-200/80 leading-relaxed">
            <strong className="text-emerald-300">Problema:</strong> Um único DB não escala para milhões de queries/segundo.
            Sharding reparti dados por key em múltiplos servidores — cada um gerencia um subconjunto.
          </p>
        </div>

        {/* Strategy selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
          {SHARDING_STRATEGIES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveShard(i)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeShard === i
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-bold block ${activeShard === i ? 'text-emerald-300' : 'text-slate-400'}`}>
                {s.name}
              </span>
            </button>
          ))}
        </div>

        {/* Active strategy */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h3 className="text-sm font-bold text-emerald-300 mb-2">{strategy.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{strategy.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 mb-3">
            <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Exemplo</span>
            <pre className="mt-2 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{strategy.example}</pre>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ArrowRightLeft size={12} className="text-emerald-400" />
            <span className="text-emerald-200/70"><strong>Best for:</strong> {strategy.bestFor}</span>
          </div>
        </div>
      </div>

      {/* Cross-shard challenges */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={18} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white font-display">Desafios Cross-Shard</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Join entre shards', desc: 'Não é possível fazer JOIN entre tables em shards diferentes. Needs app-level aggregation ou materialized views.', fix: 'Redesenhar schema: evitar joins cross-shard, usar denormalização' },
            { title: 'Distributed transactions', desc: '2PC (Two-Phase Commit) funciona mas é lento e bloqueante.', fix: 'Saga pattern ou transactions assíncronas com compensação' },
            { title: 'Rebalanceamento', desc: 'Adicionar/remover shards requer mover dados. Interrupção de service.', fix: 'Consistent hashing minimiza movimento; online re-sharding move dados incrementalmente' },
            { title: 'Hotspot', desc: 'Keys populares criam hotspots num shard específico.', fix: 'Surrogate keys com hash, o app split key em sub-keys' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-xs font-bold text-amber-300">{item.title}</span>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              <p className="text-2xs text-emerald-300/70 mt-1 font-mono">→ {item.fix}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Qual sharding strategy minimiza data movement ao adicionar um novo shard?',
              choices: ['Range sharding', 'Hash sharding', 'Consistent hashing', 'Directory-based'],
              correct: 2,
              explanation: 'Consistent hashing faz com que apenas ~1/N dos dados precisem ser movidos ao adicionar/remover um shard. Hash sharding tradicional requer re-hash de TODOS os dados.',
            },
            {
              q: 'Qual é o principal problema do Range Sharding?',
              choices: [
                'Não suporta writes',
                'Hotspots em ranges populares e balanceamento difícil',
                'Requer criptografia',
                'Impossível em PostgreSQL',
              ],
              correct: 1,
              explanation: 'Users A-M vão todos para um shard, N-Z para outro. Se users N-Z são muito mais ativos, esse shard fica sobrecarregado. Rebalancear require mover dados entre shards.',
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
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-200/80">
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
