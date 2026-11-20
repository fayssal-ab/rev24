/**
 * Course materials (original PDFs from the Drive), served as static files.
 * Drop a file into  cours/<module>/  (module = data | ro | oracle | linux | ml | ia | virtualisation | nosql | dotnet | mobile | …, see EXTRA_SUBJECTS) and rebuild: it appears automatically.
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

/**
 * Library sections for subjects that have documents but no interactive module (yet).
 * Every module of the 4IIR 22 S1 timetable is listed, even without files: the admin can add links to them.
 */
export const EXTRA_SUBJECTS: { id: string; icon: string; color: string; title: { fr: string; dar: string; en: string } }[] = [
  { id: 'ml', icon: 'sparkles', color: '#1f6f5c', title: { fr: 'Machine Learning', dar: 'Machine Learning', en: 'Machine learning' } },
  { id: 'ia', icon: 'scale', color: '#6b4c9a', title: { fr: 'Introduction et éthique de l\'IA', dar: 'Introduction w éthique dyal IA', en: 'Introduction to AI and ethics' } },
  { id: 'virtualisation', icon: 'layers', color: '#3d5a80', title: { fr: 'Virtualisation et Cloud', dar: 'Virtualisation w Cloud', en: 'Virtualisation and cloud' } },
  { id: 'nosql', icon: 'database', color: '#2f7d4f', title: { fr: 'NoSQL', dar: 'NoSQL', en: 'NoSQL' } },
  { id: 'dotnet', icon: 'code', color: '#5c3d99', title: { fr: '.NET (C# et ASP.NET MVC)', dar: '.NET (C# w ASP.NET MVC)', en: '.NET (C# and ASP.NET MVC)' } },
  { id: 'mobile', icon: 'phone', color: '#0f6f8f', title: { fr: 'Développement mobile (Flutter)', dar: 'Développement mobile (Flutter)', en: 'Mobile development (Flutter)' } },
  { id: 'progav', icon: 'bolt', color: '#8a5a1c', title: { fr: 'Programmation avancée', dar: 'Programmation avancée', en: 'Advanced programming' } },
  { id: 'compro', icon: 'chat', color: '#a0483c', title: { fr: 'Communication professionnelle 3', dar: 'Communication professionnelle 3', en: 'Professional communication 3' } },
  { id: 'english', icon: 'globe', color: '#4a5d7a', title: { fr: 'Advanced English 1', dar: 'Advanced English 1', en: 'Advanced English 1' } }
];

/** Weekly slots, from the official timetable (4IIR 22, S1, in force from 05/10/2026). */
export const SCHEDULE: Record<string, string> = {
  ro: 'Lundi 08h30–10h00',
  virtualisation: 'Lundi 10h15–11h45',
  linux: 'Mardi 08h30–11h45 (G1 puis G2)',
  nosql: 'Mardi 08h30–11h45 (G2 puis G1)',
  compro: 'Mercredi 10h15–11h45',
  dotnet: 'Mercredi 14h00–16h00',
  data: 'Mercredi 16h15–17h45',
  progav: 'Jeudi 10h45–12h15',
  ml: 'Vendredi 08h30–10h00',
  ia: 'Vendredi 10h15–11h45',
  english: 'Vendredi 16h45–18h15',
  oracle: 'Samedi 08h30–11h45 (G1 puis G2)',
  mobile: 'Samedi 08h30–11h45 (G2 puis G1)'
};

export const supportsOf = (module: string) => SUPPORTS.filter((s) => s.module === module);
