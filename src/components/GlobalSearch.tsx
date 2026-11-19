import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { create } from 'zustand';
import { Icon } from './Icon';
import { FileIcon, ResourceTypeBadge, usePreview } from './ui';
import { useT, useL } from '../hooks/useT';
import { useAllModules } from '../hooks/useModule';
import { MODULES } from '../lib/content';
import { RESOURCES, SUBJECTS, norm, subjectById, type Resource } from '../lib/catalog';

export const useSearch = create<{ open: boolean; setOpen: (o: boolean) => void }>((set) => ({ open: false, setOpen: (open) => set({ open }) }));

type Hit = { kind: 'subject'; id: string; title: string; sub: string; to: string } | { kind: 'chapter'; id: string; title: string; sub: string; to: string } | { kind: 'doc'; id: string; r: Resource; sub: string };

/** Ctrl/⌘ + K palette: subjects, chapters and documents. Mounted once in the Layout. */
export function GlobalSearch() {
  const { t } = useT();
  const tl = useL();
  const { open, setOpen } = useSearch();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const preview = usePreview((s) => s.open);
  const content = useAllModules(open ? MODULES.map((m) => m.id) : []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!useSearch.getState().open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);
  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);

  const hits = useMemo<Hit[]>(() => {
    const n = norm(q.trim());
    if (!n) return [];
    const words = n.split(/\s+/);
    const match = (s: string) => words.every((w) => norm(s).includes(w));
    const out: Hit[] = [];
    for (const s of SUBJECTS) if (match(`${s.title.fr} ${s.title.en} ${s.id}`)) out.push({ kind: 'subject', id: s.id, title: tl(s.title), sub: t('search.module'), to: s.interactive ? `/m/${s.id}` : `/explorer?module=${s.id}` });
    for (const c of content ?? [])
      for (const ch of c.chapters)
        if (match(`${ch.title.fr} ${ch.title.en} ${ch.summary.fr}`)) out.push({ kind: 'chapter', id: `${c.module.id}/${ch.id}`, title: tl(ch.title), sub: tl(c.module.title), to: `/m/${c.module.id}/c/${ch.id}` });
    for (const r of RESOURCES) if (match(`${r.title} ${r.kind} ${subjectById(r.subject)?.title.fr ?? ''}`)) out.push({ kind: 'doc', id: r.id, r, sub: tl(subjectById(r.subject)?.title) });
    return out.slice(0, 40);
  }, [q, content, tl, t]);

  const go = (h: Hit) => {
    setOpen(false);
    if (h.kind === 'doc') return h.r.route ? navigate(h.r.route) : h.r.ext === 'pdf' ? preview(h.r) : window.open(h.r.url, '_blank', 'noopener');
    navigate(h.to);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-navy/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('search.placeholder')}
            className="fixed inset-x-3 top-[10vh] z-[71] mx-auto max-w-2xl overflow-hidden rounded-lg border border-line bg-surface shadow-2xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Icon name="search" size={18} className="text-muted" />
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false);
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSel((s) => Math.min(hits.length - 1, s + 1));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSel((s) => Math.max(0, s - 1));
                  }
                  if (e.key === 'Enter' && hits[sel]) go(hits[sel]);
                }}
                placeholder={t('search.placeholder')}
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
                data-testid="global-search-input"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-muted">Esc</kbd>
            </div>
            <ul className="scroll-thin max-h-[60vh] overflow-y-auto p-2" role="listbox">
              {q && !hits.length && <li className="px-3 py-8 text-center text-sm text-muted">{t('search.none')}</li>}
              {!q && <li className="px-3 py-6 text-center text-sm text-muted">{t('search.hint')}</li>}
              {hits.map((h, i) => (
                <li key={`${h.kind}-${h.id}`} role="option" aria-selected={i === sel}>
                  <button onMouseEnter={() => setSel(i)} onClick={() => go(h)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left ${i === sel ? 'bg-surface2' : ''}`}>
                    {h.kind === 'doc' ? (
                      <FileIcon ext={h.r.ext} />
                    ) : (
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line text-muted">
                        <Icon name={h.kind === 'subject' ? 'grid' : 'book'} size={15} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{h.kind === 'doc' ? h.r.title : h.title}</span>
                      <span className="flex items-center gap-2 text-xs text-muted">
                        {h.kind === 'doc' && <ResourceTypeBadge kind={h.r.kind} />}
                        {h.kind === 'chapter' && <span>{t('search.chapter')} ·</span>}
                        <span className="truncate">{h.sub}</span>
                      </span>
                    </span>
                    {i === sel && <Icon name="arrowRight" size={14} className="text-muted" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
