import { describe, it, expect } from 'vitest';
import { createPlan, replan, markDone, buildGoals, HOUR, MIN, type ChapterInfo } from './planner';

const chapters: ChapterInfo[] = [
  { module: 'linux', chapter: 'users', weight: 6, parts: 5, hasMission: true, hasExercise: true },
  { module: 'linux', chapter: 'systemd', weight: 4, parts: 4, hasMission: true, hasExercise: true },
  { module: 'linux', chapter: 'intro', weight: 1, parts: 3, hasMission: false, hasExercise: true }
];
const at = (h: number, m = 0) => {
  const d = new Date(2026, 10, 18, h, m, 0, 0);
  return d.getTime();
};

describe('Rev24 planner', () => {
  it('24h plan has protected sleep, meals, pomodoros, checkpoints, final exam and review-only last 2h', () => {
    const now = at(9);
    const exam = now + 24 * HOUR;
    const p = createPlan(['linux'], exam, chapters, { 'linux/users': 0.2, 'linux/systemd': 0.5, 'linux/intro': 0.9 }, now);
    const sleep = p.blocks.filter((b) => b.kind === 'sleep');
    expect(sleep).toHaveLength(1);
    expect(sleep[0].end - sleep[0].start).toBeGreaterThanOrEqual(6 * HOUR);
    expect(sleep[0].end - sleep[0].start).toBeLessThanOrEqual(7 * HOUR);
    expect(p.blocks.some((b) => b.kind === 'meal')).toBe(true);
    const study = p.blocks.filter((b) => b.kind === 'study');
    expect(study.length).toBeGreaterThan(15);
    study.forEach((b) => expect(b.end - b.start).toBe(25 * MIN));
    expect(p.blocks.filter((b) => b.kind === 'checkpoint').length).toBeGreaterThanOrEqual(2);
    expect(p.blocks.filter((b) => b.kind === 'longBreak').length).toBeGreaterThan(0);
    expect(p.blocks.some((b) => b.kind === 'final')).toBe(true);
    const lastTwo = p.blocks.filter((b) => b.start >= exam - 2 * HOUR);
    expect(lastTwo.length).toBeGreaterThan(0);
    lastTwo.forEach((b) => expect(b.kind).toBe('review'));
    // no overlaps
    const sorted = [...p.blocks].sort((a, b) => a.start - b.start);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].start).toBeGreaterThanOrEqual(sorted[i - 1].end);
    // weak & heavy chapter gets most sessions
    const users = study.filter((b) => b.goal!.chapter === 'users').length;
    const intro = study.filter((b) => b.goal!.chapter === 'intro').length;
    expect(users).toBeGreaterThan(intro);
  });
  it('short plan (exam in 5h): no sleep', () => {
    const now = at(10);
    const p = createPlan(['linux'], now + 5 * HOUR, chapters, {}, now);
    expect(p.blocks.some((b) => b.kind === 'sleep')).toBe(false);
    expect(p.blocks.filter((b) => b.kind === 'study').length).toBeGreaterThan(3);
  });
  it('marking a block done and asking for more time recompute the plan', () => {
    const now = at(9);
    const p = createPlan(['linux'], now + 24 * HOUR, chapters, {}, now);
    const first = p.blocks.find((b) => b.kind === 'study')!;
    const p2 = markDone(p, first.id, undefined, now + 10 * MIN);
    expect(p2.blocks.find((b) => b.id === first.id)!.done).toBe(true);
    const next = p2.blocks.find((b) => !b.done && b.kind !== 'meal' && b.kind !== 'sleep')!;
    expect(next.start).toBeGreaterThanOrEqual(now + 10 * MIN);
    const p3 = replan(p, now + 20 * MIN, { extraMinutes: 15 });
    const cur = p3.blocks.find((b) => b.start <= now + 20 * MIN && b.end > now + 20 * MIN)!;
    expect(cur.end).toBe(now + 40 * MIN);
    expect(p3.blocks.filter((b) => b.kind === 'sleep')).toHaveLength(1);
  });
  it('checkpoint errors inject goals first', () => {
    const now = at(9);
    const p = createPlan(['linux'], now + 24 * HOUR, chapters, {}, now);
    const p2 = replan(p, now + 5 * MIN, { inject: [{ module: 'linux', chapter: 'intro', part: 0, qcm: 8, extra: null }] });
    const firstStudy = p2.blocks.find((b) => b.kind === 'study' && b.start >= now + 5 * MIN)!;
    expect(firstStudy.goal!.chapter).toBe('intro');
  });
  it('buildGoals never repeats a chapter twice in a row when avoidable', () => {
    const g = buildGoals(chapters, {}, 12);
    for (let i = 1; i < g.length; i++) if (g[i].chapter === g[i - 1].chapter) expect(new Set(g.slice(i).map((x) => x.chapter)).size).toBe(1);
  });
});
