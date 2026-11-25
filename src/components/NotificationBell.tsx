/**
 * Bell in the top bar: new announcements and newly posted tests / exams / lab reports.
 * - red counter for what was posted since the bell was last opened (remembered on the device)
 * - browser notification while the site is open (after the member allows it), checked every minute
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { authEnabled, useApproved, useAuth } from '../auth/auth';
import { useT, useL } from '../hooks/useT';
import { getModule } from '../lib/content';
import { Icon } from './Icon';
import { useAnnouncements, useEventsData } from '../lib/live';
import type { UpcomingEvent } from '../lib/events';
import { toast } from 'sonner';
import { enablePush, pushActive, pushSupported, syncPush } from '../lib/push';

const SEEN_KEY = 'g22-notif-seen';
const NOTIFIED_KEY = 'g22-notif-notified';

type Item = { id: string; kind: 'ann' | UpcomingEvent['kind']; title: string; body: string; at: number; date?: string };

const readNum = (k: string, fallback: number) => {
  const v = Number(localStorage.getItem(k));
  return Number.isFinite(v) && v > 0 ? v : fallback;
};

export function NotificationBell() {
  const approved = useApproved();
  const user = useAuth((s) => s.user);
  if (!authEnabled || !approved || !user) return null;
  return <Bell />;
}

function Bell() {
  const { t, lang } = useT();
  const tl = useL();
  const { pathname } = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  // first visit: what was posted in the last 7 days counts as new
  const [seen, setSeen] = useState(() => readNum(SEEN_KEY, Date.now() - 7 * 86_400_000));
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>(() => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [pathname]);

  const kindLabel = useCallback((k: Item['kind']) => (k === 'ann' ? t('notif.ann') : t(`up.kind.${k}`)), [t]);

  // live data shared with the home page (SWR, refreshed every 30 s and on focus)
  const anns = useAnnouncements().data?.announcements;
  const evs = useEventsData().data?.events;
  useEffect(() => {
    if (!anns && !evs) return;
    const list: Item[] = [];
    for (const x of anns ?? []) list.push({ id: `a-${x.id}`, kind: 'ann', title: x.title, body: x.body, at: new Date(x.createdAt).getTime() });
    for (const x of evs ?? []) {
      const mod = getModule(x.module);
      list.push({ id: `e-${x.id}`, kind: x.kind, title: mod ? tl(mod.title) : x.module, body: x.message, at: new Date(x.createdAt).getTime(), date: x.date });
    }
    list.sort((x, y) => y.at - x.at);
    setItems(list);
    // browser notification for what appeared since the last notification (never for older items)
    const notified = readNum(NOTIFIED_KEY, Date.now());
    if (!localStorage.getItem(NOTIFIED_KEY)) localStorage.setItem(NOTIFIED_KEY, String(Date.now()));
    const fresh = list.filter((x) => x.at > notified);
    if (fresh.length) {
      localStorage.setItem(NOTIFIED_KEY, String(Math.max(...fresh.map((x) => x.at))));
      // with Web Push on, the service worker already shows it: no duplicate from the page
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && !pushActive())
        for (const x of fresh.slice(0, 3)) new Notification(`${kindLabel(x.kind)} · ${x.title}`, { body: x.body.slice(0, 140), icon: '/icon-192.png', tag: x.id });
    }
  }, [anns, evs, kindLabel, tl]);

  useEffect(() => {
    if (!open) return;
    const now = Date.now();
    setSeen(now);
    localStorage.setItem(SEEN_KEY, String(now));
    const onDoc = (e: MouseEvent | TouchEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unread = items.filter((x) => x.at > seen).length;
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  const [pushOn, setPushOn] = useState(pushActive);
  useEffect(() => {
    void syncPush().then(() => setPushOn(pushActive()));
  }, []);
  const ask = async () => {
    if (typeof Notification === 'undefined') return;
    const ok = await enablePush(true);
    setPerm(Notification.permission);
    setPushOn(ok);
    if (ok) toast.success(t('notif.on'));
    else if (Notification.permission === 'granted') toast.error(t('notif.unavailable'));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-accent/60"
        aria-label={t('notif.title')}
        aria-expanded={open}
        data-testid="notif-bell"
      >
        <Icon name="bell" size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-bad px-1 text-[10px] font-bold text-white" data-testid="notif-count">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-x-4 top-[4.75rem] z-50 overflow-hidden rounded-xl border border-line bg-surface text-fg shadow-[0_12px_32px_-12px_rgba(20,36,58,0.25)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96"
            data-testid="notif-panel"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-semibold">{t('notif.title')}</span>
              {(perm === 'default' || (perm === 'granted' && !pushOn && pushSupported())) && (
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90" onClick={() => void ask()} data-testid="notif-enable">
                  <Icon name="bell" size={12} /> {t('notif.enable')}
                </button>
              )}
              {perm === 'granted' && pushOn && <span className="text-[11px] font-semibold text-ok">{t('notif.on')}</span>}
              {perm === 'denied' && <span className="text-[11px] text-muted">{t('notif.denied')}</span>}
            </div>
            {!pushSupported() && /iPhone|iPad/.test(navigator.userAgent) && (
              <p className="border-b border-line bg-warn/10 px-4 py-2 text-[11px] text-fg" data-testid="notif-ios">
                {t('notif.ios')}
              </p>
            )}
            <ul data-lenis-prevent className="scroll-thin max-h-[60dvh] divide-y divide-line overflow-y-auto">
              {!items.length && <li className="px-4 py-8 text-center text-sm text-muted">{t('notif.empty')}</li>}
              {items.map((x) => {
                const fresh = x.at > seen;
                const cr = x.kind === 'cr';
                return (
                  <li key={x.id}>
                    <Link to="/" className={`flex gap-3 px-4 py-3 transition hover:bg-surface2 ${fresh ? 'bg-accent/[0.05]' : ''}`}>
                      <Icon name={x.kind === 'ann' ? 'bell' : cr ? 'file' : 'calendar'} size={16} className={`mt-0.5 shrink-0 ${cr ? 'text-bad' : 'text-accent'}`} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${cr ? 'text-bad' : 'text-accent'}`}>{kindLabel(x.kind)}</span>
                          {fresh && <span className="h-1.5 w-1.5 rounded-full bg-bad" />}
                          <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">{new Date(x.at).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
                        </span>
                        <span className="block truncate text-sm font-semibold">
                          {x.title}
                          {x.date && <span className="font-normal text-muted"> · {new Date(`${x.date}T12:00:00`).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })}</span>}
                        </span>
                        {x.body && <span className="mt-0.5 line-clamp-2 text-xs text-muted">{x.body}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
