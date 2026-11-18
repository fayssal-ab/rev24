/** Parse / serialise /etc/passwd, /etc/shadow, /etc/group, /etc/gshadow. The files themselves are the source of truth. */

export interface PwEnt {
  name: string;
  pw: string;
  uid: number;
  gid: number;
  gecos: string;
  home: string;
  shell: string;
}
export interface SpEnt {
  name: string;
  hash: string;
  last: string;
  min: string;
  max: string;
  warn: string;
  inactive: string;
  expire: string;
  reserved: string;
}
export interface GrEnt {
  name: string;
  pw: string;
  gid: number;
  members: string[];
}
export interface GsEnt {
  name: string;
  pw: string;
  admins: string[];
  members: string[];
}

const lines = (s: string) => s.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
const list = (s: string | undefined) => (s ? s.split(',').filter(Boolean) : []);

export function parsePasswd(s: string): PwEnt[] {
  return lines(s).map((l) => {
    const f = l.split(':');
    return { name: f[0], pw: f[1], uid: +f[2], gid: +f[3], gecos: f[4] ?? '', home: f[5] ?? '', shell: f[6] ?? '' };
  });
}
export function fmtPasswd(e: PwEnt[]): string {
  return e.map((x) => [x.name, x.pw, x.uid, x.gid, x.gecos, x.home, x.shell].join(':')).join('\n') + '\n';
}
export function parseShadow(s: string): SpEnt[] {
  return lines(s).map((l) => {
    const f = l.split(':');
    return { name: f[0], hash: f[1] ?? '', last: f[2] ?? '', min: f[3] ?? '', max: f[4] ?? '', warn: f[5] ?? '', inactive: f[6] ?? '', expire: f[7] ?? '', reserved: f[8] ?? '' };
  });
}
export function fmtShadow(e: SpEnt[]): string {
  return e.map((x) => [x.name, x.hash, x.last, x.min, x.max, x.warn, x.inactive, x.expire, x.reserved].join(':')).join('\n') + '\n';
}
export function parseGroup(s: string): GrEnt[] {
  return lines(s).map((l) => {
    const f = l.split(':');
    return { name: f[0], pw: f[1], gid: +f[2], members: list(f[3]) };
  });
}
export function fmtGroup(e: GrEnt[]): string {
  return e.map((x) => [x.name, x.pw, x.gid, x.members.join(',')].join(':')).join('\n') + '\n';
}
export function parseGshadow(s: string): GsEnt[] {
  return lines(s).map((l) => {
    const f = l.split(':');
    return { name: f[0], pw: f[1], admins: list(f[2]), members: list(f[3]) };
  });
}
export function fmtGshadow(e: GsEnt[]): string {
  return e.map((x) => [x.name, x.pw, x.admins.join(','), x.members.join(',')].join(':')).join('\n') + '\n';
}

/** Deterministic fake SHA-512 crypt string ($6$salt$hash). Not secure — it's a simulator. */
export function fakeCrypt(password: string, salt?: string): string {
  const s = salt ?? 'rev24' + (password.length * 7919).toString(36).slice(0, 4);
  let h1 = 0x811c9dc5;
  let h2 = 0x1234567;
  const src = s + ':' + password;
  for (let i = 0; i < src.length; i++) {
    h1 = Math.imul(h1 ^ src.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 + src.charCodeAt(i), 2654435761) >>> 0;
  }
  const abc = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let out = '';
  let a = h1;
  let b = h2;
  for (let i = 0; i < 86; i++) {
    a = Math.imul(a ^ (a >>> 15), 0x2c1b3c6d) >>> 0;
    b = Math.imul(b ^ (b >>> 13), 0x297a2d39) >>> 0;
    out += abc[(a ^ b) % 64];
  }
  return `$6$${s}$${out}`;
}

export function verifyPassword(hash: string, password: string): boolean {
  if (!hash.startsWith('$6$')) return false;
  const salt = hash.split('$')[2];
  return fakeCrypt(password, salt) === hash;
}

export const daysSinceEpoch = (ts = Date.now()) => Math.floor(ts / 86400000);

/** Parse YYYY-MM-DD (or days number) into days since epoch. */
export function parseDate(s: string): number | null {
  if (/^-?\d+$/.test(s)) return +s;
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (!m) return null;
  return Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000);
}

const MON = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export function fmtChageDate(days: number): string {
  const d = new Date(days * 86400000);
  return `${MON[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}, ${d.getUTCFullYear()}`;
}
export function isoDate(days: number): string {
  return new Date(days * 86400000).toISOString().slice(0, 10);
}

/** Parse KEY VALUE (login.defs) or KEY=VALUE (default/useradd) config files. */
export function parseConf(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of lines(s)) {
    const m = /^\s*([A-Z_]+)\s*(?:=|\s)\s*(.*?)\s*$/.exec(l);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

export function setConf(s: string, key: string, value: string, sep: '=' | ' '): string {
  const re = new RegExp(`^${key}\\s*${sep === '=' ? '=' : '\\s'}.*$`, 'm');
  const line = sep === '=' ? `${key}=${value}` : `${key}\t\t${value}`;
  if (re.test(s)) return s.replace(re, line);
  return s.replace(/\n?$/, '\n') + line + '\n';
}
