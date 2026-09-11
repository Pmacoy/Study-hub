import { useState } from 'react';
import { GitBranch, RotateCw, Minus, Plus } from 'lucide-react';

export default function RecursionBacktracking() {
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showTree, setShowTree] = useState(false);

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <GitBranch size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Recursão & Backtracking</h2>
            <p className="text-xs text-slate-400">Divide & Conquer, tail recursion, e resolução por tentativa e erro</p>
          </div>
        </div>

        {/* Recursion tree */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <RotateCw size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">Árvore de Recursão: Fib(5)</span>
            <button onClick={() => setShowTree(!showTree)} className="ml-auto text-2xs text-cyan-400 hover:text-cyan-300 underline">
              {showTree ? 'Recolher' : 'Expandir'}
            </button>
          </div>
          {showTree && (
            <div className="font-mono text-2xs text-slate-400 space-y-1">
              <div>fib(5)</div>
              <div className="ml-4">├── fib(4)</div>
              <div className="ml-8">├── fib(3)</div>
              <div className="ml-12">├── fib(2) → 1</div>
              <div className="ml-12">└── fib(1) → 1</div>
              <div className="ml-8">└── fib(2) → 1</div>
              <div className="ml-4">└── fib(3)</div>
              <div className="ml-8">├── fib(2) → 1</div>
              <div className="ml-8">└── fib(1) → 1</div>
              <div className="mt-2 text-emerald-400">Resultado: 5 chamadas únicas, 15 totais (sem memo!)</div>
            </div>
          )}
          {!showTree && <div className="text-xs text-slate-500">Clique "Expandir" para ver a árvore de recursão de fib(5)</div>}
        </div>

        {/* Patterns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { name: 'Tail Recursion', desc: 'A chamada recursiva é a última operação. Pode ser otimizada pelo compilador (TCE).', example: 'function sum(n, acc=0) {\n  return n===0 ? acc : sum(n-1, acc+n);\n}' },
            { name: 'Divide & Conquer', desc: 'Divide o problema em subproblemas independentes, resolve recursivamente, combina resultados.', example: 'Merge Sort: divide ao meio,\nordena cada metade,\nmescla os resultados.' },
            { name: 'Backtracking', desc: 'Tenta uma opção, recua se levar a impasse, tenta a próxima. Usado em puzzles e combinatorics.', example: 'N-Queens: coloca rainha,\nrecursivamente resolve resto,\nse impossível, backtracking.' },
            { name: 'Recursão de Cauda vs Non-tail', desc: 'Tail recursion usa O(1) stack; non-tail usa O(n) stack porque precisa voltar para combinar.', example: 'Non-tail fib(5) guarda\n5 frames na stack.\nTail fib(5) usa 1 frame.' },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-300">{p.name}</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed mb-2">{p.desc}</p>
              <pre className="text-2xs font-mono text-slate-600 whitespace-pre-wrap">{p.example}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            { q: 'Qual é a diferença principal entre tail recursion e non-tail recursion?', choices: ['Tail é mais rápida sempre', 'Tail usa O(1) stack space (com TCE); non-tail usa O(n)', 'Não há diferença prática', 'Non-tail não pode ser recursiva'], correct: 1, explanation: 'Com Tail Call Optimization (TCE), a stack frame atual é reutilizada para a chamada recursiva — O(1) espaço. Sem TCE (como em JavaScript sem transpilation), ambas usam O(n) stack.' },
            { q: 'No backtracking do N-Queens, quando é que fazemos backtrack?', choices: ['Sempre após colocar a primeira rainha', 'Quando uma posição leva a um impasse (não há posição válida para a próxima rainha)', 'Nunca — backtracking é só teoria', 'Quando todas as rainhas são colocadas'], correct: 1, explanation: 'Backtracking ocorre quando, ao colocar uma rainha numa posição, não conseguimos colocar as restantes. Retiramos a rainha (backtrack) e tentamos a próxima coluna.' },
            { q: 'Quantas chamadas recursivas são feitas para fib(5) sem memoization?', choices: ['5', '8', '15', 'Infinitas'], correct: 2, explanation: 'fib(5) → fib(4)+fib(3) → fib(3)+fib(2)+fib(2)+fib(1) → ... total de 15 chamadas (incluindo as 5 folhas: fib(0)×3, fib(1)×5). Com memoization seriam apenas 5 chamadas únicas.' },
          ].map((item, qi) => (
            <div key={qi} className="space-y-2">
              <p className="text-sm text-white font-medium">{qi + 1}. {item.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.choices.map((choice, ci) => {
                  let cls = 'border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700';
                  if (quizAnswer === qi) { if (ci === item.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'; else cls = 'border-slate-800 bg-slate-900/30 text-slate-600'; }
                  return <button key={ci} onClick={() => setQuizAnswer(quizAnswer === qi ? null : qi)} className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${cls}`}>{choice}</button>;
                })}
              </div>
              {quizAnswer === qi && <div className="rounded-lg bg-sky-500/10 border border-sky-500/30 p-3 text-xs text-sky-200/80">{item.explanation}</div>}
            </div>
          ))}
          {quizAnswer !== null && <button onClick={() => setQuizAnswer(null)} className="text-xs text-slate-500 hover:text-slate-300 underline">Reiniciar quiz</button>}
        </div>
      </div>
    </div>
  );
}
