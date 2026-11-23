import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { confetti } from '../../components/confetti';
import { randomGraph, type Graph } from '../../lib/graph';
import { RO_GAME } from '../../i18n/animOracle';

type Mode = 'kruskal' | 'prim' | 'dijkstra';
interface Props {
  mode?: Mode;
}
interface Pop {
  id: number;
  x: number;
  y: number;
  text: string;
  good: boolean;
}

const MODES: Mode[] = ['kruskal', 'prim', 'dijkstra'];
const LIVES = 3;
const bestKey = (m: Mode) => `g22-arena-best-${m}`;
const readBest = (m: Mode) => {
  try {
    return Number(localStorage.getItem(bestKey(m)) ?? 0) || 0;
  } catch {
    return 0;
  }
};

/** Vertices on a slightly irregular ring so that edge labels do not pile up in the centre. */
function layout(g: Graph): [number, number][] {
  const n = g.labels.length;
  return g.labels.map((_, k) => {
    const a = (2 * Math.PI * k) / n - Math.PI / 2;
    const r = k % 2 ? 38 : 44;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  });
}

/** Union-find "find" over a parent array. */
const find = (p: number[], x: number): number => (p[x] === x ? x : (p[x] = find(p, p[x])));

/**
 * Graph Arena: the student plays Kruskal, Prim or Dijkstra by clicking, on random graphs that grow with the level.
 * Every click is checked against the rule of the algorithm (minimum, no cycle, leaving the tree, smallest distance).
 * Score with combo multiplier, 3 lives, time bonus, best score saved on the device.
 */
export default function GraphArena({ mode: initial = 'kruskal' }: Props) {
  const tl = useL();
  const [mode, setMode] = useState<Mode>(initial);
  const [level, setLevel] = useState(1);
  const [seed, setSeed] = useState(() => (Date.now() % 100000) + 7);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(() => readBest(initial));
  const [msg, setMsg] = useState<{ text: string; good: boolean } | null>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const [status, setStatus] = useState<'play' | 'won' | 'over'>('play');
  const [bonus, setBonus] = useState(0);
  const [record, setRecord] = useState(false);
  const [sec, setSec] = useState(0);
  const shake = useAnimationControls();
  const popId = useRef(0);

  const n = Math.min(5 + level, 9);
  const g = useMemo(() => randomGraph(n, seed * 31 + level, mode === 'dijkstra' ? 0.38 : 0.42, 1, mode === 'dijkstra' ? 12 : 15), [n, seed, level, mode]);
  const P = useMemo(() => layout(g), [g]);
  // weight badges: slide along the edge until they no longer overlap another badge or a vertex
  const W = useMemo(() => {
    const placed: [number, number][] = [];
    return g.edges.map((e) => {
      const [x1, y1] = P[e.u];
      const [x2, y2] = P[e.v];
      let best: [number, number] = [(x1 + x2) / 2, (y1 + y2) / 2];
      let bestGap = -1;
      for (const t of [0.5, 0.38, 0.62, 0.3, 0.7, 0.44, 0.56]) {
        const q: [number, number] = [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
        const gap = Math.min(99, ...placed.map(([a, b]) => Math.hypot(a - q[0], b - q[1])), ...P.map(([a, b]) => Math.hypot(a - q[0], b - q[1]) - 3));
        if (gap > bestGap) [best, bestGap] = [q, gap];
        if (gap >= 8) break;
      }
      placed.push(best);
      return best;
    });
  }, [g, P]);

  // game state per graph
  const [chosen, setChosen] = useState<number[]>([]); // edge indices (kruskal / prim)
  const [fixed, setFixed] = useState<number[]>([]); // vertex indices (dijkstra, in order)
  const [dist, setDist] = useState<number[]>([]);
  const [pred, setPred] = useState<(number | null)[]>([]);
  const [wrongEdge, setWrongEdge] = useState<number | null>(null);
  const [wrongVertex, setWrongVertex] = useState<number | null>(null);

  const reset = useCallback(() => {
    setChosen([]);
    setFixed([]);
    setDist(g.labels.map((_, i) => (i === 0 ? 0 : Infinity)));
    setPred(g.labels.map(() => null));
    setWrongEdge(null);
    setWrongVertex(null);
    setMsg(null);
    setSec(0);
    setStatus('play');
  }, [g]);
  useEffect(reset, [reset]);

  useEffect(() => {
    if (status !== 'play') return;
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status, g]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setLevel(1);
    setScore(0);
    setCombo(0);
    setLives(LIVES);
    setBest(readBest(m));
    setRecord(false);
    setSeed((s) => s + 101);
  };
  const restart = () => switchMode(mode);

  const pop = (x: number, y: number, text: string, good: boolean) => {
    const id = ++popId.current;
    setPops((p) => [...p, { id, x, y, text, good }]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 900);
  };

  const saveBest = (s: number) => {
    if (s > best) {
      setBest(s);
      setRecord(true);
      try {
        localStorage.setItem(bestKey(mode), String(s));
      } catch {
        /* private mode */
      }
    }
  };

  const good = (x: number, y: number) => {
    const c = combo + 1;
    const pts = 50 + 25 * Math.min(c - 1, 6);
    setCombo(c);
    setScore((s) => s + pts);
    pop(x, y, `+${pts}`, true);
    return pts;
  };
  const bad = (x: number, y: number, text: string) => {
    setCombo(0);
    setMsg({ text, good: false });
    pop(x, y, '✗', false);
    shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.35 } });
    const left = lives - 1;
    setLives(left);
    if (left <= 0) {
      setStatus('over');
      saveBest(score);
    }
  };
  const finish = (gained: number) => {
    const tb = Math.max(0, 300 - sec * 5) + 100 * level;
    setBonus(tb);
    const total = score + gained + tb;
    setScore(total);
    saveBest(total);
    setStatus('won');
    void confetti();
  };

  // ---------- rules ----------
  const comps = useMemo(() => {
    const p = g.labels.map((_, i) => i);
    for (const k of chosen) {
      const e = g.edges[k];
      p[find(p, e.u)] = find(p, e.v);
    }
    return p;
  }, [chosen, g]);
  const inTree = useMemo(() => {
    const s = new Set<number>([0]);
    for (const k of chosen) {
      s.add(g.edges[k].u);
      s.add(g.edges[k].v);
    }
    return s;
  }, [chosen, g]);

  const clickEdge = (k: number) => {
    if (status !== 'play' || mode === 'dijkstra' || chosen.includes(k)) return;
    const e = g.edges[k];
    const [x, y] = W[k];
    let valid: number[];
    if (mode === 'kruskal') {
      if (find([...comps], e.u) === find([...comps], e.v)) return flagEdge(k, x, y, tl(RO_GAME.errCycle));
      valid = g.edges.map((_, j) => j).filter((j) => !chosen.includes(j) && find([...comps], g.edges[j].u) !== find([...comps], g.edges[j].v));
    } else {
      const a = inTree.has(e.u);
      const b = inTree.has(e.v);
      if (a && b) return flagEdge(k, x, y, tl(RO_GAME.errCycle));
      if (!a && !b) return flagEdge(k, x, y, tl(RO_GAME.errOut));
      valid = g.edges.map((_, j) => j).filter((j) => inTree.has(g.edges[j].u) !== inTree.has(g.edges[j].v));
    }
    const min = Math.min(...valid.map((j) => g.edges[j].w));
    if (e.w > min) return flagEdge(k, x, y, `${tl(RO_GAME.errMin)} ${min}.`);
    const pts = good(x, y);
    const next = [...chosen, k];
    setChosen(next);
    setMsg({ text: `${g.labels[e.u]}–${g.labels[e.v]} (${e.w}) ✓`, good: true });
    if (next.length === g.labels.length - 1) finish(pts);
  };
  const flagEdge = (k: number, x: number, y: number, text: string) => {
    setWrongEdge(k);
    setTimeout(() => setWrongEdge(null), 600);
    bad(x, y, text);
  };

  const clickVertex = (v: number) => {
    if (status !== 'play' || mode !== 'dijkstra') return;
    const [x, y] = P[v];
    if (fixed.includes(v)) return flagVertex(v, x, y, tl(RO_GAME.errFixed));
    const open = g.labels.map((_, i) => i).filter((i) => !fixed.includes(i) && dist[i] < Infinity);
    const min = Math.min(...open.map((i) => dist[i]));
    if (!(dist[v] <= min)) return flagVertex(v, x, y, `${tl(RO_GAME.errDist)} ${min}.`);
    const pts = good(x, y);
    const nd = [...dist];
    const np = [...pred];
    const nf = [...fixed, v];
    for (const e of g.edges) {
      for (const [a, b] of [
        [e.u, e.v],
        [e.v, e.u]
      ]) {
        if (a === v && !nf.includes(b) && nd[v] + e.w < nd[b]) {
          nd[b] = nd[v] + e.w;
          np[b] = v;
        }
      }
    }
    setDist(nd);
    setPred(np);
    setFixed(nf);
    setMsg({ text: `${g.labels[v]} = ${dist[v]} ✓`, good: true });
    if (nf.length === g.labels.length) finish(pts);
  };
  const flagVertex = (v: number, x: number, y: number, text: string) => {
    setWrongVertex(v);
    setTimeout(() => setWrongVertex(null), 600);
    bad(x, y, text);
  };

  // ---------- drawing ----------
  const predEdge = (k: number) => {
    const e = g.edges[k];
    return (fixed.includes(e.v) && pred[e.v] === e.u) || (fixed.includes(e.u) && pred[e.u] === e.v);
  };
  const treeWeight = chosen.reduce((s, k) => s + g.edges[k].w, 0);
  const progress = mode === 'dijkstra' ? fixed.length / g.labels.length : chosen.length / (g.labels.length - 1);

  return (
    <figure className="card overflow-hidden">
      <figcaption className="relative overflow-hidden border-b border-line bg-[linear-gradient(120deg,rgb(var(--navy)),rgb(var(--accent)))] px-4 py-3 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 font-bold tracking-wide">
            <Icon name="rocket" size={18} /> {tl(RO_GAME.title)}
          </span>
          <div className="ml-auto flex gap-1 rounded-full bg-white/15 p-1">
            {MODES.map((m) => (
              <button key={m} onClick={() => switchMode(m)} className={`rounded-full px-3 py-1 text-xs font-bold transition ${m === mode ? 'bg-white text-[rgb(var(--navy))] shadow' : 'text-white/85 hover:bg-white/15'}`}>
                {tl(RO_GAME.modes[m])}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
          <Stat label={tl(RO_GAME.level)} value={String(level)} />
          <Stat label={tl(RO_GAME.score)} value={String(score)} big />
          <Stat label={tl(RO_GAME.best)} value={String(Math.max(best, score))} />
          <Stat label={tl(RO_GAME.combo)} value={combo > 1 ? `×${combo}` : '—'} hot={combo > 2} />
          <div className="flex items-center justify-center gap-1 rounded-lg bg-white/10 px-2 py-1.5">
            {Array.from({ length: LIVES }, (_, i) => (
              <motion.svg key={i} viewBox="0 0 24 24" width="18" height="18" animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.25 }}>
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill="#ff5a6e" />
              </motion.svg>
            ))}
            <span className="ml-1 font-mono">{sec}s</span>
          </div>
        </div>
      </figcaption>

      <div className="p-4">
        <L v={RO_GAME.goal[mode]} md className="text-sm" />
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface2">
          <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--accent)),rgb(var(--accent2)))]" animate={{ width: `${progress * 100}%` }} />
        </div>

        <motion.div animate={shake} className="relative mx-auto mt-3 max-w-[460px]">
          <svg viewBox="-6 -6 112 112" className="w-full touch-manipulation select-none" role="img" aria-label="graph game">
            <defs>
              <radialGradient id="arena-bg" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.10" />
                <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
              </radialGradient>
              <filter id="arena-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="56" fill="url(#arena-bg)" />
            {g.edges.map((e, k) => {
              const [x1, y1] = P[e.u];
              const [x2, y2] = P[e.v];
              const on = chosen.includes(k) || (mode === 'dijkstra' && predEdge(k));
              const wrong = wrongEdge === k;
              const color = wrong ? 'rgb(var(--bad))' : on ? 'rgb(var(--ok))' : 'rgb(var(--line))';
              const [mx, my] = W[k];
              return (
                <g key={k} onClick={() => clickEdge(k)} className={mode !== 'dijkstra' && status === 'play' && !on ? 'cursor-pointer' : ''}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={6} />
                  <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeLinecap="round" filter={on || wrong ? 'url(#arena-glow)' : undefined} initial={false} animate={{ strokeWidth: on ? 2.6 : wrong ? 2.6 : 1.1 }} />
                  <g className={mode !== 'dijkstra' ? 'transition-transform hover:scale-110' : ''} style={{ transformOrigin: `${mx}px ${my}px`, transformBox: 'view-box' }}>
                    <circle cx={mx} cy={my} r={3.4} fill={on ? 'rgb(var(--ok))' : 'rgb(var(--surface))'} stroke={wrong ? 'rgb(var(--bad))' : on ? 'rgb(var(--ok))' : 'rgb(var(--line))'} strokeWidth={0.6} />
                    <text x={mx} y={my + 1.3} textAnchor="middle" fontSize="3.6" fontWeight={800} fill={on ? 'white' : 'rgb(var(--fg))'} pointerEvents="none">
                      {e.w}
                    </text>
                  </g>
                </g>
              );
            })}
            {g.labels.map((l, v) => {
              const [x, y] = P[v];
              const isFixed = fixed.includes(v);
              const touched = mode === 'dijkstra' ? isFixed : mode === 'prim' ? inTree.has(v) : chosen.some((k) => g.edges[k].u === v || g.edges[k].v === v);
              const wrong = wrongVertex === v;
              return (
                <g key={l} onClick={() => clickVertex(v)} className={mode === 'dijkstra' && status === 'play' && !isFixed ? 'cursor-pointer' : ''}>
                  {mode === 'prim' && v === 0 && <circle cx={x} cy={y} r={8} fill="none" stroke="rgb(var(--accent2))" strokeWidth={0.6} strokeDasharray="1.5 1.5" />}
                  <motion.circle cx={x} cy={y} r={5.6} fill={wrong ? 'rgb(var(--bad))' : touched ? 'rgb(var(--accent))' : 'rgb(var(--surface))'} stroke="rgb(var(--accent))" strokeWidth={1.2} filter={touched ? 'url(#arena-glow)' : undefined} animate={{ scale: wrong ? [1, 1.25, 1] : touched ? 1.06 : 1 }} style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }} />
                  <text x={x} y={y + 1.7} textAnchor="middle" fontSize="4.8" fontWeight={800} fill={touched || wrong ? 'white' : 'rgb(var(--fg))'} pointerEvents="none">
                    {l}
                  </text>
                  {mode === 'dijkstra' && (
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="3.7" fontWeight={800} fill={isFixed ? 'rgb(var(--ok))' : 'rgb(var(--accent2))'} stroke="rgb(var(--surface))" strokeWidth="1" paintOrder="stroke" pointerEvents="none">
                      {dist[v] === undefined || dist[v] === Infinity ? '∞' : pred[v] !== null ? `${dist[v]};${g.labels[pred[v]!]}` : dist[v]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <AnimatePresence>
            {pops.map((p) => (
              <motion.span key={p.id} initial={{ opacity: 0, y: 0, scale: 0.6 }} animate={{ opacity: 1, y: -28, scale: 1.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className={`pointer-events-none absolute -translate-x-1/2 font-mono text-sm font-black drop-shadow ${p.good ? 'text-ok' : 'text-bad'}`} style={{ left: `${((p.x + 6) / 112) * 100}%`, top: `${((p.y + 6) / 112) * 100}%` }}>
                {p.text}
              </motion.span>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {status !== 'play' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface/80 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.8, y: 10 }} animate={{ scale: 1, y: 0 }} className="rounded-2xl border border-line bg-surface px-6 py-5 text-center shadow-xl">
                  <div className={`flex items-center justify-center gap-2 text-xl font-black ${status === 'won' ? 'text-ok' : 'text-bad'}`}>
                    <Icon name={status === 'won' ? 'award' : 'alert'} size={22} /> {tl(status === 'won' ? RO_GAME.levelDone : RO_GAME.over)}
                  </div>
                  {status === 'won' && mode !== 'dijkstra' && (
                    <div className="mt-1 font-mono text-sm text-muted">
                      {tl(RO_GAME.weight)} = {treeWeight}
                    </div>
                  )}
                  {status === 'won' && (
                    <div className="mt-1 font-mono text-sm text-accent2">
                      {tl(RO_GAME.timeBonus)} +{bonus}
                    </div>
                  )}
                  <div className="mt-2 font-mono text-3xl font-black">{score}</div>
                  {record && <div className="mt-1 text-xs font-bold uppercase tracking-wide text-warn">{tl(RO_GAME.newRecord)}</div>}
                  <button
                    className="btn-primary mt-4"
                    onClick={() => {
                      if (status === 'won') {
                        setLevel((x) => x + 1);
                        setSeed((s) => s + 13);
                      } else restart();
                    }}
                  >
                    <Icon name={status === 'won' ? 'right' : 'reset'} size={16} /> {tl(status === 'won' ? RO_GAME.next : RO_GAME.retry)}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-3 flex min-h-[2.25rem] flex-wrap items-center gap-2">
          <AnimatePresence mode="wait">
            {msg && (
              <motion.div key={msg.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`rounded-xl px-3 py-2 text-xs font-semibold ${msg.good ? 'bg-ok/10 text-ok' : 'bg-bad/10 text-bad'}`}>
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>
          {mode !== 'dijkstra' && <span className="ml-auto font-mono text-xs text-muted">{tl(RO_GAME.weight)} = {treeWeight}</span>}
        </div>
      </div>
    </figure>
  );
}

function Stat({ label, value, big, hot }: { label: string; value: string; big?: boolean; hot?: boolean }) {
  return (
    <div className={`rounded-lg px-2 py-1.5 text-center ${hot ? 'bg-warn/30' : 'bg-white/10'}`}>
      <div className="text-[10px] uppercase tracking-wider text-white/70">{label}</div>
      <motion.div key={value} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className={`font-mono font-black ${big ? 'text-lg' : 'text-sm'}`}>
        {value}
      </motion.div>
    </div>
  );
}
