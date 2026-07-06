
import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  Info,
  Layers,
  Network,
  Server,
  Shield,
  Sparkles,
  XCircle,
  Zap,
  GitBranch,
  Container,
  Scaling,
} from 'lucide-react';

type ContainerMode = 'compare' | 'aci' | 'aks' | 'appservice';

interface Service {
  id: Exclude<ContainerMode, 'compare'>;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: 'blue' | 'indigo' | 'emerald';
  useCases: string[];
  notFor: string[];
  keyFacts: string[];
  examDecision: string;
}

const SERVICES: Service[] = [
  {
    id: 'aci',
    name: 'Azure Container Instances',
    subtitle: 'Containers isolados sem gerir VMs ou cluster',
    icon: <Box size={22} />,
    accent: 'blue',
    useCases: [
      'Executar um container isolado rapidamente',
      'Jobs batch e tarefas de curta duração',
      'Pipelines de build, teste ou processamento sob demanda',
      'Protótipos e ambientes simples',
      'Cenários em que a velocidade de deploy importa mais do que orquestração',
    ],
    notFor: [
      'Microsserviços com dependências complexas',
      'Plataformas que exigem orquestração rica',
      'Ambientes com escalonamento horizontal sofisticado',
    ],
    keyFacts: [
      'É a forma mais rápida e simples de correr containers isolados no Azure.',
      'Suporta containers Linux e Windows.',
      'Pode expor IP e FQDN públicos e também integrar-se com VNet.',
      'É adequado quando não queres adotar um orquestrador completo.',
    ],
    examDecision: 'Se a pergunta pedir a forma mais rápida e simples de correr um container isolado, pensa primeiro em ACI.',
  },
  {
    id: 'aks',
    name: 'Azure Kubernetes Service',
    subtitle: 'Kubernetes gerido para workloads de produção',
    icon: <Layers size={22} />,
    accent: 'indigo',
    useCases: [
      'Microsserviços',
      'Aplicações cloud-native de maior escala',
      'Rolling updates, namespaces e deploy contínuo',
      'Escalonamento horizontal por métricas e eventos',
      'Plataformas com múltiplos serviços containerizados',
    ],
    notFor: [
      'Cenários muito simples com um único container',
      'Equipas que não querem lidar com o ecossistema Kubernetes',
      'Aplicações web simples que cabem melhor em App Service',
    ],
    keyFacts: [
      'O Azure gere o control plane do cluster.',
      'Pagas e geres principalmente os nós ou node pools.',
      'Integra-se com monitorização e recursos de segurança do Azure.',
      'É a escolha natural quando a questão fala em orquestração.',
    ],
    examDecision: 'Se a pergunta falar de orquestração, múltiplos containers, escalonamento avançado ou Kubernetes, AKS é o favorito.',
  },
  {
    id: 'appservice',
    name: 'Azure App Service',
    subtitle: 'PaaS para apps web, APIs e custom containers',
    icon: <Globe size={22} />,
    accent: 'emerald',
    useCases: [
      'Aplicações web HTTP/HTTPS',
      'APIs REST e backends',
      'Apps que precisam de staging slots',
      'Deploy rápido com menos gestão de infraestrutura',
      'Apps em código ou custom container com modelo PaaS',
    ],
    notFor: [
      'Orquestração rica de múltiplos serviços',
      'Cenários de controlo profundo do cluster',
      'Workloads fortemente dependentes de desenho Kubernetes',
    ],
    keyFacts: [
      'O custo está ligado ao App Service Plan.',
      'Várias apps podem partilhar o mesmo plano.',
      'Deployment slots existem em Standard, Premium e Isolated.',
      'É muito forte quando a questão pede app web gerida com menos esforço operacional.',
    ],
    examDecision: 'Se a pergunta pedir web app ou API gerida com menos overhead, App Service costuma ser a resposta mais direta.',
  },
];

const COMPARISON_MATRIX = [
  { feature: 'Complexidade de gestão', aci: 'Mínima', aks: 'Alta', appservice: 'Baixa' },
  { feature: 'Orquestração nativa', aci: 'Não', aks: 'Sim', appservice: 'Não' },
  { feature: 'Escalonamento horizontal', aci: 'Limitado', aks: 'Avançado', appservice: 'Simples' },
  { feature: 'App web PaaS', aci: 'Não', aks: 'Possível com mais esforço', appservice: 'Nativo' },
  { feature: 'Modelo de custo dominante', aci: 'Consumo de CPU/RAM', aks: 'Nós do cluster', appservice: 'App Service Plan' },
  { feature: 'Resposta típica da prova', aci: 'Container isolado', aks: 'Kubernetes/orquestração', appservice: 'Web app/API' },
];

const aciSteps = [
  { label: 'Selecionar imagem', desc: 'myregistry.azurecr.io/myapp:latest' },
  { label: 'Definir CPU e memória', desc: '1 vCPU · 1.5 GB RAM' },
  { label: 'Configurar networking', desc: 'Porta 80 + DNS label' },
  { label: 'Executar container', desc: 'Running · FQDN público ativo' },
];

export default function AzureContainersSimulator() {
  const [mode, setMode] = useState<ContainerMode>('compare');
  const [deployStep, setDeployStep] = useState(0);
  const [aksScale, setAksScale] = useState(3);
  const [slotMode, setSlotMode] = useState<'staging' | 'swap'>('staging');

  const currentService = SERVICES.find((s) => s.id === mode);

  const topState = useMemo(() => {
    if (mode === 'aci') return 'Deploy rápido de container isolado';
    if (mode === 'aks') return `Cluster com ${aksScale} nós ativos`;
    if (mode === 'appservice') return slotMode === 'staging' ? 'Staging slot pronto' : 'Swap concluído';
    return 'Comparação estratégica entre serviços';
  }, [mode, aksScale, slotMode]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 text-slate-200">
      <section className="overflow-hidden rounded-3xl border border-blue-500/15 bg-slate-950/80 shadow-2xl shadow-black/10">
        <div className="border-b border-slate-800/80 px-6 py-5 md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
              <Box size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-300">
                Containers e plataforma
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Containers & PaaS
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
                Compara ACI, AKS e App Service para te ajudar a decidir entre container isolado, orquestração Kubernetes e aplicação web gerida no Azure.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-6 md:px-8">
          <TopMetric label="Vista atual" value={mode === 'compare' ? 'Comparação' : currentService?.name ?? 'Comparação'} hint="Cenário ativo" tone="blue" />
          <TopMetric label="Leitura rápida" value={topState} hint="Estado principal" tone="indigo" />
          <TopMetric label="Decisão típica" value={mode === 'aci' ? 'ACI' : mode === 'aks' ? 'AKS' : mode === 'appservice' ? 'App Service' : 'Escolha por contexto'} hint="Atalho de prova" tone="emerald" />
          <TopMetric label="ACR" value="Registry privado" hint="Integra ACI, AKS e App Service" tone="amber" />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {[{ id: 'compare', label: 'Comparação' }, ...SERVICES.map((s) => ({ id: s.id, label: s.name.replace('Azure ', '') }))].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMode(item.id as ContainerMode);
                setDeployStep(0);
              }}
              className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${
                mode === item.id
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {mode === 'compare' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setMode(s.id)}
                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-left transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className={`mb-4 ${accentText(s.accent)}`}>{s.icon}</div>
                <h3 className="text-[15px] font-semibold text-white">{s.name.replace('Azure ', '')}</h3>
                <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">{s.subtitle}</p>
                <div className={`mt-4 inline-flex items-center gap-1 text-[11px] font-medium ${accentText(s.accent)}`}>
                  Ver cenário <ArrowRight size={12} />
                </div>
              </button>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 overflow-hidden">
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Matriz de decisão</h3>
              <p className="mt-1 text-[12px] text-slate-500">
                Comparação rápida para acertar mais depressa nas questões de AZ-104.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-900/70 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Critério</th>
                    <th className="px-5 py-4 font-semibold text-blue-300">ACI</th>
                    <th className="px-5 py-4 font-semibold text-indigo-300">AKS</th>
                    <th className="px-5 py-4 font-semibold text-emerald-300">App Service</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_MATRIX.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-slate-900/20' : ''}>
                      <td className="px-5 py-4 text-slate-200 font-medium">{row.feature}</td>
                      <td className="px-5 py-4 text-slate-300">{row.aci}</td>
                      <td className="px-5 py-4 text-slate-300">{row.aks}</td>
                      <td className="px-5 py-4 text-slate-300">{row.appservice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DecisionCard
              title="Escolhe ACI"
              text="Quando precisas do caminho mais rápido para correr um container isolado sem cluster nem orquestrador."
              icon={<Box size={16} />}
              tone="blue"
            />
            <DecisionCard
              title="Escolhe AKS"
              text="Quando a questão pede Kubernetes, múltiplos serviços, escalonamento avançado ou desenho cloud-native."
              icon={<Layers size={16} />}
              tone="indigo"
            />
            <DecisionCard
              title="Escolhe App Service"
              text="Quando o foco está em aplicação web, API, staging slots e menor esforço operacional."
              icon={<Globe size={16} />}
              tone="emerald"
            />
          </section>
        </div>
      )}

      {currentService && mode !== 'compare' && (
        <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6 animate-in fade-in duration-300">
          <div className="space-y-4">
            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className={accentText(currentService.accent)} />
                <h3 className="text-sm font-semibold text-white">{currentService.name}</h3>
              </div>

              <div className={`rounded-2xl border p-4 ${accentSoft(currentService.accent)}`}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">Resposta de prova</p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-200">
                  {currentService.examDecision}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="text-[13px] font-semibold text-white mb-4">✅ Ideal para</h3>
              <div className="space-y-3">
                {currentService.useCases.map((u, i) => (
                  <ListItem key={i} icon={<CheckCircle2 size={14} className="text-emerald-300" />} text={u} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-rose-500/15 bg-rose-500/5 p-5">
              <h3 className="text-[13px] font-semibold text-rose-300 mb-4">❌ Não usar para</h3>
              <div className="space-y-3">
                {currentService.notFor.map((n, i) => (
                  <ListItem key={i} icon={<XCircle size={14} className="text-rose-300" />} text={n} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <h3 className="text-[13px] font-semibold text-white mb-4">⚡ Factos-chave</h3>
              <div className="space-y-3">
                {currentService.keyFacts.map((f, i) => (
                  <ListItem key={i} icon={<Zap size={14} className="text-amber-300" />} text={f} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {mode === 'aci' && (
              <>
                <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Deploy rápido
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-white">Fluxo de execução do ACI</h3>
                    </div>
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200">
                      Serverless container
                    </span>
                  </div>

                  <div className="space-y-3">
                    {aciSteps.map((step, i) => {
                      const done = deployStep > i;
                      const active = deployStep === i;

                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                            done
                              ? 'border-emerald-500/20 bg-emerald-500/10'
                              : active
                              ? 'border-blue-500/30 bg-blue-500/10'
                              : 'border-slate-800 bg-slate-900/40 opacity-50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                            done
                              ? 'bg-emerald-400 text-slate-950'
                              : active
                              ? 'bg-blue-400 text-slate-950 animate-pulse'
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {done ? '✓' : i + 1}
                          </div>

                          <div>
                            <p className="text-[14px] font-medium text-white">{step.label}</p>
                            <p className="mt-1 text-[12px] text-slate-500 font-mono">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setDeployStep((p) => Math.min(p + 1, aciSteps.length))}
                      disabled={deployStep >= aciSteps.length}
                      className="flex-1 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-600 px-4 py-3 text-[12px] font-semibold text-white transition-all"
                    >
                      {deployStep >= aciSteps.length ? 'Deploy concluído' : 'Próximo passo'}
                    </button>

                    <button
                      onClick={() => setDeployStep(0)}
                      className="rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-4 py-3 text-[12px] font-semibold text-slate-300 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CapabilityCard title="Sem cluster" active />
                  <CapabilityCard title="FQDN/IP público" active />
                  <CapabilityCard title="Orquestração avançada" active={false} />
                </section>
              </>
            )}

            {mode === 'aks' && (
              <>
                <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Arquitetura AKS
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-white">Control plane + node pools</h3>
                    </div>
                    <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] text-indigo-200">
                      Kubernetes gerido
                    </span>
                  </div>

                  <div className="rounded-3xl border border-indigo-500/15 bg-indigo-500/5 p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 items-start">
                      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                        <p className="text-[12px] font-semibold text-indigo-100">Control plane</p>
                        <p className="mt-2 text-[12px] text-slate-300 leading-relaxed">
                          Gerido pelo Azure, com foco em APIs, scheduling e controlo do cluster.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[12px] font-semibold text-white">Node pool</p>
                          <span className="text-[12px] text-slate-400">{aksScale} nós</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Array.from({ length: aksScale }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 flex flex-col items-center gap-2">
                              <Server size={18} className="text-indigo-300" />
                              <span className="text-[11px] text-indigo-100">Node {i + 1}</span>
                              <div className="flex gap-1">
                                <Container size={10} className="text-indigo-300" />
                                <Container size={10} className="text-indigo-300" />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <input
                            type="range"
                            min="2"
                            max="6"
                            value={aksScale}
                            onChange={(e) => setAksScale(Number(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CapabilityCard title="Control plane gerido" active />
                  <CapabilityCard title="Node pools pagos" active />
                  <CapabilityCard title="Orquestração nativa" active />
                </section>
              </>
            )}

            {mode === 'appservice' && (
              <>
                <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Operação web
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-white">App Service Plan + deployment slots</h3>
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
                      PaaS web
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
                      <h4 className="text-[13px] font-semibold text-white">App Service Plan</h4>
                      <p className="mt-2 text-[12px] text-slate-400 leading-relaxed">
                        O plano define a capacidade e o custo. Várias apps podem partilhar o mesmo plano.
                      </p>

                      <div className="mt-4 space-y-3">
                        {[
                          'Basic: sem deployment slots',
                          'Standard: suporta deployment slots',
                          'Premium/Isolated: mais capacidade e mais slots',
                        ].map((item) => (
                          <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-[12px] text-slate-300">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[13px] font-semibold text-white">Deployment slots</h4>
                        <button
                          onClick={() => setSlotMode((prev) => (prev === 'staging' ? 'swap' : 'staging'))}
                          className="rounded-xl border border-emerald-500/20 bg-slate-950/40 px-3 py-2 text-[11px] text-emerald-100"
                        >
                          {slotMode === 'staging' ? 'Executar swap' : 'Voltar a staging'}
                        </button>
                      </div>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div className={`rounded-2xl border p-4 ${slotMode === 'staging' ? 'border-amber-500/20 bg-amber-500/10' : 'border-slate-800 bg-slate-950/50'}`}>
                          <p className="text-[12px] font-semibold text-white">Staging</p>
                          <p className="mt-1 text-[12px] text-slate-400">Nova versão validada</p>
                        </div>

                        <GitBranch size={16} className="text-emerald-300" />

                        <div className={`rounded-2xl border p-4 ${slotMode === 'swap' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/50'}`}>
                          <p className="text-[12px] font-semibold text-white">Production</p>
                          <p className="mt-1 text-[12px] text-slate-400">
                            {slotMode === 'swap' ? 'Versão promovida com swap' : 'Versão atual em produção'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CapabilityCard title="App web gerida" active />
                  <CapabilityCard title="Deployment slots" active />
                  <CapabilityCard title="Kubernetes nativo" active={false} />
                </section>
              </>
            )}

            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-blue-300" />
                <h3 className="text-sm font-semibold text-white">Memória de exame</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <FactBox
                  title="ACI vs AKS"
                  text="ACI é para container isolado e rapidez; AKS é para Kubernetes, orquestração e escala maior."
                />
                <FactBox
                  title="App Service Plan"
                  text="O custo está no plano, não no número de apps a correr no mesmo plano."
                />
                <FactBox
                  title="ACR"
                  text="Azure Container Registry funciona como registry privado para imagens consumidas por ACI, AKS e App Service."
                />
                <FactBox
                  title="Deployment slots"
                  text="App Service suporta staging e swap em tiers Standard, Premium e Isolated."
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function accentText(accent: 'blue' | 'indigo' | 'emerald') {
  return {
    blue: 'text-blue-300',
    indigo: 'text-indigo-300',
    emerald: 'text-emerald-300',
  }[accent];
}

function accentSoft(accent: 'blue' | 'indigo' | 'emerald') {
  return {
    blue: 'border-blue-500/20 bg-blue-500/10',
    indigo: 'border-indigo-500/20 bg-indigo-500/10',
    emerald: 'border-emerald-500/20 bg-emerald-500/10',
  }[accent];
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
  tone: 'blue' | 'indigo' | 'emerald' | 'amber';
}) {
  const styles = {
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-200',
    indigo: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-200',
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

function DecisionCard({
  title,
  text,
  icon,
  tone,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  tone: 'blue' | 'indigo' | 'emerald';
}) {
  const styles = {
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
    indigo: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-200',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${styles[tone]}`}>
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

function ListItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <p className="text-[13px] text-slate-300 leading-relaxed">{text}</p>
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
            {active ? 'Presente neste cenário' : 'Não é o foco deste cenário'}
          </p>
        </div>
      </div>
    </div>
  );
}

function FactBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-[12px] font-semibold text-white">{title}</p>
      <p className="mt-2 text-[12px] text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}