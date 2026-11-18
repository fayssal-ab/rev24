import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { FHS } from '../../i18n/animLinux';
import { AnimCard } from '../Stepper';

export default function FHSTree() {
  const tl = useL();
  const [open, setOpen] = useState<string | null>('/etc');
  return (
    <AnimCard title={tl(FHS.title)}>
      <p className="mb-2 text-sm text-muted">{tl(FHS.intro)}</p>
      <div className="term rounded-xl bg-[#0b1020] p-3 text-[13px] text-slate-200">
        <div className="text-rose-300">/</div>
        <ul>
          {FHS.dirs.map((d, k) => (
            <li key={d.d}>
              <button onClick={() => setOpen(open === d.d ? null : d.d)} aria-expanded={open === d.d} className={`flex w-full items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-white/5 ${open === d.d ? 'text-emerald-300' : 'text-cyan-300'}`}>
                <span className="text-slate-500">{k === FHS.dirs.length - 1 ? '└──' : '├──'}</span> {d.d.slice(1)}/
              </button>
              <AnimatePresence>
                {open === d.d && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="my-1 ml-8 rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-2 font-sans text-[13px] text-slate-200">
                      <L v={d.t} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </AnimCard>
  );
}
