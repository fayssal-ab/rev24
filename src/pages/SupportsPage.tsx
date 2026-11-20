import { useParams } from 'react-router-dom';
import { PageTitle } from '../components/Layout';
import { Icon } from '../components/Icon';
import { KIND_LABEL, ResourceList } from '../components/ui';
import { useT, useL } from '../hooks/useT';
import { getModule } from '../lib/content';
import { KINDS } from '../lib/catalog';
import { useResources } from '../lib/resources';

/** Documents of one module (built-in files + those added by the admin), grouped by type. */
export default function SupportsPage() {
  const { module } = useParams();
  const { t } = useT();
  const tl = useL();
  const all = useResources().filter((r) => r.subject === module && r.kind !== 'resume');
  const m = module ? getModule(module) : undefined;
  return (
    <div>
      <PageTitle eyebrow={m ? tl(m.title) : t('nav.supports')} title={t('sup.title')} sub={t('sup.sub')} />
      {all.length === 0 && (
        <div className="card flex items-start gap-3 p-5 text-sm text-muted">
          <Icon name="inbox" size={20} className="mt-0.5 shrink-0 text-accent" /> {t('sup.empty')}
        </div>
      )}
      <div className="space-y-5">
        {KINDS.map((k) => {
          const items = all.filter((r) => r.kind === k).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'fr'));
          if (!items.length) return null;
          return (
            <div key={k}>
              <div className="eyebrow mb-1.5">{t(KIND_LABEL[k])}</div>
              <ResourceList items={items} showSubject={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
