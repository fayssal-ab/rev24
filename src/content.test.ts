import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Mission, Exercise, Question } from './lib/schema';
import { solveMission } from './terminal/missions';
import { runCompute } from './lib/compute';

const dir = join(__dirname, 'content');
const read = <T>(p: string): T => JSON.parse(readFileSync(join(dir, p), 'utf8')) as T;
const list = (m: string, d: string) => readdirSync(join(dir, m, d)).map((f) => `${m}/${d}/${f}`);

describe('terminal missions: reference solutions complete every objective', () => {
  for (const m of read<Mission[]>('linux/missions.json'))
    it(m.id, () => {
      const r = solveMission({ ...m, setup: m.setup ?? [], startUser: m.startUser ?? 'root' });
      expect(r.results.every(Boolean), r.transcript).toBe(true);
    });
});

describe('numeric content is computed by the stats library', () => {
  const qs = list('data', 'questions').flatMap((f) => read<Question[]>(f));
  for (const q of qs.filter((x) => x.compute))
    it(q.id, () => expect(Math.abs(runCompute(q.compute!) - (q.answer as number))).toBeLessThanOrEqual(q.tolerance ?? 0.01));
  const exs = list('data', 'exercises').flatMap((f) => read<Exercise[]>(f));
  for (const e of exs.filter((x) => x.checks?.length))
    it(e.id, () => {
      for (const c of e.checks!) expect(Math.abs(runCompute(c.compute) - c.expect)).toBeLessThanOrEqual(c.tolerance);
    });
});
