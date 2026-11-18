import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { L } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { ROOTRESET } from '../../i18n/animLinux';
import { AnimCard, StepperControls, useStepper } from '../Stepper';

export default function RootPasswordReset() {
  const tl = useL();
  const { t } = useT();
  const n = ROOTRESET.steps.length;
  const s = useStepper(n, 4000);
  const prompt = s.i <= 2 ? 'GRUB' : s.i <= 3 || s.i === 7 ? 'switch_root:/#' : s.i === 8 ? 'switch_root:/#' : 'sh-5.1#';
  return (
    <AnimCard title={tl(ROOTRESET.title)}>
      <div className="term mb-3 min-h-[150px] rounded-xl bg-[#0b1020] p-3 text-[12px] text-slate-200">
        {ROOTRESET.steps.slice(0, s.i + 1).map((st, k) => (
          <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: k === s.i ? 1 : 0.55 }}>
            <span className={k <= 2 ? 'text-amber-300' : 'text-rose-300'}>{k <= 2 ? '[GRUB]' : k <= 3 || k >= 7 ? 'switch_root:/#' : 'sh-5.1#'}</span> {st.cmd}
          </motion.div>
        ))}
        <span className="animate-pulse">▌</span>
        <span className="sr-only">{prompt}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s.i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="min-h-[90px]">
          <span className="chip mb-1">
            {t('common.step')} {s.i + 1}
          </span>
          <L v={ROOTRESET.steps[s.i].text} md />
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <StepperControls s={s} n={n} />
        <Link to="/terminal?mission=m-root-reset" className="btn-primary btn-sm">
          <Icon name="terminal" size={14} /> {t('anim.tryTerminal')}
        </Link>
      </div>
    </AnimCard>
  );
}
