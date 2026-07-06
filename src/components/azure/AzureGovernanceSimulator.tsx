
import React, { useMemo, useState } from 'react';
import {
  Scale,
  Ban,
  Lock,
  Building2,
  CreditCard,
  FolderKanban,
  CheckCircle2,
  Info,
  ShieldCheck,
  ArrowDown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

type Scope = 'Management Group' | 'Subscription' | 'Resource Group';

export default function AzureGovernanceSimulator() {
  const [selectedScope, setSelectedScope] = useState<Scope>('Subscription');
  const [hasPolicy, setHasPolicy] = useState(false);
  const [hasLock, setHasLock] = useState(false);

  const isAffected = (currentScope: Scope) => {
    if (selectedScope === 'Management Group') return true;
    if (
      selectedScope === 'Subscription' &&
      (currentScope === 'Subscription' || currentScope === 'Resource Group')
    ) {
      return true;
    }
    return selectedScope === currentScope;
  };

  const activeRulesCount = Number(hasPolicy) + Number(hasLock);

  const summary = useMemo(() => {
    if (!hasPolicy && !hasLock) {
      return 'Nenhuma regra aplicada. Neste momento, a hierarquia está apenas a mostrar o escopo escolhido sem impacto descendente.';
    }

    if (hasPolicy && hasLock) {
      return 'Tens Azure Policy e Resource Lock ativos. Isso cria um cenário forte de restrição administrativa e ajuda muito a visualizar herança no exame.';
    }

    if (hasPolicy) {
      return 'Tens apenas Azure Policy ativa. Isso representa controlo de conformidade sobre o que pode ou não ser criado.';
    }

    return 'Tens apenas Resource Lock ativo. Isso representa proteção contra alteração ou eliminação acidental de recursos.';
  }, [hasPolicy, hasLock]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <section className="overflow-hidden rounded-3xl border border-violet-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
              <Scale size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                Governança e conformidade
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Policy, locks e herança de escopo
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Simula como regras aplicadas em níveis mais altos descem na hierarquia do Azure e afetam subscriptions e resource groups.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 md:px-8">
          <TopMetric
            label="Escopo atual"
            value={selectedScope}
            hint="Onde a regra nasce"
            tone="violet"
          />
          <TopMetric
            label="Regras ativas"
            value={`${activeRulesCount}`}
            hint={activeRulesCount === 1 ? 'Uma camada ativa' : activeRulesCount > 1 ? 'Múltiplas camadas ativas' : 'Sem restrições'}
            tone="amber"
          />
          <TopMetric
            label="Leitura de prova"
            value={hasPolicy ? 'Policy ativa' : hasLock ? 'Lock ativo' : 'Só hierarquia'}
            hint="Cenário mais cobrado"
            tone="sky"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-violet-300" />
            <h3 className="text-sm font-semibold text-white">Configurar cenário</h3>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              1. Escolhe o escopo
            </label>

            <div className="space-y-3">
              {(['Management Group', 'Subscription', 'Resource Group'] as Scope[]).map((scope) => {
                const selected = selectedScope === scope;

                return (
                  <button
                    key={scope}
                    onClick={() => setSelectedScope(scope)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      selected
                        ? 'border-violet-500/30 bg-violet-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-[14px] font-semibold ${selected ? 'text-violet-200' : 'text-white'}`}>
                          {scope}
                        </p>
                        <p className="mt-1 text-[12px] text-slate-500">
                          {scope === 'Management Group' && 'Afeta subscriptions e resource groups abaixo.'}
                          {scope === 'Subscription' && 'Afeta a subscription e os resource groups descendentes.'}
                          {scope === 'Resource Group' && 'Afeta apenas o grupo de recursos escolhido.'}
                        </p>
                      </div>

                      {selected && <CheckCircle2 size={18} className="shrink-0 text-violet-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              2. Ativa as regras
            </label>

            <div className="space-y-3">
              <button
                onClick={() => setHasPolicy((prev) => !prev)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  hasPolicy
                    ? 'border-rose-500/30 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      hasPolicy
                        ? 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                        : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}
                  >
                    <Ban size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className={`text-[14px] font-semibold ${hasPolicy ? 'text-rose-200' : 'text-white'}`}>
                      Azure Policy
                    </p>
                    <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
                      Controla conformidade e define o que pode ou não pode ser criado.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setHasLock((prev) => !prev)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  hasLock
                    ? 'border-amber-500/30 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      hasLock
                        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}
                  >
                    <Lock size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className={`text-[14px] font-semibold ${hasLock ? 'text-amber-200' : 'text-white'}`}>
                      Resource Lock
                    </p>
                    <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
                      Protege recursos contra modificação ou eliminação acidental.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-2">
              Resumo do cenário
            </p>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Visualização de herança</h3>
          </div>

          <div className="flex flex-col items-center">
            <HierarchyCard
              label="Management Group"
              subtitle="Camada organizacional superior"
              icon={<Building2 size={18} />}
              active={selectedScope === 'Management Group'}
              affected={isAffected('Management Group') && (hasPolicy || hasLock)}
              hasPolicy={hasPolicy && isAffected('Management Group')}
              hasLock={hasLock && isAffected('Management Group')}
            />

            <ArrowConnector active={selectedScope === 'Management Group' || selectedScope === 'Subscription'} />

            <HierarchyCard
              label="Subscription"
              subtitle="Cobrança, políticas e gestão de recursos"
              icon={<CreditCard size={18} />}
              active={selectedScope === 'Subscription'}
              affected={isAffected('Subscription') && (hasPolicy || hasLock)}
              hasPolicy={hasPolicy && isAffected('Subscription')}
              hasLock={hasLock && isAffected('Subscription')}
            />

            <ArrowConnector active={selectedScope !== 'Resource Group' || hasPolicy || hasLock} />

            <HierarchyCard
              label="Resource Group"
              subtitle="Escopo operacional mais específico"
              icon={<FolderKanban size={18} />}
              active={selectedScope === 'Resource Group'}
              affected={isAffected('Resource Group') && (hasPolicy || hasLock)}
              hasPolicy={hasPolicy && isAffected('Resource Group')}
              hasLock={hasLock && isAffected('Resource Group')}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RuleCard
          icon={<Info size={16} />}
          title="Regra de ouro: herança"
          tone="violet"
          text="Tudo o que é aplicado num escopo superior desce para os escopos abaixo. Management Group afeta subscriptions; subscription afeta resource groups."
        />
        <RuleCard
          icon={<AlertTriangle size={16} />}
          title="Regra de prova: Policy vs RBAC"
          tone="amber"
          text="RBAC responde quem pode agir. Azure Policy responde o que é permitido. Mesmo um Owner pode ser travado por uma policy do tipo Deny."
        />
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
  tone: 'violet' | 'amber' | 'sky';
}) {
  const styles = {
    violet: 'border-violet-500/20 bg-violet-500/5 text-violet-200',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
    sky: 'border-sky-500/20 bg-sky-500/5 text-sky-200',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <p className="mt-2 text-[18px] font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-[12px] opacity-70">{hint}</p>
    </div>
  );
}

function HierarchyCard({
  label,
  subtitle,
  icon,
  active,
  affected,
  hasPolicy,
  hasLock,
}: {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  active: boolean;
  affected: boolean;
  hasPolicy: boolean;
  hasLock: boolean;
}) {
  return (
    <div
      className={`w-full max-w-[460px] rounded-3xl border p-5 transition-all ${
        active
          ? 'border-violet-500/30 bg-violet-500/10 shadow-lg shadow-violet-950/20'
          : affected
          ? 'border-rose-500/15 bg-slate-900/70'
          : 'border-slate-800 bg-slate-950/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
            active
              ? 'border-violet-500/20 bg-violet-500/10 text-violet-300'
              : affected
              ? 'border-rose-500/15 bg-rose-500/5 text-rose-300'
              : 'border-slate-800 bg-slate-900 text-slate-500'
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[16px] font-semibold text-white">{label}</h4>
            {active && (
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-200">
                Escopo selecionado
              </span>
            )}
            {!active && affected && (
              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-200">
                Herança ativa
              </span>
            )}
          </div>

          <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
            {subtitle}
          </p>

          {(hasPolicy || hasLock) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hasPolicy && (
                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-200">
                  Policy aplicada
                </span>
              )}
              {hasLock && (
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
                  Lock aplicado
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowConnector({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 items-center justify-center">
      <ArrowDown size={18} className={active ? 'text-violet-300' : 'text-slate-700'} />
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
  tone: 'violet' | 'amber';
}) {
  const styles = {
    violet: 'border-violet-500/15 bg-violet-500/5 text-violet-200',
    amber: 'border-amber-500/15 bg-amber-500/5 text-amber-200',
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles[tone]}`}>
          {icon}
        </div>

        <div>
          <h4 className="text-[15px] font-semibold text-white">{title}</h4>
          <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}