import type { AlgorithmsStudyTab } from '../../types/algorithms';
import SortingAlgorithms from './SortingAlgorithms';
import SearchingAlgorithms from './SearchingAlgorithms';
import GraphAlgorithms from './GraphAlgorithms';
import DynamicProgramming from './DynamicProgramming';
import RecursionBacktracking from './RecursionBacktracking';
import ComplexityAnalysis from './ComplexityAnalysis';

export default function AlgorithmsSimulator({ tab }: { tab: AlgorithmsStudyTab }) {
  switch (tab) {
    case 'sorting':
      return <SortingAlgorithms />;
    case 'searching':
      return <SearchingAlgorithms />;
    case 'graph':
      return <GraphAlgorithms />;
    case 'dynamic-programming':
      return <DynamicProgramming />;
    case 'recursion':
      return <RecursionBacktracking />;
    case 'complexity':
      return <ComplexityAnalysis />;
    default:
      return <SortingAlgorithms />;
  }
}
