export interface RawCyberQuestion {
  id: number;
  topicId: 'soc-ops' | 'network-sec' | 'edr-endpoint' | 'threat-intel' | 'cloud-identity' | 'devsecops';
  topicLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const CYBER_TOPICS = [
  { id: 'soc-ops', label: 'SOC Ops & Incident Triage' },
  { id: 'network-sec', label: 'Network Security & Protocols' },
  { id: 'edr-endpoint', label: 'EDR, Processes & Windows Logs' },
  { id: 'threat-intel', label: 'Threat Intel & MITRE ATT&CK' },
  { id: 'cloud-identity', label: 'Cloud Security & Identity' },
  { id: 'devsecops', label: 'DevSecOps & Application Security' },
];

export const CYBER_EXAM_QUESTIONS: RawCyberQuestion[] = [
  // ── SOC Ops & Incident Triage ───────────────────────────────────────────
  {
    id: 1,
    topicId: 'soc-ops',
    topicLabel: 'SOC Ops & Incident Triage',
    question: 'Durante a triagem de um alerta de segurança no SIEM, qual é a ordem correta das 7 etapas fundamentais do ciclo de vida de resposta a incidentes para um Analista SOC N1?',
    options: [
      'Contenção → Erradicação → Triagem → Recuperação → Validação → Fechamento → Notificação',
      'Observar/Detectar → Validar Alerta → Investigar/Enriquecer → Correlacionar → Decidir (TP vs FP) → Conter → Documentar e Escalar',
      'Isolar Host → Resetar Senha → Analisar Logs → Notificar C-Level → Fechar Ticket → Restaurar Backup → Lições',
      'Scan de Vulnerabilidade → Bloqueio de IP → Reboot da Máquina → Notificação de Usuário → Classificação MITRE'
    ],
    correctIndex: 1,
    explanation: 'O fluxo padrão de SOC L1 (conforme CyberEDT e NIST SP 800-61) inicia na Detecção e Validação do alerta (eliminando falsos positivos), seguido de Investigação contextual, Correlação com outras fontes, Tomada de Decisão, Ação de Contenção inicial rápida e Documentação detalhada antes do escalonamento.',
    difficulty: 'easy'
  },
  {
    id: 2,
    topicId: 'soc-ops',
    topicLabel: 'SOC Ops & Incident Triage',
    question: 'Ao analisar o cabeçalho bruto (raw header) de um e-mail suspeito de phishing, qual linha indica de forma definitiva o endereço IP real do servidor que fez a entrega do e-mail ao primeiro relay confiável da tua organização?',
    options: [
      'A linha "From: billing@paypal-secure.com"',
      'A linha "Reply-To: support@legit-domain.com"',
      'A linha "Received: from" mais inferior (ou seja, o primeiro salto registrado no trajeto de baixo para cima)',
      'A linha "Message-ID: <12345@smtp.mail.com>"'
    ],
    correctIndex: 2,
    explanation: 'Os cabeçalhos "Received: from" são empilhados cronologicamente de baixo para cima. O cabeçalho no fundo representa o primeiro ponto de entrada onde o servidor atacante entregou a mensagem ao primeiro servidor relay, sendo impossível de forjar para os saltos seguintes gerenciados pelo destinatário.',
    difficulty: 'medium'
  },
  {
    id: 3,
    topicId: 'soc-ops',
    topicLabel: 'SOC Ops & Incident Triage',
    question: 'Em um cabeçalho de e-mail, observas: SPF=pass, DKIM=fail (body hash did not verify) e DMARC=reject. Qual o significado deste resultado e que ação o gateway de e-mail deve tomar?',
    options: [
      'O e-mail é 100% legítimo porque o SPF passou; deve ser entregue na caixa de entrada principal.',
      'O conteúdo do e-mail foi alterado após a assinatura ou a chave DKIM é inválida; com a política DMARC p=reject, a mensagem deve ser descartada/rejeitada.',
      'O remetente usou TLS 1.3 obrigatório, então a falha de DKIM é esperada e o e-mail vai para quarentena.',
      'O DMARC p=reject só se aplica caso SPF e DKIM falhem simultaneamente; o e-mail deve ser entregue.'
    ],
    correctIndex: 1,
    explanation: 'DMARC exige alinhamento de SPF e/ou DKIM. Se a assinatura criptográfica DKIM falhou (corpo adulterado em trânsito) e a política do domínio em DMARC é "reject", o servidor de recebimento deve rejeitar sumariamente a entrega da mensagem.',
    difficulty: 'medium'
  },
  {
    id: 4,
    topicId: 'soc-ops',
    topicLabel: 'SOC Ops & Incident Triage',
    question: 'Qual é a diferença fundamental entre um Falso Positivo (False Positive) e um Falso Negativo (False Negative) em operações de segurança?',
    options: [
      'Falso Positivo é quando ocorre um ataque real e o alarme soa; Falso Negativo é quando o sistema cai por falta de memória.',
      'Falso Positivo é quando um evento benigno/legítimo dispara um alerta de segurança; Falso Negativo é quando um ataque malicioso real ocorre e NENHUM alerta é gerado.',
      'Falso Positivo é erro de hardware; Falso Negativo é erro de configuração de firewall.',
      'Falso Positivo é quando um analista L1 fecha o ticket; Falso Negativo é quando é escalado para L2.'
    ],
    correctIndex: 1,
    explanation: 'Falso Positivo (FP) = Atividade benigna rotulada como maliciosa (gera fadiga de alertas). Falso Negativo (FN) = Atividade maliciosa real que passa despercebida pelas regras de detecção (o cenário mais perigoso para o SOC).',
    difficulty: 'easy'
  },
  {
    id: 5,
    topicId: 'soc-ops',
    topicLabel: 'SOC Ops & Incident Triage',
    question: 'Um analista de SOC precisa "defangar" (desarmar) o IoC "http://malicious-domain.com/payload.exe" antes de compartilhar no relatório de incidente ou ticket. Qual é o formato correto padrão de defanging?',
    options: [
      'http://malicious-domain.com/payload.exe#safe',
      'hxxp[://]malicious-domain[.]com/payload[.]exe',
      'base64://aHR0cDovL21hbGljaW91cy1kb21haW4uY29t',
      'malicious-domain.com -> 127.0.0.1'
    ],
    correctIndex: 1,
    explanation: 'Defanging substitui caracteres ativos (como "http" por "hxxp" e "." por "[.]" ou "[:]") para impedir que leitores ou ferramentas cliquem acidentalmente no link ou que scanners de e-mail bloqueiem a mensagem do ticket.',
    difficulty: 'easy'
  },

  // ── Network Security & Protocols ────────────────────────────────────────
  {
    id: 6,
    topicId: 'network-sec',
    topicLabel: 'Network Security & Protocols',
    question: 'Durante a inspeção de tráfego de rede no SIEM/Zeek, observas milhares de requisições DNS com subdomínios alfanuméricos longos e aleatórios (ex: "v8x3a19d.tunnel.attacker.cc") com registros do tipo TXT e TTL=0. Que tipo de ataque este padrão caracteriza?',
    options: [
      'DNS Cache Poisoning / Kaminsky Attack',
      'DNS Amplification DDoS Attack',
      'DNS Tunneling (Exfiltração de dados ou Canal de Command & Control C2)',
      'Zone Transfer (AXFR) não autorizado'
    ],
    correctIndex: 2,
    explanation: 'DNS Tunneling codifica dados arbitrários (base64 ou hex) dentro de subdomínios e utiliza consultas TXT para transportar payloads bidirecionais contornando firewalls que liberam a porta UDP/TCP 53.',
    difficulty: 'medium'
  },
  {
    id: 7,
    topicId: 'network-sec',
    topicLabel: 'Network Security & Protocols',
    question: 'Em uma análise de PCAP no Wireshark, observas múltiplos pacotes TCP SYN enviados para diversas portas sequenciais em um servidor interno, mas sem o envio do pacote ACK final após o SYN-ACK. Que técnica de reconnaissance está sendo executada?',
    options: [
      'TCP Connect Scan completo',
      'SYN Stealth Scan (Half-Open Scan, comumente gerado por nmap -sS)',
      'UDP Flood Attack',
      'ARP Poisoning MitM'
    ],
    correctIndex: 1,
    explanation: 'O SYN Stealth Scan (-sS) envia SYN, aguarda SYN-ACK para confirmar porta aberta e imediatamente envia RST em vez de ACK, evitando que a conexão TCP seja concluída e registrada nos logs de aplicação da camada 7.',
    difficulty: 'medium'
  },
  {
    id: 8,
    topicId: 'network-sec',
    topicLabel: 'Network Security & Protocols',
    question: 'Em uma conexão HTTPS, o analista do SOC deseja identificar o domínio acessado por uma estação de trabalho sem realizar descriptografia SSL/TLS (SSL Inspection). Em qual campo em texto claro do handshake TLS isso é visível?',
    options: [
      'No campo Cipher Suite do pacote Server Hello',
      'Na extensão Server Name Indication (SNI) dentro do pacote Client Hello',
      'No campo Pre-Master Secret criptografado',
      'No cabeçalho HTTP Authorization embutido no payload TCP'
    ],
    correctIndex: 1,
    explanation: 'O Server Name Indication (SNI) é enviado em texto claro dentro da mensagem Client Hello do TLS antes de estabelecer a chave de sessão, permitindo ao firewall/proxy identificar o hostname acessado sem quebrar a criptografia.',
    difficulty: 'medium'
  },
  {
    id: 9,
    topicId: 'network-sec',
    topicLabel: 'Network Security & Protocols',
    question: 'Qual a principal diferença entre um IDS (Intrusion Detection System) e um IPS (Intrusion Prevention System)?',
    options: [
      'O IDS fica posicionado inline no fluxo e bloqueia pacotes; o IPS recebe cópia passiva (SPAN/TAP) e apenas emite alertas.',
      'O IDS atua de forma passiva (detecta e gera alertas sem alterar o tráfego); o IPS fica inline (in-path) e pode ativamente descartar pacotes ou resetar conexões maliciosas.',
      'O IDS analisa apenas a camada de rede (L3); o IPS analisa apenas a camada de aplicação (L7).',
      'O IDS utiliza inteligência artificial; o IPS utiliza apenas assinaturas estáticas.'
    ],
    correctIndex: 1,
    explanation: 'O IDS monitora uma cópia do tráfego (via porta espelho/SPAN) para alertar (out-of-band), enquanto o IPS fica inline no caminho dos pacotes para inspecionar e ativamente bloquear o tráfego em tempo real.',
    difficulty: 'easy'
  },
  {
    id: 10,
    topicId: 'network-sec',
    topicLabel: 'Network Security & Protocols',
    question: 'O que caracteriza o tráfego de "Beaconing" em um canal de Command & Control (C2)?',
    options: [
      'Transferência única massiva de arquivos via FTP em porta não padrão.',
      'Comunicações regulares ou semi-regulares (heartbeats periódicos com jitter) de um host infectado enviando check-ins para um servidor C2 externo para obter novos comandos.',
      'Inundação de requisições ICMP Echo Request para derrubar um roteador de borda.',
      'Tentativas aleatórias de login SSH com dicionário de senhas fracas.'
    ],
    correctIndex: 1,
    explanation: 'Beaconing é o padrão de tráfego de polling periódico (ex: a cada 60s +/- 10% jitter) que o implante malware realiza para sinalizar ao servidor C2 que está ativo e pronto para receber tarefas.',
    difficulty: 'medium'
  },

  // ── EDR, Processes & Windows Logs ─────────────────────────────────────────
  {
    id: 11,
    topicId: 'edr-endpoint',
    topicLabel: 'EDR, Processes & Windows Logs',
    question: 'Na console do EDR, observas a seguinte árvore de processos (Parent-Child Process Tree): WINWORD.EXE (PID 4012) → cmd.exe (PID 5120) → powershell.exe -nop -w hidden -enc JABzACAAPQAg... O que esta sequência sugere?',
    options: [
      'Atualização automática legítima do Microsoft Office.',
      'Execução maliciosa de macro do Word utilizando PowerShell codificado em Base64 para evasão de defesa e download de payload.',
      'Um usuário do departamento financeiro executando script de backup aprovado.',
      'Compilação de código C# no Visual Studio.'
    ],
    correctIndex: 1,
    explanation: 'Processos de escritório (como winword.exe, excel.exe, outlook.exe) gerando cmd.exe ou powershell.exe com flags de evasão (-w hidden, -enc) são o indicador clássico de execução de macro maliciosa (Initial Access / Execution via LOLBAS).',
    difficulty: 'easy'
  },
  {
    id: 12,
    topicId: 'edr-endpoint',
    topicLabel: 'EDR, Processes & Windows Logs',
    question: 'Qual Windows Security Event ID registra a criação de um novo processo com linha de comando completa (requer habilitar política de auditoria avançada)?',
    options: [
      'Event ID 4624 (Logon bem-sucedido)',
      'Event ID 4625 (Falha de logon)',
      'Event ID 4688 (A new process has been created)',
      'Event ID 4720 (A user account was created)'
    ],
    correctIndex: 2,
    explanation: 'O Event ID 4688 (Process Creation) registra o nome do processo, o processo pai (Creator Process Name) e, quando ativada a política correspondente, a linha de comando completa (CommandLine argument).',
    difficulty: 'medium'
  },
  {
    id: 13,
    topicId: 'edr-endpoint',
    topicLabel: 'EDR, Processes & Windows Logs',
    question: 'No log de segurança do Windows (Event ID 4624 - Successful Logon), qual é o significado de "Logon Type 3" e "Logon Type 10"?',
    options: [
      'Logon Type 3 = Logon Interativo local no teclado; Logon Type 10 = Inicialização do sistema.',
      'Logon Type 3 = Logon via Rede (SMB/Compartilhamento de arquivos); Logon Type 10 = Logon via Remote Desktop Protocol (RDP).',
      'Logon Type 3 = Acesso via VPN; Logon Type 10 = Troca de senha pelo administrador.',
      'Logon Type 3 = Execução de Serviço do Windows; Logon Type 10 = Login via console PowerShell.'
    ],
    correctIndex: 1,
    explanation: 'Logon Type 3 representa conexões via rede (ex: mapeamento SMB, acesso a shares ADMIN$), enquanto Logon Type 10 representa conexões interativas remotas via RDP (Remote Desktop).',
    difficulty: 'hard'
  },
  {
    id: 14,
    topicId: 'edr-endpoint',
    topicLabel: 'EDR, Processes & Windows Logs',
    question: 'O que é o conceito de LOLBAS (Living Off The Land Binaries and Scripts) no ecossistema Windows?',
    options: [
      'Vírus compilados em assembly que se replicam via pendrive.',
      'O uso de utilitários legítimos e assinados nativos do sistema operacional (como certutil.exe, bitsadmin.exe, mshta.exe, wmic.exe) por invasores para baixar payloads, executar código e evadir antivírus.',
      'Um tipo de ransomware que criptografa apenas arquivos de banco de dados.',
      'Ferramentas de código aberto exclusivas do Kali Linux.'
    ],
    correctIndex: 1,
    explanation: 'LOLBAS refere-se ao abuso de binários confiáveis e legítimos do Windows para executar ações maliciosas sem precisar compilar ou levar ferramentas customizadas que seriam bloqueadas por assinaturas de antivírus.',
    difficulty: 'medium'
  },
  {
    id: 15,
    topicId: 'edr-endpoint',
    topicLabel: 'EDR, Processes & Windows Logs',
    question: 'Qual Event ID do Windows indica a instalação de um novo serviço no sistema (técnica comum de Persistência e Escalação de Privilégios)?',
    options: [
      'Event ID 7045 (System log) / Event ID 4697 (Security log)',
      'Event ID 1102 (The audit log was cleared)',
      'Event ID 4738 (A user account was modified)',
      'Event ID 4672 (Special privileges assigned to new logon)'
    ],
    correctIndex: 0,
    explanation: 'Event ID 7045 no log System e Event ID 4697 no log Security registram a criação de novos serviços do Windows (ServiceName, ServiceFileName e AccountName), frequentemente abusados para manter persistência.',
    difficulty: 'hard'
  },

  // ── Threat Intel & MITRE ATT&CK ─────────────────────────────────────────
  {
    id: 16,
    topicId: 'threat-intel',
    topicLabel: 'Threat Intel & MITRE ATT&CK',
    question: 'Na Pirâmide da Dor (Pyramid of Pain de David Bianco), qual dos seguintes tipos de indicadores é o mais difícil e doloroso para um atacante alterar quando bloqueado pelos defensores?',
    options: [
      'Hash Values (MD5, SHA256)',
      'IP Addresses',
      'Domain Names',
      'TTPs (Tactics, Techniques, and Procedures)'
    ],
    correctIndex: 3,
    explanation: 'No topo da Pirâmide da Dor estão as TTPs (Táticas, Técnicas e Procedimentos). Mudar um hash ou IP custa segundos para o atacante, mas mudar toda a metodologia de ataque e ferramentas exige reaprendizado e reestruturação profunda.',
    difficulty: 'easy'
  },
  {
    id: 17,
    topicId: 'threat-intel',
    topicLabel: 'Threat Intel & MITRE ATT&CK',
    question: 'No framework MITRE ATT&CK, qual a diferença conceitual entre uma Tática (Tactic) e uma Técnica (Technique)?',
    options: [
      'Tática é o software específico usado; Técnica é o hardware visado.',
      'Tática é o "PORQUÊ" (o objetivo tático do invasor, ex: Acesso Inicial, Persistência, Exfiltração); Técnica é o "COMO" (o método específico para alcançar o objetivo, ex: Spearphishing Attachment T1566.001).',
      'Tática é uma vulnerabilidade CVE; Técnica é o patch de correção.',
      'Tática pertence ao Red Team; Técnica pertence ao Blue Team.'
    ],
    correctIndex: 1,
    explanation: 'Táticas representam a meta do adversário em cada estágio da invasão (Initial Access, Execution, Persistence, Defense Evasion, etc.), enquanto Técnicas descrevem as maneiras operacionais de concretizar essa meta.',
    difficulty: 'easy'
  },
  {
    id: 18,
    topicId: 'threat-intel',
    topicLabel: 'Threat Intel & MITRE ATT&CK',
    question: 'Qual é o propósito de uma regra YARA em resposta a incidentes e análise de ameaças?',
    options: [
      'Bloquear portas de rede dinamicamente no firewall.',
      'Criar descrições baseadas em padrões textuais, expressões regulares e sequências de bytes hexadecimais para identificar e classificar arquivos maliciosos ou amostras de malware.',
      'Gerenciar senhas mestras de administradores de domínio.',
      'Converter logs de JSON para formato CEF.'
    ],
    correctIndex: 1,
    explanation: 'YARA é uma ferramenta que permite aos analistas de malware e threat hunters identificar e classificar arquivos maliciosos com base em assinaturas textuais e binárias precisas.',
    difficulty: 'medium'
  },
  {
    id: 19,
    topicId: 'threat-intel',
    topicLabel: 'Threat Intel & MITRE ATT&CK',
    question: 'O que é o padrão de regras SIGMA no contexto de detecção e Threat Hunting em SIEMs?',
    options: [
      'Um formato genérico e aberto de assinaturas baseado em YAML para descrever regras de detecção de logs, que pode ser convertido para consultas nativas de Splunk, Sentinel, Elasticsearch, Wazuh, etc.',
      'Um algoritmo de criptografia pós-quântica para proteger VPNs.',
      'Um protocolo de autenticação de dois fatores por hardware.',
      'Um scanner de vulnerabilidades web mantido pela OWASP.'
    ],
    correctIndex: 0,
    explanation: 'SIGMA é para regras de logs o que o YARA é para arquivos: um padrão aberto em YAML para descrever condições de detecção em logs de forma agnóstica de vendor.',
    difficulty: 'medium'
  },
  {
    id: 20,
    topicId: 'threat-intel',
    topicLabel: 'Threat Intel & MITRE ATT&CK',
    question: 'Qual a diferença entre IoC (Indicator of Compromise) e IoA (Indicator of Attack)?',
    options: [
      'IoC foca em ataques futuros; IoA foca em ataques históricos.',
      'IoC é evidência forense reativa de que um sistema já foi comprometido (ex: hash de arquivo, IP de C2); IoA foca no comportamento e na intenção em tempo real durante a execução do ataque (ex: tentativa de injeção de processo, bypass de UAC).',
      'IoC é usado apenas em Linux; IoA é exclusivo de Windows.',
      'IoC analisa rede; IoA analisa apenas memória RAM.'
    ],
    correctIndex: 1,
    explanation: 'IoCs respondem "O que aconteceu?" (evidência estática/forense pós-compromisso), enquanto IoAs respondem "O que o atacante está tentando fazer agora?" (comportamento proativo em tempo real).',
    difficulty: 'medium'
  },

  // ── Cloud Security & Identity ────────────────────────────────────────────
  {
    id: 21,
    topicId: 'cloud-identity',
    topicLabel: 'Cloud Security & Identity',
    question: 'Um alerta no Microsoft Entra ID dispara o evento "Impossible Travel" para a conta de um diretor financeiro (login em Lisboa às 09:00 e login em Singapura às 09:30). Quais são as primeiras ações imediatas recomendadas para o analista SOC?',
    options: [
      'Ignorar o alerta se o segundo login tiver MFA bem-sucedido.',
      'Revogar imediatamente todas as sessões ativas (Revoke Sessions / Refresh Tokens), forçar redefinição de senha e verificar se foram criadas novas regras de encaminhamento no Exchange/Outlook.',
      'Aguardar 24 horas para ver se o usuário confirma viagem aérea supersônica.',
      'Deletar a conta do usuário permanentemente do diretório.'
    ],
    correctIndex: 1,
    explanation: 'Em Impossible Travel com suspeita de comprometimento, deve-se invalidar tokens de sessão imediatamente (para barrar atacantes que roubaram cookies de sessão/PRT), redefinir credenciais e auditar regras de forwarding de e-mail (técnica comum de persistência pós-compromisso).',
    difficulty: 'easy'
  },
  {
    id: 22,
    topicId: 'cloud-identity',
    topicLabel: 'Cloud Security & Identity',
    question: 'O que é o ataque de "MFA Fatigue" (ou MFA Push Bombing) e qual contramedida técnica é mais eficaz para mitigá-lo?',
    options: [
      'Desligar o MFA de toda a empresa; contramedida: usar senhas de 30 caracteres.',
      'O atacante que possui a senha da vítima envia dezenas de solicitações de push MFA seguidas na esperança de que a vítima aprove por engano ou irritação; contramedida: Number Matching (correspondência de números) e Contexto Geográfico no app autenticador.',
      'Ataque de força bruta contra o servidor RADIUS; contramedida: desativar protocolo UDP.',
      'Interceptação de SMS via SIM Swap; contramedida: usar apenas perguntas de segurança.'
    ],
    correctIndex: 1,
    explanation: 'MFA Fatigue explora a sobrecarga psicológica do usuário. A implementação de Number Matching (onde o usuário precisa digitar no app do celular o número exato exibido na tela de login) neutraliza essa técnica.',
    difficulty: 'medium'
  },
  {
    id: 23,
    topicId: 'cloud-identity',
    topicLabel: 'Cloud Security & Identity',
    question: 'No AWS CloudTrail, qual evento registra a criação de uma nova chave de acesso programática para um usuário IAM (evento crítico para detecção de persistência)?',
    options: [
      'CreateAccessKey',
      'AttachUserPolicy',
      'ConsoleLogin',
      'DescribeInstances'
    ],
    correctIndex: 0,
    explanation: 'O evento `CreateAccessKey` do CloudTrail indica a geração de um novo par de Access Key ID / Secret Access Key, frequentemente utilizado por invasores após comprometerem uma console web para manter acesso persistente via AWS CLI/SDK.',
    difficulty: 'easy'
  },
  {
    id: 24,
    topicId: 'cloud-identity',
    topicLabel: 'Cloud Security & Identity',
    question: 'Qual o conceito central da arquitetura Zero Trust (NIST SP 800-207)?',
    options: [
      'Confiar cegamente em qualquer dispositivo conectado à rede interna cabeada da empresa.',
      '"Never Trust, Always Verify" — nenhuma entidade (usuário, dispositivo ou workload) dentro ou fora do perímetro de rede é confiável por padrão; toda requisição deve ser explicitamente autenticada, autorizada e criptografada com menor privilégio.',
      'Eliminar todos os firewalls e usar apenas senhas biométricas.',
      'Permitir acesso total a desenvolvedores para agilizar o time-to-market.'
    ],
    correctIndex: 1,
    explanation: 'Zero Trust assume que ameaças existem dentro e fora da rede, eliminando a confiança implícita baseada em localização de rede e exigindo verificação contínua e privilégio mínimo.',
    difficulty: 'easy'
  },

  // ── DevSecOps & Application Security ─────────────────────────────────────
  {
    id: 25,
    topicId: 'devsecops',
    topicLabel: 'DevSecOps & Application Security',
    question: 'Qual a distinção entre SAST (Static Application Security Testing) e DAST (Dynamic Application Security Testing) em pipelines CI/CD?',
    options: [
      'SAST testa a aplicação em execução (caixa preta) em ambiente de staging; DAST analisa o código-fonte estático (caixa branca) antes da compilação.',
      'SAST analisa o código-fonte e dependências sem executar a aplicação (caixa branca); DAST testa a aplicação em tempo de execução enviando payloads e analisando as respostas HTTP (caixa preta).',
      'SAST é feito manualmente por auditores; DAST é executado exclusivamente por inteligência artificial.',
      'SAST serve apenas para bancos de dados; DAST serve apenas para containers Docker.'
    ],
    correctIndex: 1,
    explanation: 'SAST inspeciona o código-fonte em repouso (white-box) procurando falhas de sintaxe e padrões vulneráveis no início da pipeline. DAST ataca a aplicação em execução (black-box) testando vulnerabilidades de autenticação, headers e resposta real do servidor.',
    difficulty: 'easy'
  },
  {
    id: 26,
    topicId: 'devsecops',
    topicLabel: 'DevSecOps & Application Security',
    question: 'Uma ferramenta de SCA (Software Composition Analysis), como o Trivy ou Snyk, identifica uma vulnerabilidade com CVSS v3 score de 9.8 (Critical) na biblioteca Log4j (CVE-2021-44228). O que o SCA especificamente analisa?',
    options: [
      'A qualidade da documentação e formatação dos comentários no código.',
      'Dependências diretas e transitivas de terceiros (open-source packages) do projeto, comparando versões contra bases públicas de CVEs conhecidas e problemas de licença.',
      'A integridade do cabo de rede do servidor de compilação.',
      'O tráfego de saída do Kubernetes para verificar mineração de criptomoeda.'
    ],
    correctIndex: 1,
    explanation: 'SCA foca na governança e segurança da cadeia de suprimentos de software (Supply Chain), mapeando todas as bibliotecas de terceiros (open source) e identificando vulnerabilidades conhecidas (CVEs) e riscos de licença.',
    difficulty: 'medium'
  },
  {
    id: 27,
    topicId: 'devsecops',
    topicLabel: 'DevSecOps & Application Security',
    question: 'Em um arquivo Terraform de infraestrutura como código (IaC), uma ferramenta como Checkov ou tfsec emite um alerta de severidade HIGH para o recurso `aws_security_group` com a regra `cidr_blocks = ["0.0.0.0/0"]` na porta 22 (SSH). Qual o risco e a correção recomendada?',
    options: [
      'Risco: Porta 22 consome muita largura de banda; Correção: Mudar para porta 80.',
      'Risco: Acesso administrativo SSH exposto publicamente para a internet inteira, suscetível a ataques de força bruta e exploits de dia zero; Correção: Restringir o CIDR para o IP público da VPN/Bastion corporativo ou utilizar AWS Systems Manager Session Manager (SSM) sem expor portas.',
      'Risco: Falha de compilação do Terraform; Correção: Adicionar flag `force_destroy = true`.',
      'Risco: O provedor de nuvem cobra taxa extra por portas pares; Correção: Usar porta ímpar 2223.'
    ],
    correctIndex: 1,
    explanation: 'Expor portas de gerenciamento (22/SSH, 3389/RDP) para 0.0.0.0/0 é uma das falhas mais graves de IaC. A correção é restringir a origens conhecidas (IP da VPN/Bastion) ou eliminar a porta aberta usando SSM Session Manager.',
    difficulty: 'easy'
  },
  {
    id: 28,
    topicId: 'devsecops',
    topicLabel: 'DevSecOps & Application Security',
    question: 'Qual é a melhor prática recomendada para evitar o vazamento de segredos (senhas, API tokens, certificados privados) em repositórios Git?',
    options: [
      'Commitar os segredos em branches privadas e fazer merge direto em main.',
      'Implementar ganchos pre-commit (ex: Gitleaks, TruffleHog) para bloquear commits com credenciais e utilizar gerenciadores centralizados de segredos (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) injetados como variáveis de ambiente em tempo de execução.',
      'Salvar as credenciais em texto claro dentro de arquivos `.env` e commitar no repositório público.',
      'Criptografar as senhas com Base64 antes de salvar no código.'
    ],
    correctIndex: 1,
    explanation: 'Segredos nunca devem residir no controle de versão. Deve-se usar ferramentas de detecção no commit/PR e externalizar credenciais para cofres seguros (Vaults) com rotação automática.',
    difficulty: 'easy'
  },
  {
    id: 29,
    topicId: 'devsecops',
    topicLabel: 'DevSecOps & Application Security',
    question: 'Em um ambiente Kubernetes em produção, uma ferramenta de segurança em runtime (como o Falco) emite o alerta: "Notice: A shell was spawned in a container with an attached terminal (user=root k8s.pod=payment-api-7b89)". Por que este evento deve ser investigado pelo SOC?',
    options: [
      'Containers em produção normalmente executam apenas seu processo de entrada (PID 1) sem humanos acessando interativamente via shell (kubectl exec / bash); a abertura de um shell root pode indicar invasão ativa, container escape ou violação de política de acesso.',
      'Containers precisam de shell aberto 24/7 para manter a comunicação gRPC.',
      'O Kubernetes reinicia automaticamente todos os pods que não possuem shell root ativo.',
      'É apenas um aviso informativo de rotina do garbage collector.'
    ],
    correctIndex: 0,
    explanation: 'Containers de produção devem ser imutáveis. Spawning de shell interativo (especialmente root) viola o princípio de menor privilégio e é forte indício de exploração (RCE ou shell interativo não autorizado).',
    difficulty: 'medium'
  },
  {
    id: 30,
    topicId: 'devsecops',
    topicLabel: 'DevSecOps & Application Security',
    question: 'Na OWASP Top 10, qual é o mecanismo de defesa mais eficaz contra vulnerabilidades de SQL Injection (SQLi)?',
    options: [
      'Filtrar palavras-chave como "SELECT" e "UNION" usando regex no front-end.',
      'Utilizar Prepared Statements (Consultas Parametrizadas / ORMs) e Stored Procedures parametrizadas, garantindo que o interpretador de banco de dados trate o input do usuário exclusivamente como dados, nunca como código executável.',
      'Armazenar todas as senhas em MD5 sem salt.',
      'Desativar o log de erros do banco de dados.'
    ],
    correctIndex: 1,
    explanation: 'Prepared Statements (parametrização) separa a instrução de consulta dos parâmetros fornecidos pelo usuário. Mesmo que o usuário passe strings maliciosas (ex: `\' OR 1=1 --`), o banco as interpreta como literais de string inofensivos.',
    difficulty: 'easy'
  }
];
