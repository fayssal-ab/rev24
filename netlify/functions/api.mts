/**
 * GROUP22 API — Netlify Function (Node) in front of a MySQL database (Aiven MySQL 8.4).
 *
 * Routes (all JSON, served under /api/*):
 *   POST /api/auth/signup     { email, password, displayName }   → creates the account + session cookie
 *   POST /api/auth/login      { email, password }                → session cookie
 *   POST /api/auth/logout                                        → clears the cookie
 *   GET  /api/auth/me                                            → { user } | 401
 *   PUT  /api/profile         { displayName?, groupe? }
 *   POST /api/auth/password   { current, next }                  → change password
 *   GET  /api/progress                                           → { data, updatedAt } | { data: null }
 *   PUT  /api/progress        { data, updatedAt }
 *   GET  /api/supports                                           → documents added / edited by the admin
 *   GET  /api/announcements                                      → admin announcements
 *   /api/admin/*                                                 → CRUD users, supports, announcements (admin only)
 *
 * Access rules:
 *   - a new account starts "pending": it can sign in but sees only the waiting page until the admin approves it
 *   - an account can be open on several devices at once; session_id (in the JWT) is shared by them and is reset only
 *     when the admin closes the sessions, changes the password or blocks the account
 *   - the principal admin (PRINCIPAL_ADMIN) cannot be edited, signed out or deleted by any other admin
 *
 * Env (Netlify → Site configuration → Environment variables):
 *   DATABASE_URL  mysql://avnadmin:PASSWORD@host:port/defaultdb
 *   DB_CA_CERT    Aiven "CA certificate" (PEM text, -----BEGIN CERTIFICATE----- …)
 *   JWT_SECRET    long random string (≥ 32 characters)
 *   DB_SSL        (local dev only) "off" to connect without TLS
 *   ORAL_EMAILS   (optional) comma-separated e-mails allowed to see the oral-presentation coach
 *   ADMIN_EMAILS  (optional) comma-separated admin e-mails (default: fayssal.abaibat@emsi-edu.ma)
 */
import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'node:crypto';

export const config = { path: '/api/*' };

const COOKIE = 'g22_session';
const SESSION_DAYS = 30;
const MAX_PROGRESS_BYTES = 2_000_000;

// ---------------------------------------------------------------- database
let pool: Pool | null = null;
let migrated: Promise<void> | null = null;

/**
 * Rebuilds a valid PEM from however the certificate was pasted in the Netlify UI
 * (newlines turned into spaces, literal "\n", one long line, several certificates…).
 */
export function normalizePem(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const blocks = [...raw.replace(/\\n/g, '\n').matchAll(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/g)];
  if (!blocks.length) return undefined;
  return blocks
    .map((m) => {
      const b64 = m[1].replace(/[^A-Za-z0-9+/=]/g, '');
      return `-----BEGIN CERTIFICATE-----\n${b64.match(/.{1,64}/g)!.join('\n')}\n-----END CERTIFICATE-----`;
    })
    .join('\n');
}

function db(): Pool {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new HttpError(500, 'server_not_configured');
  const u = new URL(url);
  const ca = normalizePem(process.env.DB_CA_CERT);
  pool = mysql.createPool({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, '') || 'defaultdb',
    // Aiven requires TLS; with the CA the server certificate is fully verified
    // DB_SSL=off only for a local development database; production (Aiven) always uses verified TLS
    ssl: process.env.DB_SSL === 'off' ? undefined : ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true },
    connectionLimit: 3,
    waitForConnections: true,
    timezone: 'Z'
  });
  return pool;
}

/** Creates the tables on the first call (idempotent). The same SQL is in database/schema.sql. */
function migrate(): Promise<void> {
  migrated ??= (async () => {
    const p = db();
    await p.query(`CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) NOT NULL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(100) NOT NULL,
      display_name VARCHAR(120) NOT NULL DEFAULT '',
      groupe VARCHAR(40) NOT NULL DEFAULT '4IIR G22',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE KEY uq_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await p.query(`CREATE TABLE IF NOT EXISTS progress (
      user_id CHAR(36) NOT NULL PRIMARY KEY,
      data JSON NOT NULL,
      updated_at DATETIME(3) NOT NULL,
      CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    // columns added after the first version: role, approval status, single active session
    const [cols] = await p.query<RowDataPacket[]>(`SELECT COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'`);
    const have = new Set(cols.map((r) => String(r.c).toLowerCase()));
    if (!have.has('role')) await p.query(`ALTER TABLE users ADD COLUMN role VARCHAR(10) NOT NULL DEFAULT 'user'`);
    if (!have.has('status')) {
      await p.query(`ALTER TABLE users ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'pending'`);
      // accounts that existed before the approval system are already group members
      await p.query(`UPDATE users SET status = 'approved'`);
    }
    if (!have.has('session_id')) await p.query(`ALTER TABLE users ADD COLUMN session_id CHAR(36) NULL`);
    if (!have.has('last_seen')) await p.query(`ALTER TABLE users ADD COLUMN last_seen DATETIME(3) NULL`);
    await p.query(`CREATE TABLE IF NOT EXISTS supports (
      id CHAR(36) NOT NULL PRIMARY KEY,
      ref VARCHAR(255) NULL,
      subject VARCHAR(40) NOT NULL,
      kind VARCHAR(20) NOT NULL DEFAULT 'cours',
      title VARCHAR(255) NOT NULL DEFAULT '',
      url VARCHAR(1000) NOT NULL DEFAULT '',
      sort INT NOT NULL DEFAULT 500,
      hidden TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      UNIQUE KEY uq_supports_ref (ref)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await p.query(`CREATE TABLE IF NOT EXISTS announcements (
      id CHAR(36) NOT NULL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      body TEXT NOT NULL,
      pinned TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    for (const e of adminEmails()) await p.query(`UPDATE users SET role = 'admin', status = 'approved' WHERE email = ?`, [e]);
  })().catch((e) => {
    migrated = null;
    throw e;
  });
  return migrated;
}

// ---------------------------------------------------------------- helpers
class HttpError extends Error {
  constructor(
    public status: number,
    public code: string
  ) {
    super(code);
  }
}

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new HttpError(500, 'server_not_configured');
  return new TextEncoder().encode(s);
}

/** Session cookie. Several devices may be signed in at once: they share the account's session_id (created on first sign-in). */
async function issueCookie(userId: string, req: Request) {
  const [rows] = await db().query<UserRow[]>('SELECT session_id FROM users WHERE id = ? LIMIT 1', [userId]);
  const sid = rows[0]?.session_id ?? randomUUID();
  await db().query('UPDATE users SET session_id = ?, last_seen = CURRENT_TIMESTAMP(3) WHERE id = ?', [sid, userId]);
  const token = await new SignJWT({ sid }).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime(`${SESSION_DAYS}d`).sign(secret());
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

const clearCookie = `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

/** The signed-in user; 401 "session_replaced" when the admin closed the account's sessions (or changed its password) since. */
async function currentUser(req: Request): Promise<UserRow> {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(req.headers.get('cookie') ?? '');
  if (!m) throw new HttpError(401, 'not_authenticated');
  let sub: string, sid: unknown;
  try {
    const { payload } = await jwtVerify(m[1], secret(), { algorithms: ['HS256'] });
    if (!payload.sub) throw new Error();
    sub = payload.sub;
    sid = payload.sid;
  } catch {
    throw new HttpError(401, 'not_authenticated');
  }
  const u = await findUser('id', sub);
  if (!u) throw new HttpError(401, 'not_authenticated');
  if (!u.session_id || u.session_id !== sid) throw new HttpError(401, 'session_replaced');
  // last activity, at most once a minute
  if (!u.last_seen || Date.now() - new Date(u.last_seen).getTime() > 60_000) await db().query('UPDATE users SET last_seen = CURRENT_TIMESTAMP(3) WHERE id = ?', [u.id]);
  return u;
}

async function body(req: Request): Promise<Record<string, unknown>> {
  try {
    const b = await req.json();
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {};
  } catch {
    throw new HttpError(400, 'bad_json');
  }
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Very small in-memory throttle per IP+email (per warm function instance) against password guessing. */
const attempts = new Map<string, { n: number; until: number }>();
function throttle(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (a && a.until > now && a.n >= 8) throw new HttpError(429, 'too_many_attempts');
  attempts.set(key, a && a.until > now ? { n: a.n + 1, until: a.until } : { n: 1, until: now + 10 * 60_000 });
}

type UserRow = RowDataPacket & {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  groupe: string;
  role: string;
  status: string;
  session_id: string | null;
  last_seen: Date | null;
  created_at: Date;
};
type Role = 'admin' | 'user';
type Status = 'pending' | 'approved' | 'blocked';
const ROLES: Role[] = ['admin', 'user'];
const STATUSES: Status[] = ['pending', 'approved', 'blocked'];

/** Principal admin: always admin, and no other admin can edit, sign out or delete this account. */
const PRINCIPAL_ADMIN = 'fayssal.abaibat@emsi-edu.ma';
const DEFAULT_ADMIN = PRINCIPAL_ADMIN;
const isPrincipal = (u: { email: string }) => u.email.toLowerCase() === PRINCIPAL_ADMIN;
const emailList = (raw: string | undefined, fallback: string) => {
  const list = (raw ?? '')
    .replace(/["']/g, '')
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes('@'));
  return list.length ? list : [fallback];
};
const adminEmails = () => [...new Set([PRINCIPAL_ADMIN, ...emailList(process.env.ADMIN_EMAILS, DEFAULT_ADMIN)])];
const isAdmin = (u: UserRow) => u.role === 'admin' || adminEmails().includes(u.email.toLowerCase());

/** Private features, decided on the server so the allowed e-mails never ship in the public JavaScript. */
const DEFAULT_ORAL = 'fayssal.abaibat@emsi-edu.ma';
/** Tolerant parsing: quotes, commas / semicolons / spaces as separators; empty → default. */
const oralEmails = () => emailList(process.env.ORAL_EMAILS, DEFAULT_ORAL);
const publicUser = (u: UserRow) => {
  const admin = isAdmin(u);
  return {
    id: u.id,
    email: u.email,
    displayName: u.display_name,
    groupe: u.groupe,
    createdAt: u.created_at,
    role: admin ? 'admin' : 'user',
    status: admin ? 'approved' : u.status,
    features: admin || oralEmails().includes(u.email.toLowerCase()) ? ['oral'] : []
  };
};
/** Admin listing: same as publicUser + activity. */
const adminUser = (u: UserRow) => ({ ...publicUser(u), online: !!u.session_id && !!u.last_seen && Date.now() - new Date(u.last_seen).getTime() < 5 * 60_000, lastSeen: u.last_seen });

/** Hash compared against when the e-mail is unknown, so the response time does not reveal which e-mails exist. */
let dummyHash: string | null = null;
const dummy = () => (dummyHash ??= bcrypt.hashSync('not-a-real-password', 11));

async function findUser(where: 'id' | 'email', value: string) {
  const [rows] = await db().query<UserRow[]>(`SELECT id, email, password_hash, display_name, groupe, role, status, session_id, last_seen, created_at FROM users WHERE ${where} = ? LIMIT 1`, [value]);
  return rows[0];
}

// ---------------------------------------------------------------- routes
async function route(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname.replace(/^\/(\.netlify\/functions\/api|api)/, '').replace(/\/$/, '') || '/';
  const method = req.method.toUpperCase();
  const ip = req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for') ?? 'ip';

  if (method === 'GET' && path === '/health') return json(200, { ok: true });
  // Diagnostics without secrets: which variables are set, and the database error code if the connection fails.
  if (method === 'GET' && path === '/health/db') {
    const env = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DB_CA_CERT: !!process.env.DB_CA_CERT && /BEGIN CERTIFICATE/.test(process.env.DB_CA_CERT),
      DB_CA_CERT_blocks: (process.env.DB_CA_CERT?.match(/BEGIN CERTIFICATE/g) ?? []).length,
      DB_CA_CERT_newlines: (process.env.DB_CA_CERT?.match(/\n/g) ?? []).length,
      JWT_SECRET: (process.env.JWT_SECRET?.length ?? 0) >= 32,
      ORAL_EMAILS_count: oralEmails().length,
      ORAL_EMAILS_set: process.env.ORAL_EMAILS !== undefined
    };
    try {
      await migrate();
      return json(200, { ok: true, env });
    } catch (e) {
      const err = e as { code?: string; errno?: number; message?: string };
      // keep only the error code / a short message, never the URL or credentials
      return json(500, { ok: false, env, code: err.code ?? null, errno: err.errno ?? null, message: (err.message ?? '').replace(/\/\/[^@]*@/g, '//***@').slice(0, 160) });
    }
  }
  await migrate();

  if (method === 'POST' && path === '/auth/signup') {
    const b = await body(req);
    const email = str(b.email, 255).toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    const displayName = str(b.displayName, 120) || email.split('@')[0];
    if (!EMAIL.test(email)) throw new HttpError(400, 'invalid_email');
    if (password.length < 8 || password.length > 200) throw new HttpError(400, 'weak_password');
    throttle(`signup:${ip}`);
    if (await findUser('email', email)) throw new HttpError(409, 'email_taken');
    const id = randomUUID();
    const hash = await bcrypt.hash(password, 11);
    try {
      const adm = adminEmails().includes(email);
      await db().query('INSERT INTO users (id, email, password_hash, display_name, role, status) VALUES (?, ?, ?, ?, ?, ?)', [id, email, hash, displayName, adm ? 'admin' : 'user', adm ? 'approved' : 'pending']);
    } catch (e) {
      if ((e as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'email_taken');
      throw e;
    }
    const cookie = await issueCookie(id, req);
    return json(201, { user: publicUser((await findUser('id', id))!) }, { 'set-cookie': cookie });
  }

  if (method === 'POST' && path === '/auth/login') {
    const b = await body(req);
    const email = str(b.email, 255).toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    throttle(`login:${ip}:${email}`);
    const u = await findUser('email', email);
    // compare even when the user does not exist, so timing does not reveal registered e-mails
    const ok = await bcrypt.compare(password, u?.password_hash ?? dummy());
    if (!u || !ok) throw new HttpError(401, 'invalid_credentials');
    attempts.delete(`login:${ip}:${email}`);
    return json(200, { user: publicUser(u) }, { 'set-cookie': await issueCookie(u.id, req) });
  }

  if (method === 'POST' && path === '/auth/logout') {
    // only this device signs out: the account's other devices stay signed in
    return json(200, { ok: true }, { 'set-cookie': clearCookie });
  }

  // ----- everything below needs a session
  let me: UserRow;
  try {
    me = await currentUser(req);
  } catch (e) {
    if (e instanceof HttpError && e.status === 401) return json(401, { error: e.code }, { 'set-cookie': clearCookie });
    throw e;
  }
  const userId = me.id;

  if (method === 'GET' && path === '/auth/me') return json(200, { user: publicUser(me) });

  if (method === 'PUT' && path === '/profile') {
    const b = await body(req);
    const displayName = str(b.displayName, 120);
    const groupe = str(b.groupe, 40);
    await db().query('UPDATE users SET display_name = COALESCE(NULLIF(?, \'\'), display_name), groupe = COALESCE(NULLIF(?, \'\'), groupe) WHERE id = ?', [displayName, groupe, userId]);
    return json(200, { user: publicUser((await findUser('id', userId))!) });
  }

  if (method === 'POST' && path === '/auth/password') {
    const b = await body(req);
    const current = typeof b.current === 'string' ? b.current : '';
    const next = typeof b.next === 'string' ? b.next : '';
    if (next.length < 8 || next.length > 200) throw new HttpError(400, 'weak_password');
    throttle(`password:${userId}`);
    const u = await findUser('id', userId);
    if (!u || !(await bcrypt.compare(current, u.password_hash))) throw new HttpError(401, 'invalid_credentials');
    await db().query('UPDATE users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(next, 11), userId]);
    return json(200, { ok: true });
  }

  // ----- everything below needs an approved account
  if (publicUser(me).status !== 'approved') throw new HttpError(403, me.status === 'blocked' ? 'blocked' : 'pending');

  if (method === 'GET' && path === '/supports') {
    const [rows] = await db().query<RowDataPacket[]>('SELECT id, ref, subject, kind, title, url, sort, hidden, created_at FROM supports ORDER BY subject, sort, title');
    return json(200, { supports: rows.map(supportOut) });
  }

  if (method === 'GET' && path === '/announcements') {
    const [rows] = await db().query<RowDataPacket[]>('SELECT id, title, body, pinned, created_at FROM announcements ORDER BY pinned DESC, created_at DESC LIMIT 50');
    return json(200, { announcements: rows.map(annOut) });
  }

  if (path.startsWith('/admin/')) return admin(req, method, path.slice('/admin'.length), me);

  if (method === 'GET' && path === '/progress') {
    const [rows] = await db().query<(RowDataPacket & { data: unknown; updated_at: Date })[]>('SELECT data, updated_at FROM progress WHERE user_id = ?', [userId]);
    const r = rows[0];
    return json(200, r ? { data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data, updatedAt: r.updated_at.toISOString() } : { data: null, updatedAt: null });
  }

  if (method === 'PUT' && path === '/progress') {
    const raw = await req.text();
    if (raw.length > MAX_PROGRESS_BYTES) throw new HttpError(413, 'too_large');
    let b: { data?: unknown; updatedAt?: string };
    try {
      b = JSON.parse(raw);
    } catch {
      throw new HttpError(400, 'bad_json');
    }
    if (!b.data || typeof b.data !== 'object') throw new HttpError(400, 'bad_data');
    const at = b.updatedAt && !Number.isNaN(Date.parse(b.updatedAt)) ? new Date(b.updatedAt) : new Date();
    await db().query('INSERT INTO progress (user_id, data, updated_at) VALUES (?, CAST(? AS JSON), ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)', [userId, JSON.stringify(b.data), at]);
    return json(200, { ok: true, updatedAt: at.toISOString() });
  }

  throw new HttpError(404, 'not_found');
}

// ---------------------------------------------------------------- admin (CRUD)
const supportOut = (r: RowDataPacket) => ({
  id: r.id as string,
  ref: (r.ref as string | null) ?? null,
  subject: r.subject as string,
  kind: r.kind as string,
  title: r.title as string,
  url: r.url as string,
  sort: Number(r.sort),
  hidden: !!r.hidden,
  createdAt: r.created_at as Date
});
const annOut = (r: RowDataPacket) => ({ id: r.id as string, title: r.title as string, body: r.body as string, pinned: !!r.pinned, createdAt: r.created_at as Date });

const KINDS = ['cours', 'td', 'tp', 'controle', 'annexe', 'resume'];
const SUBJECT = /^[a-z0-9-]{1,40}$/;

function supportFields(b: Record<string, unknown>) {
  const subject = str(b.subject, 40).toLowerCase();
  const kind = str(b.kind, 20).toLowerCase() || 'cours';
  const title = str(b.title, 255);
  const url = str(b.url, 1000);
  const ref = b.ref == null ? null : str(b.ref, 255) || null;
  const sort = Number.isFinite(Number(b.sort)) ? Math.round(Number(b.sort)) : 500;
  const hidden = b.hidden ? 1 : 0;
  if (!SUBJECT.test(subject)) throw new HttpError(400, 'invalid_subject');
  if (!KINDS.includes(kind)) throw new HttpError(400, 'invalid_kind');
  // a new document needs a title and a link; an override of a built-in file (ref) may leave them empty
  if (!ref && (!title || !url)) throw new HttpError(400, 'missing_fields');
  if (url && !/^(https?:\/\/|\/)/i.test(url)) throw new HttpError(400, 'invalid_url');
  return { ref, subject, kind, title, url, sort, hidden };
}

async function admin(req: Request, method: string, path: string, me: UserRow): Promise<Response> {
  if (!isAdmin(me)) throw new HttpError(403, 'forbidden');
  const p = db();
  const idOf = (prefix: string) => {
    const m = new RegExp(`^/${prefix}/([0-9a-f-]{36})(/[a-z]+)?$`).exec(path);
    return m ? { id: m[1], action: m[2] ?? '' } : null;
  };

  // ----- users
  if (method === 'GET' && path === '/users') {
    const [rows] = await p.query<UserRow[]>('SELECT id, email, password_hash, display_name, groupe, role, status, session_id, last_seen, created_at FROM users ORDER BY (status = \'pending\') DESC, created_at DESC');
    return json(200, { users: rows.map(adminUser) });
  }
  if (method === 'POST' && path === '/users') {
    const b = await body(req);
    const email = str(b.email, 255).toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    if (!EMAIL.test(email)) throw new HttpError(400, 'invalid_email');
    if (password.length < 8 || password.length > 200) throw new HttpError(400, 'weak_password');
    const role = ROLES.includes(b.role as Role) ? (b.role as Role) : 'user';
    const status = STATUSES.includes(b.status as Status) ? (b.status as Status) : 'approved';
    const id = randomUUID();
    try {
      await p.query('INSERT INTO users (id, email, password_hash, display_name, groupe, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        id,
        email,
        await bcrypt.hash(password, 11),
        str(b.displayName, 120) || email.split('@')[0],
        str(b.groupe, 40) || '4IIR G22',
        role,
        status
      ]);
    } catch (e) {
      if ((e as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'email_taken');
      throw e;
    }
    return json(201, { user: adminUser((await findUser('id', id))!) });
  }
  const u = idOf('users');
  if (u) {
    const target = await findUser('id', u.id);
    if (!target) throw new HttpError(404, 'not_found');
    const self = target.id === me.id;
    if (isPrincipal(target) && !self) throw new HttpError(403, 'protected_admin');
    if (method === 'PUT' && !u.action) {
      const b = await body(req);
      const role = ROLES.includes(b.role as Role) ? (b.role as Role) : target.role;
      const status = STATUSES.includes(b.status as Status) ? (b.status as Status) : target.status;
      if (self && (role !== 'admin' || status !== 'approved')) throw new HttpError(400, 'cannot_demote_self');
      const email = b.email === undefined ? target.email : str(b.email, 255).toLowerCase();
      if (!EMAIL.test(email)) throw new HttpError(400, 'invalid_email');
      const password = typeof b.password === 'string' && b.password ? b.password : null;
      if (password && (password.length < 8 || password.length > 200)) throw new HttpError(400, 'weak_password');
      try {
        await p.query('UPDATE users SET email = ?, display_name = ?, groupe = ?, role = ?, status = ? WHERE id = ?', [
          email,
          b.displayName === undefined ? target.display_name : str(b.displayName, 120) || target.display_name,
          b.groupe === undefined ? target.groupe : str(b.groupe, 40) || target.groupe,
          role,
          status,
          target.id
        ]);
      } catch (e) {
        if ((e as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'email_taken');
        throw e;
      }
      // new password or blocked account → close its session
      if (password) await p.query('UPDATE users SET password_hash = ?, session_id = NULL WHERE id = ?', [await bcrypt.hash(password, 11), target.id]);
      if (status === 'blocked') await p.query('UPDATE users SET session_id = NULL WHERE id = ?', [target.id]);
      return json(200, { user: adminUser((await findUser('id', target.id))!) });
    }
    if (method === 'POST' && u.action === '/logout') {
      if (self) throw new HttpError(400, 'cannot_logout_self');
      await p.query('UPDATE users SET session_id = NULL WHERE id = ?', [target.id]);
      return json(200, { ok: true });
    }
    if (method === 'DELETE' && !u.action) {
      if (self) throw new HttpError(400, 'cannot_delete_self');
      await p.query('DELETE FROM users WHERE id = ?', [target.id]);
      return json(200, { ok: true });
    }
  }

  // ----- supports (new documents, or overrides of the built-in files through `ref`)
  if (method === 'POST' && path === '/supports') {
    const f = supportFields(await body(req));
    const id = randomUUID();
    try {
      await p.query('INSERT INTO supports (id, ref, subject, kind, title, url, sort, hidden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, f.ref, f.subject, f.kind, f.title, f.url, f.sort, f.hidden]);
    } catch (e) {
      if ((e as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'exists');
      throw e;
    }
    const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM supports WHERE id = ?', [id]);
    return json(201, { support: supportOut(rows[0]) });
  }
  const s = idOf('supports');
  if (s && method === 'PUT') {
    const f = supportFields(await body(req));
    const [r] = await p.query<ResultSetHeader>('UPDATE supports SET subject = ?, kind = ?, title = ?, url = ?, sort = ?, hidden = ? WHERE id = ?', [f.subject, f.kind, f.title, f.url, f.sort, f.hidden, s.id]);
    if (!r.affectedRows) throw new HttpError(404, 'not_found');
    const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM supports WHERE id = ?', [s.id]);
    return json(200, { support: supportOut(rows[0]) });
  }
  if (s && method === 'DELETE') {
    await p.query('DELETE FROM supports WHERE id = ?', [s.id]);
    return json(200, { ok: true });
  }

  // ----- announcements
  const annFields = (b: Record<string, unknown>) => {
    const title = str(b.title, 200);
    const text = typeof b.body === 'string' ? b.body.trim().slice(0, 5000) : '';
    if (!title) throw new HttpError(400, 'missing_fields');
    return { title, text, pinned: b.pinned ? 1 : 0 };
  };
  if (method === 'POST' && path === '/announcements') {
    const f = annFields(await body(req));
    const id = randomUUID();
    await p.query('INSERT INTO announcements (id, title, body, pinned) VALUES (?, ?, ?, ?)', [id, f.title, f.text, f.pinned]);
    const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM announcements WHERE id = ?', [id]);
    return json(201, { announcement: annOut(rows[0]) });
  }
  const a = idOf('announcements');
  if (a && method === 'PUT') {
    const f = annFields(await body(req));
    const [r] = await p.query<ResultSetHeader>('UPDATE announcements SET title = ?, body = ?, pinned = ? WHERE id = ?', [f.title, f.text, f.pinned, a.id]);
    if (!r.affectedRows) throw new HttpError(404, 'not_found');
    const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM announcements WHERE id = ?', [a.id]);
    return json(200, { announcement: annOut(rows[0]) });
  }
  if (a && method === 'DELETE') {
    await p.query('DELETE FROM announcements WHERE id = ?', [a.id]);
    return json(200, { ok: true });
  }

  throw new HttpError(404, 'not_found');
}

export default async (req: Request): Promise<Response> => {
  try {
    return await route(req);
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { error: e.code });
    console.error('[api]', e);
    return json(500, { error: 'server_error' });
  }
};
