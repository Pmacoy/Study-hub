# 🧠 Study Hub — Learn by solving

*[Versão em português](README.pt.md)*

An interactive platform for Platform, DevOps and Cloud engineers who learn by **debugging real problems** — not by answering multiple-choice quizzes. Investigate pods stuck in CrashLoopBackOff, trace BGP routes that won't propagate, type real commands in a simulated terminal.

Built for people who learn by **doing**, not memorising.

![TypeScript strict](https://img.shields.io/badge/typescript-strict-blue) ![Vite](https://img.shields.io/badge/vite-6.0-purple) ![Tailwind](https://img.shields.io/badge/tailwind-3.4-06B6D4) ![React](https://img.shields.io/badge/react-18-61DAFB)

> **Language note:** the interface is available in English and Portuguese.
> Study modules, scenarios and question banks are currently written in Portuguese —
> translation is in progress.

---

## What's inside

### 🎯 Guided scenarios
Real production incidents. You get the context — logs, `kubectl describe`, Grafana metrics — decide the next step, and receive immediate feedback. Each ends with a post-mortem covering root cause and preventions.

Eleven scenarios, including eight Kubernetes ones built from documented production failures: CrashLoopBackOff with OOMKilled, ImagePullBackOff on a private registry, PVC stuck Pending, Ingress 502, RBAC Forbidden, liveness probe loops, node disk pressure evictions, and a full 2 AM incident-response drill.

### 🖥️ Simulated terminal
An interactive shell with a forgiving parser: `kubectl get pods`, `kubectl get po` and `--namespace` vs `-n` all work. Miss slightly and it suggests. Type `hint` for progressive hints.

Eight sessions covering Linux troubleshooting (disk full, OOM, disk I/O saturation, port not listening, DNS failure, high CPU), kubectl debugging, and Azure CLI RBAC investigation.

### 🎯 Skill diagnostic
Twelve self-assessment questions across the competencies that hold up a Platform Engineer. Produces a radar map, identifies your four priority gaps, and links each one directly to the relevant module. Every area includes a concrete *mastery signal* — a testable criterion, not a vague goal.

### 🗺️ Learning paths
Five certification paths with real progress tracking. A node only turns green when you've visited the module **and** completed its scenarios and terminal sessions above threshold.

### 🚀 Portfolio track
Fifty DevOps projects organised in five sections, from a shell-script website monitor to end-to-end DevSecOps pipelines. Track status and store your repo link for each.

### 💬 Interview preparation
Two levels: 100 quick-revision questions, and 303 in-depth questions across 27 modules. Plus a technique section covering how to answer — golden rules, mistakes to avoid across six dimensions, phrases that hurt vs phrases that help, and a pre-interview checklist.

### 📚 Curated library
Thirty-three GitHub repositories worth your time, organised by category, each with why it matters and who it's for.

### 🔥 Daily streak
Duolingo-style consistency tracking with a composite progress index.

---

## Domains covered

| Domain | Content |
|---|---|
| **Platform & DevOps** | 16 modules — Linux, Docker, Kubernetes, Helm, CI/CD, Terraform, CloudFormation, monitoring, DevSecOps, FinOps, MLOps, IDP/Backstage, DORA/DevEx |
| **Microsoft Azure** | AZ-104 with 507 questions and 16 official Microsoft lab links · AZ-305 planned |
| **AWS** | SAA-C03 with 6 modules and 118 questions (20 scenario-based) |
| **Google Cloud** | ACE achieved · PCA planned |
| **Networking** | 6 modules — OSI, TCP/IP, DNS, VPN, routing, security |
| **Python for DevOps** | 6 modules — fundamentals through boto3 and azure-sdk |

---

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · lucide-react

No backend. No tracking. Everything persists in `localStorage`.

## Running locally

```bash
git clone https://github.com/Pmacoy/Study-hub
cd Study-hub
npm install
npm run dev
```

Open http://localhost:5173

## Deploying

```bash
npm run build
```

The `dist/` folder is static — deploy it to Vercel, Netlify, GitHub Pages, S3 + CloudFront, or anywhere else.

---

## Project structure

```
src/
├── App.tsx                 # domain routing + gamification state
├── i18n/                   # language context and dictionary
├── types/                  # domain models
├── data/
│   ├── scenarios/          # 11 guided scenarios
│   ├── terminal/           # 8 terminal sessions
│   ├── azure/              # AZ-104 content, 507 questions, official labs
│   ├── aws/                # SAA-C03 content and question bank
│   ├── projects.ts         # 50 portfolio projects
│   ├── advancedInterview.ts # 303 in-depth interview questions
│   └── curatedRepos.ts     # 33 recommended repositories
├── hooks/                  # persistence and progress tracking
├── components/
│   ├── scenarios/          # guided scenario player
│   ├── terminal/           # terminal with flexible command parser
│   ├── diagnostic/         # skill self-assessment
│   ├── interview/          # question banks and technique
│   └── ...                 # per-domain module simulators
└── utils/
    ├── commandParser.ts    # tokenizer, flag parsing, fuzzy matching
    └── ip-math.ts          # subnet and CIDR helpers
```

## Adding a guided scenario

Create `src/data/scenarios/myScenario.ts`:

```ts
import type { Scenario } from '../../types/scenario';

export const myScenario: Scenario = {
  id: 'my-scenario',
  domain: 'devops',
  format: 'guided',
  title: 'Short title',
  hook: 'The story — "it is 3 AM and Slack is on fire..."',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['kubernetes', 'debug'],
  contextArtifacts: [/* what you see up front */],
  progressiveArtifacts: [/* revealed by correct decisions */],
  steps: [
    {
      id: 'step-1',
      prompt: 'What is your first command?',
      options: [
        { id: 'a', label: 'kubectl get pods', correct: true, feedback: '...' },
        { id: 'b', label: 'kubectl delete pod', correct: false, feedback: '...' },
      ],
      teachingNote: 'The principle behind the right answer.',
    },
  ],
  resolution: { rootCause: '…', fix: '…', preventions: ['…'] },
};
```

Register it in `src/data/scenarios/index.ts` and it appears in the hub.

## Contributing

Pull requests welcome. Particularly useful:

- New scenarios, especially AWS, GCP, and networking incidents you've actually hit
- New terminal sessions (git workflows, jq pipelines, aws CLI)
- Translations — the interface is bilingual, the content is not yet
- Technical corrections — if a simulated command doesn't match real behaviour, open an issue

## Licence

MIT.

---

*Built by engineers who learn better from a terminal and a real problem than from slides.*
