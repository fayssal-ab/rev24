/** Node-side content loader (same assembly as the app, reading JSON from disk). */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Module } from '../src/lib/schema';

export const CONTENT = join(process.cwd(), 'src/content');

export function listJson(dir: string): string[] {
  const out: string[] = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...listJson(p));
    else if (f.endsWith('.json')) out.push(p);
  }
  return out;
}

export function moduleDirs(): string[] {
  if (!existsSync(CONTENT)) return [];
  return readdirSync(CONTENT).filter((d) => existsSync(join(CONTENT, d, 'module.json')));
}

export function readModuleFiles(id: string): { module: Module; files: { path: string; data: unknown }[] } {
  const dir = join(CONTENT, id);
  const module = JSON.parse(readFileSync(join(dir, 'module.json'), 'utf8')) as Module;
  const files = listJson(dir)
    .filter((p) => !p.endsWith('module.json'))
    .map((p) => ({ path: '/' + relative(CONTENT, p).replace(/\\/g, '/'), data: JSON.parse(readFileSync(p, 'utf8')) as unknown }));
  return { module, files };
}
