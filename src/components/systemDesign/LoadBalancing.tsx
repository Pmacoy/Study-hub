import { useState } from 'react';
import { Server, Globe, Activity, Shuffle, Minus } from 'lucide-react';

const ALGORITHMS = [
  {
    id: 'round-robin',
    name: 'Round Robin',
    icon: Shuffle,
    description: 'Distribui pedidos ciclicamente por todos os backends. Simples e justo.',
    pros: ['Zero state', 'Distribuição uniforme', 'Implementação trivial'],
    cons: ['Não considera load real dos backends', 'Backends lentos recebem o mesmo load'],
    bestFor: 'Backends homogéneos com load semelhante',
  },
  {
    id: 'least-connections',
    name: 'Least Connections',
    icon: Minus,
    description: 'Encaminha para o backend com menos conexões ativas no momento.',
    pros: ['Adapta-se a load desigual', 'Good para sessions longas'],
    cons: ['Needs tracking de estado', 'Overhead de contagem'],
    bestFor: 'Tráfego com duração variável (WebSockets, DB connections)',
  },
  {
    id: 'weighted',
    name: 'Weighted Round Robin',
    icon: Activity,
    description: 'Cada backend recebe peso proporcional à sua capacidade.',
    pros: ['Considera capacidade diferente', 'Rolling updates fáceis'],
    cons: ['Pesos estáticos — não reage a health changes'],
    bestFor: 'Backends heterogéneos (ex: upgrades em curso)',
  },
  {
    id: 'ip-hash',
    name: 'IP Hash',
    icon: Globe,
    description: 'Hash do IP do cliente determina o backend. Session affinity natural.',
    pros: ['Sticky sessions sem cookies', 'Previsível'],
    cons: ['Distribuição desigual se IPs concentrados', 'Rebalance difícil'],
    bestFor: 'Sessions stateful onde stickiness é necessária',
  },
];

export default function LoadBalancing() {
  const [activeAlgo, setActiveAlgo] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const algo = ALGORITHMS[activeAlgo];
  const AlgoIcon = algo.icon;

  return (
    <div className="space-y-6">
      {/* L4 vs L7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border card-glass card-glass-hover p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server size={16} className="text-sky-400" />
            <h3 className="text-sm font-bold text-white font-display">Layer 4 (Transport)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Balanceia com base em IP + porta. Não vê conteúdo do payload. Mais rápido, menor latência.
          </p>
          <div className="space-y-1.5">
            {['NAT / IPVS / HAProxy TCP', 'Used by: AWS NLB, NGINX stream', 'Ideal para: DNS, VPN, DB proxies'].map((item, i) => (
              <div key={i} className="text-2xs text-sky-200/60 font-mono flex items-center gap-1.5">
                <span className="text-sky-500">›</span>{item}
              </div>
            ))}
          </div>
        </div>
        <div className="border card-glass card-glass-hover p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white font-display">Layer 7 (Application)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Vê o payload HTTP — cookies, headers, paths. Pode fazer routing inteligente.
          </p>
          <div className="space-y-1.5">
            {['NGINX, Envoy, HAProxy HTTP', 'Used by: AWS ALB, Cloudflare', 'Ideal para: APIs, web apps, canary'].map((item, i) => (
              <div key={i} className="text-2xs text-amber-200/60 font-mono flex items-center gap-1.5">
                <span className="text-amber-500">›</span>{item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-500/30">
            <Activity size={18} className="text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Algoritmos de Distribuição</h2>
            <p className="text-xs text-slate-400">Escolhe o algoritmo mais adequado ao teu caso</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {ALGORITHMS.map((a, i) => {
            const AIcon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => setActiveAlgo(i)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  activeAlgo === i
                    ? 'border-sky-500/50 bg-sky-500/10 text-sky-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <AIcon size={18} className={activeAlgo === i ? 'text-sky-400' : 'text-slate-600'} />
                <span className="text-xs font-semibold">{a.name}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlgoIcon size={16} className="text-sky-400" />
            <h3 className="text-sm font-bold text-sky-300">{algo.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{algo.description}</p>
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
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-sky-400 font-semibold">Melhor para:</span>
            <span className="text-slate-300">{algo.bestFor}</span>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-sky-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Num service de WebSockets com sessões de duração variável, qual algoritmo é mais adequado?',
              choices: ['Round Robin', 'Least Connections', 'IP Hash', 'Random'],
              correct: 1,
              explanation: 'Least Connections adapta-se ao load real — sessões longas não sobrecarregam um backend específico.',
            },
            {
              q: 'Qual é a principal vantagem do Layer 7 sobre Layer 4?',
              choices: [
                'Mais rápido (menos overhead)',
                'Pode fazer routing baseado em content (headers, paths, cookies)',
                'Não precisa de estado',
                'Funciona sem TCP',
              ],
              correct: 1,
              explanation: 'L7 vê o payload HTTP e pode fazer content-based routing: /api → backend A, /static → backend B, cookies de session → sticky routing.',
            },
            {
              q: 'Quando usar IP Hash?',
              choices: [
                'Sempre — é o mais justo',
                'Quando precisas de session affinity e não podes usar cookies',
                'Para load balancing em CDN',
                'Nunca — é obsoleto',
              ],
              correct: 1,
              explanation: 'IP Hash garante que um cliente específico vai sempre para o mesmo backend. Útil quando não podes usar cookies (ex: APIs stateful) ou em ambientes com muitos clientes por IP (NAT).',
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
