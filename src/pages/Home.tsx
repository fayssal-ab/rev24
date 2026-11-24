import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { moduleMastery } from '../lib/mastery';
import { Icon } from '../components/Icon';
import { ACADEMIC_YEAR, SUBJECTS } from '../lib/catalog';
import { useResources } from '../lib/resources';
import { Announcements } from '../components/Announcements';
import { UpcomingTests } from '../components/UpcomingTests';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../auth/auth';

/** Section title: poster caps with a short green bar. */
function Title({ children }: { children: string }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 font-street text-3xl uppercase tracking-[0.03em] sm:text-4xl">
      <span className="h-7 w-2 -skew-x-12 bg-accent" aria-hidden />
      {children}
    </h2>
  );
}

export default function Home() {
  const { t } = useT();
  const tl = useL();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const content = useAllModules(MODULES.map((m) => m.id));
  const st = useStore();
  const resources = useResources();
  const last = st.lastVisit;
  const lastContent = last && content?.find((c) => c.module.id === last.module);
  const lastChapter = last?.chapter ? lastContent?.chapters.find((c) => c.id === last.chapter) : undefined;
  const user = useAuth((a) => a.user);
  const first = (user?.displayName || '').trim().split(/\s+/)[0] ?? '';
  const readCount = Object.values(st.read).filter(Boolean).length;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/supports?q=${encodeURIComponent(q.trim())}` : '/supports');
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-10">
      <UpcomingTests />
      <Announcements />

      {/* cover: brand + search on the left, the class photo on the right (never upscaled, so it stays sharp) */}
      <section className="grid overflow-hidden rounded-2xl border border-line bg-[#0B2440] text-white shadow-sm lg:h-[380px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-label="GROUP 22">
        <div className="relative order-2 flex flex-col justify-center gap-5 p-6 sm:p-10 lg:order-1">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
          <span className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">EMSI Rabat · 4IIR · {ACADEMIC_YEAR}</span>
          <span className="relative flex items-center gap-3 font-sign text-5xl uppercase leading-none sm:text-6xl xl:text-7xl">
            Group
            <span className="sticker inline-block rounded-md bg-accent px-3 py-1.5 text-white">22</span>
          </span>
          <form onSubmit={submit} role="search" className="relative flex max-w-md items-center gap-2 rounded-full bg-white p-1.5 pl-4 text-[#0E1E2E] shadow-lg">
            <Icon name="search" size={18} className="shrink-0 text-[#586878]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('home.searchPh')}
              className="h-9 min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#586878]"
              aria-label={t('home.searchPh')}
              data-testid="home-search"
            />
            <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-white transition hover:bg-[#0B2440]" aria-label={t('home.search')} data-testid="home-start">
              <Icon name="arrowRight" size={16} />
            </button>
          </form>
        </div>
        <div className="relative order-1 h-52 sm:h-64 lg:order-2 lg:h-full">
          <img src={`${import.meta.env.BASE_URL}group22-banner.jpg`} alt="4IIR G22, EMSI Rabat" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2440] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0B2440] lg:via-[#0B2440]/10 lg:to-transparent" />
        </div>
      </section>

      {/* welcome strip: who I am, where I am, what to do next */}
      <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center" data-testid="home-welcome">
        <div className="flex min-w-0 items-center gap-4">
          {user ? <Avatar name={user.displayName || user.email} src={user.avatar} size={52} className="ring-2 ring-accent/30" /> : <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-accent/10 text-accent"><Icon name="user" size={24} /></span>}
          <div className="min-w-0">
            <div className="truncate font-display text-xl font-bold">
              {t('home.hello')}
              {first ? `, ${first}` : ''}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-accent">
                <Icon name="star" size={12} /> {t('prog.level')} {Math.floor(st.xp / 500) + 1} · {st.xp} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-warn/10 px-2.5 py-1 text-warn">
                <Icon name="flame" size={12} /> {st.streak.count} {t('home.days')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface2 px-2.5 py-1 text-muted">
                <Icon name="book" size={12} /> {readCount} {t('home.chaptersRead')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {last && lastContent && (
            <Link to={last.path} className="btn-primary min-w-0 justify-start sm:max-w-[22rem]" data-testid="resume">
              <Icon name="history" size={16} />
              <span className="truncate">
                {t('home.resume')} · {lastChapter ? tl(lastChapter.title) : tl(lastContent.module.title)}
              </span>
            </Link>
          )}
          <Link to="/preparation" className="btn-ghost justify-start" data-testid="home-prep">
            <Icon name="calendar" size={16} /> {t('nav.prep')}
          </Link>
        </div>
      </section>

      <section id="modules" className="scroll-mt-28">
        <Title>{t('home.others')}</Title>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((s) => {
            const c = content?.find((x) => x.module.id === s.id);
            const mastery = c ? moduleMastery(c, st) : null;
            const docs = resources.filter((r) => r.subject === s.id).length;
            return (
              <Link
                key={s.id}
                to={s.interactive ? `/m/${s.id}` : `/supports?module=${s.id}`}
                className="group flex items-center gap-4 rounded-xl border-2 border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-fg hover:shadow-[4px_4px_0_rgb(var(--fg))]"
                data-testid={`module-${s.id}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white" style={{ background: s.color }}>
                  <Icon name={s.icon} size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[1.05rem] font-semibold">{tl(s.title)}</span>
                  {mastery !== null ? (
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-surface2" title={`${mastery}%`}>
                        <span className="block h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${mastery}%` }} />
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-muted">{mastery}%</span>
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-xs text-muted">
                      {docs} {t('home.col.docs').toLowerCase()}
                    </span>
                  )}
                </span>
                <Icon name="arrowRight" size={16} className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-fg" />
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
