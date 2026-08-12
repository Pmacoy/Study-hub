import { ExternalLink, FlaskConical } from 'lucide-react';
import type { StudyTab } from '../../types/azure';
import { labsForTab } from '../../data/azure/officialLabs';

export default function OfficialLabsCard({ tab }: { tab: StudyTab }) {
  const labs = labsForTab(tab);
  if (labs.length === 0) return null;

  return (
    <section className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={15} className="text-sky-400" />
        <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
          Praticar no lab oficial da Microsoft
        </div>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
        Ambientes guiados gratuitos no portal real da Azure — sem precisares de subscrição própria.
      </p>
      <div className="space-y-1.5">
        {labs.map(l => (
          <a
            key={l.exercise}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800 transition-all group"
          >
            <span className="shrink-0 w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-[10px] font-black text-sky-300">
              {l.exercise}
            </span>
            <span className="flex-1 text-[12px] text-slate-300 group-hover:text-white">{l.title}</span>
            <ExternalLink size={12} className="shrink-0 text-slate-600 group-hover:text-sky-400" />
          </a>
        ))}
      </div>
    </section>
  );
}
