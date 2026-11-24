/**
 * Upcoming tests, exams and lab reports ("compte rendu") posted by the admin (Admin → Accueil · contrôles).
 * Several can fall on the same day, for any module. The API deletes an item once its time has passed;
 * the client also hides it as soon as `endsAt` is past, without waiting for a reload.
 */
import { useEffect, useState } from 'react';
import { api, authEnabled, useApproved } from '../auth/auth';

export type EventKind = 'controle' | 'examen' | 'cr';
export interface UpcomingEvent {
  id: string;
  kind: EventKind;
  module: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, '' = no time (lasts until the end of the day) */
  time: string;
  /** ISO instant after which the item is gone */
  endsAt: string;
  /** what it covers / instructions, written by the admin */
  message: string;
  createdAt: string;
}

let cache: UpcomingEvent[] | undefined;
const listeners = new Set<(e: UpcomingEvent[]) => void>();

/** Called by the admin page after a change, so the home page updates without a reload. */
export function setEventsCache(list: UpcomingEvent[]) {
  cache = list;
  listeners.forEach((l) => l(list));
}

/** End instant of an item in the browser's time zone: its time, or 23:59 of its day. */
export function endsAtIso(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '23:59').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, time ? 0 : 59).toISOString();
}

/** Upcoming items, soonest first (fetched once per session). */
export function useEvents(): { events: UpcomingEvent[]; loaded: boolean } {
  const approved = useApproved();
  const [list, setList] = useState<UpcomingEvent[] | undefined>(cache);
  const [, tick] = useState(0);
  useEffect(() => {
    listeners.add(setList);
    if (authEnabled && approved && cache === undefined)
      void api<{ events: UpcomingEvent[] }>('GET', '/events').then((r) => r.ok && setEventsCache(r.data.events));
    // re-render every minute so an item disappears when its time passes
    const id = setInterval(() => tick((n) => n + 1), 60_000);
    return () => {
      listeners.delete(setList);
      clearInterval(id);
    };
  }, [approved]);
  const now = Date.now();
  const events = (list ?? []).filter((e) => new Date(e.endsAt).getTime() > now).sort((a, b) => a.endsAt.localeCompare(b.endsAt));
  return { events, loaded: !authEnabled || list !== undefined };
}

/** Whole days from today to `date` (0 = today). */
export function daysUntil(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const now = new Date();
  return Math.round((new Date(y, m - 1, d).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86_400_000);
}
