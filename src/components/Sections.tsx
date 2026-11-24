import { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Section, Question, Mission } from '../lib/schema';
import { L, Code, Tex, guessLang } from './Text';
import { Icon } from './Icon';
import { useT, useL } from '../hooks/useT';
import { useStore } from '../store/store';
import { ANIMATIONS } from '../anim';
import { QuizRunner } from './QuizRunner';
import type { UIKey } from '../i18n/ui';

const CALLOUT: Record<string, { icon: string; cls: string; head: string; key: UIKey }> = {
  tip: { icon: 'bulb', cls: 'border-accent2/40 bg-accent2/[0.06]', head: 'text-accent2', key: 'callout.tip' },
  trap: { icon: 'alert', cls: 'border-bad/40 bg-bad/[0.06]', head: 'text-bad', key: 'callout.trap' },
  exam: { icon: 'star', cls: 'border-warn/50 bg-warn/[0.07]', head: 'text-warn', key: 'callout.exam' },
  def: { icon: 'book', cls: 'border-accent/40 bg-accent/[0.06]', head: 'text-accent', key: 'callout.def' },
  example: { icon: 'compass', cls: 'border-line bg-surface2/70', head: 'text-fg', key: 'callout.example' },
  darija: { icon: 'chat', cls: 'border-accent/30 bg-surface', head: 'text-accent', key: 'callout.darija' },
  key: { icon: 'target', cls: 'border-fg/80 bg-surface border-2', head: 'text-fg', key: 'callout.key' },
  formula: { icon: 'sigma', cls: 'border-navy/30 bg-navy/[0.04] dark:border-accent2/30 dark:bg-accent2/[0.06]', head: 'text-accent2', key: 'callout.formula' }
};

/** Table cells: `$…$` is typeset with KaTeX, plain numbers stay readable, other strings are code-like. */
const TEX_CELL = /^\$[^$]+\$$/;
const NUM_CELL = /^[\d\s,.∞%()+=−–-]+$/;
const MARK_CELL = /^\s*([✓✗])/;
/** Same look in every module (the data-analysis tables): first column = key (accent), code cells in mono colour, ✓ / ✗ in green / red. */
function cellClass(c: unknown, col = 1): string {
  if (typeof c !== 'string') return col === 0 ? 'font-semibold text-accent2' : '';
  const m = MARK_CELL.exec(c);
  if (m) return `font-mono font-bold text-[13.5px] lg:text-[15px] ${m[1] === '✓' ? 'text-ok' : 'text-bad'}`;
  if (TEX_CELL.test(c)) return 'whitespace-nowrap text-[15px] text-fg lg:text-[17px]';
  if (NUM_CELL.test(c)) return 'font-mono tabular-nums text-[13.5px] text-fg lg:text-[15px]';
  return 'font-mono text-[13px] text-accent2 lg:text-[14.5px]';
}

/** A worked solution shown one step at a time (the number of steps revealed is saved on the device). */
function StepByStep({ s, skey }: { s: Extract<Section, { type: 'steps' }>; skey?: string }) {
  const { t } = useT();
  const reduce = useReducedMotion();
  const seen = useStore((st) => (skey ? st.stepsSeen[skey] : undefined));
  const setSeen = useStore((st) => st.setStepsSeen);
  const [local, setLocal] = useState(1);
  const n = Math.max(1, Math.min(s.items.length, seen ?? local));
  const show = (k: number) => {
    setLocal(k);
    if (skey) setSeen(skey, k);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line bg-surface2/60 px-4 py-3">
        <span className="icon-tile h-8 w-8 bg-accent text-white dark:text-bg">
          <Icon name="list" size={16} />
        </span>
        <div className="min-w-0 flex-1 font-semibold">{s.title ? <L v={s.title} /> : t('steps.step')}</div>
        <span className="font-mono text-xs text-muted">
          {n}/{s.items.length}
        </span>
      </div>
      <ol className="space-y-0 px-4 py-2">
        <AnimatePresence initial={false}>
          {s.items.slice(0, n).map((it, i) => (
            <motion.li key={i} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="relative border-l-2 border-line py-3 pl-6 last:border-transparent">
              <span className={`absolute -left-[13px] top-3 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${i === n - 1 ? 'bg-accent text-white dark:text-bg' : 'bg-surface2 text-muted ring-1 ring-line'}`}>{i + 1}</span>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                {t('steps.step')} {i + 1}
              </div>
              <div className="font-semibold">
                <L v={it.title} />
              </div>
              <L v={it.body} md className="text-[15px] lg:text-[16.5px]" />
              {it.tex && (
                <div className="mt-2 rounded-lg bg-surface2/70 px-3 py-1">
                  <Tex tex={it.tex} block />
                </div>
              )}
              {it.code && <Code code={it.code} lang={guessLang(it.code, 'python')} className="mt-2" />}
              {it.why && (
                <div className="mt-2 flex gap-2 rounded-lg border border-accent/25 bg-accent/[0.05] p-2.5 text-sm">
                  <Icon name="bulb" size={15} className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    <b className="mr-1">{t('steps.why')}</b>
                    <L v={it.why} />
                  </span>
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {n < s.items.length ? (
          <>
            <button className="btn-primary btn-sm" onClick={() => show(n + 1)} data-testid="step-next">
              {t('steps.next')} <Icon name="down" size={14} />
            </button>
            <button className="btn-ghost btn-sm" onClick={() => show(s.items.length)}>
              {t('steps.all')}
            </button>
          </>
        ) : (
          <button className="btn-ghost btn-sm" onClick={() => show(1)}>
            <Icon name="reset" size={14} /> {t('steps.reset')}
          </button>
        )}
      </div>
    </div>
  );
}

/** A proof set like a maths textbook: plain surface, numbered lines, centred display maths, end-of-proof box. */
function Proof({ s }: { s: Extract<Section, { type: 'proof' }> }) {
  const { t } = useT();
  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-4 sm:px-7 sm:py-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 border-b border-line pb-2">
        <span className="font-display text-[15px] font-bold italic lg:text-[16.5px]">{t('proof.label')}</span>
        {s.title && (
          <span className="text-[15px] text-muted lg:text-[16.5px]">
            — <L v={s.title} />
          </span>
        )}
      </div>
      <ol className="space-y-3.5">
        {s.lines.map((x, i) => (
          <li key={i} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-1">
            <span className="pt-px font-mono text-[13px] font-bold text-muted lg:text-[14px]">({i + 1})</span>
            <div className="min-w-0 text-[15px] leading-relaxed text-fg lg:text-[16.5px]">
              <span className="mr-1.5 font-semibold">
                <L v={x.title} />.
              </span>
              <L v={x.body} md />
              {x.tex && (
                <div className="my-2 overflow-x-auto py-1 text-center text-fg">
                  <Tex tex={x.tex} block />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2 text-right text-lg leading-none text-fg" aria-label={t('proof.end')}>
        ∎
      </div>
    </div>
  );
}

/** Model answer laid out like the test paper: every line visible, label on the left, conclusion boxed. */
function ExamCopy({ s }: { s: Extract<Section, { type: 'copy' }> }) {
  const { t } = useT();
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="rounded bg-fg px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-bg">{t('copy.badge')}</span>
        <span className="min-w-0 flex-1 font-semibold">
          <L v={s.title} />
        </span>
      </div>
      {s.statement && (
        <div className="border-b border-line bg-surface2/50 px-4 py-3 text-[14.5px] lg:text-[16px]">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">{t('copy.statement')}</div>
          <L v={s.statement} md />
        </div>
      )}
      <ol className="relative">
        <span className="absolute inset-y-0 left-[2.6rem] w-px bg-bad/30 sm:left-[9.5rem]" aria-hidden />
        {s.lines.map((x, i) => (
          <li key={i} className="grid grid-cols-[2.6rem_minmax(0,1fr)] border-b border-dashed border-line/80 last:border-0 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
            <div className="px-3 py-3 text-[12px] font-bold text-muted lg:text-[13.5px]">
              <span className="font-mono text-accent">{i + 1}</span>
              <span className="ml-2 hidden sm:inline">
                <L v={x.label} />
              </span>
            </div>
            <div className="min-w-0 px-4 py-3 text-[15px] lg:text-[16.5px]">
              <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-muted sm:hidden">
                <L v={x.label} />
              </div>
              <L v={x.body} md />
              {x.tex && (
                <div className="mt-1.5 overflow-x-auto">
                  <Tex tex={x.tex} block />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      {s.result && (
        <div className="flex gap-3 border-t-2 border-ok/50 bg-ok/[0.07] px-4 py-3 text-[15px] lg:text-[16.5px]">
          <Icon name="check" size={18} className="mt-0.5 shrink-0 text-ok" />
          <div>
            <b className="mr-1">{t('copy.result')}</b>
            <L v={s.result} md />
          </div>
        </div>
      )}
    </div>
  );
}

/** Example block: input file → code → output, like a "Try it" box. */
function Demo({ s }: { s: Extract<Section, { type: 'demo' }> }) {
  const { t } = useT();
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line bg-accent/[0.07] px-4 py-2.5">
        <span className="text-xs font-bold uppercase tracking-wide text-accent">{t('demo.example')}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold lg:text-[15.5px]">
          <L v={s.title} />
        </span>
      </div>
      <div className="space-y-3 p-3 sm:p-4">
        {s.file && (
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-t-md border border-b-0 border-line bg-surface2 px-2.5 py-1 font-mono text-[11px] text-muted">
              <Icon name="file" size={12} /> {s.file.name}
            </div>
            <pre className="scroll-thin -mt-1 overflow-x-auto rounded-md rounded-tl-none border border-line bg-surface2/60 px-3 py-2 font-mono text-[12.5px] leading-relaxed lg:text-[14px]">{s.file.content}</pre>
          </div>
        )}
        <Code code={s.code} lang={s.lang ?? 'python'} />
        {s.output !== undefined && (
          <div>
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">{t('demo.output')}</div>
            <pre className="scroll-thin overflow-x-auto rounded-md border-l-4 border-ok bg-surface2/70 px-3 py-2 font-mono text-[12.5px] leading-relaxed lg:text-[14px]">{s.output}</pre>
          </div>
        )}
        {s.note && (
          <div className="flex gap-2 text-sm text-muted">
            <Icon name="bulb" size={15} className="mt-0.5 shrink-0 text-accent" />
            <L v={s.note} md />
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionView({ s, questions, missions, id, skey }: { s: Section; questions: Record<string, Question>; missions: Mission[]; id?: string; skey?: string }) {
  const { t } = useT();
  const tl = useL();
  const reduce = useReducedMotion();
  const wrap = (child: React.ReactNode, cls = 'my-5') => (
    // CSS-only entrance: the content is visible even if the animation never runs (print, old browsers)
    <div id={id} data-section={id} className={`${cls} scroll-mt-32 ${reduce ? '' : 'fade-up'}`}>
      {child}
    </div>
  );
  switch (s.type) {
    case 'heading':
      return wrap(
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl xl:text-[1.75rem]">
          <span className="h-6 w-1 rounded-full bg-accent" />
          <L v={s.body} />
        </h2>,
        'mb-3 mt-12'
      );
    case 'text':
      return wrap(<L v={s.body} md className="text-[16px] leading-[1.75] lg:text-[17.5px]" />, 'my-4');
    case 'code':
      return wrap(
        <figure>
          <Code code={s.code} lang={s.lang} />
          {s.caption && (
            <figcaption className="mt-1.5 text-xs text-muted">
              <L v={s.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'formula':
      return wrap(
        <figure className="rounded-xl border border-line bg-surface px-4 py-3">
          <Tex tex={s.tex} block />
          {s.caption && (
            <figcaption className="text-center text-xs text-muted">
              <L v={s.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'table':
      return wrap(
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[420px] text-left text-sm lg:text-[15.5px]">
            <thead className="bg-surface2 text-xs uppercase tracking-wide text-muted">
              <tr>
                {s.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2.5 font-semibold">
                    <L v={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-middle transition-colors even:bg-surface2/30 hover:bg-accent/5">
                  {r.map((c, j) => (
                    <td key={j} className={`px-3 py-2.5 ${cellClass(c, j)}`}>
                      {typeof c !== 'string' ? <L v={c} /> : TEX_CELL.test(c) ? <Tex tex={c.slice(1, -1)} /> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout': {
      const c = CALLOUT[s.kind];
      return wrap(
        <aside className={`rounded-xl border p-4 ${c.cls}`}>
          <div className={`mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${c.head}`}>
            <Icon name={c.icon} size={15} /> {t(c.key)}
          </div>
          {s.tex && <Tex tex={s.tex} block />}
          <L v={s.body} md className="text-[15px] lg:text-[16.5px]" />
        </aside>
      );
    }
    case 'steps':
      return wrap(<StepByStep s={s} skey={skey} />);
    case 'demo':
      return wrap(<Demo s={s} />);
    case 'proof':
      return wrap(<Proof s={s} />, 'my-6');
    case 'copy':
      return wrap(<ExamCopy s={s} />, 'my-6');
    case 'animation': {
      const A = ANIMATIONS[s.component];
      if (!A) return null;
      return wrap(
        <Suspense fallback={<div className="card h-48 animate-pulse" />}>
          <A {...(s.props ?? {})} />
        </Suspense>
      );
    }
    case 'miniQuiz': {
      const qs = s.questionIds.map((qid) => questions[qid]).filter(Boolean);
      if (!qs.length) return null;
      return wrap(
        <div className="rounded-xl border border-dashed border-accent/50 bg-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent">
            <Icon name="quiz" size={16} /> {t('chapter.miniquiz')}
          </div>
          <QuizRunner questions={qs} compact />
        </div>
      );
    }
    case 'mission': {
      const m = missions.find((x) => x.id === s.missionId);
      if (!m) return null;
      return wrap(
        <Link to={`/terminal?mission=${m.id}`} className="card card-hover flex items-center gap-3 p-3">
          <span className="icon-tile h-10 w-10 bg-[#0b1020] text-emerald-300">
            <Icon name="terminal" />
          </span>
          <span className="flex-1">
            <span className="block text-xs text-muted">{t('anim.tryTerminal')}</span>
            <span className="font-semibold">{tl(m.title)}</span>
          </span>
          <Icon name="right" />
        </Link>
      );
    }
  }
}
