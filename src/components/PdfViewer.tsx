import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Icon } from './Icon';
import { useT } from '../hooks/useT';

/** pdf.js (legacy build: works on older phones and browsers too) is ~1 MB: loaded only when a document is opened. */
async function loadPdfJs() {
  const [pdfjs, worker] = await Promise.all([import('pdfjs-dist/legacy/build/pdf.mjs'), import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

function Page({ doc, n, width, ratio }: { doc: PDFDocumentProxy; n: number; width: number; ratio: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [r, setR] = useState(ratio);

  // render only pages that come near the screen
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !width) return;
    let cancelled = false;
    let task: { cancel: () => void } | null = null;
    void (async () => {
      const page = await doc.getPage(n);
      if (cancelled || !canvas.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const base = page.getViewport({ scale: 1 });
      setR(base.height / base.width);
      const viewport = page.getViewport({ scale: (width / base.width) * dpr });
      const c = canvas.current;
      c.width = Math.floor(viewport.width);
      c.height = Math.floor(viewport.height);
      const t = page.render({ canvas: c, canvasContext: c.getContext('2d')!, viewport });
      task = t;
      await t.promise.catch(() => undefined);
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [visible, width, doc, n]);

  return <canvas ref={canvas} className="mx-auto block bg-white shadow-sm ring-1 ring-line" style={{ width, height: width * r }} aria-label={`page ${n}`} />;
}

/** In-app PDF reader (works the same in every browser, including phones and Brave). */
export function PdfViewer({ url, title, fill = false }: { url: string; title: string; fill?: boolean }) {
  const { t } = useT();
  const box = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [ratio, setRatio] = useState(1.414);
  const [error, setError] = useState(false);
  const [boxWidth, setBoxWidth] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let alive = true;
    let loading: { destroy: () => Promise<void> } | null = null;
    setDoc(null);
    setError(false);
    loadPdfJs()
      .then((pdfjs) => {
        const task = pdfjs.getDocument({ url });
        loading = task;
        return task.promise;
      })
      .then(async (d) => {
        const p = await d.getPage(1);
        const v = p.getViewport({ scale: 1 });
        if (!alive) return;
        setRatio(v.height / v.width);
        setDoc(d);
      })
      .catch((e) => {
        console.error('[pdf]', e);
        if (alive) setError(true);
      });
    return () => {
      alive = false;
      void loading?.destroy();
    };
  }, [url]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    ro.observe(el);
    setBoxWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const width = Math.max(200, Math.round((boxWidth - 32) * zoom));

  return (
    <div className={fill ? 'flex h-full flex-col' : ''}>
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2 text-xs text-muted">
        {doc && (
          <span className="tabular-nums">
            {doc.numPages} {t('sup.pages')}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          <button className="btn-ghost btn-sm !min-h-[30px] !px-2.5" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} aria-label="zoom out">
            −
          </button>
          <span className="w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button className="btn-ghost btn-sm !min-h-[30px] !px-2.5" onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} aria-label="zoom in">
            +
          </button>
        </span>
      </div>
      <div ref={box} className={`scroll-thin overflow-auto bg-surface2 py-4 ${fill ? 'min-h-0 flex-1' : 'h-[78vh]'}`} data-testid="pdf-viewer">
        {error ? (
          <p className="flex items-center justify-center gap-2 p-10 text-sm text-bad">
            <Icon name="alert" size={16} /> {t('sup.error')}
          </p>
        ) : !doc ? (
          <p className="flex items-center justify-center gap-3 p-10 text-sm text-muted" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" /> {t('common.loading')}
          </p>
        ) : (
          <div className="space-y-4 px-4" aria-label={title}>
            {Array.from({ length: doc.numPages }, (_, i) => (
              <Page key={i} doc={doc} n={i + 1} width={width} ratio={ratio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
