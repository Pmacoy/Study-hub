import { useState } from 'react';
import { SortAsc, ArrowDownUp, Zap, Activity } from 'lucide-react';

const SORTS = [
  { id: 'bubble', name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, description: 'Compara elementos adjacentes e troca se estiverem fora de ordem. Repete até nenhuma troca ser necessária.', code: `for i from 0 to n-1:
  for j from 0 to n-i-1:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])` },
  { id: 'selection', name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false, description: 'Encontra o menor elemento e coloca na posição correta. Repete para o restante.', code: `for i from 0 to n-1:
  min = i
  for j from i+1 to n:
    if arr[j] < arr[min]:
      min = j
  swap(arr[i], arr[min])` },
  { id: 'insertion', name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, description: 'Constrói o array ordenado um elemento de cada vez. Ideal para dados quase ordenados.', code: `for i from 1 to n:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j -= 1
  arr[j+1] = key` },
  { id: 'merge', name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true, description: 'Divide o array ao meio recursivamente, ordena cada metade e mescla os resultados.', code: `function mergeSort(arr):
  if len(arr) <= 1: return arr
  mid = len(arr) // 2
  left = mergeSort(arr[:mid])
  right = mergeSort(arr[mid:])
  return merge(left, right)` },
  { id: 'quick', name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false, description: 'Escolhe um pivot, particiona em menores e maiores, recursivamente ordena.', code: `function quickSort(arr, lo, hi):
  if lo < hi:
    p = partition(arr, lo, hi)
    quickSort(arr, lo, p-1)
    quickSort(arr, p+1, hi)
  # partition: pivot = arr[hi]` },
  { id: 'heap', name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false, description: 'Constrói um max-heap e extrai o máximo repetidamente.', code: `function heapSort(arr):
  buildMaxHeap(arr)
  for i from n-1 down to 1:
    swap(arr[0], arr[i])
    heapify(arr, 0, i)
  # heapify: mantém heap property` },
  { id: 'counting', name: 'Counting Sort', best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)', stable: true, description: 'Conta occurrences de cada valor. Rápido quando k (range) não é muito maior que n.', code: `max = max(arr)
counts = array of zeros size max+1
for x in arr: counts[x] += 1
# reconstruct from counts` },
];

export default function SortingAlgorithms() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const algo = SORTS[active];
  const AlgoIcon = algo.id === 'bubble' || algo.id === 'selection' || algo.id === 'insertion' ? SortAsc :
    algo.id === 'merge' ? ArrowDownUp :
    algo.id === 'quick' ? Zap : Activity;

  return (
    <div className="space-y-6">
      {/* Algo selector */}
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <SortAsc size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Algoritmos de Ordenação</h2>
            <p className="text-xs text-slate-400">Comparação de complexidade e comportamento</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {SORTS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`px-3 py-2 rounded-xl border text-left transition-all ${
                active === i
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className={`text-xs font-bold ${active === i ? 'text-cyan-300' : 'text-slate-500'}`}>{s.name.split(' ')[0]}</div>
              <div className="text-2xs font-mono text-slate-600 mt-0.5">O({s.avg.replace('O(', '')})</div>
            </button>
          ))}
        </div>

        {/* Active algo detail */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlgoIcon size={16} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-cyan-300">{algo.name}</h3>
            <span className="ml-auto text-2xs text-slate-500 font-mono">{algo.stable ? '✓ Stable' : '✗ Unstable'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{algo.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Melhor', value: algo.best },
              { label: 'Médio', value: algo.avg },
              { label: 'Pior', value: algo.worst },
              { label: 'Espaço', value: algo.space },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-lg bg-slate-900/60 border border-slate-800 p-2 text-center">
                <div className="text-2xs text-slate-500 font-mono">{kpi.label}</div>
                <div className="text-xs font-mono text-cyan-300 mt-0.5">{kpi.value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
            <span className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Pseudocódigo</span>
            <pre className="mt-2 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{algo.code}</pre>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Comparação Completa</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 font-mono text-2xs uppercase">
                <th className="text-left pb-2">Algoritmo</th>
                <th className="text-left pb-2">Melhor</th>
                <th className="text-left pb-2">Médio</th>
                <th className="text-left pb-2">Pior</th>
                <th className="text-left pb-2">Espaço</th>
                <th className="text-left pb-2">Estável</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {SORTS.map((s) => (
                <tr key={s.id} className="border-t border-slate-800">
                  <td className="py-2 font-semibold text-cyan-300">{s.name}</td>
                  <td className="py-2 font-mono">{s.best}</td>
                  <td className="py-2 font-mono">{s.avg}</td>
                  <td className="py-2 font-mono">{s.worst}</td>
                  <td className="py-2 font-mono">{s.space}</td>
                  <td className="py-2">{s.stable ? <span className="text-emerald-400">✓</span> : <span className="text-rose-400">✗</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            { q: 'Qual algoritmo de ordenação tem o melhor caso O(n) para dados já parcialmente ordenados?', choices: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Heap Sort'], correct: 2, explanation: 'Insertion Sort tem best case O(n) quando o array já está ordenado — cada elemento só precisa de uma comparação, sem trocas.' },
            { q: 'Qual é a principal desvantagem do Quick Sort?', choices: ['Não é in-place', 'Sempre O(n²)', 'Worst case O(n²) com pivot mal escolhido', 'Não é estável e pior caso raro'], correct: 3, explanation: 'Quick Sort é unstable e in-place com O(log n) espaço. O pior caso O(n²) é raro com pivot randomizado ou mediana-de-três.' },
            { q: 'Para ordenar um array de inteiros pequenos (0-100) com 1000 elementos, qual é a melhor escolha?', choices: ['Merge Sort', 'Quick Sort', 'Counting Sort', 'Heap Sort'], correct: 2, explanation: 'Counting Sort é O(n+k) = O(1000+100) = O(1100) — linear e muito mais rápido que O(n log n) dos algoritmos baseados em comparação.' },
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
                    <button key={ci} onClick={() => setQuizAnswer(quizAnswer === qi ? null : qi)} className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${cls}`}>
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
          {quizAnswer !== null && <button onClick={() => setQuizAnswer(null)} className="text-xs text-slate-500 hover:text-slate-300 underline">Reiniciar quiz</button>}
        </div>
      </div>
    </div>
  );
}
