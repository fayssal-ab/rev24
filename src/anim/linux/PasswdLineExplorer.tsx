import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { PASSWD } from '../../i18n/animLinux';
import { AnimCard } from '../Stepper';

type K = keyof typeof PASSWD.files;

export default function PasswdLineExplorer({ file = 'passwd' }: { file?: K }) {
  const tl = useL();
  const [f, setF] = useState<K>(file);
  const [sel, setSel] = useState(0);
  const data = PASSWD.files[f];
  const parts = data.line.split(':');
  return (
    <AnimCard title={tl(PASSWD.title)}>
      <div className="mb-3 flex flex-wrap gap-1" role="tablist">
        {(Object.keys(PASSWD.files) as K[]).map((k) => (
          <button key={k} role="tab" aria-selected={k === f} onClick={() => { setF(k); setSel(0); }} className={`rounded-lg px-3 py-1.5 font-mono text-xs ${k === f ? 'bg-accent text-bg' : 'bg-surface2 text-muted'}`}>
            /etc/{k}
          </button>
        ))}
      </div>
      <p className="mb-2 text-xs text-muted">{tl(PASSWD.tap)}</p>
      <div className="term flex flex-wrap items-center rounded-xl bg-[#0b1020] p-3 text-[13px]">
        {parts.map((p, k) => (
          <span key={k} className="flex items-center">
            <button onClick={() => setSel(k)} className={`rounded px-1 py-0.5 transition ${k === sel ? 'bg-emerald-400 text-[#0b1020]' : 'text-emerald-300 hover:bg-white/10'}`} aria-pressed={k === sel}>
              {p || '∅'}
            </button>
            {k < parts.length - 1 && <span className="text-slate-500">:</span>}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={f + sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 min-h-[64px] rounded-xl border border-line bg-surface2 p-3 text-sm">
          <span className="chip mb-1 font-mono">#{sel + 1}</span>
          <L v={data.fields[sel]} md />
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 text-xs text-muted">
        <L v={data.perm} />
      </div>
    </AnimCard>
  );
}
