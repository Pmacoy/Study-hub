import type { SidebarMenuGroup } from '../../types/navigation';
import { ChevronRight, TrendingUp } from 'lucide-react';
import BlockProgress from '../shared/BlockProgress';
import CircularProgressRing from '../shared/CircularProgressRing';

interface Props {
  activeTab: string;
  visitedTabs: Set<string>;
  progressPct: number;
  studiedCount: number;
  totalTabs: number;
  menuGroups: SidebarMenuGroup[];
  accentColor: string;
  onOpenTab: (tab: string) => void;
}

const ACCENT: Record<string, { active: string; icon: string; dot: string; border: string; ring: string }> = {
  violet:  { active: 'border-l-2 border-l-violet-500 bg-violet-500/10 text-white', icon: 'text-violet-400', dot: 'bg-emerald-400', border: 'border-violet-500/20', ring: 'text-violet-400' },
  sky:     { active: 'border-l-2 border-l-sky-500 bg-sky-500/10 text-white',       icon: 'text-sky-400',    dot: 'bg-emerald-400', border: 'border-sky-500/20', ring: 'text-sky-400' },
  emerald:{ active: 'border-l-2 border-l-emerald-500 bg-emerald-500/10 text-white', icon: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20', ring: 'text-emerald-400' },
  amber:   { active: 'border-l-2 border-l-amber-500 bg-amber-500/10 text-white',   icon: 'text-amber-400',  dot: 'bg-emerald-400', border: 'border-amber-500/20', ring: 'text-amber-400' },
  orange:  { active: 'border-l-2 border-l-orange-500 bg-orange-500/10 text-white', icon: 'text-orange-400', dot: 'bg-emerald-400', border: 'border-orange-500/20', ring: 'text-orange-400' },
  rose:    { active: 'border-l-2 border-l-rose-500 bg-rose-500/10 text-white',     icon: 'text-rose-400',   dot: 'bg-emerald-400', border: 'border-rose-500/20', ring: 'text-rose-400' },
};

function AccentBar({ color }: { color: string }) {
  const cls: Record<string, string> = {
    violet:  'via-violet-500/50',
    sky:     'via-sky-500/50',
    emerald: 'via-emerald-500/50',
    amber:   'via-amber-500/50',
    orange:  'via-orange-500/50',
    rose:    'via-rose-500/50',
  };
  return (
    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${cls[color] ?? cls.violet} to-transparent`} />
  );
}

export default function Sidebar({ activeTab, visitedTabs, progressPct, studiedCount, totalTabs, menuGroups, accentColor, onOpenTab }: Props) {
  const a = ACCENT[accentColor] ?? ACCENT['violet'];
  const remaining = totalTabs - studiedCount;

  return (
    <aside className="space-y-3">
      {/* Progress ring card */}
      <div className={`border card-glass card-glass-hover ${a.border} p-4 relative overflow-hidden`}>
        <AccentBar color={accentColor} />
        <div className="flex items-center gap-4">
          <CircularProgressRing percent={progressPct} tone={accentColor as any} />
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp size={12} className={a.icon} />
              <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-slate-500 font-mono">Progresso global</p>
              {progressPct === 100 && <div className="live-dot live-dot-emerald ml-auto" />}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className={`text-lg font-black font-mono ${a.ring}`}>{studiedCount}</span>
                <span className="text-xs text-slate-600 font-mono">/ {totalTabs} módulos</span>
              </div>
              {progressPct < 100 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progressPct}%`,
                        background: accentColor === 'violet' ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                          : accentColor === 'sky' ? 'linear-gradient(90deg, #0284c7, #22d3ee)'
                          : accentColor === 'emerald' ? 'linear-gradient(90deg, #059669, #34d399)'
                          : accentColor === 'amber' ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                          : accentColor === 'orange' ? 'linear-gradient(90deg, #ea580c, #fb923c)'
                          : 'linear-gradient(90deg, #e11d48, #fb7185)',
                      }}
                    />
                  </div>
                  <span className="text-2xs text-slate-500 font-mono shrink-0">{remaining} restantes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`border card-glass card-glass-hover ${a.border} p-3 relative overflow-hidden`}>
        <AccentBar color={accentColor} />

        {menuGroups.map((group) => (
          <div key={group.title} className="mt-4 first:mt-0">
            <p className="mb-1.5 px-2 text-2xs font-semibold uppercase tracking-[0.18em] text-slate-500 font-mono">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const isVisited = visitedTabs.has(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onOpenTab(item.id)}
                    className={`group flex w-full items-center gap-3 px-3 py-2 text-left transition-all border-l-2 ${
                      isActive
                        ? `${a.active} border-l-current`
                        : `border-l-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200`
                    }`}
                  >
                    <div className={`${isActive ? a.icon : 'text-slate-600 group-hover:text-slate-400'}`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-medium leading-none ${isActive ? 'text-white font-bold' : ''}`}>
                        {item.label}
                      </div>
                      <div className="mt-0.5 truncate text-2xs text-slate-600 font-mono">{item.sublabel}</div>
                    </div>
                    <div className="shrink-0">
                      {isActive ? (
                        <ChevronRight size={13} className={a.icon} />
                      ) : isVisited ? (
                        <div className={`h-1.5 w-1.5 ${a.dot} rounded-sm`} />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick stats row */}
      <div className={`border card-glass ${a.border} p-3 flex items-center justify-between`}>
        <div className="text-center">
          <div className={`text-sm font-black font-mono ${a.ring}`}>{visitedTabs.size}</div>
          <div className="text-2xs text-slate-600 font-mono mt-0.5">Visitados</div>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="text-center">
          <div className="text-sm font-black font-mono text-emerald-400">
            {Array.from(visitedTabs).filter(id => id !== 'exam').reduce((a, id) => {
              // Count completed tabs (simplified)
              return a;
            }, 0)}
          </div>
          <div className="text-2xs text-slate-600 font-mono mt-0.5">Completos</div>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="text-center">
          <BlockProgress value={progressPct} max={100} tone={accentColor as any} showPct={false} />
        </div>
      </div>
    </aside>
  );
}
