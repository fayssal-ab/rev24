/**
 * The next test shown on the home page. The admin sets it in Admin → Accueil (stored by the API in `settings`);
 * when nothing is set (or the API is off) the built-in default below is used.
 */
import { useEffect, useState } from 'react';
import { api, authEnabled, useApproved } from '../auth/auth';

export interface Focus {
  /** false = no test card on the home page */
  enabled: boolean;
  kind: 'controle' | 'examen';
  module: string;
  /** priority chapter (the main button opens it) */
  chapter: string;
  /** YYYY-MM-DD, '' = not announced yet */
  date: string;
  /** HH:MM, optional */
  time: string;
  room: string;
  /** '' = default title */
  title: string;
  /** what the test covers, written by the admin (one point per line) */
  message: string;
  /** chapters announced as not part of the test */
  out: string[];
}

export const DEFAULT_FOCUS: Focus = {
  enabled: true,
  kind: 'controle',
  module: 'data',
  chapter: 'tests',
  date: '2026-11-25',
  time: '',
  room: '',
  title: '',
  message: '',
  out: []
};

let cache: Focus | null | undefined;
const listeners = new Set<(f: Focus | null) => void>();

/** Called by the admin page after saving, so the home page shows the new values without a reload. */
export function setFocusCache(f: Focus | null) {
  cache = f;
  listeners.forEach((l) => l(f));
}

/** The admin's focus (fetched once per session), or the default. `custom` = set by the admin. */
export function useFocus(): { focus: Focus; custom: boolean; loaded: boolean } {
  const approved = useApproved();
  const [remote, setRemote] = useState<Focus | null | undefined>(cache);
  useEffect(() => {
    listeners.add(setRemote);
    if (authEnabled && approved && cache === undefined)
      void api<{ focus: Focus | null }>('GET', '/focus').then((r) => {
        if (r.ok) setFocusCache(r.data.focus);
      });
    return () => {
      listeners.delete(setRemote);
    };
  }, [approved]);
  return { focus: remote ?? DEFAULT_FOCUS, custom: !!remote, loaded: !authEnabled || remote !== undefined };
}

/** Whole days from today to the test date (negative = past), null when no date. */
export function daysUntil(date: string): number | null {
  if (!date) return null;
  const [y, m, d] = date.split('-').map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86_400_000);
}
