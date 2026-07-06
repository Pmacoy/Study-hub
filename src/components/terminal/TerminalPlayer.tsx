import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Circle, CheckCircle2, Terminal as TerminalIcon, Trophy, Lightbulb } from 'lucide-react';
import type { TerminalAttempt, TerminalHistoryEntry, TerminalSession } from '../../types/terminal';
import { runParser } from '../../utils/commandParser';

interface Props {
  session: TerminalSession;
  onExit: () => void;
  onComplete: (attempt: TerminalAttempt) => void;
}

export default function TerminalPlayer({ session, onExit, onComplete }: Props) {
  const [history, setHistory] = useState<TerminalHistoryEntry[]>(() => [
    { cmd: '', output: session.briefing, isSystem: true },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [goalsHit, setGoalsHit] = useState<Set<string>>(new Set());
  const [notesShown, setNotesShown] = useState<Set<string>>(new Set());
  const [stuckIdx, setStuckIdx] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [totalCommands, setTotalCommands] = useState(0);
  const [startTs] = useState(() => Date.now());

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allGoals = useMemo(() => new Set(session.objectives.map(o => o.goalTag)), [session]);
  const allDone = session.objectives.every(o => goalsHit.has(o.goalTag));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (allDone && !finished) {
      // Show debrief when complete
      const push = (out: string) => setHistory(prev => [...prev, { cmd: '', output: out, isSystem: true }]);
      push(`\n✓ Todos os objectivos completos!\n\n▓▓▓ DEBRIEF ▓▓▓\n\n${session.debrief.lesson}\n\nComandos-chave:\n${session.debrief.keyCommands.map(c => `  ${c}`).join('\n')}\n\nEscreve 'exit' para voltar aos cenários.`);
      setFinished(true);
      const attempt: TerminalAttempt = {
        sessionId: session.id,
        completedAt: new Date().toISOString(),
        totalCommands,
        objectivesHit: session.objectives.length,
        totalObjectives: session.objectives.length,
        durationSec: Math.round((Date.now() - startTs) / 1000),
      };
      onComplete(attempt);
    }
  }, [allDone, finished, session, totalCommands, startTs, onComplete]);

  const runCommand = useCallback((rawInput: string) => {
    const cmd = rawInput.trim();
    if (!cmd) return;

    setTotalCommands(c => c + 1);
    setCmdHistory(prev => [...prev, cmd].slice(-50));
    setHistoryIdx(-1);

    // Built-in commands
    if (cmd === 'clear' || cmd === 'cls') {
      setHistory([{ cmd: '', output: '', isSystem: true }]);
      return;
    }
    if (cmd === 'exit' || cmd === 'quit') {
      onExit();
      return;
    }
    if (cmd === 'help' || cmd === '?') {
      const list = session.handlers.slice(0, 6).map(h => `  ${h.tokens.map(t => t[0]).join(' ')}`).join('\n');
      setHistory(prev => [...prev, { cmd, output: `Comandos comuns:\n${list}\n\nOu escreve 'hint' para uma pista sobre o próximo passo.`, isSystem: true }]);
      return;
    }
    if (cmd === 'hint') {
      const hint = session.stuckHints[Math.min(stuckIdx, session.stuckHints.length - 1)];
      setStuckIdx(i => i + 1);
      setHistory(prev => [...prev, { cmd, output: `💡 ${hint}`, isSystem: true }]);
      return;
    }
    if (cmd === 'objectives' || cmd === 'goals') {
      const list = session.objectives.map(o => `  ${goalsHit.has(o.goalTag) ? '✓' : '○'} ${o.label}`).join('\n');
      setHistory(prev => [...prev, { cmd, output: `Objectivos:\n${list}`, isSystem: true }]);
      return;
    }

    // Parser
    const result = runParser(cmd, session.handlers);

    if (result.handler && result.ctx) {
      const output = typeof result.handler.output === 'function'
        ? result.handler.output(result.ctx)
        : result.handler.output;
      const entry: TerminalHistoryEntry = { cmd, output };
      setHistory(prev => [...prev, entry]);

      const gt = result.handler.goalTag;
      if (gt && allGoals.has(gt) && !goalsHit.has(gt)) {
        setGoalsHit(prev => new Set([...prev, gt]));
      }

      // Teaching note (once per handler)
      if (result.handler.teachingNote && !notesShown.has(result.handler.id)) {
        const note = result.handler.teachingNote;
        setNotesShown(prev => new Set([...prev, result.handler!.id]));
        setTimeout(() => {
          setHistory(prev => [...prev, { cmd: '', output: `💡 ${note}`, isSystem: true }]);
        }, 100);
      }
    } else if (result.suggestion) {
      const suggested = result.suggestion.tokens.map(t => t[0]).join(' ');
      setHistory(prev => [...prev, {
        cmd,
        output: `command not found or incomplete.\n\n💭 Talvez quisesses dizer: "${suggested}" ?\n\n(Escreve 'help' para ver comandos comuns ou 'hint' para uma pista.)`,
        isError: true,
      }]);
    } else {
      setHistory(prev => [...prev, {
        cmd,
        output: `${cmd.split(' ')[0]}: command not found`,
        isError: true,
      }]);
    }
  }, [session, allGoals, goalsHit, notesShown, stuckIdx, onExit]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = historyIdx < 0 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < 0) return;
      const next = historyIdx + 1;
      if (next >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
          <ArrowLeft size={14} /> Sair da sessão
        </button>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session.shell} · {session.difficulty}</div>
      </div>

      {/* Hook */}
      <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-5">
        <div className="flex items-start gap-3">
          <TerminalIcon size={18} className="text-violet-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-[15px] font-bold text-white">{session.title}</h2>
            <p className="mt-1.5 text-[12px] text-slate-300 leading-relaxed">{session.hook}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        {/* Terminal */}
        <section
          className="rounded-2xl border border-slate-800 bg-black overflow-hidden flex flex-col"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-2">{session.shell} — Study Hub</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed min-h-[420px] max-h-[520px]">
            {history.map((entry, i) => (
              <div key={i} className="mb-3">
                {entry.cmd && (
                  <div className="text-emerald-400">
                    <span className="text-slate-500">{session.prompt}</span>{entry.cmd}
                  </div>
                )}
                {entry.output && (
                  <pre className={`whitespace-pre-wrap mt-1 ${entry.isError ? 'text-rose-300' : entry.isSystem ? 'text-sky-300' : 'text-slate-300'}`}>{entry.output}</pre>
                )}
              </div>
            ))}
            <div className="flex items-center text-emerald-400">
              <span className="text-slate-500">{session.prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 caret-emerald-400 font-mono text-[12px]"
                placeholder={finished ? "escreve 'exit' para voltar" : ""}
              />
            </div>
          </div>
        </section>

        {/* Objectives sidebar */}
        <aside className="space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Objectivos</div>
              <div className="text-[10px] text-slate-500">{goalsHit.size}/{session.objectives.length}</div>
            </div>
            <div className="space-y-2">
              {session.objectives.map((o, i) => {
                const done = goalsHit.has(o.goalTag);
                return (
                  <div key={o.id} className={`flex items-start gap-2 p-2 rounded-lg transition-all ${done ? 'bg-emerald-500/8' : 'bg-slate-900'}`}>
                    <div className="shrink-0 mt-0.5">
                      {done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-600" />}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-[11px] font-semibold ${done ? 'text-emerald-300' : 'text-slate-300'}`}>{i + 1}. {o.label}</div>
                      {!done && <div className="text-[10px] text-slate-500 mt-0.5">{o.hint}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-3">
            <div className="flex items-start gap-2 text-[10px] text-sky-200 leading-relaxed">
              <Lightbulb size={12} className="text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Atalhos</div>
                <div>· <span className="font-mono text-sky-300">↑</span> / <span className="font-mono text-sky-300">↓</span> histórico</div>
                <div>· <span className="font-mono text-sky-300">hint</span> pista</div>
                <div>· <span className="font-mono text-sky-300">help</span> comandos</div>
                <div>· <span className="font-mono text-sky-300">objectives</span> ver estado</div>
                <div>· <span className="font-mono text-sky-300">clear</span> limpar</div>
                <div>· <span className="font-mono text-sky-300">exit</span> sair</div>
              </div>
            </div>
          </div>

          {allDone && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <Trophy size={20} className="text-emerald-400 mb-2" />
              <div className="text-[12px] font-bold text-emerald-300">Missão completa</div>
              <div className="text-[10px] text-slate-400 mt-1">{totalCommands} comandos · {Math.round((Date.now() - startTs) / 1000)}s</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
