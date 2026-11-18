import type { Module, Chapter, Question, Exercise, Flashcard, Mission, RefEntry } from './schema';
import { runCompute } from './compute';

export interface ModuleContent {
  module: Module;
  chapters: Chapter[];
  questions: Question[];
  exercises: Exercise[];
  flashcards: Flashcard[];
  missions: Mission[];
  reference: RefEntry[];
}

/** Assemble a module's content from its JSON files (shared by the app and node scripts). */
export function assemble(module: Module, files: { path: string; data: unknown }[]): ModuleContent {
  const c: ModuleContent = { module, chapters: [], questions: [], exercises: [], flashcards: [], missions: [], reference: [] };
  for (const { path, data } of files) {
    if (path.includes('/chapters/')) c.chapters.push(data as Chapter);
    else if (path.includes('/questions/')) c.questions.push(...(data as Question[]));
    else if (path.includes('/exercises/')) c.exercises.push(...(data as Exercise[]));
    else if (path.includes('/flashcards/')) c.flashcards.push(...(data as Flashcard[]));
    else if (path.endsWith('/missions.json')) c.missions.push(...(data as Mission[]));
    else if (path.endsWith('/reference.json')) c.reference.push(...(data as RefEntry[]));
  }
  module.annales ??= [];
  module.upcoming ??= [];
  c.chapters.sort((a, b) => a.order - b.order);
  // numeric answers defined by a compute expression are computed by the tested stats library
  for (const q of c.questions) if (q.compute && q.kind === 'numeric') q.answer = runCompute(q.compute);
  for (const m of c.missions) {
    m.setup ??= [];
    m.startUser ??= 'root';
    m.rdbreak ??= false;
    m.tp5 ??= [];
    m.engine ??= 'bash';
  }
  return c;
}

