import { useState } from 'react';
import {
  Crosshair,
  FileCode,
  Binary,
  Radio,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Layers,
  Terminal,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Database
} from 'lucide-react';

type HuntingTab = 'hypothesis-hunt' | 'sigma-studio' | 'yara-lab' | 'pcap-analyzer';

interface HuntingHypothesis {
  id: string;
  title: string;
  mitreTactic: string;
  mitreId: string;
  hypothesisStatement: string;
  dataSources: string[];
  kqlQuery: string;
  simulatedMatches: {
    timestamp: string;
    host: string;
    user: string;
    details: string;
    verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
  }[];
  explanation: string;
}

const HUNTING_HYPOTHESES: HuntingHypothesis[] = [
  {
    id: 'c2-beaconing',
    title: 'Detecção de Beaconing C2 Periódico com Jitter',
    mitreTactic: 'Command and Control',
    mitreId: 'T1071.001 - Web Protocols',
    hypothesisStatement: 'Invasores que estabelecem persistência com agentes C2 (como Cobalt Strike ou Mythic) geram conexões HTTP/HTTPS regulares para o mesmo IP/Domínio externo em intervalos fixos com variação matemática de tempo (Jitter < 15%).',
    dataSources: ['Proxy Logs', 'Firewall Flow Logs (NetFlow/IPFIX)', 'DNS Resolution Logs'],
    kqlQuery: `CommonSecurityLog
| where DeviceEventClassID == "traffic:flow"
| where DestinationPort in (80, 443, 8080, 8443)
| summarize ConnectionCount = count(),
            TimeDiffStdDev = stdev(datetime_diff('second', TimeGenerated, prev(TimeGenerated)))
  by SourceIP, DestinationIP, bin(TimeGenerated, 1h)
| where ConnectionCount > 60 and TimeDiffStdDev < 5`,
    simulatedMatches: [
      {
        timestamp: '2026-09-28 14:10:00 UTC',
        host: 'WS-ENG-08 (10.0.3.44)',
        user: 'artur.moura',
        details: '180 conexões para 91.132.93.15:443 a cada 20.2 segundos (Jitter: 2.1%). User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Safari/537.36',
        verdict: 'MALICIOUS'
      },
      {
        timestamp: '2026-09-28 14:15:22 UTC',
        host: 'SRV-MON-01 (10.0.1.10)',
        user: 'SYSTEM',
        details: '60 requisições HTTP para zabbix.empresa.com a cada 60s (Agente de telemetria legítimo da infraestrutura).',
        verdict: 'BENIGN'
      }
    ],
    explanation: 'A consulta procura conexões de alta frequência com desvio padrão de tempo muito baixo (baixo jitter), indicando comunicação automatizada de malware.'
  },
  {
    id: 'lolbas-rundll32',
    title: 'Abuso de Living off the Land (rundll32 / regsvr32) em Pastas Temporárias',
    mitreTactic: 'Defense Evasion',
    mitreId: 'T1218.011 - Rundll32',
    hypothesisStatement: 'Atores de ameaça usam executáveis legítimos assinados pela Microsoft como rundll32.exe ou regsvr32.exe para executar payloads maliciosos armazenados em pastas graváveis por qualquer usuário, como %TEMP% ou %APPDATA%.',
    dataSources: ['EDR Process Events (Sysmon Event ID 1 / MDE)', 'Windows Security Event ID 4688'],
    kqlQuery: `DeviceProcessEvents
| where FileName in~ ("rundll32.exe", "regsvr32.exe")
| where ProcessCommandLine has_any ("AppData", "Temp", "ProgramData", "Users\\Public")
| project Timestamp, DeviceName, AccountName, ProcessCommandLine, InitiatingProcessFileName`,
    simulatedMatches: [
      {
        timestamp: '2026-09-28 15:02:11 UTC',
        host: 'WS-RH-02 (10.0.2.19)',
        user: 'claudia.lima',
        details: 'rundll32.exe C:\\Users\\claudia\\AppData\\Local\\Temp\\update_patch.dll,DllRegisterServer',
        verdict: 'MALICIOUS'
      },
      {
        timestamp: '2026-09-28 13:40:00 UTC',
        host: 'WS-RH-02 (10.0.2.19)',
        user: 'SYSTEM',
        details: 'rundll32.exe C:\\Windows\\System32\\davclnt.dll,DavRegisterClient',
        verdict: 'BENIGN'
      }
    ],
    explanation: 'O carregamento de DLLs a partir de diretórios de usuário (%TEMP%, %APPDATA%) por utilitários de sistema nativos é uma técnica clássica de evasão de antivírus tradicional (Defense Evasion).'
  },
  {
    id: 'scheduled-task-persistence',
    title: 'Criação Oculta de Tarefas Agendadas (Scheduled Tasks)',
    mitreTactic: 'Persistence & Privilege Escalation',
    mitreId: 'T1053.005 - Scheduled Task',
    hypothesisStatement: 'Malwares utilizam o utilitário schtasks.exe para criar tarefas agendadas com disparos ao inicializar o Windows ou a cada poucos minutos disfarçadas de atualizações de software.',
    dataSources: ['Windows Event ID 4698 (A scheduled task was created)', 'Sysmon Event ID 1'],
    kqlQuery: `SecurityEvent
| where EventID == 4698
| extend TaskData = parse_xml(EventData)
| extend TaskName = tostring(TaskData.TaskScheduled.TaskName)
| extend TaskCommand = tostring(TaskData.TaskScheduled.Actions.Exec.Command)
| where TaskCommand has_any ("powershell", "cmd.exe", "wscript.exe", "cscript.exe", "mshta.exe")`,
    simulatedMatches: [
      {
        timestamp: '2026-09-28 11:20:05 UTC',
        host: 'SRV-FILE-01 (10.0.1.25)',
        user: 'admin_temp',
        details: 'TaskName: "\\Microsoft\\Windows\\Maintenance\\WinUpdateCheck" | Command: "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File C:\\ProgramData\\sync.ps1"',
        verdict: 'MALICIOUS'
      }
    ],
    explanation: 'A tarefa agendada foi camuflada dentro do namespace da Microsoft, mas executa um script PowerShell em segundo plano na pasta ProgramData.'
  }
];

export default function ThreatHuntingSimulator() {
  const [activeTab, setActiveTab] = useState<HuntingTab>('hypothesis-hunt');
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string>(HUNTING_HYPOTHESES[0].id);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  // Sigma Studio State
  const [sigmaTargetFormat, setSigmaTargetFormat] = useState<'kql' | 'splunk' | 'eql'>('kql');
  const [sigmaRuleTitle, setSigmaRuleTitle] = useState<string>('Suspicious PowerShell Download Cradle');
  const [sigmaSearchKeyword, setSigmaSearchKeyword] = useState<string>('DownloadString');

  // YARA Lab State
  const [yaraHexPattern, setYaraHexPattern] = useState<string>('4D 5A 90 00');
  const [yaraStringMatch, setYaraStringMatch] = useState<string>('mimikatz.exe');
  const [sampleBuffer, setSampleBuffer] = useState<string>(
    'MZ\x90\x00\x03\x00\x00\x00... [PE Header] ... Strings: mimikatz.exe, sekurlsa::logonpasswords, privilege::debug ...'
  );

  const activeHypothesis = HUNTING_HYPOTHESES.find(h => h.id === selectedHypothesisId) || HUNTING_HYPOTHESES[0];

  const generatedSigmaYaml = `title: ${sigmaRuleTitle}
id: 7a82c419-5d21-4f12-a129-38e83b8e90a1
status: experimental
description: Detects execution of PowerShell download cradles in command line
references:
    - https://attack.mitre.org/techniques/T1059/001/
author: Blue Team Hunter
date: 2026-09-28
tags:
    - attack.execution
    - attack.t1059.001
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith:
            - '\\powershell.exe'
            - '\\pwsh.exe'
        CommandLine|contains:
            - '${sigmaSearchKeyword}'
            - 'Net.WebClient'
            - 'Invoke-WebRequest'
            - 'IWR'
    condition: selection
falsepositives:
    - Legitimate administrative automation scripts
level: high`;

  function getTranslatedSigmaQuery(format: 'kql' | 'splunk' | 'eql'): string {
    switch (format) {
      case 'kql':
        return `DeviceProcessEvents
| where FileName in~ ("powershell.exe", "pwsh.exe")
| where ProcessCommandLine has_any ("${sigmaSearchKeyword}", "Net.WebClient", "Invoke-WebRequest", "IWR")
| project Timestamp, DeviceName, AccountName, ProcessCommandLine`;
      case 'splunk':
        return `index=windows (Image="*\\\\powershell.exe" OR Image="*\\\\pwsh.exe") AND (CommandLine="*${sigmaSearchKeyword}*" OR CommandLine="*Net.WebClient*" OR CommandLine="*Invoke-WebRequest*") | table _time, host, user, CommandLine`;
      case 'eql':
        return `process where process.name in ("powershell.exe", "pwsh.exe") and stringContains(process.command_line, "${sigmaSearchKeyword}")`;
    }
  }

  const isYaraMatched = sampleBuffer.includes(yaraStringMatch);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
            <Crosshair size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Proactive Blue Team Operations
              </span>
              <span className="text-xs text-slate-400 font-mono">MITRE ATT&CK Framework</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">Threat Hunting & Detection Engineering</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Caça proativa a ameaças, construção de regras Sigma / YARA e análise forense de tráfego de rede.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab('hypothesis-hunt')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'hypothesis-hunt'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Crosshair size={14} />
            <span>Hypothesis Hunting</span>
          </button>
          <button
            onClick={() => setActiveTab('sigma-studio')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'sigma-studio'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <FileCode size={14} />
            <span>Sigma Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('yara-lab')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'yara-lab'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Binary size={14} />
            <span>YARA Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('pcap-analyzer')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'pcap-analyzer'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Radio size={14} />
            <span>PCAP & C2 Forensics</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: HYPOTHESIS HUNTING ENGINE ───────────────────────────────────── */}
      {activeTab === 'hypothesis-hunt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Hypothesis List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Catálogo de Hipóteses de Caça ({HUNTING_HYPOTHESES.length})
            </h2>

            <div className="space-y-2">
              {HUNTING_HYPOTHESES.map(h => {
                const isSelected = h.id === selectedHypothesisId;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHypothesisId(h.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500/40 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {h.mitreTactic}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{h.mitreId.split(' - ')[0]}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-100">{h.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{h.hypothesisStatement}</p>
                  </button>
                );
              })}
            </div>

            {/* Hunting Methodology Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers size={14} className="text-sky-400" />
                <span>Metodologia TaHiTI de Caça</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside leading-relaxed">
                <li><strong className="text-slate-300">Hipótese:</strong> Baseada em TTP do MITRE ATT&CK.</li>
                <li><strong className="text-slate-300">Dados:</strong> Verificar se a telemetria necessária existe.</li>
                <li><strong className="text-slate-300">Execução:</strong> Query KQL/SPL de caça profunda.</li>
                <li><strong className="text-slate-300">Automação:</strong> Transformar caça recorrente em regra de detecção SIEM/EDR.</li>
              </ul>
            </div>
          </div>

          {/* Right: Hypothesis Workspace */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
                  <span>{activeHypothesis.mitreTactic}</span>
                  <span>•</span>
                  <span>{activeHypothesis.mitreId}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{activeHypothesis.title}</h2>
              </div>

              {/* Hypothesis Box */}
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 text-xs space-y-2">
                <span className="font-bold text-sky-300 uppercase text-[10px] tracking-wider block">
                  Declaração da Hipótese de Caça:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  "{activeHypothesis.hypothesisStatement}"
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 border-t border-sky-500/20">
                  <span className="font-bold text-slate-300">Fontes de Dados Requeridas:</span>
                  {activeHypothesis.dataSources.map(ds => (
                    <span key={ds} className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono">
                      {ds}
                    </span>
                  ))}
                </div>
              </div>

              {/* KQL Query Box */}
              <div className="rounded-xl border border-slate-800 overflow-hidden text-xs bg-slate-950">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Database size={13} className="text-sky-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-200">Kusto Query Language (KQL)</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeHypothesis.kqlQuery);
                      setCopiedQuery(true);
                      setTimeout(() => setCopiedQuery(false), 2000);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    {copiedQuery ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedQuery ? 'Copiado!' : 'Copiar KQL'}</span>
                  </button>
                </div>
                <pre className="p-3.5 text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                  {activeHypothesis.kqlQuery}
                </pre>
              </div>

              {/* Simulated Query Results / Matches */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Resultados da Caça no Parque de Endpoints (Simulação)</span>
                  <span className="text-[10px] font-mono text-slate-500">{activeHypothesis.simulatedMatches.length} registros retornados</span>
                </h3>

                <div className="space-y-2">
                  {activeHypothesis.simulatedMatches.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        m.verdict === 'MALICIOUS'
                          ? 'bg-red-950/20 border-red-500/40 text-red-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold">
                          <span>{m.host}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-normal text-slate-400">👤 {m.user}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          m.verdict === 'MALICIOUS'
                            ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {m.verdict === 'MALICIOUS' ? '🚨 AMEAÇA CONFIRMADA' : '✓ BENIGNO (Linha de Base)'}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800/80">
                        {m.details}
                      </div>
                      <div className="text-[10px] text-slate-500">Timestamp: {m.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SIGMA STUDIO & QUERY TRANSLATOR ─────────────────────────────── */}
      {activeTab === 'sigma-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="text-sky-400" size={18} />
                  <h2 className="text-sm font-bold text-white">Editor de Regras Sigma (YAML Genérico)</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Vendor-Agnostic Format
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Título da Regra de Detecção:</label>
                  <input
                    type="text"
                    value={sigmaRuleTitle}
                    onChange={e => setSigmaRuleTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Palavra-Chave / Padrão de Linha de Comando:</label>
                  <input
                    type="text"
                    value={sigmaSearchKeyword}
                    onChange={e => setSigmaSearchKeyword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rendered Sigma YAML */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>rule.sigma.yml</span>
                </div>
                <pre className="p-3.5 text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                  {generatedSigmaYaml}
                </pre>
              </div>
            </div>
          </div>

          {/* Right: Target Translator Output */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="text-sky-400" size={18} />
                  <span>Tradução Automática (Target SIEM)</span>
                </h2>

                {/* SIEM Engine Selector */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setSigmaTargetFormat('kql')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      sigmaTargetFormat === 'kql' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    KQL (Sentinel)
                  </button>
                  <button
                    onClick={() => setSigmaTargetFormat('splunk')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      sigmaTargetFormat === 'splunk' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    SPL (Splunk)
                  </button>
                  <button
                    onClick={() => setSigmaTargetFormat('eql')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      sigmaTargetFormat === 'eql' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    EQL (Elastic)
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/30 overflow-hidden bg-slate-950">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
                  <span className="text-[11px] font-mono font-bold text-sky-400 uppercase">
                    Consulta Gerada ({sigmaTargetFormat})
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(getTranslatedSigmaQuery(sigmaTargetFormat))}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <Copy size={12} /> Copiar
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono text-sky-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {getTranslatedSigmaQuery(sigmaTargetFormat)}
                </pre>
              </div>

              {/* Detection Engineering Tips */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200">🚀 Por que usar Sigma na Detecção?</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Regras Sigma permitem que o time de Cyber Threat Intelligence (CTI) escreva detecções uma única vez e as distribua automaticamente para o Microsoft Sentinel, Splunk, Elastic e QRadar sem reescrever código manualmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: YARA LAB & PATTERN MATCHING ────────────────────────────────── */}
      {activeTab === 'yara-lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Binary className="text-sky-400" size={18} />
                <h2 className="text-sm font-bold text-white">Laboratório de Assinaturas YARA</h2>
              </div>
              <p className="text-xs text-slate-400">
                YARA é o padrão da indústria para classificar e identificar amostras de malware com base em padrões de strings textuais e sequências hexadecimais.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Hex Magic Bytes (PE Header):</label>
                  <input
                    type="text"
                    value={yaraHexPattern}
                    onChange={e => setYaraHexPattern(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">String de Assinatura ($str):</label>
                  <input
                    type="text"
                    value={yaraStringMatch}
                    onChange={e => setYaraStringMatch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* YARA Rule Definition Code */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>rule Detect_Mimikatz_Memory</span>
                </div>
                <pre className="p-3.5 text-[11px] font-mono text-sky-300 leading-relaxed overflow-x-auto">
{`rule Detect_Mimikatz_Artifacts {
    meta:
        description = "Detects Mimikatz execution artifacts in memory"
        author = "Threat Hunter SOC N2"
        reference = "MITRE ATT&CK T1003.001"
    strings:
        $header = { ${yaraHexPattern} }
        $s1 = "${yaraStringMatch}" ascii wide nocase
        $s2 = "sekurlsa::logonpasswords" ascii wide nocase
        $s3 = "privilege::debug" ascii wide nocase
    condition:
        $header at 0 and ($s1 or ($s2 and $s3))
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Right: Sample Execution & Match Result */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="text-sky-400" size={18} />
                <span>Buffer da Amostra Suspeita (Raw Binary / Memory Dump)</span>
              </h2>

              <textarea
                value={sampleBuffer}
                onChange={e => setSampleBuffer(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 focus:border-sky-500 focus:outline-none leading-relaxed"
              />

              {/* Verdict Indicator */}
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                isYaraMatched
                  ? 'bg-red-950/40 border-red-500 text-red-200'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}>
                {isYaraMatched ? (
                  <>
                    <AlertTriangle size={24} className="text-red-400 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">MATCH POSITIVO: Regra YARA disparou!</div>
                      <div className="text-[11px] text-red-300 mt-0.5">
                        A string <code>"{yaraStringMatch}"</code> e o cabeçalho executável foram localizados dentro da amostra analisada.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Nenhum Match Identificado</div>
                      <div className="text-[11px] text-emerald-300 mt-0.5">
                        A amostra fornecida não contém os padrões configurados na regra.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: PCAP & C2 NETWORK FORENSICS ──────────────────────────────────── */}
      {activeTab === 'pcap-analyzer' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Radio size={20} className="text-sky-400" />
                <span>Analisador Forense de PCAP / Zeek Logs (Tráfego de Rede)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspeção de Handshakes TLS, extração de SNI e detecção de ataques de DNS e C2.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[10px] font-bold">
              Zeek conn.log / ssl.log
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Source IP:Port</th>
                  <th className="p-3">Dest IP:Port</th>
                  <th className="p-3">Protocol / Service</th>
                  <th className="p-3">TLS SNI / Hostname</th>
                  <th className="p-3">Diagnóstico Forense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 text-slate-400">14:22:01.102</td>
                  <td className="p-3 text-sky-300">10.0.3.12:49812</td>
                  <td className="p-3 text-red-400">185.220.101.5:443</td>
                  <td className="p-3">TLSv1.3 (TCP)</td>
                  <td className="p-3 text-amber-300 font-bold">c2-relay-node.darknet.biz</td>
                  <td className="p-3 text-red-400 font-semibold">🚨 C2 Beaconing (Certificado autoassinado não confiável)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 text-slate-400">14:22:05.419</td>
                  <td className="p-3 text-sky-300">10.0.3.12:51200</td>
                  <td className="p-3 text-slate-400">8.8.8.8:53</td>
                  <td className="p-3">DNS (UDP)</td>
                  <td className="p-3 text-slate-300">login.microsoftonline.com</td>
                  <td className="p-3 text-emerald-400">✓ Legítimo (Resolução de IP corporativo)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 text-slate-400">14:22:15.890</td>
                  <td className="p-3 text-sky-300">10.0.4.15:39102</td>
                  <td className="p-3 text-red-400">198.51.100.22:53</td>
                  <td className="p-3">DNS (UDP TXT)</td>
                  <td className="p-3 text-amber-300 font-bold">v01.dXNlci1kYXRh...dnshole.biz</td>
                  <td className="p-3 text-red-400 font-semibold">🚨 DNS Tunneling (Alta entropia e subdomínios Base64)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
