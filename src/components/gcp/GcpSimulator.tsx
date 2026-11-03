import { useState } from 'react';
import { Cloud, Server, Database, Network, ShieldCheck, Check, Copy, Box, Activity } from 'lucide-react';
import type { GcpStudyTab } from '../../types/gcp';
import { GCP_TAB_META } from '../../data/gcp/tabMeta';

type SubTab = 'summary' | 'cheatsheet' | 'case-study';

interface Props {
  tab: GcpStudyTab;
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
            : line.startsWith('$') || line.startsWith('gcloud') || line.startsWith('gsutil') ? 'text-sky-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default function GcpSimulator({ tab }: Props) {
  const meta = GCP_TAB_META[tab];
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
           tab === 'storage' ? <Database size={20} /> :
           tab === 'networking' || tab === 'adv-networking' ? <Network size={20} /> :
           tab === 'architecture' ? <Box size={20} /> :
           tab === 'scaling' ? <Activity size={20} /> :
           <ShieldCheck size={20} />}
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{meta.label}</h2>
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

      {/* ── COMPUTE ──────────────────────────────────────────────────────── */}
      {tab === 'compute' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Compute Engine (GCE)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>IaaS:</strong> Máquinas virtuais customizáveis.</li>
                  <li><strong>Spot/Preemptible:</strong> Até 91% de desconto. Vivem max 24h.</li>
                  <li><strong>Live Migration:</strong> GCE move VMs entre hosts para manutenção sem downtime (excepto Spot VMs).</li>
                  <li><strong>MIGs:</strong> Managed Instance Groups permitem auto-healing e auto-scaling.</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Google Kubernetes Engine (GKE)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Standard:</strong> Geres os nós (EC2 equivalent).</li>
                  <li><strong>Autopilot:</strong> Paga por pod, Google gere os nós (Fargate equivalent). Muito cobrado no exame!</li>
                  <li><strong>Cloud Run:</strong> Serverless containers via Knative. Scale to zero imediato.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos Frequentes GCE / GKE</h3>
              <Code lang="bash" code={`# Criar uma instância GCE simples
gcloud compute instances create my-vm --zone=us-central1-a --machine-type=e2-micro

# Ligar à VM via SSH
gcloud compute ssh my-vm --zone=us-central1-a

# GKE: Obter credenciais para o kubectl
gcloud container clusters get-credentials my-cluster --zone=us-central1-a

# Deploy Cloud Run de uma imagem
gcloud run deploy my-app --image=gcr.io/my-project/my-app --allow-unauthenticated`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: O Autoscaling Agressivo do GKE</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Estava a testar uma prova de conceito com HPA (Horizontal Pod Autoscaler) no GKE num cluster de desenvolvimento. Gerei tráfego artificial infinito com o JMeter na 6ª feira à tarde."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Esqueci-me que o Node Auto-provisioning estava activo e o limite global do cluster não estava configurado. O cluster detetou pods pendentes e foi subindo de 3 nós para mais de 100 nós <code className="text-rose-300">e2-standard-4</code>.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição Aprendida para o Exame ACE:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>Configura sempre Quotas a nível de IAM/Projeto para restringir o número de CPUs (\`gcloud compute project-info describe\`).</li>
                  <li>Define o parâmetro <code className="text-amber-200">--max-nodes</code> no cluster autoscaler de forma estrita.</li>
                  <li>No GKE, Autopilot protege-te melhor porque pagas por Pod provisionado, mas podes na mesma estourar o budget se os Pods escalarem infinitamente sem limites de Namespace (ResourceQuotas).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NETWORKING ───────────────────────────────────────────────────── */}
      {tab === 'networking' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">VPC (Virtual Private Cloud)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Global VPC:</strong> No GCP, as VPCs são recursos globais (não regionais como na AWS).</li>
                  <li><strong>Subnets:</strong> São regionais. Os IPs podem expandir-se a quente (sem downtime).</li>
                  <li><strong>Shared VPC:</strong> Rede centralizada num "Host Project" consumida por "Service Projects".</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Conectividade & Balanceamento</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Load Balancers:</strong> Global (HTTP/S, SSL Proxy, TCP Proxy) e Regional (TCP/UDP interno e externo).</li>
                  <li><strong>Cloud Interconnect:</strong> Dedicado (ligação física 10Gbps/100Gbps) vs Partner (via ISP).</li>
                  <li><strong>Cloud NAT:</strong> Para VMs privadas acederem à internet.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos VPC e Firewall</h3>
              <Code lang="bash" code={`# Criar uma VPC custom (não automática)
gcloud compute networks create my-vpc --subnet-mode=custom

# Adicionar uma subnet
gcloud compute networks subnets create my-subnet \\
    --network=my-vpc --region=europe-west1 --range=10.0.1.0/24

# Criar regra de firewall (permitir SSH de qualquer lado - CUIDADO!)
gcloud compute firewall-rules create allow-ssh \\
    --network=my-vpc --allow=tcp:22 --source-ranges=0.0.0.0/0`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: A Firewall de Ouro e a Botnet</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Não estava a conseguir aceder por RDP a uma VM Windows. Em desespero para não perder o dia, criei uma regra de firewall 0.0.0.0/0 para todas as portas. 'É só por 5 minutos', pensei."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Fui almoçar sem apagar a regra. Quando voltei, a VM estava com 100% CPU a minar criptomoedas. A fatura mensal subiu porque os atacantes escalaram os recursos da VM lateralmente.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição Aprendida para o Exame ACE:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>No GCP, a melhor forma de aceder a instâncias privadas é via <strong>IAP (Identity-Aware Proxy)</strong>. O IAP permite aceder por SSH/RDP sem precisares de IPs públicos na VM.</li>
                  <li>Basta permitires o range IAP na firewall: <code className="text-amber-200">35.235.240.0/20</code>.</li>
                  <li>No exame, se vires 0.0.0.0/0 numa firewall ou IPs públicos numa DB, a resposta geralmente é "errada" no ponto de vista de segurança arquitetural.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STORAGE ───────────────────────────────────────────────────────── */}
      {tab === 'storage' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Cloud Storage (Object)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Standard:</strong> Acesso frequente (websites, streaming).</li>
                  <li><strong>Nearline:</strong> Lidos &lt; 1x por mês. Backup curto.</li>
                  <li><strong>Coldline:</strong> Lidos &lt; 1x por trimestre.</li>
                  <li><strong>Archive:</strong> Lidos &lt; 1x por ano (fita virtual). Custo retenção alto se apagado cedo.</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Block & Databases</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Persistent Disk:</strong> Armazenamento de bloco preso à VM.</li>
                  <li><strong>Cloud SQL:</strong> MySQL, PostgreSQL, SQL Server geridos.</li>
                  <li><strong>Cloud Spanner:</strong> Relacional, SQL-compliant mas escalabilidade horizontal infinita (Global).</li>
                  <li><strong>BigQuery:</strong> Data warehouse para análise de petabytes.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos Cloud Storage</h3>
              <p className="text-[12px] text-slate-400 mb-2">
                A CLI moderna do GCP usa <code className="text-sky-300">gcloud storage</code>, mas o <code className="text-sky-300">gsutil</code> continua muito presente no exame ACE.
              </p>
              <Code lang="bash" code={`# Criar um bucket multiregional com a classe Archive
gcloud storage buckets create gs://my-archive-bucket \\
    --location=EU --default-storage-class=archive

# Copiar ficheiros recursivamente
gsutil cp -r ./local-folder gs://my-bucket/backup/

# Modificar storage class de um objecto existente
gsutil rewrite -s nearline gs://my-bucket/old-file.jpg`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: "Mas eu achei que Authenticated era interno..."</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Deram-me a tarefa de partilhar os relatórios financeiros do trimestre apenas com quem tivesse conta na empresa. Adicionei o grupo especial \`allAuthenticatedUsers\` ao IAM do bucket."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Algumas horas depois a equipa de segurança ligou em pânico. No GCP, \`allAuthenticatedUsers\` não significa "autenticados na minha empresa". Significa <strong>qualquer pessoa no planeta</strong> que tenha uma conta Google válida (qualquer Gmail serve).
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição Aprendida para o Exame ACE:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>O grupo <code className="text-amber-200">allUsers</code> expõe à internet pública.</li>
                  <li>O grupo <code className="text-amber-200">allAuthenticatedUsers</code> expõe a qualquer pessoa com login feito na Google.</li>
                  <li>Para partilhar só com a tua empresa, tens de usar o domínio do Cloud Identity/Workspace, ex: <code className="text-amber-200">domain:minhaempresa.com</code>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── IAM ───────────────────────────────────────────────────────────── */}
      {tab === 'iam' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Gestão de Identidade (IAM)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Identidade ("Quem"):</strong> Contas Google, Service Accounts, Grupos, Domínios.</li>
                  <li><strong>Papel / Role ("O quê"):</strong> Coleção de permissões (ex: roles/storage.objectViewer).</li>
                  <li><strong>Binding:</strong> Associar a Identidade ao Papel num determinado recurso (Organização &gt; Folder &gt; Project &gt; Recurso).</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Tipos de Roles</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Basic/Primitive Roles:</strong> Viewer, Editor, Owner. **Nunca uses** em produção. São demasiado abrangentes.</li>
                  <li><strong>Predefined Roles:</strong> Criados pelo Google, granulares (ex: Compute Instance Admin). Recomendado.</li>
                  <li><strong>Custom Roles:</strong> Permissões à la carte criadas por ti. Têm sobrecarga de manutenção.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos IAM</h3>
              <Code lang="bash" code={`# Adicionar um papel de Storage Admin a um utilizador num projeto
gcloud projects add-iam-policy-binding my-project-id \\
    --member="user:alice@example.com" \\
    --role="roles/storage.admin"

# Criar uma Service Account
gcloud iam service-accounts create my-sa \\
    --display-name="Aplicação de Pagamentos"

# Obter a key de uma SA para autenticar localmente (evitar ao máximo usar json keys)
gcloud iam service-accounts keys create sa-key.json \\
    --iam-account=my-sa@my-project-id.iam.gserviceaccount.com`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: A Herança Trágica do IAM</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Para facilitar o acesso da equipa de estagiários aos logs (e porque era sexta-feira), dei a role 'Project Editor' aos novos engenheiros."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                As políticas IAM no GCP herdam de cima para baixo. Ao serem "Editors" a nível de Projeto, os estagiários podiam apagar baldes Cloud Storage, alterar regras de firewall e apagar a base de dados de produção, porque a role básica "Editor" concede acesso transversal a quase tudo na Google Cloud.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição Aprendida para o Exame ACE:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li><strong>IAM policy inheritance é cumulativa:</strong> Não podes remover o acesso a nível de recurso inferior se ele foi concedido a nível superior. O ALLOW ganha sempre (não existe "Deny" explícito no IAM standard).</li>
                  <li>O Google recomenda <strong>fortemente</strong> o uso de Predefined Roles (ex: \`roles/logging.viewer\`) em vez de Primitive Roles (Owner, Editor, Viewer).</li>
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
                <h4 className="text-sm font-bold text-rose-400 mb-2">Design & Migração</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Lift and Shift:</strong> Move VMs as-is usando Migrate for Compute Engine. Rápido, mas não tira partido da cloud nativa.</li>
                  <li><strong>Improve and Move:</strong> Refatoriza a aplicação para contentores e move para o GKE. Reduz lock-in e otimiza custos a longo prazo.</li>
                  <li><strong>Rip and Replace:</strong> Reescreve tudo usando serviços serverless (Cloud Run, Cloud Functions) e DBs geridas (Spanner).</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Hybrid & Multi-Cloud</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Anthos / GKE Enterprise:</strong> Plataforma para gerir clusters Kubernetes de forma consistente em GCP, AWS, Azure ou On-Prem.</li>
                  <li><strong>Disaster Recovery (DR):</strong> RTO (Recovery Time Objective) vs RPO (Recovery Point Objective).</li>
                  <li>Padrões de DR: Cold (Backup/Restore), Warm (Pilot Light), Hot (Multi-region Active-Active).</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos GKE Hub (Anthos)</h3>
              <Code lang="bash" code={`# Registar um cluster GKE externo (ex: na AWS ou On-Prem) no hub central
gcloud container hub memberships register meu-cluster-onprem \\
    --context=meu-contexto-kubeconfig \\
    --kubeconfig=/path/to/kubeconfig \\
    --service-account-key-file=sa-key.json

# Verificar clusters registados (Single Pane of Glass)
gcloud container hub memberships list`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: Cloud Spanner vs Cloud SQL num cenário Global</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Lançámos um jogo móvel de sucesso global, e a nossa base de dados MySQL (Cloud SQL) em us-central1 rebentou com os picos de tráfego, enquanto utilizadores da Europa se queixavam de latência absurda."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Tentar replicar Cloud SQL (master-slave) por várias regiões é doloroso e não resolve o problema de escritas (só tens um Master). A arquitetura correta seria migrar a persistência global, altamente transacional e com esquema relacional para o <strong>Cloud Spanner</strong>.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição para o PCA:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>Se a escala é regional ou o tamanho é &lt;30 TB: <strong>Cloud SQL</strong>.</li>
                  <li>Se a escala é global, fortemente consistente, transacional, relacional e terabytes infinitos: <strong>Cloud Spanner</strong>.</li>
                  <li>Se a app precisa de document storage ultra-rápido, sem esquema rígido: <strong>Firestore / Datastore</strong>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ADVANCED NETWORKING ────────────────────────────────────────────── */}
      {tab === 'adv-networking' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Conectividade Privada</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>VPC Peering:</strong> Liga duas VPCs (da mesma organização ou de organizações diferentes) usando IPs internos. Não é transitivo (A liga B, B liga C; A não fala com C automaticamente).</li>
                  <li><strong>Shared VPC:</strong> Diferente de peering. Cria um "Host Project" com uma VPC e partilha as suas sub-redes com "Service Projects". Centraliza faturação e regras de firewall da rede.</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Conectividade Híbrida</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Cloud VPN (HA):</strong> Túnel IPsec over Internet. Custo baixo, largura de banda variável (depende da internet pública). Suporta BGP.</li>
                  <li><strong>Dedicated Interconnect:</strong> Ligação física (10/100 Gbps) ao datacenter do Google. Latência baixa, tráfego não passa na internet pública.</li>
                  <li><strong>Partner Interconnect:</strong> Semelhante ao Dedicated, mas fornecido através de um Service Provider parceiro.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos Advanced Networking</h3>
              <Code lang="bash" code={`# Criar uma ligação de VPC Peering da vpc-A para a vpc-B
gcloud compute networks peerings create peer-ab \\
    --network=vpc-a \\
    --peer-network=vpc-b \\
    --peer-project=projeto-b

# Configurar um projeto como Shared VPC Host
gcloud compute shared-vpc enable my-host-project

# Associar um Service Project à Shared VPC
gcloud compute shared-vpc associated-projects add my-service-project \\
    --host-project=my-host-project`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: A Morte do Transit Routing no GCP</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Temos uma VPC On-Premise ligada por VPN à VPC de Hub. Depois fizemos VPC Peering do Hub para as Spoke VPCs das aplicações. De repente, os servidores On-Premises não pingavam as aplicações Spoke."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Este é o erro mais clássico de redes no GCP. O tráfego do On-Premise entra na VPC Hub, mas a VPC Hub não propaga rotas do VPC Peering diretamente por default, e o peering não é transitivo.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição para o PCA:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>Para resolver isto usando VPC Peering tens de ativar <strong>Custom Route Export/Import</strong> e assegurar-te de que o Cloud Router que está a fechar a VPN On-Premise está configurado para publicitar essas sub-redes.</li>
                  <li>Contudo, a arquitetura moderna recomendada pelo Google para redes de larga escala (Hub & Spoke com múltiplos peers e VPNs) é usar o <strong>Network Connectivity Center (NCC)</strong>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SCALING INFRASTRUCTURE ─────────────────────────────────────────── */}
      {tab === 'scaling' && (
        <div className="space-y-4">
          {activeSubTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-rose-400 mb-2">Compute Engine (VMs)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Managed Instance Groups (MIGs):</strong> Escalabilidade horizontal (aumentar número de VMs) com base no CPU, tráfego do Load Balancer ou métricas da Cloud Monitoring.</li>
                  <li><strong>Autohealing:</strong> Os MIGs reconstroem instâncias se os health-checks falharem.</li>
                  <li><strong>Stateless é Rei:</strong> Para os MIGs escalarem a zero ou removerem nós sem dor, as VMs devem ser *Stateless* (sem dados persistentes na drive local).</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <h4 className="text-sm font-bold text-sky-400 mb-2">Google Kubernetes Engine (GKE)</h4>
                <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>HPA (Horizontal Pod Autoscaler):</strong> Escala o número de réplicas de um Pod. (Scale Out/In)</li>
                  <li><strong>VPA (Vertical Pod Autoscaler):</strong> Escala recursos de CPU/RAM pedidos pelo Pod. O Pod tem de reiniciar para aplicar (Scale Up/Down). Não deves usar HPA e VPA nas mesmas métricas (CPU/RAM).</li>
                  <li><strong>Cluster Autoscaler:</strong> Adiciona/remove nós ao cluster quando há pods *Pending* (não há espaço) ou nós vazios.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'cheatsheet' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Comandos de Scaling (MIG)</h3>
              <Code lang="bash" code={`# Configurar um autoscaler para manter uso de CPU de 60% num MIG
gcloud compute instance-groups managed set-autoscaling meu-mig \\
    --max-num-replicas=10 \\
    --min-num-replicas=2 \\
    --target-cpu-utilization=0.6 \\
    --zone=europe-west1-b`} />
            </div>
          )}

          {activeSubTab === 'case-study' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-white">Case Study: O Autoscaling Lento e as Promos da Black Friday</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black">TRUE STORY</span>
              </div>
              <div className="text-[13px] text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
                "Estávamos no GKE com Cluster Autoscaler e HPA ativos. Mandámos um push notification para 5 milhões de utilizadores na Black Friday. O site foi abaixo em segundos."
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                O tráfego de push notifications é o chamado *Spike* de agulha. Sobe de 0 para 100 mil em 2 segundos.
                O HPA precisa de tempo para ler métricas. Quando leu, precisava de agendar os pods. Como não havia nós suficientes, o Cluster Autoscaler foi acionado. Criar uma nova VM debaixo do GKE demora ~2-4 minutos. Quando os nós finalmente subiram, a promoção já tinha passado e os utilizadores tinham desistido de erro 502.
              </p>
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                <div className="text-[12px] font-bold text-amber-400 mb-2">Lição para o PCA:</div>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>Autoscaling reativo não sobrevive a push notifications ou campanhas de TV massivas e abruptas.</li>
                  <li>Para eventos conhecidos, deves usar <strong>Pre-warming</strong> (escalar manualmente o minimum-replicas antes da campanha).</li>
                  <li>Em arquiteturas modernas (Event-Driven), este pico seria absorvido por um broker escalável como o <strong>Pub/Sub</strong>, permitindo que os workers consumam as mensagens ao seu ritmo, em vez de deixar estourar as ligações síncronas HTTP front-end.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
