import type { AzureTab } from '../../types/azure';
import type { DomainPack } from '../../types/knowledge';

export const knowledgeData: Partial<Record<AzureTab, DomainPack>> = {
  identity: {
    title: 'Identidade e diretório',
    subtitle: 'Microsoft Entra ID, autenticação e gestão de identidades.',
    examFocus:
      'Cai muito quando a pergunta mistura tenant, autenticação, grupos, dispositivos e self-service.',
    items: [
      {
        icon: 'fingerprint',
        title: 'Entra ID (Azure AD)',
        desc: 'Serviço de identidade na nuvem que gere utilizadores, grupos, aplicações e dispositivos.',
        tip: 'Tenant é o diretório de identidade; subscription é o escopo de faturação e recursos.',
        trap: 'Muitos candidatos confundem tenant com subscription. São conceitos relacionados, mas diferentes.',
        keywords: ['Tenant', 'Diretório', 'Identidade', 'Grupos'],
        priority: 'alta',
        difficulty: 'fácil',
        docLink: 'https://learn.microsoft.com/pt-br/entra/fundamentals/whatis',
      },
      {
        icon: 'lock',
        title: 'SSPR',
        desc: 'Permite redefinição de palavra-passe sem intervenção direta da equipa de TI.',
        tip: 'SSPR aparece muito em cenários de autonomia do utilizador e redução de carga operacional.',
        trap: 'A questão pode esconder o requisito de licenciamento Premium P1 ou P2.',
        keywords: ['SSPR', 'Password Reset', 'P1', 'P2'],
        priority: 'média',
        difficulty: 'média',
        docLink:
          'https://learn.microsoft.com/pt-br/entra/identity/authentication/concept-sspr-howitworks',
      },
    ],
  },

  governance: {
    title: 'Governança',
    subtitle: 'Policy, compliance e proteção administrativa.',
    examFocus:
      'Cai muito quando a questão fala em impedir, auditar, remediar ou bloquear alterações.',
    items: [
      {
        icon: 'scale',
        title: 'Azure Policy',
        desc: 'Aplica regras e avalia conformidade de recursos em escala.',
        tip: 'Policy responde ao “o que pode ou deve existir”; RBAC responde ao “quem pode fazer”.',
        trap: 'Se uma policy nega um recurso, ser Owner não contorna a policy por padrão.',
        keywords: ['Compliance', 'Deny', 'Audit', 'Governance'],
        priority: 'alta',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/pt-br/azure/governance/policy/overview',
      },
      {
        icon: 'lock',
        title: 'Resource Locks',
        desc: 'Evita exclusão ou modificação acidental com locks como CanNotDelete e ReadOnly.',
        tip: 'ReadOnly é o lock mais restritivo no uso comum.',
        trap: 'Um lock num escopo superior afeta recursos em escopos inferiores.',
        keywords: ['ReadOnly', 'CanNotDelete', 'Proteção', 'Escopo'],
        priority: 'alta',
        difficulty: 'média',
        docLink:
          'https://learn.microsoft.com/pt-br/azure/azure-resource-manager/management/lock-resources',
      },
    ],
  },

  rbac: {
    title: 'Controlo de acesso',
    subtitle: 'Permissões, scopes e funções no Azure.',
    examFocus:
      'Cai quando a questão fala em delegar acessos mínimos, escopos e funções embutidas.',
    items: [
      {
        icon: 'shield-check',
        title: 'Azure RBAC',
        desc: 'Fornece controlo de acesso detalhado sobre recursos Azure com base em funções e escopo.',
        tip: 'As permissões são atribuídas em scopes como management group, subscription, resource group ou recurso.',
        trap: 'Não confundas Azure RBAC com Entra roles; um atua nos recursos Azure, o outro no diretório.',
        keywords: ['Escopo', 'Role Assignment', 'Least Privilege', 'Authorization'],
        priority: 'alta',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/pt-br/azure/role-based-access-control/overview',
      },
      {
        icon: 'book-open',
        title: 'Owner vs Contributor',
        desc: 'São duas funções comuns, mas com diferença crítica no controlo de acessos.',
        tip: 'Contributor gere recursos, mas não concede acesso IAM como o Owner.',
        trap: 'A prova adora perguntas em que o utilizador consegue gerir a infraestrutura mas não consegue atribuir permissões.',
        keywords: ['Owner', 'Contributor', 'IAM', 'Built-in roles'],
        priority: 'alta',
        difficulty: 'fácil',
        docLink:
          'https://learn.microsoft.com/pt-br/azure/role-based-access-control/built-in-roles',
      },
    ],
  },

  storage: {
    title: 'Armazenamento',
    subtitle: 'Redundância, acesso seguro e resiliência de dados.',
    examFocus:
      'Cai muito em comparação de redundância, SAS, durabilidade e leitura no secundário.',
    items: [
      {
        icon: 'database',
        title: 'Redundância',
        desc: 'Modelos como LRS, ZRS, GRS, GZRS e variantes com read-access definem disponibilidade e DR.',
        tip: 'RA-GRS adiciona leitura no secundário; ZRS protege por zonas; GZRS combina zonas e geo.',
        trap: 'Máxima proteção não significa automaticamente leitura no secundário; isso depende da variante read-access.',
        keywords: ['LRS', 'ZRS', 'GRS', 'GZRS'],
        priority: 'alta',
        difficulty: 'alta',
        docLink: 'https://learn.microsoft.com/pt-br/azure/storage/common/storage-redundancy',
      },
      {
        icon: 'shield-check',
        title: 'SAS',
        desc: 'Shared Access Signature delega acesso temporário e restrito sem expor a chave da conta.',
        tip: 'Expiração curta e privilégio mínimo são quase sempre a melhor leitura de prova.',
        trap: 'SAS mal configurada pode virar acesso excessivo e inseguro.',
        keywords: ['SAS', 'Delegação', 'Expiry', 'Least privilege'],
        priority: 'média',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/pt-br/azure/storage/common/storage-sas-overview',
      },
    ],
  },

  compute: {
    title: 'Computação',
    subtitle: 'VMs, escala e alta disponibilidade.',
    examFocus: 'Cai muito em SLA, fault domains, availability zones e scale sets.',
    items: [
      {
        icon: 'cpu',
        title: 'Availability Sets vs Zones',
        desc: 'Sets distribuem VMs por fault/update domains; Zones distribuem entre datacenters físicos distintos.',
        tip: 'Availability Zones entregam maior nível de resiliência entre as duas opções.',
        trap: 'A questão pode parecer sobre alta disponibilidade, mas o detalhe que decide é falha de host versus falha de datacenter.',
        keywords: ['SLA', 'Fault Domain', 'Update Domain', 'Zone'],
        priority: 'alta',
        difficulty: 'alta',
        docLink: 'https://learn.microsoft.com/pt-br/azure/virtual-machines/availability',
      },
      {
        icon: 'activity',
        title: 'VM Scale Sets',
        desc: 'Permitem gerir várias VMs idênticas com escalonamento horizontal.',
        tip: 'Se a questão pede scale out automático por métrica, VMSS entra logo no radar.',
        trap: 'Scale out é adicionar instâncias; scale up é aumentar o tamanho da VM.',
        keywords: ['VMSS', 'Scale out', 'Autoscale', 'Cluster'],
        priority: 'alta',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/pt-br/azure/virtual-machine-scale-sets/overview',
      },
    ],
  },

  containers: {
    title: 'Containers e PaaS',
    subtitle: 'ACI, AKS, App Service e decisões arquiteturais.',
    examFocus: 'Cai quando a questão pede rapidez, orquestração ou app web gerida.',
    items: [
      {
        icon: 'book-open',
        title: 'ACI vs AKS vs App Service',
        desc: 'ACI serve containers isolados, AKS cobre Kubernetes e App Service foca apps web geridas.',
        tip: 'Pergunta simples e rápida com container isolado costuma apontar para ACI.',
        trap: 'Nem todo cenário com container significa AKS; às vezes a resposta correta é App Service com custom container.',
        keywords: ['ACI', 'AKS', 'App Service', 'Containers'],
        priority: 'alta',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview',
      },
      {
        icon: 'activity',
        title: 'Deployment Slots',
        desc: 'Permitem staging e swap seguro de versões em App Service.',
        tip: 'Quando a questão falar em blue/green ou staging, lembra-te dos slots.',
        trap: 'Deployment slots não fazem parte de todos os tiers mais baixos.',
        keywords: ['Slots', 'Swap', 'Staging', 'Blue/green'],
        priority: 'média',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots',
      },
    ],
  },

  vnet: {
    title: 'Rede virtual',
    subtitle: 'Peering, segurança e conectividade.',
    examFocus: 'Cai muito com NSG, peering, routing e troubleshooting de acesso.',
    items: [
      {
        icon: 'network',
        title: 'VNet Peering',
        desc: 'Liga VNets pela rede privada da Microsoft com baixa latência.',
        tip: 'Peering é ótimo para comunicação privada entre VNets sem gateway adicional em muitos cenários.',
        trap: 'Peering não é transitivo; esse detalhe costuma eliminar respostas erradas.',
        keywords: ['Peering', 'Privado', 'Low latency', 'Non-transitive'],
        priority: 'alta',
        difficulty: 'média',
        docLink:
          'https://learn.microsoft.com/pt-br/azure/virtual-network/virtual-network-peering-overview',
      },
      {
        icon: 'shield-check',
        title: 'NSG',
        desc: 'Filtra tráfego de rede em camada 4 para subnets ou NICs.',
        tip: 'A prioridade menor vence; isso é muito cobrado em troubleshooting.',
        trap: 'Uma regra “Allow” com prioridade pior pode nunca ser aplicada se uma regra anterior já negar.',
        keywords: ['NSG', 'Priority', 'Inbound', 'Outbound'],
        priority: 'alta',
        difficulty: 'média',
        docLink:
          'https://learn.microsoft.com/pt-br/azure/virtual-network/network-security-groups-overview',
      },
    ],
  },

  monitor: {
    title: 'Monitorização',
    subtitle: 'Logs, métricas, alertas e proteção de dados.',
    examFocus:
      'Cai muito quando a questão pede recolher, analisar e agir sobre telemetria ou DR/backup.',
    items: [
      {
        icon: 'activity',
        title: 'Azure Monitor & Log Analytics',
        desc: 'Recolhe, analisa e ajuda a agir sobre métricas, logs e sinais operacionais.',
        tip: 'Azure Monitor é “collect + analyze + act”; Log Analytics entra nas queries com KQL.',
        trap: 'A prova mistura facilmente métricas, logs, alertas e Application Insights para te confundir.',
        keywords: ['Metrics', 'Logs', 'KQL', 'Alerts'],
        priority: 'alta',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/pt-br/azure/azure-monitor/overview',
      },
      {
        icon: 'database',
        title: 'Recovery Services Vault',
        desc: 'Suporta Azure Backup e Azure Site Recovery para proteção e continuidade.',
        tip: 'Backup é retenção; Site Recovery é failover e continuidade operacional.',
        trap: 'Backup e DR não são sinónimos. Essa é uma das pegadinhas mais clássicas.',
        keywords: ['Backup', 'ASR', 'Vault', 'Failover'],
        priority: 'alta',
        difficulty: 'média',
        docLink: 'https://learn.microsoft.com/pt-br/azure/backup/backup-overview',
      },
    ],
  },
};