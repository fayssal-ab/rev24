import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Breadcrumbs, EmptyState, KIND_LABEL, ResourceList } from '../components/ui';
import { useT, useL } from '../hooks/useT';
import { ACADEMIC_YEAR, FILIERE, KINDS, RESOURCES, SEMESTER, SUBJECTS, YEAR_OF_STUDY, norm, subjectById, type Resource, type ResourceKind } from '../lib/catalog';

type Sort = 'recent' | 'title' | 'module';

/** Read / write a comma-separated multi-value search param. */
const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <legend className="eyebrow mb-2.5">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ label, count, checked, onChange, color }: { label: ReactNode; count: number; checked: boolean; onChange: () => void; color?: string }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-surface2 ${count === 0 && !checked ? 'opacity-45' : ''}`}>
      <input type="checkbox" className="h-3.5 w-3.5 accent-[rgb(var(--accent))]" checked={checked} onChange={onChange} />
      {color && <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: color }} />}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="text-xs tabular-nums text-muted">{count}</span>
    </label>
  );
}

/** Explore the whole library: search, filter (filière, year, semester, module, type) and sort. */
export default function ExplorePage() {
  const { t } = useT();
  const tl = useL();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const q = params.get('q') ?? '';
  const modules = list(params.get('module'));
  const kinds = list(params.get('type')) as ResourceKind[];
  const sort = (params.get('sort') as Sort) || 'recent';

  const set = (key: string, value: string | string[] | null) => {
    const next = new URLSearchParams(params);
    const v = Array.isArray(value) ? value.join(',') : value;
    if (v) next.set(key, v);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const toggle = (key: 'module' | 'type', current: string[], v: string) => set(key, current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);

  const textMatch = useMemo(() => {
    const words = norm(q.trim()).split(/\s+/).filter(Boolean);
    return (r: Resource) => !words.length || words.every((w) => norm(`${r.title} ${subjectById(r.subject)?.title.fr ?? ''} ${r.kind}`).includes(w));
  }, [q]);

  // counts reflect the other active filters (faceted search)
  const base = RESOURCES.filter(textMatch);
  const byModule = base.filter((r) => !kinds.length || kinds.includes(r.kind));
  const byKind = base.filter((r) => !modules.length || modules.includes(r.subject));
  const results = byModule
    .filter((r) => !modules.length || modules.includes(r.subject))
    .sort((a, b) =>
      sort === 'title'
        ? a.title.localeCompare(b.title, 'fr')
        : sort === 'module'
          ? a.subject.localeCompare(b.subject) || a.order - b.order
          : (b.date ?? '').localeCompare(a.date ?? '') || a.order - b.order
    );
  const activeCount = modules.length + kinds.length;

  const filters = (
    <div>
      <FilterGroup title={t('explore.filiere')}>
        <Check label={`${FILIERE.id} · ${tl(FILIERE.title)}`} count={base.length} checked onChange={() => undefined} />
      </FilterGroup>
      <FilterGroup title={t('explore.year')}>
        <Check label={`${tl(YEAR_OF_STUDY)} · ${ACADEMIC_YEAR}`} count={base.length} checked onChange={() => undefined} />
      </FilterGroup>
      <FilterGroup title={t('explore.semester')}>
        <Check label={tl(SEMESTER.title)} count={base.length} checked onChange={() => undefined} />
      </FilterGroup>
      <FilterGroup title={t('explore.module')}>
        {SUBJECTS.map((s) => (
          <Check key={s.id} label={tl(s.title)} color={s.color} count={byModule.filter((r) => r.subject === s.id).length} checked={modules.includes(s.id)} onChange={() => toggle('module', modules, s.id)} />
        ))}
      </FilterGroup>
      <FilterGroup title={t('explore.type')}>
        {KINDS.map((k) => (
          <Check key={k} label={t(KIND_LABEL[k])} count={byKind.filter((r) => r.kind === k).length} checked={kinds.includes(k)} onChange={() => toggle('type', kinds, k)} />
        ))}
      </FilterGroup>
      {activeCount > 0 && (
        <button className="mt-3 text-xs font-semibold text-accent hover:underline" onClick={() => setParams(q ? { q } : {}, { replace: true })}>
          {t('explore.clear')}
        </button>
      )}
    </div>
  );

  return (
    <div>
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.explore') }]} />
      <div className="mb-8 border-b border-line pb-6">
        <h1 className="h1">{t('explore.title')}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-muted">{t('explore.sub')}</p>
      </div>

      <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block" aria-label={t('explore.filters')}>
          <div className="sticky top-20">{filters}</div>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="relative min-w-[14rem] flex-1">
              <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="input pl-9" type="search" value={q} onChange={(e) => set('q', e.target.value || null)} placeholder={t('explore.searchPh')} data-testid="explore-search" />
            </label>
            <button className="btn-ghost lg:hidden" onClick={() => setDrawer(true)} data-testid="explore-filters">
              <Icon name="filter" size={15} /> {t('explore.filters')}
              {activeCount > 0 && <span className="rounded bg-navy px-1.5 text-[10px] font-bold text-white">{activeCount}</span>}
            </button>
            <label className="flex items-center gap-2 text-xs text-muted">
              {t('explore.sort')}
              <select className="input !min-h-[38px] w-auto !py-1.5 text-sm" value={sort} onChange={(e) => set('sort', e.target.value === 'recent' ? null : e.target.value)} data-testid="explore-sort">
                <option value="recent">{t('explore.sort.recent')}</option>
                <option value="title">{t('explore.sort.title')}</option>
                <option value="module">{t('explore.sort.module')}</option>
              </select>
            </label>
          </div>

          {activeCount > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {modules.map((m) => (
                <button key={m} className="chip hover:border-fg/30" onClick={() => toggle('module', modules, m)}>
                  {tl(subjectById(m)?.title)} <Icon name="x" size={11} />
                </button>
              ))}
              {kinds.map((k) => (
                <button key={k} className="chip hover:border-fg/30" onClick={() => toggle('type', kinds, k)}>
                  {t(KIND_LABEL[k])} <Icon name="x" size={11} />
                </button>
              ))}
            </div>
          )}

          <p className="mb-3 text-xs text-muted" aria-live="polite" data-testid="explore-count">
            {results.length} {t('explore.results')}
          </p>
          <ResourceList
            items={results}
            empty={
              <EmptyState icon="search" title={t('explore.empty')}>
                <button className="font-semibold text-accent hover:underline" onClick={() => setParams({}, { replace: true })}>
                  {t('explore.clear')}
                </button>
              </EmptyState>
            }
          />
        </section>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-navy/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              className="scroll-thin fixed inset-y-0 left-0 z-50 w-[86vw] max-w-sm overflow-y-auto border-r border-line bg-surface p-5 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display font-bold">{t('explore.filters')}</span>
                <button className="grid h-8 w-8 place-items-center rounded-md border border-line" onClick={() => setDrawer(false)} aria-label={t('common.close')}>
                  <Icon name="x" size={15} />
                </button>
              </div>
              {filters}
              <button className="btn-primary mt-5 w-full" onClick={() => setDrawer(false)}>
                {t('explore.show')} ({results.length})
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
