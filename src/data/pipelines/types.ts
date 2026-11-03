export type PipelineStageId = string;

export interface ToolItem {
  name: string;
  icon: string; // we'll use mapped lucide-react icons or text
  color?: string; // hex or tailwind class fragment
}

export interface PipelineStage {
  id: PipelineStageId;
  name: string;
  description: string;
  icon: string;
  tools: ToolItem[];
  actions: string[]; // e.g. ["Run Unit Tests", "Lint Code"]
}

export interface Pipeline {
  id: string;
  title: string;
  description: string;
  stages: PipelineStage[];
}
