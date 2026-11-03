import { useState } from 'react';
import { Copy, Check, Shield, Search, Container, Scale, Server, ShieldCheck, Terminal, Lock } from 'lucide-react';

type View = 'overview' | 'sast' | 'container' | 'opa' | 'hardening';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-2xs font-mono text-slate-400">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-2xs text-slate-400 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto bg-[#181926]">
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

const HARDENING_CONFIG = `# Server Hardening & WAF (Fengarde & Sentora Architecture)
# 1. Nginx / Apache Hardening (Remoção de assinaturas e headers de segurança)
server_tokens off;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

# 2. ModSecurity WAF (Fengarde Core Rules) — Bloqueio de SQLi e XSS
SecRuleEngine On
SecRequestBodyAccess On
SecAuditEngine RelevantOnly
SecRule REQUEST_COOKIES|ARGS "@rx (?i)(union|select|insert|update|delete|drop)" \\
    "id:1001,phase:2,deny,status:403,msg:'SQL Injection Attack Detected by Fengarde WAF',logdata:'Matched Data: %{TX.0}'"

SecRule REQUEST_URI "@rx <script>" \\
    "id:1002,phase:2,deny,status:403,msg:'Cross-Site Scripting (XSS) Detected',logdata:'Matched Data: %{TX.0}'"

# 3. Sentora / Hosting Control Panel Hardening
# - Restrição de permissões em /etc/sentora/panel/configs/
# - Desativação de funções perigosas do PHP em alojamentos partilhados (disable_functions = exec,passthru,shell_exec,system,proc_open)`;

export default function SecuritySimulator() {
  const [view, setView] = useState<View>('overview');

  // Server Hardening Interactive Lab state
  const [hardeningAction, setHardeningAction] = useState<'ssh' | 'waf' | 'php'>('ssh');
  const [hardeningRunning, setHardeningRunning] = useState(false);
  const [hardeningResult, setHardeningResult] = useState('Clique num teste de hardening para simular a aplicação.');

  const runHardeningSim = (action: 'ssh' | 'waf' | 'php') => {
    setHardeningRunning(true);
    setHardeningAction(action);
    setTimeout(() => {
      if (action === 'ssh') {
        setHardeningResult(`🔒 SSH Hardening Aplicado:
- Porta alterada para 2222 (Reduz brute-force automático)
- Root Login desativado (PermitRootLogin no)
- Autenticação por password desativada (Apenas chaves Ed25519)`);
      } else if (action === 'waf') {
        setHardeningResult(`🛡️ Fengarde / ModSecurity WAF Ativo:
- Core Rule Set (CRS) v3.3 ativado
- Inspeção ativa de payload HTTP contra SQLi, XSS e RCE
- Rate-limit configurado: max 60 req/min por IP`);
      } else {
        setHardeningResult(`⚡ PHP & Sentora Sandbox Hardening:
- disable_functions = exec, system, passthru, shell_exec
- open_basedir restrito à pasta do domínio do cliente
- Desativação de exibição de erros (display_errors = Off)`);
      }
      setHardeningRunning(false);
    }, 600);
  };

  const views = [
    { id: 'overview' as View, label: <><Shield size={14} className="mr-1 inline" /> Shift-Left Security</> },
    { id: 'sast' as View, label: <><Search size={14} className="mr-1 inline" /> SAST — SonarQube</> },
    { id: 'container' as View, label: <><Container size={14} className="mr-1 inline" /> Container — Trivy</> },
    { id: 'opa' as View, label: <><Scale size={14} className="mr-1 inline" /> Policy as Code — OPA</> },
    { id: 'hardening' as View, label: <><Server size={14} className="mr-1 inline" /> Server Hardening & WAF (Fengarde)</> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${view === v.id ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' : 'border border-slate-800 text-slate-400 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'overview' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-rose-400" />
              <span className="text-sm font-black text-rose-400 uppercase tracking-widest">Shift-Left Security</span>
            </div>
            <p className="text-sm text-slate-400">Mover os controlos de segurança para o início do SDLC. Encontrar vulnerabilidades em código é 100x mais barato do que em produção.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { t: 'SAST', desc: 'Static Application Security Testing', tools: 'SonarQube, Semgrep, Checkmarx', when: 'Commit / PR', color: 'sky' },
              { t: 'SCA', desc: 'Software Composition Analysis', tools: 'Trivy, Snyk, OWASP Dep Check', when: 'Build', color: 'violet' },
              { t: 'DAST', desc: 'Dynamic Application Security Testing', tools: 'OWASP ZAP, Burp Enterprise', when: 'STG deploy', color: 'amber' },
              { t: 'Secrets', desc: 'Detecção de credenciais expostas', tools: 'GitLeaks, TruffleHog, detect-secrets', when: 'Pre-commit / CI', color: 'rose' },
            ].map(s => (
              <div key={s.t} className={`p-4 rounded-2xl border ${s.color === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : s.color === 'violet' ? 'border-violet-500/30 bg-violet-500/8' : s.color === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : 'border-rose-500/30 bg-rose-500/8'}`}>
                <div className={`text-base font-black mb-1 ${s.color === 'sky' ? 'text-sky-400' : s.color === 'violet' ? 'text-violet-400' : s.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>{s.t}</div>
                <div className="text-2xs text-slate-400 mb-2">{s.desc}</div>
                <div className="text-2xs font-mono text-slate-400">{s.tools}</div>
                <div className={`mt-2 text-2xs font-bold ${s.color === 'sky' ? 'text-sky-500' : s.color === 'violet' ? 'text-violet-500' : s.color === 'amber' ? 'text-amber-500' : 'text-rose-500'}`}>Stage: {s.when}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-[#181926]/70">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">✓ Security Checklist</div>
              {['Nunca credenciais no código (profiles/*.tfvars em .gitignore)', 'Managed Identity em vez de service principal keys', 'NSG com deny-all por default, allowlist explícita', 'Key Vault com Purge Protection + Soft Delete 90 dias', 'TLS 1.2+ (min_tls_version no storage account)', 'OIDC para GitHub Actions — zero static secrets', 'Trivy scan em todas as imagens antes do push', 'OPA policies validadas em cada terraform plan'].map(i => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400 py-0.5">
                  <span className="text-emerald-400 shrink-0">✓</span>{i}
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-[#181926]/70">
              <div className="text-xs font-black text-rose-400 uppercase tracking-widest mb-3">⚠ Anti-patterns Comuns</div>
              {['Passwords hardcoded no código fonte ou Dockerfile', 'ENV com secrets em docker-compose.yml commitado', 'kubectl apply com permissão de admin em CI/CD', 'Container a correr como root (USER root)', 'Imagens sem scan de vulnerabilidades', 'NSG com port 22 (SSH) aberto ao 0.0.0.0/0', 'Terraform state local commitado no Git', 'Secrets em variáveis de ambiente não encriptadas'].map(i => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400 py-0.5">
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

      {view === 'hardening' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="text-rose-400" size={20} /> Server Hardening, WAF (Fengarde) & Sentora Panel Security
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Proteção de servidores Linux, configuração de Web Application Firewalls (Fengarde/ModSecurity) e arquiteturas de painéis de controlo de alojamento seguro (Sentora).
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => runHardeningSim('ssh')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${hardeningAction === 'ssh' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'border-slate-800 text-slate-400'}`}
              >
                🔒 SSH & System Hardening
              </button>
              <button
                onClick={() => runHardeningSim('waf')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${hardeningAction === 'waf' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'border-slate-800 text-slate-400'}`}
              >
                🛡️ Fengarde WAF Rules
              </button>
              <button
                onClick={() => runHardeningSim('php')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${hardeningAction === 'php' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'border-slate-800 text-slate-400'}`}
              >
                ⚡ PHP & Sentora Sandbox
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
              <div className="text-slate-500">// Simulador de Hardening de Servidor</div>
              <div className={`p-3 rounded bg-slate-900 border border-slate-800 whitespace-pre-line ${hardeningRunning ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`}>
                {hardeningRunning ? 'A aplicar políticas de segurança e regras WAF...' : hardeningResult}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold text-slate-400 mb-2">Configurações de Hardening & WAF:</div>
              <Code code={HARDENING_CONFIG} lang="nginx.conf + modsecurity.conf + php.ini" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
