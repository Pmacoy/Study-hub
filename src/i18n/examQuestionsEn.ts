export interface ExamQuestionEn {
  q: string;
  opts: string[];
  a: number;
  exp: string;
  mod: string;
}

export const EXAM_QUESTIONS_EN: ExamQuestionEn[] = [
  {
    q: 'What is the difference between Continuous Delivery and Continuous Deployment?',
    opts: [
      'They are the same thing, just different names',
      'Continuous Delivery deploys automatically; Deployment requires approval',
      'Continuous Delivery requires manual approval for production; Deployment deploys automatically',
      'Continuous Deployment is for staging; Delivery is for production',
    ],
    a: 2,
    exp: 'Continuous Delivery keeps the code always in a deployable state, but the production deploy is manual. Continuous Deployment goes one step further and deploys automatically on every approved commit.',
    mod: 'DevOps Intro',
  },
  {
    q: 'In Git, which command reapplies commits from one branch onto another without creating merge commits?',
    opts: ['git merge --no-ff', 'git rebase', 'git cherry-pick', 'git reset --hard'],
    a: 1,
    exp: 'git rebase reapplies the current branch commits on top of the target branch, producing a linear history without merge commits. Never rebase branches shared with other developers.',
    mod: 'Git',
  },
  {
    q: 'What does the "shift-left" principle mean in DevSecOps?',
    opts: [
      'Moving the operations team to the left on the org chart',
      'Integrating security controls early in the SDLC, not only at the end',
      'Using Git flow instead of trunk-based development',
      'Relocating servers to datacenters further west',
    ],
    a: 1,
    exp: 'Shift-left means bringing security controls forward into the early phases of the lifecycle (planning, code, build) instead of leaving them until the end. Finding vulnerabilities earlier is far cheaper.',
    mod: 'DevSecOps',
  },
  {
    q: 'In a multi-stage Dockerfile build, what is the main benefit?',
    opts: [
      'It speeds up build time significantly',
      'The final image contains only what is needed to run, without build tooling',
      'It allows using multiple programming languages',
      'It improves the container network security',
    ],
    a: 1,
    exp: 'Multi-stage builds let you use an image with build tooling (node, maven, gcc) in one stage, then copy only the produced artefacts into a minimal base image. The result: smaller and more secure images.',
    mod: 'Docker',
  },
  {
    q: 'What is a PersistentVolumeClaim (PVC) in Kubernetes?',
    opts: [
      'An automatic backup of volumes',
      'A storage request made by a Pod',
      'A storage class for SSDs',
      'A type of Service for storage',
    ],
    a: 1,
    exp: 'A PVC is a storage request made by a user or Pod. It separates "what I want" (PVC) from "how it is implemented" (PV). A StorageClass can provision PVs dynamically in response to PVCs.',
    mod: 'Kubernetes',
  },
  {
    q: 'Which Kubernetes Service type exposes the application externally through a cloud load balancer?',
    opts: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'],
    a: 2,
    exp: 'LoadBalancer automatically provisions an external load balancer from the cloud provider (Azure LB, AWS ELB, GCP LB). ClusterIP is internal only. NodePort exposes via a port on the node. ExternalName maps to an external DNS name.',
    mod: 'Kubernetes',
  },
  {
    q: 'In Terraform, what happens when you run "terraform plan"?',
    opts: [
      'It applies the infrastructure changes immediately',
      'It produces a diff between the current state and the desired configuration, without making changes',
      'It validates only the HCL syntax',
      'It initialises providers and the backend',
    ],
    a: 1,
    exp: 'terraform plan compares the current state (tfstate) with the desired HCL configuration and shows a diff of resources to create, modify or destroy. It makes no real changes. Reviewing the plan before applying is essential.',
    mod: 'Terraform',
  },
  {
    q: 'Which tool performs SAST (static application security testing) on source code?',
    opts: ['Trivy', 'OWASP ZAP', 'SonarQube', 'Prometheus'],
    a: 2,
    exp: 'SonarQube analyses source code statically (without executing it) to find bugs, code smells and security vulnerabilities. Trivy scans containers and dependencies. OWASP ZAP is DAST (dynamic). Prometheus is monitoring.',
    mod: 'DevSecOps',
  },
  {
    q: 'What is an "Error Budget" in the context of SRE/SLO?',
    opts: [
      'The financial budget for fixing production errors',
      'The amount of failure allowed before breaking the SLO',
      'The maximum number of bugs per sprint',
      'The cost of each production incident',
    ],
    a: 1,
    exp: 'Error Budget = 100% − SLO. If the SLO is 99.9% availability, the error budget is 0.1% of allowed downtime. When the budget is spent, the team should stop shipping features and focus on reliability. It is the foundation of the SRE model.',
    mod: 'Monitoring',
  },
  {
    q: 'What is the difference between ENTRYPOINT and CMD in a Dockerfile?',
    opts: [
      'They are equivalent, but ENTRYPOINT is preferred',
      'ENTRYPOINT defines the main executable (not easily overridden); CMD defines default arguments (overridable)',
      'CMD defines the main executable; ENTRYPOINT provides the arguments',
      'ENTRYPOINT is for production; CMD is for development',
    ],
    a: 1,
    exp: 'ENTRYPOINT defines the executable that always runs (e.g. ["node"]). CMD supplies default arguments to the ENTRYPOINT (e.g. ["server.js"]) and can be overridden at docker run. Together: ENTRYPOINT ["node"] + CMD ["server.js"] → runs "node server.js".',
    mod: 'Docker',
  },
  {
    q: 'In Kubernetes RBAC, what is the difference between Role and ClusterRole?',
    opts: [
      'Role is for admins; ClusterRole is for developers',
      'Role applies permissions within a specific namespace; ClusterRole applies across the whole cluster',
      'They are equivalent but with different historical names',
      'ClusterRole is deprecated in recent versions',
    ],
    a: 1,
    exp: 'Role defines permissions scoped to a specific namespace (e.g. pod reader in "prod"). ClusterRole applies permissions across all namespaces or to cluster-level resources (nodes, PVs). RoleBinding and ClusterRoleBinding associate roles with subjects.',
    mod: 'Kubernetes',
  },
  {
    q: 'What is OIDC in CI/CD, and why is it preferable to service account keys?',
    opts: [
      'It is an authentication protocol that uses ephemeral tokens instead of static credentials',
      'It is a way of encrypting secrets in the pipeline',
      'It is a standard for managing roles in Kubernetes',
      'It is a type of TLS certificate for pipelines',
    ],
    a: 0,
    exp: 'OIDC (OpenID Connect) lets GitHub Actions and other CI/CD systems obtain a temporary token from the cloud provider via federated identity. There are no static secrets to manage, tokens expire in about 15 minutes, and it is auditable. Supported on AWS, Azure and GCP.',
    mod: 'CI/CD',
  },
  {
    q: 'Which deployment strategy sends a small percentage of traffic to the new version before a full rollout?',
    opts: ['Blue-Green', 'Rolling', 'Canary', 'Recreate'],
    a: 2,
    exp: 'Canary deployment sends a fraction of traffic (e.g. 5–10%) to the new version while the rest stays on the stable one. Metrics are monitored before the full rollout. It lets you validate in production with minimal risk.',
    mod: 'DevOps Intro',
  },
  {
    q: 'In Prometheus, what is a "Recording Rule"?',
    opts: [
      'A rule that records the full history of alerts',
      'A precomputed PromQL expression stored as a new time series',
      'A configuration for writing metrics to disk',
      'A type of alert with severity "recording"',
    ],
    a: 1,
    exp: 'Recording rules precompute complex PromQL expressions and store the result as a new time series. This improves the performance of slow dashboard queries. Example: job:request_rate5m:rate = rate(requests_total[5m]).',
    mod: 'Monitoring',
  },
  {
    q: 'What is "Infrastructure Drift" in the context of IaC?',
    opts: [
      'The natural tendency of clouds to raise prices over time',
      'Divergence between the state defined in code and the real state of the infrastructure',
      'Growing latency in older infrastructure',
      'Gradual migration from on-premises to cloud',
    ],
    a: 1,
    exp: 'Infrastructure drift happens when the real infrastructure differs from what the IaC code defines, usually because of manual changes in the portal or CLI. Terraform detects drift with "terraform plan". The fix is to never make manual changes — everything through code.',
    mod: 'Terraform',
  },
  {
    q: 'What is the purpose of a liveness probe in a Kubernetes Pod?',
    opts: [
      'To check whether the container is ready to receive traffic',
      'To determine whether the container should be restarted because it is in an unrecoverable state',
      'To monitor container performance',
      'To check whether the image is up to date',
    ],
    a: 1,
    exp: 'The liveness probe determines whether the container is alive. If it fails, the kubelet restarts the container. The readiness probe (different!) determines whether the container is ready to receive traffic — if it fails, the pod is removed from Service endpoints without being restarted.',
    mod: 'Kubernetes',
  },
  {
    q: 'In Git, what does "git commit --amend" do?',
    opts: [
      'Creates a commit in silent mode',
      'Modifies the last commit (message or content)',
      'Reverts the last commit',
      'Applies a commit from another branch',
    ],
    a: 1,
    exp: 'git commit --amend modifies the last commit, letting you change the message or add forgotten files. Careful: it rewrites history — never use it on commits already pushed to shared branches.',
    mod: 'Git',
  },
  {
    q: 'What is a "Quality Gate" in SonarQube?',
    opts: [
      'A source code quality filter',
      'A set of criteria the code must meet to continue through the pipeline',
      'The SonarQube graphical interface',
      'A routing rule in the load balancer',
    ],
    a: 1,
    exp: 'A Quality Gate is a set of conditions the code must meet to pass (e.g. coverage ≥ 80%, zero critical bugs, zero vulnerabilities). If it fails, the pipeline is blocked. It is the main mechanism for enforcing quality and security.',
    mod: 'DevSecOps',
  },
  {
    q: 'On Linux, what does permission "755" mean on a file?',
    opts: [
      'Owner: read; Group: write; Others: execute',
      'Owner: everything; Group: read+execute; Others: read+execute',
      'Owner: read+write; Group: everything; Others: execute',
      'Everyone has full permission',
    ],
    a: 1,
    exp: '755 = Owner(7=rwx) + Group(5=r-x) + Others(5=r-x). It is the standard permission for executable scripts: the owner can read, write and execute; group and others can read and execute. 644 is for config files (rw-r--r--).',
    mod: 'Linux',
  },
  {
    q: 'What is "Trunk-Based Development" and what is its main requirement?',
    opts: [
      'Always developing on a branch called "trunk" with no merges',
      'All developers commit directly or via short-lived branches to main, requiring feature flags',
      'A strategy only used in companies with more than 100 developers',
      'Using only commits on main, forbidding branches',
    ],
    a: 1,
    exp: 'TBD is a strategy where everyone commits frequently to main (trunk), using feature flags for unfinished code. It requires very fast CI, solid tests and feature flags. It maximises speed and minimises merge conflicts. Used by Google, Facebook and Netflix.',
    mod: 'Git',
  },
];

export const EXAM_UI_EN = {
  title: 'DevOps Exam Simulator',
  subtitle: '20 questions covering every module',
  start: 'Start exam',
  question: 'Question',
  of: 'of',
  explanation: 'Explanation',
  next: 'Next question',
  seeResult: 'See result',
  correct: 'Correct',
  incorrect: 'Incorrect',
  finished: 'Exam finished',
  score: 'Score',
  restart: 'Retake exam',
  byModule: 'By module',
};
