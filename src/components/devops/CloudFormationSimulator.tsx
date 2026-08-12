import { useState } from 'react';
import { Copy, Check, Layers, ChevronDown } from 'lucide-react';

type View = 'basics' | 'template' | 'functions' | 'operations' | 'interview';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={
            line.trim().startsWith('#') ? 'text-slate-600'
            : line.startsWith('$') ? 'text-emerald-300'
            : line.match(/^(AWSTemplateFormatVersion|Description|Parameters|Mappings|Conditions|Resources|Outputs|Metadata|Transform):/) ? 'text-orange-300 font-semibold'
            : line.includes('!Ref') || line.includes('!GetAtt') || line.includes('!Sub') || line.includes('!FindInMap') || line.includes('!If') || line.includes('!ImportValue') || line.includes('!Select') || line.includes('!Cidr') || line.includes('!GetAZs') ? 'text-violet-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-slate-900/50 transition-colors">
        <ChevronDown size={14} className={`shrink-0 mt-0.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        <span className="text-[12px] font-semibold text-slate-200">{q}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pl-10">
          <p className="text-[12px] text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

const TEMPLATE_SKELETON = `AWSTemplateFormatVersion: '2010-09-09'
Description: 'Descrição do que este template provisiona'

Parameters:
  # Inputs que o utilizador fornece ao criar a stack

Mappings:
  # Tabelas de lookup estáticas (região → AMI, ambiente → tamanho)

Conditions:
  # Lógica que controla se um recurso é criado

Resources:
  # Os recursos AWS — ÚNICA secção obrigatória

Outputs:
  # Valores a exportar ou mostrar depois do deploy

# Só a secção Resources é obrigatória.
# AWSTemplateFormatVersion tem sempre o valor 2010-09-09.`;

const PARAMETERS_EXAMPLE = `Parameters:
  EnvironmentType:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, production]
    Description: Ambiente que define a configuração dos recursos

  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small, t3.medium]

  KeyPairName:
    Type: AWS::EC2::KeyPair::KeyName    # tipo especializado: valida
    Description: Key pair existente para SSH

  VpcCIDR:
    Type: String
    Default: 10.0.0.0/16
    AllowedPattern: '^(\\d{1,3}\\.){3}\\d{1,3}/\\d{1,2}$'

  DBPassword:
    Type: String
    NoEcho: true      # mascara o valor na consola e nas APIs

# Tipos disponíveis: String, Number, List, CommaDelimitedList
# e tipos AWS que validam contra recursos reais:
#   AWS::EC2::KeyPair::KeyName, AWS::EC2::SecurityGroup::Id,
#   AWS::EC2::VPC::Id, AWS::SSM::Parameter::Value
#
# Constraints: AllowedValues, AllowedPattern (regex),
#              MinLength, MaxLength, MinValue, MaxValue`;

const MAPPINGS_CONDITIONS = `Mappings:
  RegionAMIMap:
    us-east-1:
      AMI: ami-0c55b159cbfafe1f0
    eu-west-1:
      AMI: ami-0bbc25e23a7640b9b

  EnvironmentConfig:
    dev:
      InstanceType: t3.micro
      MinSize: 1
      MaxSize: 2
      MultiAZ: false
    production:
      InstanceType: t3.large
      MinSize: 3
      MaxSize: 10
      MultiAZ: true

Conditions:
  IsProduction: !Equals [!Ref EnvironmentType, production]
  CreateBackup: !Equals [!Ref EnableBackup, 'true']
  # Condições podem combinar-se: !And, !Or, !Not

Resources:
  Database:
    Type: AWS::RDS::DBInstance
    Condition: IsProduction        # só cria em produção
    Properties:
      DBInstanceClass: !FindInMap [EnvironmentConfig, !Ref EnvironmentType, InstanceType]
      MultiAZ: !FindInMap [EnvironmentConfig, !Ref EnvironmentType, MultiAZ]
      BackupRetentionPeriod: !If [IsProduction, 30, 7]

# Mappings organizam melhor que condicionais aninhadas
# quando tens configuração por ambiente ou região.`;

const OUTPUTS_EXAMPLE = `Outputs:
  InstanceId:
    Description: ID da instância EC2
    Value: !Ref MyEC2Instance
    Export:
      Name: !Sub '\${AWS::StackName}-InstanceId'

  PublicIP:
    Description: IP público
    Value: !GetAtt MyEC2Instance.PublicIp

  VPCId:
    Value: !Ref MyVPC
    Export:
      Name: SharedVPCId        # nome global — usado por outras stacks

# Noutra stack, importas assim:
Resources:
  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId: !ImportValue SharedVPCId

# ATENÇÃO: não podes apagar uma stack cujos outputs
# estão a ser importados por outras. Cria dependência.
# Limite: 200 outputs por stack.`;

const FUNCTIONS_REF = `# !Ref — valor de um parâmetro OU ID físico de um recurso
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${AWS::StackName}-data-bucket'

  MyBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref MyBucket          # devolve o nome do bucket

# !GetAtt — atributos além do ID principal
Outputs:
  LoadBalancerDNS:
    Value: !GetAtt MyLoadBalancer.DNSName
  BucketArn:
    Value: !GetAtt MyBucket.Arn

# Sintaxe: !GetAtt LogicalId.AttributeName
# Cada tipo de recurso expõe atributos diferentes.`;

const FUNCTIONS_SUB_JOIN = `# !Sub — substituição de variáveis dentro de strings
DisplayName: !Sub '\${EnvironmentType}-notifications-\${AWS::Region}'

# Pseudo-parâmetros disponíveis sempre:
#   \${AWS::Region}      \${AWS::StackName}    \${AWS::AccountId}
#   \${AWS::Partition}   \${AWS::StackId}      \${AWS::URLSuffix}

# !Join — concatenar com um delimitador
Resource: !Join
  - ''
  - - 'arn:aws:s3:::'
    - !Ref MyBucket
    - '/*'

# !Sub é mais legível para substituições simples.
# !Join dá controlo explícito sobre o delimitador.

# !Select + !Split — trabalhar com listas
AvailabilityZone: !Select [0, !GetAZs '']      # 1ª AZ da região actual
FirstSubnet: !Select [0, !Split [',', !Ref SubnetList]]

# !Cidr — calcular blocos de subnet automaticamente
CidrBlock: !Select [0, !Cidr [!GetAtt VPC.CidrBlock, 12, 8]]
# gera 12 blocos com 8 bits adicionais (256 endereços cada)`;

const DYNAMIC_REFS = `# Dynamic references — secrets sem os pôr no template
Resources:
  DBSecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      GenerateSecretString:
        SecretStringTemplate: '{"username": "admin"}'
        GenerateStringKey: password
        PasswordLength: 32
        ExcludeCharacters: '"@/\\'

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: postgres
      MasterUsername: !Sub '{{resolve:secretsmanager:\${DBSecret}:SecretString:username}}'
      MasterUserPassword: !Sub '{{resolve:secretsmanager:\${DBSecret}:SecretString:password}}'

# Sintaxe {{resolve:...}} resolve em runtime:
#   {{resolve:ssm:/myapp/config}}              — Parameter Store
#   {{resolve:ssm-secure:/myapp/key:1}}        — Parameter Store cifrado
#   {{resolve:secretsmanager:MySecret:SecretString:password}}
#
# A password é gerada, guardada e rodada sem tocar no template.`;

const STACK_OPS = `# Criar uma stack
$ aws cloudformation create-stack \\
    --stack-name my-stack \\
    --template-body file://template.yaml \\
    --parameters ParameterKey=EnvironmentType,ParameterValue=production \\
    --capabilities CAPABILITY_NAMED_IAM

# Ver o estado e os eventos
$ aws cloudformation describe-stacks --stack-name my-stack
$ aws cloudformation describe-stack-events --stack-name my-stack
$ aws cloudformation list-stack-resources --stack-name my-stack

# Validar antes de aplicar
$ aws cloudformation validate-template --template-body file://template.yaml

# Actualizar
$ aws cloudformation update-stack --stack-name my-stack \\
    --template-body file://template.yaml

# Apagar
$ aws cloudformation delete-stack --stack-name my-stack

# Estados comuns:
#   CREATE_IN_PROGRESS → CREATE_COMPLETE
#   CREATE_FAILED → ROLLBACK_IN_PROGRESS → ROLLBACK_COMPLETE`;

const CHANGE_SETS = `# Change Set — pré-visualizar o que vai mudar ANTES de aplicar
$ aws cloudformation create-change-set \\
    --stack-name my-stack \\
    --change-set-name my-changes \\
    --template-body file://template.yaml

# Ver o que vai acontecer
$ aws cloudformation describe-change-set \\
    --stack-name my-stack \\
    --change-set-name my-changes

# Output mostra por recurso:
#   Action: Add | Modify | Remove
#   Replacement: True | False | Conditional
#   ↑ "Replacement: True" significa que o recurso vai ser
#     DESTRUÍDO e recriado — atenção em produção!

# Executar depois de rever
$ aws cloudformation execute-change-set \\
    --stack-name my-stack --change-set-name my-changes

# Em produção: NUNCA update-stack directo. Sempre change set.`;

const DRIFT_DETECTION = `# Drift detection — alguém mexeu na consola?
$ aws cloudformation detect-stack-drift --stack-name my-stack
# devolve um StackDriftDetectionId

$ aws cloudformation describe-stack-drift-detection-status \\
    --stack-drift-detection-id <id>

# Ver que recursos divergiram
$ aws cloudformation describe-stack-resource-drifts \\
    --stack-name my-stack \\
    --stack-resource-drift-status-filters MODIFIED DELETED

# Estados: IN_SYNC | MODIFIED | DELETED | NOT_CHECKED

# Boa prática: correr drift detection periodicamente
# (EventBridge rule + Lambda) e alertar quando detecta.
# Drift = alguém contornou a IaC. É um sintoma de processo.`;

const PROTECTION = `# Proteger recursos críticos

Resources:
  ProductionDatabase:
    Type: AWS::RDS::DBInstance
    DeletionPolicy: Retain              # não apaga quando a stack é apagada
    UpdateReplacePolicy: Snapshot       # snapshot antes de substituir
    Properties:
      # ...

  DataBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain

# DeletionPolicy: Delete (default) | Retain | Snapshot
# UpdateReplacePolicy: espelha as mesmas opções

# Termination protection ao nível da stack
$ aws cloudformation update-termination-protection \\
    --stack-name prod-stack --enable-termination-protection

# Stack policy — bloquear updates a recursos específicos
{
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "Update:*",
      "Principal": "*",
      "Resource": "LogicalResourceId/ProductionDatabase"
    }
  ]
}`;

const NESTED_STACKS = `# Nested stacks — dividir templates grandes
Resources:
  NetworkStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/network.yaml
      Parameters:
        VpcCIDR: 10.0.0.0/16

  AppStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/app.yaml
      Parameters:
        VPCId: !GetAtt NetworkStack.Outputs.VPCId    # sem cross-stack export
        SubnetIds: !GetAtt NetworkStack.Outputs.SubnetIds

# Nested stacks vs cross-stack references (!ImportValue):
#
#   Nested   → ciclo de vida partilhado, parâmetros directos,
#              melhor para composição de uma aplicação
#   Import   → stacks independentes, acoplamento fraco,
#              melhor para recursos partilhados entre equipas
#
# Nested evita o problema de "não posso apagar porque
# outra stack importa o meu output".`;

const INTERVIEW_QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Qual é a diferença entre um template e uma stack?',
    a: 'O template é o ficheiro de texto que descreve a infraestrutura desejada. A stack é a instanciação desse template — a colecção real de recursos AWS criados e geridos como uma unidade. O mesmo template pode gerar várias stacks.',
  },
  {
    q: 'Qual é a única secção obrigatória num template?',
    a: 'A secção Resources. Todas as outras (Parameters, Mappings, Conditions, Outputs, Metadata, Transform) são opcionais — mas recomendadas em templates de produção.',
  },
  {
    q: 'Como é que o CloudFormation lida com dependências entre recursos?',
    a: 'Determina-as automaticamente ao analisar as referências !Ref e !GetAtt entre recursos. Cria-os pela ordem correcta e paraleliza os que são independentes. Podes forçar uma dependência explícita com o atributo DependsOn.',
  },
  {
    q: 'O que acontece quando a criação de uma stack falha?',
    a: 'Por omissão, o CloudFormation faz rollback automático: apaga todos os recursos que já tinham sido criados com sucesso. Podes desactivar isso com --disable-rollback para investigar o que falhou (útil em debugging, perigoso em produção).',
  },
  {
    q: 'CloudFormation vs Terraform — quando escolher cada um?',
    a: 'CloudFormation é nativo da AWS, gratuito, com gestão de estado automática (sem state file para gerir) e integração forte com Organizations, Service Catalog e Control Tower. Terraform é multi-cloud, usa HCL, exige gestão de state, e suporta 200+ providers. Ambiente só-AWS com necessidade de suporte AWS garantido → CloudFormation. Multi-cloud ou ecossistema de módulos → Terraform.',
  },
  {
    q: 'O que é um Change Set e porque é importante?',
    a: 'É uma pré-visualização das mudanças propostas antes de as executar. Mostra que recursos vão ser adicionados, modificados, substituídos ou removidos. O campo "Replacement: True" é crítico: indica que o recurso vai ser destruído e recriado. Em produção nunca se faz update-stack directo — sempre change set primeiro.',
  },
  {
    q: 'O que é DeletionPolicy e quais são as opções?',
    a: 'Um atributo ao nível do recurso que controla o que acontece quando a stack é apagada. Opções: Delete (default), Retain (mantém o recurso) e Snapshot (tira snapshot antes de apagar, para recursos que o suportem como RDS e EBS). UpdateReplacePolicy é o equivalente para quando um update exige substituição.',
  },
  {
    q: 'Como se fazem cross-stack references?',
    a: 'Exportas um valor na secção Outputs de uma stack com a propriedade Export, e importa-lo noutra com a função !ImportValue. Cria uma dependência: não podes apagar nem alterar o output exportado enquanto outra stack o importar.',
  },
  {
    q: 'Podes apagar uma stack cujos outputs estão a ser importados?',
    a: 'Não. O CloudFormation impede a eliminação de stacks com outputs exportados que estejam a ser importados por outras. Tens de actualizar ou apagar primeiro as stacks dependentes. Podes descobrir quais são com aws cloudformation list-imports --export-name <nome>.',
  },
  {
    q: 'Qual é a diferença entre !Sub e !Join?',
    a: '!Sub faz substituição de variáveis dentro de uma string template — mais legível para casos simples. !Join concatena um array de strings com um delimitador explícito — melhor quando precisas de controlo sobre o delimitador ou estás a juntar listas.',
  },
  {
    q: 'Para que serve o NoEcho nos parâmetros?',
    a: 'Mascara o valor do parâmetro na consola e nas respostas de API. Usa-se para dados sensíveis como passwords. Mas a boa prática é não passar secrets como parâmetros de todo — usa dynamic references para o Secrets Manager ou Parameter Store.',
  },
  {
    q: 'O que é a sintaxe {{resolve}}?',
    a: 'Dynamic references. Resolve valores em runtime a partir do Systems Manager Parameter Store ou do Secrets Manager. Ex: {{resolve:secretsmanager:MySecret:SecretString:password}}. Permite que o template nunca contenha o segredo, e que a rotação aconteça sem alterar o template.',
  },
  {
    q: 'Podes usar intrinsic functions na secção Parameters?',
    a: 'Não. As intrinsic functions só funcionam em propriedades de recursos, outputs, atributos de metadata e update policies. A secção Parameters só aceita valores estáticos e constraints.',
  },
  {
    q: 'O que é drift detection?',
    a: 'Identifica alterações feitas manualmente fora do CloudFormation — alguém que mexeu na consola. Compara o estado real dos recursos com o que está definido no template. Estados: IN_SYNC, MODIFIED, DELETED, NOT_CHECKED. Drift é um sintoma de processo, não só um problema técnico.',
  },
  {
    q: 'Quando usar nested stacks em vez de cross-stack references?',
    a: 'Nested stacks quando as partes têm ciclo de vida partilhado e formam uma aplicação coesa — passas parâmetros directamente e evitas o bloqueio de exports. Cross-stack references quando as stacks são independentes e geridas por equipas diferentes, com acoplamento fraco (ex: uma stack de rede partilhada).',
  },
  {
    q: 'Como impedir a eliminação acidental de recursos críticos?',
    a: 'Três camadas: DeletionPolicy: Retain nos recursos críticos, termination protection ao nível da stack, e uma stack policy em JSON que nega Update ou Delete a resource IDs específicos.',
  },
  {
    q: 'Quantos outputs pode ter uma stack?',
    a: 'Até 200. É um limite rígido que não pode ser aumentado. Se precisas de mais, é sinal de que a stack devia ser dividida.',
  },
  {
    q: 'O que faz a função !Cidr?',
    a: 'Gera um array de blocos CIDR a partir de um bloco maior. Ex: !Cidr [10.0.0.0/16, 12, 8] gera 12 blocos com 8 bits adicionais (256 endereços cada). Permite criar subnets dinamicamente sem hardcode de CIDRs.',
  },
];

export default function CloudFormationSimulator() {
  const [view, setView] = useState<View>('basics');

  const tabs: { id: View; label: string }[] = [
    { id: 'basics',     label: 'Fundamentos' },
    { id: 'template',   label: 'Anatomia do template' },
    { id: 'functions',  label: 'Intrinsic functions' },
    { id: 'operations', label: 'Operações' },
    { id: 'interview',  label: 'Entrevista' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-3xl border border-orange-500/25 bg-orange-500/5 p-5">
        <div className="flex items-center gap-3">
          <Layers size={22} className="text-orange-400" />
          <div>
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Infrastructure as Code · AWS</div>
            <h2 className="text-lg font-bold text-white">AWS CloudFormation</h2>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
          O serviço nativo de IaC da AWS. Modelas os recursos em templates declarativos (YAML ou JSON),
          e o CloudFormation trata das dependências, da ordem de criação, do rollback e do estado —
          sem state file para gerir.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Fundamentos ─────────────────────────────────────── */}
      {view === 'basics' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Os quatro componentes</h3>
            <div className="space-y-2">
              {[
                ['Template', 'O ficheiro YAML/JSON que descreve a infraestrutura desejada. É código — versiona-se em Git.'],
                ['Stack', 'A instanciação de um template. A colecção real de recursos criados e geridos como uma unidade.'],
                ['Stack Set', 'Gere stacks em múltiplas contas e regiões a partir de um único template. Para governance à escala.'],
                ['Change Set', 'Pré-visualização das mudanças antes de as aplicar. O "terraform plan" do CloudFormation.'],
              ].map(([term, desc]) => (
                <div key={term} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-[12px] font-bold text-orange-300 w-24">{term}</span>
                  <span className="text-[12px] text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">CloudFormation vs Terraform</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">CloudFormation</div>
                <ul className="space-y-1.5 text-[12px] text-slate-400">
                  <li>· Nativo AWS, gratuito</li>
                  <li>· Estado gerido pela AWS (sem state file)</li>
                  <li>· Só recursos AWS</li>
                  <li>· Integra com Organizations, Service Catalog, Control Tower</li>
                  <li>· Rollback automático nativo</li>
                  <li>· Suporte AWS incluído</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Terraform</div>
                <ul className="space-y-1.5 text-[12px] text-slate-400">
                  <li>· Multi-cloud, 200+ providers</li>
                  <li>· State file para gerir (S3 + DynamoDB lock)</li>
                  <li>· Linguagem HCL</li>
                  <li>· Ecossistema de módulos maduro</li>
                  <li>· <code className="text-violet-300">plan</code> nativo e mais legível</li>
                  <li>· Comunidade grande</li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              Na prática: se és só-AWS e valorizas integração nativa e zero gestão de estado, CloudFormation.
              Se tens multi-cloud ou queres reutilizar módulos da comunidade, Terraform.
              Muitas equipas usam ambos — CloudFormation para landing zones e Service Catalog, Terraform para aplicações.
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Esqueleto de um template</h3>
            <Code code={TEMPLATE_SKELETON} lang="yaml" />
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Nota</div>
            <p className="text-[12px] text-sky-100 leading-relaxed">
              O <code className="text-sky-300">AWSTemplateFormatVersion</code> tem sempre o valor{' '}
              <code className="text-sky-300">2010-09-09</code>. Nunca mudou desde o lançamento e é a única versão válida —
              é uma pergunta clássica de entrevista.
            </p>
          </div>
        </div>
      )}

      {/* ── Anatomia ────────────────────────────────────────── */}
      {view === 'template' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Parameters — inputs do template</h3>
            <Code code={PARAMETERS_EXAMPLE} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Mappings e Conditions — configuração por ambiente</h3>
            <Code code={MAPPINGS_CONDITIONS} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Outputs e cross-stack references</h3>
            <Code code={OUTPUTS_EXAMPLE} lang="yaml" />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Armadilha</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              Exportar outputs cria acoplamento forte. Se a StackA exporta um VPCId e três stacks o importam,
              não consegues alterar nem apagar esse output enquanto elas existirem. Para composição de aplicações,
              nested stacks costumam ser melhor escolha.
            </p>
          </div>
        </div>
      )}

      {/* ── Intrinsic functions ─────────────────────────────── */}
      {view === 'functions' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Referência rápida</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                ['!Ref', 'Valor de um parâmetro ou ID físico de um recurso'],
                ['!GetAtt', 'Atributos além do ID (DNSName, Arn, PublicIp...)'],
                ['!Sub', 'Substituição de variáveis dentro de strings'],
                ['!Join', 'Concatenar com delimitador explícito'],
                ['!FindInMap', 'Ler valor da secção Mappings'],
                ['!If', 'Valor condicional (true/false)'],
                ['!Select', 'Elemento de uma lista por índice'],
                ['!Split', 'Dividir string num array'],
                ['!GetAZs', 'Availability zones da região'],
                ['!ImportValue', 'Output exportado por outra stack'],
                ['!Cidr', 'Gerar blocos CIDR de subnet'],
                ['!Base64', 'Codificar (usado para UserData)'],
              ].map(([fn, desc]) => (
                <div key={fn} className="flex gap-2 p-2.5 rounded-xl bg-slate-900">
                  <code className="shrink-0 text-[11px] font-bold text-violet-300 w-24">{fn}</code>
                  <span className="text-[11px] text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">!Ref e !GetAtt</h3>
            <Code code={FUNCTIONS_REF} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">!Sub, !Join, !Select, !Cidr</h3>
            <Code code={FUNCTIONS_SUB_JOIN} lang="yaml" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Dynamic references — secrets fora do template</h3>
            <Code code={DYNAMIC_REFS} lang="yaml" />
          </section>
        </div>
      )}

      {/* ── Operações ───────────────────────────────────────── */}
      {view === 'operations' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Operações de stack</h3>
            <Code code={STACK_OPS} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Change Sets — o "plan" do CloudFormation</h3>
            <Code code={CHANGE_SETS} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Drift detection</h3>
            <Code code={DRIFT_DETECTION} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Proteger recursos críticos</h3>
            <Code code={PROTECTION} lang="yaml + json" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Nested stacks</h3>
            <Code code={NESTED_STACKS} lang="yaml" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Troubleshooting rápido</h3>
            <div className="space-y-2">
              {[
                ['Stack creation failed', 'describe-stack-events e procura o primeiro CREATE_FAILED — os seguintes são consequência.'],
                ['Rollback disparado', 'O erro real está no primeiro evento de falha, não no último. Lê de baixo para cima.'],
                ['Recursos em DELETE_FAILED', 'Normalmente há dependências fora da stack (ex: ENI attachada, bucket com objectos). Apaga manualmente e repete.'],
                ['Export in use', 'aws cloudformation list-imports --export-name <nome> mostra que stacks o importam.'],
                ['Template validation error', 'aws cloudformation validate-template apanha erros de sintaxe. cfn-lint apanha muito mais.'],
                ['Circular dependency', 'Recurso A depende de B e B de A. Quebra com DependsOn explícito ou repensa a estrutura.'],
              ].map(([issue, fix]) => (
                <div key={issue} className="p-3 rounded-xl bg-slate-900">
                  <div className="text-[12px] font-semibold text-rose-300">{issue}</div>
                  <div className="text-[12px] text-slate-400 mt-1">{fix}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Entrevista ──────────────────────────────────────── */}
      {view === 'interview' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              {INTERVIEW_QUESTIONS.length} perguntas frequentes em entrevistas de CloudFormation.
              Clica para revelar a resposta — tenta responder mentalmente primeiro.
            </p>
          </div>
          <div className="space-y-2">
            {INTERVIEW_QUESTIONS.map((item, i) => (
              <QA key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
