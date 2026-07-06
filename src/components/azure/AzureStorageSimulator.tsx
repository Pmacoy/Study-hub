
import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Box,
  CheckCircle2,
  Database,
  Eye,
  Globe,
  HardDrive,
  Lock,
  Network,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Unlock,
  Zap,
} from 'lucide-react';

type Redundancy = 'LRS' | 'ZRS' | 'GRS' | 'RA-GRS' | 'GZRS' | 'RA-GZRS';
type NetworkMode = 'public' | 'selected' | 'private';

type RedundancyConfig = {
  title: string;
  short: string;
  desc: string;
  replicationPrimary: string;
  replicationSecondary: string;
  protection: string;
  bestFor: string;
  examFit: string;
  readSecondary: boolean;
  geo: boolean;
  zonal: boolean;
  asyncGeo: boolean;
  syncPrimary: boolean;
  badge?: string;
  tone: 'slate' | 'sky' | 'violet' | 'emerald' | 'amber';
};

const redundancyDetails: Record<Redundancy, RedundancyConfig> = {
  LRS: {
    title: 'LRS (Locally-Redundant Storage)',
    short: '3 cópias no mesmo local físico',
    desc: 'Mantém três cópias dos dados dentro de um único datacenter na região primária.',
    replicationPrimary: '3 cópias locais no mesmo datacenter.',
    replicationSecondary: 'Não existe região secundária.',
    protection: 'Falha de disco, nó e alguns eventos locais de hardware.',
    bestFor: 'Dev/test, workloads baratos e dados recriáveis.',
    examFit: 'Quando o foco é menor custo e não há exigência de zona ou DR regional.',
    readSecondary: false,
    geo: false,
    zonal: false,
    asyncGeo: false,
    syncPrimary: true,
    tone: 'slate',
  },
  ZRS: {
    title: 'ZRS (Zone-Redundant Storage)',
    short: '3 cópias entre zonas da mesma região',
    desc: 'Copia os dados de forma síncrona por três Availability Zones na região primária.',
    replicationPrimary: 'Replicação síncrona entre 3 zonas.',
    replicationSecondary: 'Não existe região secundária.',
    protection: 'Perda de um datacenter inteiro dentro da mesma região.',
    bestFor: 'Apps com alta disponibilidade regional e forte consistência.',
    examFit: 'Quando a pergunta pede proteção por zonas, mas não pede DR para outra região.',
    readSecondary: false,
    geo: false,
    zonal: true,
    asyncGeo: false,
    syncPrimary: true,
    tone: 'sky',
  },
  GRS: {
    title: 'GRS (Geo-Redundant Storage)',
    short: 'LRS na primária + réplica assíncrona na secundária',
    desc: 'Usa LRS na região primária e replica de forma assíncrona para uma região secundária emparelhada.',
    replicationPrimary: '3 cópias locais na região primária.',
    replicationSecondary: '3 cópias LRS na região secundária após geo-replicação assíncrona.',
    protection: 'Desastre regional com possibilidade de failover.',
    bestFor: 'DR regional quando leitura no secundário não é necessária.',
    examFit: 'Quando a pergunta pede DR regional, mas não fala em leitura contínua no secundário.',
    readSecondary: false,
    geo: true,
    zonal: false,
    asyncGeo: true,
    syncPrimary: true,
    tone: 'violet',
  },
  'RA-GRS': {
    title: 'RA-GRS (Read-Access Geo-Redundant Storage)',
    short: 'GRS com leitura ativa no secundário',
    desc: 'Mantém a mesma geo-redundância do GRS, mas expõe o endpoint secundário para leitura.',
    replicationPrimary: '3 cópias locais na região primária.',
    replicationSecondary: '3 cópias LRS na região secundária com endpoint legível.',
    protection: 'Desastre regional e continuidade de leitura.',
    bestFor: 'Aplicações que precisam consultar dados mesmo com indisponibilidade da primária.',
    examFit: 'Se a questão disser “ler no secundário” sem failover, RA-GRS é um forte candidato.',
    readSecondary: true,
    geo: true,
    zonal: false,
    asyncGeo: true,
    syncPrimary: true,
    badge: 'Read Access',
    tone: 'emerald',
  },
  GZRS: {
    title: 'GZRS (Geo-Zone-Redundant Storage)',
    short: 'ZRS na primária + geo-replicação para secundária',
    desc: 'Combina replicação síncrona entre zonas na primária com replicação assíncrona para uma região secundária.',
    replicationPrimary: '3 cópias síncronas entre zonas na primária.',
    replicationSecondary: '3 cópias LRS na secundária após geo-replicação assíncrona.',
    protection: 'Falha zonal na primária e desastre regional.',
    bestFor: 'Workloads críticos com exigência alta de disponibilidade e durabilidade.',
    examFit: 'Quando a questão quer proteção por zonas e também DR entre regiões.',
    readSecondary: false,
    geo: true,
    zonal: true,
    asyncGeo: true,
    syncPrimary: true,
    badge: 'Máxima proteção',
    tone: 'amber',
  },
  'RA-GZRS': {
    title: 'RA-GZRS (Read-Access Geo-Zone-Redundant Storage)',
    short: 'GZRS com leitura ativa no secundário',
    desc: 'É o GZRS com endpoint secundário disponível para leitura, combinando zonas, geo e read access.',
    replicationPrimary: '3 cópias síncronas entre zonas na primária.',
    replicationSecondary: '3 cópias LRS na secundária com endpoint legível.',
    protection: 'Falha zonal, desastre regional e continuidade de leitura.',
    bestFor: 'Aplicações globais e críticas com requisitos máximos de resiliência.',
    examFit: 'Quando a pergunta junta proteção por zonas, DR regional e leitura no secundário.',
    readSecondary: true,
    geo: true,
    zonal: true,
    asyncGeo: true,
    syncPrimary: true,
    badge: 'Topo da matriz',
    tone: 'amber',
  },
};

const toneStyles: Record<RedundancyConfig['tone'], string> = {
  slate: 'border-slate-700 bg-slate-900 text-slate-200',
  sky: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
  violet: 'border-violet-500/20 bg-violet-500/10 text-violet-200',
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
};

export default function AzureStorageSimulator() {
  const [redundancy, setRedundancy] = useState<Redundancy>('RA-GZRS');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('selected');

  const current = redundancyDetails[redundancy];

  const securityVerdict = useMemo(() => {
    if (networkMode === 'private') {
      return {
        title: 'Acesso privado pela VNet',
        desc: 'O acesso usa Private Endpoint, com tráfego pela backbone da Microsoft e sem exposição à internet pública.',
        tone: 'emerald' as const,
      };
    }

    if (networkMode === 'selected') {
      return {
        title: 'Acesso restrito por regras',
        desc: 'A storage account mantém endpoint público, mas o acesso fica controlado por network rules, IPs e VNets permitidas.',
        tone: 'sky' as const,
      };
    }

    return {
      title: 'Exposição pública mais ampla',
      desc: 'O endpoint público permanece mais aberto, o que é menos alinhado com cenários administrativos seguros.',
      tone: 'amber' as const,
    };
  }, [networkMode]);

  const matrixRows = [
    { label: 'Replicação geográfica', value: current.geo },
    { label: 'Proteção por zonas', value: current.zonal },
    { label: 'Leitura no secundário', value: current.readSecondary },
    { label: 'Geo assíncrono', value: current.asyncGeo },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 text-slate-200">
      <section className="overflow-hidden rounded-3xl border border-amber-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Database size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                Armazenamento e resiliência
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Azure Storage Architecture
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Compara redundância local, zonal e geográfica, incluindo RA-GZRS, e mostra como segurança de rede muda o desenho operacional da storage account.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-6 md:px-8">
          <TopMetric label="Redundância atual" value={redundancy} hint="Modelo selecionado" tone="amber" />
          <TopMetric label="Leitura secundária" value={current.readSecondary ? 'Disponível' : 'Indisponível'} hint="Pista de prova" tone="sky" />
          <TopMetric label="Geo-replicação" value={current.geo ? 'Ativa' : 'Não'} hint="DR regional" tone="emerald" />
          <TopMetric
            label="Acesso de rede"
            value={networkMode === 'private' ? 'Private Link' : networkMode === 'selected' ? 'Selected networks' : 'Public'}
            hint="Postura de segurança"
            tone="amber"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Configurar cenário</h3>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              1. Escolhe a redundância
            </label>

            <div className="space-y-3">
              {(Object.keys(redundancyDetails) as Redundancy[]).map((option) => {
                const item = redundancyDetails[option];
                const active = redundancy === option;

                return (
                  <button
                    key={option}
                    onClick={() => setRedundancy(option)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-slate-700 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${toneStyles[item.tone]}`}>
                        <HardDrive size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-semibold text-white">{option}</p>
                          {item.badge && (
                            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">{item.short}</p>
                      </div>

                      {active && <CheckCircle2 size={18} className="ml-auto shrink-0 text-amber-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              2. Segurança da storage account
            </label>

            <div className="space-y-3">
              <NetworkButton
                active={networkMode === 'public'}
                onClick={() => setNetworkMode('public')}
                icon={<Unlock size={16} />}
                title="Public access"
                desc="Endpoint público mais aberto, sem restrição forte por origem."
                tone="amber"
              />

              <NetworkButton
                active={networkMode === 'selected'}
                onClick={() => setNetworkMode('selected')}
                icon={<Network size={16} />}
                title="Selected networks"
                desc="Mantém endpoint público, mas restringe por VNet rules, IP rules e exceções confiáveis."
                tone="sky"
              />

              <NetworkButton
                active={networkMode === 'private'}
                onClick={() => setNetworkMode('private')}
                icon={<Lock size={16} />}
                title="Private endpoint"
                desc="Acesso pela VNet via Private Link, eliminando exposição ao public internet."
                tone="emerald"
              />
            </div>

            <div
              className={`mt-4 rounded-2xl border p-4 ${
                securityVerdict.tone === 'emerald'
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : securityVerdict.tone === 'sky'
                  ? 'border-sky-500/20 bg-sky-500/10'
                  : 'border-amber-500/20 bg-amber-500/10'
              }`}
            >
              <p className="text-[14px] font-semibold text-white">{securityVerdict.title}</p>
              <p className="mt-1 text-[12px] text-slate-300 leading-relaxed">{securityVerdict.desc}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search size={14} className="text-slate-400" />
                <p className="text-[12px] font-semibold text-white">Endpoints</p>
              </div>

              <div className="space-y-3 text-[12px]">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500">Primary endpoint</span>
                  <span className="font-mono text-emerald-400 text-right break-all">
                    mystorage.blob.core.windows.net
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500">Secondary endpoint</span>
                  <span className={`font-mono text-right break-all ${current.readSecondary ? 'text-sky-400' : 'text-slate-600 italic'}`}>
                    {current.readSecondary ? 'mystorage-secondary.blob.core.windows.net' : 'Leitura indisponível'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500">Acesso de rede</span>
                  <span className="text-right text-slate-300">
                    {networkMode === 'private'
                      ? 'Private Link / endpoint privado'
                      : networkMode === 'selected'
                      ? 'VNet + IP rules + trusted services'
                      : 'Mais amplo pelo endpoint público'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 min-h-[420px] overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Visualização da arquitetura
                </p>
                <h3 className="mt-1 text-sm font-semibold text-white">Distribuição dos dados</h3>
              </div>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-400">
                {current.geo ? 'Geo replication ativa' : 'Sem região secundária'}
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
              <div className="flex flex-col items-center gap-5">
                <div className="text-center">
                  <Globe size={18} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-[12px] font-semibold text-white">Region 01</p>
                  <p className="text-[11px] text-slate-500">Primária</p>
                </div>

                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => {
                    const isActive = i === 1 || current.zonal;

                    return (
                      <div
                        key={i}
                        className={`w-20 h-28 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
                          isActive
                            ? 'border-amber-500/40 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.10)]'
                            : 'border-slate-800 bg-slate-900/40 opacity-40'
                        }`}
                      >
                        <Server size={18} className={isActive ? 'text-amber-300' : 'text-slate-600'} />
                        <span className="text-[11px] font-medium text-slate-200">AZ {i}</span>

                        <div className="flex gap-1">
                          {current.zonal ? (
                            <Box size={10} className="text-amber-400" />
                          ) : i === 1 ? (
                            <>
                              <Box size={10} className="text-amber-400" />
                              <Box size={10} className="text-amber-400" />
                              <Box size={10} className="text-amber-400" />
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <span className={`text-[11px] font-medium ${current.zonal ? 'text-amber-300' : 'text-slate-500'}`}>
                  {current.zonal
                    ? 'Replicação síncrona entre zonas na primária'
                    : 'Replicação local dentro de um único datacenter'}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center pt-20">
                <div className={`h-1.5 w-24 rounded-full transition-all duration-700 ${current.geo ? 'bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.35)]' : 'bg-slate-800'}`} />
                <Zap size={16} className={`mt-2 ${current.geo ? 'text-amber-300 animate-pulse' : 'text-slate-700'}`} />
                <span className={`mt-2 text-[11px] ${current.geo ? 'text-amber-300' : 'text-slate-600'}`}>
                  {current.geo ? 'Geo replicação assíncrona' : 'Sem geo replicação'}
                </span>
              </div>

              <div className={`flex flex-col items-center gap-5 transition-all duration-500 ${current.geo ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                <div className="text-center">
                  <Globe size={18} className="mx-auto mb-2 text-slate-500" />
                  <p className="text-[12px] font-semibold text-white">Region 02</p>
                  <p className="text-[11px] text-slate-500">Secundária</p>
                </div>

                <div className="relative w-20 h-28 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col items-center justify-center gap-2">
                  <Server size={18} className="text-amber-400/70" />
                  <span className="text-[11px] font-medium text-amber-200">LRS</span>
                  <div className="flex gap-1">
                    <Box size={10} className="text-amber-500" />
                    <Box size={10} className="text-amber-500" />
                    <Box size={10} className="text-amber-500" />
                  </div>

                  {current.readSecondary && (
                    <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400 text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.45)]">
                      <Eye size={14} />
                    </div>
                  )}
                </div>

                <span className={`text-[11px] font-medium ${current.readSecondary ? 'text-sky-300' : 'text-slate-500'}`}>
                  {current.readSecondary ? 'Leitura ativa no secundário' : 'Secundário para failover'}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-amber-300" />
              <h3 className="text-sm font-semibold text-white">{current.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard label="Como funciona" text={current.desc} />
              <InfoCard label="Proteção" text={current.protection} />
              <InfoCard label="Melhor cenário" text={current.bestFor} highlight={redundancy === 'GZRS' || redundancy === 'RA-GZRS' || redundancy === 'RA-GRS'} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Primária" text={current.replicationPrimary} />
              <InfoCard label="Secundária" text={current.replicationSecondary} />
            </div>

            <div className="mt-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="mt-0.5 text-amber-300" />
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-amber-200">
                    Leitura de prova
                  </p>
                  <p className="mt-1 text-[13px] text-slate-300 leading-relaxed">
                    {current.examFit}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {matrixRows.map((row) => (
                <CapabilityCard key={row.label} title={row.label} active={row.value} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-amber-300" />
              <h3 className="text-sm font-semibold text-white">Matriz rápida AZ-104</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="text-slate-500">
                  <tr className="border-b border-slate-800">
                    <th className="py-3 pr-4 font-semibold">Modelo</th>
                    <th className="py-3 pr-4 font-semibold">Geo</th>
                    <th className="py-3 pr-4 font-semibold">Zones</th>
                    <th className="py-3 pr-4 font-semibold">Read secondary</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(redundancyDetails) as Redundancy[]).map((key) => {
                    const item = redundancyDetails[key];
                    const isCurrent = key === redundancy;

                    return (
                      <tr key={key} className={`border-b border-slate-900 ${isCurrent ? 'bg-slate-900/60' : ''}`}>
                        <td className="py-3 pr-4 font-medium text-white">{key}</td>
                        <td className="py-3 pr-4 text-slate-300">{item.geo ? 'Sim' : 'Não'}</td>
                        <td className="py-3 pr-4 text-slate-300">{item.zonal ? 'Sim' : 'Não'}</td>
                        <td className="py-3 pr-4 text-slate-300">{item.readSecondary ? 'Sim' : 'Não'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function TopMetric({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: 'amber' | 'sky' | 'emerald';
}) {
  const styles = {
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
    sky: 'border-sky-500/20 bg-sky-500/5 text-sky-200',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <p className="mt-2 text-[18px] font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-[12px] opacity-70">{hint}</p>
    </div>
  );
}

function NetworkButton({
  active,
  onClick,
  icon,
  title,
  desc,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: 'amber' | 'sky' | 'emerald';
}) {
  const activeStyle = {
    amber: 'border-amber-500/20 bg-amber-500/10',
    sky: 'border-sky-500/20 bg-sky-500/10',
    emerald: 'border-emerald-500/20 bg-emerald-500/10',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active ? activeStyle[tone] : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-white">{title}</p>
          <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">{desc}</p>
        </div>
      </div>
    </button>
  );
}

function InfoCard({
  label,
  text,
  highlight = false,
}: {
  label: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? 'border-amber-500/20 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-[13px] text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}

function CapabilityCard({
  title,
  active,
}: {
  title: string;
  active: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
      <div className="flex items-center gap-3">
        {active ? (
          <CheckCircle2 size={18} className="text-emerald-300" />
        ) : (
          <AlertTriangle size={18} className="text-slate-600" />
        )}
        <div>
          <p className={`text-[14px] font-medium ${active ? 'text-emerald-100' : 'text-slate-300'}`}>
            {title}
          </p>
          <p className="mt-1 text-[12px] text-slate-500">
            {active ? 'Disponível neste modelo' : 'Não disponível neste modelo'}
          </p>
        </div>
      </div>
    </div>
  );
}