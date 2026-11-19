import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { moduleMastery } from '../lib/mastery';
import { Ring } from '../components/Ring';
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
    <div className="space-y-14 pb-4">
      {/* hero */}
      <section className="relative -mx-4 -mt-6 overflow-hidden bg-navy px-4 py-12 text-white sm:-mx-6 sm:px-10 sm:py-16 lg:rounded-b-3xl">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t('home.hero.eyebrow')}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{t('home.hero.title')}</h1>
            <p className="mt-4 max-w-xl text-base text-white/75 sm:text-lg">{t('home.hero.sub')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/m/data" className="btn bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-400" data-testid="home-start">
                <Icon name="chart" size={17} /> {t('home.hero.cta')}
              </Link>
              <a href="#modules" onClick={(e) => { e.preventDefault(); document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
                {t('home.hero.cta2')} <Icon name="down" size={16} />
              </a>
            </div>
          </div>
          <div className="fade-up rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur [animation-delay:120ms]">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-1">
                <Ring value={global} size={72} stroke={7} label={t('home.global')} />
              </div>
              <div>
                <div className="text-sm text-white/70">{t('home.global')}</div>
                <div className="text-3xl font-extrabold tabular-nums">{global}%</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                { v: st.xp, k: 'XP', icon: 'bolt' },
                { v: st.streak.count, k: t('home.streak'), icon: 'flame' },
                { v: Object.values(st.read).filter(Boolean).length, k: t('prog.chaptersRead'), icon: 'book' }
              ].map((x) => (
                <div key={x.k} className="rounded-xl bg-white/5 px-2 py-3 ring-1 ring-white/10">
                  <Icon name={x.icon} size={15} className="mx-auto text-emerald-300" />
                  <div className="mt-1 text-lg font-bold tabular-nums">{x.v}</div>
                  <div className="text-[10px] leading-tight text-white/60">{x.k}</div>
                </div>
              ))}
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
