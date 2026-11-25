/**
 * Academic catalogue: every subject (interactive modules + document-only subjects) and every resource
 * (the professors' original files, plus the revision sheets the site generates), with their metadata.
 * Everything here is real data: files from cours/, page counts and dates from cours/catalog.json.
 */
import type { L10n } from './schema';
import { MODULES } from './content';
import { EXTRA_SUBJECTS, SUPPORTS, type SupportKind } from './supports';
import meta from '../../cours/catalog.json';

export const FILIERE = { id: '4IIR', title: { fr: 'Ingénierie Informatique et Réseaux', dar: 'Ingénierie Informatique et Réseaux', en: 'Computer and Network Engineering' } };
export const ACADEMIC_YEAR = '2026/2027';
/** All the material on the site is from the autumn semester of 4IIR. */
export const SEMESTER = { id: 'S1', title: { fr: 'Semestre 1', dar: 'Semestre 1', en: 'Semester 1' } };

export type ResourceKind = SupportKind | 'resume';
export const KINDS: ResourceKind[] = ['cours', 'td', 'tp', 'controle', 'resume', 'annexe'];

export interface Subject {
  id: string;
  title: L10n;
  subtitle?: L10n;
  icon: string;
  color: string;
  /** has interactive lessons / quizzes on the site */
  interactive: boolean;
  filiere: string;
  semester: string;
}

export interface Resource {
  id: string;
  subject: string;
  kind: ResourceKind;
  title: string;
  ext: string;
  /** file URL, or in-app route for generated revision sheets */
  url: string;
  route?: string;
  file?: string;
  order: number;
  date: string | null;
  pages: number | null;
  size: number | null;
}

const META = meta as Record<string, { pages: number | null; date: string | null; size: number }>;

export const SUBJECTS: Subject[] = [
  ...MODULES.map((m) => ({ id: m.id, title: m.title, subtitle: m.subtitle, icon: m.icon, color: m.color, interactive: true, filiere: FILIERE.id, semester: SEMESTER.id })),
  ...EXTRA_SUBJECTS.map((x) => ({ id: x.id, title: x.title, icon: x.icon, color: x.color, interactive: false, filiere: FILIERE.id, semester: SEMESTER.id }))
];
export const subjectById = (id: string) => SUBJECTS.find((s) => s.id === id);

const files: Resource[] = SUPPORTS.map((s) => {
  const m = META[`${s.module}/${s.file}`] ?? null;
  return { id: `${s.module}/${s.file}`, subject: s.module, kind: s.kind, title: s.title, ext: s.ext, url: s.url, file: s.file, order: s.order, date: m?.date ?? null, pages: m?.pages ?? null, size: m?.size ?? null };
});

/** Each interactive module has a generated revision sheet ("fiche") — listed as a summary. */
const sheets: Resource[] = MODULES.map((m) => ({
  id: `${m.id}/fiche`,
  subject: m.id,
  kind: 'resume' as const,
  title: `Fiche de révision — ${m.title.fr}`,
  ext: 'web',
  url: '',
  route: `/m/${m.id}/fiche`,
  order: 900,
  date: null,
  pages: null,
  size: null
}));

export const RESOURCES: Resource[] = [...files, ...sheets];



export function formatSize(bytes: number | null) {
  if (!bytes) return '';
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} Mo` : `${Math.round(bytes / 1000)} Ko`;
}

export function formatDate(iso: string | null, lang: string) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Accent-insensitive text match used by search and filters. */
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
