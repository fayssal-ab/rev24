import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { Flag } from './Flag';
import { Icon } from './Icon';
import { getModule } from '../lib/content';
import { SUBJECTS } from '../lib/catalog';
import type { Lang } from '../lib/schema';
import { BadgeToast } from './BadgeToast';
import type { UIKey } from '../i18n/ui';
import { authEnabled, signOut, useAuth, useCanSeeOral, useIsAdmin } from '../auth/auth';
import { DocumentPreview } from './ui';
import { GlobalSearch, useSearch } from './GlobalSearch';
import { Avatar } from './Avatar';
import { ChatDock, useChat, useChatEnabled } from './ChatPanel';


const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'dar', label: 'DAR', name: 'Darija' },
  { code: 'en', label: 'EN', name: 'English' }
];

/** Study tools and reference material ("Ressources" menu). */
export const TOOLS: { to: string; icon: string; key: UIKey; desc: UIKey }[] = [
  {
    to: '/preparation',
    icon: 'calendar',
    key: 'nav.prep',
    desc: 'prep.sub'
  },
  {
    to: '/supports',
    icon: 'inbox',
    key: 'nav.supports',
    desc: 'tools.library.desc'
  },
  {
    to: '/m/data/formulaire',
    icon: 'file',
    key: 'tools.dataRef',
    desc: 'tools.dataRef.desc'
  },
  {
    to: '/glossaire',
    icon: 'book',
    key: 'nav.glossary',
    desc: 'tools.glossary.desc'
  },
  {
    to: '/stats-lab',
    icon: 'sigma',
    key: 'nav.statslab',
    desc: 'home.statslab.desc'
  },
  {
    to: '/terminal',
    icon: 'terminal',
    key: 'nav.terminal',
    desc: 'home.terminal.desc'
  }
];

/** GROUP22 mark: the class photo in a ring, with a "22" badge. */
export function BrandMark({ small = false }: { small?: boolean }) {
  const sz = small ? 34 : 42;
  return (
    <span className="relative shrink-0" style={{ width: sz, height: sz }} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,rgb(var(--accent)),rgb(var(--navy)),rgb(var(--accent2)),rgb(var(--accent)))] p-[2px]">
        <img src={`${import.meta.env.BASE_URL}group22.jpg`} alt="" width={sz} height={sz} className="h-full w-full rounded-full border-2 border-bg object-cover" />
      </span>
      <span className="absolute -bottom-1 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-bg bg-accent px-0.5 font-mono text-[9px] font-bold leading-none text-white dark:text-bg">
        22
      </span>
    </span>
  );
}

/** Wordmark: GROUP in street-sign caps, 22 on a tilted sticker. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-sign uppercase leading-none ${className}`}>
      Group
      <span className="sticker inline-block rounded-[4px] bg-accent px-1.5 py-1 text-[0.82em] text-white">22</span>
    </span>
  );
}

/** Small accessible dropdown. Closes on outside click, Escape and navigation. */
function Dropdown({ label, children, active }: { label: string; children: ReactNode; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();
  useEffect(() => setOpen(false), [pathname, search]);
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
      <button className={`nav-link ${active ? 'nav-link-active' : ''} ${open ? 'text-fg' : ''}`} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}>
        {label}
        <Icon name="down" size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-line bg-surface p-2 shadow-[0_12px_32px_-12px_rgba(20,36,58,0.25)]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ to, icon, title, color }: { to: string; icon: string; title: ReactNode; color?: string }) {
  return (
    <Link to={to} role="menuitem" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-fg transition-colors hover:bg-surface2">
      <span className={`flex ${color ? '' : 'text-accent'}`} style={color ? { color } : undefined}>
        <Icon name={icon} size={18} />
      </span>
      {title}
    </Link>
  );
}

/** Language picker. `menu`: compact dropdown for the navbar; `list`: three flag buttons (menu drawer). */
function LangSwitch({ variant = 'list' }: { variant?: 'menu' | 'list' }) {
  const { t } = useT();
  const { lang, setLang } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
  const cur = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  if (variant === 'list')
    return (
      <div role="radiogroup" aria-label={t('lang.label')} className="flex gap-1 rounded-full border border-line p-0.5">
        {LANGS.map((l) => (
          <button
            key={l.code}
            role="radio"
            aria-checked={lang === l.code}
            onClick={() => setLang(l.code)}
            data-testid={`lang-${l.code}`}
            title={l.name}
            className={`flex min-h-[34px] items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] font-semibold tracking-wide transition-colors ${lang === l.code ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}
          >
            <Flag lang={l.code} size={18} /> {l.label}
          </button>
        ))}
      </div>
    );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('lang.label')} : ${cur.name}`}
        data-testid="lang-menu"
        className="flex min-h-[40px] items-center gap-2 rounded-full border border-line px-3 font-mono text-[11px] font-semibold tracking-wide transition-colors hover:border-fg/40"
      >
        <Flag lang={cur.code} size={20} />
        {cur.label}
        <Icon name="down" size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-line bg-surface p-1.5 text-fg shadow-[0_12px_32px_-12px_rgba(20,36,58,0.3)]"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                role="menuitemradio"
                aria-checked={lang === l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                data-testid={`lang-${l.code}`}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${lang === l.code ? 'bg-accent/10 font-semibold text-accent' : 'hover:bg-surface2'}`}
              >
                <Flag lang={l.code} size={24} />
                <span className="flex-1">{l.name}</span>
                {lang === l.code && <Icon name="check" size={15} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeButton() {
  const { t } = useT();
  const { theme, setTheme } = useStore();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={t('theme.toggle')}
      title={t('theme.toggle')}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  );
}

function SearchButton() {
  const { t } = useT();
  const setOpen = useSearch((s) => s.setOpen);
  return (
    <button
      onClick={() => setOpen(true)}
      className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 text-[15px] font-medium text-muted transition-colors hover:border-fg/25 hover:text-fg"
      aria-label={t('search.placeholder')}
      title="Ctrl K"
      data-testid="open-search"
    >
      <Icon name="search" size={18} />
      <span className="hidden xl:inline">{t('search.short')}</span>
    </button>
  );
}

/** Account button: avatar that opens a small menu (name, e-mail, profile, admin, sign out). */
function UserMenu() {
  const { t } = useT();
  const user = useAuth((s) => s.user);
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const name = user ? user.displayName || user.email : t('nav.profile');
  const item = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-fg transition-colors hover:bg-surface2';
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-accent text-[13px] font-bold tracking-wide text-white ring-offset-2 ring-offset-bg transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={t('auth.account')}
        aria-haspopup="menu"
        aria-expanded={open}
        title={name}
        data-testid="user-menu"
      >
        {user ? <Avatar name={name} src={user.avatar} size={40} /> : <Icon name="user" size={18} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-x-4 top-[4.75rem] z-50 rounded-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 border border-line bg-surface p-2 shadow-[0_12px_32px_-12px_rgba(20,36,58,0.25)]"
          >
            {user && (
              <div className="mb-1 flex items-center gap-3 border-b border-line px-3 pb-3 pt-2">
                <Avatar name={name} src={user.avatar} size={40} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{name}</span>
                  <span className="block truncate text-xs text-muted">{user.email}</span>
                </span>
              </div>
            )}
            <Link to="/profil" role="menuitem" className={item}>
              <Icon name="user" size={18} className="text-accent" /> {t('nav.profile')}
            </Link>
            {isAdmin && (
              <Link to="/admin" role="menuitem" className={item}>
                <Icon name="settings" size={18} className="text-accent" /> {t('nav.admin')}
              </Link>
            )}
            {authEnabled && user && (
              <button role="menuitem" className={`${item} w-full text-bad`} onClick={() => void signOut()} data-testid="user-signout">
                <Icon name="external" size={18} /> {t('auth.signout')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Private group site: signed-out visitors and accounts waiting for approval only see the sign-in / waiting page. */
const useLocked = () => useAuth((s) => authEnabled && s.user?.status !== 'approved');

export function TopBar() {
  const { t } = useT();
  const tl = useL();
  const { pathname } = useLocation();
  const canSeeOral = useCanSeeOral();
  const locked = useLocked();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [pathname]);
  const inModule = pathname.startsWith('/m/') && !pathname.endsWith('/formulaire');
  const inTools = TOOLS.some((x) => x.to !== '/supports' && pathname.startsWith(x.to));
  const isAdmin = useIsAdmin();
  return (
    <header className="streetbar sticky top-0 z-40">
      <div className="mx-auto flex h-[68px] max-w-[1760px] items-center gap-2 px-4 sm:px-6 xl:px-10 lg:h-[84px]">
        <Link to="/" className="group mr-1 flex shrink-0 items-center gap-2 sm:mr-6 sm:gap-3" aria-label={t('nav.home')}>
          <BrandMark />
          <Wordmark className="hidden text-[1.05rem] min-[360px]:inline-flex sm:text-[1.35rem] lg:text-[1.6rem]" />
        </Link>

        {!locked && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label={t('a11y.menu')}>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/supports" className={({ isActive }) => `nav-link ${isActive || pathname.endsWith('/supports') ? 'nav-link-active' : ''}`} data-testid="nav-supports">
              {t('nav.supports')}
            </NavLink>
            <Dropdown label={t('nav.modules')} active={inModule}>
              {SUBJECTS.map((s) => (
                <MenuItem key={s.id} to={s.interactive ? `/m/${s.id}` : `/supports?module=${s.id}`} icon={s.icon} title={tl(s.title)} color={s.color} />
              ))}
            </Dropdown>
            <Dropdown label={t('nav.resources')} active={inTools}>
              {TOOLS.filter((x) => x.to !== '/supports').map((x) => (
                <MenuItem key={x.to} to={x.to} icon={x.icon} title={t(x.key)} />
              ))}
            </Dropdown>
            {canSeeOral && (
              <NavLink to="/profil/oral" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} data-testid="nav-oral">
                {t('nav.presentation')}
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} data-testid="nav-admin">
                {t('nav.admin')}
              </NavLink>
            )}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {!locked && <SearchButton />}
          <span className={locked ? '' : 'hidden md:block'}>
            <LangSwitch variant="menu" />
          </span>
          <ThemeButton />
          {!locked && <UserMenu />}
          {!locked && (
            <button className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden" onClick={() => setDrawer(true)} aria-label={t('a11y.menu')} aria-expanded={drawer} data-testid="menu-open">
              <Icon name="menu" size={20} />
            </button>
          )}
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
  const isAdmin = useIsAdmin();
  const { pathname, search } = useLocation();
  const link = ({ isActive }: { isActive: boolean }) => `side-link ${isActive ? 'side-link-active' : ''}`;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  // portal: the sticky header uses backdrop-filter, which would trap a fixed child inside the header box
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-navy/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="scroll-thin fixed inset-y-0 right-0 z-50 flex w-[86vw] max-w-sm flex-col overflow-y-auto [&>*]:shrink-0 border-l border-line bg-surface p-4 lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
            aria-label={t('a11y.menu')}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BrandMark small /> <Wordmark />
              </span>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-line" onClick={onClose} aria-label={t('common.close')}>
                <Icon name="x" size={18} />
              </button>
            </div>
            {user && (
              <Link to="/profil" className="mb-4 flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-surface2" data-testid="drawer-user">
                <Avatar name={user.displayName || user.email} src={user.avatar} size={44} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{user.displayName || user.email}</span>
                  <span className="block truncate text-sm text-muted">{user.email}</span>
                </span>
              </Link>
            )}
            <NavLink to="/" end className={link}>
              <Icon name="home" size={19} /> {t('nav.home')}
            </NavLink>
            <NavLink to="/supports" className={link}>
              <Icon name="inbox" size={19} /> {t('nav.supports')}
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={link}>
                <Icon name="settings" size={19} /> {t('nav.admin')}
              </NavLink>
            )}
            <NavLink to="/profil" end className={link}>
              <Icon name="user" size={19} /> {t('nav.profile')}
            </NavLink>
            {canSeeOral && (
              <NavLink to="/profil/oral" className={link}>
                <Icon name="mic" size={19} /> {t('nav.presentation')}
              </NavLink>
            )}
            <div className="eyebrow mb-1 mt-5 px-3">{t('nav.modules')}</div>
            {SUBJECTS.map((s) => (
              <NavLink
                key={s.id}
                to={s.interactive ? `/m/${s.id}` : `/supports?module=${s.id}`}
                className={({ isActive }) => link({ isActive: s.interactive ? isActive : pathname === '/supports' && new URLSearchParams(search).get('module') === s.id })}
              >
                <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                {tl(s.title)}
              </NavLink>
            ))}
            <div className="eyebrow mb-1 mt-5 px-3">{t('nav.resources')}</div>
            {TOOLS.filter((x) => x.to !== '/supports').map((x) => (
              <NavLink key={x.to} to={x.to} className={link}>
                <Icon name={x.icon} size={19} /> {t(x.key)}
              </NavLink>
            ))}
            <div className="mt-auto space-y-3 border-t border-line pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted">{t('lang.label')}</span>
                <LangSwitch />
              </div>
              {authEnabled && !user && (
                <Link to="/connexion" className="btn-primary w-full">
                  {t('auth.signin')}
                </Link>
              )}
              {authEnabled && user && (
                <button
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-bad/40 bg-bad/[0.08] px-4 font-semibold text-bad transition-colors hover:bg-bad hover:text-white active:scale-[0.99]"
                  onClick={() => void signOut()}
                  data-testid="drawer-signout"
                >
                  <Icon name="external" size={17} /> {t('auth.signout')}
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Footer() {
  const { t } = useT();
  const tl = useL();
  const canSeeOral = useCanSeeOral();
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1760px] gap-10 px-4 py-12 sm:px-6 xl:px-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark small />
            <Wordmark className="text-base" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t('footer.about')}</p>
        </div>
        <div>
          <div className="eyebrow mb-3">{t('nav.modules')}</div>
          <ul className="space-y-2 text-sm">
            {SUBJECTS.map((s) => (
              <li key={s.id}>
                <Link to={s.interactive ? `/m/${s.id}` : `/supports?module=${s.id}`} className="text-muted hover:text-fg">
                  {tl(s.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">{t('nav.resources')}</div>
          <ul className="space-y-2 text-sm">
            {TOOLS.map((x) => (
              <li key={x.to}>
                <Link to={x.to} className="text-muted hover:text-fg">
                  {t(x.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">GROUP22</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/profil" className="text-muted hover:text-fg">
                {t('nav.progress')}
              </Link>
            </li>
            {canSeeOral && (
              <li>
                <Link to="/profil/oral" className="text-muted hover:text-fg">
                  {t('nav.oral')}
                </Link>
              </li>
            )}
          </ul>
          <p className="mt-5 flex items-start gap-2 text-xs text-muted">
            <Icon name="database" size={13} className="mt-0.5 shrink-0" /> {t(authEnabled ? 'auth.aside.l1' : 'footer.local')}
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1760px] flex-wrap justify-between gap-2 px-4 py-4 text-xs text-muted sm:px-6 xl:px-10">
          <span>GROUP22 · 4IIR · EMSI Rabat · 2026/2027</span>
          <span>{t('footer.sources')}</span>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useT();
  const location = useLocation();
  const { pathname } = location;
  const reduce = useReducedMotion();
  const locked = useLocked();
  // the chat is docked on the right: on wide screens the page makes room for it instead of being covered
  const chatWanted = useChat((s) => s.open);
  const chatEnabled = useChatEnabled();
  const chatOpen = chatWanted && chatEnabled && !locked;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className={`flex min-h-[100dvh] flex-col transition-[padding] duration-200 ${chatOpen ? 'xl:pr-[22rem]' : ''}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white">
        {t('a11y.skip')}
      </a>
      <TopBar />
      {/* enter-only transition: the new page is never blocked behind an exit animation */}
      <main id="main" key={pathname.startsWith('/m/') ? pathname.split('/').slice(0, 3).join('/') : location.key} className={`mx-auto w-full max-w-[1760px] flex-1 px-4 pt-8 sm:px-6 xl:px-10 ${reduce ? '' : 'page-in'}`}>
        <RouteErrorBoundary>{children}</RouteErrorBoundary>
      </main>
      {!locked && (
        <>
          <Footer />
          <BadgeToast />
          <DocumentPreview />
          <GlobalSearch />
          <ChatDock />
        </>
      )}
    </div>
  );
}

export function PageTitle({ title, sub, back, eyebrow, actions }: { title: ReactNode; sub?: ReactNode; back?: string; eyebrow?: ReactNode; actions?: ReactNode }) {
  const { t } = useT();
  return (
    <div className="mb-8 border-b border-line pb-6">
      {back && (
        <Link to={back} className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
          <Icon name="left" size={15} /> {t('nav.back')}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
          <h1 className="h1">{title}</h1>
          {sub && <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted">{sub}</p>}
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
