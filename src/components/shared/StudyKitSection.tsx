import { useState } from 'react';
import { FileText, Image as ImageIcon, ExternalLink, BookOpen, Lightbulb, Zap, LayoutGrid, ChevronDown, ChevronUp, Hash, Activity, ArrowRight } from 'lucide-react';
import type { ResourceItem } from '../../data/domainResources';
import ConceptModal from './ConceptModal';
import DecisionTreeWidget from './DecisionTreeWidget';
import { azureComputeTree } from '../../data/decisionTrees/azureCompute';
import PipelineWidget from './PipelineWidget';
import { cicdBasePipeline } from '../../data/pipelines/cicdBase';
import { k8sPipeline } from '../../data/pipelines/k8sPipeline';
import { pythonMlPipeline } from '../../data/pipelines/pythonMlPipeline';
import { systemDesignDbTree } from '../../data/decisionTrees/systemDesignDb';

interface Props {
  resources: ResourceItem[];
  accent: string;
}

const KIND_META: Record<string, { label: string; icon: React.ReactNode; badge: string; activeBg: string; activeText: string; activeBorder: string }> = {
  guide:      { label: 'Guia',        icon: <BookOpen size={12} />,   badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',     activeBg: 'bg-sky-500/15',     activeText: 'text-sky-300',     activeBorder: 'border-sky-500/40' },
  cheatsheet: { label: 'Cheat Sheet', icon: <Hash size={12} />,       badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', activeBg: 'bg-violet-500/15', activeText: 'text-violet-300', activeBorder: 'border-violet-500/40' },
  diagram:    { label: 'Diagrama',    icon: <LayoutGrid size={12} />, badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', activeBg: 'bg-emerald-500/15', activeText: 'text-emerald-300', activeBorder: 'border-emerald-500/40' },
  questions:  { label: 'Questões',   icon: <Zap size={12} />,        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',   activeBg: 'bg-amber-500/15',   activeText: 'text-amber-300',   activeBorder: 'border-amber-500/40' },
  interactive:{ label: 'Interativo',  icon: <Activity size={12} />,   badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',     activeBg: 'bg-rose-500/15',     activeText: 'text-rose-300',     activeBorder: 'border-rose-500/40' },
};

const ACCENT_STYLES: Record<string, { border: string; text: string; surface: string; ring: string }> = {
  violet:  { border: 'border-violet-500/20', text: 'text-violet-400', surface: 'hover:bg-violet-500/8',  ring: 'hover:border-violet-500/40' },
  sky:     { border: 'border-sky-500/20',    text: 'text-sky-400',    surface: 'hover:bg-sky-500/8',     ring: 'hover:border-sky-500/40' },
  emerald: { border: 'border-emerald-500/20',text: 'text-emerald-400',surface: 'hover:bg-emerald-500/8', ring: 'hover:border-emerald-500/40' },
  amber:   { border: 'border-amber-500/20',  text: 'text-amber-400',  surface: 'hover:bg-amber-500/8',   ring: 'hover:border-amber-500/40' },
  orange:  { border: 'border-orange-500/20', text: 'text-orange-400', surface: 'hover:bg-orange-500/8',  ring: 'hover:border-orange-500/40' },
  rose:    { border: 'border-rose-500/20',   text: 'text-rose-400',   surface: 'hover:bg-rose-500/8',    ring: 'hover:border-rose-500/40' },
  teal:    { border: 'border-teal-500/20',   text: 'text-teal-400',   surface: 'hover:bg-teal-500/8',    ring: 'hover:border-teal-500/40' },
  cyan:    { border: 'border-cyan-500/20',   text: 'text-cyan-400',   surface: 'hover:bg-cyan-500/8',    ring: 'hover:border-cyan-500/40' },
};

const FILTERS = ['all', 'guide', 'cheatsheet', 'diagram', 'questions', 'interactive'] as const;
type Filter = typeof FILTERS[number];

export default function StudyKitSection({ resources, accent }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [collapsed, setCollapsed] = useState(false);
  const [openWidget, setOpenWidget] = useState<string | null>(null);
  const [openConcept, setOpenConcept] = useState<ResourceItem | null>(null);

  if (!resources || resources.length === 0) return null;

  const a = ACCENT_STYLES[accent] ?? ACCENT_STYLES['violet'];
  const visible = filter === 'all' ? resources : resources.filter(r => r.kind === filter);

  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f] = f === 'all' ? resources.length : resources.filter(r => r.kind === f).length;
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.14em] font-mono ${a.text}`}>
            Materiais de Estudo
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-white font-display flex items-center gap-2">
            Kit de Referência
            <span className="text-sm font-normal text-slate-500">({resources.length})</span>
          </h3>
        </div>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/50"
          id="study-kit-toggle"
        >
          {collapsed ? <><ChevronDown size={14} /> Expandir</> : <><ChevronUp size={14} /> Recolher</>}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => {
              if (counts[f] === 0 && f !== 'all') return null;
              const meta = f === 'all' ? null : KIND_META[f];
              const isActive = filter === f;
              const activeClasses = meta
                ? `${meta.activeBg} ${meta.activeText} ${meta.activeBorder}`
                : `bg-white/10 text-white border-white/30`;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  id={`study-kit-filter-${f}`}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 ${
                    isActive
                      ? activeClasses
                      : 'text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {meta?.icon}
                  {f === 'all' ? 'Todos' : meta?.label}
                  <span className="opacity-60 tabular-nums">{counts[f]}</span>
                </button>
              );
            })}
          </div>

          {/* Resource List (Editorial Style) */}
          <div className="mt-8 flex flex-col border-t border-slate-800">
            {visible.map((res, idx) => {
              const meta = KIND_META[res.kind];
              const isInteractive = res.kind === 'interactive';
              
              return (
                <button
                  key={idx}
                  onClick={() => isInteractive ? setOpenWidget(res.content) : setOpenConcept(res)}
                  className="group flex flex-col sm:flex-row sm:items-start gap-4 p-5 text-left transition-colors hover:bg-slate-900/50 border-b border-slate-800"
                  id={`study-kit-resource-${idx}`}
                >
                  {/* Icon column */}
                  <div className={`mt-0.5 shrink-0 flex items-center gap-2 text-slate-500 group-hover:${a.text} transition-colors`}>
                    {meta?.icon}
                  </div>

                  {/* Content column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-1">
                      <h4 className="text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                        {res.title}
                      </h4>
                      <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                        {meta?.label}
                      </span>
                    </div>
                    
                    {res.description && (
                      <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                        {res.description}
                      </p>
                    )}

                    {res.tags && res.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {res.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs text-slate-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Icon */}
                  <div className="shrink-0 hidden sm:flex items-center text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isInteractive ? <Activity size={16} /> : <ArrowRight size={16} />}
                  </div>
                </button>
              );
            })}
          </div>

          {visible.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-600">
              Nenhum recurso deste tipo para este dominio.
            </div>
          )}

          {/* Widget Modal */}
          {openWidget && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setOpenWidget(null)}>
              <div 
                className="w-full max-w-4xl h-[80vh] bg-[#0a0a0f] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
              >
                {openWidget === 'azure-compute-tree' && (
                  <DecisionTreeWidget tree={azureComputeTree} onClose={() => setOpenWidget(null)} />
                )}
                {openWidget === 'cicd-pipeline-base' && (
                  <PipelineWidget pipeline={cicdBasePipeline} onClose={() => setOpenWidget(null)} />
                )}
                {openWidget === 'k8s-cicd-pipeline' && (
                  <PipelineWidget pipeline={k8sPipeline} onClose={() => setOpenWidget(null)} />
                )}
                {openWidget === 'python-ml-pipeline' && (
                  <PipelineWidget pipeline={pythonMlPipeline} onClose={() => setOpenWidget(null)} />
                )}
                {openWidget === 'system-design-db' && (
                  <DecisionTreeWidget tree={systemDesignDbTree} onClose={() => setOpenWidget(null)} />
                )}
              </div>
            </div>
          )}

          {/* Concept Modal */}
          {openConcept && (
            <ConceptModal 
              resource={openConcept} 
              accent={accent} 
              onClose={() => setOpenConcept(null)} 
            />
          )}
        </>
      )}
    </section>
  );
}
