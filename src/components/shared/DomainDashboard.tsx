import { useEffect, useRef } from 'react';
import { GraduationCap, Zap, BookOpen, Rocket, ArrowRight } from 'lucide-react';
import type { SidebarMenuGroup } from '../../types/navigation';
import QuickStat from './QuickStat';
import BlockProgress from './BlockProgress';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// Todas as classes Tailwind por accent ficam como strings estáticas e
// completas nestes mapas — nunca interpoladas em runtime (`text-${accent}-400`
// etc.), porque o content-scanner do Tailwind lê o texto-fonte literalmente e
// não executa JS: uma classe montada dinamicamente não é encontrada e não
// gera CSS nenhum. Ver src/styles/designTokens.ts para o bug histórico que
// este padrão evita repetir.
type Accent = 'violet' | 'sky' | 'emerald' | 'amber' | 'orange' | 'rose' | 'teal' | 'cyan';

const EYEBROW_TEXT: Record<Accent, string> = {
  violet: 'text-violet-400', sky: 'text-sky-400', emerald: 'text-emerald-400',
  amber: 'text-amber-400', orange: 'text-orange-400', rose: 'text-rose-400',
  teal: 'text-teal-400', cyan: 'text-cyan-400',
};

const BORDER_L: Record<Accent, string> = {
  violet: 'border-l-violet-500/50', sky: 'border-l-sky-500/50', emerald: 'border-l-emerald-500/50',
  amber: 'border-l-amber-500/50', orange: 'border-l-orange-500/50', rose: 'border-l-rose-500/50',
  teal: 'border-l-teal-500/50', cyan: 'border-l-cyan-500/50',
};

const TILE_COLORS: Record<Accent, string> = {
  violet:  'border-violet-500/25 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40',
  sky:     'border-sky-500/25 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/40',
  emerald: 'border-emerald-500/25 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40',
  amber:   'border-amber-500/25 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40',
  orange:  'border-orange-500/25 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/40',
  rose:    'border-rose-500/25 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40',
  teal:    'border-teal-500/25 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 hover:border-teal-500/40',
  cyan:    'border-cyan-500/25 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40',
};

const CTA_COLORS: Record<Accent, string> = {
  violet:  'border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 btn-glow-violet',
  sky:     'border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 btn-glow-sky',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 btn-glow-emerald',
  amber:   'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 btn-glow-amber',
  orange:  'border-orange-500/30 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20 btn-glow-orange',
  rose:    'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 btn-glow-rose',
  teal:    'border-teal-500/30 bg-teal-500/10 text-teal-200 hover:bg-teal-500/20',
  cyan:    'border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20',
};

// Ícone quadrado do bloco "Próximo passo" — borda, fundo e cor do ícone.
const NEXT_STEP_ICON: Record<Accent, string> = {
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  teal: 'border-teal-500/30 bg-teal-500/10 text-teal-400',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
};

const NEXT_STEP_CARD_BORDER: Record<Accent, string> = {
  violet: 'border-violet-500/20', sky: 'border-sky-500/20', emerald: 'border-emerald-500/20',
  amber: 'border-amber-500/20', orange: 'border-orange-500/20', rose: 'border-rose-500/20',
  teal: 'border-teal-500/20', cyan: 'border-cyan-500/20',
};

const NEXT_STEP_ARROW: Record<Accent, string> = {
  violet: 'text-violet-400', sky: 'text-sky-400', emerald: 'text-emerald-400',
  amber: 'text-amber-400', orange: 'text-orange-400', rose: 'text-rose-400',
  teal: 'text-teal-400', cyan: 'text-cyan-400',
};

// `.card-glass-*` não é utility do Tailwind — é classe CSS escrita à mão em
// src/styles.css, por isso interpolar o nome aqui é seguro (a regra já
// existe no stylesheet, não depende do content-scanner).
const GLASS_ACCENT: Record<Accent, string> = {
  violet: 'card-glass-violet', sky: 'card-glass-sky', emerald: 'card-glass-emerald',
  amber: 'card-glass-amber', orange: 'card-glass-orange', rose: 'card-glass-rose',
  teal: 'card-glass-teal', cyan: 'card-glass-cyan',
};

const QUICK_STAT_TONE: Record<Accent, 'violet' | 'sky' | 'emerald' | 'amber' | 'orange' | 'rose'> = {
  violet: 'violet', sky: 'sky', emerald: 'emerald', amber: 'amber', orange: 'orange', rose: 'rose',
  teal: 'emerald', cyan: 'sky', // QuickStat/BlockProgress só têm tons Catppuccin — sem teal/cyan próprios
};

export type DomainDashboardAccent = Accent;

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  accent: DomainDashboardAccent;
  progressPct: number;
  studiedCount: number;
  totalCount: number;
  /** Sidebar menu groups for this domain — dashboard/exam entries are filtered out automatically. */
  menuGroups: SidebarMenuGroup[];
  visited: Set<string>;
  onOpenTab: (id: string) => void;
  nextTabId?: string;
  nextTabLabel?: string;
  examTabId?: string;
  examLabel?: string;
  onBack?: () => void;
  backLabel?: string;
}

export default function DomainDashboard({
  eyebrow, title, description, accent,
  progressPct, studiedCount, totalCount,
  menuGroups, visited, onOpenTab,
  nextTabId, nextTabLabel,
  examTabId, examLabel = 'Simulado',
  onBack, backLabel = '← Escolher outra certificação',
}: Props) {
  const heroRef = useReveal();
  const modulesRef = useReveal();
  const moduleGridRef = useReveal();

  const modules = menuGroups.flatMap(g => g.items).filter(i => i.id !== 'dashboard' && i.id !== 'exam');
  const quickStatTone = QUICK_STAT_TONE[accent];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section ref={heroRef} className={`reveal reveal-delay-1 border card-glass card-glass-hover ${GLASS_ACCENT[accent]} p-6 md:p-8 relative overflow-hidden border-l-4 ${BORDER_L[accent]}`}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className={`grid grid-cols-1 items-start gap-6 relative ${totalCount > 0 ? 'lg:grid-cols-[1.2fr_0.8fr]' : ''}`}>
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className={`text-xs font-semibold uppercase tracking-[0.14em] font-mono ${EYEBROW_TEXT[accent]}`}>
                {eyebrow}
              </p>
              {onBack && (
                <button onClick={onBack} className="text-2xs text-slate-500 hover:text-slate-300 underline underline-offset-2">
                  {backLabel}
                </button>
              )}
            </div>
            <h3 className="mt-2 text-2xl font-bold leading-tight text-white tracking-tight font-display">
              {title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
              {description}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {nextTabId && (
                <button
                  onClick={() => onOpenTab(nextTabId)}
                  className={`border px-4 py-3 text-sm font-semibold transition-all ${CTA_COLORS[accent]}`}
                >
                  Continuar estudo{nextTabLabel ? ` → ${nextTabLabel}` : ''}
                </button>
              )}
              {examTabId && (
                <button
                  onClick={() => onOpenTab(examTabId)}
                  className="border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition-all hover:bg-amber-500/20 btn-glow-amber"
                >
                  <GraduationCap size={13} className="inline mr-1.5" />{examLabel}
                </button>
              )}
            </div>
          </div>

          {totalCount > 0 && (
            <div className="space-y-3">
              <QuickStat
                icon={<Zap size={14} className="text-amber-400" />}
                label="Progresso"
                value={`${progressPct}%`}
                tone={quickStatTone}
              />
              <QuickStat
                icon={<BookOpen size={14} className="text-violet-400" />}
                label="Módulos"
                value={`${studiedCount}/${totalCount}`}
                tone="emerald"
              />
            </div>
          )}
        </div>
      </section>

      {/* Modules grid */}
      {modules.length > 0 && (
        <section ref={modulesRef} className={`reveal reveal-delay-2 border card-glass card-glass-hover ${GLASS_ACCENT[accent]} p-6 relative overflow-hidden border-l-4 ${BORDER_L[accent]}`}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.14em] font-mono ${EYEBROW_TEXT[accent]}`}>Módulos</p>
              <h3 className="mt-1 text-lg font-bold text-white font-display">Todos os módulos</h3>
            </div>
            <BlockProgress value={studiedCount} max={totalCount} tone={quickStatTone} showPct={true} />
          </div>

          <div ref={moduleGridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 stagger-children">
            {modules.map(m => {
              const done = visited.has(m.id);
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => onOpenTab(m.id)}
                  className={`flex flex-col items-center gap-2 p-3 border transition-all ${TILE_COLORS[accent]} group`}
                >
                  <div className="relative">
                    <Icon size={18} />
                    {done && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 live-dot" />
                    )}
                  </div>
                  <span className="text-2xs font-medium text-center leading-tight line-clamp-2 group-hover:text-white transition-colors">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick action: continue */}
      {nextTabId && (
        <section className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onOpenTab(nextTabId)}
            className={`border card-glass card-glass-hover ${GLASS_ACCENT[accent]} p-5 text-left transition-all group ${NEXT_STEP_CARD_BORDER[accent]} relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center border ${NEXT_STEP_ICON[accent]}`}>
                <Rocket size={16} />
              </div>
              <div>
                <div className="text-2xs font-black text-slate-500 uppercase tracking-widest font-mono">Próximo passo</div>
                <div className="text-sm font-bold text-white font-display">{nextTabLabel ?? 'Continuar'}</div>
              </div>
              <ArrowRight size={14} className={`ml-auto opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 ${NEXT_STEP_ARROW[accent]}`} />
            </div>
          </button>
        </section>
      )}
    </div>
  );
}
