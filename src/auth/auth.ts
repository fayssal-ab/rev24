import { create } from 'zustand';
import { useStore, EXPORT_KEYS, type State } from '../store/store';

/**
 * Accounts + progress sync against our own API (Netlify Function → MySQL, see netlify/functions/api.mts).
 * Enabled when VITE_AUTH=on (set on Netlify). Without it the site runs in "local mode" exactly as before.
 */
export const authEnabled = import.meta.env.VITE_AUTH === 'on';
export const API = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export interface User {
  id: string;
  email: string;
  displayName: string;
  groupe: string;
  role: 'admin' | 'user';
  /** pending = waiting for the admin's approval; blocked = refused / suspended */
  status: 'pending' | 'approved' | 'blocked';
  features: string[];
  /** profile picture URL (relative to the API), null = initials */
  avatar: string | null;
  /** other members only see name, picture and presence */
  privateProfile?: boolean;
}

interface AuthState {
  ready: boolean;
  user: User | null;
  syncing: 'idle' | 'saving' | 'saved' | 'error';
  /** this session was closed because the account was opened somewhere else */
  kicked: boolean;
}

export const useAuth = create<AuthState>(() => ({ ready: !authEnabled, user: null, syncing: 'idle', kicked: false }));

export const useIsAdmin = () => useAuth((s) => !!s.user && s.user.role === 'admin');
/** Signed in and approved by the admin (always true without accounts). */
export const useApproved = () => useAuth((s) => !authEnabled || s.user?.status === 'approved');

/** The oral-presentation coach is private: only accounts the server flags with the "oral" feature (local dev: always). */
export const useCanSeeOral = () => useAuth((s) => (authEnabled ? !!s.user?.features.includes('oral') : import.meta.env.DEV));

// ---------------------------------------------------------------- http
export type AuthResult = { ok: true } | { ok: false; error: string };

export async function api<T>(method: string, path: string, body?: unknown): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const r = await fetch(`${API}${path}`, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 && (j as { error?: string }).error === 'session_replaced') void kicked();
    return r.ok ? { ok: true, data: j as T } : { ok: false, status: r.status, error: (j as { error?: string }).error ?? 'server_error' };
  } catch {
    return { ok: false, status: 0, error: 'network' };
  }
}

// ---------------------------------------------------------------- progress sync
const OWNER = 'group22-progress-owner';
const LOCAL_AT = 'group22-progress-at';
const ls = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode */
    }
  },
  del: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* private mode */
    }
  }
};

/** Progress fields saved in the account (language / theme stay per device). */
const SYNC_KEYS = EXPORT_KEYS.filter((k) => !['lang', 'theme', 'bilingual'].includes(k));
const snapshot = () => {
  const s = useStore.getState() as unknown as Record<string, unknown>;
  return Object.fromEntries(SYNC_KEYS.map((k) => [k, s[k]]));
};

let unsubscribe: (() => void) | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let applyingRemote = false;

async function push() {
  useAuth.setState({ syncing: 'saving' });
  const at = new Date(Number(ls.get(LOCAL_AT)) || Date.now()).toISOString();
  const r = await api('PUT', '/progress', { data: snapshot(), updatedAt: at });
  useAuth.setState({ syncing: r.ok ? 'saved' : 'error' });
}

async function startSync(user: User) {
  stopSync();
  const r = await api<{ data: Partial<State> | null; updatedAt: string | null }>('GET', '/progress');
  const row = r.ok && r.data.data ? r.data : null;
  const owner = ls.get(OWNER);
  const localAt = Number(ls.get(LOCAL_AT)) || 0;
  const remoteAt = row?.updatedAt ? Date.parse(row.updatedAt) : 0;
  const local = useStore.getState();
  const localHasProgress = local.xp > 0 || Object.keys(local.qstats).length > 0 || Object.keys(local.read).length > 0;

  // - this device holds ANOTHER account's progress → wipe it, load this account's data
  // - guest progress (no owner) and nothing online yet → keep it and upload it
  // - otherwise the most recent side wins
  applyingRemote = true;
  if (owner && owner !== user.id) {
    local.resetAll();
    if (row?.data) local.importData(row.data);
  } else if (row?.data && (!owner || !localHasProgress || remoteAt >= localAt)) {
    local.importData(row.data);
  }
  applyingRemote = false;
  ls.set(OWNER, user.id);
  if (r.ok && (!row || (owner === user.id && localAt > remoteAt))) await push();
  else useAuth.setState({ syncing: r.ok ? 'saved' : 'error' });

  unsubscribe = useStore.subscribe(() => {
    if (applyingRemote) return;
    ls.set(LOCAL_AT, String(Date.now()));
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void push(), 1500);
  });
}

function stopSync() {
  unsubscribe?.();
  unsubscribe = null;
  if (timer) clearTimeout(timer);
  timer = null;
}

async function onUser(user: User | null) {
  const prev = useAuth.getState().user;
  useAuth.setState({ user, ready: true, ...(user ? { kicked: false } : {}) });
  // progress is synced only once the admin has approved the account
  const approved = user?.status === 'approved';
  const wasApproved = prev?.status === 'approved' && prev.id === user?.id;
  if (user && approved && !wasApproved) await startSync(user);
  if (!user || !approved) {
    stopSync();
    useAuth.setState({ syncing: 'idle' });
  }
}

/** The account was opened in another session: this one is closed and the device cleared. */
async function kicked() {
  if (!useAuth.getState().user) return;
  stopSync();
  useStore.getState().resetAll();
  ls.del(OWNER);
  ls.del(LOCAL_AT);
  await onUser(null);
  useAuth.setState({ kicked: true });
}

/** Re-checks the session regularly: detects approval (waiting page), blocking, and a newer session elsewhere. */
export async function refreshMe() {
  if (!useAuth.getState().user) return;
  const r = await api<{ user: User }>('GET', '/auth/me');
  if (r.ok) await onUser(r.data.user);
  else if (r.status === 401) {
    if (r.error === 'session_replaced') return; // handled in api()
    stopSync();
    await onUser(null);
  }
}

/**
 * Restores the session from the httpOnly cookie. Only a real "not signed in" answer (401) shows the sign-in page:
 * a network error or a server that is still waking up is retried, so a signed-in member is never shown as signed out.
 */
let restoring = false;
async function restoreSession() {
  if (restoring) return;
  restoring = true;
  try {
    for (let attempt = 0; ; attempt++) {
      const r = await api<{ user: User }>('GET', '/auth/me');
      if (r.ok) return void (await onUser(r.data.user));
      if (r.status === 401 || r.status === 403) return void (await onUser(null));
      if (attempt >= 4) {
        // still unreachable: show the sign-in page, a later wake-up / "online" event tries again
        if (!useAuth.getState().ready) await onUser(null);
        return;
      }
      await new Promise((ok) => setTimeout(ok, 800 * 2 ** attempt));
    }
  } finally {
    restoring = false;
  }
}

/** Called once at startup: restores the session from the httpOnly cookie. */
export function initAuth() {
  if (!authEnabled) return;
  void restoreSession();
  setInterval(() => document.visibilityState === 'visible' && void refreshMe(), 30_000);
  const wake = () => {
    if (document.visibilityState !== 'visible') return;
    // signed out after a failed check (bad mobile network, server waking up): the cookie may still be valid
    if (!useAuth.getState().user) void restoreSession();
    else void refreshMe();
  };
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('online', wake);
  // save before the tab closes
  window.addEventListener('pagehide', () => {
    if (useAuth.getState().user?.status !== 'approved' || !timer) return;
    const at = new Date(Number(ls.get(LOCAL_AT)) || Date.now()).toISOString();
    void fetch(`${API}/progress`, { method: 'PUT', credentials: 'include', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: snapshot(), updatedAt: at }) });
  });
}

// ---------------------------------------------------------------- actions
export async function signUp(email: string, password: string, displayName: string): Promise<AuthResult> {
  const r = await api<{ user: User }>('POST', '/auth/signup', { email, password, displayName });
  if (!r.ok) return { ok: false, error: r.error };
  await onUser(r.data.user);
  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const r = await api<{ user: User }>('POST', '/auth/login', { email, password });
  if (!r.ok) return { ok: false, error: r.error };
  await onUser(r.data.user);
  return { ok: true };
}

export async function changePassword(current: string, next: string): Promise<AuthResult> {
  const r = await api('POST', '/auth/password', { current, next });
  return r.ok ? { ok: true } : { ok: false, error: r.error };
}

export async function updateProfile(p: { displayName?: string; groupe?: string; avatar?: string | null; privateProfile?: boolean }): Promise<AuthResult> {
  const r = await api<{ user: User }>('PUT', '/profile', p);
  if (!r.ok) return { ok: false, error: r.error };
  useAuth.setState({ user: r.data.user });
  return { ok: true };
}

/** Save one last time, sign out and clear this device so the next student starts clean. */
export async function signOut() {
  if (useAuth.getState().user?.status === 'approved') await push();
  stopSync();
  await api('POST', '/auth/logout');
  useStore.getState().resetAll();
  ls.del(OWNER);
  ls.del(LOCAL_AT);
  await onUser(null);
}
