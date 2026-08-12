export interface CuratedRepo {
  name: string;
  url: string;
  desc: string;
  why: string;
  bestFor: string;
}

export interface RepoCategory {
  id: string;
  title: string;
  emoji: string;
  repos: CuratedRepo[];
}

// Repositórios curados de "Best GitHub Repositories to Prepare for DevOps"
// (DevOps Shack, Junho 2026). Descrições no original em inglês.

export const REPO_CATEGORIES: RepoCategory[] = [
  {
    id: 'roadmaps',
    title: 'Roadmaps e percursos',
    emoji: '🗺️',
    repos: [
      {
        name: 'kamranahmedse/developer-roadmap',
        url: 'https://github.com/kamranahmedse/developer-roadmap',
        desc: '• One of the most-starred repositories on GitHub Interactive, visual roadmaps for DevOps, backend, frontend, AI, and more — the de facto starting point for structuring any tech learning journey.',
        why: 'It eliminates tutorial-hell by showing exactly what to learn and in what order, with a dedicated DevOps roadmap covering OS fundamentals, networking, containerization, CI/CD, IaC, and monitoring in one visual map.',
        bestFor: 'Anyone starting their DevOps journey or planning a 6–12 month structured study plan.',
      },
      {
        name: 'bregman-arie/devops-resources',
        url: 'https://github.com/bregman-arie/devops-resources',
        desc: 'A comprehensive, opinionated guide covering Linux, Jenkins, AWS, Kubernetes, Terraform, SRE, and more, with a recommended learning path for beginners.',
        why: 'Unlike link-dump awesome-lists, this repo gives an opinionated order of topics so beginners do not burn out trying to learn everything simultaneously.',
        bestFor: 'Beginners who want a no-nonsense, sequenced path rather than an overwhelming list of links.',
      },
      {
        name: 'bregman-arie/devops-exercises',
        url: 'https://github.com/bregman-arie/devops-exercises',
        desc: 'Thousands of DevOps and SRE interview questions and hands-on exercises covering Linux, networking, Kubernetes, Docker, Python, Git, and system design.',
        why: 'This is widely regarded as the single best free interview-preparation repository for DevOps roles, with real questions asked at real companies.',
        bestFor: 'Interview preparation and self-assessment before applying for DevOps or SRE roles.',
      },
    ],
  },
  {
    id: 'linux',
    title: 'Linux e shell',
    emoji: '🐧',
    repos: [
      {
        name: 'trimstray/the-book-of-secret-knowledge',
        url: 'https://github.com/trimstray/the-book-of-secret-knowledge',
        desc: 'A massive collection of command-line tricks, security tools, terminal utilities, and operational tips used daily by experienced engineers.',
        why: 'It compresses years of operational tribal knowledge — debugging tricks, one- liners, and tool recommendations — into a single reference.',
        bestFor: 'Engineers who already know the basics and want to level up their day-to-day terminal efficiency.',
      },
      {
        name: 'trimstray/test-your-sysadmin-skills',
        url: 'https://github.com/trimstray/test-your-sysadmin-skills',
        desc: '284 real-world test questions and answers for Linux system administration, ideal for interview practice or self-assessment.',
        why: 'It is structured exactly like a real sysadmin or Linux DevOps interview, helping you find gaps in fundamentals before an employer does.',
        bestFor: 'Self-testing Linux fundamentals before interviews.',
      },
      {
        name: 'HariSekhon/DevOps-Bash-tools',
        url: 'https://github.com/HariSekhon/DevOps-Bash-tools',
        desc: 'Over a thousand production-grade Bash scripts and one-liners for automation, monitoring, Docker, Kubernetes, CI/CD, and cloud APIs.',
        why: 'Reading real, battle-tested Bash teaches scripting patterns far better than toy tutorials — these scripts are used in real pipelines.',
        bestFor: 'Engineers who want to see what production-quality shell scripting actually looks like.',
      },
      {
        name: 'jlevy/the-art-of-command-line',
        url: 'https://github.com/jlevy/the-art-of-command-line',
        desc: 'A widely-loved, concise reference of command-line tips ranging from beginner basics to advanced one-liners.',
        why: 'It is one of the most efficient single documents for closing command-line knowledge gaps quickly.',
        bestFor: 'A fast refresher or first-pass read for anyone new to the terminal.',
      },
    ],
  },
  {
    id: 'containers',
    title: 'Containers e Kubernetes',
    emoji: '🐳',
    repos: [
      {
        name: 'kubernetes/kubernetes',
        url: 'https://github.com/kubernetes/kubernetes',
        desc: 'The official Kubernetes source code — the project itself, not just documentation about it.',
        why: 'Reading the actual source, issues, and design proposals gives a depth of understanding that no course can replace, especially for troubleshooting and certification exams.',
        bestFor: 'Engineers preparing for CKA/CKS certifications or aiming for deep platform- engineering roles.',
      },
      {
        name: 'techiescamp/devops-projects',
        url: 'https://github.com/techiescamp/devops-projects',
        desc: 'A large, actively maintained collection of real-world DevOps projects from beginner to advanced, covering Docker, Kubernetes, CI/CD, Terraform, and cloud-native tooling.',
        why: 'It is structured specifically around 2026-relevant skills like Kubernetes certification prep (CKA, CKAD, CKS, KCNA) and cloud-native observability, mirroring what companies hire for right now.',
        bestFor: 'Building a hands-on project portfolio that demonstrates real production skills.',
      },
      {
        name: 'NotHarshhaa/DevOps-Projects',
        url: 'https://github.com/NotHarshhaa/DevOps-Projects',
        desc: 'A categorized library of real-world DevOps and cloud projects spanning AWS, Kubernetes, Docker, CI/CD, and Terraform, with a companion website interface.',
        why: 'It shows how DevOps integrates with adjacent disciplines like machine learning deployment and VPC network design, which is increasingly expected of senior engineers.',
        bestFor: 'Engineers who want categorized, browsable projects rather than a flat file list.',
      },
      {
        name: 'wsargent/docker-cheat-sheet',
        url: 'https://github.com/wsargent/docker-cheat-sheet',
        desc: 'A concise, well-organized cheat sheet covering every common Docker command and concept.',
        why: 'It is the fastest possible reference for Docker syntax while you are building muscle memory.',
        bestFor: 'Quick lookups while practicing Docker daily.',
      },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD e automação',
    emoji: '⚙️',
    repos: [
      {
        name: 'jenkinsci/jenkins',
        url: 'https://github.com/jenkinsci/jenkins',
        desc: 'The official Jenkins automation server source repository.',
        why: 'Jenkins remains the most widely deployed CI/CD server in enterprise environments; understanding its plugin architecture and pipeline syntax is still a core hiring requirement.',
        bestFor: 'Engineers targeting enterprise environments still standardized on Jenkins.',
      },
      {
        name: 'actions/starter-workflows',
        url: 'https://github.com/actions/starter-workflows',
        desc: 'GitHub\'s official collection of starter CI/CD workflow templates for nearly every language and framework.',
        why: 'It is the fastest way to see idiomatic, production-ready GitHub Actions YAML for build, test, and deploy stages across stacks.',
        bestFor: 'Learning correct GitHub Actions syntax by example rather than from scratch.',
      },
      {
        name: 'christianlempa/cheat-sheets',
        url: 'https://github.com/christianlempa/cheat-sheets',
        desc: 'Clean, practical cheat sheets covering Docker, Kubernetes, Terraform, Ansible, GitHub Actions, and other DevOps tools.',
        why: 'Each sheet is built from real homelab and production usage rather than copied documentation, making the examples genuinely practical.',
        bestFor: 'Fast syntax references while building your own pipelines.',
      },
    ],
  },
  {
    id: 'iac',
    title: 'Infrastructure as Code',
    emoji: '🏗️',
    repos: [
      {
        name: 'hashicorp/terraform',
        url: 'https://github.com/hashicorp/terraform',
        desc: 'The official Terraform source code, the most widely adopted IaC tool in the industry.',
        why: 'Understanding how the Terraform core, state management, and provider plugin system work under the hood massively improves your debugging ability in real projects.',
        bestFor: 'Engineers who want to go beyond basic `terraform apply` and understand state and plan internals.',
      },
      {
        name: 'terraform-aws-modules/terraform-aws-vpc',
        url: 'https://github.com/terraform-aws-modules/terraform-aws-vpc',
        desc: 'A production-grade, reusable Terraform module for provisioning AWS VPC networking — one of the most depended-upon modules in the Terraform Registry.',
        why: 'Reading a widely-used, battle-tested module teaches you proper module structure, variable design, and output patterns that hold up at enterprise scale.',
        bestFor: 'Learning how professional, reusable Terraform modules are structured.',
      },
      {
        name: 'pulumi/pulumi',
        url: 'https://github.com/pulumi/pulumi',
        desc: 'Infrastructure as Code using real general-purpose programming languages such as TypeScript, Python, and Go instead of a DSL.',
        why: 'It represents a growing alternative approach to IaC that is increasingly asked about in interviews, especially at companies with strong software-engineering cultures.',
        bestFor: 'Developers who prefer writing infrastructure in a language they already know rather than HCL.',
      },
    ],
  },
  {
    id: 'config',
    title: 'Gestão de configuração',
    emoji: '🔧',
    repos: [
      {
        name: 'ansible/ansible',
        url: 'https://github.com/ansible/ansible',
        desc: 'The official Ansible automation engine source code.',
        why: 'Ansible remains the most beginner-friendly configuration management tool, and reading its source clarifies exactly how modules and playbooks execute under the hood.',
        bestFor: 'Understanding Ansible internals beyond just writing YAML playbooks.',
      },
      {
        name: 'ansible/ansible-examples',
        url: 'https://github.com/ansible/ansible-examples',
        desc: 'Official real-world Ansible playbook examples for provisioning, configuration, and multi-tier application deployment.',
        why: 'These are the canonical examples referenced throughout Ansible\'s own documentation, showing idiomatic role and playbook structure.',
        bestFor: 'Learning correct playbook and role architecture by example.',
      },
    ],
  },
  {
    id: 'cloud',
    title: 'Plataformas cloud',
    emoji: '☁️',
    repos: [
      {
        name: 'donnemartin/system-design-primer',
        url: 'https://github.com/donnemartin/system-design-primer',
        desc: 'An exhaustive guide to designing large-scale, distributed systems, with flashcards, diagrams, and interview-style questions.',
        why: 'Cloud and DevOps interviews increasingly include system-design rounds; this repository is the most cited free resource for that preparation.',
        bestFor: 'Senior DevOps, SRE, or Cloud Architect interview preparation.',
      },
      {
        name: 'localstack/localstack',
        url: 'https://github.com/localstack/localstack',
        desc: 'A fully functional local AWS cloud stack you can run on your own machine for development and testing.',
        why: 'It lets you practice AWS services like S3, Lambda, and DynamoDB without incurring cloud costs, which is invaluable while learning.',
        bestFor: 'Practicing AWS automation and IaC without a real AWS bill. NotHarshhaa/DevOps-Projects (AWS Projects companion repo) https://github.com/NotHarshhaa A dedicated companion collection',
      },
    ],
  },
  {
    id: 'gitops',
    title: 'GitOps',
    emoji: '🔄',
    repos: [
      {
        name: 'argoproj/argo-cd',
        url: 'https://github.com/argoproj/argo-cd',
        desc: 'A declarative, GitOps continuous-delivery tool for Kubernetes, and one of the most in-demand GitOps tools in the industry.',
        why: 'GitOps is now a standard expectation for Kubernetes-based delivery pipelines, and Argo CD is the most widely adopted implementation.',
        bestFor: 'Engineers building or maintaining Kubernetes delivery pipelines.',
      },
      {
        name: 'fluxcd/flux2',
        url: 'https://github.com/fluxcd/flux2',
        desc: 'A CNCF GitOps toolkit for keeping Kubernetes clusters in sync with sources such as Git repositories and Helm repositories.',
        why: 'Flux is the alternative leading GitOps tool to Argo CD, and many job postings specify a preference for one or the other — knowing both is a strong signal.',
        bestFor: 'Engineers who want CNCF-graduated, highly modular GitOps tooling.',
      },
    ],
  },
  {
    id: 'observability',
    title: 'Monitorização e observabilidade',
    emoji: '📊',
    repos: [
      {
        name: 'grafana/grafana',
        url: 'https://github.com/grafana/grafana',
        desc: 'The open observability platform for visualizing metrics, logs, and traces from virtually any data source.',
        why: 'Grafana dashboards are the visual layer behind almost every production monitoring stack, and being able to build and read them is a core DevOps skill.',
        bestFor: 'Anyone responsible for production monitoring and incident dashboards.',
      },
      {
        name: 'prometheus/prometheus',
        url: 'https://github.com/prometheus/prometheus',
        desc: 'The leading open-source systems monitoring and alerting toolkit, and a CNCF graduated project.',
        why: 'Prometheus\'s pull-based metrics model and PromQL query language underpin most modern Kubernetes monitoring stacks.',
        bestFor: 'Building real Kubernetes-native monitoring and alerting pipelines.',
      },
    ],
  },
  {
    id: 'security',
    title: 'DevSecOps e segurança',
    emoji: '🔐',
    repos: [
      {
        name: 'gitleaks/gitleaks',
        url: 'https://github.com/gitleaks/gitleaks',
        desc: 'A fast secret-scanning tool for detecting passwords, API keys, and tokens accidentally committed to Git repositories.',
        why: 'Secret scanning in CI/CD pipelines is now a baseline DevSecOps expectation, and Gitleaks is one of the most widely integrated tools for it.',
        bestFor: 'Embedding automated secret detection into CI/CD pipelines.',
      },
      {
        name: 'OWASP/CheatSheetSeries',
        url: 'https://github.com/OWASP/CheatSheetSeries',
        desc: 'The official OWASP cheat sheet series covering secure coding and infrastructure practices across dozens of topics.',
        why: 'It is the most authoritative free reference for application and infrastructure security practices referenced throughout the industry.',
        bestFor: 'Building security literacy alongside DevOps automation skills.',
      },
      {
        name: 'aquasecurity/trivy',
        url: 'https://github.com/aquasecurity/trivy',
        desc: 'A comprehensive, easy-to-use vulnerability scanner for containers, filesystems, Git repositories, and IaC configurations.',
        why: 'Image and IaC scanning is now a default stage in mature CI/CD pipelines, and Trivy is one of the most widely adopted free tools for it.',
        bestFor: 'Adding vulnerability scanning directly into your pipeline stages.',
      },
    ],
  },
  {
    id: 'sre',
    title: 'Site Reliability Engineering',
    emoji: '🎯',
    repos: [
      {
        name: 'upgundecha/howtheysre',
        url: 'https://github.com/upgundecha/howtheysre',
        desc: 'A curated knowledge repository documenting the SRE practices, tools, and culture used by leading technology companies.',
        why: 'It collects real engineering blog posts and case studies from companies like Netflix, Google, and Uber describing how they actually run SRE in production.',
        bestFor: 'Understanding how SRE is practiced at scale beyond textbook definitions.',
      },
      {
        name: 'bregman-arie/howtheydevops',
        url: 'https://github.com/bregman-arie/howtheydevops',
        desc: 'A companion curated knowledge repository specifically on how companies implement DevOps and CI/CD practices in production.',
        why: 'It bridges the gap between learning a tool in isolation and understanding how that tool fits into an organization\'s real delivery pipeline.',
        bestFor: 'Understanding DevOps culture and practice at an organizational level.',
      },
      {
        name: 'google/site-reliability-engineering',
        url: 'https://github.com/google/site-reliability-engineering',
        desc: 'Companion repository hosting source materials related to Google\'s foundational SRE book series.',
        why: 'The Google SRE book is considered the founding text of the SRE discipline, and the companion materials reinforce its core concepts like SLOs and error budgets.',
        bestFor: 'Building a theoretical foundation in SLOs, SLIs, and error budgets.',
      },
    ],
  },
  {
    id: 'awesome',
    title: 'Listas e mapas do ecossistema',
    emoji: '📚',
    repos: [
      {
        name: 'binhnguyennus/awesome-scalability',
        url: 'https://github.com/binhnguyennus/awesome-scalability',
        desc: 'An organized reading list illustrating the patterns of scalable, reliable, and performant large-scale systems.',
        why: 'It curates real engineering case studies on scalability, which directly supports both system design interviews and production architecture decisions.',
        bestFor: 'Studying real-world scalability patterns beyond a single tool\'s documentation.',
      },
      {
        name: 'veggiemonk/awesome-docker',
        url: 'https://github.com/veggiemonk/awesome-docker',
        desc: 'A curated list of Docker resources, projects, and tools spanning the entire container ecosystem.',
        why: 'It is a fast way to discover lesser-known but highly useful tools in the Docker ecosystem that do not show up in beginner tutorials.',
        bestFor: 'Ecosystem discovery once you already know Docker fundamentals. ramitsuri (community)/awesome-sysadmin https://github.com/awesome-foss/awesome-sysadmin A massive, categorized list o',
      },
    ],
  },
];

export const TOTAL_REPOS = REPO_CATEGORIES.reduce((s, c) => s + c.repos.length, 0);
