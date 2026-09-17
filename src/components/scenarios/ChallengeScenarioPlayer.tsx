import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  Lightbulb,
  Trophy,
  X,
  Terminal,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ChallengeScenario, ChallengeAttempt } from '../../types/scenario';
import { useGamification } from '../../hooks/useGamification';

interface Props {
  scenario: ChallengeScenario;
  onExit: () => void;
  onComplete: (attempt: ChallengeAttempt) => void;
}

function Artifact({ label, language, content }: { label: string; language?: string; content: string }) {
  const [copied, setCopied] = useState(false);
  const isCode = language && language !== 'text';
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Terminal size={11} className="text-slate-400" />
          {label}
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          className="text-slate-400 hover:text-slate-300"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
        </button>
      </div>
      <pre className={`p-3 text-xs leading-relaxed overflow-x-auto ${isCode ? 'bg-[#181926] font-mono' : 'bg-[#181926]/50 text-slate-300'}`}>
        {content}
      </pre>
    </div>
  );
}

export default function ChallengeScenarioPlayer({ scenario, onExit, onComplete }: Props) {
  const [diagnosisPicked, setDiagnosisPicked] = useState<string | null>(null);
  const [fixPicked, setFixPicked] = useState<string | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState<Set<string>>(new Set());
  const [showHintInput, setShowHintInput] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [startTs] = useState(() => Date.now());
  const { addXp } = useGamification();

  const diagnosis = scenario.diagnosisOptions.find(o => o.id === diagnosisPicked) ?? null;
  const fix = scenario.fixOptions.find(o => o.id === fixPicked) ?? null;
  const diagnosisCorrect = diagnosis?.correct ?? false;
  const fixCorrect = fix?.correct ?? false;

  const allDone = diagnosisPicked && fixPicked;
  const hintsUsed = hintsRevealed.size;

  function handleFinish() {
    if (!allDone) return;
    setHasAttempted(true);
    const attempt: ChallengeAttempt = {
      scenarioId: scenario.id,
      completedAt: new Date().toISOString(),
      diagnosisCorrect,
      fixCorrect,
      hintsUsed,
      durationSec: Math.round((Date.now() - startTs) / 1000),
    };
    
    // Gamification: Give XP
    const xpEarned = 100 + (diagnosisCorrect ? 50 : 0) + (fixCorrect ? 50 : 0) - (hintsUsed * 10);
    addXp(Math.max(20, xpEarned));

    onComplete(attempt);
  }

  function grade() {
    if (!hasAttempted) return null;
    if (diagnosisCorrect && fixCorrect && hintsUsed === 0) return { grade: 'perfect', title: 'Perfeito!', tone: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', body: 'Diagnosticaste e resolveste sem ajuda. Isto é nível expert.' };
    if (diagnosisCorrect && fixCorrect) return { grade: 'strong', title: 'Acertaste!', tone: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30', body: `Usaste ${hintsUsed} dica${hintsUsed > 1 ? 's' : ''} mas chegaste à resposta certa.` };
    if (diagnosisCorrect || fixCorrect) return { grade: 'ok', title: 'Metade caminho', tone: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30', body: 'Acertaste uma parte. Revê a que falhaste e tenta de novo.' };
    return { grade: 'rough', title: 'Revisa', tone: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30', body: 'Tenta de novo — lê as dicas e os artifacts com calma.' };
  }

  const gradeInfo = grade();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <button onClick={onExit} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300">
          <ArrowLeft size={14} /> Sair
        </button>
        <div className="flex items-center gap-2">
          {hintsUsed > 0 && (
            <span className="text-2xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {hintsUsed} dica{hintsUsed > 1 ? 's' : ''} usada{hintsUsed > 1 ? 's' : ''}
            </span>
          )}
          <span className="text-2xs font-mono text-slate-500">
            {Math.round((Date.now() - startTs) / 60)}s
          </span>
        </div>
      </div>

      {/* Hook */}
      <section className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-2xs font-black text-amber-400 uppercase tracking-widest mb-1">Challenge</p>
            <h2 className="text-lg font-bold text-white font-display">{scenario.title}</h2>
            <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">{scenario.hook}</p>
          </div>
        </div>
      </section>

      {/* Artifacts — all visible upfront */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Eye size={13} className="text-slate-500" />
          <span className="text-2xs font-black text-slate-400 uppercase tracking-widest">Contexto & Evidence</span>
          <span className="text-2xs text-slate-600 font-mono">{scenario.artifacts.length} artifact{scenario.artifacts.length > 1 ? 's' : ''}</span>
        </div>
        <div className="space-y-2">
          {scenario.artifacts.map(a => (
            <Artifact key={a.id} label={a.label} language={a.language} content={a.content} />
          ))}
        </div>
      </section>

      {/* ── Diagnosis Question ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-800 bg-[#181926]/70 p-5">
        <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3">1. Qual é a causa raiz?</p>
        <p className="text-sm font-semibold text-white mb-4">{scenario.diagnosisQuestion}</p>

        <div className="space-y-2 mb-4">
          {scenario.diagnosisOptions.map(opt => {
            const picked = diagnosisPicked === opt.id;
            const show = picked;
            return (
              <button
                key={opt.id}
                onClick={() => setDiagnosisPicked(opt.id)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                  show && opt.correct ? 'border-emerald-500/50 bg-emerald-500/10'
                  : show && !opt.correct ? 'border-rose-500/50 bg-rose-500/10'
                  : picked ? 'border-slate-600 bg-slate-800'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    show && opt.correct ? 'border-emerald-500 text-emerald-400'
                    : show && !opt.correct ? 'border-rose-500 text-rose-400'
                    : picked ? 'border-slate-500 text-slate-400'
                    : 'border-slate-700 text-slate-500'
                  }`}>
                    {show && opt.correct ? <Check size={10} /> : show && !opt.correct ? <X size={10} /> : opt.id.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${show && opt.correct ? 'text-emerald-200' : show && !opt.correct ? 'text-rose-200' : 'text-slate-300'}`}>
                      {opt.label}
                    </div>
                    {show && (
                      <p className={`mt-1 text-xs leading-relaxed ${opt.correct ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                        {opt.feedback}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Fix Question ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-800 bg-[#181926]/70 p-5">
        <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3">2. Qual a correção?</p>
        <p className="text-sm font-semibold text-white mb-4">{scenario.fixQuestion}</p>

        <div className="space-y-2 mb-4">
          {scenario.fixOptions.map(opt => {
            const picked = fixPicked === opt.id;
            const show = picked;
            return (
              <button
                key={opt.id}
                onClick={() => setFixPicked(opt.id)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                  show && opt.correct ? 'border-emerald-500/50 bg-emerald-500/10'
                  : show && !opt.correct ? 'border-rose-500/50 bg-rose-500/10'
                  : picked ? 'border-slate-600 bg-slate-800'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    show && opt.correct ? 'border-emerald-500 text-emerald-400'
                    : show && !opt.correct ? 'border-rose-500 text-rose-400'
                    : picked ? 'border-slate-500 text-slate-400'
                    : 'border-slate-700 text-slate-500'
                  }`}>
                    {show && opt.correct ? <Check size={10} /> : show && !opt.correct ? <X size={10} /> : opt.id.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${show && opt.correct ? 'text-emerald-200' : show && !opt.correct ? 'text-rose-200' : 'text-slate-300'}`}>
                      {opt.label}
                    </div>
                    {show && (
                      <p className={`mt-1 text-xs leading-relaxed ${opt.correct ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                        {opt.feedback}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Hints ──────────────────────────────────────────────────── */}
      {scenario.hints.length > 0 && (
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <button
            onClick={() => setShowHintInput(!showHintInput)}
            className="flex items-center gap-2 w-full text-left"
          >
            <Lightbulb size={14} className="text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Dicas</span>
            <span className="text-2xs text-amber-500/60 font-mono ml-auto">{hintsUsed}/{scenario.hints.length}</span>
            {showHintInput ? <ChevronUp size={13} className="text-amber-500" /> : <ChevronDown size={13} className="text-amber-500" />}
          </button>

          {showHintInput && (
            <div className="mt-3 space-y-2">
              {scenario.hints.map(hint => {
                const revealed = hintsRevealed.has(hint.id);
                const isNext = !revealed && (hintsRevealed.size === 0 || hintsRevealed.has(scenario.hints[hintsRevealed.size - 1]?.id));
                return (
                  <div key={hint.id} className={`rounded-xl border p-3 ${
                    revealed ? 'border-amber-500/30 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xs font-black text-amber-500 uppercase tracking-wider">{hint.label}</span>
                      {revealed && <Check size={11} className="text-emerald-400" />}
                    </div>
                    {revealed ? (
                      <p className="text-xs text-amber-200/80 leading-relaxed">{hint.text}</p>
                    ) : (
                      <button
                        onClick={() => setHintsRevealed(prev => new Set([...prev, hint.id]))}
                        disabled={!isNext}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                          isNext
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                            : 'border-slate-700 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {isNext ? 'Revelar dica' : 'Responde às anteriores primeiro'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Submit ─────────────────────────────────────────────────── */}
      {allDone && !hasAttempted && (
        <button
          onClick={handleFinish}
          className="w-full py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Trophy size={15} /> Ver Resultado
        </button>
      )}

      {/* ── Results ────────────────────────────────────────────────── */}
      {gradeInfo && (
        <section className={`rounded-3xl border p-5 ${gradeInfo.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={20} className={gradeInfo.tone} />
            <h3 className={`text-base font-bold ${gradeInfo.tone}`}>{gradeInfo.title}</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">{gradeInfo.body}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${diagnosisCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {diagnosisCorrect ? '✓' : '✗'} Diagnóstico
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${fixCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fixCorrect ? '✓' : '✗'} Correção
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-lg font-black text-white">{hintsUsed}</div>
              <div className="text-2xs text-slate-400 uppercase mt-0.5">Dicas</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-lg font-black text-white">{scenario.hints.length - hintsUsed}</div>
              <div className="text-2xs text-slate-400 uppercase mt-0.5">Sobravam</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-lg font-black text-white">{Math.round((Date.now() - startTs) / 60)}s</div>
              <div className="text-2xs text-slate-400 uppercase mt-0.5">Tempo</div>
            </div>
          </div>
        </section>
      )}

      {/* ── Resolution (always shown after attempt) ────────────────── */}
      {hasAttempted && (
        <section className="rounded-2xl border border-slate-800 bg-[#181926]/70 p-5 space-y-4">
          <div>
            <div className="text-2xs font-black text-rose-400 uppercase tracking-widest mb-1">Root Cause</div>
            <p className="text-sm text-slate-300 leading-relaxed">{scenario.resolution.rootCause}</p>
          </div>
          <div>
            <div className="text-2xs font-black text-emerald-400 uppercase tracking-widest mb-1">Correcção</div>
            <p className="text-sm text-slate-300 leading-relaxed">{scenario.resolution.fix}</p>
          </div>
          <div>
            <div className="text-2xs font-black text-sky-400 uppercase tracking-widest mb-2">Prevenções</div>
            <ul className="space-y-1.5">
              {scenario.resolution.preventions.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-300">
                  <span className="text-sky-400 shrink-0">→</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Retry ──────────────────────────────────────────────────── */}
      {hasAttempted && (
        <div className="flex gap-3">
          <button
            onClick={onExit}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-semibold hover:border-slate-700"
          >
            Voltar
          </button>
          <button
            onClick={() => {
              setDiagnosisPicked(null);
              setFixPicked(null);
              setHintsRevealed(new Set());
              setShowHintInput(false);
              setHasAttempted(false);
            }}
            className="flex-1 px-4 py-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-200 text-sm font-semibold hover:bg-violet-500/15"
          >
            Tentar de novo
          </button>
        </div>
      )}
    </div>
  );
}
