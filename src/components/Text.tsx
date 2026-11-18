import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ini';
import type { L10n } from '../lib/schema';
import { useStore } from '../store/store';
import { useT } from '../hooks/useT';

/** Inline markdown: **bold**, *italic*, `code`, $tex$, [link](url). */
function inline(s: string, key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    const k = `${key}-${i++}`;
    if (tok.startsWith('**')) out.push(<strong key={k}>{inline(tok.slice(2, -2), i)}</strong>);
    else if (tok.startsWith('`')) out.push(<code key={k}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith('$')) out.push(<Tex key={k} tex={tok.slice(1, -1)} />);
    else if (tok.startsWith('[')) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)!;
      out.push(
        <a key={k} href={mm[2]} target={mm[2].startsWith('http') ? '_blank' : undefined} rel="noreferrer">
          {mm[1]}
        </a>
      );
    } else out.push(<em key={k}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Block markdown: paragraphs, - lists, 1. lists. */
export function Md({ text, className = '' }: { text: string; className?: string }) {
  const blocks = useMemo(() => text.split(/\n{2,}/), [text]);
  return (
    <div className={`prose-rev ${className}`}>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*[-•]\s/.test(l)))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-•]\s/, ''), j)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\s*\d+[.)]\s/.test(l)))
          return (
            <ol key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s/, ''), j)}</li>
              ))}
            </ol>
          );
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l, j)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/** Localised text. In bilingual mode, French is shown alongside the chosen language. */
export function L({ v, md = false, className = '', inlineOnly = false }: { v: L10n | string | undefined; md?: boolean; className?: string; inlineOnly?: boolean }) {
  const lang = useStore((s) => s.lang);
  const bilingual = useStore((s) => s.bilingual);
  const { t } = useT();
  if (v === undefined) return null;
  if (typeof v === 'string') return md ? <Md text={v} className={className} /> : <span className={className}>{inlineOnly ? inline(v) : v}</span>;
  const main = v[lang] || v.fr;
  const fallback = lang !== 'fr' && !v[lang];
  const render = (s: string) => (md ? <Md text={s} /> : <>{inline(s)}</>);
  if (bilingual && lang !== 'fr' && !fallback) {
    return (
      <span className={`grid gap-1 ${md ? 'sm:grid-cols-2 sm:gap-4' : ''} ${className}`}>
        <span lang="fr" className="block">
          {render(v.fr)}
        </span>
        <span lang={lang === 'dar' ? 'ar-Latn' : 'en'} className="block border-l-2 border-accent2/60 pl-2 text-muted">
          {render(main)}
        </span>
      </span>
    );
  }
  const Tag = md ? 'div' : 'span';
  return (
    <Tag className={className} title={bilingual && lang === 'fr' ? undefined : undefined}>
      {render(main)}
      {fallback && (
        <span className="chip ml-1 !px-1.5 !py-0 align-middle" title={t('lang.fallback')}>
          FR
        </span>
      )}
    </Tag>
  );
}

type Katex = typeof import('katex');
let katexLib: Katex | null = null;
let katexLoading: Promise<Katex> | null = null;
/** KaTeX (≈260 KB) is loaded only when a formula is first displayed. */
function loadKatex(): Promise<Katex> {
  katexLoading ??= Promise.all([import('katex'), import('katex/dist/katex.min.css')]).then(([m]) => (katexLib = (m as unknown as { default: Katex }).default ?? m));
  return katexLoading;
}

export function Tex({ tex, block = false }: { tex: string; block?: boolean }) {
  const [k, setK] = useState<Katex | null>(katexLib);
  useEffect(() => {
    if (!k) loadKatex().then(setK);
  }, [k]);
  const html = useMemo(() => {
    if (!k) return null;
    try {
      return k.renderToString(tex, { displayMode: block, throwOnError: false, strict: false });
    } catch {
      return tex;
    }
  }, [tex, block, k]);
  if (html === null) return block ? <div className="my-2 font-mono text-sm text-muted">{tex}</div> : <span className="font-mono text-muted">{tex}</span>;
  return block ? <div className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} /> : <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Code({ code, lang = 'bash', className = '' }: { code: string; lang?: string; className?: string }) {
  const html = useMemo(() => {
    const g = Prism.languages[lang === 'text' ? 'plain' : lang];
    return g ? Prism.highlight(code, g, lang) : code.replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;'));
  }, [code, lang]);
  return (
    <pre className={`overflow-x-auto rounded-xl border border-line bg-surface2 p-3 text-[13px] leading-relaxed ${className}`}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
