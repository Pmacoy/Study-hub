import { useState } from 'react';
import { Copy, Check, ChevronRight } from 'lucide-react';

type View = 'concepts' | 'github-actions' | 'jenkins' | 'stages';

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
        {code.split('\n').map((line, i) => <div key={i} className={line.startsWith('#') ? 'text-slate-600' : line.match(/^(name|on|jobs|steps|uses|run|with|env|if|needs|permissions|strategy|matrix):/) ? 'text-sky-300' : line.match(/^\s+(name|on|jobs|steps|uses|run|with|env|if|needs|permissions|strategy|matrix):/) ? 'text-violet-300' : 'text-slate-300'}>{line}</div>)}
      </pre>
    </div>
  );
}

const GHA_PIPELINE = `# .github/workflows/ci-cd.yml — Pipeline completo DevSecOps
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

permissions:
  id-token: write    # OIDC — sem secrets estáticos
  contents: read
  security-events: write

jobs:
  # ── STAGE 1: Build & Test ─────────────────────────
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4

  # ── STAGE 2: Security Scanning ────────────────────
  security-scan:
    runs-on: ubuntu-latest
    needs: build-test
    steps:
      - uses: actions/checkout@v4

      - name: SonarQube Scan (SAST)
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}

      - name: Build Docker image
        run: docker build -t app:ci .

      - name: Trivy — container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: app:ci
          exit-code: '1'
          severity: CRITICAL,HIGH

  # ── STAGE 3: Build & Push Image ───────────────────
  build-push:
    runs-on: ubuntu-latest
    needs: security-scan
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Authenticate GCP (OIDC)
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: \${{ secrets.GCP_WIF_PROVIDER }}
          service_account: deploy-sa@project.iam.gserviceaccount.com

      - name: Push to Artifact Registry
        run: |
          docker build -t europe-west1-docker.pkg.dev/proj/app:\$\{{ github.sha }} .
          docker push europe-west1-docker.pkg.dev/proj/app:\$\{{ github.sha }}

  # ── STAGE 4: Deploy (with approval) ───────────────
  deploy-prod:
    runs-on: ubuntu-latest
    needs: build-push
    environment: production   # requer aprovação manual
    steps:
      - name: Deploy to GKE
        run: |
          gcloud container clusters get-credentials prod-cluster
          kubectl set image deployment/app \\\\
            app=europe-west1-docker.pkg.dev/proj/app:\$\{{ github.sha }} \\\\
            -n prod
          kubectl rollout status deployment/app -n prod`;

const JENKINS_PIPELINE = `// Jenkinsfile — Pipeline declarativo com stages
pipeline {
  agent { label 'linux' }

  environment {
    IMAGE = "myapp:\${BUILD_NUMBER}"
    REGISTRY = "registry.empresa.com"
    SONAR_TOKEN = credentials('sonar-token')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git log --oneline -5'
      }
    }

    stage('Build') {
      steps {
        sh 'mvn clean package -DskipTests'
        archiveArtifacts artifacts: 'target/*.jar'
      }
    }

    stage('Test') {
      parallel {
        stage('Unit Tests') {
          steps { sh 'mvn test' }
          post { always { junit 'target/surefire-reports/*.xml' } }
        }
        stage('SonarQube') {
          steps {
            withSonarQubeEnv('SonarQube') {
              sh 'mvn sonar:sonar'
            }
          }
        }
      }
    }

    stage('Build & Scan Image') {
      steps {
        sh "docker build -t \${IMAGE} ."
        sh "trivy image --exit-code 1 --severity CRITICAL \${IMAGE}"
        sh "docker tag \${IMAGE} \${REGISTRY}/\${IMAGE}"
        sh "docker push \${REGISTRY}/\${IMAGE}"
      }
    }

    stage('Deploy STG') {
      steps {
        sh "kubectl set image deploy/app app=\${REGISTRY}/\${IMAGE} -n staging"
        sh "kubectl rollout status deploy/app -n staging --timeout=120s"
      }
    }

    stage('Deploy PROD') {
      when { branch 'main' }
      input { message "Deploy para PROD?" }
      steps {
        sh "kubectl set image deploy/app app=\${REGISTRY}/\${IMAGE} -n prod"
        sh "kubectl rollout status deploy/app -n prod"
      }
    }
  }

  post {
    failure { slackSend color: 'danger', message: "Pipeline FALHOU: \${JOB_NAME} #\${BUILD_NUMBER}" }
    success { slackSend color: 'good',   message: "Deploy concluído: \${JOB_NAME} #\${BUILD_NUMBER}" }
  }
}`;

const PIPELINE_STAGES = [
  { stage: 'Source', icon: '📥', color: 'slate', items: ['git clone / checkout', 'Webhook trigger', 'Branch/tag filtering', 'Change detection'] },
  { stage: 'Build', icon: '🔨', color: 'sky', items: ['Compile (Maven/NPM/Go)', 'Unit tests', 'Code coverage', 'Artefacto (.jar/.whl/dist)'] },
  { stage: 'SAST', icon: '🔬', color: 'amber', items: ['SonarQube análise', 'Quality Gate (falha se < threshold)', 'Dependency check (OWASP)', 'License compliance'] },
  { stage: 'Image', icon: '🐳', color: 'violet', items: ['docker build multi-stage', 'Trivy scan (CRITICAL → fail)', 'Tag com commit SHA', 'Push para registry'] },
  { stage: 'DAST', icon: '🕵️', color: 'rose', items: ['Deploy em ambiente efémero', 'OWASP ZAP scan', 'API fuzzing', 'Destroy ambiente'] },
  { stage: 'Deploy STG', icon: '🚦', color: 'teal', items: ['Helm upgrade / kubectl apply', 'Smoke tests automáticos', 'Performance baseline', 'Notificação equipa'] },
  { stage: 'Aprovação', icon: '✅', color: 'amber', items: ['Manual approval gate', '2 reviewers obrigatórios', 'Environment protection', 'JIRA ticket required'] },
  { stage: 'Deploy PROD', icon: '🚀', color: 'emerald', items: ['Canary 5% → métricas → 100%', 'Rollback automático (error rate)', 'Health checks pós-deploy', 'Notificação stakeholders'] },
];

export default function CiCdSimulator() {
  const [view, setView] = useState<View>('stages');
  const [tool, setTool] = useState<'github-actions' | 'jenkins'>('github-actions');

  const views = [
    { id: 'stages' as View, label: '🔄 Pipeline Stages' },
    { id: 'github-actions' as View, label: '⚡ GitHub Actions' },
    { id: 'jenkins' as View, label: '🤵 Jenkins' },
    { id: 'concepts' as View, label: '📚 Conceitos' },
  ];

  const colorMap: Record<string, string> = {
    slate: 'border-slate-700 bg-slate-800/50 text-slate-400',
    sky: 'border-sky-500/30 bg-sky-500/8 text-sky-400',
    amber: 'border-amber-500/30 bg-amber-500/8 text-amber-400',
    violet: 'border-violet-500/30 bg-violet-500/8 text-violet-400',
    rose: 'border-rose-500/30 bg-rose-500/8 text-rose-400',
    teal: 'border-teal-500/30 bg-teal-500/8 text-teal-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/8 text-emerald-400',
  };

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

      {view === 'stages' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PIPELINE_STAGES.map((s, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${colorMap[s.color]}`}>
              <div className="text-xl mb-2">{s.icon}</div>
              <div className={`text-[11px] font-black uppercase mb-2 ${colorMap[s.color].split(' ')[2]}`}>{s.stage}</div>
              {s.items.map(item => (
                <div key={item} className="flex items-start gap-1.5 text-[10px] text-slate-500 py-0.5">
                  <ChevronRight size={9} className={`${colorMap[s.color].split(' ')[2]} mt-0.5 shrink-0`} />{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === 'github-actions' && <Code code={GHA_PIPELINE} lang=".github/workflows/ci-cd.yml" />}
      {view === 'jenkins' && <Code code={JENKINS_PIPELINE} lang="Jenkinsfile" />}

      {view === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'CI vs CD vs CD', c: 'sky', items: ['CI: merge + build + test automáticos em cada commit', 'Continuous Delivery: código sempre deployável, deploy manual', 'Continuous Deployment: deploy automático para produção', 'O nível 3 requer testes muito sólidos e feature flags'] },
            { t: 'OIDC — Sem Secrets Estáticos', c: 'violet', items: ['GitHub → OIDC token → Cloud Provider IAM', 'Sem AWS_ACCESS_KEY, sem service account keys', 'Token de curta duração (15 min) por pipeline run', 'Suportado: AWS, Azure, GCP, HashiCorp Vault'] },
            { t: 'Quality Gates', c: 'amber', items: ['SonarQube: cobertura ≥ 80%, zero bugs bloqueadores', 'Trivy: zero vulns CRITICAL na imagem Docker', 'Test pass rate: 100% (zero testes a falhar)', 'Performance: p95 latency não regride > 10%'] },
            { t: 'Ferramentas por Stage', c: 'emerald', items: ['SAST: SonarQube, Checkmarx, Semgrep', 'SCA: Trivy, Snyk, OWASP Dependency Check', 'DAST: OWASP ZAP, Burp Suite Enterprise', 'Secrets: GitLeaks, TruffleHog'] },
          ].map(g => (
            <div key={g.t} className={`p-5 rounded-2xl border ${g.c === 'sky' ? 'border-sky-500/20 bg-sky-500/5' : g.c === 'violet' ? 'border-violet-500/20 bg-violet-500/5' : g.c === 'amber' ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
              <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${g.c === 'sky' ? 'text-sky-400' : g.c === 'violet' ? 'text-violet-400' : g.c === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>{g.t}</div>
              {g.items.map(i => <div key={i} className="flex items-start gap-2 text-[12px] text-slate-400 py-1"><ChevronRight size={11} className={`${g.c === 'sky' ? 'text-sky-500' : g.c === 'violet' ? 'text-violet-500' : g.c === 'amber' ? 'text-amber-500' : 'text-emerald-500'} shrink-0 mt-0.5`} />{i}</div>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
