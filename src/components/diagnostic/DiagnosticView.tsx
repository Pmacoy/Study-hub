import { useState, useMemo } from 'react';
import { ArrowRight, RotateCcw, Target, TrendingUp, Sparkles } from 'lucide-react';
import { DIAGNOSTIC_AREAS } from '../../data/diagnosticAreas';
import { SKILL_LEVELS } from '../../types/diagnostic';
import type { SkillLevel, DiagnosticArea } from '../../types/diagnostic';
import { useDiagnostic } from '../../hooks/useDiagnostic';
import { useLang } from '../../i18n/LangContext';
import { localizeArea } from '../../i18n/diagnosticAreasEn';

interface Props {
  onExit: () => void;
  onOpenArea: (area: DiagnosticArea) => void;
}

const LEVEL_COLOR: Record<SkillLevel, string> = {
  0: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
  1: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  2: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
  3: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
};

/** Radar SVG com um eixo por área */
function SkillRadar({ levels }: { levels: Record<string, SkillLevel> }) {
  const n = DIAGNOSTIC_AREAS.length;
  const cx = 160, cy = 160, maxR = 110;

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (value / 3) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const polygon = DIAGNOSTIC_AREAS
    .map((a, i) => point(i, levels[a.id] ?? 0))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[320px] mx-auto">
      {/* anéis */}
      {[1, 2, 3].map(ring => (
        <polygon
          key={ring}
          points={DIAGNOSTIC_AREAS.map((_, i) => point(i, ring))
            .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
          fill="none" stroke="#1e293b" strokeWidth="1"
        />
      ))}
      {/* eixos */}
      {DIAGNOSTIC_AREAS.map((_, i) => {
        const [x, y] = point(i, 3);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth="1" />;
      })}
      {/* área preenchida */}
      <polygon points={polygon} fill="#8b5cf6" fillOpacity="0.25" stroke="#a78bfa" strokeWidth="2" />
      {/* pontos */}
      {DIAGNOSTIC_AREAS.map((a, i) => {
        const [x, y] = point(i, levels[a.id] ?? 0);
        return <circle key={a.id} cx={x} cy={y} r="3" fill="#a78bfa" />;
      })}
      {/* emojis nos vértices */}
      {DIAGNOSTIC_AREAS.map((a, i) => {
        const [x, y] = point(i, 3.45);
        return (
          <text key={a.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="13">
            {a.emoji}
          </text>
        );
      })}
    </svg>
  );
}

export default function DiagnosticView({ onExit, onOpenArea }: Props) {
  const { t, lang } = useLang();
  const { levels, completedAt, setLevel, markCompleted, reset } = useDiagnostic();
  const [step, setStep] = useState<'intro' | 'quiz' | 'results'>(
    completedAt ? 'results' : 'intro'
  );
  const [current, setCurrent] = useState(0);

  const answered = Object.keys(levels).length;
  const area = localizeArea(DIAGNOSTIC_AREAS[current], lang);

  const { gaps, strengths, avg } = useMemo(() => {
    const scored = DIAGNOSTIC_AREAS.map(a => ({ area: localizeArea(a, lang), level: levels[a.id] ?? 0 }));
    const sorted = [...scored].sort((a, b) => a.level - b.level);
    const total = scored.reduce((s, x) => s + x.level, 0);
    return {
      gaps: sorted.filter(x => x.level <= 1).slice(0, 4),
      strengths: [...scored].sort((a, b) => b.level - a.level).filter(x => x.level >= 2).slice(0, 3),
      avg: scored.length > 0 ? total / scored.length : 0,
    };
  }, [levels, lang]);

  const answer = (level: SkillLevel) => {
    setLevel(area.id, level);
    if (current + 1 < DIAGNOSTIC_AREAS.length) {
      setCurrent(current + 1);
    } else {
      markCompleted();
      setStep('results');
    }
  };

  // ── Intro ──────────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
          ← Voltar
        </button>

        <section className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎯</div>
            <div className="flex-1">
              <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('diag.eyebrow')}</div>
              <h1 className="text-2xl font-bold text-white">{t('diag.title')}</h1>
              <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
                {DIAGNOSTIC_AREAS.length} {t('diag.intro')}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h3 className="text-[13px] font-bold text-white mb-3">{t('diag.howTo')}</h3>
          <p className="text-[12px] text-slate-400 leading-relaxed mb-4">
            {t('diag.honest')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SKILL_LEVELS.map(l => (
              <div key={l.value} className={`p-3 rounded-xl border ${LEVEL_COLOR[l.value]}`}>
                <div className="text-[12px] font-bold">{l.label}</div>
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => { setCurrent(0); setStep('quiz'); }}
          className="w-full py-4 rounded-2xl bg-violet-500/15 border border-violet-500/40 text-violet-300 font-bold hover:bg-violet-500/25 transition-all">
          Começar diagnóstico
        </button>

        {completedAt && (
          <button onClick={() => setStep('results')}
            className="w-full py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 text-[12px] hover:border-slate-700">
            Ver o último resultado
          </button>
        )}
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────
  if (step === 'quiz') {
    return (
      <div className="space-y-5">
        <button onClick={() => setStep('intro')} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
          ← Sair
        </button>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">{current + 1} de {DIAGNOSTIC_AREAS.length}</span>
          <span className="text-slate-500">{answered} respondidas</span>
        </div>
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${(current / DIAGNOSTIC_AREAS.length) * 100}%` }} />
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{area.emoji}</span>
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{area.label}</div>
          </div>
          <h3 className="text-[16px] font-semibold text-white leading-relaxed">{area.prompt}</h3>

          <div className="mt-6 space-y-2">
            {SKILL_LEVELS.map(l => (
              <button key={l.value} onClick={() => answer(l.value)}
                className={`w-full p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] ${
                  levels[area.id] === l.value
                    ? LEVEL_COLOR[l.value]
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}>
                <span className="text-[13px] font-semibold">{t(`diag.level.${l.value}` as any)}</span>
              </button>
            ))}
          </div>
        </section>

        {current > 0 && (
          <button onClick={() => setCurrent(current - 1)}
            className="text-[12px] text-slate-500 hover:text-slate-300">
            ← Pergunta anterior
          </button>
        )}
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────
  const profile =
    avg >= 2.5 ? { label: t('diag.profile.senior'), tone: 'text-emerald-300', desc: t('diag.profile.senior.desc') } :
    avg >= 1.5 ? { label: t('diag.profile.mid'), tone: 'text-sky-300', desc: t('diag.profile.mid.desc') } :
    avg >= 0.8 ? { label: t('diag.profile.building'), tone: 'text-amber-300', desc: t('diag.profile.building.desc') } :
                 { label: t('diag.profile.starting'), tone: 'text-rose-300', desc: t('diag.profile.starting.desc') };

  return (
    <div className="space-y-6">
      <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Perfil */}
      <section className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-slate-950/30 p-6">
        <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{t('diag.yourProfile')}</div>
        <h1 className={`text-2xl font-bold ${profile.tone}`}>{profile.label}</h1>
        <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">{profile.desc}</p>
        <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500">
          <span>{t('diag.average')}: {avg.toFixed(1)} / 3</span>
          {completedAt && <span>· {new Date(completedAt).toLocaleDateString('pt-PT')}</span>}
        </div>
      </section>

      {/* Radar */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('diag.skillMap')}</div>
        <SkillRadar levels={levels} />
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {DIAGNOSTIC_AREAS.map(a => (
            <div key={a.id} className="flex items-center gap-2 text-[11px]">
              <span>{a.emoji}</span>
              <span className="flex-1 text-slate-400 truncate">{localizeArea(a, lang).label}</span>
              <span className={`font-semibold ${
                (levels[a.id] ?? 0) === 0 ? 'text-rose-300' :
                (levels[a.id] ?? 0) === 1 ? 'text-amber-300' :
                (levels[a.id] ?? 0) === 2 ? 'text-sky-300' : 'text-emerald-300'
              }`}>
                {t(`diag.level.${levels[a.id] ?? 0}.short` as any)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Pontos fortes */}
      {strengths.length > 0 && (
        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-emerald-400" />
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('diag.strengths')}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map(({ area: a }) => (
              <span key={a.id} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                {a.emoji} {a.label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Lacunas prioritárias */}
      {gaps.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-violet-400" />
            <h2 className="text-[13px] font-bold text-white">{t('diag.whereToStart')}</h2>
            <span className="text-[11px] text-slate-600">{t('diag.priorityFirst')}</span>
          </div>

          {gaps.map(({ area: a, level }, i) => (
            <div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-[10px] font-black text-violet-300">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[14px] font-bold text-white">{a.emoji} {a.label}</h3>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${LEVEL_COLOR[level]}`}>
                      {t(`diag.level.${level}` as any)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pl-9">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('diag.whyMatters')}</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{a.whyItMatters}</p>
                </div>
                <div>
                  <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">{t('diag.whatPractise')}</div>
                  <p className="text-[12px] text-sky-100/80 leading-relaxed">{a.whatToPractise}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('diag.masterySignal')}</div>
                  <p className="text-[12px] text-emerald-100/80 leading-relaxed italic">{a.masterySignal}</p>
                </div>

                <button onClick={() => onOpenArea(a)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-200 text-[12px] font-semibold hover:bg-violet-500/20 transition-all">
                  {t('diag.openInHub')} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 text-center">
          <TrendingUp size={28} className="text-emerald-400 mx-auto mb-2" />
          <h3 className="text-[15px] font-bold text-emerald-300">{t('diag.noGaps')}</h3>
          <p className="text-[12px] text-slate-400 mt-1">
            {t('diag.noGapsDesc')}
          </p>
        </section>
      )}

      <div className="flex gap-3">
        <button onClick={() => { reset(); setCurrent(0); setStep('intro'); }}
          className="flex-1 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 text-[12px] hover:border-slate-700">
          <RotateCcw size={13} className="inline mr-1" /> Refazer
        </button>
        <button onClick={onExit}
          className="flex-1 py-3 rounded-2xl border border-violet-500/40 bg-violet-500/15 text-violet-300 font-semibold hover:bg-violet-500/25">
          Voltar ao hub
        </button>
      </div>
    </div>
  );
}
