import { useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { UNITS } from '../../i18n/animMobile';

const DENSITIES = [
  { name: 'mdpi', dpi: 160 },
  { name: 'hdpi', dpi: 240 },
  { name: 'xhdpi', dpi: 320 },
  { name: 'xxhdpi', dpi: 480 },
  { name: 'xxxhdpi', dpi: 640 }
];
/** on-screen scale of the mock: 1 dp is drawn as 1 CSS px, whatever the simulated density */
type Dim = 'wrap_content' | 'match_parent';

export default function AndroidUnits() {
  const tl = useL();
  const [d, setD] = useState(2);
  const [big, setBig] = useState(false);
  const [w, setW] = useState<Dim>('match_parent');
  const [h, setH] = useState<Dim>('wrap_content');
  const dens = DENSITIES[d].dpi / 160;
  const font = big ? 1.3 : 1;
  const dpPx = Math.round(48 * dens);
  const spPx = Math.round(18 * dens * font);
  const rawApparent = 48 / dens;

  const Row = ({ label, value, px, note, size }: { label: string; value: string; px: number; note: string; size: number }) => (
    <div className="flex items-center gap-3 rounded-xl border border-line p-2">
      <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-lg bg-surface2">
        <motion.div animate={{ width: size, height: size }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} className="rounded bg-accent" />
      </div>
      <div className="min-w-0 text-sm">
        <div className="font-mono font-semibold">{label} = {value}</div>
        <div className="font-mono text-xs text-muted">
          → {px} {tl(UNITS.pixels)}
        </div>
        <div className="text-xs">{note}</div>
      </div>
    </div>
  );

  return (
    <AnimCard title={tl(UNITS.title)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-semibold text-muted">{tl(UNITS.density)}</div>
          <div className="flex flex-wrap gap-1">
            {DENSITIES.map((x, k) => (
              <button key={x.name} className={`btn-sm font-mono ${k === d ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={k === d} onClick={() => setD(k)}>
                {x.name} <span className="opacity-70">{x.dpi}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-muted">{tl(UNITS.font)}</div>
          <div className="flex gap-1">
            <button className={`btn-sm ${!big ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={!big} onClick={() => setBig(false)}>
              {tl(UNITS.normal)} ×1
            </button>
            <button className={`btn-sm ${big ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={big} onClick={() => setBig(true)}>
              {tl(UNITS.large)} ×1,3
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Row label="layout_width" value="48dp" px={dpPx} size={48} note={tl(UNITS.same)} />
        <Row label="layout_width" value="48px" px={48} size={rawApparent} note={tl(UNITS.shrinks)} />
        <div className="flex items-center gap-3 rounded-xl border border-line p-2">
          <div className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-lg bg-surface2">
            <motion.span animate={{ fontSize: 18 * font }} className="font-semibold leading-none">
              Aa
            </motion.span>
          </div>
          <div className="min-w-0 text-sm">
            <div className="font-mono font-semibold">textSize = 18sp</div>
            <div className="font-mono text-xs text-muted">
              → {spPx} {tl(UNITS.pixels)}
            </div>
            <div className="text-xs">{tl(UNITS.follows)}</div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        <L v={UNITS.formula} />
      </p>

      <h4 className="mt-5 font-semibold">{tl(UNITS.layoutTitle)}</h4>
      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="space-y-2">
          {([
            [tl(UNITS.width), w, setW],
            [tl(UNITS.height), h, setH]
          ] as const).map(([label, v, set]) => (
            <div key={label}>
              <div className="mb-1 text-xs font-semibold text-muted">android:layout_{label === tl(UNITS.width) ? 'width' : 'height'}</div>
              <div className="flex flex-wrap gap-1">
                {(['wrap_content', 'match_parent'] as Dim[]).map((x) => (
                  <button key={x} className={`btn-sm font-mono ${v === x ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={v === x} onClick={() => set(x)}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-1 rounded-xl bg-surface2 p-3 text-sm">
            <L v={UNITS.explain.wrap} md />
            <L v={UNITS.explain.match} md />
          </div>
        </div>
        <div className="mx-auto flex h-[260px] w-[150px] flex-col rounded-[22px] border-4 border-navy/80 bg-surface p-2 dark:border-accent2/60" aria-hidden>
          <div className="mb-1 h-1.5 w-10 self-center rounded-full bg-line" />
          <div className="flex flex-1 flex-col items-start rounded-lg border border-dashed border-line p-1.5">
            <div className="mb-1 font-mono text-[8px] text-muted">LinearLayout (vertical)</div>
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className={`grid place-items-center rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white dark:text-bg ${w === 'match_parent' ? 'w-full' : 'w-auto'} ${h === 'match_parent' ? 'flex-1' : ''}`}
            >
              {tl(UNITS.button)}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimCard>
  );
}
