import { Component, type ReactNode } from 'react';
import { translate } from '../hooks/useT';
import { useStore } from '../store/store';

const KEY = 'rev24-chunk-reload';


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
    // a refresh always fixed it for users → reload once automatically for any page error
    reloadOnce();
    console.error(error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    const lang = useStore.getState().lang;
    return (
      <div className="grid min-h-[40vh] place-items-center text-center" role="alert">
        <div>
          <p className="text-muted">{translate('common.loading', lang)}</p>
          <p className="mt-2 max-w-md text-xs text-rose-400">{String((this.state.error as Error)?.message ?? this.state.error)}</p>
          <button className="btn-primary mt-4" onClick={() => window.location.reload()}>
            {translate('common.reset', lang)}
          </button>
        </div>
      </div>
    );
  }
}

/** Last-resort boundary around the whole app: never leave a black screen. */
export class RootErrorBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state = { error: null as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  componentDidCatch(error: unknown) {
    console.error(error);
    reloadOnce();
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 24, color: '#e2e8f0', fontFamily: 'system-ui' }} role="alert">
        <p>Oups — erreur / ghalta / error :</p>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#fda4af', fontSize: 12 }}>{String((this.state.error as Error)?.message ?? this.state.error)}</pre>
        <button style={{ marginTop: 12, padding: '8px 14px', borderRadius: 10, background: '#34d399', color: '#0b1020' }} onClick={() => window.location.reload()}>
          Recharger / Reload
        </button>
      </div>
    );
  }
}
