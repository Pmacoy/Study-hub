/**
 * Termos de pesquisa YouTube por módulo, afinados para conteúdo PRÁTICO
 * (demos, labs, troubleshooting ao vivo) em vez de aulas expositivas.
 *
 * Usamos pesquisas em vez de IDs fixos por três razões:
 *   · vídeos são apagados, tornados privados ou substituídos
 *   · resultados melhoram com o tempo sem manutenção
 *   · o utilizador escolhe o formato e o instrutor que lhe serve
 */

export interface VideoSearch {
  /** rótulo do chip */
  label: string;
  /** termos base, sempre em inglês (é onde há mais conteúdo hands-on) */
  terms: string;
}

export interface ModuleVideos {
  topic: string;
  searches: VideoSearch[];
}

/** Sufixos que empurram os resultados para conteúdo prático */
const HANDS_ON = 'hands on demo';
const LAB = 'step by step lab';
const DEBUG = 'troubleshooting live';

const s = (label: string, terms: string): VideoSearch => ({ label, terms });

export const MODULE_VIDEOS: Record<string, ModuleVideos> = {
  // ── Platform & DevOps ──────────────────────────────────────────
  'devops:linux': {
    topic: 'Linux troubleshooting',
    searches: [
      s('Demo prático', `linux server troubleshooting ${HANDS_ON}`),
      s('Disco cheio', `linux disk full lsof deleted files ${DEBUG}`),
      s('CPU e memória', `linux high cpu memory vmstat iostat ${DEBUG}`),
    ],
  },
  'devops:git': {
    topic: 'Git',
    searches: [
      s('Demo prático', `git rebase merge conflict ${HANDS_ON}`),
      s('Recuperar erros', `git reset revert reflog recover ${HANDS_ON}`),
    ],
  },
  'devops:docker': {
    topic: 'Docker',
    searches: [
      s('Demo prático', `dockerfile multi stage build ${HANDS_ON}`),
      s('Optimizar imagem', `reduce docker image size ${LAB}`),
    ],
  },
  'devops:kubernetes': {
    topic: 'Kubernetes',
    searches: [
      s('Demo prático', `kubernetes ${HANDS_ON} deploy service ingress`),
      s('CrashLoopBackOff', `kubectl debug crashloopbackoff ${DEBUG}`),
      s('Probes e RBAC', `kubernetes readiness liveness probe rbac ${LAB}`),
    ],
  },
  'devops:helm': {
    topic: 'Helm',
    searches: [
      s('Demo prático', `helm chart create template ${HANDS_ON}`),
      s('Multi-ambiente', `helm values per environment ${LAB}`),
    ],
  },
  'devops:cicd': {
    topic: 'CI/CD',
    searches: [
      s('Jenkins pipeline', `jenkins declarative pipeline ${HANDS_ON}`),
      s('GitHub Actions', `github actions workflow build deploy ${LAB}`),
      s('Blue-green / canary', `blue green canary deployment ${HANDS_ON}`),
    ],
  },
  'devops:terraform': {
    topic: 'Terraform',
    searches: [
      s('Demo prático', `terraform ${HANDS_ON} aws provision`),
      s('Módulos e state', `terraform modules remote state locking ${LAB}`),
    ],
  },
  'devops:cloudformation': {
    topic: 'CloudFormation',
    searches: [
      s('Demo prático', `aws cloudformation template ${HANDS_ON}`),
      s('Change sets', `cloudformation change set drift detection ${LAB}`),
    ],
  },
  'devops:monitoring': {
    topic: 'Monitorização',
    searches: [
      s('Demo prático', `prometheus grafana setup ${HANDS_ON}`),
      s('Alertas', `alertmanager alert rules ${LAB}`),
    ],
  },
  'devops:security': {
    topic: 'DevSecOps',
    searches: [
      s('Scan no pipeline', `sonarqube trivy pipeline integration ${HANDS_ON}`),
      s('Gestão de secrets', `hashicorp vault kubernetes ${LAB}`),
    ],
  },
  'devops:finops': {
    topic: 'FinOps Kubernetes',
    searches: [
      s('Karpenter', `karpenter eks ${HANDS_ON} node provisioning`),
      s('KEDA scale to zero', `keda scale to zero kubernetes ${LAB}`),
    ],
  },
  'devops:mlops': {
    topic: 'MLOps',
    searches: [
      s('MLflow', `mlflow tracking model registry ${HANDS_ON}`),
      s('Kubeflow', `kubeflow pipelines kubernetes ${LAB}`),
    ],
  },
  'devops:idp-backstage': {
    topic: 'Backstage / IDP',
    searches: [
      s('Demo prático', `backstage developer portal setup ${HANDS_ON}`),
    ],
  },
  'devops:devops-intro': {
    topic: 'DevOps end-to-end',
    searches: [
      s('Projecto completo', `devops end to end project ${HANDS_ON} jenkins docker kubernetes`),
    ],
  },

  // ── Redes ──────────────────────────────────────────────────────
  'networking:osi-model': {
    topic: 'Modelo OSI',
    searches: [
      s('Na prática', `osi model wireshark packet capture ${HANDS_ON}`),
    ],
  },
  'networking:ip-subnet': {
    topic: 'Subnetting',
    searches: [
      s('Exercícios', `subnetting practice problems ${LAB}`),
      s('VLSM', `vlsm subnetting example ${HANDS_ON}`),
    ],
  },
  'networking:tcp-udp': {
    topic: 'TCP / UDP',
    searches: [
      s('Wireshark', `tcp handshake wireshark analysis ${HANDS_ON}`),
    ],
  },
  'networking:dns': {
    topic: 'DNS',
    searches: [
      s('Demo prático', `dns troubleshooting dig nslookup ${DEBUG}`),
      s('DNS interno', `coredns kubernetes dns ${LAB}`),
    ],
  },
  'networking:routing': {
    topic: 'Routing',
    searches: [
      s('BGP na prática', `bgp routing configuration ${HANDS_ON}`),
    ],
  },
  'networking:vpn-security': {
    topic: 'VPN e segurança',
    searches: [
      s('Site-to-site VPN', `ipsec site to site vpn configuration ${LAB}`),
    ],
  },

  // ── AWS ────────────────────────────────────────────────────────
  'aws:vpc': {
    topic: 'AWS VPC',
    searches: [
      s('Demo prático', `aws vpc subnets nat gateway ${HANDS_ON}`),
      s('VPC endpoints', `aws vpc endpoint s3 ${LAB}`),
    ],
  },
  'aws:iam': {
    topic: 'AWS IAM',
    searches: [
      s('Demo prático', `aws iam roles policies cross account ${HANDS_ON}`),
    ],
  },
  'aws:compute': {
    topic: 'AWS Compute',
    searches: [
      s('EC2 e Auto Scaling', `aws ec2 auto scaling alb ${HANDS_ON}`),
      s('Lambda', `aws lambda api gateway ${LAB}`),
    ],
  },
  'aws:storage': {
    topic: 'AWS Storage',
    searches: [
      s('S3 na prática', `aws s3 lifecycle versioning encryption ${HANDS_ON}`),
    ],
  },
  'aws:databases': {
    topic: 'AWS Databases',
    searches: [
      s('RDS e Aurora', `aws rds multi az read replica ${HANDS_ON}`),
      s('DynamoDB', `dynamodb single table design ${LAB}`),
    ],
  },
  'aws:wellarch': {
    topic: 'Well-Architected',
    searches: [
      s('Revisão prática', `aws well architected review ${HANDS_ON}`),
    ],
  },

  // ── Azure ──────────────────────────────────────────────────────
  'azure:identity': {
    topic: 'Entra ID',
    searches: [
      s('Demo prático', `azure entra id users groups ${HANDS_ON}`),
    ],
  },
  'azure:governance': {
    topic: 'Azure Policy',
    searches: [
      s('Demo prático', `azure policy governance ${HANDS_ON}`),
    ],
  },
  'azure:rbac': {
    topic: 'Azure RBAC',
    searches: [
      s('Demo prático', `azure rbac role assignment ${HANDS_ON}`),
    ],
  },
  'azure:storage': {
    topic: 'Azure Storage',
    searches: [
      s('Demo prático', `azure storage account blob ${HANDS_ON}`),
    ],
  },
  'azure:compute': {
    topic: 'Azure Compute',
    searches: [
      s('VMs e scale sets', `azure vm scale set ${HANDS_ON}`),
    ],
  },
  'azure:containers': {
    topic: 'AKS',
    searches: [
      s('Demo prático', `azure kubernetes service aks ${HANDS_ON}`),
    ],
  },
  'azure:vnet': {
    topic: 'Azure VNet',
    searches: [
      s('Demo prático', `azure vnet nsg peering ${HANDS_ON}`),
      s('VPN Gateway', `azure vpn gateway site to site ${LAB}`),
    ],
  },
  'azure:monitor': {
    topic: 'Azure Monitor',
    searches: [
      s('Demo prático', `azure monitor log analytics kql ${HANDS_ON}`),
    ],
  },

  // ── Python ─────────────────────────────────────────────────────
  'python:devops': {
    topic: 'Python para DevOps',
    searches: [
      s('Automação AWS', `python boto3 automation ${HANDS_ON}`),
      s('Scripts robustos', `python devops scripting error handling ${LAB}`),
    ],
  },
};

export type VideoLang = 'any' | 'pt' | 'en' | 'hi';

export const VIDEO_LANGS: { id: VideoLang; label: string; suffix: string }[] = [
  { id: 'any', label: 'Qualquer',   suffix: '' },
  { id: 'pt',  label: 'Português',  suffix: ' português' },
  { id: 'en',  label: 'Inglês',     suffix: ' english' },
  { id: 'hi',  label: 'Hindi',      suffix: ' hindi' },
];

/** Constrói o URL de pesquisa do YouTube, filtrando por vídeos longos (>4 min) */
export function youtubeSearchUrl(terms: string, lang: VideoLang = 'any'): string {
  const suffix = VIDEO_LANGS.find(l => l.id === lang)?.suffix ?? '';
  const q = encodeURIComponent((terms + suffix).trim());
  // sp=EgIYAg%3D%3D → filtro "duração: 4-20 minutos"
  return `https://www.youtube.com/results?search_query=${q}&sp=EgIYAg%253D%253D`;
}

export function videosFor(domain: string, tab: string): ModuleVideos | null {
  return MODULE_VIDEOS[`${domain}:${tab}`] ?? null;
}
