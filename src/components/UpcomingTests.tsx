/**
 * Home page: upcoming tests, exams and lab reports posted by the admin, shown like announcements.
 * A "compte rendu" stands apart in red, with its deadline right next to the module name.
 */
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useT, useL } from '../hooks/useT';
import { getModule } from '../lib/content';
import { daysUntil, useEvents, type UpcomingEvent } from '../lib/events';

export function UpcomingTests() {
  const { t, lang } = useT();
  const tl = useL();
  const { events } = useEvents();
  if (!events.length) return null;
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  const day = (e: UpcomingEvent) => new Date(`${e.date}T12:00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const hour = (e: UpcomingEvent) => (e.time ? e.time.replace(':', 'h') : '');
  const when = (e: UpcomingEvent) => {
    const d = daysUntil(e.date);
    return d <= 0 ? t('up.today') : d === 1 ? t('up.tomorrow') : t('up.in').replace('{n}', String(d));
  };

  return (
    <section aria-label={t('up.title')} className="space-y-2" data-testid="upcoming">
      {events.map((e) => {
        const mod = getModule(e.module);
        const name = mod ? tl(mod.title) : e.module;
        const soon = daysUntil(e.date) <= 1;
        const cr = e.kind === 'cr';
        return (
          <article
            key={e.id}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${cr ? 'border-bad/50 bg-bad/[0.06]' : 'border-accent/40 bg-accent/5'}`}
            data-testid={cr ? 'upcoming-cr' : 'upcoming-test'}
          >
            <Icon name={cr ? 'file' : 'calendar'} size={18} className={`mt-0.5 shrink-0 ${cr ? 'text-bad' : 'text-accent'}`} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`text-[11px] font-bold uppercase tracking-wide ${cr ? 'text-bad' : 'text-accent'}`}>{t(`up.kind.${e.kind}`)}</span>
                <h2 className="font-semibold">{mod ? <Link to={`/m/${e.module}`} className="hover:underline">{name}</Link> : name}</h2>
                {cr ? (
                  <span className="rounded bg-bad px-2 py-0.5 text-[11px] font-bold text-white">
                    {t('up.due')} {day(e)}
                    {e.time && ` · ${hour(e)}`}
                  </span>
                ) : (
                  <span className="text-sm text-muted first-letter:uppercase">
                    <span className="first-letter:uppercase">{day(e)}</span>
                    {e.time && ` · ${hour(e)}`}
                  </span>
                )}
                <span className={`ml-auto rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${soon ? 'bg-bad text-white' : cr ? 'bg-bad/15 text-bad' : 'bg-accent/15 text-accent'}`}>{when(e)}</span>
              </div>
              {e.message && <p className="mt-1 whitespace-pre-line text-sm text-muted">{e.message}</p>}
            </div>
          </article>
        );
      })}
    </section>
  );
}
