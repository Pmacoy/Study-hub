
import React, { ReactNode, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Brain,
  Cpu,
  Database,
  ExternalLink,
  Fingerprint,
  GraduationCap,
  Lock as LockIcon,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

import { knowledgeData } from '../../data/azure/knowledgeBase';
import type { AzureTab } from '../../types/azure';
import type { Difficulty } from '../../types/knowledge';

function renderKnowledgeIcon(icon: string) {
  switch (icon) {
    case 'fingerprint':
      return <Fingerprint size={18} />;
    case 'lock':
      return <LockIcon size={18} />;
    case 'scale':
      return <Scale size={18} />;
    case 'database':
      return <Database size={18} />;
    case 'cpu':
      return <Cpu size={18} />;
    case 'network':
      return <Network size={18} />;
    case 'activity':
      return <Activity size={18} />;
    case 'book-open':
      return <BookOpen size={18} />;
    case 'shield-check':
      return <ShieldCheck size={18} />;
    default:
      return <BookOpen size={18} />;
  }
}

function getDifficultyTone(difficulty: Difficulty): 'rose' | 'amber' | 'emerald' {
  if (difficulty === 'alta') return 'rose';
  if (difficulty === 'média') return 'amber';
  return 'emerald';
}

function getDifficultyLabel(difficulty: Difficulty) {
  if (difficulty === 'alta') return 'Dificuldade alta';
  if (difficulty === 'média') return 'Dificuldade média';
  return 'Dificuldade fácil';
}

export default function AzureKnowledgeBase({ activeTab }: { activeTab: AzureTab }) {
  const domain = knowledgeData[activeTab];

  const priorityCount = useMemo(
    () => domain?.items.filter((item) => item.priority === 'alta').length ?? 0,
    [domain]
  );

  if (!domain || domain.items.length === 0 || activeTab === 'exam' || activeTab === 'dashboard') {
    return null;
  }

  return (
    <div className="mt-12 space-y-6 animate-in fade-in duration-500">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
        <div className="border-b border-slate-800 px-5 py-5 md:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
              <GraduationCap size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-300">
                Knowledge base AZ-104
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">{domain.title}</h3>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-400">
                {domain.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-3 md:px-6">
          <MetricCard
            icon={<Brain size={16} />}
            label="Foco de prova"
            value={domain.examFocus}
            tone="sky"
          />
          <MetricCard
            icon={<Target size={16} />}
            label="Conceitos críticos"
            value={`${priorityCount} de ${domain.items.length}`}
            tone="amber"
          />
          <MetricCard
            icon={<Sparkles size={16} />}
            label="Modo de estudo"
            value="Resumo + armadilhas + docs"
            tone="emerald"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {domain.items.map((item, i) => (
          <article
            key={i}
            className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-sky-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-sky-300">
                {renderKnowledgeIcon(item.icon)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-[16px] font-semibold text-white">{item.title}</h4>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone={item.priority === 'alta' ? 'rose' : 'amber'}>
                        {item.priority === 'alta' ? 'Alta prioridade' : 'Prioridade média'}
                      </Badge>

                      <Badge tone={getDifficultyTone(item.difficulty)}>
                        {getDifficultyLabel(item.difficulty)}
                      </Badge>
                    </div>
                  </div>

                  <a
                    href={item.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] text-slate-300 transition-all hover:border-sky-500/20 hover:text-white"
                  >
                    Docs
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p className="mt-4 text-[13px] leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <InfoPanel
                icon={<AlertTriangle size={14} />}
                title="Dica de prova"
                text={item.tip}
                tone="amber"
              />
              <InfoPanel
                icon={<ShieldCheck size={14} />}
                title="Armadilha comum"
                text={item.trap}
                tone="rose"
              />
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Palavras-chave
              </p>

              <div className="flex flex-wrap gap-2">
                {item.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[11px] text-slate-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'sky' | 'amber' | 'emerald';
}) {
  const styles = {
    sky: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${styles[tone]}`}>
        {icon}
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{value}</p>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'rose' | 'amber' | 'emerald';
}) {
  const styles = {
    rose: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] ${styles[tone]}`}>
      {children}
    </span>
  );
}

function InfoPanel({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: 'amber' | 'rose';
}) {
  const styles = {
    amber: 'border-amber-500/15 bg-amber-500/5 text-amber-200',
    rose: 'border-rose-500/15 bg-rose-500/5 text-rose-200',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em]">{title}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}