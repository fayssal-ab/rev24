import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { mean, median, iqrBounds } from '../../lib/stats';
import { SHAPE_MM } from '../../i18n/animData';

const BASE = [8, 9.5, 10, 11, 11.5, 12, 12, 13, 14];
const MIN = 0;
const MAX = 40;
const fmt = (x: number) => (Math.round(x * 100) / 100).toString().replace('.', ',');

/** A number line with the marks as dots, the box plot above, and the mean / median markers; one mark is driven by a slider. */
export default function MeanMedianShapes() {
  const tl = useL();
  const [last, setLast] = useState(15);
  const xs = useMemo(() => [...BASE, last], [last]);
  const m = mean(xs);
  const med = median(xs);
  const b = iqrBounds(xs);
  const X = (v: number) => 20 + ((v - MIN) / (MAX - MIN)) * 560;
  const inside = xs.filter((v) => v >= b.low && v <= b.high);
  const wLo = Math.min(...inside);
  const wHi = Math.max(...inside);
  // stack equal values
  const seen = new Map<number, number>();
  const dots = [...xs].sort((a, c) => a - c).map((v) => {
    const k = seen.get(v) ?? 0;
    seen.set(v, k + 1);
    return { v, k, out: v < b.low || v > b.high };
  });

  return (
    <AnimCard title={tl(SHAPE_MM.title)}>
      <L v={SHAPE_MM.hint} md className="mb-3 text-sm text-muted" />
      <svg viewBox="0 0 600 210" className="w-full" role="img" aria-label="box plot">
        {/* box plot */}
        <line x1={X(wLo)} x2={X(b.q1)} y1={55} y2={55} stroke="rgb(var(--fg))" strokeWidth={1.5} />
        <line x1={X(b.q3)} x2={X(wHi)} y1={55} y2={55} stroke="rgb(var(--fg))" strokeWidth={1.5} />
        <line x1={X(wLo)} x2={X(wLo)} y1={45} y2={65} stroke="rgb(var(--fg))" strokeWidth={1.5} />
        <line x1={X(wHi)} x2={X(wHi)} y1={45} y2={65} stroke="rgb(var(--fg))" strokeWidth={1.5} />
        <motion.rect animate={{ x: X(b.q1), width: Math.max(1, X(b.q3) - X(b.q1)) }} y={35} height={40} rx={4} fill="rgb(var(--accent) / 0.15)" stroke="rgb(var(--accent))" strokeWidth={1.5} />
        <motion.line animate={{ x1: X(med), x2: X(med) }} y1={35} y2={75} stroke="rgb(var(--accent))" strokeWidth={3} />
        <text x={X(b.q1) - 3} y={28} textAnchor="end" fontSize="11" fill="rgb(var(--muted))">Q1 {fmt(b.q1)}</text>
        <text x={X(b.q3) + 3} y={28} textAnchor="start" fontSize="11" fill="rgb(var(--muted))">Q3 {fmt(b.q3)}</text>
        {/* fences */}
        {[b.low, b.high].map((f, k) => f >= MIN && f <= MAX && <line key={k} x1={X(f)} x2={X(f)} y1={20} y2={170} stroke="rgb(var(--bad))" strokeDasharray="4 4" strokeOpacity={0.6} />)}
        {/* axis */}
        <line x1={20} x2={580} y1={150} y2={150} stroke="rgb(var(--line))" strokeWidth={2} />
        {Array.from({ length: 9 }, (_, k) => k * 5).map((v) => (
          <g key={v}>
            <line x1={X(v)} x2={X(v)} y1={146} y2={154} stroke="rgb(var(--line))" />
            <text x={X(v)} y={168} textAnchor="middle" fontSize="11" fill="rgb(var(--muted))">{v}</text>
          </g>
        ))}
        {dots.map((d, i) => (
          <motion.circle key={i} animate={{ cx: X(d.v), cy: 138 - d.k * 11 }} r={5} fill={d.out ? 'rgb(var(--bad))' : 'rgb(var(--accent2))'} />
        ))}
        {/* mean triangle and median diamond under the axis */}
        <motion.path animate={{ d: `M${X(m)} 178 l-8 14 h16 z` }} fill="rgb(var(--warn))" />
        <motion.path animate={{ d: `M${X(med)} 176 l7 8 l-7 8 l-7 -8 z` }} fill="rgb(var(--accent))" />
      </svg>
      <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex items-center gap-3 text-sm">
          <span className="shrink-0 font-semibold">{tl(SHAPE_MM.last)}</span>
          <input type="range" min={0} max={40} step={0.5} value={last} onChange={(e) => setLast(+e.target.value)} className="w-full accent-[rgb(var(--accent))]" />
          <span className="w-12 font-mono">{fmt(last)}</span>
        </label>
        <div className="flex gap-3 font-mono text-sm">
          <span className="rounded-lg bg-warn/15 px-2 py-1">▲ {tl(SHAPE_MM.mean)} = {fmt(m)}</span>
          <span className="rounded-lg bg-accent/15 px-2 py-1">◆ {tl(SHAPE_MM.median)} = {fmt(med)}</span>
          <span className="rounded-lg bg-surface2 px-2 py-1">IQR = {fmt(b.iqr)}</span>
        </div>
      </div>
      {b.outliers > 0 && (
        <p className="mt-2 text-sm font-semibold text-bad">
          {fmt(last)} : {tl(SHAPE_MM.outlier)} → <L v={SHAPE_MM.lesson} md className="inline font-normal text-fg" />
        </p>
      )}
    </AnimCard>
  );
}
