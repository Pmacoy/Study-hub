import type { ProjectItem } from '../types/project';

// 50 Ultimate DevOps & Cloud Projects — trilha de portfolio
// Cada projecto: o que constróis, conceitos, stack, porque importa.

export const ALL_PROJECTS: ProjectItem[] = [
  // ── SECTION 1 · Foundations & Monitoring (1–10) ────────────────────
  {
    id: 'p01', number: 1, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Shell Script Website Monitor',
    whatYouBuild: 'Um sistema leve de monitorização de websites em shell script que verifica disponibilidade continuamente e dispara alertas em caso de falha.',
    concepts: ['Ciclo de vida HTTP', 'Status codes (2xx/4xx/5xx)', 'Shell scripting', 'Agendamento com cron', 'Lógica de alertas'],
    stack: ['bash', 'curl', 'cron'],
    whyItMatters: 'Introduz o pensamento DevOps no seu núcleo: monitorizar antes da falha ser visível, automação sobre verificação manual. A observabilidade começa pequena, não com ferramentas.',
    scenario: 'A equipa de marketing queixa-se que o website corporativo tem estado em baixo à noite, mas o IT só repara no dia seguinte. Precisas de uma solução zero-cost para ser alertado imediatamente quando o site devolve erros 5xx ou não responde.',
    architectureSteps: [
      'Criar um ficheiro "sites.txt" com a lista de URLs a monitorizar.',
      'Escrever um loop em Bash que lê cada URL e usa o `curl` para extrair o HTTP Status Code.',
      'Escrever lógica condicional: se o código não for 200 ou 301, registar num ficheiro "error.log".',
      'Configurar envio de notificação (ex: trigger de um webhook do Discord/Slack ou envio de email local via mailx).',
      'Configurar um job no crontab (`crontab -e`) para executar o script a cada 5 minutos.'
    ],
    acceptanceCriteria: [
      'O script consegue ler múltiplos URLs iterativamente de um ficheiro externo.',
      'Gera um log local com timestamp e o HTTP Status para cada verificação falhada.',
      'Envia um alerta APENAS quando o site falha 3 vezes seguidas (evitar falsos positivos).',
      'O cronjob está configurado e persistente no ambiente Linux.'
    ],
    bonusChallenge: 'Implementa "backoff exponencial": se o site continuar em baixo indefinidamente, o script não deve notificar a cada 5 minutos (alert fatigue), mas sim a cada 5, 10, 20, 40 minutos.'
  },
  {
    id: 'p02', number: 2, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Multi-Tier Application Deployment',
    whatYouBuild: 'Deploy de uma aplicação com frontend, backend e base de dados em camadas separadas.',
    concepts: ['Arquitectura multi-tier', 'Separação de responsabilidades', 'Comunicação entre serviços', 'Networking básico'],
    stack: ['docker', 'nginx', 'linux'],
    whyItMatters: 'A maioria dos sistemas reais é multi-tier. Perceber como as camadas comunicam é fundamental antes de escalar para Kubernetes.',
    scenario: 'A equipa de Devs entregou-te uma API em Node.js, um Frontend em React e precisa de uma BD PostgreSQL. Até agora, corriam tudo localmente num portátil com "npm start". A tua tarefa é containerizar a stack garantindo isolamento.',
    architectureSteps: [
      'Escrever o Dockerfile para o Backend (Node.js) seguindo boas práticas (imagem alpine, non-root user).',
      'Escrever o Dockerfile para o Frontend usando o Nginx para servir os artefactos estáticos gerados por um multi-stage build.',
      'Criar uma rede Docker customizada (bridge network) para os containers comunicarem internamente pelo seu DNS.',
      'Subir os containers (`docker run`) e injetar as credenciais da BD na API via Variáveis de Ambiente.'
    ],
    acceptanceCriteria: [
      'A base de dados (PostgreSQL) NÃO expõe portas para a máquina host (ex: sem -p 5432:5432), garantindo que só a API a consegue aceder internamente.',
      'Os dados do PostgreSQL sobrevivem a uma remoção do container (usar Docker Volumes).',
      'O container de Frontend apenas expõe a porta 80/443 e consegue consumir a API perfeitamente.'
    ],
    bonusChallenge: 'Utiliza um Healthcheck nativo do Docker no container do PostgreSQL e garante que a API só arranca quando a base de dados estiver pronta a aceitar conexões.'
  },
  {
    id: 'p03', number: 3, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Prometheus Fundamentals',
    whatYouBuild: 'Setup de Prometheus para recolher métricas de uma aplicação e do sistema.',
    concepts: ['Modelo de métricas pull', 'Exporters', 'PromQL básico', 'Time-series data'],
    stack: ['prometheus', 'node-exporter'],
    whyItMatters: 'Prometheus é o standard de facto para métricas em cloud-native. Dominar o modelo pull e PromQL é essencial.',
    scenario: 'Os servidores da empresa falharam ontem por falta de espaço no disco raiz. Foi-te pedido que abandones o uso manual do comando "df -h" e implementes a stack standard da indústria para recolher métricas em tempo real.',
    architectureSteps: [
      'Descarregar o Node Exporter binário para uma VM Linux e configurá-lo como um serviço Systemd.',
      'Confirmar que o Exporter está a expor métricas corretamente via HTTP (`curl localhost:9100/metrics`).',
      'Correr o servidor do Prometheus (via Docker ou binário standalone).',
      'Ajustar o `prometheus.yml` para adicionar o teu Node Exporter à lista de targets a serem raspados (scrape) a cada 15s.',
      'Explorar a interface Web do Prometheus para analisar as time-series ingeridas.'
    ],
    acceptanceCriteria: [
      'O Node Exporter arranca automaticamente se o servidor Linux for reiniciado (graças ao Systemd).',
      'O dashboard interno do Prometheus lista o target do Node Exporter no estado "UP".',
      'Consegues escrever e executar uma query PromQL simples que calcula a percentagem de RAM livre no servidor.',
      'Consegues prever a tendência (rate/deriv) de uso de disco usando a janela de tempo de 1h.'
    ],
    bonusChallenge: 'Implementa "relabeling" no prometheus.yml para injetar uma label estática adicional (ex: env="producao") em todas as métricas vindas daquele exporter específico.'
  },
  {
    id: 'p04', number: 4, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Grafana Dashboards',
    whatYouBuild: 'Dashboards visuais em Grafana ligados ao Prometheus para observar métricas em tempo real.',
    concepts: ['Visualização de métricas', 'Dashboards', 'Data sources', 'Painéis e queries'],
    stack: ['grafana', 'prometheus'],
    whyItMatters: 'Métricas sem visualização são ruído. Grafana transforma dados em decisões — uma competência que qualquer equipa espera.',
    scenario: 'O Prometheus já está a recolher métricas, mas a equipa de NOC (Network Operations Center) não sabe ler PromQL e precisa de visualizar a saúde dos sistemas num monitor gigante na parede do escritório.',
    architectureSteps: [
      'Executar o Grafana via Docker e aceder à interface Web (geralmente porta 3000).',
      'Configurar o Prometheus como uma "Data Source" no Grafana.',
      'Criar um novo Dashboard e adicionar painéis (Panels) para uso de CPU, Memória livre e I/O de disco.',
      'Configurar o "refresh rate" do dashboard para atualizar a cada 5 segundos.'
    ],
    acceptanceCriteria: [
      'O Grafana consegue ligar-se ao Prometheus com sucesso.',
      'O dashboard está guardado e tem pelo menos 3 painéis distintos com dados reais.',
      'Os gráficos mostram a evolução temporal (time-series) e não apenas o valor instantâneo.'
    ],
    bonusChallenge: 'Cria "Variáveis" (Variables) no topo do Dashboard para poderes filtrar os gráficos por servidor (ex: dropdown para escolher entre server-A e server-B).'
  },
  {
    id: 'p05', number: 5, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Application Logging & Log Aggregation',
    whatYouBuild: 'Pipeline de logs centralizado onde múltiplos serviços enviam logs para um backend pesquisável.',
    concepts: ['Logging estruturado', 'Agregação de logs', 'Loki/ELK', 'Troubleshooting via logs'],
    stack: ['loki', 'fluent-bit', 'grafana'],
    whyItMatters: 'Logs dispersos por dezenas de hosts são inúteis numa emergência. Centralizar é o primeiro passo para debug rápido.',
    scenario: 'Os developers queixam-se que, quando a API falha, têm de fazer SSH manualmente para 5 VMs diferentes para ler ficheiros de log dispersos. Precisas de centralizar todos os logs num único motor de busca.',
    architectureSteps: [
      'Fazer deploy do Grafana Loki (armazenamento de logs) usando Docker.',
      'Configurar um agente de recolha de logs (Promtail ou Fluent-bit) nos servidores aplicacionais.',
      'Configurar o agente para ler ficheiros `/var/log/*.log` e enviá-los para a API do Loki.',
      'Adicionar o Loki como Data Source no Grafana e usar a tab "Explore" para pesquisar os logs.'
    ],
    acceptanceCriteria: [
      'O Loki recebe os logs em tempo real do agente configurado.',
      'Os logs aparecem no Grafana e é possível pesquisar por uma string de erro específica (ex: "Exception").',
      'Os logs estão enriquecidos com labels (ex: nome do ficheiro, ambiente, app) para facilitar a filtragem.'
    ],
    bonusChallenge: 'Cria um painel no Dashboard do Grafana que mostra a "taxa de erros por minuto" contando as linhas de log que contêm a palavra "ERROR" usando LogQL.'
  },
  {
    id: 'p06', number: 6, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Alerting with Alertmanager',
    whatYouBuild: 'Sistema de alertas que notifica a equipa (Slack/email) quando métricas cruzam thresholds.',
    concepts: ['Regras de alerta', 'Alertmanager', 'Routing de notificações', 'Silences e inhibition'],
    stack: ['prometheus', 'alertmanager', 'slack'],
    whyItMatters: 'Monitorizar sem alertar é ver o fogo sem chamar os bombeiros. Alertas bem desenhados evitam fadiga e apanham problemas cedo.',
    scenario: 'O Prometheus sabe perfeitamente que a base de dados parou, mas como ninguém estava a olhar para os dashboards às 4h da manhã, o site esteve offline até às 9h. Precisas de implementar alertas proativos.',
    architectureSteps: [
      'Fazer deploy do serviço Alertmanager.',
      'Configurar o `prometheus.yml` para apontar para o URL do Alertmanager.',
      'Escrever uma "Alerting Rule" no Prometheus (ex: disparar alerta se o serviço estiver DOWN durante 1 minuto).',
      'Configurar o Alertmanager (`alertmanager.yml`) para rotear o alerta para um canal de Slack via Webhook ou um endereço de Email falso.'
    ],
    acceptanceCriteria: [
      'O alerta muda para o estado "Pending" e depois "Firing" na UI do Prometheus.',
      'O Alertmanager recebe o alerta do Prometheus.',
      'A notificação chega efetivamente ao canal de Slack/Email configurado com os detalhes corretos.'
    ],
    bonusChallenge: 'Configura um "Silence" no Alertmanager com a duração de 2 horas para simular uma janela de manutenção planeada onde não queres ser acordado.'
  },
  {
    id: 'p07', number: 7, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Docker Multi-Container App',
    whatYouBuild: 'Aplicação composta por vários containers orquestrados com Docker Compose.',
    concepts: ['Docker Compose', 'Networking entre containers', 'Volumes', 'Variáveis de ambiente'],
    stack: ['docker', 'docker-compose'],
    whyItMatters: 'Compose é a ponte entre "um container" e "orquestração". Prepara o mindset para Kubernetes.',
    scenario: 'A app multi-tier que lançaste no Projeto #2 usa comandos manuais absurdamente longos (`docker run --network... -e DB_USER=...`). Se o servidor reiniciar, é o caos para recuperar a stack. Precisas de declarar a infraestrutura como código.',
    architectureSteps: [
      'Criar um ficheiro `docker-compose.yml`.',
      'Declarar os três serviços: `frontend`, `backend` e `database`.',
      'Referenciar o build de imagens locais ou imagens do Docker Hub.',
      'Definir a partilha de portas apenas no frontend, mantendo o backend isolado na bridge network gerada pelo Compose.',
      'Fazer o spin-up da infraestrutura inteira com `docker compose up -d`.'
    ],
    acceptanceCriteria: [
      'Todos os containers arrancam em simultâneo através de um único comando.',
      'Os containers conseguem resolver-se mutuamente usando os nomes declarados nos `services:` (Service Discovery interno do Compose).',
      'A aplicação Web continua 100% funcional no browser.'
    ],
    bonusChallenge: 'Em vez de pores passwords em plain-text no ficheiro yml, utiliza um ficheiro `.env` oculto para injetar as credenciais da BD.'
  },
  {
    id: 'p08', number: 8, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Nginx Reverse Proxy & Load Balancer',
    whatYouBuild: 'Configuração de Nginx como reverse proxy e load balancer para múltiplos backends.',
    concepts: ['Reverse Proxy', 'Load Balancing (Round Robin)', 'Upstreams', 'Headers HTTP'],
    stack: ['nginx', 'docker'],
    whyItMatters: 'Nenhum sistema escala sem distribuição de tráfego. Entender reverse proxies é mandatório antes de configurar Ingress Controllers no K8s.',
    scenario: 'O tráfego de utilizadores da empresa subiu brutalmente e uma única instância da API (Backend) não aguenta o load. Precisas de correr 3 réplicas da mesma API e distribuir o tráfego uniformemente entre elas para evitar downtime.',
    architectureSteps: [
      'Criar um ambiente Docker com 3 instâncias idênticas de um servidor web básico (ex: Node.js ou nginx simples) a simular o backend.',
      'Configurar um novo container Nginx central para servir de Reverse Proxy.',
      'Criar o ficheiro `nginx.conf` declarando um bloco `upstream` contendo o IP/hostname dos 3 backends.',
      'Configurar a localização (`location /`) para fazer `proxy_pass` para o grupo upstream.'
    ],
    acceptanceCriteria: [
      'Aceder à porta pública do proxy encaminha a chamada para um dos backends.',
      'Fazendo refreshes consecutivos, o tráfego é distribuído pelas 3 instâncias de backend de forma alternada (Round-Robin).',
      'Se matares um container backend (simulate failure), o Nginx para de lhe enviar tráfego sem quebrar a app para os utilizadores.'
    ],
    bonusChallenge: 'Gera um certificado Self-Signed com OpenSSL e configura o Nginx para terminar tráfego SSL (HTTPS) na porta 443, enviando tráfego HTTP limpo na porta 80 para os backends.'
  },
  {
    id: 'p09', number: 9, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Custom Metrics Exporter',
    whatYouBuild: 'Exporter customizado que expõe métricas de negócio (ex: utilizadores ativos na BD) em formato Prometheus.',
    concepts: ['Custom exporters', 'Formato de métricas', 'Instrumentação', 'Client libraries'],
    stack: ['prometheus', 'python', 'node-exporter'],
    whyItMatters: 'Saber instrumentar dá-te visibilidade sobre o que quiseres, não só o que os exporters padrão oferecem.',
    scenario: 'O Node Exporter recolhe métricas de infraestrutura, mas o CEO quer um painel com o "número de vendas na última hora". Precisas de criar um Exporter customizado que se liga à Base de Dados e converte essa query SQL numa métrica para o Prometheus.',
    architectureSteps: [
      'Criar um script Python usando a biblioteca oficial `prometheus_client`.',
      'Definir um objeto do tipo `Gauge` (para valores que sobem e descem) ou `Counter`.',
      'Escrever uma função que simule uma chamada a uma API/BD e atualize o valor da métrica a cada 10 segundos.',
      'Iniciar o servidor HTTP incluído na biblioteca para expor o endpoint `/metrics`.',
      'Adicionar o teu novo exporter ao ficheiro `prometheus.yml`.'
    ],
    acceptanceCriteria: [
      'O script Python executa com sucesso e mantém o servidor a correr.',
      'Aceder a `localhost:8000/metrics` (ou porta escolhida) devolve os dados no formato de texto oficial do Prometheus.',
      'O Prometheus faz scrape com sucesso e consegues desenhar um gráfico no Grafana com a tua métrica de negócio.'
    ],
    bonusChallenge: 'Containeriza o teu script Python com um Dockerfile e junta-o à tua stack no Docker Compose.'
  },
  {
    id: 'p10', number: 10, sectionId: 'foundations', difficulty: 'foundations',
    title: 'Full Monitoring Stack (Capstone)',
    whatYouBuild: 'Stack completo Prometheus + Grafana + Alertmanager + exporters, monitorizando uma app multi-tier.',
    concepts: ['Observabilidade end-to-end', 'Integração de componentes', 'Dashboards as Code', 'Alertas em cascata'],
    stack: ['prometheus', 'grafana', 'alertmanager', 'docker'],
    whyItMatters: 'Junta tudo da secção 1. Uma stack de observabilidade completa é o que separa "tenho uma app" de "opero uma app".',
    scenario: 'A empresa percebeu o valor da tua prova de conceito. O CTO pediu uma solução "Monitoring-in-a-Box" — um repositório que qualquer equipa de Devs possa clonar e correr `docker compose up` para ter logo a infraestrutura inteira pré-configurada.',
    architectureSteps: [
      'Criar um repositório novo com um super `docker-compose.yml` que inclua: Prometheus, Grafana, Alertmanager, Node Exporter e Loki.',
      'Configurar o Grafana "Provisioning" para que não seja preciso fazer login ou adicionar o Prometheus manualmente (DataSource as Code).',
      'Exportar o teu melhor Dashboard do Grafana (JSON) e configurá-lo para aparecer automaticamente no arranque (Dashboards as Code).',
      'Incluir um ficheiro de regras de alerta mapeado para o container do Prometheus via volumes.'
    ],
    acceptanceCriteria: [
      'Um único comando inicia 5 ou mais serviços.',
      'Ao abrir o Grafana pela primeira vez, o dashboard já lá está e tem dados reais.',
      'O Alertmanager está ligado ao Prometheus sem qualquer clique manual.'
    ],
    bonusChallenge: 'Cria um `Makefile` na raiz do projeto com os comandos `make start`, `make stop` e `make logs`, abstraindo os detalhes do Compose para os developers.'
  },

  // ── SECTION 2 · CI/CD & Security (11–20) ───────────────────────────
  {
    id: 'p11', number: 11, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'Jenkins CI/CD Pipeline',
    whatYouBuild: 'Pipeline Jenkins que faz build, teste e deploy automático de uma aplicação.',
    concepts: ['Jenkins pipelines', 'Stages e steps', 'Build automation', 'Deployment automático'],
    stack: ['jenkins', 'groovy', 'docker'],
    whyItMatters: 'Jenkins ainda domina o CI/CD enterprise. Escrever pipelines declarativos é uma competência básica esperada.',
    scenario: 'Os developers estão a fazer push de código constantemente para o GitHub, mas os deployments para a infraestrutura de testes ainda são manuais via SSH scripts. Precisas de automatizar o ciclo de vida completo CI/CD.',
    architectureSteps: [
      'Iniciar uma instância de Jenkins (via Docker).',
      'Instalar plugins essenciais (Git, Pipeline, Docker).',
      'Criar um ficheiro `Jenkinsfile` num repositório Git público com uma aplicação web simples (Node.js ou Python).',
      'Definir 4 stages obrigatórios no Jenkinsfile: Checkout, Build, Test (unit testes básicos) e Deploy (simulado com `echo`).',
      'Criar um Job do tipo "Pipeline" no Jenkins e executá-lo.'
    ],
    acceptanceCriteria: [
      'O pipeline executa e passa com sucesso em todos os stages.',
      'Os logs do Jenkins mostram claramente a progressão entre cada stage.',
      'O pipeline não falha se executado múltiplas vezes seguidas (idempotência).'
    ],
    bonusChallenge: 'Configura um Webhook no GitHub (podes usar o ngrok para expor o Jenkins local) para que o pipeline seja despoletado automaticamente num `git push`.'
  },
  {
    id: 'p12', number: 12, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'HashiCorp Vault com Jenkins',
    whatYouBuild: 'Pipeline CI/CD seguro onde o Jenkins vai buscar secrets dinamicamente ao Vault.',
    concepts: ['Gestão de secrets', 'Integração Jenkins–Vault', 'Credenciais dinâmicas', 'Pipeline seguro'],
    stack: ['vault', 'jenkins'],
    whyItMatters: 'Secrets hardcoded são um dos maiores riscos de produção. Este projecto introduz segurança como responsabilidade do pipeline, não um extra.',
    scenario: 'A equipa de Segurança detetou passwords da Base de Dados hardcoded num Jenkinsfile. Foram claras ordens para revogar todas as credenciais e implementar um cofre digital externo onde os pipelines vão injetar credenciais dinamicamente.',
    architectureSteps: [
      'Executar o HashiCorp Vault localmente via Docker (o `dev mode` é suficiente).',
      'Guardar um segredo (ex: `DB_PASS=supersecret`) no Key-Value store do Vault.',
      'Instalar o plugin oficial do HashiCorp Vault no Jenkins.',
      'Modificar o `Jenkinsfile` do Projeto #11 para autenticar-se no Vault e injetar a credencial.',
      'Garantir que a password é mascarada (masked) se tentar ser impressa no terminal do Jenkins.'
    ],
    acceptanceCriteria: [
      'O Vault está funcional e acessível pelo Jenkins.',
      'O Jenkinsfile não contém strings hardcoded com segredos sensíveis.',
      'O pipeline passa com sucesso ao aceder ao segredo, mas os logs apresentam apenas asteriscos `***` caso a variável seja exposta.'
    ],
    bonusChallenge: 'Usa a autenticação AppRole do Vault para o Jenkins, abandonando por completo o uso do Root Token no pipeline.'
  },
  {
    id: 'p13', number: 13, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'RBAC no Jenkins',
    whatYouBuild: 'Setup de Jenkins com controlo de acesso role-based estrito para utilizadores e equipas.',
    concepts: ['Princípio do menor privilégio', 'Modelo de segurança do Jenkins', 'Separação user/role', 'Governança de CI/CD'],
    stack: ['jenkins'],
    whyItMatters: 'Um Jenkins sem RBAC é um risco de segurança. Governança de acessos é esperada em qualquer ambiente corporativo.',
    scenario: 'Atualmente toda a equipa faz login como "Admin" no Jenkins. Ontem, um estagiário apagou sem querer o pipeline de Deploy de Produção. Precisas de aplicar RBAC (Role-Based Access Control) rigoroso com urgência.',
    architectureSteps: [
      'Instalar o plugin "Role-based Authorization Strategy" no Jenkins.',
      'Desativar o acesso anónimo e criar dois utilizadores locais (ex: `alice_admin` e `bob_dev`).',
      'Configurar duas roles globais: uma com permissões totais, outra com permissões apenas de leitura.',
      'Configurar as "Item Roles" usando Expressões Regulares (Regex) para que o `bob_dev` só consiga executar builds cujos nomes comecem por `dev-`.'
    ],
    acceptanceCriteria: [
      'O utilizador Admin tem acesso à configuração global do Jenkins.',
      'O utilizador Developer tenta aceder a "Manage Jenkins" e recebe "Access Denied".',
      'O utilizador Developer consegue acionar (Build) o job `dev-api`, mas nem sequer consegue ver o job `prod-api`.'
    ],
    bonusChallenge: 'Faz setup (simulado via container) de um servidor LDAP (OpenLDAP) e liga o Jenkins a essa diretoria externa para evitar gerir contas locais.'
  },
  {
    id: 'p14', number: 14, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'SonarQube Code Quality Gate',
    whatYouBuild: 'Integração de SonarQube no pipeline para análise estática de código e quality gates.',
    concepts: ['SAST', 'Quality gates', 'Code smells & bugs', 'Coverage'],
    stack: ['sonarqube', 'jenkins', 'maven'],
    whyItMatters: 'Qualidade de código medida automaticamente evita dívida técnica. Um quality gate bloqueia merges perigosos antes de chegarem a produção.',
    scenario: 'A base de código está a crescer rapidamente e imensos "code smells" e bugs de segurança estão a chegar a produção. Precisas de adicionar Static Application Security Testing (SAST) e bloquear builds de má qualidade.',
    architectureSteps: [
      'Executar uma instância de SonarQube via Docker Compose juntamente com uma BD PostgreSQL.',
      'Gerar um Authentication Token no SonarQube e guardá-lo nos credenciais do Jenkins.',
      'Instalar o plugin do SonarQube Scanner no Jenkins.',
      'Adicionar um Stage de `Static Analysis` no Jenkinsfile que executa o scanner contra a codebase.',
      'Configurar um Quality Gate no SonarQube (ex: falhar se a cobertura de testes < 80% ou Bugs Críticos > 0).'
    ],
    acceptanceCriteria: [
      'O SonarQube recebe o report de análise do pipeline.',
      'O Jenkinsfile implementa um "waitForQualityGate" que pausa o pipeline até receber o veredicto.',
      'Se o código violar as regras estipuladas no SonarQube, o Pipeline falha o build imediatamente, não passando para Deploy.'
    ],
    bonusChallenge: 'Injeta intencionalmente uma vulnerabilidade (ex: uma password hardcoded em plain text no código) e verifica se o SonarQube deteta e trava o Pipeline.'
  },
  {
    id: 'p15', number: 15, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'Trivy Container Scanning',
    whatYouBuild: 'Integração do scanner de vulnerabilidades Trivy para analisar imagens Docker no pipeline.',
    concepts: ['Container security', 'CVEs', 'Vulnerability scanning', 'Shift-left security'],
    stack: ['trivy', 'docker', 'github-actions'],
    whyItMatters: 'Imagens Docker base têm frequentemente dezenas de vulnerabilidades conhecidas (CVEs). Scans automáticos impedem que vulnerabilities cheguem a produção.',
    scenario: 'A empresa está a construir imagens Docker cegamente a partir de bases desatualizadas como "node:10" e a colocá-las em clusters Kubernetes, expondo falhas graves. Precisas de implementar Container Security no processo de CI.',
    architectureSteps: [
      'Fazer o download do binário do Trivy (Aqua Security) para a máquina/agente local.',
      'Criar um Dockerfile vulnerável de propósito (usando uma versão muito antiga de SO ou biblioteca).',
      'Correr o comando CLI `trivy image <nome-da-imagem>` e observar as CVEs detetadas.',
      'Criar um pipeline (no Jenkins ou GitHub Actions) que tem um stage de "Security Scan" logo a seguir à fase de Build.'
    ],
    acceptanceCriteria: [
      'O pipeline consegue efetuar scan à imagem Docker recém-construída, antes do push para um Registry.',
      'O pipeline está configurado para QUEBRAR (Exit Code 1) caso se encontrem vulnerabilidades do nível "CRITICAL".',
      'Vulnerabilidades menores ("LOW" ou "MEDIUM") apenas mostram avisos nos logs, permitindo que o pipeline continue.'
    ],
    bonusChallenge: 'Formatar o output do scan do Trivy em formato SARIF e fazer o upload desse ficheiro como Artifact do Pipeline (ou integrar na tab de "Security" do GitHub).'
  },
  {
    id: 'p16', number: 16, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'GitHub Actions CI/CD',
    whatYouBuild: 'Pipeline completo em GitHub Actions com build, teste, scan e deploy.',
    concepts: ['GitHub Actions workflows', 'Jobs e steps', 'Secrets', 'Matrix builds'],
    stack: ['github-actions', 'docker'],
    whyItMatters: 'GitHub Actions é o CI/CD nativo do GitHub e cada vez mais usado. Dominar workflows é competência de mercado.',
    scenario: 'A empresa decidiu abandonar o Jenkins para tirar partido do ecossistema nativo do GitHub Enterprise. Precisas de reescrever o pipeline de deployment principal usando GitHub Actions.',
    architectureSteps: [
      'Criar a pasta `.github/workflows` e um ficheiro `main.yml` na raiz do repositório.',
      'Definir um trigger (on) para executar o workflow sempre que houver um `push` na branch `main`.',
      'Configurar Jobs distintos para `lint`, `test`, e `build`.',
      'Configurar os GitHub Actions Secrets para armazenar as credenciais do Docker Hub de forma segura.',
      'Fazer push do código e verificar a execução na tab "Actions" do repositório.'
    ],
    acceptanceCriteria: [
      'O workflow arranca automaticamente após o git push.',
      'Os Jobs executam na ordem correta (ex: o `build` depende do `test`).',
      'A imagem Docker é compilada com sucesso e empurrada (push) para um registry público.'
    ],
    bonusChallenge: 'Implementa um "Matrix Build" no teu workflow para correr a bateria de testes em simultâneo contra as versões 16, 18 e 20 do Node.js.'
  },
  {
    id: 'p17', number: 17, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'AWS EKS Cluster Provisioning',
    whatYouBuild: 'Deployment Kubernetes avançado com scaling, fiabilidade e separação de ambientes em EKS.',
    concepts: ['Multi-environment design', 'Padrões de resiliência', 'Estratégias de scaling', 'Production readiness'],
    stack: ['kubernetes', 'eks', 'aws'],
    whyItMatters: 'Kubernetes em produção é sobre resiliência, não sobre deployment. Este projecto força esse mindset.',
    scenario: 'A equipa de desenvolvimento precisa de um cluster Kubernetes "production-grade" na cloud. O teu desafio é provisionar o cluster EKS (Elastic Kubernetes Service) na AWS seguindo as melhores práticas.',
    architectureSteps: [
      'Instalar a CLI da AWS e configurar credenciais locais.',
      'Utilizar a ferramenta `eksctl` (ou Terraform) para criar um cluster com 2 Worker Nodes.',
      'Configurar o kubeconfig local para comunicar com o novo cluster.',
      'Fazer deploy de um Pod simples (ex: Nginx) para validar o funcionamento do networking.'
    ],
    acceptanceCriteria: [
      'O cluster EKS aparece no estado "Active" na consola da AWS.',
      'O comando `kubectl get nodes` devolve as 2 instâncias EC2 num estado "Ready".',
      'O Nginx corre sem erros e recebe um IP da rede do cluster.'
    ],
    bonusChallenge: 'Configura o cluster EKS (via eksctl) para distribuir os nós de computação automaticamente por 3 Availability Zones (AZs) distintas, garantindo Alta Disponibilidade (HA).'
  },
  {
    id: 'p18', number: 18, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'Helm Chart Mega Project (EKS)',
    whatYouBuild: 'Helm charts reutilizáveis e parametrizados para deployments Kubernetes.',
    concepts: ['Helm templating', 'Release management', 'Abstração de configuração', 'Values por ambiente'],
    stack: ['helm', 'kubernetes', 'eks'],
    whyItMatters: 'Helm é como as equipas reais escalam deployments Kubernetes sem caos. Charts parametrizados são o padrão de mercado.',
    scenario: 'Gerir 50 ficheiros YAML separados para uma única aplicação web em Kubernetes tornou-se num pesadelo de manutenção. Precisas de converter esses manifestos estáticos num template dinâmico usando Helm.',
    architectureSteps: [
      'Instalar a CLI do Helm.',
      'Correr `helm create my-app` para gerar a estrutura base do Chart.',
      'Modificar o `values.yaml` para extrair variáveis hardcoded (ex: versão da imagem docker, número de réplicas, porta da API).',
      'Adaptar os templates (`deployment.yaml`, `service.yaml`) para lerem os valores do `values.yaml`.',
      'Fazer deploy no EKS com o comando `helm install`.'
    ],
    acceptanceCriteria: [
      'A aplicação faz deploy com sucesso via Helm.',
      'É possível alterar o número de réplicas correndo apenas `helm upgrade --set replicaCount=5`, sem alterar os ficheiros manifestos originais.',
      'O comando `helm rollback` funciona para reverter um deployment falhado.'
    ],
    bonusChallenge: 'Aplica o Helm Chart num ambiente de Staging e outro de Produção usando dois ficheiros de values distintos (values-staging.yaml e values-prod.yaml).'
  },
  {
    id: 'p19', number: 19, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'GitOps Mega Project com ArgoCD (EKS)',
    whatYouBuild: 'Workflow de deployment GitOps usando o Git como única fonte de verdade, com ArgoCD.',
    concepts: ['Princípios GitOps', 'Infraestrutura declarativa', 'Deployments com ArgoCD', 'Drift detection'],
    stack: ['argocd', 'kubernetes', 'git', 'eks'],
    whyItMatters: 'GitOps transforma o Kubernetes de controlo manual em automação controlada. É o presente e futuro do deployment cloud-native.',
    scenario: 'O CTO proibiu execuções manuais de `kubectl apply` e `helm install`. Toda a infraestrutura deve ser atualizada de forma autónoma diretamente do Git. O paradigma GitOps deve ser implementado via ArgoCD.',
    architectureSteps: [
      'Instalar o ArgoCD no cluster EKS.',
      'Aceder à interface gráfica do ArgoCD usando Port Forwarding.',
      'Criar uma "Application" no ArgoCD que aponte para o repositório Git onde tens os teus manifestos ou o teu Helm Chart.',
      'Ativar a funcionalidade "Auto-Sync".'
    ],
    acceptanceCriteria: [
      'O ArgoCD deteta o código no repositório e faz o sync para o cluster Kubernetes automaticamente.',
      'Ao alterar um manifesto no GitHub, o ArgoCD deteta a alteração em menos de 3 minutos e aplica-a no EKS, marcando a Application como "Healthy".',
      'Modificações manuais feitas diretamente no cluster (Drift) são revertidas pelo ArgoCD para o estado declarado no Git.'
    ],
    bonusChallenge: 'Implementa o padrão "App of Apps" do ArgoCD para gerir dezenas de microserviços a partir de um único ficheiro root no GitHub.'
  },
  {
    id: 'p20', number: 20, sectionId: 'intermediate', difficulty: 'intermediate',
    title: 'HashiCorp Vault em Produção (EKS)',
    whatYouBuild: 'Deployment de Vault em alta disponibilidade, production-grade, em Kubernetes.',
    concepts: ['Vault HA architecture', 'Kubernetes authentication', 'Ciclo de vida de secrets', 'Production hardening'],
    stack: ['vault', 'kubernetes', 'eks'],
    whyItMatters: 'Representa engenharia de segurança enterprise-grade, não simples armazenamento de secrets. Diferencia um perfil sénior.',
    scenario: 'O Vault de testes em Docker (Projeto #12) correu bem, mas agora precisas de um setup High Availability (HA) a correr no Kubernetes para injetar segredos diretamente nos Pods da aplicação sem tocar no código.',
    architectureSteps: [
      'Utilizar o Helm chart oficial da HashiCorp para instalar o Vault no EKS em modo standalone ou HA.',
      'Inicializar e "Desbloquear" (Unseal) o cluster Vault manualmente através da CLI.',
      'Configurar o Auth Method "Kubernetes" no Vault, permitindo que Pods se autentiquem com o seu ServiceAccount token.',
      'Anotar os manifestos da aplicação Web para que o Vault Agent Injector leia o segredo do Vault.'
    ],
    acceptanceCriteria: [
      'O Vault corre de forma estável no EKS.',
      'Os pods autenticam-se com o Vault de forma transparente sem precisarem de tokens hardcoded.',
      'A password da base de dados aparece mágica e dinamicamente num ficheiro `/vault/secrets/db-pass` dentro do Pod da aplicação Web.'
    ],
    bonusChallenge: 'Configura Auto-Unseal do Vault utilizando AWS KMS (Key Management Service) para que o Vault arranque autonomamente se os nós do cluster K8s reiniciarem.'
  },

  // ── SECTION 3 · Kubernetes & Cloud-Native Advanced (21–30) ─────────
  {
    id: 'p21', number: 21, sectionId: 'advanced', difficulty: 'advanced',
    title: 'RDS como Managed DB com EKS',
    whatYouBuild: 'Aplicação Kubernetes que se liga de forma segura a uma AWS RDS como base de dados externa gerida.',
    concepts: ['Managed vs in-cluster DBs', 'Conectividade segura EKS→RDS', 'Networking & security groups', 'Secrets de DB'],
    stack: ['rds', 'eks', 'aws', 'kubernetes'],
    whyItMatters: 'A maioria dos sistemas de produção NÃO corre bases de dados dentro do Kubernetes. Este projecto ensina arquitecturas híbridas reais.',
    scenario: 'A base de dados dentro do K8s não aguenta o volume de transações e a gestão de backups está a falhar. Precisas de migrar a BD para um serviço gerido AWS RDS e garantir que a aplicação no EKS comunica com ela em segurança.',
    architectureSteps: [
      'Aprovisionar uma instância PostgreSQL no AWS RDS dentro da mesma VPC do cluster EKS.',
      'Configurar os AWS Security Groups para permitir tráfego na porta 5432 apenas oriundo dos Worker Nodes do EKS.',
      'Criar um `Secret` no Kubernetes contendo o endpoint do RDS, utilizador e password.',
      'Atualizar o Deployment da aplicação para injetar o Secret como variáveis de ambiente.'
    ],
    acceptanceCriteria: [
      'A aplicação liga-se com sucesso ao RDS.',
      'Os pods não contêm credenciais hardcoded no código ou manifestos base.',
      'A instância RDS não está acessível publicamente pela internet, garantindo isolamento da rede.'
    ],
    bonusChallenge: 'Implementa "IAM Roles for Service Accounts (IRSA)" para que o Pod obtenha as credenciais do RDS diretamente do AWS Secrets Manager sem usar Kubernetes Secrets nativos.'
  },
  {
    id: 'p22', number: 22, sectionId: 'advanced', difficulty: 'advanced',
    title: 'GitHub Actions CI/CD para AKS',
    whatYouBuild: 'Pipeline CI/CD em GitHub Actions que faz deploy para Azure Kubernetes Service.',
    concepts: ['CI/CD multi-cloud', 'Deploy para AKS', 'GitHub Actions workflows', 'Autenticação cloud'],
    stack: ['github-actions', 'aks', 'azure', 'kubernetes'],
    whyItMatters: 'Saber fazer deploy para AKS (não só EKS) mostra versatilidade multi-cloud, muito valorizada.',
    scenario: 'A empresa adotou uma estratégia multi-cloud e obteve créditos na Azure. A tua missão é pegar na mesma aplicação web e criar um pipeline GitHub Actions que a implemente num cluster Azure Kubernetes Service (AKS).',
    architectureSteps: [
      'Aprovisionar um cluster AKS via Portal Azure ou Azure CLI.',
      'Criar um "Service Principal" na Azure com permissões restritas para interagir com o AKS.',
      'No GitHub Actions, usar o action `azure/login` para autenticar o workflow.',
      'Adicionar um step que utiliza `azure/k8s-deploy` para aplicar os manifestos (YAML ou Helm) no AKS.'
    ],
    acceptanceCriteria: [
      'O GitHub Actions workflow autentica-se na Azure com sucesso.',
      'O deploy aplica as alterações no cluster AKS, e os pods arrancam sem erros.',
      'A aplicação fica publicamente exposta através de um Azure Load Balancer nativo.'
    ],
    bonusChallenge: 'Configura federação OIDC (OpenID Connect) entre o GitHub e o Entra ID (Azure AD), eliminando a necessidade de guardar credenciais estáticas do Service Principal como Secrets no GitHub.'
  },
  {
    id: 'p23', number: 23, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Blue-Green Deployment (EKS)',
    whatYouBuild: 'Deployment zero-downtime com troca entre ambientes blue e green.',
    concepts: ['Zero-downtime deployment', 'Environment switching', 'Rollback instantâneo', 'Traffic shifting'],
    stack: ['kubernetes', 'eks'],
    whyItMatters: 'Blue-green elimina downtime em releases. É uma estratégia esperada em sistemas críticos.',
    scenario: 'O negócio não pode ter sequer 1 segundo de downtime quando sai uma nova versão. Tens de implementar uma estratégia Blue-Green onde a nova versão (Green) é testada em produção isoladamente antes de receber tráfego.',
    architectureSteps: [
      'Fazer deploy da versão V1 (Blue) com a label `app-version: v1`.',
      'Configurar o Kubernetes `Service` principal para redirecionar tráfego apenas para pods com `app-version: v1`.',
      'Fazer deploy completo da versão V2 (Green) mantendo o Service intacto.',
      'Executar testes na versão Green via Port Forwarding.',
      'Editar rapidamente o selector do Service para apontar para `app-version: v2`.'
    ],
    acceptanceCriteria: [
      'Ambas as versões estão a correr em paralelo no cluster.',
      'A comutação de tráfego é instantânea, sem queda de requests HTTP.',
      'Se a versão Green falhar, o rollback para a versão Blue é feito em 2 segundos revertendo a label no Service.'
    ],
    bonusChallenge: 'Em vez de alterar o selector manualmente num manifesto estático, automatiza o processo de Blue-Green usando Argo Rollouts.'
  },
  {
    id: 'p24', number: 24, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Canary Deployment',
    whatYouBuild: 'Deployment progressivo que envia uma fracção do tráfego para a nova versão antes de a promover.',
    concepts: ['Canary releases', 'Progressive delivery', 'Métricas de decisão', 'Rollback automático'],
    stack: ['kubernetes', 'argo-rollouts', 'prometheus'],
    whyItMatters: 'Canary reduz o raio de explosão de um bug. Combina deployment com observabilidade para releases seguras.',
    scenario: 'A versão 3 da API introduz alterações gigantescas no backend. O CTO exige que o deploy seja focado num grupo pequeno de clientes (10% do tráfego) para monitorizar a taxa de erros antes de libertar para todos.',
    architectureSteps: [
      'Instalar o controlador Argo Rollouts no cluster Kubernetes.',
      'Converter o ficheiro YAML padrão de `Deployment` para o Custom Resource `Rollout`.',
      'Definir os "Steps" da estratégia Canary: enviar 10% do tráfego e fazer pausa para validação.',
      'Aplicar a nova versão da imagem Docker e acompanhar o lançamento do Canary.'
    ],
    acceptanceCriteria: [
      'Uma parte dos requests à API é servida pela versão nova (10%), enquanto o resto continua na antiga (90%).',
      'O lançamento fica "Pausado" aguardando aprovação manual (via CLI ou UI do Argo).',
      'Após a aprovação manual, o sistema remove completamente a versão antiga e atinge 100% de uso na versão nova.'
    ],
    bonusChallenge: 'Integra o Argo Rollouts com o Prometheus para "Automated Analysis": O rollout avança automaticamente se o nível de HTTP 500 for < 1%, mas faz rollback automático se ultrapassar o limiar.'
  },
  {
    id: 'p25', number: 25, sectionId: 'advanced', difficulty: 'advanced',
    title: 'StatefulSets & Bases de Dados no K8s',
    whatYouBuild: 'Deployment de uma base de dados stateful (ex: MySQL) com identidade estável de pods.',
    concepts: ['StatefulSet concepts', 'Identidade estável de pods', 'Persistent volumes', 'Ordered deployment'],
    stack: ['kubernetes', 'mysql', 'pvc'],
    whyItMatters: 'Workloads stateful são o desafio mais difícil no Kubernetes. Dominar StatefulSets distingue quem sabe operar produção.',
    scenario: 'Por motivos contratuais de isolamento de dados, o cliente B exige que o seu microserviço corra com uma base de dados MySQL própria localizada obrigatoriamente dentro do cluster. Tens de garantir que os dados não se perdem quando o Pod morre.',
    architectureSteps: [
      'Criar uma StorageClass (se não existir nativamente no teu provider) e um Persistent Volume Claim (PVC).',
      'Declarar um manifesto `StatefulSet` e mapear o volume PVC para o diretório `/var/lib/mysql`.',
      'Criar um "Headless Service" (ClusterIP: None) para que o MySQL obtenha uma identidade de rede fixa (ex: `mysql-0.mysql-service`).',
      'Matar (delete) propositadamente o pod `mysql-0` e verificar o comportamento do controlador StatefulSet.'
    ],
    acceptanceCriteria: [
      'A base de dados é inicializada com sucesso e permite escrita de registos.',
      'Quando o pod renasce (após ser morto manualmente), reacopla automaticamente o mesmo disco, persistindo todos os registos anteriores.',
      'O nome do pod não tem hashes aleatórios (como os Deployments), apresentando o sufixo sequencial `-0`.'
    ],
    bonusChallenge: 'Faz o deploy de um cluster MongoDB de 3 nós usando StatefulSets, garantindo que a funcionalidade de `volumeClaimTemplates` atribui automaticamente um PVC isolado e independente para cada nó.'
  },
  {
    id: 'p26', number: 26, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Service Mesh com Istio',
    whatYouBuild: 'Service mesh com Istio para gestão de tráfego, observabilidade e segurança entre microserviços.',
    concepts: ['Service mesh', 'Sidecar proxy model', 'Componentes Istio (Pilot, Gateway)', 'Traffic management'],
    stack: ['istio', 'kubernetes', 'envoy'],
    whyItMatters: 'Service mesh resolve comunicação segura e observável entre serviços à escala. Competência avançada de plataforma.',
    scenario: 'O cluster cresceu para 40 microserviços. Os developers queixam-se que não conseguem fazer trace dos pedidos quando ocorrem falhas (500s em cascata), e a Segurança exige encriptação mTLS nativa entre todos os pods. Precisas de um Service Mesh.',
    architectureSteps: [
      'Instalar o Istio no cluster Kubernetes (ex: usando `istioctl install`).',
      'Ativar a injeção automática de sidecars num namespace específico (`kubectl label namespace default istio-injection=enabled`).',
      'Fazer deploy de uma aplicação microservices sample (ex: Bookinfo da Google).',
      'Aplicar uma política `PeerAuthentication` para forçar o modo STRICT mTLS em todo o namespace.',
      'Instalar e aceder ao dashboard Kiali para visualizar o grafo de tráfego.'
    ],
    acceptanceCriteria: [
      'Cada pod no namespace recebe automaticamente um container Envoy (sidecar) extra.',
      'O tráfego de rede entre serviços está garantidamente encriptado.',
      'O Kiali desenha um mapa visual em tempo real mostrando os serviços a comunicarem e as respetivas taxas de sucesso HTTP.'
    ],
    bonusChallenge: 'Utiliza um `VirtualService` do Istio para injetar intencionalmente uma falha (Fault Injection): faz com que 50% dos pedidos ao serviço de base de dados demorem 5 segundos a responder para testar a resiliência da UI.'
  },
  {
    id: 'p27', number: 27, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Horizontal Pod Autoscaling',
    whatYouBuild: 'Configuração de HPA que escala pods automaticamente com base em CPU/métricas customizadas.',
    concepts: ['HPA', 'Métricas customizadas', 'Scaling policies', 'Resource requests/limits'],
    stack: ['kubernetes', 'metrics-server', 'prometheus'],
    whyItMatters: 'Escalar automaticamente com a procura é o coração da elasticidade cloud-native. Poupa custos e mantém performance.',
    scenario: 'A Black Friday aproxima-se e o tráfego vai sofrer picos imprevisíveis. Escalar manualmente os deployments com `kubectl scale` não será suficientemente rápido. Precisas de garantir que a aplicação ganha réplicas sempre que a CPU apertar.',
    architectureSteps: [
      'Instalar o `Metrics Server` no cluster Kubernetes.',
      'Garantir que o Deployment da aplicação web tem `resources.requests` e `limits` definidos para CPU e Memória.',
      'Criar o recurso `HorizontalPodAutoscaler` apontando para o Deployment, com target de 50% de CPU.',
      'Usar uma ferramenta de Load Testing (como `hey` ou `locust`) para injetar tráfego intenso na app.'
    ],
    acceptanceCriteria: [
      'O comando `kubectl get hpa` mostra a métrica atual de CPU a ser lida corretamente.',
      'À medida que a carga aumenta, o Kubernetes cria novos pods (scale out) de forma automática até ao limite máximo estipulado.',
      'Quando o ataque de carga termina, o sistema remove progressivamente as réplicas extra (scale in).'
    ],
    bonusChallenge: 'Em vez de usares o HPA nativo baseado em CPU, usa o KEDA (Kubernetes Event-driven Autoscaling) para escalar os pods com base no número de mensagens presentes numa fila RabbitMQ ou AWS SQS.'
  },
  {
    id: 'p28', number: 28, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Cluster Autoscaling & Node Management',
    whatYouBuild: 'Setup de cluster autoscaler que adiciona/remove nodes conforme a carga.',
    concepts: ['Cluster autoscaler', 'Node pools', 'Spot instances', 'Cost optimization'],
    stack: ['kubernetes', 'eks', 'karpenter'],
    whyItMatters: 'Escalar pods sem escalar nodes atinge um teto. Autoscaling de nodes fecha o ciclo de elasticidade e custo.',
    scenario: 'O HPA (Projeto 27) funciona incrivelmente bem, mas eventualmente o cluster esgota a RAM e CPU total das máquinas físicas (Worker Nodes). Precisas que o próprio cluster AWS compre e destrua instâncias EC2 dinamicamente.',
    architectureSteps: [
      'Fazer deploy do Karpenter (solução moderna de autoscaling da AWS) ou do Cluster Autoscaler clássico.',
      'Criar um NodePool provisioner definindo quais os tipos de instância permitidos e limites globais de capacidade.',
      'Forçar um scale brutal do Deployment da app (ex: 100 réplicas) para esgotar os recursos do cluster.',
      'Observar o comportamento do provisioner através dos logs.'
    ],
    acceptanceCriteria: [
      'Pods em estado "Pending" (por falta de recursos) despoletam a compra automática de novas VMs.',
      'As novas instâncias EC2 integram-se no cluster K8s em poucos minutos e os pods começam a correr.',
      'Ao eliminar o Deployment das 100 réplicas, os nós ficam vazios e o Karpenter destrói-os para poupar dinheiro (Scale Down).'
    ],
    bonusChallenge: 'Configura o teu Provisioner do Karpenter para dar prioridade de compra a "AWS Spot Instances" (máquinas de leilão mais baratas) e apenas cair para "On-Demand" se as Spot não estiverem disponíveis.'
  },
  {
    id: 'p29', number: 29, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Multi-Cluster / High Availability',
    whatYouBuild: 'Arquitectura com múltiplos clusters ou multi-AZ para alta disponibilidade e disaster recovery.',
    concepts: ['Multi-cluster', 'High availability', 'Disaster recovery', 'Failover'],
    stack: ['kubernetes', 'eks', 'aws'],
    whyItMatters: 'Um único cluster é um single point of failure. HA multi-cluster é o que sistemas mission-critical exigem.',
    scenario: 'Uma falha catastrófica da região us-east-1 da AWS deitou o negócio inteiro abaixo ontem. A administração exige um plano de Disaster Recovery "Active-Passive" com failover para uma zona geográfica completamente diferente.',
    architectureSteps: [
      'Provisionar dois clusters EKS distintos em regiões diferentes (ex: `eu-west-1` e `eu-central-1`).',
      'Fazer o deploy exato da mesma aplicação web em ambos os clusters.',
      'Configurar o AWS Route53 (serviço de DNS global) com uma política de Failover.',
      'Ligar os "Health Checks" do Route53 ao Ingress do cluster primário.'
    ],
    acceptanceCriteria: [
      'A aplicação está acessível independentemente em ambas as regiões cloud.',
      'Numa situação normal, o domínio global da empresa reencaminha todo o tráfego 100% para o cluster primário.',
      'Desligar o Ingress do primário (simulando desastre) faz com que o DNS atualize magicamente e o tráfego flua para o cluster secundário sem intervenção humana.'
    ],
    bonusChallenge: 'Usa o ArgoCD em formato "Hub and Spoke" para sincronizar as mudanças de código em ambos os clusters simultaneamente a partir de um único repositório Git.'
  },
  {
    id: 'p30', number: 30, sectionId: 'advanced', difficulty: 'advanced',
    title: 'Ansible Configuration Management',
    whatYouBuild: 'Sistema de configuração de VMs com Ansible, instalação de pacotes e gestão de utilizadores.',
    concepts: ['Configuration management', 'Ansible playbooks', 'Idempotência', 'Inventários'],
    stack: ['ansible', 'linux'],
    whyItMatters: 'Reforça automação fora do Kubernetes — uma competência DevOps crítica. Nem tudo corre em containers.',
    scenario: 'Nem todos os sistemas correm em containers. A empresa tem 50 VMs Linux "legacy" que precisam urgentemente de atualizações de segurança e da instalação de um novo agente de monitorização. Fazer SSH manualmente é suicídio operativo.',
    architectureSteps: [
      'Criar um inventário Ansible (`hosts.ini`) contendo os IPs de 3 VMs Linux de teste (Podes usar EC2, DigitalOcean, ou Vagrant local).',
      'Escrever um Playbook declarativo em YAML.',
      'Garantir que o playbook atualiza o SO (`apt` ou `yum`), instala ferramentas (`htop`, `node-exporter`) e cria um utilizador "devops" com chave SSH partilhada.',
      'Executar o Playbook via CLI (`ansible-playbook`).'
    ],
    acceptanceCriteria: [
      'O playbook executa as configurações em paralelo em todas as máquinas alvo.',
      'Se executares o playbook 10 vezes seguidas, ele reporta "OK" em vez de "CHANGED", demonstrando a propriedade da Idempotência (não duplica utilizadores nem falha se o pacote já existir).',
      'O novo agente de monitorização fica a correr ativamente como um serviço Systemd em todos os hosts.'
    ],
    bonusChallenge: 'Em vez de construíres um Playbook monolítico com 300 linhas, fatora a lógica em Ansible Roles (via `ansible-galaxy init`) para teres componentes modulares e partilháveis.'
  },

  // ── SECTION 4 · Enterprise CI/CD & IaC (31–40) ─────────────────────
  {
    id: 'p31', number: 31, sectionId: 'expert', difficulty: 'expert',
    title: 'Packer & Ansible Immutable Infrastructure',
    whatYouBuild: 'Criação de Golden Images (AMIs) onde a configuração está cravada na imagem base.',
    concepts: ['Immutable infrastructure', 'Packer templates', 'Golden images', 'Ansible provisioners'],
    stack: ['packer', 'ansible', 'aws'],
    whyItMatters: 'Ansible em servidores a correr gera "configuration drift". Infraestrutura Imutável garante que um servidor nunca é alterado após arrancar; é destruído e substituído.',
    scenario: 'Atualizar 50 VMs ativas com Ansible (Projeto 30) funciona, mas às vezes algumas máquinas falham e ficam num estado inconsistente. Precisas de transitar para Infraestrutura Imutável (Immutable Infrastructure) criando uma "Golden Image" pré-configurada.',
    architectureSteps: [
      'Escrever um template HashiCorp Packer (`.pkr.hcl`) direcionado para a criação de uma AWS AMI (Amazon Machine Image).',
      'Configurar o Packer para utilizar o "Ansible Provisioner".',
      'Usar o Playbook Ansible do Projeto 30 para configurar o Nginx dentro da máquina temporária do Packer.',
      'Executar `packer build`.'
    ],
    acceptanceCriteria: [
      'O Packer inicia uma instância EC2 temporária, corre o Ansible, captura a imagem e destrói a instância.',
      'Uma nova AMI customizada aparece disponível na tua conta AWS.',
      'Lançar uma VM manualmente a partir dessa AMI resulta num servidor web totalmente funcional em poucos segundos, sem precisar de scripts de inicialização.'
    ],
    bonusChallenge: 'Integra a execução do Packer num GitHub Actions workflow para que, a cada merge na branch principal, uma nova AMI seja gerada e etiquetada com a versão do commit.'
  },
  {
    id: 'p32', number: 32, sectionId: 'expert', difficulty: 'expert',
    title: 'Terraform + Ansible Corporate Project',
    whatYouBuild: 'Workflow IaC completo: Terraform para provisionamento e Ansible para configuração.',
    concepts: ['Princípios IaC', 'Provisionamento com Terraform', 'Configuração com Ansible', 'Automação end-to-end'],
    stack: ['terraform', 'ansible', 'aws'],
    whyItMatters: 'Isto é automação DevOps real — infraestrutura + configuração a trabalhar juntas. O padrão corporativo.',
    scenario: 'Precisas de provisionar os servidores na cloud E instalar o software sem tocar em nada manualmente. O fluxo tem de ser end-to-end automatizado, combinando o melhor do Terraform e do Ansible.',
    architectureSteps: [
      'Escrever código Terraform para provisionar uma AWS VPC, Subnet, Security Group e uma instância EC2.',
      'Configurar o Terraform para dar output do Endereço IP Público da VM criada.',
      'Utilizar um bloco `provisioner "local-exec"` no Terraform para despoletar automaticamente o playbook Ansible, passando o IP fresco como argumento.',
      'Executar `terraform apply -auto-approve`.'
    ],
    acceptanceCriteria: [
      'A infraestrutura cloud é criada corretamente pelo Terraform.',
      'Mal a VM fica pronta, o Ansible conecta-se via SSH e instala a aplicação web.',
      'O ambiente passa de ZERO a totalmente funcional com apenas um comando, sem pausas.'
    ],
    bonusChallenge: 'Em vez de usares o hack do `local-exec`, configura um plugin "Ansible Dynamic Inventory" para a AWS, onde o Ansible descobre autonomamente as VMs recém-criadas com base nas tags do Terraform.'
  },
  {
    id: 'p33', number: 33, sectionId: 'expert', difficulty: 'expert',
    title: 'Azure DevOps CI/CD — Classic Pipeline (AKS)',
    whatYouBuild: 'Pipeline Azure DevOps clássico (UI-based) para build e deploy em AKS.',
    concepts: ['Azure DevOps classic pipelines', 'Separação build/release', 'Deploy para AKS', 'Padrões CI/CD enterprise'],
    stack: ['azure-devops', 'aks', 'azure'],
    whyItMatters: 'Muitas empresas ainda usam pipelines clássicos do Azure DevOps. Conhecê-los abre portas em ambientes corporativos.',
    scenario: 'O cliente é uma Enterprise tradicional focada no ecossistema Microsoft. Querem um pipeline para deploy no AKS, mas os diretores exigem que uses a interface visual "Classic" para conseguirem ver e aprovar os blocos.',
    architectureSteps: [
      'Criar um Projeto no Azure DevOps e fazer push do código para o Azure Repos.',
      'Criar um "Build Pipeline" (Classic Editor) que constrói a imagem Docker e envia para o Azure Container Registry (ACR).',
      'Criar um "Release Pipeline" independente com trigger a partir do artefacto gerado no Build.',
      'Configurar o Release Pipeline para aplicar manifestos YAML no cluster Azure Kubernetes Service (AKS).'
    ],
    acceptanceCriteria: [
      'As fases de Build e Release estão perfeitamente separadas na interface gráfica.',
      'Um push no repositório aciona o Build, que, ao terminar, aciona automaticamente a Release.',
      'A aplicação é atualizada no cluster AKS sem erros.'
    ],
    bonusChallenge: 'Adiciona uma "Approval Gate" no Release Pipeline: o pipeline deve pausar e enviar um email a pedir que o Diretor clique em "Aprovar" antes do deploy avançar para a cloud.'
  },
  {
    id: 'p34', number: 34, sectionId: 'expert', difficulty: 'expert',
    title: 'Azure DevOps CI/CD — YAML Pipeline (AKS)',
    whatYouBuild: 'Pipeline Azure DevOps em YAML com deployment multi-stage para AKS.',
    concepts: ['YAML pipelines', 'Multi-stage deployment', 'Integração AKS', 'Pipeline as code'],
    stack: ['azure-devops', 'aks', 'yaml'],
    whyItMatters: 'YAML pipelines são a forma moderna e versionável de CI/CD no Azure DevOps. Pipeline as code é uma boa prática.',
    scenario: 'O uso de Pipelines Visuais tornou impossível rever as alterações no código durante as Pull Requests. Tens de migrar toda a automação do cliente para um paradigma moderno de "Pipeline as Code".',
    architectureSteps: [
      'Criar um ficheiro `azure-pipelines.yml` na raiz do repositório.',
      'Definir um pipeline Multi-Stage: `Stage 1: Build & Push` e `Stage 2: Deploy to AKS`.',
      'Configurar a feature de "Environments" no Azure DevOps para registar o histórico de deploys.',
      'Fazer commit do ficheiro YAML para acionar o sistema.'
    ],
    acceptanceCriteria: [
      'O processo inteiro CI/CD está codificado num único ficheiro YAML legível e versionado.',
      'O pipeline executa sequencialmente, mantendo a autenticação segura com ACR e AKS via Service Connections.',
      'A interface do Azure DevOps reflete corretamente os "Stages" e o histórico de deployments no Environment.'
    ],
    bonusChallenge: 'Cria um YAML Template Genérico (`template.yml`) e usa-o no pipeline principal (`azure-pipelines.yml`), passando variáveis como `imageName` e `port` por parâmetro. (Excelente para reuso entre microserviços).'
  },
  {
    id: 'p35', number: 35, sectionId: 'expert', difficulty: 'expert',
    title: 'Terraform Multi-Environment (dev/staging/prod)',
    whatYouBuild: 'Infraestrutura Terraform parametrizada por ambiente com workspaces ou módulos.',
    concepts: ['Terraform workspaces', 'Módulos reutilizáveis', 'Ambientes separados', 'Remote state'],
    stack: ['terraform', 'aws'],
    whyItMatters: 'Gerir dev/staging/prod com o mesmo código sem duplicação é uma competência IaC essencial e frequentemente mal feita.',
    scenario: 'Provisionaste a infraestrutura de DEV com sucesso. Agora a equipa precisa de STAGING e PROD. Fazer copy-paste do código Terraform para 3 pastas diferentes é um anti-pattern amador. Tens de centralizar a lógica.',
    architectureSteps: [
      'Refatorar o código puro Terraform para um Módulo Terraform local reutilizável.',
      'Criar três ficheiros de variáveis distintos: `dev.tfvars`, `staging.tfvars` e `prod.tfvars` (ex: DEV usa máquinas `t2.micro`, PROD usa `t3.large`).',
      'Utilizar os Terraform Workspaces (`terraform workspace new prod`) para isolar os ficheiros de estado `.tfstate`.',
      'Aplicar a infraestrutura executando `terraform apply -var-file=prod.tfvars`.'
    ],
    acceptanceCriteria: [
      'O código-fonte da infraestrutura (os ficheiros `.tf`) é DRY (Don\'t Repeat Yourself) e existe apenas num sítio.',
      'Mudar de workspace altera o estado isolado da infraestrutura para que não haja interferências.',
      'Aplicar DEV e PROD resulta em arquiteturas idênticas, mas com dimensões de máquinas diferentes graças às variáveis.'
    ],
    bonusChallenge: 'Configura um Remote State Backend usando AWS S3 para guardar o `.tfstate` e o AWS DynamoDB para efetuar "State Locking", impedindo que dois developers corram o Terraform ao mesmo tempo e corrompam tudo.'
  },
  {
    id: 'p36', number: 36, sectionId: 'expert', difficulty: 'expert',
    title: 'Deploy PaaS (App Service / Cloud Run)',
    whatYouBuild: 'Deployment de uma aplicação numa plataforma PaaS, comparando com o modelo Kubernetes.',
    concepts: ['PaaS vs Kubernetes', 'App Service / Cloud Run', 'Trade-offs de gestão', 'Custo vs controlo'],
    stack: ['azure', 'gcp', 'app-service'],
    whyItMatters: 'Nem tudo precisa de Kubernetes. Saber quando PaaS é a escolha certa mostra maturidade arquitetural.',
    scenario: 'A startup vai lançar um novo microserviço mas não tem equipa de DevOps para gerir um cluster Kubernetes. Precisas de fazer o deploy do contentor Docker para uma plataforma PaaS 100% gerida, trocando controlo absoluto por velocidade de desenvolvimento.',
    architectureSteps: [
      'Criar o Dockerfile da aplicação e fazer push para um Registry (ex: Azure ACR, AWS ECR ou Google GCR).',
      'Provisionar o serviço PaaS (ex: Azure App Service for Containers ou Google Cloud Run) via CLI ou Terraform.',
      'Configurar o PaaS para puxar a imagem do teu Registry e expor a porta HTTP.',
      'Injetar as variáveis de ambiente e secrets diretamente no painel de configuração do PaaS.'
    ],
    acceptanceCriteria: [
      'A aplicação fica acessível publicamente através de um endpoint HTTPS seguro, providenciado automaticamente pela Cloud.',
      'A infraestrutura requer exatamente zero manutenção de Sistema Operativo (zero patching).',
      'O serviço faz scale down automático para poupar custos quando o tráfego é baixo (se suportado pelo tier escolhido).'
    ],
    bonusChallenge: 'Configura Continuous Deployment (CD) no PaaS: sempre que fazes push de uma nova imagem para o Registry, um Webhook avisa o PaaS que puxa e instala a versão nova em segundos.'
  },
  {
    id: 'p37', number: 37, sectionId: 'expert', difficulty: 'expert',
    title: 'Centralized Logging (ELK / Loki) Enterprise',
    whatYouBuild: 'Stack de logging centralizado à escala enterprise com retenção e pesquisa.',
    concepts: ['ELK / Loki', 'Retenção de logs', 'Índices e pesquisa', 'Observabilidade first-class'],
    stack: ['elasticsearch', 'loki', 'grafana'],
    whyItMatters: 'Observabilidade como cidadã de primeira classe. À escala, logging centralizado é o que permite debug em minutos, não horas.',
    scenario: 'A aplicação está espalhada por 15 servidores e 30 pods Kubernetes. Quando ocorre um bug, os developers perdem horas a fazer SSH para máquinas à procura de ficheiros txt. Precisas de um sistema de Logging Centralizado.',
    architectureSteps: [
      'Fazer deploy do motor de armazenamento e pesquisa de logs (ex: Elasticsearch ou Grafana Loki).',
      'Instalar um Log Agent (ex: Filebeat, Promtail ou Fluentd) como DaemonSet nos worker nodes.',
      'Configurar o Agente para capturar os logs em JSON e enriquecê-los com metadados (nome do pod, namespace, ambiente).',
      'Ligar o Kibana ou o Grafana à base de dados de logs.'
    ],
    acceptanceCriteria: [
      'Todos os logs de todos os contentores fluem automaticamente para o sistema central em menos de 5 segundos.',
      'Um developer consegue pesquisar por `error="true"` ou por um `trace_id` específico e encontrar logs de qualquer serviço no cluster num único dashboard.',
      'Existe uma política de retenção configurada (Data Lifecycle) que apaga logs com mais de 14 dias para não rebentar os discos.'
    ],
    bonusChallenge: 'Cria um Alerta Proativo no Grafana que dispara uma mensagem para o Slack da equipa se a palavra "Exception" aparecer nos logs mais de 50 vezes numa janela de 5 minutos.'
  },
  {
    id: 'p38', number: 38, sectionId: 'expert', difficulty: 'expert',
    title: 'Distributed Tracing (Jaeger / Tempo)',
    whatYouBuild: 'Tracing distribuído que segue um request através de múltiplos microserviços.',
    concepts: ['Distributed tracing', 'Spans e traces', 'OpenTelemetry', 'Latency analysis'],
    stack: ['jaeger', 'tempo', 'opentelemetry'],
    whyItMatters: 'Em microserviços, um request atravessa dezenas de serviços. Tracing é a única forma de encontrar onde a latência nasce.',
    scenario: 'Um cliente VIP queixa-se que o fluxo de "Checkout" demora 8 segundos. O pedido passa pela API Gateway, serviço de Autenticação, serviço de Inventário e Base de Dados. Logs isolados não chegam: precisas de ver o percurso exato do pedido (Distributed Tracing).',
    architectureSteps: [
      'Instalar um backend de Tracing (ex: Jaeger ou Grafana Tempo) no cluster.',
      'Instrumentar o código da aplicação usando o SDK do OpenTelemetry para gerar Traces e Spans.',
      'Garantir que os cabeçalhos HTTP (ex: `traceparent`) são injetados e passados de serviço em serviço.',
      'Gerar tráfego de teste e abrir a interface (UI) de tracing.'
    ],
    acceptanceCriteria: [
      'A UI exibe um gráfico em Cascata (Waterfall) que mapeia o tempo exato de um pedido HTTP saltando entre múltiplos microserviços.',
      'Cada "Span" mostra quantos milissegundos foram gastos nessa função específica ou nessa query à base de dados.',
      'A equipa consegue provar visualmente, em 2 segundos, qual é o serviço específico que está a causar a lentidão de 8 segundos no Checkout.'
    ],
    bonusChallenge: 'Implementa "Tail-based Sampling": em vez de guardares 100% dos traces (o que ficaria caríssimo), o sistema rejeita 99% dos pedidos normais rápidos, mas obriga a guardar todos os traces que resultem num erro 500 ou que demorem mais de 2 segundos.'
  },
  {
    id: 'p39', number: 39, sectionId: 'expert', difficulty: 'expert',
    title: 'Prometheus + Grafana + Alertmanager (Enterprise)',
    whatYouBuild: 'Stack de observabilidade completo com exporters, dashboards e alertas à escala de produção.',
    concepts: ['Deploy Prometheus', 'Exporters', 'Dashboards Grafana', 'Alertas com Alertmanager'],
    stack: ['prometheus', 'grafana', 'alertmanager'],
    whyItMatters: 'Monitorização fecha o ciclo DevOps. Sem observabilidade, a automação é cega.',
    scenario: 'A liderança exige Monitorização Proativa. Se a CPU de um servidor bater nos 90% ou a API começar a devolver erros 500, a equipa de operações tem de ser avisada ANTES que os clientes reclamem no Twitter.',
    architectureSteps: [
      'Fazer deploy da `Kube-Prometheus-Stack` via Helm (instala Prometheus, Grafana e Alertmanager duma vez).',
      'Garantir que as aplicações expõem um endpoint `/metrics` legível pelo Prometheus.',
      'Criar um recurso `ServiceMonitor` que diz ao Prometheus onde ir raspar (scrape) essas métricas.',
      'Criar um Dashboard Grafana e definir regras `PromQL` no Alertmanager.'
    ],
    acceptanceCriteria: [
      'O Prometheus consome métricas das aplicações a cada 15 segundos sem falhas.',
      'O Dashboard no Grafana mostra perfeitamente os indicadores RED (Rate, Errors, Duration) dos microserviços.',
      'Quando a taxa de erros ultrapassa os 5%, o Alertmanager aciona imediatamente um alerta crítico para um canal de Slack/Discord (ou PagerDuty).'
    ],
    bonusChallenge: 'Implementa "Recording Rules" no Prometheus para pré-calcular queries pesadas (como a latência no percentil 99), garantindo que o Dashboard do Grafana carrega instantaneamente, mesmo que esteja a analisar milhões de data points.'
  },
  {
    id: 'p40', number: 40, sectionId: 'expert', difficulty: 'expert',
    title: 'Multi-Environment Release Workflow (Capstone)',
    whatYouBuild: 'Workflow de release completo através de dev → staging → prod com gates e aprovações.',
    concepts: ['Release workflows', 'Approval gates', 'Promotion entre ambientes', 'Rollback controlado'],
    stack: ['github-actions', 'argocd', 'kubernetes'],
    whyItMatters: 'Junta CI/CD enterprise, multi-ambiente e governança. Representa como equipas maduras entregam software.',
    scenario: 'O caos instalou-se porque developers fazem deploy direto para PROD. O CTO exige um "Release Pipeline" rigoroso e auditável. O código tem de fluir de DEV para STAGING, e só depois de ser amplamente validado, chega a PROD.',
    architectureSteps: [
      'Criar 3 namespaces (ou clusters diferentes) para separar DEV, STAGING e PROD.',
      'Montar um pipeline de CI (GitHub Actions) que compila o Docker e atualiza os manifestos do ambiente DEV.',
      'Usar um controlador GitOps (ArgoCD ou Flux) para sincronizar DEV automaticamente.',
      'Configurar um processo de aprovação manual (ex: Pull Request para uma branch `staging`) para promover a versão.',
      'Garantir uma última barreira de aprovação (Approval Gate) rigorosa para subir a mesma imagem exata para PROD.'
    ],
    acceptanceCriteria: [
      'Código integrado na branch principal faz deploy para o ambiente DEV de forma automática e imediata.',
      'A promoção para STAGING está bloqueada até à aprovação de um Engenheiro de QA (Quality Assurance).',
      'A promoção para PROD requer obrigatoriamente um clique de aprovação do Engineering Manager.',
      'É promovida estritamente a MESMA imagem Docker gerada na fase inicial (não se reconstrói código entre fases para evitar surpresas).'
    ],
    bonusChallenge: 'Integra Testes End-to-End (E2E) no pipeline de STAGING. Se os testes falharem nesse ambiente, o próprio sistema bloqueia ou cancela o PR para PROD, impedindo que os managers aprovem código quebrado por engano.'
  },

  // ── SECTION 5 · Security, Observability & AI (41–50) ───────────────
  {
    id: 'p41', number: 41, sectionId: 'security-ai', difficulty: 'expert',
    title: 'SSL / TLS Implementation',
    whatYouBuild: 'Setup completo de SSL/TLS garantindo comunicação encriptada, com renovação de certificados.',
    concepts: ['HTTPS & TLS', 'Certificados & trust chains', 'Público vs privado', 'Terminação segura de tráfego'],
    stack: ['nginx', 'certbot', 'letsencrypt'],
    whyItMatters: 'A segurança começa no tráfego encriptado. Este projecto garante que percebes o que HTTPS realmente faz, não só "ligar SSL".',
    scenario: 'Um scan de vulnerabilidades revelou que as ferramentas internas da empresa comunicam via HTTP (plain text). A equipa de Segurança exige que feches imediatamente a falha cifrando o tráfego com HTTPS.',
    architectureSteps: [
      'Fazer deploy de um servidor Nginx básico numa VM Linux.',
      'Registar um domínio (podes usar serviços gratuitos como DuckDNS).',
      'Instalar o cliente `certbot` e usar o protocolo ACME da Let\'s Encrypt para gerar um certificado válido.',
      'Configurar o Nginx para bloquear a porta 80 e escutar exclusivamente na porta 443 apontando para o certificado gerado.'
    ],
    acceptanceCriteria: [
      'Aceder ao site via `http://` redireciona automaticamente (HTTP 301) para `https://`.',
      'O browser exibe o cadeado verde (certificado válido e de confiança) sem avisos de "Not Secure".',
      'O comando `certbot renew --dry-run` executa com sucesso, provando que a renovação automática está pronta.'
    ],
    bonusChallenge: 'Implementa "Strict Security Headers" no Nginx, nomeadamente o HSTS (HTTP Strict Transport Security), e testa o teu domínio no Qualys SSL Labs até obteres uma nota A+.'
  },
  {
    id: 'p42', number: 42, sectionId: 'security-ai', difficulty: 'expert',
    title: 'DNS Server Project',
    whatYouBuild: 'Setup de um servidor DNS próprio com zonas, records e resolução.',
    concepts: ['DNS internals', 'Zonas e records', 'Resolução recursiva vs autoritativa', 'DNS security'],
    stack: ['bind', 'coredns', 'linux'],
    whyItMatters: 'DNS está por trás de quase toda a comunicação. Perceber como funciona por dentro resolve uma classe inteira de incidentes.',
    scenario: 'A empresa dependia de um fornecedor de DNS externo que sofreu um ataque DDoS e caiu globalmente. Os vossos serviços internos deixaram de conseguir comunicar. Precisas de implementar um servidor DNS autoritativo interno para a rede local.',
    architectureSteps: [
      'Instalar o CoreDNS ou o BIND9 numa máquina Linux.',
      'Criar uma Zona (Zone file) dedicada para um domínio interno (ex: `interna.empresa.local`).',
      'Adicionar "A Records" para apontar `db.interna.empresa.local` e `api.interna.empresa.local` para IPs locais.',
      'Modificar o ficheiro `/etc/resolv.conf` de outra máquina de teste para usar este novo servidor DNS.'
    ],
    acceptanceCriteria: [
      'Executar `dig db.interna.empresa.local` a partir de um host cliente resolve o IP correto instantaneamente.',
      'O servidor DNS atua também como Recursive Resolver: pedidos externos (ex: google.com) são reencaminhados corretamente para o 8.8.8.8.',
      'O serviço arranca automaticamente no boot da máquina.'
    ],
    bonusChallenge: 'Configura um segundo servidor DNS (Slave) e estabelece uma "Zone Transfer" (AXFR) para que, se o master cair, o slave garanta a Alta Disponibilidade do serviço de nomes.'
  },
  {
    id: 'p43', number: 43, sectionId: 'security-ai', difficulty: 'expert',
    title: 'Gateway API Demo',
    whatYouBuild: 'Implementação da Gateway API do Kubernetes (a evolução do Ingress) para routing avançado.',
    concepts: ['Gateway API', 'Evolução do Ingress', 'Routing L7', 'Traffic splitting'],
    stack: ['kubernetes', 'gateway-api', 'envoy'],
    whyItMatters: 'A Gateway API é o futuro do ingress no Kubernetes. Estar à frente desta transição é uma vantagem.',
    scenario: 'O objeto "Ingress" clássico do Kubernetes tornou-se insuficiente para a vossa arquitetura Multi-Tenant. Os developers precisam de dividir tráfego por cabeçalhos HTTP, mas a equipa de Plataforma quer ser a única a controlar as portas e os certificados TLS.',
    architectureSteps: [
      'Instalar as Custom Resource Definitions (CRDs) da Kubernetes Gateway API no cluster.',
      'Fazer deploy do Envoy Gateway Controller.',
      'Criar um recurso `Gateway` no namespace da infraestrutura gerido pela equipa de Plataforma.',
      'Criar um recurso `HTTPRoute` no namespace dos developers que se anexa dinamicamente ao Gateway.'
    ],
    acceptanceCriteria: [
      'O tráfego flui com sucesso desde o Load Balancer externo, passa pelo Gateway e atinge os pods corretos.',
      'As responsabilidades estão segregadas: Plataforma controla o `Gateway` e TLS, Developers controlam apenas o path routing (`HTTPRoute`).',
      'O `HTTPRoute` divide perfeitamente o tráfego de uma API: 90% para a versão v1 e 10% para a v2.'
    ],
    bonusChallenge: 'Usa a capacidade nativa do `HTTPRoute` para criar um Header Filter: faz com que pedidos HTTP contendo o cabeçalho "X-Beta-Tester: true" sejam os únicos reencaminhados para a versão Canary da API.'
  },
  {
    id: 'p44', number: 44, sectionId: 'security-ai', difficulty: 'expert',
    title: 'Software Supply Chain Security (SBOM)',
    whatYouBuild: 'Geração e validação de Software Bill of Materials e assinatura de imagens.',
    concepts: ['Supply chain security', 'SBOM (Software Bill of Materials)', 'Vulnerability scanning', 'Image signing'],
    stack: ['trivy', 'cosign', 'docker'],
    whyItMatters: 'Com ataques recentes à supply chain (ex: SolarWinds, Log4j), gerar SBOMs e assinar artefactos é um requisito de compliance crescente.',
    scenario: 'O governo emitiu novas normas exigindo que todas as aplicações fornecidas ao Estado incluam uma "Lista de Ingredientes" (SBOM) exata e que as imagens corram apenas se vierem de fontes assinadas digitalmente.',
    architectureSteps: [
      'Usar o `Syft` ou `Trivy` para fazer o scan a uma imagem Docker e exportar o resultado no formato SPDX ou CycloneDX (SBOM).',
      'Analisar as vulnerabilidades (CVEs) reportadas nessa imagem base.',
      'Gerar um par de chaves assimétricas usando o `Cosign` (projeto da Sigstore).',
      'Assinar digitalmente a imagem Docker com a chave privada e forçar o Kubernetes a validar a assinatura antes do deploy.'
    ],
    acceptanceCriteria: [
      'O ficheiro SBOM gerado mapeia absolutamente todas as bibliotecas e dependências open-source embutidas no contentor.',
      'A execução do `cosign verify` retorna positivo atestando a autenticidade e integridade da imagem.',
      'O sistema bloqueia ativamente o arranque de imagens que não possuam a assinatura criptográfica correta.'
    ],
    bonusChallenge: 'Instala o Kyverno (Admission Controller) no Kubernetes e escreve uma política que rejeita a criação de qualquer Pod cuja imagem não passe na validação de assinatura do Cosign.'
  },
  {
    id: 'p45', number: 45, sectionId: 'security-ai', difficulty: 'expert',
    title: 'OWASP ZAP Dynamic Security (DAST)',
    whatYouBuild: 'Testes de segurança dinâmicos (DAST) contra uma aplicação web com OWASP ZAP.',
    concepts: ['Web application security', 'DAST fundamentals', 'Vulnerabilidades comuns', 'Análise de findings'],
    stack: ['owasp-zap', 'docker'],
    whyItMatters: 'Segurança não é opcional em DevOps. Este projecto constrói consciência e responsabilidade de segurança (Shift Left Security).',
    scenario: 'Uma nova API foi acabada de desenvolver. Antes que o lançamento seja aprovado, precisas de automatizar o "pen-testing" contra a API a correr, de forma a detetar vulnerabilidades que não são visíveis numa mera análise estática (DAST).',
    architectureSteps: [
      'Subir uma aplicação web intencionalmente vulnerável (ex: OWASP Juice Shop) usando Docker.',
      'Executar o container do OWASP ZAP em modo daemon ou baseline scan contra a aplicação alvo.',
      'Ligar o modo "Active Scan" para injetar ataques reais (SQLi, XSS) contra a API.',
      'Gerar o relatório de segurança em formato HTML/Markdown.'
    ],
    acceptanceCriteria: [
      'O scanner interage com a app web através de pedidos HTTP reais ("spidering" e ataque).',
      'O ZAP deteta com sucesso as vulnerabilidades graves abertas e gera alertas (Findings).',
      'O relatório HTML evidencia o payload exato que expôs a falha (ex: `1 OR 1=1`), junto com recomendações de correção.'
    ],
    bonusChallenge: 'Integra este comando do ZAP no pipeline de GitHub Actions de forma a que o pipeline fique vermelho (Falhe) automaticamente caso seja encontrada uma vulnerabilidade com grau "High" ou superior.'
  },
  {
    id: 'p46', number: 46, sectionId: 'security-ai', difficulty: 'expert',
    title: 'Agentic AI com MCP (Model Context Protocol)',
    whatYouBuild: 'Projecto usando o Model Context Protocol (MCP) para expor ferramentas DevOps seguras a um LLM.',
    concepts: ['MCP fundamentals', 'Partilha segura de contexto', 'Interações AI–sistema', 'Acesso controlado de AI'],
    stack: ['mcp', 'ai', 'python'],
    whyItMatters: 'O MCP introduz integração segura de AI em sistemas DevOps — a próxima grande evolução no tooling de engenharia.',
    scenario: 'A tua equipa quer integrar LLMs diretamente nas ferramentas de infraestrutura (Terraform, K8s). No entanto, dar uma API Key da Cloud diretamente a um modelo alojado fora é um risco crítico. Precisas de implementar o Model Context Protocol (MCP) para partilhar contexto de forma estritamente segura.',
    architectureSteps: [
      'Instalar um servidor MCP open-source na tua máquina (ex: integrando com Kubernetes ou ficheiros locais).',
      'Configurar as "Tools" específicas e restritas permitidas no MCP (ex: `list_pods`, `read_logs`).',
      'Ligar um cliente LLM (como o Claude Desktop ou um script local Python) ao servidor MCP.',
      'Pedir ao modelo em linguagem natural: "Verifica que pods estão em erro no meu cluster".'
    ],
    acceptanceCriteria: [
      'O LLM consegue ler o estado do cluster através do MCP sem nunca ter tido acesso direto às tuas credenciais do Kubernetes (Kubeconfig).',
      'Todas as interações e pedidos a ferramentas são validadas e registadas (logs de auditoria) pelo servidor.',
      'O modelo diagnostica um erro real injetado (ex: CrashLoopBackOff) baseando-se unicamente no output retornado pela tool do MCP.'
    ],
    bonusChallenge: 'Usando o SDK oficial do MCP (em Python ou TypeScript), desenvolve o teu próprio MCP Server customizado que executa e retorna de forma segura o output de um script bash interno da tua empresa (ex: `check-billing.sh`).'
  },
  {
    id: 'p47', number: 47, sectionId: 'security-ai', difficulty: 'expert',
    title: 'RAG (Retrieval-Augmented Gen) para Docs',
    whatYouBuild: 'Sistema RAG que permite aos developers conversar com a documentação de arquitetura interna.',
    concepts: ['RAG architecture', 'Vector databases', 'Embeddings', 'AI assistants'],
    stack: ['ai', 'python', 'llm', 'vector-db'],
    whyItMatters: 'O engenheiro DevOps do futuro vai construir sistemas para acelerar a adoção técnica. Chatbots com contexto interno são o novo standard.',
    scenario: 'Os novos developers perdem semanas a ler os Wikis lentos do Confluence para perceber como fazer deploy. Em vez de ler, eles querem "falar" com a documentação da empresa. Tens de construir um sistema RAG focado no vosso contexto DevOps.',
    architectureSteps: [
      'Criar um script em Python que consome ficheiros Markdown da vossa pasta de arquiteturas e runbooks.',
      'Converter esses textos em Embeddings usando um modelo da OpenAI (ou open-source).',
      'Guardar os Embeddings gerados numa Vector Database leve (ex: ChromaDB ou Qdrant).',
      'Construir uma pequena API (FastAPI) que recebe a pergunta do user, procura os 3 blocos de texto mais similares no ChromaDB, e envia-os como contexto para o LLM responder.'
    ],
    acceptanceCriteria: [
      'O sistema responde baseando-se APENAS na documentação fornecida e não "alucina" conhecimentos genéricos da internet.',
      'O Chatbot inclui sempre a "Fonte" na resposta, indicando de que ficheiro Markdown original retirou a informação.',
      'Atualizar o ficheiro Markdown de um Runbook resulta na mudança de comportamento do LLM na sua próxima resposta.'
    ],
    bonusChallenge: 'Substitui a dependência da OpenAI Cloud por um LLM completamente Open-Source a correr localmente (via Ollama, ex: modelo `llama3`). Isto garante o conceito de Privacidade Absoluta — nenhuns dados sensíveis da empresa saem do computador.'
  },
  {
    id: 'p48', number: 48, sectionId: 'security-ai', difficulty: 'expert',
    title: 'MLOps Pipeline (Kubeflow & MLflow)',
    whatYouBuild: 'Workflow MLOps end-to-end para treino, versionamento e deployment de modelos de ML.',
    concepts: ['Model lifecycle', 'Pipelines treino vs inferência', 'Versionamento de modelos', 'Deployment automation'],
    stack: ['mlflow', 'kubeflow', 'python'],
    whyItMatters: 'Sistemas de AI exigem disciplina DevOps rígida. Ligar os mundos DevOps e ML garante um perfil altamente requisitado.',
    scenario: 'Os Data Scientists estão a treinar modelos fantásticos nos seus portáteis. Mas quando vão de férias, ninguém consegue reproduzir os treinos nem fazer deploys confiáveis. Tens de trazer a disciplina de CI/CD para o ciclo de vida do Machine Learning (MLOps).',
    architectureSteps: [
      'Instalar o Kubeflow num cluster Kubernetes e expor o painel do MLflow.',
      'Empacotar o script de treino (ex: scikit-learn ou PyTorch) de um modelo num container Docker.',
      'Configurar um Pipeline no Kubeflow que executa passos sequenciais: (1) Faz download dos dados brutos, (2) Treina o modelo, (3) Avalia a precisão (accuracy).',
      'Inserir código no script para enviar a métrica de "accuracy" gerada diretamente para o tracking server do MLflow.'
    ],
    acceptanceCriteria: [
      'O treino pesado do modelo acontece no cluster Kubernetes, libertando o portátil local do cientista.',
      'A UI do MLflow exibe um histórico de diferentes "Runs", permitindo comparar visualmente que hiper-parâmetros produziram o modelo mais certeiro.',
      'O artefacto final do modelo (ficheiro `.pkl` ou `.pt`) é guardado de forma imutável associado a esse Run específico.'
    ],
    bonusChallenge: 'Cria uma automação baseada em eventos (ex: Argo Events ou AWS EventBridge) para que sempre que um novo ficheiro CSV de dados seja introduzido num bucket S3, o Kubeflow acorde sozinho e inicie o treino de uma nova versão do modelo com dados frescos.'
  },
  {
    id: 'p49', number: 49, sectionId: 'security-ai', difficulty: 'expert',
    title: 'eBPF Observability & Security (Cilium)',
    whatYouBuild: 'Infraestrutura de networking K8s governada por eBPF com observabilidade extrema (Hubble).',
    concepts: ['eBPF kernel tech', 'Cilium CNI', 'Hubble observability', 'L7 Network Policies'],
    stack: ['kubernetes', 'cilium', 'ebpf'],
    whyItMatters: 'eBPF é a tecnologia mais transformadora do Kernel Linux da última década. Larga o iptables; o futuro da Cloud corre no kernel.',
    scenario: 'As ferramentas tradicionais (iptables e kube-proxy) estão a consumir imensa CPU do cluster e a equipa está totalmente cega em relação a que serviços estão a bloquear a rede. Tens de migrar o networking para "eBPF", a revolução infraestrutural.',
    architectureSteps: [
      'Fazer spawn de um cluster Kubernetes totalmente limpo SEM CNI pré-instalado (ex: `k3s --flannel-backend=none`).',
      'Instalar o Cilium como o CNI e ativar as flags relativas ao kube-proxy replacement, L7 Proxy e Hubble.',
      'Fazer deploy de uma aplicação com duas componentes: frontend e backend.',
      'Escrever uma `CiliumNetworkPolicy` (Camada 7) que bloqueia todos os pedidos HTTP `POST` do frontend para o backend, permitindo apenas `GET`.'
    ],
    acceptanceCriteria: [
      'O tráfego de rede é encaminhado a alta velocidade diretamente pelo Kernel Linux via eBPF ignorando completamente o obsoleto iptables.',
      'A UI do Hubble desenha um mapa de serviço dinâmico mostrando em vermelho os pacotes TCP que foram descartados.',
      'Qualquer teste que faça `curl -X POST` é imediatamente bloqueado, provando proteção refinada ao nível aplicacional (L7) que policies clássicas não conseguem atingir.'
    ],
    bonusChallenge: 'Instala a framework Tetragon (ecossistema Cilium eBPF) para Segurança em Runtime e Observabilidade de Syscalls. Configura o Tetragon para disparar um alerta terminal sempre que um utilizador malicioso tente invocar uma shell interactiva (`/bin/bash`) no interior de qualquer pod do cluster.'
  },
  {
    id: 'p50', number: 50, sectionId: 'security-ai', difficulty: 'expert',
    title: 'End-to-End DevSecOps (Capstone Final)',
    whatYouBuild: 'Pipeline DevSecOps completo cobrindo build, teste, segurança, deploy progressivo e observabilidade.',
    concepts: ['Secure SDLC', 'Segurança integrada no CI/CD', 'Infraestrutura imutável', 'GitOps & Rollbacks'],
    stack: ['github-actions', 'trivy', 'argocd', 'kubernetes', 'prometheus'],
    whyItMatters: 'Junta TUDO. Representa o mindset do Senior DevOps: segurança, fiabilidade e automação não são features opcionais — são o default de fábrica.',
    scenario: 'É a tua obra-prima final. Vais ligar todas as peças num único projeto que sirva como a "Tese de Mestrado" do teu portfolio. É isto que tens de mostrar numa entrevista para um cargo Senior de Plataforma ou SRE.',
    architectureSteps: [
      'Criar o código de infra (Terraform) que provisiona o Cluster K8s e o Registry.',
      'Desenvolver uma App simples (Golang ou Node) com testes unitários associados e o respetivo Dockerfile multi-stage.',
      'Configurar o CI Pipeline (GitHub Actions) que compila, testa (SAST), analisa CVEs (Trivy), assina a imagem (Cosign) e publica-a.',
      'Configurar o CD (ArgoCD) para detetar novas versões e aplicar os manifestos com a estratégia Canary (Argo Rollouts).',
      'Configurar a Stack Observável (Prometheus) para monitorizar a taxa de erro do Canary Deployment durante o processo de deploy.'
    ],
    acceptanceCriteria: [
      'ZERO intervenções manuais necessárias desde a introdução do `git push` até ao serviço estar atualizado ao vivo em Produção (Full Automation).',
      'Se o developer introduzir acidentalmente uma dependência com falhas de segurança no código, o pipeline CI deteta e barra a release (fica vermelha).',
      'Se o Canary Deployment começar a responder com códigos HTTP 500 aos utilizadores, o Argo Rollouts apercebe-se (via Prometheus) e faz rollback automático à imagem estável anterior.'
    ],
    bonusChallenge: 'Se construíste isto do zero, entendes genuinamente as engrenagens, e consegues explicar os "porquês" a um arquiteto sénior... Parabéns. Não precisas de desafios bónus. Pede um aumento à tua empresa.'
  },
];

export function projectsBySection(sectionId: string): ProjectItem[] {
  return ALL_PROJECTS.filter(p => p.sectionId === sectionId);
}

export function findProject(id: string): ProjectItem | undefined {
  return ALL_PROJECTS.find(p => p.id === id);
}
