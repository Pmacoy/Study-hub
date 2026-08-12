import { useState } from 'react';
import { ChevronDown, MessageCircleQuestion, Shuffle, Eye, Check, X, RotateCcw } from 'lucide-react';
import { relatedQuestionsFor } from '../../data/moduleQuestions';
import type { AdvancedQuestion } from '../../data/advancedInterview';

interface Props {
  domain: string;
  tab: string;
}

function QARow({ item }: { item: AdvancedQuestion }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-slate-900/50 transition-colors">
        <span className="shrink-0 text-[10px] font-black text-slate-600 w-7 pt-0.5">Q{item.n}</span>
        <span className="flex-1 text-[12px] font-semibold text-slate-200">{item.q}</span>
        <ChevronDown size={13} className={`shrink-0 mt-0.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pl-12">
          <p className="text-[12px] text-slate-400 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function ModuleQuestionsCard({ domain, tab }: Props) {
  const sets = relatedQuestionsFor(domain, tab);
  const [expanded, setExpanded] = useState(false);
  const [drill, setDrill] = useState<AdvancedQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [known, setKnown] = useState(0);

  if (sets.length === 0) return null;

  const all = sets.flatMap(s => s.questions);

  const startDrill = () => {
    const d = [...all];
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    setDrill(d); setIdx(0); setShowAns(false); setKnown(0);
  };

  // ── Modo treino ──────────────────────────────────────────────
  if (drill) {
    const finished = idx >= drill.length;
    if (finished) {
      return (
        <section className="rounded-3xl border border-sky-500/25 bg-sky-500/5 p-6 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-[15px] font-bold text-white">
            {known} de {drill.length} sabias
          </h3>
          <p className="text-[12px] text-slate-400 mt-1">
            {known === drill.length
              ? 'Domínio completo deste tema.'
              : `Volta às ${drill.length - known} que marcaste para rever.`}
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <button onClick={() => setDrill(null)}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 text-[12px] hover:border-slate-700">
              Fechar
            </button>
            <button onClick={startDrill}
              className="px-4 py-2 rounded-xl border border-sky-500/40 bg-sky-500/15 text-sky-300 text-[12px] font-semibold hover:bg-sky-500/25">
              <RotateCcw size={12} className="inline mr-1" /> Repetir
            </button>
          </div>
        </section>
      );
    }

    const card = drill[idx];
    return (
      <section className="rounded-3xl border border-sky-500/25 bg-slate-950/70 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-slate-500">{idx + 1} de {drill.length}</span>
          <button onClick={() => setDrill(null)} className="text-[11px] text-slate-500 hover:text-slate-300">
            Sair
          </button>
        </div>
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden mb-4">
          <div className="h-full bg-sky-500 transition-all" style={{ width: `${(idx / drill.length) * 100}%` }} />
        </div>

        <h3 className="text-[14px] font-semibold text-white leading-relaxed">{card.q}</h3>

        {showAns ? (
          <>
            <div className="mt-4 p-3 rounded-2xl border border-sky-500/25 bg-sky-500/5">
              <p className="text-[12px] text-sky-100 leading-relaxed">{card.a}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => { setIdx(idx + 1); setShowAns(false); }}
                className="py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[12px] font-semibold hover:bg-amber-500/20">
                <X size={12} className="inline mr-1" /> Rever
              </button>
              <button onClick={() => { setKnown(known + 1); setIdx(idx + 1); setShowAns(false); }}
                className="py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[12px] font-semibold hover:bg-emerald-500/20">
                <Check size={12} className="inline mr-1" /> Sabia
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setShowAns(true)}
            className="mt-4 w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-[12px] font-semibold hover:border-slate-600">
            <Eye size={13} className="inline mr-1.5" /> Revelar resposta
          </button>
        )}
      </section>
    );
  }

  // ── Modo lista ───────────────────────────────────────────────
  return (
    <section className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion size={15} className="text-sky-400" />
          <div>
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
              Perguntas de entrevista sobre este tema
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {all.length} perguntas · {sets.map(s => s.title).join(' · ')}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={startDrill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-200 text-[11px] font-semibold hover:bg-sky-500/20">
            <Shuffle size={11} /> Treinar
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-[11px] font-semibold hover:border-slate-700">
            {expanded ? 'Fechar' : 'Ver todas'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          {sets.map(set => (
            <div key={set.moduleId}>
              {sets.length > 1 && (
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  {set.emoji} {set.title}
                </div>
              )}
              <div className="space-y-1.5">
                {set.questions.map(q => <QARow key={q.n} item={q} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
