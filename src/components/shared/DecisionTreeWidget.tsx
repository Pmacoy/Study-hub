import { useState } from 'react';
import { ArrowRight, RotateCcw, Server, Globe, Box, Boxes, Zap, HelpCircle } from 'lucide-react';
import type { DecisionTree, TreeNodeId, TreeQuestionNode, TreeResultNode } from '../../data/decisionTrees/types';

interface Props {
  tree: DecisionTree;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server size={48} className="text-violet-400" />,
  Globe: <Globe size={48} className="text-sky-400" />,
  Box: <Box size={48} className="text-emerald-400" />,
  Boxes: <Boxes size={48} className="text-orange-400" />,
  Zap: <Zap size={48} className="text-amber-400" />,
  HelpCircle: <HelpCircle size={48} className="text-slate-400" />
};

export default function DecisionTreeWidget({ tree, onClose }: Props) {
  const [currentNodeId, setCurrentNodeId] = useState<TreeNodeId>(tree.startNodeId);
  const [history, setHistory] = useState<TreeNodeId[]>([]);
  
  const currentNode = tree.nodes[currentNodeId];

  const handleAnswer = (nextId: TreeNodeId) => {
    setHistory(prev => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevId = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentNodeId(prevId);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentNodeId(tree.startNodeId);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div>
          <h2 className="text-lg font-bold text-white font-display">{tree.title}</h2>
          <p className="text-xs text-slate-500">{tree.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Recomeçar"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {currentNode.type === 'question' ? (
          <QuestionView node={currentNode} onAnswer={handleAnswer} />
        ) : (
          <ResultView node={currentNode} onReset={handleReset} />
        )}
      </div>

      {/* Footer / Back Button */}
      {history.length > 0 && currentNode.type === 'question' && (
        <div className="p-4 flex justify-center border-t border-slate-800/50">
          <button 
            onClick={handleBack}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Voltar à pergunta anterior
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionView({ node, onAnswer }: { node: TreeQuestionNode; onAnswer: (nextId: string) => void }) {
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
        <HelpCircle size={28} className="text-violet-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{node.question}</h3>
      {node.description && (
        <p className="text-slate-400 mb-10 max-w-md mx-auto">{node.description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
        {node.answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(answer.nextId)}
            className="group flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all text-left"
          >
            <span className="font-medium text-slate-300 group-hover:text-violet-300">
              {answer.label}
            </span>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultView({ node, onReset }: { node: TreeResultNode; onReset: () => void }) {
  return (
    <div className="w-full max-w-md flex flex-col items-center text-center animate-fade-in-up">
      <div className="mb-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-violet-900/20">
        {ICON_MAP[node.icon || 'Server'] || ICON_MAP['HelpCircle']}
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-bold tracking-widest uppercase mb-4">
        {node.service}
      </div>
      <h3 className="text-3xl font-display font-bold text-white mb-4">
        {node.title}
      </h3>
      <p className="text-slate-400 leading-relaxed mb-8">
        {node.description}
      </p>

      <button
        onClick={onReset}
        className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2"
      >
        <RotateCcw size={16} />
        Analisar Novo Cenário
      </button>
    </div>
  );
}
