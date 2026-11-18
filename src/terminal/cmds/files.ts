import { ok, fail, nl, type CmdFn, type Ctx, type CmdRes, type Shell } from '../shell';
import { lookup, can, modeString, sizeOf, lsDate, walk, globRe, dirname, basename, normPath, traverseDenied, type FNode } from '../vfs';

/** Split args into short flags (as a set of letters), long flags and operands. `--` ends options. */
export function opts(args: string[], withValue = ''): { f: Set<string>; long: string[]; vals: Record<string, string>; pos: string[] } {
  const f = new Set<string>();
  const long: string[] = [];
  const vals: Record<string, string> = {};
  const pos: string[] = [];
  let end = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (end || a === '-' || !a.startsWith('-') || /^-\d+$/.test(a) && !withValue.includes('n')) {
      pos.push(a);
      continue;
    }
    if (a === '--') {
      end = true;
      continue;
    }
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > 0) vals[a.slice(2, eq)] = a.slice(eq + 1);
      long.push(eq > 0 ? a.slice(2, eq) : a.slice(2));
      continue;
    }
    for (let j = 1; j < a.length; j++) {
      const l = a[j];
      f.add(l);
      if (withValue.includes(l)) {
        vals[l] = a.slice(j + 1) || args[++i] || '';
        break;
      }
    }
  }
  return { f, long, vals, pos };
}

function humanSize(n: number): string {
  if (n < 1024) return String(n);
  const u = ['K', 'M', 'G', 'T'];
  let v = n;
  let i = -1;
  do {
    v /= 1024;
    i++;
  } while (v >= 1024 && i < u.length - 1);
  return (v < 10 ? v.toFixed(1).replace('.', ',') : String(Math.round(v))) + u[i];
}

const ENOENT = 'Aucun fichier ou dossier de ce type';
const EACCES = 'Permission non accordée';

function lsLine(sh: Shell, name: string, n: FNode, human: boolean): string {
  const links = n.t === 'd' ? 2 + Object.values(n.kids ?? {}).filter((k) => k.t === 'd').length : 1;
  const size = human ? humanSize(sizeOf(n)) : String(sizeOf(n));
  const tgt = n.t === 'l' ? ` -> ${n.target}` : '';
  return `${modeString(n)}. ${links} ${sh.userName(n.uid)} ${sh.groupName(n.gid)} ${size.padStart(human ? 4 : 5, ' ')} ${lsDate(n.mtime)} ${name}${tgt}`;
}

export const ls: CmdFn = ({ args, sh }) => {
  const { f, pos } = opts(args.filter((a) => !a.startsWith('--color')));
  const long = f.has('l');
  const all = f.has('a');
  const almost = f.has('A');
  const dirOnly = f.has('d');
  const rec = f.has('R');
  const human = f.has('h');
  const targets = pos.length ? pos : ['.'];
  let out = '';
  let err = '';
  let code = 0;
  const listDir = (label: string, abs: string, showLabel: boolean): string => {
    const n = lookup(sh.state.root, abs)!;
    if (!can(n, sh.who(), 'r')) {
      err += `ls: impossible d'ouvrir le répertoire '${label}': ${EACCES}\n`;
      code = 2;
      return '';
    }
    let names = Object.keys(n.kids!).sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''), 'fr'));
    if (!all && !almost) names = names.filter((x) => !x.startsWith('.'));
    if (all) names = ['.', '..', ...names];
    let s = showLabel ? `${label}:\n` : '';
    if (long) {
      const total = names.reduce((a, k) => a + Math.ceil(sizeOf(k === '.' ? n : k === '..' ? lookup(sh.state.root, dirname(abs))! : n.kids![k]) / 1024), 0);
      s += `total ${total}\n`;
      for (const k of names) {
        const child = k === '.' ? n : k === '..' ? lookup(sh.state.root, dirname(abs))! : n.kids![k];
        s += lsLine(sh, k, child, human) + '\n';
      }
    } else if (names.length) s += names.join('  ') + '\n';
    if (rec) {
      for (const k of names) {
        if (k === '.' || k === '..') continue;
        const child = n.kids![k];
        if (child.t === 'd') s += '\n' + listDir(label === '/' ? `/${k}` : `${label}/${k}`, abs === '/' ? `/${k}` : `${abs}/${k}`, true);
      }
    }
    return s;
  };
  const files: string[] = [];
  const dirs: string[] = [];
  for (const t of targets) {
    const abs = sh.abs(t);
    if (traverseDenied(sh.state.root, abs, sh.who())) {
      err += `ls: impossible d'accéder à '${t}': ${EACCES}\n`;
      code = 2;
      continue;
    }
    const n = lookup(sh.state.root, abs, !long || !dirOnly);
    const nl2 = lookup(sh.state.root, abs, false);
    if (!n && !nl2) {
      err += `ls: impossible d'accéder à '${t}': ${ENOENT}\n`;
      code = 2;
      continue;
    }
    if ((n && n.t === 'd' && !dirOnly && !(long && nl2?.t === 'l' && !t.endsWith('/')))) dirs.push(t);
    else files.push(t);
  }
  for (const t of files) {
    const n = lookup(sh.state.root, sh.abs(t), false)!;
    out += long ? lsLine(sh, t, n, human) + '\n' : t + '\n';
  }
  if (!long && files.length) out = files.join('  ') + '\n';
  dirs.forEach((t, i) => {
    if (i > 0 || files.length) out += '\n';
    out += listDir(t, sh.abs(t), targets.length > 1 || rec);
  });
  return { out, err, code };
};

export const pwd: CmdFn = ({ sh }) => ok(sh.session.cwd + '\n');

export const cd: CmdFn = ({ args, sh }) => {
  const t = args[0] === undefined || args[0] === '~' ? sh.session.env.HOME : args[0] === '-' ? sh.session.env.OLDPWD ?? sh.session.cwd : args[0];
  const abs = sh.abs(t);
  const n = lookup(sh.state.root, abs);
  if (!n) return fail(`bash: cd: ${t}: ${ENOENT}`);
  if (n.t !== 'd') return fail(`bash: cd: ${t}: N'est pas un dossier`);
  if (traverseDenied(sh.state.root, abs, sh.who()) || !can(n, sh.who(), 'x')) return fail(`bash: cd: ${t}: ${EACCES}`);
  sh.session.env.OLDPWD = sh.session.cwd;
  sh.session.cwd = abs;
  return ok(args[0] === '-' ? abs + '\n' : '');
};

export const mkdir: CmdFn = ({ args, sh }) => {
  const { f, vals, pos } = opts(args, 'm');
  if (!pos.length) return fail("mkdir: opérande manquant\nSaisissez « mkdir --help » pour plus d'informations.");
  let err = '';
  let out = '';
  for (const t of pos) {
    const abs = sh.abs(t);
    const parts = abs.split('/').filter(Boolean);
    if (f.has('p')) {
      let cur = '';
      for (const p of parts) {
        cur += '/' + p;
        const n = lookup(sh.state.root, cur);
        if (n) {
          if (n.t !== 'd') {
            err += `mkdir: impossible de créer le répertoire « ${t} »: Le fichier existe\n`;
            break;
          }
          continue;
        }
        const e = sh.canWriteDir(dirname(cur));
        if (e) {
          err += `mkdir: impossible de créer le répertoire « ${t} »: ${e === 'EROFS' ? 'Système de fichiers accessible en lecture seulement' : EACCES}\n`;
          break;
        }
        const d = sh.mkdirNode(cur);
        if (vals.m) d.mode = parseInt(vals.m, 8);
        if (f.has('v')) out += `mkdir: création du répertoire '${cur}'\n`;
      }
      continue;
    }
    if (lookup(sh.state.root, abs, false)) {
      err += `mkdir: impossible de créer le répertoire « ${t} »: Le fichier existe\n`;
      continue;
    }
    const e = sh.canWriteDir(dirname(abs));
    if (e === 'ENOENT') err += `mkdir: impossible de créer le répertoire « ${t} »: ${ENOENT}\n`;
    else if (e === 'ENOTDIR') err += `mkdir: impossible de créer le répertoire « ${t} »: N'est pas un dossier\n`;
    else if (e === 'EROFS') err += `mkdir: impossible de créer le répertoire « ${t} »: Système de fichiers accessible en lecture seulement\n`;
    else if (e) err += `mkdir: impossible de créer le répertoire « ${t} »: ${EACCES}\n`;
    else {
      const d = sh.mkdirNode(abs);
      if (vals.m) d.mode = parseInt(vals.m, 8);
      if (f.has('v')) out += `mkdir: création du répertoire '${t}'\n`;
    }
  }
  return { out, err, code: err ? 1 : 0 };
};

export const rmdir: CmdFn = ({ args, sh }) => {
  let err = '';
  for (const t of args.filter((a) => !a.startsWith('-'))) {
    const abs = sh.abs(t);
    const n = lookup(sh.state.root, abs, false);
    if (!n) err += `rmdir: impossible de supprimer '${t}': ${ENOENT}\n`;
    else if (n.t !== 'd') err += `rmdir: impossible de supprimer '${t}': N'est pas un dossier\n`;
    else if (Object.keys(n.kids!).length) err += `rmdir: impossible de supprimer '${t}': Le dossier n'est pas vide\n`;
    else if (sh.canWriteDir(dirname(abs))) err += `rmdir: impossible de supprimer '${t}': ${EACCES}\n`;
    else delete lookup(sh.state.root, dirname(abs))!.kids![basename(abs)];
  }
  return { out: '', err, code: err ? 1 : 0 };
};

export const touch: CmdFn = ({ args, sh }) => {
  const { pos } = opts(args);
  if (!pos.length) return fail("touch: opérande de fichier manquant\nSaisissez « touch --help » pour plus d'informations.");
  let err = '';
  for (const t of pos) {
    const n = sh.node(t);
    if (n) {
      if (n.uid !== sh.who().uid && !can(n, sh.who(), 'w')) err += `touch: impossible de faire un touch '${t}': ${EACCES}\n`;
      else n.mtime = Date.now();
      continue;
    }
    const e = sh.writeFile(t, '');
    if (e) err += `touch: impossible de faire un touch '${t}': ${e}\n`;
  }
  return { out: '', err, code: err ? 1 : 0 };
};

function clone(n: FNode, uid: number, gid: number, preserve: boolean): FNode {
  const c: FNode = JSON.parse(JSON.stringify(n));
  const fix = (x: FNode) => {
    if (!preserve) {
      x.uid = uid;
      x.gid = gid;
      x.mtime = Date.now();
    }
    if (x.kids) Object.values(x.kids).forEach(fix);
  };
  fix(c);
  return c;
}

export const cp: CmdFn = ({ args, sh }) => {
  const { f, pos } = opts(args);
  if (pos.length < 2) return fail(pos.length ? `cp: opérande de fichier cible manquant après '${pos[0]}'` : 'cp: opérande de fichier manquant');
  const rec = f.has('r') || f.has('R') || f.has('a');
  const preserve = f.has('p') || f.has('a');
  const dest = pos[pos.length - 1];
  const srcs = pos.slice(0, -1);
  const destAbs = sh.abs(dest);
  const destNode = lookup(sh.state.root, destAbs);
  if (srcs.length > 1 && (!destNode || destNode.t !== 'd')) return fail(`cp: la cible '${dest}' n'est pas un répertoire`);
  let err = '';
  let out = '';
  for (const s of srcs) {
    const sAbs = sh.abs(s);
    const sn = lookup(sh.state.root, sAbs);
    if (!sn) {
      err += `cp: impossible d'évaluer '${s}': ${ENOENT}\n`;
      continue;
    }
    if (sn.t === 'd' && !rec) {
      err += `cp: -r non spécifié ; omission du répertoire '${s}'\n`;
      continue;
    }
    if (traverseDenied(sh.state.root, sAbs, sh.who()) || !can(sn, sh.who(), 'r')) {
      err += `cp: impossible d'ouvrir '${s}' en lecture: ${EACCES}\n`;
      continue;
    }
    const target = destNode && destNode.t === 'd' ? (destAbs === '/' ? `/${basename(sAbs)}` : `${destAbs}/${basename(sAbs)}`) : destAbs;
    const existing = lookup(sh.state.root, target);
    if (existing && existing.t === 'f' && sn.t === 'f') {
      const e = sh.writeFile(target, sn.data ?? '');
      if (e) err += `cp: impossible de créer le fichier standard '${target}': ${e}\n`;
      else if (preserve) Object.assign(existing, { mode: sn.mode, uid: sh.isRoot ? sn.uid : existing.uid, gid: sh.isRoot ? sn.gid : existing.gid, mtime: sn.mtime });
      continue;
    }
    const e = sh.canWriteDir(dirname(target));
    if (e) {
      err += `cp: impossible de créer le fichier standard '${target}': ${e === 'ENOENT' ? ENOENT : EACCES}\n`;
      continue;
    }
    const who = sh.who();
    const c = clone(sn, who.uid, sh.getUser(sh.user)?.gid ?? 0, preserve && who.uid === 0);
    if (preserve && who.uid !== 0) c.mtime = sn.mtime;
    lookup(sh.state.root, dirname(target))!.kids![basename(target)] = c;
    if (f.has('v')) out += `'${s}' -> '${target}'\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

export const mv: CmdFn = ({ args, sh }) => {
  const { f, pos } = opts(args);
  if (pos.length < 2) return fail('mv: opérande de fichier manquant');
  const dest = pos[pos.length - 1];
  const destAbs = sh.abs(dest);
  const destNode = lookup(sh.state.root, destAbs);
  let err = '';
  let out = '';
  for (const s of pos.slice(0, -1)) {
    const sAbs = sh.abs(s);
    const sn = lookup(sh.state.root, sAbs, false);
    if (!sn) {
      err += `mv: impossible d'évaluer '${s}': ${ENOENT}\n`;
      continue;
    }
    const target = destNode && destNode.t === 'd' ? (destAbs === '/' ? `/${basename(sAbs)}` : `${destAbs}/${basename(sAbs)}`) : destAbs;
    if (sh.canWriteDir(dirname(sAbs)) || sh.canWriteDir(dirname(target))) {
      err += `mv: impossible de déplacer '${s}' vers '${target}': ${EACCES}\n`;
      continue;
    }
    if (target === sAbs || target.startsWith(sAbs + '/')) {
      err += `mv: impossible de déplacer '${s}' vers un sous-répertoire de lui-même, '${target}'\n`;
      continue;
    }
    delete lookup(sh.state.root, dirname(sAbs))!.kids![basename(sAbs)];
    lookup(sh.state.root, dirname(target))!.kids![basename(target)] = sn;
    if (f.has('v')) out += `renommé '${s}' -> '${target}'\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

export const rm: CmdFn = ({ args, sh }) => {
  const { f, pos } = opts(args);
  const rec = f.has('r') || f.has('R');
  const force = f.has('f');
  if (!pos.length) return force ? ok() : fail("rm: opérande manquant\nSaisissez « rm --help » pour plus d'informations.");
  let err = '';
  let out = '';
  for (const t of pos) {
    const abs = sh.abs(t);
    if (abs === '/' && rec) {
      err += "rm: il est dangereux d'opérer récursivement sur '/'\nrm: utilisez --no-preserve-root pour inhiber cette sécurité\n";
      continue;
    }
    const n = lookup(sh.state.root, abs, false);
    if (!n) {
      if (!force) err += `rm: impossible de supprimer '${t}': ${ENOENT}\n`;
      continue;
    }
    if (n.t === 'd' && !rec) {
      err += `rm: impossible de supprimer '${t}': est un dossier\n`;
      continue;
    }
    const e = sh.canWriteDir(dirname(abs));
    if (e) {
      err += `rm: impossible de supprimer '${t}': ${e === 'EROFS' ? 'Système de fichiers accessible en lecture seulement' : EACCES}\n`;
      continue;
    }
    const parent = lookup(sh.state.root, dirname(abs))!;
    // sticky bit on /tmp: only owner may delete
    if (parent.mode & 0o1000 && sh.who().uid !== 0 && n.uid !== sh.who().uid && parent.uid !== sh.who().uid) {
      err += `rm: impossible de supprimer '${t}': Opération non permise\n`;
      continue;
    }
    if (n.t === 'd' && rec && sh.who().uid !== 0) {
      // need write permission on the directory itself to empty it
      if (Object.keys(n.kids!).length && !can(n, sh.who(), 'w')) {
        err += `rm: impossible de supprimer '${t}': ${EACCES}\n`;
        continue;
      }
    }
    delete parent.kids![basename(abs)];
    if (f.has('v')) out += `'${t}' supprimé\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

export const cat: CmdFn = ({ args, sh, stdin }) => {
  const { f, pos } = opts(args);
  if (!pos.length) return ok(stdin ?? '');
  let out = '';
  let err = '';
  for (const t of pos) {
    if (t === '-') {
      out += stdin ?? '';
      continue;
    }
    const r = sh.readFile(t);
    if (r.err) err += `cat: ${t}: ${r.err}\n`;
    else out += r.data;
  }
  if (f.has('n')) out = out.replace(/\n$/, '').split('\n').map((l, i) => `${String(i + 1).padStart(6, ' ')}\t${l}`).join('\n') + '\n';
  return { out, err, code: err ? 1 : 0 };
};

export const echo: CmdFn = ({ args }) => {
  let a = args;
  let newline = true;
  let esc = false;
  while (a[0] && /^-[neE]+$/.test(a[0])) {
    if (a[0].includes('n')) newline = false;
    if (a[0].includes('e')) esc = true;
    a = a.slice(1);
  }
  let s = a.join(' ');
  if (esc) s = s.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  return ok(s + (newline ? '\n' : ''));
};

function inputOf(ctx: Ctx, files: string[], name: string): { text: string; err: string } {
  if (!files.length) return { text: ctx.stdin ?? '', err: '' };
  let text = '';
  let err = '';
  for (const t of files) {
    const r = ctx.sh.readFile(t);
    if (r.err) err += `${name}: ${t}: ${r.err}\n`;
    else text += r.data;
  }
  return { text, err };
}

const splitLines = (t: string) => (t === '' ? [] : t.replace(/\n$/, '').split('\n'));

function headTail(which: 'head' | 'tail'): CmdFn {
  return (ctx) => {
    let n = 10;
    const files: string[] = [];
    let follow = false;
    for (let i = 0; i < ctx.args.length; i++) {
      const a = ctx.args[i];
      if (a === '-n') n = parseInt(ctx.args[++i], 10);
      else if (/^-n\d+$/.test(a)) n = parseInt(a.slice(2), 10);
      else if (/^-\d+$/.test(a)) n = parseInt(a.slice(1), 10);
      else if (a === '-f') follow = true;
      else if (/^\+\d+$/.test(a) && which === 'tail') n = -parseInt(a.slice(1), 10);
      else files.push(a);
    }
    const { text, err } = inputOf(ctx, files, which);
    const lines = splitLines(text);
    const sel = which === 'head' ? lines.slice(0, n) : n < 0 ? lines.slice(-n - 1) : lines.slice(Math.max(0, lines.length - n));
    return { out: (sel.length ? sel.join('\n') + '\n' : '') + (follow ? '(suivi simulé : tail -f affiche les nouvelles lignes en continu ; Ctrl+C pour quitter)\n' : ''), err, code: err ? 1 : 0 };
  };
}
export const head = headTail('head');
export const tail = headTail('tail');

export const grep: CmdFn = (ctx) => {
  const { f, pos, vals } = opts(ctx.args.filter((a) => !a.startsWith('--color')), 'e');
  const pattern = vals.e ?? pos.shift();
  if (pattern === undefined) return fail("Utilisation : grep [OPTION]... MOTIFS [FICHIER]...\nExécutez « grep --help » pour obtenir des renseignements complémentaires.", 2);
  let re: RegExp;
  try {
    re = new RegExp(f.has('F') ? pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : f.has('w') ? `\\b(?:${pattern})\\b` : pattern.replace(/\\</g, '\\b').replace(/\\>/g, '\\b'), f.has('i') ? 'i' : '');
  } catch {
    return fail('grep: expression régulière non valide', 2);
  }
  const multi = pos.length > 1 || f.has('r');
  let out = '';
  let err = '';
  let count = 0;
  const handle = (label: string | null, text: string) => {
    let c = 0;
    splitLines(text).forEach((line, i) => {
      const m = re.test(line) !== f.has('v');
      if (!m) return;
      c++;
      if (!f.has('c') && !f.has('l') && !f.has('q')) out += `${multi && label ? label + ':' : ''}${f.has('n') ? i + 1 + ':' : ''}${line}\n`;
    });
    if (f.has('c')) out += `${multi && label ? label + ':' : ''}${c}\n`;
    if (f.has('l') && c) out += label + '\n';
    count += c;
  };
  if (!pos.length) handle(null, ctx.stdin ?? '');
  for (const t of pos) {
    const n = ctx.sh.node(t);
    if (n && n.t === 'd') {
      if (f.has('r')) {
        for (const [p, x] of walk(ctx.sh.state.root, ctx.sh.abs(t))) if (x.t === 'f' && can(x, ctx.sh.who(), 'r')) handle(p, x.data ?? '');
      } else err += `grep: ${t}: est un dossier\n`;
      continue;
    }
    const r = ctx.sh.readFile(t);
    if (r.err) err += `grep: ${t}: ${r.err}\n`;
    else handle(t, r.data!);
  }
  return { out: f.has('q') ? '' : out, err, code: err ? 2 : count ? 0 : 1 };
};

export const cut: CmdFn = (ctx) => {
  const { vals, pos } = opts(ctx.args, 'dfc');
  if (!vals.f && !vals.c) return fail("cut: vous devez spécifier une liste d'octets, de caractères ou de champs");
  const d = vals.d ?? '\t';
  const ranges = (spec: string) => {
    const set: number[] = [];
    for (const part of spec.split(',')) {
      const m = /^(\d*)-(\d*)$/.exec(part);
      if (m) for (let i = m[1] ? +m[1] : 1; i <= (m[2] ? +m[2] : 200); i++) set.push(i);
      else set.push(+part);
    }
    return set;
  };
  const { text, err } = inputOf(ctx, pos, 'cut');
  const out = splitLines(text)
    .map((l) => {
      if (vals.c) {
        const r = ranges(vals.c);
        return [...l].filter((_, i) => r.includes(i + 1)).join('');
      }
      if (!l.includes(d)) return l;
      const parts = l.split(d);
      return ranges(vals.f).filter((i) => i <= parts.length).map((i) => parts[i - 1]).join(d);
    })
    .join('\n');
  return { out: out ? out + '\n' : '', err, code: err ? 1 : 0 };
};

function parseHuman(s: string): number {
  const m = /^([\d.,]+)([KMGT]?)/.exec(s.trim());
  if (!m) return 0;
  const v = parseFloat(m[1].replace(',', '.'));
  return v * 1024 ** ' KMGT'.indexOf(m[2] || ' ');
}

export const sort: CmdFn = (ctx) => {
  const { f, vals, pos } = opts(ctx.args, 'tk');
  const { text, err } = inputOf(ctx, pos, 'sort');
  let lines = splitLines(text);
  const key = (l: string) => {
    if (!vals.k) return l;
    const parts = vals.t ? l.split(vals.t) : l.trim().split(/\s+/);
    return parts[parseInt(vals.k, 10) - 1] ?? '';
  };
  lines.sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    if (f.has('h')) return parseHuman(ka) - parseHuman(kb);
    if (f.has('n')) return parseFloat(ka) - parseFloat(kb) || ka.localeCompare(kb);
    return ka.localeCompare(kb, 'fr');
  });
  if (f.has('r')) lines.reverse();
  if (f.has('u')) lines = lines.filter((l, i) => i === 0 || l !== lines[i - 1]);
  return { out: lines.length ? lines.join('\n') + '\n' : '', err, code: err ? 1 : 0 };
};

export const uniq: CmdFn = (ctx) => {
  const { f, pos } = opts(ctx.args);
  const { text } = inputOf(ctx, pos, 'uniq');
  const lines = splitLines(text);
  const out: string[] = [];
  let prev: string | null = null;
  let c = 0;
  for (const l of [...lines, '\u0000']) {
    if (l === prev) c++;
    else {
      if (prev !== null) out.push(f.has('c') ? `${String(c).padStart(7, ' ')} ${prev}` : prev);
      prev = l;
      c = 1;
    }
  }
  return ok(out.length ? out.join('\n') + '\n' : '');
};

export const wc: CmdFn = (ctx) => {
  const { f, pos } = opts(ctx.args);
  const { text, err } = inputOf(ctx, pos, 'wc');
  const l = (text.match(/\n/g) ?? []).length;
  const w = text.split(/\s+/).filter(Boolean).length;
  const c = new TextEncoder().encode(text).length;
  const name = pos.length ? ' ' + pos.join(' ') : '';
  let out: string;
  if (f.has('l')) out = `${l}${name}`;
  else if (f.has('w')) out = `${w}${name}`;
  else if (f.has('c')) out = `${c}${name}`;
  else out = `${pos.length ? '' : '      '}${l} ${w} ${c}${name}`;
  return { out: out + '\n', err, code: err ? 1 : 0 };
};

export const tee: CmdFn = (ctx) => {
  const { f, pos } = opts(ctx.args);
  const data = ctx.stdin ?? '';
  let err = '';
  for (const t of pos) {
    const e = ctx.sh.writeFile(t, data, f.has('a'));
    if (e) err += `tee: ${t}: ${e}\n`;
  }
  return { out: data, err, code: err ? 1 : 0 };
};

export const find: CmdFn = ({ args, sh }) => {
  let i = 0;
  const starts: string[] = [];
  while (i < args.length && !args[i].startsWith('-') && args[i] !== '!' && args[i] !== '(') starts.push(args[i++]);
  if (!starts.length) starts.push('.');
  type Test = (p: string, n: FNode) => boolean;
  const tests: Test[] = [];
  let exec: string[] | null = null;
  let maxdepth = Infinity;
  let negate = false;
  const add = (t: Test) => {
    const neg = negate;
    tests.push(neg ? (p, n) => !t(p, n) : t);
    negate = false;
  };
  const cmpNum = (spec: string, v: number, unit = 1) => {
    const sign = spec[0];
    const num = parseInt(spec.replace(/^[+-]/, ''), 10) * unit;
    if (sign === '+') return v > num;
    if (sign === '-') return v < num;
    return v === num;
  };
  for (; i < args.length; i++) {
    const a = args[i];
    const v = args[i + 1];
    switch (a) {
      case '!':
      case '-not':
        negate = true;
        break;
      case '-name': {
        const re = globRe(v);
        add((p) => re.test(basename(p)));
        i++;
        break;
      }
      case '-iname': {
        const re = new RegExp(globRe(v).source, 'i');
        add((p) => re.test(basename(p)));
        i++;
        break;
      }
      case '-type':
        add((_, n) => (v === 'f' ? n.t === 'f' : v === 'd' ? n.t === 'd' : v === 'l' ? n.t === 'l' : false));
        i++;
        break;
      case '-uid':
        add((_, n) => n.uid === +v);
        i++;
        break;
      case '-gid':
        add((_, n) => n.gid === +v);
        i++;
        break;
      case '-user': {
        const u = sh.getUser(v);
        if (!u && !/^\d+$/.test(v)) return fail(`find: « ${v} » n'est pas le nom d'un utilisateur connu`);
        add((_, n) => n.uid === (u ? u.uid : +v));
        i++;
        break;
      }
      case '-group': {
        const g = sh.getGroup(v);
        if (!g) return fail(`find: « ${v} » n'est pas le nom d'un groupe existant`);
        add((_, n) => n.gid === g.gid);
        i++;
        break;
      }
      case '-nouser':
        add((_, n) => !sh.getUserById(n.uid));
        break;
      case '-perm': {
        const want = parseInt(v.replace(/^[-/]/, ''), 8);
        add((_, n) => (v.startsWith('-') ? (n.mode & want) === want : v.startsWith('/') ? (n.mode & want) !== 0 : (n.mode & 0o7777) === want));
        i++;
        break;
      }
      case '-size': {
        const m = /^([+-]?\d+)([ckMG]?)$/.exec(v);
        if (!m) return fail(`find: argument invalide « ${v} » pour « -size »`);
        const unit = m[2] === 'c' ? 1 : m[2] === 'k' ? 1024 : m[2] === 'M' ? 1024 ** 2 : m[2] === 'G' ? 1024 ** 3 : 512;
        add((_, n) => n.t === 'f' && cmpNum(m[1], Math.ceil(sizeOf(n) / unit) * unit, unit));
        i++;
        break;
      }
      case '-mtime':
        add((_, n) => cmpNum(v, Math.floor((Date.now() - n.mtime) / 86400000)));
        i++;
        break;
      case '-mmin':
        add((_, n) => cmpNum(v, Math.floor((Date.now() - n.mtime) / 60000)));
        i++;
        break;
      case '-empty':
        add((_, n) => (n.t === 'd' ? Object.keys(n.kids!).length === 0 : sizeOf(n) === 0));
        break;
      case '-maxdepth':
        maxdepth = +v;
        i++;
        break;
      case '-print':
        break;
      case '-exec': {
        const end = args.indexOf(';', i);
        if (end < 0) return fail('find: argument manquant pour « -exec »');
        exec = args.slice(i + 1, end);
        i = end;
        break;
      }
      case '-o':
      case '-a':
        break;
      default:
        return fail(`find: prédicat inconnu « ${a} »`);
    }
  }
  let out = '';
  let err = '';
  const matches: string[] = [];
  for (const s of starts) {
    const abs = sh.abs(s);
    if (!lookup(sh.state.root, abs)) {
      err += `find: '${s}': ${ENOENT}\n`;
      continue;
    }
    const depth0 = abs === '/' ? 0 : abs.split('/').length - 1;
    const visit = (p: string, n: FNode) => {
      const depth = (p === '/' ? 0 : p.split('/').length - 1) - depth0;
      if (depth > maxdepth) return;
      const display = s.startsWith('/') ? p : p === abs ? s : (s === '.' ? '.' : s.replace(/\/$/, '')) + p.slice(abs.length);
      if (tests.every((t) => t(p, n))) matches.push(display);
      if (n.t === 'd' && p !== '/proc') {
        if (!can(n, sh.who(), 'r') || !can(n, sh.who(), 'x')) {
          err += `find: '${display}': ${EACCES}\n`;
          return;
        }
        for (const k of Object.keys(n.kids!).sort()) visit(p === '/' ? `/${k}` : `${p}/${k}`, n.kids![k]);
      }
    };
    visit(abs, lookup(sh.state.root, abs)!);
  }
  if (exec) {
    for (const m of matches) {
      const argv = exec.map((x) => (x === '{}' ? m : x));
      const r = sh.exec(argv, null);
      out += r.out;
      err += r.err;
    }
  } else out = matches.map((m) => m + '\n').join('');
  return { out, err, code: err ? 1 : 0 };
};

export const du: CmdFn = ({ args, sh }) => {
  const { f, pos } = opts(args);
  const targets = pos.length ? pos : ['.'];
  let out = '';
  let err = '';
  const total = (p: string, n: FNode): number => {
    if (n.t !== 'd') return Math.ceil(sizeOf(n) / 4096) * 4;
    return 0 + Object.entries(n.kids!).reduce((a, [k, c]) => a + total(`${p}/${k}`, c), 0);
  };
  const fmt = (kb: number) => (f.has('h') ? humanSize(kb * 1024) : String(kb));
  for (const t of targets) {
    const n = sh.node(t);
    if (!n) {
      err += `du: impossible d'accéder à '${t}': ${ENOENT}\n`;
      continue;
    }
    if (!f.has('s') && n.t === 'd') {
      for (const [p, x] of walk(sh.state.root, sh.abs(t))) if (x.t === 'd') out += `${fmt(total(p, x))}\t${t === '.' ? '.' + p.slice(sh.abs(t).length) : p}\n`;
    } else out += `${fmt(total(sh.abs(t), n))}\t${t}\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

export const df: CmdFn = ({ args }) => {
  const h = args.some((a) => a.includes('h'));
  const rows = [
    ['/dev/mapper/rhel-root', 20, 6.1, '/'],
    ['/dev/sda2', 1, 0.3, '/boot'],
    ['/dev/sda1', 1, 0.007, '/boot/efi'],
    ['/dev/mapper/rhel-home', 50, 0.4, '/home'],
    ['/dev/mapper/rhel-var', 24, 1.2, '/var'],
    ['tmpfs', 1.9, 0, '/dev/shm']
  ] as const;
  const want = args.filter((a) => !a.startsWith('-'));
  const lines = rows
    .filter((r) => !want.length || want.includes(r[3]))
    .map(([fs, size, used, mnt]) => {
      const s = h ? `${size}G` : String(Math.round(size * 1048576));
      const u = h ? `${used}G` : String(Math.round(used * 1048576));
      const a = h ? `${Math.round((size - used) * 10) / 10}G` : String(Math.round((size - used) * 1048576));
      return `${fs.padEnd(22)} ${s.padStart(6)} ${u.padStart(6)} ${a.padStart(6)} ${String(Math.round((used / size) * 100)).padStart(3)}% ${mnt}`;
    });
  return ok(`Sys. de fichiers       ${h ? 'Taille' : '1K-blocs'} Utilisé Dispo Uti% Monté sur\n` + lines.join('\n') + '\n');
};

export const ln: CmdFn = ({ args, sh }) => {
  const { f, pos } = opts(args);
  if (pos.length < 2) return fail('ln: opérande de fichier manquant');
  const [target, linkName] = pos;
  const abs = sh.abs(linkName);
  const e = sh.canWriteDir(dirname(abs));
  if (e) return fail(`ln: impossible de créer le lien symbolique '${linkName}': ${EACCES}`);
  if (lookup(sh.state.root, abs, false) && !f.has('f')) return fail(`ln: impossible de créer le lien symbolique '${linkName}': Le fichier existe`);
  if (!f.has('s')) {
    const n = sh.node(target);
    if (!n) return fail(`ln: impossible d'accéder à '${target}': ${ENOENT}`);
    lookup(sh.state.root, dirname(abs))!.kids![basename(abs)] = n;
    return ok();
  }
  lookup(sh.state.root, dirname(abs))!.kids![basename(abs)] = { t: 'l', uid: sh.who().uid, gid: sh.who().gids[0] ?? 0, mode: 0o777, mtime: Date.now(), target };
  return ok();
};

export const stat: CmdFn = ({ args, sh }) => {
  let out = '';
  let err = '';
  for (const t of args.filter((a) => !a.startsWith('-'))) {
    const n = lookup(sh.state.root, sh.abs(t), false);
    if (!n) {
      err += `stat: impossible d'évaluer '${t}': ${ENOENT}\n`;
      continue;
    }
    const type = n.t === 'd' ? 'répertoire' : n.t === 'l' ? 'lien symbolique' : sizeOf(n) ? 'fichier' : 'fichier vide';
    out += `  Fichier : ${t}${n.t === 'l' ? ' -> ' + n.target : ''}\n   Taille : ${sizeOf(n)}\tBlocs : ${Math.ceil(sizeOf(n) / 512)}\tBlocs d'E/S : 4096   ${type}\nAccès : (${(n.mode & 0o7777).toString(8).padStart(4, '0')}/${modeString(n)})  UID : (${String(n.uid).padStart(5)}/${sh.userName(n.uid).padStart(8)})   GID : (${String(n.gid).padStart(5)}/${sh.groupName(n.gid).padStart(8)})\nModif. : ${new Date(n.mtime).toISOString().replace('T', ' ').slice(0, 19)}\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

export const fileCmd: CmdFn = ({ args, sh }) => {
  let out = '';
  for (const t of args) {
    const n = lookup(sh.state.root, sh.abs(t), false);
    if (!n) out += `${t}: cannot open \`${t}' (No such file or directory)\n`;
    else if (n.t === 'd') out += `${t}: directory\n`;
    else if (n.t === 'l') out += `${t}: symbolic link to ${n.target}\n`;
    else if ((n.data ?? '').startsWith('\u007fELF')) out += `${t}: ELF 64-bit LSB pie executable, x86-64, dynamically linked\n`;
    else if (t.endsWith('.rpm')) out += `${t}: RPM v3.0 bin i386/x86_64\n`;
    else out += `${t}: ${sizeOf(n) ? 'ASCII text' : 'empty'}\n`;
  }
  return ok(out);
};

export const tree: CmdFn = ({ args, sh }) => {
  const t = args.find((a) => !a.startsWith('-')) ?? '.';
  const n = sh.node(t);
  if (!n || n.t !== 'd') return fail(`${t} [error opening dir]`);
  let dirs = 0;
  let files = 0;
  const lines: string[] = [t];
  const rec = (x: FNode, prefix: string) => {
    const keys = Object.keys(x.kids!).filter((k) => !k.startsWith('.')).sort();
    keys.forEach((k, i) => {
      const last = i === keys.length - 1;
      const c = x.kids![k];
      lines.push(`${prefix}${last ? '└── ' : '├── '}${k}`);
      if (c.t === 'd') {
        dirs++;
        if (can(c, sh.who(), 'r')) rec(c, prefix + (last ? '    ' : '│   '));
      } else files++;
    });
  };
  rec(n, '');
  return ok(`${lines.join('\n')}\n\n${dirs} directories, ${files} files\n`);
};

export const less: CmdFn = (ctx) => {
  const r = cat(ctx);
  return { ...r, out: r.out + (r.out ? '(less simulé : tout le contenu est affiché ; dans le vrai less : /mot pour chercher, q pour quitter)\n' : '') };
};

export const realpath: CmdFn = ({ args, sh }) => ok(args.map((a) => normPath(a, sh.session.cwd)).join('\n') + '\n');
export const basenameCmd: CmdFn = ({ args }) => ok(basename(args[0] ?? '') + '\n');
export const dirnameCmd: CmdFn = ({ args }) => ok(dirname(args[0] ?? '') + '\n');

export function silent(r: CmdRes): CmdRes {
  return { ...r, out: '' };
}
export { nl };
