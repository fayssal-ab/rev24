import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { mean, covariance, correlation, linReg } from '../../lib/stats';
import { rng } from '../../lib/graph';
import { SHAPE_COR } from '../../i18n/animData';

const N = 14;
const fmt = (x: number, d = 2) => (Math.round(x * 10 ** d) / 10 ** d).toString().replace('.', ',');

function dataset(kind: number, noise: number): { xs: number[]; ys: number[] } {
  const r = rng(17 + kind);
  const xs = Array.from({ length: N }, (_, i) => 1 + (i * 8) / (N - 1));
  const e = () => (r() - 0.5) * 2 * noise;
  const ys = xs.map((x) => {
    if (kind === 0) return 1 + 0.9 * x + e();
    if (kind === 1) return 9 - 0.8 * x + e();
    if (kind === 2) return 5 + r() * 4 - 2 + e() * 0.3;
    return 1 + 0.32 * (x - 5) ** 2 + e() * 0.5;
  });
  return { xs, ys };
}

/** Scatter plot with the mean point, the four quadrants and the signed rectangles whose mean is the covariance. */
export default function CorrelationShapes() {
  const tl = useL();
  const [kind, setKind] = useState(0);
  const [noise, setNoise] = useState(1);
  const { xs, ys } = useMemo(() => dataset(kind, noise), [kind, noise]);
  const mx = mean(xs);
  const my = mean(ys);
  const cov = covariance(xs, ys);
  const r = correlation(xs, ys);
  const { a, b } = linReg(xs, ys);
  const X = (v: number) => 40 + (v / 10) * 340;
  const Y = (v: number) => 250 - (v / 11) * 230;

  return (
    <AnimCard title={tl(SHAPE_COR.title)}>
      <L v={SHAPE_COR.hint} md className="mb-3 text-sm text-muted" />
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SHAPE_COR.sets.map((s, k) => (
          <button key={k} onClick={() => setKind(k)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${k === kind ? 'bg-accent text-white' : 'bg-surface2 hover:bg-accent/10'}`}>
            {tl(s)}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-xs">
          {tl(SHAPE_COR.noise)}
          <input type="range" min={0} max={3} step={0.1} value={noise} onChange={(e) => setNoise(+e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 400 270" className="w-full" role="img" aria-label="scatter">
          <line x1={40} x2={385} y1={250} y2={250} stroke="rgb(var(--line))" />
          <line x1={40} x2={40} y1={15} y2={250} stroke="rgb(var(--line))" />
          {xs.map((x, i) => {
            const pos = (x - mx) * (ys[i] - my) > 0;
            const x0 = Math.min(X(x), X(mx));
            const y0 = Math.min(Y(ys[i]), Y(my));
            return <motion.rect key={`r${i}`} animate={{ x: x0, y: y0, width: Math.abs(X(x) - X(mx)), height: Math.abs(Y(ys[i]) - Y(my)) }} fill={pos ? 'rgb(var(--ok) / 0.10)' : 'rgb(var(--bad) / 0.10)'} stroke={pos ? 'rgb(var(--ok) / 0.4)' : 'rgb(var(--bad) / 0.4)'} strokeWidth={0.7} />;
          })}
          <motion.line animate={{ x1: X(mx), x2: X(mx) }} y1={15} y2={250} stroke="rgb(var(--fg))" strokeDasharray="4 3" strokeOpacity={0.6} />
          <motion.line animate={{ y1: Y(my), y2: Y(my) }} x1={40} x2={385} stroke="rgb(var(--fg))" strokeDasharray="4 3" strokeOpacity={0.6} />
          <motion.line animate={{ y1: Y(a * 0 + b), y2: Y(a * 10 + b) }} x1={X(0)} x2={X(10)} stroke="rgb(var(--accent))" strokeWidth={2.5} />
          {xs.map((x, i) => (
            <motion.circle key={`p${i}`} animate={{ cx: X(x), cy: Y(ys[i]) }} r={4.5} fill="rgb(var(--accent2))" stroke="white" strokeWidth={1} />
          ))}
          <motion.circle animate={{ cx: X(mx), cy: Y(my) }} r={6} fill="rgb(var(--warn))" stroke="white" strokeWidth={1.5} />
          <motion.text animate={{ x: X(mx) + 9, y: Y(my) - 8 }} fontSize="11" fontWeight={700} fill="rgb(var(--fg))">
            (x̄ ; ȳ)
          </motion.text>
        </svg>
        <div className="space-y-2 font-mono text-sm">
          <div className="rounded-lg bg-surface2 px-3 py-2">x̄ = {fmt(mx)} · ȳ = {fmt(my)}</div>
          <div className={`rounded-lg px-3 py-2 ${cov >= 0 ? 'bg-ok/10 text-ok' : 'bg-bad/10 text-bad'}`}>cov(x, y) = {fmt(cov)}</div>
          <div className="rounded-lg bg-accent/10 px-3 py-2 text-lg font-black">r = {fmt(r, 3)}</div>
          <div className="rounded-lg bg-surface2 px-3 py-2">
            {tl(SHAPE_COR.line)} : y = {fmt(a)}·x {b >= 0 ? '+' : '−'} {fmt(Math.abs(b))}
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-surface2">
            <motion.div className="h-full" animate={{ width: `${Math.abs(r) * 100}%`, backgroundColor: r >= 0 ? 'rgb(var(--ok))' : 'rgb(var(--bad))' }} />
          </div>
          {kind === 3 && <L v={SHAPE_COR.trap} md className="font-sans text-sm" />}
        </div>
      </div>
    </AnimCard>
  );
}
