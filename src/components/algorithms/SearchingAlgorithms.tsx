import { useState } from 'react';
import { Search, Hash, ArrowRightLeft } from 'lucide-react';

const SEARCH_ALGOS = [
  { id: 'linear', name: 'Linear Search', time: 'O(n)', space: 'O(1)', requiresSorted: false, desc: 'Varre elemento por elemento até encontrar o alvo. Funciona em qualquer estrutura.' },
  { id: 'binary', name: 'Binary Search', time: 'O(log n)', space: 'O(1)', requiresSorted: true, desc: 'Divide o espaço de busca ao meio repetidamente. Muito mais rápido, mas requer array ordenado.' },
  { id: 'hash', name: 'Hash Lookup', time: 'O(1) avg', space: 'O(n)', requiresSorted: false, desc: 'Hash function mapeia chave para índice. Lookup em tempo constante, mas usa memória extra.' },
  { id: 'interp', name: 'Interpolation Search', time: 'O(log log n)', space: 'O(1)', requiresSorted: true, desc: 'Estima a posição do alvo baseado na distribuição dos dados. Mais rápido que binary em dados uniformes.' },
];

export default function SearchingAlgorithms() {
  const [active, setActive] = useState(1);
  const [searchIndex, setSearchIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const array = [3, 7, 12, 18, 24, 31, 38, 45, 52, 60, 67, 74, 81, 88, 95];
  const target = 45;
  const binaryPath = [0, 7, 4, 6, 5]; // indices visited in binary search
  const isSearching = searchIndex < binaryPath.length;
  const visitedIndex = isSearching ? binaryPath[searchIndex] : binaryPath[binaryPath.length - 1];

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Search size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Algoritmos de Pesquisa</h2>
            <p className="text-xs text-slate-400">Encontrar dados de forma eficiente</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {SEARCH_ALGOS.map((s, i) => (
            <button key={s.id} onClick={() => setActive(i)}
              className={`px-3 py-2 rounded-xl border text-left transition-all ${active === i ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'}`}>
              <div className={`text-xs font-bold ${active === i ? 'text-cyan-300' : 'text-slate-500'}`}>{s.name.split(' ')[0]}</div>
              <div className="text-2xs font-mono text-slate-600 mt-0.5">{s.time}</div>
            </button>
          ))}
        </div>

        {/* Binary search visualization */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Search size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">Visualização: Binary Search — procurar {target}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {array.map((val, i) => {
              const isTarget = val === target;
              const isVisited = isSearching && i === visitedIndex;
              const isInBounds = isSearching && i >= binaryPath[binaryPath.length - 1 - (searchIndex < binaryPath.length - 1 ? 1 : 0)] && i <= binaryPath[Math.min(searchIndex + 1, binaryPath.length - 1)];
              return (
                <div key={i} className={`w-8 h-8 flex items-center justify-center rounded text-2xs font-mono border ${
                  isTarget ? 'bg-emerald-500/30 border-emerald-500/60 text-emerald-300 font-bold' :
                  isVisited ? 'bg-cyan-500/30 border-cyan-500/60 text-cyan-300' :
                  'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}>{val}</div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSearchIndex(0)} disabled={!isSearching} className="px-2 py-1 rounded border border-slate-700 text-2xs text-slate-400 disabled:opacity-30">Reiniciar</button>
            <button onClick={() => setSearchIndex(i => Math.min(binaryPath.length - 1, i + 1))} disabled={!isSearching} className="px-2 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-2xs text-cyan-300 disabled:opacity-30">Próximo passo →</button>
            <span className="text-2xs text-slate-500 self-center">{isSearching ? `Passo ${searchIndex + 1} — índice ${visitedIndex} = ${array[visitedIndex]}` : '✓ Encontrado em 3 comparações!'}</span>
          </div>
        </div>

        {/* Active algo detail */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            {active === 0 ? <Search size={16} className="text-cyan-400" /> : active === 1 ? <ArrowRightLeft size={16} className="text-cyan-400" /> : <Hash size={16} className="text-cyan-400" />}
            <h3 className="text-sm font-bold text-cyan-300">{SEARCH_ALGOS[active].name}</h3>
            {!SEARCH_ALGOS[active].requiresSorted && <span className="ml-auto text-2xs text-slate-500">Não requer ordenado</span>}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{SEARCH_ALGOS[active].desc}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-2 text-center">
              <div className="text-2xs text-slate-500 font-mono">Tempo</div>
              <div className="text-xs font-mono text-cyan-300">{SEARCH_ALGOS[active].time}</div>
            </div>
            <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-2 text-center">
              <div className="text-2xs text-slate-500 font-mono">Espaço</div>
              <div className="text-xs font-mono text-cyan-300">{SEARCH_ALGOS[active].space}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            { q: 'Num array de 1024 elementos ordenados, quantas comparações no máximo o Binary Search precisa?', choices: ['10', '11', '1024', '512'], correct: 1, explanation: 'Binary search faz O(log n) comparações. log₂(1024) = 10, mas no pior caso precisa de 11 (ceil de log₂(n+1)).' },
            { q: 'Quando Hash Lookup é pior que Binary Search?', choices: ['Sempre', 'Quando há muitos colisions', 'Nunca — hash é sempre O(1)', 'Só em arrays pequenos'], correct: 1, explanation: 'Com many collisions, hash lookup degrada para O(n) no pior caso. Binary Search garante O(log n) em arrays ordenados.' },
            { q: 'Interpolation Search assume que os dados são...', choices: ['Ordenados e uniformemente distribuídos', 'Aleatórios', 'Em forma de árvore', 'Sempre positivos'], correct: 0, explanation: 'Interpolation Search estim a posição usando a fórmula: low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low]). Funciona bem apenas com distribuição uniforme.' },
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
