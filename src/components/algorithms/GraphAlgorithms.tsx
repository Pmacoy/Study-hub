import { useState } from 'react';
import { Map, ArrowRight, TrendingUp } from 'lucide-react';

const GRAPH_EDGES = [
  ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'],
  ['C', 'E'], ['D', 'E'], ['D', 'F'], ['E', 'F'],
];

const GRAPH_NODES = ['A', 'B', 'C', 'D', 'E', 'F'];

const DFS_ORDER = ['A', 'B', 'D', 'F', 'E', 'C'];
const BFS_ORDER = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function GraphAlgorithms() {
  const [activeAlgo, setActiveAlgo] = useState<'dfs' | 'bfs' | 'dijkstra'>('dfs');
  const [step, setStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const orders = { dfs: DFS_ORDER, bfs: BFS_ORDER, dijkstra: ['A', 'B', 'C', 'D', 'E', 'F'] };
  const currentOrder = orders[activeAlgo];
  const visited = currentOrder.slice(0, step + 1);
  const current = step < currentOrder.length ? currentOrder[step] : null;

  const dijkstraDistances = { A: 0, B: 4, C: 2, D: 5, E: 6, F: 7 };

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Map size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Algoritmos em Grafos</h2>
            <p className="text-xs text-slate-400">DFS · BFS · Dijkstra — visualização interativa</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { id: 'dfs' as const, name: 'DFS', icon: ArrowRight, desc: 'Explora o mais profundo primeiro' },
            { id: 'bfs' as const, name: 'BFS', icon: ArrowRight, desc: 'Explora por camadas' },
            { id: 'dijkstra' as const, name: "Dijkstra", icon: TrendingUp, desc: 'Caminho mais curto' },
          ].map((a) => (
            <button key={a.id} onClick={() => { setActiveAlgo(a.id); setStep(0); }}
              className={`p-3 rounded-xl border text-left transition-all ${activeAlgo === a.id ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'}`}>
              <div className={`text-xs font-bold ${activeAlgo === a.id ? 'text-cyan-300' : 'text-slate-500'}`}>{a.name}</div>
              <div className="text-2xs text-slate-600 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>

        {/* Graph visualization */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Map size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">
              {activeAlgo === 'dfs' ? 'DFS (Depth-First Search)' : activeAlgo === 'bfs' ? 'BFS (Breadth-First Search)' : "Dijkstra's Shortest Path"}
            </span>
            <span className="ml-auto text-2xs text-slate-500 font-mono">
              Passo {Math.min(step + 1, currentOrder.length)}/{currentOrder.length}
            </span>
          </div>

          {/* Nodes */}
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-3 gap-4">
              {GRAPH_NODES.map((node) => {
                const isVisited = visited.includes(node);
                const isCurrent = node === current;
                return (
                  <div key={node} className={`flex flex-col items-center gap-1`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                      isCurrent ? 'bg-cyan-500/40 border-cyan-400 text-cyan-200 scale-110' :
                      isVisited ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                      'bg-slate-900/60 border-slate-700 text-slate-500'
                    }`}>
                      {node}
                    </div>
                    {activeAlgo === 'dijkstra' && isVisited && (
                      <div className="text-2xs font-mono text-cyan-400">{dijkstraDistances[node as keyof typeof dijkstraDistances]}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order trace */}
          <div className="flex flex-wrap gap-1 mb-3">
            {currentOrder.map((n, i) => (
              <div key={n} className={`flex items-center gap-1 text-2xs font-mono ${i <= step ? 'text-cyan-300' : 'text-slate-600'}`}>
                {i > 0 && <ArrowRight size={10} />}
                <span className={`px-1.5 py-0.5 rounded ${i <= step ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>{n}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="px-2 py-1 rounded border border-slate-700 text-2xs text-slate-400 hover:text-white">Reiniciar</button>
            <button onClick={() => setStep(s => Math.min(currentOrder.length - 1, s + 1))} disabled={step >= currentOrder.length - 1} className="px-2 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-2xs text-cyan-300 disabled:opacity-30">Próximo →</button>
          </div>
        </div>

        {/* Algo details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'DFS', time: 'O(V+E)', space: 'O(V)', use: 'Ciclo detection, topological sort,连通性' },
            { name: 'BFS', time: 'O(V+E)', space: 'O(V)', use: 'Caminho mais curto (sem pesos), nível por nível' },
            { name: "Dijkstra", time: 'O((V+E)log V)', space: 'O(V)', use: 'Caminho mais curto em grafos com pesos não-negativos' },
          ].map((a, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <div className="text-xs font-bold text-cyan-300 mb-1">{a.name}</div>
              <div className="text-2xs text-slate-500 font-mono">Tempo: {a.time} · Espaço: {a.space}</div>
              <div className="text-2xs text-slate-600 mt-1">{a.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            { q: 'Qual algoritmo usa uma pilha (stack) implicitamente?', choices: ['BFS', 'DFS', 'Dijkstra', 'Topological Sort (BFS-based)'], correct: 1, explanation: 'DFS usa recursão (pilha de chamadas) ou uma pilha explícita. BFS usa uma fila (queue).' },
            { q: 'Dijkstra funciona com arestas de peso negativo?', choices: ['Sim, sempre', 'Não — pode produzir resultados errados', 'Sim, mas apenas com otimizações', 'Depende da implementação'], correct: 1, explanation: 'Dijkstra assume pesos não-negativos. Com pesos negativos, um caminho "mais curto" pode ser descoberto tarde demais, produzindo resultado incorreto. Use Bellman-Ford nestes casos.' },
            { q: 'Qual é a complexidade de espaço do BFS?', choices: ['O(1)', 'O(V)', 'O(E)', 'O(V+E)'], correct: 1, explanation: 'BFS precisa de uma fila que pode conter até O(V) nós no pior caso (todos os nós da mesma camada). O espaço é O(V).' },
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
