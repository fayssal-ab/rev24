import { Component, type ReactNode } from 'react';
import { translate } from '../hooks/useT';
import { useStore } from '../store/store';

const KEY = 'rev24-chunk-reload';

/** A page chunk that fails to download (old build still open in the browser) → reload once to get the new files. */
export function isChunkError(e: unknown): boolean {
  const m = e instanceof Error ? e.message : String(e);
  return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk|error loading dynamically/i.test(m);
}

export function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last < 10_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage unavailable */
  }
  window.location.reload();
  return true;
}

export class RouteErrorBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state = { error: null as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  componentDidCatch(error: unknown) {
    if (isChunkError(error)) reloadOnce();
  }
  render() {
    if (!this.state.error) return this.props.children;
    const lang = useStore.getState().lang;
    return (
      <div className="grid min-h-[40vh] place-items-center text-center" role="alert">
        <div>
          <p className="text-muted">{translate('common.loading', lang)}</p>
          <button className="btn-primary mt-4" onClick={() => window.location.reload()}>
            {translate('common.reset', lang)}
          </button>
        </div>
      </div>
    );
  }
}
