import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { videosFor, youtubeSearchUrl, VIDEO_LANGS } from '../../data/moduleVideos';
import type { VideoLang } from '../../data/moduleVideos';

interface Props {
  domain: string;
  tab: string;
}

export default function VideoDemoCard({ domain, tab }: Props) {
  const [lang, setLang] = useState<VideoLang>('any');
  const data = videosFor(domain, tab);
  if (!data) return null;

  return (
    <section className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Play size={15} className="text-rose-400" fill="currentColor" />
        <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
          Ver alguém fazer
        </div>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
        Demos práticos de {data.topic} no YouTube — alguém a executar comandos, não a explicar slides.
        Ver a execução funciona mesmo quando a narração é noutra língua.
      </p>

      {/* Chips de pesquisa */}
      <div className="flex flex-wrap gap-2">
        {data.searches.map(sr => (
          <a
            key={sr.label}
            href={youtubeSearchUrl(sr.terms, lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-[11px] font-semibold text-slate-300 hover:border-rose-500/40 hover:text-white transition-all"
          >
            {sr.label}
            <ExternalLink size={10} className="text-slate-600" />
          </a>
        ))}
      </div>

      {/* Selector de língua */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Língua</span>
        {VIDEO_LANGS.map(l => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
              lang === l.id
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                : 'border border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </section>
  );
}
