# 🚀 Roadmap de Melhorias — devops-study-hub

**Data:** 2026-09-01 | **Análise:** Crítico + Alto + Médio | **Total Estimado:** 6–8 dias | **Poupança:** ~1 900 linhas

---

## 📋 Visão Geral — Os Maiores Problemas

### Camada de Estado (🔴 CRÍTICO)
- **Networking & AWS perdem progresso ao recarregar** (2 domínios inteiros)
- **Datas usam UTC em vez de hora local** (streak vira à meia-noite errada)
- **JSON.parse sem validação** (app rebenta em ecrã branco)
- **Bugs de timezone + gap <= 0** (streak duplica ou congela)

### Duplicação (🟠 ALTO)
- **KnowledgeBase genérico pouparia 240 linhas** (95% clone)
- **5 componentes Azure redeclarados 5 vezes** (528 linhas)
- **Devops + Python exam simulators 92% idênticos** (146 linhas)
- **52 branches activeDomain em App.tsx** (180–220 linhas)

---

## 🎯 FASE 1: Estabilização (Dias 1–2)

### P1.1: Validação de localStorage com tipo-guards

**Ficheiro:** Criar `src/hooks/usePersistedState.ts`

```tsx
// src/hooks/usePersistedState.ts
import { useState, useEffect } from 'react';

/**
 * Hook genérico para estado persistido com validação de tipo.
 * Resolve os bugs: #4 (JSON.parse sem guard), #2 (race condition), #8 (versionamento)
 */
export function usePersistedState<T>(
  key: string,
  fallback: T,
  validate: (v: unknown) => v is T
): [T, (v: T) => void, boolean] {
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
          console.warn(`[${key}] Dados inválidos, usando fallback.`, parsed);
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

  // Persistir quando o valor muda
  useEffect(() => {
    if (!loaded) return; // Não escrever até terem carregado todos os hooks
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[${key}] Erro ao escrever localStorage:`, err);
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}
```

**Validadores tipados:**

```ts
// src/types/validators.ts
import type { DailyState } from './daily';
import type { ActivityEntry } from './progress';
import type { ScenarioAttempt } from './scenario';
import type { TerminalAttempt } from './terminal';
import type { ProjectProgressEntry } from './project';

export function isDailyState(v: unknown): v is DailyState {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    Array.isArray(s.completedSteps) &&
    s.completedSteps.every((x) => typeof x === 'string') &&
    typeof s.streak === 'number' &&
    Number.isFinite(s.streak) &&
    typeof s.bestStreak === 'number' &&
    (s.lastActiveDate === null || typeof s.lastActiveDate === 'string') &&
    typeof s.totalPoints === 'number'
  );
}

export function isActivityEntries(v: unknown): v is ActivityEntry[] {
  return Array.isArray(v) && v.every(isActivityEntry);
}

function isActivityEntry(v: unknown): v is ActivityEntry {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.date === 'string' &&
    typeof a.domainId === 'string' &&
    typeof a.tabId === 'string' &&
    typeof a.timestamp === 'number'
  );
}

export function isScenarioAttempts(v: unknown): v is ScenarioAttempt[] {
  return Array.isArray(v) && v.every(isScenarioAttempt);
}

function isScenarioAttempt(v: unknown): v is ScenarioAttempt {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.scenarioId === 'string' &&
    typeof a.completed === 'boolean' &&
    typeof a.correctFirstTry === 'boolean' &&
    typeof a.totalSteps === 'number' &&
    typeof a.timestamp === 'number'
  );
}

// Similar para isTerminalAttempts, isProjectProgress...
```

**Uso em `useDailyState.ts`:**

```tsx
// src/hooks/useDailyState.ts (refactored)
import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';
import { isDailyState } from '../types/validators';
import { DAILY_STORAGE_KEY } from '../data/storageKeys';
import { EMPTY_DAILY_STATE, reconcileDailyState, completeStep } from '../types/daily';

export function useDailyState() {
  const [state, setState, loaded] = usePersistedState(
    DAILY_STORAGE_KEY,
    EMPTY_DAILY_STATE,
    isDailyState
  );

  // Reconciliar ao carregar (primeira vez + se o date mudar, ver P1.2)
  useCallback(() => {
    if (!loaded) return;
    const reconciled = reconcileDailyState(state);
    if (reconciled !== state) setState(reconciled);
  }, [loaded, state, setState]);

  const markStepComplete = useCallback(
    (step: DailyStepId) => {
      if (!loaded) return;
      setState((prev) => completeStep(prev, step));
    },
    [loaded, setState]
  );

  const isStepDoneToday = useCallback(
    (step: DailyStepId) => state.completedSteps.includes(step),
    [state.completedSteps]
  );

  return { daily: state, markStepComplete, isStepDoneToday, loaded };
}
```

**Impacto:** ✅ Resolve #4 (crashes), ✅ #2 (race condition), ✅ #8 (versionamento preparado)

**Tempo:** 2–3 h | **Risco:** Muito baixo

---

### P1.2: Corrigir datas para hora local

**Ficheiro:** `src/types/daily.ts`

```ts
/**
 * Devolve a data de hoje em YYYY-MM-DD na **hora local** do utilizador.
 * Resolve o bug #3: datas não corretas para timezones a oeste de UTC.
 */
export function todayIso(): string {
  const d = new Date();
  // Ajusta para hora local: UTC - offsetMinutes
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * Calcula dias entre duas datas em YYYY-MM-DD, em hora local.
 * Resolve o bug #6: NaN quando a data é inválida.
 */
export function daysBetween(a: string, b: string): number {
  // Validar formato YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a) || !/^\d{4}-\d{2}-\d{2}$/.test(b)) {
    return Number.POSITIVE_INFINITY; // Força reset de streak
  }

  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();

  if (!Number.isFinite(da) || !Number.isFinite(db)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

/**
 * Reconcilia o estado diário com base na data actual.
 * Resolve bugs #5 e #6: gap <= 0 e NaN não têm guarda.
 */
export function reconcileDailyState(state: DailyState): DailyState {
  const today = todayIso();
  const gap = daysBetween(state.sessionDate, today);

  if (gap === 0) {
    // Mesmo dia — sem mudanças
    return state;
  }

  if (gap === 1) {
    // Um dia passou — mantém o streak
    return {
      ...state,
      sessionDate: today,
      completedSteps: [],
    };
  }

  if (gap > 1) {
    // Múltiplos dias — quebra o streak
    return {
      ...state,
      sessionDate: today,
      completedSteps: [],
      streak: 0,
    };
  }

  // ✨ gap < 0: relógio andou para trás
  // Mantém o dia anterior, não reinicia os passos
  return {
    ...state,
    sessionDate: state.lastActiveDate || today,
  };
}

/**
 * Marca um passo diário como completo.
 * Resolve bug #7: totalPoints nunca incrementava (ternário no-op).
 */
export function completeStep(
  state: DailyState,
  step: DailyStepId
): DailyState {
  if (state.completedSteps.includes(step)) {
    return state; // Já completo
  }

  const newCompleted = [...state.completedSteps, step];
  const wasFirstStepToday = state.completedSteps.length === 0;
  const allDone = allStepsComplete({ ...state, completedSteps: newCompleted });

  return {
    ...state,
    completedSteps: newCompleted,
    streak: wasFirstStepToday ? state.streak + 1 : state.streak,
    bestStreak: Math.max(state.bestStreak, wasFirstStepToday ? state.streak + 1 : state.streak),
    // ✨ Corrigido: incrementa 1 por sessão diária completa
    totalPoints: allDone ? state.totalPoints + 1 : state.totalPoints,
    lastActiveDate: todayIso(),
  };
}
```

**Uso em componentes:**

```tsx
// src/components/shared/DailySessionCard.tsx (antes)
const d = new Date();
d.setDate(d.getDate() - i);
const iso = d.toISOString().slice(0, 10); // ❌ UTC, errado

// Depois
import { todayIso } from '../../types/daily';

const today = todayIso();
const d = new Date(today + 'T00:00:00Z');
d.setDate(d.getDate() - i);
const iso = d.toISOString().slice(0, 10).replace(/T.*/, ''); // ✓ Local
```

**Impacto:** ✅ Resolve #3 (datas locais), ✅ #5 (gap <= 0), ✅ #6 (NaN), ✅ #7 (totalPoints)

**Tempo:** 1–2 h | **Risco:** Baixo (testes unitários recomendados)

---

### P1.3: Persistir Networking & AWS

**Ficheiro:** `src/data/storageKeys.ts`

```ts
// Adicionar
export const NETWORKING_STORAGE_KEYS = {
  activeTab: 'networking_active_tab',
  visitedTabs: 'networking_visited_tabs',
} as const;

// AWS já existe mas nunca era usado
export const AWS_STORAGE_KEYS = {
  activeTab: 'aws_saa_active_tab',
  visitedTabs: 'aws_saa_visited_tabs',
} as const;
```

**Ficheiro:** `src/App.tsx` (refactored)

```tsx
// ✨ Adicionar estado e validadores
import { isNetworkingTab, NETWORKING_STUDY_TABS } from './types/networking';
import { isAwsTab, AWS_STUDY_TABS } from './types/aws';
import { NETWORKING_STORAGE_KEYS, AWS_STORAGE_KEYS } from './data/storageKeys';

export default function App() {
  // ... estado existente ...

  // ✨ Novo: estado Networking e AWS
  const [networkingTab, setNetworkingTab] = useState<NetworkingTab>('dashboard');
  const [networkingVisited, setNetworkingVisited] = useState<Set<NetworkingTab>>(new Set());
  const [awsTab, setAwsTab] = useState<AwsTab>('dashboard');
  const [awsVisited, setAwsVisited] = useState<Set<AwsTab>>(new Set());
  const [hydrated, setHydrated] = useState(false); // ✨ Guarda contra race condition

  // ✨ Restore (refactored com try/catch separados)
  useEffect(() => {
    try {
      // DevOps
      const dt = localStorage.getItem(STORAGE_KEYS.activeTab);
      if (dt && isDevOpsTab(dt)) setDevopsTab(dt);
      const dv = localStorage.getItem(STORAGE_KEYS.visitedTabs);
      if (dv) {
        const parsed = JSON.parse(dv);
        setDevopsVisited(new Set(Array.isArray(parsed) ? parsed.filter(isDevOpsTab) : []));
      }
    } catch (e) {
      console.warn('Erro ao restaurar DevOps:', e);
    }

    try {
      // Azure
      const at = localStorage.getItem(AZURE_STORAGE_KEYS.activeTab);
      if (at && isAzureTab(at)) setAzureTab(at);
      const av = localStorage.getItem(AZURE_STORAGE_KEYS.visitedTabs);
      if (av) {
        const parsed = JSON.parse(av);
        setAzureVisited(new Set(Array.isArray(parsed) ? parsed.filter(isAzureTab) : []));
      }
    } catch (e) {
      console.warn('Erro ao restaurar Azure:', e);
    }

    try {
      // Python
      const pt = localStorage.getItem(PYTHON_STORAGE_KEYS.activeTab);
      if (pt && isPythonTab(pt)) setPythonTab(pt);
      const pv = localStorage.getItem(PYTHON_STORAGE_KEYS.visitedTabs);
      if (pv) {
        const parsed = JSON.parse(pv);
        setPythonVisited(new Set(Array.isArray(parsed) ? parsed.filter(isPythonTab) : []));
      }
    } catch (e) {
      console.warn('Erro ao restaurar Python:', e);
    }

    // ✨ NOVO: Networking
    try {
      const nt = localStorage.getItem(NETWORKING_STORAGE_KEYS.activeTab);
      if (nt && isNetworkingTab(nt)) setNetworkingTab(nt);
      const nv = localStorage.getItem(NETWORKING_STORAGE_KEYS.visitedTabs);
      if (nv) {
        const parsed = JSON.parse(nv);
        setNetworkingVisited(new Set(Array.isArray(parsed) ? parsed.filter(isNetworkingTab) : []));
      }
    } catch (e) {
      console.warn('Erro ao restaurar Networking:', e);
    }

    // ✨ NOVO: AWS
    try {
      const at = localStorage.getItem(AWS_STORAGE_KEYS.activeTab);
      if (at && isAwsTab(at)) setAwsTab(at);
      const av = localStorage.getItem(AWS_STORAGE_KEYS.visitedTabs);
      if (av) {
        const parsed = JSON.parse(av);
        setAwsVisited(new Set(Array.isArray(parsed) ? parsed.filter(isAwsTab) : []));
      }
    } catch (e) {
      console.warn('Erro ao restaurar AWS:', e);
    }

    setHydrated(true); // ✨ Sinaliza que o restore terminou
  }, []);

  // ✨ Persist (com guarda hydrated)
  useEffect(() => {
    if (!hydrated) return; // Não escrever até termos carregado tudo

    try {
      localStorage.setItem(STORAGE_KEYS.activeTab, devopsTab);
      localStorage.setItem(STORAGE_KEYS.visitedTabs, JSON.stringify([...devopsVisited]));
      localStorage.setItem(AZURE_STORAGE_KEYS.activeTab, azureTab);
      localStorage.setItem(AZURE_STORAGE_KEYS.visitedTabs, JSON.stringify([...azureVisited]));
      localStorage.setItem(PYTHON_STORAGE_KEYS.activeTab, pythonTab);
      localStorage.setItem(PYTHON_STORAGE_KEYS.visitedTabs, JSON.stringify([...pythonVisited]));
      // ✨ NOVO
      localStorage.setItem(NETWORKING_STORAGE_KEYS.activeTab, networkingTab);
      localStorage.setItem(NETWORKING_STORAGE_KEYS.visitedTabs, JSON.stringify([...networkingVisited]));
      localStorage.setItem(AWS_STORAGE_KEYS.activeTab, awsTab);
      localStorage.setItem(AWS_STORAGE_KEYS.visitedTabs, JSON.stringify([...awsVisited]));
    } catch (e) {
      console.warn('Erro ao persistir estado:', e);
    }
  }, [
    hydrated,
    devopsTab, devopsVisited,
    azureTab, azureVisited,
    pythonTab, pythonVisited,
    networkingTab, networkingVisited, // ✨
    awsTab, awsVisited, // ✨
  ]);
}
```

**Impacto:** ✅ Resolve #1 (Networking & AWS persistem), ✅ #2 (race condition com hydrated)

**Tempo:** 1 h | **Risco:** Muito baixo

---

## 🎨 FASE 2: Duplicação Crítica (Dias 3–4)

### P2.1: KnowledgeBase genérico (~240 linhas poupadas)

**Ficheiro:** `src/components/shared/KnowledgeBase.tsx` (novo)

```tsx
import { AlertCircle, TrendingUp, Target } from 'lucide-react';
import type { DomainPack, KnowledgeIcon } from '../../types/knowledge';

interface KnowledgeBaseProps<T extends string> {
  activeTab: T;
  data: Partial<Record<T, DomainPack>>;
  accent: 'sky' | 'orange'; // Tons suportados
  eyebrow: string; // ex: 'Dashboard AZ-104'
}

function renderKnowledgeIcon(icon: KnowledgeIcon) {
  const iconMap: Record<KnowledgeIcon, React.ReactNode> = {
    'high-priority': <TrendingUp size={14} className="text-rose-400" />,
    'trap': <AlertCircle size={14} className="text-amber-400" />,
    'tip': <Target size={14} className="text-sky-400" />,
  };
  return iconMap[icon];
}

function getDifficultyTone(d: 'easy' | 'medium' | 'hard'): string {
  if (d === 'easy') return 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10';
  if (d === 'medium') return 'text-amber-300 border-amber-500/20 bg-amber-500/10';
  return 'text-rose-300 border-rose-500/20 bg-rose-500/10';
}

function getDifficultyLabel(d: 'easy' | 'medium' | 'hard'): string {
  return d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Difícil';
}

const ACCENT_MAP: Record<'sky' | 'orange', { active: string; label: string }> = {
  sky: { active: 'border-sky-500/20 bg-sky-500/15 text-sky-300', label: 'text-sky-400' },
  orange: { active: 'border-orange-500/20 bg-orange-500/15 text-orange-300', label: 'text-orange-400' },
};

export default function KnowledgeBase<T extends string>({
  activeTab,
  data,
  accent,
  eyebrow,
}: KnowledgeBaseProps<T>) {
  if (activeTab === 'dashboard' || activeTab === 'exam') {
    return null; // Não mostra KB nestes abas
  }

  const pack = data[activeTab as T];
  if (!pack) return null;

  const a = ACCENT_MAP[accent];
  const priorityCount = pack.items.filter((item) => item.priority === 'high').length;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-widest ${a.label}`}>
              {eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">Base de Conhecimento</h3>
          </div>
          {priorityCount > 0 && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2">
              <p className="text-[11px] text-rose-300">
                <strong>{priorityCount}</strong> alta prioridade
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {pack.items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-all ${
                item.priority === 'high'
                  ? 'border-rose-500/30 bg-rose-500/5'
                  : 'border-slate-700 bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-[13px] font-semibold text-white flex-1">{item.title}</h4>
                <div className="text-slate-500">{renderKnowledgeIcon(item.icon)}</div>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">{item.description}</p>
              {item.difficulty && (
                <div className="mt-3 flex gap-2">
                  <span
                    className={`inline-block rounded-full border px-2 py-1 text-[10px] font-medium ${getDifficultyTone(
                      item.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(item.difficulty)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Ficheiro:** `src/App.tsx` (refactored)

```tsx
// Remove as importações de AzureKnowledgeBase e AwsKnowledgeBase
// import AzureKnowledgeBase from './components/azure/AzureKnowledgeBase';
// import AwsKnowledgeBase from './components/aws/AwsKnowledgeBase';

// Adiciona a nova
import KnowledgeBase from './components/shared/KnowledgeBase';

// Na renderização de Azure:
const isStudyTab = AZURE_STUDY_TABS.includes(azureTab as AzureStudyTab);
return (
  <div className="space-y-6">
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
      {AZURE_CONTENT[azureTab as AzureStudyTab]}
    </div>
    {isStudyTab && (
      <KnowledgeBase
        activeTab={azureTab}
        data={AZURE_KNOWLEDGE_DATA} // importar de src/data/azure/knowledgeBase.ts
        accent="sky"
        eyebrow="Dashboard AZ-104"
      />
    )}
  </div>
);

// Na renderização de AWS:
return (
  <div className="space-y-6">
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6">
      {/* AWS content */}
    </div>
    <KnowledgeBase
      activeTab={awsTab}
      data={AWS_KNOWLEDGE_DATA}
      accent="orange"
      eyebrow="Dashboard SAA-C03"
    />
  </div>
);
```

**Eliminar:** `src/components/azure/AzureKnowledgeBase.tsx` (274 L) + `src/components/aws/AwsKnowledgeBase.tsx` (274 L) = **548 linhas**

**Impacto:** ✅ -240 linhas (KnowledgeBase genérico) | ✅ Código mais fácil de manter

**Tempo:** 2–3 h | **Risco:** Baixo

---

### P2.2: Componentes Azure para shared/ (~528 linhas poupadas)

**Ficheiro:** `src/components/shared/AzureSimulatorCards.tsx` (novo)

```tsx
/**
 * Componentes reutilizáveis dos simuladores Azure grandes.
 * Realocado de:
 * - AzureNetworkingSimulator.tsx:654–800
 * - AzureMonitorSimulator.tsx:573–717
 * - AzureContainersSimulator.tsx:585–685
 * - AzureComputeSimulator.tsx:511–621
 * - AzureStorageSimulator.tsx:539–649
 */

import type { LucideIcon } from 'lucide-react';

type Tone = 'sky' | 'emerald' | 'rose' | 'amber' | 'violet';

const TONE_MAP: Record<Tone, string> = {
  sky: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  rose: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
  amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
};

interface TopMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  tone: Tone;
  icon?: LucideIcon;
}

export function TopMetric({ label, value, unit, tone, icon: Icon }: TopMetricProps) {
  return (
    <div className={`rounded-2xl border p-4 ${TONE_MAP[tone]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-75">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold">
            {value}
            {unit && <span className="text-sm font-normal opacity-60"> {unit}</span>}
          </p>
        </div>
        {Icon && <Icon size={20} className="opacity-50" />}
      </div>
    </div>
  );
}

interface CapabilityCardProps {
  title: string;
  description: string;
  isActive: boolean;
  icon: LucideIcon;
  tone: Tone;
  inactiveText?: string;
}

export function CapabilityCard({
  title,
  description,
  isActive,
  icon: Icon,
  tone,
  inactiveText = 'Não disponível neste cenário',
}: CapabilityCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        isActive
          ? `${TONE_MAP[tone]} border-current`
          : 'border-slate-700 bg-slate-900/40 text-slate-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className="shrink-0 mt-0.5" />
        <div className="min-w-0">
          <h4 className="font-semibold text-[13px]">{title}</h4>
          <p className="mt-1 text-[12px] leading-relaxed opacity-75">
            {isActive ? description : inactiveText}
          </p>
        </div>
      </div>
    </div>
  );
}

interface RuleCardProps {
  title: string;
  description: string;
  tone: Tone;
}

export function RuleCard({ title, description, tone }: RuleCardProps) {
  return (
    <div className={`rounded-2xl border p-4 ${TONE_MAP[tone]}`}>
      <h4 className="font-semibold text-[13px]">{title}</h4>
      <p className="mt-2 text-[12px] leading-relaxed opacity-75">{description}</p>
    </div>
  );
}

interface ModeButtonProps {
  label: string;
  isActive: boolean;
  tone: Tone;
  onClick: () => void;
}

export function ModeButton({ label, isActive, tone, onClick }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2 text-[12px] font-semibold transition-all ${
        isActive
          ? `${TONE_MAP[tone]} border-current`
          : 'border-slate-700 text-slate-400 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

interface StatusCardProps {
  label: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

export function StatusCard({ label, status, message }: StatusCardProps) {
  const statusColor = {
    ok: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    error: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
  }[status];

  return (
    <div className={`rounded-2xl border p-4 ${statusColor}`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest opacity-75">{label}</p>
      <p className="mt-2 text-[13px] leading-relaxed">{message}</p>
    </div>
  );
}
```

**Uso em simuladores:** Substituir as caudas (654–800 linhas cada) por importação + props.

```tsx
// Exemplo: AzureNetworkingSimulator.tsx (antes 800 L, depois ~400 L)
import { TopMetric, CapabilityCard, RuleCard } from '../../shared/AzureSimulatorCards';

export default function AzureNetworkingSimulator() {
  // ... lógica ...

  return (
    <div className="space-y-6">
      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopMetric label="VNets Ativas" value={vnets.length} tone="sky" />
        <TopMetric label="Subnets" value={subnets.length} tone="sky" />
      </div>

      {/* Cards de capabilities */}
      <div className="space-y-3">
        {capabilities.map((cap) => (
          <CapabilityCard
            key={cap.id}
            title={cap.name}
            description={cap.description}
            isActive={cap.enabled}
            icon={cap.icon}
            tone="sky"
          />
        ))}
      </div>
    </div>
  );
}
```

**Eliminar:** As caudas (~150 linhas cada × 5 ficheiros) = **528 linhas**

**Impacto:** ✅ -528 linhas | ✅ Componentes reutilizáveis | ✅ Ficheiros simuladores reduzem de ~800 para ~400 L

**Tempo:** 1–2 dias | **Risco:** Médio (refactoring de UI, requer testes)

---

### P2.3: Tones centralizados (~110 linhas poupadas)

**Ficheiro:** `src/styles/tones.ts` (novo)

```ts
/**
 * Mapa centralizado de tons e cores para a app.
 * Elimina ~20 redeclarações de Record<Tone, string>.
 */

export type Tone = 'sky' | 'emerald' | 'rose' | 'amber' | 'violet' | 'orange';

export const TONE_CLASSES: Record<Tone, string> = {
  sky: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  rose: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
  amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
  orange: 'border-orange-500/20 bg-orange-500/10 text-orange-300',
};

export const TONE_DARK: Record<Tone, string> = {
  sky: 'bg-sky-500/5 border-sky-500/10 text-sky-200',
  emerald: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-200',
  rose: 'bg-rose-500/5 border-rose-500/10 text-rose-200',
  amber: 'bg-amber-500/5 border-amber-500/10 text-amber-200',
  violet: 'bg-violet-500/5 border-violet-500/10 text-violet-200',
  orange: 'bg-orange-500/5 border-orange-500/10 text-orange-200',
};

export const TONE_LABEL: Record<Tone, string> = {
  sky: 'text-sky-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
  amber: 'text-amber-400',
  violet: 'text-violet-400',
  orange: 'text-orange-400',
};

export const TONE_GRADIENT: Record<Tone, string> = {
  sky: 'from-sky-500 to-blue-500',
  emerald: 'from-emerald-500 to-teal-500',
  rose: 'from-rose-500 to-pink-500',
  amber: 'from-amber-500 to-orange-500',
  violet: 'from-violet-500 to-fuchsia-500',
  orange: 'from-orange-500 to-red-500',
};
```

**Uso:**

```tsx
import { TONE_CLASSES } from '../styles/tones';

// Antes (repetido 20×)
const ACCENT_TEXT: Record<string, string> = {
  sky: 'text-sky-400',
  emerald: 'text-emerald-400',
  // ...
};

// Depois
import { TONE_LABEL } from '../styles/tones';
// Usar TONE_LABEL diretamente
```

**Impacto:** ✅ -110 linhas | ✅ Mudanças de cor centralizadas em 1 ficheiro

**Tempo:** 30 min | **Risco:** Muito baixo

---

## 🎬 FASE 3: Duplicação de Quizzes (Dias 5–6)

### P3.1: Motor de Quiz genérico

**Ficheiro:** `src/hooks/useQuizEngine.ts` (novo)

```tsx
import { useState, useCallback } from 'react';

export interface Question {
  q: string;
  opts: string[];
  a: number; // índice da resposta correcta
  exp: string; // explicação
  mod: string; // módulo
}

export interface QuizState {
  mode: 'menu' | 'quiz' | 'finished';
  current: number;
  answers: (number | null)[];
  showExplanation: boolean;
  timeRemaining?: number;
}

interface UseQuizEngineProps {
  questions: Question[];
  autoShuffle?: boolean;
  maxTime?: number; // segundos
}

export function useQuizEngine({ questions, autoShuffle = true, maxTime }: UseQuizEngineProps) {
  const [state, setState] = useState<QuizState>({
    mode: 'menu',
    current: 0,
    answers: new Array(questions.length).fill(null),
    showExplanation: false,
    timeRemaining: maxTime,
  });

  const [shuffled, setShuffled] = useState(() => {
    if (!autoShuffle) return questions;
    // Fisher-Yates shuffle
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const currentQuestion = shuffled[state.current];
  const score = state.answers.filter((a, i) => a === shuffled[i].a).length;
  const percentage = Math.round((score / shuffled.length) * 100);

  const handleStart = useCallback(() => {
    setState((prev) => ({ ...prev, mode: 'quiz' }));
  }, []);

  const handleAnswer = useCallback((idx: number) => {
    setState((prev) => {
      if (prev.answers[prev.current] !== null) return prev; // Já respondeu
      const newAnswers = [...prev.answers];
      newAnswers[prev.current] = idx;
      return { ...prev, answers: newAnswers, showExplanation: true };
    });
  }, []);

  const handleNext = useCallback(() => {
    setState((prev) => {
      if (prev.current === shuffled.length - 1) {
        return { ...prev, mode: 'finished' };
      }
      return { ...prev, current: prev.current + 1, showExplanation: false };
    });
  }, [shuffled.length]);

  const handleReset = useCallback(() => {
    setState({
      mode: 'menu',
      current: 0,
      answers: new Array(shuffled.length).fill(null),
      showExplanation: false,
      timeRemaining: maxTime,
    });
  }, [shuffled.length, maxTime]);

  return {
    state,
    currentQuestion,
    score,
    percentage,
    handleStart,
    handleAnswer,
    handleNext,
    handleReset,
  };
}
```

**Componente genérico:**

```tsx
// src/components/shared/QuizRunner.tsx (novo)
import { useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import type { Question, QuizState } from '../../hooks/useQuizEngine';

interface QuizRunnerProps {
  state: QuizState;
  question: Question;
  onAnswer: (idx: number) => void;
  onNext: () => void;
  score: number;
  total: number;
  percentage: number;
}

export function QuizRunner({
  state,
  question,
  onAnswer,
  onNext,
  score,
  total,
  percentage,
}: QuizRunnerProps) {
  const answered = state.answers[state.current] !== null;
  const answeredIdx = state.answers[state.current];
  const isCorrect = answeredIdx === question.a;

  return (
    <div className="space-y-6">
      {/* Progresso */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-slate-500">
          Questão {state.current + 1} de {total}
        </span>
        <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
            style={{ width: `${((state.current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-[16px] font-semibold text-white">{question.q}</p>
      </div>

      {/* Opções */}
      <div className="space-y-2">
        {question.opts.map((opt, i) => {
          let style =
            'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700';
          if (answered) {
            if (i === question.a) {
              style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
            } else if (i === answeredIdx) {
              style = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
            } else {
              style = 'border-slate-800 bg-slate-900/30 text-slate-600';
            }
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              disabled={answered}
              className={`w-full rounded-xl border p-4 text-left text-[13px] font-medium transition-all ${style}`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {answered && i === question.a && <CheckCircle2 size={16} />}
                {answered && i === answeredIdx && i !== question.a && <XCircle size={16} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explicação */}
      {state.showExplanation && (
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
          <p className="text-[12px] font-semibold text-violet-300 mb-1">Explicação</p>
          <p className="text-[13px] leading-relaxed text-slate-300">{question.exp}</p>
        </div>
      )}

      {/* Botão Next */}
      {answered && (
        <button
          onClick={onNext}
          className="w-full rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-[13px] font-semibold text-violet-200 hover:bg-violet-500/15 transition-all"
        >
          {state.current === total - 1 ? 'Ver Resultado' : 'Próxima'} <ChevronRight size={14} className="inline ml-2" />
        </button>
      )}
    </div>
  );
}
```

**Refactoring dos simuladores:**

```tsx
// src/components/devops/ExamSimulator.tsx (refactored)
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { QuizRunner } from '../shared/QuizRunner';
// ... remover 150 linhas de lógica repetida ...

const QUESTIONS = [
  // ... dados ...
];

export default function ExamSimulator() {
  const { state, currentQuestion, score, percentage, handleStart, handleAnswer, handleNext, handleReset } =
    useQuizEngine({ questions: QUESTIONS });

  if (state.mode === 'menu') {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Simulado DevOps</h2>
        <p className="text-slate-400">20 questões · 20 minutos</p>
        <button
          onClick={handleStart}
          className="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-violet-200 font-semibold hover:bg-violet-500/15"
        >
          Começar
        </button>
      </div>
    );
  }

  if (state.mode === 'finished') {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">{percentage}%</h2>
        <p className="text-slate-400">
          {score} de {QUESTIONS.length} corretas
        </p>
        <button onClick={handleReset} className="...">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <QuizRunner
      state={state}
      question={currentQuestion}
      onAnswer={handleAnswer}
      onNext={handleNext}
      score={score}
      total={QUESTIONS.length}
      percentage={percentage}
    />
  );
}
```

**Impacto:** ✅ -700–790 linhas | ✅ Lógica partilhada | ✅ Mais fácil adicionar temas/modo timed

**Tempo:** 2–3 dias | **Risco:** Médio (requer testes de integração)

---

## 📈 Resumo de Impacto

| Fase | O Quê | Linhas | Risco | Tempo | Prioridade |
|---|---|---|---|---|---|
| **1.1** | `usePersistedState` hook | -40 (novos) | Muito baixo | 2–3 h | 🔴 |
| **1.2** | Datas locais + gaps + NaN | -20 refactored | Baixo | 1–2 h | 🔴 |
| **1.3** | Persistência Networking/AWS | -10 refactored | Muito baixo | 1 h | 🔴 |
| **2.1** | KnowledgeBase genérico | **-240** | Baixo | 2–3 h | 🟠 |
| **2.2** | Componentes Azure compartilhados | **-528** | Médio | 1–2 dias | 🟠 |
| **2.3** | Tones centralizados | **-110** | Muito baixo | 30 min | 🟠 |
| **3.1** | Motor de quiz genérico | **-700–790** | Médio | 2–3 dias | 🟡 |
| | **TOTAL** | **~1 780–1 910** | — | 6–8 dias | — |

---

## 🚀 Próximos Passos

1. **Hoje:** Implementar P1.1, P1.2, P1.3 (estabilização)
2. **Amanhã:** P2.1 (KnowledgeBase genérico — a mais rápida vitória)
3. **Semana:** P2.2, P2.3, P3.1 (duplicação de UI e quizzes)

Cada fase foi projetada para ser **mergeável independentemente** — não há dependências entre elas além da base (P1 → resto).

---

**Questões? Quer eu começar a implementar uma das fases?**
