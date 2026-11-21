import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { moduleMastery } from '../lib/mastery';
import { Icon } from '../components/Icon';
import { TOOLS } from '../components/Layout';
import { KIND_LABEL, ResourceList, SectionHeader, callCode } from '../components/ui';
import { ACADEMIC_YEAR, FILIERE, KINDS, SEMESTER, SUBJECTS, countByKind } from '../lib/catalog';
import { useResources } from '../lib/resources';
import { Announcements } from '../components/Announcements';

/** Eight-pointed zellige star outline, used as a quiet ornament. */
function Khatam({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="0.35">
        <rect x="7" y="7" width="26" height="26" />
        <rect x="7" y="7" width="26" height="26" transform="rotate(45 20 20)" />
        <rect x="11.5" y="11.5" width="17" height="17" />
        <rect x="11.5" y="11.5" width="17" height="17" transform="rotate(45 20 20)" />
        <circle cx="20" cy="20" r="4.5" />
      </g>
    </svg>
  );
}

export default function Home() {
  const { t } = useT();
  const tl = useL();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const content = useAllModules(MODULES.map((m) => m.id));
  const st = useStore();
  const RESOURCES = useResources();
  const resourcesOf = (id: string) => RESOURCES.filter((r) => r.subject === id);
  const recent = RESOURCES.filter((r) => r.date)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 6);
  const kindCount = countByKind(RESOURCES);
  const last = st.lastVisit;
  const lastContent = last && content?.find((c) => c.module.id === last.module);
  const lastChapter = last?.chapter ? lastContent?.chapters.find((c) => c.id === last.chapter) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/supports?q=${encodeURIComponent(q.trim())}` : '/supports');
  };

  return (
    <div className="space-y-20">
      <Announcements />
      {/* the class, on the cover */}
      <section className="relative -mb-8 overflow-hidden rounded-3xl border border-line" aria-label="GROUP 22">
        <img src={`${import.meta.env.BASE_URL}group22-banner.jpg`} alt="4IIR G22, EMSI Rabat" className="h-48 w-full object-cover object-[50%_35%] sm:h-64" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--navy)/0.92)] via-[rgb(var(--navy)/0.55)] to-transparent" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center gap-2 px-6 sm:px-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">EMSI Rabat · 4IIR · {ACADEMIC_YEAR}</span>
          <span className="flex items-center gap-3 font-display text-5xl font-extrabold uppercase leading-none tracking-[0.06em] text-white sm:text-7xl">
            Group
            <span className="rounded-xl bg-accent px-3 py-1.5 font-mono tracking-normal text-white">22</span>
          </span>
        </div>
      </section>

      {/* hero */}
      <section className="relative grid grid-cols-[minmax(0,1fr)] gap-12 pb-4 pt-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <Khatam className="pointer-events-none absolute -right-24 -top-16 hidden h-[34rem] w-[34rem] text-accent/[0.09] lg:block" />
        <div className="relative">
          <div className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-accent">N° 22</span>
            <span className="h-px w-8 bg-line" />
            {t('home.hero.eyebrow')}
          </div>
          <h1 className="mt-6 font-display text-[2.2rem] min-[360px]:text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[4.2rem]">
            {t('home.hero.titleA')}{' '}
            <em className="relative font-serif min-[360px]:whitespace-nowrap text-[1.12em] font-normal tracking-[-0.01em] text-accent">
              {t('home.hero.titleB')}
              <svg viewBox="0 0 300 18" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-accent2" aria-hidden>
                <path className="draw" pathLength={1} d="M3 12 C 60 4, 120 3, 170 8 S 260 14, 297 5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </em>
          </h1>
          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-muted">{t('home.hero.sub')}</p>

          <form onSubmit={submit} className="mt-10 max-w-xl" role="search">
            <div className="flex items-center gap-3 border-b-2 border-fg pb-2 transition-colors focus-within:border-accent">
              <Icon name="search" size={20} className="shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('home.searchPh')}
                className="h-11 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted/80"
                aria-label={t('home.searchPh')}
                data-testid="home-search"
              />
              <button className="btn-primary" data-testid="home-start">
                <span className="hidden sm:inline">{t('home.search')}</span> <Icon name="arrowRight" size={15} />
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2 pl-8 font-hand text-xl leading-none text-accent2">
              <svg width="26" height="20" viewBox="0 0 26 20" className="-mt-1 shrink-0" aria-hidden>
                <path d="M24 18 C 16 17, 8 12, 4 3 M4 3 L 2 9 M4 3 L 10 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {t('home.hint')}
            </div>
          </form>

          <div className="mt-8 flex flex-wrap gap-2">
            {(['cours', 'td', 'tp', 'controle'] as const).map((k) => (
              <Link key={k} to={`/supports?type=${k}`} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-fg hover:text-fg">
                {t(KIND_LABEL[k])} <span className="ml-1 font-mono text-[11px] text-muted">{kindCount[k]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* the semester, written on a notebook page */}
        <nav aria-label={t('home.notebook')} className="relative self-start lg:mt-6">
          <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.2deg] rounded-sm border border-line bg-surface2" aria-hidden />
          <div className="ruled relative -rotate-[0.6deg] rounded-sm border border-line pb-5 pt-3 shadow-[0_18px_40px_-24px_rgba(25,23,20,0.45)]">
            <div className="flex h-10 items-end justify-between gap-3 pl-14 pr-5">
              <span className="truncate font-hand text-[1.7rem] leading-none text-accent">{t('home.notebook')}</span>
              <span className="hidden shrink-0 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
                {FILIERE.id} · {SEMESTER.id} · {ACADEMIC_YEAR}
              </span>
            </div>
            <ol>
              {SUBJECTS.map((s, i) => (
                <li key={s.id}>
                  <Link to={s.interactive ? `/m/${s.id}` : `/supports?module=${s.id}`} className="group flex h-10 items-end gap-3 pl-3 pr-5">
                    <span className="w-8 pb-2 text-right font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 truncate pb-1.5 pl-3 font-display text-[1.05rem] text-fg transition-colors group-hover:text-accent">{tl(s.title)}</span>
                    <span className="shrink-0 pb-2 font-mono text-[10px] text-muted">
                      {callCode(s.id)} · {resourcesOf(s.id).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </section>

      {/* resume where the student stopped */}
      {last && lastContent && (
        <Link to={last.path} className="group flex items-center gap-5 rounded-lg bg-fg px-6 py-5 text-bg transition-colors hover:bg-accent" data-testid="resume">
          <Icon name="history" size={20} className="shrink-0 text-accent2 group-hover:text-bg" />
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-bg/60">{t('home.resume')}</span>
            <span className="mt-1 block truncate font-display text-xl">
              {lastChapter ? tl(lastChapter.title) : tl(lastContent.module.title)} <span className="italic text-bg/60">· {tl(lastContent.module.title)}</span>
            </span>
          </span>
          <span className="hidden items-center gap-2 text-sm font-semibold sm:flex">
            {t('module.continue')} <Icon name="arrowRight" size={15} />
          </span>
        </Link>
      )}

      {/* recently added */}
      <section>
        <SectionHeader
          n={1}
          title={t('home.recent')}
          action={
            <Link to="/supports" className="shrink-0 text-sm font-semibold text-accent hover:underline">
              {t('home.seeAll')} <span className="font-mono text-xs">({RESOURCES.length})</span>
            </Link>
          }
        />
        <ResourceList items={recent} />
      </section>

      {/* modules */}
      <section id="modules" className="scroll-mt-24">
        <SectionHeader n={2} title={t('home.modules')} />
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((s) => {
            const c = content?.find((x) => x.module.id === s.id);
            const to = s.interactive ? `/m/${s.id}` : `/supports?module=${s.id}`;
            const mastery = c ? moduleMastery(c, st) : null;
            return (
              <Link key={s.id} to={to} className="group relative flex min-h-[11rem] flex-col bg-surface p-6 transition-colors hover:bg-bg" data-testid={`module-${s.id}`}>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-muted">{callCode(s.id)}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-accent transition-colors group-hover:border-transparent group-hover:bg-accent group-hover:text-white">
                    <Icon name={s.icon} size={16} />
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-medium leading-snug group-hover:text-accent">{tl(s.title)}</h3>
                {s.subtitle && <p className="mt-1 line-clamp-2 text-sm text-muted">{tl(s.subtitle)}</p>}
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-5 font-mono text-[11px] text-muted">
                  <span>
                    {resourcesOf(s.id).length} {t('home.col.docs').toLowerCase()}
                  </span>
                  {c && (
                    <span>
                      · {c.chapters.length} ch. · {c.questions.length} QCM
                    </span>
                  )}
                  {mastery !== null && (
                    <span className="ml-auto flex items-center gap-2">
                      <span className="h-1 w-12 overflow-hidden rounded-full bg-surface2">
                        <span className="block h-full bg-accent" style={{ width: `${mastery}%` }} />
                      </span>
                      {mastery}%
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* browse by type */}
      <section>
        <SectionHeader n={3} title={t('home.byType')} />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {KINDS.map((k) => (
            <Link key={k} to={`/supports?type=${k}`} className="group bg-surface p-5 transition-colors hover:bg-fg hover:text-bg">
              <div className="font-display text-5xl font-light tabular-nums tracking-tight">{kindCount[k]}</div>
              <div className="mt-3 flex items-center justify-between gap-2 text-sm text-muted group-hover:text-bg/80">
                <span className="truncate">{t(KIND_LABEL[k])}</span> <Icon name="arrowRight" size={13} className="shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* study tools */}
      <section>
        <SectionHeader n={4} title={t('home.tools')} />
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {TOOLS.filter((x) => x.to !== '/supports').map((x) => (
            <li key={x.to} className="border-b border-line">
              <Link to={x.to} className="group flex items-start gap-4 py-5">
                <Icon name={x.icon} size={18} className="mt-1 text-accent" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg group-hover:text-accent">{t(x.key)}</span>
                  <span className="block text-sm text-muted">{t(x.desc)}</span>
                </span>
                <Icon name="arrowRight" size={15} className="mt-1.5 text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
