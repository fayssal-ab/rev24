import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { CHART } from '../../i18n/animData';
import { AnimCard } from '../Stepper';

const A = 'rgb(var(--accent))';
const B = 'rgb(var(--accent2))';
const C = 'rgb(var(--warn))';

function Mini({ kind }: { kind: string }) {
  const box = (children: React.ReactNode) => (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-label={kind}>
      <line x1={10} y1={70} x2={115} y2={70} stroke="rgb(var(--line))" />
      <line x1={10} y1={5} x2={10} y2={70} stroke="rgb(var(--line))" />
      {children}
    </svg>
  );
  if (kind === 'bar') return box([20, 45, 30, 55].map((h, i) => <motion.rect key={i} x={18 + i * 24} width={16} initial={{ y: 70, height: 0 }} animate={{ y: 70 - h, height: h }} transition={{ delay: i * 0.08 }} fill={A} rx={2} />));
  if (kind === 'hist') return box([8, 18, 34, 50, 38, 20, 9].map((h, i) => <motion.rect key={i} x={14 + i * 14} width={14} initial={{ y: 70, height: 0 }} animate={{ y: 70 - h, height: h }} transition={{ delay: i * 0.05 }} fill={B} stroke="rgb(var(--surface))" />));
  if (kind === 'stack') return box([0, 1, 2, 3].map((i) => [[20, A], [15, B], [10, C]].reduce<{ y: number; els: React.ReactNode[] }>((acc, [h, col], k) => ({ y: acc.y - (h as number), els: [...acc.els, <motion.rect key={k} x={18 + i * 24} width={16} y={acc.y - (h as number) - i * 2} height={(h as number) + i * 2 * (k === 0 ? 1 : 0)} fill={col as string} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + k * 0.05 }} />] }), { y: 70, els: [] }).els));
  if (kind === 'scatter') return box(Array.from({ length: 22 }, (_, i) => { const x = 15 + i * 4.5; const y = 65 - i * 2.4 + ((i * 37) % 11) - 5; return <motion.circle key={i} cx={x} cy={y} r={2.4} fill={A} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.03 }} />; }));
  if (kind === 'line') return box(<motion.path d="M12,60 L30,52 L48,55 L66,38 L84,30 L102,18 L114,14" fill="none" stroke={A} strokeWidth={2.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />);
  return null;
}

export default function ChartChooser() {
  const tl = useL();
  const { t } = useT();
  const [g, setG] = useState(0);
  const goal = CHART.goals[g];
  return (
    <AnimCard title={tl(CHART.title)}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CHART.goals.map((x, k) => (
          <button key={x.id} className={`chip !text-xs ${k === g ? '!border-accent !bg-accent !text-bg' : ''}`} onClick={() => setG(k)}>
            {tl(x.n)}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={g} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ok/50 bg-ok/5 p-3">
            <div className="text-xs font-semibold uppercase text-ok">✓ {t('anim.recommended')}</div>
            <Mini kind={goal.ok} />
            <div className="text-sm font-semibold">{tl(goal.okN)}</div>
          </div>
          <div className="rounded-xl border border-bad/50 bg-bad/5 p-3">
            <div className="text-xs font-semibold uppercase text-bad">✗ {t('anim.avoid')}</div>
            <p className="mt-2 text-sm">{tl(goal.avoid)}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 text-sm text-muted">{tl(CHART.rules)}</p>
    </AnimCard>
  );
}
