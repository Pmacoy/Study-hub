import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  GitBranch,
  Lock,
  FileCode,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Play,
  ArrowRight,
  Layers,
  Cpu,
  Server,
  Calculator,
  Zap,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';

type DevSecTab = 'pipeline' | 'remediation-lab' | 'cvss-calculator';

interface PipelineStage {
  id: string;
  name: string;
  tool: string;
  category: 'PRE-COMMIT' | 'SAST' | 'SCA' | 'IaC' | 'DAST' | 'RUNTIME';
  status: 'FAIL' | 'PASS' | 'IDLE';
  findingTitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  vulnerableCode: string;
  remediatedCode: string;
  explanation: string;
  remediationAction: string;
}

const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'secrets-gitleaks',
    name: 'Secrets Detection',
    tool: 'Gitleaks / Trufflehog',
    category: 'PRE-COMMIT',
    status: 'FAIL',
    findingTitle: 'Hardcoded AWS Access Key & Secret in source code',
    severity: 'CRITICAL',
    vulnerableCode: `// backend/src/config/aws.ts
export const s3Config = {
  region: "us-east-1",
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
};`,
    remediatedCode: `// backend/src/config/aws.ts (Remediado com AWS Secrets Manager / IAM Roles)
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Usando IAM Instance Profile / Pod Identity sem credenciais hardcoded
export const s3Config = {
  region: process.env.AWS_REGION || "us-east-1"
};`,
    explanation: 'Credenciais hardcoded no código podem ser expostas em logs, repositórios públicos ou acessadas por terceiros.',
    remediationAction: 'Remover credenciais do Git, revogar a chave no IAM e utilizar AWS Secrets Manager ou IAM Roles.'
  },
  {
    id: 'sast-semgrep',
    name: 'SAST Code Analysis',
    tool: 'Semgrep / SonarQube',
    category: 'SAST',
    status: 'FAIL',
    findingTitle: 'SQL Injection via string concatenation in query',
    severity: 'HIGH',
    vulnerableCode: `// backend/src/controllers/userController.ts
export async function getUser(req: Request, res: Response) {
  const userId = req.query.id;
  // Vulnerável a SQLi: ' OR '1'='1
  const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;
  const result = await db.query(query);
  res.json(result.rows);
}`,
    remediatedCode: `// backend/src/controllers/userController.ts (Remediado com Parameterized Queries)
export async function getUser(req: Request, res: Response) {
  const userId = req.query.id;
  // Query parametrizada segura contra injeção SQL
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [userId]);
  res.json(result.rows);
}`,
    explanation: 'A concatenação direta de dados vindos do usuário na consulta SQL permite desvio de autenticação e extração da base de dados inteira.',
    remediationAction: 'Utilizar queries parametrizadas (Prepared Statements) ou um ORM seguro.'
  },
  {
    id: 'sca-trivy',
    name: 'SCA Dependency Scan',
    tool: 'Trivy / Snyk',
    category: 'SCA',
    status: 'FAIL',
    findingTitle: 'CVE-2024-21319 em pacote jsonwebtoken (v8.5.1)',
    severity: 'HIGH',
    vulnerableCode: `// package.json
{
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "8.5.1" // CVE com risco de bypass de assinatura de token
  }
}`,
    remediatedCode: `// package.json (Remediado)
{
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2" // Versão corrigida e sem vulnerabilidades conhecidas
  }
}`,
    explanation: 'Bibliotecas desatualizadas contêm vulnerabilidades públicas catalogadas no NVD que podem ser exploradas por atacantes.',
    remediationAction: 'Atualizar a biblioteca para a versão 9.0.2 ou superior.'
  },
  {
    id: 'iac-checkov',
    name: 'IaC Security Scan',
    tool: 'Checkov / tfsec',
    category: 'IaC',
    status: 'FAIL',
    findingTitle: 'S3 Bucket público e Security Group aberto para 0.0.0.0/0 na porta 22 (SSH)',
    severity: 'HIGH',
    vulnerableCode: `# terraform/main.tf
resource "aws_s3_bucket" "data" {
  bucket = "company-sensitive-records"
  acl    = "public-read" # Vulnerável: Leitura anônima pública aberta
}

resource "aws_security_group_rule" "ssh" {
  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"] # Vulnerável: SSH exposto para a Internet
}`,
    remediatedCode: `# terraform/main.tf (Remediado com Bloqueio Público & VPN)
resource "aws_s3_bucket" "data" {
  bucket = "company-sensitive-records"
}

resource "aws_s3_bucket_public_access_block" "block" {
  bucket                  = aws_s3_bucket.data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_security_group_rule" "ssh" {
  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/16"] # Acesso SSH restrito à VPN corporativa
}`,
    explanation: 'Configurações de infraestrutura inseguras expõem dados para a internet e abrem portas administrativas para ataques de força bruta.',
    remediationAction: 'Habilitar S3 Public Access Block e restringir regras de firewall para CIDRs internos/VPN.'
  }
];

export default function DevSecOpsSimulator() {
  const [activeTab, setActiveTab] = useState<DevSecTab>('pipeline');
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<string>(INITIAL_PIPELINE_STAGES[0].id);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);

  // CVSS Calculator State
  const [cvssAV, setCvssAV] = useState<'N' | 'A' | 'L' | 'P'>('N'); // Attack Vector (Network, Adjacent, Local, Physical)
  const [cvssAC, setCvssAC] = useState<'L' | 'H'>('L'); // Attack Complexity (Low, High)
  const [cvssPR, setCvssPR] = useState<'N' | 'L' | 'H'>('N'); // Privileges Required (None, Low, High)
  const [cvssUI, setCvssUI] = useState<'N' | 'R'>('N'); // User Interaction (None, Required)
  const [cvssS, setCvssS] = useState<'U' | 'C'>('U'); // Scope (Unchanged, Changed)
  const [cvssC, setCvssC] = useState<'N' | 'L' | 'H'>('H'); // Confidentiality (None, Low, High)
  const [cvssI, setCvssI] = useState<'N' | 'L' | 'H'>('H'); // Integrity (None, Low, High)
  const [cvssA, setCvssA] = useState<'N' | 'L' | 'H'>('H'); // Availability (None, Low, High)

  const activeStage = pipelineStages.find(s => s.id === selectedStageId) || pipelineStages[0];

  function handleFixStage(stageId: string) {
    setPipelineStages(prev =>
      prev.map(s => (s.id === stageId ? { ...s, status: 'PASS' } : s))
    );
  }

  function handleResetPipeline() {
    setPipelineStages(INITIAL_PIPELINE_STAGES);
  }

  // Simple CVSS Score approximation formula
  function calculateCvssScore(): { score: number; severity: string; vector: string } {
    let base = 0;
    if (cvssAV === 'N') base += 3.8;
    else if (cvssAV === 'A') base += 2.5;
    else if (cvssAV === 'L') base += 1.8;
    else base += 0.8;

    if (cvssAC === 'L') base += 1.5; else base += 0.8;
    if (cvssPR === 'N') base += 2.0; else if (cvssPR === 'L') base += 1.2; else base += 0.5;
    if (cvssUI === 'N') base += 1.2; else base += 0.6;

    let impact = 0;
    if (cvssC === 'H') impact += 2.5; else if (cvssC === 'L') impact += 1.2;
    if (cvssI === 'H') impact += 2.5; else if (cvssI === 'L') impact += 1.2;
    if (cvssA === 'H') impact += 2.5; else if (cvssA === 'L') impact += 1.2;

    let rawScore = Math.min(10.0, Math.round(((base * 0.4) + (impact * 0.6)) * 10) / 10);
    if (impact === 0) rawScore = 0.0;

    let severity = 'LOW';
    if (rawScore >= 9.0) severity = 'CRITICAL';
    else if (rawScore >= 7.0) severity = 'HIGH';
    else if (rawScore >= 4.0) severity = 'MEDIUM';
    else if (rawScore > 0) severity = 'LOW';
    else severity = 'NONE';

    const vector = `CVSS:3.1/AV:${cvssAV}/AC:${cvssAC}/PR:${cvssPR}/UI:${cvssUI}/S:${cvssS}/C:${cvssC}/I:${cvssI}/A:${cvssA}`;
    return { score: rawScore, severity, vector };
  }

  const cvssResult = calculateCvssScore();
  const allStagesPassed = pipelineStages.every(s => s.status === 'PASS');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <GitBranch size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Shift-Left DevSecOps
              </span>
              <span className="text-xs text-slate-400 font-mono">CI/CD Security Pipeline</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">DevSecOps & Cloud Security</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Automação de segurança no pipeline CI/CD, remediação de código (SAST/IaC) e cálculo de métricas CVSS v3.1.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'pipeline'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <GitBranch size={14} />
            <span>Pipeline CI/CD</span>
          </button>
          <button
            onClick={() => setActiveTab('remediation-lab')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'remediation-lab'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <FileCode size={14} />
            <span>Remediation Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('cvss-calculator')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'cvss-calculator'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Calculator size={14} />
            <span>Calculadora CVSS</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: INTERACTIVE PIPELINE CI/CD ─────────────────────────────────── */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Pipeline Visual Bar */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="text-emerald-400" size={18} />
                <h2 className="text-sm font-bold text-white">Pipeline de Segurança Shift-Left</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPipeline}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pipelineStages.map((st, idx) => {
                const isSelected = st.id === selectedStageId;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStageId(st.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">Stage 0{idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {st.status === 'PASS' ? '✓ PASSED' : '❌ FAILED'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white truncate">{st.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{st.tool}</p>

                    <div className="mt-2 text-[10px] text-slate-500">
                      Categoria: <strong className="text-slate-300">{st.category}</strong>
                    </div>
                  </button>
                );
              })}
            </div>

            {allStagesPassed && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                <div>
                  <strong className="font-bold">Pipeline Verde! Todos os Security Gates Aprovados.</strong>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5">
                    O código foi escaneado, nenhum segredo ou vulnerabilidade crítica foi detectada e a imagem está liberada para Deploy em Produção.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Stage Details & Remediation Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{activeStage.category} · {activeStage.tool}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{activeStage.findingTitle}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    activeStage.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {activeStage.severity}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-red-400 block mb-1">Código com Vulnerabilidade Detectada:</label>
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-red-500/30 font-mono text-[11px] text-red-300 leading-relaxed overflow-x-auto">
                      {activeStage.vulnerableCode}
                    </pre>
                  </div>

                  {activeStage.status === 'PASS' && (
                    <div className="animate-fadeIn">
                      <label className="text-[11px] font-bold text-emerald-400 block mb-1">Código Remediado Seguro:</label>
                      <pre className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
                        {activeStage.remediatedCode}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <p className="text-xs text-slate-400 max-w-[70%]">
                    {activeStage.explanation}
                  </p>

                  {activeStage.status === 'FAIL' ? (
                    <button
                      onClick={() => handleFixStage(activeStage.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <Zap size={14} />
                      <span>Aplicar Fix Seguro</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 size={16} /> Remediado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Security Gates Theory & Best Practices */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 text-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock size={16} className="text-emerald-400" />
                  <span>Princípios de Shift-Left Security</span>
                </h3>

                <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-300">1. Pre-Commit:</strong> Bloquear commits locais que contenham chaves privadas, senhas ou tokens de API.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-300">2. SAST (Static Analysis):</strong> Varrer o código-fonte em busca de falhas lógicas (OWASP Top 10) sem executar a aplicação.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-300">3. SCA (Composition Analysis):</strong> Rastrear dependências de terceiros com CVEs conhecidas no ecossistema npm/pip/maven.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-300">4. IaC Security:</strong> Garantir que manifests Terraform, CloudFormation e Kubernetes sigam o princípio do menor privilégio.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: REMEDIATION LAB ────────────────────────────────────────────── */}
      {activeTab === 'remediation-lab' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode size={20} className="text-emerald-400" />
                <span>Laboratório de Remediação de Código Vulnerável</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Compare side-by-side a versão vulnerável com a versão protegida recomendada pelo time de DevSecOps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <XCircle size={14} />
                <span>Padrão Inseguro (Vulnerabilidade Detectada)</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-red-500/30 font-mono text-xs text-red-300 leading-relaxed overflow-x-auto">
{`// Exemplo: Express.js sem proteção de Headers
const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  res.json({ message: "No security headers configured" });
});`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 size={14} />
                <span>Padrão DevSecOps Remediado (Helmet + CSP)</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
{`// Exemplo: Proteção com Helmet e CSP Rigoroso
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet()); // HSTS, X-Frame-Options, No-Sniff
app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc: ["'self'"] }
}));`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CVSS V3.1 CALCULATOR ───────────────────────────────────────── */}
      {activeTab === 'cvss-calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator size={18} className="text-emerald-400" />
                  <span>Calculadora de Severidade CVSS v3.1</span>
                </h2>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Common Vulnerability Scoring System
                </span>
              </div>

              {/* Exploitability Metrics */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Métricas de Explorabilidade (Base Metrics)</h3>

                {/* Attack Vector */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Attack Vector (AV):</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                    {[
                      { id: 'N', label: 'Network (N)' },
                      { id: 'A', label: 'Adjacent (A)' },
                      { id: 'L', label: 'Local (L)' },
                      { id: 'P', label: 'Physical (P)' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setCvssAV(opt.id as any)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          cvssAV === opt.id ? 'bg-emerald-500 text-white font-bold border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attack Complexity & Privileges Required */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-semibold">Attack Complexity (AC):</label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'L', label: 'Low (L)' },
                        { id: 'H', label: 'High (H)' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setCvssAC(opt.id as any)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            cvssAC === opt.id ? 'bg-emerald-500 text-white font-bold border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-semibold">Privileges Required (PR):</label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'N', label: 'None (N)' },
                        { id: 'L', label: 'Low (L)' },
                        { id: 'H', label: 'High (H)' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setCvssPR(opt.id as any)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            cvssPR === opt.id ? 'bg-emerald-500 text-white font-bold border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Métricas de Impacto (CIA Triad)</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Confidentiality */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Confidencialidade (C):</label>
                    <div className="grid grid-cols-3 gap-1 font-mono">
                      {['N', 'L', 'H'].map(v => (
                        <button
                          key={v}
                          onClick={() => setCvssC(v as any)}
                          className={`p-1.5 rounded border text-center ${
                            cvssC === v ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Integrity */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Integridade (I):</label>
                    <div className="grid grid-cols-3 gap-1 font-mono">
                      {['N', 'L', 'H'].map(v => (
                        <button
                          key={v}
                          onClick={() => setCvssI(v as any)}
                          className={`p-1.5 rounded border text-center ${
                            cvssI === v ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Disponibilidade (A):</label>
                    <div className="grid grid-cols-3 gap-1 font-mono">
                      {['N', 'L', 'H'].map(v => (
                        <button
                          key={v}
                          onClick={() => setCvssA(v as any)}
                          className={`p-1.5 rounded border text-center ${
                            cvssA === v ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Calculated CVSS Score Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                Pontuação Base Calculada
              </span>

              <div className="py-2">
                <div className={`text-5xl font-black ${
                  cvssResult.severity === 'CRITICAL' ? 'text-red-400' :
                  cvssResult.severity === 'HIGH' ? 'text-amber-400' :
                  cvssResult.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {cvssResult.score.toFixed(1)}
                </div>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    cvssResult.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    cvssResult.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    cvssResult.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {cvssResult.severity}
                  </span>
                </div>
              </div>

              {/* Vector String Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 break-all text-left space-y-1">
                <div className="text-slate-500 font-bold">Vector String:</div>
                <div className="text-emerald-400">{cvssResult.vector}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
