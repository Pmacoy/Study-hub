# 🧠 Study Hub — Aprender resolvendo

Uma plataforma interactiva para engenheiros de Platform, DevOps e Cloud aprenderem através de **cenários reais** — não flashcards, não quizzes. Depurar pods em CrashLoopBackOff, investigar rotas BGP, escrever comandos num terminal simulado.

Feito para **quem aprende a fazer**, não a decorar.

![Zero errors](https://img.shields.io/badge/typescript-strict-blue) ![Vite](https://img.shields.io/badge/vite-6.0-purple) ![Tailwind](https://img.shields.io/badge/tailwind-3.4-06B6D4) ![React](https://img.shields.io/badge/react-18-61DAFB)

## O que tem

### 🎯 Cenários guiados
Problemas reais que aparecem em produção. Recebes o contexto (logs, `describe`, métricas), decides o próximo passo, recebes feedback imediato e um post-mortem no fim com prevenções.

- **Pod em CrashLoopBackOff** (Kubernetes · mid) — investigar OOMKilled
- **VPN Gateway BGP não propaga rotas** (Azure · senior) — troubleshoot híbrido
- **DNS interno resolve, externo não** (Redes · mid) — CoreDNS + Azure Private Resolver
- **Script Python subprocess pendurado** (Python · mid) — pipe deadlock

### 🖥️ Terminal simulado
Shell interactivo com parser flexível que aceita variações (`kubectl get pods` = `kubectl get po`) e sugere se te aproximares (`kubectl get pd` → "Talvez quisesses dizer: kubectl get pods?").

- **kubectl** — investigar CrashLoopBackOff (get → describe → logs → top)
- **bash** — disco a 98%, achar o culpado sem `rm -rf` cego
- **az CLI** — quem tem acesso ao Key Vault via RBAC?

Tem histórico com `↑`/`↓`, comandos `hint`, `help`, `objectives`, teaching notes contextuais e um debrief no fim.

### 🔥 Gamificação
- **Streak diário** (Duolingo-style) com calendário semanal
- **Sessão Diária** com 3 passos: Questões do Dia, Cartões Relâmpago, Estudo Livre
- **Índice de Progresso** — score composto (Cobertura + Consistência + Desempenho)
- Progresso persistido em `localStorage`

### 📚 6 domínios de conteúdo

| Domínio | Módulos | Simulados |
|---|---|---|
| **Platform & DevOps Engineering** | 12 (Linux, Docker, K8s, CI/CD, Terraform, IDP/Backstage, Golden Paths, DORA/DevEx…) | 20Q exam |
| **Microsoft Azure** | AZ-104 (8 módulos, 507 questões) · AZ-305 em construção | ✓ |
| **AWS** | SAA-C03 em construção | soon |
| **Google Cloud** | ACE · PCA em construção | soon |
| **Redes** | 6 módulos (OSI, TCP/IP, DNS, VPN, routing, security) | — |
| **Python para DevOps** | 6 módulos (fundamentos → OOP → generators → boto3/azure-sdk) | ✓ |

## Stack

- **React 18** + **TypeScript** (strict) + **Vite**
- **Tailwind CSS** com dark theme custom
- **lucide-react** para ícones
- Zero backend, zero tracking — tudo em `localStorage`

## Correr localmente

```bash
git clone https://github.com/YOUR_USERNAME/study-hub
cd study-hub
npm install
npm run dev
# abre http://localhost:5173
```

## Deploy

```bash
npm run build
# dist/ pode ir directo para Vercel, Netlify, GitHub Pages, S3+CloudFront...
```

## Arquitectura

```
src/
├── App.tsx                          # router de domínios + gamificação
├── types/                           # domain models (Scenario, TerminalSession, ...)
├── data/
│   ├── scenarios/                   # 4 cenários guiados
│   ├── terminal/                    # 3 sessões de terminal
│   ├── flashcards/                  # ~119 cartões cross-domain
│   ├── azure/                       # knowledgeBase + 507 questões AZ-104
│   └── ...
├── hooks/                           # useDailyState, useActivityLog, useScenarioAttempts, ...
├── components/
│   ├── scenarios/GuidedScenarioPlayer.tsx
│   ├── terminal/TerminalPlayer.tsx  # parser flexível + histórico
│   ├── shared/                      # DailySessionCard, ProgressIndexCard, ...
│   ├── devops/                      # 12 simuladores de módulo
│   ├── azure/                       # 8 simuladores AZ-104
│   ├── networking/                  # 6 módulos com IP calc, subnet tree, TCP...
│   └── python/                      # 6 módulos Python
└── utils/
    ├── commandParser.ts             # tokenizer + flag parser + fuzzy match
    └── ip-math.ts                   # subnet, CIDR, broadcast helpers
```

## Como adicionar um cenário guiado

Cria `src/data/scenarios/myScenario.ts`:

```ts
import type { Scenario } from '../../types/scenario';

export const myScenario: Scenario = {
  id: 'my-scenario',
  domain: 'devops',
  format: 'guided',
  title: 'O título curto',
  hook: 'A história — "são 3 da manhã, o Slack explode..."',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['kubernetes', 'debug'],
  contextArtifacts: [/* … */],
  progressiveArtifacts: [/* logs, outputs revelados por decisões */],
  steps: [
    {
      id: 'step-1',
      prompt: 'Qual é o primeiro comando?',
      options: [
        { id: 'a', label: 'kubectl get pods', correct: true, feedback: '...' },
        { id: 'b', label: 'kubectl delete', correct: false, feedback: '...' },
      ],
    },
  ],
  resolution: { rootCause: '…', fix: '…', preventions: ['…'] },
};
```

Adiciona ao `src/data/scenarios/index.ts` e está.

## Como adicionar uma sessão de terminal

Igual estrutura em `src/data/terminal/myShellSession.ts` — cada `handler` define aliases de tokens e um output (estático ou função dos flags). O parser encontra melhor match ou sugere se estiver perto.

## Contribuir

PRs são bem-vindos! Boas contribuições:

- Novos cenários (especialmente AWS, GCP, redes, incidentes históricos famosos)
- Novas sessões de terminal (git flow complicado, jq/kubectl combos, aws CLI)
- Traduções (só existe pt-PT actualmente)
- Correcções técnicas — se um comando `kubectl` no simulador não bate com o real, abre issue

## Licença

MIT — vai fazer bom uso.

## Roadmap

- [ ] Arquitectura interactiva (drag-and-drop de componentes cloud)
- [ ] Post-mortem / incident investigation (logs completos, achar a causa)
- [ ] Mais cenários AWS e GCP
- [ ] Modo colaborativo (partilhar progresso com um team)
- [ ] Export do progresso em Markdown (portfolio)

---

*Feito por uma pessoa que aprende melhor com um terminal e um problema real do que com slides.*
