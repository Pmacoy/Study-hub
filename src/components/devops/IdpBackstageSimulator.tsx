import { useState } from 'react';
import {
  Copy,
  Check,
  Blocks,
  Users,
  Package,
  FileText,
  GitBranch,
  Search,
  Target,
  Puzzle,
  Building2,
  List,
  Layers,
  Terminal,
  Activity,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  Server,
  Workflow
} from 'lucide-react';

function CodeBlock({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-400 text-[11px]">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span className="text-[11px]">{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-[#181926] text-slate-300 text-[11px]">
        {code.split('\n').map((line, i) => (
          <div
            key={i}
            className={
              line.trim().startsWith('#') || line.trim().startsWith('//')
                ? 'text-slate-600'
                : /^(apiVersion|kind|metadata|spec|type|owner|lifecycle|system|domain):/.test(line.trim())
                ? 'text-violet-400 font-semibold'
                : line.includes('github.com') || line.includes('http')
                ? 'text-sky-300'
                : 'text-slate-300'
            }
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}

// Mock Software Catalog Data
interface CatalogEntity {
  id: string;
  name: string;
  kind: 'Component' | 'API' | 'Resource' | 'System' | 'Domain';
  type: string;
  lifecycle: 'production' | 'experimental' | 'deprecated';
  owner: string;
  system: string;
  domain: string;
  description: string;
  tags: string[];
  techDocs: boolean;
  argoStatus: 'Synced' | 'Progressing' | 'Degraded';
  slo: string;
  openAlerts: number;
  apis: string[];
  dependencies: string[];
}

const CATALOG_ENTITIES: CatalogEntity[] = [
  {
    id: 'payment-service',
    name: 'payment-service',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'team-payments',
    system: 'billing-platform',
    domain: 'Fintech Core',
    description: 'Processa transações com cartões, MB WAY, SEPA e gateways Stripe/Adyen.',
    tags: ['typescript', 'payments', 'pci-dss', 'tier-1'],
    techDocs: true,
    argoStatus: 'Synced',
    slo: '99.99%',
    openAlerts: 0,
    apis: ['payment-api-v2', 'refunds-api-v1'],
    dependencies: ['postgres-payment-db', 'notification-service', 'fraud-detector-api'],
  },
  {
    id: 'auth-service',
    name: 'auth-service',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'team-security',
    system: 'identity-management',
    domain: 'Security & IAM',
    description: 'Emissão e validação de tokens JWT, integração OAuth2/OIDC e MFA.',
    tags: ['go', 'oauth2', 'security', 'tier-1'],
    techDocs: true,
    argoStatus: 'Synced',
    slo: '99.99%',
    openAlerts: 0,
    apis: ['auth-token-api', 'user-profile-api'],
    dependencies: ['redis-sessions-cluster', 'postgres-users-db'],
  },
  {
    id: 'order-processor',
    name: 'order-processor',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'team-checkout',
    system: 'ecommerce-engine',
    domain: 'Commerce',
    description: 'Motor de orquestração de pedidos, cálculo de taxas e stock allocation.',
    tags: ['kotlin', 'kafka', 'ecommerce', 'tier-2'],
    techDocs: true,
    argoStatus: 'Synced',
    slo: '99.95%',
    openAlerts: 1,
    apis: ['orders-api-v3'],
    dependencies: ['payment-service', 'inventory-service', 'kafka-orders-topic'],
  },
  {
    id: 'ai-recommendation-engine',
    name: 'ai-recommendation-engine',
    kind: 'Component',
    type: 'service',
    lifecycle: 'experimental',
    owner: 'team-data-ml',
    system: 'search-and-discovery',
    domain: 'Data & AI',
    description: 'Modelos de embeddings para sugestão personalizada de produtos em tempo real.',
    tags: ['python', 'fastapi', 'pytorch', 'gpu'],
    techDocs: false,
    argoStatus: 'Progressing',
    slo: '99.00%',
    openAlerts: 0,
    apis: ['recommendations-grpc-v1'],
    dependencies: ['redis-feature-store', 'qdrant-vector-db'],
  },
  {
    id: 'legacy-invoice-exporter',
    name: 'legacy-invoice-exporter',
    kind: 'Component',
    type: 'service',
    lifecycle: 'deprecated',
    owner: 'team-payments',
    system: 'billing-platform',
    domain: 'Fintech Core',
    description: 'Geração batch de PDFs fiscais (em migração para o novo microserviço).',
    tags: ['java-8', 'legacy', 'deprecated'],
    techDocs: true,
    argoStatus: 'Synced',
    slo: '98.50%',
    openAlerts: 2,
    apis: ['invoice-export-v1'],
    dependencies: ['mysql-legacy-db'],
  },
  {
    id: 'payment-api-v2',
    name: 'payment-api-v2',
    kind: 'API',
    type: 'openapi',
    lifecycle: 'production',
    owner: 'team-payments',
    system: 'billing-platform',
    domain: 'Fintech Core',
    description: 'Especificação OpenAPI 3.1 para iniciação e liquidação de pagamentos.',
    tags: ['rest', 'openapi', 'v2'],
    techDocs: true,
    argoStatus: 'Synced',
    slo: '99.99%',
    openAlerts: 0,
    apis: [],
    dependencies: ['payment-service'],
  },
  {
    id: 'postgres-payment-db',
    name: 'postgres-payment-db',
    kind: 'Resource',
    type: 'database',
    lifecycle: 'production',
    owner: 'team-platform-dbs',
    system: 'billing-platform',
    domain: 'Fintech Core',
    description: 'Cluster Aurora PostgreSQL multi-AZ com encriptação KMS e auto-failover.',
    tags: ['aws-rds', 'postgres', 'encrypted'],
    techDocs: true,
    argoStatus: 'Synced',
    slo: '99.999%',
    openAlerts: 0,
    apis: [],
    dependencies: [],
  },
];

const BACKSTAGE_PLUGINS = [
  {
    name: 'ArgoCD / GitOps',
    category: 'Deployment',
    icon: GitBranch,
    color: 'emerald',
    desc: 'Visualiza o estado de sincronização (Sync / OutOfSync) e integridade dos Pods Kubernetes no cluster de produção diretamente na página do serviço.',
    codeSample: 'argocd/app-name: payment-service-prod',
  },
  {
    name: 'Grafana & Prometheus',
    category: 'Observability',
    icon: Activity,
    color: 'amber',
    desc: 'Embarca dashboards com métricas de RED (Rate, Errors, Duration), consumo de CPU/Memória e latência p99 sem sair do portal do developer.',
    codeSample: 'grafana/dashboard-selector: "service=payment-service"',
  },
  {
    name: 'PagerDuty / Opsgenie',
    category: 'Incident Management',
    icon: AlertTriangle,
    color: 'rose',
    desc: 'Mostra quem é o engenheiro On-Call atual da equipa proprietária, histórico de incidentes recentes e botão direto para disparar alerta de emergência.',
    codeSample: 'pagerduty.com/integration-key: pd-svc-849204',
  },
  {
    name: 'SonarQube & Snyk',
    category: 'Security & Quality',
    icon: ShieldCheck,
    color: 'sky',
    desc: 'Quality Gate status, cobertura de testes unitários (Line coverage > 80%), contagem de vulnerabilidades e dívida técnica detetada no PR.',
    codeSample: 'sonarqube.org/project-key: acme_payment-service',
  },
  {
    name: 'Cost Insights (FinOps)',
    category: 'FinOps & Cloud Cost',
    icon: Target,
    color: 'violet',
    desc: 'Calcula o custo mensal em AWS/Azure/GCP atribuído a este serviço específico e exibe recomendações automáticas de rightsizing.',
    codeSample: 'cloud.google.com/project-id: acme-prod-billing',
  },
  {
    name: 'TechDocs (Docs as Code)',
    category: 'Documentation',
    icon: FileText,
    color: 'emerald',
    desc: 'Compila Markdown armazenado no próprio repositório Git (MkDocs) e renderiza documentação técnica unificada e pesquisável globalmente.',
    codeSample: 'backstage.io/techdocs-ref: dir:.',
  },
];

const QUIZ_QUESTIONS = [
  {
    q: 'Qual é o principal objetivo de um Internal Developer Platform (IDP)?',
    options: [
      'Substituir completamente a necessidade de ter engenheiros de DevOps e SRE na empresa.',
      'Fornecer capacidades "Self-Service as a Product" com Golden Paths para reduzir a carga cognitiva dos developers.',
      'Obrigar todos os developers a programarem usando comandos manuais kubectl no cluster.',
      'Monitorizar a produtividade dos programadores através do número diário de commits.',
    ],
    correct: 1,
    explanation:
      'O IDP existe para criar abstrações self-service sobre a infraestrutura complexa (Kubernetes, Cloud, IAM, CI/CD), reduzindo a complexidade acidental (Extraneous Cognitive Load) sem retirar a autonomia das equipas.',
  },
  {
    q: 'No Spotify Backstage, para que serve o ficheiro `catalog-info.yaml`?',
    options: [
      'É o ficheiro de configuração do Nginx para expor o website à internet.',
      'É o manifesto declarativo que regista e descreve uma entidade (Component, API, Resource) no Software Catalog.',
      'É o script de compilação Docker que roda dentro do cluster de Kubernetes.',
      'É a chave privada SSH usada para ligar aos servidores da empresa.',
    ],
    correct: 1,
    explanation:
      'O `catalog-info.yaml` é o coração do modelo de dados do Backstage. Ele vive no repositório de cada serviço e define metadata como tipo, lifecycle, equipa dona, APIs expostas, dependências e anotações para plugins.',
  },
  {
    q: 'Qual a diferença entre uma entidade do tipo `Component` e uma do tipo `System` no Backstage?',
    options: [
      '`Component` é a unidade de software individual (microserviço, web app); `System` agrupa múltiplos components e recursos que realizam uma função de negócio conjunta.',
      '`Component` é usado apenas para bases de dados; `System` é usado apenas para código TypeScript.',
      '`System` é obrigatório para cada repositório Git, enquanto `Component` é reservado para máquinas virtuais.',
      'Não existe diferença, são sinónimos intercambiáveis no ecossistema CNCF.',
    ],
    correct: 0,
    explanation:
      'Na hierarquia do Backstage: Domain (ex: Fintech) contém Systems (ex: Billing Platform), que por sua vez agregam Components (ex: payment-service, invoice-generator) e Resources (ex: aurora-postgres-db).',
  },
  {
    q: 'Como funciona o TechDocs no Spotify Backstage seguindo o paradigma "Docs-like-Code"?',
    options: [
      'Os engenheiros escrevem documentação manual no Microsoft Word e fazem upload para um servidor FTP.',
      'A documentação é escrita em Markdown dentro da pasta `/docs` do próprio repositório Git e compilada via MkDocs/CI.',
      'Apenas o gestor de projeto pode escrever documentos usando um portal fechado.',
      'O Backstage gera automaticamente toda a documentação via scraping de comentários sem intervenção humana.',
    ],
    correct: 1,
    explanation:
      'TechDocs segue "Docs as Code": o Markdown vive no mesmo repositório do código fonte (`/docs/`), é versionado por Git, revisto em Pull Requests e compilado para HTML estático pelo pipeline ou pelo Backstage.',
  },
];

export default function IdpBackstageSimulator() {
  const [section, setSection] = useState<'what' | 'catalog' | 'plugins' | 'validator' | 'quiz'>('what');
  const [openBenefit, setOpenBenefit] = useState<string | null>(null);

  // Catalog Explorer States
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilterKind, setCatalogFilterKind] = useState<string>('all');
  const [catalogFilterLifecycle, setCatalogFilterLifecycle] = useState<string>('all');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('payment-service');

  // Validator States
  const [customYaml, setCustomYaml] = useState<string>(`apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: order-analytics-service
  description: Serviço de streaming de eventos e métricas de conversão de checkout
  annotations:
    github.com/project-slug: acme-corp/order-analytics
    backstage.io/techdocs-ref: dir:.
    argocd/app-name: order-analytics-prod
    grafana/dashboard-selector: "service=order-analytics"
    pagerduty.com/integration-key: pd-analytics-9912
  tags:
    - python
    - kafka
    - telemetry
    - tier-2
spec:
  type: service
  lifecycle: production
  owner: team-data-ml
  system: ecommerce-engine
  providesApis:
    - analytics-stream-v1
  dependsOn:
    - resource:kafka-orders-topic
    - component:order-processor`);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const views = [
    { id: 'what' as const, label: 'O que é um IDP?', icon: Target },
    { id: 'catalog' as const, label: 'Software Catalog Explorer', icon: List },
    { id: 'plugins' as const, label: 'Plugins & TechDocs', icon: Puzzle },
    { id: 'validator' as const, label: 'YAML Validator & Lab', icon: Terminal },
    { id: 'quiz' as const, label: 'Knowledge Check', icon: HelpCircle },
  ];

  // Filter entities
  const filteredEntities = CATALOG_ENTITIES.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      entity.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      entity.owner.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      entity.tags.some((t) => t.toLowerCase().includes(catalogSearch.toLowerCase()));

    const matchesKind = catalogFilterKind === 'all' || entity.kind === catalogFilterKind;
    const matchesLifecycle = catalogFilterLifecycle === 'all' || entity.lifecycle === catalogFilterLifecycle;

    return matchesSearch && matchesKind && matchesLifecycle;
  });

  const selectedEntity = CATALOG_ENTITIES.find((e) => e.id === selectedEntityId) || CATALOG_ENTITIES[0];

  // Simple YAML validation for the lab
  const parseValidation = () => {
    const lines = customYaml.split('\n');
    const errors: string[] = [];
    const fields: Record<string, string> = {};

    let hasKind = false;
    let hasName = false;
    let hasOwner = false;
    let hasType = false;
    let hasLifecycle = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('kind:')) {
        hasKind = true;
        fields.kind = trimmed.replace('kind:', '').trim();
      }
      if (trimmed.startsWith('name:')) {
        hasName = true;
        fields.name = trimmed.replace('name:', '').trim();
      }
      if (trimmed.startsWith('owner:')) {
        hasOwner = true;
        fields.owner = trimmed.replace('owner:', '').trim();
      }
      if (trimmed.startsWith('type:')) {
        hasType = true;
        fields.type = trimmed.replace('type:', '').trim();
      }
      if (trimmed.startsWith('lifecycle:')) {
        hasLifecycle = true;
        fields.lifecycle = trimmed.replace('lifecycle:', '').trim();
      }
    });

    if (!hasKind) errors.push('Falta o campo obrigatório `kind:` (ex: Component, API, Resource)');
    if (!hasName) errors.push('Falta o campo obrigatório `metadata.name:`');
    if (!hasOwner) errors.push('Falta o campo obrigatório `spec.owner:` (equipa responsável)');
    if (!hasType) errors.push('Falta o campo obrigatório `spec.type:` (ex: service, website, library)');
    if (!hasLifecycle) errors.push('Falta o campo obrigatório `spec.lifecycle:` (production, experimental, deprecated)');

    return { isValid: errors.length === 0, errors, fields };
  };

  const validationResult = parseValidation();

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-slate-900 p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 shrink-0">
              <Blocks size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white font-display">
                  Internal Developer Platform (IDP) & Backstage
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                  Platform Eng · Fase 4
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Aprende a construir uma plataforma de engenharia moderna que transforma infraestrutura complexa em
                capacidades self-service orientadas a produto, alinhando Spotify Backstage, GitOps e Service Catalog.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = section === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setSection(v.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'border-violet-500/60 bg-violet-500/20 text-violet-200 shadow-sm shadow-violet-500/20'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-violet-400' : 'text-slate-500'} />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SECTION 1: WHAT IS AN IDP ──────────────────────────────── */}
      {section === 'what' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 shrink-0">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-violet-300 font-display">
                  O que é uma Internal Developer Platform?
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Uma <strong className="text-white">Internal Developer Platform (IDP)</strong> é a camada de produto
                  construída por uma <em>Platform Team</em> que agrega todas as ferramentas, APIs, infraestrutura e
                  pipelines de uma organização num plano de controlo e portal centralizado. Ela disponibiliza{' '}
                  <strong className="text-violet-300">Golden Paths (caminhos pavimentados)</strong> para que qualquer
                  developer possa criar, testar, implantar e operar serviços de forma 100% autónoma (Self-Service).
                </p>
              </div>
            </div>
          </div>

          {/* Side by side: Without IDP vs With IDP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 font-mono">
                  Sem IDP (Silos & Tickets)
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  'Developer abre ticket Jira para pedir base de dados e espera 3 dias.',
                  'Copia e cola manifestos YAML de Kubernetes desatualizados de outro projeto.',
                  'Cada equipa inventa o seu próprio pipeline de CI/CD sem padrões de segurança.',
                  'Ninguém sabe quem é o dono de um microserviço que está a disparar erros 500.',
                  'Novos developers demoram 3 semanas até conseguirem fazer o primeiro deploy.',
                  'A equipa de infraestrutura vive afogada em tarefas manuais e operacionais repetitivas.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-rose-400 font-bold shrink-0">✗</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
                  Com IDP & Golden Paths (Self-Service)
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  'Novo microserviço provisionado em 90 segundos via Backstage Scaffolder.',
                  'Infraestrutura declarativa (Terraform/Crossplane) gerada com as melhores práticas de segurança.',
                  'Service Catalog unificado: todos os donos, TechDocs, SLOs e alertas visíveis num só ecrã.',
                  'GitOps automatizado com ArgoCD: sincronização contínua entre Git e Kubernetes.',
                  'Novos engenheiros fazem deploy em produção no seu 1º dia de trabalho (Time to First Commit).',
                  'A Platform Team foca em construir produto interno ("Platform as a Product"), não em apagar fogos.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture Layer Diagram */}
          <div className="p-5 rounded-2xl bg-[#181926] border border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-widest text-violet-400 font-mono mb-3">
              Camadas Arquiteturais de uma Plataforma Completa
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-violet-200">
                  <Building2 size={16} className="text-violet-400" />
                  <span>1. Developer Control Plane (Portal / CLI)</span>
                </div>
                <span className="text-2xs font-mono text-violet-300">Spotify Backstage · CLI da Empresa · IDE Plugins</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-sky-200">
                  <Workflow size={16} className="text-sky-400" />
                  <span>2. Integration & Orchestration Layer</span>
                </div>
                <span className="text-2xs font-mono text-sky-300">Backstage Scaffolder · Humanitec · Kratix · GitHub Actions</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-amber-200">
                  <GitBranch size={16} className="text-amber-400" />
                  <span>3. Delivery & GitOps Engine</span>
                </div>
                <span className="text-2xs font-mono text-amber-300">ArgoCD · Flux CD · Helm Charts · Kustomize</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-emerald-200">
                  <Server size={16} className="text-emerald-400" />
                  <span>4. Infrastructure & Resource Plane</span>
                </div>
                <span className="text-2xs font-mono text-emerald-300">Kubernetes (EKS/AKS/GKE) · Terraform · Crossplane · AWS/Azure</span>
              </div>
            </div>
          </div>

          {/* Key Metrics / Industry Highlights */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3 font-mono">
              Impacto no Negócio (State of Platform Engineering)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { k: '50% Menos Carga Cognitiva', v: 'Devs focam na lógica de negócio e reduzem fadiga com YAML de infra.' },
                { k: '4.5× Mais Frequência', v: 'Deploys mais rápidos com pipelines padronizados e testes integrados.' },
                { k: '68% Menos MTTR', v: 'Recuperação rápida de incidentes com catálogo de donos e links de telemetria.' },
                { k: 'Onboarding em Horas', v: 'Time-to-first-commit de novos engenheiros cai de semanas para o 1º dia.' },
              ].map((b) => (
                <div key={b.k} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-bold text-violet-300">{b.k}</div>
                  <div className="text-2xs text-slate-400 mt-1 leading-relaxed">{b.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 2: SOFTWARE CATALOG EXPLORER ───────────────────── */}
      {section === 'catalog' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Pesquisar por nome, descrição, equipa ou tag..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={catalogFilterKind}
                onChange={(e) => setCatalogFilterKind(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="all">Todos os Kinds</option>
                <option value="Component">Component</option>
                <option value="API">API</option>
                <option value="Resource">Resource</option>
              </select>

              <select
                value={catalogFilterLifecycle}
                onChange={(e) => setCatalogFilterLifecycle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="all">Todos os Lifecycles</option>
                <option value="production">Production</option>
                <option value="experimental">Experimental</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Catalog List */}
            <div className="lg:col-span-5 space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredEntities.map((entity) => {
                const isSelected = entity.id === selectedEntityId;
                return (
                  <button
                    key={entity.id}
                    onClick={() => setSelectedEntityId(entity.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-violet-500/60 bg-violet-500/15 shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Package size={14} className={isSelected ? 'text-violet-400' : 'text-slate-400'} />
                        <span className="text-xs font-bold text-white font-mono">{entity.name}</span>
                      </div>
                      <span
                        className={`text-3xs font-bold uppercase px-2 py-0.5 rounded-full border ${
                          entity.lifecycle === 'production'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : entity.lifecycle === 'experimental'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {entity.lifecycle}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{entity.description}</p>
                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-3xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Users size={10} /> {entity.owner}
                      </span>
                      <span className="font-mono text-violet-400">{entity.kind}</span>
                    </div>
                  </button>
                );
              })}

              {filteredEntities.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Nenhuma entidade encontrada com os filtros selecionados.
                </div>
              )}
            </div>

            {/* Selected Entity Detail Pane */}
            <div className="lg:col-span-7 space-y-3">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {selectedEntity.kind} · {selectedEntity.type}
                      </span>
                      <span className="text-2xs font-mono text-slate-400">System: {selectedEntity.system}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-mono mt-1">{selectedEntity.name}</h3>
                    <p className="text-xs text-slate-300 mt-1">{selectedEntity.description}</p>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-3xs font-mono text-slate-500 uppercase block">Owner</span>
                    <span className="text-2xs font-bold text-slate-200 mt-0.5 block">{selectedEntity.owner}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-3xs font-mono text-slate-500 uppercase block">SLO Target</span>
                    <span className="text-2xs font-bold text-emerald-400 mt-0.5 block">{selectedEntity.slo}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-3xs font-mono text-slate-500 uppercase block">GitOps Status</span>
                    <span
                      className={`text-2xs font-bold mt-0.5 block ${
                        selectedEntity.argoStatus === 'Synced'
                          ? 'text-emerald-400'
                          : selectedEntity.argoStatus === 'Progressing'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {selectedEntity.argoStatus}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-3xs font-mono text-slate-500 uppercase block">Alertas Abertos</span>
                    <span
                      className={`text-2xs font-bold mt-0.5 block ${
                        selectedEntity.openAlerts === 0 ? 'text-slate-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedEntity.openAlerts} ativos
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <span className="text-3xs font-mono text-slate-500 uppercase block mb-1.5">Tags & Classification</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-3xs font-mono text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* APIs & Dependencies Graph */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-2">
                      <Radio size={12} />
                      <span>APIs Expostas ({selectedEntity.apis.length})</span>
                    </div>
                    {selectedEntity.apis.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedEntity.apis.map((api) => (
                          <li key={api} className="text-2xs font-mono text-slate-300 flex items-center gap-1">
                            <span className="text-sky-400">→</span> {api}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-2xs text-slate-600 italic">Nenhuma API declarada.</span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
                      <Database size={12} />
                      <span>Dependências ({selectedEntity.dependencies.length})</span>
                    </div>
                    {selectedEntity.dependencies.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedEntity.dependencies.map((dep) => (
                          <li key={dep} className="text-2xs font-mono text-slate-300 flex items-center gap-1">
                            <span className="text-amber-400">↳</span> {dep}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-2xs text-slate-600 italic">Sem dependências externas.</span>
                    )}
                  </div>
                </div>

                {/* Corresponding catalog-info.yaml Preview */}
                <div>
                  <span className="text-3xs font-mono text-slate-400 uppercase block mb-1">
                    Definição `catalog-info.yaml` para esta entidade:
                  </span>
                  <CodeBlock
                    lang="yaml"
                    code={`apiVersion: backstage.io/v1alpha1
kind: ${selectedEntity.kind}
metadata:
  name: ${selectedEntity.name}
  description: ${selectedEntity.description}
  tags:
${selectedEntity.tags.map((t) => `    - ${t}`).join('\n')}
spec:
  type: ${selectedEntity.type}
  lifecycle: ${selectedEntity.lifecycle}
  owner: ${selectedEntity.owner}
  system: ${selectedEntity.system}${
                      selectedEntity.apis.length > 0
                        ? `\n  providesApis:\n${selectedEntity.apis.map((a) => `    - ${a}`).join('\n')}`
                        : ''
                    }${
                      selectedEntity.dependencies.length > 0
                        ? `\n  dependsOn:\n${selectedEntity.dependencies.map((d) => `    - ${d}`).join('\n')}`
                        : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: PLUGINS & TECHDOCS ─────────────────────────── */}
      {section === 'plugins' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            O ecossistema do Spotify Backstage baseia-se numa arquitetura extensível de <strong className="text-white">Plugins</strong>. Ao adicionar anotações (`metadata.annotations`) no ficheiro <code className="text-violet-300">catalog-info.yaml</code>, os plugins ganham vida automaticamente na interface web do serviço:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BACKSTAGE_PLUGINS.map((plugin) => {
              const Icon = plugin.icon;
              return (
                <div
                  key={plugin.name}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300">
                          <Icon size={16} />
                        </div>
                        <h4 className="text-xs font-bold text-white font-display">{plugin.name}</h4>
                      </div>
                      <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {plugin.category}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-400 leading-relaxed mt-2">{plugin.desc}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-3xs font-mono text-slate-500 uppercase block mb-1">Anotação no YAML:</span>
                    <code className="text-3xs font-mono text-violet-300 bg-slate-950 px-2 py-1 rounded block truncate border border-slate-800">
                      {plugin.codeSample}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep dive into TechDocs */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <FileText size={18} />
              <h4 className="text-sm font-bold text-white font-display">
                Como Funciona o TechDocs (Docs-like-Code Engine)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O <strong className="text-emerald-300">TechDocs</strong> elimina o problema clássico de documentação desatualizada no Confluence ao armazenar os ficheiros Markdown dentro do próprio repositório do código fonte (`/docs`). O fluxo de compilação segue 3 passos:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 font-mono block mb-1">Passo 1: Escrever Docs</span>
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Engenheiros escrevem Markdown em <code className="text-slate-300">/docs/index.md</code> e configuram <code className="text-slate-300">mkdocs.yaml</code> junto com o código.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-sky-400 font-mono block mb-1">Passo 2: Build em CI/CD</span>
                <p className="text-2xs text-slate-400 leading-relaxed">
                  No merge da PR, o GitHub Actions executa <code className="text-slate-300">mkdocs build</code> e publica o HTML estático num bucket S3 / Azure Blob Storage.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-violet-400 font-mono block mb-1">Passo 3: Backstage Reader</span>
                <p className="text-2xs text-slate-400 leading-relaxed">
                  O Backstage serve a documentação com pesquisa global instantânea e integração visual no catálogo do serviço.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 4: YAML VALIDATOR & LAB ────────────────────────── */}
      {section === 'validator' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Experimenta e valida manifestos <code className="text-violet-300">catalog-info.yaml</code> em tempo real. Modifica os campos abaixo para testar a validação de regras de governança e integridade do Backstage.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* YAML Editor */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">Editor `catalog-info.yaml`:</span>
                <button
                  onClick={() =>
                    setCustomYaml(`apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: billing-reconciliation-job
  description: Job diário de reconciliação de transações bancárias e conciliação ERP
  annotations:
    github.com/project-slug: acme-corp/billing-reconciliation
    backstage.io/techdocs-ref: dir:.
    argocd/app-name: billing-reconciliation-prod
  tags:
    - golang
    - batch
    - finance
spec:
  type: service
  lifecycle: production
  owner: team-payments
  system: billing-platform
  dependsOn:
    - resource:postgres-payment-db`)
                  }
                  className="text-2xs text-violet-400 hover:text-violet-300 underline font-mono"
                >
                  Carregar Exemplo
                </button>
              </div>
              <textarea
                value={customYaml}
                onChange={(e) => setCustomYaml(e.target.value)}
                rows={16}
                className="w-full p-3.5 bg-[#181926] border border-slate-800 rounded-xl font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-violet-500 transition-colors"
                spellCheck={false}
              />
            </div>

            {/* Live Inspection & Validation */}
            <div className="lg:col-span-5 space-y-3">
              <div
                className={`p-4 rounded-2xl border ${
                  validationResult.isValid
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {validationResult.isValid ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 font-mono">Manifesto Válido para Backstage!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-rose-400" />
                      <span className="text-xs font-bold text-rose-400 font-mono">Erros de Validação Encontrados</span>
                    </>
                  )}
                </div>

                {!validationResult.isValid && (
                  <ul className="space-y-1 text-xs text-rose-300/80 mt-2">
                    {validationResult.errors.map((err, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Parsed Entity Summary */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Entidade Reconhecida pelo Software Catalog:
                </span>
                <div className="space-y-1.5 font-mono text-2xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Kind:</span>
                    <span className="text-violet-300 font-bold">{validationResult.fields.kind || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Nome:</span>
                    <span className="text-slate-200 font-bold">{validationResult.fields.name || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Owner Team:</span>
                    <span className="text-sky-300">{validationResult.fields.owner || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Type:</span>
                    <span className="text-slate-300">{validationResult.fields.type || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Lifecycle:</span>
                    <span className="text-emerald-400">{validationResult.fields.lifecycle || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 5: KNOWLEDGE CHECK QUIZ ────────────────────────── */}
      {section === 'quiz' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Testa os teus Conhecimentos de IDP & Backstage</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Responde às 4 perguntas técnicas baseadas em arquitetura de plataformas reais e CNCF Backstage.
              </p>
            </div>
            {Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length && !showQuizResults && (
              <button
                onClick={() => setShowQuizResults(true)}
                className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                Ver Pontuação Final
              </button>
            )}
          </div>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOption = quizAnswers[qIndex];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = isAnswered && selectedOption === q.correct;

              return (
                <div key={qIndex} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-2xs font-bold text-violet-300">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-relaxed">{q.q}</h4>
                  </div>

                  <div className="space-y-2 pl-7">
                    {q.options.map((opt, optIndex) => {
                      let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-300';
                      if (selectedOption === optIndex) {
                        if (showQuizResults) {
                          btnStyle = optIndex === q.correct
                            ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold'
                            : 'border-rose-500/60 bg-rose-500/15 text-rose-300 font-semibold';
                        } else {
                          btnStyle = 'border-violet-500/60 bg-violet-500/20 text-violet-200 font-semibold';
                        }
                      } else if (showQuizResults && optIndex === q.correct) {
                        btnStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => {
                            setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${btnStyle}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-3xs opacity-60">[{String.fromCharCode(65 + optIndex)}]</span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div
                      className={`ml-7 p-3 rounded-xl text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <strong className="block mb-1">{isCorrect ? '✓ Resposta Correta!' : '✗ Incorreto'}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showQuizResults && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Pontuação:{' '}
                <strong className="text-violet-400">
                  {Object.entries(quizAnswers).filter(([idx, ans]) => ans === QUIZ_QUESTIONS[Number(idx)].correct).length}
                </strong>{' '}
                / {QUIZ_QUESTIONS.length} corretas
              </div>
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setShowQuizResults(false);
                }}
                className="text-xs text-violet-400 hover:text-violet-300 underline font-mono"
              >
                Reiniciar Questionário
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
