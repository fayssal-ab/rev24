import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { RECYCLER } from '../../i18n/animMobile';

const TOTAL = 1000;
const VISIBLE = 5;
const NAMES = ['Sara', 'Youssef', 'Imane', 'Omar', 'Salma', 'Mehdi', 'Hiba', 'Anas', 'Kenza', 'Reda'];

type Row = { pos: number; vh: number; reused: boolean };
type S = { first: number; rows: Row[]; pool: number[]; created: number; bound: number; seen: number };

const init = (): S => ({
  first: 0,
  rows: Array.from({ length: VISIBLE }, (_, i) => ({ pos: i, vh: i + 1, reused: false })),
  pool: [],
  created: VISIBLE,
  bound: VISIBLE,
  seen: VISIBLE
});

function scroll(s: S, dir: 1 | -1): S {
  const first = s.first + dir;
  if (first < 0 || first + VISIBLE > TOTAL) return s;
  let { created, bound } = s;
  const pool = [...s.pool];
  let rows = s.rows.map((r) => ({ ...r, reused: false }));
  // the row leaving the screen gives its ViewHolder back
  const leaving = dir === 1 ? rows[0] : rows[rows.length - 1];
  pool.push(leaving.vh);
  rows = dir === 1 ? rows.slice(1) : rows.slice(0, -1);
  const pos = dir === 1 ? first + VISIBLE - 1 : first;
  let vh: number;
  let reused = false;
  if (pool.length) {
    vh = pool.shift()!;
    reused = true;
  } else {
    created += 1;
    vh = created;
  }
  bound += 1;
  const row = { pos, vh, reused };
  rows = dir === 1 ? [...rows, row] : [row, ...rows];
  return { first, rows, pool, created, bound, seen: Math.max(s.seen, first + VISIBLE) };
}

/** Shows that a RecyclerView keeps ~one ViewHolder per visible row and rebinds them while scrolling. */
export default function RecyclerSim() {
  const tl = useL();
  const [s, setS] = useState<S>(init);
  const go = (dir: 1 | -1, n = 1) =>
    setS((x) => {
      let y = x;
      for (let i = 0; i < n; i++) y = scroll(y, dir);
      return y;
    });

  const Stat = ({ label, v, tone }: { label: string; v: number; tone: string }) => (
    <div className="rounded-xl border border-line p-2">
      <motion.div key={v} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className={`font-mono text-xl font-bold ${tone}`}>
        {v}
      </motion.div>
      <div className="text-[11px] leading-tight text-muted">{label}</div>
    </div>
  );

  return (
    <AnimCard title={tl(RECYCLER.title)}>
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="mx-auto flex w-[180px] flex-col rounded-[22px] border-4 border-navy/80 bg-surface p-2 dark:border-accent2/60">
          <div className="mb-1 h-1.5 w-10 self-center rounded-full bg-line" />
          <div className="mb-1 text-center font-mono text-[9px] text-muted">
            {TOTAL} {tl(RECYCLER.items)}
          </div>
          <ul className="space-y-1 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {s.rows.map((r) => (
                <motion.li
                  key={r.pos}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[11px] ${r.reused ? 'border-accent bg-accent/10' : 'border-line bg-surface2'}`}
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy/80 text-[9px] font-bold text-white">{NAMES[r.pos % NAMES.length][0]}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {NAMES[r.pos % NAMES.length]} {r.pos + 1}
                  </span>
                  <span className={`rounded px-1 font-mono text-[9px] ${r.reused ? 'bg-accent text-white dark:text-bg' : 'bg-line/60'}`}>VH{r.vh}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat label={tl(RECYCLER.created)} v={s.created} tone="text-accent" />
            <Stat label={tl(RECYCLER.bound)} v={s.bound} tone="text-navy dark:text-accent2" />
            <Stat label={tl(RECYCLER.without)} v={s.seen} tone="text-bad" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button className="btn-primary btn-sm" onClick={() => go(1)} disabled={s.first + VISIBLE >= TOTAL}>
              ↓ {tl(RECYCLER.down)}
            </button>
            <button className="btn-ghost btn-sm" onClick={() => go(1, 20)} disabled={s.first + VISIBLE >= TOTAL}>
              ↓↓ {tl(RECYCLER.fast)}
            </button>
            <button className="btn-ghost btn-sm" onClick={() => go(-1)} disabled={s.first === 0}>
              ↑ {tl(RECYCLER.up)}
            </button>
            <button className="btn-ghost btn-sm" onClick={() => setS(init())}>
              {tl(RECYCLER.reset)}
            </button>
          </div>
          {s.rows.some((r) => r.reused) && (
            <p className="font-mono text-xs text-muted">
              {s.rows
                .filter((r) => r.reused)
                .map((r) => `VH${r.vh} ${tl(RECYCLER.reused)} → onBindViewHolder(holder, ${tl(RECYCLER.pos)} ${r.pos})`)
                .join(' · ')}
            </p>
          )}
          <div className="rounded-xl bg-surface2 p-3 text-sm">
            <L v={RECYCLER.lesson} md />
          </div>
        </div>
      </div>
    </AnimCard>
  );
}
