import { create } from 'zustand';
import { useStore, EXPORT_KEYS, type State } from '../store/store';

/**
 * Accounts + progress sync against our own API (Netlify Function → MySQL, see netlify/functions/api.mts).
 * Enabled when VITE_AUTH=on (set on Netlify). Without it the site runs in "local mode" exactly as before.
 */
export const authEnabled = import.meta.env.VITE_AUTH === 'on';
const API = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export interface User {
  id: string;
  email: string;
  displayName: string;
  groupe: string;
  features: string[];
}

interface AuthState {
  ready: boolean;
  user: User | null;
  syncing: 'idle' | 'saving' | 'saved' | 'error';
}

export const useAuth = create<AuthState>(() => ({ ready: !authEnabled, user: null, syncing: 'idle' }));

/** The oral-presentation coach is private: only accounts the server flags with the "oral" feature (local dev: always). */
export const useCanSeeOral = () => useAuth((s) => (authEnabled ? !!s.user?.features.includes('oral') : import.meta.env.DEV));

// ---------------------------------------------------------------- http
export type AuthResult = { ok: true } | { ok: false; error: string };

async function api<T>(method: string, path: string, body?: unknown): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const r = await fetch(`${API}${path}`, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const j = await r.json().catch(() => ({}));
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
  useAuth.setState({ user, ready: true });
  if (user && user.id !== prev?.id) await startSync(user);
  if (!user) {
    stopSync();
    useAuth.setState({ syncing: 'idle' });
  }
}

/** Called once at startup: restores the session from the httpOnly cookie. */
export function initAuth() {
  if (!authEnabled) return;
  void api<{ user: User }>('GET', '/auth/me').then((r) => onUser(r.ok ? r.data.user : null));
  // save before the tab closes
  window.addEventListener('pagehide', () => {
    if (!useAuth.getState().user || !timer) return;
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

export async function updateProfile(p: { displayName?: string; groupe?: string }): Promise<AuthResult> {
  const r = await api<{ user: User }>('PUT', '/profile', p);
  if (!r.ok) return { ok: false, error: r.error };
  useAuth.setState({ user: r.data.user });
  return { ok: true };
}

/** Save one last time, sign out and clear this device so the next student starts clean. */
export async function signOut() {
  if (useAuth.getState().user) await push();
  stopSync();
  await api('POST', '/auth/logout');
  useStore.getState().resetAll();
  ls.del(OWNER);
  ls.del(LOCAL_AT);
  await onUser(null);
}
