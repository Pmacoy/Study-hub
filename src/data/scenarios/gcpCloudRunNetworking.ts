import type { ChallengeScenario } from '../../types/scenario';

export const gcpCloudRunNetworking: ChallengeScenario = {
  id: 'gcp-cloud-run-networking',
  domain: 'gcp',
  title: 'Cloud Run Não Liga à Base de Dados',
  hook: 'A equipa migrou uma API containerizada de Kubernetes para o Google Cloud Run (Fully Managed) para poupar custos. No entanto, o serviço está a falhar no startup com o erro "Connection timeout ao conectar ao IP 10.128.0.5". Esse é o IP da instância do Cloud SQL (Private IP) na VPC principal.',
  difficulty: 'mid',
  timeEstimateMin: 4,
  tags: ['gcp', 'cloud-run', 'networking', 'vpc', 'serverless'],

  artifacts: [
    {
      id: 'cloud-run-logs',
      label: 'Cloud Logging (Cloud Run)',
      language: 'log',
      content: `2024-05-12T14:32:01Z [INFO] Starting API server v2.1
2024-05-12T14:32:01Z [INFO] Attempting DB connection to 10.128.0.5:5432...
2024-05-12T14:32:31Z [ERROR] psycopg2.OperationalError: connection to server at "10.128.0.5", port 5432 failed: Connection timed out
2024-05-12T14:32:31Z [FATAL] Exiting container due to crash loop`,
    },
    {
      id: 'cloud-run-config',
      label: 'gcloud run services describe',
      language: 'yaml',
      content: `apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: api-backend
  namespace: '555123456789'
spec:
  template:
    spec:
      containers:
      - image: eu.gcr.io/my-project/api-backend:latest
        env:
        - name: DB_HOST
          value: "10.128.0.5"
# Nenhuma configuração de egress ou VPC listada`,
    },
    {
      id: 'vpc-config',
      label: 'VPC Subnets',
      language: 'bash',
      content: `$ gcloud compute networks subnets list
NAME           REGION                   NETWORK          RANGE
default-subnet europe-west1             default          10.128.0.0/20`,
    }
  ],

  diagnosisQuestion: 'Qual é o motivo do Cloud Run falhar a comunicação com o Cloud SQL de IP Privado?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'Falta configurar um Serverless VPC Access Connector ou ativar o Direct VPC Egress no Cloud Run. O Cloud Run corre fora da VPC por defeito e não tem rota para IPs privados (10.x.x.x).',
      correct: true,
      feedback: 'Exato! O Cloud Run é uma infraestrutura totalmente gerida da Google, e opera fora do contexto da rede do cliente (VPC). Para que os pacotes cheguem ao IP privado 10.128.0.5 da tua VPC, é necessária uma ponte (Connector ou Direct Egress).'
    },
    {
      id: 'b',
      label: 'Cloud Run não suporta ligação ao Cloud SQL.',
      correct: false,
      feedback: 'Cloud Run suporta nativamente o Cloud SQL, quer através do Cloud SQL Auth Proxy nativo, quer via VPC (IP Privado).'
    },
    {
      id: 'c',
      label: 'Falta adicionar uma Firewall Rule na VPC para permitir tráfego da Internet.',
      correct: false,
      feedback: 'Mesmo que adiciones uma Firewall Rule de 0.0.0.0/0, o IP da base de dados é um RFC 1918 (Privado) não roteável na internet. O tráfego do Cloud Run nem sequer encontra o destino.'
    },
    {
      id: 'd',
      label: 'A variável de ambiente DB_HOST tem que apontar para a connection name do Cloud SQL e não o IP.',
      correct: false,
      feedback: 'Se estivermos a usar IP Privado via VPC, a DB_HOST deve ser sim o IP, e usamos drivers TCP standards. A connection name seria exigida caso estivéssemos a ativar a feature do "Cloud SQL Connections (Auth Proxy)" built-in do Cloud Run.'
    }
  ],

  fixQuestion: 'Como podemos corrigir este problema de forma recomendada no GCP (usando a aproximação IP Privado)?',
  fixOptions: [
    {
      id: 'a',
      label: 'Configurar o serviço do Cloud Run apontando-o para a VPC (ex: `--network default --subnet default-subnet`), ativando o Direct VPC Egress.',
      correct: true,
      feedback: 'Certo! O Direct VPC Egress (ou o uso do Serverless VPC Access Connector) anexa uma interface de rede invisível aos containers do Cloud Run dentro da subnet especificada, permitindo tráfego para IPs internos.'
    },
    {
      id: 'b',
      label: 'Atribuir um IP Público à instância do Cloud SQL e abrir as firewalls a 0.0.0.0/0.',
      correct: false,
      feedback: 'Péssima prática de segurança! Expõe a base de dados relacional (porta 5432) diretamente à internet. A aproximação privada é a correta.'
    },
    {
      id: 'c',
      label: 'Fazer peering da VPC com a rede "Google Services" manualmente na secção de VPC Peering.',
      correct: false,
      feedback: 'O Peering genérico para Private Services Access serve para infra de DB (já deve estar ativo pois o DB tem IP privado). Para ligar o Serverless (Cloud Run), requer conetores dedicados de Egress.'
    },
    {
      id: 'd',
      label: 'O Cloud Run precisa de receber privilégios de "roles/compute.networkAdmin".',
      correct: false,
      feedback: 'IAM permissions resolvem problemas de Autorização à API, não resolvem roteamento físico (camada OSI 3). A ausência de conetividade rede não se conserta com IAM neste caso.'
    }
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O Cloud Run está localizado num pool de servidores geridos da Google (Tenant network), e não dentro da vossa VPC customizada.'
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'O IP 10.128.0.5 é estritamente privado à rede default. Pacotes gerados fora não sabem como o atingir.'
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Pesquisa os termos "Serverless VPC Access" ou "Cloud Run Direct VPC Egress" da documentação do GCP.'
    }
  ],

  resolution: {
    rootCause: 'O serviço Cloud Run corre num ambiente partilhado e isolado da infraestrutura Google, fora de qualquer Virtual Private Cloud (VPC) dos clientes. Tentou ligar-se a um IP de RFC 1918 (Privado) e falhou, pois as chamadas Serverless padrão saem diretamente para a internet.',
    fix: 'Ativar Direct VPC Egress (nova feature nativa e rápida) no próprio serviço Cloud Run ou criar um Serverless VPC Access Connector e vincular o tráfego Egress do Cloud Run para esse conector. Ambas as formas fornecem ponte de rede L3/L4 para a VPC interna.',
    preventions: [
      'Documentar a matriz de conetividade para serviços Serverless vs Private resources',
      'Configurar Políticas de Organização (Org Policies) que obriguem o tráfego Egress do Cloud Run a ir sempre para a VPC (para prevenir exfiltração)'
    ]
  }
};
