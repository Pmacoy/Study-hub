import type { AiMlStudyTab } from '../../types/aiml';

export const AIML_TAB_META: Record<AiMlStudyTab, { label: string; subtitle: string }> = {
  'ml-pipelines': { label: 'Machine Learning Pipelines', subtitle: 'Training, Inference, MLOps' },
  'gen-ai': { label: 'Generative AI & LLMs', subtitle: 'RAG, Copilot, LangChain' },
  'prompt-engineering': { label: 'Prompt Engineering', subtitle: 'Zero-shot, Few-shot, ReAct' },
};
