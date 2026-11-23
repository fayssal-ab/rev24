import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { AnimCard } from '../Stepper';
import { CDB_VIS } from '../../i18n/animOracle';

type Box = 'ROOT' | 'SEED' | 'ORCLPDB' | 'EMSIPDB';
const NAMES: Record<Box, string> = { ROOT: 'CDB$ROOT', SEED: 'PDB$SEED', ORCLPDB: 'ORCLPDB', EMSIPDB: 'EMSIPDB' };

/** Geometry of the diagram (viewBox 0 0 400 250). */
const RECT: Record<Box, [number, number, number, number]> = {
  ROOT: [18, 42, 116, 96],
  SEED: [144, 42, 116, 96],
  ORCLPDB: [270, 42, 112, 96],
  EMSIPDB: [270, 42, 112, 96]
};

interface State {
  at: Box | null;
  emsi: boolean;
  hrOpen: boolean;
  log: { cmd: string; out: string; ok: boolean }[];
}
const START: State = { at: null, emsi: false, hrOpen: false, log: [] };

/**
 * The multitenant container drawn as nested boxes (CDB → ROOT / SEED / PDBs) above the single shared instance.
 * Each course command moves the SYS session or changes the picture, and the console shows the real SQL*Plus answer.
 */
export default function CdbPdbExplorer() {
  const tl = useL();
  const [s, setS] = useState<State>(START);
  const push = (cmd: string, out: string, ok: boolean, patch: Partial<State> = {}) => setS((x) => ({ ...x, ...patch, log: [...x.log.slice(-4), { cmd, out, ok }] }));

  const cmds: { label: string; run: () => void; need?: boolean }[] = [
    { label: 'sqlplus / as sysdba', run: () => push('sqlplus / as sysdba', 'Connecté à :\nOracle Database 19c Enterprise Edition', true, { at: 'ROOT' }) },
    { label: 'SHOW CON_NAME', need: true, run: () => push('SHOW CON_NAME', `CON_NAME\n------------------------------\n${NAMES[s.at!]}`, true) },
    { label: 'SHOW PDBS', need: true, run: () => push('SHOW PDBS', `CON_ID CON_NAME   OPEN MODE\n     2 PDB$SEED   READ ONLY\n     3 ORCLPDB    READ WRITE${s.emsi ? '\n     4 EMSIPDB    MOUNTED' : ''}`, true) },
    { label: 'ALTER SESSION SET CONTAINER=ORCLPDB;', need: true, run: () => push('ALTER SESSION SET CONTAINER=ORCLPDB;', 'Session modifiée.', true, { at: 'ORCLPDB' }) },
    { label: 'ALTER SESSION SET CONTAINER=CDB$ROOT;', need: true, run: () => push('ALTER SESSION SET CONTAINER=CDB$ROOT;', 'Session modifiée.', true, { at: 'ROOT' }) },
    {
      label: 'ALTER USER hr ACCOUNT UNLOCK;',
      need: true,
      run: () => (s.at === 'ORCLPDB' ? push('ALTER USER hr ACCOUNT UNLOCK;', 'Utilisateur modifié.', true, { hrOpen: true }) : push('ALTER USER hr ACCOUNT UNLOCK;', "ORA-01918: l'utilisateur 'HR' n'existe pas", false))
    },
    {
      label: 'CREATE USER etudiant IDENTIFIED BY e;',
      need: true,
      run: () => (s.at === 'ROOT' ? push('CREATE USER etudiant IDENTIFIED BY e;', 'ORA-65096: nom de rôle ou utilisateur commun non valide', false) : push('CREATE USER etudiant IDENTIFIED BY e;', 'Utilisateur créé. (local à ' + NAMES[s.at!] + ')', true))
    },
    {
      label: 'CREATE PLUGGABLE DATABASE emsipdb …',
      need: true,
      run: () =>
        s.at !== 'ROOT'
          ? push('CREATE PLUGGABLE DATABASE emsipdb ADMIN USER a IDENTIFIED BY a;', 'ORA-65040: opération non autorisée à partir d\'une base de données pluggable', false)
          : s.emsi
            ? push('CREATE PLUGGABLE DATABASE emsipdb …', 'ORA-65012: la base de données pluggable EMSIPDB existe déjà', false)
            : push('CREATE PLUGGABLE DATABASE emsipdb ADMIN USER a IDENTIFIED BY a;', 'Base de données pluggable créée. (copie de PDB$SEED)', true, { emsi: true })
    }
  ];

  const boxes: Box[] = s.emsi ? ['ROOT', 'SEED', 'ORCLPDB', 'EMSIPDB'] : ['ROOT', 'SEED', 'ORCLPDB'];
  const rect = (b: Box): [number, number, number, number] => {
    if (!s.emsi || (b !== 'ORCLPDB' && b !== 'EMSIPDB')) return RECT[b];
    return b === 'ORCLPDB' ? [270, 42, 112, 44] : [270, 94, 112, 44];
  };
  const info: Record<Box, typeof CDB_VIS.root> = { ROOT: CDB_VIS.root, SEED: CDB_VIS.seed, ORCLPDB: CDB_VIS.pdb, EMSIPDB: CDB_VIS.newPdb };
  const color: Record<Box, string> = { ROOT: '22 52 96', SEED: '120 130 145', ORCLPDB: '0 141 54', EMSIPDB: '14 124 140' };

  return (
    <AnimCard title={tl(CDB_VIS.title)}>
      <L v={CDB_VIS.hint} md className="mb-3 text-sm text-muted" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 400 250" className="w-full" role="img" aria-label="CDB PDB">
          {/* the container */}
          <rect x={6} y={8} width={388} height={142} rx={14} fill="rgb(var(--surface2))" stroke="rgb(var(--fg))" strokeOpacity={0.35} strokeDasharray="5 4" />
          <text x={18} y={28} fontSize="12" fontWeight={800} fill="rgb(var(--fg))">
            CDB · ORCL
          </text>
          <AnimatePresence>
            {boxes.map((b) => {
              const [x, y, w, hh] = rect(b);
              const here = s.at === b;
              return (
                <motion.g key={b} initial={b === 'EMSIPDB' ? { opacity: 0, x: -126 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <motion.rect animate={{ x, y, width: w, height: hh }} rx={10} fill={`rgb(${color[b]} / ${here ? 0.22 : 0.1})`} stroke={`rgb(${color[b]})`} strokeWidth={here ? 2.4 : 1.2} />
                  <motion.text animate={{ x: x + 8, y: y + 17 }} fontSize="10.5" fontWeight={800} fill={`rgb(${color[b]})`}>
                    {NAMES[b]}
                  </motion.text>
                  {b === 'SEED' && (
                    <g transform={`translate(${x + w - 22} ${y + 6})`}>
                      <rect x={2} y={7} width={12} height={9} rx={2} fill="rgb(120 130 145)" />
                      <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="rgb(120 130 145)" strokeWidth={1.6} />
                    </g>
                  )}
                  {b === 'ORCLPDB' && (
                    <motion.text animate={{ x: x + 8, y: y + 31 }} fontSize="9" fontWeight={700} fill={s.hrOpen ? 'rgb(var(--ok))' : 'rgb(var(--bad))'}>
                      HR {s.hrOpen ? 'OPEN' : 'LOCKED'}
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
          {/* the session dot */}
          {s.at && (
            <motion.g initial={false} animate={rect(s.at)[3] < 60 ? { x: rect(s.at)[0] + rect(s.at)[2] - 17, y: rect(s.at)[1] + rect(s.at)[3] / 2 } : { x: rect(s.at)[0] + rect(s.at)[2] / 2, y: rect(s.at)[1] + rect(s.at)[3] - 22 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }}>
              <circle r={15} fill="rgb(var(--accent))" opacity={0.18}>
                <animate attributeName="r" values="13;19;13" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle r={12} fill="rgb(var(--accent))" />
              <text y={3.5} textAnchor="middle" fontSize="9" fontWeight={800} fill="white">
                SYS
              </text>
            </motion.g>
          )}
          {/* shared instance */}
          <path d="M200 150 L200 166" stroke="rgb(var(--fg))" strokeOpacity={0.35} strokeWidth={1.5} />
          <rect x={6} y={166} width={388} height={40} rx={10} fill="rgb(22 52 96 / 0.9)" />
          <text x={200} y={183} textAnchor="middle" fontSize="11" fontWeight={800} fill="white">
            INSTANCE · SGA + PMON SMON DBWn LGWR CKPT
          </text>
          <text x={200} y={198} textAnchor="middle" fontSize="8.5" fill="white" opacity={0.8}>
            {tl(CDB_VIS.sharedShort)}
          </text>
          {/* files */}
          {['control files', 'redo logs', 'datafiles ×n'].map((f, k) => (
            <g key={f} transform={`translate(${40 + k * 120} 216)`}>
              <path d="M0 4 Q0 0 40 0 Q80 0 80 4 L80 26 Q80 30 40 30 Q0 30 0 26 Z" fill="rgb(var(--surface))" stroke="rgb(var(--line))" />
              <ellipse cx={40} cy={4} rx={40} ry={4} fill="rgb(var(--surface2))" stroke="rgb(var(--line))" />
              <text x={40} y={21} textAnchor="middle" fontSize="9" fontWeight={700} fill="rgb(var(--fg))">
                {f}
              </text>
            </g>
          ))}
        </svg>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {cmds.map((c) => (
              <button key={c.label} disabled={c.need && !s.at} onClick={c.run} className="rounded-lg border border-line bg-surface px-2 py-1 font-mono text-[11px] font-semibold transition hover:border-accent hover:text-accent disabled:opacity-40">
                {c.label}
              </button>
            ))}
            <button onClick={() => setS(START)} className="btn-ghost btn-sm">
              <Icon name="reset" size={14} /> {tl(CDB_VIS.reset)}
            </button>
          </div>
          <div className="min-h-[180px] rounded-xl bg-[#0b1020] p-3 font-mono text-[11.5px] leading-relaxed text-slate-200" aria-label={tl(CDB_VIS.console)}>
            {s.log.length === 0 && <span className="text-slate-500">C:\&gt; _</span>}
            {s.log.map((l, k) => (
              <motion.div key={k + l.cmd} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mb-1.5">
                <div className="text-emerald-300">SQL&gt; {l.cmd}</div>
                <pre className={`whitespace-pre-wrap ${l.ok ? 'text-slate-200' : 'text-rose-300'}`}>{l.out}</pre>
              </motion.div>
            ))}
          </div>
          {s.at && <L v={info[s.at]} md className="rounded-lg bg-surface2 px-3 py-2 text-sm" />}
          <L v={CDB_VIS.shared} md className="text-xs text-muted" />
          <L v={CDB_VIS.files} md className="text-xs text-muted" />
        </div>
      </div>
    </AnimCard>
  );
}
