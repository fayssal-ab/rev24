import { useEffect, useState } from 'react';
import { api, authEnabled, useApproved } from '../auth/auth';
import { Icon } from './Icon';
import { useT } from '../hooks/useT';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

/** Messages posted by the admin, shown at the top of the home page. */
export function Announcements() {
  const { t, lang } = useT();
  const approved = useApproved();
  const [list, setList] = useState<Announcement[]>([]);
  useEffect(() => {
    if (!authEnabled || !approved) return;
    void api<{ announcements: Announcement[] }>('GET', '/announcements').then((r) => r.ok && setList(r.data.announcements.slice(0, 3)));
  }, [approved]);
  if (!list.length) return null;
  return (
    <section aria-label={t('ann.title')} className="space-y-2">
      {list.map((a) => (
        <article key={a.id} className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${a.pinned ? 'border-accent/40 bg-accent/5' : 'border-line bg-surface'}`}>
          <Icon name={a.pinned ? 'flag' : 'bell'} size={18} className="mt-0.5 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 className="font-semibold">{a.title}</h2>
              <span className="font-mono text-[11px] text-muted">{new Date(a.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short' })}</span>
            </div>
            {a.body && <p className="mt-0.5 whitespace-pre-line text-sm text-muted">{a.body}</p>}
          </div>
        </article>
      ))}
    </section>
  );
}
