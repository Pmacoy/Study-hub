import { X, BookOpen } from 'lucide-react';
import type { ResourceItem } from '../../data/domainResources';

interface Props {
  resource: ResourceItem;
  accent: string;
  onClose: () => void;
}

const ACCENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function ConceptModal({ resource, accent, onClose }: Props) {
  const theme = ACCENT_COLORS[accent] || ACCENT_COLORS.violet;

  // Um parser simples para o markdown gerado
  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-2xl font-bold text-white mb-4 mt-2">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-semibold text-white mb-3 mt-6">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 mb-2 text-slate-300 leading-relaxed list-disc">
            {line.replace('- ', '').split('**').map((part, i) => i % 2 !== 0 ? <strong key={i} className="text-white">{part}</strong> : part)}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 mb-2 text-slate-300 leading-relaxed list-decimal">
            {line.replace(/^\d+\.\s/, '').split('**').map((part, i) => i % 2 !== 0 ? <strong key={i} className="text-white">{part}</strong> : part)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }
      return (
        <p key={idx} className="text-slate-300 mb-2 leading-relaxed">
          {line.split('**').map((part, i) => i % 2 !== 0 ? <strong key={i} className="text-white">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border ${theme.border} rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={`flex items-center justify-between p-4 md:p-6 border-b border-slate-800 ${theme.bg} rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.bg} ${theme.border} border`}>
              <BookOpen size={20} className={theme.text} />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg md:text-xl font-bold text-white font-display leading-tight">
                {resource.title}
              </h2>
              {resource.tags && (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {resource.tags.map(tag => (
                    <span key={tag} className={`text-[10px] font-medium border ${theme.border} ${theme.text} rounded px-1.5 py-0.5 opacity-80`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
          {resource.type === 'concept' ? (
            <div className="prose prose-invert max-w-none">
              {renderContent(resource.content)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className={`p-4 rounded-full ${theme.bg} ${theme.border} border`}>
                <BookOpen size={32} className={theme.text} />
              </div>
              <h3 className="text-xl font-medium text-white">Componente Interativo</h3>
              <p className="text-slate-400 max-w-sm">
                O widget '{resource.content}' será renderizado aqui brevemente em futuras atualizações.
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-lg border ${theme.border} ${theme.text} hover:${theme.bg} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900`}
          >
            Fechar Conceito
          </button>
        </div>
      </div>
    </div>
  );
}
