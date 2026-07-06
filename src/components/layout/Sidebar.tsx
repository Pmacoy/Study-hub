import { ChevronRight, Target, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MenuItem { id: string; label: string; sublabel: string; icon: LucideIcon; }
interface MenuGroup { title: string; items: MenuItem[]; }

interface Props {
  activeTab: string;
  visitedTabs: Set<string>;
  progressPct: number;
  studiedCount: number;
  totalTabs: number;
  menuGroups: MenuGroup[];
  accentColor: string; // 'violet' | 'sky' | 'emerald'
  onOpenTab: (tab: string) => void;
}

const ACCENT: Record<string, { active: string; icon: string; dot: string; bar: string }> = {
  violet: { active: 'border-violet-500/20 bg-violet-500/15 text-white', icon: 'text-violet-300', dot: 'bg-emerald-400', bar: 'from-violet-500 to-fuchsia-500' },
  sky:    { active: 'border-sky-500/20 bg-sky-500/15 text-white',    icon: 'text-sky-300',    dot: 'bg-emerald-400', bar: 'from-sky-500 to-blue-500' },
  emerald:{ active: 'border-emerald-500/20 bg-emerald-500/15 text-white', icon: 'text-emerald-300', dot: 'bg-emerald-400', bar: 'from-emerald-500 to-teal-500' },
};

export default function Sidebar({ activeTab, visitedTabs, progressPct, studiedCount, totalTabs, menuGroups, accentColor, onOpenTab }: Props) {
  const a = ACCENT[accentColor] ?? ACCENT['violet'];

  return (
    <aside className="space-y-6">
      <nav className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
        {menuGroups.map((group) => (
          <div key={group.title} className="mt-6 first:mt-0">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const isVisited = visitedTabs.has(item.id);
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => onOpenTab(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${isActive ? `${a.active} border-current/20` : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <div className={isActive ? a.icon : 'text-slate-500 group-hover:text-slate-300'}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[13px] font-medium leading-none ${isActive ? 'text-white' : ''}`}>{item.label}</div>
                      <div className="mt-1 truncate text-[11px] text-slate-500">{item.sublabel}</div>
                    </div>
                    <div className="shrink-0">
                      {isActive ? (
                        <ChevronRight size={14} className={a.icon} />
                      ) : isVisited ? (
                        <div className={`h-2 w-2 rounded-full ${a.dot}`} />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Progress card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Progresso</p>
          <Trophy size={14} className="text-amber-400" />
        </div>
        <div className="mb-2 flex items-end justify-between">
          <span className="text-2xl font-bold text-white">{progressPct}%</span>
          <span className="text-[12px] text-slate-500">{studiedCount}/{totalTabs} módulos</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full rounded-full bg-gradient-to-r ${a.bar} transition-all duration-700`}
            style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
          <Target size={12} className={a.icon} />
          {progressPct < 100 ? `${totalTabs - studiedCount} módulos restantes` : 'Todos os módulos concluídos! 🎉'}
        </div>
      </div>
    </aside>
  );
}
