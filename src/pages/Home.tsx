import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { moduleMastery } from '../lib/mastery';
import { Icon } from '../components/Icon';
import { TOOLS } from '../components/Layout';

/** Data analysis comes first: it is the module the class is preparing now. */
const ORDER = ['data', 'linux', 'ro', 'oracle'];

export default function Home() {
  const { t } = useT();
  const tl = useL();
  const reduce = useReducedMotion();
  const content = useAllModules(MODULES.map((m) => m.id));
  const st = useStore();
  const masteries = Object.fromEntries((content ?? []).map((c) => [c.module.id, moduleMastery(c, st)]));
  const vals = Object.values(masteries);
  const global = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  const modules = [...MODULES].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  const last = st.lastVisit;
  const lastContent = last && content?.find((c) => c.module.id === last.module);
  const lastChapter = last?.chapter ? lastContent?.chapters.find((c) => c.id === last.chapter) : undefined;
  const lastPct = last?.chapter ? (st.read[`${last.module}/${last.chapter}`] ? 100 : st.chapterPos[`${last.module}/${last.chapter}`]?.pct ?? 0) : null;
  const fade = (i: number) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.4 } });

  return (
    <div className="space-y-16 pb-4">
      {/* hero — light, learning-platform style in the EMSI palette */}
      <section className="relative left-1/2 -mt-6 w-screen -translate-x-1/2 overflow-hidden border-b border-line bg-mint px-4 pb-14 pt-12 sm:px-10 lg:pt-16">
        <div className="dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brandlight/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-accent2/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface px-3 py-1 text-xs font-bold text-accent shadow-sm">
              <Icon name="sparkles" size={14} /> {t('home.hero.eyebrow')}
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl">
              {t('home.hero.title1')} <span className="relative whitespace-nowrap text-accent">
                {t('home.hero.title2')}
                <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 9 C50 2 150 2 198 8" fill="none" stroke="rgb(var(--brand-light))" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t('home.hero.sub')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/m/data" className="btn-primary px-6 py-3 text-base shadow-lg shadow-accent/25" data-testid="home-start">
                {t('home.hero.cta')} <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/bibliotheque" className="btn border border-line bg-surface px-6 py-3 text-base text-fg hover:border-accent/50">
                <Icon name="inbox" size={18} /> {t('nav.library')}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { v: `${global}%`, k: t('home.global') },
                { v: st.xp, k: 'XP' },
                { v: Object.values(st.read).filter(Boolean).length, k: t('prog.chaptersRead') },
                { v: st.streak.count, k: t('home.streak') }
              ].map((x) => (
                <div key={x.k}>
                  <div className="font-display text-3xl font-extrabold tabular-nums text-fg">{x.v}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted">{x.k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* floating learning cards */}
          <div className="relative hidden h-[420px] lg:block" aria-hidden>
            <div className="float absolute left-6 top-4 w-72 rounded-3xl border border-line bg-surface p-5 shadow-xl shadow-accent/10">
              <div className="flex items-center gap-3">
                <span className="icon-tile h-11 w-11 rounded-2xl bg-accent text-white">
                  <Icon name="chart" size={20} />
                </span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-accent2">{t('home.card.next')}</div>
                  <div className="font-display font-bold">Tests d&apos;hypothèses</div>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface2">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-accent to-brandlight" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>Chap 5</span>
                <span>66%</span>
              </div>
            </div>
            <div className="float-slow absolute right-0 top-36 w-64 rounded-3xl border border-line bg-surface p-5 shadow-xl shadow-accent2/10">
              <div className="text-xs font-bold uppercase tracking-wide text-muted">QCM</div>
              <div className="mt-2 font-display text-lg font-bold">Z0 = 3,125 → ?</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-3 py-2 font-semibold text-accent">
                  <Icon name="checkCircle" size={16} /> Rejeter H0
                </div>
                <div className="rounded-xl border border-line px-3 py-2 text-muted">Ne pas rejeter</div>
              </div>
            </div>
            <div className="float absolute bottom-2 left-16 flex w-60 items-center gap-3 rounded-3xl bg-navy p-4 text-white shadow-xl [animation-delay:-3s]">
              <span className="icon-tile h-11 w-11 rounded-2xl bg-white/15">
                <Icon name="award" size={20} />
              </span>
              <div>
                <div className="font-display font-bold">+40 XP</div>
                <div className="text-xs text-white/70">{t('home.card.exercise')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* resume */}
      {last && lastContent && (
        <motion.section {...fade(0)}>
          <Link to={last.path} className="card card-hover flex items-center gap-4 p-4 sm:p-5" data-testid="resume">
            <span className="icon-tile h-12 w-12 text-white" style={{ background: lastContent.module.color }}>
              <Icon name="history" size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="eyebrow">{t('home.resume')}</span>
              <span className="mt-0.5 block truncate font-semibold">{lastChapter ? tl(lastChapter.title) : tl(lastContent.module.title)}</span>
              <span className="block text-xs text-muted">{tl(lastContent.module.title)}</span>
              {lastPct !== null && (
                <span className="mt-2 block h-1.5 max-w-sm overflow-hidden rounded-full bg-surface2">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${lastPct}%` }} />
                </span>
              )}
            </span>
            <span className="btn-primary hidden sm:inline-flex">
              {t('module.continue')} <Icon name="arrowRight" size={16} />
            </span>
          </Link>
        </motion.section>
      )}

      {/* modules */}
      <section id="modules" className="scroll-mt-24">
        <div className="mb-5">
          <div className="eyebrow">{t('nav.modules')}</div>
          <h2 className="mt-1 text-2xl font-bold">{t('home.modules')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m, i) => {
            const c = content?.find((x) => x.module.id === m.id);
            const v = masteries[m.id] ?? 0;
            return (
              <motion.div key={m.id} {...fade(i)}>
                <Link to={`/m/${m.id}`} className="card card-hover group relative flex h-full flex-col overflow-hidden p-5" data-testid={`module-${m.id}`}>
                  <span className="absolute inset-x-0 top-0 h-1" style={{ background: m.color }} />
                  <div className="flex items-start gap-4">
                    <span className="icon-tile h-12 w-12 text-white" style={{ background: m.color }}>
                      <Icon name={m.icon} size={24} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold">{tl(m.title)}</span>
                      <span className="block text-sm text-muted">{tl(m.subtitle)}</span>
                    </span>
                    {m.id === 'data' && <span className="chip !border-accent/40 !bg-accent/10 !text-accent">Focus</span>}
                  </div>
                  {c && (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="book" size={13} /> {c.chapters.length} {t('home.stat.chapters')}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon name="quiz" size={13} /> {c.questions.length} {t('module.questions')}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon name="dumbbell" size={13} /> {c.exercises.length} {t('module.exercises')}
                      </span>
                    </div>
                  )}
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">{t('module.mastery')}</span>
                      <span className="font-semibold tabular-nums">{v}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2">
                      <motion.div className="h-full rounded-full" style={{ background: m.color }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                    </div>
                  </div>
                  <Icon name="arrowRight" size={18} className="absolute bottom-5 right-5 text-muted opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* method */}
      <section>
        <div className="mb-5">
          <div className="eyebrow">{t('home.method')}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: 'book', k: 'home.m1', d: 'home.m1.d' },
            { icon: 'sigma', k: 'home.m2', d: 'home.m2.d' },
            { icon: 'target', k: 'home.m3', d: 'home.m3.d' }
          ].map((x, i) => (
            <motion.div key={x.k} {...fade(i)} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="icon-tile h-10 w-10 bg-accent/10 text-accent">
                  <Icon name={x.icon} size={20} />
                </span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{t(x.k as 'home.m1')}</h3>
              <p className="mt-1 text-sm text-muted">{t(x.d as 'home.m1.d')}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* tools */}
      <section>
        <div className="mb-5">
          <div className="eyebrow">{t('nav.tools')}</div>
          <h2 className="mt-1 text-2xl font-bold">{t('home.tools')}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((x, i) => (
            <motion.div key={x.to} {...fade(i)}>
              <Link to={x.to} className="card card-hover flex h-full flex-col gap-3 p-4">
                <span className="icon-tile h-10 w-10 bg-navy text-white">
                  <Icon name={x.icon} size={19} />
                </span>
                <span>
                  <span className="block font-semibold">{t(x.key)}</span>
                  <span className="block text-sm text-muted">{t(x.desc)}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
