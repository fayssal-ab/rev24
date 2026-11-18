import { ok, fail, parseSudoers, validateSudoers, type CmdFn, type CmdRes, type Shell, type Ask } from '../shell';
import { lookup, dirname, basename, walk, type FNode } from '../vfs';
import * as A from '../accounts';

const DENIED_LOCK = (cmd: string) => fail(`${cmd} : Permission non accordée.\n${cmd} : impossible de verrouiller /etc/passwd ; réessayer plus tard.`, 1);

/** getopt-like parsing for shadow-utils commands. `withArg` = letters that take a value. */
function getopt(args: string[], withArg: string, longMap: Record<string, string> = {}) {
  const o: Record<string, string | true> = {};
  const pos: string[] = [];
  for (let i = 0; i < args.length; i++) {
    let a = args[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      const name = eq > 0 ? a.slice(2, eq) : a.slice(2);
      const letter = longMap[name];
      if (letter && letter.length > 1) {
        o[letter] = eq > 0 ? a.slice(eq + 1) : true;
        continue;
      }
      if (!letter) {
        o[name] = eq > 0 ? a.slice(eq + 1) : true;
        continue;
      }
      a = '-' + letter;
      if (eq > 0) {
        o[letter] = a.slice(eq + 1);
        continue;
      }
    }
    if (a.startsWith('-') && a.length > 1) {
      for (let j = 1; j < a.length; j++) {
        const l = a[j];
        if (withArg.includes(l)) {
          const v = a.slice(j + 1) || args[++i];
          if (v === undefined) return { o, pos, err: `option requiert un argument -- '${l}'` };
          o[l] = v;
          break;
        }
        o[l] = true;
      }
    } else pos.push(a);
  }
  return { o, pos, err: null as string | null };
}

const today = () => A.daysSinceEpoch();

function copySkel(sh: Shell, skel: string, home: string, uid: number, gid: number) {
  const s = lookup(sh.state.root, skel);
  const parent = lookup(sh.state.root, dirname(home));
  if (!parent || parent.t !== 'd') return false;
  const h: FNode = { t: 'd', uid, gid, mode: 0o700, mtime: Date.now(), kids: {} };
  if (s && s.t === 'd') {
    const cp = (src: FNode): FNode => {
      const c: FNode = { ...src, uid, gid, mtime: Date.now() };
      if (src.kids) c.kids = Object.fromEntries(Object.entries(src.kids).map(([k, v]) => [k, cp(v)]));
      return c;
    };
    for (const [k, v] of Object.entries(s.kids!)) h.kids![k] = cp(v);
  }
  parent.kids![basename(home)] = h;
  return true;
}

function nextId(used: number[], min: number, max: number, fromTop = false): number {
  if (fromTop) {
    for (let i = max; i >= min; i--) if (!used.includes(i)) return i;
    return -1;
  }
  const inRange = used.filter((u) => u >= min && u <= max);
  const cand = inRange.length ? Math.max(...inRange) + 1 : min;
  if (cand <= max && !used.includes(cand)) return cand;
  for (let i = min; i <= max; i++) if (!used.includes(i)) return i;
  return -1;
}

const validName = (n: string) => /^[a-z_][a-z0-9_.-]*\$?$/i.test(n) && n.length <= 32;

// ---------------- useradd ----------------
export const useradd: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, 'uUgGdsceKkbfp', { uid: 'u', gid: 'g', groups: 'G', home: 'd', 'home-dir': 'd', shell: 's', comment: 'c', expiredate: 'e', inactive: 'f', system: 'r', 'create-home': 'm', 'no-create-home': 'M', defaults: 'D', skel: 'k', password: 'p', 'base-dir': 'b', 'no-user-group': 'N', 'user-group': 'U' });
  if (err) return fail(`useradd : ${err}`, 2);
  if (!sh.isRoot) return DENIED_LOCK('useradd');
  const defs = sh.useraddDefaults();
  if (o.D) {
    let content = sh.readRaw('/etc/default/useradd');
    const map: Record<string, string> = { s: 'SHELL', e: 'EXPIRE', f: 'INACTIVE', b: 'HOME', g: 'GROUP' };
    let changed = false;
    for (const [l, key] of Object.entries(map)) {
      if (typeof o[l] === 'string') {
        let v = o[l] as string;
        if (l === 'g') {
          const g = sh.getGroup(v);
          if (!g) return fail(`useradd : le groupe « ${v} » n'existe pas`, 6);
          v = String(g.gid);
        }
        content = A.setConf(content, key, v, '=');
        changed = true;
      }
    }
    if (changed) {
      sh.writeRaw('/etc/default/useradd', content);
      return ok();
    }
    const d = A.parseConf(content);
    return ok(`GROUP=${d.GROUP ?? 100}\nHOME=${d.HOME ?? '/home'}\nINACTIVE=${d.INACTIVE ?? -1}\nEXPIRE=${d.EXPIRE ?? ''}\nSHELL=${d.SHELL ?? '/bin/bash'}\nSKEL=${d.SKEL ?? '/etc/skel'}\nCREATE_MAIL_SPOOL=${d.CREATE_MAIL_SPOOL ?? 'yes'}\n`);
  }
  if (pos.length !== 1) return fail('Utilisation : useradd [options] LOGIN\n       useradd -D\n       useradd -D [options]', 2);
  const name = pos[0];
  if (!validName(name)) return fail(`useradd : nom d'utilisateur « ${name} » non valide`, 3);
  const pw = sh.passwd();
  if (pw.some((u) => u.name === name)) return fail(`useradd : l'utilisateur « ${name} » existe déjà`, 9);
  const ld = sh.loginDefs();
  const system = !!o.r;
  const usedU = pw.map((u) => u.uid);
  let uid: number;
  if (typeof o.u === 'string') {
    uid = +o.u;
    if (!/^\d+$/.test(o.u)) return fail(`useradd : UID « ${o.u} » non valide`, 3);
    if (usedU.includes(uid) && !o.o) return fail(`useradd : UID ${uid} n'est pas unique`, 4);
  } else uid = system ? nextId(usedU, +(ld.SYS_UID_MIN ?? 201), +(ld.SYS_UID_MAX ?? 999), true) : nextId(usedU, +(ld.UID_MIN ?? 1000), +(ld.UID_MAX ?? 60000));
  const groups = sh.groups();
  const gs = sh.gshadow();
  let gid: number;
  let createGroup = false;
  if (typeof o.g === 'string') {
    const g = sh.getGroup(o.g);
    if (!g) return fail(`useradd : le groupe « ${o.g} » n'existe pas`, 6);
    gid = g.gid;
  } else if (o.N) {
    gid = +(defs.GROUP ?? 100);
  } else {
    if (groups.some((g) => g.name === name)) return fail(`useradd : le groupe ${name} existe. Si vous voulez ajouter cet utilisateur à ce groupe, utilisez -g.`, 9);
    createGroup = true;
    const usedG = groups.map((g) => g.gid);
    gid = !usedG.includes(uid) ? uid : system ? nextId(usedG, +(ld.SYS_GID_MIN ?? 201), +(ld.SYS_GID_MAX ?? 999), true) : nextId(usedG, +(ld.GID_MIN ?? 1000), +(ld.GID_MAX ?? 60000));
  }
  const supp: string[] = [];
  if (typeof o.G === 'string') {
    for (const gname of o.G.split(',').filter(Boolean)) {
      const g = sh.getGroup(gname);
      if (!g) return fail(`useradd : le groupe « ${gname} » n'existe pas`, 6);
      supp.push(g.name);
    }
  }
  let expire = defs.EXPIRE ?? '';
  if (typeof o.e === 'string') {
    if (o.e === '' || o.e === '-1') expire = '';
    else {
      const d = A.parseDate(o.e);
      if (d === null) return fail(`useradd : date « ${o.e} » non valide`, 3);
      expire = String(d);
    }
  }
  const inactive = typeof o.f === 'string' ? o.f : defs.INACTIVE ?? '-1';
  const base = (typeof o.b === 'string' ? o.b : defs.HOME) ?? '/home';
  const home = typeof o.d === 'string' ? sh.abs(o.d) : `${base}/${name}`;
  const shell = typeof o.s === 'string' ? o.s : defs.SHELL ?? '/bin/bash';
  const comment = typeof o.c === 'string' ? o.c : '';
  // write databases
  pw.push({ name, pw: 'x', uid, gid, gecos: comment, home, shell });
  sh.savePasswd(pw);
  const sp = sh.shadow();
  sp.push({
    name,
    hash: typeof o.p === 'string' ? o.p : '!!',
    last: String(today()),
    min: ld.PASS_MIN_DAYS ?? '0',
    max: ld.PASS_MAX_DAYS ?? '99999',
    warn: ld.PASS_WARN_AGE ?? '7',
    inactive: inactive === '-1' ? '' : inactive,
    expire,
    reserved: ''
  });
  sh.saveShadow(sp);
  if (createGroup) {
    groups.push({ name, pw: 'x', gid, members: [] });
    gs.push({ name, pw: '!', admins: [], members: [] });
  }
  for (const g of supp) {
    const ge = groups.find((x) => x.name === g)!;
    if (!ge.members.includes(name)) ge.members.push(name);
    const gse = gs.find((x) => x.name === g);
    if (gse && !gse.members.includes(name)) gse.members.push(name);
  }
  sh.saveGroup(groups);
  sh.saveGshadow(gs);
  // home directory
  let out = '';
  const createHome = o.m ? true : o.M ? false : system ? false : (ld.CREATE_HOME ?? 'no') === 'yes';
  if (createHome) {
    if (lookup(sh.state.root, home)) out += `useradd : attention : le répertoire personnel existe déjà.\nCopie depuis le répertoire squelette (skel) refusée.\n`;
    else if (!copySkel(sh, typeof o.k === 'string' ? o.k : defs.SKEL ?? '/etc/skel', home, uid, gid)) out += `useradd : impossible de créer le répertoire ${home}\n`;
  }
  if ((defs.CREATE_MAIL_SPOOL ?? 'yes') === 'yes' && !system) {
    const spool = lookup(sh.state.root, '/var/spool/mail');
    if (spool?.kids) spool.kids[name] = { t: 'f', uid, gid: 12, mode: 0o660, mtime: Date.now(), data: '' };
  }
  sh.log('useradd', `new user: name=${name}, UID=${uid}, GID=${gid}, home=${home}, shell=${shell}, from=/dev/pts/0`, 5);
  return { out: '', err: out, code: 0 };
};

// ---------------- usermod ----------------
export const usermod: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, 'uGgdsceldfp', { uid: 'u', gid: 'g', groups: 'G', home: 'd', shell: 's', comment: 'c', expiredate: 'e', login: 'l', inactive: 'f', append: 'a', lock: 'L', unlock: 'U', 'move-home': 'm', password: 'p' });
  if (err) return fail(`usermod : ${err}`, 2);
  if (!sh.isRoot) return DENIED_LOCK('usermod');
  if (pos.length !== 1) return fail('Utilisation : usermod [options] LOGIN', 2);
  const name = pos[0];
  const pw = sh.passwd();
  const u = pw.find((x) => x.name === name);
  if (!u) return fail(`usermod : l'utilisateur « ${name} » n'existe pas`, 6);
  if (o.a && typeof o.G !== 'string') return fail("usermod : l'option -a n'est autorisée qu'avec l'option -G\nUtilisation : usermod [options] LOGIN", 2);
  if (o.m && typeof o.d !== 'string') return fail("usermod : l'option -m n'est autorisée qu'avec l'option -d\nUtilisation : usermod [options] LOGIN", 2);
  if (o.L && o.U) return fail("usermod : les options -L et -U sont mutuellement exclusives", 2);
  const sp = sh.shadow();
  const s = sp.find((x) => x.name === name);
  let groups = sh.groups();
  let gs = sh.gshadow();
  let changed = false;
  const out = '';
  if (typeof o.l === 'string') {
    const nn = o.l;
    if (pw.some((x) => x.name === nn)) return fail(`usermod : l'utilisateur « ${nn} » existe déjà`, 9);
    if (!validName(nn)) return fail(`usermod : « ${nn} » n'est pas un nom d'utilisateur valable`, 3);
  }
  if (typeof o.u === 'string') {
    const nu = +o.u;
    if (pw.some((x) => x.uid === nu && x.name !== name)) return fail(`usermod : UID « ${nu} » déjà utilisé`, 4);
    const old = u.uid;
    u.uid = nu;
    // chown files in home
    const h = lookup(sh.state.root, u.home);
    if (h) for (const [, n] of walk(sh.state.root, u.home)) if (n.uid === old) n.uid = nu;
    changed = true;
  }
  if (typeof o.g === 'string') {
    const g = sh.getGroup(o.g);
    if (!g) return fail(`usermod : le groupe « ${o.g} » n'existe pas`, 6);
    u.gid = g.gid;
    changed = true;
  }
  if (typeof o.G === 'string') {
    const wanted = o.G.split(',').filter(Boolean);
    for (const g of wanted) if (!sh.getGroup(g)) return fail(`usermod : le groupe « ${g} » n'existe pas`, 6);
    const names = wanted.map((g) => sh.getGroup(g)!.name);
    for (const g of groups) {
      const isIn = g.members.includes(name);
      const want = names.includes(g.name);
      if (want && !isIn) g.members.push(name);
      if (!want && isIn && !o.a) g.members = g.members.filter((m) => m !== name);
    }
    for (const g of gs) {
      const isIn = g.members.includes(name);
      const want = names.includes(g.name);
      if (want && !isIn) g.members.push(name);
      if (!want && isIn && !o.a) g.members = g.members.filter((m) => m !== name);
    }
    changed = true;
  }
  if (typeof o.d === 'string') {
    const nd = sh.abs(o.d);
    if (o.m && nd !== u.home) {
      const oldNode = lookup(sh.state.root, u.home);
      if (lookup(sh.state.root, nd)) return fail(`usermod : le répertoire ${nd} existe`, 12);
      const parent = lookup(sh.state.root, dirname(nd));
      if (!parent || parent.t !== 'd') return fail(`usermod : impossible de renommer le répertoire ${u.home} en ${nd}`, 12);
      if (oldNode) {
        parent.kids![basename(nd)] = oldNode;
        delete lookup(sh.state.root, dirname(u.home))!.kids![basename(u.home)];
      }
    }
    u.home = nd;
    changed = true;
  }
  if (typeof o.s === 'string') {
    u.shell = o.s;
    changed = true;
  }
  if (typeof o.c === 'string') {
    u.gecos = o.c;
    changed = true;
  }
  if (s && typeof o.e === 'string') {
    if (o.e === '' || o.e === '-1') s.expire = '';
    else {
      const d = A.parseDate(o.e);
      if (d === null) return fail(`usermod : date « ${o.e} » non valide`, 3);
      s.expire = String(d);
    }
    changed = true;
  }
  if (s && typeof o.f === 'string') {
    s.inactive = o.f === '-1' ? '' : o.f;
    changed = true;
  }
  if (s && typeof o.p === 'string') {
    s.hash = o.p;
    s.last = String(today());
    changed = true;
  }
  if (s && o.L) {
    if (!s.hash.startsWith('!')) s.hash = '!' + s.hash;
    changed = true;
  }
  if (s && o.U) {
    if (s.hash === '!' || s.hash === '') return fail("usermod : déverrouiller le mot de passe de l'utilisateur produirait un compte sans mot de passe.\nVous devriez définir un mot de passe avec usermod -p pour déverrouiller le mot de passe de cet utilisateur.", 1);
    if (s.hash.startsWith('!')) {
      const un = s.hash.replace(/^!/, '');
      if (un === '!' || un === '') return fail("usermod : déverrouiller le mot de passe de l'utilisateur produirait un compte sans mot de passe.\nVous devriez définir un mot de passe avec usermod -p pour déverrouiller le mot de passe de cet utilisateur.", 1);
      s.hash = un;
    }
    changed = true;
  }
  if (typeof o.l === 'string') {
    const nn = o.l;
    u.name = nn;
    if (s) s.name = nn;
    groups = groups.map((g) => ({ ...g, members: g.members.map((m) => (m === name ? nn : m)) }));
    gs = gs.map((g) => ({ ...g, members: g.members.map((m) => (m === name ? nn : m)), admins: g.admins.map((m) => (m === name ? nn : m)) }));
    for (const ses of sh.sessions) if (ses.user === name) ses.user = nn;
    changed = true;
  }
  if (!changed) return ok('usermod : aucune modification\n');
  sh.savePasswd(pw);
  sh.saveShadow(sp);
  sh.saveGroup(groups);
  sh.saveGshadow(gs);
  return ok(out);
};

// ---------------- userdel ----------------
export const userdel: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, '', { remove: 'r', force: 'f' });
  if (err) return fail(`userdel : ${err}`, 2);
  if (!sh.isRoot) return DENIED_LOCK('userdel');
  if (pos.length !== 1) return fail('Utilisation : userdel [options] LOGIN', 2);
  const name = pos[0];
  const pw = sh.passwd();
  const u = pw.find((x) => x.name === name);
  if (!u) return fail(`userdel : l'utilisateur « ${name} » n'existe pas`, 6);
  if (sh.sessions.some((s) => s.user === name) && !o.f) return fail(`userdel : l'utilisateur ${name} est actuellement utilisé par le processus ${2000 + u.uid}`, 8);
  sh.savePasswd(pw.filter((x) => x.name !== name));
  sh.saveShadow(sh.shadow().filter((x) => x.name !== name));
  let groups = sh.groups().map((g) => ({ ...g, members: g.members.filter((m) => m !== name) }));
  let gs = sh.gshadow().map((g) => ({ ...g, members: g.members.filter((m) => m !== name), admins: g.admins.filter((m) => m !== name) }));
  let out = '';
  // private group removal (USERGROUPS_ENAB)
  const pg = groups.find((g) => g.gid === u.gid && g.name === name);
  if (pg) {
    const stillPrimary = sh.passwd().some((x) => x.gid === pg.gid);
    if (!stillPrimary && pg.members.length === 0) {
      groups = groups.filter((g) => g !== pg);
      gs = gs.filter((g) => g.name !== name);
    } else if (stillPrimary) out += `userdel : le groupe ${name} n'a pas été supprimé car c'est le groupe primaire d'un autre utilisateur.\n`;
  }
  sh.saveGroup(groups);
  sh.saveGshadow(gs);
  if (o.r) {
    const h = lookup(sh.state.root, u.home);
    if (h && u.home !== '/') {
      if (h.uid !== u.uid && !o.f) out += `userdel : ${u.home} n'appartient pas à ${name}, pas de suppression\n`;
      else delete lookup(sh.state.root, dirname(u.home))!.kids![basename(u.home)];
    } else out += `userdel : répertoire ${u.home} introuvable\n`;
    const spool = lookup(sh.state.root, '/var/spool/mail');
    if (spool?.kids?.[name]) delete spool.kids[name];
    else out += `userdel : ${name} mail spool (/var/spool/mail/${name}) not found\n`;
  }
  sh.log('userdel', `delete user '${name}'`, 5);
  return { out: '', err: out, code: 0 };
};

// ---------------- groupadd / groupmod / groupdel ----------------
export const groupadd: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, 'gKp', { gid: 'g', system: 'r', force: 'f' });
  if (err) return fail(`groupadd : ${err}`, 2);
  if (!sh.isRoot) return fail('groupadd : Permission non accordée.\ngroupadd : impossible de verrouiller /etc/group ; réessayer plus tard.', 10);
  if (pos.length !== 1) return fail('Utilisation : groupadd [options] GROUPE', 2);
  const name = pos[0];
  const groups = sh.groups();
  if (groups.some((g) => g.name === name)) return o.f ? ok() : fail(`groupadd : le groupe « ${name} » existe déjà`, 9);
  if (!validName(name)) return fail(`groupadd : « ${name} » n'est pas un nom de groupe valable`, 3);
  const ld = sh.loginDefs();
  const used = groups.map((g) => g.gid);
  let gid: number;
  if (typeof o.g === 'string') {
    gid = +o.g;
    if (!/^\d+$/.test(o.g)) return fail(`groupadd : « ${o.g} » n'est pas un GID valide`, 3);
    if (used.includes(gid)) {
      if (o.f) gid = nextId(used, +(ld.GID_MIN ?? 1000), +(ld.GID_MAX ?? 60000));
      else return fail(`groupadd : GID « ${gid} » déjà utilisé`, 4);
    }
  } else gid = o.r ? nextId(used, +(ld.SYS_GID_MIN ?? 201), +(ld.SYS_GID_MAX ?? 999), true) : nextId(used, +(ld.GID_MIN ?? 1000), +(ld.GID_MAX ?? 60000));
  groups.push({ name, pw: 'x', gid, members: [] });
  sh.saveGroup(groups);
  const gs = sh.gshadow();
  gs.push({ name, pw: '!', admins: [], members: [] });
  sh.saveGshadow(gs);
  sh.log('groupadd', `group added to /etc/group: name=${name}, GID=${gid}`, 5);
  return ok();
};

export const groupmod: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, 'gnp', { gid: 'g', 'new-name': 'n' });
  if (err) return fail(`groupmod : ${err}`, 2);
  if (!sh.isRoot) return fail('groupmod : Permission non accordée.\ngroupmod : impossible de verrouiller /etc/group ; réessayer plus tard.', 10);
  if (pos.length !== 1) return fail('Utilisation : groupmod [options] GROUPE', 2);
  const name = pos[0];
  const groups = sh.groups();
  const g = groups.find((x) => x.name === name);
  if (!g) return fail(`groupmod : le groupe « ${name} » n'existe pas`, 6);
  const gs = sh.gshadow();
  if (typeof o.g === 'string') {
    const ng = +o.g;
    if (groups.some((x) => x.gid === ng && x !== g)) return fail(`groupmod : GID « ${ng} » déjà utilisé`, 4);
    const pw = sh.passwd();
    for (const u of pw) if (u.gid === g.gid) u.gid = ng;
    sh.savePasswd(pw);
    g.gid = ng;
  }
  if (typeof o.n === 'string') {
    if (groups.some((x) => x.name === o.n)) return fail(`groupmod : le groupe « ${o.n} » existe déjà`, 9);
    const gse = gs.find((x) => x.name === name);
    if (gse) gse.name = o.n;
    g.name = o.n;
  }
  sh.saveGroup(groups);
  sh.saveGshadow(gs);
  return ok();
};

export const groupdel: CmdFn = ({ args, sh }) => {
  const { pos } = getopt(args, '');
  if (!sh.isRoot) return fail('groupdel : Permission non accordée.\ngroupdel : impossible de verrouiller /etc/group ; réessayer plus tard.', 10);
  if (pos.length !== 1) return fail('Utilisation : groupdel [options] GROUPE', 2);
  const name = pos[0];
  const groups = sh.groups();
  const g = groups.find((x) => x.name === name);
  if (!g) return fail(`groupdel : le groupe « ${name} » n'existe pas`, 6);
  const prim = sh.passwd().find((u) => u.gid === g.gid);
  if (prim) return fail(`groupdel : impossible de supprimer le groupe primaire de l'utilisateur « ${prim.name} »`, 8);
  sh.saveGroup(groups.filter((x) => x !== g));
  sh.saveGshadow(sh.gshadow().filter((x) => x.name !== name));
  return ok();
};

// ---------------- gpasswd ----------------
export const gpasswd: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, 'adMA', { add: 'a', delete: 'd', members: 'M', administrators: 'A' });
  if (err) return fail(`gpasswd : ${err}`, 2);
  if (pos.length !== 1) return fail('Utilisation : gpasswd [option] GROUPE', 2);
  const name = pos[0];
  const groups = sh.groups();
  const gs = sh.gshadow();
  const g = groups.find((x) => x.name === name);
  if (!g) return fail(`gpasswd : le groupe « ${name} » n'existe pas`, 3);
  let gse = gs.find((x) => x.name === name);
  if (!gse) {
    gse = { name, pw: '!', admins: [], members: [...g.members] };
    gs.push(gse);
  }
  const isAdmin = gse.admins.includes(sh.user);
  if (!sh.isRoot && !(isAdmin && (o.a || o.d))) return fail('gpasswd : Permission non accordée.', 3);
  const save = () => {
    sh.saveGroup(groups);
    sh.saveGshadow(gs);
  };
  if (typeof o.a === 'string') {
    const u = o.a;
    if (!sh.getUser(u)) return fail(`gpasswd : l'utilisateur « ${u} » n'existe pas`, 3);
    if (!g.members.includes(u)) g.members.push(u);
    if (!gse.members.includes(u)) gse.members.push(u);
    save();
    return ok(`Ajout de l'utilisateur ${u} au groupe ${name}\n`);
  }
  if (typeof o.d === 'string') {
    const u = o.d;
    if (!g.members.includes(u)) return fail(`gpasswd : l'utilisateur « ${u} » n'est pas membre de « ${name} »`, 3);
    g.members = g.members.filter((m) => m !== u);
    gse.members = gse.members.filter((m) => m !== u);
    save();
    return ok(`Suppression de l'utilisateur ${u} du groupe ${name}\n`);
  }
  if (typeof o.M === 'string' || typeof o.A === 'string') {
    if (typeof o.M === 'string') {
      const list = o.M.split(',').filter(Boolean);
      for (const u of list) if (!sh.getUser(u)) return fail(`gpasswd : l'utilisateur « ${u} » n'existe pas`, 3);
      g.members = list;
      gse.members = [...list];
    }
    if (typeof o.A === 'string') {
      const list = o.A.split(',').filter(Boolean);
      for (const u of list) if (!sh.getUser(u)) return fail(`gpasswd : l'utilisateur « ${u} » n'existe pas`, 3);
      gse.admins = list;
    }
    save();
    return ok();
  }
  if (o.r) {
    gse.pw = '';
    save();
    return ok();
  }
  // set group password interactively
  const ask1: Ask = {
    prompt: `Changement du mot de passe pour le groupe ${name}\nNouveau mot de passe : `,
    hidden: true,
    next: (p1) => ({
      out: '\n',
      err: '',
      code: 0,
      ask: {
        prompt: 'Nouveau mot de passe (pour vérification) : ',
        hidden: true,
        next: (p2) => {
          if (p1 !== p2) return fail('\nLes mots de passe ne correspondent pas.\nLe mot de passe n\'a pas été changé.', 3);
          gse!.pw = A.fakeCrypt(p1);
          save();
          return ok('\n');
        }
      }
    })
  };
  return { out: '', err: '', code: 0, ask: ask1 };
};

// ---------------- passwd ----------------
function pwQuality(p: string, user: string): string | null {
  if (p.length < 8) return 'Le mot de passe comporte moins de 8 caractères';
  if (p.toLowerCase().includes(user.toLowerCase())) return "Le mot de passe contient le nom de l'utilisateur sous une certaine forme";
  if (/^[a-z]+$/i.test(p) && p.length < 12) return 'Le mot de passe échoue au contrôle du dictionnaire - basé sur un mot du dictionnaire';
  return null;
}

/** Interactive password change flow (used by passwd, su/ssh forced change). */
export function changePasswordFlow(sh: Shell, user: string, asRoot: boolean, done: (sh: Shell) => CmdRes = () => ok('passwd : mise à jour réussie de tous les jetons d\'authentification.\n')): Ask {
  const askNew = (): Ask => ({
    prompt: 'Nouveau mot de passe : ',
    hidden: true,
    next: (p1) => {
      const q = pwQuality(p1, user);
      if (q && !asRoot) return { out: `\nMOT DE PASSE INCORRECT : ${q}\n`, err: '', code: 0, ask: askNew() };
      return {
        out: q ? `\nMOT DE PASSE INCORRECT : ${q}\n` : '\n',
        err: '',
        code: 0,
        ask: {
          prompt: 'Retapez le nouveau mot de passe : ',
          hidden: true,
          next: (p2) => {
            if (p1 !== p2) return fail("\nDésolé, les mots de passe ne correspondent pas.\npasswd : Erreur de manipulation du jeton d'authentification", 10);
            if (sh.readOnly('/etc/shadow')) return fail("\npasswd : Échec de la manipulation du jeton d'authentification (système de fichiers en lecture seule : avez-vous fait « mount -o remount,rw /sysroot » ?)", 10);
            setPassword(sh, user, p1);
            const r = done(sh);
            return { ...r, out: '\n' + r.out };
          }
        }
      };
    }
  });
  return askNew();
}

export function setPassword(sh: Shell, user: string, plain: string) {
  const sp = sh.shadow();
  const s = sp.find((x) => x.name === user);
  if (!s) return;
  s.hash = A.fakeCrypt(plain);
  s.last = String(today());
  sh.saveShadow(sp);
  sh.log('passwd', `pam_unix(passwd:chauthtok): password changed for ${user}`, 5);
}

export const passwd: CmdFn = ({ args, sh, stdin }) => {
  const { o, pos, err } = getopt(args, 'nxwi', { lock: 'l', unlock: 'u', delete: 'd', expire: 'e', status: 'S', stdin: '__stdin' });
  if (err) return fail(`passwd : ${err}`, 1);
  const target = pos[0] ?? sh.user;
  if (pos[0] && !sh.isRoot && pos[0] !== sh.user) return fail("passwd : Seul root peut spécifier un nom d'utilisateur.", 1);
  if (!sh.getUser(target)) return fail(`passwd : L'utilisateur « ${target} » n'existe pas.`, 1);
  const sp = sh.shadow();
  const s = sp.find((x) => x.name === target)!;
  const adminOpt = o.l || o.u || o.d || o.e || o.n || o.x || o.w || o.i;
  if ((adminOpt || o.S) && !sh.isRoot) return fail('passwd : Seul root peut faire cela.', 1);
  if (o.S) {
    const st = s.hash === '' ? 'NP' : s.hash.startsWith('!') ? 'LK' : 'PS';
    const label = st === 'NP' ? 'Mot de passe vide.' : st === 'LK' ? 'Mot de passe verrouillé.' : 'Mot de passe défini, chiffrement SHA512.';
    return ok(`${target} ${st} ${s.last && s.last !== '0' ? A.isoDate(+s.last) : '1970-01-01'} ${s.min || 0} ${s.max || 99999} ${s.warn || 7} ${s.inactive || -1} (${label})\n`);
  }
  if (o.l) {
    if (!s.hash.startsWith('!!')) s.hash = '!!' + s.hash;
    sh.saveShadow(sp);
    return ok(`Verrouillage du mot de passe pour l'utilisateur ${target}.\npasswd: Succès\n`);
  }
  if (o.u) {
    const un = s.hash.replace(/^!+/, '');
    if (!un) return fail(`Déverrouillage du mot de passe pour l'utilisateur ${target}.\npasswd: Attention : le déverrouillage produirait un compte sans mot de passe.\nVous devriez définir un mot de passe avec usermod -p pour déverrouiller le mot de passe de cet utilisateur.`, 1);
    s.hash = un;
    sh.saveShadow(sp);
    return ok(`Déverrouillage du mot de passe pour l'utilisateur ${target}.\npasswd: Succès\n`);
  }
  if (o.d) {
    s.hash = '';
    sh.saveShadow(sp);
    return ok(`Suppression du mot de passe pour l'utilisateur ${target}.\npasswd: Succès\n`);
  }
  if (o.e) {
    s.last = '0';
    sh.saveShadow(sp);
    return ok(`Expiration du mot de passe pour l'utilisateur ${target}.\npasswd: Succès\n`);
  }
  if (o.n || o.x || o.w || o.i) {
    if (typeof o.n === 'string') s.min = o.n;
    if (typeof o.x === 'string') s.max = o.x;
    if (typeof o.w === 'string') s.warn = o.w;
    if (typeof o.i === 'string') s.inactive = o.i;
    sh.saveShadow(sp);
    return ok(`Ajustement des données de vieillissement pour l'utilisateur ${target}.\npasswd: Succès\n`);
  }
  if (o.__stdin) {
    if (!sh.isRoot) return fail("passwd : Seul root peut utiliser l'option --stdin.", 1);
    const p = (stdin ?? '').split('\n')[0];
    if (!p) return fail("passwd : Erreur de manipulation du jeton d'authentification", 1);
    if (sh.readOnly('/etc/shadow')) return fail("passwd : Échec de la manipulation du jeton d'authentification", 10);
    setPassword(sh, target, p);
    return ok(`Changement de mot de passe pour l'utilisateur ${target}.\npasswd : mise à jour réussie de tous les jetons d'authentification.\n`);
  }
  const header = `Changement de mot de passe pour l'utilisateur ${target}.\n`;
  if (sh.isRoot) return { out: header, err: '', code: 0, ask: changePasswordFlow(sh, target, true) };
  // regular user: current password first
  return {
    out: header,
    err: '',
    code: 0,
    ask: {
      prompt: 'Mot de passe actuel : ',
      hidden: true,
      next: (cur) => {
        if (!A.verifyPassword(s.hash, cur)) return fail("\npasswd : Échec de l'authentification", 10);
        const min = +(s.min || 0);
        if (min > 0 && +s.last + min > today()) return fail('\nVous devez attendre plus longtemps avant de changer votre mot de passe.\npasswd : Erreur de manipulation du jeton d\'authentification', 10);
        return { out: '\n', err: '', code: 0, ask: changePasswordFlow(sh, target, false) };
      }
    }
  };
};

// ---------------- chage ----------------
export const chage: CmdFn = ({ args, sh }) => {
  const { o, pos, err } = getopt(args, 'dEImMW', { lastday: 'd', expiredate: 'E', inactive: 'I', mindays: 'm', maxdays: 'M', warndays: 'W', list: 'l' });
  if (err) return fail(`chage : ${err}`, 2);
  if (pos.length !== 1) return fail("Utilisation : chage [options] LOGIN\n\nOptions :\n  -d, --lastday DERNIER_JOUR\n  -E, --expiredate DATE_EXPIRATION\n  -I, --inactive INACTIF\n  -l, --list\n  -m, --mindays JOURS_MIN\n  -M, --maxdays JOURS_MAX\n  -W, --warndays JOURS_AVERTISSEMENT", 2);
  const name = pos[0];
  if (!sh.getUser(name)) return fail(`chage : l'utilisateur « ${name} » n'existe pas dans /etc/passwd`, 1);
  const sp = sh.shadow();
  const s = sp.find((x) => x.name === name)!;
  if (o.l) {
    if (!sh.isRoot && sh.user !== name) return fail('chage : Permission non accordée.', 1);
    const last = s.last === '' ? null : +s.last;
    const max = s.max === '' ? 99999 : +s.max;
    const inact = s.inactive === '' ? -1 : +s.inactive;
    const passExp = last === 0 ? 'le mot de passe doit être changé' : last === null || max >= 99999 ? 'jamais' : A.fmtChageDate(last + max);
    const passInact = last === 0 ? 'le mot de passe doit être changé' : last === null || max >= 99999 || inact < 0 ? 'jamais' : A.fmtChageDate(last + max + inact);
    const rows: [string, string][] = [
      ['Dernier changement de mot de passe', last === 0 ? 'le mot de passe doit être changé' : last === null ? 'jamais' : A.fmtChageDate(last)],
      ['Fin de validité du mot de passe', passExp],
      ['Mot de passe désactivé', passInact],
      ['Fin de validité du compte', s.expire === '' ? 'jamais' : A.fmtChageDate(+s.expire)],
      ['Nombre minimum de jours entre les changements de mot de passe', s.min || '0'],
      ['Nombre maximum de jours entre les changements de mot de passe', String(max)],
      ["Nombre de jours d'avertissement avant la fin de validité du mot de passe", s.warn || '7']
    ];
    return ok(rows.map(([k, v]) => `${k.padEnd(72, ' ')}: ${v}`).join('\n') + '\n');
  }
  if (!sh.isRoot) return fail('chage : Permission non accordée.\nchage : impossible de verrouiller /etc/shadow ; réessayer plus tard.', 1);
  let changed = false;
  if (typeof o.d === 'string') {
    const d = A.parseDate(o.d);
    if (d === null) return fail(`chage : date « ${o.d} » non valide`, 2);
    s.last = String(d);
    changed = true;
  }
  if (typeof o.E === 'string') {
    if (o.E === '-1') s.expire = '';
    else {
      const d = A.parseDate(o.E);
      if (d === null) return fail(`chage : date « ${o.E} » non valide`, 2);
      s.expire = String(d);
    }
    changed = true;
  }
  if (typeof o.I === 'string') {
    s.inactive = o.I === '-1' ? '' : o.I;
    changed = true;
  }
  if (typeof o.m === 'string') {
    s.min = o.m;
    changed = true;
  }
  if (typeof o.M === 'string') {
    s.max = o.M === '-1' ? '' : o.M;
    changed = true;
  }
  if (typeof o.W === 'string') {
    s.warn = o.W;
    changed = true;
  }
  if (!changed) return ok(`Changement des informations d'âge pour ${name}\n(mode interactif non simulé : utilisez les options -d -E -I -m -M -W)\n`);
  sh.saveShadow(sp);
  return ok();
};

// ---------------- identity ----------------
export const whoami: CmdFn = ({ sh }) => ok(sh.user + '\n');

export const id: CmdFn = ({ args, sh }) => {
  const flags = args.filter((a) => a.startsWith('-')).join('').replace(/-/g, '');
  const name = args.find((a) => !a.startsWith('-')) ?? sh.user;
  const u = sh.getUser(name);
  if (!u) return fail(`id: '${name}' : utilisateur inexistant`);
  const gids = sh.userGids(name);
  const n = flags.includes('n');
  if (flags.includes('u')) return ok((n ? u.name : String(u.uid)) + '\n');
  if (flags.includes('G')) return ok(gids.map((g) => (n ? sh.groupName(g) : String(g))).join(' ') + '\n');
  if (flags.includes('g')) return ok((n ? sh.groupName(u.gid) : String(u.gid)) + '\n');
  return ok(`uid=${u.uid}(${u.name}) gid=${u.gid}(${sh.groupName(u.gid)}) groupes=${gids.map((g) => `${g}(${sh.groupName(g)})`).join(',')}${args.length ? '' : ' contexte=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023'}\n`);
};

export const groupsCmd: CmdFn = ({ args, sh }) => {
  const names = args.length ? args : [sh.user];
  let out = '';
  let err = '';
  for (const n of names) {
    if (!sh.getUser(n)) {
      err += `groups: '${n}' : utilisateur inexistant\n`;
      continue;
    }
    const g = sh.userGids(n).map((x) => sh.groupName(x)).join(' ');
    out += args.length ? `${n} : ${g}\n` : `${g}\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

function sessionsTable(sh: Shell): string[] {
  const d = new Date(sh.state.bootTime + 60000);
  const ts = `${d.toISOString().slice(0, 10)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const rows = [`etudiant tty2         ${ts} (tty2)`, `etudiant pts/0        ${ts} (192.168.56.1)`];
  sh.sessions.filter((s) => s.ssh).forEach((s, i) => rows.push(`${s.user.padEnd(8)} pts/${i + 1}        ${ts} (192.168.56.10)`));
  return rows;
}

export const who: CmdFn = ({ sh, args }) => {
  if (args.includes('-b')) return ok(`         démarrage système ${new Date(sh.state.bootTime).toISOString().slice(0, 16).replace('T', ' ')}\n`);
  if (args.includes('-r')) return ok(`         niveau d'exécution ${sh.state.currentTarget === 'graphical.target' ? 5 : 3} ${new Date(sh.state.bootTime).toISOString().slice(0, 16).replace('T', ' ')}\n`);
  return ok(sessionsTable(sh).join('\n') + '\n');
};

export const w: CmdFn = ({ sh }) => {
  const up = Math.floor((Date.now() - sh.state.bootTime) / 60000);
  const t = new Date();
  const head = ` ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')} up ${Math.floor(up / 60)}:${String(up % 60).padStart(2, '0')},  ${sessionsTable(sh).length} users,  load average: 0,08, 0,03, 0,01\n`;
  return ok(head + 'USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\n' + 'etudiant tty2    tty2             13:03    3:12m  0.03s  0.03s /usr/libexec/gnome-session-binary\netudiant pts/0    192.168.56.1     13:05    0.00s  0.04s  0.00s w\n');
};

// ---------------- permissions ----------------
function applySymbolic(mode: number, spec: string, isDir: boolean): number | null {
  let m = mode;
  for (const clause of spec.split(',')) {
    const r = /^([ugoa]*)([+\-=])([rwxXst]*)$/.exec(clause);
    if (!r) {
      const r2 = /^([ugoa]*)([+\-=])([ugo])$/.exec(clause);
      if (!r2) return null;
    }
    const [, whoS, op, perms] = r ?? ['', '', '', ''];
    const who = whoS === '' || whoS.includes('a') ? 'ugo' : whoS;
    let bits = 0;
    for (const w of who) {
      const shift = w === 'u' ? 6 : w === 'g' ? 3 : 0;
      for (const p of perms) {
        if (p === 'r') bits |= 4 << shift;
        if (p === 'w') bits |= 2 << shift;
        if (p === 'x' || (p === 'X' && (isDir || mode & 0o111))) bits |= 1 << shift;
        if (p === 's' && w === 'u') bits |= 0o4000;
        if (p === 's' && w === 'g') bits |= 0o2000;
        if (p === 't') bits |= 0o1000;
      }
    }
    if (op === '+') m |= bits;
    else if (op === '-') m &= ~bits;
    else {
      let mask = 0;
      for (const w of who) mask |= w === 'u' ? 0o4700 : w === 'g' ? 0o2070 : 0o1007;
      m = (m & ~mask) | bits;
    }
  }
  return m;
}

export const chmod: CmdFn = ({ args, sh }) => {
  const rec = args.includes('-R');
  const verbose = args.includes('-v') || args.includes('-c');
  const rest = args.filter((a) => a !== '-R' && a !== '-v' && a !== '-c' && a !== '-f');
  if (rest.length < 2) return fail(rest.length ? `chmod: opérande manquant après '${rest[0]}'\nSaisissez « chmod --help » pour plus d'informations.` : "chmod: opérande manquant\nSaisissez « chmod --help » pour plus d'informations.");
  const [spec, ...files] = rest;
  const octal = /^[0-7]{1,4}$/.test(spec);
  if (!octal && applySymbolic(0, spec, false) === null) return fail(`chmod: mode incorrect : « ${spec} »\nSaisissez « chmod --help » pour plus d'informations.`);
  let err = '';
  let out = '';
  const who = sh.who();
  const apply = (p: string, n: FNode) => {
    if (who.uid !== 0 && n.uid !== who.uid) {
      err += `chmod: modification des droits de '${p}': Opération non permise\n`;
      return;
    }
    const old = n.mode;
    n.mode = octal ? parseInt(spec, 8) | (spec.length <= 3 ? n.mode & 0o7000 & (n.t === 'd' ? 0o7000 : 0) : 0) : applySymbolic(n.mode, spec, n.t === 'd')!;
    if (octal && spec.length <= 3 && n.t !== 'd') n.mode &= 0o777;
    if (verbose && old !== n.mode) out += `le mode de '${p}' a été modifié de ${old.toString(8).padStart(4, '0')} en ${n.mode.toString(8).padStart(4, '0')}\n`;
  };
  for (const f of files) {
    const abs = sh.abs(f);
    const n = lookup(sh.state.root, abs);
    if (!n) {
      err += `chmod: impossible d'accéder à '${f}': Aucun fichier ou dossier de ce type\n`;
      continue;
    }
    if (rec && n.t === 'd') for (const [p, x] of walk(sh.state.root, abs)) apply(p === abs ? f : f.replace(/\/$/, '') + p.slice(abs.length), x);
    else apply(f, n);
  }
  return { out, err, code: err ? 1 : 0 };
};

function chownLike(cmd: 'chown' | 'chgrp'): CmdFn {
  return ({ args, sh }) => {
    const rec = args.includes('-R');
    const verbose = args.includes('-v');
    const rest = args.filter((a) => !/^-[Rvhcf]+$/.test(a));
    if (rest.length < 2) return fail(rest.length ? `${cmd}: opérande manquant après '${rest[0]}'` : `${cmd}: opérande manquant`);
    const [spec, ...files] = rest;
    let uid: number | undefined;
    let gid: number | undefined;
    if (cmd === 'chgrp') {
      const g = sh.getGroup(spec);
      if (!g) return fail(`chgrp: groupe incorrect: « ${spec} »`);
      gid = g.gid;
    } else {
      const m = /^([^:.]*)(?:[:.](.*))?$/.exec(spec)!;
      const [, uName, gName] = m;
      if (uName) {
        const u = sh.getUser(uName) ?? (/^\d+$/.test(uName) ? { uid: +uName, gid: undefined } : undefined);
        if (!u) return fail(`chown: utilisateur incorrect: « ${spec} »`);
        uid = u.uid;
        if (gName === '' && spec.match(/[:.]$/)) gid = (u as { gid?: number }).gid;
      }
      if (gName) {
        const g = sh.getGroup(gName);
        if (!g) return fail(`chown: groupe incorrect: « ${spec} »`);
        gid = g.gid;
      }
    }
    const who = sh.who();
    let err = '';
    let out = '';
    const apply = (p: string, n: FNode) => {
      const allowed = who.uid === 0 || (uid === undefined && n.uid === who.uid && gid !== undefined && who.gids.includes(gid));
      if (!allowed) {
        err += cmd === 'chown' ? `chown: modification du propriétaire de '${p}': Opération non permise\n` : `chgrp: modification du groupe de '${p}': Opération non permise\n`;
        return;
      }
      if (uid !== undefined) n.uid = uid;
      if (gid !== undefined) n.gid = gid;
      if (verbose) out += `le propriétaire de '${p}' a été modifié\n`;
    };
    for (const f of files) {
      const abs = sh.abs(f);
      const n = lookup(sh.state.root, abs);
      if (!n) {
        err += `${cmd}: impossible d'accéder à '${f}': Aucun fichier ou dossier de ce type\n`;
        continue;
      }
      if (rec && n.t === 'd') for (const [p, x] of walk(sh.state.root, abs)) apply(p, x);
      else apply(f, n);
    }
    return { out, err, code: err ? 1 : 0 };
  };
}
export const chown = chownLike('chown');
export const chgrp = chownLike('chgrp');

export const umask: CmdFn = ({ sh }) => ok(sh.isRoot ? '0022\n' : '0002\n');

// ---------------- su / exit / sudo / ssh ----------------
function accountProblem(sh: Shell, user: string): string | null {
  const s = sh.shadow().find((x) => x.name === user);
  if (!s) return null;
  if (s.expire !== '' && +s.expire <= today()) return 'expired';
  return null;
}

function passwordExpired(sh: Shell, user: string): boolean {
  const s = sh.shadow().find((x) => x.name === user);
  if (!s) return false;
  if (s.last === '0') return true;
  const max = s.max === '' ? 99999 : +s.max;
  return max < 99999 && +s.last + max < today();
}

function startSession(sh: Shell, user: string, login: boolean, viaSsh = false): CmdRes {
  const u = sh.getUser(user)!;
  if (/nologin|false/.test(u.shell)) return fail('Ce compte est actuellement indisponible.', 1);
  sh.pushSession(user, login, viaSsh ? { SSH_CONNECTION: '192.168.56.1 51234 192.168.56.10 22', SSH_CLIENT: '192.168.56.1 51234 22' } : {});
  if (viaSsh) sh.session.ssh = true;
  if (!lookup(sh.state.root, u.home)) return ok(`su: avertissement : impossible de changer le répertoire vers ${u.home}: Aucun fichier ou dossier de ce type\n`);
  return ok(viaSsh ? `Last login: ${new Date().toUTCString()} from 192.168.56.1\n` : '');
}

function forcedChange(sh: Shell, user: string, then: () => CmdRes, prefix: string): CmdRes {
  return {
    out: `${prefix}Vous devez changer votre mot de passe immédiatement (le mot de passe a expiré)\nChangement de mot de passe pour ${user}.\n`,
    err: '',
    code: 0,
    ask: {
      prompt: 'Mot de passe actuel : ',
      hidden: true,
      next: (cur) => {
        const s = sh.shadow().find((x) => x.name === user)!;
        if (!A.verifyPassword(s.hash, cur)) return fail("\nsu: Échec d'authentification", 1);
        return { out: '\n', err: '', code: 0, ask: changePasswordFlow(sh, user, false, () => then()) };
      }
    }
  };
}

export const su: CmdFn = ({ args, sh }) => {
  let login = false;
  let cmd: string | null = null;
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-' || a === '-l' || a === '--login') login = true;
    else if (a === '-c') cmd = args[++i] ?? '';
    else rest.push(a);
  }
  const target = rest[0] ?? 'root';
  const u = sh.getUser(target);
  if (!u) return fail(`su: l'utilisateur ${target} n'existe pas ou l'entrée utilisateur ne contient pas tous les champs requis`, 1);
  const go = (): CmdRes => {
    if (accountProblem(sh, target) === 'expired') return fail('su: Le compte a expiré ; veuillez contacter votre administrateur système', 1);
    if (cmd !== null) {
      sh.pushSession(target, login);
      const r = sh.runLine(cmd);
      sh.sessions.pop();
      return r;
    }
    return startSession(sh, target, login);
  };
  if (sh.isRoot) return go();
  return {
    out: '',
    err: '',
    code: 0,
    ask: {
      prompt: 'Mot de passe : ',
      hidden: true,
      next: (p) => {
        const s = sh.shadow().find((x) => x.name === target);
        if (!s || !A.verifyPassword(s.hash, p)) {
          sh.log('su', `pam_unix(su:auth): authentication failure; logname=${sh.user} user=${target}`, 5);
          return fail("\nsu: Échec d'authentification", 1);
        }
        if (accountProblem(sh, target) === 'expired') return fail('\nsu: Le compte a expiré ; veuillez contacter votre administrateur système', 1);
        if (passwordExpired(sh, target)) return forcedChange(sh, target, go, '\n');
        const r = go();
        return { ...r, out: '\n' + r.out };
      }
    }
  };
};

export const exit: CmdFn = ({ sh }) => {
  if (sh.session.rd === 'chroot') {
    sh.session.rd = sh.flags.sysrootRw ? 'rw' : 'ro';
    return ok('exit\n');
  }
  if (sh.sessions.length <= 1) return ok('déconnexion\n(dernière session : le terminal simulé reste ouvert — utilisez « Réinitialiser » pour repartir de zéro)\n');
  const s = sh.sessions.pop()!;
  return ok(s.ssh ? `déconnexion\nConnection to 192.168.56.10 closed.\n` : s.login ? 'déconnexion\n' : 'exit\n');
};

export const CMD_PATHS: Record<string, string> = {};

export function sudoAllowed(sh: Shell, user: string, cmdPath: string, fullCmd: string, runas = 'root'): { allowed: boolean; nopasswd: boolean; listed: boolean } {
  let content = sh.readRaw('/etc/sudoers');
  if (/^#includedir \/etc\/sudoers\.d/m.test(content) || /^@includedir \/etc\/sudoers\.d/m.test(content)) {
    const d = lookup(sh.state.root, '/etc/sudoers.d');
    if (d?.kids) for (const k of Object.keys(d.kids).sort()) if (!k.includes('.') && !k.endsWith('~')) content += '\n' + (d.kids[k].data ?? '');
  }
  const rules = parseSudoers(content);
  const groups = sh.userGids(user).map((g) => sh.groupName(g));
  const mine = rules.filter((r) => r.who === user || r.who === 'ALL' || (r.who.startsWith('%') && groups.includes(r.who.slice(1))));
  let allowed = false;
  let nopasswd = false;
  for (const r of mine) {
    if (!r.runas.includes('ALL') && !r.runas.includes(runas)) continue;
    if (r.cmds.some((c) => c === 'ALL' || c === cmdPath || c === fullCmd || (c.endsWith('*') && fullCmd.startsWith(c.slice(0, -1))))) {
      allowed = true;
      nopasswd = nopasswd || r.nopasswd;
    }
  }
  return { allowed, nopasswd, listed: mine.length > 0 };
}

export const sudo: CmdFn = ({ args, sh, stdin }) => {
  let i = 0;
  let runas = 'root';
  let list = false;
  let loginShell = false;
  while (i < args.length && args[i].startsWith('-')) {
    if (args[i] === '-u') runas = args[++i];
    else if (args[i] === '-l') list = true;
    else if (args[i] === '-i' || args[i] === '-s') loginShell = true;
    i++;
  }
  const cmdArgs = args.slice(i);
  const user = sh.user;
  if (!list && !loginShell && !cmdArgs.length) return fail('usage: sudo -h | -K | -k | -V\nusage: sudo [-u utilisateur] commande\nusage: sudo -l\nusage: sudo -i', 1);
  const cmdPath = loginShell ? '/bin/bash' : sh.which(cmdArgs[0] ?? '') ?? cmdArgs[0] ?? '';
  const full = [cmdPath, ...cmdArgs.slice(1)].join(' ');
  if (!sh.getUser(runas)) return fail(`sudo: utilisateur inconnu ${runas}`, 1);
  const perm = sh.isRoot ? { allowed: true, nopasswd: true, listed: true } : sudoAllowed(sh, user, cmdPath, full, runas);
  const run = (): CmdRes => {
    if (list) {
      let content = sh.readRaw('/etc/sudoers');
      const d = lookup(sh.state.root, '/etc/sudoers.d');
      if (d?.kids) for (const k of Object.keys(d.kids)) content += '\n' + (d.kids[k].data ?? '');
      const groups = sh.userGids(user).map((g) => sh.groupName(g));
      const mine = parseSudoers(content).filter((r) => r.who === user || (r.who.startsWith('%') && groups.includes(r.who.slice(1))));
      if (!mine.length) return fail(`Désolé, l'utilisateur ${user} ne peut pas utiliser sudo sur rhel9.`, 1);
      return ok(`L'utilisateur ${user} peut utiliser les commandes suivantes sur rhel9 :\n` + mine.map((r) => `    (${r.runas.join(', ')}) ${r.nopasswd ? 'NOPASSWD: ' : ''}${r.cmds.join(', ')}`).join('\n') + '\n');
    }
    if (!perm.listed) {
      sh.log('sudo', `${user} : user NOT in sudoers ; TTY=pts/0 ; PWD=${sh.session.cwd} ; USER=root ; COMMAND=${full}`, 2);
      return fail(`${user} n'apparaît pas dans le fichier sudoers. Cet incident sera signalé.`, 1);
    }
    if (!perm.allowed) {
      sh.log('sudo', `${user} : command not allowed ; TTY=pts/0 ; PWD=${sh.session.cwd} ; USER=root ; COMMAND=${full}`, 2);
      return fail(`Désolé, l'utilisateur ${user} n'est pas autorisé à exécuter « ${full} » en tant que ${runas} sur rhel9.`, 1);
    }
    sh.sudoUntil[user] = Date.now() + 5 * 60000;
    sh.log('sudo', `${user} : TTY=pts/0 ; PWD=${sh.session.cwd} ; USER=${runas} ; COMMAND=${full}`, 5);
    if (loginShell) return startSession(sh, runas, true);
    sh.pushSession(runas, false);
    const temp = sh.session;
    temp.sudoTemp = true;
    temp.cwd = sh.sessions[sh.sessions.length - 2].cwd;
    const cleanup = () => {
      const k = sh.sessions.indexOf(temp);
      if (k >= 0) sh.sessions.splice(k, 1);
    };
    const r = sh.exec(cmdArgs, stdin);
    if (r.ask) {
      const wrap = (a: Ask): Ask => ({
        ...a,
        next: (ans) => {
          const rr = a.next(ans);
          if (rr.ask) return { ...rr, ask: wrap(rr.ask) };
          cleanup();
          return rr;
        }
      });
      return { ...r, ask: wrap(r.ask) };
    }
    cleanup();
    return r;
  };
  if (sh.isRoot || perm.nopasswd || (sh.sudoUntil[user] ?? 0) > Date.now()) return run();
  const s = sh.shadow().find((x) => x.name === user);
  const ask = (tries: number): Ask => ({
    prompt: `[sudo] Mot de passe de ${user} : `,
    hidden: true,
    next: (p) => {
      if (!s || !A.verifyPassword(s.hash, p)) {
        if (tries >= 2) return fail('\nsudo: 3 saisies de mots de passe incorrectes', 1);
        return { out: '\nDésolé, essayez de nouveau.\n', err: '', code: 1, ask: ask(tries + 1) };
      }
      if (perm.listed) sh.sudoUntil[user] = Date.now() + 5 * 60000;
      const r = run();
      return { ...r, out: '\n' + r.out };
    }
  });
  return { out: '', err: '', code: 0, ask: ask(0) };
};

export const ssh: CmdFn = ({ args, sh }) => {
  const pos = args.filter((a) => !a.startsWith('-'));
  if (!pos.length) return fail('usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-p port] destination [command]', 255);
  const dest = pos[0];
  const cmd = pos.slice(1).join(' ');
  const [userPart, host] = dest.includes('@') ? dest.split('@') : [sh.user, dest];
  const local = ['localhost', '127.0.0.1', 'rhel9', '192.168.56.10', '0'].includes(host);
  if (!local) return fail(`ssh: connect to host ${host} port 22: No route to host\n(simulateur : seule la machine locale rhel9 / 192.168.56.10 / localhost est joignable)`, 255);
  if (sh.state.services.sshd.active !== 'active') return fail(`ssh: connect to host ${host} port 22: Connection refused`, 255);
  const u = sh.getUser(userPart);
  const attempt = (tries: number): Ask => ({
    prompt: `${userPart}@${host}'s password: `,
    hidden: true,
    next: (p) => {
      const s = sh.shadow().find((x) => x.name === userPart);
      if (!u || !s || !A.verifyPassword(s.hash, p) || s.hash.startsWith('!')) {
        sh.log('sshd.service', `Failed password for ${u ? '' : 'invalid user '}${userPart} from 192.168.56.1 port 51234 ssh2`, 4);
        if (tries >= 2) return fail(`\n${userPart}@${host}: Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password).`, 255);
        return { out: '\nPermission denied, please try again.\n', err: '', code: 255, ask: attempt(tries + 1) };
      }
      if (accountProblem(sh, userPart) === 'expired') return fail('\nYour account has expired; please contact your system administrator.\nConnection closed by 192.168.56.10 port 22', 255);
      sh.log('sshd.service', `Accepted password for ${userPart} from 192.168.56.1 port 51234 ssh2`, 6);
      const go = (): CmdRes => {
        if (cmd) {
          sh.pushSession(userPart, true, { SSH_CONNECTION: '192.168.56.1 51234 192.168.56.10 22' });
          const r = sh.runLine(cmd);
          sh.sessions.pop();
          return r;
        }
        return startSession(sh, userPart, true, true);
      };
      if (passwordExpired(sh, userPart))
        return {
          out: '\nWARNING: Your password has expired.\nYou must change your password now and login again!\nChangement de mot de passe pour l\'utilisateur ' + userPart + '.\n',
          err: '',
          code: 0,
          ask: {
            prompt: 'Mot de passe actuel : ',
            hidden: true,
            next: (cur) => {
              if (!A.verifyPassword(s.hash, cur)) return fail("\npasswd : Échec de l'authentification\nConnection to 192.168.56.10 closed.", 1);
              return { out: '\n', err: '', code: 0, ask: changePasswordFlow(sh, userPart, false, () => ok("passwd : mise à jour réussie de tous les jetons d'authentification.\nConnection to 192.168.56.10 closed.\n")) };
            }
          }
        };
      const r = go();
      return { ...r, out: '\n' + r.out };
    }
  });
  const known = (sh.session.env.__known ?? '').includes(host);
  if (!known) {
    return {
      out: '',
      err: '',
      code: 0,
      ask: {
        prompt: `The authenticity of host '${host} (192.168.56.10)' can't be established.\nED25519 key fingerprint is SHA256:Xq3k8m1vZp4R2yNw7cB0tF5aJdL6hUe9sGiO1rK2pQ.\nAre you sure you want to continue connecting (yes/no/[fingerprint])? `,
        hidden: false,
        next: (a) => {
          if (a.trim() !== 'yes') return fail('Host key verification failed.', 255);
          sh.session.env.__known = (sh.session.env.__known ?? '') + ' ' + host;
          return { out: `Warning: Permanently added '${host}' (ED25519) to the list of known hosts.\n`, err: '', code: 0, ask: attempt(0) };
        }
      }
    };
  }
  return { out: '', err: '', code: 0, ask: attempt(0) };
};

// ---------------- editors ----------------
export const visudo: CmdFn = ({ args, sh }) => {
  if (!sh.isRoot) return fail('visudo: /etc/sudoers : Permission non accordée', 1);
  const fIdx = args.indexOf('-f');
  const path = fIdx >= 0 ? args[fIdx + 1] : '/etc/sudoers';
  if (args.includes('-c')) {
    let out = '';
    let bad = false;
    const check = (p: string) => {
      const n = lookup(sh.state.root, p);
      if (!n) return;
      const l = validateSudoers(n.data ?? '');
      if (l) {
        out += `>>> ${p}: erreur de syntaxe près de la ligne ${l} <<<\nerreur d'analyse dans ${p} près de la ligne ${l}\n`;
        bad = true;
      } else out += `${p} : analysé correctement\n`;
    };
    check(sh.abs(path));
    if (fIdx < 0) {
      const d = lookup(sh.state.root, '/etc/sudoers.d');
      if (d?.kids) for (const k of Object.keys(d.kids).sort()) check(`/etc/sudoers.d/${k}`);
    }
    return bad ? { out: '', err: out, code: 1 } : ok(out);
  }
  if (!lookup(sh.state.root, sh.abs(path))) sh.writeRaw(sh.abs(path), '', 0o440);
  return sh.openEditor(path, 'visudo');
};

export const vipw: CmdFn = ({ args, sh }) => {
  if (!sh.isRoot) return fail('vipw: Permission non accordée.', 1);
  return { ...sh.openEditor(args.includes('-s') ? '/etc/shadow' : '/etc/passwd', 'vipw'), out: `(fichier verrouillé pendant l'édition : personne d'autre ne peut le modifier)\n` + sh.editorView() };
};
export const vigr: CmdFn = ({ args, sh }) => {
  if (!sh.isRoot) return fail('vigr: Permission non accordée.', 1);
  return { ...sh.openEditor(args.includes('-s') ? '/etc/gshadow' : '/etc/group', 'vigr'), out: `(fichier verrouillé pendant l'édition)\n` + sh.editorView() };
};

export const editor =
  (kind: 'nano' | 'vi'): CmdFn =>
  ({ args, sh }) => {
    const f = args.find((a) => !a.startsWith('-') && !a.startsWith('+'));
    if (!f) return fail(`${kind}: indiquez un fichier (éditeur simplifié du simulateur)`);
    const n = sh.node(f);
    if (n && n.t === 'd') return fail(`${kind}: « ${f} » est un répertoire`);
    return sh.openEditor(f, kind);
  };

export const newgrp: CmdFn = ({ args, sh }) => {
  const g = sh.getGroup(args[0] ?? '');
  if (!g) return fail(`newgrp: groupe « ${args[0] ?? ''} » inexistant`);
  if (!sh.isRoot && !g.members.includes(sh.user) && sh.getUser(sh.user)!.gid !== g.gid) return fail('newgrp: Permission non accordée.');
  return ok();
};

export const chpasswd: CmdFn = ({ sh, stdin }) => {
  if (!sh.isRoot) return fail('chpasswd: Permission non accordée.');
  for (const l of (stdin ?? '').split('\n').filter(Boolean)) {
    const [u, p] = l.split(':');
    if (sh.getUser(u)) setPassword(sh, u, p);
  }
  return ok();
};
