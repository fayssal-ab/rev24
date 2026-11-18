import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { L } from '../../components/Text';
import { PERM } from '../../i18n/animLinux';
import { AnimCard } from '../Stepper';

const LET = ['r', 'w', 'x'];
const VAL = [4, 2, 1];

export default function PermissionCalculator() {
  const tl = useL();
  const { t } = useT();
  const [bits, setBits] = useState<boolean[]>([true, true, true, true, false, true, true, false, false]); // 754
  const [isDir, setIsDir] = useState(false);
  const digits = [0, 1, 2].map((w) => bits.slice(w * 3, w * 3 + 3).reduce((a, b, k) => a + (b ? VAL[k] : 0), 0));
  const octal = digits.join('');
  const str = (isDir ? 'd' : '-') + bits.map((b, k) => (b ? LET[k % 3] : '-')).join('');
  const sym = ['u', 'g', 'o'].map((w, k) => `${w}=${bits.slice(k * 3, k * 3 + 3).map((b, j) => (b ? LET[j] : '')).join('')}`).join(',');
  const setOctal = (v: string) => {
    if (!/^[0-7]{0,3}$/.test(v) || v.length !== 3) return;
    setBits(v.split('').flatMap((d) => VAL.map((x) => (+d & x) !== 0)));
  };
  return (
    <AnimCard title={tl(PERM.title)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] text-center text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th />
              {PERM.bits.map((b, k) => (
                <th key={k} className="px-1 py-1 font-medium">
                  {tl(b)}
                </th>
              ))}
              <th className="font-mono">=</th>
            </tr>
          </thead>
          <tbody>
            {PERM.who.map((w, row) => (
              <tr key={row}>
                <th className="py-1 pr-2 text-left text-xs font-medium">{tl(w)}</th>
                {[0, 1, 2].map((col) => {
                  const idx = row * 3 + col;
                  return (
                    <td key={col} className="p-1">
                      <button
                        role="checkbox"
                        aria-checked={bits[idx]}
                        aria-label={`${tl(w)} ${LET[col]}`}
                        onClick={() => setBits((b) => b.map((x, k) => (k === idx ? !x : x)))}
                        className={`h-11 w-full rounded-xl border font-mono text-lg font-bold transition ${bits[idx] ? 'border-accent bg-accent text-bg' : 'border-line bg-surface2 text-muted'}`}
                      >
                        {bits[idx] ? LET[col] : '-'}
                        <span className="block text-[9px] font-normal opacity-80">{bits[idx] ? VAL[col] : 0}</span>
                      </button>
                    </td>
                  );
                })}
                <td className="w-12 font-mono text-2xl font-bold text-accent">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={digits[row]} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} className="inline-block">
                      {digits[row]}
                    </motion.span>
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <label className="text-xs text-muted">
          {t('anim.octal')}
          <input className="input mt-1 font-mono text-lg" defaultValue={octal} key={octal} maxLength={3} inputMode="numeric" onChange={(e) => setOctal(e.target.value)} aria-label={t('anim.octal')} />
        </label>
        <div className="text-xs text-muted">
          ls -l
          <div className="mt-1 rounded-xl bg-[#0b1020] px-3 py-2.5 font-mono text-lg text-emerald-300">{str}</div>
        </div>
        <div className="text-xs text-muted">
          {t('anim.symbolic')}
          <div className="mt-1 overflow-x-auto rounded-xl bg-[#0b1020] px-3 py-2.5 font-mono text-[13px] text-cyan-300">
            chmod {octal} f<br />
            chmod {sym} f
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted">{tl(PERM.presets)} :</span>
        {['755', '644', '600', '700', '750', '764', '777'].map((p) => (
          <button key={p} className={`chip font-mono ${p === octal ? '!border-accent !text-fg' : ''}`} onClick={() => setOctal(p)}>
            {p}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-1">
          <input type="checkbox" checked={isDir} onChange={(e) => setIsDir(e.target.checked)} /> d
        </label>
      </div>
      {octal === '777' && <p className="mt-2 text-sm text-bad">{tl(PERM.warn777)}</p>}
      <div className="mt-3 text-sm text-muted">
        <L v={PERM.fileDir} md />
      </div>
    </AnimCard>
  );
}
