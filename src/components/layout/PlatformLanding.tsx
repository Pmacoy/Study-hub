import { useState } from 'react';
import { ProgressBreakdown } from '../../types/progress';
import ProgressIndexCard from '../shared/ProgressIndexCard';
import ExportImportPanel from '../shared/ExportImportPanel';
import BadgesShowcase from '../shared/BadgesShowcase';
import { ArrowRight, Rocket, Settings, Zap } from 'lucide-react';

interface Props {
  progressBreakdown: ProgressBreakdown;
  onSelectDomain: (d: string) => void;
}

const OTHER_DOMAINS = [
  { id: 'azure', label: 'Azure', accent: 'sky' },
  { id: 'aws', label: 'AWS', accent: 'orange' },
  { id: 'gcp', label: 'GCP', accent: 'rose' },
  { id: 'oci', label: 'Oracle Cloud', accent: 'red' },
  { id: 'networking', label: 'Redes', accent: 'emerald' },
  { id: 'python', label: 'Python', accent: 'amber' },
  { id: 'system-design', label: 'System Design', accent: 'rose' },
  { id: 'distributed-systems', label: 'Sistemas Distribuídos', accent: 'teal' },
  { id: 'algorithms', label: 'Algoritmos', accent: 'cyan' },
  { id: 'cybersecurity', label: 'Cybersecurity', accent: 'rose' },
  { id: 'ai-ml', label: 'AI & Machine Learning', accent: 'fuchsia' },
  { id: 'citrix', label: 'Citrix VDI como Código', accent: 'violet' },
] as const;

// Filetes/rótulos, não fundos sólidos — cor identifica o domínio sem competir
// com a acção principal. Ver src/design/colorTokens.ts para o mesmo princípio
// aplicado ao resto da app.
const SECONDARY_COLORS: Record<string, string> = {
  violet: 'text-violet-300 hover:border-violet-500/40 hover:bg-violet-500/5',
  sky: 'text-sky-300 hover:border-sky-500/40 hover:bg-sky-500/5',
  orange: 'text-orange-300 hover:border-orange-500/40 hover:bg-orange-500/5',
  emerald: 'text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/5',
  amber: 'text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/5',
  rose: 'text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/5',
  teal: 'text-teal-300 hover:border-teal-500/40 hover:bg-teal-500/5',
  cyan: 'text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/5',
  red: 'text-red-300 hover:border-red-500/40 hover:bg-red-500/5',
};

export default function PlatformLanding({ progressBreakdown, onSelectDomain }: Props) {
  const [showExportImport, setShowExportImport] = useState(false);
  const isNewUser = progressBreakdown.coverage === 0;

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

        {/* Gamification Badges */}
        <div className="mt-8">
          <BadgesShowcase />
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => onSelectDomain('devops')}
          className="mt-12 flex w-full items-center justify-between rounded-xl border border-transparent bg-violet-500/10 p-6 text-left transition-all hover:bg-violet-500/15 group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
              <Rocket size={20} className="text-violet-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 font-mono mb-1">
                {isNewUser ? 'Começa por aqui' : 'Continuar estudo'}
              </p>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isNewUser ? 'DevOps & Platform Engineering' : 'Continuar em DevOps'}
              </h2>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-violet-400 opacity-0 transition-transform group-hover:opacity-100 group-hover:translate-x-1" />
        </button>

        <p className="mt-12 mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 font-mono">
          Outros Domínios
        </p>
        <div className="flex flex-wrap gap-2">
          {OTHER_DOMAINS.map(({ id, label, accent }) => (
            <button
              key={id}
              onClick={() => onSelectDomain(id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors border border-transparent hover:border-slate-800 ${SECONDARY_COLORS[accent] ?? SECONDARY_COLORS.violet}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {showExportImport && <ExportImportPanel onClose={() => setShowExportImport(false)} />}
    </>
  );
}
