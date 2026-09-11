import type { DistributedSystemsStudyTab } from '../../types/distributedSystems';
import Consensus from './Consensus';
import FaultTolerance from './FaultTolerance';
import Synchronization from './Synchronization';
import ConsistencyModels from './ConsistencyModels';
import DistributedTransactions from './DistributedTransactions';
import Coordination from './Coordination';

export default function DistributedSystemsSimulator({ tab }: { tab: DistributedSystemsStudyTab }) {
  switch (tab) {
    case 'consensus':
      return <Consensus />;
    case 'fault-tolerance':
      return <FaultTolerance />;
    case 'synchronization':
      return <Synchronization />;
    case 'consistency-models':
      return <ConsistencyModels />;
    case 'distributed-transactions':
      return <DistributedTransactions />;
    case 'coordination':
      return <Coordination />;
    default:
      return <Consensus />;
  }
}
