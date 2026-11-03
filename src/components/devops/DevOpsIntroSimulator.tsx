import React from 'react';
import { useState } from 'react';
import { BookOpen, RefreshCw, Rocket, Users, Cog, Target, Beaker, Building2, ChevronDown, ChevronRight, ArrowRight, X, ShieldCheck, Terminal, Server, Shield, Database } from 'lucide-react';

type View = 'concepts' | 'lifecycle' | 'deploy' | 'teams' | 'glossary';

const DEPLOY_STRATEGIES = [
  { name: 'Blue-Green', color: 'sky', risk: 'Baixo', downtime: 'Zero', rollback: 'Instantâneo', desc: 'Dois ambientes idênticos (blue = atual, green = novo). O tráfego é comutado de uma vez via load balancer. Rollback é trocar de volta.', use: 'Apps stateless com capacidade para duplicar infra.' },
  { name: 'Rolling', color: 'violet', risk: 'Médio', downtime: 'Zero', rollback: 'Lento', desc: 'Pods/instâncias são actualizados gradualmente. Em nenhum momento toda a frota está em downtime. Funciona bem com Kubernetes Deployments.', use: 'Quando não há recursos para Blue-Green.' },
  { name: 'Canary', color: 'amber', risk: 'Baixo', downtime: 'Zero', rollback: 'Rápido', desc: 'Uma pequena percentagem do tráfego (ex: 5%) vai para a nova versão. Métricas são monitorizadas antes de fazer full rollout.', use: 'Quando queres validar em produção com impacto mínimo.' },
  { name: 'Recreate', color: 'rose', risk: 'Alto', downtime: 'Sim', rollback: 'Manual', desc: 'Stop total da versão antiga, depois deploy da nova. Simples mas causa downtime. Só válido para ambientes não-críticos.', use: 'DEV/TEST ou quando a app não suporta múltiplas versões.' },
];

const LIFECYCLE_STAGES = [
  { stage: 'PLAN', tools: ['Jira', 'Confluence', 'Notion'], color: 'slate', desc: 'Definição de requisitos, sprints e histórias de utilizador' },
  { stage: 'CODE', tools: ['Git', 'GitHub', 'VS Code'], color: 'sky', desc: 'Desenvolvimento em feature branches, code review via PR' },
  { stage: 'BUILD', tools: ['Maven', 'NPM', 'Gradle'], color: 'violet', desc: 'Compilação, testes unitários, geração de artefactos' },
  { stage: 'TEST', tools: ['JUnit', 'SonarQube', 'Selenium'], color: 'amber', desc: 'SAST, cobertura de código, testes de integração e E2E' },
  { stage: 'RELEASE', tools: ['Nexus', 'Docker Hub', 'ECR'], color: 'emerald', desc: 'Publicação de imagem Docker ou artefacto versionado' },
  { stage: 'DEPLOY', tools: ['Kubernetes', 'Helm', 'ArgoCD'], color: 'teal', desc: 'Deploy em DEV → STG → PROD com aprovação por gate' },
  { stage: 'OPERATE', tools: ['Terraform', 'Ansible', 'Pulumi'], color: 'rose', desc: 'IaC para infra, config management, gestão de secrets' },
  { stage: 'MONITOR', tools: ['Prometheus', 'Grafana', 'ELK'], color: 'fuchsia', desc: 'Métricas, logs, alertas e dashboards de observabilidade' },
];

const LIFECYCLE_DETAILS: Record<string, { why: string; howto: string[]; devops: string }> = {
  PLAN: {
    why: 'Antes de escrever código, definir o quê e o porquê. Sprints curtos (1-2 semanas) com histórias de utilizador claras.',
    howto: ['Criar épicos e histórias no Jira com critérios de aceitação', 'Planear a sprint com estimativas (story points)', 'Documentar decisões de arquitectura no Confluence', 'Definir Definition of Done antes de começar'],
    devops: 'A qualidade do planeamento reduz re-trabalho. Infrastructure changes também devem ser planeadas como tickets.',
  },
  CODE: {
    why: 'Desenvolvimento isolado em feature branches. Code review obrigatório antes de merge para proteger a qualidade.',
    howto: ['git checkout -b feat/JIRA-123-nome-descritivo', 'Commits pequenos e frequentes com Conventional Commits', 'Pull Request com descrição clara do que muda e porquê', 'Code review por pelo menos 1 reviewer antes de merge'],
    devops: 'Nunca commitar diretamente para main. Branch protection rules no GitHub/GitLab são obrigatórias em equipas.',
  },
  BUILD: {
    why: 'Compilação automática a cada commit. Se o build falha, o pipeline para e a equipa é notificada imediatamente.',
    howto: ['mvn clean package (Java/Maven) ou npm run build', 'Testes unitários correm nesta fase (rápidos, < 5 min)', 'Geração do artefacto: .jar, .whl, imagem Docker', 'Cache de dependências para builds mais rápidos'],
    devops: 'Build reproducível: mesmas inputs devem gerar sempre o mesmo output. Use --frozen-lockfile ou mvn -B.',
  },
  TEST: {
    why: 'Qualidade automatizada antes de qualquer deploy. SAST detecta vulnerabilidades em código sem executá-lo.',
    howto: ['SonarQube: análise estática com Quality Gate (cobertura ≥ 80%)', 'Testes de integração contra a base de dados/serviços reais', 'Selenium/Playwright para testes E2E na UI', 'Trivy SCA para vulnerabilidades em dependências'],
    devops: 'Quality Gate bloqueia o pipeline se não passar. Nunca fazer bypass — fix the code, not the gate.',
  },
  RELEASE: {
    why: 'Publicar o artefacto versionado num registry centralizado. A versão publicada é o que vai ser deployado.',
    howto: ['docker build -t app:1.2.3 . && docker push registry/app:1.2.3', 'Tag semântica: major.minor.patch ou SHA do commit', 'Nexus/Artifactory para artefactos Maven/NPM', 'Trivy scan obrigatório antes de push para registry'],
    devops: 'Usar o SHA do commit como tag garante rastreabilidade total. Never use :latest em produção.',
  },
  DEPLOY: {
    why: 'Deploy automatizado e progressivo. DEV → STG sem aprovação. STG → PROD com aprovação manual ou Canary.',
    howto: ['kubectl set image deploy/app app=registry/app:1.2.3 -n prod', 'Helm upgrade --install app ./chart -f values-prod.yaml', 'ArgoCD faz GitOps: sincroniza o estado do cluster com o Git', 'Health checks e rollout status antes de considerar sucesso'],
    devops: 'Se o deploy falha, rollback automático é obrigatório. kubectl rollout undo deploy/app -n prod.',
  },
  OPERATE: {
    why: 'Infraestrutura como código. Nunca fazer mudanças manuais no portal — tudo via Terraform ou Ansible.',
    howto: ['terraform plan → review → terraform apply', 'Ansible playbooks para config management (sem drift)', 'Secrets via Key Vault / AWS Secrets Manager, nunca em ficheiros', 'Mudanças de infra como Pull Requests, com aprovação'],
    devops: 'Infrastructure Drift: quando a infra real difere do código. terraform plan detecta. Nunca tocar manualmente.',
  },
  MONITOR: {
    why: 'Observabilidade em produção. Saber antes dos utilizadores que algo falhou. Logs, métricas e traces em tempo real.',
    howto: ['Prometheus scrape de métricas a cada 15s', 'Grafana dashboards para Golden Signals (Latency, Traffic, Errors, Saturation)', 'AlertManager → PagerDuty/Slack quando SLO em risco', 'Distributed tracing com Jaeger para latências em microserviços'],
    devops: 'SLO define o target. SLI mede. Error Budget é o quanto podes falhar. Quando o budget acaba, para features e foca em reliability.',
  },
};

const CONCEPTS = [
  { title: 'O que é DevOps?', icon: Rocket, content: [
    'DevOps (Development + Operations) é uma cultura, conjunto de práticas e ferramentas que une as equipas de desenvolvimento de software (Dev) e operações de TI (Ops).',
    'O principal objetivo é encurtar o ciclo de vida do desenvolvimento (Lead Time) e entregar software de alta qualidade de forma contínua e automatizada.',
    'Elimina o modelo tradicional em "silos" onde Dev escrevia código e Ops sofria para colocar em produção sem conhecer a aplicação.',
  ]},
  { title: 'DevOps vs DevSecOps', icon: ShieldCheck, content: [
    'DevOps foca-se na velocidade, colaboração e automação de entregas.',
    'DevSecOps insere a segurança desde o primeiro dia ("Shift-Left Security"). A segurança deixa de ser um obstáculo no final e passa a ser integrada no pipeline (SAST, SCA, scans de imagens).',
    'Todos na equipa partilham a responsabilidade pela segurança, garantindo que vulnerabilidades são detetadas no commit e não em produção.',
  ]},
  { title: 'CI vs CD (Continuous Integration & Continuous Delivery)', icon: Cog, content: [
    'CI (Continuous Integration): Prática de fazer merge frequente de código para o branch principal (main). Cada commit dispara builds e testes automáticos para detetar erros rapidamente.',
    'Continuous Delivery: Garante que o código testado está sempre num estado pronto para ir para produção. O deploy em si pode ter uma aprovação manual.',
    'Continuous Deployment: Cada commit que passa por todos os testes vai automaticamente para produção sem intervenção humana.',
  ]},
  { title: 'Infraestrutura como Código (IaC)', icon: Server, content: [
    'Em vez de configurar servidores manualmente clicando no portal cloud (Azure/AWS), a infraestrutura é escrita em código (ex: Terraform, Bicep, Ansible).',
    'Vantagens: Versionamento no Git, reprodutibilidade exata de ambientes (DEV, STG, PROD iguais) e auditoria de alterações.',
  ]},
];

const GLOSSARY = [
  { term: 'Docker', desc: 'Plataforma de contentorização. Empacota a aplicação e todas as suas dependências num contentor isolado que corre igual em qualquer máquina.' },
  { term: 'Kubernetes (K8s)', desc: 'Orquestrador de contentores em escala enterprise. Gere o fecho, escalabilidade automática, load balancing e recuperação de pods.' },
  { term: 'Terraform', desc: 'Ferramenta de IaC (Infrastructure as Code) agnóstica de cloud para provisionar recursos de forma declarativa.' },
  { term: 'Ansible', desc: 'Ferramenta de gestão de configuração e automação de servidores via SSH sem agentes instalados.' },
  { term: 'Prometheus & Grafana', desc: 'Prometheus recolhe métricas em formato time-series; Grafana cria dashboards visuais incríveis com esses dados.' },
  { term: 'ArgoCD / GitOps', desc: 'Ferramenta que mantém o cluster Kubernetes sincronizado exatamente com o que está declarado num repositório Git.' },
  { term: 'OpenSearch / ELK', desc: 'Sistemas de indexação e busca de logs em tempo real para auditoria de segurança (SIEM) e troubleshooting.' },
  { term: 'ModSecurity / WAF', desc: 'Web Application Firewall que protege aplicações contra ataques comuns como SQL Injection e XSS.' },
];

export default function DevOpsIntroSimulator() {
  const [view, setView] = useState<View>('concepts');
  const [open, setOpen] = useState<number | null>(0);
  const [selectedDeploy, setSelectedDeploy] = useState(0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    sky: 'text-sky-400 border-sky-500/30 bg-sky-500/8',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/8',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/8',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8',
    teal: 'text-teal-400 border-teal-500/30 bg-teal-500/8',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/8',
    fuchsia: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/8',
    slate: 'text-slate-400 border-slate-500/30 bg-slate-500/8',
  };

  const views: { id: View; label: string | JSX.Element }[] = [
    { id: 'concepts', label: <><BookOpen size={14} className="mr-1 inline" /> O que é DevOps?</> },
    { id: 'lifecycle', label: <><RefreshCw size={14} className="mr-1 inline" /> Ciclo de Vida (SDLC)</> },
    { id: 'deploy', label: <><Rocket size={14} className="mr-1 inline" /> Estratégias de Deploy</> },
    { id: 'teams', label: <><Users size={14} className="mr-1 inline" /> Equipas & Topologias</> },
    { id: 'glossary', label: <><Server size={14} className="mr-1 inline" /> Glossário de Ferramentas</> },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho explicativo */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Rocket className="text-violet-400" />
          Fundamentos de DevOps & Plataforma
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          O DevOps não é apenas uma ferramenta — é uma mudança cultural e operacional. Aqui compreende o porquê de cada tecnologia, como os serviços interagem no ciclo de vida do software e quais as melhores práticas da indústria para entrega contínua, fiabilidade (SRE) e segurança.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${view === v.id ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'border border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'concepts' && (
        <div className="space-y-3">
          {CONCEPTS.map((c, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 bg-[#181926]/70 hover:bg-slate-900 transition-colors text-left">
                <span className="text-xl text-violet-400">{React.createElement(c.icon, { size: 20 })}</span>
                <span className="flex-1 text-md font-semibold text-slate-200">{c.title}</span>
                {open === i ? <ChevronDown size={15} className="text-violet-400" /> : <ChevronRight size={15} className="text-slate-400" />}
              </button>
              {open === i && (
                <div className="px-5 py-4 bg-slate-900/50 border-t border-slate-800 space-y-2">
                  {c.content.map((line, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                      <ArrowRight size={14} className="text-violet-400 mt-1 shrink-0" />
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === 'lifecycle' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Clica em cada etapa do ciclo de vida para entender o propósito, ferramentas e boas práticas:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LIFECYCLE_STAGES.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedStage(selectedStage === s.stage ? null : s.stage)}
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                  selectedStage === s.stage
                    ? `${colorMap[s.color]} ring-2 ring-offset-1 ring-offset-slate-950 ring-current scale-[1.02]`
                    : colorMap[s.color]
                }`}
              >
                <div className={`text-xs font-black uppercase tracking-widest mb-2 ${colorMap[s.color].split(' ')[0]}`}>{s.stage}</div>
                <div className="space-y-1 mb-3">
                  {s.tools.map(t => (
                    <span key={t} className="block text-2xs font-mono text-slate-400">{t}</span>
                  ))}
                </div>
                <p className="text-2xs text-slate-400 leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selectedStage && LIFECYCLE_DETAILS[selectedStage] && (
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`text-base font-black uppercase tracking-widest ${colorMap[LIFECYCLE_STAGES.find(s => s.stage === selectedStage)?.color ?? 'slate'].split(' ')[0]}`}>
                  {selectedStage} — O que é e para que serve?
                </div>
                <button onClick={() => setSelectedStage(null)} className="text-slate-600 hover:text-slate-400 transition-colors">
                  <X size={14} />
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {LIFECYCLE_DETAILS[selectedStage].why}
              </p>

              <div>
                <div className="text-2xs font-bold text-slate-400 uppercase tracking-widest mb-2">Como implementar na prática</div>
                <div className="space-y-1.5">
                  {LIFECYCLE_DETAILS[selectedStage].howto.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-violet-400 shrink-0 font-bold">{i + 1}.</span>
                      <code className="font-mono text-xs text-emerald-300">{step}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <span className="text-2xs font-bold text-amber-400 uppercase">Regra de Ouro DevOps: </span>
                <span className="text-xs text-slate-400">{LIFECYCLE_DETAILS[selectedStage].devops}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'deploy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {DEPLOY_STRATEGIES.map((d, i) => (
              <button key={i} onClick={() => setSelectedDeploy(i)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedDeploy === i ? `${colorMap[d.color]} border-2` : 'border-slate-800 bg-[#181926]/50 hover:border-slate-700'}`}>
                <div className={`text-base font-bold ${selectedDeploy === i ? colorMap[d.color].split(' ')[0] : 'text-slate-300'}`}>{d.name}</div>
                <div className="text-2xs text-slate-400 mt-1">Rollback: {d.rollback} | Risco: {d.risk}</div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-[#181926]/70 space-y-4">
            {(() => {
              const d = DEPLOY_STRATEGIES[selectedDeploy];
              return (
                <>
                  <div className={`text-xl font-black ${colorMap[d.color].split(' ')[0]}`}>{d.name} Deployment</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[['Risco', d.risk], ['Downtime', d.downtime], ['Rollback', d.rollback]].map(([k, v]) => (
                      <div key={k} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-2xs text-slate-400 uppercase">{k}</div>
                        <div className="text-base font-bold text-slate-200 mt-1">{v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{d.desc}</p>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <span className="text-xs font-bold text-violet-400">Quando utilizar: </span>
                    <span className="text-xs text-slate-400">{d.use}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {view === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { type: 'Stream-Aligned Team', emoji: Target, color: 'sky', desc: 'Alinhada ao fluxo de valor de negócio. Entrega features diretamente aos clientes com total autonomia para desenhar, construir e fazer deploy.', resp: ['Desenvolvimento de produto', 'Manutenção do pipeline CI/CD próprio', 'Ownership de produção'] },
            { type: 'Platform Team', emoji: Building2, color: 'violet', desc: 'Fornece uma plataforma interna de autosserviço (IDP). Reduz a carga cognitiva das equipas de produto fornecendo golden paths prontos a usar.', resp: ['Internal Developer Platform (IDP)', 'Templates de CI/CD e Terraform', 'Gestão de clusters Kubernetes'] },
            { type: 'Enabling Team', emoji: Beaker, color: 'amber', desc: 'Especialistas que ajudam as equipas a adotar novas tecnologias ou práticas (ex: DevSecOps, SRE). Ficam temporariamente até a equipa ganhar autonomia.', resp: ['Workshops e formação', 'Proof of concepts', 'Consultoria interna'] },
            { type: 'Complicated Subsystem Team', emoji: Cog, color: 'rose', desc: 'Gere componentes técnicos complexos que exigem conhecimentos especializados profundos (ex: motores de IA, segurança criptográfica).', resp: ['Desenvolvimento de subsistemas complexos', 'APIs internas', 'SLAs de performance'] },
          ].map(t => (
            <div key={t.type} className={`p-5 rounded-2xl border ${colorMap[t.color]} space-y-3`}>
              <div className="flex items-center gap-3">
                <span className="text-xl text-violet-400"><t.emoji size={22} /></span>
                <span className={`text-base font-bold ${colorMap[t.color].split(' ')[0]}`}>{t.type}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{t.desc}</p>
              <ul className="space-y-1 pt-1">
                {t.resp.map(r => (
                  <li key={r} className="flex items-start gap-2 text-xs text-slate-400">
                    <ArrowRight size={10} className={`${colorMap[t.color].split(' ')[0]} mt-0.5 shrink-0`} />{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {view === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOSSARY.map(g => (
            <div key={g.term} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="text-sm font-bold text-violet-300 font-mono">{g.term}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
