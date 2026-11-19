import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard, StepperControls, useStepper } from '../Stepper';
import { ORA_START } from '../../i18n/animOracle';

/** The startup staircase of the course: SHUTDOWN → NOMOUNT → MOUNT → OPEN, with what is read at each step. */
export default function OracleStartup() {
  const tl = useL();
  const n = ORA_START.steps.length;
  const s = useStepper(n, 3200);
  const st = ORA_START.steps[s.i];
  return (
    <AnimCard title={tl(ORA_START.title)}>
      <div className="flex items-end gap-1.5 sm:gap-3">
        {ORA_START.steps.map((x, k) => (
          <button key={x.state} onClick={() => s.setI(k)} className="flex flex-1 flex-col items-stretch" aria-pressed={k === s.i}>
            <motion.div
              animate={{ height: 28 + k * 26 }}
              className={`rounded-t-lg border-x border-t transition-colors ${k <= s.i ? 'border-emerald-600 bg-emerald-500/80' : 'border-line bg-surface2'}`}
            />
            <span className={`mt-1 text-center font-mono text-[10px] font-bold sm:text-xs ${k === s.i ? 'text-accent' : 'text-muted'}`}>{x.state}</span>
          </button>
        ))}
      </div>
      <motion.div key={s.i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2 rounded-xl bg-surface2 p-3 text-sm">
        <code className="block rounded bg-[#0b1020] px-2 py-1 font-mono text-xs text-emerald-300">{st.cmd}</code>
        <L v={st.text} md />
        <div className="font-mono text-[11px] text-muted">{st.output}</div>
      </motion.div>
      <div className="mt-3">
        <StepperControls s={s} n={n} />
      </div>
    </AnimCard>
  );
}
