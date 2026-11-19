import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { AnimCard } from '../Stepper';
import { parseGraph, kruskal, prim, dijkstra, degrees } from '../../lib/graph';
import { RO_ANIM } from '../../i18n/animOracle';

type Algo = 'kruskal' | 'prim' | 'dijkstra' | 'degrees';
interface Props {
  graph: string;
  algo: Algo;
  start?: string;
  target?: string;
  /** optional fixed positions, label → [x, y] in a 0..100 box */
  pos?: Record<string, [number, number]>;
  title?: string;
}

const key = (a: string, b: string) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const fmt = (d: number) => (d === Infinity ? '∞' : String(d));

/**
 * Draws a course graph and replays an algorithm on it, one step at a time, with the same table as on the exam paper
 * (Kruskal: "poids | arête | ✓/✗", Prim: "Ensemble S | (poids ; préd.)", Dijkstra: "sommet fixé | (distance ; préd.)").
 */
export default function GraphAlgo({ graph, algo, start, target, pos, title }: Props) {
  const tl = useL();
  const g = useMemo(() => parseGraph(graph), [graph]);
  const [i, setI] = useState(0);

  const P = useMemo(() => {
    const out: Record<string, [number, number]> = {};
    const n = g.labels.length;
    g.labels.forEach((l, k) => {
      out[l] = pos?.[l] ?? [50 + 40 * Math.cos((2 * Math.PI * k) / n - Math.PI / 2), 50 + 40 * Math.sin((2 * Math.PI * k) / n - Math.PI / 2)];
    });
    return out;
  }, [g, pos]);

  const run = useMemo(() => {
    if (algo === 'kruskal') return { kind: 'kruskal' as const, r: kruskal(g) };
    if (algo === 'prim') return { kind: 'prim' as const, r: prim(g, start) };
    if (algo === 'dijkstra') return { kind: 'dijkstra' as const, r: dijkstra(g, start ?? g.labels[0]) };
    return { kind: 'degrees' as const, r: degrees(g) };
  }, [algo, g, start]);

  const nSteps = run.kind === 'kruskal' ? run.r.steps.length : run.kind === 'prim' ? run.r.rows.length : run.kind === 'dijkstra' ? run.r.rows.length + 1 : 1;
  const last = i >= nSteps - 1;

  // what to colour at step i
  const good = new Set<string>();
  const bad = new Set<string>();
  const cur = new Set<string>();
  const fixed = new Set<string>();
  const vLabel: Record<string, string> = {};
  let caption = '';
  if (run.kind === 'kruskal') {
    run.r.steps.slice(0, i + 1).forEach((s, k) => {
      (s.accepted ? good : bad).add(s.edge);
      if (k === i) cur.add(s.edge);
    });
    const s = run.r.steps[i];
    const total = run.r.steps.slice(0, i + 1).filter((x) => x.accepted).reduce((a, x) => a + x.w, 0);
    caption = `${s.edge} (${s.w}) → ${s.accepted ? '✓' : '✗ ' + tl(RO_ANIM.cycle)} · ${tl(RO_ANIM.weight)} = ${total}`;
  } else if (run.kind === 'prim') {
    const rows = run.r.rows.slice(0, i + 1);
    rows.forEach((r, k) => {
      fixed.add(r.chosen);
      if (r.edge) good.add(r.edge);
      if (k === i && r.edge) cur.add(r.edge);
    });
    const r = run.r.rows[i];
    for (const [l, [d, p]] of Object.entries(r.cells)) if (l !== r.chosen) vLabel[l] = d === Infinity ? '∞' : `${d};${p}`;
    const total = rows.reduce((a, x) => a + (x.edge ? x.cells[x.chosen][0] : 0), 0);
    caption = `${tl(RO_ANIM.add)} ${r.chosen}${r.edge ? ` (${r.edge}, ${r.cells[r.chosen][0]})` : ` (${tl(RO_ANIM.start)})`} · ${tl(RO_ANIM.weight)} = ${total}`;
  } else if (run.kind === 'dijkstra') {
    const rows = run.r.rows.slice(0, i);
    rows.forEach((r) => fixed.add(r.fixed));
    const cells = i === 0 ? run.r.initial : run.r.rows[i - 1].cells;
    for (const [l, [d, p]] of Object.entries(cells)) vLabel[l] = p ? `${fmt(d)};${p}` : fmt(d);
    // predecessor edges of fixed vertices
    for (const l of fixed) {
      const p = cells[l][1];
      if (p) good.add(key(l, p));
    }
    if (last && target) {
      const path = run.r.path(target);
      for (let k = 1; k < path.length; k++) cur.add(key(path[k - 1], path[k]));
      caption = `${tl(RO_ANIM.path)} ${start} → ${target} : ${path.join(' – ')} = ${run.r.dist[target]}`;
    } else caption = i === 0 ? tl(RO_ANIM.init) : `${tl(RO_ANIM.fix)} ${run.r.rows[i - 1].fixed} (${fmt(cells[run.r.rows[i - 1].fixed][0])})`;
  } else {
    g.labels.forEach((l, k) => (vLabel[l] = `d=${(run.r as number[])[k]}`));
  }

  return (
    <AnimCard title={title ?? tl(RO_ANIM.titles[algo])}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox="-8 -8 116 116" className="mx-auto w-full max-w-[380px]" role="img" aria-label="graph">
          {g.edges.map((e, k) => {
            const a = g.labels[e.u];
            const b = g.labels[e.v];
            const kk = key(a, b);
            const [x1, y1] = P[a];
            const [x2, y2] = P[b];
            const isCur = cur.has(kk);
            const color = isCur ? (bad.has(kk) ? 'rgb(var(--bad))' : 'rgb(var(--accent2))') : good.has(kk) ? 'rgb(var(--ok))' : bad.has(kk) ? 'rgb(var(--bad))' : 'rgb(var(--line))';
            return (
              <g key={k}>
                <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={isCur ? 3.2 : good.has(kk) ? 2 : 1.2} strokeDasharray={bad.has(kk) && !isCur ? '2 2' : undefined} animate={{ opacity: 1 }} />
                {e.w !== 1 || algo !== 'degrees' ? (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 1.2} textAnchor="middle" fontSize="4.2" fontWeight={700} fill="rgb(var(--fg))" stroke="rgb(var(--surface))" strokeWidth="1.2" paintOrder="stroke">
                    {e.w}
                  </text>
                ) : null}
              </g>
            );
          })}
          {g.labels.map((l) => {
            const [x, y] = P[l];
            const on = fixed.has(l) || (run.kind === 'kruskal' && [...good].some((e) => e.split('-').includes(l)));
            return (
              <g key={l}>
                <motion.circle cx={x} cy={y} r={5.4} fill={on ? 'rgb(var(--accent))' : 'rgb(var(--surface))'} stroke="rgb(var(--accent))" strokeWidth={1.2} animate={{ scale: fixed.has(l) ? 1.08 : 1 }} />
                <text x={x} y={y + 1.6} textAnchor="middle" fontSize="4.6" fontWeight={800} fill={on ? 'white' : 'rgb(var(--fg))'}>
                  {l}
                </text>
                {vLabel[l] && (
                  <text x={x} y={y - 7.5} textAnchor="middle" fontSize="3.6" fontWeight={700} fill="rgb(var(--accent2))" stroke="rgb(var(--surface))" strokeWidth="1" paintOrder="stroke">
                    {vLabel[l]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="min-w-0 text-xs">
          {run.kind === 'kruskal' && (
            <table className="w-full">
              <thead className="text-muted">
                <tr>
                  <th className="p-1 text-left">{tl(RO_ANIM.weight)}</th>
                  <th className="p-1 text-left">{tl(RO_ANIM.edge)}</th>
                  <th className="p-1 text-left">✓ / ✗</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {run.r.steps.map((s, k) => (
                  <tr key={s.edge} className={`border-t border-line ${k === i ? 'bg-accent/10' : ''} ${k > i ? 'opacity-30' : ''}`}>
                    <td className="p-1">{s.w}</td>
                    <td className="p-1">{s.edge}</td>
                    <td className={`p-1 font-bold ${s.accepted ? 'text-ok' : 'text-bad'}`}>{k <= i ? (s.accepted ? '✓' : '✗') : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(run.kind === 'prim' || run.kind === 'dijkstra') && (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="text-muted">
                  <tr>
                    <th className="p-1 text-left">{run.kind === 'prim' ? 'S' : tl(RO_ANIM.fixedCol)}</th>
                    {g.labels.map((l) => (
                      <th key={l} className="p-1">
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {run.kind === 'prim'
                    ? run.r.rows.map((r, k) => (
                        <tr key={k} className={`border-t border-line ${k === i ? 'bg-accent/10' : ''} ${k > i ? 'opacity-25' : ''}`}>
                          <td className="p-1">{`{${[...r.inTree].join(',')}}`}</td>
                          {g.labels.map((l) => {
                            const c = r.cells[l];
                            return (
                              <td key={l} className={`p-1 text-center ${l === r.chosen ? 'font-bold text-accent' : ''}`}>
                                {c ? (c[0] === Infinity ? '∞' : c[1] ? `${c[0]};${c[1]}` : c[0]) : ''}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    : [{ fixed: '—', cells: run.r.initial }, ...run.r.rows].map((r, k) => (
                        <tr key={k} className={`border-t border-line ${k === i ? 'bg-accent/10' : ''} ${k > i ? 'opacity-25' : ''}`}>
                          <td className="p-1 font-bold">{r.fixed}</td>
                          {g.labels.map((l) => {
                            const c = r.cells[l];
                            return (
                              <td key={l} className="p-1 text-center">
                                {c[1] ? `${fmt(c[0])};${c[1]}` : fmt(c[0])}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
          {run.kind === 'degrees' && <L v={RO_ANIM.degreeHint} md />}
        </div>
      </div>

      {run.kind !== 'degrees' && (
        <div className="mt-3 space-y-2">
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-surface2 px-3 py-2 font-mono text-xs">
            {caption}
          </motion.div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost btn-sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="previous">
              <Icon name="left" size={15} />
            </button>
            <span className="font-mono text-xs text-muted">
              {i + 1}/{nSteps}
            </span>
            <button className="btn-primary btn-sm" onClick={() => setI(Math.min(nSteps - 1, i + 1))} disabled={last} aria-label="next">
              <Icon name="right" size={15} />
            </button>
            <button className="btn-ghost btn-sm" onClick={() => setI(nSteps - 1)}>
              {tl(RO_ANIM.end)}
            </button>
          </div>
        </div>
      )}
    </AnimCard>
  );
}
