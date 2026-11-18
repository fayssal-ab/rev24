/** In-memory virtual filesystem with owners, groups and permission bits. Plain JSON objects → easy snapshot. */

export interface FNode {
  t: 'f' | 'd' | 'l';
  uid: number;
  gid: number;
  mode: number; // permission bits, e.g. 0o755
  mtime: number;
  data?: string; // file content
  kids?: Record<string, FNode>; // directory entries
  target?: string; // symlink target
  sz?: number; // simulated size (big log files, binaries)
}

export const now = () => Date.now();

export function dir(uid = 0, gid = 0, mode = 0o755, kids: Record<string, FNode> = {}): FNode {
  return { t: 'd', uid, gid, mode, mtime: now(), kids };
}
export function file(data = '', uid = 0, gid = 0, mode = 0o644): FNode {
  return { t: 'f', uid, gid, mode, mtime: now(), data };
}
export function link(target: string): FNode {
  return { t: 'l', uid: 0, gid: 0, mode: 0o777, mtime: now(), target };
}

/** Normalise a path relative to cwd; handles ., .., //, ~ (already expanded by shell). */
export function normPath(p: string, cwd: string): string {
  const abs = p.startsWith('/') ? p : `${cwd}/${p}`;
  const parts: string[] = [];
  for (const seg of abs.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return '/' + parts.join('/');
}

export function dirname(p: string): string {
  const i = p.lastIndexOf('/');
  return i <= 0 ? '/' : p.slice(0, i);
}
export function basename(p: string): string {
  if (p === '/') return '/';
  return p.slice(p.lastIndexOf('/') + 1);
}

/** Lookup without permission checks. Follows symlinks except optionally the last component. */
export function lookup(root: FNode, abs: string, followLast = true, depth = 0): FNode | null {
  if (depth > 20) return null;
  if (abs === '/') return root;
  const parts = abs.split('/').filter(Boolean);
  let cur: FNode = root;
  let curPath = '';
  for (let i = 0; i < parts.length; i++) {
    if (cur.t !== 'd' || !cur.kids) return null;
    const next: FNode | undefined = cur.kids[parts[i]];
    if (!next) return null;
    const isLast = i === parts.length - 1;
    if (next.t === 'l' && (!isLast || followLast)) {
      const tgt = normPath(next.target!, curPath || '/');
      const resolved = lookup(root, tgt, true, depth + 1);
      if (!resolved) return null;
      cur = resolved;
      curPath = tgt;
    } else {
      cur = next;
      curPath = `${curPath}/${parts[i]}`;
    }
  }
  return cur;
}

export interface Who {
  uid: number;
  gids: number[]; // primary + supplementary
}

export function can(node: FNode, who: Who, bit: 'r' | 'w' | 'x'): boolean {
  const m = bit === 'r' ? 4 : bit === 'w' ? 2 : 1;
  if (who.uid === 0) {
    if (bit !== 'x' || node.t === 'd') return true;
    return (node.mode & 0o111) !== 0;
  }
  if (node.uid === who.uid) return ((node.mode >> 6) & m) !== 0;
  if (who.gids.includes(node.gid)) return ((node.mode >> 3) & m) !== 0;
  return (node.mode & m) !== 0;
}

/** Check that every directory on the path is traversable (x). Returns the first denied path or null. */
export function traverseDenied(root: FNode, abs: string, who: Who): string | null {
  const parts = abs.split('/').filter(Boolean);
  let cur = root;
  let p = '';
  for (let i = 0; i < parts.length - 1; i++) {
    if (!can(cur, who, 'x')) return p || '/';
    const n = cur.kids?.[parts[i]];
    if (!n) return null;
    p += '/' + parts[i];
    cur = n.t === 'l' ? lookup(root, p) ?? n : n;
    if (cur.t !== 'd') return null;
  }
  if (parts.length > 0 && !can(cur, who, 'x')) return p || '/';
  return null;
}

export function modeString(n: FNode): string {
  const type = n.t === 'd' ? 'd' : n.t === 'l' ? 'l' : '-';
  let s = '';
  const bits = 'rwxrwxrwx';
  for (let i = 0; i < 9; i++) s += n.mode & (1 << (8 - i)) ? bits[i] : '-';
  if (n.mode & 0o1000) s = s.slice(0, 8) + (s[8] === 'x' ? 't' : 'T');
  if (n.mode & 0o4000) s = s.slice(0, 2) + (s[2] === 'x' ? 's' : 'S') + s.slice(3);
  if (n.mode & 0o2000) s = s.slice(0, 5) + (s[5] === 'x' ? 's' : 'S') + s.slice(6);
  return type + s;
}

export function sizeOf(n: FNode): number {
  if (n.t === 'd') return 4096;
  if (n.t === 'l') return n.target!.length;
  if (n.sz !== undefined) return n.sz;
  return new TextEncoder().encode(n.data ?? '').length;
}

/** Convert a glob to a RegExp. */
export function globRe(g: string): RegExp {
  let re = '^';
  for (const ch of g) {
    if (ch === '*') re += '.*';
    else if (ch === '?') re += '.';
    else re += ch.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(re + '$');
}

/** Walk the tree (depth first), yielding absolute paths. */
export function* walk(root: FNode, start: string, node?: FNode): Generator<[string, FNode]> {
  const n = node ?? lookup(root, start);
  if (!n) return;
  yield [start, n];
  if (n.t === 'd' && n.kids) {
    for (const name of Object.keys(n.kids).sort()) {
      const child = n.kids[name];
      const p = start === '/' ? `/${name}` : `${start}/${name}`;
      if (child.t === 'd') yield* walk(root, p, child);
      else yield [p, child];
    }
  }
}

const MONTHS = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export function lsDate(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${String(d.getDate()).padStart(2, ' ')} ${MONTHS[d.getMonth()].padEnd(5, ' ')} ${hh}:${mm}`;
}
export const MONTHS_FR = MONTHS;
