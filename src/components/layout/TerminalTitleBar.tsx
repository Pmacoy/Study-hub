/**
 * src/components/layout/TerminalTitleBar.tsx
 *
 * A thin macOS-style terminal title bar spanning the full width.
 * Domain-colored traffic lights + app name in JetBrains Mono.
 * Shown at the top of every view (landing + domain).
 */
import type { Domain } from '../../types/platform';

const ACCENT: Record<string, { dot: string; ring: string }> = {
  violet:  { dot: 'bg-violet-500',    ring: 'border-violet-500/40' },
  sky:     { dot: 'bg-sky-500',       ring: 'border-sky-500/40' },
  amber:   { dot: 'bg-amber-500',     ring: 'border-amber-500/40' },
  orange:  { dot: 'bg-orange-500',    ring: 'border-orange-500/40' },
  emerald: { dot: 'bg-emerald-500',   ring: 'border-emerald-500/40' },
  rose:    { dot: 'bg-rose-500',      ring: 'border-rose-500/40' },
};

const DOMAIN_LABEL: Record<string, string> = {
  violet: 'devops',
  sky:    'azure',
  amber:  'python',
  orange: 'aws',
  emerald:'networking',
};

export default function TerminalTitleBar({ domain }: { domain: Domain | null }) {
  const domainKey = domain ?? 'devops';
  const domainColor = DOMAIN_LABEL[domainKey] ?? 'devops';
  const accent = ACCENT[domainColor] ?? ACCENT['violet'];
  const domainName = domain === 'azure' ? 'AZURE'
    : domain === 'aws' ? 'AWS'
    : domain === 'networking' ? 'REDES'
    : domain === 'python' ? 'PYTHON'
    : 'DEVOPS';

  return (
    <div className="h-8 w-full shrink-0 border-b border-slate-800 bg-[#181926]">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 md:px-6">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className={`h-2.5 w-2.5 ${accent.dot} border ${accent.ring}`} />
          <div className="h-2.5 w-2.5 rounded-sm bg-slate-600 border border-slate-500/40" />
          <div className="h-2.5 w-2.5 rounded-sm bg-slate-600 border border-slate-500/40" />
        </div>

        {/* App name + domain */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 font-mono">
            study-hub
          </span>
          {domain && (
            <>
              <span className="text-slate-700 font-mono text-[9px]">▸</span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.14em] font-mono ${accent.dot.replace('bg-', 'text-')}`}>
                {domainName}
              </span>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-600">
            {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
