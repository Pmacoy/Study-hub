import type { Scenario } from '../../types/scenario';

export const azureMultiRegionDrScenario: Scenario = {
  id: 'azure-multiregion-dr-failover',
  domain: 'azure',
  format: 'guided',
  title: 'Arquitetura de Alta Disponibilidade: Failover Multi-Região Azure (Front Door + Cosmos DB)',
  hook: 'A região primária do Azure (East US) sofreu um apagão de infraestrutura. O sistema deve fazer failover automático para West US sem perda de dados (RPO = 0, RTO < 5 min).',
  difficulty: 'senior',
  timeEstimateMin: 20,
  tags: ['azure', 'dr', 'cosmos-db', 'front-door', 'architecture'],

  contextArtifacts: [
    {
      id: 'dr-architecture',
      label: 'Topologia Multi-Região',
      language: 'text',
      content: `Global Load Balancer: Azure Front Door
Primary Region: East US (App Service + Azure SQL Primary)
Secondary Region: West US (App Service Standby + Azure SQL Replica)
Global Database: Azure Cosmos DB (Multi-Master / Strong Consistency)`,
    }
  ],

  progressiveArtifacts: [],

  steps: [
    {
      id: 'step-1',
      prompt: 'Qual nível de consistência do Azure Cosmos DB garante RPO = 0 (Zero Data Loss) em failover multi-região?',
      options: [
        { id: 'a', label: 'Strong (Forte) ou Bounded Staleness', correct: true, feedback: 'Correto! Strong consistency garante que os dados só são considerados cometidos após replicação síncrona em todas as regiões.' },
        { id: 'b', label: 'Eventual Consistency', correct: false, feedback: 'Incorreto. Eventual consistency pode resultar em perda de dados (RPO > 0) durante um failover súbito.' },
        { id: 'c', label: 'Session Consistency', correct: false, feedback: 'Incorreto. Session consistency garante leitura consistente apenas dentro da mesma sessão de cliente.' },
      ]
    },
    {
      id: 'step-2',
      prompt: 'Como o Azure Front Door deteta falha na região primária para redirecionar o tráfego para a secundária?',
      options: [
        { id: 'a', label: 'Health Probes HTTP/HTTPS configurados com intervalos curtos e limite de falhas consecutivos', correct: true, feedback: 'Perfeito! Front Door envia sondas de saúde periódicas e desvia o tráfego automaticamente ao atingir o limiar de falhas.' },
        { id: 'b', label: 'Reiniciando manualmente os servidores DNS', correct: false, feedback: 'Incorreto. DNS TTL alto causaria downtime prolongado.' },
        { id: 'c', label: 'Verificando logs de auditoria do Azure Key Vault', correct: false, feedback: 'Incorreto. Key Vault gere segredos, não tráfego HTTP global.' },
      ]
    },
    {
      id: 'step-3',
      prompt: 'Após o failover para West US, como validar se as aplicações estão a servir tráfego de leitura e escrita com sucesso?',
      options: [
        { id: 'a', label: 'Monitorar métricas do Front Door (Request Count, Backend Health) e Application Insights', correct: true, feedback: 'Correto! Application Insights e Front Door metrics dão visibilidade em tempo real do sucesso do tráfego.' },
        { id: 'b', label: 'Desligar a rede virtual inteira', correct: false, feedback: 'Incorreto. Isso agravaria o incidente.' },
        { id: 'c', label: 'Apagar o grupo de recursos primário', correct: false, feedback: 'Incorreto. Destruiria os dados legados.' },
      ]
    }
  ],

  resolution: {
    rootCause: 'Indisponibilidade física na região East US, mitigada pelo failover automático do Azure Front Door e redirecionamento de réplicas de dados.',
    fix: 'Acionamento automático das políticas de health probe e promoção da réplica do Cosmos DB para Master na região secundária.',
    preventions: [
      'Realizar testes de Chaos Engineering e simulação de DR trimestrais.',
      'Manter quotas de capacidade pré-alocadas na região secundária.'
    ]
  }
};
