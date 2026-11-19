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
 *
 * Env (Netlify → Site configuration → Environment variables):
 *   DATABASE_URL  mysql://avnadmin:PASSWORD@host:port/defaultdb
 *   DB_CA_CERT    Aiven "CA certificate" (PEM text, -----BEGIN CERTIFICATE----- …)
 *   JWT_SECRET    long random string (≥ 32 characters)
 *   DB_SSL        (local dev only) "off" to connect without TLS
 *   ORAL_EMAILS   (optional) comma-separated e-mails allowed to see the oral-presentation coach
 */
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
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

function db(): Pool {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new HttpError(500, 'server_not_configured');
  const u = new URL(url);
  const ca = process.env.DB_CA_CERT?.replace(/\\n/g, '\n');
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

async function issueCookie(userId: string, req: Request) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime(`${SESSION_DAYS}d`).sign(secret());
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

const clearCookie = `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

async function currentUserId(req: Request): Promise<string> {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(req.headers.get('cookie') ?? '');
  if (!m) throw new HttpError(401, 'not_authenticated');
  try {
    const { payload } = await jwtVerify(m[1], secret(), { algorithms: ['HS256'] });
    if (!payload.sub) throw new Error();
    return payload.sub;
  } catch {
    throw new HttpError(401, 'not_authenticated');
  }
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

type UserRow = RowDataPacket & { id: string; email: string; password_hash: string; display_name: string; groupe: string; created_at: Date };

/** Private features, decided on the server so the allowed e-mails never ship in the public JavaScript. */
const oralEmails = () => (process.env.ORAL_EMAILS ?? 'fayssal.abaibat@emsi-edu.ma').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
const publicUser = (u: UserRow) => ({
  id: u.id,
  email: u.email,
  displayName: u.display_name,
  groupe: u.groupe,
  createdAt: u.created_at,
  features: oralEmails().includes(u.email.toLowerCase()) ? ['oral'] : []
});

/** Hash compared against when the e-mail is unknown, so the response time does not reveal which e-mails exist. */
let dummyHash: string | null = null;
const dummy = () => (dummyHash ??= bcrypt.hashSync('not-a-real-password', 11));

async function findUser(where: 'id' | 'email', value: string) {
  const [rows] = await db().query<UserRow[]>(`SELECT id, email, password_hash, display_name, groupe, created_at FROM users WHERE ${where} = ? LIMIT 1`, [value]);
  return rows[0];
}

// ---------------------------------------------------------------- routes
async function route(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname.replace(/^\/(\.netlify\/functions\/api|api)/, '').replace(/\/$/, '') || '/';
  const method = req.method.toUpperCase();
  const ip = req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for') ?? 'ip';

  if (method === 'GET' && path === '/health') return json(200, { ok: true });
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
      await db().query('INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)', [id, email, hash, displayName]);
    } catch (e) {
      if ((e as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'email_taken');
      throw e;
    }
    const u = (await findUser('id', id))!;
    return json(201, { user: publicUser(u) }, { 'set-cookie': await issueCookie(id, req) });
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

  if (method === 'POST' && path === '/auth/logout') return json(200, { ok: true }, { 'set-cookie': clearCookie });

  // ----- everything below needs a session
  const userId = await currentUserId(req);

  if (method === 'GET' && path === '/auth/me') {
    const u = await findUser('id', userId);
    if (!u) return json(401, { error: 'not_authenticated' }, { 'set-cookie': clearCookie });
    return json(200, { user: publicUser(u) });
  }

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

export default async (req: Request): Promise<Response> => {
  try {
    return await route(req);
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { error: e.code });
    console.error('[api]', e);
    return json(500, { error: 'server_error' });
  }
};
