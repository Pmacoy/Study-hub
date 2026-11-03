/**
 * src/components/layout/TerminalTitleBar.tsx
 *
 * A thin macOS-style terminal title bar spanning the full width.
 * Domain-colored traffic lights + app name in JetBrains Mono.
 * Shown at the top of every view (landing + domain).
 */
import type { Domain } from '../../types/platform';

const ACCENT: Record<string, { dot: string; ring: string; text: string }> = {
  violet:  { dot: 'bg-violet-500',    ring: 'border-violet-500/40', text: 'text-violet-400' },
  sky:     { dot: 'bg-sky-500',       ring: 'border-sky-500/40',    text: 'text-sky-400' },
  amber:   { dot: 'bg-amber-500',     ring: 'border-amber-500/40',  text: 'text-amber-400' },
  orange:  { dot: 'bg-orange-500',    ring: 'border-orange-500/40', text: 'text-orange-400' },
  emerald: { dot: 'bg-emerald-500',   ring: 'border-emerald-500/40',text: 'text-emerald-400' },
  rose:    { dot: 'bg-rose-500',      ring: 'border-rose-500/40',   text: 'text-rose-400' },
  red:     { dot: 'bg-red-500',       ring: 'border-red-500/40',    text: 'text-red-400' },
  cyan:    { dot: 'bg-cyan-500',      ring: 'border-cyan-500/40',   text: 'text-cyan-400' },
  teal:    { dot: 'bg-teal-500',      ring: 'border-teal-500/40',   text: 'text-teal-400' },
  fuchsia: { dot: 'bg-fuchsia-500',   ring: 'border-fuchsia-500/40',text: 'text-fuchsia-400' },
};

const DOMAIN_COLOR: Record<string, string> = {
  devops: 'violet',
  azure:  'sky',
  python: 'amber',
  aws:    'orange',
  networking: 'emerald',
  gcp:    'rose',
  oci:    'red',
  'algorithms': 'cyan',
  'system-design': 'rose',
  'distributed-systems': 'teal',
  'data-engineering': 'teal',
  'cybersecurity': 'red',
  'ai-ml': 'fuchsia'
};

const DOMAIN_NAME: Record<string, string> = {
  devops: 'DEVOPS',
  azure: 'AZURE',
  python: 'PYTHON',
  aws: 'AWS',
  networking: 'REDES',
  gcp: 'GCP',
  oci: 'OCI',
  'algorithms': 'ALGORITMOS',
  'system-design': 'SYSTEM DESIGN',
  'distributed-systems': 'SISTEMAS DIST.',
  'data-engineering': 'DATA ENG',
  'cybersecurity': 'CYBERSEC',
  'ai-ml': 'AI / ML'
};

export default function TerminalTitleBar({ domain }: { domain: Domain | null }) {
  const domainKey = domain ?? 'devops';
  const colorKey = DOMAIN_COLOR[domainKey] ?? 'violet';
  const accent = ACCENT[colorKey] ?? ACCENT['violet'];
  const domainName = DOMAIN_NAME[domainKey] ?? 'DEVOPS';

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
              <span className={`text-[10px] font-bold uppercase tracking-[0.14em] font-mono ${accent.text}`}>
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
