/**
 * App version and the "repair" path: when a device keeps running an old version (stuck service worker / caches),
 * drop the service worker and the caches and load the site again. Saved progress (localStorage) is kept.
 */
export const BUILD_ID = __BUILD_ID__;

/** "25/11 · 01:14" */
export const buildLabel = () => {
  const d = new Date(BUILD_ID);
  return Number.isNaN(d.getTime()) ? 'dev' : `${d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} · ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
};

export async function hardReset() {
  try {
    if ('serviceWorker' in navigator) for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
    if ('caches' in window) for (const k of await caches.keys()) await caches.delete(k);
  } catch {
    /* nothing more we can do: reload anyway */
  }
  const url = new URL(window.location.href);
  url.searchParams.set('v', String(Date.now()));
  window.location.replace(url.toString());
}
