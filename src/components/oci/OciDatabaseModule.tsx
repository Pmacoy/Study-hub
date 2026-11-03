import { useState } from 'react';
import { Database } from 'lucide-react';
import { OCI_TAB_META } from '../../data/oci/tabMeta';

type SubTab = 'autonomous' | 'managed' | 'nosql';

export default function OciDatabaseModule() {
  const meta = OCI_TAB_META['database'];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('autonomous');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'autonomous', label: 'Autonomous DB' },
    { id: 'managed', label: 'Base DB & Exadata' },
    { id: 'nosql', label: 'NoSQL & MySQL' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400">
          <Database size={20} />
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
                ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-in fade-in">
        {activeSubTab === 'autonomous' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 md:col-span-2">
              <h4 className="text-sm font-bold text-orange-400 mb-2">Autonomous Database (ADB)</h4>
              <p className="text-[12px] text-slate-400 mb-2 leading-relaxed">
                A jóia da coroa da OCI. É uma base de dados self-driving, self-securing e self-repairing baseada em infraestrutura Exadata gerida inteiramente pela Oracle. Tu só te preocupas com os dados e schemas; o tuning, patching e backups são automáticos.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Workload Types</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Autonomous Transaction Processing (ATP):</strong> Otimizado para alta concorrência de transações (OLTP) de baixa latência (ex: e-commerce).</li>
                <li><strong>Autonomous Data Warehouse (ADW):</strong> Otimizado para queries complexas analíticas e Data Lakes (OLAP) onde os dados são scanneados em massa.</li>
                <li><strong>JSON Database:</strong> Otimizado para document storage estilo MongoDB.</li>
                <li><strong>APEX:</strong> Focado no desenvolvimento low-code.</li>
              </ul>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">Deployment Models</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Serverless (Shared):</strong> O mais simples e barato. Partilhas hardware Exadata com outros tenants (a DB é isolada). Escala auto de 1 a 3x CPU.</li>
                <li><strong>Dedicated:</strong> Para compliance rigoroso. Tens um rack inteiro de Exadata na cloud Oracle dedicado só a ti. Controlas a calendarização dos patches.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'managed' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-orange-400 mb-2">Base Database Service (DBCS)</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Bases de dados Oracle num ambiente de Virtual Machine.</li>
                <li>Aqui tens acesso à VM subjacente (via SSH). Podes gerir o SO se quiseres.</li>
                <li>Permite Oracle RAC (Real Application Clusters) instalando duas VMs distribuídas em Fault Domains diferentes para HA.</li>
              </ul>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-orange-400 mb-2">Exadata Database Service</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Hardware customizado (Exadata) construído puramente para bases de dados Oracle.</li>
                <li><strong>Exadata Cloud Service (ExaCS):</strong> O hardware está num data center da OCI, mas tens controlo sobre o Guest OS e as bases de dados.</li>
                <li><strong>Exadata Cloud@Customer (ExaCC):</strong> O hardware físico é entregue e instalado no <strong>teu próprio data center on-prem</strong>, mas é gerido via consola da OCI tal como se estivesse na cloud. Ideal para restrições de soberania de dados.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'nosql' && (
           <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
             <h4 className="text-sm font-bold text-sky-400 mb-4">Alternativas não-Oracle Enterprise</h4>
             
             <ul className="text-[12px] text-slate-400 space-y-4">
               <li>
                 <strong className="text-white block mb-1">MySQL HeatWave:</strong>
                 Serviço gerido de MySQL. A grande vantagem é o <em>HeatWave</em>, um motor analítico in-memory que permite fazer OLTP (transações normais) e OLAP (Data Warehouse/Analytics) na mesma base de dados sem precisar de fazer ETL para outro serviço.
               </li>
               <li>
                 <strong className="text-white block mb-1">OCI NoSQL Database:</strong>
                 Base de dados não relacional gerida (chave-valor, documento, column-oriented). Fast, predictable latency. Pode usar provisioned read/write units ou on-demand capacity. É altamente usada para perfis de utilizador, gestão de sessões, etc.
               </li>
             </ul>
           </div>
        )}
      </div>
    </div>
  );
}
