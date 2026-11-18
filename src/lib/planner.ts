/** Rev24 planner: turns the time before the exam into a Pomodoro plan focused on weak, heavily weighted chapters. */

export const MIN = 60_000;
export const HOUR = 60 * MIN;
export const WORK = 25 * MIN;
export const SHORT = 5 * MIN;
export const LONG = 15 * MIN;
export const SLEEP = 6.5 * HOUR;
export const REVIEW_WINDOW = 2 * HOUR;
export const FINAL_EXAM = 45 * MIN;

export type BlockKind = 'study' | 'break' | 'longBreak' | 'sleep' | 'meal' | 'checkpoint' | 'review' | 'final';

export interface Goal {
  module: string;
  chapter: string;
  part: number; // which part of the chapter course (heading index)
  qcm: number;
  extra: 'mission' | 'exercise' | null;
}

export interface Block {
  id: string;
  kind: BlockKind;
  start: number;
  end: number;
  goal?: Goal;
  done?: boolean;
  fixed?: boolean; // sleep, meals, review, final: never moved by replanning
  score?: { ok: number; total: number };
}

export interface ChapterInfo {
  module: string;
  chapter: string;
  weight: number;
  parts: number; // number of course parts (headings)
  hasMission: boolean;
  hasExercise: boolean;
}

export interface Rev24Plan {
  modules: string[];
  exam: number;
  created: number;
  levels: Record<string, number>; // `${module}/${chapter}` -> 0..1
  blocks: Block[];
  finished?: boolean;
  report?: { note: number; perChapter: Record<string, { ok: number; total: number }>; traps: string[] };
}

let seq = 0;
const bid = () => `b${Date.now().toString(36)}${(seq++).toString(36)}`;

/** Fixed blocks (sleep, meals) placed in [from, to). */
export function fixedBlocks(from: number, to: number, examReviewStart: number): Block[] {
  const out: Block[] = [];
  // sleep: first night (23:30) after `from`, or now if we're already in the night
  const d = new Date(from);
  const night = new Date(d);
  night.setHours(23, 30, 0, 0);
  const h = d.getHours() + d.getMinutes() / 60;
  let sleepStart = night.getTime();
  if (h < 4) sleepStart = from; // already night: sleep now
  if (h >= 23.5) sleepStart = from;
  if (sleepStart < to) {
    let s = sleepStart;
    let e = s + SLEEP;
    // must end before the review window starts (keep at least 1.5 h of study after waking) if possible
    const latestEnd = examReviewStart - 30 * MIN;
    if (e > latestEnd) {
      e = Math.max(s + 6 * HOUR, latestEnd);
      if (e > latestEnd) {
        s = Math.max(from, latestEnd - 6 * HOUR);
        e = s + 6 * HOUR;
      }
    }
    if (e - s >= 6 * HOUR && e <= to) out.push({ id: bid(), kind: 'sleep', start: s, end: e, fixed: true });
  }
  // meals
  for (let day = 0; day < 3; day++) {
    for (const [hh, mm, dur] of [
      [7, 30, 20],
      [12, 30, 45],
      [19, 30, 45]
    ] as const) {
      const m = new Date(from);
      m.setDate(m.getDate() + day);
      m.setHours(hh, mm, 0, 0);
      const s = m.getTime();
      const e = s + dur * MIN;
      if (s < from || e > examReviewStart) continue;
      if (out.some((b) => b.kind === 'sleep' && s < b.end && e > b.start)) continue;
      out.push({ id: bid(), kind: 'meal', start: s, end: e, fixed: true });
    }
  }
  return out.sort((a, b) => a.start - b.start);
}

/** Free intervals of [from, to) not covered by fixed blocks. */
function freeSlots(from: number, to: number, fixed: Block[]): [number, number][] {
  const slots: [number, number][] = [];
  let cur = from;
  for (const b of fixed) {
    if (b.end <= cur || b.start >= to) continue;
    if (b.start > cur) slots.push([cur, Math.min(b.start, to)]);
    cur = Math.max(cur, b.end);
  }
  if (cur < to) slots.push([cur, to]);
  return slots;
}

/** Ordered list of study goals: weak × heavy chapters first, interleaved. */
export function buildGoals(chapters: ChapterInfo[], levels: Record<string, number>, sessions: number): Goal[] {
  if (!chapters.length || sessions <= 0) return [];
  const pr = chapters.map((c) => ({ c, p: c.weight * (1.15 - (levels[`${c.module}/${c.chapter}`] ?? 0)) }));
  const total = pr.reduce((a, x) => a + x.p, 0);
  const quota = pr.map((x) => ({ ...x, n: Math.max(1, Math.round((sessions * x.p) / total)), used: 0 }));
  // weighted round-robin: repeatedly pick the chapter with the largest remaining quota ratio
  const goals: Goal[] = [];
  while (goals.length < sessions && quota.some((q) => q.used < q.n)) {
    const q = quota.filter((x) => x.used < x.n).sort((a, b) => b.p * (1 - a.used / a.n) - a.p * (1 - b.used / b.n))[0];
    const part = q.used % Math.max(1, q.c.parts);
    goals.push({
      module: q.c.module,
      chapter: q.c.chapter,
      part,
      qcm: q.used === 0 ? 6 : 8,
      extra: q.c.hasMission && q.used % 2 === 0 ? 'mission' : q.c.hasExercise ? 'exercise' : null
    });
    q.used++;
  }
  // order: highest priority first but avoid the same chapter twice in a row
  const out: Goal[] = [];
  const rest = [...goals];
  while (rest.length) {
    const prev = out[out.length - 1];
    const i = rest.findIndex((g) => !prev || g.chapter !== prev.chapter || g.module !== prev.module);
    out.push(...rest.splice(i < 0 ? 0 : i, 1));
  }
  return out;
}

/** Lay out pomodoro blocks for `goals` in the free time between `from` and the review window. */
export function layout(from: number, exam: number, goals: Goal[], opts: { firstCheckpointAt?: number; startCount?: number } = {}): Block[] {
  const end = Math.min(exam, from + 24 * HOUR);
  const examInWindow = exam <= from + 24 * HOUR;
  const reviewStart = examInWindow ? Math.max(from, exam - REVIEW_WINDOW) : end;
  const fixed = fixedBlocks(from, end, reviewStart);
  const blocks: Block[] = [...fixed];
  // final mock exam just before the review window (if the exam is in the window and there is time)
  let studyEnd = reviewStart;
  if (examInWindow && reviewStart - from > 2 * HOUR) {
    const fStart = reviewStart - FINAL_EXAM;
    // avoid collision with a fixed block
    const clash = fixed.find((b) => fStart < b.end && reviewStart > b.start);
    const s = clash ? clash.start - FINAL_EXAM : fStart;
    blocks.push({ id: bid(), kind: 'final', start: s, end: s + FINAL_EXAM, fixed: true });
    studyEnd = s;
  }
  if (examInWindow) {
    for (let t = reviewStart; t < exam; t += 30 * MIN) blocks.push({ id: bid(), kind: 'review', start: t, end: Math.min(exam, t + 25 * MIN), fixed: true });
  }
  const slots = freeSlots(from, studyEnd, blocks.filter((b) => b.fixed).sort((a, b) => a.start - b.start));
  let gi = 0;
  let count = opts.startCount ?? 0;
  let nextCheckpoint = opts.firstCheckpointAt ?? from + 4 * HOUR;
  for (const [s0, s1] of slots) {
    let t = s0;
    while (t + WORK <= s1) {
      const isCheckpoint = t >= nextCheckpoint;
      if (isCheckpoint) {
        blocks.push({ id: bid(), kind: 'checkpoint', start: t, end: t + WORK });
        nextCheckpoint = t + 4 * HOUR;
      } else {
        if (gi >= goals.length) break;
        blocks.push({ id: bid(), kind: 'study', start: t, end: t + WORK, goal: goals[gi++] });
      }
      t += WORK;
      count++;
      const brk = count % 4 === 0 ? LONG : SHORT;
      if (t + brk <= s1) {
        blocks.push({ id: bid(), kind: count % 4 === 0 ? 'longBreak' : 'break', start: t, end: t + brk });
        t += brk;
      } else t = s1;
    }
  }
  return blocks.sort((a, b) => a.start - b.start);
}

/** Number of study sessions that fit before the exam (upper bound used to size goals). */
export function capacity(from: number, exam: number): number {
  const probe = layout(from, exam, Array.from({ length: 200 }, () => ({ module: '', chapter: '', part: 0, qcm: 0, extra: null })));
  return probe.filter((b) => b.kind === 'study').length;
}

export function createPlan(modules: string[], exam: number, chapters: ChapterInfo[], levels: Record<string, number>, now = Date.now()): Rev24Plan {
  const n = capacity(now, exam);
  const goals = buildGoals(chapters, levels, n);
  return { modules, exam, created: now, levels, blocks: layout(now, exam, goals) };
}

/**
 * Recompute the plan from `now`: past/done blocks are kept, pending study goals are re-laid out.
 * `extraMinutes` extends the current block ("besoin de plus de temps"); `inject` adds goals first (checkpoint errors).
 */
export function replan(plan: Rev24Plan, now = Date.now(), opts: { extraMinutes?: number; inject?: Goal[] } = {}): Rev24Plan {
  const past = plan.blocks.filter((b) => b.done || b.end <= now);
  const current = plan.blocks.find((b) => !b.done && b.start <= now && b.end > now);
  let from = now;
  const kept = [...past];
  if (current) {
    if (opts.extraMinutes && !current.fixed) {
      kept.push({ ...current, end: Math.max(current.end, now) + opts.extraMinutes * MIN });
      from = Math.max(current.end, now) + opts.extraMinutes * MIN;
    } else if (current.fixed) {
      kept.push(current);
      from = current.end;
    }
  }
  const pendingGoals = plan.blocks.filter((b) => b.kind === 'study' && !b.done && b.start >= now && b !== current).map((b) => b.goal!);
  if (current && current.kind === 'study' && !current.done && !opts.extraMinutes) pendingGoals.unshift(current.goal!);
  const goals = [...(opts.inject ?? []), ...pendingGoals];
  const lastCheckpoint = [...kept].reverse().find((b) => b.kind === 'checkpoint');
  const firstCheckpointAt = lastCheckpoint ? lastCheckpoint.start + 4 * HOUR : plan.created + 4 * HOUR;
  const studyDone = kept.filter((b) => b.kind === 'study' || b.kind === 'checkpoint').length;
  const future = from < plan.exam ? layout(from, plan.exam, goals, { firstCheckpointAt, startCount: studyDone }) : [];
  // fixed blocks already kept should not be duplicated
  const keptIds = new Set(kept.map((b) => b.kind + b.start));
  return { ...plan, blocks: [...kept, ...future.filter((b) => !keptIds.has(b.kind + b.start) && b.start >= from)].sort((a, b) => a.start - b.start) };
}

export function currentBlock(plan: Rev24Plan, now = Date.now()): Block | undefined {
  return plan.blocks.find((b) => !b.done && b.start <= now && b.end > now) ?? plan.blocks.find((b) => !b.done && b.start > now);
}

export function markDone(plan: Rev24Plan, id: string, score?: { ok: number; total: number }, now = Date.now()): Rev24Plan {
  const blocks = plan.blocks.map((b) => (b.id === id ? { ...b, done: true, score, end: Math.min(b.end, Math.max(now, b.start + MIN)) } : b));
  return replan({ ...plan, blocks }, now);
}

export function remainingSessions(plan: Rev24Plan, module: string, chapter: string): number {
  return plan.blocks.filter((b) => b.kind === 'study' && !b.done && b.goal?.module === module && b.goal.chapter === chapter).length;
}
