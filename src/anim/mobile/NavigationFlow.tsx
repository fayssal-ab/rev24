import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L, Code } from '../../components/Text';
import { AnimCard, StepperControls, useStepper } from '../Stepper';
import { NAV_FLOW } from '../../i18n/animMobile';

/** Explicit Intent from A to B: build it, add extras, start, read them in B, send a result back. */
export default function NavigationFlow() {
  const tl = useL();
  const n = NAV_FLOW.steps.length;
  const s = useStepper(n, 4500);
  const st = NAV_FLOW.steps[s.i];
  const onB = st.who === 'DetailActivity';
  const travelling = st.who === 'Android';
  const back = s.i === n - 1;
  const showExtras = s.i >= 1;

  const Screen = ({ name, active, children }: { name: string; active: boolean; children: React.ReactNode }) => (
    <div className={`flex h-[150px] w-[110px] shrink-0 flex-col rounded-[18px] border-4 p-1.5 transition-colors sm:w-[130px] ${active ? 'border-accent' : 'border-line opacity-70'}`}>
      <div className="mb-1 h-1 w-8 self-center rounded-full bg-line" />
      <div className="truncate text-center font-mono text-[9px] font-semibold">{name}</div>
      <div className="mt-1 flex flex-1 flex-col gap-1 rounded-md bg-surface2 p-1.5 text-[10px]">{children}</div>
    </div>
  );

  return (
    <AnimCard title={tl(NAV_FLOW.title)}>
      <div className="flex items-center justify-between gap-2">
        <Screen name="MainActivity (A)" active={!onB && !travelling}>
          <div className="rounded bg-surface px-1 py-0.5">Sara</div>
          <div className="rounded bg-surface px-1 py-0.5">Youssef</div>
          <div className="rounded bg-surface px-1 py-0.5">Imane</div>
        </Screen>
        <div className="relative flex h-[150px] flex-1 items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-line" />
          <motion.div
            animate={{ x: back ? -30 : onB ? 30 : travelling ? 0 : -30 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="relative z-10 rounded-lg border border-accent bg-surface px-2 py-1 text-center font-mono text-[10px] shadow-sm"
          >
            <div className="font-semibold text-accent">{back ? 'result' : 'Intent'}</div>
            {showExtras && !back && (
              <div className="text-muted">
                nom=&quot;Sara&quot;
                <br />
                age=21
              </div>
            )}
            {back && <div className="text-muted">favori=true</div>}
          </motion.div>
        </div>
        <Screen name="DetailActivity (B)" active={onB}>
          {onB ? (
            <>
              <div className="font-semibold">Sara</div>
              <div>21 ans</div>
              <div className="mt-auto rounded bg-accent px-1 py-0.5 text-center text-white dark:text-bg">★</div>
            </>
          ) : (
            <div className="m-auto text-muted">—</div>
          )}
        </Screen>
      </div>
      <motion.div key={s.i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 grid gap-3">
        <div className="rounded-xl bg-surface2 p-3 text-sm">
          <span className="chip mb-1 font-mono">{st.who}</span>
          <L v={st.text} md />
        </div>
        <Code code={st.code} lang="java" className="!m-0 text-[12px]" />
      </motion.div>
      <div className="mt-3">
        <StepperControls s={s} n={n} />
      </div>
      <p className="mt-3 border-l-2 border-accent pl-3 text-sm">
        <L v={NAV_FLOW.rule} md />
      </p>
    </AnimCard>
  );
}
