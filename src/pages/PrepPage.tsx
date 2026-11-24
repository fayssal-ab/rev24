import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MODULES, type ModuleContent } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { chapterMastery, moduleMastery } from '../lib/mastery';
import { Icon } from '../components/Icon';
import { Loading, PageTitle } from '../components/Layout';
import type { Chapter } from '../lib/schema';
import { useFocus } from '../lib/focus';

/** Weekday of each module's class in the S1 timetable (0 = Sunday): default test date = next class. */
const CLASS_DAY: Record<string, number> = { ro: 1, linux: 2, data: 3, oracle: 6, mobile: 6 };
/** Test dates announced in class (they win over the timetable guess; the student can still change them). */
const ANNOUNCED: Record<string, string> = { data: '2026-11-25' };
/** Chapters announced as not part of the test. */
const OUT: Record<string, string[]> = { data: ['d-intro', 'visu'] };
const KEY = 'g22-prep-dates';
const DAY = 86_400_000;

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
function nextClass(day: number): string {
  const d = midnight(new Date());
  while (d.getDay() !== day) d.setDate(d.getDate() + 1);
  return iso(d);
}
function readDates(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

interface DayPlan {
  date: Date;
  chapters: { c: Chapter; m: number }[];
  kind: 'study' | 'mock' | 'dday' | 'rest';
}

/** Spread the chapters that are not mastered over the days left; the eve is for the mock exam, the day itself for the Boss mode. */
function buildPlan(c: ModuleContent, st: Parameters<typeof chapterMastery>[2], test: Date, extraOut: string[] = []): { days: number; plan: DayPlan[]; todo: { c: Chapter; m: number }[] } {
  const today = midnight(new Date());
  const days = Math.round((test.getTime() - today.getTime()) / DAY);
  const out = [...(OUT[c.module.id] ?? []), ...extraOut];
  const todo = c.chapters
    .filter((ch) => !out.includes(ch.id))
    .map((ch) => ({ c: ch, m: chapterMastery(c, ch.id, st) }))
    .filter((x) => x.m < 80)
    .sort((a, b) => (c.module.weights[b.c.id] ?? 1) - (c.module.weights[a.c.id] ?? 1) || a.m - b.m);
  const plan: DayPlan[] = [];
  if (days < 0) return { days, plan, todo };
  const studyDays = Math.max(0, Math.min(days, 7) - 1);
  const per = studyDays ? Math.ceil(todo.length / studyDays) : 0;
  const start = days > 7 ? new Date(test.getTime() - 7 * DAY) : today;
  for (let k = 0; k < studyDays; k++) {
    const chunk = todo.slice(k * per, (k + 1) * per);
    plan.push({ date: new Date(start.getTime() + k * DAY), chapters: chunk, kind: chunk.length ? 'study' : 'rest' });
  }
  if (days >= 1) plan.push({ date: new Date(test.getTime() - DAY), chapters: [], kind: 'mock' });
  plan.push({ date: test, chapters: [], kind: 'dday' });
  return { days, plan, todo };
}

export default function PrepPage() {
  const { t, lang } = useT();
  const tl = useL();
  const st = useStore();
  const content = useAllModules(MODULES.map((m) => m.id));
  const [dates, setDates] = useState<Record<string, string>>(readDates);
  // the test announced by the admin (home page card) gives its module's date and out-of-test chapters
  const { focus, custom } = useFocus();
  const setDate = (id: string, v: string) => {
    const next = { ...dates, [id]: v };
    setDates(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  };
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  const dayName = (d: Date) => d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });

  const rows = useMemo(() => {
    if (!content) return [];
    return content
      .map((c) => {
        const fromAdmin = custom && focus.enabled && focus.module === c.module.id;
        const date = dates[c.module.id] || (fromAdmin && focus.date) || ANNOUNCED[c.module.id] || nextClass(CLASS_DAY[c.module.id] ?? 6);
        return { c, date, ...buildPlan(c, st, parse(date), fromAdmin ? focus.out : []), mastery: moduleMastery(c, st) };
      })
      .sort((a, b) => (a.days < 0 ? 1 : 0) - (b.days < 0 ? 1 : 0) || a.days - b.days);
  }, [content, dates, st, focus, custom]);

  if (!content) return <Loading />;
  const todayIso = iso(new Date());
  const todayTasks = rows.flatMap((r) => r.plan.filter((p) => iso(p.date) === todayIso).map((p) => ({ r, p })));

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageTitle title={t('prep.title')} sub={t('prep.sub')} />

      {/* today, across modules */}
      <section className="overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,rgb(var(--navy)),rgb(var(--accent)))] p-5 text-white shadow-sm" data-testid="prep-today">
        <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
          <Icon name="target" size={20} /> {t('prep.todayTasks')} · <span className="font-mono text-base opacity-80">{dayName(new Date())}</span>
        </h2>
        {todayTasks.length === 0 ? (
          <p className="text-white/80">{t('prep.none')}</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {todayTasks.map(({ r, p }) => (
              <div key={r.c.module.id} className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm font-bold">
                  <span className="truncate">{tl(r.c.module.title)}</span>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-mono text-xs text-[rgb(var(--navy))]">{r.days === 0 ? t('prep.dday') : `J-${r.days}`}</span>
                </div>
                <Tasks r={r} p={p} light />
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="flex items-center gap-2 text-xs text-muted">
        <Icon name="alert" size={14} /> {t('prep.hint')}
      </p>

      {rows.map((r) => {
        const passed = r.days < 0;
        return (
          <section key={r.c.module.id} className={`card overflow-hidden ${passed ? 'opacity-60' : ''}`} data-testid={`prep-${r.c.module.id}`}>
            <div className="flex flex-wrap items-center gap-4 border-b border-line p-4" style={{ borderLeft: `6px solid ${r.c.module.color}` }}>
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white" style={{ background: r.c.module.color }}>
                <span className="text-center font-mono font-black leading-tight">{passed ? '✓' : r.days === 0 ? 'J' : `J-${r.days}`}</span>
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/m/${r.c.module.id}`} className="font-display text-lg font-bold hover:text-accent">
                  {tl(r.c.module.title)}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  {t('prep.mastery')}
                  <span className="h-2 w-40 overflow-hidden rounded-full bg-surface2">
                    <motion.span className="block h-full bg-accent" initial={{ width: 0 }} animate={{ width: `${r.mastery}%` }} />
                  </span>
                  <span className="font-mono">{r.mastery}%</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted">{t('prep.date')}</span>
                <input type="date" value={r.date} onChange={(e) => e.target.value && setDate(r.c.module.id, e.target.value)} className="rounded-lg border border-line bg-surface px-2 py-1 font-mono text-sm" />
              </label>
            </div>

            {!passed && (
              <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{t('prep.weakest')}</h3>
                  {r.todo.length === 0 ? (
                    <p className="text-sm text-ok">{t('prep.allGood')}</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {r.todo.slice(0, 5).map(({ c, m }) => (
                        <li key={c.id}>
                          <Link to={`/m/${r.c.module.id}/c/${c.id}`} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-surface2">
                            <span className="h-2 w-12 shrink-0 overflow-hidden rounded-full bg-surface2">
                              <span className="block h-full" style={{ width: `${m}%`, background: `rgb(var(--${m >= 60 ? 'ok' : m >= 30 ? 'warn' : 'bad'}))` }} />
                            </span>
                            <span className="min-w-0 flex-1 truncate">{tl(c.title)}</span>
                            <span className="font-mono text-xs text-muted">{m}%</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{t('prep.plan')}</h3>
                  <ol className="relative space-y-2 border-l-2 border-line pl-5">
                    {r.plan.map((p) => {
                      const isToday = iso(p.date) === todayIso;
                      return (
                        <li key={iso(p.date)} className="relative">
                          <span className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 ${p.kind === 'dday' ? 'border-bad bg-bad' : isToday ? 'border-accent bg-accent' : 'border-line bg-surface'}`} />
                          <div className={`rounded-xl px-3 py-2 ${isToday ? 'bg-accent/10 ring-1 ring-accent/40' : 'bg-surface2/50'}`}>
                            <div className="mb-1 flex items-center gap-2 text-xs font-bold">
                              <span className="font-mono">{dayName(p.date)}</span>
                              {isToday && <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] uppercase text-white">{t('prep.today')}</span>}
                            </div>
                            <Tasks r={r} p={p} />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Tasks({ r, p, light = false }: { r: { c: ModuleContent }; p: DayPlan; light?: boolean }) {
  const { t } = useT();
  const tl = useL();
  const base = `/m/${r.c.module.id}`;
  const chip = light ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-surface hover:border-accent border border-line';
  if (p.kind === 'study')
    return (
      <div className="flex flex-wrap gap-1.5">
        {p.chapters.map(({ c, m }) => (
          <Link key={c.id} to={`${base}/c/${c.id}`} className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition ${chip}`}>
            <Icon name="book" size={12} /> <span className="max-w-[220px] truncate">{tl(c.title)}</span> <span className="font-mono opacity-70">{m}%</span>
          </Link>
        ))}
        <Link to={`${base}/exercices`} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${chip}`}>
          <Icon name="dumbbell" size={12} /> {t('nav.exercises')}
        </Link>
      </div>
    );
  if (p.kind === 'rest')
    return (
      <Link to={`${base}/qcm?mode=mistakes`} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${chip}`}>
        <Icon name="quiz" size={12} /> {t('prep.rest')}
      </Link>
    );
  return (
    <div className="flex flex-wrap gap-1.5">
      <Link to={`${base}/examen`} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${chip}`}>
        <Icon name={p.kind === 'dday' ? 'flame' : 'target'} size={12} /> {p.kind === 'dday' ? t('prep.boss') : t('prep.mock')}
      </Link>
      <Link to={`${base}/fiche`} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${chip}`}>
        <Icon name="print" size={12} /> {t('nav.sheet')}
      </Link>
    </div>
  );
}
