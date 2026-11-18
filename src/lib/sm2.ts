/** Simplified SM-2 spaced repetition (Again / Hard / Good / Easy). */
export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  ease: number; // ease factor, >= 1.3
  interval: number; // days
  reps: number; // successful reviews in a row
  due: number; // timestamp ms
  lapses: number;
}

export const DAY = 24 * 3600 * 1000;
export const MIN = 60 * 1000;

export function newCard(now = Date.now()): CardState {
  return { ease: 2.5, interval: 0, reps: 0, due: now, lapses: 0 };
}

export function review(card: CardState, grade: Grade, now = Date.now()): CardState {
  const c = { ...card };
  if (grade === 'again') {
    c.reps = 0;
    c.lapses++;
    c.interval = 0;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.due = now + 1 * MIN;
    return c;
  }
  if (grade === 'hard') {
    c.ease = Math.max(1.3, c.ease - 0.15);
    c.interval = c.reps === 0 ? 0.25 : Math.max(0.5, c.interval * 1.2);
  } else if (grade === 'good') {
    c.interval = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease * 10) / 10;
  } else {
    c.ease += 0.15;
    c.interval = c.reps === 0 ? 4 : Math.round(c.interval * c.ease * 1.3 * 10) / 10;
  }
  c.reps++;
  c.due = now + c.interval * DAY;
  return c;
}

/** Cards to review now: due cards first (oldest due first), then new cards. */
export function dueQueue<T extends { id: string }>(cards: T[], states: Record<string, CardState | undefined>, now = Date.now()): T[] {
  const due = cards.filter((c) => states[c.id] && states[c.id]!.due <= now).sort((a, b) => states[a.id]!.due - states[b.id]!.due);
  const fresh = cards.filter((c) => !states[c.id]);
  return [...due, ...fresh];
}
