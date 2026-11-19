import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useModuleContent } from '../hooks/useModule';
import { Loading, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT } from '../hooks/useT';
import { chapterMastery, moduleMastery, weakSpots } from '../lib/mastery';
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
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: m.color }} />
        <div className="flex flex-wrap items-center gap-6">
          <div className="min-w-0 flex-1">
            <div className="eyebrow">{t('nav.modules')}</div>
            <h1 className="h1 mt-1">
              <L v={m.title} />
            </h1>
            <p className="mt-1.5 text-muted">
              <L v={m.subtitle} />
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="book" size={15} /> {data.chapters.length} {t('home.stat.chapters')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="quiz" size={15} /> {data.questions.length} {t('module.questions')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="dumbbell" size={15} /> {data.exercises.length} {t('module.exercises')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="cards" size={15} /> {data.flashcards.length} {t('module.flashcards')}
              </span>
            </div>
            {next && (
              <Link to={`/m/${id}/c/${next.id}`} className="btn-primary mt-6" data-testid="module-start">
                <Icon name={started ? 'history' : 'play'} size={16} /> {started ? t('module.continue') : t('module.start')}
              </Link>
            )}
          </div>
          <div className="text-center">
            <Ring value={moduleMastery(data, st)} size={96} stroke={8} label={t('module.mastery')} />
            <div className="mt-2 text-xs font-semibold text-muted">{t('module.mastery')}</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="h2 mb-4">{t('module.path')}</h2>
        <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-line">
          {data.chapters.map((c, i) => {
            const key = `${id}/${c.id}`;
            const done = st.read[key];
            const pct = done ? 100 : st.chapterPos[key]?.pct ?? 0;
            return (
              <motion.li key={c.id} initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative">
                <Link to={`/m/${id}/c/${c.id}`} className="group flex items-start gap-4" data-testid={`chapter-${c.id}`}>
                  <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-bold transition ${done ? 'border-ok bg-ok text-white' : pct > 0 ? 'border-accent bg-surface text-accent' : 'border-line bg-surface text-muted group-hover:border-accent'}`}>
                    {done ? <Icon name="check" size={17} /> : i + 1}
                  </span>
                  <span className="card card-hover flex min-w-0 flex-1 items-center gap-4 p-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        <L v={c.title} />
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-muted">
                        <L v={c.summary} />
                      </span>
                      <span className="mt-2 flex items-center gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="clock" size={13} /> {c.estimatedMinutes} {t('module.minutes')}
                        </span>
                        {pct > 0 && !done && (
                          <span className="flex items-center gap-2">
                            <span className="h-1 w-20 overflow-hidden rounded-full bg-surface2">
                              <span className="block h-full bg-accent" style={{ width: `${pct}%` }} />
                            </span>
                            {pct}%
                          </span>
                        )}
                      </span>
                    </span>
                    <Ring value={chapterMastery(data, c.id, st)} size={42} stroke={4} />
                  </span>
                </Link>
              </motion.li>
            );
          })}
          {m.upcoming.map((u) => (
            <li key={u.id} className="relative flex items-center gap-4 opacity-60" aria-disabled="true">
              <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-line bg-surface text-muted">
                <Icon name="lock" size={15} />
              </span>
              <span className="card flex-1 p-4">
                <span className="block font-semibold">
                  <L v={u.title} />
                </span>
                <span className="text-xs text-muted">{t('common.locked')}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="h2 mb-4">{t('module.practice')}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {practice.map((x) => (
            <Link key={x.to} to={`/m/${id}/${x.to}`} className="card card-hover flex flex-col gap-3 p-4">
              <span className="icon-tile h-10 w-10 bg-accent/10 text-accent">
                <Icon name={x.icon} size={19} />
              </span>
              <span>
                <span className="block font-semibold">{x.label}</span>
                {x.n !== undefined && <span className="text-xs text-muted">{x.n}</span>}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="h2 mb-3">{t('module.weak')}</h2>
        {weak.length ? (
          <ul className="flex flex-wrap gap-2">
            {weak.map((w) => (
              <li key={w.tag}>
                <Link to={`/m/${id}/qcm?tag=${encodeURIComponent(w.tag)}`} className="chip !text-sm hover:border-bad">
                  <span className="h-2 w-2 rounded-full bg-bad" /> {w.tag} <span className="text-[10px]">({w.wrong})</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">{t('module.weak.none')}</p>
        )}
      </section>
    </div>
  );
}
