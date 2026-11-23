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
import { ExamFocus } from '../components/ExamFocus';

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

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/supports?q=${encodeURIComponent(q.trim())}` : '/supports');
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-10">
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

      {/* the next written test: one focus, not a list of everything */}
      <ExamFocus />

      {last && lastContent && (
        <Link to={last.path} className="group flex items-center gap-4 rounded-xl border-2 border-fg px-5 py-4 transition hover:bg-fg hover:text-bg" data-testid="resume">
          <Icon name="history" size={20} className="shrink-0 text-accent" />
          <span className="min-w-0 flex-1 truncate font-semibold">
            <span className="text-muted group-hover:text-bg/70">{t('home.resume')} · </span>
            {lastChapter ? tl(lastChapter.title) : tl(lastContent.module.title)}
          </span>
          <Icon name="arrowRight" size={16} className="shrink-0 transition group-hover:translate-x-1" />
        </Link>
      )}

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
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-surface2" title={`${mastery}%`}>
                      <span className="block h-full bg-accent" style={{ width: `${mastery}%` }} />
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
