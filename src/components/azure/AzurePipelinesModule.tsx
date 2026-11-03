import React, { useState } from 'react';
import { PlayCircle, GitBranch, Github, Code2, Rocket, Check, Copy } from 'lucide-react';

function YamlBlock({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#181926]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[11px] font-mono text-slate-400">{title}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {copied ? <><Check size={12} className="text-emerald-400" /> Copiado</> : <><Copy size={12} /> Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[12px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export default function AzurePipelinesModule() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <PlayCircle className="text-amber-400" />
            CI/CD Pipelines (AZ-400)
          </h2>
          <p className="text-sm text-amber-100 max-w-2xl leading-relaxed">
            A espinha dorsal do DevOps. No exame AZ-400, terás de dominar a transição de Classic Pipelines para YAML, compreender a diferença entre Azure Pipelines e GitHub Actions, e saber configurar self-hosted agents, service connections e deployment gates.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Code2 size={18} /> Azure Pipelines (YAML)
          </div>
          <p className="text-sm text-slate-300">A sintaxe padrão do Azure DevOps. Usa `stages`, `jobs` e `steps`.</p>
          <YamlBlock title="azure-pipelines.yml" code={`trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- script: npm install && npm run build
  displayName: 'Build project'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/dist'
    ArtifactName: 'drop'`} />
        </div>
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Github size={18} /> GitHub Actions
          </div>
          <p className="text-sm text-slate-300">O ecossistema que a Microsoft está a impulsionar fortemente. Usa `on`, `jobs` e `steps`.</p>
          <YamlBlock title=".github/workflows/main.yml" code={`name: CI

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build project
      run: npm install && npm run build
    - uses: actions/upload-artifact@v3
      with:
        name: drop
        path: dist/`} />
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Rocket className="text-emerald-400" />
          Conceitos Core para o Exame
        </h3>
        <ul className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <strong className="text-emerald-300">Service Connections:</strong> Forma segura de o Azure DevOps aceder à tua subscrição Azure sem partilhar passwords (usa App Registrations / Workload Identity Federation).
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <strong className="text-emerald-300">Self-hosted Agents:</strong> Necessários quando o código precisa de aceder a recursos on-premise ou dentro de VNets privadas onde os Microsoft-hosted agents não chegam.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <strong className="text-emerald-300">Deployment Gates:</strong> Funcionalidade (Environment) que pausa um pipeline antes de promover para produção (ex: aguardar por aprovação manual, chamar uma API REST, verificar alertas no Azure Monitor).
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <strong className="text-emerald-300">Pipeline Decorators:</strong> Forma de injetar steps obrigatoriamente no início ou fim de todos os pipelines da organização (ex: forçar scan de segurança).
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
