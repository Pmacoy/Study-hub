import { useState } from 'react';
import { Cloud, Server, Settings, Check, Copy, DollarSign, Target, Box, Shield } from 'lucide-react';
import type { AzureTab } from '../../types/azure';

type SubTab = 'summary' | 'comparison' | 'case-study';

interface Props {
  tab: 'concepts' | 'architecture' | 'management';
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
            line.trim().startsWith('#') || line.trim().startsWith('//') ? 'text-slate-600'
            : line.includes('az ') ? 'text-sky-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function AzureFundamentalsSimulator({ tab }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('summary');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'summary', label: 'Resumo & Teoria' },
    { id: 'comparison', label: 'Comparações' },
    { id: 'case-study', label: 'Lições Aprendidas 💸' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400">
          {tab === 'concepts' ? <Cloud size={20} /> :
           tab === 'architecture' ? <Server size={20} /> :
           <Settings size={20} />}
        </div>
        <div>
          <h2 className="text-xl font-black text-white">
            {tab === 'concepts' ? 'Cloud Concepts' :
             tab === 'architecture' ? 'Architecture & Services' :
             'Management & Governance'}
          </h2>
          <p className="text-sm text-slate-400">Azure Fundamentals (AZ-900)</p>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
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

      {/* ── CONCEPTS ──────────────────────────────────────────────────────── */}
      {tab === 'concepts' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Modelos de Cloud</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Public Cloud:</strong> Propriedade do provedor (Microsoft). Acesso via internet, pay-as-you-go. Nenhuma infraestrutura local para gerir.</li>
                  <li><strong>Private Cloud:</strong> Recursos dedicados a uma única organização. Maior controlo e segurança. Pode estar no teu datacenter ou num parceiro.</li>
                  <li><strong>Hybrid Cloud:</strong> Combina Pública e Privada (ex: Azure Arc). Mantém dados sensíveis on-premises, usa a pública para scale (Cloud Bursting).</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-emerald-400 mb-2">Tipos de Serviço</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>IaaS:</strong> Infraestrutura como Serviço (VMs, Redes). Tu geres o SO e as apps. Máximo controlo.</li>
                  <li><strong>PaaS:</strong> Plataforma como Serviço (App Service, SQL DB). O Azure gere o SO. Tu focas-te no código e nos dados.</li>
                  <li><strong>SaaS:</strong> Software como Serviço (Microsoft 365, Teams). Consomes a aplicação pronta a usar.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'comparison' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <DollarSign size={16} /> CapEx vs OpEx
                </h4>
                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div>
                    <strong className="text-white">CapEx (Capital Expenditure):</strong>
                    <p className="text-slate-400 mt-1">Investimento inicial elevado na compra de servidores físicos, refrigeração, segurança. O valor deprecia com o tempo.</p>
                  </div>
                  <div>
                    <strong className="text-white">OpEx (Operational Expenditure):</strong>
                    <p className="text-slate-400 mt-1">Custos contínuos. Pagas apenas pelo que usas (pay-as-you-go). É o modelo da Cloud Pública. A faturação entra no orçamento mensal/anual.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: A Migração de Lift & Shift</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "A empresa decidiu migrar tudo para a Cloud para 'poupar dinheiro'. Fizeram um Lift & Shift (IaaS): copiaram 100 VMs gigantestas para o Azure e deixaram-nas ligadas 24/7."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                A fatura disparou! Em On-Premises (CapEx) o custo da infraestrutura já estava pago, ligar ou desligar as VMs não mudava muito. No Azure (OpEx), as VMs estavam sub-utilizadas mas a faturar continuamente 100%. Só pouparam quando refatoraram para PaaS e usaram auto-scaling.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição para o AZ-900:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li><strong>High Availability</strong> vs <strong>Scalability</strong>: A HA garante que o sistema não falha; a Escalabilidade (Elasticidade) garante que consomes mais ou menos recursos consoante a procura real.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ARCHITECTURE ───────────────────────────────────────────────────── */}
      {tab === 'architecture' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-2"><Target size={14}/> Estrutura Física</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Region:</strong> Uma área geográfica com 1 a vários Datacenters (ex: West Europe, em Amesterdão).</li>
                  <li><strong>Availability Zone (AZ):</strong> Centros de dados físicos separados dentro de uma Região (energia, refrigeração e rede independentes). Usadas para HA.</li>
                  <li><strong>Region Pairs:</strong> Cada região do Azure tem uma região "par" a ~300 milhas de distância para replicação de Disaster Recovery. O Azure atualiza-as alternadamente.</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-2"><Box size={14}/> Estrutura Lógica (ARM)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Resources:</strong> O serviço básico criado (uma VM, uma BD).</li>
                  <li><strong>Resource Groups (RG):</strong> Um contentor lógico. Um recurso TEM de pertencer a 1 e só 1 RG. RGs facilitam o RBAC e o Cost Management.</li>
                  <li><strong>Subscriptions:</strong> Unidade de faturação.</li>
                  <li><strong>Management Groups:</strong> Agrupam Subscriptions para aplicar políticas globais.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'comparison' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Hierarquia do Azure Resource Manager (ARM)</h3>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950">
                <Code lang="yaml" code={`# O "Scope" da Azure aplica herança de cima para baixo:
Root Management Group
└── Management Group (ex: RH)
    ├── Subscription 1 (ex: Produção)
    │   ├── Resource Group A
    │   │   ├── VM 1
    │   │   └── VNet 1
    │   └── Resource Group B
    └── Subscription 2 (ex: Dev/Test)`} />
              </div>
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: Apagar o Resource Group</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Estava a brincar com tutoriais da Microsoft e a criar recursos soltos. Criei um Resource Group chamado \`rg-sandbox\`. Quando terminei o tutorial, mandei apagar o Resource Group."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Ao apagar um Resource Group, <strong>TODOS</strong> os recursos que vivem lá dentro são eliminados em cadeia. Isto é uma excelente funcionalidade para limpar laboratórios temporários e não esquecer IPs públicos a gastar dinheiro!
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição para o AZ-900:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>Resource Groups não guardam dados; são apenas fronteiras lógicas.</li>
                  <li>Se apagares o RG, a VM, os discos, IPs, NICs que estão lá dentro desaparecem todos de uma vez.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MANAGEMENT ───────────────────────────────────────────────────── */}
      {tab === 'management' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-2"><Shield size={14}/> Azure Policy</h4>
                <p className="text-[12px] text-slate-400 mb-2">
                  Não é um sistema de permissões (RBAC diz "quem pode"). O Policy foca-se na conformidade do recurso ("o quê/onde pode").
                </p>
                <ul className="text-[12px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Obrigar recursos a serem criados só na região 'West Europe'.</li>
                  <li>Obrigar VMs a terem a tag 'Environment'.</li>
                  <li>Impedir criação de VMs extremamente caras.</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Cost Management</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>TCO Calculator:</strong> (Total Cost of Ownership) Estima a poupança que podes ter se migrares de On-Premises para Azure.</li>
                  <li><strong>Pricing Calculator:</strong> Estima os custos *futuros* de serviços do Azure.</li>
                  <li><strong>Cost Management & Billing:</strong> Analisa custos *atuais/passados*, cria orçamentos (Budgets) e envia alertas se ultrapassares um limite.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'comparison' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Ferramentas de Gestão (Tools)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <h4 className="text-xs font-bold text-slate-300">Azure Advisor</h4>
                  <p className="text-[11px] text-slate-500 mt-1">O teu consultor pessoal. Dá recomendações em 5 áreas: Fiabilidade, Segurança, Performance, Custo, e Excelência Operacional.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <h4 className="text-xs font-bold text-slate-300">Azure Blueprints</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Carimbo de compliance para novos projetos. Garante que uma nova subscrição tem todas as Policies, Roles e ARM Templates pré-definidos. (A ser substituído pelo Template Specs).</p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: O Botão de "Guardar" que nunca devia ser clicado</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Tínhamos uma base de dados de Produção que não deveria ser apagada por engano. Alguém acidentalmente executou um script Terraform destrutivo, apagando a BD."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                RBAC previne quem não tem acesso de apagar recursos, mas se a pessoa for Administrador, o RBAC deixa. A única forma de impedir uma ação destrutiva intencional ou acidental de utilizadores autorizados é usando <strong>Resource Locks</strong>.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição para o AZ-900:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li><strong>Delete Lock (CanNotDelete):</strong> Podes ler e modificar, mas não podes apagar.</li>
                  <li><strong>Read-Only Lock:</strong> Podes ler, mas não podes apagar nem modificar.</li>
                  <li>Resource Locks sobrepõem-se sempre ao RBAC! Mesmo o Global Admin vai ter erro ao apagar, e será obrigado a remover o Lock primeiro.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
