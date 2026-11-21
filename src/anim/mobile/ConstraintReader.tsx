import { useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L, Code } from '../../components/Text';
import { AnimCard } from '../Stepper';
import { CONSTRAINT } from '../../i18n/animMobile';
import { useStore } from '../../store/store';

type V = keyof typeof CONSTRAINT.views;

const XML: Record<V, string> = {
  titre: `<TextView
    android:id="@+id/titre"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginTop="32dp"
    android:text="@string/titre"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent" />`,
  champ: `<EditText
    android:id="@+id/champ"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_marginStart="16dp"
    android:layout_marginEnd="16dp"
    android:layout_marginTop="16dp"
    app:layout_constraintTop_toBottomOf="@id/titre"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent" />`,
  bouton: `<Button
    android:id="@+id/bouton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginTop="8dp"
    android:text="@string/envoyer"
    app:layout_constraintTop_toBottomOf="@id/champ"
    app:layout_constraintEnd_toEndOf="@id/champ" />`
};

/** Phone mock: tap a view to read its constraints; change the title bias; remove the button's horizontal constraint. */
export default function ConstraintReader() {
  const tl = useL();
  const lang = useStore((s) => s.lang);
  const [sel, setSel] = useState<V | null>(null);
  const [bias, setBias] = useState(0.5);
  const [hOn, setHOn] = useState(true);
  const W = 200;
  const TW = 80;
  const ring = (v: V) => (sel === v ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : '');
  const target = (v: V) => sel && ((sel === 'champ' && v === 'titre') || (sel === 'bouton' && v === 'champ'));

  return (
    <AnimCard title={tl(CONSTRAINT.title)}>
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <div className={`relative h-[220px] rounded-[22px] border-4 border-navy/80 bg-surface dark:border-accent2/60 ${sel ? 'outline-dashed outline-1 outline-offset-[-10px] outline-accent/50' : ''}`} style={{ width: W + 8 }}>
            <span className="absolute left-3 top-2 font-mono text-[8px] text-muted">parent</span>
            <motion.button
              onClick={() => setSel('titre')}
              animate={{ left: 4 + (W - TW) * bias }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className={`absolute top-[28px] rounded px-1 py-0.5 text-center text-sm font-bold ${ring('titre')} ${target('titre') ? 'bg-accent/15' : ''}`}
              style={{ width: TW }}
            >
              {tl(CONSTRAINT.views.titre.label)}
            </motion.button>
            <button
              onClick={() => setSel('champ')}
              className={`absolute left-[20px] right-[20px] top-[68px] rounded border border-line bg-surface2 px-2 py-1.5 text-left text-xs text-muted ${ring('champ')} ${target('champ') ? 'bg-accent/15' : ''}`}
            >
              EditText
            </button>
            <motion.button
              onClick={() => setSel('bouton')}
              animate={hOn ? { right: 20, left: 'auto' } : { left: 4, right: 'auto' }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className={`absolute top-[110px] rounded bg-accent px-3 py-1 text-xs font-semibold text-white dark:text-bg ${ring('bouton')}`}
            >
              {lang === 'en' ? 'Send' : 'Envoyer'}
            </motion.button>
          </div>
          <div className="mt-3 space-y-2 text-xs" style={{ width: W + 8 }}>
            <label className="block">
              <span className="font-semibold text-muted">{tl(CONSTRAINT.bias)} : {bias.toFixed(1).replace('.', lang === 'en' ? '.' : ',')}</span>
              <input type="range" min={0} max={1} step={0.1} value={bias} onChange={(e) => setBias(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </label>
            <button className="btn-ghost btn-sm w-full justify-center" aria-pressed={!hOn} onClick={() => setHOn(!hOn)}>
              {tl(CONSTRAINT.hConstraint)} : {hOn ? tl(CONSTRAINT.on) : tl(CONSTRAINT.off)}
            </button>
          </div>
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(CONSTRAINT.views) as V[]).map((v) => (
              <button key={v} className={`btn-sm ${sel === v ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={sel === v} onClick={() => setSel(v)}>
                {tl(CONSTRAINT.views[v].label)}
              </button>
            ))}
          </div>
          {!sel ? (
            <p className="rounded-xl bg-surface2 p-3 text-sm text-muted">{tl(CONSTRAINT.pick)}</p>
          ) : (
            <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <Code code={XML[sel]} lang="xml" className="!m-0 text-[11.5px]" />
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{tl(CONSTRAINT.reading)}</div>
              <ul className="space-y-1.5">
                {CONSTRAINT.views[sel].lines.map((x) => (
                  <li key={x.attr} className="rounded-lg border border-line p-2 text-sm">
                    <code className="block whitespace-pre-wrap font-mono text-[11px] text-accent">{x.attr}</code>
                    <L v={x} md />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {!hOn && (
            <div className="rounded-xl border border-bad/40 bg-bad/10 p-3 text-sm">
              <L v={CONSTRAINT.offNote} md />
            </div>
          )}
        </div>
      </div>
    </AnimCard>
  );
}
