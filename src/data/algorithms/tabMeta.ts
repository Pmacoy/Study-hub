import type { AlgorithmsStudyTab } from '../../types/algorithms';

export const ALGORITHMS_TAB_META: Record<AlgorithmsStudyTab, { label: string; subtitle: string }> = {
  'sorting': { label: 'Algoritmos de Ordenação', subtitle: 'Bubble · Merge · Quick · Heap · Counting' },
  'searching': { label: 'Algoritmos de Pesquisa', subtitle: 'Linear · Binary · Hash · Interpolation' },
  'graph': { label: 'Grafos', subtitle: 'DFS · BFS · Dijkstra · Topological Sort' },
  'dynamic-programming': { label: 'Programação Dinâmica', subtitle: 'Memoization · Tabulation · Knapsack · LCS' },
  'recursion': { label: 'Recursão & Backtracking', subtitle: 'Tail recursion · Divide & Conquer · N-Queens' },
  'complexity': { label: 'Análise de Complexidade', subtitle: 'Big-O · Ω · Θ · Amortized · Space/Time trade-offs' },
};
