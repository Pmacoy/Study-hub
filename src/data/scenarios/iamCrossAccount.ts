import type { Scenario } from '../../types/scenario';

export const iamCrossAccountScenario: Scenario = {
  id: 'iam-cross-account',
  domain: 'aws',
  format: 'guided',
  title: 'Lambda não consegue aceder DynamoDB跨account',
  hook: 'O pipeline de data processing falhou à noite. A Lambda na Account B (account-id: 111122223333) deveria escrever resultados numha tabela DynamoDB na Account A (account-id: 444455556666), mas lança AccessDenied em todos os eventos. Ambos os IAM roles parecem correctos individualmente. O que está a falhar?',
  difficulty: 'senior',
  timeEstimateMin: 10,
  tags: ['aws', 'iam', 'cross-account', 'dynamodb'],

  contextArtifacts: [
    {
      id: 'context',
      label: 'Contexto',
      language: 'text',
      content: `Account A (prod):   444455556666
  Tabela DynamoDB: analytics-results-prod
  Região: us-east-1

Account B (processing): 111122223333
  Função Lambda: data-processor-lambda
  IAM Role: arn:aws:iam::111122223333:role/data-processor-role

Comportamento:    Lambda funciona perfeitamente em staging (mesmo account)
                  Falha com AccessDenied apenas em production cross-account`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'lambda-iam-policy',
      label: '$ aws iam get-role-policy --role-name data-processor-role --policy-name data-processor-policy',
      language: 'bash',
      content: `{
  "RoleName": "data-processor-role",
  "PolicyName": "data-processor-policy",
  "PolicyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        "Resource": "arn:aws:dynamodb:us-east-1:444455556666:table/analytics-results-prod"
      },
      {
        "Effect": "Allow",
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:us-east-1:111122223333:*"
      }
    ]
  }
}
# A policy ANEXADA ao role DA account B permite aceder à tabela NA account A. Parece correcto.`,
    },
    {
      id: 'lambda-trust-policy',
      label: '$ aws iam get-role --role-name data-processor-role --query Role.AssumeRolePolicyDocument',
      language: 'bash',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}`,
    },
    {
      id: 'dynamodb-resource-policy',
      label: '$ aws dynamodb describe-table --table-name analytics-results-prod --query Table.TableName',
      language: 'bash',
      content: `analytics-results-prod
# A tabela existe. Agora verificar se tem resource policy:

$ aws dynamodb get-resource-policy --table-name analytics-results-prod
ERROR: Resource policy not found.`,
    },
    {
      id: 'lambda-error-log',
      label: 'CloudWatch Logs — exception da Lambda',
      language: 'log',
      content: `2026-09-01T03:14:22.441Z a1b2c3d4 ERROR Task timed out after 3.00 seconds
2026-09-01T03:14:22.441Z a1b2c3d4 ERROR [ERROR] Unhandled exception:
  Traceback (most recent call last):
    File "/var/task/processor.py", line 47, in handler
      table.put_item(Item=result)
    File "/var/runtime/botocore/client.py", line 553, in _api_call
      return self._make_api_call(operation_name, kwargs)
    File "/var/runtime/botocore/client.py", line 988, in _make_api_call
      raise error_class(parsed_response, operation_name)
  botocore.exceptions.ClientError: An error occurred (AccessDenied)
  Message: User: arn:aws:sts::111122223333:assumed-role/data-processor-role/lambda-function
           is not authorized to perform: dynamodb:PutItem
           on resource: arn:aws:dynamodb:us-east-1:444455556666:table/analytics-results-prod
           (Service: DynamoDB; Status Code: 400; Request ID: ABC123)`,
    },
    {
      id: 'dynamodb-trace',
      label: '$ aws dynamodb list-tables --region us-east-1 && echo "---" && aws logs describe-log-groups --log-group-name-prefix /aws/lambda/data-processor',
      language: 'bash',
      content: `analytics-results-prod
analytics-results-staging

# Log groups:
/aws/lambda/data-processor-prod
/aws/lambda/data-processor-staging

# Em staging (mesmo account), a Lambda funciona — o problema é específico
# de cross-account. O papel na account B tem permissão explícita para
# a ARN da account A. O que falta?`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'A policy do IAM role (Account B) permite dynamodb:PutItem na tabela da Account A. O erro é AccessDenied. Onde mais tens de verificar permissões num cenário cross-account?',
      revealArtifacts: ['lambda-iam-policy', 'lambda-error-log'],
      options: [
        {
          id: 'a',
          label: 'Verificar a resource policy da própria tabela DynamoDB (Account A) — mesmo que o IAM role tenha permissão, a tabela pode recusar o acesso',
          correct: true,
          feedback: 'Correto. No AWS, cross-account access exige DUAS permissões: (1) o IAM identity deve ter permissão no seu own policy, e (2) o resource (DynamoDB table) deve autorizar o principal cross-account via resource policy. Se faltar qualquer uma, o acesso é negado.',
          revealArtifacts: ['dynamodb-resource-policy'],
        },
        {
          id: 'b',
          label: 'Verificar se a Lambda tem timeout insuficiente',
          correct: false,
          feedback: 'O log mostra "AccessDenied" — é erro de permissão, não de timeout. O timeout é de 3s, mas o erro ocorre no primeiro request dePutItem.',
        },
        {
          id: 'c',
          label: 'Verificar a VPC configuration da Lambda',
          correct: false,
          feedback: 'A Lambda está em staging (mesmo account) e funciona. O problema é especificamente cross-account, não de rede.',
        },
      ],
      teachingNote: 'Regra fundamental do IAM cross-account: duas políticas precisam de permitir o acesso. A policy do IAM identity (quem eres) E a policy do resource (o que queres aceder). Se uma estiver em falta, o AWS nega — mesmo que a outra esteja correcta.',
    },
    {
      id: 'step-2',
      prompt: 'A tabela DynamoDB NÃO tem resource policy (get-resource-policy retornou erro). Qual é o próximo passo?',
      revealArtifacts: ['dynamodb-resource-policy'],
      options: [
        {
          id: 'a',
          label: 'Adicionar uma resource policy à tabela DynamoDB que allow o role data-processor-role da Account B aceder à tabela',
          correct: true,
          feedback: 'Exacto. A resource policy na Account A deve incluir o Principal ARN do role da Account B e as actions necessárias (PutItem, UpdateItem, Query, Scan). Isto completa o segundo lado do requisito cross-account.',
          revealArtifacts: ['dynamodb-trace'],
        },
        {
          id: 'b',
          label: 'Migrar a tabela DynamoDB para a Account B',
          correct: false,
          feedback: 'Mover dados entre accounts é complexo e disruptivo. A solução correcta é permitir cross-account via resource policy, não migrar o resource.',
        },
        {
          id: 'c',
          label: 'Adicionar mais permissões ao IAM role na Account B',
          correct: false,
          feedback: 'O IAM role JÁ tem as permissões correctas (visto no artifact lambda-iam-policy). O problema está no lado do resource (Account A), não no identity.',
        },
      ],
      teachingNote: 'A resource policy de DynamoDB é definida com aws dynamodb put-resource-policy. Deve ser aplicada NA CONTA QUE DETÉM O RECURSO (Account A), e referenciar o ARN do role da Account B como Principal.',
    },
    {
      id: 'step-3',
      prompt: 'A resource policy foi adicionada. Qual deve ser o formato correto da policy para resolver o AccessDenied?',
      options: [
        {
          id: 'a',
          label: `Principal: arn:aws:iam::111122223333:role/data-processor-role, Action: dynamodb:* na ARN da tabela, Effect: Allow`,
          correct: true,
          feedback: 'Perfeito. A resource policy na Account A deve allow explicitamente o role da Account B. Usar dynamodb:* na ARN da tabela dá todas as actions necessárias. É o segundo lado do "two-policy requirement".',
        },
        {
          id: 'b',
          label: 'Principal: Service: lambda.amazonaws.com, Action: dynamodb:* no resource entire account',
          correct: false,
          feedback: 'Principal: Service permite a qualquer Lambda em QUALQUER account. É demasiado permissivo e viola o princípio do menor privilégio. Deve ser específico ao role da Account B.',
        },
        {
          id: 'c',
          label: 'Não é necessária resource policy — o IAM role já basta',
          correct: false,
          feedback: 'O IAM role é necessário mas não suficiente. O DynamoDB resource policy é o segundo filtro obrigatório para cross-account. Sem ele, o AWS nega mesmo com a policy do identity correcta.',
        },
      ],
      teachingNote: 'Formato mínimo correto de resource policy para DynamoDB cross-account:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": {\n      "AWS": "arn:aws:iam::111122223333:role/data-processor-role"\n    },\n    "Action": "dynamodb:*",\n    "Resource": "arn:aws:dynamodb:us-east-1:444455556666:table/analytics-results-prod"\n  }]\n}',
    },
    {
      id: 'step-4',
      prompt: 'Tudo funciona. Estás a documentar o post-mortem. Qual prática previne este tipo de problema em futuros cenários cross-account?',
      options: [
        {
          id: 'a',
          label: 'Definir uma checklist de deploy cross-account que inclui ambos os lados: IAM trust + IAM policy (source) E resource policy (target)',
          correct: true,
          feedback: 'Correcto. O erro foi exactamente isto: alguém configurou o lado do identity (Account B) mas esqueceu o lado do resource (Account A). Uma checklist ou pipeline automatizado que valide ambos os lados previne o erro.',
        },
        {
          id: 'b',
          label: 'Sempre usar a mesma AWS account para todos os serviços',
          correct: false,
          feedback: 'Multi-account é uma prática recomendada da AWS para isolation e billing. A solução não é evitar multi-account, é gerir correctamente as permissões entre accounts.',
        },
        {
          id: 'c',
          label: 'Usar STS AssumeRoleOnly com credential helper local',
          correct: false,
          feedback: 'AssumeRole é para humanos fazerem login cross-account manualmente. A Lambda precisa de um IAM role com trust policy para ser assumido pelo serviço Lambda — não de credentials manuais.',
        },
      ],
      teachingNote: 'O "two-policy requirement" do AWS é a fonte mais comum de erros cross-account. Cada integração cross-account deve ter: (1) Trust Policy no role target, (2) Permission Policy no role target, (3) Resource Policy no resource target. Testar com aws sts get-caller-identity e simular com IAM Policy Simulator antes de deploy.',
    },
  ],

  resolution: {
    rootCause: 'A IAM policy no role data-processor-role (Account B) tinha as permissões correctas para aceder à tabela DynamoDB analytics-results-prod (Account A). No entanto, a tabela DynamoDB NÃO tinha uma resource policy que autorizasse o acesso por parte do role da Account B. O AWS exige que ambos os lados permitam o acesso: a policy do identity E a policy do resource. Falhando o segundo, o DynamoDB negava o PutItem com AccessDenied.',
    fix: 'Adicionar uma resource policy à tabela DynamoDB analytics-results-prod na Account A, permitindo arn:aws:iam::111122223333:role/data-processor-role executar dynamodb:* sobre a ARN da tabela. A Lambda passou a funcionar imediatamente após a policy ser aplicada.',
    preventions: [
      'Criar template de resource policy para DynamoDB cross-account e incluí-lo no Terraform/CloudFormation de cada tabela partilhada',
      'Checklist de deploy cross-account: verificar sempre ambos os lados (identity policy + resource policy)',
      'Usar AWS IAM Access Analyzer para detectar automaticamente recursos com acessos cross-account não autorizados',
      'Testar acesso cross-account com aws sts assume-role + dynamodb put-item antes de deploy para production',
      'Adicionar alerta SNS para eventos de AccessDenied em DynamoDB cross-account para detecção precoce',
    ],
  },
};
