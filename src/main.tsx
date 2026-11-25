import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { useStore } from './store/store';
import { reloadOnce, RootErrorBoundary } from './components/RouteErrorBoundary';
import { initAuth } from './auth/auth';

// a lazily-loaded page from an older build is missing on the server → reload to get the fresh files
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault();
  reloadOnce();
});

const s = useStore.getState();
document.documentElement.classList.toggle('dark', s.theme === 'dark');
document.documentElement.lang = s.lang === 'dar' ? 'ar-MA' : s.lang;

initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);

/**
 * Updates without Ctrl+Shift+R: the service worker is checked for a new version at start-up, every minute and
 * whenever the tab / installed app comes back to the foreground; the new one takes over at once (skipWaiting +
 * clientsClaim) and the page reloads a single time to run the new code.
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // first install: nothing old to replace
    if (!hadController || reloading) return;
    reloading = true;
    window.location.reload();
  });
  import('virtual:pwa-register')
    .then(({ registerSW }) =>
      registerSW({
        immediate: true,
        onRegisteredSW(_url, reg) {
          if (!reg) return;
          const check = () => navigator.onLine && document.visibilityState === 'visible' && void reg.update().catch(() => undefined);
          setInterval(check, 60_000);
          document.addEventListener('visibilitychange', check);
          window.addEventListener('focus', check);
          watchVersion(reg);
        }
      })
    )
    .catch(() => undefined);
}


/**
 * Second safety net, independent of the browser's service-worker checks: /version.json (never cached) holds the id of
 * the build that is online. When it differs from the running one, update the service worker and reload once.
 */
function watchVersion(reg: ServiceWorkerRegistration) {
  let busy = false;
  const check = async () => {
    if (busy || !navigator.onLine || document.visibilityState !== 'visible') return;
    busy = true;
    try {
      const r = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: 'no-store' });
      const online = r.ok ? ((await r.json()) as { build?: string }).build : undefined;
      if (online && online !== __BUILD_ID__) {
        const key = 'g22-version-reload';
        // never loop: at most one forced reload per online build
        if (sessionStorage.getItem(key) === online) return;
        sessionStorage.setItem(key, online);
        await reg.update().catch(() => undefined);
        // give the new service worker a moment to take over, then load the new version
        await new Promise((ok) => setTimeout(ok, 1500));
        window.location.reload();
      }
    } catch {
      /* offline or server busy: next time */
    } finally {
      busy = false;
    }
  };
  void check();
  setInterval(check, 60_000);
  document.addEventListener('visibilitychange', check);
}
