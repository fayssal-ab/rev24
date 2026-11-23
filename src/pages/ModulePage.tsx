import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useModuleContent } from '../hooks/useModule';
import { Loading, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT } from '../hooks/useT';
import { moduleMastery, weakSpots } from '../lib/mastery';
import { Ring } from '../components/Ring';
import { Icon } from '../components/Icon';
import { L } from '../components/Text';
import NotFound from './NotFound';

export default function ModulePage() {
  const id = useModuleParam();
  const { data, error } = useModuleContent(id);
  const { t } = useT();
  const st = useStore();
  const reduce = useReducedMotion();
  if (error) return <NotFound />;
  if (!data) return <Loading />;
  const weak = weakSpots(data, st);
  const m = data.module;
  // first chapter not read yet, else the last one opened
  const next = data.chapters.find((c) => !st.read[`${id}/${c.id}`]) ?? data.chapters[0];
  const started = data.chapters.some((c) => st.read[`${id}/${c.id}`] || st.chapterPos[`${id}/${c.id}`]);
  const practice = [
    { to: 'qcm', icon: 'quiz', label: t('nav.qcm'), n: data.questions.length },
    { to: 'exercices', icon: 'dumbbell', label: t('nav.exercises'), n: data.exercises.length },
    { to: 'flashcards', icon: 'cards', label: t('nav.flashcards'), n: data.flashcards.length },
    { to: 'examen', icon: 'target', label: t('nav.exam') }
  ];
  // chapter that weighs the most in the test (module.weights): shown first as the priority
  const weights = (m as { weights?: Record<string, number> }).weights ?? {};
  const top = Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0];
  const priority = top && weights[top] > 1 ? data.chapters.find((c) => c.id === top) : undefined;
  const mastery = moduleMastery(data, st);
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: m.color }} />
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <L v={m.title} />
            </h1>
            <p className="mt-2 max-w-2xl text-muted">
              <L v={m.subtitle} />
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="book" size={15} /> {data.chapters.length} {t('home.stat.chapters')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="dumbbell" size={15} /> {data.exercises.length} {t('module.exercises')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="quiz" size={15} /> {data.questions.length} {t('module.questions')}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {next && (
                <Link to={`/m/${id}/c/${next.id}`} className="btn-primary" data-testid="module-start">
                  <Icon name={started ? 'history' : 'play'} size={16} /> {started ? t('module.continue') : t('module.start')}
                </Link>
              )}
              <Link to={`/m/${id}/examen`} className="btn-ghost">
                <Icon name="target" size={16} /> {t('nav.exam')}
              </Link>
            </div>
          </div>
          <div className="hidden text-center sm:block">
            <Ring value={mastery} size={84} stroke={7} label={t('module.mastery')} />
            <div className="mt-2 text-xs font-semibold text-muted">{t('module.mastery')}</div>
          </div>
        </div>
      </section>

      {priority && (
        <Link to={`/m/${id}/c/${priority.id}`} className="group flex items-center gap-4 rounded-2xl border-2 border-accent bg-accent/[0.06] p-5 transition hover:bg-accent/[0.1]" data-testid="module-priority">
          <span className="icon-tile h-12 w-12 shrink-0 bg-accent text-white">
            <Icon name="star" size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-accent">{t('module.priority')}</span>
            <span className="mt-0.5 block text-lg font-bold">
              <L v={priority.title} />
            </span>
            <span className="mt-0.5 block text-sm text-muted">{t('module.priority.sub')}</span>
          </span>
          <Icon name="arrowRight" size={18} className="shrink-0 text-accent transition group-hover:translate-x-1" />
        </Link>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold tracking-tight">{t('module.path')}</h2>
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {data.chapters.map((c, i) => {
            const key = `${id}/${c.id}`;
            const done = st.read[key];
            const pct = done ? 100 : st.chapterPos[key]?.pct ?? 0;
            return (
              <motion.li key={c.id} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/m/${id}/c/${c.id}`} className="group flex items-center gap-4 px-4 py-4 transition hover:bg-surface2/60 sm:px-5" data-testid={`chapter-${c.id}`}>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-sm font-bold transition ${done ? 'bg-ok text-white' : pct > 0 ? 'bg-accent/10 text-accent ring-2 ring-accent' : 'bg-surface2 text-muted group-hover:bg-accent/10 group-hover:text-accent'}`}>
                    {done ? <Icon name="check" size={16} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-semibold">
                      <L v={c.title} />
                      {c.id === priority?.id && <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">{t('focus.priority')}</span>}
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-sm text-muted">
                      <L v={c.summary} />
                    </span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-3 text-xs text-muted sm:flex">
                    {pct > 0 && !done ? (
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-16 overflow-hidden rounded-full bg-surface2">
                          <span className="block h-full bg-accent" style={{ width: `${pct}%` }} />
                        </span>
                        {pct}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="clock" size={13} /> {c.estimatedMinutes} min
                      </span>
                    )}
                  </span>
                  <Icon name="right" size={16} className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-fg" />
                </Link>
              </motion.li>
            );
          })}
          {m.upcoming.map((u) => (
            <li key={u.id} className="flex items-center gap-4 px-4 py-4 opacity-55 sm:px-5" aria-disabled="true">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-dashed border-line text-muted">
                <Icon name="lock" size={14} />
              </span>
              <span className="font-semibold">
                <L v={u.title} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold tracking-tight">{t('module.practice')}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {practice.map((x) => (
            <Link key={x.to} to={`/m/${id}/${x.to}`} className="card card-hover flex items-center gap-3 p-4">
              <span className="icon-tile h-10 w-10 shrink-0 bg-accent/10 text-accent">
                <Icon name={x.icon} size={19} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{x.label}</span>
                {x.n !== undefined && <span className="text-xs text-muted">{x.n}</span>}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {weak.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight">{t('module.weak')}</h2>
          <ul className="flex flex-wrap gap-2">
            {weak.map((w) => (
              <li key={w.tag}>
                <Link to={`/m/${id}/qcm?tag=${encodeURIComponent(w.tag)}`} className="chip !text-sm hover:border-bad">
                  <span className="h-2 w-2 rounded-full bg-bad" /> {w.tag} <span className="text-[10px]">({w.wrong})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
