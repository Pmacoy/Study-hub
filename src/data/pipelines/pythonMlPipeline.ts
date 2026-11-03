import type { Pipeline } from './types';

export const pythonMlPipeline: Pipeline = {
  id: 'python-ml-pipeline',
  title: 'Python ML / Data Pipeline',
  description: 'Um pipeline típico para projetos de Data Engineering ou Machine Learning em Python.',
  stages: [
    {
      id: 'data-prep',
      name: 'Data Preparation & Lint',
      description: 'Garantir a qualidade do código Python e preparar os dados.',
      icon: 'Database',
      tools: [
        { name: 'Flake8', icon: 'CheckCircle', color: 'text-blue-500' },
        { name: 'Black', icon: 'Code', color: 'text-gray-800 dark:text-gray-200' },
        { name: 'Pandas', icon: 'Table', color: 'text-indigo-500' }
      ],
      actions: ['Code Formatting', 'Static Analysis', 'Data Imputation', 'Feature Engineering']
    },
    {
      id: 'model-training',
      name: 'Model Training',
      description: 'Treinar o modelo e realizar cross-validation.',
      icon: 'Brain',
      tools: [
        { name: 'Scikit-Learn', icon: 'Library', color: 'text-orange-500' },
        { name: 'PyTorch', icon: 'Flame', color: 'text-red-500' },
        { name: 'MLflow', icon: 'Activity', color: 'text-blue-400' }
      ],
      actions: ['Hyperparameter Tuning', 'Training Loop', 'Experiment Tracking']
    },
    {
      id: 'model-eval',
      name: 'Evaluation & Test',
      description: 'Testar a precisão e robustez do modelo.',
      icon: 'TestTube',
      tools: [
        { name: 'Pytest', icon: 'CheckSquare', color: 'text-green-500' },
        { name: 'Evidently', icon: 'LineChart', color: 'text-purple-500' }
      ],
      actions: ['Unit Testing (App)', 'Model Accuracy Check', 'Data Drift Detection']
    },
    {
      id: 'model-deploy',
      name: 'Deployment (Serving)',
      description: 'Empacotar o modelo para inferência em tempo real.',
      icon: 'Rocket',
      tools: [
        { name: 'FastAPI', icon: 'Zap', color: 'text-teal-500' },
        { name: 'Docker', icon: 'Box', color: 'text-blue-500' },
        { name: 'Seldon Core', icon: 'Server', color: 'text-blue-600' }
      ],
      actions: ['Containerization', 'REST API Wrapping', 'K8s Deployment']
    }
  ]
};
