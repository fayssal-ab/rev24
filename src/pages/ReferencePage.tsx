import { useMemo, useState } from 'react';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
import { useT, useL } from '../hooks/useT';
import { L } from '../components/Text';
import { Icon } from '../components/Icon';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function ReferencePage() {
  const id = useModuleParam();
  const { data } = useModuleContent(id);
  const { t } = useT();
  const tl = useL();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    if (!data) return [];
    const k = norm(q.trim());
    return data.reference.filter((r) => !k || norm(r.syntax).includes(k) || norm(tl(r.desc)).includes(k) || norm(r.desc.fr).includes(k) || norm(r.example ?? '').includes(k));
  }, [data, q, tl]);
  if (!data) return <Loading />;
  const chapters = data.chapters.filter((c) => list.some((r) => r.chapter === c.id));
  return (
    <div className="space-y-4">
      <PageTitle title={t('ref.title')} />
      <div className="sticky top-14 z-10 -mx-4 bg-bg/90 px-4 py-2 backdrop-blur">
        <label className="relative block">
          <Icon name="search" size={18} className="absolute left-3 top-3 text-muted" />
          <input className="input !pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search')} aria-label={t('common.search')} autoFocus />
        </label>
        <p className="mt-1 text-xs text-muted">
          {list.length} {t('ref.results')}
        </p>
      </div>
      {chapters.map((c) => (
        <section key={c.id}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            <L v={c.title} />
          </h2>
          <ul className="space-y-2">
            {list
              .filter((r) => r.chapter === c.id)
              .map((r) => (
                <li key={r.id} className="card p-3">
                  <code className="font-mono text-sm text-accent">{r.syntax}</code>
                  <div className="text-sm">
                    <L v={r.desc} />
                  </div>
                  {r.example && <code className="mt-1 block font-mono text-xs text-muted">$ {r.example}</code>}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
