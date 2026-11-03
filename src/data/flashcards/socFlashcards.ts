import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // ── PLAYBOOK FUNDAMENTALS ──────────────────────────────────────────────────
  {
    category: 'SOC Fundamentals',
    front: 'O que é um Incident Playbook?',
    back: 'Um guia passo-a-passo que ajuda os SOC Analysts a detectar, investigar e responder a incidentes de segurança de forma consistente e repetível. Garante que nenhum passo é perdido e que as evidências são recolhidas corretamente.'
  },
  {
    category: 'SOC Fundamentals',
    front: 'Quais são as 9 componentes-chave de um Incident Playbook?',
    back: '1. Detection — como o incidente é detectado\n2. Triage — validação e priorização inicial\n3. Investigation — deep dive\n4. Evidence Collection — logs, artefactos\n5. Containment — parar o dano\n6. Eradication — remover a ameaça\n7. Recovery — restaurar operações\n8. Documentation — registar tudo\n9. Escalation — quando e como escalar'
  },
  {
    category: 'SOC Fundamentals',
    front: 'O que é o Incident Playbook Lifecycle?',
    back: 'ALERT → TRIAGE → INVESTIGATE → CONTAIN → REMEDIATE → DOCUMENT → CLOSE\n\nCada fase tem responsabilidades claras. Sem um playbook, o analista adivinha os próximos passos e corre o risco de perder evidências críticas.'
  },
  {
    category: 'SOC Fundamentals',
    front: 'Diferença: IOC vs TTP',
    back: 'IOC (Indicator of Compromise) — artefacto específico de um ataque: IP, domínio, hash. É estático e muda facilmente.\n\nTTP (Tactics, Techniques, Procedures) — o comportamento do atacante (ex: usa DNS Tunneling para C2). É muito mais difícil de mudar e mais valioso para detecção.'
  },
  {
    category: 'SOC Fundamentals',
    front: 'O que é um False Positive no contexto SOC?',
    back: 'Um alerta que não corresponde a um incidente real de segurança. Por ex: um scan interno de vulnerabilidades que dispara regras de IDS. Identificar FPs é crítico para não desperdiçar recursos em investigações desnecessárias.'
  },

  // ── PLAYBOOK 1: ACCOUNT COMPROMISE ────────────────────────────────────────
  {
    category: 'Account Compromise',
    front: 'O que é Account Compromise?',
    back: 'Quando um atacante obtém acesso não autorizado a uma conta de utilizador através de roubo de credenciais, phishing, session hijacking ou abuso de tokens — e realiza ações maliciosas como o utilizador legítimo.'
  },
  {
    category: 'Account Compromise',
    front: 'Quais são os Common Indicators de Account Compromise?',
    back: '• Login de localização impossível ou incomum\n• Login de dispositivo ou browser desconhecido\n• Múltiplos logins falhados seguidos de sucesso\n• MFA Fatigue ou MFA push inesperado\n• Alteração de password sem pedido do utilizador\n• Mailbox rules suspeitas / forwarding adicionado\n• Acesso a ficheiros sensíveis\n• API usage incomum'
  },
  {
    category: 'Account Compromise',
    front: 'Quais os Attack Patterns mais comuns em Account Compromise?',
    back: '• Credential stuffing / brute force\n• Phishing ou credential theft\n• Session hijacking / token theft\n• MFA push bombing\n• Password reuse across multiple services\n• Exploiting weak or legacy authentication'
  },
  {
    category: 'Account Compromise',
    front: 'Workflow do Playbook 1 — Account Compromise',
    back: '1. Alert / Suspicious Activity\n2. Validate Login & Identity\n3. Analyze User Activity\n4. Check Endpoint & Devices\n5. Determine Compromise\n6. Contain & Secure Account\n7. Document & Close Case'
  },
  {
    category: 'Account Compromise',
    front: 'Quando ESCALAR um caso de Account Compromise?',
    back: '✅ Acesso não autorizado confirmado\n✅ Conta privilegiada ou de admin envolvida\n✅ Múltiplas contas comprometidas\n✅ MFA bypass ou token theft detectado\n✅ Acesso a dados sensíveis ou críticos\n✅ Lateral movement ou persistência observados\n✅ Impacto nas operações de negócio'
  },
  {
    category: 'Account Compromise',
    front: 'Quais as Response Actions para Account Compromise?',
    back: '• Reset user password e revogar todas as sessões\n• Forçar re-registo de MFA\n• Revogar refresh tokens\n• Desativar mailbox forwarding / delegation\n• Remover inbox rules maliciosas\n• Bloquear IPs maliciosos\n• Restringir sign-in de localizações de risco\n• Informar o utilizador e dar orientações\n• Monitorizar a conta para atividade adicional'
  },
  {
    category: 'Account Compromise',
    front: 'Quais as ferramentas usadas no Playbook 1 (Account Compromise)?',
    back: '• Microsoft Entra ID (Sign-in Logs)\n• Microsoft Defender for Cloud Apps\n• Microsoft Defender for Endpoint\n• Microsoft Sentinel / Splunk\n• Wazuh / Elastic SIEM\n• VirusTotal / Hybrid Analysis\n• IP Reputation (AbuseIPDB, IPVoid)\n• MXToolbox / WHOIS Lookup\n• HaveIBeenPwned\n• NMAP / Netstat'
  },
  {
    category: 'Account Compromise',
    front: 'SOC TIP: Que campos verificar em logins suspeitos no Entra ID?',
    back: 'Verificar sempre: "Sign-in Risk", "Impossible Travel" e "Token Protection". Atacantes adoram sesssões roubadas — mata a sessão, não só a password! Revogar os tokens de refresh é tão importante como fazer reset da password.'
  },

  // ── PLAYBOOK 2: IMPOSSIBLE TRAVEL ─────────────────────────────────────────
  {
    category: 'Impossible Travel',
    front: 'O que é Impossible Travel?',
    back: 'Quando uma conta é usada para fazer login a partir de dois locais geograficamente distantes dentro de um período de tempo que não é humanamente possível. Ex: New York às 9:00 AM e London às 9:30 AM.'
  },
  {
    category: 'Impossible Travel',
    front: 'Common Indicators de Impossible Travel / Suspicious Login',
    back: '• Logins de países distintos num curto espaço de tempo\n• IP desconhecido ou de alto risco (VPN/TOR)\n• Novo dispositivo ou browser não reconhecido\n• Login incomum (tarde da noite / madrugada)\n• Múltiplos IPs diferentes na mesma sessão\n• Alerta de "risky sign-in" do identity provider\n• Utilizador reporta conta a agir de forma estranha'
  },
  {
    category: 'Impossible Travel',
    front: 'Workflow do Playbook 2 — Impossible Travel',
    back: '1. Login Alert Triggered\n2. Validate Locations & Time\n3. Check IP & Device Details\n4. Correlate with User Activity\n5. Verify with User (if possible)\n6. Determine Risk / Compromise\n7. Respond, Document & Close'
  },
  {
    category: 'Impossible Travel',
    front: 'Quais as Response Actions para Impossible Travel confirmado?',
    back: '• Force sign-out de todos os dispositivos\n• Revogar sessões ativas\n• Redefinir password\n• Enforçar MFA se não estiver ativo\n• Bloquear IPs maliciosos\n• Desativar conta se compromisso confirmado\n• Notificar o utilizador e equipas relevantes\n• Rever políticas de conditional access\n• Monitorizar a conta para atividade adicional'
  },
  {
    category: 'Impossible Travel',
    front: 'Ferramentas para investigar Impossible Travel',
    back: '• Microsoft Entra ID (Sign-in Logs)\n• Microsoft Sentinel / Splunk\n• Microsoft Defender for Cloud Apps\n• GeoIP Lookup (ipinfo.io, maxmind.com)\n• AbuseIPDB / IPVoid\n• VirusTotal\n• Whois Lookup\n• Tor Project (check.torproject.org)\n• Browsershot / Device Lookup\n• Threat Intelligence Feeds'
  },
  {
    category: 'Impossible Travel',
    front: 'SOC TIP: Verificar "Last Interactive Sign-in" vs "Last Successful Sign-in"',
    back: 'Verificar sempre o "Last Interactive Sign-in", "Last Successful Sign-in" e "Token Issued" time. Atacantes podem reutilizar tokens de sessões legítimas para contornar MFA e verificações de localização.'
  },

  // ── PLAYBOOK 3: COMMAND & CONTROL (C2) ────────────────────────────────────
  {
    category: 'C2 Investigation',
    front: 'O que é Command & Control (C2)?',
    back: 'O canal de comunicação entre um atacante e o sistema comprometido. Permite ao atacante enviar comandos, exfiltrar dados e manter persistência no ambiente da vítima. É o "cérebro" do ataque após o acesso inicial.'
  },
  {
    category: 'C2 Investigation',
    front: 'Quais são os Common C2 Indicators?',
    back: '• Ligações outbound repetidas a IPs raros ou desconhecidos\n• Beaconing a intervalos regulares (long duration)\n• High-frequency beaconing\n• Ligações a IPs/domínios maliciosos conhecidos\n• Domain Generation Algorithm (DGA) suspeito\n• Portas não comuns ou certificados auto-assinados\n• Grandes transferências de dados para destinos externos\n• User-agent ou TLS anomalias'
  },
  {
    category: 'C2 Investigation',
    front: 'Quais são os métodos de comunicação C2?',
    back: '• HTTP/HTTPS — portas 80/443 para se misturar com tráfego normal\n• DNS — dados encapsulados em queries/respostas DNS\n• TCP — ligações diretas em portas não-standard ou persistentes\n• WebSocket — comunicação full-duplex sobre web protocols'
  },
  {
    category: 'C2 Investigation',
    front: 'O que torna o tráfego C2 suspeito vs legítimo?',
    back: 'SUSPEITO:\n• IP de destino incomum ou raro\n• Hosting provider de reputação baixa\n• Ligações em horas incomuns\n• Beaconing (tráfego interno a intervalos regulares)\n• Payloads encriptados para destinos desconhecidos\n• Sem justificação de negócio\n\nLEGÍTIMO:\n• Destinos conhecidos\n• Volume e frequência normais\n• Contexto de negócio claro'
  },
  {
    category: 'C2 Investigation',
    front: 'Workflow do Playbook 3 — C2 Investigation',
    back: '1. Network Alert\n2. Identify Host\n3. Analyze Destination\n4. Check Process\n5. Correlate Logs\n6. Determine C2 Activity\n7. Escalate & Respond'
  },
  {
    category: 'C2 Investigation',
    front: 'Ferramentas para investigar C2',
    back: '• Splunk\n• Wazuh / Elastic SIEM\n• Wireshark\n• Zeek (Network Security Monitor)\n• Microsoft Defender for Endpoint\n• VirusTotal\n• AbuseIPDB / IPVoid'
  },
  {
    category: 'C2 Investigation',
    front: 'Response Actions para C2 confirmado',
    back: '• Bloquear IPs/domínios maliciosos\n• Terminar processos maliciosos\n• Quarentinar host afetado\n• Reset de credenciais se necessário\n• Remover regras de firewall/proxy\n• Remoção de mecanismos de persistência\n• Monitorizar para re-infecção\n• Documentar todas as ações e descobertas'
  },

  // ── PLAYBOOK 4: LATERAL MOVEMENT ──────────────────────────────────────────
  {
    category: 'Lateral Movement',
    front: 'O que é Lateral Movement?',
    back: 'Quando um atacante que comprometeu um sistema usa credenciais roubadas, misconfigurações ou vulnerabilidades para se mover dentro da rede interna e aceder a mais recursos e sistemas.'
  },
  {
    category: 'Lateral Movement',
    front: 'Common Indicators de Lateral Movement',
    back: '• Múltiplos logins falhados seguidos de sucesso\n• Logins usando contas de administração ou privilegiadas\n• Remote services usage: RDP, SMB, WinRM, SSH\n• Acesso a ADMIN$ ou C$ shares\n• Pass-the-Hash ou Pass-the-Ticket activity\n• Relações anormais pai-filho em processos\n• Acesso a múltiplos sistemas num curto espaço de tempo\n• Uso de ferramentas nativas: PsExec, WMI, PowerShell'
  },
  {
    category: 'Lateral Movement',
    front: 'Attack Patterns: Pass-the-Hash vs Pass-the-Ticket',
    back: 'Pass-the-Hash — usa o hash NTLM da password para autenticar sem precisar da password em texto claro.\n\nPass-the-Ticket — usa tickets Kerberos para ganhar acesso a outros sistemas.\n\nAmbas as técnicas evitam a necessidade de conhecer a password em plaintext.'
  },
  {
    category: 'Lateral Movement',
    front: 'Windows Event IDs críticos para Lateral Movement',
    back: '4624 — Conta logada com sucesso\n4625 — Falha de login\n4648 — Login explícito com credenciais\n4672 — Privilégios especiais atribuídos\n4768 — Kerberos TGT (Ticket Granting Ticket) solicitado\n4769 — Kerberos service ticket solicitado'
  },
  {
    category: 'Lateral Movement',
    front: 'Portas e protocolos comuns em Lateral Movement',
    back: '• RDP — 3389 (Remote Desktop Protocol)\n• SMB — 445 (Server Message Block)\n• WinRM — 5985/5986 (Windows Remote Management)\n• SSH — 22 (Secure Shell)\n• WMI — 135, 5985 (Windows Management Instrumentation)'
  },
  {
    category: 'Lateral Movement',
    front: 'Response Actions para Lateral Movement',
    back: '• Isolar host(s) afetados\n• Reset de credenciais comprometidas\n• Revogar sessões ativas\n• Desativar conta se comprometida\n• Remover serviços/tasks maliciosas\n• Bloquear IP de origem no Firewall\n• Rever e atualizar regras de detecção\n• Monitorizar para atividade adicional'
  },

  // ── PLAYBOOK 5: DNS TUNNELING ──────────────────────────────────────────────
  {
    category: 'DNS Tunneling',
    front: 'O que é DNS Tunneling?',
    back: 'Técnica usada por atacantes para contornar controles de segurança de rede encapsulando dados dentro de queries e respostas DNS. Permite exfiltração de dados ou comunicação C2 pela porta 53 (DNS), que raramente é bloqueada.'
  },
  {
    category: 'DNS Tunneling',
    front: 'Suspicious DNS Patterns — como identificar DNS Tunneling?',
    back: '• Subdomínios inusualmente longos (e.g., a13bF8x3d4e5.attacker.com)\n• TXT queries excessivas (usadas para transportar grandes volumes de dados)\n• High NXDOMAIN rate para o mesmo domínio\n• Queries a intervalos consistentes (beaconing)\n• Low TTL values used for DNS records\n• Queries a domínios novos ou raramente registados'
  },
  {
    category: 'DNS Tunneling',
    front: 'DNS Records mais usados em DNS Tunneling',
    back: '• A/AAAA — mapear domínio para tráfego; usado para redirecionar\n• TXT — mais comum para transferência de dados (carrega mais payload)\n• CNAME — redirecionar/esconder destino real\n• MX — abusado para exfiltrar para servidores maliciosos\n• NS — abusado para delegar a resolução a servidores atacantes'
  },
  {
    category: 'DNS Tunneling',
    front: 'Workflow do Playbook 5 — DNS Tunneling',
    back: '1. DNS Alert Triggered\n2. Identify Host\n3. Extract Queries\n4. Analyze Patterns\n5. Check Domain\n6. Correlate Endpoint\n7. Determine Tunneling'
  },
  {
    category: 'DNS Tunneling',
    front: 'Ferramentas para investigar DNS Tunneling',
    back: '• Splunk\n• Wazuh / Elastic SIEM\n• Zeek (Network Security Monitor)\n• Wireshark\n• Security Onion\n• DNS Logs (Windows / BIND / Infoblox)\n• VirusTotal\n• Threat Intelligence (Whois / PassiveTotal)'
  },
  {
    category: 'DNS Tunneling',
    front: 'Quando ESCALAR DNS Tunneling?',
    back: '✅ Exfiltração de dados confirmada via DNS\n✅ Alto volume de queries ou asset crítico envolvido\n✅ Comunicação com domínio malicioso conhecido\n✅ Múltiplos hosts com comportamento semelhante\n✅ Mecanismo de persistência estabelecido\n✅ Qualquer incerteza com potencial alto impacto'
  },
  {
    category: 'DNS Tunneling',
    front: 'SOC TIP: Como abordar DNS Tunneling',
    back: 'DNS tunneling é stealth por design. Foca nos padrões, não nos eventos individuais. Frequência de queries, comprimento dos subdomínios e contexto (frequência + padrão + timing) são os teus melhores aliados de detecção.'
  },

  // ── PLAYBOOK 6: CLOUD SECURITY INCIDENT ───────────────────────────────────
  {
    category: 'Cloud Security',
    front: 'O que é um Cloud Security Incident?',
    back: 'Qualquer atividade suspeita ou maliciosa no ambiente cloud que pode indicar:\n• Acesso cloud não autorizado\n• Identidade comprometida\n• IAM abuse\n• Atividade API suspeita\n• Alterações não autorizadas a recursos\n• Exposição ou exfiltração de dados\n• Manipulação de serviços ou configurações'
  },
  {
    category: 'Cloud Security',
    front: 'Common Cloud Attack Patterns',
    back: '• Account Compromise — acesso com credenciais cloud roubadas ou via MFA bypass\n• Access Key Abuse — uso de chaves de acesso expostas/leaked\n• IAM Privilege Escalation — escalada via role manipulation ou policy manipulation\n• Persistence — criação de novos users/roles/backdoors\n• Resource Abuse — uso dos recursos para crypto mining, spam ou atingir outros objetivos'
  },
  {
    category: 'Cloud Security',
    front: 'Workflow do Playbook 6 — Cloud Security Incident',
    back: '1. Cloud Alert Triggered\n2. Identify Identity\n3. Check Login\n4. Analyze API Activity\n5. Check IAM\n6. Correlate Logs\n7. Determine Impact'
  },
  {
    category: 'Cloud Security',
    front: 'Cloud Service Log Sources — AWS, Azure, GCP',
    back: 'AWS:\n• CloudTrail, S3 Access Logs, VPC Flow Logs, IAM Logs\n\nAzure:\n• Entra ID Sign-in Logs, Activity Logs, Role Assignment Logs, Storage Logs, Azure AD Audit Logs\n\nGCP:\n• Cloud Audit Logs, VPC Flow Logs, Admin Activity Logs'
  },
  {
    category: 'Cloud Security',
    front: 'Ferramentas para Cloud Security Investigation',
    back: '• AWS CloudTrail\n• Microsoft Entra ID (Azure AD)\n• Azure Activity Logs\n• Microsoft Defender for Cloud\n• Microsoft Sentinel\n• Splunk\n• Cloud IAM Logs (AWS / Azure / GCP)'
  },
  {
    category: 'Cloud Security',
    front: 'Quando ESCALAR um Cloud Security Incident?',
    back: '✅ Admin ou conta privilegiada cloud comprometida\n✅ Acesso não autorizado confirmado\n✅ Dados sensíveis acedidos ou expostos\n✅ Mecanismo de persistência estabelecido\n✅ Múltiplos recursos ou contas afetados\n✅ Logging / monitoring desativado\n✅ Impacto crítico de negócio ou de produção'
  },
  {
    category: 'Cloud Security',
    front: 'SOC TIP: Cloud Incident Investigation Formula',
    back: 'Sempre investigar: Identity (Who) + API Activity (What) + Resource (Where) + Impact (Why it matters). Cloud attacks often involve multiple services and can escalate quickly. Correlate everything to understand the full attack path and impact.'
  },

  // ── PLAYBOOK 7: VULNERABILITY EXPLOITATION ────────────────────────────────
  {
    category: 'Vulnerability Exploitation',
    front: 'O que é Vulnerability Exploitation?',
    back: 'Atacantes exploram fraquezas em software, aplicações ou serviços para executar ações não autorizadas: ganhar acesso, roubar dados ou disruptar sistemas. Exemplos: explorar software sem patch, bypassing authentication, injetar código ou comandos maliciosos.'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Common Exploitation Types',
    back: '• Remote Code Execution (RCE) — execução de código arbitrário no sistema alvo\n• SQL Injection — manipulação de bases de dados via SQL malicioso\n• Command Injection — injeção de comandos OS via input vulnerável\n• File Upload Abuse — upload de shells maliciosos para ganhar acesso\n• Path Traversal — acesso a ficheiros fora do diretório esperado\n• Public-Facing Application Exploitation — ataque a apps web expostas'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Common Indicators de Vulnerability Exploitation',
    back: '• Assinaturas de exploit ou deteções de threat intel\n• HTTP requests suspeitos\n• Tentativas de command injection\n• Execução inesperada de processos\n• Indicadores de web shell\n• Upload de ficheiros suspeitos\n• Ligações outbound anormais'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Workflow do Playbook 7 — Vulnerability Exploitation',
    back: '1. Exploit Alert Triggered\n2. Identify Asset\n3. Validate Vulnerability\n4. Analyze Request\n5. Check Host\n6. Correlate Logs\n7. Determine Compromise'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Exploitation Kill Chain',
    back: 'Reconnaissance → Weaponization → Delivery → Exploitation → Impact\n\n• Attacker crafts/selects payload\n• Delivers payload to system or service\n• Exploit triggers on target\n• Attacker achieves objective (data, shell, persistence)'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Ferramentas para Vulnerability Exploitation Investigation',
    back: '• WAF (Web Application Firewall)\n• Splunk\n• Microsoft Defender for Endpoint\n• Wazuh\n• Wireshark\n• Vulnerability Scanner (Nessus / OpenVAS)\n• Web Server Logs (Apache / Nginx / IIS)\n• EDR / XDR'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Initial Containment para Vulnerability Exploitation',
    back: '• Bloquear IPs maliciosos\n• Isolar host afetado\n• Desativar serviço vulnerável\n• Remover shells/processos maliciosos\n• Revogar credenciais (se comprometidas)\n• Aplicar virtual patch (se possível)\n• Preservar evidências forenses'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'Quando ESCALAR Vulnerability Exploitation?',
    back: '✅ Remote Code Execution confirmado\n✅ Web shell ou backdoor encontrado\n✅ Sistema crítico ou de produção envolvido\n✅ Dados sensíveis acedidos ou exfiltrados\n✅ Atacante ganhou persistência\n✅ Múltiplos sistemas ou utilizadores afetados\n✅ Impacto de negócio alto ou crítico'
  },
  {
    category: 'Vulnerability Exploitation',
    front: 'SOC TIP: Além do Exploit Inicial',
    back: 'Nunca parar no alerta inicial. Entender como a vulnerabilidade foi explorada e o que o atacante fez DEPOIS de ganhar acesso é crítico. Sempre determinar: What was accessed? What was accessed? What permissions were achieved? What data was affected?'
  },
];

export const socFlashcards: Flashcard[] = raw.map((card, idx) => ({
  ...card,
  id: `soc-${idx + 1}`,
  domain: 'cybersecurity' as const,
}));
