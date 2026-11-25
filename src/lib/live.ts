/**
 * Live data shared by the whole site (SWR): announcements and upcoming tests are fetched once, shared by every
 * component, refreshed every 30 s, when the tab comes back and right after the admin changes them.
 */
import useSWR, { mutate } from 'swr';
import { api, authEnabled, useApproved } from '../auth/auth';
import type { Announcement } from '../components/Announcements';
import type { UpcomingEvent } from './events';

const fetcher = async <T,>(path: string): Promise<T> => {
  const r = await api<T>('GET', path);
  if (!r.ok) throw new Error(r.error);
  return r.data;
};
const OPTS = { refreshInterval: 30_000, revalidateOnFocus: true, dedupingInterval: 5_000, keepPreviousData: true } as const;

function useLive<T>(path: string) {
  const approved = useApproved();
  return useSWR<T>(authEnabled && approved ? path : null, fetcher, OPTS);
}

export const useAnnouncements = () => useLive<{ announcements: Announcement[] }>('/announcements');
export const useEventsData = () => useLive<{ events: UpcomingEvent[] }>('/events');

/** After an admin change: every open view updates now (others within 30 s). */
export const refreshAnnouncements = () => mutate('/announcements');
export const setEvents = (events: UpcomingEvent[]) => mutate('/events', { events }, { revalidate: false });
