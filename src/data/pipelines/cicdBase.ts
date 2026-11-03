import type { Pipeline } from './types';

export const cicdBasePipeline: Pipeline = {
  id: 'cicd-pipeline-base',
  title: 'CI/CD Pipeline Clássico',
  description: 'O fluxo fundamental de Continuous Integration e Continuous Deployment partilhado pela maioria das equipas.',
  stages: [
    {
      id: 's-source',
      name: 'Source',
      description: 'O código é escrito, comitado e feito push para um repositório centralizado de controlo de versões.',
      icon: 'GitBranch',
      tools: [
        { name: 'Git', icon: 'Github' },
        { name: 'GitHub', icon: 'Github' },
        { name: 'GitLab', icon: 'Gitlab' }
      ],
      actions: ['Code Commit', 'Pull Request', 'Code Review']
    },
    {
      id: 's-build',
      name: 'Build',
      description: 'O código fonte é compilado num artefacto executável (ex: binário, jar, ou imagem Docker).',
      icon: 'Package',
      tools: [
        { name: 'Maven/Gradle', icon: 'Coffee' },
        { name: 'npm/yarn', icon: 'Box' },
        { name: 'Docker', icon: 'Container' }
      ],
      actions: ['Compile Code', 'Resolve Dependencies', 'Build Docker Image']
    },
    {
      id: 's-test',
      name: 'Test',
      description: 'Execução de testes automatizados para garantir que as novas alterações não quebram funcionalidades existentes.',
      icon: 'Beaker',
      tools: [
        { name: 'JUnit/Jest', icon: 'TestTube' },
        { name: 'SonarQube', icon: 'ShieldCheck' },
        { name: 'Selenium', icon: 'MonitorPlay' }
      ],
      actions: ['Unit Tests', 'Integration Tests', 'Static Code Analysis', 'Security Scan (SAST)']
    },
    {
      id: 's-deploy',
      name: 'Deploy',
      description: 'O artefacto aprovado é promovido automaticamente (ou com aprovação manual) para ambientes staging ou produção.',
      icon: 'Rocket',
      tools: [
        { name: 'Jenkins', icon: 'Wrench' },
        { name: 'GitHub Actions', icon: 'PlayCircle' },
        { name: 'AWS/Azure', icon: 'Cloud' }
      ],
      actions: ['Provision Infra', 'Deploy Artifact', 'Smoke Tests', 'Release']
    }
  ]
};
