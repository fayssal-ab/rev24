import { useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { ERRT } from '../../i18n/animData';
import { AnimCard } from '../Stepper';

export default function ErrorTable() {
  const tl = useL();
  const [k, setK] = useState(0);
  const c = ERRT.trial[k];
  const cell = (truth: number, dec: number) => {
    const on = c.truth === truth && c.dec === dec;
    const good = truth === dec;
    const label = truth === 0 && dec === 0 ? ERRT.ok1 : truth === 0 && dec === 1 ? ERRT.errI : truth === 1 && dec === 0 ? ERRT.errII : ERRT.power;
    return (
      <motion.td animate={{ scale: on ? 1.04 : 1 }} className={`rounded-xl border p-3 text-center text-sm font-semibold transition ${on ? (good ? 'border-ok bg-ok/20' : 'border-bad bg-bad/20') : good ? 'border-line bg-ok/5' : 'border-line bg-bad/5'}`}>
        {tl(label)}
      </motion.td>
    );
  };
  return (
    <AnimCard title={tl(ERRT.title)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-xs text-muted">
                {tl(ERRT.decision)} ↓ / {tl(ERRT.truth)} →
              </th>
              <th className="text-sm">{tl(ERRT.h0true)}</th>
              <th className="text-sm">{tl(ERRT.h0false)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-left text-sm">{tl(ERRT.keep)}</th>
              {cell(0, 0)}
              {cell(1, 0)}
            </tr>
            <tr>
              <th className="text-left text-sm">{tl(ERRT.reject)}</th>
              {cell(0, 1)}
              {cell(1, 1)}
            </tr>
          </tbody>
        </table>
      </div>
      <h4 className="mb-2 mt-4 text-sm font-semibold">⚖️ {tl(ERRT.trialTitle)}</h4>
      <div className="mb-2 flex flex-wrap gap-1">
        {ERRT.trial.map((_, i) => (
          <button key={i} className={`chip ${i === k ? '!border-accent !bg-accent !text-bg' : ''}`} onClick={() => setK(i)}>
            {i + 1}
          </button>
        ))}
      </div>
      <motion.div key={k} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-surface2 p-3 text-sm">
        <L v={c.t} md />
      </motion.div>
      <p className="mt-3 text-sm text-muted">{tl(ERRT.tradeoff)}</p>
    </AnimCard>
  );
}
