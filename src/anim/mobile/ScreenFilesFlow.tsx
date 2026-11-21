import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L, Code } from '../../components/Text';
import { AnimCard, StepperControls, useStepper } from '../Stepper';
import { FILES_FLOW } from '../../i18n/animMobile';

/** How the manifest, the Activity, the layout and strings.xml work together to display the first screen. */
export default function ScreenFilesFlow() {
  const tl = useL();
  const n = FILES_FLOW.steps.length;
  const s = useStepper(n, 4200);
  const st = FILES_FLOW.steps[s.i];
  return (
    <AnimCard title={tl(FILES_FLOW.title)}>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FILES_FLOW.steps.map((x, k) => (
          <li key={x.file}>
            <button
              onClick={() => s.setI(k)}
              aria-pressed={k === s.i}
              className={`flex h-full w-full flex-col items-start gap-1 rounded-xl border p-2 text-left transition-colors ${k === s.i ? 'border-accent bg-accent/10' : k < s.i ? 'border-accent/40' : 'border-line'}`}
            >
              <span className={`grid h-6 w-6 place-items-center rounded-full font-mono text-xs font-bold ${k <= s.i ? 'bg-accent text-white dark:text-bg' : 'bg-surface2 text-muted'}`}>{k + 1}</span>
              <span className="break-all font-mono text-[11px] font-semibold sm:text-xs">{x.file}</span>
            </button>
          </li>
        ))}
      </ol>
      <motion.div key={s.i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 grid gap-3">
        <div className="rounded-xl bg-surface2 p-3 text-sm">
          <L v={st.text} md />
        </div>
        <Code code={st.code} lang={s.i === 1 ? 'java' : 'xml'} className="!m-0 text-[12px]" />
      </motion.div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <StepperControls s={s} n={n} />
      </div>
      <p className="mt-3 border-l-2 border-accent pl-3 text-sm font-semibold">
        <L v={FILES_FLOW.rule} md />
      </p>
    </AnimCard>
  );
}
