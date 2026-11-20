/**
 * Supports = the built-in files (cours/, see catalog.ts) merged with what the admin manages online:
 *   - new documents (Drive link or any URL)                  → rows without `ref`
 *   - edits / hiding of a built-in file                       → rows with `ref` = the built-in resource id
 * Loaded once from /api/supports after sign-in; without accounts the built-in list is used as is.
 */
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { api, authEnabled, useApproved } from '../auth/auth';
import { RESOURCES, type Resource, type ResourceKind } from './catalog';

export interface RemoteSupport {
  id: string;
  ref: string | null;
  subject: string;
  kind: ResourceKind;
  title: string;
  url: string;
  sort: number;
  hidden: boolean;
  createdAt: string;
}

interface State {
  remote: RemoteSupport[];
  loaded: boolean;
  load: () => Promise<void>;
}

export const useRemoteSupports = create<State>((set) => ({
  remote: [],
  loaded: false,
  load: async () => {
    const r = await api<{ supports: RemoteSupport[] }>('GET', '/supports');
    set({ remote: r.ok ? r.data.supports : [], loaded: true });
  }
}));

const extOf = (url: string) => {
  const m = /\.([a-z0-9]{2,5})(?:[?#]|$)/i.exec(url);
  const e = m?.[1].toLowerCase();
  return e && ['pdf', 'pptx', 'docx', 'xlsx', 'zip'].includes(e) ? e : 'link';
};

/** Applies the admin's rows to the built-in list. */
export function mergeResources(base: Resource[], remote: RemoteSupport[]): Resource[] {
  const byRef = new Map(remote.filter((r) => r.ref).map((r) => [r.ref!, r]));
  const out: Resource[] = [];
  for (const r of base) {
    const o = byRef.get(r.id);
    if (!o) out.push(r);
    else if (!o.hidden) out.push({ ...r, subject: o.subject || r.subject, kind: o.kind || r.kind, title: o.title || r.title, order: o.sort === 500 ? r.order : o.sort });
  }
  for (const x of remote) {
    if (x.ref || x.hidden) continue;
    out.push({ id: `db/${x.id}`, subject: x.subject, kind: x.kind, title: x.title, ext: extOf(x.url), url: x.url, order: x.sort, date: x.createdAt ? x.createdAt.slice(0, 10) : null, pages: null, size: null });
  }
  return out;
}

/** All supports visible to students (built-in + admin). */
export function useResources(): Resource[] {
  const approved = useApproved();
  const { remote, loaded, load } = useRemoteSupports();
  useEffect(() => {
    if (authEnabled && approved && !loaded) void load();
  }, [approved, loaded, load]);
  return useMemo(() => mergeResources(RESOURCES, remote), [remote]);
}
