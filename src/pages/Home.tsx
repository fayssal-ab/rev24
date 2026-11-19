import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { moduleMastery } from '../lib/mastery';
import { Icon } from '../components/Icon';
import { TOOLS } from '../components/Layout';
import { KIND_LABEL, ResourceList, SectionHeader } from '../components/ui';
import { ACADEMIC_YEAR, FILIERE, KINDS, RESOURCES, SEMESTER, SUBJECTS, YEAR_OF_STUDY, countByKind, recentResources, resourcesOf } from '../lib/catalog';

export default function Home() {
  const { t } = useT();
  const tl = useL();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const content = useAllModules(MODULES.map((m) => m.id));
  const st = useStore();
  const kindCount = countByKind(RESOURCES);
  const last = st.lastVisit;
  const lastContent = last && content?.find((c) => c.module.id === last.module);
  const lastChapter = last?.chapter ? lastContent?.chapters.find((c) => c.id === last.chapter) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/explorer?q=${encodeURIComponent(q.trim())}` : '/explorer');
  };

  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="grid gap-10 border-b border-line pb-14 pt-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="eyebrow">{t('home.hero.eyebrow')}</div>
          <h1 className="mt-4 max-w-2xl font-display text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-fg sm:text-[3.25rem]">{t('home.hero.title')}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{t('home.hero.sub')}</p>
          <form onSubmit={submit} className="mt-8 flex max-w-xl items-center gap-2 rounded-lg border border-line bg-surface p-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15" role="search">
            <Icon name="search" size={18} className="ml-2 shrink-0 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('home.searchPh')} className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted" aria-label={t('home.searchPh')} data-testid="home-search" />
            <button className="btn-primary" data-testid="home-start">
              {t('home.search')}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {(['cours', 'td', 'tp', 'controle'] as const).map((k) => (
              <Link key={k} to={`/explorer?type=${k}`} className="text-muted underline decoration-line underline-offset-4 hover:text-fg hover:decoration-fg">
                {t(KIND_LABEL[k])}
              </Link>
            ))}
          </div>
        </div>

        {/* academic navigation: filière → year → semester → modules */}
        <nav aria-label={t('home.academic')} className="self-start rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-5 py-4">
            <div className="eyebrow">{t('home.academic')}</div>
          </div>
          <dl className="divide-y divide-line text-sm">
            {[
              [t('explore.filiere'), `${FILIERE.id} · ${tl(FILIERE.title)}`],
              [t('explore.year'), `${tl(YEAR_OF_STUDY)} · ${ACADEMIC_YEAR}`],
              [t('explore.semester'), tl(SEMESTER.title)]
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="border-t border-line px-2 py-2">
            {SUBJECTS.map((s) => (
              <li key={s.id}>
                <Link to={s.interactive ? `/m/${s.id}` : `/explorer?module=${s.id}`} className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-surface2">
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: s.color }} />
                  <span className="min-w-0 flex-1 truncate">{tl(s.title)}</span>
                  <span className="text-xs tabular-nums text-muted">{resourcesOf(s.id).length}</span>
                  <Icon name="right" size={13} className="text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* resume where the student stopped */}
      {last && lastContent && (
        <Link to={last.path} className="flex items-center gap-4 rounded-lg border border-line bg-surface px-5 py-4 transition-colors hover:border-fg/25" data-testid="resume">
          <Icon name="history" size={18} className="text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted">{t('home.resume')}</span>
            <span className="block truncate font-medium">
              {lastChapter ? tl(lastChapter.title) : tl(lastContent.module.title)} <span className="text-muted">· {tl(lastContent.module.title)}</span>
            </span>
          </span>
          <span className="text-sm font-semibold text-accent">{t('module.continue')} →</span>
        </Link>
      )}

      {/* recently added */}
      <section>
        <SectionHeader
          title={t('home.recent')}
          action={
            <Link to="/explorer" className="text-sm font-semibold text-accent hover:underline">
              {t('home.seeAll')} ({RESOURCES.length})
            </Link>
          }
        />
        <ResourceList items={recentResources(6)} />
      </section>

      {/* modules */}
      <section id="modules" className="scroll-mt-24">
        <SectionHeader title={t('home.modules')} eyebrow={`${FILIERE.id} · ${tl(SEMESTER.title)} · ${ACADEMIC_YEAR}`} />
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="hidden border-b border-line text-left text-xs text-muted sm:table-header-group">
              <tr>
                <th className="px-5 py-2.5 font-medium">{t('explore.module')}</th>
                <th className="px-3 py-2.5 font-medium">{t('home.col.lessons')}</th>
                <th className="px-3 py-2.5 font-medium">{t('home.col.docs')}</th>
                <th className="px-3 py-2.5 font-medium">{t('module.mastery')}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SUBJECTS.map((s) => {
                const c = content?.find((x) => x.module.id === s.id);
                const to = s.interactive ? `/m/${s.id}` : `/explorer?module=${s.id}`;
                return (
                  <tr key={s.id} className="group cursor-pointer transition-colors hover:bg-surface2/60" onClick={() => navigate(to)} data-testid={`module-${s.id}`}>
                    <td className="px-5 py-4">
                      <Link to={to} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line" style={{ color: s.color }}>
                          <Icon name={s.icon} size={16} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold">{tl(s.title)}</span>
                          {s.subtitle && <span className="block truncate text-xs text-muted">{tl(s.subtitle)}</span>}
                        </span>
                      </Link>
                    </td>
                    <td className="hidden px-3 py-4 tabular-nums text-muted sm:table-cell">{c ? `${c.chapters.length} ch. · ${c.questions.length} QCM` : s.interactive ? '…' : '—'}</td>
                    <td className="hidden px-3 py-4 tabular-nums text-muted sm:table-cell">{resourcesOf(s.id).length}</td>
                    <td className="hidden px-3 py-4 sm:table-cell">
                      {c ? (
                        <span className="flex items-center gap-2">
                          <span className="h-1 w-16 overflow-hidden rounded-full bg-surface2">
                            <span className="block h-full bg-accent" style={{ width: `${moduleMastery(c, st)}%` }} />
                          </span>
                          <span className="text-xs tabular-nums text-muted">{moduleMastery(c, st)}%</span>
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="pr-4 text-right">
                      <Icon name="right" size={14} className="text-muted" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* browse by type */}
      <section>
        <SectionHeader title={t('home.byType')} />
        <div className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          {KINDS.map((k) => (
            <Link key={k} to={`/explorer?type=${k}`} className="group border-b border-r border-line bg-surface p-5 transition-colors hover:bg-surface2/60">
              <div className="font-display text-2xl font-bold tabular-nums">{kindCount[k]}</div>
              <div className="mt-1 flex items-center justify-between text-sm text-muted group-hover:text-fg">
                {t(KIND_LABEL[k])} <Icon name="arrowRight" size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* study tools */}
      <section>
        <SectionHeader title={t('home.tools')} />
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {TOOLS.filter((x) => x.to !== '/explorer').map((x) => (
            <li key={x.to} className="border-b border-line">
              <Link to={x.to} className="group flex items-start gap-3 py-4">
                <Icon name={x.icon} size={17} className="mt-0.5 text-accent" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold group-hover:text-accent">{t(x.key)}</span>
                  <span className="block text-sm text-muted">{t(x.desc)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
