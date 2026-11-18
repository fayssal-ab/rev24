import { useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useT } from '../hooks/useT';
import { Icon } from '../components/Icon';

export function useStepper(n: number, interval = 3500) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((x) => (x + 1 >= n ? (setAuto(false), x) : x + 1)), reduce ? interval * 1.5 : interval);
    return () => clearInterval(id);
  }, [auto, n, interval, reduce]);
  return { i, setI, auto, setAuto, prev: () => setI((x) => Math.max(0, x - 1)), next: () => setI((x) => Math.min(n - 1, x + 1)) };
}

export function StepperControls({ s, n }: { s: ReturnType<typeof useStepper>; n: number }) {
  const { t } = useT();
  return (
    <div className="flex items-center gap-2">
      <button className="btn-ghost btn-sm" onClick={s.prev} disabled={s.i === 0} aria-label={t('common.prev')}>
        <Icon name="left" size={16} />
      </button>
      <span className="min-w-[60px] text-center font-mono text-xs text-muted">
        {t('common.step')} {s.i + 1}/{n}
      </span>
      <button className="btn-ghost btn-sm" onClick={s.next} disabled={s.i === n - 1} aria-label={t('common.next')}>
        <Icon name="right" size={16} />
      </button>
      <button className="btn-ghost btn-sm" onClick={() => (s.i === n - 1 ? (s.setI(0), s.setAuto(true)) : s.setAuto(!s.auto))} aria-pressed={s.auto} aria-label={t('anim.auto')}>
        <Icon name={s.auto ? 'pause' : 'play'} size={16} /> <span className="hidden sm:inline">{s.auto ? t('common.pause') : t('anim.auto')}</span>
      </button>
    </div>
  );
}

export function AnimCard({ title, children, className = '' }: { title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <figure className={`card overflow-hidden ${className}`}>
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-2 text-sm font-semibold">
        <span className="h-2 w-2 rounded-full bg-accent" /> {title}
      </figcaption>
      <div className="p-4">{children}</div>
    </figure>
  );
}
