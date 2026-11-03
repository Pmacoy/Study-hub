import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // Linux
  { category: 'Linux', front: 'chmod 755 vs 644', back: '755 (rwxr-xr-x) é o padrão para diretórios e scripts executáveis. 644 (rw-r--r--) é o padrão para ficheiros regulares (text/config).' },
  { category: 'Linux', front: 'chown -R user:group /dir', back: 'Altera recursivamente (-R) o dono (user) e o grupo proprietário de todos os ficheiros dentro do diretório.' },
  { category: 'Linux', front: 'journalctl -u nginx -f', back: 'Lê os logs geridos pelo systemd para o serviço nginx, seguindo em tempo real (-f de follow).' },
  { category: 'Linux', front: 'grep -r -i "erro" /var/log/', back: 'Procura recursivamente (-r) ignorando maiúsculas/minúsculas (-i) a string "erro" em todos os ficheiros de /var/log/.' },
  { category: 'Linux', front: 'lsof -i :8080', back: 'Lista os ficheiros abertos (List Open Files) associados à porta de rede 8080. Útil para saber "que processo está a escutar nesta porta?".' },
  { category: 'Linux', front: 'netstat -tulnp (ou ss -tulnp)', back: 'Mostra todas as portas TCP (-t) e UDP (-u) em escuta (-l) sem resolver nomes (-n) e indicando o PID/Programa (-p).' },
  { category: 'Linux', front: 'curl -I https://api.exemplo.com', back: 'Faz um pedido HTTP HEAD (-I), retornando apenas os headers da resposta (útil para verificar status code 200/404 sem descarregar o body).' },
  { category: 'Linux', front: 'awk \'{print $1}\' access.log', back: 'Processa texto e extrai apenas a primeira coluna ($1) de cada linha. Muito usado para extrair IPs de logs do Nginx/Apache.' },
  { category: 'Linux', front: 'sed -i \'s/old/new/g\' file.txt', back: 'Procura e substitui inline (-i) todas as instâncias globais (/g) de "old" por "new" no ficheiro file.txt.' },
  { category: 'Linux', front: 'tar -czvf arquivo.tar.gz /pasta', back: 'Cria (c) um arquivo tar comprimido com gzip (z), mostrando o progresso (v) no ficheiro especificado (f).' },

  // Git
  { category: 'Git', front: 'git commit --amend', back: 'Modifica o último commit. Útil para adicionar ficheiros esquecidos ou alterar a mensagem. Reescreve o histórico local.' },
  { category: 'Git', front: 'git rebase -i HEAD~3', back: 'Abre o modo interactivo para reescrever os últimos 3 commits — útil para fazer squash e limpar histórico antes de um PR.' },
  { category: 'Git', front: 'git cherry-pick <hash>', back: 'Copia um commit específico de outra branch e aplica-o na branch atual.' },
  { category: 'Git', front: 'git stash pop', back: 'Aplica as últimas alterações guardadas no stash e remove-as da lista.' },
  { category: 'Git', front: 'git reset --soft HEAD~1', back: 'Desfaz o último commit mas mantém os ficheiros modificados no staging area (prontos para novo commit).' },
  { category: 'Git', front: 'git reset --hard HEAD~1', back: 'PERIGO: Desfaz o último commit e apaga TODAS as alterações no working directory.' },
  { category: 'Git', front: 'git fetch -p', back: 'Faz fetch do remote e apaga (prune) referências locais de branches que já foram apagadas no remote.' },
  { category: 'Git', front: 'git log --oneline --graph', back: 'Mostra o histórico de commits de forma compacta e visual (com a árvore de merges).' },
  { category: 'Git', front: 'git reflog', back: 'Mostra o histórico de TODAS as ações locais (mesmo resets/rebases). Útil para recuperar trabalho perdido.' },
  { category: 'Git', front: 'git bisect', back: 'Ferramenta que usa pesquisa binária pelo histórico de commits para encontrar exatamente qual commit introduziu um bug.' },

  // Docker
  { category: 'Docker', front: 'docker build -t app:v1 .', back: 'Lê o Dockerfile no diretório atual e constrói uma imagem com a tag app:v1.' },
  { category: 'Docker', front: 'docker run -d -p 8080:80 nginx', back: 'Corre o nginx em background (-d) e mapeia a porta 8080 do host para a porta 80 do container.' },
  { category: 'Docker', front: 'docker exec -it <container> sh', back: 'Abre uma shell interactiva (-it) dentro de um container que já está a correr.' },
  { category: 'Docker', front: 'docker logs -f <container>', back: 'Mostra os logs do container e continua a seguir o output em tempo real (-f).' },
  { category: 'Docker', front: 'docker ps -a', back: 'Lista TODOS os containers no sistema, incluindo os que estão parados ou falharam.' },
  { category: 'Docker', front: 'docker system prune -af', back: 'Remove forçosamente todos os containers parados, redes não usadas e imagens pendentes (liberta espaço).' },
  { category: 'Docker', front: 'ENTRYPOINT vs CMD', back: 'ENTRYPOINT define o executável fixo do container. CMD fornece argumentos default que podem ser sobrepostos no docker run.' },
  { category: 'Docker', front: 'Multi-stage build', back: 'No Dockerfile, usa uma imagem grande para compilar o código e copia só os binários para uma imagem final Alpine/Scratch. Reduz brutalmente o tamanho.' },
  { category: 'Docker', front: 'docker volume create', back: 'Cria um volume persistente gerido pelo Docker (não depende do filesystem do host), ideal para bases de dados.' },
  { category: 'Docker', front: 'USER nonroot', back: 'Boa prática de segurança num Dockerfile: criar um user sem privilégios para não correr processos como root dentro do container.' },

  // Kubernetes
  { category: 'Kubernetes', front: 'Liveness vs Readiness Probe', back: 'Liveness: se falha, reinicia o container. Readiness: se falha, remove dos endpoints do Service sem reiniciar.' },
  { category: 'Kubernetes', front: 'kubectl rollout undo deploy/app', back: 'Reverte um Deployment para a versão anterior — rollback imediato.' },
  { category: 'Kubernetes', front: 'ClusterIP vs LoadBalancer', back: 'ClusterIP: só acessível dentro do cluster. LoadBalancer: provisiona um LB externo da cloud automaticamente.' },
  { category: 'Kubernetes', front: 'Role vs ClusterRole (RBAC)', back: 'Role: permissões num namespace. ClusterRole: permissões em todo o cluster ou em recursos cluster-level.' },
  { category: 'Kubernetes', front: 'maxSurge / maxUnavailable', back: 'Controlam o Rolling Update: quantos pods extra criar e quantos podem ficar indisponíveis durante o deploy.' },

  // CI/CD
  { category: 'CI/CD', front: 'Continuous Delivery vs Deployment', back: 'Delivery: sempre deployável, aprovação manual para prod. Deployment: cada commit aprovado vai automaticamente para produção.' },
  { category: 'CI/CD', front: 'OIDC no CI/CD', back: 'Permite ao pipeline obter um token efémero (~15min) do cloud provider via federated identity, sem secrets estáticos.' },
  { category: 'CI/CD', front: 'Quality Gate', back: 'Conjunto de critérios (cobertura, bugs, vulnerabilidades) que bloqueiam o pipeline se não forem cumpridos.' },
  { category: 'CI/CD', front: 'Canary Deployment', back: 'Uma pequena % do tráfego vai para a nova versão; métricas são validadas antes do rollout completo.' },

  // Terraform
  { category: 'Terraform', front: 'terraform init', back: 'Descarrega providers (ex: AWS, Azure) e inicializa o backend (onde o state será guardado).' },
  { category: 'Terraform', front: 'terraform fmt', back: 'Formata automaticamente todos os ficheiros .tf para o estilo canónico padrão. Usa sempre antes de um commit!' },
  { category: 'Terraform', front: 'terraform validate', back: 'Verifica se a sintaxe está correta e se as referências internas fazem sentido, sem consultar a API da cloud.' },
  { category: 'Terraform', front: 'terraform plan', back: 'Mostra o plano de execução: o que será criado, modificado ou destruído para igualar o estado desejado.' },
  { category: 'Terraform', front: 'terraform apply -auto-approve', back: 'Aplica as alterações da infraestrutura sem pedir confirmação manual (ideal para pipelines CI/CD).' },
  { category: 'Terraform', front: 'terraform state list', back: 'Lista todos os recursos que o Terraform está atualmente a gerir no ficheiro tfstate.' },
  { category: 'Terraform', front: 'terraform import <addr> <id>', back: 'Mapeia um recurso existente na cloud (criado manualmente) para um bloco de código no Terraform.' },
  { category: 'Terraform', front: 'terraform apply -replace="recurso"', back: 'Força o Terraform a destruir e recriar um recurso específico (substitui o antigo "terraform taint").' },
  { category: 'Terraform', front: 'State remoto com locking', back: 'Guardar o tfstate na cloud (S3, Blob) com locking (DynamoDB, Lease) para impedir que 2 pessoas façam apply ao mesmo tempo.' },
  { category: 'Terraform', front: 'Infrastructure Drift', back: 'Quando a realidade da cloud difere do ficheiro tfstate (ex: alguém mudou uma firewall manualmente via portal).' },

  // Monitoring
  { category: 'Monitoring', front: 'Golden Signals (SRE)', back: 'Latency, Traffic, Errors, Saturation — as quatro métricas base para alertas críticos.' },
  { category: 'Monitoring', front: 'Error Budget', back: '100% - SLO. Quanto a equipa pode "falhar" antes de quebrar o objectivo de disponibilidade.' },
  { category: 'Monitoring', front: 'SLI vs SLO vs SLA', back: 'SLI: métrica medida. SLO: meta interna. SLA: contrato com penalizações para o cliente.' },

  // Security
  { category: 'Security', front: 'Shift-Left Security', back: 'Mover os controlos de segurança para o início do SDLC — mais barato corrigir cedo do que em produção.' },
  { category: 'Security', front: 'SAST vs DAST', back: 'SAST analisa código fonte estaticamente (SonarQube). DAST testa a app em execução (OWASP ZAP).' },
  { category: 'Security', front: 'Policy as Code (OPA)', back: 'Regras de governança (ex: tags obrigatórias) escritas em Rego e validadas automaticamente no terraform plan.' },
];

export const devopsFlashcards: Flashcard[] = raw.map((c, i) => ({
  ...c,
  id: `devops-${i}`,
  domain: 'devops' as const,
}));
