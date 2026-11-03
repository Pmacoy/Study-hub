import { useState } from 'react';
import { Box } from 'lucide-react';
import { OCI_TAB_META } from '../../data/oci/tabMeta';

type SubTab = 'block' | 'object' | 'file';

export default function OciStorageModule() {
  const meta = OCI_TAB_META['storage'];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('block');

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'block', label: 'Block Volume' },
    { id: 'object', label: 'Object & Archive' },
    { id: 'file', label: 'File Storage' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400">
          <Box size={20} />
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
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-in fade-in">
        {activeSubTab === 'block' && (
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <h4 className="text-sm font-bold text-violet-400 mb-4">Block Volume Service</h4>
            <p className="text-[12px] text-slate-400 mb-4">Discos de alta performance conectados à rede, desenhados para serem usados com Compute Instances (como o EBS da AWS).</p>
            
            <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
              <li><strong>Boot Volumes:</strong> Contêm o disco OS da instância. Se a instância terminar, podes optar por preservar o Boot Volume.</li>
              <li><strong>Block Volumes:</strong> Discos de dados adicionais. Podem ser desanexados de uma instância e anexados a outra (desde que na mesma AD).</li>
              <li><strong>Backups (Automáticos vs Policy-based):</strong> Podes fazer backups de um Block Volume para Object Storage (mais barato). Backups podem ser incrementais ou full.</li>
              <li><strong>Volume Groups:</strong> Permite agrupar múltiplos volumes e fazer point-in-time backups coordenados a todos eles de uma só vez (crucial para Bases de Dados com data e log disks separados).</li>
            </ul>

            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 mt-4">
              <strong className="text-xs text-violet-300">Tiers de Performance (VPU):</strong>
              <div className="text-[11px] text-slate-400 mt-1">Podes ajustar dinamicamente a performance (Volume Performance Units) de um Block Volume <strong>sem downtime</strong>. Os tiers são: Lower Cost, Balanced, Higher Performance, Ultra High Performance.</div>
            </div>
          </div>
        )}

        {activeSubTab === 'object' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Object Storage</h4>
              <p className="text-[12px] text-slate-400 mb-2">Armazenamento não-estruturado massivamente escalável (como S3). Os dados são guardados como objetos em <strong>Buckets</strong> numa flat-hierarchy.</p>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>Ideal para imagens, vídeos, backups, logs e big data.</li>
                <li><strong>Regional:</strong> Os dados são automaticamente replicados através de Fault Domains ou ADs na região para durabilidade.</li>
                <li><strong>Pre-Authenticated Requests (PAR):</strong> Permite dar acesso temporário de leitura/escrita a um objeto sem precisar de credenciais OCI.</li>
                <li><strong>Lifecycle Policies:</strong> Pode mover objetos de Standard para Archive automaticamente após X dias.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h4 className="text-sm font-bold text-sky-400 mb-2">Archive Storage</h4>
              <p className="text-[12px] text-slate-400 mb-2">Tier de storage extremamente barato para dados raramente acedidos que têm de ser guardados durante anos (Compliance).</p>
              <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
                <li>10x mais barato que Standard.</li>
                <li><strong>Acesso não é imediato:</strong> Precisas de fazer restore de um objeto arquivado antes de o ler (demora pelo menos 1 hora a ficar disponível).</li>
                <li>Período de retenção mínimo de 90 dias (pagas os 90 dias mesmo que apagues no dia 2).</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'file' && (
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
             <h4 className="text-sm font-bold text-emerald-400 mb-4">File Storage Service (FSS)</h4>
             <p className="text-[12px] text-slate-400 mb-4">Partilha de ficheiros gerida ao nível da rede compatível com NFS v3 (como o EFS da AWS).</p>
             
             <ul className="text-[12px] text-slate-400 space-y-2 list-disc list-inside">
               <li>Múltiplas instâncias podem aceder (Read/Write) ao mesmo sistema de ficheiros concorrentemente.</li>
               <li>Altamente disponível e resiliente dentro de um Availability Domain (recreia hardware automaticamente se houver falha).</li>
               <li>Escala de kilobytes até exabytes, pagando apenas pelo que se usa (ao contrário de Block Volume, que provisiona espaço estático).</li>
               <li><strong>Snapshots:</strong> Point-in-time read-only views do File System. Podem ser tirados até 10,000 snapshots por file system. Não requer tempo extra.</li>
             </ul>
             
             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mt-4">
              <strong className="text-xs text-emerald-300">File Storage Security:</strong>
              <div className="text-[11px] text-slate-400 mt-1">Controlado via IAM (quem pode gerir o File System) + Export Options (quais IPs/CIDRs podem montar via NFS) + Permissões POSIX tradicionais.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
