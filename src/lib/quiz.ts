import type { Question } from './schema';

/** Split a shell command line into tokens, honouring single/double quotes. */
export function tokenize(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: '"' | "'" | null = null;
  let has = false;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (has || cur) out.push(cur);
      cur = '';
      has = false;
      continue;
    }
    cur += ch;
    has = true;
  }
  if (has || cur) out.push(cur);
  return out;
}

/** Short options that take an argument, per command. Used to make `-aG x` ≡ `-a -G x` ≡ `-G x -a`. */
export const ARG_OPTS: Record<string, string> = {
  useradd: 'uUgGdsceKkbfp',
  usermod: 'uGgdsceldfp',
  userdel: '',
  groupadd: 'gKp',
  groupmod: 'gnp',
  gpasswd: 'adMA',
  passwd: 'nxwi',
  chage: 'dEImMW',
  cut: 'dfcb',
  find: '',
  grep: 'efmABC',
  head: 'nc',
  tail: 'nc',
  sort: 'tk',
  journalctl: 'upnobt',
  systemctl: 't',
  chmod: '',
  chown: '',
  rpm: '',
  dnf: '',
  ssh: 'pil',
  tee: '',
  mount: 'ot',
  ls: '',
  rm: '',
  mkdir: 'm',
  cp: '',
  su: 'c',
  sudo: 'u',
  id: '',
  du: '',
  'grub2-mkconfig': 'o'
};

/**
 * Canonical form of a command, so that equivalent spellings compare equal:
 * - whitespace and quotes normalised;
 * - combined short flags are split (`-aG` → `-a`, `-G`);
 * - flags (with their arguments) are sorted; positional arguments keep their order.
 */
export function canonicalCommand(line: string): string {
  // split pipelines / command lists outside quotes, canonicalise each part
  const parts: string[] = [];
  const seps: string[] = [];
  let cur = '';
  let q: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === q) q = null;
      cur += c;
    } else if (c === '"' || c === "'") {
      q = c;
      cur += c;
    } else if ((c === '|' && line[i + 1] !== '|') || c === ';' || (c === '&' && line[i + 1] === '&')) {
      parts.push(cur);
      seps.push(c === '&' ? '&&' : c);
      if (c === '&') i++;
      cur = '';
    } else cur += c;
  }
  parts.push(cur);
  if (parts.length > 1) {
    const canon = parts.map((p) => canonicalSimple(p)).filter((p, i) => p || i < parts.length - 1);
    return canon.map((p, i) => (i ? ` ${seps[i - 1]} ` : '') + p).join('');
  }
  return canonicalSimple(line);
}

function canonicalSimple(line: string): string {
  let toks = tokenize(line.trim().replace(/;+\s*$/, ''));
  if (toks[0] === 'sudo' && toks.length > 1 && !toks[1].startsWith('-')) toks = toks.slice(1);
  if (toks.length === 0) return '';
  const cmd = toks[0];
  const argOpts = ARG_OPTS[cmd];
  if (argOpts === undefined || cmd === 'find' || cmd === 'chmod') {
    // unknown command / order-sensitive syntax: just normalise spacing & quotes
    return toks.join(' ');
  }
  const flags: string[] = [];
  const pos: string[] = [];
  for (let i = 1; i < toks.length; i++) {
    const t = toks[i];
    if (t.startsWith('--') && t.length > 2) {
      const eq = t.indexOf('=');
      if (eq > 0) flags.push(`${t.slice(0, eq)}=${t.slice(eq + 1)}`);
      else flags.push(t);
      continue;
    }
    if (t.startsWith('-') && t.length > 1 && !/^-\d/.test(t)) {
      const letters = t.slice(1);
      for (let j = 0; j < letters.length; j++) {
        const l = letters[j];
        if (argOpts.includes(l)) {
          const rest = letters.slice(j + 1);
          if (rest) flags.push(`-${l}=${rest}`);
          else flags.push(`-${l}=${toks[++i] ?? ''}`);
          break;
        }
        flags.push(`-${l}`);
      }
      continue;
    }
    pos.push(t);
  }
  flags.sort();
  return [cmd, ...flags, ...pos].join(' ');
}

export function commandMatches(input: string, accepted: string[]): boolean {
  const c = canonicalCommand(input);
  if (!c) return false;
  return accepted.some((a) => canonicalCommand(a) === c);
}

export function parseNumber(s: string): number {
  return Number(s.trim().replace(/\s/g, '').replace(',', '.'));
}

export type Response = string | string[] | number;

export function checkAnswer(q: Question, response: Response): boolean {
  switch (q.kind) {
    case 'single':
      return response === q.answer;
    case 'multi': {
      const a = [...(q.answer as string[])].sort();
      const r = [...(response as string[])].sort();
      return a.length === r.length && a.every((x, i) => x === r[i]);
    }
    case 'order': {
      const a = q.answer as string[];
      const r = response as string[];
      return a.length === r.length && a.every((x, i) => x === r[i]);
    }
    case 'command':
      return commandMatches(String(response), q.answer as string[]);
    case 'numeric': {
      const v = typeof response === 'number' ? response : parseNumber(String(response));
      if (Number.isNaN(v)) return false;
      return Math.abs(v - (q.answer as number)) <= (q.tolerance ?? 0.01) + 1e-9;
    }
  }
}

/** Fisher–Yates shuffle with optional seeded RNG. */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

// ---------- "Mes erreurs" ----------

export interface QStat {
  seen: number;
  correct: number;
  wrong: number;
  streak: number;
  inMistakes: boolean;
  last: number;
}

export const MISTAKE_EXIT_STREAK = 3;

export function updateQStat(prev: QStat | undefined, ok: boolean, now = Date.now()): QStat {
  const s: QStat = prev ? { ...prev } : { seen: 0, correct: 0, wrong: 0, streak: 0, inMistakes: false, last: 0 };
  s.seen++;
  s.last = now;
  if (ok) {
    s.correct++;
    s.streak++;
    if (s.inMistakes && s.streak >= MISTAKE_EXIT_STREAK) s.inMistakes = false;
  } else {
    s.wrong++;
    s.streak = 0;
    s.inMistakes = true;
  }
  return s;
}

// ---------- Mock exam ----------

/** Draw `count` questions, spread across chapters proportionally to their weights. */
export function pickWeighted(questions: Question[], weights: Record<string, number>, count: number, rng: () => number = Math.random): Question[] {
  const byChap = new Map<string, Question[]>();
  for (const q of questions) {
    if (!byChap.has(q.chapter)) byChap.set(q.chapter, []);
    byChap.get(q.chapter)!.push(q);
  }
  const chaps = [...byChap.keys()];
  const totalW = chaps.reduce((a, c) => a + (weights[c] ?? 1), 0);
  const quota = new Map<string, number>();
  let assigned = 0;
  const fracs: [string, number][] = [];
  for (const c of chaps) {
    const exact = (count * (weights[c] ?? 1)) / totalW;
    const n = Math.min(Math.floor(exact), byChap.get(c)!.length);
    quota.set(c, n);
    assigned += n;
    fracs.push([c, exact - Math.floor(exact)]);
  }
  fracs.sort((a, b) => b[1] - a[1]);
  let k = 0;
  while (assigned < count && k < 10 * chaps.length) {
    const c = fracs[k % fracs.length][0];
    if (quota.get(c)! < byChap.get(c)!.length) {
      quota.set(c, quota.get(c)! + 1);
      assigned++;
    }
    k++;
  }
  const out: Question[] = [];
  for (const c of chaps) out.push(...shuffle(byChap.get(c)!, rng).slice(0, quota.get(c)));
  return shuffle(out, rng);
}

/** Note /20 with per-chapter breakdown. */
export function gradeExam(questions: Question[], responses: Record<string, Response | undefined>) {
  const perChapter: Record<string, { ok: number; total: number }> = {};
  let ok = 0;
  for (const q of questions) {
    const r = responses[q.id];
    const good = r !== undefined && checkAnswer(q, r);
    if (good) ok++;
    perChapter[q.chapter] ??= { ok: 0, total: 0 };
    perChapter[q.chapter].total++;
    if (good) perChapter[q.chapter].ok++;
  }
  const note = questions.length ? Math.round((ok / questions.length) * 20 * 4) / 4 : 0;
  const toReview = Object.entries(perChapter)
    .filter(([, v]) => v.ok / v.total < 0.6)
    .map(([c]) => c);
  return { ok, total: questions.length, note, perChapter, toReview };
}

export function xpFor(q: Pick<Question, 'difficulty'>): number {
  return q.difficulty === 3 ? 25 : q.difficulty === 2 ? 15 : 10;
}
