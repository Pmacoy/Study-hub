import { useState } from 'react';
import { Copy, Check, Shield } from 'lucide-react';

type View = 'overview' | 'sast' | 'container' | 'opa';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => <div key={i} className={line.startsWith('#') ? 'text-slate-600' : line.match(/^(package|import|deny|allow|default)\b/) ? 'text-violet-400' : line.startsWith('$') ? 'text-emerald-300' : 'text-slate-300'}>{line}</div>)}
      </pre>
    </div>
  );
}

const OPA_POLICY = `# policies/opa/tagging.rego — Cloud Platform Project
package terraform.azure

import future.keywords.in

# Tags obrigatórias em todos os recursos
required_tags := {"Environment", "Project", "ManagedBy"}

deny contains msg if {
  some resource in input.resource_changes
  resource.change.actions != ["no-op"]
  existing_tags := resource.change.after.tags
  missing := required_tags - {tag | tag in object.keys(existing_tags)}
  count(missing) > 0
  msg := sprintf("Resource '%v' em falta tags: %v",
    [resource.address, missing])
}

# NSG com acesso público não permitido em PROD
deny contains msg if {
  some resource in input.resource_changes
  resource.type == "azurerm_network_security_rule"
  resource.change.after.source_address_prefix == "*"
  resource.change.after.access == "Allow"
  input.variables.env_name.value == "PROD"
  msg := sprintf("NSG '%v' permite acesso público em PROD!",
    [resource.address])
}

# Testar com: opa eval -d tagging.rego -i plan.json "data.terraform.azure.deny"`;

const TRIVY_EXAMPLES = `# Scan de imagem Docker — integrado no CI/CD
$ trivy image --severity CRITICAL,HIGH myapp:latest

# Output exemplo:
# myapp:latest (alpine 3.18.0)
# ================================
# CRITICAL: 0
# HIGH: 2
#   CVE-2023-1234 | openssl | 3.1.0 | Fixed: 3.1.1
#   CVE-2023-5678 | libssl  | 3.1.0 | Fixed: 3.1.2

# Falhar pipeline se houver CRITICAL
$ trivy image --exit-code 1 --severity CRITICAL myapp:latest

# Scan de repositório (IaC, secrets, código)
$ trivy repo . --scanners secret,config

# Scan de ficheiro Dockerfile
$ trivy config Dockerfile

# Scan de manifests Kubernetes
$ trivy config k8s/

# Integração GitHub Actions:
# uses: aquasecurity/trivy-action@master
# with:
#   image-ref: \${{ env.IMAGE }}
#   exit-code: '1'
#   severity: CRITICAL`;

const SONAR_CONFIG = `# sonar-project.properties
sonar.projectKey=cpe-devops
sonar.projectName=DevOps Hub
sonar.projectVersion=1.0

sonar.sources=src
sonar.tests=src/__tests__
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts

# Quality Gate — falha o pipeline se:
# - Coverage < 80%
# - Bugs > 0 (blocker/critical)
# - Vulnerabilidades > 0
# - Code Smells (technical debt) > 30min
# - Duplicated Lines > 3%

# Pipeline GitHub Actions:
# - name: SonarQube Scan
#   uses: sonarsource/sonarqube-scan-action@master
#   env:
#     SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
#     SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}

# Quality Gate check (falha se não passar)
# - name: Check Quality Gate
#   uses: sonarsource/sonarqube-quality-gate-action@master`;

export default function SecuritySimulator() {
  const [view, setView] = useState<View>('overview');

  const views = [
    { id: 'overview' as View, label: '🔐 Shift-Left Security' },
    { id: 'sast' as View, label: '🔬 SAST — SonarQube' },
    { id: 'container' as View, label: '🐳 Container — Trivy' },
    { id: 'opa' as View, label: '⚖️ Policy as Code — OPA' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === v.id ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'overview' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-rose-400" />
              <span className="text-[12px] font-black text-rose-400 uppercase tracking-widest">Shift-Left Security</span>
            </div>
            <p className="text-[12px] text-slate-400">Mover os controlos de segurança para o início do SDLC. Encontrar vulnerabilidades em código é 100x mais barato do que em produção.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { t: 'SAST', desc: 'Static Application Security Testing', tools: 'SonarQube, Semgrep, Checkmarx', when: 'Commit / PR', color: 'sky' },
              { t: 'SCA', desc: 'Software Composition Analysis', tools: 'Trivy, Snyk, OWASP Dep Check', when: 'Build', color: 'violet' },
              { t: 'DAST', desc: 'Dynamic Application Security Testing', tools: 'OWASP ZAP, Burp Enterprise', when: 'STG deploy', color: 'amber' },
              { t: 'Secrets', desc: 'Detecção de credenciais expostas', tools: 'GitLeaks, TruffleHog, detect-secrets', when: 'Pre-commit / CI', color: 'rose' },
            ].map(s => (
              <div key={s.t} className={`p-4 rounded-2xl border ${s.color === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : s.color === 'violet' ? 'border-violet-500/30 bg-violet-500/8' : s.color === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : 'border-rose-500/30 bg-rose-500/8'}`}>
                <div className={`text-[13px] font-black mb-1 ${s.color === 'sky' ? 'text-sky-400' : s.color === 'violet' ? 'text-violet-400' : s.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>{s.t}</div>
                <div className="text-[10px] text-slate-400 mb-2">{s.desc}</div>
                <div className="text-[9px] font-mono text-slate-500">{s.tools}</div>
                <div className={`mt-2 text-[9px] font-bold ${s.color === 'sky' ? 'text-sky-500' : s.color === 'violet' ? 'text-violet-500' : s.color === 'amber' ? 'text-amber-500' : 'text-rose-500'}`}>Stage: {s.when}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-3">✓ Security Checklist</div>
              {['Nunca credenciais no código (profiles/*.tfvars em .gitignore)', 'Managed Identity em vez de service principal keys', 'NSG com deny-all por default, allowlist explícita', 'Key Vault com Purge Protection + Soft Delete 90 dias', 'TLS 1.2+ (min_tls_version no storage account)', 'OIDC para GitHub Actions — zero static secrets', 'Trivy scan em todas as imagens antes do push', 'OPA policies validadas em cada terraform plan'].map(i => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400 py-0.5">
                  <span className="text-emerald-400 shrink-0">✓</span>{i}
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className="text-[11px] font-black text-rose-400 uppercase tracking-widest mb-3">⚠ Anti-patterns Comuns</div>
              {['Passwords hardcoded no código fonte ou Dockerfile', 'ENV com secrets em docker-compose.yml commitado', 'kubectl apply com permissão de admin em CI/CD', 'Container a correr como root (USER root)', 'Imagens sem scan de vulnerabilidades', 'NSG com port 22 (SSH) aberto ao 0.0.0.0/0', 'Terraform state local commitado no Git', 'Secrets em variáveis de ambiente não encriptadas'].map(i => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400 py-0.5">
                  <span className="text-rose-400 shrink-0">✗</span>{i}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'sast' && <Code code={SONAR_CONFIG} lang="sonar-project.properties + GitHub Actions" />}
      {view === 'container' && <Code code={TRIVY_EXAMPLES} lang="trivy — container & IaC scanning" />}
      {view === 'opa' && <Code code={OPA_POLICY} lang="policies/opa/tagging.rego — Cloud Platform Project" />}
    </div>
  );
}
