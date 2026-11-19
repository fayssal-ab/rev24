import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { AnimCard } from '../Stepper';
import { ORA_DIAG } from '../../i18n/animOracle';

/** Names shown in the boxes (same in every language: they are the official Oracle names). */
const NAMES: Record<string, string> = {
  user: 'User process',
  server: 'Server process',
  pga: 'PGA',
  shared: 'Shared Pool',
  lib: 'Library cache',
  dict: 'Data dictionary cache',
  buffer: 'Database Buffer Cache',
  redobuf: 'Redo Log Buffer',
  large: 'Large Pool',
  java: 'Java Pool',
  streams: 'Streams Pool',
  pmon: 'PMON',
  smon: 'SMON',
  dbw: 'DBWn',
  lgwr: 'LGWR',
  ckpt: 'CKPT',
  arc: 'ARCn',
  datafiles: 'Data files',
  control: 'Control files',
  redofiles: 'Redo log files',
  pfile: 'Parameter file',
  pwd: 'Password file',
  archives: 'Archived logs'
};
/** Boxes the student must fill in "test" mode. */
const TESTABLE = ['shared', 'buffer', 'redobuf', 'large', 'java', 'streams', 'pmon', 'smon', 'dbw', 'lgwr', 'ckpt', 'arc', 'datafiles', 'control', 'redofiles', 'pga'];

type Scen = keyof typeof ORA_DIAG.flows;

/**
 * The classic Oracle instance diagram of the course (user/server process + PGA, SGA with its pools,
 * background processes, database files), with animated arrows for each step of a scenario,
 * and a "test yourself" mode where the boxes must be named like on the exam paper.
 */
export default function InstanceDiagram() {
  const tl = useL();
  const [mode, setMode] = useState<'flow' | 'test'>('flow');
  const [scen, setScen] = useState<Scen>('update');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const steps = ORA_DIAG.flows[scen];
  const step = steps[Math.min(i, steps.length - 1)];
  const active = useMemo(() => new Set(mode === 'flow' ? step.edges.flat() : []), [mode, step]);
  const options = useMemo(() => [...TESTABLE].sort(() => Math.random() - 0.5), []);

  const measure = useCallback(() => {
    const root = box.current?.getBoundingClientRect();
    if (!root || mode !== 'flow') return setLines([]);
    const out: typeof lines = [];
    for (const [a, b] of step.edges) {
      const ra = refs.current[a]?.getBoundingClientRect();
      const rb = refs.current[b]?.getBoundingClientRect();
      if (!ra || !rb) continue;
      const ca = { x: ra.left + ra.width / 2 - root.left, y: ra.top + ra.height / 2 - root.top };
      const cb = { x: rb.left + rb.width / 2 - root.left, y: rb.top + rb.height / 2 - root.top };
      // stop the arrow at the edge of the target box
      const dx = cb.x - ca.x;
      const dy = cb.y - ca.y;
      const k = (r: DOMRect) => Math.min(Math.abs(r.width / 2 / (dx || 1e-6)), Math.abs(r.height / 2 / (dy || 1e-6)));
      const ka = k(ra);
      const kb = k(rb);
      out.push({ x1: ca.x + dx * ka, y1: ca.y + dy * ka, x2: cb.x - dx * kb, y2: cb.y - dy * kb });
    }
    setLines(out);
  }, [mode, step]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const correct = TESTABLE.filter((k) => answers[k] === k).length;

  const Node = ({ id, cls = '', small = false, children }: { id: string; cls?: string; small?: boolean; children?: ReactNode }) => {
    const on = active.has(id);
    const test = mode === 'test' && TESTABLE.includes(id);
    const ok = answers[id] === id;
    return (
      <div
        ref={(r) => {
          refs.current[id] = r;
        }}
        className={`relative rounded-lg border px-1.5 py-1.5 text-center font-semibold leading-tight transition-all duration-300 ${small ? 'text-[10px] sm:text-[11px]' : 'text-[11px] sm:text-xs'} ${cls} ${on ? 'z-10 scale-[1.04] ring-2 ring-accent shadow-lg' : ''} ${test && (answers[id] || revealed) ? (ok ? '!border-ok !bg-ok/15' : revealed ? '!border-bad !bg-bad/10' : '') : ''}`}
      >
        {test ? (
          revealed && !ok ? (
            <span className="text-bad">{NAMES[id]}</span>
          ) : (
            <select
              aria-label={`box ${id}`}
              value={answers[id] ?? ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [id]: e.target.value }))}
              className="w-full cursor-pointer bg-transparent text-center text-[10px] font-semibold outline-none sm:text-[11px]"
            >
              <option value="">?</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {NAMES[o]}
                </option>
              ))}
            </select>
          )
        ) : (
          (children ?? NAMES[id])
        )}
      </div>
    );
  };

  return (
    <AnimCard title={tl(ORA_DIAG.title)}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-line bg-surface2 p-0.5 text-xs font-semibold">
          {(['flow', 'test'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-md px-3 py-1.5 ${mode === m ? 'bg-surface text-accent shadow-sm' : 'text-muted'}`}>
              <Icon name={m === 'flow' ? 'route' : 'quiz'} size={13} className="mr-1 inline" />
              {tl(ORA_DIAG.modes[m])}
            </button>
          ))}
        </div>
        {mode === 'flow' &&
          (Object.keys(ORA_DIAG.flows) as Scen[]).map((s) => (
            <button key={s} onClick={() => { setScen(s); setI(0); }} className={`chip ${scen === s ? '!border-accent !text-accent' : ''}`}>
              {tl(ORA_DIAG.scen[s])}
            </button>
          ))}
        {mode === 'test' && (
          <>
            <span className="chip">
              {tl(ORA_DIAG.score)} : {correct}/{TESTABLE.length}
            </span>
            <button className="chip" onClick={() => setRevealed(true)}>
              <Icon name="eye" size={13} /> {tl(ORA_DIAG.reveal)}
            </button>
            <button className="chip" onClick={() => { setAnswers({}); setRevealed(false); }}>
              <Icon name="reset" size={13} /> {tl(ORA_DIAG.reset)}
            </button>
          </>
        )}
      </div>

      <div ref={box} className="relative overflow-x-auto">
        <div className="min-w-[560px] space-y-3">
          {/* client side */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <Node id="user" cls="border-slate-400/50 bg-slate-500/10 py-2" />
            <span className="text-[10px] text-muted">session</span>
            <div className="grid grid-cols-[1fr_auto] gap-1.5">
              <Node id="server" cls="border-slate-400/50 bg-slate-500/10 py-2" />
              <Node id="pga" cls="border-violet-500/50 bg-violet-500/10 py-2" />
            </div>
          </div>

          {/* instance */}
          <div className="rounded-xl border-2 border-emerald-600/60 bg-emerald-500/[0.04] p-2.5">
            <div className="mb-1.5 text-[11px] font-extrabold tracking-[0.2em] text-emerald-700 dark:text-emerald-300">{tl(ORA_DIAG.labels.instance)}</div>
            <div
              ref={(r) => {
                refs.current.sga = r;
              }}
              className={`rounded-lg border-2 border-amber-500/60 bg-amber-400/[0.07] p-2 transition ${active.has('sga') ? 'ring-2 ring-accent' : ''}`}
            >
              <div className="mb-1.5 text-[11px] font-extrabold tracking-[0.2em] text-amber-700 dark:text-amber-300">{tl(ORA_DIAG.labels.sga)}</div>
              <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2">
                <div className="space-y-1.5">
                  <Node id="shared" cls="border-amber-500/50 bg-amber-400/20 py-2" />
                  {mode === 'flow' && (
                    <div className="grid grid-cols-2 gap-1">
                      <Node id="lib" small cls="border-amber-500/30 bg-surface/70" />
                      <Node id="dict" small cls="border-amber-500/30 bg-surface/70" />
                    </div>
                  )}
                </div>
                <Node id="buffer" cls="flex items-center justify-center border-orange-500/50 bg-orange-400/20 py-4" />
                <Node id="redobuf" cls="flex items-center justify-center border-rose-500/50 bg-rose-400/15 py-4" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Node id="large" cls="border-amber-500/40 bg-amber-400/10" />
                <Node id="java" cls="border-amber-500/40 bg-amber-400/10" />
                <Node id="streams" cls="border-amber-500/40 bg-amber-400/10" />
              </div>
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{tl(ORA_DIAG.labels.bg)}</div>
            <div className="mt-1 grid grid-cols-6 gap-1.5">
              {['pmon', 'smon', 'dbw', 'lgwr', 'ckpt', 'arc'].map((k) => (
                <Node key={k} id={k} cls={`border-sky-500/50 bg-sky-400/15 py-2 font-mono ${k === 'arc' ? 'border-dashed' : ''}`} />
              ))}
            </div>
          </div>

          {/* database */}
          <div className="grid grid-cols-[3fr_2fr] gap-3">
            <div className="rounded-xl border-2 border-blue-700/50 bg-blue-600/[0.05] p-2.5">
              <div className="mb-1.5 text-[11px] font-extrabold tracking-[0.2em] text-blue-800 dark:text-blue-300">{tl(ORA_DIAG.labels.db)}</div>
              <div className="grid grid-cols-3 gap-1.5">
                <Node id="datafiles" cls="border-blue-500/50 bg-blue-500/15 py-3" />
                <Node id="control" cls="border-blue-500/50 bg-blue-500/15 py-3" />
                <Node id="redofiles" cls="border-blue-500/50 bg-blue-500/15 py-3" />
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-line p-2.5">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{tl(ORA_DIAG.labels.other)}</div>
              <div className="grid grid-cols-3 gap-1.5">
                <Node id="pfile" small cls="border-line bg-surface2" />
                <Node id="pwd" small cls="border-line bg-surface2" />
                <Node id="archives" small cls="border-line bg-surface2" />
              </div>
            </div>
          </div>
        </div>

        {/* arrows */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <marker id="ora-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="rgb(var(--accent))" />
            </marker>
          </defs>
          {lines.map((l, k) => (
            <motion.line
              key={`${scen}-${i}-${k}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="rgb(var(--accent))"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="7 5"
              markerEnd="url(#ora-arrow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, -24] }}
              transition={{ opacity: { duration: 0.3 }, strokeDashoffset: { duration: 0.8, repeat: Infinity, ease: 'linear' } }}
            />
          ))}
        </svg>
      </div>

      {mode === 'flow' ? (
        <div className="mt-4">
          <motion.div key={`${scen}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-surface2 p-3 text-sm">
            <span className="mr-2 font-mono text-xs font-bold text-accent">
              {i + 1}/{steps.length}
            </span>
            <L v={step.text} />
          </motion.div>
          <div className="mt-2 flex gap-2">
            <button className="btn-ghost btn-sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="previous">
              <Icon name="left" size={15} />
            </button>
            <button className="btn-primary btn-sm" onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i >= steps.length - 1}>
              <Icon name="right" size={15} />
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted">{tl(ORA_DIAG.testHint)}</p>
      )}
    </AnimCard>
  );
}
