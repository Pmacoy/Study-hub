
import React, { useMemo, useState } from 'react';
import {
  Network,
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Server,
  Zap,
  Share2,
  Info,
  XCircle,
  LayoutDashboard,
  Terminal,
  Shield,
  CheckCircle2,
  Sparkles,
  Lock,
  Route,
  AlertTriangle,
} from 'lucide-react';

type NetworkMode = 'routing' | 'balancing' | 'bastion';

export default function AzureNetworkingSimulator() {
  const [mode, setMode] = useState<NetworkMode>('routing');

  const [peeringEnabled, setPeeringEnabled] = useState(false);
  const [nsgRule, setNsgRule] = useState<'Allow' | 'Deny'>('Deny');

  const [balancerType, setBalancerType] = useState<'L4' | 'L7'>('L4');

  const [accessType, setAccessType] = useState<'PublicIP' | 'Bastion'>('PublicIP');

  const routingStatus = useMemo(() => {
    if (!peeringEnabled) {
      return {
        title: 'Sem conectividade entre VNets',
        desc: 'Sem peering, as redes não trocam tráfego diretamente pelo backbone privado da Microsoft.',
        tone: 'rose' as const,
      };
    }

    if (nsgRule === 'Deny') {
      return {
        title: 'Peering ativo, mas tráfego bloqueado',
        desc: 'Mesmo com peering, a regra NSG continua a decidir se o tráfego pode passar.',
        tone: 'amber' as const,
      };
    }

    return {
      title: 'Conectividade permitida',
      desc: 'Com peering ativo e NSG em Allow, a comunicação entre as VNets fica funcional.',
      tone: 'emerald' as const,
    };
  }, [peeringEnabled, nsgRule]);

  const balancingStatus = useMemo(() => {
    if (balancerType === 'L4') {
      return {
        title: 'Azure Load Balancer',
        desc: 'Opera em TCP/UDP e distribui tráfego sem entender URL, hostname ou caminho.',
        tone: 'sky' as const,
      };
    }

    return {
      title: 'Application Gateway',
      desc: 'Opera em HTTP/HTTPS, entende a camada web e permite roteamento por path, além de suporte a WAF.',
      tone: 'violet' as const,
    };
  }, [balancerType]);

  const bastionStatus = useMemo(() => {
    if (accessType === 'PublicIP') {
      return {
        title: 'Acesso exposto',
        desc: 'A VM fica mais vulnerável ao expor RDP/SSH diretamente para a internet.',
        tone: 'rose' as const,
      };
    }

    return {
      title: 'Acesso administrativo mais seguro',
      desc: 'Azure Bastion evita expor IP público na VM e permite acesso pelo navegador via TLS.',
      tone: 'emerald' as const,
    };
  }, [accessType]);

  const topMetric = useMemo(() => {
    if (mode === 'routing') {
      return peeringEnabled && nsgRule === 'Allow'
        ? 'Tráfego permitido'
        : peeringEnabled
        ? 'Peering com bloqueio'
        : 'Sem peering';
    }

    if (mode === 'balancing') {
      return balancerType === 'L4' ? 'Balanceamento TCP/UDP' : 'Roteamento HTTP/HTTPS';
    }

    return accessType === 'Bastion' ? 'Acesso sem IP público' : 'VM exposta à internet';
  }, [mode, peeringEnabled, nsgRule, balancerType, accessType]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 text-slate-200">
      <section className="overflow-hidden rounded-3xl border border-teal-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/10 text-teal-300">
              <Network size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-300">
                Redes e segurança
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Virtual Networks & Security
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Estuda conectividade entre VNets, balanceamento de tráfego e acesso administrativo seguro nos cenários mais clássicos do AZ-104.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 md:px-8">
          <TopMetric
            label="Modo atual"
            value={
              mode === 'routing'
                ? 'Conectividade'
                : mode === 'balancing'
                ? 'Balanceamento'
                : 'Acesso seguro'
            }
            hint="Domínio ativo"
            tone="teal"
          />
          <TopMetric
            label="Estado do cenário"
            value={topMetric}
            hint="Resultado principal"
            tone="sky"
          />
          <TopMetric
            label="Lembrete de prova"
            value={
              mode === 'bastion'
                ? 'Bastion ≠ Public IP'
                : mode === 'balancing'
                ? 'L4 ≠ L7'
                : 'Peering ≠ trânsito livre'
            }
            hint="Diferença decisiva"
            tone="amber"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-teal-300" />
            <h3 className="text-sm font-semibold text-white">Configurar cenário</h3>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              1. Escolhe o domínio
            </label>

            <div className="space-y-3">
              <ModeButton
                active={mode === 'routing'}
                onClick={() => setMode('routing')}
                icon={<ArrowRightLeft size={16} />}
                title="Conectividade & NSG"
                desc="Peering entre VNets e controlo por regras de segurança."
                activeClass="border-teal-500/30 bg-teal-500/10"
              />

              <ModeButton
                active={mode === 'balancing'}
                onClick={() => setMode('balancing')}
                icon={<Share2 size={16} />}
                title="Balanceamento"
                desc="Comparação entre Azure Load Balancer e Application Gateway."
                activeClass="border-teal-500/30 bg-teal-500/10"
              />

              <ModeButton
                active={mode === 'bastion'}
                onClick={() => setMode('bastion')}
                icon={<Shield size={16} />}
                title="Acesso Seguro"
                desc="Diferença entre IP público exposto e Azure Bastion."
                activeClass="border-teal-500/30 bg-teal-500/10"
              />
            </div>
          </div>

          {mode === 'routing' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Conectividade entre redes
              </label>

              <button
                onClick={() => setPeeringEnabled((prev) => !prev)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  peeringEnabled
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      peeringEnabled
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                        : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}
                  >
                    <ArrowRightLeft size={16} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">VNet Peering</p>
                    <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
                      Liga as VNets pelo backbone privado da Microsoft, mas não elimina a necessidade de regras NSG corretas.
                    </p>
                  </div>

                  <span className={`text-[11px] font-semibold ${peeringEnabled ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {peeringEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setNsgRule((prev) => (prev === 'Allow' ? 'Deny' : 'Allow'))}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  nsgRule === 'Allow'
                    ? 'border-sky-500/30 bg-sky-500/10'
                    : 'border-rose-500/30 bg-rose-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      nsgRule === 'Allow'
                        ? 'border-sky-500/20 bg-sky-500/10 text-sky-200'
                        : 'border-rose-500/20 bg-rose-500/10 text-rose-200'
                    }`}
                  >
                    {nsgRule === 'Allow' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                  </div>

                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">NSG Rule (Port 80)</p>
                    <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
                      O NSG continua a ser decisivo mesmo quando a conectividade entre VNets existe.
                    </p>
                  </div>

                  <span className={`text-[11px] font-semibold ${nsgRule === 'Allow' ? 'text-sky-300' : 'text-rose-300'}`}>
                    {nsgRule}
                  </span>
                </div>
              </button>

              <StatusCard
                title={routingStatus.title}
                text={routingStatus.desc}
                tone={routingStatus.tone}
              />
            </div>
          )}

          {mode === 'balancing' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Escolhe o balanceador
              </label>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setBalancerType('L4')}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    balancerType === 'L4'
                      ? 'border-sky-500/30 bg-sky-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                      <Route size={16} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-white">Azure Load Balancer (L4)</p>
                      <p className="mt-1 text-[12px] text-slate-500">
                        TCP/UDP, rápido e direto, sem entender conteúdo HTTP.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setBalancerType('L7')}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    balancerType === 'L7'
                      ? 'border-violet-500/30 bg-violet-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                      <LayoutDashboard size={16} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-white">Application Gateway (L7)</p>
                      <p className="mt-1 text-[12px] text-slate-500">
                        HTTP/HTTPS, path-based routing e integração com WAF.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <StatusCard
                title={balancingStatus.title}
                text={balancingStatus.desc}
                tone={balancingStatus.tone}
              />
            </div>
          )}

          {mode === 'bastion' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Estratégia de acesso remoto
              </label>

              <button
                onClick={() => setAccessType('PublicIP')}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  accessType === 'PublicIP'
                    ? 'border-rose-500/30 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-200">
                    <ShieldAlert size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">IP Público Exposto</p>
                    <p className="mt-1 text-[12px] text-slate-500">
                      Modelo mais arriscado para administração direta por RDP/SSH.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setAccessType('Bastion')}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  accessType === 'Bastion'
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">Azure Bastion</p>
                    <p className="mt-1 text-[12px] text-slate-500">
                      Acesso pelo navegador via TLS sem expor IP público na VM.
                    </p>
                  </div>
                </div>
              </button>

              <StatusCard
                title={bastionStatus.title}
                text={bastionStatus.desc}
                tone={bastionStatus.tone}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 min-h-[420px] overflow-hidden">
            {mode === 'routing' && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Topologia de rede
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">VNet Peering + NSG</h3>
                </div>

                <div className="flex justify-between items-center w-full gap-4 relative">
                  <div className="flex-1 p-6 bg-slate-950 border border-teal-500/20 rounded-3xl flex flex-col items-center gap-4">
                    <span className="text-[12px] font-semibold text-teal-300">VNet-A</span>
                    <span className="text-[11px] text-slate-500">10.0.0.0/16</span>
                    <Server className="text-slate-400" size={30} />
                  </div>

                  <div className="flex flex-col items-center gap-2 z-10 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    {peeringEnabled ? (
                      <ArrowRightLeft className="text-emerald-400" size={22} />
                    ) : (
                      <XCircle className="text-rose-400" size={22} />
                    )}
                    <span className="text-[10px] font-medium text-slate-400">Peering</span>
                  </div>

                  <div
                    className={`absolute top-1/2 left-[24%] right-[24%] h-1 -translate-y-1/2 -z-10 transition-colors ${
                      peeringEnabled ? 'bg-emerald-500/50' : 'bg-slate-800'
                    }`}
                  />

                  <div
                    className={`flex-1 p-6 bg-slate-950 border rounded-3xl flex flex-col items-center gap-4 relative transition-all ${
                      peeringEnabled ? 'border-indigo-500/30' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-[12px] font-semibold text-indigo-300">VNet-B</span>
                    <span className="text-[11px] text-slate-500">10.1.0.0/16</span>
                    <Server className="text-slate-400" size={30} />

                    <div
                      className={`absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-slate-950 ${
                        nsgRule === 'Allow'
                          ? 'border-sky-500/50 text-sky-300'
                          : 'border-rose-500/50 text-rose-300'
                      }`}
                    >
                      {nsgRule === 'Allow' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <CapabilityCard title="Peering ativo" active={peeringEnabled} />
                  <CapabilityCard title="NSG permite tráfego" active={nsgRule === 'Allow'} />
                  <CapabilityCard title="Comunicação final" active={peeringEnabled && nsgRule === 'Allow'} />
                </div>
              </div>
            )}

            {mode === 'balancing' && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Tráfego de entrada
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">Load Balancer vs Application Gateway</h3>
                </div>

                <div className="flex flex-col items-center gap-8 w-full">
                  <Globe size={32} className="text-slate-500" />

                  {balancerType === 'L4' ? (
                    <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center gap-3">
                      <Share2 size={20} className="text-sky-300" />
                      <span className="text-[12px] font-semibold text-sky-200">Azure Load Balancer (L4)</span>
                    </div>
                  ) : (
                    <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center gap-3">
                      <LayoutDashboard size={20} className="text-violet-300" />
                      <div className="text-center">
                        <span className="block text-[12px] font-semibold text-violet-200">Application Gateway</span>
                        <span className="text-[11px] text-violet-300/80">Path-based routing + WAF</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <div className="flex flex-col items-center gap-2">
                      {balancerType === 'L7' && (
                        <span className="text-[11px] font-mono text-violet-200 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                          /images/*
                        </span>
                      )}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex gap-2">
                        <Server size={20} className="text-slate-400" />
                        <Server size={20} className="text-slate-400" />
                      </div>
                      <span className="text-[11px] text-slate-400">Pool A</span>
                    </div>

                    {balancerType === 'L7' ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          /video/*
                        </span>
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex gap-2">
                          <Server size={20} className="text-slate-400" />
                        </div>
                        <span className="text-[11px] text-slate-400">Pool B</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                        <p className="text-[12px] text-slate-400 text-center">
                          Em L4, o balanceador distribui tráfego sem entender o caminho da URL.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <CapabilityCard title="Entende TCP/UDP" active />
                    <CapabilityCard title="Entende URL/path" active={balancerType === 'L7'} />
                    <CapabilityCard title="Suporte típico a WAF" active={balancerType === 'L7'} />
                  </div>
                </div>
              </div>
            )}

            {mode === 'bastion' && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Acesso remoto
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">Public IP vs Azure Bastion</h3>
                </div>

                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex flex-col items-center gap-4">
                    <Globe size={30} className="text-slate-500" />
                    <div className="text-center">
                      <span className="text-[12px] font-semibold text-rose-300 block">Internet Pública</span>
                      <span className="text-[11px] text-slate-500">Scanners e superfície exposta</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center relative flex-1">
                    {accessType === 'PublicIP' ? (
                      <div className="h-1 w-full bg-rose-500/50 relative rounded-full">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-[11px] text-rose-200">
                          Tráfego exposto
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex flex-col items-center shadow-[0_0_20px_rgba(16,185,129,0.10)]">
                          <Shield size={24} className="text-emerald-300 mb-1" />
                          <span className="text-[12px] font-semibold text-emerald-200">Azure Bastion</span>
                          <span className="text-[11px] text-emerald-300/70">AzureBastionSubnet</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Acesso via navegador usando TLS/443</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div
                      className={`p-6 bg-slate-950 border rounded-3xl flex flex-col items-center transition-colors ${
                        accessType === 'PublicIP'
                          ? 'border-rose-500/30 shadow-[0_0_16px_rgba(244,63,94,0.12)]'
                          : 'border-slate-800'
                      }`}
                    >
                      <Terminal size={30} className={accessType === 'PublicIP' ? 'text-rose-300' : 'text-slate-400'} />
                    </div>
                    <div className="text-center">
                      <span className="text-[12px] font-semibold text-white block">VM Produção</span>
                      <span className="text-[11px] font-mono bg-slate-900 px-2 py-1 rounded text-slate-500 mt-1 inline-block">
                        {accessType === 'PublicIP' ? 'Public IP: 20.15.x.x' : 'Private IP: 10.0.1.4'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <CapabilityCard title="Sem IP público na VM" active={accessType === 'Bastion'} />
                  <CapabilityCard title="Acesso por navegador/TLS" active={accessType === 'Bastion'} />
                  <CapabilityCard title="Exposição direta RDP/SSH" active={accessType === 'PublicIP'} />
                </div>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mode === 'routing' && (
              <>
                <RuleCard
                  icon={<Info size={16} />}
                  title="Regra de prova: Peering"
                  text="VNet Peering conecta redes pelo backbone privado da Microsoft, mas não é transitivo."
                  tone="teal"
                />
                <RuleCard
                  icon={<Lock size={16} />}
                  title="Regra de prova: NSG"
                  text="Mesmo com peering, uma regra NSG pode bloquear a comunicação. Conectividade não anula segurança."
                  tone="amber"
                />
              </>
            )}

            {mode === 'balancing' && (
              <>
                <RuleCard
                  icon={<Share2 size={16} />}
                  title="Regra de prova: L4"
                  text="Azure Load Balancer trabalha em TCP/UDP e não faz roteamento por URL."
                  tone="sky"
                />
                <RuleCard
                  icon={<LayoutDashboard size={16} />}
                  title="Regra de prova: L7"
                  text="Application Gateway entende HTTP/HTTPS, suporta roteamento por path e costuma aparecer com WAF."
                  tone="violet"
                />
              </>
            )}

            {mode === 'bastion' && (
              <>
                <RuleCard
                  icon={<ShieldCheck size={16} />}
                  title="Regra de prova: Bastion"
                  text="Se a pergunta pedir RDP/SSH seguro sem expor IP público, a resposta normalmente é Azure Bastion."
                  tone="emerald"
                />
                <RuleCard
                  icon={<AlertTriangle size={16} />}
                  title="Regra de prova: subnet dedicada"
                  text="Azure Bastion exige uma subnet própria chamada AzureBastionSubnet."
                  tone="amber"
                />
              </>
            )}
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
  tone: 'teal' | 'sky' | 'amber';
}) {
  const styles = {
    teal: 'border-teal-500/20 bg-teal-500/5 text-teal-200',
    sky: 'border-sky-500/20 bg-sky-500/5 text-sky-200',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <p className="mt-2 text-[18px] font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-[12px] opacity-70">{hint}</p>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  title,
  desc,
  activeClass,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  activeClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active ? activeClass : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
          {icon}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white">{title}</p>
          <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">{desc}</p>
        </div>
      </div>
    </button>
  );
}

function StatusCard({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
}) {
  const styles = {
    emerald: 'border-emerald-500/20 bg-emerald-500/10',
    amber: 'border-amber-500/20 bg-amber-500/10',
    rose: 'border-rose-500/20 bg-rose-500/10',
    sky: 'border-sky-500/20 bg-sky-500/10',
    violet: 'border-violet-500/20 bg-violet-500/10',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-[14px] font-semibold text-white">{title}</p>
      <p className="mt-1 text-[12px] text-slate-300 leading-relaxed">{text}</p>
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
          <XCircle size={18} className="text-slate-600" />
        )}
        <div>
          <p className={`text-[14px] font-medium ${active ? 'text-emerald-100' : 'text-slate-300'}`}>
            {title}
          </p>
          <p className="mt-1 text-[12px] text-slate-500">
            {active ? 'Ativo neste cenário' : 'Não ativo neste cenário'}
          </p>
        </div>
      </div>
    </div>
  );
}

function RuleCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone: 'teal' | 'amber' | 'sky' | 'violet' | 'emerald';
}) {
  const styles = {
    teal: 'border-teal-500/15 bg-teal-500/5 text-teal-200',
    amber: 'border-amber-500/15 bg-amber-500/5 text-amber-200',
    sky: 'border-sky-500/15 bg-sky-500/5 text-sky-200',
    violet: 'border-violet-500/15 bg-violet-500/5 text-violet-200',
    emerald: 'border-emerald-500/15 bg-emerald-500/5 text-emerald-200',
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles[tone]}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-white">{title}</h4>
          <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}