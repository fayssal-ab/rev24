import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Breadcrumbs, EmptyState, KIND_LABEL, ResourceList } from '../components/ui';
import { useT, useL } from '../hooks/useT';
import { KINDS, SUBJECTS, norm, subjectById, type Resource, type ResourceKind } from '../lib/catalog';
import { useResources } from '../lib/resources';

/**
 * Supports de cours — every document in one place, organised by module, then by type
 * (Cours → TD → TP → Contrôles → Résumés → Annexes). One module tab + type chips + text filter.
 */
export default function ExplorePage() {
  const { t } = useT();
  const tl = useL();
  const all = useResources();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const module = params.get('module') ?? '';
  const kind = (params.get('type') ?? '') as ResourceKind | '';

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const textMatch = useMemo(() => {
    const words = norm(q.trim()).split(/\s+/).filter(Boolean);
    return (r: Resource) => !words.length || words.every((w) => norm(`${r.title} ${subjectById(r.subject)?.title.fr ?? ''} ${r.kind}`).includes(w));
  }, [q]);

  const base = all.filter(textMatch);
  const inModule = base.filter((r) => !module || r.subject === module);
  const results = inModule.filter((r) => !kind || r.kind === kind);
  const subjects = SUBJECTS.filter((s) => !module || s.id === module);

  const tab = (active: boolean) =>
    `flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg/30 hover:text-fg'}`;

  return (
    <div>
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.supports') }]} />
      <div className="mb-6 border-b border-line pb-6">
        <h1 className="h1">{t('sup.title')}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-muted">{t('sup.sub')}</p>
      </div>

      {/* modules */}
      <div className="scroll-thin -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label={t('explore.module')}>
        <button role="tab" aria-selected={!module} className={tab(!module)} onClick={() => set('module', null)}>
          {t('sup.all')} <span className="font-mono text-xs opacity-70">{base.length}</span>
        </button>
        {SUBJECTS.map((s) => {
          const n = base.filter((r) => r.subject === s.id).length;
          return (
            <button key={s.id} role="tab" aria-selected={module === s.id} className={tab(module === s.id)} onClick={() => set('module', module === s.id ? null : s.id)}>
              <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
              {tl(s.title)} <span className="font-mono text-xs opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {/* types + search */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => {
            const n = inModule.filter((r) => r.kind === k).length;
            if (!n && kind !== k) return null;
            return (
              <button key={k} className={`chip ${kind === k ? '!border-accent !text-accent' : 'hover:border-fg/30'}`} onClick={() => set('type', kind === k ? null : k)}>
                {t(KIND_LABEL[k])} <span className="font-mono text-[11px] opacity-70">{n}</span>
              </button>
            );
          })}
        </div>
        <label className="relative ml-auto min-w-[14rem] flex-1 sm:max-w-xs">
          <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" type="search" value={q} onChange={(e) => set('q', e.target.value || null)} placeholder={t('explore.searchPh')} data-testid="explore-search" />
        </label>
      </div>

      <p className="mb-4 text-xs text-muted" aria-live="polite" data-testid="explore-count">
        {results.length} {t('explore.results')}
      </p>

      {results.length === 0 ? (
        <EmptyState icon="search" title={t('explore.empty')}>
          <button className="font-semibold text-accent hover:underline" onClick={() => setParams({}, { replace: true })}>
            {t('explore.clear')}
          </button>
        </EmptyState>
      ) : (
        <div className="space-y-10">
          {subjects.map((s) => {
            const list = results.filter((r) => r.subject === s.id);
            if (!list.length) return null;
            return (
              <section key={s.id} aria-labelledby={`sup-${s.id}`}>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="icon-tile h-9 w-9 text-white" style={{ background: s.color }}>
                    <Icon name={s.icon} size={18} />
                  </span>
                  <h2 id={`sup-${s.id}`} className="font-display text-xl font-bold">
                    {tl(s.title)}
                  </h2>
                  <span className="text-sm text-muted">
                    · {list.length} {t('sup.files')}
                  </span>
                  {s.interactive && (
                    <Link to={`/m/${s.id}`} className="ml-auto text-sm font-semibold text-accent hover:underline">
                      {t('sup.openModule')} <Icon name="arrowRight" size={13} className="inline" />
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {KINDS.map((k) => {
                    const items = list.filter((r) => r.kind === k).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'fr'));
                    if (!items.length) return null;
                    return (
                      <div key={k}>
                        <div className="eyebrow mb-1.5">{t(KIND_LABEL[k])}</div>
                        <ResourceList items={items} showSubject={false} />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
