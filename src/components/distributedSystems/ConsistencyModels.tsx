import { useState } from 'react';
import { Scale, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const MODELS = [
  {
    id: 'strong',
    name: 'Strong Consistency',
    icon: CheckCircle2,
    color: 'emerald',
    description: 'Todas as leituras retornam o valor da última escrita. Todos os nós vêem a mesma ordem.',
    latency: 'Alta (espera acks de todos)',
    availability: 'Baixa durante partições',
    examples: 'Spanner, DynamoDB (consistentRead=true), databases relacionais',
    tradeoff: 'Consistência máxima, disponibilidade mínima em falhas de rede.',
  },
  {
    id: 'eventual',
    name: 'Eventual Consistency',
    icon: AlertTriangle,
    color: 'amber',
    description: 'Se nenhuma escrita nova, todas as leituras eventualmente convergem para o mesmo valor.',
    latency: 'Baixa (read de qualquer réplica)',
    availability: 'Alta (replicas respondem sempre)',
    examples: 'DynamoDB, Cassandra, DNS, memcached',
    tradeoff: 'Dados podem estar stale. Divergência possível durante partições.',
  },
  {
    id: 'causal',
    name: 'Causal Consistency',
    icon: Scale,
    color: 'sky',
    description: 'Eventos causalmente relacionados são vistos na mesma ordem por todos. Concorrentes podem divergir.',
    latency: 'Média',
    availability: 'Média-Alta',
    examples: 'Cassandra (quorum), Amazon DynamoDB (session)',
    tradeoff: 'Mais forte que eventual, mais fraco que strong. Preserva causalidade.',
  },
  {
    id: 'session',
    name: 'Session Consistency',
    icon: CheckCircle2,
    color: 'violet',
    description: 'Garantias válidas dentro de uma única sessão: read-your-writes, monotonic reads/writes.',
    latency: 'Baixa-Média',
    availability: 'Alta',
    examples: 'AWS DynamoDB session guarantees, Azure Cosmos DB session consistency',
    tradeoff: 'Bom equilíbrio para UX. Só garante dentro da mesma sessão.',
  },
];

export default function ConsistencyModels() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const model = MODELS[active];
  const ModelIcon = model.icon;

  return (
    <div className="space-y-6">
      {/* Model selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <Scale size={18} className="text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Modelos de Consistência</h2>
            <p className="text-xs text-slate-400">O preço da consistência vs disponibilidade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
          {MODELS.map((m, i) => {
            const MIcon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  active === i
                    ? `border-${m.color}-500/50 bg-${m.color}-500/10`
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <MIcon size={14} className={`shrink-0 ${active === i ? `text-${m.color}-400` : 'text-slate-600'}`} />
                <span className={`text-xs font-semibold ${active === i ? 'text-white' : 'text-slate-500'}`}>{m.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active model */}
        <div className={`rounded-xl border border-${model.color}-500/20 bg-${model.color}-500/5 p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <ModelIcon size={16} className={`text-${model.color}-400`} />
            <h3 className={`text-sm font-bold text-${model.color}-300`}>{model.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{model.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Latência</span>
              <p className="mt-1 text-xs text-slate-300">{model.latency}</p>
            </div>
            <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Disponibilidade</span>
              <p className="mt-1 text-xs text-slate-300">{model.availability}</p>
            </div>
          </div>
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 mb-3">
            <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Exemplos</span>
            <p className="mt-1 text-xs font-mono text-slate-300">{model.examples}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertTriangle size={12} className="text-amber-400" />
            <span className="text-amber-200/70"><strong>Trade-off:</strong> {model.tradeoff}</span>
          </div>
        </div>
      </div>

      {/* Read-your-writes demo */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Garantias de Sessão</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'Read-Your-Writes', desc: 'Após escrever, tu sempre lês o que escreveste (na mesma sessão)', guarantee: 'Sempre' },
            { name: 'Monotonic Reads', desc: 'Se viste o valor X, nunca verás um valor mais antigo depois', guarantee: 'Sempre' },
            { name: 'Monotonic Writes', desc: 'Escritas são ordenadas — nunca B antes de A (na mesma sessão)', guarantee: 'Sempre' },
          ].map((g, i) => (
            <div key={i} className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-teal-300">{g.name}</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed">{g.desc}</p>
              <div className="mt-2 text-2xs font-mono text-emerald-400">Garantia: {g.guarantee}</div>
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
              q: 'Num sistema com strong consistency e 3 réplicas, quantas precisam ACK para uma escrita ser considerada commitada?',
              choices: ['1', '2', '3 (todas)', '2/3 (majoria)'],
              correct: 2,
              explanation: 'Strong consistency exige que TODAS as réplicas aceitem a escrita antes de confirmar. Isto maximiza consistência mas minimiza disponibilidade durante partições.',
            },
            {
              q: 'O que acontece num sistema com eventual consistency durante uma partição de rede?',
              choices: [
                'As leituras falham imediatamente',
                'Réplicas separadas podem servir valores diferentes até a partição ser resolvida',
                'Todas as escritas são perdidas',
                'O sistema entra em deadlock',
              ],
              correct: 1,
              explanation: 'Eventual consistency permite divergência durante partições. Quando a rede se restaura, mecanismos de anti-entropy (gossip, merge) convergem os valores.',
            },
            {
              q: 'Qual modelo de consistência oferece o melhor equilíbrio para aplicações web consumer?',
              choices: ['Strong', 'Eventual', 'Session consistency', 'Causal'],
              correct: 2,
              explanation: 'Session consistency garante boa UX (read-your-writes) sem o custo de strong consistency. É o padrão em AWS DynamoDB, Azure Cosmos DB e a maioria de APIs modernas.',
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
