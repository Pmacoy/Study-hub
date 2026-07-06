import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function ResetProgressModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-desc"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-300">
              Ação irreversível
            </p>
            <h3 id="reset-title" className="mt-1 text-xl font-semibold text-white">
              Resetar progressão do estudo
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 transition-all hover:text-white"
            aria-label="Fechar modal"
          >
            <X size={16} />
          </button>
        </div>

        <p id="reset-desc" className="mt-4 text-sm leading-relaxed text-slate-400">
          Isto vai apagar os módulos visitados e devolver a aplicação ao estado inicial.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition-all hover:bg-rose-500/20"
          >
            Confirmar reset
          </button>
        </div>
      </div>
    </div>
  );
}