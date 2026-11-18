/** Helpers for the oral coach: tokenising, Levenshtein word scoring, progressive masking, pace. */

export const norm = (w: string) =>
  w
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'%/-]/g, '');

export const words = (s: string) => s.split(/\s+/).map(norm).filter(Boolean);

export function lev(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** For each expected word: was it said (fuzzy, within the spoken sequence)? Returns flags + score /100. */
export function scoreSpeech(expected: string, spoken: string): { ok: boolean[]; score: number } {
  const exp = words(expected);
  const sp = words(spoken);
  const ok = exp.map((w) => sp.some((s) => s === w || (w.length > 3 && lev(s, w) <= Math.floor(w.length / 4))));
  return { ok, score: exp.length ? Math.round((100 * ok.filter(Boolean).length) / exp.length) : 0 };
}

const SMALL = new Set('a an the to of and or so in on it is was at for you your we they that this with just be by its it’s'.split(' '));

/** Level 0 = nothing hidden; each level hides 25% more words, small words first. Level 4 = only keywords kept. */
export function maskWords(sentence: string, level: number, keywords: string[] = []): string {
  if (level <= 0) return sentence;
  const toks = sentence.split(/\s+/);
  const kw = new Set(keywords.map(norm));
  if (level >= 4) return toks.map((t) => (kw.has(norm(t)) || /\d/.test(t) ? t : '___')).join(' ');
  const order = toks
    .map((t, i) => ({ i, small: SMALL.has(norm(t)) ? 0 : 1, len: t.length }))
    .sort((a, b) => a.small - b.small || a.len - b.len || a.i - b.i);
  const n = Math.round(toks.length * 0.25 * level);
  const hide = new Set(order.slice(0, n).map((o) => o.i));
  return toks.map((t, i) => (hide.has(i) ? '_'.repeat(Math.min(6, t.length)) : t)).join(' ');
}

export const wpm = (wordCount: number, ms: number) => (ms > 0 ? Math.round(wordCount / (ms / 60000)) : 0);

export const FILLERS = ['euh', 'uh', 'um', 'erm', 'like'];
export const countFillers = (s: string) => words(s).filter((w) => FILLERS.includes(w)).length;
