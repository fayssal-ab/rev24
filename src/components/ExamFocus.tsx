/**
 * Home page focus: the next test, as set by the admin (Admin → Accueil): module, date and time, room,
 * what it covers (free text), priority chapter and chapters out of the test. Without a setting: built-in default.
 */
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useT, useL } from '../hooks/useT';
import { useModuleContent } from '../hooks/useModule';
import { useStore } from '../store/store';
import { getModule } from '../lib/content';
import { daysUntil, useFocus } from '../lib/focus';

export function ExamFocus() {
  const { t, lang } = useT();
  const tl = useL();
  const st = useStore();
  const { focus, custom, loaded } = useFocus();
  const { data } = useModuleContent(focus.module);
  if (!loaded || !focus.enabled || !getModule(focus.module)) return null;

  const mod = getModule(focus.module)!;
  const base = `/m/${focus.module}`;
  const chapters = data?.chapters ?? [];
  const priority = chapters.find((c) => c.id === focus.chapter) ?? chapters[0];
  const inScope = chapters.filter((c) => !focus.out.includes(c.id));
  const done = inScope.filter((c) => st.read[`${focus.module}/${c.id}`]).length;
  const hasBlanc = chapters.some((c) => c.id === 'blanc');
  // the original data-analysis card keeps its tailored texts until the admin writes their own
  const builtIn = !custom || (focus.module === 'data' && !focus.title && !focus.message);

  const kind = t(focus.kind === 'examen' ? 'focus.kind.examen' : 'focus.kind.controle');
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  const days = daysUntil(focus.date);
  const dateLong = focus.date ? new Date(`${focus.date}T12:00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }) : t('focus.when.tbd');
  const when =
    days === null ? null : days < 0 ? t('focus.when.past') : days === 0 ? t('focus.when.today') : days === 1 ? t('focus.when.tomorrow') : t('focus.when.in').replace('{n}', String(days));
  const title = focus.title || (builtIn && focus.module === 'data' ? t('focus.title') : `${kind} — ${tl(mod.title)}`);

  return (
    <section aria-labelledby="focus-title" className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm" data-testid="exam-focus">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* the one thing to do */}
        <div className="flex min-w-0 flex-col p-6 sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> {t('focus.next')} {kind.toLowerCase()} · {tl(mod.title)}
          </span>
          <h2 id="focus-title" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {title}
          </h2>

          {/* when and where */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm" data-testid="focus-when">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface2/60 px-2.5 py-1.5 font-semibold first-letter:uppercase">
              <Icon name="calendar" size={15} className="text-accent" />
              <span className="first-letter:uppercase">{dateLong}</span>
              {focus.time && (
                <span className="text-muted">
                  · {focus.time.replace(':', 'h')}
                </span>
              )}
            </span>
            {focus.room && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface2/60 px-2.5 py-1.5">
                <Icon name="compass" size={15} className="text-accent" /> {t('focus.room')} {focus.room}
              </span>
            )}
            {when && (
              <span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide ${days !== null && days < 0 ? 'bg-surface2 text-muted' : days !== null && days <= 1 ? 'bg-bad text-white' : 'bg-accent text-white dark:text-bg'}`}>
                {when}
              </span>
            )}
          </div>

          {focus.message ? (
            <div className="mt-5 rounded-xl border border-accent/30 bg-accent/[0.05] p-4" data-testid="focus-message">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                <Icon name="bell" size={14} /> {t('focus.content')}
              </div>
              <p className="whitespace-pre-line text-[15px] leading-relaxed">{focus.message}</p>
            </div>
          ) : (
            builtIn &&
            focus.module === 'data' && (
              <>
                <p className="mt-4 max-w-md text-[15px] text-muted">{t('focus.sub')}</p>
                <ul className="mt-4 space-y-2 text-[15px]">
                  {(['focus.p1', 'focus.p2', 'focus.p3'] as const).map((k) => (
                    <li key={k} className="flex gap-2.5">
                      <Icon name="check" size={17} className="mt-0.5 shrink-0 text-accent" />
                      {t(k)}
                    </li>
                  ))}
                </ul>
              </>
            )
          )}

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {priority && (
              <Link to={`${base}/c/${priority.id}`} className="btn-primary" data-testid="focus-start">
                <Icon name="play" size={16} /> {builtIn && focus.module === 'data' ? t('focus.cta') : tl(priority.title)}
              </Link>
            )}
            {hasBlanc && (
              <Link to={`${base}/c/blanc`} className="btn-ghost" data-testid="focus-blanc">
                <Icon name="flag" size={16} /> {t('focus.blanc')}
              </Link>
            )}
            <Link to={`${base}/exercices${priority ? `?chapter=${priority.id}` : ''}`} className="btn-ghost">
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
            {chapters.map((c, i) => {
              const read = !!st.read[`${focus.module}/${c.id}`];
              const isFocus = c.id === priority?.id;
              const out = focus.out.includes(c.id);
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
