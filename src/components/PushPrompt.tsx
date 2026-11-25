/**
 * Asks every member, by itself, to turn on notifications on this device: a card slides in a few seconds after
 * sign-in; one tap on "Activer" shows the browser's permission prompt (browsers only allow it after a tap).
 * Not shown again for 7 days after "Plus tard", never when already allowed / blocked or when the server has no keys.
 * Computers only (mouse / trackpad, wide screen): on phones notifications are turned on from the bell.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, authEnabled, useApproved, useAuth } from '../auth/auth';
import { useT } from '../hooks/useT';
import { enablePush, pushSupported } from '../lib/push';
import { Icon } from './Icon';

const LATER_KEY = 'g22-push-later';
const WEEK = 7 * 86_400_000;

const isComputer = () => window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;

export function PushPrompt() {
  const { t } = useT();
  const approved = useApproved();
  const user = useAuth((s) => s.user);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authEnabled || !approved || !user || !isComputer()) return;
    if (Date.now() - Number(localStorage.getItem(LATER_KEY) ?? 0) < WEEK) return;
    let live = true;
    const id = setTimeout(async () => {
      if (!pushSupported() || Notification.permission !== 'default') return;
      const k = await api<{ key: string | null }>('GET', '/push/key');
      if (live && k.ok && k.data.key) setShow(true);
    }, 2500);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [approved, user]);

  const later = () => {
    localStorage.setItem(LATER_KEY, String(Date.now()));
    setShow(false);
  };
  const enable = async () => {
    setBusy(true);
    const ok = await enablePush(true).catch(() => false);
    setBusy(false);
    setShow(false);
    if (ok) toast.success(t('notif.on'));
    else if (typeof Notification !== 'undefined' && Notification.permission === 'denied') toast.error(t('notif.denied'));
    else localStorage.setItem(LATER_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-labelledby="push-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-5 left-5 z-[70] w-[26rem] rounded-2xl border border-line bg-surface p-4 shadow-[0_18px_50px_-12px_rgba(11,36,64,0.45)]"
          data-testid="push-prompt"
        >
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white">
              <Icon name="bell" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div id="push-title" className="font-display text-[15px] font-bold leading-snug">
                {t('push.title')}
              </div>
              <p className="mt-0.5 text-sm text-muted">{t('push.sub')}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="btn-ghost btn-sm" onClick={later} data-testid="push-later">
              {t('push.later')}
            </button>
            <button className="btn-primary btn-sm" onClick={() => void enable()} disabled={busy} data-testid="push-enable">
              <Icon name="bell" size={14} /> {t('push.enable')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
