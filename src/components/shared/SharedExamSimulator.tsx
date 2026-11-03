import { useState, useMemo, useCallback } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  BarChart3,
  Trophy,
  Zap
} from 'lucide-react';
import { useQuizEngine, type Question } from '../../hooks/useQuizEngine';
import FlashRoundWidget from './FlashRoundWidget';

export interface ExamTopicFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Extensão do Question genérico para adicionar metadata útil no UI (dificuldade)
export interface ExamQuestion extends Question {
  topicId: string; // para filtragem
}

export interface SharedExamSimulatorProps {
  title: string;
  subtitle: string;
  accent: 'orange' | 'sky' | 'rose' | 'emerald' | 'violet' | 'cyan' | 'amber' | 'fuchsia' | 'red' | 'teal';
  questions: ExamQuestion[];
  topics: ExamTopicFilter[];
  examTimeMinutes: number; // e.g. 130
  passPercentage: number; // e.g. 72
  domainId?: string; // para os flashcards
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SharedExamSimulator({
  title,
  subtitle,
  accent,
  questions: allQuestions,
  topics,
  examTimeMinutes,
  passPercentage,
  domainId,
}: SharedExamSimulatorProps) {
  // Configuração do menu
  const [topic, setTopic] = useState<string>('all');
  const [count, setCount] = useState<number>(20);
  const [timed, setTimed] = useState<boolean>(false);
  const [flashcardsMode, setFlashcardsMode] = useState<boolean>(false);

  const [picked, setPicked] = useState<ExamQuestion[]>([]);
  const [startTs, setStartTs] = useState<number>(0);

  const { state, score, percentage, handleStartWith, handleAnswer, handleNext, handleReset } =
    useQuizEngine({ questions: [], autoShuffle: false });

  const availableForTopic = useMemo(
    () => topic === 'all' ? allQuestions : allQuestions.filter(q => q.topicId === topic),
    [topic, allQuestions]
  );

  const handleStart = useCallback(() => {
    const raw = shuffle(availableForTopic).slice(0, Math.min(count, availableForTopic.length));
    setPicked(raw);
    setStartTs(Date.now());
    
    // Calcula o tempo por questão baseado no tempo total do exame. 
    // Ex: 130 min para 65 questões = 2 min (120s) por questão.
    const expectedTotalQuestions = allQuestions.length > 50 ? 65 : 45; // Heurística aproximada
    const timePerQuestionSec = Math.round((examTimeMinutes * 60) / expectedTotalQuestions);
    
    handleStartWith(raw, timed ? raw.length * timePerQuestionSec : undefined);
  }, [availableForTopic, count, timed, handleStartWith, examTimeMinutes, allQuestions.length]);

  const questions = picked;
  const answers = state.answers;
  const current = state.current;
  const showFeedback = state.showExplanation;
  const remainingSec = state.timeRemaining ?? 0;
  const correctCount = score;
  const pct = percentage;
  const durationSec = Math.round((Date.now() - startTs) / 1000);

  // Mapeamento de cores baseado no sotaque (accent)
  const colors = {
    orange: { text: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500', bgSubtle: 'bg-orange-500/10', borderSubtle: 'border-orange-500/40', textLight: 'text-orange-300', bgHover: 'hover:bg-orange-500/25' },
    sky: { text: 'text-sky-400', bg: 'bg-sky-500', border: 'border-sky-500', bgSubtle: 'bg-sky-500/10', borderSubtle: 'border-sky-500/40', textLight: 'text-sky-300', bgHover: 'hover:bg-sky-500/25' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500', bgSubtle: 'bg-rose-500/10', borderSubtle: 'border-rose-500/40', textLight: 'text-rose-300', bgHover: 'hover:bg-rose-500/25' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500', bgSubtle: 'bg-emerald-500/10', borderSubtle: 'border-emerald-500/40', textLight: 'text-emerald-300', bgHover: 'hover:bg-emerald-500/25' },
    violet: { text: 'text-violet-400', bg: 'bg-violet-500', border: 'border-violet-500', bgSubtle: 'bg-violet-500/10', borderSubtle: 'border-violet-500/40', textLight: 'text-violet-300', bgHover: 'hover:bg-violet-500/25' },
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500', bgSubtle: 'bg-cyan-500/10', borderSubtle: 'border-cyan-500/40', textLight: 'text-cyan-300', bgHover: 'hover:bg-cyan-500/25' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500', bgSubtle: 'bg-amber-500/10', borderSubtle: 'border-amber-500/40', textLight: 'text-amber-300', bgHover: 'hover:bg-amber-500/25' },
    fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', bgSubtle: 'bg-fuchsia-500/10', borderSubtle: 'border-fuchsia-500/40', textLight: 'text-fuchsia-300', bgHover: 'hover:bg-fuchsia-500/25' },
    red: { text: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500', bgSubtle: 'bg-red-500/10', borderSubtle: 'border-red-500/40', textLight: 'text-red-300', bgHover: 'hover:bg-red-500/25' },
    teal: { text: 'text-teal-400', bg: 'bg-teal-500', border: 'border-teal-500', bgSubtle: 'bg-teal-500/10', borderSubtle: 'border-teal-500/40', textLight: 'text-teal-300', bgHover: 'hover:bg-teal-500/25' },
  }[accent];

  // ── Menu ────────────────────────────────────────────────────
  if (state.mode === 'menu' && flashcardsMode) {
    return (
      <div className="h-[600px] w-full relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0f1015]">
        <FlashRoundWidget 
          domain={domainId}
          onClose={() => { setFlashcardsMode(false); handleReset(); }} 
          onComplete={(res) => { 
            setFlashcardsMode(false); 
            handleReset(); 
          }} 
        />
      </div>
    );
  }

  // Menu inicial
  if (state.mode === 'menu') {
    return (
      <div className="space-y-6">
        <section className={`rounded-3xl border ${colors.borderSubtle} ${colors.bgSubtle} p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap size={24} className={colors.text} />
            <div>
              <div className={`text-[10px] font-black ${colors.text} uppercase tracking-widest`}>Simulado</div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
          </div>
          <p className="text-[13px] text-slate-400">
            {allQuestions.length} questões disponíveis no banco.<br/>
            {subtitle}<br/>
            O exame real costuma ter um tempo de {examTimeMinutes} minutos e {passPercentage}% de aprovação.
          </p>
        </section>

        {/* Tópico */}
        <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-5">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Tópico</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button onClick={() => setTopic('all')}
              className={`p-3 rounded-2xl border text-left transition-all ${topic === 'all' ? `${colors.borderSubtle} ${colors.bgSubtle}` : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <div className="text-[12px] font-semibold text-white mt-1">Todos os tópicos</div>
              <div className="text-[10px] text-slate-400">{allQuestions.length} Q</div>
            </button>

            {topics.map(t => {
              const qCount = allQuestions.filter(q => q.topicId === t.id).length;
              if (qCount === 0) return null; // Esconder tópicos sem questões
              return (
                <button key={t.id} onClick={() => setTopic(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${topic === t.id ? `${colors.borderSubtle} ${colors.bgSubtle}` : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                  <div className="text-base">{t.icon}</div>
                  <div className="text-[12px] font-semibold text-white mt-1">{t.label}</div>
                  <div className="text-[10px] text-slate-400">{qCount} Q</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Contagem */}
        <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-5">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Quantas questões?</div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 45, 65].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`p-3 rounded-2xl border text-center transition-all ${count === n ? `${colors.borderSubtle} ${colors.bgSubtle} ${colors.textLight}` : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                <div className="text-lg font-black">{n}</div>
                <div className="text-[9px] uppercase mt-1">questões</div>
              </button>
            ))}
          </div>
        </section>

        {/* Modo */}
        <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-5">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Modo</div>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setTimed(false)}
              className={`p-4 rounded-2xl border text-left transition-all ${!timed ? `${colors.borderSubtle} ${colors.bgSubtle}` : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <BookOpen size={16} className={`mb-2 ${!timed ? colors.text : 'text-slate-400'}`} />
              <div className="text-[13px] font-bold text-white">Prática</div>
              <div className="text-[10px] text-slate-400 mt-1">Feedback imediato</div>
            </button>
            <button onClick={() => setTimed(true)}
              className={`p-4 rounded-2xl border text-left transition-all ${timed ? `${colors.borderSubtle} ${colors.bgSubtle}` : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <Clock size={16} className={`mb-2 ${timed ? colors.text : 'text-slate-400'}`} />
              <div className="text-[13px] font-bold text-white">Simulado</div>
              <div className="text-[10px] text-slate-400 mt-1">Timer · resultado no fim</div>
            </button>
            <button onClick={() => setFlashcardsMode(true)}
              className="p-4 rounded-2xl border text-left transition-all border-slate-800 bg-slate-900 hover:border-slate-700">
              <Zap size={16} className="mb-2 text-slate-400" />
              <div className="text-[13px] font-bold text-white">Flashcards</div>
              <div className="text-[10px] text-slate-400 mt-1">Revisão rápida</div>
            </button>
          </div>
        </section>

        <button onClick={handleStart}
          className={`w-full py-4 rounded-2xl ${colors.bgSubtle} border ${colors.borderSubtle} ${colors.textLight} font-bold ${colors.bgHover} transition-all`}>
          Começar simulado ({Math.min(count, availableForTopic.length)} questões)
        </button>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────
  if (state.mode === 'finished') {
    const grade = pct >= passPercentage ? 'pass' : pct >= passPercentage - 12 ? 'close' : 'fail';
    const gradeCopy = {
      pass:  { title: `Pronto para o ${title}`, tone: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' },
      close: { title: 'Quase lá', tone: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30' },
      fail:  { title: 'Precisa de mais estudo', tone: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30' },
    }[grade];

    const wrongByTopic: Record<string, number> = {};
    questions.forEach((q, i) => {
      if (answers[i] !== q.a) {
        wrongByTopic[q.mod] = (wrongByTopic[q.mod] ?? 0) + 1;
      }
    });

    return (
      <div className="space-y-5">
        <section className={`rounded-3xl border p-6 ${gradeCopy.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className={gradeCopy.tone} />
            <h2 className={`text-xl font-bold ${gradeCopy.tone}`}>{gradeCopy.title}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-white">{correctCount}/{questions.length}</div>
              <div className="text-[9px] text-slate-400 uppercase mt-1">Certas</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-white">{pct}%</div>
              <div className="text-[9px] text-slate-400 uppercase mt-1">Percentagem</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-white">{Math.floor(durationSec/60)}:{(durationSec%60).toString().padStart(2,'0')}</div>
              <div className="text-[9px] text-slate-400 uppercase mt-1">Tempo</div>
            </div>
          </div>
        </section>

        {Object.keys(wrongByTopic).length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className={colors.text} />
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Áreas a rever</div>
            </div>
            <div className="space-y-2">
              {Object.entries(wrongByTopic).sort((a,b) => b[1]-a[1]).map(([label, n]) => (
                <div key={label} className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-[12px] text-slate-300">{label}</span>
                  <span className="text-[11px] font-semibold text-rose-300">{n} erros</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-3">
          <button onClick={handleReset}
            className="flex-1 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700">
            Voltar ao menu
          </button>
          <button onClick={handleStart}
            className={`flex-1 py-3 rounded-2xl border ${colors.borderSubtle} ${colors.bgSubtle} ${colors.textLight} font-semibold ${colors.bgHover}`}>
            <RotateCcw size={13} className="inline mr-1" /> Novo simulado
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────
  const q = questions[current];
  if (!q) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Questão {current+1} de {questions.length}</span>
        {timed && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${colors.bgSubtle} border ${colors.borderSubtle} ${colors.textLight} text-[11px] font-semibold`}>
            <Clock size={11} />
            {Math.floor(remainingSec/60)}:{(remainingSec%60).toString().padStart(2,'0')}
          </div>
        )}
      </div>

      <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${colors.bg} transition-all`} style={{ width: `${((current+1)/questions.length)*100}%` }}/>
      </div>

      <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-6">
        <div className={`text-[10px] font-black ${colors.text} uppercase tracking-widest mb-3`}>
          {q.mod} {q.diff ? `· ${q.diff}` : ''}
        </div>
        <h3 className="text-[15px] font-semibold text-white mb-5">{q.q}</h3>

        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            const picked = answers[current] === i;
            const isCorrect = i === q.a;
            let cls = 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800';
            if (showFeedback && isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10';
            else if (showFeedback && picked && !isCorrect) cls = 'border-rose-500/50 bg-rose-500/10';

            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={showFeedback}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${cls}`}>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-black text-slate-400">
                    {showFeedback && isCorrect ? <CheckCircle2 size={12} className="text-emerald-400" /> :
                     showFeedback && picked && !isCorrect ? <XCircle size={12} className="text-rose-400" /> :
                     String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-[12px] text-slate-200">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && !timed && (
          <div className="mt-4 p-4 rounded-2xl border border-sky-500/25 bg-sky-500/5">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Explicação</div>
            <p className="text-[12px] text-sky-100 leading-relaxed whitespace-pre-wrap">{q.exp}</p>
          </div>
        )}

        {(showFeedback || timed) && (
          <button onClick={handleNext}
            className={`mt-5 w-full py-3 rounded-2xl ${colors.bgSubtle} border ${colors.borderSubtle} ${colors.textLight} font-semibold ${colors.bgHover}`}>
            {current+1 >= questions.length ? 'Ver resultado' : 'Próxima →'}
          </button>
        )}

        {timed && !showFeedback && (
          <div className="mt-4 text-center text-[10px] text-slate-400">
            Sem feedback no modo exame simulado. Responde e passa à próxima.
          </div>
        )}
      </section>
    </div>
  );
}
