import { AnimatePresence, motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { L } from '../../components/Text';
import { BOOT } from '../../i18n/animLinux';
import { AnimCard, StepperControls, useStepper } from '../Stepper';

export default function BootSequence() {
  const tl = useL();
  const { t } = useT();
  const n = BOOT.steps.length;
  const s = useStepper(n);
  const step = BOOT.steps[s.i];
  return (
    <AnimCard title={tl(BOOT.title)}>
      <ol className="scroll-thin -mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0" role="tablist">
        {BOOT.steps.map((st, k) => (
          <li key={k} className="relative w-[6.5rem] shrink-0 sm:w-auto">
            <button role="tab" aria-selected={k === s.i} onClick={() => s.setI(k)} className={`w-full rounded-xl border px-1 py-2 text-[11px] font-semibold leading-tight transition sm:text-xs ${k === s.i ? 'border-accent bg-accent text-bg' : k < s.i ? 'border-accent/50 bg-accent/10' : 'border-line bg-surface2 text-muted'}`}>
              {tl(st.name)}
            </button>
            {k < n - 1 && (
              <motion.span className="absolute -right-1 top-1/2 z-10 h-0.5 w-2 bg-accent" initial={false} animate={{ opacity: k < s.i ? 1 : 0.2 }} />
            )}
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={s.i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="min-h-[150px]">
          <L v={step.text} md />
          <div className="mt-2 text-xs font-semibold uppercase text-muted">{t('anim.files')}</div>
          <ul className="mt-1 flex flex-wrap gap-1">
            {step.files.map((f) => (
              <li key={f}>
                <code className="rounded bg-[#0b1020] px-2 py-0.5 font-mono text-[11px] text-emerald-300">{f}</code>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
      <div className="mt-3">
        <StepperControls s={s} n={n} />
      </div>
    </AnimCard>
  );
}
