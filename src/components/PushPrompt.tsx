/**
 * Asks every member, by itself, to turn on notifications on this device: a card slides in a few seconds after
 * sign-in; one tap on "Activer" shows the browser's permission prompt (browsers only allow it after a tap).
 * Not shown again for 7 days after "Plus tard", never when already allowed / blocked or when the server has no keys.
 * iPhone outside the home-screen app: explains how to add it first (push only works there).
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

const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent);
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

export function PushPrompt() {
  const { t } = useT();
  const approved = useApproved();
  const user = useAuth((s) => s.user);
  const [mode, setMode] = useState<'ask' | 'ios' | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authEnabled || !approved || !user) return;
    if (Date.now() - Number(localStorage.getItem(LATER_KEY) ?? 0) < WEEK) return;
    let live = true;
    const id = setTimeout(async () => {
      // iPhone in Safari: push needs the home-screen app
      if (isIos() && !standalone()) return live && setMode('ios');
      if (!pushSupported() || Notification.permission !== 'default') return;
      const k = await api<{ key: string | null }>('GET', '/push/key');
      if (live && k.ok && k.data.key) setMode('ask');
    }, 2500);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [approved, user]);

  const later = () => {
    localStorage.setItem(LATER_KEY, String(Date.now()));
    setMode(null);
  };
  const enable = async () => {
    setBusy(true);
    const ok = await enablePush(true).catch(() => false);
    setBusy(false);
    setMode(null);
    if (ok) toast.success(t('notif.on'));
    else if (typeof Notification !== 'undefined' && Notification.permission === 'denied') toast.error(t('notif.denied'));
    else localStorage.setItem(LATER_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          role="dialog"
          aria-labelledby="push-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-2xl border border-line bg-surface p-4 shadow-[0_18px_50px_-12px_rgba(11,36,64,0.45)] sm:bottom-5 sm:left-5 sm:right-auto sm:mx-0"
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
              <p className="mt-0.5 text-sm text-muted">{mode === 'ios' ? t('notif.ios') : t('push.sub')}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="btn-ghost btn-sm" onClick={later} data-testid="push-later">
              {mode === 'ios' ? t('common.close') : t('push.later')}
            </button>
            {mode === 'ask' && (
              <button className="btn-primary btn-sm" onClick={() => void enable()} disabled={busy} data-testid="push-enable">
                <Icon name="bell" size={14} /> {t('push.enable')}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
