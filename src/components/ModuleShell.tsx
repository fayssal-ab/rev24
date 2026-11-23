import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useModuleContent } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { getModule } from '../lib/content';
import { moduleMastery } from '../lib/mastery';
import type { ModuleContent } from '../lib/content';
import { Icon } from './Icon';
import { Ring } from './Ring';
import { Loading } from './Layout';
import NotFound from '../pages/NotFound';
import type { UIKey } from '../i18n/ui';

const PRACTICE: { to: string; icon: string; key: UIKey; count?: (d: ModuleContent) => number }[] = [
  { to: 'qcm', icon: 'quiz', key: 'nav.qcm', count: (d) => d.questions.length },
  { to: 'exercices', icon: 'dumbbell', key: 'nav.exercises', count: (d) => d.exercises.length },
  { to: 'flashcards', icon: 'cards', key: 'nav.flashcards', count: (d) => d.flashcards.length },
  { to: 'examen', icon: 'target', key: 'nav.exam' }
];
const RESOURCES: { to: string; icon: string; key: UIKey }[] = [
  { to: 'supports', icon: 'inbox', key: 'sup.title' },
  { to: 'fiche', icon: 'print', key: 'nav.sheet' },
  { to: 'formulaire', icon: 'file', key: 'nav.reference' }
];

/** Sidebar content (shared by the desktop column and the mobile sheet). */
function SidebarBody({ id, data }: { id: string; data: ModuleContent }) {
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const m = data.module;
  const mastery = moduleMastery(data, st);
  return (
    <div className="space-y-5">
      <Link to={`/m/${id}`} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 transition hover:border-accent/50">
        <span className="icon-tile h-10 w-10 text-white" style={{ background: m.color }}>
          <Icon name={m.icon} size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{tl(m.title)}</span>
          <span className="block text-[11px] text-muted">
            {t('module.mastery')} · {mastery}%
          </span>
        </span>
        <Ring value={mastery} size={34} stroke={4} />
      </Link>

      <div>
        <div className="eyebrow mb-1.5 px-3">{t('module.chapters')}</div>
        <ol className="space-y-0.5">
          {data.chapters.map((c, i) => {
            const key = `${id}/${c.id}`;
            const done = st.read[key];
            const pct = done ? 100 : st.chapterPos[key]?.pct ?? 0;
            return (
              <li key={c.id}>
                <NavLink to={`/m/${id}/c/${c.id}`} className={({ isActive }) => `side-link !items-start ${isActive ? 'side-link-active' : ''}`} data-testid={`side-chapter-${c.id}`}>
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${done ? 'border-ok bg-ok text-white' : pct > 0 ? 'border-accent text-accent' : 'border-line text-muted'}`}>
                    {done ? <Icon name="check" size={12} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 leading-snug">{tl(c.title)}</span>
                    {pct > 0 && !done && (
                      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-surface2">
                        <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </span>
                    )}
                  </span>
                </NavLink>
              </li>
            );
          })}
          {m.upcoming.map((u) => (
            <li key={u.id} className="side-link cursor-default opacity-50" aria-disabled="true">
              <Icon name="lock" size={14} /> <span className="line-clamp-1">{tl(u.title)}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <div className="eyebrow mb-1.5 px-3">{t('module.practice')}</div>
        {PRACTICE.map((x) => (
          <NavLink key={x.to} to={`/m/${id}/${x.to}`} className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`} data-testid={`side-${x.to}`}>
            <Icon name={x.icon} size={17} /> <span className="flex-1">{t(x.key)}</span>
            {x.count && <span className="rounded-md bg-surface2 px-1.5 text-[11px] font-semibold tabular-nums text-muted">{x.count(data)}</span>}
          </NavLink>
        ))}
      </div>

      <div>
        <div className="eyebrow mb-1.5 px-3">{t('module.resources')}</div>
        {RESOURCES.map((x) => (
          <NavLink key={x.to} to={`/m/${id}/${x.to}`} className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}>
            <Icon name={x.icon} size={17} /> {t(x.key)}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

/**
 * Frame for every page of a module: a sticky sidebar (chapters, practice, resources) on desktop,
 * a sticky tab bar + slide-up contents sheet on mobile. The practice links are therefore always reachable.
 */
export default function ModuleShell() {
  const { module: id = '' } = useParams();
  const { data, error } = useModuleContent(id);
  const { pathname } = useLocation();
  const { t } = useT();
  const tl = useL();
  const reduce = useReducedMotion();
  const setLast = useStore((s) => s.setLastModule);
  const setLastVisit = useStore((s) => s.setLastVisit);
  const [sheet, setSheet] = useState(false);
  useEffect(() => setSheet(false), [pathname]);
  useEffect(() => {
    if (getModule(id)) {
      setLast(id);
      const chapter = /\/c\/([^/]+)/.exec(pathname)?.[1];
      setLastVisit({ path: pathname, module: id, chapter });
    }
  }, [id, pathname, setLast, setLastVisit]);
  if (!getModule(id) || error) return <NotFound />;
  if (!data) return <Loading />;
  const tabs = [{ to: `/m/${id}`, icon: 'compass', key: 'module.overview' as UIKey, end: true }, ...PRACTICE.map((x) => ({ to: `/m/${id}/${x.to}`, icon: x.icon, key: x.key, end: false }))];
  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 2xl:grid-cols-[19rem_minmax(0,1fr)] 2xl:gap-12">
      <aside className="scroll-thin sticky top-28 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6 pr-1 lg:block" aria-label={tl(data.module.title)}>
        <SidebarBody id={id} data={data} />
      </aside>

      {/* mobile: sticky module bar */}
      <div className="sticky top-[72px] z-30 -mx-4 mb-4 border-b border-line bg-bg/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-2">
          <button className="btn-ghost btn-sm shrink-0" onClick={() => setSheet(true)} data-testid="module-contents">
            <Icon name="sidebar" size={15} /> {t('module.contents')}
          </button>
          <nav className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto" aria-label={tl(data.module.title)}>
            {tabs.map((x) => (
              <NavLink key={x.to} to={x.to} end={x.end} className={({ isActive }) => `flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${isActive ? 'bg-accent/10 text-accent' : 'text-muted'}`}>
                <Icon name={x.icon} size={14} /> {t(x.key)}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              className="scroll-thin fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-line bg-bg p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
              <SidebarBody id={id} data={data} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div key={pathname} className={`min-w-0 ${reduce ? '' : 'page-in'}`}>
        <Outlet />
      </div>
    </div>
  );
}
