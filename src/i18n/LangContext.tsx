import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { translate } from './dict';
import type { Lang, TransKey } from './dict';

const STORAGE_KEY = 'hub_lang_v1';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TransKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'pt',
  setLang: () => {},
  t: (k) => translate(k, 'pt'),
});

function detectInitial(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt' || stored === 'en') return stored;
  } catch { /* ignore */ }
  try {
    // se o browser não for português, assume inglês
    const nav = navigator.language?.toLowerCase() ?? '';
    return nav.startsWith('pt') ? 'pt' : 'en';
  } catch { /* ignore */ }
  return 'pt';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLangState(detectInitial());
    setReady(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const t = useCallback((key: TransKey) => translate(key, lang), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  // evita flash de conteúdo na língua errada
  if (!ready) return null;

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
