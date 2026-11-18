import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { RPMDNF } from '../../i18n/animLinux';
import { AnimCard } from '../Stepper';

const TREE = [
  { n: 'wireshark', d: 0 },
  { n: 'wireshark-cli', d: 1 },
  { n: 'libpcap', d: 2 },
  { n: 'libsmi', d: 2 },
  { n: 'c-ares', d: 2 },
  { n: 'qt5-qtbase', d: 1 },
  { n: 'qt5-qtbase-common', d: 2 },
  { n: 'qt5-qtbase-gui', d: 1 },
  { n: 'qt5-qtmultimedia', d: 1 }
];

export default function RpmVsDnf() {
  const tl = useL();
  const [rpm, setRpm] = useState(false);
  const [dnf, setDnf] = useState(0);
  const runDnf = () => {
    setDnf(0);
    TREE.forEach((_, k) => setTimeout(() => setDnf(k + 1), 250 * (k + 1)));
  };
  return (
    <AnimCard title={tl(RPMDNF.title)}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <button className="btn-ghost btn-sm mb-2 font-mono" onClick={() => setRpm(true)}>
            ▶ rpm -ivh wireshark-3.4.10-7.el9.x86_64.rpm
          </button>
          <div className="term min-h-[170px] rounded-xl bg-[#0b1020] p-3 text-[12px]">
            <AnimatePresence>
              {rpm && (
                <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-rose-300">
                  {`erreur : Dépendances requises :
\tlibQt5Core.so.5()(64bit) est nécessaire pour wireshark-1:3.4.10-7.el9.x86_64
\twireshark-cli = 1:3.4.10-7.el9 est nécessaire pour wireshark-1:3.4.10-7.el9.x86_64
\tlibpcap est nécessaire pour wireshark-1:3.4.10-7.el9.x86_64
\tlibsmi est nécessaire pour wireshark-1:3.4.10-7.el9.x86_64
\tc-ares est nécessaire pour wireshark-1:3.4.10-7.el9.x86_64`}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 text-sm">
            <L v={RPMDNF.rpmTxt} md />
          </div>
        </div>
        <div>
          <button className="btn-ghost btn-sm mb-2 font-mono" onClick={runDnf}>
            ▶ dnf install wireshark
          </button>
          <div className="term min-h-[170px] rounded-xl bg-[#0b1020] p-3 text-[12px] text-slate-200">
            {TREE.slice(0, dnf).map((x) => (
              <motion.div key={x.n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ paddingLeft: x.d * 16 }}>
                <span className="text-slate-500">{x.d ? '└─ ' : ''}</span>
                <span className={x.d ? 'text-cyan-300' : 'text-emerald-300'}>{x.n}</span> <span className="text-emerald-400">✓</span>
              </motion.div>
            ))}
            {dnf === TREE.length && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-emerald-300">Terminé !</motion.div>}
          </div>
          <div className="mt-2 text-sm">
            <L v={RPMDNF.dnfTxt} md />
          </div>
        </div>
      </div>
    </AnimCard>
  );
}
