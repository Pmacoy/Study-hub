import type { NetworkingStudyTab } from '../../types/networking';
import IpCalculator from './IpCalculator';
import PacketViewer from './PacketViewer';
import TcpHandshake from './TcpHandshake';
import Module4Addressing from './IpAddressing';
import Module5Application from './Module5Application';
import RoutingSimulator from './RoutingSimulator';
import Module6SecurityDiagnostics from './Module6SecurityDiagnostics';

export default function NetworkingSimulator({ tab }: { tab: NetworkingStudyTab }) {
  switch (tab) {
    case 'ip-calc':
      return <IpCalculator />;
    case 'transport':
      return <TransportModule />;
    case 'ip-addressing':
      return <Module4Addressing />;
    case 'application':
      return <Module5Application />;
    case 'routing':
      return <RoutingSimulator />;
    case 'security-net':
      return <Module6SecurityDiagnostics />;
    default:
      return <IpCalculator />;
  }
}

// Wrapper that combines PacketViewer + TcpHandshake under tabs
import { useState } from 'react';

function TransportModule() {
  const [view, setView] = useState<'packets' | 'handshake'>('packets');
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setView('packets')}
          className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === 'packets' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
          📦 Anatomia do Pacote
        </button>
        <button onClick={() => setView('handshake')}
          className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === 'handshake' ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
          🤝 TCP Handshake
        </button>
      </div>
      {view === 'packets' ? <PacketViewer /> : <TcpHandshake />}
    </div>
  );
}
