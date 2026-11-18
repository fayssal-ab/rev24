import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { useStore } from './store/store';
import { reloadOnce } from './components/RouteErrorBoundary';

// a lazily-loaded page from an older build is missing on the server → reload to get the fresh files
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault();
  reloadOnce();
});

const s = useStore.getState();
document.documentElement.classList.toggle('dark', s.theme === 'dark');
document.documentElement.lang = s.lang === 'dar' ? 'ar-MA' : s.lang;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => undefined);
}
