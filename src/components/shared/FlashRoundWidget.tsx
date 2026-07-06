import { useEffect, useMemo, useState, useCallback } from 'react';
import { X, Zap, ThumbsUp, ThumbsDown, RotateCcw, Trophy } from 'lucide-react';
import { ALL_FLASHCARDS } from '../../data/flashcards';
import type { Flashcard, FlashRoundResult } from '../../types/flashcard';

const ROUND_SECONDS = 60;
const MIN_CARDS_TO_FINISH = 3;

function shuffledDeck(): Flashcard[] {
  const arr = [...ALL_FLASHCARDS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DOMAIN_COLOR: Record<string, string> = {
  devops: 'violet',
  azure: 'sky',
  networking: 'emerald',
};

export default function FlashRoundWidget({ onClose, onComplete }: { onClose: () => void; onComplete: (result: FlashRoundResult) => void }) {
  const deck = useMemo(() => shuffledDeck(), []);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(true);
  const [knewCount, setKnewCount] = useState(0);
  const [seenCount, setSeenCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const card = deck[cardIdx % deck.length];
  const color = DOMAIN_COLOR[card.domain] ?? 'amber';

  // Countdown
  useEffect(() => {
    if (!running || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, running, finished]);

  const handleRate = useCallback((knew: boolean) => {
    setSeenCount(s => s + 1);
    if (knew) {
      setKnewCount(k => k + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setFlipped(false);
    setCardIdx(i => i + 1);
  }, []);

  const handleFinishEarly = () => {
    setFinished(true);
    setRunning(false);
  };

  const handleClose = () => {
    if (finished && seenCount >= MIN_CARDS_TO_FINISH) {
      onComplete({ cardsSeen: seenCount, knewCount, bestStreak, durationSec: ROUND_SECONDS - timeLeft });
    }
    onClose();
  };

  const colorClasses: Record<string, string> = {
    violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    sky: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4" onClick={handleClose}>
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" fill="currentColor" />
            <span className="text-[13px] font-bold text-white">Cartões Relâmpago</span>
          </div>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
        </div>

        {!finished ? (
          <>
            {/* Stats row */}
            <div className="flex items-center justify-between mb-4">
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${timeLeft <= 10 ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-slate-900 text-slate-400'}`}>
                ⏱ {timeLeft}s
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>{seenCount} vistos</span>
                {streak > 1 && <span className="text-amber-400 font-bold">🔥 {streak} seguidos</span>}
              </div>
            </div>

            {/* Card */}
            <button
              onClick={() => setFlipped(f => !f)}
              className={`w-full min-h-[180px] rounded-2xl border-2 p-6 flex flex-col items-center justify-center text-center transition-all ${colorClasses[color]}`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-3">{card.category} {flipped ? '· Resposta' : '· Toca para virar'}</span>
              <span className="text-[16px] font-semibold text-white leading-relaxed">
                {flipped ? card.back : card.front}
              </span>
            </button>

            {/* Rating buttons */}
            {flipped ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={() => handleRate(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-semibold text-[12px] hover:bg-rose-500/20 transition-all">
                  <ThumbsDown size={14} /> Não sabia
                </button>
                <button onClick={() => handleRate(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold text-[12px] hover:bg-emerald-500/20 transition-all">
                  <ThumbsUp size={14} /> Sabia
                </button>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <span className="text-[11px] text-slate-600">Clica no cartão para revelar a resposta</span>
              </div>
            )}

            {seenCount >= MIN_CARDS_TO_FINISH && (
              <button onClick={handleFinishEarly} className="w-full mt-4 text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
                Terminar ronda agora
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <Trophy size={36} className={seenCount >= MIN_CARDS_TO_FINISH ? 'text-amber-400 mx-auto' : 'text-slate-600 mx-auto'} />
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-black text-white">{seenCount}</div>
                <div className="text-[9px] text-slate-500 uppercase mt-1">Vistos</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-black text-emerald-400">{knewCount}</div>
                <div className="text-[9px] text-slate-500 uppercase mt-1">Sabias</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-black text-amber-400">{bestStreak}</div>
                <div className="text-[9px] text-slate-500 uppercase mt-1">Melhor seq.</div>
              </div>
            </div>
            {seenCount >= MIN_CARDS_TO_FINISH ? (
              <p className="text-[12px] text-slate-400">Ronda registada — streak diário actualizado!</p>
            ) : (
              <p className="text-[12px] text-amber-400">Vê pelo menos {MIN_CARDS_TO_FINISH} cartões para a ronda contar.</p>
            )}
            <div className="flex gap-2 justify-center">
              {seenCount < MIN_CARDS_TO_FINISH && (
                <button onClick={() => { setFinished(false); setRunning(true); setTimeLeft(ROUND_SECONDS); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[12px] font-semibold hover:bg-amber-500/25">
                  <RotateCcw size={13} /> Tentar de novo
                </button>
              )}
              <button onClick={handleClose} className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[12px] font-semibold hover:border-slate-600">
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
