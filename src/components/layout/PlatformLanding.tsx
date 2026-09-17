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
  { id: 'networking', label: 'Redes', accent: 'emerald' },
  { id: 'python', label: 'Python', accent: 'amber' },
  { id: 'system-design', label: 'System Design', accent: 'rose' },
  { id: 'distributed-systems', label: 'Sistemas Distribuídos', accent: 'teal' },
  { id: 'algorithms', label: 'Algoritmos', accent: 'cyan' },
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

        {/* Primary CTA — única acção com peso total (tamanho + cor sólida),
            para responder "o que faço primeiro?" antes da grelha de domínios. */}
        <button
          onClick={() => onSelectDomain('devops')}
          className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-left transition-all hover:bg-violet-500/20 group"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/15">
            <Rocket size={18} className="text-violet-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400 font-mono">
              {isNewUser ? 'Começa por aqui' : 'Continuar estudo'}
            </p>
            <p className="mt-0.5 text-base font-bold text-white">
              {isNewUser ? 'DevOps & Platform Engineering' : 'Continuar em DevOps'}
            </p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-violet-400 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </button>

        {/* Domain quick-access — secundária: cor só em texto/hover, não em
            fundo sólido, para não competir com o CTA acima. */}
        <p className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 font-mono">
          Ou explora outro domínio
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {OTHER_DOMAINS.map(({ id, label, accent }) => (
            <button
              key={id}
              onClick={() => onSelectDomain(id)}
              className={`rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm font-semibold transition-all ${SECONDARY_COLORS[accent] ?? SECONDARY_COLORS.violet}`}
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
