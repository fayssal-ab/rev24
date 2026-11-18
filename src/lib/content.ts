import type { Module, L10n, Lang } from './schema';
import { assemble, type ModuleContent } from './assemble';
export { assemble, type ModuleContent };

const moduleFiles = import.meta.glob<{ default: Module }>('../content/*/module.json', { eager: true });
const allFiles = import.meta.glob<{ default: unknown }>('../content/*/**/*.json');

/** All modules (small metadata, loaded eagerly). Adding a folder in src/content adds a module. */
export const MODULES: Module[] = Object.values(moduleFiles)
  .map((m) => m.default)
  .sort((a, b) => a.id.localeCompare(b.id));

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

const cache = new Map<string, Promise<ModuleContent>>();

export function loadModule(id: string): Promise<ModuleContent> {
  if (!cache.has(id)) {
    const module = getModule(id);
    if (!module) return Promise.reject(new Error(`Module inconnu : ${id}`));
    const entries = Object.entries(allFiles).filter(([p]) => p.startsWith(`../content/${id}/`) && !p.endsWith('/module.json'));
    cache.set(
      id,
      Promise.all(entries.map(async ([path, load]) => ({ path, data: (await load()).default }))).then((files) => assemble(module, files))
    );
  }
  return cache.get(id)!;
}

export function tr(s: L10n | string | undefined, lang: Lang): string {
  if (s === undefined) return '';
  if (typeof s === 'string') return s;
  return s[lang] || s.fr;
}

export function isFallback(s: L10n | string | undefined, lang: Lang): boolean {
  return typeof s === 'object' && !!s && lang !== 'fr' && !s[lang];
}
