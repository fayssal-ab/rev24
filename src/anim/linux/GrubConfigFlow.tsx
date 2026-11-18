import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { GRUBFLOW } from '../../i18n/animLinux';
import { AnimCard, StepperControls, useStepper } from '../Stepper';

const BOXES = [
  { id: 0, label: '/etc/default/grub.bak', x: 10, y: 10 },
  { id: 1, label: '/etc/default/grub', x: 10, y: 70 },
  { id: 2, label: '/etc/grub.d/00_header … 40_custom', x: 10, y: 130 },
  { id: 3, label: 'grub2-mkconfig -o /boot/grub2/grub.cfg', x: 10, y: 190 },
  { id: 4, label: '/boot/grub2/grub.cfg  +  /boot/loader/entries/*.conf', x: 10, y: 250 }
];

export default function GrubConfigFlow() {
  const tl = useL();
  const s = useStepper(GRUBFLOW.steps.length);
  return (
    <AnimCard title={tl(GRUBFLOW.title)}>
      <svg viewBox="0 0 340 300" className="mx-auto mb-3 w-full max-w-md" role="img" aria-label={tl(GRUBFLOW.title)}>
        {BOXES.map((b, k) => (
          <g key={b.id}>
            {k > 0 && <motion.line x1={170} x2={170} y1={b.y - 22} y2={b.y} stroke="rgb(var(--accent))" strokeWidth={2} initial={false} animate={{ opacity: s.i >= k ? 1 : 0.2 }} markerEnd="url(#arr)" />}
            <motion.rect x={b.x} y={b.y} width={320} height={38} rx={10} initial={false} animate={{ fill: s.i === k ? 'rgb(var(--accent))' : 'rgb(var(--surface2))', stroke: s.i >= k ? 'rgb(var(--accent))' : 'rgb(var(--line))' }} strokeWidth={1.5} />
            <text x={170} y={b.y + 24} textAnchor="middle" className="font-mono" fontSize={11} fill={s.i === k ? 'rgb(var(--bg))' : 'rgb(var(--fg))'}>
              {b.label}
            </text>
          </g>
        ))}
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,0 L5,10 z" fill="rgb(var(--accent))" />
          </marker>
        </defs>
      </svg>
      <div className="min-h-[80px] text-sm">
        <L v={GRUBFLOW.steps[s.i]} md />
      </div>
      <div className="mt-2">
        <StepperControls s={s} n={GRUBFLOW.steps.length} />
      </div>
    </AnimCard>
  );
}
