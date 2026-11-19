import { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Section, Question, Mission } from '../lib/schema';
import { L, Code, Tex } from './Text';
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
  formula: { icon: 'sigma', cls: 'border-navy/30 bg-navy/[0.04] dark:border-accent2/30 dark:bg-accent2/[0.06]', head: 'text-accent2', key: 'callout.formula' }
};

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
              <L v={it.body} md className="text-[15px]" />
              {it.tex && (
                <div className="mt-2 rounded-lg bg-surface2/70 px-3 py-1">
                  <Tex tex={it.tex} block />
                </div>
              )}
              {it.code && <Code code={it.code} lang="python" className="mt-2" />}
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
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl">
          <span className="h-6 w-1 rounded-full bg-accent" />
          <L v={s.body} />
        </h2>,
        'mb-3 mt-12'
      );
    case 'text':
      return wrap(<L v={s.body} md className="text-[15.5px] leading-[1.75]" />, 'my-4');
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
          <table className="w-full min-w-[420px] text-left text-sm">
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
                <tr key={i} className="border-t border-line align-top even:bg-surface2/30">
                  {r.map((c, j) => (
                    <td key={j} className={`px-3 py-2.5 ${typeof c === 'string' ? 'font-mono text-[13px] text-accent2' : ''}`}>
                      {typeof c === 'string' ? c : <L v={c} />}
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
          <L v={s.body} md className="text-[15px]" />
        </aside>
      );
    }
    case 'steps':
      return wrap(<StepByStep s={s} skey={skey} />);
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
