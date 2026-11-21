/**
 * TEMPORARY — "Contrôles ce week-end" board on the home page.
 * It hides itself after SHOW_UNTIL. To remove it for good: delete this file and the <ControlsBoard /> line in pages/Home.tsx.
 */
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { usePreview } from './ui';
import { useT, useL } from '../hooks/useT';
import { subjectById, type Resource } from '../lib/catalog';
import { useResources } from '../lib/resources';

/** Last day the board is shown (local time). */
const SHOW_UNTIL = '2026-11-29';

/** Modules with a test this weekend, in the order the class asked for. */
const MODULES = ['mobile', 'oracle', 'ro', 'data', 'linux'];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function PaperLink({ r }: { r: Resource }) {
  const open = usePreview((s) => s.open);
  const cls = 'group/p flex w-full items-center gap-2.5 rounded-md border-2 border-fg/10 bg-bg px-3 py-2 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-fg';
  const body = (
    <>
      <Icon name={r.ext === 'link' ? 'external' : 'file'} size={15} className="shrink-0 text-bad" />
      <span className="min-w-0 flex-1 leading-snug">{r.title}</span>
      <Icon name="arrowRight" size={14} className="shrink-0 text-muted transition group-hover/p:translate-x-0.5 group-hover/p:text-fg" />
    </>
  );
  return r.ext === 'pdf' ? (
    <button className={cls} onClick={() => open(r)} data-testid="cc-paper">
      {body}
    </button>
  ) : (
    <a className={cls} href={r.url} target="_blank" rel="noreferrer" data-testid="cc-paper">
      {body}
    </a>
  );
}

export function ControlsBoard() {
  const { t } = useT();
  const tl = useL();
  const resources = useResources();
  if (today() > SHOW_UNTIL) return null;

  return (
    <section aria-labelledby="cc-title" className="overflow-hidden rounded-2xl border-2 border-fg bg-surface shadow-[6px_6px_0_rgb(var(--fg))]" data-testid="controls-board">
      <div className="tape h-3" aria-hidden />
      <div className="px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <h2 id="cc-title" className="font-street text-5xl uppercase leading-none tracking-[0.02em] sm:text-6xl">
            {t('cc.title')}
          </h2>
          <span className="mb-1 inline-block -rotate-3 font-tag text-2xl leading-none text-accent sm:text-3xl">{t('cc.tag')}</span>
        </div>
        <p className="mt-3 max-w-2xl text-[15px] text-muted">{t('cc.sub')}</p>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((id, i) => {
            const s = subjectById(id);
            if (!s) return null;
            const papers = resources.filter((r) => r.subject === id && r.kind === 'controle').sort((a, b) => a.order - b.order);
            return (
              <li key={id} className={`flex flex-col rounded-xl border-2 border-fg/15 bg-surface p-4 transition hover:border-fg ${i % 2 ? 'lg:rotate-[0.6deg]' : 'lg:-rotate-[0.6deg]'} hover:rotate-0`}>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: s.color }}>
                    <Icon name={s.icon} size={17} />
                  </span>
                  <span className="font-street text-2xl uppercase leading-tight tracking-[0.03em]">{tl(s.title)}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {papers.length ? papers.map((r) => <PaperLink key={r.id} r={r} />) : <p className="text-sm text-muted">{t('cc.noPaper')}</p>}
                </div>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  <Link to={`/m/${id}/examen`} className="rounded-full bg-fg px-3 py-1.5 text-xs font-bold text-bg transition hover:bg-accent hover:text-white">
                    {t('nav.exam')}
                  </Link>
                  <Link to={`/m/${id}/fiche`} className="rounded-full border-2 border-fg/15 px-3 py-1 text-xs font-bold transition hover:border-fg">
                    {t('nav.sheet')}
                  </Link>
                  <Link to={`/m/${id}/qcm`} className="rounded-full border-2 border-fg/15 px-3 py-1 text-xs font-bold transition hover:border-fg">
                    {t('cc.qcm')}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
