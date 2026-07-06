import { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowRight, X } from 'lucide-react';

type View = 'concepts' | 'lifecycle' | 'deploy' | 'teams';

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
  { title: 'DevOps vs DevSecOps', icon: '🔄', content: [
    'DevOps une Dev + Ops com foco em velocidade e automação.',
    'DevSecOps adiciona Security como responsabilidade partilhada — "shift-left security".',
    'Em DevSecOps, segurança é verificada em cada stage do pipeline (SAST, DAST, image scanning).',
    'O objetivo não é bloquear deploys, mas detetar vulnerabilidades o mais cedo possível.',
  ]},
  { title: 'CI vs CD vs CD', icon: '⚙️', content: [
    'CI (Continuous Integration): merge frequente para main + build + testes automáticos.',
    'Continuous Delivery: o código está sempre em estado deployável (deploy manual).',
    'Continuous Deployment: cada commit que passa no pipeline vai automaticamente para produção.',
    'A diferença entre Delivery e Deployment é uma aprovação manual.',
  ]},
  { title: 'Shift-Left Security', icon: '🔐', content: [
    'Mover os controlos de segurança para o início do SDLC, não só no final.',
    'SAST (Static Analysis): analisa código fonte — SonarQube, Checkmarx.',
    'SCA (Software Composition Analysis): vulnerabilidades em dependências — Trivy, Snyk.',
    'DAST (Dynamic Analysis): testa a app em execução — OWASP ZAP.',
    'Image scanning: Trivy no Dockerfile antes de publicar no registry.',
  ]},
  { title: 'Team Topologies', icon: '👥', content: [
    'Stream-Aligned Team: equipa que entrega valor para um produto/serviço.',
    'Platform Team: fornece capacidades internas (IDP, CI/CD, observabilidade).',
    'Enabling Team: ajuda outras equipas a adotar novas tecnologias ou práticas.',
    'Complicated Subsystem Team: especialistas em componentes técnicos complexos.',
    'O modelo reduz dependências e aumenta autonomia das equipas.',
  ]},
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

  const views: { id: View; label: string }[] = [
    { id: 'concepts', label: '📚 Conceitos' },
    { id: 'lifecycle', label: '🔄 Ciclo de Vida' },
    { id: 'deploy', label: '🚀 Deploy Strategies' },
    { id: 'teams', label: '👥 Estrutura de Equipa' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === v.id ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'concepts' && (
        <div className="space-y-3">
          {CONCEPTS.map((c, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 bg-slate-950/70 hover:bg-slate-900 transition-colors text-left">
                <span className="text-xl">{c.icon}</span>
                <span className="flex-1 text-[14px] font-semibold text-slate-200">{c.title}</span>
                {open === i ? <ChevronDown size={15} className="text-violet-400" /> : <ChevronRight size={15} className="text-slate-500" />}
              </button>
              {open === i && (
                <div className="px-5 py-4 bg-slate-900/50 border-t border-slate-800 space-y-2">
                  {c.content.map((line, j) => (
                    <div key={j} className="flex items-start gap-2 text-[13px] text-slate-300">
                      <ArrowRight size={12} className="text-violet-400 mt-0.5 shrink-0" />
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
          <p className="text-[12px] text-slate-500">Clica em cada stage para ver detalhes.</p>
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
                <div className={`text-[11px] font-black uppercase tracking-widest mb-2 ${colorMap[s.color].split(' ')[0]}`}>{s.stage}</div>
                <div className="space-y-1 mb-3">
                  {s.tools.map(t => (
                    <span key={t} className="block text-[10px] font-mono text-slate-400">{t}</span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selectedStage && LIFECYCLE_DETAILS[selectedStage] && (
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`text-[13px] font-black uppercase tracking-widest ${colorMap[LIFECYCLE_STAGES.find(s => s.stage === selectedStage)?.color ?? 'slate'].split(' ')[0]}`}>
                  {selectedStage}
                </div>
                <button onClick={() => setSelectedStage(null)} className="text-slate-600 hover:text-slate-400 transition-colors">
                  <X size={14} />
                </button>
              </div>

              <p className="text-[13px] text-slate-300 leading-relaxed">
                {LIFECYCLE_DETAILS[selectedStage].why}
              </p>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Como fazer</div>
                <div className="space-y-1.5">
                  {LIFECYCLE_DETAILS[selectedStage].howto.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-[12px] text-slate-300">
                      <span className="text-violet-400 shrink-0 font-bold">{i + 1}.</span>
                      <code className="font-mono text-[11px] text-emerald-300">{step}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-400 uppercase">DevOps tip: </span>
                <span className="text-[11px] text-slate-400">{LIFECYCLE_DETAILS[selectedStage].devops}</span>
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
                className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedDeploy === i ? `${colorMap[d.color]} border-2` : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}>
                <div className={`text-[13px] font-bold ${selectedDeploy === i ? colorMap[d.color].split(' ')[0] : 'text-slate-300'}`}>{d.name}</div>
                <div className="text-[10px] text-slate-500 mt-1">Rollback: {d.rollback}</div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
            {(() => {
              const d = DEPLOY_STRATEGIES[selectedDeploy];
              return (
                <>
                  <div className={`text-xl font-black ${colorMap[d.color].split(' ')[0]}`}>{d.name} Deployment</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[['Risco', d.risk], ['Downtime', d.downtime], ['Rollback', d.rollback]].map(([k, v]) => (
                      <div key={k} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 uppercase">{k}</div>
                        <div className="text-[13px] font-bold text-slate-200 mt-1">{v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[13px] text-slate-300 leading-relaxed">{d.desc}</p>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <span className="text-[11px] font-bold text-violet-400">Quando usar: </span>
                    <span className="text-[11px] text-slate-400">{d.use}</span>
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
            { type: 'Stream-Aligned', emoji: '🎯', color: 'sky', desc: 'Alinhada ao fluxo de valor. Entrega features diretamente ao utilizador. Tem autonomia para build, test e deploy do seu produto.', resp: ['Desenvolvimento de features', 'Manutenção do pipeline CI/CD', 'Ownership do produto em produção'] },
            { type: 'Platform', emoji: '🏗️', color: 'violet', desc: 'Fornece capacidades internas como serviço (IaC, CI/CD templates, observabilidade). Reduz carga cognitiva das stream-aligned teams.', resp: ['Internal Developer Platform (IDP)', 'Golden path templates', 'Gestão de Kubernetes e Terraform'] },
            { type: 'Enabling', emoji: '🔬', color: 'amber', desc: 'Especialistas temporários que ajudam outras equipas a adotar novas tecnologias. Não ficam permanentemente — transferem conhecimento.', resp: ['Workshops e mentoria', 'Proof of concepts', 'Adoção de novas práticas (DevSecOps, SRE)'] },
            { type: 'Complicated Subsystem', emoji: '⚙️', color: 'rose', desc: 'Gere componentes técnicos que requerem expertise muito especializado (ML models, processamento de vídeo, compliance engines).', resp: ['Componentes de alta complexidade', 'APIs internas para outras equipas', 'Documentação e SLAs do componente'] },
          ].map(t => (
            <div key={t.type} className={`p-5 rounded-2xl border ${colorMap[t.color]}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{t.emoji}</span>
                <span className={`text-[14px] font-bold ${colorMap[t.color].split(' ')[0]}`}>{t.type}</span>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed mb-3">{t.desc}</p>
              <ul className="space-y-1">
                {t.resp.map(r => (
                  <li key={r} className="flex items-start gap-2 text-[11px] text-slate-400">
                    <ArrowRight size={10} className={`${colorMap[t.color].split(' ')[0]} mt-0.5 shrink-0`} />{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
