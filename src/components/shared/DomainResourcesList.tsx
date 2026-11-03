import { useState } from 'react';
import { BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import type { ResourceItem } from '../../data/domainResources';
import ConceptModal from './ConceptModal';

interface Props {
  resources: ResourceItem[];
  accent: string;
}

const TILE_COLORS: Record<string, string> = {
  violet:  'border-violet-500/25 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40',
  sky:     'border-sky-500/25 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/40',
  emerald: 'border-emerald-500/25 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40',
  amber:   'border-amber-500/25 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40',
  orange:  'border-orange-500/25 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/40',
  rose:    'border-rose-500/25 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40',
  teal:    'border-teal-500/25 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 hover:border-teal-500/40',
  cyan:    'border-cyan-500/25 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40',
  red:     'border-red-500/25 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40',
};

const EYEBROW_TEXT: Record<string, string> = {
  violet: 'text-violet-400', sky: 'text-sky-400', emerald: 'text-emerald-400',
  amber: 'text-amber-400', orange: 'text-orange-400', rose: 'text-rose-400',
  teal: 'text-teal-400', cyan: 'text-cyan-400', red: 'text-red-400',
};

const FOCUS_RINGS: Record<string, string> = {
  violet: 'focus:ring-violet-500/50',
  sky: 'focus:ring-sky-500/50',
  emerald: 'focus:ring-emerald-500/50',
  amber: 'focus:ring-amber-500/50',
  orange: 'focus:ring-orange-500/50',
  rose: 'focus:ring-rose-500/50',
  teal: 'focus:ring-teal-500/50',
  cyan: 'focus:ring-cyan-500/50',
  red: 'focus:ring-red-500/50',
};

export default function DomainResourcesList({ resources, accent }: Props) {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  if (!resources || resources.length === 0) return null;

  const tileClass = TILE_COLORS[accent] ?? TILE_COLORS.violet;
  const eyebrowClass = EYEBROW_TEXT[accent] ?? EYEBROW_TEXT.violet;
  const focusRingClass = FOCUS_RINGS[accent] ?? FOCUS_RINGS.violet;

  return (
    <section className="space-y-4">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] font-mono ${eyebrowClass}`}>
          Materiais de Estudo
        </p>
        <h3 className="mt-1 text-lg font-bold text-white font-display">Conceitos & Guias</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {resources.map((res) => (
          <button
            key={res.id}
            onClick={() => setSelectedResource(res)}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${focusRingClass} ${tileClass}`}
            aria-label={`Abrir conceito: ${res.title}`}
          >
            <div className="shrink-0 mt-0.5">
              {res.type === 'concept' ? (
                <BookOpen size={18} className="opacity-80" />
              ) : (
                <Lightbulb size={18} className="opacity-80" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white leading-tight mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
                {res.title}
              </h4>
              {res.tags && res.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {res.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium opacity-70 border border-current rounded px-1.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <ChevronRight size={16} className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {selectedResource && (
        <ConceptModal
          resource={selectedResource}
          accent={accent}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </section>
  );
}
