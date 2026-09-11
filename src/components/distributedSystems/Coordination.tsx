import { useState } from 'react';
import { Lock, Server, GitBranch, Gauge } from 'lucide-react';

const TOOLS = [
  {
    id: 'zk',
    name: 'ZooKeeper',
    icon: Server,
    description: 'O clássico do ecossistema Hadoop. Hierarquia de znodes com watches.',
    pros: ['Consistência forte (ZAB protocol)', 'Amadurecido e battle-tested', 'Watches eficientes'],
    cons: ['Operacionalmente complexo', 'Requer ensemble par (3,5,7 nós)', 'ZNode limit ~1M'],
    useCase: 'Kafka offset tracking, Hadoop coordination',
  },
  {
    id: 'etcd',
    name: 'etcd',
    icon: Gauge,
    description: 'Build sobre Raft. API key-value simples, TTL, leases,_WATCH.',
    pros: ['Consistente e disponível', 'TTL natural para locks', 'Integrado com Kubernetes'],
    cons: ['Limitação de tamanho (~1MB por key)', 'Necessita tuning para high throughput'],
    useCase: 'Kubernetes, service discovery, distributed locks',
  },
  {
    id: 'consul',
    name: 'Consul',
    icon: GitBranch,
    description: 'Service mesh + key-value + health checking com LAN/WAN gears.',
    pros: ['Service discovery nativo', 'Multi-datacenter', 'Sane UI'],
    cons: ['Mais pesado que etcd', 'Consistência em WAN trade-off'],
    useCase: 'Service mesh, multi-DC discovery, secret management',
  },
];

export default function Coordination() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [lockOwner, setLockOwner] = useState<string | null>(null);
  const [lockHeld, setLockHeld] = useState(false);

  const tool = TOOLS[active];
  const ToolIcon = tool.icon;

  return (
    <div className="space-y-6">
      {/* Tools selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <Lock size={18} className="text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Coordenação Distribuída</h2>
            <p className="text-xs text-slate-400">Locks, leader election e state shared</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
          {TOOLS.map((t, i) => {
            const TIcon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  active === i
                    ? 'border-teal-500/50 bg-teal-500/10'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <TIcon size={14} className={`shrink-0 ${active === i ? 'text-teal-400' : 'text-slate-600'}`} />
                <span className={`text-xs font-semibold ${active === i ? 'text-white' : 'text-slate-500'}`}>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active tool */}
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ToolIcon size={16} className="text-teal-400" />
            <h3 className="text-sm font-bold text-teal-300">{tool.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{tool.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-emerald-400 font-mono">Vantagens</span>
              <ul className="mt-2 space-y-1">
                {tool.pros.map((p, i) => (
                  <li key={i} className="text-xs text-emerald-200/70">✓ {p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-rose-400 font-mono">Desvantagens</span>
              <ul className="mt-2 space-y-1">
                {tool.cons.map((c, i) => (
                  <li key={i} className="text-xs text-rose-200/70">✗ {c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-teal-400 font-semibold">Use case:</span>
            <span className="text-slate-300">{tool.useCase}</span>
          </div>
        </div>
      </div>

      {/* Lock simulation */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Simulador: Distributed Lock</h3>
        <p className="text-xs text-slate-400 mb-4">Cria e release locks usando TTL. Se o proprietário crashar, o lock expira.</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {['Alice', 'Bob', 'Charlie'].map((name) => (
            <div key={name} className={`rounded-xl border p-3 text-center ${
              lockOwner === name ? 'border-teal-500/50 bg-teal-500/10' : 'border-slate-800 bg-slate-900/40'
            }`}>
              <div className={`text-sm font-bold ${lockOwner === name ? 'text-teal-300' : 'text-slate-400'}`}>{name}</div>
              <div className="text-2xs text-slate-500 mt-1">
                {lockOwner === name ? '🔒 Lock holder' : '🔓 Locked'}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {!lockHeld ? (
            <>
              {['Alice', 'Bob', 'Charlie'].map(name => (
                <button
                  key={name}
                  onClick={() => { setLockOwner(name); setLockHeld(true); }}
                  className="px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 text-xs text-teal-300 hover:bg-teal-500/20"
                >
                  {name} requisita lock
                </button>
              ))}
            </>
          ) : (
            <button
              onClick={() => { setLockOwner(null); setLockHeld(false); }}
              className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 hover:bg-rose-500/20"
            >
              {lockOwner} release lock
            </button>
          )}
          {lockHeld && (
            <button
              onClick={() => { setLockOwner(null); setLockHeld(false); }}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 hover:bg-amber-500/20"
            >
              💀 {lockOwner} crash (lock TTL expire)
            </button>
          )}
        </div>

        <div className="mt-4 rounded-lg bg-slate-900/60 border border-slate-800 p-3 text-xs text-slate-400">
          <strong className="text-teal-400">Patção Redlock:</strong> Lock distribuído com múltiplos servidores independentes. Requer quorum de acks (N/2+1) para ser válido.
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Por que ZooKeeper requer um número ímpar de nós no ensemble?',
              choices: [
                'Para economia de hardware',
                'Para permitir quorum (majoria) — um número par não diferencia majoria de minoria',
                'Porque Raft não funciona com pares',
                'Para evitar split-brain em datacenters',
              ],
              correct: 1,
              explanation: 'Com 3 nós, quorum = 2. Com 4 nós, quorum também seria 3 — mas 4 nós têm o mesmo poder de tolerância a falhas que 3, desperdiçando um nó. Ímpar maximiza tolerância para o mesmo número de nós.',
            },
            {
              q: 'Qual é o risco do padrão Redlock com 5 servidores e quorum 3?',
              choices: [
                'Nenhum — é infalível',
                'Se a rede particionar tal que 2 servidores ficam isolados, o lock pode ser夺ido por ambos os lados',
                'Redlock é mais lento que lock local',
                'Necessita de timestamp global',
              ],
              correct: 1,
              explanation: 'Redlock não é infalível. Se houver particionamento de rede ou GC pause longo, dois clientes podem adquirir o lock simultaneamente — ambos têm 3 acks de subconjuntos diferentes.',
            },
            {
              q: 'Quando usar etcd vs ZooKeeper para distributed locks?',
              choices: [
                'Sempre etcd — ZooKeeper é obsoleto',
                'ZooKeeper para legacy Hadoop; etcd para Kubernetes e sistemas modernos',
                'Sempre ZooKeeper — é mais rápido',
                'Depende do formato de lock, não da ferramenta',
              ],
              correct: 1,
              explanation: 'ZooKeeper ainda domina em ecossistemas Hadoop (Kafka, HBase). etcd é o padrão para Kubernetes e novos projetos — API mais simples, TTL nativo, e integração com Raft built-in.',
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
