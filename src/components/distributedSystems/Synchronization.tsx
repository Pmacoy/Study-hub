import { useState } from 'react';
import { Clock, Binary, ArrowRight, Gauge } from 'lucide-react';

const PROCESSES = ['P1', 'P2', 'P3'];

export default function Synchronization() {
  const [tick, setTick] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const clocks = {
    P1: [1, 2, 3, 4, 5, 6, 7, 8],
    P2: [1, 2, 3, 4, 5, 6, 7],
    P3: [1, 2, 3, 4],
  };

  const events = [
    { step: 0, desc: 'P1: evento local' },
    { step: 1, desc: 'P2: evento local' },
    { step: 2, desc: 'P1 → P2: envia mensagem (P1.c=2)' },
    { step: 3, desc: 'P2: recebe → max(P2.c, 2)+1 = 3' },
    { step: 4, desc: 'P3: evento local' },
    { step: 5, desc: 'P1 → P3: envia mensagem (P1.c=4)' },
    { step: 6, desc: 'P3: recebe → max(P3.c, 4)+1 = 3 (já maior)' },
  ];

  const currentStep = events[Math.min(tick, events.length - 1)];

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <Clock size={18} className="text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Sincronização</h2>
            <p className="text-xs text-slate-400">Relógios lógicos e ordenação de eventos</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Em sistemas distribuídos, <strong className="text-teal-300">não há relógio global sincronizado</strong>. Relógios lógicos permitem ordenar eventos sem sincronia física.
        </p>
      </div>

      {/* Lamport Clock Walkthrough */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Walkthrough: Relógio de Lamport</h3>
        <p className="text-xs text-slate-400 mb-4">
          Regra: (1) Evento local → C++. (2) Send → C++. (3) Receive → C = max(C_local, C_msg) + 1
        </p>

        {/* Clock display */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {PROCESSES.map((p, i) => (
            <div key={p} className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-teal-300 font-mono">{p}</span>
                <Clock size={12} className="text-teal-500" />
              </div>
              <div className="space-y-1">
                {clocks[p as keyof typeof clocks].map((v, vi) => {
                  const isHighlighted = events[tick]?.desc.includes(p) && (
                    (p === 'P1' && vi === 1) ||
                    (p === 'P2' && vi === 2) ||
                    (p === 'P3' && vi === 0)
                  );
                  return (
                    <div key={vi} className={`text-2xs font-mono px-2 py-1 rounded ${
                      isHighlighted ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-900/40 text-slate-500'
                    }`}>
                      e{vi + 1}: {v}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Step controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setTick(t => Math.max(0, t - 1))} disabled={tick === 0} className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-white disabled:opacity-30">
            ← Anterior
          </button>
          <button onClick={() => setTick(t => Math.min(events.length - 1, t + 1))} disabled={tick >= events.length - 1} className="px-3 py-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 text-xs text-teal-300 hover:bg-teal-500/20 disabled:opacity-30">
            Próximo →
          </button>
          <span className="text-xs text-slate-500 font-mono">Passo {tick + 1}/{events.length}</span>
        </div>
        <div className="mt-3 rounded-lg bg-slate-900/60 border border-slate-800 p-3 text-xs text-slate-300">
          <span className="text-teal-400 font-semibold">{currentStep.desc}</span>
        </div>
      </div>

      {/* Clock types */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-teal-400 font-mono mb-4">Tipos de Relógio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'Lamport Timestamps', icon: Clock, desc: 'Ordenação causal parcial. Um número inteiro por processo. Não captura causalidade completa.', pros: ['Simples', 'Baixo overhead'], cons: ['Não detecta causalidade entre eventos concorrentes'] },
            { name: 'Vector Clocks', icon: Binary, desc: 'Vetor de N componentes. Cada processo rastreia o progresso de todos os outros.', pros: ['Detecta causalidade completa', 'Ordenação total possível'], cons: ['O(n) espaço por mensagem', 'Mais complexo'] },
            { name: 'Hybrid Clocks', icon: Gauge, desc: 'Combina Lamport com tempo físico. Usado no CockroachDB.', pros: ['Boa ordenação causal', 'Sincronização física razoável'], cons: ['Requer NTP', 'Skew pode causar anomalias'] },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={14} className="text-teal-400" />
                <span className="text-xs font-bold text-white">{item.name}</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed mb-3">{item.desc}</p>
              <div className="space-y-1">
                {item.pros.map((p, pi) => (
                  <div key={pi} className="text-2xs text-emerald-400">✓ {p}</div>
                ))}
                {item.cons.map((c, ci) => (
                  <div key={ci} className="text-2xs text-rose-400">✗ {c}</div>
                ))}
              </div>
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
              q: 'Se e → e\' (e precede causalmente e\'), o que sabemos sobre os timestamps de Lamport?',
              choices: [
                'C(e) < C(e\')',
                'C(e) > C(e\')',
                'C(e) = C(e\')',
                'Não há relação garantida',
              ],
              correct: 0,
              explanation: 'Se e ocorre antes de e\' causalmente, então C(e) < C(e\'). A recíproca não é verdadeira: C(e) < C(e\') não implica causalidade (eventos concorrentes podem ter timestamps diferentes).',
            },
            {
              q: 'Quantos componentes tem um Vector Clock para um sistema com 4 processos?',
              choices: ['1', '2', '4', 'Infinito'],
              correct: 2,
              explanation: 'Vector Clock tem N componentes, um para cada processo. Com 4 processos: [C1, C2, C3, C4]. Cada processo incrementa apenas a sua própria componente nos eventos locais.',
            },
            {
              q: 'O que acontece com o relógio de P2 ao receber uma mensagem de P1 com timestamp 5?',
              choices: [
                'P2.c = 5',
                'P2.c = 6',
                'P2.c = max(P2.c, 5) + 1',
                'P2.c não muda',
              ],
              correct: 2,
              explanation: 'Regra de receive: C = max(C_local, C_msg) + 1. Se P2 tinha C=3 e recebe mensagem com 5: max(3,5)+1 = 6.',
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
