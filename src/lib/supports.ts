/**
 * Course materials (original PDFs from the Drive), served as static files.
 * Drop a file into  cours/<module>/  (module = data | ro | oracle | linux | ml | virtualisation) and rebuild: it appears automatically.
 * File name convention:  "NN - Type - Title.pdf"   e.g. "02 - Cours - Chapitre 1 - pandas.pdf"
 *   NN    = order in the list
 *   Type  = Cours | TD | TP | Contrôle | Examen | Annexe   (guessed from the title if missing)
 */
const files = import.meta.glob('/cours/**/*.{pdf,PDF,pptx,docx}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export type SupportKind = 'cours' | 'td' | 'tp' | 'controle' | 'annexe';

export interface Support {
  module: string;
  order: number;
  kind: SupportKind;
  title: string;
  url: string;
  ext: string;
  file: string;
}

const KINDS: [RegExp, SupportKind][] = [
  [/^(contr[oô]le|examen|annale|cc)(\d|\b)/i, 'controle'],
  [/^td(\d|\b)/i, 'td'],
  [/^tp(\d|\b)/i, 'tp'],
  [/^(cours|chap|chapitre)\b/i, 'cours'],
  [/^annexe\b/i, 'annexe']
];

function guessKind(s: string): SupportKind | null {
  for (const [re, k] of KINDS) if (re.test(s.trim())) return k;
  return null;
}

export function parseSupport(path: string, url: string): Support | null {
  const m = /^\/cours\/([^/]+)\/(.+)\.([a-z]+)$/i.exec(path);
  if (!m) return null;
  const [, module, base, ext] = m;
  const parts = base.split(/\s+-\s+/);
  let order = 999;
  if (/^\d+$/.test(parts[0] ?? '')) order = Number(parts.shift());
  let kind = guessKind(parts[0] ?? '');
  if (kind && parts.length > 1 && /^(cours|td|tp|contr[oô]le|examen|annexe)$/i.test(parts[0])) parts.shift();
  const title = parts.join(' – ').trim() || base;
  kind ??= guessKind(title) ?? 'cours';
  return { module, order, kind, title, url, ext: ext.toLowerCase(), file: `${base}.${ext}` };
}

export const SUPPORTS: Support[] = Object.entries(files)
  .map(([p, u]) => parseSupport(p, u))
  .filter((x): x is Support => !!x)
  .sort((a, b) => a.module.localeCompare(b.module) || a.order - b.order || a.title.localeCompare(b.title));

/** Library sections for subjects that have documents but no interactive module (yet). */
export const EXTRA_SUBJECTS: { id: string; icon: string; color: string; title: { fr: string; dar: string; en: string } }[] = [
  { id: 'ml', icon: 'sparkles', color: '#1f6f5c', title: { fr: 'Machine Learning et IA', dar: 'Machine Learning w IA', en: 'Machine learning and AI' } },
  { id: 'virtualisation', icon: 'layers', color: '#3d5a80', title: { fr: 'Virtualisation et Cloud', dar: 'Virtualisation w Cloud', en: 'Virtualisation and cloud' } }
];

export const supportsOf = (module: string) => SUPPORTS.filter((s) => s.module === module);
