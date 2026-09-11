import { useState } from 'react';
import { MessageSquare, Radio, Truck, Zap } from 'lucide-react';

const PATTERNS = [
  {
    id: 'pub-sub',
    name: 'Pub/Sub',
    icon: Radio,
    description: 'Publishers enviam messages para tópicos. Subscribers recebem tudo do tópico que os interessa.',
    pros: ['Decoupling total entre producers e consumers', 'Fan-out natural (1 pub → N subs)', 'Escalabilidade horizontal'],
    cons: ['Ordering pode perder-se', 'Redelivery complex sem ack', 'Consumer lag se processing lento'],
    example: 'Topic: orders.created\n├── Sub A: email-service (envia confirmação)\n├── Sub B: inventory-service (reserva stock)\n└── Sub C: analytics-service (registra evento)',
    delivery: 'At-least-once (default) ou exactly-once (com idempotency + dedup)',
  },
  {
    id: 'queue',
    name: 'Work Queue',
    icon: Truck,
    description: 'Workers competem por messages de uma fila. Cada message é processada por UM worker.',
    pros: ['Load balancing automático entre workers', 'Backpressure natural (fila enche = producer espera)', 'Simples de escalar horizontal'],
    cons: ['Single consumer por message', 'Worker crash = message perdida (sem ack)', 'Order não-garantida entre filas'],
    example: 'Fila: image-processing\nWorker 1: resize image 5MB\nWorker 2: generate thumbnail\nWorker 3: extract metadata\n→ Cada image processada por UM worker',
    delivery: 'At-least-once com ack; exactly-once com idempotency key',
  },
  {
    id: 'streaming',
    name: 'Event Streaming',
    icon: MessageSquare,
    description: 'Logs imutáveis de events com retention. Consumers leem em qualquer offset, reprocessam se necessário.',
    pros: ['Replay de events histórico', 'Time-travel debugging', 'Múltiplos consumers independentes', 'Backpressure + buffering'],
    cons: ['Complexidade operacional', 'Retention storage cost', 'Exactly-once exige design careful'],
    example: 'Kafka topic: user-events (retention 7 dias)\nConsumer Group A: real-time analytics (lag ~0s)\nConsumer Group B: data warehouse (lag ~5min)\nConsumer Group C: fraud detection (replays últimos 24h)',
    delivery: 'At-least-once por default. Exactly-once com idempotent writes + transactions entre topics.',
  },
  {
    id: 'rpc',
    name: 'Request/Reply (Síncrono)',
    icon: Zap,
    description: 'Client faz request e espera response. Simples mas acoplado e com timeout risks.',
    pros: ['Simples de raciocinar', 'Response imediato', 'Fácil debugging'],
    cons: ['Cascading failures', 'Timeouts propagam-se', 'Acoplamento temporal (ambos online)', 'Bottleneck no caller'],
    example: 'API Gateway → Order Service → Payment Service → Notification Service\n→ Se Payment demora 30s, Gateway timeout.',
    delivery: '100% guarantee com retry + circuit breaker, mas latency alta.',
  },
];

export default function Messaging() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const pattern = PATTERNS[active];
  const PatternIcon = pattern.icon;

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
            <MessageSquare size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Message Queues & Event Patterns</h2>
            <p className="text-xs text-slate-400">Comunicação assíncrona entre services</p>
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
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <PIcon size={18} className={active === i ? 'text-amber-400' : 'text-slate-600'} />
                <span className="text-xs font-semibold text-center">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <PatternIcon size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300">{pattern.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{pattern.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 mb-3">
            <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Exemplo</span>
            <pre className="mt-2 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{pattern.example}</pre>
          </div>
          <div className="text-xs text-slate-400">
            <span className="text-amber-300 font-semibold">Delivery guarantee:</span> {pattern.delivery}
          </div>
        </div>
      </div>

      {/* Delivery guarantees */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 font-mono mb-4">Delivery Guarantees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'At-most-once', desc: 'Message entregues zero ou uma vez. Perda possível.', example: 'Logs, metrics — perder um evento é aceitável', color: 'rose' },
            { name: 'At-least-once', desc: 'Message entregue uma ou mais vezes. Duplicados possíveis.', example: 'Pedidos: idempotency key previne duplicates', color: 'amber' },
            { name: 'Exactly-once', desc: 'Message entregue uma e só uma vez. Mais complexo.', example: 'Transações financeiras; precisa de idempotency + dedup', color: 'emerald' },
          ].map((g) => (
            <div key={g.name} className={`rounded-xl border border-${g.color}-500/20 bg-${g.color}-500/5 p-3`}>
              <span className={`text-xs font-black text-${g.color}-400`}>{g.name}</span>
              <p className="text-2xs text-slate-400 mt-1 leading-relaxed">{g.desc}</p>
              <p className="text-2xs text-slate-500 font-mono mt-2">{g.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Num sistema de pagamentos, porque é que "at-least-once" + idempotency é preferível a "exactly-once"?',
              choices: [
                'Exactly-once é impossível em sistemas distribuídos',
                'At-least-once é mais rápido e idempotency resolve duplicates',
                'Exatamente-once requer 2PC que é muito lento',
                'A e C estão corretas',
              ],
              correct: 3,
              explanation: 'Exactly-once é teoricamente possível mas pragmaticamente requer 2PC ou similar, que bloqueia recursos. A abordagem padrão da indústria: at-least-once delivery + idempotency key + dedup table.',
            },
            {
              q: 'Quando é que um Work Queue é melhor que Pub/Sub?',
              choices: [
                'Quando precisas de fan-out (1→N)',
                'Quando tens múltiplos workers a processar tasks independentes',
                'Quando precisas de replay de events históricos',
                'Nunca — queues são obsoletas',
              ],
              correct: 1,
              explanation: 'Work Queue: cada message é processada por UM worker (competição). Ideal para background jobs (processar image, enviar email). Pub/Sub: cada message vai para TODOS os subscribers.',
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
