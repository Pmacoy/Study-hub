import { useState } from 'react';
import { Cpu, Activity, TrendingUp, Minus } from 'lucide-react';

const COMPLEXITY_CLASSES = [
  { name: 'O(1)', label: 'Constante', desc: 'Tempo independente do input. Ex: array access, hash lookup.', examples: 'arr[i], hash.get(key)', color: 'emerald' },
  { name: 'O(log n)', label: 'Logarítmico', desc: 'Reduz o problema pela metade a cada passo. Ex: binary search.', examples: 'Binary search, heap operations', color: 'cyan' },
  { name: 'O(n)', label: 'Linear', desc: 'Proporcional ao input. Ex: varrer array.', examples: 'Linear search, forEach loop', color: 'sky' },
  { name: 'O(n log n)', label: 'Linearítmico', desc: 'Divide e combina. A maioria dos sorts eficientes.', examples: 'Merge sort, quick sort avg', color: 'violet' },
  { name: 'O(n²)', label: 'Quadrático', desc: 'Loop aninhado. Ex: bubble sort, matrix multiplication.', examples: 'Bubble sort, nested loops', color: 'amber' },
  { name: 'O(2ⁿ)', label: 'Exponencial', desc: 'Cada passo dobra. Problemas NP-completos.', examples: 'Fibonacci recursivo sem memo, subsets', color: 'rose' },
  { name: 'O(n!)', label: 'Fatorial', desc: 'Pior caso. Permutações de n elementos.', examples: 'Traveling salesman brute-force', color: 'rose' },
];

const INPUT_SIZES = [10, 100, 1000, 10000];

export default function ComplexityAnalysis() {
  const [selectedN, setSelectedN] = useState(1000);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const ops = {
    'O(1)': 1,
    'O(log n)': Math.log2(selectedN),
    'O(n)': selectedN,
    'O(n log n)': selectedN * Math.log2(selectedN),
    'O(n²)': selectedN * selectedN,
    'O(2ⁿ)': Math.pow(2, Math.min(selectedN, 30)),
    'O(n!)': factorial(Math.min(selectedN, 12)),
  };

  function factorial(n: number): number {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Cpu size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Análise de Complexidade</h2>
            <p className="text-xs text-slate-400">Big-O, Big-Ω, Big-Θ — como medir eficiência algorítmica</p>
          </div>
        </div>

        {/* Input size selector */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-slate-400">n =</span>
          {INPUT_SIZES.map(n => (
            <button key={n} onClick={() => setSelectedN(n)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${selectedN === n ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'border border-slate-800 text-slate-500 hover:border-slate-700'}`}>
              {n.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Complexity comparison */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">Operações aproximadas para n = {selectedN.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            {COMPLEXITY_CLASSES.map((c) => {
              const val = ops[c.name as keyof typeof ops];
              const display = val > 1e9 ? `${(val / 1e9).toFixed(1)}B` : val > 1e6 ? `${(val / 1e6).toFixed(1)}M` : val > 1e3 ? `${(val / 1e3).toFixed(1)}K` : Math.round(val).toString();
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className={`w-20 text-xs font-mono font-bold text-${c.color}-400`}>{c.name}</span>
                  <div className="flex-1 h-5 rounded bg-slate-900/60 overflow-hidden">
                    <div className={`h-full rounded bg-${c.color}-500/40`} style={{ width: `${Math.min(100, Math.log2(val + 1) / 7 * 100)}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 w-16 text-right">{display}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-2xs text-slate-500">Escala logarítmica — cada barra representa log₂(operações)</p>
        </div>

        {/* Complexity classes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPLEXITY_CLASSES.map((c) => (
            <div key={c.name} className={`rounded-xl border border-${c.color}-500/20 bg-${c.color}-500/5 p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className={`text-${c.color}-400`} />
                <span className="text-sm font-bold text-white font-mono">{c.name}</span>
                <span className={`text-xs text-${c.color}-400 ml-auto`}>{c.label}</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed">{c.desc}</p>
              <pre className="mt-2 text-2xs font-mono text-slate-600">{c.examples}</pre>
            </div>
          ))}
        </div>

        {/* Notation guide */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h4 className="text-xs font-bold text-cyan-300 mb-2">Notação</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-2xs">
            {[
              { sym: 'O(f(n))', name: 'Big-O', desc: 'Limite superior — pior caso (ou limite apertado)' },
              { sym: 'Ω(f(n))', name: 'Big-Ω', desc: 'Limite inferior — melhor caso garantido' },
              { sym: 'Θ(f(n))', name: 'Big-Θ', desc: 'Limite apertado — tanto superior como inferior' },
            ].map((n) => (
              <div key={n.sym} className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
                <div className="font-mono text-cyan-400 font-bold">{n.sym}</div>
                <div className="text-slate-400 font-semibold mt-0.5">{n.name}</div>
                <div className="text-slate-600 mt-1">{n.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            { q: 'Qual notação descreve o limite superior (pior caso) de um algoritmo?', choices: ['Big-Ω', 'Big-Θ', 'Big-O', 'Little-o'], correct: 2, explanation: 'Big-O (O) descreve o limite superior — o pior caso que o algoritmo pode atingir. Big-Ω é o inferior (melhor caso) e Big-Θ é o apertado (tanto inferior como superior).' },
            { q: 'Se um algoritmo tem O(n²) e outro O(n log n), qual é mais escalável para n = 10⁶?', choices: ['O(n²) porque é mais simples', 'O(n log n) — 10⁶ × 20 << 10¹²', 'São equivalentes assintoticamente', 'Depende da constante multiplicativa, mas O(n log n) sempre ganha'], correct: 1, explanation: 'Para n = 10⁶: O(n²) = 10¹² operações vs O(n log n) = 10⁶ × 20 = 2×10⁷. A diferença é de 5 ordens de grandeza. Constantes podem mudar a linha de corte, mas assintoticamente O(n log n) vence.' },
            { q: 'O que significa Θ(n) na prática?', choices: ['O algoritmo é sempre O(n)', 'O algoritmo é tanto O(n) como Ω(n) — limite apertado', 'O algoritmo temComplexidade variável', 'O algoritmo é mais rápido que O(n)'], correct: 1, explanation: 'Θ(n) significa que o algoritmo é limitado superior e inferior por n — nem melhor nem pior que linear. Ex: merge sort é Θ(n log n), não apenas O(n log n).' },
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
