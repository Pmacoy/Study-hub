import { useState } from 'react';
import { Network } from 'lucide-react';
import { OCI_TAB_META } from '../../data/oci/tabMeta';
import { Code } from './OciIamModule';

type SubTab = 'summary' | 'gateways' | 'case-study';

export default function OciNetworkingModule() {
  const meta = OCI_TAB_META['networking'];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('summary');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'summary', label: 'VCN & Subnets' },
    { id: 'gateways', label: 'Gateways (Routing)' },
    { id: 'case-study', label: 'Security Lists vs NSG' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400">
          <Network size={20} />
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
        {activeSubTab === 'summary' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Virtual Cloud Network (VCN)</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>A rede virtual de base na OCI (equivalente à VPC da AWS). Cobre uma única Região.</li>
                <li>Por defeito, tem um tamanho máximo de `/16` (65,536 IPs).</li>
                <li>Divide-se em <strong>Subnets</strong> (Sub-redes).</li>
              </ul>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Regional Subnets vs AD-Specific Subnets</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Regional Subnet (Recomendado):</strong> A subnet abrange toda a região, cruzando vários Availability Domains (ADs). Permite alta disponibilidade mais simples sem complicar a arquitetura IP.</li>
                <li><strong>AD-Specific Subnet (Legacy):</strong> A subnet está presa a um AD específico. Foi a primeira implementação da OCI, mas agora desencorajada a não ser em casos muito específicos.</li>
                <li>Tal como noutras clouds, uma Subnet pode ser <strong>Public</strong> (pode ter IPs públicos e comunicar com a Internet) ou <strong>Private</strong> (sem IPs públicos).</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'gateways' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">Internet & NAT Gateways</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Internet Gateway (IGW):</strong> Permite tráfego bi-direcional para a Internet a partir de Public Subnets. Só pode haver 1 por VCN.</li>
                <li><strong>NAT Gateway:</strong> Permite que recursos em Private Subnets acedam à Internet (para downloads, patches), mas bloqueia tráfego que tente entrar a partir da Internet.</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-violet-400 mb-2">Service & Dynamic Gateways</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Service Gateway (SGW):</strong> Permite a recursos privados aceder aos serviços da OCI (ex: Object Storage) via a backbone da Oracle, <em>sem passar pela Internet</em>.</li>
                <li><strong>Dynamic Routing Gateway (DRG):</strong> O router virtual para ligar a VCN a redes on-premises (IPSec VPN ou FastConnect) ou fazer peering com outras VCNs noutras regiões. É o hub de conectividade híbrida.</li>
                <li><strong>Local Peering Gateway (LPG):</strong> Liga duas VCNs na mesma região.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'case-study' && (
           <section className="mt-4 rounded-3xl border border-sky-500/25 bg-sky-500/5 p-6 space-y-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-lg font-bold text-sky-400">Security Lists (SL) vs Network Security Groups (NSG)</h3>
           </div>
           <p className="text-sm text-slate-400 leading-relaxed">
             No exame (e na vida real), compreender a diferença entre SL e NSG é crucial. Ambos funcionam como firewalls virtuais, permitindo (Allow) tráfego (não existem regras Deny implícitas para criar por cima, o default é Deny all).
           </p>
           
           <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                <h4 className="text-xs font-bold text-white mb-2">Security Lists (Legacy/Subnet-level)</h4>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Aplicadas ao nível da <strong>Subnet</strong>.</li>
                  <li>Todas as instâncias nessa subnet herdam a Security List automaticamente.</li>
                  <li>Inflexível se quiseres regras diferentes para 2 instâncias na mesma subnet.</li>
                </ul>
             </div>
             <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                <h4 className="text-xs font-bold text-white mb-2">NSG (Modern/vNIC-level)</h4>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Aplicados diretamente à <strong>vNIC</strong> (interface de rede) da instância.</li>
                  <li>Podes ter VMs na mesma subnet com regras totalmente diferentes.</li>
                  <li><strong>Melhor Prática OCI:</strong> Usa NSGs em vez de SLs para separar segurança da arquitetura da rede.</li>
                </ul>
             </div>
           </div>
           
           <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/10 mt-4">
             <div className="text-xs font-bold text-sky-400 mb-2 uppercase tracking-widest">Dica de Exame (1Z0-1072):</div>
             <p className="text-[12px] text-sky-100/90">Se o cenário pedir para "controlar o tráfego de um grupo específico de VMs independentemente das subnets", a resposta certa é <strong>Network Security Groups (NSG)</strong>.</p>
           </div>
         </section>
        )}
      </div>
    </div>
  );
}
