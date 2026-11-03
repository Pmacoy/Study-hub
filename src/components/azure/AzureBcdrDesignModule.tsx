import React, { useState } from 'react';
import { RefreshCw, Map, ServerCrash, Clock, ShieldAlert, Play } from 'lucide-react';
import GuidedScenarioPlayer from '../scenarios/GuidedScenarioPlayer';
import { az305BusinessContinuityFocusScenario } from '../../data/scenarios/az305BusinessContinuityFocus';

export default function AzureBcdrDesignModule() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="absolute inset-0 z-50 bg-[#0f111a]">
        <GuidedScenarioPlayer 
          scenario={az305BusinessContinuityFocusScenario} 
          onExit={() => setPlaying(false)}
          onComplete={() => setPlaying(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <RefreshCw className="text-sky-400" />
            Design de Business Continuity (BCDR)
          </h2>
          <p className="text-sm text-sky-100 max-w-2xl leading-relaxed">
            O exame AZ-305 testa pesadamente a capacidade de alinhar soluções técnicas com os requisitos de negócio, nomeadamente RTO (Recovery Time Objective) e RPO (Recovery Point Objective). Terás de escolher entre Active-Active, Active-Passive, ou Backup Restore dependendo do SLA exigido.
          </p>
        </div>
        <button 
          onClick={() => setPlaying(true)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors"
        >
          <Play size={16} fill="currentColor" />
          Iniciar Case Study
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold mb-4">
            <ServerCrash size={18} /> RTO e RPO
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">RTO (Time):</strong> Quanto tempo a app pode ficar em baixo? Define se precisas de Active-Active ou podes tolerar restore de backup.</li>
            <li><strong className="text-white">RPO (Point):</strong> Quanta perda de dados é tolerada? Define a replicação (síncrona vs assíncrona).</li>
          </ul>
        </div>
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
            <Map size={18} /> Region Pairs e Zonas
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Availability Zones:</strong> Proteção contra falha de datacenter (síncrona, RPO=0).</li>
            <li><strong className="text-white">Region Pairs:</strong> Proteção contra falha da região (assíncrona, RPO &gt; 0).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-4">
            <Clock size={18} /> Estratégias de Failover
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Active-Active:</strong> Front Door a balancear tráfego para 2 regiões em simultâneo. Cosmos DB multi-region write. RTO/RPO near zero. Custo alto.</li>
            <li><strong className="text-white">Active-Passive:</strong> Pilot Light ou Warm Standby. Requer intervenção (ou Traffic Manager) para failover.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-bold mb-4">
            <ShieldAlert size={18} /> Azure Site Recovery
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">ASR:</strong> Replica VMs (IaaS) ou servidores físicos para o Azure. RTO em minutos. Teste de failover sem impacto na produção.</li>
            <li><strong className="text-white">PaaS BCDR:</strong> SQL Auto-Failover Groups, Storage GRS/GZRS.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
