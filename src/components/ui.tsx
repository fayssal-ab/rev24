/** Shared building blocks of the academic library UI (one implementation, used by every page). */
import { useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { create } from 'zustand';
import { Icon } from './Icon';
import { PdfViewer } from './PdfViewer';
import { useT, useL } from '../hooks/useT';
import { formatDate, formatSize, subjectById, type Resource, type ResourceKind } from '../lib/catalog';
import type { UIKey } from '../i18n/ui';

// ---------------------------------------------------------------- type badge & file icon
export const KIND_LABEL: Record<ResourceKind, UIKey> = {
  cours: 'sup.kind.cours',
  td: 'sup.kind.td',
  tp: 'sup.kind.tp',
  controle: 'sup.kind.controle',
  resume: 'sup.kind.resume',
  annexe: 'sup.kind.annexe'
};
const KIND_SHORT: Record<ResourceKind, string> = { cours: 'Cours', td: 'TD', tp: 'TP', controle: 'Examen', resume: 'Résumé', annexe: 'Annexe' };
const KIND_CLS: Record<ResourceKind, string> = {
  cours: 'border-accent/30 text-accent',
  td: 'border-[#7a5a1c]/30 text-[#7a5a1c] dark:border-accent2/40 dark:text-accent2',
  tp: 'border-fg/20 text-fg',
  controle: 'border-bad/30 text-bad',
  resume: 'border-accent2/50 text-[#8a6420] dark:text-accent2',
  annexe: 'border-line text-muted'
};

/** Library call code of a subject, e.g. DATA, ORA — printed like a shelf mark. */
const CALL: Record<string, string> = { data: 'DATA', linux: 'LNX', oracle: 'ORA', ro: 'RO', ml: 'ML', ia: 'IA', virtualisation: 'VIRT', nosql: 'NOSQL', dotnet: 'NET', mobile: 'MOB', progav: 'PROG', compro: 'COM', english: 'ENG' };
export const callCode = (subject: string) => CALL[subject] ?? subject.slice(0, 4).toUpperCase();

export function ResourceTypeBadge({ kind }: { kind: ResourceKind }) {
  return <span className={`inline-flex h-5 items-center rounded border px-1.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_CLS[kind]}`}>{KIND_SHORT[kind]}</span>;
}

export function FileIcon({ ext }: { ext: string }) {
  const label = ext === 'web' ? 'WEB' : ext === 'link' ? 'LIEN' : ext.toUpperCase();
  const color = ext === 'pdf' ? 'bg-[#b23434]' : ext === 'pptx' ? 'bg-[#c4622d]' : ext === 'docx' ? 'bg-[#2b579a]' : 'bg-accent';
  return (
    <span className="relative inline-flex h-10 w-8 shrink-0 flex-col justify-end rounded-[3px] border border-line bg-surface" aria-hidden>
      <span className="absolute right-0 top-0 h-2.5 w-2.5 border-b border-l border-line bg-surface2" />
      <span className={`m-0.5 rounded-[2px] py-px text-center text-[7.5px] font-bold leading-tight text-white ${color}`}>{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------- document preview (global)
interface PreviewState {
  doc: Resource | null;
  open: (r: Resource) => void;
  close: () => void;
}
export const usePreview = create<PreviewState>((set) => ({ doc: null, open: (doc) => set({ doc }), close: () => set({ doc: null }) }));

/** Full-height side panel with the in-app PDF reader. Mounted once in the Layout. */
export function DocumentPreview() {
  const { t } = useT();
  const tl = useL();
  const { doc, close } = usePreview();
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [doc, close]);
  const subject = doc ? subjectById(doc.subject) : undefined;
  return (
    <AnimatePresence>
      {doc && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-navy/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={doc.title}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-4xl flex-col border-l border-line bg-surface"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            data-testid="document-preview"
          >
            <header className="flex items-start gap-3 border-b border-line px-5 py-4">
              <FileIcon ext={doc.ext} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <ResourceTypeBadge kind={doc.kind} />
                  {subject && <span>{tl(subject.title)}</span>}
                  {doc.pages && <span>· {doc.pages} {t('sup.pages')}</span>}
                </div>
                <h2 className="mt-1 font-display text-lg font-bold leading-snug">{doc.title}</h2>
              </div>
              <a className="btn-ghost btn-sm" href={doc.url} download={doc.file}>
                <Icon name="download" size={14} /> <span className="hidden sm:inline">{t('sup.download')}</span>
              </a>
              <button className="btn-ghost btn-sm" onClick={close} aria-label={t('common.close')}>
                <Icon name="x" size={14} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-hidden">{doc.ext === 'pdf' ? <PdfViewer key={doc.url} url={doc.url} title={doc.title} fill /> : <EmptyState icon="file" title={t('res.noPreview')} />}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------- resource row
export function ResourceRow({ r, showSubject = true }: { r: Resource; showSubject?: boolean }) {
  const { t, lang } = useT();
  const tl = useL();
  const open = usePreview((s) => s.open);
  const navigate = useNavigate();
  const subject = subjectById(r.subject);
  const activate = () => (r.route ? navigate(r.route) : r.ext === 'pdf' ? open(r) : window.open(r.url, '_blank', 'noopener'));
  return (
    <li className="group flex items-center gap-4 border-b border-line px-1 py-3.5 last:border-b-0" data-testid="resource-row">
      <span className="hidden w-16 shrink-0 font-mono text-[11px] leading-tight text-muted sm:block">
        {callCode(r.subject)}
        <span className="block text-accent">·{String(r.order).padStart(2, '0')}</span>
      </span>
      <FileIcon ext={r.ext} />
      <button className="min-w-0 flex-1 text-left" onClick={activate} data-testid="resource-open">
        <span className="block truncate text-[15px] font-medium text-fg underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:text-accent group-hover:decoration-accent/40">{r.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <ResourceTypeBadge kind={r.kind} />
          {showSubject && subject && <span className="truncate">{tl(subject.title)}</span>}
          <span className="hidden font-mono text-[11px] sm:inline">· S1 · 2026/27</span>
          {r.pages && <span>· {r.pages} p.</span>}
          {r.date && <span className="hidden md:inline">· {formatDate(r.date, lang)}</span>}
        </span>
      </button>
      <span className="hidden w-16 text-right font-mono text-[11px] tabular-nums text-muted lg:block">{formatSize(r.size)}</span>
      {r.route ? (
        <Link to={r.route} className="btn-ghost btn-sm" aria-label={t('res.open')}>
          <Icon name="arrowRight" size={14} />
        </Link>
      ) : (
        <span className="flex items-center gap-1.5">
          {r.ext === 'pdf' && (
            <button className="btn-ghost btn-sm hidden sm:inline-flex" onClick={() => open(r)} data-testid="support-read">
              <Icon name="eye" size={14} /> {t('sup.read')}
            </button>
          )}
          {r.ext === 'link' ? (
            <a className="btn-ghost btn-sm" href={r.url} target="_blank" rel="noreferrer" aria-label={t('sup.newTab')}>
              <Icon name="external" size={14} />
            </a>
          ) : (
            <a className="btn-ghost btn-sm" href={r.url} download={r.file} aria-label={t('sup.download')} data-testid="resource-download">
              <Icon name="download" size={14} />
            </a>
          )}
        </span>
      )}
    </li>
  );
}

export function ResourceList({ items, showSubject = true, empty }: { items: Resource[]; showSubject?: boolean; empty?: ReactNode }) {
  if (!items.length) return <>{empty ?? null}</>;
  return (
    <ul className="rounded-lg border border-line bg-surface px-4">
      {items.map((r) => (
        <ResourceRow key={r.id} r={r} showSubject={showSubject} />
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------- misc
export function Breadcrumbs({ items }: { items: { label: ReactNode; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <Icon name="right" size={12} className="text-line" />}
          {it.to ? (
            <Link to={it.to} className="hover:text-fg">
              {it.label}
            </Link>
          ) : (
            <span className="text-fg">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function EmptyState({ icon = 'inbox', title, children }: { icon?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <Icon name={icon} size={22} className="text-muted" />
      <p className="font-medium">{title}</p>
      {children && <div className="text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface2 ${className}`} />;
}

/** Editorial section header: mono index, serif title, a hairline rule running to the action. */
export function SectionHeader({ title, action, eyebrow, n }: { title: ReactNode; action?: ReactNode; eyebrow?: ReactNode; n?: number }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <div className="flex items-baseline gap-4">
        {n !== undefined && <span className="font-mono text-xs text-accent">{String(n).padStart(2, '0')}</span>}
        <h2 className="font-display text-2xl font-medium tracking-tight sm:text-[1.9rem]">{title}</h2>
        <span className="h-px min-w-6 flex-1 translate-y-[-0.35rem] bg-line" />
        {action}
      </div>
    </div>
  );
}
