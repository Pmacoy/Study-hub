import { ArrowRight, Clock, GraduationCap, BookOpen } from 'lucide-react';
import type { CertificationMeta } from '../../types/certification';

interface Props {
  domainLabel: string;
  domainIcon: string;
  certs: CertificationMeta[];
  activeCertId: string | null;
  onSelectCert: (certId: string) => void;
}

const COLOR_MAP: Record<string, { text: string; badge: string; border: string; bg: string; btn: string }> = {
  sky:     { text: 'text-sky-400',     badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',    border: 'border-sky-500/25 hover:border-sky-500/50',        bg: 'bg-sky-500/5',    btn: 'bg-sky-500/15 border-sky-500/30 text-sky-200 hover:bg-sky-500/25' },
  orange:  { text: 'text-orange-400',  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', border: 'border-orange-500/25 hover:border-orange-500/50', bg: 'bg-orange-500/5', btn: 'bg-orange-500/15 border-orange-500/30 text-orange-200 hover:bg-orange-500/25' },
  rose:    { text: 'text-rose-400',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',    border: 'border-rose-500/25 hover:border-rose-500/50',       bg: 'bg-rose-500/5',   btn: 'bg-rose-500/15 border-rose-500/30 text-rose-200 hover:bg-rose-500/25' },
};

export default function CertHub({ domainLabel, domainIcon, certs, activeCertId, onSelectCert }: Props) {
  const accentKey = certs[0]?.domain === 'azure' ? 'sky' : certs[0]?.domain === 'aws' ? 'orange' : 'rose';
  const c = COLOR_MAP[accentKey];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className={`rounded-3xl border ${c.border} ${c.bg} p-6`}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">{domainIcon}</div>
          <div className="flex-1">
            <p className={`text-[11px] font-black uppercase tracking-widest ${c.text}`}>Domínio Cloud</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{domainLabel}</h2>
            <p className="mt-2 text-[13px] text-slate-400">
              {certs.filter(x => x.status === 'active').length} de {certs.length} certificações disponíveis · escolhe a que queres estudar hoje
            </p>
          </div>
        </div>
      </section>

      {/* Cert cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {certs.map(cert => {
          const isActive = activeCertId === cert.id;
          const isComingSoon = cert.status === 'coming-soon';
          return (
            <button
              key={cert.id}
              onClick={() => !isComingSoon && onSelectCert(cert.id)}
              disabled={isComingSoon}
              className={`text-left rounded-3xl border p-5 transition-all ${
                isActive
                  ? `${c.border} ${c.bg} ring-2 ring-offset-2 ring-offset-slate-950 ${c.text.replace('text-', 'ring-')}/40`
                  : isComingSoon
                    ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed'
                    : `border-slate-800 bg-slate-900/50 hover:${c.bg} hover:${c.border}`
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${c.badge}`}>
                  {cert.code}
                </div>
                {isComingSoon ? (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                    <Clock size={11} />
                    <span>Em breve</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Activa</span>
                  </div>
                )}
              </div>
              <h3 className="text-[15px] font-bold text-white leading-tight">{cert.label}</h3>
              <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">{cert.subtitle}</p>

              <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500">
                {cert.moduleCount > 0 && (
                  <span className="flex items-center gap-1"><BookOpen size={11} /> {cert.moduleCount} módulos</span>
                )}
                {cert.totalQuestions > 0 && (
                  <span className="flex items-center gap-1"><GraduationCap size={11} /> {cert.totalQuestions}Q</span>
                )}
                {!isComingSoon && !isActive && (
                  <span className={`ml-auto flex items-center gap-1 font-semibold ${c.text}`}>
                    Abrir <ArrowRight size={11} />
                  </span>
                )}
                {isActive && (
                  <span className={`ml-auto text-[10px] font-black uppercase ${c.text}`}>Actual</span>
                )}
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
