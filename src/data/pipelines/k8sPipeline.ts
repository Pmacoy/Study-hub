import type { Pipeline } from './types';

export const k8sPipeline: Pipeline = {
  id: 'k8s-cicd-pipeline',
  title: 'Kubernetes CI/CD Pipeline',
  description: 'Uma pipeline de CI/CD moderna e baseada em GitOps focada em deployments de Kubernetes.',
  stages: [
    {
      id: 's-code',
      name: 'Code & Commit',
      description: 'Desenvolvedor faz push do código e do Dockerfile para o repositório de aplicação.',
      icon: 'GitCommit',
      tools: [
        { name: 'Git', icon: 'Github' },
        { name: 'VS Code', icon: 'Code' }
      ],
      actions: ['Write Code', 'Commit to main branch']
    },
    {
      id: 's-build',
      name: 'Container Build',
      description: 'O CI compila o código e constrói a imagem Docker, aplicando tags com o commit hash.',
      icon: 'Container',
      tools: [
        { name: 'Docker', icon: 'Box' },
        { name: 'Kaniko', icon: 'Layers' }
      ],
      actions: ['Build Image', 'Run Tests in Container', 'Security Scan (Trivy)']
    },
    {
      id: 's-push',
      name: 'Registry Push',
      description: 'A imagem validada é enviada para um Container Registry (ACR, ECR, Docker Hub).',
      icon: 'UploadCloud',
      tools: [
        { name: 'Azure ACR', icon: 'Cloud' },
        { name: 'Docker Hub', icon: 'Database' }
      ],
      actions: ['Push Image', 'Sign Image']
    },
    {
      id: 's-gitops',
      name: 'Manifest Update',
      description: 'O CI atualiza o repositório de infraestrutura (GitOps Repo) com a nova tag da imagem (ex: via Kustomize ou Helm).',
      icon: 'FileCode2',
      tools: [
        { name: 'Helm', icon: 'Anchor' },
        { name: 'Kustomize', icon: 'Settings2' }
      ],
      actions: ['Update values.yaml', 'Commit new Image Tag']
    },
    {
      id: 's-sync',
      name: 'GitOps Sync',
      description: 'O agente de GitOps no cluster Kubernetes deteta a mudança no repo e sincroniza o estado do cluster.',
      icon: 'RefreshCcw',
      tools: [
        { name: 'ArgoCD', icon: 'Infinity' },
        { name: 'Flux', icon: 'Activity' }
      ],
      actions: ['Detect Drift', 'Apply Manifests', 'Wait for Rollout']
    },
    {
      id: 's-run',
      name: 'K8s Cluster',
      description: 'Os novos Pods são agendados e começam a correr com a nova imagem, substituindo os antigos.',
      icon: 'Network',
      tools: [
        { name: 'Kubernetes', icon: 'Server' },
        { name: 'Prometheus', icon: 'LineChart' }
      ],
      actions: ['Rolling Update', 'Monitor Health', 'Scale']
    }
  ]
};
