import { useState } from 'react';
import { Server } from 'lucide-react';
import { OCI_TAB_META } from '../../data/oci/tabMeta';

type SubTab = 'ha' | 'dr' | 'best-practices';

export default function OciArchitectureModule() {
  const meta = OCI_TAB_META['architecture'];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('ha');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'ha', label: 'High Availability (HA)' },
    { id: 'dr', label: 'Disaster Recovery (DR)' },
    { id: 'best-practices', label: 'Best Practices' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400">
          <Server size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{meta.title}</h2>
          <p className="text-sm text-slate-400">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setActiveSubTab(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              activeSubTab === t.id
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-in fade-in">
        {activeSubTab === 'ha' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Availability Domains (ADs)</h4>
              <p className="text-[12px] text-slate-400 mb-2 leading-relaxed">
                Um AD é um ou mais data centers isolados dentro de uma região, com energia e refrigeração separadas.
              </p>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Algumas regiões (como Frankfurt) têm 3 ADs. Espalhar instâncias por 3 ADs garante sobrevivência a falhas completas de data centers inteiros.</li>
                <li>Regiões mais recentes da OCI são lançadas apenas com <strong>1 AD</strong>. Para garantir HA nestas regiões, a estratégia muda para o uso de Fault Domains.</li>
              </ul>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">Fault Domains (FDs)</h4>
              <p className="text-[12px] text-slate-400 mb-2 leading-relaxed">
                Um FD é um agrupamento de hardware e infraestrutura dentro de um único AD. Cada AD contém sempre 3 Fault Domains.
              </p>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Ao criar várias VMs para a mesma app, deves distribuí-las por FD1, FD2, FD3.</li>
                <li>Garante que uma falha de energia numa rack de servidores ou manutenção de hardware planeada (reboots do hypervisor) não desliga todas as tuas VMs em simultâneo.</li>
                <li><strong>Anti-affinity:</strong> Podes forçar instâncias a ficarem em FDs separados.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'dr' && (
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
             <h4 className="text-sm font-bold text-rose-400 mb-4">Cross-Region Disaster Recovery</h4>
             
             <ul className="text-[12px] text-slate-400 space-y-4 list-disc list-inside">
               <li>
                 <strong>Data Replication:</strong>
                 Usa Cross-Region Replication para Object Storage e Block Volume Backups. Para bases de dados, usa Oracle Data Guard (para Oracle DBs) ou Autonomous Data Guard (replicado automaticamente para outra região com cliques mínimos).
               </li>
               <li>
                 <strong>Remote Peering Connection (RPC):</strong>
                 Para ligar a rede da região principal à região de DR, configura um Dynamic Routing Gateway (DRG) em ambas as regiões e estabelece um RPC entre eles.
               </li>
               <li>
                 <strong>Traffic Management (DNS):</strong>
                 O OCI DNS Traffic Management permite criar steering policies (ex: Failover). Se o health check falhar na região primária, o tráfego é reencaminhado via DNS para os IPs da região de DR.
               </li>
             </ul>
          </div>
        )}

        {activeSubTab === 'best-practices' && (
           <section className="mt-4 rounded-3xl border border-sky-500/25 bg-sky-500/5 p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2">
               <h3 className="text-lg font-bold text-white">Práticas recomendadas de arquitetura na OCI</h3>
             </div>
             
             <div className="space-y-4">
               <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                  <h4 className="text-xs font-bold text-sky-400 mb-1">1. Uso de Load Balancers Regionais</h4>
                  <p className="text-[11px] text-slate-400">Ao contrário de clouds mais antigas, o OCI Load Balancer base é inerentemente regional (quando criado numa Regional Subnet). Não precisas de aprovisionar instâncias de Load Balancer em diferentes ADs manualmente. O serviço cuida da distribuição e failover cross-AD internamente.</p>
               </div>
               
               <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                  <h4 className="text-xs font-bold text-sky-400 mb-1">2. Compartment Design</h4>
                  <p className="text-[11px] text-slate-400">Separa os ambientes (Prod, QA, Dev) usando hierarchy de Compartments em vez de VCNs ou Accounts separadas quando possível. Isso facilita muito a gestão consolidada de custos e governance policy (Allow group SecOps to read all-resources in compartment Prod).</p>
               </div>
               
               <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                  <h4 className="text-xs font-bold text-sky-400 mb-1">3. Off-box Virtualization</h4>
                  <p className="text-[11px] text-slate-400">O hypervisor de rede e I/O na OCI está "off-box" (num cartão SmartNIC dedicado) e não no próprio CPU do servidor host. Isso significa que não há "noisy neighbors" roubando I/O throughput. Na prática, garante performance flat e previsível (ideal para as bases de dados pesadas on-prem migrarem para a cloud sem sustos de latência).</p>
               </div>
             </div>
           </section>
        )}
      </div>
    </div>
  );
}
