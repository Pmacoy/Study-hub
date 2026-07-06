import type { PythonStudyTab } from '../../types/python';
import BasicsModule from './BasicsModule';
import ControlFlowModule from './ControlFlowModule';
import DataStructuresModule from './DataStructuresModule';
import OopModule from './OopModule';
import AdvancedModule from './AdvancedModule';
import DevOpsPythonModule from './DevOpsPythonModule';

export default function PythonSimulator({ tab }: { tab: PythonStudyTab }) {
  switch (tab) {
    case 'basics':          return <BasicsModule />;
    case 'control-flow':    return <ControlFlowModule />;
    case 'data-structures': return <DataStructuresModule />;
    case 'oop':             return <OopModule />;
    case 'advanced':        return <AdvancedModule />;
    case 'devops-py':       return <DevOpsPythonModule />;
    default:                return <BasicsModule />;
  }
}
