/**
 * Validates every content file with Zod, checks cross references, minimum volumes,
 * that numbers computed by the stats library match the content, and that every mission's
 * reference solution actually completes the mission in the terminal simulator.
 */
import { z } from 'zod';
import { ModuleSchema, ChapterSchema, QuestionSchema, ExerciseSchema, MissionSchema, RefEntrySchema, type Question } from '../src/lib/schema';
import { runCompute } from '../src/lib/compute';
import { assemble } from '../src/lib/assemble';
import { moduleDirs, readModuleFiles } from './load';
import { solveMission } from '../src/terminal/missions';

const errors: string[] = [];
const err = (m: string) => errors.push(m);

const MIN: Record<string, { questions: number; command?: number; numeric?: number; hard: number; exercises: number; missions?: number }> = {
  linux: { questions: 120, command: 30, hard: 30, exercises: 25, missions: 10 },
  data: { questions: 80, numeric: 20, hard: 20, exercises: 20 }
};

const ids = new Set<string>();
const summary: string[] = [];

for (const id of moduleDirs()) {
  const { module, files } = readModuleFiles(id);
  const m = ModuleSchema.safeParse(module);
  if (!m.success) err(`${id}/module.json: ${m.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join('; ')}`);
  for (const f of files) {
    let schema: z.ZodTypeAny | null = null;
    if (f.path.includes('/chapters/')) schema = ChapterSchema;
    else if (f.path.includes('/questions/')) schema = z.array(QuestionSchema);
    else if (f.path.includes('/exercises/')) schema = z.array(ExerciseSchema);
    else if (f.path.endsWith('/missions.json')) schema = z.array(MissionSchema);
    else if (f.path.endsWith('/reference.json')) schema = z.array(RefEntrySchema);
    if (!schema) {
      err(`${f.path}: unknown content file`);
      continue;
    }
    const r = schema.safeParse(f.data);
    if (!r.success) for (const i of r.error.issues.slice(0, 8)) err(`${f.path}: ${i.path.join('.')} ${i.message}`);
  }
  const rawFiles = JSON.parse(JSON.stringify(files)) as typeof files;
  const c = assemble(module, files);
  const chapterIds = new Set(c.chapters.map((x) => x.id));
  for (const ch of module.chapters) if (!chapterIds.has(ch)) err(`${id}: chapter ${ch} listed in module.json but missing`);
  const qids = new Set(c.questions.map((q) => q.id));
  const mids = new Set(c.missions.map((x) => x.id));
  const all = [...c.questions, ...c.exercises, ...c.missions, ...c.reference];
  for (const x of all) {
    const key = `${'module' in x ? '' : id + ':'}${x.id}`;
    if (ids.has(key)) err(`${id}: duplicate id ${x.id}`);
    ids.add(key);
    if ('chapter' in x && !chapterIds.has(x.chapter)) err(`${id}: ${x.id} references unknown chapter ${x.chapter}`);
    if ('module' in x && x.module !== id) err(`${id}: ${x.id} has module ${x.module}`);
  }
  for (const ch of c.chapters) {
    if (ch.module !== id) err(`${id}/${ch.id}: wrong module`);
    for (const s of ch.sections) {
      if (s.type === 'miniQuiz') for (const q of s.questionIds) if (!qids.has(q)) err(`${id}/${ch.id}: miniQuiz references unknown question ${q}`);
      if (s.type === 'mission' && !mids.has(s.missionId)) err(`${id}/${ch.id}: unknown mission ${s.missionId}`);
    }
  }
  for (const e of c.exercises) if (e.missionId && !mids.has(e.missionId)) err(`${id}/${e.id}: unknown mission ${e.missionId}`);
  // numbers computed by code
  const raw = rawFiles.filter((f) => f.path.includes('/questions/')).flatMap((f) => f.data as Question[]);
  for (const q of raw) {
    if (q.compute) {
      const v = runCompute(q.compute);
      if (typeof q.answer === 'number' && Math.abs(v - q.answer) > (q.tolerance ?? 0.01)) err(`${id}/${q.id}: stored answer ${q.answer} ≠ computed ${v}`);
    }
  }
  for (const e of c.exercises)
    for (const ck of e.checks ?? []) {
      const v = runCompute(ck.compute);
      if (Math.abs(v - ck.expect) > ck.tolerance) err(`${id}/${e.id}: check ${ck.compute.fn} expected ${ck.expect}, computed ${v}`);
    }
  // missions: reference solution must complete every objective
  for (const ms of c.missions) {
    const r = solveMission(ms);
    if (!r.ok) err(`${id}/${ms.id}: reference solution fails objectives ${r.results.map((b, i) => (b ? '' : i + 1)).filter(Boolean).join(',')}\n${r.transcript.split('\n').slice(-25).join('\n')}`);
  }
  // volumes
  const min = MIN[id];
  const count = {
    questions: c.questions.length,
    command: c.questions.filter((q) => q.kind === 'command').length,
    numeric: c.questions.filter((q) => q.kind === 'numeric').length,
    hard: c.questions.filter((q) => q.difficulty === 3).length,
    exercises: c.exercises.length,
    missions: c.missions.length
  };
  if (min)
    for (const [k, v] of Object.entries(min)) {
      const have = count[k as keyof typeof count];
      if (have < v) err(`${id}: ${k} = ${have} < minimum ${v}`);
    }
  if (id === 'linux') {
    const covered = new Set([...c.missions.flatMap((x) => x.tp5), ...c.exercises.flatMap((e) => ((e as unknown as { tp5?: number[] }).tp5 ?? []))]);
    const tp5ex = c.exercises.filter((e) => /tp5/i.test(e.id));
    for (const e of tp5ex) for (const n of (e.id.match(/q(\d+)/g) ?? []).map((s) => +s.slice(1))) covered.add(n);
    const missing = Array.from({ length: 44 }, (_, i) => i + 1).filter((n) => !covered.has(n));
    if (missing.length) err(`linux: TP5 questions not covered by a mission or exercise: ${missing.join(', ')}`);
  }
  summary.push(`${id.padEnd(6)} chapters=${c.chapters.length} questions=${count.questions} (command=${count.command}, numeric=${count.numeric}, hard=${count.hard}) exercises=${count.exercises} missions=${count.missions} reference=${c.reference.length}`);
}

for (const m of Object.keys(MIN)) if (!moduleDirs().includes(m)) err(`module ${m} is missing (run npm run content:build)`);
console.log(summary.join('\n'));
if (errors.length) {
  console.error(`\n✗ content:check — ${errors.length} error(s):\n` + errors.map((e) => ' - ' + e).join('\n'));
  process.exit(1);
}
console.log('✓ content:check — all content valid');
