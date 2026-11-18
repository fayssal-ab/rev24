import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { useStore } from '../store/store';
import { useT } from '../hooks/useT';
import { Icon } from './Icon';
import { getModule } from '../lib/content';
import type { Lang } from '../lib/schema';
import { BadgeToast } from './BadgeToast';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'dar', label: 'Darija' },
  { code: 'en', label: 'EN' }
];

export function TopBar() {
  const { t } = useT();
  const { lang, setLang, theme, setTheme, bilingual, setBilingual, xp, streak } = useStore();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2">
        <Link to="/" className="flex items-center gap-2 font-mono text-lg font-bold" aria-label={t('nav.home')}>
          <span className="rounded-lg bg-accent px-1.5 py-0.5 text-sm text-bg">R24</span>
          <span className="hidden sm:inline">{t('app.name')}</span>
        </Link>
        <div className="ml-1 hidden items-center gap-2 text-xs text-muted sm:flex">
          <span className="chip" title={t('home.xp')}>
            <Icon name="bolt" size={14} /> {xp} XP
          </span>
          <span className="chip" title={t('home.streak')}>
            <Icon name="flame" size={14} /> {streak.count}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div role="radiogroup" aria-label={t('lang.label')} className="flex rounded-xl border border-line bg-surface p-0.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                role="radio"
                aria-checked={lang === l.code}
                onClick={() => setLang(l.code)}
                data-testid={`lang-${l.code}`}
                className={`min-h-[36px] rounded-lg px-2 text-xs font-semibold transition ${lang === l.code ? 'bg-accent text-bg' : 'text-muted hover:text-fg'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setBilingual(!bilingual)}
            aria-pressed={bilingual}
            title={t('lang.bilingual.hint')}
            aria-label={t('lang.bilingual')}
            className={`grid h-9 w-9 place-items-center rounded-xl border border-line ${bilingual ? 'bg-accent2 text-bg' : 'bg-surface text-muted'}`}
          >
            <Icon name="globe" size={18} />
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t('theme.toggle')} className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useT();
  const lastModule = useStore((s) => s.lastModule);
  const m = lastModule || 'linux';
  const items = [
    { to: `/m/${m}`, icon: 'book', label: t('nav.course') },
    { to: `/m/${m}/qcm`, icon: 'quiz', label: t('nav.qcm') },
    { to: `/m/${m}/exercices`, icon: 'dumbbell', label: t('nav.exercises') },
    { to: '/24h', icon: 'clock', label: t('nav.24h') },
    { to: '/progression', icon: 'user', label: t('nav.profile') }
  ];
  return (
    <nav aria-label={t('a11y.menu')} className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:mx-auto md:mt-6 md:max-w-5xl md:rounded-2xl md:border">
      <ul className="mx-auto grid max-w-5xl grid-cols-5">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.to === `/m/${m}`}
              className={({ isActive }) => `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-accent' : 'text-muted hover:text-fg'}`}
            >
              <Icon name={it.icon} size={22} />
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Sets module accent colors (linux: green/cyan terminal, data: violet/blue). */
function useAccent() {
  const { pathname } = useLocation();
  const lastModule = useStore((s) => s.lastModule);
  useEffect(() => {
    const m = /^\/m\/([^/]+)/.exec(pathname)?.[1] ?? (pathname.startsWith('/stats-lab') ? 'data' : pathname.startsWith('/terminal') ? 'linux' : pathname.startsWith('/sqlplus') ? 'oracle' : pathname.startsWith('/graph-lab') ? 'ro' : lastModule);
    document.documentElement.dataset.accent = getModule(m)?.theme ?? 'terminal';
  }, [pathname, lastModule]);
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useT();
  const location = useLocation();
  const { pathname } = location;
  const reduce = useReducedMotion();
  useAccent();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <div className="min-h-[100dvh] pb-24 md:pb-8">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-bg">
        {t('a11y.skip')}
      </a>
      <TopBar />
      {/* enter-only transition: the new page is never blocked behind an exit animation */}
      <main id="main" key={location.key} className={`mx-auto max-w-5xl px-4 pt-4 ${reduce ? '' : 'page-in'}`}>
        <RouteErrorBoundary>{children}</RouteErrorBoundary>
      </main>
      <BottomNav />
      <BadgeToast />
    </div>
  );
}

export function PageTitle({ title, sub, back }: { title: ReactNode; sub?: ReactNode; back?: string }) {
  const { t } = useT();
  return (
    <div className="mb-4">
      {back && (
        <Link to={back} className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
          <Icon name="left" size={16} /> {t('nav.back')}
        </Link>
      )}
      <h1 className="h1">{title}</h1>
      {sub && <p className="mt-1 text-muted">{sub}</p>}
    </div>
  );
}

export function Loading() {
  const { t } = useT();
  return (
    <div className="grid min-h-[40vh] place-items-center text-muted" role="status">
      {t('common.loading')}
    </div>
  );
}

export function useModuleParam(): string {
  const { module } = useParams();
  const set = useStore((s) => s.setLastModule);
  useEffect(() => {
    if (module && getModule(module)) set(module);
  }, [module, set]);
  return module ?? 'linux';
}
