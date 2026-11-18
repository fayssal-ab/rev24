import { useCallback } from 'react';
import { useStore } from '../store/store';
import { UI, type UIKey } from '../i18n/ui';
import type { L10n, Lang } from '../lib/schema';

export function fmt(s: string, vars?: Record<string, string | number>) {
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')) : s;
}

export function translate(key: UIKey, lang: Lang, vars?: Record<string, string | number>) {
  const e = UI[key] as L10n;
  return fmt(e[lang] || e.fr, vars);
}

/** Translation hook for UI strings. */
export function useT() {
  const lang = useStore((s) => s.lang);
  const t = useCallback((key: UIKey, vars?: Record<string, string | number>) => translate(key, lang, vars), [lang]);
  return { t, lang };
}

/** Pick a localised value. */
export function useL() {
  const lang = useStore((s) => s.lang);
  return useCallback(
    (v: L10n | string | undefined) => {
      if (v === undefined) return '';
      if (typeof v === 'string') return v;
      // Darija text is often a short summary: append the full French explanation so no content is lost
      if (lang === 'dar' && v.dar && v.fr && v.dar !== v.fr && v.fr.length > 60 && v.dar.length < v.fr.length * 0.5) return `${v.dar}\n\n${v.fr}`;
      return v[lang] || v.fr;
    },
    [lang]
  );
}
