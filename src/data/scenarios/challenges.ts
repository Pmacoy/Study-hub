import type { ChallengeScenario } from '../../types/scenario';

// ── K8s NetworkPolicy ────────────────────────────────────────────────────────
export const k8sNetworkPolicyBlocked: ChallengeScenario = {
  id: 'k8s-networkpolicy-blocked',
  domain: 'devops',
  title: 'Pod não consegue falar com o serviço',
  hook: 'O microserviço checkout-service não consegue fazer requests ao payment-service. Todos os pods estão Running e o kube-proxy reporta endpoints. O DNS resolve. Mas cada request cai com "Connection refused" após 5s de timeout. Ninguém mudou nada recentemente — ou pelo menos ninguém se lembra.',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['kubernetes', 'networking', 'networkpolicy', 'troubleshooting'],

  artifacts: [
    {
      id: 'svc-checkout',
      label: '$ kubectl get svc payment-service',
      language: 'bash',
      content: `NAME                TYPE        CLUSTER-IP     PORT(S)   AGE
payment-service     ClusterIP   10.96.45.12    8080/TCP  45d`,
    },
    {
      id: 'endpoints',
      label: '$ kubectl get endpoints payment-service',
      language: 'bash',
      content: `NAME                ENDPOINTS           READY   AGE
payment-service     10.244.2.18:8080    1/1     45d
# Endpoint existe e está pronto — o pod está lá`,
    },
    {
      id: 'netpol',
      label: '$ kubectl get netpol -A | grep payment',
      language: 'bash',
      content: `NAMESPACE    NAME               POD-SELECTOR    AGE
production   payment-deny-all   app=payment    3d`,
    },
    {
      id: 'netpol-yaml',
      label: '$ kubectl describe netpol payment-deny-all -n production',
      language: 'yaml',
      content: `Name:         payment-deny-all
Namespace:    production
Created on:   2026-08-29 14:22
Selector:     app=payment
Policy Types: Ingress
Ingress:
  (no rules — empty ingress = deny all)
# Esta NetworkPolicy foi criada durante um exercício de
# security hardening, mas NÃO abre regra alguma para ingress.`,
    },
    {
      id: 'kubectl-net',
      label: '$ kubectl run test --rm -it --image=busybox --namespace=production -- wget -qO- http://payment-service:8080/health',
      language: 'bash',
      content: `$ kubectl run test --rm -it --image=busybox --namespace=production -- wget -qO- http://payment-service:8080/health
Connecting to payment-service:8080 (10.96.45.12:8080)
wget: connect() timed out
# Timeout — não é "connection refused", é drop silencioso.
# Isto indica firewall/network policy a bloquear, não o serviço down.`,
    },
  ],

  diagnosisQuestion: 'O serviço payment está Running, o endpoint existe, o DNS resolve — mas todos os requests de outros pods timeout. Qual é a causa raiz?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'A NetworkPolicy "payment-deny-all" bloqueia todo o ingress — não tem regras que permitam tráfego de entrada, apenas o Pod IP (loopback)',
      correct: true,
      feedback: 'Exato. Uma NetworkPolicy com PodSelector que seleciona os pods do payment e com PolicyTypes: [Ingress] mas sem ingress rules significa "deny all ingress". Só o tráfego intra-pod (loopback) passa. Todos os outros pods são bloqueados silenciosamente (timeout, não connection-refused).',
    },
    {
      id: 'b',
      label: 'O payment-service está a crashLoopBackOff e o endpoint está outdated',
      correct: false,
      feedback: 'O endpoints mostra 1/1 READY e o IP é 10.244.2.18:8080 — o pod está saudável. O problema não é o estado do pod.',
    },
    {
      id: 'c',
      label: 'O kube-proxy está desconfigurado e não está a fazer iptables para o serviço',
      correct: false,
      feedback: 'Se o kube-proxy estivesse partido, o endpoint nem chegaria ao cluster IP. O fato do wget ir para 10.96.45.12 significa que o serviço e o kube-proxy estão OK. O timeout é no destino final (o pod), não no roteamento.',
    },
    {
      id: 'd',
      label: 'O CNI do cluster não suporta NetworkPolicy e está a ignorar a resource',
      correct: false,
      feedback: 'Se o CNI ignorasse a NetworkPolicy, o tráfego PASSARIA normalmente (default allow). O fato de estar bloqueado prova que o CNI ESTÁ a aplicar a policy. O problema é a policy em si, não o CNI.',
    },
  ],

  fixQuestion: 'Qual a correção para o checkout-service voltar a comunicar com o payment-service?',
  fixOptions: [
    {
      id: 'a',
      label: 'Adicionar uma ingress rule à NetworkPolicy que permita tráfego do namespace/selector do checkout-service para a porta 8080 do payment',
      correct: true,
      feedback: 'Correto. A NetworkPolicy deve ser actualizada para ter uma regra de ingress que permita o tráfego do checkout-service (por namespace selector ou pod selector) à porta 8080. Isto preserva o hardening (deny por defeito) e abre apenas o que é necessário.',
    },
    {
      id: 'b',
      label: 'Eliminar a NetworkPolicy payment-deny-all completamente',
      correct: false,
      feedback: 'Eliminar a policy volta ao default allow — todo o tráfego entra, o que anula o hardening de segurança que a policy pretendia. Não é boa prática remover segurança em vez de a refinar.',
    },
    {
      id: 'c',
      label: 'Adicionar uma regra de firewall no nó que permita porta 8080',
      correct: false,
      feedback: 'NetworkPolicy é aplicado a nível de pod/namespace, não a nível de nó. Regras de firewall no nó não resolvem — a NetworkPolicy está a bloquear antes do tráfego chegar ao iptables do nó.',
    },
    {
      id: 'd',
      label: 'Mudar o payment-service para NodePort em vez de ClusterIP',
      correct: false,
      feedback: 'Mudar o tipo de service não contorna a NetworkPolicy — a policy seleciona por PodSelector, não por Service. O tráfego continuaria bloqueado.',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'Repara na saída do kubectl describe netpol: "Ingress: (no rules — empty ingress = deny all)". Isto é uma pista direta.',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'NetworkPolicy com PodSelector + PolicyTypes: [Ingress] mas sem ingress rules = REGRA DE DENY ALL para ingress. É o comportamento padrão: se a policy seleciona o pod, TODOS os ingressos são bloqueados exceto os explícitamente permitidos.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'A correção é adicionar uma ingress rule que permita tráfego do checkout-service: ingress: [{ from: [{ podSelector: { matchLabels: { app: checkout } } }], ports: [{ port: 8080, protocol: TCP }] }]. Isto mantém o deny-by-default e abre só o necessário.',
    },
  ],

  resolution: {
    rootCause: 'A NetworkPolicy "payment-deny-all" foi criada com um PodSelector que seleciona os pods do payment-service, mas sem nenhuma regra de ingress. Em Kubernetes, uma NetworkPolicy com regras vazias de ingress significa "bloqueia TODO o tráfego de entrada" — apenas o loopback do próprio pod é permitido. Isto é intencional como prática de security hardening (zero-trust networking), mas esqueceu-se de adicionar as regras de exceção para os serviços que precisam de comunicar.',
    fix: 'Atualizar a NetworkPolicy para adicionar uma regra de ingress que permita tráfego do checkout-service. Manter o default-deny e abrir apenas o necessário.',
    preventions: [
      'Usar NetworkPolicies com default-deny em cada namespace e documentar quais serviços precisam de comunicar',
      'Adotar GitOps para NetworkPolicies: nenhuma policy entra em production sem review',
      'Testar comunicação entre serviços após aplicar qualquer NetworkPolicy com kubectl run + wget',
      'Usar kubectl-np-viewer ou network-policy visualizer para ver o impacto antes de aplicar',
      'Manter um inventory de dependências serviço-a-serviço e verificar contra as policies existentes',
    ],
  },
};

// ── AWS S3 Public Bucket ─────────────────────────────────────────────────────
export const awsS3PublicBucket: ChallengeScenario = {
  id: 'aws-s3-public-bucket',
  domain: 'aws',
  title: 'Bucket S3 exposto ao mundo',
  hook: 'O SecurityOps alerta: "Dados Confidenciais visíveis publicamente no S3!" O bucket cdn-assets-prod tem uma bucket policy com Principal: * que foi criada para servir assets estáticos via CloudFront, mas agora qualquer pessoa na internet consegue listar e descarregar tudo — incluindo ficheiros de configuração com credenciais.',
  difficulty: 'mid',
  timeEstimateMin: 5,
  tags: ['aws', 's3', 'security', 'bucket-policy'],

  artifacts: [
    {
      id: 'bucket-policy',
      label: '$ aws s3api get-bucket-policy --bucket cdn-assets-prod',
      language: 'json',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadAssets",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cdn-assets-prod/*"
    }
  ]
}
# Principal: * = qualquer pessoa na internet`,
    },
    {
      id: 'block-public',
      label: '$ aws s3api get-public-access-block --bucket cdn-assets-prod',
      language: 'bash',
      content: `An object-level and bucket-level settings for blocking public access are not set for this bucket.
# Block Public Access NÃO está ativo! Isto permite que a policy com Principal:* funcione.`,
    },
    {
      id: 'cloudtrail',
      label: '$ aws cloudtrail lookup-events --event-name GetObject --max-results 5',
      language: 'json',
      content: `[
  {
    "eventTime": "2024-01-15T14:23:01Z",
    "eventName": "GetObject",
    "userIdentity": { "type": "Unauthenticated" },
    "sourceIPAddress": "198.51.100.50",
    "requestParameters": { "bucketName": "cdn-assets-prod", "key": "config/db-credentials.env" }
  },
  {
    "eventTime": "2024-01-15T14:23:02Z",
    "eventName": "GetObject",
    "userIdentity": { "type": "Unauthenticated" },
    "sourceIPAddress": "198.51.100.50",
    "requestParameters": { "bucketName": "cdn-assets-prod", "key": "config/stripe-key.txt" }
  }
]
# IP externo está a descarregar credenciais ativamente`,
    },
    {
      id: 's3-list',
      label: '$ aws s3 ls s3://cdn-assets-prod/ --recursive | head -15',
      language: 'bash',
      content: `2024-01-10 10:00:00      45231 images/logo.png
2024-01-10 10:00:00      12034 css/main.css
2024-01-10 10:00:00     234567 js/app.bundle.js
2024-01-12 08:30:00       1204 config/db-credentials.env
2024-01-12 08:30:00        892 config/stripe-key.txt
2024-01-12 08:30:00       2341 config/aws-iam-roles.json
# Ficheiros sensíveis misturados com assets públicos no mesmo bucket!`,
    },
  ],

  diagnosisQuestion: 'Qual é a causa raiz da exposição dos dados?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'A bucket policy com Principal: * combinada com Block Public Access desligado permite acesso público a TODO o bucket, incluindo ficheiros sensíveis que nunca deveriam estar lá',
      correct: true,
      feedback: 'Exato. Principal: * significa qualquer utilizador anónimo. Block Public Access desligado significa que a policy prevalece. E os ficheiros sensíveis foram upload para o mesmo bucket que os assets públicos — o problema é duplo: policy errada + separation of concerns falhada.',
    },
    {
      id: 'b',
      label: 'O CloudFront está mal configurado e está a servir ficheiros diretamente do S3 sem autenticação',
      correct: false,
      feedback: 'O CloudFront com OAI (Origin Access Identity) não é o problema aqui — a policy no bucket é a causa direta. O CloudFront só consegue ler o bucket porque a policy permite. O problema raiz é a policy com Principal: *.',
    },
    {
      id: 'c',
      label: 'O bucket foi criado com versioning desligado e os ficheiros antigos permanecem acessíveis',
      correct: false,
      feedback: 'Versioning afeta a capacidade de recuperar versões anteriores, não o acesso público. O problema é a policy, não o versioning.',
    },
    {
      id: 'd',
      label: 'O IAM user que fez upload tinha permissões excessivas e deveria ter usado uma role',
      correct: false,
      feedback: 'O IAM user ter permissões excessivas é um problema separado. A causa direta da exposição é a bucket policy com Principal: *. Mesmo com o IAM correto, a policy tornaria o bucket público.',
    },
  ],

  fixQuestion: 'Qual a sequência correta de ações para conter e resolver o incidente?',
  fixOptions: [
    {
      id: 'a',
      label: 'Remover a bucket policy (volta ao default deny), ativar Block Public Access, rodar rotas de credenciais expostas, separar assets de dados sensíveis em buckets diferentes',
      correct: true,
      feedback: 'Correto. 1) Remover policy = volta ao default deny (contenção imediata). 2) Block Public Access = proteção contra reincidência. 3) Rotate credenciais = resposta ao dano. 4) Separar buckets = prevenção estrutural. É uma abordagem em camadas.',
    },
    {
      id: 'b',
      label: 'Adicionar uma condição IP whitelisted à policy existente para restringir o acesso',
      correct: false,
      feedback: 'IP blocking é workaround — não resolve o problema de fundo. Outros IPs poderão descobrir o bucket e o problema de separation of concerns permanece.',
    },
    {
      id: 'c',
      label: 'Mover os assets para o CloudFront com presigned URLs em vez de corrigir o bucket',
      correct: false,
      feedback: 'Presigned URLs resolvem para acesso individual mas são complexas para assets estáticos do frontend. O problema raiz (policy com Principal: *) permanece e continua a expor ficheiros sensíveis.',
    },
    {
      id: 'd',
      label: 'Desativar o bucket e notificar os clientes afetados',
      correct: false,
      feedback: 'Desativar o bucket quebra o frontend completamente. A contenção deve ser seletiva (remover a policy, não destruir o recurso).',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'A bucket policy tem "Principal": "*". Isto significa literalmente "qualquer pessoa". Combine isso com o facto de o Block Public Access estar desligado.',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'No S3, o default é DENY — se não há policy, ninguém acede. Ao adicionar uma policy com Principal: *, estás a mudar ativamente de deny para allow. Remover a policy volta ao default deny.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Solução em camadas: (1) Remover policy → contenção imediata; (2) Block Public Access → proteção futura; (3) Rotate credenciais → resposta ao dano; (4) Separar buckets → prevenção estrutural. Assets públicos num bucket, dados sensíveis noutro com IAM restrito.',
    },
  ],

  resolution: {
    rootCause: 'Um developer criou uma bucket policy com Principal: * para servir assets estáticos via CloudFront, mas esqueceu-se de que isto torna TODO o conteúdo do bucket publicamente acessível — não apenas os assets. Ficheiros de configuração com credenciais de DB, Stripe e IAM roles foram upload para o mesmo bucket e estão a ser descarregados ativamente por IPs não-autenticados.',
    fix: 'Remover a bucket policy imediatamente (volta ao default deny). Ativar S3 Block Public Access em nível de conta. Rodar rotas de todas as credenciais expostas. Separar assets públicos num bucket com OAI do CloudFront e dados sensíveis noutro bucket com acesso IAM restrito.',
    preventions: [
      'Ativar S3 Block Public Access em nível de conta/organização — previne buckets públicos por default',
      'AWS Config managed rule s3-bucket-policy-prohibited-principals — deteta violations automaticamente',
      'Separar buckets por sensibilidade: assets públicos vs dados confidenciais em buckets diferentes',
      'Infra como código com review obrigatório para changes de bucket policy',
      'NUNCA fazer upload de credenciais para S3 — usar AWS Secrets Manager ou SSM Parameter Store',
      'Alertas CloudWatch para eventos GetObject de unauthenticated principal',
    ],
  },
};

// ── Linux OOM Killer ─────────────────────────────────────────────────────────
export const linuxOomKill: ChallengeScenario = {
  id: 'linux-oom-kill-postgres',
  domain: 'devops',
  title: 'PostgreSQL morto pelo OOM Killer',
  hook: 'O serviço PostgreSQL no servidor de production morre a cada 20 minutos com "Out of memory: Killed process". O admin acha que é um memory leak no PostgreSQL mas os logs do PostgreSQL mostram que o processo foi terminado pelo kernel, não por erro interno.',
  difficulty: 'junior',
  timeEstimateMin: 5,
  tags: ['linux', 'memory', 'oom', 'postgresql', 'systemd'],

  artifacts: [
    {
      id: 'dmesg-oom',
      label: '$ sudo dmesg | grep -i "out of memory" | tail -5',
      language: 'log',
      content: `[18234.123456] postgres invoked oom-killer: gfp_mask=0x6200ca(GFP_HIGHUSER_MOVABLE), order=0, oom_score_adj=0
[18234.123490] oom-kill:constraint=CONSTRAINT_NONE,nodemask=(null),cpuset=/,mems_allowed=0,global_oom,task_memcg=/system.slice/postgresql.service,task=postgres,pid=4521,uid=110
[18234.123500] Out of memory: Killed process 4521 (postgres) total-vm:2048000kB, anon-rss:945012kB, file-rss:10240kB, shmem-rss:0kB, UID:110 pgtables:18432kB oom_score_adj:0`,
    },
    {
      id: 'free-mem',
      label: '$ free -h',
      language: 'bash',
      content: `              total        used        free      shared  buff/cache   available
Mem:           7.7Gi       6.8Gi       340Mi       230Mi       720Mi       680Mi
Swap:          2.0Gi       1.8Gi       196Mi`,
    },
    {
      id: 'ps-memory',
      label: '$ ps aux --sort=-%mem | head -10',
      language: 'bash',
      content: `USER       PID  %MEM   RSS     COMMAND
postgres  4100   18.2   1.4G    postgres: writer process
postgres  4102   12.5   980M    postgres: autovacuum worker
postgres  4105    8.1   640M    postgres: stats collector
node      3201    7.4   580M    node /app/api-server/index.js
redis     1501    3.2   250M    redis-server *:6379
root      1200    1.1    86M    /usr/lib/systemd/systemd`,
    },
    {
      id: 'systemd-cgroup',
      label: '$ cat /sys/fs/cgroup/memory/system.slice/postgresql.service/memory.max',
      language: 'bash',
      content: `966367641
# 966367641 bytes = ~921 MiB — limite de memória do cgroup do PostgreSQL`,
    },
  ],

  diagnosisQuestion: 'O PostgreSQL está a ser morto pelo OOM Killer. Analisando os artifacts, qual é a causa raiz?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'O PostgreSQL está perto do limite de memória do cgroup (~921 MiB) e, com a carga atual de workers + autovacuum + o node-api ao lado, o sistema entra em pressão de memória e o OOM Killer escolhe o PostgreSQL',
      correct: true,
      feedback: 'Exato. O postgres tem um limite de ~921 MiB no cgroup. Os workers usam ~1.4 GB somados (writer + autovacuum + stats), mas o anem-rss do processo morto foi 945 MB — quase no limite. O node-api (580 MB) e o redis (250 MB) no mesmo host competem pela memória, e quando o sistema entra em pressão, o OOM Killer mata o processo com maior RSS que excede o cgroup.',
    },
    {
      id: 'b',
      label: 'O PostgreSQL tem um memory leak e precisa de ser reiniciado com patch',
      correct: false,
      feedback: 'Os logs mostram "Killed process" do OOM Killer, não erro interno do PostgreSQL. O PostgreSQL não tem memory leak — foi o kernel que o matou porque excedeu o limite de memória do cgroup.',
    },
    {
      id: 'c',
      label: 'O swap está cheio (1.8 GiB de 2 GiB) e o kernel não consegue mais fazer swap',
      correct: false,
      feedback: 'O swap cheio é sintoma, não causa. O problema fundamental é que o PostgreSQL excede o limite do cgroup (~921 MiB) e, com memória RAM e swap quase esgotados, o OOM Killer intervém. Aumentar swap adia o problema mas não o resolve.',
    },
    {
      id: 'd',
      label: 'O processo node-api está a consumir toda a memória e o OOM Killer deveria matar esse processo em vez do PostgreSQL',
      correct: false,
      feedback: 'O OOM Killer escolhe com base no oom_score (RSS, tempo de vida, etc.). O PostgreSQL tem maior RSS (~945 MB anon-rss) que o node-api (580 MB), por isso o kernel escolheu o PostgreSQL. O problema não é a escolha do OOM Killer, é que nenhum dos processos deveria estar nestes níveis de memória.',
    },
  ],

  fixQuestion: 'Qual a melhor abordagem para resolver o problema de forma sustentável?',
  fixOptions: [
    {
      id: 'a',
      label: 'Aumentar o memory.max do cgroup do PostgreSQL para ~2 GiB, reduzir work_mem do PostgreSQL, e considerar separar o node-api para outro host/container',
      correct: true,
      feedback: 'Correto. A solução em camadas: (1) Aumentar o limite do cgroup para dar headroom; (2) Reduzir work_mem para limitar a memória por operação; (3) Separar serviços no mesmo host evita competição por memória. Isto resolve a causa raiz em vez de paliativos.',
    },
    {
      id: 'b',
      label: 'Aumentar o swap para 8 GiB e o problema resolve-se',
      correct: false,
      feedback: 'Swap extra adia o OOM mas não o resolve. PostgreSQL com swap excessivo tem performance terrível (IO é 100x mais lento que RAM). E o limite do cgroup de 921 MiB continua a ser excedido.',
    },
    {
      id: 'c',
      label: 'Desligar o OOM Killer com oom_kill_disable=1 no kernel',
      correct: false,
      feedback: 'Desligar o OOM Killer é perigoso — num cenário real de pressão de memória, o kernel não consegue proteger o sistema e pode travar completamente. É uma solução que substitui um problema por outro muito pior.',
    },
    {
      id: 'd',
      label: 'Matar o processo node-api para libertar memória para o PostgreSQL',
      correct: false,
      feedback: 'Matar o node-api é uma solução temporária e destrutiva. O node-api é um serviço ativo de production. O problema é a gestão de memória do PostgreSQL, não a existência do node-api.',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O dmesg mostra "task=postgres,pid=4521,anon-rss:945012kB". Isto é ~923 MB de memória física. Compara com o memory.max do cgroup.',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'O memory.max é 966367641 bytes ≈ 921 MiB. O PostgreSQL usava 945 MB — excedeu o limite em ~24 MB. O OOM Killer intervém quando um processo cgroup excede o limite E o sistema está sob pressão de memória.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Solução em camadas: aumentar memory.max para ~2 GiB (headroom), reduzir work_mem no PostgreSQL (ex: 50MB em vez de 200MB), e separar o node-api para outro host. O problema de fundo é multi-tenancy sem isolation adequada.',
    },
  ],

  resolution: {
    rootCause: 'O PostgreSQL está contido num cgroup com memory.max de ~921 MiB, mas os seus workers (writer + autovacuum + stats) consomem ~1.4 GB de RSS somados. O processo individual de postgres que morreu tinha 945 MB de anon-rss, excedendo o limite do cgroup. Com o node-api (580 MB) e redis (250 MB) no mesmo host, a memória total do sistema (7.7 GiB) está sob pressão, e o OOM Killer do kernel intervém.',
    fix: 'Aumentar memory.max para ~2 GiB, reduzir work_mem do PostgreSQL para ~50MB, e considerar separar o node-api para outro host ou container. Adicionar memória ao host se necessário.',
    preventions: [
      'Definir memory.max com pelo menos 2x o uso médio observado (headroom para picos)',
      'Configurar work_mem no PostgreSQL de forma conservadora (50-100 MB) para operações complexas',
      'Monitorizar memória por cgroup com Prometheus node_exporter + alerta a 75%',
      'Separar serviços de diferente sensibilidade em containers/host diferentes',
      'Evitar swap excessivo — se o PostgreSQL está a swap, a performance é ruim de qualquer forma',
    ],
  },
};

// ── Terraform State Lock ─────────────────────────────────────────────────────
export const terraformStateLock: ChallengeScenario = {
  id: 'terraform-state-lock',
  domain: 'devops',
  title: 'Terraform bloqueado pelo state lock',
  hook: 'O pipeline de CI/CD está bloqueado há 2 horas. O Terraform apply falha com "Error acquiring the state lock". O message diz "Another operation is ongoing". Mas ninguém está a correr Terraform manualmente. O lock aparece e desaparece aleatoriamente, bloqueando todos os deploys.',
  difficulty: 'junior',
  timeEstimateMin: 4,
  tags: ['terraform', 'ci-cd', 'state', 'locking'],

  artifacts: [
    {
      id: 'tf-apply-error',
      label: '$ terraform apply -auto-approve 2>&1 | tail -20',
      language: 'bash',
      content: `Acquiring state lock. This may take a few moments...
╷
│ Error: Error acquiring the state lock
│
│ Error message: ConditionalCheckFailedException: The conditional request failed
│ Lock Info:
│   ID:        a1b2c3d4-5678-90ab-cdef-1234567890ab
│   Path:      terraform/prod/vpc
│   Operation: OperationTypeApply
│   Who:       runner@gh-runner-01
│   Version:   1.8.5
│   Created:   2026-09-01 06:00:00.000000 +0000 UTC
│   Info:
│
│ Terraform acquires a state lock to protect the state from being written
│ by multiple users at the same time. Please resolve the issue above and
│ continue only once the lock is released.
╵`,
    },
    {
      id: 'dynamodb-lock',
      label: '$ aws dynamodb get-item --table terraform-state-locks --key \'{"lock_id":{"S":"terraform/prod/vpc"}}\'',
      language: 'bash',
      content: `{
  "Item": {
    "lock_id": { "S": "terraform/prod/vpc" },
    "operation": { "S": "OperationTypeApply" },
    "who": { "S": "runner@gh-runner-01" },
    "version": { "S": "1.8.5" },
    "created": { "S": "2026-09-01T06:00:00Z" },
    "info": { "S": "" }
  }
}
# Lock existe desde 06:00 UTC — são 2+ horas. Isto é uma lock stale (fantasma).`,
    },
    {
      id: 'github-actions',
      label: '$ gh run list --repo org/prod-infra --workflow deploy.yml --status failed --limit 5',
      language: 'bash',
      content: `SHA           BRANCH       STATUS    CONCLUSION  TIME
abc1234       main         failure  failed      2h15m ago
def5678       main         failure  failed      2h10m ago
ghi9012       main         failure  failed      2h05m ago
jkl3456       main         failure  failed      2h00m ago
# Todos os runs falharam com o mesmo erro de lock. O pipeline está em loop.`,
    },
    {
      id: 'dynamodb-streams',
      label: '$ aws dynamodb describe-table --table-name terraform-state-locks',
      language: 'bash',
      content: `Table name: terraform-state-locks
Status: ACTIVE
Key schema: lock_id (HASH)
Attribute definitions: lock_id (S)
Billing mode: PAY_PER_REQUEST
# Tabela DynamoDB simples, sem timeout configurado no lock.
# O lock nunca expira automaticamente!`,
    },
  ],

  diagnosisQuestion: 'O lock existe no DynamoDB mas não há nenhum processo Terraform ativo. Qual é a natureza do problema?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'É um lock stale (fantasma): um runner anterior morreu sem libertar o lock, e como a tabela DynamoDB não tem TTL, o lock permanece para sempre até ser removido manualmente',
      correct: true,
      feedback: 'Exato. O runner@gh-runner-01 iniciou um apply há 2+ horas, morreu (timeout do GitHub Actions, cancelamento, etc.) sem libertar o lock. Como a tabela de locks não tem TTL (Time-To-Live) configurado, o lock persiste infinitamente. Todos os runs subsequentes tentam adquirir o lock e falham.',
    },
    {
      id: 'b',
      label: 'Dois runners estão a correr Terraform simultaneamente e estão em race condition',
      correct: false,
      feedback: 'Se houvesse dois runners ativos, veríamos dois locks com timestamps recentes. O lock existe desde 06:00 (2+ horas) e o who é runner@gh-runner-01 (singular). É um lock antigo de um processo que já morreu, não uma race condition ativa.',
    },
    {
      id: 'c',
      label: 'A tabela DynamoDB está com throttling e o Terraform não consegue adquirir o lock',
      correct: false,
      feedback: 'Throttling causaria erros de rate-limiting, não locks persistentes. O erro é "ConditionalCheckFailedException" que indica que o lock já existe, não que a tabela não responde.',
    },
    {
      id: 'd',
      label: 'O Terraform state file está corrompido e o lock não consegue ser criado',
      correct: false,
      feedback: 'O estado corrompido causaria erros diferentes (state lock error é específico de DynamoDB). O lock existe — o problema é que não pode ser removido porque não há TTL.',
    },
  ],

  fixQuestion: 'Qual a correção imediata e a prevenção a longo prazo?',
  fixOptions: [
    {
      id: 'a',
      label: 'Remover manualmente o lock stale do DynamoDB e configurar TTL na tabela para locks sem uso > 1 hora',
      correct: true,
      feedback: 'Correto. (1) Remoção manual resolve o bloqueio imediato: aws dynamodb delete-item com o lock_id. (2) TTL na tabela de locks evita locks fantasmas futuros — o DynamoDB expurga automaticamente itens antigos.',
    },
    {
      id: 'b',
      label: 'Aumentar o timeout do GitHub Actions workflow para 4 horas',
      correct: false,
      feedback: 'Aumentar timeout apenas adia o problema. Se o runner morrer, o lock continua a existir. O problema é a falta de TTL no lock, não a duração do timeout.',
    },
    {
      id: 'c',
      label: 'Desativar o state locking do Terraform para evitar conflitos',
      correct: false,
      feedback: 'Desativar state locking é perigoso — em multi-runner ou multi-dev, dois Terraforms a escrever o mesmo state simultaneamente corrompem o estado. Locking é essencial para integridade.',
    },
    {
      id: 'd',
      label: 'Migrar o state de DynamoDB para S3 com versioning',
      correct: false,
      feedback: 'Migrar para S3 não remove o problema de locks — o Terraform usa DynamoDB mesmo com backend S3 (o DynamoDB é apenas para locking). O problema persistiria com outro par de tables.',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O lock foi criado às 06:00 UTC e são agora 2+ horas depois. O who é "runner@gh-runner-01" — um GitHub Actions runner. Os runs falharam em loop. Isto parece um lock de processo morto.',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'O Terraform usa DynamoDB para locks com condition writes (ConditionalCheckFailedException). Se o runner morre sem correr terraform state unlock, o lock fica para sempre — a menos que haja um mecanismo de expiração.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Solução: (1) Remover manualmente o lock stale com aws dynamodb delete-item --table terraform-state-locks --key \'{"lock_id": {"S": "terraform/prod/vpc"}}\'. (2) Configurar TTL na tabela DynamoDB com attribute "expires" para expurgar locks antigos automaticamente.',
    },
  ],

  resolution: {
    rootCause: 'Um runner do GitHub Actions iniciou um terraform apply, morreu (timeout de 30min do runner ou cancelamento) sem libertar o lock DynamoDB. Como a tabela de locks não tem TTL configurado, o lock permanece para sempre. Todos os runs subsequentes tentam adquirir o lock, falham com ConditionalCheckFailedException, e entram em retry loop no pipeline.',
    fix: 'Remoção manual imediata do lock stale do DynamoDB. Configurar TTL na tabela terraform-state-locks (attribute: expires, TTL: 3600 segundos) para evitar locks fantasmas futuros.',
    preventions: [
      'Configurar TTL na tabela DynamoDB de locks do Terraform (1h de expiry)',
      'Adicionar try/finally no workflow para correr terraform force-unlock em caso de falha',
      'Usar terraform state lock timeout: timeout = "10m" no backend config',
      'Monitorizar locks antigos com CloudWatch alarmes (>30 min = alert)',
      'Documentar runbook de recuperação de locks stuck para a equipa de platform',
    ],
  },
};

// ── DNS Resolution Fail ──────────────────────────────────────────────────────
export const networkingDnsChallenge: ChallengeScenario = {
  id: 'dns-resolution-fail',
  domain: 'networking',
  title: 'Site não carrega mas ping funciona',
  hook: 'O suporte recebeu um ticket: "O site company.com não abre no browser mas o servidor responde a ping". Os utilizadores dizem que o erro é "DNS_PROBE_FINISHED_NXDOMAIN". Qual é o problema?',
  difficulty: 'junior',
  timeEstimateMin: 4,
  tags: ['dns', 'networking', 'troubleshooting', 'http'],

  artifacts: [
    {
      id: 'ping',
      label: '$ ping company.com',
      language: 'bash',
      content: `PING company.com (93.184.216.34) 56(84) bytes of data.
64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=12.3 ms
64 bytes from 93.184.216.34: icmp_seq=2 ttl=56 time=11.8 ms
64 bytes from 93.184.216.34: icmp_seq=3 ttl=56 time=12.1 ms`,
    },
    {
      id: 'dig',
      label: '$ dig company.com +short',
      language: 'bash',
      content: `; <<>> DiG 9.18.12 <<>> company.com +short
;; global options: +cmd
;; WARNING: .com is a reserved TLD in some environments
;; no answer from server`,
    },
    {
      id: 'dig-ns',
      label: '$ dig company.com NS',
      language: 'bash',
      content: `;; QUESTION SECTION:
;company.com.			IN	NS

;; ANSWER SECTION:
company.com.		3600	IN	NS	ns1.example-registrar.com.
company.com.		3600	IN	NS	ns2.example-registrar.com.`,
    },
    {
      id: 'dig-a',
      label: '$ dig company.com A',
      language: 'bash',
      content: `;; QUESTION SECTION:
;company.com.			IN	A

;; ANSWER SECTION:
company.com.		300	IN	A	93.184.216.34`,
    },
  ],

  diagnosisQuestion: 'O ping funciona (resolve para 93.184.216.34) mas o browser diz "DNS_PROBE_FINISHED_NXDOMAIN". O que está errado?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'O registo A existe e funciona — o problema está no cache DNS local ou no resolver do browser que está a usar um DNS corrupto',
      correct: true,
      feedback: 'Exato. O dig mostra que o registo A existe e resolve corretamente. O NXDOMAIN no browser indica que o DNS resolver que o browser está a usar (DNS-over-HTTPS do browser, ou cache corrompida) está a retornar erro. O ping usa o resolver do sistema que funciona.',
    },
    {
      id: 'b',
      label: 'O servidor web está Down',
      correct: false,
      feedback: 'O ping responde com 12ms de latência — o servidor está up. O problema é no DNS, não no servidor.',
    },
    {
      id: 'c',
      label: 'O ficheiro /etc/hosts tem uma entrada errada',
      correct: false,
      feedback: 'Se houvesse uma entrada errada no hosts, o ping também falharia. O ping funciona, logo o hosts está OK.',
    },
    {
      id: 'd',
      label: 'A zona DNS company.com foi deletada do DNS authoritative',
      correct: false,
      feedback: 'O dig mostra a zona ativa com NS records e o A record responde. A zona não foi deletada.',
    },
  ],

  fixQuestion: 'Qual a correção para o browser voltar a funcionar?',
  fixOptions: [
    {
      id: 'a',
      label: 'Limpar o cache DNS do sistema e/ou mudar o DNS do browser para um resolver público (1.1.1.1 ou 8.8.8.8)',
      correct: true,
      feedback: 'Correto. Flushing o cache DNS (sudo systemd-resolve --flush-caches ou ipconfig /flushdns) resolve o problema. Se usar DNS-over-HTTPS no browser, desligar e voltar ao DNS do sistema.',
    },
    {
      id: 'b',
      label: 'Recriar o registo A no DNS authoritative',
      correct: false,
      feedback: 'O registo A já existe e funciona (dig retorna 93.184.216.34). Não precisa de ser recriado.',
    },
    {
      id: 'c',
      label: 'Comprar um domínio novo porque company.com está corrupto',
      correct: false,
      feedback: 'O domínio está saudável — o dig prova. O problema é local (cache/resolver), não do domínio.',
    },
    {
      id: 'd',
      label: 'Instalar um novo browser porque o atual tem bug',
      correct: false,
      feedback: 'Não é um bug do browser. Outros browsers com o mesmo cache DNS corrupta teriam o mesmo problema. A causa é o resolver DNS, não o browser em si.',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O ping funciona — o que isso te diz sobre o estado do servidor e da rede?',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'O erro "DNS_PROBE_FINISHED_NXDOMAIN" é um erro do CHROME/EDGE. Significa que o browser recebeu "NXDOMAIN" (Non-Existent Domain) do seu DNS resolver. Mas o dig mostra que o domínio EXISTE. Há uma contradição.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Chrome e Edge usam DNS-over-HTTPS (DoH) por padrão, que pode ter o seu próprio cache separado do resolver do sistema. O cache DoH pode ficar corrupto. Flush DNS do sistema (ipconfig /flushdns no Windows, sudo systemd-resolve --flush-caches no Linux) resolve.',
    },
  ],

  resolution: {
    rootCause: 'O browser Chrome/Edge usa DNS-over-HTTPS com cache própria. O cache DoH ficou com um entry inválido (NXDOMAIN) para company.com, possivelmente devido a uma resolução anterior falhada ou a uma mudança recente na zona DNS. O resolver do sistema (usado pelo ping) funciona corretamente.',
    fix: 'Limpar cache DNS do sistema e desligar/religar DNS-over-HTTPS no browser. No Chrome: chrome://settings/security → "Use secure DNS" → desligar, ou usar chrome://net-internals/#dns → "Clear host cache".',
    preventions: [
      'Monitorizar tempo de propagação DNS após mudanças de zona',
      'Usar DNS local com TTL curto (300s) durante migrações',
      'Educar a equipa de suporte para tentar flush DNS antes de abrir tickets',
      'Configurar DoH apenas com resolvers confiáveis (1.1.1.1, 8.8.8.8)',
    ],
  },
};

// ── Python Subprocess Hang ───────────────────────────────────────────────────
export const pythonSubprocessChallenge: ChallengeScenario = {
  id: 'python-subprocess-hang',
  domain: 'python',
  title: 'Script Python fica hang ao correr comando externo',
  hook: 'Um script de deploy Python fica pendurado (hang) quando chama subprocess.run() para correr um comando que demora 30 segundos. O script não morre, não retorna, e o timeout do CI (60s) faz falhar o pipeline. O mesmo comando corre normalmente no terminal. O que está mal?',
  difficulty: 'mid',
  timeEstimateMin: 5,
  tags: ['python', 'subprocess', 'deadlock', 'pipes', 'timeout'],

  artifacts: [
    {
      id: 'code',
      label: 'Código do deploy script',
      language: 'python',
      content: `import subprocess

def deploy():
    result = subprocess.run(
        ["./run-long-task.sh"],
        capture_output=True,
        text=True,
        timeout=60
    )
    print(f"Exit code: {result.returncode}")
    print(f"Output: {result.stdout}")
    print(f"Errors: {result.stderr}")

if __name__ == "__main__":
    deploy()`,
    },
    {
      id: 'script',
      label: 'Conteúdo de run-long-task.sh',
      language: 'bash',
      content: `#!/bin/bash
# Simula um deploy longo
echo "Starting deployment..."
for i in $(seq 1 30); do
    echo "Step $i/30"
    sleep 1
done
echo "Deployment complete!"
exit 0`,
    },
    {
      id: 'hang-log',
      label: 'Log do CI (hang)',
      language: 'log',
      content: `$ python deploy.py
Starting deployment...
Step 1/30
Step 2/30
Step 3/30
...
Step 27/30
Step 28/30
[PROCESS HANGS HERE - no output for 35+ seconds]
[CI timeout: job killed after 60s]`,
    },
    {
      id: 'strace',
      label: '$ strace -p <pid> (durante hang)',
      language: 'bash',
      content: `strace: Process 12345 attached
futex(0x7f1234567890, FUTEX_WAIT_PRIVATE, 2, NULL) = ?
<... futex resumed>
futex(0x7f1234567891, FUTEX_WAIT_PRIVATE, 3, NULL) = ?
<... futex resumed>
write(2, "Step 29/30\n", 11Step 29/30
)           = 11
futex(0x7f1234567890, FUTEX_WAIT_PRIVATE, 4, NULL) = ?
<... futex resumed>
--- SIGTERM {si_signo=SIGTERM, si_code=SI_USER, si_pid=1} ---
+++ killed by SIGTERM +++`,
    },
  ],

  diagnosisQuestion: 'Porque é que o script Python fica pendurado em vez de retornar após o timeout?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'O subprocess.run com capture_output=True captura stdout e stderr em pipes. Se o output for grande o suficiente para encher o pipe buffer, o processo filho bloqueia na write e o pai espera pelo filho — deadlock.',
      correct: true,
      feedback: 'Correto. Este é o deadlock clássico do subprocess. O pipe de stdout tem ~64KB. Se o processo filho escrever mais do que cabe no pipe, ele bloqueia. O Python espera pelo filho terminar (wait()), mas o filho está bloqueado na write. Deadlock.',
    },
    {
      id: 'b',
      label: 'O timeout=60 não funciona com subprocess.run',
      correct: false,
      feedback: 'O timeout funciona — o log mostra que o processo foi killed por SIGTERM após 60s. O problema não é o timeout, é que o processo FICA pendurado antes do timeout expirar.',
    },
    {
      id: 'c',
      label: 'O script bash tem um loop infinito',
      correct: false,
      feedback: 'O loop vai de 1 a 30 com sleep 1 — são 30 segundos, não infinito. O strace mostra que o script chegou ao step 29 e morreu.',
    },
    {
      id: 'd',
      label: 'O Python não suporta subprocessos que duram mais de 30 segundos',
      correct: false,
      feedback: 'Python suporta subprocessos de qualquer duração. O problema é específico do padrão de uso do subprocess com pipes.',
    },
  ],

  fixQuestion: 'Qual a correção para evitar o deadlock?',
  fixOptions: [
    {
      id: 'a',
      label: 'Usar stdout=subprocess.PIPE e stderr=subprocess.PIPE explicitamente, e usar communicate() em vez de capture_output, ou usar timeout + stream o output diretamente para um ficheiro',
      correct: true,
      feedback: 'Correto. A solução mais simples é redirecionar output para ficheiro/em devnull, ou usar Popen com communicate() que lê os pipes em threads separadas, evitando o deadlock.',
    },
    {
      id: 'b',
      label: 'Aumentar o timeout para 120 segundos',
      correct: false,
      feedback: 'Aumentar timeout adia o problema mas não o resolve. O deadlock acontece independentemente do timeout — o processo filho bloqueia na write e o pai espera pelo filho.',
    },
    {
      id: 'c',
      label: 'Adicionar os.sleep(0) no loop do script bash',
      correct: false,
      feedback: 'Isso não resolve o deadlock do subprocess. O problema é no lado do Python, não no script bash.',
    },
    {
      id: 'd',
      label: 'Usar os.system() em vez de subprocess.run()',
      correct: false,
      feedback: 'os.system() não permite capturar output nem timeout. Piora o problema em vez de resolver.',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O strace mostra que o processo filho (bash) chegou ao step 29/30 e ficou bloqueado num futex. Isto significa que tentou escrever num pipe que estava cheio.',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'capture_output=True é equivalente a stdout=subprocess.PIPE e stderr=subprocess.PIPE. O Python cria um pipe para cada stream. O processo filho bloqueia quando o pipe enche (geralmente 64KB). O Python espera pelo filho terminar. Deadlock.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Soluções: (1) stdout=open("log.txt","w") — redirecionar para ficheiro, (2) usar Popen + communicate() que lê pipes em threads, (3) stderr=subprocess.DEVNULL se não precisas do erro. A raiz é: NUNCA uses capture_output=True com processos que produzem muito output sem timeout adequado.',
    },
  ],

  resolution: {
    rootCause: 'O subprocess.run com capture_output=True cria pipes para stdout e stderr. O script bash produz ~1KB por linha (echo "Step N/30") × 30 linhas = ~30KB, que cabe no pipe. Mas quando o Python tenta ler o output após o processo terminar, o buffer do pipe já estava parcialmente cheio e o processo filho bloqueou numa write subsequente. O pai espera pelo filho terminar (wait) e o filho espera pelo pai ler o pipe — deadlock clássico de pipes.',
    fix: 'Usar Popen com communicate() que lê os pipes concorrentemente em threads separadas, evitando o deadlock. Ou redirecionar output para ficheiro diretamente.',
    preventions: [
      'Sempre usar timeout em subprocess.run() para evitar hangs infinitos',
      'Para processos com output grande, usar Popen + communicate() em vez de run()',
      'Redirecionar output para ficheiro em vez de capturar na memória',
      'Adicionar logging de debugging com subprocess.Popen e readlines()',
      'Usar asyncio.subprocess para operações assíncronas sem bloquear',
    ],
  },
};

// ── Linux Cron Troubleshooting ───────────────────────────────────────────────
export const linuxCronTroubleshooting: ChallengeScenario = {
  id: 'linux-cron-troubleshooting',
  domain: 'devops',
  title: 'Backup automático não executa à hora certa',
  hook: 'O script de backup da base de dados deveria executar todos os dias à meia-noite (00:00). No entanto, a equipa queixa-se que os backups nunca são gerados. O script funciona perfeitamente quando executado à mão. Qual é o problema do Cron?',
  difficulty: 'junior',
  timeEstimateMin: 4,
  tags: ['linux', 'cron', 'troubleshooting'],

  artifacts: [
    {
      id: 'crontab-file',
      label: '$ crontab -l',
      language: 'bash',
      content: `# Edit this file to introduce tasks to be run by cron.
# m h  dom mon dow   command
* 0 * * * /opt/scripts/backup-db.sh > /var/log/backup.log 2>&1`,
    },
    {
      id: 'cron-log',
      label: '$ grep CRON /var/log/syslog | grep backup',
      language: 'log',
      content: `Oct 10 00:00:01 srv-db CRON[1204]: (root) CMD (/opt/scripts/backup-db.sh > /var/log/backup.log 2>&1)
Oct 10 00:01:01 srv-db CRON[1225]: (root) CMD (/opt/scripts/backup-db.sh > /var/log/backup.log 2>&1)
Oct 10 00:02:01 srv-db CRON[1243]: (root) CMD (/opt/scripts/backup-db.sh > /var/log/backup.log 2>&1)
Oct 10 00:03:01 srv-db CRON[1260]: (root) CMD (/opt/scripts/backup-db.sh > /var/log/backup.log 2>&1)`,
    },
    {
      id: 'backup-log',
      label: '$ cat /var/log/backup.log',
      language: 'log',
      content: `Error: A backup is already in progress. Lock file exists. Aborting.`,
    }
  ],

  diagnosisQuestion: 'Observando o crontab e os logs, porque é que os backups falham?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'A expressão cron (* 0 * * *) está a executar o script TODOS os minutos durante a hora zero (da meia-noite às 00:59), colidindo consigo mesmo e falhando devido ao ficheiro de lock.',
      correct: true,
      feedback: 'Exatamente! A sintaxe * 0 * * * significa "a cada minuto, da hora 0, todos os dias". Como o backup demora, a execução do minuto 00:01 deteta que a do minuto 00:00 ainda está a correr (lock file), e cancela, destruindo o log.',
    },
    {
      id: 'b',
      label: 'O daemon cron não está a correr ou tem a timezone errada.',
      correct: false,
      feedback: 'O syslog mostra o cron a executar o script repetidamente. Logo o serviço está ativo e à hora certa.',
    },
    {
      id: 'c',
      label: 'O ficheiro script não tem permissões de execução (chmod +x).',
      correct: false,
      feedback: 'Se não tivesse permissões de execução, o erro seria "Permission denied", não "A backup is already in progress".',
    },
    {
      id: 'd',
      label: 'O ficheiro crontab não tem uma nova linha no final.',
      correct: false,
      feedback: 'Embora a nova linha seja um requisito em algumas implementações cron, aqui vemos pelos logs que a task está a ser trigada.',
    },
  ],

  fixQuestion: 'Como corriges a expressão cron para executar APENAS uma vez à meia-noite exata?',
  fixOptions: [
    {
      id: 'a',
      label: '0 0 * * *',
      correct: true,
      feedback: 'Correto. O primeiro campo (minutos) deve ser 0 para executar exatamente ao minuto zero. "0 0 * * *" = Minuto 0, Hora 0, Todos os dias.',
    },
    {
      id: 'b',
      label: '1 0 * * *',
      correct: false,
      feedback: 'Isto executaria às 00:01, o que é válido, mas não cumpre o requisito de "meia-noite exata" (00:00).',
    },
    {
      id: 'c',
      label: '*/60 * * * *',
      correct: false,
      feedback: 'Sintaxe inválida. Para indicar a cada x horas usa-se o segundo campo.',
    },
    {
      id: 'd',
      label: '* * 0 * *',
      correct: false,
      feedback: 'O terceiro campo é o dia do mês. Dia 0 não existe (os dias do mês começam em 1).',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'Observa bem a primeira coluna do crontab. Um asterisco (*) significa "todos/sempre".',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'O log do syslog mostra o cron a disparar o evento às 00:00:01, 00:01:01, 00:02:01... Será que isto é o comportamento desejado?',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Um asterisco no primeiro campo (minutos) faz o job correr a cada minuto se a hora fizer match. Deves fixar o minuto no valor 0.',
    },
  ],

  resolution: {
    rootCause: 'A expressão cron (* 0 * * *) estava mal configurada. O asterisco na posição dos minutos fazia com que o cron disparasse a tarefa repetidamente (60 vezes) entre as 00:00 e as 00:59. Como os scripts tentavam correr simultaneamente, batiam num conflito de "lock file" e o processo global nunca concluía corretamente.',
    fix: 'Alterar a expressão de `* 0 * * *` para `0 0 * * *`, garantindo o disparo único.',
    preventions: [
      'Usar validadores de cron (ex: crontab.guru) antes de instalar regras',
      'Testar scripts de cron de hora a hora (`0 * * * *`) antes de passar para diário',
      'Escrever scripts idempotentes que lidam bem com bloqueios e concorrência',
    ],
  },
};

// ── Linux FHS Misplacement ───────────────────────────────────────────────────
export const linuxFhsMisplacement: ChallengeScenario = {
  id: 'linux-fhs-misplacement',
  domain: 'devops',
  title: 'Comando não encontrado apesar da instalação',
  hook: 'O novo developer instalou a ferramenta "kubectl" copiando o binário descarregado diretamente para a pasta `/tmp/tools`. Agora queixa-se que o comando "kubectl" falha sempre com "command not found". Onde devia ele colocar o executável para funcionar naturalmente para todos os utilizadores?',
  difficulty: 'junior',
  timeEstimateMin: 3,
  tags: ['linux', 'fhs', 'filesystem', 'path'],

  artifacts: [
    {
      id: 'terminal',
      label: '$ kubectl get pods',
      language: 'bash',
      content: `bash: kubectl: command not found`,
    },
    {
      id: 'ls-tmp',
      label: '$ ls -la /tmp/tools/kubectl',
      language: 'bash',
      content: `-rwxr-xr-x 1 root root 51240320 Oct 10 14:00 /tmp/tools/kubectl`,
    },
    {
      id: 'path',
      label: '$ echo $PATH',
      language: 'bash',
      content: `/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`,
    }
  ],

  diagnosisQuestion: 'Qual é o erro de FHS e bash PATH que está a ocorrer?',
  diagnosisOptions: [
    {
      id: 'a',
      label: 'A pasta /tmp/tools não faz parte da variável $PATH, e o diretório /tmp é inadequado para armazenar binários do sistema.',
      correct: true,
      feedback: 'Exato! Em Linux, a bash procura executáveis nos diretórios listados na variável $PATH. O /tmp é volátil (apagado no reboot) e não está no PATH.',
    },
    {
      id: 'b',
      label: 'O ficheiro não tem as permissões de execução corretas.',
      correct: false,
      feedback: 'O ls -la mostra "-rwxr-xr-x". O bit "x" está presente para owner, group e other.',
    },
    {
      id: 'c',
      label: 'O binário é incompatível com o kernel Linux atual.',
      correct: false,
      feedback: 'O erro "command not found" significa que a shell nem encontrou o binário. Erros de kernel/arquitetura costumam dar "Exec format error".',
    },
    {
      id: 'd',
      label: 'Falta criar um alias no .bashrc',
      correct: false,
      feedback: 'Abordagem possível, mas não é a standard. Binários instalados manualmente por admin devem ir para um diretório no PATH.',
    },
  ],

  fixQuestion: 'Segundo a File System Hierarchy Standard (FHS), qual o local ideal para colocar um executável de terceiros instalado manualmente?',
  fixOptions: [
    {
      id: 'a',
      label: '/usr/local/bin',
      correct: true,
      feedback: 'Correto! /usr/local/bin é o destino standard (FHS) para binários locais ou de terceiros instalados manualmente pelo administrador de sistema. Além disso, já faz parte do $PATH predefinido.',
    },
    {
      id: 'b',
      label: '/bin',
      correct: false,
      feedback: 'O /bin está reservado para os binários essenciais do sistema (fornecidos pelo package manager, como ls, bash, cp).',
    },
    {
      id: 'c',
      label: '/etc',
      correct: false,
      feedback: 'O /etc serve para ficheiros de configuração (texto), não para ficheiros binários/executáveis.',
    },
    {
      id: 'd',
      label: '/var',
      correct: false,
      feedback: 'O /var armazena dados variáveis (logs, cache, bases de dados), não executáveis estáticos.',
    },
  ],

  hints: [
    {
      id: 'h1',
      level: 1,
      label: 'Dica 1',
      text: 'O $PATH mostra os caminhos oficiais onde o Linux procura comandos por defeito. Estará o /tmp lá no meio?',
    },
    {
      id: 'h2',
      level: 2,
      label: 'Dica 2',
      text: 'A FHS define /bin para sistema, /usr/bin para aplicações geridas por dpkg/rpm, e existe uma pasta específica com "local" no nome para instalações manuais.',
    },
    {
      id: 'h3',
      level: 3,
      label: 'Dica 3',
      text: 'Usa mv /tmp/tools/kubectl /usr/local/bin/kubectl.',
    },
  ],

  resolution: {
    rootCause: 'O binário kubectl foi colocado na pasta `/tmp`, que além de ser apagada no reboot, não pertence à variável `$PATH` do sistema operativo. Assim, quando se tenta executar o comando diretamente, a shell não sabe onde o procurar.',
    fix: 'Mover o executável para `/usr/local/bin`, o local oficial ditado pela Linux File System Hierarchy para software compilado ou instalado manualmente fora do package manager do OS.',
    preventions: [
      'Conhecer e respeitar o standard de hierarquia do Linux (FHS).',
      'Garantir a verificação constante do $PATH para dependências globais.',
    ],
  },
};

export const secopsDataPipelineChallenge: ChallengeScenario = {
  id: 'secops-data-pipeline',
  domain: 'cybersecurity',
  title: 'Logs Fragmentados e Perda de Contexto',
  hook: 'O teu SOC (Security Operations Center) reporta que alertas cruciais de força bruta não estão a disparar. Os logs chegam ao SIEM, mas parecem uma "sopa de letras".',
  difficulty: 'mid',
  timeEstimateMin: 15,
  tags: ['secops', 'data-ingestion', 'normalization', 'fluentbit'],
  artifacts: [
    {
      id: 'app-logs',
      label: 'auth-api.log',
      language: 'json',
      content: '{"t": "2026-09-19T00:30:12Z", "user_id": 492, "event": "login_failed", "src_ip": "192.168.1.55"}\n{"t": "2026-09-19T00:30:13Z", "user_id": 492, "event": "login_failed", "src_ip": "192.168.1.55"}\n{"time": "2026-09-19 00:30:14", "usr": "admin", "action": "auth_err", "ip_addr": "192.168.1.55"}',
    },
    {
      id: 'siem-query',
      label: 'splunk-query.txt',
      language: 'text',
      content: '> index=security event_type=login_failed | stats count by source_ip | where count > 5\n\n[No Results Found]',
    },
    {
      id: 'fluentbit-conf',
      label: 'fluent-bit.conf',
      language: 'ini',
      content: '[INPUT]\n    Name        tail\n    Path        /var/log/auth-api/*.log\n\n[OUTPUT]\n    Name        splunk\n    Match       *\n    Host        siem.internal\n    Port        8088\n    Splunk_Token xxxxxxxx-xxxx-xxxx',
    }
  ],
  diagnosisQuestion: 'Porque é que o SIEM não consegue despoletar o alerta apesar de existirem eventos de falha de login repetidos?',
  diagnosisOptions: [
    { id: '1', label: 'Os logs estão a ser enviados para o porto errado do Splunk (8088 em vez de 514).', correct: false, feedback: 'O Splunk HEC (HTTP Event Collector) funciona no porto 8088, o que está correto para logs JSON.' },
    { id: '2', label: 'Não existe normalização dos dados (campos e formatos variam), impedindo a query padrão de fazer match.', correct: true, feedback: 'Correto! Os logs têm estruturas mistas (`t` vs `time`, `src_ip` vs `ip_addr`). Sem um schema unificado, as pesquisas e correlações do SIEM falham.' },
    { id: '3', label: 'O FluentBit não tem permissão para ler `/var/log/auth-api/`.', correct: false, feedback: 'Se assim fosse, os logs nem sequer chegariam ao SIEM (e vimos que eles chegam, apenas em formato estranho).' },
  ],
  fixQuestion: 'Qual é a melhor abordagem arquitetural para resolver este problema de SecOps de forma escalável?',
  fixOptions: [
    { id: '1', label: 'Criar múltiplas queries no SIEM para cada variação de log que existe.', correct: false, feedback: 'Isto é um pesadelo de gestão. Sempre que uma app nova surge, terias de alterar todos os dashboards e alertas.' },
    { id: '2', label: 'Configurar o FluentBit com filtros (Filter Modify/Record) para padronizar os campos (Normalização) antes do envio.', correct: true, feedback: 'Exato! A Normalização e o Enriquecimento devem acontecer na camada de Ingestão/Processamento, garantindo que o SIEM consome um schema limpo e unificado (ex: ECS ou CIM).' },
    { id: '3', label: 'Mudar a configuração de output do FluentBit para `Format csv`.', correct: false, feedback: 'Converter para CSV não resolve a variação dos nomes dos campos base que a aplicação emite.' },
  ],
  hints: [
    { id: 'h1', level: 1, label: 'Olha para os campos', text: 'Compara os nomes das chaves JSON do primeiro log com o terceiro log no `auth-api.log`.' },
    { id: 'h2', level: 2, label: 'Olha para a Query', text: 'O SIEM está à procura dos campos exatos `event_type` e `source_ip`. Será que eles existem tal e qual na origem?' },
  ],
  resolution: {
    rootCause: 'Falta de normalização na pipeline de ingestão de logs. Múltiplos serviços escrevem logs em esquemas diferentes (`src_ip` vs `ip_addr`), o que destrói a capacidade de correlação e deteção de ameaças no SIEM.',
    fix: 'Introduzir uma camada de transformação (Filtros no FluentBit/Logstash) que mapeia todos os campos díspares para um schema comum de segurança (como o Splunk CIM ou Elastic ECS) antes do envio para o indexador final.',
    preventions: [
      'Adotar um schema de logs canónico na empresa (ex: Elastic Common Schema).',
      'Fornecer bibliotecas padrão de logger aos developers que garantam a estrutura correta desde a fonte.',
      'Implementar validação de schema nos pipelines de CI/CD para rejeitar commits que quebrem os contratos de logging.'
    ]
  }
};

export const secopsSslTlsChallenge: ChallengeScenario = {
  id: 'secops-ssl-tls',
  domain: 'cybersecurity',
  title: 'Erro de Handshake Incompleto',
  hook: 'A equipa de frontend alerta que a API de pagamentos está em baixo. Contudo, ao testares localmente a API responde 200 OK.',
  difficulty: 'mid',
  timeEstimateMin: 15,
  tags: ['secops', 'tls', 'ssl', 'ingress', 'certificates'],
  artifacts: [
    {
      id: 'curl-output',
      label: 'curl-test.sh',
      language: 'bash',
      content: '$ curl -v https://api.empresa.com/health\n*   Trying 192.168.10.50:443...\n* Connected to api.empresa.com (192.168.10.50) port 443 (#0)\n* ALPN, offering h2\n* ALPN, offering http/1.1\n* TLSv1.3 (OUT), TLS handshake, Client hello (1):\n* TLSv1.3 (IN), TLS handshake, Server hello (2):\n* TLSv1.3 (IN), TLS handshake, Certificate (11):\n* TLSv1.3 (OUT), TLS alert, unknown CA (560):\n* SSL certificate problem: unable to get local issuer certificate\n* Closing connection 0\ncurl: (60) SSL certificate problem: unable to get local issuer certificate',
    },
    {
      id: 'k8s-secret',
      label: 'tls-secret.yaml',
      language: 'yaml',
      content: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: api-tls\ntype: kubernetes.io/tls\ndata:\n  # Base64 encoded certs — apenas o certificado folha, SEM intermediário\n  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUV6akNDQ...\n  tls.key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFc...',
    },
    {
      id: 'cert-check',
      label: 'openssl-check.sh',
      language: 'bash',
      content: '$ openssl x509 -in cert.pem -text -noout | grep "Issuer:"\n        Issuer: C = US, O = Let\'s Encrypt, CN = R3\n\n$ openssl x509 -in cert.pem -text -noout | grep "Subject:"\n        Subject: CN = api.empresa.com\n\n# Verificar quantos certs estão na chain:\n$ openssl crl2pkcs7 -nocrl -certfile cert.pem | openssl pkcs7 -print_certs -noout\n# Resultado: apenas 1 certificado (deviam ser 2 ou 3 na full chain)'
    }
  ],
  diagnosisQuestion: 'Qual é o problema com a configuração do certificado SSL/TLS no Ingress?',
  diagnosisOptions: [
    { id: '1', label: 'O certificado foi emitido para o domínio errado (mismatch de Subject Alternative Name).', correct: false, feedback: 'O Subject mostra `api.empresa.com`, que coincide exatamente com o URL invocado pelo curl.' },
    { id: '2', label: 'O certificado expirou (falta de validade temporal).', correct: false, feedback: 'O erro não é `certificate has expired`, mas sim `unable to get local issuer certificate`.' },
    { id: '3', label: 'O secret de TLS contém apenas o certificado "folha" sem a cadeia intermédia (Intermediate CA).', correct: true, feedback: 'Correto! O erro `unknown CA` ocorre porque o browser/curl não confia diretamente na Let\'s Encrypt R3. O servidor precisa de enviar o certificado intermédio junto com o final (Full Chain) durante o handshake.' },
  ],
  fixQuestion: 'Como resolves este problema de SSL/TLS Handshake no manifesto Kubernetes?',
  fixOptions: [
    { id: '1', label: 'Modificar o Ingress para ignorar a verificação de SSL (ssl-verify: false).', correct: false, feedback: 'Isto introduz uma vulnerabilidade crítica, tornando a ligação suscetível a ataques Man-in-the-Middle.' },
    { id: '2', label: 'Substituir tls.crt pelo fullchain.pem — certificado da API + intermediário da CA concatenados.', correct: true, feedback: 'Exatamente. No K8s Ingress, tls.crt deve conter a full chain para o cliente rastrear a confiança até à Root CA.' },
    { id: '3', label: 'Desativar o TLS 1.3 e forçar o TLS 1.2 no Ingress Controller.', correct: false, feedback: 'O problema não tem relação com a versão do protocolo, mas sim com a cadeia de confiança.' },
  ],
  hints: [
    { id: 'h1', level: 1, label: 'Olha para o erro no curl', text: 'O erro diz "unable to get local issuer certificate". O curl não sabe quem emitiu o certificado.' },
    { id: 'h2', level: 2, label: 'Verifica o número de certs', text: 'O openssl mostra apenas 1 certificado na chain. Uma chain completa devia ter pelo menos 2: o da API e o intermédio da CA.' },
  ],
  resolution: {
    rootCause: 'Configuração incompleta da cadeia de certificados SSL/TLS (Certificate Chain). O servidor Ingress enviava apenas o "Leaf Certificate", deixando o cliente incapaz de verificar a confiança até à Root CA.',
    fix: 'Atualizar o Secret do Kubernetes (tls.crt) para conter o fullchain.pem gerado pela CA, garantindo que o handshake inclui todos os elos da cadeia.',
    preventions: [
      'Usar cert-manager no Kubernetes para gerir certificados automaticamente.',
      'Correr scans periódicos com SSL Labs ou testssl.sh nos ambientes públicos.'
    ]
  }
};

