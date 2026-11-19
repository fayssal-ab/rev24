import { motion, AnimatePresence } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { PIPE } from '../../i18n/animData';
import { AnimCard, StepperControls, useStepper } from '../Stepper';
import { Icon } from '../../components/Icon';

const ICONS = ['inbox', 'broom', 'search', 'sigma', 'bulb'];

export default function DataPipeline() {
  const tl = useL();
  const s = useStepper(PIPE.steps.length, 3000);
  return (
    <AnimCard title={tl(PIPE.title)}>
      <div className="relative mb-4 flex items-center justify-between">
        <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded bg-line" />
        <motion.div className="absolute left-4 top-1/2 h-1 -translate-y-1/2 rounded bg-accent" initial={false} animate={{ width: `calc(${(s.i / (PIPE.steps.length - 1)) * 100}% - ${(s.i / (PIPE.steps.length - 1)) * 32}px)` }} />
        {PIPE.steps.map((st, k) => (
          <button key={k} onClick={() => s.setI(k)} className="relative z-10 flex flex-col items-center gap-1" aria-pressed={k === s.i}>
            <motion.span animate={{ scale: k === s.i ? 1.2 : 1 }} className={`grid h-11 w-11 place-items-center rounded-full border-2 text-lg ${k <= s.i ? 'border-accent bg-surface' : 'border-line bg-surface2'}`}>
              <Icon name={ICONS[k]} size={19} className={k <= s.i ? 'text-accent' : 'text-muted'} />
            </motion.span>
            <span className={`text-[10px] font-semibold sm:text-xs ${k === s.i ? 'text-accent' : 'text-muted'}`}>{tl(st.n)}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s.i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="min-h-[70px] rounded-xl bg-surface2 p-3 text-sm">
          <span className="font-semibold">
            {s.i + 1}. {tl(PIPE.steps[s.i].n)} —{' '}
          </span>
          <L v={PIPE.steps[s.i].t} />
        </motion.div>
      </AnimatePresence>
      <div className="mt-3">
        <StepperControls s={s} n={PIPE.steps.length} />
      </div>
    </AnimCard>
  );
}
