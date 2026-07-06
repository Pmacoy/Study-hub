
import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Database,
  Terminal,
  Bell,
  RotateCcw,
  History,
  Trash2,
  ShieldCheck,
  Mail,
  Server,
  Globe,
  CloudRain,
  AlertTriangle,
  Zap,
  Info,
  XCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Search,
} from 'lucide-react';

type MonitorMode = 'monitor' | 'backup';

export default function AzureMonitorSimulator() {
  const [mode, setMode] = useState<MonitorMode>('monitor');

  const [cpuUsage, setCpuUsage] = useState(45);
  const [alertFired, setAlertFired] = useState(false);

  const [siteRecovery, setSiteRecovery] = useState(false);
  const [softDelete, setSoftDelete] = useState(true);
  const [disaster, setDisaster] = useState(false);

  useEffect(() => {
    setAlertFired(cpuUsage >= 85);
  }, [cpuUsage]);

  const simulateDisaster = () => {
    setDisaster(true);
    setTimeout(() => {
      setDisaster(false);
    }, 4000);
  };

  const monitorStatus = useMemo(() => {
    if (alertFired) {
      return {
        title: 'Alerta crítico disparado',
        desc: 'A condição da regra foi satisfeita e o Action Group está em execução.',
        tone: 'rose' as const,
      };
    }

    return {
      title: 'Monitoramento normal',
      desc: 'As métricas estão abaixo do threshold e o ambiente continua em observação.',
      tone: 'emerald' as const,
    };
  }, [alertFired]);

  const backupStatus = useMemo(() => {
    if (disaster && siteRecovery) {
      return {
        title: 'Failover em andamento',
        desc: 'O Azure Site Recovery está a promover a réplica da região secundária.',
        tone: 'emerald' as const,
      };
    }

    if (disaster && !siteRecovery) {
      return {
        title: 'Recuperação lenta',
        desc: 'Sem ASR, a restauração dependerá de backup e do processo manual de recuperação.',
        tone: 'rose' as const,
      };
    }

    if (siteRecovery) {
      return {
        title: 'Proteção de DR ativa',
        desc: 'A VM primária está replicada para outra região com objetivo de failover rápido.',
        tone: 'sky' as const,
      };
    }

    return {
      title: 'Somente backup',
      desc: 'Há retenção de dados, mas não continuidade operacional imediata em desastre regional.',
      tone: 'amber' as const,
    };
  }, [disaster, siteRecovery]);

  const topMetric = useMemo(() => {
    if (mode === 'monitor') {
      return alertFired ? 'Action Group disparado' : 'Sem anomalias';
    }

    if (disaster && siteRecovery) return 'Failover com réplica';
    if (disaster && !siteRecovery) return 'Restore manual necessário';
    return siteRecovery ? 'ASR ativo' : 'Backup sem DR';
  }, [mode, alertFired, disaster, siteRecovery]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 text-slate-200">
      <section className="overflow-hidden rounded-3xl border border-fuchsia-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">
              <Activity size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia-300">
                Observabilidade e proteção
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Monitor & Data Protection
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Explora Azure Monitor, alertas, Log Analytics, Recovery Services Vault, Soft Delete e Site Recovery com foco nas diferenças que mais aparecem na prova AZ-104.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 md:px-8">
          <TopMetric
            label="Modo atual"
            value={mode === 'monitor' ? 'Azure Monitor' : 'Backup & DR'}
            hint="Domínio ativo"
            tone="fuchsia"
          />
          <TopMetric
            label="Estado do ambiente"
            value={topMetric}
            hint="Resultado principal"
            tone="sky"
          />
          <TopMetric
            label="Lembrete de prova"
            value={mode === 'monitor' ? 'Alert Rule → Action Group' : 'Backup ≠ Site Recovery'}
            hint="Diferença decisiva"
            tone="amber"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-fuchsia-300" />
            <h3 className="text-sm font-semibold text-white">Configurar cenário</h3>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              1. Escolhe o domínio
            </label>

            <div className="space-y-3">
              <ModeButton
                active={mode === 'monitor'}
                onClick={() => setMode('monitor')}
                icon={<Terminal size={16} />}
                title="Azure Monitor & Alertas"
                desc="Métricas, KQL, regras de alerta e Action Groups."
                activeClass="border-fuchsia-500/30 bg-fuchsia-500/10"
              />

              <ModeButton
                active={mode === 'backup'}
                onClick={() => setMode('backup')}
                icon={<Database size={16} />}
                title="Backup & Site Recovery"
                desc="Retention, Soft Delete, réplica e failover em desastre regional."
                activeClass="border-fuchsia-500/30 bg-fuchsia-500/10"
              />
            </div>
          </div>

          {mode === 'monitor' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Simular métrica
              </label>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[14px] font-semibold text-white">VM CPU Usage</p>
                    <p className="text-[12px] text-slate-500">Threshold configurado: CPU &gt; 85%</p>
                  </div>
                  <span className={`text-[18px] font-semibold font-mono ${cpuUsage >= 85 ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {cpuUsage}%
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={cpuUsage}
                  onChange={(e) => setCpuUsage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className={`rounded-2xl border p-4 transition-all ${
                alertFired
                  ? 'border-rose-500/30 bg-rose-500/10'
                  : 'border-slate-800 bg-slate-900/60'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    alertFired
                      ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
                      : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}>
                    <Bell size={16} className={alertFired ? 'animate-pulse' : ''} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">Action Group Rule</p>
                    <p className="mt-1 text-[12px] text-slate-500">
                      Regra que observa a condição da métrica e dispara ações quando o threshold é atingido.
                    </p>
                  </div>

                  <span className={`text-[11px] font-semibold ${alertFired ? 'text-rose-300' : 'text-slate-500'}`}>
                    {alertFired ? 'Fired' : 'Standby'}
                  </span>
                </div>
              </div>

              <StatusCard
                title={monitorStatus.title}
                text={monitorStatus.desc}
                tone={monitorStatus.tone}
              />
            </div>
          )}

          {mode === 'backup' && (
            <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                2. Proteção de dados
              </label>

              <button
                onClick={() => setSiteRecovery((prev) => !prev)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  siteRecovery
                    ? 'border-sky-500/30 bg-sky-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    siteRecovery
                      ? 'border-sky-500/20 bg-sky-500/10 text-sky-200'
                      : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}>
                    <RotateCcw size={16} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">Azure Site Recovery</p>
                    <p className="mt-1 text-[12px] text-slate-500">
                      Replicação para outra região com foco em failover e continuidade operacional.
                    </p>
                  </div>

                  <span className={`text-[11px] font-semibold ${siteRecovery ? 'text-sky-300' : 'text-slate-500'}`}>
                    {siteRecovery ? 'ON' : 'OFF'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSoftDelete((prev) => !prev)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  softDelete
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-rose-500/30 bg-rose-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    softDelete
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/20 bg-rose-500/10 text-rose-200'
                  }`}>
                    <Trash2 size={16} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">Soft Delete</p>
                    <p className="mt-1 text-[12px] text-slate-500">
                      Retenção temporária para recuperação de backups apagados acidentalmente.
                    </p>
                  </div>

                  <span className={`text-[11px] font-semibold ${softDelete ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {softDelete ? '14 dias' : 'OFF'}
                  </span>
                </div>
              </button>

              <button
                onClick={simulateDisaster}
                disabled={disaster}
                className="w-full rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white px-4 py-3 text-[12px] font-semibold transition-all"
              >
                {disaster ? 'Queda de região em curso...' : 'Simular desastre regional'}
              </button>

              <StatusCard
                title={backupStatus.title}
                text={backupStatus.desc}
                tone={backupStatus.tone}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 min-h-[420px] overflow-hidden">
            {mode === 'monitor' && (
              <div className="w-full space-y-6 animate-in fade-in duration-300">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Log Analytics Workspace
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">KQL + alerta operacional</h3>
                </div>

                <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                  <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                    <Terminal size={14} className="text-fuchsia-300" />
                    <span className="text-[12px] font-medium text-slate-300">Kusto Query Language</span>
                  </div>

                  <div className="p-4 bg-black text-slate-300 font-mono text-[12px] space-y-2">
                    <div className="text-fuchsia-400">Perf</div>
                    <div className="text-fuchsia-400 ml-4">
                      | where ObjectName == "Processor" and CounterName == "% Processor Time"
                    </div>
                    <div className="text-fuchsia-400 ml-4">
                      | summarize AvgCpu = avg(CounterValue) by Computer, bin(TimeGenerated, 5m)
                    </div>
                    <div className="text-fuchsia-400 ml-4">
                      | order by AvgCpu desc
                    </div>

                    <div className="pt-4 border-t border-slate-800/50 mt-4 flex items-center justify-between text-slate-500">
                      <span>&gt; Executing query...</span>
                      <span>{alertFired ? '1 Critical Result' : 'System Normal'}</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border p-5 transition-all ${
                  alertFired
                    ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
                    : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {alertFired ? (
                        <AlertTriangle size={24} className="text-rose-300 animate-pulse" />
                      ) : (
                        <ShieldCheck size={24} className="text-emerald-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white mb-1">
                        {alertFired ? 'Action Group disparado' : 'Monitoramento passivo'}
                      </div>

                      <p className="text-[13px] text-slate-400 leading-relaxed">
                        {alertFired
                          ? 'O limite de CPU foi rompido. O grupo de ação iniciou as rotinas configuradas para resposta operacional.'
                          : 'O Azure Monitor continua a recolher métricas e logs sem necessidade de acionar remediação.'}
                      </p>

                      {alertFired && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] text-rose-200">
                            <Mail size={12} /> Email admins
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-[11px] text-fuchsia-200">
                            <Zap size={12} /> Trigger Azure Function
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <CapabilityCard title="Coleta de métricas" active />
                  <CapabilityCard title="Threshold atingido" active={alertFired} />
                  <CapabilityCard title="Action Group executado" active={alertFired} />
                </div>
              </div>
            )}

            {mode === 'backup' && (
              <div className="w-full flex flex-col animate-in fade-in duration-300">
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Arquitetura de recuperação
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">Backup, ASR e failover regional</h3>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  <div className={`rounded-3xl border p-5 transition-all ${
                    disaster ? 'border-rose-500/30 bg-rose-500/10 grayscale' : 'border-slate-800 bg-slate-950'
                  }`}>
                    <div className="flex flex-col items-center gap-4">
                      <Globe size={24} className={disaster ? 'text-rose-300' : 'text-slate-500'} />
                      <div className="text-center">
                        <p className="text-[12px] font-semibold text-white">Region A</p>
                        <p className="text-[11px] text-slate-500">Produção</p>
                      </div>

                      <div className="relative">
                        <Server size={40} className={disaster ? 'text-rose-300/50' : 'text-emerald-300'} />
                        {disaster && <XCircle size={40} className="text-rose-400 absolute inset-0" />}
                      </div>

                      <div className="w-full space-y-2 mt-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <History size={14} className="text-slate-400" />
                            <span className="text-[11px] text-slate-300">Daily Backup</span>
                          </div>
                          <ShieldCheck size={14} className="text-emerald-300" />
                        </div>

                        <div className={`rounded-2xl border p-3 flex items-center justify-between ${
                          softDelete
                            ? 'border-emerald-500/20 bg-emerald-500/10'
                            : 'border-rose-500/20 bg-rose-500/10'
                        }`}>
                          <span className="text-[11px] text-slate-200">Soft Delete</span>
                          <span className={`text-[11px] font-semibold ${softDelete ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {softDelete ? '14 dias' : 'Vulnerável'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center relative">
                    <div className={`h-1.5 w-24 rounded-full transition-all ${
                      siteRecovery ? 'bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.35)]' : 'bg-slate-800'
                    }`} />
                    <span className={`mt-2 text-[11px] font-medium ${siteRecovery ? 'text-sky-300' : 'text-slate-600'}`}>
                      {siteRecovery ? 'ASR Sync' : 'Sem réplica'}
                    </span>

                    {disaster && siteRecovery && (
                      <span className="mt-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200 animate-bounce">
                        Iniciando failover...
                      </span>
                    )}
                  </div>

                  <div className={`rounded-3xl border p-5 transition-all ${
                    siteRecovery
                      ? disaster
                        ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.10)]'
                        : 'border-sky-500/20 bg-slate-950'
                      : 'border-slate-800 bg-slate-900/40 opacity-50'
                  }`}>
                    <div className="flex flex-col items-center gap-4">
                      <Globe size={24} className={disaster && siteRecovery ? 'text-emerald-300' : 'text-slate-600'} />
                      <div className="text-center">
                        <p className="text-[12px] font-semibold text-white">Region B</p>
                        <p className="text-[11px] text-slate-500">Disaster Recovery</p>
                      </div>

                      <Server size={40} className={disaster && siteRecovery ? 'text-emerald-300 animate-pulse' : 'text-slate-700'} />

                      <span className={`text-[11px] font-medium ${
                        siteRecovery
                          ? disaster
                            ? 'text-emerald-300'
                            : 'text-sky-300'
                          : 'text-slate-600'
                      }`}>
                        {siteRecovery
                          ? disaster
                            ? 'VM online (nova primária)'
                            : 'VM réplica em standby'
                          : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>

                {disaster && (
                  <div className={`mt-6 rounded-3xl border p-4 text-center ${
                    siteRecovery
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : 'border-rose-500/20 bg-rose-500/10'
                  }`}>
                    <p className="text-[13px] leading-relaxed text-slate-200">
                      {siteRecovery
                        ? 'A região primária caiu, mas o Azure Site Recovery está a sustentar a continuidade operacional com failover para a região secundária.'
                        : 'A região primária caiu e não existe Site Recovery ativo, então a recuperação dependerá de restore manual a partir do backup.'}
                    </p>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <CapabilityCard title="Backup diário" active />
                  <CapabilityCard title="Soft Delete protegido" active={softDelete} />
                  <CapabilityCard title="Failover rápido regional" active={siteRecovery} />
                </div>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mode === 'monitor' && (
              <>
                <RuleCard
                  icon={<Bell size={16} />}
                  title="Regra de prova: Alert Rule"
                  text="A Alert Rule avalia a condição; o Action Group executa a ação, como email, webhook ou automação."
                  tone="fuchsia"
                />
                <RuleCard
                  icon={<Search size={16} />}
                  title="Regra de prova: KQL"
                  text="Log Analytics usa KQL para consultar logs e métricas centralizados no Azure Monitor."
                  tone="sky"
                />
              </>
            )}

            {mode === 'backup' && (
              <>
                <RuleCard
                  icon={<Database size={16} />}
                  title="Regra de prova: Backup"
                  text="Azure Backup é retenção e recuperação de dados; não é solução de continuidade instantânea de aplicação."
                  tone="amber"
                />
                <RuleCard
                  icon={<RotateCcw size={16} />}
                  title="Regra de prova: Site Recovery"
                  text="Azure Site Recovery replica workloads para outra região e aparece quando a pergunta fala em failover e DR."
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
  tone: 'fuchsia' | 'sky' | 'amber';
}) {
  const styles = {
    fuchsia: 'border-fuchsia-500/20 bg-fuchsia-500/5 text-fuchsia-200',
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
  tone: 'emerald' | 'amber' | 'rose' | 'sky';
}) {
  const styles = {
    emerald: 'border-emerald-500/20 bg-emerald-500/10',
    amber: 'border-amber-500/20 bg-amber-500/10',
    rose: 'border-rose-500/20 bg-rose-500/10',
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
  tone: 'fuchsia' | 'amber' | 'sky' | 'emerald';
}) {
  const styles = {
    fuchsia: 'border-fuchsia-500/15 bg-fuchsia-500/5 text-fuchsia-200',
    amber: 'border-amber-500/15 bg-amber-500/5 text-amber-200',
    sky: 'border-sky-500/15 bg-sky-500/5 text-sky-200',
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