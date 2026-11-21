import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { LIFECYCLE } from '../../i18n/animMobile';

type State = keyof typeof LIFECYCLE.states;
type Action = keyof typeof LIFECYCLE.actions;

const METHODS = ['onCreate', 'onStart', 'onResume', 'onPause', 'onStop', 'onRestart', 'onDestroy'] as const;

/** Allowed actions per state, and what each one triggers. */
function run(state: State, a: Action): { calls: string[]; next: State; newInstance: boolean; killed?: boolean } | null {
  switch (a) {
    case 'launch':
      return state === 'none' || state === 'destroyed' ? { calls: ['onCreate', 'onStart', 'onResume'], next: 'resumed', newInstance: true } : null;
    case 'home':
      return state === 'resumed' ? { calls: ['onPause', 'onStop'], next: 'stopped', newInstance: false } : null;
    case 'back':
      if (state === 'stopped') return { calls: ['onRestart', 'onStart', 'onResume'], next: 'resumed', newInstance: false };
      if (state === 'killed') return { calls: ['onCreate', 'onStart', 'onResume'], next: 'resumed', newInstance: true, killed: true };
      return null;
    case 'overlay':
      return state === 'resumed' ? { calls: ['onPause'], next: 'paused', newInstance: false } : null;
    case 'overlayGone':
      return state === 'paused' ? { calls: ['onResume'], next: 'resumed', newInstance: false } : null;
    case 'finish':
      return state === 'resumed' ? { calls: ['onPause', 'onStop', 'onDestroy'], next: 'destroyed', newInstance: false } : null;
    case 'rotate':
      return state === 'resumed' ? { calls: ['onPause', 'onStop', 'onDestroy', 'onCreate', 'onStart', 'onResume'], next: 'resumed', newInstance: true } : null;
    case 'kill':
      return state === 'stopped' ? { calls: [], next: 'killed', newInstance: false } : null;
  }
}

const TONE: Record<State, string> = {
  none: 'bg-surface2 text-muted',
  resumed: 'bg-ok/15 text-ok',
  paused: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  stopped: 'bg-navy/10 text-navy dark:bg-accent2/15 dark:text-accent2',
  destroyed: 'bg-bad/15 text-bad',
  killed: 'bg-bad/15 text-bad'
};

export default function ActivityLifecycle() {
  const tl = useL();
  const [state, setState] = useState<State>('none');
  const [inst, setInst] = useState(0);
  const [calls, setCalls] = useState<string[]>([]);
  const [last, setLast] = useState<{ a: Action; killed?: boolean } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [tick, setTick] = useState(0);

  const act = (a: Action) => {
    const r = run(state, a);
    if (!r) return;
    const n = r.newInstance ? inst + 1 : inst;
    setInst(n);
    setState(r.next);
    setCalls(r.calls);
    setLast({ a, killed: r.killed });
    setTick((t) => t + 1);
    const label = tl(LIFECYCLE.actions[a].label);
    setLog((l) => [...l.slice(-5), `> ${label}\n  ${r.calls.length ? r.calls.map((c) => c + '()').join(' → ') : '(' + tl(LIFECYCLE.none) + ')'}${r.newInstance ? `   [#${n}]` : ''}`]);
  };
  const reset = () => {
    setState('none');
    setInst(0);
    setCalls([]);
    setLast(null);
    setLog([]);
  };

  const lesson = last ? (last.killed ? LIFECYCLE.actions.back.lessonKilled : LIFECYCLE.actions[last.a].lesson) : null;

  return (
    <AnimCard title={tl(LIFECYCLE.title)}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-xs text-muted">MainActivity</span>
        <span className="chip font-mono">
          {tl(LIFECYCLE.instance)} {inst ? `#${inst}` : '—'}
        </span>
        <motion.span key={state} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-full px-3 py-1 text-xs font-semibold ${TONE[state]}`}>
          {tl(LIFECYCLE.state)} : {tl(LIFECYCLE.states[state])}
        </motion.span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label={tl(LIFECYCLE.calls)}>
        {METHODS.map((m) => {
          const k = calls.indexOf(m);
          const k2 = calls.lastIndexOf(m);
          const on = k >= 0;
          return (
            <motion.span
              key={`${m}-${tick}`}
              initial={on ? { opacity: 0.35, y: 4 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: on ? k * 0.18 : 0 }}
              className={`relative rounded-lg border px-2 py-1 font-mono text-xs ${on ? 'border-accent bg-accent text-white dark:text-bg' : 'border-line text-muted'}`}
            >
              {m}()
              {on && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-navy px-1 text-[9px] font-bold text-white">
                  {k === k2 ? k + 1 : `${k + 1},${k2 + 1}`}
                </span>
              )}
            </motion.span>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {(Object.keys(LIFECYCLE.actions) as Action[]).map((a) => {
          const ok = !!run(state, a);
          return (
            <button key={a} className={`btn-sm ${a === 'launch' ? 'btn-primary' : 'btn-ghost'} justify-center text-center`} disabled={!ok} title={ok ? undefined : tl(LIFECYCLE.disabled)} onClick={() => act(a)}>
              {tl(LIFECYCLE.actions[a].label)}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tick} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-surface2 p-3 text-sm">
          {lesson ? <L v={lesson} md /> : <span className="text-muted">{tl(LIFECYCLE.pick)}</span>}
        </motion.div>
      </AnimatePresence>

      <pre className="term mt-3 min-h-[64px] overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#0b1020] p-3 text-[12px] text-slate-300">{log.join('\n')}</pre>
      <div className="mt-2 flex justify-end">
        <button className="btn-ghost btn-sm" onClick={reset}>
          {tl(LIFECYCLE.reset)}
        </button>
      </div>
    </AnimCard>
  );
}
