/** Traduções em inglês dos módulos Kubernetes e Linux */

export const K8S_EN = {
  resources: {
    Pod: 'Smallest deployable unit. Holds one or more containers sharing a network namespace.',
    Deployment: 'Manages a set of identical Pods with rolling updates, rollback and autoscaling.',
    Service: 'Stable network abstraction for reaching Pods. ClusterIP, NodePort or LoadBalancer.',
    'ConfigMap & Secret': 'ConfigMap for non-sensitive config. Secret for passwords and tokens (base64 encoded).',
  } as Record<string, string>,

  cmdGroups: {
    'Diagnóstico': 'Diagnostics',
    'Deploy': 'Deploy',
    'Debug': 'Debug',
  } as Record<string, string>,

  cmdDescs: {
    'Pods com nó e IP': 'Pods with node and IP',
    'Histórico de versões': 'Revision history',
    'Rollback para versão anterior': 'Roll back to previous revision',
    'Pod temporário para debug': 'Temporary pod for debugging',
  } as Record<string, string>,

  controlPlane: {
    'Gateway de toda a comunicação do cluster. REST API.': 'Gateway for all cluster communication. REST API.',
    'Datastore distribuído — fonte de verdade do estado do cluster.': 'Distributed datastore — source of truth for cluster state.',
    'Agente no node. Garante que os containers estão a correr.': 'Agent on the node. Ensures containers are running.',
    'Mantém as regras de rede (iptables/ipvs) para os Services.': 'Maintains the network rules (iptables/ipvs) for Services.',
  } as Record<string, string>,

  rbac: {
    'Permissões dentro de um namespace': 'Permissions within a namespace',
    'Permissões em todo o cluster': 'Permissions across the whole cluster',
  } as Record<string, string>,

  groups: {
    'Storage': 'Storage',
    'Networking': 'Networking',
    'Workloads': 'Workloads',
    'Configuração': 'Configuration',
  } as Record<string, string>,

  storageItems: {
    'StorageClass (dinâmico)': 'StorageClass (dynamic)',
    'emptyDir (temporário)': 'emptyDir (ephemeral)',
  } as Record<string, string>,
};

export const LINUX_EN = {
  categories: {
    'Ficheiros': 'Files',
    'Processos': 'Processes',
    'Rede': 'Network',
    'Sistema': 'System',
    'Permissões': 'Permissions',
    'Texto': 'Text',
    'DevOps útil': 'Useful for DevOps',
  } as Record<string, string>,

  cmdDescs: {
    'Listar com permissões, tamanho e ocultos': 'List with permissions, size and hidden files',
    'Comprimir directório para tar.gz': 'Compress a directory into tar.gz',
    'Sincronizar directórios remotamente': 'Sync directories to a remote host',
    'Estado do serviço Docker': 'Status of the Docker service',
    'Capturar tráfego na porta 80': 'Capture traffic on port 80',
    'Ler conteúdo': 'Read contents',
    'Escrever/modificar': 'Write / modify',
    'Executar / entrar em directório': 'Execute / enter directory',
  } as Record<string, string>,

  titles: {
    'Backup com Rotação': 'Backup with rotation',
    'Health Check': 'Health check',
  } as Record<string, string>,
};

export const DOCKER_EN = {
  cmdDescs: {
    'Sem cache (força rebuild)': 'No cache (force rebuild)',
    'Logs do serviço app': 'Logs for the app service',
    'Escalar serviço': 'Scale a service',
    'Aceder à base de dados': 'Access the database',
    'Estado dos serviços': 'Service status',
    'Remover tudo não usado': 'Remove everything unused',
    'Remover volumes órfãos': 'Remove orphaned volumes',
    'Redes não usadas': 'Unused networks',
  } as Record<string, string>,
  views: {
    '🐳 Arquitectura': '🐳 Architecture',
    '📦 Dockerfile': '📦 Dockerfile',
    '⌨️ Comandos': '⌨️ Commands',
    '🔧 Compose': '🔧 Compose',
  } as Record<string, string>,
};

export const CICD_EN = {
  stages: {
    'Aprovação': 'Approval',
  } as Record<string, string>,
  items: {
    'SonarQube análise': 'SonarQube analysis',
    'Quality Gate (falha se < threshold)': 'Quality Gate (fails below threshold)',
    'Deploy em ambiente efémero': 'Deploy to an ephemeral environment',
    'Destroy ambiente': 'Destroy the environment',
    'Smoke tests automáticos': 'Automated smoke tests',
    'Notificação equipa': 'Notify the team',
    '2 reviewers obrigatórios': '2 mandatory reviewers',
    'Canary 5% → métricas → 100%': 'Canary 5% → metrics → 100%',
    'Rollback automático (error rate)': 'Automatic rollback (error rate)',
    'Health checks pós-deploy': 'Post-deploy health checks',
    'Notificação stakeholders': 'Notify stakeholders',
    'Tag com commit SHA': 'Tag with commit SHA',
    'Push para registry': 'Push to registry',
    'CI: merge + build + test automáticos em cada commit': 'CI: automatic merge, build and test on every commit',
    'Continuous Delivery: código sempre deployável, deploy manual': 'Continuous Delivery: always deployable, manual deploy',
    'Continuous Deployment: deploy automático para produção': 'Continuous Deployment: automatic deploy to production',
    'O nível 3 requer testes muito sólidos e feature flags': 'Level 3 requires very solid tests and feature flags',
  } as Record<string, string>,
  titles: {
    'CI vs CD vs CD': 'CI vs CD vs CD',
  } as Record<string, string>,
};

export const PLATFORM_EN = {
  views: {
    '🎯 O que é um IDP?': '🎯 What is an IDP?',
    '🧩 Componentes': '🧩 Components',
    '🛣️ O que são Golden Paths?': '🛣️ What are Golden Paths?',
    '🚪 Escape hatches': '🚪 Escape hatches',
    '📊 Métricas DORA': '📊 DORA metrics',
    '🧠 Cognitive load': '🧠 Cognitive load',
    '🏗️ Team Topologies': '🏗️ Team Topologies',
    '📈 SPACE': '📈 SPACE',
    '🔎 Conceitos': '🔎 Concepts',
    '📐 Métricas': '📐 Metrics',
    '🚨 Alertas': '🚨 Alerts',
    '📊 Dashboards': '📊 Dashboards',
  } as Record<string, string>,

  descs: {
    'Complexidade natural do problema — algoritmos, domínio de negócio':
      'Natural complexity of the problem — algorithms, business domain',
    'Complexidade acidental — tooling, YAML, ambientes, CI/CD, permissões':
      'Accidental complexity — tooling, YAML, environments, CI/CD, permissions',
    'Satisfação do dev com ferramentas e processos':
      'Developer satisfaction with tools and processes',
    'Impacto do trabalho no negócio': 'Business impact of the work',
    'Volume de acções (com cuidado — não é produtividade)':
      'Volume of activity (careful — this is not productivity)',
    'Interface única onde o dev vê o que existe, o que é dele, o que pode fazer. Backstage é o standard.':
      'A single interface where developers see what exists, what is theirs, and what they can do. Backstage is the standard.',
    'Registo de todos os serviços, bibliotecas, APIs e recursos da organização — com dono, docs e SLOs.':
      'A registry of every service, library, API and resource in the organisation — with owner, docs and SLOs.',
    'CPU % por container nos últimos 5 minutos': 'CPU % per container over the last 5 minutes',
    '% de memória usada vs limite definido': '% memory used vs the configured limit',
    'Latência no percentil 95 (últimos 10 min)': 'P95 latency (last 10 minutes)',
    'Restarts de containers na última hora': 'Container restarts in the last hour',
    'Nós com menos de 20% de disco livre': 'Nodes with less than 20% free disk',
  } as Record<string, string>,
};

export const MISC_EN = {
  views: {
    '⚡ Projecto Cross-Cloud': '⚡ Cross-Cloud Project',
    '🐳 Container — Trivy': '🐳 Container — Trivy',
    '📦 Módulos': '📦 Modules',
    '⭐ Boas Práticas': '⭐ Best Practices',
  } as Record<string, string>,
  titles: {
    'Módulos': 'Modules',
    'Boas Práticas': 'Best Practices',
  } as Record<string, string>,
  descs: {
    'Ficheiros no disco, modificados mas não rastreados': 'Files on disk, modified but untracked',
    'Histórico local de commits, não enviado ao remote': 'Local commit history, not yet pushed',
    'Correcção de bug': 'Bug fix',
    'Documentação': 'Documentation',
    'Refactoring sem mudança funcional': 'Refactoring with no functional change',
    'Adição ou correcção de testes': 'Adding or fixing tests',
    'Formatar todo o código HCL': 'Format all HCL code',
    'Apply com variáveis de ficheiro': 'Apply with a variables file',
    'Detecção de credenciais expostas': 'Detection of exposed credentials',
  } as Record<string, string>,
};

/** Tradução genérica por lookup, com fallback para o original */
export function tr(map: Record<string, string>, value: string, lang: 'pt' | 'en'): string {
  if (lang === 'pt') return value;
  return map[value] ?? value;
}
