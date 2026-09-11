import type { AlgorithmsTab } from '../../types/algorithms';
import {
  BarChart3,
  SortAsc,
  Search,
  Map,
  Brain,
  Cpu,
} from 'lucide-react';

export interface MenuItem {
  id: AlgorithmsTab;
  label: string;
  sublabel: string;
  icon: typeof BarChart3;
}
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const algorithmsMenuGroups: MenuGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', sublabel: 'Progresso', icon: BarChart3 },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'sorting', label: 'Ordenação', sublabel: 'Bubble · Merge · Quick · Heap', icon: SortAsc },
      { id: 'searching', label: 'Pesquisa', sublabel: 'Linear · Binary · Hash', icon: Search },
      { id: 'complexity', label: 'Complexidade', sublabel: 'Big-O · Ω · Θ', icon: Cpu },
    ],
  },
  {
    title: 'Avançado',
    items: [
      { id: 'graph', label: 'Grafos', sublabel: 'DFS · BFS · Dijkstra', icon: Map },
      { id: 'dynamic-programming', label: 'Prog. Dinâmica', sublabel: 'Knapsack · LCS · Coin Change', icon: Brain },
      { id: 'recursion', label: 'Recursão', sublabel: 'Divide & Conquer · Backtracking', icon: Brain },
    ],
  },
];
