import { AlertCircle, TrendingUp, Target } from 'lucide-react';
import type { DomainPack, KnowledgeIcon, KnowledgeDifficulty, KnowledgePriority } from '../../types/knowledge';

interface KnowledgeBaseProps<T extends string> {
  activeTab: T;
  data: Partial<Record<T, DomainPack>>;
  accent: 'sky' | 'orange';
  eyebrow: string;
}

/**
 * Renderiza o ícone de conhecimento baseado no tipo.
 */
function renderKnowledgeIcon(icon: KnowledgeIcon) {
  const iconMap: Record<KnowledgeIcon, React.ReactNode> = {
    'fingerprint': <TrendingUp size={14} className="text-rose-400" />,
    'lock': <AlertCircle size={14} className="text-amber-400" />,
    'scale': <Target size={14} className="text-sky-400" />,
    'database': <TrendingUp size={14} className="text-emerald-400" />,
    'cpu': <AlertCircle size={14} className="text-violet-400" />,
    'network': <Target size={14} className="text-sky-400" />,
    'activity': <TrendingUp size={14} className="text-rose-400" />,
    'book-open': <AlertCircle size={14} className="text-amber-400" />,
    'shield-check': <Target size={14} className="text-emerald-400" />,
  };
  return iconMap[icon] || <Target size={14} />;
}

/**
 * Devolve as classes Tailwind para a dificuldade (português).
 */
function getDifficultyTone(d: KnowledgeDifficulty): string {
  if (d === 'fácil') return 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10';
  if (d === 'média') return 'text-amber-300 border-amber-500/20 bg-amber-500/10';
  return 'text-rose-300 border-rose-500/20 bg-rose-500/10'; // 'alta'
}

/**
 * Devolve o label em português para a dificuldade.
 */
function getDifficultyLabel(d: KnowledgeDifficulty): string {
  return d === 'fácil' ? 'Fácil' : d === 'média' ? 'Médio' : 'Difícil'; // 'alta'
}

/**
 * Mapa de accents (cores) suportadas.
 */
const ACCENT_MAP: Record<'sky' | 'orange', { active: string; label: string }> = {
  sky: { active: 'border-sky-500/20 bg-sky-500/15 text-sky-300', label: 'text-sky-400' },
  orange: { active: 'border-orange-500/20 bg-orange-500/15 text-orange-300', label: 'text-orange-400' },
};

/**
 * Componente genérico de Base de Conhecimento.
 * Reutiliza a mesma UI para Azure, AWS e outros domínios.
 *
 * Resolve a duplicação: AzureKnowledgeBase.tsx (274 L) + AwsKnowledgeBase.tsx (274 L) = 548 L
 * Genérico: ~310 linhas com mapa de accents
 * Poupança: ~238 linhas
 */
export default function KnowledgeBase<T extends string>({
  activeTab,
  data,
  accent,
  eyebrow,
}: KnowledgeBaseProps<T>) {
  // Não mostra em dashboard ou exam
  if (activeTab === 'dashboard' || activeTab === 'exam') {
    return null;
  }

  const pack = data[activeTab as T];
  if (!pack) return null;

  const a = ACCENT_MAP[accent];
  const priorityCount = pack.items.filter((item) => item.priority === 'alta').length;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${a.label}`}>
              {eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">Base de Conhecimento</h3>
          </div>
          {priorityCount > 0 && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2">
              <p className="text-xs text-rose-300">
                <strong>{priorityCount}</strong> alta prioridade
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mt-6 space-y-3">
          {pack.items.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className={`rounded-2xl border p-4 transition-all ${
                item.priority === 'alta'
                  ? 'border-rose-500/30 bg-rose-500/5'
                  : 'border-slate-700 bg-slate-900/40'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h4 className="text-base font-semibold text-white flex-1">{item.title}</h4>
                <div className="text-slate-400">{renderKnowledgeIcon(item.icon)}</div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              {item.difficulty && (
                <div className="mt-3 flex gap-2">
                  <span
                    className={`inline-block rounded-full border px-2 py-1 text-2xs font-medium ${getDifficultyTone(
                      item.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(item.difficulty)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
