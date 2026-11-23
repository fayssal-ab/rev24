import { z } from 'zod';

export const LANGS = ['fr', 'dar', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** Localised string. `dar` and `en` may be missing at runtime (fallback on fr), but content:check requires them. */
export const L10nSchema = z.object({ fr: z.string().min(1), dar: z.string().min(1), en: z.string().min(1) });
export type L10n = z.infer<typeof L10nSchema>;

/** A numeric value computed by a named, tested stats function. Used to verify that numbers in content are right. */
export const ComputeSchema = z.object({
  fn: z.string(),
  args: z.array(z.union([z.number(), z.string(), z.array(z.number()), z.boolean()])),
  /** optional index when fn returns an array/object field */
  pick: z.union([z.string(), z.number()]).optional()
});
export type Compute = z.infer<typeof ComputeSchema>;

export const SectionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), body: L10nSchema }),
  z.object({ type: z.literal('heading'), body: L10nSchema }),
  z.object({ type: z.literal('code'), lang: z.enum(['bash', 'python', 'ini', 'text', 'java', 'xml']), code: z.string(), caption: L10nSchema.optional() }),
  z.object({ type: z.literal('formula'), tex: z.string(), caption: L10nSchema.optional() }),
  z.object({ type: z.literal('table'), headers: z.array(L10nSchema), rows: z.array(z.array(z.union([L10nSchema, z.string()]))) }),
  z.object({ type: z.literal('animation'), component: z.string(), props: z.record(z.unknown()).optional() }),
  z.object({ type: z.literal('callout'), kind: z.enum(['tip', 'trap', 'exam', 'def', 'example', 'darija', 'formula', 'key']), body: L10nSchema, tex: z.string().optional() }),
  /** worked solution revealed one step at a time */
  z.object({
    type: z.literal('steps'),
    title: L10nSchema.optional(),
    items: z.array(z.object({ title: L10nSchema, body: L10nSchema, tex: z.string().optional(), code: z.string().optional(), why: L10nSchema.optional() })).min(1)
  }),
  /** a model exam answer, written out in full the way it is expected on the paper */
  z.object({
    type: z.literal('copy'),
    title: L10nSchema,
    statement: L10nSchema.optional(),
    lines: z.array(z.object({ label: L10nSchema, body: L10nSchema, tex: z.string().optional() })).min(1),
    result: L10nSchema.optional()
  }),
  /** W3Schools-style example: optional input file, the code, and its real output */
  z.object({
    type: z.literal('demo'),
    title: L10nSchema,
    file: z.object({ name: z.string(), content: z.string() }).optional(),
    code: z.string(),
    lang: z.enum(['python', 'bash', 'text']).optional(),
    output: z.string().optional(),
    note: L10nSchema.optional()
  }),
  z.object({ type: z.literal('miniQuiz'), questionIds: z.array(z.string()).min(1) }),
  z.object({ type: z.literal('mission'), missionId: z.string() })
]);
export type Section = z.infer<typeof SectionSchema>;

export const ModuleSchema = z.object({
  id: z.string(),
  title: L10nSchema,
  subtitle: L10nSchema,
  color: z.string(),
  icon: z.string(),
  theme: z.enum(['terminal', 'violet', 'amber', 'crimson']),
  chapters: z.array(z.string()),
  /** chapters announced but not yet provided */
  upcoming: z.array(z.object({ id: z.string(), title: L10nSchema, order: z.number().optional() })).default([]),
  /** past exam papers (timed, corrected at the end) */
  annales: z
    .array(z.object({ id: z.string(), title: L10nSchema, minutes: z.number(), intro: L10nSchema, parts: z.array(z.object({ exerciseId: z.string(), points: z.number(), group: z.string().optional() })) }))
    .default([]),
  /** simulator used by this module's missions */
  console: z.enum(['bash', 'sqlplus']).optional(),
  /** exam weight per chapter, used by the mock exam */
  weights: z.record(z.number())
});
export type Module = z.infer<typeof ModuleSchema>;

export const ChapterSchema = z.object({
  id: z.string(),
  module: z.string(),
  order: z.number(),
  title: L10nSchema,
  summary: L10nSchema,
  estimatedMinutes: z.number(),
  sections: z.array(SectionSchema).min(1),
  keyPoints: z.array(L10nSchema).min(1)
});
export type Chapter = z.infer<typeof ChapterSchema>;

export const QuestionSchema = z
  .object({
    id: z.string(),
    module: z.string(),
    chapter: z.string(),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    kind: z.enum(['single', 'multi', 'command', 'numeric', 'order']),
    prompt: L10nSchema,
    code: z.string().optional(),
    options: z.array(z.object({ id: z.string(), text: L10nSchema })).optional(),
    answer: z.union([z.string(), z.array(z.string()), z.number()]),
    tolerance: z.number().optional(),
    compute: ComputeSchema.optional(),
    explanation: L10nSchema,
    wrongExplanations: z.record(L10nSchema).optional(),
    tags: z.array(z.string())
  })
  .superRefine((q, ctx) => {
    const ids = q.options?.map((o) => o.id) ?? [];
    if (q.kind === 'single' || q.kind === 'multi' || q.kind === 'order') {
      if (!q.options || q.options.length < 2) ctx.addIssue({ code: 'custom', message: `${q.id}: options required` });
    }
    if (q.kind === 'single') {
      if (typeof q.answer !== 'string' || !ids.includes(q.answer)) ctx.addIssue({ code: 'custom', message: `${q.id}: single answer must be an option id` });
      const wrong = ids.filter((i) => i !== q.answer);
      for (const w of wrong) if (!q.wrongExplanations?.[w]) ctx.addIssue({ code: 'custom', message: `${q.id}: missing wrongExplanation for ${w}` });
    }
    if (q.kind === 'multi') {
      if (!Array.isArray(q.answer) || q.answer.some((a) => !ids.includes(a))) ctx.addIssue({ code: 'custom', message: `${q.id}: multi answer must be option ids` });
      const ans = Array.isArray(q.answer) ? q.answer : [];
      for (const w of ids.filter((i) => !ans.includes(i))) if (!q.wrongExplanations?.[w]) ctx.addIssue({ code: 'custom', message: `${q.id}: missing wrongExplanation for ${w}` });
    }
    if (q.kind === 'order') {
      if (!Array.isArray(q.answer) || q.answer.length !== ids.length || q.answer.some((a) => !ids.includes(a)))
        ctx.addIssue({ code: 'custom', message: `${q.id}: order answer must be a permutation of option ids` });
    }
    if (q.kind === 'command' && !(Array.isArray(q.answer) && q.answer.length > 0)) ctx.addIssue({ code: 'custom', message: `${q.id}: command answer must be a non-empty list` });
    if (q.kind === 'numeric' && typeof q.answer !== 'number') ctx.addIssue({ code: 'custom', message: `${q.id}: numeric answer must be a number` });
  });
export type Question = z.infer<typeof QuestionSchema>;

export const ExerciseSchema = z.object({
  id: z.string(),
  module: z.string(),
  chapter: z.string(),
  difficulty: z.union([z.literal(2), z.literal(3)]),
  title: L10nSchema,
  statement: L10nSchema,
  data: z.string().optional(),
  hints: z.array(L10nSchema).min(1),
  solutionSteps: z.array(z.object({ title: L10nSchema, body: L10nSchema, code: z.string().optional(), tex: z.string().optional() })).min(1),
  finalAnswer: L10nSchema,
  commonMistakes: z.array(L10nSchema).min(1),
  /** numeric facts verified against the stats library by content:check and vitest */
  checks: z.array(z.object({ compute: ComputeSchema, expect: z.number(), tolerance: z.number() })).optional(),
  missionId: z.string().optional(),
  /** interactive widget shown in the exercise (e.g. random-graph Kruskal sheet) */
  widget: z.object({ component: z.string(), props: z.record(z.unknown()).optional() }).optional()
});
export type Exercise = z.infer<typeof ExerciseSchema>;

export const FlashcardSchema = z.object({ id: z.string(), module: z.string(), chapter: z.string(), front: L10nSchema, back: L10nSchema });
export type Flashcard = z.infer<typeof FlashcardSchema>;

/** Terminal missions: a goal + automatic checks on the final virtual system state. */
export const MissionCheckSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('userExists'), user: z.string(), uid: z.number().optional(), gid: z.string().optional(), home: z.string().optional(), shell: z.string().optional(), comment: z.string().optional() }),
  z.object({ type: z.literal('userAbsent'), user: z.string() }),
  z.object({ type: z.literal('groupExists'), group: z.string(), gid: z.number().optional() }),
  z.object({ type: z.literal('groupAbsent'), group: z.string() }),
  z.object({ type: z.literal('inGroup'), user: z.string(), group: z.string(), not: z.boolean().optional() }),
  z.object({ type: z.literal('pathExists'), path: z.string(), kind: z.enum(['file', 'dir']).optional(), not: z.boolean().optional() }),
  z.object({ type: z.literal('owner'), path: z.string(), user: z.string().optional(), group: z.string().optional() }),
  z.object({ type: z.literal('mode'), path: z.string(), mode: z.string() }),
  z.object({ type: z.literal('fileContains'), path: z.string(), text: z.string(), not: z.boolean().optional() }),
  z.object({ type: z.literal('passwordLocked'), user: z.string(), locked: z.boolean() }),
  z.object({ type: z.literal('shadowField'), user: z.string(), field: z.enum(['last', 'min', 'max', 'warn', 'inactive', 'expire']), value: z.string() }),
  z.object({ type: z.literal('serviceState'), service: z.string(), active: z.boolean().optional(), enabled: z.boolean().optional(), masked: z.boolean().optional() }),
  z.object({ type: z.literal('defaultTarget'), target: z.string() }),
  z.object({ type: z.literal('packageInstalled'), name: z.string(), installed: z.boolean() }),
  z.object({ type: z.literal('currentUser'), user: z.string() }),
  z.object({ type: z.literal('password'), user: z.string(), password: z.string() }),
  z.object({ type: z.literal('flag'), flag: z.string() }),
  z.object({ type: z.literal('fileLine'), path: z.string(), user: z.string(), field: z.number(), value: z.string() }),
  // ---- SQL*Plus simulator ----
  z.object({ type: z.literal('oraUser'), user: z.string(), container: z.string(), exists: z.boolean().default(true), privilege: z.string().optional(), locked: z.boolean().optional() }),
  z.object({ type: z.literal('oraPdb'), pdb: z.string(), openMode: z.string() }),
  z.object({ type: z.literal('oraInstance'), state: z.enum(['SHUTDOWN', 'NOMOUNT', 'MOUNT', 'OPEN']) }),
  z.object({ type: z.literal('oraContainer'), container: z.string() }),
  z.object({ type: z.literal('oraConnected'), user: z.string(), container: z.string().optional() }),
  z.object({ type: z.literal('oraSessionKilled'), user: z.string() }),
  z.object({ type: z.literal('oraFlag'), flag: z.string() })
]);
export type MissionCheck = z.infer<typeof MissionCheckSchema>;

export const MissionSchema = z.object({
  id: z.string(),
  module: z.string(),
  chapter: z.string(),
  title: L10nSchema,
  goal: L10nSchema,
  /** optional commands run silently before the mission starts (as root) */
  setup: z.array(z.string()).default([]),
  startUser: z.string().default('root'),
  rdbreak: z.boolean().default(false),
  engine: z.enum(['bash', 'sqlplus']).default('bash'),
  objectives: z.array(z.object({ label: L10nSchema, check: MissionCheckSchema })).min(1),
  solution: z.array(z.string()).min(1),
  tp5: z.array(z.number()).default([])
});
export type Mission = z.infer<typeof MissionSchema>;

/** Command reference ("formulaire") entries. */
export const RefEntrySchema = z.object({
  id: z.string(),
  chapter: z.string(),
  syntax: z.string(),
  desc: L10nSchema,
  example: z.string().optional()
});
export type RefEntry = z.infer<typeof RefEntrySchema>;

export const GlossarySchema = z.array(RefEntrySchema);
