import { Wifi, WifiOff, Flame } from 'lucide-react';
import BlockProgress from './BlockProgress';

function getStatusLine(domain: string | undefined, cert: string | undefined, progress: number, total: number, streak: number, nextItem?: string) {
  const status = navigator.onLine ? 'online' : 'offline';
  const statusIcon = status === 'online'
    ? <Wifi size={11} className="text-emerald-400" />
    : <WifiOff size={11} className="text-rose-400" />;

  const parts: React.ReactNode[] = [
    <span key="s" className="text-slate-500">$</span>,
    <span key="p" className="text-slate-300">study-hub</span>,
  ];

  if (domain) {
    parts.push(
      <span key="d" className="text-slate-600"> ~/{domain.toLowerCase()}</span>
    );
  }
  if (cert) {
    parts.push(
      <span key="c" className="text-slate-600"> · cert:{cert}</span>
    );
  }
  parts.push(
    <span key="st" className="text-slate-600"> · prog:{progress}/{total}</span>
  );
  if (streak > 0) {
    parts.push(
      <span key="sk" className="flex items-center gap-1 text-amber-400/80">
        <Flame size={10} className="inline" /> {streak}
      </span>
    );
  }
  if (nextItem) {
    parts.push(
      <span key="n" className="text-slate-600"> · next:{nextItem}</span>
    );
  }
  parts.push(
    <span key="ok" className="text-slate-600"> </span>,
    <span key="cursor" className="cursor-blink text-slate-400">▌</span>,
  );

  return (
    <div className="font-mono text-xs leading-relaxed">
      <div className="flex items-center gap-2 mb-1.5 text-slate-500">
        {statusIcon}
        <span>devops-study-hub · catppuccin/mocha</span>
      </div>
      <div className="text-slate-300 flex flex-wrap items-center gap-0.5">
        {parts}
      </div>
    </div>
  );
}

export default function StatusLine({
  domain, cert, progress, total, streak, nextItem,
}: {
  domain?: string;
  cert?: string;
  progress: number;
  total: number;
  streak: number;
  nextItem?: string;
}) {
  return (
    <div className="space-y-2">
      {getStatusLine(domain, cert, progress, total, streak, nextItem)}
      <div className="flex items-center gap-2">
        <BlockProgress value={progress} max={total} tone="violet" showPct={false} />
        <span className="text-2xs text-slate-500 font-mono">{progress}/{total}</span>
      </div>
    </div>
  );
}
