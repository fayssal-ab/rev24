/**
 * Web Push: notifications on the phone / computer even when the site is closed
 * (new announcement, new test / exam / lab report, @mention in the chat).
 * Android / desktop: works in the browser. iPhone: only once the site is added to the home screen (iOS 16.4+).
 */
import { api } from '../auth/auth';

const ON_KEY = 'g22-push-on';

export const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const pushActive = () => localStorage.getItem(ON_KEY) === '1';

function keyBytes(base64: string) {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

/** Subscribes this browser (asks for permission first if needed). Returns false when not possible. */
export async function enablePush(ask = true): Promise<boolean> {
  if (!pushSupported()) return false;
  if (Notification.permission !== 'granted') {
    if (!ask || (await Notification.requestPermission()) !== 'granted') return false;
  }
  const k = await api<{ key: string | null }>('GET', '/push/key');
  if (!k.ok || !k.data.key) return false;
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(k.data.key) });
  const r = await api('POST', '/push/subscribe', { subscription: sub.toJSON() });
  if (r.ok) localStorage.setItem(ON_KEY, '1');
  return r.ok;
}

/** Called at start-up: keeps the server's copy of the subscription up to date (it can change or expire). */
export async function syncPush() {
  if (pushSupported() && Notification.permission === 'granted') await enablePush(false).catch(() => false);
}
