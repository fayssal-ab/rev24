/**
 * Authoring helpers: content is written compactly here ([fr, dar, en] tuples) and
 * `npm run content:build` writes the JSON files read by the app into src/content/<module>/.
 */
import type { L10n, Section, Question, Exercise, Flashcard, Mission, MissionCheck, RefEntry, Compute } from '../src/lib/schema';

export type T = [string, string, string] | string;
export const L = (t: T): L10n => (typeof t === 'string' ? { fr: t, dar: t, en: t } : { fr: t[0], dar: t[1], en: t[2] });

// ---------- sections ----------
export const h = (t: T): Section => ({ type: 'heading', body: L(t) });
export const p = (t: T): Section => ({ type: 'text', body: L(t) });
export const code = (c: string, lang: 'bash' | 'python' | 'ini' | 'text' | 'java' | 'xml' = 'bash', cap?: T): Section => ({ type: 'code', lang, code: c, ...(cap ? { caption: L(cap) } : {}) });
export const tex = (t: string, cap?: T): Section => ({ type: 'formula', tex: t, ...(cap ? { caption: L(cap) } : {}) });
export const tip = (t: T): Section => ({ type: 'callout', kind: 'tip', body: L(t) });
export const trap = (t: T): Section => ({ type: 'callout', kind: 'trap', body: L(t) });
export const exam = (t: T): Section => ({ type: 'callout', kind: 'exam', body: L(t) });
export const def = (t: T): Section => ({ type: 'callout', kind: 'def', body: L(t) });
export const example = (t: T): Section => ({ type: 'callout', kind: 'example', body: L(t) });
/** "in plain words": the idea re-explained very simply */
export const plain = (t: T): Section => ({ type: 'callout', kind: 'darija', body: L(t) });
export const formula = (texStr: string, t: T): Section => ({ type: 'callout', kind: 'formula', tex: texStr, body: L(t) });
/** worked solution, revealed one step at a time: [title, body, tex?, why?] */
export type StepT = { t: T; b: T; tex?: string; code?: string; why?: T };
export const steps = (title: T | null, items: StepT[]): Section => ({
  type: 'steps',
  ...(title ? { title: L(title) } : {}),
  items: items.map((x) => ({ title: L(x.t), body: L(x.b), ...(x.tex ? { tex: x.tex } : {}), ...(x.code ? { code: x.code } : {}), ...(x.why ? { why: L(x.why) } : {}) }))
});
/** clean mathematical proof, all lines visible: same item shape as `steps` */
export const proof = (title: T | null, items: StepT[]): Section => ({
  type: 'proof',
  ...(title ? { title: L(title) } : {}),
  lines: items.map((x) => ({ title: L(x.t), body: L(x.b), ...(x.tex ? { tex: x.tex } : {}) }))
});
/** "L'essentiel": the few lines to remember, shown at the top of a chapter */
export const key = (t: T): Section => ({ type: 'callout', kind: 'key', body: L(t) });
/** model exam answer (copie modèle): every line visible, as written on the test paper */
export type CopyLine = { l: T; b: T; tex?: string };
export const copy = (title: T, statement: T | null, lines: CopyLine[], result?: T): Section => ({
  type: 'copy',
  title: L(title),
  ...(statement ? { statement: L(statement) } : {}),
  lines: lines.map((x) => ({ label: L(x.l), body: L(x.b), ...(x.tex ? { tex: x.tex } : {}) })),
  ...(result ? { result: L(result) } : {})
});
/** W3Schools-style example. `output` must be the real output of `code` (run it before pasting). */
export const demo = (title: T, codeStr: string, output?: string, opts: { file?: [string, string]; note?: T } = {}): Section => ({
  type: 'demo',
  title: L(title),
  ...(opts.file ? { file: { name: opts.file[0], content: opts.file[1] } } : {}),
  code: codeStr,
  ...(output ? { output } : {}),
  ...(opts.note ? { note: L(opts.note) } : {})
});
export const table = (headers: T[], rows: T[][]): Section => ({ type: 'table', headers: headers.map(L), rows: rows.map((r) => r.map((c) => (typeof c === 'string' && !/`|\*\*/.test(c) ? c : L(c)))) });
export const anim = (component: string, props?: Record<string, unknown>): Section => ({ type: 'animation', component, ...(props ? { props } : {}) });
export const quiz = (...questionIds: string[]): Section => ({ type: 'miniQuiz', questionIds });
export const mission = (missionId: string): Section => ({ type: 'mission', missionId });

// ---------- questions ----------
type Base = { module: string; chapter: string };
let ctx: Base = { module: '', chapter: '' };
export function setCtx(module: string, chapter: string) {
  ctx = { module, chapter };
}
const OPT = ['a', 'b', 'c', 'd', 'e', 'f'];

/** Single-choice question. `wrong` lists explanations for each wrong option, in option order. */
export function single(id: string, d: 1 | 2 | 3, prompt: T, opts: T[], correct: number, expl: T, wrong: T[], tags: string[], codeStr?: string): Question {
  const options = opts.map((o, i) => ({ id: OPT[i], text: L(o) }));
  const wrongIds = options.map((o) => o.id).filter((_, i) => i !== correct);
  if (wrong.length !== wrongIds.length) throw new Error(`${id}: ${wrongIds.length} wrong explanations expected, got ${wrong.length}`);
  return { id, ...ctx, difficulty: d, kind: 'single', prompt: L(prompt), options, answer: OPT[correct], explanation: L(expl), wrongExplanations: Object.fromEntries(wrongIds.map((w, i) => [w, L(wrong[i])])), tags, ...(codeStr ? { code: codeStr } : {}) };
}

/** Multiple-choice question. */
export function multi(id: string, d: 1 | 2 | 3, prompt: T, opts: T[], correct: number[], expl: T, wrong: T[], tags: string[], codeStr?: string): Question {
  const options = opts.map((o, i) => ({ id: OPT[i], text: L(o) }));
  const wrongIds = options.map((o) => o.id).filter((_, i) => !correct.includes(i));
  if (wrong.length !== wrongIds.length) throw new Error(`${id}: ${wrongIds.length} wrong explanations expected, got ${wrong.length}`);
  return { id, ...ctx, difficulty: d, kind: 'multi', prompt: L(prompt), options, answer: correct.map((i) => OPT[i]), explanation: L(expl), wrongExplanations: Object.fromEntries(wrongIds.map((w, i) => [w, L(wrong[i])])), tags, ...(codeStr ? { code: codeStr } : {}) };
}

/** Command question: the student types the command. `wrong` maps typical wrong commands to explanations. */
export function cmd(id: string, d: 1 | 2 | 3, prompt: T, answers: string[], expl: T, wrong: Record<string, T>, tags: string[]): Question {
  return { id, ...ctx, difficulty: d, kind: 'command', prompt: L(prompt), answer: answers, explanation: L(expl), wrongExplanations: Object.fromEntries(Object.entries(wrong).map(([k, v]) => [k, L(v)])), tags };
}

/** Numeric question; when `compute` is given the answer is computed by the stats library. */
export function num(id: string, d: 1 | 2 | 3, prompt: T, answer: number, tolerance: number, expl: T, wrong: Record<string, T>, tags: string[], compute?: Compute): Question {
  return { id, ...ctx, difficulty: d, kind: 'numeric', prompt: L(prompt), answer, tolerance, ...(compute ? { compute } : {}), explanation: L(expl), wrongExplanations: Object.fromEntries(Object.entries(wrong).map(([k, v]) => [k, L(v)])), tags };
}

/** Ordering question: steps are given in the correct order. */
export function order(id: string, d: 1 | 2 | 3, prompt: T, steps: T[], expl: T, tags: string[]): Question {
  const options = steps.map((s, i) => ({ id: OPT[i] ?? `s${i}`, text: L(s) }));
  return { id, ...ctx, difficulty: d, kind: 'order', prompt: L(prompt), options, answer: options.map((o) => o.id), explanation: L(expl), tags };
}

// ---------- exercises / flashcards / missions / reference ----------
export function ex(
  id: string,
  d: 2 | 3,
  title: T,
  statement: T,
  hints: T[],
  steps: { t: T; b: T; code?: string; tex?: string }[],
  final: T,
  mistakes: T[],
  extra: { data?: string; checks?: Exercise['checks']; missionId?: string } = {}
): Exercise {
  return { id, ...ctx, difficulty: d, title: L(title), statement: L(statement), hints: hints.map(L), solutionSteps: steps.map((s) => ({ title: L(s.t), body: L(isEmpty(s.b) ? ['Commandes :', 'Les commandes :', 'Commands:'] : s.b), ...(s.code ? { code: s.code } : {}), ...(s.tex ? { tex: s.tex } : {}) })), finalAnswer: L(final), commonMistakes: mistakes.map(L), ...extra };
}

export const fc = (id: string, front: T, back: T): Flashcard => ({ id, ...ctx, front: L(front), back: L(back) });

export function ms(id: string, title: T, goal: T, objectives: [T, MissionCheck][], solution: string[], opts: { setup?: string[]; startUser?: string; tp5?: number[]; rdbreak?: boolean; engine?: 'bash' | 'sqlplus' } = {}): Mission {
  return { id, ...ctx, title: L(title), goal: L(goal), setup: opts.setup ?? [], startUser: opts.startUser ?? 'root', rdbreak: opts.rdbreak ?? false, engine: opts.engine ?? 'bash', objectives: objectives.map(([l, c]) => ({ label: L(l), check: c })), solution, tp5: opts.tp5 ?? [] };
}

export const ref = (id: string, syntax: string, desc: T, example?: string): RefEntry => ({ id, chapter: ctx.chapter, syntax, desc: L(desc), ...(example ? { example } : {}) });

function isEmpty(t: T): boolean {
  return typeof t === 'string' ? !t : !t[0] && !t[1] && !t[2];
}
