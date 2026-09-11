import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { findCert } from '../../types/certification';

export default function ComingSoonCert({
  certId, domainLabel, domainIcon, onBack,
}: {
  certId: string;
  domainLabel: string;
  domainIcon: ReactNode;
  onBack: () => void;
}) {
  const cert = findCert(certId);
  if (!cert) return null;

  return (
    <div className="space-y-4">
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors font-mono">
        <ArrowLeft size={14} /> Voltar às certificações {domainLabel}
      </button>

      <section className="border border-slate-800 bg-[#181926]/80 p-8 text-center">
        <div className="text-5xl mb-4">{domainIcon}</div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-amber-500/30 bg-amber-500/15 text-amber-300 text-2xs font-black uppercase tracking-widest mb-4 font-mono">
          <Clock size={11} />
          <span>Em construção</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">{cert.code} · {cert.label}</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">{cert.subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
          <div className="p-4 border border-slate-800 bg-slate-900/60">
            <Sparkles size={14} className="text-violet-400 mx-auto mb-2" />
            <div className="text-2xs font-black uppercase text-slate-500 mb-1 font-mono">O que vem aí</div>
            <div className="text-xs text-slate-300">Módulos interactivos alinhados ao syllabus oficial</div>
          </div>
          <div className="p-4 border border-slate-800 bg-slate-900/60">
            <Sparkles size={14} className="text-emerald-400 mx-auto mb-2" />
            <div className="text-2xs font-black uppercase text-slate-500 mb-1 font-mono">E também</div>
            <div className="text-xs text-slate-300">Simulado, flashcards e integração com o streak diário</div>
          </div>
        </div>
      </section>
    </div>
  );
}
