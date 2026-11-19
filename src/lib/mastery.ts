import type { ModuleContent } from './content';
import type { QStat } from './quiz';

interface Progress {
  qstats: Record<string, QStat>;
  exercises: Record<string, 'ok' | 'ko'>;
  read: Record<string, boolean>;
  missions: Record<string, boolean>;
}

/** Mastery 0–100 of a chapter: 20 % reading, 60 % questions (last answer right), 20 % exercises/missions. */
export function chapterMastery(c: ModuleContent, chapterId: string, p: Progress): number {
  const qs = c.questions.filter((q) => q.chapter === chapterId);
  const ex = c.exercises.filter((e) => e.chapter === chapterId);
  const ms = c.missions.filter((m) => m.chapter === chapterId);
  const read = p.read[`${c.module.id}/${chapterId}`] ? 1 : 0;
  const qScore = qs.length ? qs.reduce((a, q) => a + (p.qstats[q.id] ? (p.qstats[q.id].streak > 0 ? 1 : 0.25) : 0), 0) / qs.length : 0;
  const practice = ex.length + ms.length;
  const pScore = practice ? (ex.filter((e) => p.exercises[e.id] === 'ok').length + ms.filter((m) => p.missions[m.id]).length) / practice : qScore;
  return Math.round(100 * (0.2 * read + 0.6 * Math.min(1, qScore * 1.15) + 0.2 * pScore));
}

export function moduleMastery(c: ModuleContent, p: Progress): number {
  const w = c.module.weights;
  let tot = 0;
  let acc = 0;
  for (const ch of c.chapters) {
    const wi = w[ch.id] ?? 1;
    tot += wi;
    acc += wi * chapterMastery(c, ch.id, p);
  }
  return tot ? Math.round(acc / tot) : 0;
}

/** Chapters/tags with the most mistakes. */
export function weakSpots(c: ModuleContent, p: Progress) {
  const perTag = new Map<string, { wrong: number; seen: number }>();
  for (const q of c.questions) {
    const s = p.qstats[q.id];
    if (!s) continue;
    for (const t of q.tags) {
      const e = perTag.get(t) ?? { wrong: 0, seen: 0 };
      e.wrong += s.inMistakes ? 1 : 0;
      e.seen += 1;
      perTag.set(t, e);
    }
  }
  return [...perTag.entries()]
    .filter(([, v]) => v.wrong > 0)
    .sort((a, b) => b[1].wrong / b[1].seen - a[1].wrong / a[1].seen || b[1].wrong - a[1].wrong)
    .slice(0, 6)
    .map(([tag, v]) => ({ tag, ...v }));
}

export interface BadgeInput extends Progress {
  questionsById: Record<string, { tags: string[] }>;
  exams: { note: number }[];
  streak: number;
  rootReset: boolean;
}

export function earnedBadges(b: BadgeInput): string[] {
  const out: string[] = [];
  const right = (tag: string) => Object.entries(b.qstats).filter(([id, s]) => s.correct > 0 && b.questionsById[id]?.tags.includes(tag)).length;
  if (right('chmod') + right('droits') >= 10) out.push('chmod');
  if (b.rootReset) out.push('root');
  if (right('tests') >= 10) out.push('h0');
  if (Object.values(b.missions).filter(Boolean).length >= 5) out.push('terminal');
  if (b.exams.some((e) => e.note >= 16)) out.push('exam');
  if (b.streak >= 3) out.push('streak');
  return out;
}
