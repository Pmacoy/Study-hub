import { useState } from 'react';
import { AlertTriangle, MessageSquare, CheckSquare, Award, ChevronDown, Target } from 'lucide-react';
import {
  MISTAKE_SECTIONS, PHRASE_PAIRS, GOLDEN_RULES,
  PRE_INTERVIEW_CHECKLIST, UNDER_PREPARED_TOPICS,
} from '../../data/interviewTechnique';
import type { MistakeItem } from '../../data/interviewTechnique';

interface Props {
  onExit: () => void;
}

type View = 'rules' | 'mistakes' | 'phrases' | 'checklist';

function MistakeCard({ item }: { item: MistakeItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-slate-900/50 transition-colors">
        <span className="shrink-0 text-rose-400 mt-0.5">✕</span>
        <span className="flex-1 text-[12px] font-semibold text-slate-200">{item.title}</span>
        <ChevronDown size={13} className={`shrink-0 mt-0.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pl-9 space-y-2.5">
          <div className="space-y-1">
            {item.signs.map((s, i) => (
              <div key={i} className="flex gap-2 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-slate-600 shrink-0">·</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Como corrigir</div>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed">{item.fix}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewTechniqueView({ onExit }: Props) {
  const [view, setView] = useState<View>('rules');
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tabs: { id: View; label: string }[] = [
    { id: 'rules',     label: 'Regras de ouro' },
    { id: 'mistakes',  label: 'Erros a evitar' },
    { id: 'phrases',   label: 'Como dizer' },
    { id: 'checklist', label: 'Checklist' },
  ];

  const totalItems = PRE_INTERVIEW_CHECKLIST.reduce((s, p) => s + p.items.length, 0);

  return (
    <div className="space-y-6">
      <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-slate-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎙️</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Técnica de entrevista</div>
            <h1 className="text-2xl font-bold text-white">Saber a resposta não chega</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              O banco de perguntas ensina-te <em>o quê</em>. Isto ensina <em>como</em> —
              estruturar a resposta, ligar ao impacto de negócio, admitir lacunas sem perder credibilidade,
              e evitar as frases que fecham portas.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Regras de ouro ──────────────────────────────────── */}
      {view === 'rules' && (
        <div className="space-y-5">
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Award size={15} className="text-sky-400" />
              <h3 className="text-[14px] font-bold text-white">As 10 regras de ouro</h3>
            </div>
            {GOLDEN_RULES.map((rule, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-[10px] font-black text-sky-300">
                  {i + 1}
                </span>
                <span className="text-[12px] text-slate-300 leading-relaxed">{rule}</span>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={15} className="text-amber-400" />
              <h3 className="text-[13px] font-bold text-white">Temas consistentemente mal preparados</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Com base em feedback real de entrevistas, estes são os pontos fracos que a maioria dos candidatos ignora.
            </p>
            <div className="space-y-1.5">
              {UNDER_PREPARED_TOPICS.map(t => (
                <div key={t.topic} className="p-2.5 rounded-xl bg-slate-900">
                  <div className="text-[12px] font-semibold text-amber-300">{t.topic}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.note}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">A estrutura que funciona</div>
            <p className="text-[12px] text-sky-100 leading-relaxed">
              Começa com uma frase de resumo, depois expande:
              <br /><br />
              <span className="font-semibold">"A minha abordagem seria X. Porquê: [detalhes].
              Na prática fiz isto em [contexto] quando [história com números]."</span>
              <br /><br />
              E fecha sempre com monitorização, rollback e segurança.
            </p>
          </div>
        </div>
      )}

      {/* ── Erros ───────────────────────────────────────────── */}
      {view === 'mistakes' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-400" />
            <h3 className="text-[14px] font-bold text-white">Erros a evitar, em 6 dimensões</h3>
          </div>
          {MISTAKE_SECTIONS.map(sec => (
            <section key={sec.id} className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg">{sec.emoji}</span>
                <h4 className="text-[13px] font-bold text-white">{sec.title}</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{sec.intro}</p>
              <div className="space-y-1.5">
                {sec.items.map(item => <MistakeCard key={item.title} item={item} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── Frases ──────────────────────────────────────────── */}
      {view === 'phrases' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={15} className="text-sky-400" />
            <h3 className="text-[14px] font-bold text-white">Frases que prejudicam vs frases que ajudam</h3>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            A mesma informação, dita de duas maneiras. A da direita mostra julgamento, contexto e prova.
          </p>

          <div className="space-y-2">
            {PHRASE_PAIRS.map((p, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Evita</div>
                  <p className="text-[12px] text-rose-100/80 leading-relaxed">{p.bad}</p>
                </div>
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Diz antes</div>
                  <p className="text-[12px] text-emerald-100/80 leading-relaxed">{p.good}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Checklist ───────────────────────────────────────── */}
      {view === 'checklist' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckSquare size={15} className="text-sky-400" />
              <h3 className="text-[14px] font-bold text-white">Checklist pré-entrevista</h3>
            </div>
            <span className="text-[11px] text-slate-500">{checked.size} de {totalItems}</span>
          </div>

          <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-sky-500 transition-all" style={{ width: `${(checked.size / totalItems) * 100}%` }} />
          </div>

          {PRE_INTERVIEW_CHECKLIST.map(phase => (
            <section key={phase.when} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{phase.emoji}</span>
                <h4 className="text-[13px] font-bold text-white">{phase.when}</h4>
              </div>
              <div className="space-y-1.5">
                {phase.items.map((item, i) => {
                  const id = `${phase.when}-${i}`;
                  const done = checked.has(id);
                  return (
                    <button key={id} onClick={() => toggle(id)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                        done ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                      }`}>
                      <span className={`shrink-0 mt-0.5 ${done ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {done ? '✓' : '○'}
                      </span>
                      <span className={`text-[12px] leading-relaxed ${done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Fonte */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Adaptado de</div>
        <span className="text-[12px] text-slate-400">
          «DevOps Interview Mastery — Real-World Scenarios &amp; Architecture Insights» — Arvind Verma, 2026
        </span>
      </div>
    </div>
  );
}
