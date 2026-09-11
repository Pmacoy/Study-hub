import type { SystemDesignStudyTab } from '../../types/systemDesign';
import CapTheorem from './CapTheorem';
import CachingStrategies from './CachingStrategies';
import LoadBalancing from './LoadBalancing';
import Sharding from './Sharding';
import Messaging from './Messaging';
import BackOfEnvelope from './BackOfEnvelope';

export default function SystemDesignSimulator({ tab }: { tab: SystemDesignStudyTab }) {
  switch (tab) {
    case 'cap-theorem':
      return <CapTheorem />;
    case 'caching':
      return <CachingStrategies />;
    case 'load-balancer':
      return <LoadBalancing />;
    case 'sharding':
      return <Sharding />;
    case 'messaging':
      return <Messaging />;
    case 'back-of-envelope':
      return <BackOfEnvelope />;
    default:
      return <CapTheorem />;
  }
}
