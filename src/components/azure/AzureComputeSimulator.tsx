
import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Box,
  Building2,
  CheckCircle2,
  Cpu,
  Globe,
  HardDrive,
  Info,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';

type ComputeMode = 'HA' | 'VMSS' | 'PaaS';
type HAType = 'AvailabilitySet' | 'AvailabilityZone';

export default function AzureComputeSimulator() {
  const [mode, setMode] = useState<ComputeMode>('HA');
  const [haType, setHaType] = useState<HAType>('AvailabilitySet');
  const [cpuLoad, setCpuLoad] = useState(25);
  const [instances, setInstances] = useState([1, 2]);

  useEffect(() => {
    if (mode !== 'VMSS') return;

    const timer = setTimeout(() => {
      if (cpuLoad > 75 && instances.length < 5) {
        setInstances((prev) => [...prev, prev.length + 1]);
      } else if (cpuLoad < 30 && instances.length > 2) {
        setInstances((prev) => prev.slice(0, -1));
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [cpuLoad, instances, mode]);

  const modeTitle = useMemo(() => {
    if (mode === 'HA') return 'Alta disponibilidade';
    if (mode === 'VMSS') return 'Escalabilidade horizontal';
    return 'PaaS e containers';
  }, [mode]);

  const mainOutcome = useMemo(() => {
    if (mode === 'HA') {
      return haType === 'AvailabilitySet'
        ? 'Proteção contra falha de host/rack'
        : 'Proteção contra falha de data center';
    }

    if (mode === 'VMSS') {
      return cpuLoad > 75
        ? `Scale-out ativo com ${instances.length} instâncias`
        : `Capacidade estável com ${instances.length} instâncias`;
    }

    return 'Infraestrutura mais abstraída e foco em aplicação';
  }, [mode, haType, cpuLoad, instances.length]);

  const examMemory = useMemo(() => {
    if (mode === 'HA') {
      return haType === 'AvailabilitySet'
        ? 'Set = fault domains + update domains'
        : 'Zone = data center físico separado';
    }

    if (mode === 'VMSS') {
      return 'VMSS = scale out automático por métrica';
    }

    return 'App Service cobra no plano, não no app isolado';
  }, [mode, haType]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 text-slate-200">
      <section className="overflow-hidden rounded-3xl border border-sky-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
              <Cpu size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-300">
                Computação no Azure
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Compute & High Availability
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Compara isolamento, alta disponibilidade, escalonamento automático e serviços de aplicação com foco nas decisões que mais aparecem na prova AZ-104.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 md:px-8">
          <TopMetric
            label="Modo atual"
            value={modeTitle}
            hint="Cenário ativo"
            tone="sky"
          />
          <TopMetric
            label="Resultado principal"
            value={mainOutcome}
            hint="Leitura rápida"
            tone="emerald"
          />
          <TopMetric
            label="Memorização de prova"
            value={examMemory}
            hint="Atalho mental"
            tone="amber"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-sky-300" />
            <h3 className="text-sm font-semibold text-white">Configurar arquitetura</h3>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              1. Escolhe o cenário
            </label>

            <div className="space-y-3">
              <ModeButton
                active={mode === 'HA'}
                onClick={() => setMode('HA')}
                icon={<ShieldCheck size={16} />}
                title="Alta disponibilidade"
                desc="Availability Sets versus Availability Zones com foco em SLA e isolamento."
                activeClass="border-sky-500/30 bg-sky-500/10"
              />

              <ModeButton
                active={mode === 'VMSS'}
                onClick={() => {
                  setMode('VMSS');
                  setInstances([1, 2]);
                  setCpuLoad(25);
                }}
                icon={<Layers size={16} />}
                title="VM Scale Sets"
                desc="Escalonamento horizontal automático com base em carga."
                activeClass="border-sky-500/30 bg-sky-500/10"
              />

              <ModeButton
                active={mode === 'PaaS'}
                onClick={() => setMode('PaaS')}
                icon={<Globe size={16} />}
                title="App Service & Containers"
                desc="Comparação entre aplicação gerida e execução em containers."
                activeClass="border-sky-500/30 bg-sky-500/10"
              />
            </div>
          </div>

          {mode === 'HA' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Tipo de isolamento
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHaType('AvailabilitySet')}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    haType === 'AvailabilitySet'
                      ? 'border-sky-500/30 bg-sky-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[14px] font-semibold text-white">Availability Set</p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Protege contra falha de host, rack e manutenção simultânea.
                  </p>
                </button>

                <button
                  onClick={() => setHaType('AvailabilityZone')}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    haType === 'AvailabilityZone'
                      ? 'border-sky-500/30 bg-sky-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <p className="text-[14px] font-semibold text-white">Availability Zone</p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Protege contra perda de um data center inteiro dentro da região.
                  </p>
                </button>
              </div>

              <StatusCard
                title={haType === 'AvailabilitySet' ? 'SLA 99.95%' : 'SLA 99.99%'}
                text={
                  haType === 'AvailabilitySet'
                    ? 'Boa escolha para resiliência dentro do mesmo data center lógico.'
                    : 'Maior nível de resiliência entre as duas opções vistas aqui.'
                }
                tone={haType === 'AvailabilitySet' ? 'amber' : 'emerald'}
              />
            </div>
          )}

          {mode === 'VMSS' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Simular carga
              </label>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[14px] font-semibold text-white">CPU média do cluster</p>
                    <p className="text-[12px] text-slate-500">Acima de 75% provoca scale-out</p>
                  </div>
                  <span className={`text-[18px] font-semibold font-mono ${cpuLoad > 75 ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {cpuLoad}%
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={cpuLoad}
                  onChange={(e) => setCpuLoad(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <StatusCard
                title={cpuLoad > 75 ? 'Scale-out em progresso' : 'Capacidade estável'}
                text={
                  cpuLoad > 75
                    ? 'O conjunto começa a adicionar instâncias para distribuir carga horizontalmente.'
                    : 'A procura continua dentro da capacidade atual do cluster.'
                }
                tone={cpuLoad > 75 ? 'sky' : 'emerald'}
              />
            </div>
          )}

          {mode === 'PaaS' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Leitura arquitetural
              </label>

              <StatusCard
                title="App Service versus Containers"
                text="App Service abstrai mais infraestrutura e acelera deploy web; ACI e AKS entram quando o workload já vem em container ou precisa de mais controlo operacional."
                tone="sky"
              />

              <StatusCard
                title="Lógica de prova"
                text="Quando a questão fala em gerir menos servidores, PaaS costuma ser forte; quando fala em containerização ou orquestração, pensa em ACI ou AKS."
                tone="amber"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 min-h-[420px] overflow-hidden">
            {mode === 'HA' && (
              <div className="w-full space-y-6 animate-in fade-in duration-300">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Disponibilidade
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">
                    {haType === 'AvailabilitySet'
                      ? 'Proteção no nível de host e rack'
                      : 'Proteção no nível de data center'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`rounded-3xl border p-5 ${
                        haType === 'AvailabilitySet'
                          ? 'border-slate-800 bg-slate-900/80'
                          : 'border-sky-500/20 bg-sky-500/5'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="text-slate-400">
                          {haType === 'AvailabilitySet' ? (
                            <Server size={30} />
                          ) : (
                            <Building2 size={30} className="text-sky-300" />
                          )}
                        </div>

                        <div>
                          <p className="text-[13px] font-semibold text-white">
                            {haType === 'AvailabilitySet'
                              ? `Fault Domain ${item - 1}`
                              : `Zone ${item}`}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {haType === 'AvailabilitySet'
                              ? 'Mesmo data center lógico'
                              : 'Infraestrutura física separada'}
                          </p>
                        </div>

                        <div className="w-full">
                          <div className={`rounded-2xl border px-3 py-3 flex items-center justify-center gap-2 ${
                            item <= 2
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                              : 'border-slate-800 bg-slate-950 text-slate-600'
                          }`}>
                            <Server size={14} />
                            <span className="text-[11px] font-medium">VM 0{item}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
                  <p className="text-[13px] leading-relaxed text-slate-300">
                    {haType === 'AvailabilitySet'
                      ? 'Availability Sets distribuem VMs por fault domains e update domains para reduzir impacto de falha física e manutenção de host.'
                      : 'Availability Zones distribuem workloads por data centers fisicamente distintos na mesma região, oferecendo maior resiliência e SLA superior.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <CapabilityCard title="Isolamento físico" active />
                  <CapabilityCard title="Maior SLA da comparação" active={haType === 'AvailabilityZone'} />
                  <CapabilityCard title="Proteção contra update domain" active={haType === 'AvailabilitySet'} />
                </div>
              </div>
            )}

            {mode === 'VMSS' && (
              <div className="w-full space-y-6 animate-in fade-in duration-300">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Escalonamento
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">Virtual Machine Scale Set</h3>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {instances.map((id) => (
                    <div
                      key={id}
                      className="w-28 rounded-3xl border border-sky-500/20 bg-sky-500/10 p-4 flex flex-col items-center gap-3 shadow-[0_0_18px_rgba(56,189,248,0.08)]"
                    >
                      <Server size={24} className="text-sky-300" />
                      <span className="text-[11px] font-medium text-sky-100">Instância {id}</span>

                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${cpuLoad > 80 ? 'bg-rose-400' : 'bg-sky-400'}`}
                          style={{ width: `${cpuLoad}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {cpuLoad > 75 && instances.length < 5 && (
                    <div className="w-28 rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-4 flex flex-col items-center justify-center gap-3 animate-pulse">
                      <Activity size={20} className="text-slate-500" />
                      <span className="text-[10px] font-medium text-slate-500 text-center">
                        Provisionando...
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 inline-flex items-center gap-2 self-center">
                  <ArrowUpRight size={14} className="text-emerald-300" />
                  <span className="text-[12px] font-medium text-emerald-200">
                    Scale-out horizontal automático
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <CapabilityCard title="Scale out" active={cpuLoad > 75} />
                  <CapabilityCard title="Base mínima de instâncias" active />
                  <CapabilityCard title="Escala por métrica" active />
                </div>
              </div>
            )}

            {mode === 'PaaS' && (
              <div className="w-full space-y-6 animate-in fade-in duration-300">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Aplicação
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">PaaS, App Service e containers</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Globe size={38} className="text-indigo-300" />
                      <div>
                        <h4 className="text-[15px] font-semibold text-white">App Service</h4>
                        <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
                          PaaS para apps web e APIs HTTP, com menos preocupação com sistema operativo e infraestrutura subjacente.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Box size={38} className="text-emerald-300" />
                      <div>
                        <h4 className="text-[15px] font-semibold text-white">ACI / AKS</h4>
                        <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
                          ACI é rápido para executar um container isolado; AKS entra quando o cenário exige orquestração de cluster.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <CapabilityCard title="Menos gestão de servidor" active />
                  <CapabilityCard title="Modelo web gerido" active />
                  <CapabilityCard title="Containers prontos para deploy" active />
                </div>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mode === 'HA' && (
              <>
                <RuleCard
                  icon={<ShieldCheck size={16} />}
                  title="Regra de prova: Set vs Zone"
                  text="Availability Set protege dentro do mesmo data center lógico; Availability Zone protege contra falha de um data center inteiro."
                  tone="sky"
                />
                <RuleCard
                  icon={<Info size={16} />}
                  title="Regra de prova: SLA"
                  text="Na comparação do teu módulo, Zone oferece SLA mais alto do que Set e costuma ser a resposta quando a pergunta pede máxima resiliência regional."
                  tone="amber"
                />
              </>
            )}

            {mode === 'VMSS' && (
              <>
                <RuleCard
                  icon={<Layers size={16} />}
                  title="Regra de prova: VMSS"
                  text="VM Scale Sets trabalham com várias VMs idênticas e escalam horizontalmente com base em métricas e regras."
                  tone="sky"
                />
                <RuleCard
                  icon={<Zap size={16} />}
                  title="Regra de prova: Scale out"
                  text="Scale out adiciona mais instâncias; scale up aumenta o tamanho de uma VM. VMSS está mais associado a scale out."
                  tone="emerald"
                />
              </>
            )}

            {mode === 'PaaS' && (
              <>
                <RuleCard
                  icon={<Globe size={16} />}
                  title="Regra de prova: App Service Plan"
                  text="O custo e a capacidade ficam associados ao App Service Plan, e várias apps podem partilhar esse mesmo plano."
                  tone="amber"
                />
                <RuleCard
                  icon={<Box size={16} />}
                  title="Regra de prova: Containers"
                  text="Quando a pergunta enfatiza imagem de container, isolamento de workload ou orquestração, ACI e AKS ganham força."
                  tone="emerald"
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
  tone: 'sky' | 'emerald' | 'amber';
}) {
  const styles = {
    sky: 'border-sky-500/20 bg-sky-500/5 text-sky-200',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
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
  tone: 'emerald' | 'amber' | 'sky';
}) {
  const styles = {
    emerald: 'border-emerald-500/20 bg-emerald-500/10',
    amber: 'border-amber-500/20 bg-amber-500/10',
    sky: 'border-sky-500/20 bg-sky-500/10',
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
            {active ? 'Ativo neste cenário' : 'Não dominante neste cenário'}
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
  tone: 'sky' | 'amber' | 'emerald';
}) {
  const styles = {
    sky: 'border-sky-500/15 bg-sky-500/5 text-sky-200',
    amber: 'border-amber-500/15 bg-amber-500/5 text-amber-200',
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