import { Trophy } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { getXpForLevel } from '../../types/gamification';

export default function UserLevelBadge() {
  const { gamification, loaded } = useGamification();

  if (!loaded) return null;

  const currentLevel = gamification.level;
  const currentXp = gamification.xp;
  const xpForCurrentLevel = getXpForLevel(currentLevel);
  const xpForNextLevel = getXpForLevel(currentLevel + 1);
  
  const xpInLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progressPct = Math.min(100, Math.max(0, (xpInLevel / xpNeededForNext) * 100));

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#181926] border border-slate-800 shadow-sm cursor-pointer hover:border-slate-700 transition-colors group">
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-slate-800 group-hover:border-violet-500/50 transition-colors">
        <Trophy size={12} className="text-violet-400 group-hover:text-violet-300" />
        <svg className="absolute -inset-[1px] h-[calc(100%+2px)] w-[calc(100%+2px)] -rotate-90 transform">
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray={81.68} // 2 * pi * 13
            strokeDashoffset={81.68 - (81.68 * progressPct) / 100}
            className="text-violet-500 transition-all duration-700 ease-out"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 leading-none">Lvl {currentLevel}</span>
        <span className="text-xs font-medium text-slate-300 leading-none mt-0.5">{currentXp} <span className="text-slate-500 text-[10px]">XP</span></span>
      </div>
    </div>
  );
}
