import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { L, Tex } from '../../components/Text';
import { CHI } from '../../i18n/animData';
import { AnimCard, StepperControls, useStepper } from '../Stepper';
import { chi2Normal } from '../../lib/stats';

const LABELS = ['< 0,5', '[0,5 ; 1[', '[1 ; 1,5[', '≥ 1,5'];
const f = (x: number, d = 3) => x.toFixed(d).replace('.', ',');

export default function ChiSquareBuilder() {
  const tl = useL();
  const { t } = useT();
  const s = useStepper(CHI.steps.length, 4000);
  const [O, setO] = useState([2, 23, 17, 8]);
  const r = useMemo(() => chi2Normal([0.5, 1, 1.5], O, 1.168, 0.591, 0.05), [O]);
  const n = O.reduce((a, b) => a + b, 0);
  const show = (k: number) => s.i >= k;
  return (
    <AnimCard title={tl(CHI.title)}>
      <p className="mb-2 text-sm text-muted">
        n = {n} · x̄ = 1,168 · S = 0,591 · α = 5 % — {tl(CHI.edit)}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-center text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="py-1 text-left">{tl(CHI.classes)}</th>
              <th>Oi</th>
              <th>pi</th>
              <th>Ei = n·pi</th>
              <th>(Oi−Ei)²/Ei</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {LABELS.map((lab, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-1.5 text-left font-sans">{lab}</td>
                <td>
                  <input type="number" min={0} value={O[i]} onChange={(e) => setO(O.map((x, k) => (k === i ? Math.max(0, +e.target.value || 0) : x)))} className="w-14 rounded-lg border border-line bg-surface2 px-1 py-1 text-center" aria-label={`O${i + 1}`} />
                </td>
                <td>{show(1) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>{f(r.p[i])}</motion.span>}</td>
                <td className={show(2) && r.E[i] < 5 ? 'text-bad' : ''}>{show(2) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>{f(r.E[i], 2)}</motion.span>}</td>
                <td>{show(3) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>{f(r.contributions[i])}</motion.span>}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-line font-bold">
              <td className="py-1.5 text-left font-sans">Σ</td>
              <td>{n}</td>
              <td>{show(1) && '1'}</td>
              <td>{show(2) && n}</td>
              <td className="text-accent" data-testid="chi2-total">
                {show(3) && f(r.chi2, 2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {show(2) && r.E.some((e) => e < 5) && <p className="mt-1 text-xs text-bad">{tl(CHI.small)}</p>}
      <motion.div key={s.i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 min-h-[60px] text-sm">
        <L v={CHI.steps[s.i]} md />
      </motion.div>
      {show(4) && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-1 text-sm">
          <Tex tex={`\\nu = k-p-1 = 4-2-1 = ${r.nu} \\qquad \\chi^2_{0{,}05}(${r.nu}) = ${f(r.crit)}`} block />
          <div className={`rounded-xl px-3 py-2 text-center font-bold ${r.reject ? 'bg-bad/15 text-bad' : 'bg-ok/15 text-ok'}`}>
            χ² = {f(r.chi2, 2)} {r.reject ? '>' : '≤'} {f(r.crit)} → {r.reject ? t('lab.reject') : t('lab.keep')}
          </div>
        </motion.div>
      )}
      <div className="mt-3">
        <StepperControls s={s} n={CHI.steps.length} />
      </div>
    </AnimCard>
  );
}
