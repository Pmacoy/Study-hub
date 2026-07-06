
import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  User,
  Users,
  Crown,
  Pencil,
  Eye,
  KeyRound,
  Building2,
  CreditCard,
  FolderKanban,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  AlertTriangle,
} from 'lucide-react';

type Scope = 'Management Group' | 'Subscription' | 'Resource Group';
type Role = 'Reader' | 'Contributor' | 'Owner';

type PermissionKey =
  | 'readResources'
  | 'createResources'
  | 'deleteResources'
  | 'assignRoles';

const roleConfig: Record<
  Role,
  {
    label: string;
    desc: string;
    icon: React.ReactNode;
    tone: string;
    permissions: PermissionKey[];
  }
> = {
  Reader: {
    label: 'Reader',
    desc: 'Pode visualizar recursos, mas não pode criar, alterar nem remover.',
    icon: <Eye size={16} />,
    tone: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
    permissions: ['readResources'],
  },
  Contributor: {
    label: 'Contributor',
    desc: 'Pode gerir recursos, mas não pode atribuir acesso no IAM.',
    icon: <Pencil size={16} />,
    tone: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    permissions: ['readResources', 'createResources', 'deleteResources'],
  },
  Owner: {
    label: 'Owner',
    desc: 'Tem controlo total sobre recursos e também pode gerir acessos.',
    icon: <Crown size={16} />,
    tone: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    permissions: ['readResources', 'createResources', 'deleteResources', 'assignRoles'],
  },
};

const permissionLabels: Record<PermissionKey, string> = {
  readResources: 'Ler recursos',
  createResources: 'Criar recursos',
  deleteResources: 'Eliminar recursos',
  assignRoles: 'Gerir acessos (IAM)',
};

export default function AzureRbacSimulator() {
  const [selectedRole, setSelectedRole] = useState<Role>('Contributor');
  const [selectedScope, setSelectedScope] = useState<Scope>('Resource Group');
  const [identityType, setIdentityType] = useState<'user' | 'group'>('user');

  const selectedRoleData = roleConfig[selectedRole];

  const hierarchy = [
    {
      key: 'Management Group' as Scope,
      label: 'Management Group',
      subtitle: 'Escopo organizacional mais alto',
      icon: <Building2 size={18} />,
    },
    {
      key: 'Subscription' as Scope,
      label: 'Subscription',
      subtitle: 'Cobrança, governação e recursos',
      icon: <CreditCard size={18} />,
    },
    {
      key: 'Resource Group' as Scope,
      label: 'Resource Group',
      subtitle: 'Escopo recomendado para menor privilégio',
      icon: <FolderKanban size={18} />,
    },
  ];

  const inheritedScopes = hierarchy.map((item) => {
    if (selectedScope === 'Management Group') return true;
    if (selectedScope === 'Subscription') {
      return item.key === 'Subscription' || item.key === 'Resource Group';
    }
    return item.key === 'Resource Group';
  });

  const summary = useMemo(() => {
    if (selectedRole === 'Reader') {
      return `${identityType === 'user' ? 'O utilizador' : 'O grupo'} recebe permissões apenas de leitura no escopo ${selectedScope}.`;
    }

    if (selectedRole === 'Contributor') {
      return `${identityType === 'user' ? 'O utilizador' : 'O grupo'} pode gerir recursos no escopo ${selectedScope}, mas não consegue atribuir roles a outros identidades.`;
    }

    return `${identityType === 'user' ? 'O utilizador' : 'O grupo'} tem controlo total no escopo ${selectedScope}, incluindo gestão de acessos (IAM).`;
  }, [selectedRole, selectedScope, identityType]);

  const examHint = useMemo(() => {
    if (selectedRole === 'Owner') {
      return 'Owner inclui permissões de IAM. Esta é a diferença clássica entre Owner e Contributor.';
    }
    if (selectedRole === 'Contributor') {
      return 'Contributor faz quase tudo em recursos, mas não altera atribuições RBAC.';
    }
    return 'Reader é a role típica para observação, auditoria e acesso sem alteração.';
  }, [selectedRole]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <section className="overflow-hidden rounded-3xl border border-sky-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
              <ShieldCheck size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-300">
                Controle de acesso
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                RBAC no Azure
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Simula como roles e escopos definem permissões efetivas, herança e limite de atuação dentro da hierarquia Azure.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 md:px-8">
          <TopMetric
            label="Role selecionada"
            value={selectedRole}
            hint="Permissão principal"
            tone="sky"
          />
          <TopMetric
            label="Escopo"
            value={selectedScope}
            hint="Onde a role foi atribuída"
            tone="emerald"
          />
          <TopMetric
            label="Identidade"
            value={identityType === 'user' ? 'Utilizador' : 'Grupo'}
            hint="Alvo da atribuição"
            tone="amber"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-sky-300" />
            <h3 className="text-sm font-semibold text-white">Configurar acesso</h3>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              1. Tipo de identidade
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIdentityType('user')}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  identityType === 'user'
                    ? 'border-sky-500/30 bg-sky-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white">Utilizador</p>
                    <p className="text-[12px] text-slate-500">Atribuição direta</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIdentityType('group')}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  identityType === 'group'
                    ? 'border-sky-500/30 bg-sky-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white">Grupo</p>
                    <p className="text-[12px] text-slate-500">Escala melhor</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              2. Escolhe a role
            </label>

            <div className="space-y-3">
              {(Object.keys(roleConfig) as Role[]).map((role) => {
                const config = roleConfig[role];
                const active = selectedRole === role;

                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-slate-700 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.tone}`}>
                        {config.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-white">{config.label}</p>
                        <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
                          {config.desc}
                        </p>
                      </div>

                      {active && (
                        <CheckCircle2 size={18} className="ml-auto shrink-0 text-sky-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              3. Define o escopo
            </label>

            <div className="space-y-3">
              {hierarchy.map((scope) => {
                const active = selectedScope === scope.key;

                return (
                  <button
                    key={scope.key}
                    onClick={() => setSelectedScope(scope.key)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                        {scope.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-white">{scope.label}</p>
                        <p className="mt-1 text-[12px] text-slate-500">{scope.subtitle}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-2">
              Resultado da atribuição
            </p>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <KeyRound size={16} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-white">Permissões efetivas</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(permissionLabels) as PermissionKey[]).map((permission) => {
                const allowed = selectedRoleData.permissions.includes(permission);

                return (
                  <div
                    key={permission}
                    className={`rounded-2xl border p-4 ${
                      allowed
                        ? 'border-emerald-500/20 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {allowed ? (
                        <CheckCircle2 size={18} className="text-emerald-300" />
                      ) : (
                        <XCircle size={18} className="text-slate-600" />
                      )}
                      <div>
                        <p className={`text-[14px] font-medium ${allowed ? 'text-emerald-100' : 'text-slate-300'}`}>
                          {permissionLabels[permission]}
                        </p>
                        <p className="mt-1 text-[12px] text-slate-500">
                          {allowed ? 'Permitido nesta role' : 'Não permitido nesta role'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={16} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-white">Herança do escopo</h3>
            </div>

            <div className="space-y-4">
              {hierarchy.map((scope, index) => {
                const inherited = inheritedScopes[index];
                const selected = selectedScope === scope.key;

                return (
                  <div
                    key={scope.key}
                    className={`rounded-3xl border p-5 transition-all ${
                      selected
                        ? 'border-sky-500/30 bg-sky-500/10'
                        : inherited
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-300">
                        {scope.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[16px] font-semibold text-white">{scope.label}</h4>
                          {selected && (
                            <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] text-sky-200">
                              Escopo atribuído
                            </span>
                          )}
                          {!selected && inherited && (
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200">
                              Herda acesso
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-[13px] text-slate-400">
                          {scope.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RuleCard
          icon={<Info size={16} />}
          title="Regra de prova: Owner vs Contributor"
          tone="amber"
          text={examHint}
        />
        <RuleCard
          icon={<AlertTriangle size={16} />}
          title="Regra de ouro: menor privilégio"
          tone="sky"
          text="A melhor prática é atribuir a role necessária no escopo mais específico possível. Em muitos cenários, o Resource Group é melhor do que a Subscription inteira."
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

function RuleCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone: 'sky' | 'amber';
}) {
  const styles = {
    sky: 'border-sky-500/15 bg-sky-500/5 text-sky-200',
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