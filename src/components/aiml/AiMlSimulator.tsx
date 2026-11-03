import type { AiMlStudyTab } from '../../types/aiml';
import MlPipelinesSimulator from './MlPipelinesSimulator';
import GenAiSimulator from './GenAiSimulator';
import PromptEngineeringSimulator from './PromptEngineeringSimulator';

interface Props {
  tab: AiMlStudyTab;
}

export default function AiMlSimulator({ tab }: Props) {
  switch (tab) {
    case 'ml-pipelines':
      return <MlPipelinesSimulator />;
    case 'gen-ai':
      return <GenAiSimulator />;
    case 'prompt-engineering':
      return <PromptEngineeringSimulator />;
    default:
      return <MlPipelinesSimulator />;
  }
}
