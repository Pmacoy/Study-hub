import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // ── Entra ID / Identity ──
  {
    category: 'Entra ID',
    front: 'Entra ID (Azure AD) — Tenant vs Subscription',
    back: 'Tenant é o diretório de identidade (quem és e quem tem acesso). Subscription é o escopo de faturação e recursos. Um tenant pode ter múltiplas subs; uma subs pertence a um único tenant.',
  },
  {
    category: 'Entra ID',
    front: 'SSPR — Self-Service Password Reset',
    back: 'Permite que utilizadores redefinam palavras-passe sem intervenção da TI. Requer licença Entra ID Premium P1 ou P2. Atenção à "armadilha": muitas questões omitem o requisito de licenciamento.',
  },
  {
    category: 'Entra ID',
    front: 'Groups vs Groups with IAM access',
    back: 'Groups normais agrupam utilizadores para gestão de acesso (RBAC). Groups com acesso IAM permitem que membros gerem recursos de rede (NSGs, firewall). O segundo concede poderes mais elevados.',
  },
  {
    category: 'Entra ID',
    front: 'Conditional Access',
    back: 'Avalia contexto (localização, dispositivo, risco) antes de conceder acesso. Regras como "exigir dispositivo compatível com compliance" ou "bloquear login de países de risco" são típicas de exame.',
  },
  {
    category: 'Entra ID',
    front: 'Managed Identity vs Service Principal',
    back: 'Managed Identity é gerido automaticamente pela Azure — não há chaves para rodar. Service Principal exige gestão explícita de client secrets/certificates. Prefere sempre Managed Identity quando possível.',
  },
  {
    category: 'Entra ID',
    front: 'Privileged Identity Management (PIM)',
    back: 'Gere funções elevadas com acesso Just-in-Time e Just-Enough-Access. Funções como Global Admin podem ser ativadas por tempo limitado com aprovação e MFA obrigatório.',
  },

  // ── Governance & RBAC ──
  {
    category: 'Governance',
    front: 'Azure Policy — o que faz e como?',
    back: 'Aplica regras de conformidade e avalia recursos em escala. Pode Audit, Deny ou Append. Se uma policy denega um recurso, mesmo um Owner não consegue contorná-la por padrão — pegadinha clássica de exame.',
  },
  {
    category: 'Governance',
    front: 'Resource Locks — CanNotDelete vs ReadOnly',
    back: 'CanNotDelete: permite modificar, mas não apagar. ReadOnly: impede ambas as acções. Locks herdam-se: um lock num management group afeta todas as subs e recursos abaixo.',
  },
  {
    category: 'RBAC',
    front: 'Owner vs Contributor',
    back: 'Contributor gere recursos (cria, modifica, apaga) mas NÃO pode atribuir permissões IAM. Owner faz tudo, incluindo gerir acessos. A questão pede quase sempre Contributor para "gerir infra sem dar permissões a outros".',
  },
  {
    category: 'RBAC',
    front: 'Azure RBAC vs Entra Built-in Roles',
    back: 'Azure RBAC controla acesso a recursos Azure (VMs, RGs, subs). Entra roles controlam acesso ao diretório (criar utilizadores, gerir apps). São namespaces separados — não confundir!',
  },
  {
    category: 'RBAC',
    front: 'Escopos de RBAC (em hierarquia)',
    back: 'Management Group > Subscription > Resource Group > Recurso. Permissões aplicam-se em cascata: uma atribuição num management group propaga-se a todas as subs e RGs abaixo.',
  },
  {
    category: 'Governance',
    front: 'Azure Blueprints',
    back: 'Empacota políticas, RBAC, templates ARM/Bicep e parameter files para deploy repeatable de ambientes conformes. Diferente de policy isolada: é um plano completo de governança.',
  },

  // ── Storage ──
  {
    category: 'Storage',
    front: 'Modelos de redundância — LRS, ZRS, GRS, GZRS',
    back: 'LRS: 3 cópias no mesmo datacenter. ZRS: 3 cópias por zona de disponibilidade (protege contra falha de zona). GRS: réplica assíncrona para região secundária. GZRS: combina ZRS + geo. A variante com read-access permite ler no secundário durante DR.',
  },
  {
    category: 'Storage',
    front: 'RA-GRS — o que muda?',
    back: 'Read-Access GRS permite ler (não escrever) dados replicados na região secundária durante failover. Sem o sufixo read-access, a réplica geo é apenas write-only.',
  },
  {
    category: 'Storage',
    front: 'SAS — Shared Access Signature',
    back: 'Delega acesso temporário e restrito a recursos de storage sem expor a chave da conta. Princípios de exame: expiração curta, privilégio mínimo (só leitura quando possível). SAS mal configurada = acesso excessivo.',
  },
  {
    category: 'Storage',
    front: 'Hot vs Cool vs Archive tiers',
    back: 'Hot: acesso frequente, custo armazenamento baixo, acesso alto. Cool: dados menos acessados (30 dias mínimo). Archive: backup de longo prazo, recuperação em horas, custo armazenamento muito baixo. Movimento entre tiers tem custo e latência.',
  },
  {
    category: 'Storage',
    front: 'Storage account — acessibilidade',
    back: 'BlobStorage: optimizado para conteúdo estático (CDN-friendly). GeneralPurpose v2: tudo-terreno, default recomendado. UltraPerformance: IOPS muito elevado para workloads SQL. Escolha errada = custo desnecessário.',
  },

  // ── Compute / VMs ──
  {
    category: 'Compute',
    front: 'Availability Set vs Availability Zone',
    back: 'AvSet protege contra falha de host/rack (fault + update domains). AvZone protege contra falha de datacenter inteiro. Zones oferecem SLA superior (99,99% vs 99,9%). Questão de exame: se fala em "datacenter diferente", a resposta é Zone.',
  },
  {
    category: 'Compute',
    front: 'VM Scale Sets — Scale Out vs Scale Up',
    back: 'Scale Out: adiciona mais instâncias (horizontal). Scale Up: aumenta o tamanho da VM (vertical). Autoscale reage a métricas (CPU, fila). Pergunta clássica: "crescimento imprevisível por métrica" = VMSS com autoscale.',
  },
  {
    category: 'Compute',
    front: 'Spot VMs',
    back: 'VMs com desconto até 90% usando capacidade ociosa do Azure. Podem ser desalojadas com aviso de 30s quando o Azure precisa da capacidade. Ideais para workloads batch, CI runners e testes — nunca para production crítica.',
  },
  {
    category: 'Compute',
    front: 'Proximity Placement Groups',
    back: 'Garante VMs com latência ultra-baixa (<10µs) ao posicioná-las fisicamente próximas no mesmo datacenter. Usado para HPC e aplicações que precisam de communication de milissegundos.',
  },
  {
    category: 'Compute',
    front: 'VM Size Families — o que muda?',
    back: 'General-purpose (D-series): balanceado. Compute-optimized (F-series): alto CPU/RAM. Memory-optimized (E-series): grande RAM. Storage-optimized (L-series): alto I/O. Escolher a família errada = pagar por recursos não usados.',
  },

  // ── Networking ──
  {
    category: 'Networking',
    front: 'VNet Peering — é transitivo?',
    back: 'NÃO. Se A↔B e B↔C estão peered, A e C não comunicam directamente. Para conectar A e C precisa de peering próprio ou Gateway Transit. Esta é uma das "armadilhas" mais frequentes em exame.',
  },
  {
    category: 'Networking',
    front: 'NSG — prioridade de regras',
    back: 'Regras são avaliadas por prioridade (número mais baixo primeiro). Uma regra "Allow" com prioridade 100 pode ser ignorada se houver uma regra "Deny" com prioridade 50. Ordem importa mais que tipo.',
  },
  {
    category: 'Networking',
    front: 'User-Defined Routes (UDR) vs System Routes',
    back: 'System routes são geradas automaticamente pela Azure e têm prioridade mais alta. UDRs sobrepõem-se para redirecionar tráfego (ex: para um virtual appliance de segurança). Se não configurar corretamente, o tráfego pode fazer bounce.',
  },
  {
    category: 'Networking',
    front: 'Azure Front Door vs Application Gateway',
    back: 'Front Door: CDN global, nível L7, WAF, health probes por região. App Gateway: L7 dentro de uma VNet, URL-based routing, SSL termination, integrate com WAF. Front Door protege múltiplas regiões; App Gateway protege uma VNet.',
  },
  {
    category: 'Networking',
    front: 'Private Endpoint vs Service Endpoint',
    back: 'Private Endpoint: porta o serviço para dentro da VNet com IP privado (DNS resolve para IP da VNet). Service Endpoint: mantém o serviço no Azure público mas restringe acesso por policy de rede. Private Endpoint é mais seguro — o tráfego nunca toca a internet pública.',
  },

  // ── Monitoring ──
  {
    category: 'Monitoring',
    front: 'Azure Monitor vs Log Analytics (OMS)',
    back: 'Azure Monitor é o serviço umbrella (colecta + analisa + alertas). Log Analytics é o motor de queries KQL dentro do Workspace. Application Insights é um subserviço do Monitor para apps. Não confundir os três.',
  },
  {
    category: 'Monitoring',
    front: 'Alertas — Active vs Auto Remediation',
    back: 'Active: notificação via email/SMS/push quando o sinal viola a condição. Auto Remediation: acção automática (ex: função App para limpar recursos). Webhook permite integrar com qualquer sistema externo.',
  },
  {
    category: 'Monitoring',
    front: 'Recovery Services Vault — Backup vs Site Recovery',
    back: 'Backup: protecção de dados com retenção (ficheiros, VMs, SQL). Site Recovery (ASR): replicação contínua para failover entre regiões em caso de desastre. Backup ≠ DR. Vault suporta ambos, mas com finalidades diferentes.',
  },
  {
    category: 'Monitoring',
    front: 'Diagnostic Settings — para onde vai a telemetria?',
    back: 'Logs e métricas de diagnóstico podem ser enviados para Log Analytics, Storage (para retenção de longo prazo), Event Hubs (streaming) ou Dashboard. Configurar diagnostic settings é obrigatório para monitorização efectiva.',
  },
];

export const azureFlashcards: Flashcard[] = raw.map((c, i) => ({
  ...c,
  id: `azure-static-${i}`,
  domain: 'azure' as const,
}));
