import type { DecisionTree } from './types';

export const azureComputeTree: DecisionTree = {
  id: 'azure-compute-tree',
  title: 'Azure Compute Decision Tree',
  description: 'Descubra qual o serviço de Compute do Azure adequado para a sua aplicação respondendo a algumas perguntas.',
  startNodeId: 'q-lift-shift',
  nodes: {
    'q-lift-shift': {
      type: 'question',
      id: 'q-lift-shift',
      question: 'É uma migração "Lift and Shift" (sem reescrever a aplicação)?',
      description: 'Estás a mover uma aplicação existente on-premises para a cloud tal como está?',
      answers: [
        { label: 'Sim', nextId: 'q-lift-shift-yes' },
        { label: 'Não (App Nova ou Refactor)', nextId: 'q-microservices' }
      ]
    },
    'q-lift-shift-yes': {
      type: 'question',
      id: 'q-lift-shift-yes',
      question: 'A aplicação pode ser contentorizada facilmente?',
      answers: [
        { label: 'Sim', nextId: 'q-app-service-containers' },
        { label: 'Não', nextId: 'res-virtual-machines' }
      ]
    },
    'q-microservices': {
      type: 'question',
      id: 'q-microservices',
      question: 'A arquitetura é baseada em Microserviços?',
      answers: [
        { label: 'Sim', nextId: 'q-event-driven' },
        { label: 'Não', nextId: 'q-app-service' }
      ]
    },
    'q-app-service-containers': {
      type: 'question',
      id: 'q-app-service-containers',
      question: 'Precisas de orquestração avançada (como Kubernetes)?',
      answers: [
        { label: 'Sim', nextId: 'res-aks' },
        { label: 'Não', nextId: 'res-app-service' }
      ]
    },
    'q-app-service': {
      type: 'question',
      id: 'q-app-service',
      question: 'A app web precisa de controlo total sobre o SO subjacente?',
      answers: [
        { label: 'Sim', nextId: 'res-virtual-machines' },
        { label: 'Não', nextId: 'res-app-service' }
      ]
    },
    'q-event-driven': {
      type: 'question',
      id: 'q-event-driven',
      question: 'O workload é "Event-Driven" ou consistido por tarefas curtas (serverless)?',
      answers: [
        { label: 'Sim', nextId: 'res-functions' },
        { label: 'Não (Serviços contínuos)', nextId: 'q-k8s' }
      ]
    },
    'q-k8s': {
      type: 'question',
      id: 'q-k8s',
      question: 'Tens experiência/necessidade de usar a API completa do Kubernetes?',
      answers: [
        { label: 'Sim', nextId: 'res-aks' },
        { label: 'Não (Quero K8s abstraído)', nextId: 'res-container-apps' }
      ]
    },
    'res-virtual-machines': {
      type: 'result',
      id: 'res-virtual-machines',
      title: 'Azure Virtual Machines (VMs)',
      service: 'IaaS',
      description: 'Ideal para lift-and-shift direto quando precisas de acesso ao SO, portas não-standard, ou software legacy que não pode ser modificado ou contentorizado.',
      icon: 'Server'
    },
    'res-app-service': {
      type: 'result',
      id: 'res-app-service',
      title: 'Azure App Service',
      service: 'PaaS',
      description: 'A melhor escolha para aplicações web tradicionais e APIs HTTP. O Azure gere a infraestrutura, patching e scale up/down automaticamente.',
      icon: 'Globe'
    },
    'res-aks': {
      type: 'result',
      id: 'res-aks',
      title: 'Azure Kubernetes Service (AKS)',
      service: 'CaaS',
      description: 'A solução standard para microserviços e orquestração de containers em escala empresarial, oferecendo acesso completo à API do K8s.',
      icon: 'Box'
    },
    'res-container-apps': {
      type: 'result',
      id: 'res-container-apps',
      title: 'Azure Container Apps',
      service: 'Serverless CaaS',
      description: 'Ideal para microserviços baseados em containers sem a complexidade de gerir um cluster Kubernetes. Escala para zero através do KEDA.',
      icon: 'Boxes'
    },
    'res-functions': {
      type: 'result',
      id: 'res-functions',
      title: 'Azure Functions',
      service: 'FaaS (Serverless)',
      description: 'A escolha certa para workloads event-driven, processamento em background de curta duração e APIs muito simples. Pagas apenas pelos ms em que o código corre.',
      icon: 'Zap'
    }
  }
};
