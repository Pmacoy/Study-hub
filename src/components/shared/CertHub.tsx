import { GraduationCap, Sparkles } from 'lucide-react';
import type { CertificationMeta } from '../../types/certification';
import { ReactNode } from 'react';

interface Props {
  domainLabel: string;
  domainIcon: ReactNode;
  certs: CertificationMeta[];
  activeCertId: string | null;
  onSelectCert: (id: string) => void;
}

export default function CertHub({ domainLabel, domainIcon, certs, activeCertId, onSelectCert }: Props) {
  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover card-glass-sky p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 via-sky-400/40 to-transparent" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{domainIcon}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400 font-mono">Certificações</p>
            <h2 className="text-xl font-bold text-white font-display">{domainLabel}</h2>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">Seleciona uma certificação para veres o conteúdo de estudo.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {certs.map(cert => {
          const isActive = activeCertId === cert.id;
          return (
            <button
              key={cert.id}
              onClick={() => onSelectCert(cert.id)}
              className={`border card-glass card-glass-hover p-5 text-left transition-all ${
                isActive
                  ? 'border-sky-500/40 bg-sky-500/10'
                  : 'border-slate-800 bg-[#181926]/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center border ${
                  isActive ? 'border-sky-500/40 bg-sky-500/10' : 'border-slate-700 bg-slate-800'
                }`}>
                  <GraduationCap size={20} className={isActive ? 'text-sky-400' : 'text-slate-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white font-display">{cert.code}</span>
                    {isActive && (
                      <span className="text-2xs font-black text-sky-400 uppercase font-mono px-1.5 py-0.5 bg-sky-500/10 border border-sky-500/30">
                        ativa
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{cert.label}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cert.subtitle}</p>
                </div>
                <Sparkles size={14} className={`shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
