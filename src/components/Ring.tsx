import { motion, useReducedMotion } from 'framer-motion';

/** Animated mastery ring (0–100). */
export function Ring({ value, size = 56, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const reduce = useReducedMotion();
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(v)} %`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--line))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v / 100) }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums">{Math.round(v)}%</span>
    </div>
  );
}

export function Bar({ value, className = '' }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-surface2 ${className}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2" initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} transition={reduce ? { duration: 0 } : { duration: 0.7 }} />
    </div>
  );
}
