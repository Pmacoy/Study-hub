import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  BarChart3,
  Trophy,
} from 'lucide-react';
import type { AwsQuestion, AwsExamTopicFilter } from '../../types/awsExam';
import { ALL_AWS_QUESTIONS, SCENARIO_QUESTIONS } from '../../data/aws/examQuestions';

type QuizMode = 'menu' | 'quiz' | 'result';
type QuestionStyle = 'all' | 'scenario';

const TOPICS: { key: AwsExamTopicFilter; label: string; emoji: string }[] = [
  { key: 'all', label: 'Todos os tópicos', emoji: '🎯' },
  { key: 'iam', label: 'IAM & Segurança', emoji: '🔐' },
  { key: 'vpc', label: 'VPC & Networking', emoji: '🌐' },
  { key: 'compute', label: 'Compute', emoji: '💻' },
  { key: 'storage', label: 'Storage', emoji: '📦' },
  { key: 'databases', label: 'Databases', emoji: '🗄️' },
  { key: 'wellarch', label: 'Well-Architected', emoji: '🏛️' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AwsExamSimulator() {
  const [mode, setMode] = useState<QuizMode>('menu');
  const [topic, setTopic] = useState<AwsExamTopicFilter>('all');
  const [style, setStyle] = useState<QuestionStyle>('all');
  const [count, setCount] = useState<number>(20);
  const [timed, setTimed] = useState<boolean>(false);
  const [questions, setQuestions] = useState<AwsQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTs, setStartTs] = useState<number>(0);
  const [remainingSec, setRemainingSec] = useState<number>(0);

  const availableForTopic = useMemo(() => {
    const pool = style === 'scenario' ? SCENARIO_QUESTIONS : ALL_AWS_QUESTIONS;
    return topic === 'all' ? pool : pool.filter(q => q.topic === topic);
  }, [topic, style]);

  useEffect(() => {
    if (mode !== 'quiz' || !timed || remainingSec <= 0) return;
    const t = setInterval(() => setRemainingSec(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [mode, timed, remainingSec]);

  useEffect(() => {
    if (mode === 'quiz' && timed && remainingSec <= 0) {
      setMode('result');
    }
  }, [mode, timed, remainingSec]);

  const handleStart = useCallback(() => {
    const picked = shuffle(availableForTopic).slice(0, Math.min(count, availableForTopic.length));
    setQuestions(picked);
    setCurrent(0);
    setAnswers(new Array(picked.length).fill(null));
    setShowFeedback(false);
    setStartTs(Date.now());
    setRemainingSec(count * 90); // 90s por questão (~65min para 45q como o real)
    setMode('quiz');
  }, [availableForTopic, count]);

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    const newAns = [...answers];
    newAns[current] = idx;
    setAnswers(newAns);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setMode('result');
    } else {
      setCurrent(current + 1);
      setShowFeedback(false);
    }
  };

  const correctCount = answers.reduce<number>(
    (acc, ans, i) => acc + (ans !== null && ans === questions[i]?.correctIndex ? 1 : 0),
    0
  );
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const durationSec = Math.round((Date.now() - startTs) / 1000);

  // ── Menu ────────────────────────────────────────────────────
  if (mode === 'menu') {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-orange-500/25 bg-orange-500/5 p-6">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap size={24} className="text-orange-400" />
            <div>
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Simulado</div>
              <h2 className="text-xl font-bold text-white">AWS SAA-C03</h2>
            </div>
          </div>
          <p className="text-[13px] text-slate-400">
            {ALL_AWS_QUESTIONS.length} questões disponíveis, cobrindo IAM, VPC, Compute, Storage, Databases e Well-Architected.
            O exame real tem 65 questões em 130 min ({'>'} 60% para passar).
          </p>
        </section>

        {/* Estilo das questões */}
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Estilo das questões</div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStyle('all')}
              className={`p-4 rounded-2xl border text-left transition-all ${style === 'all' ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <div className="text-[13px] font-bold text-white">Todas</div>
              <div className="text-[10px] text-slate-500 mt-1">Conceitos + cenários · {ALL_AWS_QUESTIONS.length}Q</div>
            </button>
            <button onClick={() => setStyle('scenario')}
              className={`p-4 rounded-2xl border text-left transition-all ${style === 'scenario' ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <div className="text-[13px] font-bold text-white">Só cenários</div>
              <div className="text-[10px] text-slate-500 mt-1">Como no exame real · {SCENARIO_QUESTIONS.length}Q</div>
            </button>
          </div>
          {style === 'scenario' && (
            <p className="mt-3 text-[11px] text-orange-200/70 leading-relaxed">
              Situações de negócio reais onde tens de escolher a solução arquitectural — o formato dominante no SAA-C03.
            </p>
          )}
        </section>

        {/* Tópico */}
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Tópico</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {TOPICS.map(t => {
              const pool = style === 'scenario' ? SCENARIO_QUESTIONS : ALL_AWS_QUESTIONS;
              const count = t.key === 'all' ? pool.length : pool.filter(q => q.topic === t.key).length;
              return (
                <button key={t.key} onClick={() => setTopic(t.key)} disabled={count === 0}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    count === 0 ? 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
                    : topic === t.key ? 'border-orange-500/40 bg-orange-500/10'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}>
                  <div className="text-lg">{t.emoji}</div>
                  <div className="text-[12px] font-semibold text-white mt-1">{t.label}</div>
                  <div className="text-[10px] text-slate-500">{count} Q</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Contagem */}
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Quantas questões?</div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 45, 65].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`p-3 rounded-2xl border text-center transition-all ${count === n ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                <div className="text-lg font-black">{n}</div>
                <div className="text-[9px] uppercase mt-1">questões</div>
              </button>
            ))}
          </div>
        </section>

        {/* Modo */}
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Modo</div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTimed(false)}
              className={`p-4 rounded-2xl border text-left transition-all ${!timed ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <BookOpen size={16} className={`mb-2 ${!timed ? 'text-orange-400' : 'text-slate-500'}`} />
              <div className="text-[13px] font-bold text-white">Prática</div>
              <div className="text-[10px] text-slate-500 mt-1">Feedback imediato · sem timer</div>
            </button>
            <button onClick={() => setTimed(true)}
              className={`p-4 rounded-2xl border text-left transition-all ${timed ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <Clock size={16} className={`mb-2 ${timed ? 'text-orange-400' : 'text-slate-500'}`} />
              <div className="text-[13px] font-bold text-white">Exame simulado</div>
              <div className="text-[10px] text-slate-500 mt-1">Timer · resultado só no fim</div>
            </button>
          </div>
        </section>

        <button onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-300 font-bold hover:bg-orange-500/25 transition-all">
          Começar simulado ({Math.min(count, availableForTopic.length)} questões)
        </button>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────
  if (mode === 'result') {
    const grade = pct >= 72 ? 'pass' : pct >= 60 ? 'close' : 'fail';
    const gradeCopy = {
      pass:  { title: 'Pronto para o SAA-C03', tone: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' },
      close: { title: 'Quase lá', tone: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30' },
      fail:  { title: 'Precisa de mais estudo', tone: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30' },
    }[grade];

    const wrongByTopic: Record<string, number> = {};
    questions.forEach((q, i) => {
      if (answers[i] !== q.correctIndex) {
        wrongByTopic[q.topicLabel] = (wrongByTopic[q.topicLabel] ?? 0) + 1;
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
              <div className="text-[9px] text-slate-500 uppercase mt-1">Certas</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-white">{pct}%</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Percentagem</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-white">{Math.floor(durationSec/60)}:{(durationSec%60).toString().padStart(2,'0')}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Tempo</div>
            </div>
          </div>
        </section>

        {Object.keys(wrongByTopic).length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-orange-400" />
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Áreas a rever</div>
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
          <button onClick={() => setMode('menu')}
            className="flex-1 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700">
            Voltar ao menu
          </button>
          <button onClick={handleStart}
            className="flex-1 py-3 rounded-2xl border border-orange-500/40 bg-orange-500/15 text-orange-300 font-semibold hover:bg-orange-500/25">
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
        <span className="text-[11px] text-slate-500">Questão {current+1} de {questions.length}</span>
        {timed && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-[11px] font-semibold">
            <Clock size={11} />
            {Math.floor(remainingSec/60)}:{(remainingSec%60).toString().padStart(2,'0')}
          </div>
        )}
      </div>

      <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-orange-500 transition-all" style={{ width: `${((current+1)/questions.length)*100}%` }}/>
      </div>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">{q.topicLabel} · {q.difficulty}</div>
        <h3 className="text-[15px] font-semibold text-white mb-5">{q.question}</h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const picked = answers[current] === i;
            const isCorrect = i === q.correctIndex;
            let cls = 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800';
            if (showFeedback && isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10';
            else if (showFeedback && picked && !isCorrect) cls = 'border-rose-500/50 bg-rose-500/10';

            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={showFeedback && !timed}
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
            <p className="text-[12px] text-sky-100 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {(showFeedback || timed) && (
          <button onClick={handleNext}
            className="mt-5 w-full py-3 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-300 font-semibold hover:bg-orange-500/25">
            {current+1 >= questions.length ? 'Ver resultado' : 'Próxima →'}
          </button>
        )}

        {timed && !showFeedback && (
          <div className="mt-4 text-center text-[10px] text-slate-500">
            Sem feedback no modo exame simulado. Responde e passa à próxima.
          </div>
        )}
      </section>
    </div>
  );
}
