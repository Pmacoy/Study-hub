import { useState, useEffect } from 'react';

/**
 * Hook genérico para estado persistido com validação de tipo.
 * Resolve bugs de corrupção de estado ou falta de propriedades.
 */
export function usePersistedState<T>(
  key: string,
  fallback: T,
  validate: (v: unknown) => v is T
): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        setValue(fallback);
      } else {
        const parsed = JSON.parse(raw);
        if (validate(parsed)) {
          setValue(parsed);
        } else {
          console.warn(`[${key}] Dados invalidos, usando fallback.`);
          setValue(fallback);
        }
      }
    } catch (err) {
      console.warn(`[${key}] Erro ao ler localStorage:`, err);
      setValue(fallback);
    } finally {
      setLoaded(true);
    }
  }, [key, fallback, validate]);

  // Wrapper para setValue que suporta função de atualização
  const setPersistedValue = (v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const nextValue = typeof v === 'function' ? (v as (prev: T) => T)(prev) : v;
      
      if (loaded) {
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch (err) {
          console.warn(`[${key}] Erro ao escrever localStorage:`, err);
        }
      }
      
      return nextValue;
    });
  };

  return [value, setPersistedValue, loaded];
}
