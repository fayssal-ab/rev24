/** Writes the JSON content files from the compact authoring sources in content-src/. */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const modules = process.argv.slice(2).length ? process.argv.slice(2) : ['linux', 'data', 'ro', 'oracle', 'mobile'];
for (const id of modules) {
  const src = await import(`../content-src/${id}/index.ts`);
  const out = join(process.cwd(), 'src/content', id);
  rmSync(out, { recursive: true, force: true });
  for (const d of ['chapters', 'questions', 'exercises', 'flashcards']) mkdirSync(join(out, d), { recursive: true });
  const w = (p: string, data: unknown) => writeFileSync(join(out, p), JSON.stringify(data, null, 1) + '\n');
  w('module.json', src.module);
  for (const c of src.chapters) w(`chapters/${c.id}.json`, c);
  const by = <T extends { chapter: string }>(list: T[]) => list.reduce<Record<string, T[]>>((a, x) => ((a[x.chapter] ??= []).push(x), a), {});
  for (const [ch, list] of Object.entries(by(src.questions))) w(`questions/${ch}.json`, list);
  for (const [ch, list] of Object.entries(by(src.exercises))) w(`exercises/${ch}.json`, list);
  for (const [ch, list] of Object.entries(by(src.flashcards))) w(`flashcards/${ch}.json`, list);
  if (src.missions?.length) w('missions.json', src.missions);
  if (src.reference?.length) w('reference.json', src.reference);
  console.log(`✓ ${id}: ${src.chapters.length} chapters, ${src.questions.length} questions, ${src.exercises.length} exercises, ${src.flashcards.length} flashcards, ${src.missions?.length ?? 0} missions`);
}
