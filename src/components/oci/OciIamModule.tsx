import { useState } from 'react';
import { ShieldCheck, Check, Copy } from 'lucide-react';
import { OCI_TAB_META } from '../../data/oci/tabMeta';

type SubTab = 'summary' | 'cheatsheet' | 'case-study';

export function Code({ code, lang = '' }: { code: string; lang?: string }) {
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
            : line.startsWith('$') || line.startsWith('oci') || line.startsWith('Allow') ? 'text-rose-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function OciIamModule() {
  const meta = OCI_TAB_META['iam'];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('summary');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'summary', label: 'Resumo & Teoria' },
    { id: 'cheatsheet', label: 'Comandos (Prática)' },
    { id: 'case-study', label: 'Lições Aprendidas 💸' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400">
          <ShieldCheck size={20} />
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
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-in fade-in">
        {activeSubTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-rose-400 mb-2">Compartments</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Isolamento lógico para recursos Cloud.</li>
                <li>Um recurso <strong>só pode pertencer a um</strong> Compartment de cada vez, mas pode ser movido entre eles.</li>
                <li>Podem ser aninhados até 6 níveis de profundidade.</li>
                <li>Têm quotas associadas, úteis para gerir custos e limites por departamento.</li>
                <li>Permissões aplicadas a um parent compartment são herdadas pelos children.</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-amber-400 mb-2">IAM Policies (Verb & Resource)</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Ao contrário da AWS/Azure, na OCI as policies escrevem-se num formato semelhante a SQL (human-readable).</li>
                <li>Sintaxe base: <code>Allow group &lt;grupo&gt; to &lt;verbo&gt; &lt;recurso&gt; in compartment &lt;compartment&gt;</code>.</li>
                <li>Verbos: <strong>inspect</strong> (ler sem detalhes), <strong>read</strong> (ver métricas/configs), <strong>use</strong> (trabalhar com recursos sem modificar o ciclo de vida), <strong>manage</strong> (controlo total).</li>
              </ul>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 md:col-span-2">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Identity Domains (O novo padrão)</h4>
              <p className="text-[12px] text-slate-400 mb-2 leading-relaxed">
                Antigamente a OCI dividia o IAM e o IDCS (Identity Cloud Service). Hoje existe o <strong>Identity Domains</strong>, que unifica gestão de identidades, SSO (Single Sign-On), MFA, e provisionamento SCIM num único serviço.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'cheatsheet' && (
          <div>
            <Code lang="bash (OCI CLI)" code={`# OCI IAM Policies e Compartments

# 1. Criar um compartment
$ oci iam compartment create --name "DevCompartment" --description "Dev environment" --compartment-id <tenancy-ocid>

# 2. A política que a OCI tanto adora no exame
# Permite ao grupo de Devs GERIR instâncias num Compartment específico:
Allow group Developers to manage instance-family in compartment DevCompartment

# 3. Permite LEITURA a toda a Tenancy (conta inteira)
Allow group Auditors to read all-resources in tenancy

# 4. Condições (Where clauses)
Allow group NetworkAdmins to manage virtual-network-family in tenancy where request.region='eu-frankfurt-1'
`} />
          </div>
        )}

        {activeSubTab === 'case-study' && (
          <section className="mt-4 rounded-3xl border border-rose-500/25 bg-rose-500/5 p-6 space-y-4">
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
              6 meses depois, a equipa de Dev, Test e Prod partilhavam o mesmo Root Compartment. Uma policy mal escrita (<code>Allow group Devs to manage instance-family in tenancy</code>) deu aos Devs poder para apagar VMs da Produção. E foi o que aconteceu quando alguém quis "limpar o ambiente de dev".
            </p>
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 mt-4">
              <div className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-widest">Lição Aprendida (1Z0-1085 & 1Z0-1072):</div>
              <ul className="text-sm text-rose-100/90 space-y-2 list-disc list-inside">
                <li><strong>Nunca</strong> uses o Root Compartment para recursos diários. O Root deve existir apenas para guardar os Compartments filhos (estruturação organizacional) e gerir billing.</li>
                <li>As permissões de um Parent Compartment são herdadas pelos Child Compartments. Não faças policies globais <code>in tenancy</code> se podes limitar <code>in compartment X</code>.</li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
