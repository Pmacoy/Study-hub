import { BrainCircuit, Cpu, MessageSquare, LayoutDashboard, GraduationCap } from 'lucide-react';
import type { AiMlTab } from '../../types/aiml';
import type { SidebarMenuGroup } from '../../types/navigation';

export const aimlMenuGroups: SidebarMenuGroup[] = [
  {
    title: 'Visão Geral',
    items: [
      { id: 'dashboard' as AiMlTab, label: 'Dashboard', sublabel: 'Progresso', icon: LayoutDashboard },
      { id: 'exam' as AiMlTab, label: 'Simulado', sublabel: 'Teste de AI/ML', icon: GraduationCap },
    ],
  },
  {
    title: 'Machine Learning',
    items: [
      { id: 'ml-pipelines' as AiMlTab, label: 'ML Pipelines', sublabel: 'Modelos & MLOps', icon: Cpu },
    ],
  },
  {
    title: 'Generative AI',
    items: [
      { id: 'gen-ai' as AiMlTab, label: 'GenAI & LLMs', sublabel: 'RAG & Arquitetura', icon: BrainCircuit },
      { id: 'prompt-engineering' as AiMlTab, label: 'Prompt Engineering', sublabel: 'Técnicas', icon: MessageSquare },
    ],
  },
];
