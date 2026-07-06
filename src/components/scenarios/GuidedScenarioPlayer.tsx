import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Copy, Lightbulb, Terminal, Trophy, X } from 'lucide-react';
import type { Scenario, ScenarioAttempt, ScenarioOption } from '../../types/scenario';

interface Props {
  scenario: Scenario;
  onExit: () => void;
  onComplete: (attempt: ScenarioAttempt) => void;
}

function Artifact({ label, language, content }: { label: string; language?: string; content: string }) {
  const [copied, setCopied] = useState(false);
  const isCode = language && language !== 'text';
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <Terminal size={11} className="text-slate-500" />
          {label}
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          className="text-slate-500 hover:text-slate-300"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
        </button>
      </div>
      <pre className={`p-3 text-[11px] leading-relaxed overflow-x-auto ${isCode ? 'bg-slate-950 font-mono' : 'bg-slate-950/50 text-slate-300'}`}>
        {content}
      </pre>
    </div>
  );
}

export default function GuidedScenarioPlayer({ scenario, onExit, onComplete }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answersLog, setAnswersLog] = useState<{ stepId: string; correctFirstTry: boolean }[]>([]);
  const [pickedThisStep, setPickedThisStep] = useState<string | null>(null);
  const [wrongThisStep, setWrongThisStep] = useState<Set<string>>(new Set());
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const [startTs] = useState(() => Date.now());

  const currentStep = scenario.steps[stepIdx];
  const isLastStep = stepIdx === scenario.steps.length - 1;
  const picked = currentStep.options.find(o => o.id === pickedThisStep) ?? null;

  const visibleArtifacts = useMemo(() => {
    const shown = [...scenario.contextArtifacts];
    for (const artifact of scenario.progressiveArtifacts) {
      if (unlocked.has(artifact.id)) shown.push(artifact);
    }
    return shown;
  }, [scenario, unlocked]);

  function handlePick(opt: ScenarioOption) {
    if (picked?.correct) return; // already correct, locked
    setPickedThisStep(opt.id);

    if (opt.correct) {
      const wasFirstTry = wrongThisStep.size === 0;
      setAnswersLog(prev => [...prev, { stepId: currentStep.id, correctFirstTry: wasFirstTry }]);
      if (opt.revealArtifacts) {
        setUnlocked(prev => new Set([...prev, ...opt.revealArtifacts!]));
      }
      // Also reveal artifacts declared on the STEP (they show once correct answer is given)
      if (currentStep.revealArtifacts) {
        setUnlocked(prev => new Set([...prev, ...currentStep.revealArtifacts!]));
      }
    } else {
      setWrongThisStep(prev => new Set([...prev, opt.id]));
    }
  }

  function handleNext() {
    if (!picked?.correct) return;
    if (isLastStep) {
      const durationSec = Math.round((Date.now() - startTs) / 1000);
      const correctFirstTry = answersLog.filter(a => a.correctFirstTry).length;
      const attempt: ScenarioAttempt = {
        scenarioId: scenario.id,
        completedAt: new Date().toISOString(),
        correctFirstTry,
        totalSteps: scenario.steps.length,
        durationSec,
      };
      onComplete(attempt);
      setFinished(true);
    } else {
      setStepIdx(stepIdx + 1);
      setPickedThisStep(null);
      setWrongThisStep(new Set());
    }
  }

  // ── Resolution / post-mortem screen ────────────────────────────
  if (finished) {
    const correctFirstTry = answersLog.filter(a => a.correctFirstTry).length;
    const totalSteps = scenario.steps.length;
    const grade = correctFirstTry === totalSteps ? 'perfect' : correctFirstTry >= totalSteps - 1 ? 'strong' : correctFirstTry >= totalSteps / 2 ? 'ok' : 'rough';

    const gradeCopy = {
      perfect: { title: 'Sem uma única falha', tone: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', body: 'Trabalho impecável. Este cenário está dominado — próximo!' },
      strong: { title: 'Uma só à segunda', tone: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30', body: 'Muito bom. Revê a nota do passo que falhou para consolidar.' },
      ok: { title: 'A resolver, mas devagar', tone: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30', body: 'Chegaste ao fim. Volta a fazer este dentro de 3 dias para fixar o padrão.' },
      rough: { title: 'Tenta outra vez', tone: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30', body: 'Muitas tentativas — revê o post-mortem em baixo e volta a correr o cenário.' },
    }[grade];

    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <button onClick={onExit}
            className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
            <ArrowLeft size={14} /> Voltar aos cenários
          </button>
        </div>

        <section className={`rounded-3xl border p-6 ${gradeCopy.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={20} className={gradeCopy.tone} />
            <h2 className={`text-lg font-bold ${gradeCopy.tone}`}>{gradeCopy.title}</h2>
          </div>
          <p className="text-[13px] text-slate-300">{gradeCopy.body}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-black text-white">{correctFirstTry}/{totalSteps}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">1ª tentativa</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-black text-white">{answersLog.length}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Passos</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-black text-white">{Math.round((Date.now() - startTs) / 1000)}s</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Duração</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
          <div>
            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Root cause</div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{scenario.resolution.rootCause}</p>
          </div>
          <div>
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Correcção aplicada</div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{scenario.resolution.fix}</p>
          </div>
          <div>
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Prevenções</div>
            <ul className="space-y-1.5">
              {scenario.resolution.preventions.map((p, i) => (
                <li key={i} className="flex gap-2 text-[12px] text-slate-300">
                  <span className="text-sky-400 shrink-0">→</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flex gap-3">
          <button onClick={onExit}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-[13px] font-semibold hover:border-slate-700">
            Voltar aos cenários
          </button>
        </div>
      </div>
    );
  }

  // ── Active investigation screen ────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <button onClick={onExit}
          className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
          <ArrowLeft size={14} /> Sair do cenário
        </button>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Passo {stepIdx + 1} de {scenario.steps.length}
        </div>
      </div>

      {/* Hook / progress bar */}
      <section className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-[15px] font-bold text-white">{scenario.title}</h2>
            <p className="mt-1.5 text-[12px] text-slate-300 leading-relaxed">{scenario.hook}</p>
          </div>
        </div>
        <div className="mt-4 h-1 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${((stepIdx + (picked?.correct ? 1 : 0)) / scenario.steps.length) * 100}%` }} />
        </div>
      </section>

      {/* Artifacts panel */}
      {visibleArtifacts.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Informação recolhida</div>
          <div className="space-y-2">
            {visibleArtifacts.map(a => <Artifact key={a.id} label={a.label} language={a.language} content={a.content} />)}
          </div>
        </section>
      )}

      {/* Question */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Decisão</div>
        <h3 className="text-[14px] font-bold text-white mb-4">{currentStep.prompt}</h3>

        <div className="space-y-2">
          {currentStep.options.map(opt => {
            const isPicked = picked?.id === opt.id;
            const wasWrong = wrongThisStep.has(opt.id);
            const showFeedback = isPicked || wasWrong;
            const isDisabled = picked?.correct !== undefined && picked.correct;

            let cls = 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800';
            if (showFeedback && opt.correct) cls = 'border-emerald-500/50 bg-emerald-500/10';
            else if (showFeedback && !opt.correct) cls = 'border-rose-500/50 bg-rose-500/10';

            return (
              <div key={opt.id}>
                <button
                  onClick={() => handlePick(opt)}
                  disabled={isDisabled}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${cls} ${isDisabled ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-black">
                      {showFeedback && opt.correct ? <Check size={12} /> : showFeedback && !opt.correct ? <X size={12} /> : opt.id.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-slate-200">{opt.label}</div>
                      {showFeedback && (
                        <div className={`mt-2 text-[11px] leading-relaxed ${opt.correct ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {opt.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {picked?.correct && currentStep.teachingNote && (
          <div className="mt-4 p-3 rounded-2xl border border-sky-500/25 bg-sky-500/5">
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="text-sky-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-sky-200 leading-relaxed">{currentStep.teachingNote}</div>
            </div>
          </div>
        )}

        {picked?.correct && (
          <button onClick={handleNext}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-[13px] hover:bg-emerald-500/25 transition-all">
            {isLastStep ? 'Ver post-mortem' : 'Próximo passo'} <ArrowRight size={14} />
          </button>
        )}
      </section>
    </div>
  );
}
