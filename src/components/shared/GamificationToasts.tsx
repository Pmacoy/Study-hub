import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGamification } from '../../hooks/useGamification';
import { AVAILABLE_BADGES } from '../../types/gamification';
import { Trophy, Star, X } from 'lucide-react';

interface ToastData {
  id: string;
  type: 'level_up' | 'badge';
  title: string;
  description: string;
  icon?: string;
}

export default function GamificationToasts() {
  const { gamification, loaded } = useGamification();
  const prevGamification = useRef(gamification);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    if (!loaded) return;

    const prev = prevGamification.current;
    const current = gamification;
    const newToasts: ToastData[] = [];

    // Check for level up
    if (current.level > prev.level) {
      newToasts.push({
        id: `level-${current.level}-${Date.now()}`,
        type: 'level_up',
        title: `Nível ${current.level} Alcançado!`,
        description: 'Parabéns, ganhaste XP suficiente para subir de nível!',
      });
    }

    // Check for new badges
    const prevBadges = new Set(prev.badges);
    const newEarnedBadges = current.badges.filter(b => !prevBadges.has(b));

    newEarnedBadges.forEach(badgeId => {
      const badgeMeta = AVAILABLE_BADGES.find(b => b.id === badgeId);
      if (badgeMeta) {
        newToasts.push({
          id: `badge-${badgeId}-${Date.now()}`,
          type: 'badge',
          title: 'Nova Conquista!',
          description: badgeMeta.name,
          icon: badgeMeta.icon,
        });
      }
    });

    if (newToasts.length > 0) {
      setToasts(t => [...t, ...newToasts]);
    }

    prevGamification.current = current;
  }, [gamification, loaded]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      setToasts(t => t.slice(1)); // Remove oldest
    }, 5000);

    return () => clearTimeout(timer);
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-4 p-4 rounded-xl border shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md min-w-[300px] max-w-[400px] ${
              toast.type === 'level_up'
                ? 'bg-violet-500/10 border-violet-500/40 text-violet-100'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
            }`}
          >
            <div className={`flex items-center justify-center h-10 w-10 shrink-0 rounded-full border ${
              toast.type === 'level_up' 
                ? 'bg-violet-500/20 border-violet-500/30' 
                : 'bg-amber-500/20 border-amber-500/30'
            }`}>
              {toast.type === 'level_up' ? (
                <Star size={20} className="text-violet-400" />
              ) : toast.icon ? (
                <span className="text-xl">{toast.icon}</span>
              ) : (
                <Trophy size={20} className="text-amber-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="font-bold text-sm tracking-wide">
                {toast.title}
              </h4>
              <p className={`text-xs mt-1 ${toast.type === 'level_up' ? 'text-violet-300' : 'text-amber-200/80'}`}>
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
