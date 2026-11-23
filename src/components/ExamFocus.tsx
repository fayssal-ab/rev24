/**
 * Home page focus: the next written test (Analyse de données).
 * One primary action (the hypothesis-testing method), three secondary ones, and the module's programme.
 * To point it at another test later, change FOCUS below.
 */
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useT, useL } from '../hooks/useT';
import { useModuleContent } from '../hooks/useModule';
import { useStore } from '../store/store';

/** `out`: chapters the class said are not in this test (Chap 0 intro, Chap 4 visualisation). */
const FOCUS = { module: 'data', chapter: 'tests', out: ['d-intro', 'visu'] };

export function ExamFocus() {
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const { data } = useModuleContent(FOCUS.module);
  const base = `/m/${FOCUS.module}`;
  const focus = data?.chapters.find((c) => c.id === FOCUS.chapter);
  const inScope = (data?.chapters ?? []).filter((c) => !FOCUS.out.includes(c.id));
  const done = inScope.filter((c) => st.read[`${FOCUS.module}/${c.id}`]).length;

  return (
    <section aria-labelledby="focus-title" className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm" data-testid="exam-focus">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* the one thing to do */}
        <div className="flex min-w-0 flex-col p-6 sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> {t('focus.eyebrow')}
          </span>
          <h2 id="focus-title" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {t('focus.title')}
          </h2>
          <p className="mt-2 max-w-md text-[15px] text-muted">{t('focus.sub')}</p>

          <ul className="mt-5 space-y-2 text-[15px]">
            {(['focus.p1', 'focus.p2', 'focus.p3'] as const).map((k) => (
              <li key={k} className="flex gap-2.5">
                <Icon name="check" size={17} className="mt-0.5 shrink-0 text-accent" />
                {t(k)}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Link to={`${base}/c/${FOCUS.chapter}`} className="btn-primary" data-testid="focus-start">
              <Icon name="play" size={16} /> {t('focus.cta')}
            </Link>
            <Link to={`${base}/exercices?chapter=${FOCUS.chapter}`} className="btn-ghost">
              <Icon name="dumbbell" size={16} /> {t('focus.exercises')}
            </Link>
            <Link to={`${base}/examen`} className="btn-ghost">
              <Icon name="target" size={16} /> {t('nav.exam')}
            </Link>
            <Link to={`${base}/fiche`} className="btn-ghost">
              <Icon name="print" size={16} /> {t('nav.sheet')}
            </Link>
          </div>
        </div>

        {/* the programme, W3Schools-style list */}
        <div className="border-t border-line bg-surface2/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">{t('focus.program')}</span>
            {data && (
              <span className="font-mono text-xs text-muted">
                {done}/{inScope.length}
              </span>
            )}
          </div>
          <ol className="space-y-1">
            {(data?.chapters ?? []).map((c, i) => {
              const read = !!st.read[`${FOCUS.module}/${c.id}`];
              const isFocus = c.id === focus?.id;
              const out = FOCUS.out.includes(c.id);
              return (
                <li key={c.id}>
                  <Link
                    to={`${base}/c/${c.id}`}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isFocus ? 'bg-accent text-white shadow-sm' : out ? 'opacity-50 hover:opacity-80' : 'hover:bg-surface'}`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${isFocus ? 'bg-white/20' : read ? 'bg-ok text-white' : 'bg-surface ring-1 ring-line text-muted'}`}>
                      {read && !isFocus ? <Icon name="check" size={12} /> : i + 1}
                    </span>
                    <span className={`min-w-0 flex-1 truncate font-medium ${out ? 'line-through decoration-1' : ''}`}>{tl(c.title)}</span>
                    {out ? (
                      <span className="shrink-0 text-[10px] font-bold uppercase text-muted">{t('focus.out')}</span>
                    ) : isFocus ? (
                      <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">{t('focus.priority')}</span>
                    ) : (
                      <Icon name="arrowRight" size={14} className="shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
                    )}
                  </Link>
                </li>
              );
            })}
            {!data && Array.from({ length: 6 }, (_, i) => <li key={i} className="h-10 animate-pulse rounded-lg bg-surface" />)}
          </ol>
        </div>
      </div>
    </section>
  );
}
