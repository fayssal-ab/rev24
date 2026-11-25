/**
 * Graph algorithms for the RO module. Every numeric answer of the RO content is produced here.
 *
 * Text format used by content files (so graphs fit in JSON strings):
 *   "A B C D | A-C:4 A-D:3 C-D"      undirected, weighted (default weight 1)
 *   "1 2 3 | 1>2 2>3 3>1 1>1"        directed (">"), loops allowed
 * The vertex list before "|" is optional; vertices then appear in order of first use.
 */

export interface Edge {
  u: number;
  v: number;
  w: number;
}

export interface Graph {
  labels: string[];
  directed: boolean;
  edges: Edge[];
}

export function parseGraph(src: string): Graph {
  const [head, body] = src.includes('|') ? src.split('|') : ['', src];
  const labels: string[] = head.trim() ? head.trim().split(/[\s,]+/) : [];
  const idx = (l: string) => {
    let i = labels.indexOf(l);
    if (i < 0) {
      labels.push(l);
      i = labels.length - 1;
    }
    return i;
  };
  let directed = false;
  const edges: Edge[] = [];
  for (const tok of body.trim().split(/[\s,]+/).filter(Boolean)) {
    const m = /^([^-:>]+)([->])([^:]+)(?::(-?\d+(?:\.\d+)?))?$/.exec(tok);
    if (!m) throw new Error(`Bad edge token "${tok}"`);
    if (m[2] === '>') directed = true;
    edges.push({ u: idx(m[1]), v: idx(m[3]), w: m[4] !== undefined ? +m[4] : 1 });
  }
  return { labels, directed, edges };
}

export function formatGraph(g: Graph): string {
  return `${g.labels.join(' ')} | ${g.edges.map((e) => `${g.labels[e.u]}${g.directed ? '>' : '-'}${g.labels[e.v]}${e.w !== 1 ? ':' + e.w : ''}`).join(' ')}`;
}

const G = (g: Graph | string) => (typeof g === 'string' ? parseGraph(g) : g);
export const order = (g: Graph | string) => G(g).labels.length;
export const size = (g: Graph | string) => G(g).edges.length;

/** Degrees (undirected: a loop counts twice; directed: in + out). */
export function degrees(gg: Graph | string): number[] {
  const g = G(gg);
  const d = g.labels.map(() => 0);
  for (const e of g.edges) {
    d[e.u]++;
    d[e.v]++;
  }
  return d;
}


export function degreeOf(gg: Graph | string, label: string): number {
  const g = G(gg);
  return degrees(g)[g.labels.indexOf(label)];
}

/** Adjacency matrix: mij = number of edges between i and j (directed: arcs i → j). A loop adds 1 on the diagonal. */
export function adjacency(gg: Graph | string): number[][] {
  const g = G(gg);
  const n = g.labels.length;
  const m = Array.from({ length: n }, () => Array(n).fill(0) as number[]);
  for (const e of g.edges) {
    m[e.u][e.v]++;
    if (!g.directed && e.u !== e.v) m[e.v][e.u]++;
  }
  return m;
}


export function matMul(a: number[][], b: number[][]): number[][] {
  return a.map((row) => b[0].map((_, j) => row.reduce((s, x, k) => s + x * b[k][j], 0)));
}

export function matPow(m: number[][], k: number): number[][] {
  let r: number[][] = m.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
  for (let i = 0; i < k; i++) r = matMul(r, m);
  return r;
}

export const trace = (m: number[][]) => m.reduce((s, row, i) => s + row[i], 0);

/** Neighbours (undirected view). */
export function neighbours(gg: Graph | string, i: number): number[] {
  const g = G(gg);
  const s = new Set<number>();
  for (const e of g.edges) {
    if (e.u === i) s.add(e.v);
    if (e.v === i && !g.directed) s.add(e.u);
  }
  return [...s].sort((a, b) => a - b);
}

/** Connected (ignoring direction and isolated vertices are counted). */
export function isConnected(gg: Graph | string): boolean {
  const g = G(gg);
  const n = g.labels.length;
  if (n === 0) return true;
  const adj = g.labels.map(() => [] as number[]);
  for (const e of g.edges) {
    adj[e.u].push(e.v);
    adj[e.v].push(e.u);
  }
  const seen = new Set([0]);
  const st = [0];
  while (st.length) for (const v of adj[st.pop()!]) if (!seen.has(v)) {
      seen.add(v);
      st.push(v);
    }
  return seen.size === n;
}

export function isStronglyConnected(gg: Graph | string): boolean {
  const g = G(gg);
  const n = g.labels.length;
  const reach = (from: number, rev: boolean) => {
    const seen = new Set([from]);
    const st = [from];
    while (st.length) {
      const x = st.pop()!;
      for (const e of g.edges) {
        const [a, b] = rev ? [e.v, e.u] : [e.u, e.v];
        if (a === x && !seen.has(b)) {
          seen.add(b);
          st.push(b);
        }
      }
    }
    return seen.size;
  };
  return reach(0, false) === n && reach(0, true) === n;
}


export function isSimple(gg: Graph | string): boolean {
  const g = G(gg);
  const seen = new Set<string>();
  for (const e of g.edges) {
    if (e.u === e.v) return false;
    const k = g.directed ? `${e.u}>${e.v}` : `${Math.min(e.u, e.v)}-${Math.max(e.u, e.v)}`;
    if (seen.has(k)) return false;
    seen.add(k);
  }
  return true;
}

export const completeEdges = (n: number) => (n * (n - 1)) / 2;
export const cayley = (n: number) => n ** (n - 2);

export function isComplete(gg: Graph | string): boolean {
  const g = G(gg);
  return !g.directed && isSimple(g) && g.edges.length === completeEdges(g.labels.length);
}

export function missingForComplete(gg: Graph | string): number {
  const g = G(gg);
  return completeEdges(g.labels.length) - g.edges.length;
}

export function oddVertices(gg: Graph | string): string[] {
  const g = G(gg);
  return degrees(g)
    .map((d, i) => (d % 2 ? g.labels[i] : null))
    .filter((x): x is string => x !== null);
}

/** 'cycle' (eulerian), 'chain' (semi-eulerian), or 'none'. Requires connectivity of the non-isolated part. */
export function eulerType(gg: Graph | string): 'cycle' | 'chain' | 'none' {
  const g = G(gg);
  const deg = degrees(g);
  const used = g.labels.map((_, i) => i).filter((i) => deg[i] > 0);
  if (!used.length) return 'cycle';
  const sub: Graph = { ...g, directed: false };
  const adj = g.labels.map(() => [] as number[]);
  for (const e of sub.edges) {
    adj[e.u].push(e.v);
    adj[e.v].push(e.u);
  }
  const seen = new Set([used[0]]);
  const st = [used[0]];
  while (st.length) for (const v of adj[st.pop()!]) if (!seen.has(v)) {
      seen.add(v);
      st.push(v);
    }
  if (used.some((i) => !seen.has(i))) return 'none';
  const odd = deg.filter((d) => d % 2).length;
  return odd === 0 ? 'cycle' : odd === 2 ? 'chain' : 'none';
}

/** Hierholzer: eulerian cycle/chain as a list of labels, or null. */
export function eulerPath(gg: Graph | string, startLabel?: string): string[] | null {
  const g = G(gg);
  const type = eulerType(g);
  if (type === 'none') return null;
  const deg = degrees(g);
  let start = startLabel ? g.labels.indexOf(startLabel) : type === 'chain' ? deg.findIndex((d) => d % 2 === 1) : deg.findIndex((d) => d > 0);
  if (start < 0) start = 0;
  const used = g.edges.map(() => false);
  const adj = g.labels.map(() => [] as { to: number; id: number }[]);
  g.edges.forEach((e, id) => {
    adj[e.u].push({ to: e.v, id });
    if (e.u !== e.v) adj[e.v].push({ to: e.u, id });
  });
  for (const a of adj) a.sort((x, y) => x.to - y.to);
  const stack = [start];
  const path: number[] = [];
  while (stack.length) {
    const v = stack[stack.length - 1];
    const nxt = adj[v].find((x) => !used[x.id]);
    if (nxt) {
      used[nxt.id] = true;
      stack.push(nxt.to);
    } else path.push(stack.pop()!);
  }
  if (path.length !== g.edges.length + 1) return null;
  return path.reverse().map((i) => g.labels[i]);
}

/** Check that a walk (labels) uses every edge exactly once. */
export function isEulerWalk(gg: Graph | string, walk: string[]): boolean {
  const g = G(gg);
  if (walk.length !== g.edges.length + 1) return false;
  const used = g.edges.map(() => false);
  for (let i = 0; i + 1 < walk.length; i++) {
    const a = g.labels.indexOf(walk[i]);
    const b = g.labels.indexOf(walk[i + 1]);
    const id = g.edges.findIndex((e, k) => !used[k] && ((e.u === a && e.v === b) || (!g.directed && e.u === b && e.v === a)));
    if (id < 0) return false;
    used[id] = true;
  }
  return true;
}

/** Backtracking hamiltonian cycle (small graphs). */
export function hamiltonianCycle(gg: Graph | string): string[] | null {
  const g = G(gg);
  const n = g.labels.length;
  if (n === 0) return null;
  const adj = g.labels.map((_, i) => new Set(neighbours(g, i)));
  const path = [0];
  const seen = new Set([0]);
  const rec = (): boolean => {
    if (path.length === n) return adj[path[n - 1]].has(0);
    for (const v of [...adj[path[path.length - 1]]].sort((a, b) => a - b)) {
      if (seen.has(v)) continue;
      seen.add(v);
      path.push(v);
      if (rec()) return true;
      path.pop();
      seen.delete(v);
    }
    return false;
  };
  if (n > 1 && rec()) return [...path, 0].map((i) => g.labels[i]);
  return null;
}

export function isHamiltonCycle(gg: Graph | string, walk: string[]): boolean {
  const g = G(gg);
  const n = g.labels.length;
  if (walk.length !== n + 1 || walk[0] !== walk[n]) return false;
  if (new Set(walk.slice(0, n)).size !== n) return false;
  for (let i = 0; i < n; i++) {
    const a = g.labels.indexOf(walk[i]);
    const b = g.labels.indexOf(walk[i + 1]);
    if (a < 0 || b < 0 || !neighbours(g, a).includes(b)) return false;
  }
  return true;
}

// ---------- spanning trees ----------
const edgeKey = (g: Graph, e: Edge) => (e.u <= e.v ? `${g.labels[e.u]}-${g.labels[e.v]}` : `${g.labels[e.v]}-${g.labels[e.u]}`);

export interface KruskalStep {
  edge: string;
  w: number;
  accepted: boolean;
  components: string[][];
}

/** Kruskal: edges sorted by weight (ties: label order); returns every examined step (exam table). */
export function kruskal(gg: Graph | string) {
  const g = G(gg);
  const n = g.labels.length;
  const parent = g.labels.map((_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const sorted = g.edges
    .map((e) => ({ e, key: edgeKey(g, e) }))
    .filter((x) => x.e.u !== x.e.v)
    .sort((a, b) => a.e.w - b.e.w || Math.min(a.e.u, a.e.v) - Math.min(b.e.u, b.e.v) || Math.max(a.e.u, a.e.v) - Math.max(b.e.u, b.e.v));
  const steps: KruskalStep[] = [];
  const tree: string[] = [];
  let total = 0;
  for (const { e, key } of sorted) {
    if (tree.length === n - 1) break;
    const ru = find(e.u);
    const rv = find(e.v);
    const accepted = ru !== rv;
    if (accepted) {
      parent[ru] = rv;
      tree.push(key);
      total += e.w;
    }
    const comps = new Map<number, string[]>();
    g.labels.forEach((l, i) => {
      const r = find(i);
      if (!comps.has(r)) comps.set(r, []);
      comps.get(r)!.push(l);
    });
    steps.push({ edge: key, w: e.w, accepted, components: [...comps.values()] });
  }
  return { steps, tree, total, sorted: sorted.map((x) => ({ edge: x.key, w: x.e.w })) };
}

export interface PrimRow {
  inTree: string[];
  /** label → [dist, pred] for vertices not yet in the tree (Infinity if unreachable) */
  cells: Record<string, [number, string | null]>;
  chosen: string;
  edge: string | null;
}

/** Prim from a start vertex, with the course table "Ensemble S | (poids ; prédécesseur)". Ties: smallest label order. */
export function prim(gg: Graph | string, startLabel?: string) {
  const g = G(gg);
  const n = g.labels.length;
  const start = startLabel ? g.labels.indexOf(startLabel) : 0;
  const dist = g.labels.map(() => Infinity);
  const pred: (number | null)[] = g.labels.map(() => null);
  const inT = g.labels.map(() => false);
  dist[start] = 0;
  const rows: PrimRow[] = [];
  const tree: string[] = [];
  let total = 0;
  for (let it = 0; it < n; it++) {
    let best = -1;
    for (let i = 0; i < n; i++) if (!inT[i] && (best < 0 || dist[i] < dist[best])) best = i;
    if (best < 0 || dist[best] === Infinity) break;
    const cells: PrimRow['cells'] = {};
    for (let i = 0; i < n; i++) if (!inT[i]) cells[g.labels[i]] = [dist[i], pred[i] === null ? null : g.labels[pred[i]!]];
    const edge = pred[best] === null ? null : edgeKey(g, { u: pred[best]!, v: best, w: 0 });
    rows.push({ inTree: g.labels.filter((_, i) => inT[i]), cells, chosen: g.labels[best], edge });
    inT[best] = true;
    if (edge) {
      tree.push(edge);
      total += dist[best];
    }
    for (const e of g.edges) {
      for (const [a, b] of [[e.u, e.v], [e.v, e.u]]) {
        if (a === best && !inT[b] && e.w < dist[b]) {
          dist[b] = e.w;
          pred[b] = best;
        }
      }
    }
  }
  return { rows, tree, total };
}

export const mstWeight = (g: Graph | string) => kruskal(g).total;

// ---------- shortest paths ----------
export interface DijkstraRow {
  fixed: string;
  cells: Record<string, [number, string | null]>;
}

/** Dijkstra (non-negative weights). Rows = state after fixing each vertex (exam iteration table). */
export function dijkstra(gg: Graph | string, srcLabel: string) {
  const g = G(gg);
  const n = g.labels.length;
  const src = g.labels.indexOf(srcLabel);
  const dist = g.labels.map(() => Infinity);
  const pred: (number | null)[] = g.labels.map(() => null);
  const done = g.labels.map(() => false);
  dist[src] = 0;
  const rows: DijkstraRow[] = [];
  const initial: DijkstraRow['cells'] = Object.fromEntries(g.labels.map((l, i) => [l, [dist[i], null]]));
  for (let it = 0; it < n; it++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
    if (u < 0) break;
    done[u] = true;
    for (const e of g.edges) {
      for (const [a, b] of g.directed ? [[e.u, e.v]] : [[e.u, e.v], [e.v, e.u]]) {
        if (a === u && !done[b] && dist[u] + e.w < dist[b]) {
          dist[b] = dist[u] + e.w;
          pred[b] = u;
        }
      }
    }
    rows.push({ fixed: g.labels[u], cells: Object.fromEntries(g.labels.map((l, i) => [l, [dist[i], pred[i] === null ? null : g.labels[pred[i]!]]])) });
  }
  const path = (target: string): string[] => {
    let t = g.labels.indexOf(target);
    if (dist[t] === Infinity) return [];
    const p = [t];
    while (pred[t] !== null) p.push((t = pred[t]!));
    return p.reverse().map((i) => g.labels[i]);
  };
  return { initial, rows, dist: Object.fromEntries(g.labels.map((l, i) => [l, dist[i]])) as Record<string, number>, pred, path };
}

export const shortestDistance = (g: Graph | string, a: string, b: string) => dijkstra(g, a).dist[b];

// ---------- colouring / bipartite ----------
/** Welsh–Powell greedy colouring: vertices by decreasing degree, smallest available colour. */
export function welshPowell(gg: Graph | string) {
  const g = G(gg);
  const deg = degrees(g);
  const ord = g.labels.map((_, i) => i).sort((a, b) => deg[b] - deg[a] || a - b);
  const col = g.labels.map(() => -1);
  for (const v of ord) {
    const used = new Set(neighbours(g, v).map((x) => col[x]));
    let c = 0;
    while (used.has(c)) c++;
    col[v] = c;
  }
  return { order: ord.map((i) => g.labels[i]), colors: col, count: Math.max(-1, ...col) + 1 };
}

/** Exact chromatic number (backtracking, small graphs). */
export function chromaticNumber(gg: Graph | string): number {
  const g = G(gg);
  const n = g.labels.length;
  if (!n) return 0;
  const adj = g.labels.map((_, i) => neighbours(g, i));
  if (adj.some((a, i) => a.includes(i))) return Infinity;
  for (let k = 1; k <= n; k++) {
    const col = Array(n).fill(-1);
    const rec = (v: number): boolean => {
      if (v === n) return true;
      for (let c = 0; c < k; c++) {
        if (adj[v].some((u) => col[u] === c)) continue;
        col[v] = c;
        if (rec(v + 1)) return true;
      }
      col[v] = -1;
      return false;
    };
    if (rec(0)) return k;
  }
  return n;
}

export function isProperColoring(gg: Graph | string, colors: number[]): boolean {
  const g = G(gg);
  return g.edges.every((e) => e.u === e.v || (colors[e.u] >= 0 && colors[e.u] !== colors[e.v]));
}

/** BFS 2-colouring; returns the two sides or an odd cycle proving the graph is not bipartite. */
export function bipartite(gg: Graph | string): { ok: true; sides: [string[], string[]]; colors: number[] } | { ok: false; oddCycle: string[]; colors: number[] } {
  const g = G(gg);
  const n = g.labels.length;
  const col = Array(n).fill(-1);
  const par = Array(n).fill(-1);
  for (let s = 0; s < n; s++) {
    if (col[s] >= 0) continue;
    col[s] = 0;
    const q = [s];
    while (q.length) {
      const u = q.shift()!;
      for (const v of neighbours(g, u)) {
        if (col[v] < 0) {
          col[v] = 1 - col[u];
          par[v] = u;
          q.push(v);
        } else if (col[v] === col[u]) {
          // odd cycle: paths u→root and v→root up to their LCA
          const anc = (x: number) => {
            const p = [x];
            while (par[x] >= 0) p.push((x = par[x]));
            return p;
          };
          const pu = anc(u);
          const pv = anc(v);
          const lca = pu.find((x) => pv.includes(x))!;
          const cyc = [...pu.slice(0, pu.indexOf(lca) + 1), ...pv.slice(0, pv.indexOf(lca)).reverse()];
          return { ok: false, oddCycle: [...cyc, u].map((i) => g.labels[i]), colors: col };
        }
      }
    }
  }
  return { ok: true, sides: [g.labels.filter((_, i) => col[i] === 0), g.labels.filter((_, i) => col[i] === 1)], colors: col };
}

// ---------- random graphs (exercise generator) ----------
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0;
    return s / 4294967296;
  };
}

/** Connected weighted graph with n vertices (labels A, B, …), extra edges according to density. */
export function randomGraph(n: number, seed: number, density = 0.45, wmin = 1, wmax = 12): Graph {
  const r = rng(seed);
  const labels = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  const edges: Edge[] = [];
  const has = (a: number, b: number) => edges.some((e) => (e.u === a && e.v === b) || (e.u === b && e.v === a));
  const w = () => wmin + Math.floor(r() * (wmax - wmin + 1));
  for (let i = 1; i < n; i++) edges.push({ u: Math.floor(r() * i), v: i, w: w() });
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (!has(i, j) && r() < density) edges.push({ u: i, v: j, w: w() });
  edges.sort((a, b) => a.u - b.u || a.v - b.v);
  return { labels, directed: false, edges };
}

/** Named functions for content files (`compute: { fn, args, pick }`). */
export const GRAPH_COMPUTE: Record<string, (...a: (number | string | number[] | boolean)[]) => number | number[] | object> = {
  gOrder: (g) => order(g as string),
  gSize: (g) => size(g as string),
  gDegree: (g, v) => degreeOf(g as string, v as string),
  gDegreeSum: (g) => degrees(g as string).reduce((a, b) => a + b, 0),
  gOddCount: (g) => oddVertices(g as string).length,
  gMissing: (g) => missingForComplete(g as string),
  gMst: (g) => mstWeight(g as string),
  gPrim: (g, s) => prim(g as string, s as string).total,
  gDist: (g, a, b) => shortestDistance(g as string, a as string, b as string),
  gPaths: (g, k, a, b) => {
    const gr = parseGraph(g as string);
    return matPow(adjacency(gr), k as number)[gr.labels.indexOf(a as string)][gr.labels.indexOf(b as string)];
  },
  gTracePow: (g, k) => trace(matPow(adjacency(g as string), k as number)),
  gChromatic: (g) => chromaticNumber(g as string),
  gWelsh: (g) => welshPowell(g as string).count,
  gConnected: (g) => (isConnected(g as string) ? 1 : 0),
  gEuler: (g) => ({ cycle: 2, chain: 1, none: 0 })[eulerType(g as string)],
  completeEdges: (n) => completeEdges(n as number),
  cayley: (n) => cayley(n as number),
  sumList: (xs) => (xs as number[]).reduce((a, b) => a + b, 0)
};
