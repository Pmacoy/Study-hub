import React from 'react';
import { GitBranch, GitPullRequest, ShieldCheck, History, Github } from 'lucide-react';

export default function AzureSourceControlModule() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <GitBranch className="text-amber-400" />
            Source Control (AZ-400)
          </h2>
          <p className="text-sm text-amber-100 max-w-2xl leading-relaxed">
            Estratégias de versionamento são o ponto de partida do DevOps. O AZ-400 exige conhecimentos sobre GitFlow vs Trunk-based development, migração do TFVC (Team Foundation Version Control) para Git, e proteção de branches com policies rigorosas.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold mb-4">
            <GitBranch size={18} /> Branching Strategies
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Trunk-based Development:</strong> Todos os devs fazem commit na `main` diariamente. Requer CI robusto e Feature Flags. Recomendado para equipas maduras de DevOps.</li>
            <li><strong className="text-white">GitFlow:</strong> Branches longas (`develop`, `release`, `feature/*`). Útil para produtos com versões calendarizadas rigorosas, mas aumenta o "merge hell".</li>
            <li><strong className="text-white">GitHub Flow:</strong> Versão simplificada do GitFlow. Tudo na `main` (deployable) + feature branches.</li>
          </ul>
        </div>
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
            <ShieldCheck size={18} /> Branch Policies
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Minimum Reviewers:</strong> Obriga a aprovação de X pessoas (ex: Code Review) antes do merge.</li>
            <li><strong className="text-white">Build Validation:</strong> O PR só pode fazer merge se a pipeline de CI passar (compilar e testar a branch do PR contra a target branch).</li>
            <li><strong className="text-white">Status Checks:</strong> Obriga a passagem de verificações externas (ex: SonarQube quality gate).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-bold mb-4">
            <History size={18} /> TFVC vs Git
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">TFVC:</strong> Centralizado. Os devs têm apenas uma versão dos ficheiros locais. Ficheiros têm check-in/check-out lock.</li>
            <li><strong className="text-white">Git:</strong> Distribuído. Cada dev tem o histórico completo. Permite commits locais e branching leve.</li>
            <li><strong className="text-white">Migração:</strong> Usa a ferramenta `git-tfs` para manter histórico, ou migração simples via portal (até 180 dias de histórico).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold mb-4">
            <Github size={18} /> Azure Repos vs GitHub
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>O AZ-400 testa a transição para o ecossistema do GitHub.</li>
            <li><strong className="text-white">GitHub Advanced Security:</strong> Secret scanning, Dependabot (dependency review) e CodeQL nativos.</li>
            <li><strong className="text-white">Codespaces:</strong> Ambientes de desenvolvimento consistentes na cloud, reduzindo o "funciona na minha máquina".</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
