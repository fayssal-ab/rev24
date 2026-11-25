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
        }
      })
    )
    .catch(() => undefined);
}

