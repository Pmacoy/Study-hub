import { useState } from 'react';
import { Database, Server, WifiOff, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const CAP_OPTIONS = [
  { id: 'c', label: 'Consistência', desc: 'Todas as leituras vêem a versão mais recente dos dados', icon: Database },
  { id: 'a', label: 'Disponibilidade', desc: 'Cada pedido recebe uma resposta, sem garantia de ser o mais recente', icon: Server },
  { id: 'p', label: 'Tolerância a Particionamento', desc: 'O sistema continua a funcionar mesmo que a rede separticione', icon: WifiOff },
];

type Selected = Record<string, boolean>;

export default function CapTheorem() {
  const [selected, setSelected] = useState<Selected>({ c: true, a: true, p: true });
  const [result, setResult] = useState<{ trade: string; explanation: string; example: string } | null>(null);

  const toggle = (key: string) => {
    const next = { ...selected, [key]: !selected[key] };
    const count = Object.values(next).filter(Boolean).length;
    // Cannot have all 3 at once — always disable one
    if (count > 2) {
      next[key] = false;
    }
    setSelected(next);
    const keys = Object.entries(next).filter(([, v]) => v).map(([k]) => k);
    if (keys.length === 2) {
      const map: Record<string, { trade: string; explanation: string; example: string }> = {
        'cp': {
          trade: 'CP — Consistência + Tolerância a Particionamento',
          explanation: 'Quando ocorre um particionamento de rede, o sistema prefere recusar pedidos (ou servir dados antigos) em vez de responder com dados potencialmente inconsistentes. Exemplos: bancos relacionais distribuídos, sistemas que usam consenso (Paxos/Raft).',
          example: 'PostgreSQL em cluster com streaming replication → se o nó primário fica inacessível, réplicas entram em modo read-only até que a conectividade seja restaurada.',
        },
        'ca': {
          trade: 'CA — Consistência + Disponibilidade (sem particionamento)',
          explanation: 'Só é possível em sistemas single-node ou quando particionamento de rede é impossível. Em sistemas distribuídos reais, P é inevitável, logo CA é uma utopia prática.',
          example: 'Um único servidor PostgreSQL sem replicação → consistente e disponível, mas se o servidor cai, o sistema todo cai (não há tolerância a partição).',
        },
        'ap': {
          trade: 'AP — Disponibilidade + Tolerância a Particionamento',
          explanation: 'O sistema responde a todas as leituras, mesmo que os dados possam estar desatualizados. Quando o particionamento é resolvido, os dados são eventualmente consistente.',
          example: 'DynamoDB, Cassandra, Couchbase → permitem leituras de réplicas potencialmente desatualizadas. Configure consistentRead=false para máxima disponibilidade.',
        },
      };
      setResult(map[keys.sort().join('')] ?? null);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30">
            <AlertTriangle size={18} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Teorema CAP</h2>
            <p className="text-xs text-slate-400">Em qualquer sistema distribuído, só pode garantir 2 dos 3: Consistência, Disponibilidade, Tolerância a Particionamento.</p>
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 mb-5">
          <p className="text-sm text-rose-200/80 leading-relaxed">
            <strong className="text-rose-300">Paul Gilbert (2000):</strong> Quando um sistema distribuído sofre um <span className="text-white font-semibold">particionamento de rede</span> (dois nós não conseguem comunicar), só pode escolher entre servir dados consistentes (CP) ou servir dados disponíveis mas possivelmente desatualizados (AP).
          </p>
        </div>

        {/* CAP selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {CAP_OPTIONS.map((opt) => {
            const active = selected[opt.id];
            const IconComp = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  active
                    ? opt.id === 'c' ? 'border-emerald-500/60 bg-emerald-500/10'
                      : opt.id === 'a' ? 'border-sky-500/60 bg-sky-500/10'
                      : 'border-amber-500/60 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                }`}
              >
                <IconComp size={24} className={active
                  ? opt.id === 'c' ? 'text-emerald-400' : opt.id === 'a' ? 'text-sky-400' : 'text-amber-400'
                  : 'text-slate-600'
                } />
                <span className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{opt.label}</span>
                <span className="text-2xs text-center text-slate-400 leading-relaxed">{opt.desc}</span>
                {active && (
                  <CheckCircle2 size={14} className="absolute top-2 right-2 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {result ? (
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${
              result.trade.startsWith('CP') ? 'border-emerald-500/30 bg-emerald-500/5'
              : result.trade.startsWith('CA') ? 'border-sky-500/30 bg-sky-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
            }`}>
              <h3 className={`text-sm font-black uppercase tracking-wider mb-2 ${
                result.trade.startsWith('CP') ? 'text-emerald-400'
                : result.trade.startsWith('CA') ? 'text-sky-400'
                : 'text-amber-400'
              }`}>{result.trade}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">{result.explanation}</p>
              <div className="bg-slate-900/60 rounded-lg p-3 text-xs text-slate-400 font-mono leading-relaxed">
                <span className="text-slate-500 font-semibold">Exemplo prático:</span>{' '}
                <span className="text-slate-300">{result.example}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="text-2xs font-black uppercase tracking-widest text-slate-500 mb-1">Quando escolher</div>
                <div className="text-xs text-slate-300">
                  {result.trade.startsWith('CP') && 'Transações financeiras, registos médicos, dados que não podem corromper-se.牺牲 disponibilidade em favour de correctness.'}
                  {result.trade.startsWith('CA') && 'Sistemas single-node, ou quando particionamento é fisicamente impossível. Raro em cloud.'}
                  {result.trade.startsWith('AP') && 'Redes sociais, catálogos, métricas. Preferir dados desatualizados a serviço indisponível.'}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="text-2xs font-black uppercase tracking-widest text-slate-500 mb-1">Risco</div>
                <div className="text-xs text-slate-300">
                  {result.trade.startsWith('CP') && 'Reads bloqueados durante partições → time-outs, errores 503.'}
                  {result.trade.startsWith('CA') && 'Um único ponto de falha. Se o nó cai, tudo para.'}
                  {result.trade.startsWith('AP') && 'Stale reads: utilizador vê dados antigos. Pode causar decisões erradas.'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-center">
            <XCircle size={20} className="text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Seleciona exatamente <strong className="text-slate-400">2 dos 3</strong> para ver o trade-off.
              {Object.values(selected).filter(Boolean).length === 3 && (
                <span className="block mt-1 text-amber-400">⚠️ Impossível na prática — o teorema diz que tens de放弃 um.</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Real-world examples */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-rose-400 font-mono mb-4">Sistemas reais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'PostgreSQL (replicação)', model: 'CP', desc: 'Se o primário falha, réplicas entram read-only até recovery.' },
            { name: 'MySQL Group Replication', model: 'CP', desc: 'Usa consenso Paxos-based; escrita bloqueada se多数 nóoffline.' },
            { name: 'DynamoDB', model: 'AP', desc: 'Eventual consistency por default. Opção de consistent reads (custa latência).' },
            { name: 'Cassandra', model: 'AP', desc: 'Tunable consistency: pode pedir strong ou eventual por query.' },
            { name: 'MongoDB (replica set)', model: 'CP', desc: 'Reads de réplicas podem ser stale; writes vão apenas ao primary.' },
            { name: 'etcd / Consul', model: 'CP', desc: 'Consenso Raft; líder eleito, escritas bloqueadas sem quórum.' },
          ].map((item) => (
            <div key={item.name} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-1.5 py-0.5 text-2xs font-black uppercase border ${
                  item.model === 'CP' ? 'border-emerald-500/30 text-emerald-300' : 'border-amber-500/30 text-amber-300'
                }`}>{item.model}</span>
                <span className="text-xs font-semibold text-white">{item.name}</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <QuizSection />
    </div>
  );
}

function QuizSection() {
  const [answer, setAnswer] = useState<number | null>(null);
  const questions = [
    {
      q: 'Num sistema de pagamentos que precisa de garantir que não há double-spend, qual par CAP é mais adequado?',
      choices: ['CA', 'CP', 'AP'],
      correct: 1,
      explanation: 'Double-spend exige consistência forte. Se a rede particionar, prefere-se recusar writes (CP) a aceitar transações duplicadas.',
    },
    {
      q: 'Qual é a principal desvantagem do modelo AP?',
      choices: [
        'Dados nunca ficam consistentes',
        'Leituras podem retornar valores desatualizados (stale reads)',
        'O sistema fica indisponível durante partições',
        'Não suporta escritas concorrentes',
      ],
      correct: 1,
      explanation: 'AP garante disponibilidade, mas reads podem vir de réplicas com dados antigos. A consistência é eventual, não imediata.',
    },
    {
      q: 'O que acontece com um sistema CP quando ocorre um particionamento de rede?',
      choices: [
        'Continua a servir reads/writes normais',
        'Serve dados antigos mas responde sempre',
        'Pode bloquear ou recusar pedidos até o particionamento ser resolvido',
        'Automaticamente faz failover para AP',
      ],
      correct: 2,
      explanation: 'CP escolhe consistência sobre disponibilidade. Se não há quórum, o sistema recusa pedidos para não servir dados inconsistentes.',
    },
  ];

  const current = questions[0];
  return (
    <div className="border card-glass card-glass-hover p-5">
      <h3 className="text-sm font-black uppercase tracking-widest text-rose-400 font-mono mb-4">Testa o teu conhecimento</h3>
      <div className="space-y-4">
        {questions.map((item, qi) => {
          const isAnswered = answer === qi;
          return (
            <div key={qi} className="space-y-2">
              <p className="text-sm text-white font-medium">{qi + 1}. {item.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.choices.map((choice, ci) => {
                  let cls = 'border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700';
                  if (isAnswered) {
                    if (ci === item.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else if (ci === answer && ci !== item.correct) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                  } else if (answer === null && ci === qi) {
                    // Show options for current question
                  }
                  return (
                    <button
                      key={ci}
                      onClick={() => { if (!isAnswered) setAnswer(qi); }}
                      className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${cls}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {isAnswered && (
                <div className={`rounded-lg p-3 text-xs leading-relaxed ${
                  answer === item.correct ? 'bg-emerald-500/10 text-emerald-200/80' : 'bg-rose-500/10 text-rose-200/80'
                }`}>
                  {answer === item.correct ? '✓ Correto! ' : '✗ Incorreto. '}
                  {item.explanation}
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={() => setAnswer(null)}
          className="text-xs text-slate-500 hover:text-slate-300 underline"
        >
          Reiniciar quiz
        </button>
      </div>
    </div>
  );
}
