import type { ReactNode } from 'react';

export default function ActionCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-left transition-all hover:border-slate-700 hover:bg-slate-900 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
        {icon}
      </div>

      <h4 className="mt-4 text-[15px] font-semibold text-white">
        {title}
      </h4>

      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
        {text}
      </p>
    </button>
  );
}