import { useState } from 'react';
import { 
  GitBranch, Package, Beaker, Rocket, GitCommit, Container, 
  UploadCloud, FileCode2, RefreshCcw, Network, ArrowRight,
  Github, Gitlab, Box, ShieldCheck, MonitorPlay, TestTube,
  PlayCircle, Cloud, Database, Anchor, Settings2, Infinity, Activity,
  Server, LineChart, Code, Layers, Wrench, Coffee
} from 'lucide-react';
import type { Pipeline, PipelineStage } from '../../data/pipelines/types';

interface Props {
  pipeline: Pipeline;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  GitBranch: <GitBranch />,
  Package: <Package />,
  Beaker: <Beaker />,
  Rocket: <Rocket />,
  GitCommit: <GitCommit />,
  Container: <Container />,
  UploadCloud: <UploadCloud />,
  FileCode2: <FileCode2 />,
  RefreshCcw: <RefreshCcw />,
  Network: <Network />,
  Github: <Github />,
  Gitlab: <Gitlab />,
  Box: <Box />,
  ShieldCheck: <ShieldCheck />,
  MonitorPlay: <MonitorPlay />,
  TestTube: <TestTube />,
  PlayCircle: <PlayCircle />,
  Cloud: <Cloud />,
  Database: <Database />,
  Anchor: <Anchor />,
  Settings2: <Settings2 />,
  Infinity: <Infinity />,
  Activity: <Activity />,
  Server: <Server />,
  LineChart: <LineChart />,
  Code: <Code />,
  Layers: <Layers />,
  Wrench: <Wrench />,
  Coffee: <Coffee />
};

export default function PipelineWidget({ pipeline }: Props) {
  const [activeStageId, setActiveStageId] = useState<string>(pipeline.stages[0].id);

  const activeStage = pipeline.stages.find(s => s.id === activeStageId) || pipeline.stages[0];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div>
          <h2 className="text-lg font-bold text-white font-display">{pipeline.title}</h2>
          <p className="text-xs text-slate-500">{pipeline.description}</p>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        
        {/* Pipeline Visualizer (Top) */}
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-8 relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
          
          {pipeline.stages.map((stage, idx) => {
            const isActive = stage.id === activeStageId;
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveStageId(stage.id)}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                  isActive 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-110' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-slate-500'
                }`}>
                  <div className="[&>svg]:w-6 [&>svg]:h-6">
                    {ICON_MAP[stage.icon] || <Box />}
                  </div>
                </div>
                <span className={`text-xs font-bold font-mono tracking-wider uppercase transition-colors ${
                  isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stage Details (Bottom) */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-8 overflow-y-auto animate-fade-in-up">
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 [&>svg]:w-5 [&>svg]:h-5">
                {ICON_MAP[activeStage.icon] || <Box />}
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{activeStage.name}</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm mb-6">
              {activeStage.description}
            </p>

            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Common Tools</h4>
            <div className="flex flex-wrap gap-2">
              {activeStage.tools.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-medium text-slate-300">
                  <div className="text-slate-400 [&>svg]:w-4 [&>svg]:h-4">
                    {ICON_MAP[tool.icon] || <Box />}
                  </div>
                  {tool.name}
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/3 bg-slate-950 rounded-xl p-5 border border-slate-800/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} /> Pipeline Actions
            </h4>
            <ul className="space-y-3">
              {activeStage.actions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 group">
                  <ArrowRight size={16} className="text-rose-500/60 mt-0.5 group-hover:translate-x-1 transition-transform" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
