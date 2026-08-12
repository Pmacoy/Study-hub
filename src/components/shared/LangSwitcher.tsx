import { useLang } from '../../i18n/LangContext';
import { LANGS } from '../../i18n/dict';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-slate-800 bg-slate-900 p-0.5">
      {LANGS.map(l => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          title={l.label}
          className={`px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${
            lang === l.id
              ? 'bg-violet-500/20 text-violet-200'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {l.flag} <span className="hidden sm:inline">{l.id.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
