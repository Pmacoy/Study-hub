# DevOps Study Hub — Terminal Autêntico Redesign

**Date:** 2026-09-01
**Status:** Implemented
**Type:** Architectural — full frontend redesign

## Context

O DevOps Study Hub foi redesenhado do zero com base em pesquisa de mercado sobre tendências de design de plataformas de estudo técnico (2024-2026). A decisão foi adotar a abordagem **"Terminal Autêntico"** — uma interface que evoca um terminal de desenvolvimento com estética Catppuccin Mocha, bordas afiadas, tipografia monoespaçada e overlay de scanlines.

## Pesquisa de Mercado (Resumo)

- **Tendência dominante:** UIs de ferramentas dev (Linear, Vercel, Bolt, Refine.dev) migram para dark themes com Catppuccin/One Dark
- **Catppuccin Mocha** é o palette mais adotado por comunidades dev em 2024-2025
- **Terminal UIs** ganham tração em dashboards de estudo (gamificação + estética hacker)
- **Flat design** com zero border-radius e scanline overlays é padrão em produtos dev modernos
- **JetBrains Mono** + **Outfit** (display) é a combinação mais usada em dashboards dev de 2025
- **Block progress indicators** (█░░░) substituem barras arredondadas tradicionais

## Design System

### Cores (Catppuccin Mocha)

| Token | Hex | Uso |
|-------|-----|-----|
| `--ctp-base` | #1a1b26 | Fundo principal |
| `--ctp-mantle` | #181926 | Fundo de cards/seções |
| `--ctp-crust` | #11121d | Elementos mais escuros |
| `--ctp-surface0` | #24253a | Hover states |
| `--ctp-surface1` | #313248 | Bordas secundárias |
| `--ctp-surface2` | #45475a | Bordas primárias |
| `--ctp-overlay0` | #585b70 | Bordas sutis |
| `--ctp-text` | #cdd6f4 | Texto principal |
| `--ctp-subtext1` | #9399b2 | Texto secundário |
| `--ctp-subtext0` | #a6adc8 | Texto terciário |
| `--ctp-blue` | #89b4fa | Acento primário |
| `--ctp-violet` | #b4befe | Acento secundário |
| `--ctp-sky` | #74c7ec | Acento Azure |
| `--ctp-orange` | #fab387 | Acento AWS |
| `--ctp-emerald` | #a6e3a1 | Acento Networking |
| `--ctp-amber` | #f9e2af | Acento Python |
| `--ctp-mauve` | #cba6f7 | Acento DevOps |

### Tipografia

- **Display:** Outfit (700/800/900) — headings, logotipo
- **Body:** Inter (400/500/600/700) — corpo de texto
- **Mono:** JetBrains Mono (400/500/700) — código, labels, dados

### Bordas

- **Zero border-radius** em todos os elementos (`borderRadius: { DEFAULT: '0px', ... }`)
- Bordas finas (`border-slate-800`, `border-surface2`) definem estrutura
- Accent borders laterais (`border-l-4`) indicam domínio ativo

### Scanline Overlay

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(17,18,29,0.08) 2px,
    rgba(17,18,29,0.08) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

## Mudanças Implementadas

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `index.html` | Theme-color atualizado para #1a1b26 |
| `src/styles.css` | Palette Catppuccin, scanline overlay, imports de fontes |
| `tailwind.config.ts` | Nova config com fontes, font-size reduzido, border-radius 0 |
| `src/App.tsx` | Fundos atualizados, flat design, logo rectangula |
| `src/components/layout/Sidebar.tsx` | Flat borders, accent lateral no item ativo, BlockProgress |
| `src/components/layout/PlatformLanding.tsx` | Flat design, font-display headings |
| `src/components/layout/DashboardHome.tsx` | Flat cards, border-l-4 accents |
| `src/components/shared/StatusLine.tsx` | Estilo terminal com prompt `$` |
| `src/components/shared/ProgressIndexCard.tsx` | Flat borders |
| `src/components/shared/QuickStat.tsx` | Flat borders |
| `src/components/shared/CertHub.tsx` | Flat design |
| `src/components/shared/ComingSoonCert.tsx` | Flat design |
| `src/components/shared/DailySessionCard.tsx` | Flat borders |
| `src/components/scenarios/ScenariosHub.tsx` | Flat design |
| `src/components/projects/ProjectsView.tsx` | Flat design |
| `src/components/learning/LearningPathView.tsx` | Flat design |

### Arquivos atualizados em batch

Todos os simuladores (devops, azure, aws, networking, python) e shared components tiveram:
- `bg-slate-950` → `bg-[#181926]` (mantle)
- Bordas mantidas como estrutura visual (aceitável no design system)

## Resultado

- Build produção passa sem erros
- TypeScript compilation limpo
- Fontes Outfit (700/800/900) e JetBrains Mono bundleadas
- CSS: 64.89 kB (11.77 kB gzip)
- JS: 1,108 kB (311 kB gzip)
