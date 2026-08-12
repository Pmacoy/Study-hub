export interface InterviewQuestion {
  n: number;
  q: string;
  a: string;
}

export interface InterviewSection {
  id: string;
  title: string;
  emoji: string;
  range: string;
  questions: InterviewQuestion[];
}

// Transcrição das 100 perguntas do PDF "100 DevOps Engineer Interview
// Questions and Answers" (Jyothi Mulkuntla), traduzidas para pt-PT.
// A estrutura das 10 secções segue exactamente o original.

export const INTERVIEW_SECTIONS: InterviewSection[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentos DevOps',
    emoji: '♾️',
    range: '1–10',
    questions: [
      { n: 1, q: 'O que é DevOps?', a: 'Uma cultura e conjunto de práticas que combina desenvolvimento e operações para entregar software mais depressa e de forma mais fiável.' },
      { n: 2, q: 'Quais são os objectivos principais do DevOps?', a: 'Automação, entrega mais rápida, melhor colaboração, fiabilidade, escalabilidade e feedback contínuo.' },
      { n: 3, q: 'O que é o ciclo de vida DevOps?', a: 'Plan, code, build, test, release, deploy, operate, monitor e improve.' },
      { n: 4, q: 'O que é Continuous Integration?', a: 'A Integração Contínua faz build e testa o código automaticamente sempre que os developers submetem alterações.' },
      { n: 5, q: 'O que é Continuous Delivery?', a: 'A Entrega Contínua mantém o software pronto para deploy em produção através de processos automatizados de build, teste e release.' },
      { n: 6, q: 'O que é Continuous Deployment?', a: 'O Deployment Contínuo liberta automaticamente para produção todas as alterações validadas.' },
      { n: 7, q: 'O que é Infrastructure as Code?', a: 'Gerir infraestrutura através de ficheiros de configuração controlados por versão.' },
      { n: 8, q: 'O que é configuration management?', a: 'Manter servidores e sistemas num estado consistente e desejado.' },
      { n: 9, q: 'O que é infraestrutura imutável?', a: 'Substituir servidores ou containers em vez de os modificar depois do deployment.' },
      { n: 10, q: 'O que é shift-left testing?', a: 'Realizar os testes mais cedo no ciclo de vida do desenvolvimento de software.' },
    ],
  },
  {
    id: 'linux',
    title: 'Linux e Redes',
    emoji: '🐧',
    range: '11–20',
    questions: [
      { n: 11, q: 'Como verificas o uso de disco em Linux?', a: 'Usa `df -h` para uso do filesystem e `du -sh` para uso por directório.' },
      { n: 12, q: 'Como verificas o uso de memória em Linux?', a: 'Usa `free -m`, `top` ou `htop`.' },
      { n: 13, q: 'Como encontras os processos em execução?', a: 'Usa `ps aux`, `top` ou `htop`.' },
      { n: 14, q: 'Como paras um processo em Linux?', a: 'Usa `kill <PID>` ou `kill -9 <PID>` quando a terminação graciosa falha.' },
      { n: 15, q: 'O que faz o comando chmod?', a: 'Altera as permissões de ficheiros e directórios. Ex: `chmod 755 file.sh` → `-rwxr-xr-x`.' },
      { n: 16, q: 'O que faz o comando chown?', a: 'Altera o dono e o grupo de um ficheiro ou directório. Ex: `chown user1:dev file.txt`.' },
      { n: 17, q: 'O que é um symbolic link?', a: 'Um ficheiro que aponta para outro ficheiro ou directório.' },
      { n: 18, q: 'Como verificas as portas à escuta?', a: 'Usa `ss -tulpn` ou `netstat -tulpn`.' },
      { n: 19, q: 'O que é DNS?', a: 'O DNS converte nomes de domínio em endereços IP.' },
      { n: 20, q: 'Qual é a diferença entre TCP e UDP?', a: 'TCP é fiável e orientado a ligação (usa handshake SYN/ACK), enquanto UDP é mais rápido e sem ligação, sem garantias nem handshake.' },
    ],
  },
  {
    id: 'git',
    title: 'Git e Controlo de Versões',
    emoji: '🌿',
    range: '21–30',
    questions: [
      { n: 21, q: 'O que é o Git?', a: 'Um sistema de controlo de versões distribuído usado para acompanhar alterações no código-fonte.' },
      { n: 22, q: 'Qual é a diferença entre Git e GitHub?', a: 'O Git é a ferramenta de controlo de versões; o GitHub é uma plataforma que aloja repositórios Git.' },
      { n: 23, q: 'O que é uma branch do Git?', a: 'Uma linha de desenvolvimento independente.' },
      { n: 24, q: 'O que é um merge conflict?', a: 'Ocorre quando o Git não consegue combinar automaticamente alterações conflituosas.' },
      { n: 25, q: 'O que é o git rebase?', a: 'O rebase move ou reaplica commits sobre um novo commit base.' },
      { n: 26, q: 'Qual é a diferença entre merge e rebase?', a: 'O merge preserva o histórico da branch, enquanto o rebase cria um histórico linear mais limpo.' },
      { n: 27, q: 'O que faz o git stash?', a: 'Guarda temporariamente alterações não commitadas sem criar um commit.' },
      { n: 28, q: 'O que faz o git cherry-pick?', a: 'Aplica um commit específico de uma branch noutra branch.' },
      { n: 29, q: 'O que é um pull request?', a: 'Propõe alterações de código para revisão antes do merge.' },
      { n: 30, q: 'Como desfazes o último commit do Git?', a: 'Usa `git revert` para uma reversão segura, ou `git reset` para mover o ponteiro da branch.' },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD',
    emoji: '⚙️',
    range: '31–40',
    questions: [
      { n: 31, q: 'O que é um pipeline CI/CD?', a: 'Um workflow automatizado que faz build, testa e faz deploy de software.' },
      { n: 32, q: 'Quais são as ferramentas CI/CD mais comuns?', a: 'Jenkins, GitHub Actions, GitLab CI/CD, Azure DevOps, CircleCI e Argo CD.' },
      { n: 33, q: 'O que é o Jenkins?', a: 'Um servidor de automação usado para fazer build, testar e deploy de aplicações.' },
      { n: 34, q: 'O que é um pipeline do Jenkins?', a: 'Define as etapas de CI/CD como código, normalmente num Jenkinsfile.' },
      { n: 35, q: 'O que é um build artifact?', a: 'Um pacote de saída como um JAR, binário, imagem ou arquivo.' },
      { n: 36, q: 'O que é pipeline as code?', a: 'Guardar as definições do workflow CI/CD em controlo de versões.' },
      { n: 37, q: 'O que é um deployment gate?', a: 'Uma condição ou aprovação necessária antes de um release avançar.' },
      { n: 38, q: 'O que é um rollback?', a: 'Restaurar uma aplicação para uma versão anterior estável.' },
      { n: 39, q: 'O que é um blue-green deployment?', a: 'Usa dois ambientes idênticos e troca o tráfego da versão antiga para a nova.' },
      { n: 40, q: 'O que é um canary deployment?', a: 'Liberta uma versão nova para uma pequena percentagem de utilizadores antes do deployment alargado.' },
    ],
  },
  {
    id: 'docker',
    title: 'Docker e Containers',
    emoji: '🐳',
    range: '41–50',
    questions: [
      { n: 41, q: 'O que é o Docker?', a: 'Uma plataforma para construir, empacotar e correr aplicações em containers.' },
      { n: 42, q: 'O que é um container?', a: 'Um processo isolado que empacota uma aplicação com as suas dependências.' },
      { n: 43, q: 'O que é uma imagem Docker?', a: 'Um template só de leitura usado para criar containers.' },
      { n: 44, q: 'O que é um Dockerfile?', a: 'Um ficheiro que contém as instruções para construir uma imagem Docker.' },
      { n: 45, q: 'O que é o Docker Compose?', a: 'Define e corre aplicações multi-container usando um ficheiro YAML.' },
      { n: 46, q: 'Qual é a diferença entre um container e uma máquina virtual?', a: 'Os containers partilham o kernel do host, enquanto as máquinas virtuais incluem um sistema operativo convidado completo.' },
      { n: 47, q: 'O que é um Docker volume?', a: 'Fornece armazenamento persistente para os dados do container.' },
      { n: 48, q: 'O que é port mapping no Docker?', a: 'Liga uma porta do host a uma porta do container. Ex: host 8080 → container 80.' },
      { n: 49, q: 'Como listas os containers em execução?', a: 'Usa `docker ps`.' },
      { n: 50, q: 'Como reduzes o tamanho de uma imagem Docker?', a: 'Usa imagens base pequenas, multi-stage builds, `.dockerignore` e menos camadas.' },
    ],
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    emoji: '☸️',
    range: '51–60',
    questions: [
      { n: 51, q: 'O que é o Kubernetes?', a: 'Uma plataforma para fazer deploy, escalar e gerir aplicações em containers.' },
      { n: 52, q: 'O que é um Pod do Kubernetes?', a: 'A unidade mais pequena com deployment possível no Kubernetes; contém um ou mais containers.' },
      { n: 53, q: 'O que é um Deployment do Kubernetes?', a: 'Gere as réplicas da aplicação e os rolling updates.' },
      { n: 54, q: 'O que é um Service do Kubernetes?', a: 'Fornece acesso de rede estável a um grupo de Pods.' },
      { n: 55, q: 'O que é um Namespace do Kubernetes?', a: 'Separa logicamente recursos dentro de um cluster.' },
      { n: 56, q: 'O que é um ConfigMap?', a: 'Guarda configuração não sensível da aplicação.' },
      { n: 57, q: 'O que é um Secret do Kubernetes?', a: 'Guarda valores sensíveis como passwords, tokens e certificados.' },
      { n: 58, q: 'O que é um Ingress?', a: 'Gere o acesso HTTP e HTTPS externo aos serviços do cluster.' },
      { n: 59, q: 'O que é um StatefulSet?', a: 'Gere aplicações stateful que precisam de identidades e armazenamento estáveis.' },
      { n: 60, q: 'O que é um DaemonSet?', a: 'Garante que um Pod corre em cada node seleccionado do Kubernetes.' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    emoji: '☁️',
    range: '61–70',
    questions: [
      { n: 61, q: 'O que é cloud computing?', a: 'Fornece recursos de computação a pedido através da internet.' },
      { n: 62, q: 'O que são IaaS, PaaS e SaaS?', a: 'São serviços de infraestrutura, plataforma e software entregues através da cloud.' },
      { n: 63, q: 'O que é auto-scaling?', a: 'Ajusta automaticamente os recursos conforme a procura do workload.' },
      { n: 64, q: 'O que é um load balancer?', a: 'Distribui o tráfego de entrada por vários servidores.' },
      { n: 65, q: 'O que é uma região cloud?', a: 'Uma área geográfica que contém datacenters da cloud.' },
      { n: 66, q: 'O que é uma availability zone?', a: 'Uma localização de datacenter isolada dentro de uma região.' },
      { n: 67, q: 'O que é uma virtual private cloud?', a: 'Uma VPC é uma rede logicamente isolada dentro de uma cloud pública.' },
      { n: 68, q: 'O que é um security group?', a: 'Uma firewall virtual que controla o tráfego de entrada e de saída.' },
      { n: 69, q: 'O que é serverless computing?', a: 'Corre código sem que os utilizadores precisem de gerir servidores.' },
      { n: 70, q: 'O que é o modelo de responsabilidade partilhada?', a: 'O fornecedor cloud protege a cloud, enquanto os clientes protegem os seus workloads e dados.' },
    ],
  },
  {
    id: 'iac',
    title: 'Infrastructure as Code e Automação',
    emoji: '🏗️',
    range: '71–80',
    questions: [
      { n: 71, q: 'O que é o Terraform?', a: 'Uma ferramenta de Infrastructure as Code usada para provisionar e gerir infraestrutura.' },
      { n: 72, q: 'O que é o Terraform state?', a: 'O state mapeia os recursos da configuração à infraestrutura real.' },
      { n: 73, q: 'O que faz o terraform plan?', a: 'Pré-visualiza as alterações de infraestrutura que o Terraform tenciona fazer.' },
      { n: 74, q: 'O que faz o terraform apply?', a: 'Cria ou actualiza infraestrutura de acordo com a configuração Terraform.' },
      { n: 75, q: 'O que é um módulo Terraform?', a: 'Uma colecção reutilizável de recursos Terraform.' },
      { n: 76, q: 'O que é o Ansible?', a: 'Uma ferramenta de automação e gestão de configuração sem agente.' },
      { n: 77, q: 'O que é um playbook do Ansible?', a: 'Um ficheiro YAML que define as tarefas de automação.' },
      { n: 78, q: 'O que é um inventário do Ansible?', a: 'Define os hosts e grupos geridos pelo Ansible.' },
      { n: 79, q: 'O que é idempotência?', a: 'Significa que a execução repetida produz o mesmo resultado desejado sem alterações desnecessárias.' },
      { n: 80, q: 'O que é um inventário dinâmico?', a: 'Obtém automaticamente os hosts a partir de plataformas cloud ou sistemas externos.' },
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitorização e Logging',
    emoji: '📊',
    range: '81–90',
    questions: [
      { n: 81, q: 'O que é monitorização?', a: 'Recolhe e analisa métricas do sistema para identificar problemas de saúde e desempenho.' },
      { n: 82, q: 'O que é observabilidade?', a: 'Usa métricas, logs e traces para compreender o estado interno de um sistema.' },
      { n: 83, q: 'O que é o Prometheus?', a: 'Um sistema de monitorização que recolhe e consulta métricas de série temporal.' },
      { n: 84, q: 'O que é o Grafana?', a: 'Cria dashboards e visualizações a partir de dados de monitorização.' },
      { n: 85, q: 'O que é a stack ELK?', a: 'Combina Elasticsearch, Logstash e Kibana para gestão centralizada de logs.' },
      { n: 86, q: 'O que é um alerta?', a: 'Notifica as equipas quando uma métrica ou condição ultrapassa um limiar definido.' },
      { n: 87, q: 'O que é application performance monitoring?', a: 'O APM acompanha tempos de resposta, erros, dependências e desempenho de transacções da aplicação.' },
      { n: 88, q: 'O que é distributed tracing?', a: 'Acompanha um request à medida que ele atravessa múltiplos serviços.' },
      { n: 89, q: 'O que é um SLA?', a: 'Um acordo formal que define a disponibilidade ou desempenho esperados do serviço.' },
      { n: 90, q: 'O que são SLI e SLO?', a: 'Um SLI mede o desempenho do serviço, enquanto um SLO define o valor alvo.' },
    ],
  },
  {
    id: 'security',
    title: 'Segurança e Troubleshooting',
    emoji: '🔐',
    range: '91–100',
    questions: [
      { n: 91, q: 'O que é DevSecOps?', a: 'Integra práticas de segurança ao longo de todo o ciclo de vida DevOps.' },
      { n: 92, q: 'O que é o princípio do menor privilégio?', a: 'Utilizadores e serviços recebem apenas as permissões necessárias para executar as suas tarefas.' },
      { n: 93, q: 'Como devem ser geridos os secrets?', a: 'Guardá-los num gestor de secrets seguro e nunca os escrever directamente no código-fonte.' },
      { n: 94, q: 'O que é vulnerability scanning?', a: 'Verifica código, dependências, imagens e sistemas em busca de fraquezas de segurança conhecidas.' },
      { n: 95, q: 'O que é RBAC?', a: 'Role-Based Access Control atribui permissões de acordo com os papéis definidos.' },
      { n: 96, q: 'Como fazes troubleshooting de um deployment falhado?', a: 'Verifica os logs do pipeline, os logs da aplicação, os events, a configuração, os limites de recursos e as alterações recentes.' },
      { n: 97, q: 'Como fazes troubleshooting de CPU elevado?', a: 'Identifica o processo consumidor, inspecciona logs e métricas, e verifica o tráfego ou o comportamento da aplicação.' },
      { n: 98, q: 'Como fazes troubleshooting de um CrashLoopBackOff no Kubernetes?', a: 'Inspecciona os logs do Pod, os events, os comandos, as variáveis de ambiente, as probes e os limites de recursos.' },
      { n: 99, q: 'O que é root-cause analysis?', a: 'Identifica a razão subjacente pela qual um incidente ocorreu.' },
      { n: 100, q: 'O que é um post-incident review?', a: 'Uma revisão sem culpados que documenta o incidente, o impacto, a causa raiz, as lições e as acções preventivas.' },
    ],
  },
];

export const TOTAL_INTERVIEW_QUESTIONS = INTERVIEW_SECTIONS.reduce(
  (sum, s) => sum + s.questions.length, 0
);
