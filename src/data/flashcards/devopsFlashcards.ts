import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // Linux
  { category: 'Linux', front: 'chmod 755', back: 'rwxr-xr-x — dono lê/escreve/executa, grupo e outros só lêem e executam. Padrão para scripts.' },
  { category: 'Linux', front: 'chmod 644', back: 'rw-r--r-- — dono lê/escreve, grupo e outros só lêem. Padrão para ficheiros de config.' },
  { category: 'Linux', front: 'systemctl restart nginx', back: 'Reinicia o serviço nginx imediatamente (stop + start).' },
  { category: 'Linux', front: 'journalctl -u docker -f', back: 'Segue os logs do serviço docker em tempo real (-f = follow).' },
  { category: 'Linux', front: 'grep -r "ERROR" /var/log/', back: 'Procura recursivamente a string ERROR em todos os ficheiros dentro de /var/log/.' },
  { category: 'Linux', front: 'umask 022', back: 'Define a máscara default: novos ficheiros 644, novos directórios 755.' },

  // Git
  { category: 'Git', front: 'git rebase vs git merge', back: 'Rebase reescreve o histórico (linear, sem merge commits). Merge preserva o histórico original. Nunca fazer rebase em branches partilhadas!' },
  { category: 'Git', front: 'git rebase -i HEAD~3', back: 'Abre o modo interactivo para reescrever os últimos 3 commits — útil para squash antes de um PR.' },
  { category: 'Git', front: 'Trunk-Based Development', back: 'Todos commitam directamente ou em branches de vida curta (<1 dia) para main. Requer feature flags e CI rápido.' },
  { category: 'Git', front: 'Conventional Commits — feat vs fix', back: 'feat: nova funcionalidade. fix: correcção de bug. Usado para gerar CHANGELOG e versionamento semântico automático.' },
  { category: 'Git', front: 'git reflog', back: 'Mostra todos os commits recentes, incluindo os "perdidos" — usado para recuperar trabalho após um reset mal feito.' },

  // Docker
  { category: 'Docker', front: 'Multi-stage build', back: 'Usa uma imagem com ferramentas de build num stage, e copia só os artefactos para uma imagem final mínima — reduz tamanho e superfície de ataque.' },
  { category: 'Docker', front: 'ENTRYPOINT vs CMD', back: 'ENTRYPOINT define o executável fixo. CMD fornece argumentos default, sobreponíveis em docker run.' },
  { category: 'Docker', front: 'docker system prune -af', back: 'Remove todas as imagens, containers e redes não usadas — útil para libertar espaço em CI runners.' },
  { category: 'Docker', front: 'USER nonroot', back: 'Boa prática: nunca correr containers como root. Reduz o impacto se o container for comprometido.' },
  { category: 'Docker', front: 'HEALTHCHECK', back: 'Instrução no Dockerfile que define como o orchestrator verifica se o container está saudável.' },

  // Kubernetes
  { category: 'Kubernetes', front: 'Liveness vs Readiness Probe', back: 'Liveness: se falha, reinicia o container. Readiness: se falha, remove dos endpoints do Service sem reiniciar.' },
  { category: 'Kubernetes', front: 'kubectl rollout undo deploy/app', back: 'Reverte um Deployment para a versão anterior — rollback imediato.' },
  { category: 'Kubernetes', front: 'ClusterIP vs LoadBalancer', back: 'ClusterIP: só acessível dentro do cluster. LoadBalancer: provisiona um LB externo da cloud automaticamente.' },
  { category: 'Kubernetes', front: 'Role vs ClusterRole (RBAC)', back: 'Role: permissões num namespace. ClusterRole: permissões em todo o cluster ou em recursos cluster-level.' },
  { category: 'Kubernetes', front: 'maxSurge / maxUnavailable', back: 'Controlam o Rolling Update: quantos pods extra criar e quantos podem ficar indisponíveis durante o deploy.' },

  // CI/CD
  { category: 'CI/CD', front: 'Continuous Delivery vs Deployment', back: 'Delivery: sempre deployável, aprovação manual para prod. Deployment: cada commit aprovado vai automaticamente para produção.' },
  { category: 'CI/CD', front: 'OIDC no CI/CD', back: 'Permite ao pipeline obter um token efémero (~15min) do cloud provider via federated identity, sem secrets estáticos.' },
  { category: 'CI/CD', front: 'Quality Gate', back: 'Conjunto de critérios (cobertura, bugs, vulnerabilidades) que bloqueiam o pipeline se não forem cumpridos.' },
  { category: 'CI/CD', front: 'Canary Deployment', back: 'Uma pequena % do tráfego vai para a nova versão; métricas são validadas antes do rollout completo.' },

  // Terraform
  { category: 'Terraform', front: 'terraform plan', back: 'Mostra o diff entre o estado actual e a configuração desejada, sem aplicar nenhuma mudança.' },
  { category: 'Terraform', front: 'Infrastructure Drift', back: 'Quando a infra real diverge do código IaC, normalmente por mudanças manuais fora do Terraform.' },
  { category: 'Terraform', front: 'State remoto com locking', back: 'Azure Blob / S3 com locking previne que dois "apply" em paralelo corrompam o tfstate.' },
  { category: 'Terraform', front: 'templatefile()', back: 'Função que renderiza um ficheiro de template (ex: haproxy.cfg) injectando variáveis HCL.' },

  // Monitoring
  { category: 'Monitoring', front: 'Golden Signals (SRE)', back: 'Latency, Traffic, Errors, Saturation — as quatro métricas base para alertas críticos.' },
  { category: 'Monitoring', front: 'Error Budget', back: '100% - SLO. Quanto a equipa pode "falhar" antes de quebrar o objectivo de disponibilidade.' },
  { category: 'Monitoring', front: 'SLI vs SLO vs SLA', back: 'SLI: métrica medida. SLO: meta interna. SLA: contrato com penalizações para o cliente.' },

  // Security
  { category: 'Security', front: 'Shift-Left Security', back: 'Mover os controlos de segurança para o início do SDLC — mais barato corrigir cedo do que em produção.' },
  { category: 'Security', front: 'SAST vs DAST', back: 'SAST analisa código fonte estaticamente (SonarQube). DAST testa a app em execução (OWASP ZAP).' },
  { category: 'Security', front: 'Policy as Code (OPA)', back: 'Regras de governança (ex: tags obrigatórias) escritas em Rego e validadas automaticamente no terraform plan.' },
];

export const devopsFlashcards: Flashcard[] = raw.map((c, i) => ({
  ...c,
  id: `devops-${i}`,
  domain: 'devops' as const,
}));
