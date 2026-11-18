import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Section, Question, Mission } from '../lib/schema';
import { L, Code, Tex } from './Text';
import { Icon } from './Icon';
import { useT, useL } from '../hooks/useT';
import { ANIMATIONS } from '../anim';
import { QuizRunner } from './QuizRunner';

const CALLOUT = {
  tip: { icon: 'bulb', cls: 'border-accent2/50 bg-accent2/10', key: 'callout.tip' },
  trap: { icon: 'alert', cls: 'border-bad/50 bg-bad/10', key: 'callout.trap' },
  exam: { icon: 'star', cls: 'border-warn/60 bg-warn/10', key: 'callout.exam' }
} as const;

export function SectionView({ s, questions, missions, id }: { s: Section; questions: Record<string, Question>; missions: Mission[]; id?: string }) {
  const { t } = useT();
  const tl = useL();
  const reduce = useReducedMotion();
  const wrap = (child: React.ReactNode) => (
    <motion.div id={id} initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.35 }} className="my-4">
      {child}
    </motion.div>
  );
  switch (s.type) {
    case 'heading':
      return wrap(
        <h2 className="h2 mt-8 scroll-mt-20 border-b border-line pb-1">
          <L v={s.body} />
        </h2>
      );
    case 'text':
      return wrap(<L v={s.body} md />);
    case 'code':
      return wrap(
        <figure>
          <Code code={s.code} lang={s.lang} />
          {s.caption && (
            <figcaption className="mt-1 text-xs text-muted">
              <L v={s.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'formula':
      return wrap(
        <figure className="card px-3 py-2">
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
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-surface2 text-xs uppercase tracking-wide text-muted">
              <tr>
                {s.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2">
                    <L v={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-top">
                  {r.map((c, j) => (
                    <td key={j} className={`px-3 py-2 ${typeof c === 'string' ? 'font-mono text-[13px] text-accent2' : ''}`}>
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
        <aside className={`rounded-xl border-l-4 p-3 ${c.cls}`}>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <Icon name={c.icon} size={16} /> {t(c.key)}
          </div>
          <L v={s.body} md />
        </aside>
      );
    }
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
        <div className="rounded-2xl border border-dashed border-accent/50 p-3">
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
        <Link to={`/terminal?mission=${m.id}`} className="card flex items-center gap-3 p-3 hover:border-accent">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0b1020] text-emerald-300">
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
