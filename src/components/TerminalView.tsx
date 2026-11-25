import { useEffect, useRef, useState } from 'react';
import type { Shell, OutChunk } from '../terminal/shell';
import { useT } from '../hooks/useT';

interface Line {
  text: string;
  err?: boolean;
  cmd?: boolean;
}

interface Props {
  shell: Shell;
  onCommand?: () => void;
  banner?: string;
  className?: string;
  /** external command injection (e.g. "run solution") */
  inject?: { id: number; lines: string[] } | null;
}

export function TerminalView({ shell, onCommand, banner, className = '', inject }: Props) {
  const { t } = useT();
  const [lines, setLines] = useState<Line[]>(banner ? [{ text: banner }] : []);
  const [input, setInput] = useState('');
  const [hIdx, setHIdx] = useState<number | null>(null);
  const [, force] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines(banner ? [{ text: banner }] : []);
  }, [shell, banner]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const promptText = shell.editor ? `${shell.editor.kind}> ` : shell.pending ? '' : shell.prompt();
  const hidden = !!shell.pending?.hidden;

  const push = (cmdLine: string, out: OutChunk[]) => {
    setLines((ls) => {
      let next = [...ls, { text: cmdLine, cmd: true }];
      for (const c of out) {
        if (c.text === '\u001bclear') next = [];
        else next.push({ text: c.text, err: c.err });
      }
      return next.slice(-600);
    });
  };

  const run = (raw: string) => {
    const shown = shell.pending ? (shell.pending.hidden ? '' : raw) : raw;
    const before = shell.editor ? `${shell.editor.kind}> ` : shell.pending ? '' : shell.prompt();
    const out = shell.input(raw);
    // with a pending prompt, the prompt text was already printed: append the (masked) answer to the last line
    if (!before) {
      setLines((ls) => {
        const copy = [...ls];
        const last = copy[copy.length - 1];
        if (last) copy[copy.length - 1] = { ...last, text: last.text + shown + (shell.pending || out.length ? '' : '\n') };
        for (const c of out) {
          if (c.text === '\u001bclear') copy.length = 0;
          else copy.push({ text: c.text, err: c.err });
        }
        return copy.slice(-600);
      });
    } else push(before + shown, out);
    setInput('');
    setHIdx(null);
    force((n) => n + 1);
    onCommand?.();
  };

  useEffect(() => {
    if (!inject) return;
    for (const l of inject.lines) run(l);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inject?.id]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
    } else if (e.key === 'ArrowUp' && !shell.pending) {
      e.preventDefault();
      const h = shell.history;
      if (!h.length) return;
      const i = hIdx === null ? h.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(i);
      setInput(h[i]);
    } else if (e.key === 'ArrowDown' && !shell.pending) {
      e.preventDefault();
      const h = shell.history;
      if (hIdx === null) return;
      const i = hIdx + 1;
      if (i >= h.length) {
        setHIdx(null);
        setInput('');
      } else {
        setHIdx(i);
        setInput(h[i]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (shell.pending || shell.editor) return;
      const r = shell.complete(input);
      setInput(r.line);
      if (r.options.length > 1) setLines((ls) => [...ls, { text: shell.prompt() + input, cmd: true }, { text: r.options.join('  ') + '\n' }]);
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (shell.pending) shell.pending = null;
      setLines((ls) => [...ls, { text: (promptText || '') + input + '^C', cmd: true }]);
      setInput('');
      force((n) => n + 1);
    }
  };

  return (
    <div
      className={`term flex flex-col overflow-hidden rounded-2xl border border-[#1f2a44] bg-[#0b1020] text-[13px] leading-[1.45] text-slate-200 shadow-inner ${className}`}
      onClick={() => inputRef.current?.focus()}
      data-testid="terminal"
    >
      <div className="flex items-center gap-1.5 border-b border-[#1f2a44] px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-rose-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-300/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 truncate text-xs text-slate-400">{shell.user}@rhel9 — bash</span>
      </div>
      <div data-lenis-prevent ref={scrollRef} className="min-h-[260px] flex-1 overflow-y-auto whitespace-pre-wrap break-words px-3 py-2" aria-live="polite" role="log">
        {lines.map((l, i) => (
          <div key={i} className={l.err ? 'text-rose-300' : l.cmd ? 'text-slate-100' : 'text-slate-300'}>
            {l.cmd ? colorPrompt(l.text) : l.text.replace(/\n$/, '')}
          </div>
        ))}
        <div className="flex">
          <span className="shrink-0 whitespace-pre">{colorPrompt(promptText)}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            type={hidden ? 'password' : 'text'}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-label={t('term.input')}
            className="min-w-0 flex-1 bg-transparent text-slate-100 caret-emerald-300 outline-none focus-visible:outline-none"
            data-testid="terminal-input"
          />
        </div>
      </div>
    </div>
  );
}

function colorPrompt(s: string) {
  const m = /^(\[[^\]]+\][$#] |switch_root:\/# |sh-5\.1# |\w+> )(.*)$/s.exec(s);
  if (!m) return s;
  const root = m[1].includes('#');
  return (
    <>
      <span className={root ? 'text-rose-300' : 'text-emerald-300'}>{m[1]}</span>
      {m[2]}
    </>
  );
}
