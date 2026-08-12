import { useState, useMemo } from 'react';
import { ExternalLink, Github, Search, Library } from 'lucide-react';
import { REPO_CATEGORIES, TOTAL_REPOS } from '../../data/curatedRepos';

interface Props {
  onExit: () => void;
}

export default function ResourcesView({ onExit }: Props) {
  const [activeCat, setActiveCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    let cats = activeCat === 'all'
      ? REPO_CATEGORIES
      : REPO_CATEGORIES.filter(c => c.id === activeCat);

    if (search.trim()) {
      const q = search.toLowerCase();
      cats = cats
        .map(c => ({ ...c, repos: c.repos.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q) ||
          r.why.toLowerCase().includes(q)) }))
        .filter(c => c.repos.length > 0);
    }
    return cats;
  }, [activeCat, search]);

  return (
    <div className="space-y-6">
      <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-slate-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📚</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Biblioteca</div>
            <h1 className="text-2xl font-bold text-white">{TOTAL_REPOS} repositórios que valem o teu tempo</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              DevOps não se aprende só com teoria — aprende-se a ler pipelines reais, manifests reais
              e scripts escritos por quem opera produção. Estes são os repositórios que consistentemente
              ajudam a fazer essa passagem.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Procurar por nome ou tema (ex: kubernetes, interview, terraform)..."
          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-[12px] text-slate-200 placeholder-slate-600 focus:border-emerald-500/40 focus:outline-none"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveCat('all')}
          className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${activeCat === 'all' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
          Todos ({TOTAL_REPOS})
        </button>
        {REPO_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${activeCat === c.id ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
            {c.emoji} {c.title}
          </button>
        ))}
      </div>

      {/* Categories */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center">
          <p className="text-[13px] text-slate-500">Nenhum repositório corresponde a "{search}".</p>
        </div>
      ) : (
        visible.map(cat => (
          <section key={cat.id} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg">{cat.emoji}</span>
              <h2 className="text-[15px] font-bold text-white">{cat.title}</h2>
              <span className="text-[11px] text-slate-600">{cat.repos.length}</span>
            </div>

            <div className="space-y-2">
              {cat.repos.map(r => (
                <div key={r.url} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-700 transition-all">
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 group">
                    <Github size={14} className="shrink-0 text-slate-500 group-hover:text-emerald-400" />
                    <code className="text-[13px] font-bold text-white group-hover:text-emerald-300">{r.name}</code>
                    <ExternalLink size={11} className="shrink-0 text-slate-600 group-hover:text-emerald-400" />
                  </a>

                  {r.desc && (
                    <p className="mt-2 text-[12px] text-slate-400 leading-relaxed">{r.desc}</p>
                  )}

                  {r.why && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-sky-500/5 border border-sky-500/20">
                      <div className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-1">Porque importa</div>
                      <p className="text-[11px] text-sky-100/80 leading-relaxed">{r.why}</p>
                    </div>
                  )}

                  {r.bestFor && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest shrink-0 mt-0.5">Ideal para</span>
                      <span className="text-[11px] text-slate-500 leading-relaxed">{r.bestFor}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Como usar */}
      <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Library size={15} className="text-emerald-400" />
          <h3 className="text-[13px] font-bold text-white">Como usar isto</h3>
        </div>
        <p className="text-[12px] text-emerald-100/80 leading-relaxed">
          Trata isto como currículo, não como lista de favoritos. Escolhe uma categoria,
          clona os repositórios relevantes, e constrói até teres confiança. Ler código
          real de produção ensina padrões que nenhum tutorial ensina.
        </p>
      </section>

      {/* Fonte */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Baseado em</div>
        <span className="text-[12px] text-slate-400">
          «Best GitHub Repositories to Prepare for DevOps» — DevOps Shack, edição de Junho 2026
        </span>
      </div>
    </div>
  );
}
