import { useState } from 'react';
import { Layers, Database, RefreshCw, ArrowRight, Zap, Shield } from 'lucide-react';

const STRATEGIES = [
  {
    id: 'cache-aside',
    name: 'Cache-Aside (Lazy Loading)',
    icon: Layers,
    color: 'violet',
    description: 'A application lê do cache; se miss, lê do DB e popula o cache.',
    pros: ['Simples de implementar', 'Cache só guarda dados acessados', 'Não sobrecarrega o DB'],
    cons: ['Primeira leitura sempre vai ao DB', 'Dados podem estar stale até expire TTL', 'Cache stampede se vários requests simultan�os'],
    code: `// Leitura
data = cache.get(key)
if not data:
    data = db.query(key)
    cache.set(key, data, ttl=300)

// Escrita
db.update(key, value)
cache.delete(key)  # invalida, não atualiza`,
    useCase: 'Leituras muito mais frequentes que escritas. Padrão mais comum em produção.',
  },
  {
    id: 'write-through',
    name: 'Write-Through',
    icon: ArrowRight,
    color: 'sky',
    description: 'Escrita vai simultaneamente para o DB e para o cache. Cache sempre consistente.',
    pros: ['Cache nunca fica stale', 'Leituras subsequentes são fast', 'Simples mental model'],
    cons: ['Write latency mais alta (espera cache + DB)', 'Cache preenche-se mesmo com dados nunca lidos', 'Overhead em writes frequentes'],
    code: `// Leitura
data = cache.get(key)
if not data:
    data = db.query(key)
    cache.set(key, data, ttl=600)

// Escrita — síncrona
db.update(key, value)
cache.set(key, value, ttl=600)  # ambos atualizados`,
    useCase: 'Quando consistência é crítica e writes não são o bottleneck.',
  },
  {
    id: 'write-behind',
    name: 'Write-Behind (Write-Back)',
    icon: RefreshCw,
    color: 'emerald',
    description: 'Escrita vai só ao cache primeiro; cache sincroniza com DB em background.',
    pros: ['Writes super rápidas (só cache)', 'Cache coalesce múltiplas writes', 'Menos stress no DB'],
    cons: ['Risco de perda de dados se cache crash antes de sync', 'Complexo: precisa de ack assíncrono', 'Latência de leitura pode ser stale'],
    code: `// Escrita — assíncrona
cache.set(key, value, ttl=600)
async_flush_to_db(key, value)  # background thread

// Flush batch
def flush_batch():
    for key, val in pending_writes:
        db.update(key, val)
    pending_writes.clear()`,
    useCase: 'High-throughput writes onde latência importa mais que consistência imediata.',
  },
  {
    id: 'read-through',
    name: 'Read-Through',
    icon: Database,
    color: 'amber',
    description: 'Cache gerencia automaticamente carga do DB. App só fala com cache.',
    pros: ['App não precisa saber de DB', 'Cache warmed automaticamente', 'Transparência total'],
    cons: ['Cache precisa implementar interface de DB', 'Debug mais difícil', 'Acoplamento cache-DB'],
    code: `# App só interage com cache
cache = ReadThroughCache(db_connection, ttl=300)

data = cache.get(key)  # cache gerencia load do DB
cache.set(key, value)  # cache gerencia write-through

# App nunca chama db.query diretamente`,
    useCase: 'Quando muitos services diferentes acedem aos mesmos dados.',
  },
];

export default function CachingStrategies() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const strategy = STRATEGIES[active];
  const StrategyIcon = strategy.icon;

  return (
    <div className="space-y-6">
      {/* Strategy selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
            <Layers size={18} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Estratégias de Cache</h2>
            <p className="text-xs text-slate-400">Trade-offs entre consistência, latência e complexidade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
          {STRATEGIES.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  active === i
                    ? `border-${s.color}-500/50 bg-${s.color}-500/10`
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <SIcon size={14} className={`shrink-0 ${active === i ? `text-${s.color}-400` : 'text-slate-600'}`} />
                <span className={`text-xs font-semibold ${active === i ? 'text-white' : 'text-slate-500'}`}>
                  {s.name.split('(')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active strategy detail */}
        <div className={`rounded-xl border border-${strategy.color}-500/20 bg-${strategy.color}-500/5 p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <StrategyIcon size={16} className={`text-${strategy.color}-400`} />
            <h3 className={`text-sm font-bold text-${strategy.color}-300`}>{strategy.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{strategy.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-emerald-400 font-mono">Vantagens</span>
              <ul className="mt-2 space-y-1">
                {strategy.pros.map((p, i) => (
                  <li key={i} className="text-xs text-emerald-200/70 flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
              <span className="text-2xs font-black uppercase tracking-widest text-rose-400 font-mono">Desvantagens</span>
              <ul className="mt-2 space-y-1">
                {strategy.cons.map((c, i) => (
                  <li key={i} className="text-xs text-rose-200/70 flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 mb-3">
            <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Exemplo de uso</span>
            <pre className="mt-2 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{strategy.code}</pre>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap size={12} className="text-amber-400" />
            <span className="text-amber-200/70"><strong>Use quando:</strong> {strategy.useCase}</span>
          </div>
        </div>
      </div>

      {/* Decision tree */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-violet-400 font-mono mb-4">Árvore de decisão</h3>
        <div className="space-y-3">
          {[
            { q: 'Consistência forte é obrigatória?', a1: 'Sim → Write-Through', a2: 'Não → continua' },
            { q: 'Writes são muito mais frequentes que reads?', a1: 'Sim → Write-Behind', a2: 'Não → continua' },
            { q: 'Vários services acedem aos mesmos dados?', a1: 'Sim → Read-Through', a2: 'Não → Cache-Aside' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 border border-violet-500/40 text-xs font-black text-violet-300">
                {i + 1}
              </div>
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-xs font-semibold text-white mb-1">{step.q}</p>
                <div className="grid grid-cols-2 gap-2 text-2xs">
                  <span className="text-emerald-400">→ {step.a1}</span>
                  <span className="text-slate-500">{step.a2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-violet-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Qual estratégia dá a melhor latência de write?',
              choices: ['Cache-Aside', 'Write-Through', 'Write-Behind', 'Read-Through'],
              correct: 2,
              explanation: 'Write-Behind só escreve no cache (síncrono) e faz flush assíncrono ao DB. É a mais rápida em write.',
            },
            {
              q: 'Qual é o risco principal do Write-Behind?',
              choices: [
                'Dados sempre stale',
                'Perda de dados se cache falhar antes do flush',
                'Latência de leitura alta',
                'Impossível implementar em Redis',
              ],
              correct: 1,
              explanation: 'Se o cache crash antes de sincronizar com o DB, as writes não-flushadas são perdidas. Use ACKs e replication para mitigar.',
            },
          ].map((item, qi) => (
            <div key={qi} className="space-y-2">
              <p className="text-sm text-white font-medium">{qi + 1}. {item.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.choices.map((choice, ci) => {
                  const isSelected = quizAnswer === qi;
                  let cls = 'border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700';
                  if (isSelected) {
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

      {/* TTL & Invalidation */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-sky-400" />
          <h3 className="text-sm font-bold text-white font-display">TTL & Invalidção</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { pattern: 'TTL (Time-To-Live)', desc: 'Dados expiram após N segundos. Simples mas pode servir stale data.', example: 'Redis: SET key value EX 300' },
            { pattern: 'Invalidção por evento', desc: 'Delete do cache quando dados mudam. Mais consistente, mas precisa de saber quem modifica.', example: 'PUB/SUB para broadcast invalidate' },
            { pattern: 'LRU / LFU eviction', desc: 'Quando cache full, remove os menos usados. Não elimina staleness, só gerencia memória.', example: 'Redis: maxmemory-policy allkeys-lru' },
            { pattern: 'Cache stampede protection', desc: 'Sem Semaphore/Singleflight, muitos requests batem no DB simultaneamente. Use mutex ou requestId.', example: 'Redis SET NX com TTL atómico' },
          ].map((item) => (
            <div key={item.pattern} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-xs font-bold text-sky-300">{item.pattern}</span>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              <pre className="mt-2 text-2xs font-mono text-slate-600">{item.example}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
