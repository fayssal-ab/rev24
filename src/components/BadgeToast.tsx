import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/store';
import { useT } from '../hooks/useT';
import { Icon } from './Icon';
import type { UIKey } from '../i18n/ui';
import { confetti } from './confetti';

export function BadgeToast() {
  const { t } = useT();
  const last = useStore((s) => s.lastBadge);
  const clear = useStore((s) => s.clearLastBadge);
  useEffect(() => {
    if (!last) return;
    confetti();
    const id = setTimeout(clear, 3500);
    return () => clearTimeout(id);
  }, [last, clear]);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4">
      <AnimatePresence>
        {last && (
          <motion.div initial={{ y: -20, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0 }} className="card pointer-events-auto flex items-center gap-3 px-4 py-3 shadow-xl">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-bg">
              <Icon name="star" />
            </span>
            <div>
              <div className="text-xs text-muted">{t('badge.unlocked')}</div>
              <div className="font-semibold">{t(`badge.${last}` as UIKey)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
