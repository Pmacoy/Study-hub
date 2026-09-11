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
  Lock,
  Globe,
  Cpu,
  Database,
  Warehouse,
  Building2,
} from 'lucide-react';
import type { AwsQuestion, AwsExamTopicFilter } from '../../types/awsExam';
import { ALL_AWS_QUESTIONS } from '../../data/aws/examQuestions';
import { useQuizEngine, type Question } from '../../hooks/useQuizEngine';

const TOPIC_ICONS: Record<AwsExamTopicFilter, React.ReactNode> = {
  all: <Globe size={14} className="text-sky-400" />,
  iam: <Lock size={14} className="text-rose-400" />,
  vpc: <Globe size={14} className="text-emerald-400" />,
  compute: <Cpu size={14} className="text-amber-400" />,
  storage: <Warehouse size={14} className="text-violet-400" />,
  databases: <Database size={14} className="text-cyan-400" />,
  wellarch: <Building2 size={14} className="text-sky-400" />,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Converte uma AwsQuestion para o formato genérico do motor de quiz. */
function toGeneric(q: AwsQuestion): Question {
  return {
    q: q.question,
    opts: q.options,
    a: q.correctIndex,
    exp: q.explanation,
    mod: q.topicLabel,
  };
}

export default function AwsExamSimulator() {
  // Configuração do menu
  const [topic, setTopic] = useState<AwsExamTopicFilter>('all');
  const [count, setCount] = useState<number>(20);
  const [timed, setTimed] = useState<boolean>(false);

  // Questões cruas desta sessão — o motor guarda a versão genérica, mas
  // o render precisa dos campos específicos da AWS (difficulty, topicLabel).
  const [picked, setPicked] = useState<AwsQuestion[]>([]);
  const [startTs, setStartTs] = useState<number>(0);

  const { state, score, percentage, handleStartWith, handleAnswer, handleNext, handleReset } =
    useQuizEngine({ questions: [], autoShuffle: false });

  const availableForTopic = useMemo(
    () => topic === 'all' ? ALL_AWS_QUESTIONS : ALL_AWS_QUESTIONS.filter(q => q.topic === topic),
    [topic]
  );

  const handleStart = useCallback(() => {
    const raw = shuffle(availableForTopic).slice(0, Math.min(count, availableForTopic.length));
    setPicked(raw);
    setStartTs(Date.now());
    // 90s por questão (~65min para 45q como o real); sem timer em modo prática
    handleStartWith(raw.map(toGeneric), timed ? raw.length * 90 : undefined);
  }, [availableForTopic, count, timed, handleStartWith]);

  const questions = picked;
  const answers = state.answers;
  const current = state.current;
  const showFeedback = state.showExplanation;
  const remainingSec = state.timeRemaining ?? 0;
  const correctCount = score;
  const pct = percentage;
  const durationSec = Math.round((Date.now() - startTs) / 1000);

  // ── Menu ────────────────────────────────────────────────────
  if (state.mode === 'menu') {
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

        {/* Tópico */}
        <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-5">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Tópico</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(Object.keys(TOPIC_ICONS) as AwsExamTopicFilter[]).map(key => {
              const label = key === 'all' ? 'Todos os tópicos'
                : key === 'iam' ? 'IAM & Segurança'
                : key === 'vpc' ? 'VPC & Networking'
                : key === 'compute' ? 'Compute'
                : key === 'storage' ? 'Storage'
                : key === 'databases' ? 'Databases'
                : 'Well-Architected';
              const count = key === 'all' ? ALL_AWS_QUESTIONS.length : ALL_AWS_QUESTIONS.filter(q => q.topic === key).length;
              return (
                <button key={key} onClick={() => setTopic(key)}
                  className={`p-3 rounded-2xl border text-left transition-all ${topic === key ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                  <div className="text-base">{TOPIC_ICONS[key]}</div>
                  <div className="text-[12px] font-semibold text-white mt-1">{label}</div>
                  <div className="text-[10px] text-slate-400">{count} Q</div>
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
                className={`p-3 rounded-2xl border text-center transition-all ${count === n ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                <div className="text-lg font-black">{n}</div>
                <div className="text-[9px] uppercase mt-1">questões</div>
              </button>
            ))}
          </div>
        </section>

        {/* Modo */}
        <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-5">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Modo</div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTimed(false)}
              className={`p-4 rounded-2xl border text-left transition-all ${!timed ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <BookOpen size={16} className={`mb-2 ${!timed ? 'text-orange-400' : 'text-slate-400'}`} />
              <div className="text-[13px] font-bold text-white">Prática</div>
              <div className="text-[10px] text-slate-400 mt-1">Feedback imediato · sem timer</div>
            </button>
            <button onClick={() => setTimed(true)}
              className={`p-4 rounded-2xl border text-left transition-all ${timed ? 'border-orange-500/40 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
              <Clock size={16} className={`mb-2 ${timed ? 'text-orange-400' : 'text-slate-400'}`} />
              <div className="text-[13px] font-bold text-white">Exame simulado</div>
              <div className="text-[10px] text-slate-400 mt-1">Timer · resultado só no fim</div>
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
  if (state.mode === 'finished') {
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
              <BarChart3 size={14} className="text-orange-400" />
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
        <span className="text-[11px] text-slate-400">Questão {current+1} de {questions.length}</span>
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

      <section className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-6">
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
          <div className="mt-4 text-center text-[10px] text-slate-400">
            Sem feedback no modo exame simulado. Responde e passa à próxima.
          </div>
        )}
      </section>
    </div>
  );
}
