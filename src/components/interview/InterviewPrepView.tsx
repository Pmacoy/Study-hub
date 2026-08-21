import { useState, useMemo } from 'react';
import { ChevronDown, Search, Shuffle, BookOpen, Eye, EyeOff, RotateCcw, Check, X } from 'lucide-react';
import { INTERVIEW_SECTIONS, TOTAL_INTERVIEW_QUESTIONS } from '../../data/interviewQuestions';
import type { InterviewQuestion } from '../../data/interviewQuestions';
import { ADVANCED_MODULES, TOTAL_ADVANCED_QUESTIONS } from '../../data/advancedInterview';
import InterviewTechniqueView from './InterviewTechniqueView';
import { useLang } from '../../i18n/LangContext';

interface Props {
  onExit: () => void;
}

type Mode = 'study' | 'drill';
type Level = 'quick' | 'deep';
type Tab = 'questions' | 'technique';

function QACard({ item, sectionEmoji }: { item: InterviewQuestion; sectionEmoji: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-slate-900/50 transition-colors">
        <span className="shrink-0 text-[10px] font-black text-slate-600 w-6 pt-0.5">{item.n}</span>
        <span className="flex-1 text-[12px] font-semibold text-slate-200">{item.q}</span>
        <ChevronDown size={14} className={`shrink-0 mt-0.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pl-12">
          <p className="text-[12px] text-slate-400 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function InterviewPrepView({ onExit }: Props) {
  const [mode, setMode] = useState<Mode>('study');
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('questions');
  const [level, setLevel] = useState<Level>('quick');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandAll, setExpandAll] = useState(false);

  // Drill mode state
  const [drillDeck, setDrillDeck] = useState<{ q: InterviewQuestion; emoji: string }[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState(0);

  const bank = level === 'quick' ? INTERVIEW_SECTIONS : ADVANCED_MODULES;
  const bankTotal = level === 'quick' ? TOTAL_INTERVIEW_QUESTIONS : TOTAL_ADVANCED_QUESTIONS;

  const visibleSections = useMemo(() => {
    let secs = activeSection === 'all'
      ? bank
      : bank.filter(s => s.id === activeSection);

    if (search.trim()) {
      const q = search.toLowerCase();
      secs = secs
        .map(s => ({ ...s, questions: s.questions.filter(x =>
          x.q.toLowerCase().includes(q) || x.a.toLowerCase().includes(q)) }))
        .filter(s => s.questions.length > 0);
    }
    return secs;
  }, [activeSection, search, bank]);

  const startDrill = () => {
    const pool = (activeSection === 'all'
      ? bank
      : bank.filter(s => s.id === activeSection)
    ).flatMap(s => s.questions.map(q => ({ q, emoji: s.emoji })));

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDrillDeck(shuffled);
    setDrillIndex(0);
    setShowAnswer(false);
    setKnown(0);
    setReview(0);
    setMode('drill');
  };

  const answerDrill = (isKnown: boolean) => {
    if (isKnown) setKnown(k => k + 1); else setReview(r => r + 1);
    if (drillIndex + 1 < drillDeck.length) {
      setDrillIndex(i => i + 1);
      setShowAnswer(false);
    } else {
      setDrillIndex(drillDeck.length); // finished
    }
  };

  // ── Drill mode ────────────────────────────────────────────────
  if (mode === 'drill') {
    const finished = drillIndex >= drillDeck.length;
    const card = drillDeck[drillIndex];

    if (finished) {
      const pct = drillDeck.length > 0 ? Math.round((known / drillDeck.length) * 100) : 0;
      return (
        <div className="space-y-5">
          <button onClick={() => setMode('study')} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
            ← Voltar ao estudo
          </button>
          <section className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h2 className="text-xl font-bold text-white">{t('int.sessionDone')}</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-2xl font-black text-emerald-300">{known}</div>
                <div className="text-[9px] text-slate-500 uppercase mt-1">{t('int.knew')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-2xl font-black text-amber-300">{review}</div>
                <div className="text-[9px] text-slate-500 uppercase mt-1">{t('int.review')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-2xl font-black text-white">{pct}%</div>
                <div className="text-[9px] text-slate-500 uppercase mt-1">{t('int.mastery')}</div>
              </div>
            </div>
            {review > 0 && (
              <p className="mt-4 text-[12px] text-slate-400">
                
              </p>
            )}
          </section>
          <div className="flex gap-3">
            <button onClick={() => setMode('study')}
              className="flex-1 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700">
              Modo estudo
            </button>
            <button onClick={startDrill}
              className="flex-1 py-3 rounded-2xl border border-violet-500/40 bg-violet-500/15 text-violet-300 font-semibold hover:bg-violet-500/25">
              <RotateCcw size={13} className="inline mr-1" /> Nova sessão
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <button onClick={() => setMode('study')} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
          ← Sair da sessão
        </button>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">{drillIndex + 1} / {drillDeck.length}</span>
          <div className="flex gap-3">
            <span className="text-emerald-300">✓ {known}</span>
            <span className="text-amber-300">↻ {review}</span>
          </div>
        </div>
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${((drillIndex) / drillDeck.length) * 100}%` }} />
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 min-h-[280px] flex flex-col">
          <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-3">
            {card.emoji} Pergunta {card.q.n}
          </div>
          <h3 className="text-[16px] font-semibold text-white leading-relaxed">{card.q.q}</h3>

          {showAnswer ? (
            <div className="mt-5 p-4 rounded-2xl border border-sky-500/25 bg-sky-500/5 flex-1">
              <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1.5">{t('int.answer')}</div>
              <p className="text-[13px] text-sky-100 leading-relaxed">{card.q.a}</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <button onClick={() => setShowAnswer(true)}
                className="px-5 py-2.5 rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 text-[13px] font-semibold hover:border-slate-600">
                <Eye size={14} className="inline mr-1.5" /> Revelar resposta
              </button>
            </div>
          )}

          {showAnswer && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => answerDrill(false)}
                className="py-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[13px] font-semibold hover:bg-amber-500/20">
                <X size={14} className="inline mr-1" /> Rever
              </button>
              <button onClick={() => answerDrill(true)}
                className="py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[13px] font-semibold hover:bg-emerald-500/20">
                <Check size={14} className="inline mr-1" /> Sabia
              </button>
            </div>
          )}
        </section>

        <p className="text-center text-[11px] text-slate-600">
          {t('int.answerFirst')}
        </p>
      </div>
    );
  }

  // ── Técnica de entrevista ─────────────────────────────────────
  if (tab === 'technique') {
    return <InterviewTechniqueView onExit={() => setTab('questions')} />;
  }

  // ── Study mode ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💬</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('int.eyebrow')}</div>
            <h1 className="text-2xl font-bold text-white">{bankTotal} {t('int.questionsOf')}</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              {level === 'quick'
                ? t('int.quickDesc')
                : t('int.deepDesc')}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => setTab('questions')}
            className="px-3 py-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 text-[11px] font-semibold">
            Banco de perguntas
          </button>
          <button onClick={() => setTab('technique')}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-[11px] font-semibold hover:border-sky-500/40 hover:text-sky-300">
            🎙️ Como responder
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => { setLevel('quick'); setActiveSection('all'); }}
            className={`p-3 rounded-2xl border text-left transition-all ${level === 'quick' ? 'border-violet-500/40 bg-violet-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
            <div className="text-[12px] font-bold text-white">{t('int.quickLevel')}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{TOTAL_INTERVIEW_QUESTIONS} {t('common.questions')} · 10 {t('int.sections')}</div>
          </button>
          <button onClick={() => { setLevel('deep'); setActiveSection('all'); }}
            className={`p-3 rounded-2xl border text-left transition-all ${level === 'deep' ? 'border-violet-500/40 bg-violet-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
            <div className="text-[12px] font-bold text-white">{t('int.deepLevel')}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{TOTAL_ADVANCED_QUESTIONS} {t('common.questions')} · 27 {t('int.modules')}</div>
          </button>
        </div>

        <div className="mt-3 flex gap-3">
          <button onClick={startDrill}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-violet-500/40 bg-violet-500/15 text-violet-200 text-[13px] font-semibold hover:bg-violet-500/25">
            <Shuffle size={14} /> Sessão de treino
          </button>
          <button onClick={() => setExpandAll(!expandAll)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 text-[13px] font-semibold hover:border-slate-700">
            {expandAll ? <><EyeOff size={14} /> Fechar todas</> : <><BookOpen size={14} /> Ver respostas</>}
          </button>
        </div>
      </section>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('int.searchPlaceholder')}
          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-[12px] text-slate-200 placeholder-slate-600 focus:border-violet-500/40 focus:outline-none"
        />
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${activeSection === 'all' ? 'border-violet-500/40 bg-violet-500/10 text-violet-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
          {t('common.all')} ({bankTotal})
        </button>
        {bank.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${activeSection === s.id ? 'border-violet-500/40 bg-violet-500/10 text-violet-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      {/* Sections */}
      {visibleSections.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center">
          <p className="text-[13px] text-slate-500">{t('int.noMatch')} "{search}".</p>
        </div>
      ) : (
        visibleSections.map(section => (
          <section key={section.id} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg">{section.emoji}</span>
              <h2 className="text-[15px] font-bold text-white">{section.title}</h2>
              <span className="text-[11px] text-slate-600">{section.range}</span>
            </div>
            <div className="space-y-1.5">
              {section.questions.map(item => (
                expandAll ? (
                  <div key={item.n} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[10px] font-black text-slate-600 w-6 pt-0.5">{item.n}</span>
                      <div className="flex-1">
                        <div className="text-[12px] font-semibold text-slate-200">{item.q}</div>
                        <p className="text-[12px] text-slate-400 leading-relaxed mt-1.5">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <QACard key={item.n} item={item} sectionEmoji={section.emoji} />
                )
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
