import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook genérico para estado persistido com validação de tipo.
 * Resolve os bugs: #4 (JSON.parse sem guard), #2 (race condition), #8 (versionamento)
 *
 * @param key - Chave do localStorage
 * @param fallback - Valor default se vazio ou inválido
 * @param validate - Função type-guard que valida o JSON parseado
 * @returns [value, setValue, loaded]
 */
export function usePersistedState<T>(
  key: string,
  fallback: T,
  validate: (v: unknown) => v is T
): [T, (update: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(() => fallback);
  const [loaded, setLoaded] = useState(false);

  // Stabilize references so the mount-effect runs exactly once.
  // Without refs, callers passing inline literals (e.g. []) create a new
  // reference on every hook call, which would re-trigger the useEffect
  // on each parent re-render and cause an infinite setState loop.
  const keyRef = useRef(key);
  const fallbackRef = useRef(fallback);
  const validateRef = useRef(validate);
  keyRef.current = key;
  fallbackRef.current = fallback;
  validateRef.current = validate;

  // Carregar do localStorage — corre UMA vez na montagem
  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyRef.current);
      if (raw === null) {
        setValue(fallbackRef.current);
      } else {
        const parsed = JSON.parse(raw);
        if (validateRef.current(parsed)) {
          setValue(parsed);
        } else {
          console.warn(`[${keyRef.current}] Dados no localStorage inválidos, usando fallback.`, parsed);
          setValue(fallbackRef.current);
        }
      }
    } catch (err) {
      console.warn(`[${keyRef.current}] Erro ao ler localStorage:`, err);
      setValue(fallbackRef.current);
    } finally {
      setLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only — refs keep current values in sync

  // Wrapper para setValue que suporta tanto valores diretos quanto funções updater
  const setValueWrapper = useCallback(
    (update: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof update === 'function' ? (update as (prev: T) => T)(prev) : update;
        return next;
      });
    },
    []
  );

  // Persistir quando o valor muda — MAS apenas após loaded=true
  // Isto evita sobrescrever dados válidos no efeito de restore
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(keyRef.current, JSON.stringify(value));
    } catch (err) {
      console.warn(`[${keyRef.current}] Erro ao escrever localStorage:`, err);
    }
  }, [value, loaded]); // key is stable via ref; persist only on value change

  return [value, setValueWrapper, loaded];
}
