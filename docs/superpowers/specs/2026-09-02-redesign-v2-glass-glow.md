# DevOps Study Hub — Design Spec (v2 Glass/Glow)

> **Status:** Implemented
> **Updated:** 2026-09-02
> **Previous:** Terminal Autêntico (flat, zero border-radius) — rejected as too dead/square

---

## Design Direction: Glassmorphism + Glow + Gradients

The v2 design pivots from flat terminal aesthetics to a **glassmorphism** system with ambient glow, animated gradients, and layered depth — keeping the Catppuccin Mocha palette but making every surface feel alive.

### Core Principles
- **Depth over flatness:** Every card has layered backgrounds, inner shadows, and subtle borders
- **Glow as signal:** Colored box-shadows on hover indicate state and interactivity
- **Gradients as life:** Text gradients, gradient top-lines, mesh backgrounds give movement
- **Still functional:** All terminal/monospace DNA is preserved — just wrapped in glass

---

## Token System

### Colors (Catppuccin Mocha — retained)
| Token | Hex |
|-------|-----|
| base | #1e1e2e |
| mantle | #181926 |
| crust | #11111b |
| surface0 | #313244 |
| surface1 | #45475a |
| surface2 | #585b70 |
| overlay0 | #6c7086 |
| overlay1 | #7f849c |
| blue | #89b4fa |
| lavender | #b4befe |
| violet | #c6a0f6 |
| mauve | #f5c2e7 |
| pink | #f5c2e7 |
| flamingo | #f2cdcd |
| peach | #fab387 |
| yellow | #f9e2af |
| green | #a6e3a1 |
| teal | #94e2d5 |
| red | #f38ba8 |

### Glass Token
```css
.card-glass {
  background: linear-gradient(135deg, rgba(24,25,38,0.95), rgba(26,27,38,0.9));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(69,71,90,0.5);
  border-radius: 4px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.03) inset, 0 4px 16px rgba(0,0,0,0.3);
}
```

### Glow Variants
- `.card-glass-hover:hover` — lifts 1px, increases shadow
- `.card-glass-violet:hover` — violet glow on hover
- `.card-glass-sky:hover` — sky glow on hover
- `.card-glass-amber:hover` — amber glow on hover
- `.card-glass-emerald:hover` — emerald glow on hover
- `.card-glass-orange:hover` — orange glow on hover
- `.btn-glow-violet:hover` — violet button glow
- `.btn-glow-sky:hover` — sky button glow

### Gradient Text
- `.text-gradient-violet` — violet → blue → pink animated gradient
- `.text-gradient-sky` — sky → emerald → blue animated gradient

---

## Typography
- **Display (headings):** Outfit (700–900)
- **Body:** Inter (400–600)
- **Monospace:** JetBrains Mono (400–700) — terminal prompt, badges, stats

---

## Layout

### Landing Page
- **Hero:** Full-bleed gradient mesh background, animated scanline sweep, large gradient text headline
- **Domain cards:** Glass cards with domain-colored gradient top lines, glow on hover
- **Feature cards:** Glass + glow with per-domain accent colors

### Dashboard
- **Header:** Sticky, backdrop-blur, subtle border
- **Sidebar:** Glass card with domain-colored gradient accents
- **Main content:** Mesh gradient background with ambient glow orbs
- **Cards:** Glass surface, gradient top-line, colored border on hover

### Progress
- **Overall score:** Large monospace percentage, gradient progress bar
- **Per-domain breakdown:** Colored bars with domain-specific accents

---

## Animations
- `pulse-glow` — live dot indicator (2s ease-in-out infinite)
- `text-gradient` — gradient text animation (4s linear infinite)
- Scanline sweep — body::after pseudo-element (12s linear infinite)
- Hover lift — card-glass-hover transforms translateY(-1px)

---

## Files Modified
- `src/styles.css` — complete rewrite with glass/glow utilities
- `tailwind.config.ts` — border-radius restored to 3-4px
- `src/App.tsx` — ambient glow, glass content wrappers, backdrop-blur header
- `src/components/layout/PlatformLanding.tsx` — full glass/glow rewrite
- `src/components/layout/DashboardHome.tsx` — full glass/glow rewrite
- `src/components/layout/Sidebar.tsx` — glass sidebar with domain accents
- `src/components/shared/StatusLine.tsx` — terminal prompt with live dot
- `src/components/shared/QuickStat.tsx` — glass stat cards with glow
- `src/components/shared/ProgressIndexCard.tsx` — glass card with gradient bars
- `src/components/shared/DailySessionCard.tsx` — glass card with amber glow
- `src/components/shared/CertHub.tsx` — glass card with sky accents
- `src/components/learning/LearningPathView.tsx` — glass hero section
- `src/components/projects/ProjectsView.tsx` — glass hero + stat cards
- `src/components/scenarios/ScenariosHub.tsx` — glass cards
- `src/components/shared/ComingSoonCert.tsx` — glass styling

---

## Key Design Decisions
1. **Small border-radius (3-4px):** Keeps tech feel while avoiding the "dead" zero-radius look
2. **Gradient top-lines:** Signature visual element on every card — thin colored line at top
3. **Ambient glow orbs:** Fixed positioned blurred circles in background for depth
4. **Mesh gradient body:** Multiple radial gradients create living background
5. **Animated scanline:** Subtle movement across entire page without distraction
6. **Glass layering:** Cards sit on top of mesh background with blur for depth
