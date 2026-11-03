import React from 'react';
import { ShieldAlert, Search, Key, ShieldCheck, Lock } from 'lucide-react';

export default function AzureDevSecOpsModule() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldAlert className="text-amber-400" />
            DevSecOps (AZ-400)
          </h2>
          <p className="text-sm text-amber-100 max-w-2xl leading-relaxed">
            A integração de segurança no ciclo de vida de desenvolvimento (Shift-Left). O exame AZ-400 requer conhecimento prático sobre como injetar scans de vulnerabilidades, gerir segredos de forma dinâmica e garantir compliance contínuo usando Microsoft Defender for Cloud e GitHub Advanced Security.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold mb-4">
            <Search size={18} /> Application Security Testing
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">SAST (Static):</strong> Análise do código-fonte (ex: SonarQube, CodeQL). Executado no build stage.</li>
            <li><strong className="text-white">DAST (Dynamic):</strong> Testes à aplicação a correr (ex: OWASP ZAP). Executado após o deploy num ambiente de staging.</li>
            <li><strong className="text-white">SCA (Software Composition Analysis):</strong> Deteção de vulnerabilidades em dependências open-source (npm, nuget) via Dependabot ou WhiteSource.</li>
          </ul>
        </div>
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-4">
            <Key size={18} /> Gestão de Segredos
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Azure Key Vault:</strong> Onde os segredos devem viver. Pipelines devem puxar segredos do Key Vault em runtime através de uma task nativa.</li>
            <li><strong className="text-white">Secret Scanning:</strong> Funcionalidade que bloqueia commits ou alerta caso encontre tokens/keys (ex: AWS keys, SAS tokens) hardcoded no código.</li>
            <li><strong className="text-white">Managed Identities:</strong> O "holy grail" da gestão de segredos: não usar segredos. Apps autenticam-se com a sua identidade gerida pelo Azure AD.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold mb-4">
            <ShieldCheck size={18} /> Defender for DevOps
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Visibilidade centralizada da postura de segurança no Microsoft Defender for Cloud.</li>
            <li>Agrega alertas do GitHub Advanced Security e Azure DevOps.</li>
            <li>Mapeia código vulnerável diretamente para os recursos cloud em execução (Code to Cloud mapping).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
            <Lock size={18} /> Compliance & Governance
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Azure Policy:</strong> Garantir que os deployments via infra-as-code não violam regras da organização (ex: negar criação de IPs públicos).</li>
            <li><strong className="text-white">Environment Approvals:</strong> Exigir que um Security Officer aprove manualmente deploys para produção.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
