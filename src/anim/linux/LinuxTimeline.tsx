import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { TIMELINE } from '../../i18n/animLinux';
import { AnimCard } from '../Stepper';

export default function LinuxTimeline() {
  const tl = useL();
  const [sel, setSel] = useState(6);
  return (
    <AnimCard title={tl(TIMELINE.title)}>
      <div className="no-scrollbar relative -mx-4 overflow-x-auto px-4 pb-2">
        <div className="relative flex min-w-[640px] items-start justify-between pt-6">
          <div className="absolute left-0 right-0 top-[38px] h-0.5 bg-line" />
          {TIMELINE.events.map((e, k) => (
            <button key={e.y} onClick={() => setSel(k)} className="relative z-10 flex w-20 flex-col items-center gap-2 text-center" aria-pressed={k === sel}>
              <span className={`font-mono text-[11px] ${k === sel ? 'text-accent' : 'text-muted'}`}>{e.y}</span>
              <motion.span animate={{ scale: k === sel ? 1.4 : 1 }} className={`h-4 w-4 rounded-full border-2 ${k === sel ? 'border-accent bg-accent' : 'border-line bg-surface'}`} />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="min-h-[56px] rounded-xl bg-surface2 p-3 text-sm">
          <span className="mr-2 font-mono font-bold text-accent">{TIMELINE.events[sel].y}</span>
          <L v={TIMELINE.events[sel].t} />
        </motion.div>
      </AnimatePresence>
      <h4 className="mb-2 mt-4 text-sm font-semibold">{tl(TIMELINE.families)}</h4>
      <div className="grid gap-2 sm:grid-cols-3">
        {TIMELINE.fam.map((f) => (
          <div key={f.n} className="rounded-xl border border-line p-3 text-sm">
            <div className="font-semibold text-accent">{f.n}</div>
            <L v={f.t} />
          </div>
        ))}
      </div>
    </AnimCard>
  );
}
