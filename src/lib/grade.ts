/**
 * Automatic marking of a written answer, the way a teacher uses a marking scheme:
 * each rubric item is an expected element (a command, a file, a key word); full credit when it is in the answer,
 * half credit when most of its words are there (close but not exact), nothing otherwise.
 * Exercises without an explicit rubric get one built from their solution (commands, files, bold key words).
 */
import type { Exercise, Lang } from './schema';

export interface RubricItem {
  label: string;
  /** alternatives; inside one alternative, " && " separates fragments that must all appear */
  any: string[];
  w: number;
}
export type ItemResult = { label: string; status: 'ok' | 'part' | 'miss' };

/** lower case, no accents, unified quotes and spaces: "Système  /ETC" → "systeme /etc" */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[«»“”"']/g, '"')
    .replace(/[‐-–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const words = (s: string) => normalize(s).split(/[^a-z0-9/._=+-]+/).filter((w) => w.length > 1);

/** 1 = present, 0.5 = most of its words are present, 0 = absent */
function fragmentScore(answer: string, answerWords: Set<string>, fragment: string): number {
  const f = normalize(fragment);
  if (!f) return 1;
  if (answer.includes(f)) return 1;
  const ws = words(f);
  if (!ws.length) return 0;
  const found = ws.filter((w) => answerWords.has(w)).length / ws.length;
  return found >= 0.6 ? 0.5 : 0;
}

export function grade(answerRaw: string, rubric: RubricItem[]): { ratio: number; items: ItemResult[] } {
  const answer = normalize(answerRaw);
  const answerWords = new Set(words(answerRaw));
  let got = 0;
  let total = 0;
  const items: ItemResult[] = rubric.map((it) => {
    total += it.w;
    // best alternative; an alternative is the minimum over its required fragments
    const s = Math.max(...it.any.map((alt) => Math.min(...alt.split(' && ').map((f) => fragmentScore(answer, answerWords, f)))));
    got += s * it.w;
    return { label: it.label, status: s >= 1 ? 'ok' : s > 0 ? 'part' : 'miss' };
  });
  return { ratio: total ? got / total : 0, items };
}

/** Rubric written in the exercise, or one derived from its solution. */
export function rubricOf(ex: Exercise, lang: Lang): RubricItem[] {
  if (ex.rubric?.length) return ex.rubric.map((r) => ({ label: r.label[lang] || r.label.fr, any: r.any, w: r.w ?? 1 }));
  const items: RubricItem[] = [];
  const seen = new Set<string>();
  const add = (label: string, frag: string) => {
    const k = normalize(frag);
    if (k.length < 2 || seen.has(k)) return;
    seen.add(k);
    items.push({ label, any: [frag], w: 1 });
  };
  // commands of the solution (comments removed)
  for (const s of ex.solutionSteps)
    for (const line of (s.code ?? '').split('\n')) {
      const cmd = line.replace(/#.*$/, '').trim();
      if (cmd && cmd.length <= 90) add(cmd, cmd);
    }
  // bold key elements and inline code of the expected answer
  const text = [ex.finalAnswer.fr, ...ex.solutionSteps.map((s) => s.body.fr)].join('\n');
  for (const m of text.matchAll(/\*\*([^*]{2,60})\*\*|`([^`]{2,60})`/g)) add(m[1] ?? m[2], m[1] ?? m[2]);
  return items.slice(0, 14);
}

/** Points out of `max`, rounded to the quarter like a teacher's mark. */
export const pointsOf = (ratio: number, max: number) => Math.round(ratio * max * 4) / 4;
