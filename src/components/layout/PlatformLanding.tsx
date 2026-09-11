import { useState } from 'react';
import { ProgressBreakdown } from '../../types/progress';
import ProgressIndexCard from '../shared/ProgressIndexCard';
import ExportImportPanel from '../shared/ExportImportPanel';
import { Settings, TrendingUp, Zap } from 'lucide-react';

interface Props {
  progressBreakdown: ProgressBreakdown;
  onSelectDomain: (d: string) => void;
}

export default function PlatformLanding({ progressBreakdown, onSelectDomain }: Props) {
  const [showExportImport, setShowExportImport] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        {/* Header with settings */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <Zap size={18} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-display">
                <span className="text-gradient-violet">Study Hub</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Plataforma de Estudos DevOps</p>
            </div>
          </div>
          <button
            onClick={() => setShowExportImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 bg-slate-800/50 text-slate-400 text-[11px] font-semibold hover:border-slate-600 hover:text-slate-300 transition-all rounded-xl"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Backup</span>
          </button>
        </div>

        {/* Progress */}
        <ProgressIndexCard breakdown={progressBreakdown} />

        {/* Domain quick-access */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'devops',  label: 'DevOps',       accent: 'violet' },
            { id: 'azure',   label: 'Azure',        accent: 'sky' },
            { id: 'aws',     label: 'AWS',          accent: 'orange' },
            { id: 'networking', label: 'Redes',      accent: 'emerald' },
            { id: 'python',  label: 'Python',       accent: 'amber' },
            { id: 'system-design', label: 'System Design', accent: 'rose' },
            { id: 'distributed-systems', label: 'Sistemas Distribuídos', accent: 'teal' },
            { id: 'algorithms', label: 'Algoritmos', accent: 'cyan' },
          ].map(({ id, label, accent }) => {
            const colors: Record<string, string> = {
              violet:  'border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20',
              sky:     'border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20',
              orange:  'border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20',
              emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
              amber:   'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
              rose:    'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
              teal:    'border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20',
              cyan:    'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20',
            };
            return (
              <button
                key={id}
                onClick={() => onSelectDomain(id)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${colors[accent] ?? colors.violet}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {showExportImport && <ExportImportPanel onClose={() => setShowExportImport(false)} />}
    </>
  );
}
