import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTitle } from '../components/Layout';
import { Icon } from '../components/Icon';
import { useT, useL } from '../hooks/useT';
import { MODULES, getModule } from '../lib/content';
import { SUPPORTS, type Support, type SupportKind } from '../lib/supports';
import type { UIKey } from '../i18n/ui';

const KIND: Record<SupportKind, { key: UIKey; icon: string; cls: string }> = {
  cours: { key: 'sup.kind.cours', icon: 'book', cls: 'bg-accent/10 text-accent' },
  td: { key: 'sup.kind.td', icon: 'dumbbell', cls: 'bg-accent2/10 text-accent2' },
  tp: { key: 'sup.kind.tp', icon: 'terminal', cls: 'bg-sky-500/10 text-sky-700 dark:text-sky-300' },
  controle: { key: 'sup.kind.controle', icon: 'target', cls: 'bg-warn/10 text-warn' },
  annexe: { key: 'sup.kind.annexe', icon: 'file', cls: 'bg-surface2 text-muted' }
};
const ORDER: SupportKind[] = ['cours', 'td', 'tp', 'controle', 'annexe'];

function Item({ s, onOpen, active }: { s: Support; onOpen: () => void; active: boolean }) {
  const { t } = useT();
  const k = KIND[s.kind];
  return (
    <li className={`card card-hover flex items-center gap-4 p-4 ${active ? 'border-accent ring-2 ring-accent/20' : ''}`}>
      <span className={`icon-tile h-11 w-11 rounded-xl ${k.cls}`}>
        <Icon name={k.icon} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display font-semibold leading-snug">{s.title}</span>
        <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-surface2 px-2 py-0.5 font-semibold uppercase tracking-wide">{t(k.key)}</span>
          <span className="uppercase">{s.ext}</span>
        </span>
      </span>
      {s.ext === 'pdf' && (
        <button className="btn-primary btn-sm" onClick={onOpen} data-testid="support-read">
          <Icon name="eye" size={14} /> {t('sup.read')}
        </button>
      )}
      <a className="btn-ghost btn-sm" href={s.url} download={s.file} aria-label={t('sup.download')}>
        <Icon name="download" size={14} /> <span className="hidden sm:inline">{t('sup.download')}</span>
      </a>
    </li>
  );
}

/** Original course files (PDF) of a module, or of every module when used without :module. */
export default function SupportsPage() {
  const { module } = useParams();
  const { t } = useT();
  const tl = useL();
  const [open, setOpen] = useState<Support | null>(null);
  // phones (Android Chrome, iOS) do not render PDFs inside an iframe: open them in the browser's own viewer
  const openSupport = (s: Support) => {
    const phone = window.matchMedia('(max-width: 768px)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (phone) return void window.open(s.url, '_blank', 'noopener');
    setOpen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const mods = module ? MODULES.filter((m) => m.id === module) : MODULES;
  const all = SUPPORTS.filter((s) => !module || s.module === module);
  const m = module ? getModule(module) : undefined;
  return (
    <div className={module ? '' : 'mx-auto max-w-5xl'}>
      <PageTitle eyebrow={m ? tl(m.title) : t('nav.library')} title={t('sup.title')} sub={t('sup.sub')} />

      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="card mb-6 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line bg-surface2 px-4 py-2.5">
              <Icon name="file" size={17} className="text-accent" />
              <span className="min-w-0 flex-1 truncate font-semibold">{open.title}</span>
              <a className="btn-ghost btn-sm" href={open.url} target="_blank" rel="noreferrer">
                <Icon name="external" size={14} /> {t('sup.newTab')}
              </a>
              <button className="btn-ghost btn-sm" onClick={() => setOpen(null)} aria-label={t('common.close')}>
                <Icon name="x" size={14} />
              </button>
            </div>
            <iframe title={open.title} src={`${open.url}#view=FitH`} className="h-[78vh] w-full bg-white" />
          </motion.section>
        )}
      </AnimatePresence>

      {all.length === 0 && (
        <div className="card flex items-start gap-3 p-5 text-sm text-muted">
          <Icon name="inbox" size={20} className="mt-0.5 shrink-0 text-accent" /> {t('sup.empty')}
        </div>
      )}

      <div className="space-y-8">
        {mods.map((mod) => {
          const list = all.filter((s) => s.module === mod.id);
          if (!list.length) return null;
          return (
            <section key={mod.id}>
              {!module && (
                <h2 className="mb-3 flex items-center gap-3 font-display text-xl font-bold">
                  <span className="icon-tile h-9 w-9 text-white" style={{ background: mod.color }}>
                    <Icon name={mod.icon} size={18} />
                  </span>
                  {tl(mod.title)}
                  <span className="text-sm font-normal text-muted">
                    · {list.length} {t('sup.files')}
                  </span>
                </h2>
              )}
              <div className="space-y-5">
                {ORDER.map((k) => {
                  const items = list.filter((s) => s.kind === k);
                  if (!items.length) return null;
                  return (
                    <div key={k}>
                      <div className="eyebrow mb-2">{t(KIND[k].key)}</div>
                      <ul className="grid gap-2.5">
                        {items.map((s) => (
                          <Item key={s.url} s={s} active={open?.url === s.url} onOpen={() => openSupport(s)} />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
