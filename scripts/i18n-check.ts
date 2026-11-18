/** Lists every localised string missing a translation (fr / dar / en). Exits 1 if any is missing. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { UI } from '../src/i18n/ui';
import * as AL from '../src/i18n/animLinux';
import * as AD from '../src/i18n/animData';
import { moduleDirs, readModuleFiles } from './load';

const LANGS = ['fr', 'dar', 'en'] as const;
const missing: string[] = [];
let total = 0;

function walk(v: unknown, path: string) {
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.fr === 'string') {
      total++;
      for (const l of LANGS) if (typeof o[l] !== 'string' || !(o[l] as string).trim()) missing.push(`${path}.${l}`);
      return;
    }
    for (const [k, x] of Object.entries(o)) walk(x, path ? `${path}.${k}` : k);
  }
}

walk(UI, 'ui');
walk(AL, 'animLinux');
walk(AD, 'animData');
for (const id of moduleDirs()) {
  const { module, files } = readModuleFiles(id);
  walk(module, `${id}/module.json`);
  for (const f of files) walk(f.data, f.path);
}

// every t('key') used in the source must exist in the UI dictionary
function src(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? src(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
}
const keys = new Set(Object.keys(UI));
for (const file of src(join(process.cwd(), 'src'))) {
  const txt = readFileSync(file, 'utf8');
  for (const m of txt.matchAll(/\bt\(\s*'([a-z0-9]+\.[\w.]+)'/gi)) if (!keys.has(m[1])) missing.push(`${file}: unknown UI key '${m[1]}'`);
}

if (missing.length) {
  console.error(`✗ i18n:check — ${missing.length} missing translation(s) out of ${total} strings:\n` + missing.slice(0, 200).map((m) => ' - ' + m).join('\n'));
  process.exit(1);
}
console.log(`✓ i18n:check — ${total} localised strings, 0 missing (fr / dar / en)`);
