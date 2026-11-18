/** Simulated bash for RHEL 9: parser, executor, sessions, permissions, interactive prompts and a mini editor. */
import { normPath, lookup, can, traverseDenied, dirname, basename, globRe, file, dir, type FNode, type Who } from './vfs';
import { initialState, HOSTNAME, type SysState } from './system';
import * as A from './accounts';
import { COMMANDS } from './commands';

export interface Ask {
  prompt: string;
  hidden: boolean;
  next: (answer: string) => CmdRes;
}

export interface CmdRes {
  out: string;
  err: string;
  code: number;
  ask?: Ask;
  clear?: boolean;
}

export interface Ctx {
  argv: string[]; // argv[0] = command name
  args: string[];
  stdin: string | null;
  sh: Shell;
}

export type CmdFn = (ctx: Ctx) => CmdRes;

export interface Session {
  user: string;
  cwd: string;
  login: boolean;
  env: Record<string, string>;
  /** rd.break emergency shell state */
  rd?: 'ro' | 'rw' | 'chroot';
  ssh?: boolean;
  sudoTemp?: boolean;
}

export interface Editor {
  path: string;
  lines: string[];
  dirty: boolean;
  kind: 'nano' | 'vi' | 'visudo' | 'vipw' | 'vigr';
  original: string;
  asRoot: boolean;
}

export interface OutChunk {
  text: string;
  err?: boolean;
}

export const ok = (out = ''): CmdRes => ({ out, err: '', code: 0 });
export const fail = (err: string, code = 1, out = ''): CmdRes => ({ out, err: err.endsWith('\n') || !err ? err : err + '\n', code });
const nl = (s: string) => (s && !s.endsWith('\n') ? s + '\n' : s);

export const BUILTINS = new Set(['cd', 'pwd', 'echo', 'exit', 'logout', 'history', 'type', 'test', '[', 'clear', 'export', 'alias', 'umask', 'true', 'false', 'source', '.', 'help']);
export const ALIASES: Record<string, string> = { ls: 'ls --color=auto', ll: 'ls -l --color=auto', grep: 'grep --color=auto', 'l.': 'ls -d .* --color=auto' };

interface Token {
  v: string;
  quoted: boolean;
  op?: string;
}

interface SimpleCmd {
  argv: Token[];
  redirs: { op: string; target: string }[];
}

interface Pipeline {
  cmds: SimpleCmd[];
  sep: ';' | '&&' | '||' | null; // separator before this pipeline
}

export class Shell {
  state: SysState;
  sessions: Session[];
  pending: Ask | null = null;
  editor: Editor | null = null;
  history: string[] = [];
  lastCode = 0;
  sudoUntil: Record<string, number> = {};
  /** extra flags used by missions (e.g. relabel done) */
  flags: Record<string, boolean> = {};
  fw: string[] = ['cockpit', 'dhcpv6-client', 'ssh'];
  /** pristine config file contents for rpm -V */
  pristine: Record<string, string> = {};

  constructor(startUser = 'etudiant', state?: SysState) {
    this.state = state ?? initialState();
    this.sessions = [];
    this.pushSession(startUser, true);
    for (const p of Object.values(this.state.installed)) for (const c of p.config) {
      const n = lookup(this.state.root, c);
      if (n && n.t === 'f') this.pristine[c] = n.data ?? '';
    }
  }

  // ---------- sessions ----------
  get session(): Session {
    return this.sessions[this.sessions.length - 1];
  }
  get user(): string {
    return this.session.user;
  }
  pushSession(user: string, login: boolean, extraEnv: Record<string, string> = {}) {
    const pw = this.getUser(user);
    const home = pw?.home ?? '/';
    const prev = this.sessions.length ? this.session : null;
    this.sessions.push({
      user,
      cwd: login || !prev ? (lookup(this.state.root, home) ? home : '/') : prev.cwd,
      login,
      env: {
        HOME: home,
        USER: user,
        LOGNAME: user,
        SHELL: pw?.shell ?? '/bin/bash',
        HOSTNAME,
        PATH: user === 'root' ? '/root/.local/bin:/root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin' : `/home/${user}/.local/bin:/home/${user}/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin`,
        LANG: 'fr_FR.UTF-8',
        ...(prev && !login ? { ...prev.env, USER: user, HOME: prev.env.HOME } : {}),
        ...extraEnv
      }
    });
  }

  prompt(): string {
    const s = this.session;
    if (s.rd === 'ro' || s.rd === 'rw') return 'switch_root:/# ';
    if (s.rd === 'chroot') return 'sh-5.1# ';
    const pw = this.getUser(s.user);
    const home = pw?.home ?? '';
    const dirName = s.cwd === home ? '~' : s.cwd === '/' ? '/' : basename(s.cwd);
    return `[${s.user}@${HOSTNAME} ${dirName}]${s.user === 'root' ? '#' : '$'} `;
  }

  // ---------- accounts ----------
  readRaw(path: string): string {
    const n = lookup(this.state.root, path);
    return n && n.t === 'f' ? n.data ?? '' : '';
  }
  writeRaw(path: string, data: string, mode?: number) {
    const n = lookup(this.state.root, path);
    if (n && n.t === 'f') {
      n.data = data;
      n.mtime = Date.now();
      delete n.sz;
      return;
    }
    const parent = lookup(this.state.root, dirname(path));
    if (parent && parent.t === 'd') parent.kids![basename(path)] = file(data, 0, 0, mode ?? 0o644);
  }
  passwd() {
    return A.parsePasswd(this.readRaw('/etc/passwd'));
  }
  shadow() {
    return A.parseShadow(this.readRaw('/etc/shadow'));
  }
  groups() {
    return A.parseGroup(this.readRaw('/etc/group'));
  }
  gshadow() {
    return A.parseGshadow(this.readRaw('/etc/gshadow'));
  }
  savePasswd(e: A.PwEnt[]) {
    this.writeRaw('/etc/passwd', A.fmtPasswd(e));
  }
  saveShadow(e: A.SpEnt[]) {
    this.writeRaw('/etc/shadow', A.fmtShadow(e));
  }
  saveGroup(e: A.GrEnt[]) {
    this.writeRaw('/etc/group', A.fmtGroup(e));
  }
  saveGshadow(e: A.GsEnt[]) {
    this.writeRaw('/etc/gshadow', A.fmtGshadow(e));
  }
  getUser(name: string) {
    return this.passwd().find((u) => u.name === name);
  }
  getUserById(uid: number) {
    return this.passwd().find((u) => u.uid === uid);
  }
  getGroup(nameOrGid: string) {
    const g = this.groups();
    return g.find((x) => x.name === nameOrGid) ?? (/^\d+$/.test(nameOrGid) ? g.find((x) => x.gid === +nameOrGid) : undefined);
  }
  userName(uid: number) {
    return this.getUserById(uid)?.name ?? String(uid);
  }
  groupName(gid: number) {
    return this.groups().find((g) => g.gid === gid)?.name ?? String(gid);
  }
  userGids(name: string): number[] {
    const u = this.getUser(name);
    if (!u) return [];
    const gids = [u.gid];
    for (const g of this.groups()) if (g.members.includes(name) && !gids.includes(g.gid)) gids.push(g.gid);
    return gids;
  }
  who(user = this.user): Who {
    const u = this.getUser(user);
    return { uid: u?.uid ?? 65534, gids: this.userGids(user) };
  }
  get isRoot() {
    return this.who().uid === 0;
  }
  loginDefs() {
    return A.parseConf(this.readRaw('/etc/login.defs'));
  }
  useraddDefaults() {
    return A.parseConf(this.readRaw('/etc/default/useradd'));
  }
  log(unit: string, msg: string, prio = 6) {
    this.state.journal.push({ ts: Date.now(), unit, prio, msg, boot: 0 });
  }

  // ---------- filesystem helpers (permission aware) ----------
  abs(p: string): string {
    return normPath(p, this.session.cwd);
  }
  node(p: string, followLast = true): FNode | null {
    return lookup(this.state.root, this.abs(p), followLast);
  }
  /** Returns an error string or null if the current user can access the path for `bit`. */
  checkAccess(abs: string, bit: 'r' | 'w' | 'x' | null): 'ENOENT' | 'EACCES' | null {
    const who = this.who();
    if (traverseDenied(this.state.root, abs, who)) return 'EACCES';
    const n = lookup(this.state.root, abs);
    if (!n) return 'ENOENT';
    if (bit && !can(n, who, bit)) return 'EACCES';
    return null;
  }
  /** Can the current user create/delete entries in directory `absDir`? */
  canWriteDir(absDir: string): 'ENOENT' | 'EACCES' | 'ENOTDIR' | 'EROFS' | null {
    if (this.readOnly(absDir)) return 'EROFS';
    const who = this.who();
    if (traverseDenied(this.state.root, absDir, who)) return 'EACCES';
    const d = lookup(this.state.root, absDir);
    if (!d) return 'ENOENT';
    if (d.t !== 'd') return 'ENOTDIR';
    if (!can(d, who, 'w') || !can(d, who, 'x')) return 'EACCES';
    return null;
  }
  readOnly(_abs: string): boolean {
    return this.session.rd === 'chroot' && !this.flags.sysrootRw;
  }
  readFile(p: string): { data?: string; err?: string } {
    const a = this.abs(p);
    const e = this.checkAccess(a, null);
    if (e === 'ENOENT') return { err: 'Aucun fichier ou dossier de ce type' };
    if (e === 'EACCES') return { err: 'Permission non accordée' };
    const n = lookup(this.state.root, a)!;
    if (n.t === 'd') return { err: 'est un dossier' };
    if (!can(n, this.who(), 'r')) return { err: 'Permission non accordée' };
    return { data: n.data ?? '' };
  }
  /** Write (create or truncate/append) a file as the current user. */
  writeFile(p: string, data: string, append = false): string | null {
    const a = this.abs(p);
    const n = lookup(this.state.root, a);
    if (this.readOnly(a)) return 'Système de fichiers accessible en lecture seulement';
    if (n) {
      if (n.t === 'd') return 'est un dossier';
      if (traverseDenied(this.state.root, a, this.who()) || !can(n, this.who(), 'w')) return 'Permission non accordée';
      n.data = append ? (n.data ?? '') + data : data;
      delete n.sz;
      n.mtime = Date.now();
      return null;
    }
    const e = this.canWriteDir(dirname(a));
    if (e === 'ENOENT') return 'Aucun fichier ou dossier de ce type';
    if (e === 'ENOTDIR') return "N'est pas un dossier";
    if (e === 'EROFS') return 'Système de fichiers accessible en lecture seulement';
    if (e) return 'Permission non accordée';
    const parent = lookup(this.state.root, dirname(a))!;
    const who = this.who();
    const umask = who.uid === 0 ? 0o022 : 0o002;
    parent.kids![basename(a)] = file(data, who.uid, this.getUser(this.user)?.gid ?? 0, 0o666 & ~umask);
    parent.mtime = Date.now();
    return null;
  }
  mkdirNode(a: string): FNode {
    const parent = lookup(this.state.root, dirname(a))!;
    const who = this.who();
    const umask = who.uid === 0 ? 0o022 : 0o002;
    const d = dir(who.uid, this.getUser(this.user)?.gid ?? 0, 0o777 & ~umask);
    parent.kids![basename(a)] = d;
    return d;
  }
  /** Expand a glob token against the VFS. Returns [] if nothing matches. */
  glob(pattern: string): string[] {
    const absPat = pattern.startsWith('/');
    const parts = pattern.split('/').filter((x, i) => x || i === 0);
    let cands: string[] = [absPat ? '/' : this.session.cwd];
    let rel: string[] = [absPat ? '' : '.'];
    const segs = absPat ? parts.slice(1) : parts;
    for (const seg of segs) {
      const next: string[] = [];
      const nextRel: string[] = [];
      cands.forEach((base, i) => {
        const n = lookup(this.state.root, base);
        if (!n || n.t !== 'd') return;
        if (/[*?]/.test(seg)) {
          const re = globRe(seg);
          for (const k of Object.keys(n.kids!).sort()) {
            if (k.startsWith('.') && !seg.startsWith('.')) continue;
            if (re.test(k)) {
              next.push(base === '/' ? `/${k}` : `${base}/${k}`);
              nextRel.push(rel[i] === '' ? `/${k}` : rel[i] === '.' ? k : `${rel[i]}/${k}`);
            }
          }
        } else {
          const p = seg === '..' || seg === '.' ? normPath(seg, base) : base === '/' ? `/${seg}` : `${base}/${seg}`;
          next.push(p);
          nextRel.push(rel[i] === '' ? `/${seg}` : rel[i] === '.' ? seg : `${rel[i]}/${seg}`);
        }
      });
      cands = next;
      rel = nextRel;
    }
    return rel.filter((_, i) => lookup(this.state.root, cands[i]) !== null);
  }

  // ---------- parsing ----------
  expandVars(s: string): string {
    const env = { ...this.session.env, PWD: this.session.cwd, '?': String(this.lastCode), UID: String(this.who().uid) };
    return s.replace(/\$\{(\w+)\}|\$(\w+|\?)/g, (_, a, b) => env[(a ?? b) as keyof typeof env] ?? '');
  }

  lex(line: string): Token[] {
    const toks: Token[] = [];
    let cur = '';
    let quoted = false;
    let has = false;
    let i = 0;
    const push = () => {
      if (has) toks.push({ v: cur, quoted });
      cur = '';
      quoted = false;
      has = false;
    };
    while (i < line.length) {
      const c = line[i];
      if (c === '\\' && i + 1 < line.length) {
        cur += line[i + 1];
        quoted = true;
        has = true;
        i += 2;
        continue;
      }
      if (c === "'") {
        const j = line.indexOf("'", i + 1);
        const end = j < 0 ? line.length : j;
        cur += line.slice(i + 1, end);
        quoted = true;
        has = true;
        i = end + 1;
        continue;
      }
      if (c === '"') {
        const j = line.indexOf('"', i + 1);
        const end = j < 0 ? line.length : j;
        cur += this.expandVars(line.slice(i + 1, end));
        quoted = true;
        has = true;
        i = end + 1;
        continue;
      }
      if (c === ' ' || c === '\t') {
        push();
        i++;
        continue;
      }
      const ops = ['&>>', '2>>', '&&', '||', '>>', '2>', '&>', '|', ';', '>', '<'];
      const op = ops.find((o) => line.startsWith(o, i));
      if (op && !(op === '2>' && has)) {
        push();
        toks.push({ v: op, quoted: false, op });
        i += op.length;
        continue;
      }
      if (c === '$') {
        const m = /^\$\{(\w+)\}|^\$(\w+|\?)/.exec(line.slice(i));
        if (m) {
          cur += this.expandVars(m[0]);
          has = true;
          i += m[0].length;
          continue;
        }
      }
      if (c === '~' && !has && (line[i + 1] === undefined || line[i + 1] === '/' || line[i + 1] === ' ')) {
        cur += this.session.env.HOME;
        has = true;
        i++;
        continue;
      }
      if (c === '#' && !has) break; // comment
      cur += c;
      has = true;
      i++;
    }
    push();
    return toks;
  }

  parse(line: string): Pipeline[] | string {
    const toks = this.lex(line);
    const out: Pipeline[] = [];
    let pipe: Pipeline = { cmds: [], sep: null };
    let cmd: SimpleCmd = { argv: [], redirs: [] };
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t.op === '|') {
        if (!cmd.argv.length) return "bash: erreur de syntaxe près du symbole inattendu « | »";
        pipe.cmds.push(cmd);
        cmd = { argv: [], redirs: [] };
      } else if (t.op === ';' || t.op === '&&' || t.op === '||') {
        if (cmd.argv.length) pipe.cmds.push(cmd);
        else if (t.op !== ';' || pipe.cmds.length) return `bash: erreur de syntaxe près du symbole inattendu « ${t.op} »`;
        if (pipe.cmds.length) out.push(pipe);
        pipe = { cmds: [], sep: t.op as Pipeline['sep'] };
        cmd = { argv: [], redirs: [] };
      } else if (t.op) {
        const target = toks[++i];
        if (!target || target.op) return 'bash: erreur de syntaxe près du symbole inattendu « newline »';
        cmd.redirs.push({ op: t.op, target: target.v });
      } else cmd.argv.push(t);
    }
    if (cmd.argv.length) pipe.cmds.push(cmd);
    if (pipe.cmds.length) out.push(pipe);
    return out;
  }

  expandGlobs(argv: Token[]): string[] {
    const out: string[] = [];
    for (const t of argv) {
      if (!t.quoted && /[*?]/.test(t.v) && !t.v.startsWith('-')) {
        const m = this.glob(t.v);
        if (m.length) out.push(...m);
        else out.push(t.v);
      } else out.push(t.v);
    }
    return out;
  }

  // ---------- execution ----------
  /** Expand history references (!!, !n, !-n, !prefix). */
  expandHistory(line: string): { line: string; changed: boolean; err?: string } {
    if (!line.includes('!')) return { line, changed: false };
    let changed = false;
    let err: string | undefined;
    const r = line.replace(/!(!|-?\d+|[a-zA-Z][\w-]*)/g, (m, ref) => {
      let h: string | undefined;
      if (ref === '!') h = this.history[this.history.length - 1];
      else if (/^-\d+$/.test(ref)) h = this.history[this.history.length + Number(ref)];
      else if (/^\d+$/.test(ref)) h = this.history[Number(ref) - 1];
      else h = [...this.history].reverse().find((x) => x.startsWith(ref));
      if (h === undefined) {
        err = `bash: ${m} : événement introuvable`;
        return m;
      }
      changed = true;
      return h;
    });
    return { line: r, changed, err };
  }

  /** Main entry point used by the UI and the tests. */
  input(raw: string): OutChunk[] {
    if (this.editor) return this.editorInput(raw);
    if (this.pending) {
      const ask = this.pending;
      this.pending = null;
      return this.render(ask.next(raw));
    }
    const line = raw.trim();
    if (!line) return [];
    const h = this.expandHistory(line);
    if (h.err) return [{ text: h.err + '\n', err: true }];
    const echo: OutChunk[] = h.changed ? [{ text: h.line + '\n' }] : [];
    this.history.push(h.line);
    return [...echo, ...this.render(this.runLine(h.line))];
  }

  /** Convenience for tests: run a line and return stdout+stderr as text. Answers to prompts can be passed. */
  run(line: string, ...answers: string[]): string {
    let out = this.input(line);
    for (const a of answers) {
      if (!this.pending && !this.editor) break;
      out = out.concat(this.input(a));
    }
    return out.map((c) => c.text).join('');
  }

  render(r: CmdRes): OutChunk[] {
    const out: OutChunk[] = [];
    if (r.clear) out.push({ text: '\u001bclear' });
    if (r.out) out.push({ text: r.out });
    if (r.err) out.push({ text: r.err, err: true });
    if (r.ask) {
      this.pending = r.ask;
      out.push({ text: r.ask.prompt });
    }
    this.lastCode = r.code;
    return out;
  }

  runLine(line: string): CmdRes {
    if (this.session.rd === 'ro' || this.session.rd === 'rw') return this.runRd(line);
    const parsed = this.parse(line);
    if (typeof parsed === 'string') return fail(parsed, 2);
    return this.runPipelines(parsed, 0, { out: '', err: '', code: 0 });
  }

  runPipelines(list: Pipeline[], idx: number, acc: CmdRes): CmdRes {
    for (let i = idx; i < list.length; i++) {
      const p = list[i];
      if (p.sep === '&&' && acc.code !== 0) continue;
      if (p.sep === '||' && acc.code === 0) continue;
      const r = this.runPipeline(p);
      acc = { out: acc.out + r.out, err: acc.err + r.err, code: r.code, clear: acc.clear || r.clear };
      this.lastCode = r.code;
      if (r.ask) {
        const rest = i + 1;
        const wrap = (ask: Ask): Ask => ({
          ...ask,
          next: (ans) => {
            const rr = ask.next(ans);
            if (rr.ask) return { ...rr, ask: wrap(rr.ask) };
            this.lastCode = rr.code;
            return this.runPipelines(list, rest, rr);
          }
        });
        return { ...acc, ask: wrap(r.ask) };
      }
    }
    return acc;
  }

  runPipeline(p: Pipeline): CmdRes {
    let stdin: string | null = null;
    let err = '';
    let last: CmdRes = ok();
    for (let i = 0; i < p.cmds.length; i++) {
      const c = p.cmds[i];
      let input = stdin;
      const lt = c.redirs.find((r) => r.op === '<');
      if (lt) {
        const f = this.readFile(lt.target);
        if (f.err) return fail(`bash: ${lt.target}: ${f.err}`);
        input = f.data!;
      }
      const res = this.exec(this.expandGlobs(c.argv), input, i < p.cmds.length - 1);
      if (res.ask) return { ...res, out: res.out, err: err + res.err };
      let out = res.out;
      let e = res.err;
      for (const r of c.redirs) {
        if (r.op === '<') continue;
        const target = r.target;
        const isDevNull = this.abs(target) === '/dev/null';
        if (r.op === '>' || r.op === '>>') {
          if (!isDevNull) {
            const w = this.writeFile(target, out, r.op === '>>');
            if (w) e += `bash: ${target}: ${w}\n`;
          }
          out = '';
        } else if (r.op === '2>' || r.op === '2>>') {
          if (!isDevNull) this.writeFile(target, e, r.op === '2>>');
          e = '';
        } else if (r.op === '&>' || r.op === '&>>') {
          if (!isDevNull) this.writeFile(target, out + e, r.op === '&>>');
          out = '';
          e = '';
        }
      }
      err += e;
      stdin = out;
      last = { ...res, out, err: '' };
    }
    return { out: last.out, err, code: last.code, clear: last.clear };
  }

  /** Resolve the path of an external command, or null. */
  which(name: string): string | null {
    if (name.includes('/')) {
      const n = this.node(name);
      return n && n.t === 'f' ? this.abs(name) : null;
    }
    for (const d of ['/usr/local/bin', '/usr/bin', '/usr/local/sbin', '/usr/sbin']) {
      const n = lookup(this.state.root, `${d}/${name}`);
      if (n && n.t === 'f') return `${d}/${name}`;
    }
    return null;
  }

  exec(argv: string[], stdin: string | null, _piped = false): CmdRes {
    if (!argv.length) return ok();
    // variable assignment VAR=value
    if (/^\w+=/.test(argv[0]) && argv.length === 1) {
      const [k, ...v] = argv[0].split('=');
      this.session.env[k] = v.join('=');
      return ok();
    }
    let name = argv[0];
    if (name === 'll') argv = ['ls', '-l', ...argv.slice(1)];
    name = argv[0];
    const base = name.includes('/') ? basename(name) : name;
    const impl = COMMANDS[base];
    if (!BUILTINS.has(base)) {
      const path = this.which(name);
      if (!path || !impl) {
        if (name.includes('/')) {
          const n = this.node(name);
          if (!n) return fail(`bash: ${name}: Aucun fichier ou dossier de ce type`, 127);
          if (!can(n, this.who(), 'x')) return fail(`bash: ${name}: Permission non accordée`, 126);
          return ok(); // custom script: no-op
        }
        return fail(`bash: ${name} : commande introuvable`, 127);
      }
    }
    if (!impl) return fail(`bash: ${name} : commande introuvable`, 127);
    try {
      return impl({ argv, args: argv.slice(1), stdin, sh: this });
    } catch (e) {
      return fail(`${base}: erreur interne du simulateur: ${(e as Error).message}`);
    }
  }

  // ---------- rd.break emergency shell ----------
  enterRdBreak() {
    this.sessions = [{ user: 'root', cwd: '/', login: true, env: { HOME: '/root', USER: 'root', PATH: '/usr/sbin:/usr/bin', LANG: 'fr_FR.UTF-8' }, rd: 'ro' }];
    this.flags.sysrootRw = false;
    this.flags.rdbreak = true;
  }

  runRd(line: string): CmdRes {
    const t = this.lex(line).map((x) => x.v);
    const s = this.session;
    const cmd = t[0];
    if (cmd === 'mount') {
      if (t.join(' ').replace(/\s+/g, ' ') === 'mount -o remount,rw /sysroot') {
        this.flags.sysrootRw = true;
        s.rd = 'rw';
        return ok();
      }
      if (t.length === 1) return ok(`/dev/mapper/rhel-root on /sysroot type xfs (${this.flags.sysrootRw ? 'rw' : 'ro'},relatime,seclabel)\n`);
      return fail('mount: usage dans ce TP : mount -o remount,rw /sysroot');
    }
    if (cmd === 'chroot') {
      if (t[1] !== '/sysroot') return fail(`chroot: impossible de changer de répertoire racine vers '${t[1] ?? ''}': Aucun fichier ou dossier de ce type`);
      s.rd = 'chroot';
      s.cwd = '/';
      return ok();
    }
    if (cmd === 'exit' || cmd === 'reboot') {
      // leaving switch_root: system continues booting / reboots
      if (lookup(this.state.root, '/.autorelabel')) {
        this.flags.relabeled = true;
        delete this.state.root.kids!['.autorelabel'];
      }
      this.flags.rdbreak = false;
      this.flags.sysrootRw = false;
      this.sessions = [];
      this.pushSession('root', true);
      return ok(
        `[  OK  ] Reached target Switch Root.\n${this.flags.relabeled ? '*** Warning -- SELinux targeted policy relabel is required.\n*** Relabeling could take a very long time...\n[  OK  ] Relabel terminé, redémarrage...\n' : ''}\nRed Hat Enterprise Linux 9.4 (Plow)\nKernel ${'5.14.0-427.13.1.el9_4.x86_64'} on an x86_64\n\nrhel9 login: root (connexion simulée)\n`
      );
    }
    if (cmd === 'ls') return ok(t[1] === '/sysroot' ? Object.keys(this.state.root.kids!).sort().join('  ') + '\n' : 'bin  dev  etc  lib  lib64  proc  run  sbin  sys  sysroot  tmp  usr  var\n');
    if (cmd === 'passwd') return fail("passwd: Vous êtes dans l'initramfs : faites d'abord « chroot /sysroot ».");
    if (cmd === 'touch') return fail("touch: ici on est encore dans l'initramfs ; faites d'abord « chroot /sysroot ».");
    return fail(`sh: ${cmd}: commande disponible plus tard (après chroot /sysroot)`, 127);
  }

  // ---------- mini editor (nano / vi / visudo / vipw / vigr) ----------
  openEditor(path: string, kind: Editor['kind']): CmdRes {
    const a = this.abs(path);
    const n = lookup(this.state.root, a);
    const content = n && n.t === 'f' ? n.data ?? '' : '';
    if (n && n.t === 'f' && !can(n, this.who(), 'r')) return fail(`${kind}: ${path}: Permission non accordée`);
    const lines = content.replace(/\n$/, '').split('\n');
    this.editor = { path: a, lines: content ? lines : [], dirty: false, kind, original: content, asRoot: this.isRoot };
    return ok(this.editorView() + EDITOR_HELP);
  }

  editorView(): string {
    const e = this.editor!;
    const head = `  ── ${e.kind} : ${e.path} ${e.dirty ? '(modifié)' : ''} ──\n`;
    return head + e.lines.map((l, i) => `${String(i + 1).padStart(3, ' ')}│ ${l}`).join('\n') + (e.lines.length ? '\n' : '');
  }

  editorInput(raw: string): OutChunk[] {
    const e = this.editor!;
    const line = raw.replace(/\r/g, '');
    const cmd = line.trim();
    const m = /^:(\w+!?)\s*(\d+)?\s?(.*)$/.exec(cmd);
    if (m) {
      const [, c, nStr, rest] = m;
      const n = nStr ? +nStr : undefined;
      if (c === 'q!' || (c === 'q' && !e.dirty)) {
        this.editor = null;
        return [{ text: e.kind === 'visudo' ? '' : '(fermé sans enregistrer)\n' }];
      }
      if (c === 'q') return [{ text: 'Modifications non enregistrées : :wq pour enregistrer, :q! pour abandonner.\n', err: true }];
      if (c === 'wq' || c === 'x' || c === 'w') {
        const content = e.lines.join('\n') + '\n';
        if (e.kind === 'visudo') {
          const bad = validateSudoers(content);
          if (bad) return [{ text: `visudo: >>> ${e.path} : erreur de syntaxe près de la ligne ${bad} <<<\nCorrigez la ligne (:r ${bad} texte) puis :wq, ou :q! pour abandonner.\n`, err: true }];
          this.writeRaw(e.path, content, 0o440);
          const node = lookup(this.state.root, e.path)!;
          node.mode = 0o440;
        } else if (e.kind === 'vipw' || e.kind === 'vigr') {
          this.writeRaw(e.path, content);
        } else if (e.asRoot) {
          if (this.readOnly(e.path)) return [{ text: `${e.kind}: impossible d'écrire ${e.path} : Système de fichiers accessible en lecture seulement\n`, err: true }];
          this.writeRaw(e.path, content);
        } else {
          const err = this.writeFile(e.path, content);
          if (err) return [{ text: `${e.kind}: impossible d'écrire ${e.path} : ${err}\n`, err: true }];
        }
        e.dirty = false;
        if (c === 'w') return [{ text: `« ${e.path} » ${e.lines.length}L écrit(es)\n` }];
        this.editor = null;
        return [{ text: `« ${e.path} » ${e.lines.length}L écrit(es)\n` }];
      }
      if (c === 'p') return [{ text: this.editorView() }];
      if (c === 'h') return [{ text: EDITOR_HELP }];
      if (c === 'd' && n) {
        e.lines.splice(n - 1, 1);
        e.dirty = true;
        return [{ text: this.editorView() }];
      }
      if (c === 'r' && n) {
        e.lines[n - 1] = rest;
        e.dirty = true;
        return [{ text: this.editorView() }];
      }
      if (c === 'i' && n) {
        e.lines.splice(n - 1, 0, rest);
        e.dirty = true;
        return [{ text: this.editorView() }];
      }
      return [{ text: `Commande d'éditeur inconnue : ${cmd} (tapez :h)\n`, err: true }];
    }
    e.lines.push(line);
    e.dirty = true;
    return [{ text: `${String(e.lines.length).padStart(3, ' ')}│ ${line}\n` }];
  }

  // ---------- tab completion ----------
  complete(line: string): { line: string; options: string[] } {
    const m = /^(.*?)(\S*)$/.exec(line)!;
    const before = m[1];
    const word = m[2];
    const isCmd = !before.trim() || /[|;&]\s*$/.test(before);
    let cands: string[];
    if (isCmd && !word.includes('/')) {
      const names = new Set<string>([...BUILTINS]);
      for (const d of ['/usr/bin', '/usr/sbin']) for (const k of Object.keys(lookup(this.state.root, d)?.kids ?? {})) if (COMMANDS[k]) names.add(k);
      cands = [...names].filter((n) => n.startsWith(word)).sort();
    } else {
      const slash = word.lastIndexOf('/');
      const dirPart = slash >= 0 ? word.slice(0, slash + 1) : '';
      const prefix = word.slice(slash + 1);
      const d = lookup(this.state.root, this.abs((dirPart || '.').replace(/^~/, this.session.env.HOME)));
      cands =
        d && d.t === 'd'
          ? Object.entries(d.kids!)
              .filter(([k]) => k.startsWith(prefix) && (prefix.startsWith('.') || !k.startsWith('.')))
              .map(([k, n]) => dirPart + k + (n.t === 'd' || (n.t === 'l' && lookup(this.state.root, this.abs(dirPart + k))?.t === 'd') ? '/' : ''))
              .sort()
          : [];
    }
    if (cands.length === 0) return { line, options: [] };
    if (cands.length === 1) return { line: before + cands[0] + (cands[0].endsWith('/') ? '' : ' '), options: [] };
    let common = cands[0];
    for (const c of cands) while (!c.startsWith(common)) common = common.slice(0, -1);
    return { line: before + common, options: cands };
  }

  /** Reset to the "Installation_propre" snapshot. */
  reset(startUser = 'etudiant') {
    const fresh = new Shell(startUser);
    Object.assign(this, { ...fresh, history: [] });
  }
}

export const EDITOR_HELP = `  [éditeur simplifié] tapez une ligne pour l'ajouter à la fin ·  :r N texte  remplacer la ligne N · :i N texte  insérer avant N · :d N  supprimer N · :p  afficher · :wq  enregistrer et quitter · :q!  quitter sans enregistrer\n`;

/** Returns the 1-based number of the first invalid line, or 0 if the sudoers file is valid. */
export function validateSudoers(content: string): number {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith('#') || l.startsWith('Defaults') || /^(User|Cmnd|Host|Runas)_Alias\s+\w+\s*=/.test(l) || /^@?include(dir)?\s/.test(l)) continue;
    if (!/^(%?[\w.-]+|ALL)(\s*,\s*%?[\w.-]+)*\s+[\w.,-]+\s*=\s*(\([^)]*\)\s*)?((NOPASSWD|PASSWD)\s*:\s*)?(ALL|\/\S+.*)(\s*,\s*(ALL|\/\S+.*))*$/.test(l)) return i + 1;
  }
  return 0;
}

export interface SudoRule {
  who: string;
  runas: string[];
  nopasswd: boolean;
  cmds: string[];
}

export function parseSudoers(content: string): SudoRule[] {
  const rules: SudoRule[] = [];
  for (const raw of content.split('\n')) {
    const l = raw.trim();
    if (!l || l.startsWith('#') || l.startsWith('Defaults') || /_Alias/.test(l)) continue;
    const m = /^(\S+)\s+\S+\s*=\s*(?:\(([^)]*)\))?\s*(NOPASSWD\s*:\s*)?(.+)$/.exec(l);
    if (!m) continue;
    for (const w of m[1].split(',')) {
      rules.push({
        who: w.trim(),
        runas: (m[2] ?? 'root').split(/[,:]/).map((x) => x.trim()).filter(Boolean),
        nopasswd: !!m[3],
        cmds: m[4].split(',').map((x) => x.trim())
      });
    }
  }
  return rules;
}

export { nl };
