import { AVAILABLE_BADGES } from '../../types/gamification';
import { useGamification } from '../../hooks/useGamification';
import { Lock } from 'lucide-react';

export default function BadgesShowcase() {
  const { gamification, loaded } = useGamification();

  if (!loaded) return null;

  const earnedBadges = new Set(gamification.badges);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
        <span>Conquistas</span>
        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-xs">
          {earnedBadges.size} / {AVAILABLE_BADGES.length}
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {AVAILABLE_BADGES.map((badge) => {
          const earned = earnedBadges.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col p-4 rounded-xl border transition-all ${
                earned
                  ? 'border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/15 shadow-sm'
                  : 'border-slate-800 bg-slate-900/50 opacity-60'
              }`}
            >
              {!earned && (
                <div className="absolute top-2 right-2 text-slate-600">
                  <Lock size={12} />
                </div>
              )}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full mb-3 text-2xl ${
                  earned ? 'bg-violet-500/20 shadow-inner' : 'bg-slate-800 grayscale'
                }`}
              >
                {badge.icon}
              </div>
              <h4 className={`text-sm font-bold mb-1 ${earned ? 'text-slate-200' : 'text-slate-500'}`}>
                {badge.name}
              </h4>
              <p className={`text-xs leading-relaxed ${earned ? 'text-slate-400' : 'text-slate-600'}`}>
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
