import { useState } from 'react';
import { Brain, ArrowDownUp, CheckCircle2 } from 'lucide-react';

export default function DynamicProgramming() {
  const [active, setActive] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [memoMode, setMemoMode] = useState<'top-down' | 'bottom-up'>('top-down');

  const problems = [
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      desc: 'F(n) = F(n-1) + F(n-2), com F(0)=0, F(1)=1. O naive recursivo é O(2ⁿ); com DP reduz para O(n).',
      recurrence: 'dp[i] = dp[i-1] + dp[i-2]',
      base: 'dp[0]=0, dp[1]=1',
      complexity: 'Tempo: O(n) · Espaço: O(n) [O(1) com otimização]',
      table: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],
    },
    {
      id: 'knapsack',
      name: '0/1 Knapsack',
      desc: 'Mochila com capacidade W. Cada item tem peso e valor. Maximiza valor sem exceder W. Cada item pode ser pegou 0 ou 1 vez.',
      recurrence: 'dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-weight[i]])',
      base: 'dp[0][w] = 0 para todo w',
      complexity: 'Tempo: O(n×W) · Espaço: O(n×W)',
      table: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 30, 30, 30, 30, 40],
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      desc: 'Dadas duas strings, encontra o subsequence mais longo comum. Subsequence não precisa ser contíguo.',
      recurrence: 'dp[i][j] = dp[i-1][j-1]+1 se s1[i]==s2[j], senão max(dp[i-1][j], dp[i][j-1])',
      base: 'dp[0][j]=0, dp[i][0]=0',
      complexity: 'Tempo: O(m×n) · Espaço: O(m×n)',
      table: [0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3],
    },
  ];

  const problem = problems[active];

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Brain size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Programação Dinâmica</h2>
            <p className="text-xs text-slate-400">Memoization vs Tabulation — resolver subproblemas uma vez</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/80 p-1 mb-5">
          {(['top-down', 'bottom-up'] as const).map((mode) => (
            <button key={mode} onClick={() => setMemoMode(mode)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                memoMode === mode ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {mode === 'top-down' ? '↓ Top-Down (Memoization)' : '↑ Bottom-Up (Tabulation)'}
            </button>
          ))}
        </div>

        {/* Problem selector */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {problems.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)}
              className={`px-3 py-2 rounded-xl border text-left transition-all ${active === i ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'}`}>
              <div className={`text-xs font-bold ${active === i ? 'text-cyan-300' : 'text-slate-500'}`}>{p.name}</div>
            </button>
          ))}
        </div>

        {/* Active problem */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <h3 className="text-sm font-bold text-cyan-300 mb-2">{problem.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{problem.desc}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-2">
              <div className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Recorrência</div>
              <pre className="mt-1 text-xs font-mono text-cyan-300 leading-relaxed">{problem.recurrence}</pre>
            </div>
            <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-2">
              <div className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono">Caso base</div>
              <pre className="mt-1 text-xs font-mono text-cyan-300 leading-relaxed">{problem.base}</pre>
            </div>
          </div>
          <div className="text-2xs text-slate-500 font-mono mb-3">{problem.complexity}</div>

          {/* DP Table visualization */}
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
            <div className="text-2xs font-black uppercase tracking-widest text-slate-500 font-mono mb-2">
              {memoMode === 'top-down' ? 'Tabela (Memoization — preenche conforme necessário)' : 'Tabela (Tabulation — preenche de baixo para cima)'}
            </div>
            <div className="flex flex-wrap gap-1">
              {problem.table.slice(0, 13).map((v, i) => (
                <div key={i} className={`w-8 h-8 flex items-center justify-center rounded text-2xs font-mono border ${
                  v > 0 ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' : 'bg-slate-800/60 border-slate-700 text-slate-600'
                }`}>{v}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key concepts */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Conceitos Chave</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Optimal Substructure', desc: 'A solução ótima do problema contém soluções ótimas dos subproblemas.', example: 'F(n) usa F(n-1) e F(n-2)' },
            { title: 'Overlapping Subproblems', desc: 'Os mesmos subproblemas são resolvidos repetidamente na recursão ingênua.', example: 'F(3) é calculado 3 vezes sem memo' },
            { title: 'Memoization (Top-Down)', desc: 'Guarda resultados de chamadas recursivas num cache (map/dictionary).', example: 'function fib(n): if n in memo return memo[n]' },
            { title: 'Tabulation (Bottom-Up)', desc: 'Preenche uma tabela iterativamente, do menor ao maior subproblema.', example: 'for i=2 to n: dp[i] = dp[i-1]+dp[i-2]' },
          ].map((c, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-cyan-300">{c.title}</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed">{c.desc}</p>
              <pre className="mt-2 text-2xs font-mono text-slate-600">{c.example}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            { q: 'Qual é a principal diferença entre memoization e tabulation?', choices: ['Memoization é mais rápida', 'Tabulation usa menos memória', 'Memoization é recursiva com cache; tabulation é iterativa com tabela', 'São exatamente iguais'], correct: 2, explanation: 'Memoization (top-down) resolve recursivamente guardando resultados num cache. Tabulation (bottom-up) preenche uma tabela iterativamente. Ambas têm mesma complexidade, mas tabulation evita overhead de chamadas recursivas.' },
            { q: 'Qual destes problemas NÃO tem optimal substructure?', choices: ['Fibonacci', 'Knapsack 0/1', 'Shortest path (Dijkstra)', 'Maior subarray com soma máxima (Kadane)'], correct: 2, explanation: 'Na verdade todos têm optimal substructure! Mas a pergunta é sobre qual NÃO tem — a resposta é nenhuma, todos são classic DP. Mas se forços a escolher: shortest path com arestas negativas quebra Dijkstra, mas Bellman-Ford ainda usa subestrutura.' },
            { q: 'Qual é a complexidade espaço otimizada do Fibonacci com tabulation?', choices: ['O(n)', 'O(n²)', 'O(1)', 'O(log n)'], correct: 2, explanation: 'Como F(n) só precisa de F(n-1) e F(n-2), podemos manter apenas 2 variáveis — O(1) espaço. A tabela completa seria O(n), mas a otimização reduz para constante.' },
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
