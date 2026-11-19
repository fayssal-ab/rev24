import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { Icon } from './Icon';
import { getModule, MODULES } from '../lib/content';
import type { Lang } from '../lib/schema';
import { BadgeToast } from './BadgeToast';
import type { UIKey } from '../i18n/ui';
import { authEnabled, signOut, useAuth, useCanSeeOral } from '../auth/auth';

const initials = (name: string) => name.split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'dar', label: 'DAR' },
  { code: 'en', label: 'EN' }
];

/** Global tools shown in the "Outils" menu of the navbar. */
export const TOOLS: { to: string; icon: string; key: UIKey; desc: UIKey }[] = [
  { to: '/bibliotheque', icon: 'inbox', key: 'nav.library', desc: 'tools.library.desc' },
  { to: '/terminal', icon: 'terminal', key: 'nav.terminal', desc: 'home.terminal.desc' },
  { to: '/stats-lab', icon: 'sigma', key: 'nav.statslab', desc: 'home.statslab.desc' },
  { to: '/glossaire', icon: 'book', key: 'nav.glossary', desc: 'tools.glossary.desc' },
  { to: '/m/data/formulaire', icon: 'file', key: 'tools.dataRef', desc: 'tools.dataRef.desc' }
];

/**
 * GROUP22 mark: an engineering hexagon in EMSI green, an open book whose spine rises into an arrow
 * (learning → progress), and a burgundy dot. The group's own mark, not the school logo.
 */
export function BrandMark({ small = false }: { small?: boolean }) {
  const sz = small ? 34 : 40;
  return (
    <svg width={sz} height={sz} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="g22hex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1fae55" />
          <stop offset="1" stopColor="#006b29" />
        </linearGradient>
      </defs>
      <path d="M32 3 L57 17.5 V46.5 L32 61 L7 46.5 V17.5 Z" fill="url(#g22hex)" />
      <path d="M32 3 L57 17.5 V46.5 L32 61 L7 46.5 V17.5 Z" fill="none" stroke="#ffffff" strokeOpacity=".18" strokeWidth="1.5" />
      {/* open book */}
      <path d="M15 40 C21 37 27 37 32 41 C37 37 43 37 49 40 V25 C43 22 37 22 32 26 C27 22 21 22 15 25 Z" fill="#ffffff" />
      <path d="M32 26 V41" stroke="#008d36" strokeWidth="2" />
      {/* rising arrow from the spine */}
      <path d="M32 22 V12 M27 16.5 L32 11.5 L37 16.5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="47" cy="47" r="4" fill="#741823" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

/** Wordmark "GROUP22": Outfit, "22" in EMSI burgundy. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${className}`}>
      GROUP<span className="text-accent2">22</span>
    </span>
  );
}

/** A small accessible dropdown used by the navbar. Closes on outside click, Escape and navigation. */
function Dropdown({ label, icon, children, active }: { label: string; icon: string; children: (close: () => void) => ReactNode; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button className={`nav-link ${active || open ? 'nav-link-active' : ''}`} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}>
        <Icon name={icon} size={16} /> {label}
        <Icon name="down" size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 w-[22rem] origin-top-left rounded-xl border border-line bg-surface p-2 shadow-xl"
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ to, icon, title, desc, color }: { to: string; icon: string; title: ReactNode; desc?: ReactNode; color?: string }) {
  return (
    <Link to={to} role="menuitem" className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-surface2">
      <span className="icon-tile h-9 w-9 text-white" style={{ background: color ?? 'rgb(var(--accent2))' }}>
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-fg">{title}</span>
        {desc && <span className="block text-xs leading-snug text-muted">{desc}</span>}
      </span>
    </Link>
  );
}

function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const { lang, setLang } = useStore();
  return (
    <div role="radiogroup" aria-label={t('lang.label')} className="flex rounded-lg border border-line bg-surface2 p-0.5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          role="radio"
          aria-checked={lang === l.code}
          onClick={() => setLang(l.code)}
          data-testid={`lang-${l.code}`}
          className={`rounded-md px-2 text-[11px] font-bold tracking-wide transition ${compact ? 'min-h-[30px]' : 'min-h-[32px]'} ${lang === l.code ? 'bg-surface text-accent shadow-sm' : 'text-muted hover:text-fg'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function ThemeButton() {
  const { t } = useT();
  const { theme, setTheme } = useStore();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t('theme.toggle')} title={t('theme.toggle')} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:text-fg">
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
    </button>
  );
}

export function TopBar() {
  const { t } = useT();
  const tl = useL();
  const { pathname } = useLocation();
  const xp = useStore((s) => s.xp);
  const user = useAuth((s) => s.user);
  const canSeeOral = useCanSeeOral();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [pathname]);
  const inModule = pathname.startsWith('/m/');
  const inTools = TOOLS.some((x) => pathname.startsWith(x.to));
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label={t('nav.home')}>
          <BrandMark />
          <span className="leading-tight">
            <Wordmark className="block text-[16px]" />
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{t('app.sub')}</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label={t('a11y.menu')}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            <Icon name="home" size={16} /> {t('nav.home')}
          </NavLink>
          <Dropdown label={t('nav.modules')} icon="grid" active={inModule}>
            {() => (
              <div className="grid gap-0.5">
                <div className="eyebrow px-2.5 pb-1 pt-1">{t('nav.modules')}</div>
                {MODULES.map((m) => (
                  <MenuItem key={m.id} to={`/m/${m.id}`} icon={m.icon} title={tl(m.title)} desc={tl(m.subtitle)} color={m.color} />
                ))}
              </div>
            )}
          </Dropdown>
          <Dropdown label={t('nav.tools')} icon="tool" active={inTools}>
            {() => (
              <div className="grid gap-0.5">
                <div className="eyebrow px-2.5 pb-1 pt-1">{t('nav.tools')}</div>
                {TOOLS.map((x) => (
                  <MenuItem key={x.to} to={x.to} icon={x.icon} title={t(x.key)} desc={t(x.desc)} />
                ))}
              </div>
            )}
          </Dropdown>
          <NavLink to="/profil" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            <Icon name="chart" size={16} /> {t('nav.progress')}
          </NavLink>
          {canSeeOral && (
            <NavLink to="/profil/oral" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} data-testid="nav-oral">
              <Icon name="mic" size={16} /> {t('nav.presentation')}
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LangSwitch />
          </div>
          <ThemeButton />
          <Link to="/profil" className="hidden items-center gap-2 rounded-lg border border-line py-1 pl-1 pr-3 transition hover:border-accent/50 sm:flex" aria-label={t('nav.profile')}>
            <span className="icon-tile h-7 w-7 bg-navy text-[11px] font-bold text-white">{user ? initials(user.displayName || user.email) : <Icon name="user" size={15} />}</span>
            <span className="leading-tight">
              {user && <span className="block max-w-[9rem] truncate text-xs font-semibold">{user.displayName || user.email}</span>}
              <span className={`block tabular-nums ${user ? 'text-[10px] text-muted' : 'text-xs font-semibold'}`}>{xp} XP</span>
            </span>
          </Link>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-line lg:hidden" onClick={() => setDrawer(true)} aria-label={t('a11y.menu')} aria-expanded={drawer} data-testid="menu-open">
            <Icon name="menu" size={18} />
          </button>
        </div>
      </div>
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT();
  const tl = useL();
  const user = useAuth((s) => s.user);
  const canSeeOral = useCanSeeOral();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="scroll-thin fixed inset-y-0 right-0 z-50 flex w-[86vw] max-w-sm flex-col overflow-y-auto border-l border-line bg-surface p-4 lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            aria-label={t('a11y.menu')}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <BrandMark small /> <Wordmark />
              </span>
              <button className="grid h-9 w-9 place-items-center rounded-lg border border-line" onClick={onClose} aria-label={t('common.close')}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <NavLink to="/" end className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}>
              <Icon name="home" size={18} /> {t('nav.home')}
            </NavLink>
            <NavLink to="/profil" className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}>
              <Icon name="user" size={18} /> {t('nav.profile')}
            </NavLink>
            {canSeeOral && (
              <NavLink to="/profil/oral" className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}>
                <Icon name="mic" size={18} /> {t('nav.presentation')}
              </NavLink>
            )}
            <div className="eyebrow mb-1 mt-4 px-3">{t('nav.modules')}</div>
            {MODULES.map((m) => (
              <NavLink key={m.id} to={`/m/${m.id}`} className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}>
                <span className="icon-tile h-7 w-7 text-white" style={{ background: m.color }}>
                  <Icon name={m.icon} size={15} />
                </span>
                {tl(m.title)}
              </NavLink>
            ))}
            <div className="eyebrow mb-1 mt-4 px-3">{t('nav.tools')}</div>
            {TOOLS.map((x) => (
              <NavLink key={x.to} to={x.to} className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}>
                <Icon name={x.icon} size={18} /> {t(x.key)}
              </NavLink>
            ))}
            <div className="mt-auto space-y-3 border-t border-line pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted">{t('lang.label')}</span>
                <LangSwitch compact />
              </div>
              {authEnabled && user && (
                <button className="btn-ghost w-full text-bad" onClick={() => void signOut()}>
                  <Icon name="external" size={16} /> {t('auth.signout')} · <span className="truncate font-normal">{user.email}</span>
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  const { t } = useT();
  const tl = useL();
  const canSeeOral = useCanSeeOral();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <BrandMark small />
            <Wordmark className="text-lg" />
          </div>
          <p className="mt-3 text-sm text-muted">{t('footer.about')}</p>
        </div>
        <div>
          <div className="eyebrow mb-3">{t('nav.modules')}</div>
          <ul className="space-y-2 text-sm">
            {MODULES.map((m) => (
              <li key={m.id}>
                <Link to={`/m/${m.id}`} className="text-muted hover:text-accent">
                  {tl(m.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">{t('nav.tools')}</div>
          <ul className="space-y-2 text-sm">
            {TOOLS.map((x) => (
              <li key={x.to}>
                <Link to={x.to} className="text-muted hover:text-accent">
                  {t(x.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">{t('nav.profile')}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/profil" className="text-muted hover:text-accent">
                {t('nav.progress')}
              </Link>
            </li>
            {canSeeOral && (
              <li>
                <Link to="/profil/oral" className="text-muted hover:text-accent">
                  {t('nav.oral')}
                </Link>
              </li>
            )}
          </ul>
          <p className="mt-4 flex items-start gap-2 text-xs text-muted">
            <Icon name="database" size={14} className="mt-0.5 shrink-0" /> {t(authEnabled ? 'auth.aside.l1' : 'footer.local')}
          </p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">GROUP22 · 4IIR G22 · EMSI Rabat · 2026/2027</div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useT();
  const location = useLocation();
  const { pathname } = location;
  const reduce = useReducedMotion();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white">
        {t('a11y.skip')}
      </a>
      <TopBar />
      {/* enter-only transition: the new page is never blocked behind an exit animation */}
      <main id="main" key={pathname.startsWith('/m/') ? pathname.split('/').slice(0, 3).join('/') : location.key} className={`mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6 ${reduce ? '' : 'page-in'}`}>
        <RouteErrorBoundary>{children}</RouteErrorBoundary>
      </main>
      <Footer />
      <BadgeToast />
    </div>
  );
}

export function PageTitle({ title, sub, back, eyebrow, actions }: { title: ReactNode; sub?: ReactNode; back?: string; eyebrow?: ReactNode; actions?: ReactNode }) {
  const { t } = useT();
  return (
    <div className="mb-6">
      {back && (
        <Link to={back} className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
          <Icon name="left" size={16} /> {t('nav.back')}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h1 className="h1">{title}</h1>
          {sub && <p className="mt-1.5 max-w-3xl text-muted">{sub}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}

export function Loading() {
  const { t } = useT();
  return (
    <div className="grid min-h-[40vh] place-items-center text-muted" role="status">
      <span className="flex items-center gap-3 text-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" /> {t('common.loading')}
      </span>
    </div>
  );
}

/** Narrow column for pages that are not inside a module. */
export function Narrow({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl">{children}</div>;
}

export function useModuleParam(): string {
  const { module } = useParams();
  const set = useStore((s) => s.setLastModule);
  useEffect(() => {
    if (module && getModule(module)) set(module);
  }, [module, set]);
  return module ?? 'linux';
}
