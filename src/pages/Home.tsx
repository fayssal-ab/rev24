import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { moduleMastery } from '../lib/mastery';
import { Ring, Bar } from '../components/Ring';
import { Icon } from '../components/Icon';
import { L } from '../components/Text';

export default function Home() {
  const { t } = useT();
  const tl = useL();
  const reduce = useReducedMotion();
  const content = useAllModules(MODULES.map((m) => m.id));
  const st = useStore();
  const masteries = content?.map((c) => moduleMastery(c, st)) ?? [];
  const global = masteries.length ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length) : 0;
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent/15 via-surface to-accent2/10 p-5 sm:p-8">
        <p className="font-mono text-xs text-muted">{t('app.student')}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Rev<span className="text-accent">24</span>
        </h1>
        <p className="mt-1 max-w-xl text-muted">{t('app.tagline')}</p>
        <div className="mt-4 flex items-center gap-4">
          <Ring value={global} size={64} label={t('home.global')} />
          <div className="flex-1">
            <div className="text-sm font-semibold">{t('home.global')}</div>
            <Bar value={global} className="mt-1" />
            <div className="mt-2 flex gap-2 text-xs text-muted">
              <span className="chip">
                <Icon name="bolt" size={14} /> {st.xp} {t('home.xp')}
              </span>
              <span className="chip">
                <Icon name="flame" size={14} /> {st.streak.count} {t('home.streak')}
              </span>
            </div>
          </div>
        </div>
        <Link to="/24h" className="btn-primary mt-5 w-full sm:w-auto" data-testid="home-24h">
          <Icon name="clock" /> {t('home.24h.title')}
        </Link>
        <p className="mt-2 text-xs text-muted">{t('home.24h.desc')}</p>
      </section>

      <section>
        <h2 className="h2 mb-3">{t('home.modules')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODULES.map((m, i) => {
            const c = content?.find((x) => x.module.id === m.id);
            return (
              <motion.div key={m.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={`/m/${m.id}`} className="card group flex h-full items-center gap-4 p-4 transition hover:border-accent" data-testid={`module-${m.id}`} data-accent={m.theme}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-bg" style={{ background: m.color }}>
                    <Icon name={m.icon} size={26} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      <L v={m.title} />
                    </span>
                    <span className="block text-sm text-muted">
                      <L v={m.subtitle} />
                    </span>
                    {c && (
                      <span className="mt-1 block text-xs text-muted">
                        {c.chapters.length} {t('module.chapters').toLowerCase()} · {c.questions.length} {t('module.questions')} · {c.exercises.length} {t('module.exercises')}
                      </span>
                    )}
                  </span>
                  <Ring value={masteries[MODULES.indexOf(m)] ?? 0} size={48} stroke={5} label={`${t('module.mastery')} ${tl(m.title)}`} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="h2 mb-3">{t('home.tools')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/terminal" className="card flex items-center gap-3 p-4 hover:border-accent">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0b1020] font-mono text-emerald-300">
              <Icon name="terminal" />
            </span>
            <span>
              <span className="block font-semibold">{t('nav.terminal')}</span>
              <span className="block text-sm text-muted">{t('home.terminal.desc')}</span>
            </span>
          </Link>
          <Link to="/stats-lab" className="card flex items-center gap-3 p-4 hover:border-accent">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/20 text-violet-400">
              <Icon name="chart" />
            </span>
            <span>
              <span className="block font-semibold">{t('nav.statslab')}</span>
              <span className="block text-sm text-muted">{t('home.statslab.desc')}</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
