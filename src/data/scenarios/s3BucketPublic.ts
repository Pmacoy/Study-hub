import type { Scenario } from '../../types/scenario';

export const s3BucketPublicScenario: Scenario = {
  id: 's3-bucket-public',
  domain: 'aws',
  format: 'guided',
  title: 'Bucket S3 exposto publicamente',
  hook: 'O SecurityOps envia um ticket de urgência: "Dados confidenciais estão a ser descarregados sem autenticação." O teu serviço de e-commerce tem um bucket que serve assets estáticos. Hoje de manhã, um developer fez um deploy rápido e esqueceu-se de proteger o bucket. Precisas de agir — rápido — mas sem partir o site.',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['aws', 's3', 'security', 'bucket-policy'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Conta AWS:         123456789012
Region:            us-east-1
Bucket:            cdn-assets-prod-ecommerce
Serviço:           E-commerce (frontend React + assets estáticos)
Último deploy:     hoje às 08:45 (developer J. Silva — sprint hotfix)
Repositório:       infra/terraform/modules/s3/main.tf
Função do bucket:  Servir imagens de produto e JS/CSS do frontend`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 's3-list-objects',
      label: '$ aws s3 ls s3://cdn-assets-prod-ecommerce/ --recursive | head -20',
      language: 'bash',
      content: `2026-09-01 08:46:12      14523 images/products/shoe-01.jpg
2026-09-01 08:46:12      23891 images/products/shoe-02.jpg
2026-09-01 08:46:12       8234 images/products/bag-05.jpg
2026-09-01 08:46:13      45012 images/products/jacket-11.jpg
2026-09-01 08:46:13     234567 js/app-v3.12.0.bundle.js
2026-09-01 08:46:13     112340 css/main.css
2026-09-01 08:46:14       1204 config/internal-api-keys.json
2026-09-01 08:46:14       2341 config/stripe-secret-key.env
2026-09-01 08:46:14        892 config/db-credentials.txt
# ⚠️ Ficheiros de configuração sensíveis foram feitos upload para o mesmo bucket público`,
    },
    {
      id: 's3-get-policy',
      label: '$ aws s3api get-bucket-policy --bucket cdn-assets-prod-ecommerce',
      language: 'bash',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadAssets",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cdn-assets-prod-ecommerce/*"
    }
  ]
}`,
    },
    {
      id: 's3-website-config',
      label: '$ aws s3api get-bucket-policy --bucket cdn-assets-prod-ecommerce-website',
      language: 'bash',
      content: `ERROR: A bucket "cdn-assets-prod-ecommerce-website" não existe.
Nota: O frontend serve-se do CloudFront (distância ID: E2ABCDEFGHIJ).
O CloudFront usa um Origin Access Identity (OAI) que aponta para
cdn-assets-prod-ecommerce como AWS Origin.

Vistei:
- A OAI está configurada? Sim ✓
- O bucket tem bloqueio público activado? NÃO ✗`,
    },
    {
      id: 'cloudtrail-access',
      label: '$ aws cloudtrail lookup-events --start-time 2026-09-01T08:00:00Z --end-time 2026-09-01T09:00:00Z --max-results 20 | jq .Events[] | jq -r \'.CloudTrailEvent | fromjson | {userIdentity, eventName, sourceIPAddress, userAgent}\'',
      language: 'json',
      content: `[
  {
    "userIdentity": { "type": "IAMUser", "userName": "jsilva", "accountId": "123456789012" },
    "eventName": "PutBucketPolicy",
    "sourceIPAddress": "203.0.113.42",
    "userAgent": "aws-cli/2.17.0"
  },
  {
    "userIdentity": { "type": "Unauthenticated", "accountId": "-" },
    "eventName": "GetObject",
    "sourceIPAddress": "198.51.100.77",
    "userAgent": "python-requests/2.31.0"
  },
  {
    "userIdentity": { "type": "Unauthenticated", "accountId": "-" },
    "eventName": "GetObject",
    "sourceIPAddress": "198.51.100.77",
    "userAgent": "python-requests/2.31.0"
  },
  {
    "userIdentity": { "type": "Unauthenticated", "accountId": "-" },
    "eventName": "GetObject",
    "sourceIPAddress": "198.51.100.77",
    "userAgent": "python-requests/2.31.0"
  }
]
# IP 198.51.100.77 está a descarregar ficheiros em loop — comportamento de scraping`,
    },
    {
      id: 's3-access-logs',
      label: 'S3 Access Logs — últimos pedidos GET (últimos 10)',
      language: 'text',
      content: `2026-09-01T08:52:14Z 198.51.100.77 GET config/db-credentials.txt 200 -
2026-09-01T08:52:14Z 198.51.100.77 GET config/stripe-secret-key.env 200 -
2026-09-01T08:52:15Z 198.51.100.77 GET config/internal-api-keys.json 200 -
2026-09-01T08:52:15Z 198.51.100.77 GET config/db-credentials.txt 200 -
2026-09-01T08:52:16Z 198.51.100.77 GET images/products/shoe-01.jpg 200 -
2026-09-01T08:52:16Z 198.51.100.77 GET js/app-v3.12.0.bundle.js 200 -
2026-09-01T08:52:17Z 198.51.100.77 GET config/stripe-secret-key.env 200 -
# 198.51.100.77 faz GET repetido nos ficheiros de configuração sensíveis`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Recebeste o alerta de SecurityOps. Qual é a primeira coisa que precisas de confirmar?',
      revealArtifacts: ['s3-list-objects'],
      options: [
        {
          id: 'a',
          label: 'Listar o conteúdo do bucket e verificar se ficheiros sensíveis foram expostos',
          correct: true,
          feedback: 'Correto. A lista revela que ficheiros como db-credentials.txt e stripe-secret-key.env estão no mesmo bucket que os assets públicos. Isto é uma violação de dados.',
          revealArtifacts: ['s3-website-config'],
        },
        {
          id: 'b',
          label: 'Apagar imediatamente o bucket',
          correct: false,
          feedback: 'Apagar o bucket resolve a exposição mas parte o frontend — todos os assets param de carregar. Precisas de conter a exposição primeiro, não destruir o recurso.',
        },
        {
          id: 'c',
          label: 'Ignorar e esperar pelo próximo sprint',
          correct: false,
          feedback: 'Isto é uma violação activa de dados. Ficheiros sensíveis estão a ser descarregados por IPs não-autenticados AGORA. Ignorar é negligência.',
        },
      ],
      teachingNote: 'Sempre confirma o alcance antes de agir. Um bucket com Principal=* e Action=s3:GetObject é 100% público — qualquer pessoa na internet consegue listar e descarregar tudo.',
    },
    {
      id: 'step-2',
      prompt: 'Viste que ficheiros sensíveis estão no bucket. Qual é o action imediato para proteger os dados?',
      revealArtifacts: ['s3-get-policy'],
      options: [
        {
          id: 'a',
          label: 'Remover a bucket policy imediatamente e fazer um rotate de todas as credenciais expostas',
          correct: true,
          feedback: 'Exacto. Sem policy, o bucket volta ao default deny (nenhum acesso público). Depois, rotate de credenciais e revogar sessões ativas — o dano já aconteceu nos logs.',
          revealArtifacts: ['cloudtrail-access'],
        },
        {
          id: 'b',
          label: 'Adicionar uma condição IP block à policy existente',
          correct: false,
          feedback: 'IP blocking é workaround — não remove o acesso de outros IPs ou de bots que descubram o bucket. O problema é o Principal=* geral, não um IP específico.',
        },
        {
          id: 'c',
          label: 'Ativar MFA Delete no bucket',
          correct: false,
          feedback: 'MFA Delete protege contra deleções acidentais, não contra acesso público. Não resolve o problema actual.',
        },
      ],
      teachingNote: 'Regra de ouro S3: default deny. Se não há policy, o bucket é privado. Quando adicionas uma policy com Principal: *, estás explicitamente a abrir o bucket ao mundo. Remove a policy ou restringe o Principal.',
    },
    {
      id: 'step-3',
      prompt: 'A policy foi removida e as credenciais estão em rotação. Mas o frontend continua a servir assets. Como restaurar o acesso legítimo ao CloudFront?',
      revealArtifacts: ['s3-website-config'],
      options: [
        {
          id: 'a',
          label: 'Recriar uma policy que permita apenas o OAI do CloudFront aceder ao bucket (Principal: {AWS: arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ...})',
          correct: true,
          feedback: 'Perfeito. O OAI é uma identidade do CloudFront. Ao colocar o OAI como principal, só o CloudFront consegue ler o bucket. Downloads directos ficam bloqueados, o frontend continua a funcionar.',
          revealArtifacts: ['s3-access-logs'],
        },
        {
          id: 'b',
          label: 'Mover os assets para um S3 bucket com website endpoint (index.html)',
          correct: false,
          feedback: 'Website endpoint expõe os assets publicamente — o problema persiste. O OAI no CloudFront é a solução correcta para assets privados.',
        },
        {
          id: 'c',
          label: 'Colocar os assets num bucket privado e usar presigned URLs para cada request',
          correct: false,
          feedback: 'Funciona mas é overkill para assets estáticos do frontend. Cada request do browser teria de gerar uma presigned URL, o que quebra caching e performance. O OAI é mais simples e eficaz.',
        },
      ],
      teachingNote: 'CloudFront + OAI é o padrão AWS para servir assets estáticos de forma segura. O OAI é uma identity do CloudFront que o S3 reconhece — assim só o CloudFront lê o bucket, e não o público em geral.',
    },
    {
      id: 'step-4',
      prompt: 'O problema está contido. Estás a escrever o post-mortem. Qual combinação de prevenções resolve este tipo de incidente de forma estrutural?',
      options: [
        {
          id: 'a',
          label: 'AWS Config rule "s3-bucket-policy-prohibited-principals" + S3 Block Public Access + pipeline de infra com review obrigatório para changes de bucket policy',
          correct: true,
          feedback: 'Esta é a resposta madura: detecção automática (AWS Config), proteção por default (Block Public Access), e governance do processo (review obrigatório em infra como código).',
        },
        {
          id: 'b',
          label: 'Pedir ao developer que tenha mais cuidado na próxima vez',
          correct: false,
          feedback: 'Human error é inevitável. O sistema tem de ser resiliente a erros humanos — não contar com a atenção do developer.',
        },
        {
          id: 'c',
          label: 'Desactivar a possibilidade de fazer PutBucketPolicy via IAM',
          correct: false,
          feedback: 'Bloquear PutBucketPolicy em todas as contas paralisa operações legítimas. O certo é proteger com AWS Config (detectar) e Block Public Access (mitigar), não impedir a acção.',
        },
      ],
      teachingNote: 'Triple layer de defesa para S3 security: (1) Block Public Access no nível da conta/organização — previne acidentalmente buckets públicos; (2) AWS Config rules — detectam violations em tempo real; (3) GitOps/pipeline review — nenhuma policy vai a production sem approval.',
    },
  ],

  resolution: {
    rootCause: 'O developer J. Silva fez upload de assets e, inadvertidamente, de ficheiros de configuração sensíveis para o mesmo bucket S3. Ao aplicar uma bucket policy com Principal: * para servir os assets via CloudFront, expôs todos os conteúdos do bucket ao público — incluindo credenciais de base de dados e chaves de API. CloudTrail registou pedidos não-autenticados (Unauthenticated) a partir de 198.51.100.77 a descarregar os ficheiros sensíveis.',
    fix: 'Remover imediatamente a bucket policy (volta ao default deny). Rodar rotas de todas as credenciais expostas (DB, Stripe, API keys). Recriar uma policy restrita ao OAI do CloudFront para manter o funcionamento do frontend. Implementar S3 Block Public Access em toda a conta.',
    preventions: [
      'Activar S3 Block Public Access em toda a conta (account-level) — previne qualquer bucket público, mesmo com policy',
      'AWS Config managed rule s3-bucket-policy-prohibited-principals — detecta e alerta quando Principal: * é adicionado',
      'Separar buckets: assets públicos num bucket, dados sensíveis noutro com acesso restrito por IAM',
      'Infra como código (Terraform) com review obrigatório em pipeline antes de aplicar changes em buckets S3',
      'Remover ficheiros sensíveis do version control e usar AWS Secrets Manager ou SSM Parameter Store para credenciais',
      'Alertas CloudWatch/SNS para eventos de S3 GetObject de unauthenticated principal',
    ],
  },
};
