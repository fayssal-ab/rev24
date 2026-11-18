import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
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
  const tools = [
    { to: 'qcm', icon: 'quiz', label: t('nav.qcm'), n: data.questions.length },
    { to: 'exercices', icon: 'dumbbell', label: t('nav.exercises'), n: data.exercises.length },
    { to: 'flashcards', icon: 'cards', label: t('nav.flashcards'), n: data.flashcards.length },
    { to: 'examen', icon: 'target', label: t('nav.exam') },
    { to: 'fiche', icon: 'print', label: t('nav.sheet') },
    { to: 'formulaire', icon: 'search', label: t('nav.reference'), n: data.reference.length }
  ];
  return (
    <div className="space-y-6">
      <PageTitle back="/" title={<L v={data.module.title} />} sub={<L v={data.module.subtitle} />} />
      <div className="card flex items-center gap-4 p-4">
        <Ring value={moduleMastery(data, st)} size={72} stroke={7} label={t('module.mastery')} />
        <div className="text-sm text-muted">
          <div className="font-semibold text-fg">{t('module.mastery')}</div>
          {data.questions.length} {t('module.questions')} · {data.exercises.length} {t('module.exercises')} · {data.flashcards.length} {t('module.flashcards')}
          {data.missions.length > 0 && ` · ${data.missions.length} ${t('module.missions')}`}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {tools.map((x) => (
          <Link key={x.to} to={`/m/${id}/${x.to}`} className="card flex flex-col items-center gap-1 p-3 text-center text-xs font-medium hover:border-accent">
            <Icon name={x.icon} className="text-accent" />
            {x.label}
            {x.n !== undefined && <span className="text-[10px] text-muted">{x.n}</span>}
          </Link>
        ))}
      </div>

      <section>
        <h2 className="h2 mb-3">{t('module.chapters')}</h2>
        <ol className="grid gap-2">
          {[...data.chapters.map((c) => ({ o: c.order, c })), ...data.module.upcoming.map((u, k) => ({ o: u.order ?? 1000 + k, u }))]
            .sort((x, y) => x.o - y.o)
            .map((it, i) =>
              'c' in it && it.c ? (
                <motion.li key={it.c.id} initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to={`/m/${id}/c/${it.c.id}`} className="card flex items-center gap-3 p-3 hover:border-accent" data-testid={`chapter-${it.c.id}`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface2 font-mono text-sm">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        <L v={it.c.title} />
                      </span>
                      <span className="line-clamp-2 block text-xs text-muted">
                        <L v={it.c.summary} />
                      </span>
                      <span className="mt-1 block text-[11px] text-muted">
                        ~{it.c.estimatedMinutes} {t('common.minutes')} {st.read[`${id}/${it.c.id}`] && <span className="text-ok">· ✓ {t('chapter.done')}</span>}
                      </span>
                    </span>
                    <Ring value={chapterMastery(data, it.c.id, st)} size={44} stroke={4} />
                  </Link>
                </motion.li>
              ) : 'u' in it && it.u ? (
                <li key={it.u.id} className="card flex items-center gap-3 p-3 opacity-60" aria-disabled="true">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface2">
                    <Icon name="lock" size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">
                      <L v={it.u.title} />
                    </span>
                    <span className="text-xs text-muted">{t('common.locked')}</span>
                  </span>
                </li>
              ) : null
            )}
        </ol>
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
