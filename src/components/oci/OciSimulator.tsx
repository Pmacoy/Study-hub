import { useState } from 'react';
import { Server, Database, Network, ShieldCheck, Check, Copy, HardDrive } from 'lucide-react';
import type { OciStudyTab } from '../../types/oci';
import { OCI_TAB_META } from '../../data/oci/tabMeta';

type SubTab = 'summary' | 'cheatsheet' | 'case-study';

interface Props {
  tab: OciStudyTab;
}

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={
            line.trim().startsWith('#') ? 'text-slate-600'
            : line.startsWith('$') || line.startsWith('oci') ? 'text-rose-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function OciSimulator({ tab }: Props) {
  const meta = OCI_TAB_META[tab];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('summary');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'summary', label: 'Resumo & Teoria' },
    { id: 'cheatsheet', label: 'Comandos (Prática)' },
    { id: 'case-study', label: 'Lições Aprendidas 💸' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400">
          {tab === 'compute' ? <Server size={20} /> :
           tab === 'storage' ? <HardDrive size={20} /> :
           tab === 'networking' ? <Network size={20} /> :
           tab === 'database' ? <Database size={20} /> :
           <ShieldCheck size={20} />}
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{meta.title}</h2>
          <p className="text-sm text-slate-400">{meta.subtitle}</p>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setActiveSubTab(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              activeSubTab === t.id
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── IAM & COMPARTMENTS ───────────────────────────────────────────── */}
      {tab === 'iam' && (
        <div className="space-y-4 animate-in fade-in">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Compartments</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li>Isolamento lógico para recursos Cloud.</li>
                  <li>Um recurso <strong>só pode pertencer a um</strong> Compartment de cada vez, mas pode ser movido entre eles.</li>
                  <li>Podem ser aninhados até 6 níveis.</li>
                  <li>Têm quotas associadas, úteis para gerir custos e limites por departamento.</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-amber-400 mb-2">IAM Policies (Verb & Resource)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li>Ao contrário da AWS/Azure, na OCI as policies escrevem-se num formato semelhante a SQL.</li>
                  <li>Sintaxe base: <code>Allow group &lt;grupo&gt; to &lt;verbo&gt; &lt;recurso&gt; in compartment &lt;compartment&gt;</code>.</li>
                  <li>Verbos: <strong>inspect</strong> (ler sem detalhes), <strong>read</strong> (ver métricas/configs), <strong>use</strong> (trabalhar com recursos sem modificar o ciclo de vida), <strong>manage</strong> (controlo total).</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div>
              <Code lang="bash (OCI CLI)" code={`# OCI IAM Policies e Compartments
# Criar um compartment
$ oci iam compartment create --name "DevCompartment" --description "Dev environment" --compartment-id <tenancy-ocid>

# A política que a OCI tanto adora no exame
# Permite ao grupo de Devs GERIR instâncias num Compartment específico:
Allow group Developers to manage instance-family in compartment DevCompartment

# Permite LEITURA a toda a Tenancy (conta inteira)
Allow group Auditors to read all-resources in tenancy
`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <section className="mt-8 rounded-3xl border border-rose-500/25 bg-rose-500/5 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-white">Case Study: O Root Compartment Caótico 💸</h3>
                <span className="inline-flex shrink-0 items-center px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-black">
                  TRUE STORY
                </span>
              </div>
              <div className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Começámos a testar a Oracle Cloud e, como ninguém queria perder tempo com políticas complexas, criámos as VMs, Load Balancers e Bases de Dados tudo no Root Compartment."
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                6 meses depois, a equipa de Dev, Test e Prod partilhavam o mesmo Root Compartment. Uma policy mal escrita ("Allow group Devs to manage instance-family in tenancy") deu aos Devs poder para apagar VMs da Produção. E foi o que aconteceu quando alguém quis "limpar o ambiente de dev".
              </p>
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 mt-4">
                <div className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-widest">Lição Aprendida (1Z0-1085):</div>
                <ul className="text-sm text-rose-100/90 space-y-2 list-disc list-inside">
                  <li><strong>Nunca</strong> uses o Root Compartment para recursos diários. O Root deve existir apenas para guardar os Compartments filhos (estruturação organizacional).</li>
                  <li>As permissões de um Parent Compartment são herdadas pelos Child Compartments. Não faças policies globais "in tenancy" se podes limitar "in compartment X".</li>
                </ul>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── COMPUTING ──────────────────────────────────────────────────────── */}
      {tab === 'compute' && (
        <div className="space-y-4 animate-in fade-in">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Tipos de Compute</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Bare Metal (BM):</strong> Acesso físico direto sem hipervisor. Máxima performance e isolamento.</li>
                  <li><strong>Virtual Machines (VM):</strong> Máquinas virtuais standard multi-tenant, como EC2 ou GCE.</li>
                  <li><strong>Dedicated Virtual Hosts:</strong> VMs que correm num hardware isolado, apenas para o teu tenant (para compliance).</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-orange-400 mb-2">Regions, ADs e FDs</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Region:</strong> Localização geográfica.</li>
                  <li><strong>Availability Domain (AD):</strong> Data center isolado (energia, rede) dentro da Region. Regiões novas OCI têm apenas 1 AD, as mais velhas têm 3.</li>
                  <li><strong>Fault Domain (FD):</strong> Agrupamento de hardware *dentro* do AD. Se a região tem 1 AD, assumes HA espalhando pelas 3 FDs.</li>
                </ul>
              </div>
            </div>
          )}
          {activeSubTab === 'cheatsheet' && (
             <Code lang="bash (OCI CLI)" code={`# Listar instâncias Compute no compartment
$ oci compute instance list --compartment-id <compartment-ocid>

# Parar uma instância
$ oci compute instance action --instance-id <instance-ocid> --action STOP`} />
          )}
          {activeSubTab === 'case-study' && (
             <div className="p-6 text-center text-slate-400 text-sm">
                Case study de Compute em desenvolvimento... 🚧
             </div>
          )}
        </div>
      )}

      {/* Placeholder para as restantes tabs */}
      {(tab === 'networking' || tab === 'storage' || tab === 'database') && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <p className="mb-2">Conteúdo para <strong>{meta.title}</strong> a ser expandido.</p>
          <p className="text-xs">Foca-te para já no IAM e Compute para a certificação Foundations (1Z0-1085).</p>
        </div>
      )}

    </div>
  );
}
