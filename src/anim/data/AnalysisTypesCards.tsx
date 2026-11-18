import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { TYPES } from '../../i18n/animData';
import { AnimCard } from '../Stepper';
import { shuffle } from '../../lib/quiz';
import { confetti } from '../../components/confetti';

export default function AnalysisTypesCards() {
  const tl = useL();
  const { t } = useT();
  const methods = useMemo(() => shuffle(TYPES.methods.map((m, i) => ({ ...m, i }))), []);
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const drop = (mi: number, card: string) => {
    const m = TYPES.methods[mi];
    if (m.a === card) {
      const next = { ...placed, [mi]: card };
      setPlaced(next);
      if (Object.keys(next).length === TYPES.methods.length) confetti();
    } else {
      setWrong(mi);
      setTimeout(() => setWrong(null), 600);
    }
    setPicked(null);
  };
  const done = Object.keys(placed).length === TYPES.methods.length;
  return (
    <AnimCard title={tl(TYPES.title)}>
      <p className="mb-3 text-sm text-muted">{t('anim.dragHint')}</p>
      <div className="mb-3 flex min-h-[44px] flex-wrap gap-1.5">
        {methods
          .filter((m) => placed[m.i] === undefined)
          .map((m) => (
            <motion.button
              key={m.i}
              draggable
              onDragStart={(e) => (e as unknown as DragEvent).dataTransfer?.setData('text/plain', String(m.i))}
              onClick={() => setPicked(picked === m.i ? null : m.i)}
              animate={wrong === m.i ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              className={`chip cursor-grab !text-xs ${picked === m.i ? '!border-accent !bg-accent !text-bg' : wrong === m.i ? '!border-bad !text-bad' : ''}`}
            >
              {tl(m.m)}
            </motion.button>
          ))}
        {done && <span className="text-sm font-semibold text-ok">✓ {tl(TYPES.done)}</span>}
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {TYPES.cards.map((c) => (
          <div
            key={c.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              drop(+e.dataTransfer.getData('text/plain'), c.id);
            }}
            onClick={() => picked !== null && drop(picked, c.id)}
            className={`min-h-[120px] rounded-xl border-2 border-dashed p-2 transition ${picked !== null ? 'border-accent/70 bg-accent/5' : 'border-line'}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && picked !== null && drop(picked, c.id)}
          >
            <div className="text-sm font-bold text-accent">{tl(c.n)}</div>
            <div className="mb-1 text-[11px] text-muted">{tl(c.q)}</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(placed)
                .filter(([, v]) => v === c.id)
                .map(([k]) => (
                  <motion.span key={k} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="rounded-md bg-ok/20 px-1.5 py-0.5 text-[11px] text-ok">
                    {tl(TYPES.methods[+k].m)}
                  </motion.span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </AnimCard>
  );
}
