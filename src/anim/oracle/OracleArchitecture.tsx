import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { ORA_ARCH } from '../../i18n/animOracle';

type Key = keyof typeof ORA_ARCH.parts;

const SGA: Key[] = ['shared', 'buffer', 'redobuf', 'large', 'java', 'streams'];
const PROCS: Key[] = ['pmon', 'smon', 'dbw', 'lgwr', 'ckpt', 'arc'];
const FILES: Key[] = ['datafiles', 'control', 'redofiles'];
const CLIENT: Key[] = ['userproc', 'serverproc', 'pga'];

/** Clickable map of an Oracle server (course Chap 2–3): instance = SGA + background processes, database = files. */
export default function OracleArchitecture() {
  const tl = useL();
  const [sel, setSel] = useState<Key>('shared');
  const part = ORA_ARCH.parts[sel];
  const Box = ({ k, cls }: { k: Key; cls: string }) => (
    <button
      onClick={() => setSel(k)}
      aria-pressed={sel === k}
      className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold leading-tight transition sm:text-xs ${cls} ${sel === k ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface' : 'opacity-90 hover:opacity-100'}`}
    >
      {ORA_ARCH.parts[k].name}
    </button>
  );
  return (
    <AnimCard title={tl(ORA_ARCH.title)}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-3">
          {/* client side */}
          <div className="grid grid-cols-3 gap-2">
            {CLIENT.map((k) => (
              <Box key={k} k={k} cls="border-slate-400/40 bg-slate-500/10" />
            ))}
          </div>
          {/* instance */}
          <div className="rounded-xl border-2 border-emerald-600/50 bg-emerald-500/5 p-2.5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">{tl(ORA_ARCH.instance)}</div>
            <div className="rounded-lg border border-emerald-600/40 bg-emerald-500/10 p-2">
              <div className="mb-1.5 text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-200">SGA</div>
              <div className="grid grid-cols-3 gap-1.5">
                {SGA.map((k) => (
                  <Box key={k} k={k} cls="border-amber-500/40 bg-amber-400/15" />
                ))}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {PROCS.map((k) => (
                <Box key={k} k={k} cls="border-sky-500/40 bg-sky-400/15 font-mono" />
              ))}
            </div>
          </div>
          {/* database */}
          <div className="rounded-xl border-2 border-blue-700/40 bg-blue-600/5 p-2.5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">{tl(ORA_ARCH.database)}</div>
            <div className="grid grid-cols-3 gap-1.5">
              {FILES.map((k) => (
                <Box key={k} k={k} cls="border-blue-500/40 bg-blue-500/15" />
              ))}
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="rounded-xl bg-surface2 p-3 text-sm">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{tl(ORA_ARCH.parts[sel].group)}</div>
            <div className="mb-1.5 font-bold">{part.name}</div>
            <L v={part.role} md />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-xs text-muted">{tl(ORA_ARCH.hint)}</p>
    </AnimCard>
  );
}
