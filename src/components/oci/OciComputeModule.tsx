import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { OCI_TAB_META } from '../../data/oci/tabMeta';
import { Code } from './OciIamModule';

type SubTab = 'summary' | 'cheatsheet' | 'case-study';

export default function OciComputeModule() {
  const meta = OCI_TAB_META['compute'];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('summary');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'summary', label: 'Resumo & Teoria' },
    { id: 'cheatsheet', label: 'Comandos (Prática)' },
    { id: 'case-study', label: 'Lições Aprendidas 💸' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400">
          <Cpu size={20} />
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
        {activeSubTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-orange-400 mb-2">Tipos de Compute</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Bare Metal (BM):</strong> Acesso físico direto sem hipervisor. Máxima performance e isolamento (usado muito para Bases de Dados pesadas).</li>
                <li><strong>Virtual Machines (VM):</strong> Máquinas virtuais standard multi-tenant, como EC2 ou GCE.</li>
                <li><strong>Dedicated Virtual Hosts:</strong> VMs que correm num hardware isolado, apenas para o teu tenant (para compliance/regulamentação).</li>
                <li><strong>Preemptible VMs:</strong> Instâncias baratas mas que a OCI pode terminar a qualquer momento (para workloads stateless/batch).</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Autoscaling & Instance Pools</h4>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li><strong>Instance Configurations:</strong> Template de como criar uma VM (OS, shape, rede). Funciona como o Launch Template na AWS.</li>
                <li><strong>Instance Pools:</strong> Grupo de instâncias idênticas geridas juntas.</li>
                <li><strong>Autoscaling:</strong> Baseado em métricas (CPU/Memory) ou Schedules. Adiciona/Remove VMs do Instance Pool consoante a carga.</li>
              </ul>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 md:col-span-2">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">Containers (OKE & OCI Registry)</h4>
              <p className="text-[12px] text-slate-400 mb-2 leading-relaxed">
                O <strong>OKE (Oracle Cloud Infrastructure Container Engine for Kubernetes)</strong> é o serviço managed Kubernetes. Pode usar worker nodes geridos, Bare Metal ou até Virtual Nodes (onde não geres o servidor, tipo Fargate). O <strong>OCIR</strong> é o registry para imagens de Docker, compatível com Docker V2.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'cheatsheet' && (
          <div>
            <Code lang="bash (OCI CLI)" code={`# Listar instâncias Compute num compartment
$ oci compute instance list --compartment-id <compartment-ocid>

# Parar uma instância (Hard stop)
$ oci compute instance action --instance-id <instance-ocid> --action STOP

# Parar uma instância com graceful shutdown (Soft stop)
$ oci compute instance action --instance-id <instance-ocid> --action SOFTSTOP

# Criar instância básica (requer rede, shape, imagem e chave SSH)
$ oci compute instance launch --availability-domain "XyZ:EU-FRANKFURT-1-AD-1" \\
    --compartment-id <ocid> --shape "VM.Standard.E4.Flex" \\
    --subnet-id <subnet-ocid> --image-id <image-ocid>
`} />
          </div>
        )}

        {activeSubTab === 'case-study' && (
           <section className="mt-4 rounded-3xl border border-orange-500/25 bg-orange-500/5 p-6 space-y-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-lg font-bold text-white">Case Study: Flex Shapes e Custo 💸</h3>
           </div>
           <div className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-4 py-1">
             "Tentámos migrar uma aplicação antiga de on-prem para a Cloud. Exigia muita memória (64GB) mas pouco CPU (2 Cores). Noutras clouds, éramos obrigados a pagar por instâncias gigantes de 8 ou 16 cores só para ter os 64GB de RAM."
           </div>
           <p className="text-sm text-slate-400 leading-relaxed">
             Na OCI, introduziram o conceito de <strong>Flex Shapes</strong> (ex: <code>VM.Standard.E4.Flex</code>). Em vez de escolheres um tamanho fixo de t-shirt (Small, Medium, Large), podes alocar <strong>exatamente</strong> 2 OCPUs e 64GB de memória independentemente. Isto reduz drasticamente os custos para workloads desequilibradas.
           </p>
           <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/10 mt-4">
             <div className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-widest">Dica de Exame (1Z0-1085 & 1Z0-1072):</div>
             <ul className="text-sm text-orange-100/90 space-y-2 list-disc list-inside">
               <li>Lembra-te que <strong>1 OCPU</strong> (Oracle Compute Unit) equivale a 1 core físico, o que tem 2 vCPUs (threads). Noutras clouds (AWS, Azure) costumas pagar por vCPU.</li>
               <li>Flex Shapes permitem escalar CPU e RAM de forma independente, sendo ideais para otimização de licenciamento que cobra por core.</li>
             </ul>
           </div>
         </section>
        )}
      </div>
    </div>
  );
}
