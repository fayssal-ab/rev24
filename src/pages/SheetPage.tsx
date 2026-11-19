import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
import { useT } from '../hooks/useT';
import { L, Tex } from '../components/Text';
import { Icon } from '../components/Icon';

export default function SheetPage() {
  const id = useModuleParam();
  const { data } = useModuleContent(id);
  const { t } = useT();
  if (!data) return <Loading />;
  return (
    <div className="space-y-4">
      <PageTitle title={<>{t('sheet.title')} — <L v={data.module.title} /></>} />
      <button className="btn-primary no-print" onClick={() => window.print()}>
        <Icon name="print" size={16} /> {t('common.print')}
      </button>
      <div className="grid gap-3 md:grid-cols-2">
        {data.chapters.map((c) => (
          <section key={c.id} className="card p-4">
            <h2 className="mb-2 font-semibold text-accent">
              <L v={c.title} />
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {c.keyPoints.map((k, i) => (
                <li key={i}>
                  <L v={k} />
                </li>
              ))}
            </ul>
            {c.sections
              .filter((s) => s.type === 'formula')
              .slice(0, 4)
              .map((s, i) => (s.type === 'formula' ? <Tex key={i} tex={s.tex} block /> : null))}
            {c.sections
              .filter((s) => s.type === 'callout' && s.kind === 'trap')
              .slice(0, 3)
              .map((s, i) =>
                s.type === 'callout' ? (
                  <div key={i} className="mt-2 rounded-lg border-l-4 border-bad/60 bg-bad/5 p-2 text-xs">
                    <L v={s.body} md />
                  </div>
                ) : null
              )}
          </section>
        ))}
      </div>
      {data.reference.length > 0 && (
        <section className="card p-4">
          <h2 className="mb-2 font-semibold">{t('ref.title')}</h2>
          <div className="grid gap-x-6 gap-y-1 text-sm md:grid-cols-2">
            {data.reference.slice(0, 60).map((r) => (
              <div key={r.id} className="flex flex-wrap gap-x-2 border-b border-line/60 py-1">
                <code className="break-all font-mono text-[12px] text-accent2">{r.syntax}</code>
                <span className="text-muted">
                  <L v={r.desc} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
