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
 *   GET  /api/chat?after=<id>                                    → last 20 chat messages (older ones are deleted)
 *   POST /api/chat            { body, poll?: { options } }       → post a message or a poll (1 every 1.5 s); @[Name](id) = mention
 *   DELETE /api/chat/:id                                         → delete my message (admins: any message)
 *   POST /api/chat/:id/vote   { choice }                         → vote in a poll (same choice again = remove)
 *   GET  /api/members                                            → approved members, for @mentions
 *   GET  /api/users/:id/avatar                                   → profile picture
 *   GET  /api/users/:id/profile                                  → a member's public profile + study summary
 *   GET  /api/events                                             → upcoming tests, exams and lab reports (past ones are deleted)
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
 *   ADMIN_EMAILS  (optional) comma-separated admin e-mails (default: fayssal.abaibat@emsi-edu.ma)
 */
import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { createHash, randomUUID } from 'node:crypto';
import webpush from 'web-push';

/** Netlify edge rate limit (DDoS / floods): at most 300 API requests per minute per IP, before the function runs. */
export const config = { path: '/api/*', rateLimit: { windowLimit: 300, windowSize: 60, aggregateBy: ['ip', 'domain'] } };

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
    if (!have.has('online_since')) await p.query(`ALTER TABLE users ADD COLUMN online_since DATETIME(3) NULL`);
    // device of the last activity ("mobile|Android|Chrome"), shown to the admin
    if (!have.has('last_device')) await p.query(`ALTER TABLE users ADD COLUMN last_device VARCHAR(80) NULL`);
    // profile picture: small JPEG/PNG/WebP data URL (resized in the browser), served by GET /api/users/:id/avatar
    if (!have.has('avatar')) await p.query(`ALTER TABLE users ADD COLUMN avatar MEDIUMTEXT NULL`);
    if (!have.has('avatar_at')) await p.query(`ALTER TABLE users ADD COLUMN avatar_at DATETIME(3) NULL`);
    // private profile: other members only see the name, picture and presence (admins still see everything)
    if (!have.has('profile_private')) await p.query(`ALTER TABLE users ADD COLUMN profile_private TINYINT(1) NOT NULL DEFAULT 0`);
    // group chat: only the last CHAT_KEEP messages are kept
    await p.query(`CREATE TABLE IF NOT EXISTS chat_messages (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      body VARCHAR(500) NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    // mentions are stored as @[Name](id) tokens (longer than the visible text) and a message can carry a poll
    const [chatCols] = await p.query<RowDataPacket[]>(`SELECT COLUMN_NAME AS c, CHARACTER_MAXIMUM_LENGTH AS len FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chat_messages'`);
    const chatHave = new Map(chatCols.map((r) => [String(r.c).toLowerCase(), Number(r.len ?? 0)]));
    if ((chatHave.get('body') ?? 0) < 2000) await p.query(`ALTER TABLE chat_messages MODIFY body VARCHAR(2000) NOT NULL`);
    if (!chatHave.has('poll')) await p.query(`ALTER TABLE chat_messages ADD COLUMN poll JSON NULL`);
    // brute-force counters (login / signup / password), shared by every function instance
    await p.query(`CREATE TABLE IF NOT EXISTS rate_limits (
      k CHAR(64) NOT NULL PRIMARY KEY,
      n INT UNSIGNED NOT NULL,
      reset_at DATETIME(3) NOT NULL,
      KEY ix_rl_reset (reset_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    // Web Push subscriptions (one per browser / phone), removed when the push service says they expired
    await p.query(`CREATE TABLE IF NOT EXISTS push_subs (
      id CHAR(64) NOT NULL PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      endpoint TEXT NOT NULL,
      p256dh VARCHAR(200) NOT NULL,
      auth VARCHAR(100) NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      KEY ix_push_user (user_id),
      CONSTRAINT fk_push_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    // one vote per member and poll; deleted with the message
    await p.query(`CREATE TABLE IF NOT EXISTS chat_votes (
      message_id BIGINT UNSIGNED NOT NULL,
      user_id CHAR(36) NOT NULL,
      choice TINYINT UNSIGNED NOT NULL,
      PRIMARY KEY (message_id, user_id),
      CONSTRAINT fk_vote_msg FOREIGN KEY (message_id) REFERENCES chat_messages (id) ON DELETE CASCADE,
      CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
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
    // upcoming tests / exams / lab reports shown on the home page; a row is deleted once its time has passed
    await p.query(`CREATE TABLE IF NOT EXISTS events (
      id CHAR(36) NOT NULL PRIMARY KEY,
      kind VARCHAR(10) NOT NULL DEFAULT 'controle',
      module VARCHAR(20) NOT NULL,
      day CHAR(10) NOT NULL,
      time CHAR(5) NOT NULL DEFAULT '',
      ends_at DATETIME(3) NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      KEY ix_events_ends (ends_at)
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
    public code: string,
    public headers: Record<string, string> = {}
  ) {
    super(code);
  }
}

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers } });

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new HttpError(500, 'server_not_configured');
  return new TextEncoder().encode(s);
}

/** Session cookie. Several devices may be signed in at once: they share the account's session_id (created on first sign-in). */
async function issueCookie(userId: string, req: Request) {
  const [rows] = await db().query<UserRow[]>('SELECT session_id FROM users WHERE id = ? LIMIT 1', [userId]);
  const sid = rows[0]?.session_id ?? randomUUID();
  await db().query('UPDATE users SET session_id = ? WHERE id = ?', [sid, userId]);
  await touch(userId, req, true);
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
  await touch(u.id, req);
  return u;
}

/**
 * Presence. An open, visible tab calls /auth/me every 30 s, so last_seen is at most ~75 s old while someone is on the site.
 * - online: session open and last_seen < ONLINE_S ago
 * - online_since: start of the current visit (reset when the previous activity is older than VISIT_GAP_S)
 * All durations are computed by MySQL (NOW(3)) so the server and database clocks never have to agree.
 */
const ONLINE_S = 120;
const VISIT_GAP_S = 180;
async function touch(id: string, req: Request, force = false) {
  // online_since is assigned first: MySQL evaluates SET left to right, so it still sees the previous last_seen
  await db().query(
    `UPDATE users
        SET online_since = IF(last_seen IS NULL OR online_since IS NULL OR last_seen < NOW(3) - INTERVAL ${VISIT_GAP_S} SECOND, NOW(3), online_since),
            last_seen = NOW(3),
            last_device = ?
      WHERE id = ? AND (? OR last_seen IS NULL OR last_seen < NOW(3) - INTERVAL 45 SECOND)`,
    [deviceOf(req.headers.get('user-agent') ?? ''), id, force]
  );
}

/** "mobile|Android|Chrome" from the User-Agent: type (mobile / tablet / desktop), system, browser. */
function deviceOf(ua: string) {
  const type = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua) ? 'tablet' : /Mobi|iPhone|iPod|Android/i.test(ua) ? 'mobile' : 'desktop';
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /CrOS/.test(ua) ? 'ChromeOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /CriOS|Chrome/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : '';
  return `${type}|${os}|${browser}`;
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

/**
 * Brute force: at most AUTH_MAX attempts per AUTH_WINDOW_S for a key (IP, e-mail, account), counted in the database
 * so every function instance shares the same counters. Over the limit → 429 with Retry-After.
 */
const AUTH_MAX = 7;
const AUTH_WINDOW_S = 600;
async function limit(key: string, max = AUTH_MAX, windowS = AUTH_WINDOW_S) {
  const k = createHash('sha256').update(key).digest('hex');
  // MySQL evaluates SET left to right: n is reset with the old reset_at, then reset_at moves
  await db().query(
    `INSERT INTO rate_limits (k, n, reset_at) VALUES (?, 1, NOW(3) + INTERVAL ? SECOND)
     ON DUPLICATE KEY UPDATE n = IF(reset_at < NOW(3), 1, n + 1), reset_at = IF(reset_at < NOW(3), NOW(3) + INTERVAL ? SECOND, reset_at)`,
    [k, windowS, windowS]
  );
  const [rows] = await db().query<RowDataPacket[]>('SELECT n, GREATEST(1, TIMESTAMPDIFF(SECOND, NOW(3), reset_at)) AS wait FROM rate_limits WHERE k = ?', [k]);
  if (Math.random() < 0.02) void db().query('DELETE FROM rate_limits WHERE reset_at < NOW(3) - INTERVAL 1 DAY').catch(() => undefined);
  if (Number(rows[0]?.n ?? 0) > max) throw new HttpError(429, 'too_many_attempts', { 'retry-after': String(rows[0].wait) });
}
const clearLimit = (key: string) => db().query('DELETE FROM rate_limits WHERE k = ?', [createHash('sha256').update(key).digest('hex')]);

/**
 * Flood guard (first line, per warm instance, no database cost): FLOOD_MAX requests per minute and IP.
 * Netlify's own rate limiting (config.rateLimit below) stops floods at the edge before they reach the function.
 */
const FLOOD_MAX = 240;
const hits = new Map<string, { n: number; until: number }>();
function flood(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.until < now) {
    if (hits.size > 5000) hits.clear();
    hits.set(ip, { n: 1, until: now + 60_000 });
  } else if (++h.n > FLOOD_MAX) throw new HttpError(429, 'too_many_requests', { 'retry-after': String(Math.ceil((h.until - now) / 1000)) });
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
  avatar_at: Date | null;
  profile_private?: number;
  created_at: Date;
  /** admin listing only (computed by MySQL) */
  seen_ago?: number | null;
  last_device?: string | null;
  online_for?: number | null;
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
    avatar: avatarUrl(u),
    privateProfile: !!u.profile_private,
    // the presentation coach is private to the principal admin (not other admins, not ORAL_EMAILS)
    features: isPrincipal(u) ? ['oral'] : []
  };
};
/** Versioned URL of the profile picture (relative to /api), null = initials. */
const avatarUrl = (u: { id: string; avatar_at: Date | null }) => (u.avatar_at ? `/users/${u.id}/avatar?v=${new Date(u.avatar_at).getTime()}` : null);
/** Admin listing: same as publicUser + activity. */
const adminUser = (u: UserRow) => {
  const seenAgo = u.seen_ago == null ? null : Number(u.seen_ago);
  const online = !!u.session_id && seenAgo !== null && seenAgo < ONLINE_S;
  const [type = '', os = '', browser = ''] = (u.last_device ?? '').split('|');
  return { ...publicUser(u), online, lastSeen: u.last_seen, seenAgo, onlineFor: online && u.online_for != null ? Number(u.online_for) : null, device: type ? { type, os, browser } : null };
};

/** Hash compared against when the e-mail is unknown, so the response time does not reveal which e-mails exist. */
let dummyHash: string | null = null;
const dummy = () => (dummyHash ??= bcrypt.hashSync('not-a-real-password', 11));

async function findUser(where: 'id' | 'email', value: string) {
  const [rows] = await db().query<UserRow[]>(`SELECT id, email, password_hash, display_name, groupe, role, status, session_id, last_seen, avatar_at, profile_private, created_at FROM users WHERE ${where} = ? LIMIT 1`, [value]);
  return rows[0];
}

// ---------------------------------------------------------------- routes
async function route(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname.replace(/^\/(\.netlify\/functions\/api|api)/, '').replace(/\/$/, '') || '/';
  const method = req.method.toUpperCase();
  const ip = req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for') ?? 'ip';

  flood(ip);
  // request size: nothing legitimate is bigger (progress is checked separately, 2 MB)
  const size = Number(req.headers.get('content-length') ?? 0);
  if (size > (path === '/progress' ? MAX_PROGRESS_BYTES : 300_000)) throw new HttpError(413, 'too_large');

  // CSRF: a write must come from this site (the browser always sends Origin on cross-site POST / PUT / DELETE)
  if (method !== 'GET' && method !== 'HEAD') {
    const origin = req.headers.get('origin');
    if (origin) {
      const hosts = new Set([new URL(req.url).host, req.headers.get('host'), req.headers.get('x-forwarded-host')].filter(Boolean));
      let from = '';
      try {
        from = new URL(origin).host;
      } catch {
        /* "null" or malformed origin */
      }
      if (!hosts.has(from)) throw new HttpError(403, 'bad_origin');
    }
  }

  if (method === 'GET' && path === '/health') return json(200, { ok: true });
  // Diagnostics without secrets: which variables are set, and the database error code if the connection fails.
  // public check used by the ping: only says whether the database answers (no configuration, no error details)
  if (method === 'GET' && path === '/health/db') {
    try {
      await migrate();
      await db().query('SELECT 1');
      return json(200, { ok: true });
    } catch (e) {
      console.error('[health/db]', (e as { code?: string }).code ?? e);
      return json(503, { ok: false });
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
    await limit(`signup:${ip}`);
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
    // 7 tries / 10 min per IP and per e-mail (an attacker spreading over many IPs still hits the e-mail limit)
    await limit(`login-ip:${ip}`);
    await limit(`login-email:${email}`);
    const u = await findUser('email', email);
    // compare even when the user does not exist, so timing does not reveal registered e-mails
    const ok = await bcrypt.compare(password, u?.password_hash ?? dummy());
    if (!u || !ok) throw new HttpError(401, 'invalid_credentials');
    await clearLimit(`login-email:${email}`);
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
    if (typeof b.privateProfile === 'boolean') await db().query('UPDATE users SET profile_private = ? WHERE id = ?', [b.privateProfile ? 1 : 0, userId]);
    // avatar: a data URL sets it, '' or null removes it, absent leaves it
    if (b.avatar === '' || b.avatar === null) await db().query('UPDATE users SET avatar = NULL, avatar_at = NULL WHERE id = ?', [userId]);
    else if (typeof b.avatar === 'string') {
      if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(b.avatar) || b.avatar.length > 200_000) throw new HttpError(400, 'invalid_avatar');
      await db().query('UPDATE users SET avatar = ?, avatar_at = NOW(3) WHERE id = ?', [b.avatar, userId]);
    }
    return json(200, { user: publicUser((await findUser('id', userId))!) });
  }

  if (method === 'POST' && path === '/auth/password') {
    const b = await body(req);
    const current = typeof b.current === 'string' ? b.current : '';
    const next = typeof b.next === 'string' ? b.next : '';
    if (next.length < 8 || next.length > 200) throw new HttpError(400, 'weak_password');
    await limit(`password:${userId}`);
    const u = await findUser('id', userId);
    if (!u || !(await bcrypt.compare(current, u.password_hash))) throw new HttpError(401, 'invalid_credentials');
    await db().query('UPDATE users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(next, 11), userId]);
    return json(200, { ok: true });
  }

  // ----- everything below needs an approved account
  if (publicUser(me).status !== 'approved') throw new HttpError(403, me.status === 'blocked' ? 'blocked' : 'pending');

  // ----- Web Push: notifications on the phone / computer even when the site is closed
  if (method === 'GET' && path === '/push/key') return json(200, { key: pushReady() ? process.env.VAPID_PUBLIC_KEY : null });
  if (method === 'POST' && path === '/push/subscribe') {
    const sub = (await body(req)).subscription as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } } | undefined;
    const endpoint = typeof sub?.endpoint === 'string' && /^https:\/\//.test(sub.endpoint) ? sub.endpoint.slice(0, 2000) : '';
    const p256dh = typeof sub?.keys?.p256dh === 'string' ? sub.keys.p256dh.slice(0, 200) : '';
    const auth = typeof sub?.keys?.auth === 'string' ? sub.keys.auth.slice(0, 100) : '';
    if (!endpoint || !p256dh || !auth) throw new HttpError(400, 'invalid_subscription');
    const id = createHash('sha256').update(endpoint).digest('hex');
    await db().query('INSERT INTO push_subs (id, user_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), p256dh = VALUES(p256dh), auth = VALUES(auth)', [id, userId, endpoint, p256dh, auth]);
    return json(200, { ok: true });
  }
  if (method === 'POST' && path === '/push/unsubscribe') {
    const endpoint = str((await body(req)).endpoint, 2000);
    if (endpoint) await db().query('DELETE FROM push_subs WHERE id = ? AND user_id = ?', [createHash('sha256').update(endpoint).digest('hex'), userId]);
    return json(200, { ok: true });
  }

  // ----- profile pictures (versioned URL → cached for a long time)
  const av = /^\/users\/([0-9a-f-]{36})\/avatar$/.exec(path);
  if (method === 'GET' && av) {
    const [rows] = await db().query<RowDataPacket[]>('SELECT avatar FROM users WHERE id = ? LIMIT 1', [av[1]]);
    const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(String(rows[0]?.avatar ?? ''));
    if (!m) throw new HttpError(404, 'not_found');
    return new Response(Buffer.from(m[2], 'base64'), { status: 200, headers: { 'content-type': m[1], 'cache-control': 'private, max-age=31536000, immutable' } });
  }

  // ----- public profile of a group member: name, picture, activity and what they studied (from their saved progress)
  const pr = /^\/users\/([0-9a-f-]{36})\/profile$/.exec(path);
  if (method === 'GET' && pr) {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT u.id, u.display_name, u.email, u.groupe, u.role, u.status, u.session_id, u.avatar_at, u.profile_private, u.created_at,
              TIMESTAMPDIFF(SECOND, u.last_seen, NOW(3)) AS seen_ago, p.data
         FROM users u LEFT JOIN progress p ON p.user_id = u.id WHERE u.id = ? LIMIT 1`,
      [pr[1]]
    );
    const u = rows[0];
    // any member who can appear in the chat (approved, or an admin whatever their stored status) has a profile
    if (!u || (u.status !== 'approved' && u.role !== 'admin' && !adminEmails().includes(String(u.email).toLowerCase()))) throw new HttpError(404, 'not_found');
    const seenAgo = u.seen_ago == null ? null : Number(u.seen_ago);
    const hidden = !!u.profile_private && u.id !== userId && !isAdmin(me);
    return json(200, {
      profile: {
        id: u.id,
        displayName: u.display_name || String(u.email).split('@')[0],
        groupe: u.groupe,
        avatar: avatarUrl(u as { id: string; avatar_at: Date | null }),
        createdAt: u.created_at,
        online: !!u.session_id && seenAgo !== null && seenAgo < ONLINE_S,
        seenAgo,
        private: !!u.profile_private,
        // private profile: what they study stays hidden from other members (not from themselves or admins)
        study: hidden ? null : studySummary(u.data)
      }
    });
  }

  // ----- group chat (last CHAT_KEEP messages; ?after=<id> returns only newer ones)
  if (method === 'GET' && path === '/chat') {
    const after = Number(new URL(req.url).searchParams.get('after') ?? 0) || 0;
    return json(200, { messages: await chatList(after, userId) });
  }
  if (method === 'POST' && path === '/chat') {
    const b = await body(req);
    const text = str(b.body, 2000).replace(/\s+\n/g, '\n');
    // 500 visible characters: a mention token counts as its name
    if (!text || text.replace(MENTION, '@$1').length > 500) throw new HttpError(400, text ? 'too_long' : 'empty');
    let poll: { options: string[] } | null = null;
    if (b.poll && typeof b.poll === 'object') {
      const raw = (b.poll as { options?: unknown }).options;
      const options = Array.isArray(raw) ? raw.map((o) => str(o, 80)).filter(Boolean) : [];
      if (options.length < 2 || options.length > 6 || new Set(options.map((o) => o.toLowerCase())).size !== options.length) throw new HttpError(400, 'invalid_poll');
      poll = { options };
    }
    const [last] = await db().query<RowDataPacket[]>('SELECT TIMESTAMPDIFF(MICROSECOND, MAX(created_at), NOW(3)) AS us FROM chat_messages WHERE user_id = ?', [userId]);
    if (last[0]?.us != null && Number(last[0].us) < 1_500_000) throw new HttpError(429, 'too_fast');
    await db().query('INSERT INTO chat_messages (user_id, body, poll) VALUES (?, ?, ?)', [userId, text, poll ? JSON.stringify(poll) : null]);
    // push to the members mentioned (@everyone = the whole group), never to the author
    const targets = [...text.matchAll(MENTION_IDS)].map((m) => m[1]);
    if (targets.length) {
      const from = me.display_name || me.email.split('@')[0];
      await pushTo(targets.includes('everyone') ? 'all' : targets, { title: `${from} · Discussion`, body: text.replace(MENTION, '@$1').slice(0, 140), url: '/', tag: 'chat' }, userId);
    }
    await db().query(`DELETE FROM chat_messages WHERE id NOT IN (SELECT id FROM (SELECT id FROM chat_messages ORDER BY id DESC LIMIT ${CHAT_KEEP}) AS keep)`);
    return json(201, { messages: await chatList(0, userId) });
  }
  // a member deletes one of their own messages (admins can delete any, here or in /admin/chat/:id)
  const dm = /^\/chat\/(\d+)$/.exec(path);
  if (method === 'DELETE' && dm) {
    const [r] = await db().query<ResultSetHeader>('DELETE FROM chat_messages WHERE id = ? AND (user_id = ? OR ?)', [Number(dm[1]), userId, isAdmin(me)]);
    if (!r.affectedRows) throw new HttpError(404, 'not_found');
    return json(200, { messages: await chatList(0, userId) });
  }
  // vote (same choice again = remove the vote)
  const vt = /^\/chat\/(\d+)\/vote$/.exec(path);
  if (method === 'POST' && vt) {
    const id = Number(vt[1]);
    const choice = Number((await body(req)).choice);
    const [rows] = await db().query<RowDataPacket[]>('SELECT poll FROM chat_messages WHERE id = ?', [id]);
    const poll = rows[0]?.poll ? ((typeof rows[0].poll === 'string' ? JSON.parse(rows[0].poll) : rows[0].poll) as { options: string[] }) : null;
    if (!poll) throw new HttpError(404, 'not_found');
    if (!Number.isInteger(choice) || choice < 0 || choice >= poll.options.length) throw new HttpError(400, 'invalid_choice');
    const [cur] = await db().query<RowDataPacket[]>('SELECT choice FROM chat_votes WHERE message_id = ? AND user_id = ?', [id, userId]);
    if (cur[0] && Number(cur[0].choice) === choice) await db().query('DELETE FROM chat_votes WHERE message_id = ? AND user_id = ?', [id, userId]);
    else await db().query('INSERT INTO chat_votes (message_id, user_id, choice) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE choice = VALUES(choice)', [id, userId, choice]);
    return json(200, { messages: await chatList(0, userId) });
  }
  // members, for @mentions
  if (method === 'GET' && path === '/members') {
    const [rows] = await db().query<RowDataPacket[]>("SELECT id, display_name, email, avatar_at FROM users WHERE status = 'approved' OR role = 'admin' ORDER BY display_name");
    return json(200, { members: rows.map((r) => ({ id: r.id, name: r.display_name || String(r.email).split('@')[0], avatar: avatarUrl(r as { id: string; avatar_at: Date | null }) })) });
  }

  if (method === 'GET' && path === '/supports') {
    const [rows] = await db().query<RowDataPacket[]>('SELECT id, ref, subject, kind, title, url, sort, hidden, created_at FROM supports ORDER BY subject, sort, title');
    return json(200, { supports: rows.map(supportOut) });
  }

  if (method === 'GET' && path === '/announcements') {
    const [rows] = await db().query<RowDataPacket[]>('SELECT id, title, body, pinned, created_at FROM announcements ORDER BY pinned DESC, created_at DESC LIMIT 50');
    return json(200, { announcements: rows.map(annOut) });
  }

  if (method === 'GET' && path === '/events') return json(200, { events: await listEvents() });

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

/**
 * Upcoming tests, exams and lab reports ("compte rendu"), several per day and for any module.
 * `ends_at` is the instant the item stops being relevant (its time, or the end of its day), sent by the admin's
 * browser in UTC so the local time zone is respected; anything past it is deleted on the next read.
 */
type EventKind = 'controle' | 'examen' | 'cr';
const EVENT_KINDS: EventKind[] = ['controle', 'examen', 'cr'];
const eventOut = (r: RowDataPacket) => ({ id: r.id, kind: r.kind, module: r.module, date: r.day, time: r.time, endsAt: r.ends_at, message: r.message, createdAt: r.created_at });
async function listEvents() {
  await db().query('DELETE FROM events WHERE ends_at < NOW(3)');
  const [rows] = await db().query<RowDataPacket[]>('SELECT * FROM events ORDER BY ends_at, created_at');
  return rows.map(eventOut);
}
function eventFields(b: Record<string, unknown>) {
  const kind = EVENT_KINDS.includes(b.kind as EventKind) ? (b.kind as EventKind) : 'controle';
  const module = typeof b.module === 'string' && /^[a-z0-9-]{1,20}$/i.test(b.module) ? b.module : '';
  const day = typeof b.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : '';
  const time = typeof b.time === 'string' && /^\d{2}:\d{2}$/.test(b.time) ? b.time : '';
  const ends = typeof b.endsAt === 'string' ? new Date(b.endsAt) : null;
  if (!module || !day || !ends || Number.isNaN(ends.getTime())) throw new HttpError(400, 'missing_fields');
  if (ends.getTime() < Date.now()) throw new HttpError(400, 'past_date');
  const message = typeof b.message === 'string' ? b.message.trim().slice(0, 3000) : '';
  // module title as shown to the admin, only used in the push notification
  const label = str(b.label, 120);
  return { kind, module, day, time, ends, message, label };
}

// ---------------------------------------------------------------- Web Push
/** VAPID keys come from the environment (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY); without them push is simply off. */
let vapidSet = false;
function pushReady() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  if (!vapidSet) {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || `mailto:${PRINCIPAL_ADMIN}`, pub, priv);
    vapidSet = true;
  }
  return true;
}
/** Sends a notification to members ('all' = every approved member), except `exceptUser`; dead subscriptions are removed. */
async function pushTo(users: 'all' | string[], payload: { title: string; body: string; url: string; tag: string }, exceptUser?: string) {
  if (!pushReady()) return;
  try {
    const [rows] =
      users === 'all'
        ? await db().query<RowDataPacket[]>("SELECT s.id, s.endpoint, s.p256dh, s.auth FROM push_subs s JOIN users u ON u.id = s.user_id WHERE (u.status = 'approved' OR u.role = 'admin') AND s.user_id <> ?", [exceptUser ?? ''])
        : users.length
          ? await db().query<RowDataPacket[]>('SELECT id, endpoint, p256dh, auth FROM push_subs WHERE user_id IN (?) AND user_id <> ?', [users, exceptUser ?? ''])
          : [[] as RowDataPacket[]];
    const data = JSON.stringify(payload);
    // bounded: the function must answer quickly, a slow push service is skipped
    await Promise.race([
      Promise.allSettled(
        rows.map((r) =>
          webpush.sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, data, { TTL: 86400, urgency: 'high' }).catch(async (e: { statusCode?: number }) => {
            if (e.statusCode === 404 || e.statusCode === 410) await db().query('DELETE FROM push_subs WHERE id = ?', [r.id]);
          })
        )
      ),
      new Promise((ok) => setTimeout(ok, 6000))
    ]);
  } catch (e) {
    console.error('[push]', e);
  }
}

const CHAT_KEEP = 20;
/** mentioned ids in stored tokens (a member id or "everyone") */
const MENTION_IDS = /@\[[^\]\n]{1,60}\]\(([0-9a-f-]{36}|everyone)\)/g;
/** @[Name](user id) */
const MENTION = /@\[([^\]\n]{1,60})\]\((?:[0-9a-f-]{36}|everyone)\)/g;
async function chatList(after: number, me: string) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT m.id, m.body, m.poll, m.created_at, u.id AS uid, u.display_name, u.email, u.avatar_at
       FROM chat_messages m JOIN users u ON u.id = m.user_id
      WHERE m.id > ? ORDER BY m.id DESC LIMIT ${CHAT_KEEP}`,
    [after]
  );
  // poll results: votes per option + this member's choice
  const pollIds = rows.filter((r) => r.poll).map((r) => Number(r.id));
  const votes = new Map<number, { counts: Map<number, number>; mine: number | null }>();
  if (pollIds.length) {
    const [vr] = await db().query<RowDataPacket[]>(
      'SELECT message_id, choice, COUNT(*) AS n, MAX(user_id = ?) AS mine FROM chat_votes WHERE message_id IN (?) GROUP BY message_id, choice',
      [me, pollIds]
    );
    for (const v of vr) {
      const k = Number(v.message_id);
      const e = votes.get(k) ?? { counts: new Map(), mine: null };
      e.counts.set(Number(v.choice), Number(v.n));
      if (Number(v.mine)) e.mine = Number(v.choice);
      votes.set(k, e);
    }
  }
  return rows.reverse().map((r) => ({
    id: Number(r.id),
    body: r.body,
    at: r.created_at,
    poll: r.poll
      ? (() => {
          const opts = ((typeof r.poll === 'string' ? JSON.parse(r.poll) : r.poll) as { options: string[] }).options;
          const v = votes.get(Number(r.id));
          const counts = opts.map((_, i) => v?.counts.get(i) ?? 0);
          return { options: opts, counts, total: counts.reduce((a, c) => a + c, 0), mine: v?.mine ?? null };
        })()
      : null,
    user: { id: r.uid, name: r.display_name || String(r.email).split('@')[0], avatar: avatarUrl({ id: r.uid, avatar_at: r.avatar_at }) }
  }));
}

/** What a member studied, from their saved progress: never the raw data (answers, cards…), only a summary. */
function studySummary(raw: unknown) {
  type P = { xp?: number; streak?: { count?: number }; read?: Record<string, boolean>; chapterPos?: Record<string, { pct?: number; at?: number }>; exams?: { module?: string; note?: number; date?: number }[]; exercises?: Record<string, string>; qstats?: Record<string, unknown>; lastVisit?: { module?: string; chapter?: string; at?: number } | null };
  let d: P = {};
  try {
    d = (typeof raw === 'string' ? JSON.parse(raw) : raw ?? {}) as P;
  } catch {
    d = {};
  }
  const read = Object.entries(d.read ?? {}).filter(([, v]) => v).map(([k]) => k);
  const inProgress = Object.entries(d.chapterPos ?? {})
    .filter(([k, v]) => !d.read?.[k] && (v?.pct ?? 0) > 0)
    .sort((a, b) => (b[1]?.at ?? 0) - (a[1]?.at ?? 0))
    .slice(0, 8)
    .map(([k, v]) => ({ key: k, pct: Math.round(v?.pct ?? 0) }));
  const exams = (d.exams ?? []).slice(-5).reverse().map((e) => ({ module: e.module ?? '', note: Math.round((e.note ?? 0) * 10) / 10, date: e.date ?? 0 }));
  return {
    xp: d.xp ?? 0,
    streak: d.streak?.count ?? 0,
    read,
    inProgress,
    exams,
    exercisesOk: Object.values(d.exercises ?? {}).filter((v) => v === 'ok').length,
    questions: Object.keys(d.qstats ?? {}).length,
    lastVisit: d.lastVisit ? { module: d.lastVisit.module ?? '', chapter: d.lastVisit.chapter ?? '', at: d.lastVisit.at ?? 0 } : null
  };
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
    const [rows] = await p.query<UserRow[]>(
      `SELECT id, email, password_hash, display_name, groupe, role, status, session_id, last_seen, avatar_at, profile_private, last_device, created_at,
              TIMESTAMPDIFF(SECOND, last_seen, NOW(3)) AS seen_ago,
              TIMESTAMPDIFF(SECOND, online_since, NOW(3)) AS online_for
         FROM users ORDER BY (status = 'pending') DESC, created_at DESC`
    );
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

  // ----- chat moderation
  const cm = /^\/chat\/(\d+)$/.exec(path);
  if (cm && method === 'DELETE') {
    await p.query('DELETE FROM chat_messages WHERE id = ?', [Number(cm[1])]);
    return json(200, { messages: await chatList(0, me.id) });
  }

  // ----- upcoming tests / exams / lab reports
  if (method === 'POST' && path === '/events') {
    const f = eventFields(await body(req));
    const id = randomUUID();
    await p.query('INSERT INTO events (id, kind, module, day, time, ends_at, message) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, f.kind, f.module, f.day, f.time, f.ends, f.message]);
    const label = f.label || f.module;
    const kindFr = f.kind === 'cr' ? 'Compte rendu' : f.kind === 'examen' ? 'Examen' : 'Contrôle';
    const [yy, mm, dd] = f.day.split('-');
    await pushTo('all', { title: `${kindFr} · ${label}`, body: `${f.kind === 'cr' ? 'À rendre le' : 'Le'} ${dd}/${mm}/${yy}${f.time ? ` · ${f.time.replace(':', 'h')}` : ''}${f.message ? `\n${f.message.slice(0, 120)}` : ''}`, url: '/', tag: `event-${id}` }, me.id);
    return json(201, { events: await listEvents() });
  }
  const ev = idOf('events');
  if (ev && method === 'PUT') {
    const f = eventFields(await body(req));
    const [r] = await p.query<ResultSetHeader>('UPDATE events SET kind = ?, module = ?, day = ?, time = ?, ends_at = ?, message = ? WHERE id = ?', [f.kind, f.module, f.day, f.time, f.ends, f.message, ev.id]);
    if (!r.affectedRows) throw new HttpError(404, 'not_found');
    return json(200, { events: await listEvents() });
  }
  if (ev && method === 'DELETE') {
    await p.query('DELETE FROM events WHERE id = ?', [ev.id]);
    return json(200, { events: await listEvents() });
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
    await pushTo('all', { title: `Annonce · ${f.title}`, body: f.text.slice(0, 140), url: '/', tag: `ann-${id}` }, me.id);
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
    if (e instanceof HttpError) return json(e.status, { error: e.code }, e.headers);
    console.error('[api]', e);
    return json(500, { error: 'server_error' });
  }
};
